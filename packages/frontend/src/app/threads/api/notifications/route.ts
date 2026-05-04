import { NotificationListSchema } from "@kotobad/shared/src/schemas/notifications";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { checkFrontendRateLimit } from "@/lib/api/security/frontendRateLimit";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function GET(req: Request) {
	const rateLimitResponse = checkFrontendRateLimit(req, "notifications");
	if (rateLimitResponse) return rateLimitResponse;

	try {
		const raw = await getNotifications();
		const response = NotificationListSchema.parse(raw);
		return NextResponse.json(response);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to fetch notifications",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to fetch notifications" };
				}
			}

			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to fetch notifications via BFF", error);
		return NextResponse.json(
			{ error: "Failed to fetch notifications" },
			{ status: 500 },
		);
	}
}

async function getNotifications() {
	const url = await getApiUrl("GET_NOTIFICATIONS");
	return BffFetcher(url, {
		method: "GET",
		credentials: "include",
	});
}
