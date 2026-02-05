import { readdir, readFile, stat, mkdir, rm } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";

const DEFAULT_ASSETS_DIR =
	".open-next/assets/_next/static";
const DEFAULT_SNAPSHOT = join(
	tmpdir(),
	`next-static-assets-snapshot-${process.pid}-${Date.now()}.json`,
);
const DEFAULT_WRANGLER_CONFIG = "wrangler.jsonc";
const DEFAULT_WRANGLER_BIN = "wrangler";

const assetsDir = process.env.ASSETS_DIR ?? DEFAULT_ASSETS_DIR;
const snapshotFile = process.env.SNAPSHOT_FILE ?? DEFAULT_SNAPSHOT;
const shouldCleanupSnapshot = !process.env.SNAPSHOT_FILE;

const r2SnapshotBucket = process.env.R2_SNAPSHOT_BUCKET;
const r2Key = process.env.R2_KEY;
if (!r2SnapshotBucket || !r2Key) {
	console.error("R2_BUCKET and R2_KEY are required.");
	process.exit(1);
}
const wranglerConfig =
	process.env.WRANGLER_CONFIG ?? DEFAULT_WRANGLER_CONFIG;
const wranglerBin = process.env.WRANGLER_BIN ?? DEFAULT_WRANGLER_BIN;

const refRegex = /\/_next\/static\/[^\s"'<>]+/g;
const isAssetRef = (ref: string) => {
	if (ref.endsWith("/")) return false;
	const last = ref.split("/").pop() ?? "";
	const q = last.indexOf("?");
	const clean = q === -1 ? last : last.slice(0, q);
	return clean.includes(".");
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
			const ref = match[0];
			if (!isAssetRef(ref)) continue;
			refs.add(ref);
		}
	}
	return Array.from(refs).sort();
};

const loadSnapshot = async (): Promise<Snapshot | null> => {
	try {
		const json = await readFile(snapshotFile, "utf8");
		return JSON.parse(json) as Snapshot;
	} catch {
		return null;
	}
};

const saveSnapshot = async (refs: string[]) => {
	const snapshot: Snapshot = {
		createdAt: new Date().toISOString(),
		assetsDir,
		refs,
	};
	await Bun.write(snapshotFile, JSON.stringify(snapshot, null, 2));
	console.log(`Saved snapshot: ${snapshotFile}`);
};

const cleanupSnapshot = async () => {
	if (!shouldCleanupSnapshot) return;
	await rm(snapshotFile, { force: true });
};


const toDiskPath = (ref: string) =>
	join(assetsDir, ref.replace("/_next/static/", ""));

const exists = async (path: string) => {
	try {
		await stat(path);
		return true;
	} catch {
		return false;
	}
};

const runWrangler = async (args: string[], allowFail = false) => {
	await mkdir(dirname(snapshotFile), { recursive: true });
	return new Promise<void>((resolve, reject) => {
		const child = spawn(wranglerBin, args, {
			stdio: "inherit",
		});
		child.on("close", (code) => {
			if (code === 0) return resolve();
			if (allowFail) return resolve();
			reject(new Error(`wrangler failed: ${wranglerBin} ${args.join(" ")}`));
		});
	});
};

const fetchSnapshotFromR2 = async () => {
	await runWrangler(
		[
			"r2",
			"object",
			"get",
			`${r2SnapshotBucket}/${r2Key}`,
			"--remote",
			"--file",
			snapshotFile,
			"--config",
			wranglerConfig,
		],
		true,
	);
};


const saveSnapshotToR2 = async () => {
	await runWrangler([
		"r2",
		"object",
		"put",
		`${r2SnapshotBucket}/${r2Key}`,
		"--remote",
		"--file",
		snapshotFile,
		"--config",
		wranglerConfig,
	]);
};

const main = async () => {
	try {
		const currentRefs = await collectRefs();

		await fetchSnapshotFromR2();
	const snapshot = await loadSnapshot();
	if (!snapshot) {
		console.warn(
			`Snapshot not found: ${snapshotFile}. Creating a new baseline.`,
		);
		await saveSnapshot(currentRefs);
		await saveSnapshotToR2();
		console.log(`Saved ${currentRefs.length} refs`);
		return;
	}

  // R2からロードしたスナップショットに保存されていたrefs
	const refsToCheck = snapshot.refs.filter(isAssetRef);

	const missing: string[] = [];
	for (const ref of refsToCheck) {
		const path = toDiskPath(ref);

    // 前のスナップショットに保存されていたrefの存在を確認
    // 存在しなければ、missing配列に追加
		if (!(await exists(path))) {
			missing.push(ref);
		}
	}

  // missingが存在する
  // すなわち、前回のビルド時に参照していたassetsが、今のディレクトリに見つからなかった！
  // → 今回の変更で、削除したということ。
  // → 配信された(各端末にキャッシュされた)ファイルでは、そのassetを参照しているはず。
  // → 今の状態だと、404になり、無駄ループ的に、存在しないファイルを参照しようとしてしまう。

	if (missing.length > 0) {
		console.error("アセットが削除されました。404になる可能性があります。");
		for (const ref of missing) {
			console.error(`- ${ref} -> ${relative(process.cwd(), toDiskPath(ref))}`);
		}
		throw new Error("Missing assets detected");
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
