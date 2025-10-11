PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`local_id` integer NOT NULL,
	`post` text NOT NULL,
	`thread_id` integer NOT NULL,
	`author_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`thread_id`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_posts` (
	`id`,
	`local_id`,
	`post`,
	`thread_id`,
	`author_id`,
	`created_at`,
	`updated_at`
)
SELECT
	`p`.`id`,
	ROW_NUMBER() OVER (PARTITION BY `p`.`thread_id` ORDER BY `p`.`created_at`, `p`.`id`),
	`p`.`post`,
	`p`.`thread_id`,
	`p`.`author_id`,
	`p`.`created_at`,
	`p`.`updated_at`
FROM `posts` AS `p`;
--> statement-breakpoint
DROP TABLE `posts`;
--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_thread_local_unique` ON `posts` (`thread_id`,`local_id`);
--> statement-breakpoint
CREATE INDEX `post_idx` ON `posts` (`post`);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
