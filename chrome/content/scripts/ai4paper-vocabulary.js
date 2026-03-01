// AI4Paper Vocabulary Module - Word book, Eudic sync, pronunciation, vocabulary CRUD and export
Object.assign(Zotero.AI4Paper, {
  'addWordsToEudic': async function (word, categoryID, keepCase) {
    if (!word) return;
    word.trim().indexOf('\x20') === -0x1 && (word = word.trim(), !keepCase && (word = word.toLowerCase()));
    if (Zotero.Prefs.get('ai4paper.eudicAPIKey') === '') return Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20请配置【欧路词典\x20API】', "请先前往【AI4paper 设置 --> 生词】输入 欧路词典 API-Key！"), -0x1;
    if (Zotero.Prefs.get('ai4paper.eudicCategoryID') === '') return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 请配置【欧路词典 API】", "请先前往【AI4paper 设置 --> 生词 --> 欧路词典 API】输入生词本 ID！输入 0，代表使用默认生词本。"), -0x1;
    var apiKey = Zotero.Prefs.get("ai4paper.eudicAPIKey").trim(),
      catID = '0';
    if (!categoryID) catID = Zotero.Prefs.get("ai4paper.eudicCategoryID").trim();else {
      catID = categoryID;
    }
    var apiUrl = "https://api.frdic.com/api/open/v1/studylist/words",
      requestBody = {
        'id': catID,
        'language': 'en',
        'words': [word]
      };
    let response;
    try {
      let httpResponse = await Zotero.HTTP.request('POST', apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': 'json'
      });
      httpResponse.response.message ? (Zotero.AI4Paper.showProgressWindow(0x7d0, '✅【收藏生词至欧路词典】', '【' + word + '】：' + httpResponse.response.message), Zotero.AI4Paper.changeAudioPlayPopupButtonName()) : Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20收藏失败', '👉【' + word + "】👈：收藏失败！");
    } catch (e) {
      window.alert(e);
    }
  },
  'syncWordsToEudic': async function (word) {
    if (!word) return;
    if (word.trim().indexOf('\x20') === -0x1) {
      word = word.trim().toLowerCase();
    }
    if (Zotero.Prefs.get("ai4paper.eudicAPIKey") === '') {
      return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 请配置【欧路词典 API】", "请先前往【AI4paper 设置 --> 生词】输入 欧路词典 API-Key！"), -0x1;
    }
    if (Zotero.Prefs.get('ai4paper.eudicCategoryID') === '') {
      return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 请配置【欧路词典 API】", "请先前往【AI4paper 设置 --> 生词 --> 欧路词典 API】输入生词本 ID！输入 0，代表使用默认生词本。"), -0x1;
    }
    var apiKey = Zotero.Prefs.get("ai4paper.eudicAPIKey").trim(),
      catID = Zotero.Prefs.get("ai4paper.eudicCategoryID").trim(),
      apiUrl = "https://api.frdic.com/api/open/v1/studylist/words",
      requestBody = {
        'id': catID,
        'language': 'en',
        'words': [word]
      };
    let response;
    try {
      let httpResponse = await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
      !httpResponse.response.message && Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 【生词同步至欧路词典】失败", "【生词同步至欧路词典】失败，请检查欧路词典 API 或网络连接情况。");
    } catch (e) {
      return Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20【生词同步至欧路词典】失败', "【生词同步至欧路词典】失败，请检查欧路词典 API 或网络连接情况。" + e), false;
    }
  },
  'modifyEudicWords': function (word) {
    let dialogResult = Zotero.AI4Paper.openDialogByType_modal("modifyEudicWords", word);
    if (!dialogResult) {
      return;
    }
    Zotero.AI4Paper.addWordsToEudic(dialogResult.words, dialogResult.categoryID, dialogResult.keepCase);
  },
  'changeAudioPlayPopupButtonName': function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) {
      return false;
    }
    reader._iframeWindow.document.querySelector(".ai4paper-addWordsToEudic-button") && (reader._iframeWindow.document.querySelector(".ai4paper-addWordsToEudic-button").innerHTML = Zotero.AI4Paper.svg_icon_16px.addWordsToEudicSelectionPopupButton_saved);
  },
  'parseIcibaWebSearch': function (htmlText) {
    let symbolsStart = htmlText.indexOf(",\"symbols\":[{");
    htmlText = htmlText.substring(symbolsStart);
    let symbolsEnd = htmlText.indexOf("}],");
    htmlText = htmlText.substring(0x0, symbolsEnd + 0x3);
    const symbolsRegex = /,"symbols":(\[\{.*?\}\]),/s,
      regexMatch = htmlText.match(symbolsRegex);
    if (regexMatch) {
      let symbols = JSON.parse(regexMatch[0x1]);
      return {
        'symbols': symbols
      };
    } else {
      return Zotero.debug("AI4paper: iciba webpage parse error"), {};
    }
  },
  'pronunciation': async function () {
    Zotero.Prefs.get("ai4paper.wordsaudionoaudioplay") && Zotero.Prefs.set("ai4paper.wordsaudionowindowalert", true);
    let isLicensed = Zotero.AI4Paper.getFunMetaTitle(),
      audioElement = window.document.createElementNS("http://www.w3.org/1999/xhtml", "audio"),
      volume = 0x1;
    if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '50') volume = 0.5;else {
      if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '30') volume = 0.3;else {
        if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '10') volume = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') volume = 0.05;else {
            if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1') {
              volume = 0.01;
            }
          }
        }
      }
    }
    var selectedText = Zotero.AI4Paper.getSelectedText().trim();
    if (!selectedText) return;
    selectedText = selectedText.toLowerCase();
    selectedText = selectedText.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    selectedText = selectedText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    selectedText = selectedText.replace(/[0-9]/g, '');
    if (!selectedText.trim()) return -0x1;
    let icibaResult = {};
    try {
      const httpResponse = await Zotero.HTTP.request("GET", "https://www.iciba.com/word?w=" + selectedText, {
        'responseType': "text"
      });
      httpResponse?.['status'] !== 0xc8 && Zotero.debug("Request error: " + httpResponse?.["status"]);
      let responseText = httpResponse.response;
      responseText && (icibaResult = Zotero.AI4Paper.parseIcibaWebSearch(responseText));
    } catch (e) {
      return window.alert("未查询到该单词！请先联网。"), -0x1;
    }
    let phoneticEN = null,
      phoneticUS = null,
      mp3EN = null,
      mp3US = null,
      mp3TTS = null,
      wordParts = null,
      outputLines = [],
      partLine = '',
      pronunciationLine = '',
      progressLines = [],
      playedMsg = '';
    try {
      phoneticEN = icibaResult.symbols[0x0].ph_en;
      phoneticUS = icibaResult.symbols[0x0].ph_am;
      mp3EN = icibaResult.symbols[0x0].ph_en_mp3;
      mp3US = icibaResult.symbols[0x0].ph_am_mp3;
      mp3TTS = icibaResult.symbols[0x0].ph_tts_mp3;
      wordParts = icibaResult.symbols[0x0].parts;
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return window.alert("查询单词失败！"), -0x1;
    }
    if (mp3EN.length > 0x0 || mp3US.length > 0x0 || mp3TTS.length > 0x0) {
      if (isLicensed) {
        if (!Zotero.Prefs.get("ai4paper.wordsaudionoaudioplay")) {
          if (Zotero.Prefs.get('ai4paper.wordsaudiopreferpronunciation') === "英式发音") {
            if (mp3EN.length > 0x0) {
              audioElement.setAttribute("src", mp3EN);
              volume != 0x1 && (audioElement.volume = volume);
              audioElement.play();
              playedMsg = "刚刚播放的是【英式发音】。";
            } else {
              if (mp3US.length > 0x0) {
                audioElement.setAttribute("src", mp3US);
                volume != 0x1 && (audioElement.volume = volume);
                audioElement.play();
                playedMsg = "刚刚播放的是【美式发音】。";
              } else {
                if (mp3TTS.length > 0x0) {
                  audioElement.setAttribute("src", mp3TTS);
                  if (volume != 0x1) {
                    audioElement.volume = volume;
                  }
                  audioElement.play();
                  playedMsg = "刚刚播放的是【合成发音】。";
                }
              }
            }
          } else {
            if (Zotero.Prefs.get('ai4paper.wordsaudiopreferpronunciation') === "美式发音") {
              if (mp3US.length > 0x0) {
                audioElement.setAttribute("src", mp3US);
                volume != 0x1 && (audioElement.volume = volume);
                audioElement.play();
                playedMsg = "刚刚播放的是【美式发音】。";
              } else {
                if (mp3EN.length > 0x0) {
                  audioElement.setAttribute("src", mp3EN);
                  volume != 0x1 && (audioElement.volume = volume);
                  audioElement.play();
                  playedMsg = "刚刚播放的是【英式发音】。";
                } else mp3TTS.length > 0x0 && (audioElement.setAttribute('src', mp3TTS), volume != 0x1 && (audioElement.volume = volume), audioElement.play(), playedMsg = "刚刚播放的是【合成发音】。");
              }
            }
          }
        }
      }
      phoneticEN === '' && (phoneticEN = '无');
      phoneticUS === '' && (phoneticUS = '无');
      outputLines.push('👉\x20' + selectedText);
      pronunciationLine = "🔉 英  [" + phoneticEN + ']，美\x20\x20[' + phoneticUS + ']';
      outputLines.push(pronunciationLine);
      progressLines.push(pronunciationLine);
      for (let i = 0x0; i < wordParts.length; i++) {
        partLine = "✔︎ " + wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',');
        outputLines.push(partLine);
        progressLines.push(partLine);
      }
      outputLines.push('\x0a');
      outputLines.push("📌 " + playedMsg + '输入\x201\x20或\x202\x20或\x203，分别播放英式、或美式、或合成发音；输入\x204\x20可重复播放发音三遍。');
      partLine = outputLines.join('\x0a');
      if (!Zotero.Prefs.get("ai4paper.wordsaudionoprogresswindow")) {
        let displayTime = Zotero.Prefs.get("ai4paper.wordsaudioprogresswindowtime");
        displayTime === '20' && (displayTime = 0x4e20);
        if (displayTime === '15') {
          displayTime = 0x3a98;
        }
        displayTime === '10' && (displayTime = 0x2710);
        displayTime === '5' && (displayTime = 0x1388);
        displayTime === '2' ? displayTime = 0x7d0 : displayTime = 0x1388;
        Zotero.AI4Paper.showProgressWindow(displayTime, "【查词与发音】：" + selectedText, '' + progressLines.join('\x0a'), "iciba");
      }
      if (!Zotero.Prefs.get("ai4paper.wordsaudionowindowalert")) {
        if (playedMsg === "刚刚播放的是【英式发音】。") var userChoice = window.prompt(partLine, '2');else {
          if (playedMsg === "刚刚播放的是【美式发音】。") {
            var userChoice = window.prompt(partLine, '1');
          } else {
            if (playedMsg === '刚刚播放的是【合成发音】。') var userChoice = window.prompt(partLine, '3');else var userChoice = window.prompt(partLine, '2');
          }
        }
        if (userChoice === '1' && mp3EN.length > 0x0) {
          audioElement.setAttribute("src", mp3EN);
          volume != 0x1 && (audioElement.volume = volume);
          audioElement.play();
        } else {
          if (userChoice === '2' && mp3US.length > 0x0) {
            audioElement.setAttribute("src", mp3US);
            volume != 0x1 && (audioElement.volume = volume);
            audioElement.play();
          } else {
            if (userChoice === '3' && mp3TTS.length > 0x0) {
              audioElement.setAttribute('src', mp3TTS);
              volume != 0x1 && (audioElement.volume = volume);
              audioElement.play();
            } else {
              if (userChoice === '4' && mp3EN.length > 0x0) {
                for (let repeatIdx = 0x0; repeatIdx < 0x3; repeatIdx++) {
                  audioElement.setAttribute("src", mp3EN);
                  volume != 0x1 && (audioElement.volume = volume);
                  audioElement.play();
                  await new Promise(resolve => setTimeout(resolve, 0x7d0));
                }
              } else {
                if (userChoice === '4' && mp3US.length > 0x0) {
                  for (let repeatIdx = 0x0; repeatIdx < 0x3; repeatIdx++) {
                    audioElement.setAttribute('src', mp3US);
                    volume != 0x1 && (audioElement.volume = volume);
                    audioElement.play();
                    await new Promise(resolve => setTimeout(resolve, 0x7d0));
                  }
                } else {
                  if (userChoice === '4' && mp3TTS.length > 0x0) for (let repeatIdx = 0x0; repeatIdx < 0x3; repeatIdx++) {
                    audioElement.setAttribute('src', mp3TTS);
                    if (volume != 0x1) {
                      audioElement.volume = volume;
                    }
                    audioElement.play();
                    await new Promise(resolve => setTimeout(resolve, 0x7d0));
                  } else {
                    if (userChoice === '1' && mp3EN.length === 0x0) window.alert("未查询到英式发音！");else userChoice === '2' && mp3US.length === 0x0 && window.alert("未查询到美式发音！");
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
  'vocabularySearchAnnotationTrans': async function (word) {
    let volume = 0x1;
    if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '50') volume = 0.5;else {
      if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '30') volume = 0.3;else {
        if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '10') volume = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') volume = 0.05;else Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1' && (volume = 0.01);
        }
      }
    }
    var cleanedWord = word.trim();
    cleanedWord = cleanedWord.toLowerCase();
    cleanedWord = cleanedWord.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    cleanedWord = cleanedWord.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    cleanedWord = cleanedWord.replace(/[0-9]/g, '');
    if (!cleanedWord.trim()) return -0x1;
    let icibaResult = {};
    try {
      const httpResponse = await Zotero.HTTP.request("GET", "https://www.iciba.com/word?w=" + cleanedWord, {
        'responseType': "text"
      });
      httpResponse?.["status"] !== 0xc8 && Zotero.debug("Request error: " + httpResponse?.['status']);
      let responseText = httpResponse.response;
      responseText && (icibaResult = Zotero.AI4Paper.parseIcibaWebSearch(responseText));
    } catch (e) {
      return -0x1;
    }
    let phoneticEN = null,
      phoneticUS = null,
      mp3EN = null,
      mp3US = null,
      mp3TTS = null,
      wordParts = null,
      resultLines = [],
      partLine = '',
      pronunciationLine = '',
      joinedResult = '';
    try {
      phoneticEN = icibaResult.symbols[0x0].ph_en;
      phoneticUS = icibaResult.symbols[0x0].ph_am;
      mp3EN = icibaResult.symbols[0x0].ph_en_mp3;
      mp3US = icibaResult.symbols[0x0].ph_am_mp3;
      mp3TTS = icibaResult.symbols[0x0].ph_tts_mp3;
      wordParts = icibaResult.symbols[0x0].parts;
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return -0x1;
    }
    if (mp3EN.length > 0x0 || mp3US.length > 0x0 || mp3TTS.length > 0x0) {
      phoneticEN === '' && (phoneticEN = '无');
      if (phoneticUS === '') {
        phoneticUS = '无';
      }
      pronunciationLine = '🔉\x20英\x20\x20[' + phoneticEN + "]，🔉 美  [" + phoneticUS + ']\x0a';
      resultLines.push(pronunciationLine);
      for (let i = 0x0; i < wordParts.length; i++) {
        if (i < wordParts.length - 0x1) {
          partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',') + '\x0a';
        } else partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',');
        resultLines.push(partLine);
      }
      return partLine = resultLines.join('\x20\x20'), partLine;
    } else return -0x1;
  },
  'vocabularySearchTrans': async function (word) {
    let audioElement = window.document.createElementNS("http://www.w3.org/1999/xhtml", 'audio'),
      volume = 0x1;
    if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '50') volume = 0.5;else {
      if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '30') {
        volume = 0.3;
      } else {
        if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '10') volume = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') {
            volume = 0.05;
          } else Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1' && (volume = 0.01);
        }
      }
    }
    var cleanedWord = word.trim();
    cleanedWord = cleanedWord.toLowerCase();
    cleanedWord = cleanedWord.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    cleanedWord = cleanedWord.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    cleanedWord = cleanedWord.replace(/[0-9]/g, '');
    if (!cleanedWord.trim()) return -0x1;
    let icibaResult = {};
    try {
      const httpResponse = await Zotero.HTTP.request("GET", "https://www.iciba.com/word?w=" + cleanedWord, {
        'responseType': "text"
      });
      httpResponse?.["status"] !== 0xc8 && Zotero.debug("Request error: " + httpResponse?.['status']);
      let responseText = httpResponse.response;
      responseText && (icibaResult = Zotero.AI4Paper.parseIcibaWebSearch(responseText));
    } catch (e) {
      return Zotero.AI4Paper.showProgressWindow(0x5dc, "❌【金山词霸】自动查词", "未查询到该单词！请先联网。"), Zotero.AI4Paper.updateTranslationPopupTextArea("❌【金山词霸】自动查词", "未查询到该单词！请先联网。"), -0x1;
    }
    let phoneticEN = null,
      phoneticUS = null,
      mp3EN = null,
      mp3US = null,
      mp3TTS = null,
      wordParts = null,
      resultLines = [],
      partLine = '',
      pronunciationLine = '',
      joinedResult = '';
    try {
      phoneticEN = icibaResult.symbols[0x0].ph_en;
      phoneticUS = icibaResult.symbols[0x0].ph_am;
      mp3EN = icibaResult.symbols[0x0].ph_en_mp3;
      mp3US = icibaResult.symbols[0x0].ph_am_mp3;
      mp3TTS = icibaResult.symbols[0x0].ph_tts_mp3;
      wordParts = icibaResult.symbols[0x0].parts;
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return -0x1;
    }
    if (mp3EN.length > 0x0 || mp3US.length > 0x0 || mp3TTS.length > 0x0) {
      if (Zotero.Prefs.get("ai4paper.translationvocabularyaudioplay")) {
        if (Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === '英式发音') {
          if (mp3EN.length > 0x0) {
            audioElement.setAttribute("src", mp3EN);
            volume != 0x1 && (audioElement.volume = volume);
            audioElement.play();
          } else {
            if (mp3US.length > 0x0) {
              audioElement.setAttribute("src", mp3US);
              volume != 0x1 && (audioElement.volume = volume);
              audioElement.play();
            } else mp3TTS.length > 0x0 && (audioElement.setAttribute("src", mp3TTS), volume != 0x1 && (audioElement.volume = volume), audioElement.play());
          }
        } else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === "美式发音") {
            if (mp3US.length > 0x0) {
              audioElement.setAttribute("src", mp3US);
              volume != 0x1 && (audioElement.volume = volume);
              audioElement.play();
            } else {
              if (mp3EN.length > 0x0) {
                audioElement.setAttribute('src', mp3EN);
                volume != 0x1 && (audioElement.volume = volume);
                audioElement.play();
              } else {
                if (mp3TTS.length > 0x0) {
                  audioElement.setAttribute("src", mp3TTS);
                  if (volume != 0x1) {
                    audioElement.volume = volume;
                  }
                  audioElement.play();
                }
              }
            }
          }
        }
      }
      phoneticEN === '' && (phoneticEN = '无');
      phoneticUS === '' && (phoneticUS = '无');
      pronunciationLine = "🔉 英  [" + phoneticEN + "]<br>🔉 美  [" + phoneticUS + "]<br>";
      resultLines.push(pronunciationLine);
      for (let i = 0x0; i < wordParts.length; i++) {
        if (i < wordParts.length - 0x1) partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',') + '<br>';else {
          partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',');
        }
        resultLines.push(partLine);
      }
      return partLine = resultLines.join(''), partLine;
    } else return -0x1;
  },
  'translateSidePaneVocabulary': async function (word) {
    if (!word) return -0x1;
    let volume = 0x1;
    if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '50') volume = 0.5;else {
      if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '30') volume = 0.3;else {
        if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '10') volume = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') volume = 0.05;else Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '1' && (volume = 0.01);
        }
      }
    }
    var cleanedWord = word.trim();
    cleanedWord = cleanedWord.toLowerCase();
    cleanedWord = cleanedWord.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    cleanedWord = cleanedWord.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    cleanedWord = cleanedWord.replace(/[0-9]/g, '');
    if (!cleanedWord.trim()) return -0x1;
    let icibaResult = {};
    try {
      const httpResponse = await Zotero.HTTP.request('GET', "https://www.iciba.com/word?w=" + cleanedWord, {
        'responseType': 'text'
      });
      httpResponse?.["status"] !== 0xc8 && Zotero.debug('Request\x20error:\x20' + httpResponse?.["status"]);
      let responseText = httpResponse.response;
      responseText && (icibaResult = Zotero.AI4Paper.parseIcibaWebSearch(responseText));
    } catch (e) {
      return Zotero.AI4Paper.showProgressWindow(0x5dc, "❌【金山词霸】自动查词", "未查询到该单词！请先联网。"), -0x1;
    }
    let phoneticEN = null,
      phoneticUS = null,
      mp3EN = null,
      mp3US = null,
      mp3TTS = null,
      wordParts = null,
      resultLines = [],
      partLine = '',
      pronunciationLine = '',
      joinedResult = '';
    try {
      phoneticEN = icibaResult.symbols[0x0].ph_en;
      phoneticUS = icibaResult.symbols[0x0].ph_am;
      mp3EN = icibaResult.symbols[0x0].ph_en_mp3;
      mp3US = icibaResult.symbols[0x0].ph_am_mp3;
      mp3TTS = icibaResult.symbols[0x0].ph_tts_mp3;
      wordParts = icibaResult.symbols[0x0].parts;
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return -0x1;
    }
    if (mp3EN.length > 0x0 || mp3US.length > 0x0 || mp3TTS.length > 0x0) {
      if (phoneticEN === '') {
        phoneticEN = '无';
      }
      phoneticUS === '' && (phoneticUS = '无');
      pronunciationLine = "🔉 英  [" + phoneticEN + "]\n🔉 美  [" + phoneticUS + ']\x0a';
      resultLines.push(pronunciationLine);
      for (let i = 0x0; i < wordParts.length; i++) {
        i < wordParts.length - 0x1 ? partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',') + '\x0a' : partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',');
        resultLines.push(partLine);
      }
      partLine = resultLines.join('');
      Zotero.AI4Paper.translateResponse = partLine;
      Zotero.AI4Paper.updateTranslateReaderSidePane();
      if (cleanedWord != Zotero.Prefs.get("ai4paper.selectedtexttrans")) {
        Zotero.Prefs.set("ai4paper.selectedtexttrans", cleanedWord);
        if (Zotero.Prefs.get("ai4paper.translationviewerenable")) {
          await Zotero.AI4Paper.updateTransViewerVocabulary(cleanedWord, partLine);
        }
      }
      return partLine;
    } else {
      return -0x1;
    }
  },
  'translateSidePaneAudioPlay': async function (word) {
    if (!word) return -0x1;
    let audioElement = window.document.createElementNS('http://www.w3.org/1999/xhtml', "audio"),
      volume = 0x1;
    if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '50') {
      volume = 0.5;
    } else {
      if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '30') volume = 0.3;else {
        if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '10') volume = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') volume = 0.05;else Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1' && (volume = 0.01);
        }
      }
    }
    var cleanedWord = word.trim();
    cleanedWord = cleanedWord.toLowerCase();
    cleanedWord = cleanedWord.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    cleanedWord = cleanedWord.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    cleanedWord = cleanedWord.replace(/[0-9]/g, '');
    if (!cleanedWord.trim()) return -0x1;
    let icibaResult = {};
    try {
      const httpResponse = await Zotero.HTTP.request('GET', "https://www.iciba.com/word?w=" + cleanedWord, {
        'responseType': "text"
      });
      httpResponse?.["status"] !== 0xc8 && Zotero.debug("Request error: " + httpResponse?.['status']);
      let responseText = httpResponse.response;
      responseText && (icibaResult = Zotero.AI4Paper.parseIcibaWebSearch(responseText));
    } catch (e) {
      return Zotero.AI4Paper.showProgressWindow(0x5dc, '❌【金山词霸】查词与发音', "未查询到该单词！请先联网。"), -0x1;
    }
    let phoneticEN = null,
      phoneticUS = null,
      mp3EN = null,
      mp3US = null,
      mp3TTS = null,
      wordParts = null,
      resultLines = [],
      partLine = '',
      pronunciationLine = '',
      joinedResult = '';
    try {
      phoneticEN = icibaResult.symbols[0x0].ph_en;
      phoneticUS = icibaResult.symbols[0x0].ph_am;
      mp3EN = icibaResult.symbols[0x0].ph_en_mp3;
      mp3US = icibaResult.symbols[0x0].ph_am_mp3;
      mp3TTS = icibaResult.symbols[0x0].ph_tts_mp3;
      wordParts = icibaResult.symbols[0x0].parts;
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return -0x1;
    }
    if (mp3EN.length > 0x0 || mp3US.length > 0x0 || mp3TTS.length > 0x0) {
      if (Zotero.AI4Paper.getFunMetaTitle()) {
        if (Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === "英式发音") {
          if (mp3EN.length > 0x0) {
            audioElement.setAttribute('src', mp3EN);
            volume != 0x1 && (audioElement.volume = volume);
            audioElement.play();
          } else {
            if (mp3US.length > 0x0) {
              audioElement.setAttribute("src", mp3US);
              volume != 0x1 && (audioElement.volume = volume);
              audioElement.play();
            } else {
              if (mp3TTS.length > 0x0) {
                audioElement.setAttribute("src", mp3TTS);
                volume != 0x1 && (audioElement.volume = volume);
                audioElement.play();
              }
            }
          }
        } else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === "美式发音") {
            if (mp3US.length > 0x0) {
              audioElement.setAttribute("src", mp3US);
              volume != 0x1 && (audioElement.volume = volume);
              audioElement.play();
            } else {
              if (mp3EN.length > 0x0) {
                audioElement.setAttribute("src", mp3EN);
                volume != 0x1 && (audioElement.volume = volume);
                audioElement.play();
              } else mp3TTS.length > 0x0 && (audioElement.setAttribute('src', mp3TTS), volume != 0x1 && (audioElement.volume = volume), audioElement.play());
            }
          }
        }
      }
      phoneticEN === '' && (phoneticEN = '无');
      phoneticUS === '' && (phoneticUS = '无');
      pronunciationLine = "🔉 英  [" + phoneticEN + "]\n🔉 美  [" + phoneticUS + ']\x0a';
      resultLines.push(pronunciationLine);
      for (let i = 0x0; i < wordParts.length; i++) {
        i < wordParts.length - 0x1 ? partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',') + '\x0a' : partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',');
        resultLines.push(partLine);
      }
      return partLine = resultLines.join(''), Zotero.AI4Paper.translateResponse = partLine, Zotero.AI4Paper.updateTranslateReaderSidePane(), partLine;
    } else return Zotero.AI4Paper.showProgressWindow(0x5dc, '❌【金山词霸】查词与发音', "哎呀，数据库中未查询到该单词！"), -0x1;
  },
  'selectionPopupButtonAudioPlay': async function (word, accentType) {
    if (!word) return -0x1;
    let audioElement = window.document.createElementNS("http://www.w3.org/1999/xhtml", "audio"),
      volume = 0x1;
    if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '50') volume = 0.5;else {
      if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '30') volume = 0.3;else {
        if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '10') volume = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') volume = 0.05;else Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1' && (volume = 0.01);
        }
      }
    }
    var cleanedWord = word.trim();
    cleanedWord = cleanedWord.toLowerCase();
    cleanedWord = cleanedWord.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    cleanedWord = cleanedWord.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    cleanedWord = cleanedWord.replace(/[0-9]/g, '');
    if (!cleanedWord.trim()) return -0x1;
    let icibaResult = {};
    try {
      const httpResponse = await Zotero.HTTP.request("GET", 'https://www.iciba.com/word?w=' + cleanedWord, {
        'responseType': "text"
      });
      httpResponse?.['status'] !== 0xc8 && Zotero.debug("Request error: " + httpResponse?.["status"]);
      let responseText = httpResponse.response;
      if (responseText) {
        icibaResult = Zotero.AI4Paper.parseIcibaWebSearch(responseText);
      }
    } catch (e) {
      return Zotero.AI4Paper.showProgressWindow(0x5dc, '❌【金山词霸】查词与发音', "未查询到该单词！请先联网。"), -0x1;
    }
    let phoneticEN = null,
      phoneticUS = null,
      mp3EN = null,
      mp3US = null,
      mp3TTS = null,
      wordParts = null,
      resultLines = [],
      partLine = '',
      pronunciationLine = '',
      joinedResult = '';
    try {
      phoneticEN = icibaResult.symbols[0x0].ph_en;
      phoneticUS = icibaResult.symbols[0x0].ph_am;
      mp3EN = icibaResult.symbols[0x0].ph_en_mp3;
      mp3US = icibaResult.symbols[0x0].ph_am_mp3;
      mp3TTS = icibaResult.symbols[0x0].ph_tts_mp3;
      wordParts = icibaResult.symbols[0x0].parts;
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return -0x1;
    }
    if (mp3EN.length > 0x0 || mp3US.length > 0x0 || mp3TTS.length > 0x0) {
      if (Zotero.AI4Paper.getFunMetaTitle()) {
        if (accentType === '英式发音') {
          if (mp3EN.length > 0x0) {
            audioElement.setAttribute('src', mp3EN);
            volume != 0x1 && (audioElement.volume = volume);
            audioElement.play();
          } else {
            if (mp3US.length > 0x0) {
              audioElement.setAttribute("src", mp3US);
              if (volume != 0x1) {
                audioElement.volume = volume;
              }
              audioElement.play();
            } else {
              if (mp3TTS.length > 0x0) {
                audioElement.setAttribute("src", mp3TTS);
                if (volume != 0x1) {
                  audioElement.volume = volume;
                }
                audioElement.play();
              }
            }
          }
        } else {
          if (accentType === '美式发音') {
            if (mp3US.length > 0x0) {
              audioElement.setAttribute("src", mp3US);
              volume != 0x1 && (audioElement.volume = volume);
              audioElement.play();
            } else {
              if (mp3EN.length > 0x0) {
                audioElement.setAttribute("src", mp3EN);
                volume != 0x1 && (audioElement.volume = volume);
                audioElement.play();
              } else {
                if (mp3TTS.length > 0x0) {
                  audioElement.setAttribute("src", mp3TTS);
                  if (volume != 0x1) {
                    audioElement.volume = volume;
                  }
                  audioElement.play();
                }
              }
            }
          }
        }
      }
      phoneticEN === '' && (phoneticEN = '无');
      phoneticUS === '' && (phoneticUS = '无');
      pronunciationLine = "🔉 英  [" + phoneticEN + "]\n🔉 美  [" + phoneticUS + ']\x0a';
      resultLines.push(pronunciationLine);
      for (let i = 0x0; i < wordParts.length; i++) {
        if (i < wordParts.length - 0x1) partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',') + '\x0a';else {
          partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',');
        }
        resultLines.push(partLine);
      }
      return partLine = resultLines.join(''), Zotero.AI4Paper.translateResponse = partLine, Zotero.AI4Paper.updateTranslateReaderSidePane(), partLine;
    } else return Zotero.AI4Paper.showProgressWindow(0x5dc, "❌【金山词霸】查词与发音", "哎呀，数据库中未查询到该单词！"), -0x1;
  },
  'annotationAudioPlay': async function (annotationText) {
    if (!annotationText) return window.alert("当前注释为空！"), -0x1;
    let audioElement = window.document.createElementNS("http://www.w3.org/1999/xhtml", "audio"),
      volume = 0x1;
    if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '50') volume = 0.5;else {
      if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '30') {
        volume = 0.3;
      } else {
        if (Zotero.Prefs.get('ai4paper.wordsaudiovolume') === '10') volume = 0.1;else {
          if (Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '5') volume = 0.05;else Zotero.Prefs.get("ai4paper.wordsaudiovolume") === '1' && (volume = 0.01);
        }
      }
    }
    var cleanedWord = annotationText.trim();
    cleanedWord = cleanedWord.toLowerCase();
    cleanedWord = cleanedWord.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    cleanedWord = cleanedWord.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    cleanedWord = cleanedWord.replace(/[0-9]/g, '');
    if (!cleanedWord.trim()) return -0x1;
    let icibaResult = {};
    try {
      const httpResponse = await Zotero.HTTP.request("GET", "https://www.iciba.com/word?w=" + cleanedWord, {
        'responseType': "text"
      });
      httpResponse?.["status"] !== 0xc8 && Zotero.debug("Request error: " + httpResponse?.["status"]);
      let responseText = httpResponse.response;
      responseText && (icibaResult = Zotero.AI4Paper.parseIcibaWebSearch(responseText));
    } catch (e) {
      return Zotero.AI4Paper.showProgressWindow(0x5dc, '❌【金山词霸】自动查词', "未查询到该单词！请先联网。"), -0x1;
    }
    let phoneticEN = null,
      phoneticUS = null,
      mp3EN = null,
      mp3US = null,
      mp3TTS = null,
      wordParts = null,
      compactLines = [],
      fullLines = [],
      partLine = '',
      fullPartLine = '',
      pronunciationCompact = '',
      pronunciationFull = '',
      joinedResult = '';
    try {
      phoneticEN = icibaResult.symbols[0x0].ph_en;
      phoneticUS = icibaResult.symbols[0x0].ph_am;
      mp3EN = icibaResult.symbols[0x0].ph_en_mp3;
      mp3US = icibaResult.symbols[0x0].ph_am_mp3;
      mp3TTS = icibaResult.symbols[0x0].ph_tts_mp3;
      wordParts = icibaResult.symbols[0x0].parts;
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return -0x1;
    }
    if (mp3EN.length > 0x0 || mp3US.length > 0x0 || mp3TTS.length > 0x0) {
      if (Zotero.AI4Paper.getFunMetaTitle()) {
        if (Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === '英式发音') {
          if (mp3EN.length > 0x0) {
            audioElement.setAttribute("src", mp3EN);
            if (volume != 0x1) {
              audioElement.volume = volume;
            }
            audioElement.play();
          } else {
            if (mp3US.length > 0x0) {
              audioElement.setAttribute('src', mp3US);
              volume != 0x1 && (audioElement.volume = volume);
              audioElement.play();
            } else {
              if (mp3TTS.length > 0x0) {
                audioElement.setAttribute("src", mp3TTS);
                volume != 0x1 && (audioElement.volume = volume);
                audioElement.play();
              }
            }
          }
        } else {
          if (Zotero.Prefs.get('ai4paper.wordsaudiopreferpronunciation') === "美式发音") {
            if (mp3US.length > 0x0) {
              audioElement.setAttribute("src", mp3US);
              volume != 0x1 && (audioElement.volume = volume);
              audioElement.play();
            } else {
              if (mp3EN.length > 0x0) {
                audioElement.setAttribute("src", mp3EN);
                if (volume != 0x1) {
                  audioElement.volume = volume;
                }
                audioElement.play();
              } else {
                if (mp3TTS.length > 0x0) {
                  audioElement.setAttribute("src", mp3TTS);
                  if (volume != 0x1) {
                    audioElement.volume = volume;
                  }
                  audioElement.play();
                }
              }
            }
          }
        }
      }
      phoneticEN === '' && (phoneticEN = '无');
      phoneticUS === '' && (phoneticUS = '无');
      pronunciationCompact = "🔉 英  [" + phoneticEN + "]，美  [" + phoneticUS + ']';
      compactLines.push(pronunciationCompact);
      pronunciationFull = "🔉 英  [" + phoneticEN + "]\n🔉 美  [" + phoneticUS + ']\x0a';
      fullLines.push(pronunciationFull);
      for (let i = 0x0; i < wordParts.length; i++) {
        partLine = "✔︎ " + wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',');
        compactLines.push(partLine);
        i < wordParts.length - 0x1 ? fullPartLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',') + '\x0a' : fullPartLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',');
        fullLines.push(fullPartLine);
      }
      return partLine = compactLines.join('\x20\x20'), fullPartLine = fullLines.join(''), Zotero.Prefs.get("ai4paper.translationreadersidepane") && (Zotero.AI4Paper.translateSourceText = cleanedWord, Zotero.AI4Paper.translateResponse = fullPartLine, Zotero.AI4Paper.updateTranslateReaderSidePane()), Zotero.AI4Paper.showProgressWindow(0x7d0, "✅ 播发单词发音 【AI4paper】", '' + partLine), cleanedWord != Zotero.Prefs.get("ai4paper.selectedtexttrans") && (Zotero.Prefs.set("ai4paper.selectedtexttrans", cleanedWord), Zotero.Prefs.get("ai4paper.translationviewerenable") && (await Zotero.AI4Paper.updateTransViewerVocabulary(cleanedWord, partLine))), partLine;
    } else return window.alert('哎呀，数据库中未查询到该单词！'), -0x1;
  },
  'addVocabulary': async function (annotation, selectedText) {
    var licenseHash = Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != licenseHash) return -0x1;
    var alreadyCollected = 0x0;
    if (selectedText.trim().indexOf('\x20') === -0x1) {
      let originalWord = selectedText.trim();
      selectedText = selectedText.trim().toLowerCase();
      selectedText = selectedText.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
      selectedText = selectedText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
      selectedText = selectedText.replace(/[0-9]/g, '');
      let search = new Zotero.Search();
      search.libraryID = Zotero.Libraries.userLibraryID;
      search.addCondition("itemType", 'is', 'note');
      search.addCondition("tag", 'is', "/生词本");
      let searchResults = await search.search(),
        noteItems = await Zotero.Items.getAsync(searchResults);
      if (noteItems.length != 0x0) {
        let noteItem = noteItems[0x0],
          noteContent = noteItem.getNote();
        if (noteContent.indexOf(annotation.key) != -0x1) {
          return false;
        }
        noteContent.indexOf('>' + selectedText + "</a>") != -0x1 && (Zotero.AI4Paper.showProgressWindow(0x4e20, "❌【重复收藏】", "生词本已存在该生词！无须重复收藏。", 'vocabulary'), alreadyCollected = 0x1);
      }
      let definition = await Zotero.AI4Paper.vocabularySearch(selectedText);
      if (definition && definition != -0x1) {
        return annotation.annotationComment = definition, Zotero.Prefs.get("ai4paper.vocabularyautoaddtags") && annotation.addTag("生词/单词"), await annotation.saveTx(), !alreadyCollected ? (Zotero.AI4Paper.showProgressWindow(0x1388, "【收藏生词】", selectedText + '：' + definition, "vocabulary"), Zotero.AI4Paper.addVocabulary2Note(annotation, selectedText, definition)) : annotation.annotationComment = '【已收藏】' + definition, await annotation.saveTx(), Zotero.Prefs.get('ai4paper.vocabularyAutoSync2Eudic') && (await Zotero.AI4Paper.syncWordsToEudic(originalWord)), true;
      }
    }
    await Zotero.AI4Paper.translationEngineTask(selectedText, 'vocabulary', annotation);
    Zotero.Prefs.get("ai4paper.vocabularyAutoSync2Eudic") && !Zotero.Prefs.get("ai4paper.vocabularyAutoSync2EudicOnlyWords") && (await Zotero.AI4Paper.syncWordsToEudic(selectedText.trim()));
  },
  'addVocabulary2Note': async function (annotation, word, definition) {
    word.indexOf('\x20') === -0x1 && (word = word.trim(), word = word.toLowerCase(), word = word.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, ''), word = word.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, ''), word = word.replace(/[0-9]/g, ''));
    var noteItem = await Zotero.AI4Paper.createNoteItem_basedOnTag(annotation, "/生词");
    if (noteItem) {
      let noteContent = noteItem.getNote(),
        pageIndex = JSON.parse(annotation.annotationPosition).pageIndex + 0x1,
        annotationLink = Zotero.AI4Paper.getAnnotationItemLink(annotation),
        wordLink = '<a\x20href=\x22' + annotationLink + '\x22>' + word + '</a>';
      if (noteContent.indexOf(annotation.key) != -0x1 || noteContent.indexOf('>' + word + '</a>') != -0x1) return false;
      if (noteContent.indexOf('</h2>') != -0x1) {
        let headerEnd = noteContent.indexOf("</h2>");
        noteContent = await noteContent.substring(headerEnd + 0x8);
      }
      let updatedNote = "<h2 style=\"color: purple;\">📙 生词>>>>>>></h2><p>" + wordLink + ':\x20' + (!Zotero.Prefs.get('ai4paper.vocabularyinlinecodestyle') ? definition : "<code> " + definition + '</code>') + "<p>" + noteContent;
      updatedNote = updatedNote.replace(/<p>>/, "<p>");
      noteItem.setNote(updatedNote);
      await Zotero.AI4Paper.add2VocabularyBook(annotation, word, definition);
      await noteItem.saveTx();
    }
  },
  'add2VocabularyBook': async function (annotation, word, definition) {
    word.indexOf('\x20') === -0x1 && (word = word.trim(), word = word.toLowerCase(), word = word.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, ''), word = word.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, ''), word = word.replace(/[0-9]/g, ''));
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition('itemType', 'is', 'note');
    search.addCondition("tag", 'is', "/生词本");
    var searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length === 0x0) {
      let newNote = new Zotero.Item("note");
      newNote.addTag("/生词本");
      newNote.saveTx();
      let pageIndex = JSON.parse(annotation.annotationPosition).pageIndex + 0x1,
        annotationLink = Zotero.AI4Paper.getAnnotationItemLink(annotation),
        wordLink = "<a href=\"" + annotationLink + '\x22>' + word + "</a>",
        noteHTML = '<h2\x20style=\x22color:\x20#00abeb;\x22>📘\x20生词本>>>>>>></h2><p>' + wordLink + ':\x20' + (!Zotero.Prefs.get("ai4paper.vocabularyinlinecodestyle") ? definition : '<code>\x20' + definition + "</code>") + '<p>';
      newNote.setNote(noteHTML);
      await newNote.saveTx();
    } else {
      let bookNote = noteItems[0x0],
        noteContent = bookNote.getNote(),
        pageIndex = JSON.parse(annotation.annotationPosition).pageIndex + 0x1,
        annotationLink = Zotero.AI4Paper.getAnnotationItemLink(annotation),
        wordLink = '<a\x20href=\x22' + annotationLink + '\x22>' + word + "</a>";
      if (noteContent.indexOf(annotation.key) != -0x1 || noteContent.indexOf('>' + word + '</a>') != -0x1) {
        return false;
      }
      if (noteContent.indexOf("</h2>") != -0x1) {
        let headerEnd = noteContent.indexOf('</h2>');
        noteContent = await noteContent.substring(headerEnd + 0x8);
      }
      let updatedNote = "<h2 style=\"color: #00abeb;\">📘 生词本>>>>>>></h2><p>" + wordLink + ':\x20' + (!Zotero.Prefs.get("ai4paper.vocabularyinlinecodestyle") ? definition : '<code>\x20' + definition + '</code>') + "<p>" + noteContent;
      updatedNote = updatedNote.replace(/<p>>/, '<p>');
      bookNote.setNote(updatedNote);
      await bookNote.saveTx();
    }
  },
  'modifyVocabularyNote': async function (annotation, oldKey) {
    annotation.annotationText.indexOf('\x20') === -0x1 && (annotation.annotationText = annotation.annotationText.trim(), annotation.annotationText = annotation.annotationText.toLowerCase(), annotation.annotationText = annotation.annotationText.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, ''), annotation.annotationText = annotation.annotationText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, ''), annotation.annotationText = annotation.annotationText.replace(/[0-9]/g, ''));
    var noteItem = Zotero.AI4Paper.findNoteItem_basedOnTag(annotation, "/生词");
    if (noteItem) {
      let noteContent = noteItem.getNote();
      if (noteContent.indexOf(oldKey) != -0x1) {
        let keyPos = noteContent.indexOf(oldKey),
          afterKey = noteContent.substring(keyPos),
          nextParaPos = afterKey.indexOf("<p>");
        if (afterKey.substring(nextParaPos + 0x2) != '>') var restContent = afterKey.substring(nextParaPos + 0x3);
        let beforeKey = noteContent.substring(0x0, keyPos),
          lastParaPos = beforeKey.lastIndexOf("<p>"),
          beforePara = beforeKey.substring(0x0, lastParaPos + 0x3),
          pageIndex = JSON.parse(annotation.annotationPosition).pageIndex + 0x1,
          annotationLink = Zotero.AI4Paper.getAnnotationItemLink(annotation),
          wordLink = "<a href=\"" + annotationLink + '\x22>' + annotation.annotationText + '</a>',
          entryHTML = wordLink + ':\x20' + (!Zotero.Prefs.get("ai4paper.vocabularyinlinecodestyle") ? annotation.annotationComment : "<code> " + annotation.annotationComment + '</code>') + "<p>";
        if (afterKey.substring(nextParaPos + 0x2) != '>') var updatedNote = beforePara + entryHTML + restContent;else var updatedNote = beforePara + entryHTML;
        noteItem.setNote(updatedNote);
        await noteItem.saveTx();
      }
    }
    Zotero.AI4Paper.modifyVocabularyNoteBook(annotation, oldKey);
  },
  'modifyVocabularyNoteBook': async function (annotation, oldKey) {
    annotation.annotationText.indexOf('\x20') === -0x1 && (annotation.annotationText = annotation.annotationText.trim(), annotation.annotationText = annotation.annotationText.toLowerCase(), annotation.annotationText = annotation.annotationText.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, ''), annotation.annotationText = annotation.annotationText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, ''), annotation.annotationText = annotation.annotationText.replace(/[0-9]/g, ''));
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("itemType", 'is', 'note');
    search.addCondition("tag", 'is', "/生词本");
    var searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length != 0x0) {
      let bookNote = noteItems[0x0],
        noteContent = bookNote.getNote();
      if (noteContent.indexOf(oldKey) != -0x1) {
        let keyPos = noteContent.indexOf(oldKey),
          afterKey = noteContent.substring(keyPos),
          nextParaPos = afterKey.indexOf("<p>");
        if (afterKey.substring(nextParaPos + 0x2) != '>') var restContent = afterKey.substring(nextParaPos + 0x3);
        let beforeKey = noteContent.substring(0x0, keyPos),
          lastParaPos = beforeKey.lastIndexOf('<p>'),
          beforePara = beforeKey.substring(0x0, lastParaPos + 0x3),
          pageIndex = JSON.parse(annotation.annotationPosition).pageIndex + 0x1,
          annotationLink = Zotero.AI4Paper.getAnnotationItemLink(annotation),
          wordLink = '<a\x20href=\x22' + annotationLink + '\x22>' + annotation.annotationText + "</a>",
          entryHTML = wordLink + ':\x20' + (!Zotero.Prefs.get("ai4paper.vocabularyinlinecodestyle") ? annotation.annotationComment : '<code>\x20' + annotation.annotationComment + "</code>") + "<p>";
        if (afterKey.substring(nextParaPos + 0x2) != '>') var updatedNote = beforePara + entryHTML + restContent;else var updatedNote = beforePara + entryHTML;
        bookNote.setNote(updatedNote);
        await bookNote.saveTx();
      }
    }
  },
  'removeVocabularyfromNote': async function (annotationKey) {
    let currentItem = Zotero.AI4Paper.getCurrentItem(true);
    if (!currentItem) return false;
    var noteItem = Zotero.AI4Paper.findNoteItem_basedOnTag(currentItem, '/生词');
    if (noteItem) {
      let noteContent = noteItem.getNote();
      if (noteContent.indexOf(annotationKey) != -0x1) {
        let keyPos = noteContent.indexOf(annotationKey),
          afterKey = noteContent.substring(keyPos),
          nextParaPos = afterKey.indexOf("<p>");
        if (afterKey.substring(nextParaPos + 0x2) != '>') {
          var restContent = afterKey.substring(nextParaPos + 0x3);
        }
        let beforeKey = noteContent.substring(0x0, keyPos),
          lastParaPos = beforeKey.lastIndexOf('<p>'),
          beforePara = beforeKey.substring(0x0, lastParaPos + 0x3);
        if (afterKey.substring(nextParaPos + 0x2) != '>') var updatedNote = beforePara + restContent;else var updatedNote = beforePara;
        noteItem.setNote(updatedNote);
        await Zotero.AI4Paper.removeVocabularyfromNoteBook(annotationKey);
        await noteItem.saveTx();
      }
    }
  },
  'removeVocabularyfromNoteBook': async function (annotationKey) {
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("itemType", 'is', "note");
    search.addCondition("tag", 'is', "/生词本");
    var searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length != 0x0) {
      let bookNote = noteItems[0x0],
        noteContent = bookNote.getNote();
      if (noteContent.indexOf(annotationKey) != -0x1) {
        let keyPos = noteContent.indexOf(annotationKey),
          afterKey = noteContent.substring(keyPos),
          nextParaPos = afterKey.indexOf("<p>");
        if (afterKey.substring(nextParaPos + 0x2) != '>') var restContent = afterKey.substring(nextParaPos + 0x3);
        let beforeKey = noteContent.substring(0x0, keyPos),
          lastParaPos = beforeKey.lastIndexOf("<p>"),
          beforePara = beforeKey.substring(0x0, lastParaPos + 0x3);
        if (afterKey.substring(nextParaPos + 0x2) != '>') var updatedNote = beforePara + restContent;else var updatedNote = beforePara;
        bookNote.setNote(updatedNote);
        await bookNote.saveTx();
      }
    }
  },
  'updateVocabularyAnnotation': async function (annotation, word, definition, alreadyCollected, title) {
    annotation.annotationComment = definition;
    if (!alreadyCollected) {
      Zotero.AI4Paper.showProgressWindow(0x1388, title, word + '：' + definition, "vocabulary");
      Zotero.AI4Paper.addVocabulary2Note(annotation, word, definition);
    } else annotation.annotationComment = "【已收藏】" + definition;
    if (Zotero.Prefs.get("ai4paper.vocabularyautoaddtags")) {
      if (Zotero.AI4Paper.checkPunctuation(word)) annotation.addTag("生词/例句");else {
        annotation.addTag("生词/短语");
      }
    }
    await annotation.saveTx();
  },
  'vocabularySearch': async function (word) {
    var cleanedWord = word.trim();
    cleanedWord = cleanedWord.toLowerCase();
    cleanedWord = cleanedWord.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
    cleanedWord = cleanedWord.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
    cleanedWord = cleanedWord.replace(/[0-9]/g, '');
    if (!cleanedWord.trim()) return -0x1;
    let icibaResult = {};
    try {
      const httpResponse = await Zotero.HTTP.request("GET", "https://www.iciba.com/word?w=" + cleanedWord, {
        'responseType': "text"
      });
      httpResponse?.["status"] !== 0xc8 && Zotero.debug("Request error: " + httpResponse?.["status"]);
      let responseText = httpResponse.response;
      if (responseText) {
        icibaResult = Zotero.AI4Paper.parseIcibaWebSearch(responseText);
      }
    } catch (e) {
      return -0x1;
    }
    let phoneticEN = null,
      phoneticUS = null,
      mp3EN = null,
      mp3US = null,
      mp3TTS = null,
      wordParts = null,
      resultLines = [],
      partLine = '',
      pronunciationLine = '',
      joinedResult = '';
    try {
      phoneticEN = icibaResult.symbols[0x0].ph_en;
      phoneticUS = icibaResult.symbols[0x0].ph_am;
      mp3EN = icibaResult.symbols[0x0].ph_en_mp3;
      mp3US = icibaResult.symbols[0x0].ph_am_mp3;
      mp3TTS = icibaResult.symbols[0x0].ph_tts_mp3;
      wordParts = icibaResult.symbols[0x0].parts;
      await new Promise(resolve => setTimeout(resolve, 0x32));
    } catch (e) {
      return -0x1;
    }
    if (mp3EN.length > 0x0 || mp3US.length > 0x0 || mp3TTS.length > 0x0) {
      phoneticEN === '' && (phoneticEN = '无');
      phoneticUS === '' && (phoneticUS = '无');
      pronunciationLine = "🔉 英  [" + phoneticEN + "]，美  [" + phoneticUS + ']\x0a';
      resultLines.push(pronunciationLine);
      for (let i = 0x0; i < wordParts.length; i++) {
        i < wordParts.length - 0x1 ? partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',') + '\x0a' : partLine = wordParts[i].part + '\x20\x20' + wordParts[i].means.join(',');
        resultLines.push(partLine);
      }
      return partLine = resultLines.join('\x20\x20'), partLine;
    } else {
      return -0x1;
    }
  },
  'openVocabularyBook': async function () {
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("itemType", 'is', 'note');
    search.addCondition("tag", 'is', "/生词本");
    var searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length === 0x0) {
      window.alert("您尚未创建生词本！添加第一个生词后，将自动创建生词本。");
    } else {
      let bookNote = noteItems[0x0];
      ZoteroPane_Local.selectItem(bookNote.itemID);
      Zotero_Tabs.select("zotero-pane");
      await Zotero.Promise.delay(0x64);
      var libraryID = ZoteroPane_Local.getSelectedLibraryID(),
        selectedItems = ZoteroPane_Local.getSelectedItems();
      if (!selectedItems || !selectedItems.length) return;
      var reportURL = "zotero://report/" + Zotero.API.getLibraryPrefix(libraryID) + "/items" + "?itemKey=" + selectedItems.map(item => item.key).join(',');
      Zotero.openInViewer(reportURL, {
        'allowJavaScript': false
      });
    }
  },
  'randomVocabulary': async function () {
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("itemType", 'is', "note");
    search.addCondition("tag", 'is', "/生词");
    var searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length === 0x0) window.alert("您尚未收藏任何生词！请添加第一个生词后，再使用本功能。");else {
      let randomIndex = Math.floor(Math.random() * noteItems.length),
        randomNote = noteItems[randomIndex];
      ZoteroPane_Local.selectItem(randomNote.itemID);
      Zotero_Tabs.select("zotero-pane");
      await Zotero.Promise.delay(0x64);
      var libraryID = ZoteroPane_Local.getSelectedLibraryID(),
        selectedItems = ZoteroPane_Local.getSelectedItems();
      if (!selectedItems || !selectedItems.length) {
        return;
      }
      var reportURL = "zotero://report/" + Zotero.API.getLibraryPrefix(libraryID) + '/items' + "?itemKey=" + selectedItems.map(item => item.key).join(',');
      Zotero.openInViewer(reportURL, {
        'allowJavaScript': false
      });
    }
  },
  'getVocabularyAllWords': async function () {
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("itemType", 'is', 'note');
    search.addCondition("tag", 'is', "/生词");
    var searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length === 0x0) return Zotero.AI4Paper.showProgressWindow(0x2710, "❌【更新生词库】", "未发现任何单词！"), false;
    var allNotesHTML = '';
    for (let noteItem of noteItems) {
      let noteContent = noteItem.getNote();
      allNotesHTML = allNotesHTML + '<p>' + noteContent;
    }
    var closingAnchorRegex = new RegExp("</a>", 'g'),
      anchorEndPositions = [],
      collectedWords = [],
      collectedLinks = [];
    while (closingAnchorRegex.exec(allNotesHTML) != null) {
      anchorEndPositions.push(closingAnchorRegex.lastIndex);
    }
    for (i = 0x0; i < anchorEndPositions.length; i++) {
      let beforeAnchorEnd = allNotesHTML.substring(0x0, anchorEndPositions[i] - 0x3),
        lastTagClose = beforeAnchorEnd.lastIndexOf('>'),
        wordText = '' + beforeAnchorEnd.substring(lastTagClose + 0x1, beforeAnchorEnd.length - 0x1),
        hrefStart = beforeAnchorEnd.lastIndexOf("href=\""),
        hrefSubstr = beforeAnchorEnd.substring(hrefStart),
        hrefEnd = hrefSubstr.lastIndexOf('\x22'),
        zoteroLink = '' + hrefSubstr.substring(0x6, hrefEnd);
      if (Zotero.Prefs.get('ai4paper.vocabularyreviewcontent') === "仅单词") wordText.indexOf('\x20') === -0x1 && (collectedWords.push(wordText), collectedLinks.push(zoteroLink));else {
        if (Zotero.Prefs.get('ai4paper.vocabularyreviewcontent') === '仅短语') wordText.indexOf('\x20') != -0x1 && !Zotero.AI4Paper.checkPunctuation(wordText) && (collectedWords.push(wordText), collectedLinks.push(zoteroLink));else {
          if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === "仅例句") wordText.indexOf('\x20') != -0x1 && Zotero.AI4Paper.checkPunctuation(wordText) && (collectedWords.push(wordText), collectedLinks.push(zoteroLink));else {
            if (Zotero.Prefs.get('ai4paper.vocabularyreviewcontent') === "仅短语和例句") wordText.indexOf('\x20') != -0x1 && (collectedWords.push(wordText), collectedLinks.push(zoteroLink));else {
              if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === '全部') {
                collectedWords.push(wordText);
                collectedLinks.push(zoteroLink);
              } else {
                if (wordText.indexOf('\x20') === -0x1) {
                  collectedWords.push(wordText);
                  collectedLinks.push(zoteroLink);
                }
              }
            }
          }
        }
      }
    }
    if (collectedWords.length != 0x0) {
      Zotero.Prefs.set('ai4paper.vocabularyallwords', collectedWords.join("<<<>>>"));
      Zotero.Prefs.set("ai4paper.vocabularywordszoterolink", collectedLinks.join("<<<>>>"));
      if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === "仅单词") {
        Zotero.AI4Paper.showProgressWindow(0x2710, '✅【更新生词库】', "更新成功！共有【" + collectedWords.length + "】个【单词】！");
      } else {
        if (Zotero.Prefs.get('ai4paper.vocabularyreviewcontent') === "仅短语") Zotero.AI4Paper.showProgressWindow(0x2710, "✅【更新生词库】", "更新成功！共有【" + collectedWords.length + '】个【短语】！');else {
          if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === "仅例句") Zotero.AI4Paper.showProgressWindow(0x2710, "✅【更新生词库】", '更新成功！共有【' + collectedWords.length + "】个【例句】！");else {
            if (Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === "仅短语和例句") Zotero.AI4Paper.showProgressWindow(0x2710, "✅【更新生词库】", "更新成功！共有【" + collectedWords.length + '】个【短语和例句】！');else Zotero.Prefs.get("ai4paper.vocabularyreviewcontent") === '全部' ? Zotero.AI4Paper.showProgressWindow(0x2710, "✅【更新生词库】", "更新成功！共有【" + collectedWords.length + '】个生词！') : Zotero.AI4Paper.showProgressWindow(0x2710, '✅【更新生词库】', "更新成功！共有【" + collectedWords.length + "】个【单词】！");
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
    let tabID = Zotero_Tabs._selectedID;
    const reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) return;
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      return false;
    }
    var sidePaneWindow;
    if (window.document.getElementById('ai4paper-translate-readersidepane')) {
      sidePaneWindow = window.document.getElementById('ai4paper-translate-readersidepane').contentWindow;
    } else {
      return false;
    }
    let allWords = Zotero.Prefs.get('ai4paper.vocabularyallwords').split("<<<>>>"),
      allLinks = Zotero.Prefs.get("ai4paper.vocabularywordszoterolink").split('<<<>>>');
    if (allWords.length) {
      let randomIndex = Math.floor(Math.random() * allWords.length),
        randomWord = allWords[randomIndex];
      Zotero.AI4Paper.translateSourceText = randomWord;
      Zotero.AI4Paper.vocabularyzoterolink = allLinks[randomIndex];
      sidePaneWindow.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = randomWord;
      Zotero.AI4Paper.translateResponse = '';
      if (Zotero.Prefs.get("ai4paper.vocabularyreviewgiveinterpretation")) Zotero.AI4Paper.giveVocabulayInterpretation(randomWord);else {
        sidePaneWindow.document.getElementById("ai4paper-translate-readerSidePane-response").value = Zotero.AI4Paper.translateResponse;
      }
    }
  },
  'giveVocabulayInterpretation': async function (word) {
    if (!word) return false;
    if (Zotero.AI4Paper.isChineseText(word)) return false;
    if (Zotero.Prefs.get('ai4paper.translationvocabularyfirst')) {
      if (word.indexOf('\x20') === -0x1) {
        word = word.trim();
        word = word.toLowerCase();
        word = word.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
        word = word.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
        word = word.replace(/[0-9]/g, '');
        let vocabResult = await Zotero.AI4Paper.translateSidePaneVocabulary(word);
        if (vocabResult && vocabResult != -0x1) return -0x1;
      }
    }
    Zotero.AI4Paper.translationEngineTask(word, 'onSelect');
  },
  'openVocabularyZoteroLink': function (zoteroLink) {
    try {
      ZoteroPane.loadURI(zoteroLink);
    } catch (e) {
      window.alert("链接无效！");
    }
  },
  'exportVocabularyTXT': async function (filterType) {
    let filteredWords = await this.filterVocabulary_EudicShanbei_Words(filterType);
    if (!filteredWords) {
      return;
    }
    var {
      FilePicker: FilePicker
    } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
    const filePicker = new FilePicker();
    filePicker.displayDirectory = OS.Constants.Path.homeDir;
    filePicker.init(window, "Export vocabulary in txt...", filePicker.modeSave);
    filePicker.appendFilter('Text', '*.txt');
    let now = new Date(),
      dateStr = now.toLocaleDateString().replace(/\//g, '-'),
      defaultName = "生词（" + filterType + '）' + dateStr;
    filePicker.defaultString = defaultName + ".txt";
    const pickerResult = await filePicker.show();
    if (pickerResult == filePicker.returnOK || pickerResult == filePicker.returnReplace) {
      let filePath = filePicker.file;
      filePath.split('.').pop().toLowerCase() != "txt" && (filePath += ".txt");
      await Zotero.File.putContentsAsync(filePath, filteredWords.join('\x0a'));
      Zotero.AI4Paper.showProgressWindow(0xbb8, "导出生词（" + filterType + "）【AI4paper】", "✅ 成功导出【" + filteredWords.length + "】个生词（" + filterType + "）至【" + filePath + '】！');
      if (await OS.File.exists(filePath)) {
        let file = Zotero.File.pathToFile(filePath);
        try {
          file.reveal();
        } catch (e) {}
      }
    }
  },
  'exportVocabulary2Anki': async function (filterType) {
    let ankiLines = await this.filterVocabulary_Anki_HTML(filterType);
    if (!ankiLines) return;
    var {
      FilePicker: FilePicker
    } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
    const filePicker = new FilePicker();
    filePicker.displayDirectory = OS.Constants.Path.homeDir;
    filePicker.init(window, "Export vocabulary in txt...", filePicker.modeSave);
    filePicker.appendFilter("Text", "*.txt");
    let now = new Date(),
      dateStr = now.toLocaleDateString().replace(/\//g, '-'),
      defaultName = 'Anki\x20生词（' + filterType + '）' + dateStr;
    filePicker.defaultString = defaultName + ".txt";
    const pickerResult = await filePicker.show();
    if (pickerResult == filePicker.returnOK || pickerResult == filePicker.returnReplace) {
      let filePath = filePicker.file;
      filePath.split('.').pop().toLowerCase() != 'txt' && (filePath += ".txt");
      await Zotero.File.putContentsAsync(filePath, ankiLines.join('\x0a'));
      Zotero.AI4Paper.showProgressWindow(0xbb8, '导出\x20Anki\x20生词（' + filterType + "）【AI4paper】", '✅\x20成功导出【' + ankiLines.length + "】个生词（" + filterType + '）至【' + filePath + '】！');
      if (await OS.File.exists(filePath)) {
        let file = Zotero.File.pathToFile(filePath);
        try {
          file.reveal();
        } catch (e) {}
      }
    }
  },
  'exportVocabulary2Eudic': async function (filterType) {
    let filteredWords = await this.filterVocabulary_EudicShanbei_Words(filterType);
    if (!filteredWords) {
      return;
    }
    if (Zotero.Prefs.get('ai4paper.eudicAPIKey') === '') return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 请配置【欧路词典 API】", "请先前往【AI4paper 设置 --> 生词】输入 欧路词典 API-Key！"), -0x1;
    if (Zotero.Prefs.get("ai4paper.eudicCategoryID") === '') return Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20请配置【欧路词典\x20API】', "请先前往【AI4paper 设置 --> 生词 --> 欧路词典 API】输入生词本 ID！输入 0，代表使用默认生词本。"), -0x1;
    var apiKey = Zotero.Prefs.get("ai4paper.eudicAPIKey").trim(),
      catID = Zotero.Prefs.get("ai4paper.eudicCategoryID").trim(),
      apiUrl = "https://api.frdic.com/api/open/v1/studylist/words",
      requestBody = {
        'id': catID,
        'language': 'en',
        'words': filteredWords
      };
    let response;
    try {
      let httpResponse = await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
      httpResponse.response.message ? (Zotero.AI4Paper.showProgressWindow(0x7d0, '✅【同步生词（' + filterType + "）至欧路词典】", '' + httpResponse.response.message), Zotero.AI4Paper.changeAudioPlayPopupButtonName()) : Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 同步失败", "同步生词失败！");
    } catch (e) {
      window.alert(e);
    }
  },
  'filterVocabulary_EudicShanbei_Words': async function (filterType) {
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("itemType", 'is', "note");
    search.addCondition("tag", 'is', '/生词');
    var searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length === 0x0) {
      return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌【导出生词（" + filterType + '）】', "未发现任何生词（" + filterType + '）！'), false;
    }
    var allNotesHTML = '';
    for (let noteItem of noteItems) {
      let noteContent = noteItem.getNote();
      allNotesHTML = allNotesHTML + "<p>" + noteContent;
    }
    var closingAnchorRegex = new RegExp('</a>', 'g'),
      anchorEndPositions = [],
      collectedWords = [],
      collectedLinks = [];
    while (closingAnchorRegex.exec(allNotesHTML) != null) {
      anchorEndPositions.push(closingAnchorRegex.lastIndex);
    }
    for (i = 0x0; i < anchorEndPositions.length; i++) {
      let beforeAnchorEnd = allNotesHTML.substring(0x0, anchorEndPositions[i] - 0x3),
        lastTagClose = beforeAnchorEnd.lastIndexOf('>'),
        wordText = '' + beforeAnchorEnd.substring(lastTagClose + 0x1, beforeAnchorEnd.length - 0x1),
        hrefStart = beforeAnchorEnd.lastIndexOf('href=\x22'),
        hrefSubstr = beforeAnchorEnd.substring(hrefStart),
        hrefEnd = hrefSubstr.lastIndexOf('\x22'),
        zoteroLink = '' + hrefSubstr.substring(0x6, hrefEnd);
      if (filterType === "仅单词") wordText.indexOf('\x20') === -0x1 && (collectedWords.push(wordText), collectedLinks.push(zoteroLink));else {
        if (filterType === "仅短语") {
          if (wordText.indexOf('\x20') != -0x1 && !Zotero.AI4Paper.checkPunctuation(wordText)) {
            collectedWords.push(wordText);
            collectedLinks.push(zoteroLink);
          }
        } else {
          if (filterType === "仅例句") {
            wordText.indexOf('\x20') != -0x1 && Zotero.AI4Paper.checkPunctuation(wordText) && (collectedWords.push(wordText), collectedLinks.push(zoteroLink));
          } else {
            if (filterType === "仅短语和例句") wordText.indexOf('\x20') != -0x1 && (collectedWords.push(wordText), collectedLinks.push(zoteroLink));else {
              if (filterType === '全部') {
                collectedWords.push(wordText);
                collectedLinks.push(zoteroLink);
              } else {
                wordText.indexOf('\x20') === -0x1 && (collectedWords.push(wordText), collectedLinks.push(zoteroLink));
              }
            }
          }
        }
      }
    }
    if (collectedWords.length != 0x0) {
      return collectedWords;
    } else return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌【导出生词（" + filterType + '）】', "您的生词本中无任何【生词（" + filterType + "）】！"), false;
  },
  'filterVocabulary_Anki_HTML': async function (filterType) {
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("itemType", 'is', "note");
    search.addCondition('tag', 'is', "/生词");
    var searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length === 0x0) return Zotero.AI4Paper.showProgressWindow(0xbb8, '❌【导出生词（' + filterType + '）】', '未发现任何生词（' + filterType + '）！'), false;
    var allNotesHTML = '';
    for (let noteItem of noteItems) {
      let noteContent = noteItem.getNote();
      allNotesHTML = allNotesHTML + "<p>" + noteContent;
    }
    var closingAnchorRegex = new RegExp("</a>", 'g'),
      anchorEndPositions = [],
      ankiLines = [],
      ankiLinks = [];
    while (closingAnchorRegex.exec(allNotesHTML) != null) {
      anchorEndPositions.push(closingAnchorRegex.lastIndex);
    }
    for (i = 0x0; i < anchorEndPositions.length; i++) {
      let beforeAnchorEnd = allNotesHTML.substring(0x0, anchorEndPositions[i] - 0x3),
        lastTagClose = beforeAnchorEnd.lastIndexOf('>'),
        wordText = '' + beforeAnchorEnd.substring(lastTagClose + 0x1, beforeAnchorEnd.length - 0x1),
        afterAnchorEnd = allNotesHTML.substring(anchorEndPositions[i]),
        definitionText = "undefined";
      if (afterAnchorEnd.indexOf(':\x20<code>') === 0x0) {
        let codeEnd = afterAnchorEnd.indexOf("</code>"),
          codeSection = afterAnchorEnd.substring(0x0, codeEnd),
          codeStart = codeSection.indexOf("<code>");
        definitionText = '' + codeSection.substring(codeStart + 0x6).trim();
      } else {
        if (afterAnchorEnd.indexOf("<p>") != -0x1) {
          let nextParaPos = afterAnchorEnd.indexOf("<p>");
          definitionText = '' + afterAnchorEnd.substring(0x1, nextParaPos).trim();
        }
      }
      let hrefStart = beforeAnchorEnd.lastIndexOf("href=\""),
        hrefSubstr = beforeAnchorEnd.substring(hrefStart),
        hrefEnd = hrefSubstr.lastIndexOf('\x22'),
        zoteroLink = '' + hrefSubstr.substring(0x6, hrefEnd);
      if (filterType === "仅单词") wordText.indexOf('\x20') === -0x1 && ankiLines.push(wordText + '\x09' + definitionText.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, "<br>") + " <a href=\"" + zoteroLink + "\">🔗</a>");else {
        if (filterType === '仅短语') wordText.indexOf('\x20') != -0x1 && !Zotero.AI4Paper.checkPunctuation(wordText) && ankiLines.push(wordText + '\x09' + definitionText.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, "<br>") + " <a href=\"" + zoteroLink + "\">🔗</a>");else {
          if (filterType === "仅例句") wordText.indexOf('\x20') != -0x1 && Zotero.AI4Paper.checkPunctuation(wordText) && ankiLines.push(wordText + '\x09' + definitionText.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, "<br>") + " <a href=\"" + zoteroLink + "\">🔗</a>");else {
            if (filterType === "仅短语和例句") wordText.indexOf('\x20') != -0x1 && ankiLines.push(wordText + '\x09' + definitionText.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, '<br>') + " <a href=\"" + zoteroLink + "\">🔗</a>");else filterType === '全部' ? ankiLines.push(wordText + '\x09' + definitionText.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, '<br>') + " <a href=\"" + zoteroLink + '\x22>🔗</a>') : wordText.indexOf('\x20') === -0x1 && ankiLines.push(wordText + '\x09' + definitionText.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, "<br>") + " <a href=\"" + zoteroLink + "\">🔗</a>");
          }
        }
      }
    }
    if (ankiLines.length != 0x0) {
      return [...new Set(ankiLines)];
    } else return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌【导出生词（" + filterType + '）】', "未发现任何生词（" + filterType + '）！'), false;
  },
  'filterVocabulary_Anki': async function () {
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("itemType", 'is', "note");
    search.addCondition("tag", 'is', '/生词');
    var searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length === 0x0) return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌【导出生词及其释义（Anki）】", '未发现任何生词！'), false;
    var allNotesHTML = '';
    for (let noteItem of noteItems) {
      let noteContent = noteItem.getNote();
      allNotesHTML = allNotesHTML + "<p>" + noteContent;
    }
    var closingAnchorRegex = new RegExp("</a>", 'g'),
      anchorEndPositions = [],
      ankiLines = [];
    while (closingAnchorRegex.exec(allNotesHTML) != null) {
      anchorEndPositions.push(closingAnchorRegex.lastIndex);
    }
    for (i = 0x0; i < anchorEndPositions.length; i++) {
      let beforeAnchorEnd = allNotesHTML.substring(0x0, anchorEndPositions[i] - 0x3),
        lastTagClose = beforeAnchorEnd.lastIndexOf('>'),
        wordText = '' + beforeAnchorEnd.substring(lastTagClose + 0x1, beforeAnchorEnd.length - 0x1),
        afterAnchorEnd = allNotesHTML.substring(anchorEndPositions[i]),
        definitionText = "undefined";
      if (afterAnchorEnd.indexOf('</code>') != -0x1) {
        let codeEnd = afterAnchorEnd.indexOf("</code>"),
          codeSection = afterAnchorEnd.substring(0x0, codeEnd),
          codeStart = codeSection.indexOf("<code>");
        definitionText = '' + codeSection.substring(codeStart + 0x6).trim();
      } else {
        if (afterAnchorEnd.indexOf("<p>") != -0x1) {
          let nextParaPos = afterAnchorEnd.indexOf("<p>");
          definitionText = '' + afterAnchorEnd.substring(0x1, nextParaPos).trim();
        }
      }
      ankiLines.push(wordText + '\x09' + definitionText.replace(/<\/p>/g, '').replace(/<p>/g, '').replace(/\n+/g, '\x20'));
    }
    return ankiLines.length != 0x0 ? [...new Set(ankiLines)] : (Zotero.AI4Paper.showProgressWindow(0xbb8, "❌【导出生词及其释义（Anki）】", "您的生词本中无任何【生词】！"), false);
  },
});
