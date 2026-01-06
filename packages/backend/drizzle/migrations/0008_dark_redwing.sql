ALTER TABLE `threads` RENAME COLUMN `postCount` TO `post_count`;
ALTER TABLE `tags` ADD COLUMN `icon_type` text NOT NULL DEFAULT 'none';
ALTER TABLE `tags` ADD COLUMN `icon_value` text NOT NULL DEFAULT '';
CREATE UNIQUE INDEX IF NOT EXISTS `thread_tag_unique` ON `thread_tag` (`thread_id`,`tag_id`);
CREATE INDEX IF NOT EXISTS `thread_tag_idx` ON `thread_tag` (`thread_id`);
CREATE INDEX IF NOT EXISTS `tag_idx` ON `thread_tag` (`tag_id`);
