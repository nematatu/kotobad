import { type ChildProcess, spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const frontendDir = join(import.meta.dir, "..", "packages", "frontend");
const guardScript = join(import.meta.dir, "check-save-next-static-assets.ts");
const buildBin = process.env.KOTOBAD_DEPLOY_BUILD_BIN ?? process.execPath;
const deployBin =
	process.env.KOTOBAD_DEPLOY_OPENNEXT_BIN ??
	join(frontendDir, "node_modules", ".bin", "opennextjs-cloudflare");
const temporaryParent = process.env.KOTOBAD_DEPLOY_TEMP_PARENT ?? tmpdir();
let activeChild: ChildProcess | null = null;
let terminationSignal: NodeJS.Signals | null = null;

const forwardSignal = (signal: NodeJS.Signals) => {
	terminationSignal = signal;
	const child = activeChild;
	if (!child?.pid) return;

	try {
		if (process.platform === "win32") {
			child.kill(signal);
		} else {
			process.kill(-child.pid, signal);
		}
	} catch (error) {
		if (
			!(error instanceof Error && "code" in error && error.code === "ESRCH")
		) {
			console.error(`Failed to forward ${signal}:`, error);
		}
	}
};

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

const ensureNotTerminated = () => {
	if (terminationSignal) {
		throw new Error(`Production deploy terminated by ${terminationSignal}.`);
	}
};

const runCommand = async (
	label: string,
	command: string,
	args: string[],
	env: NodeJS.ProcessEnv = process.env,
) =>
	new Promise<void>((resolve, reject) => {
		ensureNotTerminated();
		const child = spawn(command, args, {
			cwd: frontendDir,
			detached: process.platform !== "win32",
			env,
			stdio: "inherit",
		});
		activeChild = child;
		child.once("error", reject);
		child.once("close", (code) => {
			if (activeChild === child) activeChild = null;
			if (terminationSignal) {
				return reject(
					new Error(`${label} terminated by ${terminationSignal}.`),
				);
			}
			if (code === 0) return resolve();
			reject(
				new Error(
					`${label} failed with exit code ${code ?? "unknown"}: ${command} ${args.join(" ")}`,
				),
			);
		});
	});

const main = async () => {
	if (!process.env.R2_SNAPSHOT_BUCKET || !process.env.R2_KEY) {
		throw new Error(
			"R2_SNAPSHOT_BUCKET and R2_KEY are required before production build.",
		);
	}

	const temporaryDir = await mkdtemp(
		join(temporaryParent, "kotobad-production-deploy-"),
	);
	const snapshotFile = join(temporaryDir, "protected-snapshot.json");
	const candidateSnapshotFile = join(temporaryDir, "candidate-snapshot.json");
	const guardEnv = {
		...process.env,
		CANDIDATE_SNAPSHOT_FILE: candidateSnapshotFile,
		SNAPSHOT_FILE: snapshotFile,
	};

	try {
		await runCommand("OpenNext build", buildBin, ["run", "cf:build"]);
		ensureNotTerminated();
		await runCommand(
			"Static asset deploy preparation",
			process.execPath,
			[guardScript, "prepare"],
			guardEnv,
		);
		ensureNotTerminated();
		await runCommand("OpenNext production deploy", deployBin, [
			"deploy",
			"--env",
			"production",
		]);
		ensureNotTerminated();
		await runCommand(
			"Static asset snapshot commit",
			process.execPath,
			[guardScript, "commit"],
			guardEnv,
		);
	} finally {
		await rm(temporaryDir, { force: true, recursive: true });
	}
};

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
