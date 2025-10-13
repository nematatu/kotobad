import type { InferResponseType } from "hono";
import { getApiUrl } from "../config/apiUrls";
import { fetcher } from "./fetch";
import type { client } from "./honoClient";

export async function getAllLabels() {
	type resType = InferResponseType<typeof client.bbs.labels.$get>;
	return fetcher<resType>(`${getApiUrl("GET_ALL_LABELS")}`, {
		method: "GET",
	});
}
