import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isValidCsrfToken } from "./csrf-origin";

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
