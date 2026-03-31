import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { count, desc, eq } from "drizzle-orm";
import { posts, threads } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { OpenAPIUserProfileSchema } from "../../../../models/users";
import type { AppEnvironment } from "../../../../types";
import {
	findUserFavoritePlayers,
	toFavoritePlayersResponse,
} from "./favoritePlayers";

const MAX_RECENT_THREADS = 8;
const MAX_RECENT_POSTS = 10;

export const getUserProfileByIdRoute = createRoute({
	method: "get",
	path: "/{id}",
	description: "idからユーザープロフィールを取得",
	request: {
		params: z.object({
			id: z.string().openapi({
				param: {
					name: "id",
					in: "path",
				},
				example: "EkelETg7gPh5k1O3IZArWR1qnDqPvpPi",
			}),
		}),
	},
	responses: {
		200: {
			description: "取得したユーザープロフィール",
			content: {
				"application/json": {
					schema: OpenAPIUserProfileSchema,
				},
			},
		},
		404: {
			description: "ユーザーが見つかりません",
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

export const getUserProfileByIdRouter: RouteHandler<
	typeof getUserProfileByIdRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const userId = c.req.param("id");

		const targetUser = await db.query.user.findFirst({
			where: (table, { eq }) => eq(table.id, userId),
			columns: {
				id: true,
				name: true,
				image: true,
				bio: true,
				createdAt: true,
			},
		});

		if (!targetUser) {
			return c.json({ error: "User not found" }, 404);
		}

		const [
			threadCountRow,
			postCountRow,
			recentThreads,
			recentPosts,
			favoritePlayers,
		] = await Promise.all([
			db
				.select({ value: count() })
				.from(threads)
				.where(eq(threads.authorId, userId)),
			db
				.select({ value: count() })
				.from(posts)
				.where(eq(posts.authorId, userId)),
			db.query.threads.findMany({
				where: (table, { eq }) => eq(table.authorId, userId),
				columns: {
					id: true,
					title: true,
					postCount: true,
					createdAt: true,
				},
				orderBy: (table, { desc }) => [desc(table.createdAt), desc(table.id)],
				limit: MAX_RECENT_THREADS,
			}),
			db.query.posts.findMany({
				where: (table, { eq }) => eq(table.authorId, userId),
				columns: {
					id: true,
					threadId: true,
					localId: true,
					post: true,
					createdAt: true,
				},
				with: {
					threads: {
						columns: {
							id: true,
							title: true,
						},
					},
				},
				orderBy: [desc(posts.createdAt), desc(posts.id)],
				limit: MAX_RECENT_POSTS,
			}),
			findUserFavoritePlayers(db, userId),
		]);

		const threadCount = threadCountRow[0]?.value ?? 0;
		const postCount = postCountRow[0]?.value ?? 0;

		const response = {
			id: targetUser.id,
			name: targetUser.name,
			image: targetUser.image ?? null,
			bio: targetUser.bio ?? null,
			favoritePlayers: toFavoritePlayersResponse(favoritePlayers),
			createdAt: targetUser.createdAt.toISOString(),
			threadCount,
			postCount,
			recentThreads: recentThreads.map((thread) => ({
				id: thread.id,
				title: thread.title,
				postCount: thread.postCount,
				createdAt: thread.createdAt.toISOString(),
			})),
			recentPosts: recentPosts.map((post) => ({
				id: post.id,
				threadId: post.threadId,
				threadTitle: post.threads?.title ?? "スレッド",
				localId: post.localId,
				post: post.post,
				createdAt: post.createdAt.toISOString(),
			})),
		};

		return c.json(response, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{
				error: "Failed to fetch user profile",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};
