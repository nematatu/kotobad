PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_developer_roadmap_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	CONSTRAINT "developer_roadmap_items_status_check" CHECK("__new_developer_roadmap_items"."status" IN ('wip', 'todo', 'done'))
);
--> statement-breakpoint
INSERT INTO `__new_developer_roadmap_items`("id", "title", "status", "sort_order", "created_at", "updated_at") SELECT "id", "title", "status", "sort_order", "created_at", "updated_at" FROM `developer_roadmap_items`;--> statement-breakpoint
DROP TABLE `developer_roadmap_items`;--> statement-breakpoint
ALTER TABLE `__new_developer_roadmap_items` RENAME TO `developer_roadmap_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `developer_roadmap_items_status_idx` ON `developer_roadmap_items` (`status`);--> statement-breakpoint
CREATE INDEX `developer_roadmap_items_sort_order_idx` ON `developer_roadmap_items` (`status`,`sort_order`);