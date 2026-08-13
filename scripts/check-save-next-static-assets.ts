import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";

const DEFAULT_ASSETS_DIR = ".open-next/assets/_next/static";
const DEFAULT_SNAPSHOT = join(
	tmpdir(),
	`next-static-assets-snapshot-${process.pid}-${Date.now()}.json`,
);
const DEFAULT_WRANGLER_CONFIG = "wrangler.jsonc";
const DEFAULT_WRANGLER_BIN = "wrangler";
const DEFAULT_ASSET_FALLBACK_ORIGIN = "https://kotobad.com";
const DEFAULT_MODE = "check-and-save";
const SUPPORTED_MODES = new Set([DEFAULT_MODE, "prepare", "commit"]);

const assetsDir = process.env.ASSETS_DIR ?? DEFAULT_ASSETS_DIR;
const snapshotFile = process.env.SNAPSHOT_FILE ?? DEFAULT_SNAPSHOT;
const shouldCleanupSnapshot = !process.env.SNAPSHOT_FILE;
const candidateSnapshotFile = process.env.CANDIDATE_SNAPSHOT_FILE;
const mode = process.argv[2] ?? DEFAULT_MODE;

const r2SnapshotBucket = process.env.R2_SNAPSHOT_BUCKET;
const r2Key = process.env.R2_KEY;
if (!r2SnapshotBucket || !r2Key) {
	console.error("R2_SNAPSHOT_BUCKET and R2_KEY are required.");
	process.exit(1);
}
const allowMissingR2Snapshot = process.env.ALLOW_MISSING_R2_SNAPSHOT === "true";
const wranglerConfig = process.env.WRANGLER_CONFIG ?? DEFAULT_WRANGLER_CONFIG;
const wranglerBin = process.env.WRANGLER_BIN ?? DEFAULT_WRANGLER_BIN;
const assetFallbackOrigin =
	process.env.ASSET_FALLBACK_ORIGIN ??
	process.env.NEXT_PUBLIC_FRONTEND_URL ??
	DEFAULT_ASSET_FALLBACK_ORIGIN;

const refRegex = /\/_next\/static\/[^\s"'<>]+/g;
const TRAILING_REF_CHARS = new Set([")", "]", "}", ",", ";"]);

const normalizeAssetRef = (ref: string) => {
	let normalized = ref.trim();
	while (normalized.length > 0) {
		const lastChar = normalized.at(-1);
		if (!lastChar || !TRAILING_REF_CHARS.has(lastChar)) {
			break;
		}
		normalized = normalized.slice(0, -1);
	}
	return normalized;
};

const getAssetPathname = (ref: string) => {
	try {
		const url = new URL(normalizeAssetRef(ref), "https://assets.invalid");
		const pathname = decodeURIComponent(url.pathname);
		if (!pathname.startsWith("/_next/static/")) return null;
		if (pathname.includes("\\")) return null;
		if (pathname.split("/").some((segment) => segment === "..")) return null;
		return pathname;
	} catch {
		return null;
	}
};

const isAssetRef = (ref: string) => {
	const pathname = getAssetPathname(ref);
	if (!pathname || pathname.endsWith("/")) return false;
	const last = pathname.split("/").pop() ?? "";
	return last.includes(".");
};

type Snapshot = {
	createdAt: string;
	assetsDir: string;
	refs: string[];
};

const isTextAsset = (path: string) =>
	path.endsWith(".css") || path.endsWith(".js");

// 指定ディレクトリ配下のファイルを、配列にして返す
const walk = async (dir: string): Promise<string[]> => {
	const entries = await readdir(dir, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)));
		} else if (entry.isFile()) {
			files.push(fullPath);
		}
	}
	return files;
};

// ファイルを読み込んで、そのファイル内で、正規表現(assetのパスが存在するか)でフィルター

// match =  [
//    ["/_next/static/media/abc123.woff2", index: 74, ...],
//    ["/_next/static/chunks/app/page-xyz.js", index: 170, ...]
// ]
const collectRefs = async () => {
	const files = await walk(assetsDir);
	const refs = new Set<string>();
	for (const file of files) {
		if (!isTextAsset(file)) continue;
		const content = await readFile(file, "utf8");
		for (const match of content.matchAll(refRegex)) {
			const pathname = getAssetPathname(match[0]);
			if (!pathname || !isAssetRef(pathname)) continue;
			refs.add(pathname);
		}
	}
	return Array.from(refs).sort();
};

const parseSnapshot = (value: unknown): Snapshot => {
	if (!value || typeof value !== "object") {
		throw new Error("Invalid snapshot: expected an object");
	}
	const snapshot = value as Record<string, unknown>;
	if (
		typeof snapshot.createdAt !== "string" ||
		typeof snapshot.assetsDir !== "string" ||
		!Array.isArray(snapshot.refs) ||
		!snapshot.refs.every((ref) => typeof ref === "string")
	) {
		throw new Error("Invalid snapshot: required fields are malformed");
	}

	return {
		assetsDir: snapshot.assetsDir,
		createdAt: snapshot.createdAt,
		refs: snapshot.refs,
	};
};

const normalizeSnapshotRefs = (refs: string[]) =>
	refs.map((ref) => {
		const pathname = getAssetPathname(ref);
		if (!pathname || !isAssetRef(pathname)) {
			throw new Error(`Invalid snapshot asset reference: ${ref}`);
		}
		return pathname;
	});

const loadSnapshot = async (path = snapshotFile): Promise<Snapshot | null> => {
	try {
		const json = await readFile(path, "utf8");
		return parseSnapshot(JSON.parse(json));
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			return null;
		}
		throw error;
	}
};

