import { z } from "@hono/zod-openapi";
import { PostReactionSchema } from "./reaction";

export const PostSchema = z.object({
	id: z.number().int().positive(),
	localId: z.number().int().positive(),
	post: z.string().min(1),
	authorId: z.string(),
	replyToPostId: z.number().int().nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string().nullable(),
	reactions: z.array(PostReactionSchema).default([]),
	replyCount: z.number().int().nonnegative(),
	author: z.object({
		name: z.string(),
		image: z.string().optional().nullable(),
	}),
});

export const CreatePostSchema = PostSchema.pick({
	post: true,
	replyToPostId: true,
}).extend({
	threadId: z.number().int().positive(),
});

export const EditPostSchema = CreatePostSchema.partial();

export const PostListSchema = z.array(PostSchema);

export const SetPostReactionsScheme = z.object({
	postId: z.number().int().positive(),
	reactionCode: z.string().min(1),
	active: z.boolean(),
});

export const SetPostReactionsResponseSchema = z.object({
	postId: z.number().int().positive(),
	reactions: z.array(PostReactionSchema),
});
