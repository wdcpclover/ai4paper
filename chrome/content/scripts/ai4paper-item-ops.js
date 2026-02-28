// ai4paper-item-ops.js - Item operations, files history, workspace, attachments, export module
// Extracted from ai4paper.js (Phase 16)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Image Operations (PicGo, save, copy, upload) ===
  'getTargetPath': async function () {
    var {
        FilePicker: _0x6a4a8c
      } = ChromeUtils.importESModule('chrome://zotero/content/modules/filePicker.mjs'),
      var1257 = new _0x6a4a8c();
    var1257.init(window, "选择图片导出路径", var1257.modeGetFolder);
    var1257.appendFilters(var1257.filterAll);
    if ((await var1257.show()) != var1257.returnOK) {
      return false;
    }
    var var1258 = PathUtils.normalize(var1257.file);
    return var1258;
  },
  'saveImageToTargetPath': async function (param110, param111, param112) {
    try {
      let _0x2d5ca2 = '图片';
      if (param112) {
        _0x2d5ca2 = param112 + ".png";
      } else {
        _0x2d5ca2 = Zotero.getString('fileTypes.image').toLowerCase() + '.png';
      }
      let _0x57127d;
      Zotero.isWin ? _0x57127d = param111 + '\x5c' + _0x2d5ca2 : _0x57127d = param111 + '/' + _0x2d5ca2;
      let _0x56eb95 = param110.split(',');
      if (_0x56eb95[0x0].includes("base64")) {
        let var1262 = atob(_0x56eb95[0x1]),
          var1263 = var1262.length,
          var1264 = new Uint8Array(var1263);
        while (var1263--) {
          var1264[var1263] = var1262.charCodeAt(var1263);
        }
        await OS.File.writeAtomic(_0x57127d, var1264);
      }
    } catch (_0x1e48d1) {
      Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 导出图片出错啦", Zotero.getString(_0x1e48d1));
    }
  },
  'saveImage': async function (param113, param114) {
    try {
      var {
        FilePicker: _0x3db420
      } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
      let var1265 = new _0x3db420();
      var1265.init(window, Zotero.getString('pdfReader.saveImageAs'), var1265.modeSave);
      var1265.appendFilter("PNG", "*.png");
      let var1266 = '图片';
      if (param114) {
        var1266 = param114 + ".png";
      } else var1266 = Zotero.getString("fileTypes.image").toLowerCase() + ".png";
      var1265.defaultString = var1266;
      let var1267 = await var1265.show();
      if (var1267 === var1265.returnOK || var1267 === var1265.returnReplace) {
        let var1268 = var1265.file,
          var1269 = param113.split(',');
        if (var1269[0x0].includes('base64')) {
          let var1270 = atob(var1269[0x1]),
            var1271 = var1270.length,
            var1272 = new Uint8Array(var1271);
          while (var1271--) {
            var1272[var1271] = var1270.charCodeAt(var1271);
          }
          await OS.File.writeAtomic(var1268, var1272);
        }
      }
    } catch (_0x4f6fc8) {
      Zotero.AI4Paper.showProgressWindow(Zotero.getString(_0x4f6fc8));
    }
  },
  'copyImage': async function (param115) {
    let var1273 = param115.split(',');
    if (!var1273[0x0].includes("base64")) return;
    let var1274 = var1273[0x0].match(/:(.*?);/)[0x1],
      var1275 = atob(var1273[0x1]),
      var1276 = var1275.length,
      var1277 = new Uint8Array(var1276);
    while (var1276--) {
      var1277[var1276] = var1275.charCodeAt(var1276);
    }
    let var1278 = Components.classes['@mozilla.org/image/tools;1'].getService(Components.interfaces.imgITools),
      var1279 = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable),
      var1280 = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard),
      var1281 = var1278.decodeImageFromArrayBuffer(var1277.buffer, var1274);
    var1279.init(null);
    let var1282 = 'application/x-moz-nativeimage';
    var1279.addDataFlavor(var1282);
    var1279.setTransferData(var1282, var1281);
    var1280.setData(var1279, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
  },
  'onAnnotationImage': async function (param116, param117) {
    var var1283;
    let var1284 = Zotero.Prefs.get("extensions.zotero.dataDir", true),
      var1285 = Zotero.AI4Paper.checkGroupLibItem(param116.parentItem.parentItem);
    if (var1285) {
      var1283 = var1284 + '\x5ccache\x5cgroups\x5c' + var1285 + '\x5c' + param117 + ".png";
      if (Zotero.isMac || Zotero.isLinux) {
        var1283 = var1284 + "/cache/groups/" + var1285 + '/' + param117 + ".png";
      }
    } else {
      var1283 = var1284 + "\\cache\\library\\" + param117 + ".png";
      (Zotero.isMac || Zotero.isLinux) && (var1283 = var1284 + '/cache/library/' + param117 + ".png");
    }
    let var1286 = '' + param116.annotationComment;
    if (var1286.indexOf('![](') != -0x1) {
      return false;
    }
    let var1287 = 0x0;
    while (!(await OS.File.exists(var1283))) {
      if (var1287 >= 0x258) {
        Zotero.debug("AI4Paper: Waiting for image failed");
        Zotero.AI4Paper.showProgressWindow(0x4e20, "❌ 捕获图片失败 【PicGo】", "【可能原因】：Zotero 响应延迟，或者本图片同步自另一台设备的 Zotero。\n【可能措施】：您可以删除当前框选图片，并重新框选！或者搭配【上传图片】注释按钮。", "picgo");
        return;
      }
      await Zotero.Promise.delay(0xa);
      var1287++;
    }
    let var1288 = await Zotero.File.getBinaryContentsAsync(var1283),
      var1289 = "data:image/png;base64," + btoa(var1288),
      var1290 = Zotero_Tabs._selectedID,
      var1291 = Zotero.Reader.getByTabID(var1290);
    if (!var1291) return false;
    Zotero.Prefs.get("ai4paper.annotationimageactions") === "自动拷贝图片" && Zotero.AI4Paper.copyImage(var1289);
    var1286.indexOf('![](') === -0x1 && Zotero.Prefs.get('ai4paper.annotationimageactions') === "自动通过 PicGo 上传至图床" && Zotero.AI4Paper.uploadByPicGo(param116, var1283);
  },
  'uploadByPicGo': async function (param118, param119) {
    var var1292 = {
        'list': [param119]
      },
      var1293 = new XMLHttpRequest(),
      var1294 = "http://127.0.0.1:36677/upload";
    var1293.open("POST", var1294, true);
    var1293.responseType = "json";
    var1293.setRequestHeader('Content-Type', "application/json");
    var1293.onreadystatechange = function () {
      if (!var1293.response.success) {
        Zotero.AI4Paper.showProgressWindow(0x4e20, '❌\x20图片上传失败\x20【PicGo】', var1293.response.success + "：上传失败！请检查网络或 PicGo 图床是否配置正确！", 'picgo');
      }
      var1293.readyState == 0x4 && var1293.status == 0xc8 && Zotero.AI4Paper.enhanceExtra() && var1293.response.success && (Zotero.AI4Paper.saveImageLinkCheck(param118, var1293.response.result), Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 图片上传成功 【AI4paper】", "成功上传框选图片至图床，并返回链接:\n![](" + var1293.response.result + ')', "picgo"));
    };
    var1293.send(JSON.stringify(var1292));
  },
  'saveImageLinkCheck': async function (param120, param121) {
    await Zotero.AI4Paper.saveImagePicgoMDLinK(param120, param121);
    await new Promise(_0x35b467 => setTimeout(_0x35b467, 0x64));
    let var1295 = '' + param120.annotationComment;
    if (var1295.indexOf("![](") === -0x1) {
      await Zotero.AI4Paper.saveImagePicgoMDLinK(param120, param121);
    }
  },
  'saveImagePicgoMDLinK': async function (param122, param123) {
    let var1296 = '' + param122.annotationComment,
      var1297 = "![](" + param123 + ')';
    if (var1296 === 'null') param122.annotationComment = '' + var1297;else var1296 != "null" && var1296.indexOf("![](") === -0x1 && (param122.annotationComment = var1296 + '\x0a' + var1297);
    await param122.saveTx();
  },
  'getAnnotationImage': async function (param124, param125) {
    var var1298;
    let var1299 = Zotero.Prefs.get("extensions.zotero.dataDir", true),
      var1300 = Zotero.AI4Paper.checkGroupLibItem(param124.parentItem.parentItem);
    var1300 ? (var1298 = var1299 + "\\cache\\groups\\" + var1300 + '\x5c' + param125 + '.png', (Zotero.isMac || Zotero.isLinux) && (var1298 = var1299 + "/cache/groups/" + var1300 + '/' + param125 + ".png")) : (var1298 = var1299 + "\\cache\\library\\" + param125 + ".png", (Zotero.isMac || Zotero.isLinux) && (var1298 = var1299 + "/cache/library/" + param125 + ".png"));
    let var1301 = '' + param124.annotationComment;
    await new Promise(_0x4409a2 => setTimeout(_0x4409a2, 0x32));
    if (await OS.File.exists(var1298)) {
      Zotero.AI4Paper.uploadAnnotationImage(param124, var1298);
    } else Services.prompt.alert(window, "❌ 上传注释图片", "出错啦！未在本地找到注释图片！");
  },
  'uploadAnnotationImage': async function (param126, param127) {
    var var1302 = {
        'list': [param127]
      },
      var1303 = new XMLHttpRequest(),
      var1304 = "http://127.0.0.1:36677/upload";
    var1303.open('POST', var1304, true);
    var1303.responseType = "json";
    var1303.setRequestHeader("Content-Type", "application/json");
    var1303.onreadystatechange = function () {
      !var1303.response.success && Services.prompt.alert(window, "❌ 图片上传失败 【PicGo】", var1303.response.success + "：上传失败！请检查网络或 PicGo 图床是否配置正确！");
      var1303.readyState == 0x4 && var1303.status == 0xc8 && Zotero.AI4Paper.enhanceExtra() && var1303.response.success && (Zotero.AI4Paper.returnImagePicgoMDLinK(param126, var1303.response.result), Zotero.AI4Paper.showProgressWindow(0x1388, '✅\x20注释图片上传成功\x20【Zotero\x20One】', '成功上传注释图片至图床，并返回链接:\x0a![](' + var1303.response.result + ')', "picgo"));
    };
    var1303.send(JSON.stringify(var1302));
  },
  'returnImagePicgoMDLinK': async function (param128, param129) {
    let var1305 = '' + param128.annotationComment,
      var1306 = "![](" + param129 + ')';
    if (var1305 === 'null') param128.annotationComment = '' + var1306;else {
      if (var1305 != "null" && var1305.indexOf('![](') === -0x1) param128.annotationComment = var1305 + '\x0a' + var1306;else {
        if (var1305 != 'null' && var1305.indexOf('![](') != -0x1) {
          let _0x419143 = var1305.indexOf("![]("),
            _0x327e1b = var1305.substring(_0x419143),
            _0x35f70a = _0x327e1b.indexOf(')'),
            _0x53a4db = _0x327e1b.substring(0x4, _0x35f70a),
            _0x49337f = '',
            _0xe1dfca = '';
          _0x327e1b.length > _0x53a4db.length + 0x5 && (_0xe1dfca = _0x327e1b.substring(_0x53a4db.length + 0x5));
          _0x419143 != 0x0 && (_0x49337f = var1305.substring(0x0, _0x419143));
          param128.annotationComment = '' + _0x49337f + var1306 + _0xe1dfca;
        }
      }
    }
    await param128.saveTx();
  },

  // === Block B: Misc Item Utils ===
  'getItemTitleByDOI': async function (param663) {
    let var3625 = "https://api.crossref.org/works/" + param663,
      var3626;
    try {
      return var3626 = await Zotero.HTTP.request("GET", var3625, {
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify({}),
        'responseType': 'json'
      }), var3626.response.message.title[0x0];
    } catch (_0x64331e) {
      return window.alert(_0x64331e), false;
    }
  },
  'checkENZH': function (param718) {
    var var3806 = new RegExp("[一-龥]+");
    if (var3806.test(param718)) return 'zh';else {
      var var3807 = new RegExp('[A-Za-z]+');
      return var3807.test(param718) ? 'en' : "others";
    }
  },
  'getItemLink': function (param719) {
    let var3823 = Zotero.Libraries.get(param719.libraryID).libraryType;
    if (var3823 === "group") return "zotero://select/" + Zotero.URI.getLibraryPath(param719.libraryID) + "/items/" + param719.key;else {
      if (var3823 === "user") {
        let var3824 = 'library';
        return "zotero://select/library/items/" + param719.key;
      }
    }
    return undefined;
  },

  // === Block C: Files History + Workspace ===
  'getFilesHistoryItemInfo': function (param723, param724, param725, param726, param727) {
    let var3830 = param727 ? "📃 " : '',
      var3831 = '【' + param723 + '】' + var3830 + param724 + " ⏰ " + param725 + '\x20🆔\x20' + param726.key,
      var3832 = '【' + param723 + '】' + var3830 + param724 + '\x20🆔\x20' + param726.key;
    return {
      'info': var3831,
      'info1': var3832
    };
  },
  'findItemByIDORKey': function (param728) {
    let var3833;
    if (!isNaN(parseFloat(param728)) && isFinite(param728)) var3833 = Zotero.Items.get(param728);else {
      for (let var3834 of Zotero.Libraries.getAll().map(_0x5c6cd6 => _0x5c6cd6.libraryID)) {
        var3833 = Zotero.Items.getByLibraryAndKey(var3834, param728);
        if (var3833) {
          return var3833;
        }
        continue;
      }
    }
    return var3833;
  },
  'filesHistory': function (param729) {
    let var3835 = Zotero.Prefs.get("ai4paper.fileshistory"),
      var3836 = var3835.split('😊🎈🍓'),
      var3837 = new Date(),
      var3838 = var3837.toLocaleDateString(),
      var3839 = var3837.toLocaleTimeString("chinese", {
        'hour12': false
      }),
      var3840 = var3838 + '\x20' + var3839,
      var3841 = param729.parentItem;
    if (var3841 != undefined) {
      let _0x1f285b = var3841.getField("title"),
        _0x3b68ca = Zotero.AI4Paper.getItemLink(var3841),
        _0x2e2234 = '',
        _0xfa1d7e = var3841.getCollections();
      if (_0xfa1d7e.length != 0x0) {
        let var3846 = [];
        for (let var3847 of _0xfa1d7e) {
          let var3848 = Zotero.Collections.get(var3847);
          var3846.push(var3848.name);
        }
        _0x2e2234 = var3846.join(',\x20');
      } else _0x2e2234 = '未分类';
      let {
          info: _0x4342b7,
          info1: _0x593d38
        } = Zotero.AI4Paper.getFilesHistoryItemInfo(_0x2e2234, _0x1f285b, var3840, var3841),
        _0x5c130e = var3836[0x0],
        _0x376620 = _0x5c130e.indexOf('⏰'),
        _0x3ffb7d = _0x5c130e.indexOf('🆔'),
        _0x2d403b = _0x5c130e.substring(0x0, _0x376620),
        _0x339764 = _0x5c130e.substring(_0x3ffb7d),
        _0x145d21 = '' + _0x2d403b + _0x339764;
      _0x593d38 != _0x145d21 && var3836.unshift(_0x4342b7);
    } else {
      if (param729.isRegularItem()) {
        let _0x165e19 = param729.getField("title"),
          _0x2e717d = Zotero.AI4Paper.getItemLink(param729),
          _0x13a472 = '',
          _0x17b980 = param729.getCollections();
        if (_0x17b980.length != 0x0) {
          let _0x5a75ab = [];
          for (let var3860 of _0x17b980) {
            let var3861 = Zotero.Collections.get(var3860);
            _0x5a75ab.push(var3861.name);
          }
          _0x13a472 = _0x5a75ab.join(',\x20');
        } else _0x13a472 = "未分类";
        let {
            info: _0x373baf,
            info1: _0xf8c93
          } = Zotero.AI4Paper.getFilesHistoryItemInfo(_0x13a472, _0x165e19, var3840, param729),
          _0x1ebd8f = var3836[0x0],
          _0xe68004 = _0x1ebd8f.indexOf('⏰'),
          _0x5488b5 = _0x1ebd8f.indexOf('🆔'),
          _0x543be6 = _0x1ebd8f.substring(0x0, _0xe68004),
          _0x4d67b8 = _0x1ebd8f.substring(_0x5488b5),
          _0x236102 = '' + _0x543be6 + _0x4d67b8;
        _0xf8c93 != _0x236102 && var3836.unshift(_0x373baf);
      } else {
        if (param729.isAttachment()) {
          let var3868 = param729.getField("title"),
            var3869 = Zotero.AI4Paper.getItemLink(param729),
            var3870 = '',
            var3871 = param729.getCollections();
          if (var3871.length != 0x0) {
            let var3872 = [];
            for (let var3873 of var3871) {
              let var3874 = Zotero.Collections.get(var3873);
              var3872.push(var3874.name);
            }
            var3870 = var3872.join(',\x20');
          } else var3870 = "未分类";
          let {
              info: _0x1a9176,
              info1: _0x39d462
            } = Zotero.AI4Paper.getFilesHistoryItemInfo(var3870, var3868, var3840, param729, true),
            var3875 = var3836[0x0],
            var3876 = var3875.indexOf('⏰'),
            var3877 = var3875.indexOf('🆔'),
            var3878 = var3875.substring(0x0, var3876),
            var3879 = var3875.substring(var3877),
            var3880 = '' + var3878 + var3879;
          if (_0x39d462 != var3880) {
            var3836.unshift(_0x1a9176);
          }
        }
      }
    }
    let var3881 = Zotero.AI4Paper.letDOI(),
      var3882 = [];
    for (let var3883 = 0x0; var3883 < 0x3e8; var3883++) {
      var3836[var3883] != undefined && var3882.push(var3836[var3883]);
    }
    var3881 && Zotero.Prefs.set('ai4paper.fileshistory', var3882.join("😊🎈🍓"));
  },
  'openWorkSpaceWindow': function () {
    Zotero.AI4Paper._data_useWorkSpaceView = true;
    Zotero.AI4Paper.openDialog_filesHistory();
  },
  'openDialog_filesHistory': function () {
    Zotero.AI4Paper.openDialogByType("filesHistory");
  },
  'go2FilesHistoryItem': async function (param730) {
    if (param730.indexOf('🆔') != -0x1) {
      let var3884 = param730.indexOf('🆔'),
        var3885 = param730.substring(var3884 + 0x3),
        var3886 = Zotero.AI4Paper.findItemByIDORKey(var3885);
      if (!var3886) {
        window.alert("未查询到该文献，可能已经被您删除！");
        return;
      }
      Zotero.AI4Paper.showDate() && Zotero.AI4Paper.showItemInCollection(var3886);
    }
  },
  'openFilesHistoryItem': async function (param731) {
    for (let var3887 of param731) {
      if (var3887.indexOf('🆔') != -0x1) {
        let _0xc64517 = var3887.indexOf('🆔'),
          _0xeaf68f = var3887.substring(_0xc64517 + 0x3),
          _0x37a704 = Zotero.AI4Paper.findItemByIDORKey(_0xeaf68f);
        if (!_0x37a704) {
          return Zotero.AI4Paper.showProgressWindow(0xbb8, "【AI4paper】最近打开", "❌ 未查询到该文献，可能已经被您删除！"), false;
        }
        if (_0x37a704.isRegularItem()) {
          let var3891 = await _0x37a704.getBestAttachment();
          if (!var3891) {
            Zotero.AI4Paper.showProgressWindow(0xbb8, "【AI4paper】最近打开", "❌ 该条目无附件可打开！");
            return;
          }
          Zotero.Reader.open(var3891.id, null, {
            'openInWindow': false
          });
        } else {
          if (_0x37a704.isAttachment) {
            if (["application/pdf", "text/html", "application/epub+zip"].includes(_0x37a704.attachmentContentType)) {
              if (_0x37a704.attachmentLinkMode === 0x3) return;
              Zotero.Reader.open(_0x37a704.id, null, {
                'openInWindow': false
              });
            } else Zotero.AI4Paper.showProgressWindow(0xbb8, '【Zotero\x20One】最近打开', "❌ 该条目非【PDF/Epub/网页快照】类型附件，无法打开！");
          }
        }
      }
    }
  },
  'getBeforeDate': function (param732) {
    const var3892 = param732,
      var3893 = new Date();
    let var3894 = var3893.getFullYear(),
      var3895 = var3893.getMonth() + 0x1,
      var3896 = var3893.getDate();
    if (var3896 <= var3892) {
      if (var3895 > 0x1) {
        var3895 = var3895 - 0x1;
      } else {
        var3894 = var3894 - 0x1;
        var3895 = 0xc;
      }
    }
    var3893.setDate(var3893.getDate() - var3892);
    var3894 = var3893.getFullYear();
    var3895 = var3893.getMonth() + 0x1;
    var3896 = var3893.getDate();
    const var3897 = var3894 + '/' + var3895 + '/' + var3896;
    return var3897;
  },
  'dateDiff': function (param733, param734) {
    var var3898 = (new Date(param733) - new Date(param734)) / 0x3e8,
      var3899 = parseInt(var3898 / 0x15180);
    if (var3899 >= 0x0) {
      return true;
    } else {
      return false;
    }
  },
  'getFilesHistory': function () {
    let var3900 = Zotero.Prefs.get('ai4paper.fileshistory'),
      var3901 = var3900.split('😊🎈🍓'),
      var3902 = [];
    for (let var3903 = 0x0; var3903 < var3901.length; var3903++) {
      var3901[var3903] != '' && var3902.push('[' + (var3903 + 0x1) + ']\x20' + var3901[var3903]);
    }
    return var3902;
  },
  'getFilesHistoryToday': function () {
    let var3904 = Zotero.Prefs.get("ai4paper.fileshistory"),
      var3905 = Zotero.AI4Paper.getBeforeDate(0x0);
    var var3906 = [];
    let var3907 = var3904.split("😊🎈🍓"),
      var3908 = [],
      var3909 = [];
    for (let var3910 = 0x0; var3910 < var3907.length; var3910++) {
      var3907[var3910] != '' && var3908.push(var3907[var3910]);
    }
    for (let var3911 = 0x0; var3911 < var3908.length; var3911++) {
      let var3912 = var3908[var3911].indexOf('⏰'),
        var3913 = var3908[var3911].indexOf('🆔'),
        var3914 = var3908[var3911].substring(var3912 + 0x2, var3913 - 0x1);
      var3914 = var3914.substring(0x0, var3914.indexOf('\x20'));
      if (Zotero.AI4Paper.dateDiff(var3914, var3905)) {
        var3909.push(var3908[var3911]);
      }
    }
    for (let var3915 = 0x0; var3915 < var3909.length; var3915++) {
      var3906.push('[' + (var3915 + 0x1) + ']\x20' + var3909[var3915]);
    }
    return var3906;
  },
  'getFilesHistoryLastDay': function () {
    let var3916 = Zotero.Prefs.get("ai4paper.fileshistory"),
      var3917 = Zotero.AI4Paper.getBeforeDate(0x1);
    var var3918 = [];
    let var3919 = var3916.split('😊🎈🍓'),
      var3920 = [],
      var3921 = [];
    for (let var3922 = 0x0; var3922 < var3919.length; var3922++) {
      var3919[var3922] != '' && var3920.push(var3919[var3922]);
    }
    for (let var3923 = 0x0; var3923 < var3920.length; var3923++) {
      let _0x46269f = var3920[var3923].indexOf('⏰'),
        _0x280876 = var3920[var3923].indexOf('🆔'),
        _0x50af5d = var3920[var3923].substring(_0x46269f + 0x2, _0x280876 - 0x1);
      _0x50af5d = _0x50af5d.substring(0x0, _0x50af5d.indexOf('\x20'));
      Zotero.AI4Paper.dateDiff(_0x50af5d, var3917) && var3921.push(var3920[var3923]);
    }
    for (let var3927 = 0x0; var3927 < var3921.length; var3927++) {
      var3918.push('[' + (var3927 + 0x1) + ']\x20' + var3921[var3927]);
    }
    return var3918;
  },
  'getFilesHistoryLastWeek': function () {
    let var3928 = Zotero.Prefs.get("ai4paper.fileshistory"),
      var3929 = Zotero.AI4Paper.getBeforeDate(0x7);
    var var3930 = [];
    let var3931 = var3928.split("😊🎈🍓"),
      var3932 = [],
      var3933 = [];
    for (let var3934 = 0x0; var3934 < var3931.length; var3934++) {
      var3931[var3934] != '' && var3932.push(var3931[var3934]);
    }
    for (let var3935 = 0x0; var3935 < var3932.length; var3935++) {
      let var3936 = var3932[var3935].indexOf('⏰'),
        var3937 = var3932[var3935].indexOf('🆔'),
        var3938 = var3932[var3935].substring(var3936 + 0x2, var3937 - 0x1);
      var3938 = var3938.substring(0x0, var3938.indexOf('\x20'));
      if (Zotero.AI4Paper.dateDiff(var3938, var3929)) {
        var3933.push(var3932[var3935]);
      }
    }
    for (let var3939 = 0x0; var3939 < var3933.length; var3939++) {
      var3930.push('[' + (var3939 + 0x1) + ']\x20' + var3933[var3939]);
    }
    return var3930;
  },
  'getFilesHistoryLastMonth': function () {
    let var3940 = Zotero.Prefs.get("ai4paper.fileshistory"),
      var3941 = Zotero.AI4Paper.getBeforeDate(0x1e);
    var var3942 = [];
    let var3943 = var3940.split('😊🎈🍓'),
      var3944 = [],
      var3945 = [];
    for (let var3946 = 0x0; var3946 < var3943.length; var3946++) {
      var3943[var3946] != '' && var3944.push(var3943[var3946]);
    }
    for (let var3947 = 0x0; var3947 < var3944.length; var3947++) {
      let var3948 = var3944[var3947].indexOf('⏰'),
        var3949 = var3944[var3947].indexOf('🆔'),
        var3950 = var3944[var3947].substring(var3948 + 0x2, var3949 - 0x1);
      var3950 = var3950.substring(0x0, var3950.indexOf('\x20'));
      Zotero.AI4Paper.dateDiff(var3950, var3941) && var3945.push(var3944[var3947]);
    }
    for (let var3951 = 0x0; var3951 < var3945.length; var3951++) {
      var3942.push('[' + (var3951 + 0x1) + ']\x20' + var3945[var3951]);
    }
    return var3942;
  },
  'getFilesHistorySearch': function (param735) {
    let var3952 = Zotero.Prefs.get("ai4paper.fileshistory"),
      var3953 = var3952.split("😊🎈🍓"),
      var3954 = [];
    for (let var3955 = 0x0; var3955 < var3953.length; var3955++) {
      var3953[var3955] != '' && var3954.push('[' + (var3955 + 0x1) + ']\x20' + var3953[var3955]);
    }
    var var3956 = [];
    for (let var3957 of var3954) {
      if (var3957.indexOf('🆔') != -0x1) {
        let var3958 = var3957.indexOf('🆔'),
          var3959 = var3957.substring(var3958 + 0x3),
          var3960 = Zotero.AI4Paper.findItemByIDORKey(var3959);
        if (var3960) try {
          let var3961 = var3960.getField("title").toLowerCase();
          var3961.indexOf(param735.toLowerCase()) != -0x1 && var3956.push(var3957);
        } catch (_0x359933) {}
      }
    }
    return var3956;
  },
  'openDialog_setWorkSpaceName': function (param736, param737) {
    var var3962 = {
        'action': param736,
        'dataIn': param737,
        'dataOut': null
      },
      var3963 = window.openDialog("chrome://ai4paper/content/selectionDialog/setWorkSpaceName.xhtml", "_blank", "chrome,modal,centerscreen,resizable=yes", var3962);
    return var3962.dataOut;
  },
  'createTabsAsWorkSpace': function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let var3964 = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(_0x444b48 => _0x444b48.id != "zotero-pane"),
      var3965 = var3964.map(_0x13809e => _0x13809e.data.itemID);
    if (!var3965.length) return window.alert("未打开任何文献（即标签页）！"), false;
    let var3966 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      var3967 = Object.values(var3966).map(_0x721747 => _0x721747.workSpaceName),
      var3968 = Zotero.AI4Paper.openDialog_setWorkSpaceName("add", var3965.length);
    if (!var3968) {
      return;
    }
    if (var3967.includes(var3968)) {
      window.alert("您输入的【" + var3968 + '】与现有工作区名称重复，请重新输入！');
      return;
    }
    let var3969 = [];
    for (let var3970 of var3965) {
      let var3971 = Zotero.Items.get(var3970);
      var3971 && var3969.push(var3971.key);
    }
    let var3972 = {
      'workSpaceName': var3968,
      'workSpaceItemsKey': var3969
    };
    return var3966.push(var3972), Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(var3966)), var3966;
  },
  'renameWorkSpace': function (param738) {
    let var3973 = Zotero.AI4Paper.openDialog_setWorkSpaceName("rename", param738);
    if (!var3973.trim()) return window.alert("不允许为空值！已停止重命名。"), false;else {
      if (var3973.trim() === param738) {
        return window.alert('两次名称相同！'), false;
      } else {
        let _0x386079 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")).map(_0xde3615 => _0xde3615.workSpaceName);
        if (_0x386079.includes(var3973)) return window.alert("您输入的【" + var3973 + "】与现有工作区名称重复，请重新输入！"), false;
      }
    }
    let var3975 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let var3976 = 0x0; var3976 < var3975.length; var3976++) {
      if (var3975[var3976].workSpaceName === param738) return var3975[var3976].workSpaceName = var3973, Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(var3975)), var3973;
    }
    return false;
  },
  'setTopWorkSpace': function (param739) {
    let var3977 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let var3978 = 0x0; var3978 < var3977.length; var3978++) {
      if (var3977[var3978].workSpaceName === param739) {
        const _0x2921fb = var3977[var3978];
        return var3977.splice(var3978, 0x1), var3977.unshift(_0x2921fb), Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(var3977)), param739;
      }
    }
    return false;
  },
  'moveUpWorkSpace': function (param740) {
    let var3980 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let var3981 = 0x0; var3981 < var3980.length; var3981++) {
      if (var3980[var3981].workSpaceName === param740) {
        if (var3981 === 0x0) {
          const _0x41d5f9 = var3980.shift();
          var3980.push(_0x41d5f9);
        } else [var3980[var3981 - 0x1], var3980[var3981]] = [var3980[var3981], var3980[var3981 - 0x1]];
        return Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(var3980)), param740;
      }
    }
    return false;
  },
  'moveDownWorkSpace': function (param741) {
    let var3983 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let var3984 = 0x0; var3984 < var3983.length; var3984++) {
      if (var3983[var3984].workSpaceName === param741) {
        if (var3984 === var3983.length - 0x1) {
          const var3985 = var3983.pop();
          var3983.unshift(var3985);
        } else [var3983[var3984], var3983[var3984 + 0x1]] = [var3983[var3984 + 0x1], var3983[var3984]];
        return Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(var3983)), param741;
      }
    }
    return false;
  },
  'setTopWorkSpaceItem': function (param742, param743) {
    let var3986 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let var3987 = 0x0; var3987 < var3986.length; var3987++) {
      if (var3986[var3987].workSpaceName === param742) {
        for (let var3988 = 0x0; var3988 < var3986[var3987].workSpaceItemsKey.length; var3988++) {
          if (var3986[var3987].workSpaceItemsKey[var3988] === param743) return var3986[var3987].workSpaceItemsKey.splice(var3988, 0x1), var3986[var3987].workSpaceItemsKey.unshift(param743), Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(var3986)), param742;
        }
      }
    }
    return false;
  },
  'moveUpWorkSpaceItem': function (param744, param745) {
    let var3989 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let var3990 = 0x0; var3990 < var3989.length; var3990++) {
      if (var3989[var3990].workSpaceName === param744) {
        for (let var3991 = 0x0; var3991 < var3989[var3990].workSpaceItemsKey.length; var3991++) {
          if (var3989[var3990].workSpaceItemsKey[var3991] === param745) {
            return var3991 === 0x0 ? (var3989[var3990].workSpaceItemsKey.shift(), var3989[var3990].workSpaceItemsKey.push(param745)) : [var3989[var3990].workSpaceItemsKey[var3991 - 0x1], var3989[var3990].workSpaceItemsKey[var3991]] = [var3989[var3990].workSpaceItemsKey[var3991], var3989[var3990].workSpaceItemsKey[var3991 - 0x1]], Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(var3989)), param744;
          }
        }
      }
    }
    return false;
  },
  'moveDownWorkSpaceItem': function (param746, param747) {
    let var3992 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let var3993 = 0x0; var3993 < var3992.length; var3993++) {
      if (var3992[var3993].workSpaceName === param746) for (let var3994 = 0x0; var3994 < var3992[var3993].workSpaceItemsKey.length; var3994++) {
        if (var3992[var3993].workSpaceItemsKey[var3994] === param747) {
          return var3994 === var3992[var3993].workSpaceItemsKey.length - 0x1 ? (var3992[var3993].workSpaceItemsKey.pop(), var3992[var3993].workSpaceItemsKey.unshift(param747)) : [var3992[var3993].workSpaceItemsKey[var3994], var3992[var3993].workSpaceItemsKey[var3994 + 0x1]] = [var3992[var3993].workSpaceItemsKey[var3994 + 0x1], var3992[var3993].workSpaceItemsKey[var3994]], Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(var3992)), param746;
        }
      }
    }
    return false;
  },
  'addCurrentTab2WorkSpace': function (param748) {
    let var3995 = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(_0x24b4c3 => _0x24b4c3.id != "zotero-pane" && _0x24b4c3.id === Zotero_Tabs._selectedID);
    if (!var3995.length) {
      return window.alert("请切换至目标文献的标签页！"), false;
    }
    let var3996,
      var3997 = var3995[0x0].data.itemID,
      var3998 = Zotero.Items.get(var3997);
    if (var3998) var3996 = var3998.key;else return window.alert('条目不存在！'), false;
    let var3999 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let var4000 = 0x0; var4000 < var3999.length; var4000++) {
      if (var3999[var4000].workSpaceName === param748) {
        let var4001 = var3999[var4000].workSpaceItemsKey;
        if (var4001.includes(var3996)) {
          return window.alert("❌ 当前工作区已存在该文献，无须重复添加！"), false;
        }
        return var4001.push(var3996), var3999[var4000].workSpaceItemsKey = var4001, Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(var3999)), param748;
      }
    }
    return false;
  },
  'addAllTabs2WorkSpace': function (param749) {
    let var4002 = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(_0x129168 => _0x129168.id != "zotero-pane"),
      var4003 = var4002.map(_0x2722d0 => _0x2722d0.data.itemID);
    if (!var4003.length) return window.alert("未打开任何文献（即标签页），无法添加！"), false;
    let var4004 = [];
    for (let var4005 of var4003) {
      let var4006 = Zotero.Items.get(var4005);
      var4006 && var4004.push(var4006.key);
    }
    let var4007 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let var4008 = 0x0; var4008 < var4007.length; var4008++) {
      if (var4007[var4008].workSpaceName === param749) {
        let var4009 = 0x0,
          var4010 = var4007[var4008].workSpaceItemsKey;
        for (let var4011 of var4004) {
          var4010.includes(var4011) ? var4009++ : var4010.push(var4011);
        }
        if (var4004.length === var4009) return window.alert('❌\x20所有标签页文献均已在工作区中，无须再添加！'), false;
        let var4012 = window.confirm("是否确认将所有【" + var4004.length + "】篇标签页文献添加至工作区【" + param749 + "】？（其中【" + var4009 + '】篇已存在工作区内）');
        if (var4012) return var4007[var4008].workSpaceItemsKey = var4010, Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(var4007)), param749;else {
          return false;
        }
      }
    }
    return false;
  },
  'removeItemFromWorkSpace': function (param750, param751) {
    let var4013 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let var4014 = 0x0; var4014 < var4013.length; var4014++) {
      if (var4013[var4014].workSpaceName === param750) {
        let _0xcae0d3 = var4013[var4014].workSpaceItemsKey;
        if (!_0xcae0d3.length) {
          return window.alert("当前工作区无文献！"), false;
        }
        let _0x1f8f3c = _0xcae0d3.indexOf(param751);
        if (_0x1f8f3c === -0x1) return;
        _0xcae0d3.splice(_0x1f8f3c, 0x1);
        let _0x19f456 = window.confirm("是否确认从工作区【" + param750 + "】移除当前文献？");
        if (_0x19f456) {
          return var4013[var4014].workSpaceItemsKey = _0xcae0d3, Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(var4013)), param750;
        } else return false;
      }
    }
    return false;
  },
  'removeSelectedItemsFromWorkSpace': function (param752, param753) {
    let var4018 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let var4019 = 0x0; var4019 < var4018.length; var4019++) {
      if (var4018[var4019].workSpaceName === param752) {
        let var4020 = var4018[var4019].workSpaceItemsKey;
        if (!var4020.length) return window.alert("当前工作区无文献！"), false;
        for (itemKey of param753) {
          let _0x2df9e1 = var4020.indexOf(itemKey);
          if (_0x2df9e1 === -0x1) return;
          var4020.splice(_0x2df9e1, 0x1);
        }
        let var4022 = window.confirm("是否确认从工作区【" + param752 + "】移除选中的【" + param753.length + '】篇文献？');
        if (var4022) {
          return var4018[var4019].workSpaceItemsKey = var4020, Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(var4018)), param752;
        } else return false;
      }
    }
    return false;
  },
  'removeAllItemsFromWorkSpace': function (param754) {
    let var4023 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let var4024 = 0x0; var4024 < var4023.length; var4024++) {
      if (var4023[var4024].workSpaceName === param754) {
        if (!var4023[var4024].workSpaceItemsKey.length) {
          return window.alert("❌ 工作区【" + param754 + '】已经为空！'), false;
        }
        let var4025 = window.confirm("是否确认清空工作区【" + param754 + "】内的全部【" + var4023[var4024].workSpaceItemsKey.length + "】篇文献？👉一旦清空，将无法恢复。👈");
        if (var4025) {
          return var4023[var4024].workSpaceItemsKey = [], Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(var4023)), param754;
        } else {
          return false;
        }
      }
    }
    return false;
  },
  'replaceWorkSpaceItems': function (param755) {
    let var4026 = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(_0x549666 => _0x549666.id != "zotero-pane"),
      var4027 = var4026.map(_0x17a150 => _0x17a150.data.itemID);
    if (!var4027.length) return window.alert("未打开任何文献（即标签页），无法替换！"), false;
    let var4028 = [];
    for (let var4029 of var4027) {
      let _0xbada66 = Zotero.Items.get(var4029);
      _0xbada66 && var4028.push(_0xbada66.key);
    }
    let var4031 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let var4032 = 0x0; var4032 < var4031.length; var4032++) {
      if (var4031[var4032].workSpaceName === param755) {
        let var4033 = window.confirm("是否确认将当前打开的【" + var4028.length + "】篇文献替换【" + param755 + '】工作区内的全部文献？');
        if (var4033) return var4031[var4032].workSpaceItemsKey = var4028, Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(var4031)), param755;else {
          return false;
        }
      }
    }
    return false;
  },
  'deleteWorkSpace': function (param756) {
    let var4034 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let var4035 = 0x0; var4035 < var4034.length; var4035++) {
      if (var4034[var4035].workSpaceName === param756) {
        return var4034.splice(var4035, 0x1), Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(var4034)), true;
      }
    }
    return false;
  },
  'copyWorkSpaceSummary': function (param757) {
    let var4036 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      var4037 = null;
    for (let var4038 of var4036) {
      if (var4038.workSpaceName === param757) {
        var4037 = var4038;
      }
    }
    let var4039 = [];
    if (var4037) {
      let _0x352d02 = var4037.workSpaceItemsKey,
        _0x23c141 = 0x1;
      for (let var4042 of _0x352d02) {
        for (let var4043 of Zotero.Libraries.getAll().map(_0xc42bdf => _0xc42bdf.libraryID)) {
          let var4044 = Zotero.Items.getByLibraryAndKey(var4043, var4042);
          var4044 && (var4039.push("- [" + _0x23c141 + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(var4044) + '】' + var4044.getField("title") + " 🆔 " + var4044.key), _0x23c141++);
        }
      }
      Zotero.AI4Paper.copy2Clipboard("## 工作区【" + param757 + '】共有【' + var4039.length + '】篇文献\x0a\x0a' + var4039.join('\x0a'));
      Zotero.AI4Paper.showProgressWindow(0xbb8, "拷贝工作区概要【AI4paper】", '✅\x20工作区【' + param757 + "】概要已拷贝，共【" + var4039.length + "】篇文献！");
    } else window.alert('工作区【' + param757 + "】内无文献！");
    return var4039;
  },
  'copyAllWorkSpacesSummary': function () {
    let var4045 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      var4046 = [];
    for (let var4047 of var4045) {
      let _0x27dbcb = [],
        _0x3398ed = var4047.workSpaceItemsKey,
        _0x371dfb = 0x1;
      for (let var4051 of _0x3398ed) {
        for (let var4052 of Zotero.Libraries.getAll().map(_0x538779 => _0x538779.libraryID)) {
          let _0x2519b3 = Zotero.Items.getByLibraryAndKey(var4052, var4051);
          _0x2519b3 && (_0x27dbcb.push("- [" + _0x371dfb + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(_0x2519b3) + '】' + _0x2519b3.getField('title') + " 🆔 " + _0x2519b3.key), _0x371dfb++);
        }
      }
      _0x27dbcb.length && var4046.push("## 工作区【" + var4047.workSpaceName + "】共有【" + _0x27dbcb.length + "】篇文献\n\n" + _0x27dbcb.join('\x0a'));
    }
    if (var4046.length) {
      Zotero.AI4Paper.copy2Clipboard('' + var4046.join("\n\n\n"));
      Zotero.AI4Paper.showProgressWindow(0xbb8, "拷贝全部工作区概要【AI4paper】", "✅ 已拷贝全部【" + var4046.length + "】个工作区的概要！");
    } else {
      window.alert("未获取到工作区数据！");
    }
    return var4046;
  },
  'getWorkSpaceItemsInfo': function (param758) {
    let var4054 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      var4055 = null;
    for (let var4056 of var4054) {
      var4056.workSpaceName === param758 && (var4055 = var4056);
    }
    let var4057 = [];
    if (var4055) {
      let var4058 = var4055.workSpaceItemsKey,
        var4059 = 0x1;
      for (let var4060 of var4058) {
        for (let var4061 of Zotero.Libraries.getAll().map(_0x5d3a45 => _0x5d3a45.libraryID)) {
          let var4062 = Zotero.Items.getByLibraryAndKey(var4061, var4060);
          var4062 && (var4057.push('[' + var4059 + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(var4062) + '】' + var4062.getField("title") + " 🆔 " + var4062.key), var4059++);
        }
      }
    }
    return var4057;
  },
  'searchWorkSpaceItems': function (param759, param760) {
    let var4063 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      var4064 = null;
    for (let var4065 of var4063) {
      var4065.workSpaceName === param759 && (var4064 = var4065);
    }
    let var4066 = [];
    if (var4064) {
      let var4067 = var4064.workSpaceItemsKey,
        var4068 = 0x1;
      for (let var4069 of var4067) {
        for (let var4070 of Zotero.Libraries.getAll().map(_0x50839b => _0x50839b.libraryID)) {
          let var4071 = Zotero.Items.getByLibraryAndKey(var4070, var4069);
          if (var4071) {
            let _0x1c4222 = var4071.getField("title").toLowerCase();
            _0x1c4222.indexOf(param760.toLowerCase()) != -0x1 && (var4066.push('[' + var4068 + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(var4071) + '】' + var4071.getField("title") + " 🆔 " + var4071.key), var4068++);
          }
        }
      }
    }
    return var4066;
  },

  // === Block D: File/Attachment Operations ===
  'showFile': async function () {
    async function fn16(param762) {
      if (param762.isAttachment()) {
        if (param762.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) return false;
        return param762;
      } else return await param762.getBestAttachment();
    }
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    var var4078 = Zotero.Reader.getByTabID(Zotero_Tabs._selectedID);
    if (var4078) {
      let var4079 = var4078.itemID;
      var var4080 = Zotero.Items.get(var4079);
      var4080.isAttachment() && ZoteroPane_Local.showAttachmentInFilesystem(var4080.id);
    } else {
      var var4081 = ZoteroPane.getSelectedItems();
      for (let var4082 of var4081) {
        var var4080 = await fn16(var4082);
        var4080 && ZoteroPane_Local.showAttachmentInFilesystem(var4080.id);
      }
    }
  },
  'attachNewFile': async function () {
    function fn17(param763) {
      var var4083 = Zotero.File.pathToFile(param763),
        var4084 = Zotero.Prefs.get("ai4paper.fileTypes").split(',').map(_0x2a2485 => _0x2a2485.trim().toLowerCase()),
        var4085 = var4083.directoryEntries,
        var4086 = {
          'lastModifiedTime': 0x0
        };
      while (var4085.hasMoreElements()) {
        var var4087 = var4085.getNext().QueryInterface(Components.interfaces.nsIFile),
          var4088 = fn18(var4087.leafName).toLowerCase();
        if (var4087.isDirectory() || var4087.isHidden() || !var4084.includes(var4088)) continue;
        if (var4087.isFile() && var4087.lastModifiedTime > var4086.lastModifiedTime) var4086 = var4087;
      }
      return var4086.lastModifiedTime == 0x0 ? undefined : var4086.path;
    }
    function fn18(param764) {
      var var4089 = param764.lastIndexOf('.');
      return var4089 == -0x1 ? '' : param764.substr(var4089 + 0x1);
    }
    async function fn19(param765, param766) {
      let var4090 = {
        'file': param766,
        'libraryID': param765.libraryID,
        'parentItemID': param765.id,
        'collections': undefined
      };
      var var4091 = await Zotero.Attachments.importFromFile(var4090);
      var4091.newFile = "true";
      if (Zotero.Prefs.get("ai4paper.deleteSourceFileWhenAttached")) {
        param766 != var4091.getFilePath() && OS.File.remove(param766);
      }
      if (Zotero.Prefs.get('ai4paper.renameAfterAttaching')) {
        await Zotero.AI4Paper.renameAttachments([var4091]);
      }
    }
    if (Zotero_Tabs._selectedID != "zotero-pane") return;
    var var4092 = ZoteroPane.getSelectedItems()[0x0];
    if (!var4092) return;
    var4092 = !var4092.isTopLevelItem() ? Zotero.Items.get(var4092.parentItemID) : var4092;
    if (var4092.library.libraryType === "feed") {
      window.alert("该条目为 RSS 订阅条目，无法执行本操作！");
      return;
    }
    if (!var4092.isEditable()) {
      window.alert("您没有该条目的编辑权限！");
      return;
    }
    if (!var4092.isRegularItem()) {
      window.alert("请选择一个常规条目！");
      return;
    }
    var var4093 = Zotero.Prefs.get("ai4paper.newfileDirectory");
    if (!var4093 || !(await OS.File.exists(var4093))) return window.alert("新文件监控目录未设置，或该目录不存在！请前往【AI4paper --> 附件管理】设置。"), false;
    var var4094 = [fn17(var4093)];
    if (!var4094[0x0]) {
      window.alert("获取最新文件失败！");
      return;
    }
    let var4095 = Services.prompt.confirm(window, "📎 绑定新文件", "是否要绑定文件：" + OS.Path.basename(var4094[0x0]));
    if (!var4095) return false;
    for (var var4096 = 0x0; var4096 < var4094.length; var4096++) {
      await fn19(var4092, var4094[var4096]);
    }
  },
  'is4AttachNewFile': function () {
    var var4097 = ZoteroPane.getSelectedItems()[0x0];
    if (!var4097 || !var4097.isTopLevelItem() || !var4097.isRegularItem() || var4097.library.libraryType === 'feed' || !var4097.isEditable()) return false;
    return true;
  },
  'renameAttachments': async function (param767) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    var var4098 = Zotero.Prefs.get("ai4paper.fileTypes").split(',').map(_0x1158b6 => _0x1158b6.trim().toLowerCase());
    let var4099 = 0x0,
      var4100 = false;
    if (!param767) {
      var var4101 = ZoteroPane.getSelectedItems();
    } else {
      var var4101 = param767;
    }
    if (!param767 && Zotero.AI4Paper.hasAttachmentItem() && Zotero.Prefs.get("ai4paper.enableRenameTemplate")) {
      let var4102 = Zotero.AI4Paper.openDialogByType_modal("selectRenameStyle");
      if (var4102[0x0]) {
        Zotero.Prefs.set("ai4paper.lastRenameStyle", var4102[0x0]);
        var var4103 = var4102[0x0];
        if (var4103 === "默认：按父级元数据") var4100 = false;else {
          if (var4103 === "自定：手动输入名称") {
            var4103 = window.prompt('请输入想要的名称：', '');
            if (var4103.trim()) {
              var4100 = true;
            }
          } else var4100 = true;
        }
      }
    }
    for (let var4104 of var4101) {
      if (var4104.isRegularItem()) {
        let _0x5e208d = var4104.getAttachments();
        for (let var4106 of _0x5e208d) {
          let var4107 = Zotero.Items.get(var4106);
          if (!Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && var4107.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) continue;else {
            if (Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && (var4107.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL || var4107.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_FILE)) continue;
          }
          var var4108 = await var4107.getFilePathAsync();
          if (!var4108) continue;
          let var4109 = var4107.parentItemID,
            var4110 = await Zotero.Items.getAsync(var4109);
          var var4111 = Zotero.Attachments.getFileBaseNameFromItem(var4110);
          let var4112 = /\.[^\.]+$/,
            var4113 = var4108.split('/').pop(),
            var4114 = var4113.match(var4112);
          var4114 && (var4111 = var4111 + var4114[0x0]);
          if (!var4098.includes(var4114) && param767) {
            continue;
          }
          var var4115 = await var4107.renameAttachmentFile(var4111, false, true);
          if (var4115 !== true) {
            Zotero.debug("Could not rename file (" + var4115 + ')');
            continue;
          }
          var4107.setField("title", var4111);
          await var4107.saveTx();
          var4099++;
        }
      } else {
        if (var4104.isAttachment()) {
          if (!Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && var4104.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) continue;else {
            if (Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && (var4104.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL || var4104.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_FILE)) {
              continue;
            }
          }
          var var4108 = await var4104.getFilePathAsync();
          if (!var4108) continue;
          let _0x18d028 = var4104.parentItemID;
          if (!_0x18d028) {
            continue;
          }
          let _0x2d9c34 = await Zotero.Items.getAsync(_0x18d028);
          if (var4100) var var4111 = '【' + var4103.trim() + "】- " + Zotero.Attachments.getFileBaseNameFromItem(_0x2d9c34);else var var4111 = Zotero.Attachments.getFileBaseNameFromItem(_0x2d9c34);
          let _0x44400f = /\.[^\.]+$/,
            _0x508f53 = var4108.split('/').pop(),
            _0x3a170a = _0x508f53.match(_0x44400f);
          if (_0x3a170a) {
            var4111 = var4111 + _0x3a170a[0x0];
          }
          if (!var4098.includes(_0x3a170a) && param767) {
            continue;
          }
          var var4115 = await var4104.renameAttachmentFile(var4111, false, true);
          if (var4115 !== true) {
            Zotero.debug("Could not rename file (" + var4115 + ')');
            continue;
          }
          var4104.setField("title", var4111);
          await var4104.saveTx();
          var4099++;
        }
      }
    }
    !param767 && Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 重命名附件", "成功重命名【" + var4099 + "】个附件！");
  },
  'is4RenameAttachments': function () {
    var var4121 = ZoteroPane.getSelectedItems();
    if (var4121.length === 0x1 && var4121[0x0].isTopLevelItem() && !var4121[0x0].isEditable()) return false;
    for (let var4122 of var4121) {
      if (var4122.isRegularItem()) {
        let var4123 = var4122.getAttachments();
        if (var4123.length) {
          return true;
        }
      } else {
        if (var4122.isAttachment() && var4122.parentItemID && !Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && var4122.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL) return true;else {
          if (var4122.isAttachment() && var4122.parentItemID && Zotero.Prefs.get('ai4paper.renameExcludesLinkedFile') && var4122.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL && var4122.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_FILE) {
            return true;
          }
        }
      }
    }
    return false;
  },
  'hasAttachmentItem': function () {
    var var4124 = ZoteroPane.getSelectedItems();
    for (let var4125 of var4124) {
      if (var4125.isAttachment() && var4125.parentItemID && !Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && var4125.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL) return true;else {
        if (var4125.isAttachment() && var4125.parentItemID && Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && var4125.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL && var4125.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_FILE) return true;
      }
    }
    return false;
  },
  'previewItemMac': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle() || !Zotero.Prefs.get('ai4paper.enableMacPreview')) return -0x1;
    let var4126 = window.document.querySelector("[data-id=\"zotero-pane\"]");
    if (var4126) {
      if (!var4126.classList.contains("selected")) return;
    }
    if (Zotero_Tabs._selectedID != "zotero-pane") {
      return window.close(), true;
    } else var var4127 = ZoteroPane.getSelectedItems()[0x0];
    if (!var4127) return;
    if (var4127.isRegularItem()) {
      let _0xee21bb = await var4127.getBestAttachment();
      if (!_0xee21bb) return;
      Zotero.Reader.open(_0xee21bb.id, null, {
        'openInWindow': true
      });
    } else {
      if (var4127.isAttachment) {
        if (["application/pdf", "text/html", "application/epub+zip"].includes(var4127.attachmentContentType)) {
          if (var4127.attachmentLinkMode === 0x3) return;
          Zotero.Reader.open(var4127.id, null, {
            'openInWindow': true
          });
        }
      }
    }
  },
  'previewItemWin': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle() || !Zotero.Prefs.get('ai4paper.enableWinPreview')) return -0x1;
    let var4129 = Zotero_Tabs._selectedID;
    var var4130 = Zotero.Reader.getByTabID(var4129);
    if (var4130) {
      let _0x1ffd33 = var4130.itemID;
      var var4132 = Zotero.Items.get(_0x1ffd33);
      var4132 && var4132.parentItemID && (_0x1ffd33 = var4132.parentItemID, var4132 = Zotero.Items.get(_0x1ffd33));
    } else var var4132 = ZoteroPane.getSelectedItems()[0x0];
    var var4133 = Zotero.Prefs.get('extensions.zotero.ai4paper.quicklookapppath', true);
    if (!var4133) {
      return window.alert('请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20拓展】设定\x20QuickLook/Seer\x20路径。'), false;
    }
    if (!(await OS.File.exists(var4133))) return window.alert("您设定的 QuickLook/Seer 应用不存在！"), false;
    if (var4132 && !var4132.isNote()) {
      if (var4132.isRegularItem()) {
        let _0x1b96f8 = var4132.getAttachments();
        for (let var4135 of _0x1b96f8) {
          let var4136 = Zotero.Items.get(var4135);
          var var4137 = await var4136.getFilePathAsync();
          if (var4136.attachmentContentType == "application/pdf") {
            if (var4137 && var4133) return Zotero.AI4Paper.goPublication() && Zotero.launchFileWithApplication(var4137, var4133), true;
          }
        }
      }
      if (var4132.isAttachment()) {
        var var4137 = await var4132.getFilePathAsync();
        if (var4132.attachmentContentType == "application/pdf") {
          if (var4137 && var4133) {
            if (Zotero.AI4Paper.getFunMetaTitle()) {
              Zotero.launchFileWithApplication(var4137, var4133);
            }
            return false;
          }
        }
      }
    }
  },
  'copyPDF': async function (param768) {
    try {
      if (!Zotero.AI4Paper.getFunMetaTitle()) {
        return -0x1;
      }
      if (!param768) {
        var param768, var4138;
        let var4139 = Zotero_Tabs._selectedID,
          var4140 = Zotero.Reader.getByTabID(var4139);
        if (var4140) {
          let _0x1ca68c = var4140.itemID;
          param768 = Zotero.Items.get(_0x1ca68c);
          param768.isAttachment() && (var4138 = await param768.getFilePathAsync());
        } else {
          let _0x5f47f2 = ZoteroPane.getSelectedItems();
          if (_0x5f47f2?.["length"] === 0x0) return;
          param768 = _0x5f47f2[0x0];
          if (param768 && !param768.isNote()) {
            if (param768.isRegularItem()) {
              let var4143 = param768.getAttachments();
              for (let var4144 of var4143) {
                param768 = Zotero.Items.get(var4144);
                if (param768.attachmentContentType == "application/pdf") {
                  var4138 = await param768.getFilePathAsync();
                  break;
                } else {
                  var4138 = await param768.getFilePathAsync();
                  continue;
                }
              }
            }
            param768.isAttachment() && (var4138 = await param768.getFilePathAsync());
          }
        }
      } else {
        var var4138 = await param768.getFilePathAsync();
      }
      if (!var4138) {
        Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 拷贝 PDF【AI4paper】", "❌ 未发现可供拷贝的附件...");
        return;
      }
      let _0x5c5f1e = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable),
        _0x4ee3b5 = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
      const _0x25031c = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
      _0x25031c.initWithPath(var4138);
      _0x5c5f1e.addDataFlavor("application/x-moz-file");
      _0x5c5f1e.setTransferData("application/x-moz-file", _0x25031c);
      try {
        _0x4ee3b5.setData(_0x5c5f1e, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
      } catch (_0x23a2ec) {
        if (var4138 && Zotero.isMac) {
          Zotero.Utilities.Internal.exec('/usr/bin/osascript', ['-e', 'set\x20the\x20clipboard\x20to\x20POSIX\x20file\x20\x22' + var4138 + '\x22']);
        } else {
          Zotero.debug(_0x23a2ec);
          return;
        }
        Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 拷贝 PDF 失败【AI4paper】", "❌ 出错了...");
        return;
      }
      Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 拷贝 PDF【AI4paper】", "成功拷贝【" + param768.getField("title") + '】，您可将其粘贴至其他地方...如微信、各大\x20AI\x20网页端。');
    } catch (_0x4d3c57) {
      Zotero.debug(_0x4d3c57);
    }
  },
  'openwith_buildPopup': function (param769) {
    let var4148 = {
        0x1: '',
        0x2: "2nd",
        0x3: "3rd",
        0x4: "4th",
        0x5: "5th",
        0x6: "6th"
      },
      var4149 = window.document.createXULElement('menupopup');
    var4149.id = "zoteroone-openwith-menupopup";
    var4149.addEventListener('popuphidden', () => {
      window.document.querySelector("#browser").querySelectorAll("#zoteroone-openwith-menupopup").forEach(_0x1875f3 => _0x1875f3.remove());
    });
    let var4150 = var4149.firstElementChild;
    while (var4150) {
      var4150.remove();
      var4150 = var4149.firstElementChild;
    }
    ["Open With ❶", "Open With ❷", "Open With ❸", "Open With ❹", "Open With ❺", "Open With ❻"].forEach((_0x11dd0f, _0x115d70) => {
      let var4151 = Zotero.Prefs.get("ai4paper.pdfapppath" + var4148[_0x115d70 + 0x1]);
      var4151 = ('' + var4151).trim();
      if (var4151) {
        let _0x2285e2 = Zotero.Prefs.get("ai4paper.label4openwith" + var4148[_0x115d70 + 0x1]).trim(),
          _0x39b546 = _0x2285e2 ? 'Open\x20With\x20\x22' + _0x2285e2 + '\x22' : _0x11dd0f,
          _0x347094 = window.document.createXULElement('menuitem');
        _0x347094.setAttribute("label", _0x39b546);
        _0x347094.addEventListener('command', _0x3cc0c3 => {
          Zotero.AI4Paper.openwith(_0x115d70 + 0x1);
        });
        var4149.appendChild(_0x347094);
      }
    });
    window.document.querySelector("#browser").querySelectorAll('#zoteroone-openwith-menupopup').forEach(_0x57bcdb => _0x57bcdb.remove());
    window.document.querySelector("#browser")?.['appendChild'](var4149);
    var4149.openPopup(param769, "after_start", 0x0, 0x0, false, false);
  },
  'openwith': async function (_0x2a0e82 = 0x1) {
    try {
      if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
      let var4155 = {
          0x1: '',
          0x2: '2nd',
          0x3: "3rd",
          0x4: "4th",
          0x5: "5th",
          0x6: "6th"
        },
        var4156 = {
          0x1: '❶',
          0x2: '❷',
          0x3: '❸',
          0x4: '❹',
          0x5: '❺',
          0x6: '❻'
        };
      var var4157 = Zotero.Prefs.get("ai4paper.pdfapppath" + var4155[_0x2a0e82]);
      if (!var4157) return window.alert("请先前往【Zotero 设置 --> AI4paper --> 拓展 --> Open With " + var4156[_0x2a0e82] + "】设定 PDF 应用。"), false;
      if (!(await OS.File.exists(var4157))) return window.alert('您设定的\x20PDF\x20应用不存在！'), false;
      let var4158 = Zotero_Tabs._selectedID;
      var var4159 = Zotero.Reader.getByTabID(var4158);
      if (var4159) {
        let _0x4f3ce = var4159.itemID,
          _0x135520 = Zotero.Items.get(_0x4f3ce);
        if (_0x135520.isAttachment()) {
          var var4162 = await _0x135520.getFilePathAsync();
          if (_0x135520.attachmentContentType == 'application/pdf') {
            if (var4162 && var4157) return Zotero.AI4Paper.runAuthor() && Zotero.launchFileWithApplication(var4162, var4157), false;
          }
        }
      } else {
        let var4163 = ZoteroPane.getSelectedItems();
        for (let var4164 of var4163) {
          if (var4164 && !var4164.isNote()) {
            if (var4164.isRegularItem()) {
              let _0x3c317a = var4164.getAttachments();
              for (let var4166 of _0x3c317a) {
                let _0x1fd462 = Zotero.Items.get(var4166);
                var var4162 = await _0x1fd462.getFilePathAsync();
                _0x1fd462.attachmentContentType == "application/pdf" && var4162 && var4157 && Zotero.AI4Paper.runAuthor() && Zotero.launchFileWithApplication(var4162, var4157);
              }
            }
            if (var4164.isAttachment()) {
              var var4162 = await var4164.getFilePathAsync();
              if (var4164.attachmentContentType == "application/pdf") {
                if (var4162 && var4157) {
                  if (Zotero.AI4Paper.runAuthor()) {
                    Zotero.launchFileWithApplication(var4162, var4157);
                  }
                }
              }
            }
            Zotero.AI4Paper.filesHistory(var4164);
          }
        }
      }
    } catch (_0x2886ea) {
      Zotero.debug(_0x2886ea);
    }
  },
  'getItemsTitleANDKey': function () {
    let var4168 = Zotero_Tabs._selectedID;
    var var4169 = Zotero.Reader.getByTabID(var4168);
    if (var4169) {
      let _0x2f65ea = var4169.itemID;
      var var4171 = Zotero.Items.get(_0x2f65ea);
      if (var4171 && var4171.parentItemID) {
        _0x2f65ea = var4171.parentItemID;
        var4171 = Zotero.Items.get(_0x2f65ea);
        let var4172 = var4171.key,
          var4173 = var4171.getField('title');
        return [{
          'item_Title': var4173,
          'item_Key': var4172
        }];
      } else return Services.prompt.alert(window, "❌ 温馨提示：", "您选的 PDF 无父条目，请创建父条目或重新选择！"), false;
    } else var var4174 = ZoteroPane.getSelectedItems().filter(_0x4745ed => _0x4745ed.isRegularItem());
    if (var4174.length === 0x0) return Services.prompt.alert(window, "❌ 温馨提示：", "请至少选择一个常规条目！"), false;
    let var4175 = [];
    for (let var4176 of var4174) {
      let var4177 = var4176.key,
        var4178 = var4176.getField("title"),
        var4179 = {
          'item_Title': var4178,
          'item_Key': var4177
        };
      var4175.push(var4179);
    }
    return var4175;
  },

  // === Block E: Delete/Export Operations ===
  'StoreAnnotations2PDF': async function () {
    let var5570 = Zotero_Tabs._selectedID;
    var var5571 = Zotero.Reader.getByTabID(var5570);
    if (var5571) {
      let _0x1b6a52 = var5571.itemID;
      await Zotero.PDFWorker['export'](_0x1b6a52, null, true, '', true);
      Zotero_Tabs.select("zotero-pane");
      Zotero_Tabs.select(var5570);
    } else window.alert("请在内置阅读器中打开文献后，再执行本菜单！");
  },
  'deleteAllAttachments': async function () {
    let var5607 = Services.prompt.confirm(window, "删除选定条目的所有附件", '是否确认删除选定文献的附件及其本地文件？如果误删，可以从\x20Zotero\x20回收站找回。');
    if (!var5607) return false;
    let var5608 = Zotero_Tabs._selectedID,
      var5609 = Zotero.Reader.getByTabID(var5608);
    if (var5609) {
      let var5610 = var5609.itemID;
      var var5611 = Zotero.Items.get(var5610);
      if (var5611 && var5611.parentItemID) {
        var5610 = var5611.parentItemID;
        var5611 = Zotero.Items.get(var5610);
        var var5612 = [];
        var5612.push(var5611);
      }
    } else var var5612 = ZoteroPane.getSelectedItems();
    for (let var5613 of var5612) {
      if (var5613 && !var5613.isNote()) {
        if (var5613.isRegularItem()) {
          let var5614 = var5613.getAttachments();
          for (let var5615 of var5614) {
            let var5616 = Zotero.Items.get(var5615);
            var5616.deleted = true;
            await var5616.saveTx();
            var var5617 = await var5616.getFilePathAsync();
            var5617 && (await OS.File.remove(var5617));
          }
        }
      }
    }
  },
  'deleteSnapShots': async function () {
    let var5618 = Services.prompt.confirm(window, "删除选定条目的网页快照", "是否确认删除选定文献的网页快照？如果误删，可以从 Zotero 回收站找回。");
    if (!var5618) {
      return false;
    }
    let var5619 = Zotero_Tabs._selectedID,
      var5620 = Zotero.Reader.getByTabID(var5619);
    if (var5620) {
      let _0x5c3610 = var5620.itemID;
      var var5622 = Zotero.Items.get(_0x5c3610);
      if (var5622 && var5622.parentItemID) {
        _0x5c3610 = var5622.parentItemID;
        var5622 = Zotero.Items.get(_0x5c3610);
        var var5623 = [];
        var5623.push(var5622);
      }
    } else var var5623 = ZoteroPane.getSelectedItems();
    for (let var5624 of var5623) {
      if (var5624 && !var5624.isNote()) {
        if (var5624.isRegularItem()) {
          let var5625 = var5624.getAttachments();
          for (let var5626 of var5625) {
            let var5627 = Zotero.Items.get(var5626);
            if (var5627.attachmentContentType == 'text/html') {
              var5627.deleted = true;
              await var5627.saveTx();
              var var5628 = await var5627.getFilePathAsync();
              var5628 && (await OS.File.remove(var5628));
            }
          }
        }
      }
    }
  },
  'exportFile': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let var5629 = Zotero_Tabs._selectedID,
      var5630 = Zotero.Reader.getByTabID(var5629);
    if (var5630) {
      let var5631 = var5630.itemID;
      var var5632 = Zotero.Items.get(var5631);
      if (var5632 && var5632.parentItemID) {
        var5631 = var5632.parentItemID;
        var5632 = Zotero.Items.get(var5631);
        var var5633 = [];
        var5633.push(var5632);
      }
    } else var var5633 = ZoteroPane.getSelectedItems();
    let var5634,
      var5635,
      var5636,
      var5637 = 0x0,
      var5638 = await Zotero.AI4Paper.chooseExportLocation();
    if (var5638) {
      for (let var5639 of var5633) {
        if (var5639 && !var5639.isNote()) {
          if (var5639.isRegularItem()) {
            let _0x4c882c = var5639.getAttachments();
            for (let var5641 of _0x4c882c) {
              let _0x172993 = Zotero.Items.get(var5641);
              var5634 = await _0x172993.getFilePathAsync();
              var5634 && (var5635 = _0x172993.attachmentFilename, var5636 = OS.Path.join(var5638, var5635), OS.File.exists(var5636) && (await Zotero.AI4Paper.copyWithNoOverwrite(var5634, var5638), var5637++));
            }
          }
          var5639.isAttachment() && (var5634 = await var5639.getFilePathAsync(), var5634 && (var5635 = var5639.attachmentFilename, var5636 = OS.Path.join(var5638, var5635), OS.File.exists(var5636) && (await Zotero.AI4Paper.copyWithNoOverwrite(var5634, var5638), var5637++)));
        }
      }
      var5637 ? Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 导出成功", '您成功将选定文献的【' + var5637 + "】个附件导出至【" + var5638 + '】。') : Zotero.AI4Paper.showProgressWindow(0x5dc, "温馨提示", "未发现符合条件的附件！");
    }
  },
  'copyWithNoOverwrite': async function (param1099, param1100) {
    const var5643 = OS.Path,
      var5644 = var5643.basename(param1099),
      var5645 = var5644.substr(var5644.lastIndexOf('.') + 0x1),
      var5646 = var5644.slice(0x0, var5644.length - var5645.length - 0x1);
    let var5647 = var5643.join(param1100, var5644),
      var5648 = 0x1;
    while (await OS.File.exists(var5647)) {
      const var5649 = var5646 + '\x20(' + var5648 + ').' + var5645;
      var5647 = var5643.join(param1100, var5649);
      var5648++;
    }
    return await OS.File.copy(param1099, var5647), var5647;
  },
  'exportPDFFile': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let var5650 = Zotero_Tabs._selectedID,
      var5651 = Zotero.Reader.getByTabID(var5650);
    if (var5651) {
      let var5652 = var5651.itemID;
      var var5653 = Zotero.Items.get(var5652);
      if (var5653 && var5653.parentItemID) {
        var5652 = var5653.parentItemID;
        var5653 = Zotero.Items.get(var5652);
        var var5654 = [];
        var5654.push(var5653);
      }
    } else var var5654 = ZoteroPane.getSelectedItems();
    let var5655,
      var5656,
      var5657,
      var5658 = 0x0,
      var5659 = await Zotero.AI4Paper.chooseExportLocation();
    if (var5659) {
      for (let var5660 of var5654) {
        if (var5660 && !var5660.isNote()) {
          if (var5660.isRegularItem()) {
            let var5661 = var5660.getAttachments();
            for (let var5662 of var5661) {
              let _0x1f32f3 = Zotero.Items.get(var5662);
              var5655 = await _0x1f32f3.getFilePathAsync();
              _0x1f32f3.attachmentContentType == "application/pdf" && var5655 && (var5656 = _0x1f32f3.attachmentFilename, var5657 = OS.Path.join(var5659, var5656), OS.File.exists(var5657) && (await Zotero.AI4Paper.copyWithNoOverwrite(var5655, var5659), var5658++));
            }
          }
          if (var5660.isAttachment()) {
            var5655 = await var5660.getFilePathAsync();
            if (var5660.attachmentContentType == 'application/pdf') {
              var5655 && (var5656 = var5660.attachmentFilename, var5657 = OS.Path.join(var5659, var5656), OS.File.exists(var5657) && (await Zotero.AI4Paper.copyWithNoOverwrite(var5655, var5659), var5658++));
            }
          }
        }
      }
      var5658 ? Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20导出成功', '您成功将选定文献的【' + var5658 + "】个 PDF 附件导出至【" + var5659 + '】。') : Zotero.AI4Paper.showProgressWindow(0x5dc, "温馨提示", '未发现任何\x20PDF\x20附件！');
    }
  },
  'chooseExportLocation': async function () {
    var {
        FilePicker: _0x41206d
      } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs"),
      var5664 = new _0x41206d();
    var5664.init(window, "选择目标文件夹", var5664.modeGetFolder);
    var5664.appendFilters(var5664.filterAll);
    if ((await var5664.show()) != var5664.returnOK) {
      return false;
    }
    var var5665 = PathUtils.normalize(var5664.file);
    return var5665;
  },

  // === Block F: Copy Links + Related Items ===
  'copySelectedItemsLink': function (param1108) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let var5754 = Zotero_Tabs._selectedID,
      var5755 = Zotero.Reader.getByTabID(var5754);
    if (var5755) {
      let _0x118d6d = var5755.itemID;
      var var5757 = Zotero.Items.get(_0x118d6d);
      if (var5757 && var5757.parentItemID) {
        _0x118d6d = var5757.parentItemID;
        var5757 = Zotero.Items.get(_0x118d6d);
        var var5758 = [];
        var5758.push(var5757);
      }
    } else var var5758 = ZoteroPane.getSelectedItems();
    if (!var5758.length) {
      return false;
    }
    var var5759 = [],
      var5760,
      var5761;
    for (var var5762 = 0x0; var5762 < var5758.length; var5762++) {
      var5760 = Zotero.Libraries.get(var5758[var5762].libraryID).libraryType;
      switch (var5760) {
        case "group":
          var5761 = Zotero.URI.getLibraryPath(var5758[var5762].libraryID);
          break;
        case 'user':
          var5761 = "library";
          break;
        default:
          continue;
      }
      let var5763 = "zotero://select/" + var5761 + '/items/' + var5758[var5762].key;
      param1108 && (var5763 = '[' + var5758[var5762].getField("title") + '](' + var5763 + ')');
      var5759.push(var5763);
    }
    Zotero.AI4Paper.copy2Clipboard(var5759.join('\x0d\x0a'));
    Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝条目链接", "所选条目链接已拷贝至剪切板！");
  },
  'copyPDFAttachmentsLink': function (param1109) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let var5764 = Zotero_Tabs._selectedID,
      var5765 = Zotero.Reader.getByTabID(var5764);
    if (var5765) {
      let _0x8de527 = var5765.itemID;
      var var5767 = Zotero.Items.get(_0x8de527);
      if (var5767 && var5767.parentItemID) {
        _0x8de527 = var5767.parentItemID;
        var5767 = Zotero.Items.get(_0x8de527);
        var var5768 = [];
        var5768.push(var5767);
      }
    } else var var5768 = ZoteroPane.getSelectedItems();
    if (!var5768.length) return false;
    var5768 = var5768.filter(_0x57f0e6 => _0x57f0e6.isRegularItem());
    if (!var5768.length) {
      window.alert("未选择任何常规条目！");
    }
    var var5769 = '';
    for (let var5770 of var5768) {
      let _0x2667c5 = Zotero.AI4Paper.getZoteroAttachments(var5770, param1109);
      _0x2667c5 != '' && (var5769 = var5769 + _0x2667c5 + '\x0d\x0a' + '\x0d\x0a');
    }
    Zotero.AI4Paper.copy2Clipboard(var5769);
    Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20拷贝\x20PDF\x20附件链接', "所选条目的 PDF 附件链接已拷贝至剪切板！");
  },
  'getZoteroAttachments': function (param1110, param1111) {
    let var5772 = param1110.getAttachments();
    var var5773 = '';
    for (let var5774 of var5772) {
      let var5775 = Zotero.Items.get(var5774);
      if (var5775.attachmentContentType == "application/pdf") {
        let var5776 = Zotero.AI4Paper.getItemPDFLink(var5775);
        param1111 && (var5776 = '[' + var5775.getField("title") + '](' + var5776 + ')');
        var5773 = var5773 + var5776 + '\x0a';
      }
    }
    return var5773;
  },
  'copyItemCitationPDFLink': function (param1112) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let var5777 = Zotero_Tabs._selectedID,
      var5778 = Zotero.Reader.getByTabID(var5777);
    if (var5778) {
      let var5779 = var5778.itemID;
      var var5780 = Zotero.Items.get(var5779);
      if (var5780 && var5780.parentItemID) {
        var5779 = var5780.parentItemID;
        var5780 = Zotero.Items.get(var5779);
        var var5781 = [];
        var5781.push(var5780);
      }
    } else var var5781 = ZoteroPane.getSelectedItems();
    if (!var5781.length) return false;
    var5781 = var5781.filter(_0x40dbe6 => _0x40dbe6.isRegularItem());
    !var5781.length && window.alert("未选择任何常规条目！");
    var var5782 = '';
    if (var5781.length == 0x1) {
      var var5783 = Zotero.QuickCopy,
        var5784 = Zotero.Prefs.get("export.quickCopy.setting");
      var5784.split('=')[0x0] !== 'bibliography' && alert("No bibliography style is choosen in the settings for QuickCopy.");
      var var5785 = var5783.getContentFromItems(var5781, var5784),
        var5786 = var5785.html,
        var5787 = var5785.text,
        var5788 = Zotero.AI4Paper.getZoteroAttachmentsBullets(var5781[0x0], param1112);
      var5782 = var5787 + '\x0d\x0a' + "PDF Attachments:" + '\x0d\x0a' + var5788;
      Zotero.AI4Paper.copy2Clipboard(var5782);
      Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20拷贝引文及\x20PDF\x20附件链接', "所选条目的引文及其 PDF 附件链接已拷贝至剪切板！");
    } else window.alert('请仅选择一个常规条目！');
  },
  'getZoteroAttachmentsBullets': function (param1113, param1114) {
    let var5789 = param1113.getAttachments();
    var var5790 = '';
    for (let var5791 of var5789) {
      let var5792 = Zotero.Items.get(var5791);
      if (var5792.attachmentContentType == 'application/pdf') {
        let var5793 = Zotero.AI4Paper.getItemPDFLink(var5792);
        param1114 && (var5793 = '[' + var5792.getField("title") + '](' + var5793 + ')');
        var5790 = var5790 + '-\x20' + var5793 + '\x0a';
      }
    }
    return var5790;
  },
  'updateAllRelatedItemsNum': async function () {
    Zotero.AI4Paper.showProgressWindow(0xbb8, "正在更新关联文献数量", "更新关联文献数量需要一定时间...结果将通过弹窗反馈给您！");
    var var5794 = 0x0,
      var5795 = 0x0,
      var5796 = 0x0,
      var5797 = new Zotero.Search();
    var5797.libraryID = Zotero.Libraries.userLibraryID;
    var5797.addCondition("itemType", 'is', "journalArticle");
    var var5798 = await var5797.search(),
      var5799 = await Zotero.Items.getAsync(var5798);
    for (let var5800 of var5799) {
      let _0x35f49b = var5800.relatedItems,
        _0x46f657 = _0x35f49b.length;
      if (_0x46f657 > 0x0) {
        if (var5800.getField("archiveLocation").indexOf('🔗') != -0x1) {
          let _0x1a2481 = var5800.getField("archiveLocation"),
            _0x364411 = var5800.getField("archiveLocation").indexOf('🔗');
          _0x1a2481 = _0x1a2481.substring(0x0, _0x364411);
          var5800.setField("archiveLocation", _0x1a2481 + '🔗' + String(_0x46f657));
          await var5800.saveTx();
          var5794++;
        } else {
          var5800.setField('archiveLocation', var5800.getField("archiveLocation") + '🔗' + String(_0x46f657));
          await var5800.saveTx();
          var5794++;
        }
      }
    }
    var var5805 = new Zotero.Search();
    var5805.libraryID = Zotero.Libraries.userLibraryID;
    var5805.addCondition("itemType", 'is', "thesis");
    var var5806 = await var5805.search(),
      var5807 = await Zotero.Items.getAsync(var5806);
    for (let var5808 of var5807) {
      let var5809 = var5808.relatedItems,
        var5810 = var5809.length;
      if (var5810 > 0x0) {
        if (var5808.getField("archiveLocation").indexOf('🔗') != -0x1) {
          let var5811 = var5808.getField('archiveLocation'),
            var5812 = var5808.getField("archiveLocation").indexOf('🔗');
          var5811 = var5811.substring(0x0, var5812);
          var5808.setField("archiveLocation", var5811 + '🔗' + String(var5810));
          await var5808.saveTx();
          var5795++;
        } else {
          var5808.setField('archiveLocation', var5808.getField('archiveLocation') + '🔗' + String(var5810));
          await var5808.saveTx();
          var5795++;
        }
      }
    }
    var var5813 = new Zotero.Search();
    var5813.libraryID = Zotero.Libraries.userLibraryID;
    var5813.addCondition('itemType', 'is', "conferencePaper");
    var var5814 = await var5813.search(),
      var5815 = await Zotero.Items.getAsync(var5814);
    for (let var5816 of var5815) {
      let _0xea4b6d = var5816.relatedItems,
        _0x30cc99 = _0xea4b6d.length;
      if (_0x30cc99 > 0x0) {
        if (var5816.getField("archiveLocation").indexOf('🔗') != -0x1) {
          let _0x26108f = var5816.getField('archiveLocation'),
            _0x2a48b9 = var5816.getField("archiveLocation").indexOf('🔗');
          _0x26108f = _0x26108f.substring(0x0, _0x2a48b9);
          var5816.setField("archiveLocation", _0x26108f + '🔗' + String(_0x30cc99));
          await var5816.saveTx();
          var5796++;
        } else {
          var5816.setField("archiveLocation", var5816.getField("archiveLocation") + '🔗' + String(_0x30cc99));
          await var5816.saveTx();
          var5796++;
        }
      }
    }
    Zotero.AI4Paper.showProgressWindow(0x1770, '✅\x20【全库更新关联文献数量】完毕', '共有【' + var5794 + "】篇期刊论文、【" + var5796 + "】篇会议论文、以及【" + var5795 + "】篇学位论文包含关联文献！");
  },
  'selectAllRelatedItmes': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let var5821 = Zotero_Tabs._selectedID;
    var var5822 = Zotero.Reader.getByTabID(var5821);
    if (var5822) {
      let var5823 = var5822.itemID;
      var var5824 = Zotero.Items.get(var5823);
      var5824 && var5824.parentItemID && (var5823 = var5824.parentItemID, var5824 = Zotero.Items.get(var5823));
    } else var var5824 = ZoteroPane.getSelectedItems()[0x0];
    let var5825 = Zotero.AI4Paper.getRelatedItemsIDsArray(var5824);
    if (!var5825.length) return window.alert("当前条目无关联文献！"), false;
    Zotero_Tabs.select("zotero-pane");
    await ZoteroPane_Local.selectItems(var5825);
    Zotero.AI4Paper.showProgressWindow(0xbb8, "全选关联文献", '为您全选了所有【' + var5825.length + '】篇关联文献！');
  },
  'removeRelatedItems': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let var5826 = Zotero_Tabs._selectedID;
    var var5827 = Zotero.Reader.getByTabID(var5826);
    if (var5827) {
      let _0x2df0c2 = var5827.itemID;
      var var5829 = Zotero.Items.get(_0x2df0c2);
      var5829 && var5829.parentItemID && (_0x2df0c2 = var5829.parentItemID, var5829 = Zotero.Items.get(_0x2df0c2));
    } else var var5829 = ZoteroPane.getSelectedItems()[0x0];
    if (!var5829.isRegularItem()) return window.alert('请选择一个常规条目！'), false;
    let var5830 = Zotero.AI4Paper.getRelatedItemsArray(var5829),
      var5831 = [];
    if (var5830.length === 0x0) {
      return window.alert("当前条目无关联文献！"), -0x1;
    }
    for (let var5832 of var5830) {
      try {
        let _0x56735c = var5832.getField("title");
        var5831.push(_0x56735c + " 🆔 " + var5832.itemID);
      } catch (_0x1dd5ad) {}
    }
    var5831.sort();
    Zotero.AI4Paper._action_removeRelatedItems = true;
    let var5834 = Zotero.AI4Paper.openDialogByType_modal("selectRelatedItems", var5831);
    if (!var5834) return null;
    let var5835 = [];
    Object.keys(var5834).forEach(async function (param1115) {
      let _0x202159 = var5834[param1115];
      if (_0x202159.indexOf('🆔') != -0x1) {
        let _0x276982 = _0x202159.indexOf('🆔'),
          _0x7e99fe = _0x202159.substring(_0x276982 + 0x3);
        var5835.push(Zotero.Items.get(_0x7e99fe));
      }
    });
    for (let var5839 of var5835) {
      var5829.removeRelatedItem(var5839);
      await var5829.saveTx();
      if (var5839.isRegularItem()) {
        var5839.removeRelatedItem(var5829);
      }
      await var5839.saveTx();
    }
    await new Promise(_0x4478d5 => setTimeout(_0x4478d5, 0x2710));
    for (let var5840 of var5835) {
      var5829.removeRelatedItem(var5840);
      await var5829.saveTx();
    }
    let var5841 = var5830;
    var5841.push(var5829);
    for (let var5842 of var5841) {
      await Zotero.AI4Paper.updateRelatedItemsNum(var5842);
    }
  },
  'showSelectedRelatedItems': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let var5843 = Zotero_Tabs._selectedID;
    var var5844 = Zotero.Reader.getByTabID(var5843);
    if (var5844) {
      let _0x556716 = var5844.itemID;
      var var5846 = Zotero.Items.get(_0x556716);
      var5846 && var5846.parentItemID && (_0x556716 = var5846.parentItemID, var5846 = Zotero.Items.get(_0x556716));
    } else var var5846 = ZoteroPane.getSelectedItems()[0x0];
    if (!var5846.isRegularItem()) return window.alert('请选择一个常规条目！'), false;
    let var5847 = Zotero.AI4Paper.getRelatedItemsArray(var5846),
      var5848 = [];
    if (var5847.length === 0x0) return window.alert("当前条目无关联文献！"), -0x1;
    for (let var5849 of var5847) {
      try {
        let var5850 = var5849.getField("title");
        var5848.push(var5850 + " 🆔 " + var5849.itemID);
      } catch (_0x3d5064) {}
    }
    var5848.sort();
    Zotero.AI4Paper._action_removeRelatedItems = false;
    let var5851 = Zotero.AI4Paper.openDialogByType_modal("selectRelatedItems", var5848);
    if (!var5851) {
      return null;
    }
    let var5852 = [];
    Object.keys(var5851).forEach(async function (param1116) {
      let _0x2496fc = var5851[param1116];
      if (_0x2496fc.indexOf('🆔') != -0x1) {
        let var5854 = _0x2496fc.indexOf('🆔'),
          var5855 = _0x2496fc.substring(var5854 + 0x3);
        var5852.push(var5855);
      }
    });
    Zotero_Tabs.select("zotero-pane");
    await ZoteroPane_Local.selectItems(var5852);
  },
  'getRelatedItemsArray': function (param1117) {
    var var5856 = param1117.getRelations()["dc:relation"],
      var5857 = [];
    if (var5856) {
      for (let var5858 of var5856) {
        try {
          let _0x373168 = Zotero.URI.getURIItemID(var5858),
            _0x593d0c = Zotero.Items.get(_0x373168);
          var5857.push(_0x593d0c);
        } catch (_0x5a5a91) {}
      }
    }
    return var5857;
  },
  'getRelatedItemsIDsArray': function (param1118) {
    var var5861 = param1118.getRelations()["dc:relation"],
      var5862 = [];
    if (var5861) for (let var5863 of var5861) {
      try {
        let _0x327512 = Zotero.URI.getURIItemID(var5863),
          _0x40ab0c = Zotero.Items.get(_0x327512),
          _0x2063c7 = _0x40ab0c.getField("title");
        var5862.push(_0x327512);
      } catch (_0xf26b2a) {}
    }
    return var5862;
  },

  // === Block G: Star + Archive ===
  'starSelectedItems': async function (param1119) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) {
      return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    }
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return false;
    }
    Zotero.debug("AI4Paper: Star Selected items");
    let var5871 = 'rights',
      var5872 = Zotero.Prefs.get("ai4paper.starstyle");
    if (var5872 === '数字') var var5873 = param1119 + '⭐';else {
      var var5873 = Zotero.Prefs.get("ai4paper.starstyle").repeat(param1119);
    }
    let var5874 = Zotero_Tabs._selectedID;
    var var5875 = Zotero.Reader.getByTabID(var5874);
    if (var5875) {
      let var5876 = var5875.itemID,
        var5877 = Zotero.Items.get(var5876);
      if (var5877 && var5877.parentItemID) {
        var5876 = var5877.parentItemID;
        var5877 = Zotero.Items.get(var5876);
        if (Zotero.AI4Paper.checkItemField(var5877, var5871)) {
          var5877.setField(var5871, param1119 ? var5873 : '');
          await var5877.saveTx();
          if (param1119) this.showProgressWindow(0x1388, "⭐ 星标文献【AI4paper】", "您成功给予当前文献【" + var5873 + '】评价！', 'zoteorif');else {
            this.showProgressWindow(0x1388, "⭐ 取消文献星标【AI4paper】", "您成功取消当前文献的星标！", 'zoteorif');
          }
        }
      }
    } else {
      let var5878 = Zotero.getActiveZoteroPane().getSelectedItems();
      this._Num_AllSel = var5878.length;
      let var5879 = var5878.filter(_0x15f8be => _0x15f8be.isRegularItem());
      this._Num_Done = 0x0;
      for (let var5880 of var5879) {
        Zotero.AI4Paper.checkItemField(var5880, var5871) && (var5880.setField(var5871, param1119 ? var5873 : ''), await var5880.saveTx(), this._Num_Done++);
      }
      param1119 ? this.showProgressWindow(0x1388, "⭐ 星标文献【AI4paper】", "您成功给予【" + this._Num_Done + " of " + this._Num_AllSel + "】篇文献【" + var5873 + '】评价！', "zoteorif") : this.showProgressWindow(0x1388, "⭐ 取消文献星标【AI4paper】", '您成功取消【' + this._Num_Done + " of " + this._Num_AllSel + "】篇文献的星标！", "zoteorif");
    }
  },
  'archiveSelectedItems': async function () {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) {
      return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    }
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return false;
    }
    Zotero.debug('AI4Paper:\x20Archive\x20Selected\x20items');
    let var5893 = Zotero_Tabs._selectedID;
    var var5894 = Zotero.Reader.getByTabID(var5893);
    if (var5894) {
      let var5895 = var5894.itemID,
        var5896 = Zotero.Items.get(var5895);
      var5896 && var5896.parentItemID && (var5895 = var5896.parentItemID, var5896 = Zotero.Items.get(var5895), await Zotero.AI4Paper.archiveItem(var5896), this.showProgressWindow(0x1388, "✅ 归档文献 【AI4paper】", "恭喜，您已完成阅读（即归档）该文献！", 'zoteorif'));
    } else {
      let _0x5c8252 = Zotero.getActiveZoteroPane().getSelectedItems(),
        _0x36e86e = _0x5c8252.filter(_0x37f69c => _0x37f69c.isRegularItem());
      for (let var5899 of _0x36e86e) {
        await Zotero.AI4Paper.archiveItem(var5899);
      }
      this.showProgressWindow(0x1388, "✅ 归档文献 【AI4paper】", "成功归档【" + _0x36e86e.length + "】篇文献！", "zoteorif");
    }
  },
  'archiveItem': async function (param1122) {
    let var5900 = 'archive',
      var5901 = 'extra';
    if (Zotero.Prefs.get("ai4paper.tagscollectionField") === '其他') var5901 = "extra";else {
      if (Zotero.Prefs.get("ai4paper.tagscollectionField") === "存档位置") var5901 = 'archiveLocation';else {
        if (Zotero.Prefs.get('ai4paper.tagscollectionField') === '索书号') var5901 = "callNumber";else {
          if (Zotero.Prefs.get("ai4paper.tagscollectionField") === "文库编目") {
            var5901 = "libraryCatalog";
          }
        }
      }
    }
    param1122.removeTag(this.unreadTag);
    param1122.removeTag(this.readingTag);
    param1122.addTag(this.doneTag);
    await param1122.saveTx();
    await Zotero.Promise.delay(0xa);
    var var5902 = new Date(),
      var5903 = var5902.getDate(),
      var5904 = var5902.getMonth() + 0x1,
      var5905 = var5902.getFullYear();
    var5903 = var5903 < 0xa ? '0' + var5903 : var5903;
    var5904 = var5904 < 0xa ? '0' + var5904 : var5904;
    var var5906 = '' + var5903,
      var5907 = '' + var5904,
      var5908 = '' + var5905,
      var5909 = var5908 + '-' + var5907 + '-' + var5906;
    if (Zotero.Prefs.get("ai4paper.generatearchivedate") && Zotero.AI4Paper.checkItemField(param1122, var5900)) {
      param1122.setField(var5900, var5909);
      await param1122.saveTx();
    }
    await Zotero.Promise.delay(0xa);
    if (!Zotero.Prefs.get("ai4paper.tagscollectiondisable") && Zotero.AI4Paper.checkItemField(param1122, var5901)) {
      let var5910 = param1122.getTags().filter(_0x1a02f6 => !["/PDF_auto_download", "/citing", "/refs", "Researcher App"].includes(_0x1a02f6.tag)).map(_0x5c0e39 => _0x5c0e39.tag),
        var5911 = await Zotero.AI4Paper.getAnnotatioinTagsArray(param1122),
        var5912 = [...new Set(var5910.concat(var5911))];
      var5912.length ? param1122.setField(var5901, "🏷️ " + var5912.join('、')) : param1122.setField(var5901, '');
      await param1122.saveTx();
    }
  },

  // === Block H: Interpret/Batch + setLanguageField ===
  '_pendingItems': new Map(),
  'DEBOUNCE_DELAY': 0x1388,
  'clearTimeout_Interpret': function () {
    try {
      for (const var5963 of this._pendingItems.values()) {
        clearTimeout(var5963);
      }
      this._pendingItems.clear();
    } catch (_0x94626f) {
      Zotero.debug(_0x94626f);
    }
  },
  'interpretNewItems': async function (param1131) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return;
    for (const var5964 of param1131) {
      try {
        if (!var5964 || var5964.deleted) continue;
        if (var5964.isAttachment() && var5964.attachmentContentType === "application/pdf") {
          const var5965 = var5964.parentItem;
          if (var5965 && var5965.isRegularItem() && !var5965.deleted) {
            this.scheduleInterpret(var5965);
          }
          continue;
        }
        if (var5964.isRegularItem()) {
          const var5966 = var5964.getAttachments();
          let var5967 = false;
          for (const var5968 of var5966) {
            const var5969 = await Zotero.Items.getAsync(var5968);
            if (var5969 && var5969.attachmentContentType === "application/pdf") {
              var5967 = true;
              break;
            }
          }
          if (var5967) {
            this.scheduleInterpret(var5964);
          }
        }
      } catch (_0x4cd651) {
        Zotero.debug('AI解读\x20-\x20自动解读监听异常:\x20' + _0x4cd651.message);
      }
    }
  },
  'scheduleInterpret': function (param1132) {
    const var5970 = param1132.id;
    this._pendingItems.has(var5970) && clearTimeout(this._pendingItems.get(var5970));
    Zotero.debug('AI解读\x20-\x20计划自动解读「' + param1132.getField("title") + '」(' + this.DEBOUNCE_DELAY + "ms 后)");
    const var5971 = setTimeout(async () => {
      this._pendingItems['delete'](var5970);
      await this.doInterpret(param1132);
    }, this.DEBOUNCE_DELAY);
    this._pendingItems.set(var5970, var5971);
  },
  'doInterpret': async function (param1133) {
    try {
      const var5972 = await Zotero.Items.getAsync(param1133.id);
      if (!var5972 || var5972.deleted || !var5972.isRegularItem()) return;
      const var5973 = var5972.getNotes();
      for (const var5974 of var5973) {
        const var5975 = await Zotero.Items.getAsync(var5974);
        if (var5975 && var5975.getTags().some(_0xad9d82 => _0xad9d82.tag === Zotero.AI4Paper._aiReadingNoteTag)) {
          Zotero.debug("AI解读 - 「" + var5972.getField("title") + "」已有解读笔记，跳过自动解读");
          return;
        }
      }
      let var5976 = "batchAIInterpret",
        var5977 = Zotero.AI4Paper.getOpenedDialog("zoteroone-windowType-" + var5976, true);
      if (!var5977) {
        var5977 = Zotero.getMainWindow().openDialog('chrome://ai4paper/content/selectionDialog/' + var5976 + ".xhtml", var5976, "chrome,extrachrome,centerscreen,resizable,dialog=no");
        await new Promise(_0x2af6fd => {
          var5977.addEventListener("load", _0x2af6fd, {
            'once': true
          });
        });
        await new Promise(_0x51bce2 => setTimeout(_0x51bce2, 0x12c));
      }
      var5977.BatchAIInterpreter && (await var5977.BatchAIInterpreter.addItems([var5972]));
    } catch (_0x2a2fcf) {
      Zotero.debug("AI解读 - 自动解读执行异常: " + _0x2a2fcf.message);
    }
  },
  'batchInterpretItems': async function (param1134) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return;
    let var5978 = "batchAIInterpret",
      var5979 = Zotero.AI4Paper.getOpenedDialog("zoteroone-windowType-" + var5978, true);
    if (!var5979) {
      var5979 = Zotero.AI4Paper.openDialogByType(var5978);
      await new Promise(_0x437728 => {
        var5979.document.readyState === "complete" ? _0x437728() : var5979.addEventListener("load", _0x437728, {
          'once': true
        });
      });
      await Zotero.Promise.delay(0x64);
    }
    await var5979.BatchAIInterpreter.addItems(param1134);
    var5979.focus();
  },
  'batchInterpretSelectedItems': async function (param1135) {
    let var5980 = "📚 批量 AI 解读文献",
      var5981;
    if (param1135) {
      let {
        items: _0x36eabf,
        selectionType: _0x487c51,
        name: _0x3e375c,
        itemsAfterRecursion: _0x31b3f9,
        link: _0x210939
      } = await Zotero.AI4Paper.getItemsFromCurrentSelection(true);
      _0x36eabf = _0x36eabf.filter(_0x2b75db => _0x2b75db.isRegularItem());
      if (!_0x36eabf.length) return Services.prompt.alert(window, var5980, "您选择的 👉 “" + _0x487c51 + '”：【' + _0x3e375c + '】👈\x20中，不包含任何常规条目！'), false;
      var5981 = Services.prompt.confirm(window, var5980, "您选择的 👉 “" + _0x487c51 + '”：【' + _0x3e375c + "】👈 中，共有【" + _0x36eabf.length + "】篇常规条目文献，\n\n是否确认加入【" + var5980 + "】队列？");
      var5981 && Zotero.AI4Paper.batchInterpretItems(_0x36eabf);
    } else {
      if (Zotero_Tabs._selectedID === 'zotero-pane') {
        const var5982 = ZoteroPane.getSelectedItems().filter(_0x597510 => _0x597510.isRegularItem());
        if (!var5982.length) {
          return Services.prompt.alert(window, var5980, "❌ 未选中任何常规条目！请选择带有 PDF 附件的父条目！"), false;
        }
        if (var5982.length === 0x1 && Zotero.AI4Paper.findNoteItem_basedOnTag(var5982[0x0], Zotero.AI4Paper._aiReadingNoteTag)) return Services.prompt.alert(window, var5980, "❌ 当前文献【" + var5982[0x0]?.["getField"]("title") + "】已存在 AI 解读笔记附件，\n\n如需重新解读，请删除相应笔记附件后，再执行本操作。"), false;
        var5981 = Services.prompt.confirm(window, var5980, "当前选中了【" + var5982.length + "】篇常规条目文献，\n\n是否确认加入【" + var5980 + "】队列？");
        var5981 && Zotero.AI4Paper.batchInterpretItems(var5982);
      } else {
        if (Zotero_Tabs.getTabInfo(Zotero_Tabs._selectedID).type === "reader") {
          let var5983 = Zotero.AI4Paper.getCurrentItem(true);
          if (!var5983 || !var5983.isRegularItem()) return Services.prompt.alert(window, var5980, "❌ 当前 PDF 文献无父条目，请补充父条目后再操作。"), false;
          if (Zotero.AI4Paper.findNoteItem_basedOnTag(var5983, Zotero.AI4Paper._aiReadingNoteTag)) {
            return Services.prompt.alert(window, var5980, '❌\x20当前文献【' + var5983.getField("title") + '】已存在\x20AI\x20解读笔记附件，\x0a\x0a如需重新解读，请删除相应笔记附件后，再执行本操作。'), false;
          }
          var5981 = Services.prompt.confirm(window, var5980, "当前打开的文献为【" + var5983.getField('title') + '】，\x0a\x0a是否确认加入【' + var5980 + "】队列？");
          if (var5981) {
            Zotero.AI4Paper.batchInterpretItems([var5983]);
          }
        } else {
          if (Zotero_Tabs.getTabInfo(Zotero_Tabs._selectedID).type === 'note') {
            Services.prompt.alert(window, var5980, '❌\x20当前是笔记标签页！请选择\x20PDF\x20文献标签页，或者在主界面选择文献。');
            return;
          }
        }
      }
    }
  },
  'updateFooterUI_batchInterpret': function () {
    let var5984 = Zotero.AI4Paper.getOpenedDialog('zoteroone-windowType-batchAIInterpret');
    var5984 && var5984.updateFooterUI();
  },
  'updateNewItems': async function (param1136) {
    const var5985 = param1136.filter(_0x2ab1d0 => _0x2ab1d0.isRegularItem());
    if (Zotero.Prefs.get('ai4paper.updateifauto')) for (let var5986 of var5985) {
      this._Num_ToDo = 0x0;
      await this.updateItemIF(var5986);
    }
    await this.updateDOI_NewItems(var5985);
    for (let var5987 of var5985) {
      await this.addUnreadTag(var5987);
    }
    Zotero.Prefs.get("ai4paper.fetchcitationsauto") && (await this.updateItemsCitations(var5985));
    if (Zotero.Prefs.get("ai4paper.titletranslate")) {
      for (let var5988 of var5985) {
        await Zotero.AI4Paper.translationEngineTask_title_abstract(var5988, "title");
      }
    }
    if (Zotero.Prefs.get("ai4paper.retrievemetadataauto") && Zotero.Prefs.get('ai4paper.metadataabstract')) {
      for (let var5989 of var5985) {
        var5989.getField("abstractNote") === '' && (this._Data_Abstract = null, await Zotero.AI4Paper.fetchItemCitations(var5989), this._Data_Abstract != null && (var5989.setField("abstractNote", this._Data_Abstract), await var5989.saveTx()));
      }
    }
    if (Zotero.Prefs.get('ai4paper.abstracttranslate')) for (let var5990 of var5985) {
      await Zotero.AI4Paper.translationEngineTask_title_abstract(var5990, "abstractNote");
    }
    if (Zotero.Prefs.get('ai4paper.retrievemetadataauto')) {
      await Zotero.AI4Paper.updateItemsMetadata(var5985, true);
    }
    if (Zotero.Prefs.get("ai4paper.journalabbreviationlocaldatabasefirst")) for (let var5991 of var5985) {
      await Zotero.AI4Paper.fetchJournalAbbrLocal(var5991);
    }
    for (let var5992 of var5985) {
      await this.setLanguageField(var5992, null);
    }
    if (Zotero.Prefs.get("ai4paper.autoRenameNewAttachments")) {
      await this.renameAttachments(param1136.filter(_0x66011 => _0x66011.newFile != "true"));
    }
    Zotero.Prefs.get('ai4paper.autoInterpretNewItems') && (await this.interpretNewItems(param1136));
  },
  'setLanguageField': async function (param1139, param1140) {
    let var6000 = "language",
      var6001 = Zotero.Prefs.get("ai4paper.languagezh"),
      var6002 = Zotero.Prefs.get("ai4paper.languageen");
    if (param1140 === null && Zotero.AI4Paper.checkItemField(param1139, var6000) && Zotero.Prefs.get('ai4paper.languagesettingauto')) {
      Zotero.AI4Paper.isChineseText(param1139.getField('title')) ? param1139.setField(var6000, var6001) : param1139.setField(var6000, var6002);
      await param1139.saveTx();
    } else {
      if (param1140 === 'en') {
        param1139.setField(var6000, var6002);
        await param1139.saveTx();
      } else param1140 === 'zh' && (param1139.setField(var6000, var6001), await param1139.saveTx());
    }
  },

});
