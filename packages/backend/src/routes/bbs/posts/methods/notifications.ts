import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { and, asc, eq, gt, ne, or } from "drizzle-orm";
import { posts, threads, user } from "../../../../../drizzle/schema";
import { ErrorResponse } from "../../../../models/error";
import {
	OpenAPIGetThreadReplyNotificationsQuerySchema,
	OpenAPIThreadReplyNotificationListSchema,
} from "../../../../models/posts";
import type { AppEnvironment } from "../../../../types";

const POST_EXCERPT_MAX_LENGTH = 120;

const toPostExcerpt = (text: string): string => {
	if (text.length <= POST_EXCERPT_MAX_LENGTH) {
		return text;
	}
	return `${text.slice(0, POST_EXCERPT_MAX_LENGTH)}...`;
};

export const getThreadReplyNotificationsRoute = createRoute({
	method: "get",
	path: "/notifications/replies",
	description: "自分のスレッドに付いた他ユーザーの返信通知を取得",
	request: {
		query: OpenAPIGetThreadReplyNotificationsQuerySchema,
	},
	responses: {
		200: {
			description: "返信通知一覧",
			content: {
				"application/json": {
					schema: OpenAPIThreadReplyNotificationListSchema,
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

export const getThreadReplyNotificationsRouter: RouteHandler<
	typeof getThreadReplyNotificationsRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const { cursorCreatedAt, cursorPostId, limit } = c.req.valid("query");
		const authUser = c.get("betterAuthUser");

		const conditions = [
			eq(threads.authorId, authUser.id),
			ne(posts.authorId, authUser.id),
		];

		if (
			typeof cursorCreatedAt === "number" &&
			typeof cursorPostId === "number"
		) {
			const cursorDate = new Date(cursorCreatedAt * 1000);
			const cursorCondition = or(
				gt(posts.createdAt, cursorDate),
				and(eq(posts.createdAt, cursorDate), gt(posts.id, cursorPostId)),
			);
			if (cursorCondition) {
				conditions.push(cursorCondition);
			}
		}

		const rows = await db
			.select({
				postId: posts.id,
				threadId: posts.threadId,
				threadTitle: threads.title,
				postText: posts.post,
				createdAt: posts.createdAt,
				repliedById: posts.authorId,
				repliedByName: user.name,
				repliedByImage: user.image,
			})
			.from(posts)
			.innerJoin(threads, eq(posts.threadId, threads.id))
			.leftJoin(user, eq(posts.authorId, user.id))
			.where(and(...conditions))
			.orderBy(asc(posts.createdAt), asc(posts.id))
			.limit(limit);

		const notifications = rows.map((row) => ({
			postId: row.postId,
			threadId: row.threadId,
			threadTitle: row.threadTitle,
			postExcerpt: toPostExcerpt(row.postText),
			createdAt: row.createdAt.toISOString(),
			repliedBy: {
				id: row.repliedById,
				name: row.repliedByName ?? "ユーザー",
				image: row.repliedByImage ?? null,
			},
		}));

		return c.json({ notifications }, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{
				error: "Failed to fetch thread reply notifications",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};
