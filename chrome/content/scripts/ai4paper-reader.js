// AI4Paper Reader Module - Reader/PDF-reader infrastructure: pane collapsing,
// reader cleanup, side pane creation, navigation, translate side pane UI,
// reader buttons, button state toggles, iframe/background events
Object.assign(Zotero.AI4Paper, {
  'collapseLeftSidePane': function () {
    let tabID7 = Zotero_Tabs._selectedID,
      reader8 = Zotero.Reader.getByTabID(tabID7);
    reader8 ? Zotero.AI4Paper.collapseReaderSideBar() : Zotero.AI4Paper.collapseCollectionPane_byShortCuts();
  },
  'collapseRightSidePane': function () {
    let tabID8 = Zotero_Tabs._selectedID,
      reader9 = Zotero.Reader.getByTabID(tabID8);
    if (reader9) {
      Zotero.AI4Paper.collapseReaderContextPane();
    } else Zotero.AI4Paper.collapseItemPane_byShortCuts();
  },
  'collapseReaderSideBar': function () {
    let tabID9 = Zotero_Tabs._selectedID,
      reader10 = Zotero.Reader.getByTabID(tabID9);
    if (!reader10) return;
    let iframeWin7 = reader10._iframeWindow,
      elem78 = iframeWin7.document.querySelector(".toolbar-button.sidebar-toggle");
    elem78 && elem78.click();
  },
  'collapseReaderContextPane': function () {
    let tabID10 = Zotero_Tabs._selectedID,
      reader11 = Zotero.Reader.getByTabID(tabID10);
    if (!reader11) return;
    let iframeWin8 = reader11._iframeWindow,
      local22;
    Zotero.AI4Paper.isZoteroVersion(0x7) ? local22 = iframeWin8.document.querySelector('.toolbar-button.context-pane-toggle') : local22 = window.document.querySelector('[data-l10n-id=\x22toggle-context-pane\x22]');
    local22 && local22.click();
  },
  'unregisterReaderButtons': function () {
    let local23 = Zotero.getMainWindow().Zotero_Tabs._tabs;
    for (let i5 of local23) {
      if (i5.id != 'zotero-pane') {
        let local2 = i5.id,
          reader = Zotero.Reader.getByTabID(local2);
        if (!reader) {
          continue;
        }
        const iframeWin = reader._iframeWindow.document;
        iframeWin.querySelectorAll(".AI4Paper-Reader-Buttons").forEach(el => el.remove());
        iframeWin.querySelectorAll(".divider-before-toolbarButton").forEach(el => el.remove());
        iframeWin.querySelectorAll('#AI4Paper-viewButton-imagesView').forEach(el => el.remove());
        Zotero.AI4Paper.removeReaderBackgroundColor(reader._iframeWindow);
      }
    }
  },
  'removeReaderPopupElements': function (param) {
    param.document.querySelectorAll(".ai4paper-popup-element").forEach(el => el.remove());
  },
  'removeReaderBackgroundColor': function (readerWin) {
    readerWin.document.querySelectorAll("iframe")[0x0]?.["contentWindow"]["document"]['head']["querySelectorAll"]("#eyes-protection-color")["forEach"](el => el.remove());
    readerWin.document.querySelectorAll("iframe")[0x1]?.["contentWindow"]["document"]['head']["querySelectorAll"]("#eyes-protection-color")["forEach"](el => el.remove());
  },
  'unregisterReaderSidePanes': function (readerWin2) {
    for (let i6 of readerWin2) {
      window.document.querySelector('.AI4Paper-' + i6 + "SidePane-vbox")?.["remove"]();
      window.document.querySelector("#ai4paper-window-" + i6 + "SidePane-button")?.["remove"]();
      window.document.querySelector("#ai4paper-notesSection-" + i6 + "SidePane-button")?.["remove"]();
    }
    readerWin2.length && (Zotero.AI4Paper.showZoteroNotesSection(), window.document.querySelectorAll(".AI4Paper-SidePane-vbox").forEach(el => el.hidden = true));
    if (!window.document.querySelector('.AI4Paper-SidePane-vbox')) {
      let elem79 = window.document.querySelector(".AI4Paper-Nav-Buttons-DIV"),
        elem80 = window.document.querySelector("[data-l10n-id=\"context-notes-search\"]");
      elem79?.["after"](elem80);
      elem79?.['remove']();
    }
  },
  'addReaderElementsOnStartup': async function () {
    if (Zotero_Tabs._selectedID == "zotero-pane") return;
    let local24 = 0x0;
    while (!Zotero.Reader.getByTabID(Zotero_Tabs._selectedID)) {
      if (local24 >= 0x5dc) {
        Zotero.debug('ZoteroOne:\x20Waiting\x20for\x20reader\x20failed');
        return;
      }
      await Zotero.Promise.delay(0x5);
      local24++;
    }
    let tabID11 = Zotero_Tabs._selectedID,
      reader12 = Zotero.Reader.getByTabID(tabID11);
    (Zotero.Prefs.get("ai4paper.translationreadersidepane") || Zotero.Prefs.get('ai4paper.gptviewReaderSidepane')) && Zotero.AI4Paper.addReaderSidePane(tabID11);
    Zotero.AI4Paper.addReaderButtonInit(reader12);
    Zotero.AI4Paper.addAnnotationButtonInit();
  },
  'addReaderSidePane': async function (tabID) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'))) return -0x1;
    const reader13 = Zotero.Reader.getByTabID(tabID);
    let result7 = Zotero.AI4Paper.betterURL();
    if (!reader13 || !result7) {
      return;
    }
    await Zotero.uiReadyPromise;
    await reader13._initPromise;
    await reader13._waitForReader();
    let local25 = 0x0;
    while (!window.document.querySelector("context-notes-list")) {
      if (local25 >= 0x1f4) {
        Zotero.debug("AI4Paper: Waiting for reader failed");
        return;
      }
      await Zotero.Promise.delay(0xa);
      local25++;
    }
    let elem81 = window.document.querySelector("context-notes-list");
    if (Zotero.Prefs.get("ai4paper.translationreadersidepane") && elem81 && !window.document.querySelector("#ai4paper-translate-readersidepane")) {
      let elem26 = window.document.createXULElement('iframe');
      elem26.id = 'ai4paper-translate-readersidepane';
      elem26.setAttribute("flex", '1');
      let local = window.screen.height >= 0x3e8 ? 0xa4 : 0xa0;
      elem26.style.minHeight = window.screen.height - local + 'px';
      elem26.src = "chrome://ai4paper/content/selectionDialog/translateSidePane.html";
      let elem2 = window.document.createXULElement("menupopup");
      for (let i7 of Object.keys(Zotero.AI4Paper.translationServiceList())) {
        let elem21 = window.document.createXULElement('menuitem');
        elem21.label = i7;
        elem2.appendChild(elem21);
      }
      let elem6 = window.document.createXULElement("checkbox");
      elem6.id = 'ai4paper-button-enable-auto-translate';
      elem6.setAttribute('label', "划词翻译");
      elem6.setAttribute("native", true);
      elem6.style.fontSize = "13px";
      elem6.addEventListener("command", evt => {
        Zotero.Prefs.set("ai4paper.selectedtexttransenable", evt.target.checked);
        Zotero.AI4Paper.updateReaderButtonStateInit();
        return;
      });
      let elem33 = window.document.createXULElement("checkbox");
      elem33.id = "ai4paper-button-enable-words-first";
      elem33.setAttribute("label", '查词');
      elem33.setAttribute("native", true);
      elem33.style.fontSize = "13px";
      elem33.addEventListener("command", evt => {
        Zotero.Prefs.set("ai4paper.translationvocabularyfirst", evt.target.checked);
        return;
      });
      let elem15 = window.document.createXULElement("checkbox");
      elem15.id = "ai4paper-button-enable-concat";
      elem15.setAttribute('label', '拼接');
      elem15.setAttribute("native", true);
      elem15.style.fontSize = "13px";
      elem15.addEventListener('command', evt => {
        Zotero.Prefs.set("ai4paper.translationcrossparagraphs", evt.target.checked);
        return;
      });
      let elem11 = window.document.createXULElement("menulist");
      elem11.id = "ai4paper-translate-engine-list";
      Zotero.AI4Paper.isZoteroVersion() ? (elem11.setAttribute("native", true), elem11.setAttribute('style', 'font-size:\x2013px;padding:\x203px;margin-right:\x2010px')) : elem11.setAttribute('style', "font-size: 13px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);border-radius: 5px;padding: 3px;margin-right: 10px");
      elem11.addEventListener("command", evt => {
        let local26 = evt.target.label;
        Zotero.Prefs.set('ai4paper.selectedtexttransengine', local26);
        return;
      });
      elem11.appendChild(elem2);
      let elem13 = window.document.createXULElement("hbox");
      elem13.setAttribute("align", "center");
      elem13.setAttribute("flex", '1');
      elem13.style.overflowX = "hidden";
      elem13.appendChild(elem11);
      elem13.appendChild(elem6);
      elem13.appendChild(elem33);
      elem13.appendChild(elem15);
      let elem14 = window.document.createXULElement("div");
      elem14.setAttribute('style', "display: block;height: 5px;");
      elem14.style.overflowY = "hidden";
      let elem27 = window.document.createElement("input");
      elem27.setAttribute('type', "text");
      elem27.id = "navigator-translateSidePane";
      elem27.style.opacity = 0x0;
      elem14.appendChild(elem27);
      let elem12 = window.document.createXULElement("vbox");
      elem12.setAttribute('class', 'zotero-box\x20AI4Paper-translateSidePane-vbox\x20AI4Paper-SidePane-vbox');
      elem12.appendChild(elem14);
      elem12.appendChild(elem13);
      elem12.appendChild(elem26);
      elem81.prepend(elem12);
      Zotero.AI4Paper.addSidePaneNavButtons_Window("translate");
    }
    if (Zotero.Prefs.get("ai4paper.gptviewReaderSidepane") && elem81 && !window.document.querySelector('#ai4paper-chatgpt-readersidepane')) {
      let elem82 = window.document.createXULElement("iframe");
      elem82.id = "ai4paper-chatgpt-readersidepane";
      elem82.setAttribute("flex", '1');
      elem82.style.minHeight = Zotero.AI4Paper.calculate_iframeHeight() + 'px';
      Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? elem82.src = 'chrome://ai4paper/content/selectionDialog/gptChatUI.html' : elem82.src = "chrome://ai4paper/content/selectionDialog/gptReaderSidePane.html";
      let elem83 = window.document.createXULElement('div');
      elem83.classList.add("container-section");
      elem83.setAttribute("style", 'display:\x20block;height:\x205px;');
      elem83.style.overflowY = "hidden";
      let elem84 = window.document.createElement('input');
      elem84.setAttribute("type", "text");
      elem84.id = 'navigator-gptSidePane';
      elem84.style.opacity = 0x0;
      elem83.appendChild(elem84);
      let elem85 = window.document.createXULElement("vbox");
      elem85.setAttribute("class", "zotero-box AI4Paper-gptSidePane-vbox AI4Paper-SidePane-vbox");
      elem85.appendChild(elem83);
      let elem86 = window.document.createElement("div");
      elem86.classList.add('container-section');
      elem86.style.display = "flex";
      elem86.style.justifyContent = "space-between";
      elem86.style.alignItems = "center";
      elem86.style.marginTop = '5px';
      elem86.style.marginBottom = '5px';
      elem86.style.marginRight = '5px';
      elem86.style.marginLeft = "5px";
      let elem87 = window.document.createXULElement('hbox');
      elem87.setAttribute("align", "center");
      elem87.style.overflowX = "hidden";
      function localFn(button) {
        button.style.marginRight = "6px";
        button.style.width = "16px";
        button.style.height = "16px";
        button.style.padding = "4px 4px";
        button.style.borderRadius = '6px';
        button.onmouseover = function () {
          let isDark = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")["matches"],
            local4 = !isDark ? "#e6e6e6" : "#474747";
          this.style.backgroundColor = local4;
        };
        button.onmouseout = function () {
          this.style.backgroundColor = '';
        };
      }
      let elem88 = window.document.createElement("div");
      elem88.id = "chatgpt-readerSidePane-clear-icon";
      elem88.innerHTML = Zotero.AI4Paper.svg_icon_16px.addNewChat;
      elem88.title = "创建新对话";
      localFn(elem88);
      elem88.addEventListener('click', evt => {
        Zotero.AI4Paper.gptReaderSidePane_clearChat();
      });
      elem87.appendChild(elem88);
      let elem89 = window.document.createElement("div");
      elem89.id = "chatgpt-readerSidePane-aiAnalysis-icon";
      elem89.innerHTML = Zotero.AI4Paper.svg_icon_16px.ai_16px;
      elem89.title = "AI 分析";
      localFn(elem89);
      elem89.onclick = evt => {
        Zotero.AI4Paper.createPopup_chatBtn_aiAnalysis(elem89);
      };
      elem87.appendChild(elem89);
      let elem90 = window.document.createElement("div");
      elem90.id = "chatgpt-readerSidePane-fulltext-icon";
      elem90.innerHTML = Zotero.AI4Paper.svg_icon_16px.fulltext;
      elem90.title = "导入 PDF 全文";
      localFn(elem90);
      elem90.addEventListener('click', evt => {
        Zotero.AI4Paper.gptReaderSidePane_getFullText();
      });
      elem90.addEventListener("pointerdown", evt => {
        evt.button == 0x2 && Zotero.AI4Paper.aiAnalysis_PDFsFromSelection();
      }, false);
      elem87.appendChild(elem90);
      let elem91 = window.document.createElement("div");
      elem91.id = 'chatgpt-readerSidePane-abstract-icon';
      elem91.innerHTML = Zotero.AI4Paper.svg_icon_16px.abstract;
      elem91.title = "导入摘要";
      localFn(elem91);
      elem91.addEventListener("click", evt => {
        Zotero.AI4Paper.gptReaderSidePane_getAbstract();
      });
      elem87.appendChild(elem91);
      let elem92 = window.document.createElement("div");
      elem92.id = 'chatgpt-readerSidePane-addtonote-icon';
      elem92.innerHTML = Zotero.AI4Paper.svg_icon_16px.addGPTNote;
      elem92.title = "添加到笔记";
      localFn(elem92);
      elem92.addEventListener('click', evt => {
        !Zotero.Prefs.get('ai4paper.gptContinuesChatMode') && Zotero.AI4Paper.gptReaderSidePane_addChatGPTNoteInit();
      });
      elem87.appendChild(elem92);
      let elem93 = window.document.createElement("div");
      elem93.id = "chatgpt-readerSidePane-importAIReading-icon";
      elem93.innerHTML = Zotero.AI4Paper.svg_icon_16px.importAIReading;
      elem93.title = "导入外部【AI 文献解读】笔记";
      localFn(elem93);
      elem93.addEventListener("click", evt => {
        Zotero.AI4Paper.openDialogByType_modal("importAIReading");
      });
      elem93.addEventListener("pointerdown", evt => {
        evt.button == 0x2 && Zotero.AI4Paper.importChat(true);
      }, false);
      elem87.appendChild(elem93);
      let elem94 = window.document.createElement("div");
      elem94.id = "chatgpt-readerSidePane-locateAIReadingNotes-icon";
      elem94.innerHTML = Zotero.AI4Paper.svg_icon_16px.locateAIReadingNotes;
      elem94.title = "定位 Obsidian【AI 文献解读】笔记";
      localFn(elem94);
      elem94.addEventListener("mousedown", evt => {
        if (evt.button === 0x0) Zotero.AI4Paper.createPopup_chatBtn_locateAIReadingNotes(elem94);else evt.button === 0x2 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_locateAIReadingNotes();
      });
      elem87.appendChild(elem94);
      let elem95 = window.document.createElement("div");
      elem95.id = "chatgpt-readerSidePane-prefs-icon";
      elem95.innerHTML = Zotero.AI4Paper.svg_icon_16px.prefs_16px;
      elem95.title = "GPT 侧边栏设置";
      localFn(elem95);
      elem95.addEventListener("click", evt => {
        Zotero.AI4Paper.openDialogByType("gptReaderSidePanePrefs");
      });
      elem87.appendChild(elem95);
      let elem96 = window.document.createElement("div");
      elem96.id = 'chatgpt-readerSidePane-send-icon';
      elem96.innerHTML = Zotero.AI4Paper.svg_icon_20px.send;
      elem96.title = '发送';
      elem96.hidden = Zotero.Prefs.get("ai4paper.gptContinuesChatMode");
      elem96.style.marginRight = '13px';
      elem96.style.width = "20px";
      elem96.style.height = '20px';
      elem96.style.padding = "4px 4px";
      elem96.style.borderRadius = "6px";
      elem96.onmouseover = function () {
        let isDark2 = Zotero.getMainWindow()?.['matchMedia']('(prefers-color-scheme:\x20dark)')["matches"],
          local27 = !isDark2 ? '#e6e6e6' : "#545454";
        this.style.backgroundColor = local27;
      };
      elem96.onmouseout = function () {
        this.style.backgroundColor = '';
      };
      elem96.onclick = () => Zotero.AI4Paper.gptReaderSidePane_send();
      elem86.appendChild(elem87);
      elem86.appendChild(elem96);
      elem85.appendChild(elem86);
      let elem97 = window.document.createXULElement("div");
      elem97.id = "chatgpt-readerSidePane-user-icon";
      elem97.innerHTML = Zotero.AI4Paper.svg_icon_20px.user;
      elem97.style.transform = "scale(1.2)";
      elem97.setAttribute("tooltiptext", Zotero.Prefs.get('ai4paper.gptContinuesChatMode') ? "复位提问模板" : "清空问答区");
      elem97.style.display = 'flex';
      elem97.style.marginLeft = "5px";
      elem97.style.marginRight = "5px";
      elem97.addEventListener("click", evt => {
        if (evt.shiftKey || evt.button === 0x2) {
          Zotero.AI4Paper.copy2Clipboard(Zotero.AI4Paper.getSelectedPromptFromList());
          Zotero.AI4Paper.showProgressWindow(0x7d0, '✅\x20提示词已拷贝【Zotero\x20One】', "成功拷贝选中的提示词。");
          return;
        }
        Zotero.AI4Paper.gptReaderSidePane_clearPrompt();
      });
      let elem98 = window.document.createXULElement('menupopup');
      elem98.style.width = "30%";
      elem98.id = "ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template";
      let elem99 = window.document.createXULElement('menuitem');
      elem99.label = '无';
      elem99.value = '无';
      elem99.setAttribute("tooltiptext", '无');
      elem98.appendChild(elem99);
      let elem100 = window.document.createXULElement("menulist");
      elem100.id = "ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist";
      if (Zotero.AI4Paper.isZoteroVersion()) {
        elem100.setAttribute('native', true);
        elem100.setAttribute("style", "width: 85%;font-size: 13px;padding: 3px;margin-right: 10px");
      } else {
        elem100.setAttribute("style", "width: 85%;font-size: 13px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);border-radius: 5px;padding: 3px;margin-right: 10px");
      }
      elem100.addEventListener("command", evt => {
        Zotero.Prefs.set('ai4paper.chatgptprompttemplate', evt.target.label);
        return;
      });
      elem100.appendChild(elem98);
      elem86 = window.document.createElement("div");
      elem86.classList.add("container-section");
      elem86.style.display = "flex";
      elem86.style.alignItems = "center";
      elem86.style.marginBottom = "3px";
      elem86.appendChild(elem97);
      elem86.appendChild(elem100);
      elem85.appendChild(elem86);
      elem85.appendChild(elem82);
      elem86 = window.document.createElement("div");
      elem86.classList.add("container-section");
      elem86.style.display = "flex";
      elem86.style.justifyContent = 'space-between';
      elem86.style.alignItems = "center";
      elem86.style.marginTop = "5px";
      elem86.style.marginBottom = '20px';
      elem86.style.marginRight = '8px';
      elem86.style.marginLeft = "5px";
      elem86.style.paddingLeft = '1px';
      elem86.style.paddingRight = "0px";
      elem86.style.paddingTop = "3px";
      elem86.style.paddingBottom = '3px';
      elem86.style.borderRadius = '6px';
      elem86.style.boxShadow = "0 0 1px #8a8a8a";
      let elem101 = window.document.createXULElement("label");
      elem101.value = "服务:";
      elem86.appendChild(elem101);
      elem98 = window.document.createXULElement("menupopup");
      elem98.id = "ai4paper-chatgpt-readerSidePane-chatgpt-service";
      for (let i8 of Object.keys(Zotero.AI4Paper.gptServiceList())) {
        let elem102 = window.document.createXULElement("menuitem");
        elem102.label = i8;
        elem102.value = i8;
        elem102.setAttribute('tooltiptext', i8);
        Zotero.AI4Paper.gptReaderSidePane_setServiceTooltiptext(elem102, i8);
        elem98.appendChild(elem102);
      }
      elem100 = window.document.createXULElement("menulist");
      elem100.id = "ai4paper-chatgpt-readerSidePane-chatgpt-service-menulist";
      if (Zotero.AI4Paper.isZoteroVersion()) {
        elem100.setAttribute("native", true);
        elem100.setAttribute("style", "width: 30%;font-size: 11px;padding: 3px;margin-right: 10px");
      } else {
        elem100.setAttribute("style", "width: 30%;font-size: 11px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);border-radius: 5px;padding: 3px;margin-right: 10px");
      }
      elem100.addEventListener("command", evt => {
        Zotero.Prefs.set("ai4paper.gptservice", evt.target.label);
        return;
      });
      elem100.appendChild(elem98);
      elem86.appendChild(elem100);
      elem101 = window.document.createXULElement("label");
      elem101.value = "模型:";
      elem86.appendChild(elem101);
      elem98 = window.document.createXULElement("menupopup");
      elem98.id = "ai4paper-chatgpt-readerSidePane-chatgpt-model";
      for (let i9 of Zotero.AI4Paper.gptModelList) {
        let elem103 = window.document.createXULElement('menuitem');
        elem103.label = i9;
        elem103.value = i9;
        elem103.setAttribute("tooltiptext", i9);
        elem98.appendChild(elem103);
      }
      elem100 = window.document.createXULElement("menulist");
      elem100.id = "ai4paper-chatgpt-readerSidePane-chatgpt-model-menulist";
      Zotero.AI4Paper.isZoteroVersion() ? (elem100.setAttribute("native", true), elem100.setAttribute("style", "width: 50%;font-size: 11px;padding: 3px;margin-right: 10px")) : elem100.setAttribute('style', 'width:\x2050%;font-size:\x2011px;box-shadow:\x200\x200\x201px\x20rgba(0,\x200,\x200,\x200.5);border-radius:\x205px;padding:\x203px;margin-right:\x2010px');
      elem100.addEventListener('command', evt => {
        Zotero.Prefs.set('ai4paper.gptmodel', evt.target.label);
        return;
      });
      elem100.appendChild(elem98);
      elem86.appendChild(elem100);
      elem85.appendChild(elem86);
      let elem104 = window.document.querySelector(".AI4Paper-translateSidePane-vbox");
      elem104 ? elem104.after(elem85) : elem81.prepend(elem85);
      Zotero.AI4Paper.addSidePaneNavButtons_Window("gpt");
      if (Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_changeUILayout();
      }
    }
    Zotero.AI4Paper.clickEventListner_SideNavNotes('add');
    let elem105 = window.document.querySelectorAll(".AI4Paper-SidePane-vbox");
    elem105.length && (Zotero.AI4Paper.addSidePaneNavButtons_NotesSection(elem105[elem105.length - 0x1]), Zotero.AI4Paper.hiddenZoteroNotesSection());
    Zotero.AI4Paper.autoFocusReaderSidePane();
  },
  'autoFocusReaderSidePane': function () {
    let tabID12 = Zotero_Tabs._selectedID;
    const reader14 = Zotero.Reader.getByTabID(tabID12);
    if (!reader14) return;
    let elem106 = window.document.querySelector(".notes-pane-deck"),
      local28 = elem106?.["parentNode"];
    if (elem106 && local28) {
      let prefVal2 = Zotero.Prefs.get("ai4paper.autofocussidepane");
      if (prefVal2 === '翻译' && window.document.querySelector(".AI4Paper-translateSidePane-vbox")) {
        if (local28.getAttribute("selectedIndex") === 0x1 && elem106.selectedPanel.getAttribute("selectedIndex") === 0x0 && !window.document.querySelector(".AI4Paper-translateSidePane-vbox").hidden) {
          return;
        }
        Zotero.AI4Paper.focusReaderSidePane('translate');
      } else {
        if (prefVal2 === "GPT" && window.document.querySelector(".AI4Paper-gptSidePane-vbox")) {
          if (local28.getAttribute("selectedIndex") === 0x1 && elem106.selectedPanel.getAttribute("selectedIndex") === 0x0 && !window.document.querySelector(".AI4Paper-gptSidePane-vbox").hidden) return;
          Zotero.AI4Paper.focusReaderSidePane("gpt");
        }
      }
    }
  },
  'addSidePaneNavButtons_NotesSection': function (lastSidePaneVbox) {
    if (!window.document.querySelector(".AI4Paper-Nav-Buttons-DIV")) {
      let elem107 = window.document.querySelector("[data-l10n-id=\"context-notes-search\"]"),
        local29,
        elem108 = window.document.createElement("div");
      elem108.setAttribute('class', 'AI4Paper-Nav-Buttons-DIV');
      elem108.style.display = "flex";
      elem108.style.justifyContent = "center";
      elem108.style.alignItems = "center";
      elem108.style.marginTop = '5px';
      elem108.style.marginBottom = "5px";
      elem108.style.marginRight = "8px";
      elem108.style.marginLeft = "5px";
      elem108.style.paddingLeft = "1px";
      elem108.style.paddingRight = "0px";
      elem108.style.paddingTop = '3px';
      elem108.style.paddingBottom = "3px";
      window.document.querySelector(".AI4Paper-translateSidePane-vbox") && !window.document.querySelector("#ai4paper-notesSection-translateSidePane-button") && (local29 = window.document.createElement('button'), local29.id = 'ai4paper-notesSection-translateSidePane-button', local29.setAttribute('class', "AI4Paper-Window-Button"), local29.textContent = '翻译', local29.style.marginLeft = '5px', local29.style.marginRight = "5px", local29.onclick = () => {
        Zotero.AI4Paper.expandReaderContextPane();
        Zotero.AI4Paper.focusReaderSidePane("translate");
      }, local29.addEventListener('contextmenu', () => {
        Zotero.AI4Paper.openDialogByType('translateSidePanePrefs');
      }, false), elem108.appendChild(local29));
      window.document.querySelector(".AI4Paper-gptSidePane-vbox") && !window.document.querySelector("#ai4paper-notesSection-gptSidePane-button") && (local29 = window.document.createElement("button"), local29.id = 'ai4paper-notesSection-gptSidePane-button', local29.setAttribute("class", "AI4Paper-Window-Button"), local29.textContent = "GPT", local29.style.marginLeft = "5px", local29.style.marginRight = '5px', local29.onclick = evt => {
        evt.shiftKey ? Zotero.AI4Paper.gptReaderSidePane_ChatMode_scrollBottom() : (Zotero.AI4Paper.expandReaderContextPane(), Zotero.AI4Paper.focusReaderSidePane("gpt"));
      }, local29.addEventListener('contextmenu', () => {
        Zotero.AI4Paper.openDialogByType("gptReaderSidePanePrefs");
      }, false), elem108.appendChild(local29));
      local29 = window.document.createElement("button");
      local29.id = "ai4paper-notesSection-notes-button";
      local29.setAttribute("class", "AI4Paper-Window-Button");
      local29.textContent = '笔记';
      local29.title = '右击已返回上次打开的笔记';
      local29.style.marginLeft = '5px';
      local29.style.marginRight = '5px';
      local29.onclick = () => {
        Zotero.AI4Paper._notesNavButtonClicked = true;
        Zotero.AI4Paper.showZoteroNotesSection();
        window.document.querySelectorAll(".AI4Paper-SidePane-vbox").forEach(el => el.hidden = true);
        let elem32 = window.document.querySelector("[data-pane=\"context-all-notes\"]")?.["querySelector"](".twisty");
        elem32?.["focus"]();
        elem32.scrollIntoView({
          'behavior': "smooth",
          'block': "center"
        });
      };
      local29.addEventListener("contextmenu", () => {
        let elem109 = window.document.querySelector("context-notes-list");
        elem109 && elem109.querySelectorAll("note-row").forEach(el => {
          if (el.note && el.note.id && Zotero.AI4Paper._noteItem_ReturnButtonClick) {
            let item = Zotero.Items.get(el.note.id);
            item && item.key === Zotero.AI4Paper._noteItem_ReturnButtonClick.key && el.click();
          }
        });
      }, false);
      elem108.appendChild(local29);
      elem107?.['after'](elem108);
      lastSidePaneVbox?.["parentNode"]["insertBefore"](elem107, lastSidePaneVbox.nextSibling);
    } else {
      let elem110 = window.document.querySelector(".AI4Paper-Nav-Buttons-DIV");
      if (window.document.querySelector(".AI4Paper-translateSidePane-vbox") && !window.document.querySelector("#ai4paper-notesSection-translateSidePane-button")) {
        let elem4 = window.document.createElement("button");
        elem4.id = 'ai4paper-notesSection-translateSidePane-button';
        elem4.setAttribute('class', "AI4Paper-Window-Button");
        elem4.textContent = '翻译';
        elem4.style.marginLeft = "5px";
        elem4.style.marginRight = '5px';
        elem4.onclick = () => {
          Zotero.AI4Paper.expandReaderContextPane();
          Zotero.AI4Paper.focusReaderSidePane("translate");
        };
        elem110.prepend(elem4);
      }
      if (window.document.querySelector('.AI4Paper-gptSidePane-vbox') && !window.document.querySelector("#ai4paper-notesSection-gptSidePane-button")) {
        let elem111 = window.document.createElement("button");
        elem111.id = "ai4paper-notesSection-gptSidePane-button";
        elem111.setAttribute("class", 'AI4Paper-Window-Button');
        elem111.textContent = "GPT";
        elem111.style.marginLeft = "5px";
        elem111.style.marginRight = "5px";
        elem111.onclick = () => {
          Zotero.AI4Paper.expandReaderContextPane();
          Zotero.AI4Paper.focusReaderSidePane("gpt");
        };
        let elem112 = window.document.querySelector("#ai4paper-notesSection-translateSidePane-button");
        elem112 ? elem112.after(elem111) : elem110.prepend(elem111);
      }
    }
  },
  'addSidePaneNavButtons_Window': function (paneType) {
    let elem113 = window.document.querySelector('#zotero-tb-tabs-menu');
    if (elem113) {
      if (paneType === 'translate' && !window.document.querySelector('#ai4paper-window-translateSidePane-button')) {
        let clone3 = elem113.cloneNode(true);
        clone3.id = 'ai4paper-window-translateSidePane-button';
        clone3.setAttribute("command", '');
        clone3.setAttribute("oncommand", '');
        clone3.setAttribute("class", 'zotero-tb-button\x20AI4Paper-Window-Button');
        clone3.setAttribute("tooltiptext", '翻译侧边栏');
        clone3.setAttribute("data-l10n-id", '');
        clone3.innerHTML = Zotero.AI4Paper.svg_icon_20px.translationreadersidepane;
        clone3.onclick = () => {
          Zotero.AI4Paper.expandReaderContextPane();
          Zotero.AI4Paper.focusReaderSidePane("translate");
        };
        let elem25 = window.document.querySelector('#ai4paper-window-gptSidePane-button');
        if (elem25) {
          elem25.before(clone3);
        } else {
          elem113.before(clone3);
        }
      } else {
        if (paneType === 'gpt' && !window.document.querySelector('#ai4paper-window-gptSidePane-button')) {
          let clone7 = elem113.cloneNode(true);
          clone7.id = "ai4paper-window-gptSidePane-button";
          clone7.setAttribute("command", '');
          clone7.setAttribute("oncommand", '');
          clone7.setAttribute("class", "zotero-tb-button AI4Paper-Window-Button");
          clone7.setAttribute("tooltiptext", "GPT 侧边栏");
          clone7.setAttribute("data-l10n-id", '');
          clone7.innerHTML = Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
          clone7.onclick = evt => {
            if (evt.button == 0x2) {
              Zotero.AI4Paper.openDialogByType("chatHistory", true);
              return;
            }
            if (evt.shiftKey) {
              Zotero.AI4Paper.openDialogByType("batchAIInterpret", true);
              return;
            }
            Zotero.AI4Paper.expandReaderContextPane();
            Zotero.AI4Paper.focusReaderSidePane("gpt");
          };
          let elem114 = window.document.querySelector('#ai4paper-window-translateSidePane-button');
          elem114 ? elem114.after(clone7) : elem113.before(clone7);
        }
      }
    }
  },
  'focusReaderSidePane': async function (sidePaneType) {
    try {
      if (sidePaneType) {
        if (Zotero_Tabs._selectedID === 'zotero-pane') try {
          Zotero.getMainWindow().Zotero_Tabs._tabs.length > 0x1 && (Zotero_Tabs.select(Zotero.getMainWindow().Zotero_Tabs._tabs[0x1].id, true), await Zotero.Promise.delay(0x14));
        } catch (e) {
          Zotero.debug(e);
        }
        let elem8 = window.document.querySelector(".notes-pane-deck"),
          local7 = elem8.parentNode;
        if (elem8 && local7) {
          if (elem8.selectedPanel.selectedIndex != 0x0) {
            local7.selectedIndex = 0x1;
            let local30 = Services.wm.getMostRecentWindow("navigator:browser"),
              local31 = local30.ZoteroContextPane.activeEditor;
            if (local31) {
              Zotero.AI4Paper._noteItem_ReturnButtonClick = local31.item;
            }
          }
        }
        Zotero.AI4Paper.selectNotesListPane();
        let doc = window.document.getElementById("navigator-" + sidePaneType + "SidePane");
        if (doc) {
          window.document.querySelector(".AI4Paper-" + sidePaneType + "SidePane-vbox").hidden = false;
          let local32 = sidePaneType === 'translate' ? "gpt" : "translate",
            elem115 = window.document.querySelector(".AI4Paper-" + local32 + "SidePane-vbox");
          elem115 && (elem115.hidden = true);
          doc.focus();
          doc.scrollIntoView({
            'behavior': "smooth",
            'block': "start"
          });
          Zotero.AI4Paper.hiddenZoteroNotesSection();
        }
      }
    } catch (e) {
      window.alert(e);
    }
  },
  'addEventListener_focusZoteroContextAllNotes': async function () {
    let elem116 = window.document.querySelectorAll("[data-l10n-id=\"sidenav-notes\"][data-pane=\"context-notes\"][tooltiptext=\"Notes\"]")[0x1];
    elem116 && !elem116.getAttribute('clickEventListner_added') && (elem116.setAttribute("clickEventListner_added", true), elem116.addEventListener('mousedown', function (arg) {
      if (arg.button === 0x2) {
        let local33 = Services.wm.getMostRecentWindow("navigator:browser");
        if (local33.ZoteroContextPane.activeEditor) {
          let elem18 = window.document.querySelector(".zotero-tb-note-return");
          elem18?.["click"]();
        }
        let elem117 = window.document.querySelector('[data-pane=\x22context-all-notes\x22]').querySelector(".twisty");
        elem117 && (Zotero.AI4Paper.showZoteroNotesSection(), window.document.querySelectorAll('.AI4Paper-SidePane-vbox').forEach(el => el.hidden = true), elem117.focus(), elem117.scrollIntoView({
          'behavior': "smooth",
          'block': 'center'
        }));
      }
    }, false));
  },
  'clickEventListner_SideNavNotes': function (action) {
    if (action === "add" && !Zotero.AI4Paper._pointerdownHandler_SideNavNotes) {
      Zotero.AI4Paper._pointerdownHandler_SideNavNotes = function (arg2) {
        if (arg2.button === 0x0 && arg2.target) {
          if (arg2.target.getAttribute("data-l10n-id") === 'sidenav-notes' && arg2.target.getAttribute("data-pane") === "context-notes") {
            if (arg2.target.closest("#zotero-context-pane-sidenav")) {
              Zotero.AI4Paper._notesNavButtonClicked = true;
              Zotero.AI4Paper.showZoteroNotesSection();
              let arr3 = ["translate", 'gpt'];
              for (let i10 of arr3) {
                let elem118 = window.document.querySelector('.AI4Paper-' + i10 + "SidePane-vbox");
                elem118 && (elem118.hidden = true);
              }
            }
          }
        }
      };
      window.document.addEventListener('pointerdown', Zotero.AI4Paper._pointerdownHandler_SideNavNotes);
    } else action === "remove" && window.document.removeEventListener("pointerdown", Zotero.AI4Paper._pointerdownHandler_SideNavNotes);
    if (action === "add" && !Zotero.AI4Paper._mousedownHandler_ReturnButton) {
      Zotero.AI4Paper._mousedownHandler_ReturnButton = function (evt) {
        if (evt.button === 0x0 && evt.target) {
          if (evt.target.classList.contains('zotero-tb-note-return')) {
            let local34 = Services.wm.getMostRecentWindow("navigator:browser");
            if (local34?.['ZoteroContextPane']["activeEditor"]) {
              Zotero.AI4Paper._noteItem_ReturnButtonClick = local34.ZoteroContextPane.activeEditor.item;
            }
          }
        }
      };
      window.document.addEventListener("mousedown", Zotero.AI4Paper._mousedownHandler_ReturnButton);
    } else action === "remove" && window.document.removeEventListener('mousedown', Zotero.AI4Paper._mousedownHandler_ReturnButton);
  },
  'showZoteroNotesSection': function () {
    let elem119 = window.document.querySelector("context-notes-list");
    elem119?.["childNodes"]["forEach"](el => {
      !el.classList.contains('AI4Paper-SidePane-vbox') && (el.hidden = false);
    });
    if (elem119) {
      elem119.parentNode.style.overflowY = "auto";
    }
  },
  'hiddenZoteroNotesSection': async function () {
    let elem120 = window.document.querySelector("context-notes-list");
    elem120?.["childNodes"]["forEach"](el => {
      !el.classList.contains("AI4Paper-SidePane-vbox") && (el.hidden = true);
    });
    if (elem120) {
      elem120.parentNode.style.overflowY = "hidden";
    }
    Zotero.AI4Paper._notesNavButtonClicked = false;
    let local35 = 0x0,
      local36 = false;
    while (!local36) {
      if (local35 >= 0x1f4) {
        Zotero.debug("AI4Paper: 非启动时加载笔记列表。");
        return;
      }
      elem120 = window.document.querySelector("context-notes-list");
      elem120.childNodes.forEach(el => {
        if (el.classList) {
          if (!el.classList.contains("AI4Paper-SidePane-vbox") && !el.hidden) {
            !Zotero.AI4Paper._notesNavButtonClicked && (el.hidden = true, local36 = true);
          }
        }
      });
      await Zotero.Promise.delay(0xa);
      local35++;
    }
  },
  'selectNotesListPane': function () {
    let elem121 = window.document.querySelector('.notes-pane-deck'),
      local37 = elem121.parentNode;
    local37.selectedIndex = 0x1;
    elem121.selectedPanel.selectedIndex = 0x0;
  },
  'expandReaderContextPane': function () {
    let tabID13 = Zotero_Tabs._selectedID;
    var reader15 = Zotero.Reader.getByTabID(tabID13);
    if (!reader15) return;
    let iframeWin9 = reader15._iframeWindow;
    window.document.getElementById('zotero-context-pane').collapsed && iframeWin9.document.querySelector('.context-pane-toggle')?.["click"]();
  },
  'gptReaderSidePane_recordScrollTop': function (tabID) {
    try {
      let result8 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
      if (!result8) return false;
      const doc12 = result8.document.getElementById("chat-container");
      if (tabID === "zotero-pane") {
        result8._savedContScrollTop = '' + Zotero.AI4Paper._savedContScrollTop;
        result8._marker4ScrollTop = true;
      } else !result8._gptStreamRunning && result8._marker4ScrollTop && (Zotero.AI4Paper.updateChatGPTReaderSidePane(), doc12.scrollTop = result8._savedContScrollTop, result8._marker4ScrollTop = false);
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'updateTranslateReaderSidePane': function () {
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      return false;
    }
    var local38;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) {
      local38 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;
    } else return false;
    if (!local38) {
      return;
    }
    window.document.querySelector("#ai4paper-translate-engine-list").selectedIndex = Object.keys(Zotero.AI4Paper.translationServiceList()).indexOf(Zotero.Prefs.get("ai4paper.selectedtexttransengine"));
    window.document.querySelector("#ai4paper-button-enable-auto-translate").checked = Zotero.Prefs.get("ai4paper.selectedtexttransenable");
    window.document.querySelector("#ai4paper-button-enable-words-first").checked = Zotero.Prefs.get("ai4paper.translationvocabularyfirst");
    window.document.querySelector('#ai4paper-button-enable-concat').checked = Zotero.Prefs.get('ai4paper.translationcrossparagraphs');
    local38.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = Zotero.AI4Paper.translateSourceText;
    local38.document.getElementById("ai4paper-translate-readerSidePane-response").value = Zotero.AI4Paper.translateResponse;
    local38.document.getElementById('ai4paper-translate-readerSidePane-sourcetext').style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    local38.document.getElementById("ai4paper-translate-readerSidePane-response").style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    local38.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.lineHeight = Zotero.Prefs.get('ai4paper.translatesidepanelineheight');
    local38.document.getElementById("ai4paper-translate-readerSidePane-response").style.lineHeight = Zotero.Prefs.get("ai4paper.translatesidepanelineheight");
    if (Zotero.AI4Paper.vocabularyreviewmode === 'true') {
      local38.document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review").checked = true;
      local38.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = "inline";
      local38.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = "inline";
      Zotero.Prefs.get('ai4paper.vocabularyreviewgiveinterpretation') ? local38.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = "none" : local38.document.getElementById('ai4paper-translate-readerSidePane-vocabulary-interpretation').style.display = "inline";
    } else {
      local38.document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review").checked = false;
      local38.document.getElementById('ai4paper-translate-readerSidePane-vocabulary-next').style.display = 'none';
      local38.document.getElementById('ai4paper-translate-readerSidePane-vocabulary-interpretation').style.display = "none";
      local38.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = "none";
    }
    Zotero.AI4Paper.translateReaderSidePane_exchangeSourceResponseArea();
  },
  'initTranslateReaderSidePane': function () {
    let tabID14 = Zotero_Tabs._selectedID;
    const reader16 = Zotero.Reader.getByTabID(tabID14);
    if (!reader16) {
      return;
    }
    if (!Zotero.Prefs.get('ai4paper.translationreadersidepane')) return false;
    var local39;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) local39 = window.document.getElementById('ai4paper-translate-readersidepane').contentWindow;else return false;
    if (!local39) return;
    window.document.querySelector("#ai4paper-translate-engine-list").selectedIndex = Object.keys(Zotero.AI4Paper.translationServiceList()).indexOf(Zotero.Prefs.get('ai4paper.selectedtexttransengine'));
    window.document.querySelector("#ai4paper-button-enable-auto-translate").checked = Zotero.Prefs.get("ai4paper.selectedtexttransenable");
    window.document.querySelector("#ai4paper-button-enable-words-first").checked = Zotero.Prefs.get("ai4paper.translationvocabularyfirst");
    window.document.querySelector("#ai4paper-button-enable-concat").checked = Zotero.Prefs.get("ai4paper.translationcrossparagraphs");
    local39.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = Zotero.AI4Paper.translateSourceText;
    local39.document.getElementById('ai4paper-translate-readerSidePane-response').value = Zotero.AI4Paper.translateResponse;
    local39.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    local39.document.getElementById('ai4paper-translate-readerSidePane-response').style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    Zotero.AI4Paper.vocabularyreviewmode === "true" ? (local39.document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review").checked = true, local39.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = "inline", local39.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = "inline", Zotero.Prefs.get("ai4paper.vocabularyreviewgiveinterpretation") ? local39.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = 'none' : local39.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = "inline") : (local39.document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review").checked = false, local39.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = 'none', local39.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = "none", local39.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = 'none');
  },
  'refreshTranslateReaderSidePane': function () {
    let tabID15 = Zotero_Tabs._selectedID;
    const reader17 = Zotero.Reader.getByTabID(tabID15);
    if (!reader17) return;
    if (!Zotero.Prefs.get('ai4paper.translationreadersidepane')) return false;
    var local40;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) {
      local40 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;
    } else {
      return false;
    }
    if (!local40) return;
    window.document.querySelector('#ai4paper-translate-engine-list').selectedIndex = Object.keys(Zotero.AI4Paper.translationServiceList()).indexOf(Zotero.Prefs.get("ai4paper.selectedtexttransengine"));
    window.document.querySelector("#ai4paper-button-enable-auto-translate").checked = Zotero.Prefs.get('ai4paper.selectedtexttransenable');
    window.document.querySelector("#ai4paper-button-enable-words-first").checked = Zotero.Prefs.get("ai4paper.translationvocabularyfirst");
    window.document.querySelector("#ai4paper-button-enable-concat").checked = Zotero.Prefs.get('ai4paper.translationcrossparagraphs');
    local40.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = Zotero.AI4Paper.translateSourceText;
    local40.document.getElementById("ai4paper-translate-readerSidePane-response").value = Zotero.AI4Paper.translateResponse;
    local40.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    local40.document.getElementById("ai4paper-translate-readerSidePane-response").style.fontSize = Zotero.Prefs.get("ai4paper.translatesidepanefontsize");
    if (Zotero.AI4Paper.vocabularyreviewmode === "true") {
      local40.document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review").checked = true;
      local40.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = "inline";
      local40.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = "inline";
      if (Zotero.Prefs.get("ai4paper.vocabularyreviewgiveinterpretation")) {
        local40.document.getElementById('ai4paper-translate-readerSidePane-vocabulary-interpretation').style.display = "none";
      } else local40.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = 'inline';
    } else {
      local40.document.getElementById('ai4paper-translate-readerSidePane-vocaulary-review').checked = false;
      local40.document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = "none";
      local40.document.getElementById('ai4paper-translate-readerSidePane-vocabulary-interpretation').style.display = "none";
      local40.document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = 'none';
    }
  },
  'isReaderSidePaneExist': function (sidePaneName, currentTabID) {
    !currentTabID && (currentTabID = Zotero_Tabs._selectedID);
    Zotero.AI4Paper.gptReaderSidePane_recordScrollTop(currentTabID);
    const reader18 = Zotero.Reader.getByTabID(currentTabID);
    if (!reader18) return;
    !window.document.getElementById("ai4paper-" + sidePaneName + "-readersidepane") && Zotero.AI4Paper.addReaderSidePane(currentTabID);
  },
  'translateReaderSidePane_showErrorMessage': function (errorMsg) {
    Zotero.AI4Paper.updateTranslationPopupTextArea(errorMsg);
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      return false;
    }
    Zotero.AI4Paper.focusReaderSidePane("translate");
    var local41;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) local41 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;else return false;
    if (!local41) return;
    local41.document.getElementById("ai4paper-translate-readerSidePane-response").value = errorMsg;
    local41.document.getElementById("ai4paper-translate-readerSidePane-response").placeholder = "这里显示翻译结果";
    local41.document.getElementById("ai4paper-translate-readerSidePane-response").style.boxShadow = '0\x200\x201px\x20rgba(0,\x200,\x200,\x200.5)';
    Zotero.AI4Paper.translateResponse = errorMsg;
  },
  'translateReaderSidePane_setUIHeight': function (sourceHeight, responseHeight) {
    if (!Zotero.Prefs.get('ai4paper.translationreadersidepane')) return false;
    var local42;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) local42 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;else return false;
    if (!local42) return;
    Zotero.Prefs.get("ai4paper.translateEnableCustomUIHeight") ? (local42.document.getElementById('ai4paper-translate-readerSidePane-sourcetext').style.height = Zotero.Prefs.get("ai4paper.translateCustomSourceTextAreaHeight") + 'px', local42.document.getElementById('ai4paper-translate-readerSidePane-response').style.height = Zotero.Prefs.get('ai4paper.translateCustomResponseAreaHeight') + 'px') : (local42.document.getElementById('ai4paper-translate-readerSidePane-sourcetext').style.height = sourceHeight + 'px', local42.document.getElementById("ai4paper-translate-readerSidePane-response").style.height = responseHeight + 'px');
  },
  'translateReaderSidePane_exchangeSourceResponseArea': function () {
    let tabID16 = Zotero_Tabs._selectedID;
    const reader19 = Zotero.Reader.getByTabID(tabID16);
    if (!reader19) return;
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      return false;
    }
    var local43;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) local43 = window.document.getElementById('ai4paper-translate-readersidepane').contentWindow;else {
      return false;
    }
    if (!local43) return;
    let doc13 = local43.document.getElementById('ai4paper-translate-readerSidePane-sourcetext'),
      doc14 = local43.document.getElementById("ai4paper-translate-readerSidePane-response"),
      local44 = doc13.nextElementSibling;
    local44 && (local44.querySelector("#ai4paper-translate-readerSidePane-prefs") ? Zotero.Prefs.get("ai4paper.translatesidepaneExchangeSourceResponseArea") && (doc14.after(doc13), doc14.parentNode.prepend(doc14)) : !Zotero.Prefs.get('ai4paper.translatesidepaneExchangeSourceResponseArea') && (doc13.after(doc14), doc13.parentNode.prepend(doc13)));
  },
  'addReaderButtonInit': async function (reader) {
    if (!reader || !Zotero.AI4Paper.betterURL()) return false;
    await reader._initPromise;
    await reader._waitForReader();
    let iframeWin3 = reader._iframeWindow,
      local9 = 0x0;
    while (!iframeWin3.document.querySelector(".center")) {
      if (local9 >= 0x1f4) {
        Zotero.debug("AI4Paper: Waiting for reader failed");
        return;
      }
      await Zotero.Promise.delay(0x5);
      local9++;
    }
    switch (iframeWin3.document.readyState) {
      case "uninitialized":
        {
          setTimeout(() => {
            iframeWin3.document.onreadystatechange = () => Zotero.AI4Paper.addReaderButton(iframeWin3);
            Zotero.AI4Paper.waitForIframeReady(iframeWin3);
            return;
          }, 0x1f4);
          return;
        }
      case "complete":
        {
          Zotero.AI4Paper.addReaderButton(iframeWin3);
          Zotero.AI4Paper.waitForIframeReady(iframeWin3);
        }
    }
  },
  'updateReaderButtonStateInit': async function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader2 = Zotero.Reader.getByTabID(tabID);
    if (!reader2) return false;
    await Zotero.uiReadyPromise;
    await reader2._waitForReader();
    let iframeWin4 = reader2._iframeWindow;
    Zotero.AI4Paper.updateReaderButtonState(iframeWin4);
  },
  'addReaderButton': function (iframeWin) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) {
      return -0x1;
    }
    const elem34 = iframeWin.document.querySelector(".center");
    let elem35 = iframeWin.document.querySelector(".toolbar-button.find"),
      result2 = Zotero.AI4Paper.betterURL();
    if (!result2) {
      return;
    }
    if (Zotero.Prefs.get("ai4paper.enablesvgobsidiannote") && !iframeWin.document.getElementById("AI4Paper: Obsidian Note")) {
      let elem9 = iframeWin.document.createElement("button");
      elem9.setAttribute('id', "AI4Paper: Obsidian Note");
      elem9.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem9.setAttribute("title", "Obsidian Note");
      elem9.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobsidiannote;
      elem9.onclick = () => {
        Zotero.AI4Paper.obsidianNote();
      };
      elem34?.["prepend"](elem9);
    } else !Zotero.Prefs.get("ai4paper.enablesvgobsidiannote") && iframeWin.document.getElementById('AI4Paper:\x20Obsidian\x20Note') && iframeWin.document.getElementById('AI4Paper:\x20Obsidian\x20Note').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgopenwith") && !iframeWin.document.getElementById('AI4Paper:\x20Open\x20With')) {
      let elem30 = iframeWin.document.createElement("button");
      elem30.setAttribute('id', "AI4Paper: Open With");
      elem30.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem30.setAttribute("title", 'Open\x20With');
      elem30.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgopenwith;
      elem30.onclick = evt => {
        if (evt.shiftKey) {
          Zotero.AI4Paper.openwith_buildPopup(elem30);
        } else {
          Zotero.AI4Paper.openwith(0x1);
        }
      };
      elem30.addEventListener("pointerdown", evt => {
        if (evt.button == 0x2) {
          Zotero.AI4Paper.openwith(0x2);
        }
      }, false);
      elem34?.["prepend"](elem30);
    } else !Zotero.Prefs.get("ai4paper.enablesvgopenwith") && iframeWin.document.getElementById("AI4Paper: Open With") && iframeWin.document.getElementById("AI4Paper: Open With").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgconnectedpapers") && !iframeWin.document.getElementById("AI4Paper: Connected Papers")) {
      let elem10 = iframeWin.document.createElement('button');
      elem10.setAttribute('id', 'AI4Paper:\x20Connected\x20Papers');
      elem10.setAttribute('class', 'toolbar-button\x20AI4Paper-Reader-Buttons\x20AI4Paper-center-toolbarButton');
      elem10.setAttribute("title", "Connected Papers");
      elem10.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgconnectedpapers;
      elem10.onclick = () => {
        Zotero.AI4Paper.connectedPapers();
      };
      elem34?.["prepend"](elem10);
    } else !Zotero.Prefs.get("ai4paper.enablesvgconnectedpapers") && iframeWin.document.getElementById('AI4Paper:\x20Connected\x20Papers') && iframeWin.document.getElementById("AI4Paper: Connected Papers").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgscite') && !iframeWin.document.getElementById("AI4Paper: Scite")) {
      let elem3 = iframeWin.document.createElement('button');
      elem3.setAttribute('id', "AI4Paper: Scite");
      elem3.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem3.setAttribute('title', "Scite");
      elem3.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgscite;
      elem3.onclick = () => {
        Zotero.AI4Paper.scite();
      };
      elem34?.['prepend'](elem3);
    } else {
      if (!Zotero.Prefs.get('ai4paper.enablesvgscite') && iframeWin.document.getElementById("AI4Paper: Scite")) {
        iframeWin.document.getElementById("AI4Paper: Scite").remove();
      }
    }
    if (Zotero.Prefs.get("ai4paper.enablesvgRelatedPapers") && !iframeWin.document.getElementById("AI4Paper: RelatedPapers")) {
      let elem36 = iframeWin.document.createElement("button");
      elem36.setAttribute('id', 'AI4Paper:\x20RelatedPapers');
      elem36.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem36.setAttribute("title", "相关文献");
      elem36.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgRelatedPapers;
      elem36.onclick = () => {
        Zotero.AI4Paper.relatedPapers();
      };
      elem34?.["prepend"](elem36);
    } else !Zotero.Prefs.get('ai4paper.enablesvgRelatedPapers') && iframeWin.document.getElementById('AI4Paper:\x20RelatedPapers') && iframeWin.document.getElementById('AI4Paper:\x20RelatedPapers').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgrefs") && !iframeWin.document.getElementById("AI4Paper: Refs")) {
      let elem16 = iframeWin.document.createElement("button");
      elem16.setAttribute('id', 'AI4Paper:\x20Refs');
      elem16.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem16.setAttribute("title", "抓取参考文献");
      elem16.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgrefs;
      elem16.onclick = () => {
        Zotero.AI4Paper.updateReferences();
      };
      elem34?.["prepend"](elem16);
    } else !Zotero.Prefs.get('ai4paper.enablesvgrefs') && iframeWin.document.getElementById("AI4Paper: Refs") && iframeWin.document.getElementById('AI4Paper:\x20Refs').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgciting") && !iframeWin.document.getElementById("AI4Paper: Citing")) {
      let elem37 = iframeWin.document.createElement("button");
      elem37.setAttribute('id', "AI4Paper: Citing");
      elem37.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem37.setAttribute('title', "抓取施引文献");
      elem37.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgciting;
      elem37.onclick = () => {
        Zotero.AI4Paper.updateCitingReferences();
      };
      elem34?.['prepend'](elem37);
    } else {
      if (!Zotero.Prefs.get("ai4paper.enablesvgciting") && iframeWin.document.getElementById("AI4Paper: Citing")) {
        iframeWin.document.getElementById("AI4Paper: Citing").remove();
      }
    }
    if (Zotero.Prefs.get("ai4paper.enablesvghandtool") && !iframeWin.document.getElementById("AI4Paper: HandTool")) {
      let elem38 = iframeWin.document.createElement("button");
      elem38.setAttribute('id', 'AI4Paper:\x20HandTool');
      elem38.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem38.setAttribute('title', '手形工具');
      elem38.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvghandtool;
      elem38.onclick = () => {
        const result3 = Zotero.AI4Paper.getCurrentReader();
        result3 && result3.toggleHandTool();
      };
      elem34?.["prepend"](elem38);
    } else {
      if (!Zotero.Prefs.get('ai4paper.enablesvghandtool') && iframeWin.document.getElementById("AI4Paper: HandTool")) {
        iframeWin.document.getElementById("AI4Paper: HandTool").remove();
      }
    }
    if (Zotero.Prefs.get("ai4paper.enablesvgpagerotate2right") && !iframeWin.document.getElementById("AI4Paper: Page Rotate Clockwise")) {
      let elem19 = iframeWin.document.createElement('button');
      elem19.setAttribute('id', 'AI4Paper:\x20Page\x20Rotate\x20Clockwise');
      elem19.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem19.setAttribute("title", "单页右转");
      elem19.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgpagerotate2right;
      elem19.onclick = () => {
        const result4 = Zotero.AI4Paper.getCurrentReader();
        result4 && (result4.rotatePageRight(), Zotero.AI4Paper.OnRotateMenuItemClick());
      };
      elem34?.["prepend"](elem19);
    } else !Zotero.Prefs.get("ai4paper.enablesvgpagerotate2right") && iframeWin.document.getElementById("AI4Paper: Page Rotate Clockwise") && iframeWin.document.getElementById("AI4Paper: Page Rotate Clockwise").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgpagerotate2left') && !iframeWin.document.getElementById("AI4Paper: Page Rotate Counterclockwise")) {
      let elem24 = iframeWin.document.createElement("button");
      elem24.setAttribute('id', "AI4Paper: Page Rotate Counterclockwise");
      elem24.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem24.setAttribute("title", "单页左转");
      elem24.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgpagerotate2left;
      elem24.onclick = () => {
        const result5 = Zotero.AI4Paper.getCurrentReader();
        result5 && (result5.rotatePageLeft(), Zotero.AI4Paper.OnRotateMenuItemClick());
      };
      elem34?.["prepend"](elem24);
    } else !Zotero.Prefs.get("ai4paper.enablesvgpagerotate2left") && iframeWin.document.getElementById("AI4Paper: Page Rotate Counterclockwise") && iframeWin.document.getElementById("AI4Paper: Page Rotate Counterclockwise").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgsplithorizontally") && !iframeWin.document.getElementById("AI4Paper: Split Horizontally")) {
      let elem39 = iframeWin.document.createElement("button");
      elem39.setAttribute('id', 'AI4Paper:\x20Split\x20Horizontally');
      elem39.setAttribute("class", 'toolbar-button\x20AI4Paper-Reader-Buttons\x20AI4Paper-center-toolbarButton');
      elem39.setAttribute("title", "水平分栏");
      elem39.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgsplithorizontally;
      elem39.onclick = () => {
        window.document.getElementById("view-menuitem-split-horizontally").click();
      };
      elem34?.["prepend"](elem39);
    } else !Zotero.Prefs.get('ai4paper.enablesvgsplithorizontally') && iframeWin.document.getElementById("AI4Paper: Split Horizontally") && iframeWin.document.getElementById("AI4Paper: Split Horizontally").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgsplitvertically") && !iframeWin.document.getElementById("AI4Paper: Split Vertically")) {
      let elem7 = iframeWin.document.createElement('button');
      elem7.setAttribute('id', "AI4Paper: Split Vertically");
      elem7.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem7.setAttribute('title', "垂直分栏");
      elem7.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgsplitvertically;
      elem7.onclick = () => {
        window.document.getElementById("view-menuitem-split-vertically").click();
      };
      elem34?.["prepend"](elem7);
    } else !Zotero.Prefs.get("ai4paper.enablesvgsplitvertically") && iframeWin.document.getElementById("AI4Paper: Split Vertically") && iframeWin.document.getElementById('AI4Paper:\x20Split\x20Vertically').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgZoomPageHeight") && !iframeWin.document.getElementById("AI4Paper: ZoomPageHeight")) {
      let elem40 = iframeWin.document.createElement('button');
      elem40.setAttribute('id', 'AI4Paper:\x20ZoomPageHeight');
      elem40.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem40.setAttribute("title", '适应页面高度');
      elem40.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgZoomPageHeight;
      elem40.onclick = () => {
        window.document.getElementById("view-menuitem-zoom-page-height").click();
      };
      elem34?.["prepend"](elem40);
    } else {
      if (!Zotero.Prefs.get("ai4paper.enablesvgZoomPageHeight") && iframeWin.document.getElementById("AI4Paper: ZoomPageHeight")) {
        iframeWin.document.getElementById('AI4Paper:\x20ZoomPageHeight').remove();
      }
    }
    if (Zotero.Prefs.get("ai4paper.enablesvgOddSpreads") && !iframeWin.document.getElementById("AI4Paper: OddSpreads")) {
      let elem41 = iframeWin.document.createElement("button");
      elem41.setAttribute('id', "AI4Paper: OddSpreads");
      elem41.setAttribute('class', 'toolbar-button\x20AI4Paper-Reader-Buttons\x20AI4Paper-center-toolbarButton');
      elem41.setAttribute('title', "奇数分布");
      elem41.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgOddSpreads;
      elem41.onclick = () => {
        Zotero.AI4Paper.oddSpreads_byShortCuts();
      };
      elem34?.["prepend"](elem41);
    } else !Zotero.Prefs.get("ai4paper.enablesvgOddSpreads") && iframeWin.document.getElementById("AI4Paper: OddSpreads") && iframeWin.document.getElementById("AI4Paper: OddSpreads").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgfileshistory") && !iframeWin.document.getElementById('AI4Paper:\x20Files\x20History')) {
      let elem42 = iframeWin.document.createElement('button');
      elem42.setAttribute('id', "AI4Paper: Files History");
      elem42.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem42.setAttribute("title", "最近打开");
      elem42.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgfileshistory;
      elem42.onclick = evt => {
        evt.shiftKey ? Zotero.AI4Paper.openWorkSpaceWindow() : Zotero.AI4Paper.openDialog_filesHistory();
      };
      elem42.addEventListener("pointerdown", evt => {
        evt.button == 0x2 && Zotero.AI4Paper.createTabsAsWorkSpace();
      }, false);
      elem34?.["prepend"](elem42);
    } else {
      if (!Zotero.Prefs.get('ai4paper.enablesvgfileshistory') && iframeWin.document.getElementById("AI4Paper: Files History")) {
        iframeWin.document.getElementById('AI4Paper:\x20Files\x20History').remove();
      }
    }
    if (Zotero.Prefs.get("ai4paper.enablesvgcardnotes") && !iframeWin.document.getElementById("AI4Paper: Tag CardNotes")) {
      let elem43 = iframeWin.document.createElement("button");
      elem43.setAttribute('id', "AI4Paper: Tag CardNotes");
      elem43.setAttribute("class", 'toolbar-button\x20AI4Paper-Reader-Buttons\x20AI4Paper-center-toolbarButton');
      elem43.setAttribute("title", "标签管理器");
      elem43.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgcardnotes;
      elem43.onclick = () => {
        Zotero.AI4Paper.openDialog_tagsManager();
      };
      elem34?.["prepend"](elem43);
    } else !Zotero.Prefs.get("ai4paper.enablesvgcardnotes") && iframeWin.document.getElementById("AI4Paper: Tag CardNotes") && iframeWin.document.getElementById("AI4Paper: Tag CardNotes").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgchatwithnewbing") && !iframeWin.document.getElementById('AI4Paper:\x20Chat\x20with\x20NewBing')) {
      let elem44 = iframeWin.document.createElement("button");
      elem44.setAttribute('id', "AI4Paper: Chat with NewBing");
      elem44.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem44.setAttribute("title", "Chat with NewBing");
      elem44.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgchatwithnewbing;
      elem44.onclick = () => {
        Zotero.AI4Paper.chatWithNewBing();
      };
      elem34?.["prepend"](elem44);
    } else !Zotero.Prefs.get('ai4paper.enablesvgchatwithnewbing') && iframeWin.document.getElementById("AI4Paper: Chat with NewBing") && iframeWin.document.getElementById("AI4Paper: Chat with NewBing").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgimmersiveTranslate') && !iframeWin.document.getElementById("AI4Paper: Immersive Translate")) {
      let elem = iframeWin.document.createElement("button");
      elem.setAttribute('id', 'AI4Paper:\x20Immersive\x20Translate');
      elem.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem.setAttribute("title", "打开沉浸式翻译");
      elem.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgimmersiveTranslate;
      elem.onclick = () => {
        Zotero.AI4Paper.openImmersiveTranslate();
      };
      elem.addEventListener("pointerdown", evt => {
        evt.button == 0x2 && Zotero.AI4Paper.openUniversalImmersiveTranslate();
      }, false);
      elem34?.["prepend"](elem);
    } else !Zotero.Prefs.get("ai4paper.enablesvgimmersiveTranslate") && iframeWin.document.getElementById("AI4Paper: Immersive Translate") && iframeWin.document.getElementById("AI4Paper: Immersive Translate").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgCopyPDF') && !iframeWin.document.getElementById("AI4Paper: Copy PDF")) {
      let elem45 = iframeWin.document.createElement("button");
      elem45.setAttribute('id', "AI4Paper: Copy PDF");
      elem45.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons AI4Paper-center-toolbarButton");
      elem45.setAttribute("title", "拷贝 PDF");
      elem45.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgCopyPDF;
      elem45.onclick = evt => {
        evt.shiftKey ? Zotero.AI4Paper.openwith() : Zotero.AI4Paper.copyPDF();
      };
      elem45.addEventListener("pointerdown", evt => {
        evt.button == 0x2 && Zotero.AI4Paper.openwith();
      }, false);
      elem34?.['prepend'](elem45);
    } else !Zotero.Prefs.get("ai4paper.enablesvgCopyPDF") && iframeWin.document.getElementById("AI4Paper: Copy PDF") && iframeWin.document.getElementById('AI4Paper:\x20Copy\x20PDF').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgeyesprotection") && !iframeWin.document.getElementById("AI4Paper: Eyes Protection")) {
      let elem46 = iframeWin.document.createElement("button");
      elem46.setAttribute('id', "AI4Paper: Eyes Protection");
      elem46.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      elem46.setAttribute('title', '护眼模式');
      Zotero.Prefs.get('ai4paper.eyesprotectioncolorenable') ? elem46.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection : elem46.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection_off;
      elem46.onclick = evt => {
        if (evt.shiftKey && Zotero.AI4Paper.isZoteroVersion(0x7)) {
          Zotero.Prefs.set("reader.contentDarkMode", !Zotero.Prefs.get("reader.contentDarkMode"));
        } else Zotero.AI4Paper.toggleEyesButtonState(iframeWin);
      };
      elem46.addEventListener("pointerdown", evt => {
        if (evt.button == 0x2) {
          Zotero.AI4Paper.changeZoteroDarkANDLightMode();
        }
      }, false);
      elem35?.["before"](elem46);
    } else !Zotero.Prefs.get("ai4paper.enablesvgeyesprotection") && iframeWin.document.getElementById("AI4Paper: Eyes Protection") && iframeWin.document.getElementById("AI4Paper: Eyes Protection").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgopentransviewer') && !iframeWin.document.getElementById("AI4Paper: Open TransViewer")) {
      let elem47 = iframeWin.document.createElement("button");
      elem47.setAttribute('id', "AI4Paper: Open TransViewer");
      elem47.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      elem47.setAttribute("title", "打开【AI 对话历史】");
      elem47.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgopentransviewer;
      elem47.onclick = () => {
        Zotero.AI4Paper.openTransViewer();
      };
      elem35?.['before'](elem47);
    } else !Zotero.Prefs.get("ai4paper.enablesvgopentransviewer") && iframeWin.document.getElementById('AI4Paper:\x20Open\x20TransViewer') && iframeWin.document.getElementById("AI4Paper: Open TransViewer").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgautotransenable') && !iframeWin.document.getElementById('AI4Paper:\x20Auto\x20Trans\x20Switch')) {
      let elem22 = iframeWin.document.createElement("button");
      elem22.setAttribute('id', "AI4Paper: Auto Trans Switch");
      elem22.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons");
      elem22.setAttribute("title", "划词翻译开关");
      if (Zotero.Prefs.get("ai4paper.selectedtexttransenable")) elem22.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable;else {
        elem22.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable_off;
      }
      elem22.onclick = () => {
        Zotero.AI4Paper.toggleAutoTransButtonState(iframeWin);
      };
      elem35?.['before'](elem22);
    } else !Zotero.Prefs.get("ai4paper.enablesvgautotransenable") && iframeWin.document.getElementById('AI4Paper:\x20Auto\x20Trans\x20Switch') && iframeWin.document.getElementById('AI4Paper:\x20Auto\x20Trans\x20Switch').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgobnotesautoenable") && !iframeWin.document.getElementById("AI4Paper: Obsidian Notes Auto Update Switch")) {
      let elem31 = iframeWin.document.createElement("button");
      elem31.setAttribute('id', "AI4Paper: Obsidian Notes Auto Update Switch");
      elem31.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      elem31.setAttribute("title", "Obsidian Note 自动模式开关");
      if (Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes")) {
        elem31.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable;
      } else {
        elem31.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable_off;
      }
      elem31.setAttribute("style", "height: 20px; width: 32px; margin-right: 3px; margin-left: 3px");
      elem31.onclick = () => {
        Zotero.AI4Paper.toggleObAutoNoteButtonState(iframeWin);
      };
      elem35?.["before"](elem31);
    } else !Zotero.Prefs.get("ai4paper.enablesvgobnotesautoenable") && iframeWin.document.getElementById("AI4Paper: Obsidian Notes Auto Update Switch") && iframeWin.document.getElementById('AI4Paper:\x20Obsidian\x20Notes\x20Auto\x20Update\x20Switch').remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgzoteropreferences') && !iframeWin.document.getElementById('AI4Paper:\x20Zotero\x20Preferences')) {
      let elem48 = iframeWin.document.createElement("button");
      elem48.setAttribute('id', "AI4Paper: Zotero Preferences");
      elem48.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons");
      elem48.setAttribute("title", "Zotero 首选项");
      elem48.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgzoteropreferences;
      elem48.onclick = () => {
        Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
      };
      elem35?.['before'](elem48);
    } else !Zotero.Prefs.get('ai4paper.enablesvgzoteropreferences') && iframeWin.document.getElementById('AI4Paper:\x20Zotero\x20Preferences') && iframeWin.document.getElementById("AI4Paper: Zotero Preferences").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgshowinmylibrary") && !iframeWin.document.getElementById("AI4Paper: Show in My Llibrary")) {
      let elem49 = iframeWin.document.createElement("button");
      elem49.setAttribute('id', "AI4Paper: Show in My Llibrary");
      elem49.setAttribute('class', "toolbar-button AI4Paper-Reader-Buttons");
      elem49.setAttribute("title", '在文库中显示');
      elem49.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgshowinmylibrary;
      elem49.onclick = () => {
        Zotero.AI4Paper.showItemInCollection(Zotero.AI4Paper.getCurrentItem());
      };
      elem35?.["before"](elem49);
    } else !Zotero.Prefs.get("ai4paper.enablesvgshowinmylibrary") && iframeWin.document.getElementById('AI4Paper:\x20Show\x20in\x20My\x20Llibrary') && iframeWin.document.getElementById('AI4Paper:\x20Show\x20in\x20My\x20Llibrary').remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgshowfile') && !iframeWin.document.getElementById('AI4Paper:\x20Show\x20File')) {
      let elem50 = iframeWin.document.createElement("button");
      elem50.setAttribute('id', "AI4Paper: Show File");
      elem50.setAttribute("class", 'toolbar-button\x20AI4Paper-Reader-Buttons');
      elem50.setAttribute("title", "打开文件位置");
      elem50.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgshowfile;
      elem50.onclick = () => {
        Zotero.AI4Paper.showFile();
      };
      elem35?.["before"](elem50);
    } else !Zotero.Prefs.get("ai4paper.enablesvgshowfile") && iframeWin.document.getElementById("AI4Paper: Show File") && iframeWin.document.getElementById('AI4Paper:\x20Show\x20File').remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgtransnotesort") && !iframeWin.document.getElementById("AI4Paper: Trans Note Sort")) {
      let elem51 = iframeWin.document.createElement("button");
      elem51.setAttribute('id', "AI4Paper: Trans Note Sort");
      elem51.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      elem51.setAttribute("title", "切换翻译记录排序");
      elem51.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgtransnotesort;
      elem51.onclick = () => {
        Zotero.AI4Paper.toogleSortingTrans();
      };
      elem35?.["before"](elem51);
    } else !Zotero.Prefs.get("ai4paper.enablesvgtransnotesort") && iframeWin.document.getElementById('AI4Paper:\x20Trans\x20Note\x20Sort') && iframeWin.document.getElementById("AI4Paper: Trans Note Sort").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgarchive') && !iframeWin.document.getElementById("AI4Paper: Archive")) {
      let elem52 = iframeWin.document.createElement("button");
      elem52.setAttribute('id', "AI4Paper: Archive");
      elem52.setAttribute("class", "toolbar-button AI4Paper-Reader-Buttons");
      elem52.setAttribute('title', '归档');
      elem52.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgarchive;
      elem52.onclick = () => {
        Zotero.AI4Paper.archiveSelectedItems();
      };
      elem35?.['before'](elem52);
    } else !Zotero.Prefs.get("ai4paper.enablesvgarchive") && iframeWin.document.getElementById("AI4Paper: Archive") && iframeWin.document.getElementById("AI4Paper: Archive").remove();
    if (Zotero.Prefs.get('ai4paper.enablesvgPaperAI')) Zotero.AI4Paper.addReaderMenuButton_paperAI(iframeWin, elem35);else !Zotero.Prefs.get("ai4paper.enablesvgPaperAI") && iframeWin.document.getElementById("AI4Paper: PaperAI") && iframeWin.document.getElementById("AI4Paper: PaperAI").remove();
    if (Zotero.Prefs.get("ai4paper.enablesvgCardNotesSearch") && !iframeWin.document.getElementById("AI4Paper: CardNotesSearch")) {
      let elem17 = iframeWin.document.createElement('button');
      elem17.setAttribute('id', 'AI4Paper:\x20CardNotesSearch');
      elem17.setAttribute("class", 'toolbar-button\x20AI4Paper-Reader-Buttons\x20AI4Paper-centerRight-toolbarButton');
      elem17.setAttribute("title", '卡片笔记搜索');
      elem17.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgCardNotesSearch;
      elem17.onclick = async evt => {
        if (evt.shiftKey) Zotero.getMainWindow().ZoteroPane_Local.openAdvancedSearchWindow();else {
          let elem53 = window.document.querySelector(".AI4Paper-CardNotes-Search");
          if (!elem53) {
            elem53 = window.document.createXULElement("panel");
            elem53.setAttribute("class", "AI4Paper-CardNotes-Search");
            elem53.setAttribute("type", "arrow");
            elem53.addEventListener("popupshown", cb => {
              window.document.querySelector("#CardNotes-SearchBox") && window.document.querySelector("#CardNotes-SearchBox").focus();
            });
            let elem54 = window.document.createXULElement("vbox"),
              elem55 = window.document.createElement("textarea");
            elem55.id = "CardNotes-SearchBox";
            elem55.style = "padding: 5px;overflow-y: auto;overflow-x: hidden;";
            elem55.style.width = "350px";
            elem55.style.height = "20px";
            elem55.onkeydown = evt => {
              if (!evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey && evt.keyCode === 0xd) {
                evt.returnValue = false;
                if (evt.preventDefault) {
                  evt.preventDefault();
                }
                let local10 = elem55.value.trim(),
                  doc2 = window.document.getElementById('CardNotes-SearchBox-2nd').value.trim();
                if (!window.document.getElementById("enableTwoKeyWordsMode").twoKeywords) {
                  if (local10 === '' && elem55.placeholder === '') {
                    return false;
                  } else local10 === '' && elem55.placeholder != '' && (local10 = elem55.placeholder);
                  local10 && (Zotero.AI4Paper.searchCardNotes(local10), Zotero.AI4Paper.lastCardNotesSearchInput = local10, Zotero.AI4Paper.updateCardNotesSearchHistory(local10));
                } else {
                  if (local10 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords && !doc2) {
                    Zotero.AI4Paper.searchCardNotes(local10);
                    Zotero.AI4Paper.lastCardNotesSearchInput = local10;
                    Zotero.AI4Paper.updateCardNotesSearchHistory(local10);
                  } else {
                    if (!local10 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords && doc2) {
                      Zotero.AI4Paper.searchCardNotes(doc2);
                      Zotero.AI4Paper.lastCardNotesSearchInput = doc2;
                      Zotero.AI4Paper.updateCardNotesSearchHistory(doc2);
                    } else {
                      if (window.document.getElementById("enableTwoKeyWordsMode").twoKeywords && local10 && doc2) {
                        let doc3 = window.document.getElementById("conditions-radiogroup").value === '与' ? "AND:AND" : "OR:OR",
                          local11 = local10 + '\x20' + doc3 + '\x20' + doc2;
                        Zotero.AI4Paper.searchCardNotes(local11);
                        Zotero.AI4Paper.lastCardNotesSearchInput = local10;
                        Zotero.AI4Paper.updateCardNotesSearchHistory(local10);
                      }
                    }
                  }
                }
              }
              evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey && evt.keyCode === 0xd && (evt.returnValue = false, evt.preventDefault && evt.preventDefault(), Zotero.AI4Paper.cardNotesSearchButton_webSearch('metaso'));
            };
            elem55.oncontextmenu = cb => {
              cb.preventDefault && cb.preventDefault();
              let parts4 = Zotero.Prefs.get("ai4paper.cardNotesSearchHistory").split("😊🎈🍓");
              if (parts4.length === 0x1 && parts4[0x0] === '') return;
              let elem56 = window.document.querySelector("#browser").querySelector("#AI4Paper-CardNotes-SearchBox-ContextMenu-menupopup");
              !elem56 && (elem56 = window.document.createXULElement("menupopup"), elem56.id = 'AI4Paper-CardNotes-SearchBox-ContextMenu-menupopup', window.document.querySelector("#browser")?.["appendChild"](elem56));
              let local12 = elem56.firstElementChild;
              while (local12) {
                local12.remove();
                local12 = elem56.firstElementChild;
              }
              for (let i of parts4) {
                let local3 = i,
                  elem20 = window.document.createXULElement("menuitem");
                i.length > 0x1e && (i = i.substring(0x0, 0x1d) + "...");
                elem20.setAttribute("label", i);
                elem20.setAttribute("tooltiptext", local3);
                elem20.addEventListener("command", () => {
                  if (local3.indexOf("AND:AND") != -0x1 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords) {
                    let parts5 = local3.split("AND:AND");
                    if (parts5[0x0].trim()) {
                      window.document.getElementById("CardNotes-SearchBox").value = parts5[0x0].trim();
                    }
                    parts5[0x1].trim() && (window.document.getElementById('CardNotes-SearchBox-2nd').value = parts5[0x1].trim());
                    window.document.getElementById("conditions-radiogroup").value = '与';
                  } else {
                    if (local3.indexOf("OR:OR") != -0x1 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords) {
                      let parts = local3.split("OR:OR");
                      parts[0x0].trim() && (window.document.getElementById("CardNotes-SearchBox").value = parts[0x0].trim());
                      parts[0x1].trim() && (window.document.getElementById("CardNotes-SearchBox-2nd").value = parts[0x1].trim());
                      window.document.getElementById("conditions-radiogroup").value = '或';
                    } else {
                      elem55.value = local3;
                    }
                  }
                });
                elem56.appendChild(elem20);
              }
              elem56.openPopup(elem55, "after_start", 0x0, 0x3, false, false);
            };
            let elem57 = window.document.createElement("textarea");
            elem57.id = "CardNotes-SearchBox-2nd";
            elem57.style = "display: none;margin-top: 15px;padding: 5px;overflow-y: auto;overflow-x: hidden;";
            elem57.style.width = "350px";
            elem57.style.height = "20px";
            elem57.onkeydown = evt => {
              if (!evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey && evt.keyCode === 0xd) {
                evt.returnValue = false;
                evt.preventDefault && evt.preventDefault();
                let doc4 = window.document.getElementById("CardNotes-SearchBox").value.trim(),
                  local13 = elem57.value.trim();
                if (local13 && !doc4) {
                  Zotero.AI4Paper.searchCardNotes(local13);
                  Zotero.AI4Paper.lastCardNotesSearchInput = local13;
                  Zotero.AI4Paper.updateCardNotesSearchHistory(local13);
                } else {
                  if (!local13 && doc4) {
                    Zotero.AI4Paper.searchCardNotes(doc4);
                    Zotero.AI4Paper.lastCardNotesSearchInput = doc4;
                    Zotero.AI4Paper.updateCardNotesSearchHistory(doc4);
                  } else {
                    if (doc4 && local13) {
                      let doc5 = window.document.getElementById("conditions-radiogroup").value === '与' ? "AND:AND" : "OR:OR",
                        local14 = doc4 + '\x20' + doc5 + '\x20' + local13;
                      Zotero.AI4Paper.searchCardNotes(local14);
                      Zotero.AI4Paper.lastCardNotesSearchInput = local14;
                      Zotero.AI4Paper.updateCardNotesSearchHistory(local14);
                    }
                  }
                }
              }
              if (evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey && evt.keyCode === 0xd) {
                evt.returnValue = false;
                evt.preventDefault && evt.preventDefault();
              }
            };
            elem57.oncontextmenu = cb => {
              cb.preventDefault && cb.preventDefault();
              let parts6 = Zotero.Prefs.get("ai4paper.cardNotesSearchHistory").split('😊🎈🍓');
              if (parts6.length === 0x1 && parts6[0x0] === '') {
                return;
              }
              let elem58 = window.document.querySelector('#browser').querySelector("#AI4Paper-CardNotes-SearchBox-ContextMenu-menupopup");
              if (!elem58) {
                elem58 = window.document.createXULElement("menupopup");
                elem58.id = "AI4Paper-CardNotes-SearchBox-ContextMenu-menupopup";
                window.document.querySelector("#browser")?.["appendChild"](elem58);
              }
              let local15 = elem58.firstElementChild;
              while (local15) {
                local15.remove();
                local15 = elem58.firstElementChild;
              }
              for (let i2 of parts6) {
                let local16 = i2,
                  elem59 = window.document.createXULElement('menuitem');
                i2.length > 0x1e && (i2 = i2.substring(0x0, 0x1d) + "...");
                elem59.setAttribute("label", i2);
                elem59.setAttribute("tooltiptext", local16);
                elem59.addEventListener('command', () => {
                  if (local16.indexOf('AND:AND') != -0x1 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords) {
                    let parts3 = local16.split("AND:AND");
                    parts3[0x0].trim() && (window.document.getElementById("CardNotes-SearchBox").value = parts3[0x0].trim());
                    parts3[0x1].trim() && (window.document.getElementById("CardNotes-SearchBox-2nd").value = parts3[0x1].trim());
                    window.document.getElementById("conditions-radiogroup").value = '与';
                  } else {
                    if (local16.indexOf("OR:OR") != -0x1 && window.document.getElementById("enableTwoKeyWordsMode").twoKeywords) {
                      let parts2 = local16.split("OR:OR");
                      if (parts2[0x0].trim()) {
                        window.document.getElementById("CardNotes-SearchBox").value = parts2[0x0].trim();
                      }
                      parts2[0x1].trim() && (window.document.getElementById("CardNotes-SearchBox-2nd").value = parts2[0x1].trim());
                      window.document.getElementById("conditions-radiogroup").value = '或';
                    } else elem57.value = local16;
                  }
                });
                elem58.appendChild(elem59);
              }
              elem58.openPopup(elem57, "after_start", 0x0, 0x3, false, false);
            };
            let elem60 = window.document.createElement('div');
            elem60.id = "enableTwoKeyWordsMode";
            elem60.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable_off;
            elem60.twoKeywords = false;
            elem60.style = "width: 30px;display: grid;place-items: center;";
            elem60.title = "双关键词搜索";
            elem60.onclick = evt => {
              evt.stopPropagation();
              !elem60.twoKeywords ? (elem60.innerHTML = Zotero.AI4Paper.svg_icon_20px.on_orange, elem60.twoKeywords = true, window.document.getElementById("CardNotes-SearchBox-2nd").style.display = '', window.document.getElementById("conditions-radiogroup").style.display = '') : (elem60.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable_off, elem60.twoKeywords = false, window.document.getElementById("CardNotes-SearchBox-2nd").style.display = "none", window.document.getElementById("conditions-radiogroup").style.display = "none");
            };
            let elem61 = window.document.createElement("div");
            elem61.innerHTML = Zotero.AI4Paper.svg_icon_16px.help;
            elem61.style = "width: 16px;height: 16px;margin-left: 10px;vertical-align:middle";
            elem61.title = "帮助文档";
            elem61.onclick = evt => {
              ZoteroPane.loadURI("https://www.yuque.com/qnscholar/zotero-one/kav7sf3h4702wzq8?singleDoc# 《阅读器按钮【卡片笔记搜索】使用技巧》");
            };
            function localFn2(icon) {
              icon.style = "transform: scale(0.8);width: 20px;height: 20px;margin-left: 15px;vertical-align:middle;transition: transform 0.125s ease;";
              icon.onmouseover = function () {
                this.style.transform = 'scale(0.96)';
              };
              icon.onmouseout = function () {
                this.style.transform = "scale(0.8)";
              };
            }
            let elem62 = window.document.createElement("div");
            elem62.innerHTML = Zotero.AI4Paper.svg_icon_20px.matrix;
            elem62.title = "智能文献矩阵搜索";
            localFn2(elem62);
            elem62.onclick = evt => {
              Zotero.AI4Paper.cardNotesSearchButton_webSearch("matrix");
            };
            let elem63 = window.document.createElement("div");
            elem63.innerHTML = Zotero.AI4Paper.svg_icon_20px.metaso;
            elem63.title = "秘塔 AI 搜索";
            localFn2(elem63);
            elem63.onclick = evt => {
              Zotero.AI4Paper.cardNotesSearchButton_webSearch("metaso");
            };
            let elem64 = window.document.createElement("div");
            elem64.innerHTML = Zotero.AI4Paper.svg_icon_20px.google;
            elem64.title = '谷歌';
            localFn2(elem64);
            elem64.onclick = evt => {
              Zotero.AI4Paper.cardNotesSearchButton_webSearch("google");
            };
            let elem65 = window.document.createElement("div");
            elem65.innerHTML = Zotero.AI4Paper.svg_icon_20px.google_scholar;
            elem65.title = "谷歌学术";
            localFn2(elem65);
            elem65.onclick = evt => {
              Zotero.AI4Paper.cardNotesSearchButton_webSearch('googlescholar');
            };
            let elem66 = window.document.createElement("div");
            elem66.innerHTML = Zotero.AI4Paper.svg_icon_20px.scihub;
            elem66.title = "SciHub";
            localFn2(elem66);
            elem66.onclick = evt => {
              Zotero.AI4Paper.cardNotesSearchButton_webSearch("scihub");
            };
            let elem67 = window.document.createXULElement("hbox");
            elem67.style.alignItems = "center";
            elem67.style.display = "flex";
            elem67.style.marginTop = '15px';
            elem67.appendChild(elem60);
            elem67.appendChild(elem61);
            elem67.appendChild(elem62);
            elem67.appendChild(elem63);
            elem67.appendChild(elem64);
            elem67.appendChild(elem65);
            elem67.appendChild(elem66);
            let elem68 = window.document.createXULElement("radiogroup");
            elem68.id = "conditions-radiogroup";
            elem68.setAttribute("orient", "horizontal");
            elem68.style = "display: none;margin-top: 10px";
            let elem69 = window.document.createXULElement("radio");
            elem69.setAttribute('label', '与');
            elem69.setAttribute('value', '与');
            elem68.appendChild(elem69);
            elem69 = window.document.createXULElement('radio');
            elem69.setAttribute("label", '或');
            elem69.setAttribute("value", '或');
            elem68.appendChild(elem69);
            elem54.appendChild(elem55);
            elem54.appendChild(elem57);
            elem54.appendChild(elem67);
            elem54.appendChild(elem68);
            elem53.appendChild(elem54);
            window.document.querySelector('#browser')?.['appendChild'](elem53);
          }
          window.document.querySelector('#CardNotes-SearchBox') && (window.document.querySelector("#CardNotes-SearchBox").placeholder = Zotero.AI4Paper.lastCardNotesSearchInput.trim());
          elem53.openPopup(elem17, "after_start", 0x10, -0x2, false, false);
        }
      };
      elem17.addEventListener("pointerdown", evt => {
        evt.button == 0x2 && Zotero.AI4Paper.openDialog_tagsManager();
      }, false);
      let elem28 = iframeWin.document.querySelector('.toolbar-button.toolbar-dropdown-button');
      elem28?.["after"](elem17);
      let elem29 = iframeWin.document.querySelector(".divider");
      if (elem29) {
        let clone = elem29.cloneNode(true);
        clone.setAttribute('id', "divider-before-toolbarButton-CardNotesSearch");
        clone.classList.toggle("divider-before-toolbarButton", true);
        elem17?.['before'](clone);
      }
    } else !Zotero.Prefs.get("ai4paper.enablesvgCardNotesSearch") && iframeWin.document.getElementById('AI4Paper:\x20CardNotesSearch') && (iframeWin.document.getElementById("AI4Paper: CardNotesSearch").remove(), iframeWin.document.querySelectorAll("#divider-before-toolbarButton-CardNotesSearch").forEach(el => el.remove()));
    if (Zotero.Prefs.get('ai4paper.enablesvggo2favoritecollection')) Zotero.AI4Paper.addReaderMenuButton_go2FavoriteCollection(iframeWin);else !Zotero.Prefs.get("ai4paper.enablesvggo2favoritecollection") && iframeWin.document.getElementById("AI4Paper: go2FavoriteCollection") && (iframeWin.document.getElementById("AI4Paper: go2FavoriteCollection").remove(), iframeWin.document.querySelectorAll("#divider-before-toolbarButton-go2FavoriteCollection").forEach(el => el.remove()));
    if (iframeWin.document.querySelectorAll('.AI4Paper-center-toolbarButton').length) {
      if (iframeWin.document.querySelectorAll('#divider-for-ai4paper-center-toolbarButtons').length === 0x0) {
        let elem23 = iframeWin.document.querySelector(".divider");
        if (elem23) {
          let clone2 = elem23.cloneNode(true);
          clone2.id = "divider-for-ai4paper-center-toolbarButtons";
          clone2.classList.toggle("divider-before-toolbarButton", true);
          let elem5 = iframeWin.document.querySelector('.toolbar-button.highlight');
          elem5?.["before"](clone2);
        }
      }
    } else iframeWin.document.querySelectorAll("#divider-for-ai4paper-center-toolbarButtons").forEach(el => el.remove());
    Zotero.AI4Paper.addViewButtons(iframeWin);
  },
  'updateReaderButtonState': async function (iframeWinArg) {
    let doc6 = iframeWinArg.document.getElementById("AI4Paper: Obsidian Notes Auto Update Switch");
    if (Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes")) {
      doc6 && (doc6.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable);
    } else doc6 && (doc6.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable_off);
    let doc7 = iframeWinArg.document.getElementById("AI4Paper: Auto Trans Switch");
    Zotero.Prefs.get('ai4paper.selectedtexttransenable') ? doc7 && (doc7.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable) : doc7 && (doc7.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable_off);
    let doc8 = iframeWinArg.document.getElementById("AI4Paper: Eyes Protection");
    Zotero.Prefs.get("ai4paper.eyesprotectioncolorenable") ? doc8 && (doc8.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection) : doc8 && (doc8.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection_off);
  },
  'toggleEyesButtonState': async function (readerIframeWin) {
    let doc9 = readerIframeWin.document.getElementById('AI4Paper:\x20Eyes\x20Protection');
    if (Zotero.Prefs.get("ai4paper.eyesprotectioncolorselectwindow")) {
      if (Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === '自定义' && !Zotero.Prefs.get("ai4paper.eyesprotectioncolorcodeisok")) {
        return window.alert("您开启了自定义护眼色模式，但输入的护眼色代码无效，请前往【AI4paper 首选项 --> 拓展 --> 护眼色】重新设置！"), false;
      }
      let result = Zotero.AI4Paper.openDialogByType_modal("selectBackGroundColor");
      if (!result) {
        return false;
      } else {
        if (result === "default") {
          Zotero.Prefs.set("ai4paper.eyesprotectioncolorenable", false);
          doc9.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection_off;
        } else {
          Zotero.Prefs.set("ai4paper.eyesprotectioncolorenable", true);
          doc9.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection;
          if (result === "mungbean_green") Zotero.Prefs.set('ai4paper.eyesprotectioncolor', "豆沙绿");else {
            if (result === "matcha_green") Zotero.Prefs.set("ai4paper.eyesprotectioncolor", '抹茶绿');else {
              if (result === 'grass_green') Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "青草绿");else {
                if (result === 'almond_yellow') {
                  Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "杏仁黄");
                } else {
                  if (result === 'autumnleaf_brown') Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '秋叶褐');else {
                    if (result === "crimson_red") Zotero.Prefs.set('ai4paper.eyesprotectioncolor', "胭脂红");else {
                      if (result === "ocean_blue") Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "海天蓝");else {
                        if (result === 'gauze_purple') Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "葛巾紫");else {
                          if (result === 'aurora_grey') Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "极光灰");else {
                            if (result === 'ivory_white') {
                              Zotero.Prefs.set("ai4paper.eyesprotectioncolor", "象牙白");
                            } else result === "custom" && Zotero.Prefs.set("ai4paper.eyesprotectioncolor", '自定义');
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
        return Zotero.AI4Paper.setPDFBackGroundColor(readerIframeWin), true;
      }
    }
    Zotero.Prefs.get("ai4paper.eyesprotectioncolorenable") ? (Zotero.Prefs.set("ai4paper.eyesprotectioncolorenable", false), doc9.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection_off, Zotero.AI4Paper.setPDFBackGroundColor(readerIframeWin)) : (Zotero.Prefs.set('ai4paper.eyesprotectioncolorenable', true), doc9.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgeyesprotection, Zotero.AI4Paper.setPDFBackGroundColor(readerIframeWin));
  },
  'toggleObAutoNoteButtonState': async function (obIframeWin) {
    let doc10 = obIframeWin.document.getElementById("AI4Paper: Obsidian Notes Auto Update Switch");
    Zotero.Prefs.get('ai4paper.obsidianautoupdatenotes') ? (Zotero.Prefs.set("ai4paper.obsidianautoupdatenotes", false), doc10.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable_off) : (Zotero.Prefs.set('ai4paper.obsidianautoupdatenotes', true), doc10.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgobnotesautoenable);
  },
  'toggleAutoTransButtonState': async function (iframeWin2) {
    let doc11 = iframeWin2.document.getElementById("AI4Paper: Auto Trans Switch");
    Zotero.Prefs.get('ai4paper.selectedtexttransenable') ? (Zotero.Prefs.set("ai4paper.selectedtexttransenable", false), doc11.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable_off) : (Zotero.Prefs.set("ai4paper.selectedtexttransenable", true), doc11.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgautotransenable);
    Zotero.AI4Paper.updateTranslateReaderSidePane();
  },
  'waitForIframeReady': async function (parentIframeWin) {
    let elem70 = parentIframeWin.document.querySelectorAll("iframe")[0x0].contentWindow;
    switch (elem70.document.readyState) {
      case "uninitialized":
        {
          let local17 = 0x0;
          while (elem70.document.readyState === "uninitialized") {
            if (local17 >= 0x1f4) return;
            await Zotero.Promise.delay(0xa);
            local17++;
          }
          Zotero.AI4Paper.setPDFBackGroundColor(parentIframeWin);
          Zotero.AI4Paper.addButtonColorLabel(parentIframeWin);
          Zotero.AI4Paper.addAnnotationButtonsInFloatingWindow(parentIframeWin);
          Zotero.AI4Paper.onSidebarToggle(parentIframeWin);
          Zotero.AI4Paper.onClickButton_viewAnnotations(parentIframeWin);
          Zotero.AI4Paper.onClickButton_viewOutline(parentIframeWin);
          return;
        }
      case "complete":
        {
          Zotero.AI4Paper.setPDFBackGroundColor(parentIframeWin);
          Zotero.AI4Paper.addButtonColorLabel(parentIframeWin);
          Zotero.AI4Paper.addAnnotationButtonsInFloatingWindow(parentIframeWin);
          Zotero.AI4Paper.onSidebarToggle(parentIframeWin);
          Zotero.AI4Paper.onClickButton_viewAnnotations(parentIframeWin);
          Zotero.AI4Paper.onClickButton_viewOutline(parentIframeWin);
        }
    }
  },
  'setPDFBackGroundColor': async function (bgIframeWin) {
    if (!Zotero.Prefs.get('ai4paper.eyesprotectioncolorenable') || Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "自定义" && !Zotero.Prefs.get("ai4paper.eyesprotectioncolorcodeisok")) return bgIframeWin.document.querySelectorAll("iframe")[0x0]?.["contentWindow"]["document"]["head"]["querySelectorAll"]("#eyes-protection-color")["forEach"](el => el.remove()), bgIframeWin.document.querySelectorAll("iframe")[0x1]?.["contentWindow"]["document"]['head']["querySelectorAll"]("#eyes-protection-color")["forEach"](el => el.remove()), false;
    let str = '#53fc5a';
    if (Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === "豆沙绿") str = '#53fc5a';else {
      if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "抹茶绿") str = "#97ff91";else {
        if (Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === "青草绿") str = "#b7ec36";else {
          if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "杏仁黄") str = " #faf564";else {
            if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "秋叶褐") str = '#ffc26b';else {
              if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "胭脂红") str = "#fd9b81";else {
                if (Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === "海天蓝") str = "#b0c6fc";else {
                  if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '葛巾紫') {
                    str = "#9ba4fe";
                  } else {
                    if (Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === "极光灰") str = "#cfcfee";else {
                      if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === "象牙白") str = "#f8ebbf";else Zotero.Prefs.get("ai4paper.eyesprotectioncolor") === "自定义" && (str = Zotero.Prefs.get("ai4paper.eyesprotectioncolorcode"));
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
      bgIframeWin.document.querySelectorAll("iframe")[0x0]?.["contentWindow"]["document"]["head"]["querySelectorAll"]("#eyes-protection-color")["forEach"](el => el.remove());
      bgIframeWin.document.querySelectorAll("iframe")[0x1]?.["contentWindow"]['document']["head"]["querySelectorAll"]("#eyes-protection-color")["forEach"](el => el.remove());
      let elem71 = bgIframeWin.document.createElement("style");
      elem71.id = "eyes-protection-color";
      elem71.textContent = ".textLayer{\n                display:block !important;\n                background-color: " + str + " !important;\n                opacity: 0.2 !important;\n            }";
      bgIframeWin.document.querySelectorAll("iframe")[0x0]?.["contentWindow"]["document"]["head"]['appendChild'](elem71);
      elem71 = bgIframeWin.document.createElement("style");
      elem71.id = "eyes-protection-color";
      elem71.textContent = '.textLayer{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20display:block\x20!important;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20background-color:\x20' + str + " !important;\n                opacity: 0.2 !important;\n            }";
      bgIframeWin.document.querySelectorAll("iframe")[0x1]?.['contentWindow']["document"]["head"]['appendChild'](elem71);
    } catch (e) {
      Zotero.debug('' + e);
    }
  },
  'OnSplitMenuItemClick': async function () {
    let tabID2 = Zotero_Tabs._selectedID;
    var reader3 = Zotero.Reader.getByTabID(tabID2);
    if (!reader3) return false;
    let iframeWin5 = reader3._iframeWindow;
    await new Promise(resolve => setTimeout(resolve, 0x64));
    Zotero.AI4Paper.addAnnotationButtonsInFloatingWindow(iframeWin5);
    Zotero.AI4Paper.setPDFBackGroundColor(iframeWin5);
  },
  'OnRotateMenuItemClick': async function () {
    let tabID3 = Zotero_Tabs._selectedID;
    var reader4 = Zotero.Reader.getByTabID(tabID3);
    if (!reader4) return false;
    let iframeWin6 = reader4._iframeWindow;
    await new Promise(resolve => setTimeout(resolve, 0x3e8));
    Zotero.AI4Paper.setPDFBackGroundColor(iframeWin6);
    Zotero.AI4Paper.addAnnotationButtonsInFloatingWindow(iframeWin6);
  },
  'readerMenuItemClickEvent': function (actionType) {
    if (actionType === "add") {
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
    } else actionType === "remove" && (window.document.getElementById("view-menuitem-split-horizontally")?.["removeEventListener"]("command", () => {
      Zotero.AI4Paper.OnSplitMenuItemClick();
    }), window.document.getElementById("view-menuitem-split-vertically")?.['removeEventListener']('command', () => {
      Zotero.AI4Paper.OnSplitMenuItemClick();
    }), window.document.getElementById("menu_rotateRight")?.["removeEventListener"]("command", () => {
      Zotero.AI4Paper.OnRotateMenuItemClick();
    }), window.document.getElementById("menu_rotateLeft")?.["removeEventListener"]("command", () => {
      Zotero.AI4Paper.OnRotateMenuItemClick();
    }));
  },
  'addReaderMenuButton_go2FavoriteCollection': async function (readerDoc) {
    readerDoc.document.getElementById("AI4Paper: go2FavoriteCollection")?.["remove"]();
    readerDoc.document.querySelectorAll("#divider-before-toolbarButton-go2FavoriteCollection").forEach(el => el.remove());
    readerDoc.document.head.querySelectorAll("#go2FavoriteCollection-button-style").forEach(el => el.remove());
    const elem72 = readerDoc.document.createElement("style");
    elem72.id = "go2FavoriteCollection-button-style";
    elem72.textContent = "\n          .toolbarButton.go2FavoriteCollection-button-css::before {\n            background-image: url('chrome://ai4paper/content/icons/folder_20px.svg') !important;\n            background-repeat: repeat;\n            background-size: cover;\n            width: 16px;\n            height: 16px;\n            margin: 0 !important;\n            background-color: transparent !important;\n            border: none !important;\n            transform: scale(0.8);\n          }\n        ";
    readerDoc.document.head.appendChild(elem72);
    let elem73 = readerDoc.document.querySelector(".toolbar-button.toolbar-dropdown-button"),
      clone4 = elem73.cloneNode(true);
    clone4.id = "AI4Paper: go2FavoriteCollection";
    clone4.title = "前往收藏分类";
    clone4.disabled = false;
    clone4.setAttribute("class", "toolbar-button toolbar-dropdown-button AI4Paper-Reader-Buttons AI4Paper-centerRight-toolbarButton");
    clone4.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvggo2favoritecollection + "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\" transform=\"translate(1,0)\" fill=\"#828282\"><path fill=\"#828282\" d=\"m0 2.707 4 4 4-4L7.293 2 4 5.293.707 2z\"></path></svg>";
    elem73?.["after"](clone4);
    let elem74 = readerDoc.document.querySelector(".divider");
    if (elem74) {
      let clone5 = elem74.cloneNode(true);
      clone5.setAttribute('id', "divider-before-toolbarButton-go2FavoriteCollection");
      clone5.classList.toggle("divider-before-toolbarButton", true);
      clone4?.["before"](clone5);
    }
    let elem75 = window.document.createXULElement("menupopup");
    elem75.id = "AI4Paper-ReaderButton-go2FavoriteCollection-menupopup";
    elem75.addEventListener("popuphidden", () => {
      window.document.querySelector("#browser").querySelectorAll("#AI4Paper-ReaderButton-go2FavoriteCollection-menupopup").forEach(el => el.remove());
    });
    Zotero.AI4Paper.buildMenuItem_FavoriteCollection(elem75, true);
    clone4.addEventListener("click", evt => {
      window.document.querySelector("#browser").querySelectorAll("#AI4Paper-ReaderButton-go2FavoriteCollection-menupopup").forEach(el => el.remove());
      window.document.querySelector("#browser")?.["appendChild"](elem75);
      elem75.openPopup(clone4, "after_start", 0x0, 0x0, false, false);
    });
    clone4.addEventListener("pointerdown", evt => {
      if (evt.button == 0x2) {
        Zotero.AI4Paper.openDialogByType('sortFavoriteCollections');
      }
    }, false);
  },
  'addReaderMenuButton_paperAI': function (paperAIIframeWin, findButton) {
    paperAIIframeWin.document.getElementById('AI4Paper:\x20PaperAI')?.["remove"]();
    let elem76 = paperAIIframeWin.document.querySelector(".toolbar-button.toolbar-dropdown-button"),
      clone6 = elem76.cloneNode(true);
    clone6.id = "AI4Paper: PaperAI";
    clone6.title = 'AI\x20解读论文';
    clone6.disabled = false;
    clone6.setAttribute("class", 'toolbar-button\x20toolbar-dropdown-button\x20AI4Paper-Reader-Buttons');
    clone6.innerHTML = Zotero.AI4Paper.svg_icon_20px.enablesvgPaperAI + "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\" transform=\"translate(1,0)\" fill=\"#828282\"><path fill=\"#828282\" d=\"m0 2.707 4 4 4-4L7.293 2 4 5.293.707 2z\"></path></svg>";
    findButton.parentNode.prepend(clone6);
    let local18,
      elem77 = window.document.createXULElement("menupopup");
    elem77.id = "AI4Paper-ReaderButton-PaperAI-menupopup";
    elem77.addEventListener('popuphidden', () => {
      window.document.querySelector("#browser").querySelectorAll("#AI4Paper-ReaderButton-PaperAI-menupopup").forEach(el => el.remove());
    });
    let local19 = elem77.firstElementChild;
    while (local19) {
      local19.remove();
      local19 = elem77.firstElementChild;
    }
    let arr = ["AI 解读论文 🔒", '论文深度解读\x20🔒', "论文简要剖析 🔒"];
    for (let i3 of arr) {
      local18 = window.document.createXULElement('menuitem');
      local18.value = i3;
      local18.label = i3;
      local18.setAttribute("tooltiptext", i3);
      local18.addEventListener("command", evt => {
        Zotero.AI4Paper.onClickPaperAIButtonMenuItem(i3);
      });
      elem77.appendChild(local18);
    }
    let prefVal = Zotero.Prefs.get('ai4paper.chatgptprompttemplateuser'),
      arr2 = [];
    if (prefVal != '') {
      let parts7 = prefVal.split('\x0a');
      for (let i4 of parts7) {
        if (i4 != '') {
          i4 = i4.trim();
          if (i4.lastIndexOf('👈') === i4.length - 0x2) {
            let local6 = i4.lastIndexOf('👈');
            if (i4.lastIndexOf('👉') != -0x1) {
              let local20 = i4.lastIndexOf('👉'),
                substr = i4.substring(local20 + 0x2, local6).trim();
              local18 = window.document.createXULElement("menuitem");
              local18.value = substr;
              local18.label = substr;
              local18.setAttribute('tooltiptext', i4);
              local18.addEventListener("command", evt => {
                Zotero.AI4Paper.onClickPaperAIButtonMenuItem(substr);
              });
              elem77.appendChild(local18);
            } else {
              local18 = window.document.createXULElement("menuitem");
              local18.value = i4;
              local18.label = i4;
              local18.setAttribute("tooltiptext", i4);
              local18.addEventListener("command", evt => {
                Zotero.AI4Paper.onClickPaperAIButtonMenuItem(i4);
              });
              elem77.appendChild(local18);
            }
          } else {
            local18 = window.document.createXULElement("menuitem");
            local18.value = i4;
            local18.label = i4;
            local18.setAttribute('tooltiptext', i4);
            local18.addEventListener("command", evt => {
              Zotero.AI4Paper.onClickPaperAIButtonMenuItem(i4);
            });
            elem77.appendChild(local18);
          }
        }
      }
    }
    clone6.addEventListener('click', evt => {
      window.document.querySelector("#browser").querySelectorAll("#AI4Paper-ReaderButton-PaperAI-menupopup").forEach(el => el.remove());
      window.document.querySelector("#browser")?.['appendChild'](elem77);
      elem77.openPopup(clone6, "after_start", 0x0, 0x0, false, false);
    });
    clone6.addEventListener("pointerdown", evt => {
      if (evt.button === 0x2) {
        Zotero.AI4Paper.paperAI(false);
      }
    });
  },
  'onClickPaperAIButtonMenuItem': function (menuItemLabel) {
    if (menuItemLabel === "AI 解读论文 🔒") {
      Zotero.AI4Paper.paperAI(false);
    } else {
      window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").value = menuItemLabel;
      Zotero.Prefs.set('ai4paper.chatgptprompttemplate', menuItemLabel);
      Zotero.AI4Paper.paperAI(true);
    }
  },
  'translateSelect': async function () {
    let tabID4 = Zotero_Tabs._selectedID;
    var reader5 = Zotero.Reader.getByTabID(tabID4);
    if (!reader5) {
      return false;
    }
    await reader5._initPromise;
    await reader5._waitForReader();
    !reader5.translateSelectTextInit && (reader5.translateSelectTextInit = true, reader5._iframeWindow.addEventListener("pointerup", ((local5, local8) => {
      return cb => {
        Zotero.AI4Paper.onSelectText(cb, local5, local8);
      };
    })(reader5)));
  },
  'handlePointerup': function (event) {
    let result6 = Zotero.AI4Paper.getCurrentReader();
    result6 && Zotero.AI4Paper.onSelectText(event, result6);
  },
  'getCurrentReader': function () {
    let tabID5 = Zotero_Tabs._selectedID;
    var reader6 = Zotero.Reader.getByTabID(tabID5);
    return reader6 || false;
  },
  'getReaderItemContentType': function (readerInstance) {
    let local21 = readerInstance.itemID,
      item2 = Zotero.Items.get(local21);
    return item2.attachmentContentType;
  },
  'CheckPDFReader': function () {
    let tabID6 = Zotero_Tabs._selectedID;
    var reader7 = Zotero.Reader.getByTabID(tabID6);
    return reader7 ? true : false;
  },
});
