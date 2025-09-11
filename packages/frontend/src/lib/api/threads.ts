import { client } from "./honoClient";
import { fetcher } from "./fetch";
import { API_URLS } from "../config/apiUrls";
import { InferResponseType } from "hono";
import { ThreadType } from "@b3s/shared/src/types";

export async function getAllThreads(page: number = 1) {
	type resType = InferResponseType<typeof client.bbs.threads.$get>;
	return fetcher<resType>(`${API_URLS.THREADS}?page=${page}`, {
		method: "GET",
	});
}

export async function createThread(values: ThreadType.CreateThreadType) {
	type resType = InferResponseType<typeof client.bbs.threads.create.$post>;
	return fetcher<resType>(API_URLS.CREATE_THREADS, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
