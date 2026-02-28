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
    id: _0x4206ec,
    version: _0x2c657a,
    rootURI: _0x471b0e
  }) {
    if (this.initialized) return;
    this.id = _0x4206ec;
    this.version = _0x2c657a;
    this.rootURI = _0x471b0e;
    this.initialized = true;
    this.window = this.getGlobal("window");
    this._notifierID = Zotero.Notifier.registerObserver(this.notifyCallback, ["item", "tab", "item-tag", "file", 'collection']);
    Zotero.AI4Paper.injectScripts(true);
    this.initParam();
    this.setPrefs();
    this.setGlobalParam();
    window.addEventListener("unload", function (param2) {
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
  },
  'injectScripts': function (param3) {
    try {
      let var2 = Zotero.getMainWindow().document;
      var2.querySelectorAll('#zoteroone-injectedIframe').forEach(_0x2019ef => _0x2019ef.remove());
      if (!param3) return;
      let var3 = var2.createElement("iframe");
      var3.id = "zoteroone-injectedIframe";
      var3.style.display = "none";
      var3.src = "chrome://ai4paper/content/selectionDialog/injectScripts.html";
      var2.documentElement.appendChild(var3);
    } catch (_0x272975) {
      Zotero.debug(_0x272975);
    }
  },
  'updateSciHub': function () {
    let var4 = {
      'name': "Sci-Hub",
      'method': "GET",
      'url': "https://sci-hub.st/{doi}",
      'mode': 'html',
      'selector': "#pdf",
      'attribute': 'src',
      'automatic': false
    };
    var4.url = Zotero.Prefs.get('ai4paper.scihub') + "/{doi}";
    var4.automatic = Zotero.Prefs.get("ai4paper.scihubauto");
    let var5 = Zotero.Prefs.get("ai4paper.scihubswitch");
    !var5 && Zotero.Prefs.set("findPDFs.resolvers", JSON.stringify(var4));
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
      this.readerMenuItemClickEvent("remove");
      this.showZoteroNotesSection();
      this.clickEventListner_SideNavNotes("remove");
      this.changeEventListner_ZoteroColorScheme("remove");
      Zotero.Reader._unregisterEventListenerByPluginID(Zotero.AI4Paper.id);
      this.clearTimeout_Interpret();
    } catch (_0x5161de) {
      Zotero.debug(_0x5161de);
    }
  },
  'unregisterObserver': function () {
    try {
      Zotero.Notifier.unregisterObserver(this._notifierID);
    } catch (_0x3c6348) {
      Zotero.debug(_0x3c6348);
    }
  },
  'notifyCallback': {
    'notify': async function (param4, param5, param6, param7) {
      if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
      if (param4 === 'add' && param5 == 'tab') {
        let _0x42fcf1 = Zotero.Reader.getByTabID(param6[0x0]);
        Zotero.AI4Paper.addReaderButtonInit(_0x42fcf1);
        Zotero.Prefs.get('ai4paper.translationreadersidepane') && Zotero.AI4Paper.isReaderSidePaneExist("translate", param6[0x0]);
        Zotero.Prefs.get("ai4paper.gptviewReaderSidepane") && Zotero.AI4Paper.isReaderSidePaneExist("chatgpt", param6[0x0]);
      }
      if (param4 == "select" && param5 == "tab") {
        let var7 = Zotero.Reader.getByTabID(param6[0x0]);
        await Zotero.AI4Paper.addReaderButtonInit(var7);
        await Zotero.AI4Paper.updateReaderButtonStateInit();
        await Zotero.AI4Paper.addAnnotationButtonInit();
        Zotero.Prefs.get("ai4paper.translationreadersidepane") && Zotero.AI4Paper.isReaderSidePaneExist('translate', param6[0x0]);
        Zotero.Prefs.get('ai4paper.gptviewReaderSidepane') && Zotero.AI4Paper.isReaderSidePaneExist("chatgpt", param6[0x0]);
        Zotero.AI4Paper.autoFocusReaderSidePane();
      }
      param4 == "close" && param5 == 'tab' && Zotero.getMainWindow().Zotero_Tabs._tabs.length === 0x1 && Zotero.AI4Paper.unregisterReaderSidePanes(["translate", 'gpt']);
      if (param4 == "add" && param5 == "item") {
        Zotero.AI4Paper.updateNewItems(Zotero.Items.get(param6));
        let _0x15f870 = Zotero.Items.get(param6)[0x0],
          _0x59ed3f = 0x0;
        _0x15f870.isAnnotation() && (await Zotero.AI4Paper.addAnnotationButtonInit(_0x15f870), Zotero.Prefs.get("ai4paper.autoreadingtag") && (await Zotero.AI4Paper.addReadingTag(_0x15f870)), Zotero.Prefs.get("ai4paper.defineColorLabelAutoAddTag") && (await Zotero.AI4Paper.addAnnotationTagBasedOnColorLabel(_0x15f870)));
        Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") && Zotero.AI4Paper.getFunMetaTitle() && _0x15f870.isAnnotation() && (await Zotero.AI4Paper.updateObsidianNote(_0x15f870), await Zotero.AI4Paper.dataviewCardnotes(), await Zotero.AI4Paper.dataviewStatistics(), await Zotero.AI4Paper.generatePapersMatrix());
        if (!Zotero.Prefs.get('ai4paper.vocabularybookdisable') && Zotero.AI4Paper.letDOI()) {
          if (_0x15f870.isAnnotation()) {
            if (_0x15f870.annotationType === "highlight" && _0x15f870.annotationColor === '#a28ae5' && Zotero.Prefs.get("ai4paper.annotationcolorselect") === '紫色') {
              await Zotero.AI4Paper.addVocabulary(_0x15f870, _0x15f870.annotationText);
              _0x59ed3f = 0x1;
              Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") && (await Zotero.AI4Paper.updateObsidianNote(_0x15f870));
            } else {
              if (_0x15f870.annotationType === 'highlight' && _0x15f870.annotationColor === '#ffd400' && Zotero.Prefs.get("ai4paper.annotationcolorselect") === '黄色') {
                await Zotero.AI4Paper.addVocabulary(_0x15f870, _0x15f870.annotationText);
                _0x59ed3f = 0x1;
                Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") && (await Zotero.AI4Paper.updateObsidianNote(_0x15f870));
              } else {
                if (_0x15f870.annotationType === "highlight" && _0x15f870.annotationColor === "#ff6666" && Zotero.Prefs.get("ai4paper.annotationcolorselect") === '红色') {
                  await Zotero.AI4Paper.addVocabulary(_0x15f870, _0x15f870.annotationText);
                  _0x59ed3f = 0x1;
                  Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") && (await Zotero.AI4Paper.updateObsidianNote(_0x15f870));
                } else {
                  if (_0x15f870.annotationType === "highlight" && _0x15f870.annotationColor === "#5fb236" && Zotero.Prefs.get("ai4paper.annotationcolorselect") === '绿色') {
                    await Zotero.AI4Paper.addVocabulary(_0x15f870, _0x15f870.annotationText);
                    _0x59ed3f = 0x1;
                    Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") && (await Zotero.AI4Paper.updateObsidianNote(_0x15f870));
                  } else {
                    if (_0x15f870.annotationType === "highlight" && _0x15f870.annotationColor === "#2ea8e5" && Zotero.Prefs.get("ai4paper.annotationcolorselect") === '蓝色') {
                      await Zotero.AI4Paper.addVocabulary(_0x15f870, _0x15f870.annotationText);
                      _0x59ed3f = 0x1;
                      Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") && (await Zotero.AI4Paper.updateObsidianNote(_0x15f870));
                    } else {
                      if (_0x15f870.annotationType === "highlight" && _0x15f870.annotationColor === "#e56eee" && Zotero.Prefs.get("ai4paper.annotationcolorselect") === "洋红色") {
                        await Zotero.AI4Paper.addVocabulary(_0x15f870, _0x15f870.annotationText);
                        _0x59ed3f = 0x1;
                        if (Zotero.Prefs.get('ai4paper.obsidianautoupdatenotes')) {
                          await Zotero.AI4Paper.updateObsidianNote(_0x15f870);
                        }
                      } else {
                        if (_0x15f870.annotationType === "highlight" && _0x15f870.annotationColor === '#f19837' && Zotero.Prefs.get('ai4paper.annotationcolorselect') === '橘色') {
                          await Zotero.AI4Paper.addVocabulary(_0x15f870, _0x15f870.annotationText);
                          _0x59ed3f = 0x1;
                          Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") && (await Zotero.AI4Paper.updateObsidianNote(_0x15f870));
                        } else _0x15f870.annotationType === "highlight" && _0x15f870.annotationColor === '#aaaaaa' && Zotero.Prefs.get("ai4paper.annotationcolorselect") === '灰色' && (await Zotero.AI4Paper.addVocabulary(_0x15f870, _0x15f870.annotationText), _0x59ed3f = 0x1, Zotero.Prefs.get('ai4paper.obsidianautoupdatenotes') && (await Zotero.AI4Paper.updateObsidianNote(_0x15f870)));
                      }
                    }
                  }
                }
              }
            }
          }
        }
        Zotero.Prefs.get('ai4paper.translateannotationtext') && _0x15f870.isAnnotation() && (_0x15f870.annotationType === "highlight" || _0x15f870.annotationType === "underline") && !_0x59ed3f && (await Zotero.AI4Paper.annotationTextTrans(_0x15f870, "auto"));
        Zotero.Prefs.get("ai4paper.autoOptimizeSpaces4CurrentTab") && _0x15f870.isAnnotation() && (_0x15f870.annotationType === "highlight" || _0x15f870.annotationType === "underline") && (await Zotero.AI4Paper.optimizeSpaces4CurrentTab(_0x15f870));
        if (_0x15f870.isAnnotation()) {
          if (Zotero.Prefs.get("ai4paper.annotationimageactions") != "无操作" && _0x15f870.annotationType === "image") {
            await Zotero.AI4Paper.onAnnotationImage(_0x15f870, _0x15f870.key);
          }
        }
        if (Zotero.Prefs.get("ai4paper.autoannotationsnote") && Zotero.AI4Paper.getFunMetaTitle()) {
          _0x15f870.isAnnotation() && !_0x59ed3f && (await Zotero.AI4Paper.autoAddNoteFromAnnotations(_0x15f870));
        }
      }
      if (param4 == 'modify' && param5 == "item") {
        let var10 = Zotero.Items.get(param6)[0x0];
        if (Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes")) {
          var10.isAnnotation() && (await Zotero.AI4Paper.updateObsidianNote(var10));
          await Zotero.AI4Paper.itemsModification2OB(Zotero.Items.get(param6).filter(_0x13e974 => _0x13e974.isRegularItem()));
        }
        Zotero.Prefs.get('ai4paper.enableannotationsvgVisitUniversalQuoteLink') && var10.isAnnotation() && (await Zotero.AI4Paper.updateUniversalQuoteLink(var10));
        Zotero.Prefs.get('ai4paper.autoannotationsnote') && var10.isAnnotation() && (await Zotero.AI4Paper.autoAddNoteFromAnnotationsForModifyListener(var10));
        if (!Zotero.Prefs.get("ai4paper.vocabularybookdisable")) {
          if (var10.isAnnotation()) {
            if (var10.annotationType === "highlight" && var10.annotationColor === "#a28ae5" && Zotero.Prefs.get('ai4paper.annotationcolorselect') === '紫色') await Zotero.AI4Paper.modifyVocabularyNote(var10, var10.key);else {
              if (var10.annotationType === 'highlight' && var10.annotationColor === '#ffd400' && Zotero.Prefs.get("ai4paper.annotationcolorselect") === '黄色') await Zotero.AI4Paper.modifyVocabularyNote(var10, var10.key);else {
                if (var10.annotationType === "highlight" && var10.annotationColor === '#ff6666' && Zotero.Prefs.get('ai4paper.annotationcolorselect') === '红色') await Zotero.AI4Paper.modifyVocabularyNote(var10, var10.key);else {
                  if (var10.annotationType === "highlight" && var10.annotationColor === '#5fb236' && Zotero.Prefs.get("ai4paper.annotationcolorselect") === '绿色') await Zotero.AI4Paper.modifyVocabularyNote(var10, var10.key);else {
                    if (var10.annotationType === "highlight" && var10.annotationColor === '#2ea8e5' && Zotero.Prefs.get("ai4paper.annotationcolorselect") === '蓝色') await Zotero.AI4Paper.modifyVocabularyNote(var10, var10.key);else {
                      if (var10.annotationType === 'highlight' && var10.annotationColor === "#e56eee" && Zotero.Prefs.get('ai4paper.annotationcolorselect') === '洋红色') await Zotero.AI4Paper.modifyVocabularyNote(var10, var10.key);else {
                        if (var10.annotationType === 'highlight' && var10.annotationColor === "#f19837" && Zotero.Prefs.get('ai4paper.annotationcolorselect') === '橘色') {
                          await Zotero.AI4Paper.modifyVocabularyNote(var10, var10.key);
                        } else var10.annotationType === "highlight" && var10.annotationColor === '#aaaaaa' && Zotero.Prefs.get('ai4paper.annotationcolorselect') === '灰色' && (await Zotero.AI4Paper.modifyVocabularyNote(var10, var10.key));
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (param4 == "delete" && param5 == "item") {
        let var11 = Zotero_Tabs._selectedID,
          var12 = Zotero.Reader.getByTabID(var11);
        !Zotero.Prefs.get("ai4paper.vocabularybookdisable") && var12 && (await Zotero.AI4Paper.removeVocabularyfromNote(param7[param6[0x0]].key));
        Zotero.Prefs.get("ai4paper.autoannotationsnote") && var12 && (await Zotero.AI4Paper.autoAddNoteFromAnnotationsForDeleteListener());
        Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") && var12 && (await Zotero.AI4Paper.updateObsidianNoteForDeleteListener());
      }
      if (param4 == "add" && param5 == "item-tag") {
        let var13 = param6[0x0].split('-').map(_0x396069 => parseInt(_0x396069))[0x0],
          var14 = param6[0x0].split('-').map(_0x5827f5 => parseInt(_0x5827f5))[0x1];
        Zotero.AI4Paper.addAnnotationTag(var13, var14);
        Zotero.Prefs.get("ai4paper.autogeneratetagscollection") && Zotero.AI4Paper.handleItemTagChange(var13);
      }
      if (param4 == "remove" && param5 == "item-tag") {
        let var15 = param6[0x0].split('-').map(_0x705748 => parseInt(_0x705748))[0x0],
          var16 = JSON.stringify(param7[param6[0x0]].tag);
        Zotero.AI4Paper.checkAnnotatationItem(var15, var16);
        Zotero.Prefs.get("ai4paper.autogeneratetagscollection") && Zotero.AI4Paper.handleItemTagChange(var15);
      }
      param4 === "trash" && param5 == "collection" && Zotero.AI4Paper.onDeleteCollectionEvent(true, param6[0x0]);
      if (param4 == "open" && param5 == 'file') {
        let var17 = Zotero.Items.get(param6)[0x0];
        Zotero.AI4Paper.filesHistory(var17);
      }
    }
  },
  'setGlobalParam': function () {
    _globalThis.window = this.getGlobal("window");
    _globalThis.Zotero_Tabs = this.getGlobal("Zotero_Tabs");
    _globalThis.ZoteroPane = this.getGlobal('ZoteroPane');
    _globalThis.ZoteroPane_Local = this.getGlobal('ZoteroPane_Local');
  },
  'getGlobal': function (param8) {
    const var18 = typeof Zotero !== "undefined" ? Zotero : Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject,
      var19 = var18.getMainWindow();
    switch (param8) {
      case 'Zotero':
      case "zotero":
        return var18;
      case "window":
        return var19;
      case "document":
        return var19.document;
      case "ZoteroPane":
      case "ZoteroPane_Local":
        return var18.getActiveZoteroPane();
      default:
        return var19[param8];
    }
  },
  'registerStylesheet': function () {
    let var20 = window.document,
      var21 = var20.createElement("link");
    var21.id = 'ai4paper-stylesheet';
    var21.type = "text/css";
    var21.rel = "stylesheet";
    var21.href = "chrome://ai4paper/content/assets/css/style.css";
    var20.documentElement.appendChild(var21);
  },
  'collapseItemPane_byShortCuts': function () {
    if (Zotero_Tabs._selectedID != 'zotero-pane') return;
    Zotero.AI4Paper.togglePaneDisplay("zotero-item", "toggle");
  },
  'splitHorizontally_byShortCuts': function () {
    let var401 = Zotero_Tabs._selectedID,
      var402 = Zotero.Reader.getByTabID(var401);
    if (!var402) return;
    window.document.getElementById("view-menuitem-split-horizontally").click();
  },
  'splitVertically_byShortCuts': function () {
    let var403 = Zotero_Tabs._selectedID,
      var404 = Zotero.Reader.getByTabID(var403);
    if (!var404) return;
    window.document.getElementById("view-menuitem-split-vertically").click();
  },
  'oddSpreads_byShortCuts': function () {
    let var405 = Zotero.AI4Paper.getCurrentReader();
    if (!var405) return;
    if (var405.spreadMode != 0x1) {
      var405.spreadMode = 0x1;
    } else var405.spreadMode = 0x0;
  },
  'customItemTreeColumns': async function () {
    let var406 = ['shortTitle', "archive", 'archiveLocation', "libraryCatalog", "callNumber", 'rights'];
    for (let var407 of var406) {
      Zotero.Prefs.get("ai4paper.enableCustomItemTreeColumns" + var407) ? await Zotero.ItemTreeManager.registerColumns({
        'dataKey': var407,
        'label': Zotero.Prefs.get("ai4paper.renameCustomItemTreeColumns" + var407),
        'pluginID': 'ai4paper@qnscholar',
        'dataProvider': (_0xf1435b, _0x4ee605) => {
          return _0xf1435b.getField(var407);
        }
      }) : await Zotero.ItemTreeManager.unregisterColumns("ai4paper\\@qnscholar-" + var407);
    }
  },
  'registerItemsToolBarButtons': function (param14) {
    let var416 = window.document.querySelector("#zotero-items-toolbar");
    const var417 = window.document.querySelector("#zotero-tb-lookup"),
      var418 = window.document.querySelector('#zotero-tb-attachment-add'),
      var419 = window.document.querySelector("#zotero-tb-note-add"),
      var420 = window.document.querySelector("#zotero-tb-add"),
      var421 = window.document.querySelector('#zotero-tb-search');
    if (!var416 || !var417 || !var418) return false;
    for (let var422 of param14) {
      if (var422 === "preferences" && Zotero.Prefs.get("ai4paper.settingsToolBarButton") && var416.getAttribute('itemsToolbar-button-' + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, 'true');
        let var423 = var417.cloneNode(true);
        var423.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        var423.setAttribute("tooltiptext", "Zotero 首选项");
        var423.setAttribute("command", '');
        var423.setAttribute("onmousedown", '');
        var423.setAttribute("oncommand", "Zotero.Utilities.Internal.openPreferences('zotero-prefpane-ai4paper');");
        var423.innerHTML = Zotero.AI4Paper.svg_icon_20px.settingsToolBarButton;
        var416.insertBefore(var423, var419.nextElementSibling);
      }
      if (var422 === "zoteroColorScheme" && Zotero.Prefs.get("ai4paper.zoteroColorSchemeToolBarButton") && var416.getAttribute("itemsToolbar-button-" + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, 'true');
        let _0x5ab7a6 = var417.cloneNode(true);
        _0x5ab7a6.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        _0x5ab7a6.setAttribute("tooltiptext", "Zotero 深浅主题切换");
        _0x5ab7a6.setAttribute("command", '');
        _0x5ab7a6.setAttribute("onmousedown", '');
        _0x5ab7a6.setAttribute("oncommand", "Zotero.AI4Paper.changeZoteroDarkANDLightMode();");
        let _0x5f59d9 = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")["matches"];
        _0x5ab7a6.innerHTML = _0x5f59d9 ? Zotero.AI4Paper.svg_icon_20px.zoteroColorSchemeToolBarButton_dark : Zotero.AI4Paper.svg_icon_20px.zoteroColorSchemeToolBarButton;
        var416.insertBefore(_0x5ab7a6, var419.nextElementSibling);
      }
      if (var422 === "showFile" && Zotero.Prefs.get("ai4paper.showfileToolBarButton") && var416.getAttribute("itemsToolbar-button-" + var422) != 'true') {
        var416.setAttribute("itemsToolbar-button-" + var422, "true");
        let var426 = var417.cloneNode(true);
        var426.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        var426.setAttribute("tooltiptext", "打开文件位置");
        var426.setAttribute("command", '');
        var426.setAttribute("onmousedown", '');
        var426.setAttribute("oncommand", 'Zotero.AI4Paper.showFile();');
        var426.innerHTML = Zotero.AI4Paper.svg_icon_20px.showfileToolBarButton;
        var416.insertBefore(var426, var419.nextElementSibling);
      }
      if (var422 === "chatWithNewBing" && Zotero.Prefs.get('ai4paper.chatwithnewbingToolBarButton') && var416.getAttribute('itemsToolbar-button-' + var422) != "true") {
        var416.setAttribute('itemsToolbar-button-' + var422, "true");
        let var427 = var417.cloneNode(true);
        var427.setAttribute('id', 'zotero-if-items-toolbar-button-' + var422);
        var427.setAttribute('tooltiptext', "Chat with NewBing");
        var427.setAttribute('command', '');
        var427.setAttribute("onmousedown", '');
        var427.setAttribute("oncommand", "Zotero.AI4Paper.chatWithNewBing();");
        var427.innerHTML = Zotero.AI4Paper.svg_icon_20px.chatwithnewbingToolBarButton;
        var416.insertBefore(var427, var419.nextElementSibling);
      }
      if (var422 === "immersiveTranslate" && Zotero.Prefs.get("ai4paper.immersiveTranslateToolBarButton") && var416.getAttribute('itemsToolbar-button-' + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, "true");
        let var428 = var417.cloneNode(true);
        var428.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        var428.setAttribute("tooltiptext", "打开沉浸式翻译");
        var428.setAttribute("command", '');
        var428.setAttribute("onmousedown", '');
        var428.addEventListener("pointerdown", _0x38681e => {
          if (_0x38681e.button == 0x2) Zotero.AI4Paper.openUniversalImmersiveTranslate();else {
            Zotero.AI4Paper.openImmersiveTranslate();
          }
        }, false);
        var428.innerHTML = Zotero.AI4Paper.svg_icon_20px.immersiveTranslateToolBarButton;
        var416.insertBefore(var428, var419.nextElementSibling);
      }
      if (var422 === "copyPDF" && Zotero.Prefs.get("ai4paper.copyPDFToolBarButton") && var416.getAttribute("itemsToolbar-button-" + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, "true");
        let var429 = var417.cloneNode(true);
        var429.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        var429.setAttribute("tooltiptext", "拷贝 PDF");
        var429.setAttribute("command", '');
        var429.setAttribute("onmousedown", '');
        var429.onclick = _0x4a9af3 => {
          if (_0x4a9af3.shiftKey) Zotero.AI4Paper.openwith();else _0x4a9af3.button == 0x2 ? Zotero.AI4Paper.openwith() : Zotero.AI4Paper.copyPDF();
        };
        var429.innerHTML = Zotero.AI4Paper.svg_icon_20px.copyPDFToolBarButton;
        var416.insertBefore(var429, var419.nextElementSibling);
      }
      if (var422 === 'openwith' && Zotero.Prefs.get("ai4paper.openwithToolBarButton") && var416.getAttribute("itemsToolbar-button-" + var422) != "true") {
        var416.setAttribute('itemsToolbar-button-' + var422, "true");
        let _0x2747fe = var417.cloneNode(true);
        _0x2747fe.setAttribute('id', 'zotero-if-items-toolbar-button-' + var422);
        _0x2747fe.setAttribute("tooltiptext", "Open With");
        _0x2747fe.setAttribute("command", '');
        _0x2747fe.setAttribute("onmousedown", '');
        _0x2747fe.onclick = _0x87c5f9 => {
          if (_0x87c5f9.shiftKey) Zotero.AI4Paper.openwith_buildPopup(_0x2747fe);else _0x87c5f9.button == 0x2 ? Zotero.AI4Paper.openwith(0x2) : Zotero.AI4Paper.openwith(0x1);
        };
        _0x2747fe.innerHTML = Zotero.AI4Paper.svg_icon_20px.openwithToolBarButton;
        var416.insertBefore(_0x2747fe, var419.nextElementSibling);
      }
      if (var422 === "fileshistory" && Zotero.Prefs.get("ai4paper.fileshistoryToolBarButton") && var416.getAttribute('itemsToolbar-button-' + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, "true");
        let var431 = var417.cloneNode(true);
        var431.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        var431.setAttribute('tooltiptext', "最近打开");
        var431.setAttribute("command", '');
        var431.setAttribute('onmousedown', '');
        var431.onclick = _0x4c7c36 => {
          if (_0x4c7c36.shiftKey) Zotero.AI4Paper.openWorkSpaceWindow();else {
            if (_0x4c7c36.button == 0x2) {
              Zotero.AI4Paper.createTabsAsWorkSpace();
            } else Zotero.AI4Paper.openDialog_filesHistory();
          }
        };
        var431.innerHTML = Zotero.AI4Paper.svg_icon_20px.fileshistoryToolBarButton;
        var416.insertBefore(var431, var419.nextElementSibling);
      }
      if (var422 === 'obsidiannote' && Zotero.Prefs.get('ai4paper.obsidiannoteToolBarButton') && var416.getAttribute('itemsToolbar-button-' + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, 'true');
        let var432 = var417.cloneNode(true);
        var432.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        var432.setAttribute("tooltiptext", "Obsidian Note");
        var432.setAttribute("command", '');
        var432.setAttribute("onmousedown", '');
        var432.setAttribute('oncommand', "Zotero.AI4Paper.obsidianNote();");
        var432.innerHTML = Zotero.AI4Paper.svg_icon_20px.obsidiannoteToolBarButton;
        var416.insertBefore(var432, var419.nextElementSibling);
      }
      if (var422 === "tagscardnotes" && Zotero.Prefs.get("ai4paper.tagscardnotesToolBarButton") && var416.getAttribute("itemsToolbar-button-" + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, "true");
        let var433 = var417.cloneNode(true);
        var433.setAttribute('id', 'zotero-if-items-toolbar-button-' + var422);
        var433.setAttribute('tooltiptext', "标签管理器");
        var433.setAttribute('command', '');
        var433.setAttribute('onmousedown', '');
        var433.setAttribute("oncommand", "Zotero.AI4Paper.openDialog_tagsManager();");
        var433.innerHTML = Zotero.AI4Paper.svg_icon_20px.tagscardnotesToolBarButton;
        var416.insertBefore(var433, var419.nextElementSibling);
      }
      if (var422 === "go2favoritecollection" && Zotero.Prefs.get("ai4paper.go2favoritecollectionToolBarButton") && var416.getAttribute("itemsToolbar-button-" + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, "true");
        let _0x38ed4a = var418.cloneNode(false);
        _0x38ed4a.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        _0x38ed4a.setAttribute("tooltiptext", '前往收藏分类');
        _0x38ed4a.setAttribute('data-l10n-id', '');
        _0x38ed4a.setAttribute('command', '');
        _0x38ed4a.setAttribute('oncommand', '');
        _0x38ed4a.setAttribute("type", "menu");
        _0x38ed4a.innerHTML = Zotero.AI4Paper.svg_icon_20px.go2favoritecollectionToolBarButton;
        let _0x371f7f = var418.querySelector('dropmarker'),
          _0x552e52 = _0x371f7f.cloneNode(true);
        _0x552e52.style.marginLeft = "3px";
        _0x38ed4a.append(_0x552e52);
        _0x38ed4a.querySelector('svg').style.pointerEvents = "none";
        _0x38ed4a.onpointerdown = _0x13fe08 => {
          _0x13fe08.button == 0x2 && Zotero.AI4Paper.openDialogByType("sortFavoriteCollections");
        };
        let _0x521b13 = _0x38ed4a.appendChild(window.document.createXULElement("menupopup"));
        _0x521b13.setAttribute('id', "zotero-if-items-toolbar-go2favoritecollection-button-popup");
        _0x521b13.setAttribute("onpopupshowing", "Zotero.AI4Paper.UI.displayToolBarMenuitem();");
        var416.insertBefore(_0x38ed4a, var419.nextElementSibling);
      }
      if (var422 === "batchAIInterpret" && Zotero.Prefs.get('ai4paper.batchAIInterpretToolBarButton') && var416.getAttribute("itemsToolbar-button-" + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, "true");
        let var438 = var417.cloneNode(true);
        var438.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        var438.setAttribute("tooltiptext", "批量 AI 解读文献");
        var438.setAttribute('command', '');
        var438.setAttribute("onmousedown", '');
        var438.onclick = _0x2a3e78 => {
          if (_0x2a3e78.shiftKey) Zotero.AI4Paper.batchInterpretSelectedItems();else _0x2a3e78.button == 0x2 ? Zotero.AI4Paper.batchInterpretSelectedItems() : Zotero.AI4Paper.openDialogByType("batchAIInterpret", true);
        };
        var438.innerHTML = Zotero.AI4Paper.svg_icon_20px.paperai_batch;
        var416.insertBefore(var438, var419.nextElementSibling);
      }
      if (var422 === "archive" && Zotero.Prefs.get("ai4paper.archiveToolBarButton") && var416.getAttribute("itemsToolbar-button-" + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, "true");
        let _0x248249 = var417.cloneNode(true);
        _0x248249.setAttribute('id', 'zotero-if-items-toolbar-button-' + var422);
        _0x248249.setAttribute("tooltiptext", '归档');
        _0x248249.setAttribute('command', '');
        _0x248249.setAttribute("onmousedown", '');
        _0x248249.setAttribute("oncommand", "Zotero.AI4Paper.archiveSelectedItems();");
        _0x248249.innerHTML = Zotero.AI4Paper.svg_icon_20px.archiveToolBarButton;
        var416.insertBefore(_0x248249, var419.nextElementSibling);
      }
      if (var422 === "pinAttachments" && Zotero.Prefs.get("ai4paper.pinAttachmentsToolBarButton") && var416.getAttribute("itemsToolbar-button-" + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, "true");
        let _0xe3fc50 = var417.cloneNode(true);
        _0xe3fc50.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        _0xe3fc50.setAttribute("tooltiptext", "钉住附件");
        _0xe3fc50.setAttribute("command", '');
        _0xe3fc50.setAttribute("onmousedown", '');
        _0xe3fc50.addEventListener("dblclick", _0x40cc74 => Zotero.AI4Paper.pinAttachments_itemView(_0xe3fc50));
        _0xe3fc50.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton_pinned;
        Zotero.AI4Paper.pinAttachments_initInnerHTML(_0xe3fc50);
        var416.insertBefore(_0xe3fc50, var419.nextElementSibling);
      }
      if (var422 === "collectionPaneDisplay" && Zotero.Prefs.get("ai4paper.collectionpanedisplayToolBarButton") && var416.getAttribute("itemsToolbar-button-" + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, 'true');
        let _0x5cf8da = var417.cloneNode(true);
        _0x5cf8da.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        _0x5cf8da.setAttribute("tooltiptext", "展开/折叠分类面板");
        _0x5cf8da.setAttribute("command", '');
        _0x5cf8da.setAttribute("onmousedown", '');
        _0x5cf8da.setAttribute("oncommand", "Zotero.AI4Paper.togglePaneDisplay('zotero-collections', 'toggle');");
        _0x5cf8da.innerHTML = Zotero.AI4Paper.svg_icon_20px.collectionpanedisplayToolBarButton;
        var416.insertBefore(_0x5cf8da, var420);
      }
      if (var422 === 'itemPaneDisplay' && Zotero.Prefs.get('ai4paper.itempanedisplayToolBarButton') && var416.getAttribute("itemsToolbar-button-" + var422) != "true") {
        var416.setAttribute('itemsToolbar-button-' + var422, "true");
        let _0x52ab58 = var417.cloneNode(true);
        _0x52ab58.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        _0x52ab58.setAttribute("tooltiptext", "展开/折叠条目面板");
        _0x52ab58.setAttribute("command", '');
        _0x52ab58.setAttribute("onmousedown", '');
        _0x52ab58.setAttribute("oncommand", "Zotero.AI4Paper.togglePaneDisplay('zotero-item', 'toggle');");
        _0x52ab58.innerHTML = Zotero.AI4Paper.svg_icon_20px.itempanedisplayToolBarButton;
        var416.insertBefore(_0x52ab58, var421.nextElementSibling);
      }
      if (var422 === "collectionitemPaneDisplay" && Zotero.Prefs.get("ai4paper.collectionitempanedisplayToolBarButton") && var416.getAttribute('itemsToolbar-button-' + var422) != "true") {
        var416.setAttribute("itemsToolbar-button-" + var422, "true");
        let _0x1da2a8 = var417.cloneNode(true);
        _0x1da2a8.setAttribute('id', "zotero-if-items-toolbar-button-" + var422);
        _0x1da2a8.setAttribute("tooltiptext", "展开/折叠【分类/条目】面板");
        _0x1da2a8.setAttribute("command", '');
        _0x1da2a8.setAttribute("onmousedown", '');
        _0x1da2a8.setAttribute("oncommand", "Zotero.AI4Paper.togglePaneDisplay('zotero-collections', 'toggle'); Zotero.AI4Paper.togglePaneDisplay('zotero-item', 'toggle');");
        _0x1da2a8.innerHTML = Zotero.AI4Paper.svg_icon_20px.collectionitempanedisplayToolBarButton;
        var416.insertBefore(_0x1da2a8, var420);
      }
    }
  },
  'unregisterItemsToolBarButtons': function (param15) {
    let var444 = window.document.querySelector("#zotero-items-toolbar");
    if (!var444) return false;
    for (let var445 of param15) {
      const _0x420843 = window.document.querySelector('#zotero-if-items-toolbar-button-' + var445);
      _0x420843 && (_0x420843.remove(), var444.setAttribute("itemsToolbar-button-" + var445, "false"));
    }
  },
  'addEventListener_itemViewPinButton': function () {
    let var455 = window.document.getElementById('zotero-view-item-sidenav');
    if (var455) {
      let var456 = var455.querySelector('[data-l10n-id=\x22sidenav-attachments\x22]');
      if (var456 && !var456._dblclickEventListener_added) {
        var456._dblclickEventListener_added = true;
        var456.addEventListener("dblclick", async () => {
          let var457 = window.document.querySelector("#zotero-if-items-toolbar-button-pinAttachments");
          if (!var457) return;
          await Zotero.Promise.delay(0x5);
          if (var455.pinnedPane === "attachments") var457.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton;else {
            var457.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton_pinned;
          }
        });
      }
    }
  },
  'pinAttachments_initInnerHTML': function (param18) {
    let var458 = window.document.getElementById("zotero-view-item-sidenav");
    if (!var458) return;
    var458.pinnedPane === "attachments" ? param18.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton : param18.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton_pinned;
  },
  'pinAttachments_itemView': function (param19) {
    let var459 = window.document.getElementById("zotero-view-item-sidenav");
    if (!var459) return;
    var459.pinnedPane != "attachments" ? (window.document.querySelector("attachment-preview")?.["scrollIntoView"]({
      'behavior': 'smooth',
      'block': "center"
    }), var459.pinnedPane = "attachments", param19.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton) : (var459.pinnedPane = '', param19.innerHTML = Zotero.AI4Paper.svg_icon_20px.pinAttachmentsToolBarButton_pinned);
  },
  'unregisterWindowButtons': function () {
    Zotero.getMainWindow().document.querySelectorAll(".AI4Paper-Window-Button").forEach(_0x5616a8 => _0x5616a8.remove());
  },
  'createPopup_universal': function (param39, param40) {
    window.document.querySelector('#browser').querySelectorAll('#' + param39).forEach(_0x1de1ea => _0x1de1ea.remove());
    let var551 = window.document.createXULElement("menupopup");
    var551.id = param39;
    var551.addEventListener("popuphidden", _0x313241 => {
      param40 ? (_0x313241.preventDefault(), _0x313241.stopPropagation()) : window.document.querySelector("#browser").querySelectorAll('#' + param39).forEach(_0x3bf125 => _0x3bf125.remove());
    });
    let var552 = var551.firstElementChild;
    while (var552) {
      var552.remove();
      var552 = var551.firstElementChild;
    }
    return window.document.querySelector('#browser').appendChild(var551), var551;
  },
  'createMenuitem_universal': function (param41, param42, param43) {
    param43.forEach(_0x57a9a5 => {
      if (_0x57a9a5.children) {
        const _0x248dd9 = param41.document.createXULElement("menu");
        _0x248dd9.setAttribute("label", _0x57a9a5.label);
        const _0x23ee99 = param41.document.createXULElement("menupopup");
        Zotero.AI4Paper.createMenuitem_universal(param41, _0x23ee99, _0x57a9a5.children);
        _0x248dd9.appendChild(_0x23ee99);
        param42.appendChild(_0x248dd9);
      } else {
        const _0x47b0e6 = param41.document.createXULElement("menuitem");
        _0x47b0e6.setAttribute('label', _0x57a9a5.label);
        _0x47b0e6.addEventListener('command', _0x57a9a5.action);
        param42.appendChild(_0x47b0e6);
      }
      if (_0x57a9a5.separator) {
        param42.appendChild(param41.document.createXULElement("menuseparator"));
      }
    });
  },
  'createPopup_chatBtn_locateAIReadingNotes': function (param44) {
    let var556 = "AI4Paper-gptReaderSidePane-locatePaperInfo-menupopup",
      var557 = Zotero.AI4Paper.createPopup_universal(var556),
      var558 = ["打开智能文献矩阵", "导入【智能文献矩阵导出.md】", "智能文献矩阵【未读】文献", "智能文献矩阵【在读】文献", "智能文献矩阵【已读】文献", "智能文献矩阵【今天】文献", "智能文献矩阵【过去一天】文献", "智能文献矩阵【过去一周】文献", '智能文献矩阵【过去一个月】文献', '智能文献矩阵【过去一年】文献', "在智能文献矩阵中定位本条目", "在智能文献矩阵中查询本条目分类", "定位 Obsidian【AI 文献解读】笔记"];
    for (let var559 of var558) {
      let _0x493a3c = window.document.createXULElement("menuitem");
      _0x493a3c.setAttribute('label', var559);
      _0x493a3c.addEventListener("command", _0x59deb7 => {
        var559 === "打开智能文献矩阵" && Zotero.AI4Paper.queryPapersMatrix(null, null, true);
        var559 === "导入【智能文献矩阵导出.md】" && Zotero.AI4Paper.importPapersMatrixMarkdownData();
        var559 === "智能文献矩阵【未读】文献" && Zotero.AI4Paper.queryPapersMatrix("filterByTag", "unread");
        var559 === '智能文献矩阵【在读】文献' && Zotero.AI4Paper.queryPapersMatrix("filterByTag", "reading");
        if (var559 === '智能文献矩阵【已读】文献') {
          Zotero.AI4Paper.queryPapersMatrix("filterByTag", 'Done');
        }
        var559 === "智能文献矩阵【今天】文献" && Zotero.AI4Paper.queryPapersMatrix("filterByModifiedDate", '今天');
        var559 === '智能文献矩阵【过去一天】文献' && Zotero.AI4Paper.queryPapersMatrix("filterByModifiedDate", "过去一天");
        var559 === '智能文献矩阵【过去一周】文献' && Zotero.AI4Paper.queryPapersMatrix("filterByModifiedDate", "过去一周");
        var559 === '智能文献矩阵【过去一个月】文献' && Zotero.AI4Paper.queryPapersMatrix("filterByModifiedDate", "过去一个月");
        var559 === "智能文献矩阵【过去一年】文献" && Zotero.AI4Paper.queryPapersMatrix('filterByModifiedDate', '过去一年');
        if (var559 === "在智能文献矩阵中定位本条目") {
          Zotero.AI4Paper.locateItemInPapersMatrix();
        }
        var559 === "在智能文献矩阵中查询本条目分类" && Zotero.AI4Paper.searchCollectionInPapersMatrix();
        if (var559 === "定位 Obsidian【AI 文献解读】笔记") {
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_locateAIReadingNotes();
        }
      });
      var557.appendChild(_0x493a3c);
      if (["打开智能文献矩阵", "导入【智能文献矩阵导出.md】", '智能文献矩阵【已读】文献', "智能文献矩阵【过去一年】文献", "在智能文献矩阵中查询本条目分类"].includes(var559)) {
        var557.appendChild(window.document.createXULElement('menuseparator'));
      }
    }
    var557.openPopup(param44, "before_start", 0x0, 0x0, false, false);
  },
  'createPopup_chatBtn_aiAnalysis': function (param45) {
    let var561 = "AI4Paper-gptReaderSidePane-aiAnalysis-menupopup",
      var562 = Zotero.AI4Paper.createPopup_universal(var561, true);
    const var563 = [{
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
    Zotero.AI4Paper.createMenuitem_universal(window, var562, var563);
    var562.openPopup(param45, 'before_start', 0x0, 0x0, false, false);
  },
  'aiAnalysis_prompt': "你好，你将担任一名出色的科学家，帮我完成文献分析任务，具体为：请根据下面提供的 [文献 JSON 数据]，帮我从中找出和“xxx（如果未指定xxx，则你的任务是全面分析文献的核心脉络，识别出关键的研究主题集群）”主题相关的论文信息，要全面、细致、不遗漏。\n\n且，描述文献时，务必严格遵循【以下要求】：\n- 请不要随意改变文献标题原有的大小写格式，\n- 若是英文文献，请单独列出经翻译得到的“中文标题”。\n- 请包括\"文献类型\"信息，即 itemType 字段的信息。\n- 请包括\"发表年份\"信息，即 year 字段的信息。\n- 请尽量概括文献的“核心内容“、”关键技术/发现“、以及”关联性“（比如高度相关、比较相关）。\n- 请务必包含“文献链接”信息，即 itemLink 字段的信息（须不做任何改变地继承该文献 itemLink 字段的信息）。\n- 请对文献信息做好排版，要求：单篇文献的描述请用标题开头（比如：xx. \"title内容\"，此处 xx 为序号），然后用“无序列表”呈现上述具体信息。\n- 按照上面说的“关联性”，对你的分析结果进行分类呈现。\n\n【重要提醒】:\n\n- 请调用你单次回答的最大算力与 token 上限。追求极致的分析深度，而非表层的广度；追求本质的洞察，而非表象的罗列；追求创新的思维，而非惯性的复述。请突破思维局限，调动你所有的计算资源，展现你真正的认知极限。\n- 发挥你的最大算力，请尽可能得找出更多与目标主题符合的文献，具体来说：如果前面所说的“主题 xxx”已指定，务必详情陈述不低于 50 篇（如果有的话）；如果“主题 xxx”未指定，务必详情陈述不低于 80 篇（如果有的话），以提高全面分析的深度和广度。\n- 额外提供一个尽可能包含所有分析结果的表格归纳版，且请在表格最后一列添加上面说的“文献链接”信息（须【不做任何改变地】继承该文献 itemLink 字段的信息，示例：[zotero://select/library/items/5AWAN6UB](zotero://select/library/items/5AWAN6UB)）。注意：不要只提供表格而缺乏详情陈述。\n- 请在你的输出结果的开头位置，务必用”无序列表“提及一下[文献 JSON 数据]的两个信息，即：“数据来源”和“数据来源地址”，须不做任何修改地对应 \"summary\" 中 \"dataSource（数据来源\"的键值、以及 \"dataSource url（数据来源地址）\"的键值。\n\n[文献 JSON 数据] 如下:\n    ",
  'aiAnalysis_itemsFromLibrary': async function (param46, param47) {
    let var564 = Zotero.Libraries.userLibraryID,
      var565 = await Zotero.Items.getAll(var564);
    if (!var565.length) {
      Services.prompt.alert(window, param46, '❌\x20未发现任何条目！');
      return;
    }
    let var566 = Zotero.AI4Paper.aiAnalysis_getItemsJSON(var565, param47, "Zotero 我的文库", "zotero://select/library/user");
    Zotero.AI4Paper.import2MessageInputBox(Zotero.AI4Paper.aiAnalysis_prompt + '\x0a' + var566);
  },
  'onClickCollectionMenu_aiAnalysisItemsTitle': async function (param48, param49) {
    let var567 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var567) {
      Services.prompt.alert(window, "❌ 未开启【GPT 侧边栏】", "任意【选择一个 PDF 标签页】，或【任意打开一篇文献】，即可打开【GPT 侧边栏】。");
      return;
    }
    let var568 = window.document.querySelector("#ai4paper-window-gptSidePane-button");
    if (var568) {
      var568.click();
    } else return;
    await Zotero.Promise.delay(0xfa);
    await Zotero.AI4Paper.aiAnalysis_itemsFromSelectedCollection(param48, param49);
  },
  'aiAnalysis_itemsFromSelectedCollection': async function (param50, param51) {
    let {
        items: _0x56d163,
        selectionType: _0x46ee80,
        name: _0x3373c0,
        itemsAfterRecursion: _0x206cdb,
        link: _0x3b585f
      } = await Zotero.AI4Paper.getItemsFromCurrentSelection(true),
      var569 = _0x46ee80 != "我的文库" ? "【Zotero " + _0x46ee80 + '】：' + _0x3373c0 : "Zotero " + _0x46ee80;
    _0x56d163 = _0x56d163.filter(_0x2b0b21 => _0x2b0b21.isRegularItem());
    let var570, var571;
    if (['分类', "群组中的分类"].includes(_0x46ee80)) {
      _0x206cdb = _0x206cdb.filter(_0x3c2c46 => _0x3c2c46.isRegularItem());
      if (_0x56d163.length < _0x206cdb.length) {
        var571 = Services.prompt.confirm(window, param50, "您选择了“" + _0x46ee80 + "”：【" + _0x3373c0 + '】，其中包含\x20👉【' + _0x56d163.length + "】👈 个常规条目，\n\n但是【该分类及其子分类】中共有 👉【" + _0x206cdb.length + "】👈 个常规条目。\n\n是否要连同子分类一起导入？点击 OK 以确定，否则仅导入选中分类。");
        if (var571) {
          _0x56d163 = _0x206cdb;
          var569 = '【Zotero\x20' + _0x46ee80 + "及其子分类】：" + _0x3373c0;
        }
        var570 = true;
      }
    }
    if (!_0x56d163.length) {
      Services.prompt.alert(window, param50, "❌ 未在主界面选择任何【分类/保存的搜索/群组/RSS 订阅】，或您的选择下不含任何常规条目！");
      return;
    }
    if (!var570) {
      let _0x2b1692 = _0x46ee80 != "我的文库" ? "您选择了“" + _0x46ee80 + "”：【" + _0x3373c0 + '】，共【' + _0x56d163.length + "】个常规条目，是否确认开始 AI 分析？" : "您选择了【我的文库】，共【" + _0x56d163.length + "】个常规条目，是否确认开始 AI 分析？";
      var571 = Services.prompt.confirm(window, param50, _0x2b1692);
      if (!var571) return;
    }
    let var573 = Zotero.AI4Paper.aiAnalysis_getItemsJSON(_0x56d163, param51, var569, _0x3b585f);
    Zotero.AI4Paper.import2MessageInputBox(Zotero.AI4Paper.aiAnalysis_prompt + '\x0a' + var573);
  },
  'aiAnalysis_getItemsJSON': function (param52, param53, param54, param55) {
    let var574 = param52.filter(_0x3c96f3 => _0x3c96f3.isRegularItem()),
      var575 = var574.filter(_0x2221db => _0x2221db.itemType === "journalArticle"),
      var576 = var574.filter(_0x5dd399 => _0x5dd399.itemType === 'thesis'),
      var577 = var574.filter(_0xad5afe => _0xad5afe.itemType === 'conferencePaper'),
      var578 = var574.filter(_0x139e7c => _0x139e7c.itemType === 'book'),
      var579 = {
        'summary': {
          'total\x20number\x20of\x20papers（全部文献数量）': var574.length,
          'number\x20of\x20journalArticle\x20papers（期刊文献数量）': var575.length,
          'number\x20of\x20thesis\x20papers（学位论文数量）': var576.length,
          'number\x20of\x20conferencePaper\x20papers（会议论文数量）': var577.length,
          'number\x20of\x20book\x20papers（书籍文献数量）': var578.length,
          'dataSource（数据来源）': param54,
          'dataSource\x20url（数据来源地址）': '[' + param55 + '](' + param55 + ')'
        }
      };
    return var579.paperDetails = {}, var574.forEach((_0x3af15d, _0x3d3970) => {
      let var580 = {
        'title': _0x3af15d.getField('title'),
        'year': _0x3af15d.getField('year'),
        'authors': Zotero.AI4Paper.getYAMLProp_creators(_0x3af15d),
        'itemType': _0x3af15d.itemType,
        'publicationTitle': _0x3af15d.getField('publicationTitle'),
        'impactFactor': _0x3af15d.getField('libraryCatalog').split('(')[0x0].trim(),
        'itemLink': '[' + Zotero.AI4Paper.getItemZoteroLink(_0x3af15d) + '](' + Zotero.AI4Paper.getItemZoteroLink(_0x3af15d) + ')'
      };
      param53 === "title_abstract" && (var580.abstract = _0x3af15d.getField("abstractNote"));
      var579.paperDetails[Number(_0x3d3970) + 0x1] = var580;
    }), JSON.stringify(var579, null, 0x2);
  },
  'getItemsFromCurrentSelection': async function (param56) {
    var var581 = [];
    let var582;
    var var583 = ZoteroPane.getSelectedCollection();
    if (var583) {
      var581 = var583.getChildItems();
      let _0x3d7c14 = await Zotero.AI4Paper.getAllItemsRecursively(var583);
      return Zotero.debug("从分类获取: " + var583.name), var582 = Zotero.Libraries.get(var583.libraryID).libraryType === "user" ? '分类' : "群组中的分类", {
        'items': var581,
        'selectionType': var582,
        'name': var583.name,
        'itemsAfterRecursion': _0x3d7c14,
        'link': Zotero.AI4Paper.getLinkBySelecttionType(var582, var583)
      };
    }
    var var585 = ZoteroPane.getSelectedSavedSearch();
    if (var585) {
      var var586 = new Zotero.Search();
      var586.libraryID = var585.libraryID;
      var586.addCondition("savedSearchID", 'is', var585.id);
      var var587 = await var586.search();
      return var581 = await Zotero.Items.getAsync(var587), param56 && (var581 = var581.map(_0x293c10 => {
        return _0x293c10.itemType === "annotation" && _0x293c10?.['parentItem']?.["parentItem"] ? _0x293c10?.["parentItem"]?.["parentItem"] : _0x293c10;
      })), Zotero.debug("从保存的搜索获取: " + var585.name), var582 = "保存的搜索", {
        'items': [...new Set(var581)],
        'selectionType': var582,
        'name': var585.name,
        'link': Zotero.AI4Paper.getLinkBySelecttionType(var582, var585)
      };
    }
    var var588 = ZoteroPane.getSelectedLibraryID();
    if (var588) {
      var var589 = Zotero.Libraries.get(var588);
      var581 = await Zotero.Items.getAll(var588);
      if (var589.isGroup) {
        return Zotero.debug("从群组获取"), var582 = '群组', {
          'items': var581,
          'selectionType': var582,
          'name': var589.name,
          'link': Zotero.AI4Paper.getLinkBySelecttionType(var582, var588)
        };
      } else {
        if (var589.libraryType === "user") {
          return Zotero.debug("从文库获取"), var582 = '我的文库', {
            'items': var581,
            'selectionType': var582,
            'name': var589.name,
            'link': Zotero.AI4Paper.getLinkBySelecttionType(var582, var588)
          };
        } else {
          if (var589.libraryType === "feed") return Zotero.debug("从 RSS 订阅获取"), var582 = "RSS 订阅", {
            'items': var581,
            'selectionType': var582,
            'name': var589.name,
            'link': Zotero.AI4Paper.getLinkBySelecttionType(var582, var588)
          };
        }
      }
    }
    return {
      'items': var581
    };
  },
  'getAllItemsRecursively': async function (param57) {
    !param57 && (param57 = ZoteroPane.getSelectedCollection());
    let var590 = param57.getChildItems(),
      var591 = param57.getChildCollections();
    for (let var592 of var591) {
      let var593 = await Zotero.AI4Paper.getAllItemsRecursively(var592);
      var590 = var590.concat(var593);
    }
    return var590;
  },
  'getLinkBySelecttionType': function (param58, param59) {
    let var596;
    if (param58 === "我的文库") {
      var596 = 'zotero://select/library/user';
    } else {
      if (param58 === '群组') var596 = 'zotero://select/library/group/' + param59;else {
        if (param58 === "RSS 订阅") {
          var596 = "zotero://select/library/feed/" + param59;
        } else {
          if (['分类', "群组中的分类"].includes(param58)) var596 = Zotero.AI4Paper.getSelectedCollectionLink(param59);else param58 === "保存的搜索" && (var596 = Zotero.AI4Paper.getSelectedSavedSearchLink(param59));
        }
      }
    }
    return var596;
  },
  'onClickButton_Translate': async function (param73) {
    if (!param73) return false;
    let var659 = Zotero_Tabs._selectedID;
    const var660 = Zotero.Reader.getByTabID(var659);
    if (!var660) {
      return;
    }
    let var661 = Zotero.Prefs.get("ai4paper.selectedtexttrans");
    Zotero.Prefs.get("ai4paper.translationcrossparagraphs") && (param73 = '' + (var661 ? var661 + '\x20' : '') + param73);
    Zotero.AI4Paper.translateSourceText = param73;
    if (Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      var var662;
      if (window.document.getElementById('ai4paper-translate-readersidepane')) {
        var662 = window.document.getElementById('ai4paper-translate-readersidepane').contentWindow;
        var662 && (var662.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = param73, var662.document.getElementById("ai4paper-translate-readerSidePane-response").value = '', var662.document.getElementById("ai4paper-translate-readerSidePane-response").placeholder = '这里显示翻译结果');
      }
    }
    Zotero.AI4Paper.updateTranslationPopupTextAreaPlaceHolder();
    Zotero.AI4Paper.translationEngineTask(param73, "onSelect");
  },
  'translationEngineTask': async function (param74, param75, param76) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    let var663 = '火山🆓';
    try {
      if (param75 === "onSelect") {
        let _0x1dea50 = Zotero.Prefs.get('ai4paper.selectedtexttransengine');
        if (!Object.keys(Zotero.AI4Paper.translationServiceList()).includes(_0x1dea50)) {
          _0x1dea50 = var663;
          Zotero.Prefs.set("ai4paper.selectedtexttransengine", var663);
        }
        if (["百度🔑", "百度垂直🔑", "百度大模型🔑"].includes(_0x1dea50)) await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[_0x1dea50].method.transSelectedText](param74, _0x1dea50);else {
          if (_0x1dea50 === "GPT🔑") {
            let var665 = Zotero.Prefs.get("ai4paper.translationOpenAIService");
            if (var665.includes('GPT\x20自定')) for (let var666 of Object.keys(Zotero.AI4Paper.gptCustom_numEmoji)) {
              var665 === "GPT 自定 " + Zotero.AI4Paper.gptCustom_numEmoji[var666] && (await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[_0x1dea50][var665].method.transSelectedText](param74, var666));
            } else await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[_0x1dea50][var665].method.transSelectedText](param74);
          } else await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[_0x1dea50].method.transSelectedText](param74);
        }
      } else {
        if (param75 === "vocabulary") {
          let var667 = Zotero.Prefs.get('ai4paper.vocabularybooktransengine');
          !Object.keys(Zotero.AI4Paper.translationServiceList()).includes(var667) && (var667 = var663, Zotero.Prefs.set("ai4paper.vocabularybooktransengine", var663));
          ['百度🔑', "百度垂直🔑", '百度大模型🔑'].includes(var667) ? await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[var667].method.transVocabulary](param76, param74, var667) : await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[var667].method.transVocabulary](param76, param74);
        }
      }
    } catch (_0x1d4be2) {
      Zotero.debug(_0x1d4be2);
    }
  },
  'translationEngineTask_annotationText': async function (param77, param78) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    let var668 = "火山🆓";
    try {
      let var669 = Zotero.Prefs.get("ai4paper.annotationTranslationEngine");
      !Object.keys(Zotero.AI4Paper.translationServiceList()).includes(var669) && (var669 = var668, Zotero.Prefs.set('ai4paper.annotationTranslationEngine', var668));
      if (['百度🔑', "百度垂直🔑", '百度大模型🔑'].includes(var669)) await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[var669].method.transAnnotation](param77, param78, var669);else {
        if (var669 === "GPT🔑") {
          let var670 = Zotero.Prefs.get("ai4paper.translationOpenAIService");
          if (var670.includes("GPT 自定")) {
            for (let var671 of Object.keys(Zotero.AI4Paper.gptCustom_numEmoji)) {
              var670 === "GPT 自定 " + Zotero.AI4Paper.gptCustom_numEmoji[var671] && (await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[var669][var670].method.transAnnotation](param77, param78, var671));
            }
          } else await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[var669][var670].method.transAnnotation](param77, param78);
        } else await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[var669].method.transAnnotation](param77, param78);
      }
    } catch (_0x429a84) {
      Zotero.debug(_0x429a84);
    }
  },
  'translationEngineTask_title_abstract': async function (param79, param80) {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    let var672 = "火山🆓";
    try {
      let var673 = Zotero.Prefs.get("ai4paper.titleabstransengine");
      !Object.keys(Zotero.AI4Paper.translationServiceList()).includes(var673) && (var673 = var672, Zotero.Prefs.set("ai4paper.titleabstransengine", var672));
      ["百度🔑", "百度垂直🔑", "百度大模型🔑"].includes(var673) ? (await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[var673].method.transField](param79, param80, var673), await new Promise(_0x2c03e7 => setTimeout(_0x2c03e7, 0x4b0))) : (await Zotero.AI4Paper[Zotero.AI4Paper.translationServiceList()[var673].method.transField](param79, param80), await new Promise(_0x168237 => setTimeout(_0x168237, 0x12c)));
    } catch (_0x3b45c8) {
      Zotero.debug(_0x3b45c8);
    }
  },
  'updateUniversalQuoteLink': async function (param300) {
    let var2440 = this.getCurrentReader();
    if (!var2440) return;
    if (!var2440._state.sidebarOpen) return Zotero.Prefs.get('ai4paper.enableannotationsvginFloatingWindow') && (await Zotero.AI4Paper.updateUniversalQuoteLink_floatingWindow(var2440, param300)), false;
    if (!Zotero.Prefs.get("ai4paper.enableannotationsvgVisitUniversalQuoteLink")) return;
    const var2441 = var2440._iframeWindow.document;
    let var2442 = param300.key,
      var2443 = "enableannotationsvgVisitUniversalQuoteLink",
      var2444 = "zoteroone-annotation-button-" + var2443 + '-' + var2442,
      var2445 = '' + param300.annotationComment;
    if (!var2445 || !Zotero.AI4Paper.hasUniversalQuoteLink(var2445)) {
      var2441.querySelectorAll('#' + var2444).forEach(_0x1a5670 => _0x1a5670.remove());
      return;
    }
    let var2446 = 0x0;
    while (!var2441.querySelector("[data-sidebar-annotation-id=\"" + param300.key + '\x22]')) {
      if (var2446 >= 0x190) {
        Zotero.debug('AI4Paper:\x20Waiting\x20for\x20annotation\x20failed');
        return;
      }
      await Zotero.Promise.delay(0x5);
      var2446++;
    }
    let var2447 = var2441.querySelector("[data-sidebar-annotation-id=\"" + param300.key + '\x22]');
    if (!var2447) return;
    let var2448 = var2447.querySelector(".more");
    if (!var2448) return;
    Zotero.AI4Paper.createAnnotationButton_VisitUniversalQuoteLink(var2440, var2441, var2447, var2448, param300, var2442);
  },
  'updateUniversalQuoteLink_floatingWindow': async function (param301, param302) {
    const var2449 = param301._iframeWindow.document;
    let var2450 = param302.key,
      var2451 = 'enableannotationsvgVisitUniversalQuoteLink',
      var2452 = 'zoteroone-annotation-button-' + var2451 + '-' + var2450,
      var2453 = '' + param302.annotationComment;
    if (!var2453 || !Zotero.AI4Paper.hasUniversalQuoteLink(var2453)) {
      var2449.querySelectorAll('#' + var2452).forEach(_0x3f016c => _0x3f016c.remove());
      return;
    }
    let var2454 = var2449.querySelector(".annotation-popup"),
      var2455 = var2454.querySelector(".more");
    if (!var2455) return;
    Zotero.AI4Paper.createAnnotationButton_VisitUniversalQuoteLink(param301, var2449, var2454, var2455, param302, var2450);
  },
  'hasUniversalQuoteLink': function (param303) {
    let var2456 = param303.indexOf("![[");
    if (var2456 != -0x1) {
      let _0xd4d946 = param303.substring(var2456),
        _0x43da86 = _0xd4d946.indexOf(']]');
      if (_0x43da86 != -0x1) {
        let var2459 = _0xd4d946.substring(0x0, _0x43da86),
          var2460 = var2459.indexOf('itemKey=');
        if (var2460 != -0x1) {
          let _0x4c3bf1 = var2459.indexOf('page='),
            _0x20f724 = var2459.indexOf("annotation=");
          if (_0x4c3bf1 != -0x1 && _0x20f724 != -0x1) {
            let var2463 = var2459.substring(var2460 + 0x9, _0x4c3bf1 - 0x2),
              var2464 = var2459.substring(_0x4c3bf1 + 0x6, _0x20f724 - 0x2),
              var2465 = var2459.substring(_0x20f724 + 0xc, var2459.length - 0x1);
            return {
              'annotationLink': "zotero://open-pdf/library/items/" + var2463 + '?page=' + var2464 + "&annotation=" + var2465,
              'annotationID': var2465
            };
          }
        }
      }
    }
    return false;
  },
  'registerMenuToReaderMenu': function () {
    let var2466 = Zotero.AI4Paper.id,
      var2467 = "createAnnotationContextMenu";
    if (Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuCopyExternalLink") && !Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLink) {
      Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLink = _0x2b348c => {
        let {
          reader: _0x4bb9f1,
          params: _0x13f7b9,
          append: _0x1dd40c
        } = _0x2b348c;
        _0x1dd40c({
          'label': "拷贝注释",
          'onCommand'() {
            Zotero.AI4Paper && Zotero.AI4Paper.copyAnnotationLink_handler(_0x4bb9f1, _0x13f7b9);
          }
        });
      };
      Zotero.Reader.registerEventListener(var2467, Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLink, var2466);
    } else !Zotero.Prefs.get('ai4paper.enableAnnotationContextMenuCopyExternalLink') && (Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(_0x1756ca => !(_0x1756ca.type === "createAnnotationContextMenu" && _0x1756ca.handler === Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLink)), Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLink = null);
    if (Zotero.Prefs.get('ai4paper.enableAnnotationContextMenuCopyText') && !Zotero.AI4Paper._handler_readerContextMenu_copyText) {
      Zotero.AI4Paper._handler_readerContextMenu_copyText = _0x734ba9 => {
        let {
          reader: _0x12f0fa,
          params: _0xdb6c8f,
          append: _0x2a9018
        } = _0x734ba9;
        _0x2a9018({
          'label': '拷贝注释文本',
          'onCommand'() {
            if (Zotero.AI4Paper) {
              Zotero.AI4Paper.copyAnnotationText_handler(_0x12f0fa, _0xdb6c8f);
            }
          }
        });
      };
      Zotero.Reader.registerEventListener(var2467, Zotero.AI4Paper._handler_readerContextMenu_copyText, var2466);
    } else !Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuCopyText") && (Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(_0x469e70 => !(_0x469e70.type === "createAnnotationContextMenu" && _0x469e70.handler === Zotero.AI4Paper._handler_readerContextMenu_copyText)), Zotero.AI4Paper._handler_readerContextMenu_copyText = null);
    if (Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuCopyExternalLinkOnly") && !Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkOnly) {
      Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkOnly = _0x3153e4 => {
        let {
          reader: _0x440600,
          params: _0xc7e0be,
          append: _0x31e55e
        } = _0x3153e4;
        _0x31e55e({
          'label': "拷贝注释回链",
          'onCommand'() {
            if (Zotero.AI4Paper) {
              Zotero.AI4Paper.copyAnnotationLinkOnly_handler(_0x440600, _0xc7e0be);
            }
          }
        });
      };
      Zotero.Reader.registerEventListener(var2467, Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkOnly, var2466);
    } else {
      if (!Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuCopyExternalLinkOnly")) {
        Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(_0x39bdbf => !(_0x39bdbf.type === 'createAnnotationContextMenu' && _0x39bdbf.handler === Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkOnly));
        Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkOnly = null;
      }
    }
    if (Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuCopyExternalLinkMDOnly") && !Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkMDOnly) {
      Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkMDOnly = _0x1d97f8 => {
        let {
          reader: _0x2ff81e,
          params: _0x4e847a,
          append: _0x3607e9
        } = _0x1d97f8;
        _0x3607e9({
          'label': '拷贝注释回链（MD）',
          'onCommand'() {
            Zotero.AI4Paper && Zotero.AI4Paper.copyAnnotationLinkMD_handler(_0x2ff81e, _0x4e847a);
          }
        });
      };
      Zotero.Reader.registerEventListener(var2467, Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkMDOnly, var2466);
    } else !Zotero.Prefs.get('ai4paper.enableAnnotationContextMenuCopyExternalLinkMDOnly') && (Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(_0x480318 => !(_0x480318.type === "createAnnotationContextMenu" && _0x480318.handler === Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkMDOnly)), Zotero.AI4Paper._handler_readerContextMenu_copyAnnotationLinkMDOnly = null);
    if (Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuOptimizeSpaces") && !Zotero.AI4Paper._handler_readerContextMenu_optimizeSpaces) {
      Zotero.AI4Paper._handler_readerContextMenu_optimizeSpaces = _0x43cb9b => {
        let {
          reader: _0x35485e,
          params: _0x5e4dff,
          append: _0x568d31
        } = _0x43cb9b;
        _0x568d31({
          'label': "优化空格",
          'onCommand'() {
            Zotero.AI4Paper && Zotero.AI4Paper.optimizeSpaces_annotationContextMenu_handler(_0x35485e, _0x5e4dff);
          }
        });
      };
      Zotero.Reader.registerEventListener(var2467, Zotero.AI4Paper._handler_readerContextMenu_optimizeSpaces, var2466);
    } else !Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuOptimizeSpaces") && (Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(_0x24a202 => !(_0x24a202.type === 'createAnnotationContextMenu' && _0x24a202.handler === Zotero.AI4Paper._handler_readerContextMenu_optimizeSpaces)), Zotero.AI4Paper._handler_readerContextMenu_optimizeSpaces = null);
    if (Zotero.Prefs.get('ai4paper.enableAnnotationContextMenuOptimizeSpacesInAnnotationComment') && !Zotero.AI4Paper._handler_readerContextMenu_optimizeSpacesInAnnotationComment) {
      Zotero.AI4Paper._handler_readerContextMenu_optimizeSpacesInAnnotationComment = _0x4c31c2 => {
        let {
          reader: _0x176f94,
          params: _0x2e55e0,
          append: _0x29a7e6
        } = _0x4c31c2;
        _0x29a7e6({
          'label': '优化注释评论中的空格',
          'onCommand'() {
            Zotero.AI4Paper && Zotero.AI4Paper.optimizeSpaces_annotationContextMenu_handler(_0x176f94, _0x2e55e0, true);
          }
        });
      };
      Zotero.Reader.registerEventListener(var2467, Zotero.AI4Paper._handler_readerContextMenu_optimizeSpacesInAnnotationComment, var2466);
    } else {
      if (!Zotero.Prefs.get("ai4paper.enableAnnotationContextMenuOptimizeSpacesInAnnotationComment")) {
        Zotero.Reader._registeredListeners = Zotero.Reader._registeredListeners.filter(_0x38dab9 => !(_0x38dab9.type === "createAnnotationContextMenu" && _0x38dab9.handler === Zotero.AI4Paper._handler_readerContextMenu_optimizeSpacesInAnnotationComment));
        Zotero.AI4Paper._handler_readerContextMenu_optimizeSpacesInAnnotationComment = null;
      }
    }
  },
  'onClickButton_viewThumbnail': async function (param317) {
    let var2526 = this.getCurrentReader();
    if (var2526._item.attachmentContentType != 'application/pdf') {
      return;
    }
    let var2527 = 0x0;
    while (!param317.document.querySelector("#viewThumbnail")) {
      if (var2527 >= 0xc8) {
        Zotero.debug("AI4Paper: Waiting for viewThumbnail button failed");
        return;
      }
      await Zotero.Promise.delay(0xa);
      var2527++;
    }
    let var2528 = param317.document.querySelector("#viewThumbnail");
    !var2528._onClickButton && (var2528._onClickButton = true, var2528.addEventListener("click", async _0x88f0fc => {
      await Zotero.Promise.delay(0x5);
      Zotero.AI4Paper.addAnnotationButton(var2526);
    }, false));
  },
  'onClickButton_viewOutline': async function (param318) {
    function fn11(param319) {
      let var2529 = param319.document.querySelectorAll(".expandable");
      for (_toc of var2529) {
        if (!_toc.classList.contains('expanded')) return false;
      }
      return true;
    }
    async function fn12(param320) {
      let _0x22e80f = param320.document.querySelectorAll(".expandable"),
        _0x675df9 = false;
      for (_toc of _0x22e80f) {
        if (!_toc.classList.contains("expanded")) {
          _toc.childNodes[0x0].click();
          await Zotero.Promise.delay(0x3);
          _0x675df9 = true;
        }
      }
      _0x675df9 && fn12(param320);
    }
    function fn13(param321) {
      let _0x4b36de = param321.document.querySelectorAll(".expandable");
      for (_toc of _0x4b36de) {
        if (!_toc) {
          continue;
        }
        _toc.classList.contains("expanded") && _toc.childNodes[0x0].click();
      }
    }
    let var2533 = 0x0;
    while (!param318.document.querySelector('#viewOutline')) {
      if (var2533 >= 0xc8) {
        Zotero.debug('AI4Paper:\x20Waiting\x20for\x20viewOutline\x20button\x20failed');
        return;
      }
      await Zotero.Promise.delay(0xa);
      var2533++;
    }
    let var2534 = param318.document.querySelector("#viewOutline");
    !var2534._onClickButton && (var2534._onClickButton = true, var2534.addEventListener("click", _0x2b7209 => {
      !fn11(param318) ? fn12(param318) : fn13(param318);
    }, false));
  },
  'updateAddColorLabelState': function () {
    let var2535 = Zotero_Tabs._selectedID;
    var var2536 = Zotero.Reader.getByTabID(var2535);
    if (!var2536 || !Zotero.AI4Paper.betterURL()) {
      return false;
    }
    let var2537 = var2536._iframeWindow;
    this.addButtonColorLabel(var2537);
    this.addAnnotationButtonsInFloatingWindow(var2537);
  },
  'vocabulary2TransNote': async function (param323, param324) {
    if (Zotero.AI4Paper.letDOI()) {
      Zotero.AI4Paper.CheckPDFReader() && !Zotero.Prefs.get("ai4paper.disablepdfreadertransprogresswindow") && Zotero.AI4Paper.showProgressWindow(0x1388, "【金山词霸】" + param323, '' + param324.replace(/<br>/g, '\x20'), "iciba");
      if (Zotero.Prefs.get('ai4paper.translationviewerenable')) {
        await Zotero.AI4Paper.updateTransViewerVocabulary(param323, param324);
      }
      if (Zotero.Prefs.get('ai4paper.translationrecordnote')) {
        let var2540 = Zotero.AI4Paper.getCurrentItem(true);
        if (var2540) {
          var var2541 = await Zotero.AI4Paper.createNoteItem_basedOnTag(var2540, "/划词翻译");
          var2541 && (await Zotero.AI4Paper.updateTransRecordNoteVocabulary(var2541, param323, param324));
        }
      }
      Zotero.Prefs.get("ai4paper.translationautocopy") && Zotero.AI4Paper.copy2Clipboard(param324);
    }
  },
  'updateTransViewerVocabulary': async function (param325, param326) {
    if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) {
      var var2542 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param326 + "</blockquote>";
    } else {
      if (Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition")) var var2542 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param326 + "<p>" + '👉\x20' + param325 + "</blockquote>";else var var2542 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>👉 " + param325 + "<p>" + param326 + '</blockquote>';
    }
    let var2543,
      var2544 = Zotero.Prefs.get("ai4paper.translationViewerItemKey");
    var2544 && (var2543 = Zotero.Items.getByLibraryAndKey(0x1, var2544));
    if (var2543 && var2543.isNote() && !var2543.deleted) {
      let var2545 = var2543;
      if (Zotero.Prefs.get("ai4paper.translationviewerrecord")) {
        await Zotero.AI4Paper.Set2ReverseTransViewer(var2545);
        let var2546 = var2545.getNote();
        if (var2546.indexOf("</h2>") != -0x1) {
          let var2547 = var2546.indexOf('</h2>');
          var2546 = var2546.substring(var2547 + 0x5);
        }
        Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext") ? var2542 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param326 + "</blockquote>" + var2546 : Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition") ? var2542 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param326 + "<p>" + "👉 " + param325 + "</blockquote>" + var2546 : var2542 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>👉 " + param325 + '<p>' + param326 + '</blockquote>' + var2546;
      }
      var2545.setNote(var2542);
      var2545.hasTag("/翻译查看器") && (var2545.removeTag("/翻译查看器"), var2545.addTag('/AI对话历史'));
      await var2545.saveTx();
      Zotero.Prefs.set('ai4paper.translationViewerItemKey', var2545.key);
    } else {
      var var2548 = new Zotero.Search();
      var2548.libraryID = Zotero.Libraries.userLibraryID;
      var2548.addCondition("itemType", 'is', 'note');
      var2548.addCondition("tag", 'is', "/AI对话历史");
      var var2549 = await var2548.search(),
        var2550 = await Zotero.Items.getAsync(var2549);
      if (var2550.length === 0x0) {
        let var2551 = new Zotero.Item("note");
        var2551.addTag("/AI对话历史");
        var2551.setNote(var2542);
        await var2551.saveTx();
        Zotero.Prefs.set("ai4paper.translationViewerItemKey", var2551.key);
      } else {
        let var2552 = var2550[0x0];
        if (Zotero.Prefs.get("ai4paper.translationviewerrecord")) {
          await Zotero.AI4Paper.Set2ReverseTransViewer(var2552);
          let var2553 = var2552.getNote();
          if (var2553.indexOf('</h2>') != -0x1) {
            let _0x3a74f1 = var2553.indexOf("</h2>");
            var2553 = var2553.substring(_0x3a74f1 + 0x5);
          }
          if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) var2542 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param326 + "</blockquote>" + var2553;else {
            Zotero.Prefs.get('ai4paper.translationrecordnotesourcetextposition') ? var2542 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param326 + '<p>' + '👉\x20' + param325 + '</blockquote>' + var2553 : var2542 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>👉 " + param325 + "<p>" + param326 + "</blockquote>" + var2553;
          }
        }
        var2552.setNote(var2542);
        await var2552.saveTx();
        Zotero.Prefs.set("ai4paper.translationViewerItemKey", var2552.key);
      }
    }
  },
  'Set2ReverseTransViewer': async function (param327) {
    var var2555 = param327.getNote();
    let var2556 = parseInt(Zotero.Prefs.get("ai4paper.gptChatHistoryViewerRecordNum"));
    if (var2555.indexOf("🌈 AI 对话历史") != -0x1 && var2555.indexOf('<h2\x20style=\x22color:\x20blue') != -0x1) {
      var var2557 = [],
        var2558 = [],
        var2559 = [],
        var2560 = new RegExp("<blockquote>", 'g'),
        var2561 = new RegExp("</blockquote>", 'g');
      while (var2560.exec(var2555) != null && var2561.exec(var2555) != null) {
        var2557.push(var2560.lastIndex);
        var2558.push(var2561.lastIndex);
      }
      for (i = 0x0; i < var2556 && i < var2558.length; i++) {
        let _0x2bcba4 = var2555.substring(var2557[var2557.length - i - 0x1] - 0xc, var2558[var2558.length - i - 0x1]);
        var2559.push(_0x2bcba4);
      }
      let _0x281ad2 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2>" + var2559.join('');
      param327.setNote(_0x281ad2);
      await param327.saveTx();
    } else {
      if (var2555.indexOf("🌈 AI 对话历史") != -0x1 && var2555.indexOf("<h2 style=\"color: purple") != -0x1) {
        var var2557 = [],
          var2558 = [],
          var2559 = [],
          var2560 = new RegExp("<blockquote>", 'g'),
          var2561 = new RegExp('</blockquote>', 'g');
        while (var2560.exec(var2555) != null && var2561.exec(var2555) != null) {
          var2557.push(var2560.lastIndex);
          var2558.push(var2561.lastIndex);
        }
        for (i = 0x0; i < var2556 && i < var2558.length; i++) {
          let var2564 = var2555.substring(var2557[i] - 0xc, var2558[i]);
          var2559.push(var2564);
        }
        let var2565 = '<h2\x20style=\x22color:\x20purple;\x22>🌈\x20AI\x20对话历史>>>>>>></h2>' + var2559.join('');
        param327.setNote(var2565);
        await param327.saveTx();
      }
    }
  },
  'updateTransRecordNoteVocabulary': async function (param328, param329, param330) {
    Zotero.AI4Paper.Set2Reverse(param328);
    let var2566 = param328.getNote();
    if (var2566.indexOf("</h2>") != -0x1) {
      let var2567 = var2566.indexOf('</h2>');
      var2566 = var2566.substring(var2567 + 0x5);
    }
    if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) {
      if (Zotero.Prefs.get("ai4paper.translationrecordnotesinglerecord")) var var2568 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + param330 + '</blockquote>';else var var2568 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + param330 + "</blockquote>" + var2566;
    } else {
      if (Zotero.Prefs.get("ai4paper.translationrecordnotesinglerecord")) {
        if (Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition")) {
          var var2568 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + param330 + "<p>" + '👉\x20' + param329 + "</blockquote>";
        } else var var2568 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>👉 " + param329 + "<p>" + param330 + "</blockquote>";
      } else {
        if (Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition")) var var2568 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + param330 + "<p>" + "👉 " + param329 + '</blockquote>' + var2566;else {
          var var2568 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>👉 " + param329 + "<p>" + param330 + "</blockquote>" + var2566;
        }
      }
    }
    param328.setNote(var2568);
    await param328.saveTx();
    Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") && Zotero.AI4Paper.itemModification2OB();
  },
  'Set2Reverse': async function (param331) {
    var var2569 = param331.getNote();
    if (var2569.indexOf('📑\x20翻译正序') != -0x1) {
      var var2570 = [],
        var2571 = [],
        var2572 = [],
        var2573 = new RegExp('<blockquote>', 'g'),
        var2574 = new RegExp("</blockquote>", 'g');
      while (var2573.exec(var2569) != null && var2574.exec(var2569) != null) {
        var2570.push(var2573.lastIndex);
        var2571.push(var2574.lastIndex);
      }
      for (i = 0x0; i < var2571.length; i++) {
        let var2575 = var2569.substring(var2570[var2570.length - i - 0x1] - 0xc, var2571[var2571.length - i - 0x1]);
        var2572.push(var2575);
      }
      let var2576 = '<h2\x20style=\x22color:\x20purple;\x22>📑\x20翻译倒序>>>>>>></h2>' + var2572.join('');
      param331.setNote(var2576);
      await param331.saveTx();
    }
  },
  'trans2ViewerANDRecord': async function (param332, param333) {
    if (Zotero.AI4Paper.letDOI()) {
      Zotero.Prefs.get("ai4paper.translationviewerenable") && (await Zotero.AI4Paper.updateTransViewer(param332, param333));
      if (Zotero.Prefs.get('ai4paper.translationrecordnote')) {
        let _0x3b8279 = Zotero.AI4Paper.getCurrentItem(true);
        if (_0x3b8279) {
          var var2580 = await Zotero.AI4Paper.createNoteItem_basedOnTag(_0x3b8279, '/划词翻译');
          if (var2580) {
            await Zotero.AI4Paper.updateTransRecordNote(var2580, param332, param333);
          }
        }
      }
    }
  },
  'updateTransViewer': async function (param334, param335) {
    param334 = Zotero.AI4Paper.sliceGPTUserQuestion(param334);
    var var2581;
    Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext") ? var2581 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param335 + '</blockquote>' : Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition") ? var2581 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param335 + "<p>" + param334 + '</blockquote>' : var2581 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param334 + "<p>" + param335 + "</blockquote>";
    let var2582,
      var2583 = Zotero.Prefs.get('ai4paper.translationViewerItemKey');
    var2583 && (var2582 = Zotero.Items.getByLibraryAndKey(0x1, var2583));
    if (var2582 && var2582.isNote() && !var2582.deleted) {
      let var2584 = var2582;
      if (Zotero.Prefs.get("ai4paper.translationviewerrecord")) {
        await Zotero.AI4Paper.Set2ReverseTransViewer(var2584);
        let _0x1e8f15 = var2584.getNote();
        if (_0x1e8f15.indexOf("</h2>") != -0x1) {
          let var2586 = _0x1e8f15.indexOf('</h2>');
          _0x1e8f15 = _0x1e8f15.substring(var2586 + 0x5);
        }
        if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) var2581 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param335 + '</blockquote>' + _0x1e8f15;else {
          Zotero.Prefs.get('ai4paper.translationrecordnotesourcetextposition') ? var2581 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param335 + '<p>' + param334 + "</blockquote>" + _0x1e8f15 : var2581 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param334 + "<p>" + param335 + '</blockquote>' + _0x1e8f15;
        }
      }
      var2584.setNote(var2581);
      var2584.hasTag("/翻译查看器") && (var2584.removeTag("/翻译查看器"), var2584.addTag('/AI对话历史'));
      await var2584.saveTx();
      Zotero.Prefs.set("ai4paper.translationViewerItemKey", var2584.key);
    } else {
      var var2587 = new Zotero.Search();
      var2587.libraryID = Zotero.Libraries.userLibraryID;
      var2587.addCondition('itemType', 'is', 'note');
      var2587.addCondition("tag", 'is', "/AI对话历史");
      var var2588 = await var2587.search(),
        var2589 = await Zotero.Items.getAsync(var2588);
      if (var2589.length === 0x0) {
        let var2590 = new Zotero.Item("note");
        var2590.addTag("/AI对话历史");
        var2590.setNote(var2581);
        await var2590.saveTx();
        Zotero.Prefs.set('ai4paper.translationViewerItemKey', var2590.key);
      } else {
        let _0x356772 = var2589[0x0];
        if (Zotero.Prefs.get("ai4paper.translationviewerrecord")) {
          await Zotero.AI4Paper.Set2ReverseTransViewer(_0x356772);
          let _0x2c4bf2 = _0x356772.getNote();
          if (_0x2c4bf2.indexOf("</h2>") != -0x1) {
            let var2593 = _0x2c4bf2.indexOf("</h2>");
            _0x2c4bf2 = _0x2c4bf2.substring(var2593 + 0x5);
          }
          if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) var2581 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param335 + '</blockquote>' + _0x2c4bf2;else {
            Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition") ? var2581 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param335 + "<p>" + param334 + "</blockquote>" + _0x2c4bf2 : var2581 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2><blockquote>" + param334 + '<p>' + param335 + "</blockquote>" + _0x2c4bf2;
          }
        }
        _0x356772.setNote(var2581);
        await _0x356772.saveTx();
        Zotero.Prefs.set("ai4paper.translationViewerItemKey", _0x356772.key);
      }
    }
  },
  'sliceGPTUserQuestion': function (param336) {
    if (param336.indexOf("便于 Obsidian Dataview 插件调用") != -0x1) {
      let _0x2127a0 = param336.indexOf('文献内容如下所示:');
      if (_0x2127a0 != -0x1) return param336.substring(0x0, _0x2127a0 + 0x9) + "\n[此处省略全文...]";
    }
    return param336;
  },
  'updateTransRecordNote': async function (param337, param338, param339) {
    Zotero.AI4Paper.Set2Reverse(param337);
    let var2595 = param337.getNote();
    if (var2595.indexOf("</h2>") != -0x1) {
      let var2596 = var2595.indexOf("</h2>");
      var2595 = var2595.substring(var2596 + 0x5);
    }
    if (Zotero.Prefs.get("ai4paper.translationrecordnotenosourcetext")) {
      if (Zotero.Prefs.get('ai4paper.translationrecordnotesinglerecord')) {
        var var2597 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + param339 + '</blockquote>';
      } else var var2597 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + param339 + "</blockquote>" + var2595;
    } else {
      if (Zotero.Prefs.get('ai4paper.translationrecordnotesinglerecord')) {
        if (Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition")) {
          var var2597 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + param339 + '<p>' + param338 + "</blockquote>";
        } else var var2597 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + param338 + "<p>" + param339 + '</blockquote>';
      } else {
        if (Zotero.Prefs.get("ai4paper.translationrecordnotesourcetextposition")) {
          var var2597 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + param339 + "<p>" + param338 + "</blockquote>" + var2595;
        } else var var2597 = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2><blockquote>" + param338 + "<p>" + param339 + "</blockquote>" + var2595;
      }
    }
    param337.setNote(var2597);
    await param337.saveTx();
    Zotero.Prefs.get('ai4paper.obsidianautoupdatenotes') && Zotero.AI4Paper.itemModification2OB();
  },
  'toogleSortingTrans': async function () {
    var var2598 = Services.wm.getMostRecentWindow("navigator:browser");
    if (!var2598.ZoteroContextPane.activeEditor) return window.alert("请先在 Zotero 内置阅读器右侧打开笔记附件！"), false;else {
      let _0x4780ad = '',
        _0x21b6d7 = var2598.ZoteroContextPane.activeEditor._item.getTags(),
        _0xa2c9dc = Zotero.Items.get(var2598.ZoteroContextPane.activeEditor._item.id);
      if (_0x21b6d7.length) for (let var2602 of _0x21b6d7) {
        if (var2602.tag === '/划词翻译') _0x4780ad = '/划词翻译';else {
          if (var2602.tag === "/ChatGPT") _0x4780ad = "/ChatGPT";else {
            if (var2602.tag === '/AI对话历史') _0x4780ad = '/AI对话历史';else {
              if (var2602.tag === "/翻译查看器") {
                _0x4780ad = "/翻译查看器";
              }
            }
          }
        }
      }
      if (_0x4780ad === '') return window.alert("❌ 您打开的笔记附件不是【划词翻译】或【AI 对话历史】或【GPT 笔记】！"), false;else {
        if (_0x4780ad === '/翻译查看器') return window.alert("❌ 自 AI4paper v6.3.7 版本起，【翻译查看器】已升级为【AI 对话历史】。请删除原【翻译查看器】，再使用本功能。"), false;else {
          if (_0x4780ad === '/划词翻译') Zotero.AI4Paper.toogleSortingTransRecord(_0xa2c9dc);else {
            if (_0x4780ad === "/ChatGPT") Zotero.AI4Paper.toogleSortingChatGPTRecord(_0xa2c9dc);else _0x4780ad === "/AI对话历史" && Zotero.AI4Paper.toogleSortingTransViewer(_0xa2c9dc);
          }
        }
      }
    }
  },
  'toogleSortingTransRecord': async function (param340) {
    if (param340) {
      var var2603 = param340.getNote();
      if (var2603.indexOf('<blockquote>') === -0x1 && var2603.indexOf("</blockquote>") === -0x1) return window.alert("您在 AI4paper v2.8.0 以前版本中生成的翻译笔记，不再支持此命令！"), false;
      var var2604 = [],
        var2605 = [],
        var2606 = [],
        var2607 = new RegExp('<blockquote>', 'g'),
        var2608 = new RegExp("</blockquote>", 'g');
      while (var2607.exec(var2603) != null && var2608.exec(var2603) != null) {
        var2604.push(var2607.lastIndex);
        var2605.push(var2608.lastIndex);
      }
      for (i = 0x0; i < var2605.length; i++) {
        let var2609 = var2603.substring(var2604[var2604.length - i - 0x1] - 0xc, var2605[var2605.length - i - 0x1]);
        var2606.push(var2609);
      }
      if (var2603.indexOf("📑 翻译倒序") != -0x1) {
        let var2610 = "<h2 style=\"color: blue;\">📑 翻译正序>>>>>>></h2>" + var2606.join('');
        param340.setNote(var2610);
        await param340.saveTx();
      } else {
        if (var2603.indexOf("📑 翻译正序") != -0x1) {
          let _0x49067a = "<h2 style=\"color: purple;\">📑 翻译倒序>>>>>>></h2>" + var2606.join('');
          param340.setNote(_0x49067a);
          await param340.saveTx();
        }
      }
    }
  },
  'toogleSortingChatGPTRecord': async function (param341) {
    if (param341) {
      var var2612 = param341.getNote();
      if (var2612.indexOf("<blockquote>") === -0x1 && var2612.indexOf("</blockquote>") === -0x1) return window.alert('您在\x20Zotero\x20One\x20v2.8.0\x20以前版本中生成的翻译笔记，不再支持此命令！'), false;
      var var2613 = [],
        var2614 = [],
        var2615 = [],
        var2616 = new RegExp("<blockquote>", 'g'),
        var2617 = new RegExp("</blockquote>", 'g');
      while (var2616.exec(var2612) != null && var2617.exec(var2612) != null) {
        var2613.push(var2616.lastIndex);
        var2614.push(var2617.lastIndex);
      }
      for (i = 0x0; i < var2614.length; i++) {
        let _0x1c6b4d = var2612.substring(var2613[var2613.length - i - 0x1] - 0xc, var2614[var2614.length - i - 0x1]);
        var2615.push(_0x1c6b4d);
      }
      if (var2612.indexOf('🤖️\x20ChatGPT\x20倒序') != -0x1) {
        let var2619 = "<h2 style=\"color: blue;\">🤖️ ChatGPT 正序>>>>>>></h2>" + var2615.join('');
        param341.setNote(var2619);
        await param341.saveTx();
      } else {
        if (var2612.indexOf("🤖️ ChatGPT 正序") != -0x1) {
          let _0x5db7fe = "<h2 style=\"color: #00ae89;\">🤖️ ChatGPT 倒序>>>>>>></h2>" + var2615.join('');
          param341.setNote(_0x5db7fe);
          await param341.saveTx();
        }
      }
    }
  },
  'toogleSortingTransViewer': async function (param342) {
    if (param342) {
      var var2621 = param342.getNote();
      if (var2621.indexOf("<blockquote>") === -0x1 && var2621.indexOf("</blockquote>") === -0x1) {
        return window.alert("您在 AI4paper v2.8.0 以前版本中生成的翻译笔记，不再支持此命令！"), false;
      }
      var var2622 = [],
        var2623 = [],
        var2624 = [],
        var2625 = new RegExp("<blockquote>", 'g'),
        var2626 = new RegExp("</blockquote>", 'g');
      while (var2625.exec(var2621) != null && var2626.exec(var2621) != null) {
        var2622.push(var2625.lastIndex);
        var2623.push(var2626.lastIndex);
      }
      for (i = 0x0; i < var2623.length; i++) {
        let var2627 = var2621.substring(var2622[var2622.length - i - 0x1] - 0xc, var2623[var2623.length - i - 0x1]);
        var2624.push(var2627);
      }
      if (var2621.indexOf("🌈 AI 对话历史") != -0x1 && var2621.indexOf("<h2 style=\"color: purple") != -0x1) {
        let _0x1c3781 = '<h2\x20style=\x22color:\x20blue;\x22>🌈\x20AI\x20对话历史>>>>>>></h2>' + var2624.join('');
        param342.setNote(_0x1c3781);
        await param342.saveTx();
      } else {
        if (var2621.indexOf("🌈 AI 对话历史") != -0x1 && var2621.indexOf("<h2 style=\"color: blue") != -0x1) {
          let _0x544823 = '<h2\x20style=\x22color:\x20purple;\x22>🌈\x20AI\x20对话历史>>>>>>></h2>' + var2624.join('');
          param342.setNote(_0x544823);
          await param342.saveTx();
        }
      }
    }
  },
  'openTransViewer': async function () {
    var var2630 = "<h2 style=\"color: purple;\">🌈 AI 对话历史>>>>>>></h2>",
      var2631 = new Zotero.Search();
    var2631.libraryID = Zotero.Libraries.userLibraryID;
    var2631.addCondition("itemType", 'is', "note");
    var2631.addCondition("tag", 'is', "/AI对话历史");
    var var2632 = await var2631.search(),
      var2633 = await Zotero.Items.getAsync(var2632);
    if (var2633.length === 0x0) {
      let var2634 = new Zotero.Item("note");
      Zotero.Prefs.set("ai4paper.translationViewerItemKey", var2634.key);
      var2634.addTag('/AI对话历史');
      var2634.setNote(var2630);
      await var2634.saveTx();
      ZoteroPane_Local.openNoteWindow(var2634.itemID);
    } else {
      let var2635 = var2633[0x0];
      Zotero.Prefs.set("ai4paper.translationViewerItemKey", var2635.key);
      ZoteroPane_Local.openNoteWindow(var2635.itemID);
    }
  },
  'annotationTextTrans': async function (param343, param344) {
    let var2636 = param343.annotationText;
    if (Zotero.AI4Paper.isChineseText(var2636)) {
      return false;
    }
    if (Zotero.Prefs.get("ai4paper.translationvocabularyfirst")) {
      if (var2636.indexOf('\x20') === -0x1) {
        var2636 = var2636.trim();
        var2636 = var2636.toLowerCase();
        var2636 = var2636.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
        var2636 = var2636.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
        var2636 = var2636.replace(/[0-9]/g, '');
        let var2637 = await Zotero.AI4Paper.vocabularySearchAnnotationTrans(var2636);
        if (var2637 && var2637 != -0x1) return Zotero.AI4Paper.addTrans2AnnotationComment(param343, var2637, param344), -0x1;
      }
    }
    Zotero.AI4Paper.translationEngineTask_annotationText(param343, param344);
  },
  'addTrans2AnnotationComment': async function (param345, param346, param347) {
    let var2638 = '' + param345.annotationComment,
      var2639 = Zotero.Prefs.get("ai4paper.annotationTranslationSeparator").trim() ? Zotero.Prefs.get('ai4paper.annotationTranslationSeparator') : "【👈 译】";
    if (var2638 === "null") {
      param345.annotationComment = '' + param346 + var2639;
    } else var2638 != "null" && var2638.indexOf(var2639) === -0x1 && (param345.annotationComment = '' + param346 + var2639 + param345.annotationComment);
    await param345.saveTx();
  },
  'scite': function () {
    let var3607 = Zotero_Tabs._selectedID;
    var var3608 = Zotero.Reader.getByTabID(var3607);
    if (var3608) {
      let var3609 = var3608.itemID;
      var var3610 = Zotero.Items.get(var3609);
      var3610 && var3610.parentItemID && (var3609 = var3610.parentItemID, var3610 = Zotero.Items.get(var3609));
    } else {
      var var3610 = ZoteroPane.getSelectedItems()[0x0];
    }
    if (!var3610.isRegularItem()) {
      return window.alert('请您选择一个常规条目！'), false;
    }
    let var3611 = var3610.getField("DOI");
    if (var3611 === undefined || var3611 === '') {
      return window.alert("当前文献缺失 DOI 信息！"), false;
    }
    let var3612 = 'https://scite.ai/visualizations/' + var3611;
    ZoteroPane.loadURI(var3612);
  },
  'relatedPapers': function () {
    let var3613 = Zotero_Tabs._selectedID;
    var var3614 = Zotero.Reader.getByTabID(var3613);
    if (var3614) {
      let _0x9632d1 = var3614.itemID;
      var var3616 = Zotero.Items.get(_0x9632d1);
      var3616 && var3616.parentItemID && (_0x9632d1 = var3616.parentItemID, var3616 = Zotero.Items.get(_0x9632d1));
    } else var var3616 = ZoteroPane.getSelectedItems()[0x0];
    if (!var3616.isRegularItem()) {
      return window.alert("请您选择一个常规条目！"), false;
    }
    let var3617 = var3616.getField("DOI");
    if (!var3617) window.alert('当前文献缺失\x20DOI\x20信息！');else {
      let _0x10b603 = "https://api.semanticscholar.org/" + var3617;
      ZoteroPane.loadURI(_0x10b603);
    }
  },
  'connectedPapers': function () {
    let var3619 = Zotero_Tabs._selectedID;
    var var3620 = Zotero.Reader.getByTabID(var3619);
    if (var3620) {
      let var3621 = var3620.itemID;
      var var3622 = Zotero.Items.get(var3621);
      if (var3622 && var3622.parentItemID) {
        var3621 = var3622.parentItemID;
        var3622 = Zotero.Items.get(var3621);
      }
    } else var var3622 = ZoteroPane.getSelectedItems()[0x0];
    if (!var3622.isRegularItem()) {
      return window.alert("请您选择一个常规条目！"), false;
    }
    let var3623 = var3622.getField('DOI');
    if (var3623 === undefined || var3623 === '') return window.alert("当前文献缺失 DOI 信息！"), false;
    let var3624 = "https://connectedpapers.com/api/redirect/doi/" + var3623;
    ZoteroPane.loadURI(var3624);
  },
  'getItemsForAnnotationSImport': function () {
    let var4180 = Zotero_Tabs._selectedID;
    var var4181 = Zotero.Reader.getByTabID(var4180);
    if (var4181) {
      let _0x22c316 = var4181.itemID;
      var var4183 = Zotero.Items.get(_0x22c316);
      if (var4183 && var4183.parentItemID) {
        _0x22c316 = var4183.parentItemID;
        var4183 = Zotero.Items.get(_0x22c316);
        let var4184 = _0x22c316,
          var4185 = var4183.getField("title");
        return {
          'item_Title': var4185,
          'item_ID': var4184
        };
      } else return Services.prompt.alert(window, "❌ 温馨提示：", '您选的\x20PDF\x20无父条目，请创建父条目或重新选择！'), false;
    } else {
      var var4183 = ZoteroPane.getSelectedItems()[0x0];
    }
    if (var4183 === undefined) {
      return Services.prompt.alert(window, "❌ 温馨提示：", '请选择一个常规条目！'), false;
    }
    if (var4183.isRegularItem()) {
      let _0x2c774e = var4183.itemID,
        _0xbb153a = var4183.getField("title");
      return {
        'item_Title': _0xbb153a,
        'item_ID': _0x2c774e
      };
    } else return Services.prompt.alert(window, "❌ 温馨提示：", "您选择的不是常规条目！"), false;
  },
  'togglePaneDisplay': function (param1011, param1012, param1013) {
    var var5201 = ZoteroPane.document.getElementById(param1011 + "-pane"),
      var5202;
    if (param1011 == 'zotero-item') {
      var5202 = "s-splitter";
    } else var5202 = "-splitter";
    var var5203 = ZoteroPane.document.getElementById(param1011 + var5202);
    switch (param1012) {
      case "toggle":
        if (var5201.collapsed) {
          this.togglePaneDisplay(param1011, "show", param1013);
          if (param1011 == "zotero-collections") {
            let _0x17f96b = window.document.querySelector("#zotero-if-items-toolbar-button-collectionPaneDisplay");
            if (_0x17f96b) {
              _0x17f96b.innerHTML = Zotero.AI4Paper.svg_icon_20px.collectionpanedisplayToolBarButton;
            }
          }
          if (param1011 == "zotero-item") {
            let var5205 = window.document.querySelector("#zotero-if-items-toolbar-button-itemPaneDisplay");
            if (var5205) {
              var5205.innerHTML = Zotero.AI4Paper.svg_icon_20px.itempanedisplayToolBarButton;
            }
          }
        } else {
          this.togglePaneDisplay(param1011, "hide", param1013);
          if (param1011 == "zotero-collections") {
            let var5206 = window.document.querySelector('#zotero-if-items-toolbar-button-collectionPaneDisplay');
            var5206 && (var5206.innerHTML = Zotero.AI4Paper.svg_icon_20px.collectionpanedisplayToolBarButton_expand);
          }
          if (param1011 == "zotero-item") {
            let _0x5735ea = window.document.querySelector('#zotero-if-items-toolbar-button-itemPaneDisplay');
            _0x5735ea && (_0x5735ea.innerHTML = Zotero.AI4Paper.svg_icon_20px.itempanedisplayToolBarButton_expand);
          }
        }
        break;
      case "show":
        var5201.collapsed = false;
        !param1013 && var5203.removeAttribute('state');
        break;
      case 'hide':
        var5201.collapsed = true;
        var5203.setAttribute("state", "collapsed");
        break;
    }
  },
  'updateDatabase_ZoteroOnePrefs': function () {
    Zotero.AI4Paper.updateDatabase_fileshistory();
    Zotero.AI4Paper.updateDatabase_gptNotesAttachItems();
    Zotero.AI4Paper.updateDatabase_refsCollection();
  },
  'updateDatabase_fileshistory': function () {
    let var5301 = Zotero.Prefs.get("ai4paper.fileshistory"),
      var5302 = var5301.split("😊🎈🍓"),
      var5303 = [];
    for (let var5304 of var5302) {
      let var5305 = var5304.indexOf('🆔');
      if (var5305 != -0x1) {
        let var5306 = var5304.substring(0x0, var5305 + 0x3),
          var5307 = var5304.substring(var5305 + 0x3),
          var5308 = Zotero.AI4Paper.findItemByIDORKey(var5307);
        var5308 && var5303.push('' + var5306 + var5308.key);
      }
    }
    var5303.length && (Zotero.Prefs.set("ai4paper.fileshistory", var5303.join("😊🎈🍓")), Zotero.AI4Paper.showProgressWindow(0xbb8, "升级【设置】数据库", "✅【最近打开】设置数据库升级完成！"));
  },
  'updateDatabase_gptNotesAttachItems': function () {
    let var5309 = Zotero.Prefs.get('ai4paper.gptNotesAttachItems'),
      var5310 = [];
    for (let var5311 of var5309.split('\x0a')) {
      let var5312 = var5311.indexOf('🆔');
      if (var5312 != -0x1) {
        let var5313 = var5311.substring(0x0, var5312 + 0x3),
          var5314 = var5311.substring(var5312 + 0x3),
          var5315 = Zotero.AI4Paper.findItemByIDORKey(var5314);
        var5315 && var5310.push('' + var5313 + var5315.key);
      }
    }
    var5310.length && (Zotero.Prefs.set('ai4paper.gptNotesAttachItems', var5310.join('\x0a')), Zotero.AI4Paper.showProgressWindow(0xbb8, "升级【设置】数据库", '✅【GPT\x20笔记绑定条目】设置数据库升级完成！'));
  },
  'copyTranslationAPIKeys': function () {
    Zotero.AI4Paper.copy2Clipboard(JSON.stringify(Zotero.AI4Paper.translationServiceList(), null, 0x2));
    Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝全部【翻译 API-Keys】", "✅ 拷贝成功！共【" + Object.keys(Zotero.AI4Paper.translationServiceList()).length + "】条。");
  },
  'copyGPTAPIKeys': function () {
    Zotero.AI4Paper.copy2Clipboard(JSON.stringify(Zotero.AI4Paper.gptServiceList(), null, 0x2));
    Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝全部【GPT API-Keys】", "✅ 拷贝成功！共【" + Object.keys(Zotero.AI4Paper.gptServiceList()).length + "】条。");
  },
  'openPluginSettingsAndFocusElement': async function (param1141, _0x134da4 = "zotero-prefpane-ai4paper") {
    const var6003 = await Zotero.Utilities.Internal.openPreferences(_0x134da4);
    await new Promise(_0x6484e3 => {
      var6003.document.readyState === "complete" ? _0x6484e3() : var6003.addEventListener("load", _0x6484e3, {
        'once': true
      });
    });
    await Zotero.Promise.delay(0x64);
    const var6004 = var6003.document.getElementById(param1141);
    if (var6004) {
      var6004.scrollIntoView({
        'behavior': "smooth",
        'block': "start"
      });
      var6004.focus();
    }
    return var6003;
  },
  'collectionsToolbar_buttons': ["collapseCollections"],
  'itemsToolbar_buttons': ["collectionPaneDisplay", "itemPaneDisplay", 'collectionitemPaneDisplay', "pinAttachments", 'batchAIInterpret', "go2favoritecollection", "preferences", "zoteroColorScheme", 'openwith', "fileshistory", "obsidiannote", "tagscardnotes", "archive", "showFile", "chatWithNewBing", "immersiveTranslate", "copyPDF"],
  'annotation_buttons': ['enableannotationsvgOptimizeSpaces', 'enableannotationsvgSetCommentTemplate', 'enableannotationsvghead', "enableannotationsvgtranslate", "enableannotationsvgtagsselect", "enableannotationsvgblockquotelink", "enableannotationsvgaudioplay", "enableannotationsvgAddWordsToEudic", "enableannotationsvguploadimage", "enableannotationsvgobsidianblock", "enableannotationsvgVisitUniversalQuoteLink"],
  'messageQuickButtons': ["Go2MessageTop", "CopyMessage", "CopyMessageSourceText", "SaveMessages", "ModifyUserMessage", 'UpdateAssistantMessage', "AddMessage2SelectedAnnotation", "CreateAIReadingNoteItem"],
  'chatButtons': ["ClearChat", "AIAnalysis", 'ImportFulltext', "ImportAbstract", 'AddNotes', "ImportAIReading", "LocateAIReadingNotes"],
  '_shortCuts_items': ["AddAnnotationTag", "CopyBlockQuoteLink", "SetAnnotationHead", "CardNotesSearch", 'AddRelatedRefs', "ZoteroAdvancedSearch", "CopyAnnotationLink", 'CopyAnnotationLinkOnly', "CopyAnnotationLinkMD", "CopyAnnotationText", 'CollapseLeftSidePane', "CollapseRightSidePane", "CopyPDFAttachmentsLink", "CopyPDF", "OpenWith", "ChatwithNewbing", 'ImmersiveTranslate', 'UniversalImmersiveTranslate', "AttachNewFile", "FilesHistory", "WorkSpace", 'RenameAttachments', "Archive", "SplitHorizontally", "SplitVertically", 'OddSpreads', "StarOne", "StarTwo", 'StarThree', "StarFour", "StarFive", "StarClear", "PaperAI", "LocateAIReadingNotes", "GetFullText", "ChangeGPTChatMode", "TagCardNotes", "ObsidianNote", "ObsidianBlock", 'SetCommentTemplate', 'LocateItemInPapersMatrix', "SearchCollectionInPapersMatrix"],
  'progressWindowIcon': {},
  'update_svg_icons': function (param1157) {
    try {
      Object.keys(Zotero.AI4Paper.svg_icon_20px).forEach(_0x525a82 => {
        param1157.querySelectorAll(".svg-container-" + _0x525a82).forEach(_0x1f0ed0 => {
          _0x1f0ed0.innerHTML = Zotero.AI4Paper.svg_icon_20px?.[_0x525a82];
        });
      });
    } catch (_0x3a9dc3) {
      Zotero.debug(_0x3a9dc3);
    }
    try {
      Object.keys(Zotero.AI4Paper.svg_icon_16px).forEach(_0x1580ce => {
        param1157.querySelectorAll('.svg-container-' + _0x1580ce).forEach(_0xb8526c => {
          _0xb8526c.innerHTML = Zotero.AI4Paper.svg_icon_16px?.[_0x1580ce];
        });
      });
    } catch (_0x2bfb3c) {
      Zotero.debug(_0x2bfb3c);
    }
  }
};