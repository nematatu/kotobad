import { NextResponse } from "next/server";
import { checkFrontendRateLimit } from "@/lib/api/security/frontendRateLimit";

const generateCsrfToken = (): string => {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

const CSRF_TOKEN_MAX_AGE_SECONDS = 60 * 60;

export async function GET(req: Request) {
	const rateLimitResponse = checkFrontendRateLimit(req, "csrf");
	if (rateLimitResponse) return rateLimitResponse;

	const token = generateCsrfToken();

	const res = NextResponse.json({ csrfToken: token }, { status: 200 });

	const isProduction = process.env.NODE_ENV === "production";
	const csrfTokenName = isProduction ? "__Host-csrf_token" : "dev_csrf_token";

	res.cookies.set({
		name: csrfTokenName,
		value: token,
		httpOnly: true,
		path: "/",
		sameSite: "strict",
		secure: isProduction,
		maxAge: CSRF_TOKEN_MAX_AGE_SECONDS,
	});

	res.headers.set("Cache-Control", "no-store");
	return res;
}
