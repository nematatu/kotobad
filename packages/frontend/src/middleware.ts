import { type NextRequest, NextResponse } from "next/server";
import { isUnsafeMethod } from "@/lib/api/security/httpMethod";

const PROTECTED_PREFIXES = ["/threads/api/", "/developer-notes/api/"];
const GET_CSRF_TOKEN_ENDPOINT = "/threads/api/csrf-token";

const cookieName =
	process.env.NODE_ENV === "production" ? "__Host-bff_token" : "dev_csrf_token";

const isProtectedPath = (pathname: string) =>
	PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	if (!isProtectedPath(pathname)) return NextResponse.next();
	if (!isUnsafeMethod(req.method)) return NextResponse.next();
	if (pathname === GET_CSRF_TOKEN_ENDPOINT) return NextResponse.next();

	const cookieToken = req.cookies.get(cookieName)?.value;
	const headerToken = req.headers.get("x-csrf-token");

	if (!cookieToken || !headerToken || cookieToken !== headerToken) {
		return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/threads/api/:path*", "/developer-notes/api/:path*"],
};
