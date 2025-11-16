import { z } from "zod";

export const PostSchema = z.object({
	id: z.number().int().positive(),
	localId: z.number().int().positive(),
	post: z.string().min(1),
	authorId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string().nullable(),
	author: z
		.object({
			name: z.string(),
		})
		.optional(),
});

export const CreatePostSchema = PostSchema.pick({
	post: true,
}).extend({
	threadId: z.number().int().positive(),
});

export const EditPostSchema = CreatePostSchema.partial();

export const PostListSchema = z.array(PostSchema);
