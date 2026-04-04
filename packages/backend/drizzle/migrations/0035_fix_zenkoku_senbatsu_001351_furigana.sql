-- 0034 で追加した全国選抜ランキング選手のフリガナ・英字表記を補正
-- Source:
-- https://www.zenkoku-koutairen-bad.com/game/001351/
-- - 個人対抗出場者0211_20260211223626.pdf
-- Verified at: 2026-04-04

WITH ranked_players(
	first_name,
	last_name,
	first_furigana,
	last_furigana,
	english_first_name,
	english_last_name
) AS (
	VALUES
		('駿希', '萩原', 'シュンキ', 'ハギワラ', 'shunki', 'hagiwara'),
		('政人', '山城', 'マサト', 'ヤマシロ', 'masato', 'yamashiro'),
		('友梨華', '永渕', 'ユリカ', 'ナガフチ', 'yurika', 'nagafuchi'),
		('央輔', '宮﨑', 'オウスケ', 'ミヤザキ', 'ousuke', 'miyazaki'),
		('莉子', '中沢', 'リコ', 'ナカザワ', 'riko', 'nakazawa'),
		('大輝', '増田', 'ダイキ', 'マスダ', 'daiki', 'masuda'),
		('紗季', '松本', 'サキ', 'マツモト', 'saki', 'matsumoto'),
		('幹太', '田上', 'カンタ', 'タノウエ', 'kanta', 'tanoue'),
		('夢陽', '大石', 'マオ', 'オオイシ', 'mao', 'ooishi'),
		('楓雅', '渡邊', 'フウガ', 'ワタナベ', 'fuuga', 'watanabe'),
		('祐希', '天野', 'ユウキ', 'アマノ', 'yuuki', 'amano'),
		('遥', '増田', 'ハル', 'マスダ', 'haru', 'masuda'),
		('彩由里', '山辺', 'サユリ', 'ヤマベ', 'sayuri', 'yamabe'),
		('弘奨', '山脇', 'コウスケ', 'ヤマワキ', 'kousuke', 'yamawaki'),
		('茉央', '小林', 'マオ', 'コバヤシ', 'mao', 'kobayashi'),
		('敦晴', '五十田', 'アツハル', 'イソダ', 'atsuharu', 'isoda'),
		('琉生', '山﨑', 'リュウセイ', 'ヤマザキ', 'ryuusei', 'yamazaki'),
		('優寿', '上野', 'ユズ', 'ウエノ', 'yuzu', 'ueno'),
		('碧唯', '伴野', 'アオイ', 'バンノ', 'aoi', 'banno'),
		('眞優', '松本', 'マヒロ', 'マツモト', 'mahiro', 'matsumoto'),
		('杏哩', '山中', 'アンリ', 'ヤマナカ', 'anri', 'yamanaka'),
		('寛人', '横田', 'ヒロト', 'ヨコタ', 'hiroto', 'yokota'),
		('莉桜', '井上', 'リオ', 'イノウエ', 'rio', 'inoue'),
		('結衣', '星野', 'ユイ', 'ホシノ', 'yui', 'hoshino'),
		('果帆', '深澤', 'カホ', 'フカサワ', 'kaho', 'fukasawa'),
		('翔伍', '宮下', 'ショウゴ', 'ミヤシタ', 'shougo', 'miyashita'),
		('妃翔', '橋村', 'ヒメカ', 'ハシムラ', 'himeka', 'hashimura'),
		('芽衣咲', '阿波', 'メイサ', 'アナミ', 'meisa', 'anami'),
		('橙希', '池山', 'ユズキ', 'イケヤマ', 'yuzuki', 'ikeyama'),
		('裕貴', '古川', 'ヒロキ', 'フルカワ', 'hiroki', 'furukawa'),
		('虹花', '鎌田', 'ニジカ', 'カマタ', 'nijika', 'kamata'),
		('優楽', '齊藤', 'ユラ', 'サイトウ', 'yura', 'saitou'),
		('想来', '畠山', 'ソラ', 'ハタケヤマ', 'sora', 'hatakeyama'),
		('莉緒', '山北', 'リオ', 'ヤマキタ', 'rio', 'yamakita'),
		('翼', '清水', 'ツバサ', 'シミズ', 'tsubasa', 'shimizu'),
		('真央', '浅野', 'マオ', 'アサノ', 'mao', 'asano'),
		('佳依', '小林', 'カエ', 'コバヤシ', 'kae', 'kobayashi'),
		('太幹', '小川', 'タイキ', 'オガワ', 'taiki', 'ogawa'),
		('康平', '中川', 'コウヘイ', 'ナカガワ', 'kouhei', 'nakagawa'),
		('結妃', '德永', 'ユウヒ', 'トクナガ', 'yuuhi', 'tokunaga'),
		('美月', '田村', 'ミヅキ', 'タムラ', 'mizuki', 'tamura')
)
UPDATE `players`
SET
	`first_furigana` = (
		SELECT rp.first_furigana
		FROM ranked_players rp
		WHERE rp.last_name = players.last_name
			AND rp.first_name = players.first_name
	),
	`last_furigana` = (
		SELECT rp.last_furigana
		FROM ranked_players rp
		WHERE rp.last_name = players.last_name
			AND rp.first_name = players.first_name
	),
	`english_first_name` = (
		SELECT rp.english_first_name
		FROM ranked_players rp
		WHERE rp.last_name = players.last_name
			AND rp.first_name = players.first_name
	),
	`english_last_name` = (
		SELECT rp.english_last_name
		FROM ranked_players rp
		WHERE rp.last_name = players.last_name
			AND rp.first_name = players.first_name
	)
WHERE EXISTS (
	SELECT 1
	FROM ranked_players rp
	WHERE rp.last_name = players.last_name
		AND rp.first_name = players.first_name
);
