import type { client } from "./honoClient";
import { fetcher } from "./fetch";
import { getApiUrl } from "../config/apiUrls";
import type { InferResponseType } from "hono";

export async function getAllLabels() {
	type resType = InferResponseType<typeof client.bbs.labels.$get>;
	return fetcher<resType>(`${getApiUrl("GET_ALL_LABELS")}`, {
		method: "GET",
	});
}
