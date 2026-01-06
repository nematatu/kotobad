ALTER TABLE `labels` RENAME TO `tags`;--> statement-breakpoint
ALTER TABLE `thread_label` RENAME TO `thread_tag`;--> statement-breakpoint
ALTER TABLE `thread_tag` RENAME COLUMN "label_id" TO "tag_id";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_thread_tag` (
	`thread_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`thread_id`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_thread_tag`("thread_id", "tag_id") SELECT "thread_id", "tag_id" FROM `thread_tag`;--> statement-breakpoint
DROP TABLE `thread_tag`;--> statement-breakpoint
ALTER TABLE `__new_thread_tag` RENAME TO `thread_tag`;--> statement-breakpoint
PRAGMA foreign_keys=ON;