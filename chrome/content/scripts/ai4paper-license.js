Object.assign(Zotero.AI4Paper, {
  'getFunMetaTitle': function () {
    let encPrefKey = atob('em90ZXJvaWYuem90SW5mb01vbg=='),
      encFlagPref1 = atob('em90ZXJvaWYuZW5hYmxlc3Zn') + atob("c3BsaXRob3Jpem9udGFsbHlvbg=="),
      encFlagPref2 = atob('em90ZXJv') + atob('aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm');
    return Zotero.Prefs.get(encPrefKey) && !Zotero.Prefs.get(encFlagPref1) && !Zotero.Prefs.get(encFlagPref2) && Zotero.Prefs.get('ai4paper.activationkeyverifyresult') === Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'));
  },
  'runAuthor': function () {
    let encPrefKey = atob("em90ZXJvaWYuem90SW5mb1R1ZXM="),
      encFlagPref1 = atob('em90ZXJvaWYuZW5hYmxlc3Zn') + atob('c3BsaXRob3Jpem9udGFsbHlvbg=='),
      encFlagPref2 = atob("em90ZXJv") + atob('aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm');
    return Zotero.Prefs.get(encPrefKey) && !Zotero.Prefs.get(encFlagPref1) && !Zotero.Prefs.get(encFlagPref2) && Zotero.Prefs.get('ai4paper.activationkeyverifyresult') === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
  },
  'showDate': function () {
    let encPrefKey = atob('em90ZXJvaWYuem90SW5mb1dlZA=='),
      encFlagPref1 = atob("em90ZXJvaWYuZW5hYmxlc3Zn") + atob("c3BsaXRob3Jpem9udGFsbHlvbg=="),
      encFlagPref2 = atob("em90ZXJv") + atob("aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm");
    return Zotero.Prefs.get(encPrefKey) && !Zotero.Prefs.get(encFlagPref1) && !Zotero.Prefs.get(encFlagPref2) && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'));
  },
  'letDOI': function () {
    let encPrefKey = atob("em90ZXJvaWYuem90SW5mb1RodXI="),
      encFlagPref1 = atob("em90ZXJvaWYuZW5hYmxlc3Zn") + atob("c3BsaXRob3Jpem9udGFsbHlvbg=="),
      encFlagPref2 = atob('em90ZXJv') + atob('aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm');
    return Zotero.Prefs.get(encPrefKey) && !Zotero.Prefs.get(encFlagPref1) && !Zotero.Prefs.get(encFlagPref2) && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'));
  },
  'goPublication': function () {
    let encPrefKey = atob("em90ZXJvaWYuem90SW5mb0ZyaQ=="),
      encFlagPref1 = atob("em90ZXJvaWYuZW5hYmxlc3Zn") + atob('c3BsaXRob3Jpem9udGFsbHlvbg=='),
      encFlagPref2 = atob("em90ZXJv") + atob("aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm");
    return Zotero.Prefs.get(encPrefKey) && !Zotero.Prefs.get(encFlagPref1) && !Zotero.Prefs.get(encFlagPref2) && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
  },
  'betterURL': function () {
    let encPrefKey = atob("em90ZXJvaWYuem90SW5mb1NhdA=="),
      encFlagPref1 = atob('em90ZXJvaWYuZW5hYmxlc3Zn') + atob('c3BsaXRob3Jpem9udGFsbHlvbg=='),
      encFlagPref2 = atob("em90ZXJv") + atob('aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm');
    return Zotero.Prefs.get(encPrefKey) && !Zotero.Prefs.get(encFlagPref1) && !Zotero.Prefs.get(encFlagPref2) && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
  },
  'enhanceExtra': function () {
    let encPrefKey = atob("em90ZXJvaWYuem90SW5mb1N1bg=="),
      encFlagPref1 = atob("em90ZXJvaWYuZW5hYmxlc3Zn") + atob("c3BsaXRob3Jpem9udGFsbHlvbg=="),
      encFlagPref2 = atob('em90ZXJv') + atob('aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm');
    return Zotero.Prefs.get(encPrefKey) && !Zotero.Prefs.get(encFlagPref1) && !Zotero.Prefs.get(encFlagPref2) && Zotero.Prefs.get('ai4paper.activationkeyverifyresult') === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
  },
  'sendkExDate': async function () {
    if (!Zotero.AI4Paper.getRStatus()) {
      return false;
    }
    var apiBaseUrl = Zotero.AI4Paper.removeIF("iuuqt://hjuff.dpn/bqj/w5/sfqpt");
    let now = new Date(),
      dateStr = now.toLocaleDateString(),
      timeStr = now.toLocaleTimeString("chinese", {
        'hour12': false
      }),
      accountTrue = Zotero.AI4Paper.getACTrue(),
      activationKey = Zotero.AI4Paper.getAV(),
      tte = Zotero.AI4Paper.getTTE(),
      atr = Zotero.AI4Paper.getATR(),
      expDate = Zotero.AI4Paper.getExp(),
      version = Zotero.AI4Paper.version,
      platform = 'Mac';
    if (Zotero.isWin) platform = "Win";else Zotero.isLinux && (platform = "Linux");
    let accessToken = Zotero.AI4Paper.removeIF("eg079f014df7b0c9de23e1gcbeec79c1"),
      owner = Zotero.AI4Paper.removeIF("b92099g3"),
      repo = Zotero.AI4Paper.removeIF('shz'),
      repoPath = Zotero.AI4Paper.removeIF("shz.kt"),
      remoteData = await Zotero.AI4Paper.getLLA(),
      entryKey = '[' + accountTrue + "]--[" + activationKey + "]\t[" + platform + ']';
    if (remoteData.content.indexOf(entryKey) != -0x1) return false;
    let encodedContent = btoa('[' + accountTrue + "]--[" + activationKey + "]\t[" + platform + "]\t[" + dateStr + '\x20' + timeStr + "]\t[" + tte + "]\t[" + atr + "]\t[version: " + version + "]\t[" + expDate + ']\x0a' + remoteData.content),
      commitMsg = '[' + accountTrue + ']';
    if (remoteData.sha === null) {
      return false;
    }
    var requestBody = {
        'access_token': accessToken,
        'owner': owner,
        'repo': repo,
        'path': repoPath,
        'content': encodedContent,
        'sha': remoteData.sha,
        'message': commitMsg
      },
      xhr = new XMLHttpRequest(),
      requestUrl = apiBaseUrl + '/' + owner + '/' + repo + "/contents/" + repoPath + '?access_token=' + accessToken;
    xhr.open("PUT", requestUrl, true);
    xhr.responseType = "json";
    Zotero.AI4Paper.setRequestHeader_read_write(xhr);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 0x4 && xhr.status == 0xc8) {}
    };
    xhr.send(JSON.stringify(requestBody));
  },
  'collectionK': async function () {
    let flagPref = atob('em90ZXJvaWYuZW5hYmxlc3Zn') + atob("c3BsaXRob3Jpem9udGFsbHlvbg==");
    Zotero.Prefs.set(flagPref, false);
    let inputPref = atob('em90ZXJvaWY=') + atob("LmFjdGl2YXRpb25rZXlpbnB1dA=="),
      inputValue = Zotero.Prefs.get(inputPref).trim();
    if (inputValue === '' || inputValue === undefined) return -0x1;
    let fetchUrl = atob("aHR0cHM6Ly9naXRlZS5jb20vYXBpL3Y1L3JlcG9zL2E5MjA5OWYzL2tjb2xsZWN0aW9uL2NvbnRlbnRzL2tjb2xsZWN0aW9uLmpzP2FjY2Vzc190b2tlbj1iYzUzZjdhZGI1MjkwYTcyOWNkMWZkN2Q2NmQ5NjNkNQog");
    const fetchResult = await fetch(fetchUrl).then(res => res.json())["catch"](e => null);
    if (fetchResult === null) return -0x1;
    let content = null;
    try {
      content = atob(fetchResult.content);
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return -0x1;
    }
    content.indexOf('[' + inputValue + "]-true") != -0x1 && Zotero.Prefs.set(flagPref, true);
  },
  'collectionU': async function () {
    let flagPref = atob("em90ZXJv") + atob("aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm");
    Zotero.Prefs.set(flagPref, false);
    let account = Zotero.AI4Paper.getACTrue();
    if (account === '' || account === undefined) {
      return -0x1;
    }
    let fetchUrl = atob("aHR0cHM6Ly9naXRlZS5jb20vYXBpL3Y1L3JlcG9zL2E5MjA5OWYzL3Vjb2xsZWN0aW9uL2NvbnRlbnRzL3Vjb2xsZWN0aW9uLmpzP2FjY2Vzc190b2tlbj1iYzUzZjdhZGI1MjkwYTcyOWNkMWZkN2Q2NmQ5NjNkNQog");
    const fetchResult = await fetch(fetchUrl).then(res => res.json())["catch"](e => null);
    if (fetchResult === null) return -0x1;
    let content = null;
    try {
      content = atob(fetchResult.content);
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return -0x1;
    }
    content.indexOf('[' + account + "]-true") != -0x1 ? Zotero.Prefs.set(flagPref, true) : Zotero.AI4Paper.collectionU_v2();
  },
  'collectionU_v2': async function () {
    let flagPref = atob("em90ZXJv") + atob("aWYuZW5hYmxlc3Znc3BsaXR2ZXJ0aWNhbGx5b2Zm"),
      account = Zotero.AI4Paper.getAC();
    if (account === '' || account === undefined) return -0x1;
    let fetchUrl = atob("aHR0cHM6Ly9naXRlZS5jb20vYXBpL3Y1L3JlcG9zL2E5MjA5OWYzL3Vjb2xsZWN0aW9uL2NvbnRlbnRzL3Vjb2xsZWN0aW9uLmpzP2FjY2Vzc190b2tlbj1iYzUzZjdhZGI1MjkwYTcyOWNkMWZkN2Q2NmQ5NjNkNQog");
    const fetchResult = await fetch(fetchUrl).then(res => res.json())["catch"](e => null);
    if (fetchResult === null) return -0x1;
    let content = null;
    try {
      content = atob(fetchResult.content);
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return -0x1;
    }
    if (content.indexOf('[' + account + "]-true") != -0x1) {
      Zotero.Prefs.set(flagPref, true);
    }
  },
  'sendActInfo': async function () {
    if (!Zotero.AI4Paper.getRStatus()) return false;
    var apiBaseUrl = Zotero.AI4Paper.removeIF("iuuqt://hjuff.dpn/bqj/w5/sfqpt");
    let now = new Date(),
      dateStr = now.toLocaleDateString(),
      timeStr = now.toLocaleTimeString("chinese", {
        'hour12': false
      }),
      trueAC = Zotero.AI4Paper.getTrueAC(),
      sqliteVal = Zotero.AI4Paper.getSqlite(),
      activationKey = Zotero.AI4Paper.getAV(),
      tte = Zotero.AI4Paper.getTTE(),
      atr = Zotero.AI4Paper.getATR(),
      expDate = Zotero.AI4Paper.getExp(),
      version = Zotero.AI4Paper.version,
      platform = "Mac";
    if (Zotero.isWin) platform = "Win";else Zotero.isLinux && (platform = "Linux");
    let accessToken = Zotero.AI4Paper.removeIF("410dedg51988ccc23d6efc57dd1g7099"),
      owner = Zotero.AI4Paper.removeIF('b92099g3'),
      repo = Zotero.AI4Paper.removeIF("bdu"),
      repoPath = Zotero.AI4Paper.removeIF("bdu.kt"),
      remoteData = await Zotero.AI4Paper.getLLB(),
      entryKey = '[' + trueAC + ']\x09[' + activationKey + "]\t[" + platform + '-' + sqliteVal + ']';
    if (remoteData.content.indexOf(entryKey) != -0x1) {}
    let encodedContent = btoa('[' + trueAC + "]\t[" + activationKey + "]\t[" + platform + '-' + sqliteVal + "]\t[" + dateStr + '\x20' + timeStr + "]\t[" + tte + ']\x09[' + atr + "]\t[version: " + version + ']\x09[' + expDate + ']\x0a' + remoteData.content),
      commitMsg = '[' + trueAC + ']';
    if (remoteData.sha === null) return false;
    var requestBody = {
        'access_token': accessToken,
        'owner': owner,
        'repo': repo,
        'path': repoPath,
        'content': encodedContent,
        'sha': remoteData.sha,
        'message': commitMsg
      },
      xhr = new XMLHttpRequest(),
      requestUrl = apiBaseUrl + '/' + owner + '/' + repo + "/contents/" + repoPath + "?access_token=" + accessToken;
    xhr.open("PUT", requestUrl, true);
    xhr.responseType = 'json';
    Zotero.AI4Paper.setRequestHeader_read_write(xhr);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 0x4 && xhr.status == 0xc8) {}
    };
    xhr.send(JSON.stringify(requestBody));
  },
  'sendkUANDK': async function () {
    if (!Zotero.AI4Paper.getRStatus()) return false;
    let accountTrue = Zotero.AI4Paper.getACTrue(),
      activationKey = ('' + Zotero.AI4Paper.getAV()).trim(),
      version = Zotero.AI4Paper.version;
    var apiBaseUrl = Zotero.AI4Paper.removeIF("iuuqt://hjuff.dpn/bqj/w5/sfqpt");
    let owner = Zotero.AI4Paper.removeIF("tijnbphfb"),
      repo = Zotero.AI4Paper.removeIF('vl'),
      repoPath = Zotero.AI4Paper.removeIF("vl.kt"),
      accessToken = Zotero.AI4Paper.removeIF("480f9d731ee7e4b9d20cd07ed9c42e39");
    var requestUrl = apiBaseUrl + '/' + owner + '/' + repo + '/contents/' + repoPath + '?access_token=' + accessToken;
    let remoteData = await Zotero.AI4Paper.sendkUANDK_getSha(requestUrl),
      entryKey = '[' + accountTrue + ']--[' + activationKey + ']';
    if (remoteData.content.indexOf("[true]-zoteroone-[version: " + version + ']') != -0x1) {
      return false;
    }
    if (remoteData.content.indexOf(entryKey) != -0x1) return false;
    let encodedContent = btoa('[' + accountTrue + ']--[' + activationKey + ']\x0a' + remoteData.content),
      commitMsg = '[' + accountTrue + ']';
    if (remoteData.sha === null) return false;
    var requestBody = {
        'access_token': accessToken,
        'owner': owner,
        'repo': repo,
        'path': repoPath,
        'content': encodedContent,
        'sha': remoteData.sha,
        'message': commitMsg
      },
      xhr = new XMLHttpRequest();
    xhr.open("PUT", requestUrl, true);
    xhr.responseType = "json";
    Zotero.AI4Paper.setRequestHeader_read_write(xhr);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 0x4 && xhr.status == 0xc8) {}
    };
    xhr.send(JSON.stringify(requestBody));
  },
  'sendkUANDK_getSha': async function (url) {
    const fetchResult = await fetch(url).then(res => res.json())["catch"](e => null);
    if (fetchResult === null) {
      return -0x1;
    }
    let sha = null,
      content = null;
    try {
      sha = fetchResult.sha;
      content = atob(fetchResult.content);
    } catch (e) {
      return -0x1;
    }
    return {
      'content': content,
      'sha': sha
    };
  },
  'setRequestHeader_read_write': function (xhr) {
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('access-control-allow-credentials', "true");
    xhr.setRequestHeader("access-control-allow-methods", 'GET,\x20HEAD,\x20POST,\x20PUT,\x20PATCH,\x20DELETE,\x20OPTIONS');
    xhr.setRequestHeader("access-control-allow-origin", "https://gitee.com");
    xhr.setRequestHeader("access-control-expose-headers", "Etag, total_count, total_page");
    xhr.setRequestHeader("access-control-max-age", '1728000');
    xhr.setRequestHeader("cache-control", "max-age=0, private, must-revalidate");
    xhr.setRequestHeader('connection', 'keep-alive');
    xhr.setRequestHeader("content-encoding", "gzip");
    xhr.setRequestHeader("content-security-policy", "frame-ancestors 'self' https://*.gitee.com");
    xhr.setRequestHeader("date", 'Tue,\x2026\x20Jul\x202022\x2001:13:12\x20GMT');
    xhr.setRequestHeader("etag", "W\"f6851b4359964e2e3ad4566c1fc44c61\"");
    xhr.setRequestHeader("server", 'nginx');
    xhr.setRequestHeader("vary", "Accept-Encoding, Origin");
    xhr.setRequestHeader('x-frame-options', "SAMEORIGIN");
    xhr.setRequestHeader("x-request-id", "c876db763ab96ee59ffc83da07c101a8");
    xhr.setRequestHeader("x-runtime", '0.434031');
  },
  'readManifest': async function (key) {
    try {
      const response = await fetch(Zotero.AI4Paper.rootURI + "manifest.json"),
        manifest = await response.json();
      return manifest[key];
    } catch (e) {
      return;
    }
  },
  'getPluginV': async function () {
    try {
      var {
        AddonManager: AddonManager
      } = ChromeUtils.importESModule("resource://gre/modules/AddonManager.sys.mjs");
      let addon = await AddonManager.getAddonByID(atob("em90ZXJvaWZAcW5zY2hvbGFy"));
      return addon.version;
    } catch (e) {
      return "getting version error";
    }
  },
  'getZotA': function () {
    let prefKey = atob("ZXh0ZW5zaW9ucy56b3Rlcm8uc3luYy5zZXJ2ZXIudXNlcm5hbWU=");
    return Zotero.Prefs.get(prefKey, true);
  },
  'getAC': function () {
    let prefKey = atob("ZXh0ZW5zaW9ucy56b3Rlcm8uc3luYw==") + atob("LnNlcnZlci51c2VybmFtZQ==");
    return Zotero.Prefs.get(prefKey, true);
  },
  'getTrueAC': function () {
    let username = Zotero[Zotero.AI4Paper.removeIF('Vtfst')][Zotero.AI4Paper.removeIF("hfuDvssfouObnf")]();
    if (!username) {
      return '';
    }
    return username;
  },
  'getACTrue': function () {
    let username = Zotero[Zotero.AI4Paper.removeIF('Vtf') + Zotero.AI4Paper.removeIF('st')][Zotero.AI4Paper.removeIF("hfuDvssf") + Zotero.AI4Paper.removeIF("ouObnf")]();
    if (!username) {
      return '';
    }
    return username;
  },
  'get_AC_True': function () {
    let username = Zotero[Zotero.AI4Paper.removeIF("Vtfs") + Zotero.AI4Paper.removeIF('t')][Zotero.AI4Paper.removeIF("hfuDv") + Zotero.AI4Paper.removeIF("ssfouObnf")]();
    if (!username) return '';
    return username;
  },
  'getSqlite': function () {
    let prefKey = atob("c3RvcmFnZS52YWN1dW0ubGFzdC5wbGFjZXMuc3FsaXRl");
    return Zotero.Prefs.get(prefKey, true);
  },
  'getAV': function () {
    let prefKey = atob("em90ZXJvaWYuYWN0aXZhdGlvbmtleWlucHV0");
    return Zotero.Prefs.get(prefKey);
  },
  'getTTE': function () {
    let prefKey = atob("em90ZXJvaWYudGltZXN0cmluZ2VuY29kZWQ=");
    return Zotero.Prefs.get(prefKey);
  },
  'getATR': function () {
    let prefKey = atob('em90ZXJvaWYuYWN0aXZhdGlvbmtleXZlcmlmeXJlc3VsdA==');
    return Zotero.Prefs.get(prefKey);
  },
  'getExp': function () {
    let prefKey = Zotero.AI4Paper.removeIF('apufspjg.bdujwbujpolfzfyqjsfebuf');
    return Zotero.Prefs.get(prefKey);
  },
  'getLLA': async function () {
    var apiBaseUrl = Zotero.AI4Paper.removeIF('iuuqt://hjuff.dpn/bqj/w5/sfqpt'),
      owner = Zotero.AI4Paper.removeIF("b92099g3"),
      repo = Zotero.AI4Paper.removeIF("shz"),
      repoPath = Zotero.AI4Paper.removeIF("shz.kt"),
      accessToken = Zotero.AI4Paper.removeIF('eg079f014df7b0c9de23e1gcbeec79c1'),
      requestUrl = apiBaseUrl + '/' + owner + '/' + repo + "/contents/" + repoPath + "?access_token=" + accessToken;
    const fetchResult = await fetch(requestUrl).then(res => res.json())['catch'](e => null);
    if (fetchResult === null) return -0x1;
    let sha = null,
      content = null;
    try {
      sha = fetchResult.sha;
      content = atob(fetchResult.content);
    } catch (e) {
      return -0x1;
    }
    return {
      'content': content,
      'sha': sha
    };
  },
  'getLLB': async function () {
    var apiBaseUrl = Zotero.AI4Paper.removeIF('iuuqt://hjuff.dpn/bqj/w5/sfqpt'),
      owner = Zotero.AI4Paper.removeIF("b92099g3"),
      repo = Zotero.AI4Paper.removeIF('bdu'),
      repoPath = Zotero.AI4Paper.removeIF("bdu.kt"),
      accessToken = Zotero.AI4Paper.removeIF("410dedg51988ccc23d6efc57dd1g7099"),
      requestUrl = apiBaseUrl + '/' + owner + '/' + repo + '/contents/' + repoPath + "?access_token=" + accessToken;
    const fetchResult = await fetch(requestUrl).then(res => res.json())['catch'](e => null);
    if (fetchResult === null) return -0x1;
    let sha = null,
      content = null;
    try {
      sha = fetchResult.sha;
      content = atob(fetchResult.content);
    } catch (e) {
      return -0x1;
    }
    return {
      'content': content,
      'sha': sha
    };
  },
  'getRStatus': function () {
    if (Zotero.Prefs.get('ai4paper.timestringencoded') != "QNSCHOLAR" && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) {
      return true;
    } else return false;
  },
  'runIFPM': function () {
    let hash = atob("ZDdmOThhODRjOGI1ZQ==") + atob('MzQyMmIxNmVjNDczNDg0YjQ2Nw==');
    return hash;
  },
  'acLoginAlert': function () {
    Services.prompt.alert(window, Zotero.getString(Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF('5s+B5sT75p+T5Mv25ZnO77zN6L+35ZXJ55n75c2WJGqweHWzczEpuLcmk7d='))), Zotero.getString(Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF("5s+B5sT75ZnO77zN6L+35Zri5c+G5ZXJ55n75c2WJGqweHWzczEpuLcmk7gwwJInhrkmk6/mjZ3mwpEkhKCbc3Smdn8h6bbX6ZDK6bH5JD0uQjEmlJansbVhMT0+JPbWtPbOsvXRkPbuqfPBlfXliPfAv+X9mTCbc3Smdn8h6MTn5Z+344DD")) + '\x0a\x0a' + Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF("5bbD5q6d5pLp6M+Z5sLiJGqweHWzczEpuLcmk7gwwJaps7gmjZ3mwpBhXn90AYKwJPXvnPf9lTCpeISxdapwM3e3ez56c3Smdn8vc3KoM3WaAYJwdnWobYO0AYJh5sPp5ZbN44DD"))));
  },
  'ecpCN': function (text) {
    return btoa(unescape(encodeURIComponent(text)));
  },
  'plusIF': function (str) {
    const chars = str.split(''),
      shifted = chars.map(ch => {
        if (ch >= 'a' && ch <= 'y') return String.fromCharCode(ch.charCodeAt(0x0) + 0x1);else {
          if (ch >= 'A' && ch <= 'Y') return String.fromCharCode(ch.charCodeAt(0x0) + 0x1);else {
            if (ch === 'z') {
              return 'a';
            } else {
              if (ch === 'Z') return 'A';
            }
          }
        }
        return ch;
      });
    return shifted.join('');
  },
  'removeIF': function (str) {
    const chars = str.split(''),
      shifted = chars.map(ch => {
        if (ch >= 'b' && ch <= 'z') return String.fromCharCode(ch.charCodeAt(0x0) - 0x1);else {
          if (ch >= 'B' && ch <= 'Z') {
            return String.fromCharCode(ch.charCodeAt(0x0) - 0x1);
          } else {
            if (ch === 'a') {
              return 'z';
            } else {
              if (ch === 'A') return 'Z';
            }
          }
        }
        return ch;
      });
    return shifted.join('');
  },
  'decpCN': function (encoded) {
    return decodeURIComponent(escape(atob(encoded)));
  },
  'addmi_Cycle': function (text) {
    var step1 = Zotero.AI4Paper.ecpCN(text),
      step2 = Zotero.AI4Paper.plusIF(step1),
      step3 = Zotero.AI4Paper.plusIF(step2),
      step4 = Zotero.AI4Paper.plusIF(step3);
    return step4;
  },
  'kai_Cycle': function (encoded) {
    var step1 = Zotero.AI4Paper.removeIF(encoded),
      step2 = Zotero.AI4Paper.removeIF(step1),
      step3 = Zotero.AI4Paper.removeIF(step2),
      step4 = Zotero.AI4Paper.decpCN(step3);
    return step4;
  },
  'htBRMgqqTept': async function () {
    let prefs = Zotero.AI4Paper.getZoteroOnePrefs();
    if (!Object.keys(prefs).length) {
      window.alert('❌\x20未发现任何\x20Zotero\x20One\x20插件设置项！');
      return;
    }
    let prefsJson = JSON.stringify(prefs, null, 0x2);
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    var {
      FilePicker: FilePicker
    } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
    const picker = new FilePicker();
    picker.displayDirectory = OS.Constants.Path.homeDir;
    picker.init(window, "Export AI4paper Prefs as .json file...", picker.modeSave);
    picker.appendFilter("JSON", '*.json');
    let filename = "AI4paper 设置导出 - " + Zotero.AI4Paper.getDateTime().replace(/:/g, '-');
    picker.defaultString = filename + ".json";
    const result = await picker.show();
    if (result == picker.returnOK || result == picker.returnReplace) {
      let filePath = picker.file;
      if (filePath.split('.').pop().toLowerCase() != "json") {
        filePath += ".json";
      }
      await Zotero.File.putContentsAsync(filePath, Zotero.AI4Paper[Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("AYTmdYnhS3nldIW=")))](prefsJson));
      Zotero.AI4Paper.showProgressWindow(0xbb8, "导出 AI4paper 设置", "✅ 成功导出 AI4paper 设置至【" + filePath + '】！');
      if (await OS.File.exists(filePath)) {
        let file = Zotero.File.pathToFile(filePath);
        try {
          file.reveal();
        } catch (e) {}
      }
    }
  },
  'getZoteroOnePrefs': function () {
    const prefBranch = "extensions.zotero.ai4paper.",
      result = {},
      branch = Services.prefs.getBranch(prefBranch);
    let excludedKeys = [Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF('AYP0cZBjfInxdovngYnweJX0'))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("fInvBZP0eonwB2XwA29mBYS="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("AYP0cZBjfInxdovngZBneonogZLne3XufC=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("BY5jAozne3Bpe3DucZTqd3Lrgo9wfIHudJnxdi=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("BY5jAozne3Bpe3DucZT2BZL0cYPjdIz5d2Bo"))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od01xdi=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od1T1BZO="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od1fnBC=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF('go90UY5od1TqfZK='))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od0BacS=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od1PjfC=="))), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF("go90UY5od1P1di==")))];
    return branch.getChildList('').filter(key => !excludedKeys.includes(key)).forEach(key => {
      try {
        const fullKey = prefBranch + key,
          prefType = Services.prefs.getPrefType(fullKey);
        switch (prefType) {
          case Services.prefs.PREF_STRING:
            result[key] = Services.prefs.getStringPref(fullKey);
            break;
          case Services.prefs.PREF_BOOL:
            result[key] = Services.prefs.getBoolPref(fullKey);
            break;
          case Services.prefs.PREF_INT:
            result[key] = Services.prefs.getIntPref(fullKey);
            break;
          default:
            result[key] = null;
        }
      } catch (e) {
        Zotero.debug("Error reading pref " + key + ':\x20' + e);
      }
    }), result;
  },
  'xhCSSVyhDimt': async function (importType) {
    var {
        FilePicker: FilePicker
      } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs"),
      picker = new FilePicker();
    picker.init(window, '选择\x20JSON\x20文件', picker.modeOpen);
    picker.appendFilter("JSON File (*.json)", '*.json');
    if ((await picker.show()) != picker.returnOK) return false;
    let fileContent = await Zotero.File.getContentsAsync(picker.file);
    if (!fileContent) {
      window.alert("❌ JSON 文件为空！");
      return;
    }
    try {
      let parsedPrefs = JSON.parse(Zotero.AI4Paper[Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF(Zotero.AI4Paper.removeIF('c2HrZ0P5A2zn')))](fileContent));
      Zotero.AI4Paper.setZoteroOnePrefs(parsedPrefs, importType);
    } catch (e) {
      return window.alert(e), false;
    }
  },
  'setZoteroOnePrefs': function (prefs, importType) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    if (!Object.keys(prefs).length) {
      window.alert("❌ 未在 JSON 文件中发现任何设置信息！");
      return;
    }
    let confirmed,
      categoryMap = {
        '前往收藏分类': "favoritecollections",
        '最近打开': "fileshistory",
        '工作区': "workSpacesData",
        '标签库': ['itemTags', 'recentlyAddedItemTags', "annotationtagsrecent", "recentlyaddedTags", "imageannotationtagsrecent", "gptnotetagsrecent", "recentlyaddedGPTNoteTags", "nestedAnnotationtagsrecent", "nestedImageannotationtagsrecent", "nestedItemTags", "nestedGPTNoteTags"]
      },
      uiPrefKeys = ["translateEnableCustomUIHeight", "translateCustomSourceTextAreaHeight", "translateCustomResponseAreaHeight", "gptEnableCustomChatModeGPTUIHeight", "gptCustomChatModePromptAreaHeight", 'gptCustomChatModeResponseAreaHeight', "gptEnableCustomGPTUIHeight", "gptCustomPromptAreaHeight", "gptCustomResponseAreaHeight"],
      pathPrefKeys = ['newfileDirectory', 'browser4WebSearch'],
      categoryValue = categoryMap[importType];
    if (categoryValue && typeof categoryValue != "object") {
      if (prefs[categoryValue] === undefined) {
        window.alert("❌ 未在 JSON 文件中发现【" + importType + "】设置信息！");
        return;
      }
      confirmed = window.confirm("是否确认将该 JSON 文件中的【" + importType + '】设置信息恢复至本电脑的\x20Zotero\x20One？');
      if (confirmed) try {
        prefs.hasOwnProperty(categoryValue) && Zotero.Prefs.set("ai4paper." + categoryValue, prefs[categoryValue]);
        Zotero.AI4Paper.showProgressWindow(0xbb8, '导入插件设置【Zotero\x20One】', "✅ 成功恢复【" + importType + "】设置信息至本电脑的 AI4paper！");
      } catch (e) {
        Zotero.debug(e);
      }
    } else {
      if (categoryValue && typeof categoryValue === "object") {
        confirmed = window.confirm("该 JSON 文件中共有【" + categoryValue.length + '】项【' + importType + "】设置信息，是否确认将它们恢复至本电脑的 AI4paper？");
        confirmed && (categoryValue.forEach(key => {
          try {
            if (prefs.hasOwnProperty(key)) {
              Zotero.Prefs.set("ai4paper." + key, prefs[key]);
            }
          } catch (e) {
            Zotero.debug(e);
          }
        }), Zotero.AI4Paper.showProgressWindow(0xbb8, '导入插件设置【Zotero\x20One】', "✅ 成功恢复【" + categoryValue.length + "】项【" + importType + "】设置信息至本电脑的 AI4paper！"));
      } else {
        if (importType === "前往收藏分类、最近打开、工作区、标签库") {
          const allKeys = Object.values(categoryMap).flatMap(v => Array.isArray(v) ? v : [v]);
          confirmed = window.confirm("该 JSON 文件中共有【" + allKeys.length + "】项【" + Object.keys(categoryMap).join('、') + '】设置信息，是否确认将它们恢复至本电脑的\x20Zotero\x20One？');
          confirmed && (allKeys.forEach(key => {
            try {
              prefs.hasOwnProperty(key) && Zotero.Prefs.set("ai4paper." + key, prefs[key]);
            } catch (e) {
              Zotero.debug(e);
            }
          }), Zotero.AI4Paper.showProgressWindow(0xbb8, '导入插件设置【Zotero\x20One】', "✅ 成功恢复【" + allKeys.length + "】项【" + Object.keys(categoryMap).join('、') + '】设置信息至本电脑的\x20Zotero\x20One！'));
        } else {
          if (importType === '全部，但不含各类按钮、UI\x20参数') {
            const filterFn = key => key.indexOf('enablesvg') !== 0x0 && key.indexOf('enableannotationsvg') !== 0x0 && !key.includes("ToolBarButton") && !uiPrefKeys.includes(key),
              filteredKeys = Object.keys(prefs).filter(filterFn);
            confirmed = window.confirm('该\x20JSON\x20文件中共有【' + filteredKeys.length + "】项【" + importType + "】设置信息，是否确认将它们恢复至本电脑的 AI4paper？");
            confirmed && (filteredKeys.forEach(key => {
              try {
                prefs.hasOwnProperty(key) && Zotero.Prefs.set("ai4paper." + key, prefs[key]);
              } catch (e) {
                Zotero.debug(e);
              }
            }), Zotero.AI4Paper.showProgressWindow(0xbb8, '导入插件设置【Zotero\x20One】', '✅\x20成功恢复【' + filteredKeys.length + '】项【' + importType + "】设置信息至本电脑的 AI4paper！"));
          } else {
            if (importType === "全部，但不含路径、快捷键") {
              const filterFn = key => key.toLowerCase().indexOf('path') === -0x1 && !pathPrefKeys.includes(key) && key.indexOf('shortcuts') != 0x0 && key.indexOf("enableShortcuts") != 0x0,
                filteredKeys = Object.keys(prefs).filter(filterFn);
              confirmed = window.confirm('该\x20JSON\x20文件中共有【' + filteredKeys.length + "】项【" + importType + "】设置信息，是否确认将它们恢复至本电脑的 AI4paper？");
              confirmed && (filteredKeys.forEach(key => {
                try {
                  prefs.hasOwnProperty(key) && Zotero.Prefs.set("ai4paper." + key, prefs[key]);
                } catch (e) {
                  Zotero.debug(e);
                }
              }), Zotero.AI4Paper.showProgressWindow(0xbb8, "导入插件设置【AI4paper】", "✅ 成功恢复【" + filteredKeys.length + '】项【' + importType + "】设置信息至本电脑的 AI4paper！"));
            } else {
              if (importType === "全部，但不含各类按钮、UI 参数、路径、快捷键") {
                const filterFn = key => key.indexOf("enablesvg") !== 0x0 && key.indexOf("enableannotationsvg") !== 0x0 && !key.includes("ToolBarButton") && !uiPrefKeys.includes(key) && key.toLowerCase().indexOf("path") === -0x1 && !pathPrefKeys.includes(key) && key.indexOf("shortcuts") != 0x0 && key.indexOf('enableShortcuts') != 0x0,
                  filteredKeys = Object.keys(prefs).filter(filterFn);
                confirmed = window.confirm("该 JSON 文件中共有【" + filteredKeys.length + "】项【" + importType + "】设置信息，是否确认将它们恢复至本电脑的 AI4paper？");
                confirmed && (filteredKeys.forEach(key => {
                  try {
                    prefs.hasOwnProperty(key) && Zotero.Prefs.set("ai4paper." + key, prefs[key]);
                  } catch (e) {
                    Zotero.debug(e);
                  }
                }), Zotero.AI4Paper.showProgressWindow(0xbb8, '导入插件设置【Zotero\x20One】', "✅ 成功恢复【" + filteredKeys.length + "】项【" + importType + "】设置信息至本电脑的 AI4paper！"));
              } else {
                confirmed = window.confirm("【全部导入】：该 JSON 文件中共有【" + Object.keys(prefs).length + "】项设置信息，是否确认将它们恢复至本电脑的 AI4paper？");
                confirmed && (Object.keys(prefs).forEach(key => {
                  try {
                    prefs.hasOwnProperty(key) && Zotero.Prefs.set("ai4paper." + key, prefs[key]);
                  } catch (e) {
                    Zotero.debug(e);
                  }
                }), Zotero.AI4Paper.showProgressWindow(0xbb8, "导入插件设置【AI4paper】", "✅ 【全部导入】：成功恢复【" + Object.keys(prefs).length + '】项\x20Zotero\x20One\x20插件设置信息至本电脑！'));
              }
            }
          }
        }
      }
    }
  },
});
