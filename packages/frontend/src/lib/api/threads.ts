import { client } from "./honoClient";
import { fetcher } from "./fetch";
import { API_URLS } from "../config/apiUrls";
import { InferResponseType } from "hono";

export async function getAllThreads() {
	type resType = InferResponseType<typeof client.bbs.threads.$get>;
	return fetcher<resType>(API_URLS.THREADS, { method: "GET" });
}
