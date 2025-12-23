import { type NextRequest, NextResponse } from "next/server";
import { BffFetcherRaw } from "@/lib/api/fetcher/bffFetcher";
import { getApiBaseUrl } from "@/lib/api/url/BaseUrl";
import { appendSetCookies, extractSetCookies } from "../shared";

const ALLOWED_METHODS = [
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE",
	"OPTIONS",
	"HEAD",
];

type BetterAuthContext = {
	params: Promise<{ betterAuthPath: string[] }>;
};

const handler = async (req: NextRequest, context: BetterAuthContext) => {
	if (!ALLOWED_METHODS.includes(req.method)) {
		return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
	}

	const params = await context.params;
	const pathSegments = params.betterAuthPath ?? [];
	if (pathSegments.length === 0) {
		return NextResponse.json({ error: "Not Found" }, { status: 404 });
	}

	const backendBase = getApiBaseUrl();
	const targetUrl = new URL(
		`better-auth/${pathSegments.join("/")}`,
		backendBase,
	);
	if (req.nextUrl.search) {
		targetUrl.search = req.nextUrl.search;
	}

	const headers = new Headers(req.headers);
	headers.delete("host");
	headers.delete("content-length");

	let body: BodyInit | undefined;
	if (!["GET", "HEAD"].includes(req.method) && req.body) {
		const buffer = await req.arrayBuffer();
		body = buffer.byteLength > 0 ? buffer : undefined;
	}

	const upstreamResponse = await BffFetcherRaw(
		targetUrl,
		{
			method: req.method,
			headers,
			body,
			redirect: "manual",
		},
		true,
	);

	const nextResponse = new NextResponse(upstreamResponse.body, {
		status: upstreamResponse.status,
		statusText: upstreamResponse.statusText,
	});

	const blockedHeaders = new Set([
		"set-cookie",
		"content-encoding",
		"transfer-encoding",
		"content-length",
	]);
	upstreamResponse.headers.forEach((value, key) => {
		if (!blockedHeaders.has(key.toLowerCase())) {
			nextResponse.headers.set(key, value);
		}
	});

	const cookieHeaders = extractSetCookies(upstreamResponse);
	appendSetCookies(nextResponse, cookieHeaders);

	return nextResponse;
};

export async function GET(req: NextRequest, context: BetterAuthContext) {
	return handler(req, context);
}

export async function POST(req: NextRequest, context: BetterAuthContext) {
	return handler(req, context);
}

export async function PUT(req: NextRequest, context: BetterAuthContext) {
	return handler(req, context);
}

export async function PATCH(req: NextRequest, context: BetterAuthContext) {
	return handler(req, context);
}

export async function DELETE(req: NextRequest, context: BetterAuthContext) {
	return handler(req, context);
}

export async function OPTIONS(req: NextRequest, context: BetterAuthContext) {
	return handler(req, context);
}

export async function HEAD(req: NextRequest, context: BetterAuthContext) {
	return handler(req, context);
}
