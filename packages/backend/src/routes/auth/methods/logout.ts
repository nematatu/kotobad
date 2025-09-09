import { RouteHandler, createRoute, z } from "@hono/zod-openapi";
import { AppEnvironment } from "../../../types";
import { deleteCookie } from "hono/cookie";
import { SimpleErrorResponse } from "@b3s/shared/src/schemas/error";

export const logoutRoute = createRoute({
	method: "delete",
	path: "/logout",
	description: "ログアウト",
	responses: {
		201: {
			description: "ログアウト成功",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string(),
					}),
				},
			},
		},
		500: {
			description: "ユーザネームもしくはパスワードがリクエストにありません",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
	},
});

export const logoutRouter: RouteHandler<
	typeof logoutRoute,
	AppEnvironment
> = async (c) => {
	try {
		deleteCookie(c, "token");
		return c.json({ message: "Logout successfully!" }, 201);
	} catch (e) {
		return c.json({ error: "internal server error" }, 500);
	}
};

export type logoutRouterType = typeof logoutRouter;
