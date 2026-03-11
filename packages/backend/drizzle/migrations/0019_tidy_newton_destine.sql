CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipient_user_id` text NOT NULL,
	`sender_user_id` text NOT NULL,
	`type` text NOT NULL,
	`thread_id` integer,
	`target_post_id` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`read_at` integer,
	FOREIGN KEY (`recipient_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`thread_id`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "notifications_type_check" CHECK("notifications"."type" IN ('thread_reply', 'post_reply', 'thread_like', 'post_reaction'))
);
--> statement-breakpoint
CREATE INDEX `notifications_recipient_idx` ON `notifications` (`recipient_user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `notifications_recipient_read_at_idx` ON `notifications` (`recipient_user_id`,`read_at`);