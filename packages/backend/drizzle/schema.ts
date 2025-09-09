import {
	sqliteTable,
	text,
	integer,
	index,
	customType,
} from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

const timestamp = customType<{ data: Date; driverData: number }>({
	dataType() {
		return "integer";
	},
	fromDriver(value: number): Date {
		return new Date(value * 1000);
	},
	toDriver(value: Date): number {
		return Math.floor(value.getTime() / 1000);
	},
});

const boolean = customType<{ data: boolean; driverData: number }>({
	dataType() {
		return "integer";
	},
	fromDriver(value: number): boolean {
		return value === 1 ? true : false;
	},
	toDriver(value: boolean): number {
		return value === true ? 1 : 0;
	},
});

export const users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
	createdAt: timestamp("created_at")
		.default(sql`(strftime('%s', 'now'))`)
		.notNull(),
});

export const threads = sqliteTable("threads", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	createdAt: timestamp("created_at")
		.default(sql`(strftime('%s', 'now'))`)
		.notNull(),
	updatedAt: timestamp("updated_at").$onUpdate(
		() => sql`(strftime('%s', 'now'))`,
	),
	postCount: integer("postCount").notNull(),
	authorId: integer("author_id")
		.notNull()
		.references(() => users.id),
	isPinned: boolean("isPinned").default(false).notNull(),
	isClosed: boolean("isClosed").default(false).notNull(),
});

export const posts = sqliteTable("posts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	description: text("description").notNull(),
	threadId: integer("thread_id")
		.notNull()
		.references(() => threads.id),
	authorId: integer("author_id")
		.notNull()
		.references(() => users.id),
	createdAt: timestamp("created_at")
		.default(sql`(strftime('%s', 'now'))`)
		.notNull(),
	updatedAt: timestamp("updated_at").$onUpdate(
		() => sql`(strftime('%s', 'now'))`,
	),
});

export const postsTitleIdx = index("title_idx").on(posts.title);
export const postsDescriptionIdx = index("description_idx").on(
	posts.description,
);
export const postsAuthorIdx = index("author_idx").on(posts.authorId);

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
	threads: one(threads, {
		fields: [posts.threadId],
		references: [threads.id],
	}),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
	author: one(users, {
		fields: [threads.authorId],
		references: [users.id],
	}),
	posts: many(posts),
}));

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	threads: many(threads),
}));
