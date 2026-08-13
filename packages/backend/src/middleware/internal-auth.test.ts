import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { INTERNAL_AUTH_HEADERS } from "@kotobad/shared/src/const/internalAuthHeaders";
import { signHmac } from "@kotobad/shared/src/utils/internalAuth/signHmac";
import { Hono } from "hono";
import { internalAuthMiddleware } from "./internal-auth";

const INTERNAL_API_SECRET = "test-internal-api-secret";

type TestBindings = {
	INTERNAL_API_SECRET: string;
};

const createInternalAuthTestApp = () => {
	const app = new Hono<{ Bindings: TestBindings }>();
	app.use("/bbs/*", internalAuthMiddleware);
	app.all("/bbs/*", (c) => c.text("ok"));
	return app;
};

const createSignatureHeaders = async ({
	method,
	target,
	timestamp = String(Date.now()),
	secret = INTERNAL_API_SECRET,
}: {
	method: string;
	target: string;
	timestamp?: string;
	secret?: string;
}) => ({
	[INTERNAL_AUTH_HEADERS.TS]: timestamp,
	[INTERNAL_AUTH_HEADERS.SIG]: await signHmac(
		secret,
		`${method.toUpperCase()}\n${target}\n${timestamp}`,
	),
});

const requestEnvironment = {
	INTERNAL_API_SECRET,
};

describe("internalAuthMiddleware", () => {
	for (const testCase of [
		{
			name: "timestamp and signature",
			headers: new Headers(),
		},
		{
			name: "timestamp",
			headers: new Headers({
				[INTERNAL_AUTH_HEADERS.SIG]: "missing-timestamp",
			}),
		},
		{
			name: "signature",
			headers: new Headers({
				[INTERNAL_AUTH_HEADERS.TS]: String(Date.now()),
			}),
		},
	]) {
		test(`rejects a request missing ${testCase.name}`, async () => {
			const app = createInternalAuthTestApp();
			const response = await app.request(
				"http://backend.test/bbs/test",
				{ headers: testCase.headers },
				requestEnvironment,
			);

			assert.equal(response.status, 403);
			assert.deepEqual(await response.json(), { error: "Unauthorized" });
		});
	}

	test("rejects an invalid signature", async () => {
		const app = createInternalAuthTestApp();
		const headers = await createSignatureHeaders({
			method: "GET",
			target: "/bbs/test",
			secret: "different-secret",
		});
		const response = await app.request(
			"http://backend.test/bbs/test",
			{ headers },
			requestEnvironment,
		);

		assert.equal(response.status, 403);
		assert.deepEqual(await response.json(), { error: "Forbidden" });
	});

	for (const testCase of [
		{
			name: "past",
			timestamp: () => String(Date.now() - 120_000),
		},
		{
			name: "future",
			timestamp: () => String(Date.now() + 120_000),
		},
	]) {
		test(`rejects a timestamp too far in the ${testCase.name}`, async () => {
			const app = createInternalAuthTestApp();
			const timestamp = testCase.timestamp();
			const headers = await createSignatureHeaders({
				method: "GET",
				target: "/bbs/test",
				timestamp,
			});
			const response = await app.request(
				"http://backend.test/bbs/test",
				{ headers },
				requestEnvironment,
			);

			assert.equal(response.status, 403);
			assert.deepEqual(await response.json(), { error: "Unauthorized" });
		});
	}

	for (const testCase of [
		{
			name: "method",
			signedMethod: "POST",
			signedTarget: "/bbs/test?filter=recent",
			requestMethod: "PUT",
			requestTarget: "/bbs/test?filter=recent",
		},
		{
			name: "path",
			signedMethod: "POST",
			signedTarget: "/bbs/original?filter=recent",
			requestMethod: "POST",
			requestTarget: "/bbs/modified?filter=recent",
		},
		{
			name: "query",
			signedMethod: "POST",
			signedTarget: "/bbs/test?filter=recent",
			requestMethod: "POST",
			requestTarget: "/bbs/test?filter=popular",
		},
	]) {
		test(`rejects a request whose signed ${testCase.name} was modified`, async () => {
			const app = createInternalAuthTestApp();
			const headers = await createSignatureHeaders({
				method: testCase.signedMethod,
				target: testCase.signedTarget,
			});
			const response = await app.request(
				`http://backend.test${testCase.requestTarget}`,
				{
					method: testCase.requestMethod,
					headers,
				},
				requestEnvironment,
			);

			assert.equal(response.status, 403);
			assert.deepEqual(await response.json(), { error: "Forbidden" });
		});
	}

	test("allows OPTIONS without internal authentication headers", async () => {
		const app = createInternalAuthTestApp();
		const response = await app.request(
			"http://backend.test/bbs/test",
			{ method: "OPTIONS" },
			requestEnvironment,
		);

		assert.equal(response.status, 200);
		assert.equal(await response.text(), "ok");
	});

	test("allows the realtime path without internal authentication headers", async () => {
		const app = createInternalAuthTestApp();
		const response = await app.request(
			"http://backend.test/bbs/realtime/threads/1/ws",
			{},
			requestEnvironment,
		);

		assert.equal(response.status, 200);
		assert.equal(await response.text(), "ok");
	});

	test("allows a request with a valid method, path, query, timestamp, and signature", async () => {
		const app = createInternalAuthTestApp();
		const target = "/bbs/test?filter=recent&page=2";
		const headers = await createSignatureHeaders({
			method: "POST",
			target,
		});
		const response = await app.request(
			`http://backend.test${target}`,
			{ method: "POST", headers },
			requestEnvironment,
		);

		assert.equal(response.status, 200);
		assert.equal(await response.text(), "ok");
	});
});
