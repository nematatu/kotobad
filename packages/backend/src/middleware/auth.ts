import { getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import type { AppEnvironment } from "../types";
import { resolveCookieSecurity } from "../utils/cookies";
import {
	signAccessToken,
	verifyAccessToken,
	verifyRefreshToken,
} from "../utils/jwt";

export const authMiddleware = createMiddleware<AppEnvironment>(
	async (c, next) => {
		const accessToken = getCookie(c, "accessToken");
		if (!accessToken) {
			return c.json({ error: "Unauthorized not accessToken" }, 401);
		}

		try {
			const payload = verifyAccessToken(accessToken);

			c.set("user", payload);
			await next();
		} catch (_error) {
			const refreshToken = getCookie(c, "refreshToken");

			if (!refreshToken) {
				return c.json({ error: "Unauthorized not refreshToken" }, 401);
			}

			try {
				const refreshPayload = verifyRefreshToken(refreshToken);

				const newAccessToken = signAccessToken({
					id: refreshPayload.id,
					username: refreshPayload.username,
				});

				const { secure, sameSite } = resolveCookieSecurity(c.env.APP_ENV);
				setCookie(c, "accessToken", newAccessToken, {
					httpOnly: true,
					secure,
					sameSite,
				});

				c.set("user", refreshPayload);
				await next();
			} catch (_e) {}
			return c.json({ error: "Invalid token" }, 401);
		}
	},
);
