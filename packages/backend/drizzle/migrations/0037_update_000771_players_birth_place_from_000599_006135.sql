-- Source:
-- https://www.zenkoku-koutairen-bad.com/data/events/000599/006135.pdf
-- Extracted at: 2026-04-04
--
-- 対象:
-- 0036_add_zenkoku_koutairen_000771_ranked_players.sql で追加した選手
-- 方針:
-- - PDFで出身地を検出できた選手: 検出値で更新
-- - PDFで検出できない選手: 「未設定」に更新

WITH birthplace_updates(first_name, last_name, birth_place) AS (
	VALUES
		('叶夢', '石井', '埼玉県'),
		('寿真', '川野', '福岡県'),
		('紗楓', '榎本', '埼玉県'),
		('未來', '八嶋', '埼玉県'),
		('悠生', '草ノ瀬', '鹿児島県'),
		('和義', '吉次', '佐賀県'),
		('舜生', '根本', '神奈川県'),
		('慶悟', '石原', '未設定'),
		('栞大朗', '内村', '未設定'),
		('宙那', '米本', '徳島県'),
		('妃奈乃', '大津', '北海道'),
		('心優', '中原', '福岡県'),
		('珠聡', '田中', '神奈川県'),
		('乃愛', '髙橋', '神奈川県'),
		('隼人', '祇園田', '熊本県'),
		('颯汰', '村上', '未設定'),
		('稜平', '松永', '福岡県'),
		('菜結', '白川', '千葉県'),
		('唯奈', '山川', '香川県'),
		('寿輝', '西尾', '大阪府'),
		('紗来', '安村', '未設定'),
		('果凛', '阿部', '埼玉県'),
		('遼空', '黒石', '高知県'),
		('実里', '河村', '埼玉県')
)
UPDATE `players`
SET `birth_place` = (
	SELECT bu.birth_place
	FROM birthplace_updates bu
	WHERE bu.last_name = players.last_name
		AND bu.first_name = players.first_name
)
WHERE EXISTS (
	SELECT 1
	FROM birthplace_updates bu
	WHERE bu.last_name = players.last_name
		AND bu.first_name = players.first_name
);
