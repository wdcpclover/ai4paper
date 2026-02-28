// AI4Paper Reader Module - Reader/PDF-reader infrastructure: pane collapsing,
// reader cleanup, side pane creation, navigation, translate side pane UI,
// reader buttons, button state toggles, iframe/background events
Object.assign(Zotero.AI4Paper, {
  'collapseLeftSidePane': function () {
    let var389 = Zotero_Tabs._selectedID,
      var390 = Zotero.Reader.getByTabID(var389);
    var390 ? Zotero.AI4Paper.collapseReaderSideBar() : Zotero.AI4Paper.collapseCollectionPane_byShortCuts();
  },
  'collapseRightSidePane': function () {
    let var391 = Zotero_Tabs._selectedID,
      var392 = Zotero.Reader.getByTabID(var391);
    if (var392) {
      Zotero.AI4Paper.collapseReaderContextPane();
    } else Zotero.AI4Paper.collapseItemPane_byShortCuts();
  },
  'collapseReaderSideBar': function () {
    let var393 = Zotero_Tabs._selectedID,
      var394 = Zotero.Reader.getByTabID(var393);
    if (!var394) return;
    let var395 = var394._iframeWindow,
      var396 = var395.document.querySelector(".toolbar-button.sidebar-toggle");
    var396 && var396.click();
  },
  'collapseReaderContextPane': function () {
    let var397 = Zotero_Tabs._selectedID,
      var398 = Zotero.Reader.getByTabID(var397);
    if (!var398) return;
    let var399 = var398._iframeWindow,
      var400;
    Zotero.AI4Paper.isZoteroVersion(0x7) ? var400 = var399.document.querySelector('.toolbar-button.context-pane-toggle') : var400 = window.document.querySelector('[data-l10n-id=\x22toggle-context-pane\x22]');
    var400 && var400.click();
  },
  'unregisterReaderButtons': function () {
    let var460 = Zotero.getMainWindow().Zotero_Tabs._tabs;
    for (let var461 of var460) {
      if (var461.id != 'zotero-pane') {
        let _0x23d382 = var461.id,
          _0xaedd99 = Zotero.Reader.getByTabID(_0x23d382);
        if (!_0xaedd99) {
          continue;
        }
        const _0x2d7448 = _0xaedd99._iframeWindow.document;
        _0x2d7448.querySelectorAll(".AI4Paper-Reader-Buttons").forEach(_0x32a581 => _0x32a581.remove());
        _0x2d7448.querySelectorAll(".divider-before-toolbarButton").forEach(_0x1dee07 => _0x1dee07.remove());
        _0x2d7448.querySelectorAll('#AI4Paper-viewButton-imagesView').forEach(_0x2ee24f => _0x2ee24f.remove());
        Zotero.AI4Paper.removeReaderBackgroundColor(_0xaedd99._iframeWindow);
      }
    }
  },
  'removeReaderPopupElements': function (param20) {
    param20.document.querySelectorAll(".ai4paper-popup-element").forEach(_0x19a04b => _0x19a04b.remove());
  },
  'removeReaderBackgroundColor': function (param21) {
    param21.document.querySelectorAll("iframe")[0x0]?.["contentWindow"]["document"]['head']["querySelectorAll"]("#eyes-protection-color")["forEach"](_0x184b2d => _0x184b2d.remove());
    param21.document.querySelectorAll("iframe")[0x1]?.["contentWindow"]["document"]['head']["querySelectorAll"]("#eyes-protection-color")["forEach"](_0x1fa1b6 => _0x1fa1b6.remove());
  },
  'unregisterReaderSidePanes': function (param22) {
    for (let var465 of param22) {
      window.document.querySelector('.AI4Paper-' + var465 + "SidePane-vbox")?.["remove"]();
      window.document.querySelector("#ai4paper-window-" + var465 + "SidePane-button")?.["remove"]();
      window.document.querySelector("#ai4paper-notesSection-" + var465 + "SidePane-button")?.["remove"]();
    }
    param22.length && (Zotero.AI4Paper.showZoteroNotesSection(), window.document.querySelectorAll(".AI4Paper-SidePane-vbox").forEach(_0x517616 => _0x517616.hidden = true));
    if (!window.document.querySelector('.AI4Paper-SidePane-vbox')) {
      let var466 = window.document.querySelector(".AI4Paper-Nav-Buttons-DIV"),
        var467 = window.document.querySelector("[data-l10n-id=\"context-notes-search\"]");
      var466?.["after"](var467);
      var466?.['remove']();
    }
  },
  'addReaderElementsOnStartup': async function () {
    if (Zotero_Tabs._selectedID == "zotero-pane") return;
    let var500 = 0x0;
    while (!Zotero.Reader.getByTabID(Zotero_Tabs._selectedID)) {
      if (var500 >= 0x5dc) {
        Zotero.debug('ZoteroOne:\x20Waiting\x20for\x20reader\x20failed');
        return;
      }
      await Zotero.Promise.delay(0x5);
      var500++;
    }
    let var501 = Zotero_Tabs._selectedID,
      var502 = Zotero.Reader.getByTabID(var501);
    (Zotero.Prefs.get("ai4paper.translationreadersidepane") || Zotero.Prefs.get('ai4paper.gptviewReaderSidepane')) && Zotero.AI4Paper.addReaderSidePane(var501);
    Zotero.AI4Paper.addReaderButtonInit(var502);
    Zotero.AI4Paper.addAnnotationButtonInit();
  },
  'addReaderSidePane': async function (param37) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'))) return -0x1;
    const var503 = Zotero.Reader.getByTabID(param37);
    let var504 = Zotero.AI4Paper.betterURL();
    if (!var503 || !var504) {
      return;
    }
    await Zotero.uiReadyPromise;
    await var503._initPromise;
    await var503._waitForReader();
    let var505 = 0x0;
    while (!window.document.querySelector("context-notes-list")) {
      if (var505 >= 0x1f4) {
        Zotero.debug("AI4Paper: Waiting for reader failed");
        return;
      }
      await Zotero.Promise.delay(0xa);
      var505++;
    }
    let var506 = window.document.querySelector("context-notes-list");
    if (Zotero.Prefs.get("ai4paper.translationreadersidepane") && var506 && !window.document.querySelector("#ai4paper-translate-readersidepane")) {
      let _0x4c5241 = window.document.createXULElement('iframe');
      _0x4c5241.id = 'ai4paper-translate-readersidepane';
      _0x4c5241.setAttribute("flex", '1');
      let _0x1fd95a = window.screen.height >= 0x3e8 ? 0xa4 : 0xa0;
      _0x4c5241.style.minHeight = window.screen.height - _0x1fd95a + 'px';
      _0x4c5241.src = "chrome://ai4paper/content/selectionDialog/translateSidePane.html";
      let _0x128266 = window.document.createXULElement("menupopup");
      for (let var510 of Object.keys(Zotero.AI4Paper.translationServiceList())) {
        let _0x437bfc = window.document.createXULElement('menuitem');
        _0x437bfc.label = var510;
        _0x128266.appendChild(_0x437bfc);
      }
      let _0x1eaed2 = window.document.createXULElement("checkbox");
      _0x1eaed2.id = 'ai4paper-button-enable-auto-translate';
      _0x1eaed2.setAttribute('label', "划词翻译");
      _0x1eaed2.setAttribute("native", true);
      _0x1eaed2.style.fontSize = "13px";
      _0x1eaed2.addEventListener("command", _0x4c0c2b => {
        Zotero.Prefs.set("ai4paper.selectedtexttransenable", _0x4c0c2b.target.checked);
        Zotero.AI4Paper.updateReaderButtonStateInit();
        return;
      });
      let _0xf62d89 = window.document.createXULElement("checkbox");
      _0xf62d89.id = "ai4paper-button-enable-words-first";
      _0xf62d89.setAttribute("label", '查词');
      _0xf62d89.setAttribute("native", true);
      _0xf62d89.style.fontSize = "13px";
      _0xf62d89.addEventListener("command", _0x26e912 => {
        Zotero.Prefs.set("ai4paper.translationvocabularyfirst", _0x26e912.target.checked);
        return;
      });
      let _0x32d924 = window.document.createXULElement("checkbox");
      _0x32d924.id = "ai4paper-button-enable-concat";
      _0x32d924.setAttribute('label', '拼接');
      _0x32d924.setAttribute("native", true);
      _0x32d924.style.fontSize = "13px";
      _0x32d924.addEventListener('command', _0x24d8e0 => {
        Zotero.Prefs.set("ai4paper.translationcrossparagraphs", _0x24d8e0.target.checked);
        return;
      });
      let _0x23d266 = window.document.createXULElement("menulist");
      _0x23d266.id = "ai4paper-translate-engine-list";
      Zotero.AI4Paper.isZoteroVersion() ? (_0x23d266.setAttribute("native", true), _0x23d266.setAttribute('style', 'font-size:\x2013px;padding:\x203px;margin-right:\x2010px')) : _0x23d266.setAttribute('style', "font-size: 13px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);border-radius: 5px;padding: 3px;margin-right: 10px");
      _0x23d266.addEventListener("command", _0x3c2fdb => {
        let var516 = _0x3c2fdb.target.label;
        Zotero.Prefs.set('ai4paper.selectedtexttransengine', var516);
        return;
      });
      _0x23d266.appendChild(_0x128266);
      let _0x26f050 = window.document.createXULElement("hbox");
      _0x26f050.setAttribute("align", "center");
      _0x26f050.setAttribute("flex", '1');
      _0x26f050.style.overflowX = "hidden";
      _0x26f050.appendChild(_0x23d266);
      _0x26f050.appendChild(_0x1eaed2);
      _0x26f050.appendChild(_0xf62d89);
      _0x26f050.appendChild(_0x32d924);
      let _0x2cdbd8 = window.document.createXULElement("div");
      _0x2cdbd8.setAttribute('style', "display: block;height: 5px;");
      _0x2cdbd8.style.overflowY = "hidden";
      let _0x4fb5a7 = window.document.createElement("input");
      _0x4fb5a7.setAttribute('type', "text");
      _0x4fb5a7.id = "navigator-translateSidePane";
      _0x4fb5a7.style.opacity = 0x0;
      _0x2cdbd8.appendChild(_0x4fb5a7);
      let _0x24387c = window.document.createXULElement("vbox");
      _0x24387c.setAttribute('class', 'zotero-box\x20AI4Paper-translateSidePane-vbox\x20AI4Paper-SidePane-vbox');
      _0x24387c.appendChild(_0x2cdbd8);
      _0x24387c.appendChild(_0x26f050);
      _0x24387c.appendChild(_0x4c5241);
      var506.prepend(_0x24387c);
      Zotero.AI4Paper.addSidePaneNavButtons_Window("translate");
    }
    if (Zotero.Prefs.get("ai4paper.gptviewReaderSidepane") && var506 && !window.document.querySelector('#ai4paper-chatgpt-readersidepane')) {
      let var521 = window.document.createXULElement("iframe");
      var521.id = "ai4paper-chatgpt-readersidepane";
      var521.setAttribute("flex", '1');
      var521.style.minHeight = Zotero.AI4Paper.calculate_iframeHeight() + 'px';
      Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? var521.src = 'chrome://ai4paper/content/selectionDialog/gptChatUI.html' : var521.src = "chrome://ai4paper/content/selectionDialog/gptReaderSidePane.html";
      let var522 = window.document.createXULElement('div');
      var522.classList.add("container-section");
      var522.setAttribute("style", 'display:\x20block;height:\x205px;');
      var522.style.overflowY = "hidden";
      let var523 = window.document.createElement('input');
      var523.setAttribute("type", "text");
      var523.id = 'navigator-gptSidePane';
      var523.style.opacity = 0x0;
      var522.appendChild(var523);
      let var524 = window.document.createXULElement("vbox");
      var524.setAttribute("class", "zotero-box AI4Paper-gptSidePane-vbox AI4Paper-SidePane-vbox");
      var524.appendChild(var522);
      let var525 = window.document.createElement("div");
      var525.classList.add('container-section');
      var525.style.display = "flex";
      var525.style.justifyContent = "space-between";
      var525.style.alignItems = "center";
      var525.style.marginTop = '5px';
      var525.style.marginBottom = '5px';
      var525.style.marginRight = '5px';
      var525.style.marginLeft = "5px";
      let var526 = window.document.createXULElement('hbox');
      var526.setAttribute("align", "center");
      var526.style.overflowX = "hidden";
      function fn1(param38) {
        param38.style.marginRight = "6px";
        param38.style.width = "16px";
        param38.style.height = "16px";
        param38.style.padding = "4px 4px";
        param38.style.borderRadius = '6px';
        param38.onmouseover = function () {
          let _0x22974d = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")["matches"],
            _0x36109a = !_0x22974d ? "#e6e6e6" : "#474747";
          this.style.backgroundColor = _0x36109a;
        };
        param38.onmouseout = function () {
          this.style.backgroundColor = '';
        };
      }
      let var529 = window.document.createElement("div");
      var529.id = "chatgpt-readerSidePane-clear-icon";
      var529.innerHTML = Zotero.AI4Paper.svg_icon_16px.addNewChat;
      var529.title = "创建新对话";
      fn1(var529);
      var529.addEventListener('click', _0x3ae665 => {
        Zotero.AI4Paper.gptReaderSidePane_clearChat();
      });
      var526.appendChild(var529);
      let var530 = window.document.createElement("div");
      var530.id = "chatgpt-readerSidePane-aiAnalysis-icon";
      var530.innerHTML = Zotero.AI4Paper.svg_icon_16px.ai_16px;
      var530.title = "AI 分析";
      fn1(var530);
      var530.onclick = _0x4d1199 => {
        Zotero.AI4Paper.createPopup_chatBtn_aiAnalysis(var530);
      };
      var526.appendChild(var530);
      let var531 = window.document.createElement("div");
      var531.id = "chatgpt-readerSidePane-fulltext-icon";
      var531.innerHTML = Zotero.AI4Paper.svg_icon_16px.fulltext;
      var531.title = "导入 PDF 全文";
      fn1(var531);
      var531.addEventListener('click', _0x246c25 => {
        Zotero.AI4Paper.gptReaderSidePane_getFullText();
      });
      var531.addEventListener("pointerdown", _0x39bd63 => {
        _0x39bd63.button == 0x2 && Zotero.AI4Paper.aiAnalysis_PDFsFromSelection();
      }, false);
      var526.appendChild(var531);
      let var532 = window.document.createElement("div");
      var532.id = 'chatgpt-readerSidePane-abstract-icon';
      var532.innerHTML = Zotero.AI4Paper.svg_icon_16px.abstract;
      var532.title = "导入摘要";
      fn1(var532);
      var532.addEventListener("click", _0x3fe780 => {
        Zotero.AI4Paper.gptReaderSidePane_getAbstract();
      });
      var526.appendChild(var532);
      let var533 = window.document.createElement("div");
      var533.id = 'chatgpt-readerSidePane-addtonote-icon';
      var533.innerHTML = Zotero.AI4Paper.svg_icon_16px.addGPTNote;
      var533.title = "添加到笔记";
      fn1(var533);
      var533.addEventListener('click', _0x5a07e3 => {
        !Zotero.Prefs.get('ai4paper.gptContinuesChatMode') && Zotero.AI4Paper.gptReaderSidePane_addChatGPTNoteInit();
      });
      var526.appendChild(var533);
      let var534 = window.document.createElement("div");
      var534.id = "chatgpt-readerSidePane-importAIReading-icon";
      var534.innerHTML = Zotero.AI4Paper.svg_icon_16px.importAIReading;
      var534.title = "导入外部【AI 文献解读】笔记";
      fn1(var534);
      var534.addEventListener("click", _0x2a1a91 => {
        Zotero.AI4Paper.openDialogByType_modal("importAIReading");
      });
      var534.addEventListener("pointerdown", _0x126eae => {
        _0x126eae.button == 0x2 && Zotero.AI4Paper.importChat(true);
      }, false);
      var526.appendChild(var534);
      let var535 = window.document.createElement("div");
      var535.id = "chatgpt-readerSidePane-locateAIReadingNotes-icon";
      var535.innerHTML = Zotero.AI4Paper.svg_icon_16px.locateAIReadingNotes;
      var535.title = "定位 Obsidian【AI 文献解读】笔记";
      fn1(var535);
      var535.addEventListener("mousedown", _0x405767 => {
        if (_0x405767.button === 0x0) Zotero.AI4Paper.createPopup_chatBtn_locateAIReadingNotes(var535);else _0x405767.button === 0x2 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_locateAIReadingNotes();
      });
      var526.appendChild(var535);
      let var536 = window.document.createElement("div");
      var536.id = "chatgpt-readerSidePane-prefs-icon";
      var536.innerHTML = Zotero.AI4Paper.svg_icon_16px.prefs_16px;
      var536.title = "GPT 侧边栏设置";
      fn1(var536);
      var536.addEventListener("click", _0x24de34 => {
        Zotero.AI4Paper.openDialogByType("gptReaderSidePanePrefs");
      });
      var526.appendChild(var536);
      let var537 = window.document.createElement("div");
      var537.id = 'chatgpt-readerSidePane-send-icon';
      var537.innerHTML = Zotero.AI4Paper.svg_icon_20px.send;
      var537.title = '发送';
      var537.hidden = Zotero.Prefs.get("ai4paper.gptContinuesChatMode");
      var537.style.marginRight = '13px';
      var537.style.width = "20px";
      var537.style.height = '20px';
      var537.style.padding = "4px 4px";
      var537.style.borderRadius = "6px";
      var537.onmouseover = function () {
        let var538 = Zotero.getMainWindow()?.['matchMedia']('(prefers-color-scheme:\x20dark)')["matches"],
          var539 = !var538 ? '#e6e6e6' : "#545454";
        this.style.backgroundColor = var539;
      };
      var537.onmouseout = function () {
        this.style.backgroundColor = '';
      };
      var537.onclick = () => Zotero.AI4Paper.gptReaderSidePane_send();
      var525.appendChild(var526);
      var525.appendChild(var537);
      var524.appendChild(var525);
      let var540 = window.document.createXULElement("div");
      var540.id = "chatgpt-readerSidePane-user-icon";
      var540.innerHTML = Zotero.AI4Paper.svg_icon_20px.user;
      var540.style.transform = "scale(1.2)";
      var540.setAttribute("tooltiptext", Zotero.Prefs.get('ai4paper.gptContinuesChatMode') ? "复位提问模板" : "清空问答区");
      var540.style.display = 'flex';
      var540.style.marginLeft = "5px";
      var540.style.marginRight = "5px";
      var540.addEventListener("click", _0x20f52b => {
        if (_0x20f52b.shiftKey || _0x20f52b.button === 0x2) {
          Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.getSelectedPromptFromList());
          Zotero.AI4Paper.showProgressWindow(0x7d0, '✅\x20提示词已拷贝【Zotero\x20One】', "成功拷贝选中的提示词。");
          return;
        }
        Zotero.AI4Paper.gptReaderSidePane_clearPrompt();
      });
      let var541 = window.document.createXULElement('menupopup');
      var541.style.width = "30%";
      var541.id = "ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template";
      let var542 = window.document.createXULElement('menuitem');
      var542.label = '无';
      var542.value = '无';
      var542.setAttribute("tooltiptext", '无');
      var541.appendChild(var542);
      let var543 = window.document.createXULElement("menulist");
      var543.id = "ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist";
      if (Zotero.AI4Paper.isZoteroVersion()) {
        var543.setAttribute('native', true);
        var543.setAttribute("style", "width: 85%;font-size: 13px;padding: 3px;margin-right: 10px");
      } else {
        var543.setAttribute("style", "width: 85%;font-size: 13px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);border-radius: 5px;padding: 3px;margin-right: 10px");
      }
      var543.addEventListener("command", _0x2971d6 => {
        Zotero.Prefs.set('ai4paper.chatgptprompttemplate', _0x2971d6.target.label);
        return;
      });
      var543.appendChild(var541);
      var525 = window.document.createElement("div");
      var525.classList.add("container-section");
      var525.style.display = "flex";
      var525.style.alignItems = "center";
      var525.style.marginBottom = "3px";
      var525.appendChild(var540);
      var525.appendChild(var543);
      var524.appendChild(var525);
      var524.appendChild(var521);
      var525 = window.document.createElement("div");
      var525.classList.add("container-section");
      var525.style.display = "flex";
      var525.style.justifyContent = 'space-between';
      var525.style.alignItems = "center";
      var525.style.marginTop = "5px";
      var525.style.marginBottom = '20px';
      var525.style.marginRight = '8px';
      var525.style.marginLeft = "5px";
      var525.style.paddingLeft = '1px';
      var525.style.paddingRight = "0px";
      var525.style.paddingTop = "3px";
      var525.style.paddingBottom = '3px';
      var525.style.borderRadius = '6px';
      var525.style.boxShadow = "0 0 1px #8a8a8a";
      let var544 = window.document.createXULElement("label");
      var544.value = "服务:";
      var525.appendChild(var544);
      var541 = window.document.createXULElement("menupopup");
      var541.id = "ai4paper-chatgpt-readerSidePane-chatgpt-service";
      for (let var545 of Object.keys(Zotero.AI4Paper.gptServiceList())) {
        let var546 = window.document.createXULElement("menuitem");
        var546.label = var545;
        var546.value = var545;
        var546.setAttribute('tooltiptext', var545);
        Zotero.AI4Paper.gptReaderSidePane_setServiceTooltiptext(var546, var545);
        var541.appendChild(var546);
      }
      var543 = window.document.createXULElement("menulist");
      var543.id = "ai4paper-chatgpt-readerSidePane-chatgpt-service-menulist";
      if (Zotero.AI4Paper.isZoteroVersion()) {
        var543.setAttribute("native", true);
        var543.setAttribute("style", "width: 30%;font-size: 11px;padding: 3px;margin-right: 10px");
      } else {
        var543.setAttribute("style", "width: 30%;font-size: 11px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);border-radius: 5px;padding: 3px;margin-right: 10px");
      }
      var543.addEventListener("command", _0x529ca0 => {
        Zotero.Prefs.set("ai4paper.gptservice", _0x529ca0.target.label);
        return;
      });
      var543.appendChild(var541);
      var525.appendChild(var543);
      var544 = window.document.createXULElement("label");
      var544.value = "模型:";
      var525.appendChild(var544);
      var541 = window.document.createXULElement("menupopup");
      var541.id = "ai4paper-chatgpt-readerSidePane-chatgpt-model";
      for (let var547 of Zotero.AI4Paper.gptModelList) {
        let var548 = window.document.createXULElement('menuitem');
        var548.label = var547;
        var548.value = var547;
        var548.setAttribute("tooltiptext", var547);
        var541.appendChild(var548);
      }
      var543 = window.document.createXULElement("menulist");
      var543.id = "ai4paper-chatgpt-readerSidePane-chatgpt-model-menulist";
      Zotero.AI4Paper.isZoteroVersion() ? (var543.setAttribute("native", true), var543.setAttribute("style", "width: 50%;font-size: 11px;padding: 3px;margin-right: 10px")) : var543.setAttribute('style', 'width:\x2050%;font-size:\x2011px;box-shadow:\x200\x200\x201px\x20rgba(0,\x200,\x200,\x200.5);border-radius:\x205px;padding:\x203px;margin-right:\x2010px');
      var543.addEventListener('command', _0x48a093 => {
        Zotero.Prefs.set('ai4paper.gptmodel', _0x48a093.target.label);
        return;
      });
      var543.appendChild(var541);
      var525.appendChild(var543);
      var524.appendChild(var525);
      let var549 = window.document.querySelector(".AI4Paper-translateSidePane-vbox");
      var549 ? var549.after(var524) : var506.prepend(var524);
      Zotero.AI4Paper.addSidePaneNavButtons_Window("gpt");
      if (Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_changeUILayout();
      }
    }
    Zotero.AI4Paper.clickEventListner_SideNavNotes('add');
    let var550 = window.document.querySelectorAll(".AI4Paper-SidePane-vbox");
    var550.length && (Zotero.AI4Paper.addSidePaneNavButtons_NotesSection(var550[var550.length - 0x1]), Zotero.AI4Paper.hiddenZoteroNotesSection());
    Zotero.AI4Paper.autoFocusReaderSidePane();
  },
  'autoFocusReaderSidePane': function () {
    let var597 = Zotero_Tabs._selectedID;
    const var598 = Zotero.Reader.getByTabID(var597);
    if (!var598) return;
    let var599 = window.document.querySelector(".notes-pane-deck"),
      var600 = var599?.["parentNode"];
    if (var599 && var600) {
      let var601 = Zotero.Prefs.get("ai4paper.autofocussidepane");
      if (var601 === '翻译' && window.document.querySelector(".AI4Paper-translateSidePane-vbox")) {
        if (var600.getAttribute("selectedIndex") === 0x1 && var599.selectedPanel.getAttribute("selectedIndex") === 0x0 && !window.document.querySelector(".AI4Paper-translateSidePane-vbox").hidden) {
          return;
        }
        Zotero.AI4Paper.focusReaderSidePane('translate');
      } else {
        if (var601 === "GPT" && window.document.querySelector(".AI4Paper-gptSidePane-vbox")) {
          if (var600.getAttribute("selectedIndex") === 0x1 && var599.selectedPanel.getAttribute("selectedIndex") === 0x0 && !window.document.querySelector(".AI4Paper-gptSidePane-vbox").hidden) return;
          Zotero.AI4Paper.focusReaderSidePane("gpt");
        }
      }
    }
  },
  'addSidePaneNavButtons_NotesSection': function (param60) {
    if (!window.document.querySelector(".AI4Paper-Nav-Buttons-DIV")) {
      let var602 = window.document.querySelector("[data-l10n-id=\"context-notes-search\"]"),
        var603,
        var604 = window.document.createElement("div");
      var604.setAttribute('class', 'AI4Paper-Nav-Buttons-DIV');
      var604.style.display = "flex";
      var604.style.justifyContent = "center";
      var604.style.alignItems = "center";
      var604.style.marginTop = '5px';
      var604.style.marginBottom = "5px";
      var604.style.marginRight = "8px";
      var604.style.marginLeft = "5px";
      var604.style.paddingLeft = "1px";
      var604.style.paddingRight = "0px";
      var604.style.paddingTop = '3px';
      var604.style.paddingBottom = "3px";
      window.document.querySelector(".AI4Paper-translateSidePane-vbox") && !window.document.querySelector("#ai4paper-notesSection-translateSidePane-button") && (var603 = window.document.createElement('button'), var603.id = 'ai4paper-notesSection-translateSidePane-button', var603.setAttribute('class', "AI4Paper-Window-Button"), var603.textContent = '翻译', var603.style.marginLeft = '5px', var603.style.marginRight = "5px", var603.onclick = () => {
        Zotero.AI4Paper.expandReaderContextPane();
        Zotero.AI4Paper.focusReaderSidePane("translate");
      }, var603.addEventListener('contextmenu', () => {
        Zotero.AI4Paper.openDialogByType('translateSidePanePrefs');
      }, false), var604.appendChild(var603));
      window.document.querySelector(".AI4Paper-gptSidePane-vbox") && !window.document.querySelector("#ai4paper-notesSection-gptSidePane-button") && (var603 = window.document.createElement("button"), var603.id = 'ai4paper-notesSection-gptSidePane-button', var603.setAttribute("class", "AI4Paper-Window-Button"), var603.textContent = "GPT", var603.style.marginLeft = "5px", var603.style.marginRight = '5px', var603.onclick = _0x33c86d => {
        _0x33c86d.shiftKey ? Zotero.AI4Paper.gptReaderSidePane_ChatMode_scrollBottom() : (Zotero.AI4Paper.expandReaderContextPane(), Zotero.AI4Paper.focusReaderSidePane("gpt"));
      }, var603.addEventListener('contextmenu', () => {
        Zotero.AI4Paper.openDialogByType("gptReaderSidePanePrefs");
      }, false), var604.appendChild(var603));
      var603 = window.document.createElement("button");
      var603.id = "ai4paper-notesSection-notes-button";
      var603.setAttribute("class", "AI4Paper-Window-Button");
      var603.textContent = '笔记';
      var603.title = '右击已返回上次打开的笔记';
      var603.style.marginLeft = '5px';
      var603.style.marginRight = '5px';
      var603.onclick = () => {
        Zotero.AI4Paper._notesNavButtonClicked = true;
        Zotero.AI4Paper.showZoteroNotesSection();
        window.document.querySelectorAll(".AI4Paper-SidePane-vbox").forEach(_0x5947ea => _0x5947ea.hidden = true);
        let _0x996e67 = window.document.querySelector("[data-pane=\"context-all-notes\"]")?.["querySelector"](".twisty");
        _0x996e67?.["focus"]();
        _0x996e67.scrollIntoView({
          'behavior': "smooth",
          'block': "center"
        });
      };
      var603.addEventListener("contextmenu", () => {
        let var606 = window.document.querySelector("context-notes-list");
        var606 && var606.querySelectorAll("note-row").forEach(_0x3a27ec => {
          if (_0x3a27ec.note && _0x3a27ec.note.id && Zotero.AI4Paper._noteItem_ReturnButtonClick) {
            let _0x4cb476 = Zotero.Items.get(_0x3a27ec.note.id);
            _0x4cb476 && _0x4cb476.key === Zotero.AI4Paper._noteItem_ReturnButtonClick.key && _0x3a27ec.click();
          }
        });
      }, false);
      var604.appendChild(var603);
      var602?.['after'](var604);
      param60?.["parentNode"]["insertBefore"](var602, param60.nextSibling);
    } else {
      let var608 = window.document.querySelector(".AI4Paper-Nav-Buttons-DIV");
      if (window.document.querySelector(".AI4Paper-translateSidePane-vbox") && !window.document.querySelector("#ai4paper-notesSection-translateSidePane-button")) {
        let _0x18b10a = window.document.createElement("button");
        _0x18b10a.id = 'ai4paper-notesSection-translateSidePane-button';
        _0x18b10a.setAttribute('class', "AI4Paper-Window-Button");
        _0x18b10a.textContent = '翻译';
        _0x18b10a.style.marginLeft = "5px";
        _0x18b10a.style.marginRight = '5px';
        _0x18b10a.onclick = () => {
          Zotero.AI4Paper.expandReaderContextPane();
          Zotero.AI4Paper.focusReaderSidePane("translate");
        };
        var608.prepend(_0x18b10a);
      }
      if (window.document.querySelector('.AI4Paper-gptSidePane-vbox') && !window.document.querySelector("#ai4paper-notesSection-gptSidePane-button")) {
        let var610 = window.document.createElement("button");
        var610.id = "ai4paper-notesSection-gptSidePane-button";
        var610.setAttribute("class", 'AI4Paper-Window-Button');
        var610.textContent = "GPT";
        var610.style.marginLeft = "5px";
        var610.style.marginRight = "5px";
        var610.onclick = () => {
          Zotero.AI4Paper.expandReaderContextPane();
          Zotero.AI4Paper.focusReaderSidePane("gpt");
        };
        let var611 = window.document.querySelector("#ai4paper-notesSection-translateSidePane-button");
        var611 ? var611.after(var610) : var608.prepend(var610);
      }
    }
  },
  'addSidePaneNavButtons_Window': function (param61) {
    let var612 = window.document.querySelector('#zotero-tb-tabs-menu');
    if (var612) {
      if (param61 === 'translate' && !window.document.querySelector('#ai4paper-window-translateSidePane-button')) {
        let _0x5d2115 = var612.cloneNode(true);
        _0x5d2115.id = 'ai4paper-window-translateSidePane-button';
        _0x5d2115.setAttribute("command", '');
        _0x5d2115.setAttribute("oncommand", '');
        _0x5d2115.setAttribute("class", 'zotero-tb-button\x20AI4Paper-Window-Button');
        _0x5d2115.setAttribute("tooltiptext", '翻译侧边栏');
        _0x5d2115.setAttribute("data-l10n-id", '');
        _0x5d2115.innerHTML = Zotero.AI4Paper.svg_icon_20px.translationreadersidepane;
        _0x5d2115.onclick = () => {
          Zotero.AI4Paper.expandReaderContextPane();
          Zotero.AI4Paper.focusReaderSidePane("translate");
        };
        let _0x48ad4a = window.document.querySelector('#ai4paper-window-gptSidePane-button');
        if (_0x48ad4a) {
          _0x48ad4a.before(_0x5d2115);
        } else {
          var612.before(_0x5d2115);
        }
      } else {
        if (param61 === 'gpt' && !window.document.querySelector('#ai4paper-window-gptSidePane-button')) {
          let var615 = var612.cloneNode(true);
          var615.id = "ai4paper-window-gptSidePane-button";
          var615.setAttribute("command", '');
          var615.setAttribute("oncommand", '');
          var615.setAttribute("class", "zotero-tb-button AI4Paper-Window-Button");
          var615.setAttribute("tooltiptext", "GPT 侧边栏");
          var615.setAttribute("data-l10n-id", '');
          var615.innerHTML = Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
          var615.onclick = _0x5b5794 => {
            if (_0x5b5794.button == 0x2) {
              Zotero.AI4Paper.openDialogByType("chatHistory", true);
              return;
            }
            if (_0x5b5794.shiftKey) {
              Zotero.AI4Paper.openDialogByType("batchAIInterpret", true);
              return;
            }
            Zotero.AI4Paper.expandReaderContextPane();
            Zotero.AI4Paper.focusReaderSidePane("gpt");
          };
          let var616 = window.document.querySelector('#ai4paper-window-translateSidePane-button');
          var616 ? var616.after(var615) : var612.before(var615);
        }
      }
    }
  },
  'focusReaderSidePane': async function (param62) {
    try {
      if (param62) {
        if (Zotero_Tabs._selectedID === 'zotero-pane') try {
          Zotero.getMainWindow().Zotero_Tabs._tabs.length > 0x1 && (Zotero_Tabs.select(Zotero.getMainWindow().Zotero_Tabs._tabs[0x1].id, true), await Zotero.Promise.delay(0x14));
        } catch (_0x102ec6) {
          Zotero.debug(_0x102ec6);
        }
        let _0x218b78 = window.document.querySelector(".notes-pane-deck"),
          _0x5b3a66 = _0x218b78.parentNode;
        if (_0x218b78 && _0x5b3a66) {
          if (_0x218b78.selectedPanel.selectedIndex != 0x0) {
            _0x5b3a66.selectedIndex = 0x1;
            let var619 = Services.wm.getMostRecentWindow("navigator:browser"),
              var620 = var619.ZoteroContextPane.activeEditor;
            if (var620) {
              Zotero.AI4Paper._noteItem_ReturnButtonClick = var620.item;
            }
          }
        }
        Zotero.AI4Paper.selectNotesListPane();
        let _0x4dd6d0 = window.document.getElementById("navigator-" + param62 + "SidePane");
        if (_0x4dd6d0) {
          window.document.querySelector(".AI4Paper-" + param62 + "SidePane-vbox").hidden = false;
          let var622 = param62 === 'translate' ? "gpt" : "translate",
            var623 = window.document.querySelector(".AI4Paper-" + var622 + "SidePane-vbox");
          var623 && (var623.hidden = true);
          _0x4dd6d0.focus();
          _0x4dd6d0.scrollIntoView({
            'behavior': "smooth",
            'block': "start"
          });
          Zotero.AI4Paper.hiddenZoteroNotesSection();
        }
      }
    } catch (_0x78bc72) {
      window.alert(_0x78bc72);
    }
  },
  'addEventListener_focusZoteroContextAllNotes': async function () {
    let var624 = window.document.querySelectorAll("[data-l10n-id=\"sidenav-notes\"][data-pane=\"context-notes\"][tooltiptext=\"Notes\"]")[0x1];
    var624 && !var624.getAttribute('clickEventListner_added') && (var624.setAttribute("clickEventListner_added", true), var624.addEventListener('mousedown', function (param63) {
      if (param63.button === 0x2) {
        let var625 = Services.wm.getMostRecentWindow("navigator:browser");
        if (var625.ZoteroContextPane.activeEditor) {
          let _0x3aab11 = window.document.querySelector(".zotero-tb-note-return");
          _0x3aab11?.["click"]();
        }
        let var627 = window.document.querySelector('[data-pane=\x22context-all-notes\x22]').querySelector(".twisty");
        var627 && (Zotero.AI4Paper.showZoteroNotesSection(), window.document.querySelectorAll('.AI4Paper-SidePane-vbox').forEach(_0x47e3f5 => _0x47e3f5.hidden = true), var627.focus(), var627.scrollIntoView({
          'behavior': "smooth",
          'block': 'center'
        }));
      }
    }, false));
  },
  'clickEventListner_SideNavNotes': function (param64) {
    if (param64 === "add" && !Zotero.AI4Paper._pointerdownHandler_SideNavNotes) {
      Zotero.AI4Paper._pointerdownHandler_SideNavNotes = function (param65) {
        if (param65.button === 0x0 && param65.target) {
          if (param65.target.getAttribute("data-l10n-id") === 'sidenav-notes' && param65.target.getAttribute("data-pane") === "context-notes") {
            if (param65.target.closest("#zotero-context-pane-sidenav")) {
              Zotero.AI4Paper._notesNavButtonClicked = true;
              Zotero.AI4Paper.showZoteroNotesSection();
              let var628 = ["translate", 'gpt'];
              for (let var629 of var628) {
                let var630 = window.document.querySelector('.AI4Paper-' + var629 + "SidePane-vbox");
                var630 && (var630.hidden = true);
              }
            }
          }
        }
      };
      window.document.addEventListener('pointerdown', Zotero.AI4Paper._pointerdownHandler_SideNavNotes);
    } else param64 === "remove" && window.document.removeEventListener("pointerdown", Zotero.AI4Paper._pointerdownHandler_SideNavNotes);
    if (param64 === "add" && !Zotero.AI4Paper._mousedownHandler_ReturnButton) {
      Zotero.AI4Paper._mousedownHandler_ReturnButton = function (param66) {
        if (param66.button === 0x0 && param66.target) {
          if (param66.target.classList.contains('zotero-tb-note-return')) {
            let var631 = Services.wm.getMostRecentWindow("navigator:browser");
            if (var631?.['ZoteroContextPane']["activeEditor"]) {
              Zotero.AI4Paper._noteItem_ReturnButtonClick = var631.ZoteroContextPane.activeEditor.item;
            }
          }
        }
      };
      window.document.addEventListener("mousedown", Zotero.AI4Paper._mousedownHandler_ReturnButton);
    } else param64 === "remove" && window.document.removeEventListener('mousedown', Zotero.AI4Paper._mousedownHandler_ReturnButton);
  },
  'showZoteroNotesSection': function () {
    let var632 = window.document.querySelector("context-notes-list");
    var632?.["childNodes"]["forEach"](_0x514cfc => {
      !_0x514cfc.classList.contains('AI4Paper-SidePane-vbox') && (_0x514cfc.hidden = false);
    });
    if (var632) {
      var632.parentNode.style.overflowY = "auto";
    }
  },
  'hiddenZoteroNotesSection': async function () {
    let var633 = window.document.querySelector("context-notes-list");
    var633?.["childNodes"]["forEach"](_0x4d7f9d => {
      !_0x4d7f9d.classList.contains("AI4Paper-SidePane-vbox") && (_0x4d7f9d.hidden = true);
    });
    if (var633) {
      var633.parentNode.style.overflowY = "hidden";
    }
    Zotero.AI4Paper._notesNavButtonClicked = false;
    let var634 = 0x0,
      var635 = false;
    while (!var635) {
      if (var634 >= 0x1f4) {
        Zotero.debug("AI4Paper: 非启动时加载笔记列表。");
        return;
      }
      var633 = window.document.querySelector("context-notes-list");
      var633.childNodes.forEach(_0x811207 => {
        if (_0x811207.classList) {
          if (!_0x811207.classList.contains("AI4Paper-SidePane-vbox") && !_0x811207.hidden) {
            !Zotero.AI4Paper._notesNavButtonClicked && (_0x811207.hidden = true, var635 = true);
          }
        }
      });
      await Zotero.Promise.delay(0xa);
      var634++;
    }
  },
  'selectNotesListPane': function () {
    let var636 = window.document.querySelector('.notes-pane-deck'),
      var637 = var636.parentNode;
    var637.selectedIndex = 0x1;
    var636.selectedPanel.selectedIndex = 0x0;
  },
  'expandReaderContextPane': function () {
    let var638 = Zotero_Tabs._selectedID;
    var var639 = Zotero.Reader.getByTabID(var638);
    if (!var639) return;
    let var640 = var639._iframeWindow;
    window.document.getElementById('zotero-context-pane').collapsed && var640.document.querySelector('.context-pane-toggle')?.["click"]();
  },
  'gptReaderSidePane_recordScrollTop': function (param67) {
    try {
      let var641 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
      if (!var641) return false;
      const var642 = var641.document.getElementById("chat-container");
      if (param67 === "zotero-pane") {
        var641._savedContScrollTop = '' + Zotero.AI4Paper._savedContScrollTop;
        var641._marker4ScrollTop = true;
      } else !var641._gptStreamRunning && var641._marker4ScrollTop && (Zotero.AI4Paper.updateChatGPTReaderSidePane(), var642.scrollTop = var641._savedContScrollTop, var641._marker4ScrollTop = false);
    } catch (_0x22646b) {
      Zotero.debug(_0x22646b);
    }
  },
  'updateTranslateReaderSidePane': function () {
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      return false;
    }
    var var643;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) {
      var643 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;
    } else return false;
    if (!var643) {
      return;
    }
    window.document.querySelector("#ai4paper-translate-engine-list").selectedIndex = Object.keys(Zotero.AI4Paper.translationServiceList()).indexOf(Zotero.Prefs.get("ai4paper.selectedtexttransengine"));
    window.document.querySelector("#ai4paper-button-enable-auto-translate").checked = Zotero.Prefs.get("ai4paper.selectedtexttransenable");
    window.document.querySelector("#ai4paper-button-enable-words-first").checked = Zotero.Prefs.get("ai4paper.translationvocabularyfirst");
    window.document.querySelector('#ai4paper-button-enable-concat').checked = Zotero.Prefs.get('ai4paper.translationcrossparagraphs');
    var643.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = Zotero.AI4Paper.translateSourceText;
    var643.document.getElementById("ai4paper-translate-readerSidePane-response").value = Zotero.AI4Paper.translateResponse;
    var643.document.getElementById('ai4paper-translate-readerSidePane-sourcetext').style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    var643.document.getElementById("ai4paper-translate-readerSidePane-response").style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    var643.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.lineHeight = Zotero.Prefs.get('ai4paper.translatesidepanelineheight');
    var643.document.getElementById("ai4paper-translate-readerSidePane-response").style.lineHeight = Zotero.Prefs.get("ai4paper.translatesidepanelineheight");
    if (Zotero.AI4Paper.vocabularyreviewmode === 'true') {
      var643.document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review").checked = true;
      var643.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = "inline";
      var643.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = "inline";
      Zotero.Prefs.get('ai4paper.vocabularyreviewgiveinterpretation') ? var643.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = "none" : var643.document.getElementById('ai4paper-translate-readerSidePane-vocabulary-interpretation').style.display = "inline";
    } else {
      var643.document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review").checked = false;
      var643.document.getElementById('ai4paper-translate-readerSidePane-vocabulary-next').style.display = 'none';
      var643.document.getElementById('ai4paper-translate-readerSidePane-vocabulary-interpretation').style.display = "none";
      var643.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = "none";
    }
    Zotero.AI4Paper.translateReaderSidePane_exchangeSourceResponseArea();
  },
  'initTranslateReaderSidePane': function () {
    let var644 = Zotero_Tabs._selectedID;
    const var645 = Zotero.Reader.getByTabID(var644);
    if (!var645) {
      return;
    }
    if (!Zotero.Prefs.get('ai4paper.translationreadersidepane')) return false;
    var var646;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) var646 = window.document.getElementById('ai4paper-translate-readersidepane').contentWindow;else return false;
    if (!var646) return;
    window.document.querySelector("#ai4paper-translate-engine-list").selectedIndex = Object.keys(Zotero.AI4Paper.translationServiceList()).indexOf(Zotero.Prefs.get('ai4paper.selectedtexttransengine'));
    window.document.querySelector("#ai4paper-button-enable-auto-translate").checked = Zotero.Prefs.get("ai4paper.selectedtexttransenable");
    window.document.querySelector("#ai4paper-button-enable-words-first").checked = Zotero.Prefs.get("ai4paper.translationvocabularyfirst");
    window.document.querySelector("#ai4paper-button-enable-concat").checked = Zotero.Prefs.get("ai4paper.translationcrossparagraphs");
    var646.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = Zotero.AI4Paper.translateSourceText;
    var646.document.getElementById('ai4paper-translate-readerSidePane-response').value = Zotero.AI4Paper.translateResponse;
    var646.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    var646.document.getElementById('ai4paper-translate-readerSidePane-response').style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    Zotero.AI4Paper.vocabularyreviewmode === "true" ? (var646.document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review").checked = true, var646.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = "inline", var646.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = "inline", Zotero.Prefs.get("ai4paper.vocabularyreviewgiveinterpretation") ? var646.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = 'none' : var646.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = "inline") : (var646.document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review").checked = false, var646.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = 'none', var646.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = "none", var646.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = 'none');
  },
  'refreshTranslateReaderSidePane': function () {
    let var647 = Zotero_Tabs._selectedID;
    const var648 = Zotero.Reader.getByTabID(var647);
    if (!var648) return;
    if (!Zotero.Prefs.get('ai4paper.translationreadersidepane')) return false;
    var var649;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) {
      var649 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;
    } else {
      return false;
    }
    if (!var649) return;
    window.document.querySelector('#ai4paper-translate-engine-list').selectedIndex = Object.keys(Zotero.AI4Paper.translationServiceList()).indexOf(Zotero.Prefs.get("ai4paper.selectedtexttransengine"));
    window.document.querySelector("#ai4paper-button-enable-auto-translate").checked = Zotero.Prefs.get('ai4paper.selectedtexttransenable');
    window.document.querySelector("#ai4paper-button-enable-words-first").checked = Zotero.Prefs.get("ai4paper.translationvocabularyfirst");
    window.document.querySelector("#ai4paper-button-enable-concat").checked = Zotero.Prefs.get('ai4paper.translationcrossparagraphs');
    var649.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = Zotero.AI4Paper.translateSourceText;
    var649.document.getElementById("ai4paper-translate-readerSidePane-response").value = Zotero.AI4Paper.translateResponse;
    var649.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    var649.document.getElementById("ai4paper-translate-readerSidePane-response").style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    if (Zotero.AI4Paper.vocabularyreviewmode === "true") {
      var649.document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review").checked = true;
      var649.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = "inline";
      var649.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = "inline";
      if (Zotero.Prefs.get("ai4paper.vocabularyreviewgiveinterpretation")) {
        var649.document.getElementById('ai4paper-translate-readerSidePane-vocabulary-interpretation').style.display = "none";
      } else var649.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = 'inline';
    } else {
      var649.document.getElementById('ai4paper-translate-readerSidePane-vocaulary-review').checked = false;
      var649.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = "none";
      var649.document.getElementById('ai4paper-translate-readerSidePane-vocabulary-interpretation').style.display = "none";
      var649.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = 'none';
    }
  },
  'isReaderSidePaneExist': function (param68, param69) {
    !param69 && (param69 = Zotero_Tabs._selectedID);
    Zotero.AI4Paper.gptReaderSidePane_recordScrollTop(param69);
    const var650 = Zotero.Reader.getByTabID(param69);
    if (!var650) return;
    !window.document.getElementById("ai4paper-" + param68 + "-readersidepane") && Zotero.AI4Paper.addReaderSidePane(param69);
  },
  'translateReaderSidePane_showErrorMessage': function (param70) {
    Zotero.AI4Paper.updateTranslationPopupTextArea(param70);
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      return false;
    }
    Zotero.AI4Paper.focusReaderSidePane("translate");
    var var651;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) var651 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;else return false;
    if (!var651) return;
    var651.document.getElementById("ai4paper-translate-readerSidePane-response").value = param70;
    var651.document.getElementById("ai4paper-translate-readerSidePane-response").placeholder = "这里显示翻译结果";
    var651.document.getElementById("ai4paper-translate-readerSidePane-response").style.boxShadow = '0\x200\x201px\x20rgba(0,\x200,\x200,\x200.5)';
    Zotero.AI4Paper.translateResponse = param70;
  },
  'translateReaderSidePane_setUIHeight': function (param71, param72) {
    if (!Zotero.Prefs.get('ai4paper.translationreadersidepane')) return false;
    var var652;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) var652 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;else return false;
    if (!var652) return;
    Zotero.Prefs.get("ai4paper.translateEnableCustomUIHeight") ? (var652.document.getElementById('ai4paper-translate-readerSidePane-sourcetext').style.height = Zotero.Prefs.get("ai4paper.translateCustomSourceTextAreaHeight") + 'px', var652.document.getElementById('ai4paper-translate-readerSidePane-response').style.height = Zotero.Prefs.get('ai4paper.translateCustomResponseAreaHeight') + 'px') : (var652.document.getElementById('ai4paper-translate-readerSidePane-sourcetext').style.height = param71 + 'px', var652.document.getElementById("ai4paper-translate-readerSidePane-response").style.height = param72 + 'px');
  },
  'translateReaderSidePane_exchangeSourceResponseArea': function () {
    let var653 = Zotero_Tabs._selectedID;
    const var654 = Zotero.Reader.getByTabID(var653);
    if (!var654) return;
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      return false;
    }
    var var655;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) var655 = window.document.getElementById('ai4paper-translate-readersidepane').contentWindow;else {
      return false;
    }
    if (!var655) return;
    let var656 = var655.document.getElementById('ai4paper-translate-readerSidePane-sourcetext'),
      var657 = var655.document.getElementById("ai4paper-translate-readerSidePane-response"),
      var658 = var656.nextElementSibling;
    var658 && (var658.querySelector("#ai4paper-translate-readerSidePane-prefs") ? Zotero.Prefs.get("ai4paper.translatesidepaneExchangeSourceResponseArea") && (var657.after(var656), var657.parentNode.prepend(var657)) : !Zotero.Prefs.get('ai4paper.translatesidepaneExchangeSourceResponseArea') && (var656.after(var657), var656.parentNode.prepend(var656)));
  },
  'addReaderButtonInit': async function (param214) {
    if (!param214 || !Zotero.AI4Paper.betterURL()) return false;
    await param214._initPromise;
    await param214._waitForReader();
    let var1887 = param214._iframeWindow,
      var1888 = 0x0;
    while (!var1887.document.querySelector(".center")) {
      if (var1888 >= 0x1f4) {
        Zotero.debug("AI4Paper: Waiting for reader failed");
        return;
      }
      await Zotero.Promise.delay(0x5);
      var1888++;
    }
    switch (var1887.document.readyState) {
      case "uninitialized":
        {
          setTimeout(() => {
            var1887.document.onreadystatechange = () => Zotero.AI4Paper.addReaderButton(var1887);
            Zotero.AI4Paper.waitForIframeReady(var1887);
            return;
          }, 0x1f4);
          return;
        }
      case "complete":
        {
          Zotero.AI4Paper.addReaderButton(var1887);
          Zotero.AI4Paper.waitForIframeReady(var1887);
        }
    }
  },
  'updateReaderButtonStateInit': async function () {
    let var1889 = Zotero_Tabs._selectedID;
    var var1890 = Zotero.Reader.getByTabID(var1889);
    if (!var1890) return false;
    await Zotero.uiReadyPromise;
    await var1890._waitForReader();
    let var1891 = var1890._iframeWindow;
    Zotero.AI4Paper.updateReaderButtonState(var1891);
  },
  'addReaderButton': function (param215) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) {
      return -0x1;
    }
    const var1892 = param215.document.querySelector(".center");
    let var1893 = param215.document.querySelector(".toolbar-button.find"),
      var1894 = Zotero.AI4Paper.betterURL();
    if (!var1894) {
      return;
    }
    if (Zotero.Prefs.get("ai4paper.enablesvgobsidiannote") && !param215.document.getElementById("AI4Paper: Obsidian Note")) {
      let _0x223b12 = param215.document.createElement("button");
      _0x223b12.setAttribute('id', "AI4Paper: Obsidian Note");
      _0x223b12.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      _0x223b12.setAttribute("title", "Obsidian Note");
      _0x223b12.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobsidiannote;
      _0x223b12.onclick = () => {
        Zotero.AI4Paper.obsidianNote();
      };
      var1892?.["prepend"](_0x223b12);
    } else !Zotero.Prefs.get("ai4paper.enablesvgobsidiannote") && param215.document.getElementById('AI4Paper:\x20Obsidian\x20Note') && param215.document.getElementById('AI4Paper:\x20Obsidian\x20Note').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgopenwith") && !param215.document.getElementById('AI4Paper:\x20Open\x20With')) {
      let _0x57bacb = param215.document.createElement("button");
      _0x57bacb.setAttribute('id', "AI4Paper: Open With");
      _0x57bacb.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      _0x57bacb.setAttribute("title", 'Open\x20With');
      _0x57bacb.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgopenwith;
      _0x57bacb.onclick = _0x52d199 => {
        if (_0x52d199.shiftKey) {
          Zotero.AI4Paper.openwith_buildPopup(_0x57bacb);
        } else {
          Zotero.AI4Paper.openwith(0x1);
        }
      };
      _0x57bacb.addEventListener("pointerdown", _0x5650db => {
        if (_0x5650db.button == 0x2) {
          Zotero.AI4Paper.openwith(0x2);
        }
      }, false);
      var1892?.["prepend"](_0x57bacb);
    } else !Zotero.Prefs.get("ai4paper.enablesvgopenwith") && param215.document.getElementById("AI4Paper: Open With") && param215.document.getElementById("AI4Paper: Open With").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgconnectedpapers") && !param215.document.getElementById("AI4Paper: Connected Papers")) {
      let _0x22daf6 = param215.document.createElement('button');
      _0x22daf6.setAttribute('id', 'AI4Paper:\x20Connected\x20Papers');
      _0x22daf6.setAttribute('class', 'toolbar-button\x20AI4Paper-Reader-Buttons\x20AI4Paper-center-toolbarButton');
      _0x22daf6.setAttribute("title", "Connected Papers");
      _0x22daf6.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgconnectedpapers;
      _0x22daf6.onclick = () => {
        Zotero.AI4Paper.connectedPapers();
      };
      var1892?.["prepend"](_0x22daf6);
    } else !Zotero.Prefs.get("ai4paper.enablesvgconnectedpapers") && param215.document.getElementById('AI4Paper:\x20Connected\x20Papers') && param215.document.getElementById("AI4Paper: Connected Papers").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgscite') && !param215.document.getElementById("AI4Paper: Scite")) {
      let _0x13500d = param215.document.createElement('button');
      _0x13500d.setAttribute('id', "AI4Paper: Scite");
      _0x13500d.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      _0x13500d.setAttribute('title', "Scite");
      _0x13500d.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgscite;
      _0x13500d.onclick = () => {
        Zotero.AI4Paper.scite();
      };
      var1892?.['prepend'](_0x13500d);
    } else {
      if (!Zotero.Prefs.get('ai4paper.enablesvgscite') && param215.document.getElementById("AI4Paper: Scite")) {
        param215.document.getElementById("AI4Paper: Scite").remove();
      }
    }
    if (Zotero.Prefs.get("ai4paper.enablesvgRelatedPapers") && !param215.document.getElementById("AI4Paper: RelatedPapers")) {
      let var1899 = param215.document.createElement("button");
      var1899.setAttribute('id', 'AI4Paper:\x20RelatedPapers');
      var1899.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      var1899.setAttribute("title", "相关文献");
      var1899.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgRelatedPapers;
      var1899.onclick = () => {
        Zotero.AI4Paper.relatedPapers();
      };
      var1892?.["prepend"](var1899);
    } else !Zotero.Prefs.get('ai4paper.enablesvgRelatedPapers') && param215.document.getElementById('AI4Paper:\x20RelatedPapers') && param215.document.getElementById('AI4Paper:\x20RelatedPapers').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgrefs") && !param215.document.getElementById("AI4Paper: Refs")) {
      let _0x3306be = param215.document.createElement("button");
      _0x3306be.setAttribute('id', 'AI4Paper:\x20Refs');
      _0x3306be.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      _0x3306be.setAttribute("title", "抓取参考文献");
      _0x3306be.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgrefs;
      _0x3306be.onclick = () => {
        Zotero.AI4Paper.updateReferences();
      };
      var1892?.["prepend"](_0x3306be);
    } else !Zotero.Prefs.get('ai4paper.enablesvgrefs') && param215.document.getElementById("AI4Paper: Refs") && param215.document.getElementById('AI4Paper:\x20Refs').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgciting") && !param215.document.getElementById("AI4Paper: Citing")) {
      let var1901 = param215.document.createElement("button");
      var1901.setAttribute('id', "AI4Paper: Citing");
      var1901.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      var1901.setAttribute('title', "抓取施引文献");
      var1901.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgciting;
      var1901.onclick = () => {
        Zotero.AI4Paper.updateCitingReferences();
      };
      var1892?.['prepend'](var1901);
    } else {
      if (!Zotero.Prefs.get("ai4paper.enablesvgciting") && param215.document.getElementById("AI4Paper: Citing")) {
        param215.document.getElementById("AI4Paper: Citing").remove();
      }
    }
    if (Zotero.Prefs.get("ai4paper.enablesvghandtool") && !param215.document.getElementById("AI4Paper: HandTool")) {
      let var1902 = param215.document.createElement("button");
      var1902.setAttribute('id', 'AI4Paper:\x20HandTool');
      var1902.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      var1902.setAttribute('title', '手形工具');
      var1902.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvghandtool;
      var1902.onclick = () => {
        const var1903 = Zotero.AI4Paper.getCurrentReader();
        var1903 && var1903.toggleHandTool();
      };
      var1892?.["prepend"](var1902);
    } else {
      if (!Zotero.Prefs.get('ai4paper.enablesvghandtool') && param215.document.getElementById("AI4Paper: HandTool")) {
        param215.document.getElementById("AI4Paper: HandTool").remove();
      }
    }
    if (Zotero.Prefs.get("ai4paper.enablesvgpagerotate2right") && !param215.document.getElementById("AI4Paper: Page Rotate Clockwise")) {
      let _0x42516e = param215.document.createElement('button');
      _0x42516e.setAttribute('id', 'AI4Paper:\x20Page\x20Rotate\x20Clockwise');
      _0x42516e.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      _0x42516e.setAttribute("title", "单页右转");
      _0x42516e.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgpagerotate2right;
      _0x42516e.onclick = () => {
        const var1905 = Zotero.AI4Paper.getCurrentReader();
        var1905 && (var1905.rotatePageRight(), Zotero.AI4Paper.OnRotateMenuItemClick());
      };
      var1892?.["prepend"](_0x42516e);
    } else !Zotero.Prefs.get("ai4paper.enablesvgpagerotate2right") && param215.document.getElementById("AI4Paper: Page Rotate Clockwise") && param215.document.getElementById("AI4Paper: Page Rotate Clockwise").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgpagerotate2left') && !param215.document.getElementById("AI4Paper: Page Rotate Counterclockwise")) {
      let _0x463850 = param215.document.createElement("button");
      _0x463850.setAttribute('id', "AI4Paper: Page Rotate Counterclockwise");
      _0x463850.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      _0x463850.setAttribute("title", "单页左转");
      _0x463850.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgpagerotate2left;
      _0x463850.onclick = () => {
        const var1907 = Zotero.AI4Paper.getCurrentReader();
        var1907 && (var1907.rotatePageLeft(), Zotero.AI4Paper.OnRotateMenuItemClick());
      };
      var1892?.["prepend"](_0x463850);
    } else !Zotero.Prefs.get("ai4paper.enablesvgpagerotate2left") && param215.document.getElementById("AI4Paper: Page Rotate Counterclockwise") && param215.document.getElementById("AI4Paper: Page Rotate Counterclockwise").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgsplithorizontally") && !param215.document.getElementById("AI4Paper: Split Horizontally")) {
      let var1908 = param215.document.createElement("button");
      var1908.setAttribute('id', 'AI4Paper:\x20Split\x20Horizontally');
      var1908.setAttribute("class", 'toolbar-button\x20AI4Paper-Reader-Buttons\x20AI4Paper-center-toolbarButton');
      var1908.setAttribute("title", "水平分栏");
      var1908.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgsplithorizontally;
      var1908.onclick = () => {
        window.document.getElementById("view-menuitem-split-horizontally").click();
      };
      var1892?.["prepend"](var1908);
    } else !Zotero.Prefs.get('ai4paper.enablesvgsplithorizontally') && param215.document.getElementById("AI4Paper: Split Horizontally") && param215.document.getElementById("AI4Paper: Split Horizontally").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgsplitvertically") && !param215.document.getElementById("AI4Paper: Split Vertically")) {
      let _0x211e95 = param215.document.createElement('button');
      _0x211e95.setAttribute('id', "AI4Paper: Split Vertically");
      _0x211e95.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      _0x211e95.setAttribute('title', "垂直分栏");
      _0x211e95.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgsplitvertically;
      _0x211e95.onclick = () => {
        window.document.getElementById("view-menuitem-split-vertically").click();
      };
      var1892?.["prepend"](_0x211e95);
    } else !Zotero.Prefs.get("ai4paper.enablesvgsplitvertically") && param215.document.getElementById("AI4Paper: Split Vertically") && param215.document.getElementById('AI4Paper:\x20Split\x20Vertically').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgZoomPageHeight") && !param215.document.getElementById("AI4Paper: ZoomPageHeight")) {
      let var1910 = param215.document.createElement('button');
      var1910.setAttribute('id', 'AI4Paper:\x20ZoomPageHeight');
      var1910.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      var1910.setAttribute("title", '适应页面高度');
      var1910.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgZoomPageHeight;
      var1910.onclick = () => {
        window.document.getElementById("view-menuitem-zoom-page-height").click();
      };
      var1892?.["prepend"](var1910);
    } else {
      if (!Zotero.Prefs.get("ai4paper.enablesvgZoomPageHeight") && param215.document.getElementById("AI4Paper: ZoomPageHeight")) {
        param215.document.getElementById('AI4Paper:\x20ZoomPageHeight').remove();
      }
    }
    if (Zotero.Prefs.get("ai4paper.enablesvgOddSpreads") && !param215.document.getElementById("AI4Paper: OddSpreads")) {
      let var1911 = param215.document.createElement("button");
      var1911.setAttribute('id', "AI4Paper: OddSpreads");
      var1911.setAttribute('class', 'toolbar-button\x20AI4Paper-Reader-Buttons\x20AI4Paper-center-toolbarButton');
      var1911.setAttribute('title', "奇数分布");
      var1911.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgOddSpreads;
      var1911.onclick = () => {
        Zotero.AI4Paper.oddSpreads_byShortCuts();
      };
      var1892?.["prepend"](var1911);
    } else !Zotero.Prefs.get("ai4paper.enablesvgOddSpreads") && param215.document.getElementById("AI4Paper: OddSpreads") && param215.document.getElementById("AI4Paper: OddSpreads").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgfileshistory") && !param215.document.getElementById('AI4Paper:\x20Files\x20History')) {
      let var1912 = param215.document.createElement('button');
      var1912.setAttribute('id', "AI4Paper: Files History");
      var1912.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      var1912.setAttribute("title", "最近打开");
      var1912.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgfileshistory;
      var1912.onclick = _0x116705 => {
        _0x116705.shiftKey ? Zotero.AI4Paper.openWorkSpaceWindow() : Zotero.AI4Paper.openDialog_filesHistory();
      };
      var1912.addEventListener("pointerdown", _0x799c4b => {
        _0x799c4b.button == 0x2 && Zotero.AI4Paper.createTabsAsWorkSpace();
      }, false);
      var1892?.["prepend"](var1912);
    } else {
      if (!Zotero.Prefs.get('ai4paper.enablesvgfileshistory') && param215.document.getElementById("AI4Paper: Files History")) {
        param215.document.getElementById('AI4Paper:\x20Files\x20History').remove();
      }
    }
    if (Zotero.Prefs.get("ai4paper.enablesvgcardnotes") && !param215.document.getElementById("AI4Paper: Tag CardNotes")) {
      let var1913 = param215.document.createElement("button");
      var1913.setAttribute('id', "AI4Paper: Tag CardNotes");
      var1913.setAttribute("class", 'toolbar-button\x20AI4Paper-Reader-Buttons\x20AI4Paper-center-toolbarButton');
      var1913.setAttribute("title", "标签管理器");
      var1913.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgcardnotes;
      var1913.onclick = () => {
        Zotero.AI4Paper.openDialog_tagsManager();
      };
      var1892?.["prepend"](var1913);
    } else !Zotero.Prefs.get("ai4paper.enablesvgcardnotes") && param215.document.getElementById("AI4Paper: Tag CardNotes") && param215.document.getElementById("AI4Paper: Tag CardNotes").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgchatwithnewbing") && !param215.document.getElementById('AI4Paper:\x20Chat\x20with\x20NewBing')) {
      let var1914 = param215.document.createElement("button");
      var1914.setAttribute('id', "AI4Paper: Chat with NewBing");
      var1914.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      var1914.setAttribute("title", "Chat with NewBing");
      var1914.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgchatwithnewbing;
      var1914.onclick = () => {
        Zotero.AI4Paper.chatWithNewBing();
      };
      var1892?.["prepend"](var1914);
    } else !Zotero.Prefs.get('ai4paper.enablesvgchatwithnewbing') && param215.document.getElementById("AI4Paper: Chat with NewBing") && param215.document.getElementById("AI4Paper: Chat with NewBing").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgimmersiveTranslate') && !param215.document.getElementById("AI4Paper: Immersive Translate")) {
      let _0x1076a3 = param215.document.createElement("button");
      _0x1076a3.setAttribute('id', 'AI4Paper:\x20Immersive\x20Translate');
      _0x1076a3.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      _0x1076a3.setAttribute("title", "打开沉浸式翻译");
      _0x1076a3.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgimmersiveTranslate;
      _0x1076a3.onclick = () => {
        Zotero.AI4Paper.openImmersiveTranslate();
      };
      _0x1076a3.addEventListener("pointerdown", _0x2d0769 => {
        _0x2d0769.button == 0x2 && Zotero.AI4Paper.openUniversalImmersiveTranslate();
      }, false);
      var1892?.["prepend"](_0x1076a3);
    } else !Zotero.Prefs.get("ai4paper.enablesvgimmersiveTranslate") && param215.document.getElementById("AI4Paper: Immersive Translate") && param215.document.getElementById("AI4Paper: Immersive Translate").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgCopyPDF') && !param215.document.getElementById("AI4Paper: Copy PDF")) {
      let var1916 = param215.document.createElement("button");
      var1916.setAttribute('id', "AI4Paper: Copy PDF");
      var1916.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      var1916.setAttribute("title", "拷贝 PDF");
      var1916.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgCopyPDF;
      var1916.onclick = _0x5cde49 => {
        _0x5cde49.shiftKey ? Zotero.AI4Paper.openwith() : Zotero.AI4Paper.copyPDF();
      };
      var1916.addEventListener("pointerdown", _0x20f03a => {
        _0x20f03a.button == 0x2 && Zotero.AI4Paper.openwith();
      }, false);
      var1892?.['prepend'](var1916);
    } else !Zotero.Prefs.get("ai4paper.enablesvgCopyPDF") && param215.document.getElementById("AI4Paper: Copy PDF") && param215.document.getElementById('AI4Paper:\x20Copy\x20PDF').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgeyesprotection") && !param215.document.getElementById("AI4Paper: Eyes Protection")) {
      let var1917 = param215.document.createElement("button");
      var1917.setAttribute('id', "AI4Paper: Eyes Protection");
      var1917.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      var1917.setAttribute('title', '护眼模式');
      Zotero.Prefs.get('ai4paper.eyesprotectioncolorenable') ? var1917.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection : var1917.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection_off;
      var1917.onclick = _0x40f8eb => {
        if (_0x40f8eb.shiftKey && Zotero.AI4Paper.isZoteroVersion(0x7)) {
          Zotero.Prefs.set("reader.contentDarkMode", !Zotero.Prefs.get("reader.contentDarkMode"));
        } else Zotero.AI4Paper.toggleEyesButtonState(param215);
      };
      var1917.addEventListener("pointerdown", _0x43c4bb => {
        if (_0x43c4bb.button == 0x2) {
          Zotero.AI4Paper.changeZoteroDarkANDLightMode();
        }
      }, false);
      var1893?.["before"](var1917);
    } else !Zotero.Prefs.get("ai4paper.enablesvgeyesprotection") && param215.document.getElementById("AI4Paper: Eyes Protection") && param215.document.getElementById("AI4Paper: Eyes Protection").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgopentransviewer') && !param215.document.getElementById("AI4Paper: Open TransViewer")) {
      let var1918 = param215.document.createElement("button");
      var1918.setAttribute('id', "AI4Paper: Open TransViewer");
      var1918.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      var1918.setAttribute("title", "打开【AI 对话历史】");
      var1918.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgopentransviewer;
      var1918.onclick = () => {
        Zotero.AI4Paper.openTransViewer();
      };
      var1893?.['before'](var1918);
    } else !Zotero.Prefs.get("ai4paper.enablesvgopentransviewer") && param215.document.getElementById('AI4Paper:\x20Open\x20TransViewer') && param215.document.getElementById("AI4Paper: Open TransViewer").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgautotransenable') && !param215.document.getElementById('AI4Paper:\x20Auto\x20Trans\x20Switch')) {
      let _0x4381b2 = param215.document.createElement("button");
      _0x4381b2.setAttribute('id', "AI4Paper: Auto Trans Switch");
      _0x4381b2.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons");
      _0x4381b2.setAttribute("title", "划词翻译开关");
      if (Zotero.Prefs.get("ai4paper.selectedtexttransenable")) _0x4381b2.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable;else {
        _0x4381b2.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable_off;
      }
      _0x4381b2.onclick = () => {
        Zotero.AI4Paper.toggleAutoTransButtonState(param215);
      };
      var1893?.['before'](_0x4381b2);
    } else !Zotero.Prefs.get("ai4paper.enablesvgautotransenable") && param215.document.getElementById('AI4Paper:\x20Auto\x20Trans\x20Switch') && param215.document.getElementById('AI4Paper:\x20Auto\x20Trans\x20Switch').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgobnotesautoenable") && !param215.document.getElementById("AI4Paper: Obsidian Notes Auto Update Switch")) {
      let _0x58df2 = param215.document.createElement("button");
      _0x58df2.setAttribute('id', "AI4Paper: Obsidian Notes Auto Update Switch");
      _0x58df2.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      _0x58df2.setAttribute("title", "Obsidian Note 自动模式开关");
      if (Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes")) {
        _0x58df2.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable;
      } else {
        _0x58df2.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable_off;
      }
      _0x58df2.setAttribute("style", "height: 20px; width: 32px; margin-right: 3px; margin-left: 3px");
      _0x58df2.onclick = () => {
        Zotero.AI4Paper.toggleObAutoNoteButtonState(param215);
      };
      var1893?.["before"](_0x58df2);
    } else !Zotero.Prefs.get("ai4paper.enablesvgobnotesautoenable") && param215.document.getElementById("AI4Paper: Obsidian Notes Auto Update Switch") && param215.document.getElementById('AI4Paper:\x20Obsidian\x20Notes\x20Auto\x20Update\x20Switch').remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgzoteropreferences') && !param215.document.getElementById('AI4Paper:\x20Zotero\x20Preferences')) {
      let var1921 = param215.document.createElement("button");
      var1921.setAttribute('id', "AI4Paper: Zotero Preferences");
      var1921.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons");
      var1921.setAttribute("title", "Zotero 首选项");
      var1921.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgzoteropreferences;
      var1921.onclick = () => {
        Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
      };
      var1893?.['before'](var1921);
    } else !Zotero.Prefs.get('ai4paper.enablesvgzoteropreferences') && param215.document.getElementById('AI4Paper:\x20Zotero\x20Preferences') && param215.document.getElementById("AI4Paper: Zotero Preferences").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgshowinmylibrary") && !param215.document.getElementById("AI4Paper: Show in My Llibrary")) {
      let var1922 = param215.document.createElement("button");
      var1922.setAttribute('id', "AI4Paper: Show in My Llibrary");
      var1922.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons");
      var1922.setAttribute("title", '在文库中显示');
      var1922.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgshowinmylibrary;
      var1922.onclick = () => {
        Zotero.AI4Paper.showItemInCollection(Zotero.AI4Paper.getCurrentItem());
      };
      var1893?.["before"](var1922);
    } else !Zotero.Prefs.get("ai4paper.enablesvgshowinmylibrary") && param215.document.getElementById('AI4Paper:\x20Show\x20in\x20My\x20Llibrary') && param215.document.getElementById('AI4Paper:\x20Show\x20in\x20My\x20Llibrary').remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgshowfile') && !param215.document.getElementById('AI4Paper:\x20Show\x20File')) {
      let var1923 = param215.document.createElement("button");
      var1923.setAttribute('id', "AI4Paper: Show File");
      var1923.setAttribute("class", 'toolbar-button\x20AI4Paper-Reader-Buttons');
      var1923.setAttribute("title", "打开文件位置");
      var1923.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgshowfile;
      var1923.onclick = () => {
        Zotero.AI4Paper.showFile();
      };
      var1893?.["before"](var1923);
    } else !Zotero.Prefs.get("ai4paper.enablesvgshowfile") && param215.document.getElementById("AI4Paper: Show File") && param215.document.getElementById('AI4Paper:\x20Show\x20File').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgtransnotesort") && !param215.document.getElementById("AI4Paper: Trans Note Sort")) {
      let var1924 = param215.document.createElement("button");
      var1924.setAttribute('id', "AI4Paper: Trans Note Sort");
      var1924.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      var1924.setAttribute("title", "切换翻译记录排序");
      var1924.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgtransnotesort;
      var1924.onclick = () => {
        Zotero.AI4Paper.toogleSortingTrans();
      };
      var1893?.["before"](var1924);
    } else !Zotero.Prefs.get("ai4paper.enablesvgtransnotesort") && param215.document.getElementById('AI4Paper:\x20Trans\x20Note\x20Sort') && param215.document.getElementById("AI4Paper: Trans Note Sort").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgarchive') && !param215.document.getElementById("AI4Paper: Archive")) {
      let var1925 = param215.document.createElement("button");
      var1925.setAttribute('id', "AI4Paper: Archive");
      var1925.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      var1925.setAttribute('title', '归档');
      var1925.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgarchive;
      var1925.onclick = () => {
        Zotero.AI4Paper.archiveSelectedItems();
      };
      var1893?.['before'](var1925);
    } else !Zotero.Prefs.get("ai4paper.enablesvgarchive") && param215.document.getElementById("AI4Paper: Archive") && param215.document.getElementById("AI4Paper: Archive").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgPaperAI')) Zotero.AI4Paper.addReaderMenuButton_paperAI(param215, var1893);else !Zotero.Prefs.get("ai4paper.enablesvgPaperAI") && param215.document.getElementById("AI4Paper: PaperAI") && param215.document.getElementById("AI4Paper: PaperAI").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgCardNotesSearch") && !param215.document.getElementById("AI4Paper: CardNotesSearch")) {
      let _0x3335ad = param215.document.createElement('button');
      _0x3335ad.setAttribute('id', 'AI4Paper:\x20CardNotesSearch');
      _0x3335ad.setAttribute("class", 'toolbar-button\x20AI4Paper-Reader-Buttons\x20AI4Paper-centerRight-toolbarButton');
      _0x3335ad.setAttribute("title", '卡片笔记搜索');
      _0x3335ad.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgCardNotesSearch;
      _0x3335ad.onclick = async _0x13a427 => {
        if (_0x13a427.shiftKey) Zotero.getMainWindow().ZoteroPane_Local.openAdvancedSearchWindow();else {
          let var1927 = window.document.querySelector(".AI4Paper-CardNotes-Search");
          if (!var1927) {
            var1927 = window.document.createXULElement("panel");
            var1927.setAttribute("class", "AI4Paper-CardNotes-Search");
            var1927.setAttribute("type", "arrow");
            var1927.addEventListener("popupshown", _0x10e483 => {
              window.document.querySelector("#CardNotes-SearchBox") && window.document.querySelector("#CardNotes-SearchBox").focus();
            });
            let var1928 = window.document.createXULElement("vbox"),
              var1929 = window.document.createElement("textarea");
            var1929.id = "CardNotes-SearchBox";
            var1929.style = "padding: 5px;overflow-y: auto;overflow-x: hidden;";
            var1929.style.width = "350px";
            var1929.style.height = "20px";
            var1929.onkeydown = _0x57ccc9 => {
              if (!_0x57ccc9.shiftKey && !_0x57ccc9.ctrlKey && !_0x57ccc9.altKey && !_0x57ccc9.metaKey && _0x57ccc9.keyCode === 0xd) {
                _0x57ccc9.returnValue = false;
                if (_0x57ccc9.preventDefault) {
                  _0x57ccc9.preventDefault();
                }
                let var1930 = var1929.value.trim(),
                  var1931 = window.document.getElementById('CardNotes-SearchBox-2nd').value.trim();
                if (!window.document.getElementById("enableTwoKeyWordsMode").twoKeywords) {
                  if (var1930 === '' && var1929.placeholder === '') {
                    return false;
                  } else var1930 === '' && var1929.placeholder != '' && (var1930 = var1929.placeholder);
                  var1930 && (Zotero.AI4Paper.searchCardNotes(var1930), Zotero.AI4Paper.lastCardNotesSearchInput = var1930, Zotero.AI4Paper.updateCardNotesSearchHistory(var1930));
                } else {
                  if (var1930 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords && !var1931) {
                    Zotero.AI4Paper.searchCardNotes(var1930);
                    Zotero.AI4Paper.lastCardNotesSearchInput = var1930;
                    Zotero.AI4Paper.updateCardNotesSearchHistory(var1930);
                  } else {
                    if (!var1930 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords && var1931) {
                      Zotero.AI4Paper.searchCardNotes(var1931);
                      Zotero.AI4Paper.lastCardNotesSearchInput = var1931;
                      Zotero.AI4Paper.updateCardNotesSearchHistory(var1931);
                    } else {
                      if (window.document.getElementById("enableTwoKeyWordsMode").twoKeywords && var1930 && var1931) {
                        let var1932 = window.document.getElementById("conditions-radiogroup").value === '与' ? "AND:AND" : "OR:OR",
                          var1933 = var1930 + '\x20' + var1932 + '\x20' + var1931;
                        Zotero.AI4Paper.searchCardNotes(var1933);
                        Zotero.AI4Paper.lastCardNotesSearchInput = var1930;
                        Zotero.AI4Paper.updateCardNotesSearchHistory(var1930);
                      }
                    }
                  }
                }
              }
              _0x57ccc9.shiftKey && !_0x57ccc9.ctrlKey && !_0x57ccc9.altKey && !_0x57ccc9.metaKey && _0x57ccc9.keyCode === 0xd && (_0x57ccc9.returnValue = false, _0x57ccc9.preventDefault && _0x57ccc9.preventDefault(), Zotero.AI4Paper.cardNotesSearchButton_webSearch('metaso'));
            };
            var1929.oncontextmenu = _0x47cb79 => {
              _0x47cb79.preventDefault && _0x47cb79.preventDefault();
              let var1934 = Zotero.Prefs.get("ai4paper.cardNotesSearchHistory").split("😊🎈🍓");
              if (var1934.length === 0x1 && var1934[0x0] === '') return;
              let var1935 = window.document.querySelector("#browser").querySelector("#AI4Paper-CardNotes-SearchBox-ContextMenu-menupopup");
              !var1935 && (var1935 = window.document.createXULElement("menupopup"), var1935.id = 'AI4Paper-CardNotes-SearchBox-ContextMenu-menupopup', window.document.querySelector("#browser")?.["appendChild"](var1935));
              let var1936 = var1935.firstElementChild;
              while (var1936) {
                var1936.remove();
                var1936 = var1935.firstElementChild;
              }
              for (let var1937 of var1934) {
                let _0x265ae9 = var1937,
                  _0x425956 = window.document.createXULElement("menuitem");
                var1937.length > 0x1e && (var1937 = var1937.substring(0x0, 0x1d) + "...");
                _0x425956.setAttribute("label", var1937);
                _0x425956.setAttribute("tooltiptext", _0x265ae9);
                _0x425956.addEventListener("command", () => {
                  if (_0x265ae9.indexOf("AND:AND") != -0x1 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords) {
                    let var1940 = _0x265ae9.split("AND:AND");
                    if (var1940[0x0].trim()) {
                      window.document.getElementById("CardNotes-SearchBox").value = var1940[0x0].trim();
                    }
                    var1940[0x1].trim() && (window.document.getElementById('CardNotes-SearchBox-2nd').value = var1940[0x1].trim());
                    window.document.getElementById("conditions-radiogroup").value = '与';
                  } else {
                    if (_0x265ae9.indexOf("OR:OR") != -0x1 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords) {
                      let _0x12593a = _0x265ae9.split("OR:OR");
                      _0x12593a[0x0].trim() && (window.document.getElementById("CardNotes-SearchBox").value = _0x12593a[0x0].trim());
                      _0x12593a[0x1].trim() && (window.document.getElementById("CardNotes-SearchBox-2nd").value = _0x12593a[0x1].trim());
                      window.document.getElementById("conditions-radiogroup").value = '或';
                    } else {
                      var1929.value = _0x265ae9;
                    }
                  }
                });
                var1935.appendChild(_0x425956);
              }
              var1935.openPopup(var1929, "after_start", 0x0, 0x3, false, false);
            };
            let var1942 = window.document.createElement("textarea");
            var1942.id = "CardNotes-SearchBox-2nd";
            var1942.style = "display: none;margin-top: 15px;padding: 5px;overflow-y: auto;overflow-x: hidden;";
            var1942.style.width = "350px";
            var1942.style.height = "20px";
            var1942.onkeydown = _0x4675b8 => {
              if (!_0x4675b8.shiftKey && !_0x4675b8.ctrlKey && !_0x4675b8.altKey && !_0x4675b8.metaKey && _0x4675b8.keyCode === 0xd) {
                _0x4675b8.returnValue = false;
                _0x4675b8.preventDefault && _0x4675b8.preventDefault();
                let var1943 = window.document.getElementById("CardNotes-SearchBox").value.trim(),
                  var1944 = var1942.value.trim();
                if (var1944 && !var1943) {
                  Zotero.AI4Paper.searchCardNotes(var1944);
                  Zotero.AI4Paper.lastCardNotesSearchInput = var1944;
                  Zotero.AI4Paper.updateCardNotesSearchHistory(var1944);
                } else {
                  if (!var1944 && var1943) {
                    Zotero.AI4Paper.searchCardNotes(var1943);
                    Zotero.AI4Paper.lastCardNotesSearchInput = var1943;
                    Zotero.AI4Paper.updateCardNotesSearchHistory(var1943);
                  } else {
                    if (var1943 && var1944) {
                      let var1945 = window.document.getElementById("conditions-radiogroup").value === '与' ? "AND:AND" : "OR:OR",
                        var1946 = var1943 + '\x20' + var1945 + '\x20' + var1944;
                      Zotero.AI4Paper.searchCardNotes(var1946);
                      Zotero.AI4Paper.lastCardNotesSearchInput = var1946;
                      Zotero.AI4Paper.updateCardNotesSearchHistory(var1946);
                    }
                  }
                }
              }
              if (_0x4675b8.shiftKey && !_0x4675b8.ctrlKey && !_0x4675b8.altKey && !_0x4675b8.metaKey && _0x4675b8.keyCode === 0xd) {
                _0x4675b8.returnValue = false;
                _0x4675b8.preventDefault && _0x4675b8.preventDefault();
              }
            };
            var1942.oncontextmenu = _0x1daf07 => {
              _0x1daf07.preventDefault && _0x1daf07.preventDefault();
              let var1947 = Zotero.Prefs.get("ai4paper.cardNotesSearchHistory").split('😊🎈🍓');
              if (var1947.length === 0x1 && var1947[0x0] === '') {
                return;
              }
              let var1948 = window.document.querySelector('#browser').querySelector("#AI4Paper-CardNotes-SearchBox-ContextMenu-menupopup");
              if (!var1948) {
                var1948 = window.document.createXULElement("menupopup");
                var1948.id = "AI4Paper-CardNotes-SearchBox-ContextMenu-menupopup";
                window.document.querySelector("#browser")?.["appendChild"](var1948);
              }
              let var1949 = var1948.firstElementChild;
              while (var1949) {
                var1949.remove();
                var1949 = var1948.firstElementChild;
              }
              for (let var1950 of var1947) {
                let var1951 = var1950,
                  var1952 = window.document.createXULElement('menuitem');
                var1950.length > 0x1e && (var1950 = var1950.substring(0x0, 0x1d) + "...");
                var1952.setAttribute("label", var1950);
                var1952.setAttribute("tooltiptext", var1951);
                var1952.addEventListener('command', () => {
                  if (var1951.indexOf('AND:AND') != -0x1 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords) {
                    let _0x38a1e5 = var1951.split("AND:AND");
                    _0x38a1e5[0x0].trim() && (window.document.getElementById("CardNotes-SearchBox").value = _0x38a1e5[0x0].trim());
                    _0x38a1e5[0x1].trim() && (window.document.getElementById("CardNotes-SearchBox-2nd").value = _0x38a1e5[0x1].trim());
                    window.document.getElementById("conditions-radiogroup").value = '与';
                  } else {
                    if (var1951.indexOf("OR:OR") != -0x1 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords) {
                      let _0x14ed9d = var1951.split("OR:OR");
                      if (_0x14ed9d[0x0].trim()) {
                        window.document.getElementById("CardNotes-SearchBox").value = _0x14ed9d[0x0].trim();
                      }
                      _0x14ed9d[0x1].trim() && (window.document.getElementById("CardNotes-SearchBox-2nd").value = _0x14ed9d[0x1].trim());
                      window.document.getElementById("conditions-radiogroup").value = '或';
                    } else var1942.value = var1951;
                  }
                });
                var1948.appendChild(var1952);
              }
              var1948.openPopup(var1942, "after_start", 0x0, 0x3, false, false);
            };
            let var1955 = window.document.createElement('div');
            var1955.id = "enableTwoKeyWordsMode";
            var1955.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable_off;
            var1955.twoKeywords = false;
            var1955.style = "width: 30px;display: grid;place-items: center;";
            var1955.title = "双关键词搜索";
            var1955.onclick = _0x13c321 => {
              _0x13c321.stopPropagation();
              !var1955.twoKeywords ? (var1955.innerHTML = Zotero.AI4Paper.svg_icon_20px.on_orange, var1955.twoKeywords = true, window.document.getElementById("CardNotes-SearchBox-2nd").style.display = '', window.document.getElementById("conditions-radiogroup").style.display = '') : (var1955.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable_off, var1955.twoKeywords = false, window.document.getElementById("CardNotes-SearchBox-2nd").style.display = "none", window.document.getElementById("conditions-radiogroup").style.display = "none");
            };
            let var1956 = window.document.createElement("div");
            var1956.innerHTML = Zotero.AI4Paper.svg_icon_16px.help;
            var1956.style = "width: 16px;height: 16px;margin-left: 10px;vertical-align:middle";
            var1956.title = "帮助文档";
            var1956.onclick = _0x3d11c8 => {
              ZoteroPane.loadURI("https://www.yuque.com/qnscholar/zotero-one/kav7sf3h4702wzq8?singleDoc# 《阅读器按钮【卡片笔记搜索】使用技巧》");
            };
            function fn3(param216) {
              param216.style = "transform: scale(0.8);width: 20px;height: 20px;margin-left: 15px;vertical-align:middle;transition: transform 0.125s ease;";
              param216.onmouseover = function () {
                this.style.transform = 'scale(0.96)';
              };
              param216.onmouseout = function () {
                this.style.transform = "scale(0.8)";
              };
            }
            let var1957 = window.document.createElement("div");
            var1957.innerHTML = Zotero.AI4Paper.svg_icon_20px.matrix;
            var1957.title = "智能文献矩阵搜索";
            fn3(var1957);
            var1957.onclick = _0x390d0e => {
              Zotero.AI4Paper.cardNotesSearchButton_webSearch("matrix");
            };
            let var1958 = window.document.createElement("div");
            var1958.innerHTML = Zotero.AI4Paper.svg_icon_20px.metaso;
            var1958.title = "秘塔 AI 搜索";
            fn3(var1958);
            var1958.onclick = _0x19c67f => {
              Zotero.AI4Paper.cardNotesSearchButton_webSearch("metaso");
            };
            let var1959 = window.document.createElement("div");
            var1959.innerHTML = Zotero.AI4Paper.svg_icon_20px.google;
            var1959.title = '谷歌';
            fn3(var1959);
            var1959.onclick = _0x118a50 => {
              Zotero.AI4Paper.cardNotesSearchButton_webSearch("google");
            };
            let var1960 = window.document.createElement("div");
            var1960.innerHTML = Zotero.AI4Paper.svg_icon_20px.google_scholar;
            var1960.title = "谷歌学术";
            fn3(var1960);
            var1960.onclick = _0x5d5907 => {
              Zotero.AI4Paper.cardNotesSearchButton_webSearch('googlescholar');
            };
            let var1961 = window.document.createElement("div");
            var1961.innerHTML = Zotero.AI4Paper.svg_icon_20px.scihub;
            var1961.title = "SciHub";
            fn3(var1961);
            var1961.onclick = _0x3bf031 => {
              Zotero.AI4Paper.cardNotesSearchButton_webSearch("scihub");
            };
            let var1962 = window.document.createXULElement("hbox");
            var1962.style.alignItems = "center";
            var1962.style.display = "flex";
            var1962.style.marginTop = '15px';
            var1962.appendChild(var1955);
            var1962.appendChild(var1956);
            var1962.appendChild(var1957);
            var1962.appendChild(var1958);
            var1962.appendChild(var1959);
            var1962.appendChild(var1960);
            var1962.appendChild(var1961);
            let var1963 = window.document.createXULElement("radiogroup");
            var1963.id = "conditions-radiogroup";
            var1963.setAttribute("orient", "horizontal");
            var1963.style = "display: none;margin-top: 10px";
            let var1964 = window.document.createXULElement("radio");
            var1964.setAttribute('label', '与');
            var1964.setAttribute('value', '与');
            var1963.appendChild(var1964);
            var1964 = window.document.createXULElement('radio');
            var1964.setAttribute("label", '或');
            var1964.setAttribute("value", '或');
            var1963.appendChild(var1964);
            var1928.appendChild(var1929);
            var1928.appendChild(var1942);
            var1928.appendChild(var1962);
            var1928.appendChild(var1963);
            var1927.appendChild(var1928);
            window.document.querySelector('#browser')?.['appendChild'](var1927);
          }
          window.document.querySelector('#CardNotes-SearchBox') && (window.document.querySelector("#CardNotes-SearchBox").placeholder = Zotero.AI4Paper.lastCardNotesSearchInput.trim());
          var1927.openPopup(_0x3335ad, "after_start", 0x10, -0x2, false, false);
        }
      };
      _0x3335ad.addEventListener("pointerdown", _0x3b78d9 => {
        _0x3b78d9.button == 0x2 && Zotero.AI4Paper.openDialog_tagsManager();
      }, false);
      let _0x539921 = param215.document.querySelector('.toolbar-button.toolbar-dropdown-button');
      _0x539921?.["after"](_0x3335ad);
      let _0x564821 = param215.document.querySelector(".divider");
      if (_0x564821) {
        let _0x2803fa = _0x564821.cloneNode(true);
        _0x2803fa.setAttribute('id', "divider-before-toolbarButton-CardNotesSearch");
        _0x2803fa.classList.toggle("divider-before-toolbarButton", true);
        _0x3335ad?.['before'](_0x2803fa);
      }
    } else !Zotero.Prefs.get("ai4paper.enablesvgCardNotesSearch") && param215.document.getElementById('AI4Paper:\x20CardNotesSearch') && (param215.document.getElementById("AI4Paper: CardNotesSearch").remove(), param215.document.querySelectorAll("#divider-before-toolbarButton-CardNotesSearch").forEach(_0x45189a => _0x45189a.remove()));
    if (Zotero.Prefs.get('ai4paper.enablesvggo2favoritecollection')) Zotero.AI4Paper.addReaderMenuButton_go2FavoriteCollection(param215);else !Zotero.Prefs.get("ai4paper.enablesvggo2favoritecollection") && param215.document.getElementById("AI4Paper: go2FavoriteCollection") && (param215.document.getElementById("AI4Paper: go2FavoriteCollection").remove(), param215.document.querySelectorAll("#divider-before-toolbarButton-go2FavoriteCollection").forEach(_0x5babec => _0x5babec.remove()));
    if (param215.document.querySelectorAll('.AI4Paper-center-toolbarButton').length) {
      if (param215.document.querySelectorAll('#divider-for-ai4paper-center-toolbarButtons').length === 0x0) {
        let _0x43d555 = param215.document.querySelector(".divider");
        if (_0x43d555) {
          let _0x449e4d = _0x43d555.cloneNode(true);
          _0x449e4d.id = "divider-for-ai4paper-center-toolbarButtons";
          _0x449e4d.classList.toggle("divider-before-toolbarButton", true);
          let _0x190baa = param215.document.querySelector('.toolbar-button.highlight');
          _0x190baa?.["before"](_0x449e4d);
        }
      }
    } else param215.document.querySelectorAll("#divider-for-ai4paper-center-toolbarButtons").forEach(_0x14a643 => _0x14a643.remove());
    Zotero.AI4Paper.addViewButtons(param215);
  },
  'updateReaderButtonState': async function (param255) {
    let var2098 = param255.document.getElementById("AI4Paper: Obsidian Notes Auto Update Switch");
    if (Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes")) {
      var2098 && (var2098.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable);
    } else var2098 && (var2098.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable_off);
    let var2099 = param255.document.getElementById("AI4Paper: Auto Trans Switch");
    Zotero.Prefs.get('ai4paper.selectedtexttransenable') ? var2099 && (var2099.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable) : var2099 && (var2099.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable_off);
    let var2100 = param255.document.getElementById("AI4Paper: Eyes Protection");
    Zotero.Prefs.get("ai4paper.eyesprotectioncolorenable") ? var2100 && (var2100.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection) : var2100 && (var2100.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection_off);
  },
  'toggleEyesButtonState': async function (param256) {
    let var2101 = param256.document.getElementById('AI4Paper:\x20Eyes\x20Protection');
    if (Zotero.Prefs.get("ai4paper.eyesprotectioncolorselectwindow")) {
      if (Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === '自定义' && !Zotero.Prefs.get("ai4paper.eyesprotectioncolorcodeisok")) {
        return window.alert("您开启了自定义护眼色模式，但输入的护眼色代码无效，请前往【AI4paper 首选项 --> 拓展 --> 护眼色】重新设置！"), false;
      }
      let _0x165862 = Zotero.AI4Paper.openDialogByType_modal("selectBackGroundColor");
      if (!_0x165862) {
        return false;
      } else {
        if (_0x165862 === "default") {
          Zotero.Prefs.set("ai4paper.eyesprotectioncolorenable", false);
          var2101.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection_off;
        } else {
          Zotero.Prefs.set("ai4paper.eyesprotectioncolorenable", true);
          var2101.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection;
          if (_0x165862 === "mungbean_green") Zotero.Prefs.set('ai4paper.eyesprotectioncolor', "豆沙绿");else {
            if (_0x165862 === "matcha_green") Zotero.Prefs.set("ai4paper.eyesprotectioncolor", '抹茶绿');else {
              if (_0x165862 === 'grass_green') Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "青草绿");else {
                if (_0x165862 === 'almond_yellow') {
                  Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "杏仁黄");
                } else {
                  if (_0x165862 === 'autumnleaf_brown') Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '秋叶褐');else {
                    if (_0x165862 === "crimson_red") Zotero.Prefs.set('ai4paper.eyesprotectioncolor', "胭脂红");else {
                      if (_0x165862 === "ocean_blue") Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "海天蓝");else {
                        if (_0x165862 === 'gauze_purple') Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "葛巾紫");else {
                          if (_0x165862 === 'aurora_grey') Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "极光灰");else {
                            if (_0x165862 === 'ivory_white') {
                              Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "象牙白");
                            } else _0x165862 === "custom" && Zotero.Prefs.set("ai4paper.eyesprotectioncolor", '自定义');
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
        return Zotero.AI4Paper.setPDFBackGroundColor(param256), true;
      }
    }
    Zotero.Prefs.get("ai4paper.eyesprotectioncolorenable") ? (Zotero.Prefs.set("ai4paper.eyesprotectioncolorenable", false), var2101.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection_off, Zotero.AI4Paper.setPDFBackGroundColor(param256)) : (Zotero.Prefs.set('ai4paper.eyesprotectioncolorenable', true), var2101.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection, Zotero.AI4Paper.setPDFBackGroundColor(param256));
  },
  'toggleObAutoNoteButtonState': async function (param257) {
    let var2103 = param257.document.getElementById("AI4Paper: Obsidian Notes Auto Update Switch");
    Zotero.Prefs.get('ai4paper.obsidianautoupdatenotes') ? (Zotero.Prefs.set("ai4paper.obsidianautoupdatenotes", false), var2103.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable_off) : (Zotero.Prefs.set('ai4paper.obsidianautoupdatenotes', true), var2103.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable);
  },
  'toggleAutoTransButtonState': async function (param258) {
    let var2104 = param258.document.getElementById("AI4Paper: Auto Trans Switch");
    Zotero.Prefs.get('ai4paper.selectedtexttransenable') ? (Zotero.Prefs.set("ai4paper.selectedtexttransenable", false), var2104.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable_off) : (Zotero.Prefs.set("ai4paper.selectedtexttransenable", true), var2104.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable);
    Zotero.AI4Paper.updateTranslateReaderSidePane();
  },
  'waitForIframeReady': async function (param259) {
    let var2105 = param259.document.querySelectorAll("iframe")[0x0].contentWindow;
    switch (var2105.document.readyState) {
      case "uninitialized":
        {
          let var2106 = 0x0;
          while (var2105.document.readyState === "uninitialized") {
            if (var2106 >= 0x1f4) return;
            await Zotero.Promise.delay(0xa);
            var2106++;
          }
          Zotero.AI4Paper.setPDFBackGroundColor(param259);
          Zotero.AI4Paper.addButtonColorLabel(param259);
          Zotero.AI4Paper.addAnnotationButtonsInFloatingWindow(param259);
          Zotero.AI4Paper.onSidebarToggle(param259);
          Zotero.AI4Paper.onClickButton_viewAnnotations(param259);
          Zotero.AI4Paper.onClickButton_viewOutline(param259);
          return;
        }
      case "complete":
        {
          Zotero.AI4Paper.setPDFBackGroundColor(param259);
          Zotero.AI4Paper.addButtonColorLabel(param259);
          Zotero.AI4Paper.addAnnotationButtonsInFloatingWindow(param259);
          Zotero.AI4Paper.onSidebarToggle(param259);
          Zotero.AI4Paper.onClickButton_viewAnnotations(param259);
          Zotero.AI4Paper.onClickButton_viewOutline(param259);
        }
    }
  },
  'setPDFBackGroundColor': async function (param260) {
    if (!Zotero.Prefs.get('ai4paper.eyesprotectioncolorenable') || Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "自定义" && !Zotero.Prefs.get("ai4paper.eyesprotectioncolorcodeisok")) return param260.document.querySelectorAll("iframe")[0x0]?.["contentWindow"]["document"]["head"]["querySelectorAll"]("#eyes-protection-color")["forEach"](_0x121738 => _0x121738.remove()), param260.document.querySelectorAll("iframe")[0x1]?.["contentWindow"]["document"]['head']["querySelectorAll"]("#eyes-protection-color")["forEach"](_0xb0069 => _0xb0069.remove()), false;
    let var2107 = '#53fc5a';
    if (Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === "豆沙绿") var2107 = '#53fc5a';else {
      if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "抹茶绿") var2107 = "#97ff91";else {
        if (Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === "青草绿") var2107 = "#b7ec36";else {
          if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "杏仁黄") var2107 = " #faf564";else {
            if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "秋叶褐") var2107 = '#ffc26b';else {
              if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "胭脂红") var2107 = "#fd9b81";else {
                if (Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === "海天蓝") var2107 = "#b0c6fc";else {
                  if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '葛巾紫') {
                    var2107 = "#9ba4fe";
                  } else {
                    if (Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === "极光灰") var2107 = "#cfcfee";else {
                      if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "象牙白") var2107 = "#f8ebbf";else Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === "自定义" && (var2107 = Zotero.Prefs.get("ai4paper.eyesprotectioncolorcode"));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    try {
      param260.document.querySelectorAll("iframe")[0x0]?.["contentWindow"]["document"]["head"]["querySelectorAll"]("#eyes-protection-color")["forEach"](_0x357d48 => _0x357d48.remove());
      param260.document.querySelectorAll("iframe")[0x1]?.["contentWindow"]['document']["head"]["querySelectorAll"]("#eyes-protection-color")["forEach"](_0x42d740 => _0x42d740.remove());
      let var2108 = param260.document.createElement("style");
      var2108.id = "eyes-protection-color";
      var2108.textContent = ".textLayer{\n                display:block !important;\n                background-color: " + var2107 + " !important;\n                opacity: 0.2 !important;\n            }";
      param260.document.querySelectorAll("iframe")[0x0]?.["contentWindow"]["document"]["head"]['appendChild'](var2108);
      var2108 = param260.document.createElement("style");
      var2108.id = "eyes-protection-color";
      var2108.textContent = '.textLayer{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20display:block\x20!important;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20background-color:\x20' + var2107 + " !important;\n                opacity: 0.2 !important;\n            }";
      param260.document.querySelectorAll("iframe")[0x1]?.['contentWindow']["document"]["head"]['appendChild'](var2108);
    } catch (_0x29fe6c) {
      Zotero.debug('' + _0x29fe6c);
    }
  },
  'OnSplitMenuItemClick': async function () {
    let var2109 = Zotero_Tabs._selectedID;
    var var2110 = Zotero.Reader.getByTabID(var2109);
    if (!var2110) return false;
    let var2111 = var2110._iframeWindow;
    await new Promise(_0x5accc3 => setTimeout(_0x5accc3, 0x64));
    Zotero.AI4Paper.addAnnotationButtonsInFloatingWindow(var2111);
    Zotero.AI4Paper.setPDFBackGroundColor(var2111);
  },
  'OnRotateMenuItemClick': async function () {
    let var2112 = Zotero_Tabs._selectedID;
    var var2113 = Zotero.Reader.getByTabID(var2112);
    if (!var2113) return false;
    let var2114 = var2113._iframeWindow;
    await new Promise(_0x159ec4 => setTimeout(_0x159ec4, 0x3e8));
    Zotero.AI4Paper.setPDFBackGroundColor(var2114);
    Zotero.AI4Paper.addAnnotationButtonsInFloatingWindow(var2114);
  },
  'readerMenuItemClickEvent': function (param261) {
    if (param261 === "add") {
      window.document.getElementById("view-menuitem-split-horizontally")?.["addEventListener"]("command", () => {
        Zotero.AI4Paper.OnSplitMenuItemClick();
      });
      window.document.getElementById('view-menuitem-split-vertically')?.['addEventListener']("command", () => {
        Zotero.AI4Paper.OnSplitMenuItemClick();
      });
      window.document.getElementById("menu_rotateRight")?.["addEventListener"]("command", () => {
        Zotero.AI4Paper.OnRotateMenuItemClick();
      });
      window.document.getElementById("menu_rotateLeft")?.["addEventListener"]("command", () => {
        Zotero.AI4Paper.OnRotateMenuItemClick();
      });
    } else param261 === "remove" && (window.document.getElementById("view-menuitem-split-horizontally")?.["removeEventListener"]("command", () => {
      Zotero.AI4Paper.OnSplitMenuItemClick();
    }), window.document.getElementById("view-menuitem-split-vertically")?.['removeEventListener']('command', () => {
      Zotero.AI4Paper.OnSplitMenuItemClick();
    }), window.document.getElementById("menu_rotateRight")?.["removeEventListener"]("command", () => {
      Zotero.AI4Paper.OnRotateMenuItemClick();
    }), window.document.getElementById("menu_rotateLeft")?.["removeEventListener"]("command", () => {
      Zotero.AI4Paper.OnRotateMenuItemClick();
    }));
  },
  'addReaderMenuButton_go2FavoriteCollection': async function (param262) {
    param262.document.getElementById("AI4Paper: go2FavoriteCollection")?.["remove"]();
    param262.document.querySelectorAll("#divider-before-toolbarButton-go2FavoriteCollection").forEach(_0x4d7baa => _0x4d7baa.remove());
    param262.document.head.querySelectorAll("#go2FavoriteCollection-button-style").forEach(_0x1050c0 => _0x1050c0.remove());
    const var2115 = param262.document.createElement("style");
    var2115.id = "go2FavoriteCollection-button-style";
    var2115.textContent = "\n          .toolbarButton.go2FavoriteCollection-button-css::before {\n            background-image: url('chrome://ai4paper/content/icons/folder_20px.svg') !important;\n            background-repeat: repeat;\n            background-size: cover;\n            width: 16px;\n            height: 16px;\n            margin: 0 !important;\n            background-color: transparent !important;\n            border: none !important;\n            transform: scale(0.8);\n          }\n        ";
    param262.document.head.appendChild(var2115);
    let var2116 = param262.document.querySelector(".toolbar-button.toolbar-dropdown-button"),
      var2117 = var2116.cloneNode(true);
    var2117.id = "AI4Paper: go2FavoriteCollection";
    var2117.title = "前往收藏分类";
    var2117.disabled = false;
    var2117.setAttribute("class", "toolbar-button toolbar-dropdown-button AI4Paper-Reader-Buttons AI4Paper-centerRight-toolbarButton");
    var2117.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvggo2favoritecollection + "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\" transform=\"translate(1,0)\" fill=\"#828282\"><path fill=\"#828282\" d=\"m0 2.707 4 4 4-4L7.293 2 4 5.293.707 2z\"></path></svg>";
    var2116?.["after"](var2117);
    let var2118 = param262.document.querySelector(".divider");
    if (var2118) {
      let var2119 = var2118.cloneNode(true);
      var2119.setAttribute('id', "divider-before-toolbarButton-go2FavoriteCollection");
      var2119.classList.toggle("divider-before-toolbarButton", true);
      var2117?.["before"](var2119);
    }
    let var2120 = window.document.createXULElement("menupopup");
    var2120.id = "AI4Paper-ReaderButton-go2FavoriteCollection-menupopup";
    var2120.addEventListener("popuphidden", () => {
      window.document.querySelector("#browser").querySelectorAll("#AI4Paper-ReaderButton-go2FavoriteCollection-menupopup").forEach(_0x187478 => _0x187478.remove());
    });
    Zotero.AI4Paper.buildMenuItem_FavoriteCollection(var2120, true);
    var2117.addEventListener("click", _0x353c6c => {
      window.document.querySelector("#browser").querySelectorAll("#AI4Paper-ReaderButton-go2FavoriteCollection-menupopup").forEach(_0x5c8c55 => _0x5c8c55.remove());
      window.document.querySelector("#browser")?.["appendChild"](var2120);
      var2120.openPopup(var2117, "after_start", 0x0, 0x0, false, false);
    });
    var2117.addEventListener("pointerdown", _0x116704 => {
      if (_0x116704.button == 0x2) {
        Zotero.AI4Paper.openDialogByType('sortFavoriteCollections');
      }
    }, false);
  },
  'addReaderMenuButton_paperAI': function (param263, param264) {
    param263.document.getElementById('AI4Paper:\x20PaperAI')?.["remove"]();
    let var2121 = param263.document.querySelector(".toolbar-button.toolbar-dropdown-button"),
      var2122 = var2121.cloneNode(true);
    var2122.id = "AI4Paper: PaperAI";
    var2122.title = 'AI\x20解读论文';
    var2122.disabled = false;
    var2122.setAttribute("class", 'toolbar-button\x20toolbar-dropdown-button\x20AI4Paper-Reader-Buttons');
    var2122.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgPaperAI + "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\" transform=\"translate(1,0)\" fill=\"#828282\"><path fill=\"#828282\" d=\"m0 2.707 4 4 4-4L7.293 2 4 5.293.707 2z\"></path></svg>";
    param264.parentNode.prepend(var2122);
    let var2123,
      var2124 = window.document.createXULElement("menupopup");
    var2124.id = "AI4Paper-ReaderButton-PaperAI-menupopup";
    var2124.addEventListener('popuphidden', () => {
      window.document.querySelector("#browser").querySelectorAll("#AI4Paper-ReaderButton-PaperAI-menupopup").forEach(_0x469f69 => _0x469f69.remove());
    });
    let var2125 = var2124.firstElementChild;
    while (var2125) {
      var2125.remove();
      var2125 = var2124.firstElementChild;
    }
    let var2126 = ["AI 解读论文 🔒", '论文深度解读\x20🔒', "论文简要剖析 🔒"];
    for (let var2127 of var2126) {
      var2123 = window.document.createXULElement('menuitem');
      var2123.value = var2127;
      var2123.label = var2127;
      var2123.setAttribute("tooltiptext", var2127);
      var2123.addEventListener("command", _0x2c344d => {
        Zotero.AI4Paper.onClickPaperAIButtonMenuItem(var2127);
      });
      var2124.appendChild(var2123);
    }
    let var2128 = Zotero.Prefs.get('ai4paper.chatgptprompttemplateuser'),
      var2129 = [];
    if (var2128 != '') {
      let var2130 = var2128.split('\x0a');
      for (let var2131 of var2130) {
        if (var2131 != '') {
          var2131 = var2131.trim();
          if (var2131.lastIndexOf('👈') === var2131.length - 0x2) {
            let _0x4955d8 = var2131.lastIndexOf('👈');
            if (var2131.lastIndexOf('👉') != -0x1) {
              let var2133 = var2131.lastIndexOf('👉'),
                var2134 = var2131.substring(var2133 + 0x2, _0x4955d8).trim();
              var2123 = window.document.createXULElement("menuitem");
              var2123.value = var2134;
              var2123.label = var2134;
              var2123.setAttribute('tooltiptext', var2131);
              var2123.addEventListener("command", _0x5118ac => {
                Zotero.AI4Paper.onClickPaperAIButtonMenuItem(var2134);
              });
              var2124.appendChild(var2123);
            } else {
              var2123 = window.document.createXULElement("menuitem");
              var2123.value = var2131;
              var2123.label = var2131;
              var2123.setAttribute("tooltiptext", var2131);
              var2123.addEventListener("command", _0x5d501c => {
                Zotero.AI4Paper.onClickPaperAIButtonMenuItem(var2131);
              });
              var2124.appendChild(var2123);
            }
          } else {
            var2123 = window.document.createXULElement("menuitem");
            var2123.value = var2131;
            var2123.label = var2131;
            var2123.setAttribute('tooltiptext', var2131);
            var2123.addEventListener("command", _0x1ce18e => {
              Zotero.AI4Paper.onClickPaperAIButtonMenuItem(var2131);
            });
            var2124.appendChild(var2123);
          }
        }
      }
    }
    var2122.addEventListener('click', _0x3190fa => {
      window.document.querySelector("#browser").querySelectorAll("#AI4Paper-ReaderButton-PaperAI-menupopup").forEach(_0x386299 => _0x386299.remove());
      window.document.querySelector("#browser")?.['appendChild'](var2124);
      var2124.openPopup(var2122, "after_start", 0x0, 0x0, false, false);
    });
    var2122.addEventListener("pointerdown", _0x4a0a60 => {
      if (_0x4a0a60.button === 0x2) {
        Zotero.AI4Paper.paperAI(false);
      }
    });
  },
  'onClickPaperAIButtonMenuItem': function (param265) {
    if (param265 === "AI 解读论文 🔒") {
      Zotero.AI4Paper.paperAI(false);
    } else {
      window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").value = param265;
      Zotero.Prefs.set('ai4paper.chatgptprompttemplate', param265);
      Zotero.AI4Paper.paperAI(true);
    }
  },
  'translateSelect': async function () {
    let var2135 = Zotero_Tabs._selectedID;
    var var2136 = Zotero.Reader.getByTabID(var2135);
    if (!var2136) {
      return false;
    }
    await var2136._initPromise;
    await var2136._waitForReader();
    !var2136.translateSelectTextInit && (var2136.translateSelectTextInit = true, var2136._iframeWindow.addEventListener("pointerup", ((_0x3cb9ae, _0x7396f7) => {
      return _0x5802f1 => {
        Zotero.AI4Paper.onSelectText(_0x5802f1, _0x3cb9ae, _0x7396f7);
      };
    })(var2136)));
  },
  'handlePointerup': function (param266) {
    let var2137 = Zotero.AI4Paper.getCurrentReader();
    var2137 && Zotero.AI4Paper.onSelectText(param266, var2137);
  },
  'getCurrentReader': function () {
    let var2138 = Zotero_Tabs._selectedID;
    var var2139 = Zotero.Reader.getByTabID(var2138);
    return var2139 || false;
  },
  'getReaderItemContentType': function (param267) {
    let var2140 = param267.itemID,
      var2141 = Zotero.Items.get(var2140);
    return var2141.attachmentContentType;
  },
  'CheckPDFReader': function () {
    let var2577 = Zotero_Tabs._selectedID;
    var var2578 = Zotero.Reader.getByTabID(var2577);
    return var2578 ? true : false;
  },
});
