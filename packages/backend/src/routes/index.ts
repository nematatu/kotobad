import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { apiDocsAuthMiddleware } from "../middleware/api-docs-auth";
import { csrfOriginMiddleware } from "../middleware/csrf-origin";
import { internalAuthMiddleware } from "../middleware/internal-auth";
import { backendRateLimitMiddleware } from "../middleware/rate-limit";
import { turnstileMiddleware } from "../middleware/turnstile";
import type { AppEnvironment } from "../types";
import { isAllowedOrigin } from "../utils/isAllowedOrigin";
import bbsRouter from "./bbs";
import { betterAuthHandler, betterAuthPath } from "./better-auth-handler";

const mainRouter = new OpenAPIHono<AppEnvironment>();

mainRouter.use("/doc", apiDocsAuthMiddleware);
mainRouter.use("/doc/*", apiDocsAuthMiddleware);
mainRouter.use("/specification", apiDocsAuthMiddleware);
mainRouter.doc("/specification", {
	openapi: "3.0.0",
	info: {
		title: "API Documentation",
		version: "1.0.0",
		description: "認証APIと掲示板APIのドキュメント",
	},
});
mainRouter.use(
	"/*",
	cors({
		origin(origin, c) {
			if (!origin) {
				return "";
			}
			return isAllowedOrigin(origin, c.env) ? origin : "";
		},
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
		credentials: true,
	}),
);
mainRouter.use(betterAuthPath, backendRateLimitMiddleware("auth"));
mainRouter.use(`${betterAuthPath}/*`, backendRateLimitMiddleware("auth"));
mainRouter.use(betterAuthPath, turnstileMiddleware("auth"));
mainRouter.use(`${betterAuthPath}/*`, turnstileMiddleware("auth"));
mainRouter.all(betterAuthPath, betterAuthHandler);
mainRouter.all(`${betterAuthPath}/*`, betterAuthHandler);
mainRouter.use("/bbs/*", csrfOriginMiddleware);
mainRouter.use("/bbs/*", internalAuthMiddleware);
mainRouter.route("/bbs", bbsRouter);

mainRouter.get(
	"/doc",
	swaggerUI({
		url: "/specification",
	}),
);

export default mainRouter;
