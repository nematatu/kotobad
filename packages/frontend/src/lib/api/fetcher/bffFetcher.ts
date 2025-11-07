import { cookies } from "next/headers";

type fetchArgs = Parameters<typeof fetch>;

const toHeaders = (value: HeadersInit | undefined) =>
	value instanceof Headers ? value : new Headers(value);

export type BffFetcherError = Error & {
	status?: number;
	body?: string;
};

export async function BffFetcher<T>(
	url: fetchArgs[0],
	options: fetchArgs[1] = {},
): Promise<T> {
	const { headers, cache, ...init } = options;
	const cookieStore = await cookies();
	const cookieHeader = cookieStore.toString();

	const mergeHeaders = toHeaders(headers);
	if (cookieHeader) {
		mergeHeaders.set("cookie", cookieHeader);
	}

	let response: Response;
	try {
		response = await fetch(url, {
			...init,
			headers: mergeHeaders,
			cache: cache ?? "no-cache",
		});
	} catch (error) {
		throw error;
	}

	//TODO RFCにAPIのエラー型出たらしいので試したい
	if (!response.ok) {
		const body = await response.text();
		const error = new Error(
			`Fetch Error: ${response.status} ${body}`,
		) as BffFetcherError;
		error.status = response.status;
		error.body = body;
		throw error;
	}

	return response.json() as Promise<T>;
}
