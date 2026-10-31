process.env.INTERNAL_API_SECRET ??= "test-internal-secret";
process.env.NEXT_PUBLIC_API_URL ??= "http://127.0.0.1:8787";
process.env.NEXT_PUBLIC_FRONTEND_URL ??= "http://localhost:3000";
process.env.NEXT_PUBLIC_R2_ASSETS_URL ??= "https://assets.example.invalid";

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { NextRequest } from "next/server";

const { GET, POST } = await import("./route");

describe("demo-login route", () => {
	test("GET method returns 405 Method Not Allowed", async () => {
		const response = await GET();
		assert.equal(response.status, 405);
		const json = (await response.json()) as { error?: string };
		assert.equal(json.error, "Method Not Allowed");
	});

	test("POST method returns 200 and forwards cookies when upstream succeeds", async () => {
		const originalFetch = globalThis.fetch;
		try {
			// Mock fetch to simulate successful Better Auth response
			globalThis.fetch = async (input, _init) => {
				const url = String(input);
				if (url.includes("better-auth/sign-in/email")) {
					const headers = new Headers();
					headers.append(
						"set-cookie",
						"better-auth.session_token=test_session_token_123; Path=/; HttpOnly",
					);
					return new Response(
						JSON.stringify({
							user: {
								id: "demo-user-id",
								name: "デモユーザー",
								email: "demo@kotobad.com",
							},
						}),
						{
							status: 200,
							headers,
						},
					);
				}
				return new Response("Not Found", { status: 404 });
			};

			const req = new NextRequest("https://kotobad.com/auth/api/demo-login", {
				method: "POST",
				headers: {
					origin: "https://kotobad.com",
				},
			});

			const response = await POST(req);
			assert.equal(response.status, 200);

			const json = (await response.json()) as {
				ok: boolean;
				user: { name: string; email: string };
			};
			assert.equal(json.ok, true);
			assert.equal(json.user.name, "デモユーザー");
			assert.equal(json.user.email, "demo@kotobad.com");

			const setCookie = response.headers.get("set-cookie");
			assert.ok(setCookie?.includes("better-auth.session_token="));
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	test("POST method falls back to sign-up when sign-in fails initially", async () => {
		const originalFetch = globalThis.fetch;
		try {
			let signInAttempts = 0;
			let signUpAttempts = 0;

			globalThis.fetch = async (input) => {
				const url = String(input);
				if (url.includes("better-auth/sign-in/email")) {
					signInAttempts++;
					// First sign-in fails (user does not exist)
					return new Response(
						JSON.stringify({ message: "Invalid email or password" }),
						{ status: 401 },
					);
				}
				if (url.includes("better-auth/sign-up/email")) {
					signUpAttempts++;
					const headers = new Headers();
					headers.append(
						"set-cookie",
						"better-auth.session_token=new_user_session_456; Path=/; HttpOnly",
					);
					return new Response(
						JSON.stringify({
							user: {
								id: "new-demo-user-id",
								name: "デモユーザー",
								email: "demo@kotobad.com",
							},
						}),
						{
							status: 200,
							headers,
						},
					);
				}
				return new Response("Not Found", { status: 404 });
			};

			const req = new NextRequest("https://kotobad.com/auth/api/demo-login", {
				method: "POST",
				headers: {
					origin: "https://kotobad.com",
				},
			});

			const response = await POST(req);
			assert.equal(response.status, 200);
			assert.equal(signInAttempts, 1);
			assert.equal(signUpAttempts, 1);

			const json = (await response.json()) as {
				ok: boolean;
				user: { name: string };
			};
			assert.equal(json.ok, true);
			assert.equal(json.user.name, "デモユーザー");
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
