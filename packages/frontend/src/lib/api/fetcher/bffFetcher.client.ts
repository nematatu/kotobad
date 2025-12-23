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
	const { headers, cache, ...init } = options;
	const mergeHeaders = toHeaders(headers);

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
