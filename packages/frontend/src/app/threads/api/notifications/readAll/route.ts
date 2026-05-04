import { NotificationReadAllResponseSchema } from "@kotobad/shared/src/schemas/notifications";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { checkFrontendRateLimit } from "@/lib/api/security/frontendRateLimit";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const rateLimitResponse = checkFrontendRateLimit(req, "notifications");
	if (rateLimitResponse) return rateLimitResponse;

	try {
		const raw = await readAllNotifications();
		const response = NotificationReadAllResponseSchema.parse(raw);
		return NextResponse.json(response);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to mark notifications as read",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to mark notifications as read" };
				}
			}

			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to mark notifications as read via BFF", error);
		return NextResponse.json(
			{ error: "Failed to mark notifications as read" },
			{ status: 500 },
		);
	}
}

async function readAllNotifications() {
	const url = await getApiUrl("READ_ALL_NOTIFICATIONS");
	return BffFetcher(url, {
		method: "POST",
		credentials: "include",
	});
}
