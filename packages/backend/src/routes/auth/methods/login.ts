import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import { SimpleErrorResponse } from "@kotobad/shared/src/schemas/error";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { users } from "../../../../drizzle/schema";
import { OpenAPILoginSignupSchema } from "../../../models/auth";
import type { AppEnvironment, UserTokenPayload } from "../../../types";
import { signAccessToken, signRefreshToken } from "../../../utils/jwt";

export const loginRoute = createRoute({
	method: "post",
	path: "/login",
	description: "ログイン",
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
						message: z.string(),
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
		401: {
			description: "ユーザーが存在しません",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		402: {
			description: "パスワードが異なります",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		500: {
			description: "パスワードが異なります",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
	},
});

export const loginRouter: RouteHandler<
	typeof loginRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const { username, password } = c.req.valid("json");

		if (!username || !password)
			return c.json({ error: "Username and password are required" }, 400);

		const result = await db
			.select()
			.from(users)
			.where(eq(users.username, username));

		const user = result[0];

		if (!user) return c.json({ error: "user not found" }, 401);

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) return c.json({ error: "Invalid credentials" }, 402);

		const accessTokenpayload: UserTokenPayload = {
			id: user.id,
			username: user.username,
		};

		const refreshTokenpayload: UserTokenPayload = {
			id: user.id,
			username: user.username,
		};
		const accessToken = signAccessToken(accessTokenpayload);

		const refreshToken = signRefreshToken(refreshTokenpayload);

		const isProduction = c.env.APP_ENV === "production";

		setCookie(c, "accessToken", accessToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: "none",
			maxAge: 60 * 15,
		});

		setCookie(c, "refreshToken", refreshToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: "none",
			maxAge: 60 * 60 * 24 * 30,
		});

		return c.json({ message: "Login successfully!" }, 201);
	} catch (_e) {
		return c.json({ error: "internal server error" }, 500);
	}
};

export type loginRouterType = typeof loginRouter;
