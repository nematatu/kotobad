import { ThreadListSchema } from "@kotobad/shared/src/schemas/thread";
import type { ThreadListType } from "@kotobad/shared/src/types/thread";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import normalizeThread from "./normalizeThread";

type Options = {
	limit?: number;
};

const DEFAULT_LIMIT = 8;

export async function getTrendingThreads({
	limit = DEFAULT_LIMIT,
}: Options = {}): Promise<ThreadListType> {
	const targetUrl = await getApiUrl("GET_TRENDING_THREADS");
	targetUrl.searchParams.set("limit", String(limit));

	let raw: ThreadListType;
	try {
		raw = await BffFetcher<ThreadListType>(targetUrl, {
			method: "GET",
			cache: "no-store",
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		console.error("Failed to fetch trending threads", fetchError);
		raw = ThreadListSchema.parse({ threads: [], totalCount: 0 });
	}

	const safeResponse = {
		threads: raw.threads.map(normalizeThread),
		totalCount: raw.totalCount,
	};

	return ThreadListSchema.parse(safeResponse);
}
