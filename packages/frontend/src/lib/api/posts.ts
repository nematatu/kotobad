import type { PostType } from "@kotobad/shared/src/types";
import type { InferResponseType } from "hono";
import { getApiUrl } from "../config/apiUrls";
import { fetcher } from "./fetch";
import type { client } from "./honoClient";

export async function getPostByThreadId(threadId: number) {
	type resType = InferResponseType<
		(typeof client.bbs.posts.byThreadId)[":threadId"]["$get"]
	>;
	const baseUrl = await getApiUrl("GET_POSTS_BY_THREADID");
	const url = new URL(String(threadId), baseUrl);
	return fetcher<resType>(url, {
		method: "GET",
	});
}

export async function getAllPosts(page?: number) {
	type resType = InferResponseType<typeof client.bbs.posts.$get>;
	const url = await getApiUrl("GET_ALL_POSTS");
	if (typeof page === "number") {
		url.searchParams.set("page", String(page));
	}
	return fetcher<resType>(url, {
		method: "GET",
	});
}

export async function createPost(values: PostType.CreatePostType) {
	type resType = InferResponseType<typeof client.bbs.posts.create.$post>;
	const url = await getApiUrl("CREATE_POST");
	return fetcher<resType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
