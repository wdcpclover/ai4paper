// ai4paper-collections.js - Collection operations & favorite collections module
// Extracted from ai4paper.js (Phase 15)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Collapse Collection Pane ===
  'collapseCollectionPane_byShortCuts': function () {
    if (Zotero_Tabs._selectedID != "zotero-pane") return;
    Zotero.AI4Paper.togglePaneDisplay("zotero-collections", "toggle");
  },

  // === Block B: Collections Toolbar Buttons ===
  'registerCollectionsToolBarButtons': function (param16) {
    let var447 = window.document.querySelector('#zotero-collections-toolbar');
    const var448 = window.document.querySelector("#zotero-tb-collection-add"),
      var449 = window.document.querySelector("#zotero-tb-lookup");
    if (!var447 || !var448) return false;
    for (let var450 of param16) {
      if (var450 === "collapseCollections" && Zotero.Prefs.get("ai4paper.collapseCollectionsCollectionsToolBarButton") && var447.getAttribute("collectionsToolbar-button-" + var450) != "true") {
        var447.setAttribute('collectionsToolbar-button-' + var450, "true");
        let var451 = var449.cloneNode(true);
        var451.setAttribute('id', "zotero-if-collections-toolbar-button-" + var450);
        var451.setAttribute('tooltiptext', "折叠一级分类");
        var451.setAttribute("command", '');
        var451.setAttribute("onmousedown", '');
        var451.setAttribute('oncommand', '');
        var451.addEventListener("pointerdown", _0x38a58f => {
          _0x38a58f.button == 0x2 ? Zotero.AI4Paper.collapseCollections() : Zotero.AI4Paper.collapseCollections(true);
        }, false);
        Zotero.AI4Paper.updateButtonColor_CollapseCollections(var451);
        var448.after(var451);
        var451.setAttribute('tooltiptext', '折叠一级分类');
      }
    }
  },
  'unregisterCollectionsToolBarButtons': function (param17) {
    let var452 = window.document.querySelector("#zotero-collections-toolbar");
    if (!var452) return false;
    for (let var453 of param17) {
      const _0x13f615 = window.document.querySelector("#zotero-if-collections-toolbar-button-" + var453);
      _0x13f615 && (_0x13f615.remove(), var452.setAttribute("collectionsToolbar-button-" + var453, 'false'));
    }
  },

  // === Block C: getSelectedCollectionType ===
  'getSelectedCollectionType': function () {
    var var594 = ZoteroPane.collectionsView,
      var595 = var594.getRow(var594.selection.focused);
    if (!var595) return null;
    return {
      'type': var595.type,
      'isUnfiled': var595.isUnfiled(),
      'isLibrary': var595.isLibrary(),
      'isCollection': var595.isCollection(),
      'isTrash': var595.isTrash(),
      'isDuplicates': var595.isDuplicates()
    };
  },

  // === Block D: queryItemCollectionInPapersMatrix ===
  'queryItemCollectionInPapersMatrix': function (param662) {
    if (param662.getCollections().length === 0x0) {
      window.alert("当前文献属于【未分类】文献，不在任何 Zotero 分类中。");
      return;
    }
    let var3605 = param662.getCollections()[0x0],
      var3606 = Zotero.Collections.get(var3605);
    Zotero.AI4Paper.queryPapersMatrix("filterByCollection", var3606.name);
  },

  // === Block E: Collection Link Utilities ===
  'copySelectedCollectionLink': function () {
    let var3826 = ZoteroPane.getSelectedCollection() || ZoteroPane.getSelectedSavedSearch() || undefined;
    if (var3826) {
      let var3827, var3828;
      var3826.conditions ? (var3827 = "保存的搜索", var3828 = Zotero.AI4Paper.getSelectedSavedSearchLink(var3826)) : (var3827 = '分类', var3828 = Zotero.AI4Paper.getSelectedCollectionLink(var3826));
      Zotero.AI4Paper.copy2Clipboard(var3828);
      Zotero.AI4Paper.showProgressWindow(0xbb8, "拷贝链接【AI4paper】", '✅\x20' + var3827 + "：已拷贝链接【" + var3828 + '】');
    }
  },
  'getSelectedCollectionLink': function (param721) {
    !param721 && (param721 = ZoteroPane.getSelectedCollection());
    let var3829 = Zotero.Libraries.get(param721.libraryID).libraryType;
    if (var3829 === "group") {
      return "zotero://select/" + Zotero.URI.getLibraryPath(param721.libraryID) + '/collections/' + param721.key;
    } else {
      if (var3829 === "user") return "zotero://select/library/collections/" + param721.key;
    }
  },
  'getSelectedSavedSearchLink': function (param722) {
    return !param722 && (param722 = ZoteroPane.getSelectedSavedSearch()), "zotero://select/library/searches/" + param722.key;
  },

  // === Block F: getItemCollectionsInfo ===
  'getItemCollectionsInfo': function (param761) {
    param761.parentItem && (param761 = param761.parentItem);
    let var4073 = '',
      var4074 = param761.getCollections();
    if (var4074.length != 0x0) {
      let var4075 = [];
      for (let var4076 of var4074) {
        let var4077 = Zotero.Collections.get(var4076);
        var4075.push(var4077.name);
      }
      var4073 = var4075.join(',\x20');
    } else var4073 = "未分类";
    return var4073;
  },

  // === Block G: Item Utilities + Favorite Collections ===
  'collapseCollections': async function (param1014) {
    param1014 ? (ZoteroPane.collectionsView.collapseLibrary(0x1), await Zotero.Promise.delay(0x2), ZoteroPane.collectionsView.expandLibrary(0x1)) : ZoteroPane.collectionsView.expandLibrary(0x1, true);
  },
  'itemCollectionsInfo': function () {
    var var5208 = ZoteroPane.getSelectedItems()[0x0];
    let var5209 = var5208.getCollections();
    if (var5209.length != 0x0) {
      let _0x177258 = [];
      for (let var5211 of var5209) {
        let _0x44ade3 = Zotero.Collections.get(var5211);
        _0x177258.push(_0x44ade3.name);
      }
      return {
        'item': var5208,
        'collectionsID': var5209,
        'collectionsName': _0x177258
      };
    } else return "未分类条目";
  },
  'getItemLibraryType': function (param1015) {
    if (!param1015) var param1015 = ZoteroPane.getSelectedItems()[0x0];
    if (param1015 === undefined) return false;
    return Zotero.Libraries.get(param1015.libraryID).libraryType;
  },
  'hasTargetItemType': function (param1016, param1017) {
    if (!param1017) var param1017 = ZoteroPane.getSelectedItems();
    if (param1017 === undefined) return false;
    try {
      for (let var5213 of param1017) {
        if (var5213[param1016]()) return true;
        continue;
      }
    } catch (_0x566789) {
      return false;
    }
    return false;
  },
  'getItemType': function (param1018) {
    if (!param1018) {
      var param1018 = ZoteroPane.getSelectedItems()[0x0];
    }
    if (param1018 === undefined) return false;
    if (param1018.isRegularItem()) return "isRegularItem";else {
      if (param1018.isTopLevelItem()) {
        return "isTopLevelItem";
      } else {
        if (param1018.isAttachment()) return "isAttachment";else {
          if (param1018.isNote()) return "isNote";else {
            if (param1018.isAnnotation()) {
              return 'isAnnotation';
            }
          }
        }
      }
    }
    return false;
  },
  'isItemEditable': function (param1019) {
    if (!param1019) var param1019 = ZoteroPane.getSelectedItems()[0x0];
    if (param1019 === undefined) return false;
    return param1019.isEditable();
  },
  'buildMenuItem_FavoriteCollection': function (param1020, param1021) {
    var var5218 = Services.wm.getMostRecentWindow("navigator:browser").ZoteroPane;
    let var5219,
      var5220 = param1020.firstElementChild;
    while (var5220) {
      var5220.remove();
      var5220 = param1020.firstElementChild;
    }
    Zotero.AI4Paper.formatFavoriteCollection();
    if (Zotero.Prefs.get('ai4paper.favoritecollections') === '') return;
    let var5221 = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections"));
    if (var5221?.["collectionPart"]["collectionsID"]["length"] || var5221?.["savedSearchPart"]['collectionsID']['length']) {
      for (let var5222 = 0x0; var5222 < var5221.collectionPart.collectionsID.length; var5222++) {
        var5219 = var5218.document.createXULElement("menuitem");
        var5219.setAttribute('label', var5221.collectionPart.collectionsName[var5222]);
        var5219.style.listStyleImage = 'url(chrome://ai4paper/content/icons/folder_20px.svg)';
        var5219.setAttribute('id', 'ToolBar-favoriteCollection:' + var5221.collectionPart.collectionsName[var5222]);
        var5219.addEventListener("command", _0x45eaa3 => {
          Zotero.AI4Paper.addEvent_FavoriteCollection(true, _0x45eaa3, var5221.collectionPart.collectionsKey[var5222], param1021);
        });
        param1020.appendChild(var5219);
      }
      if (var5221.savedSearchPart.collectionsID.length) {
        param1020.appendChild(var5218.document.createXULElement("menuseparator"));
        for (let var5223 = 0x0; var5223 < var5221.savedSearchPart.collectionsID.length; var5223++) {
          var5219 = var5218.document.createXULElement("menuitem");
          var5219.setAttribute("label", var5221.savedSearchPart.collectionsName[var5223]);
          var5219.style.listStyleImage = "url(chrome://ai4paper/content/icons/folder_20px.svg)";
          var5219.setAttribute('id', "ToolBar-favoriteCollection:" + var5221.savedSearchPart.collectionsName[var5223]);
          var5219.addEventListener("command", _0x24a998 => {
            Zotero.AI4Paper.addEvent_FavoriteCollection(false, _0x24a998, var5221.savedSearchPart.collectionsKey[var5223], param1021);
          });
          param1020.appendChild(var5219);
        }
      }
    }
  },
  'addEvent_FavoriteCollection': function (param1022, param1023, param1024, param1025) {
    if (param1023.shiftKey && !param1023.ctrlKey && !param1023.altKey && !param1023.metaKey) {
      Zotero.AI4Paper.setTopFavoriteCollection(param1022, param1024);
      if (param1025) {
        Zotero.AI4Paper.addReaderMenuButton_go2FavoriteCollection(Zotero.AI4Paper.getCurrentReader()._iframeWindow);
      }
      return;
    }
    if (param1023.shiftKey && param1023.metaKey && !param1023.ctrlKey && !param1023.altKey) {
      Zotero.AI4Paper.moveUpFavoriteCollection(param1022, param1024);
      param1025 && Zotero.AI4Paper.addReaderMenuButton_go2FavoriteCollection(Zotero.AI4Paper.getCurrentReader()._iframeWindow);
      return;
    }
    if ((Zotero.isMac || Zotero.isLinux) && param1023.altKey && param1023.metaKey && !param1023.shiftKey && !param1023.ctrlKey || Zotero.isWin && param1023.ctrlKey && param1023.metaKey && !param1023.shiftKey && !param1023.altKey) {
      Zotero.AI4Paper.moveDownFavoriteCollection(param1022, param1024);
      param1025 && Zotero.AI4Paper.addReaderMenuButton_go2FavoriteCollection(Zotero.AI4Paper.getCurrentReader()._iframeWindow);
      return;
    }
    if ((Zotero.isMac || Zotero.isLinux) && param1023.altKey && !param1023.shiftKey && !param1023.ctrlKey && !param1023.metaKey || Zotero.isWin && param1023.ctrlKey && !param1023.shiftKey && !param1023.altKey && !param1023.metaKey) {
      Zotero.AI4Paper.removeFavoriteCollectionFromList(param1022, param1024);
      param1025 && Zotero.AI4Paper.addReaderMenuButton_go2FavoriteCollection(Zotero.AI4Paper.getCurrentReader()._iframeWindow);
      return;
    }
    Zotero.AI4Paper.go2FavoriteCollection(param1022, param1024);
  },
  'formatFavoriteCollection': function () {
    let var5224 = {
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
      var5225 = Zotero.Prefs.get("ai4paper.favoritecollections");
    if (var5225 === '') {
      Zotero.Prefs.set("ai4paper.favoritecollections", JSON.stringify(var5224));
      return;
    }
    let var5226 = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections"));
    !var5226.savedSearchPart && var5226.collectionsID && (!var5226.collectionsID.length ? Zotero.Prefs.set("ai4paper.favoritecollections", JSON.stringify(var5224)) : (var5224.collectionPart = var5226, Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(var5224))));
  },
  'setFavoriteCollection': function () {
    let var5227 = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      var5228 = ZoteroPane.getSelectedCollection() || ZoteroPane.getSelectedSavedSearch() || undefined;
    if (var5228) {
      let var5229 = var5228?.["conditions"] ? "savedSearchPart" : "collectionPart",
        var5230 = var5228?.["conditions"] ? "保存的搜索" : '分类';
      var5227[var5229].collectionsID.push(var5228.id);
      var5227[var5229].collectionsName.push(var5228.name);
      var5227[var5229].collectionsKey.push(var5228.key);
      Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(var5227));
      Zotero.AI4Paper.showProgressWindow(0x1f4, '收藏【Zotero\x20One】', '✅\x20' + var5230 + '：【' + var5228.name + "】，现已成功收藏！");
    }
  },
  'removeFavoriteCollection': function () {
    let var5231 = JSON.parse(Zotero.Prefs.get('ai4paper.favoritecollections')),
      var5232 = ZoteroPane.getSelectedCollection() || ZoteroPane.getSelectedSavedSearch() || undefined;
    if (var5232) {
      let var5233 = var5232?.["conditions"] ? "savedSearchPart" : "collectionPart",
        var5234 = var5232?.["conditions"] ? '保存的搜索' : '分类';
      for (let var5235 = 0x0; var5235 < var5231[var5233].collectionsKey.length; var5235++) {
        if (var5231[var5233].collectionsKey[var5235] === var5232.key) {
          return var5231[var5233].collectionsID.splice(var5235, 0x1), var5231[var5233].collectionsName.splice(var5235, 0x1), var5231[var5233].collectionsKey.splice(var5235, 0x1), Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(var5231)), Zotero.AI4Paper.showProgressWindow(0x1f4, "取消收藏【AI4paper】", '✅\x20' + var5234 + '：【' + var5232.name + "】，现已取消收藏！"), true;
        }
      }
    }
  },
  'removeFavoriteCollectionFromList': function (param1026, param1027) {
    let var5236 = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      var5237 = !param1026 ? 'savedSearchPart' : "collectionPart",
      var5238 = !param1026 ? '保存的搜索' : '分类';
    for (let var5239 = 0x0; var5239 < var5236[var5237].collectionsKey.length; var5239++) {
      if (var5236[var5237].collectionsKey[var5239] === param1027) {
        let var5240 = var5236[var5237].collectionsName[var5239];
        return var5236[var5237].collectionsID.splice(var5239, 0x1), var5236[var5237].collectionsName.splice(var5239, 0x1), var5236[var5237].collectionsKey.splice(var5239, 0x1), Zotero.Prefs.set("ai4paper.favoritecollections", JSON.stringify(var5236)), true;
      }
    }
  },
  'setTopFavoriteCollection': function (param1028, param1029) {
    let var5241 = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      var5242 = !param1028 ? "savedSearchPart" : "collectionPart",
      var5243 = !param1028 ? "保存的搜索" : '分类';
    for (let var5244 = 0x0; var5244 < var5241[var5242].collectionsKey.length; var5244++) {
      if (var5241[var5242].collectionsKey[var5244] === param1029) {
        let var5245 = var5241[var5242].collectionsName[var5244],
          var5246 = var5241[var5242].collectionsID[var5244];
        return var5241[var5242].collectionsID.splice(var5244, 0x1), var5241[var5242].collectionsName.splice(var5244, 0x1), var5241[var5242].collectionsKey.splice(var5244, 0x1), var5241[var5242].collectionsID.unshift(var5246), var5241[var5242].collectionsName.unshift(var5245), var5241[var5242].collectionsKey.unshift(param1029), Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(var5241)), true;
      }
    }
  },
  'moveUpFavoriteCollection': function (param1030, param1031) {
    let var5247 = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      var5248 = !param1030 ? "savedSearchPart" : "collectionPart",
      var5249 = !param1030 ? '保存的搜索' : '分类';
    if (var5247[var5248].collectionsKey.length <= 0x1) return;
    for (let var5250 = 0x0; var5250 < var5247[var5248].collectionsKey.length; var5250++) {
      if (var5247[var5248].collectionsKey[var5250] === param1031) {
        let _0x231684 = var5247[var5248].collectionsName[var5250];
        if (var5250 === 0x0) {
          const _0x5432b8 = var5247[var5248].collectionsID.shift();
          var5247[var5248].collectionsID.push(_0x5432b8);
          const _0x3f0e6a = var5247[var5248].collectionsName.shift();
          var5247[var5248].collectionsName.push(_0x3f0e6a);
          const _0x1c75db = var5247[var5248].collectionsKey.shift();
          var5247[var5248].collectionsKey.push(_0x1c75db);
        } else {
          [var5247[var5248].collectionsID[var5250 - 0x1], var5247[var5248].collectionsID[var5250]] = [var5247[var5248].collectionsID[var5250], var5247[var5248].collectionsID[var5250 - 0x1]];
          [var5247[var5248].collectionsName[var5250 - 0x1], var5247[var5248].collectionsName[var5250]] = [var5247[var5248].collectionsName[var5250], var5247[var5248].collectionsName[var5250 - 0x1]];
          [var5247[var5248].collectionsKey[var5250 - 0x1], var5247[var5248].collectionsKey[var5250]] = [var5247[var5248].collectionsKey[var5250], var5247[var5248].collectionsKey[var5250 - 0x1]];
        }
        return Zotero.Prefs.set("ai4paper.favoritecollections", JSON.stringify(var5247)), true;
      }
    }
  },
  'moveDownFavoriteCollection': function (param1032, param1033) {
    let var5255 = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      var5256 = !param1032 ? 'savedSearchPart' : 'collectionPart',
      var5257 = !param1032 ? "保存的搜索" : '分类';
    if (var5255[var5256].collectionsKey.length <= 0x1) return;
    for (let var5258 = 0x0; var5258 < var5255[var5256].collectionsKey.length; var5258++) {
      if (var5255[var5256].collectionsKey[var5258] === param1033) {
        let var5259 = var5255[var5256].collectionsName[var5258];
        if (var5258 === var5255[var5256].collectionsKey.length - 0x1) {
          const var5260 = var5255[var5256].collectionsID.pop();
          var5255[var5256].collectionsID.unshift(var5260);
          const var5261 = var5255[var5256].collectionsName.pop();
          var5255[var5256].collectionsName.unshift(var5261);
          const var5262 = var5255[var5256].collectionsKey.pop();
          var5255[var5256].collectionsKey.unshift(var5262);
        } else {
          [var5255[var5256].collectionsID[var5258], var5255[var5256].collectionsID[var5258 + 0x1]] = [var5255[var5256].collectionsID[var5258 + 0x1], var5255[var5256].collectionsID[var5258]];
          [var5255[var5256].collectionsName[var5258], var5255[var5256].collectionsName[var5258 + 0x1]] = [var5255[var5256].collectionsName[var5258 + 0x1], var5255[var5256].collectionsName[var5258]];
          [var5255[var5256].collectionsKey[var5258], var5255[var5256].collectionsKey[var5258 + 0x1]] = [var5255[var5256].collectionsKey[var5258 + 0x1], var5255[var5256].collectionsKey[var5258]];
        }
        return Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(var5255)), true;
      }
    }
  },
  'go2FavoriteCollection': function (param1034, param1035) {
    if (!Zotero.AI4Paper.letDOI()) return;
    let var5263 = param1034 ? "Collections" : "Searches",
      var5264 = param1034 ? "selectCollection" : "selectSearch";
    for (let var5265 of Zotero.Libraries.getAll().map(_0x18e315 => _0x18e315.libraryID)) {
      let var5266 = Zotero[var5263].getByLibraryAndKey(var5265, param1035);
      if (var5266) {
        Zotero_Tabs.select("zotero-pane");
        ZoteroPane_Local.collectionsView[var5264](var5266.id);
        return;
      }
      continue;
    }
  },
  'checkFavoriteCollection': function (param1036) {
    if (Zotero.Prefs.get("ai4paper.favoritecollections") === '') return false;
    let var5267 = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections"));
    if (var5267.collectionPart.collectionsID.length || var5267.savedSearchPart.collectionsID.length) {
      for (let var5268 = 0x0; var5268 < var5267.collectionPart.collectionsKey.length; var5268++) {
        if (var5267.collectionPart.collectionsKey[var5268] === param1036.key) return true;
      }
      for (let var5269 = 0x0; var5269 < var5267.savedSearchPart.collectionsKey.length; var5269++) {
        if (var5267.savedSearchPart.collectionsKey[var5269] === param1036.key) return true;
      }
    }
    return false;
  },
  'onDeleteCollectionEvent': function (param1037, param1038) {
    Zotero.AI4Paper.formatFavoriteCollection();
    if (Zotero.Prefs.get("ai4paper.favoritecollections") === '') return false;else {
      if (!JSON.parse(Zotero.Prefs.get('ai4paper.favoritecollections')).collectionPart.collectionsID.length && !JSON.parse(Zotero.Prefs.get('ai4paper.favoritecollections')).savedSearchPart.collectionsID.length) {
        return false;
      }
    }
    let var5270 = JSON.parse(Zotero.Prefs.get("ai4paper.favoritecollections")),
      var5271 = !param1037 ? "savedSearchPart" : "collectionPart";
    for (let var5272 = 0x0; var5272 < var5270[var5271].collectionsID.length; var5272++) {
      if (var5270[var5271].collectionsID[var5272] === param1038) {
        return var5270[var5271].collectionsID.splice(var5272, 0x1), var5270[var5271].collectionsName.splice(var5272, 0x1), var5270[var5271].collectionsKey.splice(var5272, 0x1), Zotero.Prefs.set('ai4paper.favoritecollections', JSON.stringify(var5270)), true;
      }
    }
  },

});
