Object.assign(Zotero.AI4Paper, {
  'openImmersiveTranslate': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    var var5178 = Zotero.Prefs.get("ai4paper.browserPath4ImmersiveTranslate");
    if (!var5178) {
      return window.alert("请先前往【Zotero 设置 --> AI4paper --> 拓展 --> Open with Browser】设定 Microsoft Edge 浏览器路径。"), false;
    }
    if (!(await OS.File.exists(var5178))) return window.alert("您设定的浏览器应用不存在！"), false;
    let var5179 = 'extension://amkbmndfnliijdhojkpoglbnaaahippg/pdf/index.html?file=file://',
      var5180 = Zotero_Tabs._selectedID;
    var var5181 = Zotero.Reader.getByTabID(var5180);
    if (var5181) {
      let var5182 = var5181.itemID;
      var var5183 = Zotero.Items.get(var5182);
      if (var5183.isAttachment()) {
        if (var5183.attachmentContentType == "application/pdf" || var5183.attachmentContentType == 'application/epub+zip') {
          if (var5178) {
            if (Zotero.AI4Paper.runAuthor()) {
              let _0x28fe01 = Zotero.isMac ? encodeURIComponent(var5183.getFilePath()) : var5183.getFilePath();
              Zotero.launchFileWithApplication('' + var5179 + _0x28fe01, var5178);
              Zotero.AI4Paper.copy2Clipboard('' + var5179 + _0x28fe01);
            }
            return false;
          }
        }
      }
    } else {
      var var5183 = ZoteroPane.getSelectedItems()[0x0];
      if (var5183 && !var5183.isNote()) {
        if (var5183.isRegularItem()) {
          let var5185 = var5183.getAttachments();
          for (let var5186 of var5185) {
            let var5187 = Zotero.Items.get(var5186);
            if (var5187.attachmentContentType == "application/pdf" || var5187.attachmentContentType == "application/epub+zip") {
              if (var5178) {
                if (Zotero.AI4Paper.runAuthor()) {
                  let var5188 = Zotero.isMac ? encodeURIComponent(var5187.getFilePath()) : var5187.getFilePath();
                  Zotero.launchFileWithApplication('' + var5179 + var5188, var5178);
                  Zotero.AI4Paper.copy2Clipboard('' + var5179 + var5188);
                  return;
                }
              }
            } else {
              continue;
            }
          }
        }
        if (var5183.isAttachment()) {
          if (var5183.attachmentContentType == "application/pdf" || var5183.attachmentContentType == 'application/epub+zip') {
            if (var5178) {
              if (Zotero.AI4Paper.runAuthor()) {
                let var5189 = Zotero.isMac ? encodeURIComponent(var5183.getFilePath()) : var5183.getFilePath();
                Zotero.launchFileWithApplication('' + var5179 + var5189, var5178);
                Zotero.AI4Paper.copy2Clipboard('' + var5179 + var5189);
              }
            }
          }
        }
      }
    }
  },
  'openUniversalImmersiveTranslate': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    var var5190 = Zotero.Prefs.get("ai4paper.browserPath4ImmersiveTranslate2nd");
    if (!var5190) {
      return window.alert('请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20拓展\x20-->\x20Open\x20with\x20Browser】设定浏览器路径。'), false;
    }
    if (!(await OS.File.exists(var5190))) return window.alert("您设定的浏览器应用不存在！"), false;
    let var5191 = Zotero.Prefs.get("ai4paper.immersiveTranslatePlan") === '免费版' ? "https://app.immersivetranslate.com/file/" : "https://app.immersivetranslate.com/pdf-pro/",
      var5192 = Zotero_Tabs._selectedID;
    var var5193 = Zotero.Reader.getByTabID(var5192);
    if (var5193) {
      let _0x2c24d4 = var5193.itemID;
      var var5195 = Zotero.Items.get(_0x2c24d4);
      if (var5195.isAttachment()) {
        if (var5195.attachmentContentType == "application/pdf" || var5195.attachmentContentType == "application/epub+zip") {
          if (var5190) {
            return Zotero.AI4Paper.runAuthor() && (Zotero.launchFileWithApplication(var5191, var5190), Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.openImmersiveTranslate_getPath(var5195))), false;
          }
        }
      }
    } else {
      var var5195 = ZoteroPane.getSelectedItems()[0x0];
      if (var5195 && !var5195.isNote()) {
        if (var5195.isRegularItem()) {
          let var5196 = var5195.getAttachments();
          for (let var5197 of var5196) {
            let _0x38b70f = Zotero.Items.get(var5197);
            if (_0x38b70f.attachmentContentType == "application/pdf" || _0x38b70f.attachmentContentType == 'application/epub+zip') {
              if (var5190) {
                if (Zotero.AI4Paper.runAuthor()) {
                  Zotero.launchFileWithApplication(var5191, var5190);
                  Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.openImmersiveTranslate_getPath(_0x38b70f));
                  return;
                }
              }
            } else {
              continue;
            }
          }
        }
        if (var5195.isAttachment()) {
          (var5195.attachmentContentType == "application/pdf" || var5195.attachmentContentType == "application/epub+zip") && var5190 && Zotero.AI4Paper.runAuthor() && (Zotero.launchFileWithApplication(var5191, var5190), Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.openImmersiveTranslate_getPath(var5195)));
        }
      }
    }
  },
  'openImmersiveTranslate_getPath': function (param1010) {
    let var5199 = param1010.getFilePath();
    if (Zotero.isMac) {
      return var5199;
    } else {
      let var5200 = var5199.lastIndexOf('\x5c');
      return var5199.substring(0x0, var5200);
    }
  },
});
