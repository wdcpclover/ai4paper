Object.assign(Zotero.AI4Paper, {
  'canUseBrowserPath': async function (browserPath) {
    return !!browserPath && await OS.File.exists(browserPath);
  },
  'openURLWithOptionalBrowser': async function (url, browserPath) {
    if (browserPath) {
      if (!(await OS.File.exists(browserPath))) {
        ZoteroPane.loadURI(url);
        return false;
      }
      Zotero.launchFileWithApplication(url, browserPath);
      return false;
    }
    ZoteroPane.loadURI(url);
    return false;
  },
  'openImmersiveTranslate': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    var browserPath = Zotero.Prefs.get("ai4paper.browserPath4ImmersiveTranslate");
    let extensionPdfUrl = 'extension://amkbmndfnliijdhojkpoglbnaaahippg/pdf/index.html?file=file://',
      fallbackTranslateUrl = Zotero.Prefs.get("ai4paper.immersiveTranslatePlan") === '免费版' ? "https://app.immersivetranslate.com/file/" : "https://app.immersivetranslate.com/pdf-pro/",
      selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item.isAttachment()) {
        if (item.attachmentContentType == "application/pdf" || item.attachmentContentType == 'application/epub+zip') {
          if (Zotero.AI4Paper.runAuthor()) {
            let filePath = Zotero.isMac ? encodeURIComponent(item.getFilePath()) : item.getFilePath(),
              targetURL = '' + extensionPdfUrl + filePath,
              hasCustomBrowser = await Zotero.AI4Paper.canUseBrowserPath(browserPath);
            await Zotero.AI4Paper.openURLWithOptionalBrowser(hasCustomBrowser ? targetURL : fallbackTranslateUrl, hasCustomBrowser ? browserPath : '');
            Zotero.AI4Paper.copy2Clipboard(hasCustomBrowser ? targetURL : item.getFilePath());
          }
          return false;
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
              if (Zotero.AI4Paper.runAuthor()) {
                let filePath = Zotero.isMac ? encodeURIComponent(attachment.getFilePath()) : attachment.getFilePath(),
                  targetURL = '' + extensionPdfUrl + filePath,
                  hasCustomBrowser = await Zotero.AI4Paper.canUseBrowserPath(browserPath);
                await Zotero.AI4Paper.openURLWithOptionalBrowser(hasCustomBrowser ? targetURL : fallbackTranslateUrl, hasCustomBrowser ? browserPath : '');
                Zotero.AI4Paper.copy2Clipboard(hasCustomBrowser ? targetURL : Zotero.AI4Paper.openImmersiveTranslate_getPath(attachment));
                return;
              }
            } else {
              continue;
            }
          }
        }
        if (item.isAttachment()) {
          if (item.attachmentContentType == "application/pdf" || item.attachmentContentType == 'application/epub+zip') {
            if (Zotero.AI4Paper.runAuthor()) {
              let filePath = Zotero.isMac ? encodeURIComponent(item.getFilePath()) : item.getFilePath(),
                targetURL = '' + extensionPdfUrl + filePath,
                hasCustomBrowser = await Zotero.AI4Paper.canUseBrowserPath(browserPath);
              await Zotero.AI4Paper.openURLWithOptionalBrowser(hasCustomBrowser ? targetURL : fallbackTranslateUrl, hasCustomBrowser ? browserPath : '');
              Zotero.AI4Paper.copy2Clipboard(hasCustomBrowser ? targetURL : item.getFilePath());
            }
          }
        }
      }
    }
  },
  'openUniversalImmersiveTranslate': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    var browserPath = Zotero.Prefs.get("ai4paper.browserPath4ImmersiveTranslate2nd");
    let translateUrl = Zotero.Prefs.get("ai4paper.immersiveTranslatePlan") === '免费版' ? "https://app.immersivetranslate.com/file/" : "https://app.immersivetranslate.com/pdf-pro/",
      selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item.isAttachment()) {
        if (item.attachmentContentType == "application/pdf" || item.attachmentContentType == "application/epub+zip") {
          return Zotero.AI4Paper.runAuthor() && (await Zotero.AI4Paper.openURLWithOptionalBrowser(translateUrl, browserPath), Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.openImmersiveTranslate_getPath(item))), false;
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
              if (Zotero.AI4Paper.runAuthor()) {
                await Zotero.AI4Paper.openURLWithOptionalBrowser(translateUrl, browserPath);
                Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.openImmersiveTranslate_getPath(attachment));
                return;
              }
            } else {
              continue;
            }
          }
        }
        if (item.isAttachment()) {
          (item.attachmentContentType == "application/pdf" || item.attachmentContentType == "application/epub+zip") && Zotero.AI4Paper.runAuthor() && (await Zotero.AI4Paper.openURLWithOptionalBrowser(translateUrl, browserPath), Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.openImmersiveTranslate_getPath(item)));
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
