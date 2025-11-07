import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { basicAuth } from "hono/basic-auth";
import { cors } from "hono/cors";
import { authMiddleware } from "../middleware/auth";
import type { AppEnvironment } from "../types";
import authRouter from "./auth";
import bbsRouter from "./bbs";

const rawOrigins = process.env.ALLOWED_ORIGIN || "";

const allowedOrigin = rawOrigins
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

// const allowPreviewOrigins = process.env.ALLOW_CF_PAGES_PREVIEW === "true";
// const previewSuffix =
// 	process.env.CF_PAGES_PREVIEW_SUFFIX ?? "-kotobad-frontend.amtt.workers.dev";
//
// const escapeRegex = (value: string) =>
// 	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//
// const previewHostnamePattern = new RegExp(
// 	`^[0-9a-f]+${escapeRegex(previewSuffix)}$`,
// );
//
// const isAllowedOrigin = (origin: string): boolean => {
// 	if (allowedOrigin.includes(origin)) {
// 		return true;
// 	}
// 	if (!allowPreviewOrigins) {
// 		return false;
// 	}
// 	try {
// 		const url = new URL(origin);
// 		if (url.protocol !== "https:") {
// 			return false;
// 		}
// 		return previewHostnamePattern.test(url.hostname);
// 	} catch {
// 		return false;
// 	}
// };
//
const allowPreviewOrigins = process.env.ALLOW_CF_PAGES_PREVIEW === "true";
const previewSuffix =
	process.env.CF_PAGES_PREVIEW_SUFFIX ?? "-kotobad-frontend.amtt.workers.dev";

const escapeRegex = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const previewHostnamePattern = new RegExp(
	`^[0-9a-f]+${escapeRegex(previewSuffix)}$`,
);

const isAllowedOrigin = (origin: string): boolean => {
	if (allowedOrigin.includes(origin)) {
		return true;
	}
	if (!allowPreviewOrigins) {
		return false;
	}
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:") {
			return false;
		}
		return previewHostnamePattern.test(url.hostname);
	} catch {
		return false;
	}
};

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
			origin(origin) {
				if (!origin) {
					return "";
				}
				return isAllowedOrigin(origin) ? origin : "";
			},
			allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.use("/auth/me", authMiddleware)
	.route("/bbs", bbsRouter)
	.route("/auth", authRouter);

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
