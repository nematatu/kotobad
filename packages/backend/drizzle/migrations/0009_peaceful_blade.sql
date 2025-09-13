CREATE TABLE `thread_Label` (
	`threadId` integer NOT NULL,
	`labelId` integer NOT NULL,
	FOREIGN KEY (`threadId`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`labelId`) REFERENCES `labels`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `threadLabel`;