import { UploadAvatarResponseSchema } from "@kotobad/shared/src/schemas/user";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const fileEntry = formData.get("file");

		if (!(fileEntry instanceof File)) {
			return NextResponse.json({ error: "file is required" }, { status: 400 });
		}

		const raw = await uploadMyAvatar(formData);
		const response = UploadAvatarResponseSchema.parse(raw);
		return NextResponse.json(response, { status: 200 });
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to upload avatar",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to upload avatar" };
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to upload avatar via BFF", error);
		return NextResponse.json(
			{ error: "Failed to upload avatar" },
			{ status: 500 },
		);
	}
}

const uploadMyAvatar = async (formData: FormData) => {
	const url = await getApiUrl("UPLOAD_MY_AVATAR");
	return BffFetcher<unknown>(url, {
		method: "POST",
		body: formData,
		credentials: "include",
	});
};
