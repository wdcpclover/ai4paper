var chatHistoryMethods = {
  'messages': [],
  'currentSelectedId': null,
  'init': async function () {
    this.injectStyle();
    Zotero.AI4Paper.update_svg_icons(document);
    this.setupIframeResize();
    this.buildContextMenu(null, true);
    this.buildContextMenu_filter(true);
    this.buildContextMenu_messageBtn_SaveMessages(true);
    window._buildContextMenu_messageBtn_SaveMessages = this.buildContextMenu_messageBtn_SaveMessages;
    window._modifyMessage = this.modifyMessage;
    window._deleteMessages = this.deleteMessages;
    this.initKeyboardShortcuts();
    await this.refreshMessages(true);
    await this.buildSearchDropmarker();
  },
  'setupIframeResize': function () {
    let var1 = document.getElementById("renderChatHistory-iframe"),
      var2 = document.querySelector(".right-panel-body");
    if (!var1 || !var2) return;
    let var3 = () => {
        let _0x3ed9ed = var2.getBoundingClientRect(),
          _0x5cdee0 = _0x3ed9ed.height,
          _0x3090e7 = _0x3ed9ed.width;
        if (_0x5cdee0 > 0x0) {
          var1.style.height = _0x5cdee0 + 'px';
          var1.style.width = "100%";
          try {
            let var7 = var1.contentDocument;
            if (!var7) return;
            let var8 = var7.getElementById('chat-container');
            var8 && (var8.style.height = _0x5cdee0 + 'px');
            let var9 = Math.min(Math.max(_0x3090e7 * 0.75, 0x258), 0x4b0),
              var10 = Math.min(Math.max(_0x3090e7 * 0.9, 0x258), 0x640);
            var7.documentElement.style.setProperty("--msg-max-width", var9 + 'px');
            var7.documentElement.style.setProperty("--msg-table-max-width", var10 + 'px');
          } catch (_0x1d034e) {}
        }
      },
      var11 = new ResizeObserver(var3);
    var11.observe(var2);
    this._resizeObserver = var11;
    var1.addEventListener('load', var3, {
      'once': true
    });
    var3();
  },
  '_isFitted': false,
  '_isFullScreen': false,
  '_clickTimer': null,
  'toggleFitScreen': function () {
    if (this._clickTimer) clearTimeout(this._clickTimer);
    this._clickTimer = setTimeout(() => {
      if (this._isFullScreen) {
        this.resetToMinSize();
        this._isFullScreen = false;
        this._isFitted = false;
      } else {
        if (this._isFitted) {
          this.resetToMinSize();
          this._isFitted = false;
        } else {
          this.fitToScreen();
          this._isFitted = true;
        }
      }
      this._updateFitBtnLabel();
    }, 0xc8);
  },
  'toggleFullScreen': function () {
    if (this._clickTimer) clearTimeout(this._clickTimer);
    this._isFullScreen ? (this.resetToMinSize(), this._isFullScreen = false, this._isFitted = false) : (this.fillScreen(), this._isFullScreen = true, this._isFitted = true);
    this._updateFitBtnLabel();
  },
  '_updateFitBtnLabel': function () {
    let var12 = document.getElementById('fitscreen-btn');
    if (this._isFullScreen) var12.textContent = "恢复默认";else this._isFitted ? var12.textContent = "恢复默认" : var12.textContent = "适配屏幕";
  },
  'fillScreen': function () {
    let var13 = window.screen.availWidth,
      var14 = window.screen.availHeight,
      var15 = window.screen.availLeft || 0x0,
      var16 = window.screen.availTop || 0x0;
    window.resizeTo(var13, var14);
    window.moveTo(var15, var16);
  },
  'fitToScreen': function (param1) {
    const var17 = 0x450,
      var18 = 0x2d3,
      var19 = var17 / var18;
    let var20 = window.screen.availWidth,
      var21 = window.screen.availHeight,
      var22 = window.screen.availLeft || 0x0,
      var23 = window.screen.availTop || 0x0,
      var24 = param1 || 0.75,
      var25 = Math.round(var21 * var24),
      var26 = Math.round(var25 * var19);
    var26 > var20 * 0.95 && (var26 = Math.round(var20 * 0.95), var25 = Math.round(var26 / var19));
    var26 = Math.max(var26, var17);
    var25 = Math.max(var25, var18);
    let var27 = var22 + Math.round((var20 - var26) / 0x2),
      var28 = var23 + Math.round((var21 - var25) / 0x2);
    window.resizeTo(var26, var25);
    window.moveTo(var27, var28);
  },
  'resetToMinSize': function () {
    let var29 = window.screen.availWidth,
      var30 = window.screen.availHeight,
      var31 = window.screen.availLeft || 0x0,
      var32 = window.screen.availTop || 0x0;
    window.resizeTo(0x450, 0x2d3);
    window.moveTo(var31 + Math.round((var29 - 0x450) / 0x2), var32 + Math.round((var30 - 0x2d3) / 0x2));
  },
  'readMessages': async function () {
    let var33 = Zotero.Prefs.get("ai4paper.gptChatHistoryLocalPath");
    (!var33 || !(await Zotero.AI4Paper.isPathExists(var33))) && (this.messages = []);
    let var34 = await Zotero.AI4Paper.readChatHistoryFromLocal(var33);
    return this.messages = var34, var34;
  },
  'renderMessageList': function (param2, param3) {
    let var35 = document.getElementById("message-list-container");
    var35.innerHTML = '';
    const var36 = "http://www.w3.org/1999/xhtml";
    param2.forEach(_0x221b6c => {
      let var37 = document.createElementNS(var36, 'html:div');
      var37.className = 'message-list-item';
      var37.setAttribute('data-id', _0x221b6c.id);
      this.addFileID2Item(var37, _0x221b6c);
      let var38 = document.createElementNS(var36, "html:div");
      var38.className = "message-item-title";
      var38.textContent = _0x221b6c.title;
      let var39 = document.createElementNS(var36, 'html:div');
      var39.className = "message-item-time";
      let var40 = this.getServiceAndModel(_0x221b6c.content),
        var41 = var40.model ? '\x20·\x20' + var40.model : '';
      var39.textContent = '' + _0x221b6c.time + var41;
      var37.appendChild(var38);
      var37.appendChild(var39);
      var37.addEventListener('mouseenter', _0x5077fa => {
        this.showTooltip(_0x5077fa.currentTarget, _0x221b6c.title);
      });
      var37.addEventListener("mouseleave", () => {
        this.hideTooltip();
      });
      var37.addEventListener("click", _0x2f6344 => {
        this.selectMessage(param2, _0x221b6c.id, param3);
        _0x2f6344.shiftKey && Zotero.AI4Paper.revealPath(_0x221b6c.path);
      });
      var37.oncontextmenu = _0xc9422 => {
        let var42 = this.buildContextMenu(_0xc9422, false);
        var42 && var42.openPopup(var37, 'after_start', 0x64, 0x0, false, false);
      };
      var37.addEventListener("dblclick", _0xa2c743 => {
        try {
          let var43 = JSON.parse(_0x221b6c.content),
            var44 = var43.find(_0x28c397 => _0x28c397.fileID);
          if (var44) {
            let var45 = Zotero.AI4Paper.findItemByIDORKey(var44.fileID);
            var45 && Zotero.Reader.open(var45.itemID, null, {
              'openInWindow': false
            });
          }
        } catch (_0x3e68fc) {
          Zotero.debug(_0x3e68fc);
        }
      });
      var35.appendChild(var37);
    });
    this.showResultMessage(param2, param3);
  },
  'showTooltip': function (param4, param5) {
    let var46 = document.getElementById('global-tooltip');
    !var46 && (var46 = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div"), var46.id = "global-tooltip", var46.className = 'global-tooltip', document.documentElement.appendChild(var46));
    var46.textContent = param5;
    const var47 = param4.getBoundingClientRect();
    var46.style.left = var47.right + 0xa + 'px';
    var46.style.top = var47.top + var47.height / 0x2 + 'px';
    var46.classList.add("visible");
  },
  'hideTooltip': function () {
    let var48 = document.getElementById("global-tooltip");
    if (var48) {
      var48.classList.remove("visible");
    }
  },
  'addFileID2Item': function (param6, param7) {
    try {
      let var49 = JSON.parse(param7.content),
        var50 = var49.find(_0x232cd0 => _0x232cd0.fileID);
      var50 && param6.setAttribute("data-fileID", var50.fileID);
    } catch (_0x12750c) {
      Zotero.debug(_0x12750c);
    }
  },
  'initKeyboardShortcuts': function () {
    document.addEventListener("keydown", _0x51b7a9 => {
      (_0x51b7a9.metaKey || _0x51b7a9.ctrlKey) && _0x51b7a9.key === 'c' && this.copySelectedText();
    });
  },
  'copySelectedText': function () {
    let var51 = window.getSelection(),
      var52 = var51.toString();
    if (var52) {
      navigator.clipboard && navigator.clipboard.writeText && navigator.clipboard.writeText(var52).then(() => {
        console.log("已复制到剪贴板");
      })["catch"](_0xe9e5e2 => {
        Zotero.debug(_0xe9e5e2);
      });
    }
  },
  'onClickContentTitle': function (param8) {
    if (param8.shiftKey) {
      this.clearSelection();
      let var53 = document.getElementById("renderChatHistory-iframe").contentWindow;
      const var54 = var53.document.getElementById("chat-container");
      var54 && (var54.scrollTop = 0x0);
    }
  },
  'onDblClickContentTitle': function (param9) {
    let var55 = document.getElementById("renderChatHistory-iframe").contentWindow;
    const var56 = var55.document.getElementById('chat-container');
    var56 && (var56.scrollTop = var56.scrollHeight);
  },
  'clearSelection'() {
    if (window.getSelection) window.getSelection().removeAllRanges();else document.selection && document.selection.empty();
  },
  'getServiceAndModel': function (param10) {
    let var57, var58;
    try {
      for (let var59 of JSON.parse(param10)) {
        if (var59.service) {
          var57 = var59.service;
          var58 = var59.model;
        }
      }
    } catch (_0x27a634) {
      Zotero.debug(_0x27a634);
    }
    return {
      'service': var57,
      'model': var58
    };
  },
  'calculateTokens': function (param11) {
    try {
      return Zotero.AI4Paper.calculateTokens(JSON.parse(param11).map(_0x5312a6 => _0x5312a6.content).join(''));
    } catch (_0x24c79d) {
      return Zotero.debug(_0x24c79d), false;
    }
  },
  'selectMessage': function (param12, param13, param14) {
    param14 != "search" && this.searchBoxBlur();
    let var60 = document.querySelectorAll(".message-list-item");
    var60.forEach(_0xc2090d => {
      _0xc2090d.classList.remove("selected");
      parseInt(_0xc2090d.getAttribute("data-id")) === param13 && _0xc2090d.classList.add('selected');
    });
    let var61 = param12.find(_0x15f02d => _0x15f02d.id === param13);
    if (var61) {
      this.currentSelectedId = param13;
      document.getElementById("content-title").textContent = var61.title;
      document.getElementById('content-time').textContent = var61.time;
      let var62 = document.getElementById('content-model'),
        var63 = this.getServiceAndModel(var61.content);
      var62.textContent = var63.model || '';
      var62.style.display = var63.model ? "inline-block" : 'none';
      let var64 = document.getElementById("content-tokens"),
        var65 = this.calculateTokens(var61.content);
      var64.textContent = var65 ? "tokens: " + var65 : '';
      var64.style.display = var65 ? 'inline-block' : 'none';
      let var66 = document.getElementById("renderChatHistory-iframe").contentWindow;
      this.clearChat(var66);
      const var67 = var66.document.getElementById("chat-container");
      for (let var68 of JSON.parse(var61.content)) {
        let _0x563a91 = var66.createMessageElement(var68.content, var68.role, null, var68);
        var67.appendChild(_0x563a91);
      }
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_enhanceMessageElem(var66);
    }
    this.showResultMessage_selectedItem(param12, param13, param14);
  },
  'refreshMessages': async function (param15) {
    await this.readMessages();
    this.currentSelectedId = null;
    this.renderMessageList(this.messages);
    this.messages.length > 0x0 ? !window._notSelectFirst && this.selectMessage(this.messages, this.messages[0x0].id) : this.clear();
    if (!param15) this.setMode_filter("filter", true);else {
      let _0x289006 = this.getMode_filter();
      _0x289006 != "filter" && this.setMode_filter(_0x289006);
    }
  },
  'clear'() {
    document.getElementById("content-title").textContent = '';
    document.getElementById("content-time").textContent = '';
    document.getElementById("content-model").style.display = "none";
    document.getElementById('content-tokens').style.display = 'none';
    this.clearChat();
  },
  'clearChat': function (param16) {
    !param16 && (param16 = document.getElementById("renderChatHistory-iframe").contentWindow);
    let var71 = param16.document.querySelectorAll('.message-container');
    var71.forEach(_0x50aae2 => _0x50aae2.remove());
    Zotero.AI4Paper.gptReaderSidePane_hiddeScrollBtn(param16);
  },
  'deleteMessage': async function () {
    if (!this.currentSelectedId) {
      window.alert("请先选择一条消息");
      return;
    }
    let var72 = this.messages.find(_0x277e4c => _0x277e4c.id === this.currentSelectedId);
    if (var72) {
      truthBeTold = window.confirm('【是否确认删除消息】：👉\x20' + var72.title + " 👈\n\n【消息本地路径】：👉 " + var72.path + " 👈。\n\n一旦删除，将无法恢复！");
      if (truthBeTold) {
        try {
          await Zotero.File.removeIfExists(var72.path);
          await this.refreshMessages();
        } catch (_0x4faac0) {
          Zotero.debug(_0x4faac0);
        }
      }
    }
  },
  'loadMessage': function () {
    if (!this.currentSelectedId) {
      window.alert('请先选择一条消息');
      return;
    }
    let var73 = this.messages.find(_0x42e162 => _0x42e162.id === this.currentSelectedId);
    if (var73) try {
      let var74 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (var74 && var74._gptStreamRunning) {
        window.alert('❌\x20当前已有\x20GPT\x20对话正在进行中...如有需要，可手动中止对话后再载入。');
        return;
      }
      let var75 = JSON.parse(var73.content);
      Zotero.AI4Paper._data_gptMessagesHistory = var73.content;
      Zotero.AI4Paper._data_gptChatHistoryFileName = var73.fileName;
      Zotero.AI4Paper.updateChatGPTReaderSidePane();
    } catch (_0xdef4c) {
      Zotero.AI4Paper._data_gptMessagesHistory = '[]';
    }
  },
  'injectStyle': function () {
    let var76 = document.createElementNS("http://www.w3.org/1999/xhtml", "html:style");
    var76.textContent = "\n    /* ========== 定义 CSS 变量 - 浅色主题（默认） ========== */\n    :root {\n        /* 背景色 */\n        --bg-primary: #ffffff;\n        --bg-secondary: #f9f9f9;\n        --bg-tertiary: #f5f5f5;\n        --bg-header: #e9e9e9;\n        --bg-model: #eceef0;\n        \n        /* 边框色 */\n        --border-color: #cccccc;\n        --border-color-light: #dddddd;\n        \n        /* 文字色 */\n        --text-primary: #333333;\n        --text-secondary: #444444;\n        --text-muted: #888888;\n        \n        /* 交互色 */\n        --hover-bg: #f2f8fc; /* 我修改了，原来的 #e8f4fc */\n        --hover-border: #4a90d9;\n        --selected-bg: #d0e8ff;\n        --selected-border: #2d7fd3;\n        --selected-shadow: rgba(45, 127, 211, 0.3);\n        \n        /* 按钮色 */\n        --btn-bg: #e5e5e5;\n        --btn-primary-bg: #4a90d9;\n        --btn-danger-bg: #e55c5c;\n        --filter-btn-bg: #f5f5f5;\n        --add-btn-bg: #e5e5e5;\n\n        /* Tooltip 色 - 浅色主题用深色背景 */\n        --tooltip-bg: #616161;\n        --tooltip-text: #ffffff;\n        --tooltip-shadow: rgba(0, 0, 0, 0.25);\n    }\n    \n    /* ========== 深色主题 ========== */\n    @media (prefers-color-scheme: dark) {\n        :root {\n            /* 背景色 */\n            --bg-primary: #2b2b2b;\n            --bg-secondary: #323232;\n            --bg-tertiary: #3a3a3a;\n            --bg-header: #404040;\n            --bg-model: #333333;\n            \n            /* 边框色 */\n            --border-color: #505050;\n            --border-color-light: #454545;\n            \n            /* 文字色 */\n            --text-primary: #e0e0e0;\n            --text-secondary: #cccccc;\n            --text-muted: #999999;\n            \n            /* 交互色 */\n            --hover-bg: #3d4f5f;\n            --hover-border: #5a9fd9;\n            --selected-bg: #2a4a6a;\n            --selected-border: #5a9fd9;\n            --selected-shadow: rgba(90, 159, 217, 0.4);\n            \n            /* 按钮色 */\n            --btn-bg: #505050;\n            --btn-primary-bg: #4a90d9;\n            --btn-danger-bg: #d95555;\n            --filter-btn-bg: #545454;\n            --add-btn-bg: #545454;\n\n            /* Tooltip 色 - 深色主题用浅色背景 */\n            --tooltip-bg: #e8e8e8;\n            --tooltip-text: #1a1a1a;\n            --tooltip-shadow: rgba(0, 0, 0, 0.4);\n        }\n    }\n\n    /* ===== 关键改动：从 dialog 开始建立完整的 flex 填充链 ===== */\n    #zoteroone-dialog-chatHistory {\n        display: flex;\n        flex-direction: column;\n        flex: 1;\n        height: 100%;\n        overflow: hidden;\n    }\n\n    #vboxContainer-elem {\n        display: flex;\n        flex-direction: column;\n        flex: 1;\n        min-height: 0;  /* 允许 flex 子项缩小到 0 */\n    }\n    \n    /* ========== 主容器样式 ========== */\n    .main-container {\n        display: flex;\n        flex-direction: row;\n        flex: 1;           /* 关键：弹性填满剩余空间 */\n        min-height: 0;     /* 关键：防止内容撑破容器 */\n        gap: 10px;\n    }\n    \n    /* ========== 左侧消息列表 ========== */\n    .left-panel {\n        width: 23%;              /* 占主容器的 23% */\n        min-width: 250px;        /* 窗口小时不低于 250px */\n        max-width: 340px;        /* 窗口大时不超过 360px */\n        display: flex;\n        flex-direction: column;\n        border: 1px solid var(--border-color);\n        border-radius: 5px;\n        background: var(--bg-secondary);\n        min-height: 0;     /* 允许缩小 */\n    }\n    \n    .left-panel-header {\n        padding: 8px;\n        font-weight: bold;\n        border-bottom: 1px solid var(--border-color);\n        background: var(--bg-header);\n        border-radius: 5px 5px 0 0;\n        color: var(--text-primary);\n        /* 我增加的 */\n        justify-content: space-between;\n        align-items: center;\n        line-height: 1.5;\n        vertical-align: middle;\n        display: flex;\n        flex-shrink: 0;    /* 标题栏不缩小 */\n    }\n    \n    #message-list-container {\n        flex: 1;\n        overflow-y: auto;\n        padding: 5px;\n        min-height: 0;     /* 关键：让滚动条正确工作 */\n    }\n    \n    .message-list-item {\n        padding: 10px;\n        margin: 5px 0;\n        border: 1px solid var(--border-color-light);\n        border-radius: 4px;\n        background: var(--bg-primary);\n        transition: all 0.15s ease;\n    }\n    \n    .message-list-item:hover {\n        background: var(--hover-bg);\n        border-color: var(--hover-border);\n    }\n    \n    .message-list-item.selected {\n        background: var(--selected-bg);\n        border-color: var(--selected-border);\n        box-shadow: 0 0 3px var(--selected-shadow);\n    }\n\n    /* 全局 Tooltip 样式 - 固定定位，不受容器限制 */\n    .global-tooltip {\n        position: fixed;\n        transform: translateY(-50%);\n        z-index: 10000;\n        background: var(--tooltip-bg);\n        color: var(--tooltip-text);\n        border: 1px solid var(--tooltip-border);\n        padding: 8px 12px;\n        border-radius: 4px;\n        font-size: 12px;\n        font-weight: normal;\n        max-width: 300px;\n        white-space: normal;\n        word-wrap: break-word;\n        box-shadow: 0 2px 8px var(--tooltip-shadow);\n        pointer-events: none;\n        \n        /* 默认隐藏 */\n        visibility: hidden;\n        opacity: 0;\n        transition: opacity 0.15s ease, visibility 0.15s ease;\n    }\n\n    /* 显示状态 */\n    .global-tooltip.visible {\n        visibility: visible;\n        opacity: 1;\n    }\n\n    /* 左侧小三角箭头 - 边框层 */\n    .global-tooltip::before {\n        content: \"\";\n        position: absolute;\n        right: 100%;\n        top: 50%;\n        transform: translateY(-50%);\n        border: 6px solid transparent;\n        border-right-color: var(--tooltip-border);\n    }\n\n    /* 左侧小三角箭头 - 背景层 */\n    .global-tooltip::after {\n        content: \"\";\n        position: absolute;\n        right: 100%;\n        top: 50%;\n        transform: translateY(-50%);\n        border: 5px solid transparent;\n        border-right-color: var(--tooltip-bg);\n        margin-right: 1px;\n    }\n    \n    .message-item-title {\n        font-weight: bold;\n        font-size: 13px;\n        color: var(--text-primary);\n        margin-bottom: 5px;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        display: block !important;\n        width: 100% !important;\n    }\n    \n    .message-item-time {\n        font-size: 11px;\n        color: var(--text-muted);\n        margin-bottom: 5px;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        display: block !important;\n        width: 100% !important;\n    }\n    \n    /* ========== 右侧内容区域 ========== */\n    .right-panel {\n        flex: 1;\n        display: flex;\n        flex-direction: column;\n        border: 1px solid var(--border-color);\n        border-radius: 5px;\n        background: var(--bg-primary);\n        min-height: 0;     /* 允许缩小 */\n        min-width: 0;      /* 防止文字撑破宽度 */\n    }\n    \n    .right-panel-header {\n        padding: 15px;\n        border-bottom: 1px solid var(--border-color);\n        background: var(--bg-tertiary);\n        border-radius: 5px 5px 0 0;\n        flex-shrink: 0;    /* 标题栏不缩小 */\n    }\n    \n    #content-title {\n        font-size: 14px;\n        font-weight: bold;\n        color: var(--text-primary);\n        margin-bottom: 5px;\n        user-select: text;\n    }\n\n    /* 右侧头部的元信息行 */\n    .content-meta {\n        display: flex;\n        align-items: center;\n        gap: 12px;\n        flex-wrap: wrap;\n    }\n    \n    #content-time {\n        font-size: 12px;\n        color: var(--text-muted);\n    }\n\n    /* 右侧详情中的模型标签、tokens 消耗信息 */\n    #content-model, #content-tokens {\n        display: none;\n        background: var(--bg-model);\n        color: var(--text-muted);\n        font-size: 12px;\n        padding: 3px 6px;\n        border-radius: 15px;\n    }\n    \n    .right-panel-body {\n        flex: 1;\n        /*padding: 15px;*/\n        /*assistant 消息距左边距离*/\n        padding-left: 5px;\n        overflow: hidden;           /* 改为 hidden（原为 overflow-y: hidden） */\n        background: var(--bg-primary);\n        min-height: 0;     /* 关键：让滚动条正确工作 */\n    }\n    \n    #content-body {\n        font-size: 14px;\n        line-height: 1.8;\n        color: var(--text-secondary);\n        white-space: pre-wrap;\n        word-wrap: break-word;\n    }\n    \n    .right-panel-footer {\n        padding: 10px 15px;\n        border-top: 1px solid var(--border-color);\n        background: var(--bg-tertiary);\n        display: flex;\n        gap: 12px;\n        justify-content: space-between;  /* 改为两端对齐 */\n        align-items: center;             /* 垂直居中 */\n        border-radius: 0 0 5px 5px;\n        flex-shrink: 0;    /* 底部工具栏不缩小 */\n    }\n\n    .footer-left {\n        display: flex;\n        align-items: center;\n    }\n    \n    .footer-right {\n        display: flex;\n        gap: 10px;\n    }\n\n    #textbox-search-history {\n        width: 200px;\n        min-width: 200px;\n    }\n\n    .svg-btn {\n        outline: none;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        line-height: 1;\n        vertical-align: middle;\n        box-sizing: border-box;\n    }\n\n    .svg-btn.settings-btn {\n        margin-right: 7px;\n        transition: transform 0.125s ease;\n    }\n\n    .settings-btn:hover {\n        transform: scale(1.1);\n    }\n\n    .filter-btn {\n        padding: 4px 4px;\n        height: 24px;\n        border-radius: 4px;\n        transition: transform 0.125s ease;\n    }\n\n    .filter-btn:hover {\n        background: var(--filter-btn-bg);\n    }\n\n    .filter-btn:not(:hover) {\n        background: \"\";\n    }\n\n    .filter-btn.add-btn:hover {\n        background: var(--add-btn-bg);\n    }\n\n    /* ========== 按钮样式 - 平面化设计 ========== */\n    .action-btn {\n        padding: 0 20px;\n        height: 32px;\n        border: none;\n        border-radius: 3px;\n        background: var(--btn-bg);\n        font-size: 13px;\n        font-weight: 500;\n        color: var(--text-primary);\n        transition: opacity 0.15s ease;\n        outline: none;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        line-height: 1;\n        vertical-align: middle;\n        box-sizing: border-box;\n    }\n    \n    .action-btn:hover {\n        opacity: 0.85;\n    }\n    \n    .action-btn:active {\n        opacity: 0.7;\n    }\n    \n    .action-btn.danger {\n        background: var(--btn-danger-bg);\n        color: white;\n    }\n    \n    .action-btn.primary {\n        background: var(--btn-primary-bg);\n        color: white;\n    }\n    \n    /* ========== 滚动条样式（深色模式优化） ========== */\n    @media (prefers-color-scheme: dark) {\n        #message-list-container::-webkit-scrollbar,\n        .right-panel-body::-webkit-scrollbar {\n            width: 8px;\n        }\n        \n        #message-list-container::-webkit-scrollbar-track,\n        .right-panel-body::-webkit-scrollbar-track {\n            background: var(--bg-secondary);\n        }\n        \n        #message-list-container::-webkit-scrollbar-thumb,\n        .right-panel-body::-webkit-scrollbar-thumb {\n            background: #555;\n            border-radius: 4px;\n        }\n        \n        #message-list-container::-webkit-scrollbar-thumb:hover,\n        .right-panel-body::-webkit-scrollbar-thumb:hover {\n            background: #666;\n        }\n    }\n        ";
    document.documentElement.appendChild(var76);
  },
  'renameChat': async function (param17) {
    let var77 = this.messages.find(_0x1d4729 => _0x1d4729.id === param17);
    try {
      let var78 = var77.title,
        var79 = Zotero.AI4Paper.openDialogByType_modal("renameChat", var78);
      if (!var79 || var79.trim() === var78) return;
      let var80 = var77.fileName,
        var81 = var80.split('⌚️'),
        var82 = var80;
      if (var81.length === 0x2) var82 = Zotero.AI4Paper.sanitizeFilename(var79).trim() + " ⌚️" + var81[0x1];else {
        let var83 = '\x20⌚️\x20' + Zotero.AI4Paper.getDateTime().replace(/:/g, '-');
        var82 = '' + Zotero.AI4Paper.sanitizeFilename(var79).trim() + var83 + '.json';
      }
      let var84 = var77.path,
        var85 = PathUtils.parent(var84);
      if (!(await Zotero.AI4Paper.isPathExists(var84))) throw new Error("当前对话在本地不存在！请刷新列表后重试。");
      let var86 = PathUtils.join(var85, var82);
      if (!(await Zotero.AI4Paper.isPathExists(var86))) {
        await IOUtils.move(var84, var86);
        await this.selectTargetItem(var82);
      } else throw new Error("已有同名文件，请重新命名！");
    } catch (_0x13fd74) {
      window.alert("❌ 【重命名失败】：" + _0x13fd74.message);
    }
  },
  'duplicateChat': async function (param18) {
    if (!param18) {
      param18 = this.currentSelectedId;
      if (!param18) {
        window.alert("请先选择一条消息");
        return;
      }
    }
    let var87 = this.messages.find(_0x195d1b => _0x195d1b.id === param18);
    try {
      let var88 = var87.fileName,
        var89 = "【副本】" + var88,
        var90 = var87.path;
      if (!(await Zotero.AI4Paper.isPathExists(var90))) throw new Error("当前对话在本地不存在！请刷新列表后重试。");
      let var91 = PathUtils.parent(var90),
        var92 = PathUtils.join(var91, var89);
      await IOUtils.copy(var90, var92, {
        'noOverwrite': true
      });
      await this.selectTargetItem(var89);
    } catch (_0x56e6cb) {
      window.alert("❌ 【新增对话副本失败】：" + _0x56e6cb.message);
    }
  },
  async 'importChat'() {
    let var93 = await Zotero.AI4Paper.importChat(true);
    if (var93) {
      await this.refreshMessages(true);
    }
  },
  'addMessages2Chat': async function (param19) {
    let var94 = this.messages.find(_0x124d78 => _0x124d78.id === param19),
      var95 = var94.path,
      var96 = JSON.parse(var94.content),
      var97 = await Zotero.AI4Paper.importChat(false);
    if (var97) {
      let _0x997f95 = [...var96, ...var97],
        _0x1d9f6b = JSON.stringify(_0x997f95, null, 0x2);
      await Zotero.File.putContentsAsync(var95, _0x1d9f6b);
      await this.refreshMessages(true);
      Zotero.AI4Paper.showProgressWindow(0x9c4, "✅ 向对话添加新消息【AI4paper】", "成功向对话添加新消息。");
    }
  },
  'modifyMessage': async function () {
    if (!Zotero.AI4Paper._data_renderChatHistory_modifyMessage) return;
    let {
        newMessageContent: _0x3d4744,
        index: _0x44d086
      } = Zotero.AI4Paper._data_renderChatHistory_modifyMessage,
      var100 = chatHistoryMethods.currentSelectedId,
      var101 = chatHistoryMethods.messages.find(_0x18f38a => _0x18f38a.id === var100),
      var102 = var101.path,
      var103 = JSON.parse(var101.content);
    var103[_0x44d086] && (var103[_0x44d086].content = _0x3d4744);
    await Zotero.File.putContentsAsync(var102, JSON.stringify(var103, null, 0x2));
    await chatHistoryMethods.refreshMessages(true);
    Zotero.AI4Paper.showProgressWindow(0x9c4, "✅ 修改消息【AI4paper】", "成功修改消息。");
  },
  'deleteMessages': async function () {
    if (!Zotero.AI4Paper._data_renderChatHistory_deleteMessages) return;
    let var104 = Zotero.AI4Paper._data_renderChatHistory_deleteMessages,
      var105 = chatHistoryMethods.currentSelectedId,
      var106 = chatHistoryMethods.messages.find(_0x2f8cf7 => _0x2f8cf7.id === var105),
      var107 = var106.path,
      var108 = JSON.parse(var106.content);
    var108.splice(var104 - 0x1, 0x2);
    await Zotero.File.putContentsAsync(var107, JSON.stringify(var108, null, 0x2));
    await chatHistoryMethods.refreshMessages(true);
    Zotero.AI4Paper.showProgressWindow(0x9c4, "✅ 删除消息【AI4paper】", '成功删除当前【用户问题\x20&\x20AI\x20回复】消息组。');
  },
  'selectTargetItem': async function (param20) {
    window._notSelectFirst = true;
    await this.refreshMessages();
    await Zotero.Promise.delay(0x64);
    window._notSelectFirst = false;
    let var109 = this.messages.find(_0x1c20d2 => _0x1c20d2.fileName === param20),
      var110 = var109.id,
      var111 = document.querySelectorAll('.message-list-item');
    var111 = Array.from(var111).filter(_0x959f4a => parseInt(_0x959f4a.getAttribute("data-id")) === var110);
    if (var111.length) return var111[0x0].click(), var111[0x0].scrollIntoView({
      'behavior': "smooth",
      'block': 'center'
    }), var111[0x0];
    return false;
  },
  'buildSearchDropmarker': async function () {
    const var112 = document.getElementById('textbox-search-history');
    this._searchBox = var112;
    var112._searchModes = this._searchModes;
    var112._searchModePopup = null;
    const var113 = this;
    Object.defineProperty(var112, "searchModePopup", {
      'get': function () {
        if (this._searchModePopup) return this._searchModePopup;
        const _0xfa7ee2 = document.createXULElement("menupopup");
        _0xfa7ee2.toggleAttribute("needsgutter", true);
        for (const [_0x12c298, _0x4ac657] of Object.entries(this._searchModes)) {
          const var115 = document.createXULElement("menuitem");
          var115.setAttribute('type', 'radio');
          var115.label = _0x4ac657;
          var115.value = _0x12c298;
          var115.addEventListener("command", () => {
            var113.setMode(_0x12c298);
            this.updateMode();
            if (this.value) {
              this.dispatchEvent(new Event("command"));
            }
          });
          _0xfa7ee2.append(var115);
        }
        return this._searchModePopup = _0xfa7ee2;
      }
    });
    var112.updateMode = function () {
      const var116 = var113.getMode(),
        var117 = this._searchModePopup?.["querySelector"]("menuitem[value=\"" + var116 + '\x22]');
      var117 && var117.setAttribute("checked", "true");
      this.searchTextbox && this.searchTextbox.setAttribute("placeholder", var113._searchModes[var116] || '搜索...');
    };
    const var118 = var112.querySelector("#zotero-tb-search-dropmarker");
    if (var118?.["shadowRoot"]) {
      const var119 = var118.shadowRoot.querySelector('#zotero-tb-search-menu-button');
      if (var119) {
        const var120 = var119.querySelector("menupopup");
        if (var120) var120.remove();
        var119.append(var112.searchModePopup);
      }
    }
    var112.updateMode();
  },
  '_searchBox': null,
  '_searchModes': {
    'title': '标题',
    'content': '内容',
    'all': '标题和内容'
  },
  'PREF_KEY': "ai4paper.gptChatHistorySearchMode",
  'getMode'() {
    const var121 = Zotero.Prefs.get(this.PREF_KEY);
    if (!var121 || !this._searchModes[var121]) {
      return Object.keys(this._searchModes)[0x2];
    }
    return var121;
  },
  'setMode'(_0x18d6a9) {
    Zotero.Prefs.set(this.PREF_KEY, _0x18d6a9);
  },
  'handleSearchKeypress'(_0x1b4507, _0x1a7f92) {
    _0x1a7f92.keyCode == _0x1a7f92.DOM_VK_RETURN && this.search();
  },
  'searchBoxBlur'() {
    try {
      const _0x19afac = this._searchBox;
      if (_0x19afac) _0x19afac.searchTextbox.blur();
    } catch (_0x306d65) {
      Zotero.debug(_0x306d65);
    }
  },
  'searchBoxFocus'() {
    try {
      const _0xc3235d = this._searchBox;
      if (_0xc3235d) _0xc3235d.searchTextbox.focus();
    } catch (_0x381be4) {
      Zotero.debug(_0x381be4);
    }
  },
  'search'() {
    const var124 = this._searchBox;
    var var125 = var124.searchTextbox.value.toLowerCase();
    if (!var125.trim()) return;
    let var126 = this.getMessagesByFilter();
    const var127 = this.getMode();
    if (var127 === "title") {
      var126 = var126.filter(_0x292612 => _0x292612.title.toLowerCase().includes(var125));
      this.displayResultsByType(var126, "search");
    } else var127 === "content" ? (var126 = var126.filter(_0x913918 => _0x913918.content.toLowerCase().includes(var125)), this.displayResultsByType(var126, "search")) : (var126 = var126.filter(_0x3b62b4 => _0x3b62b4.title.toLowerCase().includes(var125) || _0x3b62b4.content.toLowerCase().includes(var125)), this.displayResultsByType(var126, "search"));
  },
  'searchAIReadingItems'() {
    this.setMode('title');
    this._searchBox.searchTextbox.value = '🤖';
    this.search();
  },
  'displayResultsByType'(_0x4d5ad2, _0x3cb33f) {
    this.currentSelectedId = null;
    this.renderMessageList(_0x4d5ad2, _0x3cb33f);
    if (_0x4d5ad2.length > 0x0) this.selectMessage(_0x4d5ad2, _0x4d5ad2[0x0].id, _0x3cb33f);else {
      this.clear();
    }
  },
  'showResultMessage': function (param21, param22) {
    let var128 = document.getElementById("messagesNum-label");
    if (!param22) {
      var128.textContent = "对话历史列表（共 " + param21.length + '\x20条）';
    } else {
      if (param22 === 'filter') {
        let var129 = this._filterModes[this.getMode_filter()];
        var128.textContent = var129 + "：共 " + param21.length + '\x20条';
      } else {
        if (param22 === 'search') {
          let _0x9bdb65 = this._searchModes[this.getMode()];
          var128.textContent = '【' + _0x9bdb65 + "】搜索：共 " + param21.length + '\x20条';
        }
      }
    }
  },
  'showResultMessage_selectedItem': function (param23, param24, param25) {
    let var131 = document.getElementById("messagesNum-label");
    if (!param25) {
      var131.textContent = "对话历史列表（" + param24 + '/' + param23.length + '）';
    } else {
      if (param25 === 'filter') {
        const _0x1ffff2 = param23.findIndex(_0x3cc090 => _0x3cc090.id === param24);
        let _0x333b42 = this._filterModes[this.getMode_filter()];
        var131.textContent = _0x333b42 + '：' + (_0x1ffff2 + 0x1) + '/' + param23.length;
      } else {
        if (param25 === "search") {
          const _0x39e54d = param23.findIndex(_0x1be298 => _0x1be298.id === param24);
          let _0x3fda88 = this._searchModes[this.getMode()];
          var131.textContent = '【' + _0x3fda88 + '】搜索：' + (_0x39e54d + 0x1) + '/' + param23.length;
        }
      }
    }
  },
  '_filterModes': {
    'filter': '全部',
    'today': '今天',
    'day': "过去一天",
    'week': "过去一周",
    'month': "过去一个月",
    'half_year': '过去半年',
    'year': "过去一年"
  },
  'PREF_KEY_FILTER': "ai4paper.gptChatHistoryFilterMode",
  'getMode_filter'() {
    const var136 = Zotero.Prefs.get(this.PREF_KEY_FILTER);
    if (!var136 || !this._filterModes[var136]) {
      return Object.keys(this._filterModes)[0x0];
    }
    return var136;
  },
  'setMode_filter'(_0x22dbce, _0x2568c9) {
    Zotero.Prefs.set(this.PREF_KEY_FILTER, _0x22dbce);
    let var137 = document.getElementById("filter-button");
    var137.src = "chrome://ai4paper/content/icons/" + _0x22dbce + '.png';
    if (!_0x2568c9) {
      let var138 = this.getMessagesByFilter();
      this.displayResultsByType(var138, "filter");
    }
  },
  'onClickFilterBtn'(_0x16c620, _0xd073ed) {
    if (_0xd073ed.shiftKey) {
      this.searchAIReadingItems();
      return;
    }
    if (_0xd073ed.button === 0x2) {
      this.searchAIReadingItems();
      return;
    }
    let var139 = this.buildContextMenu_filter(false);
    var139 && var139.openPopup(_0x16c620, "after_start", 0x0, 0x0, false, false);
  },
  'getMessagesByFilter'() {
    let var140 = this.getMode_filter(),
      var141 = this.messages;
    if (var140 != "filter") {
      let var142 = {
        'today': 0x0,
        'day': 0x1,
        'week': 0x7,
        'month': 0x1e,
        'half_year': 0xb7,
        'year': 0x16d
      };
      var141 = this.messages.filter(_0x10cb0c => {
        let var143 = Zotero.AI4Paper.getBeforeDate(var142[var140]),
          var144 = _0x10cb0c.time.split('\x20'),
          var145 = var144[0x0].replace(/-/g, '/');
        if (Zotero.AI4Paper.dateDiff(var145, var143)) {
          return true;
        } else return false;
      });
    }
    return var141;
  },
  'buildContextMenu': function (param26, param27) {
    let var146 = document.querySelector("#chatHistory-contextmenu");
    if (!var146) {
      var146 = window.document.createXULElement("menupopup");
      var146.id = "chatHistory-contextmenu";
      document.documentElement.appendChild(var146);
      var146 = document.documentElement.lastElementChild.firstElementChild;
      if (param27) return;
    }
    let var147 = var146.firstElementChild;
    while (var147) {
      var147.remove();
      var147 = var146.firstElementChild;
    }
    let var148 = parseInt(param26.target.closest(".message-list-item").getAttribute("data-id"));
    const var149 = [{
      'label': "重命名",
      'action': () => this.renameChat(var148),
      'separator': true
    }, {
      'label': "新增对话副本",
      'action': () => this.duplicateChat(var148),
      'separator': true
    }, {
      'label': "向对话添加新消息",
      'action': () => this.addMessages2Chat(var148),
      'separator': true
    }, {
      'label': "拷贝标题",
      'action': () => {
        const var150 = this.messages.find(_0x18dfe3 => _0x18dfe3.id === var148);
        Zotero.AI4Paper.copy2Clipboard(var150?.["title"]);
        Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 拷贝标题【AI4paper】", "已拷贝标题 👉 " + var150?.["title"] + '\x20👈。');
      },
      'separator': true
    }, {
      'label': "在本地显示",
      'action': () => {
        const var151 = this.messages.find(_0x26df42 => _0x26df42.id === var148);
        Zotero.AI4Paper.revealPath(var151.path);
      },
      'separator': true
    }, {
      'label': '删除',
      'action': () => this.deleteMessage(),
      'separator': false
    }];
    return var149.forEach(_0x3dc674 => {
      const var152 = document.createXULElement("menuitem");
      var152.setAttribute("label", _0x3dc674.label);
      var152.addEventListener("command", _0x3dc674.action);
      var146.appendChild(var152);
      if (_0x3dc674.separator) {
        var146.appendChild(document.createXULElement("menuseparator"));
      }
    }), var146;
  },
  'buildContextMenu_filter': function (param28) {
    let var153 = document.querySelector("#filterButton-contextmenu");
    if (!var153) {
      var153 = window.document.createXULElement("menupopup");
      var153.id = "filterButton-contextmenu";
      document.documentElement.appendChild(var153);
      var153 = document.documentElement.lastElementChild.firstElementChild;
      if (param28) return;
    }
    let var154 = var153.firstElementChild;
    while (var154) {
      var154.remove();
      var154 = var153.firstElementChild;
    }
    const var155 = _0x2e1917 => {
        let var156 = window.document.createXULElement('menuitem');
        return var156.label = this._filterModes[_0x2e1917], var156.value = _0x2e1917, var156.addEventListener("command", () => {
          this.setMode_filter(_0x2e1917);
        }), _0x2e1917 === this.getMode_filter() && var156.setAttribute("checked", "true"), var156;
      },
      var157 = Object.keys(this._filterModes);
    return var157.forEach((_0x13de77, _0xd034cc) => {
      var153.appendChild(var155(_0x13de77));
      _0xd034cc < var157.length - 0x1 && var153.appendChild(document.createXULElement("menuseparator"));
    }), var153;
  },
  'buildContextMenu_messageBtn_SaveMessages': function (param29) {
    let var158 = "messageBtn_SaveMessages-contextmenu",
      var159 = document.querySelector('#' + var158);
    if (!var159) {
      var159 = window.document.createXULElement("menupopup");
      var159.id = var158;
      document.documentElement.appendChild(var159);
      var159 = document.documentElement.lastElementChild.firstElementChild;
      if (param29) return;
    }
    let var160 = var159.firstElementChild;
    while (var160) {
      var160.remove();
      var160 = var159.firstElementChild;
    }
    let var161 = document.getElementById("renderChatHistory-iframe").contentWindow;
    const var162 = [{
      'label': "导出至选定分类（.md）",
      'children': [{
        'label': "当前消息",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD(var161, "currentMessage", Zotero.AI4Paper._data_renderChatHistory_quickBtn_clickEvent, chatHistoryMethods);
        }
      }, {
        'label': "全部 AI 回复",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD(var161, 'assistantMessages', null, chatHistoryMethods);
        }
      }, {
        'label': '全部消息',
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD(var161, 'allMessages', null, chatHistoryMethods);
        }
      }],
      'separator': true
    }, {
      'label': "导出至我的文库（.md）",
      'children': [{
        'label': "当前消息",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD(var161, "currentMessage", Zotero.AI4Paper._data_renderChatHistory_quickBtn_clickEvent, chatHistoryMethods);
        }
      }, {
        'label': "全部 AI 回复",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD(var161, 'assistantMessages', null, chatHistoryMethods);
        }
      }, {
        'label': "全部消息",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD(var161, "allMessages", null, chatHistoryMethods);
        }
      }],
      'separator': true
    }, {
      'label': "导出至预设路径（.md）",
      'children': [{
        'label': '当前消息',
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD(var161, 'currentMessage', Zotero.AI4Paper._data_renderChatHistory_quickBtn_clickEvent, chatHistoryMethods);
        }
      }, {
        'label': "全部 AI 回复",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD(var161, "assistantMessages", null, chatHistoryMethods);
        }
      }, {
        'label': '全部消息',
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD(var161, "allMessages", null, chatHistoryMethods);
        }
      }],
      'separator': true
    }, {
      'label': "导出至本地（.md）",
      'children': [{
        'label': '当前消息',
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD(var161, "currentMessage", Zotero.AI4Paper._data_renderChatHistory_quickBtn_clickEvent, chatHistoryMethods);
        }
      }, {
        'label': "全部 AI 回复",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD(var161, "assistantMessages", null, chatHistoryMethods);
        }
      }, {
        'label': "全部消息",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD(var161, "allMessages", null, chatHistoryMethods);
        }
      }],
      'separator': true
    }, {
      'label': '绑定至选定文献（.md）',
      'children': [{
        'label': '当前消息',
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD(var161, "currentMessage", Zotero.AI4Paper._data_renderChatHistory_quickBtn_clickEvent, chatHistoryMethods);
        }
      }, {
        'label': "全部 AI 回复",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD(var161, 'assistantMessages', null, chatHistoryMethods);
        }
      }, {
        'label': "全部消息",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD(var161, 'allMessages', null, chatHistoryMethods);
        }
      }]
    }, {
      'label': "绑定至打开文献（.md）",
      'children': [{
        'label': '当前消息',
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD(var161, "currentMessage", Zotero.AI4Paper._data_renderChatHistory_quickBtn_clickEvent, chatHistoryMethods);
        }
      }, {
        'label': '全部\x20AI\x20回复',
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD(var161, "assistantMessages", null, chatHistoryMethods);
        }
      }, {
        'label': "全部消息",
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD(var161, "allMessages", null, chatHistoryMethods);
        }
      }]
    }];
    return Zotero.AI4Paper.createMenuitem_universal(window, var159, var162), var159;
  }
};