var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  methodsBody.setChatButtons(true);
  methodsBody.setMessageButtons(true);

  // 设置 Dialog 字体大小
  Zotero.AI4Paper.setFontSize_Dialog(document.querySelector('dialog'), 0.92);
};
methodsBody.setChatButtons = function (isInit) {
  for (let type of Zotero.AI4Paper.chatButtons) {
    if (isInit) {
      document.getElementById(`chatButton-${type}`).checked = Zotero.Prefs.get(`ai4paper.gptFuncButton${type}`);
    } else {
      Zotero.Prefs.set(`ai4paper.gptFuncButton${type}`, document.getElementById(`chatButton-${type}`).checked);
    }
  }

  // 刷新当前 PDF Tab
  Zotero.AI4Paper.enableGPTFuncButtons();
};
methodsBody.setMessageButtons = function (isInit) {
  // 在 Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement 也要修改
  // enableGPTQuickButtons

  for (let buttonName of Zotero.AI4Paper.messageQuickButtons) {
    if (isInit) {
      document.getElementById(`messageButton-${buttonName}`).checked = Zotero.Prefs.get(`ai4paper.gptQuickButton${buttonName}`);
    } else {
      Zotero.Prefs.set(`ai4paper.gptQuickButton${buttonName}`, document.getElementById(`messageButton-${buttonName}`).checked);
    }
  }

  // 刷新显示
  if (!isInit) {
    Zotero.AI4Paper.enableGPTQuickButtons();
  }
};