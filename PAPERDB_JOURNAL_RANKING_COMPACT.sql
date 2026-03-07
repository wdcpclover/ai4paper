DROP TABLE IF EXISTS journal_ranking_compact;

CREATE TABLE journal_ranking_compact (
  journal_key TEXT PRIMARY KEY,
  journal_name TEXT NOT NULL,
  issn TEXT DEFAULT '',
  eissn TEXT DEFAULT '',
  indexed_science INTEGER DEFAULT 0,
  indexed_ssci INTEGER DEFAULT 0,
  jcr_quartile TEXT DEFAULT '',
  cas_zone INTEGER,
  cas_top INTEGER DEFAULT 0,
  impact_factor REAL,
  year INTEGER NOT NULL
);

INSERT INTO journal_ranking_compact (
  journal_key,
  journal_name,
  issn,
  eissn,
  indexed_science,
  indexed_ssci,
  jcr_quartile,
  cas_zone,
  cas_top,
  impact_factor,
  year
)
WITH ranked AS (
  SELECT
    lower(trim(j.name)) AS journal_key,
    j.name AS journal_name,
    COALESCE(j.issn, '') AS issn,
    COALESCE(j.eissn, '') AS eissn,
    CASE WHEN r.index_type = 'SCIE' THEN 1 ELSE 0 END AS indexed_science,
    CASE WHEN r.index_type = 'SSCI' THEN 1 ELSE 0 END AS indexed_ssci,
    CASE r.jcr_quartile
      WHEN 'Q1' THEN 1
      WHEN 'Q2' THEN 2
      WHEN 'Q3' THEN 3
      WHEN 'Q4' THEN 4
      ELSE NULL
    END AS jcr_quartile_num,
    r.cas_zone,
    COALESCE(r.cas_top, 0) AS cas_top,
    r.impact_factor,
    r.year
  FROM journal_rankings r
  JOIN journals j ON j.id = r.journal_id
  WHERE j.name IS NOT NULL
    AND trim(j.name) != ''
)
SELECT
  journal_key,
  MIN(journal_name) AS journal_name,
  MAX(issn) AS issn,
  MAX(eissn) AS eissn,
  MAX(indexed_science) AS indexed_science,
  MAX(indexed_ssci) AS indexed_ssci,
  CASE MIN(jcr_quartile_num)
    WHEN 1 THEN 'Q1'
    WHEN 2 THEN 'Q2'
    WHEN 3 THEN 'Q3'
    WHEN 4 THEN 'Q4'
    ELSE ''
  END AS jcr_quartile,
  MIN(cas_zone) AS cas_zone,
  MAX(cas_top) AS cas_top,
  MAX(impact_factor) AS impact_factor,
  year
FROM ranked
GROUP BY journal_key, year;

CREATE INDEX idx_journal_ranking_compact_issn
  ON journal_ranking_compact (issn);

CREATE INDEX idx_journal_ranking_compact_eissn
  ON journal_ranking_compact (eissn);

CREATE INDEX idx_journal_ranking_compact_year
  ON journal_ranking_compact (year);
