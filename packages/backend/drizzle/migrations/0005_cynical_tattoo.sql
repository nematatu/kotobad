DROP TABLE `worldTournaments`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_achievements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_id` integer NOT NULL,
	`japan_tournament_id` integer,
	`year` integer NOT NULL,
	`result` text NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`japan_tournament_id`) REFERENCES `japanTournaments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_achievements`("id", "player_id", "japan_tournament_id", "year", "result") SELECT "id", "player_id", "japan_tournament_id", "year", "result" FROM `achievements`;--> statement-breakpoint
DROP TABLE `achievements`;--> statement-breakpoint
ALTER TABLE `__new_achievements` RENAME TO `achievements`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_thread_label` (
	`thread_id` integer NOT NULL,
	`label_id` integer NOT NULL,
	`japanTournament_id` integer,
	FOREIGN KEY (`thread_id`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`label_id`) REFERENCES `labels`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`japanTournament_id`) REFERENCES `japanTournaments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_thread_label`("thread_id", "label_id", "japanTournament_id") SELECT "thread_id", "label_id", "japanTournament_id" FROM `thread_label`;--> statement-breakpoint
DROP TABLE `thread_label`;--> statement-breakpoint
ALTER TABLE `__new_thread_label` RENAME TO `thread_label`;