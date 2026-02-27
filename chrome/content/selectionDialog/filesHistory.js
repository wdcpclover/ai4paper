var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => window.close());
  methodsBody.registerShortcuts();
  document.addEventListener("focus", () => {
    methodsBody.updateViewOnFocus();
  });
  document.getElementById("filesHistory-doubleClick-enable").checked = Zotero.Prefs.get('zoteroif.filesHistoryDoubleClick');
  document.getElementById("setFilesHistoryAsDefaultView").checked = Zotero.Prefs.get("zoteroif.setFilesHistoryAsDefaultView");
  if (Zotero.ZoteroIF._data_useWorkSpaceView) {
    methodsBody.setView("workSpace");
    Zotero.ZoteroIF._data_useWorkSpaceView = null;
  } else {
    let var1 = Zotero.Prefs.get("zoteroif.setFilesHistoryAsDefaultView") ? 'filesHistory' : "workSpace";
    methodsBody.setView(Zotero.ZoteroIF.lastFilesHistoryView ? Zotero.ZoteroIF.lastFilesHistoryView : var1);
  }
  methodsBody.initFilesHistoryList();
  methodsBody.buildWorkSpaceButtons("init");
  methodsBody.buildContextMenu(null, true);
  methodsBody.buildContextMenu_workSpaceItem(null, true);
  methodsBody.buildContextMenu_workSpaceButton(null, true);
  methodsBody.buildContextMenu_addItemsButton(null, true);
  methodsBody.focusSearchBox();
};
methodsBody.setView = function (param1) {
  let var2 = ["filesHistory", "workSpace"];
  for (let var3 of var2) {
    var3 === param1 ? (document.getElementById(var3 + "View-button").setAttribute('default', true), document.getElementById(var3 + "View").hidden = false, document.getElementById(var3 + "-message-hbox").style.display = '') : (document.getElementById(var3 + "View-button").setAttribute("default", false), document.getElementById(var3 + "View").hidden = true, document.getElementById(var3 + "-message-hbox").style.display = 'none');
    if (param1 === "workSpace") {
      document.title = '工作区';
      document.getElementById("openWorkSpaceFiles-button").style.display = '';
      document.getElementById("openWorkSpaceFilesOnly-button").style.display = '';
      document.getElementById("addItems2WorkSpace-button").style.display = '';
      document.getElementById("filesHistory-doubleClick-enable").style.display = 'none';
      document.getElementById('setFilesHistoryAsDefaultView').style.display = "none";
      document.getElementById("zotero-workSpace-links").focus();
    } else {
      document.title = "最近打开";
      document.getElementById("openWorkSpaceFiles-button").style.display = "none";
      document.getElementById("openWorkSpaceFilesOnly-button").style.display = 'none';
      document.getElementById('addItems2WorkSpace-button').style.display = "none";
      document.getElementById("filesHistory-doubleClick-enable").style.display = '';
      document.getElementById("setFilesHistoryAsDefaultView").style.display = '';
      document.getElementById('zotero-filesHistory-links').focus();
    }
  }
};
methodsBody.switchView = function () {
  if (document.getElementById("filesHistoryView-button").getAttribute("default") === "true") methodsBody.setView('workSpace');else document.getElementById("workSpaceView-button").getAttribute('default') === "true" && methodsBody.setView('filesHistory');
};
methodsBody.switchTypeView = function () {
  let var4 = document.querySelectorAll(".filesHistory-filterButton"),
    var5 = document.querySelectorAll('.workSpaceButton');
  if (document.getElementById('filesHistoryView-button').getAttribute("default") === "true") {
    for (let var6 = 0x0; var6 < var4.length; var6++) {
      if (var4[var6].getAttribute("default") === 'true') {
        let var7 = var6 === var4.length - 0x1 ? 0x0 : var6 + 0x1;
        var4[var7].click();
        return;
      }
    }
  } else {
    if (document.getElementById("workSpaceView-button").getAttribute("default") === "true") for (let var8 = 0x0; var8 < var5.length; var8++) {
      if (var5[var8].getAttribute("default") === "true") {
        let var9 = var8 === var5.length - 0x1 ? 0x0 : var8 + 0x1;
        var5[var9].click();
        return;
      }
    }
  }
};
methodsBody.focusSearchBox = function () {
  document.getElementById("filesHistoryView-button").getAttribute("default") === "true" ? document.getElementById("zoteroif.filesHistory.search").focus() : document.getElementById("zoteroif.workSpace.search").focus();
};
methodsBody.buildWorkSpaceButtons = function (param2, param3) {
  let var10 = methodsBody.getCurrentWorkSpaceName(),
    var11 = JSON.parse(Zotero.Prefs.get("zoteroif.workSpacesData")).map(_0x54da3a => _0x54da3a.workSpaceName);
  document.querySelectorAll(".workSpaceButton").forEach(_0x36e180 => _0x36e180.remove());
  for (let var12 of var11) {
    let _0x5d67a9 = document.createXULElement("button");
    _0x5d67a9.setAttribute('label', var12);
    _0x5d67a9.className = "workSpaceButton";
    _0x5d67a9.addEventListener("click", _0x119931 => {
      if (_0x119931.button === 0x2) {
        let _0x23ee81 = methodsBody.buildContextMenu_workSpaceButton(_0x119931);
        _0x23ee81 && _0x23ee81.openPopup(_0x5d67a9, "after_start", 0x46, 0x0, false, false);
        return;
      }
      methodsBody.showWorkSpaceItems(var12);
      document.querySelectorAll('.workSpaceButton').forEach(_0x2f16d0 => {
        if (_0x2f16d0 === _0x5d67a9) {
          _0x2f16d0.setAttribute("default", true);
        } else {
          _0x2f16d0.setAttribute("default", false);
        }
      });
    });
    document.getElementById("workSpaces-Container").appendChild(_0x5d67a9);
  }
  let var15 = document.querySelectorAll(".workSpaceButton");
  if (var15.length) {
    if (param2 === "focus" && var10) {
      var15.forEach(_0x54b108 => {
        if (_0x54b108.getAttribute("label") === var10) {
          _0x54b108.setAttribute("default", true);
        } else _0x54b108.setAttribute("default", false);
      });
      return;
    }
    let var16;
    if (param2 === 'init') {
      var16 = var15[0x0];
    } else {
      if (param2 === "add" || param2 === 'focus' && !var10) var16 = var15[var15.length - 0x1];else (param2 === "rename" || param2 === "move") && (var16 = Array.from(document.querySelectorAll(".workSpaceButton")).filter(_0x35ac7b => _0x35ac7b.getAttribute("label") === param3)[0x0]);
    }
    ;
    var16.click();
    var15.forEach(_0x4ddced => {
      _0x4ddced === var16 ? _0x4ddced.setAttribute('default', true) : _0x4ddced.setAttribute("default", false);
    });
  } else {
    let _0x11f66f = document.getElementById("zotero-workSpace-links");
    methodsBody.clearListbox(_0x11f66f);
    let _0x356b8c = document.getElementById("workSpace-message-label");
    _0x356b8c.textContent = "尚未创建任何工作区，请点击下方 ➕ 按钮以创建。";
  }
};
methodsBody.getCurrentWorkSpaceName = function () {
  let var19 = Array.from(document.querySelectorAll(".workSpaceButton")).filter(_0xc83c90 => _0xc83c90.getAttribute("default") === "true")[0x0];
  if (var19) return var19.getAttribute('label');
  return false;
};
methodsBody.addNewWorkSpace = function () {
  let var20 = Zotero.ZoteroIF.createTabsAsWorkSpace();
  var20 && methodsBody.buildWorkSpaceButtons("add");
};
methodsBody.renameWorkSpace = function (param4) {
  let var21 = Zotero.ZoteroIF.renameWorkSpace(param4);
  if (var21) {
    methodsBody.buildWorkSpaceButtons("rename", var21);
  }
};
methodsBody.deleteWorkSpace = function (param5) {
  var var22 = window.confirm("是否确认删除工作区【" + param5 + '】？');
  if (var22) {
    let var23 = Zotero.ZoteroIF.deleteWorkSpace(param5);
    var23 && methodsBody.buildWorkSpaceButtons('init');
  }
};
methodsBody.deleteAllWorkSpaces = function () {
  var var24 = window.confirm('是否确认删除所有工作区？👉\x20删除后将无法恢复。👈');
  if (var24) {
    Zotero.Prefs.set("zoteroif.workSpacesData", JSON.stringify([]));
    methodsBody.buildWorkSpaceButtons("init");
  }
};
methodsBody.addCurrentTab2WorkSpace = function (param6) {
  let var25 = Zotero.ZoteroIF.addCurrentTab2WorkSpace(param6);
  var25 && methodsBody.buildWorkSpaceButtons("move", param6);
};
methodsBody.addAllTabs2WorkSpace = function (param7) {
  let var26 = Zotero.ZoteroIF.addAllTabs2WorkSpace(param7);
  var26 && methodsBody.buildWorkSpaceButtons("move", param7);
};
methodsBody.replaceWorkSpaceItems = function (param8) {
  let var27 = Zotero.ZoteroIF.replaceWorkSpaceItems(param8);
  var27 && methodsBody.buildWorkSpaceButtons("move", param8);
};
methodsBody.removeItemFromWorkSpace = function (param9, param10) {
  let var28 = Zotero.ZoteroIF.removeItemFromWorkSpace(param9, param10);
  var28 && methodsBody.buildWorkSpaceButtons("move", param9);
};
methodsBody.removeSelectedItemsFromWorkSpace = function (param11) {
  var var29 = document.getElementById("zotero-workSpace-links");
  let var30 = [];
  for (var var31 = 0x0; var31 < var29.childNodes.length; var31++) {
    var var32 = var29.childNodes[var31];
    if (var32.firstElementChild.checked) {
      let _0x60dd6d = var32.firstElementChild.getAttribute('label'),
        _0x327218 = _0x60dd6d.indexOf('🆔');
      var30.push(_0x60dd6d.substring(_0x327218 + 0x3));
    }
  }
  if (!var30.length) {
    return window.alert("❌ 还未任选任何条目！"), false;
  }
  let var35 = Zotero.ZoteroIF.removeSelectedItemsFromWorkSpace(param11, var30);
  var35 && methodsBody.buildWorkSpaceButtons("move", param11);
};
methodsBody.removeAllItemsFromWorkSpace = function (param12) {
  let var36 = Zotero.ZoteroIF.removeAllItemsFromWorkSpace(param12);
  var36 && methodsBody.buildWorkSpaceButtons("move", param12);
};
methodsBody.sendSelectedItems2AI = function (param13) {
  var var37 = document.getElementById("zotero-workSpace-links");
  let var38 = [];
  for (var var39 = 0x0; var39 < var37.childNodes.length; var39++) {
    var var40 = var37.childNodes[var39];
    if (var40.firstElementChild.checked) {
      let _0x4906cf = var40.firstElementChild.getAttribute('label');
      var38.push(_0x4906cf);
    }
  }
  if (!var38.length) {
    return window.alert("❌ 还未任选任何条目！"), false;
  }
  Zotero.ZoteroIF._dataOut_selectedPDFsInfo = var38.join('\x0a');
  Zotero.ZoteroIF.processTextAreaValue_importPDFs();
};
methodsBody.addSelectedItems2TargetCollection = async function (param14) {
  var var42 = document.getElementById('zotero-workSpace-links');
  let var43 = [];
  for (var var44 = 0x0; var44 < var42.childNodes.length; var44++) {
    var var45 = var42.childNodes[var44];
    if (var45.firstElementChild.checked) {
      let _0x9ec0b5 = var45.firstElementChild.getAttribute("label"),
        _0x35f4f3 = _0x9ec0b5.lastIndexOf('🆔'),
        _0x567181 = _0x9ec0b5.substring(_0x35f4f3 + 0x2).trim(),
        _0x27d89d = Zotero.ZoteroIF.findItemByIDORKey(_0x567181);
      _0x27d89d && (_0x27d89d.parentItem && (_0x27d89d = _0x27d89d.parentItem), var43.push(_0x27d89d));
    }
  }
  if (!var43.length) return window.alert("❌ 还未任选任何条目！"), false;
  let var50 = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
  if (!var50) {
    window.alert("未选中任何分类，请前往 Zotero 主界面选中目标分类。");
    return;
  }
  for (let var51 of var43) {
    var51.addToCollection(var50.id);
    await var51.saveTx();
  }
  window.alert("✅ 成功将【" + param14 + "】工作区内选中的【" + var43.length + "】篇文献添加至【" + var50.name + "】分类。");
};
methodsBody.onClickButton_addItems2WorkSpace = function (param15) {
  let var52 = param15.target,
    var53 = methodsBody.getCurrentWorkSpaceName();
  if (!var53) {
    window.alert("请至少创建一个工作区！");
    return;
  }
  let var54 = methodsBody.buildContextMenu_addItemsButton(var53);
  var54 && var54.openPopup(var52, "after_start", 0x0, 0x0, false, false);
};
methodsBody.setTopWorkSpace = function (param16) {
  let var55 = Zotero.ZoteroIF.setTopWorkSpace(param16);
  var55 && methodsBody.buildWorkSpaceButtons("move", param16);
};
methodsBody.moveUpWorkSpace = function (param17) {
  let var56 = Zotero.ZoteroIF.moveUpWorkSpace(param17);
  if (var56) {
    methodsBody.buildWorkSpaceButtons("move", param17);
  }
};
methodsBody.moveDownWorkSpace = function (param18) {
  let var57 = Zotero.ZoteroIF.moveDownWorkSpace(param18);
  var57 && methodsBody.buildWorkSpaceButtons("move", param18);
};
methodsBody.setTopWorkSpaceItem = function (param19, param20) {
  let var58 = Zotero.ZoteroIF.setTopWorkSpaceItem(param19, param20);
  var58 && (methodsBody.buildWorkSpaceButtons("move", param19), methodsBody.selectWorkSpaceItemAfterMove(param20));
};
methodsBody.moveUpWorkSpaceItem = function (param21, param22) {
  let var59 = Zotero.ZoteroIF.moveUpWorkSpaceItem(param21, param22);
  var59 && (methodsBody.buildWorkSpaceButtons('move', param21), methodsBody.selectWorkSpaceItemAfterMove(param22));
};
methodsBody.moveDownWorkSpaceItem = function (param23, param24) {
  let var60 = Zotero.ZoteroIF.moveDownWorkSpaceItem(param23, param24);
  if (var60) {
    methodsBody.buildWorkSpaceButtons("move", param23);
    methodsBody.selectWorkSpaceItemAfterMove(param24);
  }
};
methodsBody.selectWorkSpaceItemAfterMove = function (param25) {
  var var61 = document.getElementById("zotero-workSpace-links");
  let var62;
  for (var var63 = 0x0; var63 < var61.childNodes.length; var63++) {
    let _0x2cacd3 = var61.childNodes[var63];
    _0x2cacd3.firstElementChild.getAttribute("label").includes(param25) && (var62 = _0x2cacd3);
  }
  var62 && (var62.firstElementChild.click(), var62.firstElementChild.checked = false, var62.scrollIntoView({
    'behavior': 'smooth',
    'block': "start"
  }));
};
methodsBody.showWorkSpaceItems = function (param26) {
  var var65 = document.getElementById('workSpace-message-label'),
    var66 = document.getElementById('zotero-workSpace-links'),
    var67 = Zotero.ZoteroIF.getWorkSpaceItemsInfo(param26);
  methodsBody.clearListbox(var66);
  methodsBody.buildItemNodes(var66, var67, true);
  if (var67.length === 0x0) {
    var65.textContent = "工作区【" + param26 + "】共有文献【0】篇";
  } else {
    var65.textContent = '工作区【' + param26 + "】共有文献【" + var67.length + '】篇';
  }
};
methodsBody.initFilesHistoryList = function () {
  let var68 = ["all", 'today', "lastDay", "lastWeek", 'lastMonth'];
  for (let var69 of var68) {
    if (var69 === Zotero.ZoteroIF.lastFilesHistoryPane) {
      methodsBody[var69]();
      return;
    }
  }
  methodsBody.all();
};
methodsBody.all = function () {
  var var70 = document.getElementById('filesHistory-message-label'),
    var71 = document.getElementById("zotero-filesHistory-links"),
    var72 = Zotero.ZoteroIF.getFilesHistory();
  methodsBody.updateButtonStatus("all");
  methodsBody.clearListbox(var71);
  methodsBody.buildItemNodes(var71, var72);
  var70.textContent = "最近打开文献【" + var72.length + '】篇';
};
methodsBody.today = function () {
  var var73 = document.getElementById("filesHistory-message-label"),
    var74 = document.getElementById("zotero-filesHistory-links"),
    var75 = Zotero.ZoteroIF.getFilesHistoryToday();
  methodsBody.updateButtonStatus("today");
  methodsBody.clearListbox(var74);
  methodsBody.buildItemNodes(var74, var75);
  var73.textContent = '今天打开文献【' + var75.length + '】篇';
};
methodsBody.lastDay = function () {
  var var76 = document.getElementById('filesHistory-message-label'),
    var77 = document.getElementById("zotero-filesHistory-links"),
    var78 = Zotero.ZoteroIF.getFilesHistoryLastDay();
  methodsBody.updateButtonStatus('lastDay');
  methodsBody.clearListbox(var77);
  methodsBody.buildItemNodes(var77, var78);
  var76.textContent = "过去一天打开文献【" + var78.length + '】篇';
};
methodsBody.lastWeek = function () {
  var var79 = document.getElementById("filesHistory-message-label"),
    var80 = document.getElementById("zotero-filesHistory-links"),
    var81 = Zotero.ZoteroIF.getFilesHistoryLastWeek();
  methodsBody.updateButtonStatus("lastWeek");
  methodsBody.clearListbox(var80);
  methodsBody.buildItemNodes(var80, var81);
  var79.textContent = "过去一周打开文献【" + var81.length + '】篇';
};
methodsBody.lastMonth = function () {
  var var82 = document.getElementById("filesHistory-message-label"),
    var83 = document.getElementById("zotero-filesHistory-links"),
    var84 = Zotero.ZoteroIF.getFilesHistoryLastMonth();
  methodsBody.updateButtonStatus("lastMonth");
  methodsBody.clearListbox(var83);
  methodsBody.buildItemNodes(var83, var84);
  var82.textContent = '过去一个月打开文献【' + var84.length + '】篇';
};
methodsBody.search = function () {
  var var85 = document.getElementById("filesHistory-message-label"),
    var86 = document.getElementById('zotero-filesHistory-links'),
    var87 = document.getElementById("zoteroif.filesHistory.search").value.trim();
  if (!var87) return;
  methodsBody.updateButtonStatus("all");
  let var88 = Zotero.ZoteroIF.getFilesHistory(),
    var89 = Zotero.ZoteroIF.getFilesHistorySearch(var87);
  methodsBody.clearListbox(var86);
  methodsBody.buildItemNodes(var86, var89);
  var85.textContent = "最近打开的【" + var88.length + "】篇文献中，标题包含【" + var87 + "】的文献共【" + var89.length + '】篇';
};
methodsBody.searchWorkSpace = function () {
  var var90 = document.getElementById("workSpace-message-label"),
    var91 = document.getElementById("zotero-workSpace-links"),
    var92 = document.getElementById("zoteroif.workSpace.search").value.trim();
  if (!var92) {
    return;
  }
  let var93 = Array.from(document.querySelectorAll(".workSpaceButton")).filter(_0x48a67e => _0x48a67e.getAttribute("default") === "true")[0x0];
  if (!var93) return;
  let var94 = var93.getAttribute("label"),
    var95 = Zotero.ZoteroIF.getWorkSpaceItemsInfo(var94),
    var96 = Zotero.ZoteroIF.searchWorkSpaceItems(var94, var92);
  methodsBody.clearListbox(var91);
  methodsBody.buildItemNodes(var91, var96);
  var90.textContent = "工作区【" + var94 + "】的【" + var95.length + '】篇文献中，标题包含【' + var92 + "】的文献共【" + var96.length + '】篇';
};
methodsBody.checkKeyEnter = function (param27) {
  !param27.shiftKey && !param27.ctrlKey && !param27.altKey && !param27.metaKey && param27.keyCode === 0xd && (param27.returnValue = false, param27.preventDefault && param27.preventDefault(), methodsBody.search());
};
methodsBody.checkKeyEnter_workSpace = function (param28) {
  if (!param28.shiftKey && !param28.ctrlKey && !param28.altKey && !param28.metaKey && param28.keyCode === 0xd) {
    param28.returnValue = false;
    param28.preventDefault && param28.preventDefault();
    methodsBody.searchWorkSpace();
  }
};
methodsBody.onClickWorkSpaceIcon = function (param29) {
  if (param29.shiftKey) {
    methodsBody.deleteAllWorkSpaces();
  } else {
    let var97 = JSON.parse(Zotero.Prefs.get("zoteroif.workSpacesData")).map(_0x259c2c => _0x259c2c.workSpaceName);
    Zotero.ZoteroIF.showProgressWindow(0xbb8, "统计工作区数量【AI4paper】", "共有【" + var97.length + "】个工作区！");
  }
};
methodsBody.selectAll = function (param30) {
  var var98 = document.getElementById("zotero-filesHistory-links");
  document.getElementById("workSpaceView-button").getAttribute("default") === "true" && (var98 = document.getElementById("zotero-workSpace-links"));
  for (var var99 = 0x0; var99 < var98.childNodes.length; var99++) {
    var98.childNodes[var99].firstElementChild.checked = !param30;
  }
  return var98.childNodes.length;
};
methodsBody.shiftClick = function (param31) {
  Zotero.ZoteroIF.go2FilesHistoryItem(param31);
  methodsBody.storeCurrentView();
};
methodsBody.openSelectedFiles = function () {
  var var100 = document.getElementById("zotero-filesHistory-links");
  if (document.getElementById("workSpaceView-button").getAttribute("default") === "true") {
    var100 = document.getElementById("zotero-workSpace-links");
  }
  let var101 = [];
  for (var var102 = 0x0; var102 < var100.childNodes.length; var102++) {
    var var103 = var100.childNodes[var102];
    var103.firstElementChild.checked && var101.push(var103.firstElementChild.getAttribute("label"));
  }
  if (!var101.length) return Zotero.ZoteroIF.showProgressWindow(0x1388, "温馨提示", "您还未选择文献！"), false;
  Zotero.ZoteroIF.openFilesHistoryItem(var101);
  methodsBody.storeCurrentView();
};
methodsBody.openWorkSpaceFiles = function () {
  let var104 = methodsBody.selectAll();
  var104 ? methodsBody.openSelectedFiles() : window.alert("❌ 当前工作区为空！");
};
methodsBody.openWorkSpaceFilesOnly = async function () {
  let var105 = methodsBody.selectAll();
  if (var105) {
    Zotero.getMainWindow().Zotero_Tabs.closeAll();
    await Zotero.Promise.delay(0xa);
    methodsBody.openSelectedFiles();
  } else {
    window.alert("❌ 当前工作区为空！");
  }
};
methodsBody.doubleClickJump = function (param32) {
  if (!Zotero.Prefs.get('zoteroif.filesHistoryDoubleClick')) return;
  Zotero.ZoteroIF.openFilesHistoryItem([param32]);
  methodsBody.storeCurrentView();
};
methodsBody.storeCurrentView = function () {
  Zotero.ZoteroIF.lastFilesHistoryView = "filesHistory";
  if (document.getElementById("workSpaceView-button").getAttribute("default") === "true") Zotero.ZoteroIF.lastFilesHistoryView = 'workSpace';else {
    let var106 = ["all", "today", "lastDay", 'lastWeek', "lastMonth"];
    for (let var107 of var106) {
      if (document.getElementById(var107 + 'Button').getAttribute('default') === "true") {
        Zotero.ZoteroIF.lastFilesHistoryPane = var107;
      }
    }
  }
};
methodsBody.updateViewOnFocus = function () {
  if (Zotero.ZoteroIF._data_useWorkSpaceView) {
    methodsBody.setView('workSpace');
    methodsBody.buildWorkSpaceButtons("focus");
    Zotero.ZoteroIF._data_useWorkSpaceView = null;
  } else {
    if (document.getElementById("workSpaceView-button").getAttribute("default") === "true") methodsBody.buildWorkSpaceButtons("focus");else {
      let var108 = ["all", "today", "lastDay", "lastWeek", "lastMonth"];
      for (let var109 of var108) {
        if (document.getElementById(var109 + 'Button').getAttribute("default") === 'true') {
          methodsBody[var109]();
          return;
        }
      }
      methodsBody.all();
    }
  }
};
methodsBody.clearListbox = function (param33) {
  let var110 = param33.firstElementChild;
  while (var110) {
    var110.remove();
    var110 = param33.firstElementChild;
  }
};
methodsBody.buildItemNodes = function (param34, param35, param36) {
  for (var var111 in param35) {
    var var112 = param35[var111],
      var113,
      var114 = false;
    var112 && typeof var112 == "object" && var112.title !== undefined ? (var113 = var112.title, var114 = !!var112.checked) : var113 = var112;
    let _0x43e232 = document.createXULElement("richlistitem"),
      _0x145f1f = document.createXULElement("checkbox");
    _0x43e232.style.fontSize = "14px";
    _0x43e232.style.whiteSpace = "nowrap";
    _0x145f1f.checked = var114;
    _0x145f1f.label = var113;
    _0x145f1f.setAttribute('native', 'true');
    _0x43e232.setAttribute("value", var111);
    _0x43e232.append(_0x145f1f);
    _0x43e232.addEventListener("click", _0x37c424 => {
      if (_0x37c424.button === 0x2) {
        let _0x53c31b = param36 ? methodsBody.buildContextMenu_workSpaceItem(_0x37c424) : methodsBody.buildContextMenu(_0x37c424);
        if (_0x53c31b) {
          _0x53c31b.openPopup(_0x43e232, "after_start", 0x46, 0x0, false, false);
        }
        return;
      }
      if (_0x37c424.target == _0x43e232) {
        _0x145f1f.checked = !_0x145f1f.checked;
      }
      if (_0x37c424.shiftKey) {
        let var118 = _0x37c424.target.closest("richlistitem")?.["querySelector"]("checkbox")['label'];
        methodsBody.shiftClick(var118);
      }
    });
    var var119 = 0x0,
      var120;
    _0x43e232.addEventListener("click", function (param37) {
      var119++;
      if (var119 === 0x1) var120 = setTimeout(function () {
        var119 = 0x0;
      }, 0x12c);else {
        if (var119 === 0x2) {
          clearTimeout(var120);
          var119 = 0x0;
          let _0x509a29 = param37.target.closest("richlistitem")?.["querySelector"]('checkbox')["label"];
          methodsBody.doubleClickJump(_0x509a29);
        }
      }
    });
    param34.append(_0x43e232);
  }
  param34.itemCount === 0x1 && (param34.getItemAtIndex(0x0).firstElementChild.checked = true);
};
methodsBody.buildContextMenu = function (param38, param39) {
  let var122 = document.querySelector("#filesHistory-richlistitem-contextmenu");
  if (!var122) {
    var122 = window.document.createXULElement('menupopup');
    var122.id = "filesHistory-richlistitem-contextmenu";
    document.documentElement.appendChild(var122);
    var122 = document.documentElement.lastElementChild.firstElementChild;
    if (param39) return;
  }
  let var123 = param38.target.closest("richlistitem")?.["querySelector"]("checkbox")["label"],
    var124 = var122.firstElementChild;
  while (var124) {
    var124.remove();
    var124 = var122.firstElementChild;
  }
  let var125 = window.document.createXULElement("menuitem");
  return var125.setAttribute("label", "打开文献"), var125.addEventListener("command", () => {
    Zotero.ZoteroIF.openFilesHistoryItem([var123]);
  }), var122.appendChild(var125), var122.appendChild(document.createXULElement("menuseparator")), var125 = window.document.createXULElement('menuitem'), var125.setAttribute('label', "在文库中显示"), var125.addEventListener('command', () => {
    Zotero.ZoteroIF.go2FilesHistoryItem(var123);
  }), var122.appendChild(var125), var122;
};
methodsBody.buildContextMenu_workSpaceItem = function (param40, param41) {
  let var126 = document.querySelector('#workSpace-richlistitem-contextmenu');
  if (!var126) {
    var126 = window.document.createXULElement("menupopup");
    var126.id = "workSpace-richlistitem-contextmenu";
    document.documentElement.appendChild(var126);
    var126 = document.documentElement.lastElementChild.firstElementChild;
    if (param41) return;
  }
  let var127 = param40.target.closest("richlistitem")?.['querySelector']("checkbox")["label"],
    var128 = var127.indexOf('🆔'),
    var129 = var127.substring(var128 + 0x3),
    var130 = methodsBody.getCurrentWorkSpaceName(),
    var131 = var126.firstElementChild;
  while (var131) {
    var131.remove();
    var131 = var126.firstElementChild;
  }
  let var132 = window.document.createXULElement('menuitem');
  return var132.setAttribute('label', '置顶'), var132.addEventListener("command", () => {
    methodsBody.setTopWorkSpaceItem(var130, var129);
  }), var126.appendChild(var132), var132 = window.document.createXULElement("menuitem"), var132.setAttribute('label', '上移'), var132.addEventListener("command", () => {
    methodsBody.moveUpWorkSpaceItem(var130, var129);
  }), var126.appendChild(var132), var132 = window.document.createXULElement("menuitem"), var132.setAttribute("label", '下移'), var132.addEventListener("command", () => {
    methodsBody.moveDownWorkSpaceItem(var130, var129);
  }), var126.appendChild(var132), var126.appendChild(document.createXULElement("menuseparator")), var132 = window.document.createXULElement("menuitem"), var132.setAttribute("label", "打开文献"), var132.addEventListener("command", () => {
    Zotero.ZoteroIF.openFilesHistoryItem([var127]);
  }), var126.appendChild(var132), var132 = window.document.createXULElement('menuitem'), var132.setAttribute("label", "在文库中显示"), var132.addEventListener('command', () => {
    Zotero.ZoteroIF.go2FilesHistoryItem(var127);
  }), var126.appendChild(var132), var132 = window.document.createXULElement('menuitem'), var132.setAttribute("label", "拷贝 PDF"), var132.addEventListener("command", () => {
    let var133 = Zotero.ZoteroIF.findItemByIDORKey(var129);
    !var133 && window.alert("❌ 条目不存在！");
    Zotero.ZoteroIF.copyPDF(var133);
  }), var126.appendChild(var132), var126.appendChild(document.createXULElement("menuseparator")), var132 = window.document.createXULElement("menuitem"), var132.setAttribute("label", "从工作区移除当前文献"), var132.addEventListener("command", () => {
    methodsBody.removeItemFromWorkSpace(var130, var129);
  }), var126.appendChild(var132), var132 = window.document.createXULElement("menuitem"), var132.setAttribute("label", "从工作区移除选中的所有文献"), var132.addEventListener("command", () => {
    methodsBody.removeSelectedItemsFromWorkSpace(var130);
  }), var126.appendChild(var132), var126.appendChild(document.createXULElement("menuseparator")), var132 = window.document.createXULElement("menuitem"), var132.setAttribute('label', "清空工作区内全部文献"), var132.addEventListener("command", () => {
    methodsBody.removeAllItemsFromWorkSpace(var130);
  }), var126.appendChild(var132), var126.appendChild(document.createXULElement("menuseparator")), var132 = window.document.createXULElement("menuitem"), var132.setAttribute("label", '将选中的所有文献发送到\x20GPT\x20侧边栏'), var132.addEventListener("command", () => {
    methodsBody.sendSelectedItems2AI(var130);
  }), var126.appendChild(var132), var126.appendChild(document.createXULElement("menuseparator")), var132 = window.document.createXULElement("menuitem"), var132.setAttribute('label', "将选中的所有文献添加至选定分类"), var132.addEventListener('command', () => {
    methodsBody.addSelectedItems2TargetCollection(var130);
  }), var126.appendChild(var132), var126;
};
methodsBody.buildContextMenu_workSpaceButton = function (param42, param43) {
  let var134 = document.querySelector("#workSpaceButton-contextmenu");
  if (!var134) {
    var134 = window.document.createXULElement('menupopup');
    var134.id = "workSpaceButton-contextmenu";
    document.documentElement.appendChild(var134);
    var134 = document.documentElement.lastElementChild.firstElementChild;
    if (param43) return;
  }
  let var135 = param42.target.getAttribute("label"),
    var136 = var134.firstElementChild;
  while (var136) {
    var136.remove();
    var136 = var134.firstElementChild;
  }
  let var137 = window.document.createXULElement("menuitem");
  return var137.setAttribute("label", '置顶工作区'), var137.addEventListener('command', () => {
    methodsBody.setTopWorkSpace(var135);
  }), var134.appendChild(var137), var134.appendChild(document.createXULElement("menuseparator")), var137 = window.document.createXULElement("menuitem"), var137.setAttribute('label', '左移工作区'), var137.addEventListener("command", () => {
    methodsBody.moveUpWorkSpace(var135);
  }), var134.appendChild(var137), var137 = window.document.createXULElement("menuitem"), var137.setAttribute('label', "右移工作区"), var137.addEventListener("command", () => {
    methodsBody.moveDownWorkSpace(var135);
  }), var134.appendChild(var137), var134.appendChild(document.createXULElement("menuseparator")), var137 = window.document.createXULElement("menuitem"), var137.setAttribute("label", "重命名工作区"), var137.addEventListener("command", () => {
    methodsBody.renameWorkSpace(var135);
  }), var134.appendChild(var137), var134.appendChild(document.createXULElement("menuseparator")), var137 = window.document.createXULElement("menuitem"), var137.setAttribute('label', "删除工作区"), var137.addEventListener('command', () => {
    methodsBody.deleteWorkSpace(var135);
  }), var134.appendChild(var137), var137 = window.document.createXULElement("menuitem"), var137.setAttribute("label", "删除所有工作区"), var137.addEventListener("command", () => {
    methodsBody.deleteAllWorkSpaces();
  }), var134.appendChild(var137), var134.appendChild(document.createXULElement("menuseparator")), var137 = window.document.createXULElement('menuitem'), var137.setAttribute("label", "添加当前标签页文献至工作区"), var137.addEventListener("command", () => {
    methodsBody.addCurrentTab2WorkSpace(var135);
  }), var134.appendChild(var137), var137 = window.document.createXULElement("menuitem"), var137.setAttribute('label', "添加所有标签页文献至工作区"), var137.addEventListener("command", () => {
    methodsBody.addAllTabs2WorkSpace(var135);
  }), var134.appendChild(var137), var134.appendChild(document.createXULElement("menuseparator")), var137 = window.document.createXULElement("menuitem"), var137.setAttribute('label', "替换工作区内全部文献"), var137.addEventListener("command", () => {
    methodsBody.replaceWorkSpaceItems(var135);
  }), var134.appendChild(var137), var137 = window.document.createXULElement("menuitem"), var137.setAttribute('label', '清空工作区内全部文献'), var137.addEventListener("command", () => {
    methodsBody.removeAllItemsFromWorkSpace(var135);
  }), var134.appendChild(var137), var134.appendChild(document.createXULElement("menuseparator")), var137 = window.document.createXULElement("menuitem"), var137.setAttribute('label', "拷贝工作区名称"), var137.addEventListener("command", () => {
    Zotero.ZoteroIF.copy2Clipboard(var135);
  }), var134.appendChild(var137), var137 = window.document.createXULElement("menuitem"), var137.setAttribute("label", "拷贝工作区概要"), var137.addEventListener("command", () => {
    Zotero.ZoteroIF.copyWorkSpaceSummary(var135);
  }), var134.appendChild(var137), var137 = window.document.createXULElement("menuitem"), var137.setAttribute("label", "拷贝全部工作区概要"), var137.addEventListener("command", () => {
    Zotero.ZoteroIF.copyAllWorkSpacesSummary();
  }), var134.appendChild(var137), var134.appendChild(document.createXULElement("menuseparator")), var137 = window.document.createXULElement('menuitem'), var137.setAttribute("label", "关闭所有已打开文献"), var137.addEventListener("command", () => {
    Zotero.getMainWindow().Zotero_Tabs.closeAll();
  }), var134.appendChild(var137), var134;
};
methodsBody.buildContextMenu_addItemsButton = function (param44, param45) {
  let var138 = document.querySelector("#addItemsButton-contextmenu");
  if (!var138) {
    var138 = window.document.createXULElement("menupopup");
    var138.id = "addItemsButton-contextmenu";
    document.documentElement.appendChild(var138);
    var138 = document.documentElement.lastElementChild.firstElementChild;
    if (param45) return;
  }
  let var139 = var138.firstElementChild;
  while (var139) {
    var139.remove();
    var139 = var138.firstElementChild;
  }
  let var140 = window.document.createXULElement('menuitem');
  return var140.setAttribute('label', '添加当前标签页文献至工作区'), var140.addEventListener("command", () => {
    methodsBody.addCurrentTab2WorkSpace(param44);
  }), var138.appendChild(var140), var140 = window.document.createXULElement("menuitem"), var140.setAttribute("label", "添加所有标签页文献至工作区"), var140.addEventListener("command", () => {
    methodsBody.addAllTabs2WorkSpace(param44);
  }), var138.appendChild(var140), var138;
};
methodsBody.updateButtonStatus = function (param46) {
  let var141 = ["all", 'today', "lastDay", "lastWeek", "lastMonth"];
  for (let var142 of var141) {
    if (var142 === param46) {
      document.getElementById(var142 + "Button").setAttribute('default', true);
    } else document.getElementById(var142 + "Button").setAttribute("default", false);
  }
};
methodsBody.registerShortcuts = function () {
  if (!document._switchViewShortcutsAdded) {
    document._switchViewShortcutsAdded = true;
    document.addEventListener("keydown", _0x4840e4 => {
      if (Zotero.isMac) {
        _0x4840e4.key === 't' && !_0x4840e4.ctrlKey && !_0x4840e4.shiftKey && !_0x4840e4.altKey && _0x4840e4.metaKey && methodsBody.switchView();
        _0x4840e4.key === 'd' && !_0x4840e4.ctrlKey && !_0x4840e4.shiftKey && !_0x4840e4.altKey && _0x4840e4.metaKey && methodsBody.switchTypeView();
        _0x4840e4.key === 'f' && !_0x4840e4.ctrlKey && !_0x4840e4.shiftKey && !_0x4840e4.altKey && _0x4840e4.metaKey && methodsBody.focusSearchBox();
      } else {
        _0x4840e4.key === 't' && _0x4840e4.ctrlKey && !_0x4840e4.shiftKey && !_0x4840e4.altKey && !_0x4840e4.metaKey && methodsBody.switchView();
        _0x4840e4.key === 'd' && _0x4840e4.ctrlKey && !_0x4840e4.shiftKey && !_0x4840e4.altKey && !_0x4840e4.metaKey && methodsBody.switchTypeView();
        if (_0x4840e4.key === 'f' && _0x4840e4.ctrlKey && !_0x4840e4.shiftKey && !_0x4840e4.altKey && !_0x4840e4.metaKey) {
          methodsBody.focusSearchBox();
        }
      }
    });
  }
};
methodsBody.maxWindowWidth = function () {
  try {
    const _0x3897fd = window.screen.width,
      _0x34a83d = window.screen.height,
      _0x36ea1d = window.outerHeight,
      _0x6fa0fc = window.screenY,
      _0x10d40a = window.screen.availWidth,
      _0xa9a715 = window.screen.availLeft || 0x0;
    window.moveTo(_0xa9a715, _0x6fa0fc);
    window.resizeTo(_0x10d40a, _0x36ea1d);
  } catch (_0x2ced6c) {
    Zotero.ZoteroIF.showProgressWindow(0xbb8, '❌\x20窗口尺寸调整失败', "出错了！窗口尺寸调整遇到问题。");
  }
};
methodsBody.adjustWindowWidthPercent = function () {
  try {
    let _0x439c20 = window.screen.height,
      _0x933658 = parseInt(_0x439c20) <= 0x3e8 ? 0.8 : 0.6;
    const _0xbcaed = window.outerHeight,
      _0x389744 = window.screenY,
      _0x4cd8f2 = window.screen.availWidth,
      _0x442f35 = window.screen.availLeft || 0x0,
      _0xf68e01 = Math.round(_0x4cd8f2 * _0x933658),
      _0x45d1b1 = _0x442f35 + (_0x4cd8f2 - _0xf68e01) / 0x2;
    window.moveTo(_0x45d1b1, _0x389744);
    window.resizeTo(_0xf68e01, _0xbcaed);
  } catch (_0x2cf445) {
    Zotero.ZoteroIF.showProgressWindow(0xbb8, '❌\x20窗口尺寸调整失败', "出错了！窗口尺寸调整遇到问题。");
  }
};