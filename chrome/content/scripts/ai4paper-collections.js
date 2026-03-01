// ai4paper-collections.js - Collection operations & favorite collections module
// Extracted from ai4paper.js (Phase 15)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Collapse Collection Pane ===
  'collapseCollectionPane_byShortCuts': function () {
    if (Zotero_Tabs._selectedID != "zotero-pane") return;
    Zotero.AI4Paper.togglePaneDisplay("zotero-collections", "toggle");
  },

  // === Block B: Collections Toolbar Buttons ===
  'registerCollectionsToolBarButtons': function (buttonNames) {
    let toolbar = window.document.querySelector('#zotero-collections-toolbar');
    const addButton = window.document.querySelector("#zotero-tb-collection-add"),
      lookupButton = window.document.querySelector("#zotero-tb-lookup");
    if (!toolbar || !addButton) return false;
    for (let buttonName of buttonNames) {
      if (buttonName === "collapseCollections" && Zotero.Prefs.get("ai4paper.collapseCollectionsCollectionsToolBarButton") && toolbar.getAttribute("collectionsToolbar-button-" + buttonName) != "true") {
        toolbar.setAttribute('collectionsToolbar-button-' + buttonName, "true");
        let newButton = lookupButton.cloneNode(true);
        newButton.setAttribute('id', "zotero-if-collections-toolbar-button-" + buttonName);
        newButton.setAttribute('tooltiptext', "折叠一级分类");
        newButton.setAttribute("command", '');
        newButton.setAttribute("onmousedown", '');
        newButton.setAttribute('oncommand', '');
        newButton.addEventListener("pointerdown", event => {
          event.button == 0x2 ? Zotero.AI4Paper.collapseCollections() : Zotero.AI4Paper.collapseCollections(true);
        }, false);
        Zotero.AI4Paper.updateButtonColor_CollapseCollections(newButton);
        addButton.after(newButton);
        newButton.setAttribute('tooltiptext', '折叠一级分类');
      }
    }
  },
  'unregisterCollectionsToolBarButtons': function (buttonNames) {
    let toolbar = window.document.querySelector("#zotero-collections-toolbar");
    if (!toolbar) return false;
    for (let buttonName of buttonNames) {
      const button = window.document.querySelector("#zotero-if-collections-toolbar-button-" + buttonName);
      button && (button.remove(), toolbar.setAttribute("collectionsToolbar-button-" + buttonName, 'false'));
    }
  },

  // === Block C: getSelectedCollectionType ===
  'getSelectedCollectionType': function () {
    var collectionsView = ZoteroPane.collectionsView,
      row = collectionsView.getRow(collectionsView.selection.focused);
    if (!row) return null;
    return {
      'type': row.type,
      'isUnfiled': row.isUnfiled(),
      'isLibrary': row.isLibrary(),
      'isCollection': row.isCollection(),
      'isTrash': row.isTrash(),
      'isDuplicates': row.isDuplicates()
    };
  },

  // === Block D: queryItemCollectionInPapersMatrix ===
  'queryItemCollectionInPapersMatrix': function (item) {
    if (item.getCollections().length === 0x0) {
      window.alert("当前文献属于【未分类】文献，不在任何 Zotero 分类中。");
      return;
    }
    let collectionID = item.getCollections()[0x0],
      collection = Zotero.Collections.get(collectionID);
    Zotero.AI4Paper.queryPapersMatrix("filterByCollection", collection.name);
  },

  // === Block E: Collection Link Utilities ===
  'copySelectedCollectionLink': function () {
    let selected = ZoteroPane.getSelectedCollection() || ZoteroPane.getSelectedSavedSearch() || undefined;
    if (selected) {
      let typeName, link;
      selected.conditions ? (typeName = "保存的搜索", link = Zotero.AI4Paper.getSelectedSavedSearchLink(selected)) : (typeName = '分类', link = Zotero.AI4Paper.getSelectedCollectionLink(selected));
      Zotero.AI4Paper.copy2Clipboard(link);
      Zotero.AI4Paper.showProgressWindow(0xbb8, "拷贝链接【AI4paper】", '✅\x20' + typeName + "：已拷贝链接【" + link + '】');
    }
  },
  'getSelectedCollectionLink': function (collection) {
    !collection && (collection = ZoteroPane.getSelectedCollection());
    let libraryType = Zotero.Libraries.get(collection.libraryID).libraryType;
    if (libraryType === "group") {
      return "zotero://select/" + Zotero.URI.getLibraryPath(collection.libraryID) + '/collections/' + collection.key;
    } else {
      if (libraryType === "user") return "zotero://select/library/collections/" + collection.key;
    }
  },
  'getSelectedSavedSearchLink': function (search) {
    return !search && (search = ZoteroPane.getSelectedSavedSearch()), "zotero://select/library/searches/" + search.key;
  },

  // === Block F: getItemCollectionsInfo ===
  'getItemCollectionsInfo': function (item) {
    item.parentItem && (item = item.parentItem);
    let result = '',
      collectionIDs = item.getCollections();
    if (collectionIDs.length != 0x0) {
      let names = [];
      for (let collectionID of collectionIDs) {
        let collection = Zotero.Collections.get(collectionID);
        names.push(collection.name);
      }
      result = names.join(',\x20');
    } else result = "未分类";
    return result;
  },

  // === Block G: Item Utilities + Favorite Collections ===
  'collapseCollections': async function (collapseFirst) {
    collapseFirst ? (ZoteroPane.collectionsView.collapseLibrary(0x1), await Zotero.Promise.delay(0x2), ZoteroPane.collectionsView.expandLibrary(0x1)) : ZoteroPane.collectionsView.expandLibrary(0x1, true);
  },
  'itemCollectionsInfo': function () {
    var item = ZoteroPane.getSelectedItems()[0x0];
    let collectionIDs = item.getCollections();
    if (collectionIDs.length != 0x0) {
      let names = [];
      for (let collectionID of collectionIDs) {
        let collection = Zotero.Collections.get(collectionID);
        names.push(collection.name);
      }
      return {
        'item': item,
        'collectionsID': collectionIDs,
        'collectionsName': names
      };
    } else return "未分类条目";
  },
  'getItemLibraryType': function (item) {
    if (!item) var item = ZoteroPane.getSelectedItems()[0x0];
    if (item === undefined) return false;
    return Zotero.Libraries.get(item.libraryID).libraryType;
  },
  'hasTargetItemType': function (typeMethod, items) {
    if (!items) var items = ZoteroPane.getSelectedItems();
    if (items === undefined) return false;
    try {
      for (let item of items) {
        if (item[typeMethod]()) return true;
        continue;
      }
    } catch (e) {
      return false;
    }
    return false;
  },
  'getItemType': function (item) {
    if (!item) {
      var item = ZoteroPane.getSelectedItems()[0x0];
    }
    if (item === undefined) return false;
    if (item.isRegularItem()) return "isRegularItem";else {
      if (item.isTopLevelItem()) {
        return "isTopLevelItem";
      } else {
        if (item.isAttachment()) return "isAttachment";else {
          if (item.isNote()) return "isNote";else {
            if (item.isAnnotation()) {
              return 'isAnnotation';
            }
          }
        }
      }
    }
    return false;
  },
  'isItemEditable': function (item) {
    if (!item) var item = ZoteroPane.getSelectedItems()[0x0];
    if (item === undefined) return false;
    return item.isEditable();
  },
  'buildMenuItem_FavoriteCollection': function (menuPopup, isReaderMenu) {
    var zoteroPane = Services.wm.getMostRecentWindow("navigator:browser").ZoteroPane;
    let menuItem,
      child = menuPopup.firstElementChild;
    while (child) {
      child.remove();
      child = menuPopup.firstElementChild;
    }
    Zotero.AI4Paper.formatFavoriteCollection();
    if (Zotero.Prefs.get('ai4paper.favoritecollections') === '') return;
    let favorites = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections"));
    if (favorites?.["collectionPart"]["collectionsID"]["length"] || favorites?.["savedSearchPart"]['collectionsID']['length']) {
      for (let i = 0x0; i < favorites.collectionPart.collectionsID.length; i++) {
        menuItem = zoteroPane.document.createXULElement("menuitem");
        menuItem.setAttribute('label', favorites.collectionPart.collectionsName[i]);
        menuItem.style.listStyleImage = 'url(chrome://ai4paper/content/icons/folder_20px.svg)';
        menuItem.setAttribute('id', 'ToolBar-favoriteCollection:' + favorites.collectionPart.collectionsName[i]);
        menuItem.addEventListener("command", event => {
          Zotero.AI4Paper.addEvent_FavoriteCollection(true, event, favorites.collectionPart.collectionsKey[i], isReaderMenu);
        });
        menuPopup.appendChild(menuItem);
      }
      if (favorites.savedSearchPart.collectionsID.length) {
        menuPopup.appendChild(zoteroPane.document.createXULElement("menuseparator"));
        for (let i = 0x0; i < favorites.savedSearchPart.collectionsID.length; i++) {
          menuItem = zoteroPane.document.createXULElement("menuitem");
          menuItem.setAttribute("label", favorites.savedSearchPart.collectionsName[i]);
          menuItem.style.listStyleImage = "url(chrome://ai4paper/content/icons/folder_20px.svg)";
          menuItem.setAttribute('id', "ToolBar-favoriteCollection:" + favorites.savedSearchPart.collectionsName[i]);
          menuItem.addEventListener("command", event => {
            Zotero.AI4Paper.addEvent_FavoriteCollection(false, event, favorites.savedSearchPart.collectionsKey[i], isReaderMenu);
          });
          menuPopup.appendChild(menuItem);
        }
      }
    }
  },
  'addEvent_FavoriteCollection': function (isCollection, event, key, isReaderMenu) {
    if (event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      Zotero.AI4Paper.setTopFavoriteCollection(isCollection, key);
      if (isReaderMenu) {
        Zotero.AI4Paper.addReaderMenuButton_go2FavoriteCollection(Zotero.AI4Paper.getCurrentReader()._iframeWindow);
      }
      return;
    }
    if (event.shiftKey && event.metaKey && !event.ctrlKey && !event.altKey) {
      Zotero.AI4Paper.moveUpFavoriteCollection(isCollection, key);
      isReaderMenu && Zotero.AI4Paper.addReaderMenuButton_go2FavoriteCollection(Zotero.AI4Paper.getCurrentReader()._iframeWindow);
      return;
    }
    if ((Zotero.isMac || Zotero.isLinux) && event.altKey && event.metaKey && !event.shiftKey && !event.ctrlKey || Zotero.isWin && event.ctrlKey && event.metaKey && !event.shiftKey && !event.altKey) {
      Zotero.AI4Paper.moveDownFavoriteCollection(isCollection, key);
      isReaderMenu && Zotero.AI4Paper.addReaderMenuButton_go2FavoriteCollection(Zotero.AI4Paper.getCurrentReader()._iframeWindow);
      return;
    }
    if ((Zotero.isMac || Zotero.isLinux) && event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey || Zotero.isWin && event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
      Zotero.AI4Paper.removeFavoriteCollectionFromList(isCollection, key);
      isReaderMenu && Zotero.AI4Paper.addReaderMenuButton_go2FavoriteCollection(Zotero.AI4Paper.getCurrentReader()._iframeWindow);
      return;
    }
    Zotero.AI4Paper.go2FavoriteCollection(isCollection, key);
  },
  'formatFavoriteCollection': function () {
    let emptyFavorites = {
        'collectionPart': {
          'collectionsID': [],
          'collectionsName': [],
          'collectionsKey': []
        },
        'savedSearchPart': {
          'collectionsID': [],
          'collectionsName': [],
          'collectionsKey': []
        }
      },
      prefValue = Zotero.Prefs.get("ai4paper.favoritecollections");
    if (prefValue === '') {
      Zotero.Prefs.set("ai4paper.favoritecollections", JSON.stringify(emptyFavorites));
      return;
    }
    let parsed = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections"));
    !parsed.savedSearchPart && parsed.collectionsID && (!parsed.collectionsID.length ? Zotero.Prefs.set("ai4paper.favoritecollections", JSON.stringify(emptyFavorites)) : (emptyFavorites.collectionPart = parsed, Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(emptyFavorites))));
  },
  'setFavoriteCollection': function () {
    let favorites = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      selected = ZoteroPane.getSelectedCollection() || ZoteroPane.getSelectedSavedSearch() || undefined;
    if (selected) {
      let partKey = selected?.["conditions"] ? "savedSearchPart" : "collectionPart",
        typeName = selected?.["conditions"] ? "保存的搜索" : '分类';
      favorites[partKey].collectionsID.push(selected.id);
      favorites[partKey].collectionsName.push(selected.name);
      favorites[partKey].collectionsKey.push(selected.key);
      Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(favorites));
      Zotero.AI4Paper.showProgressWindow(0x1f4, '收藏【Zotero\x20One】', '✅\x20' + typeName + '：【' + selected.name + "】，现已成功收藏！");
    }
  },
  'removeFavoriteCollection': function () {
    let favorites = JSON.parse(Zotero.Prefs.get('ai4paper.favoritecollections')),
      selected = ZoteroPane.getSelectedCollection() || ZoteroPane.getSelectedSavedSearch() || undefined;
    if (selected) {
      let partKey = selected?.["conditions"] ? "savedSearchPart" : "collectionPart",
        typeName = selected?.["conditions"] ? '保存的搜索' : '分类';
      for (let i = 0x0; i < favorites[partKey].collectionsKey.length; i++) {
        if (favorites[partKey].collectionsKey[i] === selected.key) {
          return favorites[partKey].collectionsID.splice(i, 0x1), favorites[partKey].collectionsName.splice(i, 0x1), favorites[partKey].collectionsKey.splice(i, 0x1), Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(favorites)), Zotero.AI4Paper.showProgressWindow(0x1f4, "取消收藏【AI4paper】", '✅\x20' + typeName + '：【' + selected.name + "】，现已取消收藏！"), true;
        }
      }
    }
  },
  'removeFavoriteCollectionFromList': function (isCollection, key) {
    let favorites = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      partKey = !isCollection ? 'savedSearchPart' : "collectionPart",
      typeName = !isCollection ? '保存的搜索' : '分类';
    for (let i = 0x0; i < favorites[partKey].collectionsKey.length; i++) {
      if (favorites[partKey].collectionsKey[i] === key) {
        let name = favorites[partKey].collectionsName[i];
        return favorites[partKey].collectionsID.splice(i, 0x1), favorites[partKey].collectionsName.splice(i, 0x1), favorites[partKey].collectionsKey.splice(i, 0x1), Zotero.Prefs.set("ai4paper.favoritecollections", JSON.stringify(favorites)), true;
      }
    }
  },
  'setTopFavoriteCollection': function (isCollection, key) {
    let favorites = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      partKey = !isCollection ? "savedSearchPart" : "collectionPart",
      typeName = !isCollection ? "保存的搜索" : '分类';
    for (let i = 0x0; i < favorites[partKey].collectionsKey.length; i++) {
      if (favorites[partKey].collectionsKey[i] === key) {
        let name = favorites[partKey].collectionsName[i],
          id = favorites[partKey].collectionsID[i];
        return favorites[partKey].collectionsID.splice(i, 0x1), favorites[partKey].collectionsName.splice(i, 0x1), favorites[partKey].collectionsKey.splice(i, 0x1), favorites[partKey].collectionsID.unshift(id), favorites[partKey].collectionsName.unshift(name), favorites[partKey].collectionsKey.unshift(key), Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(favorites)), true;
      }
    }
  },
  'moveUpFavoriteCollection': function (isCollection, key) {
    let favorites = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      partKey = !isCollection ? "savedSearchPart" : "collectionPart",
      typeName = !isCollection ? '保存的搜索' : '分类';
    if (favorites[partKey].collectionsKey.length <= 0x1) return;
    for (let i = 0x0; i < favorites[partKey].collectionsKey.length; i++) {
      if (favorites[partKey].collectionsKey[i] === key) {
        let name = favorites[partKey].collectionsName[i];
        if (i === 0x0) {
          const movedID = favorites[partKey].collectionsID.shift();
          favorites[partKey].collectionsID.push(movedID);
          const movedName = favorites[partKey].collectionsName.shift();
          favorites[partKey].collectionsName.push(movedName);
          const movedKey = favorites[partKey].collectionsKey.shift();
          favorites[partKey].collectionsKey.push(movedKey);
        } else {
          [favorites[partKey].collectionsID[i - 0x1], favorites[partKey].collectionsID[i]] = [favorites[partKey].collectionsID[i], favorites[partKey].collectionsID[i - 0x1]];
          [favorites[partKey].collectionsName[i - 0x1], favorites[partKey].collectionsName[i]] = [favorites[partKey].collectionsName[i], favorites[partKey].collectionsName[i - 0x1]];
          [favorites[partKey].collectionsKey[i - 0x1], favorites[partKey].collectionsKey[i]] = [favorites[partKey].collectionsKey[i], favorites[partKey].collectionsKey[i - 0x1]];
        }
        return Zotero.Prefs.set("ai4paper.favoritecollections", JSON.stringify(favorites)), true;
      }
    }
  },
  'moveDownFavoriteCollection': function (isCollection, key) {
    let favorites = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      partKey = !isCollection ? 'savedSearchPart' : 'collectionPart',
      typeName = !isCollection ? "保存的搜索" : '分类';
    if (favorites[partKey].collectionsKey.length <= 0x1) return;
    for (let i = 0x0; i < favorites[partKey].collectionsKey.length; i++) {
      if (favorites[partKey].collectionsKey[i] === key) {
        let name = favorites[partKey].collectionsName[i];
        if (i === favorites[partKey].collectionsKey.length - 0x1) {
          const movedID = favorites[partKey].collectionsID.pop();
          favorites[partKey].collectionsID.unshift(movedID);
          const movedName = favorites[partKey].collectionsName.pop();
          favorites[partKey].collectionsName.unshift(movedName);
          const movedKey = favorites[partKey].collectionsKey.pop();
          favorites[partKey].collectionsKey.unshift(movedKey);
        } else {
          [favorites[partKey].collectionsID[i], favorites[partKey].collectionsID[i + 0x1]] = [favorites[partKey].collectionsID[i + 0x1], favorites[partKey].collectionsID[i]];
          [favorites[partKey].collectionsName[i], favorites[partKey].collectionsName[i + 0x1]] = [favorites[partKey].collectionsName[i + 0x1], favorites[partKey].collectionsName[i]];
          [favorites[partKey].collectionsKey[i], favorites[partKey].collectionsKey[i + 0x1]] = [favorites[partKey].collectionsKey[i + 0x1], favorites[partKey].collectionsKey[i]];
        }
        return Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(favorites)), true;
      }
    }
  },
  'go2FavoriteCollection': function (isCollection, key) {
    if (!Zotero.AI4Paper.letDOI()) return;
    let collectionType = isCollection ? "Collections" : "Searches",
      selectMethod = isCollection ? "selectCollection" : "selectSearch";
    for (let libraryID of Zotero.Libraries.getAll().map(lib => lib.libraryID)) {
      let found = Zotero[collectionType].getByLibraryAndKey(libraryID, key);
      if (found) {
        Zotero_Tabs.select("zotero-pane");
        ZoteroPane_Local.collectionsView[selectMethod](found.id);
        return;
      }
      continue;
    }
  },
  'checkFavoriteCollection': function (target) {
    if (Zotero.Prefs.get("ai4paper.favoritecollections") === '') return false;
    let favorites = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections"));
    if (favorites.collectionPart.collectionsID.length || favorites.savedSearchPart.collectionsID.length) {
      for (let i = 0x0; i < favorites.collectionPart.collectionsKey.length; i++) {
        if (favorites.collectionPart.collectionsKey[i] === target.key) return true;
      }
      for (let i = 0x0; i < favorites.savedSearchPart.collectionsKey.length; i++) {
        if (favorites.savedSearchPart.collectionsKey[i] === target.key) return true;
      }
    }
    return false;
  },
  'onDeleteCollectionEvent': function (isCollection, deletedID) {
    Zotero.AI4Paper.formatFavoriteCollection();
    if (Zotero.Prefs.get("ai4paper.favoritecollections") === '') return false;else {
      if (!JSON.parse(Zotero.Prefs.get('ai4paper.favoritecollections')).collectionPart.collectionsID.length && !JSON.parse(Zotero.Prefs.get('ai4paper.favoritecollections')).savedSearchPart.collectionsID.length) {
        return false;
      }
    }
    let favorites = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      partKey = !isCollection ? "savedSearchPart" : "collectionPart";
    for (let i = 0x0; i < favorites[partKey].collectionsID.length; i++) {
      if (favorites[partKey].collectionsID[i] === deletedID) {
        return favorites[partKey].collectionsID.splice(i, 0x1), favorites[partKey].collectionsName.splice(i, 0x1), favorites[partKey].collectionsKey.splice(i, 0x1), Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(favorites)), true;
      }
    }
  },

});
