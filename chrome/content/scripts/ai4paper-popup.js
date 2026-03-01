Object.assign(Zotero.AI4Paper, {
  'getImageDataURL': async function (annotation) {
    let filePath,
      dataDir = Zotero.Prefs.get("extensions.zotero.dataDir", true),
      groupLibId = Zotero.AI4Paper.checkGroupLibItem(annotation.parentItem);
    if (groupLibId) {
      filePath = dataDir + '\x5ccache\x5cgroups\x5c' + groupLibId + '\x5c' + annotation.key + ".png";
      (Zotero.isMac || Zotero.isLinux) && (filePath = dataDir + "/cache/groups/" + groupLibId + '/' + annotation.key + '.png');
    } else {
      filePath = dataDir + "\\cache\\library\\" + annotation.key + ".png";
      if (Zotero.isMac || Zotero.isLinux) {
        filePath = dataDir + '/cache/library/' + annotation.key + '.png';
      }
    }
    if (filePath && (await OS.File.exists(filePath))) {
      let binaryData = await Zotero.File.getBinaryContentsAsync(filePath),
        dataURL = 'data:image/png;base64,' + btoa(binaryData);
      return dataURL;
    }
    return false;
  },
  'onSelectText': async function (event, reader) {
    let selectedText = this.selectedText(reader).trim();
    if ([Zotero.Prefs.get("ai4paper.enabelColorLabel"), Zotero.Prefs.get("ai4paper.translationSelectionPopupTextArea"), Zotero.Prefs.get('ai4paper.gptviewSelectionPopupChatGPT'), Zotero.Prefs.get('ai4paper.metasoSelectionPopupButton'), Zotero.Prefs.get('ai4paper.translationSelectionPopup'), Zotero.Prefs.get('ai4paper.audioPlaySelectionPopupButton'), Zotero.Prefs.get("ai4paper.addWordsToEudicSelectionPopupButton")].includes(true)) {
      Zotero.AI4Paper.buildPopupButton(selectedText);
    }
    if (!selectedText) return false;
    if (!event.target || !event.target.closest || event.target.tagName === 'TEXTAREA') return false;
    if (this.getReaderItemContentType(reader) === "application/pdf") {
      if (!(event.target.closest(".pdfViewer") && !event.target.querySelector(".page"))) return false;
    } else {
      if (this.getReaderItemContentType(reader) === "text/html") {
        if (event.target.closest("#annotations") && event.target.closest(".annotations")) return false;
      } else {
        if (this.getReaderItemContentType(reader) === 'application/epub+zip') {
          if (!(event.target.closest(".flow-mode-paginated") && !event.target.querySelector("#annotation-overlay"))) return false;
        }
      }
    }
    Zotero.Prefs.get("ai4paper.translationcrossparagraphs") && (selectedText = '' + Zotero.Prefs.get("ai4paper.selectedtexttrans") + (selectedText ? '\x20' + selectedText : selectedText));
    if (!selectedText) return false;
    let originalText = selectedText;
    if (Zotero.Prefs.get("ai4paper.translationignorechinese")) {
      if (Zotero.AI4Paper.isChineseText(selectedText)) return false;
    }
    if (selectedText != Zotero.Prefs.get("ai4paper.selectedtexttrans") && Zotero.Prefs.get("ai4paper.translationremoveduplicated") || !Zotero.Prefs.get('ai4paper.translationremoveduplicated')) {
      if (Zotero.AI4Paper.getFunMetaTitle()) {
        if (Zotero.Prefs.get("ai4paper.translationvocabularyfirst")) {
          if (selectedText.indexOf('\x20') === -0x1) {
            Zotero.AI4Paper.updateTranslationPopupTextAreaPlaceHolder();
            Zotero.Prefs.get("ai4paper.translationreadersidepane") && (Zotero.AI4Paper.translateSourceText = originalText, Zotero.AI4Paper.translateResponse = '', Zotero.AI4Paper.updateTranslateReaderSidePane());
            selectedText = selectedText.trim();
            selectedText = selectedText.toLowerCase();
            selectedText = selectedText.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
            selectedText = selectedText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\"/\"/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
            selectedText = selectedText.replace(/[0-9]/g, '');
            let vocabResult = await Zotero.AI4Paper.vocabularySearchTrans(selectedText);
            if (vocabResult && vocabResult != -0x1) {
              Zotero.Prefs.set("ai4paper.selectedtexttrans", originalText);
              Zotero.Prefs.get("ai4paper.translationreadersidepane") && (Zotero.AI4Paper.translateResponse = vocabResult.replace(/<br>/g, '\x0a'), Zotero.AI4Paper.updateTranslateReaderSidePane());
              if (Zotero.Prefs.get("ai4paper.translationSelectionPopupTextArea")) {
                Zotero.AI4Paper.updateTranslationPopupTextArea(vocabResult.replace(/<br>/g, '\x0a'));
              }
              return Zotero.AI4Paper.vocabulary2TransNote(selectedText, vocabResult), -0x1;
            } else !Zotero.Prefs.get('ai4paper.selectedtexttransenable') && (Zotero.AI4Paper.showProgressWindow(0x5dc, "❌【金山词霸】" + selectedText, "哎呀，未查询到该单词！", "iciba"), Zotero.AI4Paper.updateTranslationPopupTextArea('❌【金山词霸】哎呀，未查询到该单词！'));
          }
        }
        Zotero.Prefs.get("ai4paper.selectedtexttransenable") && (Zotero.AI4Paper.updateTranslationPopupTextAreaPlaceHolder(), Zotero.Prefs.get("ai4paper.translationreadersidepane") && (Zotero.AI4Paper.translateSourceText = originalText, Zotero.AI4Paper.translateResponse = '', Zotero.AI4Paper.updateTranslateReaderSidePane()), Zotero.Prefs.set("ai4paper.selectedtexttrans", originalText), Zotero.AI4Paper.translationEngineTask(originalText, 'onSelect'));
      }
    }
  },
  'selectedText': function (reader) {
    var result, resultAlt;
    if (!reader) return '';
    if (reader._internalReader._type === 'pdf') {
      const selectionRanges = reader._internalReader._lastView._selectionRanges;
      return ((result = reader._internalReader._lastView._getAnnotationFromSelectionRanges(selectionRanges, "highlight")) === null || result === undefined ? undefined : result.text) || '';
    }
    return ((resultAlt = reader._internalReader._lastView._getAnnotationFromTextSelection("highlight")) === null || resultAlt === undefined ? undefined : resultAlt.text) || '';
  },
  'getSelectedText': function () {
    let reader = Zotero.AI4Paper.getCurrentReader();
    var result, resultAlt;
    if (!reader) {
      return '';
    }
    if (reader._internalReader._type === "pdf") {
      const selectionRanges = reader._internalReader._lastView._selectionRanges;
      return ((result = reader._internalReader._lastView._getAnnotationFromSelectionRanges(selectionRanges, "highlight")) === null || result === undefined ? undefined : result.text) || '';
    }
    return ((resultAlt = reader._internalReader._lastView._getAnnotationFromTextSelection('highlight')) === null || resultAlt === undefined ? undefined : resultAlt.text) || '';
  },
  'buildPopupButton': async function (text) {
    if (!Zotero.AI4Paper.betterURL()) {
      return;
    }
    await new Promise(r => setTimeout(r, 0x5));
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) return false;
    let popup = reader._iframeWindow.document.querySelector(".selection-popup");
    if (!popup) {
      return;
    }
    let isDarkMode = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")['matches'],
      hoverBgColor = !isDarkMode ? "#fffef2" : "#545454";
    if (Zotero.Prefs.get("ai4paper.enabelColorLabel") && popup.getAttribute('add-color-label') != "true") {
      popup.setAttribute("add-color-label", 'true');
      popup.style.maxWidth = '1000px';
      let colorIdx = 0x0,
        colorLabels = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get('ai4paper.redColorLabel'), Zotero.Prefs.get("ai4paper.greenColorLabel"), Zotero.Prefs.get('ai4paper.blueColorLabel'), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get('ai4paper.orangeColorLabel'), Zotero.Prefs.get("ai4paper.grayColorLabel")],
        colorValues = ["#ffd400", "#ff6666", "#5fb236", "#2ea8e5", '#a28ae5', "#e56eee", "#f19837", "#aaaaaa"],
        colorNodes = popup.childNodes[0x0].childNodes;
      for (colorIdx = 0x0; colorIdx < 0x8; colorIdx++) {
        let colorBtn = popup.childNodes[0x0].childNodes[colorIdx],
          btnHTML = colorBtn.innerHTML;
        colorBtn.style.width = "auto";
        let labelSpan = popup.ownerDocument.createElement("span");
        labelSpan.textContent = colorLabels[colorIdx];
        labelSpan.style.color = colorValues[colorIdx];
        labelSpan.style.marginLeft = "1px";
        labelSpan.style.marginRight = "1px";
        labelSpan.style.cursor = "default";
        colorBtn.innerHTML = '' + btnHTML + labelSpan.outerHTML;
        colorBtn.title = colorLabels[colorIdx];
      }
    }
    if ([Zotero.Prefs.get("ai4paper.gptviewSelectionPopupChatGPT"), Zotero.Prefs.get('ai4paper.metasoSelectionPopupButton'), Zotero.Prefs.get("ai4paper.translationSelectionPopup"), Zotero.Prefs.get("ai4paper.audioPlaySelectionPopupButton"), Zotero.Prefs.get("ai4paper.addWordsToEudicSelectionPopupButton")].includes(true) && popup.getAttribute("ai4paper-popup-button-div") != "true") {
      popup.setAttribute('ai4paper-popup-button-div', "true");
      let buttonContainer = popup.ownerDocument.createElement("button");
      buttonContainer.style.display = "inline-block";
      buttonContainer.style.borderRadius = '5px';
      buttonContainer.setAttribute("class", "toolbar-button wide-button ai4paper-popup-button-div ai4paper-popup-element");
      if (Zotero.Prefs.get("ai4paper.translationSelectionPopup")) {
        let translateBtn = popup.ownerDocument.createElement("button");
        translateBtn.setAttribute("title", '翻译');
        translateBtn.setAttribute('id', 'ai4paper-translate-popup-button');
        translateBtn.setAttribute("class", "ai4paper-translate-button ai4paper-popup-element ai4paper-popup-button");
        translateBtn.style.display = "inline";
        translateBtn.style.width = "30px";
        translateBtn.style.borderRadius = "5px";
        translateBtn.style.paddingTop = "3px";
        translateBtn.style.marginRight = '5px';
        translateBtn.style.marginLeft = "5px";
        Zotero.Prefs.get("ai4paper.translationcrossparagraphs") && !Zotero.Prefs.get('ai4paper.selectedtexttransenable') ? translateBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px.translationSelectionPopup_purple : translateBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px.translationSelectionPopup;
        translateBtn.addEventListener("mouseover", ev => {
          translateBtn.style.backgroundColor = hoverBgColor;
        });
        translateBtn.addEventListener("mouseout", ev => {
          translateBtn.style.backgroundColor = '';
        });
        translateBtn.addEventListener("click", ev => {
          Zotero.AI4Paper.onClickButton_Translate(text.trim());
        });
        buttonContainer.appendChild(translateBtn);
      }
      if (Zotero.Prefs.get('ai4paper.gptviewSelectionPopupChatGPT')) {
        let gptBtn = popup.ownerDocument.createElement("button");
        gptBtn.setAttribute("title", 'GPT');
        gptBtn.setAttribute('id', "ai4paper-chatgpt-popup-button");
        gptBtn.setAttribute("class", "ai4paper-chatgpt-button ai4paper-popup-element ai4paper-popup-button");
        gptBtn.style.display = 'inline';
        gptBtn.style.width = "30px";
        gptBtn.style.borderRadius = '5px';
        gptBtn.style.paddingTop = "3px";
        gptBtn.style.marginRight = "5px";
        gptBtn.style.marginLeft = "5px";
        Zotero.Prefs.get("ai4paper.gptMergeSelectedText") && Zotero.Prefs.get("ai4paper.gptMergeSelectedTextEnable") ? gptBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px.gptviewSelectionPopupChatGPT_purple : gptBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px.gptviewSelectionPopupChatGPT;
        gptBtn.addEventListener("mouseover", ev => {
          gptBtn.style.backgroundColor = hoverBgColor;
        });
        gptBtn.addEventListener("mouseout", ev => {
          gptBtn.style.backgroundColor = '';
        });
        gptBtn.onclick = ev => {
          if (ev.shiftKey) Zotero.Prefs.get("ai4paper.action4SelectionPopupChatGPT") === '填充选中文本至消息框' ? (Zotero.AI4Paper.expandReaderContextPane(), Zotero.AI4Paper.focusReaderSidePane("gpt"), Zotero.AI4Paper.onClickButton_nowChatGPT(text)) : (Zotero.AI4Paper.expandReaderContextPane(), Zotero.AI4Paper.focusReaderSidePane("gpt"), Zotero.AI4Paper.onClickButton_ChatGPT(text));else {
            if (Zotero.Prefs.get("ai4paper.action4SelectionPopupChatGPT") === "填充选中文本至消息框") {
              Zotero.AI4Paper.expandReaderContextPane();
              Zotero.AI4Paper.focusReaderSidePane("gpt");
              Zotero.AI4Paper.onClickButton_ChatGPT(text);
            } else {
              if (Zotero.Prefs.get("ai4paper.action4SelectionPopupChatGPT") === "直接发起请求") {
                Zotero.AI4Paper.expandReaderContextPane();
                Zotero.AI4Paper.focusReaderSidePane("gpt");
                Zotero.AI4Paper.onClickButton_nowChatGPT(text);
              } else {
                let promptPopup = window.document.createXULElement("menupopup");
                promptPopup.id = "AI4Paper-SelectionPopup-gptPromptList-menupopup";
                promptPopup.addEventListener('popuphidden', () => {
                  window.document.querySelector('#browser').querySelectorAll("#AI4Paper-SelectionPopup-gptPromptList-menupopup").forEach(el => el.remove());
                });
                let firstChild = promptPopup.firstElementChild;
                while (firstChild) {
                  firstChild.remove();
                  firstChild = promptPopup.firstElementChild;
                }
                let defaultItems = ['无'];
                for (let itemLabel of defaultItems) {
                  menuitem = window.document.createXULElement("menuitem");
                  menuitem.value = itemLabel;
                  menuitem.label = itemLabel;
                  menuitem.setAttribute("tooltiptext", itemLabel);
                  menuitem.addEventListener("command", ev => {
                    Zotero.AI4Paper.onClickPromptItem_SelectionPopupChatGPT(text, itemLabel);
                  });
                  promptPopup.appendChild(menuitem);
                }
                let userTemplates = Zotero.Prefs.get('ai4paper.chatgptprompttemplateuser'),
                  templateList = [];
                if (userTemplates != '') {
                  let templateLines = userTemplates.split('\x0a');
                  for (let line of templateLines) {
                    if (line != '') {
                      line = line.trim();
                      if (line.lastIndexOf('👈') === line.length - 0x2) {
                        let leftIdx = line.lastIndexOf('👈');
                        if (line.lastIndexOf('👉') != -0x1) {
                          let rightIdx = line.lastIndexOf('👉'),
                            promptName = line.substring(rightIdx + 0x2, leftIdx).trim();
                          menuitem = window.document.createXULElement('menuitem');
                          menuitem.value = promptName;
                          menuitem.label = promptName;
                          menuitem.setAttribute("tooltiptext", line);
                          menuitem.addEventListener('command', ev => {
                            Zotero.AI4Paper.onClickPromptItem_SelectionPopupChatGPT(text, promptName);
                          });
                          promptPopup.appendChild(menuitem);
                        } else {
                          menuitem = window.document.createXULElement('menuitem');
                          menuitem.value = line;
                          menuitem.label = line;
                          menuitem.setAttribute('tooltiptext', line);
                          menuitem.addEventListener("command", ev => {
                            Zotero.AI4Paper.onClickPromptItem_SelectionPopupChatGPT(text, line);
                          });
                          promptPopup.appendChild(menuitem);
                        }
                      } else {
                        menuitem = window.document.createXULElement('menuitem');
                        menuitem.value = line;
                        menuitem.label = line;
                        menuitem.setAttribute("tooltiptext", line);
                        menuitem.addEventListener("command", ev => {
                          Zotero.AI4Paper.onClickPromptItem_SelectionPopupChatGPT(text, line);
                        });
                        promptPopup.appendChild(menuitem);
                      }
                    }
                  }
                }
                window.document.querySelector("#browser").querySelectorAll('#AI4Paper-SelectionPopup-gptPromptList-menupopup').forEach(el => el.remove());
                window.document.querySelector("#browser")?.["appendChild"](promptPopup);
                promptPopup.openPopup(gptBtn, "after_start", 0x0, 0x0, false, false);
              }
            }
          }
        };
        gptBtn.addEventListener("pointerdown", ev => {
          ev.preventDefault && ev.preventDefault();
          ev.stopPropagation();
          ev.button == 0x2 && (Zotero.Prefs.get("ai4paper.action4SelectionPopupChatGPT") === "直接发起请求" ? (Zotero.AI4Paper.expandReaderContextPane(), Zotero.AI4Paper.focusReaderSidePane("gpt"), Zotero.AI4Paper.onClickButton_ChatGPT(text)) : (Zotero.AI4Paper.expandReaderContextPane(), Zotero.AI4Paper.focusReaderSidePane("gpt"), Zotero.AI4Paper.onClickButton_nowChatGPT(text)));
        }, false);
        buttonContainer.appendChild(gptBtn);
      }
      if (Zotero.Prefs.get("ai4paper.metasoSelectionPopupButton")) {
        let metasoBtn = popup.ownerDocument.createElement("button");
        metasoBtn.setAttribute("title", "秘塔 AI 搜索");
        metasoBtn.setAttribute('id', "ai4paper-metaso-popup-button");
        metasoBtn.setAttribute("class", "ai4paper-metaso-button ai4paper-popup-element ai4paper-popup-button");
        metasoBtn.style.display = "inline";
        metasoBtn.style.width = "30px";
        metasoBtn.style.borderRadius = "5px";
        metasoBtn.style.paddingTop = "3px";
        metasoBtn.style.marginRight = "5px";
        metasoBtn.style.marginLeft = "5px";
        metasoBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px.metasoSelectionPopupButton;
        metasoBtn.addEventListener("mouseover", ev => {
          metasoBtn.style.backgroundColor = hoverBgColor;
        });
        metasoBtn.addEventListener("mouseout", ev => {
          metasoBtn.style.backgroundColor = '';
        });
        metasoBtn.onclick = ev => {
          Zotero.AI4Paper.meataso_WebSearch(text);
        };
        buttonContainer.appendChild(metasoBtn);
      }
      if (Zotero.Prefs.get("ai4paper.audioPlaySelectionPopupButton")) {
        let audioBtn = popup.ownerDocument.createElement("button");
        audioBtn.setAttribute('title', '播放发音');
        audioBtn.setAttribute('id', "ai4paper-audioPlay-popup-button");
        audioBtn.setAttribute("class", "ai4paper-audioPlay-button ai4paper-popup-element ai4paper-popup-button");
        audioBtn.style.display = "inline";
        audioBtn.style.width = "30px";
        audioBtn.style.borderRadius = "5px";
        audioBtn.style.paddingTop = '3px';
        audioBtn.style.marginRight = "5px";
        audioBtn.style.marginLeft = "5px";
        audioBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px.audioPlaySelectionPopupButton;
        audioBtn.addEventListener('mouseover', ev => {
          audioBtn.style.backgroundColor = hoverBgColor;
        });
        audioBtn.addEventListener("mouseout", ev => {
          audioBtn.style.backgroundColor = '';
        });
        audioBtn.onclick = ev => {
          let accent = "英式发音";
          Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === "美式发音" && (accent = '美式发音');
          Zotero.AI4Paper.selectionPopupButtonAudioPlay(text, accent);
        };
        audioBtn.addEventListener("pointerdown", ev => {
          ev.preventDefault && ev.preventDefault();
          ev.stopPropagation();
          if (ev.button == 0x2) {
            let altAccent = "英式发音";
            Zotero.Prefs.get("ai4paper.wordsaudiopreferpronunciation") === "英式发音" ? altAccent = "美式发音" : altAccent = "英式发音";
            Zotero.AI4Paper.selectionPopupButtonAudioPlay(text, altAccent);
          }
        }, false);
        buttonContainer.appendChild(audioBtn);
      }
      if (Zotero.Prefs.get("ai4paper.addWordsToEudicSelectionPopupButton")) {
        let eudicBtn = popup.ownerDocument.createElement("button");
        eudicBtn.setAttribute("title", '收藏生词至欧路词典');
        eudicBtn.setAttribute('id', "ai4paper-addWordsToEudic-popup-button");
        eudicBtn.setAttribute("class", 'ai4paper-addWordsToEudic-button\x20ai4paper-popup-element\x20ai4paper-popup-button');
        eudicBtn.style.display = "inline";
        eudicBtn.style.width = "30px";
        eudicBtn.style.borderRadius = '5px';
        eudicBtn.style.paddingTop = '3px';
        eudicBtn.style.marginRight = "5px";
        eudicBtn.style.marginLeft = "5px";
        eudicBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px.addWordsToEudicSelectionPopupButton;
        eudicBtn.addEventListener("mouseover", ev => {
          eudicBtn.style.backgroundColor = hoverBgColor;
        });
        eudicBtn.addEventListener("mouseout", ev => {
          eudicBtn.style.backgroundColor = '';
        });
        eudicBtn.onclick = ev => {
          Zotero.AI4Paper.addWordsToEudic(text.trim());
        };
        eudicBtn.addEventListener("pointerdown", ev => {
          ev.preventDefault && ev.preventDefault();
          ev.stopPropagation();
          ev.button == 0x2 && Zotero.AI4Paper.modifyEudicWords(text.trim());
        }, false);
        buttonContainer.appendChild(eudicBtn);
      }
      popup.appendChild(buttonContainer);
    }
    if (Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea') && popup.getAttribute('translate-popup-textarea') != "true") {
      popup.style.maxWidth = "1000px";
      popup.setAttribute("translate-popup-textarea", "true");
      let textarea = popup.ownerDocument.createElement("textarea");
      textarea.setAttribute('id', "ai4paper-translate-popup-textarea");
      textarea.setAttribute("class", "ai4paper-translate-textarea ai4paper-popup-element");
      textarea.style.fontSize = '13px';
      let fontSize = Zotero.Prefs.get("ai4paper.translationSelectionPopupTextAreaFontSize");
      Number(fontSize) && (textarea.style.fontSize = fontSize + 'px');
      textarea.style.lineHeight = Zotero.Prefs.get("ai4paper.translationSelectionPopupTextAreaLineHeight");
      textarea.style.width = "-moz-available";
      let textareaWidth = Zotero.Prefs.get("ai4paper.translationSelectionPopupTextAreaWidth");
      if (textareaWidth != "auto") {
        if (Number(textareaWidth)) {
          textarea.style.width = textareaWidth + 'px';
        }
      }
      textarea.style.overflowY = "auto";
      textarea.style.maxHeight = "200px";
      let textareaHeight = Zotero.Prefs.get("ai4paper.translationSelectionPopupTextAreaHeight");
      Number(textareaHeight) && (textarea.style.maxHeight = textareaHeight + 'px');
      textarea.style.fontFamily = 'Arial,\x20sans-serif';
      textarea.style.paddingLeft = "3px";
      textarea.style.paddingRight = "3px";
      textarea.style.paddingBottom = "3px";
      textarea.setAttribute("spellcheck", false);
      textarea.addEventListener("dblclick", ev => {
        ev.target.selectionStart = 0x0;
        ev.target.selectionEnd = ev.target.value.length;
        Zotero.AI4Paper.copy2Clipboard(ev.target.value);
      });
      textarea.addEventListener("keydown", ev => {
        if (Zotero.isMac && !ev.shiftKey && !ev.ctrlKey && !ev.altKey && ev.metaKey && ev.keyCode === 0x41) {
          ev.returnValue = false;
          ev.preventDefault && ev.preventDefault();
          ev.target.selectionStart = 0x0;
          ev.target.selectionEnd = ev.target.value.length;
        } else (Zotero.isWin || Zotero.isLinux) && !ev.shiftKey && ev.ctrlKey && !ev.altKey && !ev.metaKey && ev.keyCode === 0x41 && (ev.returnValue = false, ev.preventDefault && ev.preventDefault(), ev.target.selectionStart = 0x0, ev.target.selectionEnd = ev.target.value.length);
      });
      textarea.addEventListener("mousedown", async ev => {
        if (ev.shiftKey) {
          ev.returnValue = false;
          ev.preventDefault && ev.preventDefault();
          Zotero.AI4Paper.meataso_WebSearch(ev.target.value);
          return;
        }
        if (ev.button == 0x2) {
          let textValue = ev.target.value;
          if (textValue.indexOf("🔉 英") != -0x1) Zotero.AI4Paper.translateSidePaneAudioPlay(Zotero.Prefs.get('ai4paper.selectedtexttrans'));else {
            let audioResult = await Zotero.AI4Paper.translateSidePaneAudioPlay(Zotero.Prefs.get("ai4paper.selectedtexttrans"));
            audioResult && audioResult != -0x1 && Zotero.AI4Paper.updateTranslationPopupTextArea(audioResult.replace(/<br>/g, '\x0a'));
          }
        }
      });
      !Zotero.Prefs.get("ai4paper.selectedtexttransenable") && (textarea.hidden = true);
      textarea.hidden = true;
      popup.appendChild(textarea);
    }
    if (Zotero.Prefs.get("ai4paper.hideZoteroToolToggleButton")) {
      let waitCount = 0x0;
      while (!popup.querySelector('.tool-toggle')) {
        if (waitCount >= 0xf) {
          Zotero.debug('AI4Paper:\x20Waiting\x20for\x20tool-toggle\x20button\x20failed');
          return;
        }
        await Zotero.Promise.delay(0x2);
        waitCount++;
      }
      popup.querySelector(".tool-toggle").style.display = "none";
    }
  },
  'changeGPTPopupButtonName': function (isEnabled) {
    let svgIcon = isEnabled ? Zotero.AI4Paper.svg_icon_16px.gptviewSelectionPopupChatGPT : Zotero.AI4Paper.svg_icon_16px.gptviewSelectionPopupChatGPT_purple,
      reader = Zotero.AI4Paper.getCurrentReader();
    if (!reader) return false;
    let gptBtn = reader._iframeWindow.document.querySelector(".ai4paper-chatgpt-button");
    gptBtn && (gptBtn.innerHTML = svgIcon);
  },
  'changeTranslationPopupButtonName': function (isEnabled) {
    let svgIcon = isEnabled ? Zotero.AI4Paper.svg_icon_16px.translationSelectionPopup : Zotero.AI4Paper.svg_icon_16px.translationSelectionPopup_purple,
      reader = Zotero.AI4Paper.getCurrentReader();
    if (!reader) return false;
    let translateBtn = reader._iframeWindow.document.querySelector(".ai4paper-translate-button");
    translateBtn && (translateBtn.innerHTML = svgIcon);
  },
  'updateTranslationPopupTextArea': async function (content) {
    if (!Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea')) return;
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) {
      return false;
    }
    let textarea = reader._iframeWindow.document.querySelector(".ai4paper-translate-textarea");
    textarea ? (textarea.hidden = false, textarea.value = content, fn5(textarea)) : (await new Promise(r => setTimeout(r, 0xf)), textarea = reader._iframeWindow.document.querySelector(".ai4paper-translate-textarea"), textarea && (textarea.hidden = false, textarea.value = content, fn5(textarea)));
    function fn5(el) {
      el.style.height = "auto";
      let maxH = 0xc8,
        configHeight = Zotero.Prefs.get("ai4paper.translationSelectionPopupTextAreaHeight");
      Number(configHeight) && (maxH = Number(configHeight));
      el.style.height = Math.min(el.scrollHeight, maxH) + 'px';
    }
    ;
  },
  'updateTranslationPopupTextAreaBoxShadow': async function (state) {
    if (!Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea')) {
      return;
    }
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) {
      return false;
    }
    let textarea = reader._iframeWindow.document.querySelector('.ai4paper-translate-textarea');
    if (textarea) {
      textarea.hidden = false;
      if (state === "start") textarea.style.boxShadow = "0 0 4px blue";else state === "done" && (textarea.style.boxShadow = '');
    } else {
      await new Promise(r => setTimeout(r, 0xf));
      textarea = reader._iframeWindow.document.querySelector(".ai4paper-translate-textarea");
      if (textarea) {
        textarea.hidden = false;
        if (state === 'start') textarea.style.boxShadow = "0 0 4px blue";else state === 'done' && (textarea.style.boxShadow = '');
      }
    }
  },
  'updateTranslationPopupTextAreaPlaceHolder': async function () {
    if (!Zotero.Prefs.get("ai4paper.translationSelectionPopupTextArea")) return;
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) return false;
    let textarea = reader._iframeWindow.document.querySelector('.ai4paper-translate-textarea');
    textarea ? (textarea.hidden = false, textarea.setAttribute("placeholder", "正在请求...")) : (await new Promise(r => setTimeout(r, 0xf)), textarea = reader._iframeWindow.document.querySelector('.ai4paper-translate-textarea'), textarea && (textarea.hidden = false, textarea.setAttribute("placeholder", "正在请求...")));
  },
  'onClickPromptItem_SelectionPopupChatGPT': function (text, promptName) {
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 未开启【GPT 侧边栏】", "请先开启【GPT 侧边栏】，再执行本操作！");
      return;
    }
    Zotero.AI4Paper.expandReaderContextPane();
    Zotero.AI4Paper.focusReaderSidePane("gpt");
    Zotero.AI4Paper.onClickButton_ChatGPT(text);
    window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").value = promptName;
    Zotero.Prefs.set('ai4paper.chatgptprompttemplate', promptName);
    Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? Zotero.AI4Paper.gptReaderSidePane_ChatMode_send() : Zotero.AI4Paper.gptReaderSidePane_send();
  },
  'addColorLabel': function (iframeWin) {
    if (!Zotero.Prefs.get("ai4paper.enabelColorLabel")) return;
    let iframes = iframeWin.document.querySelectorAll("iframe");
    for (let iframe of iframes) {
      let contentWin = iframe?.["contentWindow"];
      contentWin && !contentWin._addColorLabelInit && (contentWin._addColorLabelInit = true, contentWin.document.addEventListener('pointerup', async function (ev) {
        if (!Zotero.Prefs.get('ai4paper.enabelColorLabel')) {
          return;
        }
        await Zotero.Promise.delay(0x5);
        let popup = iframeWin.document.querySelector(".selection-popup");
        if (popup) {
          popup.style.maxWidth = "800px";
          let colorIdx = 0x0,
            colorLabels = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get("ai4paper.greenColorLabel"), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get('ai4paper.orangeColorLabel'), Zotero.Prefs.get("ai4paper.grayColorLabel")],
            colorNodes = iframeWin.document.querySelector('.selection-popup').childNodes[0x0].childNodes;
          for (let node of colorNodes) {
            node.title = colorLabels[colorIdx];
            node.textContent = colorLabels[colorIdx];
            colorIdx++;
          }
        }
      }, false));
    }
  },
  'addButtonColorLabel': function (iframeWin) {
    if (!Zotero.Prefs.get('ai4paper.enabelColorLabel')) {
      return;
    }
    let dropdownBtn = iframeWin.document.querySelector(".toolbar-button.toolbar-dropdown-button");
    dropdownBtn && !dropdownBtn._addButtonColorLabel && (dropdownBtn._addButtonColorLabel = true, dropdownBtn.addEventListener("click", async ev => {
      if (!Zotero.Prefs.get("ai4paper.enabelColorLabel") || !Zotero.AI4Paper) return;
      if (!dropdownBtn.disabled) {
        let waitCount = 0x0;
        while (!iframeWin.document.querySelectorAll('.row.basic')[0x1]) {
          if (waitCount >= 0xc8) {
            Zotero.debug("AI4Paper: Waiting for button failed");
            return;
          }
          await Zotero.Promise.delay(0x5);
          waitCount++;
        }
        let colorIdx = 0x0,
          colorLabels = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get('ai4paper.greenColorLabel'), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get("ai4paper.orangeColorLabel"), Zotero.Prefs.get("ai4paper.grayColorLabel")],
          rows = iframeWin.document.querySelectorAll(".row.basic");
        for (let row of rows) {
          let divEndIdx = row.innerHTML.indexOf("div>"),
            divPrefix = row.innerHTML.substring(0x0, divEndIdx + 0x4);
          row.innerHTML = '' + divPrefix + colorLabels[colorIdx];
          colorIdx++;
        }
      }
    }, false));
    if (iframeWin && !iframeWin._addColorLabel_ContextMenu) {
      iframeWin._addColorLabel_ContextMenu = true;
      iframeWin.document.addEventListener("pointerdown", async ev => {
        if (!Zotero.Prefs.get("ai4paper.enabelColorLabel") || !Zotero.AI4Paper) {
          return;
        }
        if (ev.button === 0x0 && ev.target.closest(".more")) {
          let waitCount = 0x0;
          while (!iframeWin.document.querySelector(".context-menu")) {
            if (waitCount >= 0xc8) {
              Zotero.debug("AI4Paper: Waiting for context-menu failed");
              return;
            }
            await Zotero.Promise.delay(0x5);
            waitCount++;
          }
          if (iframeWin.document.querySelector('.context-menu')) {
            let contextMenu = iframeWin.document.querySelector(".context-menu"),
              colorIdx = 0x0,
              colorLabels = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get('ai4paper.greenColorLabel'), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get('ai4paper.orangeColorLabel'), Zotero.Prefs.get('ai4paper.grayColorLabel')],
              colorNodes = contextMenu.childNodes[0x1].childNodes;
            for (let node of colorNodes) {
              let divEndIdx = node.innerHTML.indexOf('div>'),
                divPrefix = node.innerHTML.substring(0x0, divEndIdx + 0x4);
              node.innerHTML = '' + divPrefix + colorLabels[colorIdx];
              colorIdx++;
            }
          }
        }
      }, false);
      iframeWin.document.addEventListener("pointerdown", async ev => {
        if (!Zotero.Prefs.get("ai4paper.enabelColorLabel") || !Zotero.AI4Paper) {
          return;
        }
        if (ev.button === 0x2 && ev.target.closest("#annotationsView")) {
          let waitCount = 0x0;
          while (!iframeWin.document.querySelector('.context-menu')) {
            if (waitCount >= 0xc8) {
              Zotero.debug("AI4Paper: Waiting for context-menu failed");
              return;
            }
            await Zotero.Promise.delay(0x5);
            waitCount++;
          }
          if (iframeWin.document.querySelector(".context-menu")) {
            let contextMenu = iframeWin.document.querySelector(".context-menu"),
              colorIdx = 0x0,
              colorLabels = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get("ai4paper.greenColorLabel"), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get('ai4paper.magentaColorLabel'), Zotero.Prefs.get("ai4paper.orangeColorLabel"), Zotero.Prefs.get("ai4paper.grayColorLabel")],
              colorNodes = contextMenu.childNodes[0x1].childNodes;
            for (let node of colorNodes) {
              let divEndIdx = node.innerHTML.indexOf('div>'),
                divPrefix = node.innerHTML.substring(0x0, divEndIdx + 0x4);
              node.innerHTML = '' + divPrefix + colorLabels[colorIdx];
              colorIdx++;
            }
          }
        }
      }, false);
    }
  },
  'addViewButtons': async function (iframeWin) {
    if (Zotero.Prefs.get('ai4paper.enableReaderViewButtonFilterAnnotations') && !iframeWin.document.querySelector("#AI4Paper-viewButton-filterAnnotations")) {
      let waitCount = 0x0;
      while (!iframeWin.document.querySelector('#viewOutline')) {
        if (waitCount >= 0xc8) {
          Zotero.debug('AI4Paper:\x20Waiting\x20for\x20viewOutline\x20button\x20failed');
          return;
        }
        await Zotero.Promise.delay(0xa);
        waitCount++;
      }
      let outlineBtn = iframeWin.document.querySelector('#viewOutline'),
        iconMap = {
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
        filterBtn = iframeWin.document.createElement("button");
      filterBtn.setAttribute('id', "AI4Paper-viewButton-filterAnnotations");
      filterBtn.title = "注释筛选";
      filterBtn.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      filterBtn.innerHTML = iconMap.none;
      filterBtn.addEventListener("pointerdown", ev => {
        if (ev.button == 0x2) {
          filterBtn.innerHTML = iconMap.none;
          filterBtn.title = "注释筛选";
          iframeWin._annotationFilterType = 'none';
          Zotero.AI4Paper.filterAnnotations(iframeWin, "none");
        }
      }, false);
      filterBtn.addEventListener("click", ev => {
        let menuPopup = window.document.createXULElement("menupopup");
        menuPopup.id = "AI4Paper-viewButton-filterAnnotations-menupopup";
        let menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === "none" && menuItem.setAttribute("checked", true);
        menuItem.setAttribute('label', "全部 (共 " + Zotero.AI4Paper.countAnnotations("none") + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.none;
          filterBtn.title = '注释筛选';
          iframeWin._annotationFilterType = "none";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "none");
        });
        menuPopup.appendChild(menuItem);
        let separator = window.document.createXULElement("menuseparator");
        menuPopup.appendChild(separator);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === 'highlight' && menuItem.setAttribute("checked", true);
        menuItem.setAttribute("label", "高亮 (" + Zotero.AI4Paper.countAnnotations("highlight") + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.highlight;
          filterBtn.title = '高亮';
          iframeWin._annotationFilterType = "highlight";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "highlight");
        });
        menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === 'underline' && menuItem.setAttribute("checked", true);
        menuItem.setAttribute("label", "下划线 (" + Zotero.AI4Paper.countAnnotations("underline") + ')');
        menuItem.addEventListener('command', () => {
          filterBtn.innerHTML = iconMap.underline;
          filterBtn.title = "下划线";
          iframeWin._annotationFilterType = 'underline';
          Zotero.AI4Paper.filterAnnotations(iframeWin, "underline");
        });
        menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        if (iframeWin._annotationFilterType === "note") {
          menuItem.setAttribute("checked", true);
        }
        menuItem.setAttribute("label", '笔记\x20(' + Zotero.AI4Paper.countAnnotations('note') + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.note;
          filterBtn.title = '笔记';
          iframeWin._annotationFilterType = "note";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "note");
        });
        menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === "text" && menuItem.setAttribute("checked", true);
        menuItem.setAttribute("label", '文本\x20(' + Zotero.AI4Paper.countAnnotations('text') + ')');
        menuItem.addEventListener('command', () => {
          filterBtn.innerHTML = iconMap.text;
          filterBtn.title = '文本';
          iframeWin._annotationFilterType = "text";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "text");
        });
        menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === "image" && menuItem.setAttribute("checked", true);
        menuItem.setAttribute('label', "图片 (" + Zotero.AI4Paper.countAnnotations("image") + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.image;
          filterBtn.title = '图片';
          iframeWin._annotationFilterType = "image";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "image");
        });
        menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === 'ink' && menuItem.setAttribute("checked", true);
        menuItem.setAttribute('label', '画笔\x20(' + Zotero.AI4Paper.countAnnotations('ink') + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.ink;
          filterBtn.title = '画笔';
          iframeWin._annotationFilterType = "ink";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "ink");
        });
        menuPopup.appendChild(menuItem);
        separator = window.document.createXULElement("menuseparator");
        menuPopup.appendChild(separator);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute('type', "checkbox");
        if (iframeWin._annotationFilterType === 'annotationHead') {
          menuItem.setAttribute("checked", true);
        }
        menuItem.setAttribute("label", "大纲标题 (" + Zotero.AI4Paper.countAnnotations('annotationHead') + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.annotationHead;
          filterBtn.title = "大纲标题";
          iframeWin._annotationFilterType = 'annotationHead';
          Zotero.AI4Paper.filterAnnotations(iframeWin, 'annotationHead');
        });
        menuPopup.appendChild(menuItem);
        let subMenu = window.document.createXULElement("menu");
        subMenu.setAttribute("type", "checkbox");
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(iframeWin._annotationFilterType) && subMenu.setAttribute("checked", true);
        let subMenuPopup = window.document.createXULElement("menupopup");
        subMenu.setAttribute("label", "各级标题");
        subMenu.appendChild(subMenuPopup);
        if (!Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandOutlineMenuItem")) {
          menuPopup.appendChild(subMenu);
        }
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        if (iframeWin._annotationFilterType === 'H1') {
          menuItem.setAttribute('checked', true);
        }
        menuItem.setAttribute("label", "H1 (" + Zotero.AI4Paper.countAnnotations('H1') + ')');
        menuItem.addEventListener('command', () => {
          filterBtn.innerHTML = iconMap.H1;
          filterBtn.title = 'H1';
          iframeWin._annotationFilterType = 'H1';
          Zotero.AI4Paper.filterAnnotations(iframeWin, 'H1');
        });
        if (!Zotero.Prefs.get('ai4paper.filterAnnotationsButtonExpandOutlineMenuItem')) {
          subMenuPopup.appendChild(menuItem);
        } else menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === 'H2' && menuItem.setAttribute('checked', true);
        menuItem.setAttribute("label", 'H2\x20(' + Zotero.AI4Paper.countAnnotations('H2') + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.H2;
          filterBtn.title = 'H2';
          iframeWin._annotationFilterType = 'H2';
          Zotero.AI4Paper.filterAnnotations(iframeWin, 'H2');
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandOutlineMenuItem") ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === 'H3' && menuItem.setAttribute("checked", true);
        menuItem.setAttribute("label", "H3 (" + Zotero.AI4Paper.countAnnotations('H3') + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.H3;
          filterBtn.title = 'H3';
          iframeWin._annotationFilterType = 'H3';
          Zotero.AI4Paper.filterAnnotations(iframeWin, 'H3');
        });
        !Zotero.Prefs.get('ai4paper.filterAnnotationsButtonExpandOutlineMenuItem') ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute('type', 'checkbox');
        iframeWin._annotationFilterType === 'H4' && menuItem.setAttribute('checked', true);
        menuItem.setAttribute('label', "H4 (" + Zotero.AI4Paper.countAnnotations('H4') + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.H4;
          filterBtn.title = 'H4';
          iframeWin._annotationFilterType = 'H4';
          Zotero.AI4Paper.filterAnnotations(iframeWin, 'H4');
        });
        !Zotero.Prefs.get('ai4paper.filterAnnotationsButtonExpandOutlineMenuItem') ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === 'H5' && menuItem.setAttribute("checked", true);
        menuItem.setAttribute('label', "H5 (" + Zotero.AI4Paper.countAnnotations('H5') + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.H5;
          filterBtn.title = 'H5';
          iframeWin._annotationFilterType = 'H5';
          Zotero.AI4Paper.filterAnnotations(iframeWin, 'H5');
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandOutlineMenuItem") ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute('type', "checkbox");
        iframeWin._annotationFilterType === 'H6' && menuItem.setAttribute("checked", true);
        menuItem.setAttribute('label', "H6 (" + Zotero.AI4Paper.countAnnotations('H6') + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.H6;
          filterBtn.title = 'H6';
          iframeWin._annotationFilterType = 'H6';
          Zotero.AI4Paper.filterAnnotations(iframeWin, 'H6');
        });
        !Zotero.Prefs.get('ai4paper.filterAnnotationsButtonExpandOutlineMenuItem') ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        separator = window.document.createXULElement("menuseparator");
        menuPopup.appendChild(separator);
        let colorLabels = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get("ai4paper.greenColorLabel"), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get("ai4paper.orangeColorLabel"), Zotero.Prefs.get("ai4paper.grayColorLabel")];
        subMenu = window.document.createXULElement("menu");
        subMenu.setAttribute("type", "checkbox");
        if (["yellow", 'red', "green", "blue", 'purple', 'magenta', "orange", 'gray'].includes(iframeWin._annotationFilterType)) {
          subMenu.setAttribute("checked", true);
        }
        subMenuPopup = window.document.createXULElement("menupopup");
        subMenu.setAttribute('label', '颜色');
        subMenu.appendChild(subMenuPopup);
        if (!Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem")) {
          menuPopup.appendChild(subMenu);
        }
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === "yellow" && menuItem.setAttribute("checked", true);
        menuItem.setAttribute('label', "黄色 🟨 (" + Zotero.AI4Paper.countAnnotations("yellow") + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && colorLabels[0x0].trim() && menuItem.setAttribute('label', "黄色 🟨 " + colorLabels[0x0].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("yellow") + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.yellow;
          filterBtn.title = '黄色';
          iframeWin._annotationFilterType = 'yellow';
          Zotero.AI4Paper.filterAnnotations(iframeWin, "yellow");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute('type', "checkbox");
        iframeWin._annotationFilterType === "red" && menuItem.setAttribute("checked", true);
        menuItem.setAttribute('label', "红色 🟥 (" + Zotero.AI4Paper.countAnnotations('red') + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && colorLabels[0x1].trim() && menuItem.setAttribute("label", "红色 🟥 " + colorLabels[0x1].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("red") + ')');
        menuItem.addEventListener('command', () => {
          filterBtn.innerHTML = iconMap.red;
          filterBtn.title = '红色';
          iframeWin._annotationFilterType = "red";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "red");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === "green" && menuItem.setAttribute('checked', true);
        menuItem.setAttribute('label', '绿色\x20🟩\x20(' + Zotero.AI4Paper.countAnnotations('green') + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && colorLabels[0x2].trim() && menuItem.setAttribute('label', "绿色 🟩 " + colorLabels[0x2].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("green") + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.green;
          filterBtn.title = '绿色';
          iframeWin._annotationFilterType = "green";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "green");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement('menuitem');
        menuItem.setAttribute("type", 'checkbox');
        iframeWin._annotationFilterType === "blue" && menuItem.setAttribute("checked", true);
        menuItem.setAttribute("label", "蓝色 🟦 (" + Zotero.AI4Paper.countAnnotations("blue") + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && colorLabels[0x3].trim() && menuItem.setAttribute("label", "蓝色 🟦 " + colorLabels[0x3].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations('blue') + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.blue;
          filterBtn.title = '蓝色';
          iframeWin._annotationFilterType = "blue";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "blue");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === 'purple' && menuItem.setAttribute("checked", true);
        menuItem.setAttribute("label", '紫色\x20🟪\x20(' + Zotero.AI4Paper.countAnnotations('purple') + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && colorLabels[0x4].trim() && menuItem.setAttribute("label", "紫色 🟪 " + colorLabels[0x4].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("purple") + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.purple;
          filterBtn.title = '紫色';
          iframeWin._annotationFilterType = "purple";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "purple");
        });
        if (!Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem")) subMenuPopup.appendChild(menuItem);else {
          menuPopup.appendChild(menuItem);
        }
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === "magenta" && menuItem.setAttribute("checked", true);
        menuItem.setAttribute("label", "洋红色 🟣 (" + Zotero.AI4Paper.countAnnotations("magenta") + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && colorLabels[0x5].trim() && menuItem.setAttribute("label", "洋红色 🟣 " + colorLabels[0x5].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations('magenta') + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.magenta;
          filterBtn.title = "洋红色";
          iframeWin._annotationFilterType = "magenta";
          Zotero.AI4Paper.filterAnnotations(iframeWin, "magenta");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        if (iframeWin._annotationFilterType === 'orange') {
          menuItem.setAttribute('checked', true);
        }
        menuItem.setAttribute("label", "橘色 🟧 (" + Zotero.AI4Paper.countAnnotations("orange") + ')');
        Zotero.Prefs.get("ai4paper.enabelColorLabel") && colorLabels[0x6].trim() && menuItem.setAttribute("label", "橘色 🟧 " + colorLabels[0x6].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("orange") + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.orange;
          filterBtn.title = '橘色';
          iframeWin._annotationFilterType = 'orange';
          Zotero.AI4Paper.filterAnnotations(iframeWin, "orange");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        menuItem = window.document.createXULElement('menuitem');
        menuItem.setAttribute("type", "checkbox");
        iframeWin._annotationFilterType === "gray" && menuItem.setAttribute('checked', true);
        menuItem.setAttribute('label', "灰色 ⬜ (" + Zotero.AI4Paper.countAnnotations("gray") + ')');
        if (Zotero.Prefs.get('ai4paper.enabelColorLabel') && colorLabels[0x7].trim()) {
          menuItem.setAttribute("label", "灰色 ⬜ " + colorLabels[0x7].trim() + '\x20(' + Zotero.AI4Paper.countAnnotations("gray") + ')');
        }
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.gray;
          filterBtn.title = '灰色';
          iframeWin._annotationFilterType = 'gray';
          Zotero.AI4Paper.filterAnnotations(iframeWin, "gray");
        });
        !Zotero.Prefs.get("ai4paper.filterAnnotationsButtonExpandColorMenuItem") ? subMenuPopup.appendChild(menuItem) : menuPopup.appendChild(menuItem);
        separator = window.document.createXULElement('menuseparator');
        menuPopup.appendChild(separator);
        menuItem = window.document.createXULElement('menuitem');
        menuItem.setAttribute("type", 'checkbox');
        iframeWin._annotationFilterType === "UniversalQuoteLink" && menuItem.setAttribute("checked", true);
        menuItem.setAttribute("label", "通用引用链接 (" + Zotero.AI4Paper.countAnnotations("UniversalQuoteLink") + ')');
        menuItem.addEventListener("command", () => {
          filterBtn.innerHTML = iconMap.UniversalQuoteLink;
          filterBtn.title = "通用引用链接";
          iframeWin._annotationFilterType = 'UniversalQuoteLink';
          Zotero.AI4Paper.filterAnnotations(iframeWin, 'UniversalQuoteLink');
        });
        menuPopup.appendChild(menuItem);
        window.document.querySelector("#browser").querySelectorAll("#AI4Paper-viewButton-filterAnnotations-menupopup").forEach(el => el.remove());
        window.document.querySelector("#browser")?.["appendChild"](menuPopup);
        menuPopup.openPopup(filterBtn, 'after_start', 0x0, 0x0, false, false);
      });
      outlineBtn.parentNode.appendChild(filterBtn);
      if (!iframeWin._annotationFilterType) {
        iframeWin._annotationFilterType = 'none';
        Zotero.AI4Paper.filterAnnotations(iframeWin, "none");
      } else {
        filterBtn.innerHTML = iconMap[iframeWin._annotationFilterType];
        Zotero.AI4Paper.filterAnnotations(iframeWin, iframeWin._annotationFilterType);
      }
    } else !Zotero.Prefs.get("ai4paper.enableReaderViewButtonFilterAnnotations") && iframeWin.document.querySelector('#AI4Paper-viewButton-filterAnnotations') && (iframeWin.document.querySelector("#AI4Paper-viewButton-filterAnnotations").remove(), Zotero.AI4Paper.filterAnnotations(iframeWin, "none"));
    if (Zotero.Prefs.get("ai4paper.enableReaderViewButtonViewImages") && !iframeWin.document.querySelector("#AI4Paper-viewButton-viewImages") && Zotero.AI4Paper.getCurrentReader()?.["_item"]["attachmentContentType"] === "application/pdf") {
      let waitCount = 0x0;
      while (!iframeWin.document.querySelector("#viewOutline")) {
        if (waitCount >= 0xc8) {
          Zotero.debug('AI4Paper:\x20Waiting\x20for\x20viewOutline\x20button\x20failed');
          return;
        }
        await Zotero.Promise.delay(0xa);
        waitCount++;
      }
      let outlineBtn = iframeWin.document.querySelector("#viewOutline"),
        viewImagesBtn = iframeWin.document.createElement("button");
      viewImagesBtn.setAttribute('id', "AI4Paper-viewButton-viewImages");
      viewImagesBtn.title = '查看图片';
      viewImagesBtn.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      viewImagesBtn.innerHTML = '<svg\x20width=\x2220\x22\x20height=\x2220\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20xml:space=\x22preserve\x22\x20version=\x221.1\x22>\x0a\x0a\x20\x20\x20\x20\x20<g>\x0a\x20\x20\x20\x20\x20\x20<title>查看图片</title>\x0a\x20\x20\x20\x20\x20\x20<path\x20id=\x22svg_1\x22\x20fill=\x22#808080\x22\x20d=\x22m16.4,1.3l-12.8,0c-1.3,0\x20-2.3,1\x20-2.3,2.3l0,12.9c0,1.3\x201,2.3\x202.3,2.3l12.9,0c1.3,0\x202.3,-1\x202.3,-2.3l0,-12.9c-0.1,-1.3\x20-1.1,-2.3\x20-2.4,-2.3zm-12.8,0.8l12.9,0c0.8,0\x201.5,0.7\x201.5,1.5l0,2.7c-2.9,0.1\x20-5.7,1.3\x20-7.8,3.4c-1,1\x20-1.8,2.1\x20-2.3,3.3c-1.6,-1.4\x20-4,-1.5\x20-5.7,-0.3l0,-9.1c-0.1,-0.8\x200.6,-1.5\x201.4,-1.5zm-1.5,14.3l0,-2.7c1.5,-1.5\x203.9,-1.4\x205.4,0c-0.5,1.3\x20-0.7,2.6\x20-0.7,4c0,0\x200,0.1\x200,0.1l-3.2,0c-0.8,0.1\x20-1.5,-0.6\x20-1.5,-1.4zm14.3,1.5l-8.8,0c0,0\x200,-0.1\x200,-0.1c0,-2.9\x201.1,-5.6\x203.1,-7.6c1.9,-1.9\x204.5,-3\x207.2,-3.1l0,9.4c0,0.7\x20-0.7,1.4\x20-1.5,1.4z\x22\x20class=\x22st0\x22/>\x0a\x20\x20\x20\x20\x20\x20<path\x20id=\x22svg_2\x22\x20fill=\x22#808080\x22\x20d=\x22m6.1,8.1c1.2,0\x202.2,-1\x202.2,-2.2s-1,-2.2\x20-2.2,-2.2s-2.2,1\x20-2.2,2.2s1,2.2\x202.2,2.2zm0,-3.5c0.7,0\x201.3,0.6\x201.3,1.3s-0.6,1.3\x20-1.3,1.3s-1.3,-0.5\x20-1.3,-1.3s0.6,-1.3\x201.3,-1.3z\x22\x20class=\x22st0\x22/>\x0a\x20\x20\x20\x20\x20</g>\x0a\x20\x20\x20\x20</svg>';
      outlineBtn.after(viewImagesBtn);
      viewImagesBtn.addEventListener("click", ev => {});
      let sidebarContent = iframeWin.document.querySelector("#sidebarContent"),
        imagesContainer = iframeWin.document.createElement('div');
      imagesContainer.id = "AI4Paper-viewButton-imagesView";
      imagesContainer.setAttribute("style", 'display:\x20none;width:\x20100%;justify-content:\x20center;flex-wrap:\x20wrap;padding-right:\x204px;');
      iframeWin.document.querySelectorAll("#AI4Paper-viewButton-imagesView").forEach(el => el.remove());
      sidebarContent.appendChild(imagesContainer);
      let loadBtnDiv = iframeWin.document.createElement('div');
      loadBtnDiv.setAttribute('id', "AI4Paper-DIV-loadImage");
      loadBtnDiv.setAttribute("style", "display: flex;width: 100%;justify-content: center;flex-wrap: wrap;margin-top: 10px;margin-bottom: 15px;");
      let loadMoreBtn = iframeWin.document.createElement("button");
      loadMoreBtn.setAttribute('id', "AI4Paper-Button-loadImage");
      loadMoreBtn.setAttribute('style', "display: flex;width: 88px;height: 32px;cursor: default;");
      loadMoreBtn.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons");
      loadMoreBtn.onclick = fn6;
      loadMoreBtn.innerHTML = "<svg width=\"79.4\" height=\"28\" xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" version=\"1.1\">\n\n <g>\n  <title>载入更多图片</title>\n  <path id=\"svg_1\" fill=\"#FD7A45\" d=\"m71,25.4l-62.7,0c-4.6,0 -8.3,-3.8 -8.3,-8.4l0,-6c0,-4.6 3.7,-8.3 8.3,-8.3l62.7,0c4.6,0 8.3,3.7 8.3,8.3l0,6c0.1,4.6 -3.7,8.4 -8.3,8.4z\" class=\"st0\"/>\n  <text id=\"svg_2\" font-size=\"11.2px\" font-family=\"'PingFangSC-Regular-GBpc-EUC-H'\" fill=\"#FFFFFF\" class=\"st1 st2 st3\" transform=\"matrix(1 0 0 1 6.3149 18.032)\">载入更多图片</text>\n </g>\n</svg>";
      let clearBtn = iframeWin.document.createElement("button");
      clearBtn.setAttribute('id', "AI4Paper-Button-clearImage");
      clearBtn.setAttribute("style", 'display:\x20none;width:\x2088px;height:\x2032px;cursor:\x20default;');
      clearBtn.setAttribute("class", 'toolbar-button\x20AI4Paper-Reader-Buttons');
      clearBtn.onclick = fn7;
      clearBtn.innerHTML = "<svg width=\"79.4\" height=\"28\" xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" version=\"1.1\">\n\n <g>\n  <title>清除全部图片</title>\n  <path id=\"svg_1\" fill=\"#EB2F06\" d=\"m71,25.4l-62.7,0c-4.6,0 -8.3,-3.8 -8.3,-8.4l0,-6c0,-4.6 3.7,-8.3 8.3,-8.3l62.7,0c4.6,0 8.3,3.7 8.3,8.3l0,6c0.1,4.6 -3.7,8.4 -8.3,8.4z\" class=\"st0\"/>\n  <text id=\"svg_2\" font-size=\"11.2px\" font-family=\"'PingFangSC-Regular-GBpc-EUC-H'\" fill=\"#FFFFFF\" class=\"st1 st2 st3\" transform=\"matrix(1 0 0 1 6.3465 18.0374)\">清除全部图片</text>\n </g>\n</svg>";
      loadBtnDiv.appendChild(loadMoreBtn);
      loadBtnDiv.appendChild(clearBtn);
      imagesContainer.appendChild(loadBtnDiv);
      let statusDiv = iframeWin.document.createElement("div");
      statusDiv.setAttribute('id', "AI4Paper-DIV-loadImage");
      statusDiv.setAttribute("style", "display: none;width: 100%;justify-content: center;flex-wrap: wrap;margin-bottom: 5px;margin-left: 3px;margin-bottom: 3px;");
      statusDiv.textContent = '';
      imagesContainer.appendChild(statusDiv);
      let toolbarButtons = iframeWin.document.querySelector(".sidebar-toolbar")?.["querySelectorAll"]('button');
      for (let btn of toolbarButtons) {
        if (!btn._onClickViewButton) {
          btn._onClickViewButton = true;
          btn.onclick = function () {
            if (this.id === 'AI4Paper-viewButton-viewImages') {
              for (let otherBtn of iframeWin.document.querySelector('.sidebar-toolbar')?.["querySelectorAll"]("button")) {
                otherBtn.classList.toggle("active", false);
              }
              this.classList.toggle("active", true);
              sidebarContent.childNodes.forEach(child => {
                child.style.display = 'none';
              });
              iframeWin.document.querySelector("#AI4Paper-viewButton-imagesView").style.display = "flex";
              iframeWin._pagesNum_imageLoaded === 0x0 && fn6();
            } else {
              for (let otherBtn of iframeWin.document.querySelector(".sidebar-toolbar")?.['querySelectorAll']("button")) {
                otherBtn.classList.toggle("active", false);
              }
              this.id != "AI4Paper-viewButton-filterAnnotations" && (this.classList.toggle('active', true), sidebarContent.childNodes.forEach(child => {
                child.style.display = '';
              }), iframeWin.document.querySelectorAll("#AI4Paper-viewButton-imagesView").forEach(el => el.style.display = "none"));
            }
          };
        }
      }
      iframeWin._pagesNum_imageLoaded = 0x0;
      iframeWin._numOfAllLoadedImages = 0x0;
      iframeWin._images_multiSelect = [];
      let tabID = Zotero_Tabs._selectedID,
        reader = Zotero.Reader.getByTabID(tabID),
        progressWin = new Zotero.ProgressWindow({
          'closeOnClick': true
        });
      async function fn6() {
        try {
          let primaryWin = reader._primaryView._iframeWindow,
            pdfApp = reader._iframeWindow.wrappedJSObject.PDFViewerApplication,
            linkService = pdfApp.pdfViewer.linkService;
          await pdfApp.pdfLoadingTask.promise;
          await pdfApp.pdfViewer.pagesPromise;
          let maxPages,
            isFirstLoad = false;
          iframeWin._pagesNum_imageLoaded === 0x0 ? (maxPages = 0xa, isFirstLoad = true) : maxPages = pdfApp.pdfDocument.numPages;
          !isFirstLoad && fn8();
          let hasImages = false;
          for (let pageIdx = iframeWin._pagesNum_imageLoaded; pageIdx < maxPages && pageIdx < pdfApp.pdfDocument.numPages; pageIdx++) {
            const pdfPage = pdfApp.pdfViewer._pages[pageIdx].pdfPage,
              opList = await pdfPage.getOperatorList();
            let svgGraphics = new primaryWin.pdfjsLib.SVGGraphics(pdfPage.commonObjs, pdfPage.objs),
              svgEl = await svgGraphics.getSVG(opList, pdfPage.getViewport({
                'scale': 0x1
              })),
              imageHrefs = Array.prototype.map.call(svgEl.getElementsByTagName("svg:image"), img => img.getAttribute("xlink:href")),
              imageRects = Array.prototype.map.call(svgEl.getElementsByTagName('svg:image'), img => {
                let imgMatrix = img.transform.baseVal.consolidate().matrix,
                  parentMatrix = img.parentNode.transform.baseVal.consolidate().matrix,
                  imgWidth = Number(img.attributes.getNamedItem("width").value.slice(0x0, -0x2)),
                  imgHeight = Number(img.attributes.getNamedItem('height').value.slice(0x0, -0x2)),
                  scaledWidth = Math.abs(imgWidth * imgMatrix.a * parentMatrix.a),
                  scaledHeight = Math.abs(imgHeight * imgMatrix.d * parentMatrix.d),
                  posY = imgMatrix.f + parentMatrix.f,
                  posX = imgMatrix.e + parentMatrix.e;
                return window.console.table([imgMatrix, parentMatrix]), [posX, posY, posX + scaledWidth, posY + scaledHeight];
              });
            if (imageHrefs.length < 0x1 || imageHrefs.length > 0x3c) {
              iframeWin._pagesNum_imageLoaded = iframeWin._pagesNum_imageLoaded + 0x1;
              if (!isFirstLoad) {
                fn9(iframeWin._pagesNum_imageLoaded, pdfApp.pdfDocument.numPages);
              }
              continue;
            }
            hasImages = true;
            for (let imgIdx = 0x0; imgIdx < imageHrefs.length; imgIdx++) {
              const imgEl = reader._iframeWindow.document.createElement('img');
              imgEl.setAttribute("src", imageHrefs[imgIdx]);
              imgEl.setAttribute("class", "previewImg");
              imgEl.style = "width: 100%; border: 1px solid gray;border-radius: 5px;box-shadow:0 0 2px #d5ebe1;margin-top: 5px;margin-bottom: 10px;margin-left: 10px;margin-right: 10px;transition: all 0.1s;overflow: hidden;cursor: pointer;";
              imgEl.setAttribute('title', "双击复制图片");
              imgEl.info = '页面' + (pageIdx + 0x1) + '_Figure_' + (imgIdx + 0x1);
              imgEl.onmouseover = function () {
                this.style.boxShadow = "0 0 3px blue";
              };
              imgEl.onmouseout = function () {
                this.style.boxShadow = "0 0 2px #d5ebe1";
              };
              imgEl.onclick = async function (clickEvent) {
                if (Zotero.isMac && !clickEvent.metaKey || !Zotero.isMac && !clickEvent.ctrlKey) {
                  let selected = {
                    'item': imgEl,
                    'info': '页面' + (pageIdx + 0x1) + "_Figure_" + (imgIdx + 0x1)
                  };
                  iframeWin._images_multiSelect = [selected];
                  let position = {
                      'pageIndex': pageIdx,
                      'rects': [[imageRects[imgIdx][0x0], imageRects[imgIdx][0x1], imageRects[imgIdx][0x2], imageRects[imgIdx][0x3]]]
                    },
                    allImages = imagesContainer.querySelectorAll('img');
                  for (let img of allImages) {
                    img != this ? img.style.border = "1px solid gray" : (img.style.border = '3px\x20solid\x20red', img.style.boxShadow = "0 0 2px #d5ebe1");
                  }
                  linkService.goToPage(pdfPage.pageNumber);
                  await Zotero.Promise.delay(0xa);
                  reader.navigate({
                    'position': position
                  });
                } else {
                  if (Zotero.isMac && clickEvent.metaKey || !Zotero.isMac && clickEvent.ctrlKey) {
                    if (!iframeWin._images_multiSelect) {
                      let selected = {
                        'item': imgEl,
                        'info': '页面' + (pageIdx + 0x1) + "_Figure_" + (imgIdx + 0x1)
                      };
                      iframeWin._images_multiSelect.push(selected);
                    } else {
                      let selectedItems = iframeWin._images_multiSelect.map(s => s.item);
                      if (selectedItems.indexOf(imgEl) != -0x1) {
                        let idx = selectedItems.indexOf(imgEl);
                        iframeWin._images_multiSelect.splice(idx, 0x1);
                      } else {
                        let selected = {
                          'item': imgEl,
                          'info': '页面' + (pageIdx + 0x1) + '_Figure_' + (imgIdx + 0x1)
                        };
                        iframeWin._images_multiSelect.push(selected);
                      }
                    }
                    let allImages = imagesContainer.querySelectorAll('img');
                    for (let img of allImages) {
                      let selectedItems = iframeWin._images_multiSelect.map(s => s.item);
                      selectedItems.indexOf(img) != -0x1 ? (img.style.border = "3px solid red", img.style.boxShadow = "0 0 2px #d5ebe1") : img.style.border = "1px solid gray";
                    }
                  }
                }
              };
              imgEl.ondblclick = function () {
                const canvas = reader._iframeWindow.document.createElement("canvas");
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                canvas.getContext('2d').drawImage(this, 0x0, 0x0);
                Zotero.AI4Paper.copyImage(canvas.toDataURL());
              };
              imgEl.addEventListener(Zotero.isMac ? "contextmenu" : "pointerdown", ev => {
                if (!Zotero.isMac && ev.button != 0x2) return;
                let ctxMenuPopup = window.document.createXULElement("menupopup");
                ctxMenuPopup.id = "AI4Paper-viewImages-imageContextMenu-menupopup";
                let ctxMenuItem = window.document.createXULElement("menuitem");
                ctxMenuItem.setAttribute("label", "拷贝图片");
                ctxMenuItem.addEventListener("command", () => {
                  const canvas = reader._iframeWindow.document.createElement("canvas");
                  canvas.width = imgEl.naturalWidth;
                  canvas.height = imgEl.naturalHeight;
                  canvas.getContext('2d').drawImage(imgEl, 0x0, 0x0);
                  Zotero.AI4Paper.copyImage(canvas.toDataURL());
                });
                ctxMenuPopup.appendChild(ctxMenuItem);
                ctxMenuItem = window.document.createXULElement("menuitem");
                ctxMenuItem.setAttribute("label", "导出图片");
                ctxMenuItem.addEventListener('command', async () => {
                  if (iframeWin._images_multiSelect.length < 0x2) {
                    const canvas = reader._iframeWindow.document.createElement("canvas");
                    canvas.width = imgEl.naturalWidth;
                    canvas.height = imgEl.naturalHeight;
                    canvas.getContext('2d').drawImage(imgEl, 0x0, 0x0);
                    Zotero.AI4Paper.saveImage(canvas.toDataURL(), '页面' + (pageIdx + 0x1) + "_Figure_" + (imgIdx + 0x1));
                  } else {
                    let targetPath = await Zotero.AI4Paper.getTargetPath();
                    if (!targetPath) return;else {
                      if (!(await OS.File.exists(targetPath))) Zotero.AI4Paper.showProgressWindow(0xfa0, '路径不存在', "您设置的导出路径不存在或无权限！");else {
                        if (await OS.File.exists(targetPath)) {
                          let selectedImgs = iframeWin._images_multiSelect.map(s => s.item),
                            selectedInfos = iframeWin._images_multiSelect.map(s => s.info);
                          for (let i = 0x0; i < selectedImgs.length; i++) {
                            const canvas = reader._iframeWindow.document.createElement("canvas");
                            canvas.width = selectedImgs[i].naturalWidth;
                            canvas.height = selectedImgs[i].naturalHeight;
                            canvas.getContext('2d').drawImage(selectedImgs[i], 0x0, 0x0);
                            await Zotero.AI4Paper.saveImageToTargetPath(canvas.toDataURL(), targetPath, selectedInfos[i]);
                          }
                          Zotero.AI4Paper.showProgressWindow(0x1770, '✅\x20批量导出图片成功【Zotero\x20One】', "成功导出【" + selectedImgs.length + "】张图片至目标文件夹【" + targetPath + '】！');
                        }
                      }
                    }
                  }
                });
                ctxMenuPopup.appendChild(ctxMenuItem);
                ctxMenuItem = window.document.createXULElement("menuitem");
                ctxMenuItem.setAttribute("label", "导出全部图片");
                ctxMenuItem.addEventListener("command", async () => {
                  let targetPath = await Zotero.AI4Paper.getTargetPath();
                  if (!targetPath) {
                    return;
                  } else {
                    if (!(await OS.File.exists(targetPath))) Zotero.AI4Paper.showProgressWindow(0xfa0, "路径不存在", "您设置的导出路径不存在或无权限！");else {
                      if (await OS.File.exists(targetPath)) {
                        let allImages = imagesContainer.querySelectorAll("img"),
                          imageInfos = [];
                        allImages.forEach(img => imageInfos.push(img.info));
                        for (let i = 0x0; i < allImages.length; i++) {
                          const canvas = reader._iframeWindow.document.createElement("canvas");
                          canvas.width = allImages[i].naturalWidth;
                          canvas.height = allImages[i].naturalHeight;
                          canvas.getContext('2d').drawImage(allImages[i], 0x0, 0x0);
                          await Zotero.AI4Paper.saveImageToTargetPath(canvas.toDataURL(), targetPath, imageInfos[i]);
                        }
                        Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 导出全部图片成功【AI4paper】", "成功导出全部【" + allImages.length + "】张图片至目标文件夹【" + targetPath + '】！');
                      }
                    }
                  }
                });
                ctxMenuPopup.appendChild(ctxMenuItem);
                window.document.querySelector("#browser").querySelectorAll("#AI4Paper-viewImages-imageContextMenu-menupopup").forEach(el => el.remove());
                window.document.querySelector("#browser")?.["appendChild"](ctxMenuPopup);
                ctxMenuPopup.openPopup(imgEl, "end_after", 0x0, 0x0, false, false);
              });
              imagesContainer.insertBefore(imgEl, loadBtnDiv);
            }
            iframeWin._pagesNum_imageLoaded = iframeWin._pagesNum_imageLoaded + 0x1;
            iframeWin._numOfAllLoadedImages = iframeWin._numOfAllLoadedImages + imageHrefs.length;
            let pageBadge = iframeWin.document.createElement("div");
            pageBadge.style = "padding-left: 5px;padding-right: 5px;height:16px;display: flex;align-items: center;justify-content: center;margin-bottom: 5px;font-family: Arial, sans-serif;background-color: #1d90ff;color: white;border-radius: 8px;";
            pageBadge.textContent = pdfPage.pageNumber;
            imagesContainer.insertBefore(pageBadge, loadBtnDiv);
            !isFirstLoad && fn9(iframeWin._pagesNum_imageLoaded, pdfApp.pdfDocument.numPages);
          }
          loadMoreBtn.innerHTML = "<svg width=\"79.4\" height=\"28\" xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" version=\"1.1\">\n\n<g>\n<title>载入更多图片</title>\n<path id=\"svg_1\" fill=\"#FD7A45\" d=\"m71,25.4l-62.7,0c-4.6,0 -8.3,-3.8 -8.3,-8.4l0,-6c0,-4.6 3.7,-8.3 8.3,-8.3l62.7,0c4.6,0 8.3,3.7 8.3,8.3l0,6c0.1,4.6 -3.7,8.4 -8.3,8.4z\" class=\"st0\"/>\n<text id=\"svg_2\" font-size=\"11.2px\" font-family=\"'PingFangSC-Regular-GBpc-EUC-H'\" fill=\"#FFFFFF\" class=\"st1 st2 st3\" transform=\"matrix(1 0 0 1 6.3149 18.032)\">载入更多图片</text>\n</g>\n</svg>";
          if (isFirstLoad && hasImages) pdfApp.pdfDocument.numPages > 0xa ? (Zotero.AI4Paper.showProgressWindow(0x9c4, '已载入部分图片【Zotero\x20One】', '已为您载入前【10】页中的【' + iframeWin._numOfAllLoadedImages + "】张图片，点击按钮【载入更多图片】可显示剩余图片。"), clearBtn.style.display = "flex", statusDiv.style.display = 'flex', statusDiv.textContent = "已载入【10/" + pdfApp.pdfDocument.numPages + "】页，图片共【" + iframeWin._numOfAllLoadedImages + '】张') : (Zotero.AI4Paper.showProgressWindow(0x9c4, "✅ 完成全部页面的图片载入", "已载入全部【" + pdfApp.pdfDocument.numPages + "】页中的【" + iframeWin._numOfAllLoadedImages + "】张图片！"), clearBtn.style.display = "flex", statusDiv.style.display = "flex", statusDiv.textContent = "已载入全部【" + pdfApp.pdfDocument.numPages + "】页中的【" + iframeWin._numOfAllLoadedImages + '】张图片');else isFirstLoad && !hasImages && (statusDiv.style.display = "flex", statusDiv.textContent = "前【10】页未发现图片，可尝试点击按钮【载入更多图片】。");
          if (iframeWin._pagesNum_imageLoaded === pdfApp.pdfDocument.numPages) {
            loadMoreBtn.style.display = "none";
            !isFirstLoad && progressWin.close();
            if (iframeWin._numOfAllLoadedImages > 0x0 && pdfApp.pdfDocument.numPages > 0xa) {
              fn10(pdfApp.pdfDocument.numPages, iframeWin._numOfAllLoadedImages);
              clearBtn.style.display = 'flex';
              statusDiv.style.display = 'flex';
              statusDiv.textContent = '已载入全部【' + pdfApp.pdfDocument.numPages + '】页中的【' + iframeWin._numOfAllLoadedImages + '】张图片';
            } else iframeWin._numOfAllLoadedImages < 0x1 && (Zotero.AI4Paper.showProgressWindow(0x1770, "无可载入的图片【AI4paper】", "当前文献无可载入的图片。（图片数量为 0 或者有无法解析的格式）"), statusDiv.style.display = "flex", statusDiv.textContent = "当前文献无可载入的图片");
          }
        } catch (e) {
          Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20载入图片出错啦【Zotero\x20One】', "Error: " + Zotero.getString(e) + '\x20载入图片出错啦，可能当前文献格式特殊。');
        }
      }
      function fn7() {
        iframeWin._pagesNum_imageLoaded = 0x0;
        iframeWin._numOfAllLoadedImages = 0x0;
        iframeWin._images_multiSelect = [];
        loadMoreBtn.style.display = "flex";
        loadMoreBtn.innerHTML = "<svg width=\"79.4\" height=\"28\" xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" version=\"1.1\">\n\n <g>\n  <title>重新载入图片</title>\n  <path id=\"svg_1\" fill=\"#FD7A45\" d=\"m71,25.4l-62.7,0c-4.6,0 -8.3,-3.8 -8.3,-8.4l0,-6c0,-4.6 3.7,-8.3 8.3,-8.3l62.7,0c4.6,0 8.3,3.7 8.3,8.3l0,6c0.1,4.6 -3.7,8.4 -8.3,8.4z\" class=\"st0\"/>\n  <text id=\"svg_2\" font-size=\"11.2px\" font-family=\"'PingFangSC-Regular-GBpc-EUC-H'\" fill=\"#FFFFFF\" class=\"st1 st2 st3\" transform=\"matrix(1 0 0 1 6.3409 18.0599)\">重新载入图片</text>\n </g>\n</svg>";
        clearBtn.style.display = "none";
        statusDiv.style.display = "none";
        let firstEl = imagesContainer.firstElementChild;
        while (firstEl.id != "AI4Paper-DIV-loadImage") {
          firstEl.remove();
          firstEl = imagesContainer.firstElementChild;
        }
      }
      function fn8() {
        const searchIcon = "chrome://zotero/skin/toolbar-advanced-search.png";
        progressWin.changeHeadline("正在逐页载入图片...", searchIcon);
        const searchIconHiDPI = "chrome://zotero/skin/toolbar-advanced-search" + (Zotero.hiDPI ? '@2x' : '') + ".png";
        progressWin.progress = new progressWin.ItemProgress(searchIconHiDPI, "正在逐页载入图片...");
      }
      function fn9(loaded, total) {
        let percent = Math.round(loaded / total * 0x64);
        progressWin.progress.setProgress(percent);
        progressWin.progress.setText("当前进度： " + loaded + " of " + total);
        progressWin.show();
      }
      function fn10(totalPages, totalImages) {
        const tickIcon = "chrome://zotero/skin/tick.png";
        progressWin = new Zotero.ProgressWindow({
          'closeOnClick': true
        });
        progressWin.changeHeadline('✅\x20完成全部页面的图片载入');
        progressWin.progress = new progressWin.ItemProgress(tickIcon);
        progressWin.progress.setProgress(0x64);
        progressWin.progress.setText("已载入全部【" + totalPages + "】页中的【" + totalImages + '】张图片！');
        progressWin.show();
        progressWin.startCloseTimer(0x1770);
      }
    } else !Zotero.Prefs.get("ai4paper.enableReaderViewButtonViewImages") && iframeWin.document.querySelector("#AI4Paper-viewButton-viewImages") && (iframeWin.document.querySelector('#AI4Paper-viewButton-viewImages').remove(), iframeWin.document.querySelectorAll('#AI4Paper-viewButton-imagesView').forEach(el => el.remove()));
  },
});
