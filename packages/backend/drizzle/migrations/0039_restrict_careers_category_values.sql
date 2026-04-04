-- careers.category を管理UIの選択肢に合わせて制約
-- 許可カテゴリ: SJリーグ / 大学 / 高校 / 中学 / クラブ / ジュニア

UPDATE `careers`
SET `category` = 'SJリーグ'
WHERE `category` = 'SJリーグ所属';

DROP TRIGGER IF EXISTS `careers_category_check_insert`;
CREATE TRIGGER `careers_category_check_insert`
BEFORE INSERT ON `careers`
FOR EACH ROW
WHEN
	NEW.`category` IS NULL
	OR NEW.`category` NOT IN ('SJリーグ', '大学', '高校', '中学', 'クラブ', 'ジュニア')
BEGIN
	SELECT RAISE(ABORT, 'invalid careers.category');
END;

DROP TRIGGER IF EXISTS `careers_category_check_update`;
CREATE TRIGGER `careers_category_check_update`
BEFORE UPDATE OF `category` ON `careers`
FOR EACH ROW
WHEN
	NEW.`category` IS NULL
	OR NEW.`category` NOT IN ('SJリーグ', '大学', '高校', '中学', 'クラブ', 'ジュニア')
BEGIN
	SELECT RAISE(ABORT, 'invalid careers.category');
END;
