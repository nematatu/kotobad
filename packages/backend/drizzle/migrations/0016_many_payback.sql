CREATE TABLE `developer_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`status` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "developer_notes_status_check" CHECK("developer_notes"."status" IN ('wip', 'todo', 'done'))
);
--> statement-breakpoint
CREATE INDEX `developer_notes_created_at_idx` ON `developer_notes` (`created_at`);--> statement-breakpoint
CREATE INDEX `developer_notes_author_idx` ON `developer_notes` (`author_id`);--> statement-breakpoint
CREATE INDEX `developer_notes_status_idx` ON `developer_notes` (`status`);
