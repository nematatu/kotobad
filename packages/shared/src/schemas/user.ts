import { z } from "@hono/zod-openapi";

const UserRecentThreadSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1),
	postCount: z.number().int().nonnegative(),
	createdAt: z.string(),
});

const UserRecentPostSchema = z.object({
	id: z.number().int().positive(),
	threadId: z.number().int().positive(),
	threadTitle: z.string().min(1),
	localId: z.number().int().positive(),
	post: z.string(),
	createdAt: z.string(),
});

export const FavoritePlayerSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1),
	imageUrl: z.string().url().nullable(),
});

export const UserProfileSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	image: z.string().nullable().optional(),
	headerImage: z.string().url().nullable().optional(),
	bio: z.string().nullable(),
	favoritePlayers: z.array(FavoritePlayerSchema),
	createdAt: z.string(),
	threadCount: z.number().int().nonnegative(),
	postCount: z.number().int().nonnegative(),
	recentThreads: z.array(UserRecentThreadSchema),
	recentPosts: z.array(UserRecentPostSchema),
});

export const UpdateUserProfileSchema = z.object({
	name: z.string().min(1).max(20).optional(),
	bio: z.string().max(240).nullable().optional(),
	favoritePlayerIds: z
		.array(z.coerce.number().int().positive())
		.max(3)
		.refine((ids) => new Set(ids).size === ids.length, {
			message: "favoritePlayerIds に重複は指定できません",
		})
		.optional(),
	image: z
		.file()
		.max(2 * 1024 * 1024)
		.mime([
			"image/png",
			"image/jpeg",
			"image/webp",
			"image/avif",
			"image/svg+xml",
		])
		.openapi({ type: "string", format: "binary" })
		.optional(),
	headerImage: z
		.file()
		.max(6 * 1024 * 1024)
		.mime([
			"image/png",
			"image/jpeg",
			"image/webp",
			"image/avif",
			"image/svg+xml",
		])
		.openapi({ type: "string", format: "binary" })
		.optional(),
});

export const UpdateUserProfileResponseSchema = z.object({
	updated: z.boolean(),
	user: z.object({
		name: z.string().min(1),
		bio: z.string().nullable(),
		image: z.string().nullable(),
		headerImage: z.string().url().nullable(),
		favoritePlayers: z.array(FavoritePlayerSchema),
	}),
});

export const UserProfileSelectablePlayerSchema = z.object({
	id: z.number().int().positive(),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	firstFurigana: z.string(),
	lastFurigana: z.string(),
	englishFirstName: z.string().min(1),
	englishLastName: z.string().min(1),
	imageUrl: z.string().url().nullable(),
});

export const UserProfileSelectablePlayersSchema = z.object({
	players: z.array(UserProfileSelectablePlayerSchema),
});
