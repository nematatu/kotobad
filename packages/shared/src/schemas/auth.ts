import { z } from "@hono/zod-openapi";

export const LoginSignupSchema = z.object({
	username: z.string(),
	password: z.string(),
});

export const UserJWTSchema = z.object({
	id: z.number(),
	username: z.string(),
});
