-- Sources:
-- https://www.badminton.or.jp/national/player?gender=female&category[]=u24
-- https://www.badminton.or.jp/national/player?gender=male&category[]=u24
-- https://www.badminton.or.jp/national/player?gender=female&category[]=national
-- Retrieved on 2026-03-30
-- Note: first_furigana / last_furigana are not available in the source pages, so empty strings are stored.

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '美心', '相磯', '', '', 'mikoto', 'aiso', '大阪府', strftime('%s', '2007-01-10')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '美心' AND `last_name` = '相磯'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '陽菜', '明地', '', '', 'hina', 'akechi', '大阪府', strftime('%s', '2005-03-14')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '陽菜' AND `last_name` = '明地'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '心菜', '石川', '', '', 'kokona', 'ishikawa', '東京都', strftime('%s', '2004-10-11')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '心菜' AND `last_name` = '石川'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '璃子', '清瀬', '', '', 'riko', 'kiyose', '神奈川県', strftime('%s', '2005-07-16')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '璃子' AND `last_name` = '清瀬'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '桃芭', '新見', '', '', 'momoha', 'niimi', '山口県', strftime('%s', '2005-03-21')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '桃芭' AND `last_name` = '新見'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '菜那子', '原', '', '', 'nanako', 'hara', '群馬県', strftime('%s', '2006-03-31')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '菜那子' AND `last_name` = '原'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '梨々菜', '平本', '', '', 'ririna', 'hiramoto', '岐阜県', strftime('%s', '2006-05-19')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '梨々菜' AND `last_name` = '平本'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '柚乃', '渡邉', '', '', 'yuzuno', 'watanabe', '岡山県', strftime('%s', '2010-01-09')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '柚乃' AND `last_name` = '渡邉'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '優大', '沖本', '', '', 'yudai', 'okimoto', '広島県', strftime('%s', '2005-05-28')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '優大' AND `last_name` = '沖本'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '悠陽', '川邊', '', '', 'haruki', 'kawabe', '大分県', strftime('%s', '2005-03-10')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '悠陽' AND `last_name` = '川邊'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '日向', '髙野', '', '', 'hyuga', 'takano', '熊本県', strftime('%s', '2007-08-09')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '日向' AND `last_name` = '髙野'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '凜生', '武井', '', '', 'riki', 'takei', '東京都', strftime('%s', '2003-07-21')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '凜生' AND `last_name` = '武井'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '健大', '松川', '', '', 'kenta', 'matsukawa', '神奈川県', strftime('%s', '2006-06-19')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '健大' AND `last_name` = '松川'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '怜', '宮下', '', '', 'rei', 'miyashita', '千葉県', strftime('%s', '2004-01-02')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '怜' AND `last_name` = '宮下'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '有紗', '五十嵐', '', '', 'arisa', 'igarashi', '北海道', strftime('%s', '1996-08-01')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '有紗' AND `last_name` = '五十嵐'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '鈴', '岩永', '', '', 'rin', 'iwanaga', '山口県', strftime('%s', '1999-05-21')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '鈴' AND `last_name` = '岩永'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '莉子', '郡司', '', '', 'riko', 'gunji', '神奈川県', strftime('%s', '2002-07-31')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '莉子' AND `last_name` = '郡司'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '夏', '齋藤', '', '', 'natsu', 'saitou', '埼玉県', strftime('%s', '2000-06-09')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '夏' AND `last_name` = '齋藤'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '千陽', '志田', '', '', 'chiharu', 'shida', '秋田県', strftime('%s', '1997-04-29')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '千陽' AND `last_name` = '志田'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '愛美', '水津', '', '', 'manami', 'suizu', '山口県', strftime('%s', '2003-10-08')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '愛美' AND `last_name` = '水津'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '貴映', '中西', '', '', 'kie', 'nakanishi', '神奈川県', strftime('%s', '1995-12-24')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '貴映' AND `last_name` = '中西'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '瑠依', '廣上', '', '', 'rui', 'hirokami', '富山県', strftime('%s', '2002-07-26')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '瑠依' AND `last_name` = '廣上'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '由紀', '福島', '', '', 'yuki', 'fukushima', '熊本県', strftime('%s', '1993-05-06')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '由紀' AND `last_name` = '福島'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '彩夏', '保原', '', '', 'sayaka', 'hobara', '宮城県', strftime('%s', '1998-07-30')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '彩夏' AND `last_name` = '保原'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '麻佑', '松本', '', '', 'mayu', 'matsumoto', '北海道', strftime('%s', '1995-08-07')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '麻佑' AND `last_name` = '松本'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '奈未', '松山', '', '', 'nami', 'matsuyama', '福岡県', strftime('%s', '1998-06-28')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '奈未' AND `last_name` = '松山'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '友花', '宮崎', '', '', 'tomoka', 'miyazaki', '大阪府', strftime('%s', '2006-08-17')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '友花' AND `last_name` = '宮崎'
);

INSERT INTO `players` (`first_name`, `last_name`, `first_furigana`, `last_furigana`, `english_first_name`, `english_last_name`, `birth_place`, `birth_date`)
SELECT '茜', '山口', '', '', 'akane', 'yamaguchi', '福井県', strftime('%s', '1997-06-06')
WHERE NOT EXISTS (
  SELECT 1 FROM `players`
  WHERE `first_name` = '茜' AND `last_name` = '山口'
);
