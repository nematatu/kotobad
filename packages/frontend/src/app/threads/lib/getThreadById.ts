import { isHiddenThreadId } from "@kotobad/shared/src/config/hiddenThreads";
import { ThreadSchema } from "@kotobad/shared/src/schemas/thread";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import normalizeThread from "./normalizeThread";

export const getThreadById = async (id: string) => {
	if (isHiddenThreadId(id)) {
		const notFoundError = new Error("Thread not found") as BffFetcherError;
		notFoundError.status = 404;
		throw notFoundError;
	}

	const baseUrl = await getApiUrl("GET_THREAD_BY_ID");
	const targetUrl = new URL(encodeURIComponent(id), baseUrl);

	const response = await BffFetcher<ThreadType>(targetUrl, {
		method: "GET",
		cache: "no-store",
	});

	const normalizedResponse = normalizeThread(
		response as Record<string, unknown>,
	);

	const targetThread = ThreadSchema.parse(normalizedResponse);

	return targetThread;
};
