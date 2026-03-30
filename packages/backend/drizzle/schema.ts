import { relations, sql } from "drizzle-orm";
import {
	type AnySQLiteColumn,
	customType,
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
  check
} from "drizzle-orm/sqlite-core";
import type { DeveloperRoadmapStatusType } from "@kotobad/shared/src/types/developerRoadmap";
import type {TagIconKindType} from "@kotobad/shared/src/types/tag";
import { user } from "./better-auth.schema";
import type { NotificationType } from "@kotobad/shared/src/types/notifications";

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

export const threads = sqliteTable(
	"threads",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		title: text("title").notNull(),
		createdAt: timestamp("created_at")
			.default(sql`(strftime('%s', 'now'))`)
			.notNull(),
		updatedAt: timestamp("updated_at").$onUpdate(
			() => sql`(strftime('%s', 'now'))`,
		),
		postCount: integer("post_count").notNull().default(0),
		authorId: text("author_id")
			.notNull()
			.references(() => user.id),
		isPinned: boolean("isPinned").default(false).notNull(),
		isClosed: boolean("isClosed").default(false).notNull(),
	},
	(table) => ({
		threadsTitleIdx: index("threads_title_idx").on(table.title),
	}),
);

export const threadImages = sqliteTable(
	"thread_images",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		threadId: integer("thread_id")
			.notNull()
			.references(() => threads.id, { onDelete: "cascade" }),
		imageUrl: text("image_url").notNull(),
		sortOrder: integer("sort_order").notNull().default(0),
		createdAt: timestamp("created_at")
			.default(sql`(strftime('%s', 'now'))`)
			.notNull(),
	},
	(table) => ({
		threadImagesThreadSortIdx: index("thread_images_thread_sort_idx").on(
			table.threadId,
			table.sortOrder,
		),
		threadImagesThreadSortUnique: uniqueIndex(
			"thread_images_thread_sort_unique",
		).on(table.threadId, table.sortOrder),
	}),
);

export const posts = sqliteTable(
	"posts",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		localId: integer("local_id").notNull(),
		post: text("post").notNull(),
		replyToPostId: integer("reply_to_post_id").references(
			(): AnySQLiteColumn => posts.id,
			{
				onDelete: "set null",
			},
		),
		threadId: integer("thread_id")
			.notNull()
			.references(() => threads.id, { onDelete: "cascade" }),
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
		replyToPostIdx: index("posts_reply_to_post_idx").on(table.replyToPostId),
	}),
);

