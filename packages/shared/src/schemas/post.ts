import { z } from "zod";

export const PostSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1),
	description: z.string().min(1),
	authorId: z.number().int().positive(),
	createdAt: z.date(),
	updatedAt: z.date().nullable(),
	author: z
		.object({
			username: z.string(),
		})
		.optional(),
});

export const CreatePostSchema = PostSchema.pick({
	title: true,
	description: true,
});

export const EditPostSchema = CreatePostSchema.partial();

export const PostListSchema = z.array(PostSchema);
