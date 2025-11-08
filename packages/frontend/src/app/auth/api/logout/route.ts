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
		// まずcookieのパースッて何？
		const [nameValue] = cookieStr.split(";", 1);
		const [name, value] = nameValue.split("=", 2);
		res.cookies.set(name, value);
	});
	res.cookies.delete("accessToken");
	res.cookies.delete("refreshToken");

	return res;
}

async function logout() {
	const url = await getApiUrl("LOGOUT");
	return BffFetcherRaw(url, {
		method: "DELETE",
		credentials: "include",
	});
}
