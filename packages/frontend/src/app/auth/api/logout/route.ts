import { NextResponse } from "next/server";
import { BffFetcherRaw } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import { appendSetCookies, extractSetCookies } from "../shared";

export async function POST() {
	const logoutRes = await logout();
	const cookieHeaders = extractSetCookies(logoutRes);

	const res = NextResponse.json({ message: "logout success" });
	appendSetCookies(res, cookieHeaders);
	return res;
}

async function logout() {
	const url = await getApiUrl("LOGOUT");
	return BffFetcherRaw(url, {
		method: "POST",
		credentials: "include",
	});
}
