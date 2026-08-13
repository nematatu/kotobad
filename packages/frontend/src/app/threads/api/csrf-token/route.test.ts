import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { GET } from "./route";

const withNodeEnv = async (
	nodeEnv: "development" | "production",
	run: () => Promise<void>,
) => {
	const previousDescriptor = Object.getOwnPropertyDescriptor(
		process.env,
		"NODE_ENV",
	);
	Object.defineProperty(process.env, "NODE_ENV", {
		configurable: true,
		enumerable: true,
		value: nodeEnv,
		writable: true,
	});

	try {
		await run();
	} finally {
		if (previousDescriptor) {
			Object.defineProperty(process.env, "NODE_ENV", previousDescriptor);
		} else {
			Reflect.deleteProperty(process.env, "NODE_ENV");
		}
	}
};

const readCsrfResponse = async () => {
	const response = await GET(
		new Request("https://kotobad.com/threads/api/csrf-token"),
	);
	const body = (await response.json()) as { csrfToken: string };
	const setCookie = response.headers.get("set-cookie") ?? "";
	const cookiePair = setCookie.split(";", 1)[0] ?? "";
	const separatorIndex = cookiePair.indexOf("=");

	assert.notEqual(separatorIndex, -1);

	return {
		body,
		cookieName: cookiePair.slice(0, separatorIndex),
		cookieValue: cookiePair.slice(separatorIndex + 1),
		response,
		setCookie,
	};
};

describe("CSRF token endpoint", () => {
	test("productionでは本文と同じtokenを安全なcookieとして設定する", async () => {
		await withNodeEnv("production", async () => {
			const { body, cookieName, cookieValue, response, setCookie } =
				await readCsrfResponse();

			assert.equal(response.status, 200);
			assert.match(body.csrfToken, /^[0-9a-f]{64}$/);
			assert.equal(cookieName, "__Host-csrf_token");
			assert.equal(cookieValue, body.csrfToken);
			assert.match(setCookie, /Path=\//);
			assert.match(setCookie, /Max-Age=3600/);
			assert.match(setCookie, /Secure/);
			assert.match(setCookie, /HttpOnly/);
			assert.match(setCookie, /SameSite=strict/i);
			assert.equal(response.headers.get("cache-control"), "no-store");
		});
	});

	test("developmentでは本文と同じtokenをSecureなしのcookieへ設定する", async () => {
		await withNodeEnv("development", async () => {
			const { body, cookieName, cookieValue, response, setCookie } =
				await readCsrfResponse();

			assert.equal(response.status, 200);
			assert.match(body.csrfToken, /^[0-9a-f]{64}$/);
			assert.equal(cookieName, "dev_csrf_token");
			assert.equal(cookieValue, body.csrfToken);
			assert.match(setCookie, /Path=\//);
			assert.match(setCookie, /Max-Age=3600/);
			assert.doesNotMatch(setCookie, /(?:^|;\s*)Secure(?:;|$)/i);
			assert.match(setCookie, /HttpOnly/);
			assert.match(setCookie, /SameSite=strict/i);
			assert.equal(response.headers.get("cache-control"), "no-store");
		});
	});
});