export const postImages = sqliteTable(
	"post_images",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
		imageUrl: text("image_url").notNull(),
		sortOrder: integer("sort_order").notNull().default(0),
		createdAt: timestamp("created_at")
			.default(sql`(strftime('%s', 'now'))`)
			.notNull(),
	},
	(table) => ({
		postImagesPostSortIdx: index("post_images_post_sort_idx").on(
			table.postId,
			table.sortOrder,
		),
		postImagesPostSortUnique: uniqueIndex("post_images_post_sort_unique").on(
			table.postId,
			table.sortOrder,
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
	birthPlace: text("birth_place").notNull(),
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

export const reactions = sqliteTable("reactions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	emoji: text("emoji").notNull(),
  code: text("code").notNull().unique(), 
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at")
        .default(sql`(strftime('%s', 'now'))`)
        .notNull(), 
}, (t) => ({
        reactionsActiveSortIdx: index("reactions_active_sort_idx").on(
            t.isActive, 
            t.sortOrder
        )
    }) 
)

export const postReactions = sqliteTable("post_reactions", {
	postId: integer("post_id")
		      .notNull()
		      .references(() => posts.id, {onDelete: "cascade"}),
	reactionId: integer("reaction_id")
		      .notNull()
		      .references(() => reactions.id, {onDelete: "cascade"}),
  userId: text("user_id")
          .notNull()
          .references(() => user.id, {onDelete: "cascade"}), 
  createdAt: timestamp("created_at")
             .default(sql`(strftime('%s', 'now'))`)
             .notNull(),
}, (t) => ({
        postReactionsUnique: uniqueIndex("post_reactions_unique").on(
            t.postId,
            t.reactionId,
            t.userId
        ),
        postReactionsIdx: index("post_reactions_idx").on(
            t.postId, 
            t.reactionId
        ),
        postReactionsUserIdx: index("post_reactions_user_idx").on(
            t.postId, 
            t.userId
        ),
    })
)

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

export const threadLikes = sqliteTable("thread_likes", {
	threadId: integer("thread_id")
		.notNull()
		.references(() => threads.id, {onDelete: "cascade"}),
  userId: text("user_id")
          .notNull()
          .references(() => user.id, {onDelete: "cascade"}), 
  createdAt: timestamp("created_at")
          .default(sql`(strftime('%s', 'now'))`)
          .notNull(),
}, (t) => ({
        threadLikesUnique: uniqueIndex("thread_likes_unique").on(t.threadId, t.userId),
    })
)

export const threadTrends = sqliteTable(
	"thread_trends",
	{
		threadId: integer("thread_id")
			.primaryKey()
			.references(() => threads.id, { onDelete: "cascade" }),
		rank: integer("rank").notNull(),
		scoreMilli: integer("score_milli").notNull(),
		calculatedAt: timestamp("calculated_at")
			.default(sql`(strftime('%s', 'now'))`)
			.notNull(),
	},
	(t) => ({
		threadTrendsCalculatedRankIdx: index("thread_trends_calculated_rank_idx").on(
			t.calculatedAt,
			t.rank,
		),
		threadTrendsCalculatedScoreIdx: index(
			"thread_trends_calculated_score_idx",
		).on(t.calculatedAt, t.scoreMilli),
	}),
);

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

export const developerNotes = sqliteTable(
	"developer_notes",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		content: text("content").notNull(),
		labelId: integer("label_id").references(() => developerNoteLabels.id, {
			onDelete: "set null",
		}),
		authorId: text("author_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at")
			.default(sql`(strftime('%s', 'now'))`)
			.notNull(),
		updatedAt: timestamp("updated_at").$onUpdate(
			() => sql`(strftime('%s', 'now'))`,
		),
	},
	(t) => [
		index("developer_notes_created_at_idx").on(t.createdAt),
		index("developer_notes_author_idx").on(t.authorId),
		index("developer_notes_label_idx").on(t.labelId),
	],
);

export const developerNoteLabels = sqliteTable(
	"developer_note_labels",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		code: text("code").notNull().unique(),
		name: text("name").notNull(),
		sortOrder: integer("sort_order").notNull().default(0),
		createdAt: timestamp("created_at")
			.default(sql`(strftime('%s', 'now'))`)
			.notNull(),
		updatedAt: timestamp("updated_at").$onUpdate(
			() => sql`(strftime('%s', 'now'))`,
		),
	},
	(t) => [
		index("developer_note_labels_sort_order_idx").on(t.sortOrder),
	],
);

export const developerRoadmapItems = sqliteTable(
	"developer_roadmap_items",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		title: text("title").notNull(),
		status: text("status").$type<DeveloperRoadmapStatusType>().notNull(),
		isArchived: boolean("is_archived").default(false).notNull(),
		sortOrder: integer("sort_order").notNull().default(0),
		createdAt: timestamp("created_at")
			.default(sql`(strftime('%s', 'now'))`)
			.notNull(),
		updatedAt: timestamp("updated_at").$onUpdate(
			() => sql`(strftime('%s', 'now'))`,
		),
	},
	(t) => [
		index("developer_roadmap_items_status_idx").on(t.status),
		index("developer_roadmap_items_archived_idx").on(t.isArchived),
		index("developer_roadmap_items_sort_order_idx").on(t.status, t.sortOrder),
		check(
			"developer_roadmap_items_status_check",
			sql`${t.status} IN ('wip', 'todo', 'done')`,
		),
	],
)

