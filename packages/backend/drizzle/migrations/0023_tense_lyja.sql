CREATE TABLE `thread_trends` (
	`thread_id` integer PRIMARY KEY NOT NULL,
	`rank` integer NOT NULL,
	`score_milli` integer NOT NULL,
	`calculated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`thread_id`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `thread_trends_calculated_rank_idx` ON `thread_trends` (`calculated_at`,`rank`);--> statement-breakpoint
CREATE INDEX `thread_trends_calculated_score_idx` ON `thread_trends` (`calculated_at`,`score_milli`);