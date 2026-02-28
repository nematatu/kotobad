ALTER TABLE `posts` ADD `reply_to_post_id` integer REFERENCES posts(id) ON DELETE SET NULL;--> statement-breakpoint
CREATE INDEX `posts_reply_to_post_idx` ON `posts` (`reply_to_post_id`);
