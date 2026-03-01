// AI4Paper Theme Module - Dark/light mode, color scheme, and style injection
Object.assign(Zotero.AI4Paper, {
  'changeZoteroDarkANDLightMode': async function () {
    let isDark = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")["matches"];
    isDark ? Zotero.Prefs.set("browser.theme.toolbar-theme", 0x1, true) : Zotero.Prefs.set("browser.theme.toolbar-theme", 0x0, true);
    await Zotero.Promise.delay(0xa);
    Zotero.AI4Paper.updateZoteroColorSchemeButtonState();
  },
  'updateZoteroColorSchemeButtonState': function () {
    let button = window.document.querySelector("#zotero-if-items-toolbar-button-zoteroColorScheme"),
      isDark = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")["matches"];
    button && (button.innerHTML = isDark ? Zotero.AI4Paper.svg_icon_20px.zoteroColorSchemeToolBarButton_dark : Zotero.AI4Paper.svg_icon_20px.zoteroColorSchemeToolBarButton);
    try {
      Zotero.AI4Paper.updateSlogan4ChatUI();
      Zotero.AI4Paper.updatePopupButtonBgColor();
      Zotero.AI4Paper.updateButtonColor_CollapseCollections();
      Zotero.AI4Paper.updateTextAreaBox4ZoteroScheme_init();
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'updatePopupButtonBgColor': function () {
    let isDark = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")["matches"],
      hoverColor = !isDark ? "#fffef2" : "#545454",
      tabs = Zotero.getMainWindow().Zotero_Tabs._tabs;
    for (let tab of tabs) {
      if (tab.id != "zotero-pane") {
        let tabID = tab.id,
          reader = Zotero.Reader.getByTabID(tabID);
        if (!reader) continue;
        let popup = reader._iframeWindow.document.querySelector(".selection-popup");
        popup && popup.querySelectorAll(".ai4paper-popup-button").forEach(btn => {
          btn.onmouseover = e => btn.style.backgroundColor = hoverColor;
        });
      }
    }
  },
  'updateTextAreaBox4ZoteroScheme_init': function () {
    try {
      var windows = Zotero.AI4Paper.getWindowsContainingWindowType("zoteroone");
      windows.forEach(win => {
        Zotero.AI4Paper.updateTextAreaBox4ZoteroScheme(win);
      });
    } catch (e) {
      Zotero.debug(e);
    }
    try {
      let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      iframeWin && Zotero.AI4Paper.updateHTMLTextAreaBorder4ZoteroScheme(iframeWin);
      iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('translate');
      iframeWin && Zotero.AI4Paper.updateHTMLTextAreaBorder4ZoteroScheme(iframeWin);
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'updateTextAreaBox4ZoteroScheme': function (win) {
    try {
      if (Zotero.AI4Paper.isZoteroVersion()) {
        let isDark = Zotero.getMainWindow()?.['matchMedia']('(prefers-color-scheme:\x20dark)')['matches'];
        if (!isDark) win.document.querySelectorAll(".textarea-box").forEach(el => el.style.border = "1px solid #dadada");else {
          win.document.querySelectorAll(".textarea-box").forEach(el => el.style.border = "1px solid #404040");
        }
      }
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'updateHTMLTextAreaBorder4ZoteroScheme': function (win) {
    try {
      if (Zotero.AI4Paper.isZoteroVersion()) {
        let isDark = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")["matches"];
        if (!isDark) {
          win.document.querySelectorAll(".htmlTextArea").forEach(el => el.style.backgroundColor = '#ffffff');
          win.document.querySelectorAll(".htmlTextArea").forEach(el => el.style.border = "1px solid #dadada");
        } else {
          win.document.querySelectorAll(".htmlTextArea").forEach(el => el.style.backgroundColor = "#3b3b3b");
          win.document.querySelectorAll(".htmlTextArea").forEach(el => el.style.border = 0x0);
        }
      }
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'getWindowsContainingWindowType': function (windowType) {
    var mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator),
      windows = [],
      enumerator = mediator.getEnumerator(null);
    while (enumerator.hasMoreElements()) {
      var win = enumerator.getNext();
      try {
        win.document.documentElement.getAttribute("windowtype").includes(windowType) && windows.push(win);
      } catch (e) {
        Zotero.debug("Error accessing windowtype for window:", win, e);
      }
    }
    return windows;
  },
  'updateButtonColor_CollapseCollections': function (button) {
    if (!button) {
      var button = window.document.querySelector('#zotero-if-collections-toolbar-button-collapseCollections');
    }
    if (!button) return;
    let isDark = Zotero.getMainWindow()?.["matchMedia"]('(prefers-color-scheme:\x20dark)')['matches'];
    button.innerHTML = !isDark ? Zotero.AI4Paper.svg_icon_20px.collapseCollectionsCollectionsToolBarButton : Zotero.AI4Paper.svg_icon_20px.collapseCollectionsCollectionsToolBarButton_dark;
  },
  'updateSlogan4ChatUI': function (iframeWin) {
    if (!iframeWin) {
      if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane") || !Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
        return false;
      }
      iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    }
    if (!iframeWin) return false;
    const isDark = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")['matches'],
      logoSrc = isDark ? "chrome://ai4paper/content/icons/logo.png" : 'chrome://ai4paper/content/icons/logo.png',
      logoEl = iframeWin.document.querySelector(".openaiLogo");
    if (logoEl) {
      logoEl.src = logoSrc;
      const logoSize = window.screen.height >= 0x3e8 ? 0x140 : 0x118;
      logoEl.style.width = logoSize + 'px';
      logoEl.style.height = logoSize + 'px';
    }
  },
  'gptReaderSidePane_injectStyle': function (iframeWin) {
    if (!iframeWin) {
      if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane") || !Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) return false;
      iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    }
    if (!iframeWin) return false;
    const darkThemeColors = {
        '默认': '#1e1e1e',
        '深黑': "#000000",
        '漆黑': '#161823',
        '乌黑': "#392f41",
        '藏青': "#2e4e7e",
        '花青': "#003472",
        '元青': "#3e3c3d",
        '玫瑰红': "#973444",
        '月季红': '#bb1c33',
        '番茄红': "#c4473d",
        '灯草灰': "#363532",
        '相思灰': "#625c52"
      },
      darkBgColor = darkThemeColors[Zotero.Prefs.get('ai4paper.gptSidePaneDarkModeTheme')] || "#1e1e1e",
      styleEl = iframeWin.document.getElementById("chatUIStyle");
    if (styleEl) {
      styleEl.innerHTML = Zotero.AI4Paper.getChatUIStyle_light() + Zotero.AI4Paper.getChatUIStyle_dark(darkBgColor);
    }
  },
  'getChatUIStyle_light': function () {
    return "\n        .markdown-body {\n            box-sizing: border-box;\n            min-width: 200px;\n            max-width: 980px;\n            margin: 0 auto;\n            padding: 5px;\n            background-color: inherit;\n        }\n        @media (max-width: 767px) {\n            .markdown-body {\n                padding: 5px;\n            }\n        }\n        body {\n            font-family: Arial, sans-serif;\n            margin: 0;\n            padding: 0;\n            background: #f4f4f4;\n            align-items: center;\n            height: 100vh;\n            justify-content: center;\n        }\n        #chat-container {\n            width: 100%;\n            height: 700px;\n            position: relative;\n            background: white;\n            border: 1px solid #ddd;\n            overflow-y: auto;\n            padding: 10px;\n            box-sizing: border-box;\n        }\n\n        /* =========================================\n        [核心区域] 底部浮动按钮及动态边框样式\n        ========================================= */\n\n        #scroll-to-bottom-btn {\n            position: absolute;\n            bottom: 40px; left: 50%;\n            transform: translateX(-50%);\n            width: 35px; height: 35px;\n            background-color: #fff;\n            border: 1px solid #e0e0e0;\n            border-radius: 50%;\n            box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n            cursor: pointer;\n            display: none;\n            align-items: center; justify-content: center;\n            z-index: 100;\n            transition: all 0.2s ease;\n        }\n        #scroll-to-bottom-btn svg {\n            fill: #999;\n            width: 24px; height: 24px;\n            transition: fill 0.2s ease;\n            z-index: 2; position: relative;\n        }\n        #scroll-to-bottom-btn:hover {\n            background-color: #fafafa;\n            box-shadow: 0 6px 16px rgba(0,0,0,0.15);\n            border-color: #d0d0d0;\n        }\n        #scroll-to-bottom-btn:hover svg {\n            fill: #666;\n        }\n\n        #scroll-to-bottom-btn.is-streaming {\n            border-color: transparent;\n        }\n        #scroll-to-bottom-btn.is-streaming svg {\n            fill: #61a5f2;\n        }\n        #scroll-to-bottom-btn.is-streaming::before {\n            content: \"\";\n            position: absolute;\n            top: -1px; left: -1px; right: -1px; bottom: -1px;\n            border-radius: 50%;\n            border: 1px solid rgba(74, 144, 226, 0.2);\n            border-top-color: #61a5f2;\n            border-right-color: #61a5f2;\n            animation: spin-border 0.8s linear infinite;\n            z-index: 1;\n        }\n        @keyframes spin-border {\n            from { transform: rotate(0deg); }\n            to { transform: rotate(360deg); }\n        }\n\n        .message {\n            max-width: 600px;\n            padding: 10px;\n            border-radius: 10px;\n            clear: both;\n            line-height: 1.4;\n            word-wrap: break-word;\n        }\n        .username {\n            font-weight: bold;\n            margin-right: 10px;\n        }\n        .content {\n            overflow: auto;\n            clear: both;\n            margin-top: 4px;\n            -ms-word-break: break-all;\n            word-break: break-all;\n            -ms-hyphens: auto;\n            -moz-hyphens: auto;\n            -webkit-hyphens: auto;\n            hyphens: auto;\n        }\n        .content.assistant {\n            margin-left: 20px;\n        }\n        .content.user {\n            margin-right: 20px;\n            text-align: right;\n        }\n        .message.assistant {\n            float: left;\n            background-color: #f3f3f3;\n            text-align: left;\n            width: fit-content;\n        }\n        .message.assistant:has(table) {\n            max-width: min(90vw, 900px);\n            overflow-x: auto;\n        }\n        .message.assistant table {\n            min-width: max-content;\n        }\n        .message.user {\n            float: right;\n            background-color: #edffed;\n            text-align: right;\n        }\n        .message-container {\n            display: flex;\n            flex-direction: column;\n            width: 100%;\n            margin-bottom: 15px;\n        }\n        .message-container.user {\n            align-items: flex-end;\n        }\n        .message-container.assistant {\n            align-items: flex-start;\n        }\n        .message-buttons {\n            display: flex;\n            justify-content: center;\n            padding-top: 5px;\n        }\n        .button {\n            width: 16px;\n            height: 16px;\n            vertical-align: middle;\n            transition: transform 0.3s ease;\n        }\n        .button.assistant {\n            margin-left: 12px;\n        }\n        .button.user {\n            margin-right: 12px;\n        }\n        .button:hover {\n            transform: scale(1.1);\n        }\n        .checkbox {\n            width: 20px;\n            height: 20px;\n            border-radius: 50%;\n            vertical-align: middle;\n        }\n        .avatar {\n            width: 20px;\n            height: 20px;\n            border-radius: 50%;\n            vertical-align: middle;\n        }\n        .message-row {\n            display: flex;\n            align-items: center;\n            margin-bottom: 4px;\n        }\n        .message-row.user {\n            justify-content: flex-end;\n        }\n        .pdf-card {\n            display: flex;\n            align-items: center;\n            background-color: #f3f3f3;\n            border-radius: 10px;\n            padding: 15px;\n            margin: 10px;\n            width: 250px;\n        }\n        .pdf-icon {\n            width: 30px;\n            height: 30px;\n            background-image: url('chrome://ai4paper/content/icons/reader_20px.svg');\n            background-size: cover;\n            margin-right: 15px;\n            flex-shrink: 0;\n        }\n        .file-info {\n            display: flex;\n            flex-direction: column;\n            flex-grow: 1;\n            min-width: 0;\n        }\n        .file-name {\n            font-size: 15px;\n            font-weight: bold;\n            color: #333;\n            white-space: nowrap;\n            overflow: hidden;\n            text-overflow: ellipsis;\n            text-align: left;\n        }\n        .file-size {\n            align-self: flex-start;\n            margin-top: 4px;\n            font-size: 12px;\n            color: #666;\n        }\n        .openaiLogoContainer {\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            user-select: none;\n            height: 100%;\n        }\n        .openaiLogo {\n            width: 320px;\n            height: 320px;\n        }\n        #context-menu {\n            display: none;\n            position: absolute;\n            z-index: 999;\n            background: #dddce1;\n            box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);\n            border-radius: 8px;\n            padding: 0px;\n            margin: 0;\n        }\n        #context-menu ul {\n            list-style: none;\n            margin: 0;\n            padding: 0;\n            border-radius: 8px;\n            overflow: hidden;\n        }\n        #context-menu ul li {\n            font-size: 13px;\n            padding: 5px 8px;\n            cursor: pointer;\n            border-bottom: 1px solid #d3d3d3;\n            white-space: nowrap;\n        }\n        #context-menu ul li:hover {\n            background-color: #7eb6fd;\n        }\n        #context-menu ul li:last-child {\n            border-bottom: none;\n        }\n        .quickButton {\n            width: 20px;\n            height: 20px;\n            position: absolute;\n            bottom: 7px;\n            padding: 4px 4px;\n            border-radius: 6px;\n        }\n        .quickButton svg {\n            pointer-events: none;\n        }\n        @keyframes spin {\n            0% { transform: rotate(0deg); }\n            100% { transform: rotate(360deg); }\n        }\n\n        /* --- 用户消息折叠功能 CSS --- */\n        " + Zotero.AI4Paper.gptReaderSidePane_addCSS4ExpandArrow() + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
  },
  'getChatUIStyle_dark': function (darkBgColor) {
    return "\n        /* ===================================================\n        深色模式覆盖\n        =================================================== */\n        @media (prefers-color-scheme: dark) {\n\n            /* 页面背景 */\n            body {\n                background: none;\n            }\n\n            /* 聊天容器 */\n            #chat-container {\n                background: none;\n                border: none;\n                padding-left: 0;\n                padding-right: 10px;\n            }\n\n            /* 悬浮滚动按钮 */\n            #scroll-to-bottom-btn {\n                background-color: #5c5a5a;\n                border-color: #c9c9c9;\n            }\n            #scroll-to-bottom-btn:hover {\n                background-color: #787575;\n            }\n            #scroll-to-bottom-btn:hover svg {\n                fill: #595959;\n            }\n\n            /* 消息气泡 */\n            .message.assistant {\n                background-color: " + darkBgColor + ";\n            }\n            .message.user {\n                background-color: #474646;\n            }\n\n            /* PDF 附件卡片 */\n            .pdf-card {\n                background-color: #3b3a3a;\n            }\n            .file-name {\n                color: #eaeaea;\n            }\n            .file-size {\n                color: #bbbbbb;\n            }\n\n            /* 右键菜单 */\n            #context-menu {\n                background: #2a2830;\n            }\n            #context-menu ul li {\n                border-bottom: none;\n            }\n            #context-menu ul li:hover {\n                background-color: #0d72eb;\n            }\n        }\n        ";
  },
  'gptNotesList_JS_injectStyle': function (iframeWin) {
    const darkThemeColors = {
        '默认': "#3e3c3d",
        '深黑': "#000000",
        '漆黑': '#161823',
        '乌黑': "#392f41",
        '藏青': "#2e4e7e",
        '花青': "#003472",
        '元青': "#3e3c3d",
        '玫瑰红': '#973444',
        '月季红': "#bb1c33",
        '番茄红': "#c4473d",
        '灯草灰': "#363532",
        '相思灰': "#625c52"
      },
      darkBgColor = darkThemeColors[Zotero.Prefs.get("ai4paper.gptSidePaneDarkModeTheme")] || "#3e3c3d",
      styleEl = iframeWin.document.getElementById("chatUIStyle");
    styleEl && (styleEl.innerHTML = Zotero.AI4Paper.gptNotesList_JS_getChatUIStyle_light() + Zotero.AI4Paper.gptNotesList_JS_getChatUIStyle_dark(darkBgColor));
  },
  'gptNotesList_JS_getChatUIStyle_light': function () {
    return "\n        .markdown-body {\n            box-sizing: border-box;\n            min-width: 200px;\n            max-width: 980px;\n            margin: 0 auto;\n            padding: 5px;\n            background-color: inherit;\n        }\n        @media (max-width: 767px) {\n            .markdown-body {\n                padding: 5px;\n            }\n        }\n        body {\n            font-family: Arial, sans-serif;\n            margin: 0;\n            padding: 0;\n            background: #f4f4f4;\n            align-items: center;\n            height: 100vh;\n            justify-content: center;\n        }\n        #chat-container {\n            width: 100%;\n            height: 400px;\n            background: white;\n            border: 1px solid #ddd;\n            overflow-y: auto;\n            padding: 10px;\n            box-sizing: border-box;\n        }\n        .message {\n            max-width: 600px;\n            padding: 10px;\n            border-radius: 10px;\n            margin-bottom: 10px;\n            clear: both;\n            line-height: 1.4;\n            word-wrap: break-word;\n        }\n        .username {\n            font-weight: bold;\n            font-size: 13px;\n            margin-right: 10px;\n        }\n        .content {\n            overflow: auto;\n            font-size: 13px;\n            clear: both;\n            margin-top: 4px;\n            -ms-word-break: break-all;\n            word-break: break-all;\n            -ms-hyphens: auto;\n            -moz-hyphens: auto;\n            -webkit-hyphens: auto;\n            hyphens: auto;\n        }\n        .content.assistant {\n            margin-left: 20px;\n        }\n        .content.user {\n            margin-right: 20px;\n            text-align: right;\n        }\n        .message.assistant {\n            float: left;\n            background-color: #f3f3f3;\n            text-align: left;\n            width: fit-content;\n        }\n        .message.assistant:has(table) {\n            max-width: min(90vw, 900px);\n            overflow-x: auto;\n        }\n        .message.assistant table {\n            min-width: max-content;\n        }\n        .message.user {\n            float: right;\n            background-color: #edffed;\n            text-align: right;\n        }\n        .checkbox {\n            width: 20px;\n            height: 20px;\n            border-radius: 50%;\n            vertical-align: middle;\n        }\n        .edit {\n            width: 20px;\n            height: 20px;\n            border-radius: 50%;\n            vertical-align: middle;\n        }\n        .avatar {\n            width: 20px;\n            height: 20px;\n            border-radius: 50%;\n            vertical-align: middle;\n        }\n        .message-row {\n            display: flex;\n            align-items: center;\n            margin-bottom: 4px;\n        }\n        .message-row.user {\n            justify-content: flex-end;\n        }\n        .openaiLogoContainer {\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            height: 100%;\n        }\n        .openaiLogo {\n            animation: spin 2s linear infinite;\n            width: 60px;\n            height: 60px;\n        }\n        .quickButton {\n            width: 20px;\n            height: 20px;\n            position: absolute;\n            bottom: 7px;\n            padding: 4px 4px;\n            border-radius: 6px;\n        }\n        .quickButton svg {\n            pointer-events: none;\n        }\n        @keyframes spin {\n            0% { transform: rotate(0deg); }\n            100% { transform: rotate(360deg); }\n        }\n        ";
  },
  'gptNotesList_JS_getChatUIStyle_dark': function (darkBgColor) {
    return "\n        /* ===================================================\n        深色模式覆盖\n        =================================================== */\n        @media (prefers-color-scheme: dark) {\n\n            /* 页面背景 */\n            body {\n                background: none;\n            }\n\n            /* 聊天容器 */\n            #chat-container {\n                background: none;\n                border: none;\n                padding-left: 0;\n                padding-right: 10px;\n            }\n\n            /* 消息气泡 */\n            .message.assistant {\n                background-color: " + darkBgColor + ";\n            }\n            .message.user {\n                background-color: #474646;\n            }\n        }\n        ";
  },
  'updateChatUI4HighlightStyle': function (iframeWin) {
    if (!iframeWin) {
      if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane") || !Zotero.Prefs.get('ai4paper.gptContinuesChatMode')) return false;
      iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    }
    if (!iframeWin) return false;
    let highlightStyle = Zotero.Prefs.get("ai4paper.gptSidePaneHighlightStyle") || "github";
    const styleEl = iframeWin.document.getElementById("highlightStyle");
    styleEl && (styleEl.href = 'chrome://ai4paper/content/assets/css/highlight/' + highlightStyle + ".min.css");
  },
  'setOptions4marked': function () {
    marked && marked.setOptions({
      'renderer': new marked.Renderer(),
      'gfm': true,
      'tables': true,
      'escaped': true,
      'breaks': false,
      'pedantic': false,
      'sanitize': false,
      'smartLists': true,
      'smartypants': false,
      'highlight': function (code, lang) {
        return hljs.highlightAuto(code).value;
      }
    });
  },
  'changeEventListner_ZoteroColorScheme': function (action) {
    if (action === "add" && !Zotero.AI4Paper._EventListnerObject_isDarkMQL) {
      Zotero.AI4Paper._changeHandler_ZoteroColorScheme = async function (event) {
        await Zotero.Promise.delay(0xa);
        Zotero.AI4Paper.updateZoteroColorSchemeButtonState();
      };
      const darkMql = Zotero.getMainWindow()?.["matchMedia"]('(prefers-color-scheme:\x20dark)');
      Zotero.AI4Paper._EventListnerObject_isDarkMQL = darkMql;
      darkMql.addEventListener('change', Zotero.AI4Paper._changeHandler_ZoteroColorScheme);
    } else action === "remove" && Zotero.AI4Paper._EventListnerObject_isDarkMQL?.["removeEventListener"]("change", Zotero.AI4Paper._changeHandler_ZoteroColorScheme);
  },
});
