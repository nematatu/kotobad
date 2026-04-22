import { emitAuthRequiredEvent } from "@/lib/auth/authRequiredEvent";
import { ensureCsrfToken, resetCsrfToken } from "../security/ensureCsrfToken";
import { isUnsafeMethod } from "../security/utils/httpMethod";

type FetchArgs = Parameters<typeof fetch>;

const toHeaders = (value: HeadersInit | undefined) =>
	value instanceof Headers ? value : new Headers(value);

export type BffFetcherError = Error & {
	status?: number;
	body?: string;
};

type BffFetcherOptions = FetchArgs[1] & { skipCookie?: boolean };

async function BffFetcherRaw(
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

	if (response.status === 401) {
		emitAuthRequiredEvent();
	}

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
	const mergeHeaders = toHeaders(options.headers);

	if (isUnsafeMethod(options.method)) {
		const token = await ensureCsrfToken();
		mergeHeaders.set("x-csrf-token", token);
	}

	options = {
		...options,
		headers: mergeHeaders,
	};

	try {
		const response = await BffFetcherRaw(url, options);
		return response.json() as Promise<T>;
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;

		if (isUnsafeMethod(options.method) && fetchError.status === 403) {
			const retryHeader = toHeaders(options.headers);
			const freshToken = await resetCsrfToken();
			retryHeader.set("x-csrf-token", freshToken);

			options = {
				...options,
				headers: retryHeader,
			};

			const response = await BffFetcherRaw(url, options);
			return response.json() as Promise<T>;
		}
		throw error;
	}
}
