import { LoginSignupSchema } from "@kotobad/shared/src/schemas/auth";
import type { AuthType } from "@kotobad/shared/src/types/";
import type { InferResponseType } from "hono";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BffFetcher, BffFetcherRaw } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const json = await req.json();
	const payload = LoginSignupSchema.parse(json);
	const cookieStore = await cookies();

	const loginRes = await login(payload);

	const setCookieHeaders =
		loginRes.headers.getSetCookie() ??
		loginRes.headers.get("set-cookie")?.split(/,(?=[^;]+=)/) ??
		[];

	const me = await getMe(setCookieHeaders, cookieStore);
	const res = NextResponse.json(me);
	setCookieHeaders.forEach((cookieStr) => {
		// まずcookieのパースッて何？
		const [nameValue] = cookieStr.split(";", 1);
		const [name, value] = nameValue.split("=", 2);
		res.cookies.set(name, value);
	});
	return res;
}

async function login(payload: AuthType.LoginSignupUserType) {
	const url = await getApiUrl("LOGIN");
	return BffFetcherRaw(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
		credentials: "include",
	});
}

async function getMe(
	newCookies: string[],
	//↓なにこれ
	cookieStore: ReadonlyRequestCookies,
) {
	const mergedCookies = [
		cookieStore.toString(),
		//↓なにこれ split(";", 1)[0]
		...newCookies.map((cookieStr) => cookieStr.split(";", 1)[0]),
	]
		.filter(Boolean)
		//↓なにこれ
		.join("; ");
	type resType = InferResponseType<typeof client.auth.me.$get>;
	const url = await getApiUrl("ME");
	const res = await BffFetcher<resType>(url, {
		method: "GET",
		credentials: "include",
		headers: {
			cookie: mergedCookies,
		},
	});

	if ("error" in res) throw new Error(String(res.error));
	return res;
}
