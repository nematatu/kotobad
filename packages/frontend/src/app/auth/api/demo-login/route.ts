import { type NextRequest, NextResponse } from "next/server";
import { ensureInternalSecret } from "@/lib/api/security/ensureInternalSecret";
import { checkFrontendRateLimit } from "@/lib/api/security/frontendRateLimit";
import { FRONTEND_BASE_URL } from "@/lib/api/url/BaseBffUrl";
import { API_BASE_URL } from "@/lib/api/url/BaseUrl";
import {
	DEMO_SIGN_IN_PATH,
	DEMO_SIGN_UP_PATH,
	DEMO_USER_EMAIL,
	DEMO_USER_NAME,
	DEMO_USER_PASSWORD,
} from "@/lib/auth/demoConfig";
import { appendSetCookies, extractSetCookies } from "../shared";

export const POST = async (req: NextRequest) => {
	const rateLimitResponse = checkFrontendRateLimit(req, "auth");
	if (rateLimitResponse) return rateLimitResponse;

	const origin = req.headers.get("origin") ?? FRONTEND_BASE_URL;
	const authHeaders = new Headers();
	authHeaders.set("content-type", "application/json");
	authHeaders.set("origin", origin);

	const signInUrl = new URL(DEMO_SIGN_IN_PATH, API_BASE_URL);
	const signInBody = JSON.stringify({
		email: DEMO_USER_EMAIL,
		password: DEMO_USER_PASSWORD,
	});

	const signInHeaders = await ensureInternalSecret(
		signInUrl,
		authHeaders,
		"POST",
	);

	// 1. まず既存のデモアカウントでサインインを試行
	let upstreamResponse = await fetch(signInUrl, {
		method: "POST",
		headers: signInHeaders,
		body: signInBody,
		redirect: "manual",
	});

	// 2. ユーザーが存在しない等の理由で失敗した場合はサインアップを試行
	if (!upstreamResponse.ok) {
		const signUpUrl = new URL(DEMO_SIGN_UP_PATH, API_BASE_URL);
		const signUpBody = JSON.stringify({
			email: DEMO_USER_EMAIL,
			password: DEMO_USER_PASSWORD,
			name: DEMO_USER_NAME,
		});

		const signUpHeaders = await ensureInternalSecret(
			signUpUrl,
			authHeaders,
			"POST",
		);

		upstreamResponse = await fetch(signUpUrl, {
			method: "POST",
			headers: signUpHeaders,
			body: signUpBody,
			redirect: "manual",
		});

		// 3. サインアップが既に存在するエラーなどで失敗した場合は再度サインインを試行
		if (!upstreamResponse.ok) {
			upstreamResponse = await fetch(signInUrl, {
				method: "POST",
				headers: signInHeaders,
				body: signInBody,
				redirect: "manual",
			});
		}
	}

	if (!upstreamResponse.ok) {
		const errorText = await upstreamResponse.text().catch(() => "");
		return NextResponse.json(
			{ error: "Demo login failed", details: errorText },
			{ status: upstreamResponse.status || 500 },
		);
	}

	const responseData = (await upstreamResponse
		.json()
		.catch(() => ({}))) as Record<string, unknown>;
	const nextResponse = NextResponse.json({
		ok: true,
		...responseData,
	});

	const cookieHeaders = extractSetCookies(upstreamResponse);
	appendSetCookies(nextResponse, cookieHeaders);

	return nextResponse;
};

export const GET = async () => {
	return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
};
