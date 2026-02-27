var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  document.addEventListener("dialogaccept", () => window.close());
  Zotero.ZoteroIF.formatFavoriteCollection();
  methodsBody.registerShortcuts();
  methodsBody.showItemsByType('collection');
  document.addEventListener('focus', () => {
    methodsBody.showItemsByType(document.getElementById("view-button-collection").getAttribute('default') === "true" ? "collection" : "savedSearch");
  });
  document.getElementById("richlistbox-elem").focus();
  methodsBody.buildContextMenu(null, true);
};
methodsBody.switchView = function () {
  document.getElementById("view-button-collection").getAttribute("default") === 'true' ? methodsBody.showItemsByType("savedSearch") : methodsBody.showItemsByType('collection');
};
methodsBody.showItemsByType = function (param1) {
  var var1 = document.getElementById("richlistbox-elem");
  methodsBody.updateButtonStatus(param1);
  let var2 = JSON.parse(Zotero.Prefs.get("zoteroif.favoritecollections")),
    var3 = var2?.[param1 + "Part"]["collectionsName"];
  methodsBody.clearListbox(var1);
  methodsBody.buildItemNodes(var1, var3, param1);
  var var4 = document.getElementById('message-label');
  var4.textContent = "已收藏【" + var3.length + '】个' + (param1 === 'collection' ? '分类' : "保存的搜索");
};
methodsBody.clearListbox = function (param2) {
  let var5 = param2.firstElementChild;
  while (var5) {
    var5.remove();
    var5 = param2.firstElementChild;
  }
};
methodsBody.buildItemNodes = function (param3, param4, param5) {
  for (var var6 in param4) {
    var var7 = param4[var6],
      var8,
      var9 = false;
    var7 && typeof var7 == "object" && var7.title !== undefined ? (var8 = var7.title, var9 = !!var7.checked) : var8 = var7;
    let var10 = document.createXULElement("richlistitem"),
      var11 = document.createXULElement('checkbox');
    var10.style.fontSize = '14px';
    var10.style.whiteSpace = 'nowrap';
    var11.checked = var9;
    var11.label = var8;
    var11.collectionKey = JSON.parse(Zotero.Prefs.get("zoteroif.favoritecollections"))?.[param5 + "Part"]["collectionsKey"][var6];
    var11.setAttribute("native", "true");
    var10.setAttribute('value', var6);
    var10.append(var11);
    var10.addEventListener("click", _0x59c279 => {
      if (_0x59c279.button === 0x2) {
        let var12 = methodsBody.buildContextMenu(_0x59c279, false, param5 === 'collection' ? true : false);
        var12 && var12.openPopup(var10, 'after_start', 0x46, 0x0, false, false);
        return;
      }
      _0x59c279.target == var10 && (var11.checked = !var11.checked);
      var11.checked && methodsBody.singleSelect(var11);
      _0x59c279.shiftKey && Zotero.ZoteroIF.go2FavoriteCollection(param5 === 'collection' ? true : false, var11.collectionKey);
    });
    param3.append(var10);
  }
  param3.itemCount === 0x1 && (param3.getItemAtIndex(0x0).firstElementChild.checked = true);
};
methodsBody.buildContextMenu = function (param6, param7, param8) {
  let var13 = document.querySelector("#favoriteCollections-richlistitem-contextmenu");
  if (!var13) {
    var13 = window.document.createXULElement("menupopup");
    var13.id = "favoriteCollections-richlistitem-contextmenu";
    document.documentElement.appendChild(var13);
    var13 = document.documentElement.lastElementChild.firstElementChild;
    if (param7) return;
  }
  let var14 = param6.target.closest("richlistitem")?.['querySelector']("checkbox")["collectionKey"],
    var15 = var13.firstElementChild;
  while (var15) {
    var15.remove();
    var15 = var13.firstElementChild;
  }
  let var16 = window.document.createXULElement("menuitem");
  return var16.setAttribute("label", '置顶'), var16.addEventListener('command', () => {
    methodsBody.moveItem(param8, var14, "setTopFavoriteCollection");
  }), var13.appendChild(var16), var16 = window.document.createXULElement('menuitem'), var16.setAttribute("label", '上移'), var16.addEventListener("command", () => {
    methodsBody.moveItem(param8, var14, 'moveUpFavoriteCollection');
  }), var13.appendChild(var16), var16 = window.document.createXULElement("menuitem"), var16.setAttribute("label", '下移'), var16.addEventListener('command', () => {
    methodsBody.moveItem(param8, var14, "moveDownFavoriteCollection");
  }), var13.appendChild(var16), var13.appendChild(document.createXULElement("menuseparator")), var16 = window.document.createXULElement("menuitem"), var16.setAttribute("label", '移除'), var16.addEventListener('command', () => {
    methodsBody.moveItem(param8, var14, "removeFavoriteCollectionFromList");
  }), var13.appendChild(var16), var13.appendChild(document.createXULElement("menuseparator")), var16 = window.document.createXULElement("menuitem"), var16.setAttribute("label", '定位'), var16.addEventListener("command", () => {
    Zotero.ZoteroIF.go2FavoriteCollection(param8, var14);
  }), var13.appendChild(var16), var13;
};
methodsBody.updateButtonStatus = function (param9) {
  let var17 = ["collection", 'savedSearch'];
  for (let var18 of var17) {
    document.getElementById('view-button-' + var18).setAttribute("default", var18 === param9 ? true : false);
  }
};
methodsBody.registerShortcuts = function () {
  !document._switchViewShortcutsAdded && (document._switchViewShortcutsAdded = true, document.addEventListener("keydown", _0x228b57 => {
    Zotero.isMac ? _0x228b57.key === 't' && !_0x228b57.ctrlKey && !_0x228b57.shiftKey && !_0x228b57.altKey && _0x228b57.metaKey && methodsBody.switchView() : _0x228b57.key === 't' && _0x228b57.ctrlKey && !_0x228b57.shiftKey && !_0x228b57.altKey && !_0x228b57.metaKey && methodsBody.switchView();
  }));
};
methodsBody.singleSelect = function (param10) {
  var var19 = document.getElementById("richlistbox-elem");
  let var20 = 0x0;
  for (var var21 = 0x0; var21 < var19.childNodes.length; var21++) {
    let var22 = var19.childNodes[var21].querySelector('checkbox');
    var22 != param10 && (var22.checked = false);
  }
};
methodsBody.moveItem = function (param11, param12, param13) {
  Zotero.ZoteroIF[param13](param11, param12);
  Zotero.ZoteroIF.getCurrentReader() && Zotero.ZoteroIF.addReaderMenuButton_go2FavoriteCollection(Zotero.ZoteroIF.getCurrentReader()._iframeWindow);
  methodsBody.showItemsByType(param11 ? "collection" : 'savedSearch');
  methodsBody.selectItemAfterMove(param12);
};
methodsBody.selectItemAfterMove = function (param14) {
  var var23 = document.getElementById("richlistbox-elem");
  let var24;
  for (var var25 = 0x0; var25 < var23.childNodes.length; var25++) {
    let var26 = var23.childNodes[var25];
    var26.firstElementChild.collectionKey === param14 && (var24 = var26);
  }
  var24 && (var24.firstElementChild.click(), var24.firstElementChild.checked = false, var24.scrollIntoView({
    'behavior': "smooth",
    'block': "start"
  }));
};