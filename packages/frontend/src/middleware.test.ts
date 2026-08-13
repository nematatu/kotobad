import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

const createRequest = ({
	cookieName,
	cookieToken,
	headerToken,
	method,
}: {
	cookieName?: string;
	cookieToken?: string;
	headerToken?: string;
	method: string;
}) => {
	const headers = new Headers();
	if (cookieToken) {
		headers.set("cookie", `${cookieName ?? "dev_csrf_token"}=${cookieToken}`);
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

const withNodeEnv = <T>(
	nodeEnv: "development" | "production",
	callback: () => T,
): T => {
	const originalNodeEnv = process.env.NODE_ENV;
	Reflect.set(process.env, "NODE_ENV", nodeEnv);
	try {
		return callback();
	} finally {
		if (originalNodeEnv === undefined) {
			Reflect.deleteProperty(process.env, "NODE_ENV");
		} else {
			Reflect.set(process.env, "NODE_ENV", originalNodeEnv);
		}
	}
};

describe("frontend CSRF middleware", () => {
	test("productionでは__Host cookieだけを受け付ける", () => {
		const { developmentCookieResponse, productionCookieResponse } = withNodeEnv(
			"production",
			() => ({
				productionCookieResponse: middleware(
					createRequest({
						cookieName: "__Host-csrf_token",
						cookieToken: "token-123",
						headerToken: "token-123",
						method: "POST",
					}),
				),
				developmentCookieResponse: middleware(
					createRequest({
						cookieName: "dev_csrf_token",
						cookieToken: "token-123",
						headerToken: "token-123",
						method: "POST",
					}),
				),
			}),
		);

		assert.equal(productionCookieResponse.status, 200);
		assert.equal(
			productionCookieResponse.headers.get("x-middleware-next"),
			"1",
		);
		assert.equal(developmentCookieResponse.status, 403);
	});

	test("developmentではdev cookieだけを受け付ける", () => {
		const { developmentCookieResponse, productionCookieResponse } = withNodeEnv(
			"development",
			() => ({
				developmentCookieResponse: middleware(
					createRequest({
						cookieName: "dev_csrf_token",
						cookieToken: "token-123",
						headerToken: "token-123",
						method: "POST",
					}),
				),
				productionCookieResponse: middleware(
					createRequest({
						cookieName: "__Host-csrf_token",
						cookieToken: "token-123",
						headerToken: "token-123",
						method: "POST",
					}),
				),
			}),
		);

		assert.equal(developmentCookieResponse.status, 200);
		assert.equal(
			developmentCookieResponse.headers.get("x-middleware-next"),
			"1",
		);
		assert.equal(productionCookieResponse.status, 403);
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
