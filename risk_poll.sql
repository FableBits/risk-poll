-- We downloaded the raw data from the Lloyd Register Foundation download page
-- and imported the parquet files into our SQL database for further analysis.

-- We named the tables risq_19, risq_21, risq_23 and risq_25, according to the year of the data.

-- We are creating a backup of the 4 tables before making any alterations

CREATE TABLE risq_25_bkp AS
SELECT * FROM risq_25;

-- We get rid of the region columns, since we will only use country and global region

SET @sql = (
    SELECT CONCAT(
        'ALTER TABLE risq_25 ',
        GROUP_CONCAT(CONCAT('DROP COLUMN `', COLUMN_NAME, '`') SEPARATOR ', ')
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'my_database_2'
      AND TABLE_NAME = 'risq_25'
      AND COLUMN_NAME LIKE 'REGIO%'
);

SET SESSION group_concat_max_len = 1000000;

SELECT @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- We used several versions of the query below to make sure we use the right column 
-- for calculating weighted percentages, by comparing the query results 
-- with the numbers in the charts in the data source website.

WITH filtered AS (
    SELECT
        WP20719 AS answer,
        PROJWT AS weight
    FROM risq_21 
    WHERE country = 'Brazil'
      AND AgeGroups4 = 4 
      AND WP20719 IS NOT NULL
      AND PROJWT IS NOT NULL
),
base AS (
    SELECT SUM(weight) AS base_n
    FROM filtered
)
SELECT
    f.answer,
    COUNT(*) AS raw_count,
    SUM(f.weight) AS n,
    b.base_n,
    SUM(f.weight) * 100.0 / b.base_n AS pct
FROM filtered f
CROSS JOIN base b
GROUP BY f.answer, b.base_n
ORDER BY f.answer;

-- We will use the projwt column as the weight for calculating weighted percentages 
-- in the python scripts that populate the tables we will create below

-- We create our tables for country and global region level. 
-- The country table has one dimension, and the global region has two, 
-- so we will not have results with very low samples and low statistical value

CREATE TABLE risk_cube_country (
  year INT,
  country VARCHAR(100),
  dimension VARCHAR(50),
  dimension_value VARCHAR(100),
  metric VARCHAR(100),
  value_label VARCHAR(100),
  pct DECIMAL(5,2),
  n INT,
  base_n INT,
  raw_count INT,
  group_raw_count INT,
  low_sample INT
);

CREATE TABLE risk_cube_glr (
  year INT,
  globalregion VARCHAR(100),
  dimension_1 VARCHAR(50),
  dimension_1_value VARCHAR(100),
  dimension_2 VARCHAR(50),
  dimension_2_value VARCHAR(100),
  metric VARCHAR(100),
  value_label VARCHAR(100),
  pct DECIMAL(5,2),
  n INT,
  base_n INT,
  raw_count INT,
  group_raw_count INT,
  low_sample INT
);

-- We will populate the tables with the python scripts risk_cube_country and risk_cube_glr