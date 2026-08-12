// CSRF対策用にOrigin/Refererヘッダーをチェックするミドルウェア

import { createMiddleware } from "hono/factory";
import type { AppEnvironment } from "../types";
import { isAllowedOrigin } from "../utils/isAllowedOrigin";

type CsrfEnvironment = {
	Bindings: Pick<AppEnvironment["Bindings"], "ALLOWED_ORIGINS">;
};

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

const CSRF_TOKEN_HEADER = "x-csrf-token";
const CSRF_COOKIE_NAMES = ["__Host-csrf_token", "dev_csrf_token"];
const MAX_CSRF_TOKEN_LENGTH = 2048;

const resolveCookieValue = (
	cookieHeader: string | undefined,
	cookieNames: readonly string[],
): string | null => {
	if (!cookieHeader) return null;

	for (const cookie of cookieHeader.split(";")) {
		const separatorIndex = cookie.indexOf("=");
		if (separatorIndex === -1) continue;

		const name = cookie.slice(0, separatorIndex).trim();
		if (!cookieNames.includes(name)) continue;

		return cookie.slice(separatorIndex + 1).trim();
	}

	return null;
};

export const isValidCsrfToken = (
	cookieHeader: string | undefined,
	headerToken: string | undefined,
): boolean => {
	if (!headerToken || headerToken.length > MAX_CSRF_TOKEN_LENGTH) {
		return false;
	}

	const cookieToken = resolveCookieValue(cookieHeader, CSRF_COOKIE_NAMES);
	return cookieToken === headerToken;
};

export const csrfOriginMiddleware = createMiddleware<CsrfEnvironment>(
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

		if (
			!isValidCsrfToken(c.req.header("cookie"), c.req.header(CSRF_TOKEN_HEADER))
		) {
			return c.json({ error: "Invalid CSRF token." }, 403);
		}

		return next();
	},
);
