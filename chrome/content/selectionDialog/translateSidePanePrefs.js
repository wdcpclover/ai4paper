var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => {});

  // 设置 Dialog 字体大小
  Zotero.AI4Paper.setFontSize_Dialog(document.querySelector('dialog'), 0.92);

  // 字体大小
  document.getElementById("zotero-if-xul-translateSidePanePrefs-setFontSize").selectedIndex = Number(Zotero.Prefs.get('ai4paper.translatesidepanefontsize').substring(0, 2)) - 14;
  // 字体大小
  document.getElementById("zotero-if-xul-translateSidePanePrefs-setLineHeight").selectedIndex = Number(Number(Zotero.Prefs.get('ai4paper.translatesidepanelineheight')) - 1.5) * 2;

  // 生词复习内容
  let reviewContent = {
    '仅单词': 0,
    '仅短语': 1,
    '仅例句': 2,
    '仅短语和例句': 3,
    '全部': 4
  };
  document.getElementById("zotero-if-xul-translateSidePanePrefs-vocabularyReviewContent").selectedIndex = reviewContent[Zotero.Prefs.get('ai4paper.vocabularyreviewcontent')];

  // 生词复习内容
  document.getElementById("zotero-if-xul-translateSidePanePrefs-vocabularyReview-give-interpretation").checked = Zotero.Prefs.get('ai4paper.vocabularyreviewgiveinterpretation');

  // 拼接快捷键
  document.getElementById("zotero-if-xul-translateSidePanePrefs-enableTransCrossShortcuts").checked = Zotero.Prefs.get('ai4paper.translationcrossparagraphsShortcutsEnable');

  // UI 高度
  document.getElementById("zotero-if-xul-translateEnableCustomUIHeight").checked = Zotero.Prefs.get('ai4paper.translateEnableCustomUIHeight');
  document.getElementById("zotero-if-xul-translateCustomSourceTextAreaHeight").value = Zotero.Prefs.get('ai4paper.translateCustomSourceTextAreaHeight');
  document.getElementById("zotero-if-xul-translateCustomResponseAreaHeight").value = Zotero.Prefs.get('ai4paper.translateCustomResponseAreaHeight');

  // 未启用交换
  if (!Zotero.Prefs.get('ai4paper.translatesidepaneExchangeSourceResponseArea')) {
    document.getElementById('source-icon').innerHTML = Zotero.AI4Paper.svg_icon_20px.raw;
    document.getElementById('response-icon').innerHTML = Zotero.AI4Paper.svg_icon_20px.result;
  }
  // 启用了交换
  else {
    document.getElementById('source-icon').innerHTML = Zotero.AI4Paper.svg_icon_20px.result;
    document.getElementById('response-icon').innerHTML = Zotero.AI4Paper.svg_icon_20px.raw;
  }
};

// 字体大小
methodsBody.setFontSize = function () {
  Zotero.Prefs.set('ai4paper.translatesidepanefontsize', document.getElementById('zotero-if-xul-translateSidePanePrefs-setFontSize').label);
  Zotero.AI4Paper.updateTranslateReaderSidePane();
};

// 行高
methodsBody.setLineHeight = function () {
  Zotero.Prefs.set('ai4paper.translatesidepanelineheight', document.getElementById('zotero-if-xul-translateSidePanePrefs-setLineHeight').label);
  Zotero.AI4Paper.updateTranslateReaderSidePane();
};

// 交换源文/译文区
methodsBody.exchangeSourceResponseArea = function () {
  // 未启用交换，则交换
  if (!Zotero.Prefs.get('ai4paper.translatesidepaneExchangeSourceResponseArea')) {
    document.getElementById('source-icon').innerHTML = Zotero.AI4Paper.svg_icon_20px.result;
    document.getElementById('response-icon').innerHTML = Zotero.AI4Paper.svg_icon_20px.raw;
    Zotero.Prefs.set('ai4paper.translatesidepaneExchangeSourceResponseArea', true);
  }
  // 启用了交换，则取消交换
  else {
    document.getElementById('source-icon').innerHTML = Zotero.AI4Paper.svg_icon_20px.raw;
    document.getElementById('response-icon').innerHTML = Zotero.AI4Paper.svg_icon_20px.result;
    Zotero.Prefs.set('ai4paper.translatesidepaneExchangeSourceResponseArea', false);
  }
  Zotero.AI4Paper.updateTranslateReaderSidePane();
};

// 生词复习内容
methodsBody.vocabularyReviewContent = function () {
  Zotero.Prefs.set('ai4paper.vocabularyreviewcontent', document.getElementById('zotero-if-xul-translateSidePanePrefs-vocabularyReviewContent').label);
};

// 释义设置
methodsBody.setInterpretationMode = function () {
  Zotero.Prefs.set('ai4paper.vocabularyreviewgiveinterpretation', document.getElementById('zotero-if-xul-translateSidePanePrefs-vocabularyReview-give-interpretation').checked);
  Zotero.AI4Paper.updateTranslateReaderSidePane();
};

