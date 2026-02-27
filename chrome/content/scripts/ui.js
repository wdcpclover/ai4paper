Zotero.AI4Paper.UI = {
  'displayItemMenuitem'() {
    var var1 = Services.wm.getMostRecentWindow("navigator:browser").ZoteroPane;
    let var2 = Zotero.AI4Paper.getItemLibraryType() === "user",
      var3 = Zotero.AI4Paper.getItemLibraryType() === 'group',
      var4 = Zotero.AI4Paper.getItemLibraryType() === "feed",
      var5 = Zotero.AI4Paper.hasTargetItemType("isRegularItem"),
      var6 = Zotero.AI4Paper.hasTargetItemType("isTopLevelItem"),
      var7 = Zotero.AI4Paper.hasTargetItemType("isAttachment"),
      var8 = Zotero.AI4Paper.hasTargetItemType("isNote"),
      var9 = Zotero.AI4Paper.hasTargetItemType("isAnnotation"),
      var10 = Zotero.AI4Paper.isItemEditable();
    var1.document.getElementById("zotero-itemmenu-ai4paper-star").hidden = !Zotero.Prefs.get("ai4paper.itemmenustarlevel") || !var5;
    var1.document.getElementById("zotero-itemmenu-ai4paper-star").setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-ai4paper-tagsOperation").hidden = !Zotero.Prefs.get("ai4paper.itemmenutagsoperation") || !var5;
    var1.document.getElementById("zotero-itemmenu-ai4paper-tagsOperation").setAttribute("disabled", !var10);
    var1.document.getElementById('zotero-itemmenu-ai4paper-setLanguage').hidden = !Zotero.Prefs.get("ai4paper.itemmenusetlanguage") || !var5;
    var1.document.getElementById('zotero-itemmenu-ai4paper-setLanguage').setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-ai4paper-renameAttachments").hidden = !Zotero.Prefs.get("ai4paper.itemmenurenameattachments") || var8 || var9 || var4;
    var1.document.getElementById('zotero-itemmenu-ai4paper-renameAttachments').setAttribute("disabled", !Zotero.AI4Paper.is4RenameAttachments());
    var1.document.getElementById('zotero-itemmenu-ai4paper-renameAttachments').setAttribute('disabled', !var10);
    var1.document.getElementById("zotero-itemmenu-ai4paper-attachNewFile").hidden = !Zotero.Prefs.get('ai4paper.itemmenuattachnewfile') || !var5;
    var1.document.getElementById("zotero-itemmenu-ai4paper-attachNewFile").setAttribute("disabled", !Zotero.AI4Paper.is4AttachNewFile());
    var1.document.getElementById("zotero-itemmenu-ai4paper-title-translate").hidden = !Zotero.Prefs.get("ai4paper.itemmenutitletrans") || !var5;
    var1.document.getElementById('zotero-itemmenu-ai4paper-title-translate').setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-ai4paper-abstract-translate").hidden = !Zotero.Prefs.get("ai4paper.itemmenuabstracttrans") || !var5;
    var1.document.getElementById("zotero-itemmenu-ai4paper-abstract-translate").setAttribute('disabled', !var10);
    var1.document.getElementById("zotero-itemmenu-ai4paper-updateifs").hidden = !Zotero.Prefs.get("ai4paper.itemmenuupdateifs") || !var5;
    var1.document.getElementById('zotero-itemmenu-ai4paper-updateifs').setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-ai4paper-fetchDOI").hidden = !Zotero.Prefs.get("ai4paper.itemmenufetchdoi") || !var5;
    var1.document.getElementById("zotero-itemmenu-ai4paper-fetchDOI").setAttribute('disabled', !var10);
    var1.document.getElementById('zotero-itemmenu-ai4paper-updateMetadata').hidden = !Zotero.Prefs.get("ai4paper.itemmenuupdatemetadata") || !var5;
    var1.document.getElementById('zotero-itemmenu-ai4paper-updateMetadata').setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-ai4paper-fetchCitations").hidden = !Zotero.Prefs.get("ai4paper.itemmenuupdatecitations") || !var5;
    var1.document.getElementById("zotero-itemmenu-ai4paper-fetchCitations").setAttribute("disabled", !var10);
    var1.document.getElementById('zotero-itemmenu-ai4paper-retrieve-citedrefs').hidden = !Zotero.Prefs.get("ai4paper.itemmenuretrievecitedrefs") || !var5;
    var1.document.getElementById("zotero-itemmenu-ai4paper-retrieve-citingrefs").hidden = !Zotero.Prefs.get('ai4paper.itemmenuretrievecitingrefs') || !var5;
    var1.document.getElementById("zotero-itemmenu-ai4paper-openWith").hidden = !Zotero.Prefs.get("ai4paper.itemmenuopenwith") || !var5 && !var7 || var4;
    var1.document.getElementById("zotero-itemmenu-ai4paper-obsidianNote").hidden = !Zotero.Prefs.get("ai4paper.itemmenuobsidiannotes") || !var5 || var4;
    var1.document.getElementById("zotero-itemmenu-ai4paper-obsidianNote").setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-ai4paper-batchAIInterpret").hidden = !Zotero.Prefs.get("ai4paper.itemmenuBatchAIInterpret") || !var5 || var4;
    var1.document.getElementById("zotero-itemmenu-ai4paper-batchAIInterpret").setAttribute("disabled", !var10);
    if (!Zotero.Prefs.get("ai4paper.itemmenugo2collection") || !var6 || !var2) {
      var1.document.getElementById("zotero-itemmenu-ai4paper-go2Collection").hidden = true;
    } else {
      var1.document.getElementById("zotero-itemmenu-ai4paper-go2Collection").hidden = false;
      let var11,
        var12 = var1.document.getElementById("zotero-itemmenu-ai4paper-go2Collection-popup"),
        var13 = var12.firstElementChild;
      while (var13) {
        var13.remove();
        var13 = var12.firstElementChild;
      }
      let var14 = Zotero.AI4Paper.itemCollectionsInfo();
      if (var14 != "未分类条目") for (let var15 = 0x0; var15 < var14.collectionsName.length; var15++) {
        var11 = var1.document.createXULElement("menuitem");
        var11.setAttribute('label', var14.collectionsName[var15]);
        !Zotero.isMac && var11.setAttribute("class", "menuitem-iconic");
        var11.style.listStyleImage = "url(chrome://ai4paper/content/icons/folder_20px.svg)";
        var11.setAttribute('id', "itemCollection:" + var14.collectionsName[var15]);
        var11.addEventListener("command", () => {
          Zotero.AI4Paper.showItemInCollection(var14.item, var14.collectionsID[var15]);
        });
        var12.appendChild(var11);
      } else {
        var11 = var1.document.createXULElement("menuitem");
        var11.setAttribute("label", '未分类条目');
        var11.style.listStyleImage = "url(chrome://ai4paper/content/icons/folder_20px.svg)";
        var11.setAttribute('id', "unfiled item");
        var11.addEventListener("command", () => {
          Zotero.AI4Paper.showItemInCollection();
        });
        var12.appendChild(var11);
      }
    }
    var1.document.getElementById('zotero-itemmenu-ai4paper-go2favoritecollection').setAttribute("disabled", false);
    if (!Zotero.Prefs.get("ai4paper.itemmenugo2favoritecollection")) var1.document.getElementById("zotero-itemmenu-ai4paper-go2favoritecollection").hidden = true;else {
      var1.document.getElementById("zotero-itemmenu-ai4paper-go2favoritecollection").hidden = false;
      Zotero.AI4Paper.formatFavoriteCollection();
      if (Zotero.Prefs.get("ai4paper.favoritecollections") === '') var1.document.getElementById("zotero-itemmenu-ai4paper-go2favoritecollection").setAttribute("disabled", true);else {
        if (!JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")).collectionPart.collectionsID.length && !JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")).savedSearchPart.collectionsID.length) var1.document.getElementById('zotero-itemmenu-ai4paper-go2favoritecollection').setAttribute('disabled', true);else {
          let var16 = var1.document.getElementById("zotero-itemmenu-ai4paper-go2favoritecollection-popup");
          Zotero.AI4Paper.buildMenuItem_FavoriteCollection(var16);
        }
      }
    }
  },
  'displayToolsMenuitem'() {
    var var17 = Services.wm.getMostRecentWindow("navigator:browser").ZoteroPane;
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-titleTrans").hidden = !Zotero.Prefs.get("ai4paper.toolsmenutitletrans");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-abstractTrans").hidden = !Zotero.Prefs.get("ai4paper.toolsmenuabstracttrans");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-updateMetadata").hidden = !Zotero.Prefs.get("ai4paper.toolsmenuUpdateMetadata");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-copyPDF").hidden = !Zotero.Prefs.get("ai4paper.toolsmenuCopyPDF");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-openwith").hidden = !Zotero.Prefs.get('ai4paper.toolsmenuopenwith');
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-relatedpapers").hidden = !Zotero.Prefs.get("ai4paper.toolsmenurelatedpapers");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-connectedpapers").hidden = !Zotero.Prefs.get('ai4paper.toolsmenuconnectedpapers');
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-randomVocabulary").hidden = !Zotero.Prefs.get("ai4paper.toolsmenurandomvocabulary");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-openVocabularyBook").hidden = !Zotero.Prefs.get("ai4paper.toolsmenuopenvocabularybook");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-retrieveCitedRefs").hidden = !Zotero.Prefs.get("ai4paper.toolsmenuretrievecitedrefs");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-retrieveCitingRefs").hidden = !Zotero.Prefs.get("ai4paper.toolsmenuretrievecitingrefs");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-showFile").hidden = !Zotero.Prefs.get("ai4paper.toolsmenushowfile");
    var17.document.getElementById('zotero-Toolsmenu-ai4paper-chatwithnewbing').hidden = !Zotero.Prefs.get("ai4paper.toolsmenuchatwithnewbing");
    var17.document.getElementById('zotero-Toolsmenu-ai4paper-updateRelatedItemsNum').hidden = !Zotero.Prefs.get('ai4paper.toolsmenuupdateRelatedItemsNum');
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-removeRelatedItems").hidden = !Zotero.Prefs.get('ai4paper.toolsmenuremoveRelatedItems');
    var17.document.getElementById('zotero-Toolsmenu-ai4paper-selectRelatedItems').hidden = !Zotero.Prefs.get("ai4paper.toolsmenuselectRelatedItems");
    var17.document.getElementById('zotero-Toolsmenu-ai4paper-selectAllRelatedItems').hidden = !Zotero.Prefs.get("ai4paper.toolsmenuselectAllRelatedItems");
    var17.document.getElementById('zotero-Toolsmenu-ai4paper-full-to-abbrev').hidden = !Zotero.Prefs.get("ai4paper.toolsmenufulltoabbrev");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-star").hidden = !Zotero.Prefs.get("ai4paper.toolsmenustar");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-clearField").hidden = !Zotero.Prefs.get("ai4paper.toolsmenuclearfield");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-deleteAttachments").hidden = !Zotero.Prefs.get("ai4paper.toolsmenudeleteattachments");
    var17.document.getElementById("zotero-Toolsmenu-ai4paper-exportAttachments").hidden = !Zotero.Prefs.get("ai4paper.toolsmenucopyattachmentfile");
    var17.document.getElementById('zotero-Toolsmenu-ai4paper-copyItemLink').hidden = !Zotero.Prefs.get("ai4paper.toolsmenucopyitemlink");
  },
  'displayCollectionMenuitem'() {
    var var18 = Services.wm.getMostRecentWindow('navigator:browser').ZoteroPane;
    let var19 = var18.getSelectedCollection();
    var18.document.getElementById('ai4paper-refsCollection-menuseparator').hidden = !var19;
    var18.document.getElementById("zotero-collectionmenu-ai4paper-refsCollection").hidden = !var19;
    var18.document.getElementById("ai4paper-queryCollectionInPapersMatrix-menuseparator").hidden = !var19;
    var18.document.getElementById("zotero-collectionmenu-ai4paper-queryCollectionInPapersMatrix").hidden = !var19;
    let var20 = false;
    if (var19 && Zotero.Libraries.get(var19.libraryID).libraryType === "user") {
      var20 = true;
    }
    let var21 = var19 || var18.getSelectedSavedSearch() || undefined;
    var18.document.getElementById("ai4paper-batchAIInterpret-menuseparator").hidden = !var21;
    var18.document.getElementById("zotero-collectionmenu-ai4paper-batchAIInterpret").hidden = !var21;
    var18.document.getElementById("ai4paper-copyCollectionLink-menuseparator").hidden = !var21;
    var18.document.getElementById("zotero-collectionmenu-ai4paper-copyCollectionLink").hidden = !var21;
    var18.document.getElementById('ai4paper-favoriteCollection-menuseparator').hidden = !var21;
    var18.document.getElementById("zotero-collectionmenu-ai4paper-go2favoritecollection").hidden = !var21;
    var18.document.getElementById('zotero-collectionmenu-ai4paper-favoriteCollection').hidden = !var21;
    var18.document.getElementById("zotero-collectionmenu-ai4paper-removeFavoriteCollection").hidden = !var21;
    if (var21 != undefined) {
      var18.document.getElementById("zotero-collectionmenu-ai4paper-go2favoritecollection").setAttribute("disabled", false);
      Zotero.AI4Paper.formatFavoriteCollection();
      let _0x48b5dc = Zotero.AI4Paper.checkFavoriteCollection(var21);
      var18.document.getElementById('zotero-collectionmenu-ai4paper-favoriteCollection').hidden = _0x48b5dc;
      var18.document.getElementById("zotero-collectionmenu-ai4paper-removeFavoriteCollection").hidden = !_0x48b5dc;
      try {
        if (Zotero.Prefs.get("ai4paper.favoritecollections") === '') var18.document.getElementById("zotero-collectionmenu-ai4paper-go2favoritecollection").setAttribute('disabled', true);else {
          if (!JSON.parse(Zotero.Prefs.get('ai4paper.favoritecollections')).collectionPart.collectionsID.length && !JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")).savedSearchPart.collectionsID.length) var18.document.getElementById("zotero-collectionmenu-ai4paper-go2favoritecollection").setAttribute("disabled", true);else {
            let var23 = var18.document.getElementById("zotero-collectionmenu-ai4paper-go2favoritecollection-popup");
            Zotero.AI4Paper.buildMenuItem_FavoriteCollection(var23);
          }
        }
      } catch (_0x2aff25) {
        Zotero.debug(_0x2aff25);
      }
    }
    let var24 = Zotero.AI4Paper.getSelectedCollectionType()?.["isUnfiled"],
      var25 = Zotero.AI4Paper.getSelectedCollectionType()?.['isTrash'],
      var26 = Zotero.AI4Paper.getSelectedCollectionType()?.["isDuplicates"],
      var27 = !var24 && !var25 && !var26 || false;
    var18.document.getElementById('ai4paper-aiAnalysisItemsTitle-menuseparator').hidden = !var27;
    var18.document.getElementById("zotero-collectionmenu-ai4paper-aiAnalysisItemsTitle").hidden = !var27;
    var18.document.getElementById('zotero-collectionmenu-ai4paper-aiAnalysisItemsTitleAndAbstract').hidden = !var27;
  },
  'displayToolBarMenuitem'() {
    var var28 = Services.wm.getMostRecentWindow("navigator:browser").ZoteroPane;
    let var29 = var28.document.getElementById("zotero-if-items-toolbar-go2favoritecollection-button-popup");
    Zotero.AI4Paper.buildMenuItem_FavoriteCollection(var29);
  }
};