//OAuth用のミドルウェア

import { createMiddleware } from "hono/factory";
import { createAuth } from "../auth";
import type { AppEnvironment } from "../types";

export const betterAuthMiddleware = createMiddleware<AppEnvironment>(
	async (c, next) => {
		const auth = createAuth({ env: c.env, restRequest: c.req.raw });

		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});
		if (!session?.user) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		try {
			const payload = {
				id: session.user.id,
				username: session.user.name ?? "",
			};

			c.set("betterAuthUser", payload);
			await next();
		} catch (_error) {
			return c.json({ error: "Invalid token" }, 401);
		}
	},
);
