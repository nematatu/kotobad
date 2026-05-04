import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { UpdateUserProfileSchema } from "@kotobad/shared/src/schemas/user";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { eq, inArray } from "drizzle-orm";
import {
	players,
	user,
	userFavoritePlayers,
} from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import {
	OpenAPIUpdateUserProfileResponseSchema,
	OpenAPIUpdateUserProfileSchema,
} from "../../../../models/users";
import type { AppEnvironment } from "../../../../types";
import { resolveAllowedImageFile } from "../../../../utils/upload/imageFile";
import {
	findUserFavoritePlayers,
	hasSameNumberOrder,
	toFavoritePlayersResponse,
} from "./favoritePlayers";

const R2_PUT_MAX_ATTEMPTS = 3;
const R2_PUT_RETRY_DELAY_MS = 150;

const sleep = (ms: number) =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});

const putObjectWithRetry = async ({
	bucket,
	objectKey,
	fileBuffer,
	contentType,
}: {
	bucket: AppEnvironment["Bindings"]["KOTOBAD_BUCKET"];
	objectKey: string;
	fileBuffer: ArrayBuffer;
	contentType: string;
}) => {
	const fileBytes = new Uint8Array(fileBuffer);
	let lastError: unknown = null;
	for (let attempt = 1; attempt <= R2_PUT_MAX_ATTEMPTS; attempt++) {
		try {
			await bucket.put(objectKey, fileBytes.slice(), {
				httpMetadata: {
					contentType,
					cacheControl: "public, max-age=31536000, immutable",
				},
			});
			return;
		} catch (error: unknown) {
			lastError = error;
			if (attempt >= R2_PUT_MAX_ATTEMPTS) break;
			await sleep(R2_PUT_RETRY_DELAY_MS * attempt);
		}
	}
	throw new Error(`R2 put failed: ${getErrorMessage(lastError)}`);
};

const toPublicR2Url = (baseUrl: string, objectKey: string): string => {
	const normalized = baseUrl.trim().replace(/\/+$/, "");
	return `${normalized}/${objectKey}`;
};

const toObjectKeyFromPublicR2Url = (
	publicUrl: string,
	baseUrl: string,
): string | null => {
	const normalizedBase = baseUrl.trim().replace(/\/+$/, "");
	const prefix = `${normalizedBase}/`;
	if (!publicUrl.startsWith(prefix)) {
		return null;
	}

	const objectKey = publicUrl.slice(prefix.length);
	return objectKey.length > 0 ? objectKey : null;
};

const toFileFromFormData = (formData: FormData, key: string): File | null => {
	const entry = formData.get(key);
	if (!(entry instanceof File) || entry.size <= 0) {
		return null;
	}
	return entry;
};

