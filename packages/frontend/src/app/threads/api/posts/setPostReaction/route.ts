import {
	SetPostReactionsResponseSchema,
	SetPostReactionsScheme,
} from "@kotobad/shared/src/schemas/post";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const json = await req.json();
	const value = SetPostReactionsScheme.parse(json);
	const raw = await setPostReaction(value);
	const response = SetPostReactionsResponseSchema.parse(raw);

	return NextResponse.json(response);
}

async function setPostReaction(values: z.infer<typeof SetPostReactionsScheme>) {
	const url = await getApiUrl("SET_POST_REACTIONS");
	return BffFetcher<z.infer<typeof SetPostReactionsResponseSchema>>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
