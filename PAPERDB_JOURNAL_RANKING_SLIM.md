精简数据建议只保留一张“期刊分区查询表”，一行代表某期刊某年份。

推荐字段：

- `journal_name`: 期刊名
- `normalized_name`: 规范化期刊名，供插件匹配
- `issn`
- `eissn`
- `indexed_by`: 被什么索引，值如 `SCIE`、`SSCI`、`SCIE,SSCI`
- `jcr_quartile`: JCR 分区，`Q1-Q4`
- `cas_zone`: 中科院分区，`1-4`
- `cas_top`: 是否 Top，`0/1`
- `impact_factor`: 影响因子
- `year`

这样对插件已经够用了，因为插件真正关心的是：

- 这本刊有没有被 `SCIE/SSCI` 收录
- 它的 `JCR` 是几区
- 它的 `中科院分区` 是几区

对应 SQL 视图在：

[PAPERDB_JOURNAL_RANKING_SLIM.sql](/Users/changpengcheng/zot/ai4paper/PAPERDB_JOURNAL_RANKING_SLIM.sql)

当前库里需要做聚合的原因：

- `journal_rankings` 在 `2025` 年有 `27993` 行
- 但只有 `27286` 本不同期刊
- 其中有 `707` 本期刊同时存在 `SCIE` 和 `SSCI` 两条记录

所以插件侧不应该直接拿原表，而应该先聚成一行。

建议导出 2025 年数据时直接用：

```sql
SELECT
  journal_name,
  normalized_name,
  COALESCE(issn, '') AS issn,
  COALESCE(eissn, '') AS eissn,
  indexed_by,
  COALESCE(jcr_quartile, '') AS jcr_quartile,
  COALESCE(cas_zone, '') AS cas_zone,
  cas_top,
  COALESCE(impact_factor, '') AS impact_factor,
  year
FROM v_journal_ranking_slim
WHERE year = 2025
ORDER BY journal_name;
```

如果后面你要继续增强插件匹配，再补两张表最合适：

- `journal_aliases`
- `journal_identifiers`

但第一阶段只做这张精简表就够了。
