import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const players = sqliteTable("players", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	firstFurigana: text("first_furigana").notNull(),
	lastFurigana: text("last_furigana").notNull(),
	englishFirstName: text("english_first_name").notNull(),
	englishLastName: text("english_last_name").notNull(),
	birthPlace: text("birth_place").notNull(),
	birthDate: integer("birth_date"),
});

export const schema = { players };
