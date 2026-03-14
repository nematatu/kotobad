CREATE TABLE `thread_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`thread_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`thread_id`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `thread_images_thread_sort_idx` ON `thread_images` (`thread_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `thread_images_thread_sort_unique` ON `thread_images` (`thread_id`,`sort_order`);
