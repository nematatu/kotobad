PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`local_id` integer NOT NULL,
	`post` text NOT NULL,
	`reply_to_post_id` integer,
	`thread_id` integer NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`reply_to_post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`thread_id`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "local_id", "post", "reply_to_post_id", "thread_id", "author_id", "created_at", "updated_at") SELECT "id", "local_id", "post", "reply_to_post_id", "thread_id", "author_id", "created_at", "updated_at" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `posts_thread_local_unique` ON `posts` (`thread_id`,`local_id`);--> statement-breakpoint
CREATE INDEX `posts_reply_to_post_idx` ON `posts` (`reply_to_post_id`);