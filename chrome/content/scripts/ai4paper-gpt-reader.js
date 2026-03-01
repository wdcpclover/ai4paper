Object.assign(Zotero.AI4Paper, {
  'gptReaderSidePane_updatePromptTemplate': function () {
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    let menuItem,
      menuPopup = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template");
    if (!menuPopup) return;
    let child = menuPopup.firstElementChild;
    while (child) {
      child.remove();
      child = menuPopup.firstElementChild;
    }
    let builtInTemplates = ['无', "AI 解读论文 🔒", "论文深度解读 🔒", '论文简要剖析\x20🔒'];
    for (let templateName of builtInTemplates) {
      menuItem = window.document.createXULElement('menuitem');
      menuItem.value = templateName;
      menuItem.label = templateName;
      menuItem.setAttribute('tooltiptext', templateName);
      menuPopup.appendChild(menuItem);
    }
    let userTemplateStr = Zotero.Prefs.get('ai4paper.chatgptprompttemplateuser'),
      templateAliases = [];
    if (userTemplateStr != '') {
      let lines = userTemplateStr.split('\x0a');
      for (let line of lines) {
        if (line != '') {
          line = line.trim();
          if (line.lastIndexOf('👈') === line.length - 0x2) {
            let leftIdx = line.lastIndexOf('👈');
            if (line.lastIndexOf('👉') != -0x1) {
              let rightIdx = line.lastIndexOf('👉'),
                alias = line.substring(rightIdx + 0x2, leftIdx).trim(),
                realTemplate = line.substring(0x0, rightIdx).trim(),
                aliasObj = {
                  'alias': alias,
                  'realTemplate': realTemplate
                };
              templateAliases.push(aliasObj);
              menuItem = window.document.createXULElement("menuitem");
              menuItem.value = alias;
              menuItem.label = alias;
              menuItem.setAttribute('tooltiptext', line);
              menuPopup.appendChild(menuItem);
            } else {
              menuItem = window.document.createXULElement("menuitem");
              menuItem.value = line;
              menuItem.label = line;
              menuItem.setAttribute("tooltiptext", line);
              menuPopup.appendChild(menuItem);
            }
          } else {
            menuItem = window.document.createXULElement("menuitem");
            menuItem.value = line;
            menuItem.label = line;
            menuItem.setAttribute("tooltiptext", line);
            menuPopup.appendChild(menuItem);
          }
        }
      }
    }
    Zotero.Prefs.set('ai4paper.prompttemplateuserobject', JSON.stringify(templateAliases));
    let menuList = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist");
    menuList && (menuList.value = Zotero.Prefs.get("ai4paper.chatgptprompttemplate"));
    if (Zotero.Prefs.get("ai4paper.enablesvgPaperAI")) {
      let iframeWin = Zotero.AI4Paper.getCurrentReader()._iframeWindow;
      if (iframeWin) {
        let findButton = iframeWin.document.querySelector(".toolbar-button.find");
        Zotero.AI4Paper.addReaderMenuButton_paperAI(iframeWin, findButton);
      }
    }
  },
  'buildPopup_promptList': function (win, popup) {
    if (!popup) return;
    let menuItem,
      child = popup.firstElementChild;
    while (child) {
      child.remove();
      child = popup.firstElementChild;
    }
    let builtInTemplates = ['无', "AI 解读论文 🔒", "论文深度解读 🔒", '论文简要剖析\x20🔒'];
    for (let templateName of builtInTemplates) {
      menuItem = win.document.createXULElement("menuitem");
      menuItem.value = templateName;
      menuItem.label = templateName;
      menuItem.setAttribute("tooltiptext", templateName);
      popup.appendChild(menuItem);
    }
    let userTemplateStr = Zotero.Prefs.get("ai4paper.chatgptprompttemplateuser"),
      templateAliases = [];
    if (userTemplateStr != '') {
      let lines = userTemplateStr.split('\x0a');
      for (let line of lines) {
        if (line != '') {
          line = line.trim();
          if (line.lastIndexOf('👈') === line.length - 0x2) {
            let leftIdx = line.lastIndexOf('👈');
            if (line.lastIndexOf('👉') != -0x1) {
              let rightIdx = line.lastIndexOf('👉'),
                alias = line.substring(rightIdx + 0x2, leftIdx).trim(),
                realTemplate = line.substring(0x0, rightIdx).trim(),
                aliasObj = {
                  'alias': alias,
                  'realTemplate': realTemplate
                };
              templateAliases.push(aliasObj);
              menuItem = win.document.createXULElement("menuitem");
              menuItem.value = alias;
              menuItem.label = alias;
              menuItem.setAttribute("tooltiptext", line);
              popup.appendChild(menuItem);
            } else {
              menuItem = win.document.createXULElement("menuitem");
              menuItem.value = line;
              menuItem.label = line;
              menuItem.setAttribute("tooltiptext", line);
              popup.appendChild(menuItem);
            }
          } else {
            menuItem = win.document.createXULElement("menuitem");
            menuItem.value = line;
            menuItem.label = line;
            menuItem.setAttribute("tooltiptext", line);
            popup.appendChild(menuItem);
          }
        }
      }
    }
    Zotero.Prefs.set('ai4paper.prompttemplateuserobject', JSON.stringify(templateAliases));
  },
  'gptReaderSidePane_setServiceTooltiptext': function (menuElement, labelText) {
    let label;
    !labelText ? label = menuElement.label : label = labelText;
    for (let key of Object.keys(Zotero.AI4Paper.gptCustom_numEmoji)) {
      label === "GPT 自定 " + Zotero.AI4Paper.gptCustom_numEmoji[key] && menuElement.setAttribute("tooltiptext", Zotero.Prefs.get("ai4paper.gptcustomhost" + Zotero.AI4Paper.gptCustom_suffix[key]).trim() ? Zotero.Prefs.get("ai4paper.gptcustomhost" + Zotero.AI4Paper.gptCustom_suffix[key]).trim() + '\x20🤖\x20' + Zotero.Prefs.get("ai4paper.gptcustomModelCustom" + Zotero.AI4Paper.gptCustom_suffix[key]) : "GPT 自定 " + Zotero.AI4Paper.gptCustom_numEmoji[key]);
    }
  },
  'gptReaderSidePane_updateServiceModel': function () {
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) {
      return false;
    }
    let servicePopup = window.document.querySelector('#ai4paper-chatgpt-readerSidePane-chatgpt-service');
    if (!servicePopup) return;
    let serviceMenuList = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-service-menulist"),
      childNodes = servicePopup.childNodes;
    for (let i = 0x0; i < childNodes.length; i++) {
      childNodes[i].label === Zotero.Prefs.get("ai4paper.gptservice") && (serviceMenuList.selectedIndex = i);
      let node = childNodes[i];
      Zotero.AI4Paper.gptReaderSidePane_setServiceTooltiptext(node);
    }
    servicePopup = window.document.querySelector('#ai4paper-chatgpt-readerSidePane-chatgpt-model');
    serviceMenuList = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-model-menulist");
    childNodes = servicePopup.childNodes;
    for (let i = 0x0; i < childNodes.length; i++) {
      childNodes[i].label === Zotero.Prefs.get("ai4paper.gptmodel") && (serviceMenuList.selectedIndex = i);
    }
  },
  'gptReaderSidePane_clearChat': function () {
    let paneWindow = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (paneWindow = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!paneWindow) {
      return;
    }
    if (paneWindow._gptStreamRunning || Zotero.Prefs.get('ai4paper.gptStreamRunning')) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, '❌\x20已有\x20GPT\x20正在进行【Zotero\x20One】', "当前已有 GPT 正在进行中...如有需要，可手动中止后再发起请求。", 'openai');
      return;
    }
    if (Zotero.Prefs.get('ai4paper.gptContinuesChatMode')) {
      Zotero.AI4Paper._data_gptMessagesHistory = '[]';
      let messageContainers = paneWindow.document.querySelectorAll(".message-container");
      messageContainers.forEach(el => el.remove());
      Zotero.AI4Paper._data_gptCurrentUserMessage = JSON.stringify([]);
      paneWindow.document.querySelector('.openaiLogoContainer').style.display = '';
    } else {
      window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").selectedIndex = 0x0;
      paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = '';
      paneWindow.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-response').value = '';
      paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = "Hi，有什么能帮助您吗？";
      paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-space").style.display = "none";
      paneWindow.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-token-used').style.display = "none";
      paneWindow.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-token-used').textContent = '';
      Zotero.Prefs.set("ai4paper.chatgptprompttemplate", '无');
      Zotero.Prefs.set("ai4paper.chatgptprompt", '');
      Zotero.Prefs.set("ai4paper.chatgptresponse", '');
      Zotero.Prefs.set("ai4paper.chatgptresponsetime", "Hi，有什么能帮助您吗？");
    }
    Zotero.AI4Paper.gptReaderSidePane_hiddeScrollBtn(paneWindow);
  },
  'gptReaderSidePane_clearPrompt': function () {
    let paneWindow = null;
    if (window.document.getElementById("ai4paper-chatgpt-readersidepane")) {
      paneWindow = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow;
    }
    if (!paneWindow) return;
    Zotero.Prefs.get('ai4paper.gptContinuesChatMode') ? (window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").selectedIndex = 0x0, Zotero.Prefs.set("ai4paper.chatgptprompttemplate", '无')) : (paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = '', paneWindow.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-response').value = '', Zotero.Prefs.set("ai4paper.chatgptprompt", ''), Zotero.Prefs.set("ai4paper.chatgptresponse", ''));
  },
  'gptReaderSidePane_getFullText': async function (fromMainPane) {
    if (fromMainPane && Zotero_Tabs._selectedID === "zotero-pane") return;
    let paneWindow = null;
    window.document.getElementById('ai4paper-chatgpt-readersidepane') && (paneWindow = window.document.getElementById('ai4paper-chatgpt-readersidepane').contentWindow);
    if (!paneWindow) return;
    let fullText = await Zotero.AI4Paper.getFullText();
    if (fullText && fullText != "notRegularItem") {
      Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? paneWindow.document.getElementById("message-input").value = fullText : paneWindow.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-prompt').value = fullText;
      Zotero.Prefs.set("ai4paper.chatgptprompt", fullText);
    } else {
      if (fullText == 'notRegularItem') return false;else Services.prompt.alert(window, "❌ 出错啦", '获取\x20PDF\x20全文失败！');
    }
  },
  'aiAnalysis_PDFsFromSelection': function () {
    Zotero.AI4Paper.openDialog_importPDFs();
    Zotero.AI4Paper.processTextAreaValue_importPDFs();
  },
  'openDialog_importPDFs': async function () {
    Zotero.AI4Paper._dataOut_selectedPDFsInfo = null;
    let dialogData = {
      'dataIn': null,
      'dataOut': null,
      'deferred': Zotero.Promise.defer(),
      'itemTreeID': "importPDFs-dialog"
    };
    return window.openDialog("chrome://ai4paper/content/selectionDialog/importPDFs.xhtml", '', "chrome,modal,centerscreen,resizable=yes", dialogData), await dialogData.deferred.promise, Zotero.AI4Paper._dataOut_selectedPDFsInfo;
  },
  'processTextAreaValue_importPDFs': async function () {
    let selectedInfo = Zotero.AI4Paper._dataOut_selectedPDFsInfo;
    Zotero.AI4Paper._dataOut_selectedPDFsInfo && (Zotero.AI4Paper._dataOut_lastSelectedPDFsInfo = Zotero.AI4Paper._dataOut_selectedPDFsInfo);
    let attachments = [];
    if (selectedInfo) {
      let lines = selectedInfo.split('\x0a');
      for (let line of lines) {
        if (line != '') {
          line = line.trim();
          if (line.lastIndexOf('🆔') != -0x1) {
            let idIdx = line.lastIndexOf('🆔'),
              itemId = line.substring(idIdx + 0x2).trim(),
              foundItem = Zotero.AI4Paper.findItemByIDORKey(itemId);
            foundItem && attachments.push(foundItem);
          }
        }
      }
    } else {
      Zotero.AI4Paper.showProgressWindow(0x7d0, '导入\x20PDFs\x20全文【Zotero\x20One】', "未选择任何条目！");
    }
    if (attachments.length) {
      let pdfsJSON = await Zotero.AI4Paper.aiAnalysis_getPDFsJSON(attachments);
      if (pdfsJSON) Zotero.AI4Paper.import2MessageInputBox(Zotero.AI4Paper.aiAnalysis_prompt + '\x0a' + pdfsJSON);else {
        Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 导入 PDFs 全文【AI4paper】", "未发现可导入的全文！");
      }
    }
  },
  'aiAnalysis_getPDFsJSON': async function (items) {
    let result = {
      'summary': {
        'total\x20number\x20of\x20papers（全部文献数量）': items.length
      }
    };
    result.paperDetails = {};
    let count = 0x0;
    for (let item of items) {
      let attachmentText = await item.attachmentText,
        paperInfo,
        parentItem = item.parentItem;
      parentItem && parentItem.isRegularItem() ? paperInfo = {
        'title': parentItem.getField('title'),
        'year': parentItem.getField("year"),
        'authors': Zotero.AI4Paper.getYAMLProp_creators(parentItem),
        'itemType': parentItem.itemType,
        'publicationTitle': parentItem.getField('publicationTitle'),
        'impactFactor': parentItem.getField("libraryCatalog").split('(')[0x0].trim(),
        'itemLink': '[' + Zotero.AI4Paper.getItemZoteroLink(item) + '](' + Zotero.AI4Paper.getItemZoteroLink(item) + ')',
        'fulltext': attachmentText
      } : paperInfo = {
        'title': item.attachmentFilename,
        'itemType': item.itemType,
        'contentType': item.attachmentContentType,
        'itemLink': '[' + Zotero.AI4Paper.getItemZoteroLink(item) + '](' + Zotero.AI4Paper.getItemZoteroLink(item) + ')',
        'fulltext': attachmentText
      };
      result.paperDetails[Number(count) + 0x1] = paperInfo;
      count++;
    }
    return JSON.stringify(result, null, 0x2);
  },
  'gptReaderSidePane_getAbstract': function () {
    let paneWindow = null;
    if (window.document.getElementById("ai4paper-chatgpt-readersidepane")) {
      paneWindow = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow;
    }
    if (!paneWindow) return;
    let abstractText = Zotero.AI4Paper.getAbstract();
    abstractText ? (Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? paneWindow.document.getElementById("message-input").value = abstractText : paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = abstractText, Zotero.Prefs.set("ai4paper.chatgptprompt", abstractText)) : Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 未获取到摘要【AI4paper】", "获取摘要失败，请检查当前文献！", "openai");
  },
  'paperAI': async function (useSelectedTemplate) {
    if (Zotero_Tabs._selectedID === "zotero-pane") {
      window.alert("当前，本操作仅适用于阅读器界面。");
      return;
    }
    if (!Zotero.Prefs.get('ai4paper.gptContinuesChatMode')) {
      window.alert("❌ 当前，一键【AI 解读论文】功能仅支持【连续对话模式】下的【GPT 侧边栏】！");
      return;
    }
    if (Zotero.Prefs.get("ai4paper.gptStreamRunning")) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, '❌\x20已有\x20GPT\x20正在进行【Zotero\x20One】', "当前已有 GPT 正在进行中...如有需要，可手动中止后再发起请求。", "gemini");
      return;
    }
    let paneWindow = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (paneWindow = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!paneWindow) {
      window.alert("请先开启【GPT 侧边栏】！");
      return;
    }
    let fullText = await Zotero.AI4Paper.getFullText();
    if (fullText && fullText != "notRegularItem") {
      if (Zotero.Prefs.get('ai4paper.gptContinuesChatMode')) {
        if (!useSelectedTemplate || useSelectedTemplate && window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").value === '无') {
          let defaultTemplate = "AI 解读论文 🔒";
          window.document.querySelector('#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist').value = defaultTemplate;
          Zotero.Prefs.set('ai4paper.chatgptprompttemplate', defaultTemplate);
        }
        paneWindow.document.getElementById("message-input").value = fullText;
        Zotero.Prefs.get('ai4paper.clearChatOnPaperAI') && !Zotero.AI4Paper._notClearChatOnPaperAI && Zotero.AI4Paper.gptReaderSidePane_clearChat();
        Zotero.AI4Paper._notClearChatOnPaperAI = false;
        Zotero.Prefs.get('ai4paper.createAIReadingNoteOnPaperAI') ? paneWindow._fromPaperAI = true : paneWindow._fromPaperAI = false;
        paneWindow._hasFullText = true;
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_send();
        paneWindow._hasFullText = false;
      }
    } else {
      if (fullText == "notRegularItem") return false;else Services.prompt.alert(window, "❌ 出错啦", "获取 PDF 全文失败！");
    }
  },
  'aiAnalysis_importAnnotationsBatch_handler': function () {
    Zotero.AI4Paper.openDialog_importAnnotations();
    Zotero.AI4Paper.processTextAreaValue_importAnnotations();
  },
  'aiAnalysis_importAnnotationsBatch_advanced__handler': function () {
    Zotero.AI4Paper.openDialogAdvancedSearch_importAnnotations();
    Zotero.AI4Paper.processAdvancedSearch_importAnnotations();
  },
  'gptReaderSidePane_importAnnotations': async function () {
    let annotationsJSON = await Zotero.AI4Paper.getAnnotationsJSON();
    annotationsJSON ? Zotero.AI4Paper.import2MessageInputBox(annotationsJSON) : Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 导入注释【AI4paper】", "未发现可导入的注释！", "openai");
  },
  'processTextAreaValue_importAnnotations': async function () {
    let selectedInfo = Zotero.AI4Paper._dataOut_selectedItemsInfo;
    Zotero.AI4Paper._dataOut_selectedItemsInfo && (Zotero.AI4Paper._dataOut_lastSelectedItemsInfo = Zotero.AI4Paper._dataOut_selectedItemsInfo);
    let items = [];
    if (selectedInfo) {
      let lines = selectedInfo.split('\x0a');
      for (let line of lines) {
        if (line != '') {
          line = line.trim();
          if (line.lastIndexOf('🆔') != -0x1) {
            let idIdx = line.lastIndexOf('🆔'),
              itemId = line.substring(idIdx + 0x2).trim(),
              foundItem = Zotero.Items.get(itemId);
            foundItem && items.push(foundItem);
          }
        }
      }
    } else Zotero.AI4Paper.showProgressWindow(0x7d0, "导入注释【AI4paper】", "未选择任何条目！");
    if (items.length) {
      let batchJSON = await Zotero.AI4Paper.getAnnotationsJSON_batch(items);
      if (batchJSON) {
        Zotero.AI4Paper.import2MessageInputBox(batchJSON);
      } else Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 导入注释【AI4paper】", "未发现可导入的注释！");
    }
  },
  'processAdvancedSearch_importAnnotations': async function () {
    Zotero.AI4Paper._dataOut_selectedItemsAdvancedSearch.length && (Zotero.AI4Paper._dataOut_lastSelectedItemsAdvancedSearch = Zotero.AI4Paper._dataOut_selectedItemsAdvancedSearch);
    let selectedItems = Zotero.AI4Paper._dataOut_selectedItemsAdvancedSearch;
    if (!selectedItems.length) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, '导入注释【Zotero\x20One】', "未选择任何条目！");
      return;
    }
    let batchJSON = await Zotero.AI4Paper.getAnnotationsJSON_batch(selectedItems);
    batchJSON ? Zotero.AI4Paper.import2MessageInputBox(batchJSON) : Zotero.AI4Paper.showProgressWindow(0x7d0, '❌\x20导入注释【Zotero\x20One】', '未发现可导入的注释！');
  },
  'updateImportAnnotationsAdvancedSearchHistory': function (searchText) {
    let historyStr = Zotero.Prefs.get('ai4paper.importAnnotationsAdvancedHistory'),
      historyArr = historyStr.split("😊🎈🍓");
    if (!historyArr.includes(searchText)) {
      historyArr.length === 0x1 && historyArr[0x0] === '' ? historyArr = [searchText] : historyArr.unshift(searchText);
    } else {
      let idx = historyArr.indexOf(searchText);
      historyArr.splice(idx, 0x1);
      historyArr.unshift(searchText);
    }
    let hasDOI = Zotero.AI4Paper.letDOI(),
      trimmedHistory = [];
    for (let i = 0x0; i < 0x14; i++) {
      historyArr[i] != undefined && trimmedHistory.push(historyArr[i]);
    }
    hasDOI && Zotero.Prefs.set("ai4paper.importAnnotationsAdvancedHistory", trimmedHistory.join("😊🎈🍓"));
  },
  'import2MessageInputBox': async function (text) {
    let paneWindow = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!paneWindow) {
      Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 请打开【GPT侧边栏】", '请先打开【GPT侧边栏】！');
      return;
    }
    text && (Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? paneWindow.document.getElementById("message-input").value = text : paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = text);
  },
  'openDialog_importAnnotations': async function () {
    Zotero.AI4Paper._dataOut_selectedItemsInfo = null;
    let dialogData = {
      'dataIn': null,
      'dataOut': null,
      'deferred': Zotero.Promise.defer(),
      'itemTreeID': "importAnnotations-dialog"
    };
    return window.openDialog('chrome://ai4paper/content/selectionDialog/importAnnotations.xhtml', '', 'chrome,modal,centerscreen,resizable=yes', dialogData), await dialogData.deferred.promise, Zotero.AI4Paper._dataOut_selectedItemsInfo;
  },
  'openDialogAdvancedSearch_importAnnotations': async function (defaultTag) {
    Zotero.AI4Paper._dataOut_selectedItemsAdvancedSearch = [];
    var search = new Zotero.Search();
    search.libraryID = 0x1;
    search.addCondition("tag", "contains", defaultTag ? defaultTag : '');
    var dialogData = {
      'dataIn': {
        'search': search
      },
      'dataOut': null
    };
    window.openDialog("chrome://ai4paper/content/selectionDialog/importAnnotationsAdvanced.xhtml", '', "chrome,modal,dialog=no,centerscreen", dialogData);
    return dialogData.out;
    return Zotero.AI4Paper._dataOut_selectedItemsAdvancedSearch;
  },
  'getFullText': async function () {
    let tabId = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabId),
      fullText = null;
    if (reader) {
      let itemId = reader.itemID;
      var item = Zotero.Items.get(itemId);
      if (["application/pdf", "text/html", "application/epub+zip"].includes(item.attachmentContentType)) {
        try {
          if (!Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
            Zotero.AI4Paper.showProgressWindow(0x7d0, '正在获取【PDF/Epub/网页快照】全文\x20【Zotero\x20One】', "如果 PDF 为扫描本，或者格式特殊，可能导致获取时间较长，或者 Zotero 转圈圈/卡顿数十秒！");
          }
          fullText = await item.attachmentText;
        } catch (e) {
          return false;
        }
        if (fullText) {
          return fullText;
        } else return false;
      }
    } else {
      var item = ZoteroPane.getSelectedItems()[0x0];
    }
    if (item === undefined) return Services.prompt.alert(window, "❌ 温馨提示：", '请选择一个常规条目！'), 'notRegularItem';
    if (item.isRegularItem()) {
      let attachmentIds = item.getAttachments();
      for (let attId of attachmentIds) {
        let attachment = Zotero.Items.get(attId);
        if (["application/pdf", "text/html", "application/epub+zip"].includes(attachment.attachmentContentType)) {
          try {
            if (!Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
              Zotero.AI4Paper.showProgressWindow(0x7d0, "正在获取【PDF/Epub/网页快照】全文 【AI4paper】", "如果 PDF 为扫描本，或者格式特殊，可能导致获取时间较长，或者 Zotero 转圈圈/卡顿数十秒！");
            }
            fullText = await attachment.attachmentText;
          } catch (e) {
            return false;
          }
          if (fullText) {
            return fullText;
          } else {
            return false;
          }
        }
      }
      return false;
    } else {
      if (item.isAttachment()) {
        if (['application/pdf', 'text/html', "application/epub+zip"].includes(item.attachmentContentType)) {
          try {
            !Zotero.Prefs.get('ai4paper.gptContinuesChatMode') && Zotero.AI4Paper.showProgressWindow(0x7d0, "正在获取【PDF/Epub/网页快照】全文 【AI4paper】", "如果 PDF 为扫描本，或者格式特殊，可能导致获取时间较长，或者 Zotero 转圈圈/卡顿数十秒！");
            fullText = await item.attachmentText;
          } catch (e) {
            return false;
          }
          return fullText ? fullText : false;
        }
        return false;
      } else return Services.prompt.alert(window, "❌ 温馨提示：", "您选择的不是常规条目！"), "notRegularItem";
    }
  },
  'getAbstract': function () {
    let tabId = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabId);
    if (reader) {
      let itemId = reader.itemID;
      var item = Zotero.Items.get(itemId);
      item && item.parentItemID && (itemId = item.parentItemID, item = Zotero.Items.get(itemId));
    } else var item = ZoteroPane.getSelectedItems()[0x0];
    if (item === undefined) return window.alert('请先选择一个条目！'), false;
    if (item.isRegularItem()) {
      let abstractNote = item.getField("abstractNote");
      if (abstractNote.indexOf("【摘要翻译】") != -0x1) {
        let transIdx = abstractNote.indexOf("【摘要翻译】");
        abstractNote = abstractNote.substring(0x0, transIdx);
        if (abstractNote.lastIndexOf('\x0a\x0a') === abstractNote.length - 0x2) abstractNote = abstractNote.substring(0x0, abstractNote.length - 0x2);else abstractNote.lastIndexOf('\x0a') === abstractNote.length - 0x1 && (abstractNote = abstractNote.substring(0x0, abstractNote.length - 0x1));
      }
      return abstractNote;
    } else {
      return window.alert('您选择的不是常规条目！'), false;
    }
    return false;
  },
  'getAnnotationsJSON': async function () {
    let tabId = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabId),
      result = {},
      annotationList = [],
      colorMap = {
        '#ffd400': '黄色',
        '#ff6666': '红色',
        '#5fb236': '绿色',
        '#2ea8e5': '蓝色',
        '#a28ae5': '紫色',
        '#e56eee': "洋红色",
        '#f19837': '橘色',
        '#aaaaaa': '灰色'
      };
    if (reader) {
      var attachment = Zotero.Items.get(reader.itemID);
      if (["application/pdf", "text/html", "application/epub+zip"].includes(attachment.attachmentContentType)) {
        if (attachment.attachmentLinkMode === 0x3) {
          return false;
        }
        var annotations = await attachment.getAnnotations();
        if (annotations.length) {
          for (let annot of annotations) {
            let tags = annot.getTags(),
              tagList = [],
              tagsStr = '';
            if (tags.length) {
              for (let tagObj of tags) {
                tagList.push('#' + tagObj.tag);
              }
              tagsStr = tagList.join('\x20');
            }
            let comment = '' + annot.annotationComment,
              text = '' + annot.annotationText,
              type = '' + annot.annotationType,
              colorLabel = annot.annotationColor + ':\x20' + colorMap[annot.annotationColor],
              annotObj = {
                'annotationType': type,
                'annotationColor': colorLabel,
                'annotationText': text,
                'annotationComment': comment,
                'annotationTags': tagsStr
              };
            annotationList.push(annotObj);
          }
          let refKey = "ref-1";
          return result[refKey] = {
            'title': attachment.getField("title"),
            'annotations': annotationList
          }, JSON.stringify(result, null, 0x2);
        }
      }
    }
    return false;
  },
  'getAnnotationsJSON_batch': async function (items) {
    let result = {},
      annotationList = [],
      colorMap = {
        '#ffd400': '黄色',
        '#ff6666': '红色',
        '#5fb236': '绿色',
        '#2ea8e5': '蓝色',
        '#a28ae5': '紫色',
        '#e56eee': "洋红色",
        '#f19837': '橘色',
        '#aaaaaa': '灰色'
      },
      refIndex = 0x0;
    for (let item of items) {
      refIndex++;
      if (['application/pdf', "text/html", 'application/epub+zip'].includes(item.attachmentContentType)) {
        if (item.attachmentLinkMode === 0x3) {
          return false;
        }
        var annotations = await item.getAnnotations();
        if (annotations.length) {
          for (let annot of annotations) {
            let tags = annot.getTags(),
              tagList = [],
              tagsStr = '';
            if (tags.length) {
              for (let tagObj of tags) {
                tagList.push('#' + tagObj.tag);
              }
              tagsStr = tagList.join('\x20');
            }
            let comment = '' + annot.annotationComment,
              text = '' + annot.annotationText,
              type = '' + annot.annotationType,
              colorLabel = annot.annotationColor + ':\x20' + colorMap[annot.annotationColor],
              annotObj = {
                'annotationType': type,
                'annotationColor': colorLabel,
                'annotationText': text,
                'annotationComment': comment,
                'annotationTags': tagsStr
              };
            annotationList.push(annotObj);
          }
          let refKey = "ref-" + refIndex;
          result[refKey] = {
            'title': item.getField("title"),
            'annotations': annotationList
          };
          annotationList = [];
        }
      }
    }
    if (JSON.stringify(result) !== '{}') return JSON.stringify(result, null, 0x2);
    return false;
  },
  'gptReaderSidePane_setUIHeight': function (promptHeight, responseHeight) {
    let paneWindow = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (paneWindow = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!paneWindow) {
      return;
    }
    if (Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
      if (Zotero.Prefs.get("ai4paper.gptEnableCustomChatModeGPTUIHeight")) {
        paneWindow.document.getElementById("message-input").style.height = Zotero.Prefs.get('ai4paper.gptCustomChatModePromptAreaHeight') + 'px';
        paneWindow.document.getElementById('chat-container').style.height = Zotero.Prefs.get("ai4paper.gptCustomChatModeResponseAreaHeight") + 'px';
        let totalHeight = parseInt(Zotero.Prefs.get('ai4paper.gptCustomChatModePromptAreaHeight')) + parseInt(Zotero.Prefs.get("ai4paper.gptCustomChatModeResponseAreaHeight"));
        totalHeight = totalHeight < window.screen.height ? totalHeight + 0x8 : window.screen.height;
        window.document.getElementById("ai4paper-chatgpt-readersidepane").style.minHeight = totalHeight + 'px';
      } else {
        paneWindow.document.getElementById("message-input").style.height = promptHeight + 'px';
        paneWindow.document.getElementById('chat-container').style.height = responseHeight + 'px';
        let totalHeight = parseInt(promptHeight) + parseInt(responseHeight);
        totalHeight = totalHeight < window.screen.height ? totalHeight + 0x8 : window.screen.height;
        window.document.getElementById("ai4paper-chatgpt-readersidepane").style.minHeight = totalHeight + 'px';
      }
    } else {
      if (Zotero.Prefs.get("ai4paper.gptEnableCustomGPTUIHeight")) {
        paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").style.height = Zotero.Prefs.get("ai4paper.gptCustomPromptAreaHeight") + 'px';
        paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").style.height = Zotero.Prefs.get("ai4paper.gptCustomResponseAreaHeight") + 'px';
        let totalHeight = parseInt(Zotero.Prefs.get("ai4paper.gptCustomPromptAreaHeight")) + parseInt(Zotero.Prefs.get("ai4paper.gptCustomResponseAreaHeight"));
        totalHeight = totalHeight < window.screen.height ? totalHeight + 0x46 : window.screen.height;
        window.document.getElementById("ai4paper-chatgpt-readersidepane").style.minHeight = totalHeight + 'px';
      } else {
        paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").style.height = promptHeight + 'px';
        paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").style.height = responseHeight + 'px';
        let totalHeight = parseInt(promptHeight) + parseInt(responseHeight);
        totalHeight = totalHeight < window.screen.height ? totalHeight + 0x46 : window.screen.height;
        window.document.getElementById('ai4paper-chatgpt-readersidepane').style.minHeight = totalHeight + 'px';
      }
    }
  },
  'calculate_iframeHeight': function () {
    let screenHeight = window.screen.height,
      promptAreaHeight,
      responseAreaHeight;
    if (Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
      !Zotero.Prefs.get("ai4paper.gptEnableCustomChatModeGPTUIHeight") ? parseInt(screenHeight) <= 0x3e8 ? (promptAreaHeight = screenHeight * 0.185, responseAreaHeight = screenHeight * 0.446) : (promptAreaHeight = screenHeight * 0.173, responseAreaHeight = screenHeight * 0.555) : (promptAreaHeight = Zotero.Prefs.get("ai4paper.gptCustomChatModePromptAreaHeight"), responseAreaHeight = Zotero.Prefs.get("ai4paper.gptCustomChatModeResponseAreaHeight"));
      let totalHeight = parseInt(promptAreaHeight) + parseInt(responseAreaHeight);
      return totalHeight < window.screen.height ? totalHeight + 0x8 : window.screen.height;
    } else {
      !Zotero.Prefs.get("ai4paper.gptEnableCustomGPTUIHeight") ? parseInt(screenHeight) <= 0x3e8 ? (promptAreaHeight = screenHeight * 0.27, responseAreaHeight = screenHeight * 0.3) : (promptAreaHeight = screenHeight * 0.29, responseAreaHeight = screenHeight * 0.395) : (promptAreaHeight = Zotero.Prefs.get("ai4paper.gptCustomPromptAreaHeight"), responseAreaHeight = Zotero.Prefs.get('ai4paper.gptCustomResponseAreaHeight'));
      let totalHeight = parseInt(promptAreaHeight) + parseInt(responseAreaHeight);
      return totalHeight < window.screen.height ? totalHeight + 0x46 : window.screen.height;
    }
  },
  'getTabsIframeWindow': function () {
    let iframeWindows = [],
      tabs = Zotero.getMainWindow().Zotero_Tabs._tabs;
    for (let tab of tabs) {
      if (tab.id != 'zotero-pane') {
        window.document.getElementById("ai4paper-chatgpt-readersidepane" + tab.id) && iframeWindows.push(window.document.getElementById("ai4paper-chatgpt-readersidepane" + tab.id).contentWindow);
      }
    }
    return iframeWindows;
  },
  'getTabsCont': function () {
    let contexts = [],
      unused = [],
      tabs = Zotero.getMainWindow().Zotero_Tabs._tabs;
    for (let tab of tabs) {
      if (tab.id != "zotero-pane") {
        if (window.document.getElementById(tab.id + "-context")) {
          contexts.push(window.document.getElementById(tab.id + "-context"));
        }
      }
    }
    return contexts;
  },
  'updateChatGPTReaderSidePane': function () {
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    let paneWindow = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!paneWindow) return;
    paneWindow._marker4ScrollTop = false;
    Zotero.AI4Paper.gptReaderSidePane_updatePromptTemplate();
    Zotero.AI4Paper.gptReaderSidePane_updateServiceModel();
    Zotero.AI4Paper.enableGPTFuncButtons();
    if (Zotero.Prefs.get('ai4paper.gptContinuesChatMode')) {
      Zotero.AI4Paper.gptReaderSidePane_updateSendButtonState();
      if (!paneWindow._gptStreamRunning) {
        let messageContainers = paneWindow.document.querySelectorAll('.message-container');
        messageContainers.forEach(el => el.remove());
        let messagesHistory = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory);
        if (!messagesHistory.length) paneWindow.document.querySelector('.openaiLogoContainer').style.display = '';else {
          paneWindow.document.querySelector(".openaiLogoContainer").style.display = "none";
          for (let msg of messagesHistory) {
            let chatContainer = paneWindow.document.getElementById("chat-container"),
              msgElement = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(msg.content, msg.role, null, msg);
            chatContainer.appendChild(msgElement);
            !Zotero.Prefs.get("ai4paper.gptPinMessage") && (chatContainer.scrollTop = chatContainer.scrollHeight);
          }
        }
        let currentUserMessages = JSON.parse(Zotero.AI4Paper._data_gptCurrentUserMessage);
        if (currentUserMessages.length) {
          paneWindow.document.querySelector(".openaiLogoContainer").style.display = 'none';
          for (let msg of currentUserMessages) {
            let chatContainer = paneWindow.document.getElementById("chat-container"),
              msgElement = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(msg.content, msg.role, null, msg);
            chatContainer.appendChild(msgElement);
            !Zotero.Prefs.get("ai4paper.gptPinMessage") && (chatContainer.scrollTop = chatContainer.scrollHeight);
          }
        }
      }
    } else {
      paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = Zotero.Prefs.get("ai4paper.chatgptprompt");
      paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = Zotero.Prefs.get("ai4paper.chatgptresponse");
      paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = Zotero.Prefs.get('ai4paper.chatgptresponsetime');
      paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").style.fontSize = Zotero.Prefs.get('ai4paper.gptSidePaneFontSize');
      paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").style.fontSize = Zotero.Prefs.get("ai4paper.gptSidePaneFontSize");
      paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent === "正在响应..." && (paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-space").style.display = "none", paneWindow.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-token-used').style.display = "none", paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").textContent = '');
      Zotero.AI4Paper.gptReaderSidePane_updateSendButtonState();
    }
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_enhanceMessageElem();
    Zotero.AI4Paper.enableGPTQuickButtons();
  },
  'onClickButton_ChatGPT': async function (promptText) {
    Zotero.Prefs.set('ai4paper.chatgptprompt', promptText);
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    let paneWindow = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (paneWindow = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!paneWindow) return;
    if (Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
      let existingText = paneWindow.document.getElementById("message-input").value;
      Zotero.Prefs.get('ai4paper.gptMergeSelectedText') ? (paneWindow.document.getElementById("message-input").value = '' + (existingText ? existingText + '\x20' : '') + promptText, Zotero.AI4Paper.showProgressWindow(0x3e8, "✅ GPT Prompt 拼接成功【AI4paper】", "成功拼接！", "openai")) : paneWindow.document.getElementById("message-input").value = promptText;
    } else {
      let existingText = paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value;
      if (Zotero.Prefs.get("ai4paper.gptMergeSelectedText")) {
        paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = '' + (existingText ? existingText + '\x20' : '') + promptText;
        Zotero.AI4Paper.showProgressWindow(0x3e8, "✅ GPT Prompt 拼接成功【AI4paper】", "成功拼接！", 'openai');
      } else paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = promptText;
    }
  },
  'onClickButton_nowChatGPT': async function (promptText) {
    Zotero.Prefs.set("ai4paper.chatgptprompt", promptText);
    if (!Zotero.Prefs.get('ai4paper.gptviewReaderSidepane')) return false;
    let paneWindow = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (paneWindow = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!paneWindow) return;
    Zotero.Prefs.get('ai4paper.gptContinuesChatMode') ? (paneWindow.document.getElementById("message-input").value = promptText, Zotero.AI4Paper.gptReaderSidePane_ChatMode_send()) : (paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = promptText, Zotero.AI4Paper.gptReaderSidePane_send());
  },
  'go2ChatGPTReaderSidePane': function () {
    let tabId = Zotero_Tabs._selectedID;
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    const contextEl = window.document.getElementById(tabId + "-context");
    if (contextEl) {
      const tabsEl = contextEl.querySelector('tabs'),
        tabBox = contextEl.querySelector("tabbox"),
        tabPanels = contextEl.querySelector('tabpanels');
      let panels = tabPanels.querySelectorAll("tabpanel"),
        panelIdx = 0x0;
      for (let panel of panels) {
        panelIdx++;
        panel.querySelector("#ai4paper-chatgpt-readersidepane" + tabId) && (tabBox.selectedIndex = panelIdx - 0x1);
      }
    }
  },
  'checkChatGPTReaderSidePane': function () {
    let tabId = Zotero_Tabs._selectedID;
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) {
      return "disable";
    }
    const contextEl = window.document.getElementById(tabId + '-context');
    if (contextEl) {
      const tabsEl = contextEl.querySelector("tabs"),
        tabBox = contextEl.querySelector('tabbox'),
        tabPanels = contextEl.querySelector('tabpanels');
      let panels = tabPanels.querySelectorAll("tabpanel"),
        panelIdx = 0x0;
      for (let panel of panels) {
        panelIdx++;
        if (panel.querySelector("#ai4paper-chatgpt-readersidepane" + tabId)) {
          if (tabBox.selectedIndex === panelIdx - 0x1) return true;
        }
      }
    }
    return 'not';
  },
  'visitChatGPT': function () {
    let chatUrl = "https://chat.openai.com";
    ZoteroPane.loadURI(chatUrl);
  },
  'enableGPTFuncButtons': function () {
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    window.document.querySelector("#chatgpt-readerSidePane-clear-icon").hidden = !Zotero.Prefs.get("ai4paper.gptFuncButtonClearChat");
    window.document.querySelector("#chatgpt-readerSidePane-fulltext-icon").hidden = !Zotero.Prefs.get("ai4paper.gptFuncButtonImportFulltext");
    window.document.querySelector("#chatgpt-readerSidePane-abstract-icon").hidden = !Zotero.Prefs.get("ai4paper.gptFuncButtonImportAbstract");
    window.document.querySelector("#chatgpt-readerSidePane-aiAnalysis-icon").hidden = !Zotero.Prefs.get("ai4paper.gptFuncButtonAIAnalysis");
    window.document.querySelector("#chatgpt-readerSidePane-importAIReading-icon").hidden = !Zotero.Prefs.get('ai4paper.gptFuncButtonImportAIReading');
    window.document.querySelector("#chatgpt-readerSidePane-locateAIReadingNotes-icon").hidden = !Zotero.Prefs.get("ai4paper.gptFuncButtonLocateAIReadingNotes");
    Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? window.document.querySelector('#chatgpt-readerSidePane-addtonote-icon').hidden = true : window.document.querySelector("#chatgpt-readerSidePane-addtonote-icon").hidden = !Zotero.Prefs.get("ai4paper.gptFuncButtonAddNotes");
  },
  'enableGPTQuickButtons': function () {
    let paneWindow = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!paneWindow) return false;
    for (let btnName of Zotero.AI4Paper.messageQuickButtons) {
      paneWindow.document.querySelectorAll(".quickButton-" + btnName).forEach(el => el.style.display = Zotero.Prefs.get('ai4paper.gptQuickButton' + btnName) ? '' : 'none');
    }
  },
  'gptReaderSidePane_addChatGPTNoteInit': function () {
    if (!Zotero.Prefs.get('ai4paper.gptviewReaderSidepane')) return false;
    let paneWindow = null;
    if (window.document.getElementById("ai4paper-chatgpt-readersidepane")) {
      paneWindow = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow;
    }
    if (!paneWindow) return;
    let promptValue = paneWindow.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-prompt').value,
      templateValue = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").value,
      userTemplates = JSON.parse(Zotero.Prefs.get('ai4paper.prompttemplateuserobject')),
      aliasFound = false;
    for (let tmpl of userTemplates) {
      tmpl.alias === templateValue.trim() && !aliasFound && (templateValue = tmpl.realTemplate, aliasFound = true);
    }
    if (templateValue === '无' || templateValue === '') {
      if (promptValue.trim() === '') {
        let confirmed = Services.prompt.confirm(window, "❌ 当前对话为空", "提问区为空，是否确认继续添加笔记？");
        if (!confirmed) return false;else var combinedPrompt = '' + promptValue;
      } else {
        var combinedPrompt = '' + promptValue;
      }
    } else {
      if (promptValue != '') {
        var combinedPrompt = templateValue + ':\x20' + promptValue;
      } else var combinedPrompt = templateValue;
    }
    let responseValue = paneWindow.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value;
    Zotero.AI4Paper.runAuthor() && Zotero.AI4Paper.addChatGPTNote(combinedPrompt, responseValue);
  },
  'addChatGPTNote': async function (promptText, responseText) {
    let tabId = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabId);
    if (reader) {
      let itemId = reader.itemID;
      var item = Zotero.Items.get(itemId);
      if (item && item.parentItemID) {
        itemId = item.parentItemID;
        item = Zotero.Items.get(itemId);
      } else return Services.prompt.alert(window, "❌ 请重新选择", "当前文献无父条目，请创建父条目或选择其他文献！否则 ChatGPT 笔记无法保存。"), false;
    } else var item = ZoteroPane.getSelectedItems()[0x0];
    if (item === undefined) return Services.prompt.alert(window, '❌\x20温馨提示：', "请先选择一个条目！"), false;
    if (!item.isRegularItem()) return Services.prompt.alert(window, "❌ 温馨提示：", "您选择的不是常规条目！"), false;
    let tagsList = [],
      itemTitle = item.getField("title"),
      dialogResult = Zotero.AI4Paper.openDialogByType_modal('exportGPTNotes', itemTitle),
      dialogTags = dialogResult.tags;
    if (dialogResult === 'cancel') {
      return false;
    }
    if (dialogResult.check) {
      if (dialogResult.item_title === '') {
        return Services.prompt.alert(window, '❌\x20出错了', '未选择改绑条目，或改绑条目尚未设定！'), false;
      }
      let selectedTitle = dialogResult.item_title,
        bindItems = JSON.parse(Zotero.Prefs.get('ai4paper.gptNotesAttachItemsObject')),
        bindFound = false;
      for (let bindItem of bindItems) {
        if (bindItem.title === selectedTitle.trim() && !bindFound) {
          item = Zotero.AI4Paper.findItemByIDORKey(bindItem.id);
          if (item) Zotero.Prefs.set("ai4paper.gptNotesLastSelectedItem", selectedTitle);else return Services.prompt.alert(window, "❌ 出错了", "您选择的改绑文献不存在！"), false;
          bindFound = true;
        }
      }
      if (!bindFound) {
        return Services.prompt.alert(window, "❌ 出错了", '您选择的改绑文献不在所设定的笔记改绑条目中！'), false;
      }
    }
    if (dialogTags) {
      dialogTags = dialogTags.split('\x0a');
      for (let tag of dialogTags) {
        tag != '' && (tagsList.push(tag), Zotero.AI4Paper.add2GPTNoteTags(tag), Zotero.AI4Paper.add2RecentGPTNoteTags(tag));
      }
    }
    var noteItem = await Zotero.AI4Paper.createNoteItem_basedOnTag(item, "/ChatGPT");
    if (noteItem) {
      Zotero.AI4Paper.updateChatGPTRecordNote(item, noteItem, promptText, responseText, tagsList);
      Zotero.AI4Paper.focusReaderSidePane("gpt");
    }
  },
  'saveGPTCurrentUserMessage': function (message) {
    try {
      Zotero.AI4Paper._data_gptCurrentUserMessage = JSON.stringify([message]);
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'resolveMessagesHistory': function () {
    let messages = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory);
    return messages = messages.map(msg => {
      let role = msg.role,
        content = msg.content,
        resolved = {
          'role': role,
          'content': content
        };
      return resolved;
    }), messages;
  },
  'chatWithNewBing': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    var edgePath = Zotero.Prefs.get("ai4paper.microsoftedgeapppath");
    if (!edgePath) return window.alert("请先前往【Zotero 设置 --> AI4paper --> 拓展 --> Open with Browser】设定 Microsoft Edge 应用路径。"), false;
    if (!(await OS.File.exists(edgePath))) return window.alert('您设定的\x20Microsoft\x20Edge\x20应用不存在！'), false;
    let tabId = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabId);
    if (reader) {
      let itemId = reader.itemID,
        attachment = Zotero.Items.get(itemId);
      if (attachment.isAttachment()) {
        var filePath = await attachment.getFilePathAsync();
        if (attachment.attachmentContentType == "application/pdf") {
          if (filePath && edgePath) {
            if (Zotero.AI4Paper.runAuthor()) {
              Zotero.launchFileWithApplication(filePath, edgePath);
              if (Zotero.Prefs.get("ai4paper.enableNewBingTemplate") && Zotero.Prefs.get("ai4paper.newBingTemplate")) {
                Zotero.AI4Paper.copy2Clipboard(Zotero.Prefs.get("ai4paper.newBingTemplate"));
              }
            }
            return false;
          }
        }
      }
    } else {
      let selectedItems = ZoteroPane.getSelectedItems();
      for (let selectedItem of selectedItems) {
        if (selectedItem && !selectedItem.isNote()) {
          if (selectedItem.isRegularItem()) {
            let attachmentIds = selectedItem.getAttachments();
            for (let attId of attachmentIds) {
              let attachment = Zotero.Items.get(attId);
              var filePath = await attachment.getFilePathAsync();
              if (attachment.attachmentContentType == "application/pdf") {
                if (filePath && edgePath) {
                  if (Zotero.AI4Paper.runAuthor()) {
                    Zotero.launchFileWithApplication(filePath, edgePath);
                    Zotero.Prefs.get("ai4paper.enableNewBingTemplate") && Zotero.Prefs.get("ai4paper.newBingTemplate") && Zotero.AI4Paper.copy2Clipboard(Zotero.Prefs.get('ai4paper.newBingTemplate'));
                  }
                }
              }
            }
          }
          if (selectedItem.isAttachment()) {
            var filePath = await selectedItem.getFilePathAsync();
            if (selectedItem.attachmentContentType == "application/pdf") {
              if (filePath && edgePath) {
                if (Zotero.AI4Paper.runAuthor()) {
                  Zotero.launchFileWithApplication(filePath, edgePath);
                }
                Zotero.Prefs.get("ai4paper.enableNewBingTemplate") && Zotero.Prefs.get("ai4paper.newBingTemplate") && Zotero.AI4Paper.copy2Clipboard(Zotero.Prefs.get('ai4paper.newBingTemplate'));
              }
            }
          }
        }
      }
    }
  },
});
