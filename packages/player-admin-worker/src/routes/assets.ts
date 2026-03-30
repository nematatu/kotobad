import { type Context, Hono } from "hono";
import type { AppEnv } from "../types";

const fetchAdminAsset = (c: Context<AppEnv>, pathname: string) => {
	const assetUrl = new URL(c.req.url);
	assetUrl.pathname = pathname;
	assetUrl.search = "";
	return c.env.ASSETS.fetch(new Request(assetUrl.toString(), c.req.raw));
};

export const assetsRouter = new Hono<AppEnv>();

assetsRouter.get("/api/status", (c) => {
	return c.json({
		service: "player-admin-worker",
		status: "ok",
		adminUrl: "/",
	});
});

assetsRouter.get("/", (c) => {
	return fetchAdminAsset(c, "/index.html");
});

assetsRouter.get("*", (c) => {
	return c.env.ASSETS.fetch(c.req.raw);
});
