import { UpdateUserProfileResponseSchema } from "@kotobad/shared/src/schemas/user";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { toBffErrorPayload } from "@/lib/api/fetcher/errorPayload";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function PATCH(req: Request) {
	return handleUpdateProfile(req);
}

export async function PUT(req: Request) {
	return handleUpdateProfile(req);
}

const handleUpdateProfile = async (req: Request) => {
	try {
		const formData = await req.formData();
		const raw = await updateMyProfile(formData);
		const response = UpdateUserProfileResponseSchema.parse(raw);
		return NextResponse.json(response, { status: 200 });
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			const payload = toBffErrorPayload(
				fetchError.body,
				"Failed to update profile",
			);
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to update profile via BFF", error);
		return NextResponse.json(
			{ error: "Failed to update profile" },
			{ status: 500 },
		);
	}
};

const updateMyProfile = async (formData: FormData) => {
	const url = await getApiUrl("UPDATE_MY_PROFILE");
	return BffFetcher<unknown>(url, {
		method: "PATCH",
		body: formData,
		credentials: "include",
	});
};
