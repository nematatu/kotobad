PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_threads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	`postCount` integer NOT NULL,
	`author_id` integer NOT NULL,
	`isPinned` integer DEFAULT false NOT NULL,
	`isClosed` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_threads`("id", "title", "created_at", "updated_at", "postCount", "author_id", "isPinned", "isClosed") SELECT "id", "title", "created_at", "updated_at", "postCount", "author_id", "isPinned", "isClosed" FROM `threads`;--> statement-breakpoint
DROP TABLE `threads`;--> statement-breakpoint
ALTER TABLE `__new_threads` RENAME TO `threads`;--> statement-breakpoint
PRAGMA foreign_keys=ON;