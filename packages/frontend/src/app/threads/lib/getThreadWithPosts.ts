import type { InferResponseType } from "hono";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";

const REVALIDATE_SECONDS = 900;

export const getThreadWithPosts = async (id: string) => {
	type ResType = InferResponseType<
		(typeof client.bbs.threads.full)[":id"]["$get"]
	>;

	const baseUrl = await getApiUrl("GET_THREAD_WITH_POSTS");
	const targetUrl = new URL(id, baseUrl);

	return BffFetcher<ResType>(targetUrl, {
		method: "GET",
		cache: "force-cache",
		next: {
			revalidate: REVALIDATE_SECONDS,
			tags: ["threads", `thread:${id}`],
		},
		skipCookie: true,
	});
};
