import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "./route";

test("CSRF token endpoint sets the security cookie attributes", async () => {
	const previousNodeEnv = process.env.NODE_ENV;
	Object.defineProperty(process.env, "NODE_ENV", {
		configurable: true,
		enumerable: true,
		value: "production",
		writable: true,
	});

	try {
		const response = await GET(
			new Request("https://kotobad.com/threads/api/csrf-token"),
		);
		const setCookie = response.headers.get("set-cookie") ?? "";

		assert.equal(response.status, 200);
		assert.match(setCookie, /^__Host-csrf_token=/);
		assert.match(setCookie, /Path=\//);
		assert.match(setCookie, /Max-Age=3600/);
		assert.match(setCookie, /Secure/);
		assert.match(setCookie, /HttpOnly/);
		assert.match(setCookie, /SameSite=strict/i);
		assert.equal(response.headers.get("cache-control"), "no-store");
	} finally {
		if (previousNodeEnv === undefined) {
			Reflect.deleteProperty(process.env, "NODE_ENV");
		} else {
			Object.defineProperty(process.env, "NODE_ENV", {
				configurable: true,
				enumerable: true,
				value: previousNodeEnv,
				writable: true,
			});
		}
	}
});
