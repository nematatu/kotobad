"use client";

import { UploadImageResponseSchema } from "@kotobad/shared/src/schemas/media";
import type { UploadImageTargetType } from "@kotobad/shared/src/types/media";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";

const MAX_THREAD_POST_IMAGE_BYTES = 8 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/avif",
]);

export const validateThreadPostImageFile = (
	file: File,
): { ok: true } | { ok: false; message: string } => {
	if (file.size <= 0) {
		return { ok: false, message: "ファイルが空です" };
	}

	if (file.size > MAX_THREAD_POST_IMAGE_BYTES) {
		return { ok: false, message: "8MB以下の画像を選択してください" };
	}

	if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
		return {
			ok: false,
			message: "jpeg/png/webp/avif の画像を選択してください",
		};
	}

	return { ok: true };
};

export const uploadThreadPostImage = async (
	file: File,
	target: UploadImageTargetType,
): Promise<string> => {
	const endpoint = await getBffApiUrl("UPLOAD_IMAGE");
	const formData = new FormData();
	formData.append("file", file);
	formData.append("target", target);

	const raw = await BffFetcher<unknown>(endpoint, {
		method: "POST",
		body: formData,
	});
	const parsed = UploadImageResponseSchema.parse(raw);
	return parsed.imageUrl;
};
