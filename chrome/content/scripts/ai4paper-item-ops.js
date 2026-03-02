// ai4paper-item-ops.js - Item operations, files history, workspace, attachments, export module
// Extracted from ai4paper.js (Phase 16)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Image Operations (PicGo, save, copy, upload) ===
  'getTargetPath': async function () {
    var {
        FilePicker: FilePicker
      } = ChromeUtils.importESModule('chrome://zotero/content/modules/filePicker.mjs'),
      picker = new FilePicker();
    picker.init(window, "选择图片导出路径", picker.modeGetFolder);
    picker.appendFilters(picker.filterAll);
    if ((await picker.show()) != picker.returnOK) {
      return false;
    }
    var selectedPath = PathUtils.normalize(picker.file);
    return selectedPath;
  },
  'saveImageToTargetPath': async function (dataUri, targetDir, imageName) {
    try {
      let fileName = '图片';
      if (imageName) {
        fileName = imageName + ".png";
      } else {
        fileName = Zotero.getString('fileTypes.image').toLowerCase() + '.png';
      }
      let filePath;
      Zotero.isWin ? filePath = targetDir + '\x5c' + fileName : filePath = targetDir + '/' + fileName;
      let dataParts = dataUri.split(',');
      if (dataParts[0x0].includes("base64")) {
        let binaryStr = atob(dataParts[0x1]),
          binaryLen = binaryStr.length,
          byteArray = new Uint8Array(binaryLen);
        while (binaryLen--) {
          byteArray[binaryLen] = binaryStr.charCodeAt(binaryLen);
        }
        await OS.File.writeAtomic(filePath, byteArray);
      }
    } catch (e) {
      Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 导出图片出错啦", Zotero.getString(e));
    }
  },
  'saveImage': async function (dataUri, imageName) {
    try {
      var {
        FilePicker: FilePicker
      } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
      let picker = new FilePicker();
      picker.init(window, Zotero.getString('pdfReader.saveImageAs'), picker.modeSave);
      picker.appendFilter("PNG", "*.png");
      let fileName = '图片';
      if (imageName) {
        fileName = imageName + ".png";
      } else fileName = Zotero.getString("fileTypes.image").toLowerCase() + ".png";
      picker.defaultString = fileName;
      let pickerResult = await picker.show();
      if (pickerResult === picker.returnOK || pickerResult === picker.returnReplace) {
        let savePath = picker.file,
          dataParts = dataUri.split(',');
        if (dataParts[0x0].includes('base64')) {
          let binaryStr = atob(dataParts[0x1]),
            binaryLen = binaryStr.length,
            byteArray = new Uint8Array(binaryLen);
          while (binaryLen--) {
            byteArray[binaryLen] = binaryStr.charCodeAt(binaryLen);
          }
          await OS.File.writeAtomic(savePath, byteArray);
        }
      }
    } catch (e) {
      Zotero.AI4Paper.showProgressWindow(Zotero.getString(e));
    }
  },
  'copyImage': async function (dataUri) {
    let dataParts = dataUri.split(',');
    if (!dataParts[0x0].includes("base64")) return;
    let mimeType = dataParts[0x0].match(/:(.*?);/)[0x1],
      binaryStr = atob(dataParts[0x1]),
      binaryLen = binaryStr.length,
      byteArray = new Uint8Array(binaryLen);
    while (binaryLen--) {
      byteArray[binaryLen] = binaryStr.charCodeAt(binaryLen);
    }
    let imgTools = Components.classes['@mozilla.org/image/tools;1'].getService(Components.interfaces.imgITools),
      transferable = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable),
      clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard),
      decodedImage = imgTools.decodeImageFromArrayBuffer(byteArray.buffer, mimeType);
    transferable.init(null);
    let nativeImageFlavor = 'application/x-moz-nativeimage';
    transferable.addDataFlavor(nativeImageFlavor);
    transferable.setTransferData(nativeImageFlavor, decodedImage);
    clipboard.setData(transferable, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
  },
  'onAnnotationImage': async function (annotation, annotationKey) {
    var imagePath;
    let dataDir = Zotero.Prefs.get("extensions.zotero.dataDir", true),
      groupLibID = Zotero.AI4Paper.checkGroupLibItem(annotation.parentItem.parentItem);
    if (groupLibID) {
      imagePath = dataDir + '\x5ccache\x5cgroups\x5c' + groupLibID + '\x5c' + annotationKey + ".png";
      if (Zotero.isMac || Zotero.isLinux) {
        imagePath = dataDir + "/cache/groups/" + groupLibID + '/' + annotationKey + ".png";
      }
    } else {
      imagePath = dataDir + "\\cache\\library\\" + annotationKey + ".png";
      (Zotero.isMac || Zotero.isLinux) && (imagePath = dataDir + '/cache/library/' + annotationKey + ".png");
    }
    let comment = '' + annotation.annotationComment;
    if (comment.indexOf('![](') != -0x1) {
      return false;
    }
    let retryCount = 0x0;
    while (!(await OS.File.exists(imagePath))) {
      if (retryCount >= 0x258) {
        Zotero.debug("AI4Paper: Waiting for image failed");
        Zotero.AI4Paper.showProgressWindow(0x4e20, "❌ 捕获图片失败 【PicGo】", "【可能原因】：Zotero 响应延迟，或者本图片同步自另一台设备的 Zotero。\n【可能措施】：您可以删除当前框选图片，并重新框选！或者搭配【上传图片】注释按钮。", "picgo");
        return;
      }
      await Zotero.Promise.delay(0xa);
      retryCount++;
    }
    let binaryContents = await Zotero.File.getBinaryContentsAsync(imagePath),
      imageDataUri = "data:image/png;base64," + btoa(binaryContents),
      tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) return false;
    Zotero.Prefs.get("ai4paper.annotationimageactions") === "自动拷贝图片" && Zotero.AI4Paper.copyImage(imageDataUri);
    comment.indexOf('![](') === -0x1 && Zotero.Prefs.get('ai4paper.annotationimageactions') === "自动通过 PicGo 上传至图床" && Zotero.AI4Paper.uploadByPicGo(annotation, imagePath);
  },
  'uploadByPicGo': async function (annotation, imagePath) {
    var payload = {
        'list': [imagePath]
      },
      xhr = new XMLHttpRequest(),
      uploadUrl = "http://127.0.0.1:36677/upload";
    xhr.open("POST", uploadUrl, true);
    xhr.responseType = "json";
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.onreadystatechange = function () {
      if (!xhr.response.success) {
        Zotero.AI4Paper.showProgressWindow(0x4e20, '❌\x20图片上传失败\x20【PicGo】', xhr.response.success + "：上传失败！请检查网络或 PicGo 图床是否配置正确！", 'picgo');
      }
      xhr.readyState == 0x4 && xhr.status == 0xc8 && Zotero.AI4Paper.enhanceExtra() && xhr.response.success && (Zotero.AI4Paper.saveImageLinkCheck(annotation, xhr.response.result), Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 图片上传成功 【AI4paper】", "成功上传框选图片至图床，并返回链接:\n![](" + xhr.response.result + ')', "picgo"));
    };
    xhr.send(JSON.stringify(payload));
  },
  'saveImageLinkCheck': async function (annotation, imageUrl) {
    await Zotero.AI4Paper.saveImagePicgoMDLinK(annotation, imageUrl);
    await new Promise(resolve => setTimeout(resolve, 0x64));
    let comment = '' + annotation.annotationComment;
    if (comment.indexOf("![](") === -0x1) {
      await Zotero.AI4Paper.saveImagePicgoMDLinK(annotation, imageUrl);
    }
  },
  'saveImagePicgoMDLinK': async function (annotation, imageUrl) {
    let comment = '' + annotation.annotationComment,
      mdLink = "![](" + imageUrl + ')';
    if (comment === 'null') annotation.annotationComment = '' + mdLink;else comment != "null" && comment.indexOf("![](") === -0x1 && (annotation.annotationComment = comment + '\x0a' + mdLink);
    await annotation.saveTx();
  },
  'getAnnotationImage': async function (annotation, annotationKey) {
    var imagePath;
    let dataDir = Zotero.Prefs.get("extensions.zotero.dataDir", true),
      groupLibID = Zotero.AI4Paper.checkGroupLibItem(annotation.parentItem.parentItem);
    groupLibID ? (imagePath = dataDir + "\\cache\\groups\\" + groupLibID + '\x5c' + annotationKey + '.png', (Zotero.isMac || Zotero.isLinux) && (imagePath = dataDir + "/cache/groups/" + groupLibID + '/' + annotationKey + ".png")) : (imagePath = dataDir + "\\cache\\library\\" + annotationKey + ".png", (Zotero.isMac || Zotero.isLinux) && (imagePath = dataDir + "/cache/library/" + annotationKey + ".png"));
    let comment = '' + annotation.annotationComment;
    await new Promise(resolve => setTimeout(resolve, 0x32));
    if (await OS.File.exists(imagePath)) {
      Zotero.AI4Paper.uploadAnnotationImage(annotation, imagePath);
    } else Services.prompt.alert(window, "❌ 上传注释图片", "出错啦！未在本地找到注释图片！");
  },
  'uploadAnnotationImage': async function (annotation, imagePath) {
    var payload = {
        'list': [imagePath]
      },
      xhr = new XMLHttpRequest(),
      uploadUrl = "http://127.0.0.1:36677/upload";
    xhr.open('POST', uploadUrl, true);
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      !xhr.response.success && Services.prompt.alert(window, "❌ 图片上传失败 【PicGo】", xhr.response.success + "：上传失败！请检查网络或 PicGo 图床是否配置正确！");
      xhr.readyState == 0x4 && xhr.status == 0xc8 && Zotero.AI4Paper.enhanceExtra() && xhr.response.success && (Zotero.AI4Paper.returnImagePicgoMDLinK(annotation, xhr.response.result), Zotero.AI4Paper.showProgressWindow(0x1388, '✅\x20注释图片上传成功\x20【Zotero\x20One】', '成功上传注释图片至图床，并返回链接:\x0a![](' + xhr.response.result + ')', "picgo"));
    };
    xhr.send(JSON.stringify(payload));
  },
  'returnImagePicgoMDLinK': async function (annotation, imageUrl) {
    let comment = '' + annotation.annotationComment,
      mdLink = "![](" + imageUrl + ')';
    if (comment === 'null') annotation.annotationComment = '' + mdLink;else {
      if (comment != "null" && comment.indexOf('![](') === -0x1) annotation.annotationComment = comment + '\x0a' + mdLink;else {
        if (comment != 'null' && comment.indexOf('![](') != -0x1) {
          let linkStart = comment.indexOf("![]("),
            linkSubstr = comment.substring(linkStart),
            closeIdx = linkSubstr.indexOf(')'),
            oldUrl = linkSubstr.substring(0x4, closeIdx),
            prefix = '',
            suffix = '';
          linkSubstr.length > oldUrl.length + 0x5 && (suffix = linkSubstr.substring(oldUrl.length + 0x5));
          linkStart != 0x0 && (prefix = comment.substring(0x0, linkStart));
          annotation.annotationComment = '' + prefix + mdLink + suffix;
        }
      }
    }
    await annotation.saveTx();
  },

  // === Block B: Misc Item Utils ===
  'getItemTitleByDOI': async function (doi) {
    let apiUrl = "https://api.crossref.org/works/" + doi,
      response;
    try {
      return response = await Zotero.HTTP.request("GET", apiUrl, {
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify({}),
        'responseType': 'json'
      }), response.response.message.title[0x0];
    } catch (e) {
      return window.alert(e), false;
    }
  },
  'checkENZH': function (text) {
    var chineseRegex = new RegExp("[一-龥]+");
    if (chineseRegex.test(text)) return 'zh';else {
      var englishRegex = new RegExp('[A-Za-z]+');
      return englishRegex.test(text) ? 'en' : "others";
    }
  },
  'getItemLink': function (item) {
    let libraryType = Zotero.Libraries.get(item.libraryID).libraryType;
    if (libraryType === "group") return "zotero://select/" + Zotero.URI.getLibraryPath(item.libraryID) + "/items/" + item.key;else {
      if (libraryType === "user") {
        let libPath = 'library';
        return "zotero://select/library/items/" + item.key;
      }
    }
    return undefined;
  },

  // === Block C: Files History + Workspace ===
  'getFilesHistoryItemInfo': function (collectionName, title, timestamp, item, isAttachment) {
    let attachIcon = isAttachment ? "📃 " : '',
      infoWithTime = '【' + collectionName + '】' + attachIcon + title + " ⏰ " + timestamp + '\x20🆔\x20' + item.key,
      infoNoTime = '【' + collectionName + '】' + attachIcon + title + '\x20🆔\x20' + item.key;
    return {
      'info': infoWithTime,
      'info1': infoNoTime
    };
  },
  'findItemByIDORKey': function (idOrKey) {
    let foundItem;
    if (!isNaN(parseFloat(idOrKey)) && isFinite(idOrKey)) foundItem = Zotero.Items.get(idOrKey);else {
      for (let libraryID of Zotero.Libraries.getAll().map(el => el.libraryID)) {
        foundItem = Zotero.Items.getByLibraryAndKey(libraryID, idOrKey);
        if (foundItem) {
          return foundItem;
        }
        continue;
      }
    }
    return foundItem;
  },
  'filesHistory': function (item) {
    let historyStr = Zotero.Prefs.get("ai4paper.fileshistory"),
      historyEntries = historyStr.split('😊🎈🍓'),
      now = new Date(),
      dateStr = now.toLocaleDateString(),
      timeStr = now.toLocaleTimeString("chinese", {
        'hour12': false
      }),
      dateTimeStr = dateStr + '\x20' + timeStr,
      parentItem = item.parentItem;
    if (parentItem != undefined) {
      let title = parentItem.getField("title"),
        itemLink = Zotero.AI4Paper.getItemLink(parentItem),
        collectionNames = '',
        collectionIDs = parentItem.getCollections();
      if (collectionIDs.length != 0x0) {
        let names = [];
        for (let colID of collectionIDs) {
          let collection = Zotero.Collections.get(colID);
          names.push(collection.name);
        }
        collectionNames = names.join(',\x20');
      } else collectionNames = '未分类';
      let {
          info: fullInfo,
          info1: briefInfo
        } = Zotero.AI4Paper.getFilesHistoryItemInfo(collectionNames, title, dateTimeStr, parentItem),
        lastEntry = historyEntries[0x0],
        timeIdx = lastEntry.indexOf('⏰'),
        idIdx = lastEntry.indexOf('🆔'),
        beforeTime = lastEntry.substring(0x0, timeIdx),
        afterId = lastEntry.substring(idIdx),
        lastBrief = '' + beforeTime + afterId;
      briefInfo != lastBrief && historyEntries.unshift(fullInfo);
    } else {
      if (item.isRegularItem()) {
        let title = item.getField("title"),
          itemLink = Zotero.AI4Paper.getItemLink(item),
          collectionNames = '',
          collectionIDs = item.getCollections();
        if (collectionIDs.length != 0x0) {
          let names = [];
          for (let colID of collectionIDs) {
            let collection = Zotero.Collections.get(colID);
            names.push(collection.name);
          }
          collectionNames = names.join(',\x20');
        } else collectionNames = "未分类";
        let {
            info: fullInfo,
            info1: briefInfo
          } = Zotero.AI4Paper.getFilesHistoryItemInfo(collectionNames, title, dateTimeStr, item),
          lastEntry = historyEntries[0x0],
          timeIdx = lastEntry.indexOf('⏰'),
          idIdx = lastEntry.indexOf('🆔'),
          beforeTime = lastEntry.substring(0x0, timeIdx),
          afterId = lastEntry.substring(idIdx),
          lastBrief = '' + beforeTime + afterId;
        briefInfo != lastBrief && historyEntries.unshift(fullInfo);
      } else {
        if (item.isAttachment()) {
          let title = item.getField("title"),
            itemLink = Zotero.AI4Paper.getItemLink(item),
            collectionNames = '',
            collectionIDs = item.getCollections();
          if (collectionIDs.length != 0x0) {
            let names = [];
            for (let colID of collectionIDs) {
              let collection = Zotero.Collections.get(colID);
              names.push(collection.name);
            }
            collectionNames = names.join(',\x20');
          } else collectionNames = "未分类";
          let {
              info: fullInfo,
              info1: briefInfo
            } = Zotero.AI4Paper.getFilesHistoryItemInfo(collectionNames, title, dateTimeStr, item, true),
            lastEntry = historyEntries[0x0],
            timeIdx = lastEntry.indexOf('⏰'),
            idIdx = lastEntry.indexOf('🆔'),
            beforeTime = lastEntry.substring(0x0, timeIdx),
            afterId = lastEntry.substring(idIdx),
            lastBrief = '' + beforeTime + afterId;
          if (briefInfo != lastBrief) {
            historyEntries.unshift(fullInfo);
          }
        }
      }
    }
    let isLicensed = Zotero.AI4Paper.letDOI(),
      trimmed = [];
    for (let idx = 0x0; idx < 0x3e8; idx++) {
      historyEntries[idx] != undefined && trimmed.push(historyEntries[idx]);
    }
    isLicensed && Zotero.Prefs.set('ai4paper.fileshistory', trimmed.join("😊🎈🍓"));
  },
  'openWorkSpaceWindow': function () {
    Zotero.AI4Paper._data_useWorkSpaceView = true;
    Zotero.AI4Paper.openDialog_filesHistory();
  },
  'openDialog_filesHistory': function () {
    Zotero.AI4Paper.openDialogByType("filesHistory");
  },
  'go2FilesHistoryItem': async function (historyEntry) {
    if (historyEntry.indexOf('🆔') != -0x1) {
      let idStart = historyEntry.indexOf('🆔'),
        itemKey = historyEntry.substring(idStart + 0x3),
        item = Zotero.AI4Paper.findItemByIDORKey(itemKey);
      if (!item) {
        window.alert("未查询到该文献，可能已经被您删除！");
        return;
      }
      Zotero.AI4Paper.showDate() && Zotero.AI4Paper.showItemInCollection(item);
    }
  },
  'openFilesHistoryItem': async function (historyEntries) {
    for (let entry of historyEntries) {
      if (entry.indexOf('🆔') != -0x1) {
        let idStart = entry.indexOf('🆔'),
          itemKey = entry.substring(idStart + 0x3),
          item = Zotero.AI4Paper.findItemByIDORKey(itemKey);
        if (!item) {
          return Zotero.AI4Paper.showProgressWindow(0xbb8, "【AI4paper】最近打开", "❌ 未查询到该文献，可能已经被您删除！"), false;
        }
        if (item.isRegularItem()) {
          let attachment = await item.getBestAttachment();
          if (!attachment) {
            Zotero.AI4Paper.showProgressWindow(0xbb8, "【AI4paper】最近打开", "❌ 该条目无附件可打开！");
            return;
          }
          Zotero.Reader.open(attachment.id, null, {
            'openInWindow': false
          });
        } else {
          if (item.isAttachment) {
            if (["application/pdf", "text/html", "application/epub+zip"].includes(item.attachmentContentType)) {
              if (item.attachmentLinkMode === 0x3) return;
              Zotero.Reader.open(item.id, null, {
                'openInWindow': false
              });
            } else Zotero.AI4Paper.showProgressWindow(0xbb8, '【Zotero\x20One】最近打开', "❌ 该条目非【PDF/Epub/网页快照】类型附件，无法打开！");
          }
        }
      }
    }
  },
  'getBeforeDate': function (daysAgo) {
    const dayOffset = daysAgo,
      now = new Date();
    let year = now.getFullYear(),
      month = now.getMonth() + 0x1,
      day = now.getDate();
    if (day <= dayOffset) {
      if (month > 0x1) {
        month = month - 0x1;
      } else {
        year = year - 0x1;
        month = 0xc;
      }
    }
    now.setDate(now.getDate() - dayOffset);
    year = now.getFullYear();
    month = now.getMonth() + 0x1;
    day = now.getDate();
    const dateStr = year + '/' + month + '/' + day;
    return dateStr;
  },
  'dateDiff': function (dateStr1, dateStr2) {
    var diffSeconds = (new Date(dateStr1) - new Date(dateStr2)) / 0x3e8,
      diffDays = parseInt(diffSeconds / 0x15180);
    if (diffDays >= 0x0) {
      return true;
    } else {
      return false;
    }
  },
  'getFilesHistory': function () {
    let historyStr = Zotero.Prefs.get('ai4paper.fileshistory'),
      entries = historyStr.split('😊🎈🍓'),
      result = [];
    for (let i = 0x0; i < entries.length; i++) {
      entries[i] != '' && result.push('[' + (i + 0x1) + ']\x20' + entries[i]);
    }
    return result;
  },
  'getFilesHistoryToday': function () {
    let historyStr = Zotero.Prefs.get("ai4paper.fileshistory"),
      cutoffDate = Zotero.AI4Paper.getBeforeDate(0x0);
    var result = [];
    let entries = historyStr.split("😊🎈🍓"),
      nonEmpty = [],
      filtered = [];
    for (let i = 0x0; i < entries.length; i++) {
      entries[i] != '' && nonEmpty.push(entries[i]);
    }
    for (let i = 0x0; i < nonEmpty.length; i++) {
      let timeIdx = nonEmpty[i].indexOf('⏰'),
        idIdx = nonEmpty[i].indexOf('🆔'),
        dateStr = nonEmpty[i].substring(timeIdx + 0x2, idIdx - 0x1);
      dateStr = dateStr.substring(0x0, dateStr.indexOf('\x20'));
      if (Zotero.AI4Paper.dateDiff(dateStr, cutoffDate)) {
        filtered.push(nonEmpty[i]);
      }
    }
    for (let i = 0x0; i < filtered.length; i++) {
      result.push('[' + (i + 0x1) + ']\x20' + filtered[i]);
    }
    return result;
  },
  'getFilesHistoryLastDay': function () {
    let historyStr = Zotero.Prefs.get("ai4paper.fileshistory"),
      cutoffDate = Zotero.AI4Paper.getBeforeDate(0x1);
    var result = [];
    let entries = historyStr.split('😊🎈🍓'),
      nonEmpty = [],
      filtered = [];
    for (let i = 0x0; i < entries.length; i++) {
      entries[i] != '' && nonEmpty.push(entries[i]);
    }
    for (let i = 0x0; i < nonEmpty.length; i++) {
      let timeIdx = nonEmpty[i].indexOf('⏰'),
        idIdx = nonEmpty[i].indexOf('🆔'),
        dateStr = nonEmpty[i].substring(timeIdx + 0x2, idIdx - 0x1);
      dateStr = dateStr.substring(0x0, dateStr.indexOf('\x20'));
      Zotero.AI4Paper.dateDiff(dateStr, cutoffDate) && filtered.push(nonEmpty[i]);
    }
    for (let i = 0x0; i < filtered.length; i++) {
      result.push('[' + (i + 0x1) + ']\x20' + filtered[i]);
    }
    return result;
  },
  'getFilesHistoryLastWeek': function () {
    let historyStr = Zotero.Prefs.get("ai4paper.fileshistory"),
      cutoffDate = Zotero.AI4Paper.getBeforeDate(0x7);
    var result = [];
    let entries = historyStr.split("😊🎈🍓"),
      nonEmpty = [],
      filtered = [];
    for (let i = 0x0; i < entries.length; i++) {
      entries[i] != '' && nonEmpty.push(entries[i]);
    }
    for (let i = 0x0; i < nonEmpty.length; i++) {
      let timeIdx = nonEmpty[i].indexOf('⏰'),
        idIdx = nonEmpty[i].indexOf('🆔'),
        dateStr = nonEmpty[i].substring(timeIdx + 0x2, idIdx - 0x1);
      dateStr = dateStr.substring(0x0, dateStr.indexOf('\x20'));
      if (Zotero.AI4Paper.dateDiff(dateStr, cutoffDate)) {
        filtered.push(nonEmpty[i]);
      }
    }
    for (let i = 0x0; i < filtered.length; i++) {
      result.push('[' + (i + 0x1) + ']\x20' + filtered[i]);
    }
    return result;
  },
  'getFilesHistoryLastMonth': function () {
    let historyStr = Zotero.Prefs.get("ai4paper.fileshistory"),
      cutoffDate = Zotero.AI4Paper.getBeforeDate(0x1e);
    var result = [];
    let entries = historyStr.split('😊🎈🍓'),
      nonEmpty = [],
      filtered = [];
    for (let i = 0x0; i < entries.length; i++) {
      entries[i] != '' && nonEmpty.push(entries[i]);
    }
    for (let i = 0x0; i < nonEmpty.length; i++) {
      let timeIdx = nonEmpty[i].indexOf('⏰'),
        idIdx = nonEmpty[i].indexOf('🆔'),
        dateStr = nonEmpty[i].substring(timeIdx + 0x2, idIdx - 0x1);
      dateStr = dateStr.substring(0x0, dateStr.indexOf('\x20'));
      Zotero.AI4Paper.dateDiff(dateStr, cutoffDate) && filtered.push(nonEmpty[i]);
    }
    for (let i = 0x0; i < filtered.length; i++) {
      result.push('[' + (i + 0x1) + ']\x20' + filtered[i]);
    }
    return result;
  },
  'getFilesHistorySearch': function (searchQuery) {
    let historyStr = Zotero.Prefs.get("ai4paper.fileshistory"),
      entries = historyStr.split("😊🎈🍓"),
      numbered = [];
    for (let i = 0x0; i < entries.length; i++) {
      entries[i] != '' && numbered.push('[' + (i + 0x1) + ']\x20' + entries[i]);
    }
    var matched = [];
    for (let entry of numbered) {
      if (entry.indexOf('🆔') != -0x1) {
        let idStart = entry.indexOf('🆔'),
          itemKey = entry.substring(idStart + 0x3),
          item = Zotero.AI4Paper.findItemByIDORKey(itemKey);
        if (item) try {
          let titleLower = item.getField("title").toLowerCase();
          titleLower.indexOf(searchQuery.toLowerCase()) != -0x1 && matched.push(entry);
        } catch (e) {}
      }
    }
    return matched;
  },
  'openDialog_setWorkSpaceName': function (action, dataIn) {
    var dialogArgs = {
        'action': action,
        'dataIn': dataIn,
        'dataOut': null
      },
      dialog = window.openDialog("chrome://ai4paper/content/selectionDialog/setWorkSpaceName.xhtml", "_blank", "chrome,modal,centerscreen,resizable=yes", dialogArgs);
    return dialogArgs.dataOut;
  },
  'createTabsAsWorkSpace': function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let openTabs = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(item => item.id != "zotero-pane"),
      tabItemIDs = openTabs.map(item => item.data.itemID);
    if (!tabItemIDs.length) return window.alert("未打开任何文献（即标签页）！"), false;
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      existingNames = Object.values(workSpaces).map(item => item.workSpaceName),
      newName = Zotero.AI4Paper.openDialog_setWorkSpaceName("add", tabItemIDs.length);
    if (!newName) {
      return;
    }
    if (existingNames.includes(newName)) {
      window.alert("您输入的【" + newName + '】与现有工作区名称重复，请重新输入！');
      return;
    }
    let itemKeys = [];
    for (let itemID of tabItemIDs) {
      let item = Zotero.Items.get(itemID);
      item && itemKeys.push(item.key);
    }
    let wsEntry = {
      'workSpaceName': newName,
      'workSpaceItemsKey': itemKeys
    };
    return workSpaces.push(wsEntry), Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(workSpaces)), workSpaces;
  },
  'renameWorkSpace': function (oldName) {
    let newName = Zotero.AI4Paper.openDialog_setWorkSpaceName("rename", oldName);
    if (!newName.trim()) return window.alert("不允许为空值！已停止重命名。"), false;else {
      if (newName.trim() === oldName) {
        return window.alert('两次名称相同！'), false;
      } else {
        let existingNames = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")).map(item => item.workSpaceName);
        if (existingNames.includes(newName)) return window.alert("您输入的【" + newName + "】与现有工作区名称重复，请重新输入！"), false;
      }
    }
    let workSpaces = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === oldName) return workSpaces[i].workSpaceName = newName, Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(workSpaces)), newName;
    }
    return false;
  },
  'setTopWorkSpace': function (wsName) {
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        const wsEntry = workSpaces[i];
        return workSpaces.splice(i, 0x1), workSpaces.unshift(wsEntry), Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(workSpaces)), wsName;
      }
    }
    return false;
  },
  'moveUpWorkSpace': function (wsName) {
    let workSpaces = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        if (i === 0x0) {
          const wsEntry = workSpaces.shift();
          workSpaces.push(wsEntry);
        } else [workSpaces[i - 0x1], workSpaces[i]] = [workSpaces[i], workSpaces[i - 0x1]];
        return Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(workSpaces)), wsName;
      }
    }
    return false;
  },
  'moveDownWorkSpace': function (wsName) {
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        if (i === workSpaces.length - 0x1) {
          const wsEntry = workSpaces.pop();
          workSpaces.unshift(wsEntry);
        } else [workSpaces[i], workSpaces[i + 0x1]] = [workSpaces[i + 0x1], workSpaces[i]];
        return Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(workSpaces)), wsName;
      }
    }
    return false;
  },
  'setTopWorkSpaceItem': function (wsName, itemKey) {
    let workSpaces = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        for (let j = 0x0; j < workSpaces[i].workSpaceItemsKey.length; j++) {
          if (workSpaces[i].workSpaceItemsKey[j] === itemKey) return workSpaces[i].workSpaceItemsKey.splice(j, 0x1), workSpaces[i].workSpaceItemsKey.unshift(itemKey), Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(workSpaces)), wsName;
        }
      }
    }
    return false;
  },
  'moveUpWorkSpaceItem': function (wsName, itemKey) {
    let workSpaces = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        for (let j = 0x0; j < workSpaces[i].workSpaceItemsKey.length; j++) {
          if (workSpaces[i].workSpaceItemsKey[j] === itemKey) {
            return j === 0x0 ? (workSpaces[i].workSpaceItemsKey.shift(), workSpaces[i].workSpaceItemsKey.push(itemKey)) : [workSpaces[i].workSpaceItemsKey[j - 0x1], workSpaces[i].workSpaceItemsKey[j]] = [workSpaces[i].workSpaceItemsKey[j], workSpaces[i].workSpaceItemsKey[j - 0x1]], Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(workSpaces)), wsName;
          }
        }
      }
    }
    return false;
  },
  'moveDownWorkSpaceItem': function (wsName, itemKey) {
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) for (let j = 0x0; j < workSpaces[i].workSpaceItemsKey.length; j++) {
        if (workSpaces[i].workSpaceItemsKey[j] === itemKey) {
          return j === workSpaces[i].workSpaceItemsKey.length - 0x1 ? (workSpaces[i].workSpaceItemsKey.pop(), workSpaces[i].workSpaceItemsKey.unshift(itemKey)) : [workSpaces[i].workSpaceItemsKey[j], workSpaces[i].workSpaceItemsKey[j + 0x1]] = [workSpaces[i].workSpaceItemsKey[j + 0x1], workSpaces[i].workSpaceItemsKey[j]], Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(workSpaces)), wsName;
        }
      }
    }
    return false;
  },
  'addCurrentTab2WorkSpace': function (wsName) {
    let currentTab = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(item => item.id != "zotero-pane" && item.id === Zotero_Tabs._selectedID);
    if (!currentTab.length) {
      return window.alert("请切换至目标文献的标签页！"), false;
    }
    let itemKey,
      itemID = currentTab[0x0].data.itemID,
      item = Zotero.Items.get(itemID);
    if (item) itemKey = item.key;else return window.alert('条目不存在！'), false;
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        let keys = workSpaces[i].workSpaceItemsKey;
        if (keys.includes(itemKey)) {
          return window.alert("❌ 当前工作区已存在该文献，无须重复添加！"), false;
        }
        return keys.push(itemKey), workSpaces[i].workSpaceItemsKey = keys, Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(workSpaces)), wsName;
      }
    }
    return false;
  },
  'addAllTabs2WorkSpace': function (wsName) {
    let openTabs = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(item => item.id != "zotero-pane"),
      tabItemIDs = openTabs.map(item => item.data.itemID);
    if (!tabItemIDs.length) return window.alert("未打开任何文献（即标签页），无法添加！"), false;
    let itemKeys = [];
    for (let itemID of tabItemIDs) {
      let item = Zotero.Items.get(itemID);
      item && itemKeys.push(item.key);
    }
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        let dupCount = 0x0,
          keys = workSpaces[i].workSpaceItemsKey;
        for (let key of itemKeys) {
          keys.includes(key) ? dupCount++ : keys.push(key);
        }
        if (itemKeys.length === dupCount) return window.alert('❌\x20所有标签页文献均已在工作区中，无须再添加！'), false;
        let confirmed = window.confirm("是否确认将所有【" + itemKeys.length + "】篇标签页文献添加至工作区【" + wsName + "】？（其中【" + dupCount + '】篇已存在工作区内）');
        if (confirmed) return workSpaces[i].workSpaceItemsKey = keys, Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(workSpaces)), wsName;else {
          return false;
        }
      }
    }
    return false;
  },
  'removeItemFromWorkSpace': function (wsName, itemKey) {
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        let keys = workSpaces[i].workSpaceItemsKey;
        if (!keys.length) {
          return window.alert("当前工作区无文献！"), false;
        }
        let idx = keys.indexOf(itemKey);
        if (idx === -0x1) return;
        keys.splice(idx, 0x1);
        let confirmed = window.confirm("是否确认从工作区【" + wsName + "】移除当前文献？");
        if (confirmed) {
          return workSpaces[i].workSpaceItemsKey = keys, Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(workSpaces)), wsName;
        } else return false;
      }
    }
    return false;
  },
  'removeSelectedItemsFromWorkSpace': function (wsName, selectedKeys) {
    let workSpaces = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        let keys = workSpaces[i].workSpaceItemsKey;
        if (!keys.length) return window.alert("当前工作区无文献！"), false;
        for (itemKey of selectedKeys) {
          let idx = keys.indexOf(itemKey);
          if (idx === -0x1) return;
          keys.splice(idx, 0x1);
        }
        let confirmed = window.confirm("是否确认从工作区【" + wsName + "】移除选中的【" + selectedKeys.length + '】篇文献？');
        if (confirmed) {
          return workSpaces[i].workSpaceItemsKey = keys, Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(workSpaces)), wsName;
        } else return false;
      }
    }
    return false;
  },
  'removeAllItemsFromWorkSpace': function (wsName) {
    let workSpaces = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        if (!workSpaces[i].workSpaceItemsKey.length) {
          return window.alert("❌ 工作区【" + wsName + '】已经为空！'), false;
        }
        let confirmed = window.confirm("是否确认清空工作区【" + wsName + "】内的全部【" + workSpaces[i].workSpaceItemsKey.length + "】篇文献？👉一旦清空，将无法恢复。👈");
        if (confirmed) {
          return workSpaces[i].workSpaceItemsKey = [], Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(workSpaces)), wsName;
        } else {
          return false;
        }
      }
    }
    return false;
  },
  'replaceWorkSpaceItems': function (wsName) {
    let openTabs = Zotero.getMainWindow().Zotero_Tabs._tabs.filter(item => item.id != "zotero-pane"),
      tabItemIDs = openTabs.map(item => item.data.itemID);
    if (!tabItemIDs.length) return window.alert("未打开任何文献（即标签页），无法替换！"), false;
    let itemKeys = [];
    for (let itemID of tabItemIDs) {
      let item = Zotero.Items.get(itemID);
      item && itemKeys.push(item.key);
    }
    let workSpaces = JSON.parse(Zotero.Prefs.get('ai4paper.workSpacesData'));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        let confirmed = window.confirm("是否确认将当前打开的【" + itemKeys.length + "】篇文献替换【" + wsName + '】工作区内的全部文献？');
        if (confirmed) return workSpaces[i].workSpaceItemsKey = itemKeys, Zotero.Prefs.set('ai4paper.workSpacesData', JSON.stringify(workSpaces)), wsName;else {
          return false;
        }
      }
    }
    return false;
  },
  'deleteWorkSpace': function (wsName) {
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData"));
    for (let i = 0x0; i < workSpaces.length; i++) {
      if (workSpaces[i].workSpaceName === wsName) {
        return workSpaces.splice(i, 0x1), Zotero.Prefs.set("ai4paper.workSpacesData", JSON.stringify(workSpaces)), true;
      }
    }
    return false;
  },
  'copyWorkSpaceSummary': function (wsName) {
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      matchedWS = null;
    for (let ws of workSpaces) {
      if (ws.workSpaceName === wsName) {
        matchedWS = ws;
      }
    }
    let lines = [];
    if (matchedWS) {
      let keys = matchedWS.workSpaceItemsKey,
        counter = 0x1;
      for (let key of keys) {
        for (let libraryID of Zotero.Libraries.getAll().map(item => item.libraryID)) {
          let item = Zotero.Items.getByLibraryAndKey(libraryID, key);
          item && (lines.push("- [" + counter + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(item) + '】' + item.getField("title") + " 🆔 " + item.key), counter++);
        }
      }
      Zotero.AI4Paper.copy2Clipboard("## 工作区【" + wsName + '】共有【' + lines.length + '】篇文献\x0a\x0a' + lines.join('\x0a'));
      Zotero.AI4Paper.showProgressWindow(0xbb8, "拷贝工作区概要【AI4paper】", '✅\x20工作区【' + wsName + "】概要已拷贝，共【" + lines.length + "】篇文献！");
    } else window.alert('工作区【' + wsName + "】内无文献！");
    return lines;
  },
  'copyAllWorkSpacesSummary': function () {
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      summaries = [];
    for (let ws of workSpaces) {
      let lines = [],
        keys = ws.workSpaceItemsKey,
        counter = 0x1;
      for (let key of keys) {
        for (let libraryID of Zotero.Libraries.getAll().map(item => item.libraryID)) {
          let item = Zotero.Items.getByLibraryAndKey(libraryID, key);
          item && (lines.push("- [" + counter + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(item) + '】' + item.getField('title') + " 🆔 " + item.key), counter++);
        }
      }
      lines.length && summaries.push("## 工作区【" + ws.workSpaceName + "】共有【" + lines.length + "】篇文献\n\n" + lines.join('\x0a'));
    }
    if (summaries.length) {
      Zotero.AI4Paper.copy2Clipboard('' + summaries.join("\n\n\n"));
      Zotero.AI4Paper.showProgressWindow(0xbb8, "拷贝全部工作区概要【AI4paper】", "✅ 已拷贝全部【" + summaries.length + "】个工作区的概要！");
    } else {
      window.alert("未获取到工作区数据！");
    }
    return summaries;
  },
  'getWorkSpaceItemsInfo': function (wsName) {
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      matchedWS = null;
    for (let ws of workSpaces) {
      ws.workSpaceName === wsName && (matchedWS = ws);
    }
    let lines = [];
    if (matchedWS) {
      let keys = matchedWS.workSpaceItemsKey,
        counter = 0x1;
      for (let key of keys) {
        for (let libraryID of Zotero.Libraries.getAll().map(item => item.libraryID)) {
          let item = Zotero.Items.getByLibraryAndKey(libraryID, key);
          item && (lines.push('[' + counter + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(item) + '】' + item.getField("title") + " 🆔 " + item.key), counter++);
        }
      }
    }
    return lines;
  },
  'searchWorkSpaceItems': function (wsName, query) {
    let workSpaces = JSON.parse(Zotero.Prefs.get("ai4paper.workSpacesData")),
      matchedWS = null;
    for (let ws of workSpaces) {
      ws.workSpaceName === wsName && (matchedWS = ws);
    }
    let results = [];
    if (matchedWS) {
      let keys = matchedWS.workSpaceItemsKey,
        counter = 0x1;
      for (let key of keys) {
        for (let libraryID of Zotero.Libraries.getAll().map(item => item.libraryID)) {
          let item = Zotero.Items.getByLibraryAndKey(libraryID, key);
          if (item) {
            let titleLower = item.getField("title").toLowerCase();
            titleLower.indexOf(query.toLowerCase()) != -0x1 && (results.push('[' + counter + ']【' + Zotero.AI4Paper.getItemCollectionsInfo(item) + '】' + item.getField("title") + " 🆔 " + item.key), counter++);
          }
        }
      }
    }
    return results;
  },

  // === Block D: File/Attachment Operations ===
  'showFile': async function () {
    async function getBestAttachmentItem(item) {
      if (item.isAttachment()) {
        if (item.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) return false;
        return item;
      } else return await item.getBestAttachment();
    }
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    var reader = Zotero.Reader.getByTabID(Zotero_Tabs._selectedID);
    if (reader) {
      let itemID = reader.itemID;
      var attachment = Zotero.Items.get(itemID);
      attachment.isAttachment() && ZoteroPane_Local.showAttachmentInFilesystem(attachment.id);
    } else {
      var selectedItems = ZoteroPane.getSelectedItems();
      for (let item of selectedItems) {
        var attachment = await getBestAttachmentItem(item);
        attachment && ZoteroPane_Local.showAttachmentInFilesystem(attachment.id);
      }
    }
  },
  'attachNewFile': async function () {
    function findNewestFile(dirPath) {
      var dir = Zotero.File.pathToFile(dirPath),
        allowedTypes = Zotero.Prefs.get("ai4paper.fileTypes").split(',').map(item => item.trim().toLowerCase()),
        entries = dir.directoryEntries,
        newestFile = {
          'lastModifiedTime': 0x0
        };
      while (entries.hasMoreElements()) {
        var entry = entries.getNext().QueryInterface(Components.interfaces.nsIFile),
          ext = getFileExtension(entry.leafName).toLowerCase();
        if (entry.isDirectory() || entry.isHidden() || !allowedTypes.includes(ext)) continue;
        if (entry.isFile() && entry.lastModifiedTime > newestFile.lastModifiedTime) newestFile = entry;
      }
      return newestFile.lastModifiedTime == 0x0 ? undefined : newestFile.path;
    }
    function getFileExtension(fileName) {
      var dotIdx = fileName.lastIndexOf('.');
      return dotIdx == -0x1 ? '' : fileName.substr(dotIdx + 0x1);
    }
    async function importAndAttach(parentItem, filePath) {
      let importOpts = {
        'file': filePath,
        'libraryID': parentItem.libraryID,
        'parentItemID': parentItem.id,
        'collections': undefined
      };
      var newAttachment = await Zotero.Attachments.importFromFile(importOpts);
      newAttachment.newFile = "true";
      if (Zotero.Prefs.get("ai4paper.deleteSourceFileWhenAttached")) {
        filePath != newAttachment.getFilePath() && OS.File.remove(filePath);
      }
      if (Zotero.Prefs.get('ai4paper.renameAfterAttaching')) {
        await Zotero.AI4Paper.renameAttachments([newAttachment]);
      }
    }
    if (Zotero_Tabs._selectedID != "zotero-pane") return;
    var selectedItem = ZoteroPane.getSelectedItems()[0x0];
    if (!selectedItem) return;
    selectedItem = !selectedItem.isTopLevelItem() ? Zotero.Items.get(selectedItem.parentItemID) : selectedItem;
    if (selectedItem.library.libraryType === "feed") {
      window.alert("该条目为 RSS 订阅条目，无法执行本操作！");
      return;
    }
    if (!selectedItem.isEditable()) {
      window.alert("您没有该条目的编辑权限！");
      return;
    }
    if (!selectedItem.isRegularItem()) {
      window.alert("请选择一个常规条目！");
      return;
    }
    var watchDir = Zotero.Prefs.get("ai4paper.newfileDirectory");
    if (!watchDir || !(await OS.File.exists(watchDir))) return window.alert("新文件监控目录未设置，或该目录不存在！请前往【AI4paper --> 附件管理】设置。"), false;
    var filePaths = [findNewestFile(watchDir)];
    if (!filePaths[0x0]) {
      window.alert("获取最新文件失败！");
      return;
    }
    let confirmed = Services.prompt.confirm(window, "📎 绑定新文件", "是否要绑定文件：" + OS.Path.basename(filePaths[0x0]));
    if (!confirmed) return false;
    for (var i = 0x0; i < filePaths.length; i++) {
      await importAndAttach(selectedItem, filePaths[i]);
    }
  },
  'is4AttachNewFile': function () {
    var selectedItem = ZoteroPane.getSelectedItems()[0x0];
    if (!selectedItem || !selectedItem.isTopLevelItem() || !selectedItem.isRegularItem() || selectedItem.library.libraryType === 'feed' || !selectedItem.isEditable()) return false;
    return true;
  },
  'renameAttachments': async function (items) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    var allowedTypes = Zotero.Prefs.get("ai4paper.fileTypes").split(',').map(item => item.trim().toLowerCase());
    let renameCount = 0x0,
      useTemplate = false;
    if (!items) {
      var itemList = ZoteroPane.getSelectedItems();
    } else {
      var itemList = items;
    }
    if (!items && Zotero.AI4Paper.hasAttachmentItem() && Zotero.Prefs.get("ai4paper.enableRenameTemplate")) {
      let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectRenameStyle");
      if (dialogResult[0x0]) {
        Zotero.Prefs.set("ai4paper.lastRenameStyle", dialogResult[0x0]);
        var renameStyle = dialogResult[0x0];
        if (renameStyle === "默认：按父级元数据") useTemplate = false;else {
          if (renameStyle === "自定：手动输入名称") {
            renameStyle = window.prompt('请输入想要的名称：', '');
            if (renameStyle.trim()) {
              useTemplate = true;
            }
          } else useTemplate = true;
        }
      }
    }
    for (let el of itemList) {
      if (el.isRegularItem()) {
        let attachmentIDs = el.getAttachments();
        for (let attID of attachmentIDs) {
          let attachment = Zotero.Items.get(attID);
          if (!Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && attachment.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) continue;else {
            if (Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && (attachment.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL || attachment.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_FILE)) continue;
          }
          var filePath = await attachment.getFilePathAsync();
          if (!filePath) continue;
          let parentID = attachment.parentItemID,
            parentItem = await Zotero.Items.getAsync(parentID);
          var newName = Zotero.Attachments.getFileBaseNameFromItem(parentItem);
          let extRegex = /\.[^\.]+$/,
            fileName = filePath.split('/').pop(),
            extMatch = fileName.match(extRegex);
          extMatch && (newName = newName + extMatch[0x0]);
          if (!allowedTypes.includes(extMatch) && items) {
            continue;
          }
          var renameResult = await attachment.renameAttachmentFile(newName, false, true);
          if (renameResult !== true) {
            Zotero.debug("Could not rename file (" + renameResult + ')');
            continue;
          }
          attachment.setField("title", newName);
          await attachment.saveTx();
          renameCount++;
        }
      } else {
        if (el.isAttachment()) {
          if (!Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && el.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) continue;else {
            if (Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && (el.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL || el.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_FILE)) {
              continue;
            }
          }
          var filePath = await el.getFilePathAsync();
          if (!filePath) continue;
          let parentID = el.parentItemID;
          if (!parentID) {
            continue;
          }
          let parentItem = await Zotero.Items.getAsync(parentID);
          if (useTemplate) var newName = '【' + renameStyle.trim() + "】- " + Zotero.Attachments.getFileBaseNameFromItem(parentItem);else var newName = Zotero.Attachments.getFileBaseNameFromItem(parentItem);
          let extRegex = /\.[^\.]+$/,
            fileName = filePath.split('/').pop(),
            extMatch = fileName.match(extRegex);
          if (extMatch) {
            newName = newName + extMatch[0x0];
          }
          if (!allowedTypes.includes(extMatch) && items) {
            continue;
          }
          var renameResult = await el.renameAttachmentFile(newName, false, true);
          if (renameResult !== true) {
            Zotero.debug("Could not rename file (" + renameResult + ')');
            continue;
          }
          el.setField("title", newName);
          await el.saveTx();
          renameCount++;
        }
      }
    }
    !items && Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 重命名附件", "成功重命名【" + renameCount + "】个附件！");
  },
  'is4RenameAttachments': function () {
    var selectedItems = ZoteroPane.getSelectedItems();
    if (selectedItems.length === 0x1 && selectedItems[0x0].isTopLevelItem() && !selectedItems[0x0].isEditable()) return false;
    for (let item of selectedItems) {
      if (item.isRegularItem()) {
        let attachmentIDs = item.getAttachments();
        if (attachmentIDs.length) {
          return true;
        }
      } else {
        if (item.isAttachment() && item.parentItemID && !Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && item.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL) return true;else {
          if (item.isAttachment() && item.parentItemID && Zotero.Prefs.get('ai4paper.renameExcludesLinkedFile') && item.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL && item.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_FILE) {
            return true;
          }
        }
      }
    }
    return false;
  },
  'hasAttachmentItem': function () {
    var selectedItems = ZoteroPane.getSelectedItems();
    for (let item of selectedItems) {
      if (item.isAttachment() && item.parentItemID && !Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && item.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL) return true;else {
        if (item.isAttachment() && item.parentItemID && Zotero.Prefs.get("ai4paper.renameExcludesLinkedFile") && item.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_URL && item.attachmentLinkMode != Zotero.Attachments.LINK_MODE_LINKED_FILE) return true;
      }
    }
    return false;
  },
  'previewItemMac': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle() || !Zotero.Prefs.get('ai4paper.enableMacPreview')) return -0x1;
    let paneTab = window.document.querySelector("[data-id=\"zotero-pane\"]");
    if (paneTab) {
      if (!paneTab.classList.contains("selected")) return;
    }
    if (Zotero_Tabs._selectedID != "zotero-pane") {
      return window.close(), true;
    } else var selectedItem = ZoteroPane.getSelectedItems()[0x0];
    if (!selectedItem) return;
    if (selectedItem.isRegularItem()) {
      let attachment = await selectedItem.getBestAttachment();
      if (!attachment) return;
      Zotero.Reader.open(attachment.id, null, {
        'openInWindow': true
      });
    } else {
      if (selectedItem.isAttachment) {
        if (["application/pdf", "text/html", "application/epub+zip"].includes(selectedItem.attachmentContentType)) {
          if (selectedItem.attachmentLinkMode === 0x3) return;
          Zotero.Reader.open(selectedItem.id, null, {
            'openInWindow': true
          });
        }
      }
    }
  },
  'previewItemWin': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle() || !Zotero.Prefs.get('ai4paper.enableWinPreview')) return -0x1;
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID));
    } else var item = ZoteroPane.getSelectedItems()[0x0];
    var quickLookPath = Zotero.Prefs.get('extensions.zotero.ai4paper.quicklookapppath', true);
    if (!quickLookPath) {
      return window.alert('请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20拓展】设定\x20QuickLook/Seer\x20路径。'), false;
    }
    if (!(await OS.File.exists(quickLookPath))) return window.alert("您设定的 QuickLook/Seer 应用不存在！"), false;
    if (item && !item.isNote()) {
      if (item.isRegularItem()) {
        let attachmentIDs = item.getAttachments();
        for (let attID of attachmentIDs) {
          let attachment = Zotero.Items.get(attID);
          var filePath = await attachment.getFilePathAsync();
          if (attachment.attachmentContentType == "application/pdf") {
            if (filePath && quickLookPath) return Zotero.AI4Paper.goPublication() && Zotero.launchFileWithApplication(filePath, quickLookPath), true;
          }
        }
      }
      if (item.isAttachment()) {
        var filePath = await item.getFilePathAsync();
        if (item.attachmentContentType == "application/pdf") {
          if (filePath && quickLookPath) {
            if (Zotero.AI4Paper.getFunMetaTitle()) {
              Zotero.launchFileWithApplication(filePath, quickLookPath);
            }
            return false;
          }
        }
      }
    }
  },
  'copyPDF': async function (item) {
    try {
      if (!Zotero.AI4Paper.getFunMetaTitle()) {
        return -0x1;
      }
      if (!item) {
        var item, filePath;
        let tabID = Zotero_Tabs._selectedID,
          reader = Zotero.Reader.getByTabID(tabID);
        if (reader) {
          let itemID = reader.itemID;
          item = Zotero.Items.get(itemID);
          item.isAttachment() && (filePath = await item.getFilePathAsync());
        } else {
          let selectedItems = ZoteroPane.getSelectedItems();
          if (selectedItems?.["length"] === 0x0) return;
          item = selectedItems[0x0];
          if (item && !item.isNote()) {
            if (item.isRegularItem()) {
              let attachmentIDs = item.getAttachments();
              for (let attID of attachmentIDs) {
                item = Zotero.Items.get(attID);
                if (item.attachmentContentType == "application/pdf") {
                  filePath = await item.getFilePathAsync();
                  break;
                } else {
                  filePath = await item.getFilePathAsync();
                  continue;
                }
              }
            }
            item.isAttachment() && (filePath = await item.getFilePathAsync());
          }
        }
      } else {
        var filePath = await item.getFilePathAsync();
      }
      if (!filePath) {
        Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 拷贝 PDF【AI4paper】", "❌ 未发现可供拷贝的附件...");
        return;
      }
      let transferable = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable),
        clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
      const nsIFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
      nsIFile.initWithPath(filePath);
      transferable.addDataFlavor("application/x-moz-file");
      transferable.setTransferData("application/x-moz-file", nsIFile);
      try {
        clipboard.setData(transferable, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
      } catch (e) {
        if (filePath && Zotero.isMac) {
          Zotero.Utilities.Internal.exec('/usr/bin/osascript', ['-e', 'set\x20the\x20clipboard\x20to\x20POSIX\x20file\x20\x22' + filePath + '\x22']);
        } else {
          Zotero.debug(e);
          return;
        }
        Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 拷贝 PDF 失败【AI4paper】", "❌ 出错了...");
        return;
      }
      Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 拷贝 PDF【AI4paper】", "成功拷贝【" + item.getField("title") + '】，您可将其粘贴至其他地方...如微信、各大\x20AI\x20网页端。');
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'openwith_buildPopup': function (anchorElement) {
    let suffixMap = {
        0x1: '',
        0x2: "2nd",
        0x3: "3rd",
        0x4: "4th",
        0x5: "5th",
        0x6: "6th"
      },
      popup = window.document.createXULElement('menupopup');
    popup.id = "zoteroone-openwith-menupopup";
    popup.addEventListener('popuphidden', () => {
      window.document.querySelector("#browser").querySelectorAll("#zoteroone-openwith-menupopup").forEach(el => el.remove());
    });
    let child = popup.firstElementChild;
    while (child) {
      child.remove();
      child = popup.firstElementChild;
    }
    ["Open With ❶", "Open With ❷", "Open With ❸", "Open With ❹", "Open With ❺", "Open With ❻"].forEach((defaultLabel, index) => {
      let appPath = Zotero.Prefs.get("ai4paper.pdfapppath" + suffixMap[index + 0x1]);
      appPath = ('' + appPath).trim();
      if (appPath) {
        let customLabel = Zotero.Prefs.get("ai4paper.label4openwith" + suffixMap[index + 0x1]).trim(),
          label = customLabel ? 'Open\x20With\x20\x22' + customLabel + '\x22' : defaultLabel,
          menuitem = window.document.createXULElement('menuitem');
        menuitem.setAttribute("label", label);
        menuitem.addEventListener('command', evt => {
          Zotero.AI4Paper.openwith(index + 0x1);
        });
        popup.appendChild(menuitem);
      }
    });
    window.document.querySelector("#browser").querySelectorAll('#zoteroone-openwith-menupopup').forEach(el => el.remove());
    window.document.querySelector("#browser")?.['appendChild'](popup);
    popup.openPopup(anchorElement, "after_start", 0x0, 0x0, false, false);
  },
  'openwith': async function (appIndex = 0x1) {
    try {
      if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
      let suffixMap = {
          0x1: '',
          0x2: '2nd',
          0x3: "3rd",
          0x4: "4th",
          0x5: "5th",
          0x6: "6th"
        },
        labelMap = {
          0x1: '❶',
          0x2: '❷',
          0x3: '❸',
          0x4: '❹',
          0x5: '❺',
          0x6: '❻'
        };
      var appPath = Zotero.Prefs.get("ai4paper.pdfapppath" + suffixMap[appIndex]);
      if (!appPath) return window.alert("请先前往【Zotero 设置 --> AI4paper --> 拓展 --> Open With " + labelMap[appIndex] + "】设定 PDF 应用。"), false;
      if (!(await OS.File.exists(appPath))) return window.alert('您设定的\x20PDF\x20应用不存在！'), false;
      let tabID = Zotero_Tabs._selectedID;
      var reader = Zotero.Reader.getByTabID(tabID);
      if (reader) {
        let itemID = reader.itemID,
          item = Zotero.Items.get(itemID);
        if (item.isAttachment()) {
          var filePath = await item.getFilePathAsync();
          if (item.attachmentContentType == 'application/pdf') {
            if (filePath && appPath) return Zotero.AI4Paper.runAuthor() && Zotero.launchFileWithApplication(filePath, appPath), false;
          }
        }
      } else {
        let selectedItems = ZoteroPane.getSelectedItems();
        for (let item of selectedItems) {
          if (item && !item.isNote()) {
            if (item.isRegularItem()) {
              let attachmentIDs = item.getAttachments();
              for (let attID of attachmentIDs) {
                let attachment = Zotero.Items.get(attID);
                var filePath = await attachment.getFilePathAsync();
                attachment.attachmentContentType == "application/pdf" && filePath && appPath && Zotero.AI4Paper.runAuthor() && Zotero.launchFileWithApplication(filePath, appPath);
              }
            }
            if (item.isAttachment()) {
              var filePath = await item.getFilePathAsync();
              if (item.attachmentContentType == "application/pdf") {
                if (filePath && appPath) {
                  if (Zotero.AI4Paper.runAuthor()) {
                    Zotero.launchFileWithApplication(filePath, appPath);
                  }
                }
              }
            }
            Zotero.AI4Paper.filesHistory(item);
          }
        }
      }
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'getItemsTitleANDKey': function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        let key = item.key,
          title = item.getField('title');
        return [{
          'item_Title': title,
          'item_Key': key
        }];
      } else return Services.prompt.alert(window, "❌ 温馨提示：", "您选的 PDF 无父条目，请创建父条目或重新选择！"), false;
    } else var regularItems = ZoteroPane.getSelectedItems().filter(item => item.isRegularItem());
    if (regularItems.length === 0x0) return Services.prompt.alert(window, "❌ 温馨提示：", "请至少选择一个常规条目！"), false;
    let result = [];
    for (let item of regularItems) {
      let key = item.key,
        title = item.getField("title"),
        entry = {
          'item_Title': title,
          'item_Key': key
        };
      result.push(entry);
    }
    return result;
  },

  // === Block E: Delete/Export Operations ===
  'StoreAnnotations2PDF': async function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      await Zotero.PDFWorker['export'](itemID, null, true, '', true);
      Zotero_Tabs.select("zotero-pane");
      Zotero_Tabs.select(tabID);
    } else window.alert("请在内置阅读器中打开文献后，再执行本菜单！");
  },
  'deleteAllAttachments': async function () {
    let confirmed = Services.prompt.confirm(window, "删除选定条目的所有附件", '是否确认删除选定文献的附件及其本地文件？如果误删，可以从\x20Zotero\x20回收站找回。');
    if (!confirmed) return false;
    let tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        var items = [];
        items.push(item);
      }
    } else var items = ZoteroPane.getSelectedItems();
    for (let el of items) {
      if (el && !el.isNote()) {
        if (el.isRegularItem()) {
          let attachmentIDs = el.getAttachments();
          for (let attID of attachmentIDs) {
            let attachment = Zotero.Items.get(attID);
            attachment.deleted = true;
            await attachment.saveTx();
            var filePath = await attachment.getFilePathAsync();
            filePath && (await OS.File.remove(filePath));
          }
        }
      }
    }
  },
  'deleteSnapShots': async function () {
    let confirmed = Services.prompt.confirm(window, "删除选定条目的网页快照", "是否确认删除选定文献的网页快照？如果误删，可以从 Zotero 回收站找回。");
    if (!confirmed) {
      return false;
    }
    let tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        var items = [];
        items.push(item);
      }
    } else var items = ZoteroPane.getSelectedItems();
    for (let el of items) {
      if (el && !el.isNote()) {
        if (el.isRegularItem()) {
          let attachmentIDs = el.getAttachments();
          for (let attID of attachmentIDs) {
            let attachment = Zotero.Items.get(attID);
            if (attachment.attachmentContentType == 'text/html') {
              attachment.deleted = true;
              await attachment.saveTx();
              var filePath = await attachment.getFilePathAsync();
              filePath && (await OS.File.remove(filePath));
            }
          }
        }
      }
    }
  },
  'exportFile': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        var items = [];
        items.push(item);
      }
    } else var items = ZoteroPane.getSelectedItems();
    let srcPath,
      fileName,
      destPath,
      exportCount = 0x0,
      exportDir = await Zotero.AI4Paper.chooseExportLocation();
    if (exportDir) {
      for (let el of items) {
        if (el && !el.isNote()) {
          if (el.isRegularItem()) {
            let attachmentIDs = el.getAttachments();
            for (let attID of attachmentIDs) {
              let attachment = Zotero.Items.get(attID);
              srcPath = await attachment.getFilePathAsync();
              srcPath && (fileName = attachment.attachmentFilename, destPath = OS.Path.join(exportDir, fileName), OS.File.exists(destPath) && (await Zotero.AI4Paper.copyWithNoOverwrite(srcPath, exportDir), exportCount++));
            }
          }
          el.isAttachment() && (srcPath = await el.getFilePathAsync(), srcPath && (fileName = el.attachmentFilename, destPath = OS.Path.join(exportDir, fileName), OS.File.exists(destPath) && (await Zotero.AI4Paper.copyWithNoOverwrite(srcPath, exportDir), exportCount++)));
        }
      }
      exportCount ? Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 导出成功", '您成功将选定文献的【' + exportCount + "】个附件导出至【" + exportDir + '】。') : Zotero.AI4Paper.showProgressWindow(0x5dc, "温馨提示", "未发现符合条件的附件！");
    }
  },
  'copyWithNoOverwrite': async function (srcPath, destDir) {
    const Path = OS.Path,
      baseName = Path.basename(srcPath),
      ext = baseName.substr(baseName.lastIndexOf('.') + 0x1),
      nameWithoutExt = baseName.slice(0x0, baseName.length - ext.length - 0x1);
    let destPath = Path.join(destDir, baseName),
      counter = 0x1;
    while (await OS.File.exists(destPath)) {
      const numberedName = nameWithoutExt + '\x20(' + counter + ').' + ext;
      destPath = Path.join(destDir, numberedName);
      counter++;
    }
    return await OS.File.copy(srcPath, destPath), destPath;
  },
  'exportPDFFile': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        var items = [];
        items.push(item);
      }
    } else var items = ZoteroPane.getSelectedItems();
    let srcPath,
      fileName,
      destPath,
      exportCount = 0x0,
      exportDir = await Zotero.AI4Paper.chooseExportLocation();
    if (exportDir) {
      for (let el of items) {
        if (el && !el.isNote()) {
          if (el.isRegularItem()) {
            let attachmentIDs = el.getAttachments();
            for (let attID of attachmentIDs) {
              let attachment = Zotero.Items.get(attID);
              srcPath = await attachment.getFilePathAsync();
              attachment.attachmentContentType == "application/pdf" && srcPath && (fileName = attachment.attachmentFilename, destPath = OS.Path.join(exportDir, fileName), OS.File.exists(destPath) && (await Zotero.AI4Paper.copyWithNoOverwrite(srcPath, exportDir), exportCount++));
            }
          }
          if (el.isAttachment()) {
            srcPath = await el.getFilePathAsync();
            if (el.attachmentContentType == 'application/pdf') {
              srcPath && (fileName = el.attachmentFilename, destPath = OS.Path.join(exportDir, fileName), OS.File.exists(destPath) && (await Zotero.AI4Paper.copyWithNoOverwrite(srcPath, exportDir), exportCount++));
            }
          }
        }
      }
      exportCount ? Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20导出成功', '您成功将选定文献的【' + exportCount + "】个 PDF 附件导出至【" + exportDir + '】。') : Zotero.AI4Paper.showProgressWindow(0x5dc, "温馨提示", '未发现任何\x20PDF\x20附件！');
    }
  },
  'chooseExportLocation': async function () {
    var {
        FilePicker
      } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs"),
      picker = new FilePicker();
    picker.init(window, "选择目标文件夹", picker.modeGetFolder);
    picker.appendFilters(picker.filterAll);
    if ((await picker.show()) != picker.returnOK) {
      return false;
    }
    var selectedPath = PathUtils.normalize(picker.file);
    return selectedPath;
  },

  // === Block F: Copy Links + Related Items ===
  'copySelectedItemsLink': function (asMarkdown) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        var items = [];
        items.push(item);
      }
    } else var items = ZoteroPane.getSelectedItems();
    if (!items.length) {
      return false;
    }
    var links = [],
      libraryType,
      libPath;
    for (var i = 0x0; i < items.length; i++) {
      libraryType = Zotero.Libraries.get(items[i].libraryID).libraryType;
      switch (libraryType) {
        case "group":
          libPath = Zotero.URI.getLibraryPath(items[i].libraryID);
          break;
        case 'user':
          libPath = "library";
          break;
        default:
          continue;
      }
      let link = "zotero://select/" + libPath + '/items/' + items[i].key;
      asMarkdown && (link = '[' + items[i].getField("title") + '](' + link + ')');
      links.push(link);
    }
    Zotero.AI4Paper.copy2Clipboard(links.join('\x0d\x0a'));
    Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝条目链接", "所选条目链接已拷贝至剪切板！");
  },
  'copyPDFAttachmentsLink': function (asMarkdown) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        var items = [];
        items.push(item);
      }
    } else var items = ZoteroPane.getSelectedItems();
    if (!items.length) return false;
    items = items.filter(item => item.isRegularItem());
    if (!items.length) {
      window.alert("未选择任何常规条目！");
    }
    var output = '';
    for (let el of items) {
      let result = Zotero.AI4Paper.getZoteroAttachments(el, asMarkdown);
      result != '' && (output = output + result + '\x0d\x0a' + '\x0d\x0a');
    }
    Zotero.AI4Paper.copy2Clipboard(output);
    Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20拷贝\x20PDF\x20附件链接', "所选条目的 PDF 附件链接已拷贝至剪切板！");
  },
  'getZoteroAttachments': function (item, asMarkdown) {
    let attachmentIDs = item.getAttachments();
    var output = '';
    for (let attID of attachmentIDs) {
      let attachment = Zotero.Items.get(attID);
      if (attachment.attachmentContentType == "application/pdf") {
        let pdfLink = Zotero.AI4Paper.getItemPDFLink(attachment);
        asMarkdown && (pdfLink = '[' + attachment.getField("title") + '](' + pdfLink + ')');
        output = output + pdfLink + '\x0a';
      }
    }
    return output;
  },
  'copyItemCitationPDFLink': function (asMarkdown) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    let tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        var items = [];
        items.push(item);
      }
    } else var items = ZoteroPane.getSelectedItems();
    if (!items.length) return false;
    items = items.filter(item => item.isRegularItem());
    !items.length && window.alert("未选择任何常规条目！");
    var output = '';
    if (items.length == 0x1) {
      var quickCopy = Zotero.QuickCopy,
        quickCopySetting = Zotero.Prefs.get("export.quickCopy.setting");
      quickCopySetting.split('=')[0x0] !== 'bibliography' && alert("No bibliography style is choosen in the settings for QuickCopy.");
      var content = quickCopy.getContentFromItems(items, quickCopySetting),
        htmlContent = content.html,
        textContent = content.text,
        bulletLinks = Zotero.AI4Paper.getZoteroAttachmentsBullets(items[0x0], asMarkdown);
      output = textContent + '\x0d\x0a' + "PDF Attachments:" + '\x0d\x0a' + bulletLinks;
      Zotero.AI4Paper.copy2Clipboard(output);
      Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20拷贝引文及\x20PDF\x20附件链接', "所选条目的引文及其 PDF 附件链接已拷贝至剪切板！");
    } else window.alert('请仅选择一个常规条目！');
  },
  'getZoteroAttachmentsBullets': function (item, asMarkdown) {
    let attachmentIDs = item.getAttachments();
    var output = '';
    for (let attID of attachmentIDs) {
      let attachment = Zotero.Items.get(attID);
      if (attachment.attachmentContentType == 'application/pdf') {
        let pdfLink = Zotero.AI4Paper.getItemPDFLink(attachment);
        asMarkdown && (pdfLink = '[' + attachment.getField("title") + '](' + pdfLink + ')');
        output = output + '-\x20' + pdfLink + '\x0a';
      }
    }
    return output;
  },
  'updateAllRelatedItemsNum': async function () {
    Zotero.AI4Paper.showProgressWindow(0xbb8, "正在更新关联文献数量", "更新关联文献数量需要一定时间...结果将通过弹窗反馈给您！");
    var journalCount = 0x0,
      thesisCount = 0x0,
      confCount = 0x0,
      journalSearch = new Zotero.Search();
    journalSearch.libraryID = Zotero.Libraries.userLibraryID;
    journalSearch.addCondition("itemType", 'is', "journalArticle");
    var journalIDs = await journalSearch.search(),
      journalItems = await Zotero.Items.getAsync(journalIDs);
    for (let item of journalItems) {
      let relatedKeys = item.relatedItems,
        relatedCount = relatedKeys.length;
      if (relatedCount > 0x0) {
        if (item.getField("archiveLocation").indexOf('🔗') != -0x1) {
          let archiveVal = item.getField("archiveLocation"),
            linkIdx = item.getField("archiveLocation").indexOf('🔗');
          archiveVal = archiveVal.substring(0x0, linkIdx);
          item.setField("archiveLocation", archiveVal + '🔗' + String(relatedCount));
          await item.saveTx();
          journalCount++;
        } else {
          item.setField('archiveLocation', item.getField("archiveLocation") + '🔗' + String(relatedCount));
          await item.saveTx();
          journalCount++;
        }
      }
    }
    var thesisSearch = new Zotero.Search();
    thesisSearch.libraryID = Zotero.Libraries.userLibraryID;
    thesisSearch.addCondition("itemType", 'is', "thesis");
    var thesisIDs = await thesisSearch.search(),
      thesisItems = await Zotero.Items.getAsync(thesisIDs);
    for (let item of thesisItems) {
      let relatedKeys = item.relatedItems,
        relatedCount = relatedKeys.length;
      if (relatedCount > 0x0) {
        if (item.getField("archiveLocation").indexOf('🔗') != -0x1) {
          let archiveVal = item.getField('archiveLocation'),
            linkIdx = item.getField("archiveLocation").indexOf('🔗');
          archiveVal = archiveVal.substring(0x0, linkIdx);
          item.setField("archiveLocation", archiveVal + '🔗' + String(relatedCount));
          await item.saveTx();
          thesisCount++;
        } else {
          item.setField('archiveLocation', item.getField('archiveLocation') + '🔗' + String(relatedCount));
          await item.saveTx();
          thesisCount++;
        }
      }
    }
    var confSearch = new Zotero.Search();
    confSearch.libraryID = Zotero.Libraries.userLibraryID;
    confSearch.addCondition('itemType', 'is', "conferencePaper");
    var confIDs = await confSearch.search(),
      confItems = await Zotero.Items.getAsync(confIDs);
    for (let item of confItems) {
      let relatedKeys = item.relatedItems,
        relatedCount = relatedKeys.length;
      if (relatedCount > 0x0) {
        if (item.getField("archiveLocation").indexOf('🔗') != -0x1) {
          let archiveVal = item.getField('archiveLocation'),
            linkIdx = item.getField("archiveLocation").indexOf('🔗');
          archiveVal = archiveVal.substring(0x0, linkIdx);
          item.setField("archiveLocation", archiveVal + '🔗' + String(relatedCount));
          await item.saveTx();
          confCount++;
        } else {
          item.setField("archiveLocation", item.getField("archiveLocation") + '🔗' + String(relatedCount));
          await item.saveTx();
          confCount++;
        }
      }
    }
    Zotero.AI4Paper.showProgressWindow(0x1770, '✅\x20【全库更新关联文献数量】完毕', '共有【' + journalCount + "】篇期刊论文、【" + confCount + "】篇会议论文、以及【" + thesisCount + "】篇学位论文包含关联文献！");
  },
  'selectAllRelatedItmes': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID));
    } else var item = ZoteroPane.getSelectedItems()[0x0];
    let relatedIDs = Zotero.AI4Paper.getRelatedItemsIDsArray(item);
    if (!relatedIDs.length) return window.alert("当前条目无关联文献！"), false;
    Zotero_Tabs.select("zotero-pane");
    await ZoteroPane_Local.selectItems(relatedIDs);
    Zotero.AI4Paper.showProgressWindow(0xbb8, "全选关联文献", '为您全选了所有【' + relatedIDs.length + '】篇关联文献！');
  },
  'removeRelatedItems': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID));
    } else var item = ZoteroPane.getSelectedItems()[0x0];
    if (!item.isRegularItem()) return window.alert('请选择一个常规条目！'), false;
    let relatedItems = Zotero.AI4Paper.getRelatedItemsArray(item),
      titleList = [];
    if (relatedItems.length === 0x0) {
      return window.alert("当前条目无关联文献！"), -0x1;
    }
    for (let relItem of relatedItems) {
      try {
        let title = relItem.getField("title");
        titleList.push(title + " 🆔 " + relItem.itemID);
      } catch (e) {}
    }
    titleList.sort();
    Zotero.AI4Paper._action_removeRelatedItems = true;
    let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectRelatedItems", titleList);
    if (!dialogResult) return null;
    let selectedItems = [];
    Object.keys(dialogResult).forEach(async function (key) {
      let value = dialogResult[key];
      if (value.indexOf('🆔') != -0x1) {
        let idIdx = value.indexOf('🆔'),
          itemID = value.substring(idIdx + 0x3);
        selectedItems.push(Zotero.Items.get(itemID));
      }
    });
    for (let relItem of selectedItems) {
      item.removeRelatedItem(relItem);
      await item.saveTx();
      if (relItem.isRegularItem()) {
        relItem.removeRelatedItem(item);
      }
      await relItem.saveTx();
    }
    await new Promise(resolve => setTimeout(resolve, 0x2710));
    for (let relItem of selectedItems) {
      item.removeRelatedItem(relItem);
      await item.saveTx();
    }
    let allAffected = relatedItems;
    allAffected.push(item);
    for (let affectedItem of allAffected) {
      await Zotero.AI4Paper.updateRelatedItemsNum(affectedItem);
    }
  },
  'showSelectedRelatedItems': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID));
    } else var item = ZoteroPane.getSelectedItems()[0x0];
    if (!item.isRegularItem()) return window.alert('请选择一个常规条目！'), false;
    let relatedItems = Zotero.AI4Paper.getRelatedItemsArray(item),
      titleList = [];
    if (relatedItems.length === 0x0) return window.alert("当前条目无关联文献！"), -0x1;
    for (let relItem of relatedItems) {
      try {
        let title = relItem.getField("title");
        titleList.push(title + " 🆔 " + relItem.itemID);
      } catch (e) {}
    }
    titleList.sort();
    Zotero.AI4Paper._action_removeRelatedItems = false;
    let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectRelatedItems", titleList);
    if (!dialogResult) {
      return null;
    }
    let selectedIDs = [];
    Object.keys(dialogResult).forEach(async function (key) {
      let value = dialogResult[key];
      if (value.indexOf('🆔') != -0x1) {
        let idIdx = value.indexOf('🆔'),
          itemID = value.substring(idIdx + 0x3);
        selectedIDs.push(itemID);
      }
    });
    Zotero_Tabs.select("zotero-pane");
    await ZoteroPane_Local.selectItems(selectedIDs);
  },
  'getRelatedItemsArray': function (item) {
    var relations = item.getRelations()["dc:relation"],
      result = [];
    if (relations) {
      for (let uri of relations) {
        try {
          let itemID = Zotero.URI.getURIItemID(uri),
            relItem = Zotero.Items.get(itemID);
          result.push(relItem);
        } catch (e) {}
      }
    }
    return result;
  },
  'getRelatedItemsIDsArray': function (item) {
    var relations = item.getRelations()["dc:relation"],
      result = [];
    if (relations) for (let uri of relations) {
      try {
        let itemID = Zotero.URI.getURIItemID(uri),
          relItem = Zotero.Items.get(itemID),
          title = relItem.getField("title");
        result.push(itemID);
      } catch (e) {}
    }
    return result;
  },

  // === Block G: Star + Archive ===
  'starSelectedItems': async function (starLevel) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) {
      return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    }
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return false;
    }
    Zotero.debug("AI4Paper: Star Selected items");
    let fieldName = 'rights',
      starStyle = Zotero.Prefs.get("ai4paper.starstyle");
    if (starStyle === '数字') var starValue = starLevel + '⭐';else {
      var starValue = Zotero.Prefs.get("ai4paper.starstyle").repeat(starLevel);
    }
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID,
        item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        if (Zotero.AI4Paper.checkItemField(item, fieldName)) {
          item.setField(fieldName, starLevel ? starValue : '');
          await item.saveTx();
          if (starLevel) this.showProgressWindow(0x1388, "⭐ 星标文献【AI4paper】", "您成功给予当前文献【" + starValue + '】评价！', 'zoteorif');else {
            this.showProgressWindow(0x1388, "⭐ 取消文献星标【AI4paper】", "您成功取消当前文献的星标！", 'zoteorif');
          }
        }
      }
    } else {
      let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
      this._Num_AllSel = selectedItems.length;
      let regularItems = selectedItems.filter(item => item.isRegularItem());
      this._Num_Done = 0x0;
      for (let item of regularItems) {
        Zotero.AI4Paper.checkItemField(item, fieldName) && (item.setField(fieldName, starLevel ? starValue : ''), await item.saveTx(), this._Num_Done++);
      }
      starLevel ? this.showProgressWindow(0x1388, "⭐ 星标文献【AI4paper】", "您成功给予【" + this._Num_Done + " of " + this._Num_AllSel + "】篇文献【" + starValue + '】评价！', "zoteorif") : this.showProgressWindow(0x1388, "⭐ 取消文献星标【AI4paper】", '您成功取消【' + this._Num_Done + " of " + this._Num_AllSel + "】篇文献的星标！", "zoteorif");
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
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID,
        item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID), await Zotero.AI4Paper.archiveItem(item), this.showProgressWindow(0x1388, "✅ 归档文献 【AI4paper】", "恭喜，您已完成阅读（即归档）该文献！", 'zoteorif'));
    } else {
      let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems(),
        regularItems = selectedItems.filter(item => item.isRegularItem());
      for (let item of regularItems) {
        await Zotero.AI4Paper.archiveItem(item);
      }
      this.showProgressWindow(0x1388, "✅ 归档文献 【AI4paper】", "成功归档【" + regularItems.length + "】篇文献！", "zoteorif");
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
