var methodsBody = function () {};

// 初始化
methodsBody.init = function () {
  // 设置 Dialog 字体大小
  Zotero.AI4Paper.setFontSize_Dialog(document.querySelector('dialog'), 0.92);

  // 根据 Zotero 版本调整样式
  Zotero.AI4Paper.updateTextAreaBox4ZoteroScheme(window);

  // // 创建服务
  // methodsBody.buildServiceList();
  // // 设置服务
  // document.getElementById("zotero-if-xul-chatgptprefs-gptservice").value = Zotero.Prefs.get('ai4paper.gptservice'); // menuitem 需要设置 value；或者 Object.keys(Zotero.AI4Paper.gptServiceList()).indexOf(Zotero.Prefs.get('ai4paper.gptservice'))

  // // 创建模型
  // methodsBody.buildModelList();
  // // 设置模型
  // document.getElementById("zotero-if-xul-chatgptprefs-model").value = Zotero.Prefs.get('ai4paper.gptmodel'); // 获取模型索引 或者 .selectedIndex Zotero.AI4Paper.gptModelList.indexOf(Zotero.Prefs.get('ai4paper.gptmodel'))

  // 多轮对话
  document.getElementById('zotero-if-xul-chatgptprefs-enableContinuesChatMode').checked = Zotero.Prefs.get('ai4paper.gptContinuesChatMode');

  // 流式输出
  document.getElementById('zotero-if-xul-chatgptprefs-enableStreamMode').checked = Zotero.Prefs.get('ai4paper.gptStreamResponse');

  // 实时渲染 Markdown 和 LaTeX
  document.getElementById('zotero-if-xul-chatgptprefs-renderMarkdownLaTeXRealTime').checked = Zotero.Prefs.get('ai4paper.renderMarkdownLaTeXRealTime');
  document.getElementById('zotero-if-xul-chatgptprefs-gptShowMessageExpandArrow').checked = Zotero.Prefs.get('ai4paper.gptShowMessageExpandArrow');

  // 启用 Shift 拼接
  document.getElementById('zotero-if-xul-chatgptprefs-enableShiftKeyMergeText').checked = Zotero.Prefs.get('ai4paper.gptMergeSelectedTextEnable');

  // 字体大小
  document.getElementById("zotero-if-xul-chatgptprefs-setFontSize").value = Zotero.Prefs.get('ai4paper.gptSidePaneFontSize');

  // 深色主题
  document.getElementById("zotero-if-xul-chatgptprefs-darkModeTheme").value = Zotero.Prefs.get('ai4paper.gptSidePaneDarkModeTheme');

  // 代码块高亮样式
  document.getElementById("zotero-if-xul-chatgptprefs-gptSidePaneHighlightStyle").value = Zotero.Prefs.get('ai4paper.gptSidePaneHighlightStyle');

  // 自定义用户名
  document.getElementById('zotero-if-xul-chatgptprefs-userName').value = Zotero.Prefs.get('ai4paper.gptUserName');

  // 设置 Prompt 模板
  document.getElementById("zotero-if-xul-chatgptprefs-prompt-template-user").value = Zotero.Prefs.get('ai4paper.chatgptprompttemplateuser');

  // AI 解读论文时清空历史对话
  document.getElementById('zotero-if-xul-chatgptprefs-clearChatOnPaperAI').checked = Zotero.Prefs.get('ai4paper.clearChatOnPaperAI');

  // AI 解读论文后自动创建笔记
  document.getElementById('zotero-if-xul-chatgptprefs-createAIReadingNoteOnPaperAI').checked = Zotero.Prefs.get('ai4paper.createAIReadingNoteOnPaperAI');

  // 强制刷新条目修改时间（便于智能文献矩阵排序）
  document.getElementById('zotero-if-xul-chatgptprefs-updateModifiedDate4PapersMatrix').checked = Zotero.Prefs.get('ai4paper.updateModifiedDate4PapersMatrix');

  // 生成 AI 解读笔记后，为父条目添加标签：
  document.getElementById('zotero-if-xul-chatgptprefs-addEmojiTag2ParentItemOnPaperAI').checked = Zotero.Prefs.get('ai4paper.addEmojiTag2ParentItemOnPaperAI');
  document.getElementById('zotero-if-xul-chatgptprefs-emojiTagAdded2ParentItemOnPaperAI').value = Zotero.Prefs.get('ai4paper.emojiTagAdded2ParentItemOnPaperAI');
  document.getElementById('ai4paper.gptMarkdownMsgExportPath').value = Zotero.Prefs.get('ai4paper.gptMarkdownMsgExportPath');
};

// // 创建服务
// methodsBody.buildServiceList = function() {
//     let menupopup = document.getElementById("zotero-if-xul-chatgptprefs-gptservice-menupopup");
//     // 获取服务对象的属性，返回服务名称数组
//     let serviceList = Object.keys(Zotero.AI4Paper.gptServiceList());
//     for (let e of serviceList) {
//         let menuitem = document.createXULElement('menuitem');
//         menuitem.label = e;
//         menuitem.value = e;
//         menupopup.appendChild(menuitem);
//     }
// }

// // 创建模型
// methodsBody.buildModelList = function() {
//     let menupopup = document.getElementById("zotero-if-xul-chatgptprefs-model-menupopup");
//     // 获取服务对象的属性，返回服务名称数组
//     let modelList = Zotero.AI4Paper.gptModelList;
//     for (let e of modelList) {
//         let menuitem = document.createXULElement('menuitem');
//         menuitem.label = e;
//         menuitem.value = e;
//         menupopup.appendChild(menuitem);
//     }
// }

