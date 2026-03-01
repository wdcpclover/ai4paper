// AI4Paper Utils Module - HTTP, clipboard, dialog, date/time, crypto, and general utilities
Object.assign(Zotero.AI4Paper, {
  'getFromClipboard': function () {
    return Zotero.Utilities.Internal.getClipboard('text/plain');
  },
  'copy2Clipboard': function (text) {
    const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
    clipboardHelper.copyString(text);
  },
  'getZoteroDate': function (dateStr) {
    if (Zotero.Date.strToDate(dateStr).order === 'yd') {
      let year = Zotero.Date.strToDate(dateStr).year,
        day = Zotero.Date.strToDate(dateStr).day,
        part = Zotero.Date.strToDate(dateStr).part;
      day != undefined && (day = day < 0xa ? '0' + day : day);
      if (part != undefined) {
        part = part < 0xa ? '0' + part : part;
      }
      return dateStr = '' + (year != undefined ? year + '-' : '') + (day != undefined ? day : '') + (part != undefined ? '-' + part : ''), year != undefined && day === undefined && part === undefined && (dateStr = year), dateStr;
    } else {
      if (Zotero.Date.strToDate(dateStr).order === 'y') return Zotero.Date.strToDate(dateStr).year;else {
        let year = Zotero.Date.strToDate(dateStr).year,
          month = Zotero.Date.strToDate(dateStr).month + 0x1,
          day = Zotero.Date.strToDate(dateStr).day;
        month != undefined && (month = month < 0xa ? '0' + month : month);
        if (day != undefined) {
          day = day < 0xa ? '0' + day : day;
        }
        return dateStr = '' + (year != undefined ? year + '-' : '') + (month != undefined ? month : '') + (day != undefined ? '-' + day : ''), year != undefined && month === undefined && day === undefined && (dateStr = year), dateStr;
      }
    }
  },
  'getYear': function () {
    let now = new Date();
    return now.getFullYear();
  },
  'getDate': function () {
    const now = new Date(),
      year = now.getFullYear(),
      month = String(now.getMonth() + 0x1).padStart(0x2, '0'),
      day = String(now.getDate()).padStart(0x2, '0'),
      dateStr = year + '-' + month + '-' + day;
    return dateStr;
  },
  'getTime': function () {
    let now = new Date();
    return now.toLocaleTimeString("chinese", {
      'hour12': false
    });
  },
  'getWeek': function () {
    let now = new Date(),
      weekdays = ['星期日', '星期一', "星期二", "星期三", "星期四", "星期五", "星期六"];
    return weekdays[now.getDay()];
  },
  'getYearMonth': function () {
    let now = new Date(),
      month = now.getMonth() + 0x1,
      year = now.getFullYear();
    month = month < 0xa ? '0' + month : month;
    let monthStr = '' + month,
      yearStr = '' + year;
    return yearStr + '-' + monthStr;
  },
  'getDateWeek': function () {
    let now = new Date(),
      day = now.getDate(),
      month = now.getMonth() + 0x1,
      year = now.getFullYear();
    day = day < 0xa ? '0' + day : day;
    month = month < 0xa ? '0' + month : month;
    let dayStr = '' + day,
      monthStr = '' + month,
      yearStr = '' + year,
      weekdays = ["星期日", "星期一", "星期二", '星期三', "星期四", "星期五", "星期六"];
    return yearStr + '-' + monthStr + '-' + dayStr + '\x20' + weekdays[now.getDay()];
  },
  'getDateTime': function () {
    let now = new Date(),
      day = now.getDate(),
      month = now.getMonth() + 0x1,
      year = now.getFullYear();
    day = day < 0xa ? '0' + day : day;
    month = month < 0xa ? '0' + month : month;
    let dayStr = '' + day,
      monthStr = '' + month,
      yearStr = '' + year;
    return yearStr + '-' + monthStr + '-' + dayStr + '\x20' + now.toLocaleTimeString("chinese", {
      'hour12': false
    });
  },
  'getDateWeekTime': function () {
    let now = new Date(),
      day = now.getDate(),
      month = now.getMonth() + 0x1,
      year = now.getFullYear();
    day = day < 0xa ? '0' + day : day;
    month = month < 0xa ? '0' + month : month;
    let dayStr = '' + day,
      monthStr = '' + month,
      yearStr = '' + year,
      weekdays = ["星期日", "星期一", "星期二", "星期三", '星期四', "星期五", "星期六"];
    return yearStr + '-' + monthStr + '-' + dayStr + '\x20' + now.toLocaleTimeString("chinese", {
      'hour12': false
    }) + '\x20' + weekdays[now.getDay()];
  },
  'generateRandomString': function (length) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0x0; i < length; i++) {
      const index = Math.floor(Math.random() * chars.length);
      result += chars.charAt(index);
    }
    return result;
  },
  'isChineseText': function (text) {
    const hasChinese = /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(text),
      hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/.test(text);
    return hasChinese && !hasJapanese;
  },
  'getTK': function (text) {
    var _unused = '',
      tkSeed = 0x63474,
      tkXorKey = 0xc449a670,
      dot = '.',
      magic1 = "+-a^+6",
      magic2 = "+-3^+b+-f";
    for (var bytes = [], byteIdx = 0x0, i = 0x0; i < text.length; i++) {
      var charCode = text.charCodeAt(i);
      0x80 > charCode ? bytes[byteIdx++] = charCode : (0x800 > charCode ? bytes[byteIdx++] = charCode >> 0x6 | 0xc0 : ((charCode & 0xfc00) == 0xd800 && i + 0x1 < text.length && (text.charCodeAt(i + 0x1) & 0xfc00) == 0xdc00 ? (charCode = 0x10000 + ((charCode & 0x3ff) << 0xa) + (text.charCodeAt(++i) & 0x3ff), bytes[byteIdx++] = charCode >> 0x12 | 0xf0, bytes[byteIdx++] = charCode >> 0xc & 0x3f | 0x80) : bytes[byteIdx++] = charCode >> 0xc | 0xe0, bytes[byteIdx++] = charCode >> 0x6 & 0x3f | 0x80), bytes[byteIdx++] = charCode & 0x3f | 0x80);
    }
    text = tkSeed;
    for (byteIdx = 0x0; byteIdx < bytes.length; byteIdx++) {
      text += bytes[byteIdx];
      text = Zotero.AI4Paper.getRL(text, magic1);
    }
    return text = Zotero.AI4Paper.getRL(text, magic2), text ^= tkXorKey || 0x0, 0x0 > text && (text = (text & 0x7fffffff) + 0x80000000), text %= 0xf4240, text.toString() + dot + (text ^ tkSeed);
  },
  'getRL': function (value, ops) {
    var charA = 'a',
      charPlus = '+';
    for (var i = 0x0; i < ops.length - 0x2; i += 0x3) {
      var operand = ops.charAt(i + 0x2),
        operand = operand >= charA ? operand.charCodeAt(0x0) - 0x57 : Number(operand),
        operand = ops.charAt(i + 0x1) == charPlus ? value >>> operand : value << operand;
      value = ops.charAt(i) == charPlus ? value + operand & 0xffffffff : value ^ operand;
    }
    return value;
  },
  'randomString': function (length) {
    const byteLength = Math.ceil(length / 0x4) * 0x3,
      randomBytes = crypto.getRandomValues(new Uint8Array(byteLength));
    return Zotero.AI4Paper.base64(randomBytes).substring(0x0, length);
  },
  'base64': function (buffer) {
    const binaryStr = String.fromCharCode(...new Uint8Array(buffer));
    return Zotero.getMainWindow().btoa(binaryStr);
  },
  'hmacSha1Digest': async function (message, secret) {
    const encoder = new TextEncoder(),
      cryptoKey = await crypto.subtle.importKey("raw", encoder.encode(secret), {
        'name': "HMAC",
        'hash': "SHA-1"
      }, false, ["sign"]);
    return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  },
  'encodeRFC3986URIComponent': function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, ch => '%' + ch.charCodeAt(0x0).toString(0x10).toUpperCase());
  },
  'encodeRFC5987ValueChars': function (str) {
    return encodeURIComponent(str).replace(/['()*]/g, ch => '%' + ch.charCodeAt(0x0).toString(0x10).toUpperCase()).replace(/%20/g, '+');
  },
  'checkPunctuation': function (text) {
    let punctuationRegex = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>\u300a\u300b/?~\uff01@#\uffe5\u2026\u2026&*\uff08\uff09\u2014\u2014|{}\u3010\u3011\u2018\uff1b\uff1a\u201d\u201c'\u3002\uff0c\u3001\uff1f+/]|[\\\\/]");
    if (punctuationRegex.test(text)) {
      return true;
    } else return false;
  },
  'httpRequestInit': async function (initFn, mainFn, errorMode, extraArgs = []) {
    let initResult = await Zotero.AI4Paper.httpRequest(initFn, null, errorMode, extraArgs);
    if (initResult.readyState == 0x4 && initResult.status === 0xc8) {
      let mainResult = await Zotero.AI4Paper.httpRequest(mainFn, initResult, errorMode, extraArgs);
      if (mainResult) {
        return mainResult;
      }
    }
    return false;
  },
  'httpRequest': async function (requestFn, initData = null, errorMode = "default", extraArgs = []) {
    try {
      return await requestFn(initData);
    } catch (error) {
      if (errorMode === "noAlert") {
        return false;
      } else {
        if (errorMode === "alert") return window.alert(error), false;else {
          if (Object.keys(Zotero.AI4Paper.translationServiceList()).includes(errorMode)) return Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + errorMode + "】出错啦：" + Zotero.getString(error)), false;else {
            if (Object.keys(Zotero.AI4Paper.gptServiceList()).includes(errorMode)) {
              let errorCodeLink = Zotero.AI4Paper.gptServiceList()[errorMode].errorCode_link,
                errorMessage = "⚠️ [请求错误]\n\n❌【" + errorMode + '】出错啦：' + Zotero.getString(error) + "\n\n🔗【" + errorMode + " 错误码含义】请见：\n" + errorCodeLink,
                shortError = "👉 ❌【" + errorMode + "】出错啦：" + Zotero.getString(error);
              return Zotero.Prefs.get("ai4paper.gptContinuesChatMode") && !Zotero.Prefs.get('ai4paper.gptStreamResponse') ? (Zotero.AI4Paper.gptReaderSidePane_ChatMode_displayErrorMessage(errorMessage), Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveError2MessageHistory(errorMessage, extraArgs)) : Zotero.AI4Paper.gptReaderSidePane_resetChat(errorMessage), Zotero.AI4Paper.showProgressWindow(0x1388, '❌【' + errorMode + '】请求错误', shortError, 'openai'), false;
            }
          }
        }
      }
    }
  },
  'openDialogByType_modal': function (dialogType, dataIn) {
    let title = Zotero.AI4Paper.getFunMetaTitle();
    if (!title) return;
    !dataIn && (dataIn = '');
    var dialogArgs = {
        'dataIn': dataIn,
        'dataOut': null
      },
      dialog = window.openDialog("chrome://ai4paper/content/selectionDialog/" + dialogType + ".xhtml", '' + dialogType, 'chrome,modal,centerscreen,resizable=yes', dialogArgs);
    return dialogArgs.dataOut;
  },
  'openDialogByType': function (dialogType, noDialog) {
    let title = Zotero.AI4Paper.getFunMetaTitle();
    if (!title) return;
    let existingDialog = Zotero.AI4Paper.getOpenedDialog("zoteroone-windowType-" + dialogType);
    if (existingDialog) {
      return existingDialog.focus(), existingDialog;
    }
    let features = "chrome,extrachrome,centerscreen,resizable" + (noDialog ? ",dialog=no" : '');
    return existingDialog = window.openDialog('chrome://ai4paper/content/selectionDialog/' + dialogType + '.xhtml', '' + dialogType, features), existingDialog;
  },
  'getOpenedDialog': function (windowType) {
    var mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator),
      enumerator = mediator.getEnumerator(windowType);
    while (enumerator.hasMoreElements()) {
      var win = enumerator.getNext();
    }
    if (win) return win;
    return false;
  },
  'blurActiveElement': function (win) {
    try {
      setTimeout(() => {
        win.document.activeElement?.["blur"]();
      }, 0x0);
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'focusWithIMEFix': async function (element, delay = 0xa) {
    try {
      const wait = () => new Promise(resolve => setTimeout(resolve, delay));
      element.focus();
      await wait();
      element.blur();
      await wait();
      element.focus();
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'setFontSize_Dialog': function (docEl, fontSize) {
    if (!docEl) return;
    try {
      !fontSize && (fontSize = Zotero.Prefs.get("fontSize"));
      let fontSizeRem = fontSize + "rem";
      docEl.style.fontSize = fontSizeRem;
      docEl.style.setProperty('--zotero-font-size', fontSizeRem);
      if (fontSize <= 0x1) fontSize = 'medium';else {
        if (fontSize <= 1.15) fontSize = 'medium';else {
          if (fontSize <= 1.3) fontSize = 'large';else {
            fontSize = "medium";
          }
        }
      }
      docEl.setAttribute('zoteroFontSize', fontSize);
      if (Zotero.rtl) docEl.setAttribute("dir", "rtl");else {
        docEl.removeAttribute('dir');
      }
      let uiDensity = Zotero.Prefs.get("uiDensity");
      docEl.style.setProperty("--zotero-ui-density", uiDensity);
      docEl.setAttribute('zoteroUIDensity', uiDensity);
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'calculateTokens': function (text) {
    try {
      return Zotero.AI4Paper._calculateTokens(text).length;
    } catch (e) {
      return Zotero.debug(e), 0x0;
    }
  },
  'isPathExists': async function (path) {
    if (path.trim() && (await OS.File.exists(path))) return true;
    return false;
  },
  'revealPath': async function (path) {
    if (path.trim() && (await Zotero.AI4Paper.isPathExists(path))) {
      let file = Zotero.File.pathToFile(path);
      try {
        file.reveal();
      } catch (e) {
        Zotero.debug(e);
      }
    }
  },
  'isZoteroVersion': function (versions) {
    versions === undefined && (versions = [0x8, 0x9]);
    if (typeof versions == 'object') for (let version of versions) {
      if (Zotero.version.startsWith(version + '.')) return true;
    } else {
      if (Zotero.version.startsWith(versions + '.')) {
        return true;
      }
    }
    return false;
  },
  'showProgressWindow': function (timeout, headline, message, iconType = 'success') {
    let progressWin = new Zotero.ProgressWindow({
      'closeOnClick': true
    });
    progressWin.changeHeadline(headline);
    progressWin.addLines(message, Zotero.AI4Paper.progressWindowIcon[iconType]);
    progressWin.show();
    progressWin.startCloseTimer(timeout);
  },
  'showProgressWindowZot': function (timeout, headline, message, iconType = "success") {
    let progressWin = new Zotero.ProgressWindow({
      'closeOnClick': true
    });
    progressWin.changeHeadline(headline);
    progressWin.progress = new progressWin.ItemProgress(Zotero.AI4Paper.progressWindowIcon[iconType], message);
    progressWin.show();
    progressWin.startCloseTimer(timeout);
  },
  'showProgressWindowGPT': function (timeout, headline, message, iconType = 'success') {
    let progressWin = new Zotero.AI4Paper.ProgressWindow({
      'closeOnClick': true
    });
    progressWin.changeHeadline(headline);
    progressWin.addLines(message, Zotero.AI4Paper.progressWindowIcon[iconType]);
    progressWin.show();
    progressWin.startCloseTimer(timeout);
  },
  'createProgressWindow': function (headline, message, iconType = "success") {
    let progressWin = new Zotero.ProgressWindow({
      'closeOnClick': true
    });
    return progressWin.changeHeadline(headline), progressWin.addLines(message, Zotero.AI4Paper.progressWindowIcon[iconType]), progressWin.show(), progressWin;
  },
});
