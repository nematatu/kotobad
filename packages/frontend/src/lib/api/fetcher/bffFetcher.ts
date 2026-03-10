import "server-only";
import { cookies, headers as nextHeaders } from "next/headers";
import { apiUrlMap } from "../url/BaseBffUrl";

type FetchArgs = Parameters<typeof fetch>;

const toHeaders = (value: HeadersInit | undefined) =>
	value instanceof Headers ? value : new Headers(value);

export type BffFetcherError = Error & {
	status?: number;
	body?: string;
};

type BffFetcherOptions = FetchArgs[1] & { skipCookie?: boolean };

export async function BffFetcherRaw(
	url: FetchArgs[0],
	options: BffFetcherOptions = {},
	skipErrorThrow = false,
): Promise<Response> {
	const { headers, cache, skipCookie, ...init } = options;
	const frontendUrl = apiUrlMap[process.env.NODE_ENV];
	const defaultOrigin = frontendUrl ?? "http://localhost:3000";

	const mergeHeaders = toHeaders(headers);

	if (!skipCookie) {
		// Cookie と request 由来の origin は、認証付きリクエストでのみ付与する。
		const cookieStore = await cookies();
		const cookieHeader = cookieStore.toString();
		if (!mergeHeaders.has("cookie") && cookieHeader) {
			mergeHeaders.set("cookie", cookieHeader);
		}

		if (!mergeHeaders.has("origin")) {
			const requestHeaders = await nextHeaders();
			const requestOrigin = requestHeaders.get("origin");

			if (requestOrigin) {
				mergeHeaders.set("origin", requestOrigin);
			} else {
				const host = requestHeaders.get("host");
				const forwardedProto = requestHeaders.get("x-forwarded-proto");
				const proto =
					forwardedProto ??
					(host && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)
						? "http"
						: "https");

				if (host) {
					mergeHeaders.set("origin", `${proto}://${host}`);
				}
			}
		}
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
	url: FetchArgs[0],
	options: BffFetcherOptions = {},
): Promise<T> {
	const response = await BffFetcherRaw(url, options);
	return response.json() as Promise<T>;
}
