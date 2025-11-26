import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "../drizzle/schema";
import type { Bindings } from "./types";

const dbCache = new WeakMap<Bindings["DB"], DrizzleD1Database<typeof schema>>();

export const createDb = (env: Bindings) => {
	const cached = dbCache.get(env.DB);
	if (cached) return cached;

	const db = drizzle(env.DB, { schema });
	dbCache.set(env.DB, db);
	return db;
};

export type Database = ReturnType<typeof createDb>;
