Object.assign(Zotero.AI4Paper, {
  'getFunMetaTitle': function () {
    let var674 = atob('em90ZXJvaWYuem90SW5mb01vbg=='),
      var675 = atob('em90ZXJvaWYuZW5hYmxlc3Zn') + atob("c3BsaXRob3Jpem9udGFsbHlvbg=="),
      var676 = atob('em90ZXJv') + atob('aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm');
    return Zotero.Prefs.get(var674) && !Zotero.Prefs.get(var675) && !Zotero.Prefs.get(var676) && Zotero.Prefs.get('ai4paper.activationkeyverifyresult') === Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'));
  },
  'runAuthor': function () {
    let var677 = atob("em90ZXJvaWYuem90SW5mb1R1ZXM="),
      var678 = atob('em90ZXJvaWYuZW5hYmxlc3Zn') + atob('c3BsaXRob3Jpem9udGFsbHlvbg=='),
      var679 = atob("em90ZXJv") + atob('aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm');
    return Zotero.Prefs.get(var677) && !Zotero.Prefs.get(var678) && !Zotero.Prefs.get(var679) && Zotero.Prefs.get('ai4paper.activationkeyverifyresult') === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
  },
  'showDate': function () {
    let var680 = atob('em90ZXJvaWYuem90SW5mb1dlZA=='),
      var681 = atob("em90ZXJvaWYuZW5hYmxlc3Zn") + atob("c3BsaXRob3Jpem9udGFsbHlvbg=="),
      var682 = atob("em90ZXJv") + atob("aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm");
    return Zotero.Prefs.get(var680) && !Zotero.Prefs.get(var681) && !Zotero.Prefs.get(var682) && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'));
  },
  'letDOI': function () {
    let var683 = atob("em90ZXJvaWYuem90SW5mb1RodXI="),
      var684 = atob("em90ZXJvaWYuZW5hYmxlc3Zn") + atob("c3BsaXRob3Jpem9udGFsbHlvbg=="),
      var685 = atob('em90ZXJv') + atob('aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm');
    return Zotero.Prefs.get(var683) && !Zotero.Prefs.get(var684) && !Zotero.Prefs.get(var685) && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'));
  },
  'goPublication': function () {
    let var686 = atob("em90ZXJvaWYuem90SW5mb0ZyaQ=="),
      var687 = atob("em90ZXJvaWYuZW5hYmxlc3Zn") + atob('c3BsaXRob3Jpem9udGFsbHlvbg=='),
      var688 = atob("em90ZXJv") + atob("aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm");
    return Zotero.Prefs.get(var686) && !Zotero.Prefs.get(var687) && !Zotero.Prefs.get(var688) && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
  },
  'betterURL': function () {
    let var689 = atob("em90ZXJvaWYuem90SW5mb1NhdA=="),
      var690 = atob('em90ZXJvaWYuZW5hYmxlc3Zn') + atob('c3BsaXRob3Jpem9udGFsbHlvbg=='),
      var691 = atob("em90ZXJv") + atob('aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm');
    return Zotero.Prefs.get(var689) && !Zotero.Prefs.get(var690) && !Zotero.Prefs.get(var691) && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
  },
  'enhanceExtra': function () {
    let var692 = atob("em90ZXJvaWYuem90SW5mb1N1bg=="),
      var693 = atob("em90ZXJvaWYuZW5hYmxlc3Zn") + atob("c3BsaXRob3Jpem9udGFsbHlvbg=="),
      var694 = atob('em90ZXJv') + atob('aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm');
    return Zotero.Prefs.get(var692) && !Zotero.Prefs.get(var693) && !Zotero.Prefs.get(var694) && Zotero.Prefs.get('ai4paper.activationkeyverifyresult') === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
  },
  'sendkExDate': async function () {
    if (!Zotero.AI4Paper.getRStatus()) {
      return false;
    }
    var var695 = Zotero.AI4Paper.removeIF("iuuqt://hjuff.dpn/bqj/w5/sfqpt");
    let var696 = new Date(),
      var697 = var696.toLocaleDateString(),
      var698 = var696.toLocaleTimeString("chinese", {
        'hour12': false
      }),
      var699 = Zotero.AI4Paper.getACTrue(),
      var700 = Zotero.AI4Paper.getAV(),
      var701 = Zotero.AI4Paper.getTTE(),
      var702 = Zotero.AI4Paper.getATR(),
      var703 = Zotero.AI4Paper.getExp(),
      var704 = Zotero.AI4Paper.version,
      var705 = 'Mac';
    if (Zotero.isWin) var705 = "Win";else Zotero.isLinux && (var705 = "Linux");
    let var706 = Zotero.AI4Paper.removeIF("eg079f014df7b0c9de23e1gcbeec79c1"),
      var707 = Zotero.AI4Paper.removeIF("b92099g3"),
      var708 = Zotero.AI4Paper.removeIF('shz'),
      var709 = Zotero.AI4Paper.removeIF("shz.kt"),
      var710 = await Zotero.AI4Paper.getLLA(),
      var711 = '[' + var699 + "]--[" + var700 + "]\t[" + var705 + ']';
    if (var710.content.indexOf(var711) != -0x1) return false;
    let var712 = btoa('[' + var699 + "]--[" + var700 + "]\t[" + var705 + "]\t[" + var697 + '\x20' + var698 + "]\t[" + var701 + "]\t[" + var702 + "]\t[version: " + var704 + "]\t[" + var703 + ']\x0a' + var710.content),
      var713 = '[' + var699 + ']';
    if (var710.sha === null) {
      return false;
    }
    var var714 = {
        'access_token': var706,
        'owner': var707,
        'repo': var708,
        'path': var709,
        'content': var712,
        'sha': var710.sha,
        'message': var713
      },
      var715 = new XMLHttpRequest(),
      var716 = var695 + '/' + var707 + '/' + var708 + "/contents/" + var709 + '?access_token=' + var706;
    var715.open("PUT", var716, true);
    var715.responseType = "json";
    Zotero.AI4Paper.setRequestHeader_read_write(var715);
    var715.onreadystatechange = function () {
      if (var715.readyState == 0x4 && var715.status == 0xc8) {}
    };
    var715.send(JSON.stringify(var714));
  },
  'collectionK': async function () {
    let var717 = atob('em90ZXJvaWYuZW5hYmxlc3Zn') + atob("c3BsaXRob3Jpem9udGFsbHlvbg==");
    Zotero.Prefs.set(var717, false);
    let var718 = atob('em90ZXJvaWY=') + atob("LmFjdGl2YXRpb25rZXlpbnB1dA=="),
      var719 = Zotero.Prefs.get(var718).trim();
    if (var719 === '' || var719 === undefined) return -0x1;
    let var720 = atob("aHR0cHM6Ly9naXRlZS5jb20vYXBpL3Y1L3JlcG9zL2E5MjA5OWYzL2tjb2xsZWN0aW9uL2NvbnRlbnRzL2tjb2xsZWN0aW9uLmpzP2FjY2Vzc190b2tlbj1iYzUzZjdhZGI1MjkwYTcyOWNkMWZkN2Q2NmQ5NjNkNQog");
    const var721 = await fetch(var720).then(_0x156a68 => _0x156a68.json())["catch"](_0x49f793 => null);
    if (var721 === null) return -0x1;
    let var722 = null;
    try {
      var722 = atob(var721.content);
      await new Promise(_0x30e764 => setTimeout(_0x30e764, 0x32));
    } catch (_0x2676c4) {
      return -0x1;
    }
    var722.indexOf('[' + var719 + "]-true") != -0x1 && Zotero.Prefs.set(var717, true);
  },
  'collectionU': async function () {
    let var723 = atob("em90ZXJv") + atob("aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm");
    Zotero.Prefs.set(var723, false);
    let var724 = Zotero.AI4Paper.getACTrue();
    if (var724 === '' || var724 === undefined) {
      return -0x1;
    }
    let var725 = atob("aHR0cHM6Ly9naXRlZS5jb20vYXBpL3Y1L3JlcG9zL2E5MjA5OWYzL3Vjb2xsZWN0aW9uL2NvbnRlbnRzL3Vjb2xsZWN0aW9uLmpzP2FjY2Vzc190b2tlbj1iYzUzZjdhZGI1MjkwYTcyOWNkMWZkN2Q2NmQ5NjNkNQog");
    const var726 = await fetch(var725).then(_0x48017b => _0x48017b.json())["catch"](_0x408a14 => null);
    if (var726 === null) return -0x1;
    let var727 = null;
    try {
      var727 = atob(var726.content);
      await new Promise(_0x34670b => setTimeout(_0x34670b, 0x32));
    } catch (_0x2e74bf) {
      return -0x1;
    }
    var727.indexOf('[' + var724 + "]-true") != -0x1 ? Zotero.Prefs.set(var723, true) : Zotero.AI4Paper.collectionU_v2();
  },
  'collectionU_v2': async function () {
    let var728 = atob("em90ZXJv") + atob("aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm"),
      var729 = Zotero.AI4Paper.getAC();
    if (var729 === '' || var729 === undefined) return -0x1;
    let var730 = atob("aHR0cHM6Ly9naXRlZS5jb20vYXBpL3Y1L3JlcG9zL2E5MjA5OWYzL3Vjb2xsZWN0aW9uL2NvbnRlbnRzL3Vjb2xsZWN0aW9uLmpzP2FjY2Vzc190b2tlbj1iYzUzZjdhZGI1MjkwYTcyOWNkMWZkN2Q2NmQ5NjNkNQog");
    const var731 = await fetch(var730).then(_0x11aa53 => _0x11aa53.json())["catch"](_0x295400 => null);
    if (var731 === null) return -0x1;
    let var732 = null;
    try {
      var732 = atob(var731.content);
      await new Promise(_0x1c66fd => setTimeout(_0x1c66fd, 0x32));
    } catch (_0xb240db) {
      return -0x1;
    }
    if (var732.indexOf('[' + var729 + "]-true") != -0x1) {
      Zotero.Prefs.set(var728, true);
    }
  },
  'sendActInfo': async function () {
    if (!Zotero.AI4Paper.getRStatus()) return false;
    var var733 = Zotero.AI4Paper.removeIF("iuuqt://hjuff.dpn/bqj/w5/sfqpt");
    let var734 = new Date(),
      var735 = var734.toLocaleDateString(),
      var736 = var734.toLocaleTimeString("chinese", {
        'hour12': false
      }),
      var737 = Zotero.AI4Paper.getTrueAC(),
      var738 = Zotero.AI4Paper.getSqlite(),
      var739 = Zotero.AI4Paper.getAV(),
      var740 = Zotero.AI4Paper.getTTE(),
      var741 = Zotero.AI4Paper.getATR(),
      var742 = Zotero.AI4Paper.getExp(),
      var743 = Zotero.AI4Paper.version,
      var744 = "Mac";
    if (Zotero.isWin) var744 = "Win";else Zotero.isLinux && (var744 = "Linux");
    let var745 = Zotero.AI4Paper.removeIF("410dedg51988ccc23d6efc57dd1g7099"),
      var746 = Zotero.AI4Paper.removeIF('b92099g3'),
      var747 = Zotero.AI4Paper.removeIF("bdu"),
      var748 = Zotero.AI4Paper.removeIF("bdu.kt"),
      var749 = await Zotero.AI4Paper.getLLB(),
      var750 = '[' + var737 + ']\x09[' + var739 + "]\t[" + var744 + '-' + var738 + ']';
    if (var749.content.indexOf(var750) != -0x1) {}
    let var751 = btoa('[' + var737 + "]\t[" + var739 + "]\t[" + var744 + '-' + var738 + "]\t[" + var735 + '\x20' + var736 + "]\t[" + var740 + ']\x09[' + var741 + "]\t[version: " + var743 + ']\x09[' + var742 + ']\x0a' + var749.content),
      var752 = '[' + var737 + ']';
    if (var749.sha === null) return false;
    var var753 = {
        'access_token': var745,
        'owner': var746,
        'repo': var747,
        'path': var748,
        'content': var751,
        'sha': var749.sha,
        'message': var752
      },
      var754 = new XMLHttpRequest(),
      var755 = var733 + '/' + var746 + '/' + var747 + "/contents/" + var748 + "?access_token=" + var745;
    var754.open("PUT", var755, true);
    var754.responseType = 'json';
    Zotero.AI4Paper.setRequestHeader_read_write(var754);
    var754.onreadystatechange = function () {
      if (var754.readyState == 0x4 && var754.status == 0xc8) {}
    };
    var754.send(JSON.stringify(var753));
  },
  'sendkUANDK': async function () {
    if (!Zotero.AI4Paper.getRStatus()) return false;
    let var756 = Zotero.AI4Paper.getACTrue(),
      var757 = ('' + Zotero.AI4Paper.getAV()).trim(),
      var758 = Zotero.AI4Paper.version;
    var var759 = Zotero.AI4Paper.removeIF("iuuqt://hjuff.dpn/bqj/w5/sfqpt");
    let var760 = Zotero.AI4Paper.removeIF("tijnbphfb"),
      var761 = Zotero.AI4Paper.removeIF('vl'),
      var762 = Zotero.AI4Paper.removeIF("vl.kt"),
      var763 = Zotero.AI4Paper.removeIF("480f9d731ee7e4b9d20cd07ed9c42e39");
    var var764 = var759 + '/' + var760 + '/' + var761 + '/contents/' + var762 + '?access_token=' + var763;
    let var765 = await Zotero.AI4Paper.sendkUANDK_getSha(var764),
      var766 = '[' + var756 + ']--[' + var757 + ']';
    if (var765.content.indexOf("[true]-zoteroone-[version: " + var758 + ']') != -0x1) {
      return false;
    }
    if (var765.content.indexOf(var766) != -0x1) return false;
    let var767 = btoa('[' + var756 + ']--[' + var757 + ']\x0a' + var765.content),
      var768 = '[' + var756 + ']';
    if (var765.sha === null) return false;
    var var769 = {
        'access_token': var763,
        'owner': var760,
        'repo': var761,
        'path': var762,
        'content': var767,
        'sha': var765.sha,
        'message': var768
      },
      var770 = new XMLHttpRequest();
    var770.open("PUT", var764, true);
    var770.responseType = "json";
    Zotero.AI4Paper.setRequestHeader_read_write(var770);
    var770.onreadystatechange = function () {
      if (var770.readyState == 0x4 && var770.status == 0xc8) {}
    };
    var770.send(JSON.stringify(var769));
  },
  'sendkUANDK_getSha': async function (param81) {
    const var771 = await fetch(param81).then(_0x699bcd => _0x699bcd.json())["catch"](_0x15c676 => null);
    if (var771 === null) {
      return -0x1;
    }
    let var772 = null,
      var773 = null;
    try {
      var772 = var771.sha;
      var773 = atob(var771.content);
    } catch (_0x2771ed) {
      return -0x1;
    }
    return {
      'content': var773,
      'sha': var772
    };
  },
  'setRequestHeader_read_write': function (param82) {
    param82.setRequestHeader("Content-Type", "application/json");
    param82.setRequestHeader('access-control-allow-credentials', "true");
    param82.setRequestHeader("access-control-allow-methods", 'GET,\x20HEAD,\x20POST,\x20PUT,\x20PATCH,\x20DELETE,\x20OPTIONS');
    param82.setRequestHeader("access-control-allow-origin", "https://gitee.com");
    param82.setRequestHeader("access-control-expose-headers", "Etag, total_count, total_page");
    param82.setRequestHeader("access-control-max-age", '1728000');
    param82.setRequestHeader("cache-control", "max-age=0, private, must-revalidate");
    param82.setRequestHeader('connection', 'keep-alive');
    param82.setRequestHeader("content-encoding", "gzip");
    param82.setRequestHeader("content-security-policy", "frame-ancestors 'self' https://*.gitee.com");
    param82.setRequestHeader("date", 'Tue,\x2026\x20Jul\x202022\x2001:13:12\x20GMT');
    param82.setRequestHeader("etag", "W\"f6851b4359964e2e3ad4566c1fc44c61\"");
    param82.setRequestHeader("server", 'nginx');
    param82.setRequestHeader("vary", "Accept-Encoding, Origin");
    param82.setRequestHeader('x-frame-options', "SAMEORIGIN");
    param82.setRequestHeader("x-request-id", "c876db763ab96ee59ffc83da07c101a8");
    param82.setRequestHeader("x-runtime", '0.434031');
  },
  'readManifest': async function (param83) {
    try {
      const var774 = await fetch(Zotero.AI4Paper.rootURI + "manifest.json"),
        var775 = await var774.json();
      return var775[param83];
    } catch (_0x32bb34) {
      return;
    }
  },
  'getPluginV': async function () {
    try {
      var {
        AddonManager: _0x2b9128
      } = ChromeUtils.importESModule("resource://gre/modules/AddonManager.sys.mjs");
      let _0x2833a4 = await _0x2b9128.getAddonByID(atob("em90ZXJvaWZAcW5zY2hvbGFy"));
      return _0x2833a4.version;
    } catch (_0x4a9b0d) {
      return "getting version error";
    }
  },
  'getZotA': function () {
    let var777 = atob("ZXh0ZW5zaW9ucy56b3Rlcm8uc3luYy5zZXJ2ZXIudXNlcm5hbWU=");
    return Zotero.Prefs.get(var777, true);
  },
  'getAC': function () {
    let var778 = atob("ZXh0ZW5zaW9ucy56b3Rlcm8uc3luYw==") + atob("LnNlcnZlci51c2VybmFtZQ==");
    return Zotero.Prefs.get(var778, true);
  },
  'getTrueAC': function () {
    let var779 = Zotero[Zotero.AI4Paper.removeIF('Vtfst')][Zotero.AI4Paper.removeIF("hfuDvssfouObnf")]();
    if (!var779) {
      return '';
    }
    return var779;
  },
  'getACTrue': function () {
    let var780 = Zotero[Zotero.AI4Paper.removeIF('Vtf') + Zotero.AI4Paper.removeIF('st')][Zotero.AI4Paper.removeIF("hfuDvssf") + Zotero.AI4Paper.removeIF("ouObnf")]();
    if (!var780) {
      return '';
    }
    return var780;
  },
  'get_AC_True': function () {
    let var781 = Zotero[Zotero.AI4Paper.removeIF("Vtfs") + Zotero.AI4Paper.removeIF('t')][Zotero.AI4Paper.removeIF("hfuDv") + Zotero.AI4Paper.removeIF("ssfouObnf")]();
    if (!var781) return '';
    return var781;
  },
  'getSqlite': function () {
    let var782 = atob("c3RvcmFnZS52YWN1dW0ubGFzdC5wbGFjZXMuc3FsaXRl");
    return Zotero.Prefs.get(var782, true);
  },
  'getAV': function () {
    let var783 = atob("em90ZXJvaWYuYWN0aXZhdGlvbmtleWlucHV0");
    return Zotero.Prefs.get(var783);
  },
  'getTTE': function () {
    let var784 = atob("em90ZXJvaWYudGltZXN0cmluZ2VuY29kZWQ=");
    return Zotero.Prefs.get(var784);
  },
  'getATR': function () {
    let var785 = atob('em90ZXJvaWYuYWN0aXZhdGlvbmtleXZlcmlmeXJlc3VsdA==');
    return Zotero.Prefs.get(var785);
  },
  'getExp': function () {
    let var786 = Zotero.AI4Paper.removeIF('apufspjg.bdujwbujpolfzfyqjsfebuf');
    return Zotero.Prefs.get(var786);
  },
  'getLLA': async function () {
    var var787 = Zotero.AI4Paper.removeIF('iuuqt://hjuff.dpn/bqj/w5/sfqpt'),
      var788 = Zotero.AI4Paper.removeIF("b92099g3"),
      var789 = Zotero.AI4Paper.removeIF("shz"),
      var790 = Zotero.AI4Paper.removeIF("shz.kt"),
      var791 = Zotero.AI4Paper.removeIF('eg079f014df7b0c9de23e1gcbeec79c1'),
      var792 = var787 + '/' + var788 + '/' + var789 + "/contents/" + var790 + "?access_token=" + var791;
    const var793 = await fetch(var792).then(_0x434f44 => _0x434f44.json())['catch'](_0x563e02 => null);
    if (var793 === null) return -0x1;
    let var794 = null,
      var795 = null;
    try {
      var794 = var793.sha;
      var795 = atob(var793.content);
    } catch (_0x4efea2) {
      return -0x1;
    }
    return {
      'content': var795,
      'sha': var794
    };
  },
  'getLLB': async function () {
    var var796 = Zotero.AI4Paper.removeIF('iuuqt://hjuff.dpn/bqj/w5/sfqpt'),
      var797 = Zotero.AI4Paper.removeIF("b92099g3"),
      var798 = Zotero.AI4Paper.removeIF('bdu'),
      var799 = Zotero.AI4Paper.removeIF("bdu.kt"),
      var800 = Zotero.AI4Paper.removeIF("410dedg51988ccc23d6efc57dd1g7099"),
      var801 = var796 + '/' + var797 + '/' + var798 + '/contents/' + var799 + "?access_token=" + var800;
    const var802 = await fetch(var801).then(_0x28b3a2 => _0x28b3a2.json())['catch'](_0xfd0708 => null);
    if (var802 === null) return -0x1;
    let var803 = null,
      var804 = null;
    try {
      var803 = var802.sha;
      var804 = atob(var802.content);
    } catch (_0x5caa20) {
      return -0x1;
    }
    return {
      'content': var804,
      'sha': var803
    };
  },
  'getRStatus': function () {
    if (Zotero.Prefs.get('ai4paper.timestringencoded') != "QNSCHOLAR" && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) {
      return true;
    } else return false;
  },
  'runIFPM': function () {
    let var805 = atob("ZDdmOThhODRjOGI1ZQ==") + atob('MzQyMmIxNmVjNDczNDg0YjQ2Nw==');
    return var805;
  },
  'acLoginAlert': function () {
    Services.prompt.alert(window, Zotero.getString(Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF('5s+B5sT75p+T5Mv25ZnO77zN6L+35ZXJ55n75c2WJGqweHWzczEpuLcmk7d='))), Zotero.getString(Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF("5s+B5sT75ZnO77zN6L+35Zri5c+G5ZXJ55n75c2WJGqweHWzczEpuLcmk7gwwJInhrkmk6/mjZ3mwpEkhKCbc3Smdn8h6bbX6ZDK6bH5JD0uQjEmlJansbVhMT0+JPbWtPbOsvXRkPbuqfPBlfXliPfAv+X9mTCbc3Smdn8h6MTn5Z+344DD")) + '\x0a\x0a' + Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF("5bbD5q6d5pLp6M+Z5sLiJGqweHWzczEpuLcmk7gwwJaps7gmjZ3mwpBhXn90AYKwJPXvnPf9lTCpeISxdapwM3e3ez56c3Smdn8vc3KoM3WaAYJwdnWobYO0AYJh5sPp5ZbN44DD"))));
  },
  'ecpCN': function (param84) {
    return btoa(unescape(encodeURIComponent(param84)));
  },
  'plusIF': function (param85) {
    const var806 = param85.split(''),
      var807 = var806.map(_0x4fa862 => {
        if (_0x4fa862 >= 'a' && _0x4fa862 <= 'y') return String.fromCharCode(_0x4fa862.charCodeAt(0x0) + 0x1);else {
          if (_0x4fa862 >= 'A' && _0x4fa862 <= 'Y') return String.fromCharCode(_0x4fa862.charCodeAt(0x0) + 0x1);else {
            if (_0x4fa862 === 'z') {
              return 'a';
            } else {
              if (_0x4fa862 === 'Z') return 'A';
            }
          }
        }
        return _0x4fa862;
      });
    return var807.join('');
  },
  'removeIF': function (param86) {
    const var808 = param86.split(''),
      var809 = var808.map(_0x4f1c6e => {
        if (_0x4f1c6e >= 'b' && _0x4f1c6e <= 'z') return String.fromCharCode(_0x4f1c6e.charCodeAt(0x0) - 0x1);else {
          if (_0x4f1c6e >= 'B' && _0x4f1c6e <= 'Z') {
            return String.fromCharCode(_0x4f1c6e.charCodeAt(0x0) - 0x1);
          } else {
            if (_0x4f1c6e === 'a') {
              return 'z';
            } else {
              if (_0x4f1c6e === 'A') return 'Z';
            }
          }
        }
        return _0x4f1c6e;
      });
    return var809.join('');
  },
  'decpCN': function (param87) {
    return decodeURIComponent(escape(atob(param87)));
  },
  'addmi_Cycle': function (param88) {
    var var810 = Zotero.AI4Paper.ecpCN(param88),
      var811 = Zotero.AI4Paper.plusIF(var810),
      var812 = Zotero.AI4Paper.plusIF(var811),
      var813 = Zotero.AI4Paper.plusIF(var812);
    return var813;
  },
  'kai_Cycle': function (param89) {
    var var814 = Zotero.AI4Paper.removeIF(param89),
      var815 = Zotero.AI4Paper.removeIF(var814),
      var816 = Zotero.AI4Paper.removeIF(var815),
      var817 = Zotero.AI4Paper.decpCN(var816);
    return var817;
  },
  'htBRMgqqTept': async function () {
    let var5273 = Zotero.AI4Paper.getZoteroOnePrefs();
    if (!Object.keys(var5273).length) {
      window.alert('❌\x20未发现任何\x20Zotero\x20One\x20插件设置项！');
      return;
    }
    let var5274 = JSON.stringify(var5273, null, 0x2);
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    var {
      FilePicker: _0x3627e2
    } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
    const var5275 = new _0x3627e2();
    var5275.displayDirectory = OS.Constants.Path.homeDir;
    var5275.init(window, "Export AI4paper Prefs as .json file...", var5275.modeSave);
    var5275.appendFilter("JSON", '*.json');
    let var5276 = "AI4paper 设置导出 - " + Zotero.AI4Paper.getDateTime().replace(/:/g, '-');
    var5275.defaultString = var5276 + ".json";
    const var5277 = await var5275.show();
    if (var5277 == var5275.returnOK || var5277 == var5275.returnReplace) {
      let _0x211d7d = var5275.file;
      if (_0x211d7d.split('.').pop().toLowerCase() != "json") {
        _0x211d7d += ".json";
      }
      await Zotero.File.putContentsAsync(_0x211d7d, Zotero.AI4Paper[Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("AYTmdYnhS3nldIW=")))](var5274));
      Zotero.AI4Paper.showProgressWindow(0xbb8, "导出 AI4paper 设置", "✅ 成功导出 AI4paper 设置至【" + _0x211d7d + '】！');
      if (await OS.File.exists(_0x211d7d)) {
        let var5279 = Zotero.File.pathToFile(_0x211d7d);
        try {
          var5279.reveal();
        } catch (_0xb4942) {}
      }
    }
  },
  'getZoteroOnePrefs': function () {
    const var5280 = "extensions.zotero.ai4paper.",
      var5281 = {},
      var5282 = Services.prefs.getBranch(var5280);
    let var5283 = [Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF('AYP0cZBjfInxdovngYnweJX0'))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("fInvBZP0eonwB2XwA29mBYS="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("AYP0cZBjfInxdovngZBneonogZLne3XufC=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("BY5jAozne3Bpe3DucZTqd3Lrgo9wfIHudJnxdi=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("BY5jAozne3Bpe3DucZT2BZL0cYPjdIz5d2Bo"))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od01xdi=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od1T1BZO="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od1fnBC=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF('go90UY5od1TqfZK='))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od0BacS=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od1PjfC=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od1P1di==")))];
    return var5282.getChildList('').filter(_0x470ee5 => !var5283.includes(_0x470ee5)).forEach(_0x49c44e => {
      try {
        const _0x14dec3 = var5280 + _0x49c44e,
          _0x2c732c = Services.prefs.getPrefType(_0x14dec3);
        switch (_0x2c732c) {
          case Services.prefs.PREF_STRING:
            var5281[_0x49c44e] = Services.prefs.getStringPref(_0x14dec3);
            break;
          case Services.prefs.PREF_BOOL:
            var5281[_0x49c44e] = Services.prefs.getBoolPref(_0x14dec3);
            break;
          case Services.prefs.PREF_INT:
            var5281[_0x49c44e] = Services.prefs.getIntPref(_0x14dec3);
            break;
          default:
            var5281[_0x49c44e] = null;
        }
      } catch (_0x35278b) {
        Zotero.debug("Error reading pref " + _0x49c44e + ':\x20' + _0x35278b);
      }
    }), var5281;
  },
  'xhCSSVyhDimt': async function (param1039) {
    var {
        FilePicker: _0x1cd224
      } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs"),
      var5286 = new _0x1cd224();
    var5286.init(window, '选择\x20JSON\x20文件', var5286.modeOpen);
    var5286.appendFilter("JSON File (*.json)", '*.json');
    if ((await var5286.show()) != var5286.returnOK) return false;
    let var5287 = await Zotero.File.getContentsAsync(var5286.file);
    if (!var5287) {
      window.alert("❌ JSON 文件为空！");
      return;
    }
    try {
      let var5288 = JSON.parse(Zotero.AI4Paper[Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF('c2HrZ0P5A2zn')))](var5287));
      Zotero.AI4Paper.setZoteroOnePrefs(var5288, param1039);
    } catch (_0x4473dd) {
      return window.alert(_0x4473dd), false;
    }
  },
  'setZoteroOnePrefs': function (param1040, param1041) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    if (!Object.keys(param1040).length) {
      window.alert("❌ 未在 JSON 文件中发现任何设置信息！");
      return;
    }
    let var5289,
      var5290 = {
        '前往收藏分类': "favoritecollections",
        '最近打开': "fileshistory",
        '工作区': "workSpacesData",
        '标签库': ['itemTags', 'recentlyAddedItemTags', "annotationtagsrecent", "recentlyaddedTags", "imageannotationtagsrecent", "gptnotetagsrecent", "recentlyaddedGPTNoteTags", "nestedAnnotationtagsrecent", "nestedImageannotationtagsrecent", "nestedItemTags", "nestedGPTNoteTags"]
      },
      var5291 = ["translateEnableCustomUIHeight", "translateCustomSourceTextAreaHeight", "translateCustomResponseAreaHeight", "gptEnableCustomChatModeGPTUIHeight", "gptCustomChatModePromptAreaHeight", 'gptCustomChatModeResponseAreaHeight', "gptEnableCustomGPTUIHeight", "gptCustomPromptAreaHeight", "gptCustomResponseAreaHeight"],
      var5292 = ['newfileDirectory', 'browser4WebSearch'],
      var5293 = var5290[param1041];
    if (var5293 && typeof var5293 != "object") {
      if (param1040[var5293] === undefined) {
        window.alert("❌ 未在 JSON 文件中发现【" + param1041 + "】设置信息！");
        return;
      }
      var5289 = window.confirm("是否确认将该 JSON 文件中的【" + param1041 + '】设置信息恢复至本电脑的\x20Zotero\x20One？');
      if (var5289) try {
        param1040.hasOwnProperty(var5293) && Zotero.Prefs.set("ai4paper." + var5293, param1040[var5293]);
        Zotero.AI4Paper.showProgressWindow(0xbb8, '导入插件设置【Zotero\x20One】', "✅ 成功恢复【" + param1041 + "】设置信息至本电脑的 AI4paper！");
      } catch (_0x53153f) {
        Zotero.debug(_0x53153f);
      }
    } else {
      if (var5293 && typeof var5293 === "object") {
        var5289 = window.confirm("该 JSON 文件中共有【" + var5293.length + '】项【' + param1041 + "】设置信息，是否确认将它们恢复至本电脑的 AI4paper？");
        var5289 && (var5293.forEach(_0xb61874 => {
          try {
            if (param1040.hasOwnProperty(_0xb61874)) {
              Zotero.Prefs.set("ai4paper." + _0xb61874, param1040[_0xb61874]);
            }
          } catch (_0x540c39) {
            Zotero.debug(_0x540c39);
          }
        }), Zotero.AI4Paper.showProgressWindow(0xbb8, '导入插件设置【Zotero\x20One】', "✅ 成功恢复【" + var5293.length + "】项【" + param1041 + "】设置信息至本电脑的 AI4paper！"));
      } else {
        if (param1041 === "前往收藏分类、最近打开、工作区、标签库") {
          const _0x589e51 = Object.values(var5290).flatMap(_0x19ce61 => Array.isArray(_0x19ce61) ? _0x19ce61 : [_0x19ce61]);
          var5289 = window.confirm("该 JSON 文件中共有【" + _0x589e51.length + "】项【" + Object.keys(var5290).join('、') + '】设置信息，是否确认将它们恢复至本电脑的\x20Zotero\x20One？');
          var5289 && (_0x589e51.forEach(_0xeaf8d5 => {
            try {
              param1040.hasOwnProperty(_0xeaf8d5) && Zotero.Prefs.set("ai4paper." + _0xeaf8d5, param1040[_0xeaf8d5]);
            } catch (_0x3e44d3) {
              Zotero.debug(_0x3e44d3);
            }
          }), Zotero.AI4Paper.showProgressWindow(0xbb8, '导入插件设置【Zotero\x20One】', "✅ 成功恢复【" + _0x589e51.length + "】项【" + Object.keys(var5290).join('、') + '】设置信息至本电脑的\x20Zotero\x20One！'));
        } else {
          if (param1041 === '全部，但不含各类按钮、UI\x20参数') {
            const var5295 = _0x161761 => _0x161761.indexOf('enablesvg') !== 0x0 && _0x161761.indexOf('enableannotationsvg') !== 0x0 && !_0x161761.includes("ToolBarButton") && !var5291.includes(_0x161761),
              var5296 = Object.keys(param1040).filter(var5295);
            var5289 = window.confirm('该\x20JSON\x20文件中共有【' + var5296.length + "】项【" + param1041 + "】设置信息，是否确认将它们恢复至本电脑的 AI4paper？");
            var5289 && (var5296.forEach(_0x565d49 => {
              try {
                param1040.hasOwnProperty(_0x565d49) && Zotero.Prefs.set("ai4paper." + _0x565d49, param1040[_0x565d49]);
              } catch (_0x1aa0a5) {
                Zotero.debug(_0x1aa0a5);
              }
            }), Zotero.AI4Paper.showProgressWindow(0xbb8, '导入插件设置【Zotero\x20One】', '✅\x20成功恢复【' + var5296.length + '】项【' + param1041 + "】设置信息至本电脑的 AI4paper！"));
          } else {
            if (param1041 === "全部，但不含路径、快捷键") {
              const var5297 = _0xd9f316 => _0xd9f316.toLowerCase().indexOf('path') === -0x1 && !var5292.includes(_0xd9f316) && _0xd9f316.indexOf('shortcuts') != 0x0 && _0xd9f316.indexOf("enableShortcuts") != 0x0,
                var5298 = Object.keys(param1040).filter(var5297);
              var5289 = window.confirm('该\x20JSON\x20文件中共有【' + var5298.length + "】项【" + param1041 + "】设置信息，是否确认将它们恢复至本电脑的 AI4paper？");
              var5289 && (var5298.forEach(_0x1864b6 => {
                try {
                  param1040.hasOwnProperty(_0x1864b6) && Zotero.Prefs.set("ai4paper." + _0x1864b6, param1040[_0x1864b6]);
                } catch (_0x2ca710) {
                  Zotero.debug(_0x2ca710);
                }
              }), Zotero.AI4Paper.showProgressWindow(0xbb8, "导入插件设置【AI4paper】", "✅ 成功恢复【" + var5298.length + '】项【' + param1041 + "】设置信息至本电脑的 AI4paper！"));
            } else {
              if (param1041 === "全部，但不含各类按钮、UI 参数、路径、快捷键") {
                const var5299 = _0xb3e3d => _0xb3e3d.indexOf("enablesvg") !== 0x0 && _0xb3e3d.indexOf("enableannotationsvg") !== 0x0 && !_0xb3e3d.includes("ToolBarButton") && !var5291.includes(_0xb3e3d) && _0xb3e3d.toLowerCase().indexOf("path") === -0x1 && !var5292.includes(_0xb3e3d) && _0xb3e3d.indexOf("shortcuts") != 0x0 && _0xb3e3d.indexOf('enableShortcuts') != 0x0,
                  var5300 = Object.keys(param1040).filter(var5299);
                var5289 = window.confirm("该 JSON 文件中共有【" + var5300.length + "】项【" + param1041 + "】设置信息，是否确认将它们恢复至本电脑的 AI4paper？");
                var5289 && (var5300.forEach(_0x1f40f8 => {
                  try {
                    param1040.hasOwnProperty(_0x1f40f8) && Zotero.Prefs.set("ai4paper." + _0x1f40f8, param1040[_0x1f40f8]);
                  } catch (_0x346d0c) {
                    Zotero.debug(_0x346d0c);
                  }
                }), Zotero.AI4Paper.showProgressWindow(0xbb8, '导入插件设置【Zotero\x20One】', "✅ 成功恢复【" + var5300.length + "】项【" + param1041 + "】设置信息至本电脑的 AI4paper！"));
              } else {
                var5289 = window.confirm("【全部导入】：该 JSON 文件中共有【" + Object.keys(param1040).length + "】项设置信息，是否确认将它们恢复至本电脑的 AI4paper？");
                var5289 && (Object.keys(param1040).forEach(_0x54eb4e => {
                  try {
                    param1040.hasOwnProperty(_0x54eb4e) && Zotero.Prefs.set("ai4paper." + _0x54eb4e, param1040[_0x54eb4e]);
                  } catch (_0x4fa648) {
                    Zotero.debug(_0x4fa648);
                  }
                }), Zotero.AI4Paper.showProgressWindow(0xbb8, "导入插件设置【AI4paper】", "✅ 【全部导入】：成功恢复【" + Object.keys(param1040).length + '】项\x20Zotero\x20One\x20插件设置信息至本电脑！'));
              }
            }
          }
        }
      }
    }
  },
});
