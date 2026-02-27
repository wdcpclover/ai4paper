var methodsBody = function () {};
methodsBody.init = function () {
  document.addEventListener('dialogaccept', () => {});

  // 设置 Dialog 字体大小
  Zotero.ZoteroIF.setFontSize_Dialog(document.querySelector('dialog'), 0.92);

  // 设置 Dialog 字体大小
  // var dialog = document.querySelector('dialog');
  // Zotero.UIProperties.registerRoot(dialog);

  // Zotero.ZoteroIF.setFontSize_Dialog(document.querySelector('dialog'));

  // 自动生成注释笔记附件
  document.getElementById("zotero-if-xul-autoannotationsnote").checked = Zotero.Prefs.get('zoteroif.autoannotationsnote');
  // 注释笔记行距
  let lineheight = {
    '紧凑型': 0,
    '宽松型': 1
  };
  document.getElementById("zotero-if-xul-autoannotationsnote-lineheight").selectedIndex = lineheight[Zotero.Prefs.get('zoteroif.autoannotationsnotelineheight')];
  // 导出注释笔记
  document.getElementById("zotero-if-xul-export-annotations-notes").checked = Zotero.Prefs.get('zoteroif.exportannotationsnotes');
  // 导出生词
  document.getElementById("zotero-if-xul-export-vocabulary-notes").checked = Zotero.Prefs.get('zoteroif.exportvocabularynotes');
  // 导出划词翻译
  document.getElementById("zotero-if-xul-export-translation-notes").checked = Zotero.Prefs.get('zoteroif.exporttranslationnotes');
  // 导出 GPT 笔记
  document.getElementById("zotero-if-xul-export-chatgpt-notes").checked = Zotero.Prefs.get('zoteroif.chatgptnotes');
  // 导出 AI 文献解读
  document.getElementById("zotero-if-xul-exportAIReadingNotes").checked = Zotero.Prefs.get('zoteroif.exportAIReadingNotes');
  // 去除作者内链
  document.getElementById("zotero-if-xul-export-notes-creators-no-internal-links").checked = Zotero.Prefs.get('zoteroif.creatorsnointernallinks');
  // 卡片时间戳
  document.getElementById("zotero-if-xul-obsidian-cardNotes-date").checked = Zotero.Prefs.get('zoteroif.generateCardNoteDate');
  // 图库标签单独管理
  document.getElementById("zotero-if-xul-obsidian-images-tags-specific").checked = Zotero.Prefs.get('zoteroif.imagesspecifictags');
  // 框选注释图片时
  let action = {
    '无操作': 0,
    '自动拷贝图片': 1,
    '自动通过 PicGo 上传至图床': 2
  };
  document.getElementById("zotero-if-xul-annotaionimage-actions").selectedIndex = action[Zotero.Prefs.get('zoteroif.annotationimageactions')];
  // 不生成笔记的注释颜色
  let colors = {
    '黄色': 0,
    '红色': 1,
    '绿色': 2,
    '蓝色': 3,
    '紫色': 4,
    '洋红色': 5,
    '橘色': 6,
    '灰色': 7,
    '黄色（高亮）': 0,
    '红色（高亮）': 1,
    '绿色（高亮）': 2,
    '蓝色（高亮）': 3,
    '紫色（高亮）': 4,
    '洋红色（高亮）': 5,
    '橘色（高亮）': 6,
    '灰色（高亮）': 7,
    '黄色（下划线）': 8,
    '红色（下划线）': 9,
    '绿色（下划线）': 10,
    '蓝色（下划线）': 11,
    '紫色（下划线）': 12,
    '洋红色（下划线）': 13,
    '橘色（下划线）': 14,
    '灰色（下划线）': 15,
    '黄色（下划线与文本）': 16,
    '红色（下划线与文本）': 17,
    '绿色（下划线与文本）': 18,
    '蓝色（下划线与文本）': 19,
    '紫色（下划线与文本）': 20,
    '洋红色（下划线与文本）': 21,
    '橘色（下划线与文本）': 22,
    '灰色（下划线与文本）': 23,
    '全部颜色（下划线）': 24,
    '全部颜色（文本）': 25,
    '全部颜色（下划线与文本）': 26,
    '无': 27
  };
  document.getElementById("zotero-if-xul-annotaionimage-color-excluded").selectedIndex = colors[Zotero.Prefs.get('zoteroif.autoannotationscolorexcluded')];
  // 图片宽度
  document.getElementById("zotero-if-xul-annotaionimage-image-width").value = Zotero.Prefs.get('zoteroif.autoannotationsnoteimagewidth');
  // 回链样式
  let linkStyle = {
    '页码': 0,
    '作者年份页码': 1
  };
  document.getElementById("zotero-if-xul-cardLink-style").selectedIndex = linkStyle[Zotero.Prefs.get('zoteroif.cardlinkstyle')];

  // 高亮色透明度
  methodsBody.setTransparency(true);
};
methodsBody.run = function () {
  // 导出注释笔记
  if (document.getElementById("zotero-if-xul-export-annotations-notes").checked) {
    Zotero.Prefs.set('zoteroif.exportannotationsnotes', true);
  } else {
    Zotero.Prefs.set('zoteroif.exportannotationsnotes', false);
  }
  // 导出生词
  if (document.getElementById("zotero-if-xul-export-vocabulary-notes").checked) {
    Zotero.Prefs.set('zoteroif.exportvocabularynotes', true);
  } else {
    Zotero.Prefs.set('zoteroif.exportvocabularynotes', false);
  }
  // 导出划词翻译
  if (document.getElementById("zotero-if-xul-export-translation-notes").checked) {
    Zotero.Prefs.set('zoteroif.exporttranslationnotes', true);
  } else {
    Zotero.Prefs.set('zoteroif.exporttranslationnotes', false);
  }
  // 导出 GPT 笔记
  if (document.getElementById("zotero-if-xul-export-chatgpt-notes").checked) {
    Zotero.Prefs.set('zoteroif.chatgptnotes', true);
  } else {
    Zotero.Prefs.set('zoteroif.chatgptnotes', false);
  }
  // 导出 AI 文献解读
  Zotero.Prefs.set('zoteroif.exportAIReadingNotes', document.getElementById("zotero-if-xul-exportAIReadingNotes").checked);
  // 去除作者内链
  if (document.getElementById("zotero-if-xul-export-notes-creators-no-internal-links").checked) {
    Zotero.Prefs.set('zoteroif.creatorsnointernallinks', true);
  } else {
    Zotero.Prefs.set('zoteroif.creatorsnointernallinks', false);
  }
  // 卡片时间戳
  if (document.getElementById("zotero-if-xul-obsidian-cardNotes-date").checked) {
    Zotero.Prefs.set('zoteroif.generateCardNoteDate', true);
  } else {
    Zotero.Prefs.set('zoteroif.generateCardNoteDate', false);
  }
  // 图库标签单独管理
  if (document.getElementById("zotero-if-xul-obsidian-images-tags-specific").checked) {
    Zotero.Prefs.set('zoteroif.imagesspecifictags', true);
  } else {
    Zotero.Prefs.set('zoteroif.imagesspecifictags', false);
  }
  // 框选注释图片时
  if (document.getElementById('zotero-if-xul-annotaionimage-actions').label === '无操作') {
    Zotero.Prefs.set('zoteroif.annotationimageactions', '无操作');
  } else if (document.getElementById('zotero-if-xul-annotaionimage-actions').label === '自动拷贝图片') {
    Zotero.Prefs.set('zoteroif.annotationimageactions', '自动拷贝图片');
  } else if (document.getElementById('zotero-if-xul-annotaionimage-actions').label === '自动通过 PicGo 上传至图床') {
    Zotero.Prefs.set('zoteroif.annotationimageactions', '自动通过 PicGo 上传至图床');
  } else {
    Zotero.Prefs.set('zoteroif.annotationimageactions', '无操作');
  }

  // 不生成笔记的注释颜色
  Zotero.Prefs.set('zoteroif.autoannotationscolorexcluded', document.getElementById('zotero-if-xul-annotaionimage-color-excluded').label);

  // 图片宽度
  Zotero.Prefs.set('zoteroif.autoannotationsnoteimagewidth', document.getElementById('zotero-if-xul-annotaionimage-image-width').label);

  // 自动生成注释笔记附件
  if (document.getElementById("zotero-if-xul-autoannotationsnote").checked) {
    Zotero.Prefs.set('zoteroif.autoannotationsnote', true);
  } else {
    Zotero.Prefs.set('zoteroif.autoannotationsnote', false);
  }
  // 注释笔记行距
  Zotero.Prefs.set('zoteroif.autoannotationsnotelineheight', document.getElementById('zotero-if-xul-autoannotationsnote-lineheight').label);

  // 回链样式
  Zotero.Prefs.set('zoteroif.cardlinkstyle', document.getElementById('zotero-if-xul-cardLink-style').label);
};
methodsBody.setTransparency = function (isInit) {
  let items = ["yellowtransparency", "redtransparency", "greentransparency", "bluetransparency", "purpletransparency", "magentatransparency", "orangetransparency", "graytransparency"];
  for (let item of items) {
    if (isInit) {
      document.getElementById(`highlightColor-${item}`).value = Zotero.Prefs.get(`zoteroif.${item}`);
    } else {
      Zotero.Prefs.set(`zoteroif.${item}`, document.getElementById(`highlightColor-${item}`).value);
    }
  }
};