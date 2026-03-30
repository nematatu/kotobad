import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../types";
import { extractToken } from "../utils/request";

export const requireAdminToken = createMiddleware<AppEnv>(async (c, next) => {
	const expectedToken = c.env.PLAYER_ADMIN_API_TOKEN;
	if (!expectedToken) {
		if (c.env.APP_ENV === "production") {
			console.error("PLAYER_ADMIN_API_TOKEN is not configured in production.");
			return c.json({ error: "server_misconfigured" }, 503);
		}
		await next();
		return;
	}

	const bearerToken = extractToken(c.req.header("authorization"));
	const headerToken =
		c.req.header("x-admin-token") ?? c.req.header("x-api-key");
	const inputToken = bearerToken ?? headerToken;

	if (inputToken !== expectedToken) {
		return c.json({ error: "unauthorized" }, 401);
	}

	await next();
});
