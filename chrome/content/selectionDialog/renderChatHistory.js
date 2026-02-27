function init() {
  Zotero.AI4Paper.update_svg_icons(document);
  Zotero.AI4Paper.gptReaderSidePane_setStickyScroll(document);
  injectStyle();
  Zotero.AI4Paper.updateChatUI4HighlightStyle(window);
  document.body.style.margin = 0x0;
  document.body.style.padding = 0x0;
  document.body.style.overflowY = "hidden";
  window.createMessageElement = createMessageElement;
}
function createMessageElement(param1, param2, param3, param4) {
  const var1 = document.createElement("div");
  var1.classList.add('message-container', param2);
  const var2 = document.createElement("div");
  var2.classList.add("message", param2);
  var2.style.fontSize = Zotero.Prefs.get("ai4paper.gptSidePaneFontSize");
  let var3 = Zotero.AI4Paper.gptReaderSidePane_addExpandArrow(var2, param2, window);
  const var4 = document.createElement("div");
  var4.classList.add("message-row", param2);
  const var5 = document.createElement("div");
  var5.style.marginRight = "8px";
  var5.classList.add('avatar', param2);
  var5.innerHTML = param2 === 'user' ? Zotero.AI4Paper.svg_icon_20px.avatar_user : Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
  var5.title = '点击以拷贝消息';
  var5.addEventListener("click", _0x52a92c => {
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessageSourceText(_0x52a92c);
  });
  const var6 = document.createElement('span');
  var6.classList.add('username');
  let var7 = Zotero.Prefs.get("ai4paper.gptUserName") ? Zotero.Prefs.get("ai4paper.gptUserName") : "User",
    var8 = Zotero.Prefs.get("ai4paper.gptservice") === 'OpenAI' ? 'ChatGPT' : Zotero.Prefs.get("ai4paper.gptservice");
  param2 === "user" && (document._service = param4?.["service"] || null);
  param2 === "assistant" && document._service && (var8 = document._service, document._service = null);
  var6.textContent = param2 === "user" ? var7 : var8;
  var4.appendChild(var5);
  var4.appendChild(var6);
  const var9 = document.createElement("div");
  var9.classList.add("content", param2);
  var9.classList.add('markdown-body');
  var9.style.fontSize = Zotero.Prefs.get("ai4paper.gptSidePaneFontSize");
  var9.style.textAlign = "left";
  param2 === 'user' || param2 === "assistant" && param3 ? (var9.innerText = param1, (param4?.["prompt"] || param4?.["fulltext"]) && (var9.innerText = param4?.["prompt"] + ':')) : Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(var9, param1);
  var9.messageSourceText = param1;
  Zotero.AI4Paper.gptReaderSidePane_addClickEvent4ExpandArrow(var2, var3, var9, param2);
  var2.appendChild(var4);
  var2.appendChild(var9);
  if (param2 === 'user' && (param4?.['prompt'] || param4?.["fulltext"])) {
    const var10 = document.createElement("div");
    var10.classList.add("pdf-card", param2);
    var10.onclick = _0x3a6efb => {
      _0x3a6efb.preventDefault && _0x3a6efb.preventDefault();
      _0x3a6efb.stopPropagation();
      if (_0x3a6efb.shiftKey) {
        let var11 = Zotero.getMainWindow().document.createXULElement("menupopup");
        var11.id = "AI4Paper-gptReaderSidePane-filesList-menupopup";
        var11.addEventListener("popuphidden", () => {
          Zotero.getMainWindow().document.querySelector("#browser").querySelectorAll("#AI4Paper-gptReaderSidePane-filesList-menupopup").forEach(_0x31d165 => _0x31d165.remove());
        });
        let var12 = var11.firstElementChild;
        while (var12) {
          var12.remove();
          var12 = var11.firstElementChild;
        }
        let var13 = document.querySelectorAll(".file-info");
        for (let var14 of var13) {
          let var15 = Zotero.getMainWindow().document.createXULElement("menuitem");
          var15.setAttribute("label", var14.fileName);
          var15.addEventListener("command", _0x151eb6 => {
            var14.focus();
            var14.scrollIntoView({
              'behavior': "auto",
              'block': "center"
            });
          });
          var11.appendChild(var15);
        }
        Zotero.getMainWindow().document.querySelector("#browser").querySelectorAll("#AI4Paper-gptReaderSidePane-filesList-menupopup").forEach(_0xb1ab2a => _0xb1ab2a.remove());
        Zotero.getMainWindow().document.querySelector("#browser")?.['appendChild'](var11);
        var11.openPopup(var16, "after_start", 0x0, 0x0, false, false);
        var10.ownerDocument.defaultView.getSelection && var10.ownerDocument.defaultView.getSelection().removeAllRanges();
      }
    };
    const var16 = document.createElement("div");
    var16.classList.add("pdf-icon", param2);
    var16.onclick = _0x55cf77 => {
      _0x55cf77.preventDefault && _0x55cf77.preventDefault();
      _0x55cf77.stopPropagation();
      if (_0x55cf77.shiftKey) return;
      let var17 = var10.querySelector(".file-info"),
        var18 = Zotero.AI4Paper.getCurrentReader();
      if (var18 && var18._item === var17.item) {
        Zotero.AI4Paper.showProgressWindow(0x5dc, "❌ 打开附件【AI4paper】", "当前打开的就是该附件，无需再打开。");
        return;
      }
      Zotero.Reader.open(var17.item.itemID, null, {
        'openInWindow': false
      });
    };
    var16.addEventListener("mouseover", function () {
      this.style.cursor = "pointer";
    });
    var16.addEventListener("mouseout", function () {
      this.style.cursor = 'default';
    });
    var10.appendChild(var16);
    const var19 = document.createElement('div');
    let var20 = Zotero.AI4Paper.findItemByIDORKey(param4?.["fileID"]),
      var21 = "未在本文库找到本附件...(即来自其他 Zotero 账户）";
    var20 && (var21 = var20.attachmentFilename);
    var19.classList.add("file-info", param2);
    var19.prompt = param4?.["prompt"];
    var19.fulltext = param4?.['fulltext'];
    var19.fileName = var21;
    var19.item = var20;
    var19.itemID = param4?.["fileID"];
    const var22 = document.createElement("div");
    var22.classList.add('file-name', param2);
    var22.innerText = var21;
    var22.title = "attachmentTitle";
    var19.appendChild(var22);
    const var23 = document.createElement("div");
    var23.classList.add('file-size', param2);
    var23.innerText = "PDF 解析成功";
    var19.appendChild(var23);
    var10.appendChild(var19);
    var2.appendChild(var10);
  }
  return var2.addEventListener("click", async function (param5) {
    param2 != "user" && param5.shiftKey && !param5.ctrlKey && !param5.altKey && !param5.metaKey && (param5.preventDefault && param5.preventDefault(), param5.stopPropagation(), var2.focus(), var2.scrollIntoView({
      'behavior': "auto",
      'block': "start"
    }), var2.ownerDocument.defaultView.getSelection && var2.ownerDocument.defaultView.getSelection().removeAllRanges());
  }, false), var1.appendChild(var2), addQuickButtons(param2, var1), var1;
}
function addQuickButtons(param6, param7) {
  const var24 = document.createElement("div");
  var24.classList.add('message-buttons', param6);
  let var25 = document.createElement("div");
  var25.classList.add("button", param6);
  var25.classList.add("quickButton-Go2MessageTop");
  var25.innerHTML = Zotero.AI4Paper.svg_icon_16px.scrollTop;
  var25.setAttribute("title", '前往消息顶部');
  var25.addEventListener("mousedown", async _0x2b6abd => {
    _0x2b6abd.preventDefault && _0x2b6abd.preventDefault();
    _0x2b6abd.stopPropagation();
    if (_0x2b6abd.shiftKey) {
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_scrollTop(window);
      window.getSelection && window.getSelection().removeAllRanges();
      return;
    }
    _0x2b6abd.button === 0x0 && (Zotero.AI4Paper.gptReaderSidePane_ChatMode_go2MessageTop(_0x2b6abd, true), window.getSelection && (await Zotero.Promise.delay(0x32), window.getSelection().removeAllRanges()));
  });
  var24.appendChild(var25);
  var25 = document.createElement('div');
  var25.classList.add('button', param6);
  var25.classList.add("quickButton-CopyMessage");
  var25.innerHTML = Zotero.AI4Paper.svg_icon_16px.clipboard;
  var25.title = "拷贝消息";
  var25.addEventListener('mousedown', _0x54683d => {
    _0x54683d.preventDefault && _0x54683d.preventDefault();
    _0x54683d.stopPropagation();
    if (_0x54683d.shiftKey) {
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyAllMessages(false, window);
      return;
    }
    _0x54683d.button === 0x0 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessage(_0x54683d, true);
  });
  var24.appendChild(var25);
  var25 = document.createElement("div");
  var25.classList.add("button", param6);
  var25.classList.add("quickButton-CopyMessageSourceText");
  var25.innerHTML = Zotero.AI4Paper.svg_icon_16px.markdown;
  var25.title = "拷贝 Markdown 消息";
  var25.addEventListener("mousedown", _0x3cd517 => {
    _0x3cd517.preventDefault && _0x3cd517.preventDefault();
    _0x3cd517.stopPropagation();
    if (_0x3cd517.shiftKey) {
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyAllMessages(true, window);
      return;
    }
    _0x3cd517.button === 0x0 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessageSourceText(_0x3cd517, true);
  });
  var24.appendChild(var25);
  var25 = document.createElement("div");
  var25.classList.add("button", param6);
  var25.classList.add("quickButton-SaveMessages");
  var25.innerHTML = Zotero.AI4Paper.svg_icon_16px.save;
  var25.title = "导出全部消息为 Markdown";
  var25.onclick = _0x4f552a => {
    _0x4f552a.preventDefault && _0x4f552a.preventDefault();
    _0x4f552a.stopPropagation();
    Zotero.AI4Paper._data_renderChatHistory_quickBtn_clickEvent = _0x4f552a;
    let var26 = window.parent._buildContextMenu_messageBtn_SaveMessages();
    var26 && var26.openPopup(_0x4f552a.target, "after_start", 0x0, 0x0, false, false);
  };
  var24.appendChild(var25);
  var25 = document.createElement("div");
  var25.classList.add("button", param6);
  var25.classList.add("quickButton-ModifyUserMessage");
  var25.innerHTML = Zotero.AI4Paper.svg_icon_16px.rename_16px;
  var25.title = "修改消息";
  var25.addEventListener("click", _0x1a74d3 => {
    _0x1a74d3.preventDefault && _0x1a74d3.preventDefault();
    _0x1a74d3.stopPropagation();
    modifyMessage(_0x1a74d3);
  });
  var24.appendChild(var25);
  param6 === 'assistant' && (var25 = document.createElement("div"), var25.classList.add("button", param6), var25.classList.add("quickButton-deleteMessages"), var25.innerHTML = Zotero.AI4Paper.svg_icon_16px["delete"], var25.title = "删除消息", var25.addEventListener('click', _0x25e96a => {
    _0x25e96a.preventDefault && _0x25e96a.preventDefault();
    _0x25e96a.stopPropagation();
    deleteMessages(_0x25e96a);
  }), var24.appendChild(var25));
  param7.appendChild(var24);
}
function modifyMessage(param8) {
  Zotero.AI4Paper._data_renderChatHistory_modifyMessage = null;
  let var27 = param8.target.closest('.message-container').querySelector(".message"),
    var28 = var27.querySelector(".content"),
    var29 = var28.messageSourceText,
    var30 = var27.querySelector(".file-info");
  if (var30) {
    window.alert('❌\x20该消息中包含\x20PDF\x20附件，不支持修改！建议载入对话后，点击消息按钮【修改后重新提问】。');
    return;
  }
  let var31 = Zotero.AI4Paper.openDialogByType_modal("modifyMessage", var29);
  if (!var31.trim()) {
    window.alert("消息不可为空！请重新修改。");
    return;
  }
  if (var31 === var29) {
    window.alert("❌ 未发现有任何更改。");
    return;
  }
  let var32 = window.document.querySelectorAll(".message"),
    var33 = 0x0;
  for (let var34 of var32) {
    if (var34 === var27) break;
    var33++;
  }
  Zotero.AI4Paper._data_renderChatHistory_modifyMessage = {
    'newMessageContent': var31,
    'index': var33
  };
  window.parent._modifyMessage();
}
function deleteMessages(param9) {
  Zotero.AI4Paper._data_renderChatHistory_deleteMessages = null;
  let var35 = param9.target.closest(".message-container").querySelector(".message"),
    var36 = window.document.querySelectorAll(".message");
  if (var36.length === 0x2) {
    window.alert('❌\x20当前对话仅剩一组【用户问题\x20&\x20AI\x20回复】，不支持删除操作。');
    return;
  }
  let var37 = Services.prompt.confirm(window, "删除消息", "是否确认删除当前【用户问题 & AI 回复】消息组？一旦删除，将无法恢复。");
  if (var37) {
    let var38 = 0x0;
    for (let var39 of var36) {
      if (var39 === var35) break;
      var38++;
    }
    Zotero.AI4Paper._data_renderChatHistory_deleteMessages = var38;
    window.parent._deleteMessages();
  }
}
function injectStyle() {
  const var40 = {
      '默认': "#1e1e1e",
      '深黑': "#000000",
      '漆黑': "#161823",
      '乌黑': "#392f41",
      '藏青': "#2e4e7e",
      '花青': "#003472",
      '元青': "#3e3c3d",
      '玫瑰红': "#973444",
      '月季红': '#bb1c33',
      '番茄红': "#c4473d",
      '灯草灰': "#363532",
      '相思灰': '#625c52'
    },
    var41 = var40[Zotero.Prefs.get("ai4paper.gptSidePaneDarkModeTheme")] || "#1e1e1e",
    var42 = document.getElementById("chatUIStyle");
  var42 && (var42.innerHTML = getChatUIStyle_light() + getChatUIStyle_dark(var41));
}
function getChatUIStyle_light() {
  return '\x0a\x20\x20\x20\x20.markdown-body\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20box-sizing:\x20border-box;\x0a\x20\x20\x20\x20\x20\x20\x20\x20min-width:\x20200px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20max-width:\x20980px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin:\x200\x20auto;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x205px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background-color:\x20inherit;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20@media\x20(max-width:\x20767px)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20.markdown-body\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20padding:\x205px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20body\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-family:\x20Arial,\x20sans-serif;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin:\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background:\x20#f4f4f4;\x0a\x20\x20\x20\x20\x20\x20\x20\x20align-items:\x20center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20height:\x20100vh;\x0a\x20\x20\x20\x20\x20\x20\x20\x20justify-content:\x20center;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#chat-container\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x20100%;\x0a\x20\x20\x20\x20\x20\x20\x20\x20height:\x20400px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20position:\x20relative;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background:\x20white;\x0a\x20\x20\x20\x20\x20\x20\x20\x20overflow-y:\x20auto;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x2010px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20box-sizing:\x20border-box;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border:\x20none;\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20/*\x20=========================================\x0a\x20\x20\x20\x20\x20\x20\x20[核心区域]\x20底部浮动按钮及动态边框样式\x0a\x20\x20\x20\x20=========================================\x20*/\x0a\x0a\x20\x20\x20\x20#scroll-to-bottom-btn\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20position:\x20absolute;\x0a\x20\x20\x20\x20\x20\x20\x20\x20bottom:\x2040px;\x20left:\x2050%;\x0a\x20\x20\x20\x20\x20\x20\x20\x20transform:\x20translateX(-50%);\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x2035px;\x20height:\x2035px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background-color:\x20#fff;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border:\x201px\x20solid\x20#e0e0e0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x2050%;\x0a\x20\x20\x20\x20\x20\x20\x20\x20box-shadow:\x200\x204px\x2012px\x20rgba(0,0,0,0.1);\x0a\x20\x20\x20\x20\x20\x20\x20\x20cursor:\x20pointer;\x0a\x20\x20\x20\x20\x20\x20\x20\x20display:\x20none;\x0a\x20\x20\x20\x20\x20\x20\x20\x20align-items:\x20center;\x20justify-content:\x20center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20z-index:\x20100;\x0a\x20\x20\x20\x20\x20\x20\x20\x20transition:\x20all\x200.2s\x20ease;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#scroll-to-bottom-btn\x20svg\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20fill:\x20#999;\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x2024px;\x20height:\x2024px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20transition:\x20fill\x200.2s\x20ease;\x0a\x20\x20\x20\x20\x20\x20\x20\x20z-index:\x202;\x20position:\x20relative;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#scroll-to-bottom-btn:hover\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20background-color:\x20#fafafa;\x0a\x20\x20\x20\x20\x20\x20\x20\x20box-shadow:\x200\x206px\x2016px\x20rgba(0,0,0,0.15);\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-color:\x20#d0d0d0;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#scroll-to-bottom-btn:hover\x20svg\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20fill:\x20#666;\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20#scroll-to-bottom-btn.is-streaming\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-color:\x20transparent;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#scroll-to-bottom-btn.is-streaming\x20svg\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20fill:\x20#61a5f2;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#scroll-to-bottom-btn.is-streaming::before\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20content:\x20\x22\x22;\x0a\x20\x20\x20\x20\x20\x20\x20\x20position:\x20absolute;\x0a\x20\x20\x20\x20\x20\x20\x20\x20top:\x20-1px;\x20left:\x20-1px;\x20right:\x20-1px;\x20bottom:\x20-1px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x2050%;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border:\x201px\x20solid\x20rgba(74,\x20144,\x20226,\x200.2);\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-top-color:\x20#61a5f2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-right-color:\x20#61a5f2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20animation:\x20spin-border\x200.8s\x20linear\x20infinite;\x0a\x20\x20\x20\x20\x20\x20\x20\x20z-index:\x201;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20@keyframes\x20spin-border\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20from\x20{\x20transform:\x20rotate(0deg);\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20to\x20{\x20transform:\x20rotate(360deg);\x20}\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20.message\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20max-width:\x20var(--msg-max-width,\x20600px);\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x2010px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x2010px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20clear:\x20both;\x0a\x20\x20\x20\x20\x20\x20\x20\x20line-height:\x201.4;\x0a\x20\x20\x20\x20\x20\x20\x20\x20word-wrap:\x20break-word;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.username\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-weight:\x20bold;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-right:\x2010px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.content\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20overflow:\x20auto;\x0a\x20\x20\x20\x20\x20\x20\x20\x20clear:\x20both;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-top:\x204px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20-ms-word-break:\x20break-all;\x0a\x20\x20\x20\x20\x20\x20\x20\x20word-break:\x20break-all;\x0a\x20\x20\x20\x20\x20\x20\x20\x20-ms-hyphens:\x20auto;\x0a\x20\x20\x20\x20\x20\x20\x20\x20-moz-hyphens:\x20auto;\x0a\x20\x20\x20\x20\x20\x20\x20\x20-webkit-hyphens:\x20auto;\x0a\x20\x20\x20\x20\x20\x20\x20\x20hyphens:\x20auto;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.content.assistant\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-left:\x2020px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.content.user\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-right:\x2020px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20text-align:\x20right;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.message.assistant\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float:\x20left;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background-color:\x20#f3f3f3;\x0a\x20\x20\x20\x20\x20\x20\x20\x20text-align:\x20left;\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x20fit-content;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.message.assistant:has(table)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20max-width:\x20var(--msg-table-max-width,\x20min(90vw,\x20900px));\x0a\x20\x20\x20\x20\x20\x20\x20\x20overflow-x:\x20auto;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.message.assistant\x20table\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20min-width:\x20max-content;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.message.user\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float:\x20right;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background-color:\x20#edffed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20text-align:\x20right;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.message-container\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20display:\x20flex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20flex-direction:\x20column;\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x20100%;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-bottom:\x2015px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.message-container.user\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20align-items:\x20flex-end;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.message-container.assistant\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20align-items:\x20flex-start;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.message-buttons\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20display:\x20flex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20justify-content:\x20center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding-top:\x205px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.button\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x2016px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20height:\x2016px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vertical-align:\x20middle;\x0a\x20\x20\x20\x20\x20\x20\x20\x20transition:\x20transform\x200.3s\x20ease;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.button.assistant\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-left:\x2012px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.button.user\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-right:\x2012px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.button:hover\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20transform:\x20scale(1.1);\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.checkbox\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x2020px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20height:\x2020px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x2050%;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vertical-align:\x20middle;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.avatar\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x2020px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20height:\x2020px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x2050%;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vertical-align:\x20middle;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.message-row\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20display:\x20flex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20align-items:\x20center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-bottom:\x204px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.message-row.user\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20justify-content:\x20flex-end;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.pdf-card\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20display:\x20flex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20align-items:\x20center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background-color:\x20#f3f3f3;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x2010px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x2015px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin:\x2010px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x20250px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.pdf-icon\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x2030px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20height:\x2030px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background-image:\x20url(\x27chrome://ai4paper/content/icons/reader_20px.svg\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20background-size:\x20cover;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-right:\x2015px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20flex-shrink:\x200;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.file-info\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20display:\x20flex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20flex-direction:\x20column;\x0a\x20\x20\x20\x20\x20\x20\x20\x20flex-grow:\x201;\x0a\x20\x20\x20\x20\x20\x20\x20\x20min-width:\x200;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.file-name\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-size:\x2015px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-weight:\x20bold;\x0a\x20\x20\x20\x20\x20\x20\x20\x20color:\x20#333;\x0a\x20\x20\x20\x20\x20\x20\x20\x20white-space:\x20nowrap;\x0a\x20\x20\x20\x20\x20\x20\x20\x20overflow:\x20hidden;\x0a\x20\x20\x20\x20\x20\x20\x20\x20text-overflow:\x20ellipsis;\x0a\x20\x20\x20\x20\x20\x20\x20\x20text-align:\x20left;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.file-size\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20align-self:\x20flex-start;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-top:\x204px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-size:\x2012px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20color:\x20#666;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.openaiLogoContainer\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20display:\x20flex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20align-items:\x20center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20justify-content:\x20center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20height:\x20100%;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.openaiLogo\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x20320px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20height:\x20320px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#context-menu\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20display:\x20none;\x0a\x20\x20\x20\x20\x20\x20\x20\x20position:\x20absolute;\x0a\x20\x20\x20\x20\x20\x20\x20\x20z-index:\x20999;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background:\x20#dddce1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20box-shadow:\x203px\x203px\x2010px\x20rgba(0,\x200,\x200,\x200.2);\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x208px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x200px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin:\x200;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#context-menu\x20ul\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20list-style:\x20none;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin:\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x208px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20overflow:\x20hidden;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#context-menu\x20ul\x20li\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-size:\x2013px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x205px\x208px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20cursor:\x20pointer;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-bottom:\x201px\x20solid\x20#d3d3d3;\x0a\x20\x20\x20\x20\x20\x20\x20\x20white-space:\x20nowrap;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#context-menu\x20ul\x20li:hover\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20background-color:\x20#7eb6fd;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#context-menu\x20ul\x20li:last-child\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-bottom:\x20none;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.quickButton\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x2020px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20height:\x2020px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20position:\x20absolute;\x0a\x20\x20\x20\x20\x20\x20\x20\x20bottom:\x207px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x204px\x204px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x206px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.quickButton\x20svg\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20pointer-events:\x20none;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20@keyframes\x20spin\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x200%\x20{\x20transform:\x20rotate(0deg);\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20100%\x20{\x20transform:\x20rotate(360deg);\x20}\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20/*\x20---\x20用户消息折叠功能\x20CSS\x20---\x20*/\x0a\x20\x20\x20\x20' + Zotero.AI4Paper.gptReaderSidePane_addCSS4ExpandArrow() + "\n    ";
}
function getChatUIStyle_dark(param10) {
  return "\n    /* ===================================================\n       深色模式覆盖\n    =================================================== */\n    @media (prefers-color-scheme: dark) {\n\n        /* 页面背景 */\n        body {\n            background: none;\n        }\n\n        /* 聊天容器 */\n        #chat-container {\n            background: none;\n            height: 514px;\n            padding-left: 0;\n            padding-right: 10px;\n        }\n\n        /* 悬浮滚动按钮 */\n        #scroll-to-bottom-btn {\n            background-color: #5c5a5a;\n            border-color: #c9c9c9;\n        }\n        #scroll-to-bottom-btn:hover {\n            background-color: #787575;\n        }\n        #scroll-to-bottom-btn:hover svg {\n            fill: #595959;\n        }\n\n        /* 消息气泡 */\n        .message.assistant {\n            background-color: " + param10 + ";\n        }\n        .message.user {\n            background-color: #474646;\n        }\n\n        /* PDF 附件卡片 */\n        .pdf-card {\n            background-color: #3b3a3a;\n        }\n        .file-name {\n            color: #eaeaea;\n        }\n        .file-size {\n            color: #bbbbbb;\n        }\n\n        /* 右键菜单 */\n        #context-menu {\n            background: #2a2830;\n        }\n        #context-menu ul li {\n            border-bottom: none;\n        }\n        #context-menu ul li:hover {\n            background-color: #0d72eb;\n        }\n    }\n    ";
}