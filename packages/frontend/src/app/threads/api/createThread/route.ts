import {
	CreateThreadSchema,
	ThreadSchema,
} from "@kotobad/shared/src/schemas/thread";
import type { ThreadType } from "@kotobad/shared/src/types";
import type { InferResponseType } from "hono";
import { NextResponse } from "next/server";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const json = await req.json();
	const value = CreateThreadSchema.parse(json);
	const raw = await createThread(value);
	const thread = ThreadSchema.parse(raw);
	return NextResponse.json(thread);
}

async function createThread(values: ThreadType.CreateThreadType) {
	type resType = InferResponseType<typeof client.bbs.threads.create.$post>;
	const url = await getApiUrl("CREATE_THREAD");
	return BffFetcher<resType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}
