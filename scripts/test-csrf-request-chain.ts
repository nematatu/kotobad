import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { Hono } from "../packages/backend/node_modules/hono";
import { csrfOriginMiddleware } from "../packages/backend/src/middleware/csrf-origin";
import { internalAuthMiddleware } from "../packages/backend/src/middleware/internal-auth";

const INTERNAL_API_SECRET = "csrf-request-chain-test-secret";
const STARTUP_TIMEOUT_MS = 45_000;
const STARTUP_POLL_INTERVAL_MS = 500;

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
			const response = await fetch(
				`${frontendOrigin}/threads/api/csrf-token`,
				{ cache: "no-store" },
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

const main = async () => {
	const repositoryRoot = resolve(import.meta.dir, "..");
	const frontendDirectory = resolve(repositoryRoot, "packages/frontend");
	const integrationDistDirectoryName = ".next-csrf-integration";
	const integrationDistDirectory = resolve(
		frontendDirectory,
		integrationDistDirectoryName,
	);
	const frontendPort = await findAvailablePort();
	const backendPort = await findAvailablePort();
	const frontendOrigin = `http://127.0.0.1:${frontendPort}`;
	let backendHandlerCallCount = 0;
	const backendObservation: { current: ObservedBackendRequest | null } = {
		current: null,
	};

	const backendApp = new Hono<{ Bindings: TestBindings }>();
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

	const backendServer = Bun.serve({
		hostname: "127.0.0.1",
		port: backendPort,
		fetch: (request) =>
			backendApp.fetch(request, {
				ALLOWED_ORIGINS: frontendOrigin,
				INTERNAL_API_SECRET,
			}),
	});
	const backendOrigin = `http://127.0.0.1:${backendServer.port}/`;

	const frontendProcess = Bun.spawn({
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
		env: {
			...process.env,
			INTERNAL_API_SECRET,
			NEXT_DIST_DIR: integrationDistDirectoryName,
			NEXT_PUBLIC_API_URL: backendOrigin,
			NEXT_PUBLIC_FRONTEND_URL: frontendOrigin,
			NEXT_PUBLIC_R2_ASSETS_URL: "https://assets.example.invalid",
		},
		stderr: "pipe",
		stdout: "pipe",
	});
	const stdoutPromise = readLog(frontendProcess.stdout);
	const stderrPromise = readLog(frontendProcess.stderr);
	let testError: unknown;

	try {
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

		const validResponse = await fetch(
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

		const missingHeaderResponse = await fetch(
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
		assert.equal(backendHandlerCallCount, 1);

		const disallowedOriginResponse = await fetch(
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
		assert.equal(backendHandlerCallCount, 1);

		console.info(
			"CSRF request chain passed: Next middleware -> Route Handler -> BFF -> Backend middleware",
		);
	} catch (error) {
		testError = error;
	} finally {
		frontendProcess.kill();
		await frontendProcess.exited;
		backendServer.stop(true);
		await rm(integrationDistDirectory, { force: true, recursive: true });
	}

	const [stdout, stderr] = await Promise.all([stdoutPromise, stderrPromise]);
	if (testError) {
		const logs = `${stdout}\n${stderr}`.trim().slice(-8_000);
		throw new Error(`${String(testError)}\n\nNext.js logs:\n${logs}`);
	}
};

await main();
