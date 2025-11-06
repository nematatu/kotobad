import type { InferResponseType } from "hono";
import { getApiUrl } from "../config/apiUrls";
import { fetcher } from "./fetch";
import type { client } from "./honoClient";

export async function getAllLabels() {
	type resType = InferResponseType<typeof client.bbs.labels.$get>;
	const url = await getApiUrl("GET_ALL_LABELS");
	return fetcher<resType>(url, {
		method: "GET",
	});
}
