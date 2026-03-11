import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { desc, eq } from "drizzle-orm";
import { notifications, posts, user } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { OpenAPINotificationListSchema } from "../../../../models/notifications";
import type { AppEnvironment } from "../../../../types";

const buildNotificationMessage = (input: {
	type: "thread_reply" | "post_reply" | "thread_like" | "post_reaction";
	reactionEmoji?: string | null;
	postMesssage?: string | null;
}) => {
	switch (input.type) {
		case "thread_reply":
			return input.postMesssage ?? "新しい投稿があります";
		case "post_reply":
			return input.postMesssage ?? "返信が届いています";
		case "thread_like":
			return "あなたの投稿にいいねしました";
		case "post_reaction":
			return input.reactionEmoji ?? "リアクションしました";
	}
};

export const getNotificationsRoute = createRoute({
	method: "get",
	path: "/",
	description: "通知一覧を取得",
	responses: {
		200: {
			description: "通知一覧",
			content: {
				"application/json": {
					schema: OpenAPINotificationListSchema,
				},
			},
		},
		401: {
			description: "未認証",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		500: {
			description: "サーバーエラー",
			content: {
				"application/json": {
					schema: ErrorResponse,
				},
			},
		},
	},
});

export const getNotificationsRouter: RouteHandler<
	typeof getNotificationsRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const currentUser = c.get("betterAuthUser");

		if (!currentUser?.id) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		const rows = await db
			.select({
				id: notifications.id,
				type: notifications.type,
				threadId: notifications.threadId,
				targetPostId: notifications.targetPostId,
				reactionEmoji: notifications.reactionEmoji,
				sendedPostMessage: posts.post,
				createdAt: notifications.createdAt,
				readAt: notifications.readAt,
				senderId: user.id,
				senderName: user.name,
				senderImage: user.image,
				sendedPostId: notifications.sendedPostId,
			})
			.from(notifications)
			.innerJoin(user, eq(notifications.senderUserId, user.id))
			.leftJoin(posts, eq(notifications.sendedPostId, posts.id))
			.where(eq(notifications.recipientUserId, currentUser.id))
			.orderBy(desc(notifications.createdAt), desc(notifications.id))
			.limit(20);

		return c.json(
			rows.map((row) => ({
				id: row.id,
				type: row.type,
				message:
					row.sendedPostMessage ??
					buildNotificationMessage({
						type: row.type,
						reactionEmoji: row.reactionEmoji,
						postMesssage: row.sendedPostMessage,
					}),
				href: row.threadId ? `/threads/${row.threadId}` : "/threads",
				threadId: row.threadId,
				targetPostId: row.targetPostId,
				reactionEmoji: row.reactionEmoji,
				createdAt: row.createdAt.toISOString(),
				sendedPostId: row.sendedPostId,
				readAt: row.readAt ? row.readAt.toISOString() : null,
				sender: {
					id: row.senderId,
					name: row.senderName,
					image: row.senderImage ?? null,
				},
			})),
			200,
		);
	} catch (error: unknown) {
		console.error("Failed to fetch notifications", error);
		return c.json(
			{
				error: "Failed to fetch notifications",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};
