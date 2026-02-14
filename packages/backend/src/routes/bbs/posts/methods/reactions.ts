import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { SetPostReactionsResponseSchema } from "@kotobad/shared/src/schemas/post";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { and, asc, eq, sql } from "drizzle-orm";
import { postReactions, reactions } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import {
	OpenAPIPostSetPostReactionsResponseScheme,
	OpenAPIPostSetPostReactionsScheme,
} from "../../../../models/posts";
import type { AppEnvironment } from "../../../../types";

export const setPostReactionsRoute = createRoute({
	method: "post",
	path: "/set",
	description: "ポストにリアクションをつける",
	request: {
		body: {
			content: {
				"application/json": {
					schema: OpenAPIPostSetPostReactionsScheme,
				},
			},
		},
	},
	responses: {
		200: {
			description: "リアクションした投稿",
			content: {
				"application/json": {
					schema: OpenAPIPostSetPostReactionsResponseScheme,
				},
			},
		},
		400: {
			description: "バリデーションエラー",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		404: {
			description: "ポストが見つかりません",
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

export const setPostReactionsRouter: RouteHandler<
	typeof setPostReactionsRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const user = c.get("betterAuthUser");

		const { postId, reactionCode, active } = c.req.valid("json");

		const post = await db.query.posts.findFirst({
			where: (t, { eq }) => eq(t.id, postId),
			columns: { id: true },
		});

		if (!post) {
			return c.json({ error: "Post not found" }, 404);
		}

		const reaction = await db.query.reactions.findFirst({
			where: (t, { and, eq }) =>
				and(eq(t.code, reactionCode), eq(t.isActive, true)),
			columns: { id: true },
		});

		if (!reaction) {
			return c.json({ error: "Reaction not found" }, 404);
		}

		if (active) {
			await db
				.insert(postReactions)
				.values({
					postId,
					reactionId: reaction.id,
					userId: user.id,
				})
				.onConflictDoNothing({
					target: [
						postReactions.postId,
						postReactions.reactionId,
						postReactions.userId,
					],
				});
		} else {
			await db
				.delete(postReactions)
				.where(
					and(
						eq(postReactions.postId, postId),
						eq(postReactions.reactionId, reaction.id),
						eq(postReactions.userId, user.id),
					),
				);
		}

		const rows = await db
			.select({
				id: reactions.id,
				reactionCode: reactions.code,
				emoji: reactions.emoji,
				sortOrder: reactions.sortOrder,
				count: sql<number>`count(*)`,
				reactedByMe: sql<number>`max(case when ${postReactions.userId} = ${user.id} then 1 else 0 end)`,
			})
			.from(postReactions)
			.innerJoin(reactions, eq(postReactions.reactionId, reactions.id))
			.where(eq(postReactions.postId, postId))
			.groupBy(
				reactions.id,
				reactions.code,
				reactions.emoji,
				reactions.sortOrder,
			)
			.orderBy(asc(reactions.sortOrder));

		const response = SetPostReactionsResponseSchema.parse({
			postId,
			reactions: rows.map((r) => ({
				id: r.id,
				reactionCode: r.reactionCode,
				emoji: r.emoji,
				sortOrder: r.sortOrder,
				count: r.count,
				reactedByMe: r.reactedByMe === 1,
			})),
		});

		return c.json(response, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{
				error: "Failed to set post reactions",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};

export type SetPostReactionsRouterType = typeof setPostReactionsRoute;
