/// <reference types="bun" />

import { afterAll, beforeEach, describe, mock, spyOn, test } from "bun:test";
import assert from "node:assert/strict";

type RequestContext = {
	cookie: string;
	headers: Headers;
};

const requestContext: RequestContext = {
	cookie: "",
	headers: new Headers(),
};

const nextHeadersMock = mock(async () => requestContext.headers);
const cookiesMock = mock(async () => ({
	toString: () => requestContext.cookie,
}));

mock.module("server-only", () => ({}));
mock.module("next/headers", () => ({
	cookies: cookiesMock,
	headers: nextHeadersMock,
}));

const originalInternalApiSecret = process.env.INTERNAL_API_SECRET;
const originalFrontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

process.env.INTERNAL_API_SECRET = "bff-fetcher-test-secret";
process.env.NEXT_PUBLIC_FRONTEND_URL = "https://frontend.example.test";

const { BffFetcherRaw } = await import("./bffFetcher");
const fetchSpy = spyOn(globalThis, "fetch");

const getForwardedHeaders = (): Headers => {
	const call = fetchSpy.mock.calls[0];
	assert.ok(call, "Backend向けfetchが呼ばれている必要があります");

	const requestInit = call[1];
	assert.ok(requestInit?.headers, "Backend向けheaderが必要です");

	return new Headers(requestInit.headers);
};

beforeEach(() => {
	requestContext.cookie =
		"better-auth.session_token=session-token; __Host-csrf_token=context-token";
	requestContext.headers = new Headers({
		origin: "https://kotobad.com",
		"x-csrf-token": "context-token",
	});

	nextHeadersMock.mockClear();
	cookiesMock.mockClear();
	fetchSpy.mockClear();
	fetchSpy.mockResolvedValue(Response.json({ ok: true }));
});

afterAll(() => {
	fetchSpy.mockRestore();
	mock.restore();

	if (originalInternalApiSecret === undefined) {
		Reflect.deleteProperty(process.env, "INTERNAL_API_SECRET");
	} else {
		process.env.INTERNAL_API_SECRET = originalInternalApiSecret;
	}

	if (originalFrontendUrl === undefined) {
		Reflect.deleteProperty(process.env, "NEXT_PUBLIC_FRONTEND_URL");
	} else {
		process.env.NEXT_PUBLIC_FRONTEND_URL = originalFrontendUrl;
	}
});

describe("BffFetcherRaw request context forwarding", () => {
	test("forwards Cookie, Origin, and CSRF token to the Backend fetch", async () => {
		const response = await BffFetcherRaw("https://api.example.test/bbs/posts", {
			body: JSON.stringify({ post: "test" }),
			headers: { "content-type": "application/json" },
			method: "POST",
		});
		const forwardedHeaders = getForwardedHeaders();

		assert.equal(response.status, 200);
		assert.equal(forwardedHeaders.get("cookie"), requestContext.cookie);
		assert.equal(forwardedHeaders.get("origin"), "https://kotobad.com");
		assert.equal(forwardedHeaders.get("x-csrf-token"), "context-token");
		assert.ok(forwardedHeaders.get("x-internal-ts"));
		assert.ok(forwardedHeaders.get("x-internal-signature"));
		assert.equal(nextHeadersMock.mock.calls.length, 1);
		assert.equal(cookiesMock.mock.calls.length, 1);
	});

	test("does not overwrite headers explicitly provided by the caller", async () => {
		await BffFetcherRaw("https://api.example.test/bbs/posts", {
			headers: {
				cookie: "caller-cookie=caller-value",
				origin: "https://caller.example.test",
				"x-csrf-token": "caller-token",
			},
			method: "POST",
		});
		const forwardedHeaders = getForwardedHeaders();

		assert.equal(forwardedHeaders.get("cookie"), "caller-cookie=caller-value");
		assert.equal(forwardedHeaders.get("origin"), "https://caller.example.test");
		assert.equal(forwardedHeaders.get("x-csrf-token"), "caller-token");
	});

	test("skipCookie prevents request context forwarding", async () => {
		await BffFetcherRaw("https://api.example.test/public", {
			method: "POST",
			skipCookie: true,
		});
		const forwardedHeaders = getForwardedHeaders();

		assert.equal(forwardedHeaders.get("cookie"), null);
		assert.equal(forwardedHeaders.get("x-csrf-token"), null);
		assert.equal(
			forwardedHeaders.get("origin"),
			"https://frontend.example.test",
		);
		assert.equal(nextHeadersMock.mock.calls.length, 0);
		assert.equal(cookiesMock.mock.calls.length, 0);
		assert.ok(forwardedHeaders.get("x-internal-ts"));
		assert.ok(forwardedHeaders.get("x-internal-signature"));
	});
});