export const updateUserProfileRoute = createRoute({
	method: "patch",
	path: "/update",
	description: "ユーザー情報を更新",
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: OpenAPIUpdateUserProfileSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "更新されたかどうか",
			content: {
				"application/json": {
					schema: OpenAPIUpdateUserProfileResponseSchema,
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
		404: {
			description: "Not Found",
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

export const updateUserProfileRouter: RouteHandler<
	typeof updateUserProfileRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const authUser = c.get("betterAuthUser");
		const publicBaseUrl = c.env.R2_PUBLIC_BASE_URL;

		const formData = await c.req.formData();
		const favoritePlayerIds =
			formData.get("favoritePlayersTouched") === "1"
				? formData.getAll("favoritePlayerIds").map((value) => String(value))
				: undefined;
		const avatarFile = toFileFromFormData(formData, "image");
		const headerImageFile = toFileFromFormData(formData, "headerImage");
		const parsedResult = UpdateUserProfileSchema.safeParse({
			name: formData.has("name")
				? String(formData.get("name") ?? "").trim()
				: undefined,
			bio: formData.has("bio") ? String(formData.get("bio") ?? "") : undefined,
			favoritePlayerIds,
			image: avatarFile ?? undefined,
			headerImage: headerImageFile ?? undefined,
		});
		if (!parsedResult.success) {
			const firstIssueMessage = parsedResult.error.issues[0]?.message;
			return c.json(
				{
					error: "Invalid request body",
					message: firstIssueMessage ?? "入力値が不正です",
				},
				400,
			);
		}
		const parsed = parsedResult.data;

		const [current, currentFavorites] = await Promise.all([
			db.query.user.findFirst({
				where: (u, { eq }) => eq(u.id, authUser.id),
				columns: { name: true, bio: true, image: true, headerImage: true },
			}),
			findUserFavoritePlayers(db, authUser.id),
		]);

		if (!current) return c.json({ error: "User not found" }, 404);
		const currentFavoritePlayers = toFavoritePlayersResponse(currentFavorites);

		const currentUser = {
			name: current.name,
			bio: current.bio ?? null,
			image: current.image ?? null,
			headerImage: current.headerImage ?? null,
			favoritePlayers: currentFavoritePlayers,
		};

		const patch: {
			name?: string;
			bio?: string | null;
			image?: string | null;
			headerImage?: string | null;
			updatedAt?: Date;
		} = {};

		if (parsed.name !== undefined && parsed.name !== current.name) {
			patch.name = parsed.name;
		}
		if (parsed.bio !== undefined && parsed.bio !== current.bio) {
			patch.bio = parsed.bio;
		}

		const currentFavoritePlayerIds = currentFavoritePlayers.map(
			(player) => player.id,
		);
		const nextFavoritePlayerIds =
			parsed.favoritePlayerIds ?? currentFavoritePlayerIds;
		const shouldUpdateFavoritePlayers =
			parsed.favoritePlayerIds !== undefined &&
			!hasSameNumberOrder(currentFavoritePlayerIds, nextFavoritePlayerIds);

		const oldImageUrlsToDelete: string[] = [];
		const hasUploadRequest = avatarFile !== null || headerImageFile !== null;
		if (hasUploadRequest && !publicBaseUrl) {
			return c.json(
				{
					error: "Failed to update profile",
					message: "R2 public base url is not configured",
				},
				500,
			);
		}

		const uploadProfileImage = async (
			file: File,
			objectPrefix: "user-icon" | "user-header",
		): Promise<
			{ ok: true; imageUrl: string } | { ok: false; error: string }
		> => {
			const imageFile = resolveAllowedImageFile(file);
			if (!imageFile.ok) {
				return imageFile;
			}
			const fileBuffer = await file.arrayBuffer();
			const objectKey = `${objectPrefix}/${Date.now()}-${crypto.randomUUID()}.${imageFile.extension}`;
			await putObjectWithRetry({
				bucket: c.env.KOTOBAD_BUCKET,
				objectKey,
				fileBuffer,
				contentType: file.type,
			});
			return {
				ok: true,
				imageUrl: toPublicR2Url(publicBaseUrl ?? "", objectKey),
			};
		};

		if (avatarFile) {
			const uploadResult = await uploadProfileImage(avatarFile, "user-icon");
			if (!uploadResult.ok) {
				return c.json({ error: uploadResult.error }, 400);
			}
			const imageUrl = uploadResult.imageUrl;
			if (imageUrl !== current.image) {
				patch.image = imageUrl;
				if (current.image) {
					oldImageUrlsToDelete.push(current.image);
				}
			}
		}

		if (headerImageFile) {
			const uploadResult = await uploadProfileImage(
				headerImageFile,
				"user-header",
			);
			if (!uploadResult.ok) {
				return c.json({ error: uploadResult.error }, 400);
			}
			const headerImageUrl = uploadResult.imageUrl;
			if (headerImageUrl !== current.headerImage) {
				patch.headerImage = headerImageUrl;
				if (current.headerImage) {
					oldImageUrlsToDelete.push(current.headerImage);
				}
			}
		}

		const shouldUpdateUser = Object.keys(patch).length > 0;
		if (!shouldUpdateUser && !shouldUpdateFavoritePlayers) {
			return c.json(
				{
					updated: false,
					user: currentUser,
				},
				200,
			);
		}

		if (shouldUpdateFavoritePlayers && nextFavoritePlayerIds.length > 0) {
			const existingPlayers = await db
				.select({ id: players.id })
				.from(players)
				.where(inArray(players.id, nextFavoritePlayerIds));
			if (existingPlayers.length !== nextFavoritePlayerIds.length) {
				return c.json(
					{ error: "favoritePlayerIds に存在しない選手IDが含まれています" },
					400,
				);
			}
		}

		if (shouldUpdateUser) {
			patch.updatedAt = new Date();
			await db.update(user).set(patch).where(eq(user.id, authUser.id));
		}

		if (shouldUpdateFavoritePlayers) {
			await db
				.delete(userFavoritePlayers)
				.where(eq(userFavoritePlayers.userId, authUser.id));
			if (nextFavoritePlayerIds.length > 0) {
				await db.insert(userFavoritePlayers).values(
					nextFavoritePlayerIds.map((playerId, index) => ({
						userId: authUser.id,
						playerId,
						sortOrder: index,
					})),
				);
			}
		}

		if (publicBaseUrl) {
			for (const oldImageUrlToDelete of new Set(oldImageUrlsToDelete)) {
				const oldObjectKey = toObjectKeyFromPublicR2Url(
					oldImageUrlToDelete,
					publicBaseUrl,
				);
				if (!oldObjectKey) {
					continue;
				}
				try {
					await c.env.KOTOBAD_BUCKET.delete(oldObjectKey);
				} catch (deleteError: unknown) {
					console.error("Failed to delete old profile object", deleteError);
				}
			}
		}

		const favoritePlayers = shouldUpdateFavoritePlayers
			? toFavoritePlayersResponse(
					await findUserFavoritePlayers(db, authUser.id),
				)
			: currentFavoritePlayers;

		return c.json(
			{
				updated: true,
				user: {
					name: patch.name ?? currentUser.name,
					bio: patch.bio ?? currentUser.bio,
					image: patch.image ?? currentUser.image,
					headerImage: patch.headerImage ?? currentUser.headerImage,
					favoritePlayers,
				},
			},
			200,
		);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{
				error: "Failed to update profile",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};
