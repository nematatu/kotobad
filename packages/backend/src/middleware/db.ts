import { createMiddleware } from "hono/factory";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../drizzle/schema";
import { AppEnvironment } from "../types";

export const db = createMiddleware<AppEnvironment>(async (c, next) => {
	const db = drizzle(c.env.DB, { schema });
	c.set("db", db);
	await next();
});
