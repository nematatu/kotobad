ALTER TABLE `posts` ADD `post` text NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `posts` DROP COLUMN `description`;