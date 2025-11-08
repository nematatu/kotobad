import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { BffFetcherRaw } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import { appendSetCookies, extractSetCookies, fetchSession } from "../shared";

const signUpSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().min(1),
});

export async function POST(req: Request) {
	const json = await req.json();
	const payload = signUpSchema.parse(json);
	const cookieStore = await cookies();

	const signUpRes = await signup(payload);
	const cookieHeaders = extractSetCookies(signUpRes);
	const session = await fetchSession(cookieHeaders, cookieStore);

	const res = NextResponse.json(session);
	appendSetCookies(res, cookieHeaders);
	return res;
}

async function signup(payload: z.infer<typeof signUpSchema>) {
	const url = await getApiUrl("SIGN_UP");
	return BffFetcherRaw(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
		credentials: "include",
	});
}
