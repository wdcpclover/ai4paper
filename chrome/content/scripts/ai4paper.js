Zotero.AI4Paper = {
  'id': null,
  'version': null,
  'rootURI': null,
  'initialized': false,
  'window': null,
  '_notifierID': null,
  'unreadTag': "/unread",
  'readingTag': '/reading',
  'doneTag': '/Done',
  '_aiMsgExportTag': '/AI消息导出',
  '_aiReadingNoteTag': '/AI文献解读',
  '_store_added_tagMenu_elements': [],
  'init': function ({
    id: addonId,
    version: addonVersion,
    rootURI: addonRootURI
  }) {
    if (this.initialized) return;
    this.id = addonId;
    this.version = addonVersion;
    this.rootURI = addonRootURI;
    this.initialized = true;
    this.window = this.getGlobal("window");
    this._notifierID = Zotero.Notifier.registerObserver(this.notifyCallback, ["item", "tab", "item-tag", "file", 'collection']);
    Zotero.AI4Paper.injectScripts(true);
    this.initParam();
    this.setPrefs();
    this.setGlobalParam();
    window.addEventListener("unload", function (unloadEvent) {
      Zotero.Notifier.unregisterObserver(this._notifierID);
    }, false);
    window.addEventListener("pointerup", Zotero.AI4Paper.handlePointerup);
    Zotero.AI4Paper.MenuPopup.init();
    this.addUIEvent();
    this.updateSciHub();
    this.registerShortcuts();
    this.registerCollectionsToolBarButtons(this.collectionsToolbar_buttons);
    this.registerItemsToolBarButtons(this.itemsToolbar_buttons);
    this.registerTagMenu();
    this.registerTagSelectorViewMenu();
    this.readerMenuItemClickEvent("add");
    this.changeEventListner_ZoteroColorScheme("add");
    this.registerMenuToReaderMenu();
    this.addEventListener_itemViewPinButton();
    this.customItemTreeColumns();
    this.initItemTreeBadgeHooks();
    this.scheduleItemTreeBadgesRender();
    this.addReaderElementsOnStartup();
  },
  'initParam': function () {
    Zotero.Prefs.set("ai4paper.selectedtexttrans", '');
    Zotero.AI4Paper.ChatGPTWindow = null;
    Zotero.AI4Paper.translateSourceText = '';
    Zotero.AI4Paper.translateResponse = '';
    Zotero.AI4Paper.vocabularyreviewmode = "false";
    Zotero.AI4Paper.vocabularyzoterolink = '';
    Zotero.AI4Paper.lastcardnotestaginput = '';
    Zotero.AI4Paper.lasttaginput = '';
    Zotero.AI4Paper.lastTagsSelectPane = "annotationTagsPane";
    Zotero.AI4Paper.lastTagsCardNotePane = "annotationTagsPane";
    Zotero.AI4Paper.lastGPTNoteTagsPane = "gptNoteTagsPane";
    Zotero.AI4Paper.lastTagsCardNoteView = "GeneralView";
    Zotero.AI4Paper.lastFilesHistoryPane = "allPane";
    Zotero.AI4Paper.lastRefsSearchInput = '';
    Zotero.AI4Paper.lastCitingSearchInput = '';
    Zotero.AI4Paper.lastCardNotesSearchInput = '';
    Zotero.AI4Paper.defaultHeadLevel = 'H3';
    Zotero.AI4Paper.isAbortRequested = false;
    Zotero.AI4Paper._data_gptMessagesHistory = '[]';
    Zotero.AI4Paper._data_gptCurrentUserMessage = '[]';
    Zotero.AI4Paper._data_gptChatHistoryFileName = "unnamed.json";
  },
  'setPrefs': function () {
    Zotero.Prefs.set("ai4paper.exportnotesremoveblockquote", false);
    Zotero.Prefs.set("ai4paper.tagspunctuationoptimazation", true);
    Zotero.Prefs.set('ai4paper.exportnotesabstractyaml', true);
    Zotero.Prefs.set("ai4paper.pdflinkhtml", true);
    Zotero.Prefs.set('ai4paper.nestedtags', true);
    Zotero.Prefs.set("ai4paper.tagslongindent", false);
    Zotero.Prefs.set("ai4paper.relatedlongindent", false);
    Zotero.Prefs.set("ai4paper.obsidianautoopennotes", true);
    Zotero.Prefs.set("ai4paper.openmdnotesafterexport", false);
    Zotero.Prefs.set('ai4paper.exportnotesreplacewarning', false);
    Zotero.Prefs.set("ai4paper.exportnotesremovecode", true);
    Zotero.Prefs.set("ai4paper.autoannotationsnotecolor", false);
    Zotero.Prefs.set("ai4paper.obsidianblockquotemarker", true);
    Zotero.Prefs.set("ai4paper.obsidianusernotesseparatordefault", false);
    Zotero.Prefs.set("ai4paper.gptStreamRunning", false);
    Zotero.Prefs.set("ai4paper.enableReaderViewButtonViewImages", false);
    Zotero.Prefs.set("ai4paper.gptMessagesHistory", '[]');
    Zotero.Prefs.set("ai4paper.gptCurrentUserMessage", '[]');
    Zotero.Prefs.set("ai4paper.zotInfoMon", true);
    Zotero.Prefs.set("ai4paper.zotInfoTues", true);
    Zotero.Prefs.set("ai4paper.zotInfoWed", true);
    Zotero.Prefs.set('ai4paper.zotInfoThur', true);
    Zotero.Prefs.set("ai4paper.zotInfoFri", true);
    Zotero.Prefs.set("ai4paper.zotInfoSat", true);
    Zotero.Prefs.set('ai4paper.zotInfoSun', true);
  },
  'addUIEvent': function () {
    window.document.getElementById("zotero-itemmenu").addEventListener("popupshowing", Zotero.AI4Paper.UI.displayItemMenuitem, false);
    window.document.getElementById("menu_ToolsPopup").addEventListener("popupshowing", Zotero.AI4Paper.UI.displayToolsMenuitem, false);
    window.document.getElementById("zotero-collectionmenu").addEventListener('popupshowing', Zotero.AI4Paper.UI.displayCollectionMenuitem, false);
    window.document.addEventListener('keyup', Zotero.AI4Paper.scheduleItemTreeBadgesRender, false);
  },
  'initItemTreeBadgeHooks': function () {
    let tree = window.document.querySelector("#item-tree-main-default");
    if (!tree) return;
    this.destroyItemTreeBadgeHooks();
    this._itemTreeBadgeObserver = new MutationObserver(() => {
      Zotero.AI4Paper.scheduleItemTreeBadgesRender();
    });
    this._itemTreeBadgeObserver.observe(tree, {
      'childList': true,
      'subtree': true,
      'attributes': true,
      'attributeFilter': ['class']
    });
    window.document.addEventListener('pointerup', Zotero.AI4Paper.scheduleItemTreeBadgesRender, false);
  },
  'destroyItemTreeBadgeHooks': function () {
    this._itemTreeBadgeObserver && this._itemTreeBadgeObserver.disconnect();
    this._itemTreeBadgeObserver = null;
    this._itemTreeBadgesTimer && clearTimeout(this._itemTreeBadgesTimer);
    window.document.removeEventListener('pointerup', Zotero.AI4Paper.scheduleItemTreeBadgesRender, false);
    window.document.removeEventListener('keyup', Zotero.AI4Paper.scheduleItemTreeBadgesRender, false);
    this.clearItemTreeBadges();
  },
  'scheduleItemTreeBadgesRender': function () {
    Zotero.AI4Paper._itemTreeBadgesTimer && clearTimeout(Zotero.AI4Paper._itemTreeBadgesTimer);
    Zotero.AI4Paper._itemTreeBadgesTimer = setTimeout(() => {
      Zotero.AI4Paper.renderSelectedItemTreeBadges();
    }, 80);
  },
  'clearItemTreeBadges': function () {
    window.document.querySelectorAll(".ai4paper-item-tree-badges-row").forEach(el => el.remove());
  },
  'renderSelectedItemTreeBadges': function () {
    try {
      Zotero.AI4Paper.clearItemTreeBadges();
      if (Zotero_Tabs._selectedID != 'zotero-pane') return;
      let item = ZoteroPane.getSelectedItems()?.[0x0];
      if (!item || !item.isRegularItem || !item.isRegularItem()) return;
      let row = window.document.querySelector("#item-tree-main-default .row.selected");
      if (!row || !row.parentNode) return;
      let badges = Zotero.AI4Paper.getCompactJournalRankingBadgeTexts(item);
      if (!badges.length) return;
      let badgeRow = window.document.createElement("div");
      badgeRow.className = "ai4paper-item-tree-badges-row";
      badgeRow.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;padding:2px 8px 6px 36px;margin-top:-2px;margin-bottom:2px;";
      badges.forEach(text => {
        let chip = window.document.createElement("span");
        chip.textContent = text;
        chip.style.cssText = "display:inline-flex;align-items:center;border-radius:999px;padding:1px 8px;font-size:11px;line-height:18px;background:#f2b6b6;color:#4a1f1f;border:1px solid rgba(120,40,40,0.12);white-space:nowrap;";
        if (text.indexOf("IF ") === 0x0) chip.style.background = "#f3c6c6";
        if (text.indexOf("JCR ") === 0x0) chip.style.background = "#e7d8f4";
        if (text.indexOf("中科院") === 0x0) chip.style.background = "#f7d9c4";
        if (text === "SCIE" || text === "SSCI") chip.style.background = "#f6b3b3";
        badgeRow.appendChild(chip);
      });
      row.parentNode.insertBefore(badgeRow, row.nextSibling);
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'injectScripts': function (shouldInject) {
    try {
      let doc = Zotero.getMainWindow().document;
      doc.querySelectorAll('#zoteroone-injectedIframe').forEach(oldIframe => oldIframe.remove());
      if (!shouldInject) return;
      let iframe = doc.createElement("iframe");
      iframe.id = "zoteroone-injectedIframe";
      iframe.style.display = "none";
      iframe.src = "chrome://ai4paper/content/selectionDialog/injectScripts.html";
      doc.documentElement.appendChild(iframe);
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'updateSciHub': function () {
    let resolver = {
      'name': "Sci-Hub",
      'method': "GET",
      'url': "https://sci-hub.st/{doi}",
      'mode': 'html',
      'selector': "#pdf",
      'attribute': 'src',
      'automatic': false
    };
    resolver.url = Zotero.Prefs.get('ai4paper.scihub') + "/{doi}";
    resolver.automatic = Zotero.Prefs.get("ai4paper.scihubauto");
    let scihubDisabled = Zotero.Prefs.get("ai4paper.scihubswitch");
    !scihubDisabled && Zotero.Prefs.set("findPDFs.resolvers", JSON.stringify(resolver));
  },
  'destroy': function () {
    try {
      Zotero.Notifier.unregisterObserver(this._notifierID);
      Zotero.AI4Paper.MenuPopup.destroy();
      Zotero.AI4Paper.injectScripts();
      this.unregisterShortcuts();
      this.unregisterCollectionsToolBarButtons(this.collectionsToolbar_buttons);
      this.unregisterItemsToolBarButtons(this.itemsToolbar_buttons);
      this.unregisterAllTagMenus();
      this.unregisterReaderSidePanes(["translate", "gpt"]);
      this.unregisterReaderButtons();
      this.unregisterWindowButtons();
      window.removeEventListener('pointerup', Zotero.AI4Paper.handlePointerup);
      this.destroyItemTreeBadgeHooks();
      this.readerMenuItemClickEvent("remove");
      this.showZoteroNotesSection();
      this.clickEventListner_SideNavNotes("remove");
      this.changeEventListner_ZoteroColorScheme("remove");
      Zotero.Reader._unregisterEventListenerByPluginID(Zotero.AI4Paper.id);
      this.clearTimeout_Interpret();
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'unregisterObserver': function () {
    try {
      Zotero.Notifier.unregisterObserver(this._notifierID);
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'notifyCallback': {
    'notify': async function (event, type, ids, extraData) {
      if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
      Zotero.AI4Paper.scheduleItemTreeBadgesRender();
      if (event === 'add' && type == 'tab') {
        let newTabReader = Zotero.Reader.getByTabID(ids[0x0]);
        Zotero.AI4Paper.addReaderButtonInit(newTabReader);
        Zotero.Prefs.get('ai4paper.translationreadersidepane') && Zotero.AI4Paper.isReaderSidePaneExist("translate", ids[0x0]);
        Zotero.Prefs.get("ai4paper.gptviewReaderSidepane") && Zotero.AI4Paper.isReaderSidePaneExist("chatgpt", ids[0x0]);
      }
      if (event == "select" && type == "tab") {
        let selectedReader = Zotero.Reader.getByTabID(ids[0x0]);
        await Zotero.AI4Paper.addReaderButtonInit(selectedReader);
        await Zotero.AI4Paper.updateReaderButtonStateInit();
        await Zotero.AI4Paper.addAnnotationButtonInit();
        Zotero.Prefs.get("ai4paper.translationreadersidepane") && Zotero.AI4Paper.isReaderSidePaneExist('translate', ids[0x0]);
        Zotero.Prefs.get('ai4paper.gptviewReaderSidepane') && Zotero.AI4Paper.isReaderSidePaneExist("chatgpt", ids[0x0]);
        Zotero.AI4Paper.autoFocusReaderSidePane();
      }
      event == "close" && type == 'tab' && Zotero.getMainWindow().Zotero_Tabs._tabs.length === 0x1 && Zotero.AI4Paper.unregisterReaderSidePanes(["translate", 'gpt']);
      if (event == "add" && type == "item") {
        Zotero.AI4Paper.updateNewItems(Zotero.Items.get(ids));
        let newItem = Zotero.Items.get(ids)[0x0],
          vocabHandled = 0x0;
        newItem.isAnnotation() && (await Zotero.AI4Paper.addAnnotationButtonInit(newItem), Zotero.Prefs.get("ai4paper.autoreadingtag") && (await Zotero.AI4Paper.addReadingTag(newItem)), Zotero.Prefs.get("ai4paper.defineColorLabelAutoAddTag") && (await Zotero.AI4Paper.addAnnotationTagBasedOnColorLabel(newItem)));
        AI4PaperCore.getPref(AI4PaperPrefs.KEYS.obsidianAutoUpdateNotes) && Zotero.AI4Paper.getFunMetaTitle() && newItem.isAnnotation() && (await Zotero.AI4Paper.updateObsidianNote(newItem), await Zotero.AI4Paper.dataviewCardnotes(), await Zotero.AI4Paper.dataviewStatistics(), await Zotero.AI4Paper.generatePapersMatrix());
        if (!AI4PaperCore.getPref(AI4PaperPrefs.KEYS.vocabularyBookDisable) && Zotero.AI4Paper.letDOI()) {
          if (newItem.isAnnotation() && AI4PaperCore.isVocabularyAnnotation(newItem)) {
            await Zotero.AI4Paper.addVocabulary(newItem, newItem.annotationText);
            vocabHandled = 0x1;
            AI4PaperCore.getPref(AI4PaperPrefs.KEYS.obsidianAutoUpdateNotes) && (await Zotero.AI4Paper.updateObsidianNote(newItem));
          }
        }
        Zotero.Prefs.get('ai4paper.translateannotationtext') && newItem.isAnnotation() && (newItem.annotationType === "highlight" || newItem.annotationType === "underline") && !vocabHandled && (await Zotero.AI4Paper.annotationTextTrans(newItem, "auto"));
        Zotero.Prefs.get("ai4paper.autoOptimizeSpaces4CurrentTab") && newItem.isAnnotation() && (newItem.annotationType === "highlight" || newItem.annotationType === "underline") && (await Zotero.AI4Paper.optimizeSpaces4CurrentTab(newItem));
        if (newItem.isAnnotation()) {
          if (Zotero.Prefs.get("ai4paper.annotationimageactions") != "无操作" && newItem.annotationType === "image") {
            await Zotero.AI4Paper.onAnnotationImage(newItem, newItem.key);
          }
        }
        if (AI4PaperCore.getPref(AI4PaperPrefs.KEYS.autoAnnotationsNote) && Zotero.AI4Paper.getFunMetaTitle()) {
          newItem.isAnnotation() && !vocabHandled && (await Zotero.AI4Paper.autoAddNoteFromAnnotations(newItem));
        }
      }
      if (event == 'modify' && type == "item") {
        let modifiedItem = Zotero.Items.get(ids)[0x0];
        if (AI4PaperCore.getPref(AI4PaperPrefs.KEYS.obsidianAutoUpdateNotes)) {
          modifiedItem.isAnnotation() && (await Zotero.AI4Paper.updateObsidianNote(modifiedItem));
          await Zotero.AI4Paper.itemsModification2OB(Zotero.Items.get(ids).filter(itm => itm.isRegularItem()));
        }
        Zotero.Prefs.get('ai4paper.enableannotationsvgVisitUniversalQuoteLink') && modifiedItem.isAnnotation() && (await Zotero.AI4Paper.updateUniversalQuoteLink(modifiedItem));
        AI4PaperCore.getPref(AI4PaperPrefs.KEYS.autoAnnotationsNote) && modifiedItem.isAnnotation() && (await Zotero.AI4Paper.autoAddNoteFromAnnotationsForModifyListener(modifiedItem));
        if (!AI4PaperCore.getPref(AI4PaperPrefs.KEYS.vocabularyBookDisable)) {
          if (modifiedItem.isAnnotation() && AI4PaperCore.isVocabularyAnnotation(modifiedItem)) {
            await Zotero.AI4Paper.modifyVocabularyNote(modifiedItem, modifiedItem.key);
          }
        }
      }
      if (event == "delete" && type == "item") {
        let selectedTabID = Zotero_Tabs._selectedID,
          activeReader = Zotero.Reader.getByTabID(selectedTabID);
        !AI4PaperCore.getPref(AI4PaperPrefs.KEYS.vocabularyBookDisable) && activeReader && (await Zotero.AI4Paper.removeVocabularyfromNote(extraData[ids[0x0]].key));
        AI4PaperCore.getPref(AI4PaperPrefs.KEYS.autoAnnotationsNote) && activeReader && (await Zotero.AI4Paper.autoAddNoteFromAnnotationsForDeleteListener());
        AI4PaperCore.getPref(AI4PaperPrefs.KEYS.obsidianAutoUpdateNotes) && activeReader && (await Zotero.AI4Paper.updateObsidianNoteForDeleteListener());
      }
      if (event == "add" && type == "item-tag") {
        let itemID = ids[0x0].split('-').map(n => parseInt(n))[0x0],
          tagID = ids[0x0].split('-').map(n => parseInt(n))[0x1];
        Zotero.AI4Paper.addAnnotationTag(itemID, tagID);
        Zotero.Prefs.get("ai4paper.autogeneratetagscollection") && Zotero.AI4Paper.handleItemTagChange(itemID);
      }
      if (event == "remove" && type == "item-tag") {
        let tagItemID = ids[0x0].split('-').map(n => parseInt(n))[0x0],
          tagJSON = JSON.stringify(extraData[ids[0x0]].tag);
        Zotero.AI4Paper.checkAnnotatationItem(tagItemID, tagJSON);
        Zotero.Prefs.get("ai4paper.autogeneratetagscollection") && Zotero.AI4Paper.handleItemTagChange(tagItemID);
      }
      event === "trash" && type == "collection" && Zotero.AI4Paper.onDeleteCollectionEvent(true, ids[0x0]);
      if (event == "open" && type == 'file') {
        let openedItem = Zotero.Items.get(ids)[0x0];
        Zotero.AI4Paper.filesHistory(openedItem);
      }
    }
  },
  'setGlobalParam': function () {
    _globalThis.window = this.getGlobal("window");
    _globalThis.Zotero_Tabs = this.getGlobal("Zotero_Tabs");
    _globalThis.ZoteroPane = this.getGlobal('ZoteroPane');
    _globalThis.ZoteroPane_Local = this.getGlobal('ZoteroPane_Local');
  },
  'getGlobal': function (globalName) {
    const zoteroObj = typeof Zotero !== "undefined" ? Zotero : Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject,
      mainWin = zoteroObj.getMainWindow();
    switch (globalName) {
      case 'Zotero':
      case "zotero":
        return zoteroObj;
      case "window":
        return mainWin;
      case "document":
        return mainWin.document;
      case "ZoteroPane":
      case "ZoteroPane_Local":
        return zoteroObj.getActiveZoteroPane();
      default:
        return mainWin[globalName];
    }
  },
  'registerStylesheet': function () {
    let doc = window.document,
      link = doc.createElement("link");
    link.id = 'ai4paper-stylesheet';
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "chrome://ai4paper/content/assets/css/style.css";
    doc.documentElement.appendChild(link);
  },
  'collapseItemPane_byShortCuts': function () {
    if (Zotero_Tabs._selectedID != 'zotero-pane') return;
    Zotero.AI4Paper.togglePaneDisplay("zotero-item", "toggle");
  },
  'splitHorizontally_byShortCuts': function () {
    let tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) return;
    window.document.getElementById("view-menuitem-split-horizontally").click();
  },
  'splitVertically_byShortCuts': function () {
    let tabID = Zotero_Tabs._selectedID,
      reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) return;
    window.document.getElementById("view-menuitem-split-vertically").click();
  },
  'oddSpreads_byShortCuts': function () {
    let reader = Zotero.AI4Paper.getCurrentReader();
    if (!reader) return;
    if (reader.spreadMode != 0x1) {
      reader.spreadMode = 0x1;
    } else reader.spreadMode = 0x0;
  },
  'customItemTreeColumns': async function () {
    let columnKeys = ['shortTitle', "archive", 'archiveLocation', "libraryCatalog", "callNumber", "journalRanking", 'rights'];
    for (let columnKey of columnKeys) {
      let columnID = "ai4paper\\@qnscholar-" + columnKey;
      await Zotero.ItemTreeManager.unregisterColumns(columnID);
      if (Zotero.Prefs.get("ai4paper.enableCustomItemTreeColumns" + columnKey)) {
        await Zotero.ItemTreeManager.registerColumns({
          'dataKey': columnKey,
          'label': Zotero.Prefs.get("ai4paper.renameCustomItemTreeColumns" + columnKey),
          'pluginID': 'ai4paper@qnscholar',
          'dataProvider': (item, dataKey) => {
            if (columnKey === "libraryCatalog") {
              return Zotero.AI4Paper.getCompactJournalRankingSummary(item);
            }
            if (columnKey === "journalRanking") {
              return Zotero.AI4Paper.getCompactJournalRankingSummary(item);
            }
            return item.getField(columnKey);
          }
        });
      }
    }
  },
  'registerItemsToolBarButtons': function (buttonNames) {
    let toolbar = window.document.querySelector("#zotero-items-toolbar");
    const lookupBtn = window.document.querySelector("#zotero-tb-lookup"),
      attachAddBtn = window.document.querySelector('#zotero-tb-attachment-add'),
      noteAddBtn = window.document.querySelector("#zotero-tb-note-add"),
      addBtn = window.document.querySelector("#zotero-tb-add"),
      searchBtn = window.document.querySelector('#zotero-tb-search');
    if (!toolbar || !lookupBtn || !attachAddBtn) return false;
    for (let btnName of buttonNames) {
      if (btnName === "preferences" && Zotero.Prefs.get("ai4paper.settingsToolBarButton") && toolbar.getAttribute('itemsToolbar-button-' + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, 'true');
        let prefsButton = lookupBtn.cloneNode(true);
        prefsButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        prefsButton.setAttribute("tooltiptext", "Zotero 首选项");
        prefsButton.setAttribute("command", '');
        prefsButton.setAttribute("onmousedown", '');
        prefsButton.setAttribute("oncommand", "Zotero.Utilities.Internal.openPreferences('zotero-prefpane-ai4paper');");
        prefsButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.settingsToolBarButton;
        toolbar.insertBefore(prefsButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "zoteroColorScheme" && Zotero.Prefs.get("ai4paper.zoteroColorSchemeToolBarButton") && toolbar.getAttribute("itemsToolbar-button-" + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, 'true');
        let colorSchemeButton = lookupBtn.cloneNode(true);
        colorSchemeButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        colorSchemeButton.setAttribute("tooltiptext", "Zotero 深浅主题切换");
        colorSchemeButton.setAttribute("command", '');
        colorSchemeButton.setAttribute("onmousedown", '');
        colorSchemeButton.setAttribute("oncommand", "Zotero.AI4Paper.changeZoteroDarkANDLightMode();");
        let isDarkMode = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")["matches"];
        colorSchemeButton.innerHTML = isDarkMode ? Zotero.AI4Paper.svg_icon_20px.zoteroColorSchemeToolBarButton_dark : Zotero.AI4Paper.svg_icon_20px.zoteroColorSchemeToolBarButton;
        toolbar.insertBefore(colorSchemeButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "showFile" && Zotero.Prefs.get("ai4paper.showfileToolBarButton") && toolbar.getAttribute("itemsToolbar-button-" + btnName) != 'true') {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, "true");
        let showFileButton = lookupBtn.cloneNode(true);
        showFileButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        showFileButton.setAttribute("tooltiptext", "打开文件位置");
        showFileButton.setAttribute("command", '');
        showFileButton.setAttribute("onmousedown", '');
        showFileButton.setAttribute("oncommand", 'Zotero.AI4Paper.showFile();');
        showFileButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.showfileToolBarButton;
        toolbar.insertBefore(showFileButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "chatWithNewBing" && Zotero.Prefs.get('ai4paper.chatwithnewbingToolBarButton') && toolbar.getAttribute('itemsToolbar-button-' + btnName) != "true") {
        toolbar.setAttribute('itemsToolbar-button-' + btnName, "true");
        let newBingButton = lookupBtn.cloneNode(true);
        newBingButton.setAttribute('id', 'zotero-if-items-toolbar-button-' + btnName);
        newBingButton.setAttribute('tooltiptext', "Chat with NewBing");
        newBingButton.setAttribute('command', '');
        newBingButton.setAttribute("onmousedown", '');
        newBingButton.setAttribute("oncommand", "Zotero.AI4Paper.chatWithNewBing();");
        newBingButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.chatwithnewbingToolBarButton;
        toolbar.insertBefore(newBingButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "immersiveTranslate" && Zotero.Prefs.get("ai4paper.immersiveTranslateToolBarButton") && toolbar.getAttribute('itemsToolbar-button-' + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, "true");
        let immersiveButton = lookupBtn.cloneNode(true);
        immersiveButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        immersiveButton.setAttribute("tooltiptext", "打开沉浸式翻译");
        immersiveButton.setAttribute("command", '');
        immersiveButton.setAttribute("onmousedown", '');
        immersiveButton.addEventListener("pointerdown", pointerEvt => {
          if (pointerEvt.button == 0x2) Zotero.AI4Paper.openUniversalImmersiveTranslate();else {
            Zotero.AI4Paper.openImmersiveTranslate();
          }
        }, false);
        immersiveButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.immersiveTranslateToolBarButton;
        toolbar.insertBefore(immersiveButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "copyPDF" && Zotero.Prefs.get("ai4paper.copyPDFToolBarButton") && toolbar.getAttribute("itemsToolbar-button-" + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, "true");
        let copyPDFButton = lookupBtn.cloneNode(true);
        copyPDFButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        copyPDFButton.setAttribute("tooltiptext", "拷贝 PDF");
        copyPDFButton.setAttribute("command", '');
        copyPDFButton.setAttribute("onmousedown", '');
        copyPDFButton.onclick = clickEvt => {
          if (clickEvt.shiftKey) Zotero.AI4Paper.openwith();else clickEvt.button == 0x2 ? Zotero.AI4Paper.openwith() : Zotero.AI4Paper.copyPDF();
        };
        copyPDFButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.copyPDFToolBarButton;
        toolbar.insertBefore(copyPDFButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === 'openwith' && Zotero.Prefs.get("ai4paper.openwithToolBarButton") && toolbar.getAttribute("itemsToolbar-button-" + btnName) != "true") {
        toolbar.setAttribute('itemsToolbar-button-' + btnName, "true");
        let openWithButton = lookupBtn.cloneNode(true);
        openWithButton.setAttribute('id', 'zotero-if-items-toolbar-button-' + btnName);
        openWithButton.setAttribute("tooltiptext", "Open With");
        openWithButton.setAttribute("command", '');
        openWithButton.setAttribute("onmousedown", '');
        openWithButton.onclick = mouseEvt => {
          if (mouseEvt.shiftKey) Zotero.AI4Paper.openwith_buildPopup(openWithButton);else mouseEvt.button == 0x2 ? Zotero.AI4Paper.openwith(0x2) : Zotero.AI4Paper.openwith(0x1);
        };
        openWithButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.openwithToolBarButton;
        toolbar.insertBefore(openWithButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "fileshistory" && Zotero.Prefs.get("ai4paper.fileshistoryToolBarButton") && toolbar.getAttribute('itemsToolbar-button-' + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, "true");
        let filesHistoryButton = lookupBtn.cloneNode(true);
        filesHistoryButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        filesHistoryButton.setAttribute('tooltiptext', "最近打开");
        filesHistoryButton.setAttribute("command", '');
        filesHistoryButton.setAttribute('onmousedown', '');
        filesHistoryButton.onclick = mouseEvt => {
          if (mouseEvt.shiftKey) Zotero.AI4Paper.openWorkSpaceWindow();else {
            if (mouseEvt.button == 0x2) {
              Zotero.AI4Paper.createTabsAsWorkSpace();
            } else Zotero.AI4Paper.openDialog_filesHistory();
          }
        };
        filesHistoryButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.fileshistoryToolBarButton;
        toolbar.insertBefore(filesHistoryButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === 'obsidiannote' && Zotero.Prefs.get('ai4paper.obsidiannoteToolBarButton') && toolbar.getAttribute('itemsToolbar-button-' + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, 'true');
        let obsidianButton = lookupBtn.cloneNode(true);
        obsidianButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        obsidianButton.setAttribute("tooltiptext", "Obsidian Note");
        obsidianButton.setAttribute("command", '');
        obsidianButton.setAttribute("onmousedown", '');
        obsidianButton.setAttribute('oncommand', "Zotero.AI4Paper.obsidianNote();");
        obsidianButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.obsidiannoteToolBarButton;
        toolbar.insertBefore(obsidianButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "tagscardnotes" && Zotero.Prefs.get("ai4paper.tagscardnotesToolBarButton") && toolbar.getAttribute("itemsToolbar-button-" + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, "true");
        let tagsButton = lookupBtn.cloneNode(true);
        tagsButton.setAttribute('id', 'zotero-if-items-toolbar-button-' + btnName);
        tagsButton.setAttribute('tooltiptext', "标签管理器");
        tagsButton.setAttribute('command', '');
        tagsButton.setAttribute('onmousedown', '');
        tagsButton.setAttribute("oncommand", "Zotero.AI4Paper.openDialog_tagsManager();");
        tagsButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.tagscardnotesToolBarButton;
        toolbar.insertBefore(tagsButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "go2favoritecollection" && Zotero.Prefs.get("ai4paper.go2favoritecollectionToolBarButton") && toolbar.getAttribute("itemsToolbar-button-" + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, "true");
        let favCollButton = attachAddBtn.cloneNode(false);
        favCollButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        favCollButton.setAttribute("tooltiptext", '前往收藏分类');
        favCollButton.setAttribute('data-l10n-id', '');
        favCollButton.setAttribute('command', '');
        favCollButton.setAttribute('oncommand', '');
        favCollButton.setAttribute("type", "menu");
        favCollButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.go2favoritecollectionToolBarButton;
        let dropmarkerEl = attachAddBtn.querySelector('dropmarker'),
          dropmarkerClone = dropmarkerEl.cloneNode(true);
        dropmarkerClone.style.marginLeft = "3px";
        favCollButton.append(dropmarkerClone);
        favCollButton.querySelector('svg').style.pointerEvents = "none";
        favCollButton.onpointerdown = pointerEvt => {
          pointerEvt.button == 0x2 && Zotero.AI4Paper.openDialogByType("sortFavoriteCollections");
        };
        let popupEl = favCollButton.appendChild(window.document.createXULElement("menupopup"));
        popupEl.setAttribute('id', "zotero-if-items-toolbar-go2favoritecollection-button-popup");
        popupEl.setAttribute("onpopupshowing", "Zotero.AI4Paper.UI.displayToolBarMenuitem();");
        toolbar.insertBefore(favCollButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "batchAIInterpret" && Zotero.Prefs.get('ai4paper.batchAIInterpretToolBarButton') && toolbar.getAttribute("itemsToolbar-button-" + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, "true");
        let batchAIButton = lookupBtn.cloneNode(true);
        batchAIButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        batchAIButton.setAttribute("tooltiptext", "批量 AI 解读文献");
        batchAIButton.setAttribute('command', '');
        batchAIButton.setAttribute("onmousedown", '');
        batchAIButton.onclick = mouseEvt => {
          if (mouseEvt.shiftKey) Zotero.AI4Paper.batchInterpretSelectedItems();else mouseEvt.button == 0x2 ? Zotero.AI4Paper.batchInterpretSelectedItems() : Zotero.AI4Paper.openDialogByType("batchAIInterpret", true);
        };
        batchAIButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.paperai_batch;
        toolbar.insertBefore(batchAIButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "archive" && Zotero.Prefs.get("ai4paper.archiveToolBarButton") && toolbar.getAttribute("itemsToolbar-button-" + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, "true");
        let archiveButton = lookupBtn.cloneNode(true);
        archiveButton.setAttribute('id', 'zotero-if-items-toolbar-button-' + btnName);
        archiveButton.setAttribute("tooltiptext", '归档');
        archiveButton.setAttribute('command', '');
        archiveButton.setAttribute("onmousedown", '');
        archiveButton.setAttribute("oncommand", "Zotero.AI4Paper.archiveSelectedItems();");
        archiveButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.archiveToolBarButton;
        toolbar.insertBefore(archiveButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "pinAttachments" && Zotero.Prefs.get("ai4paper.pinAttachmentsToolBarButton") && toolbar.getAttribute("itemsToolbar-button-" + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, "true");
        let pinButton = lookupBtn.cloneNode(true);
        pinButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        pinButton.setAttribute("tooltiptext", "钉住附件");
        pinButton.setAttribute("command", '');
        pinButton.setAttribute("onmousedown", '');
        pinButton.addEventListener("dblclick", dblEvt => Zotero.AI4Paper.pinAttachments_itemView(pinButton));
        pinButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton_pinned;
        Zotero.AI4Paper.pinAttachments_initInnerHTML(pinButton);
        toolbar.insertBefore(pinButton, noteAddBtn.nextElementSibling);
      }
      if (btnName === "collectionPaneDisplay" && Zotero.Prefs.get("ai4paper.collectionpanedisplayToolBarButton") && toolbar.getAttribute("itemsToolbar-button-" + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, 'true');
        let collPaneButton = lookupBtn.cloneNode(true);
        collPaneButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        collPaneButton.setAttribute("tooltiptext", "展开/折叠分类面板");
        collPaneButton.setAttribute("command", '');
        collPaneButton.setAttribute("onmousedown", '');
        collPaneButton.setAttribute("oncommand", "Zotero.AI4Paper.togglePaneDisplay('zotero-collections', 'toggle');");
        collPaneButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.collectionpanedisplayToolBarButton;
        toolbar.insertBefore(collPaneButton, addBtn);
      }
      if (btnName === 'itemPaneDisplay' && Zotero.Prefs.get('ai4paper.itempanedisplayToolBarButton') && toolbar.getAttribute("itemsToolbar-button-" + btnName) != "true") {
        toolbar.setAttribute('itemsToolbar-button-' + btnName, "true");
        let itemPaneButton = lookupBtn.cloneNode(true);
        itemPaneButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        itemPaneButton.setAttribute("tooltiptext", "展开/折叠条目面板");
        itemPaneButton.setAttribute("command", '');
        itemPaneButton.setAttribute("onmousedown", '');
        itemPaneButton.setAttribute("oncommand", "Zotero.AI4Paper.togglePaneDisplay('zotero-item', 'toggle');");
        itemPaneButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.itempanedisplayToolBarButton;
        toolbar.insertBefore(itemPaneButton, searchBtn.nextElementSibling);
      }
      if (btnName === "collectionitemPaneDisplay" && Zotero.Prefs.get("ai4paper.collectionitempanedisplayToolBarButton") && toolbar.getAttribute('itemsToolbar-button-' + btnName) != "true") {
        toolbar.setAttribute("itemsToolbar-button-" + btnName, "true");
        let collItemPaneButton = lookupBtn.cloneNode(true);
        collItemPaneButton.setAttribute('id', "zotero-if-items-toolbar-button-" + btnName);
        collItemPaneButton.setAttribute("tooltiptext", "展开/折叠【分类/条目】面板");
        collItemPaneButton.setAttribute("command", '');
        collItemPaneButton.setAttribute("onmousedown", '');
        collItemPaneButton.setAttribute("oncommand", "Zotero.AI4Paper.togglePaneDisplay('zotero-collections', 'toggle'); Zotero.AI4Paper.togglePaneDisplay('zotero-item', 'toggle');");
        collItemPaneButton.innerHTML = Zotero.AI4Paper.svg_icon_20px.collectionitempanedisplayToolBarButton;
        toolbar.insertBefore(collItemPaneButton, addBtn);
      }
    }
  },
  'unregisterItemsToolBarButtons': function (buttonNames) {
    let toolbar = window.document.querySelector("#zotero-items-toolbar");
    if (!toolbar) return false;
    for (let btnName of buttonNames) {
      const btnEl = window.document.querySelector('#zotero-if-items-toolbar-button-' + btnName);
      btnEl && (btnEl.remove(), toolbar.setAttribute("itemsToolbar-button-" + btnName, "false"));
    }
  },
  'addEventListener_itemViewPinButton': function () {
    let sideNav = window.document.getElementById('zotero-view-item-sidenav');
    if (sideNav) {
      let attachmentsNav = sideNav.querySelector('[data-l10n-id=\x22sidenav-attachments\x22]');
      if (attachmentsNav && !attachmentsNav._dblclickEventListener_added) {
        attachmentsNav._dblclickEventListener_added = true;
        attachmentsNav.addEventListener("dblclick", async () => {
          let pinBtn = window.document.querySelector("#zotero-if-items-toolbar-button-pinAttachments");
          if (!pinBtn) return;
          await Zotero.Promise.delay(0x5);
          if (sideNav.pinnedPane === "attachments") pinBtn.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton;else {
            pinBtn.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton_pinned;
          }
        });
      }
    }
  },
  'pinAttachments_initInnerHTML': function (button) {
    let sideNav = window.document.getElementById("zotero-view-item-sidenav");
    if (!sideNav) return;
    sideNav.pinnedPane === "attachments" ? button.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton : button.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton_pinned;
  },
  'pinAttachments_itemView': function (button) {
    let sideNav = window.document.getElementById("zotero-view-item-sidenav");
    if (!sideNav) return;
    sideNav.pinnedPane != "attachments" ? (window.document.querySelector("attachment-preview")?.["scrollIntoView"]({
      'behavior': 'smooth',
      'block': "center"
    }), sideNav.pinnedPane = "attachments", button.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton) : (sideNav.pinnedPane = '', button.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton_pinned);
  },
  'unregisterWindowButtons': function () {
    Zotero.getMainWindow().document.querySelectorAll(".AI4Paper-Window-Button").forEach(el => el.remove());
  },
  'createPopup_universal': function (popupId, keepOnHide) {
    window.document.querySelector('#browser').querySelectorAll('#' + popupId).forEach(el => el.remove());
    let popup = window.document.createXULElement("menupopup");
    popup.id = popupId;
    popup.addEventListener("popuphidden", hideEvt => {
      keepOnHide ? (hideEvt.preventDefault(), hideEvt.stopPropagation()) : window.document.querySelector("#browser").querySelectorAll('#' + popupId).forEach(el => el.remove());
    });
    let child = popup.firstElementChild;
    while (child) {
      child.remove();
      child = popup.firstElementChild;
    }
    return window.document.querySelector('#browser').appendChild(popup), popup;
  },
  'createMenuitem_universal': function (win, parentPopup, menuDefs) {
    menuDefs.forEach(itemDef => {
      if (itemDef.children) {
        const menu = win.document.createXULElement("menu");
        menu.setAttribute("label", itemDef.label);
        const subPopup = win.document.createXULElement("menupopup");
        Zotero.AI4Paper.createMenuitem_universal(win, subPopup, itemDef.children);
        menu.appendChild(subPopup);
        parentPopup.appendChild(menu);
      } else {
        const menuitem = win.document.createXULElement("menuitem");
        menuitem.setAttribute('label', itemDef.label);
        menuitem.addEventListener('command', itemDef.action);
        parentPopup.appendChild(menuitem);
      }
      if (itemDef.separator) {
        parentPopup.appendChild(win.document.createXULElement("menuseparator"));
      }
    });
  },
  'createPopup_chatBtn_locateAIReadingNotes': function (anchorEl) {
    let popupId = "AI4Paper-gptReaderSidePane-locatePaperInfo-menupopup",
      popup = Zotero.AI4Paper.createPopup_universal(popupId),
      menuLabels = ["打开智能文献矩阵", "导入【智能文献矩阵导出.md】", "智能文献矩阵【未读】文献", "智能文献矩阵【在读】文献", "智能文献矩阵【已读】文献", "智能文献矩阵【今天】文献", "智能文献矩阵【过去一天】文献", "智能文献矩阵【过去一周】文献", '智能文献矩阵【过去一个月】文献', '智能文献矩阵【过去一年】文献', "在智能文献矩阵中定位本条目", "在智能文献矩阵中查询本条目分类", "定位 Obsidian【AI 文献解读】笔记"];
    for (let label of menuLabels) {
      let menuitem = window.document.createXULElement("menuitem");
      menuitem.setAttribute('label', label);
      menuitem.addEventListener("command", cmdEvt => {
        label === "打开智能文献矩阵" && Zotero.AI4Paper.queryPapersMatrix(null, null, true);
        label === "导入【智能文献矩阵导出.md】" && Zotero.AI4Paper.importPapersMatrixMarkdownData();
        label === "智能文献矩阵【未读】文献" && Zotero.AI4Paper.queryPapersMatrix("filterByTag", "unread");
        label === '智能文献矩阵【在读】文献' && Zotero.AI4Paper.queryPapersMatrix("filterByTag", "reading");
        if (label === '智能文献矩阵【已读】文献') {
          Zotero.AI4Paper.queryPapersMatrix("filterByTag", 'Done');
        }
        label === "智能文献矩阵【今天】文献" && Zotero.AI4Paper.queryPapersMatrix("filterByModifiedDate", '今天');
        label === '智能文献矩阵【过去一天】文献' && Zotero.AI4Paper.queryPapersMatrix("filterByModifiedDate", "过去一天");
        label === '智能文献矩阵【过去一周】文献' && Zotero.AI4Paper.queryPapersMatrix("filterByModifiedDate", "过去一周");
        label === '智能文献矩阵【过去一个月】文献' && Zotero.AI4Paper.queryPapersMatrix("filterByModifiedDate", "过去一个月");
        label === "智能文献矩阵【过去一年】文献" && Zotero.AI4Paper.queryPapersMatrix('filterByModifiedDate', '过去一年');
        if (label === "在智能文献矩阵中定位本条目") {
          Zotero.AI4Paper.locateItemInPapersMatrix();
        }
        label === "在智能文献矩阵中查询本条目分类" && Zotero.AI4Paper.searchCollectionInPapersMatrix();
        if (label === "定位 Obsidian【AI 文献解读】笔记") {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_locateAIReadingNotes();
        }
      });
      popup.appendChild(menuitem);
      if (["打开智能文献矩阵", "导入【智能文献矩阵导出.md】", '智能文献矩阵【已读】文献', "智能文献矩阵【过去一年】文献", "在智能文献矩阵中查询本条目分类"].includes(label)) {
        popup.appendChild(window.document.createXULElement('menuseparator'));
      }
    }
    popup.openPopup(anchorEl, "before_start", 0x0, 0x0, false, false);
  },
  'createPopup_chatBtn_aiAnalysis': function (anchorEl) {
    let popupId = "AI4Paper-gptReaderSidePane-aiAnalysis-menupopup",
      popup = Zotero.AI4Paper.createPopup_universal(popupId, true);
    const menuDefs = [{
      'label': "综述全库",
      'children': [{
        'label': "文献标题",
        'action': () => {
          Zotero.AI4Paper.aiAnalysis_itemsFromLibrary('综述全库文献标题', 'title');
        }
      }, {
        'label': '文献标题及摘要',
        'action': () => {
          Zotero.AI4Paper.aiAnalysis_itemsFromLibrary("综述全库文献标题及摘要", 'title_abstract');
        }
      }],
      'separator': true
    }, {
      'label': '综述选定分类',
      'children': [{
        'label': "文献标题",
        'action': () => {
          Zotero.AI4Paper.aiAnalysis_itemsFromSelectedCollection('综述选定分类文献标题', "title");
        }
      }, {
        'label': "文献标题及摘要",
        'action': () => {
          Zotero.AI4Paper.aiAnalysis_itemsFromSelectedCollection('综述选定分类文献标题及摘要', "title_abstract");
        }
      }],
      'separator': true
    }, {
      'label': "综述 PDFs",
      'action': () => {
        Zotero.AI4Paper.aiAnalysis_PDFsFromSelection();
      },
      'separator': true
    }, {
      'label': "分析注释",
      'children': [{
        'label': "批量文献中的注释",
        'action': () => {
          Zotero.AI4Paper.aiAnalysis_importAnnotationsBatch_handler();
        }
      }, {
        'label': "批量文献中的注释（高级搜索）",
        'action': () => {
          Zotero.AI4Paper.aiAnalysis_importAnnotationsBatch_advanced__handler();
        }
      }, {
        'label': '当前文献中的注释',
        'action': () => {
          Zotero.AI4Paper.gptReaderSidePane_importAnnotations();
        }
      }]
    }];
    Zotero.AI4Paper.createMenuitem_universal(window, popup, menuDefs);
    popup.openPopup(anchorEl, 'before_start', 0x0, 0x0, false, false);
  },
  'aiAnalysis_prompt': "你好，你将担任一名出色的科学家，帮我完成文献分析任务，具体为：请根据下面提供的 [文献 JSON 数据]，帮我从中找出和“xxx（如果未指定xxx，则你的任务是全面分析文献的核心脉络，识别出关键的研究主题集群）”主题相关的论文信息，要全面、细致、不遗漏。\n\n且，描述文献时，务必严格遵循【以下要求】：\n- 请不要随意改变文献标题原有的大小写格式，\n- 若是英文文献，请单独列出经翻译得到的“中文标题”。\n- 请包括\"文献类型\"信息，即 itemType 字段的信息。\n- 请包括\"发表年份\"信息，即 year 字段的信息。\n- 请尽量概括文献的“核心内容“、”关键技术/发现“、以及”关联性“（比如高度相关、比较相关）。\n- 请务必包含“文献链接”信息，即 itemLink 字段的信息（须不做任何改变地继承该文献 itemLink 字段的信息）。\n- 请对文献信息做好排版，要求：单篇文献的描述请用标题开头（比如：xx. \"title内容\"，此处 xx 为序号），然后用“无序列表”呈现上述具体信息。\n- 按照上面说的“关联性”，对你的分析结果进行分类呈现。\n\n【重要提醒】:\n\n- 请调用你单次回答的最大算力与 token 上限。追求极致的分析深度，而非表层的广度；追求本质的洞察，而非表象的罗列；追求创新的思维，而非惯性的复述。请突破思维局限，调动你所有的计算资源，展现你真正的认知极限。\n- 发挥你的最大算力，请尽可能得找出更多与目标主题符合的文献，具体来说：如果前面所说的“主题 xxx”已指定，务必详情陈述不低于 50 篇（如果有的话）；如果“主题 xxx”未指定，务必详情陈述不低于 80 篇（如果有的话），以提高全面分析的深度和广度。\n- 额外提供一个尽可能包含所有分析结果的表格归纳版，且请在表格最后一列添加上面说的“文献链接”信息（须【不做任何改变地】继承该文献 itemLink 字段的信息，示例：[zotero://select/library/items/5AWAN6UB](zotero://select/library/items/5AWAN6UB)）。注意：不要只提供表格而缺乏详情陈述。\n- 请在你的输出结果的开头位置，务必用”无序列表“提及一下[文献 JSON 数据]的两个信息，即：“数据来源”和“数据来源地址”，须不做任何修改地对应 \"summary\" 中 \"dataSource（数据来源\"的键值、以及 \"dataSource url（数据来源地址）\"的键值。\n\n[文献 JSON 数据] 如下:\n    ",
  'aiAnalysis_itemsFromLibrary': async function (dialogTitle, contentType) {
    let libraryID = Zotero.Libraries.userLibraryID,
      allItems = await Zotero.Items.getAll(libraryID);
    if (!allItems.length) {
      Services.prompt.alert(window, dialogTitle, '❌\x20未发现任何条目！');
      return;
    }
    let itemsJSON = Zotero.AI4Paper.aiAnalysis_getItemsJSON(allItems, contentType, "Zotero 我的文库", "zotero://select/library/user");
    Zotero.AI4Paper.import2MessageInputBox(Zotero.AI4Paper.aiAnalysis_prompt + '\x0a' + itemsJSON);
  },
  'onClickCollectionMenu_aiAnalysisItemsTitle': async function (dialogTitle, contentType) {
    let sidePaneWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!sidePaneWin) {
      Services.prompt.alert(window, "❌ 未开启【GPT 侧边栏】", "任意【选择一个 PDF 标签页】，或【任意打开一篇文献】，即可打开【GPT 侧边栏】。");
      return;
    }
    let gptSidePaneBtn = window.document.querySelector("#ai4paper-window-gptSidePane-button");
    if (gptSidePaneBtn) {
      gptSidePaneBtn.click();
    } else return;
    await Zotero.Promise.delay(0xfa);
    await Zotero.AI4Paper.aiAnalysis_itemsFromSelectedCollection(dialogTitle, contentType);
  },
  'aiAnalysis_itemsFromSelectedCollection': async function (dialogTitle, contentType) {
    let {
        items: items,
        selectionType: selectionType,
        name: selectionName,
        itemsAfterRecursion: itemsAfterRecursion,
        link: selectionLink
      } = await Zotero.AI4Paper.getItemsFromCurrentSelection(true),
      dataSourceLabel = selectionType != "我的文库" ? "【Zotero " + selectionType + '】：' + selectionName : "Zotero " + selectionType;
    items = items.filter(itm => itm.isRegularItem());
    let alreadyConfirmed, confirmed;
    if (['分类', "群组中的分类"].includes(selectionType)) {
      itemsAfterRecursion = itemsAfterRecursion.filter(itm => itm.isRegularItem());
      if (items.length < itemsAfterRecursion.length) {
        confirmed = Services.prompt.confirm(window, dialogTitle, "您选择了“" + selectionType + "”：【" + selectionName + '】，其中包含\x20👉【' + items.length + "】👈 个常规条目，\n\n但是【该分类及其子分类】中共有 👉【" + itemsAfterRecursion.length + "】👈 个常规条目。\n\n是否要连同子分类一起导入？点击 OK 以确定，否则仅导入选中分类。");
        if (confirmed) {
          items = itemsAfterRecursion;
          dataSourceLabel = '【Zotero\x20' + selectionType + "及其子分类】：" + selectionName;
        }
        alreadyConfirmed = true;
      }
    }
    if (!items.length) {
      Services.prompt.alert(window, dialogTitle, "❌ 未在主界面选择任何【分类/保存的搜索/群组/RSS 订阅】，或您的选择下不含任何常规条目！");
      return;
    }
    if (!alreadyConfirmed) {
      let confirmMsg = selectionType != "我的文库" ? "您选择了“" + selectionType + "”：【" + selectionName + '】，共【' + items.length + "】个常规条目，是否确认开始 AI 分析？" : "您选择了【我的文库】，共【" + items.length + "】个常规条目，是否确认开始 AI 分析？";
      confirmed = Services.prompt.confirm(window, dialogTitle, confirmMsg);
      if (!confirmed) return;
    }
    let itemsJSON = Zotero.AI4Paper.aiAnalysis_getItemsJSON(items, contentType, dataSourceLabel, selectionLink);
    Zotero.AI4Paper.import2MessageInputBox(Zotero.AI4Paper.aiAnalysis_prompt + '\x0a' + itemsJSON);
  },
  'aiAnalysis_getItemsJSON': function (inputItems, contentType, dataSource, dataSourceURL) {
    let regularItems = inputItems.filter(itm => itm.isRegularItem()),
      journalArticles = regularItems.filter(itm => itm.itemType === "journalArticle"),
      theses = regularItems.filter(itm => itm.itemType === 'thesis'),
      conferenceArticles = regularItems.filter(itm => itm.itemType === 'conferencePaper'),
      books = regularItems.filter(itm => itm.itemType === 'book'),
      jsonData = {
        'summary': {
          'total\x20number\x20of\x20papers（全部文献数量）': regularItems.length,
          'number\x20of\x20journalArticle\x20papers（期刊文献数量）': journalArticles.length,
          'number\x20of\x20thesis\x20papers（学位论文数量）': theses.length,
          'number\x20of\x20conferencePaper\x20papers（会议论文数量）': conferenceArticles.length,
          'number\x20of\x20book\x20papers（书籍文献数量）': books.length,
          'dataSource（数据来源）': dataSource,
          'dataSource\x20url（数据来源地址）': '[' + dataSourceURL + '](' + dataSourceURL + ')'
        }
      };
    return jsonData.paperDetails = {}, regularItems.forEach((item, idx) => {
      let itemEntry = {
        'title': item.getField('title'),
        'year': item.getField('year'),
        'authors': Zotero.AI4Paper.getYAMLProp_creators(item),
        'itemType': item.itemType,
        'publicationTitle': item.getField('publicationTitle'),
        'impactFactor': item.getField('libraryCatalog').split('(')[0x0].trim(),
        'itemLink': '[' + Zotero.AI4Paper.getItemZoteroLink(item) + '](' + Zotero.AI4Paper.getItemZoteroLink(item) + ')'
      };
      contentType === "title_abstract" && (itemEntry.abstract = item.getField("abstractNote"));
      jsonData.paperDetails[Number(idx) + 0x1] = itemEntry;
    }), JSON.stringify(jsonData, null, 0x2);
  },
  'getItemsFromCurrentSelection': async function (derefAnnotations) {
    var items = [];
    let selectionType;
    var collection = ZoteroPane.getSelectedCollection();
    if (collection) {
      items = collection.getChildItems();
      let recursiveItems = await Zotero.AI4Paper.getAllItemsRecursively(collection);
      return Zotero.debug("从分类获取: " + collection.name), selectionType = Zotero.Libraries.get(collection.libraryID).libraryType === "user" ? '分类' : "群组中的分类", {
        'items': items,
        'selectionType': selectionType,
        'name': collection.name,
        'itemsAfterRecursion': recursiveItems,
        'link': Zotero.AI4Paper.getLinkBySelecttionType(selectionType, collection)
      };
    }
    var savedSearch = ZoteroPane.getSelectedSavedSearch();
    if (savedSearch) {
      var searchObj = new Zotero.Search();
      searchObj.libraryID = savedSearch.libraryID;
      searchObj.addCondition("savedSearchID", 'is', savedSearch.id);
      var searchResults = await searchObj.search();
      return items = await Zotero.Items.getAsync(searchResults), derefAnnotations && (items = items.map(itm => {
        return itm.itemType === "annotation" && itm?.['parentItem']?.["parentItem"] ? itm?.["parentItem"]?.["parentItem"] : itm;
      })), Zotero.debug("从保存的搜索获取: " + savedSearch.name), selectionType = "保存的搜索", {
        'items': [...new Set(items)],
        'selectionType': selectionType,
        'name': savedSearch.name,
        'link': Zotero.AI4Paper.getLinkBySelecttionType(selectionType, savedSearch)
      };
    }
    var libraryID = ZoteroPane.getSelectedLibraryID();
    if (libraryID) {
      var library = Zotero.Libraries.get(libraryID);
      items = await Zotero.Items.getAll(libraryID);
      if (library.isGroup) {
        return Zotero.debug("从群组获取"), selectionType = '群组', {
          'items': items,
          'selectionType': selectionType,
          'name': library.name,
          'link': Zotero.AI4Paper.getLinkBySelecttionType(selectionType, libraryID)
        };
      } else {
        if (library.libraryType === "user") {
          return Zotero.debug("从文库获取"), selectionType = '我的文库', {
            'items': items,
            'selectionType': selectionType,
            'name': library.name,
            'link': Zotero.AI4Paper.getLinkBySelecttionType(selectionType, libraryID)
          };
        } else {
          if (library.libraryType === "feed") return Zotero.debug("从 RSS 订阅获取"), selectionType = "RSS 订阅", {
            'items': items,
            'selectionType': selectionType,
            'name': library.name,
            'link': Zotero.AI4Paper.getLinkBySelecttionType(selectionType, libraryID)
          };
        }
      }
    }
    return {
      'items': items
    };
  },
  'getAllItemsRecursively': async function (collection) {
    !collection && (collection = ZoteroPane.getSelectedCollection());
    let childItems = collection.getChildItems(),
      childCollections = collection.getChildCollections();
    for (let childColl of childCollections) {
      let subItems = await Zotero.AI4Paper.getAllItemsRecursively(childColl);
      childItems = childItems.concat(subItems);
    }
    return childItems;
  },
  'getLinkBySelecttionType': function (selectionType, selectionObj) {
    let link;
    if (selectionType === "我的文库") {
      link = 'zotero://select/library/user';
    } else {
      if (selectionType === '群组') link = 'zotero://select/library/group/' + selectionObj;else {
        if (selectionType === "RSS 订阅") {
          link = "zotero://select/library/feed/" + selectionObj;
        } else {
          if (['分类', "群组中的分类"].includes(selectionType)) link = Zotero.AI4Paper.getSelectedCollectionLink(selectionObj);else selectionType === "保存的搜索" && (link = Zotero.AI4Paper.getSelectedSavedSearchLink(selectionObj));
        }
      }
    }
    return link;
  },
  'onClickButton_Translate': async function (selectedText) {
    if (!selectedText) return false;
    let tabID = Zotero_Tabs._selectedID;
    const reader = Zotero.Reader.getByTabID(tabID);
    if (!reader) {
      return;
    }
    let prevSelectedText = Zotero.Prefs.get("ai4paper.selectedtexttrans");
    Zotero.Prefs.get("ai4paper.translationcrossparagraphs") && (selectedText = '' + (prevSelectedText ? prevSelectedText + '\x20' : '') + selectedText);
    Zotero.AI4Paper.translateSourceText = selectedText;
    if (Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      var sidePaneWin;
      if (window.document.getElementById('ai4paper-translate-readersidepane')) {
        sidePaneWin = window.document.getElementById('ai4paper-translate-readersidepane').contentWindow;
        sidePaneWin && (sidePaneWin.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = selectedText, sidePaneWin.document.getElementById("ai4paper-translate-readerSidePane-response").value = '', sidePaneWin.document.getElementById("ai4paper-translate-readerSidePane-response").placeholder = '这里显示翻译结果');
      }
    }
    Zotero.AI4Paper.updateTranslationPopupTextAreaPlaceHolder();
    Zotero.AI4Paper.translationEngineTask(selectedText, "onSelect");
  },
  'translationEngineTask': async function (sourceText, taskType, annotationItem) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    let defaultEngine = '火山🆓';
    try {
      if (taskType === "onSelect") {
        let engineName = Zotero.Prefs.get('ai4paper.selectedtexttransengine');
        if (!Object.keys(Zotero.AI4Paper.translationServiceList()).includes(engineName)) {
          engineName = defaultEngine;
          Zotero.Prefs.set("ai4paper.selectedtexttransengine", defaultEngine);
        }
        if (["百度🔑", "百度垂直🔑", "百度大模型🔑"].includes(engineName)) await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[engineName].method.transSelectedText](sourceText, engineName);else {
          if (engineName === "GPT🔑") {
            let openAIService = Zotero.Prefs.get("ai4paper.translationOpenAIService");
            if (openAIService.includes('GPT\x20自定')) for (let customKey of Object.keys(Zotero.AI4Paper.gptCustom_numEmoji)) {
              openAIService === "GPT 自定 " + Zotero.AI4Paper.gptCustom_numEmoji[customKey] && (await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[engineName][openAIService].method.transSelectedText](sourceText, customKey));
            } else await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[engineName][openAIService].method.transSelectedText](sourceText);
          } else await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[engineName].method.transSelectedText](sourceText);
        }
      } else {
        if (taskType === "vocabulary") {
          let vocabEngine = Zotero.Prefs.get('ai4paper.vocabularybooktransengine');
          !Object.keys(Zotero.AI4Paper.translationServiceList()).includes(vocabEngine) && (vocabEngine = defaultEngine, Zotero.Prefs.set("ai4paper.vocabularybooktransengine", defaultEngine));
          ['百度🔑', "百度垂直🔑", '百度大模型🔑'].includes(vocabEngine) ? await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[vocabEngine].method.transVocabulary](annotationItem, sourceText, vocabEngine) : await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[vocabEngine].method.transVocabulary](annotationItem, sourceText);
        }
      }
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'translationEngineTask_annotationText': async function (annotation, mode) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    let defaultEngine = "火山🆓";
    try {
      let engineName = Zotero.Prefs.get("ai4paper.annotationTranslationEngine");
      !Object.keys(Zotero.AI4Paper.translationServiceList()).includes(engineName) && (engineName = defaultEngine, Zotero.Prefs.set('ai4paper.annotationTranslationEngine', defaultEngine));
      if (['百度🔑', "百度垂直🔑", '百度大模型🔑'].includes(engineName)) await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[engineName].method.transAnnotation](annotation, mode, engineName);else {
        if (engineName === "GPT🔑") {
          let openAIService = Zotero.Prefs.get("ai4paper.translationOpenAIService");
          if (openAIService.includes("GPT 自定")) {
            for (let customKey of Object.keys(Zotero.AI4Paper.gptCustom_numEmoji)) {
              openAIService === "GPT 自定 " + Zotero.AI4Paper.gptCustom_numEmoji[customKey] && (await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[engineName][openAIService].method.transAnnotation](annotation, mode, customKey));
            }
          } else await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[engineName][openAIService].method.transAnnotation](annotation, mode);
        } else await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[engineName].method.transAnnotation](annotation, mode);
      }
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'translationEngineTask_title_abstract': async function (item, field) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    let defaultEngine = "火山🆓";
    try {
      let engineName = Zotero.Prefs.get("ai4paper.titleabstransengine");
      !Object.keys(Zotero.AI4Paper.translationServiceList()).includes(engineName) && (engineName = defaultEngine, Zotero.Prefs.set("ai4paper.titleabstransengine", defaultEngine));
      ["百度🔑", "百度垂直🔑", "百度大模型🔑"].includes(engineName) ? (await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[engineName].method.transField](item, field, engineName), await new Promise(resolve => setTimeout(resolve, 0x4b0))) : (await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[engineName].method.transField](item, field), await new Promise(resolve => setTimeout(resolve, 0x12c)));
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'updateUniversalQuoteLink': async function (annotation) {
    let reader = this.getCurrentReader();
    if (!reader) return;
    if (!reader._state.sidebarOpen) return Zotero.Prefs.get('ai4paper.enableannotationsvginFloatingWindow') && (await Zotero.AI4Paper.updateUniversalQuoteLink_floatingWindow(reader, annotation)), false;
    if (!Zotero.Prefs.get("ai4paper.enableannotationsvgVisitUniversalQuoteLink")) return;
    const readerDoc = reader._iframeWindow.document;
    let annotKey = annotation.key,
      featureKey = "enableannotationsvgVisitUniversalQuoteLink",
      buttonId = "zoteroone-annotation-button-" + featureKey + '-' + annotKey,
      comment = '' + annotation.annotationComment;
    if (!comment || !Zotero.AI4Paper.hasUniversalQuoteLink(comment)) {
      readerDoc.querySelectorAll('#' + buttonId).forEach(el => el.remove());
      return;
    }
    let waitCount = 0x0;
    while (!readerDoc.querySelector("[data-sidebar-annotation-id=\"" + annotation.key + '\x22]')) {
      if (waitCount >= 0x190) {
        Zotero.debug('AI4Paper:\x20Waiting\x20for\x20annotation\x20failed');
        return;
      }
      await Zotero.Promise.delay(0x5);
      waitCount++;
    }
    let annotEl = readerDoc.querySelector("[data-sidebar-annotation-id=\"" + annotation.key + '\x22]');
    if (!annotEl) return;
    let moreBtn = annotEl.querySelector(".more");
    if (!moreBtn) return;
    Zotero.AI4Paper.createAnnotationButton_VisitUniversalQuoteLink(reader, readerDoc, annotEl, moreBtn, annotation, annotKey);
  },
  'updateUniversalQuoteLink_floatingWindow': async function (reader, annotation) {
    const readerDoc = reader._iframeWindow.document;
    let annotKey = annotation.key,
      featureKey = 'enableannotationsvgVisitUniversalQuoteLink',
      buttonId = 'zoteroone-annotation-button-' + featureKey + '-' + annotKey,
      comment = '' + annotation.annotationComment;
    if (!comment || !Zotero.AI4Paper.hasUniversalQuoteLink(comment)) {
      readerDoc.querySelectorAll('#' + buttonId).forEach(el => el.remove());
      return;
    }
    let popupEl = readerDoc.querySelector(".annotation-popup"),
      moreBtn = popupEl.querySelector(".more");
    if (!moreBtn) return;
    Zotero.AI4Paper.createAnnotationButton_VisitUniversalQuoteLink(reader, readerDoc, popupEl, moreBtn, annotation, annotKey);
  },
  'hasUniversalQuoteLink': function (commentText) {
    let startIdx = commentText.indexOf("![[");
    if (startIdx != -0x1) {
      let afterStart = commentText.substring(startIdx),
        closeBracketIdx = afterStart.indexOf(']]');
      if (closeBracketIdx != -0x1) {
        let linkText = afterStart.substring(0x0, closeBracketIdx),
          itemKeyIdx = linkText.indexOf('itemKey=');
        if (itemKeyIdx != -0x1) {
          let pageIdx = linkText.indexOf('page='),
            annotIdx = linkText.indexOf("annotation=");
          if (pageIdx != -0x1 && annotIdx != -0x1) {
            let itemKey = linkText.substring(itemKeyIdx + 0x9, pageIdx - 0x2),
              pageNum = linkText.substring(pageIdx + 0x6, annotIdx - 0x2),
              annotationID = linkText.substring(annotIdx + 0xc, linkText.length - 0x1);
            return {
              'annotationLink': "zotero://open-pdf/library/items/" + itemKey + '?page=' + pageNum + "&annotation=" + annotationID,
              'annotationID': annotationID
            };
          }
        }
      }
    }
    return false;
  },
  'registerMenuToReaderMenu': function () {
    let pluginID = Zotero.AI4Paper.id,
      eventName = "createAnnotationContextMenu";
    if (Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuCopyExternalLink") && !Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLink) {
      Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLink = eventData => {
        let {
          reader: reader,
          params: params,
          append: append
        } = eventData;
        append({
          'label': "拷贝注释",
          'onCommand'() {
            Zotero.AI4Paper && Zotero.AI4Paper.copyAnnotationLink_handler(reader, params);
          }
        });
      };
      Zotero.Reader.registerEventListener(eventName, Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLink, pluginID);
    } else !Zotero.Prefs.get('ai4paper.enableAnnotationContextMenuCopyExternalLink') && (Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(listener => !(listener.type === "createAnnotationContextMenu" && listener.handler === Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLink)), Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLink = null);
    if (Zotero.Prefs.get('ai4paper.enableAnnotationContextMenuCopyText') && !Zotero.AI4Paper._handler_readerContextMenu_copyText) {
      Zotero.AI4Paper._handler_readerContextMenu_copyText = eventData => {
        let {
          reader: reader,
          params: params,
          append: append
        } = eventData;
        append({
          'label': '拷贝注释文本',
          'onCommand'() {
            if (Zotero.AI4Paper) {
              Zotero.AI4Paper.copyAnnotationText_handler(reader, params);
            }
          }
        });
      };
      Zotero.Reader.registerEventListener(eventName, Zotero.AI4Paper._handler_readerContextMenu_copyText, pluginID);
    } else !Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuCopyText") && (Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(listener => !(listener.type === "createAnnotationContextMenu" && listener.handler === Zotero.AI4Paper._handler_readerContextMenu_copyText)), Zotero.AI4Paper._handler_readerContextMenu_copyText = null);
    if (Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuCopyExternalLinkOnly") && !Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkOnly) {
      Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkOnly = eventData => {
        let {
          reader: reader,
          params: params,
          append: append
        } = eventData;
        append({
          'label': "拷贝注释回链",
          'onCommand'() {
            if (Zotero.AI4Paper) {
              Zotero.AI4Paper.copyAnnotationLinkOnly_handler(reader, params);
            }
          }
        });
      };
      Zotero.Reader.registerEventListener(eventName, Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkOnly, pluginID);
    } else {
      if (!Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuCopyExternalLinkOnly")) {
        Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(listener => !(listener.type === 'createAnnotationContextMenu' && listener.handler === Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkOnly));
        Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkOnly = null;
      }
    }
    if (Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuCopyExternalLinkMDOnly") && !Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkMDOnly) {
      Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkMDOnly = eventData => {
        let {
          reader: reader,
          params: params,
          append: append
        } = eventData;
        append({
          'label': '拷贝注释回链（MD）',
          'onCommand'() {
            Zotero.AI4Paper && Zotero.AI4Paper.copyAnnotationLinkMD_handler(reader, params);
          }
        });
      };
      Zotero.Reader.registerEventListener(eventName, Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkMDOnly, pluginID);
    } else !Zotero.Prefs.get('ai4paper.enableAnnotationContextMenuCopyExternalLinkMDOnly') && (Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(listener => !(listener.type === "createAnnotationContextMenu" && listener.handler === Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkMDOnly)), Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkMDOnly = null);
    if (Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuOptimizeSpaces") && !Zotero.AI4Paper._handler_readerContextMenu_optimizeSpaces) {
      Zotero.AI4Paper._handler_readerContextMenu_optimizeSpaces = eventData => {
        let {
          reader: reader,
          params: params,
          append: append
        } = eventData;
        append({
          'label': "优化空格",
          'onCommand'() {
            Zotero.AI4Paper && Zotero.AI4Paper.optimizeSpaces_annotationContextMenu_handler(reader, params);
          }
        });
      };
      Zotero.Reader.registerEventListener(eventName, Zotero.AI4Paper._handler_readerContextMenu_optimizeSpaces, pluginID);
    } else !Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuOptimizeSpaces") && (Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(listener => !(listener.type === 'createAnnotationContextMenu' && listener.handler === Zotero.AI4Paper._handler_readerContextMenu_optimizeSpaces)), Zotero.AI4Paper._handler_readerContextMenu_optimizeSpaces = null);
    if (Zotero.Prefs.get('ai4paper.enableAnnotationContextMenuOptimizeSpacesInAnnotationComment') && !Zotero.AI4Paper._handler_readerContextMenu_optimizeSpacesInAnnotationComment) {
      Zotero.AI4Paper._handler_readerContextMenu_optimizeSpacesInAnnotationComment = eventData => {
        let {
          reader: reader,
          params: params,
          append: append
        } = eventData;
        append({
          'label': '优化注释评论中的空格',
          'onCommand'() {
            Zotero.AI4Paper && Zotero.AI4Paper.optimizeSpaces_annotationContextMenu_handler(reader, params, true);
          }
        });
      };
      Zotero.Reader.registerEventListener(eventName, Zotero.AI4Paper._handler_readerContextMenu_optimizeSpacesInAnnotationComment, pluginID);
    } else {
      if (!Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuOptimizeSpacesInAnnotationComment")) {
        Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(listener => !(listener.type === "createAnnotationContextMenu" && listener.handler === Zotero.AI4Paper._handler_readerContextMenu_optimizeSpacesInAnnotationComment));
        Zotero.AI4Paper._handler_readerContextMenu_optimizeSpacesInAnnotationComment = null;
      }
    }
  },
  'onClickButton_viewThumbnail': async function (readerWin) {
    let reader = this.getCurrentReader();
    if (reader._item.attachmentContentType != 'application/pdf') {
      return;
    }
    let waitCount = 0x0;
    while (!readerWin.document.querySelector("#viewThumbnail")) {
      if (waitCount >= 0xc8) {
        Zotero.debug("AI4Paper: Waiting for viewThumbnail button failed");
        return;
      }
      await Zotero.Promise.delay(0xa);
      waitCount++;
    }
    let thumbnailBtn = readerWin.document.querySelector("#viewThumbnail");
    !thumbnailBtn._onClickButton && (thumbnailBtn._onClickButton = true, thumbnailBtn.addEventListener("click", async clickEvt => {
      await Zotero.Promise.delay(0x5);
      Zotero.AI4Paper.addAnnotationButton(reader);
    }, false));
  },
  'onClickButton_viewOutline': async function (readerWin) {
    function fn11(win) {
      let expandables = win.document.querySelectorAll(".expandable");
      for (_toc of expandables) {
        if (!_toc.classList.contains('expanded')) return false;
      }
      return true;
    }
    async function fn12(win) {
      let expandables = win.document.querySelectorAll(".expandable"),
        hasExpanded = false;
      for (_toc of expandables) {
        if (!_toc.classList.contains("expanded")) {
          _toc.childNodes[0x0].click();
          await Zotero.Promise.delay(0x3);
          hasExpanded = true;
        }
      }
      hasExpanded && fn12(win);
    }
    function fn13(win) {
      let expandables = win.document.querySelectorAll(".expandable");
      for (_toc of expandables) {
        if (!_toc) {
          continue;
        }
        _toc.classList.contains("expanded") && _toc.childNodes[0x0].click();
      }
    }
    let waitCount = 0x0;
    while (!readerWin.document.querySelector('#viewOutline')) {
      if (waitCount >= 0xc8) {
        Zotero.debug('AI4Paper:\x20Waiting\x20for\x20viewOutline\x20button\x20failed');
        return;
      }
      await Zotero.Promise.delay(0xa);
      waitCount++;
    }
    let outlineBtn = readerWin.document.querySelector("#viewOutline");
    !outlineBtn._onClickButton && (outlineBtn._onClickButton = true, outlineBtn.addEventListener("click", clickEvt => {
      !fn11(readerWin) ? fn12(readerWin) : fn13(readerWin);
    }, false));
  },
  'updateAddColorLabelState': function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (!reader || !Zotero.AI4Paper.betterURL()) {
      return false;
    }
    let readerWin = reader._iframeWindow;
    this.addButtonColorLabel(readerWin);
    this.addAnnotationButtonsInFloatingWindow(readerWin);
  },
  'vocabulary2TransNote': async function (word, translation) {
    if (Zotero.AI4Paper.letDOI()) {
      Zotero.AI4Paper.CheckPDFReader() && !Zotero.Prefs.get("ai4paper.disablepdfreadertransprogresswindow") && Zotero.AI4Paper.showProgressWindow(0x1388, "【金山词霸】" + word, '' + translation.replace(/<br>/g, '\x20'), "iciba");
      if (Zotero.Prefs.get('ai4paper.translationviewerenable')) {
        await Zotero.AI4Paper.updateTransViewerVocabulary(word, translation);
      }
      if (Zotero.Prefs.get('ai4paper.translationrecordnote')) {
        let currentItem = Zotero.AI4Paper.getCurrentItem(true);
        if (currentItem) {
          var transNote = await Zotero.AI4Paper.createNoteItem_basedOnTag(currentItem, "/划词翻译");
          transNote && (await Zotero.AI4Paper.updateTransRecordNoteVocabulary(transNote, word, translation));
        }
      }
      Zotero.Prefs.get("ai4paper.translationautocopy") && Zotero.AI4Paper.copy2Clipboard(translation);
    }
  },
  'updateTransViewerVocabulary': async function (word, translation) {
    if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) {
      var noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + "</blockquote>";
    } else {
      if (Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition")) var noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + "<p>" + '👉\x20' + word + "</blockquote>";else var noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>👉 " + word + "<p>" + translation + '</blockquote>';
    }
    let viewerItem,
      viewerKey = Zotero.Prefs.get("ai4paper.translationViewerItemKey");
    viewerKey && (viewerItem = Zotero.Items.getByLibraryAndKey(0x1, viewerKey));
    if (viewerItem && viewerItem.isNote() && !viewerItem.deleted) {
      let viewerNote = viewerItem;
      if (Zotero.Prefs.get("ai4paper.translationviewerrecord")) {
        await Zotero.AI4Paper.Set2ReverseTransViewer(viewerNote);
        let existingNote = viewerNote.getNote();
        if (existingNote.indexOf("</h2>") != -0x1) {
          let h2EndIdx = existingNote.indexOf('</h2>');
          existingNote = existingNote.substring(h2EndIdx + 0x5);
        }
        Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext") ? noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + "</blockquote>" + existingNote : Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition") ? noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + "<p>" + "👉 " + word + "</blockquote>" + existingNote : noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>👉 " + word + '<p>' + translation + '</blockquote>' + existingNote;
      }
      viewerNote.setNote(noteHTML);
      viewerNote.hasTag("/翻译查看器") && (viewerNote.removeTag("/翻译查看器"), viewerNote.addTag('/AI对话历史'));
      await viewerNote.saveTx();
      Zotero.Prefs.set('ai4paper.translationViewerItemKey', viewerNote.key);
    } else {
      var search = new Zotero.Search();
      search.libraryID = Zotero.Libraries.userLibraryID;
      search.addCondition("itemType", 'is', 'note');
      search.addCondition("tag", 'is', "/AI对话历史");
      var searchResults = await search.search(),
        noteItems = await Zotero.Items.getAsync(searchResults);
      if (noteItems.length === 0x0) {
        let newNote = new Zotero.Item("note");
        newNote.addTag("/AI对话历史");
        newNote.setNote(noteHTML);
        await newNote.saveTx();
        Zotero.Prefs.set("ai4paper.translationViewerItemKey", newNote.key);
      } else {
        let firstNote = noteItems[0x0];
        if (Zotero.Prefs.get("ai4paper.translationviewerrecord")) {
          await Zotero.AI4Paper.Set2ReverseTransViewer(firstNote);
          let existingContent = firstNote.getNote();
          if (existingContent.indexOf('</h2>') != -0x1) {
            let h2EndIdx2 = existingContent.indexOf("</h2>");
            existingContent = existingContent.substring(h2EndIdx2 + 0x5);
          }
          if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + "</blockquote>" + existingContent;else {
            Zotero.Prefs.get('ai4paper.translationrecordnotesourcetextposition') ? noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + '<p>' + '👉\x20' + word + '</blockquote>' + existingContent : noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>👉 " + word + "<p>" + translation + "</blockquote>" + existingContent;
          }
        }
        firstNote.setNote(noteHTML);
        await firstNote.saveTx();
        Zotero.Prefs.set("ai4paper.translationViewerItemKey", firstNote.key);
      }
    }
  },
  'Set2ReverseTransViewer': async function (noteItem) {
    var noteContent = noteItem.getNote();
    let maxRecords = parseInt(Zotero.Prefs.get("ai4paper.gptChatHistoryViewerRecordNum"));
    if (noteContent.indexOf("🌈 AI 对话历史") != -0x1 && noteContent.indexOf('<h2\x20style=\x22color:\x20blue') != -0x1) {
      var openIndices = [],
        closeIndices = [],
        blocks = [],
        openRegex = new RegExp("<blockquote>", 'g'),
        closeRegex = new RegExp("</blockquote>", 'g');
      while (openRegex.exec(noteContent) != null && closeRegex.exec(noteContent) != null) {
        openIndices.push(openRegex.lastIndex);
        closeIndices.push(closeRegex.lastIndex);
      }
      for (i = 0x0; i < maxRecords && i < closeIndices.length; i++) {
        let block = noteContent.substring(openIndices[openIndices.length - i - 0x1] - 0xc, closeIndices[closeIndices.length - i - 0x1]);
        blocks.push(block);
      }
      let reversedNote = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2>" + blocks.join('');
      noteItem.setNote(reversedNote);
      await noteItem.saveTx();
    } else {
      if (noteContent.indexOf("🌈 AI 对话历史") != -0x1 && noteContent.indexOf("<h2 style=\"color: purple") != -0x1) {
        var openIndices = [],
          closeIndices = [],
          blocks = [],
          openRegex = new RegExp("<blockquote>", 'g'),
          closeRegex = new RegExp('</blockquote>', 'g');
        while (openRegex.exec(noteContent) != null && closeRegex.exec(noteContent) != null) {
          openIndices.push(openRegex.lastIndex);
          closeIndices.push(closeRegex.lastIndex);
        }
        for (i = 0x0; i < maxRecords && i < closeIndices.length; i++) {
          let block = noteContent.substring(openIndices[i] - 0xc, closeIndices[i]);
          blocks.push(block);
        }
        let reversedNote = '<h2\x20style=\x22color:\x20purple;\x22>🌈\x20AI\x20对话历史>>>>>>></h2>' + blocks.join('');
        noteItem.setNote(reversedNote);
        await noteItem.saveTx();
      }
    }
  },
  'updateTransRecordNoteVocabulary': async function (noteItem, word, translation) {
    Zotero.AI4Paper.Set2Reverse(noteItem);
    let existingContent = noteItem.getNote();
    if (existingContent.indexOf("</h2>") != -0x1) {
      let h2EndIdx = existingContent.indexOf('</h2>');
      existingContent = existingContent.substring(h2EndIdx + 0x5);
    }
    if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) {
      if (Zotero.Prefs.get("ai4paper.translationrecordnotesinglerecord")) var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + translation + '</blockquote>';else var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + translation + "</blockquote>" + existingContent;
    } else {
      if (Zotero.Prefs.get("ai4paper.translationrecordnotesinglerecord")) {
        if (Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition")) {
          var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + translation + "<p>" + '👉\x20' + word + "</blockquote>";
        } else var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>👉 " + word + "<p>" + translation + "</blockquote>";
      } else {
        if (Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition")) var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + translation + "<p>" + "👉 " + word + '</blockquote>' + existingContent;else {
          var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>👉 " + word + "<p>" + translation + "</blockquote>" + existingContent;
        }
      }
    }
    noteItem.setNote(noteHTML);
    await noteItem.saveTx();
    Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") && Zotero.AI4Paper.itemModification2OB();
  },
  'Set2Reverse': async function (noteItem) {
    var noteContent = noteItem.getNote();
    if (noteContent.indexOf('📑\x20翻译正序') != -0x1) {
      var openIndices = [],
        closeIndices = [],
        blocks = [],
        openRegex = new RegExp('<blockquote>', 'g'),
        closeRegex = new RegExp("</blockquote>", 'g');
      while (openRegex.exec(noteContent) != null && closeRegex.exec(noteContent) != null) {
        openIndices.push(openRegex.lastIndex);
        closeIndices.push(closeRegex.lastIndex);
      }
      for (i = 0x0; i < closeIndices.length; i++) {
        let block = noteContent.substring(openIndices[openIndices.length - i - 0x1] - 0xc, closeIndices[closeIndices.length - i - 0x1]);
        blocks.push(block);
      }
      let reversedNote = '<h2\x20style=\x22color:\x20purple;\x22>📑\x20翻译倒序>>>>>>></h2>' + blocks.join('');
      noteItem.setNote(reversedNote);
      await noteItem.saveTx();
    }
  },
  'trans2ViewerANDRecord': async function (sourceText, translation) {
    if (Zotero.AI4Paper.letDOI()) {
      Zotero.Prefs.get("ai4paper.translationviewerenable") && (await Zotero.AI4Paper.updateTransViewer(sourceText, translation));
      if (Zotero.Prefs.get('ai4paper.translationrecordnote')) {
        let currentItem = Zotero.AI4Paper.getCurrentItem(true);
        if (currentItem) {
          var transNote = await Zotero.AI4Paper.createNoteItem_basedOnTag(currentItem, '/划词翻译');
          if (transNote) {
            await Zotero.AI4Paper.updateTransRecordNote(transNote, sourceText, translation);
          }
        }
      }
    }
  },
  'updateTransViewer': async function (sourceText, translation) {
    sourceText = Zotero.AI4Paper.sliceGPTUserQuestion(sourceText);
    var noteHTML;
    Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext") ? noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + '</blockquote>' : Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition") ? noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + "<p>" + sourceText + '</blockquote>' : noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + sourceText + "<p>" + translation + "</blockquote>";
    let viewerItem,
      viewerKey = Zotero.Prefs.get('ai4paper.translationViewerItemKey');
    viewerKey && (viewerItem = Zotero.Items.getByLibraryAndKey(0x1, viewerKey));
    if (viewerItem && viewerItem.isNote() && !viewerItem.deleted) {
      let viewerNote = viewerItem;
      if (Zotero.Prefs.get("ai4paper.translationviewerrecord")) {
        await Zotero.AI4Paper.Set2ReverseTransViewer(viewerNote);
        let existingContent = viewerNote.getNote();
        if (existingContent.indexOf("</h2>") != -0x1) {
          let h2EndIdx = existingContent.indexOf('</h2>');
          existingContent = existingContent.substring(h2EndIdx + 0x5);
        }
        if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + '</blockquote>' + existingContent;else {
          Zotero.Prefs.get('ai4paper.translationrecordnotesourcetextposition') ? noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + '<p>' + sourceText + "</blockquote>" + existingContent : noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + sourceText + "<p>" + translation + '</blockquote>' + existingContent;
        }
      }
      viewerNote.setNote(noteHTML);
      viewerNote.hasTag("/翻译查看器") && (viewerNote.removeTag("/翻译查看器"), viewerNote.addTag('/AI对话历史'));
      await viewerNote.saveTx();
      Zotero.Prefs.set("ai4paper.translationViewerItemKey", viewerNote.key);
    } else {
      var search = new Zotero.Search();
      search.libraryID = Zotero.Libraries.userLibraryID;
      search.addCondition('itemType', 'is', 'note');
      search.addCondition("tag", 'is', "/AI对话历史");
      var searchResults = await search.search(),
        noteItems = await Zotero.Items.getAsync(searchResults);
      if (noteItems.length === 0x0) {
        let newNote = new Zotero.Item("note");
        newNote.addTag("/AI对话历史");
        newNote.setNote(noteHTML);
        await newNote.saveTx();
        Zotero.Prefs.set('ai4paper.translationViewerItemKey', newNote.key);
      } else {
        let firstNote = noteItems[0x0];
        if (Zotero.Prefs.get("ai4paper.translationviewerrecord")) {
          await Zotero.AI4Paper.Set2ReverseTransViewer(firstNote);
          let existingContent = firstNote.getNote();
          if (existingContent.indexOf("</h2>") != -0x1) {
            let h2EndIdx = existingContent.indexOf("</h2>");
            existingContent = existingContent.substring(h2EndIdx + 0x5);
          }
          if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + '</blockquote>' + existingContent;else {
            Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition") ? noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + translation + "<p>" + sourceText + "</blockquote>" + existingContent : noteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + sourceText + '<p>' + translation + "</blockquote>" + existingContent;
          }
        }
        firstNote.setNote(noteHTML);
        await firstNote.saveTx();
        Zotero.Prefs.set("ai4paper.translationViewerItemKey", firstNote.key);
      }
    }
  },
  'sliceGPTUserQuestion': function (questionText) {
    if (questionText.indexOf("便于 Obsidian Dataview 插件调用") != -0x1) {
      let contentIdx = questionText.indexOf('文献内容如下所示:');
      if (contentIdx != -0x1) return questionText.substring(0x0, contentIdx + 0x9) + "\n[此处省略全文...]";
    }
    return questionText;
  },
  'updateTransRecordNote': async function (noteItem, sourceText, translation) {
    Zotero.AI4Paper.Set2Reverse(noteItem);
    let existingContent = noteItem.getNote();
    if (existingContent.indexOf("</h2>") != -0x1) {
      let h2EndIdx = existingContent.indexOf("</h2>");
      existingContent = existingContent.substring(h2EndIdx + 0x5);
    }
    if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) {
      if (Zotero.Prefs.get('ai4paper.translationrecordnotesinglerecord')) {
        var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + translation + '</blockquote>';
      } else var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + translation + "</blockquote>" + existingContent;
    } else {
      if (Zotero.Prefs.get('ai4paper.translationrecordnotesinglerecord')) {
        if (Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition")) {
          var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + translation + '<p>' + sourceText + "</blockquote>";
        } else var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + sourceText + "<p>" + translation + '</blockquote>';
      } else {
        if (Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition")) {
          var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + translation + "<p>" + sourceText + "</blockquote>" + existingContent;
        } else var noteHTML = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + sourceText + "<p>" + translation + "</blockquote>" + existingContent;
      }
    }
    noteItem.setNote(noteHTML);
    await noteItem.saveTx();
    Zotero.Prefs.get('ai4paper.obsidianautoupdatenotes') && Zotero.AI4Paper.itemModification2OB();
  },
  'toogleSortingTrans': async function () {
    var recentWin = Services.wm.getMostRecentWindow("navigator:browser");
    if (!recentWin.ZoteroContextPane.activeEditor) return window.alert("请先在 Zotero 内置阅读器右侧打开笔记附件！"), false;else {
      let noteTag = '',
        tags = recentWin.ZoteroContextPane.activeEditor._item.getTags(),
        noteItem = Zotero.Items.get(recentWin.ZoteroContextPane.activeEditor._item.id);
      if (tags.length) for (let tagObj of tags) {
        if (tagObj.tag === '/划词翻译') noteTag = '/划词翻译';else {
          if (tagObj.tag === "/ChatGPT") noteTag = "/ChatGPT";else {
            if (tagObj.tag === '/AI对话历史') noteTag = '/AI对话历史';else {
              if (tagObj.tag === "/翻译查看器") {
                noteTag = "/翻译查看器";
              }
            }
          }
        }
      }
      if (noteTag === '') return window.alert("❌ 您打开的笔记附件不是【划词翻译】或【AI 对话历史】或【GPT 笔记】！"), false;else {
        if (noteTag === '/翻译查看器') return window.alert("❌ 自 AI4paper v6.3.7 版本起，【翻译查看器】已升级为【AI 对话历史】。请删除原【翻译查看器】，再使用本功能。"), false;else {
          if (noteTag === '/划词翻译') Zotero.AI4Paper.toogleSortingTransRecord(noteItem);else {
            if (noteTag === "/ChatGPT") Zotero.AI4Paper.toogleSortingChatGPTRecord(noteItem);else noteTag === "/AI对话历史" && Zotero.AI4Paper.toogleSortingTransViewer(noteItem);
          }
        }
      }
    }
  },
  'toogleSortingTransRecord': async function (noteItem) {
    if (noteItem) {
      var noteContent = noteItem.getNote();
      if (noteContent.indexOf('<blockquote>') === -0x1 && noteContent.indexOf("</blockquote>") === -0x1) return window.alert("您在 AI4paper v2.8.0 以前版本中生成的翻译笔记，不再支持此命令！"), false;
      var openIndices = [],
        closeIndices = [],
        blocks = [],
        openRegex = new RegExp('<blockquote>', 'g'),
        closeRegex = new RegExp("</blockquote>", 'g');
      while (openRegex.exec(noteContent) != null && closeRegex.exec(noteContent) != null) {
        openIndices.push(openRegex.lastIndex);
        closeIndices.push(closeRegex.lastIndex);
      }
      for (i = 0x0; i < closeIndices.length; i++) {
        let block = noteContent.substring(openIndices[openIndices.length - i - 0x1] - 0xc, closeIndices[closeIndices.length - i - 0x1]);
        blocks.push(block);
      }
      if (noteContent.indexOf("📑 翻译倒序") != -0x1) {
        let ascendingNote = "<h2 style=\"color: blue;\">📑 翻译正序>>>>>>></h2>" + blocks.join('');
        noteItem.setNote(ascendingNote);
        await noteItem.saveTx();
      } else {
        if (noteContent.indexOf("📑 翻译正序") != -0x1) {
          let descendingNote = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2>" + blocks.join('');
          noteItem.setNote(descendingNote);
          await noteItem.saveTx();
        }
      }
    }
  },
  'toogleSortingChatGPTRecord': async function (noteItem) {
    if (noteItem) {
      var noteContent = noteItem.getNote();
      if (noteContent.indexOf("<blockquote>") === -0x1 && noteContent.indexOf("</blockquote>") === -0x1) return window.alert('您在\x20Zotero\x20One\x20v2.8.0\x20以前版本中生成的翻译笔记，不再支持此命令！'), false;
      var openIndices = [],
        closeIndices = [],
        blocks = [],
        openRegex = new RegExp("<blockquote>", 'g'),
        closeRegex = new RegExp("</blockquote>", 'g');
      while (openRegex.exec(noteContent) != null && closeRegex.exec(noteContent) != null) {
        openIndices.push(openRegex.lastIndex);
        closeIndices.push(closeRegex.lastIndex);
      }
      for (i = 0x0; i < closeIndices.length; i++) {
        let block = noteContent.substring(openIndices[openIndices.length - i - 0x1] - 0xc, closeIndices[closeIndices.length - i - 0x1]);
        blocks.push(block);
      }
      if (noteContent.indexOf('🤖️\x20ChatGPT\x20倒序') != -0x1) {
        let ascendingNote = "<h2 style=\"color: blue;\">🤖️ ChatGPT 正序>>>>>>></h2>" + blocks.join('');
        noteItem.setNote(ascendingNote);
        await noteItem.saveTx();
      } else {
        if (noteContent.indexOf("🤖️ ChatGPT 正序") != -0x1) {
          let descendingNote = "<h2 style=\"color: #00ae89;\">🤖️ ChatGPT 倒序>>>>>>></h2>" + blocks.join('');
          noteItem.setNote(descendingNote);
          await noteItem.saveTx();
        }
      }
    }
  },
  'toogleSortingTransViewer': async function (noteItem) {
    if (noteItem) {
      var noteContent = noteItem.getNote();
      if (noteContent.indexOf("<blockquote>") === -0x1 && noteContent.indexOf("</blockquote>") === -0x1) {
        return window.alert("您在 AI4paper v2.8.0 以前版本中生成的翻译笔记，不再支持此命令！"), false;
      }
      var openIndices = [],
        closeIndices = [],
        blocks = [],
        openRegex = new RegExp("<blockquote>", 'g'),
        closeRegex = new RegExp("</blockquote>", 'g');
      while (openRegex.exec(noteContent) != null && closeRegex.exec(noteContent) != null) {
        openIndices.push(openRegex.lastIndex);
        closeIndices.push(closeRegex.lastIndex);
      }
      for (i = 0x0; i < closeIndices.length; i++) {
        let block = noteContent.substring(openIndices[openIndices.length - i - 0x1] - 0xc, closeIndices[closeIndices.length - i - 0x1]);
        blocks.push(block);
      }
      if (noteContent.indexOf("🌈 AI 对话历史") != -0x1 && noteContent.indexOf("<h2 style=\"color: purple") != -0x1) {
        let ascendingNote = '<h2\x20style=\x22color:\x20blue;\x22>🌈\x20AI\x20对话历史>>>>>>></h2>' + blocks.join('');
        noteItem.setNote(ascendingNote);
        await noteItem.saveTx();
      } else {
        if (noteContent.indexOf("🌈 AI 对话历史") != -0x1 && noteContent.indexOf("<h2 style=\"color: blue") != -0x1) {
          let descendingNote = '<h2\x20style=\x22color:\x20purple;\x22>🌈\x20AI\x20对话历史>>>>>>></h2>' + blocks.join('');
          noteItem.setNote(descendingNote);
          await noteItem.saveTx();
        }
      }
    }
  },
  'openTransViewer': async function () {
    var defaultNoteHTML = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2>",
      search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("itemType", 'is', "note");
    search.addCondition("tag", 'is', "/AI对话历史");
    var searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length === 0x0) {
      let newNote = new Zotero.Item("note");
      Zotero.Prefs.set("ai4paper.translationViewerItemKey", newNote.key);
      newNote.addTag('/AI对话历史');
      newNote.setNote(defaultNoteHTML);
      await newNote.saveTx();
      ZoteroPane_Local.openNoteWindow(newNote.itemID);
    } else {
      let firstNote = noteItems[0x0];
      Zotero.Prefs.set("ai4paper.translationViewerItemKey", firstNote.key);
      ZoteroPane_Local.openNoteWindow(firstNote.itemID);
    }
  },
  'annotationTextTrans': async function (annotation, mode) {
    let annotText = annotation.annotationText;
    if (Zotero.AI4Paper.isChineseText(annotText)) {
      return false;
    }
    if (Zotero.Prefs.get("ai4paper.translationvocabularyfirst")) {
      if (annotText.indexOf('\x20') === -0x1) {
        annotText = annotText.trim();
        annotText = annotText.toLowerCase();
        annotText = annotText.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
        annotText = annotText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
        annotText = annotText.replace(/[0-9]/g, '');
        let vocabResult = await Zotero.AI4Paper.vocabularySearchAnnotationTrans(annotText);
        if (vocabResult && vocabResult != -0x1) return Zotero.AI4Paper.addTrans2AnnotationComment(annotation, vocabResult, mode), -0x1;
      }
    }
    Zotero.AI4Paper.translationEngineTask_annotationText(annotation, mode);
  },
  'addTrans2AnnotationComment': async function (annotation, translation, mode) {
    let comment = '' + annotation.annotationComment,
      separator = Zotero.Prefs.get("ai4paper.annotationTranslationSeparator").trim() ? Zotero.Prefs.get('ai4paper.annotationTranslationSeparator') : "【👈 译】";
    if (comment === "null") {
      annotation.annotationComment = '' + translation + separator;
    } else comment != "null" && comment.indexOf(separator) === -0x1 && (annotation.annotationComment = '' + translation + separator + annotation.annotationComment);
    await annotation.saveTx();
  },
  'scite': function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID));
    } else {
      var item = ZoteroPane.getSelectedItems()[0x0];
    }
    if (!item.isRegularItem()) {
      return window.alert('请您选择一个常规条目！'), false;
    }
    let doi = item.getField("DOI");
    if (doi === undefined || doi === '') {
      return window.alert("当前文献缺失 DOI 信息！"), false;
    }
    let sciteURL = 'https://scite.ai/visualizations/' + doi;
    ZoteroPane.loadURI(sciteURL);
  },
  'relatedPapers': function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID));
    } else var item = ZoteroPane.getSelectedItems()[0x0];
    if (!item.isRegularItem()) {
      return window.alert("请您选择一个常规条目！"), false;
    }
    let doi = item.getField("DOI");
    if (!doi) window.alert('当前文献缺失\x20DOI\x20信息！');else {
      let semanticURL = "https://api.semanticscholar.org/" + doi;
      ZoteroPane.loadURI(semanticURL);
    }
  },
  'connectedPapers': function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
      }
    } else var item = ZoteroPane.getSelectedItems()[0x0];
    if (!item.isRegularItem()) {
      return window.alert("请您选择一个常规条目！"), false;
    }
    let doi = item.getField('DOI');
    if (doi === undefined || doi === '') return window.alert("当前文献缺失 DOI 信息！"), false;
    let connPapersURL = "https://connectedpapers.com/api/redirect/doi/" + doi;
    ZoteroPane.loadURI(connPapersURL);
  },
  'getItemsForAnnotationSImport': function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        let parentID = itemID,
          title = item.getField("title");
        return {
          'item_Title': title,
          'item_ID': parentID
        };
      } else return Services.prompt.alert(window, "❌ 温馨提示：", '您选的\x20PDF\x20无父条目，请创建父条目或重新选择！'), false;
    } else {
      var item = ZoteroPane.getSelectedItems()[0x0];
    }
    if (item === undefined) {
      return Services.prompt.alert(window, "❌ 温馨提示：", '请选择一个常规条目！'), false;
    }
    if (item.isRegularItem()) {
      let regularItemID = item.itemID,
        regularItemTitle = item.getField("title");
      return {
        'item_Title': regularItemTitle,
        'item_ID': regularItemID
      };
    } else return Services.prompt.alert(window, "❌ 温馨提示：", "您选择的不是常规条目！"), false;
  },
  'togglePaneDisplay': function (paneId, action, keepSplitter) {
    var paneEl = ZoteroPane.document.getElementById(paneId + "-pane"),
      splitterSuffix;
    if (paneId == 'zotero-item') {
      splitterSuffix = "s-splitter";
    } else splitterSuffix = "-splitter";
    var splitterEl = ZoteroPane.document.getElementById(paneId + splitterSuffix);
    switch (action) {
      case "toggle":
        if (paneEl.collapsed) {
          this.togglePaneDisplay(paneId, "show", keepSplitter);
          if (paneId == "zotero-collections") {
            let collPaneBtn = window.document.querySelector("#zotero-if-items-toolbar-button-collectionPaneDisplay");
            if (collPaneBtn) {
              collPaneBtn.innerHTML = Zotero.AI4Paper.svg_icon_20px.collectionpanedisplayToolBarButton;
            }
          }
          if (paneId == "zotero-item") {
            let itemPaneBtn = window.document.querySelector("#zotero-if-items-toolbar-button-itemPaneDisplay");
            if (itemPaneBtn) {
              itemPaneBtn.innerHTML = Zotero.AI4Paper.svg_icon_20px.itempanedisplayToolBarButton;
            }
          }
        } else {
          this.togglePaneDisplay(paneId, "hide", keepSplitter);
          if (paneId == "zotero-collections") {
            let collPaneBtn2 = window.document.querySelector('#zotero-if-items-toolbar-button-collectionPaneDisplay');
            collPaneBtn2 && (collPaneBtn2.innerHTML = Zotero.AI4Paper.svg_icon_20px.collectionpanedisplayToolBarButton_expand);
          }
          if (paneId == "zotero-item") {
            let itemPaneBtn2 = window.document.querySelector('#zotero-if-items-toolbar-button-itemPaneDisplay');
            itemPaneBtn2 && (itemPaneBtn2.innerHTML = Zotero.AI4Paper.svg_icon_20px.itempanedisplayToolBarButton_expand);
          }
        }
        break;
      case "show":
        paneEl.collapsed = false;
        !keepSplitter && splitterEl.removeAttribute('state');
        break;
      case 'hide':
        paneEl.collapsed = true;
        splitterEl.setAttribute("state", "collapsed");
        break;
    }
  },
  'updateDatabase_ZoteroOnePrefs': function () {
    Zotero.AI4Paper.updateDatabase_fileshistory();
    Zotero.AI4Paper.updateDatabase_gptNotesAttachItems();
    Zotero.AI4Paper.updateDatabase_refsCollection();
  },
  'updateDatabase_fileshistory': function () {
    let historyStr = Zotero.Prefs.get("ai4paper.fileshistory"),
      entries = historyStr.split("😊🎈🍓"),
      updatedEntries = [];
    for (let entry of entries) {
      let idIdx = entry.indexOf('🆔');
      if (idIdx != -0x1) {
        let prefix = entry.substring(0x0, idIdx + 0x3),
          idPart = entry.substring(idIdx + 0x3),
          foundItem = Zotero.AI4Paper.findItemByIDORKey(idPart);
        foundItem && updatedEntries.push('' + prefix + foundItem.key);
      }
    }
    updatedEntries.length && (Zotero.Prefs.set("ai4paper.fileshistory", updatedEntries.join("😊🎈🍓")), Zotero.AI4Paper.showProgressWindow(0xbb8, "升级【设置】数据库", "✅【最近打开】设置数据库升级完成！"));
  },
  'updateDatabase_gptNotesAttachItems': function () {
    let attachItemsStr = Zotero.Prefs.get('ai4paper.gptNotesAttachItems'),
      updatedEntries = [];
    for (let entry of attachItemsStr.split('\x0a')) {
      let idIdx = entry.indexOf('🆔');
      if (idIdx != -0x1) {
        let prefix = entry.substring(0x0, idIdx + 0x3),
          idPart = entry.substring(idIdx + 0x3),
          foundItem = Zotero.AI4Paper.findItemByIDORKey(idPart);
        foundItem && updatedEntries.push('' + prefix + foundItem.key);
      }
    }
    updatedEntries.length && (Zotero.Prefs.set('ai4paper.gptNotesAttachItems', updatedEntries.join('\x0a')), Zotero.AI4Paper.showProgressWindow(0xbb8, "升级【设置】数据库", '✅【GPT\x20笔记绑定条目】设置数据库升级完成！'));
  },
  'copyTranslationAPIKeys': function () {
    Zotero.AI4Paper.copy2Clipboard(JSON.stringify(Zotero.AI4Paper.translationServiceList(), null, 0x2));
    Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝全部【翻译 API-Keys】", "✅ 拷贝成功！共【" + Object.keys(Zotero.AI4Paper.translationServiceList()).length + "】条。");
  },
  'copyGPTAPIKeys': function () {
    Zotero.AI4Paper.copy2Clipboard(JSON.stringify(Zotero.AI4Paper.gptServiceList(), null, 0x2));
    Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝全部【GPT API-Keys】", "✅ 拷贝成功！共【" + Object.keys(Zotero.AI4Paper.gptServiceList()).length + "】条。");
  },
  'openPluginSettingsAndFocusElement': async function (elementId, prefPaneId = "zotero-prefpane-ai4paper") {
    const prefsWin = await Zotero.Utilities.Internal.openPreferences(prefPaneId);
    await new Promise(resolve => {
      prefsWin.document.readyState === "complete" ? resolve() : prefsWin.addEventListener("load", resolve, {
        'once': true
      });
    });
    await Zotero.Promise.delay(0x64);
    const targetEl = prefsWin.document.getElementById(elementId);
    if (targetEl) {
      targetEl.scrollIntoView({
        'behavior': "smooth",
        'block': "start"
      });
      targetEl.focus();
    }
    return prefsWin;
  },
  'collectionsToolbar_buttons': ["collapseCollections"],
  'itemsToolbar_buttons': ["collectionPaneDisplay", "itemPaneDisplay", 'collectionitemPaneDisplay', "pinAttachments", 'batchAIInterpret', "go2favoritecollection", "preferences", "zoteroColorScheme", 'openwith', "fileshistory", "obsidiannote", "tagscardnotes", "archive", "showFile", "chatWithNewBing", "immersiveTranslate", "copyPDF"],
  'annotation_buttons': ['enableannotationsvgOptimizeSpaces', 'enableannotationsvgSetCommentTemplate', 'enableannotationsvghead', "enableannotationsvgtranslate", "enableannotationsvgtagsselect", "enableannotationsvgblockquotelink", "enableannotationsvgaudioplay", "enableannotationsvgAddWordsToEudic", "enableannotationsvguploadimage", "enableannotationsvgobsidianblock", "enableannotationsvgVisitUniversalQuoteLink"],
  'messageQuickButtons': ["Go2MessageTop", "CopyMessage", "CopyMessageSourceText", "SaveMessages", "ModifyUserMessage", 'UpdateAssistantMessage', "AddMessage2SelectedAnnotation", "CreateAIReadingNoteItem"],
  'chatButtons': ["ClearChat", "AIAnalysis", 'ImportFulltext', "ImportAbstract", 'AddNotes', "ImportAIReading", "LocateAIReadingNotes"],
  '_shortCuts_items': ["AddAnnotationTag", "CopyBlockQuoteLink", "SetAnnotationHead", "CardNotesSearch", 'AddRelatedRefs', "ZoteroAdvancedSearch", "CopyAnnotationLink", 'CopyAnnotationLinkOnly', "CopyAnnotationLinkMD", "CopyAnnotationText", 'CollapseLeftSidePane', "CollapseRightSidePane", "CopyPDFAttachmentsLink", "CopyPDF", "OpenWith", "ChatwithNewbing", 'ImmersiveTranslate', 'UniversalImmersiveTranslate', "AttachNewFile", "FilesHistory", "WorkSpace", 'RenameAttachments', "Archive", "SplitHorizontally", "SplitVertically", 'OddSpreads', "StarOne", "StarTwo", 'StarThree', "StarFour", "StarFive", "StarClear", "PaperAI", "LocateAIReadingNotes", "GetFullText", "ChangeGPTChatMode", "TagCardNotes", "ObsidianNote", "ObsidianBlock", 'SetCommentTemplate', 'LocateItemInPapersMatrix', "SearchCollectionInPapersMatrix"],
  'progressWindowIcon': {},
  'update_svg_icons': function (rootDoc) {
    try {
      Object.keys(Zotero.AI4Paper.svg_icon_20px).forEach(iconKey => {
        rootDoc.querySelectorAll(".svg-container-" + iconKey).forEach(container => {
          container.innerHTML = Zotero.AI4Paper.svg_icon_20px?.[iconKey];
        });
      });
    } catch (e) {
      Zotero.debug(e);
    }
    try {
      Object.keys(Zotero.AI4Paper.svg_icon_16px).forEach(iconKey => {
        rootDoc.querySelectorAll('.svg-container-' + iconKey).forEach(container => {
          container.innerHTML = Zotero.AI4Paper.svg_icon_16px?.[iconKey];
        });
      });
    } catch (e) {
      Zotero.debug(e);
    }
  }
};
