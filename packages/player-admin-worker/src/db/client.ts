import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import type { DatabaseBinding } from "../types";
import { schema } from "./schema";

type Database = DrizzleD1Database<typeof schema>;

const dbCache = new WeakMap<DatabaseBinding, Database>();

export const createDb = (dbBinding: DatabaseBinding): Database => {
	const cached = dbCache.get(dbBinding);
	if (cached) {
		return cached;
	}

	const db = drizzle(dbBinding, { schema });
	dbCache.set(dbBinding, db);
	return db;
};
