import { cookies } from "next/headers";
import { apiUrlMap } from "../url/BaseBffUrl";

type fetchArgs = Parameters<typeof fetch>;

const toHeaders = (value: HeadersInit | undefined) =>
	value instanceof Headers ? value : new Headers(value);

export type BffFetcherError = Error & {
	status?: number;
	body?: string;
};

export async function BffFetcherRaw(
	url: fetchArgs[0],
	options: fetchArgs[1] = {},
	skipErrorThrow = false,
): Promise<Response> {
	const { headers, cache, ...init } = options;
	const cookieStore = await cookies();
	const cookieHeader = cookieStore.toString();
	const frontendUrl = apiUrlMap[process.env.NODE_ENV];
	const defaultOrigin = frontendUrl ?? "http://localhost:3000";

	const mergeHeaders = toHeaders(headers);
	if (!mergeHeaders.has("cookie") && cookieHeader) {
		mergeHeaders.set("cookie", cookieHeader);
	}

	if (!mergeHeaders.has("origin")) {
		mergeHeaders.set("origin", defaultOrigin);
	}

	const response = await fetch(url, {
		...init,
		headers: mergeHeaders,
		cache: cache ?? "no-cache",
	});

	//TODO RFCにAPIのエラー型出たらしいので試したい
	if (!response.ok && !skipErrorThrow) {
		const body = await response.text();
		const error = new Error(
			`Fetch Error: ${response.status} ${body}`,
		) as BffFetcherError;
		error.status = response.status;
		error.body = body;
		throw error;
	}
	return response;
}

export async function BffFetcher<T>(
	url: fetchArgs[0],
	options: fetchArgs[1] = {},
): Promise<T> {
	const response = await BffFetcherRaw(url, options);
	return response.json() as Promise<T>;
}
