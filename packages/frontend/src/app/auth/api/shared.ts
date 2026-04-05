import type { NextResponse } from "next/server";

export function extractSetCookies(response: Response) {
	return (
		response.headers.getSetCookie() ??
		response.headers.get("set-cookie")?.split(/,(?=[^;]+=)/) ??
		[]
	);
}

export function appendSetCookies(res: NextResponse, cookiesToAdd: string[]) {
	cookiesToAdd.forEach((cookieStr) => {
		res.headers.append("set-cookie", cookieStr);
	});
}
