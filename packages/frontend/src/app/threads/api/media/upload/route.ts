import {
	UploadImageResponseSchema,
	UploadImageTargetSchema,
} from "@kotobad/shared/src/schemas/media";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { checkFrontendRateLimit } from "@/lib/api/security/frontendRateLimit";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const rateLimitResponse = checkFrontendRateLimit(req, "upload");
	if (rateLimitResponse) return rateLimitResponse;

	try {
		const formData = await req.formData();
		const fileEntry = formData.get("file");
		const target = formData.get("target");

		if (!(fileEntry instanceof File)) {
			return NextResponse.json({ error: "file is required" }, { status: 400 });
		}

		const parsedTarget = UploadImageTargetSchema.safeParse(target);
		if (!parsedTarget.success) {
			return NextResponse.json(
				{ error: "target must be thread or post" },
				{ status: 400 },
			);
		}

		const upstreamFormData = new FormData();
		upstreamFormData.append("file", fileEntry);
		upstreamFormData.append("target", parsedTarget.data);

		const raw = await uploadImage(upstreamFormData);
		const response = UploadImageResponseSchema.parse(raw);
		return NextResponse.json(response, { status: 200 });
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to upload image",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to upload image" };
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to upload image via BFF", error);
		return NextResponse.json(
			{ error: "Failed to upload image" },
			{ status: 500 },
		);
	}
}

const uploadImage = async (formData: FormData) => {
	const url = await getApiUrl("UPLOAD_IMAGE");
	return BffFetcher<unknown>(url, {
		method: "POST",
		body: formData,
		credentials: "include",
	});
};
