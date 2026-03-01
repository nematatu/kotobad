import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { eq } from "drizzle-orm";
import { user } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { OpenAPIUploadAvatarResponseSchema } from "../../../../models/users";
import type { AppEnvironment } from "../../../../types";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const MIME_TYPE_TO_EXTENSION: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/avif": "avif",
};

const toPublicAvatarUrl = (baseUrl: string, objectKey: string): string => {
	const normalized = baseUrl.trim().replace(/\/+$/, "");
	return `${normalized}/${objectKey}`;
};

export const uploadMyAvatarRoute = createRoute({
	method: "post",
	path: "/me/avatar",
	description: "ログイン中ユーザーのアイコン画像をR2へアップロードします",
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: z.object({
						file: z.any(),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: "更新されたアイコンURL",
			content: {
				"application/json": {
					schema: OpenAPIUploadAvatarResponseSchema,
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

export const uploadMyAvatarRouter: RouteHandler<
	typeof uploadMyAvatarRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const authUser = c.get("betterAuthUser");
		const publicBaseUrl = c.env.R2_PUBLIC_BASE_URL;

		if (!publicBaseUrl) {
			return c.json(
				{
					error: "Failed to upload avatar",
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

		if (fileEntry.size > MAX_AVATAR_BYTES) {
			return c.json(
				{ error: "file size must be less than or equal to 2MB" },
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

		const fileBuffer = await fileEntry.arrayBuffer();
		const objectKey = `user-icon/${Date.now()}-${crypto.randomUUID()}.${extension}`;
		await c.env.KOTOBAD_BUCKET.put(objectKey, fileBuffer, {
			httpMetadata: {
				contentType: fileEntry.type,
				cacheControl: "public, max-age=31536000, immutable",
			},
		});

		const imageUrl = toPublicAvatarUrl(publicBaseUrl, objectKey);
		await db
			.update(user)
			.set({
				image: imageUrl,
				updatedAt: new Date(),
			})
			.where(eq(user.id, authUser.id));

		return c.json({ imageUrl }, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{ error: "Failed to upload avatar", message: getErrorMessage(error) },
			500,
		);
	}
};
