Zotero.ZoteroIF.UI = {
  'displayItemMenuitem'() {
    var var1 = Services.wm.getMostRecentWindow("navigator:browser").ZoteroPane;
    let var2 = Zotero.ZoteroIF.getItemLibraryType() === "user",
      var3 = Zotero.ZoteroIF.getItemLibraryType() === 'group',
      var4 = Zotero.ZoteroIF.getItemLibraryType() === "feed",
      var5 = Zotero.ZoteroIF.hasTargetItemType("isRegularItem"),
      var6 = Zotero.ZoteroIF.hasTargetItemType("isTopLevelItem"),
      var7 = Zotero.ZoteroIF.hasTargetItemType("isAttachment"),
      var8 = Zotero.ZoteroIF.hasTargetItemType("isNote"),
      var9 = Zotero.ZoteroIF.hasTargetItemType("isAnnotation"),
      var10 = Zotero.ZoteroIF.isItemEditable();
    var1.document.getElementById("zotero-itemmenu-zoteroif-star").hidden = !Zotero.Prefs.get("zoteroif.itemmenustarlevel") || !var5;
    var1.document.getElementById("zotero-itemmenu-zoteroif-star").setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-zoteroif-tagsOperation").hidden = !Zotero.Prefs.get("zoteroif.itemmenutagsoperation") || !var5;
    var1.document.getElementById("zotero-itemmenu-zoteroif-tagsOperation").setAttribute("disabled", !var10);
    var1.document.getElementById('zotero-itemmenu-zoteroif-setLanguage').hidden = !Zotero.Prefs.get("zoteroif.itemmenusetlanguage") || !var5;
    var1.document.getElementById('zotero-itemmenu-zoteroif-setLanguage').setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-zoteroif-renameAttachments").hidden = !Zotero.Prefs.get("zoteroif.itemmenurenameattachments") || var8 || var9 || var4;
    var1.document.getElementById('zotero-itemmenu-zoteroif-renameAttachments').setAttribute("disabled", !Zotero.ZoteroIF.is4RenameAttachments());
    var1.document.getElementById('zotero-itemmenu-zoteroif-renameAttachments').setAttribute('disabled', !var10);
    var1.document.getElementById("zotero-itemmenu-zoteroif-attachNewFile").hidden = !Zotero.Prefs.get('zoteroif.itemmenuattachnewfile') || !var5;
    var1.document.getElementById("zotero-itemmenu-zoteroif-attachNewFile").setAttribute("disabled", !Zotero.ZoteroIF.is4AttachNewFile());
    var1.document.getElementById("zotero-itemmenu-zoteroif-title-translate").hidden = !Zotero.Prefs.get("zoteroif.itemmenutitletrans") || !var5;
    var1.document.getElementById('zotero-itemmenu-zoteroif-title-translate').setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-zoteroif-abstract-translate").hidden = !Zotero.Prefs.get("zoteroif.itemmenuabstracttrans") || !var5;
    var1.document.getElementById("zotero-itemmenu-zoteroif-abstract-translate").setAttribute('disabled', !var10);
    var1.document.getElementById("zotero-itemmenu-zoteroif-updateifs").hidden = !Zotero.Prefs.get("zoteroif.itemmenuupdateifs") || !var5;
    var1.document.getElementById('zotero-itemmenu-zoteroif-updateifs').setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-zoteroif-fetchDOI").hidden = !Zotero.Prefs.get("zoteroif.itemmenufetchdoi") || !var5;
    var1.document.getElementById("zotero-itemmenu-zoteroif-fetchDOI").setAttribute('disabled', !var10);
    var1.document.getElementById('zotero-itemmenu-zoteroif-updateMetadata').hidden = !Zotero.Prefs.get("zoteroif.itemmenuupdatemetadata") || !var5;
    var1.document.getElementById('zotero-itemmenu-zoteroif-updateMetadata').setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-zoteroif-fetchCitations").hidden = !Zotero.Prefs.get("zoteroif.itemmenuupdatecitations") || !var5;
    var1.document.getElementById("zotero-itemmenu-zoteroif-fetchCitations").setAttribute("disabled", !var10);
    var1.document.getElementById('zotero-itemmenu-zoteroif-retrieve-citedrefs').hidden = !Zotero.Prefs.get("zoteroif.itemmenuretrievecitedrefs") || !var5;
    var1.document.getElementById("zotero-itemmenu-zoteroif-retrieve-citingrefs").hidden = !Zotero.Prefs.get('zoteroif.itemmenuretrievecitingrefs') || !var5;
    var1.document.getElementById("zotero-itemmenu-zoteroif-openWith").hidden = !Zotero.Prefs.get("zoteroif.itemmenuopenwith") || !var5 && !var7 || var4;
    var1.document.getElementById("zotero-itemmenu-zoteroif-obsidianNote").hidden = !Zotero.Prefs.get("zoteroif.itemmenuobsidiannotes") || !var5 || var4;
    var1.document.getElementById("zotero-itemmenu-zoteroif-obsidianNote").setAttribute("disabled", !var10);
    var1.document.getElementById("zotero-itemmenu-zoteroif-batchAIInterpret").hidden = !Zotero.Prefs.get("zoteroif.itemmenuBatchAIInterpret") || !var5 || var4;
    var1.document.getElementById("zotero-itemmenu-zoteroif-batchAIInterpret").setAttribute("disabled", !var10);
    if (!Zotero.Prefs.get("zoteroif.itemmenugo2collection") || !var6 || !var2) {
      var1.document.getElementById("zotero-itemmenu-zoteroif-go2Collection").hidden = true;
    } else {
      var1.document.getElementById("zotero-itemmenu-zoteroif-go2Collection").hidden = false;
      let var11,
        var12 = var1.document.getElementById("zotero-itemmenu-zoteroif-go2Collection-popup"),
        var13 = var12.firstElementChild;
      while (var13) {
        var13.remove();
        var13 = var12.firstElementChild;
      }
      let var14 = Zotero.ZoteroIF.itemCollectionsInfo();
      if (var14 != "未分类条目") for (let var15 = 0x0; var15 < var14.collectionsName.length; var15++) {
        var11 = var1.document.createXULElement("menuitem");
        var11.setAttribute('label', var14.collectionsName[var15]);
        !Zotero.isMac && var11.setAttribute("class", "menuitem-iconic");
        var11.style.listStyleImage = "url(chrome://zoteroif/content/icons/folder_20px.svg)";
        var11.setAttribute('id', "itemCollection:" + var14.collectionsName[var15]);
        var11.addEventListener("command", () => {
          Zotero.ZoteroIF.showItemInCollection(var14.item, var14.collectionsID[var15]);
        });
        var12.appendChild(var11);
      } else {
        var11 = var1.document.createXULElement("menuitem");
        var11.setAttribute("label", '未分类条目');
        var11.style.listStyleImage = "url(chrome://zoteroif/content/icons/folder_20px.svg)";
        var11.setAttribute('id', "unfiled item");
        var11.addEventListener("command", () => {
          Zotero.ZoteroIF.showItemInCollection();
        });
        var12.appendChild(var11);
      }
    }
    var1.document.getElementById('zotero-itemmenu-zoteroif-go2favoritecollection').setAttribute("disabled", false);
    if (!Zotero.Prefs.get("zoteroif.itemmenugo2favoritecollection")) var1.document.getElementById("zotero-itemmenu-zoteroif-go2favoritecollection").hidden = true;else {
      var1.document.getElementById("zotero-itemmenu-zoteroif-go2favoritecollection").hidden = false;
      Zotero.ZoteroIF.formatFavoriteCollection();
      if (Zotero.Prefs.get("zoteroif.favoritecollections") === '') var1.document.getElementById("zotero-itemmenu-zoteroif-go2favoritecollection").setAttribute("disabled", true);else {
        if (!JSON.parse(Zotero.Prefs.get("zoteroif.favoritecollections")).collectionPart.collectionsID.length && !JSON.parse(Zotero.Prefs.get("zoteroif.favoritecollections")).savedSearchPart.collectionsID.length) var1.document.getElementById('zotero-itemmenu-zoteroif-go2favoritecollection').setAttribute('disabled', true);else {
          let var16 = var1.document.getElementById("zotero-itemmenu-zoteroif-go2favoritecollection-popup");
          Zotero.ZoteroIF.buildMenuItem_FavoriteCollection(var16);
        }
      }
    }
  },
  'displayToolsMenuitem'() {
    var var17 = Services.wm.getMostRecentWindow("navigator:browser").ZoteroPane;
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-titleTrans").hidden = !Zotero.Prefs.get("zoteroif.toolsmenutitletrans");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-abstractTrans").hidden = !Zotero.Prefs.get("zoteroif.toolsmenuabstracttrans");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-updateMetadata").hidden = !Zotero.Prefs.get("zoteroif.toolsmenuUpdateMetadata");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-copyPDF").hidden = !Zotero.Prefs.get("zoteroif.toolsmenuCopyPDF");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-openwith").hidden = !Zotero.Prefs.get('zoteroif.toolsmenuopenwith');
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-relatedpapers").hidden = !Zotero.Prefs.get("zoteroif.toolsmenurelatedpapers");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-connectedpapers").hidden = !Zotero.Prefs.get('zoteroif.toolsmenuconnectedpapers');
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-randomVocabulary").hidden = !Zotero.Prefs.get("zoteroif.toolsmenurandomvocabulary");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-openVocabularyBook").hidden = !Zotero.Prefs.get("zoteroif.toolsmenuopenvocabularybook");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-retrieveCitedRefs").hidden = !Zotero.Prefs.get("zoteroif.toolsmenuretrievecitedrefs");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-retrieveCitingRefs").hidden = !Zotero.Prefs.get("zoteroif.toolsmenuretrievecitingrefs");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-showFile").hidden = !Zotero.Prefs.get("zoteroif.toolsmenushowfile");
    var17.document.getElementById('zotero-Toolsmenu-zoteroif-chatwithnewbing').hidden = !Zotero.Prefs.get("zoteroif.toolsmenuchatwithnewbing");
    var17.document.getElementById('zotero-Toolsmenu-zoteroif-updateRelatedItemsNum').hidden = !Zotero.Prefs.get('zoteroif.toolsmenuupdateRelatedItemsNum');
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-removeRelatedItems").hidden = !Zotero.Prefs.get('zoteroif.toolsmenuremoveRelatedItems');
    var17.document.getElementById('zotero-Toolsmenu-zoteroif-selectRelatedItems').hidden = !Zotero.Prefs.get("zoteroif.toolsmenuselectRelatedItems");
    var17.document.getElementById('zotero-Toolsmenu-zoteroif-selectAllRelatedItems').hidden = !Zotero.Prefs.get("zoteroif.toolsmenuselectAllRelatedItems");
    var17.document.getElementById('zotero-Toolsmenu-zoteroif-full-to-abbrev').hidden = !Zotero.Prefs.get("zoteroif.toolsmenufulltoabbrev");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-star").hidden = !Zotero.Prefs.get("zoteroif.toolsmenustar");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-clearField").hidden = !Zotero.Prefs.get("zoteroif.toolsmenuclearfield");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-deleteAttachments").hidden = !Zotero.Prefs.get("zoteroif.toolsmenudeleteattachments");
    var17.document.getElementById("zotero-Toolsmenu-zoteroif-exportAttachments").hidden = !Zotero.Prefs.get("zoteroif.toolsmenucopyattachmentfile");
    var17.document.getElementById('zotero-Toolsmenu-zoteroif-copyItemLink').hidden = !Zotero.Prefs.get("zoteroif.toolsmenucopyitemlink");
  },
  'displayCollectionMenuitem'() {
    var var18 = Services.wm.getMostRecentWindow('navigator:browser').ZoteroPane;
    let var19 = var18.getSelectedCollection();
    var18.document.getElementById('zoteroif-refsCollection-menuseparator').hidden = !var19;
    var18.document.getElementById("zotero-collectionmenu-zoteroif-refsCollection").hidden = !var19;
    var18.document.getElementById("zoteroif-queryCollectionInPapersMatrix-menuseparator").hidden = !var19;
    var18.document.getElementById("zotero-collectionmenu-zoteroif-queryCollectionInPapersMatrix").hidden = !var19;
    let var20 = false;
    if (var19 && Zotero.Libraries.get(var19.libraryID).libraryType === "user") {
      var20 = true;
    }
    let var21 = var19 || var18.getSelectedSavedSearch() || undefined;
    var18.document.getElementById("zoteroif-batchAIInterpret-menuseparator").hidden = !var21;
    var18.document.getElementById("zotero-collectionmenu-zoteroif-batchAIInterpret").hidden = !var21;
    var18.document.getElementById("zoteroif-copyCollectionLink-menuseparator").hidden = !var21;
    var18.document.getElementById("zotero-collectionmenu-zoteroif-copyCollectionLink").hidden = !var21;
    var18.document.getElementById('zoteroif-favoriteCollection-menuseparator').hidden = !var21;
    var18.document.getElementById("zotero-collectionmenu-zoteroif-go2favoritecollection").hidden = !var21;
    var18.document.getElementById('zotero-collectionmenu-zoteroif-favoriteCollection').hidden = !var21;
    var18.document.getElementById("zotero-collectionmenu-zoteroif-removeFavoriteCollection").hidden = !var21;
    if (var21 != undefined) {
      var18.document.getElementById("zotero-collectionmenu-zoteroif-go2favoritecollection").setAttribute("disabled", false);
      Zotero.ZoteroIF.formatFavoriteCollection();
      let _0x48b5dc = Zotero.ZoteroIF.checkFavoriteCollection(var21);
      var18.document.getElementById('zotero-collectionmenu-zoteroif-favoriteCollection').hidden = _0x48b5dc;
      var18.document.getElementById("zotero-collectionmenu-zoteroif-removeFavoriteCollection").hidden = !_0x48b5dc;
      try {
        if (Zotero.Prefs.get("zoteroif.favoritecollections") === '') var18.document.getElementById("zotero-collectionmenu-zoteroif-go2favoritecollection").setAttribute('disabled', true);else {
          if (!JSON.parse(Zotero.Prefs.get('zoteroif.favoritecollections')).collectionPart.collectionsID.length && !JSON.parse(Zotero.Prefs.get("zoteroif.favoritecollections")).savedSearchPart.collectionsID.length) var18.document.getElementById("zotero-collectionmenu-zoteroif-go2favoritecollection").setAttribute("disabled", true);else {
            let var23 = var18.document.getElementById("zotero-collectionmenu-zoteroif-go2favoritecollection-popup");
            Zotero.ZoteroIF.buildMenuItem_FavoriteCollection(var23);
          }
        }
      } catch (_0x2aff25) {
        Zotero.debug(_0x2aff25);
      }
    }
    let var24 = Zotero.ZoteroIF.getSelectedCollectionType()?.["isUnfiled"],
      var25 = Zotero.ZoteroIF.getSelectedCollectionType()?.['isTrash'],
      var26 = Zotero.ZoteroIF.getSelectedCollectionType()?.["isDuplicates"],
      var27 = !var24 && !var25 && !var26 || false;
    var18.document.getElementById('zoteroif-aiAnalysisItemsTitle-menuseparator').hidden = !var27;
    var18.document.getElementById("zotero-collectionmenu-zoteroif-aiAnalysisItemsTitle").hidden = !var27;
    var18.document.getElementById('zotero-collectionmenu-zoteroif-aiAnalysisItemsTitleAndAbstract').hidden = !var27;
  },
  'displayToolBarMenuitem'() {
    var var28 = Services.wm.getMostRecentWindow("navigator:browser").ZoteroPane;
    let var29 = var28.document.getElementById("zotero-if-items-toolbar-go2favoritecollection-button-popup");
    Zotero.ZoteroIF.buildMenuItem_FavoriteCollection(var29);
  }
};