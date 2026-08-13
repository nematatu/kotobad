import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { Hono } from "hono";
import { csrfOriginMiddleware, isValidCsrfToken } from "./csrf-origin";

const createCsrfTestApp = () => {
	const app = new Hono<{
		Bindings: { ALLOWED_ORIGINS?: string };
	}>();
	app.use("/bbs/*", csrfOriginMiddleware);
	app.on(["GET", "HEAD", "OPTIONS"], "/bbs/test", (c) => c.text("ok"));
	app.post("/bbs/test", (c) => c.text("ok"));
	return app;
};

const allowedEnvironment = {
	ALLOWED_ORIGINS: "https://kotobad.com",
};

describe("isValidCsrfToken", () => {
	test("accepts a matching production CSRF cookie and header", () => {
		assert.equal(
			isValidCsrfToken("__Host-csrf_token=token-123; other=value", "token-123"),
			true,
		);
	});

	test("accepts a matching development CSRF cookie and header", () => {
		assert.equal(
			isValidCsrfToken("dev_csrf_token=token-123", "token-123"),
			true,
		);
	});

	test("rejects missing or mismatched tokens", () => {
		assert.equal(isValidCsrfToken(undefined, "token-123"), false);
		assert.equal(
			isValidCsrfToken("__Host-csrf_token=token-123", "token-456"),
			false,
		);
		assert.equal(isValidCsrfToken("other=value", "token-123"), false);
	});
});

describe("csrfOriginMiddleware", () => {
	test("allows a valid unsafe request", async () => {
		const app = createCsrfTestApp();
		const response = await app.request(
			"http://backend.test/bbs/test",
			{
				method: "POST",
				headers: {
					Origin: "https://kotobad.com",
					Cookie: "__Host-csrf_token=token-123",
					"X-CSRF-Token": "token-123",
				},
			},
			allowedEnvironment,
		);

		assert.equal(response.status, 200);
		assert.equal(await response.text(), "ok");
	});

	test("rejects a missing CSRF token before the handler runs", async () => {
		const app = createCsrfTestApp();
		const response = await app.request(
			"http://backend.test/bbs/test",
			{
				method: "POST",
				headers: { Origin: "https://kotobad.com" },
			},
			allowedEnvironment,
		);

		assert.equal(response.status, 403);
		assert.deepEqual(await response.json(), {
			error: "Invalid CSRF token.",
		});
	});

	test("rejects a mismatched CSRF cookie and header", async () => {
		const app = createCsrfTestApp();
		const response = await app.request(
			"http://backend.test/bbs/test",
			{
				method: "POST",
				headers: {
					Origin: "https://kotobad.com",
					Cookie: "__Host-csrf_token=cookie-token",
					"X-CSRF-Token": "header-token",
				},
			},
			allowedEnvironment,
		);

		assert.equal(response.status, 403);
		assert.deepEqual(await response.json(), {
			error: "Invalid CSRF token.",
		});
	});

	test("rejects an overlong CSRF token", async () => {
		const app = createCsrfTestApp();
		const longToken = "a".repeat(2049);
		const response = await app.request(
			"http://backend.test/bbs/test",
			{
				method: "POST",
				headers: {
					Origin: "https://kotobad.com",
					Cookie: `__Host-csrf_token=${longToken}`,
					"X-CSRF-Token": longToken,
				},
			},
			allowedEnvironment,
		);

		assert.equal(response.status, 403);
		assert.deepEqual(await response.json(), {
			error: "Invalid CSRF token.",
		});
	});

	test("rejects an unsafe request from a disallowed origin", async () => {
		const app = createCsrfTestApp();
		const response = await app.request(
			"http://backend.test/bbs/test",
			{
				method: "POST",
				headers: {
					Origin: "https://attacker.example",
					Cookie: "__Host-csrf_token=token-123",
					"X-CSRF-Token": "token-123",
				},
			},
			allowedEnvironment,
		);

		assert.equal(response.status, 403);
		assert.deepEqual(await response.json(), {
			error: "Forbidden origin.",
		});
	});

	test("uses the Referer origin when Origin is absent", async () => {
		const app = createCsrfTestApp();
		const response = await app.request(
			"http://backend.test/bbs/test",
			{
				method: "POST",
				headers: {
					Referer: "https://kotobad.com/threads/123?from=notification",
					Cookie: "__Host-csrf_token=token-123",
					"X-CSRF-Token": "token-123",
				},
			},
			allowedEnvironment,
		);

		assert.equal(response.status, 200);
		assert.equal(await response.text(), "ok");
	});

	for (const method of ["GET", "HEAD", "OPTIONS"] as const) {
		test(`allows the safe ${method} method without origin or CSRF token`, async () => {
			const app = createCsrfTestApp();
			const response = await app.request(
				"http://backend.test/bbs/test",
				{ method },
				allowedEnvironment,
			);

			assert.equal(response.status, 200);
		});
	}
});
