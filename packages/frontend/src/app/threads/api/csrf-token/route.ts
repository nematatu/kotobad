import { NextResponse } from "next/server";

const generateCsrfToken = (): string => {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

export async function GET() {
	const token = generateCsrfToken();

	const res = NextResponse.json({ csrfToken: token }, { status: 200 });

	const csrfTokenName =
		process.env.NODE_ENV === "production"
			? "__Host-bff_token"
			: "dev_csrf_token";

	res.cookies.set({
		name: csrfTokenName,
		value: token,
		httpOnly: true,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60,
	});

	res.headers.set("Cache-Control", "no-store");
	return res;
}
