import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { Hono } from "../packages/backend/node_modules/hono";
import { csrfOriginMiddleware } from "../packages/backend/src/middleware/csrf-origin";
import { internalAuthMiddleware } from "../packages/backend/src/middleware/internal-auth";

const INTERNAL_API_SECRET = "csrf-request-chain-test-secret";
const STARTUP_TIMEOUT_MS = 45_000;
const STARTUP_POLL_INTERVAL_MS = 500;
const HTTP_REQUEST_TIMEOUT_MS = 10_000;
const STARTUP_REQUEST_TIMEOUT_MS = 2_000;
const PROCESS_EXIT_TIMEOUT_MS = 5_000;
const LOG_READ_TIMEOUT_MS = 5_000;

type TestBindings = {
	ALLOWED_ORIGINS?: string;
	INTERNAL_API_SECRET: string;
};

type ObservedBackendRequest = {
	body: unknown;
	cookie: string | undefined;
	internalSignature: string | undefined;
	internalTimestamp: string | undefined;
	origin: string | undefined;
	csrfToken: string | undefined;
};

const findAvailablePort = (): Promise<number> =>
	new Promise((resolvePort, reject) => {
		const probe = createServer();
		probe.once("error", reject);
		probe.listen(0, "127.0.0.1", () => {
			const address = probe.address();
			if (!address || typeof address === "string") {
				probe.close();
				reject(new Error("Failed to resolve an available TCP port"));
				return;
			}

			probe.close((error) => {
				if (error) {
					reject(error);
					return;
				}
				resolvePort(address.port);
			});
		});
	});

const withTimeout = <T>(
	promise: Promise<T>,
	timeoutMs: number,
	message: string,
): Promise<T> =>
	new Promise((resolvePromise, reject) => {
		const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
		promise.then(
			(value) => {
				clearTimeout(timer);
				resolvePromise(value);
			},
			(error) => {
				clearTimeout(timer);
				reject(error);
			},
		);
	});

const fetchWithTimeout = (
	input: Parameters<typeof fetch>[0],
	init: Parameters<typeof fetch>[1] = {},
	timeoutMs = HTTP_REQUEST_TIMEOUT_MS,
): Promise<Response> =>
	fetch(input, {
		...init,
		signal: AbortSignal.timeout(timeoutMs),
	});

const waitForFrontend = async (
	frontendOrigin: string,
	frontendProcess: Bun.Subprocess,
): Promise<Response> => {
	const deadline = Date.now() + STARTUP_TIMEOUT_MS;
	let lastStatus: number | undefined;
	let lastError: unknown;

	while (Date.now() < deadline) {
		if (frontendProcess.exitCode !== null) {
			throw new Error(
				`Next.js dev server exited before becoming ready: ${frontendProcess.exitCode}`,
			);
		}

		try {
			const remainingMs = Math.max(1, deadline - Date.now());
			const response = await fetchWithTimeout(
				`${frontendOrigin}/threads/api/csrf-token`,
				{ cache: "no-store" },
				Math.min(STARTUP_REQUEST_TIMEOUT_MS, remainingMs),
			);
			lastStatus = response.status;
			if (response.ok) return response;
		} catch (error) {
			lastError = error;
		}

		await Bun.sleep(STARTUP_POLL_INTERVAL_MS);
	}

	throw new Error(
		`Next.js dev server did not become ready within ${STARTUP_TIMEOUT_MS}ms. ` +
			`lastStatus=${lastStatus ?? "none"}, lastError=${String(lastError ?? "none")}`,
	);
};

const readLog = async (
	stream: ReadableStream<Uint8Array> | number | undefined,
): Promise<string> => {
	if (!(stream instanceof ReadableStream)) return "";
	return new Response(stream).text();
};

type ProcessSignal = "SIGKILL" | "SIGTERM";

const signalFrontendProcess = (
	frontendProcess: Bun.Subprocess,
	signal: ProcessSignal,
) => {
	if (frontendProcess.exitCode !== null) return;

	if (process.platform !== "win32") {
		try {
			process.kill(-frontendProcess.pid, signal);
			return;
		} catch {}
	}

	try {
		frontendProcess.kill(signal);
	} catch (error) {
		if (frontendProcess.exitCode === null) throw error;
	}
};

const stopFrontendProcess = async (frontendProcess: Bun.Subprocess) => {
	if (frontendProcess.exitCode !== null) {
		await frontendProcess.exited;
		return;
	}

	signalFrontendProcess(frontendProcess, "SIGTERM");
	try {
		await withTimeout(
			frontendProcess.exited,
			PROCESS_EXIT_TIMEOUT_MS,
			"Next.js dev server did not exit after SIGTERM",
		);
		return;
	} catch {
		signalFrontendProcess(frontendProcess, "SIGKILL");
	}

	await withTimeout(
		frontendProcess.exited,
		PROCESS_EXIT_TIMEOUT_MS,
		"Next.js dev server did not exit after SIGKILL",
	);
};

const formatError = (error: unknown): string => {
	if (error instanceof Error) return error.stack ?? error.message;
	return String(error);
};

