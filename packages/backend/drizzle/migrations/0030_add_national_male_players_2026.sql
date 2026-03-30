-- Source: https://www.badminton.or.jp/national/player?gender=male&category[]=national (2026 men national team)
-- Note: first_furigana / last_furigana are not available in the source pages, so empty strings are stored.

INSERT INTO
  `players` (
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
  '翔',
  '熊谷',
  '',
  '',
  'kakeru',
  'kumagai',
  '宮城県',
  strftime('%s', '2002-01-05')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '翔'
      AND `last_name` = '熊谷'
  );

INSERT INTO
  `players` (
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
  '輝',
  '古賀',
  '',
  '',
  'akira',
  'koga',
  '福岡県',
  strftime('%s', '1994-03-08')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '輝'
      AND `last_name` = '古賀'
  );

INSERT INTO
  `players` (
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
  '優吾',
  '小林',
  '',
  '',
  'yugo',
  'kobayashi',
  '宮城県',
  strftime('%s', '1995-07-10')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '優吾'
      AND `last_name` = '小林'
  );

INSERT INTO
  `players` (
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
  '雄一',
  '霜上',
  '',
  '',
  'yuichi',
  'shimogami',
  '熊本県',
  strftime('%s', '1998-03-05')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '雄一'
      AND `last_name` = '霜上'
  );

INSERT INTO
  `players` (
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
  '湧士',
  '田中',
  '',
  '',
  'yushi',
  'tanaka',
  '熊本県',
  strftime('%s', '1999-10-05')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '湧士'
      AND `last_name` = '田中'
  );

INSERT INTO
  `players` (
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
  '功大',
  '奈良岡',
  '',
  '',
  'kodai',
  'naraoka',
  '青森県',
  strftime('%s', '2001-06-30')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '功大'
      AND `last_name` = '奈良岡'
  );

INSERT INTO
  `players` (
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
  '大輝',
  '西',
  '',
  '',
  'hiroki',
  'nishi',
  '京都府',
  strftime('%s', '2003-03-21')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '大輝'
      AND `last_name` = '西'
  );

INSERT INTO
  `players` (
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
  '拳太',
  '西本',
  '',
  '',
  'kenta',
  'nishimoto',
  '三重県',
  strftime('%s', '1994-08-30')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '拳太'
      AND `last_name` = '西本'
  );

INSERT INTO
  `players` (
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
  '拓海',
  '野村',
  '',
  '',
  'takumi',
  'nomura',
  '宮城県',
  strftime('%s', '1997-08-07')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '拓海'
      AND `last_name` = '野村'
  );

INSERT INTO
  `players` (
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
  '卓朗',
  '保木',
  '',
  '',
  'takuro',
  'hoki',
  '山口県',
  strftime('%s', '1995-08-14')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '卓朗'
      AND `last_name` = '保木'
  );

INSERT INTO
  `players` (
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
  '大輝',
  '緑川',
  '',
  '',
  'hiroki',
  'midorikawa',
  '埼玉県',
  strftime('%s', '2000-05-17')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '大輝'
      AND `last_name` = '緑川'
  );

INSERT INTO
  `players` (
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
  '航貴',
  '渡邉',
  '',
  '',
  'koki',
  'watanabe',
  '埼玉県',
  strftime('%s', '1999-01-29')
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `players`
    WHERE
      `first_name` = '航貴'
      AND `last_name` = '渡邉'
  );
