import { z } from "@hono/zod-openapi";

export const PostReactionSchema = z.object({
	id: z.number().int().positive(),
	reactionCode: z.string().min(1),
	emoji: z.string().min(1),
	count: z.number().int().nonnegative(),
	reactedByMe: z.boolean(),
	sortOrder: z.number().int().nonnegative(),
});

export const ReactionOptionSchema = z.object({
	id: z.number().int().positive(),
	reactionCode: z.string().min(1),
	emoji: z.string().min(1),
	sortOrder: z.number().int().nonnegative(),
});

export const ReactionOptionListSchema = z.array(ReactionOptionSchema);
