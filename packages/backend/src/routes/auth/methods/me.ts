import { createRoute, type RouteHandler } from "@hono/zod-openapi";
import { SimpleErrorResponse } from "@kotobad/shared/src/schemas/error";
import { OpenAPIUserJWTSchema } from "../../../models/auth";
import type { AppEnvironment } from "../../../types";

export const MeRoute = createRoute({
	method: "get",
	path: "/me",
	description: "ログイン中のユーザー情報を取得",
	responses: {
		201: {
			description: "ユーザーを返す",
			content: {
				"application/json": {
					schema: OpenAPIUserJWTSchema,
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		500: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
	},
});

export const MeRouter: RouteHandler<typeof MeRoute, AppEnvironment> = async (
	c,
) => {
	const user = c.get("user");

	if (!user) {
		return c.json({ error: "Unauthorized" }, 401); // 未ログインなら401
	}
	try {
		return c.json(user, 201);
	} catch {
		return c.json({ error: "Invalid user data" }, 500);
	}
};

export type MeRouterType = typeof MeRouter;
