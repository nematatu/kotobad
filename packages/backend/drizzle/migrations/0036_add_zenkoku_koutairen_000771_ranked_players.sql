-- Source:
-- https://www.zenkoku-koutairen-bad.com/game/000771/
-- - ランキング_20250809181733.pdf
-- - 都道府県別参加リスト（個人対抗）_20250705162700.pdf
-- Extracted at: 2026-04-04
--
-- 備考:
-- - first_furigana / last_furigana は都道府県別参加リスト（個人対抗）PDFより抽出
-- - birth_place はランキングPDFの学校所在地（括弧内都道府県）を採用
-- - birth_date はソースに無いため NULL

WITH ranked_players(
	first_name,
	last_name,
	first_furigana,
	last_furigana,
	english_first_name,
	english_last_name,
	birth_place
) AS (
	VALUES
		('叶夢', '石井', 'カナメ', 'イシイ', 'kaname', 'ishii', '埼玉県'),
		('寿真', '川野', 'カズマ', 'カワノ', 'kazuma', 'kawano', '福島県'),
		('紗楓', '榎本', 'サヤカ', 'エノモト', 'sayaka', 'enomoto', '埼玉県'),
		('未來', '八嶋', 'ミク', 'ヤシマ', 'miku', 'yashima', '埼玉県'),
		('悠生', '草ノ瀬', 'ユウセイ', 'クサノセ', 'yuusei', 'kusanose', '長崎県'),
		('和義', '吉次', 'ナギ', 'ヨシツグ', 'nagi', 'yoshitsugu', '長崎県'),
		('舜生', '根本', 'シュンセイ', 'ネモト', 'shunsei', 'nemoto', '長崎県'),
		('慶悟', '石原', 'ケイゴ', 'イシハラ', 'keigo', 'ishihara', '宮城県'),
		('栞大朗', '内村', 'カンタロウ', 'ウチムラ', 'kantarou', 'uchimura', '宮城県'),
		('宙那', '米本', 'ソナ', 'ヨネモト', 'sona', 'yonemoto', '大阪府'),
		('妃奈乃', '大津', 'ヒナノ', 'オオツ', 'hinano', 'ootsu', '山口県'),
		('心優', '中原', 'ミユ', 'ナカハラ', 'miyu', 'nakahara', '山口県'),
		('珠聡', '田中', 'ミサト', 'タナカ', 'misato', 'tanaka', '東京都'),
		('乃愛', '髙橋', 'ノア', 'タカハシ', 'noa', 'takahashi', '東京都'),
		('隼人', '祇園田', 'ハヤト', 'ギオンダ', 'hayato', 'gionda', '熊本県'),
		('颯汰', '村上', 'ソウタ', 'ムラカミ', 'souta', 'murakami', '熊本県'),
		('稜平', '松永', 'リョウヘイ', 'マツナガ', 'ryouhei', 'matsunaga', '福岡県'),
		('菜結', '白川', 'ナユ', 'シラカワ', 'nayu', 'shirakawa', '山口県'),
		('唯奈', '山川', 'ユイナ', 'ヤマカワ', 'yuina', 'yamakawa', '香川県'),
		('寿輝', '西尾', 'トシキ', 'ニシオ', 'toshiki', 'nishio', '大阪府'),
		('紗来', '安村', 'サラ', 'ヤスムラ', 'sara', 'yasumura', '富山県'),
		('果凛', '阿部', 'カリン', 'アベ', 'karin', 'abe', '埼玉県'),
		('遼空', '黒石', 'リク', 'クロイシ', 'riku', 'kuroishi', '高知県'),
		('実里', '河村', 'ミリ', 'カワムラ', 'miri', 'kawamura', '埼玉県')
)
INSERT INTO `players` (
	`first_name`,
	`last_name`,
	`first_furigana`,
	`last_furigana`,
	`english_first_name`,
	`english_last_name`,
	`birth_place`,
	`birth_date`
)
SELECT
	rp.first_name,
	rp.last_name,
	rp.first_furigana,
	rp.last_furigana,
	rp.english_first_name,
	rp.english_last_name,
	rp.birth_place,
	NULL
FROM ranked_players rp
WHERE NOT EXISTS (
	SELECT 1
	FROM `players` p
	WHERE p.`last_name` = rp.last_name
		AND p.`first_name` = rp.first_name
);
