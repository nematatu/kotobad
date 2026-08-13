import { describe, expect, test } from "bun:test";
import { chmod, mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";

const guardScript = join(import.meta.dir, "check-save-next-static-assets.ts");

const startFallbackServer = async (status: number, body: string) => {
	const server = createServer((_, response) => {
		response.writeHead(status);
		response.end(body);
	});
	await new Promise<void>((resolve, reject) => {
		server.once("error", reject);
		server.listen(0, "127.0.0.1", () => resolve());
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		server.close();
		throw new Error("テスト用HTTP serverのportを取得できませんでした");
	}

	return {
		close: () =>
			new Promise<void>((resolve, reject) => {
				server.close((error) => (error ? reject(error) : resolve()));
			}),
		origin: `http://127.0.0.1:${address.port}`,
	};
};

type GuardFixture = {
	assetsDir: string;
	commandLog: string;
	fallbackOrigin: string;
	r2Source: string;
	r2Upload: string;
	snapshotFile: string;
	temporaryDir: string;
	wranglerBin: string;
};

const createGuardFixture = async (
	fallbackOrigin: string,
): Promise<GuardFixture> => {
	const temporaryDir = await mkdtemp(
		join(tmpdir(), "kotobad-asset-guard-test-"),
	);
	const assetsDir = join(temporaryDir, "assets");
	const commandLog = join(temporaryDir, "wrangler.log");
	const r2Source = join(temporaryDir, "r2-source.json");
	const r2Upload = join(temporaryDir, "r2-upload.json");
	const snapshotFile = join(temporaryDir, "snapshot.json");
	const wranglerBin = join(temporaryDir, "fake-wrangler");

	await Bun.write(
		join(assetsDir, "chunks", "app.js"),
		'const font = "/_next/static/media/current.woff2";',
	);
	await Bun.write(join(assetsDir, "media", "current.woff2"), "current-font");
	await Bun.write(
		r2Source,
		JSON.stringify({
			assetsDir: "previous-build",
			createdAt: "2026-08-12T00:00:00.000Z",
			refs: ["/_next/static/media/previous.woff2"],
		}),
	);
	await Bun.write(
		wranglerBin,
		`#!/bin/sh
operation="$3"
original_args="$*"
snapshot_file=""
while [ "$#" -gt 0 ]; do
	if [ "$1" = "--file" ]; then
		shift
		snapshot_file="$1"
	fi
	shift
done
printf '%s\n' "$operation:$original_args" >> "$ASSET_GUARD_TEST_LOG"
if [ "$operation" = "get" ]; then
	cp "$ASSET_GUARD_TEST_R2_SOURCE" "$snapshot_file"
	exit 0
fi
if [ "$operation" = "put" ]; then
	cp "$snapshot_file" "$ASSET_GUARD_TEST_R2_UPLOAD"
	exit 0
fi
exit 64
`,
	);
	await chmod(wranglerBin, 0o755);

	return {
		assetsDir,
		commandLog,
		fallbackOrigin,
		r2Source,
		r2Upload,
		snapshotFile,
		temporaryDir,
		wranglerBin,
	};
};

const runGuard = async (fixture: GuardFixture) => {
	const child = Bun.spawn([process.execPath, guardScript], {
		env: {
			...process.env,
			ASSETS_DIR: fixture.assetsDir,
			ASSET_FALLBACK_ORIGIN: fixture.fallbackOrigin,
			ASSET_GUARD_TEST_LOG: fixture.commandLog,
			ASSET_GUARD_TEST_R2_SOURCE: fixture.r2Source,
			ASSET_GUARD_TEST_R2_UPLOAD: fixture.r2Upload,
			R2_KEY: "ops/next-static-assets-snapshot.json",
			R2_SNAPSHOT_BUCKET: "test-snapshot-bucket",
			SNAPSHOT_FILE: fixture.snapshotFile,
			WRANGLER_BIN: fixture.wranglerBin,
			WRANGLER_CONFIG: "test-wrangler.jsonc",
		},
		stderr: "pipe",
		stdout: "pipe",
	});

	const [exitCode, stdout, stderr] = await Promise.all([
		child.exited,
		new Response(child.stdout).text(),
		new Response(child.stderr).text(),
	]);
	const wranglerOperations = (await readFile(fixture.commandLog, "utf8"))
		.trim()
		.split("\n")
		.filter(Boolean)
		.map((line) => line.split(":", 1)[0]);

	return { exitCode, stderr, stdout, wranglerOperations };
};

describe("Next.js static asset guard", () => {
	test("前回参照された欠落assetをfallbackから復旧してsnapshotを更新する", async () => {
		const server = await startFallbackServer(200, "previous-font");
		const fixture = await createGuardFixture(server.origin);

		try {
			const result = await runGuard(fixture);
			const uploadedSnapshot = JSON.parse(
				await readFile(fixture.r2Upload, "utf8"),
			) as { refs: string[] };

			expect(result.exitCode).toBe(0);
			expect(result.wranglerOperations).toEqual(["get", "put"]);
			expect(
				await readFile(
					join(fixture.assetsDir, "media", "previous.woff2"),
					"utf8",
				),
			).toBe("previous-font");
			expect(uploadedSnapshot.refs).toEqual([
				"/_next/static/media/current.woff2",
			]);
		} finally {
			await server.close();
			await rm(fixture.temporaryDir, { force: true, recursive: true });
		}
	});

	test("欠落assetを復旧できない場合はsnapshotを更新せず失敗する", async () => {
		const server = await startFallbackServer(404, "Not Found");
		const fixture = await createGuardFixture(server.origin);

		try {
			const result = await runGuard(fixture);

			expect(result.exitCode).not.toBe(0);
			expect(result.wranglerOperations).toEqual(["get"]);
			expect(result.stderr).toContain("Missing assets detected");
			expect(await Bun.file(fixture.r2Upload).exists()).toBe(false);
		} finally {
			await server.close();
			await rm(fixture.temporaryDir, { force: true, recursive: true });
		}
	});
});
