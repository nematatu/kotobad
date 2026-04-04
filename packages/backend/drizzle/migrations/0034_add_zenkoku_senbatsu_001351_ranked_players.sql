-- Source:
-- https://www.zenkoku-koutairen-bad.com/game/001351/
-- - ランキング一覧_20260328175413.pdf
-- - 個人対抗出場者0211_20260211223626.pdf
-- Extracted at: 2026-04-04
--
-- 備考:
-- - birth_place / first_furigana / last_furigana は「個人対抗出場者」PDFから抽出
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
		('駿希', '萩原', 'シュンキ', 'ハギワラ', 'shunki', 'hagiwara', '埼玉県'),
		('政人', '山城', 'マサト', 'ヤマシロ', 'masato', 'yamashiro', '新潟県'),
		('友梨華', '永渕', 'ユリカ', 'ナガフチ', 'yurika', 'nagafuchi', '佐賀県'),
		('央輔', '宮﨑', 'オウスケ', 'ミヤザキ', 'ousuke', 'miyazaki', '香川県'),
		('莉子', '中沢', 'リコ', 'ナカザワ', 'riko', 'nakazawa', '栃木県'),
		('大輝', '増田', 'ダイキ', 'マスダ', 'daiki', 'masuda', '広島県'),
		('紗季', '松本', 'サキ', 'マツモト', 'saki', 'matsumoto', '愛知県'),
		('幹太', '田上', 'カンタ', 'タノウエ', 'kanta', 'tanoue', '熊本県'),
		('夢陽', '大石', 'マオ', 'オオイシ', 'mao', 'ooishi', '福岡県'),
		('楓雅', '渡邊', 'フウガ', 'ワタナベ', 'fuuga', 'watanabe', '愛知県'),
		('祐希', '天野', 'ユウキ', 'アマノ', 'yuuki', 'amano', '静岡県'),
		('遥', '増田', 'ハル', 'マスダ', 'haru', 'masuda', '兵庫県'),
		('彩由里', '山辺', 'サユリ', 'ヤマベ', 'sayuri', 'yamabe', '千葉県'),
		('弘奨', '山脇', 'コウスケ', 'ヤマワキ', 'kousuke', 'yamawaki', '愛知県'),
		('茉央', '小林', 'マオ', 'コバヤシ', 'mao', 'kobayashi', '滋賀県'),
		('敦晴', '五十田', 'アツハル', 'イソダ', 'atsuharu', 'isoda', '高知県'),
		('琉生', '山﨑', 'リュウセイ', 'ヤマザキ', 'ryuusei', 'yamazaki', '佐賀県'),
		('優寿', '上野', 'ユズ', 'ウエノ', 'yuzu', 'ueno', '山形県'),
		('碧唯', '伴野', 'アオイ', 'バンノ', 'aoi', 'banno', '東京都'),
		('眞優', '松本', 'マヒロ', 'マツモト', 'mahiro', 'matsumoto', '栃木県'),
		('杏哩', '山中', 'アンリ', 'ヤマナカ', 'anri', 'yamanaka', '東京都'),
		('寛人', '横田', 'ヒロト', 'ヨコタ', 'hiroto', 'yokota', '北海道'),
		('莉桜', '井上', 'リオ', 'イノウエ', 'rio', 'inoue', '福岡県'),
		('結衣', '星野', 'ユイ', 'ホシノ', 'yui', 'hoshino', '神奈川県'),
		('果帆', '深澤', 'カホ', 'フカサワ', 'kaho', 'fukasawa', '埼玉県'),
		('翔伍', '宮下', 'ショウゴ', 'ミヤシタ', 'shougo', 'miyashita', '石川県'),
		('妃翔', '橋村', 'ヒメカ', 'ハシムラ', 'himeka', 'hashimura', '東京都'),
		('芽衣咲', '阿波', 'メイサ', 'アナミ', 'meisa', 'anami', '福岡県'),
		('橙希', '池山', 'ユズキ', 'イケヤマ', 'yuzuki', 'ikeyama', '三重県'),
		('裕貴', '古川', 'ヒロキ', 'フルカワ', 'hiroki', 'furukawa', '大阪府'),
		('虹花', '鎌田', 'ニジカ', 'カマタ', 'nijika', 'kamata', '三重県'),
		('優楽', '齊藤', 'ユラ', 'サイトウ', 'yura', 'saitou', '宮城県'),
		('想来', '畠山', 'ソラ', 'ハタケヤマ', 'sora', 'hatakeyama', '岩手県'),
		('莉緒', '山北', 'リオ', 'ヤマキタ', 'rio', 'yamakita', '埼玉県'),
		('翼', '清水', 'ツバサ', 'シミズ', 'tsubasa', 'shimizu', '香川県'),
		('真央', '浅野', 'マオ', 'アサノ', 'mao', 'asano', '栃木県'),
		('佳依', '小林', 'カエ', 'コバヤシ', 'kae', 'kobayashi', '兵庫県'),
		('太幹', '小川', 'タイキ', 'オガワ', 'taiki', 'ogawa', '栃木県'),
		('康平', '中川', 'コウヘイ', 'ナカガワ', 'kouhei', 'nakagawa', '滋賀県'),
		('結妃', '德永', 'ユウヒ', 'トクナガ', 'yuuhi', 'tokunaga', '北海道'),
		('美月', '田村', 'ミヅキ', 'タムラ', 'mizuki', 'tamura', '北海道')
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
