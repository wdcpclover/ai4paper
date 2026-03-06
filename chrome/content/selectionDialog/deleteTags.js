var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  Zotero.AI4Paper.setFontSize_Dialog(document.querySelector("dialog"), 0.92);
  Zotero.AI4Paper.lastDeleteTagsSearchInput && (document.getElementById("searchBox-elem").placeholder = Zotero.AI4Paper.lastDeleteTagsSearchInput);
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
  let var3 = Zotero.AI4Paper.returnItemTags();
  methodsBody.buildItemNodes(var3);
  methodsBody.updateSelectedItemNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.annotationTag = function (param2) {
  this._searchKeyWords = !param2 ? '选择要删除的注释标签：' : "刷新完成，请选择要删除的注释标签：";
  methodsBody.updateButtonStatus('annotationTag');
  methodsBody.clearListbox();
  let var4 = Zotero.AI4Paper.returnAnnotationTags();
  methodsBody.buildItemNodes(var4);
  methodsBody.updateSelectedItemNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.updateTags = async function (param3) {
  let tagConfigs = {
    'itemTag': { description: "条目标签", checkFn: Zotero.AI4Paper.checkItemTag, prefKey: "ai4paper.itemTags", refreshFn: (v) => methodsBody.itemTag(v) },
    'annotationTag': { description: "注释标签", checkFn: Zotero.AI4Paper.checkAnnotationTag, prefKey: "ai4paper.annotationtagsrecent", refreshFn: (v) => methodsBody.annotationTag(v) }
  };
  let config = tagConfigs[param3];
  document.getElementById("message-label").textContent = "正在刷新" + config.description + "，右下角查看进度...";
  await Zotero.AI4Paper.DialogUtils.runTagUpdateChain({
    tagType: param3, dialogPrefix: "_deleteTagsDialog_update_",
    description: config.description, checkFn: config.checkFn,
    prefKey: config.prefKey, refreshFn: config.refreshFn
  });
};
methodsBody.filter = async function (param14) {
  methodsBody.updateFilterButtons(null, param14);
  let var16;
  if (document.getElementById("libraryTag-button").getAttribute("default") === "true") {
    var16 = await methodsBody.getData_filteredTags(param14, true);
  } else {
    if (document.getElementById('automaticTag-button').getAttribute("default") === "true") var16 = await methodsBody.getData_filteredTags(param14, false);else {
      if (document.getElementById("itemTag-button").getAttribute("default") === "true") var16 = Zotero.AI4Paper.returnItemTagsFilter(param14);else {
        if (document.getElementById('annotationTag-button').getAttribute("default") === "true") {
          var16 = Zotero.AI4Paper.returnAnnotationTagsFilter(param14);
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
  Zotero.AI4Paper.DialogUtils.updateAZFilterButtons(param15, param16);
};
methodsBody.getData_filteredTags = async function (param17, param18) {
  let var22, var23;
  if (param18) {
    var22 = await Zotero.Tags.getAll(0x1);
    var23 = var22.map(_0x6d93f0 => _0x6d93f0.tag);
  } else var23 = await methodsBody.getData_AutomaticTags();
  let var24 = [];
  for (let var25 of var23) {
    let _0x477bc4 = Zotero.AI4Paper.checkENZH(var25.substring(0x0, 0x1));
    if (_0x477bc4 === 'en') var25.substring(0x0, 0x1).toUpperCase() === param17 && var24.push(var25);else {
      if (_0x477bc4 === 'zh') {
        let _0x3df911 = Zotero.AI4Paper.Pinyin.getWordsCode(var25);
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
        Zotero.AI4Paper.showItemsBasedOnTag(_0x56fa32.target.closest("richlistitem")?.["querySelector"]('checkbox')["label"]);
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
  Zotero.AI4Paper.DialogUtils.clearListbox('richlistbox-elem');
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
  let menu = Zotero.AI4Paper.DialogUtils.initMenuPopup('richlistitem-contextmenu', param22);
  if (param22 && !menu) return;
  if (!menu) return;
  if (!param21 || !param21.target) return menu;
  let tagLabel = param21.target.closest("richlistitem")?.["querySelector"]('checkbox')["label"];
  if (!tagLabel) return menu;
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, '拷贝标签', () => {
    Zotero.AI4Paper.copy2Clipboard(tagLabel);
    Zotero.AI4Paper.showProgressWindow(0x7d0, '拷贝标签【Zotero\x20One】', "已拷贝标签【" + tagLabel + '】');
  });
  Zotero.AI4Paper.DialogUtils.addMenuSeparator(menu);
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, "检索所属文献", () => {
    Zotero.AI4Paper.showItemsBasedOnTag(tagLabel);
  });
  return menu;
};
methodsBody.selectAll = function (param23) {
  Zotero.AI4Paper.DialogUtils.selectAll('richlistbox-elem', param23);
  methodsBody.updateSelectedItemNum();
};
methodsBody.deleteSelectedTags = async function () {
  let var58 = Zotero.AI4Paper.DialogUtils.getCheckedItems('richlistbox-elem').map(item => item.label);
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
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 批量删除标签", '完成删除【' + var58.length + "】个标签，并刷新标签列表！");
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
  let var66 = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent") || '[]'),
    var67 = param24,
    var68 = 0x0,
    var69 = {
      'tag': var67,
      'type': var68
    },
    var70 = var66.findIndex(_0x1918fd => JSON.stringify(_0x1918fd) === JSON.stringify(var69));
  if (var70 !== -0x1) {
    var66.splice(var70, 0x1);
    Zotero.Prefs.set("ai4paper.annotationtagsrecent", JSON.stringify(var66));
  }
  var70 = -0x1;
  var66 = [];
  var66 = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent") || '[]');
  var70 = var66.findIndex(_0x3c563a => JSON.stringify(_0x3c563a) === JSON.stringify(var69));
  var70 !== -0x1 && (var66.splice(var70, 0x1), Zotero.Prefs.set("ai4paper.imageannotationtagsrecent", JSON.stringify(var66)));
  var70 = -0x1;
  var66 = [];
  var66 = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags") || '[]');
  var70 = var66.findIndex(_0x273eb3 => JSON.stringify(_0x273eb3) === JSON.stringify(var69));
  var70 !== -0x1 && (var66.splice(var70, 0x1), Zotero.Prefs.set("ai4paper.itemTags", JSON.stringify(var66)));
  var70 = -0x1;
  var66 = [];
  var66 = JSON.parse(Zotero.Prefs.get("ai4paper.gptnotetagsrecent") || '[]');
  var70 = var66.findIndex(_0x421804 => JSON.stringify(_0x421804) === JSON.stringify(var69));
  var70 !== -0x1 && (var66.splice(var70, 0x1), Zotero.Prefs.set("ai4paper.gptnotetagsrecent", JSON.stringify(var66)));
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
  Zotero.AI4Paper.lastDeleteTagsSearchInput = var73;
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
        var74 = Zotero.AI4Paper.returnItemTagsSearch(var73);
        document.getElementById("message-label").textContent = '条目标签搜索【' + var73 + '】｜共有\x20' + var74.length + " 个标签！";
        this._searchKeyWords = "条目标签搜索【" + var73 + "】｜选择要删除的标签：";
      } else document.getElementById('annotationTag-button').getAttribute("default") === "true" && (var74 = Zotero.AI4Paper.returnAnnotationTagsSearch(var73), document.getElementById("message-label").textContent = "注释标签搜索【" + var73 + '】｜共有\x20' + var74.length + '\x20个标签！', this._searchKeyWords = '注释标签搜索【' + var73 + "】｜选择要删除的标签：");
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
