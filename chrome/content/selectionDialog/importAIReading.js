var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);

  // 根据 Zotero 版本调整样式
  Zotero.ZoteroIF.updateTextAreaBox4ZoteroScheme(window);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection(true));
  this.io = window.arguments[0];
};
methodsBody.acceptSelection = function (isAppend) {
  let markdownContent = document.getElementById("textarea-markdownContent").value;
  if (!markdownContent.trim()) {
    Zotero.ZoteroIF.showProgressWindow(2000, "❌ 内容为空！", "Markdown 内容为空，请重新操作。");
    return;
  }
  Zotero.ZoteroIF.gptReaderSidePane_ChatMode_createAIReadingNoteItem("import", isAppend, markdownContent);
  window.close();
};
methodsBody.checkKeyEnter = function (keys) {
  if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
    keys.returnValue = false;
    if (keys.preventDefault) {
      keys.preventDefault();
    }
    methodsBody.acceptSelection(true);
  }
};