CREATE TABLE `threads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	`postCount` integer,
	`author_id` integer NOT NULL,
	`isPinned` integer DEFAULT false NOT NULL,
	`isClosed` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `posts` ADD `thread_id` integer NOT NULL REFERENCES threads(id);