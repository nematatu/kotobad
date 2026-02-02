import { PostListSchema } from "@kotobad/shared/src/schemas/post";
import type { PostListType } from "@kotobad/shared/src/types/post";
import type { InferResponseType } from "hono";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";
import { REVALIDATE_SECONDS } from "@/lib/const/revalidate-time";

export const getPostByThreadId = async (
	threadId: string,
): Promise<PostListType> => {
	type ResType = InferResponseType<
		(typeof client.bbs.posts.byThreadId)[":threadId"]["$get"]
	>;
	const baseUrl = await getApiUrl("GET_POSTS_BY_THREADID");
	const targetUrl = new URL(threadId, baseUrl);

	const response = await BffFetcher<ResType>(targetUrl, {
		method: "GET",
		cache: "force-cache",
		next: {
			revalidate: REVALIDATE_SECONDS,
			tags: ["threads", `thread:${threadId}`],
		},
		skipCookie: true,
	});

	return PostListSchema.parse(response);
};