// 设置服务/模型
// methodsBody.setGPTServiceModel = function() {
//     Zotero.Prefs.set('ai4paper.gptservice', document.getElementById('zotero-if-xul-chatgptprefs-gptservice').label);
//     Zotero.Prefs.set('ai4paper.gptmodel', document.getElementById('zotero-if-xul-chatgptprefs-model').label);

//     // 刷新服务模型
//     Zotero.AI4Paper.gptReaderSidePane_updateServiceModel();
// }

// 多轮对话
methodsBody.enableContinuesChatMode = function () {
  Zotero.Prefs.set('ai4paper.gptContinuesChatMode', document.getElementById('zotero-if-xul-chatgptprefs-enableContinuesChatMode').checked);
  Zotero.AI4Paper.gptReaderSidePane_changeChatMode();
};

// 流式输出
methodsBody.enableStreamMode = function () {
  // let promptService = Cc['@mozilla.org/embedcomp/prompt-service;1']
  //   .getService(Ci.nsIPromptService);

  if (!document.getElementById("zotero-if-xul-chatgptprefs-enableStreamMode").checked) {
    let confirmed = Services.prompt.confirm(window, '修改 GPT 响应模式', '你正在关闭 GPT 流式响应，点击 OK 以确认关闭。\n\n👉 强烈建议您使用 GPT 流式响应模式 👈，能获得更快的响应速度和更好的使用体验。');
    if (confirmed) {
      Zotero.Prefs.set('ai4paper.gptStreamResponse', false);
    } else {
      document.getElementById("zotero-if-xul-chatgptprefs-enableStreamMode").checked = true;
      Zotero.Prefs.set('ai4paper.gptStreamResponse', true);
    }
  } else {
    Zotero.Prefs.set('ai4paper.gptStreamResponse', true);
  }
};

// 实时渲染 Markdown 和 LaTeX
methodsBody.renderMarkdownLaTeXRealTime = function () {
  Zotero.Prefs.set('ai4paper.renderMarkdownLaTeXRealTime', document.getElementById('zotero-if-xul-chatgptprefs-renderMarkdownLaTeXRealTime').checked);
};

// 智能折叠用户消息
methodsBody.gptShowMessageExpandArrow = function () {
  Zotero.Prefs.set('ai4paper.gptShowMessageExpandArrow', document.getElementById('zotero-if-xul-chatgptprefs-gptShowMessageExpandArrow').checked);
};

// Shift 拼接
methodsBody.enableShiftKeyMergeText = function () {
  Zotero.Prefs.set('ai4paper.gptMergeSelectedTextEnable', document.getElementById('zotero-if-xul-chatgptprefs-enableShiftKeyMergeText').checked);
};

// 字体大小
methodsBody.setFontSize = function () {
  Zotero.Prefs.set('ai4paper.gptSidePaneFontSize', document.getElementById('zotero-if-xul-chatgptprefs-setFontSize').label);
  Zotero.AI4Paper.updateChatGPTReaderSidePane();
};

// 深色主题
methodsBody.setDarkModeTheme = function () {
  Zotero.Prefs.set('ai4paper.gptSidePaneDarkModeTheme', document.getElementById('zotero-if-xul-chatgptprefs-darkModeTheme').label);
  Zotero.AI4Paper.gptReaderSidePane_injectStyle();
};

// 代码块高亮样式
methodsBody.setHighlightStyle = function () {
  Zotero.Prefs.set('ai4paper.gptSidePaneHighlightStyle', document.getElementById('zotero-if-xul-chatgptprefs-gptSidePaneHighlightStyle').label);
  Zotero.AI4Paper.updateChatUI4HighlightStyle();
};

// 设置 Prompt 模板
methodsBody.setPromptTemplateUser = function () {
  Zotero.Prefs.set('ai4paper.chatgptprompttemplateuser', document.getElementById('zotero-if-xul-chatgptprefs-prompt-template-user').value);
  // Zotero.AI4Paper.updatePromptTemplateGPTWindow();
  // Zotero.AI4Paper.getUserPromptTemplateChatGPTTab(); // chatgpt tab 模板更新
  // Zotero.AI4Paper.showProgressWindow(3000, 'test', 'test')
  Zotero.AI4Paper.gptReaderSidePane_updatePromptTemplate(); // chatgpt reader sidepane 模板更新
};
methodsBody.chooseDirectory = async function (prefsName) {
  var {
    FilePicker
  } = ChromeUtils.importESModule('chrome://zotero/content/modules/filePicker.mjs');
  var fp = new FilePicker();

  // 如果已经设置过，则定位到文件夹
  try {
    let oldPath = Zotero.Prefs.get(`ai4paper.${prefsName}`);
    if (oldPath && (await Zotero.AI4Paper.isPathExists(oldPath))) {
      fp.displayDirectory = oldPath;
    }
  } catch (e) {
    Zotero.debug(e);
  }
  fp.init(window, "选择文件夹", fp.modeGetFolder);
  fp.appendFilters(fp.filterAll);
  if ((await fp.show()) != fp.returnOK) {
    return false;
  }
  var folderPath = PathUtils.normalize(fp.file);
  Zotero.Prefs.set(`ai4paper.${prefsName}`, folderPath);
  document.getElementById(`ai4paper.${prefsName}`).value = folderPath;
};