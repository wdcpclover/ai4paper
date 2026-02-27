var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  Zotero.ZoteroIF.setFontSize_Dialog(document.querySelector("dialog"), 0.92);
  Zotero.ZoteroIF.lastDeleteTagsSearchInput && (document.getElementById("searchBox-elem").placeholder = Zotero.ZoteroIF.lastDeleteTagsSearchInput);
  document.getElementById("searchBox-elem").focus();
  methodsBody.libraryTag();
  methodsBody.buildContextMenu(null, true);
};
methodsBody.libraryTag = async function () {
  this._searchKeyWords = '选择要删除的全库标签：';
  methodsBody.updateButtonStatus("libraryTag");
  methodsBody.clearListbox();
  let var1 = await methodsBody.getData_allTags();
  if (!var1.length) {
    document.getElementById('message-label').textContent = "共有【0】个标签";
    return;
  }
  methodsBody.buildItemNodes(var1);
  methodsBody.updateSelectedItemNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.automaticTag = async function () {
  this._searchKeyWords = "选择要删除的自动标签：";
  methodsBody.updateButtonStatus('automaticTag');
  methodsBody.clearListbox();
  let var2 = await methodsBody.getData_AutomaticTags();
  if (!var2.length) {
    document.getElementById("message-label").textContent = "共有【0】个自动标签";
    return;
  }
  methodsBody.buildItemNodes(var2);
  methodsBody.updateSelectedItemNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.itemTag = function (param1) {
  this._searchKeyWords = !param1 ? "选择要删除的条目标签：" : '刷新完成，请选择要删除的条目标签：';
  methodsBody.updateButtonStatus("itemTag");
  methodsBody.clearListbox();
  let var3 = Zotero.ZoteroIF.returnItemTags();
  methodsBody.buildItemNodes(var3);
  methodsBody.updateSelectedItemNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.annotationTag = function (param2) {
  this._searchKeyWords = !param2 ? '选择要删除的注释标签：' : "刷新完成，请选择要删除的注释标签：";
  methodsBody.updateButtonStatus('annotationTag');
  methodsBody.clearListbox();
  let var4 = Zotero.ZoteroIF.returnAnnotationTags();
  methodsBody.buildItemNodes(var4);
  methodsBody.updateSelectedItemNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.updateTags = async function (param3) {
  let var5 = {
      'itemTag': "条目标签",
      'annotationTag': "注释标签"
    },
    var6 = await Zotero.Tags.getAll(0x1);
  if (var6.length === 0x0) {
    Zotero.ZoteroIF.showProgressWindow(0xbb8, "❌ 未发现标签【AI4paper】", "未在【我的文库】中发现任何标签！");
    return;
  }
  document.getElementById("message-label").textContent = "正在刷新" + var5[param3] + "，右下角查看进度...";
  let var7 = "_deleteTagsDialog_update_" + param3;
  Zotero.ZoteroIF.progressPercent_initProgress(var6, var7, var5[param3]);
  methodsBody["update_" + param3 + "_checkNext"](var7, var5[param3]);
};
methodsBody.update_itemTag_checkNext = async function (param4, param5) {
  Zotero.ZoteroIF["numberOfUpdatedItems" + param4]++;
  if (Zotero.ZoteroIF["current" + param4] == Zotero.ZoteroIF["toUpdate" + param4] - 0x1) {
    Zotero.ZoteroIF["progressWindow" + param4].close();
    Zotero.ZoteroIF.progressPercent_resetState(null, param4, param5);
    Zotero.Prefs.set("zoteroif.itemTags", JSON.stringify(Zotero.ZoteroIF["_progressData_" + param4]));
    methodsBody.itemTag(true);
    return;
  }
  Zotero.ZoteroIF.progressPercent_updatePercent(param4, "检查所有标签： ");
  methodsBody.update_itemTag_checkTag(Zotero.ZoteroIF['itemsToUpdate' + param4][Zotero.ZoteroIF["current" + param4]], param4, param5);
};
methodsBody.update_itemTag_checkTag = async function (param6, param7, param8) {
  try {
    let var8 = await Zotero.ZoteroIF.checkItemTag(param6.tag);
    if (var8) {
      let _0x48c76d = param6.tag,
        _0x273403 = 0x0,
        _0x54e1c0 = {
          'tag': _0x48c76d,
          'type': _0x273403
        };
      !JSON.stringify(Zotero.ZoteroIF["_progressData_" + param7]).includes(JSON.stringify(_0x54e1c0)) && (Zotero.ZoteroIF['_progressData_' + param7].push(_0x54e1c0), Zotero.ZoteroIF["counter" + param7]++);
    }
  } catch (_0x1315c3) {
    Zotero.debug(_0x1315c3);
  }
  methodsBody.update_itemTag_checkNext(param7, param8);
};
methodsBody.update_annotationTag_checkNext = async function (param9, param10) {
  Zotero.ZoteroIF['numberOfUpdatedItems' + param9]++;
  if (Zotero.ZoteroIF["current" + param9] == Zotero.ZoteroIF["toUpdate" + param9] - 0x1) {
    Zotero.ZoteroIF["progressWindow" + param9].close();
    Zotero.ZoteroIF.progressPercent_resetState(null, param9, param10);
    Zotero.Prefs.set('zoteroif.annotationtagsrecent', JSON.stringify(Zotero.ZoteroIF["_progressData_" + param9]));
    methodsBody.annotationTag(true);
    return;
  }
  Zotero.ZoteroIF.progressPercent_updatePercent(param9, "检查所有标签： ");
  methodsBody.update_annotationTag_checkTag(Zotero.ZoteroIF['itemsToUpdate' + param9][Zotero.ZoteroIF["current" + param9]], param9, param10);
};
methodsBody.update_annotationTag_checkTag = async function (param11, param12, param13) {
  try {
    let var12 = await Zotero.ZoteroIF.checkAnnotationTag(param11.tag);
    if (var12) {
      let var13 = param11.tag,
        var14 = 0x0,
        var15 = {
          'tag': var13,
          'type': var14
        };
      !JSON.stringify(Zotero.ZoteroIF["_progressData_" + param12]).includes(JSON.stringify(var15)) && (Zotero.ZoteroIF['_progressData_' + param12].push(var15), Zotero.ZoteroIF["counter" + param12]++);
    }
  } catch (_0x2d53c3) {
    Zotero.debug(_0x2d53c3);
  }
  methodsBody.update_annotationTag_checkNext(param12, param13);
};
methodsBody.filter = async function (param14) {
  methodsBody.updateFilterButtons(null, param14);
  let var16;
  if (document.getElementById("libraryTag-button").getAttribute("default") === "true") {
    var16 = await methodsBody.getData_filteredTags(param14, true);
  } else {
    if (document.getElementById('automaticTag-button').getAttribute("default") === "true") var16 = await methodsBody.getData_filteredTags(param14, false);else {
      if (document.getElementById("itemTag-button").getAttribute("default") === "true") var16 = Zotero.ZoteroIF.returnItemTagsFilter(param14);else {
        if (document.getElementById('annotationTag-button').getAttribute("default") === "true") {
          var16 = Zotero.ZoteroIF.returnAnnotationTagsFilter(param14);
        }
      }
    }
  }
  param14 = param14 === 'OT' ? '#' : param14;
  if (document.getElementById("libraryTag-button").getAttribute("default") === "true") {
    document.getElementById("message-label").textContent = '全库过滤【' + param14 + "】｜共有 " + var16.length + " 个标签！";
    this._searchKeyWords = "全库过滤【" + param14 + "】｜选择要删除的标签：";
  } else {
    if (document.getElementById('automaticTag-button').getAttribute('default') === 'true') {
      document.getElementById("message-label").textContent = '自动标签过滤【' + param14 + "】｜共有 " + var16.length + '\x20个标签！';
      this._searchKeyWords = "自动标签过滤【" + param14 + "】｜选择要删除的标签：";
    } else {
      if (document.getElementById("itemTag-button").getAttribute("default") === "true") {
        document.getElementById('message-label').textContent = "条目标签过滤【" + param14 + "】｜共有 " + var16.length + '\x20个标签！';
        this._searchKeyWords = "条目标签过滤【" + param14 + "】｜选择要删除的标签：";
      } else document.getElementById('annotationTag-button').getAttribute("default") === "true" && (document.getElementById("message-label").textContent = '注释标签过滤【' + param14 + '】｜共有\x20' + var16.length + " 个标签！", this._searchKeyWords = "注释标签过滤【" + param14 + "】｜选择要删除的标签：");
    }
  }
  methodsBody.clearListbox();
  methodsBody.buildItemNodes(var16);
};
methodsBody.updateFilterButtons = function (param15, param16) {
  let var17 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'OT'];
  for (let var18 of var17) {
    let _0x1c57d7 = document.getElementById("tagFilter-" + var18),
      _0x5f4a85 = "chrome://zoteroif/content/icons/" + var18 + ".png",
      _0x4a05ba = "chrome://zoteroif/content/icons/" + var18 + "-select.png";
    if (param15) {
      _0x1c57d7.setAttribute("src", _0x5f4a85);
      _0x1c57d7.onmouseover = () => _0x1c57d7.style.transform = 'scale(1.3)';
      _0x1c57d7.onmouseout = () => _0x1c57d7.style.transform = 'scale(1)';
    } else {
      var18 === param16 ? (_0x1c57d7.setAttribute("src", _0x4a05ba), _0x1c57d7.style.transform = "scale(1)", _0x1c57d7.onmouseover = () => {}, _0x1c57d7.onmouseout = () => {}) : (_0x1c57d7.setAttribute("src", _0x5f4a85), _0x1c57d7.onmouseover = () => _0x1c57d7.style.transform = 'scale(1.3)', _0x1c57d7.onmouseout = () => _0x1c57d7.style.transform = "scale(1)");
    }
  }
};
methodsBody.getData_filteredTags = async function (param17, param18) {
  let var22, var23;
  if (param18) {
    var22 = await Zotero.Tags.getAll(0x1);
    var23 = var22.map(_0x6d93f0 => _0x6d93f0.tag);
  } else var23 = await methodsBody.getData_AutomaticTags();
  let var24 = [];
  for (let var25 of var23) {
    let _0x477bc4 = Zotero.ZoteroIF.checkENZH(var25.substring(0x0, 0x1));
    if (_0x477bc4 === 'en') var25.substring(0x0, 0x1).toUpperCase() === param17 && var24.push(var25);else {
      if (_0x477bc4 === 'zh') {
        let _0x3df911 = Zotero.ZoteroIF.Pinyin.getWordsCode(var25);
        _0x3df911 != '' && (_0x3df911 = _0x3df911.substring(0x0, 0x1).toUpperCase(), _0x3df911 == param17 && var24.push(var25));
      } else param17 === 'OT' && var24.push(var25);
    }
  }
  return var24;
};
methodsBody.buildItemNodes = function (param19) {
  var var28 = document.getElementById("richlistbox-elem");
  for (var var29 in param19) {
    var var30 = param19[var29],
      var31,
      var32 = false;
    var30 && typeof var30 == "object" && var30.title !== undefined ? (var31 = var30.title, var32 = !!var30.checked) : var31 = var30;
    let var33 = document.createXULElement("richlistitem"),
      var34 = document.createXULElement('checkbox');
    var33.style.fontSize = '13px';
    var33.style.whiteSpace = 'nowrap';
    var34.checked = var32;
    var34.label = var31;
    var34.setAttribute("native", "true");
    var33.setAttribute("value", var29);
    var33.append(var34);
    var33.addEventListener("click", _0x56fa32 => {
      if (_0x56fa32.button === 0x2) {
        let _0x570707 = methodsBody.buildContextMenu(_0x56fa32);
        _0x570707 && _0x570707.openPopup(var33, "after_start", 0x46, 0x0, false, false);
        return;
      }
      if (_0x56fa32.shiftKey) {
        Zotero.ZoteroIF.showItemsBasedOnTag(_0x56fa32.target.closest("richlistitem")?.["querySelector"]('checkbox')["label"]);
        return;
      }
      _0x56fa32.target == var33 && (var34.checked = !var34.checked);
      methodsBody.updateSelectedItemNum();
    });
    var28.append(var33);
  }
};
methodsBody.getData_allTags = async function () {
  let var36 = await Zotero.Tags.getAll(0x1),
    var37 = var36.map(_0x426ea5 => _0x426ea5.tag);
  return var37;
};
methodsBody.getData_AutomaticTags = async function () {
  let var38 = await Zotero.Tags.getAutomaticInLibrary(0x1),
    var39 = [];
  for (let var40 of var38) {
    let _0x44e8b8 = Zotero.Tags.getName(var40);
    !["/unread", "/PDF_auto_download", "预警期刊"].includes(_0x44e8b8) && var39.push(_0x44e8b8);
  }
  return var39;
};
methodsBody.clearListbox = function () {
  var var42 = document.getElementById("richlistbox-elem");
  let var43 = var42.firstElementChild;
  while (var43) {
    var43.remove();
    var43 = var42.firstElementChild;
  }
};
methodsBody.updateButtonStatus = function (param20) {
  let var44 = ["libraryTag", "automaticTag", "itemTag", 'annotationTag'];
  for (let var45 of var44) {
    var45 === param20 ? document.getElementById(var45 + "-button").setAttribute('default', true) : document.getElementById(var45 + "-button").setAttribute("default", false);
  }
};
methodsBody.updateSelectedItemNum = function () {
  let var46 = document.getElementById("richlistbox-elem"),
    var47 = 0x0;
  for (var var48 = 0x0; var48 < var46.childNodes.length; var48++) {
    var var49 = var46.childNodes[var48];
    if (var49.querySelector("checkbox").checked) {
      var47++;
    }
  }
  document.getElementById("message-label").textContent = '' + this._searchKeyWords + var47 + '/' + var46.childNodes.length;
};
methodsBody.buildContextMenu = function (param21, param22) {
  let var50 = document.querySelector("#richlistitem-contextmenu");
  if (!var50) {
    var50 = window.document.createXULElement("menupopup");
    var50.id = "richlistitem-contextmenu";
    document.documentElement.appendChild(var50);
    var50 = document.documentElement.lastElementChild.firstElementChild;
    if (param22) return;
  }
  let var51 = param21.target.closest("richlistitem")?.["querySelector"]('checkbox')["label"],
    var52 = var50.firstElementChild;
  while (var52) {
    var52.remove();
    var52 = var50.firstElementChild;
  }
  let var53 = window.document.createXULElement("menuitem");
  var53.setAttribute("label", '拷贝标签');
  var53.addEventListener("command", () => {
    Zotero.ZoteroIF.copy2Clipboard(var51);
    Zotero.ZoteroIF.showProgressWindow(0x7d0, '拷贝标签【Zotero\x20One】', "已拷贝标签【" + var51 + '】');
  });
  var50.appendChild(var53);
  let var54 = document.createXULElement("menuseparator");
  return var50.appendChild(var54), var53 = window.document.createXULElement("menuitem"), var53.setAttribute("label", "检索所属文献"), var53.addEventListener('command', () => {
    Zotero.ZoteroIF.showItemsBasedOnTag(var51);
  }), var50.appendChild(var53), var50;
};
methodsBody.selectAll = function (param23) {
  var var55 = document.getElementById("richlistbox-elem");
  for (var var56 = 0x0; var56 < var55.childNodes.length; var56++) {
    var55.childNodes[var56].querySelector('checkbox').checked = !param23;
  }
  methodsBody.updateSelectedItemNum();
};
methodsBody.deleteSelectedTags = async function () {
  var var57 = document.getElementById("richlistbox-elem");
  let var58 = [];
  for (var var59 = 0x0; var59 < var57.childNodes.length; var59++) {
    var var60 = var57.childNodes[var59],
      var61 = var60.querySelector("checkbox");
    var61.checked && var58.push(var61.getAttribute("label"));
  }
  if (!var58.length) {
    window.alert("未选中任何标签！");
    return;
  }
  let var62 = Services.prompt.confirm(window, "批量删除标签", "是否要彻底删除选中的【" + var58.length + "】个标签？\n\n👉 删除后，这些标签将无法恢复！");
  if (var62) {
    for (let var63 of var58) {
      let var64 = Zotero.Tags.getID(var63);
      await Zotero.Tags.removeFromLibrary(0x1, var64);
    }
    Zotero.ZoteroIF.showProgressWindow(0xbb8, "✅ 批量删除标签", '完成删除【' + var58.length + "】个标签，并刷新标签列表！");
    for (let var65 of var58) {
      try {
        methodsBody.updateTagsDatabase(var65);
      } catch (_0x44601a) {
        Zotero.debug(_0x44601a);
      }
    }
    methodsBody.updateTagsDisplayAfterRename();
  }
};
methodsBody.updateTagsDatabase = function (param24) {
  let var66 = JSON.parse(Zotero.Prefs.get("zoteroif.annotationtagsrecent") || '[]'),
    var67 = param24,
    var68 = 0x0,
    var69 = {
      'tag': var67,
      'type': var68
    },
    var70 = var66.findIndex(_0x1918fd => JSON.stringify(_0x1918fd) === JSON.stringify(var69));
  if (var70 !== -0x1) {
    var66.splice(var70, 0x1);
    Zotero.Prefs.set("zoteroif.annotationtagsrecent", JSON.stringify(var66));
  }
  var70 = -0x1;
  var66 = [];
  var66 = JSON.parse(Zotero.Prefs.get("zoteroif.imageannotationtagsrecent") || '[]');
  var70 = var66.findIndex(_0x3c563a => JSON.stringify(_0x3c563a) === JSON.stringify(var69));
  var70 !== -0x1 && (var66.splice(var70, 0x1), Zotero.Prefs.set("zoteroif.imageannotationtagsrecent", JSON.stringify(var66)));
  var70 = -0x1;
  var66 = [];
  var66 = JSON.parse(Zotero.Prefs.get("zoteroif.itemTags") || '[]');
  var70 = var66.findIndex(_0x273eb3 => JSON.stringify(_0x273eb3) === JSON.stringify(var69));
  var70 !== -0x1 && (var66.splice(var70, 0x1), Zotero.Prefs.set("zoteroif.itemTags", JSON.stringify(var66)));
  var70 = -0x1;
  var66 = [];
  var66 = JSON.parse(Zotero.Prefs.get("zoteroif.gptnotetagsrecent") || '[]');
  var70 = var66.findIndex(_0x421804 => JSON.stringify(_0x421804) === JSON.stringify(var69));
  var70 !== -0x1 && (var66.splice(var70, 0x1), Zotero.Prefs.set("zoteroif.gptnotetagsrecent", JSON.stringify(var66)));
  var70 = -0x1;
  var66 = [];
};
methodsBody.updateTagsDisplayAfterRename = function () {
  if (document.getElementById('libraryTag-button').getAttribute('default') === "true") methodsBody.libraryTag();else {
    if (document.getElementById('automaticTag-button').getAttribute("default") === "true") methodsBody.automaticTag();else {
      if (document.getElementById("itemTag-button").getAttribute('default') === "true") {
        methodsBody.itemTag();
      } else {
        if (document.getElementById("annotationTag-button").getAttribute("default") === "true") {
          methodsBody.annotationTag();
        }
      }
    }
  }
};
methodsBody.search = async function () {
  var var71 = document.getElementById("richlistbox-elem"),
    var72 = document.getElementById('searchBox-elem'),
    var73 = var72.value.trim();
  if (var73 === '' && var72.placeholder === '') {
    return false;
  } else {
    if (var73 === '' && var72.placeholder != '') {
      var73 = var72.placeholder;
      var72.value = var72.placeholder;
    }
  }
  var72.placeholder = var73;
  methodsBody.clearListbox();
  Zotero.ZoteroIF.lastDeleteTagsSearchInput = var73;
  var73 = var73.toLowerCase();
  let var74;
  if (document.getElementById("libraryTag-button").getAttribute("default") === 'true') {
    var74 = await methodsBody.returnLibraryTagsSearch(var73);
    document.getElementById("message-label").textContent = "全库标签搜索【" + var73 + "】｜共有 " + var74.length + " 个标签！";
    this._searchKeyWords = "全库标签搜索【" + var73 + '】｜选择要删除的标签：';
  } else {
    if (document.getElementById('automaticTag-button').getAttribute("default") === "true") {
      var74 = await methodsBody.returnAutomaticTagsSearch(var73);
      document.getElementById('message-label').textContent = '自动标签搜索【' + var73 + "】｜共有 " + var74.length + " 个标签！";
      this._searchKeyWords = "自动标签搜索【" + var73 + "】｜选择要删除的标签：";
    } else {
      if (document.getElementById("itemTag-button").getAttribute("default") === "true") {
        var74 = Zotero.ZoteroIF.returnItemTagsSearch(var73);
        document.getElementById("message-label").textContent = '条目标签搜索【' + var73 + '】｜共有\x20' + var74.length + " 个标签！";
        this._searchKeyWords = "条目标签搜索【" + var73 + "】｜选择要删除的标签：";
      } else document.getElementById('annotationTag-button').getAttribute("default") === "true" && (var74 = Zotero.ZoteroIF.returnAnnotationTagsSearch(var73), document.getElementById("message-label").textContent = "注释标签搜索【" + var73 + '】｜共有\x20' + var74.length + '\x20个标签！', this._searchKeyWords = '注释标签搜索【' + var73 + "】｜选择要删除的标签：");
    }
  }
  methodsBody.buildItemNodes(var74);
  methodsBody.updateFilterButtons(true);
};
methodsBody.returnLibraryTagsSearch = async function (param25) {
  let var75 = [],
    var76 = await methodsBody.getData_allTags();
  for (let var77 of var76) {
    var77.toLowerCase().indexOf(param25) != -0x1 && var75.push(var77);
  }
  return var75;
};
methodsBody.returnAutomaticTagsSearch = async function (param26) {
  let var78 = [],
    var79 = await methodsBody.getData_AutomaticTags();
  for (let var80 of var79) {
    var80.toLowerCase().indexOf(param26) != -0x1 && var78.push(var80);
  }
  return var78;
};
methodsBody.checkKeyEnter = function (param27) {
  !param27.shiftKey && !param27.ctrlKey && !param27.altKey && !param27.metaKey && param27.keyCode === 0xd && (param27.returnValue = false, param27.preventDefault && param27.preventDefault(), methodsBody.search());
};