const saveSnapshot = async (refs: string[], path = snapshotFile) => {
	const snapshot: Snapshot = {
		createdAt: new Date().toISOString(),
		assetsDir,
		refs,
	};
	await Bun.write(path, JSON.stringify(snapshot, null, 2));
	console.log(`Saved snapshot: ${path}`);
};

const cleanupSnapshot = async () => {
	if (!shouldCleanupSnapshot) return;
	await rm(snapshotFile, { force: true });
};

const toDiskPath = (ref: string) => {
	const pathname = getAssetPathname(ref);
	if (!pathname || !isAssetRef(pathname)) {
		throw new Error(`Invalid static asset reference: ${ref}`);
	}
	return join(assetsDir, pathname.replace("/_next/static/", ""));
};

const exists = async (path: string) => {
	try {
		await stat(path);
		return true;
	} catch {
		return false;
	}
};

const runWrangler = async (args: string[]) => {
	return new Promise<void>((resolve, reject) => {
		const child = spawn(wranglerBin, args, {
			stdio: "inherit",
		});
		child.once("error", reject);
		child.once("close", (code) => {
			if (code === 0) return resolve();
			reject(new Error(`wrangler failed: ${wranglerBin} ${args.join(" ")}`));
		});
	});
};

const restoreMissingAsset = async (ref: string) => {
	const normalizedRef = normalizeAssetRef(ref);
	const url = new URL(normalizedRef, assetFallbackOrigin);
	const path = toDiskPath(normalizedRef);
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`asset fetch failed: ${response.status} ${url.toString()}`);
	}

	const bytes = new Uint8Array(await response.arrayBuffer());
	await mkdir(dirname(path), { recursive: true });
	await Bun.write(path, bytes);
	console.log(`Recovered missing asset: ${normalizedRef}`);
};

const fetchSnapshotFromR2 = async () => {
	try {
		await mkdir(dirname(snapshotFile), { recursive: true });
		await runWrangler([
			"r2",
			"object",
			"get",
			`${r2SnapshotBucket}/${r2Key}`,
			"--remote",
			"--file",
			snapshotFile,
			"--config",
			wranglerConfig,
		]);
	} catch (error) {
		if (!allowMissingR2Snapshot) throw error;
		await rm(snapshotFile, { force: true });
		console.warn(
			"R2 snapshot could not be loaded. ALLOW_MISSING_R2_SNAPSHOT=true was set, so a new baseline will be created.",
		);
	}
};

const saveSnapshotToR2 = async (path = snapshotFile) => {
	await runWrangler([
		"r2",
		"object",
		"put",
		`${r2SnapshotBucket}/${r2Key}`,
		"--remote",
		"--file",
		path,
		"--config",
		wranglerConfig,
	]);
};

const main = async () => {
	try {
		if (!SUPPORTED_MODES.has(mode)) {
			throw new Error(
				`Unsupported mode: ${mode}. Expected ${Array.from(SUPPORTED_MODES).join(", ")}.`,
			);
		}

		if (mode === "commit") {
			if (!candidateSnapshotFile) {
				throw new Error("CANDIDATE_SNAPSHOT_FILE is required in commit mode.");
			}
			const candidate = await loadSnapshot(candidateSnapshotFile);
			if (!candidate) {
				throw new Error(
					`Candidate snapshot not found: ${candidateSnapshotFile}`,
				);
			}
			normalizeSnapshotRefs(candidate.refs);
			await saveSnapshotToR2(candidateSnapshotFile);
			console.log(`Committed deploy snapshot: ${candidateSnapshotFile}`);
			return;
		}

		if (mode === "prepare" && !candidateSnapshotFile) {
			throw new Error("CANDIDATE_SNAPSHOT_FILE is required in prepare mode.");
		}

		const currentRefs = await collectRefs();

		await fetchSnapshotFromR2();
		const snapshot = await loadSnapshot();
		if (!snapshot && !allowMissingR2Snapshot) {
			throw new Error(
				"R2 snapshot was not downloaded. Set ALLOW_MISSING_R2_SNAPSHOT=true only when creating the initial baseline.",
			);
		}
		if (!snapshot) {
			console.warn(
				`Snapshot not found: ${snapshotFile}. Creating a new baseline.`,
			);
		}

		const previousRefs = normalizeSnapshotRefs(snapshot?.refs ?? []);
		const refsToCheck = Array.from(
			new Set([...previousRefs, ...currentRefs]),
		).sort();

		const missing: string[] = [];
		for (const ref of refsToCheck) {
			const path = toDiskPath(ref);
			if (!(await exists(path))) {
				missing.push(ref);
			}
		}

		for (const ref of missing) {
			try {
				await restoreMissingAsset(ref);
			} catch (error) {
				console.warn(
					error instanceof Error ? error.message : `asset fetch failed: ${ref}`,
				);
			}
		}

		const unresolvedMissing: string[] = [];
		for (const ref of refsToCheck) {
			const path = toDiskPath(ref);
			if (!(await exists(path))) {
				unresolvedMissing.push(ref);
			}
		}

		if (unresolvedMissing.length > 0) {
			console.error("アセットが削除されました。404になる可能性があります。");
			for (const ref of unresolvedMissing) {
				console.error(
					`- ${ref} -> ${relative(process.cwd(), toDiskPath(ref))}`,
				);
			}
			throw new Error("Missing assets detected");
		}

		if (mode === "prepare" && candidateSnapshotFile) {
			await saveSnapshot(currentRefs, candidateSnapshotFile);
			console.log(
				`Prepared deploy snapshot with ${refsToCheck.length} protected refs`,
			);
			return;
		}

		await saveSnapshot(currentRefs);
		await saveSnapshotToR2();
		console.log(`OK: ${refsToCheck.length} refs checked`);
	} finally {
		await cleanupSnapshot();
	}
};

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
