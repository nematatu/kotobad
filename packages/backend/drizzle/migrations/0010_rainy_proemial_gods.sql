CREATE TABLE `post_reactions` (
	`post_id` integer NOT NULL,
	`reaction_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reaction_id`) REFERENCES `reactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `post_reactions_unique` ON `post_reactions` (`post_id`,`reaction_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `post_reactions_idx` ON `post_reactions` (`post_id`,`reaction_id`);--> statement-breakpoint
CREATE INDEX `post_reactions_user_idx` ON `post_reactions` (`post_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `reactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`emoji` text NOT NULL,
	`code` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reactions_code_unique` ON `reactions` (`code`);--> statement-breakpoint
CREATE INDEX `reactions_active_sort_idx` ON `reactions` (`is_active`,`sort_order`);