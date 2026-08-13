import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

const CSRF_COOKIE_NAME =
	process.env.NODE_ENV === "production"
		? "__Host-csrf_token"
		: "dev_csrf_token";

const createRequest = ({
	cookieToken,
	headerToken,
	method,
}: {
	cookieToken?: string;
	headerToken?: string;
	method: string;
}) => {
	const headers = new Headers();
	if (cookieToken) {
		headers.set("cookie", `${CSRF_COOKIE_NAME}=${cookieToken}`);
	}
	if (headerToken) {
		headers.set("x-csrf-token", headerToken);
	}

	return new NextRequest(
		"https://kotobad.com/threads/api/threads/createThread",
		{
			headers,
			method,
		},
	);
};

describe("frontend CSRF middleware", () => {
	test("unsafe methodは一致するcookieとheaderがあれば通過する", () => {
		const response = middleware(
			createRequest({
				cookieToken: "token-123",
				headerToken: "token-123",
				method: "POST",
			}),
		);

		assert.equal(response.status, 200);
		assert.equal(response.headers.get("x-middleware-next"), "1");
	});

	test("unsafe methodはCSRF headerがなければ拒否する", async () => {
		const response = middleware(
			createRequest({ cookieToken: "token-123", method: "POST" }),
		);

		assert.equal(response.status, 403);
		assert.deepEqual(await response.json(), {
			error: "Invalid CSRF token.",
		});
	});

	test("unsafe methodはcookieとheaderが一致しなければ拒否する", async () => {
		const response = middleware(
			createRequest({
				cookieToken: "token-123",
				headerToken: "token-456",
				method: "POST",
			}),
		);

		assert.equal(response.status, 403);
		assert.deepEqual(await response.json(), {
			error: "Invalid CSRF token.",
		});
	});

	test("safe methodはCSRF tokenなしで通過する", () => {
		const response = middleware(createRequest({ method: "GET" }));

		assert.equal(response.status, 200);
		assert.equal(response.headers.get("x-middleware-next"), "1");
	});
});
