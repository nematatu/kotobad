import { NextResponse } from "next/server";
import { BffFetcherRaw } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function DELETE() {
	const logoutRes = await logout();

	const cookieHeaders =
		logoutRes.headers.getSetCookie() ??
		logoutRes.headers.get("set-cookie")?.split(/,(?=[^;]+=)/) ??
		[];

	const res = NextResponse.json({ message: "logout success" });
	cookieHeaders.forEach((cookieStr) => {
		res.headers.append("set-cookie", cookieStr);
	});

	return res;
}

async function logout() {
	const url = await getApiUrl("LOGOUT");
	return BffFetcherRaw(url, {
		method: "DELETE",
		credentials: "include",
	});
}
