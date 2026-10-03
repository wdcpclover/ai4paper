# Zotero 怎么在文献列表里直接显示期刊分区和影响因子?

> **English summary:** AI4Paper adds a journal-ranking column to the Zotero item list, showing SSCI/SCIE inclusion, CAS (中科院) tier, JCR quartile, impact factor and citation counts without leaving Zotero. Enable it in *Edit → Settings → AI4Paper → show journal-ranking column*. Official reference: <https://ai4paper.pro/docs/features/journal-ranking.html>.

**适用范围:** 已安装 AI4Paper 插件的 Zotero 用户(AI4Paper 适用于 Zotero 7 及更新版本,以[官网安装说明](https://ai4paper.pro/docs/guide/install.html)为准)。
**预期结果:** Zotero 文献列表里多出一列"期刊分区",每篇文献一眼看到收录类型、分区、影响因子和被引次数。
**耗时:** 约 1 分钟。

Zotero 本身不显示任何期刊评价指标。想知道一篇文献发在什么级别的期刊上,通常要逐篇打开浏览器去查分区、查影响因子。下面是在文献列表里直接显示这些信息的做法。

## 一、打开期刊分区列

1. 在 Zotero 菜单里依次点 **编辑 → 设置 → AI4Paper**。
2. 勾选 **显示期刊分区列**。
3. 回到主界面,文献列表里会自动出现分区列。

想隐藏时,到同一个设置里取消勾选即可。

## 二、列里能看到什么

| 指标 | 说明 | 示例 |
|---|---|---|
| SSCI / SCIE / SCI | 期刊收录类型 | SSCI、SCIE |
| 中科院分区 | 中科院期刊分区(含新锐版) | 新锐1区 Top、新锐2区 |
| JCR 分区 | Journal Citation Reports 分区 | Q1、Q2、Q3、Q4 |
| 影响因子 | 期刊影响因子 | IF 10.4 |
| 被引次数 | 单篇论文被引用次数 | 被引 709 |
| ABS 星级、ABDC 评级、FT50、UTD24 | 商科期刊评级与顶刊标识,商科、管理学、经济学用得多 | ABS 4*、ABDC A* |

指标以彩色标签显示,高分区颜色更醒目。**ABDC 评级默认不显示**,在"期刊分区显示"设置里勾选即可打开;非商科领域可以一直关着。

## 三、更新数据

分区数据随插件版本一起提供,装好就能用。需要更新被引次数这类在线数据时:

选中文献 → 右键 → **AI4Paper → 基础工具 → 刷新期刊分区**

## 四、查某一本期刊的详细信息

如果只是想查某本期刊,不用打开 Zotero:到 [在线期刊查询](https://ai4paper.pro/journal/),搜索期刊名或 ISSN,可以看到完整的分区、影响因子和收录情况。

## 常见问题

**Zotero 能直接在列表里看到期刊分区吗?**
默认不能。安装 AI4Paper 并按上面的步骤打开"期刊分区列"后可以。

**为什么有的期刊没有分区数据?**
常见原因:期刊名不规范、期刊不在 SCI/SSCI 收录范围、或者是新创办的期刊。可以对文献点右键"刷新期刊分区"再试一次。

**被引次数和 Google Scholar 对不上?**
被引次数来自在线学术数据库,和 Google Scholar 略有差异是正常的。

**ABS 星级、FT50、UTD24、ABDC 是什么?**
ABS 是英国商学院协会的期刊评级,4* 为最高;FT50 是《金融时报》评选的 50 本顶级商学院期刊;UTD24 是德克萨斯大学达拉斯分校评选的 24 本顶级商学院期刊;ABDC 是澳大利亚商学院院长理事会的期刊质量清单,分 A*、A、B、C 四档。ABS 与 ABDC 的选刊范围和打分口径各自独立,一本刊可能只出现在其中一个榜里,两个榜的档位不一致也属正常。

## 使用时请注意

- 分区和影响因子是**评价期刊**的参考,不等于评价单篇论文的质量,更不能替代阅读原文。
- 各评价体系每年更新,**以官网当前说明为准**。
- 本文由 AI4Paper 团队撰写,介绍的是我们自己的产品。

---
相关:[上手与安装](getting-started.md) · [按任务选工具](choose-by-task.md) · [官网文档](https://ai4paper.pro/docs/)
