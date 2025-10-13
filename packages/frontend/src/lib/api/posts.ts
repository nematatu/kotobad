import type { client } from "./honoClient";
import { fetcher } from "./fetch";
import { getApiUrl } from "../config/apiUrls";
import type { InferResponseType } from "hono";
import type { PostType } from "@kotobad/shared/src/types";

export async function getPostByThreadId(threadId: number) {
	type resType = InferResponseType<
		(typeof client.bbs.posts.byThreadId)[":threadId"]["$get"]
	>;
	return fetcher<resType>(`${getApiUrl("GET_POSTS_BY_THREADID")}/${threadId}`, {
		method: "GET",
	});
}

export async function getAllPosts(page?: number) {
	type resType = InferResponseType<typeof client.bbs.posts.$get>;
	return fetcher<resType>(`${getApiUrl("GET_ALL_POSTS")}?page=${page}`, {
		method: "GET",
	});
}

export async function createPost(values: PostType.CreatePostType) {
	type resType = InferResponseType<typeof client.bbs.posts.create.$post>;
	return fetcher<resType>(getApiUrl("CREATE_POST"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
