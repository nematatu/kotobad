import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { basicAuth } from "hono/basic-auth";
import { cors } from "hono/cors";
import { csrfOriginMiddleware } from "../middleware/csrf-origin";
import { internalAuthMiddleware } from "../middleware/internal-auth";
import { backendRateLimitMiddleware } from "../middleware/rate-limit";
import { turnstileMiddleware } from "../middleware/turnstile";
import type { AppEnvironment } from "../types";
import { isAllowedOrigin } from "../utils/isAllowedOrigin";
import bbsRouter from "./bbs";
import { betterAuthHandler, betterAuthPath } from "./better-auth-handler";

const mainRouter = new OpenAPIHono<AppEnvironment>()
	.doc("/specification", {
		openapi: "3.0.0",
		info: {
			title: "API Documentation",
			version: "1.0.0",
			description: "認証APIと掲示板APIのドキュメント",
		},
	})
	.use(
		"/*",
		cors({
			origin(origin, c) {
				if (!origin) {
					return "";
				}
				return isAllowedOrigin(origin, c.env) ? origin : "";
			},
			allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.use(betterAuthPath, backendRateLimitMiddleware("auth"))
	.use(`${betterAuthPath}/*`, backendRateLimitMiddleware("auth"))
	.use(betterAuthPath, turnstileMiddleware("auth"))
	.use(`${betterAuthPath}/*`, turnstileMiddleware("auth"))
	.all(betterAuthPath, betterAuthHandler)
	.all(`${betterAuthPath}/*`, betterAuthHandler)
	.use("/bbs/*", csrfOriginMiddleware)
	.use("/bbs/*", internalAuthMiddleware)
	.route("/bbs", bbsRouter);

mainRouter.use("/doc/*", async (c, next) => {
	const auth = basicAuth({
		username: "user",
		password: "pass",
	});

	return auth(c, next);
});

mainRouter.get(
	"/doc",
	swaggerUI({
		url: "/specification",
	}),
);

export default mainRouter;
