import { isHiddenThreadId } from "@kotobad/shared/src/config/hiddenThreads";
import { ThreadListSchema } from "@kotobad/shared/src/schemas/thread";

import type { ThreadListType } from "@kotobad/shared/src/types/thread";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import normalizeThread from "./normalizeThread";
import type { Sort } from "./sort";

type Options = {
	query: string;
	page: number;
	limit: number;
	sort?: Sort;
};

export async function searchThreads({
	query,
	page,
	limit,
	sort = "new",
}: Options): Promise<ThreadListType> {
	const targetUrl = await getApiUrl("SEARCH_THREADS");
	targetUrl.searchParams.set("q", query);
	targetUrl.searchParams.set("page", String(page));
	targetUrl.searchParams.set("limit", String(limit));
	targetUrl.searchParams.set("sort", sort);

	let raw: ThreadListType;
	try {
		raw = await BffFetcher<ThreadListType>(targetUrl, {
			method: "GET",
			cache: "no-store",
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		console.error("Failed to fetch threads", fetchError);
		raw = ThreadListSchema.parse({ threads: [], totalCount: 0 });
	}

	const visibleThreads = raw.threads.filter(
		(thread) => !isHiddenThreadId(thread.id),
	);

	const safeResponse = {
		threads: visibleThreads.map(normalizeThread),
		totalCount: Math.max(
			0,
			raw.totalCount - (raw.threads.length - visibleThreads.length),
		),
	};

	const threadsResponse: ThreadListType = ThreadListSchema.parse(safeResponse);

	return threadsResponse;
}
