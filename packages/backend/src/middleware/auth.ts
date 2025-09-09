import { createMiddleware } from "hono/factory";
import { getCookie, setCookie } from "hono/cookie";
import { AppEnvironment } from "../types";
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
		} catch (error) {
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

				setCookie(c, "accessToken", newAccessToken, {
					httpOnly: true,
					secure: true,
				});

				c.set("user", refreshPayload);
				await next();
			} catch (e) {}
			return c.json({ error: "Invalid token" }, 401);
		}
	},
);
