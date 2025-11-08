import type { Context } from "hono";
import { BETTER_AUTH_BASE_PATH, createAuth } from "../auth";
import type { AppEnvironment } from "../types";

export const betterAuthHandler = async (c: Context<AppEnvironment>) => {
	console.log(c.req.raw.headers.get("origin"));
	const auth = createAuth({ env: c.env, restRequest: c.req.raw });
	return auth.handler(c.req.raw);
};

export const betterAuthPath = BETTER_AUTH_BASE_PATH;
