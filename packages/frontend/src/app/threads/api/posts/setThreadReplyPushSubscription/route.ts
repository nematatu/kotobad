import {
	SetThreadReplyPushSubscriptionResponseSchema,
	SetThreadReplyPushSubscriptionSchema,
} from "@kotobad/shared/src/schemas/post";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	try {
		const json = await req.json();
		const value = SetThreadReplyPushSubscriptionSchema.parse(json);
		const raw = await setThreadReplyPushSubscription(value);
		const response = SetThreadReplyPushSubscriptionResponseSchema.parse(raw);
		return NextResponse.json(response);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to set thread reply push subscription",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = {
						error: "Failed to set thread reply push subscription",
					};
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error(
			"Failed to set thread reply push subscription via BFF",
			error,
		);
		return NextResponse.json(
			{ error: "Failed to set thread reply push subscription" },
			{ status: 500 },
		);
	}
}

async function setThreadReplyPushSubscription(
	values: z.infer<typeof SetThreadReplyPushSubscriptionSchema>,
) {
	const url = await getApiUrl("SET_THREAD_REPLY_PUSH_SUBSCRIPTION");
	return BffFetcher<
		z.infer<typeof SetThreadReplyPushSubscriptionResponseSchema>
	>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
