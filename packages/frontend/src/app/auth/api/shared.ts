import {
	type BetterAuthSessionResponse,
	BetterAuthSessionResponseSchema,
} from "@kotobad/shared/src/auth/betterAuthSession";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/config/apiUrls";

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

export function mergeCookies(
	cookieStore: ReadonlyRequestCookies,
	newCookies: string[],
) {
	return [
		cookieStore.toString(),
		...newCookies.map((cookieStr) => cookieStr.split(";", 1)[0]),
	]
		.filter(Boolean)
		.join("; ");
}

export async function fetchSession(
	newCookies: string[],
	cookieStore: ReadonlyRequestCookies,
): Promise<BetterAuthSessionResponse | null> {
	const mergedCookies = mergeCookies(cookieStore, newCookies);
	const url = await getApiUrl("ME");
	const response = await fetch(url, {
		method: "GET",
		headers: mergedCookies ? { cookie: mergedCookies } : undefined,
		credentials: "include",
		cache: "no-store",
	});

	if (response.status === 401 || response.status === 204) {
		return null;
	}
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Failed to fetch session: ${response.status} ${body}`);
	}
	const data = await response.json();
	return BetterAuthSessionResponseSchema.parse(data);
}
