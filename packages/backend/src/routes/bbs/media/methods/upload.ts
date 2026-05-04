import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { UploadImageTargetSchema } from "@kotobad/shared/src/schemas/media";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { OpenAPIUploadImageResponseSchema } from "../../../../models/media";
import type { AppEnvironment } from "../../../../types";
import { resolveAllowedImageFile } from "../../../../utils/upload/imageFile";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const UPLOAD_WINDOW_MS = 60 * 1000;
const MAX_UPLOADS_PER_WINDOW = 20;
const uploadRateLimitStore = new Map<
	string,
	{ startAtMs: number; count: number }
>();

const toPublicImageUrl = (baseUrl: string, objectKey: string): string => {
	const normalized = baseUrl.trim().replace(/\/+$/, "");
	return `${normalized}/${objectKey}`;
};

const isUploadRateLimited = (userId: string): boolean => {
	const now = Date.now();
	const current = uploadRateLimitStore.get(userId);
	if (!current || now - current.startAtMs >= UPLOAD_WINDOW_MS) {
		uploadRateLimitStore.set(userId, {
			startAtMs: now,
			count: 1,
		});
		return false;
	}

	if (current.count >= MAX_UPLOADS_PER_WINDOW) {
		return true;
	}

	uploadRateLimitStore.set(userId, {
		startAtMs: current.startAtMs,
		count: current.count + 1,
	});
	return false;
};

export const uploadImageRoute = createRoute({
	method: "post",
	path: "/upload",
	description: "スレッド・投稿用の画像をR2へアップロードします",
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: z.object({
						file: z.any(),
						target: UploadImageTargetSchema,
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: "アップロードされた画像URL",
			content: {
				"application/json": {
					schema: OpenAPIUploadImageResponseSchema,
				},
			},
		},
		400: {
			description: "バリデーションエラー",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		401: {
			description: "未認証",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		429: {
			description: "レート制限",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		500: {
			description: "サーバーエラー",
			content: {
				"application/json": {
					schema: ErrorResponse,
				},
			},
		},
	},
});

export const uploadImageRouter: RouteHandler<
	typeof uploadImageRoute,
	AppEnvironment
> = async (c) => {
	try {
		const authUser = c.get("betterAuthUser");
		const publicBaseUrl = c.env.R2_PUBLIC_BASE_URL;

		if (!publicBaseUrl) {
			return c.json(
				{
					error: "Failed to upload image",
					message: "R2 public base url is not configured",
				},
				500,
			);
		}

		if (isUploadRateLimited(authUser.id)) {
			return c.json(
				{
					error: "Too many uploads",
					message:
						"短時間での連続アップロードが多いため、少し待ってから再試行してください",
				},
				429,
			);
		}

		const formData = await c.req.formData();
		const fileEntry = formData.get("file");

		if (!(fileEntry instanceof File)) {
			return c.json({ error: "file is required" }, 400);
		}

		if (fileEntry.size <= 0) {
			return c.json({ error: "file is empty" }, 400);
		}

		if (fileEntry.size > MAX_IMAGE_BYTES) {
			return c.json(
				{ error: "file size must be less than or equal to 8MB" },
				400,
			);
		}

		const imageFile = resolveAllowedImageFile(fileEntry);
		if (!imageFile.ok) {
			return c.json({ error: imageFile.error }, 400);
		}

		const parsedTarget = UploadImageTargetSchema.safeParse(
			formData.get("target"),
		);
		if (!parsedTarget.success) {
			return c.json({ error: "target must be thread or post" }, 400);
		}

		const objectPrefix =
			parsedTarget.data === "thread" ? "thread-image" : "post-image";
		const objectKey = `${objectPrefix}/${Date.now()}-${crypto.randomUUID()}.${imageFile.extension}`;
		const fileBuffer = await fileEntry.arrayBuffer();

		await c.env.KOTOBAD_BUCKET.put(objectKey, fileBuffer, {
			httpMetadata: {
				contentType: fileEntry.type,
				cacheControl: "public, max-age=31536000, immutable",
			},
		});

		const imageUrl = toPublicImageUrl(publicBaseUrl, objectKey);
		return c.json({ imageUrl }, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{ error: "Failed to upload image", message: getErrorMessage(error) },
			500,
		);
	}
};
