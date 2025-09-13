import { z } from "zod";
import { ThreadThreadLabelSchema } from "./label";

export const ThreadSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1),
	createdAt: z.string(),
	updatedAt: z.string().nullable(),
	postCount: z.number().int().nonnegative(),
	authorId: z.number().int().positive(),
	isPinned: z.boolean().optional(),
	isClosed: z.boolean().optional(),
	author: z.object({
		username: z.string().optional(),
	}),
	threadLabels: z.array(ThreadThreadLabelSchema),
});

export const CreateThreadSchema = ThreadSchema.pick({
	title: true,
});

export const EditThreadSchema = ThreadSchema.partial();
export const ThreadListSchema = z.object({
	threads: z.array(ThreadSchema),
	totalCount: z.number(),
});