const main = async () => {
	const repositoryRoot = resolve(import.meta.dir, "..");
	const frontendDirectory = resolve(repositoryRoot, "packages/frontend");
	const frontendTsconfigPath = resolve(frontendDirectory, "tsconfig.json");
	const frontendTsconfigBefore = await readFile(frontendTsconfigPath, "utf8");
	const integrationRootDirectoryName = `.next-csrf-integration/${process.pid}-${crypto.randomUUID()}`;
	const integrationRootDirectory = resolve(
		frontendDirectory,
		integrationRootDirectoryName,
	);
	const integrationDistDirectoryName = `${integrationRootDirectoryName}/dist`;
	const integrationTsconfigPathName = `${integrationRootDirectoryName}/tsconfig.json`;
	const integrationTsconfigPath = resolve(
		frontendDirectory,
		integrationTsconfigPathName,
	);
	let frontendOrigin = "";
	let backendIngressCount = 0;
	let backendHandlerCallCount = 0;
	const backendObservation: { current: ObservedBackendRequest | null } = {
		current: null,
	};

	const backendApp = new Hono<{ Bindings: TestBindings }>();
	backendApp.use("/bbs/*", async (_c, next) => {
		backendIngressCount += 1;
		await next();
	});
	backendApp.use("/bbs/*", csrfOriginMiddleware);
	backendApp.use("/bbs/*", internalAuthMiddleware);
	backendApp.post("/bbs/threads/likes/set", async (c) => {
		backendHandlerCallCount += 1;
		backendObservation.current = {
			body: await c.req.json(),
			cookie: c.req.header("cookie"),
			csrfToken: c.req.header("x-csrf-token"),
			internalSignature: c.req.header("x-internal-signature"),
			internalTimestamp: c.req.header("x-internal-ts"),
			origin: c.req.header("origin"),
		};

		return c.json({
			threadId: 1,
			likeCount: 1,
			likedByMe: true,
		});
	});

	let backendServer: ReturnType<typeof Bun.serve> | undefined;
	let frontendProcess: Bun.Subprocess | undefined;
	let stdoutPromise: Promise<string> = Promise.resolve("");
	let stderrPromise: Promise<string> = Promise.resolve("");
	let testError: unknown;
	const cleanupErrors: unknown[] = [];

	try {
		await mkdir(integrationRootDirectory, { recursive: true });
		await writeFile(
			integrationTsconfigPath,
			`${JSON.stringify({ extends: "../../tsconfig.json" }, null, 2)}\n`,
			{ encoding: "utf8", flag: "wx" },
		);

		backendServer = Bun.serve({
			hostname: "127.0.0.1",
			port: 0,
			fetch: (request) =>
				backendApp.fetch(request, {
					ALLOWED_ORIGINS: frontendOrigin,
					INTERNAL_API_SECRET,
				}),
		});
		const backendOrigin = `http://127.0.0.1:${backendServer.port}/`;
		const frontendPort = await findAvailablePort();
		frontendOrigin = `http://127.0.0.1:${frontendPort}`;

		frontendProcess = Bun.spawn({
			cmd: [
				"bun",
				"run",
				"dev",
				"--hostname",
				"127.0.0.1",
				"--port",
				String(frontendPort),
			],
			cwd: frontendDirectory,
			detached: true,
			env: {
				...process.env,
				INTERNAL_API_SECRET,
				NEXT_DIST_DIR: integrationDistDirectoryName,
				NEXT_TSCONFIG_PATH: integrationTsconfigPathName,
				NEXT_PUBLIC_API_URL: backendOrigin,
				NEXT_PUBLIC_FRONTEND_URL: frontendOrigin,
				NEXT_PUBLIC_R2_ASSETS_URL: "https://assets.example.invalid",
			},
			stderr: "pipe",
			stdout: "pipe",
		});
		stdoutPromise = readLog(frontendProcess.stdout);
		stderrPromise = readLog(frontendProcess.stderr);

		const tokenResponse = await waitForFrontend(
			frontendOrigin,
			frontendProcess,
		);
		const tokenBody = (await tokenResponse.json()) as { csrfToken?: unknown };
		const csrfToken = tokenBody.csrfToken;
		const setCookie = tokenResponse.headers.get("set-cookie") ?? "";
		const cookie = setCookie.split(";", 1)[0] ?? "";

		if (typeof csrfToken !== "string") {
			throw new TypeError("CSRF token endpoint did not return a string token");
		}
		assert.match(csrfToken, /^[0-9a-f]{64}$/);
		assert.equal(cookie, `dev_csrf_token=${csrfToken}`);

		const validResponse = await fetchWithTimeout(
			`${frontendOrigin}/threads/api/threads/setThreadLike`,
			{
				body: JSON.stringify({ threadId: 1, active: true }),
				headers: {
					"content-type": "application/json",
					cookie,
					origin: frontendOrigin,
					"x-csrf-token": csrfToken,
				},
				method: "POST",
			},
		);

		assert.equal(validResponse.status, 200);
		assert.deepEqual(await validResponse.json(), {
			threadId: 1,
			likeCount: 1,
			likedByMe: true,
		});
		assert.equal(backendIngressCount, 1);
		assert.equal(backendHandlerCallCount, 1);
		const observedBackendRequest = backendObservation.current;
		if (!observedBackendRequest) {
			throw new Error("Backend handler did not record the valid request");
		}
		assert.deepEqual(observedBackendRequest.body, {
			threadId: 1,
			active: true,
		});
		assert.match(
			observedBackendRequest.cookie ?? "",
			new RegExp(`(?:^|;\\s*)dev_csrf_token=${csrfToken}(?:;|$)`),
		);
		assert.equal(observedBackendRequest.csrfToken, csrfToken);
		assert.equal(observedBackendRequest.origin, frontendOrigin);
		assert.ok(observedBackendRequest.internalTimestamp);
		assert.ok(observedBackendRequest.internalSignature);

		const backendIngressCountBeforeMissingHeader = backendIngressCount;
		const missingHeaderResponse = await fetchWithTimeout(
			`${frontendOrigin}/threads/api/threads/setThreadLike`,
			{
				body: JSON.stringify({ threadId: 1, active: true }),
				headers: {
					"content-type": "application/json",
					cookie,
					origin: frontendOrigin,
				},
				method: "POST",
			},
		);
		assert.equal(missingHeaderResponse.status, 403);
		assert.deepEqual(await missingHeaderResponse.json(), {
			error: "Invalid CSRF token.",
		});
		assert.equal(
			backendIngressCount,
			backendIngressCountBeforeMissingHeader,
		);
		assert.equal(backendHandlerCallCount, 1);

		const backendIngressCountBeforeDisallowedOrigin = backendIngressCount;
		const disallowedOriginResponse = await fetchWithTimeout(
			`${frontendOrigin}/threads/api/threads/setThreadLike`,
			{
				body: JSON.stringify({ threadId: 1, active: true }),
				headers: {
					"content-type": "application/json",
					cookie,
					origin: "https://attacker.example",
					"x-csrf-token": csrfToken,
				},
				method: "POST",
			},
		);
		assert.equal(disallowedOriginResponse.status, 403);
		assert.deepEqual(await disallowedOriginResponse.json(), {
			error: "Forbidden origin.",
		});
		assert.equal(
			backendIngressCount,
			backendIngressCountBeforeDisallowedOrigin + 1,
		);
		assert.equal(backendHandlerCallCount, 1);
	} catch (error) {
		testError = error;
	} finally {
		const resourceCleanupResults = await Promise.allSettled([
			(async () => {
				if (frontendProcess) await stopFrontendProcess(frontendProcess);
			})(),
			(async () => {
				if (backendServer) await backendServer.stop(true);
			})(),
		]);

		for (const result of resourceCleanupResults) {
			if (result.status === "rejected") cleanupErrors.push(result.reason);
		}

		const integrationRootCleanupResult = await Promise.allSettled([
			rm(integrationRootDirectory, { force: true, recursive: true }),
		]);
		if (integrationRootCleanupResult[0]?.status === "rejected") {
			cleanupErrors.push(integrationRootCleanupResult[0].reason);
		}

		const trackedTsconfigResult = await Promise.allSettled([
			(async () => {
				const frontendTsconfigAfter = await readFile(frontendTsconfigPath, "utf8");
				assert.equal(
					frontendTsconfigAfter,
					frontendTsconfigBefore,
					"Next.js integration test must not modify packages/frontend/tsconfig.json",
				);
			})(),
		]);
		if (trackedTsconfigResult[0]?.status === "rejected") {
			cleanupErrors.push(trackedTsconfigResult[0].reason);
		}
	}

	const logResults = await Promise.allSettled([
		withTimeout(
			stdoutPromise,
			LOG_READ_TIMEOUT_MS,
			"Timed out while reading Next.js stdout",
		),
		withTimeout(
			stderrPromise,
			LOG_READ_TIMEOUT_MS,
			"Timed out while reading Next.js stderr",
		),
	]);
	const stdout = logResults[0]?.status === "fulfilled" ? logResults[0].value : "";
	const stderr = logResults[1]?.status === "fulfilled" ? logResults[1].value : "";
	for (const result of logResults) {
		if (result.status === "rejected") cleanupErrors.push(result.reason);
	}

	if (testError || cleanupErrors.length > 0) {
		const logs = `${stdout}\n${stderr}`.trim().slice(-8_000);
		const errors = [
			testError ? `Test error:\n${formatError(testError)}` : "",
			cleanupErrors.length > 0
				? `Cleanup errors:\n${cleanupErrors.map(formatError).join("\n\n")}`
				: "",
			logs ? `Next.js logs:\n${logs}` : "",
		]
			.filter(Boolean)
			.join("\n\n");
		throw new Error(errors);
	}

	console.info(
		"CSRF request chain passed: Next middleware -> Route Handler -> BFF -> Backend middleware",
	);
};

await main();
