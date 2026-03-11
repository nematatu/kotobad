import { z } from "@hono/zod-openapi";

export const NotificationTypeSchema = z.enum([
	"thread_reply",
	"post_reply",
	"thread_like",
	"post_reaction",
]);

export const NotificationUnreadCountSchema = z.object({
	count: z.number().int().nonnegative(),
});

export const NotificationItemSchema = z.object({
	id: z.number().int().positive(),
	type: NotificationTypeSchema,
	count: NotificationUnreadCountSchema,
	message: z.string().min(1),
	href: z.string(),
	threadId: z.number().int().positive().nullable(),
	targetPostId: z.number().int().positive().nullable(),
	reactionEmoji: z.string().min(1).nullable(),
	createdAt: z.string(),
	readAt: z.string().nullable(),
	sender: z.object({
		id: z.string(),
		name: z.string().nullable(),
		image: z.string().nullable(),
	}),
});

export const NotificationListSchema = z.array(NotificationItemSchema);
