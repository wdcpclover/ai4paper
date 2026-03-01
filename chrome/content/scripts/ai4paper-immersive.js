Object.assign(Zotero.AI4Paper, {
  'openImmersiveTranslate': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    var browserPath = Zotero.Prefs.get("ai4paper.browserPath4ImmersiveTranslate");
    if (!browserPath) {
      return window.alert("请先前往【Zotero 设置 --> AI4paper --> 拓展 --> Open with Browser】设定 Microsoft Edge 浏览器路径。"), false;
    }
    if (!(await OS.File.exists(browserPath))) return window.alert("您设定的浏览器应用不存在！"), false;
    let extensionPdfUrl = 'extension://amkbmndfnliijdhojkpoglbnaaahippg/pdf/index.html?file=file://',
      selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item.isAttachment()) {
        if (item.attachmentContentType == "application/pdf" || item.attachmentContentType == 'application/epub+zip') {
          if (browserPath) {
            if (Zotero.AI4Paper.runAuthor()) {
              let filePath = Zotero.isMac ? encodeURIComponent(item.getFilePath()) : item.getFilePath();
              Zotero.launchFileWithApplication('' + extensionPdfUrl + filePath, browserPath);
              Zotero.AI4Paper.copy2Clipboard('' + extensionPdfUrl + filePath);
            }
            return false;
          }
        }
      }
    } else {
      var item = ZoteroPane.getSelectedItems()[0x0];
      if (item && !item.isNote()) {
        if (item.isRegularItem()) {
          let attachmentIDs = item.getAttachments();
          for (let attachmentID of attachmentIDs) {
            let attachment = Zotero.Items.get(attachmentID);
            if (attachment.attachmentContentType == "application/pdf" || attachment.attachmentContentType == "application/epub+zip") {
              if (browserPath) {
                if (Zotero.AI4Paper.runAuthor()) {
                  let filePath = Zotero.isMac ? encodeURIComponent(attachment.getFilePath()) : attachment.getFilePath();
                  Zotero.launchFileWithApplication('' + extensionPdfUrl + filePath, browserPath);
                  Zotero.AI4Paper.copy2Clipboard('' + extensionPdfUrl + filePath);
                  return;
                }
              }
            } else {
              continue;
            }
          }
        }
        if (item.isAttachment()) {
          if (item.attachmentContentType == "application/pdf" || item.attachmentContentType == 'application/epub+zip') {
            if (browserPath) {
              if (Zotero.AI4Paper.runAuthor()) {
                let filePath = Zotero.isMac ? encodeURIComponent(item.getFilePath()) : item.getFilePath();
                Zotero.launchFileWithApplication('' + extensionPdfUrl + filePath, browserPath);
                Zotero.AI4Paper.copy2Clipboard('' + extensionPdfUrl + filePath);
              }
            }
          }
        }
      }
    }
  },
  'openUniversalImmersiveTranslate': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    var browserPath = Zotero.Prefs.get("ai4paper.browserPath4ImmersiveTranslate2nd");
    if (!browserPath) {
      return window.alert('请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20拓展\x20-->\x20Open\x20with\x20Browser】设定浏览器路径。'), false;
    }
    if (!(await OS.File.exists(browserPath))) return window.alert("您设定的浏览器应用不存在！"), false;
    let translateUrl = Zotero.Prefs.get("ai4paper.immersiveTranslatePlan") === '免费版' ? "https://app.immersivetranslate.com/file/" : "https://app.immersivetranslate.com/pdf-pro/",
      selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item.isAttachment()) {
        if (item.attachmentContentType == "application/pdf" || item.attachmentContentType == "application/epub+zip") {
          if (browserPath) {
            return Zotero.AI4Paper.runAuthor() && (Zotero.launchFileWithApplication(translateUrl, browserPath), Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.openImmersiveTranslate_getPath(item))), false;
          }
        }
      }
    } else {
      var item = ZoteroPane.getSelectedItems()[0x0];
      if (item && !item.isNote()) {
        if (item.isRegularItem()) {
          let attachmentIDs = item.getAttachments();
          for (let attachmentID of attachmentIDs) {
            let attachment = Zotero.Items.get(attachmentID);
            if (attachment.attachmentContentType == "application/pdf" || attachment.attachmentContentType == 'application/epub+zip') {
              if (browserPath) {
                if (Zotero.AI4Paper.runAuthor()) {
                  Zotero.launchFileWithApplication(translateUrl, browserPath);
                  Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.openImmersiveTranslate_getPath(attachment));
                  return;
                }
              }
            } else {
              continue;
            }
          }
        }
        if (item.isAttachment()) {
          (item.attachmentContentType == "application/pdf" || item.attachmentContentType == "application/epub+zip") && browserPath && Zotero.AI4Paper.runAuthor() && (Zotero.launchFileWithApplication(translateUrl, browserPath), Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.openImmersiveTranslate_getPath(item)));
        }
      }
    }
  },
  'openImmersiveTranslate_getPath': function (item) {
    let fullPath = item.getFilePath();
    if (Zotero.isMac) {
      return fullPath;
    } else {
      let lastSepIndex = fullPath.lastIndexOf('\x5c');
      return fullPath.substring(0x0, lastSepIndex);
    }
  },
});
