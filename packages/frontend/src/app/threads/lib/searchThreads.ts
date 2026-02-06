import { ThreadListSchema } from "@kotobad/shared/src/schemas/thread";
import type { ThreadListType } from "@kotobad/shared/src/types/thread";
import type { InferResponseType } from "hono";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";
import normalizeThread from "./normalizeThread";

type Options = {
	query: string;
	page: number;
	limit: number;
};

export async function searchThreads({
	query,
	page,
	limit,
}: Options): Promise<ThreadListType> {
	type ResType = InferResponseType<typeof client.bbs.threads.search.$get>;
	const targetUrl = await getApiUrl("SEARCH_THREADS");
	targetUrl.searchParams.set("q", query);
	targetUrl.searchParams.set("page", String(page));
	targetUrl.searchParams.set("limit", String(limit));

	let raw: unknown;
	try {
		raw = await BffFetcher<ResType>(targetUrl, {
			method: "GET",
			cache: "no-store",
			skipCookie: true,
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		console.error("Failed to fetch threads", fetchError);
		raw = { threads: [], totalCount: 0 };
	}

	const rawObject =
		typeof raw === "object" && raw !== null
			? (raw as Record<string, unknown>)
			: {};

	const safeResponse = {
		threads: Array.isArray(rawObject.threads)
			? rawObject.threads.map(normalizeThread)
			: [],
		totalCount:
			typeof rawObject.totalCount === "number" ? rawObject.totalCount : 0,
	};

	const threadsResponse: ThreadListType = ThreadListSchema.parse(safeResponse);

	return threadsResponse;
}
