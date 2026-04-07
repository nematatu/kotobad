import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { basicAuth } from "hono/basic-auth";
import { cors } from "hono/cors";
import type { AppEnvironment } from "../types";
import bbsRouter from "./bbs";
import { betterAuthHandler, betterAuthPath } from "./better-auth-handler";

const parseOrigins = (value?: string) =>
	(value ?? "")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

const escapeRegex = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isAllowedOrigin = (
	origin: string,
	env: AppEnvironment["Bindings"],
): boolean => {
	const allowedOrigins = parseOrigins(env.ALLOWED_ORIGINS);
	if (allowedOrigins.includes(origin)) {
		return true;
	}
	const previewSuffix =
		env.CF_PAGES_PREVIEW_SUFFIX ?? "-kotobad-frontend.amtt.workers.dev";
	const previewHostnamePattern = new RegExp(
		`^[0-9a-f]+${escapeRegex(previewSuffix)}$`,
	);
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
	.all(betterAuthPath, betterAuthHandler)
	.all(`${betterAuthPath}/*`, betterAuthHandler)
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
