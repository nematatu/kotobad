import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "../drizzle/schema";
import type { Bindings } from "./types";

let cachedDb: DrizzleD1Database<typeof schema> | null = null;

export const createDb = (env: Bindings) => {
	if (cachedDb) return cachedDb;
	cachedDb = drizzle(env.DB, { schema });
	return cachedDb;
};

export type Database = ReturnType<typeof createDb>;
