import type { ThreadType } from "@kotobad/shared/src/types";
import type { InferResponseType } from "hono";
import { getApiUrl } from "../config/apiUrls";
import { fetcher } from "./fetch";
import type { client } from "./honoClient";

export async function getAllThreads(page?: number) {
	type resType = InferResponseType<typeof client.bbs.threads.$get>;
	const url = await getApiUrl("GET_ALL_THREADS");
	if (typeof page === "number") {
		url.searchParams.set("page", String(page));
	}
	return fetcher<resType>(url, {
		method: "GET",
	});
}

export async function createThread(values: ThreadType.CreateThreadType) {
	type resType = InferResponseType<typeof client.bbs.threads.create.$post>;
	const url = await getApiUrl("CREATE_THREAD");
	return fetcher<resType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
