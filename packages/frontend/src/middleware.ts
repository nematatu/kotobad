import { type NextRequest, NextResponse } from "next/server";
import { isUnsafeMethod } from "@/lib/api/security/utils/httpMethod";

const PROTECTED_PREFIXES = ["/threads/api/", "/developer-notes/api/"];

const cookieName =
	process.env.NODE_ENV === "production"
		? "__Host-csrf_token"
		: "dev_csrf_token";

const isProtectedPath = (pathname: string) =>
	PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

const THEME_INIT_SCRIPT_HASH =
	"'sha256-uqERcEWzLyVkWVvyBpcUHQlHOC+4xeYtJjcMPIMv6Qk='";

const buildNonce = (): string => {
	const bytes = crypto.getRandomValues(new Uint8Array(16));
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary);
};

const resolveConnectSources = (): string[] => {
	const source = new Set<string>(["'self'"]);
	const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
	if (!rawApiUrl) {
		return [...source];
	}

	try {
		const apiUrl = new URL(rawApiUrl);
		source.add(apiUrl.origin);
		const wsProtocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
		source.add(`${wsProtocol}//${apiUrl.host}`);
	} catch {}

	return [...source];
};

const CONNECT_SOURCES = resolveConnectSources();

const buildCspHeader = (nonce: string): string => {
	const isDev = process.env.NODE_ENV === "development";
	const scriptSrc = `script-src 'self' 'nonce-${nonce}' ${THEME_INIT_SCRIPT_HASH} 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`;
	const styleSrc = "style-src 'self' 'unsafe-inline'";

	return [
		"default-src 'none'",
		"base-uri 'self'",
		"frame-ancestors 'none'",
		"object-src 'none'",
		scriptSrc,
		styleSrc,
		"img-src 'self' data: blob: https://assets.kotobad.com https://kotobad-bucket.kotobad.com https://i.ytimg.com",
		"font-src 'self' data:",
		`connect-src ${CONNECT_SOURCES.join(" ")}`,
		"frame-src https://www.youtube-nocookie.com",
		"form-action 'self'",
		"upgrade-insecure-requests",
	]
		.join("; ")
		.trim();
};

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (isProtectedPath(pathname)) {
		if (!isUnsafeMethod(req.method)) return NextResponse.next();

		const cookieToken = req.cookies.get(cookieName)?.value;
		const headerToken = req.headers.get("x-csrf-token");

		if (!cookieToken || !headerToken || cookieToken !== headerToken) {
			return NextResponse.json(
				{ error: "Invalid CSRF token." },
				{ status: 403 },
			);
		}
	}

	// API/静的リソースは nonce/CSP 対象外。HTML系のページレスポンスのみ対象にする。
	const accept = req.headers.get("accept") ?? "";
	if (!accept.includes("text/html")) {
		return NextResponse.next();
	}

	const nonce = buildNonce();
	const requestHeaders = new Headers(req.headers);
	const cspHeader = buildCspHeader(nonce);
	requestHeaders.set("Content-Security-Policy", cspHeader);

	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	response.headers.set("Content-Security-Policy", cspHeader);

	return response;
}

export const config = {
	matcher: [
		{
			source:
				"/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
