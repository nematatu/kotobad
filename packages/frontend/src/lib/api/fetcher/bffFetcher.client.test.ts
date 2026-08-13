import assert from "node:assert/strict";
import { test } from "node:test";
import { resetCsrfToken } from "../security/ensureCsrfToken";
import { BffFetcher } from "./bffFetcher.client";

type FetchCall = {
	cache?: RequestCache;
	credentials?: RequestCredentials;
	headers: Headers;
	method?: string;
	url: string;
};

const toUrl = (input: RequestInfo | URL): string => {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	return input.url;
};

test("unsafe requestはCSRF tokenを取得し、403後は新しいtokenで一度だけ再試行する", async () => {
	const calls: FetchCall[] = [];
	let issuedTokenCount = 0;
	let backendRequestCount = 0;
	const targetUrl = "https://kotobad.com/threads/api/posts/createPost";

	const originalFetch = globalThis.fetch;
	globalThis.fetch = Object.assign(
		async (input: RequestInfo | URL, init?: RequestInit) => {
			const url = toUrl(input);
			calls.push({
				cache: init?.cache,
				credentials: init?.credentials,
				headers: new Headers(init?.headers),
				method: init?.method,
				url,
			});

			if (url === "/threads/api/csrf-token") {
				issuedTokenCount += 1;
				return Response.json({ csrfToken: `token-${issuedTokenCount}` });
			}

			if (url === targetUrl) {
				backendRequestCount += 1;
				if (backendRequestCount === 1) {
					return Response.json(
						{ error: "Invalid CSRF token." },
						{ status: 403 },
					);
				}
				return Response.json({ success: true });
			}

			throw new Error(`Unexpected fetch: ${url}`);
		},
		{ preconnect: originalFetch.preconnect },
	);

	try {
		const result = await BffFetcher<{ success: boolean }>(targetUrl, {
			body: JSON.stringify({ content: "test" }),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		});

		assert.deepEqual(result, { success: true });
		assert.equal(issuedTokenCount, 2);
		assert.equal(backendRequestCount, 2);
		assert.equal(calls.length, 4);

		assert.equal(calls[0]?.url, "/threads/api/csrf-token");
		assert.equal(calls[0]?.method, "GET");
		assert.equal(calls[0]?.cache, "no-store");
		assert.equal(calls[0]?.credentials, "same-origin");

		assert.equal(calls[1]?.url, targetUrl);
		assert.equal(calls[1]?.method, "POST");
		assert.equal(calls[1]?.headers.get("x-csrf-token"), "token-1");

		assert.equal(calls[2]?.url, "/threads/api/csrf-token");
		assert.equal(calls[2]?.method, "GET");
		assert.equal(calls[2]?.cache, "no-store");
		assert.equal(calls[2]?.credentials, "same-origin");

		assert.equal(calls[3]?.url, targetUrl);
		assert.equal(calls[3]?.method, "POST");
		assert.equal(calls[3]?.headers.get("x-csrf-token"), "token-2");
	} finally {
		globalThis.fetch = Object.assign(
			async () =>
				new Response(null, {
					status: 500,
					statusText: "CSRF test cleanup",
				}),
			{ preconnect: originalFetch.preconnect },
		);
		try {
			await resetCsrfToken();
		} catch {
			// module cacheにtokenを残さないため、再取得を失敗させてnullへ戻す。
		} finally {
			globalThis.fetch = originalFetch;
		}
	}
});
