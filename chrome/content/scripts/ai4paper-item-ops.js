// ai4paper-item-ops.js - Item operations, files history, workspace, attachments, export module
// Extracted from ai4paper.js (Phase 16)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Image Operations (PicGo, save, copy, upload) ===
  'getTargetPath': async function () {
    var {
        FilePicker: local52
      } = ChromeUtils.importESModule('chrome://zotero/content/modules/filePicker.mjs'),
      local57 = new local52();
    local57.init(window, "选择图片导出路径", local57.modeGetFolder);
    local57.appendFilters(local57.filterAll);
    if ((await local57.show()) != local57.returnOK) {
      return false;
    }
    var local58 = PathUtils.normalize(local57.file);
    return local58;
  },
  'saveImageToTargetPath': async function (param2, param6, paramH) {
    try {
      let str4 = '图片';
      if (paramH) {
        str4 = paramH + ".png";
      } else {
        str4 = Zotero.getString('fileTypes.image').toLowerCase() + '.png';
      }
      let local45;
      Zotero.isWin ? local45 = param6 + '\x5c' + str4 : local45 = param6 + '/' + str4;
      let parts2 = param2.split(',');
      if (parts2[0x0].includes("base64")) {
        let local59 = atob(parts2[0x1]),
          len3 = local59.length,
          arr3 = new Uint8Array(len3);
        while (len3--) {
          arr3[len3] = local59.charCodeAt(len3);
        }
        await OS.File.writeAtomic(local45, arr3);
      }
    } catch (e) {
      Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 导出图片出错啦", Zotero.getString(e));
    }
  },
  'saveImage': async function (paramJ, paramQ) {
    try {
      var {
        FilePicker: local35
      } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
      let local60 = new local35();
      local60.init(window, Zotero.getString('pdfReader.saveImageAs'), local60.modeSave);
      local60.appendFilter("PNG", "*.png");
      let str8 = '图片';
      if (paramQ) {
        str8 = paramQ + ".png";
      } else str8 = Zotero.getString("fileTypes.image").toLowerCase() + ".png";
      local60.defaultString = str8;
      let local61 = await local60.show();
      if (local61 === local60.returnOK || local61 === local60.returnReplace) {
        let local62 = local60.file,
          parts3 = paramJ.split(',');
        if (parts3[0x0].includes('base64')) {
          let local63 = atob(parts3[0x1]),
            len4 = local63.length,
            arr4 = new Uint8Array(len4);
          while (len4--) {
            arr4[len4] = local63.charCodeAt(len4);
          }
          await OS.File.writeAtomic(local62, arr4);
        }
      }
    } catch (e) {
      Zotero.AI4Paper.showProgressWindow(Zotero.getString(e));
    }
  },
  'copyImage': async function (paramS) {
    let parts4 = paramS.split(',');
    if (!parts4[0x0].includes("base64")) return;
    let local64 = parts4[0x0].match(/:(.*?);/)[0x1],
      local65 = atob(parts4[0x1]),
      len5 = local65.length,
      arr5 = new Uint8Array(len5);
    while (len5--) {
      arr5[len5] = local65.charCodeAt(len5);
    }
    let local66 = Components.classes['@mozilla.org/image/tools;1'].getService(Components.interfaces.imgITools),
      local67 = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable),
      local68 = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard),
      arr6 = local66.decodeImageFromArrayBuffer(arr5.buffer, local64);
    local67.init(null);
    let str9 = 'application/x-moz-nativeimage';
    local67.addDataFlavor(str9);
    local67.setTransferData(str9, arr6);
    local68.setData(local67, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
  },
  'onAnnotationImage': async function (paramT, paramU) {
    var local69;
    let prefVal3 = Zotero.Prefs.get("extensions.zotero.dataDir", true),
      result5 = Zotero.AI4Paper.checkGroupLibItem(paramT.parentItem.parentItem);
    if (result5) {
      local69 = prefVal3 + '\x5ccache\x5cgroups\x5c' + result5 + '\x5c' + paramU + ".png";
      if (Zotero.isMac || Zotero.isLinux) {
        local69 = prefVal3 + "/cache/groups/" + result5 + '/' + paramU + ".png";
      }
    } else {
      local69 = prefVal3 + "\\cache\\library\\" + paramU + ".png";
      (Zotero.isMac || Zotero.isLinux) && (local69 = prefVal3 + '/cache/library/' + paramU + ".png");
    }
    let str10 = '' + paramT.annotationComment;
    if (str10.indexOf('![](') != -0x1) {
      return false;
    }
    let local70 = 0x0;
    while (!(await OS.File.exists(local69))) {
      if (local70 >= 0x258) {
        Zotero.debug("AI4Paper: Waiting for image failed");
        Zotero.AI4Paper.showProgressWindow(0x4e20, "❌ 捕获图片失败 【PicGo】", "【可能原因】：Zotero 响应延迟，或者本图片同步自另一台设备的 Zotero。\n【可能措施】：您可以删除当前框选图片，并重新框选！或者搭配【上传图片】注释按钮。", "picgo");
        return;
      }
      await Zotero.Promise.delay(0xa);
      local70++;
    }
    let local71 = await Zotero.File.getBinaryContentsAsync(local69),
      str11 = "data:image/png;base64," + btoa(local71),
      tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) return false;
    Zotero.Prefs.get("ai4paper.annotationimageactions") === "自动拷贝图片" && Zotero.AI4Paper.copyImage(str11);
    str10.indexOf('![](') === -0x1 && Zotero.Prefs.get('ai4paper.annotationimageactions') === "自动通过 PicGo 上传至图床" && Zotero.AI4Paper.uploadByPicGo(paramT, local69);
  },
  'uploadByPicGo': async function (paramV, paramW) {
    var obj = {
        'list': [paramW]
      },
      xhr = new XMLHttpRequest(),
      str12 = "http://127.0.0.1:36677/upload";
    xhr.open("POST", str12, true);
    xhr.responseType = "json";
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.onreadystatechange = function () {
      if (!xhr.response.success) {
        Zotero.AI4Paper.showProgressWindow(0x4e20, '❌\x20图片上传失败\x20【PicGo】', xhr.response.success + "：上传失败！请检查网络或 PicGo 图床是否配置正确！", 'picgo');
      }
      xhr.readyState == 0x4 && xhr.status == 0xc8 && Zotero.AI4Paper.enhanceExtra() && xhr.response.success && (Zotero.AI4Paper.saveImageLinkCheck(paramV, xhr.response.result), Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 图片上传成功 【AI4paper】", "成功上传框选图片至图床，并返回链接:\n![](" + xhr.response.result + ')', "picgo"));
    };
    xhr.send(JSON.stringify(obj));
  },
  'saveImageLinkCheck': async function (paramX, paramY) {
    await Zotero.AI4Paper.saveImagePicgoMDLinK(paramX, paramY);
    await new Promise(resolve => setTimeout(resolve, 0x64));
    let str13 = '' + paramX.annotationComment;
    if (str13.indexOf("![](") === -0x1) {
      await Zotero.AI4Paper.saveImagePicgoMDLinK(paramX, paramY);
    }
  },
  'saveImagePicgoMDLinK': async function (paramZ, paramAA) {
    let str14 = '' + paramZ.annotationComment,
      str15 = "![](" + paramAA + ')';
    if (str14 === 'null') paramZ.annotationComment = '' + str15;else str14 != "null" && str14.indexOf("![](") === -0x1 && (paramZ.annotationComment = str14 + '\x0a' + str15);
    await paramZ.saveTx();
  },
  'getAnnotationImage': async function (paramAB, paramAC) {
    var local72;
    let prefVal4 = Zotero.Prefs.get("extensions.zotero.dataDir", true),
      result6 = Zotero.AI4Paper.checkGroupLibItem(paramAB.parentItem.parentItem);
    result6 ? (local72 = prefVal4 + "\\cache\\groups\\" + result6 + '\x5c' + paramAC + '.png', (Zotero.isMac || Zotero.isLinux) && (local72 = prefVal4 + "/cache/groups/" + result6 + '/' + paramAC + ".png")) : (local72 = prefVal4 + "\\cache\\library\\" + paramAC + ".png", (Zotero.isMac || Zotero.isLinux) && (local72 = prefVal4 + "/cache/library/" + paramAC + ".png"));
    let str16 = '' + paramAB.annotationComment;
    await new Promise(resolve => setTimeout(resolve, 0x32));
    if (await OS.File.exists(local72)) {
      Zotero.AI4Paper.uploadAnnotationImage(paramAB, local72);
    } else Services.prompt.alert(window, "❌ 上传注释图片", "出错啦！未在本地找到注释图片！");
  },
  'uploadAnnotationImage': async function (paramAD, paramAE) {
    var obj2 = {
        'list': [paramAE]
      },
      xhr2 = new XMLHttpRequest(),
      str17 = "http://127.0.0.1:36677/upload";
    xhr2.open('POST', str17, true);
    xhr2.responseType = "json";
    xhr2.setRequestHeader("Content-Type", "application/json");
    xhr2.onreadystatechange = function () {
      !xhr2.response.success && Services.prompt.alert(window, "❌ 图片上传失败 【PicGo】", xhr2.response.success + "：上传失败！请检查网络或 PicGo 图床是否配置正确！");
      xhr2.readyState == 0x4 && xhr2.status == 0xc8 && Zotero.AI4Paper.enhanceExtra() && xhr2.response.success && (Zotero.AI4Paper.returnImagePicgoMDLinK(paramAD, xhr2.response.result), Zotero.AI4Paper.showProgressWindow(0x1388, '✅\x20注释图片上传成功\x20【Zotero\x20One】', '成功上传注释图片至图床，并返回链接:\x0a![](' + xhr2.response.result + ')', "picgo"));
    };
    xhr2.send(JSON.stringify(obj2));
  },
  'returnImagePicgoMDLinK': async function (paramAF, paramAG) {
    let str18 = '' + paramAF.annotationComment,
      str19 = "![](" + paramAG + ')';
    if (str18 === 'null') paramAF.annotationComment = '' + str19;else {
      if (str18 != "null" && str18.indexOf('![](') === -0x1) paramAF.annotationComment = str18 + '\x0a' + str19;else {
        if (str18 != 'null' && str18.indexOf('![](') != -0x1) {
          let idx10 = str18.indexOf("![]("),
            substr2 = str18.substring(idx10),
            idx6 = substr2.indexOf(')'),
            substr6 = substr2.substring(0x4, idx6),
            str6 = '',
            str7 = '';
          substr2.length > substr6.length + 0x5 && (str7 = substr2.substring(substr6.length + 0x5));
          idx10 != 0x0 && (str6 = str18.substring(0x0, idx10));
          paramAF.annotationComment = '' + str6 + str19 + str7;
        }
      }
    }
    await paramAF.saveTx();
  },

  // === Block B: Misc Item Utils ===
  'getItemTitleByDOI': async function (paramAH) {
    let str20 = "https://api.crossref.org/works/" + paramAH,
      local73;
    try {
      return local73 = await Zotero.HTTP.request("GET", str20, {
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify({}),
        'responseType': 'json'
      }), local73.response.message.title[0x0];
    } catch (e) {
      return window.alert(e), false;
    }
  },
  'checkENZH': function (paramAI) {
    var local74 = new RegExp("[一-龥]+");
    if (local74.test(paramAI)) return 'zh';else {
      var local75 = new RegExp('[A-Za-z]+');
      return local75.test(paramAI) ? 'en' : "others";
    }
  },
  'getItemLink': function (paramAJ) {
    let local76 = Zotero.Libraries.get(paramAJ.libraryID).libraryType;
    if (local76 === "group") return "zotero://select/" + Zotero.URI.getLibraryPath(paramAJ.libraryID) + "/items/" + paramAJ.key;else {
      if (local76 === "user") {
        let str21 = 'library';
        return "zotero://select/library/items/" + paramAJ.key;
      }
    }
    return undefined;
  },

  // === Block C: Files History + Workspace ===
  'getFilesHistoryItemInfo': function (paramAK, paramAL, paramAM, paramAN, paramAO) {
    let local77 = paramAO ? "📃 " : '',
      str22 = '【' + paramAK + '】' + local77 + paramAL + " ⏰ " + paramAM + '\x20🆔\x20' + paramAN.key,
      str23 = '【' + paramAK + '】' + local77 + paramAL + '\x20🆔\x20' + paramAN.key;
    return {
      'info': str22,
      'info1': str23
    };
  },
  'findItemByIDORKey': function (paramAP) {
    let local78;
    if (!isNaN(parseFloat(paramAP)) && isFinite(paramAP)) local78 = Zotero.Items.get(paramAP);else {
      for (let i of Zotero.Libraries.getAll().map(item => item.libraryID)) {
        local78 = Zotero.Items.getByLibraryAndKey(i, paramAP);
        if (local78) {
          return local78;
        }
        continue;
      }
    }
    return local78;
  },
  'filesHistory': function (paramAQ) {
    let prefVal5 = Zotero.Prefs.get("ai4paper.fileshistory"),
      parts5 = prefVal5.split('😊🎈🍓'),
      date = new Date(),
      local79 = date.toLocaleDateString(),
      local80 = date.toLocaleTimeString("chinese", {
        'hour12': false
      }),
      local81 = local79 + '\x20' + local80,
      local82 = paramAQ.parentItem;
    if (local82 != undefined) {
      let fieldVal4 = local82.getField("title"),
        result4 = Zotero.AI4Paper.getItemLink(local82),
        str5 = '',
        collectionIDs2 = local82.getCollections();
      if (collectionIDs2.length != 0x0) {
        let arr7 = [];
        for (let i2 of collectionIDs2) {
          let collection = Zotero.Collections.get(i2);
          arr7.push(collection.name);
        }
        str5 = arr7.join(',\x20');
      } else str5 = '未分类';
      let {
          info: local39,
          info1: local46
        } = Zotero.AI4Paper.getFilesHistoryItemInfo(str5, fieldVal4, local81, local82),
        local47 = parts5[0x0],
        idx8 = local47.indexOf('⏰'),
        idx9 = local47.indexOf('🆔'),
        substr = local47.substring(0x0, idx8),
        substr3 = local47.substring(idx9),
        str2 = '' + substr + substr3;
      local46 != str2 && parts5.unshift(local39);
    } else {
      if (paramAQ.isRegularItem()) {
        let fieldVal = paramAQ.getField("title"),
          result2 = Zotero.AI4Paper.getItemLink(paramAQ),
          str = '',
          collectionIDs = paramAQ.getCollections();
        if (collectionIDs.length != 0x0) {
          let arr2 = [];
          for (let i3 of collectionIDs) {
            let collection2 = Zotero.Collections.get(i3);
            arr2.push(collection2.name);
          }
          str = arr2.join(',\x20');
        } else str = "未分类";
        let {
            info: local31,
            info1: local56
          } = Zotero.AI4Paper.getFilesHistoryItemInfo(str, fieldVal, local81, paramAQ),
          local9 = parts5[0x0],
          idx14 = local9.indexOf('⏰'),
          idx12 = local9.indexOf('🆔'),
          substr7 = local9.substring(0x0, idx14),
          substr4 = local9.substring(idx12),
          str3 = '' + substr7 + substr4;
        local56 != str3 && parts5.unshift(local31);
      } else {
        if (paramAQ.isAttachment()) {
          let fieldVal8 = paramAQ.getField("title"),
            result7 = Zotero.AI4Paper.getItemLink(paramAQ),
            str24 = '',
            collectionIDs3 = paramAQ.getCollections();
          if (collectionIDs3.length != 0x0) {
            let arr8 = [];
            for (let i4 of collectionIDs3) {
              let collection3 = Zotero.Collections.get(i4);
              arr8.push(collection3.name);
            }
            str24 = arr8.join(',\x20');
          } else str24 = "未分类";
          let {
              info: local6,
              info1: local33
            } = Zotero.AI4Paper.getFilesHistoryItemInfo(str24, fieldVal8, local81, paramAQ, true),
            local83 = parts5[0x0],
            idx15 = local83.indexOf('⏰'),
            idx16 = local83.indexOf('🆔'),
            substr10 = local83.substring(0x0, idx15),
            substr11 = local83.substring(idx16),
            str25 = '' + substr10 + substr11;
          if (local33 != str25) {
            parts5.unshift(local6);
          }
        }
      }
    }
    let result8 = Zotero.AI4Paper.letDOI(),
      arr9 = [];
    for (let i5 = 0x0; i5 < 0x3e8; i5++) {
      parts5[i5] != undefined && arr9.push(parts5[i5]);
    }
    result8 && Zotero.Prefs.set('ai4paper.fileshistory', arr9.join("😊🎈🍓"));
  },
  'openWorkSpaceWindow': function () {
    Zotero.AI4Paper._data_useWorkSpaceView = true;
    Zotero.AI4Paper.openDialog_filesHistory();
  },
  'openDialog_filesHistory': function () {
    Zotero.AI4Paper.openDialogByType("filesHistory");
  },
  'go2FilesHistoryItem': async function (arg2) {
    if (arg2.indexOf('🆔') != -0x1) {
      let idx17 = arg2.indexOf('🆔'),
        substr12 = arg2.substring(idx17 + 0x3),
        result9 = Zotero.AI4Paper.findItemByIDORKey(substr12);
      if (!result9) {
        window.alert("未查询到该文献，可能已经被您删除！");
        return;
      }
      Zotero.AI4Paper.showDate() && Zotero.AI4Paper.showItemInCollection(result9);
    }
  },
  'openFilesHistoryItem': async function (paramAR) {
    for (let i6 of paramAR) {
      if (i6.indexOf('🆔') != -0x1) {
        let idx13 = i6.indexOf('🆔'),
          substr9 = i6.substring(idx13 + 0x3),
          result3 = Zotero.AI4Paper.findItemByIDORKey(substr9);
        if (!result3) {
          return Zotero.AI4Paper.showProgressWindow(0xbb8, "【AI4paper】最近打开", "❌ 未查询到该文献，可能已经被您删除！"), false;
        }
        if (result3.isRegularItem()) {
          let attachment2 = await result3.getBestAttachment();
          if (!attachment2) {
            Zotero.AI4Paper.showProgressWindow(0xbb8, "【AI4paper】最近打开", "❌ 该条目无附件可打开！");
            return;
          }
          Zotero.Reader.open(attachment2.id, null, {
            'openInWindow': false
          });
        } else {
          if (result3.isAttachment) {
            if (["application/pdf", "text/html", "application/epub+zip"].includes(result3.attachmentContentType)) {
              if (result3.attachmentLinkMode === 0x3) return;
              Zotero.Reader.open(result3.id, null, {
                'openInWindow': false
              });
            } else Zotero.AI4Paper.showProgressWindow(0xbb8, '【Zotero\x20One】最近打开', "❌ 该条目非【PDF/Epub/网页快照】类型附件，无法打开！");
          }
        }
      }
    }
  },
  'getBeforeDate': function (paramAS) {
    const local84 = paramAS,
      date2 = new Date();
    let local85 = date2.getFullYear(),
      local86 = date2.getMonth() + 0x1,
      local87 = date2.getDate();
    if (local87 <= local84) {
      if (local86 > 0x1) {
        local86 = local86 - 0x1;
      } else {
        local85 = local85 - 0x1;
        local86 = 0xc;
      }
    }
    date2.setDate(date2.getDate() - local84);
    local85 = date2.getFullYear();
    local86 = date2.getMonth() + 0x1;
    local87 = date2.getDate();
    const local88 = local85 + '/' + local86 + '/' + local87;
    return local88;
  },
  'dateDiff': function (paramAT, paramAU) {
    var date3 = (new Date(paramAT) - new Date(paramAU)) / 0x3e8,
      local89 = parseInt(date3 / 0x15180);
    if (local89 >= 0x0) {
      return true;
    } else {
      return false;
    }
  },
  'getFilesHistory': function () {
    let prefVal6 = Zotero.Prefs.get('ai4paper.fileshistory'),
      parts6 = prefVal6.split('😊🎈🍓'),
      arr10 = [];
    for (let len6 = 0x0; len6 < parts6.length; len6++) {
      parts6[len6] != '' && arr10.push('[' + (len6 + 0x1) + ']\x20' + parts6[len6]);
    }
    return arr10;
  },
  'getFilesHistoryToday': function () {
    let prefVal7 = Zotero.Prefs.get("ai4paper.fileshistory"),
      result10 = Zotero.AI4Paper.getBeforeDate(0x0);
    var arr11 = [];
    let parts7 = prefVal7.split("😊🎈🍓"),
      arr12 = [],
      arr13 = [];
    for (let len7 = 0x0; len7 < parts7.length; len7++) {
      parts7[len7] != '' && arr12.push(parts7[len7]);
    }
    for (let len8 = 0x0; len8 < arr12.length; len8++) {
      let idx18 = arr12[len8].indexOf('⏰'),
        idx19 = arr12[len8].indexOf('🆔'),
        substr13 = arr12[len8].substring(idx18 + 0x2, idx19 - 0x1);
      substr13 = substr13.substring(0x0, substr13.indexOf('\x20'));
      if (Zotero.AI4Paper.dateDiff(substr13, result10)) {
        arr13.push(arr12[len8]);
      }
    }
    for (let len9 = 0x0; len9 < arr13.length; len9++) {
      arr11.push('[' + (len9 + 0x1) + ']\x20' + arr13[len9]);
    }
    return arr11;
  },
  'getFilesHistoryLastDay': function () {
    let prefVal8 = Zotero.Prefs.get("ai4paper.fileshistory"),
      result11 = Zotero.AI4Paper.getBeforeDate(0x1);
    var arr14 = [];
    let parts8 = prefVal8.split('😊🎈🍓'),
      arr15 = [],
      arr16 = [];
    for (let len10 = 0x0; len10 < parts8.length; len10++) {
      parts8[len10] != '' && arr15.push(parts8[len10]);
    }
    for (let len11 = 0x0; len11 < arr15.length; len11++) {
      let idx11 = arr15[len11].indexOf('⏰'),
        idx3 = arr15[len11].indexOf('🆔'),
        substr5 = arr15[len11].substring(idx11 + 0x2, idx3 - 0x1);
      substr5 = substr5.substring(0x0, substr5.indexOf('\x20'));
      Zotero.AI4Paper.dateDiff(substr5, result11) && arr16.push(arr15[len11]);
    }
    for (let len12 = 0x0; len12 < arr16.length; len12++) {
      arr14.push('[' + (len12 + 0x1) + ']\x20' + arr16[len12]);
    }
    return arr14;
  },
  'getFilesHistoryLastWeek': function () {
    let prefVal9 = Zotero.Prefs.get("ai4paper.fileshistory"),
      result12 = Zotero.AI4Paper.getBeforeDate(0x7);
    var arr17 = [];
    let parts9 = prefVal9.split("😊🎈🍓"),
      arr18 = [],
      arr19 = [];
    for (let len13 = 0x0; len13 < parts9.length; len13++) {
      parts9[len13] != '' && arr18.push(parts9[len13]);
    }
    for (let len14 = 0x0; len14 < arr18.length; len14++) {
      let idx20 = arr18[len14].indexOf('⏰'),
        idx21 = arr18[len14].indexOf('🆔'),
        substr14 = arr18[len14].substring(idx20 + 0x2, idx21 - 0x1);
      substr14 = substr14.substring(0x0, substr14.indexOf('\x20'));
      if (Zotero.AI4Paper.dateDiff(substr14, result12)) {
        arr19.push(arr18[len14]);
      }
    }
    for (let len15 = 0x0; len15 < arr19.length; len15++) {
      arr17.push('[' + (len15 + 0x1) + ']\x20' + arr19[len15]);
    }
    return arr17;
  },
  'getFilesHistoryLastMonth': function () {
    let prefVal10 = Zotero.Prefs.get("ai4paper.fileshistory"),
      result13 = Zotero.AI4Paper.getBeforeDate(0x1e);
    var arr20 = [];
    let parts10 = prefVal10.split('😊🎈🍓'),
      arr21 = [],
      arr22 = [];
    for (let len16 = 0x0; len16 < parts10.length; len16++) {
      parts10[len16] != '' && arr21.push(parts10[len16]);
    }
    for (let len17 = 0x0; len17 < arr21.length; len17++) {
      let idx22 = arr21[len17].indexOf('⏰'),
        idx23 = arr21[len17].indexOf('🆔'),
        substr15 = arr21[len17].substring(idx22 + 0x2, idx23 - 0x1);
      substr15 = substr15.substring(0x0, substr15.indexOf('\x20'));
      Zotero.AI4Paper.dateDiff(substr15, result13) && arr22.push(arr21[len17]);
    }
    for (let len18 = 0x0; len18 < arr22.length; len18++) {
      arr20.push('[' + (len18 + 0x1) + ']\x20' + arr22[len18]);
    }
    return arr20;
  },
  'getFilesHistorySearch': function (paramAV) {
    let prefVal11 = Zotero.Prefs.get("ai4paper.fileshistory"),
      parts11 = prefVal11.split("😊🎈🍓"),
      arr23 = [];
    for (let len19 = 0x0; len19 < parts11.length; len19++) {
      parts11[len19] != '' && arr23.push('[' + (len19 + 0x1) + ']\x20' + parts11[len19]);
    }
    var arr24 = [];
    for (let i7 of arr23) {
      if (i7.indexOf('🆔') != -0x1) {
        let idx24 = i7.indexOf('🆔'),
          substr16 = i7.substring(idx24 + 0x3),
          result14 = Zotero.AI4Paper.findItemByIDORKey(substr16);
        if (result14) try {
          let fieldVal9 = result14.getField("title").toLowerCase();
          fieldVal9.indexOf(paramAV.toLowerCase()) != -0x1 && arr24.push(i7);
        } catch (e) {}
      }
    }
    return arr24;
  },
  'openDialog_setWorkSpaceName': function (paramAW, paramAX) {
    var obj3 = {
        'action': paramAW,
        'dataIn': paramAX,
        'dataOut': null
      },
      local90 = window.openDialog("chrome://ai4paper/content/selectionDialog/setWorkSpaceName.xhtml", "_blank", "chrome,modal,centerscreen,resizable=yes", obj3);
    return obj3.dataOut;
  },
  'createTabsAsWorkSpace': function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let local91 = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(item => item.id != "zotero-pane"),
      local92 = local91.map(item => item.data.itemID);
    if (!local92.length) return window.alert("未打开任何文献（即标签页）！"), false;
    let prefVal12 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      local93 = Object.values(prefVal12).map(item => item.workSpaceName),
      len20 = Zotero.AI4Paper.openDialog_setWorkSpaceName("add", local92.length);
    if (!len20) {
      return;
    }
    if (local93.includes(len20)) {
      window.alert("您输入的【" + len20 + '】与现有工作区名称重复，请重新输入！');
      return;
    }
    let arr25 = [];
    for (let i8 of local92) {
      let item8 = Zotero.Items.get(i8);
      item8 && arr25.push(item8.key);
    }
    let obj4 = {
      'workSpaceName': len20,
      'workSpaceItemsKey': arr25
    };
    return prefVal12.push(obj4), Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(prefVal12)), prefVal12;
  },
  'renameWorkSpace': function (paramAY) {
    let result15 = Zotero.AI4Paper.openDialog_setWorkSpaceName("rename", paramAY);
    if (!result15.trim()) return window.alert("不允许为空值！已停止重命名。"), false;else {
      if (result15.trim() === paramAY) {
        return window.alert('两次名称相同！'), false;
      } else {
        let prefVal2 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")).map(item => item.workSpaceName);
        if (prefVal2.includes(result15)) return window.alert("您输入的【" + result15 + "】与现有工作区名称重复，请重新输入！"), false;
      }
    }
    let prefVal13 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let len21 = 0x0; len21 < prefVal13.length; len21++) {
      if (prefVal13[len21].workSpaceName === paramAY) return prefVal13[len21].workSpaceName = result15, Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(prefVal13)), result15;
    }
    return false;
  },
  'setTopWorkSpace': function (paramAZ) {
    let prefVal14 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let len22 = 0x0; len22 < prefVal14.length; len22++) {
      if (prefVal14[len22].workSpaceName === paramAZ) {
        const local17 = prefVal14[len22];
        return prefVal14.splice(len22, 0x1), prefVal14.unshift(local17), Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(prefVal14)), paramAZ;
      }
    }
    return false;
  },
  'moveUpWorkSpace': function (paramBA) {
    let prefVal15 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let len23 = 0x0; len23 < prefVal15.length; len23++) {
      if (prefVal15[len23].workSpaceName === paramBA) {
        if (len23 === 0x0) {
          const local38 = prefVal15.shift();
          prefVal15.push(local38);
        } else [prefVal15[len23 - 0x1], prefVal15[len23]] = [prefVal15[len23], prefVal15[len23 - 0x1]];
        return Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(prefVal15)), paramBA;
      }
    }
    return false;
  },
  'moveDownWorkSpace': function (paramBB) {
    let prefVal16 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let len24 = 0x0; len24 < prefVal16.length; len24++) {
      if (prefVal16[len24].workSpaceName === paramBB) {
        if (len24 === prefVal16.length - 0x1) {
          const local94 = prefVal16.pop();
          prefVal16.unshift(local94);
        } else [prefVal16[len24], prefVal16[len24 + 0x1]] = [prefVal16[len24 + 0x1], prefVal16[len24]];
        return Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(prefVal16)), paramBB;
      }
    }
    return false;
  },
  'setTopWorkSpaceItem': function (paramBC, paramBD) {
    let prefVal17 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let len25 = 0x0; len25 < prefVal17.length; len25++) {
      if (prefVal17[len25].workSpaceName === paramBC) {
        for (let len26 = 0x0; len26 < prefVal17[len25].workSpaceItemsKey.length; len26++) {
          if (prefVal17[len25].workSpaceItemsKey[len26] === paramBD) return prefVal17[len25].workSpaceItemsKey.splice(len26, 0x1), prefVal17[len25].workSpaceItemsKey.unshift(paramBD), Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(prefVal17)), paramBC;
        }
      }
    }
    return false;
  },
  'moveUpWorkSpaceItem': function (paramBE, paramBF) {
    let prefVal18 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let len27 = 0x0; len27 < prefVal18.length; len27++) {
      if (prefVal18[len27].workSpaceName === paramBE) {
        for (let len28 = 0x0; len28 < prefVal18[len27].workSpaceItemsKey.length; len28++) {
          if (prefVal18[len27].workSpaceItemsKey[len28] === paramBF) {
            return len28 === 0x0 ? (prefVal18[len27].workSpaceItemsKey.shift(), prefVal18[len27].workSpaceItemsKey.push(paramBF)) : [prefVal18[len27].workSpaceItemsKey[len28 - 0x1], prefVal18[len27].workSpaceItemsKey[len28]] = [prefVal18[len27].workSpaceItemsKey[len28], prefVal18[len27].workSpaceItemsKey[len28 - 0x1]], Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(prefVal18)), paramBE;
          }
        }
      }
    }
    return false;
  },
  'moveDownWorkSpaceItem': function (paramBG, paramBH) {
    let prefVal19 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let len29 = 0x0; len29 < prefVal19.length; len29++) {
      if (prefVal19[len29].workSpaceName === paramBG) for (let len30 = 0x0; len30 < prefVal19[len29].workSpaceItemsKey.length; len30++) {
        if (prefVal19[len29].workSpaceItemsKey[len30] === paramBH) {
          return len30 === prefVal19[len29].workSpaceItemsKey.length - 0x1 ? (prefVal19[len29].workSpaceItemsKey.pop(), prefVal19[len29].workSpaceItemsKey.unshift(paramBH)) : [prefVal19[len29].workSpaceItemsKey[len30], prefVal19[len29].workSpaceItemsKey[len30 + 0x1]] = [prefVal19[len29].workSpaceItemsKey[len30 + 0x1], prefVal19[len29].workSpaceItemsKey[len30]], Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(prefVal19)), paramBG;
        }
      }
    }
    return false;
  },
  'addCurrentTab2WorkSpace': function (paramBI) {
    let tabID2 = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(item => item.id != "zotero-pane" && item.id === Zotero_Tabs._selectedID);
    if (!tabID2.length) {
      return window.alert("请切换至目标文献的标签页！"), false;
    }
    let local95,
      local96 = tabID2[0x0].data.itemID,
      item9 = Zotero.Items.get(local96);
    if (item9) local95 = item9.key;else return window.alert('条目不存在！'), false;
    let prefVal20 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let len31 = 0x0; len31 < prefVal20.length; len31++) {
      if (prefVal20[len31].workSpaceName === paramBI) {
        let local97 = prefVal20[len31].workSpaceItemsKey;
        if (local97.includes(local95)) {
          return window.alert("❌ 当前工作区已存在该文献，无须重复添加！"), false;
        }
        return local97.push(local95), prefVal20[len31].workSpaceItemsKey = local97, Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(prefVal20)), paramBI;
      }
    }
    return false;
  },
  'addAllTabs2WorkSpace': function (paramBJ) {
    let local98 = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(item => item.id != "zotero-pane"),
      local99 = local98.map(item => item.data.itemID);
    if (!local99.length) return window.alert("未打开任何文献（即标签页），无法添加！"), false;
    let arr26 = [];
    for (let i9 of local99) {
      let item10 = Zotero.Items.get(i9);
      item10 && arr26.push(item10.key);
    }
    let prefVal21 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let len32 = 0x0; len32 < prefVal21.length; len32++) {
      if (prefVal21[len32].workSpaceName === paramBJ) {
        let local100 = 0x0,
          local101 = prefVal21[len32].workSpaceItemsKey;
        for (let i10 of arr26) {
          local101.includes(i10) ? local100++ : local101.push(i10);
        }
        if (arr26.length === local100) return window.alert('❌\x20所有标签页文献均已在工作区中，无须再添加！'), false;
        let len33 = window.confirm("是否确认将所有【" + arr26.length + "】篇标签页文献添加至工作区【" + paramBJ + "】？（其中【" + local100 + '】篇已存在工作区内）');
        if (len33) return prefVal21[len32].workSpaceItemsKey = local101, Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(prefVal21)), paramBJ;else {
          return false;
        }
      }
    }
    return false;
  },
  'removeItemFromWorkSpace': function (paramBK, paramBL) {
    let prefVal22 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let len34 = 0x0; len34 < prefVal22.length; len34++) {
      if (prefVal22[len34].workSpaceName === paramBK) {
        let local54 = prefVal22[len34].workSpaceItemsKey;
        if (!local54.length) {
          return window.alert("当前工作区无文献！"), false;
        }
        let idx = local54.indexOf(paramBL);
        if (idx === -0x1) return;
        local54.splice(idx, 0x1);
        let local5 = window.confirm("是否确认从工作区【" + paramBK + "】移除当前文献？");
        if (local5) {
          return prefVal22[len34].workSpaceItemsKey = local54, Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(prefVal22)), paramBK;
        } else return false;
      }
    }
    return false;
  },
  'removeSelectedItemsFromWorkSpace': function (paramBM, paramBN) {
    let prefVal23 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let len35 = 0x0; len35 < prefVal23.length; len35++) {
      if (prefVal23[len35].workSpaceName === paramBM) {
        let local102 = prefVal23[len35].workSpaceItemsKey;
        if (!local102.length) return window.alert("当前工作区无文献！"), false;
        for (itemKey of paramBN) {
          let idx5 = local102.indexOf(itemKey);
          if (idx5 === -0x1) return;
          local102.splice(idx5, 0x1);
        }
        let len36 = window.confirm("是否确认从工作区【" + paramBM + "】移除选中的【" + paramBN.length + '】篇文献？');
        if (len36) {
          return prefVal23[len35].workSpaceItemsKey = local102, Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(prefVal23)), paramBM;
        } else return false;
      }
    }
    return false;
  },
  'removeAllItemsFromWorkSpace': function (paramBO) {
    let prefVal24 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let len37 = 0x0; len37 < prefVal24.length; len37++) {
      if (prefVal24[len37].workSpaceName === paramBO) {
        if (!prefVal24[len37].workSpaceItemsKey.length) {
          return window.alert("❌ 工作区【" + paramBO + '】已经为空！'), false;
        }
        let len38 = window.confirm("是否确认清空工作区【" + paramBO + "】内的全部【" + prefVal24[len37].workSpaceItemsKey.length + "】篇文献？👉一旦清空，将无法恢复。👈");
        if (len38) {
          return prefVal24[len37].workSpaceItemsKey = [], Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(prefVal24)), paramBO;
        } else {
          return false;
        }
      }
    }
    return false;
  },
  'replaceWorkSpaceItems': function (paramBP) {
    let local103 = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(item => item.id != "zotero-pane"),
      local104 = local103.map(item => item.data.itemID);
    if (!local104.length) return window.alert("未打开任何文献（即标签页），无法替换！"), false;
    let arr27 = [];
    for (let i11 of local104) {
      let item7 = Zotero.Items.get(i11);
      item7 && arr27.push(item7.key);
    }
    let prefVal25 = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let len39 = 0x0; len39 < prefVal25.length; len39++) {
      if (prefVal25[len39].workSpaceName === paramBP) {
        let len40 = window.confirm("是否确认将当前打开的【" + arr27.length + "】篇文献替换【" + paramBP + '】工作区内的全部文献？');
        if (len40) return prefVal25[len39].workSpaceItemsKey = arr27, Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(prefVal25)), paramBP;else {
          return false;
        }
      }
    }
    return false;
  },
  'deleteWorkSpace': function (paramBQ) {
    let prefVal26 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let len41 = 0x0; len41 < prefVal26.length; len41++) {
      if (prefVal26[len41].workSpaceName === paramBQ) {
        return prefVal26.splice(len41, 0x1), Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(prefVal26)), true;
      }
    }
    return false;
  },
  'copyWorkSpaceSummary': function (paramBR) {
    let prefVal27 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      local105 = null;
    for (let i12 of prefVal27) {
      if (i12.workSpaceName === paramBR) {
        local105 = i12;
      }
    }
    let arr28 = [];
    if (local105) {
      let local25 = local105.workSpaceItemsKey,
        local13 = 0x1;
      for (let i13 of local25) {
        for (let i14 of Zotero.Libraries.getAll().map(item => item.libraryID)) {
          let local106 = Zotero.Items.getByLibraryAndKey(i14, i13);
          local106 && (arr28.push("- [" + local13 + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(local106) + '】' + local106.getField("title") + " 🆔 " + local106.key), local13++);
        }
      }
      Zotero.AI4Paper.copy2Clipboard("## 工作区【" + paramBR + '】共有【' + arr28.length + '】篇文献\x0a\x0a' + arr28.join('\x0a'));
      Zotero.AI4Paper.showProgressWindow(0xbb8, "拷贝工作区概要【AI4paper】", '✅\x20工作区【' + paramBR + "】概要已拷贝，共【" + arr28.length + "】篇文献！");
    } else window.alert('工作区【' + paramBR + "】内无文献！");
    return arr28;
  },
  'copyAllWorkSpacesSummary': function () {
    let prefVal28 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      arr29 = [];
    for (let i15 of prefVal28) {
      let arr = [],
        local24 = i15.workSpaceItemsKey,
        local29 = 0x1;
      for (let i16 of local24) {
        for (let i17 of Zotero.Libraries.getAll().map(item => item.libraryID)) {
          let local16 = Zotero.Items.getByLibraryAndKey(i17, i16);
          local16 && (arr.push("- [" + local29 + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(local16) + '】' + local16.getField('title') + " 🆔 " + local16.key), local29++);
        }
      }
      arr.length && arr29.push("## 工作区【" + i15.workSpaceName + "】共有【" + arr.length + "】篇文献\n\n" + arr.join('\x0a'));
    }
    if (arr29.length) {
      Zotero.AI4Paper.copy2Clipboard('' + arr29.join("\n\n\n"));
      Zotero.AI4Paper.showProgressWindow(0xbb8, "拷贝全部工作区概要【AI4paper】", "✅ 已拷贝全部【" + arr29.length + "】个工作区的概要！");
    } else {
      window.alert("未获取到工作区数据！");
    }
    return arr29;
  },
  'getWorkSpaceItemsInfo': function (paramBS) {
    let prefVal29 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      local107 = null;
    for (let i18 of prefVal29) {
      i18.workSpaceName === paramBS && (local107 = i18);
    }
    let arr30 = [];
    if (local107) {
      let local108 = local107.workSpaceItemsKey,
        local109 = 0x1;
      for (let i19 of local108) {
        for (let i20 of Zotero.Libraries.getAll().map(item => item.libraryID)) {
          let local110 = Zotero.Items.getByLibraryAndKey(i20, i19);
          local110 && (arr30.push('[' + local109 + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(local110) + '】' + local110.getField("title") + " 🆔 " + local110.key), local109++);
        }
      }
    }
    return arr30;
  },
  'searchWorkSpaceItems': function (paramBT, paramBU) {
    let prefVal30 = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      local111 = null;
    for (let i21 of prefVal30) {
      i21.workSpaceName === paramBT && (local111 = i21);
    }
    let arr31 = [];
    if (local111) {
      let local112 = local111.workSpaceItemsKey,
        local113 = 0x1;
      for (let i22 of local112) {
        for (let i23 of Zotero.Libraries.getAll().map(item => item.libraryID)) {
          let local114 = Zotero.Items.getByLibraryAndKey(i23, i22);
          if (local114) {
            let fieldVal3 = local114.getField("title").toLowerCase();
            fieldVal3.indexOf(paramBU.toLowerCase()) != -0x1 && (arr31.push('[' + local113 + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(local114) + '】' + local114.getField("title") + " 🆔 " + local114.key), local113++);
          }
        }
      }
    }
    return arr31;
  },

  // === Block D: File/Attachment Operations ===
  'showFile': async function () {
    async function localFn(paramBV) {
      if (paramBV.isAttachment()) {
        if (paramBV.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) return false;
        return paramBV;
      } else return await paramBV.getBestAttachment();
    }
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    var tabID3 = Zotero.Reader.getByTabID(Zotero_Tabs._selectedID);
    if (tabID3) {
      let local115 = tabID3.itemID;
      var item11 = Zotero.Items.get(local115);
      item11.isAttachment() && ZoteroPane_Local.showAttachmentInFilesystem(item11.id);
    } else {
      var local116 = ZoteroPane.getSelectedItems();
      for (let i24 of local116) {
        var item11 = await localFn(i24);
        item11 && ZoteroPane_Local.showAttachmentInFilesystem(item11.id);
      }
    }
  },
  'attachNewFile': async function () {
    function localFn2(paramBW) {
      var local117 = Zotero.File.pathToFile(paramBW),
        parts12 = Zotero.Prefs.get("ai4paper.fileTypes").split(',').map(item => item.trim().toLowerCase()),
        local118 = local117.directoryEntries,
        obj5 = {
          'lastModifiedTime': 0x0
        };
      while (local118.hasMoreElements()) {
        var local119 = local118.getNext().QueryInterface(Components.interfaces.nsIFile),
          local120 = localFn3(local119.leafName).toLowerCase();
        if (local119.isDirectory() || local119.isHidden() || !parts12.includes(local120)) continue;
        if (local119.isFile() && local119.lastModifiedTime > obj5.lastModifiedTime) obj5 = local119;
      }
      return obj5.lastModifiedTime == 0x0 ? undefined : obj5.path;
    }
    function localFn3(paramBX) {
      var local121 = paramBX.lastIndexOf('.');
      return local121 == -0x1 ? '' : paramBX.substr(local121 + 0x1);
    }
    async function localFn4(paramBY, paramBZ) {
      let obj6 = {
        'file': paramBZ,
        'libraryID': paramBY.libraryID,
        'parentItemID': paramBY.id,
        'collections': undefined
      };
      var local122 = await Zotero.Attachments.importFromFile(obj6);
      local122.newFile = "true";
      if (Zotero.Prefs.get("ai4paper.deleteSourceFileWhenAttached")) {
        paramBZ != local122.getFilePath() && OS.File.remove(paramBZ);
      }
      if (Zotero.Prefs.get('ai4paper.renameAfterAttaching')) {
        await Zotero.AI4Paper.renameAttachments([local122]);
      }
    }
    if (Zotero_Tabs._selectedID != "zotero-pane") return;
    var local123 = ZoteroPane.getSelectedItems()[0x0];
    if (!local123) return;
    local123 = !local123.isTopLevelItem() ? Zotero.Items.get(local123.parentItemID) : local123;
    if (local123.library.libraryType === "feed") {
      window.alert("该条目为 RSS 订阅条目，无法执行本操作！");
      return;
    }
    if (!local123.isEditable()) {
      window.alert("您没有该条目的编辑权限！");
      return;
    }
    if (!local123.isRegularItem()) {
      window.alert("请选择一个常规条目！");
      return;
    }
    var prefVal31 = Zotero.Prefs.get("ai4paper.newfileDirectory");
    if (!prefVal31 || !(await OS.File.exists(prefVal31))) return window.alert("新文件监控目录未设置，或该目录不存在！请前往【AI4paper --> 附件管理】设置。"), false;
    var arr32 = [localFn2(prefVal31)];
    if (!arr32[0x0]) {
      window.alert("获取最新文件失败！");
      return;
    }
    let local124 = Services.prompt.confirm(window, "📎 绑定新文件", "是否要绑定文件：" + OS.Path.basename(arr32[0x0]));
    if (!local124) return false;
    for (var len42 = 0x0; len42 < arr32.length; len42++) {
      await localFn4(local123, arr32[len42]);
    }
  },
  'is4AttachNewFile': function () {
    var local125 = ZoteroPane.getSelectedItems()[0x0];
    if (!local125 || !local125.isTopLevelItem() || !local125.isRegularItem() || local125.library.libraryType === 'feed' || !local125.isEditable()) return false;
    return true;
  },
  'renameAttachments': async function (paramCA) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    var parts13 = Zotero.Prefs.get("ai4paper.fileTypes").split(',').map(item => item.trim().toLowerCase());
    let local126 = 0x0,
      local127 = false;
    if (!paramCA) {
      var local128 = ZoteroPane.getSelectedItems();
    } else {
      var local128 = paramCA;
    }
    if (!paramCA && Zotero.AI4Paper.hasAttachmentItem() && Zotero.Prefs.get("ai4paper.enableRenameTemplate")) {
      let result16 = Zotero.AI4Paper.openDialogByType_modal("selectRenameStyle");
      if (result16[0x0]) {
        Zotero.Prefs.set("ai4paper.lastRenameStyle", result16[0x0]);
        var local129 = result16[0x0];
        if (local129 === "默认：按父级元数据") local127 = false;else {
          if (local129 === "自定：手动输入名称") {
            local129 = window.prompt('请输入想要的名称：', '');
            if (local129.trim()) {
              local127 = true;
            }
          } else local127 = true;
        }
      }
    }
    for (let i25 of local128) {
      if (i25.isRegularItem()) {
        let attachmentIDs4 = i25.getAttachments();
        for (let i26 of attachmentIDs4) {
          let item12 = Zotero.Items.get(i26);
          if (!Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && item12.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) continue;else {
            if (Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && (item12.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL || item12.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_FILE)) continue;
          }
          var local130 = await item12.getFilePathAsync();
          if (!local130) continue;
          let local131 = item12.parentItemID,
            local132 = await Zotero.Items.getAsync(local131);
          var local133 = Zotero.Attachments.getFileBaseNameFromItem(local132);
          let local134 = /\.[^\.]+$/,
            parts14 = local130.split('/').pop(),
            local135 = parts14.match(local134);
          local135 && (local133 = local133 + local135[0x0]);
          if (!parts13.includes(local135) && paramCA) {
            continue;
          }
          var local136 = await item12.renameAttachmentFile(local133, false, true);
          if (local136 !== true) {
            Zotero.debug("Could not rename file (" + local136 + ')');
            continue;
          }
          item12.setField("title", local133);
          await item12.saveTx();
          local126++;
        }
      } else {
        if (i25.isAttachment()) {
          if (!Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && i25.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) continue;else {
            if (Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && (i25.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL || i25.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_FILE)) {
              continue;
            }
          }
          var local130 = await i25.getFilePathAsync();
          if (!local130) continue;
          let local4 = i25.parentItemID;
          if (!local4) {
            continue;
          }
          let local19 = await Zotero.Items.getAsync(local4);
          if (local127) var local133 = '【' + local129.trim() + "】- " + Zotero.Attachments.getFileBaseNameFromItem(local19);else var local133 = Zotero.Attachments.getFileBaseNameFromItem(local19);
          let local40 = /\.[^\.]+$/,
            parts = local130.split('/').pop(),
            local34 = parts.match(local40);
          if (local34) {
            local133 = local133 + local34[0x0];
          }
          if (!parts13.includes(local34) && paramCA) {
            continue;
          }
          var local136 = await i25.renameAttachmentFile(local133, false, true);
          if (local136 !== true) {
            Zotero.debug("Could not rename file (" + local136 + ')');
            continue;
          }
          i25.setField("title", local133);
          await i25.saveTx();
          local126++;
        }
      }
    }
    !paramCA && Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 重命名附件", "成功重命名【" + local126 + "】个附件！");
  },
  'is4RenameAttachments': function () {
    var local137 = ZoteroPane.getSelectedItems();
    if (local137.length === 0x1 && local137[0x0].isTopLevelItem() && !local137[0x0].isEditable()) return false;
    for (let i27 of local137) {
      if (i27.isRegularItem()) {
        let attachmentIDs5 = i27.getAttachments();
        if (attachmentIDs5.length) {
          return true;
        }
      } else {
        if (i27.isAttachment() && i27.parentItemID && !Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && i27.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL) return true;else {
          if (i27.isAttachment() && i27.parentItemID && Zotero.Prefs.get('ai4paper.renameExcludesLinkedFile') && i27.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL && i27.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_FILE) {
            return true;
          }
        }
      }
    }
    return false;
  },
  'hasAttachmentItem': function () {
    var local138 = ZoteroPane.getSelectedItems();
    for (let i28 of local138) {
      if (i28.isAttachment() && i28.parentItemID && !Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && i28.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL) return true;else {
        if (i28.isAttachment() && i28.parentItemID && Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && i28.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL && i28.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_FILE) return true;
      }
    }
    return false;
  },
  'previewItemMac': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle() || !Zotero.Prefs.get('ai4paper.enableMacPreview')) return -0x1;
    let elem2 = window.document.querySelector("[data-id=\"zotero-pane\"]");
    if (elem2) {
      if (!elem2.classList.contains("selected")) return;
    }
    if (Zotero_Tabs._selectedID != "zotero-pane") {
      return window.close(), true;
    } else var local139 = ZoteroPane.getSelectedItems()[0x0];
    if (!local139) return;
    if (local139.isRegularItem()) {
      let attachment = await local139.getBestAttachment();
      if (!attachment) return;
      Zotero.Reader.open(attachment.id, null, {
        'openInWindow': true
      });
    } else {
      if (local139.isAttachment) {
        if (["application/pdf", "text/html", "application/epub+zip"].includes(local139.attachmentContentType)) {
          if (local139.attachmentLinkMode === 0x3) return;
          Zotero.Reader.open(local139.id, null, {
            'openInWindow': true
          });
        }
      }
    }
  },
  'previewItemWin': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle() || !Zotero.Prefs.get('ai4paper.enableWinPreview')) return -0x1;
    let tabID4 = Zotero_Tabs._selectedID;
    var reader2 = Zotero.Reader.getByTabID(tabID4);
    if (reader2) {
      let local10 = reader2.itemID;
      var item13 = Zotero.Items.get(local10);
      item13 && item13.parentItemID && (local10 = item13.parentItemID, item13 = Zotero.Items.get(local10));
    } else var item13 = ZoteroPane.getSelectedItems()[0x0];
    var prefVal32 = Zotero.Prefs.get('extensions.zotero.ai4paper.quicklookapppath', true);
    if (!prefVal32) {
      return window.alert('请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20拓展】设定\x20QuickLook/Seer\x20路径。'), false;
    }
    if (!(await OS.File.exists(prefVal32))) return window.alert("您设定的 QuickLook/Seer 应用不存在！"), false;
    if (item13 && !item13.isNote()) {
      if (item13.isRegularItem()) {
        let attachmentIDs = item13.getAttachments();
        for (let i29 of attachmentIDs) {
          let item14 = Zotero.Items.get(i29);
          var local140 = await item14.getFilePathAsync();
          if (item14.attachmentContentType == "application/pdf") {
            if (local140 && prefVal32) return Zotero.AI4Paper.goPublication() && Zotero.launchFileWithApplication(local140, prefVal32), true;
          }
        }
      }
      if (item13.isAttachment()) {
        var local140 = await item13.getFilePathAsync();
        if (item13.attachmentContentType == "application/pdf") {
          if (local140 && prefVal32) {
            if (Zotero.AI4Paper.getFunMetaTitle()) {
              Zotero.launchFileWithApplication(local140, prefVal32);
            }
            return false;
          }
        }
      }
    }
  },
  'copyPDF': async function (paramCB) {
    try {
      if (!Zotero.AI4Paper.getFunMetaTitle()) {
        return -0x1;
      }
      if (!paramCB) {
        var paramCB, local141;
        let tabID5 = Zotero_Tabs._selectedID,
          reader3 = Zotero.Reader.getByTabID(tabID5);
        if (reader3) {
          let local8 = reader3.itemID;
          paramCB = Zotero.Items.get(local8);
          paramCB.isAttachment() && (local141 = await paramCB.getFilePathAsync());
        } else {
          let local51 = ZoteroPane.getSelectedItems();
          if (local51?.["length"] === 0x0) return;
          paramCB = local51[0x0];
          if (paramCB && !paramCB.isNote()) {
            if (paramCB.isRegularItem()) {
              let attachmentIDs6 = paramCB.getAttachments();
              for (let i30 of attachmentIDs6) {
                paramCB = Zotero.Items.get(i30);
                if (paramCB.attachmentContentType == "application/pdf") {
                  local141 = await paramCB.getFilePathAsync();
                  break;
                } else {
                  local141 = await paramCB.getFilePathAsync();
                  continue;
                }
              }
            }
            paramCB.isAttachment() && (local141 = await paramCB.getFilePathAsync());
          }
        }
      } else {
        var local141 = await paramCB.getFilePathAsync();
      }
      if (!local141) {
        Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 拷贝 PDF【AI4paper】", "❌ 未发现可供拷贝的附件...");
        return;
      }
      let local49 = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable),
        local42 = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
      const local15 = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
      local15.initWithPath(local141);
      local49.addDataFlavor("application/x-moz-file");
      local49.setTransferData("application/x-moz-file", local15);
      try {
        local42.setData(local49, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
      } catch (e) {
        if (local141 && Zotero.isMac) {
          Zotero.Utilities.Internal.exec('/usr/bin/osascript', ['-e', 'set\x20the\x20clipboard\x20to\x20POSIX\x20file\x20\x22' + local141 + '\x22']);
        } else {
          Zotero.debug(e);
          return;
        }
        Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 拷贝 PDF 失败【AI4paper】", "❌ 出错了...");
        return;
      }
      Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 拷贝 PDF【AI4paper】", "成功拷贝【" + paramCB.getField("title") + '】，您可将其粘贴至其他地方...如微信、各大\x20AI\x20网页端。');
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'openwith_buildPopup': function (paramCC) {
    let obj7 = {
        0x1: '',
        0x2: "2nd",
        0x3: "3rd",
        0x4: "4th",
        0x5: "5th",
        0x6: "6th"
      },
      elem3 = window.document.createXULElement('menupopup');
    elem3.id = "zoteroone-openwith-menupopup";
    elem3.addEventListener('popuphidden', () => {
      window.document.querySelector("#browser").querySelectorAll("#zoteroone-openwith-menupopup").forEach(el => el.remove());
    });
    let local142 = elem3.firstElementChild;
    while (local142) {
      local142.remove();
      local142 = elem3.firstElementChild;
    }
    ["Open With ❶", "Open With ❷", "Open With ❸", "Open With ❹", "Open With ❺", "Open With ❻"].forEach((local3, local) => {
      let prefVal33 = Zotero.Prefs.get("ai4paper.pdfapppath" + obj7[local + 0x1]);
      prefVal33 = ('' + prefVal33).trim();
      if (prefVal33) {
        let prefVal = Zotero.Prefs.get("ai4paper.label4openwith" + obj7[local + 0x1]).trim(),
          local32 = prefVal ? 'Open\x20With\x20\x22' + prefVal + '\x22' : local3,
          elem = window.document.createXULElement('menuitem');
        elem.setAttribute("label", local32);
        elem.addEventListener('command', evt => {
          Zotero.AI4Paper.openwith(local + 0x1);
        });
        elem3.appendChild(elem);
      }
    });
    window.document.querySelector("#browser").querySelectorAll('#zoteroone-openwith-menupopup').forEach(el => el.remove());
    window.document.querySelector("#browser")?.['appendChild'](elem3);
    elem3.openPopup(paramCC, "after_start", 0x0, 0x0, false, false);
  },
  'openwith': async function (local18 = 0x1) {
    try {
      if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
      let obj8 = {
          0x1: '',
          0x2: '2nd',
          0x3: "3rd",
          0x4: "4th",
          0x5: "5th",
          0x6: "6th"
        },
        obj9 = {
          0x1: '❶',
          0x2: '❷',
          0x3: '❸',
          0x4: '❹',
          0x5: '❺',
          0x6: '❻'
        };
      var prefVal34 = Zotero.Prefs.get("ai4paper.pdfapppath" + obj8[local18]);
      if (!prefVal34) return window.alert("请先前往【Zotero 设置 --> AI4paper --> 拓展 --> Open With " + obj9[local18] + "】设定 PDF 应用。"), false;
      if (!(await OS.File.exists(prefVal34))) return window.alert('您设定的\x20PDF\x20应用不存在！'), false;
      let tabID6 = Zotero_Tabs._selectedID;
      var reader4 = Zotero.Reader.getByTabID(tabID6);
      if (reader4) {
        let local43 = reader4.itemID,
          item = Zotero.Items.get(local43);
        if (item.isAttachment()) {
          var local143 = await item.getFilePathAsync();
          if (item.attachmentContentType == 'application/pdf') {
            if (local143 && prefVal34) return Zotero.AI4Paper.runAuthor() && Zotero.launchFileWithApplication(local143, prefVal34), false;
          }
        }
      } else {
        let local144 = ZoteroPane.getSelectedItems();
        for (let i31 of local144) {
          if (i31 && !i31.isNote()) {
            if (i31.isRegularItem()) {
              let attachmentIDs2 = i31.getAttachments();
              for (let i32 of attachmentIDs2) {
                let item4 = Zotero.Items.get(i32);
                var local143 = await item4.getFilePathAsync();
                item4.attachmentContentType == "application/pdf" && local143 && prefVal34 && Zotero.AI4Paper.runAuthor() && Zotero.launchFileWithApplication(local143, prefVal34);
              }
            }
            if (i31.isAttachment()) {
              var local143 = await i31.getFilePathAsync();
              if (i31.attachmentContentType == "application/pdf") {
                if (local143 && prefVal34) {
                  if (Zotero.AI4Paper.runAuthor()) {
                    Zotero.launchFileWithApplication(local143, prefVal34);
                  }
                }
              }
            }
            Zotero.AI4Paper.filesHistory(i31);
          }
        }
      }
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'getItemsTitleANDKey': function () {
    let tabID7 = Zotero_Tabs._selectedID;
    var reader5 = Zotero.Reader.getByTabID(tabID7);
    if (reader5) {
      let local21 = reader5.itemID;
      var item15 = Zotero.Items.get(local21);
      if (item15 && item15.parentItemID) {
        local21 = item15.parentItemID;
        item15 = Zotero.Items.get(local21);
        let local145 = item15.key,
          fieldVal10 = item15.getField('title');
        return [{
          'item_Title': fieldVal10,
          'item_Key': local145
        }];
      } else return Services.prompt.alert(window, "❌ 温馨提示：", "您选的 PDF 无父条目，请创建父条目或重新选择！"), false;
    } else var local146 = ZoteroPane.getSelectedItems().filter(item => item.isRegularItem());
    if (local146.length === 0x0) return Services.prompt.alert(window, "❌ 温馨提示：", "请至少选择一个常规条目！"), false;
    let arr33 = [];
    for (let i33 of local146) {
      let local147 = i33.key,
        fieldVal11 = i33.getField("title"),
        obj10 = {
          'item_Title': fieldVal11,
          'item_Key': local147
        };
      arr33.push(obj10);
    }
    return arr33;
  },

  // === Block E: Delete/Export Operations ===
  'StoreAnnotations2PDF': async function () {
    let tabID8 = Zotero_Tabs._selectedID;
    var reader6 = Zotero.Reader.getByTabID(tabID8);
    if (reader6) {
      let local7 = reader6.itemID;
      await Zotero.PDFWorker['export'](local7, null, true, '', true);
      Zotero_Tabs.select("zotero-pane");
      Zotero_Tabs.select(tabID8);
    } else window.alert("请在内置阅读器中打开文献后，再执行本菜单！");
  },
  'deleteAllAttachments': async function () {
    let local148 = Services.prompt.confirm(window, "删除选定条目的所有附件", '是否确认删除选定文献的附件及其本地文件？如果误删，可以从\x20Zotero\x20回收站找回。');
    if (!local148) return false;
    let tabID9 = Zotero_Tabs._selectedID,
      reader7 = Zotero.Reader.getByTabID(tabID9);
    if (reader7) {
      let local149 = reader7.itemID;
      var item16 = Zotero.Items.get(local149);
      if (item16 && item16.parentItemID) {
        local149 = item16.parentItemID;
        item16 = Zotero.Items.get(local149);
        var arr34 = [];
        arr34.push(item16);
      }
    } else var arr34 = ZoteroPane.getSelectedItems();
    for (let i34 of arr34) {
      if (i34 && !i34.isNote()) {
        if (i34.isRegularItem()) {
          let attachmentIDs7 = i34.getAttachments();
          for (let i35 of attachmentIDs7) {
            let item17 = Zotero.Items.get(i35);
            item17.deleted = true;
            await item17.saveTx();
            var local150 = await item17.getFilePathAsync();
            local150 && (await OS.File.remove(local150));
          }
        }
      }
    }
  },
  'deleteSnapShots': async function () {
    let local151 = Services.prompt.confirm(window, "删除选定条目的网页快照", "是否确认删除选定文献的网页快照？如果误删，可以从 Zotero 回收站找回。");
    if (!local151) {
      return false;
    }
    let tabID10 = Zotero_Tabs._selectedID,
      reader8 = Zotero.Reader.getByTabID(tabID10);
    if (reader8) {
      let local48 = reader8.itemID;
      var item18 = Zotero.Items.get(local48);
      if (item18 && item18.parentItemID) {
        local48 = item18.parentItemID;
        item18 = Zotero.Items.get(local48);
        var arr35 = [];
        arr35.push(item18);
      }
    } else var arr35 = ZoteroPane.getSelectedItems();
    for (let i36 of arr35) {
      if (i36 && !i36.isNote()) {
        if (i36.isRegularItem()) {
          let attachmentIDs8 = i36.getAttachments();
          for (let i37 of attachmentIDs8) {
            let item19 = Zotero.Items.get(i37);
            if (item19.attachmentContentType == 'text/html') {
              item19.deleted = true;
              await item19.saveTx();
              var local152 = await item19.getFilePathAsync();
              local152 && (await OS.File.remove(local152));
            }
          }
        }
      }
    }
  },
  'exportFile': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let tabID11 = Zotero_Tabs._selectedID,
      reader9 = Zotero.Reader.getByTabID(tabID11);
    if (reader9) {
      let local153 = reader9.itemID;
      var item20 = Zotero.Items.get(local153);
      if (item20 && item20.parentItemID) {
        local153 = item20.parentItemID;
        item20 = Zotero.Items.get(local153);
        var arr36 = [];
        arr36.push(item20);
      }
    } else var arr36 = ZoteroPane.getSelectedItems();
    let local154,
      local155,
      local156,
      local157 = 0x0,
      result17 = await Zotero.AI4Paper.chooseExportLocation();
    if (result17) {
      for (let i38 of arr36) {
        if (i38 && !i38.isNote()) {
          if (i38.isRegularItem()) {
            let attachmentIDs3 = i38.getAttachments();
            for (let i39 of attachmentIDs3) {
              let item2 = Zotero.Items.get(i39);
              local154 = await item2.getFilePathAsync();
              local154 && (local155 = item2.attachmentFilename, local156 = OS.Path.join(result17, local155), OS.File.exists(local156) && (await Zotero.AI4Paper.copyWithNoOverwrite(local154, result17), local157++));
            }
          }
          i38.isAttachment() && (local154 = await i38.getFilePathAsync(), local154 && (local155 = i38.attachmentFilename, local156 = OS.Path.join(result17, local155), OS.File.exists(local156) && (await Zotero.AI4Paper.copyWithNoOverwrite(local154, result17), local157++)));
        }
      }
      local157 ? Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 导出成功", '您成功将选定文献的【' + local157 + "】个附件导出至【" + result17 + '】。') : Zotero.AI4Paper.showProgressWindow(0x5dc, "温馨提示", "未发现符合条件的附件！");
    }
  },
  'copyWithNoOverwrite': async function (param, param3) {
    const local158 = OS.Path,
      local159 = local158.basename(param),
      local160 = local159.substr(local159.lastIndexOf('.') + 0x1),
      substr17 = local159.slice(0x0, local159.length - local160.length - 0x1);
    let local161 = local158.join(param3, local159),
      local162 = 0x1;
    while (await OS.File.exists(local161)) {
      const local163 = substr17 + '\x20(' + local162 + ').' + local160;
      local161 = local158.join(param3, local163);
      local162++;
    }
    return await OS.File.copy(param, local161), local161;
  },
  'exportPDFFile': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let tabID12 = Zotero_Tabs._selectedID,
      reader10 = Zotero.Reader.getByTabID(tabID12);
    if (reader10) {
      let local164 = reader10.itemID;
      var item21 = Zotero.Items.get(local164);
      if (item21 && item21.parentItemID) {
        local164 = item21.parentItemID;
        item21 = Zotero.Items.get(local164);
        var arr37 = [];
        arr37.push(item21);
      }
    } else var arr37 = ZoteroPane.getSelectedItems();
    let local165,
      local166,
      local167,
      local168 = 0x0,
      result18 = await Zotero.AI4Paper.chooseExportLocation();
    if (result18) {
      for (let i40 of arr37) {
        if (i40 && !i40.isNote()) {
          if (i40.isRegularItem()) {
            let attachmentIDs9 = i40.getAttachments();
            for (let i41 of attachmentIDs9) {
              let item3 = Zotero.Items.get(i41);
              local165 = await item3.getFilePathAsync();
              item3.attachmentContentType == "application/pdf" && local165 && (local166 = item3.attachmentFilename, local167 = OS.Path.join(result18, local166), OS.File.exists(local167) && (await Zotero.AI4Paper.copyWithNoOverwrite(local165, result18), local168++));
            }
          }
          if (i40.isAttachment()) {
            local165 = await i40.getFilePathAsync();
            if (i40.attachmentContentType == 'application/pdf') {
              local165 && (local166 = i40.attachmentFilename, local167 = OS.Path.join(result18, local166), OS.File.exists(local167) && (await Zotero.AI4Paper.copyWithNoOverwrite(local165, result18), local168++));
            }
          }
        }
      }
      local168 ? Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20导出成功', '您成功将选定文献的【' + local168 + "】个 PDF 附件导出至【" + result18 + '】。') : Zotero.AI4Paper.showProgressWindow(0x5dc, "温馨提示", '未发现任何\x20PDF\x20附件！');
    }
  },
  'chooseExportLocation': async function () {
    var {
        FilePicker: local37
      } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs"),
      local169 = new local37();
    local169.init(window, "选择目标文件夹", local169.modeGetFolder);
    local169.appendFilters(local169.filterAll);
    if ((await local169.show()) != local169.returnOK) {
      return false;
    }
    var local170 = PathUtils.normalize(local169.file);
    return local170;
  },

  // === Block F: Copy Links + Related Items ===
  'copySelectedItemsLink': function (param4) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let tabID13 = Zotero_Tabs._selectedID,
      reader11 = Zotero.Reader.getByTabID(tabID13);
    if (reader11) {
      let local2 = reader11.itemID;
      var item22 = Zotero.Items.get(local2);
      if (item22 && item22.parentItemID) {
        local2 = item22.parentItemID;
        item22 = Zotero.Items.get(local2);
        var arr38 = [];
        arr38.push(item22);
      }
    } else var arr38 = ZoteroPane.getSelectedItems();
    if (!arr38.length) {
      return false;
    }
    var arr39 = [],
      local171,
      local172;
    for (var len43 = 0x0; len43 < arr38.length; len43++) {
      local171 = Zotero.Libraries.get(arr38[len43].libraryID).libraryType;
      switch (local171) {
        case "group":
          local172 = Zotero.URI.getLibraryPath(arr38[len43].libraryID);
          break;
        case 'user':
          local172 = "library";
          break;
        default:
          continue;
      }
      let str26 = "zotero://select/" + local172 + '/items/' + arr38[len43].key;
      param4 && (str26 = '[' + arr38[len43].getField("title") + '](' + str26 + ')');
      arr39.push(str26);
    }
    Zotero.AI4Paper.copy2Clipboard(arr39.join('\x0d\x0a'));
    Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝条目链接", "所选条目链接已拷贝至剪切板！");
  },
  'copyPDFAttachmentsLink': function (param5) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let tabID14 = Zotero_Tabs._selectedID,
      reader12 = Zotero.Reader.getByTabID(tabID14);
    if (reader12) {
      let local53 = reader12.itemID;
      var item23 = Zotero.Items.get(local53);
      if (item23 && item23.parentItemID) {
        local53 = item23.parentItemID;
        item23 = Zotero.Items.get(local53);
        var arr40 = [];
        arr40.push(item23);
      }
    } else var arr40 = ZoteroPane.getSelectedItems();
    if (!arr40.length) return false;
    arr40 = arr40.filter(item => item.isRegularItem());
    if (!arr40.length) {
      window.alert("未选择任何常规条目！");
    }
    var str27 = '';
    for (let i42 of arr40) {
      let result = Zotero.AI4Paper.getZoteroAttachments(i42, param5);
      result != '' && (str27 = str27 + result + '\x0d\x0a' + '\x0d\x0a');
    }
    Zotero.AI4Paper.copy2Clipboard(str27);
    Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20拷贝\x20PDF\x20附件链接', "所选条目的 PDF 附件链接已拷贝至剪切板！");
  },
  'getZoteroAttachments': function (param7, param8) {
    let attachmentIDs10 = param7.getAttachments();
    var str28 = '';
    for (let i43 of attachmentIDs10) {
      let item24 = Zotero.Items.get(i43);
      if (item24.attachmentContentType == "application/pdf") {
        let result19 = Zotero.AI4Paper.getItemPDFLink(item24);
        param8 && (result19 = '[' + item24.getField("title") + '](' + result19 + ')');
        str28 = str28 + result19 + '\x0a';
      }
    }
    return str28;
  },
  'copyItemCitationPDFLink': function (param9) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let tabID15 = Zotero_Tabs._selectedID,
      reader13 = Zotero.Reader.getByTabID(tabID15);
    if (reader13) {
      let local173 = reader13.itemID;
      var item25 = Zotero.Items.get(local173);
      if (item25 && item25.parentItemID) {
        local173 = item25.parentItemID;
        item25 = Zotero.Items.get(local173);
        var arr41 = [];
        arr41.push(item25);
      }
    } else var arr41 = ZoteroPane.getSelectedItems();
    if (!arr41.length) return false;
    arr41 = arr41.filter(item => item.isRegularItem());
    !arr41.length && window.alert("未选择任何常规条目！");
    var str29 = '';
    if (arr41.length == 0x1) {
      var local174 = Zotero.QuickCopy,
        prefVal35 = Zotero.Prefs.get("export.quickCopy.setting");
      prefVal35.split('=')[0x0] !== 'bibliography' && alert("No bibliography style is choosen in the settings for QuickCopy.");
      var local175 = local174.getContentFromItems(arr41, prefVal35),
        local176 = local175.html,
        local177 = local175.text,
        result20 = Zotero.AI4Paper.getZoteroAttachmentsBullets(arr41[0x0], param9);
      str29 = local177 + '\x0d\x0a' + "PDF Attachments:" + '\x0d\x0a' + result20;
      Zotero.AI4Paper.copy2Clipboard(str29);
      Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20拷贝引文及\x20PDF\x20附件链接', "所选条目的引文及其 PDF 附件链接已拷贝至剪切板！");
    } else window.alert('请仅选择一个常规条目！');
  },
  'getZoteroAttachmentsBullets': function (paramA, paramB) {
    let attachmentIDs11 = paramA.getAttachments();
    var str30 = '';
    for (let i44 of attachmentIDs11) {
      let item26 = Zotero.Items.get(i44);
      if (item26.attachmentContentType == 'application/pdf') {
        let result21 = Zotero.AI4Paper.getItemPDFLink(item26);
        paramB && (result21 = '[' + item26.getField("title") + '](' + result21 + ')');
        str30 = str30 + '-\x20' + result21 + '\x0a';
      }
    }
    return str30;
  },
  'updateAllRelatedItemsNum': async function () {
    Zotero.AI4Paper.showProgressWindow(0xbb8, "正在更新关联文献数量", "更新关联文献数量需要一定时间...结果将通过弹窗反馈给您！");
    var local178 = 0x0,
      local179 = 0x0,
      local180 = 0x0,
      local181 = new Zotero.Search();
    local181.libraryID = Zotero.Libraries.userLibraryID;
    local181.addCondition("itemType", 'is', "journalArticle");
    var local182 = await local181.search(),
      local183 = await Zotero.Items.getAsync(local182);
    for (let i45 of local183) {
      let local26 = i45.relatedItems,
        len2 = local26.length;
      if (len2 > 0x0) {
        if (i45.getField("archiveLocation").indexOf('🔗') != -0x1) {
          let fieldVal2 = i45.getField("archiveLocation"),
            idx7 = i45.getField("archiveLocation").indexOf('🔗');
          fieldVal2 = fieldVal2.substring(0x0, idx7);
          i45.setField("archiveLocation", fieldVal2 + '🔗' + String(len2));
          await i45.saveTx();
          local178++;
        } else {
          i45.setField('archiveLocation', i45.getField("archiveLocation") + '🔗' + String(len2));
          await i45.saveTx();
          local178++;
        }
      }
    }
    var local184 = new Zotero.Search();
    local184.libraryID = Zotero.Libraries.userLibraryID;
    local184.addCondition("itemType", 'is', "thesis");
    var local185 = await local184.search(),
      local186 = await Zotero.Items.getAsync(local185);
    for (let i46 of local186) {
      let local187 = i46.relatedItems,
        len44 = local187.length;
      if (len44 > 0x0) {
        if (i46.getField("archiveLocation").indexOf('🔗') != -0x1) {
          let fieldVal12 = i46.getField('archiveLocation'),
            idx25 = i46.getField("archiveLocation").indexOf('🔗');
          fieldVal12 = fieldVal12.substring(0x0, idx25);
          i46.setField("archiveLocation", fieldVal12 + '🔗' + String(len44));
          await i46.saveTx();
          local179++;
        } else {
          i46.setField('archiveLocation', i46.getField('archiveLocation') + '🔗' + String(len44));
          await i46.saveTx();
          local179++;
        }
      }
    }
    var local188 = new Zotero.Search();
    local188.libraryID = Zotero.Libraries.userLibraryID;
    local188.addCondition('itemType', 'is', "conferencePaper");
    var local189 = await local188.search(),
      local190 = await Zotero.Items.getAsync(local189);
    for (let i47 of local190) {
      let local55 = i47.relatedItems,
        len = local55.length;
      if (len > 0x0) {
        if (i47.getField("archiveLocation").indexOf('🔗') != -0x1) {
          let fieldVal6 = i47.getField('archiveLocation'),
            idx4 = i47.getField("archiveLocation").indexOf('🔗');
          fieldVal6 = fieldVal6.substring(0x0, idx4);
          i47.setField("archiveLocation", fieldVal6 + '🔗' + String(len));
          await i47.saveTx();
          local180++;
        } else {
          i47.setField("archiveLocation", i47.getField("archiveLocation") + '🔗' + String(len));
          await i47.saveTx();
          local180++;
        }
      }
    }
    Zotero.AI4Paper.showProgressWindow(0x1770, '✅\x20【全库更新关联文献数量】完毕', '共有【' + local178 + "】篇期刊论文、【" + local180 + "】篇会议论文、以及【" + local179 + "】篇学位论文包含关联文献！");
  },
  'selectAllRelatedItmes': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let tabID16 = Zotero_Tabs._selectedID;
    var reader14 = Zotero.Reader.getByTabID(tabID16);
    if (reader14) {
      let local191 = reader14.itemID;
      var item27 = Zotero.Items.get(local191);
      item27 && item27.parentItemID && (local191 = item27.parentItemID, item27 = Zotero.Items.get(local191));
    } else var item27 = ZoteroPane.getSelectedItems()[0x0];
    let arr42 = Zotero.AI4Paper.getRelatedItemsIDsArray(item27);
    if (!arr42.length) return window.alert("当前条目无关联文献！"), false;
    Zotero_Tabs.select("zotero-pane");
    await ZoteroPane_Local.selectItems(arr42);
    Zotero.AI4Paper.showProgressWindow(0xbb8, "全选关联文献", '为您全选了所有【' + arr42.length + '】篇关联文献！');
  },
  'removeRelatedItems': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let tabID17 = Zotero_Tabs._selectedID;
    var reader15 = Zotero.Reader.getByTabID(tabID17);
    if (reader15) {
      let local20 = reader15.itemID;
      var item28 = Zotero.Items.get(local20);
      item28 && item28.parentItemID && (local20 = item28.parentItemID, item28 = Zotero.Items.get(local20));
    } else var item28 = ZoteroPane.getSelectedItems()[0x0];
    if (!item28.isRegularItem()) return window.alert('请选择一个常规条目！'), false;
    let arr43 = Zotero.AI4Paper.getRelatedItemsArray(item28),
      arr44 = [];
    if (arr43.length === 0x0) {
      return window.alert("当前条目无关联文献！"), -0x1;
    }
    for (let i48 of arr43) {
      try {
        let fieldVal7 = i48.getField("title");
        arr44.push(fieldVal7 + " 🆔 " + i48.itemID);
      } catch (e) {}
    }
    arr44.sort();
    Zotero.AI4Paper._action_removeRelatedItems = true;
    let result22 = Zotero.AI4Paper.openDialogByType_modal("selectRelatedItems", arr44);
    if (!result22) return null;
    let arr45 = [];
    Object.keys(result22).forEach(async function (paramC) {
      let local11 = result22[paramC];
      if (local11.indexOf('🆔') != -0x1) {
        let idx2 = local11.indexOf('🆔'),
          substr8 = local11.substring(idx2 + 0x3);
        arr45.push(Zotero.Items.get(substr8));
      }
    });
    for (let i49 of arr45) {
      item28.removeRelatedItem(i49);
      await item28.saveTx();
      if (i49.isRegularItem()) {
        i49.removeRelatedItem(item28);
      }
      await i49.saveTx();
    }
    await new Promise(resolve => setTimeout(resolve, 0x2710));
    for (let i50 of arr45) {
      item28.removeRelatedItem(i50);
      await item28.saveTx();
    }
    let local192 = arr43;
    local192.push(item28);
    for (let i51 of local192) {
      await Zotero.AI4Paper.updateRelatedItemsNum(i51);
    }
  },
  'showSelectedRelatedItems': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let tabID18 = Zotero_Tabs._selectedID;
    var reader16 = Zotero.Reader.getByTabID(tabID18);
    if (reader16) {
      let local44 = reader16.itemID;
      var item29 = Zotero.Items.get(local44);
      item29 && item29.parentItemID && (local44 = item29.parentItemID, item29 = Zotero.Items.get(local44));
    } else var item29 = ZoteroPane.getSelectedItems()[0x0];
    if (!item29.isRegularItem()) return window.alert('请选择一个常规条目！'), false;
    let arr46 = Zotero.AI4Paper.getRelatedItemsArray(item29),
      arr47 = [];
    if (arr46.length === 0x0) return window.alert("当前条目无关联文献！"), -0x1;
    for (let i52 of arr46) {
      try {
        let fieldVal13 = i52.getField("title");
        arr47.push(fieldVal13 + " 🆔 " + i52.itemID);
      } catch (e) {}
    }
    arr47.sort();
    Zotero.AI4Paper._action_removeRelatedItems = false;
    let result23 = Zotero.AI4Paper.openDialogByType_modal("selectRelatedItems", arr47);
    if (!result23) {
      return null;
    }
    let arr48 = [];
    Object.keys(result23).forEach(async function (paramD) {
      let local14 = result23[paramD];
      if (local14.indexOf('🆔') != -0x1) {
        let idx26 = local14.indexOf('🆔'),
          substr18 = local14.substring(idx26 + 0x3);
        arr48.push(substr18);
      }
    });
    Zotero_Tabs.select("zotero-pane");
    await ZoteroPane_Local.selectItems(arr48);
  },
  'getRelatedItemsArray': function (paramE) {
    var local193 = paramE.getRelations()["dc:relation"],
      arr49 = [];
    if (local193) {
      for (let i53 of local193) {
        try {
          let local30 = Zotero.URI.getURIItemID(i53),
            item6 = Zotero.Items.get(local30);
          arr49.push(item6);
        } catch (e) {}
      }
    }
    return arr49;
  },
  'getRelatedItemsIDsArray': function (paramF) {
    var local194 = paramF.getRelations()["dc:relation"],
      arr50 = [];
    if (local194) for (let i54 of local194) {
      try {
        let local23 = Zotero.URI.getURIItemID(i54),
          item5 = Zotero.Items.get(local23),
          fieldVal5 = item5.getField("title");
        arr50.push(local23);
      } catch (e) {}
    }
    return arr50;
  },

  // === Block G: Star + Archive ===
  'starSelectedItems': async function (paramG) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) {
      return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    }
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return false;
    }
    Zotero.debug("AI4Paper: Star Selected items");
    let str31 = 'rights',
      prefVal36 = Zotero.Prefs.get("ai4paper.starstyle");
    if (prefVal36 === '数字') var local195 = paramG + '⭐';else {
      var local195 = Zotero.Prefs.get("ai4paper.starstyle").repeat(paramG);
    }
    let tabID19 = Zotero_Tabs._selectedID;
    var reader17 = Zotero.Reader.getByTabID(tabID19);
    if (reader17) {
      let local196 = reader17.itemID,
        item30 = Zotero.Items.get(local196);
      if (item30 && item30.parentItemID) {
        local196 = item30.parentItemID;
        item30 = Zotero.Items.get(local196);
        if (Zotero.AI4Paper.checkItemField(item30, str31)) {
          item30.setField(str31, paramG ? local195 : '');
          await item30.saveTx();
          if (paramG) this.showProgressWindow(0x1388, "⭐ 星标文献【AI4paper】", "您成功给予当前文献【" + local195 + '】评价！', 'zoteorif');else {
            this.showProgressWindow(0x1388, "⭐ 取消文献星标【AI4paper】", "您成功取消当前文献的星标！", 'zoteorif');
          }
        }
      }
    } else {
      let local197 = Zotero.getActiveZoteroPane().getSelectedItems();
      this._Num_AllSel = local197.length;
      let local198 = local197.filter(item => item.isRegularItem());
      this._Num_Done = 0x0;
      for (let i55 of local198) {
        Zotero.AI4Paper.checkItemField(i55, str31) && (i55.setField(str31, paramG ? local195 : ''), await i55.saveTx(), this._Num_Done++);
      }
      paramG ? this.showProgressWindow(0x1388, "⭐ 星标文献【AI4paper】", "您成功给予【" + this._Num_Done + " of " + this._Num_AllSel + "】篇文献【" + local195 + '】评价！', "zoteorif") : this.showProgressWindow(0x1388, "⭐ 取消文献星标【AI4paper】", '您成功取消【' + this._Num_Done + " of " + this._Num_AllSel + "】篇文献的星标！", "zoteorif");
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
    let tabID20 = Zotero_Tabs._selectedID;
    var reader18 = Zotero.Reader.getByTabID(tabID20);
    if (reader18) {
      let local199 = reader18.itemID,
        item31 = Zotero.Items.get(local199);
      item31 && item31.parentItemID && (local199 = item31.parentItemID, item31 = Zotero.Items.get(local199), await Zotero.AI4Paper.archiveItem(item31), this.showProgressWindow(0x1388, "✅ 归档文献 【AI4paper】", "恭喜，您已完成阅读（即归档）该文献！", 'zoteorif'));
    } else {
      let local50 = Zotero.getActiveZoteroPane().getSelectedItems(),
        local27 = local50.filter(item => item.isRegularItem());
      for (let i56 of local27) {
        await Zotero.AI4Paper.archiveItem(i56);
      }
      this.showProgressWindow(0x1388, "✅ 归档文献 【AI4paper】", "成功归档【" + local27.length + "】篇文献！", "zoteorif");
    }
  },
  'archiveItem': async function (paramI) {
    let str32 = 'archive',
      str33 = 'extra';
    if (Zotero.Prefs.get("ai4paper.tagscollectionField") === '其他') str33 = "extra";else {
      if (Zotero.Prefs.get("ai4paper.tagscollectionField") === "存档位置") str33 = 'archiveLocation';else {
        if (Zotero.Prefs.get('ai4paper.tagscollectionField') === '索书号') str33 = "callNumber";else {
          if (Zotero.Prefs.get("ai4paper.tagscollectionField") === "文库编目") {
            str33 = "libraryCatalog";
          }
        }
      }
    }
    paramI.removeTag(this.unreadTag);
    paramI.removeTag(this.readingTag);
    paramI.addTag(this.doneTag);
    await paramI.saveTx();
    await Zotero.Promise.delay(0xa);
    var date4 = new Date(),
      local200 = date4.getDate(),
      local201 = date4.getMonth() + 0x1,
      local202 = date4.getFullYear();
    local200 = local200 < 0xa ? '0' + local200 : local200;
    local201 = local201 < 0xa ? '0' + local201 : local201;
    var str34 = '' + local200,
      str35 = '' + local201,
      str36 = '' + local202,
      local203 = str36 + '-' + str35 + '-' + str34;
    if (Zotero.Prefs.get("ai4paper.generatearchivedate") && Zotero.AI4Paper.checkItemField(paramI, str32)) {
      paramI.setField(str32, local203);
      await paramI.saveTx();
    }
    await Zotero.Promise.delay(0xa);
    if (!Zotero.Prefs.get("ai4paper.tagscollectiondisable") && Zotero.AI4Paper.checkItemField(paramI, str33)) {
      let local204 = paramI.getTags().filter(item => !["/PDF_auto_download", "/citing", "/refs", "Researcher App"].includes(item.tag)).map(item => item.tag),
        arr51 = await Zotero.AI4Paper.getAnnotatioinTagsArray(paramI),
        arr52 = [...new Set(local204.concat(arr51))];
      arr52.length ? paramI.setField(str33, "🏷️ " + arr52.join('、')) : paramI.setField(str33, '');
      await paramI.saveTx();
    }
  },

  // === Block H: Interpret/Batch + setLanguageField ===
  '_pendingItems': new Map(),
  'DEBOUNCE_DELAY': 0x1388,
  'clearTimeout_Interpret': function () {
    try {
      for (const local205 of this._pendingItems.values()) {
        clearTimeout(local205);
      }
      this._pendingItems.clear();
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'interpretNewItems': async function (paramK) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return;
    for (const local206 of paramK) {
      try {
        if (!local206 || local206.deleted) continue;
        if (local206.isAttachment() && local206.attachmentContentType === "application/pdf") {
          const local207 = local206.parentItem;
          if (local207 && local207.isRegularItem() && !local207.deleted) {
            this.scheduleInterpret(local207);
          }
          continue;
        }
        if (local206.isRegularItem()) {
          const attachmentIDs12 = local206.getAttachments();
          let local208 = false;
          for (const local209 of attachmentIDs12) {
            const local210 = await Zotero.Items.getAsync(local209);
            if (local210 && local210.attachmentContentType === "application/pdf") {
              local208 = true;
              break;
            }
          }
          if (local208) {
            this.scheduleInterpret(local206);
          }
        }
      } catch (e) {
        Zotero.debug('AI解读\x20-\x20自动解读监听异常:\x20' + e.message);
      }
    }
  },
  'scheduleInterpret': function (paramL) {
    const local211 = paramL.id;
    this._pendingItems.has(local211) && clearTimeout(this._pendingItems.get(local211));
    Zotero.debug('AI解读\x20-\x20计划自动解读「' + paramL.getField("title") + '」(' + this.DEBOUNCE_DELAY + "ms 后)");
    const local212 = setTimeout(async () => {
      this._pendingItems['delete'](local211);
      await this.doInterpret(paramL);
    }, this.DEBOUNCE_DELAY);
    this._pendingItems.set(local211, local212);
  },
  'doInterpret': async function (paramM) {
    try {
      const local213 = await Zotero.Items.getAsync(paramM.id);
      if (!local213 || local213.deleted || !local213.isRegularItem()) return;
      const local214 = local213.getNotes();
      for (const local215 of local214) {
        const local216 = await Zotero.Items.getAsync(local215);
        if (local216 && local216.getTags().some(cb => cb.tag === Zotero.AI4Paper._aiReadingNoteTag)) {
          Zotero.debug("AI解读 - 「" + local213.getField("title") + "」已有解读笔记，跳过自动解读");
          return;
        }
      }
      let str37 = "batchAIInterpret",
        result24 = Zotero.AI4Paper.getOpenedDialog("zoteroone-windowType-" + str37, true);
      if (!result24) {
        result24 = Zotero.getMainWindow().openDialog('chrome://ai4paper/content/selectionDialog/' + str37 + ".xhtml", str37, "chrome,extrachrome,centerscreen,resizable,dialog=no");
        await new Promise(resolve => {
          result24.addEventListener("load", resolve, {
            'once': true
          });
        });
        await new Promise(resolve => setTimeout(resolve, 0x12c));
      }
      result24.BatchAIInterpreter && (await result24.BatchAIInterpreter.addItems([local213]));
    } catch (e) {
      Zotero.debug("AI解读 - 自动解读执行异常: " + e.message);
    }
  },
  'batchInterpretItems': async function (paramN) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return;
    let str38 = "batchAIInterpret",
      result25 = Zotero.AI4Paper.getOpenedDialog("zoteroone-windowType-" + str38, true);
    if (!result25) {
      result25 = Zotero.AI4Paper.openDialogByType(str38);
      await new Promise(resolve => {
        result25.document.readyState === "complete" ? resolve() : result25.addEventListener("load", resolve, {
          'once': true
        });
      });
      await Zotero.Promise.delay(0x64);
    }
    await result25.BatchAIInterpreter.addItems(paramN);
    result25.focus();
  },
  'batchInterpretSelectedItems': async function (paramO) {
    let str39 = "📚 批量 AI 解读文献",
      local217;
    if (paramO) {
      let {
        items: local28,
        selectionType: local41,
        name: local36,
        itemsAfterRecursion: local22,
        link: local12
      } = await Zotero.AI4Paper.getItemsFromCurrentSelection(true);
      local28 = local28.filter(item => item.isRegularItem());
      if (!local28.length) return Services.prompt.alert(window, str39, "您选择的 👉 “" + local41 + '”：【' + local36 + '】👈\x20中，不包含任何常规条目！'), false;
      local217 = Services.prompt.confirm(window, str39, "您选择的 👉 “" + local41 + '”：【' + local36 + "】👈 中，共有【" + local28.length + "】篇常规条目文献，\n\n是否确认加入【" + str39 + "】队列？");
      local217 && Zotero.AI4Paper.batchInterpretItems(local28);
    } else {
      if (Zotero_Tabs._selectedID === 'zotero-pane') {
        const local218 = ZoteroPane.getSelectedItems().filter(item => item.isRegularItem());
        if (!local218.length) {
          return Services.prompt.alert(window, str39, "❌ 未选中任何常规条目！请选择带有 PDF 附件的父条目！"), false;
        }
        if (local218.length === 0x1 && Zotero.AI4Paper.findNoteItem_basedOnTag(local218[0x0], Zotero.AI4Paper._aiReadingNoteTag)) return Services.prompt.alert(window, str39, "❌ 当前文献【" + local218[0x0]?.["getField"]("title") + "】已存在 AI 解读笔记附件，\n\n如需重新解读，请删除相应笔记附件后，再执行本操作。"), false;
        local217 = Services.prompt.confirm(window, str39, "当前选中了【" + local218.length + "】篇常规条目文献，\n\n是否确认加入【" + str39 + "】队列？");
        local217 && Zotero.AI4Paper.batchInterpretItems(local218);
      } else {
        if (Zotero_Tabs.getTabInfo(Zotero_Tabs._selectedID).type === "reader") {
          let result26 = Zotero.AI4Paper.getCurrentItem(true);
          if (!result26 || !result26.isRegularItem()) return Services.prompt.alert(window, str39, "❌ 当前 PDF 文献无父条目，请补充父条目后再操作。"), false;
          if (Zotero.AI4Paper.findNoteItem_basedOnTag(result26, Zotero.AI4Paper._aiReadingNoteTag)) {
            return Services.prompt.alert(window, str39, '❌\x20当前文献【' + result26.getField("title") + '】已存在\x20AI\x20解读笔记附件，\x0a\x0a如需重新解读，请删除相应笔记附件后，再执行本操作。'), false;
          }
          local217 = Services.prompt.confirm(window, str39, "当前打开的文献为【" + result26.getField('title') + '】，\x0a\x0a是否确认加入【' + str39 + "】队列？");
          if (local217) {
            Zotero.AI4Paper.batchInterpretItems([result26]);
          }
        } else {
          if (Zotero_Tabs.getTabInfo(Zotero_Tabs._selectedID).type === 'note') {
            Services.prompt.alert(window, str39, '❌\x20当前是笔记标签页！请选择\x20PDF\x20文献标签页，或者在主界面选择文献。');
            return;
          }
        }
      }
    }
  },
  'updateFooterUI_batchInterpret': function () {
    let result27 = Zotero.AI4Paper.getOpenedDialog('zoteroone-windowType-batchAIInterpret');
    result27 && result27.updateFooterUI();
  },
  'updateNewItems': async function (arg) {
    const local219 = arg.filter(item => item.isRegularItem());
    if (Zotero.Prefs.get('ai4paper.updateifauto')) for (let i57 of local219) {
      this._Num_ToDo = 0x0;
      await this.updateItemIF(i57);
    }
    await this.updateDOI_NewItems(local219);
    for (let i58 of local219) {
      await this.addUnreadTag(i58);
    }
    Zotero.Prefs.get("ai4paper.fetchcitationsauto") && (await this.updateItemsCitations(local219));
    if (Zotero.Prefs.get("ai4paper.titletranslate")) {
      for (let i59 of local219) {
        await Zotero.AI4Paper.translationEngineTask_title_abstract(i59, "title");
      }
    }
    if (Zotero.Prefs.get("ai4paper.retrievemetadataauto") && Zotero.Prefs.get('ai4paper.metadataabstract')) {
      for (let i60 of local219) {
        i60.getField("abstractNote") === '' && (this._Data_Abstract = null, await Zotero.AI4Paper.fetchItemCitations(i60), this._Data_Abstract != null && (i60.setField("abstractNote", this._Data_Abstract), await i60.saveTx()));
      }
    }
    if (Zotero.Prefs.get('ai4paper.abstracttranslate')) for (let i61 of local219) {
      await Zotero.AI4Paper.translationEngineTask_title_abstract(i61, "abstractNote");
    }
    if (Zotero.Prefs.get('ai4paper.retrievemetadataauto')) {
      await Zotero.AI4Paper.updateItemsMetadata(local219, true);
    }
    if (Zotero.Prefs.get("ai4paper.journalabbreviationlocaldatabasefirst")) for (let i62 of local219) {
      await Zotero.AI4Paper.fetchJournalAbbrLocal(i62);
    }
    for (let i63 of local219) {
      await this.setLanguageField(i63, null);
    }
    if (Zotero.Prefs.get("ai4paper.autoRenameNewAttachments")) {
      await this.renameAttachments(arg.filter(item => item.newFile != "true"));
    }
    Zotero.Prefs.get('ai4paper.autoInterpretNewItems') && (await this.interpretNewItems(arg));
  },
  'setLanguageField': async function (paramP, paramR) {
    let str40 = "language",
      prefVal37 = Zotero.Prefs.get("ai4paper.languagezh"),
      prefVal38 = Zotero.Prefs.get("ai4paper.languageen");
    if (paramR === null && Zotero.AI4Paper.checkItemField(paramP, str40) && Zotero.Prefs.get('ai4paper.languagesettingauto')) {
      Zotero.AI4Paper.isChineseText(paramP.getField('title')) ? paramP.setField(str40, prefVal37) : paramP.setField(str40, prefVal38);
      await paramP.saveTx();
    } else {
      if (paramR === 'en') {
        paramP.setField(str40, prefVal38);
        await paramP.saveTx();
      } else paramR === 'zh' && (paramP.setField(str40, prefVal37), await paramP.saveTx());
    }
  },

});
