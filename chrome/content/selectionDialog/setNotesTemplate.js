var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => {});

  // 设置 Dialog 字体大小
  Zotero.ZoteroIF.setFontSize_Dialog(document.querySelector('dialog'), 0.92);

  // 根据 Zotero 版本调整样式
  Zotero.ZoteroIF.updateTextAreaBox4ZoteroScheme(window);

  // 设置值
  methodsBody.setValue(true);
};
methodsBody.setValue = function (isInit) {
  let textareaItems = ["yamltemplate", "notesmetadatatemplate", "notesusernotestemplate", "qnkeyTemplate"];
  let checkboxItems = ["obsidianyamlenable", "useItemIDAsQNKeySuffix", "useCitationKeyasQNKey"];
  for (let item of textareaItems) {
    if (isInit) {
      document.getElementById(item).value = Zotero.Prefs.get(`zoteroif.${item}`);
    } else {
      Zotero.Prefs.set(`zoteroif.${item}`, document.getElementById(item).value);
    }
  }
  for (let item of checkboxItems) {
    if (isInit) {
      document.getElementById(item).checked = Zotero.Prefs.get(`zoteroif.${item}`);
    } else {
      Zotero.Prefs.set(`zoteroif.${item}`, document.getElementById(item).checked);
    }
  }
};
methodsBody.checkQNKeyTemplate = function () {
  // 找出模板中所有 [[[ 或 ]]] 的位置，并返回数组
  function findTripleBracketPositions(str, isRight) {
    // 创建一个正则表达式，用于匹配所有的"[[["
    const regex = isRight ? /\]\]\]/g : /\[\[\[/g;

    // 初始化一个数组来存储匹配的位置
    const positions = [];

    // 使用正则表达式的exec方法逐个查找匹配项
    let match;
    while ((match = regex.exec(str)) !== null) {
      // 将匹配项的索引添加到positions数组中
      positions.push(match.index);
    }

    // 返回包含所有位置的数组
    return positions;
  }
  // 读取模板，并将单引号替换为双引号
  let qnkeyTemplate = Zotero.Prefs.get('zoteroif.qnkeyTemplate').replace(/'/g, '"');
  // [[[ 位置数组
  const positionsL = findTripleBracketPositions(qnkeyTemplate, 0);
  // ]]] 位置数组
  const positionsR = findTripleBracketPositions(qnkeyTemplate, 1);
  // 包含相等数量的 [[[]]]
  if (!(positionsL.length === positionsR.length && positionsL.length != 0 && positionsR.length != 0)) {
    window.alert("❌ 无效的模板（invalid QNKey Template）！");
    return;
  }
  for (let i = 0; i < positionsL.length; i++) {
    try {
      JSON.parse(qnkeyTemplate.substring(positionsL[i] + 3, positionsR[i]).trim());
    } catch (e) {
      window.alert("❌ 模板解析失败（failed to resolve the QNKey Template）！");
      return;
    }
  }
  window.alert("✅ 模板有效（the QNKey Template is valid）!");
};
methodsBody.resetkQNKeyTemplate = function () {
  // 🆔 作为后缀
  Zotero.Prefs.set('zoteroif.useItemIDAsQNKeySuffix', true);
  // 不启用 citationKey
  Zotero.Prefs.set('zoteroif.useCitationKeyasQNKey', false);
  Zotero.Prefs.set('zoteroif.qnkeyTemplate', `// 属性名请用双引号括住；非布尔型属性值请用双引号括住；最后一个属性值后不可以有逗号。
[[[
    {
        "variable": "year",
        "prefix": "",
        "suffix": "_"
    }
]]]

[[[
    {
        "variable": "firstAuthor",
        "prefix": "",
        "suffix": "_"
    }
]]]

[[[
    {
        "variable": "title",
        "truncate_en": "20",
        "truncate_zh": "10",
        "prefix": "",
        "suffix": ""
    }
]]]`);
  methodsBody.setValue(true);
};