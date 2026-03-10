CREATE TABLE `developer_roadmap_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`status` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "developer_roadmap_items_status_check" CHECK("developer_roadmap_items"."status" IN ('wip', 'todo', 'done'))
);
--> statement-breakpoint
CREATE INDEX `developer_roadmap_items_status_idx` ON `developer_roadmap_items` (`status`);--> statement-breakpoint
CREATE INDEX `developer_roadmap_items_sort_order_idx` ON `developer_roadmap_items` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `developer_roadmap_items_author_idx` ON `developer_roadmap_items` (`author_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_developer_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_developer_notes`("id", "content", "author_id", "created_at", "updated_at") SELECT "id", "content", "author_id", "created_at", "updated_at" FROM `developer_notes`;--> statement-breakpoint
DROP TABLE `developer_notes`;--> statement-breakpoint
ALTER TABLE `__new_developer_notes` RENAME TO `developer_notes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `developer_notes_created_at_idx` ON `developer_notes` (`created_at`);--> statement-breakpoint
CREATE INDEX `developer_notes_author_idx` ON `developer_notes` (`author_id`);