// 拼接快捷键
methodsBody.enableTransCrossShortcuts = function () {
  Zotero.Prefs.set('ai4paper.translationcrossparagraphsShortcutsEnable', document.getElementById('zotero-if-xul-translateSidePanePrefs-enableTransCrossShortcuts').checked);
};

// 更新 UI 高度
methodsBody.updateUIElementHeight = function () {
  let screen_height = parseInt(window.screen.height);
  let defaultPromptHight = '';
  let defaultResponseHight = '';
  if (parseInt(screen_height) <= 1000) {
    defaultPromptHight = (screen_height * 0.30).toFixed(2);
    defaultResponseHight = (screen_height * 0.352).toFixed(2);
  } else {
    defaultPromptHight = (screen_height * 0.33).toFixed(2);
    defaultResponseHight = (screen_height * 0.4).toFixed(2);
  }
  let translateCustomSourceTextAreaHeight = parseInt(document.getElementById("zotero-if-xul-translateCustomSourceTextAreaHeight").value);
  let translateCustomResponseAreaHeight = parseInt(document.getElementById("zotero-if-xul-translateCustomResponseAreaHeight").value);
  if (translateCustomSourceTextAreaHeight > screen_height) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值超过上限', `您所输入的参数超过上限 ${screen_height}`);
    document.getElementById("zotero-if-xul-translateCustomSourceTextAreaHeight").value = defaultPromptHight;
    Zotero.Prefs.set('ai4paper.translateCustomSourceTextAreaHeight', String(defaultPromptHight));
    return;
  }
  if (translateCustomResponseAreaHeight > screen_height) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值超过上限', `您所输入的参数超过上限 ${screen_height}`);
    document.getElementById("zotero-if-xul-translateCustomResponseAreaHeight").value = defaultResponseHight;
    Zotero.Prefs.set('ai4paper.translateCustomResponseAreaHeight', String(defaultResponseHight));
    return;
  }
  if (translateCustomSourceTextAreaHeight < 0) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值不能小于 0', `您所输入的参数不能小于 0`);
    document.getElementById("zotero-if-xul-translateCustomSourceTextAreaHeight").value = defaultPromptHight;
    Zotero.Prefs.set('ai4paper.translateCustomSourceTextAreaHeight', String(defaultPromptHight));
    return;
  }
  if (translateCustomResponseAreaHeight < 0) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值不能小于 0', `您所输入的参数不能小于 0`);
    document.getElementById("zotero-if-xul-translateCustomResponseAreaHeight").value = defaultResponseHight;
    Zotero.Prefs.set('ai4paper.translateCustomResponseAreaHeight', String(defaultResponseHight));
    return;
  }
  Zotero.Prefs.set('ai4paper.translateEnableCustomUIHeight', document.getElementById("zotero-if-xul-translateEnableCustomUIHeight").checked);
  Zotero.Prefs.set('ai4paper.translateCustomSourceTextAreaHeight', document.getElementById("zotero-if-xul-translateCustomSourceTextAreaHeight").value);
  Zotero.Prefs.set('ai4paper.translateCustomResponseAreaHeight', document.getElementById("zotero-if-xul-translateCustomResponseAreaHeight").value);
  Zotero.AI4Paper.translateReaderSidePane_setUIHeight(defaultPromptHight, defaultResponseHight);
};
// 重置 UI 参数
methodsBody.resetUIElementHeight = function () {
  let screen_height = parseInt(window.screen.height);
  let defaultPromptHight = '';
  let defaultResponseHight = '';
  if (parseInt(screen_height) <= 1000) {
    defaultPromptHight = (screen_height * 0.30).toFixed(2);
    defaultResponseHight = (screen_height * 0.352).toFixed(2);
  } else {
    defaultPromptHight = (screen_height * 0.33).toFixed(2);
    defaultResponseHight = (screen_height * 0.4).toFixed(2);
  }
  document.getElementById("zotero-if-xul-translateCustomSourceTextAreaHeight").value = defaultPromptHight;
  document.getElementById("zotero-if-xul-translateCustomResponseAreaHeight").value = defaultResponseHight;
  Zotero.Prefs.set('ai4paper.translateEnableCustomUIHeight', document.getElementById("zotero-if-xul-translateEnableCustomUIHeight").checked);
  Zotero.Prefs.set('ai4paper.translateCustomSourceTextAreaHeight', document.getElementById("zotero-if-xul-translateCustomSourceTextAreaHeight").value);
  Zotero.Prefs.set('ai4paper.translateCustomResponseAreaHeight', document.getElementById("zotero-if-xul-translateCustomResponseAreaHeight").value);
  Zotero.AI4Paper.translateReaderSidePane_setUIHeight(defaultPromptHight, defaultResponseHight);
};