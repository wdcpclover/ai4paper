var methodsBody = function () {};
methodsBody.init = function () {
  // 禁用默认的元素聚焦状态
  Zotero.AI4Paper.blurActiveElement(window);

  // 根据 Zotero 版本调整样式
  Zotero.AI4Paper.updateTextAreaBox4ZoteroScheme(window);

  // 设置 Dialog 字体大小
  Zotero.AI4Paper.setFontSize_Dialog(document.querySelector('dialog'), 0.92);
  methodsBody.updatePrompt(true);
};

// 刷新提示词
methodsBody.updatePrompt = function (isInit) {
  let promptTypes = ["PaperAI", "PaperDeepInterpretation", "PaperBriefAnalysis"];
  // 输入时实时刷新
  if (!isInit) {
    for (let type of promptTypes) {
      Zotero.Prefs.set(`ai4paper.prompt4${type}`, document.getElementById(`prompt-${type}`).value);
    }
  }
  // 初始化时填充
  else {
    for (let type of promptTypes) {
      document.getElementById(`prompt-${type}`).value = Zotero.Prefs.get(`ai4paper.prompt4${type}`);
    }
  }
};

// 重置提示词为默认
methodsBody.resetPrompt = function (type) {
  let promptTypes = ["PaperAI", "PaperDeepInterpretation", "PaperBriefAnalysis"];
  if (type === "PaperAI" || type === "PaperDeepInterpretation") {
    Zotero.Prefs.set(`ai4paper.prompt4${type}`, `你是一名学术领域的著名专家，请根据输入文献的内容，为初学者梳理和简化文献逻辑，并提供易于理解的细化总结。

【Guidelines for Simplification】

- 提炼文章的主题和主旨。
- 分析主要论据、核心方法与结果。
- 梳理结构：从背景/问题切入、方法/模型说明、实验/数据展示、到最终结论逐步转化为易于理解的形式。
- 提供简单明了的解释，避免过于复杂的术语，可以适当提供术语解释。全文逻辑清晰，流线型组织。
- 保留关键信息，但避免过多冗杂细节。

【Steps】

1.文献内容提取：提取关键章节与重点，如：背景简介、问题定义、研究方法、实验与数据分析、结论。 确保涵盖研究目的和意义。
2.逻辑整理：梳理文章逻辑线条。根据背景—>挑战—>方法—>结果—>对未来启发的结构整理内容。
3.语言调整与解释：改写复杂语句，分解难解段落，使用简单易懂的语言。添加关键术语的定义与背景。
4.输出结构化结果：引言部分阐述背景和意义。中间部分梳理方法、细化实验和数据。结尾总结文章核心结论和对领域影响。必须逻辑流畅且统一。

【OutputFormat】

文章总结应约为 20000 字，结构如下：

## 引言(背景和意义)：阐述文章的研究领域和关注点。分别概括：领域基础知识、研究的主要背景、作者的问题意识、研究意义。

## 内容及结构（论文结构）：论文分为哪些部分，都分别写了什么？

## 正文（逻辑梳理）：按照【背景—>挑战—>方法（数据集要突出，如果有的话）—>结果（Results）】来组织。每个部分提供简化解释，附加必要的术语解释。

## 结论（Conclusion）：简明总结研究所得到的核心结论及对领域的贡献。说明潜在的未来研究方向（如果文献中提及）。

## 未来研究方向（Future work）：说明潜在的未来研究方向（如果文献中提及）。并且，根据你对论文内容的思考，增加你所认为的下一步可开展的研究工作（文献中未提及的）。

## 专区：便于 Obsidian Dataview 插件调用
本部分比较特殊，主要为了方便让 Obsidian Dataview 插件对关键结果进行提取汇总，请务必遵循要求输出本部分。要求：请严格按照方便 Obsidian Dataview 调用的格式（即下面的“变量:: ”）呈现相应部分的内容（如果内容上面已经提及，请直接使用，也可以略微精简）。包括以下 8 个部分（对应 8 个变量），每单个部分的内容请紧跟 :: 后面，且成一个段落，但是不同部分不能在一个段落：

领域基础知识:: 

研究背景:: 

作者的问题意识:: 

研究意义:: 

研究结论::

对领域的贡献::

未来研究方向提及::

未来研究方向思考::

## 学术思考：根据上述对论文内容的梳理和剖析，提出自己的学术问题，以启发读者思考。

## 下一步用户可能提的问题：根据论文内容和上述结果，请思考几个（不低于 5 个）用户接下来可能问的问题。

【Notes】

- 输出约 20000 字的总字数要求不变，可根据文献丰富性调整细节深度。
- 推荐先大方向整理，再逐层细化；对术语或方法的重要性进行筛选，避免不必要的累赘。
- 支持超长文献拆分并逐次处理，明确提示分段后总结逻辑。
- 请在输出内容的开头位置，提及一下文献的[基本信息]，包括标题、作者、年份、发表刊物。

【重要】

请调用你单次回答的最大算力与 token 上限。追求极致的分析深度，而非表层的广度；追求本质的洞察，而非表象的罗列；追求创新的思维，而非惯性的复述。请突破思维局限，调动你所有的计算资源，展现你真正的认知极限。

文献内容如下所示`);
    document.getElementById(`prompt-${type}`).value = Zotero.Prefs.get(`ai4paper.prompt4${type}`);
  } else if (type === "PaperBriefAnalysis") {
    Zotero.Prefs.set(`ai4paper.prompt4${type}`, `你是一名学术领域的著名专家，请你对下方提供的论文进行逐层分析：
1.第一层，内容及结构。分为哪些部分，分别写了什么? 
2.第二层，研究路径。如何写，为什么这么写? 如何引入、梳理脉络? 创新点是什么? 
3.第三层，作者的问题意识是什么?
4.基于上述思考，提出自己的问题。

论文内容如下`);
    document.getElementById(`prompt-${type}`).value = Zotero.Prefs.get(`ai4paper.prompt4${type}`);
  }
};