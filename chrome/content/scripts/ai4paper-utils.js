// AI4Paper Utils Module - HTTP, clipboard, dialog, date/time, crypto, and general utilities
Object.assign(Zotero.AI4Paper, {
  'getFromClipboard': function () {
    return Zotero.Utilities.Internal.getClipboard('text/plain');
  },
  'copy2Clipboard': function (param90) {
    const var818 = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
    var818.copyString(param90);
  },
  'getZoteroDate': function (param189) {
    if (Zotero.Date.strToDate(param189).order === 'yd') {
      let _0x2fab10 = Zotero.Date.strToDate(param189).year,
        _0xedb043 = Zotero.Date.strToDate(param189).day,
        _0x1bb8fa = Zotero.Date.strToDate(param189).part;
      _0xedb043 != undefined && (_0xedb043 = _0xedb043 < 0xa ? '0' + _0xedb043 : _0xedb043);
      if (_0x1bb8fa != undefined) {
        _0x1bb8fa = _0x1bb8fa < 0xa ? '0' + _0x1bb8fa : _0x1bb8fa;
      }
      return param189 = '' + (_0x2fab10 != undefined ? _0x2fab10 + '-' : '') + (_0xedb043 != undefined ? _0xedb043 : '') + (_0x1bb8fa != undefined ? '-' + _0x1bb8fa : ''), _0x2fab10 != undefined && _0xedb043 === undefined && _0x1bb8fa === undefined && (param189 = _0x2fab10), param189;
    } else {
      if (Zotero.Date.strToDate(param189).order === 'y') return Zotero.Date.strToDate(param189).year;else {
        let var1625 = Zotero.Date.strToDate(param189).year,
          var1626 = Zotero.Date.strToDate(param189).month + 0x1,
          var1627 = Zotero.Date.strToDate(param189).day;
        var1626 != undefined && (var1626 = var1626 < 0xa ? '0' + var1626 : var1626);
        if (var1627 != undefined) {
          var1627 = var1627 < 0xa ? '0' + var1627 : var1627;
        }
        return param189 = '' + (var1625 != undefined ? var1625 + '-' : '') + (var1626 != undefined ? var1626 : '') + (var1627 != undefined ? '-' + var1627 : ''), var1625 != undefined && var1626 === undefined && var1627 === undefined && (param189 = var1625), param189;
      }
    }
  },
  'getYear': function () {
    let var1628 = new Date();
    return var1628.getFullYear();
  },
  'getDate': function () {
    const var1629 = new Date(),
      var1630 = var1629.getFullYear(),
      var1631 = String(var1629.getMonth() + 0x1).padStart(0x2, '0'),
      var1632 = String(var1629.getDate()).padStart(0x2, '0'),
      var1633 = var1630 + '-' + var1631 + '-' + var1632;
    return var1633;
  },
  'getTime': function () {
    let var1634 = new Date();
    return var1634.toLocaleTimeString("chinese", {
      'hour12': false
    });
  },
  'getWeek': function () {
    let var1635 = new Date(),
      var1636 = ['星期日', '星期一', "星期二", "星期三", "星期四", "星期五", "星期六"];
    return var1636[var1635.getDay()];
  },
  'getYearMonth': function () {
    let var1637 = new Date(),
      var1638 = var1637.getMonth() + 0x1,
      var1639 = var1637.getFullYear();
    var1638 = var1638 < 0xa ? '0' + var1638 : var1638;
    let var1640 = '' + var1638,
      var1641 = '' + var1639;
    return var1641 + '-' + var1640;
  },
  'getDateWeek': function () {
    let var1642 = new Date(),
      var1643 = var1642.getDate(),
      var1644 = var1642.getMonth() + 0x1,
      var1645 = var1642.getFullYear();
    var1643 = var1643 < 0xa ? '0' + var1643 : var1643;
    var1644 = var1644 < 0xa ? '0' + var1644 : var1644;
    let var1646 = '' + var1643,
      var1647 = '' + var1644,
      var1648 = '' + var1645,
      var1649 = ["星期日", "星期一", "星期二", '星期三', "星期四", "星期五", "星期六"];
    return var1648 + '-' + var1647 + '-' + var1646 + '\x20' + var1649[var1642.getDay()];
  },
  'getDateTime': function () {
    let var1650 = new Date(),
      var1651 = var1650.getDate(),
      var1652 = var1650.getMonth() + 0x1,
      var1653 = var1650.getFullYear();
    var1651 = var1651 < 0xa ? '0' + var1651 : var1651;
    var1652 = var1652 < 0xa ? '0' + var1652 : var1652;
    let var1654 = '' + var1651,
      var1655 = '' + var1652,
      var1656 = '' + var1653;
    return var1656 + '-' + var1655 + '-' + var1654 + '\x20' + var1650.toLocaleTimeString("chinese", {
      'hour12': false
    });
  },
  'getDateWeekTime': function () {
    let var1657 = new Date(),
      var1658 = var1657.getDate(),
      var1659 = var1657.getMonth() + 0x1,
      var1660 = var1657.getFullYear();
    var1658 = var1658 < 0xa ? '0' + var1658 : var1658;
    var1659 = var1659 < 0xa ? '0' + var1659 : var1659;
    let var1661 = '' + var1658,
      var1662 = '' + var1659,
      var1663 = '' + var1660,
      var1664 = ["星期日", "星期一", "星期二", "星期三", '星期四', "星期五", "星期六"];
    return var1663 + '-' + var1662 + '-' + var1661 + '\x20' + var1657.toLocaleTimeString("chinese", {
      'hour12': false
    }) + '\x20' + var1664[var1657.getDay()];
  },
  'generateRandomString': function (param210) {
    let var1863 = '';
    const var1864 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let var1865 = 0x0; var1865 < param210; var1865++) {
      const var1866 = Math.floor(Math.random() * var1864.length);
      var1863 += var1864.charAt(var1866);
    }
    return var1863;
  },
  'isChineseText': function (param322) {
    const var2538 = /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(param322),
      var2539 = /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/.test(param322);
    return var2538 && !var2539;
  },
  'getTK': function (param356) {
    var var2657 = '',
      var2658 = 0x63474,
      var2659 = 0xc449a670,
      var2660 = '.',
      var2661 = "+-a^+6",
      var2662 = "+-3^+b+-f";
    for (var var2663 = [], var2664 = 0x0, var2665 = 0x0; var2665 < param356.length; var2665++) {
      var var2666 = param356.charCodeAt(var2665);
      0x80 > var2666 ? var2663[var2664++] = var2666 : (0x800 > var2666 ? var2663[var2664++] = var2666 >> 0x6 | 0xc0 : ((var2666 & 0xfc00) == 0xd800 && var2665 + 0x1 < param356.length && (param356.charCodeAt(var2665 + 0x1) & 0xfc00) == 0xdc00 ? (var2666 = 0x10000 + ((var2666 & 0x3ff) << 0xa) + (param356.charCodeAt(++var2665) & 0x3ff), var2663[var2664++] = var2666 >> 0x12 | 0xf0, var2663[var2664++] = var2666 >> 0xc & 0x3f | 0x80) : var2663[var2664++] = var2666 >> 0xc | 0xe0, var2663[var2664++] = var2666 >> 0x6 & 0x3f | 0x80), var2663[var2664++] = var2666 & 0x3f | 0x80);
    }
    param356 = var2658;
    for (var2664 = 0x0; var2664 < var2663.length; var2664++) {
      param356 += var2663[var2664];
      param356 = Zotero.AI4Paper.getRL(param356, var2661);
    }
    return param356 = Zotero.AI4Paper.getRL(param356, var2662), param356 ^= var2659 || 0x0, 0x0 > param356 && (param356 = (param356 & 0x7fffffff) + 0x80000000), param356 %= 0xf4240, param356.toString() + var2660 + (param356 ^ var2658);
  },
  'getRL': function (param357, param358) {
    var var2667 = 'a',
      var2668 = '+';
    for (var var2669 = 0x0; var2669 < param358.length - 0x2; var2669 += 0x3) {
      var var2670 = param358.charAt(var2669 + 0x2),
        var2670 = var2670 >= var2667 ? var2670.charCodeAt(0x0) - 0x57 : Number(var2670),
        var2670 = param358.charAt(var2669 + 0x1) == var2668 ? param357 >>> var2670 : param357 << var2670;
      param357 = param358.charAt(var2669) == var2668 ? param357 + var2670 & 0xffffffff : param357 ^ var2670;
    }
    return param357;
  },
  'randomString': function (param359) {
    const var2671 = Math.ceil(param359 / 0x4) * 0x3,
      var2672 = crypto.getRandomValues(new Uint8Array(var2671));
    return Zotero.AI4Paper.base64(var2672).substring(0x0, param359);
  },
  'base64': function (param360) {
    const var2673 = String.fromCharCode(...new Uint8Array(param360));
    return Zotero.getMainWindow().btoa(var2673);
  },
  'hmacSha1Digest': async function (param361, param362) {
    const var2674 = new TextEncoder(),
      var2675 = await crypto.subtle.importKey("raw", var2674.encode(param362), {
        'name': "HMAC",
        'hash': "SHA-1"
      }, false, ["sign"]);
    return crypto.subtle.sign("HMAC", var2675, var2674.encode(param361));
  },
  'encodeRFC3986URIComponent': function (param363) {
    return encodeURIComponent(param363).replace(/[!'()*]/g, _0x201b5c => '%' + _0x201b5c.charCodeAt(0x0).toString(0x10).toUpperCase());
  },
  'encodeRFC5987ValueChars': function (param364) {
    return encodeURIComponent(param364).replace(/['()*]/g, _0x5ab707 => '%' + _0x5ab707.charCodeAt(0x0).toString(0x10).toUpperCase()).replace(/%20/g, '+');
  },
  'checkPunctuation': function (param657) {
    let var3599 = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？+/]|[\\\\/]");
    if (var3599.test(param657)) {
      return true;
    } else return false;
  },
  'httpRequestInit': async function (param658, param659, param660, _0x540a7f = []) {
    let var3600 = await Zotero.AI4Paper.httpRequest(param658, null, param660, _0x540a7f);
    if (var3600.readyState == 0x4 && var3600.status === 0xc8) {
      let _0x14ddb7 = await Zotero.AI4Paper.httpRequest(param659, var3600, param660, _0x540a7f);
      if (_0x14ddb7) {
        return _0x14ddb7;
      }
    }
    return false;
  },
  'httpRequest': async function (param661, _0x145e50 = null, _0x16ba86 = "default", _0x4b030e = []) {
    try {
      return await param661(_0x145e50);
    } catch (_0x1537a4) {
      if (_0x16ba86 === "noAlert") {
        return false;
      } else {
        if (_0x16ba86 === "alert") return window.alert(_0x1537a4), false;else {
          if (Object.keys(Zotero.AI4Paper.translationServiceList()).includes(_0x16ba86)) return Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + _0x16ba86 + "】出错啦：" + Zotero.getString(_0x1537a4)), false;else {
            if (Object.keys(Zotero.AI4Paper.gptServiceList()).includes(_0x16ba86)) {
              let _0x357b10 = Zotero.AI4Paper.gptServiceList()[_0x16ba86].errorCode_link,
                _0x3f85da = "⚠️ [请求错误]\n\n❌【" + _0x16ba86 + '】出错啦：' + Zotero.getString(_0x1537a4) + "\n\n🔗【" + _0x16ba86 + " 错误码含义】请见：\n" + _0x357b10,
                _0x439003 = "👉 ❌【" + _0x16ba86 + "】出错啦：" + Zotero.getString(_0x1537a4);
              return Zotero.Prefs.get("ai4paper.gptContinuesChatMode") && !Zotero.Prefs.get('ai4paper.gptStreamResponse') ? (Zotero.AI4Paper.gptReaderSidePane_ChatMode_displayErrorMessage(_0x3f85da), Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveError2MessageHistory(_0x3f85da, _0x4b030e)) : Zotero.AI4Paper.gptReaderSidePane_resetChat(_0x3f85da), Zotero.AI4Paper.showProgressWindow(0x1388, '❌【' + _0x16ba86 + '】请求错误', _0x439003, 'openai'), false;
            }
          }
        }
      }
    }
  },
  'openDialogByType_modal': function (param664, param665) {
    let var3627 = Zotero.AI4Paper.getFunMetaTitle();
    if (!var3627) return;
    !param665 && (param665 = '');
    var var3628 = {
        'dataIn': param665,
        'dataOut': null
      },
      var3629 = window.openDialog("chrome://ai4paper/content/selectionDialog/" + param664 + ".xhtml", '' + param664, 'chrome,modal,centerscreen,resizable=yes', var3628);
    return var3628.dataOut;
  },
  'openDialogByType': function (param666, param667) {
    let var3630 = Zotero.AI4Paper.getFunMetaTitle();
    if (!var3630) return;
    let var3631 = Zotero.AI4Paper.getOpenedDialog("zoteroone-windowType-" + param666);
    if (var3631) {
      return var3631.focus(), var3631;
    }
    let var3632 = "chrome,extrachrome,centerscreen,resizable" + (param667 ? ",dialog=no" : '');
    return var3631 = window.openDialog('chrome://ai4paper/content/selectionDialog/' + param666 + '.xhtml', '' + param666, var3632), var3631;
  },
  'getOpenedDialog': function (param668) {
    var var3633 = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator),
      var3634 = var3633.getEnumerator(param668);
    while (var3634.hasMoreElements()) {
      var var3635 = var3634.getNext();
    }
    if (var3635) return var3635;
    return false;
  },
  'blurActiveElement': function (param669) {
    try {
      setTimeout(() => {
        param669.document.activeElement?.["blur"]();
      }, 0x0);
    } catch (_0x13a2ca) {
      Zotero.debug(_0x13a2ca);
    }
  },
  'focusWithIMEFix': async function (param670, _0x246e4b = 0xa) {
    try {
      const var3636 = () => new Promise(_0x32139e => setTimeout(_0x32139e, _0x246e4b));
      param670.focus();
      await var3636();
      param670.blur();
      await var3636();
      param670.focus();
    } catch (_0x42b7b1) {
      Zotero.debug(_0x42b7b1);
    }
  },
  'setFontSize_Dialog': function (param671, param672) {
    if (!param671) return;
    try {
      !param672 && (param672 = Zotero.Prefs.get("fontSize"));
      let _0x3c5b96 = param672 + "rem";
      param671.style.fontSize = _0x3c5b96;
      param671.style.setProperty('--zotero-font-size', _0x3c5b96);
      if (param672 <= 0x1) param672 = 'medium';else {
        if (param672 <= 1.15) param672 = 'medium';else {
          if (param672 <= 1.3) param672 = 'large';else {
            param672 = "medium";
          }
        }
      }
      param671.setAttribute('zoteroFontSize', param672);
      if (Zotero.rtl) param671.setAttribute("dir", "rtl");else {
        param671.removeAttribute('dir');
      }
      let _0x66e488 = Zotero.Prefs.get("uiDensity");
      param671.style.setProperty("--zotero-ui-density", _0x66e488);
      param671.setAttribute('zoteroUIDensity', _0x66e488);
    } catch (_0x3e76a0) {
      Zotero.debug(_0x3e76a0);
    }
  },
  'calculateTokens': function (param1142) {
    try {
      return Zotero.AI4Paper._calculateTokens(param1142).length;
    } catch (_0x12af92) {
      return Zotero.debug(_0x12af92), 0x0;
    }
  },
  'isPathExists': async function (param1143) {
    if (param1143.trim() && (await OS.File.exists(param1143))) return true;
    return false;
  },
  'revealPath': async function (param1144) {
    if (param1144.trim() && (await Zotero.AI4Paper.isPathExists(param1144))) {
      let var6005 = Zotero.File.pathToFile(param1144);
      try {
        var6005.reveal();
      } catch (_0x55c9c9) {
        Zotero.debug(_0x55c9c9);
      }
    }
  },
  'isZoteroVersion': function (param1145) {
    param1145 === undefined && (param1145 = [0x8, 0x9]);
    if (typeof param1145 == 'object') for (let var6006 of param1145) {
      if (Zotero.version.startsWith(var6006 + '.')) return true;
    } else {
      if (Zotero.version.startsWith(param1145 + '.')) {
        return true;
      }
    }
    return false;
  },
  'showProgressWindow': function (param1146, param1147, param1148, _0x4b6202 = 'success') {
    let var6007 = new Zotero.ProgressWindow({
      'closeOnClick': true
    });
    var6007.changeHeadline(param1147);
    var6007.addLines(param1148, Zotero.AI4Paper.progressWindowIcon[_0x4b6202]);
    var6007.show();
    var6007.startCloseTimer(param1146);
  },
  'showProgressWindowZot': function (param1149, param1150, param1151, _0x1ecd60 = "success") {
    let var6008 = new Zotero.ProgressWindow({
      'closeOnClick': true
    });
    var6008.changeHeadline(param1150);
    var6008.progress = new var6008.ItemProgress(Zotero.AI4Paper.progressWindowIcon[_0x1ecd60], param1151);
    var6008.show();
    var6008.startCloseTimer(param1149);
  },
  'showProgressWindowGPT': function (param1152, param1153, param1154, _0x2f44f2 = 'success') {
    let var6009 = new Zotero.AI4Paper.ProgressWindow({
      'closeOnClick': true
    });
    var6009.changeHeadline(param1153);
    var6009.addLines(param1154, Zotero.AI4Paper.progressWindowIcon[_0x2f44f2]);
    var6009.show();
    var6009.startCloseTimer(param1152);
  },
  'createProgressWindow': function (param1155, param1156, _0x356d48 = "success") {
    let var6010 = new Zotero.ProgressWindow({
      'closeOnClick': true
    });
    return var6010.changeHeadline(param1155), var6010.addLines(param1156, Zotero.AI4Paper.progressWindowIcon[_0x356d48]), var6010.show(), var6010;
  },
});
