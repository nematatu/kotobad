import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { UploadImageTargetSchema } from "@kotobad/shared/src/schemas/media";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { OpenAPIUploadImageResponseSchema } from "../../../../models/media";
import type { AppEnvironment } from "../../../../types";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const MIME_TYPE_TO_EXTENSION: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/avif": "avif",
};

const toPublicImageUrl = (baseUrl: string, objectKey: string): string => {
	const normalized = baseUrl.trim().replace(/\/+$/, "");
	return `${normalized}/${objectKey}`;
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

		const extension = MIME_TYPE_TO_EXTENSION[fileEntry.type];
		if (!extension) {
			return c.json(
				{ error: "file type must be jpeg, png, webp, or avif" },
				400,
			);
		}

		const parsedTarget = UploadImageTargetSchema.safeParse(
			formData.get("target"),
		);
		if (!parsedTarget.success) {
			return c.json({ error: "target must be thread or post" }, 400);
		}

		const objectPrefix =
			parsedTarget.data === "thread" ? "thread-image" : "post-image";
		const objectKey = `${objectPrefix}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
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
