import { ThreadListSchema } from "@kotobad/shared/src/schemas/thread";
import type { ThreadListType } from "@kotobad/shared/src/types/thread";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
export const dynamic = "force-static";

import { REVALIDATE_SECONDS } from "@/lib/const/revalidate-time";

const cacheBust =
	process.env.CF_PAGES_COMMIT_SHA ??
	process.env.VERCEL_GIT_COMMIT_SHA ??
	process.env.NEXT_PUBLIC_CACHE_BUST ??
	process.env.NEXT_BUILD_ID ??
	"";

export async function getThreads(page: number): Promise<ThreadListType> {
	const targetUrl = await getApiUrl("GET_ALL_THREADS");
	targetUrl.searchParams.set("page", String(page));

	// ビルド毎にISRの生成を行うコード
	// URLが変更されることで再生成するらしい
	if (cacheBust) {
		targetUrl.searchParams.set("v", cacheBust);
	}

	let raw: ThreadListType;
	try {
		raw = await BffFetcher<ThreadListType>(targetUrl, {
			method: "GET",
			cache: "force-cache",
			next: { revalidate: REVALIDATE_SECONDS, tags: ["threads"] },
			skipCookie: true,
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		console.error("Failed to fetch threads", fetchError);
		raw = { threads: [], totalCount: 0 };
	}

	const safeResponse = {
		threads: Array.isArray(raw?.threads) ? raw.threads : [],
		totalCount: typeof raw?.totalCount === "number" ? raw.totalCount : 0,
	};

	const threadsResponse: ThreadListType = ThreadListSchema.parse(safeResponse);

	return threadsResponse;
}
