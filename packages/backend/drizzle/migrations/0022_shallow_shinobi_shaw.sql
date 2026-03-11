CREATE TABLE `developer_note_labels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `developer_note_labels_code_unique` ON `developer_note_labels` (`code`);--> statement-breakpoint
CREATE INDEX `developer_note_labels_sort_order_idx` ON `developer_note_labels` (`sort_order`);--> statement-breakpoint
INSERT INTO `developer_note_labels` (`code`, `name`, `sort_order`, `created_at`)
VALUES ('resolved', '解決済み', 0, strftime('%s', 'now'));--> statement-breakpoint
ALTER TABLE `developer_notes` ADD `label_id` integer REFERENCES developer_note_labels(id);--> statement-breakpoint
CREATE INDEX `developer_notes_label_idx` ON `developer_notes` (`label_id`);
