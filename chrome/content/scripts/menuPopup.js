Zotero.AI4Paper.MenuPopup = {
  '_store_added_elements': [],
  '_win': null,
  '_getWindow'() {
    var var1 = Services.wm.getEnumerator("navigator:browser");
    while (var1.hasMoreElements()) {
      let var2 = var1.getNext();
      if (!var2.ZoteroPane) continue;
      return var2;
    }
  },
  'init'() {
    this._win = this._getWindow();
    this.registerItemMenu();
    this.registerToolsMenu();
    this.registerCollectionMenu();
    this._win.MozXULElement.insertFTLIfNeeded("ai4paper_preferences.ftl");
  },
  'registerItemMenu'() {
    let var3 = this._win.document,
      var4 = Zotero.isMac,
      var5 = var3.createXULElement("menuseparator"),
      var6 = var3.createXULElement("menu");
    var6.id = 'zotero-itemmenu-ai4paper-go2Collection';
    var6.setAttribute("data-l10n-id", "ai4paper-go2Collection-itemmenu");
    !var4 && var6.setAttribute("class", "menu-iconic");
    var6.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/folder_20px.svg)" : "url(chrome://ai4paper/content/icons/collection-menu-iconic.png)";
    let var7 = var3.createXULElement("menupopup");
    var7.id = 'zotero-itemmenu-ai4paper-go2Collection-popup';
    var6.appendChild(var7);
    let var8 = var3.createXULElement("menu");
    var8.id = "zotero-itemmenu-ai4paper-go2favoritecollection";
    var8.setAttribute("data-l10n-id", "ai4paper-go2favoritecollection-itemmenu");
    !var4 && var8.setAttribute("class", "menu-iconic");
    var8.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/folder_20px.svg)" : 'url(chrome://ai4paper/content/icons/collection-menu-iconic.png)';
    let var9 = var3.createXULElement("menupopup");
    var9.id = "zotero-itemmenu-ai4paper-go2favoritecollection-popup";
    var8.appendChild(var9);
    let var10 = var3.createXULElement("menu");
    var10.id = 'zotero-itemmenu-ai4paper-star';
    var10.setAttribute("data-l10n-id", "ai4paper-star-itemmenu");
    !var4 && var10.setAttribute("class", "menu-iconic");
    var10.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/star_20px.svg)" : 'url(chrome://ai4paper/content/icons/star-menu-iconic.png)';
    let var11 = var3.createXULElement('menupopup');
    var11.id = "zotero-itemmenu-ai4paper-star-popup";
    let var12 = var3.createXULElement("menuitem");
    var12.id = "ai4paper-star1-itemmenuitem";
    var12.setAttribute("label", '⭐');
    var12.addEventListener("command", () => {
      Zotero.AI4Paper.starSelectedItems(0x1);
    });
    var11.appendChild(var12);
    var12 = var3.createXULElement("menuitem");
    var12.id = 'ai4paper-star2-itemmenuitem';
    var12.setAttribute("label", '⭐⭐');
    var12.addEventListener("command", () => {
      Zotero.AI4Paper.starSelectedItems(0x2);
    });
    var11.appendChild(var12);
    var12 = var3.createXULElement("menuitem");
    var12.id = "ai4paper-star3-itemmenuitem";
    var12.setAttribute("label", "⭐⭐⭐");
    var12.addEventListener('command', () => {
      Zotero.AI4Paper.starSelectedItems(0x3);
    });
    var11.appendChild(var12);
    var12 = var3.createXULElement("menuitem");
    var12.id = "ai4paper-star4-itemmenuitem";
    var12.setAttribute("label", '⭐⭐⭐⭐');
    var12.addEventListener("command", () => {
      Zotero.AI4Paper.starSelectedItems(0x4);
    });
    var11.appendChild(var12);
    var12 = var3.createXULElement("menuitem");
    var12.id = "ai4paper-star5-itemmenuitem";
    var12.setAttribute("label", '⭐⭐⭐⭐⭐');
    var12.addEventListener("command", () => {
      Zotero.AI4Paper.starSelectedItems(0x5);
    });
    var11.appendChild(var12);
    var10.appendChild(var11);
    let var13 = var3.createXULElement("menu");
    var13.id = "zotero-itemmenu-ai4paper-tagsOperation";
    var13.setAttribute("data-l10n-id", "ai4paper-tagsOperation-itemmenu");
    !var4 && var13.setAttribute("class", "menu-iconic");
    var13.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? 'url(chrome://ai4paper/content/icons/tag_actions_20px.svg)' : "url(chrome://ai4paper/content/icons/tag-operation-menu-iconic.png)";
    let var14 = var3.createXULElement("menupopup");
    var14.id = 'zotero-itemmenu-ai4paper-tagsOperation-popup';
    let var15 = var3.createXULElement('menuitem');
    var15.id = "zotero-itemmenu-ai4paper-tagsOperation-addTagsBatch";
    var15.setAttribute("data-l10n-id", 'ai4paper-tagsOperation-addTagsBatch-itemmenu');
    !var4 && var15.setAttribute("class", 'menuitem-iconic');
    var15.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? 'url(chrome://ai4paper/content/icons/tag_20px.svg)' : "url(chrome://ai4paper/content/icons/tag-menu-iconic.png)";
    var15.addEventListener("command", () => {
      Zotero.AI4Paper.addTagForSelectedAnnotationsInit();
    });
    var14.appendChild(var15);
    var15 = var3.createXULElement('menuitem');
    var15.id = 'zotero-itemmenu-ai4paper-tagsOperation-renameTagsBatch';
    var15.setAttribute("data-l10n-id", "ai4paper-tagsOperation-renameTagsBatch-itemmenu");
    !var4 && var15.setAttribute('class', 'menuitem-iconic');
    var15.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? 'url(chrome://ai4paper/content/icons/tag_20px.svg)' : "url(chrome://ai4paper/content/icons/tag-menu-iconic.png)";
    var15.addEventListener("command", () => {
      Zotero.AI4Paper.renameTagsBatch();
    });
    var14.appendChild(var15);
    var15 = var3.createXULElement('menuitem');
    var15.id = 'zotero-itemmenu-ai4paper-tagsOperation-deleteTagsBatch';
    var15.setAttribute("data-l10n-id", "ai4paper-tagsOperation-deleteTagsBatch-itemmenu");
    !var4 && var15.setAttribute("class", 'menuitem-iconic');
    var15.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/tag_20px.svg)" : "url(chrome://ai4paper/content/icons/tag-menu-iconic.png)";
    var15.addEventListener('command', () => {
      Zotero.AI4Paper.deleteTagsBatch();
    });
    var14.appendChild(var15);
    var14.appendChild(var3.createXULElement("menuseparator"));
    var15 = var3.createXULElement('menuitem');
    var15.id = 'zotero-itemmenu-ai4paper-tagsOperation-archive';
    var15.setAttribute("data-l10n-id", 'ai4paper-tagsOperation-archive-itemmenu');
    !var4 && var15.setAttribute("class", 'menuitem-iconic');
    var15.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/archive_20px.svg)" : 'url(chrome://ai4paper/content/icons/done-menu-iconic.png)';
    var15.addEventListener("command", () => {
      Zotero.AI4Paper.archiveSelectedItems();
    });
    var14.appendChild(var15);
    var15 = var3.createXULElement("menuitem");
    var15.id = "zotero-itemmenu-ai4paper-tagsOperation-generate-tagsCollectioin";
    var15.setAttribute("data-l10n-id", "ai4paper-tagsOperation-generate-tagsCollectioin-itemmenu");
    !var4 && var15.setAttribute("class", "menuitem-iconic");
    var15.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/tag_20px.svg)" : "url(chrome://ai4paper/content/icons/tag-menu-iconic.png)";
    var15.addEventListener("command", () => {
      Zotero.AI4Paper.generateTagsCollection_SelectedItems();
    });
    var14.appendChild(var15);
    var14.appendChild(var3.createXULElement("menuseparator"));
    var15 = var3.createXULElement('menuitem');
    var15.id = "zotero-itemmenu-ai4paper-tagsOperation-remove-tags";
    var15.setAttribute('data-l10n-id', "ai4paper-tagsOperation-remove-tags-itemmenu");
    !var4 && var15.setAttribute('class', "menuitem-iconic");
    var15.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/trash_20px.svg)" : "url(chrome://ai4paper/content/icons/trash-menu-iconic.png)";
    var15.addEventListener("command", () => {
      Zotero.AI4Paper.removeTags_SelectedItems();
    });
    var14.appendChild(var15);
    var15 = var3.createXULElement("menuitem");
    var15.id = 'zotero-itemmenu-ai4paper-tagsOperation-clear-tagsCollection';
    var15.setAttribute("data-l10n-id", "ai4paper-tagsOperation-clear-tagsCollection-itemmenu");
    !var4 && var15.setAttribute("class", 'menuitem-iconic');
    var15.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/trash_20px.svg)" : "url(chrome://ai4paper/content/icons/trash-menu-iconic.png)";
    var15.addEventListener("command", () => {
      Zotero.AI4Paper.removeTagsCollection_SelectedItems();
    });
    var14.appendChild(var15);
    var13.appendChild(var14);
    let var16 = var3.createXULElement("menu");
    var16.id = "zotero-itemmenu-ai4paper-setLanguage";
    var16.setAttribute("data-l10n-id", "ai4paper-setLanguage-itemmenu");
    !var4 && var16.setAttribute("class", 'menu-iconic');
    var16.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/language_20px.svg)" : 'url(chrome://ai4paper/content/icons/language-menu-iconic.png)';
    let var17 = var3.createXULElement('menupopup');
    var17.id = "zotero-itemmenu-ai4paper-setLanguage-popup";
    let var18 = var3.createXULElement("menuitem");
    var18.id = "ai4paper-setLanguage-chinese-itemmenuitem";
    var18.setAttribute("data-l10n-id", "ai4paper-setLanguage-chinese-itemmenu");
    !var4 && var18.setAttribute("class", 'menuitem-iconic');
    var18.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/china_flag_20px.svg)" : "url(chrome://ai4paper/content/icons/china-menu-iconic.png)";
    var18.addEventListener("command", () => {
      let var19 = Zotero.getActiveZoteroPane().getSelectedItems().filter(_0x5a5bc7 => _0x5a5bc7.isRegularItem());
      var19.forEach(_0x10fb85 => Zotero.AI4Paper.setLanguageField(_0x10fb85, 'zh'));
      Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 设置语言【AI4paper】", "成功将【" + var19.length + "】篇文献的语言设置为【中文】！", "zoteorif");
    });
    var17.appendChild(var18);
    var18 = var3.createXULElement("menuitem");
    var18.id = 'ai4paper-setLanguage-english-itemmenuitem';
    var18.setAttribute("data-l10n-id", "ai4paper-setLanguage-english-itemmenu");
    !var4 && var18.setAttribute("class", "menuitem-iconic");
    var18.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? 'url(chrome://ai4paper/content/icons/usa_flag_20px.svg)' : "url(chrome://ai4paper/content/icons/usa-menu-iconic.png)";
    var18.addEventListener("command", () => {
      let var20 = Zotero.getActiveZoteroPane().getSelectedItems().filter(_0x12524d => _0x12524d.isRegularItem());
      var20.forEach(_0x5d0f02 => Zotero.AI4Paper.setLanguageField(_0x5d0f02, 'en'));
      Zotero.AI4Paper.showProgressWindow(0x1388, '✅\x20设置语言【Zotero\x20One】', "成功将【" + var20.length + "】篇文献的语言设置为【英文】！", 'zoteorif');
    });
    var17.appendChild(var18);
    var16.appendChild(var17);
    let var21 = var3.createXULElement("menuitem");
    var21.id = 'zotero-itemmenu-ai4paper-renameAttachments';
    var21.setAttribute("data-l10n-id", "ai4paper-renameAttachments-itemmenu");
    !var4 && var21.setAttribute("class", "menuitem-iconic");
    var21.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/rename_20px.svg)" : "url(chrome://ai4paper/content/icons/rename-menu-iconic.png)";
    var21.addEventListener("command", () => {
      Zotero.AI4Paper.renameAttachments();
    });
    let var22 = var3.createXULElement("menuitem");
    var22.id = "zotero-itemmenu-ai4paper-attachNewFile";
    var22.setAttribute("data-l10n-id", 'ai4paper-attachNewFile-itemmenu');
    !var4 && var22.setAttribute("class", "menuitem-iconic");
    var22.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/attachments_20px.svg)" : "url(chrome://ai4paper/content/icons/attachments-menu-iconic.png)";
    var22.addEventListener("command", () => {
      Zotero.AI4Paper.attachNewFile();
    });
    let var23 = var3.createXULElement('menuitem');
    var23.id = "zotero-itemmenu-ai4paper-title-translate";
    var23.setAttribute("data-l10n-id", 'ai4paper-translateTitle-itemmenu');
    !var4 && var23.setAttribute("class", 'menuitem-iconic');
    var23.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/translate_orange_20px.svg)" : "url(chrome://ai4paper/content/icons/title-trans-menu-iconic.png)";
    var23.addEventListener("command", () => {
      Zotero.AI4Paper.translateTitle();
    });
    let var24 = var3.createXULElement("menuitem");
    var24.id = "zotero-itemmenu-ai4paper-abstract-translate";
    var24.setAttribute('data-l10n-id', 'ai4paper-translateAbstract-itemmenu');
    !var4 && var24.setAttribute("class", "menuitem-iconic");
    var24.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/translate_green_20px.svg)" : "url(chrome://ai4paper/content/icons/abstract-trans-menu-iconic.png)";
    var24.addEventListener("command", () => {
      Zotero.AI4Paper.translateAbstract();
    });
    let var25 = var3.createXULElement('menuitem');
    var25.id = "zotero-itemmenu-ai4paper-updateifs";
    var25.setAttribute("data-l10n-id", "ai4paper-updateif-itemmenu");
    !var4 && var25.setAttribute("class", "menuitem-iconic");
    var25.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/update_ifs_20px.svg)" : 'url(chrome://ai4paper/content/icons/add-if-menu-iconic.png)';
    var25.addEventListener('command', () => {
      Zotero.AI4Paper.updateSelectedItemsIF();
    });
    let var26 = var3.createXULElement("menuitem");
    var26.id = 'zotero-itemmenu-ai4paper-fetchDOI';
    var26.setAttribute("data-l10n-id", "ai4paper-fetchDOI-itemmenu");
    !var4 && var26.setAttribute("class", 'menuitem-iconic');
    var26.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/doi_20px.svg)" : "url(chrome://ai4paper/content/icons/doi-menu-iconic.png)";
    var26.addEventListener("command", () => {
      Zotero.AI4Paper.updateSelectedItemsDOI();
    });
    let var27 = var3.createXULElement("menuitem");
    var27.id = "zotero-itemmenu-ai4paper-updateMetadata";
    var27.setAttribute("data-l10n-id", "ai4paper-updateMetadata-itemmenu");
    !var4 && var27.setAttribute("class", "menuitem-iconic");
    var27.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/update_20px.svg)" : "url(chrome://ai4paper/content/icons/update-menu-iconic.png)";
    var27.addEventListener("command", () => {
      Zotero.AI4Paper.updateSelectedItemsMetadata();
    });
    let var28 = var3.createXULElement("menuitem");
    var28.id = "zotero-itemmenu-ai4paper-fetchCitations";
    var28.setAttribute("data-l10n-id", 'ai4paper-fetchCitations-itemmenu');
    !var4 && var28.setAttribute("class", "menuitem-iconic");
    var28.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/citations_20px.svg)" : "url(chrome://ai4paper/content/icons/citations-menu-iconic.png)";
    var28.addEventListener('command', () => {
      Zotero.AI4Paper.updateSelectedItemsCitations();
    });
    let var29 = var3.createXULElement("menuitem");
    var29.id = "zotero-itemmenu-ai4paper-retrieve-citedrefs";
    var29.setAttribute("data-l10n-id", 'ai4paper-retrieveCitedRefs-itemmenu');
    !var4 && var29.setAttribute("class", "menuitem-iconic");
    var29.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/citedRefs_20px.svg)" : "url(chrome://ai4paper/content/icons/refs-menu-iconic.png)";
    var29.addEventListener("command", () => {
      Zotero.AI4Paper.updateReferences();
    });
    let var30 = var3.createXULElement('menuitem');
    var30.id = "zotero-itemmenu-ai4paper-retrieve-citingrefs";
    var30.setAttribute("data-l10n-id", "ai4paper-retrieveCitingRefs-itemmenu");
    !var4 && var30.setAttribute('class', "menuitem-iconic");
    var30.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/citingRefs_20px.svg)" : "url(chrome://ai4paper/content/icons/citing-menu-iconic.png)";
    var30.addEventListener("command", () => {
      Zotero.AI4Paper.updateCitingReferences();
    });
    let var31 = var3.createXULElement("menuitem");
    var31.id = "zotero-itemmenu-ai4paper-openWith";
    var31.setAttribute("data-l10n-id", "ai4paper-openWith-itemmenu");
    !var4 && var31.setAttribute("class", "menuitem-iconic");
    var31.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/reader_20px.svg)" : "url(chrome://ai4paper/content/icons/pdf-menu-iconic.png)";
    var31.addEventListener('command', () => {
      Zotero.AI4Paper.openwith();
    });
    let var32 = var3.createXULElement("menuitem");
    var32.id = 'zotero-itemmenu-ai4paper-obsidianNote';
    var32.setAttribute("data-l10n-id", "ai4paper-obsidianNote-itemmenu");
    !var4 && var32.setAttribute('class', "menuitem-iconic");
    var32.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/obsidian_20px.svg)" : "url(chrome://ai4paper/content/icons/obsidian-menu-iconic.png)";
    var32.addEventListener("command", () => {
      Zotero.AI4Paper.obsidianNote();
    });
    let var33 = var3.createXULElement('menuitem');
    var33.id = "zotero-itemmenu-ai4paper-batchAIInterpret";
    var33.setAttribute("data-l10n-id", "ai4paper-batchAIInterpret-itemmenu");
    !var4 && var33.setAttribute("class", "menuitem-iconic");
    var33.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? 'url(chrome://ai4paper/content/icons/paperai_batch_20px.svg)' : "url(chrome://ai4paper/content/icons/paperai_batch-menu-iconic.png)";
    var33.addEventListener("command", () => {
      Zotero.AI4Paper.batchInterpretSelectedItems();
    });
    let var34 = var3.getElementById("zotero-itemmenu");
    var34.appendChild(var5);
    var34.appendChild(var6);
    var34.appendChild(var8);
    var34.appendChild(var10);
    var34.appendChild(var13);
    var34.appendChild(var16);
    var34.appendChild(var21);
    var34.appendChild(var22);
    var34.appendChild(var23);
    var34.appendChild(var24);
    var34.appendChild(var25);
    var34.appendChild(var26);
    var34.appendChild(var27);
    var34.appendChild(var28);
    var34.appendChild(var29);
    var34.appendChild(var30);
    var34.appendChild(var31);
    var34.appendChild(var32);
    var34.appendChild(var33);
    this._store_added_elements.push(var5, var6, var8, var10, var13, var16, var21, var22, var23, var24, var25, var26, var27, var28, var29, var30, var31, var32, var33);
  },
  'registerToolsMenu'() {
    let var35 = this._win.document,
      var36 = var35.createXULElement("menuseparator"),
      var37 = var35.createXULElement('menuitem');
    var37.id = "zotero-Toolsmenu-ai4paper-titleTrans";
    var37.setAttribute('data-l10n-id', "ai4paper-titleTrans-toolsmenu");
    var37.addEventListener("command", () => {
      Zotero.AI4Paper.translateTitle();
    });
    let var38 = var35.createXULElement("menuitem");
    var38.id = "zotero-Toolsmenu-ai4paper-abstractTrans";
    var38.setAttribute("data-l10n-id", "ai4paper-abstractTrans-toolsmenu");
    var38.addEventListener("command", () => {
      Zotero.AI4Paper.translateAbstract();
    });
    let var39 = var35.createXULElement("menuitem");
    var39.id = "zotero-Toolsmenu-ai4paper-updateMetadata";
    var39.setAttribute("data-l10n-id", 'ai4paper-updateMetadata-toolsmenu');
    var39.addEventListener("command", () => {
      Zotero.AI4Paper.updateSelectedItemsMetadata();
    });
    let var40 = var35.createXULElement("menuitem");
    var40.id = "zotero-Toolsmenu-ai4paper-copyPDF";
    var40.setAttribute("data-l10n-id", "ai4paper-copyPDF-toolsmenu");
    var40.addEventListener('command', () => {
      Zotero.AI4Paper.copyPDF();
    });
    let var41 = var35.createXULElement("menuitem");
    var41.id = "zotero-Toolsmenu-ai4paper-openwith";
    var41.setAttribute("data-l10n-id", 'ai4paper-openwith-toolsmenu');
    var41.addEventListener("command", () => {
      Zotero.AI4Paper.openwith();
    });
    let var42 = var35.createXULElement("menuitem");
    var42.id = "zotero-Toolsmenu-ai4paper-relatedpapers";
    var42.setAttribute("data-l10n-id", 'ai4paper-relatedpapers-toolsmenu');
    var42.addEventListener("command", () => {
      Zotero.AI4Paper.relatedPapers();
    });
    let var43 = var35.createXULElement("menuitem");
    var43.id = "zotero-Toolsmenu-ai4paper-connectedpapers";
    var43.setAttribute('data-l10n-id', "ai4paper-connectedpapers-toolsmenu");
    var43.addEventListener("command", () => {
      Zotero.AI4Paper.connectedPapers();
    });
    let var44 = var35.createXULElement("menuitem");
    var44.id = "zotero-Toolsmenu-ai4paper-randomVocabulary";
    var44.setAttribute("data-l10n-id", "ai4paper-randomVocabulary-toolsmenu");
    var44.addEventListener('command', () => {
      Zotero.AI4Paper.randomVocabulary();
    });
    let var45 = var35.createXULElement('menuitem');
    var45.id = "zotero-Toolsmenu-ai4paper-openVocabularyBook";
    var45.setAttribute('data-l10n-id', "ai4paper-openVocabularyBook-toolsmenu");
    var45.addEventListener("command", () => {
      Zotero.AI4Paper.openVocabularyBook();
    });
    let var46 = var35.createXULElement('menuitem');
    var46.id = "zotero-Toolsmenu-ai4paper-retrieveCitedRefs";
    var46.setAttribute("data-l10n-id", "ai4paper-retrieveCitedRefs-toolsmenu");
    var46.addEventListener("command", () => {
      Zotero.AI4Paper.updateReferences();
    });
    let var47 = var35.createXULElement('menuitem');
    var47.id = "zotero-Toolsmenu-ai4paper-retrieveCitingRefs";
    var47.setAttribute("data-l10n-id", "ai4paper-retrieveCitingRefs-toolsmenu");
    var47.addEventListener("command", () => {
      Zotero.AI4Paper.updateCitingReferences();
    });
    let var48 = var35.createXULElement("menuitem");
    var48.id = "zotero-Toolsmenu-ai4paper-showFile";
    var48.setAttribute("data-l10n-id", "ai4paper-showFile-toolsmenu");
    var48.addEventListener("command", () => {
      Zotero.AI4Paper.showFile();
    });
    let var49 = var35.createXULElement("menuitem");
    var49.id = "zotero-Toolsmenu-ai4paper-chatwithnewbing";
    var49.setAttribute('data-l10n-id', "ai4paper-chatwithnewbing-toolsmenu");
    var49.addEventListener("command", () => {
      Zotero.AI4Paper.chatWithNewBing();
    });
    let var50 = var35.createXULElement("menuitem");
    var50.id = 'zotero-Toolsmenu-ai4paper-updateRelatedItemsNum';
    var50.setAttribute("data-l10n-id", "ai4paper-updateRelatedItemsNum-toolsmenu");
    var50.addEventListener('command', () => {
      Zotero.AI4Paper.updateAllRelatedItemsNum();
    });
    let var51 = var35.createXULElement("menuitem");
    var51.id = 'zotero-Toolsmenu-ai4paper-removeRelatedItems';
    var51.setAttribute("data-l10n-id", "ai4paper-removeRelatedItems-toolsmenu");
    var51.addEventListener("command", () => {
      Zotero.AI4Paper.removeRelatedItems();
    });
    let var52 = var35.createXULElement('menuitem');
    var52.id = "zotero-Toolsmenu-ai4paper-selectRelatedItems";
    var52.setAttribute('data-l10n-id', "ai4paper-selectRelatedItems-toolsmenu");
    var52.addEventListener("command", () => {
      Zotero.AI4Paper.showSelectedRelatedItems();
    });
    let var53 = var35.createXULElement("menuitem");
    var53.id = "zotero-Toolsmenu-ai4paper-selectAllRelatedItems";
    var53.setAttribute("data-l10n-id", "ai4paper-selectAllRelatedItems-toolsmenu");
    var53.addEventListener("command", () => {
      Zotero.AI4Paper.selectAllRelatedItmes();
    });
    let var54 = var35.createXULElement("menuitem");
    var54.id = 'zotero-Toolsmenu-ai4paper-full-to-abbrev';
    var54.setAttribute('data-l10n-id', "ai4paper-fulltoabbrev-toolsmenu");
    var54.addEventListener("command", () => {
      Zotero.AI4Paper.updateSelectedItemsAbbreviation();
    });
    let var55 = var35.createXULElement("menu");
    var55.id = "zotero-Toolsmenu-ai4paper-star";
    var55.setAttribute("data-l10n-id", "ai4paper-star-toolsmenu");
    let var56 = var35.createXULElement('menupopup');
    var56.id = 'zotero-Toolsmenu-ai4paper-star-popup';
    let var57 = var35.createXULElement("menuitem");
    var57.id = "ai4paper-star1-Toolsmenu";
    var57.setAttribute('label', '⭐');
    var57.addEventListener("command", () => {
      Zotero.AI4Paper.starSelectedItems(0x1);
    });
    var56.appendChild(var57);
    var57 = var35.createXULElement("menuitem");
    var57.id = "ai4paper-star2-Toolsmenu";
    var57.setAttribute("label", '⭐⭐');
    var57.addEventListener("command", () => {
      Zotero.AI4Paper.starSelectedItems(0x2);
    });
    var56.appendChild(var57);
    var57 = var35.createXULElement('menuitem');
    var57.id = "ai4paper-star3-Toolsmenu";
    var57.setAttribute("label", "⭐⭐⭐");
    var57.addEventListener("command", () => {
      Zotero.AI4Paper.starSelectedItems(0x3);
    });
    var56.appendChild(var57);
    var57 = var35.createXULElement("menuitem");
    var57.id = "ai4paper-star4-Toolsmenu";
    var57.setAttribute('label', "⭐⭐⭐⭐");
    var57.addEventListener('command', () => {
      Zotero.AI4Paper.starSelectedItems(0x4);
    });
    var56.appendChild(var57);
    var57 = var35.createXULElement("menuitem");
    var57.id = 'ai4paper-star5-Toolsmenu';
    var57.setAttribute('label', "⭐⭐⭐⭐⭐");
    var57.addEventListener("command", () => {
      Zotero.AI4Paper.starSelectedItems(0x5);
    });
    var56.appendChild(var57);
    var55.appendChild(var56);
    let var58 = var35.createXULElement("menu");
    var58.id = "zotero-Toolsmenu-ai4paper-clearField";
    var58.setAttribute('data-l10n-id', "ai4paper-clearfield-toolsmenu");
    let var59 = var35.createXULElement("menupopup");
    var59.id = "zotero-itemmenu-ai4paper-clearField-popup";
    let var60 = var35.createXULElement('menuitem');
    var60.id = "zotero-Toolsmenu-ai4paper-clear-extra";
    var60.setAttribute('data-l10n-id', "ai4paper-clear-extra-toolsmenu");
    var60.addEventListener("command", () => {
      Zotero.AI4Paper.clearField("extra");
    });
    var59.appendChild(var60);
    var60 = var35.createXULElement('menuitem');
    var60.id = "zotero-Toolsmenu-ai4paper-clear-rights";
    var60.setAttribute("data-l10n-id", 'ai4paper-clear-rights-toolsmenu');
    var60.addEventListener('command', () => {
      Zotero.AI4Paper.clearField("rights");
    });
    var59.appendChild(var60);
    var60 = var35.createXULElement("menuitem");
    var60.id = "zotero-Toolsmenu-ai4paper-clear-callNumber";
    var60.setAttribute("data-l10n-id", "ai4paper-clear-callNumber-toolsmenu");
    var60.addEventListener('command', () => {
      Zotero.AI4Paper.clearField("callNumber");
    });
    var59.appendChild(var60);
    var60 = var35.createXULElement("menuitem");
    var60.id = 'zotero-Toolsmenu-ai4paper-clear-libraryCatalog';
    var60.setAttribute('data-l10n-id', "ai4paper-clear-libraryCatalog-toolsmenu");
    var60.addEventListener("command", () => {
      Zotero.AI4Paper.clearField('libraryCatalog');
    });
    var59.appendChild(var60);
    var60 = var35.createXULElement('menuitem');
    var60.id = "zotero-Toolsmenu-ai4paper-clear-archiveLocation";
    var60.setAttribute("data-l10n-id", "ai4paper-clear-archiveLocation-toolsmenu");
    var60.addEventListener('command', () => {
      Zotero.AI4Paper.clearField('archiveLocation');
    });
    var59.appendChild(var60);
    var60 = var35.createXULElement('menuitem');
    var60.id = "zotero-Toolsmenu-ai4paper-clear-archive";
    var60.setAttribute('data-l10n-id', "ai4paper-clear-archive-toolsmenu");
    var60.addEventListener("command", () => {
      Zotero.AI4Paper.clearField("archive");
    });
    var59.appendChild(var60);
    var60 = var35.createXULElement("menuitem");
    var60.id = "zotero-Toolsmenu-ai4paper-clear-shortTitle";
    var60.setAttribute("data-l10n-id", "ai4paper-clear-shortTitle-toolsmenu");
    var60.addEventListener("command", () => {
      Zotero.AI4Paper.clearField("shortTitle");
    });
    var59.appendChild(var60);
    var58.appendChild(var59);
    let var61 = var35.createXULElement("menu");
    var61.id = "zotero-Toolsmenu-ai4paper-deleteAttachments";
    var61.setAttribute("data-l10n-id", "ai4paper-delete-attachments-toolsmenu");
    let var62 = var35.createXULElement("menupopup");
    var62.id = 'zotero-itemmenu-ai4paper-deleteAttachments-popup';
    let var63 = var35.createXULElement("menuitem");
    var63.id = 'zotero-Toolsmenu-ai4paper-deleteAllAttachments';
    var63.setAttribute('data-l10n-id', 'ai4paper-delete-all-attachments-toolsmenu');
    var63.addEventListener('command', () => {
      Zotero.AI4Paper.deleteAllAttachments();
    });
    var62.appendChild(var63);
    var63 = var35.createXULElement('menuitem');
    var63.id = "zotero-Toolsmenu-ai4paper-deleteSnapshots";
    var63.setAttribute("data-l10n-id", "ai4paper-delete-snapshots-toolsmenu");
    var63.addEventListener("command", () => {
      Zotero.AI4Paper.deleteSnapShots();
    });
    var62.appendChild(var63);
    var61.appendChild(var62);
    let var64 = var35.createXULElement("menu");
    var64.id = "zotero-Toolsmenu-ai4paper-exportAttachments";
    var64.setAttribute('data-l10n-id', "ai4paper-export-attachmentFile-toolsmenu");
    let var65 = var35.createXULElement("menupopup");
    var65.id = 'zotero-itemmenu-ai4paper-exportAttachments-popup';
    let var66 = var35.createXULElement("menuitem");
    var66.id = "zotero-Toolsmenu-ai4paper-exportAllAttachments";
    var66.setAttribute('data-l10n-id', "ai4paper-export-all-attachmentFile-toolsmenu");
    var66.addEventListener("command", () => {
      Zotero.AI4Paper.exportFile();
    });
    var65.appendChild(var66);
    var66 = var35.createXULElement("menuitem");
    var66.id = "zotero-Toolsmenu-ai4paper-exportPDFAttachments";
    var66.setAttribute('data-l10n-id', 'ai4paper-export-pdf-attachmentFile-toolsmenu');
    var66.addEventListener("command", () => {
      Zotero.AI4Paper.exportPDFFile();
    });
    var65.appendChild(var66);
    var64.appendChild(var65);
    let var67 = var35.createXULElement("menu");
    var67.id = "zotero-Toolsmenu-ai4paper-copyItemLink";
    var67.setAttribute("data-l10n-id", 'ai4paper-copy-itemlink-toolsmenu');
    let var68 = var35.createXULElement('menupopup');
    var68.id = "zotero-itemmenu-ai4paper-copyItemLink-popup";
    let var69 = var35.createXULElement("menuitem");
    var69.id = "zotero-Toolsmenu-ai4paper-copySelectedItemsLink";
    var69.setAttribute("data-l10n-id", 'ai4paper-copy-selectedItemsLink-toolsmenu');
    var69.addEventListener("command", () => {
      Zotero.AI4Paper.copySelectedItemsLink(false);
    });
    var68.appendChild(var69);
    var69 = var35.createXULElement("menuitem");
    var69.id = "zotero-Toolsmenu-ai4paper-copyPDFAttachmentsLink";
    var69.setAttribute("data-l10n-id", 'ai4paper-copy-PDFAttachmentsLink-toolsmenu');
    var69.addEventListener("command", () => {
      Zotero.AI4Paper.copyPDFAttachmentsLink(false);
    });
    var68.appendChild(var69);
    var69 = var35.createXULElement('menuitem');
    var69.id = 'zotero-Toolsmenu-ai4paper-copyItemCitationPDFLink';
    var69.setAttribute("data-l10n-id", "ai4paper-copy-itemCitationPDFLink-toolsmenu");
    var69.addEventListener('command', () => {
      Zotero.AI4Paper.copyItemCitationPDFLink(false);
    });
    var68.appendChild(var69);
    var68.appendChild(var35.createXULElement('menuseparator'));
    var69 = var35.createXULElement("menuitem");
    var69.id = "zotero-Toolsmenu-ai4paper-copySelectedItemsLink-md";
    var69.setAttribute("data-l10n-id", 'ai4paper-copy-selectedItemsLink-md-toolsmenu');
    var69.addEventListener("command", () => {
      Zotero.AI4Paper.copySelectedItemsLink(true);
    });
    var68.appendChild(var69);
    var69 = var35.createXULElement("menuitem");
    var69.id = 'zotero-Toolsmenu-ai4paper-copyPDFAttachmentsLink-md';
    var69.setAttribute('data-l10n-id', "ai4paper-copy-PDFAttachmentsLink-md-toolsmenu");
    var69.addEventListener('command', () => {
      Zotero.AI4Paper.copyPDFAttachmentsLink(true);
    });
    var68.appendChild(var69);
    var69 = var35.createXULElement("menuitem");
    var69.id = "zotero-Toolsmenu-ai4paper-copyItemCitationPDFLink-md";
    var69.setAttribute("data-l10n-id", "ai4paper-copy-itemCitationPDFLink-md-toolsmenu");
    var69.addEventListener("command", () => {
      Zotero.AI4Paper.copyItemCitationPDFLink(true);
    });
    var68.appendChild(var69);
    var67.appendChild(var68);
    let var70 = var35.getElementById('menu_ToolsPopup');
    var70.appendChild(var36);
    var70.appendChild(var37);
    var70.appendChild(var38);
    var70.appendChild(var39);
    var70.appendChild(var40);
    var70.appendChild(var41);
    var70.appendChild(var42);
    var70.appendChild(var43);
    var70.appendChild(var44);
    var70.appendChild(var45);
    var70.appendChild(var46);
    var70.appendChild(var47);
    var70.appendChild(var48);
    var70.appendChild(var49);
    var70.appendChild(var50);
    var70.appendChild(var51);
    var70.appendChild(var52);
    var70.appendChild(var53);
    var70.appendChild(var54);
    var70.appendChild(var55);
    var70.appendChild(var58);
    var70.appendChild(var61);
    var70.appendChild(var64);
    var70.appendChild(var67);
    this._store_added_elements.push(var36, var37, var38, var39, var40, var41, var42, var43, var44, var45, var46, var47, var48, var49, var50, var51, var52, var53, var54, var55, var58, var61, var64, var67);
  },
  'registerCollectionMenu'() {
    let var71 = this._win.document,
      var72 = var71.getElementById("zotero-collectionmenu"),
      var73,
      var74,
      var75;
    var74 = var71.createXULElement("menuseparator");
    var74.id = "ai4paper-batchAIInterpret-menuseparator";
    var72.appendChild(var74);
    this._store_added_elements.push(var74);
    var73 = var71.createXULElement("menuitem");
    var73.id = "zotero-collectionmenu-ai4paper-batchAIInterpret";
    var73.setAttribute("data-l10n-id", 'ai4paper-batchAIInterpret-collectionmenu');
    var73.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/paperai_batch_20px.svg)" : "url(chrome://ai4paper/content/icons/paperai_batch-menu-iconic.png)";
    var73.addEventListener('command', () => {
      Zotero.AI4Paper.batchInterpretSelectedItems(true);
    });
    var72.appendChild(var73);
    this._store_added_elements.push(var73);
    var74 = var71.createXULElement("menuseparator");
    var74.id = "ai4paper-copyCollectionLink-menuseparator";
    var72.appendChild(var74);
    this._store_added_elements.push(var74);
    var73 = var71.createXULElement("menuitem");
    var73.id = "zotero-collectionmenu-ai4paper-copyCollectionLink";
    var73.setAttribute("data-l10n-id", "ai4paper-copyCollectionLink-collectionmenu");
    var73.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/link_20px.svg)" : 'url(chrome://ai4paper/content/icons/link-menu-iconic.png)';
    var73.addEventListener('command', () => {
      Zotero.AI4Paper.copySelectedCollectionLink();
    });
    var72.appendChild(var73);
    this._store_added_elements.push(var73);
    var74 = var71.createXULElement("menuseparator");
    var74.id = "ai4paper-aiAnalysisItemsTitle-menuseparator";
    var72.appendChild(var74);
    this._store_added_elements.push(var74);
    var73 = var71.createXULElement("menuitem");
    var73.id = "zotero-collectionmenu-ai4paper-aiAnalysisItemsTitle";
    var73.setAttribute("data-l10n-id", "ai4paper-aiAnalysisItemsTitle-collectionmenu");
    var73.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/ai_20px.svg)" : 'url(chrome://ai4paper/content/icons/ai-menu-iconic.png)';
    var73.addEventListener("command", () => {
      Zotero.AI4Paper.onClickCollectionMenu_aiAnalysisItemsTitle('综述选定分类文献标题', "title");
    });
    var72.appendChild(var73);
    this._store_added_elements.push(var73);
    var73 = var71.createXULElement("menuitem");
    var73.id = "zotero-collectionmenu-ai4paper-aiAnalysisItemsTitleAndAbstract";
    var73.setAttribute("data-l10n-id", "ai4paper-aiAnalysisItemsTitleAndAbstract-collectionmenu");
    var73.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? 'url(chrome://ai4paper/content/icons/ai_20px.svg)' : "url(chrome://ai4paper/content/icons/ai-menu-iconic.png)";
    var73.addEventListener("command", () => {
      Zotero.AI4Paper.onClickCollectionMenu_aiAnalysisItemsTitle("综述选定分类文献标题及摘要", 'title_abstract');
    });
    var72.appendChild(var73);
    this._store_added_elements.push(var73);
    var74 = var71.createXULElement("menuseparator");
    var74.id = "ai4paper-queryCollectionInPapersMatrix-menuseparator";
    var72.appendChild(var74);
    this._store_added_elements.push(var74);
    var73 = var71.createXULElement("menuitem");
    var73.id = 'zotero-collectionmenu-ai4paper-queryCollectionInPapersMatrix';
    var73.setAttribute("data-l10n-id", "ai4paper-queryCollectionInPapersMatrix-collectionmenu");
    var73.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/folder_20px.svg)" : "url(chrome://ai4paper/content/icons/collection-menu-iconic.png)";
    var73.addEventListener("command", () => {
      let var76 = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
      var76 && Zotero.AI4Paper.queryPapersMatrix("filterByCollection", var76.name);
    });
    var72.appendChild(var73);
    this._store_added_elements.push(var73);
    var74 = var71.createXULElement("menuseparator");
    var74.id = "ai4paper-refsCollection-menuseparator";
    var72.appendChild(var74);
    this._store_added_elements.push(var74);
    var73 = var71.createXULElement("menuitem");
    var73.id = "zotero-collectionmenu-ai4paper-refsCollection";
    var73.setAttribute("data-l10n-id", "ai4paper-set-as-refscollection-collectionmenu");
    var73.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/folder_20px.svg)" : "url(chrome://ai4paper/content/icons/collection-menu-iconic.png)";
    var73.addEventListener("command", () => {
      Zotero.AI4Paper.setRefsCollection();
    });
    var72.appendChild(var73);
    this._store_added_elements.push(var73);
    var74 = var71.createXULElement("menuseparator");
    var74.id = "ai4paper-favoriteCollection-menuseparator";
    var72.appendChild(var74);
    this._store_added_elements.push(var74);
    var73 = var71.createXULElement('menu');
    var73.id = "zotero-collectionmenu-ai4paper-go2favoritecollection";
    var73.setAttribute('data-l10n-id', 'ai4paper-go2favoritecollection-collectionmenu');
    var73.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/folder_20px.svg)" : "url(chrome://ai4paper/content/icons/collection-menu-iconic.png)";
    var75 = var71.createXULElement("menupopup");
    var75.id = "zotero-collectionmenu-ai4paper-go2favoritecollection-popup";
    var73.appendChild(var75);
    var72.appendChild(var73);
    this._store_added_elements.push(var73);
    var73 = var71.createXULElement('menuitem');
    var73.id = "zotero-collectionmenu-ai4paper-favoriteCollection";
    var73.setAttribute("data-l10n-id", "ai4paper-set-as-favorite-collection");
    var73.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? "url(chrome://ai4paper/content/icons/star_20px.svg)" : "url(chrome://ai4paper/content/icons/star-menu-iconic.png)";
    var73.addEventListener('command', () => {
      Zotero.AI4Paper.setFavoriteCollection();
    });
    var72.appendChild(var73);
    this._store_added_elements.push(var73);
    var73 = var71.createXULElement("menuitem");
    var73.id = "zotero-collectionmenu-ai4paper-removeFavoriteCollection";
    var73.setAttribute('data-l10n-id', "ai4paper-remove-favorite-collection");
    var73.style.listStyleImage = Zotero.AI4Paper.isZoteroVersion() ? 'url(chrome://ai4paper/content/icons/star_20px.svg)' : "url(chrome://ai4paper/content/icons/star-menu-iconic.png)";
    var73.addEventListener("command", () => {
      Zotero.AI4Paper.removeFavoriteCollection();
    });
    var72.appendChild(var73);
    this._store_added_elements.push(var73);
  },
  'destroy'() {
    let var77 = this._win.document;
    for (let var78 of this._store_added_elements) {
      if (var78) var78.remove();
    }
    var77.querySelector('[href=\x22ai4paper_preferences.ftl\x22]').remove();
  }
};