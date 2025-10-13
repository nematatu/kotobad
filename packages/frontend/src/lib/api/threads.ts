import type { ThreadType } from "@kotobad/shared/src/types";
import type { InferResponseType } from "hono";
import { getApiUrl } from "../config/apiUrls";
import { fetcher } from "./fetch";
import type { client } from "./honoClient";

export async function getAllThreads(page?: number) {
	type resType = InferResponseType<typeof client.bbs.threads.$get>;
	return fetcher<resType>(`${getApiUrl("GET_ALL_THREADS")}?page=${page}`, {
		method: "GET",
	});
}

export async function createThread(values: ThreadType.CreateThreadType) {
	type resType = InferResponseType<typeof client.bbs.threads.create.$post>;
	return fetcher<resType>(getApiUrl("CREATE_THREAD"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
