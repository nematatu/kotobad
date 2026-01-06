import { z } from "@hono/zod-openapi";

export const TagIconKindSchema = z.enum(["emoji", "image", "text", "none"]);

export const ThreadTagSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1),
	iconType: TagIconKindSchema,
	iconValue: z.string(),
});

export const ThreadThreadTagSchema = z.object({
	threadId: z.number().int().positive(),
	tagId: z.number().int().positive(),
	tags: ThreadTagSchema,
});

export const TagListSchema = z.array(ThreadTagSchema);
