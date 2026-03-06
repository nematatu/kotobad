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

export const GetThreadReplyNotificationsQuerySchema = z
	.object({
		cursorCreatedAt: z.coerce.number().int().nonnegative().optional(),
		cursorPostId: z.coerce.number().int().positive().optional(),
		limit: z.coerce.number().int().positive().max(50).default(20),
	})
	.superRefine((value, ctx) => {
		const hasCreatedAt = typeof value.cursorCreatedAt === "number";
		const hasPostId = typeof value.cursorPostId === "number";
		if (hasCreatedAt !== hasPostId) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "cursorCreatedAt and cursorPostId must be provided together",
				path: hasCreatedAt ? ["cursorPostId"] : ["cursorCreatedAt"],
			});
		}
	});

export const ThreadReplyNotificationSchema = z.object({
	postId: z.number().int().positive(),
	threadId: z.number().int().positive(),
	threadTitle: z.string().min(1),
	postExcerpt: z.string(),
	createdAt: z.string(),
	repliedBy: z.object({
		id: z.string(),
		name: z.string(),
		image: z.string().nullable().optional(),
	}),
});

export const ThreadReplyNotificationListSchema = z.object({
	notifications: z.array(ThreadReplyNotificationSchema),
});

export const ThreadReplyPushSubscriptionSchema = z.object({
	endpoint: z.string().url(),
	expirationTime: z.number().nullable().optional(),
	keys: z.object({
		p256dh: z.string().min(1),
		auth: z.string().min(1),
	}),
});

export const SetThreadReplyPushSubscriptionSchema = z.object({
	active: z.boolean(),
	subscription: ThreadReplyPushSubscriptionSchema,
});

export const SetThreadReplyPushSubscriptionResponseSchema = z.object({
	active: z.boolean(),
});
