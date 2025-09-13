CREATE TABLE `labels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`labelname` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `threadLabel` (
	`threadId` integer NOT NULL,
	`labelId` integer NOT NULL,
	FOREIGN KEY (`threadId`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`labelId`) REFERENCES `labels`(`id`) ON UPDATE no action ON DELETE no action
);
