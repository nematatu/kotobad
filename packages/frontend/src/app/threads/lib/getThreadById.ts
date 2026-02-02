import { ThreadSchema } from "@kotobad/shared/src/schemas/thread";
import type { InferResponseType } from "hono";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";
import { REVALIDATE_SECONDS } from "@/lib/const/revalidate-time";
import normalizeThread from "./normalizeThread";

export const getThreadById = async (id: string) => {
	type ResType = InferResponseType<(typeof client.bbs.threads)[":id"]["$get"]>;

	const baseUrl = await getApiUrl("GET_THREAD_BY_ID");
	const targetUrl = new URL(encodeURIComponent(id), baseUrl);

	const response = await BffFetcher<ResType>(targetUrl, {
		method: "GET",
		cache: "force-cache",
		next: {
			revalidate: REVALIDATE_SECONDS,
			tags: ["threads", `thread:${id}`],
		},
		skipCookie: true,
	});

	const normalizedResponse = normalizeThread(
		response as Record<string, unknown>,
	);

	const targetThread = ThreadSchema.parse(normalizedResponse);

	return targetThread;
};
