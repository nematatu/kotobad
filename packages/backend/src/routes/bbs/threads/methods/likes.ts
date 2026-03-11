import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { SetThreadLikesResponseSchema } from "@kotobad/shared/src/schemas/thread";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { and, eq, sql } from "drizzle-orm";
import { threadLikes } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import {
	OpenAPISetThreadLikesResponseSchema,
	OpenAPISetThreadLikesSchema,
} from "../../../../models/threads";
import type { AppEnvironment } from "../../../../types";
import { createNotification } from "../../notifications/methods/createNotification";

export const setThreadLikesRoute = createRoute({
	method: "post",
	path: "/likes/set",
	description: "スレッドにいいねをつける",
	request: {
		body: {
			content: {
				"application/json": {
					schema: OpenAPISetThreadLikesSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "更新後のいいね状態",
			content: {
				"application/json": {
					schema: OpenAPISetThreadLikesResponseSchema,
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
		404: {
			description: "スレッドが見つかりません",
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

export const setThreadLikesRouter: RouteHandler<
	typeof setThreadLikesRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const user = c.get("betterAuthUser");
		const { threadId, active } = c.req.valid("json");

		const thread = await db.query.threads.findFirst({
			where: (t, { eq }) => eq(t.id, threadId),
			columns: { id: true, authorId: true },
		});

		if (!thread) {
			return c.json({ error: "Thread not found" }, 404);
		}

		if (active) {
			const insertedLikes = await db
				.insert(threadLikes)
				.values({
					threadId,
					userId: user.id,
				})
				.onConflictDoNothing({
					target: [threadLikes.threadId, threadLikes.userId],
				})
				.returning({
					threadId: threadLikes.threadId,
				});

			if (insertedLikes.length > 0) {
				c.executionCtx.waitUntil(
					createNotification(db, {
						recipientUserId: thread.authorId,
						senderUserId: user.id,
						type: "thread_like",
						threadId,
					}).catch(console.error),
				);
			}
		} else {
			await db
				.delete(threadLikes)
				.where(
					and(
						eq(threadLikes.threadId, threadId),
						eq(threadLikes.userId, user.id),
					),
				);
		}

		const summaryRows = await db
			.select({
				likeCount: sql<number>`count(*)`,
				likedByMe: sql<number>`coalesce(max(case when ${threadLikes.userId} = ${user.id} then 1 else 0 end), 0)`,
			})
			.from(threadLikes)
			.where(eq(threadLikes.threadId, threadId));

		const summary = summaryRows[0];
		const response = SetThreadLikesResponseSchema.parse({
			threadId,
			likeCount: summary?.likeCount ?? 0,
			likedByMe: summary?.likedByMe === 1,
		});

		return c.json(response, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{
				error: "Failed to set thread likes",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};

export type SetThreadLikesRouterType = typeof setThreadLikesRoute;
