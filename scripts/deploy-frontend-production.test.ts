import { describe, expect, test } from "bun:test";
import { chmod, mkdir, mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";

const deployScript = join(import.meta.dir, "deploy-frontend-production.ts");
const frontendDir = join(import.meta.dir, "..", "packages", "frontend");

const startFallbackServer = async (status: number) => {
	const server = createServer((request, response) => {
		if (
			status === 200 &&
			request.url === "/_next/static/media/previous.woff2"
		) {
			response.writeHead(200);
			response.end("previous-font");
			return;
		}
		response.writeHead(status);
		response.end("Not Found");
	});
	await new Promise<void>((resolve, reject) => {
		server.once("error", reject);
		server.listen(0, "127.0.0.1", resolve);
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

type DeployFixture = {
	assetsDir: string;
	buildBin: string;
	commandLog: string;
	deployBin: string;
	r2Source: string;
	r2Upload: string;
	temporaryDir: string;
	transactionParent: string;
	wranglerBin: string;
};

const createDeployFixture = async (): Promise<DeployFixture> => {
	const temporaryDir = await mkdtemp(
		join(tmpdir(), "kotobad-production-deploy-test-"),
	);
	const assetsDir = join(temporaryDir, "assets");
	const buildBin = join(temporaryDir, "fake-build");
	const commandLog = join(temporaryDir, "commands.log");
	const deployBin = join(temporaryDir, "fake-opennext-deploy");
	const r2Source = join(temporaryDir, "r2-source.json");
	const r2Upload = join(temporaryDir, "r2-upload.json");
	const transactionParent = join(temporaryDir, "transactions");
	const wranglerBin = join(temporaryDir, "fake-wrangler");

	await mkdir(transactionParent, { recursive: true });
	await Bun.write(
		join(assetsDir, "css", "app.css"),
		"@font-face { src: url(/_next/static/media/current.woff2); }",
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
		buildBin,
		`#!/bin/sh
printf '%s\n' "build:$*" >> "$DEPLOY_TEST_LOG"
exit "\${DEPLOY_TEST_BUILD_EXIT:-0}"
`,
	);
	await Bun.write(
		deployBin,
		`#!/bin/sh
if [ ! -f "$ASSETS_DIR/media/previous.woff2" ]; then
	printf '%s\n' "deploy:restored-asset-missing" >> "$DEPLOY_TEST_LOG"
	exit 66
fi
if [ -e "$ASSET_GUARD_TEST_R2_UPLOAD" ]; then
	printf '%s\n' "deploy:snapshot-committed-too-early" >> "$DEPLOY_TEST_LOG"
	exit 67
fi
printf '%s\n' "deploy:$*" >> "$DEPLOY_TEST_LOG"
if [ "\${DEPLOY_TEST_WAIT_FOR_SIGNAL:-false}" = "true" ]; then
	trap 'printf "%s\\n" "deploy:SIGTERM" >> "$DEPLOY_TEST_LOG"; exit 143' TERM
	while :; do sleep 1; done
fi
exit "\${DEPLOY_TEST_DEPLOY_EXIT:-0}"
`,
	);
	await Bun.write(
		wranglerBin,
		`#!/bin/sh
operation="$3"
snapshot_file=""
while [ "$#" -gt 0 ]; do
	if [ "$1" = "--file" ]; then
		shift
		snapshot_file="$1"
	fi
	shift
done
printf '%s\n' "$operation" >> "$DEPLOY_TEST_LOG"
if [ "$operation" = "get" ]; then
	cp "$ASSET_GUARD_TEST_R2_SOURCE" "$snapshot_file" || exit 74
	exit 0
fi
if [ "$operation" = "put" ]; then
	if [ "\${DEPLOY_TEST_PUT_EXIT:-0}" -ne 0 ]; then
		exit "$DEPLOY_TEST_PUT_EXIT"
	fi
	cp "$snapshot_file" "$ASSET_GUARD_TEST_R2_UPLOAD" || exit 74
	exit 0
fi
exit 64
`,
	);
	await Promise.all(
		[buildBin, deployBin, wranglerBin].map((path) => chmod(path, 0o755)),
	);

	return {
		assetsDir,
		buildBin,
		commandLog,
		deployBin,
		r2Source,
		r2Upload,
		temporaryDir,
		transactionParent,
		wranglerBin,
	};
};

type RunDeployOptions = {
	buildExitCode?: number;
	deployExitCode?: number;
	putExitCode?: number;
	throughPackageScript?: boolean;
	waitForSignal?: boolean;
};

const spawnDeploy = (
	fixture: DeployFixture,
	fallbackOrigin: string,
	options: RunDeployOptions = {},
) => {
	const command = options.throughPackageScript
		? [process.execPath, "run", "deploy"]
		: [process.execPath, deployScript];
	return Bun.spawn(command, {
		cwd: options.throughPackageScript ? frontendDir : undefined,
		env: {
			...process.env,
			ASSETS_DIR: fixture.assetsDir,
			ASSET_FALLBACK_ORIGIN: fallbackOrigin,
			ASSET_GUARD_TEST_R2_SOURCE: fixture.r2Source,
			ASSET_GUARD_TEST_R2_UPLOAD: fixture.r2Upload,
			DEPLOY_TEST_BUILD_EXIT: String(options.buildExitCode ?? 0),
			DEPLOY_TEST_DEPLOY_EXIT: String(options.deployExitCode ?? 0),
			DEPLOY_TEST_LOG: fixture.commandLog,
			DEPLOY_TEST_PUT_EXIT: String(options.putExitCode ?? 0),
			DEPLOY_TEST_WAIT_FOR_SIGNAL: options.waitForSignal ? "true" : "false",
			KOTOBAD_DEPLOY_BUILD_BIN: fixture.buildBin,
			KOTOBAD_DEPLOY_OPENNEXT_BIN: fixture.deployBin,
			KOTOBAD_DEPLOY_TEMP_PARENT: fixture.transactionParent,
			R2_KEY: "ops/next-static-assets-snapshot.json",
			R2_SNAPSHOT_BUCKET: "test-snapshot-bucket",
			WRANGLER_BIN: fixture.wranglerBin,
			WRANGLER_CONFIG: "test-wrangler.jsonc",
		},
		stderr: "pipe",
		stdout: "pipe",
	});
};

const waitForDeploy = async (child: ReturnType<typeof spawnDeploy>) => {
	const [exitCode, stdout, stderr] = await Promise.all([
		child.exited,
		new Response(child.stdout).text(),
		new Response(child.stderr).text(),
	]);
	return { exitCode, stderr, stdout };
};

const readCommands = async (fixture: DeployFixture) => {
	if (!(await Bun.file(fixture.commandLog).exists())) return [];
	return (await readFile(fixture.commandLog, "utf8"))
		.trim()
		.split("\n")
		.filter(Boolean);
};

const expectTransactionsCleaned = async (fixture: DeployFixture) => {
	expect(await readdir(fixture.transactionParent)).toEqual([]);
};

const cleanupFixture = async (
	fixture: DeployFixture,
	server: Awaited<ReturnType<typeof startFallbackServer>>,
) => {
	await server.close();
	await rm(fixture.temporaryDir, { force: true, recursive: true });
};

describe("Frontend production deploy", () => {
	test("build・検査・deployの成功後にsnapshotを確定する", async () => {
		const server = await startFallbackServer(200);
		const fixture = await createDeployFixture();

		try {
			const result = await waitForDeploy(
				spawnDeploy(fixture, server.origin, { throughPackageScript: true }),
			);
			const uploadedSnapshot = JSON.parse(
				await readFile(fixture.r2Upload, "utf8"),
			) as { refs: string[] };

			expect(result.exitCode).toBe(0);
			expect(await readCommands(fixture)).toEqual([
				"build:run cf:build",
				"get",
				"deploy:deploy --env production",
				"put",
			]);
			expect(uploadedSnapshot.refs).toEqual([
				"/_next/static/media/current.woff2",
			]);
			await expectTransactionsCleaned(fixture);
		} finally {
			await cleanupFixture(fixture, server);
		}
	});

	test("build失敗時は検査・deploy・snapshot確定へ進まない", async () => {
		const server = await startFallbackServer(200);
		const fixture = await createDeployFixture();

		try {
			const result = await waitForDeploy(
				spawnDeploy(fixture, server.origin, { buildExitCode: 11 }),
			);

			expect(result.exitCode).not.toBe(0);
			expect(await readCommands(fixture)).toEqual(["build:run cf:build"]);
			expect(await Bun.file(fixture.r2Upload).exists()).toBe(false);
			await expectTransactionsCleaned(fixture);
		} finally {
			await cleanupFixture(fixture, server);
		}
	});

	test("asset復旧失敗時はdeployとsnapshot確定へ進まない", async () => {
		const server = await startFallbackServer(404);
		const fixture = await createDeployFixture();

		try {
			const result = await waitForDeploy(spawnDeploy(fixture, server.origin));

			expect(result.exitCode).not.toBe(0);
			expect(await readCommands(fixture)).toEqual([
				"build:run cf:build",
				"get",
			]);
			expect(await Bun.file(fixture.r2Upload).exists()).toBe(false);
			await expectTransactionsCleaned(fixture);
		} finally {
			await cleanupFixture(fixture, server);
		}
	});

	test("deploy失敗時はsnapshotを確定しない", async () => {
		const server = await startFallbackServer(200);
		const fixture = await createDeployFixture();

		try {
			const result = await waitForDeploy(
				spawnDeploy(fixture, server.origin, { deployExitCode: 23 }),
			);

			expect(result.exitCode).not.toBe(0);
			expect(await readCommands(fixture)).toEqual([
				"build:run cf:build",
				"get",
				"deploy:deploy --env production",
			]);
			expect(await Bun.file(fixture.r2Upload).exists()).toBe(false);
			await expectTransactionsCleaned(fixture);
		} finally {
			await cleanupFixture(fixture, server);
		}
	});

	test("deploy後のsnapshot確定失敗を非0終了で通知する", async () => {
		const server = await startFallbackServer(200);
		const fixture = await createDeployFixture();

		try {
			const result = await waitForDeploy(
				spawnDeploy(fixture, server.origin, { putExitCode: 24 }),
			);

			expect(result.exitCode).not.toBe(0);
			expect(await readCommands(fixture)).toEqual([
				"build:run cf:build",
				"get",
				"deploy:deploy --env production",
				"put",
			]);
			expect(await Bun.file(fixture.r2Upload).exists()).toBe(false);
			await expectTransactionsCleaned(fixture);
		} finally {
			await cleanupFixture(fixture, server);
		}
	});

	test("SIGTERMを子processへ転送しsnapshotを確定せず終了する", async () => {
		const server = await startFallbackServer(200);
		const fixture = await createDeployFixture();
		const child = spawnDeploy(fixture, server.origin, { waitForSignal: true });

		try {
			const deadline = Date.now() + 5_000;
			while (
				!(await readCommands(fixture)).some((line) =>
					line.startsWith("deploy:"),
				)
			) {
				if (Date.now() >= deadline) {
					throw new Error("fake deployの開始を5秒以内に確認できませんでした");
				}
				await Bun.sleep(20);
			}
			child.kill("SIGTERM");
			const result = await waitForDeploy(child);

			expect(result.exitCode).not.toBe(0);
			expect(await readCommands(fixture)).toEqual([
				"build:run cf:build",
				"get",
				"deploy:deploy --env production",
				"deploy:SIGTERM",
			]);
			expect(await Bun.file(fixture.r2Upload).exists()).toBe(false);
			await expectTransactionsCleaned(fixture);
		} finally {
			if (child.exitCode === null) child.kill("SIGKILL");
			await cleanupFixture(fixture, server);
		}
	});
});
