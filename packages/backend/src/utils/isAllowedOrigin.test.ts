import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isAllowedOrigin } from "./isAllowedOrigin";

describe("isAllowedOrigin", () => {
	const env = {
		ALLOWED_ORIGINS: "https://kotobad.com,http://localhost:3000",
	};

	test("allows explicitly configured origins", () => {
		assert.equal(isAllowedOrigin("https://kotobad.com", env), true);
		assert.equal(isAllowedOrigin("http://localhost:3000", env), true);
	});

	test("allows demo.kotobad.com origin", () => {
		assert.equal(isAllowedOrigin("https://demo.kotobad.com", env), true);
		assert.equal(isAllowedOrigin("http://demo.kotobad.com", env), false);
	});

	test("allows Cloudflare preview origins", () => {
		assert.equal(
			isAllowedOrigin(
				"https://abc12345-kotobad-frontend.amtt.workers.dev",
				env,
			),
			true,
		);
	});

	test("rejects disallowed origins", () => {
		assert.equal(isAllowedOrigin("https://malicious.com", env), false);
		assert.equal(isAllowedOrigin("https://evil-kotobad.com", env), false);
		assert.equal(isAllowedOrigin("invalid-url", env), false);
	});
});
