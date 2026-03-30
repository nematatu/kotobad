import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import type { DatabaseBinding } from "../types";
import { schema } from "./schema";

type Database = DrizzleD1Database<typeof schema>;

const dbCache = new WeakMap<DatabaseBinding, Database>();
const playersTableInitialized = new WeakSet<DatabaseBinding>();

export const createDb = (dbBinding: DatabaseBinding): Database => {
	const cached = dbCache.get(dbBinding);
	if (cached) {
		return cached;
	}

	const db = drizzle(dbBinding, { schema });
	dbCache.set(dbBinding, db);
	return db;
};

export const ensurePlayersTable = async (dbBinding: DatabaseBinding) => {
	if (playersTableInitialized.has(dbBinding)) {
		return;
	}

	await dbBinding
		.prepare(
			`
			CREATE TABLE IF NOT EXISTS players (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				first_name TEXT NOT NULL,
				last_name TEXT NOT NULL,
				first_furigana TEXT NOT NULL,
				last_furigana TEXT NOT NULL,
				english_first_name TEXT NOT NULL,
				english_last_name TEXT NOT NULL,
				birth_place TEXT NOT NULL,
				birth_date INTEGER
			)
			`,
		)
		.run();

	playersTableInitialized.add(dbBinding);
};
