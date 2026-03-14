CREATE TABLE `post_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `post_images_post_sort_idx` ON `post_images` (`post_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_images_post_sort_unique` ON `post_images` (`post_id`,`sort_order`);--> statement-breakpoint
ALTER TABLE `posts` DROP COLUMN `image_url`;