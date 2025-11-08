import { createMiddleware } from "hono/factory";
import { createDb } from "../database";
import type { AppEnvironment } from "../types";

export const db = createMiddleware<AppEnvironment>(async (c, next) => {
	const db = createDb(c.env);
	c.set("db", db);
	await next();
});
