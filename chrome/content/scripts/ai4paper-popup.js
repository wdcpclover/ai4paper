Object.assign(Zotero.AI4Paper, {
  'getImageDataURL': async function (param253) {
    let var2088,
      var2089 = Zotero.Prefs.get("extensions.zotero.dataDir", true),
      var2090 = Zotero.AI4Paper.checkGroupLibItem(param253.parentItem);
    if (var2090) {
      var2088 = var2089 + '\x5ccache\x5cgroups\x5c' + var2090 + '\x5c' + param253.key + ".png";
      (Zotero.isMac || Zotero.isLinux) && (var2088 = var2089 + "/cache/groups/" + var2090 + '/' + param253.key + '.png');
    } else {
      var2088 = var2089 + "\\cache\\library\\" + param253.key + ".png";
      if (Zotero.isMac || Zotero.isLinux) {
        var2088 = var2089 + '/cache/library/' + param253.key + '.png';
      }
    }
    if (var2088 && (await OS.File.exists(var2088))) {
      let var2091 = await Zotero.File.getBinaryContentsAsync(var2088),
        var2092 = 'data:image/png;base64,' + btoa(var2091);
      return var2092;
    }
    return false;
  },
  'onSelectText': async function (param268, param269) {
    let var2142 = this.selectedText(param269).trim();
    if ([Zotero.Prefs.get("ai4paper.enabelColorLabel"), Zotero.Prefs.get("ai4paper.translationSelectionPopupTextArea"), Zotero.Prefs.get('ai4paper.gptviewSelectionPopupChatGPT'), Zotero.Prefs.get('ai4paper.metasoSelectionPopupButton'), Zotero.Prefs.get('ai4paper.translationSelectionPopup'), Zotero.Prefs.get('ai4paper.audioPlaySelectionPopupButton'), Zotero.Prefs.get("ai4paper.addWordsToEudicSelectionPopupButton")].includes(true)) {
      Zotero.AI4Paper.buildPopupButton(var2142);
    }
    if (!var2142) return false;
    if (!param268.target || !param268.target.closest || param268.target.tagName === 'TEXTAREA') return false;
    if (this.getReaderItemContentType(param269) === "application/pdf") {
      if (!(param268.target.closest(".pdfViewer") && !param268.target.querySelector(".page"))) return false;
    } else {
      if (this.getReaderItemContentType(param269) === "text/html") {
        if (param268.target.closest("#annotations") && param268.target.closest(".annotations")) return false;
      } else {
        if (this.getReaderItemContentType(param269) === 'application/epub+zip') {
          if (!(param268.target.closest(".flow-mode-paginated") && !param268.target.querySelector("#annotation-overlay"))) return false;
        }
      }
    }
    Zotero.Prefs.get("ai4paper.translationcrossparagraphs") && (var2142 = '' + Zotero.Prefs.get("ai4paper.selectedtexttrans") + (var2142 ? '\x20' + var2142 : var2142));
    if (!var2142) return false;
    let var2143 = var2142;
    if (Zotero.Prefs.get("ai4paper.translationignorechinese")) {
      if (Zotero.AI4Paper.isChineseText(var2142)) return false;
    }
    if (var2142 != Zotero.Prefs.get("ai4paper.selectedtexttrans") && Zotero.Prefs.get("ai4paper.translationremoveduplicated") || !Zotero.Prefs.get('ai4paper.translationremoveduplicated')) {
      if (Zotero.AI4Paper.getFunMetaTitle()) {
        if (Zotero.Prefs.get("ai4paper.translationvocabularyfirst")) {
          if (var2142.indexOf('\x20') === -0x1) {
            Zotero.AI4Paper.updateTranslationPopupTextAreaPlaceHolder();
            Zotero.Prefs.get("ai4paper.translationreadersidepane") && (Zotero.AI4Paper.translateSourceText = var2143, Zotero.AI4Paper.translateResponse = '', Zotero.AI4Paper.updateTranslateReaderSidePane());
            var2142 = var2142.trim();
            var2142 = var2142.toLowerCase();
            var2142 = var2142.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
            var2142 = var2142.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
            var2142 = var2142.replace(/[0-9]/g, '');
            let var2144 = await Zotero.AI4Paper.vocabularySearchTrans(var2142);
            if (var2144 && var2144 != -0x1) {
              Zotero.Prefs.set("ai4paper.selectedtexttrans", var2143);
              Zotero.Prefs.get("ai4paper.translationreadersidepane") && (Zotero.AI4Paper.translateResponse = var2144.replace(/<br>/g, '\x0a'), Zotero.AI4Paper.updateTranslateReaderSidePane());
              if (Zotero.Prefs.get("ai4paper.translationSelectionPopupTextArea")) {
                Zotero.AI4Paper.updateTranslationPopupTextArea(var2144.replace(/<br>/g, '\x0a'));
              }
              return Zotero.AI4Paper.vocabulary2TransNote(var2142, var2144), -0x1;
            } else !Zotero.Prefs.get('ai4paper.selectedtexttransenable') && (Zotero.AI4Paper.showProgressWindow(0x5dc, "❌【金山词霸】" + var2142, "哎呀，未查询到该单词！", "iciba"), Zotero.AI4Paper.updateTranslationPopupTextArea('❌【金山词霸】哎呀，未查询到该单词！'));
          }
        }
        Zotero.Prefs.get("ai4paper.selectedtexttransenable") && (Zotero.AI4Paper.updateTranslationPopupTextAreaPlaceHolder(), Zotero.Prefs.get("ai4paper.translationreadersidepane") && (Zotero.AI4Paper.translateSourceText = var2143, Zotero.AI4Paper.translateResponse = '', Zotero.AI4Paper.updateTranslateReaderSidePane()), Zotero.Prefs.set("ai4paper.selectedtexttrans", var2143), Zotero.AI4Paper.translationEngineTask(var2143, 'onSelect'));
      }
    }
  },
  'selectedText': function (param270) {
    var var2145, var2146;
    if (!param270) return '';
    if (param270._internalReader._type === 'pdf') {
      const _0x232268 = param270._internalReader._lastView._selectionRanges;
      return ((var2145 = param270._internalReader._lastView._getAnnotationFromSelectionRanges(_0x232268, "highlight")) === null || var2145 === undefined ? undefined : var2145.text) || '';
    }
    return ((var2146 = param270._internalReader._lastView._getAnnotationFromTextSelection("highlight")) === null || var2146 === undefined ? undefined : var2146.text) || '';
  },
  'getSelectedText': function () {
    let var2148 = Zotero.AI4Paper.getCurrentReader();
    var var2149, var2150;
    if (!var2148) {
      return '';
    }
    if (var2148._internalReader._type === "pdf") {
      const _0x69b9a1 = var2148._internalReader._lastView._selectionRanges;
      return ((var2149 = var2148._internalReader._lastView._getAnnotationFromSelectionRanges(_0x69b9a1, "highlight")) === null || var2149 === undefined ? undefined : var2149.text) || '';
    }
    return ((var2150 = var2148._internalReader._lastView._getAnnotationFromTextSelection('highlight')) === null || var2150 === undefined ? undefined : var2150.text) || '';
  },
  'buildPopupButton': async function (param271) {
    if (!Zotero.AI4Paper.betterURL()) {
      return;
    }
    await new Promise(_0xbaac5b => setTimeout(_0xbaac5b, 0x5));
    let var2152 = Zotero_Tabs._selectedID;
    var var2153 = Zotero.Reader.getByTabID(var2152);
    if (!var2153) return false;
    let var2154 = var2153._iframeWindow.document.querySelector(".selection-popup");
    if (!var2154) {
      return;
    }
    let var2155 = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")['matches'],
      var2156 = !var2155 ? "#fffef2" : "#545454";
    if (Zotero.Prefs.get("ai4paper.enabelColorLabel") && var2154.getAttribute('add-color-label') != "true") {
      var2154.setAttribute("add-color-label", 'true');
      var2154.style.maxWidth = '1000px';
      let var2157 = 0x0,
        var2158 = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get('ai4paper.redColorLabel'), Zotero.Prefs.get("ai4paper.greenColorLabel"), Zotero.Prefs.get('ai4paper.blueColorLabel'), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get('ai4paper.orangeColorLabel'), Zotero.Prefs.get("ai4paper.grayColorLabel")],
        var2159 = ["#ffd400", "#ff6666", "#5fb236", "#2ea8e5", '#a28ae5', "#e56eee", "#f19837", "#aaaaaa"],
        var2160 = var2154.childNodes[0x0].childNodes;
      for (var2157 = 0x0; var2157 < 0x8; var2157++) {
        let var2161 = var2154.childNodes[0x0].childNodes[var2157],
          var2162 = var2161.innerHTML;
        var2161.style.width = "auto";
        let var2163 = var2154.ownerDocument.createElement("span");
        var2163.textContent = var2158[var2157];
        var2163.style.color = var2159[var2157];
        var2163.style.marginLeft = "1px";
        var2163.style.marginRight = "1px";
        var2163.style.cursor = "default";
        var2161.innerHTML = '' + var2162 + var2163.outerHTML;
        var2161.title = var2158[var2157];
      }
    }
    if ([Zotero.Prefs.get("ai4paper.gptviewSelectionPopupChatGPT"), Zotero.Prefs.get('ai4paper.metasoSelectionPopupButton'), Zotero.Prefs.get("ai4paper.translationSelectionPopup"), Zotero.Prefs.get("ai4paper.audioPlaySelectionPopupButton"), Zotero.Prefs.get("ai4paper.addWordsToEudicSelectionPopupButton")].includes(true) && var2154.getAttribute("ai4paper-popup-button-div") != "true") {
      var2154.setAttribute('ai4paper-popup-button-div', "true");
      let var2164 = var2154.ownerDocument.createElement("button");
      var2164.style.display = "inline-block";
      var2164.style.borderRadius = '5px';
      var2164.setAttribute("class", "toolbar-button wide-button ai4paper-popup-button-div ai4paper-popup-element");
      if (Zotero.Prefs.get("ai4paper.translationSelectionPopup")) {
        let var2165 = var2154.ownerDocument.createElement("button");
        var2165.setAttribute("title", '翻译');
        var2165.setAttribute('id', 'ai4paper-translate-popup-button');
        var2165.setAttribute("class", "ai4paper-translate-button ai4paper-popup-element ai4paper-popup-button");
        var2165.style.display = "inline";
        var2165.style.width = "30px";
        var2165.style.borderRadius = "5px";
        var2165.style.paddingTop = "3px";
        var2165.style.marginRight = '5px';
        var2165.style.marginLeft = "5px";
        Zotero.Prefs.get("ai4paper.translationcrossparagraphs") && !Zotero.Prefs.get('ai4paper.selectedtexttransenable') ? var2165.innerHTML = Zotero.AI4Paper.svg_icon_16px.translationSelectionPopup_purple : var2165.innerHTML = Zotero.AI4Paper.svg_icon_16px.translationSelectionPopup;
        var2165.addEventListener("mouseover", _0x301373 => {
          var2165.style.backgroundColor = var2156;
        });
        var2165.addEventListener("mouseout", _0x53b639 => {
          var2165.style.backgroundColor = '';
        });
        var2165.addEventListener("click", _0x2f2c67 => {
          Zotero.AI4Paper.onClickButton_Translate(param271.trim());
        });
        var2164.appendChild(var2165);
      }
      if (Zotero.Prefs.get('ai4paper.gptviewSelectionPopupChatGPT')) {
        let var2166 = var2154.ownerDocument.createElement("button");
        var2166.setAttribute("title", 'GPT');
        var2166.setAttribute('id', "ai4paper-chatgpt-popup-button");
        var2166.setAttribute("class", "ai4paper-chatgpt-button ai4paper-popup-element ai4paper-popup-button");
        var2166.style.display = 'inline';
        var2166.style.width = "30px";
        var2166.style.borderRadius = '5px';
        var2166.style.paddingTop = "3px";
        var2166.style.marginRight = "5px";
        var2166.style.marginLeft = "5px";
        Zotero.Prefs.get("ai4paper.gptMergeSelectedText") && Zotero.Prefs.get("ai4paper.gptMergeSelectedTextEnable") ? var2166.innerHTML = Zotero.AI4Paper.svg_icon_16px.gptviewSelectionPopupChatGPT_purple : var2166.innerHTML = Zotero.AI4Paper.svg_icon_16px.gptviewSelectionPopupChatGPT;
        var2166.addEventListener("mouseover", _0x5a8420 => {
          var2166.style.backgroundColor = var2156;
        });
        var2166.addEventListener("mouseout", _0x410e98 => {
          var2166.style.backgroundColor = '';
        });
        var2166.onclick = _0x3fb046 => {
          if (_0x3fb046.shiftKey) Zotero.Prefs.get("ai4paper.action4SelectionPopupChatGPT") === '填充选中文本至消息框' ? (Zotero.AI4Paper.expandReaderContextPane(), Zotero.AI4Paper.focusReaderSidePane("gpt"), Zotero.AI4Paper.onClickButton_nowChatGPT(param271)) : (Zotero.AI4Paper.expandReaderContextPane(), Zotero.AI4Paper.focusReaderSidePane("gpt"), Zotero.AI4Paper.onClickButton_ChatGPT(param271));else {
            if (Zotero.Prefs.get("ai4paper.action4SelectionPopupChatGPT") === "填充选中文本至消息框") {
              Zotero.AI4Paper.expandReaderContextPane();
              Zotero.AI4Paper.focusReaderSidePane("gpt");
              Zotero.AI4Paper.onClickButton_ChatGPT(param271);
            } else {
              if (Zotero.Prefs.get("ai4paper.action4SelectionPopupChatGPT") === "直接发起请求") {
                Zotero.AI4Paper.expandReaderContextPane();
                Zotero.AI4Paper.focusReaderSidePane("gpt");
                Zotero.AI4Paper.onClickButton_nowChatGPT(param271);
              } else {
                let var2167 = window.document.createXULElement("menupopup");
                var2167.id = "AI4Paper-SelectionPopup-gptPromptList-menupopup";
                var2167.addEventListener('popuphidden', () => {
                  window.document.querySelector('#browser').querySelectorAll("#AI4Paper-SelectionPopup-gptPromptList-menupopup").forEach(_0x4e7b38 => _0x4e7b38.remove());
                });
                let var2168 = var2167.firstElementChild;
                while (var2168) {
                  var2168.remove();
                  var2168 = var2167.firstElementChild;
                }
                let var2169 = ['无'];
                for (let var2170 of var2169) {
                  menuitem = window.document.createXULElement("menuitem");
                  menuitem.value = var2170;
                  menuitem.label = var2170;
                  menuitem.setAttribute("tooltiptext", var2170);
                  menuitem.addEventListener("command", _0x357bab => {
                    Zotero.AI4Paper.onClickPromptItem_SelectionPopupChatGPT(param271, var2170);
                  });
                  var2167.appendChild(menuitem);
                }
                let var2171 = Zotero.Prefs.get('ai4paper.chatgptprompttemplateuser'),
                  var2172 = [];
                if (var2171 != '') {
                  let var2173 = var2171.split('\x0a');
                  for (let var2174 of var2173) {
                    if (var2174 != '') {
                      var2174 = var2174.trim();
                      if (var2174.lastIndexOf('👈') === var2174.length - 0x2) {
                        let var2175 = var2174.lastIndexOf('👈');
                        if (var2174.lastIndexOf('👉') != -0x1) {
                          let var2176 = var2174.lastIndexOf('👉'),
                            var2177 = var2174.substring(var2176 + 0x2, var2175).trim();
                          menuitem = window.document.createXULElement('menuitem');
                          menuitem.value = var2177;
                          menuitem.label = var2177;
                          menuitem.setAttribute("tooltiptext", var2174);
                          menuitem.addEventListener('command', _0x521031 => {
                            Zotero.AI4Paper.onClickPromptItem_SelectionPopupChatGPT(param271, var2177);
                          });
                          var2167.appendChild(menuitem);
                        } else {
                          menuitem = window.document.createXULElement('menuitem');
                          menuitem.value = var2174;
                          menuitem.label = var2174;
                          menuitem.setAttribute('tooltiptext', var2174);
                          menuitem.addEventListener("command", _0x43144f => {
                            Zotero.AI4Paper.onClickPromptItem_SelectionPopupChatGPT(param271, var2174);
                          });
                          var2167.appendChild(menuitem);
                        }
                      } else {
                        menuitem = window.document.createXULElement('menuitem');
                        menuitem.value = var2174;
                        menuitem.label = var2174;
                        menuitem.setAttribute("tooltiptext", var2174);
                        menuitem.addEventListener("command", _0x3ff751 => {
                          Zotero.AI4Paper.onClickPromptItem_SelectionPopupChatGPT(param271, var2174);
                        });
                        var2167.appendChild(menuitem);
                      }
                    }
                  }
                }
                window.document.querySelector("#browser").querySelectorAll('#AI4Paper-SelectionPopup-gptPromptList-menupopup').forEach(_0x4dda5a => _0x4dda5a.remove());
                window.document.querySelector("#browser")?.["appendChild"](var2167);
                var2167.openPopup(var2166, "after_start", 0x0, 0x0, false, false);
              }
            }
          }
        };
        var2166.addEventListener("pointerdown", _0x284000 => {
          _0x284000.preventDefault && _0x284000.preventDefault();
          _0x284000.stopPropagation();
          _0x284000.button == 0x2 && (Zotero.Prefs.get("ai4paper.action4SelectionPopupChatGPT") === "直接发起请求" ? (Zotero.AI4Paper.expandReaderContextPane(), Zotero.AI4Paper.focusReaderSidePane("gpt"), Zotero.AI4Paper.onClickButton_ChatGPT(param271)) : (Zotero.AI4Paper.expandReaderContextPane(), Zotero.AI4Paper.focusReaderSidePane("gpt"), Zotero.AI4Paper.onClickButton_nowChatGPT(param271)));
        }, false);
        var2164.appendChild(var2166);
      }
      if (Zotero.Prefs.get("ai4paper.metasoSelectionPopupButton")) {
        let _0xdf0a61 = var2154.ownerDocument.createElement("button");
        _0xdf0a61.setAttribute("title", "秘塔 AI 搜索");
        _0xdf0a61.setAttribute('id', "ai4paper-metaso-popup-button");
        _0xdf0a61.setAttribute("class", "ai4paper-metaso-button ai4paper-popup-element ai4paper-popup-button");
        _0xdf0a61.style.display = "inline";
        _0xdf0a61.style.width = "30px";
        _0xdf0a61.style.borderRadius = "5px";
        _0xdf0a61.style.paddingTop = "3px";
        _0xdf0a61.style.marginRight = "5px";
        _0xdf0a61.style.marginLeft = "5px";
        _0xdf0a61.innerHTML = Zotero.AI4Paper.svg_icon_16px.metasoSelectionPopupButton;
        _0xdf0a61.addEventListener("mouseover", _0x1dde64 => {
          _0xdf0a61.style.backgroundColor = var2156;
        });
        _0xdf0a61.addEventListener("mouseout", _0x1d4a48 => {
          _0xdf0a61.style.backgroundColor = '';
        });
        _0xdf0a61.onclick = _0x9c3c19 => {
          Zotero.AI4Paper.meataso_WebSearch(param271);
        };
        var2164.appendChild(_0xdf0a61);
      }
      if (Zotero.Prefs.get("ai4paper.audioPlaySelectionPopupButton")) {
        let var2179 = var2154.ownerDocument.createElement("button");
        var2179.setAttribute('title', '播放发音');
        var2179.setAttribute('id', "ai4paper-audioPlay-popup-button");
        var2179.setAttribute("class", "ai4paper-audioPlay-button ai4paper-popup-element ai4paper-popup-button");
        var2179.style.display = "inline";
        var2179.style.width = "30px";
        var2179.style.borderRadius = "5px";
        var2179.style.paddingTop = '3px';
        var2179.style.marginRight = "5px";
        var2179.style.marginLeft = "5px";
        var2179.innerHTML = Zotero.AI4Paper.svg_icon_16px.audioPlaySelectionPopupButton;
        var2179.addEventListener('mouseover', _0x1f5457 => {
          var2179.style.backgroundColor = var2156;
        });
        var2179.addEventListener("mouseout", _0x4dda39 => {
          var2179.style.backgroundColor = '';
        });
        var2179.onclick = _0x2909a8 => {
          let var2180 = "英式发音";
          Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === "美式发音" && (var2180 = '美式发音');
          Zotero.AI4Paper.selectionPopupButtonAudioPlay(param271, var2180);
        };
        var2179.addEventListener("pointerdown", _0x5520b2 => {
          _0x5520b2.preventDefault && _0x5520b2.preventDefault();
          _0x5520b2.stopPropagation();
          if (_0x5520b2.button == 0x2) {
            let _0xcfd1ae = "英式发音";
            Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === "英式发音" ? _0xcfd1ae = "美式发音" : _0xcfd1ae = "英式发音";
            Zotero.AI4Paper.selectionPopupButtonAudioPlay(param271, _0xcfd1ae);
          }
        }, false);
        var2164.appendChild(var2179);
      }
      if (Zotero.Prefs.get("ai4paper.addWordsToEudicSelectionPopupButton")) {
        let var2182 = var2154.ownerDocument.createElement("button");
        var2182.setAttribute("title", '收藏生词至欧路词典');
        var2182.setAttribute('id', "ai4paper-addWordsToEudic-popup-button");
        var2182.setAttribute("class", 'ai4paper-addWordsToEudic-button\x20ai4paper-popup-element\x20ai4paper-popup-button');
        var2182.style.display = "inline";
        var2182.style.width = "30px";
        var2182.style.borderRadius = '5px';
        var2182.style.paddingTop = '3px';
        var2182.style.marginRight = "5px";
        var2182.style.marginLeft = "5px";
        var2182.innerHTML = Zotero.AI4Paper.svg_icon_16px.addWordsToEudicSelectionPopupButton;
        var2182.addEventListener("mouseover", _0xc05cb6 => {
          var2182.style.backgroundColor = var2156;
        });
        var2182.addEventListener("mouseout", _0x21d3cf => {
          var2182.style.backgroundColor = '';
        });
        var2182.onclick = _0x116f36 => {
          Zotero.AI4Paper.addWordsToEudic(param271.trim());
        };
        var2182.addEventListener("pointerdown", _0x355a5b => {
          _0x355a5b.preventDefault && _0x355a5b.preventDefault();
          _0x355a5b.stopPropagation();
          _0x355a5b.button == 0x2 && Zotero.AI4Paper.modifyEudicWords(param271.trim());
        }, false);
        var2164.appendChild(var2182);
      }
      var2154.appendChild(var2164);
    }
    if (Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea') && var2154.getAttribute('translate-popup-textarea') != "true") {
      var2154.style.maxWidth = "1000px";
      var2154.setAttribute("translate-popup-textarea", "true");
      let var2183 = var2154.ownerDocument.createElement("textarea");
      var2183.setAttribute('id', "ai4paper-translate-popup-textarea");
      var2183.setAttribute("class", "ai4paper-translate-textarea ai4paper-popup-element");
      var2183.style.fontSize = '13px';
      let var2184 = Zotero.Prefs.get("ai4paper.translationSelectionPopupTextAreaFontSize");
      Number(var2184) && (var2183.style.fontSize = var2184 + 'px');
      var2183.style.lineHeight = Zotero.Prefs.get("ai4paper.translationSelectionPopupTextAreaLineHeight");
      var2183.style.width = "-moz-available";
      let var2185 = Zotero.Prefs.get("ai4paper.translationSelectionPopupTextAreaWidth");
      if (var2185 != "auto") {
        if (Number(var2185)) {
          var2183.style.width = var2185 + 'px';
        }
      }
      var2183.style.overflowY = "auto";
      var2183.style.maxHeight = "200px";
      let var2186 = Zotero.Prefs.get("ai4paper.translationSelectionPopupTextAreaHeight");
      Number(var2186) && (var2183.style.maxHeight = var2186 + 'px');
      var2183.style.fontFamily = 'Arial,\x20sans-serif';
      var2183.style.paddingLeft = "3px";
      var2183.style.paddingRight = "3px";
      var2183.style.paddingBottom = "3px";
      var2183.setAttribute("spellcheck", false);
      var2183.addEventListener("dblclick", _0xbfd732 => {
        _0xbfd732.target.selectionStart = 0x0;
        _0xbfd732.target.selectionEnd = _0xbfd732.target.value.length;
        Zotero.AI4Paper.copy2Clipboard(_0xbfd732.target.value);
      });
      var2183.addEventListener("keydown", _0x3f88d2 => {
        if (Zotero.isMac && !_0x3f88d2.shiftKey && !_0x3f88d2.ctrlKey && !_0x3f88d2.altKey && _0x3f88d2.metaKey && _0x3f88d2.keyCode === 0x41) {
          _0x3f88d2.returnValue = false;
          _0x3f88d2.preventDefault && _0x3f88d2.preventDefault();
          _0x3f88d2.target.selectionStart = 0x0;
          _0x3f88d2.target.selectionEnd = _0x3f88d2.target.value.length;
        } else (Zotero.isWin || Zotero.isLinux) && !_0x3f88d2.shiftKey && _0x3f88d2.ctrlKey && !_0x3f88d2.altKey && !_0x3f88d2.metaKey && _0x3f88d2.keyCode === 0x41 && (_0x3f88d2.returnValue = false, _0x3f88d2.preventDefault && _0x3f88d2.preventDefault(), _0x3f88d2.target.selectionStart = 0x0, _0x3f88d2.target.selectionEnd = _0x3f88d2.target.value.length);
      });
      var2183.addEventListener("mousedown", async _0x270f06 => {
        if (_0x270f06.shiftKey) {
          _0x270f06.returnValue = false;
          _0x270f06.preventDefault && _0x270f06.preventDefault();
          Zotero.AI4Paper.meataso_WebSearch(_0x270f06.target.value);
          return;
        }
        if (_0x270f06.button == 0x2) {
          let _0xe62b52 = _0x270f06.target.value;
          if (_0xe62b52.indexOf("🔉 英") != -0x1) Zotero.AI4Paper.translateSidePaneAudioPlay(Zotero.Prefs.get('ai4paper.selectedtexttrans'));else {
            let _0x3554bf = await Zotero.AI4Paper.translateSidePaneAudioPlay(Zotero.Prefs.get("ai4paper.selectedtexttrans"));
            _0x3554bf && _0x3554bf != -0x1 && Zotero.AI4Paper.updateTranslationPopupTextArea(_0x3554bf.replace(/<br>/g, '\x0a'));
          }
        }
      });
      !Zotero.Prefs.get("ai4paper.selectedtexttransenable") && (var2183.hidden = true);
      var2183.hidden = true;
      var2154.appendChild(var2183);
    }
    if (Zotero.Prefs.get("ai4paper.hideZoteroToolToggleButton")) {
      let var2189 = 0x0;
      while (!var2154.querySelector('.tool-toggle')) {
        if (var2189 >= 0xf) {
          Zotero.debug('AI4Paper:\x20Waiting\x20for\x20tool-toggle\x20button\x20failed');
          return;
        }
        await Zotero.Promise.delay(0x2);
        var2189++;
      }
      var2154.querySelector(".tool-toggle").style.display = "none";
    }
  },
  'changeGPTPopupButtonName': function (param272) {
    let var2190 = param272 ? Zotero.AI4Paper.svg_icon_16px.gptviewSelectionPopupChatGPT : Zotero.AI4Paper.svg_icon_16px.gptviewSelectionPopupChatGPT_purple,
      var2191 = Zotero.AI4Paper.getCurrentReader();
    if (!var2191) return false;
    let var2192 = var2191._iframeWindow.document.querySelector(".ai4paper-chatgpt-button");
    var2192 && (var2192.innerHTML = var2190);
  },
  'changeTranslationPopupButtonName': function (param273) {
    let var2193 = param273 ? Zotero.AI4Paper.svg_icon_16px.translationSelectionPopup : Zotero.AI4Paper.svg_icon_16px.translationSelectionPopup_purple,
      var2194 = Zotero.AI4Paper.getCurrentReader();
    if (!var2194) return false;
    let var2195 = var2194._iframeWindow.document.querySelector(".ai4paper-translate-button");
    var2195 && (var2195.innerHTML = var2193);
  },
  'updateTranslationPopupTextArea': async function (param274) {
    if (!Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea')) return;
    let var2196 = Zotero_Tabs._selectedID;
    var var2197 = Zotero.Reader.getByTabID(var2196);
    if (!var2197) {
      return false;
    }
    let var2198 = var2197._iframeWindow.document.querySelector(".ai4paper-translate-textarea");
    var2198 ? (var2198.hidden = false, var2198.value = param274, fn5(var2198)) : (await new Promise(_0x13de70 => setTimeout(_0x13de70, 0xf)), var2198 = var2197._iframeWindow.document.querySelector(".ai4paper-translate-textarea"), var2198 && (var2198.hidden = false, var2198.value = param274, fn5(var2198)));
    function fn5(param275) {
      param275.style.height = "auto";
      let var2199 = 0xc8,
        var2200 = Zotero.Prefs.get("ai4paper.translationSelectionPopupTextAreaHeight");
      Number(var2200) && (var2199 = Number(var2200));
      param275.style.height = Math.min(param275.scrollHeight, var2199) + 'px';
    }
    ;
  },
  'updateTranslationPopupTextAreaBoxShadow': async function (param276) {
    if (!Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea')) {
      return;
    }
    let var2201 = Zotero_Tabs._selectedID;
    var var2202 = Zotero.Reader.getByTabID(var2201);
    if (!var2202) {
      return false;
    }
    let var2203 = var2202._iframeWindow.document.querySelector('.ai4paper-translate-textarea');
    if (var2203) {
      var2203.hidden = false;
      if (param276 === "start") var2203.style.boxShadow = "0 0 4px blue";else param276 === "done" && (var2203.style.boxShadow = '');
    } else {
      await new Promise(_0x2c30db => setTimeout(_0x2c30db, 0xf));
      var2203 = var2202._iframeWindow.document.querySelector(".ai4paper-translate-textarea");
      if (var2203) {
        var2203.hidden = false;
        if (param276 === 'start') var2203.style.boxShadow = "0 0 4px blue";else param276 === 'done' && (var2203.style.boxShadow = '');
      }
    }
  },
  'updateTranslationPopupTextAreaPlaceHolder': async function () {
    if (!Zotero.Prefs.get("ai4paper.translationSelectionPopupTextArea")) return;
    let var2204 = Zotero_Tabs._selectedID;
    var var2205 = Zotero.Reader.getByTabID(var2204);
    if (!var2205) return false;
    let var2206 = var2205._iframeWindow.document.querySelector('.ai4paper-translate-textarea');
    var2206 ? (var2206.hidden = false, var2206.setAttribute("placeholder", "正在请求...")) : (await new Promise(_0x5e7051 => setTimeout(_0x5e7051, 0xf)), var2206 = var2205._iframeWindow.document.querySelector('.ai4paper-translate-textarea'), var2206 && (var2206.hidden = false, var2206.setAttribute("placeholder", "正在请求...")));
  },
  'onClickPromptItem_SelectionPopupChatGPT': function (param277, param278) {
    let var2207 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var2207) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 未开启【GPT 侧边栏】", "请先开启【GPT 侧边栏】，再执行本操作！");
      return;
    }
    Zotero.AI4Paper.expandReaderContextPane();
    Zotero.AI4Paper.focusReaderSidePane("gpt");
    Zotero.AI4Paper.onClickButton_ChatGPT(param277);
    window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").value = param278;
    Zotero.Prefs.set('ai4paper.chatgptprompttemplate', param278);
    Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? Zotero.AI4Paper.gptReaderSidePane_ChatMode_send() : Zotero.AI4Paper.gptReaderSidePane_send();
  },
  'addColorLabel': function (param283) {
    if (!Zotero.Prefs.get("ai4paper.enabelColorLabel")) return;
    let var2284 = param283.document.querySelectorAll("iframe");
    for (let var2285 of var2284) {
      let var2286 = var2285?.["contentWindow"];
      var2286 && !var2286._addColorLabelInit && (var2286._addColorLabelInit = true, var2286.document.addEventListener('pointerup', async function (param284) {
        if (!Zotero.Prefs.get('ai4paper.enabelColorLabel')) {
          return;
        }
        await Zotero.Promise.delay(0x5);
        let var2287 = param283.document.querySelector(".selection-popup");
        if (var2287) {
          var2287.style.maxWidth = "800px";
          let var2288 = 0x0,
            var2289 = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get("ai4paper.greenColorLabel"), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get('ai4paper.orangeColorLabel'), Zotero.Prefs.get("ai4paper.grayColorLabel")],
            var2290 = param283.document.querySelector('.selection-popup').childNodes[0x0].childNodes;
          for (let var2291 of var2290) {
            var2291.title = var2289[var2288];
            var2291.textContent = var2289[var2288];
            var2288++;
          }
        }
      }, false));
    }
  },
  'addButtonColorLabel': function (param285) {
    if (!Zotero.Prefs.get('ai4paper.enabelColorLabel')) {
      return;
    }
    let var2292 = param285.document.querySelector(".toolbar-button.toolbar-dropdown-button");
    var2292 && !var2292._addButtonColorLabel && (var2292._addButtonColorLabel = true, var2292.addEventListener("click", async _0xde3d7b => {
      if (!Zotero.Prefs.get("ai4paper.enabelColorLabel") || !Zotero.AI4Paper) return;
      if (!var2292.disabled) {
        let var2293 = 0x0;
        while (!param285.document.querySelectorAll('.row.basic')[0x1]) {
          if (var2293 >= 0xc8) {
            Zotero.debug("AI4Paper: Waiting for button failed");
            return;
          }
          await Zotero.Promise.delay(0x5);
          var2293++;
        }
        let var2294 = 0x0,
          var2295 = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get('ai4paper.greenColorLabel'), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get("ai4paper.orangeColorLabel"), Zotero.Prefs.get("ai4paper.grayColorLabel")],
          var2296 = param285.document.querySelectorAll(".row.basic");
        for (let var2297 of var2296) {
          let _0x5180fa = var2297.innerHTML.indexOf("div>"),
            _0x5632a3 = var2297.innerHTML.substring(0x0, _0x5180fa + 0x4);
          var2297.innerHTML = '' + _0x5632a3 + var2295[var2294];
          var2294++;
        }
      }
    }, false));
    if (param285 && !param285._addColorLabel_ContextMenu) {
      param285._addColorLabel_ContextMenu = true;
      param285.document.addEventListener("pointerdown", async _0x1ff0a5 => {
        if (!Zotero.Prefs.get("ai4paper.enabelColorLabel") || !Zotero.AI4Paper) {
          return;
        }
        if (_0x1ff0a5.button === 0x0 && _0x1ff0a5.target.closest(".more")) {
          let var2300 = 0x0;
          while (!param285.document.querySelector(".context-menu")) {
            if (var2300 >= 0xc8) {
              Zotero.debug("AI4Paper: Waiting for context-menu failed");
              return;
            }
            await Zotero.Promise.delay(0x5);
            var2300++;
          }
          if (param285.document.querySelector('.context-menu')) {
            let _0x51dfd1 = param285.document.querySelector(".context-menu"),
              _0x498265 = 0x0,
              _0x508515 = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get('ai4paper.greenColorLabel'), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get('ai4paper.orangeColorLabel'), Zotero.Prefs.get('ai4paper.grayColorLabel')],
              _0x2ad50c = _0x51dfd1.childNodes[0x1].childNodes;
            for (let var2305 of _0x2ad50c) {
              let var2306 = var2305.innerHTML.indexOf('div>'),
                var2307 = var2305.innerHTML.substring(0x0, var2306 + 0x4);
              var2305.innerHTML = '' + var2307 + _0x508515[_0x498265];
              _0x498265++;
            }
          }
        }
      }, false);
      param285.document.addEventListener("pointerdown", async _0x125cf9 => {
        if (!Zotero.Prefs.get("ai4paper.enabelColorLabel") || !Zotero.AI4Paper) {
          return;
        }
        if (_0x125cf9.button === 0x2 && _0x125cf9.target.closest("#annotationsView")) {
          let _0x204afa = 0x0;
          while (!param285.document.querySelector('.context-menu')) {
            if (_0x204afa >= 0xc8) {
              Zotero.debug("AI4Paper: Waiting for context-menu failed");
              return;
            }
            await Zotero.Promise.delay(0x5);
            _0x204afa++;
          }
          if (param285.document.querySelector(".context-menu")) {
            let var2309 = param285.document.querySelector(".context-menu"),
              var2310 = 0x0,
              var2311 = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get("ai4paper.greenColorLabel"), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get('ai4paper.magentaColorLabel'), Zotero.Prefs.get("ai4paper.orangeColorLabel"), Zotero.Prefs.get("ai4paper.grayColorLabel")],
              var2312 = var2309.childNodes[0x1].childNodes;
            for (let var2313 of var2312) {
              let var2314 = var2313.innerHTML.indexOf('div>'),
                var2315 = var2313.innerHTML.substring(0x0, var2314 + 0x4);
              var2313.innerHTML = '' + var2315 + var2311[var2310];
              var2310++;
            }
          }
        }
      }, false);
    }
  },
  'addViewButtons': async function (param286) {
    if (Zotero.Prefs.get('ai4paper.enableReaderViewButtonFilterAnnotations') && !param286.document.querySelector("#AI4Paper-viewButton-filterAnnotations")) {
      let var2316 = 0x0;
      while (!param286.document.querySelector('#viewOutline')) {
        if (var2316 >= 0xc8) {
          Zotero.debug('AI4Paper:\x20Waiting\x20for\x20viewOutline\x20button\x20failed');
          return;
        }
        await Zotero.Promise.delay(0xa);
        var2316++;
      }
      let var2317 = param286.document.querySelector('#viewOutline'),
        var2318 = {
          'none': Zotero.AI4Paper.svg_icon_20px.enableReaderViewButtonFilterAnnotations + "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\" transform=\"translate(-1,0)\" fill=\"#828282\"><path fill=\"#828282\" d=\"m0 2.707 4 4 4-4L7.293 2 4 5.293.707 2z\"></path></svg>",
          'highlight': Zotero.AI4Paper.svg_icon_20px.highlight,
          'underline': Zotero.AI4Paper.svg_icon_20px.underline,
          'note': Zotero.AI4Paper.svg_icon_20px.note,
          'text': Zotero.AI4Paper.svg_icon_20px.text,
          'image': Zotero.AI4Paper.svg_icon_20px.image,
          'ink': Zotero.AI4Paper.svg_icon_20px.ink,
          'annotationHead': Zotero.AI4Paper.svg_icon_20px.annotationHead,
          'H1': Zotero.AI4Paper.svg_icon_20px.H1,
          'H2': Zotero.AI4Paper.svg_icon_20px.H2,
          'H3': Zotero.AI4Paper.svg_icon_20px.H3,
          'H4': Zotero.AI4Paper.svg_icon_20px.H4,
          'H5': Zotero.AI4Paper.svg_icon_20px.H5,
          'H6': Zotero.AI4Paper.svg_icon_20px.H6,
          'yellow': Zotero.AI4Paper.svg_icon_20px.yellow,
          'red': Zotero.AI4Paper.svg_icon_20px.red,
          'green': Zotero.AI4Paper.svg_icon_20px.green,
          'blue': Zotero.AI4Paper.svg_icon_20px.blue,
          'purple': Zotero.AI4Paper.svg_icon_20px.purple,
          'magenta': Zotero.AI4Paper.svg_icon_20px.magenta,
          'orange': Zotero.AI4Paper.svg_icon_20px.orange,
          'gray': Zotero.AI4Paper.svg_icon_20px.gray,
          'UniversalQuoteLink': Zotero.AI4Paper.svg_icon_20px.UniversalQuoteLink
        },
        var2319 = param286.document.createElement("button");
      var2319.setAttribute('id', "AI4Paper-viewButton-filterAnnotations");
      var2319.title = "注释筛选";
      var2319.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      var2319.innerHTML = var2318.none;
      var2319.addEventListener("pointerdown", _0x4d701a => {
        if (_0x4d701a.button == 0x2) {
          var2319.innerHTML = var2318.none;
          var2319.title = "注释筛选";
          param286._annotationFilterType = 'none';
          Zotero.AI4Paper.filterAnnotations(param286, "none");
        }
      }, false);
      var2319.addEventListener("click", _0x4316af => {
        let _0x35070b = window.document.createXULElement("menupopup");
        _0x35070b.id = "AI4Paper-viewButton-filterAnnotations-menupopup";
        let _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === "none" && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute('label', "全部 (共 " + Zotero.AI4Paper.countAnnotations("none") + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.none;
          var2319.title = '注释筛选';
          param286._annotationFilterType = "none";
          Zotero.AI4Paper.filterAnnotations(param286, "none");
        });
        _0x35070b.appendChild(_0x5b8c51);
        let _0x54b7af = window.document.createXULElement("menuseparator");
        _0x35070b.appendChild(_0x54b7af);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === 'highlight' && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute("label", "高亮 (" + Zotero.AI4Paper.countAnnotations("highlight") + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.highlight;
          var2319.title = '高亮';
          param286._annotationFilterType = "highlight";
          Zotero.AI4Paper.filterAnnotations(param286, "highlight");
        });
        _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === 'underline' && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute("label", "下划线 (" + Zotero.AI4Paper.countAnnotations("underline") + ')');
        _0x5b8c51.addEventListener('command', () => {
          var2319.innerHTML = var2318.underline;
          var2319.title = "下划线";
          param286._annotationFilterType = 'underline';
          Zotero.AI4Paper.filterAnnotations(param286, "underline");
        });
        _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        if (param286._annotationFilterType === "note") {
          _0x5b8c51.setAttribute("checked", true);
        }
        _0x5b8c51.setAttribute("label", '笔记\x20(' + Zotero.AI4Paper.countAnnotations('note') + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.note;
          var2319.title = '笔记';
          param286._annotationFilterType = "note";
          Zotero.AI4Paper.filterAnnotations(param286, "note");
        });
        _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === "text" && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute("label", '文本\x20(' + Zotero.AI4Paper.countAnnotations('text') + ')');
        _0x5b8c51.addEventListener('command', () => {
          var2319.innerHTML = var2318.text;
          var2319.title = '文本';
          param286._annotationFilterType = "text";
          Zotero.AI4Paper.filterAnnotations(param286, "text");
        });
        _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === "image" && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute('label', "图片 (" + Zotero.AI4Paper.countAnnotations("image") + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.image;
          var2319.title = '图片';
          param286._annotationFilterType = "image";
          Zotero.AI4Paper.filterAnnotations(param286, "image");
        });
        _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === 'ink' && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute('label', '画笔\x20(' + Zotero.AI4Paper.countAnnotations('ink') + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.ink;
          var2319.title = '画笔';
          param286._annotationFilterType = "ink";
          Zotero.AI4Paper.filterAnnotations(param286, "ink");
        });
        _0x35070b.appendChild(_0x5b8c51);
        _0x54b7af = window.document.createXULElement("menuseparator");
        _0x35070b.appendChild(_0x54b7af);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute('type', "checkbox");
        if (param286._annotationFilterType === 'annotationHead') {
          _0x5b8c51.setAttribute("checked", true);
        }
        _0x5b8c51.setAttribute("label", "大纲标题 (" + Zotero.AI4Paper.countAnnotations('annotationHead') + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.annotationHead;
          var2319.title = "大纲标题";
          param286._annotationFilterType = 'annotationHead';
          Zotero.AI4Paper.filterAnnotations(param286, 'annotationHead');
        });
        _0x35070b.appendChild(_0x5b8c51);
        let _0x2e1e22 = window.document.createXULElement("menu");
        _0x2e1e22.setAttribute("type", "checkbox");
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(param286._annotationFilterType) && _0x2e1e22.setAttribute("checked", true);
        let _0x3acab8 = window.document.createXULElement("menupopup");
        _0x2e1e22.setAttribute("label", "各级标题");
        _0x2e1e22.appendChild(_0x3acab8);
        if (!Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandOutlineMenuItem")) {
          _0x35070b.appendChild(_0x2e1e22);
        }
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        if (param286._annotationFilterType === 'H1') {
          _0x5b8c51.setAttribute('checked', true);
        }
        _0x5b8c51.setAttribute("label", "H1 (" + Zotero.AI4Paper.countAnnotations('H1') + ')');
        _0x5b8c51.addEventListener('command', () => {
          var2319.innerHTML = var2318.H1;
          var2319.title = 'H1';
          param286._annotationFilterType = 'H1';
          Zotero.AI4Paper.filterAnnotations(param286, 'H1');
        });
        if (!Zotero.Prefs.get('ai4paper.filterAnnotationsButtonExpandOutlineMenuItem')) {
          _0x3acab8.appendChild(_0x5b8c51);
        } else _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === 'H2' && _0x5b8c51.setAttribute('checked', true);
        _0x5b8c51.setAttribute("label", 'H2\x20(' + Zotero.AI4Paper.countAnnotations('H2') + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.H2;
          var2319.title = 'H2';
          param286._annotationFilterType = 'H2';
          Zotero.AI4Paper.filterAnnotations(param286, 'H2');
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandOutlineMenuItem") ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === 'H3' && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute("label", "H3 (" + Zotero.AI4Paper.countAnnotations('H3') + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.H3;
          var2319.title = 'H3';
          param286._annotationFilterType = 'H3';
          Zotero.AI4Paper.filterAnnotations(param286, 'H3');
        });
        !Zotero.Prefs.get('ai4paper.filterAnnotationsButtonExpandOutlineMenuItem') ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute('type', 'checkbox');
        param286._annotationFilterType === 'H4' && _0x5b8c51.setAttribute('checked', true);
        _0x5b8c51.setAttribute('label', "H4 (" + Zotero.AI4Paper.countAnnotations('H4') + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.H4;
          var2319.title = 'H4';
          param286._annotationFilterType = 'H4';
          Zotero.AI4Paper.filterAnnotations(param286, 'H4');
        });
        !Zotero.Prefs.get('ai4paper.filterAnnotationsButtonExpandOutlineMenuItem') ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === 'H5' && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute('label', "H5 (" + Zotero.AI4Paper.countAnnotations('H5') + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.H5;
          var2319.title = 'H5';
          param286._annotationFilterType = 'H5';
          Zotero.AI4Paper.filterAnnotations(param286, 'H5');
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandOutlineMenuItem") ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute('type', "checkbox");
        param286._annotationFilterType === 'H6' && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute('label', "H6 (" + Zotero.AI4Paper.countAnnotations('H6') + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.H6;
          var2319.title = 'H6';
          param286._annotationFilterType = 'H6';
          Zotero.AI4Paper.filterAnnotations(param286, 'H6');
        });
        !Zotero.Prefs.get('ai4paper.filterAnnotationsButtonExpandOutlineMenuItem') ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x54b7af = window.document.createXULElement("menuseparator");
        _0x35070b.appendChild(_0x54b7af);
        let _0x54c0a3 = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get("ai4paper.greenColorLabel"), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get("ai4paper.orangeColorLabel"), Zotero.Prefs.get("ai4paper.grayColorLabel")];
        _0x2e1e22 = window.document.createXULElement("menu");
        _0x2e1e22.setAttribute("type", "checkbox");
        if (["yellow", 'red', "green", "blue", 'purple', 'magenta', "orange", 'gray'].includes(param286._annotationFilterType)) {
          _0x2e1e22.setAttribute("checked", true);
        }
        _0x3acab8 = window.document.createXULElement("menupopup");
        _0x2e1e22.setAttribute('label', '颜色');
        _0x2e1e22.appendChild(_0x3acab8);
        if (!Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem")) {
          _0x35070b.appendChild(_0x2e1e22);
        }
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === "yellow" && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute('label', "黄色 🟨 (" + Zotero.AI4Paper.countAnnotations("yellow") + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && _0x54c0a3[0x0].trim() && _0x5b8c51.setAttribute('label', "黄色 🟨 " + _0x54c0a3[0x0].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("yellow") + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.yellow;
          var2319.title = '黄色';
          param286._annotationFilterType = 'yellow';
          Zotero.AI4Paper.filterAnnotations(param286, "yellow");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute('type', "checkbox");
        param286._annotationFilterType === "red" && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute('label', "红色 🟥 (" + Zotero.AI4Paper.countAnnotations('red') + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && _0x54c0a3[0x1].trim() && _0x5b8c51.setAttribute("label", "红色 🟥 " + _0x54c0a3[0x1].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("red") + ')');
        _0x5b8c51.addEventListener('command', () => {
          var2319.innerHTML = var2318.red;
          var2319.title = '红色';
          param286._annotationFilterType = "red";
          Zotero.AI4Paper.filterAnnotations(param286, "red");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === "green" && _0x5b8c51.setAttribute('checked', true);
        _0x5b8c51.setAttribute('label', '绿色\x20🟩\x20(' + Zotero.AI4Paper.countAnnotations('green') + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && _0x54c0a3[0x2].trim() && _0x5b8c51.setAttribute('label', "绿色 🟩 " + _0x54c0a3[0x2].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("green") + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.green;
          var2319.title = '绿色';
          param286._annotationFilterType = "green";
          Zotero.AI4Paper.filterAnnotations(param286, "green");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement('menuitem');
        _0x5b8c51.setAttribute("type", 'checkbox');
        param286._annotationFilterType === "blue" && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute("label", "蓝色 🟦 (" + Zotero.AI4Paper.countAnnotations("blue") + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && _0x54c0a3[0x3].trim() && _0x5b8c51.setAttribute("label", "蓝色 🟦 " + _0x54c0a3[0x3].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations('blue') + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.blue;
          var2319.title = '蓝色';
          param286._annotationFilterType = "blue";
          Zotero.AI4Paper.filterAnnotations(param286, "blue");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === 'purple' && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute("label", '紫色\x20🟪\x20(' + Zotero.AI4Paper.countAnnotations('purple') + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && _0x54c0a3[0x4].trim() && _0x5b8c51.setAttribute("label", "紫色 🟪 " + _0x54c0a3[0x4].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("purple") + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.purple;
          var2319.title = '紫色';
          param286._annotationFilterType = "purple";
          Zotero.AI4Paper.filterAnnotations(param286, "purple");
        });
        if (!Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem")) _0x3acab8.appendChild(_0x5b8c51);else {
          _0x35070b.appendChild(_0x5b8c51);
        }
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === "magenta" && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute("label", "洋红色 🟣 (" + Zotero.AI4Paper.countAnnotations("magenta") + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && _0x54c0a3[0x5].trim() && _0x5b8c51.setAttribute("label", "洋红色 🟣 " + _0x54c0a3[0x5].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations('magenta') + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.magenta;
          var2319.title = "洋红色";
          param286._annotationFilterType = "magenta";
          Zotero.AI4Paper.filterAnnotations(param286, "magenta");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement("menuitem");
        _0x5b8c51.setAttribute("type", "checkbox");
        if (param286._annotationFilterType === 'orange') {
          _0x5b8c51.setAttribute('checked', true);
        }
        _0x5b8c51.setAttribute("label", "橘色 🟧 (" + Zotero.AI4Paper.countAnnotations("orange") + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && _0x54c0a3[0x6].trim() && _0x5b8c51.setAttribute("label", "橘色 🟧 " + _0x54c0a3[0x6].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("orange") + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.orange;
          var2319.title = '橘色';
          param286._annotationFilterType = 'orange';
          Zotero.AI4Paper.filterAnnotations(param286, "orange");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x5b8c51 = window.document.createXULElement('menuitem');
        _0x5b8c51.setAttribute("type", "checkbox");
        param286._annotationFilterType === "gray" && _0x5b8c51.setAttribute('checked', true);
        _0x5b8c51.setAttribute('label', "灰色 ⬜ (" + Zotero.AI4Paper.countAnnotations("gray") + ')');
        if (Zotero.Prefs.get('ai4paper.enabelColorLabel') && _0x54c0a3[0x7].trim()) {
          _0x5b8c51.setAttribute("label", "灰色 ⬜ " + _0x54c0a3[0x7].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("gray") + ')');
        }
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.gray;
          var2319.title = '灰色';
          param286._annotationFilterType = 'gray';
          Zotero.AI4Paper.filterAnnotations(param286, "gray");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? _0x3acab8.appendChild(_0x5b8c51) : _0x35070b.appendChild(_0x5b8c51);
        _0x54b7af = window.document.createXULElement('menuseparator');
        _0x35070b.appendChild(_0x54b7af);
        _0x5b8c51 = window.document.createXULElement('menuitem');
        _0x5b8c51.setAttribute("type", 'checkbox');
        param286._annotationFilterType === "UniversalQuoteLink" && _0x5b8c51.setAttribute("checked", true);
        _0x5b8c51.setAttribute("label", "通用引用链接 (" + Zotero.AI4Paper.countAnnotations("UniversalQuoteLink") + ')');
        _0x5b8c51.addEventListener("command", () => {
          var2319.innerHTML = var2318.UniversalQuoteLink;
          var2319.title = "通用引用链接";
          param286._annotationFilterType = 'UniversalQuoteLink';
          Zotero.AI4Paper.filterAnnotations(param286, 'UniversalQuoteLink');
        });
        _0x35070b.appendChild(_0x5b8c51);
        window.document.querySelector("#browser").querySelectorAll("#AI4Paper-viewButton-filterAnnotations-menupopup").forEach(_0x4ee0b4 => _0x4ee0b4.remove());
        window.document.querySelector("#browser")?.["appendChild"](_0x35070b);
        _0x35070b.openPopup(var2319, 'after_start', 0x0, 0x0, false, false);
      });
      var2317.parentNode.appendChild(var2319);
      if (!param286._annotationFilterType) {
        param286._annotationFilterType = 'none';
        Zotero.AI4Paper.filterAnnotations(param286, "none");
      } else {
        var2319.innerHTML = var2318[param286._annotationFilterType];
        Zotero.AI4Paper.filterAnnotations(param286, param286._annotationFilterType);
      }
    } else !Zotero.Prefs.get("ai4paper.enableReaderViewButtonFilterAnnotations") && param286.document.querySelector('#AI4Paper-viewButton-filterAnnotations') && (param286.document.querySelector("#AI4Paper-viewButton-filterAnnotations").remove(), Zotero.AI4Paper.filterAnnotations(param286, "none"));
    if (Zotero.Prefs.get("ai4paper.enableReaderViewButtonViewImages") && !param286.document.querySelector("#AI4Paper-viewButton-viewImages") && Zotero.AI4Paper.getCurrentReader()?.["_item"]["attachmentContentType"] === "application/pdf") {
      let var2326 = 0x0;
      while (!param286.document.querySelector("#viewOutline")) {
        if (var2326 >= 0xc8) {
          Zotero.debug('AI4Paper:\x20Waiting\x20for\x20viewOutline\x20button\x20failed');
          return;
        }
        await Zotero.Promise.delay(0xa);
        var2326++;
      }
      let var2327 = param286.document.querySelector("#viewOutline"),
        var2328 = param286.document.createElement("button");
      var2328.setAttribute('id', "AI4Paper-viewButton-viewImages");
      var2328.title = '查看图片';
      var2328.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      var2328.innerHTML = '<svg\x20width=\x2220\x22\x20height=\x2220\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20xml:space=\x22preserve\x22\x20version=\x221.1\x22>\x0a\x0a\x20\x20\x20\x20\x20<g>\x0a\x20\x20\x20\x20\x20\x20<title>查看图片</title>\x0a\x20\x20\x20\x20\x20\x20<path\x20id=\x22svg_1\x22\x20fill=\x22#808080\x22\x20d=\x22m16.4,1.3l-12.8,0c-1.3,0\x20-2.3,1\x20-2.3,2.3l0,12.9c0,1.3\x201,2.3\x202.3,2.3l12.9,0c1.3,0\x202.3,-1\x202.3,-2.3l0,-12.9c-0.1,-1.3\x20-1.1,-2.3\x20-2.4,-2.3zm-12.8,0.8l12.9,0c0.8,0\x201.5,0.7\x201.5,1.5l0,2.7c-2.9,0.1\x20-5.7,1.3\x20-7.8,3.4c-1,1\x20-1.8,2.1\x20-2.3,3.3c-1.6,-1.4\x20-4,-1.5\x20-5.7,-0.3l0,-9.1c-0.1,-0.8\x200.6,-1.5\x201.4,-1.5zm-1.5,14.3l0,-2.7c1.5,-1.5\x203.9,-1.4\x205.4,0c-0.5,1.3\x20-0.7,2.6\x20-0.7,4c0,0\x200,0.1\x200,0.1l-3.2,0c-0.8,0.1\x20-1.5,-0.6\x20-1.5,-1.4zm14.3,1.5l-8.8,0c0,0\x200,-0.1\x200,-0.1c0,-2.9\x201.1,-5.6\x203.1,-7.6c1.9,-1.9\x204.5,-3\x207.2,-3.1l0,9.4c0,0.7\x20-0.7,1.4\x20-1.5,1.4z\x22\x20class=\x22st0\x22/>\x0a\x20\x20\x20\x20\x20\x20<path\x20id=\x22svg_2\x22\x20fill=\x22#808080\x22\x20d=\x22m6.1,8.1c1.2,0\x202.2,-1\x202.2,-2.2s-1,-2.2\x20-2.2,-2.2s-2.2,1\x20-2.2,2.2s1,2.2\x202.2,2.2zm0,-3.5c0.7,0\x201.3,0.6\x201.3,1.3s-0.6,1.3\x20-1.3,1.3s-1.3,-0.5\x20-1.3,-1.3s0.6,-1.3\x201.3,-1.3z\x22\x20class=\x22st0\x22/>\x0a\x20\x20\x20\x20\x20</g>\x0a\x20\x20\x20\x20</svg>';
      var2327.after(var2328);
      var2328.addEventListener("click", _0x417817 => {});
      let var2329 = param286.document.querySelector("#sidebarContent"),
        var2330 = param286.document.createElement('div');
      var2330.id = "AI4Paper-viewButton-imagesView";
      var2330.setAttribute("style", 'display:\x20none;width:\x20100%;justify-content:\x20center;flex-wrap:\x20wrap;padding-right:\x204px;');
      param286.document.querySelectorAll("#AI4Paper-viewButton-imagesView").forEach(_0x3e96c8 => _0x3e96c8.remove());
      var2329.appendChild(var2330);
      let var2331 = param286.document.createElement('div');
      var2331.setAttribute('id', "AI4Paper-DIV-loadImage");
      var2331.setAttribute("style", "display: flex;width: 100%;justify-content: center;flex-wrap: wrap;margin-top: 10px;margin-bottom: 15px;");
      let var2332 = param286.document.createElement("button");
      var2332.setAttribute('id', "AI4Paper-Button-loadImage");
      var2332.setAttribute('style', "display: flex;width: 88px;height: 32px;cursor: default;");
      var2332.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons");
      var2332.onclick = fn6;
      var2332.innerHTML = "<svg width=\"79.4\" height=\"28\" xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" version=\"1.1\">\n\n <g>\n  <title>载入更多图片</title>\n  <path id=\"svg_1\" fill=\"#FD7A45\" d=\"m71,25.4l-62.7,0c-4.6,0 -8.3,-3.8 -8.3,-8.4l0,-6c0,-4.6 3.7,-8.3 8.3,-8.3l62.7,0c4.6,0 8.3,3.7 8.3,8.3l0,6c0.1,4.6 -3.7,8.4 -8.3,8.4z\" class=\"st0\"/>\n  <text id=\"svg_2\" font-size=\"11.2px\" font-family=\"'PingFangSC-Regular-GBpc-EUC-H'\" fill=\"#FFFFFF\" class=\"st1 st2 st3\" transform=\"matrix(1 0 0 1 6.3149 18.032)\">载入更多图片</text>\n </g>\n</svg>";
      let var2333 = param286.document.createElement("button");
      var2333.setAttribute('id', "AI4Paper-Button-clearImage");
      var2333.setAttribute("style", 'display:\x20none;width:\x2088px;height:\x2032px;cursor:\x20default;');
      var2333.setAttribute("class", 'toolbar-button\x20AI4Paper-Reader-Buttons');
      var2333.onclick = fn7;
      var2333.innerHTML = "<svg width=\"79.4\" height=\"28\" xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" version=\"1.1\">\n\n <g>\n  <title>清除全部图片</title>\n  <path id=\"svg_1\" fill=\"#EB2F06\" d=\"m71,25.4l-62.7,0c-4.6,0 -8.3,-3.8 -8.3,-8.4l0,-6c0,-4.6 3.7,-8.3 8.3,-8.3l62.7,0c4.6,0 8.3,3.7 8.3,8.3l0,6c0.1,4.6 -3.7,8.4 -8.3,8.4z\" class=\"st0\"/>\n  <text id=\"svg_2\" font-size=\"11.2px\" font-family=\"'PingFangSC-Regular-GBpc-EUC-H'\" fill=\"#FFFFFF\" class=\"st1 st2 st3\" transform=\"matrix(1 0 0 1 6.3465 18.0374)\">清除全部图片</text>\n </g>\n</svg>";
      var2331.appendChild(var2332);
      var2331.appendChild(var2333);
      var2330.appendChild(var2331);
      let var2334 = param286.document.createElement("div");
      var2334.setAttribute('id', "AI4Paper-DIV-loadImage");
      var2334.setAttribute("style", "display: none;width: 100%;justify-content: center;flex-wrap: wrap;margin-bottom: 5px;margin-left: 3px;margin-bottom: 3px;");
      var2334.textContent = '';
      var2330.appendChild(var2334);
      let var2335 = param286.document.querySelector(".sidebar-toolbar")?.["querySelectorAll"]('button');
      for (let var2336 of var2335) {
        if (!var2336._onClickViewButton) {
          var2336._onClickViewButton = true;
          var2336.onclick = function () {
            if (this.id === 'AI4Paper-viewButton-viewImages') {
              for (let var2337 of param286.document.querySelector('.sidebar-toolbar')?.["querySelectorAll"]("button")) {
                var2337.classList.toggle("active", false);
              }
              this.classList.toggle("active", true);
              var2329.childNodes.forEach(_0x5e3e58 => {
                _0x5e3e58.style.display = 'none';
              });
              param286.document.querySelector("#AI4Paper-viewButton-imagesView").style.display = "flex";
              param286._pagesNum_imageLoaded === 0x0 && fn6();
            } else {
              for (let var2338 of param286.document.querySelector(".sidebar-toolbar")?.['querySelectorAll']("button")) {
                var2338.classList.toggle("active", false);
              }
              this.id != "AI4Paper-viewButton-filterAnnotations" && (this.classList.toggle('active', true), var2329.childNodes.forEach(_0x131aa5 => {
                _0x131aa5.style.display = '';
              }), param286.document.querySelectorAll("#AI4Paper-viewButton-imagesView").forEach(_0x2e79fb => _0x2e79fb.style.display = "none"));
            }
          };
        }
      }
      param286._pagesNum_imageLoaded = 0x0;
      param286._numOfAllLoadedImages = 0x0;
      param286._images_multiSelect = [];
      let var2339 = Zotero_Tabs._selectedID,
        var2340 = Zotero.Reader.getByTabID(var2339),
        var2341 = new Zotero.ProgressWindow({
          'closeOnClick': true
        });
      async function fn6() {
        try {
          let var2342 = var2340._primaryView._iframeWindow,
            var2343 = var2340._iframeWindow.wrappedJSObject.PDFViewerApplication,
            var2344 = var2343.pdfViewer.linkService;
          await var2343.pdfLoadingTask.promise;
          await var2343.pdfViewer.pagesPromise;
          let var2345,
            var2346 = false;
          param286._pagesNum_imageLoaded === 0x0 ? (var2345 = 0xa, var2346 = true) : var2345 = var2343.pdfDocument.numPages;
          !var2346 && fn8();
          let var2347 = false;
          for (let var2348 = param286._pagesNum_imageLoaded; var2348 < var2345 && var2348 < var2343.pdfDocument.numPages; var2348++) {
            const var2349 = var2343.pdfViewer._pages[var2348].pdfPage,
              var2350 = await var2349.getOperatorList();
            let var2351 = new var2342.pdfjsLib.SVGGraphics(var2349.commonObjs, var2349.objs),
              var2352 = await var2351.getSVG(var2350, var2349.getViewport({
                'scale': 0x1
              })),
              var2353 = Array.prototype.map.call(var2352.getElementsByTagName("svg:image"), _0x52d778 => _0x52d778.getAttribute("xlink:href")),
              var2354 = Array.prototype.map.call(var2352.getElementsByTagName('svg:image'), _0x4dcf77 => {
                let _0x108c58 = _0x4dcf77.transform.baseVal.consolidate().matrix,
                  _0x68c6d6 = _0x4dcf77.parentNode.transform.baseVal.consolidate().matrix,
                  _0x4de80e = Number(_0x4dcf77.attributes.getNamedItem("width").value.slice(0x0, -0x2)),
                  _0x581030 = Number(_0x4dcf77.attributes.getNamedItem('height').value.slice(0x0, -0x2)),
                  _0x436f14 = Math.abs(_0x4de80e * _0x108c58.a * _0x68c6d6.a),
                  _0x3159f1 = Math.abs(_0x581030 * _0x108c58.d * _0x68c6d6.d),
                  _0x5df98c = _0x108c58.f + _0x68c6d6.f,
                  _0x59539c = _0x108c58.e + _0x68c6d6.e;
                return window.console.table([_0x108c58, _0x68c6d6]), [_0x59539c, _0x5df98c, _0x59539c + _0x436f14, _0x5df98c + _0x3159f1];
              });
            if (var2353.length < 0x1 || var2353.length > 0x3c) {
              param286._pagesNum_imageLoaded = param286._pagesNum_imageLoaded + 0x1;
              if (!var2346) {
                fn9(param286._pagesNum_imageLoaded, var2343.pdfDocument.numPages);
              }
              continue;
            }
            var2347 = true;
            for (let var2363 = 0x0; var2363 < var2353.length; var2363++) {
              const var2364 = var2340._iframeWindow.document.createElement('img');
              var2364.setAttribute("src", var2353[var2363]);
              var2364.setAttribute("class", "previewImg");
              var2364.style = "width: 100%; border: 1px solid gray;border-radius: 5px;box-shadow:0 0 2px #d5ebe1;margin-top: 5px;margin-bottom: 10px;margin-left: 10px;margin-right: 10px;transition: all 0.1s;overflow: hidden;cursor: pointer;";
              var2364.setAttribute('title', "双击复制图片");
              var2364.info = '页面' + (var2348 + 0x1) + '_Figure_' + (var2363 + 0x1);
              var2364.onmouseover = function () {
                this.style.boxShadow = "0 0 3px blue";
              };
              var2364.onmouseout = function () {
                this.style.boxShadow = "0 0 2px #d5ebe1";
              };
              var2364.onclick = async function (param287) {
                if (Zotero.isMac && !param287.metaKey || !Zotero.isMac && !param287.ctrlKey) {
                  let var2365 = {
                    'item': var2364,
                    'info': '页面' + (var2348 + 0x1) + "_Figure_" + (var2363 + 0x1)
                  };
                  param286._images_multiSelect = [var2365];
                  let var2366 = {
                      'pageIndex': var2348,
                      'rects': [[var2354[var2363][0x0], var2354[var2363][0x1], var2354[var2363][0x2], var2354[var2363][0x3]]]
                    },
                    var2367 = var2330.querySelectorAll('img');
                  for (let var2368 of var2367) {
                    var2368 != this ? var2368.style.border = "1px solid gray" : (var2368.style.border = '3px\x20solid\x20red', var2368.style.boxShadow = "0 0 2px #d5ebe1");
                  }
                  var2344.goToPage(var2349.pageNumber);
                  await Zotero.Promise.delay(0xa);
                  var2340.navigate({
                    'position': var2366
                  });
                } else {
                  if (Zotero.isMac && param287.metaKey || !Zotero.isMac && param287.ctrlKey) {
                    if (!param286._images_multiSelect) {
                      let var2369 = {
                        'item': var2364,
                        'info': '页面' + (var2348 + 0x1) + "_Figure_" + (var2363 + 0x1)
                      };
                      param286._images_multiSelect.push(var2369);
                    } else {
                      let var2370 = param286._images_multiSelect.map(_0xe8b6fa => _0xe8b6fa.item);
                      if (var2370.indexOf(var2364) != -0x1) {
                        let var2371 = var2370.indexOf(var2364);
                        param286._images_multiSelect.splice(var2371, 0x1);
                      } else {
                        let var2372 = {
                          'item': var2364,
                          'info': '页面' + (var2348 + 0x1) + '_Figure_' + (var2363 + 0x1)
                        };
                        param286._images_multiSelect.push(var2372);
                      }
                    }
                    let _0x193a50 = var2330.querySelectorAll('img');
                    for (let var2374 of _0x193a50) {
                      let _0x36aa01 = param286._images_multiSelect.map(_0x488555 => _0x488555.item);
                      _0x36aa01.indexOf(var2374) != -0x1 ? (var2374.style.border = "3px solid red", var2374.style.boxShadow = "0 0 2px #d5ebe1") : var2374.style.border = "1px solid gray";
                    }
                  }
                }
              };
              var2364.ondblclick = function () {
                const _0x46e25c = var2340._iframeWindow.document.createElement("canvas");
                _0x46e25c.width = this.naturalWidth;
                _0x46e25c.height = this.naturalHeight;
                _0x46e25c.getContext('2d').drawImage(this, 0x0, 0x0);
                Zotero.AI4Paper.copyImage(_0x46e25c.toDataURL());
              };
              var2364.addEventListener(Zotero.isMac ? "contextmenu" : "pointerdown", _0x4445a6 => {
                if (!Zotero.isMac && _0x4445a6.button != 0x2) return;
                let var2377 = window.document.createXULElement("menupopup");
                var2377.id = "AI4Paper-viewImages-imageContextMenu-menupopup";
                let var2378 = window.document.createXULElement("menuitem");
                var2378.setAttribute("label", "拷贝图片");
                var2378.addEventListener("command", () => {
                  const var2379 = var2340._iframeWindow.document.createElement("canvas");
                  var2379.width = var2364.naturalWidth;
                  var2379.height = var2364.naturalHeight;
                  var2379.getContext('2d').drawImage(var2364, 0x0, 0x0);
                  Zotero.AI4Paper.copyImage(var2379.toDataURL());
                });
                var2377.appendChild(var2378);
                var2378 = window.document.createXULElement("menuitem");
                var2378.setAttribute("label", "导出图片");
                var2378.addEventListener('command', async () => {
                  if (param286._images_multiSelect.length < 0x2) {
                    const _0x1a4daf = var2340._iframeWindow.document.createElement("canvas");
                    _0x1a4daf.width = var2364.naturalWidth;
                    _0x1a4daf.height = var2364.naturalHeight;
                    _0x1a4daf.getContext('2d').drawImage(var2364, 0x0, 0x0);
                    Zotero.AI4Paper.saveImage(_0x1a4daf.toDataURL(), '页面' + (var2348 + 0x1) + "_Figure_" + (var2363 + 0x1));
                  } else {
                    let var2381 = await Zotero.AI4Paper.getTargetPath();
                    if (!var2381) return;else {
                      if (!(await OS.File.exists(var2381))) Zotero.AI4Paper.showProgressWindow(0xfa0, '路径不存在', "您设置的导出路径不存在或无权限！");else {
                        if (await OS.File.exists(var2381)) {
                          let _0x762385 = param286._images_multiSelect.map(_0x2e06ea => _0x2e06ea.item),
                            _0x30801a = param286._images_multiSelect.map(_0x423d1d => _0x423d1d.info);
                          for (let var2384 = 0x0; var2384 < _0x762385.length; var2384++) {
                            const _0x256f65 = var2340._iframeWindow.document.createElement("canvas");
                            _0x256f65.width = _0x762385[var2384].naturalWidth;
                            _0x256f65.height = _0x762385[var2384].naturalHeight;
                            _0x256f65.getContext('2d').drawImage(_0x762385[var2384], 0x0, 0x0);
                            await Zotero.AI4Paper.saveImageToTargetPath(_0x256f65.toDataURL(), var2381, _0x30801a[var2384]);
                          }
                          Zotero.AI4Paper.showProgressWindow(0x1770, '✅\x20批量导出图片成功【Zotero\x20One】', "成功导出【" + _0x762385.length + "】张图片至目标文件夹【" + var2381 + '】！');
                        }
                      }
                    }
                  }
                });
                var2377.appendChild(var2378);
                var2378 = window.document.createXULElement("menuitem");
                var2378.setAttribute("label", "导出全部图片");
                var2378.addEventListener("command", async () => {
                  let var2386 = await Zotero.AI4Paper.getTargetPath();
                  if (!var2386) {
                    return;
                  } else {
                    if (!(await OS.File.exists(var2386))) Zotero.AI4Paper.showProgressWindow(0xfa0, "路径不存在", "您设置的导出路径不存在或无权限！");else {
                      if (await OS.File.exists(var2386)) {
                        let var2387 = var2330.querySelectorAll("img"),
                          var2388 = [];
                        var2387.forEach(_0x398d7d => var2388.push(_0x398d7d.info));
                        for (let var2389 = 0x0; var2389 < var2387.length; var2389++) {
                          const _0x371c8f = var2340._iframeWindow.document.createElement("canvas");
                          _0x371c8f.width = var2387[var2389].naturalWidth;
                          _0x371c8f.height = var2387[var2389].naturalHeight;
                          _0x371c8f.getContext('2d').drawImage(var2387[var2389], 0x0, 0x0);
                          await Zotero.AI4Paper.saveImageToTargetPath(_0x371c8f.toDataURL(), var2386, var2388[var2389]);
                        }
                        Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 导出全部图片成功【AI4paper】", "成功导出全部【" + var2387.length + "】张图片至目标文件夹【" + var2386 + '】！');
                      }
                    }
                  }
                });
                var2377.appendChild(var2378);
                window.document.querySelector("#browser").querySelectorAll("#AI4Paper-viewImages-imageContextMenu-menupopup").forEach(_0x49649f => _0x49649f.remove());
                window.document.querySelector("#browser")?.["appendChild"](var2377);
                var2377.openPopup(var2364, "end_after", 0x0, 0x0, false, false);
              });
              var2330.insertBefore(var2364, var2331);
            }
            param286._pagesNum_imageLoaded = param286._pagesNum_imageLoaded + 0x1;
            param286._numOfAllLoadedImages = param286._numOfAllLoadedImages + var2353.length;
            let var2391 = param286.document.createElement("div");
            var2391.style = "padding-left: 5px;padding-right: 5px;height:16px;display: flex;align-items: center;justify-content: center;margin-bottom: 5px;font-family: Arial, sans-serif;background-color: #1d90ff;color: white;border-radius: 8px;";
            var2391.textContent = var2349.pageNumber;
            var2330.insertBefore(var2391, var2331);
            !var2346 && fn9(param286._pagesNum_imageLoaded, var2343.pdfDocument.numPages);
          }
          var2332.innerHTML = "<svg width=\"79.4\" height=\"28\" xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" version=\"1.1\">\n\n<g>\n<title>载入更多图片</title>\n<path id=\"svg_1\" fill=\"#FD7A45\" d=\"m71,25.4l-62.7,0c-4.6,0 -8.3,-3.8 -8.3,-8.4l0,-6c0,-4.6 3.7,-8.3 8.3,-8.3l62.7,0c4.6,0 8.3,3.7 8.3,8.3l0,6c0.1,4.6 -3.7,8.4 -8.3,8.4z\" class=\"st0\"/>\n<text id=\"svg_2\" font-size=\"11.2px\" font-family=\"'PingFangSC-Regular-GBpc-EUC-H'\" fill=\"#FFFFFF\" class=\"st1 st2 st3\" transform=\"matrix(1 0 0 1 6.3149 18.032)\">载入更多图片</text>\n</g>\n</svg>";
          if (var2346 && var2347) var2343.pdfDocument.numPages > 0xa ? (Zotero.AI4Paper.showProgressWindow(0x9c4, '已载入部分图片【Zotero\x20One】', '已为您载入前【10】页中的【' + param286._numOfAllLoadedImages + "】张图片，点击按钮【载入更多图片】可显示剩余图片。"), var2333.style.display = "flex", var2334.style.display = 'flex', var2334.textContent = "已载入【10/" + var2343.pdfDocument.numPages + "】页，图片共【" + param286._numOfAllLoadedImages + '】张') : (Zotero.AI4Paper.showProgressWindow(0x9c4, "✅ 完成全部页面的图片载入", "已载入全部【" + var2343.pdfDocument.numPages + "】页中的【" + param286._numOfAllLoadedImages + "】张图片！"), var2333.style.display = "flex", var2334.style.display = "flex", var2334.textContent = "已载入全部【" + var2343.pdfDocument.numPages + "】页中的【" + param286._numOfAllLoadedImages + '】张图片');else var2346 && !var2347 && (var2334.style.display = "flex", var2334.textContent = "前【10】页未发现图片，可尝试点击按钮【载入更多图片】。");
          if (param286._pagesNum_imageLoaded === var2343.pdfDocument.numPages) {
            var2332.style.display = "none";
            !var2346 && var2341.close();
            if (param286._numOfAllLoadedImages > 0x0 && var2343.pdfDocument.numPages > 0xa) {
              fn10(var2343.pdfDocument.numPages, param286._numOfAllLoadedImages);
              var2333.style.display = 'flex';
              var2334.style.display = 'flex';
              var2334.textContent = '已载入全部【' + var2343.pdfDocument.numPages + '】页中的【' + param286._numOfAllLoadedImages + '】张图片';
            } else param286._numOfAllLoadedImages < 0x1 && (Zotero.AI4Paper.showProgressWindow(0x1770, "无可载入的图片【AI4paper】", "当前文献无可载入的图片。（图片数量为 0 或者有无法解析的格式）"), var2334.style.display = "flex", var2334.textContent = "当前文献无可载入的图片");
          }
        } catch (_0x3dd1e9) {
          Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20载入图片出错啦【Zotero\x20One】', "Error: " + Zotero.getString(_0x3dd1e9) + '\x20载入图片出错啦，可能当前文献格式特殊。');
        }
      }
      function fn7() {
        param286._pagesNum_imageLoaded = 0x0;
        param286._numOfAllLoadedImages = 0x0;
        param286._images_multiSelect = [];
        var2332.style.display = "flex";
        var2332.innerHTML = "<svg width=\"79.4\" height=\"28\" xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" version=\"1.1\">\n\n <g>\n  <title>重新载入图片</title>\n  <path id=\"svg_1\" fill=\"#FD7A45\" d=\"m71,25.4l-62.7,0c-4.6,0 -8.3,-3.8 -8.3,-8.4l0,-6c0,-4.6 3.7,-8.3 8.3,-8.3l62.7,0c4.6,0 8.3,3.7 8.3,8.3l0,6c0.1,4.6 -3.7,8.4 -8.3,8.4z\" class=\"st0\"/>\n  <text id=\"svg_2\" font-size=\"11.2px\" font-family=\"'PingFangSC-Regular-GBpc-EUC-H'\" fill=\"#FFFFFF\" class=\"st1 st2 st3\" transform=\"matrix(1 0 0 1 6.3409 18.0599)\">重新载入图片</text>\n </g>\n</svg>";
        var2333.style.display = "none";
        var2334.style.display = "none";
        let var2392 = var2330.firstElementChild;
        while (var2392.id != "AI4Paper-DIV-loadImage") {
          var2392.remove();
          var2392 = var2330.firstElementChild;
        }
      }
      function fn8() {
        const var2393 = "chrome://zotero/skin/toolbar-advanced-search.png";
        var2341.changeHeadline("正在逐页载入图片...", var2393);
        const var2394 = "chrome://zotero/skin/toolbar-advanced-search" + (Zotero.hiDPI ? '@2x' : '') + ".png";
        var2341.progress = new var2341.ItemProgress(var2394, "正在逐页载入图片...");
      }
      function fn9(param288, param289) {
        let var2395 = Math.round(param288 / param289 * 0x64);
        var2341.progress.setProgress(var2395);
        var2341.progress.setText("当前进度： " + param288 + " of " + param289);
        var2341.show();
      }
      function fn10(param290, param291) {
        const var2396 = "chrome://zotero/skin/tick.png";
        var2341 = new Zotero.ProgressWindow({
          'closeOnClick': true
        });
        var2341.changeHeadline('✅\x20完成全部页面的图片载入');
        var2341.progress = new var2341.ItemProgress(var2396);
        var2341.progress.setProgress(0x64);
        var2341.progress.setText("已载入全部【" + param290 + "】页中的【" + param291 + '】张图片！');
        var2341.show();
        var2341.startCloseTimer(0x1770);
      }
    } else !Zotero.Prefs.get("ai4paper.enableReaderViewButtonViewImages") && param286.document.querySelector("#AI4Paper-viewButton-viewImages") && (param286.document.querySelector('#AI4Paper-viewButton-viewImages').remove(), param286.document.querySelectorAll('#AI4Paper-viewButton-imagesView').forEach(_0x114c2d => _0x114c2d.remove()));
  },
});
