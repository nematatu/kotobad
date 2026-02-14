import {
	CreateThreadSchema,
	ThreadSchema,
} from "@kotobad/shared/src/schemas/thread";
import type { ThreadType } from "@kotobad/shared/src/types";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const json = await req.json();
	const value = CreateThreadSchema.parse(json);
	const raw = await createThread(value);
	const thread = ThreadSchema.parse(raw);

	revalidateTag("threads");
	revalidateTag(`thread:${thread.id}`);
	return NextResponse.json(thread);
}

async function createThread(values: ThreadType.CreateThreadType) {
	const url = await getApiUrl("CREATE_THREAD");
	return BffFetcher<ThreadType.ThreadType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}
