import { z } from "@hono/zod-openapi";

export const UserRecentThreadSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1),
	postCount: z.number().int().nonnegative(),
	createdAt: z.string(),
});

export const UserRecentPostSchema = z.object({
	id: z.number().int().positive(),
	threadId: z.number().int().positive(),
	threadTitle: z.string().min(1),
	localId: z.number().int().positive(),
	post: z.string(),
	createdAt: z.string(),
});

export const UserProfileSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	image: z.string().nullable().optional(),
	bio: z.string().nullable(),
	createdAt: z.string(),
	threadCount: z.number().int().nonnegative(),
	postCount: z.number().int().nonnegative(),
	recentThreads: z.array(UserRecentThreadSchema),
	recentPosts: z.array(UserRecentPostSchema),
});
