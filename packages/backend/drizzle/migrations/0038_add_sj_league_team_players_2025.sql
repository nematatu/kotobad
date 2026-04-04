-- Source page: https://www.sj-league.jp/team_playerinfo/
-- Extracted at: 2026-04-04
-- Includes all team players in 2025 roster pages; inserts missing players only.

-- 相澤 桃李 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '桃李', '相澤', 'トウリ', 'アイザワ',
       'touri', 'aizawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/01.jpg', '神奈川県', 930614400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '相澤' AND `first_name` = '桃李')
     OR (`english_last_name` = 'aizawa' AND `english_first_name` = 'touri')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '相澤' AND p.`first_name` = '桃李')
   OR (p.`english_last_name` = 'aizawa' AND p.`english_first_name` = 'touri'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 相磯 美心 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '美心', '相磯', 'ミコト', 'アイソ',
       'mikoto', 'aiso', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/02.jpg', '大阪府', 1168387200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '相磯' AND `first_name` = '美心')
     OR (`english_last_name` = 'aiso' AND `english_first_name` = 'mikoto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '相磯' AND p.`first_name` = '美心')
   OR (p.`english_last_name` = 'aiso' AND p.`english_first_name` = 'mikoto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 青木 もえ / ACT SAIKYO (https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'もえ', '青木', 'モエ', 'アオキ',
       'moe', 'aoki', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/04.jpg', '茨城県', 1031097600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '青木' AND `first_name` = 'もえ')
     OR (`english_last_name` = 'aoki' AND `english_first_name` = 'moe')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ACT SAIKYO', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '青木' AND p.`first_name` = 'もえ')
   OR (p.`english_last_name` = 'aoki' AND p.`english_first_name` = 'moe'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ACT SAIKYO'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 秋田 まな / 山陰合同銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'まな', '秋田', 'マナ', 'アキタ',
       'mana', 'akita', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/03.jpg', '岡山県', 1145664000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '秋田' AND `first_name` = 'まな')
     OR (`english_last_name` = 'akita' AND `english_first_name` = 'mana')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '山陰合同銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '秋田' AND p.`first_name` = 'まな')
   OR (p.`english_last_name` = 'akita' AND p.`english_first_name` = 'mana'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '山陰合同銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 明地 陽菜 / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '陽菜', '明地', 'ヒナ', 'アケチ',
       'hina', 'akechi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/05.jpg', '大阪府', 1110758400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '明地' AND `first_name` = '陽菜')
     OR (`english_last_name` = 'akechi' AND `english_first_name` = 'hina')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '明地' AND p.`first_name` = '陽菜')
   OR (p.`english_last_name` = 'akechi' AND p.`english_first_name` = 'hina'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 阿部 大輔 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/15.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '大輔', '阿部', 'ダイスケ', 'アベ',
       'daisuke', 'abe', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/15.jpg', '新潟県', 1036800000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '阿部' AND `first_name` = '大輔')
     OR (`english_last_name` = 'abe' AND `english_first_name` = 'daisuke')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '阿部' AND p.`first_name` = '大輔')
   OR (p.`english_last_name` = 'abe' AND p.`english_first_name` = 'daisuke'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- イ ソヒ / ACT SAIKYO (https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/15.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'ソヒ', 'イ', 'ソヒ', 'イ',
       'sohee', 'lee', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/15.jpg', '韓国', 771552000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = 'イ' AND `first_name` = 'ソヒ')
     OR (`english_last_name` = 'lee' AND `english_first_name` = 'sohee')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ACT SAIKYO', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = 'イ' AND p.`first_name` = 'ソヒ')
   OR (p.`english_last_name` = 'lee' AND p.`english_first_name` = 'sohee'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ACT SAIKYO'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 五十嵐 有紗 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '有紗', '五十嵐', 'アリサ', 'イガラシ',
       'arisa', 'igarashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/05.jpg', '北海道', 838857600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '五十嵐' AND `first_name` = '有紗')
     OR (`english_last_name` = 'igarashi' AND `english_first_name` = 'arisa')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '五十嵐' AND p.`first_name` = '有紗')
   OR (p.`english_last_name` = 'igarashi' AND p.`english_first_name` = 'arisa'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 池端 元哉 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '元哉', '池端', 'モトヤ', 'イケバタ',
       'motoya', 'ikebata', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/01.jpg', '熊本県', 998697600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '池端' AND `first_name` = '元哉')
     OR (`english_last_name` = 'ikebata' AND `english_first_name` = 'motoya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '池端' AND p.`first_name` = '元哉')
   OR (p.`english_last_name` = 'ikebata' AND p.`english_first_name` = 'motoya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 石岡 空来 / 北都銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '空来', '石岡', 'ソラ', 'イシオカ',
       'sora', 'ishioka', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/08.jpg', '北海道', 1117584000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '石岡' AND `first_name` = '空来')
     OR (`english_last_name` = 'ishioka' AND `english_first_name` = 'sora')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '北都銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '石岡' AND p.`first_name` = '空来')
   OR (p.`english_last_name` = 'ishioka' AND p.`english_first_name` = 'sora'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '北都銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 石川 心菜 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/23.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '心菜', '石川', 'ココナ', 'イシカワ',
       'kokona', 'ishikawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/23.jpg', '東京都', 1097452800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '石川' AND `first_name` = '心菜')
     OR (`english_last_name` = 'ishikawa' AND `english_first_name` = 'kokona')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '石川' AND p.`first_name` = '心菜')
   OR (p.`english_last_name` = 'ishikawa' AND p.`english_first_name` = 'kokona'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 石神 文太 / 丸杉スティーラーズ (https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/15.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '文太', '石神', 'ブンタ', 'イシガミ',
       'bunta', 'ishigami', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/15.jpg', '岐阜県', 1074124800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '石神' AND `first_name` = '文太')
     OR (`english_last_name` = 'ishigami' AND `english_first_name` = 'bunta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '丸杉スティーラーズ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '石神' AND p.`first_name` = '文太')
   OR (p.`english_last_name` = 'ishigami' AND p.`english_first_name` = 'bunta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '丸杉スティーラーズ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 石田 有彩 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '有彩', '石田', 'アリサ', 'イシダ',
       'arisa', 'ishida', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/06.jpg', '新潟県', 977097600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '石田' AND `first_name` = '有彩')
     OR (`english_last_name` = 'ishida' AND `english_first_name` = 'arisa')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '石田' AND p.`first_name` = '有彩')
   OR (p.`english_last_name` = 'ishida' AND p.`english_first_name` = 'arisa'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 石原 聡弓 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '聡弓', '石原', 'サトミ', 'イシハラ',
       'satomi', 'ishihara', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/08.jpg', '北海道', 1020297600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '石原' AND `first_name` = '聡弓')
     OR (`english_last_name` = 'ishihara' AND `english_first_name` = 'satomi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '石原' AND p.`first_name` = '聡弓')
   OR (p.`english_last_name` = 'ishihara' AND p.`english_first_name` = 'satomi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 石橋 麻美子 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '麻美子', '石橋', 'マミコ', 'イシバシ',
       'mamiko', 'ishibashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/02.jpg', '千葉県', 866332800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '石橋' AND `first_name` = '麻美子')
     OR (`english_last_name` = 'ishibashi' AND `english_first_name` = 'mamiko')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '石橋' AND p.`first_name` = '麻美子')
   OR (p.`english_last_name` = 'ishibashi' AND p.`english_first_name` = 'mamiko'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 石橋 結子 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '結子', '石橋', 'ユウコ', 'イシバシ',
       'yuuko', 'ishibashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/03.jpg', '茨城県', 1078099200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '石橋' AND `first_name` = '結子')
     OR (`english_last_name` = 'ishibashi' AND `english_first_name` = 'yuuko')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '石橋' AND p.`first_name` = '結子')
   OR (p.`english_last_name` = 'ishibashi' AND p.`english_first_name` = 'yuuko'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 伊瀬 友花 / 山陰合同銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '友花', '伊瀬', 'トモカ', 'イセ',
       'tomoka', 'ise', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/05.jpg', '広島県', 1142899200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '伊瀬' AND `first_name` = '友花')
     OR (`english_last_name` = 'ise' AND `english_first_name` = 'tomoka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '山陰合同銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '伊瀬' AND p.`first_name` = '友花')
   OR (p.`english_last_name` = 'ise' AND p.`english_first_name` = 'tomoka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '山陰合同銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 一井 亮太 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '亮太', '一井', 'リョウタ', 'イチイ',
       'ryouta', 'ichii', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/03.jpg', '岡山県', 976147200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '一井' AND `first_name` = '亮太')
     OR (`english_last_name` = 'ichii' AND `english_first_name` = 'ryouta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '一井' AND p.`first_name` = '亮太')
   OR (p.`english_last_name` = 'ichii' AND p.`english_first_name` = 'ryouta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 伊藤 朱里 / 山陰合同銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '朱里', '伊藤', 'シュリ', 'イトウ',
       'shuri', 'itou', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/00.jpg', '栃木県', 1075852800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '伊藤' AND `first_name` = '朱里')
     OR (`english_last_name` = 'itou' AND `english_first_name` = 'shuri')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '山陰合同銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '伊藤' AND p.`first_name` = '朱里')
   OR (p.`english_last_name` = 'itou' AND p.`english_first_name` = 'shuri'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '山陰合同銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 伊藤 吏永 / 金沢学院クラブ (https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '吏永', '伊藤', 'リツエイ', 'イトウ',
       'ritsuei', 'itou', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/12.jpg', '石川県', 953078400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '伊藤' AND `first_name` = '吏永')
     OR (`english_last_name` = 'itou' AND `english_first_name` = 'ritsuei')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '金沢学院クラブ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '伊藤' AND p.`first_name` = '吏永')
   OR (p.`english_last_name` = 'itou' AND p.`english_first_name` = 'ritsuei'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '金沢学院クラブ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 稲富 将太 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '将太', '稲富', 'ショウタ', 'イナドミ',
       'shouta', 'inadomi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/03.jpg', '佐賀県', 1163548800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '稲富' AND `first_name` = '将太')
     OR (`english_last_name` = 'inadomi' AND `english_first_name` = 'shouta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '稲富' AND p.`first_name` = '将太')
   OR (p.`english_last_name` = 'inadomi' AND p.`english_first_name` = 'shouta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 井上 誠也 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '誠也', '井上', 'セイヤ', 'イノウエ',
       'seiya', 'inoue', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/01.jpg', '福井県', 1097539200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '井上' AND `first_name` = '誠也')
     OR (`english_last_name` = 'inoue' AND `english_first_name` = 'seiya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '井上' AND p.`first_name` = '誠也')
   OR (p.`english_last_name` = 'inoue' AND p.`english_first_name` = 'seiya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 猪熊 心太朗 / 金沢学院クラブ (https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '心太朗', '猪熊', 'シンタロウ', 'イノクマ',
       'shintarou', 'inokuma', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/05.jpg', '香川県', 832550400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '猪熊' AND `first_name` = '心太朗')
     OR (`english_last_name` = 'inokuma' AND `english_first_name` = 'shintarou')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '金沢学院クラブ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '猪熊' AND p.`first_name` = '心太朗')
   OR (p.`english_last_name` = 'inokuma' AND p.`english_first_name` = 'shintarou'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '金沢学院クラブ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 岩城 杏奈 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '杏奈', '岩城', 'アンナ', 'イワキ',
       'anna', 'iwaki', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/10.jpg', '大阪府', 1100304000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '岩城' AND `first_name` = '杏奈')
     OR (`english_last_name` = 'iwaki' AND `english_first_name` = 'anna')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '岩城' AND p.`first_name` = '杏奈')
   OR (p.`english_last_name` = 'iwaki' AND p.`english_first_name` = 'anna'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 岩戸 和音 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '和音', '岩戸', 'カズネ', 'イワト',
       'kazune', 'iwato', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/03.jpg', '北海道', 1131062400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '岩戸' AND `first_name` = '和音')
     OR (`english_last_name` = 'iwato' AND `english_first_name` = 'kazune')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '岩戸' AND p.`first_name` = '和音')
   OR (p.`english_last_name` = 'iwato' AND p.`english_first_name` = 'kazune'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 岩永 鈴 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '鈴', '岩永', 'リン', 'イワナガ',
       'rin', 'iwanaga', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/00.jpg', '山口県', 927244800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '岩永' AND `first_name` = '鈴')
     OR (`english_last_name` = 'iwanaga' AND `english_first_name` = 'rin')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '岩永' AND p.`first_name` = '鈴')
   OR (p.`english_last_name` = 'iwanaga' AND p.`english_first_name` = 'rin'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 岩野 滉也 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '滉也', '岩野', 'コウヤ', 'イワノ',
       'kouya', 'iwano', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/05.jpg', '愛知県', 1102204800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '岩野' AND `first_name` = '滉也')
     OR (`english_last_name` = 'iwano' AND `english_first_name` = 'kouya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '岩野' AND p.`first_name` = '滉也')
   OR (p.`english_last_name` = 'iwano' AND p.`english_first_name` = 'kouya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 上杉 杏 / NTT 東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '杏', '上杉', 'アン', 'ウエスギ',
       'an', 'uesugi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/02.jpg', '広島県', 959472000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '上杉' AND `first_name` = '杏')
     OR (`english_last_name` = 'uesugi' AND `english_first_name` = 'an')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT 東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '上杉' AND p.`first_name` = '杏')
   OR (p.`english_last_name` = 'uesugi' AND p.`english_first_name` = 'an'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT 東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 上田 康誠 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '康誠', '上田', 'コウセイ', 'ウエダ',
       'kousei', 'ueda', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/10.jpg', '滋賀県', 1060992000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '上田' AND `first_name` = '康誠')
     OR (`english_last_name` = 'ueda' AND `english_first_name` = 'kousei')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '上田' AND p.`first_name` = '康誠')
   OR (p.`english_last_name` = 'ueda' AND p.`english_first_name` = 'kousei'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 宇治 夢登 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '夢登', '宇治', 'ユウト', 'ウジ',
       'yuuto', 'uji', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/05.jpg', '大阪府', 1048809600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '宇治' AND `first_name` = '夢登')
     OR (`english_last_name` = 'uji' AND `english_first_name` = 'yuuto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '宇治' AND p.`first_name` = '夢登')
   OR (p.`english_last_name` = 'uji' AND p.`english_first_name` = 'yuuto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 内野 陽太 / 金沢学院クラブ (https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '陽太', '内野', 'ハルタ', 'ウチノ',
       'haruta', 'uchino', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/04.jpg', '埼玉県', 1027728000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '内野' AND `first_name` = '陽太')
     OR (`english_last_name` = 'uchino' AND `english_first_name` = 'haruta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '金沢学院クラブ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '内野' AND p.`first_name` = '陽太')
   OR (p.`english_last_name` = 'uchino' AND p.`english_first_name` = 'haruta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '金沢学院クラブ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 馬屋原 光大郎 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '光大郎', '馬屋原', 'コウタロウ', 'ウマヤハラ',
       'koutarou', 'umayahara', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/03.jpg', '鳥取県', 1064188800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '馬屋原' AND `first_name` = '光大郎')
     OR (`english_last_name` = 'umayahara' AND `english_first_name` = 'koutarou')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '馬屋原' AND p.`first_name` = '光大郎')
   OR (p.`english_last_name` = 'umayahara' AND p.`english_first_name` = 'koutarou'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 浦 隆斗 / 金沢学院クラブ (https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '隆斗', '浦', 'タカト', 'ウラ',
       'takato', 'ura', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/00.jpg', '福岡県', 1006214400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '浦' AND `first_name` = '隆斗')
     OR (`english_last_name` = 'ura' AND `english_first_name` = 'takato')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '金沢学院クラブ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '浦' AND p.`first_name` = '隆斗')
   OR (p.`english_last_name` = 'ura' AND p.`english_first_name` = 'takato'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '金沢学院クラブ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 江口 心 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '心', '江口', 'シン', 'エグチ',
       'shin', 'eguchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/12.jpg', '熊本県', 1071705600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '江口' AND `first_name` = '心')
     OR (`english_last_name` = 'eguchi' AND `english_first_name` = 'shin')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '江口' AND p.`first_name` = '心')
   OR (p.`english_last_name` = 'eguchi' AND p.`english_first_name` = 'shin'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 江藤 佑太 / 東海興業 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '佑太', '江藤', 'ユウタ', 'エトウ',
       'yuuta', 'etou', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/09.jpg', '熊本県', 976492800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '江藤' AND `first_name` = '佑太')
     OR (`english_last_name` = 'etou' AND `english_first_name` = 'yuuta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '東海興業', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '江藤' AND p.`first_name` = '佑太')
   OR (p.`english_last_name` = 'etou' AND p.`english_first_name` = 'yuuta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '東海興業'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 海老原 詩織 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '詩織', '海老原', 'シオリ', 'エビハラ',
       'shiori', 'ebihara', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/02.jpg', '栃木県', 900374400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '海老原' AND `first_name` = '詩織')
     OR (`english_last_name` = 'ebihara' AND `english_first_name` = 'shiori')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '海老原' AND p.`first_name` = '詩織')
   OR (p.`english_last_name` = 'ebihara' AND p.`english_first_name` = 'shiori'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 遠藤 彩斗 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/18.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '彩斗', '遠藤', 'アヤト', 'エンドウ',
       'ayato', 'endou', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/18.jpg', '東京都', 961372800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '遠藤' AND `first_name` = '彩斗')
     OR (`english_last_name` = 'endou' AND `english_first_name` = 'ayato')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '遠藤' AND p.`first_name` = '彩斗')
   OR (p.`english_last_name` = 'endou' AND p.`english_first_name` = 'ayato'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 遠藤 美羽 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/15.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '美羽', '遠藤', 'ミハネ', 'エンドウ',
       'mihane', 'endou', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/15.jpg', '栃木県', 1112745600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '遠藤' AND `first_name` = '美羽')
     OR (`english_last_name` = 'endou' AND `english_first_name` = 'mihane')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '遠藤' AND p.`first_name` = '美羽')
   OR (p.`english_last_name` = 'endou' AND p.`english_first_name` = 'mihane'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大出 竜輝 / コンサドーレ (https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '竜輝', '大出', 'タツキ', 'オオイデ',
       'tatsuki', 'ooide', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/02.jpg', '大阪府', 978134400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大出' AND `first_name` = '竜輝')
     OR (`english_last_name` = 'ooide' AND `english_first_name` = 'tatsuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'コンサドーレ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大出' AND p.`first_name` = '竜輝')
   OR (p.`english_last_name` = 'ooide' AND p.`english_first_name` = 'tatsuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'コンサドーレ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大越 泉 / コンサドーレ (https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '泉', '大越', 'イズミ', 'オオコシ',
       'izumi', 'ookoshi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/06.jpg', '栃木県', 709776000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大越' AND `first_name` = '泉')
     OR (`english_last_name` = 'ookoshi' AND `english_first_name` = 'izumi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'コンサドーレ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大越' AND p.`first_name` = '泉')
   OR (p.`english_last_name` = 'ookoshi' AND p.`english_first_name` = 'izumi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'コンサドーレ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大澤 佳歩 / 山陰合同銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '佳歩', '大澤', 'カホ', 'オオサワ',
       'kaho', 'oosawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/06.jpg', '埼玉県', 1001635200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大澤' AND `first_name` = '佳歩')
     OR (`english_last_name` = 'oosawa' AND `english_first_name` = 'kaho')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '山陰合同銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大澤' AND p.`first_name` = '佳歩')
   OR (p.`english_last_name` = 'oosawa' AND p.`english_first_name` = 'kaho'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '山陰合同銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大澤 達也 / 丸杉スティーラーズ (https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '達也', '大澤', 'タツヤ', 'オオサワ',
       'tatsuya', 'oosawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/02.jpg', '北海道', 1152489600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大澤' AND `first_name` = '達也')
     OR (`english_last_name` = 'oosawa' AND `english_first_name` = 'tatsuya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '丸杉スティーラーズ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大澤' AND p.`first_name` = '達也')
   OR (p.`english_last_name` = 'oosawa' AND p.`english_first_name` = 'tatsuya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '丸杉スティーラーズ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大澤 陽奈 / ACT SAIKYO (https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '陽奈', '大澤', 'ヒナ', 'オオサワ',
       'hina', 'oosawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/05.jpg', '東京都', 1090022400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大澤' AND `first_name` = '陽奈')
     OR (`english_last_name` = 'oosawa' AND `english_first_name` = 'hina')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ACT SAIKYO', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大澤' AND p.`first_name` = '陽奈')
   OR (p.`english_last_name` = 'oosawa' AND p.`english_first_name` = 'hina'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ACT SAIKYO'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大関 修平 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '修平', '大関', 'シュウヘイ', 'オオゼキ',
       'shuuhei', 'oozeki', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/01.jpg', '神奈川県', 803606400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大関' AND `first_name` = '修平')
     OR (`english_last_name` = 'oozeki' AND `english_first_name` = 'shuuhei')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大関' AND p.`first_name` = '修平')
   OR (p.`english_last_name` = 'oozeki' AND p.`english_first_name` = 'shuuhei'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大田 隼也 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '隼也', '大田', 'シュンヤ', 'オオタ',
       'shunya', 'oota', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/08.jpg', '富山県', 1081468800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大田' AND `first_name` = '隼也')
     OR (`english_last_name` = 'oota' AND `english_first_name` = 'shunya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大田' AND p.`first_name` = '隼也')
   OR (p.`english_last_name` = 'oota' AND p.`english_first_name` = 'shunya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大滝 聖矢 / 東海興業 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '聖矢', '大滝', 'セイヤ', 'オオタキ',
       'seiya', 'ootaki', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/00.jpg', '北海道', 914889600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大滝' AND `first_name` = '聖矢')
     OR (`english_last_name` = 'ootaki' AND `english_first_name` = 'seiya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '東海興業', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大滝' AND p.`first_name` = '聖矢')
   OR (p.`english_last_name` = 'ootaki' AND p.`english_first_name` = 'seiya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '東海興業'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大竹 望月 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '望月', '大竹', 'ミヅキ', 'オオタケ',
       'mizuki', 'ootake', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/04.jpg', '新潟県', 1014768000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大竹' AND `first_name` = '望月')
     OR (`english_last_name` = 'ootake' AND `english_first_name` = 'mizuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大竹' AND p.`first_name` = '望月')
   OR (p.`english_last_name` = 'ootake' AND p.`english_first_name` = 'mizuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大津 妃奈乃 / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '妃奈乃', '大津', 'ヒナノ', 'オオツ',
       'hinano', 'ootsu', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/03.jpg', '北海道', 1204502400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大津' AND `first_name` = '妃奈乃')
     OR (`english_last_name` = 'ootsu' AND `english_first_name` = 'hinano')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大津' AND p.`first_name` = '妃奈乃')
   OR (p.`english_last_name` = 'ootsu' AND p.`english_first_name` = 'hinano'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大林 拓真 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '拓真', '大林', 'タクマ', 'オオバヤシ',
       'takuma', 'oobayashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/02.jpg', '福井県', 933984000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大林' AND `first_name` = '拓真')
     OR (`english_last_name` = 'oobayashi' AND `english_first_name` = 'takuma')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大林' AND p.`first_name` = '拓真')
   OR (p.`english_last_name` = 'oobayashi' AND p.`english_first_name` = 'takuma'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 大山 翔愛 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '翔愛', '大山', 'トア', 'オオヤマ',
       'toa', 'ooyama', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/04.jpg', '新潟県', 1097884800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '大山' AND `first_name` = '翔愛')
     OR (`english_last_name` = 'ooyama' AND `english_first_name` = 'toa')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '大山' AND p.`first_name` = '翔愛')
   OR (p.`english_last_name` = 'ooyama' AND p.`english_first_name` = 'toa'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 岡村 洋輝 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '洋輝', '岡村', 'ヒロキ', 'オカムラ',
       'hiroki', 'okamura', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/05.jpg', '北海道', 912902400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '岡村' AND `first_name` = '洋輝')
     OR (`english_last_name` = 'okamura' AND `english_first_name` = 'hiroki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '岡村' AND p.`first_name` = '洋輝')
   OR (p.`english_last_name` = 'okamura' AND p.`english_first_name` = 'hiroki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 岡本 倖大 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '倖大', '岡本', 'コウタ', 'オカモト',
       'kouta', 'okamoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/05.jpg', '佐賀県', 1148342400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '岡本' AND `first_name` = '倖大')
     OR (`english_last_name` = 'okamoto' AND `english_first_name` = 'kouta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '岡本' AND p.`first_name` = '倖大')
   OR (p.`english_last_name` = 'okamoto' AND p.`english_first_name` = 'kouta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 阿保 龍斗 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '龍斗', '阿保', 'リュウト', 'オカヤス',
       'ryuuto', 'okayasu', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/09.jpg', '岐阜県', 1060300800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '阿保' AND `first_name` = '龍斗')
     OR (`english_last_name` = 'okayasu' AND `english_first_name` = 'ryuuto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '阿保' AND p.`first_name` = '龍斗')
   OR (p.`english_last_name` = 'okayasu' AND p.`english_first_name` = 'ryuuto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 小笠原 未結 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '未結', '小笠原', 'ミユウ', 'オガサワラ',
       'miyuu', 'ogasawara', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/05.jpg', '青森県', 1096588800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '小笠原' AND `first_name` = '未結')
     OR (`english_last_name` = 'ogasawara' AND `english_first_name` = 'miyuu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '小笠原' AND p.`first_name` = '未結')
   OR (p.`english_last_name` = 'ogasawara' AND p.`english_first_name` = 'miyuu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 小川 航汰 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '航汰', '小川', 'コウタ', 'オガワ',
       'kouta', 'ogawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/11.jpg', '宮崎県', 1017360000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '小川' AND `first_name` = '航汰')
     OR (`english_last_name` = 'ogawa' AND `english_first_name` = 'kouta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '小川' AND p.`first_name` = '航汰')
   OR (p.`english_last_name` = 'ogawa' AND p.`english_first_name` = 'kouta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 小川 翔悟 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '翔悟', '小川', 'ショウゴ', 'オガワ',
       'shougo', 'ogawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/04.jpg', '宮崎県', 978566400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '小川' AND `first_name` = '翔悟')
     OR (`english_last_name` = 'ogawa' AND `english_first_name` = 'shougo')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '小川' AND p.`first_name` = '翔悟')
   OR (p.`english_last_name` = 'ogawa' AND p.`english_first_name` = 'shougo'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 沖本 優大 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '優大', '沖本', 'ユウダイ', 'オキモト',
       'yuudai', 'okimoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/02.jpg', '広島県', 1117238400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '沖本' AND `first_name` = '優大')
     OR (`english_last_name` = 'okimoto' AND `english_first_name` = 'yuudai')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '沖本' AND p.`first_name` = '優大')
   OR (p.`english_last_name` = 'okimoto' AND p.`english_first_name` = 'yuudai'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 奥 優汰 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '優汰', '奥', 'ユウタ', 'オク',
       'yuuta', 'oku', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/03.jpg', '富山県', 1075766400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '奥' AND `first_name` = '優汰')
     OR (`english_last_name` = 'oku' AND `english_first_name` = 'yuuta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '奥' AND p.`first_name` = '優汰')
   OR (p.`english_last_name` = 'oku' AND p.`english_first_name` = 'yuuta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 小田 菜摘 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '菜摘', '小田', 'ナツミ', 'オダ',
       'natsumi', 'oda', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/04.jpg', '広島県', 893462400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '小田' AND `first_name` = '菜摘')
     OR (`english_last_name` = 'oda' AND `english_first_name` = 'natsumi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '小田' AND p.`first_name` = '菜摘')
   OR (p.`english_last_name` = 'oda' AND p.`english_first_name` = 'natsumi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 小野寺 雅之 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '雅之', '小野寺', 'マサユキ', 'オノデラ',
       'masayuki', 'onodera', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/11.jpg', '東京都', 905904000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '小野寺' AND `first_name` = '雅之')
     OR (`english_last_name` = 'onodera' AND `english_first_name` = 'masayuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '小野寺' AND p.`first_name` = '雅之')
   OR (p.`english_last_name` = 'onodera' AND p.`english_first_name` = 'masayuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 笠井 李柑 / 山陰合同銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '李柑', '笠井', 'モカ', 'カサイ',
       'moka', 'kasai', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/09.jpg', '香川県', 1128988800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '笠井' AND `first_name` = '李柑')
     OR (`english_last_name` = 'kasai' AND `english_first_name` = 'moka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '山陰合同銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '笠井' AND p.`first_name` = '李柑')
   OR (p.`english_last_name` = 'kasai' AND p.`english_first_name` = 'moka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '山陰合同銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 加藤 綾菜 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '綾菜', '加藤', 'アヤナ', 'カトウ',
       'ayana', 'katou', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/01.jpg', '山形県', 1018051200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '加藤' AND `first_name` = '綾菜')
     OR (`english_last_name` = 'katou' AND `english_first_name` = 'ayana')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '加藤' AND p.`first_name` = '綾菜')
   OR (p.`english_last_name` = 'katou' AND p.`english_first_name` = 'ayana'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 加藤 佑奈 / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '佑奈', '加藤', 'ユウナ', 'カトウ',
       'yuuna', 'katou', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/04.jpg', '岐阜県', 1025049600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '加藤' AND `first_name` = '佑奈')
     OR (`english_last_name` = 'katou' AND `english_first_name` = 'yuuna')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '加藤' AND p.`first_name` = '佑奈')
   OR (p.`english_last_name` = 'katou' AND p.`english_first_name` = 'yuuna'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 金廣 美希 / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '美希', '金廣', 'ミキ', 'カネヒロ',
       'miki', 'kanehiro', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/09.jpg', '山口県', 1038355200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '金廣' AND `first_name` = '美希')
     OR (`english_last_name` = 'kanehiro' AND `english_first_name` = 'miki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '金廣' AND p.`first_name` = '美希')
   OR (p.`english_last_name` = 'kanehiro' AND p.`english_first_name` = 'miki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 神山 歩美 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/15.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '歩美', '神山', 'アユミ', 'カミヤマ',
       'ayumi', 'kamiyama', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/15.jpg', '宮城県', 966902400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '神山' AND `first_name` = '歩美')
     OR (`english_last_name` = 'kamiyama' AND `english_first_name` = 'ayumi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '神山' AND p.`first_name` = '歩美')
   OR (p.`english_last_name` = 'kamiyama' AND p.`english_first_name` = 'ayumi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 神山 新悟 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '新悟', '神山', 'シンゴ', 'カミヤマ',
       'shingo', 'kamiyama', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/02.jpg', '奈良県', 1013472000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '神山' AND `first_name` = '新悟')
     OR (`english_last_name` = 'kamiyama' AND `english_first_name` = 'shingo')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '神山' AND p.`first_name` = '新悟')
   OR (p.`english_last_name` = 'kamiyama' AND p.`english_first_name` = 'shingo'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 神山 和奏 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '和奏', '神山', 'ワカナ', 'カミヤマ',
       'wakana', 'kamiyama', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/00.jpg', '大阪府', 1065916800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '神山' AND `first_name` = '和奏')
     OR (`english_last_name` = 'kamiyama' AND `english_first_name` = 'wakana')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '神山' AND p.`first_name` = '和奏')
   OR (p.`english_last_name` = 'kamiyama' AND p.`english_first_name` = 'wakana'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 川島 直也 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '直也', '川島', 'ナオヤ', 'カワシマ',
       'naoya', 'kawashima', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/09.jpg', '埼玉県', 991180800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '川島' AND `first_name` = '直也')
     OR (`english_last_name` = 'kawashima' AND `english_first_name` = 'naoya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '川島' AND p.`first_name` = '直也')
   OR (p.`english_last_name` = 'kawashima' AND p.`english_first_name` = 'naoya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 川添 麻依子 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '麻依子', '川添', 'マイコ', 'カワゾエ',
       'maiko', 'kawazoe', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/02.jpg', '三重県', 841795200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '川添' AND `first_name` = '麻依子')
     OR (`english_last_name` = 'kawazoe' AND `english_first_name` = 'maiko')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '川添' AND p.`first_name` = '麻依子')
   OR (p.`english_last_name` = 'kawazoe' AND p.`english_first_name` = 'maiko'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 川野 稜太 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '稜太', '川野', 'リョウタ', 'カワノ',
       'ryouta', 'kawano', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/02.jpg', '福岡県', 1048291200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '川野' AND `first_name` = '稜太')
     OR (`english_last_name` = 'kawano' AND `english_first_name` = 'ryouta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '川野' AND p.`first_name` = '稜太')
   OR (p.`english_last_name` = 'kawano' AND p.`english_first_name` = 'ryouta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 川原 聡麿 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '聡麿', '川原', 'ソウマ', 'カワハラ',
       'souma', 'kawahara', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/11.jpg', '佐賀県', 919036800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '川原' AND `first_name` = '聡麿')
     OR (`english_last_name` = 'kawahara' AND `english_first_name` = 'souma')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '川原' AND p.`first_name` = '聡麿')
   OR (p.`english_last_name` = 'kawahara' AND p.`english_first_name` = 'souma'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 川邊 悠陽 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '悠陽', '川邊', 'ハルキ', 'カワベ',
       'haruki', 'kawabe', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/10.jpg', '大分県', 1110412800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '川邊' AND `first_name` = '悠陽')
     OR (`english_last_name` = 'kawabe' AND `english_first_name` = 'haruki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '川邊' AND p.`first_name` = '悠陽')
   OR (p.`english_last_name` = 'kawabe' AND p.`english_first_name` = 'haruki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 川本 拓真 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '拓真', '川本', 'タクマ', 'カワモト',
       'takuma', 'kawamoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/04.jpg', '広島県', 987120000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '川本' AND `first_name` = '拓真')
     OR (`english_last_name` = 'kawamoto' AND `english_first_name` = 'takuma')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '川本' AND p.`first_name` = '拓真')
   OR (p.`english_last_name` = 'kawamoto' AND p.`english_first_name` = 'takuma'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 川本 諒太 / 東海興業 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '諒太', '川本', 'リョウタ', 'カワモト',
       'ryouta', 'kawamoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/06.jpg', '長崎県', 1129852800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '川本' AND `first_name` = '諒太')
     OR (`english_last_name` = 'kawamoto' AND `english_first_name` = 'ryouta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '東海興業', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '川本' AND p.`first_name` = '諒太')
   OR (p.`english_last_name` = 'kawamoto' AND p.`english_first_name` = 'ryouta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '東海興業'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- ガイ・ジェニー / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'ジェニー', 'ガイ', 'ジェニー', 'ガイ',
       'jennie', 'gai', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/12.jpg', 'アメリカ・カリフォルニア', 983059200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = 'ガイ' AND `first_name` = 'ジェニー')
     OR (`english_last_name` = 'gai' AND `english_first_name` = 'jennie')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = 'ガイ' AND p.`first_name` = 'ジェニー')
   OR (p.`english_last_name` = 'gai' AND p.`english_first_name` = 'jennie'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 木田 悠斗 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '悠斗', '木田', 'ユウト', 'キダ',
       'yuuto', 'kida', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/03.jpg', '福井県', 1038700800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '木田' AND `first_name` = '悠斗')
     OR (`english_last_name` = 'kida' AND `english_first_name` = 'yuuto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '木田' AND p.`first_name` = '悠斗')
   OR (p.`english_last_name` = 'kida' AND p.`english_first_name` = 'yuuto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 木村 百伽 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '百伽', '木村', 'モモカ', 'キムラ',
       'momoka', 'kimura', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/07.jpg', '岐阜県', 1002412800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '木村' AND `first_name` = '百伽')
     OR (`english_last_name` = 'kimura' AND `english_first_name` = 'momoka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '木村' AND p.`first_name` = '百伽')
   OR (p.`english_last_name` = 'kimura' AND p.`english_first_name` = 'momoka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 木山 琉聖 / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '琉聖', '木山', 'ルイ', 'キヤマ',
       'rui', 'kiyama', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/07.jpg', '熊本県', 1098144000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '木山' AND `first_name` = '琉聖')
     OR (`english_last_name` = 'kiyama' AND `english_first_name` = 'rui')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '木山' AND p.`first_name` = '琉聖')
   OR (p.`english_last_name` = 'kiyama' AND p.`english_first_name` = 'rui'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 清瀬 璃子 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '璃子', '清瀬', 'リコ', 'キヨセ',
       'riko', 'kiyose', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/04.jpg', '神奈川県', 1121472000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '清瀬' AND `first_name` = '璃子')
     OR (`english_last_name` = 'kiyose' AND `english_first_name` = 'riko')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '清瀬' AND p.`first_name` = '璃子')
   OR (p.`english_last_name` = 'kiyose' AND p.`english_first_name` = 'riko'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 工藤 彩歩 / 北都銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '彩歩', '工藤', 'サホ', 'クドウ',
       'saho', 'kudou', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/12.jpg', '秋田県', 1179964800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '工藤' AND `first_name` = '彩歩')
     OR (`english_last_name` = 'kudou' AND `english_first_name` = 'saho')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '北都銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '工藤' AND p.`first_name` = '彩歩')
   OR (p.`english_last_name` = 'kudou' AND p.`english_first_name` = 'saho'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '北都銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 熊谷 翔 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '翔', '熊谷', 'カケル', 'クマガイ',
       'kakeru', 'kumagai', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/09.jpg', '宮城県', 1010188800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '熊谷' AND `first_name` = '翔')
     OR (`english_last_name` = 'kumagai' AND `english_first_name` = 'kakeru')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '熊谷' AND p.`first_name` = '翔')
   OR (p.`english_last_name` = 'kumagai' AND p.`english_first_name` = 'kakeru'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 熊谷 悠吾 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '悠吾', '熊谷', 'ユウゴ', 'クマガイ',
       'yuugo', 'kumagai', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/04.jpg', '長野県', 1012521600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '熊谷' AND `first_name` = '悠吾')
     OR (`english_last_name` = 'kumagai' AND `english_first_name` = 'yuugo')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '熊谷' AND p.`first_name` = '悠吾')
   OR (p.`english_last_name` = 'kumagai' AND p.`english_first_name` = 'yuugo'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 倉島 美咲 / ACT SAIKYO (https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '美咲', '倉島', 'ミサキ', 'クラシマ',
       'misaki', 'kurashima', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/06.jpg', '埼玉県', 1053129600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '倉島' AND `first_name` = '美咲')
     OR (`english_last_name` = 'kurashima' AND `english_first_name` = 'misaki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ACT SAIKYO', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '倉島' AND p.`first_name` = '美咲')
   OR (p.`english_last_name` = 'kurashima' AND p.`english_first_name` = 'misaki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ACT SAIKYO'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 栗原 あかり / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'あかり', '栗原', 'アカリ', 'クリハラ',
       'akari', 'kurihara', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/01.jpg', '千葉県', 993081600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '栗原' AND `first_name` = 'あかり')
     OR (`english_last_name` = 'kurihara' AND `english_first_name` = 'akari')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '栗原' AND p.`first_name` = 'あかり')
   OR (p.`english_last_name` = 'kurihara' AND p.`english_first_name` = 'akari'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 栗原 琉夏 / NTT 東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '琉夏', '栗原', 'ルナ', 'クリハラ',
       'runa', 'kurihara', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/03.jpg', '千葉県', 1030492800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '栗原' AND `first_name` = '琉夏')
     OR (`english_last_name` = 'kurihara' AND `english_first_name` = 'runa')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT 東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '栗原' AND p.`first_name` = '琉夏')
   OR (p.`english_last_name` = 'kurihara' AND p.`english_first_name` = 'runa'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT 東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 郡司 莉子 / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '莉子', '郡司', 'リコ', 'グンジ',
       'riko', 'gunji', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/02.jpg', '神奈川県', 1028073600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '郡司' AND `first_name` = '莉子')
     OR (`english_last_name` = 'gunji' AND `english_first_name` = 'riko')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '郡司' AND p.`first_name` = '莉子')
   OR (p.`english_last_name` = 'gunji' AND p.`english_first_name` = 'riko'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 古賀 輝 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/16.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '輝', '古賀', 'アキラ', 'コガ',
       'akira', 'koga', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/16.jpg', '福岡県', 763084800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '古賀' AND `first_name` = '輝')
     OR (`english_last_name` = 'koga' AND `english_first_name` = 'akira')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '古賀' AND p.`first_name` = '輝')
   OR (p.`english_last_name` = 'koga' AND p.`english_first_name` = 'akira'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 小西 春七 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '春七', '小西', 'ハルナ', 'コニシ',
       'haruna', 'konishi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/07.jpg', '香川県', 956880000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '小西' AND `first_name` = '春七')
     OR (`english_last_name` = 'konishi' AND `english_first_name` = 'haruna')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '小西' AND p.`first_name` = '春七')
   OR (p.`english_last_name` = 'konishi' AND p.`english_first_name` = 'haruna'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 古根川 美桜 / NTT 東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '美桜', '古根川', 'ミオ', 'コネガワ',
       'mio', 'konegawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/04.jpg', '奈良県', 1111536000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '古根川' AND `first_name` = '美桜')
     OR (`english_last_name` = 'konegawa' AND `english_first_name` = 'mio')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT 東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '古根川' AND p.`first_name` = '美桜')
   OR (p.`english_last_name` = 'konegawa' AND p.`english_first_name` = 'mio'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT 東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 小林 優吾 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '優吾', '小林', 'ユウゴ', 'コバヤシ',
       'yuugo', 'kobayashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/04.jpg', '宮城県', 805334400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '小林' AND `first_name` = '優吾')
     OR (`english_last_name` = 'kobayashi' AND `english_first_name` = 'yuugo')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '小林' AND p.`first_name` = '優吾')
   OR (p.`english_last_name` = 'kobayashi' AND p.`english_first_name` = 'yuugo'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 小松 ゆい / 北都銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'ゆい', '小松', 'ユイ', 'コマツ',
       'yui', 'komatsu', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/07.jpg', '高知県', 967593600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '小松' AND `first_name` = 'ゆい')
     OR (`english_last_name` = 'komatsu' AND `english_first_name` = 'yui')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '北都銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '小松' AND p.`first_name` = 'ゆい')
   OR (p.`english_last_name` = 'komatsu' AND p.`english_first_name` = 'yui'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '北都銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 今田 竜大 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/18.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '竜大', '今田', 'リュウダイ', 'コンタ',
       'ryuudai', 'konta', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/18.jpg', '山形県', 1139529600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '今田' AND `first_name` = '竜大')
     OR (`english_last_name` = 'konta' AND `english_first_name` = 'ryuudai')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '今田' AND p.`first_name` = '竜大')
   OR (p.`english_last_name` = 'konta' AND p.`english_first_name` = 'ryuudai'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 近藤 七帆 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '七帆', '近藤', 'ナナホ', 'コンドウ',
       'nanaho', 'kondou', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/11.jpg', '愛媛県', 983318400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '近藤' AND `first_name` = '七帆')
     OR (`english_last_name` = 'kondou' AND `english_first_name` = 'nanaho')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '近藤' AND p.`first_name` = '七帆')
   OR (p.`english_last_name` = 'kondou' AND p.`english_first_name` = 'nanaho'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 後藤 海斗 / 丸杉スティーラーズ (https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '海斗', '後藤', 'カイト', 'ゴトウ',
       'kaito', 'gotou', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/09.jpg', '宮城県', 933724800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '後藤' AND `first_name` = '海斗')
     OR (`english_last_name` = 'gotou' AND `english_first_name` = 'kaito')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '丸杉スティーラーズ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '後藤' AND p.`first_name` = '海斗')
   OR (p.`english_last_name` = 'gotou' AND p.`english_first_name` = 'kaito'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '丸杉スティーラーズ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 後藤 拓人 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/15.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '拓人', '後藤', 'タクト', 'ゴトウ',
       'takuto', 'gotou', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/15.jpg', '宮城県', 1073260800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '後藤' AND `first_name` = '拓人')
     OR (`english_last_name` = 'gotou' AND `english_first_name` = 'takuto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '後藤' AND p.`first_name` = '拓人')
   OR (p.`english_last_name` = 'gotou' AND p.`english_first_name` = 'takuto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 齋藤 駿 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/16.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '駿', '齋藤', 'シュン', 'サイトウ',
       'shun', 'saitou', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/16.jpg', '新潟県', 1086480000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '齋藤' AND `first_name` = '駿')
     OR (`english_last_name` = 'saitou' AND `english_first_name` = 'shun')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '齋藤' AND p.`first_name` = '駿')
   OR (p.`english_last_name` = 'saitou' AND p.`english_first_name` = 'shun'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 齋藤 広 / 東海興業 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '広', '齋藤', 'ヒロ', 'サイトウ',
       'hiro', 'saitou', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/03.jpg', '福島県', 1074124800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '齋藤' AND `first_name` = '広')
     OR (`english_last_name` = 'saitou' AND `english_first_name` = 'hiro')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '東海興業', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '齋藤' AND p.`first_name` = '広')
   OR (p.`english_last_name` = 'saitou' AND p.`english_first_name` = 'hiro'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '東海興業'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 坂井 叶 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '叶', '坂井', 'カナエ', 'サカイ',
       'kanae', 'sakai', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/03.jpg', '新潟県', 1012348800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '坂井' AND `first_name` = '叶')
     OR (`english_last_name` = 'sakai' AND `english_first_name` = 'kanae')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '坂井' AND p.`first_name` = '叶')
   OR (p.`english_last_name` = 'sakai' AND p.`english_first_name` = 'kanae'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 坂中 琴音 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '琴音', '坂中', 'コトネ', 'サカナカ',
       'kotone', 'sakanaka', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/07.jpg', '奈良県', 1020816000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '坂中' AND `first_name` = '琴音')
     OR (`english_last_name` = 'sakanaka' AND `english_first_name` = 'kotone')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '坂中' AND p.`first_name` = '琴音')
   OR (p.`english_last_name` = 'sakanaka' AND p.`english_first_name` = 'kotone'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 崎野 翔太 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '翔太', '崎野', 'ショウタ', 'サキノ',
       'shouta', 'sakino', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/06.jpg', '北海道', 1083888000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '崎野' AND `first_name` = '翔太')
     OR (`english_last_name` = 'sakino' AND `english_first_name` = 'shouta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '崎野' AND p.`first_name` = '翔太')
   OR (p.`english_last_name` = 'sakino' AND p.`english_first_name` = 'shouta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 櫻本 絢子 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '絢子', '櫻本', 'アヤコ', 'サクラモト',
       'ayako', 'sakuramoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/01.jpg', '福岡県', 808790400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '櫻本' AND `first_name` = '絢子')
     OR (`english_last_name` = 'sakuramoto' AND `english_first_name` = 'ayako')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '櫻本' AND p.`first_name` = '絢子')
   OR (p.`english_last_name` = 'sakuramoto' AND p.`english_first_name` = 'ayako'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 佐藤 椎名 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '椎名', '佐藤', 'シイナ', 'サトウ',
       'shiina', 'satou', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/01.jpg', '青森県', 1056931200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '佐藤' AND `first_name` = '椎名')
     OR (`english_last_name` = 'satou' AND `english_first_name` = 'shiina')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '佐藤' AND p.`first_name` = '椎名')
   OR (p.`english_last_name` = 'satou' AND p.`english_first_name` = 'shiina'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 佐藤 茅穂 / 山陰合同銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '茅穂', '佐藤', 'チホ', 'サトウ',
       'chiho', 'satou', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/12.jpg', '茨城県', 998956800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '佐藤' AND `first_name` = '茅穂')
     OR (`english_last_name` = 'satou' AND `english_first_name` = 'chiho')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '山陰合同銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '佐藤' AND p.`first_name` = '茅穂')
   OR (p.`english_last_name` = 'satou' AND p.`english_first_name` = 'chiho'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '山陰合同銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 佐藤 萌 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '萌', '佐藤', 'モエ', 'サトウ',
       'moe', 'satou', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/00.jpg', '北海道', 960681600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '佐藤' AND `first_name` = '萌')
     OR (`english_last_name` = 'satou' AND `english_first_name` = 'moe')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '佐藤' AND p.`first_name` = '萌')
   OR (p.`english_last_name` = 'satou' AND p.`english_first_name` = 'moe'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 佐藤 雄輝 / 丸杉スティーラーズ (https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '雄輝', '佐藤', 'ユウキ', 'サトウ',
       'yuuki', 'satou', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/00.jpg', '宮城県', 907372800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '佐藤' AND `first_name` = '雄輝')
     OR (`english_last_name` = 'satou' AND `english_first_name` = 'yuuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '丸杉スティーラーズ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '佐藤' AND p.`first_name` = '雄輝')
   OR (p.`english_last_name` = 'satou' AND p.`english_first_name` = 'yuuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '丸杉スティーラーズ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 佐野 大輔 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '大輔', '佐野', 'ダイスケ', 'サノ',
       'daisuke', 'sano', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/10.jpg', '北海道', 959990400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '佐野' AND `first_name` = '大輔')
     OR (`english_last_name` = 'sano' AND `english_first_name` = 'daisuke')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '佐野' AND p.`first_name` = '大輔')
   OR (p.`english_last_name` = 'sano' AND p.`english_first_name` = 'daisuke'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 澤田 修志 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '修志', '澤田', 'シュウジ', 'サワダ',
       'shuuji', 'sawada', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/10.jpg', '北海道', 1184803200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '澤田' AND `first_name` = '修志')
     OR (`english_last_name` = 'sawada' AND `english_first_name` = 'shuuji')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '澤田' AND p.`first_name` = '修志')
   OR (p.`english_last_name` = 'sawada' AND p.`english_first_name` = 'shuuji'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 澤沼 音里 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '音里', '澤沼', 'ネリ', 'サワヌマ',
       'neri', 'sawanuma', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/12.jpg', '北海道', 1073520000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '澤沼' AND `first_name` = '音里')
     OR (`english_last_name` = 'sawanuma' AND `english_first_name` = 'neri')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '澤沼' AND p.`first_name` = '音里')
   OR (p.`english_last_name` = 'sawanuma' AND p.`english_first_name` = 'neri'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 志田 千陽 / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '千陽', '志田', 'チハル', 'シダ',
       'chiharu', 'shida', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/00.jpg', '秋田県', 862272000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '志田' AND `first_name` = '千陽')
     OR (`english_last_name` = 'shida' AND `english_first_name` = 'chiharu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '志田' AND p.`first_name` = '千陽')
   OR (p.`english_last_name` = 'shida' AND p.`english_first_name` = 'chiharu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 柴田 一樹 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '一樹', '柴田', 'カズキ', 'シバタ',
       'kazuki', 'shibata', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/02.jpg', '東京都', 898992000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '柴田' AND `first_name` = '一樹')
     OR (`english_last_name` = 'shibata' AND `english_first_name` = 'kazuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '柴田' AND p.`first_name` = '一樹')
   OR (p.`english_last_name` = 'shibata' AND p.`english_first_name` = 'kazuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 柴田 拓実 / コンサドーレ (https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '拓実', '柴田', 'タクミ', 'シバタ',
       'takumi', 'shibata', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/05.jpg', '東京都', 1030147200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '柴田' AND `first_name` = '拓実')
     OR (`english_last_name` = 'shibata' AND `english_first_name` = 'takumi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'コンサドーレ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '柴田' AND p.`first_name` = '拓実')
   OR (p.`english_last_name` = 'shibata' AND p.`english_first_name` = 'takumi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'コンサドーレ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 霜上 雄一 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '雄一', '霜上', 'ユウイチ', 'シモガミ',
       'yuuichi', 'shimogami', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/00.jpg', '熊本県', 889056000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '霜上' AND `first_name` = '雄一')
     OR (`english_last_name` = 'shimogami' AND `english_first_name` = 'yuuichi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '霜上' AND p.`first_name` = '雄一')
   OR (p.`english_last_name` = 'shimogami' AND p.`english_first_name` = 'yuuichi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 下農 走 / 金沢学院クラブ (https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '走', '下農', 'ハシル', 'シモノ',
       'hashiru', 'shimono', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/03.jpg', '大阪府', 858902400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '下農' AND `first_name` = '走')
     OR (`english_last_name` = 'shimono' AND `english_first_name` = 'hashiru')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '金沢学院クラブ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '下農' AND p.`first_name` = '走')
   OR (p.`english_last_name` = 'shimono' AND p.`english_first_name` = 'hashiru'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '金沢学院クラブ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 白川 菜結 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '菜結', '白川', 'ナユ', 'シラカワ',
       'nayu', 'shirakawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/06.jpg', '千葉県', 1193961600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '白川' AND `first_name` = '菜結')
     OR (`english_last_name` = 'shirakawa' AND `english_first_name` = 'nayu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '白川' AND p.`first_name` = '菜結')
   OR (p.`english_last_name` = 'shirakawa' AND p.`english_first_name` = 'nayu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 志波 寿奈 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '寿奈', '志波', 'ヒナ', 'シワ',
       'hina', 'shiwa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/08.jpg', '佐賀県', 917395200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '志波' AND `first_name` = '寿奈')
     OR (`english_last_name` = 'shiwa' AND `english_first_name` = 'hina')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '志波' AND p.`first_name` = '寿奈')
   OR (p.`english_last_name` = 'shiwa' AND p.`english_first_name` = 'hina'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- シン・スンチャン / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'スンチャン', 'シン', 'スンチャン', 'シン',
       'seungchan', 'shin', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/11.jpg', '韓国', 812937600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = 'シン' AND `first_name` = 'スンチャン')
     OR (`english_last_name` = 'shin' AND `english_first_name` = 'seungchan')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = 'シン' AND p.`first_name` = 'スンチャン')
   OR (p.`english_last_name` = 'shin' AND p.`english_first_name` = 'seungchan'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 水津 愛美 / ACT SAIKYO (https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '愛美', '水津', 'マナミ', 'スイヅ',
       'manami', 'suizu', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/00.jpg', '山口県', 1065571200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '水津' AND `first_name` = '愛美')
     OR (`english_last_name` = 'suizu' AND `english_first_name` = 'manami')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ACT SAIKYO', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '水津' AND p.`first_name` = '愛美')
   OR (p.`english_last_name` = 'suizu' AND p.`english_first_name` = 'manami'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ACT SAIKYO'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 杉本 千紘 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/17.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '千紘', '杉本', 'チヒロ', 'スギモト',
       'chihiro', 'sugimoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/17.jpg', '福井県', 1003017600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '杉本' AND `first_name` = '千紘')
     OR (`english_last_name` = 'sugimoto' AND `english_first_name` = 'chihiro')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '杉本' AND p.`first_name` = '千紘')
   OR (p.`english_last_name` = 'sugimoto' AND p.`english_first_name` = 'chihiro'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 杉山 薫 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '薫', '杉山', 'カオル', 'スギヤマ',
       'kaoru', 'sugiyama', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/07.jpg', '茨城県', 1054857600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '杉山' AND `first_name` = '薫')
     OR (`english_last_name` = 'sugiyama' AND `english_first_name` = 'kaoru')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '杉山' AND p.`first_name` = '薫')
   OR (p.`english_last_name` = 'sugiyama' AND p.`english_first_name` = 'kaoru'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 杉山 未来 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '未来', '杉山', 'ミク', 'スギヤマ',
       'miku', 'sugiyama', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/03.jpg', '千葉県', 986601600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '杉山' AND `first_name` = '未来')
     OR (`english_last_name` = 'sugiyama' AND `english_first_name` = 'miku')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '杉山' AND p.`first_name` = '未来')
   OR (p.`english_last_name` = 'sugiyama' AND p.`english_first_name` = 'miku'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 杉山 凜 / 北都銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '凜', '杉山', 'リン', 'スギヤマ',
       'rin', 'sugiyama', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/01.jpg', '千葉県', 1073520000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '杉山' AND `first_name` = '凜')
     OR (`english_last_name` = 'sugiyama' AND `english_first_name` = 'rin')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '北都銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '杉山' AND p.`first_name` = '凜')
   OR (p.`english_last_name` = 'sugiyama' AND p.`english_first_name` = 'rin'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '北都銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 鈴木 沙也夏 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '沙也夏', '鈴木', 'サヤカ', 'スズキ',
       'sayaka', 'suzuki', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/01.jpg', '奈良県', 1023321600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '鈴木' AND `first_name` = '沙也夏')
     OR (`english_last_name` = 'suzuki' AND `english_first_name` = 'sayaka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '鈴木' AND p.`first_name` = '沙也夏')
   OR (p.`english_last_name` = 'suzuki' AND p.`english_first_name` = 'sayaka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 鈴木 利拓 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '利拓', '鈴木', 'トシヒロ', 'スズキ',
       'toshihiro', 'suzuki', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/07.jpg', '福井県', 917136000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '鈴木' AND `first_name` = '利拓')
     OR (`english_last_name` = 'suzuki' AND `english_first_name` = 'toshihiro')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '鈴木' AND p.`first_name` = '利拓')
   OR (p.`english_last_name` = 'suzuki' AND p.`english_first_name` = 'toshihiro'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 鈴木 陽向 / NTT 東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '陽向', '鈴木', 'ヒナタ', 'スズキ',
       'hinata', 'suzuki', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/00.jpg', '埼玉県', 1017100800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '鈴木' AND `first_name` = '陽向')
     OR (`english_last_name` = 'suzuki' AND `english_first_name` = 'hinata')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT 東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '鈴木' AND p.`first_name` = '陽向')
   OR (p.`english_last_name` = 'suzuki' AND p.`english_first_name` = 'hinata'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT 東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 須藤 海妃 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '海妃', '須藤', 'メイ', 'スドウ',
       'mei', 'sudou', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/12.jpg', '福岡県', 1134604800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '須藤' AND `first_name` = '海妃')
     OR (`english_last_name` = 'sudou' AND `english_first_name` = 'mei')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '須藤' AND p.`first_name` = '海妃')
   OR (p.`english_last_name` = 'sudou' AND p.`english_first_name` = 'mei'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 砂川 温香 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '温香', '砂川', 'ノドカ', 'スナカワ',
       'nodoka', 'sunakawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/08.jpg', '千葉県', 1151971200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '砂川' AND `first_name` = '温香')
     OR (`english_last_name` = 'sunakawa' AND `english_first_name` = 'nodoka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '砂川' AND p.`first_name` = '温香')
   OR (p.`english_last_name` = 'sunakawa' AND p.`english_first_name` = 'nodoka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 関野 里真 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/18.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '里真', '関野', 'リマ', 'セキノ',
       'rima', 'sekino', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/18.jpg', '埼玉県', 1035849600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '関野' AND `first_name` = '里真')
     OR (`english_last_name` = 'sekino' AND `english_first_name` = 'rima')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '関野' AND p.`first_name` = '里真')
   OR (p.`english_last_name` = 'sekino' AND p.`english_first_name` = 'rima'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 善家 百合子 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '百合子', '善家', 'ユリコ', 'ゼンケ',
       'yuriko', 'zenke', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/04.jpg', '岡山県', 957830400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '善家' AND `first_name` = '百合子')
     OR (`english_last_name` = 'zenke' AND `english_first_name` = 'yuriko')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '善家' AND p.`first_name` = '百合子')
   OR (p.`english_last_name` = 'zenke' AND p.`english_first_name` = 'yuriko'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 外川 賢輝 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '賢輝', '外川', 'ゲンキ', 'ソトカワ',
       'genki', 'sotokawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/05.jpg', '青森県', 1010016000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '外川' AND `first_name` = '賢輝')
     OR (`english_last_name` = 'sotokawa' AND `english_first_name` = 'genki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '外川' AND p.`first_name` = '賢輝')
   OR (p.`english_last_name` = 'sotokawa' AND p.`english_first_name` = 'genki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 曽根 夏姫 / 北都銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '夏姫', '曽根', 'ナツキ', 'ソネ',
       'natsuki', 'sone', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/10.jpg', '青森県', 899251200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '曽根' AND `first_name` = '夏姫')
     OR (`english_last_name` = 'sone' AND `english_first_name` = 'natsuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '北都銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '曽根' AND p.`first_name` = '夏姫')
   OR (p.`english_last_name` = 'sone' AND p.`english_first_name` = 'natsuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '北都銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 曽根 雄太 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '雄太', '曽根', 'ユウタ', 'ソネ',
       'yuuta', 'sone', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/06.jpg', '大阪府', 844387200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '曽根' AND `first_name` = '雄太')
     OR (`english_last_name` = 'sone' AND `english_first_name` = 'yuuta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '曽根' AND p.`first_name` = '雄太')
   OR (p.`english_last_name` = 'sone' AND p.`english_first_name` = 'yuuta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 染谷 菜々美 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '菜々美', '染谷', 'ナナミ', 'ソメヤ',
       'nanami', 'someya', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/07.jpg', '茨城県', 1005177600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '染谷' AND `first_name` = '菜々美')
     OR (`english_last_name` = 'someya' AND `english_first_name` = 'nanami')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '染谷' AND p.`first_name` = '菜々美')
   OR (p.`english_last_name` = 'someya' AND p.`english_first_name` = 'nanami'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 高崎 夏実 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '夏実', '高崎', 'ナツミ', 'タカサキ',
       'natsumi', 'takasaki', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/09.jpg', '福岡県', 997228800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '高崎' AND `first_name` = '夏実')
     OR (`english_last_name` = 'takasaki' AND `english_first_name` = 'natsumi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '高崎' AND p.`first_name` = '夏実')
   OR (p.`english_last_name` = 'takasaki' AND p.`english_first_name` = 'natsumi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 髙嶋 集 / 丸杉スティーラーズ (https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '集', '髙嶋', 'シュウ', 'タカシマ',
       'shuu', 'takashima', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/11.jpg', '福岡県', 1004572800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '髙嶋' AND `first_name` = '集')
     OR (`english_last_name` = 'takashima' AND `english_first_name` = 'shuu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '丸杉スティーラーズ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '髙嶋' AND p.`first_name` = '集')
   OR (p.`english_last_name` = 'takashima' AND p.`english_first_name` = 'shuu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '丸杉スティーラーズ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 髙田 亜美 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/27.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '亜美', '髙田', 'アミ', 'タカタ',
       'ami', 'takata', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/27.jpg', '佐賀県', 1190851200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '髙田' AND `first_name` = '亜美')
     OR (`english_last_name` = 'takata' AND `english_first_name` = 'ami')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '髙田' AND p.`first_name` = '亜美')
   OR (p.`english_last_name` = 'takata' AND p.`english_first_name` = 'ami'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 鷹津 蒼斗 / 丸杉スティーラーズ (https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '蒼斗', '鷹津', 'アオト', 'タカツ',
       'aoto', 'takatsu', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/01.jpg', '岡山県', 1143504000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '鷹津' AND `first_name` = '蒼斗')
     OR (`english_last_name` = 'takatsu' AND `english_first_name` = 'aoto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '丸杉スティーラーズ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '鷹津' AND p.`first_name` = '蒼斗')
   OR (p.`english_last_name` = 'takatsu' AND p.`english_first_name` = 'aoto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '丸杉スティーラーズ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 高野 日向 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '日向', '高野', 'ヒュウガ', 'タカノ',
       'hyuuga', 'takano', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/01.jpg', '熊本県', 1186617600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '高野' AND `first_name` = '日向')
     OR (`english_last_name` = 'takano' AND `english_first_name` = 'hyuuga')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '高野' AND p.`first_name` = '日向')
   OR (p.`english_last_name` = 'takano' AND p.`english_first_name` = 'hyuuga'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 髙橋 明日香 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '明日香', '髙橋', 'アスカ', 'タカハシ',
       'asuka', 'takahashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/11.jpg', '栃木県', 942451200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '髙橋' AND `first_name` = '明日香')
     OR (`english_last_name` = 'takahashi' AND `english_first_name` = 'asuka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '髙橋' AND p.`first_name` = '明日香')
   OR (p.`english_last_name` = 'takahashi' AND p.`english_first_name` = 'asuka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 高橋 玄 / 金沢学院クラブ (https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '玄', '高橋', 'ゲン', 'タカハシ',
       'gen', 'takahashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/02.jpg', '新潟県', 949017600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '高橋' AND `first_name` = '玄')
     OR (`english_last_name` = 'takahashi' AND `english_first_name` = 'gen')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '金沢学院クラブ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '高橋' AND p.`first_name` = '玄')
   OR (p.`english_last_name` = 'takahashi' AND p.`english_first_name` = 'gen'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '金沢学院クラブ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 高橋 洸士 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '洸士', '高橋', 'コオ', 'タカハシ',
       'koo', 'takahashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/07.jpg', '福岡県', 1000944000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '高橋' AND `first_name` = '洸士')
     OR (`english_last_name` = 'takahashi' AND `english_first_name` = 'koo')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '高橋' AND p.`first_name` = '洸士')
   OR (p.`english_last_name` = 'takahashi' AND p.`english_first_name` = 'koo'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 高橋 沙弥 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '沙弥', '高橋', 'サヤ', 'タカハシ',
       'saya', 'takahashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/06.jpg', '北海道', 1012608000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '高橋' AND `first_name` = '沙弥')
     OR (`english_last_name` = 'takahashi' AND `english_first_name` = 'saya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '高橋' AND p.`first_name` = '沙弥')
   OR (p.`english_last_name` = 'takahashi' AND p.`english_first_name` = 'saya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 高橋 奈那 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '奈那', '高橋', 'ナナ', 'タカハシ',
       'nana', 'takahashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/01.jpg', '徳島県', 982800000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '高橋' AND `first_name` = '奈那')
     OR (`english_last_name` = 'takahashi' AND `english_first_name` = 'nana')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '高橋' AND p.`first_name` = '奈那')
   OR (p.`english_last_name` = 'takahashi' AND p.`english_first_name` = 'nana'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 髙橋 美優 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '美優', '髙橋', 'ミユ', 'タカハシ',
       'miyu', 'takahashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/01.jpg', '兵庫県', 1021420800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '髙橋' AND `first_name` = '美優')
     OR (`english_last_name` = 'takahashi' AND `english_first_name` = 'miyu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '髙橋' AND p.`first_name` = '美優')
   OR (p.`english_last_name` = 'takahashi' AND p.`english_first_name` = 'miyu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 髙栁 大輔 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '大輔', '髙栁', 'ダイスケ', 'タカヤナギ',
       'daisuke', 'takayanagi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/09.jpg', '静岡県', 1031097600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '髙栁' AND `first_name` = '大輔')
     OR (`english_last_name` = 'takayanagi' AND `english_first_name` = 'daisuke')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '髙栁' AND p.`first_name` = '大輔')
   OR (p.`english_last_name` = 'takayanagi' AND p.`english_first_name` = 'daisuke'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 滝口 友士 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '友士', '滝口', 'ユウト', 'タキグチ',
       'yuuto', 'takiguchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/10.jpg', '神奈川県', 963878400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '滝口' AND `first_name` = '友士')
     OR (`english_last_name` = 'takiguchi' AND `english_first_name` = 'yuuto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '滝口' AND p.`first_name` = '友士')
   OR (p.`english_last_name` = 'takiguchi' AND p.`english_first_name` = 'yuuto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 田口 真彩 / ACT SAIKYO (https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '真彩', '田口', 'マヤ', 'タグチ',
       'maya', 'taguchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/10.jpg', '宮崎県', 1128816000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '田口' AND `first_name` = '真彩')
     OR (`english_last_name` = 'taguchi' AND `english_first_name` = 'maya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ACT SAIKYO', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '田口' AND p.`first_name` = '真彩')
   OR (p.`english_last_name` = 'taguchi' AND p.`english_first_name` = 'maya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ACT SAIKYO'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 武井 優太 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/17.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '優太', '武井', 'ユウタ', 'タケイ',
       'yuuta', 'takei', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/17.jpg', '東京都', 975456000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '武井' AND `first_name` = '優太')
     OR (`english_last_name` = 'takei' AND `english_first_name` = 'yuuta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '武井' AND p.`first_name` = '優太')
   OR (p.`english_last_name` = 'takei' AND p.`english_first_name` = 'yuuta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 武井 凜生 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '凜生', '武井', 'リキ', 'タケイ',
       'riki', 'takei', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/01.jpg', '東京都', 1058745600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '武井' AND `first_name` = '凜生')
     OR (`english_last_name` = 'takei' AND `english_first_name` = 'riki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '武井' AND p.`first_name` = '凜生')
   OR (p.`english_last_name` = 'takei' AND p.`english_first_name` = 'riki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 竹澤 陽生 / 金沢学院クラブ (https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '陽生', '竹澤', 'ヨウセイ', 'タケザワ',
       'yousei', 'takezawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/01.jpg', '福井県', 1065571200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '竹澤' AND `first_name` = '陽生')
     OR (`english_last_name` = 'takezawa' AND `english_first_name` = 'yousei')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '金沢学院クラブ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '竹澤' AND p.`first_name` = '陽生')
   OR (p.`english_last_name` = 'takezawa' AND p.`english_first_name` = 'yousei'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '金沢学院クラブ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 武田 航太 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '航太', '武田', 'コウタ', 'タケダ',
       'kouta', 'takeda', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/08.jpg', '新潟県', 1038268800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '武田' AND `first_name` = '航太')
     OR (`english_last_name` = 'takeda' AND `english_first_name` = 'kouta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '武田' AND p.`first_name` = '航太')
   OR (p.`english_last_name` = 'takeda' AND p.`english_first_name` = 'kouta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 田中 果帆 / 北都銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '果帆', '田中', 'カホ', 'タナカ',
       'kaho', 'tanaka', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/03.jpg', '佐賀県', 998611200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '田中' AND `first_name` = '果帆')
     OR (`english_last_name` = 'tanaka' AND `english_first_name` = 'kaho')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '北都銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '田中' AND p.`first_name` = '果帆')
   OR (p.`english_last_name` = 'tanaka' AND p.`english_first_name` = 'kaho'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '北都銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 田中 孝志朗 / 丸杉スティーラーズ (https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '孝志朗', '田中', 'コウシロウ', 'タナカ',
       'koushirou', 'tanaka', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/05.jpg', '高知県', 1057795200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '田中' AND `first_name` = '孝志朗')
     OR (`english_last_name` = 'tanaka' AND `english_first_name` = 'koushirou')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '丸杉スティーラーズ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '田中' AND p.`first_name` = '孝志朗')
   OR (p.`english_last_name` = 'tanaka' AND p.`english_first_name` = 'koushirou'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '丸杉スティーラーズ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 田中 佐彩 / 山陰合同銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '佐彩', '田中', 'サアヤ', 'タナカ',
       'saaya', 'tanaka', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/04.jpg', '熊本県', 1103846400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '田中' AND `first_name` = '佐彩')
     OR (`english_last_name` = 'tanaka' AND `english_first_name` = 'saaya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '山陰合同銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '田中' AND p.`first_name` = '佐彩')
   OR (p.`english_last_name` = 'tanaka' AND p.`english_first_name` = 'saaya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '山陰合同銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 田中 湧士 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '湧士', '田中', 'ユウシ', 'タナカ',
       'yuushi', 'tanaka', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/12.jpg', '熊本県', 939081600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '田中' AND `first_name` = '湧士')
     OR (`english_last_name` = 'tanaka' AND `english_first_name` = 'yuushi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '田中' AND p.`first_name` = '湧士')
   OR (p.`english_last_name` = 'tanaka' AND p.`english_first_name` = 'yuushi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 田部 真唯 / 山陰合同銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '真唯', '田部', 'マイ', 'タナベ',
       'mai', 'tanabe', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/08.jpg', '島根県', 1054684800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '田部' AND `first_name` = '真唯')
     OR (`english_last_name` = 'tanabe' AND `english_first_name` = 'mai')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '山陰合同銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '田部' AND p.`first_name` = '真唯')
   OR (p.`english_last_name` = 'tanabe' AND p.`english_first_name` = 'mai'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '山陰合同銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 田邉 裕美 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '裕美', '田邉', 'ユミ', 'タナベ',
       'yumi', 'tanabe', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/10.jpg', '福井県', 1080691200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '田邉' AND `first_name` = '裕美')
     OR (`english_last_name` = 'tanabe' AND `english_first_name` = 'yumi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '田邉' AND p.`first_name` = '裕美')
   OR (p.`english_last_name` = 'tanabe' AND p.`english_first_name` = 'yumi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 谷岡 大后 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '大后', '谷岡', 'ダイゴ', 'タニオカ',
       'daigo', 'tanioka', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/00.jpg', '高知県', 1137024000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '谷岡' AND `first_name` = '大后')
     OR (`english_last_name` = 'tanioka' AND `english_first_name` = 'daigo')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '谷岡' AND p.`first_name` = '大后')
   OR (p.`english_last_name` = 'tanioka' AND p.`english_first_name` = 'daigo'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 玉手 勝輝 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '勝輝', '玉手', 'カツキ', 'タマテ',
       'katsuki', 'tamate', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/07.jpg', '宮城県', 830476800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '玉手' AND `first_name` = '勝輝')
     OR (`english_last_name` = 'tamate' AND `english_first_name` = 'katsuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '玉手' AND p.`first_name` = '勝輝')
   OR (p.`english_last_name` = 'tamate' AND p.`english_first_name` = 'katsuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- チェ・ソルギュ / 金沢学院クラブ (https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'ソルギュ', 'チェ', 'ソルギュ', 'チェ',
       'solgyu', 'choi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/07.jpg', '韓国', 807580800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = 'チェ' AND `first_name` = 'ソルギュ')
     OR (`english_last_name` = 'choi' AND `english_first_name` = 'solgyu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '金沢学院クラブ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = 'チェ' AND p.`first_name` = 'ソルギュ')
   OR (p.`english_last_name` = 'choi' AND p.`english_first_name` = 'solgyu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '金沢学院クラブ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 千葉 美采 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '美采', '千葉', 'ミコト', 'チバ',
       'mikoto', 'chiba', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/07.jpg', '福島県', 999907200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '千葉' AND `first_name` = '美采')
     OR (`english_last_name` = 'chiba' AND `english_first_name` = 'mikoto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '千葉' AND p.`first_name` = '美采')
   OR (p.`english_last_name` = 'chiba' AND p.`english_first_name` = 'mikoto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 辻 凌也 / コンサドーレ (https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '凌也', '辻', 'リョウヤ', 'ツジ',
       'ryouya', 'tsuji', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/11.jpg', '長崎県', 937612800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '辻' AND `first_name` = '凌也')
     OR (`english_last_name` = 'tsuji' AND `english_first_name` = 'ryouya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'コンサドーレ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '辻' AND p.`first_name` = '凌也')
   OR (p.`english_last_name` = 'tsuji' AND p.`english_first_name` = 'ryouya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'コンサドーレ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 辻田 つかさ / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'つかさ', '辻田', 'ツカサ', 'ツジタ',
       'tsukasa', 'tsujita', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/03.jpg', '奈良県', 883958400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '辻田' AND `first_name` = 'つかさ')
     OR (`english_last_name` = 'tsujita' AND `english_first_name` = 'tsukasa')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '辻田' AND p.`first_name` = 'つかさ')
   OR (p.`english_last_name` = 'tsujita' AND p.`english_first_name` = 'tsukasa'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 常塚 光 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '光', '常塚', 'ヒカル', 'ツネヅカ',
       'hikaru', 'tsunezuka', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/11.jpg', '京都府', 839808000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '常塚' AND `first_name` = '光')
     OR (`english_last_name` = 'tsunezuka' AND `english_first_name` = 'hikaru')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '常塚' AND p.`first_name` = '光')
   OR (p.`english_last_name` = 'tsunezuka' AND p.`english_first_name` = 'hikaru'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 寺島 颯大 / 東海興業 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '颯大', '寺島', 'ハヤタ', 'テラシマ',
       'hayata', 'terashima', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/02.jpg', '宮城県', 965347200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '寺島' AND `first_name` = '颯大')
     OR (`english_last_name` = 'terashima' AND `english_first_name` = 'hayata')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '東海興業', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '寺島' AND p.`first_name` = '颯大')
   OR (p.`english_last_name` = 'terashima' AND p.`english_first_name` = 'hayata'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '東海興業'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 戸内 佑亮 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '佑亮', '戸内', 'ユウスケ', 'トウチ',
       'yuusuke', 'touchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/08.jpg', '兵庫県', 901929600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '戸内' AND `first_name` = '佑亮')
     OR (`english_last_name` = 'touchi' AND `english_first_name` = 'yuusuke')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '戸内' AND p.`first_name` = '佑亮')
   OR (p.`english_last_name` = 'touchi' AND p.`english_first_name` = 'yuusuke'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 東野 有咲 / 山陰合同銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '有咲', '東野', 'アリサ', 'トウノ',
       'arisa', 'touno', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/10.jpg', '福岡県', 1150243200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '東野' AND `first_name` = '有咲')
     OR (`english_last_name` = 'touno' AND `english_first_name` = 'arisa')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '山陰合同銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '東野' AND p.`first_name` = '有咲')
   OR (p.`english_last_name` = 'touno' AND p.`english_first_name` = 'arisa'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '山陰合同銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 飛田 修 / 丸杉スティーラーズ (https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '修', '飛田', 'シュウ', 'トビタ',
       'shuu', 'tobita', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/10.jpg', '北海道', 1031270400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '飛田' AND `first_name` = '修')
     OR (`english_last_name` = 'tobita' AND `english_first_name` = 'shuu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '丸杉スティーラーズ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '飛田' AND p.`first_name` = '修')
   OR (p.`english_last_name` = 'tobita' AND p.`english_first_name` = 'shuu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '丸杉スティーラーズ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 中静 朱里 / NTT 東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '朱里', '中静', 'アカリ', 'ナカシズ',
       'akari', 'nakashizu', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/01.jpg', '栃木県', 1022630400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '中静' AND `first_name` = '朱里')
     OR (`english_last_name` = 'nakashizu' AND `english_first_name` = 'akari')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT 東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '中静' AND p.`first_name` = '朱里')
   OR (p.`english_last_name` = 'nakashizu' AND p.`english_first_name` = 'akari'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT 東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 中静 悠斗 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '悠斗', '中静', 'ユウト', 'ナカシズ',
       'yuuto', 'nakashizu', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/05.jpg', '栃木県', 1164758400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '中静' AND `first_name` = '悠斗')
     OR (`english_last_name` = 'nakashizu' AND `english_first_name` = 'yuuto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '中静' AND p.`first_name` = '悠斗')
   OR (p.`english_last_name` = 'nakashizu' AND p.`english_first_name` = 'yuuto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 中出 すみれ / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'すみれ', '中出', 'スミレ', 'ナカデ',
       'sumire', 'nakade', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/09.jpg', '富山県', 1077926400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '中出' AND `first_name` = 'すみれ')
     OR (`english_last_name` = 'nakade' AND `english_first_name` = 'sumire')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '中出' AND p.`first_name` = 'すみれ')
   OR (p.`english_last_name` = 'nakade' AND p.`english_first_name` = 'sumire'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 中西 貴映 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '貴映', '中西', 'キエ', 'ナカニシ',
       'kie', 'nakanishi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/06.jpg', '神奈川県', 819763200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '中西' AND `first_name` = '貴映')
     OR (`english_last_name` = 'nakanishi' AND `english_first_name` = 'kie')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '中西' AND p.`first_name` = '貴映')
   OR (p.`english_last_name` = 'nakanishi' AND p.`english_first_name` = 'kie'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 中原 鈴 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '鈴', '中原', 'スズ', 'ナカハラ',
       'suzu', 'nakahara', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/08.jpg', '岡山県', 1072137600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '中原' AND `first_name` = '鈴')
     OR (`english_last_name` = 'nakahara' AND `english_first_name` = 'suzu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '中原' AND p.`first_name` = '鈴')
   OR (p.`english_last_name` = 'nakahara' AND p.`english_first_name` = 'suzu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 中村 舜 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '舜', '中村', 'シュン', 'ナカムラ',
       'shun', 'nakamura', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/07.jpg', '福井県', 1021939200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '中村' AND `first_name` = '舜')
     OR (`english_last_name` = 'nakamura' AND `english_first_name` = 'shun')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '中村' AND p.`first_name` = '舜')
   OR (p.`english_last_name` = 'nakamura' AND p.`english_first_name` = 'shun'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 中谷 壱心 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '壱心', '中谷', 'イッシン', 'ナカヤ',
       'isshin', 'nakaya', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/10.jpg', '福井県', 1066003200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '中谷' AND `first_name` = '壱心')
     OR (`english_last_name` = 'nakaya' AND `english_first_name` = 'isshin')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '中谷' AND p.`first_name` = '壱心')
   OR (p.`english_last_name` = 'nakaya' AND p.`english_first_name` = 'isshin'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 永田 萌恵 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '萌恵', '永田', 'モエ', 'ナガタ',
       'moe', 'nagata', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/10.jpg', '長崎県', 1078012800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '永田' AND `first_name` = '萌恵')
     OR (`english_last_name` = 'nagata' AND `english_first_name` = 'moe')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '永田' AND p.`first_name` = '萌恵')
   OR (p.`english_last_name` = 'nagata' AND p.`english_first_name` = 'moe'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 永渕 妃香 / 北都銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/13.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '妃香', '永渕', 'ヒメカ', 'ナガフチ',
       'himeka', 'nagafuchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/13.jpg', '佐賀県', 1105574400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '永渕' AND `first_name` = '妃香')
     OR (`english_last_name` = 'nagafuchi' AND `english_first_name` = 'himeka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '北都銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '永渕' AND p.`first_name` = '妃香')
   OR (p.`english_last_name` = 'nagafuchi' AND p.`english_first_name` = 'himeka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '北都銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 永渕 雄大 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '雄大', '永渕', 'ユウダイ', 'ナガフチ',
       'yuudai', 'nagafuchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/03.jpg', '佐賀県', 1022803200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '永渕' AND `first_name` = '雄大')
     OR (`english_last_name` = 'nagafuchi' AND `english_first_name` = 'yuudai')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '永渕' AND p.`first_name` = '雄大')
   OR (p.`english_last_name` = 'nagafuchi' AND p.`english_first_name` = 'yuudai'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 生木 萌果 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '萌果', '生木', 'モエカ', 'ナマキ',
       'moeka', 'namaki', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/10.jpg', '兵庫県', 935539200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '生木' AND `first_name` = '萌果')
     OR (`english_last_name` = 'namaki' AND `english_first_name` = 'moeka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '生木' AND p.`first_name` = '萌果')
   OR (p.`english_last_name` = 'namaki' AND p.`english_first_name` = 'moeka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 奈良岡 功大 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/37.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '功大', '奈良岡', 'コウダイ', 'ナラオカ',
       'koudai', 'naraoka', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/37.jpg', '青森県', 993859200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '奈良岡' AND `first_name` = '功大')
     OR (`english_last_name` = 'naraoka' AND `english_first_name` = 'koudai')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '奈良岡' AND p.`first_name` = '功大')
   OR (p.`english_last_name` = 'naraoka' AND p.`english_first_name` = 'koudai'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 南茂 斗羽 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '斗羽', '南茂', 'トワ', 'ナンモ',
       'towa', 'nanmo', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/08.jpg', '福井県', 1056931200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '南茂' AND `first_name` = '斗羽')
     OR (`english_last_name` = 'nanmo' AND `english_first_name` = 'towa')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '南茂' AND p.`first_name` = '斗羽')
   OR (p.`english_last_name` = 'nanmo' AND p.`english_first_name` = 'towa'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 新見 桃芭 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '桃芭', '新見', 'モモハ', 'ニイミ',
       'momoha', 'niimi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/12.jpg', '山口県', 1111363200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '新見' AND `first_name` = '桃芭')
     OR (`english_last_name` = 'niimi' AND `english_first_name` = 'momoha')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '新見' AND p.`first_name` = '桃芭')
   OR (p.`english_last_name` = 'niimi' AND p.`english_first_name` = 'momoha'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 西 大輝 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '大輝', '西', 'ヒロキ', 'ニシ',
       'hiroki', 'nishi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/03.jpg', '京都府', 1048204800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '西' AND `first_name` = '大輝')
     OR (`english_last_name` = 'nishi' AND `english_first_name` = 'hiroki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '西' AND p.`first_name` = '大輝')
   OR (p.`english_last_name` = 'nishi' AND p.`english_first_name` = 'hiroki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 西尾 寿輝 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '寿輝', '西尾', 'トシキ', 'ニシオ',
       'toshiki', 'nishio', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/08.jpg', '大阪府', 1198800000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '西尾' AND `first_name` = '寿輝')
     OR (`english_last_name` = 'nishio' AND `english_first_name` = 'toshiki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '西尾' AND p.`first_name` = '寿輝')
   OR (p.`english_last_name` = 'nishio' AND p.`english_first_name` = 'toshiki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 西田 陽耶 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '陽耶', '西田', 'ハルヤ', 'ニシダ',
       'haruya', 'nishida', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/09.jpg', '富山県', 1019174400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '西田' AND `first_name` = '陽耶')
     OR (`english_last_name` = 'nishida' AND `english_first_name` = 'haruya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '西田' AND p.`first_name` = '陽耶')
   OR (p.`english_last_name` = 'nishida' AND p.`english_first_name` = 'haruya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 西本 拳太 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/51.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '拳太', '西本', 'ケンタ', 'ニシモト',
       'kenta', 'nishimoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/51.jpg', '三重県', 778204800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '西本' AND `first_name` = '拳太')
     OR (`english_last_name` = 'nishimoto' AND `english_first_name` = 'kenta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '西本' AND p.`first_name` = '拳太')
   OR (p.`english_last_name` = 'nishimoto' AND p.`english_first_name` = 'kenta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 仁平 菜月 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '菜月', '仁平', 'ナツキ', 'ニダイラ',
       'natsuki', 'nidaira', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/02.jpg', '茨城県', 900201600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '仁平' AND `first_name` = '菜月')
     OR (`english_last_name` = 'nidaira' AND `english_first_name` = 'natsuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '仁平' AND p.`first_name` = '菜月')
   OR (p.`english_last_name` = 'nidaira' AND p.`english_first_name` = 'natsuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 野口 翔平 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/14.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '翔平', '野口', 'ショウヘイ', 'ノグチ',
       'shouhei', 'noguchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/14.jpg', '東京都', 1064620800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '野口' AND `first_name` = '翔平')
     OR (`english_last_name` = 'noguchi' AND `english_first_name` = 'shouhei')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '野口' AND p.`first_name` = '翔平')
   OR (p.`english_last_name` = 'noguchi' AND p.`english_first_name` = 'shouhei'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 農口 拓弥 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '拓弥', '農口', 'タクヤ', 'ノグチ',
       'takuya', 'noguchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/09.jpg', '福井県', 962064000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '農口' AND `first_name` = '拓弥')
     OR (`english_last_name` = 'noguchi' AND `english_first_name` = 'takuya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '農口' AND p.`first_name` = '拓弥')
   OR (p.`english_last_name` = 'noguchi' AND p.`english_first_name` = 'takuya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 野田 統馬 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '統馬', '野田', 'トウマ', 'ノダ',
       'touma', 'noda', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/09.jpg', '福岡県', 1010966400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '野田' AND `first_name` = '統馬')
     OR (`english_last_name` = 'noda' AND `english_first_name` = 'touma')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '野田' AND p.`first_name` = '統馬')
   OR (p.`english_last_name` = 'noda' AND p.`english_first_name` = 'touma'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 野田 悠斗 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '悠斗', '野田', 'ユウト', 'ノダ',
       'yuuto', 'noda', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/05.jpg', '佐賀県', 874195200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '野田' AND `first_name` = '悠斗')
     OR (`english_last_name` = 'noda' AND `english_first_name` = 'yuuto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '野田' AND p.`first_name` = '悠斗')
   OR (p.`english_last_name` = 'noda' AND p.`english_first_name` = 'yuuto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 野村 拓海 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '拓海', '野村', 'タクミ', 'ノムラ',
       'takumi', 'nomura', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/02.jpg', '宮城県', 870912000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '野村' AND `first_name` = '拓海')
     OR (`english_last_name` = 'nomura' AND `english_first_name` = 'takumi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '野村' AND p.`first_name` = '拓海')
   OR (p.`english_last_name` = 'nomura' AND p.`english_first_name` = 'takumi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 畑末 真緒 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/21.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '真緒', '畑末', 'マオ', 'ハタスエ',
       'mao', 'hatasue', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/21.jpg', '兵庫県', 1118448000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '畑末' AND `first_name` = '真緒')
     OR (`english_last_name` = 'hatasue' AND `english_first_name` = 'mao')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '畑末' AND p.`first_name` = '真緒')
   OR (p.`english_last_name` = 'hatasue' AND p.`english_first_name` = 'mao'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 秦野 陸 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '陸', '秦野', 'リク', 'ハタノ',
       'riku', 'hatano', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/06.jpg', '北海道', 992908800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '秦野' AND `first_name` = '陸')
     OR (`english_last_name` = 'hatano' AND `english_first_name` = 'riku')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '秦野' AND p.`first_name` = '陸')
   OR (p.`english_last_name` = 'hatano' AND p.`english_first_name` = 'riku'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 花田 彬 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '彬', '花田', 'アキラ', 'ハナダ',
       'akira', 'hanada', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/10.jpg', '福岡県', 1031702400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '花田' AND `first_name` = '彬')
     OR (`english_last_name` = 'hanada' AND `english_first_name` = 'akira')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '花田' AND p.`first_name` = '彬')
   OR (p.`english_last_name` = 'hanada' AND p.`english_first_name` = 'akira'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 林 寿輝弥 / 東海興業 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '寿輝弥', '林', 'ジュキヤ', 'ハヤシ',
       'jukiya', 'hayashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/08.jpg', '北海道', 1005436800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '林' AND `first_name` = '寿輝弥')
     OR (`english_last_name` = 'hayashi' AND `english_first_name` = 'jukiya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '東海興業', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '林' AND p.`first_name` = '寿輝弥')
   OR (p.`english_last_name` = 'hayashi' AND p.`english_first_name` = 'jukiya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '東海興業'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 原 菜那子 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '菜那子', '原', 'ナナコ', 'ハラ',
       'nanako', 'hara', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/05.jpg', '群馬県', 1143763200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '原' AND `first_name` = '菜那子')
     OR (`english_last_name` = 'hara' AND `english_first_name` = 'nanako')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '原' AND p.`first_name` = '菜那子')
   OR (p.`english_last_name` = 'hara' AND p.`english_first_name` = 'nanako'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 比嘉 悠姫奈 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '悠姫奈', '比嘉', 'ユキナ', 'ヒガ',
       'yukina', 'higa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/09.jpg', '沖縄県', 1009238400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '比嘉' AND `first_name` = '悠姫奈')
     OR (`english_last_name` = 'higa' AND `english_first_name` = 'yukina')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '比嘉' AND p.`first_name` = '悠姫奈')
   OR (p.`english_last_name` = 'higa' AND p.`english_first_name` = 'yukina'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 疋田 聖也 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '聖也', '疋田', 'セイヤ', 'ヒキタ',
       'seiya', 'hikita', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/12.jpg', '奈良県', 837820800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '疋田' AND `first_name` = '聖也')
     OR (`english_last_name` = 'hikita' AND `english_first_name` = 'seiya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '疋田' AND p.`first_name` = '聖也')
   OR (p.`english_last_name` = 'hikita' AND p.`english_first_name` = 'seiya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 久湊 菜々 / ACT SAIKYO (https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '菜々', '久湊', 'ナナ', 'ヒサミナト',
       'nana', 'hisaminato', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/09.jpg', '愛知県', 1057104000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '久湊' AND `first_name` = '菜々')
     OR (`english_last_name` = 'hisaminato' AND `english_first_name` = 'nana')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ACT SAIKYO', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '久湊' AND p.`first_name` = '菜々')
   OR (p.`english_last_name` = 'hisaminato' AND p.`english_first_name` = 'nana'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ACT SAIKYO'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 日野石 杏 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/13.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '杏', '日野石', 'アンズ', 'ヒノイシ',
       'anzu', 'hinoishi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/13.jpg', '広島県', 1086739200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '日野石' AND `first_name` = '杏')
     OR (`english_last_name` = 'hinoishi' AND `english_first_name` = 'anzu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '日野石' AND p.`first_name` = '杏')
   OR (p.`english_last_name` = 'hinoishi' AND p.`english_first_name` = 'anzu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 平本 梨々菜 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/17.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '梨々菜', '平本', 'リリナ', 'ヒラモト',
       'ririna', 'hiramoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/17.jpg', '岐阜県', 1147996800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '平本' AND `first_name` = '梨々菜')
     OR (`english_last_name` = 'hiramoto' AND `english_first_name` = 'ririna')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '平本' AND p.`first_name` = '梨々菜')
   OR (p.`english_last_name` = 'hiramoto' AND p.`english_first_name` = 'ririna'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 廣上 瑠依 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '瑠依', '廣上', 'ルイ', 'ヒロカミ',
       'rui', 'hirokami', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/08.jpg', '富山県', 1027641600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '廣上' AND `first_name` = '瑠依')
     OR (`english_last_name` = 'hirokami' AND `english_first_name` = 'rui')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '廣上' AND p.`first_name` = '瑠依')
   OR (p.`english_last_name` = 'hirokami' AND p.`english_first_name` = 'rui'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 廣田 彩花 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '彩花', '廣田', 'サヤカ', 'ヒロタ',
       'sayaka', 'hirota', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/10.jpg', '熊本県', 775699200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '廣田' AND `first_name` = '彩花')
     OR (`english_last_name` = 'hirota' AND `english_first_name` = 'sayaka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '廣田' AND p.`first_name` = '彩花')
   OR (p.`english_last_name` = 'hirota' AND p.`english_first_name` = 'sayaka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 深田 百香 / 広島ガス (https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '百香', '深田', 'モモカ', 'フカダ',
       'momoka', 'fukada', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hiroshima-gas/06.jpg', '北海道', 1041984000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '深田' AND `first_name` = '百香')
     OR (`english_last_name` = 'fukada' AND `english_first_name` = 'momoka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '広島ガス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '深田' AND p.`first_name` = '百香')
   OR (p.`english_last_name` = 'fukada' AND p.`english_first_name` = 'momoka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '広島ガス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 福島 由紀 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '由紀', '福島', 'ユキ', 'フクシマ',
       'yuki', 'fukushima', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/01.jpg', '熊本県', 736646400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '福島' AND `first_name` = '由紀')
     OR (`english_last_name` = 'fukushima' AND `english_first_name` = 'yuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '福島' AND p.`first_name` = '由紀')
   OR (p.`english_last_name` = 'fukushima' AND p.`english_first_name` = 'yuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 藤澤 佳史 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '佳史', '藤澤', 'ヨシフミ', 'フジサワ',
       'yoshifumi', 'fujisawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/11.jpg', '岩手県', 989539200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '藤澤' AND `first_name` = '佳史')
     OR (`english_last_name` = 'fujisawa' AND `english_first_name` = 'yoshifumi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '藤澤' AND p.`first_name` = '佳史')
   OR (p.`english_last_name` = 'fujisawa' AND p.`english_first_name` = 'yoshifumi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 藤田 遼 / 金沢学院クラブ (https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '遼', '藤田', 'リョウ', 'フジタ',
       'ryou', 'fujita', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/kanazawa-gakuin-club/09.jpg', '愛媛県', 717552000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '藤田' AND `first_name` = '遼')
     OR (`english_last_name` = 'fujita' AND `english_first_name` = 'ryou')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '金沢学院クラブ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '藤田' AND p.`first_name` = '遼')
   OR (p.`english_last_name` = 'fujita' AND p.`english_first_name` = 'ryou'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '金沢学院クラブ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 藤原 圭祐 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '圭祐', '藤原', 'ケイスケ', 'フジワラ',
       'keisuke', 'fujiwara', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/08.jpg', '岐阜県', 908582400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '藤原' AND `first_name` = '圭祐')
     OR (`english_last_name` = 'fujiwara' AND `english_first_name` = 'keisuke')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '藤原' AND p.`first_name` = '圭祐')
   OR (p.`english_last_name` = 'fujiwara' AND p.`english_first_name` = 'keisuke'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 古川 佳奈 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '佳奈', '古川', 'カナ', 'フルカワ',
       'kana', 'furukawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/09.jpg', '岩手県', 799977600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '古川' AND `first_name` = '佳奈')
     OR (`english_last_name` = 'furukawa' AND `english_first_name` = 'kana')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '古川' AND p.`first_name` = '佳奈')
   OR (p.`english_last_name` = 'furukawa' AND p.`english_first_name` = 'kana'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 保木 卓朗 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/19.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '卓朗', '保木', 'タクロウ', 'ホキ',
       'takurou', 'hoki', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/19.jpg', '山口県', 808358400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '保木' AND `first_name` = '卓朗')
     OR (`english_last_name` = 'hoki' AND `english_first_name` = 'takurou')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '保木' AND p.`first_name` = '卓朗')
   OR (p.`english_last_name` = 'hoki' AND p.`english_first_name` = 'takurou'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 保原 彩夏 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '彩夏', '保原', 'サヤカ', 'ホバラ',
       'sayaka', 'hobara', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/03.jpg', '宮城県', 901756800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '保原' AND `first_name` = '彩夏')
     OR (`english_last_name` = 'hobara' AND `english_first_name` = 'sayaka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '保原' AND p.`first_name` = '彩夏')
   OR (p.`english_last_name` = 'hobara' AND p.`english_first_name` = 'sayaka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 本田 大樹 / コンサドーレ (https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '大樹', '本田', 'タイキ', 'ホンダ',
       'taiki', 'honda', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/04.jpg', '京都府', 917395200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '本田' AND `first_name` = '大樹')
     OR (`english_last_name` = 'honda' AND `english_first_name` = 'taiki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'コンサドーレ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '本田' AND p.`first_name` = '大樹')
   OR (p.`english_last_name` = 'honda' AND p.`english_first_name` = 'taiki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'コンサドーレ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 本田 尚人 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '尚人', '本田', 'ナオト', 'ホンダ',
       'naoto', 'honda', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/00.jpg', '新潟県', 692236800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '本田' AND `first_name` = '尚人')
     OR (`english_last_name` = 'honda' AND `english_first_name` = 'naoto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '本田' AND p.`first_name` = '尚人')
   OR (p.`english_last_name` = 'honda' AND p.`english_first_name` = 'naoto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 本田 光 / 東海興業 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '光', '本田', 'ヒカル', 'ホンダ',
       'hikaru', 'honda', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/04.jpg', '長野県', 1020124800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '本田' AND `first_name` = '光')
     OR (`english_last_name` = 'honda' AND `english_first_name` = 'hikaru')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '東海興業', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '本田' AND p.`first_name` = '光')
   OR (p.`english_last_name` = 'honda' AND p.`english_first_name` = 'hikaru'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '東海興業'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 牧野 桂大 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '桂大', '牧野', 'ケイタ', 'マキノ',
       'keita', 'makino', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/08.jpg', '福井県', 833500800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '牧野' AND `first_name` = '桂大')
     OR (`english_last_name` = 'makino' AND `english_first_name` = 'keita')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '牧野' AND p.`first_name` = '桂大')
   OR (p.`english_last_name` = 'makino' AND p.`english_first_name` = 'keita'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 孫田 太郎 / 丸杉スティーラーズ (https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '太郎', '孫田', 'タロウ', 'マゴタ',
       'tarou', 'magota', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/marusugi/07.jpg', '兵庫県', 1033516800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '孫田' AND `first_name` = '太郎')
     OR (`english_last_name` = 'magota' AND `english_first_name` = 'tarou')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '丸杉スティーラーズ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '孫田' AND p.`first_name` = '太郎')
   OR (p.`english_last_name` = 'magota' AND p.`english_first_name` = 'tarou'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '丸杉スティーラーズ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 舛木 さくら / 北都銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/9.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'さくら', '舛木', 'サクラ', 'マスキ',
       'sakura', 'masuki', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/hokuto-bank/09.jpg', '栃木県', 1079481600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '舛木' AND `first_name` = 'さくら')
     OR (`english_last_name` = 'masuki' AND `english_first_name` = 'sakura')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '北都銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '舛木' AND p.`first_name` = 'さくら')
   OR (p.`english_last_name` = 'masuki' AND p.`english_first_name` = 'sakura'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '北都銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 増本 康祐 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '康祐', '増本', 'コウスケ', 'マスモト',
       'kousuke', 'masumoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/02.jpg', '愛媛県', 1045180800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '増本' AND `first_name` = '康祐')
     OR (`english_last_name` = 'masumoto' AND `english_first_name` = 'kousuke')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '増本' AND p.`first_name` = '康祐')
   OR (p.`english_last_name` = 'masumoto' AND p.`english_first_name` = 'kousuke'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 松居 圭一郎 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '圭一郎', '松居', 'ケイイチロウ', 'マツイ',
       'keiichirou', 'matsui', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/04.jpg', '石川県', 770774400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '松居' AND `first_name` = '圭一郎')
     OR (`english_last_name` = 'matsui' AND `english_first_name` = 'keiichirou')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '松居' AND p.`first_name` = '圭一郎')
   OR (p.`english_last_name` = 'matsui' AND p.`english_first_name` = 'keiichirou'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 松川 健大 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '健大', '松川', 'ケンタ', 'マツカワ',
       'kenta', 'matsukawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/06.jpg', '神奈川県', 1150675200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '松川' AND `first_name` = '健大')
     OR (`english_last_name` = 'matsukawa' AND `english_first_name` = 'kenta')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '松川' AND p.`first_name` = '健大')
   OR (p.`english_last_name` = 'matsukawa' AND p.`english_first_name` = 'kenta'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 松田 仁衣菜 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '仁衣菜', '松田', 'ニイナ', 'マツタ',
       'niina', 'matsuta', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/biprogy/02.jpg', '福井県', 1159228800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '松田' AND `first_name` = '仁衣菜')
     OR (`english_last_name` = 'matsuta' AND `english_first_name` = 'niina')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '松田' AND p.`first_name` = '仁衣菜')
   OR (p.`english_last_name` = 'matsuta' AND p.`english_first_name` = 'niina'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 松本 祐介 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/21.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '祐介', '松本', 'ユウスケ', 'マツモト',
       'yuusuke', 'matsumoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/21.jpg', '神奈川県', 944870400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '松本' AND `first_name` = '祐介')
     OR (`english_last_name` = 'matsumoto' AND `english_first_name` = 'yuusuke')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '松本' AND p.`first_name` = '祐介')
   OR (p.`english_last_name` = 'matsumoto' AND p.`english_first_name` = 'yuusuke'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 松山 奈未 / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '奈未', '松山', 'ナミ', 'マツヤマ',
       'nami', 'matsuyama', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/10.jpg', '福岡県', 898992000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '松山' AND `first_name` = '奈未')
     OR (`english_last_name` = 'matsuyama' AND `english_first_name` = 'nami')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '松山' AND p.`first_name` = '奈未')
   OR (p.`english_last_name` = 'matsuyama' AND p.`english_first_name` = 'nami'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 三浦 將誓 / コンサドーレ (https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '將誓', '三浦', 'ショウセイ', 'ミウラ',
       'shousei', 'miura', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/08.jpg', '青森県', 859507200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '三浦' AND `first_name` = '將誓')
     OR (`english_last_name` = 'miura' AND `english_first_name` = 'shousei')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'コンサドーレ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '三浦' AND p.`first_name` = '將誓')
   OR (p.`english_last_name` = 'miura' AND p.`english_first_name` = 'shousei'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'コンサドーレ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 三浦 大地 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '大地', '三浦', 'ダイチ', 'ミウラ',
       'daichi', 'miura', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/06.jpg', '神奈川県', 1156982400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '三浦' AND `first_name` = '大地')
     OR (`english_last_name` = 'miura' AND `english_first_name` = 'daichi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '三浦' AND p.`first_name` = '大地')
   OR (p.`english_last_name` = 'miura' AND p.`english_first_name` = 'daichi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 三上 楓 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '楓', '三上', 'フウ', 'ミカミ',
       'fuu', 'mikami', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/00.jpg', '青森県', 876873600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '三上' AND `first_name` = '楓')
     OR (`english_last_name` = 'mikami' AND `english_first_name` = 'fuu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '三上' AND p.`first_name` = '楓')
   OR (p.`english_last_name` = 'mikami' AND p.`english_first_name` = 'fuu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 水井 寿々妃 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '寿々妃', '水井', 'スズキ', 'ミズイ',
       'suzuki', 'mizui', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/06.jpg', '奈良県', 1107302400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '水井' AND `first_name` = '寿々妃')
     OR (`english_last_name` = 'mizui' AND `english_first_name` = 'suzuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '水井' AND p.`first_name` = '寿々妃')
   OR (p.`english_last_name` = 'mizui' AND p.`english_first_name` = 'suzuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 水井 ひらり / NTT 東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT 'ひらり', '水井', 'ヒラリ', 'ミズイ',
       'hirari', 'mizui', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/06.jpg', '奈良県', 964224000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '水井' AND `first_name` = 'ひらり')
     OR (`english_last_name` = 'mizui' AND `english_first_name` = 'hirari')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT 東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '水井' AND p.`first_name` = 'ひらり')
   OR (p.`english_last_name` = 'mizui' AND p.`english_first_name` = 'hirari'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT 東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 三橋 健也 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '健也', '三橋', 'ケンヤ', 'ミツハシ',
       'kenya', 'mitsuhashi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/06.jpg', '群馬県', 868579200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '三橋' AND `first_name` = '健也')
     OR (`english_last_name` = 'mitsuhashi' AND `english_first_name` = 'kenya')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '三橋' AND p.`first_name` = '健也')
   OR (p.`english_last_name` = 'mitsuhashi' AND p.`english_first_name` = 'kenya'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 緑川 大輝 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '大輝', '緑川', 'ヒロキ', 'ミドリカワ',
       'hiroki', 'midorikawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/00.jpg', '埼玉県', 958521600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '緑川' AND `first_name` = '大輝')
     OR (`english_last_name` = 'midorikawa' AND `english_first_name` = 'hiroki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '緑川' AND p.`first_name` = '大輝')
   OR (p.`english_last_name` = 'midorikawa' AND p.`english_first_name` = 'hiroki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 宮内 公佳 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '公佳', '宮内', 'キミカ', 'ミヤウチ',
       'kimika', 'miyauchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/11.jpg', '山口県', 933292800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '宮内' AND `first_name` = '公佳')
     OR (`english_last_name` = 'miyauchi' AND `english_first_name` = 'kimika')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '宮内' AND p.`first_name` = '公佳')
   OR (p.`english_last_name` = 'miyauchi' AND p.`english_first_name` = 'kimika'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 宮川 友結 / 東海興業 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '友結', '宮川', 'ユイ', 'ミヤカワ',
       'yui', 'miyakawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/07.jpg', '東京都', 1068768000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '宮川' AND `first_name` = '友結')
     OR (`english_last_name` = 'miyakawa' AND `english_first_name` = 'yui')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '東海興業', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '宮川' AND p.`first_name` = '友結')
   OR (p.`english_last_name` = 'miyakawa' AND p.`english_first_name` = 'yui'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '東海興業'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 三宅 将平 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/17.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '将平', '三宅', 'ショウヘイ', 'ミヤケ',
       'shouhei', 'miyake', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/17.jpg', '滋賀県', 926726400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '三宅' AND `first_name` = '将平')
     OR (`english_last_name` = 'miyake' AND `english_first_name` = 'shouhei')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '三宅' AND p.`first_name` = '将平')
   OR (p.`english_last_name` = 'miyake' AND p.`english_first_name` = 'shouhei'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 宮里 紗羽 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '紗羽', '宮里', 'スズハ', 'ミヤサト',
       'suzuha', 'miyasato', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/05.jpg', '広島県', 1026086400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '宮里' AND `first_name` = '紗羽')
     OR (`english_last_name` = 'miyasato' AND `english_first_name` = 'suzuha')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '宮里' AND p.`first_name` = '紗羽')
   OR (p.`english_last_name` = 'miyasato' AND p.`english_first_name` = 'suzuha'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 宮﨑 淳美 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/20.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '淳美', '宮﨑', 'アツミ', 'ミヤザキ',
       'atsumi', 'miyazaki', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/20.jpg', '愛知県', 990316800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '宮﨑' AND `first_name` = '淳美')
     OR (`english_last_name` = 'miyazaki' AND `english_first_name` = 'atsumi')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '宮﨑' AND p.`first_name` = '淳美')
   OR (p.`english_last_name` = 'miyazaki' AND p.`english_first_name` = 'atsumi'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 宮崎 友花 / ACT SAIKYO (https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '友花', '宮崎', 'トモカ', 'ミヤザキ',
       'tomoka', 'miyazaki', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/act-saikyo/11.jpg', '大阪府', 1155772800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '宮崎' AND `first_name` = '友花')
     OR (`english_last_name` = 'miyazaki' AND `english_first_name` = 'tomoka')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ACT SAIKYO', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '宮崎' AND p.`first_name` = '友花')
   OR (p.`english_last_name` = 'miyazaki' AND p.`english_first_name` = 'tomoka'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ACT SAIKYO'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 宮下 彩奈 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '彩奈', '宮下', 'アヤナ', 'ミヤシタ',
       'ayana', 'miyashita', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/10.jpg', '茨城県', 1033603200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '宮下' AND `first_name` = '彩奈')
     OR (`english_last_name` = 'miyashita' AND `english_first_name` = 'ayana')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '宮下' AND p.`first_name` = '彩奈')
   OR (p.`english_last_name` = 'miyashita' AND p.`english_first_name` = 'ayana'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 宮下 怜 / 日立情報通信エンジニアリング (https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/12.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '怜', '宮下', 'レイ', 'ミヤシタ',
       'rei', 'miyashita', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/hitachi-information/12.jpg', '千葉県', 1073001600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '宮下' AND `first_name` = '怜')
     OR (`english_last_name` = 'miyashita' AND `english_first_name` = 'rei')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '日立情報通信エンジニアリング', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '宮下' AND p.`first_name` = '怜')
   OR (p.`english_last_name` = 'miyashita' AND p.`english_first_name` = 'rei'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '日立情報通信エンジニアリング'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 三輪 音巴 / 山陰合同銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '音巴', '三輪', 'オトハ', 'ミワ',
       'otoha', 'miwa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/sanin-godo-bank/07.jpg', '岐阜県', 1015545600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '三輪' AND `first_name` = '音巴')
     OR (`english_last_name` = 'miwa' AND `english_first_name` = 'otoha')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '山陰合同銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '三輪' AND p.`first_name` = '音巴')
   OR (p.`english_last_name` = 'miwa' AND p.`english_first_name` = 'otoha'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '山陰合同銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 向井 仁那 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '仁那', '向井', 'ニナ', 'ムカイ',
       'nina', 'mukai', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/05.jpg', '富山県', 948326400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '向井' AND `first_name` = '仁那')
     OR (`english_last_name` = 'mukai' AND `english_first_name` = 'nina')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '向井' AND p.`first_name` = '仁那')
   OR (p.`english_last_name` = 'mukai' AND p.`english_first_name` = 'nina'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 宗像 美月 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '美月', '宗像', 'ミヅキ', 'ムナカタ',
       'mizuki', 'munakata', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/07.jpg', '福島県', 750038400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '宗像' AND `first_name` = '美月')
     OR (`english_last_name` = 'munakata' AND `english_first_name` = 'mizuki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '宗像' AND p.`first_name` = '美月')
   OR (p.`english_last_name` = 'munakata' AND p.`english_first_name` = 'mizuki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 村瀬 康之介 / 豊田通商 (https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/4.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '康之介', '村瀬', 'コウノスケ', 'ムラセ',
       'kounosuke', 'murase', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/toyota-tsusho/04.jpg', '愛知県', 928368000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '村瀬' AND `first_name` = '康之介')
     OR (`english_last_name` = 'murase' AND `english_first_name` = 'kounosuke')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '豊田通商', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '村瀬' AND p.`first_name` = '康之介')
   OR (p.`english_last_name` = 'murase' AND p.`english_first_name` = 'kounosuke'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '豊田通商'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 村本 竜馬 / ジェイテクトStingers (https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '竜馬', '村本', 'リョウマ', 'ムラモト',
       'ryouma', 'muramoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/jtekt/07.jpg', '長崎県', 940896000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '村本' AND `first_name` = '竜馬')
     OR (`english_last_name` = 'muramoto' AND `english_first_name` = 'ryouma')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ジェイテクトStingers', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '村本' AND p.`first_name` = '竜馬')
   OR (p.`english_last_name` = 'muramoto' AND p.`english_first_name` = 'ryouma'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ジェイテクトStingers'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 室屋 奏乃 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '奏乃', '室屋', 'カナノ', 'ムロヤ',
       'kanano', 'muroya', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/05.jpg', '大分県', 1093737600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '室屋' AND `first_name` = '奏乃')
     OR (`english_last_name` = 'muroya' AND `english_first_name` = 'kanano')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '室屋' AND p.`first_name` = '奏乃')
   OR (p.`english_last_name` = 'muroya' AND p.`english_first_name` = 'kanano'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 目崎 駿太郎 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/17.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '駿太郎', '目崎', 'シュンタロウ', 'メザキ',
       'shuntarou', 'mezaki', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/17.jpg', '新潟県', 1025136000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '目崎' AND `first_name` = '駿太郎')
     OR (`english_last_name` = 'mezaki' AND `english_first_name` = 'shuntarou')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '目崎' AND p.`first_name` = '駿太郎')
   OR (p.`english_last_name` = 'mezaki' AND p.`english_first_name` = 'shuntarou'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 毛利 未佳 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '未佳', '毛利', 'ミカ', 'モウリ',
       'mika', 'mouri', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/08.jpg', '佐賀県', 841536000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '毛利' AND `first_name` = '未佳')
     OR (`english_last_name` = 'mouri' AND `english_first_name` = 'mika')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '毛利' AND p.`first_name` = '未佳')
   OR (p.`english_last_name` = 'mouri' AND p.`english_first_name` = 'mika'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 桃田 賢斗 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '賢斗', '桃田', 'ケント', 'モモタ',
       'kento', 'momota', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/07.jpg', '香川県', 778377600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '桃田' AND `first_name` = '賢斗')
     OR (`english_last_name` = 'momota' AND `english_first_name` = 'kento')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '桃田' AND p.`first_name` = '賢斗')
   OR (p.`english_last_name` = 'momota' AND p.`english_first_name` = 'kento'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 森口 航士朗 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '航士朗', '森口', 'コウシロウ', 'モリグチ',
       'koushirou', 'moriguchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/08.jpg', '熊本県', 1058745600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '森口' AND `first_name` = '航士朗')
     OR (`english_last_name` = 'moriguchi' AND `english_first_name` = 'koushirou')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '森口' AND p.`first_name` = '航士朗')
   OR (p.`english_last_name` = 'moriguchi' AND p.`english_first_name` = 'koushirou'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 八色 舞 / レゾナック (https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '舞', '八色', 'マイ', 'ヤイロ',
       'mai', 'yairo', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/resonac/08.jpg', '福岡県', 1044230400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '八色' AND `first_name` = '舞')
     OR (`english_last_name` = 'yairo' AND `english_first_name` = 'mai')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'レゾナック', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '八色' AND p.`first_name` = '舞')
   OR (p.`english_last_name` = 'yairo' AND p.`english_first_name` = 'mai'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'レゾナック'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 家壽多 慶太 / 大同特殊鋼 (https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '慶太', '家壽多', 'ケイタ', 'ヤスダ',
       'keita', 'yasuda', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/daido-tokusyuko/07.jpg', '兵庫県', 933552000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '家壽多' AND `first_name` = '慶太')
     OR (`english_last_name` = 'yasuda' AND `english_first_name` = 'keita')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '大同特殊鋼', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '家壽多' AND p.`first_name` = '慶太')
   OR (p.`english_last_name` = 'yasuda' AND p.`english_first_name` = 'keita'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '大同特殊鋼'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 八角 実侑 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '実侑', '八角', 'ミユ', 'ヤスミ',
       'miyu', 'yasumi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/01.jpg', '埼玉県', 997574400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '八角' AND `first_name` = '実侑')
     OR (`english_last_name` = 'yasumi' AND `english_first_name` = 'miyu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '八角' AND p.`first_name` = '実侑')
   OR (p.`english_last_name` = 'yasumi' AND p.`english_first_name` = 'miyu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 谷津 央祐 / 東海興業 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/1.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '央祐', '谷津', 'オウスケ', 'ヤツ',
       'ousuke', 'yatsu', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tokai-kogyo/01.jpg', '東京都', 1040601600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '谷津' AND `first_name` = '央祐')
     OR (`english_last_name` = 'yatsu' AND `english_first_name` = 'ousuke')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '東海興業', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '谷津' AND p.`first_name` = '央祐')
   OR (p.`english_last_name` = 'yatsu' AND p.`english_first_name` = 'ousuke'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '東海興業'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 栁川 蓮 / 三菱自動車京都 (https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/15.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '蓮', '栁川', 'レン', 'ヤナガワ',
       'ren', 'yanagawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/mitsubishi-motors/15.jpg', '東京都', 1063584000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '栁川' AND `first_name` = '蓮')
     OR (`english_last_name` = 'yanagawa' AND `english_first_name` = 'ren')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '三菱自動車京都', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '栁川' AND p.`first_name` = '蓮')
   OR (p.`english_last_name` = 'yanagawa' AND p.`english_first_name` = 'ren'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '三菱自動車京都'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 山浦 波瑠 / 七十七銀行 (https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/2.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '波瑠', '山浦', 'ナル', 'ヤマウラ',
       'naru', 'yamaura', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/77bank/02.jpg', '宮城県', 1021161600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '山浦' AND `first_name` = '波瑠')
     OR (`english_last_name` = 'yamaura' AND `english_first_name` = 'naru')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '七十七銀行', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '山浦' AND p.`first_name` = '波瑠')
   OR (p.`english_last_name` = 'yamaura' AND p.`english_first_name` = 'naru'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '七十七銀行'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 山川 唯奈 / ヨネックス (https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '唯奈', '山川', 'ユイナ', 'ヤマカワ',
       'yuina', 'yamakawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/yonex/10.jpg', '香川県', 1193529600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '山川' AND `first_name` = '唯奈')
     OR (`english_last_name` = 'yamakawa' AND `english_first_name` = 'yuina')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'ヨネックス', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '山川' AND p.`first_name` = '唯奈')
   OR (p.`english_last_name` = 'yamakawa' AND p.`english_first_name` = 'yuina'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'ヨネックス'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 山北 奈緒 / NTT 東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '奈緒', '山北', 'ナオ', 'ヤマキタ',
       'nao', 'yamakita', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/07.jpg', '埼玉県', 1130630400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '山北' AND `first_name` = '奈緒')
     OR (`english_last_name` = 'yamakita' AND `english_first_name` = 'nao')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT 東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '山北' AND p.`first_name` = '奈緒')
   OR (p.`english_last_name` = 'yamakita' AND p.`english_first_name` = 'nao'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT 東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 山北 眞緒 / NTT 東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/5.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '眞緒', '山北', 'マオ', 'ヤマキタ',
       'mao', 'yamakita', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/ntt-east/05.jpg', '埼玉県', 1170979200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '山北' AND `first_name` = '眞緒')
     OR (`english_last_name` = 'yamakita' AND `english_first_name` = 'mao')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT 東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '山北' AND p.`first_name` = '眞緒')
   OR (p.`english_last_name` = 'yamakita' AND p.`english_first_name` = 'mao'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT 東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 山口 茜 / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/6.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '茜', '山口', 'アカネ', 'ヤマグチ',
       'akane', 'yamaguchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/06.jpg', '福井県', 865555200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '山口' AND `first_name` = '茜')
     OR (`english_last_name` = 'yamaguchi' AND `english_first_name` = 'akane')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '山口' AND p.`first_name` = '茜')
   OR (p.`english_last_name` = 'yamaguchi' AND p.`english_first_name` = 'akane'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 山澤 直貴 / コンサドーレ (https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/3.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '直貴', '山澤', 'ナオキ', 'ヤマザワ',
       'naoki', 'yamazawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/03.jpg', '大阪府', 906595200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '山澤' AND `first_name` = '直貴')
     OR (`english_last_name` = 'yamazawa' AND `english_first_name` = 'naoki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'コンサドーレ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '山澤' AND p.`first_name` = '直貴')
   OR (p.`english_last_name` = 'yamazawa' AND p.`english_first_name` = 'naoki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'コンサドーレ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 山下 恭平 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '恭平', '山下', 'キョウヘイ', 'ヤマシタ',
       'kyouhei', 'yamashita', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/10.jpg', '岡山県', 908150400
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '山下' AND `first_name` = '恭平')
     OR (`english_last_name` = 'yamashita' AND `english_first_name` = 'kyouhei')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '山下' AND p.`first_name` = '恭平')
   OR (p.`english_last_name` = 'yamashita' AND p.`english_first_name` = 'kyouhei'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 山田 尚輝 / NTT東日本 (https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '尚輝', '山田', 'ナオキ', 'ヤマダ',
       'naoki', 'yamada', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/ntt-east/11.jpg', '東京都', 952732800
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '山田' AND `first_name` = '尚輝')
     OR (`english_last_name` = 'yamada' AND `english_first_name` = 'naoki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'NTT東日本', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '山田' AND p.`first_name` = '尚輝')
   OR (p.`english_last_name` = 'yamada' AND p.`english_first_name` = 'naoki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'NTT東日本'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 横内 美海 / Cheerful鳥取 (https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/11.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '美海', '横内', 'ミウ', 'ヨコウチ',
       'miu', 'yokouchi', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/cheerful/11.jpg', '山梨県', 1040083200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '横内' AND `first_name` = '美海')
     OR (`english_last_name` = 'yokouchi' AND `english_first_name` = 'miu')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'Cheerful鳥取', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '横内' AND p.`first_name` = '美海')
   OR (p.`english_last_name` = 'yokouchi' AND p.`english_first_name` = 'miu'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'Cheerful鳥取'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 吉川 天乃 / 岐阜Bluvic (https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '天乃', '吉川', 'ソラノ', 'ヨシカワ',
       'sorano', 'yoshikawa', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/gifu-bluvic/00.jpg', '岡山県', 1083283200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '吉川' AND `first_name` = '天乃')
     OR (`english_last_name` = 'yoshikawa' AND `english_first_name` = 'sorano')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '岐阜Bluvic', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '吉川' AND p.`first_name` = '天乃')
   OR (p.`english_last_name` = 'yoshikawa' AND p.`english_first_name` = 'sorano'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '岐阜Bluvic'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 吉田 翼 / トナミ運輸 (https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/0.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '翼', '吉田', 'ツバサ', 'ヨシダ',
       'tsubasa', 'yoshida', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/tonami/00.jpg', '北海道', 1064275200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '吉田' AND `first_name` = '翼')
     OR (`english_last_name` = 'yoshida' AND `english_first_name` = 'tsubasa')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'トナミ運輸', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '吉田' AND p.`first_name` = '翼')
   OR (p.`english_last_name` = 'yoshida' AND p.`english_first_name` = 'tsubasa'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'トナミ運輸'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 米本 宙那 / 再春館製薬所 (https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/8.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '宙那', '米本', 'ソナ', 'ヨネモト',
       'sona', 'yonemoto', 'https://www.sj-league.jp/team_playerinfo/team/2025/women/saishun-pharmaceutial/08.jpg', '徳島県', 1184025600
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '米本' AND `first_name` = '宙那')
     OR (`english_last_name` = 'yonemoto' AND `english_first_name` = 'sona')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, '再春館製薬所', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '米本' AND p.`first_name` = '宙那')
   OR (p.`english_last_name` = 'yonemoto' AND p.`english_first_name` = 'sona'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = '再春館製薬所'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 渡邉 航貴 / BIPROGY (https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/7.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '航貴', '渡邉', 'コウキ', 'ワタナベ',
       'kouki', 'watanabe', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/biprogy/07.jpg', '埼玉県', 917568000
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '渡邉' AND `first_name` = '航貴')
     OR (`english_last_name` = 'watanabe' AND `english_first_name` = 'kouki')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'BIPROGY', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '渡邉' AND p.`first_name` = '航貴')
   OR (p.`english_last_name` = 'watanabe' AND p.`english_first_name` = 'kouki'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'BIPROGY'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );

-- 渡邊 拓斗 / コンサドーレ (https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/10.html)
INSERT INTO `players` (
  `first_name`, `last_name`, `first_furigana`, `last_furigana`,
  `english_first_name`, `english_last_name`, `image_url`, `birth_place`, `birth_date`
)
SELECT '拓斗', '渡邊', 'タクト', 'ワタナベ',
       'takuto', 'watanabe', 'https://www.sj-league.jp/team_playerinfo/team/2025/men/consadole/10.jpg', '北海道', 1037059200
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE (`last_name` = '渡邊' AND `first_name` = '拓斗')
     OR (`english_last_name` = 'watanabe' AND `english_first_name` = 'takuto')
);
INSERT INTO `careers` (`player_id`, `name`, `category`, `start_year`, `end_year`)
SELECT p.`id`, 'コンサドーレ', 'SJリーグ所属', 2025, 2026
FROM `players` p
WHERE ((p.`last_name` = '渡邊' AND p.`first_name` = '拓斗')
   OR (p.`english_last_name` = 'watanabe' AND p.`english_first_name` = 'takuto'))
  AND NOT EXISTS (
    SELECT 1 FROM `careers` c
    WHERE c.`player_id` = p.`id`
      AND c.`name` = 'コンサドーレ'
      AND COALESCE(c.`category`, '') = 'SJリーグ所属'
      AND COALESCE(c.`start_year`, 0) = 2025
      AND COALESCE(c.`end_year`, 0) = 2026
  );
