import { z } from "@hono/zod-openapi";
import { PostListSchema } from "./post";
import { ThreadThreadTagSchema } from "./tag";

export const ThreadSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1),
	createdAt: z.string(),
	updatedAt: z.string().nullable(),
	postCount: z.number().int().nonnegative(),
	authorId: z.string(),
	isPinned: z.boolean().optional(),
	isClosed: z.boolean().optional(),
	author: z.object({
		name: z.string(),
	}),
	threadTags: z.array(ThreadThreadTagSchema),
});

export const CreateThreadSchema = ThreadSchema.pick({
	title: true,
}).extend({
	tagIds: z.array(z.number().int().positive()).default([]),
});

export const EditThreadSchema = ThreadSchema.partial();

export const ThreadListSchema = z.object({
	threads: z.array(ThreadSchema),
	totalCount: z.number(),
});

export const ThreadWithPostsSchema = z.object({
	thread: ThreadSchema,
	posts: PostListSchema,
});
