var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  methodsBody.setChatButtons(true);
  methodsBody.setMessageButtons(true);

  // 设置 Dialog 字体大小
  Zotero.ZoteroIF.setFontSize_Dialog(document.querySelector('dialog'), 0.92);
};
methodsBody.setChatButtons = function (isInit) {
  for (let type of Zotero.ZoteroIF.chatButtons) {
    if (isInit) {
      document.getElementById(`chatButton-${type}`).checked = Zotero.Prefs.get(`zoteroif.gptFuncButton${type}`);
    } else {
      Zotero.Prefs.set(`zoteroif.gptFuncButton${type}`, document.getElementById(`chatButton-${type}`).checked);
    }
  }

  // 刷新当前 PDF Tab
  Zotero.ZoteroIF.enableGPTFuncButtons();
};
methodsBody.setMessageButtons = function (isInit) {
  // 在 Zotero.ZoteroIF.gptReaderSidePane_ChatMode_createMessageElement 也要修改
  // enableGPTQuickButtons

  for (let buttonName of Zotero.ZoteroIF.messageQuickButtons) {
    if (isInit) {
      document.getElementById(`messageButton-${buttonName}`).checked = Zotero.Prefs.get(`zoteroif.gptQuickButton${buttonName}`);
    } else {
      Zotero.Prefs.set(`zoteroif.gptQuickButton${buttonName}`, document.getElementById(`messageButton-${buttonName}`).checked);
    }
  }

  // 刷新显示
  if (!isInit) {
    Zotero.ZoteroIF.enableGPTQuickButtons();
  }
};