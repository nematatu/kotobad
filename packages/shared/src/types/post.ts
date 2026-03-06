import type { z } from "zod";
import type {
	CreatePostSchema,
	EditPostSchema,
	GetThreadReplyNotificationsQuerySchema,
	PostListSchema,
	PostSchema,
	ThreadReplyNotificationListSchema,
	ThreadReplyNotificationSchema,
} from "../schemas/post";

export type PostType = z.infer<typeof PostSchema>;

export type CreatePostType = z.infer<typeof CreatePostSchema>;

export type PostListType = z.infer<typeof PostListSchema>;

export type EditPostType = z.infer<typeof EditPostSchema>;

export type GetThreadReplyNotificationsQueryType = z.infer<
	typeof GetThreadReplyNotificationsQuerySchema
>;

export type ThreadReplyNotificationType = z.infer<
	typeof ThreadReplyNotificationSchema
>;

export type ThreadReplyNotificationListType = z.infer<
	typeof ThreadReplyNotificationListSchema
>;