export const notifications = sqliteTable("notifications", {
    id: integer("id").primaryKey({autoIncrement: true}), 
    recipientUserId: text("recipient_user_id")
        .notNull()
        .references(() => user.id, {onDelete: "cascade"}), 
    senderUserId: text("sender_user_id")
        .notNull()
        .references(() => user.id, {onDelete: "cascade"}),
    type: text("type").$type<NotificationType>().notNull(),
    threadId: integer("thread_id")
        .references(() => threads.id, {onDelete: "cascade"}),
    targetPostId: integer("target_post_id")
        .references(() => posts.id, {onDelete: "cascade"}),
    reactionEmoji: text("reaction_emoji"),
    sendedPostId: integer("sended_post_id")
        .references(() => posts.id, {onDelete: "cascade"}),
    createdAt: timestamp("created_at")
        .default(sql`(strftime('%s', 'now'))`)
        .notNull(),
    readAt: timestamp("read_at")
}, (t) => [
        index("notifications_recipient_idx").on(t.recipientUserId, t.createdAt),
        index("notifications_recipient_read_at_idx").on(t.recipientUserId, t.readAt),
        check(
            "notifications_type_check", 
            sql`${t.type} IN ('thread_reply', 'post_reply', 'thread_like', 'post_reaction')`, 
        )
    ]
)
export const threadIdx = index("thread_created_at_idx").on(threads.createdAt);
export const postIdx = index("post_idx").on(posts.post);
export const postsAuthorIdx = index("author_idx").on(posts.authorId);
export const playerIdx = index("player_idx").on(players.id);

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

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(user, {
		fields: [posts.authorId],
		references: [user.id],
	}),
	threads: one(threads, {
		fields: [posts.threadId],
		references: [threads.id],
	}),
	replyTo: one(posts, {
		relationName: "postReplyTree",
		fields: [posts.replyToPostId],
		references: [posts.id],
	}),
	replies: many(posts, {
		relationName: "postReplyTree",
	}),
	postImages: many(postImages),
	reactions: many(postReactions),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
	author: one(user, {
		fields: [threads.authorId],
		references: [user.id],
	}),
	posts: many(posts),
	threadImages: many(threadImages),
	threadTags: many(threadTags),
  likes: many(threadLikes),
	trend: one(threadTrends, {
		fields: [threads.id],
		references: [threadTrends.threadId],
	}),
}));

export const usersRelations = relations(user, ({ many }) => ({
	posts: many(posts),
	threads: many(threads),
	  threadLikes: many(threadLikes),
	developerNotes: many(developerNotes),
}));

export const developerNotesRelations = relations(developerNotes, ({ one }) => ({
	author: one(user, {
		fields: [developerNotes.authorId],
		references: [user.id],
	}),
	label: one(developerNoteLabels, {
		fields: [developerNotes.labelId],
		references: [developerNoteLabels.id],
	}),
}));

export const developerNoteLabelsRelations = relations(
	developerNoteLabels,
	({ many }) => ({
		notes: many(developerNotes),
	}),
);

export const reactionsRelations = relations(reactions, ({ many }) => ({
	postReactions: many(postReactions),
}));

export const postReactionsRelations = relations(postReactions, ({ one }) => ({
	post: one(posts, {
		fields: [postReactions.postId],
		references: [posts.id],
	}),
	reactions: one(reactions, {
		fields: [postReactions.reactionId],
		references: [reactions.id],
	}),
}));

export const postImagesRelations = relations(postImages, ({ one }) => ({
	post: one(posts, {
		fields: [postImages.postId],
		references: [posts.id],
	}),
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

export const threadImagesRelations = relations(threadImages, ({ one }) => ({
	thread: one(threads, {
		fields: [threadImages.threadId],
		references: [threads.id],
	}),
}));

export const threadLikesRelations = relations(threadLikes, ({ one }) => ({
	thread: one(threads, {
		fields: [threadLikes.threadId],
		references: [threads.id],
	}),
	user: one(user, {
		fields: [threadLikes.userId],
		references: [user.id],
	}),
}));

export const threadTrendsRelations = relations(threadTrends, ({ one }) => ({
	thread: one(threads, {
		fields: [threadTrends.threadId],
		references: [threads.id],
	}),
}));

export * from "./better-auth.schema"; 
