-- Minimal journal ranking view for plugin lookup.
-- Goal: one row per journal per year, keeping only index coverage and partition fields.

DROP VIEW IF EXISTS v_journal_ranking_slim;

CREATE VIEW v_journal_ranking_slim AS
WITH normalized_rankings AS (
  SELECT
    r.journal_id,
    r.year,
    CASE
      WHEN r.index_type IS NULL OR trim(r.index_type) = '' THEN 'UNKNOWN'
      ELSE trim(r.index_type)
    END AS index_type,
    r.jcr_quartile,
    r.cas_zone,
    r.cas_top,
    r.impact_factor
  FROM journal_rankings r
),
aggregated AS (
  SELECT
    nr.journal_id,
    nr.year,
    GROUP_CONCAT(DISTINCT nr.index_type) AS indexed_by,
    MIN(CASE nr.jcr_quartile
      WHEN 'Q1' THEN 1
      WHEN 'Q2' THEN 2
      WHEN 'Q3' THEN 3
      WHEN 'Q4' THEN 4
      ELSE NULL
    END) AS best_jcr_quartile_num,
    MIN(nr.cas_zone) AS best_cas_zone,
    MAX(COALESCE(nr.cas_top, 0)) AS is_cas_top,
    MAX(nr.impact_factor) AS impact_factor
  FROM normalized_rankings nr
  GROUP BY nr.journal_id, nr.year
)
SELECT
  j.id AS journal_id,
  j.name AS journal_name,
  lower(trim(j.name)) AS normalized_name,
  j.issn,
  j.eissn,
  a.year,
  a.indexed_by,
  CASE a.best_jcr_quartile_num
    WHEN 1 THEN 'Q1'
    WHEN 2 THEN 'Q2'
    WHEN 3 THEN 'Q3'
    WHEN 4 THEN 'Q4'
    ELSE NULL
  END AS jcr_quartile,
  a.best_cas_zone AS cas_zone,
  a.is_cas_top AS cas_top,
  a.impact_factor
FROM aggregated a
JOIN journals j ON j.id = a.journal_id;

-- Suggested export query for plugin data:
-- SELECT
--   journal_name,
--   normalized_name,
--   COALESCE(issn, '') AS issn,
--   COALESCE(eissn, '') AS eissn,
--   indexed_by,
--   COALESCE(jcr_quartile, '') AS jcr_quartile,
--   COALESCE(cas_zone, '') AS cas_zone,
--   cas_top,
--   COALESCE(impact_factor, '') AS impact_factor,
--   year
-- FROM v_journal_ranking_slim
-- WHERE year = 2025
-- ORDER BY journal_name;
