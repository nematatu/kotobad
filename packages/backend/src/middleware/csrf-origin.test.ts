import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { Hono } from "hono";
import { csrfOriginMiddleware, isValidCsrfToken } from "./csrf-origin";

const createCsrfTestApp = () => {
	const app = new Hono<{
		Bindings: { ALLOWED_ORIGINS?: string };
	}>();
	app.use("/bbs/*", csrfOriginMiddleware);
	app.post("/bbs/test", (c) => c.text("ok"));
	return app;
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
			{ ALLOWED_ORIGINS: "https://kotobad.com" },
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
			{ ALLOWED_ORIGINS: "https://kotobad.com" },
		);

		assert.equal(response.status, 403);
		assert.deepEqual(await response.json(), {
			error: "Invalid CSRF token.",
		});
	});
});
