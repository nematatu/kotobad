// CSRF対策用にOrigin/Refererヘッダーをチェックするミドルウェア

import { createMiddleware } from "hono/factory";
import type { AppEnvironment } from "../types";
import { isAllowedOrigin } from "../utils/isAllowedOrigin";

const resolveSourceOrigin = (origin?: string, referer?: string): string => {
	if (origin) {
		return origin;
	}
	if (!referer) {
		return "";
	}
	try {
		return new URL(referer).origin;
	} catch {
		return "";
	}
};

export const csrfOriginMiddleware = createMiddleware<AppEnvironment>(
	async (c, next) => {
		const method = c.req.method.toUpperCase();
		if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
			await next();
			return;
		}

		const origin = c.req.header("origin");
		const referer = c.req.header("referer");
		const sourceOrigin = resolveSourceOrigin(origin, referer);

		if (!sourceOrigin || !isAllowedOrigin(sourceOrigin, c.env)) {
			return c.json({ error: "Forbidden origin." }, 403);
		}
		return next();
	},
);
