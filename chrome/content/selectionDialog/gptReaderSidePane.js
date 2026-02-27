function gptReaderSidePane_init() {
  Zotero.ZoteroIF.update_svg_icons(document);

  // 根据 Zotero 版本调整样式
  Zotero.ZoteroIF.updateHTMLTextAreaBorder4ZoteroScheme(window);

  // 禁用横向滚动条
  document.body.style.overflowX = 'hidden';
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  let screen_height = window.screen.height;
  // 使用默认 UI 高度
  if (!Zotero.Prefs.get('zoteroif.gptEnableCustomGPTUIHeight')) {
    let a;
    let b;
    if (parseInt(screen_height) <= 1000) {
      a = screen_height * 0.27;
      b = screen_height * 0.30;
      document.getElementById("zoteroif-chatgpt-readerSidePane-chatgpt-prompt").style.height = `${a}px`;
      document.getElementById("zoteroif-chatgpt-readerSidePane-chatgpt-response").style.height = `${b}px`;
      // 预置参数
      Zotero.Prefs.set('zoteroif.gptCustomPromptAreaHeight', a.toFixed(2)); // 保留 2 位小数
      Zotero.Prefs.set('zoteroif.gptCustomResponseAreaHeight', b.toFixed(2));
    } else {
      a = screen_height * 0.29;
      b = screen_height * 0.395;
      document.getElementById("zoteroif-chatgpt-readerSidePane-chatgpt-prompt").style.height = `${a}px`;
      document.getElementById("zoteroif-chatgpt-readerSidePane-chatgpt-response").style.height = `${b}px`;
      // 预置参数
      Zotero.Prefs.set('zoteroif.gptCustomPromptAreaHeight', a.toFixed(2));
      Zotero.Prefs.set('zoteroif.gptCustomResponseAreaHeight', b.toFixed(2));
    }
    // 自动调整 ifram 高度
    Zotero.ZoteroIF.gptReaderSidePane_setUIHeight(a, b);
  }
  // 使用自定义 UI 高度
  else {
    document.getElementById("zoteroif-chatgpt-readerSidePane-chatgpt-prompt").style.height = `${Zotero.Prefs.get('zoteroif.gptCustomPromptAreaHeight')}px`;
    document.getElementById("zoteroif-chatgpt-readerSidePane-chatgpt-response").style.height = `${Zotero.Prefs.get('zoteroif.gptCustomResponseAreaHeight')}px`;
    // 自动调整 ifram 高度
    Zotero.ZoteroIF.gptReaderSidePane_setUIHeight(Zotero.Prefs.get('zoteroif.gptCustomPromptAreaHeight'), Zotero.Prefs.get('zoteroif.gptCustomResponseAreaHeight'));
  }

  // 右键复位 prompt
  document.getElementById("zoteroif-chatgpt-readerSidePane-chatgpt-prompt").addEventListener("mousedown", event => {
    if (event.button == 2) {
      Zotero.ZoteroIF.gptReaderSidePane_clearChat();
    }
  });
  Zotero.ZoteroIF.updateChatGPTReaderSidePane(); // 包括了对侧边栏对话框、模板列表的更新等
  Zotero.ZoteroIF.enableGPTFuncButtons();
}
function readerSidePane_checkKeyEnter(keys) {
  if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
    keys.returnValue = false;
    if (keys.preventDefault) {
      keys.preventDefault();
    }
    Zotero.ZoteroIF.gptReaderSidePane_send();
  }
}
function readerSidePane_pushText() {
  Zotero.Prefs.set('zoteroif.chatgptprompt', document.getElementById("zoteroif-chatgpt-readerSidePane-chatgpt-prompt").value);
}