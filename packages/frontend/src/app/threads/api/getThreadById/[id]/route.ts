import type { InferResponseType } from "hono";
import { NextResponse } from "next/server";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";

type Params = {
	params: Promise<{ id: string }>;
};

export async function GET(_req: Request, { params }: Params) {
	const { id } = await params;

	const res = await getThreadById(id);
	return NextResponse.json(res);
}

async function getThreadById(id: string) {
	type resType = InferResponseType<(typeof client.bbs.threads)[":id"]["$get"]>;

	const targetUrl = new URL(id, getApiUrl("GET_THREAD_BY_ID"));
	return BffFetcher<resType>(targetUrl, {
		method: "GET",
	});
}
