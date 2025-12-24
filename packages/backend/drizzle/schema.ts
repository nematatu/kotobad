import { relations, sql } from "drizzle-orm";
import {
	customType,
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
  check
} from "drizzle-orm/sqlite-core";
import type {TagIconKindType} from "@kotobad/shared/src/types/tag";
import { user } from "./better-auth.schema";

const timestamp = customType<{ data: Date; driverData: number }>({
	dataType() {
		return "integer";
	},
	fromDriver(value: number): Date { return new Date(value * 1000);
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
		return value === 1;
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
	authorId: text("author_id")
		.notNull()
		.references(() => user.id),
	isPinned: boolean("isPinned").default(false).notNull(),
	isClosed: boolean("isClosed").default(false).notNull(),
});

export const posts = sqliteTable(
	"posts",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		localId: integer("local_id").notNull(),
		post: text("post").notNull(),
		threadId: integer("thread_id")
			.notNull()
			.references(() => threads.id),
		authorId: text("author_id")
			.notNull()
			.references(() => user.id),
		createdAt: timestamp("created_at")
			.default(sql`(strftime('%s', 'now'))`)
			.notNull(),
		updatedAt: timestamp("updated_at").$onUpdate(
			() => sql`(strftime('%s', 'now'))`,
		),
	},
	(table) => ({
		threadLocalUnique: uniqueIndex("posts_thread_local_unique").on(
			table.threadId,
			table.localId,
		),
	}),
);

export const players = sqliteTable("players", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	first_furigana: text("first_furigana").notNull(),
	last_furigana: text("last_furigana").notNull(),
	englishFirstName: text("english_first_name").notNull(),
	englishLastName: text("english_last_name").notNull(),
	team: text("team").notNull(),
	birthDate: timestamp("birth_date"),
});

export const careers = sqliteTable("careers", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	playerId: integer("player_id")
		.notNull()
		.references(() => players.id),
	name: text("name").notNull(),
	category: text("category"),
	startYear: integer("start_year"),
	endYear: integer("end_year"),
});

export const achievements = sqliteTable("achievements", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	playerId: integer("player_id")
		.notNull()
		.references(() => players.id, { onDelete: "cascade" }),
	year: integer("year").notNull(),
	result: text("result").notNull(),
});

export const tags = sqliteTable("tags", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
  iconType: text("icon_type").notNull().default("none").$type<TagIconKindType>(),
  iconValue: text("icon_value").notNull().default(""),
}, (t) => [
        check(
            "tags_icon_type_check", 
            sql`${t.iconType} IN ('emoji', 'image', 'text', 'none')`, 
        ), 
        check(
            "tags_icon_value_check", 
            sql`
                (${t.iconType} != 'none' AND length(trim(${t.iconValue})) > 0 )
                OR
                (${t.iconType} = 'none' AND length(trim(${t.iconValue})) = 0)
                `
        )
    ]
)

export const threadTags = sqliteTable("thread_tag", {
	threadId: integer("thread_id")
		.notNull()
		.references(() => threads.id, {onDelete: "cascade"}),
	tagId: integer("tag_id")
		.notNull()
		.references(() => tags.id, {onDelete: "cascade"}),
}, (t) => ({
        ThreadTagUnique: uniqueIndex("thread_tag_unique").on(t.threadId, t.tagId),
        threadIdIdx: index("thread_tag_idx").on(t.threadId),
        tagIdIdx: index("tag_idx").on(t.tagId),
    })
)

export const threadIdx = index("thread_created_at_idx").on(threads.createdAt);
export const postIdx = index("post_idx").on(posts.post);
export const postsAuthorIdx = index("author_idx").on(posts.authorId);
export const playerIdx = index("player_idx").on(players.id);
export const threadTagIdx = index("thread_tag_idx").on(threadTags.threadId);

export const playersRelations = relations(players, ({ many }) => ({
	achievements: many(achievements),
	careers: many(careers),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
	player: one(players, {
		fields: [achievements.playerId],
		references: [players.id],
	}),
}));

export const careerRelations = relations(careers, ({ one }) => ({
	player: one(players, {
		fields: [careers.playerId],
		references: [players.id],
	}),
}));

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(user, {
		fields: [posts.authorId],
		references: [user.id],
	}),
	threads: one(threads, {
		fields: [posts.threadId],
		references: [threads.id],
	}),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
	author: one(user, {
		fields: [threads.authorId],
		references: [user.id],
	}),
	posts: many(posts),
	threadTags: many(threadTags),
}));

export const usersRelations = relations(user, ({ many }) => ({
	posts: many(posts),
	threads: many(threads),
}));


export const tagRelations = relations(tags, ({ many }) => ({
	threadTags: many(threadTags),
}));

export const threadTagRelations = relations(threadTags, ({ one }) => ({
	thread: one(threads, {
		fields: [threadTags.threadId],
		references: [threads.id],
	}),
	tags: one(tags, {
		fields: [threadTags.tagId],
		references: [tags.id],
	}),
}));

export * from "./better-auth.schema"; 
