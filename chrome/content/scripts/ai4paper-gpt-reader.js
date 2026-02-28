Object.assign(Zotero.AI4Paper, {
  'gptReaderSidePane_updatePromptTemplate': function () {
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    let var4188,
      var4189 = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template");
    if (!var4189) return;
    let var4190 = var4189.firstElementChild;
    while (var4190) {
      var4190.remove();
      var4190 = var4189.firstElementChild;
    }
    let var4191 = ['无', "AI 解读论文 🔒", "论文深度解读 🔒", '论文简要剖析\x20🔒'];
    for (let var4192 of var4191) {
      var4188 = window.document.createXULElement('menuitem');
      var4188.value = var4192;
      var4188.label = var4192;
      var4188.setAttribute('tooltiptext', var4192);
      var4189.appendChild(var4188);
    }
    let var4193 = Zotero.Prefs.get('ai4paper.chatgptprompttemplateuser'),
      var4194 = [];
    if (var4193 != '') {
      let var4195 = var4193.split('\x0a');
      for (let var4196 of var4195) {
        if (var4196 != '') {
          var4196 = var4196.trim();
          if (var4196.lastIndexOf('👈') === var4196.length - 0x2) {
            let var4197 = var4196.lastIndexOf('👈');
            if (var4196.lastIndexOf('👉') != -0x1) {
              let _0x1e1fbd = var4196.lastIndexOf('👉'),
                _0x639404 = var4196.substring(_0x1e1fbd + 0x2, var4197).trim(),
                _0xceb7e = var4196.substring(0x0, _0x1e1fbd).trim(),
                _0x54e27 = {
                  'alias': _0x639404,
                  'realTemplate': _0xceb7e
                };
              var4194.push(_0x54e27);
              var4188 = window.document.createXULElement("menuitem");
              var4188.value = _0x639404;
              var4188.label = _0x639404;
              var4188.setAttribute('tooltiptext', var4196);
              var4189.appendChild(var4188);
            } else {
              var4188 = window.document.createXULElement("menuitem");
              var4188.value = var4196;
              var4188.label = var4196;
              var4188.setAttribute("tooltiptext", var4196);
              var4189.appendChild(var4188);
            }
          } else {
            var4188 = window.document.createXULElement("menuitem");
            var4188.value = var4196;
            var4188.label = var4196;
            var4188.setAttribute("tooltiptext", var4196);
            var4189.appendChild(var4188);
          }
        }
      }
    }
    Zotero.Prefs.set('ai4paper.prompttemplateuserobject', JSON.stringify(var4194));
    let var4202 = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist");
    var4202 && (var4202.value = Zotero.Prefs.get("ai4paper.chatgptprompttemplate"));
    if (Zotero.Prefs.get("ai4paper.enablesvgPaperAI")) {
      let var4203 = Zotero.AI4Paper.getCurrentReader()._iframeWindow;
      if (var4203) {
        let var4204 = var4203.document.querySelector(".toolbar-button.find");
        Zotero.AI4Paper.addReaderMenuButton_paperAI(var4203, var4204);
      }
    }
  },
  'buildPopup_promptList': function (param770, param771) {
    if (!param771) return;
    let var4205,
      var4206 = param771.firstElementChild;
    while (var4206) {
      var4206.remove();
      var4206 = param771.firstElementChild;
    }
    let var4207 = ['无', "AI 解读论文 🔒", "论文深度解读 🔒", '论文简要剖析\x20🔒'];
    for (let var4208 of var4207) {
      var4205 = param770.document.createXULElement("menuitem");
      var4205.value = var4208;
      var4205.label = var4208;
      var4205.setAttribute("tooltiptext", var4208);
      param771.appendChild(var4205);
    }
    let var4209 = Zotero.Prefs.get("ai4paper.chatgptprompttemplateuser"),
      var4210 = [];
    if (var4209 != '') {
      let _0x1a0832 = var4209.split('\x0a');
      for (let var4212 of _0x1a0832) {
        if (var4212 != '') {
          var4212 = var4212.trim();
          if (var4212.lastIndexOf('👈') === var4212.length - 0x2) {
            let var4213 = var4212.lastIndexOf('👈');
            if (var4212.lastIndexOf('👉') != -0x1) {
              let var4214 = var4212.lastIndexOf('👉'),
                var4215 = var4212.substring(var4214 + 0x2, var4213).trim(),
                var4216 = var4212.substring(0x0, var4214).trim(),
                var4217 = {
                  'alias': var4215,
                  'realTemplate': var4216
                };
              var4210.push(var4217);
              var4205 = param770.document.createXULElement("menuitem");
              var4205.value = var4215;
              var4205.label = var4215;
              var4205.setAttribute("tooltiptext", var4212);
              param771.appendChild(var4205);
            } else {
              var4205 = param770.document.createXULElement("menuitem");
              var4205.value = var4212;
              var4205.label = var4212;
              var4205.setAttribute("tooltiptext", var4212);
              param771.appendChild(var4205);
            }
          } else {
            var4205 = param770.document.createXULElement("menuitem");
            var4205.value = var4212;
            var4205.label = var4212;
            var4205.setAttribute("tooltiptext", var4212);
            param771.appendChild(var4205);
          }
        }
      }
    }
    Zotero.Prefs.set('ai4paper.prompttemplateuserobject', JSON.stringify(var4210));
  },
  'gptReaderSidePane_setServiceTooltiptext': function (param772, param773) {
    let var4218;
    !param773 ? var4218 = param772.label : var4218 = param773;
    for (let var4219 of Object.keys(Zotero.AI4Paper.gptCustom_numEmoji)) {
      var4218 === "GPT 自定 " + Zotero.AI4Paper.gptCustom_numEmoji[var4219] && param772.setAttribute("tooltiptext", Zotero.Prefs.get("ai4paper.gptcustomhost" + Zotero.AI4Paper.gptCustom_suffix[var4219]).trim() ? Zotero.Prefs.get("ai4paper.gptcustomhost" + Zotero.AI4Paper.gptCustom_suffix[var4219]).trim() + '\x20🤖\x20' + Zotero.Prefs.get("ai4paper.gptcustomModelCustom" + Zotero.AI4Paper.gptCustom_suffix[var4219]) : "GPT 自定 " + Zotero.AI4Paper.gptCustom_numEmoji[var4219]);
    }
  },
  'gptReaderSidePane_updateServiceModel': function () {
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) {
      return false;
    }
    let var4220 = window.document.querySelector('#ai4paper-chatgpt-readerSidePane-chatgpt-service');
    if (!var4220) return;
    let var4221 = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-service-menulist"),
      var4222 = var4220.childNodes;
    for (let var4223 = 0x0; var4223 < var4222.length; var4223++) {
      var4222[var4223].label === Zotero.Prefs.get("ai4paper.gptservice") && (var4221.selectedIndex = var4223);
      let _0x238a51 = var4222[var4223];
      Zotero.AI4Paper.gptReaderSidePane_setServiceTooltiptext(_0x238a51);
    }
    var4220 = window.document.querySelector('#ai4paper-chatgpt-readerSidePane-chatgpt-model');
    var4221 = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-model-menulist");
    var4222 = var4220.childNodes;
    for (let var4225 = 0x0; var4225 < var4222.length; var4225++) {
      var4222[var4225].label === Zotero.Prefs.get("ai4paper.gptmodel") && (var4221.selectedIndex = var4225);
    }
  },
  'gptReaderSidePane_clearChat': function () {
    let var4226 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4226 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4226) {
      return;
    }
    if (var4226._gptStreamRunning || Zotero.Prefs.get('ai4paper.gptStreamRunning')) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, '❌\x20已有\x20GPT\x20正在进行【Zotero\x20One】', "当前已有 GPT 正在进行中...如有需要，可手动中止后再发起请求。", 'openai');
      return;
    }
    if (Zotero.Prefs.get('ai4paper.gptContinuesChatMode')) {
      Zotero.AI4Paper._data_gptMessagesHistory = '[]';
      let var4227 = var4226.document.querySelectorAll(".message-container");
      var4227.forEach(_0x44d6ad => _0x44d6ad.remove());
      Zotero.AI4Paper._data_gptCurrentUserMessage = JSON.stringify([]);
      var4226.document.querySelector('.openaiLogoContainer').style.display = '';
    } else {
      window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").selectedIndex = 0x0;
      var4226.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = '';
      var4226.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-response').value = '';
      var4226.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = "Hi，有什么能帮助您吗？";
      var4226.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-space").style.display = "none";
      var4226.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-token-used').style.display = "none";
      var4226.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-token-used').textContent = '';
      Zotero.Prefs.set("ai4paper.chatgptprompttemplate", '无');
      Zotero.Prefs.set("ai4paper.chatgptprompt", '');
      Zotero.Prefs.set("ai4paper.chatgptresponse", '');
      Zotero.Prefs.set("ai4paper.chatgptresponsetime", "Hi，有什么能帮助您吗？");
    }
    Zotero.AI4Paper.gptReaderSidePane_hiddeScrollBtn(var4226);
  },
  'gptReaderSidePane_clearPrompt': function () {
    let var4228 = null;
    if (window.document.getElementById("ai4paper-chatgpt-readersidepane")) {
      var4228 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow;
    }
    if (!var4228) return;
    Zotero.Prefs.get('ai4paper.gptContinuesChatMode') ? (window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").selectedIndex = 0x0, Zotero.Prefs.set("ai4paper.chatgptprompttemplate", '无')) : (var4228.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = '', var4228.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-response').value = '', Zotero.Prefs.set("ai4paper.chatgptprompt", ''), Zotero.Prefs.set("ai4paper.chatgptresponse", ''));
  },
  'gptReaderSidePane_getFullText': async function (param774) {
    if (param774 && Zotero_Tabs._selectedID === "zotero-pane") return;
    let var4229 = null;
    window.document.getElementById('ai4paper-chatgpt-readersidepane') && (var4229 = window.document.getElementById('ai4paper-chatgpt-readersidepane').contentWindow);
    if (!var4229) return;
    let var4230 = await Zotero.AI4Paper.getFullText();
    if (var4230 && var4230 != "notRegularItem") {
      Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? var4229.document.getElementById("message-input").value = var4230 : var4229.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-prompt').value = var4230;
      Zotero.Prefs.set("ai4paper.chatgptprompt", var4230);
    } else {
      if (var4230 == 'notRegularItem') return false;else Services.prompt.alert(window, "❌ 出错啦", '获取\x20PDF\x20全文失败！');
    }
  },
  'aiAnalysis_PDFsFromSelection': function () {
    Zotero.AI4Paper.openDialog_importPDFs();
    Zotero.AI4Paper.processTextAreaValue_importPDFs();
  },
  'openDialog_importPDFs': async function () {
    Zotero.AI4Paper._dataOut_selectedPDFsInfo = null;
    let var4231 = {
      'dataIn': null,
      'dataOut': null,
      'deferred': Zotero.Promise.defer(),
      'itemTreeID': "importPDFs-dialog"
    };
    return window.openDialog("chrome://ai4paper/content/selectionDialog/importPDFs.xhtml", '', "chrome,modal,centerscreen,resizable=yes", var4231), await var4231.deferred.promise, Zotero.AI4Paper._dataOut_selectedPDFsInfo;
  },
  'processTextAreaValue_importPDFs': async function () {
    let var4232 = Zotero.AI4Paper._dataOut_selectedPDFsInfo;
    Zotero.AI4Paper._dataOut_selectedPDFsInfo && (Zotero.AI4Paper._dataOut_lastSelectedPDFsInfo = Zotero.AI4Paper._dataOut_selectedPDFsInfo);
    let var4233 = [];
    if (var4232) {
      let var4234 = var4232.split('\x0a');
      for (let var4235 of var4234) {
        if (var4235 != '') {
          var4235 = var4235.trim();
          if (var4235.lastIndexOf('🆔') != -0x1) {
            let _0x3d3690 = var4235.lastIndexOf('🆔'),
              _0x2ba75d = var4235.substring(_0x3d3690 + 0x2).trim(),
              _0x52f22b = Zotero.AI4Paper.findItemByIDORKey(_0x2ba75d);
            _0x52f22b && var4233.push(_0x52f22b);
          }
        }
      }
    } else {
      Zotero.AI4Paper.showProgressWindow(0x7d0, '导入\x20PDFs\x20全文【Zotero\x20One】', "未选择任何条目！");
    }
    if (var4233.length) {
      let _0x17f4a9 = await Zotero.AI4Paper.aiAnalysis_getPDFsJSON(var4233);
      if (_0x17f4a9) Zotero.AI4Paper.import2MessageInputBox(Zotero.AI4Paper.aiAnalysis_prompt + '\x0a' + _0x17f4a9);else {
        Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 导入 PDFs 全文【AI4paper】", "未发现可导入的全文！");
      }
    }
  },
  'aiAnalysis_getPDFsJSON': async function (param775) {
    let var4240 = {
      'summary': {
        'total\x20number\x20of\x20papers（全部文献数量）': param775.length
      }
    };
    var4240.paperDetails = {};
    let var4241 = 0x0;
    for (let var4242 of param775) {
      let var4243 = await var4242.attachmentText,
        var4244,
        var4245 = var4242.parentItem;
      var4245 && var4245.isRegularItem() ? var4244 = {
        'title': var4245.getField('title'),
        'year': var4245.getField("year"),
        'authors': Zotero.AI4Paper.getYAMLProp_creators(var4245),
        'itemType': var4245.itemType,
        'publicationTitle': var4245.getField('publicationTitle'),
        'impactFactor': var4245.getField("libraryCatalog").split('(')[0x0].trim(),
        'itemLink': '[' + Zotero.AI4Paper.getItemZoteroLink(var4242) + '](' + Zotero.AI4Paper.getItemZoteroLink(var4242) + ')',
        'fulltext': var4243
      } : var4244 = {
        'title': var4242.attachmentFilename,
        'itemType': var4242.itemType,
        'contentType': var4242.attachmentContentType,
        'itemLink': '[' + Zotero.AI4Paper.getItemZoteroLink(var4242) + '](' + Zotero.AI4Paper.getItemZoteroLink(var4242) + ')',
        'fulltext': var4243
      };
      var4240.paperDetails[Number(var4241) + 0x1] = var4244;
      var4241++;
    }
    return JSON.stringify(var4240, null, 0x2);
  },
  'gptReaderSidePane_getAbstract': function () {
    let var4246 = null;
    if (window.document.getElementById("ai4paper-chatgpt-readersidepane")) {
      var4246 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow;
    }
    if (!var4246) return;
    let var4247 = Zotero.AI4Paper.getAbstract();
    var4247 ? (Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? var4246.document.getElementById("message-input").value = var4247 : var4246.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = var4247, Zotero.Prefs.set("ai4paper.chatgptprompt", var4247)) : Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 未获取到摘要【AI4paper】", "获取摘要失败，请检查当前文献！", "openai");
  },
  'paperAI': async function (param776) {
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
    let var4248 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4248 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4248) {
      window.alert("请先开启【GPT 侧边栏】！");
      return;
    }
    let var4249 = await Zotero.AI4Paper.getFullText();
    if (var4249 && var4249 != "notRegularItem") {
      if (Zotero.Prefs.get('ai4paper.gptContinuesChatMode')) {
        if (!param776 || param776 && window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").value === '无') {
          let _0x2ebe94 = "AI 解读论文 🔒";
          window.document.querySelector('#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist').value = _0x2ebe94;
          Zotero.Prefs.set('ai4paper.chatgptprompttemplate', _0x2ebe94);
        }
        var4248.document.getElementById("message-input").value = var4249;
        Zotero.Prefs.get('ai4paper.clearChatOnPaperAI') && !Zotero.AI4Paper._notClearChatOnPaperAI && Zotero.AI4Paper.gptReaderSidePane_clearChat();
        Zotero.AI4Paper._notClearChatOnPaperAI = false;
        Zotero.Prefs.get('ai4paper.createAIReadingNoteOnPaperAI') ? var4248._fromPaperAI = true : var4248._fromPaperAI = false;
        var4248._hasFullText = true;
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_send();
        var4248._hasFullText = false;
      }
    } else {
      if (var4249 == "notRegularItem") return false;else Services.prompt.alert(window, "❌ 出错啦", "获取 PDF 全文失败！");
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
    let var4251 = await Zotero.AI4Paper.getAnnotationsJSON();
    var4251 ? Zotero.AI4Paper.import2MessageInputBox(var4251) : Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 导入注释【AI4paper】", "未发现可导入的注释！", "openai");
  },
  'processTextAreaValue_importAnnotations': async function () {
    let var4252 = Zotero.AI4Paper._dataOut_selectedItemsInfo;
    Zotero.AI4Paper._dataOut_selectedItemsInfo && (Zotero.AI4Paper._dataOut_lastSelectedItemsInfo = Zotero.AI4Paper._dataOut_selectedItemsInfo);
    let var4253 = [];
    if (var4252) {
      let var4254 = var4252.split('\x0a');
      for (let var4255 of var4254) {
        if (var4255 != '') {
          var4255 = var4255.trim();
          if (var4255.lastIndexOf('🆔') != -0x1) {
            let _0x558bd9 = var4255.lastIndexOf('🆔'),
              _0x22eddc = var4255.substring(_0x558bd9 + 0x2).trim(),
              _0x16751a = Zotero.Items.get(_0x22eddc);
            _0x16751a && var4253.push(_0x16751a);
          }
        }
      }
    } else Zotero.AI4Paper.showProgressWindow(0x7d0, "导入注释【AI4paper】", "未选择任何条目！");
    if (var4253.length) {
      let _0x423e3b = await Zotero.AI4Paper.getAnnotationsJSON_batch(var4253);
      if (_0x423e3b) {
        Zotero.AI4Paper.import2MessageInputBox(_0x423e3b);
      } else Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 导入注释【AI4paper】", "未发现可导入的注释！");
    }
  },
  'processAdvancedSearch_importAnnotations': async function () {
    Zotero.AI4Paper._dataOut_selectedItemsAdvancedSearch.length && (Zotero.AI4Paper._dataOut_lastSelectedItemsAdvancedSearch = Zotero.AI4Paper._dataOut_selectedItemsAdvancedSearch);
    let var4260 = Zotero.AI4Paper._dataOut_selectedItemsAdvancedSearch;
    if (!var4260.length) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, '导入注释【Zotero\x20One】', "未选择任何条目！");
      return;
    }
    let var4261 = await Zotero.AI4Paper.getAnnotationsJSON_batch(var4260);
    var4261 ? Zotero.AI4Paper.import2MessageInputBox(var4261) : Zotero.AI4Paper.showProgressWindow(0x7d0, '❌\x20导入注释【Zotero\x20One】', '未发现可导入的注释！');
  },
  'updateImportAnnotationsAdvancedSearchHistory': function (param777) {
    let var4262 = Zotero.Prefs.get('ai4paper.importAnnotationsAdvancedHistory'),
      var4263 = var4262.split("😊🎈🍓");
    if (!var4263.includes(param777)) {
      var4263.length === 0x1 && var4263[0x0] === '' ? var4263 = [param777] : var4263.unshift(param777);
    } else {
      let var4264 = var4263.indexOf(param777);
      var4263.splice(var4264, 0x1);
      var4263.unshift(param777);
    }
    let var4265 = Zotero.AI4Paper.letDOI(),
      var4266 = [];
    for (let var4267 = 0x0; var4267 < 0x14; var4267++) {
      var4263[var4267] != undefined && var4266.push(var4263[var4267]);
    }
    var4265 && Zotero.Prefs.set("ai4paper.importAnnotationsAdvancedHistory", var4266.join("😊🎈🍓"));
  },
  'import2MessageInputBox': async function (param778) {
    let var4268 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var4268) {
      Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 请打开【GPT侧边栏】", '请先打开【GPT侧边栏】！');
      return;
    }
    param778 && (Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? var4268.document.getElementById("message-input").value = param778 : var4268.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = param778);
  },
  'openDialog_importAnnotations': async function () {
    Zotero.AI4Paper._dataOut_selectedItemsInfo = null;
    let var4269 = {
      'dataIn': null,
      'dataOut': null,
      'deferred': Zotero.Promise.defer(),
      'itemTreeID': "importAnnotations-dialog"
    };
    return window.openDialog('chrome://ai4paper/content/selectionDialog/importAnnotations.xhtml', '', 'chrome,modal,centerscreen,resizable=yes', var4269), await var4269.deferred.promise, Zotero.AI4Paper._dataOut_selectedItemsInfo;
  },
  'openDialogAdvancedSearch_importAnnotations': async function (param779) {
    Zotero.AI4Paper._dataOut_selectedItemsAdvancedSearch = [];
    var var4270 = new Zotero.Search();
    var4270.libraryID = 0x1;
    var4270.addCondition("tag", "contains", param779 ? param779 : '');
    var var4271 = {
      'dataIn': {
        'search': var4270
      },
      'dataOut': null
    };
    window.openDialog("chrome://ai4paper/content/selectionDialog/importAnnotationsAdvanced.xhtml", '', "chrome,modal,dialog=no,centerscreen", var4271);
    return var4271.out;
    return Zotero.AI4Paper._dataOut_selectedItemsAdvancedSearch;
  },
  'getFullText': async function () {
    let var4272 = Zotero_Tabs._selectedID;
    var var4273 = Zotero.Reader.getByTabID(var4272),
      var4274 = null;
    if (var4273) {
      let _0x2160cd = var4273.itemID;
      var var4276 = Zotero.Items.get(_0x2160cd);
      if (["application/pdf", "text/html", "application/epub+zip"].includes(var4276.attachmentContentType)) {
        try {
          if (!Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
            Zotero.AI4Paper.showProgressWindow(0x7d0, '正在获取【PDF/Epub/网页快照】全文\x20【Zotero\x20One】', "如果 PDF 为扫描本，或者格式特殊，可能导致获取时间较长，或者 Zotero 转圈圈/卡顿数十秒！");
          }
          var4274 = await var4276.attachmentText;
        } catch (_0x1d11bb) {
          return false;
        }
        if (var4274) {
          return var4274;
        } else return false;
      }
    } else {
      var var4276 = ZoteroPane.getSelectedItems()[0x0];
    }
    if (var4276 === undefined) return Services.prompt.alert(window, "❌ 温馨提示：", '请选择一个常规条目！'), 'notRegularItem';
    if (var4276.isRegularItem()) {
      let var4277 = var4276.getAttachments();
      for (let var4278 of var4277) {
        let var4279 = Zotero.Items.get(var4278);
        if (["application/pdf", "text/html", "application/epub+zip"].includes(var4279.attachmentContentType)) {
          try {
            if (!Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
              Zotero.AI4Paper.showProgressWindow(0x7d0, "正在获取【PDF/Epub/网页快照】全文 【AI4paper】", "如果 PDF 为扫描本，或者格式特殊，可能导致获取时间较长，或者 Zotero 转圈圈/卡顿数十秒！");
            }
            var4274 = await var4279.attachmentText;
          } catch (_0x4d6c7d) {
            return false;
          }
          if (var4274) {
            return var4274;
          } else {
            return false;
          }
        }
      }
      return false;
    } else {
      if (var4276.isAttachment()) {
        if (['application/pdf', 'text/html', "application/epub+zip"].includes(var4276.attachmentContentType)) {
          try {
            !Zotero.Prefs.get('ai4paper.gptContinuesChatMode') && Zotero.AI4Paper.showProgressWindow(0x7d0, "正在获取【PDF/Epub/网页快照】全文 【AI4paper】", "如果 PDF 为扫描本，或者格式特殊，可能导致获取时间较长，或者 Zotero 转圈圈/卡顿数十秒！");
            var4274 = await var4276.attachmentText;
          } catch (_0x563a50) {
            return false;
          }
          return var4274 ? var4274 : false;
        }
        return false;
      } else return Services.prompt.alert(window, "❌ 温馨提示：", "您选择的不是常规条目！"), "notRegularItem";
    }
  },
  'getAbstract': function () {
    let var4280 = Zotero_Tabs._selectedID;
    var var4281 = Zotero.Reader.getByTabID(var4280);
    if (var4281) {
      let var4282 = var4281.itemID;
      var var4283 = Zotero.Items.get(var4282);
      var4283 && var4283.parentItemID && (var4282 = var4283.parentItemID, var4283 = Zotero.Items.get(var4282));
    } else var var4283 = ZoteroPane.getSelectedItems()[0x0];
    if (var4283 === undefined) return window.alert('请先选择一个条目！'), false;
    if (var4283.isRegularItem()) {
      let var4284 = var4283.getField("abstractNote");
      if (var4284.indexOf("【摘要翻译】") != -0x1) {
        let var4285 = var4284.indexOf("【摘要翻译】");
        var4284 = var4284.substring(0x0, var4285);
        if (var4284.lastIndexOf('\x0a\x0a') === var4284.length - 0x2) var4284 = var4284.substring(0x0, var4284.length - 0x2);else var4284.lastIndexOf('\x0a') === var4284.length - 0x1 && (var4284 = var4284.substring(0x0, var4284.length - 0x1));
      }
      return var4284;
    } else {
      return window.alert('您选择的不是常规条目！'), false;
    }
    return false;
  },
  'getAnnotationsJSON': async function () {
    let var4286 = Zotero_Tabs._selectedID,
      var4287 = Zotero.Reader.getByTabID(var4286),
      var4288 = {},
      var4289 = [],
      var4290 = {
        '#ffd400': '黄色',
        '#ff6666': '红色',
        '#5fb236': '绿色',
        '#2ea8e5': '蓝色',
        '#a28ae5': '紫色',
        '#e56eee': "洋红色",
        '#f19837': '橘色',
        '#aaaaaa': '灰色'
      };
    if (var4287) {
      var var4291 = Zotero.Items.get(var4287.itemID);
      if (["application/pdf", "text/html", "application/epub+zip"].includes(var4291.attachmentContentType)) {
        if (var4291.attachmentLinkMode === 0x3) {
          return false;
        }
        var var4292 = await var4291.getAnnotations();
        if (var4292.length) {
          for (let var4293 of var4292) {
            let _0x547bdd = var4293.getTags(),
              _0xdbc9a6 = [],
              _0x52f588 = '';
            if (_0x547bdd.length) {
              for (let var4297 of _0x547bdd) {
                _0xdbc9a6.push('#' + var4297.tag);
              }
              _0x52f588 = _0xdbc9a6.join('\x20');
            }
            let _0x37b889 = '' + var4293.annotationComment,
              _0x9e3ec9 = '' + var4293.annotationText,
              _0x1f4f09 = '' + var4293.annotationType,
              _0x4914bf = var4293.annotationColor + ':\x20' + var4290[var4293.annotationColor],
              _0x2f46c7 = {
                'annotationType': _0x1f4f09,
                'annotationColor': _0x4914bf,
                'annotationText': _0x9e3ec9,
                'annotationComment': _0x37b889,
                'annotationTags': _0x52f588
              };
            var4289.push(_0x2f46c7);
          }
          let _0x555472 = "ref-1";
          return var4288[_0x555472] = {
            'title': var4291.getField("title"),
            'annotations': var4289
          }, JSON.stringify(var4288, null, 0x2);
        }
      }
    }
    return false;
  },
  'getAnnotationsJSON_batch': async function (param780) {
    let var4304 = {},
      var4305 = [],
      var4306 = {
        '#ffd400': '黄色',
        '#ff6666': '红色',
        '#5fb236': '绿色',
        '#2ea8e5': '蓝色',
        '#a28ae5': '紫色',
        '#e56eee': "洋红色",
        '#f19837': '橘色',
        '#aaaaaa': '灰色'
      },
      var4307 = 0x0;
    for (let var4308 of param780) {
      var4307++;
      if (['application/pdf', "text/html", 'application/epub+zip'].includes(var4308.attachmentContentType)) {
        if (var4308.attachmentLinkMode === 0x3) {
          return false;
        }
        var var4309 = await var4308.getAnnotations();
        if (var4309.length) {
          for (let var4310 of var4309) {
            let var4311 = var4310.getTags(),
              var4312 = [],
              var4313 = '';
            if (var4311.length) {
              for (let var4314 of var4311) {
                var4312.push('#' + var4314.tag);
              }
              var4313 = var4312.join('\x20');
            }
            let var4315 = '' + var4310.annotationComment,
              var4316 = '' + var4310.annotationText,
              var4317 = '' + var4310.annotationType,
              var4318 = var4310.annotationColor + ':\x20' + var4306[var4310.annotationColor],
              var4319 = {
                'annotationType': var4317,
                'annotationColor': var4318,
                'annotationText': var4316,
                'annotationComment': var4315,
                'annotationTags': var4313
              };
            var4305.push(var4319);
          }
          let _0x53bad5 = "ref-" + var4307;
          var4304[_0x53bad5] = {
            'title': var4308.getField("title"),
            'annotations': var4305
          };
          var4305 = [];
        }
      }
    }
    if (JSON.stringify(var4304) !== '{}') return JSON.stringify(var4304, null, 0x2);
    return false;
  },
  'gptReaderSidePane_setUIHeight': function (param781, param782) {
    let var4321 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4321 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4321) {
      return;
    }
    if (Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
      if (Zotero.Prefs.get("ai4paper.gptEnableCustomChatModeGPTUIHeight")) {
        var4321.document.getElementById("message-input").style.height = Zotero.Prefs.get('ai4paper.gptCustomChatModePromptAreaHeight') + 'px';
        var4321.document.getElementById('chat-container').style.height = Zotero.Prefs.get("ai4paper.gptCustomChatModeResponseAreaHeight") + 'px';
        let var4322 = parseInt(Zotero.Prefs.get('ai4paper.gptCustomChatModePromptAreaHeight')) + parseInt(Zotero.Prefs.get("ai4paper.gptCustomChatModeResponseAreaHeight"));
        var4322 = var4322 < window.screen.height ? var4322 + 0x8 : window.screen.height;
        window.document.getElementById("ai4paper-chatgpt-readersidepane").style.minHeight = var4322 + 'px';
      } else {
        var4321.document.getElementById("message-input").style.height = param781 + 'px';
        var4321.document.getElementById('chat-container').style.height = param782 + 'px';
        let var4323 = parseInt(param781) + parseInt(param782);
        var4323 = var4323 < window.screen.height ? var4323 + 0x8 : window.screen.height;
        window.document.getElementById("ai4paper-chatgpt-readersidepane").style.minHeight = var4323 + 'px';
      }
    } else {
      if (Zotero.Prefs.get("ai4paper.gptEnableCustomGPTUIHeight")) {
        var4321.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").style.height = Zotero.Prefs.get("ai4paper.gptCustomPromptAreaHeight") + 'px';
        var4321.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").style.height = Zotero.Prefs.get("ai4paper.gptCustomResponseAreaHeight") + 'px';
        let var4324 = parseInt(Zotero.Prefs.get("ai4paper.gptCustomPromptAreaHeight")) + parseInt(Zotero.Prefs.get("ai4paper.gptCustomResponseAreaHeight"));
        var4324 = var4324 < window.screen.height ? var4324 + 0x46 : window.screen.height;
        window.document.getElementById("ai4paper-chatgpt-readersidepane").style.minHeight = var4324 + 'px';
      } else {
        var4321.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").style.height = param781 + 'px';
        var4321.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").style.height = param782 + 'px';
        let var4325 = parseInt(param781) + parseInt(param782);
        var4325 = var4325 < window.screen.height ? var4325 + 0x46 : window.screen.height;
        window.document.getElementById('ai4paper-chatgpt-readersidepane').style.minHeight = var4325 + 'px';
      }
    }
  },
  'calculate_iframeHeight': function () {
    let var4326 = window.screen.height,
      var4327,
      var4328;
    if (Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
      !Zotero.Prefs.get("ai4paper.gptEnableCustomChatModeGPTUIHeight") ? parseInt(var4326) <= 0x3e8 ? (var4327 = var4326 * 0.185, var4328 = var4326 * 0.446) : (var4327 = var4326 * 0.173, var4328 = var4326 * 0.555) : (var4327 = Zotero.Prefs.get("ai4paper.gptCustomChatModePromptAreaHeight"), var4328 = Zotero.Prefs.get("ai4paper.gptCustomChatModeResponseAreaHeight"));
      let var4329 = parseInt(var4327) + parseInt(var4328);
      return var4329 < window.screen.height ? var4329 + 0x8 : window.screen.height;
    } else {
      !Zotero.Prefs.get("ai4paper.gptEnableCustomGPTUIHeight") ? parseInt(var4326) <= 0x3e8 ? (var4327 = var4326 * 0.27, var4328 = var4326 * 0.3) : (var4327 = var4326 * 0.29, var4328 = var4326 * 0.395) : (var4327 = Zotero.Prefs.get("ai4paper.gptCustomPromptAreaHeight"), var4328 = Zotero.Prefs.get('ai4paper.gptCustomResponseAreaHeight'));
      let _0x324ef7 = parseInt(var4327) + parseInt(var4328);
      return _0x324ef7 < window.screen.height ? _0x324ef7 + 0x46 : window.screen.height;
    }
  },
  'getTabsIframeWindow': function () {
    let var4331 = [],
      var4332 = Zotero.getMainWindow().Zotero_Tabs._tabs;
    for (let var4333 of var4332) {
      if (var4333.id != 'zotero-pane') {
        window.document.getElementById("ai4paper-chatgpt-readersidepane" + var4333.id) && var4331.push(window.document.getElementById("ai4paper-chatgpt-readersidepane" + var4333.id).contentWindow);
      }
    }
    return var4331;
  },
  'getTabsCont': function () {
    let var4334 = [],
      var4335 = [],
      var4336 = Zotero.getMainWindow().Zotero_Tabs._tabs;
    for (let var4337 of var4336) {
      if (var4337.id != "zotero-pane") {
        if (window.document.getElementById(var4337.id + "-context")) {
          var4334.push(window.document.getElementById(var4337.id + "-context"));
        }
      }
    }
    return var4334;
  },
  'updateChatGPTReaderSidePane': function () {
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    let var4510 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4510) return;
    var4510._marker4ScrollTop = false;
    Zotero.AI4Paper.gptReaderSidePane_updatePromptTemplate();
    Zotero.AI4Paper.gptReaderSidePane_updateServiceModel();
    Zotero.AI4Paper.enableGPTFuncButtons();
    if (Zotero.Prefs.get('ai4paper.gptContinuesChatMode')) {
      Zotero.AI4Paper.gptReaderSidePane_updateSendButtonState();
      if (!var4510._gptStreamRunning) {
        let var4511 = var4510.document.querySelectorAll('.message-container');
        var4511.forEach(_0x3218fa => _0x3218fa.remove());
        let var4512 = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory);
        if (!var4512.length) var4510.document.querySelector('.openaiLogoContainer').style.display = '';else {
          var4510.document.querySelector(".openaiLogoContainer").style.display = "none";
          for (let var4513 of var4512) {
            let var4514 = var4510.document.getElementById("chat-container"),
              var4515 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(var4513.content, var4513.role, null, var4513);
            var4514.appendChild(var4515);
            !Zotero.Prefs.get("ai4paper.gptPinMessage") && (var4514.scrollTop = var4514.scrollHeight);
          }
        }
        let var4516 = JSON.parse(Zotero.AI4Paper._data_gptCurrentUserMessage);
        if (var4516.length) {
          var4510.document.querySelector(".openaiLogoContainer").style.display = 'none';
          for (let var4517 of var4516) {
            let _0x3217f4 = var4510.document.getElementById("chat-container"),
              _0x3560d2 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(var4517.content, var4517.role, null, var4517);
            _0x3217f4.appendChild(_0x3560d2);
            !Zotero.Prefs.get("ai4paper.gptPinMessage") && (_0x3217f4.scrollTop = _0x3217f4.scrollHeight);
          }
        }
      }
    } else {
      var4510.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = Zotero.Prefs.get("ai4paper.chatgptprompt");
      var4510.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = Zotero.Prefs.get("ai4paper.chatgptresponse");
      var4510.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = Zotero.Prefs.get('ai4paper.chatgptresponsetime');
      var4510.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").style.fontSize = Zotero.Prefs.get('ai4paper.gptSidePaneFontSize');
      var4510.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").style.fontSize = Zotero.Prefs.get("ai4paper.gptSidePaneFontSize");
      var4510.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent === "正在响应..." && (var4510.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-space").style.display = "none", var4510.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-token-used').style.display = "none", var4510.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").textContent = '');
      Zotero.AI4Paper.gptReaderSidePane_updateSendButtonState();
    }
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_enhanceMessageElem();
    Zotero.AI4Paper.enableGPTQuickButtons();
  },
  'onClickButton_ChatGPT': async function (param810) {
    Zotero.Prefs.set('ai4paper.chatgptprompt', param810);
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    let var4522 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4522 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4522) return;
    if (Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
      let _0x2d1b58 = var4522.document.getElementById("message-input").value;
      Zotero.Prefs.get('ai4paper.gptMergeSelectedText') ? (var4522.document.getElementById("message-input").value = '' + (_0x2d1b58 ? _0x2d1b58 + '\x20' : '') + param810, Zotero.AI4Paper.showProgressWindow(0x3e8, "✅ GPT Prompt 拼接成功【AI4paper】", "成功拼接！", "openai")) : var4522.document.getElementById("message-input").value = param810;
    } else {
      let _0xd1a459 = var4522.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value;
      if (Zotero.Prefs.get("ai4paper.gptMergeSelectedText")) {
        var4522.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = '' + (_0xd1a459 ? _0xd1a459 + '\x20' : '') + param810;
        Zotero.AI4Paper.showProgressWindow(0x3e8, "✅ GPT Prompt 拼接成功【AI4paper】", "成功拼接！", 'openai');
      } else var4522.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = param810;
    }
  },
  'onClickButton_nowChatGPT': async function (param811) {
    Zotero.Prefs.set("ai4paper.chatgptprompt", param811);
    if (!Zotero.Prefs.get('ai4paper.gptviewReaderSidepane')) return false;
    let var4525 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4525 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4525) return;
    Zotero.Prefs.get('ai4paper.gptContinuesChatMode') ? (var4525.document.getElementById("message-input").value = param811, Zotero.AI4Paper.gptReaderSidePane_ChatMode_send()) : (var4525.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = param811, Zotero.AI4Paper.gptReaderSidePane_send());
  },
  'go2ChatGPTReaderSidePane': function () {
    let var4526 = Zotero_Tabs._selectedID;
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    const var4527 = window.document.getElementById(var4526 + "-context");
    if (var4527) {
      const _0x15195a = var4527.querySelector('tabs'),
        _0x4c9041 = var4527.querySelector("tabbox"),
        _0x2f7fbb = var4527.querySelector('tabpanels');
      let _0x3af03f = _0x2f7fbb.querySelectorAll("tabpanel"),
        _0x909fc5 = 0x0;
      for (let var4533 of _0x3af03f) {
        _0x909fc5++;
        var4533.querySelector("#ai4paper-chatgpt-readersidepane" + var4526) && (_0x4c9041.selectedIndex = _0x909fc5 - 0x1);
      }
    }
  },
  'checkChatGPTReaderSidePane': function () {
    let var4534 = Zotero_Tabs._selectedID;
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) {
      return "disable";
    }
    const var4535 = window.document.getElementById(var4534 + '-context');
    if (var4535) {
      const _0x16d3bd = var4535.querySelector("tabs"),
        _0x17a158 = var4535.querySelector('tabbox'),
        _0x49fceb = var4535.querySelector('tabpanels');
      let _0x51c89b = _0x49fceb.querySelectorAll("tabpanel"),
        _0xa86ce6 = 0x0;
      for (let var4541 of _0x51c89b) {
        _0xa86ce6++;
        if (var4541.querySelector("#ai4paper-chatgpt-readersidepane" + var4534)) {
          if (_0x17a158.selectedIndex === _0xa86ce6 - 0x1) return true;
        }
      }
    }
    return 'not';
  },
  'visitChatGPT': function () {
    let var4542 = "https://chat.openai.com";
    ZoteroPane.loadURI(var4542);
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
    let var4543 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4543) return false;
    for (let var4544 of Zotero.AI4Paper.messageQuickButtons) {
      var4543.document.querySelectorAll(".quickButton-" + var4544).forEach(_0x4ed30a => _0x4ed30a.style.display = Zotero.Prefs.get('ai4paper.gptQuickButton' + var4544) ? '' : 'none');
    }
  },
  'gptReaderSidePane_addChatGPTNoteInit': function () {
    if (!Zotero.Prefs.get('ai4paper.gptviewReaderSidepane')) return false;
    let var4545 = null;
    if (window.document.getElementById("ai4paper-chatgpt-readersidepane")) {
      var4545 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow;
    }
    if (!var4545) return;
    let var4546 = var4545.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-prompt').value,
      var4547 = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").value,
      var4548 = JSON.parse(Zotero.Prefs.get('ai4paper.prompttemplateuserobject')),
      var4549 = false;
    for (let var4550 of var4548) {
      var4550.alias === var4547.trim() && !var4549 && (var4547 = var4550.realTemplate, var4549 = true);
    }
    if (var4547 === '无' || var4547 === '') {
      if (var4546.trim() === '') {
        let var4551 = Services.prompt.confirm(window, "❌ 当前对话为空", "提问区为空，是否确认继续添加笔记？");
        if (!var4551) return false;else var var4552 = '' + var4546;
      } else {
        var var4552 = '' + var4546;
      }
    } else {
      if (var4546 != '') {
        var var4552 = var4547 + ':\x20' + var4546;
      } else var var4552 = var4547;
    }
    let var4553 = var4545.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value;
    Zotero.AI4Paper.runAuthor() && Zotero.AI4Paper.addChatGPTNote(var4552, var4553);
  },
  'addChatGPTNote': async function (param812, param813) {
    let var4554 = Zotero_Tabs._selectedID;
    var var4555 = Zotero.Reader.getByTabID(var4554);
    if (var4555) {
      let var4556 = var4555.itemID;
      var var4557 = Zotero.Items.get(var4556);
      if (var4557 && var4557.parentItemID) {
        var4556 = var4557.parentItemID;
        var4557 = Zotero.Items.get(var4556);
      } else return Services.prompt.alert(window, "❌ 请重新选择", "当前文献无父条目，请创建父条目或选择其他文献！否则 ChatGPT 笔记无法保存。"), false;
    } else var var4557 = ZoteroPane.getSelectedItems()[0x0];
    if (var4557 === undefined) return Services.prompt.alert(window, '❌\x20温馨提示：', "请先选择一个条目！"), false;
    if (!var4557.isRegularItem()) return Services.prompt.alert(window, "❌ 温馨提示：", "您选择的不是常规条目！"), false;
    let var4558 = [],
      var4559 = var4557.getField("title"),
      var4560 = Zotero.AI4Paper.openDialogByType_modal('exportGPTNotes', var4559),
      var4561 = var4560.tags;
    if (var4560 === 'cancel') {
      return false;
    }
    if (var4560.check) {
      if (var4560.item_title === '') {
        return Services.prompt.alert(window, '❌\x20出错了', '未选择改绑条目，或改绑条目尚未设定！'), false;
      }
      let var4562 = var4560.item_title,
        var4563 = JSON.parse(Zotero.Prefs.get('ai4paper.gptNotesAttachItemsObject')),
        var4564 = false;
      for (let var4565 of var4563) {
        if (var4565.title === var4562.trim() && !var4564) {
          var4557 = Zotero.AI4Paper.findItemByIDORKey(var4565.id);
          if (var4557) Zotero.Prefs.set("ai4paper.gptNotesLastSelectedItem", var4562);else return Services.prompt.alert(window, "❌ 出错了", "您选择的改绑文献不存在！"), false;
          var4564 = true;
        }
      }
      if (!var4564) {
        return Services.prompt.alert(window, "❌ 出错了", '您选择的改绑文献不在所设定的笔记改绑条目中！'), false;
      }
    }
    if (var4561) {
      var4561 = var4561.split('\x0a');
      for (let var4566 of var4561) {
        var4566 != '' && (var4558.push(var4566), Zotero.AI4Paper.add2GPTNoteTags(var4566), Zotero.AI4Paper.add2RecentGPTNoteTags(var4566));
      }
    }
    var var4567 = await Zotero.AI4Paper.createNoteItem_basedOnTag(var4557, "/ChatGPT");
    if (var4567) {
      Zotero.AI4Paper.updateChatGPTRecordNote(var4557, var4567, param812, param813, var4558);
      Zotero.AI4Paper.focusReaderSidePane("gpt");
    }
  },
  'saveGPTCurrentUserMessage': function (param1009) {
    try {
      Zotero.AI4Paper._data_gptCurrentUserMessage = JSON.stringify([param1009]);
    } catch (_0x15a0ba) {
      Zotero.debug(_0x15a0ba);
    }
  },
  'resolveMessagesHistory': function () {
    let var5163 = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory);
    return var5163 = var5163.map(_0x1dde7a => {
      let var5164 = _0x1dde7a.role,
        var5165 = _0x1dde7a.content,
        var5166 = {
          'role': var5164,
          'content': var5165
        };
      return var5166;
    }), var5163;
  },
  'chatWithNewBing': async function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return -0x1;
    }
    var var5167 = Zotero.Prefs.get("ai4paper.microsoftedgeapppath");
    if (!var5167) return window.alert("请先前往【Zotero 设置 --> AI4paper --> 拓展 --> Open with Browser】设定 Microsoft Edge 应用路径。"), false;
    if (!(await OS.File.exists(var5167))) return window.alert('您设定的\x20Microsoft\x20Edge\x20应用不存在！'), false;
    let var5168 = Zotero_Tabs._selectedID;
    var var5169 = Zotero.Reader.getByTabID(var5168);
    if (var5169) {
      let var5170 = var5169.itemID,
        var5171 = Zotero.Items.get(var5170);
      if (var5171.isAttachment()) {
        var var5172 = await var5171.getFilePathAsync();
        if (var5171.attachmentContentType == "application/pdf") {
          if (var5172 && var5167) {
            if (Zotero.AI4Paper.runAuthor()) {
              Zotero.launchFileWithApplication(var5172, var5167);
              if (Zotero.Prefs.get("ai4paper.enableNewBingTemplate") && Zotero.Prefs.get("ai4paper.newBingTemplate")) {
                Zotero.AI4Paper.copy2Clipboard(Zotero.Prefs.get("ai4paper.newBingTemplate"));
              }
            }
            return false;
          }
        }
      }
    } else {
      let var5173 = ZoteroPane.getSelectedItems();
      for (let var5174 of var5173) {
        if (var5174 && !var5174.isNote()) {
          if (var5174.isRegularItem()) {
            let _0x3d2b91 = var5174.getAttachments();
            for (let var5176 of _0x3d2b91) {
              let var5177 = Zotero.Items.get(var5176);
              var var5172 = await var5177.getFilePathAsync();
              if (var5177.attachmentContentType == "application/pdf") {
                if (var5172 && var5167) {
                  if (Zotero.AI4Paper.runAuthor()) {
                    Zotero.launchFileWithApplication(var5172, var5167);
                    Zotero.Prefs.get("ai4paper.enableNewBingTemplate") && Zotero.Prefs.get("ai4paper.newBingTemplate") && Zotero.AI4Paper.copy2Clipboard(Zotero.Prefs.get('ai4paper.newBingTemplate'));
                  }
                }
              }
            }
          }
          if (var5174.isAttachment()) {
            var var5172 = await var5174.getFilePathAsync();
            if (var5174.attachmentContentType == "application/pdf") {
              if (var5172 && var5167) {
                if (Zotero.AI4Paper.runAuthor()) {
                  Zotero.launchFileWithApplication(var5172, var5167);
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
