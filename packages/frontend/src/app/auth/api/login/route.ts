import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { BffFetcherRaw } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import { appendSetCookies, extractSetCookies, fetchSession } from "../shared";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export async function POST(req: Request) {
	const json = await req.json();
	const payload = loginSchema.parse(json);
	const cookieStore = await cookies();

	const loginRes = await login(payload);
	const cookieHeaders = extractSetCookies(loginRes);
	const session = await fetchSession(cookieHeaders, cookieStore);

	const res = NextResponse.json(session);
	appendSetCookies(res, cookieHeaders);
	return res;
}

async function login(payload: z.infer<typeof loginSchema>) {
	const url = await getApiUrl("LOGIN");
	return BffFetcherRaw(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
		credentials: "include",
	});
}
