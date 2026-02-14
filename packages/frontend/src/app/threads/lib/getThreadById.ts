import { ThreadSchema } from "@kotobad/shared/src/schemas/thread";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import normalizeThread from "./normalizeThread";

export const getThreadById = async (id: string) => {
	const baseUrl = await getApiUrl("GET_THREAD_BY_ID");
	const targetUrl = new URL(encodeURIComponent(id), baseUrl);

	const response = await BffFetcher<ThreadType>(targetUrl, {
		method: "GET",
		cache: "no-store",
		skipCookie: true,
	});

	const normalizedResponse = normalizeThread(
		response as Record<string, unknown>,
	);

	const targetThread = ThreadSchema.parse(normalizedResponse);

	return targetThread;
};
