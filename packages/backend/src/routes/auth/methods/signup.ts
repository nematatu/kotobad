import { AppEnvironment } from "../../../types";
import bcrypt from "bcryptjs";
import { users } from "../../../../drizzle/schema";
import { RouteHandler, createRoute, z } from "@hono/zod-openapi";
import { OpenAPILoginSignupSchema } from "../../../models/auth";
import { SimpleErrorResponse } from "@kotobad/shared/src/schemas/error";

export const signupRoute = createRoute({
	method: "post",
	path: "/signup",
	description: "新規登録",
	request: {
		body: {
			content: {
				"application/json": {
					schema: OpenAPILoginSignupSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "ログイン成功",
			content: {
				"application/json": {
					schema: z.object({
						id: z.number(),
						username: z.string(),
					}),
				},
			},
		},
		400: {
			description: "ユーザネームもしくはパスワードがリクエストにありません",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		409: {
			description: "ユーザーネームがすでに存在しています",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
	},
});

export const signupRouter: RouteHandler<
	typeof signupRoute,
	AppEnvironment
> = async (c) => {
	const db = c.get("db");

	const { username, password } = c.req.valid("json");

	if (!username || !password) {
		return c.json({ error: "Username and password are required" }, 400);
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const result = await db
			.insert(users)
			.values({ username, password: hashedPassword })
			.returning({ id: users.id, username: users.username });

		const newUser = result[0];

		return c.json({ id: newUser.id, username: newUser.username }, 201);
	} catch (e) {
		return c.json({ error: "Username already exists" }, 409);
	}
};

export type signupRouterType = typeof signupRouter;
