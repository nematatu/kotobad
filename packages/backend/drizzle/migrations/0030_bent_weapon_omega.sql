CREATE TABLE IF NOT EXISTS `user_favorite_players` (
	`user_id` text NOT NULL,
	`player_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	PRIMARY KEY(`user_id`, `player_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `user_favorite_players_user_sort_unique` ON `user_favorite_players` (`user_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `user_favorite_players_user_sort_idx` ON `user_favorite_players` (`user_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `user_favorite_players_player_idx` ON `user_favorite_players` (`player_id`);--> statement-breakpoint
