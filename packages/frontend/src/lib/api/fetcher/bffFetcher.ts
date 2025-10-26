import { cookies } from "next/headers";

type fetchArgs = Parameters<typeof fetch>;

const toHeaders = (value: HeadersInit | undefined) =>
	value instanceof Headers ? value : new Headers(value);

export async function BffFetcher<T>(
	url: fetchArgs[0],
	options: fetchArgs[1] = {},
): Promise<T> {
	const { headers, cache, ...init } = options;
	const cookieHeader = cookies().toString();

	const mergeHeaders = toHeaders(headers);
	if (cookieHeader) {
		mergeHeaders.set("cookie", cookieHeader);
	}

	const response = await fetch(url, {
		...init,
		headers: mergeHeaders,
		cache: cache ?? "no-cache",
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Fetch Error: ${response.status} ${body}`);
	}

	return response.json() as Promise<T>;
}
