function init() {
  Zotero.AI4Paper.update_svg_icons(document);
  Zotero.AI4Paper.updateHTMLTextAreaBorder4ZoteroScheme(window);
  Zotero.AI4Paper.gptReaderSidePane_setStickyScroll(document, true);
  injectRenderingFunc();
  Zotero.AI4Paper.gptReaderSidePane_injectStyle(window);
  Zotero.AI4Paper.updateSlogan4ChatUI(window);
  Zotero.AI4Paper.updateChatUI4HighlightStyle(window);
  document.body.style.margin = 0x0;
  document.body.style.padding = 0x0;
  Zotero.AI4Paper.setOptions4marked();
  document.getElementById("message-input").value = '';
  Zotero.AI4Paper.updateChatGPTReaderSidePane();
  setUIHeight();
  addRightClickEvent_messageInput();
  setContextMenu();
}
function setUIHeight() {
  const var1 = document.getElementById('message-input'),
    var2 = document.getElementById('chat-container');
  let var3 = window.screen.height;
  if (!Zotero.Prefs.get("ai4paper.gptEnableCustomChatModeGPTUIHeight")) {
    let _0x1cb755, _0x5a7959;
    parseInt(var3) <= 0x3e8 ? (_0x1cb755 = var3 * 0.185, _0x5a7959 = var3 * 0.446, var1.style.height = _0x1cb755 + 'px', var2.style.height = _0x5a7959 + 'px', Zotero.Prefs.set("ai4paper.gptCustomChatModePromptAreaHeight", _0x1cb755.toFixed(0x2)), Zotero.Prefs.set("ai4paper.gptCustomChatModeResponseAreaHeight", _0x5a7959.toFixed(0x2))) : (_0x1cb755 = var3 * 0.173, _0x5a7959 = var3 * 0.555, var1.style.height = _0x1cb755 + 'px', var2.style.height = _0x5a7959 + 'px', Zotero.Prefs.set("ai4paper.gptCustomChatModePromptAreaHeight", _0x1cb755.toFixed(0x2)), Zotero.Prefs.set('ai4paper.gptCustomChatModeResponseAreaHeight', _0x5a7959.toFixed(0x2)));
    Zotero.AI4Paper.gptReaderSidePane_setUIHeight(_0x1cb755, _0x5a7959);
  } else {
    var1.style.height = Zotero.Prefs.get("ai4paper.gptCustomChatModePromptAreaHeight") + 'px';
    var2.style.height = Zotero.Prefs.get("ai4paper.gptCustomChatModeResponseAreaHeight") + 'px';
    Zotero.AI4Paper.gptReaderSidePane_setUIHeight(Zotero.Prefs.get("ai4paper.gptCustomChatModePromptAreaHeight"), Zotero.Prefs.get("ai4paper.gptCustomChatModeResponseAreaHeight"));
  }
}
function addRightClickEvent_messageInput() {
  const var6 = document.getElementById("message-input");
  var6.addEventListener("mousedown", _0x1eeaa5 => {
    if (_0x1eeaa5.altKey) {
      let _0x28bdf5 = Zotero.AI4Paper._calculateTokens(var6.value.trim()).length;
      Services.prompt.alert(window, "✨ tokens 计算", "输入框中文字的 tokens 计算值为：" + _0x28bdf5);
      return;
    }
    _0x1eeaa5.button == 0x2 && Zotero.AI4Paper.gptReaderSidePane_clearPrompt();
  });
}
function setContextMenu() {
  const var8 = document.getElementById("chat-container"),
    var9 = document.getElementById('context-menu');
  var8.addEventListener("click", function (param1) {
    param1.preventDefault();
    var9.style.display = "none";
  });
  var var10 = document.querySelectorAll("#context-menu li");
  for (var var11 = 0x0; var11 < var10.length; var11++) {
    if (var11 === 0x0) var10[var11].addEventListener('click', function () {
      var9.style.display = "none";
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_onClickMenuItemSelectMessage();
    });else {
      if (var11 === 0x1) var10[var11].addEventListener('click', function () {
        var9.style.display = "none";
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_checkAllMessages();
        Zotero.Prefs.set("ai4paper.gptUnderSelectionMessage", true);
      });else {
        if (var11 === 0x2) {
          var10[var11].addEventListener("click", function () {
            var9.style.display = "none";
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_showMessageCheckbox();
          });
        } else {
          if (var11 === 0x3) var10[var11].addEventListener("click", function () {
            var9.style.display = "none";
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_setMessageAsTranslationSourceText(Zotero.AI4Paper._contextmenuEvent_messageEl);
          });else {
            if (var11 === 0x4) var10[var11].addEventListener("click", function () {
              var9.style.display = "none";
              Zotero.AI4Paper.gptReaderSidePane_ChatMode_copySelectedMessages();
            });else {
              if (var11 === 0x5) var10[var11].addEventListener("click", function () {
                var9.style.display = "none";
                Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyAssistantMessages();
              });else {
                if (var11 === 0x6) var10[var11].addEventListener("click", function () {
                  var9.style.display = "none";
                  Zotero.AI4Paper.gptReaderSidePane_ChatMode_go2MessageTop(Zotero.AI4Paper._contextmenuEvent_messageEl);
                });else {
                  if (var11 === 0x7) var10[var11].addEventListener("click", function () {
                    var9.style.display = "none";
                    Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItem(Zotero.AI4Paper._contextmenuEvent_messageEl, false);
                  });else {
                    if (var11 === 0x8) var10[var11].addEventListener("click", function () {
                      var9.style.display = "none";
                      Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItem(Zotero.AI4Paper._contextmenuEvent_messageEl, true);
                    });else {
                      if (var11 === 0x9) var10[var11].addEventListener('click', function () {
                        var9.style.display = 'none';
                        Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessageSourceText(Zotero.AI4Paper._contextmenuEvent_messageEl);
                      });else {
                        if (var11 === 0xa) {
                          var10[var11].addEventListener("click", function () {
                            var9.style.display = 'none';
                            Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessage(Zotero.AI4Paper._contextmenuEvent_messageEl);
                          });
                        } else {
                          if (var11 === 0xb) var10[var11].addEventListener('click', function () {
                            var9.style.display = "none";
                            Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyFileName(Zotero.AI4Paper._contextmenuEvent_messageEl);
                          });else {
                            if (var11 === 0xc) var10[var11].addEventListener("click", function () {
                              var9.style.display = "none";
                              Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyFileFullText(Zotero.AI4Paper._contextmenuEvent_messageEl);
                            });else {
                              if (var11 === 0xd) var10[var11].addEventListener("click", function () {
                                var9.style.display = "none";
                                Zotero.AI4Paper.gptReaderSidePane_ChatMode_openFileInZotero(Zotero.AI4Paper._contextmenuEvent_messageEl);
                              });else var11 === 0xe && var10[var11].addEventListener('click', function () {
                                var9.style.display = "none";
                                Zotero.AI4Paper.gptReaderSidePane_ChatMode_showFile(Zotero.AI4Paper._contextmenuEvent_messageEl);
                              });
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
function pushText() {
  Zotero.Prefs.set("ai4paper.chatgptprompt", document.getElementById("message-input").value);
}
function messageInput_checkKeyEnter(param2) {
  if (!param2.shiftKey && !param2.ctrlKey && !param2.altKey && !param2.metaKey && param2.keyCode === 0xd) {
    param2.returnValue = false;
    param2.preventDefault && param2.preventDefault();
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_send();
  } else !param2.shiftKey && !param2.ctrlKey && param2.altKey && !param2.metaKey && param2.keyCode === 0xd && (param2.returnValue = false, param2.preventDefault && param2.preventDefault(), metaso());
}
function metaso() {
  let var12 = document.getElementById("message-input").value.trim();
  if (!var12) return;
  Zotero.AI4Paper.meataso_WebSearch(var12);
}
function paperAI(param3) {
  if (param3.shiftKey) {
    Zotero.AI4Paper._notClearChatOnPaperAI = true;
    Zotero.AI4Paper.paperAI(false);
  } else {
    if (param3.button === 0x0) Zotero.AI4Paper.paperAI(false);else param3.button === 0x2 && Zotero.AI4Paper.paperAI(true);
  }
}
function autoResize() {
  const var13 = document.getElementById('message-input');
  var13.style.height = "auto";
  var13.style.height = var13.scrollHeight > 0x12c ? 0x258 : "200px";
}
function injectRenderingFunc() {
  try {
    !Zotero.AI4Paper.renderMarkdownLaTeX && (Zotero.AI4Paper.renderMarkdownLaTeX = function (param4) {
      try {
        const var14 = markdownit({
          'html': true,
          'highlight': function (param5, param6) {
            if (param6 && hljs.getLanguage(param6)) try {
              return "<pre class=\"hljs\"><code>" + hljs.highlight(param5, {
                'language': param6,
                'ignoreIllegals': true
              }).value + '</code></pre>';
            } catch (_0x590d27) {}
            return "<pre class=\"hljs\"><code>" + var14.utils.escapeHtml(param5) + '</code></pre>';
          }
        }).use(texmath, {
          'engine': katex,
          'delimiters': ["dollars", 'brackets', 'doxygen', "gitlab", "julia", "kramdown", 'beg_end'],
          'katexOptions': {
            'macros': {
              '\x5cRR': '\x5cmathbb{R}'
            }
          }
        });
        return var14.render(param4);
      } catch (_0xf071f8) {
        return param4;
      }
    });
    !Zotero.AI4Paper.renderMarkdown && (Zotero.AI4Paper.renderMarkdown = function (param7) {
      try {
        const var15 = markdownit({
          'html': true,
          'highlight': function (param8, param9) {
            if (param9 && hljs.getLanguage(param9)) {
              try {
                return "<pre class=\"hljs\"><code>" + hljs.highlight(param8, {
                  'language': param9,
                  'ignoreIllegals': true
                }).value + "</code></pre>";
              } catch (_0x1a7e3e) {}
            }
            return "<pre class=\"hljs\"><code>" + var15.utils.escapeHtml(param8) + '</code></pre>';
          }
        });
        return var15.render(param7);
      } catch (_0x58f4ba) {
        return param7;
      }
    });
    if (!Zotero.AI4Paper.highlightAll) {
      Zotero.AI4Paper.highlightAll = function () {
        hljs.highlightAll();
      };
    }
  } catch (_0x23ad72) {
    Zotero.debug(_0x23ad72);
  }
}
function updateButtonBgColor(param10) {
  let var16 = Zotero.getMainWindow()?.["matchMedia"]('(prefers-color-scheme:\x20dark)')["matches"],
    var17 = !var16 ? '#f0f0f0' : "#545454";
  param10.style.backgroundColor = var17;
}
function onClickPaperAIBatchBtn(param11) {
  if (param11.shiftKey) {
    Zotero.AI4Paper.openDialogByType("batchAIInterpretSettings");
    return;
  }
  Zotero.AI4Paper.openDialogByType("batchAIInterpret", true);
}
async function onClickChatHistoryBtn(param12) {
  if (param12.shiftKey) {
    let var18 = Zotero.AI4Paper.getCurrentReader();
    if (var18) {
      let _0x25ac8 = var18._item.key,
        _0x3b9820 = await hasTargetChatHistory(_0x25ac8);
      if (!_0x3b9820) {
        Zotero.AI4Paper.showProgressWindow(0xbb8, '❌\x20未找到目标对话【Zotero\x20One】', "未在电脑本地找到当前附件的【文献解读】对话历史。👉 请确认设置过 AI 对话历史本地存储文件夹。");
        return;
      }
      let _0x114bb9 = await selectTargetItem(_0x25ac8);
      if (!_0x114bb9) {
        Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 未找到目标对话【AI4paper】", "未在【AI 对话历史】窗口找到当前附件的【文献解读】对话历史。👉 请确认设置过 AI 对话历史本地存储文件夹。");
      }
    }
    return;
  }
  Zotero.AI4Paper.openDialogByType("chatHistory", true);
}
async function hasTargetChatHistory(param13) {
  let var22 = Zotero.Prefs.get("ai4paper.gptChatHistoryLocalPath"),
    var23 = await Zotero.AI4Paper.readChatHistoryFromLocal(var22);
  for (let var24 of var23) {
    try {
      let var25 = JSON.parse(var24.content),
        var26 = var25.find(_0x5384ae => _0x5384ae.fileID === param13);
      if (var26) {
        return true;
      }
    } catch (_0x414807) {
      Zotero.debug(_0x414807);
    }
  }
  return false;
}
async function selectTargetItem(param14) {
  let var27 = Zotero.AI4Paper.openDialogByType("chatHistory", true);
  if (!var27) return;
  await new Promise(_0x38a1d6 => {
    if (var27.document.readyState === "complete") {
      _0x38a1d6();
    } else var27.addEventListener("load", _0x38a1d6, {
      'once': true
    });
  });
  await Zotero.Promise.delay(0x64);
  let var28 = var27.document;
  var27._notSelectFirst = true;
  await var28.querySelector(".svg-container-chatHistory").click();
  await Zotero.Promise.delay(0x64);
  var27._notSelectFirst = false;
  let var29 = var28.querySelectorAll('.message-list-item');
  var29 = Array.from(var29).filter(_0x257c66 => _0x257c66.getAttribute("data-fileID") === param14);
  if (var29.length) return var29[0x0].click(), var29[0x0].scrollIntoView({
    'behavior': 'smooth',
    'block': "center"
  }), var29[0x0];
  return false;
}