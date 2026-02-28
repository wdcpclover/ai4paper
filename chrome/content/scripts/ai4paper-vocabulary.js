// AI4Paper Vocabulary Module - Word book, Eudic sync, pronunciation, vocabulary CRUD and export
Object.assign(Zotero.AI4Paper, {
  'addWordsToEudic': async function (param615, param616, param617) {
    if (!param615) return;
    param615.trim().indexOf('\x20') === -0x1 && (param615 = param615.trim(), !param617 && (param615 = param615.toLowerCase()));
    if (Zotero.Prefs.get('ai4paper.eudicAPIKey') === '') return Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20请配置【欧路词典\x20API】', "请先前往【AI4paper 设置 --> 生词】输入 欧路词典 API-Key！"), -0x1;
    if (Zotero.Prefs.get('ai4paper.eudicCategoryID') === '') return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 请配置【欧路词典 API】", "请先前往【AI4paper 设置 --> 生词 --> 欧路词典 API】输入生词本 ID！输入 0，代表使用默认生词本。"), -0x1;
    var var3175 = Zotero.Prefs.get("ai4paper.eudicAPIKey").trim(),
      var3176 = '0';
    if (!param616) var3176 = Zotero.Prefs.get("ai4paper.eudicCategoryID").trim();else {
      var3176 = param616;
    }
    var var3177 = "https://api.frdic.com/api/open/v1/studylist/words",
      var3178 = {
        'id': var3176,
        'language': 'en',
        'words': [param615]
      };
    let var3179;
    try {
      let var3180 = await Zotero.HTTP.request('POST', var3177, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': var3175
        },
        'body': JSON.stringify(var3178),
        'responseType': 'json'
      });
      var3180.response.message ? (Zotero.AI4Paper.showProgressWindow(0x7d0, '✅【收藏生词至欧路词典】', '【' + param615 + '】：' + var3180.response.message), Zotero.AI4Paper.changeAudioPlayPopupButtonName()) : Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20收藏失败', '👉【' + param615 + "】👈：收藏失败！");
    } catch (_0x2e37b5) {
      window.alert(_0x2e37b5);
    }
  },
  'syncWordsToEudic': async function (param618) {
    if (!param618) return;
    if (param618.trim().indexOf('\x20') === -0x1) {
      param618 = param618.trim().toLowerCase();
    }
    if (Zotero.Prefs.get("ai4paper.eudicAPIKey") === '') {
      return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 请配置【欧路词典 API】", "请先前往【AI4paper 设置 --> 生词】输入 欧路词典 API-Key！"), -0x1;
    }
    if (Zotero.Prefs.get('ai4paper.eudicCategoryID') === '') {
      return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 请配置【欧路词典 API】", "请先前往【AI4paper 设置 --> 生词 --> 欧路词典 API】输入生词本 ID！输入 0，代表使用默认生词本。"), -0x1;
    }
    var var3181 = Zotero.Prefs.get("ai4paper.eudicAPIKey").trim(),
      var3182 = Zotero.Prefs.get("ai4paper.eudicCategoryID").trim(),
      var3183 = "https://api.frdic.com/api/open/v1/studylist/words",
      var3184 = {
        'id': var3182,
        'language': 'en',
        'words': [param618]
      };
    let var3185;
    try {
      let var3186 = await Zotero.HTTP.request("POST", var3183, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': var3181
        },
        'body': JSON.stringify(var3184),
        'responseType': "json"
      });
      !var3186.response.message && Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 【生词同步至欧路词典】失败", "【生词同步至欧路词典】失败，请检查欧路词典 API 或网络连接情况。");
    } catch (_0x56a695) {
      return Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20【生词同步至欧路词典】失败', "【生词同步至欧路词典】失败，请检查欧路词典 API 或网络连接情况。" + _0x56a695), false;
    }
  },
  'modifyEudicWords': function (param619) {
    let var3187 = Zotero.AI4Paper.openDialogByType_modal("modifyEudicWords", param619);
    if (!var3187) {
      return;
    }
    Zotero.AI4Paper.addWordsToEudic(var3187.words, var3187.categoryID, var3187.keepCase);
  },
  'changeAudioPlayPopupButtonName': function () {
    let var3188 = Zotero_Tabs._selectedID;
    var var3189 = Zotero.Reader.getByTabID(var3188);
    if (!var3189) {
      return false;
    }
    var3189._iframeWindow.document.querySelector(".ai4paper-addWordsToEudic-button") && (var3189._iframeWindow.document.querySelector(".ai4paper-addWordsToEudic-button").innerHTML = Zotero.AI4Paper.svg_icon_16px.addWordsToEudicSelectionPopupButton_saved);
  },
  'parseIcibaWebSearch': function (param620) {
    let var3190 = param620.indexOf(",\"symbols\":[{");
    param620 = param620.substring(var3190);
    let var3191 = param620.indexOf("}],");
    param620 = param620.substring(0x0, var3191 + 0x3);
    const var3192 = /,"symbols":(\[\{.*?\}\]),/s,
      var3193 = param620.match(var3192);
    if (var3193) {
      let var3194 = JSON.parse(var3193[0x1]);
      return {
        'symbols': var3194
      };
    } else {
      return Zotero.debug("AI4paper: iciba webpage parse error"), {};
    }
  },
  'pronunciation': async function () {
    Zotero.Prefs.get("ai4paper.wordsaudionoaudioplay") && Zotero.Prefs.set("ai4paper.wordsaudionowindowalert", true);
    let var3195 = Zotero.AI4Paper.getFunMetaTitle(),
      var3196 = window.document.createElementNS("http://www.w3.org/1999/xhtml", "audio"),
      var3197 = 0x1;
    if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '50') var3197 = 0.5;else {
      if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '30') var3197 = 0.3;else {
        if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '10') var3197 = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') var3197 = 0.05;else {
            if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1') {
              var3197 = 0.01;
            }
          }
        }
      }
    }
    var var3198 = Zotero.AI4Paper.getSelectedText().trim();
    if (!var3198) return;
    var3198 = var3198.toLowerCase();
    var3198 = var3198.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    var3198 = var3198.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    var3198 = var3198.replace(/[0-9]/g, '');
    if (!var3198.trim()) return -0x1;
    let var3199 = {};
    try {
      const var3200 = await Zotero.HTTP.request("GET", "https://www.iciba.com/word?w=" + var3198, {
        'responseType': "text"
      });
      var3200?.['status'] !== 0xc8 && Zotero.debug("Request error: " + var3200?.["status"]);
      let var3201 = var3200.response;
      var3201 && (var3199 = Zotero.AI4Paper.parseIcibaWebSearch(var3201));
    } catch (_0x4558da) {
      return window.alert("未查询到该单词！请先联网。"), -0x1;
    }
    let var3202 = null,
      var3203 = null,
      var3204 = null,
      var3205 = null,
      var3206 = null,
      var3207 = null,
      var3208 = [],
      var3209 = '',
      var3210 = '',
      var3211 = [],
      var3212 = '';
    try {
      var3202 = var3199.symbols[0x0].ph_en;
      var3203 = var3199.symbols[0x0].ph_am;
      var3204 = var3199.symbols[0x0].ph_en_mp3;
      var3205 = var3199.symbols[0x0].ph_am_mp3;
      var3206 = var3199.symbols[0x0].ph_tts_mp3;
      var3207 = var3199.symbols[0x0].parts;
      await new Promise(_0x5af2e1 => setTimeout(_0x5af2e1, 0x32));
    } catch (_0x5047ad) {
      return window.alert("查询单词失败！"), -0x1;
    }
    if (var3204.length > 0x0 || var3205.length > 0x0 || var3206.length > 0x0) {
      if (var3195) {
        if (!Zotero.Prefs.get("ai4paper.wordsaudionoaudioplay")) {
          if (Zotero.Prefs.get('ai4paper.wordsaudiopreferpronunciation') === "英式发音") {
            if (var3204.length > 0x0) {
              var3196.setAttribute("src", var3204);
              var3197 != 0x1 && (var3196.volume = var3197);
              var3196.play();
              var3212 = "刚刚播放的是【英式发音】。";
            } else {
              if (var3205.length > 0x0) {
                var3196.setAttribute("src", var3205);
                var3197 != 0x1 && (var3196.volume = var3197);
                var3196.play();
                var3212 = "刚刚播放的是【美式发音】。";
              } else {
                if (var3206.length > 0x0) {
                  var3196.setAttribute("src", var3206);
                  if (var3197 != 0x1) {
                    var3196.volume = var3197;
                  }
                  var3196.play();
                  var3212 = "刚刚播放的是【合成发音】。";
                }
              }
            }
          } else {
            if (Zotero.Prefs.get('ai4paper.wordsaudiopreferpronunciation') === "美式发音") {
              if (var3205.length > 0x0) {
                var3196.setAttribute("src", var3205);
                var3197 != 0x1 && (var3196.volume = var3197);
                var3196.play();
                var3212 = "刚刚播放的是【美式发音】。";
              } else {
                if (var3204.length > 0x0) {
                  var3196.setAttribute("src", var3204);
                  var3197 != 0x1 && (var3196.volume = var3197);
                  var3196.play();
                  var3212 = "刚刚播放的是【英式发音】。";
                } else var3206.length > 0x0 && (var3196.setAttribute('src', var3206), var3197 != 0x1 && (var3196.volume = var3197), var3196.play(), var3212 = "刚刚播放的是【合成发音】。");
              }
            }
          }
        }
      }
      var3202 === '' && (var3202 = '无');
      var3203 === '' && (var3203 = '无');
      var3208.push('👉\x20' + var3198);
      var3210 = "🔉 英  [" + var3202 + ']，美\x20\x20[' + var3203 + ']';
      var3208.push(var3210);
      var3211.push(var3210);
      for (let var3213 = 0x0; var3213 < var3207.length; var3213++) {
        var3209 = "✔︎ " + var3207[var3213].part + '\x20\x20' + var3207[var3213].means.join(',');
        var3208.push(var3209);
        var3211.push(var3209);
      }
      var3208.push('\x0a');
      var3208.push("📌 " + var3212 + '输入\x201\x20或\x202\x20或\x203，分别播放英式、或美式、或合成发音；输入\x204\x20可重复播放发音三遍。');
      var3209 = var3208.join('\x0a');
      if (!Zotero.Prefs.get("ai4paper.wordsaudionoprogresswindow")) {
        let var3214 = Zotero.Prefs.get("ai4paper.wordsaudioprogresswindowtime");
        var3214 === '20' && (var3214 = 0x4e20);
        if (var3214 === '15') {
          var3214 = 0x3a98;
        }
        var3214 === '10' && (var3214 = 0x2710);
        var3214 === '5' && (var3214 = 0x1388);
        var3214 === '2' ? var3214 = 0x7d0 : var3214 = 0x1388;
        Zotero.AI4Paper.showProgressWindow(var3214, "【查词与发音】：" + var3198, '' + var3211.join('\x0a'), "iciba");
      }
      if (!Zotero.Prefs.get("ai4paper.wordsaudionowindowalert")) {
        if (var3212 === "刚刚播放的是【英式发音】。") var var3215 = window.prompt(var3209, '2');else {
          if (var3212 === "刚刚播放的是【美式发音】。") {
            var var3215 = window.prompt(var3209, '1');
          } else {
            if (var3212 === '刚刚播放的是【合成发音】。') var var3215 = window.prompt(var3209, '3');else var var3215 = window.prompt(var3209, '2');
          }
        }
        if (var3215 === '1' && var3204.length > 0x0) {
          var3196.setAttribute("src", var3204);
          var3197 != 0x1 && (var3196.volume = var3197);
          var3196.play();
        } else {
          if (var3215 === '2' && var3205.length > 0x0) {
            var3196.setAttribute("src", var3205);
            var3197 != 0x1 && (var3196.volume = var3197);
            var3196.play();
          } else {
            if (var3215 === '3' && var3206.length > 0x0) {
              var3196.setAttribute('src', var3206);
              var3197 != 0x1 && (var3196.volume = var3197);
              var3196.play();
            } else {
              if (var3215 === '4' && var3204.length > 0x0) {
                for (let var3216 = 0x0; var3216 < 0x3; var3216++) {
                  var3196.setAttribute("src", var3204);
                  var3197 != 0x1 && (var3196.volume = var3197);
                  var3196.play();
                  await new Promise(_0x6753d6 => setTimeout(_0x6753d6, 0x7d0));
                }
              } else {
                if (var3215 === '4' && var3205.length > 0x0) {
                  for (let var3217 = 0x0; var3217 < 0x3; var3217++) {
                    var3196.setAttribute('src', var3205);
                    var3197 != 0x1 && (var3196.volume = var3197);
                    var3196.play();
                    await new Promise(_0x3f5fb5 => setTimeout(_0x3f5fb5, 0x7d0));
                  }
                } else {
                  if (var3215 === '4' && var3206.length > 0x0) for (let var3218 = 0x0; var3218 < 0x3; var3218++) {
                    var3196.setAttribute('src', var3206);
                    if (var3197 != 0x1) {
                      var3196.volume = var3197;
                    }
                    var3196.play();
                    await new Promise(_0x36cefe => setTimeout(_0x36cefe, 0x7d0));
                  } else {
                    if (var3215 === '1' && var3204.length === 0x0) window.alert("未查询到英式发音！");else var3215 === '2' && var3205.length === 0x0 && window.alert("未查询到美式发音！");
                  }
                }
              }
            }
          }
        }
      }
    } else {
      return Zotero.AI4Paper.CheckPDFReader() && window.alert("未查询到该单词！"), -0x1;
    }
  },
  'vocabularySearchAnnotationTrans': async function (param621) {
    let var3219 = 0x1;
    if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '50') var3219 = 0.5;else {
      if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '30') var3219 = 0.3;else {
        if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '10') var3219 = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') var3219 = 0.05;else Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1' && (var3219 = 0.01);
        }
      }
    }
    var var3220 = param621.trim();
    var3220 = var3220.toLowerCase();
    var3220 = var3220.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    var3220 = var3220.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    var3220 = var3220.replace(/[0-9]/g, '');
    if (!var3220.trim()) return -0x1;
    let var3221 = {};
    try {
      const var3222 = await Zotero.HTTP.request("GET", "https://www.iciba.com/word?w=" + var3220, {
        'responseType': "text"
      });
      var3222?.["status"] !== 0xc8 && Zotero.debug("Request error: " + var3222?.['status']);
      let var3223 = var3222.response;
      var3223 && (var3221 = Zotero.AI4Paper.parseIcibaWebSearch(var3223));
    } catch (_0x3cee34) {
      return -0x1;
    }
    let var3224 = null,
      var3225 = null,
      var3226 = null,
      var3227 = null,
      var3228 = null,
      var3229 = null,
      var3230 = [],
      var3231 = '',
      var3232 = '',
      var3233 = '';
    try {
      var3224 = var3221.symbols[0x0].ph_en;
      var3225 = var3221.symbols[0x0].ph_am;
      var3226 = var3221.symbols[0x0].ph_en_mp3;
      var3227 = var3221.symbols[0x0].ph_am_mp3;
      var3228 = var3221.symbols[0x0].ph_tts_mp3;
      var3229 = var3221.symbols[0x0].parts;
      await new Promise(_0x127807 => setTimeout(_0x127807, 0x32));
    } catch (_0x4c2346) {
      return -0x1;
    }
    if (var3226.length > 0x0 || var3227.length > 0x0 || var3228.length > 0x0) {
      var3224 === '' && (var3224 = '无');
      if (var3225 === '') {
        var3225 = '无';
      }
      var3232 = '🔉\x20英\x20\x20[' + var3224 + "]，🔉 美  [" + var3225 + ']\x0a';
      var3230.push(var3232);
      for (let var3234 = 0x0; var3234 < var3229.length; var3234++) {
        if (var3234 < var3229.length - 0x1) {
          var3231 = var3229[var3234].part + '\x20\x20' + var3229[var3234].means.join(',') + '\x0a';
        } else var3231 = var3229[var3234].part + '\x20\x20' + var3229[var3234].means.join(',');
        var3230.push(var3231);
      }
      return var3231 = var3230.join('\x20\x20'), var3231;
    } else return -0x1;
  },
  'vocabularySearchTrans': async function (param622) {
    let var3235 = window.document.createElementNS("http://www.w3.org/1999/xhtml", 'audio'),
      var3236 = 0x1;
    if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '50') var3236 = 0.5;else {
      if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '30') {
        var3236 = 0.3;
      } else {
        if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '10') var3236 = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') {
            var3236 = 0.05;
          } else Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1' && (var3236 = 0.01);
        }
      }
    }
    var var3237 = param622.trim();
    var3237 = var3237.toLowerCase();
    var3237 = var3237.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    var3237 = var3237.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    var3237 = var3237.replace(/[0-9]/g, '');
    if (!var3237.trim()) return -0x1;
    let var3238 = {};
    try {
      const _0x22cd00 = await Zotero.HTTP.request("GET", "https://www.iciba.com/word?w=" + var3237, {
        'responseType': "text"
      });
      _0x22cd00?.["status"] !== 0xc8 && Zotero.debug("Request error: " + _0x22cd00?.['status']);
      let _0x572521 = _0x22cd00.response;
      _0x572521 && (var3238 = Zotero.AI4Paper.parseIcibaWebSearch(_0x572521));
    } catch (_0x1f8b61) {
      return Zotero.AI4Paper.showProgressWindow(0x5dc, "❌【金山词霸】自动查词", "未查询到该单词！请先联网。"), Zotero.AI4Paper.updateTranslationPopupTextArea("❌【金山词霸】自动查词", "未查询到该单词！请先联网。"), -0x1;
    }
    let var3241 = null,
      var3242 = null,
      var3243 = null,
      var3244 = null,
      var3245 = null,
      var3246 = null,
      var3247 = [],
      var3248 = '',
      var3249 = '',
      var3250 = '';
    try {
      var3241 = var3238.symbols[0x0].ph_en;
      var3242 = var3238.symbols[0x0].ph_am;
      var3243 = var3238.symbols[0x0].ph_en_mp3;
      var3244 = var3238.symbols[0x0].ph_am_mp3;
      var3245 = var3238.symbols[0x0].ph_tts_mp3;
      var3246 = var3238.symbols[0x0].parts;
      await new Promise(_0x1337c8 => setTimeout(_0x1337c8, 0x32));
    } catch (_0x2269ae) {
      return -0x1;
    }
    if (var3243.length > 0x0 || var3244.length > 0x0 || var3245.length > 0x0) {
      if (Zotero.Prefs.get("ai4paper.translationvocabularyaudioplay")) {
        if (Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === '英式发音') {
          if (var3243.length > 0x0) {
            var3235.setAttribute("src", var3243);
            var3236 != 0x1 && (var3235.volume = var3236);
            var3235.play();
          } else {
            if (var3244.length > 0x0) {
              var3235.setAttribute("src", var3244);
              var3236 != 0x1 && (var3235.volume = var3236);
              var3235.play();
            } else var3245.length > 0x0 && (var3235.setAttribute("src", var3245), var3236 != 0x1 && (var3235.volume = var3236), var3235.play());
          }
        } else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === "美式发音") {
            if (var3244.length > 0x0) {
              var3235.setAttribute("src", var3244);
              var3236 != 0x1 && (var3235.volume = var3236);
              var3235.play();
            } else {
              if (var3243.length > 0x0) {
                var3235.setAttribute('src', var3243);
                var3236 != 0x1 && (var3235.volume = var3236);
                var3235.play();
              } else {
                if (var3245.length > 0x0) {
                  var3235.setAttribute("src", var3245);
                  if (var3236 != 0x1) {
                    var3235.volume = var3236;
                  }
                  var3235.play();
                }
              }
            }
          }
        }
      }
      var3241 === '' && (var3241 = '无');
      var3242 === '' && (var3242 = '无');
      var3249 = "🔉 英  [" + var3241 + "]<br>🔉 美  [" + var3242 + "]<br>";
      var3247.push(var3249);
      for (let var3251 = 0x0; var3251 < var3246.length; var3251++) {
        if (var3251 < var3246.length - 0x1) var3248 = var3246[var3251].part + '\x20\x20' + var3246[var3251].means.join(',') + '<br>';else {
          var3248 = var3246[var3251].part + '\x20\x20' + var3246[var3251].means.join(',');
        }
        var3247.push(var3248);
      }
      return var3248 = var3247.join(''), var3248;
    } else return -0x1;
  },
  'translateSidePaneVocabulary': async function (param623) {
    if (!param623) return -0x1;
    let var3252 = 0x1;
    if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '50') var3252 = 0.5;else {
      if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '30') var3252 = 0.3;else {
        if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '10') var3252 = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') var3252 = 0.05;else Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '1' && (var3252 = 0.01);
        }
      }
    }
    var var3253 = param623.trim();
    var3253 = var3253.toLowerCase();
    var3253 = var3253.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    var3253 = var3253.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    var3253 = var3253.replace(/[0-9]/g, '');
    if (!var3253.trim()) return -0x1;
    let var3254 = {};
    try {
      const var3255 = await Zotero.HTTP.request('GET', "https://www.iciba.com/word?w=" + var3253, {
        'responseType': 'text'
      });
      var3255?.["status"] !== 0xc8 && Zotero.debug('Request\x20error:\x20' + var3255?.["status"]);
      let var3256 = var3255.response;
      var3256 && (var3254 = Zotero.AI4Paper.parseIcibaWebSearch(var3256));
    } catch (_0x2a0516) {
      return Zotero.AI4Paper.showProgressWindow(0x5dc, "❌【金山词霸】自动查词", "未查询到该单词！请先联网。"), -0x1;
    }
    let var3257 = null,
      var3258 = null,
      var3259 = null,
      var3260 = null,
      var3261 = null,
      var3262 = null,
      var3263 = [],
      var3264 = '',
      var3265 = '',
      var3266 = '';
    try {
      var3257 = var3254.symbols[0x0].ph_en;
      var3258 = var3254.symbols[0x0].ph_am;
      var3259 = var3254.symbols[0x0].ph_en_mp3;
      var3260 = var3254.symbols[0x0].ph_am_mp3;
      var3261 = var3254.symbols[0x0].ph_tts_mp3;
      var3262 = var3254.symbols[0x0].parts;
      await new Promise(_0x4c28a5 => setTimeout(_0x4c28a5, 0x32));
    } catch (_0x14eee9) {
      return -0x1;
    }
    if (var3259.length > 0x0 || var3260.length > 0x0 || var3261.length > 0x0) {
      if (var3257 === '') {
        var3257 = '无';
      }
      var3258 === '' && (var3258 = '无');
      var3265 = "🔉 英  [" + var3257 + "]\n🔉 美  [" + var3258 + ']\x0a';
      var3263.push(var3265);
      for (let var3267 = 0x0; var3267 < var3262.length; var3267++) {
        var3267 < var3262.length - 0x1 ? var3264 = var3262[var3267].part + '\x20\x20' + var3262[var3267].means.join(',') + '\x0a' : var3264 = var3262[var3267].part + '\x20\x20' + var3262[var3267].means.join(',');
        var3263.push(var3264);
      }
      var3264 = var3263.join('');
      Zotero.AI4Paper.translateResponse = var3264;
      Zotero.AI4Paper.updateTranslateReaderSidePane();
      if (var3253 != Zotero.Prefs.get("ai4paper.selectedtexttrans")) {
        Zotero.Prefs.set("ai4paper.selectedtexttrans", var3253);
        if (Zotero.Prefs.get("ai4paper.translationviewerenable")) {
          await Zotero.AI4Paper.updateTransViewerVocabulary(var3253, var3264);
        }
      }
      return var3264;
    } else {
      return -0x1;
    }
  },
  'translateSidePaneAudioPlay': async function (param624) {
    if (!param624) return -0x1;
    let var3268 = window.document.createElementNS('http://www.w3.org/1999/xhtml', "audio"),
      var3269 = 0x1;
    if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '50') {
      var3269 = 0.5;
    } else {
      if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '30') var3269 = 0.3;else {
        if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '10') var3269 = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') var3269 = 0.05;else Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1' && (var3269 = 0.01);
        }
      }
    }
    var var3270 = param624.trim();
    var3270 = var3270.toLowerCase();
    var3270 = var3270.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    var3270 = var3270.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    var3270 = var3270.replace(/[0-9]/g, '');
    if (!var3270.trim()) return -0x1;
    let var3271 = {};
    try {
      const var3272 = await Zotero.HTTP.request('GET', "https://www.iciba.com/word?w=" + var3270, {
        'responseType': "text"
      });
      var3272?.["status"] !== 0xc8 && Zotero.debug("Request error: " + var3272?.['status']);
      let var3273 = var3272.response;
      var3273 && (var3271 = Zotero.AI4Paper.parseIcibaWebSearch(var3273));
    } catch (_0x36529b) {
      return Zotero.AI4Paper.showProgressWindow(0x5dc, '❌【金山词霸】查词与发音', "未查询到该单词！请先联网。"), -0x1;
    }
    let var3274 = null,
      var3275 = null,
      var3276 = null,
      var3277 = null,
      var3278 = null,
      var3279 = null,
      var3280 = [],
      var3281 = '',
      var3282 = '',
      var3283 = '';
    try {
      var3274 = var3271.symbols[0x0].ph_en;
      var3275 = var3271.symbols[0x0].ph_am;
      var3276 = var3271.symbols[0x0].ph_en_mp3;
      var3277 = var3271.symbols[0x0].ph_am_mp3;
      var3278 = var3271.symbols[0x0].ph_tts_mp3;
      var3279 = var3271.symbols[0x0].parts;
      await new Promise(_0x50b626 => setTimeout(_0x50b626, 0x32));
    } catch (_0x23e8b2) {
      return -0x1;
    }
    if (var3276.length > 0x0 || var3277.length > 0x0 || var3278.length > 0x0) {
      if (Zotero.AI4Paper.getFunMetaTitle()) {
        if (Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === "英式发音") {
          if (var3276.length > 0x0) {
            var3268.setAttribute('src', var3276);
            var3269 != 0x1 && (var3268.volume = var3269);
            var3268.play();
          } else {
            if (var3277.length > 0x0) {
              var3268.setAttribute("src", var3277);
              var3269 != 0x1 && (var3268.volume = var3269);
              var3268.play();
            } else {
              if (var3278.length > 0x0) {
                var3268.setAttribute("src", var3278);
                var3269 != 0x1 && (var3268.volume = var3269);
                var3268.play();
              }
            }
          }
        } else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === "美式发音") {
            if (var3277.length > 0x0) {
              var3268.setAttribute("src", var3277);
              var3269 != 0x1 && (var3268.volume = var3269);
              var3268.play();
            } else {
              if (var3276.length > 0x0) {
                var3268.setAttribute("src", var3276);
                var3269 != 0x1 && (var3268.volume = var3269);
                var3268.play();
              } else var3278.length > 0x0 && (var3268.setAttribute('src', var3278), var3269 != 0x1 && (var3268.volume = var3269), var3268.play());
            }
          }
        }
      }
      var3274 === '' && (var3274 = '无');
      var3275 === '' && (var3275 = '无');
      var3282 = "🔉 英  [" + var3274 + "]\n🔉 美  [" + var3275 + ']\x0a';
      var3280.push(var3282);
      for (let var3284 = 0x0; var3284 < var3279.length; var3284++) {
        var3284 < var3279.length - 0x1 ? var3281 = var3279[var3284].part + '\x20\x20' + var3279[var3284].means.join(',') + '\x0a' : var3281 = var3279[var3284].part + '\x20\x20' + var3279[var3284].means.join(',');
        var3280.push(var3281);
      }
      return var3281 = var3280.join(''), Zotero.AI4Paper.translateResponse = var3281, Zotero.AI4Paper.updateTranslateReaderSidePane(), var3281;
    } else return Zotero.AI4Paper.showProgressWindow(0x5dc, '❌【金山词霸】查词与发音', "哎呀，数据库中未查询到该单词！"), -0x1;
  },
  'selectionPopupButtonAudioPlay': async function (param625, param626) {
    if (!param625) return -0x1;
    let var3285 = window.document.createElementNS("http://www.w3.org/1999/xhtml", "audio"),
      var3286 = 0x1;
    if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '50') var3286 = 0.5;else {
      if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '30') var3286 = 0.3;else {
        if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '10') var3286 = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') var3286 = 0.05;else Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1' && (var3286 = 0.01);
        }
      }
    }
    var var3287 = param625.trim();
    var3287 = var3287.toLowerCase();
    var3287 = var3287.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    var3287 = var3287.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    var3287 = var3287.replace(/[0-9]/g, '');
    if (!var3287.trim()) return -0x1;
    let var3288 = {};
    try {
      const var3289 = await Zotero.HTTP.request("GET", 'https://www.iciba.com/word?w=' + var3287, {
        'responseType': "text"
      });
      var3289?.['status'] !== 0xc8 && Zotero.debug("Request error: " + var3289?.["status"]);
      let var3290 = var3289.response;
      if (var3290) {
        var3288 = Zotero.AI4Paper.parseIcibaWebSearch(var3290);
      }
    } catch (_0x28c013) {
      return Zotero.AI4Paper.showProgressWindow(0x5dc, '❌【金山词霸】查词与发音', "未查询到该单词！请先联网。"), -0x1;
    }
    let var3291 = null,
      var3292 = null,
      var3293 = null,
      var3294 = null,
      var3295 = null,
      var3296 = null,
      var3297 = [],
      var3298 = '',
      var3299 = '',
      var3300 = '';
    try {
      var3291 = var3288.symbols[0x0].ph_en;
      var3292 = var3288.symbols[0x0].ph_am;
      var3293 = var3288.symbols[0x0].ph_en_mp3;
      var3294 = var3288.symbols[0x0].ph_am_mp3;
      var3295 = var3288.symbols[0x0].ph_tts_mp3;
      var3296 = var3288.symbols[0x0].parts;
      await new Promise(_0x2ebd7f => setTimeout(_0x2ebd7f, 0x32));
    } catch (_0xe19da5) {
      return -0x1;
    }
    if (var3293.length > 0x0 || var3294.length > 0x0 || var3295.length > 0x0) {
      if (Zotero.AI4Paper.getFunMetaTitle()) {
        if (param626 === '英式发音') {
          if (var3293.length > 0x0) {
            var3285.setAttribute('src', var3293);
            var3286 != 0x1 && (var3285.volume = var3286);
            var3285.play();
          } else {
            if (var3294.length > 0x0) {
              var3285.setAttribute("src", var3294);
              if (var3286 != 0x1) {
                var3285.volume = var3286;
              }
              var3285.play();
            } else {
              if (var3295.length > 0x0) {
                var3285.setAttribute("src", var3295);
                if (var3286 != 0x1) {
                  var3285.volume = var3286;
                }
                var3285.play();
              }
            }
          }
        } else {
          if (param626 === '美式发音') {
            if (var3294.length > 0x0) {
              var3285.setAttribute("src", var3294);
              var3286 != 0x1 && (var3285.volume = var3286);
              var3285.play();
            } else {
              if (var3293.length > 0x0) {
                var3285.setAttribute("src", var3293);
                var3286 != 0x1 && (var3285.volume = var3286);
                var3285.play();
              } else {
                if (var3295.length > 0x0) {
                  var3285.setAttribute("src", var3295);
                  if (var3286 != 0x1) {
                    var3285.volume = var3286;
                  }
                  var3285.play();
                }
              }
            }
          }
        }
      }
      var3291 === '' && (var3291 = '无');
      var3292 === '' && (var3292 = '无');
      var3299 = "🔉 英  [" + var3291 + "]\n🔉 美  [" + var3292 + ']\x0a';
      var3297.push(var3299);
      for (let var3301 = 0x0; var3301 < var3296.length; var3301++) {
        if (var3301 < var3296.length - 0x1) var3298 = var3296[var3301].part + '\x20\x20' + var3296[var3301].means.join(',') + '\x0a';else {
          var3298 = var3296[var3301].part + '\x20\x20' + var3296[var3301].means.join(',');
        }
        var3297.push(var3298);
      }
      return var3298 = var3297.join(''), Zotero.AI4Paper.translateResponse = var3298, Zotero.AI4Paper.updateTranslateReaderSidePane(), var3298;
    } else return Zotero.AI4Paper.showProgressWindow(0x5dc, "❌【金山词霸】查词与发音", "哎呀，数据库中未查询到该单词！"), -0x1;
  },
  'annotationAudioPlay': async function (param627) {
    if (!param627) return window.alert("当前注释为空！"), -0x1;
    let var3302 = window.document.createElementNS("http://www.w3.org/1999/xhtml", "audio"),
      var3303 = 0x1;
    if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '50') var3303 = 0.5;else {
      if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '30') {
        var3303 = 0.3;
      } else {
        if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '10') var3303 = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') var3303 = 0.05;else Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1' && (var3303 = 0.01);
        }
      }
    }
    var var3304 = param627.trim();
    var3304 = var3304.toLowerCase();
    var3304 = var3304.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    var3304 = var3304.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    var3304 = var3304.replace(/[0-9]/g, '');
    if (!var3304.trim()) return -0x1;
    let var3305 = {};
    try {
      const var3306 = await Zotero.HTTP.request("GET", "https://www.iciba.com/word?w=" + var3304, {
        'responseType': "text"
      });
      var3306?.["status"] !== 0xc8 && Zotero.debug("Request error: " + var3306?.["status"]);
      let var3307 = var3306.response;
      var3307 && (var3305 = Zotero.AI4Paper.parseIcibaWebSearch(var3307));
    } catch (_0xfd413f) {
      return Zotero.AI4Paper.showProgressWindow(0x5dc, '❌【金山词霸】自动查词', "未查询到该单词！请先联网。"), -0x1;
    }
    let var3308 = null,
      var3309 = null,
      var3310 = null,
      var3311 = null,
      var3312 = null,
      var3313 = null,
      var3314 = [],
      var3315 = [],
      var3316 = '',
      var3317 = '',
      var3318 = '',
      var3319 = '',
      var3320 = '';
    try {
      var3308 = var3305.symbols[0x0].ph_en;
      var3309 = var3305.symbols[0x0].ph_am;
      var3310 = var3305.symbols[0x0].ph_en_mp3;
      var3311 = var3305.symbols[0x0].ph_am_mp3;
      var3312 = var3305.symbols[0x0].ph_tts_mp3;
      var3313 = var3305.symbols[0x0].parts;
      await new Promise(_0x5be040 => setTimeout(_0x5be040, 0x32));
    } catch (_0x3d70b9) {
      return -0x1;
    }
    if (var3310.length > 0x0 || var3311.length > 0x0 || var3312.length > 0x0) {
      if (Zotero.AI4Paper.getFunMetaTitle()) {
        if (Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === '英式发音') {
          if (var3310.length > 0x0) {
            var3302.setAttribute("src", var3310);
            if (var3303 != 0x1) {
              var3302.volume = var3303;
            }
            var3302.play();
          } else {
            if (var3311.length > 0x0) {
              var3302.setAttribute('src', var3311);
              var3303 != 0x1 && (var3302.volume = var3303);
              var3302.play();
            } else {
              if (var3312.length > 0x0) {
                var3302.setAttribute("src", var3312);
                var3303 != 0x1 && (var3302.volume = var3303);
                var3302.play();
              }
            }
          }
        } else {
          if (Zotero.Prefs.get('ai4paper.wordsaudiopreferpronunciation') === "美式发音") {
            if (var3311.length > 0x0) {
              var3302.setAttribute("src", var3311);
              var3303 != 0x1 && (var3302.volume = var3303);
              var3302.play();
            } else {
              if (var3310.length > 0x0) {
                var3302.setAttribute("src", var3310);
                if (var3303 != 0x1) {
                  var3302.volume = var3303;
                }
                var3302.play();
              } else {
                if (var3312.length > 0x0) {
                  var3302.setAttribute("src", var3312);
                  if (var3303 != 0x1) {
                    var3302.volume = var3303;
                  }
                  var3302.play();
                }
              }
            }
          }
        }
      }
      var3308 === '' && (var3308 = '无');
      var3309 === '' && (var3309 = '无');
      var3318 = "🔉 英  [" + var3308 + "]，美  [" + var3309 + ']';
      var3314.push(var3318);
      var3319 = "🔉 英  [" + var3308 + "]\n🔉 美  [" + var3309 + ']\x0a';
      var3315.push(var3319);
      for (let var3321 = 0x0; var3321 < var3313.length; var3321++) {
        var3316 = "✔︎ " + var3313[var3321].part + '\x20\x20' + var3313[var3321].means.join(',');
        var3314.push(var3316);
        var3321 < var3313.length - 0x1 ? var3317 = var3313[var3321].part + '\x20\x20' + var3313[var3321].means.join(',') + '\x0a' : var3317 = var3313[var3321].part + '\x20\x20' + var3313[var3321].means.join(',');
        var3315.push(var3317);
      }
      return var3316 = var3314.join('\x20\x20'), var3317 = var3315.join(''), Zotero.Prefs.get("ai4paper.translationreadersidepane") && (Zotero.AI4Paper.translateSourceText = var3304, Zotero.AI4Paper.translateResponse = var3317, Zotero.AI4Paper.updateTranslateReaderSidePane()), Zotero.AI4Paper.showProgressWindow(0x7d0, "✅ 播发单词发音 【AI4paper】", '' + var3316), var3304 != Zotero.Prefs.get("ai4paper.selectedtexttrans") && (Zotero.Prefs.set("ai4paper.selectedtexttrans", var3304), Zotero.Prefs.get("ai4paper.translationviewerenable") && (await Zotero.AI4Paper.updateTransViewerVocabulary(var3304, var3316))), var3316;
    } else return window.alert('哎呀，数据库中未查询到该单词！'), -0x1;
  },
  'addVocabulary': async function (param628, param629) {
    var var3322 = Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != var3322) return -0x1;
    var var3323 = 0x0;
    if (param629.trim().indexOf('\x20') === -0x1) {
      let _0x3dbbd6 = param629.trim();
      param629 = param629.trim().toLowerCase();
      param629 = param629.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
      param629 = param629.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
      param629 = param629.replace(/[0-9]/g, '');
      let _0x23bafa = new Zotero.Search();
      _0x23bafa.libraryID = Zotero.Libraries.userLibraryID;
      _0x23bafa.addCondition("itemType", 'is', 'note');
      _0x23bafa.addCondition("tag", 'is', "/生词本");
      let _0x41ead0 = await _0x23bafa.search(),
        _0x4b7b8b = await Zotero.Items.getAsync(_0x41ead0);
      if (_0x4b7b8b.length != 0x0) {
        let _0xc2aeb = _0x4b7b8b[0x0],
          _0x5dff29 = _0xc2aeb.getNote();
        if (_0x5dff29.indexOf(param628.key) != -0x1) {
          return false;
        }
        _0x5dff29.indexOf('>' + param629 + "</a>") != -0x1 && (Zotero.AI4Paper.showProgressWindow(0x4e20, "❌【重复收藏】", "生词本已存在该生词！无须重复收藏。", 'vocabulary'), var3323 = 0x1);
      }
      let _0x3aada1 = await Zotero.AI4Paper.vocabularySearch(param629);
      if (_0x3aada1 && _0x3aada1 != -0x1) {
        return param628.annotationComment = _0x3aada1, Zotero.Prefs.get("ai4paper.vocabularyautoaddtags") && param628.addTag("生词/单词"), await param628.saveTx(), !var3323 ? (Zotero.AI4Paper.showProgressWindow(0x1388, "【收藏生词】", param629 + '：' + _0x3aada1, "vocabulary"), Zotero.AI4Paper.addVocabulary2Note(param628, param629, _0x3aada1)) : param628.annotationComment = '【已收藏】' + _0x3aada1, await param628.saveTx(), Zotero.Prefs.get('ai4paper.vocabularyAutoSync2Eudic') && (await Zotero.AI4Paper.syncWordsToEudic(_0x3dbbd6)), true;
      }
    }
    await Zotero.AI4Paper.translationEngineTask(param629, 'vocabulary', param628);
    Zotero.Prefs.get("ai4paper.vocabularyAutoSync2Eudic") && !Zotero.Prefs.get("ai4paper.vocabularyAutoSync2EudicOnlyWords") && (await Zotero.AI4Paper.syncWordsToEudic(param629.trim()));
  },
  'addVocabulary2Note': async function (param630, param631, param632) {
    param631.indexOf('\x20') === -0x1 && (param631 = param631.trim(), param631 = param631.toLowerCase(), param631 = param631.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, ''), param631 = param631.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, ''), param631 = param631.replace(/[0-9]/g, ''));
    var var3331 = await Zotero.AI4Paper.createNoteItem_basedOnTag(param630, "/生词");
    if (var3331) {
      let var3332 = var3331.getNote(),
        var3333 = JSON.parse(param630.annotationPosition).pageIndex + 0x1,
        var3334 = Zotero.AI4Paper.getAnnotationItemLink(param630),
        var3335 = '<a\x20href=\x22' + var3334 + '\x22>' + param631 + '</a>';
      if (var3332.indexOf(param630.key) != -0x1 || var3332.indexOf('>' + param631 + '</a>') != -0x1) return false;
      if (var3332.indexOf('</h2>') != -0x1) {
        let _0x4c9627 = var3332.indexOf("</h2>");
        var3332 = await var3332.substring(_0x4c9627 + 0x8);
      }
      let var3337 = "<h2 style=\"color: purple;\">📙 生词>>>>>>></h2><p>" + var3335 + ':\x20' + (!Zotero.Prefs.get('ai4paper.vocabularyinlinecodestyle') ? param632 : "<code> " + param632 + '</code>') + "<p>" + var3332;
      var3337 = var3337.replace(/<p>>/, "<p>");
      var3331.setNote(var3337);
      await Zotero.AI4Paper.add2VocabularyBook(param630, param631, param632);
      await var3331.saveTx();
    }
  },
  'add2VocabularyBook': async function (param633, param634, param635) {
    param634.indexOf('\x20') === -0x1 && (param634 = param634.trim(), param634 = param634.toLowerCase(), param634 = param634.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, ''), param634 = param634.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, ''), param634 = param634.replace(/[0-9]/g, ''));
    var var3338 = new Zotero.Search();
    var3338.libraryID = Zotero.Libraries.userLibraryID;
    var3338.addCondition('itemType', 'is', 'note');
    var3338.addCondition("tag", 'is', "/生词本");
    var var3339 = await var3338.search(),
      var3340 = await Zotero.Items.getAsync(var3339);
    if (var3340.length === 0x0) {
      let var3341 = new Zotero.Item("note");
      var3341.addTag("/生词本");
      var3341.saveTx();
      let var3342 = JSON.parse(param633.annotationPosition).pageIndex + 0x1,
        var3343 = Zotero.AI4Paper.getAnnotationItemLink(param633),
        var3344 = "<a href=\"" + var3343 + '\x22>' + param634 + "</a>",
        var3345 = '<h2\x20style=\x22color:\x20#00abeb;\x22>📘\x20生词本>>>>>>></h2><p>' + var3344 + ':\x20' + (!Zotero.Prefs.get("ai4paper.vocabularyinlinecodestyle") ? param635 : '<code>\x20' + param635 + "</code>") + '<p>';
      var3341.setNote(var3345);
      await var3341.saveTx();
    } else {
      let _0x2955ea = var3340[0x0],
        _0x1c6928 = _0x2955ea.getNote(),
        _0x368a2c = JSON.parse(param633.annotationPosition).pageIndex + 0x1,
        _0x1b6c84 = Zotero.AI4Paper.getAnnotationItemLink(param633),
        _0x5b4e2a = '<a\x20href=\x22' + _0x1b6c84 + '\x22>' + param634 + "</a>";
      if (_0x1c6928.indexOf(param633.key) != -0x1 || _0x1c6928.indexOf('>' + param634 + '</a>') != -0x1) {
        return false;
      }
      if (_0x1c6928.indexOf("</h2>") != -0x1) {
        let var3351 = _0x1c6928.indexOf('</h2>');
        _0x1c6928 = await _0x1c6928.substring(var3351 + 0x8);
      }
      let _0x446a5f = "<h2 style=\"color: #00abeb;\">📘 生词本>>>>>>></h2><p>" + _0x5b4e2a + ':\x20' + (!Zotero.Prefs.get("ai4paper.vocabularyinlinecodestyle") ? param635 : '<code>\x20' + param635 + '</code>') + "<p>" + _0x1c6928;
      _0x446a5f = _0x446a5f.replace(/<p>>/, '<p>');
      _0x2955ea.setNote(_0x446a5f);
      await _0x2955ea.saveTx();
    }
  },
  'modifyVocabularyNote': async function (param636, param637) {
    param636.annotationText.indexOf('\x20') === -0x1 && (param636.annotationText = param636.annotationText.trim(), param636.annotationText = param636.annotationText.toLowerCase(), param636.annotationText = param636.annotationText.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, ''), param636.annotationText = param636.annotationText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, ''), param636.annotationText = param636.annotationText.replace(/[0-9]/g, ''));
    var var3353 = Zotero.AI4Paper.findNoteItem_basedOnTag(param636, "/生词");
    if (var3353) {
      let var3354 = var3353.getNote();
      if (var3354.indexOf(param637) != -0x1) {
        let var3355 = var3354.indexOf(param637),
          var3356 = var3354.substring(var3355),
          var3357 = var3356.indexOf("<p>");
        if (var3356.substring(var3357 + 0x2) != '>') var var3358 = var3356.substring(var3357 + 0x3);
        let var3359 = var3354.substring(0x0, var3355),
          var3360 = var3359.lastIndexOf("<p>"),
          var3361 = var3359.substring(0x0, var3360 + 0x3),
          var3362 = JSON.parse(param636.annotationPosition).pageIndex + 0x1,
          var3363 = Zotero.AI4Paper.getAnnotationItemLink(param636),
          var3364 = "<a href=\"" + var3363 + '\x22>' + param636.annotationText + '</a>',
          var3365 = var3364 + ':\x20' + (!Zotero.Prefs.get("ai4paper.vocabularyinlinecodestyle") ? param636.annotationComment : "<code> " + param636.annotationComment + '</code>') + "<p>";
        if (var3356.substring(var3357 + 0x2) != '>') var var3366 = var3361 + var3365 + var3358;else var var3366 = var3361 + var3365;
        var3353.setNote(var3366);
        await var3353.saveTx();
      }
    }
    Zotero.AI4Paper.modifyVocabularyNoteBook(param636, param637);
  },
  'modifyVocabularyNoteBook': async function (param638, param639) {
    param638.annotationText.indexOf('\x20') === -0x1 && (param638.annotationText = param638.annotationText.trim(), param638.annotationText = param638.annotationText.toLowerCase(), param638.annotationText = param638.annotationText.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, ''), param638.annotationText = param638.annotationText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, ''), param638.annotationText = param638.annotationText.replace(/[0-9]/g, ''));
    var var3367 = new Zotero.Search();
    var3367.libraryID = Zotero.Libraries.userLibraryID;
    var3367.addCondition("itemType", 'is', 'note');
    var3367.addCondition("tag", 'is', "/生词本");
    var var3368 = await var3367.search(),
      var3369 = await Zotero.Items.getAsync(var3368);
    if (var3369.length != 0x0) {
      let var3370 = var3369[0x0],
        var3371 = var3370.getNote();
      if (var3371.indexOf(param639) != -0x1) {
        let var3372 = var3371.indexOf(param639),
          var3373 = var3371.substring(var3372),
          var3374 = var3373.indexOf("<p>");
        if (var3373.substring(var3374 + 0x2) != '>') var var3375 = var3373.substring(var3374 + 0x3);
        let var3376 = var3371.substring(0x0, var3372),
          var3377 = var3376.lastIndexOf('<p>'),
          var3378 = var3376.substring(0x0, var3377 + 0x3),
          var3379 = JSON.parse(param638.annotationPosition).pageIndex + 0x1,
          var3380 = Zotero.AI4Paper.getAnnotationItemLink(param638),
          var3381 = '<a\x20href=\x22' + var3380 + '\x22>' + param638.annotationText + "</a>",
          var3382 = var3381 + ':\x20' + (!Zotero.Prefs.get("ai4paper.vocabularyinlinecodestyle") ? param638.annotationComment : '<code>\x20' + param638.annotationComment + "</code>") + "<p>";
        if (var3373.substring(var3374 + 0x2) != '>') var var3383 = var3378 + var3382 + var3375;else var var3383 = var3378 + var3382;
        var3370.setNote(var3383);
        await var3370.saveTx();
      }
    }
  },
  'removeVocabularyfromNote': async function (param640) {
    let var3384 = Zotero.AI4Paper.getCurrentItem(true);
    if (!var3384) return false;
    var var3385 = Zotero.AI4Paper.findNoteItem_basedOnTag(var3384, '/生词');
    if (var3385) {
      let var3386 = var3385.getNote();
      if (var3386.indexOf(param640) != -0x1) {
        let var3387 = var3386.indexOf(param640),
          var3388 = var3386.substring(var3387),
          var3389 = var3388.indexOf("<p>");
        if (var3388.substring(var3389 + 0x2) != '>') {
          var var3390 = var3388.substring(var3389 + 0x3);
        }
        let var3391 = var3386.substring(0x0, var3387),
          var3392 = var3391.lastIndexOf('<p>'),
          var3393 = var3391.substring(0x0, var3392 + 0x3);
        if (var3388.substring(var3389 + 0x2) != '>') var var3394 = var3393 + var3390;else var var3394 = var3393;
        var3385.setNote(var3394);
        await Zotero.AI4Paper.removeVocabularyfromNoteBook(param640);
        await var3385.saveTx();
      }
    }
  },
  'removeVocabularyfromNoteBook': async function (param641) {
    var var3395 = new Zotero.Search();
    var3395.libraryID = Zotero.Libraries.userLibraryID;
    var3395.addCondition("itemType", 'is', "note");
    var3395.addCondition("tag", 'is', "/生词本");
    var var3396 = await var3395.search(),
      var3397 = await Zotero.Items.getAsync(var3396);
    if (var3397.length != 0x0) {
      let var3398 = var3397[0x0],
        var3399 = var3398.getNote();
      if (var3399.indexOf(param641) != -0x1) {
        let var3400 = var3399.indexOf(param641),
          var3401 = var3399.substring(var3400),
          var3402 = var3401.indexOf("<p>");
        if (var3401.substring(var3402 + 0x2) != '>') var var3403 = var3401.substring(var3402 + 0x3);
        let var3404 = var3399.substring(0x0, var3400),
          var3405 = var3404.lastIndexOf("<p>"),
          var3406 = var3404.substring(0x0, var3405 + 0x3);
        if (var3401.substring(var3402 + 0x2) != '>') var var3407 = var3406 + var3403;else var var3407 = var3406;
        var3398.setNote(var3407);
        await var3398.saveTx();
      }
    }
  },
  'updateVocabularyAnnotation': async function (param642, param643, param644, param645, param646) {
    param642.annotationComment = param644;
    if (!param645) {
      Zotero.AI4Paper.showProgressWindow(0x1388, param646, param643 + '：' + param644, "vocabulary");
      Zotero.AI4Paper.addVocabulary2Note(param642, param643, param644);
    } else param642.annotationComment = "【已收藏】" + param644;
    if (Zotero.Prefs.get("ai4paper.vocabularyautoaddtags")) {
      if (Zotero.AI4Paper.checkPunctuation(param643)) param642.addTag("生词/例句");else {
        param642.addTag("生词/短语");
      }
    }
    await param642.saveTx();
  },
  'vocabularySearch': async function (param647) {
    var var3408 = param647.trim();
    var3408 = var3408.toLowerCase();
    var3408 = var3408.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    var3408 = var3408.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    var3408 = var3408.replace(/[0-9]/g, '');
    if (!var3408.trim()) return -0x1;
    let var3409 = {};
    try {
      const _0x2b5e5c = await Zotero.HTTP.request("GET", "https://www.iciba.com/word?w=" + var3408, {
        'responseType': "text"
      });
      _0x2b5e5c?.["status"] !== 0xc8 && Zotero.debug("Request error: " + _0x2b5e5c?.["status"]);
      let _0x4baaf8 = _0x2b5e5c.response;
      if (_0x4baaf8) {
        var3409 = Zotero.AI4Paper.parseIcibaWebSearch(_0x4baaf8);
      }
    } catch (_0x29727f) {
      return -0x1;
    }
    let var3412 = null,
      var3413 = null,
      var3414 = null,
      var3415 = null,
      var3416 = null,
      var3417 = null,
      var3418 = [],
      var3419 = '',
      var3420 = '',
      var3421 = '';
    try {
      var3412 = var3409.symbols[0x0].ph_en;
      var3413 = var3409.symbols[0x0].ph_am;
      var3414 = var3409.symbols[0x0].ph_en_mp3;
      var3415 = var3409.symbols[0x0].ph_am_mp3;
      var3416 = var3409.symbols[0x0].ph_tts_mp3;
      var3417 = var3409.symbols[0x0].parts;
      await new Promise(_0x189583 => setTimeout(_0x189583, 0x32));
    } catch (_0x5177df) {
      return -0x1;
    }
    if (var3414.length > 0x0 || var3415.length > 0x0 || var3416.length > 0x0) {
      var3412 === '' && (var3412 = '无');
      var3413 === '' && (var3413 = '无');
      var3420 = "🔉 英  [" + var3412 + "]，美  [" + var3413 + ']\x0a';
      var3418.push(var3420);
      for (let var3422 = 0x0; var3422 < var3417.length; var3422++) {
        var3422 < var3417.length - 0x1 ? var3419 = var3417[var3422].part + '\x20\x20' + var3417[var3422].means.join(',') + '\x0a' : var3419 = var3417[var3422].part + '\x20\x20' + var3417[var3422].means.join(',');
        var3418.push(var3419);
      }
      return var3419 = var3418.join('\x20\x20'), var3419;
    } else {
      return -0x1;
    }
  },
  'openVocabularyBook': async function () {
    var var3423 = new Zotero.Search();
    var3423.libraryID = Zotero.Libraries.userLibraryID;
    var3423.addCondition("itemType", 'is', 'note');
    var3423.addCondition("tag", 'is', "/生词本");
    var var3424 = await var3423.search(),
      var3425 = await Zotero.Items.getAsync(var3424);
    if (var3425.length === 0x0) {
      window.alert("您尚未创建生词本！添加第一个生词后，将自动创建生词本。");
    } else {
      let var3426 = var3425[0x0];
      ZoteroPane_Local.selectItem(var3426.itemID);
      Zotero_Tabs.select("zotero-pane");
      await Zotero.Promise.delay(0x64);
      var var3427 = ZoteroPane_Local.getSelectedLibraryID(),
        var3428 = ZoteroPane_Local.getSelectedItems();
      if (!var3428 || !var3428.length) return;
      var var3429 = "zotero://report/" + Zotero.API.getLibraryPrefix(var3427) + "/items" + "?itemKey=" + var3428.map(_0x52f78d => _0x52f78d.key).join(',');
      Zotero.openInViewer(var3429, {
        'allowJavaScript': false
      });
    }
  },
  'randomVocabulary': async function () {
    var var3430 = new Zotero.Search();
    var3430.libraryID = Zotero.Libraries.userLibraryID;
    var3430.addCondition("itemType", 'is', "note");
    var3430.addCondition("tag", 'is', "/生词");
    var var3431 = await var3430.search(),
      var3432 = await Zotero.Items.getAsync(var3431);
    if (var3432.length === 0x0) window.alert("您尚未收藏任何生词！请添加第一个生词后，再使用本功能。");else {
      let _0x52f78e = Math.floor(Math.random() * var3432.length),
        _0x2184f6 = var3432[_0x52f78e];
      ZoteroPane_Local.selectItem(_0x2184f6.itemID);
      Zotero_Tabs.select("zotero-pane");
      await Zotero.Promise.delay(0x64);
      var var3435 = ZoteroPane_Local.getSelectedLibraryID(),
        var3436 = ZoteroPane_Local.getSelectedItems();
      if (!var3436 || !var3436.length) {
        return;
      }
      var var3437 = "zotero://report/" + Zotero.API.getLibraryPrefix(var3435) + '/items' + "?itemKey=" + var3436.map(_0x55ef5f => _0x55ef5f.key).join(',');
      Zotero.openInViewer(var3437, {
        'allowJavaScript': false
      });
    }
  },
  'getVocabularyAllWords': async function () {
    var var3574 = new Zotero.Search();
    var3574.libraryID = Zotero.Libraries.userLibraryID;
    var3574.addCondition("itemType", 'is', 'note');
    var3574.addCondition("tag", 'is', "/生词");
    var var3575 = await var3574.search(),
      var3576 = await Zotero.Items.getAsync(var3575);
    if (var3576.length === 0x0) return Zotero.AI4Paper.showProgressWindow(0x2710, "❌【更新生词库】", "未发现任何单词！"), false;
    var var3577 = '';
    for (let var3578 of var3576) {
      let _0x244e1f = var3578.getNote();
      var3577 = var3577 + '<p>' + _0x244e1f;
    }
    var var3580 = new RegExp("</a>", 'g'),
      var3581 = [],
      var3582 = [],
      var3583 = [];
    while (var3580.exec(var3577) != null) {
      var3581.push(var3580.lastIndex);
    }
    for (i = 0x0; i < var3581.length; i++) {
      let _0x18c903 = var3577.substring(0x0, var3581[i] - 0x3),
        _0x5093e1 = _0x18c903.lastIndexOf('>'),
        _0x5338b5 = '' + _0x18c903.substring(_0x5093e1 + 0x1, _0x18c903.length - 0x1),
        _0x29cd59 = _0x18c903.lastIndexOf("href=\""),
        _0x50316e = _0x18c903.substring(_0x29cd59),
        _0x2c1de1 = _0x50316e.lastIndexOf('\x22'),
        _0xafc969 = '' + _0x50316e.substring(0x6, _0x2c1de1);
      if (Zotero.Prefs.get('ai4paper.vocabularyreviewcontent') === "仅单词") _0x5338b5.indexOf('\x20') === -0x1 && (var3582.push(_0x5338b5), var3583.push(_0xafc969));else {
        if (Zotero.Prefs.get('ai4paper.vocabularyreviewcontent') === '仅短语') _0x5338b5.indexOf('\x20') != -0x1 && !Zotero.AI4Paper.checkPunctuation(_0x5338b5) && (var3582.push(_0x5338b5), var3583.push(_0xafc969));else {
          if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === "仅例句") _0x5338b5.indexOf('\x20') != -0x1 && Zotero.AI4Paper.checkPunctuation(_0x5338b5) && (var3582.push(_0x5338b5), var3583.push(_0xafc969));else {
            if (Zotero.Prefs.get('ai4paper.vocabularyreviewcontent') === "仅短语和例句") _0x5338b5.indexOf('\x20') != -0x1 && (var3582.push(_0x5338b5), var3583.push(_0xafc969));else {
              if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === '全部') {
                var3582.push(_0x5338b5);
                var3583.push(_0xafc969);
              } else {
                if (_0x5338b5.indexOf('\x20') === -0x1) {
                  var3582.push(_0x5338b5);
                  var3583.push(_0xafc969);
                }
              }
            }
          }
        }
      }
    }
    if (var3582.length != 0x0) {
      Zotero.Prefs.set('ai4paper.vocabularyallwords', var3582.join("<<<>>>"));
      Zotero.Prefs.set("ai4paper.vocabularywordszoterolink", var3583.join("<<<>>>"));
      if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === "仅单词") {
        Zotero.AI4Paper.showProgressWindow(0x2710, '✅【更新生词库】', "更新成功！共有【" + var3582.length + "】个【单词】！");
      } else {
        if (Zotero.Prefs.get('ai4paper.vocabularyreviewcontent') === "仅短语") Zotero.AI4Paper.showProgressWindow(0x2710, "✅【更新生词库】", "更新成功！共有【" + var3582.length + '】个【短语】！');else {
          if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === "仅例句") Zotero.AI4Paper.showProgressWindow(0x2710, "✅【更新生词库】", '更新成功！共有【' + var3582.length + "】个【例句】！");else {
            if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === "仅短语和例句") Zotero.AI4Paper.showProgressWindow(0x2710, "✅【更新生词库】", "更新成功！共有【" + var3582.length + '】个【短语和例句】！');else Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === '全部' ? Zotero.AI4Paper.showProgressWindow(0x2710, "✅【更新生词库】", "更新成功！共有【" + var3582.length + '】个生词！') : Zotero.AI4Paper.showProgressWindow(0x2710, '✅【更新生词库】', "更新成功！共有【" + var3582.length + "】个【单词】！");
          }
        }
      }
      Zotero.AI4Paper.getVocabularyOneWord();
    } else {
      if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === "仅单词") Zotero.AI4Paper.showProgressWindow(0x2710, "❌【更新生词库】", "未发现任何【单词】！");else {
        if (Zotero.Prefs.get('ai4paper.vocabularyreviewcontent') === "仅短语") {
          Zotero.AI4Paper.showProgressWindow(0x2710, "❌【更新生词库】", "未发现任何【短语】！");
        } else {
          if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === "仅例句") Zotero.AI4Paper.showProgressWindow(0x2710, "❌【更新生词库】", '未发现任何【例句】！');else {
            if (Zotero.Prefs.get('ai4paper.vocabularyreviewcontent') === "仅短语和例句") Zotero.AI4Paper.showProgressWindow(0x2710, "❌【更新生词库】", "未发现任何【短语和例句】！");else {
              if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === '全部') {
                Zotero.AI4Paper.showProgressWindow(0x2710, "❌【更新生词库】", "未发现任何生词！");
              } else Zotero.AI4Paper.showProgressWindow(0x2710, "❌【更新生词库】", "未发现任何【单词】！");
            }
          }
        }
      }
    }
  },
  'getVocabularyOneWord': function () {
    let var3591 = Zotero_Tabs._selectedID;
    const var3592 = Zotero.Reader.getByTabID(var3591);
    if (!var3592) return;
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      return false;
    }
    var var3593;
    if (window.document.getElementById('ai4paper-translate-readersidepane')) {
      var3593 = window.document.getElementById('ai4paper-translate-readersidepane').contentWindow;
    } else {
      return false;
    }
    let var3594 = Zotero.Prefs.get('ai4paper.vocabularyallwords').split("<<<>>>"),
      var3595 = Zotero.Prefs.get("ai4paper.vocabularywordszoterolink").split('<<<>>>');
    if (var3594.length) {
      let _0x3d87da = Math.floor(Math.random() * var3594.length),
        _0x4fc423 = var3594[_0x3d87da];
      Zotero.AI4Paper.translateSourceText = _0x4fc423;
      Zotero.AI4Paper.vocabularyzoterolink = var3595[_0x3d87da];
      var3593.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = _0x4fc423;
      Zotero.AI4Paper.translateResponse = '';
      if (Zotero.Prefs.get("ai4paper.vocabularyreviewgiveinterpretation")) Zotero.AI4Paper.giveVocabulayInterpretation(_0x4fc423);else {
        var3593.document.getElementById("ai4paper-translate-readerSidePane-response").value = Zotero.AI4Paper.translateResponse;
      }
    }
  },
  'giveVocabulayInterpretation': async function (param655) {
    if (!param655) return false;
    if (Zotero.AI4Paper.isChineseText(param655)) return false;
    if (Zotero.Prefs.get('ai4paper.translationvocabularyfirst')) {
      if (param655.indexOf('\x20') === -0x1) {
        param655 = param655.trim();
        param655 = param655.toLowerCase();
        param655 = param655.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
        param655 = param655.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
        param655 = param655.replace(/[0-9]/g, '');
        let var3598 = await Zotero.AI4Paper.translateSidePaneVocabulary(param655);
        if (var3598 && var3598 != -0x1) return -0x1;
      }
    }
    Zotero.AI4Paper.translationEngineTask(param655, 'onSelect');
  },
  'openVocabularyZoteroLink': function (param656) {
    try {
      ZoteroPane.loadURI(param656);
    } catch (_0x5f5795) {
      window.alert("链接无效！");
    }
  },
  'exportVocabularyTXT': async function (param1103) {
    let var5673 = await this.filterVocabulary_EudicShanbei_Words(param1103);
    if (!var5673) {
      return;
    }
    var {
      FilePicker: _0x32864f
    } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
    const var5674 = new _0x32864f();
    var5674.displayDirectory = OS.Constants.Path.homeDir;
    var5674.init(window, "Export vocabulary in txt...", var5674.modeSave);
    var5674.appendFilter('Text', '*.txt');
    let var5675 = new Date(),
      var5676 = var5675.toLocaleDateString().replace(/\//g, '-'),
      var5677 = "生词（" + param1103 + '）' + var5676;
    var5674.defaultString = var5677 + ".txt";
    const var5678 = await var5674.show();
    if (var5678 == var5674.returnOK || var5678 == var5674.returnReplace) {
      let var5679 = var5674.file;
      var5679.split('.').pop().toLowerCase() != "txt" && (var5679 += ".txt");
      await Zotero.File.putContentsAsync(var5679, var5673.join('\x0a'));
      Zotero.AI4Paper.showProgressWindow(0xbb8, "导出生词（" + param1103 + "）【AI4paper】", "✅ 成功导出【" + var5673.length + "】个生词（" + param1103 + "）至【" + var5679 + '】！');
      if (await OS.File.exists(var5679)) {
        let _0x431778 = Zotero.File.pathToFile(var5679);
        try {
          _0x431778.reveal();
        } catch (_0x194a6b) {}
      }
    }
  },
  'exportVocabulary2Anki': async function (param1104) {
    let var5681 = await this.filterVocabulary_Anki_HTML(param1104);
    if (!var5681) return;
    var {
      FilePicker: _0x192e1e
    } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
    const var5682 = new _0x192e1e();
    var5682.displayDirectory = OS.Constants.Path.homeDir;
    var5682.init(window, "Export vocabulary in txt...", var5682.modeSave);
    var5682.appendFilter("Text", "*.txt");
    let var5683 = new Date(),
      var5684 = var5683.toLocaleDateString().replace(/\//g, '-'),
      var5685 = 'Anki\x20生词（' + param1104 + '）' + var5684;
    var5682.defaultString = var5685 + ".txt";
    const var5686 = await var5682.show();
    if (var5686 == var5682.returnOK || var5686 == var5682.returnReplace) {
      let _0x49b9dc = var5682.file;
      _0x49b9dc.split('.').pop().toLowerCase() != 'txt' && (_0x49b9dc += ".txt");
      await Zotero.File.putContentsAsync(_0x49b9dc, var5681.join('\x0a'));
      Zotero.AI4Paper.showProgressWindow(0xbb8, '导出\x20Anki\x20生词（' + param1104 + "）【AI4paper】", '✅\x20成功导出【' + var5681.length + "】个生词（" + param1104 + '）至【' + _0x49b9dc + '】！');
      if (await OS.File.exists(_0x49b9dc)) {
        let var5688 = Zotero.File.pathToFile(_0x49b9dc);
        try {
          var5688.reveal();
        } catch (_0x2ef066) {}
      }
    }
  },
  'exportVocabulary2Eudic': async function (param1105) {
    let var5689 = await this.filterVocabulary_EudicShanbei_Words(param1105);
    if (!var5689) {
      return;
    }
    if (Zotero.Prefs.get('ai4paper.eudicAPIKey') === '') return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 请配置【欧路词典 API】", "请先前往【AI4paper 设置 --> 生词】输入 欧路词典 API-Key！"), -0x1;
    if (Zotero.Prefs.get("ai4paper.eudicCategoryID") === '') return Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20请配置【欧路词典\x20API】', "请先前往【AI4paper 设置 --> 生词 --> 欧路词典 API】输入生词本 ID！输入 0，代表使用默认生词本。"), -0x1;
    var var5690 = Zotero.Prefs.get("ai4paper.eudicAPIKey").trim(),
      var5691 = Zotero.Prefs.get("ai4paper.eudicCategoryID").trim(),
      var5692 = "https://api.frdic.com/api/open/v1/studylist/words",
      var5693 = {
        'id': var5691,
        'language': 'en',
        'words': var5689
      };
    let var5694;
    try {
      let var5695 = await Zotero.HTTP.request("POST", var5692, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': var5690
        },
        'body': JSON.stringify(var5693),
        'responseType': "json"
      });
      var5695.response.message ? (Zotero.AI4Paper.showProgressWindow(0x7d0, '✅【同步生词（' + param1105 + "）至欧路词典】", '' + var5695.response.message), Zotero.AI4Paper.changeAudioPlayPopupButtonName()) : Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 同步失败", "同步生词失败！");
    } catch (_0x4deb89) {
      window.alert(_0x4deb89);
    }
  },
  'filterVocabulary_EudicShanbei_Words': async function (param1106) {
    var var5696 = new Zotero.Search();
    var5696.libraryID = Zotero.Libraries.userLibraryID;
    var5696.addCondition("itemType", 'is', "note");
    var5696.addCondition("tag", 'is', '/生词');
    var var5697 = await var5696.search(),
      var5698 = await Zotero.Items.getAsync(var5697);
    if (var5698.length === 0x0) {
      return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌【导出生词（" + param1106 + '）】', "未发现任何生词（" + param1106 + '）！'), false;
    }
    var var5699 = '';
    for (let var5700 of var5698) {
      let _0x538a61 = var5700.getNote();
      var5699 = var5699 + "<p>" + _0x538a61;
    }
    var var5702 = new RegExp('</a>', 'g'),
      var5703 = [],
      var5704 = [],
      var5705 = [];
    while (var5702.exec(var5699) != null) {
      var5703.push(var5702.lastIndex);
    }
    for (i = 0x0; i < var5703.length; i++) {
      let var5706 = var5699.substring(0x0, var5703[i] - 0x3),
        var5707 = var5706.lastIndexOf('>'),
        var5708 = '' + var5706.substring(var5707 + 0x1, var5706.length - 0x1),
        var5709 = var5706.lastIndexOf('href=\x22'),
        var5710 = var5706.substring(var5709),
        var5711 = var5710.lastIndexOf('\x22'),
        var5712 = '' + var5710.substring(0x6, var5711);
      if (param1106 === "仅单词") var5708.indexOf('\x20') === -0x1 && (var5704.push(var5708), var5705.push(var5712));else {
        if (param1106 === "仅短语") {
          if (var5708.indexOf('\x20') != -0x1 && !Zotero.AI4Paper.checkPunctuation(var5708)) {
            var5704.push(var5708);
            var5705.push(var5712);
          }
        } else {
          if (param1106 === "仅例句") {
            var5708.indexOf('\x20') != -0x1 && Zotero.AI4Paper.checkPunctuation(var5708) && (var5704.push(var5708), var5705.push(var5712));
          } else {
            if (param1106 === "仅短语和例句") var5708.indexOf('\x20') != -0x1 && (var5704.push(var5708), var5705.push(var5712));else {
              if (param1106 === '全部') {
                var5704.push(var5708);
                var5705.push(var5712);
              } else {
                var5708.indexOf('\x20') === -0x1 && (var5704.push(var5708), var5705.push(var5712));
              }
            }
          }
        }
      }
    }
    if (var5704.length != 0x0) {
      return var5704;
    } else return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌【导出生词（" + param1106 + '）】', "您的生词本中无任何【生词（" + param1106 + "）】！"), false;
  },
  'filterVocabulary_Anki_HTML': async function (param1107) {
    var var5713 = new Zotero.Search();
    var5713.libraryID = Zotero.Libraries.userLibraryID;
    var5713.addCondition("itemType", 'is', "note");
    var5713.addCondition('tag', 'is', "/生词");
    var var5714 = await var5713.search(),
      var5715 = await Zotero.Items.getAsync(var5714);
    if (var5715.length === 0x0) return Zotero.AI4Paper.showProgressWindow(0xbb8, '❌【导出生词（' + param1107 + '）】', '未发现任何生词（' + param1107 + '）！'), false;
    var var5716 = '';
    for (let var5717 of var5715) {
      let var5718 = var5717.getNote();
      var5716 = var5716 + "<p>" + var5718;
    }
    var var5719 = new RegExp("</a>", 'g'),
      var5720 = [],
      var5721 = [],
      var5722 = [];
    while (var5719.exec(var5716) != null) {
      var5720.push(var5719.lastIndex);
    }
    for (i = 0x0; i < var5720.length; i++) {
      let _0x21b85a = var5716.substring(0x0, var5720[i] - 0x3),
        _0x22f7e8 = _0x21b85a.lastIndexOf('>'),
        _0x1920be = '' + _0x21b85a.substring(_0x22f7e8 + 0x1, _0x21b85a.length - 0x1),
        _0x206cee = var5716.substring(var5720[i]),
        _0x4d1805 = "undefined";
      if (_0x206cee.indexOf(':\x20<code>') === 0x0) {
        let _0x44191b = _0x206cee.indexOf("</code>"),
          _0x5549dd = _0x206cee.substring(0x0, _0x44191b),
          _0x741843 = _0x5549dd.indexOf("<code>");
        _0x4d1805 = '' + _0x5549dd.substring(_0x741843 + 0x6).trim();
      } else {
        if (_0x206cee.indexOf("<p>") != -0x1) {
          let _0x3e3657 = _0x206cee.indexOf("<p>");
          _0x4d1805 = '' + _0x206cee.substring(0x1, _0x3e3657).trim();
        }
      }
      let _0x46f5e9 = _0x21b85a.lastIndexOf("href=\""),
        _0x1ed5fb = _0x21b85a.substring(_0x46f5e9),
        _0x1e8d7e = _0x1ed5fb.lastIndexOf('\x22'),
        _0x3740ea = '' + _0x1ed5fb.substring(0x6, _0x1e8d7e);
      if (param1107 === "仅单词") _0x1920be.indexOf('\x20') === -0x1 && var5721.push(_0x1920be + '\x09' + _0x4d1805.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, "<br>") + " <a href=\"" + _0x3740ea + "\">🔗</a>");else {
        if (param1107 === '仅短语') _0x1920be.indexOf('\x20') != -0x1 && !Zotero.AI4Paper.checkPunctuation(_0x1920be) && var5721.push(_0x1920be + '\x09' + _0x4d1805.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, "<br>") + " <a href=\"" + _0x3740ea + "\">🔗</a>");else {
          if (param1107 === "仅例句") _0x1920be.indexOf('\x20') != -0x1 && Zotero.AI4Paper.checkPunctuation(_0x1920be) && var5721.push(_0x1920be + '\x09' + _0x4d1805.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, "<br>") + " <a href=\"" + _0x3740ea + "\">🔗</a>");else {
            if (param1107 === "仅短语和例句") _0x1920be.indexOf('\x20') != -0x1 && var5721.push(_0x1920be + '\x09' + _0x4d1805.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, '<br>') + " <a href=\"" + _0x3740ea + "\">🔗</a>");else param1107 === '全部' ? var5721.push(_0x1920be + '\x09' + _0x4d1805.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, '<br>') + " <a href=\"" + _0x3740ea + '\x22>🔗</a>') : _0x1920be.indexOf('\x20') === -0x1 && var5721.push(_0x1920be + '\x09' + _0x4d1805.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, "<br>") + " <a href=\"" + _0x3740ea + "\">🔗</a>");
          }
        }
      }
    }
    if (var5721.length != 0x0) {
      return [...new Set(var5721)];
    } else return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌【导出生词（" + param1107 + '）】', "未发现任何生词（" + param1107 + '）！'), false;
  },
  'filterVocabulary_Anki': async function () {
    var var5736 = new Zotero.Search();
    var5736.libraryID = Zotero.Libraries.userLibraryID;
    var5736.addCondition("itemType", 'is', "note");
    var5736.addCondition("tag", 'is', '/生词');
    var var5737 = await var5736.search(),
      var5738 = await Zotero.Items.getAsync(var5737);
    if (var5738.length === 0x0) return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌【导出生词及其释义（Anki）】", '未发现任何生词！'), false;
    var var5739 = '';
    for (let var5740 of var5738) {
      let _0x4d78ca = var5740.getNote();
      var5739 = var5739 + "<p>" + _0x4d78ca;
    }
    var var5742 = new RegExp("</a>", 'g'),
      var5743 = [],
      var5744 = [];
    while (var5742.exec(var5739) != null) {
      var5743.push(var5742.lastIndex);
    }
    for (i = 0x0; i < var5743.length; i++) {
      let var5745 = var5739.substring(0x0, var5743[i] - 0x3),
        var5746 = var5745.lastIndexOf('>'),
        var5747 = '' + var5745.substring(var5746 + 0x1, var5745.length - 0x1),
        var5748 = var5739.substring(var5743[i]),
        var5749 = "undefined";
      if (var5748.indexOf('</code>') != -0x1) {
        let var5750 = var5748.indexOf("</code>"),
          var5751 = var5748.substring(0x0, var5750),
          var5752 = var5751.indexOf("<code>");
        var5749 = '' + var5751.substring(var5752 + 0x6).trim();
      } else {
        if (var5748.indexOf("<p>") != -0x1) {
          let var5753 = var5748.indexOf("<p>");
          var5749 = '' + var5748.substring(0x1, var5753).trim();
        }
      }
      var5744.push(var5747 + '\x09' + var5749.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, '\x20'));
    }
    return var5744.length != 0x0 ? [...new Set(var5744)] : (Zotero.AI4Paper.showProgressWindow(0xbb8, "❌【导出生词及其释义（Anki）】", "您的生词本中无任何【生词】！"), false);
  },
});
