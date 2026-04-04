-- Source pages:
-- https://www.tv-asahi.co.jp/badminton/nationalteam/2025/women/
-- https://www.tv-asahi.co.jp/badminton/nationalteam/2025/men/
-- Extracted at: 2026-04-04

-- 三橋 健也 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/men/detail/mitsuhashi_kenya.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '健也', '三橋', 'ケンヤ', 'ミツハシ',
       'kenya', 'mitsuhashi', '群馬県', 868579200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '三橋' AND `first_name` = '健也')
     OR (`english_last_name` = 'mitsuhashi' AND `english_first_name` = 'kenya')
);

-- 仁平 菜月 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/women/detail/nidaira_natsuki.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '菜月', '仁平', 'ナツキ', 'ニダイラ',
       'natsuki', 'nidaira', '茨城県', 900201600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '仁平' AND `first_name` = '菜月')
     OR (`english_last_name` = 'nidaira' AND `english_first_name` = 'natsuki')
);

-- 佐藤 灯 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/women/detail/sato_akari.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '灯', '佐藤', 'アカリ', 'サトウ',
       'akari', 'sato', '埼玉県', 985996800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '佐藤' AND `first_name` = '灯')
     OR (`english_last_name` = 'sato' AND `english_first_name` = 'akari')
);

-- 佐野 大輔 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/men/detail/sano_daisuke.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '大輔', '佐野', 'ダイスケ', 'サノ',
       'daisuke', 'sano', '北海道', 959990400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '佐野' AND `first_name` = '大輔')
     OR (`english_last_name` = 'sano' AND `english_first_name` = 'daisuke')
);

-- 吉田 翼 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/men/detail/yoshida_tsubasa.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '翼', '吉田', 'ツバサ', 'ヨシダ',
       'tsubasa', 'yoshida', '不明', NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '吉田' AND `first_name` = '翼')
     OR (`english_last_name` = 'yoshida' AND `english_first_name` = 'tsubasa')
);

-- 大竹 望月 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/women/detail/otake_mizuki.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '望月', '大竹', 'ミヅキ', 'オオタケ',
       'mizuki', 'otake', '新潟県', 1014768000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大竹' AND `first_name` = '望月')
     OR (`english_last_name` = 'otake' AND `english_first_name` = 'mizuki')
);

-- 奥原 希望 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/women/detail/okuhara_nozomi.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '希望', '奥原', 'ノゾミ', 'オクハラ',
       'nozomi', 'okuhara', '長野県', 795052800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '奥原' AND `first_name` = '希望')
     OR (`english_last_name` = 'okuhara' AND `english_first_name` = 'nozomi')
);

-- 小川 翔悟 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/men/detail/ogawa_shogo.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '翔悟', '小川', 'ショウゴ', 'オガワ',
       'shogo', 'ogawa', '宮崎県', 978566400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '小川' AND `first_name` = '翔悟')
     OR (`english_last_name` = 'ogawa' AND `english_first_name` = 'shogo')
);

-- 山下 恭平 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/men/detail/yamashita_kyohei.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '恭平', '山下', 'キョウヘイ', 'ヤマシタ',
       'kyohei', 'yamashita', '岡山県', 908150400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '山下' AND `first_name` = '恭平')
     OR (`english_last_name` = 'yamashita' AND `english_first_name` = 'kyohei')
);

-- 岡村 洋輝 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/men/detail/okamura_hiroki.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '洋輝', '岡村', 'ヒロキ', 'オカムラ',
       'hiroki', 'okamura', '北海道', 912902400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '岡村' AND `first_name` = '洋輝')
     OR (`english_last_name` = 'okamura' AND `english_first_name` = 'hiroki')
);

-- 杉山 薫 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/women/detail/sugiyama_kaoru.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '薫', '杉山', 'カオル', 'スギヤマ',
       'kaoru', 'sugiyama', '茨城県', 1054857600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '杉山' AND `first_name` = '薫')
     OR (`english_last_name` = 'sugiyama' AND `english_first_name` = 'kaoru')
);

-- 澤田 修志 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/men/detail/sawada_shuji.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '修志', '澤田', 'シュウジ', 'サワダ',
       'shuji', 'sawada', '北海道', 1184803200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '澤田' AND `first_name` = '修志')
     OR (`english_last_name` = 'sawada' AND `english_first_name` = 'shuji')
);

-- 相澤 桃李 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/men/detail/aizawa_tori.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '桃李', '相澤', 'トウリ', 'アイザワ',
       'tori', 'aizawa', '神奈川県', 930614400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '相澤' AND `first_name` = '桃李')
     OR (`english_last_name` = 'aizawa' AND `english_first_name` = 'tori')
);

-- 鈴木 陽向 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/women/detail/suzuki_hinata.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '陽向', '鈴木', 'ヒナタ', 'スズキ',
       'hinata', 'suzuki', '埼玉県', 1017100800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '鈴木' AND `first_name` = '陽向')
     OR (`english_last_name` = 'suzuki' AND `english_first_name` = 'hinata')
);

-- 関野 里真 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/women/detail/sekino_rima.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '里真', '関野', 'リマ', 'セキノ',
       'rima', 'sekino', '不明', NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '関野' AND `first_name` = '里真')
     OR (`english_last_name` = 'sekino' AND `english_first_name` = 'rima')
);

-- 高橋 洸士 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/men/detail/takahashi_koo.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '洸士', '高橋', 'コオ', 'タカハシ',
       'koo', 'takahashi', '福岡県', 1000944000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '高橋' AND `first_name` = '洸士')
     OR (`english_last_name` = 'takahashi' AND `english_first_name` = 'koo')
);

-- 髙橋 明日香 (https://www.tv-asahi.co.jp/badminton/nationalteam/2025/women/detail/takahashi_asuka.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `birth_place`, `birth_date`
)
SELECT '明日香', '髙橋', 'アスカ', 'タカハシ',
       'asuka', 'takahashi', '栃木県', 942451200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '髙橋' AND `first_name` = '明日香')
     OR (`english_last_name` = 'takahashi' AND `english_first_name` = 'asuka')
);
