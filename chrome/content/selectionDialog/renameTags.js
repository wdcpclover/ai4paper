var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  Zotero.AI4Paper.setFontSize_Dialog(document.querySelector("dialog"), 0.92);
  Zotero.AI4Paper.lastRenameTagsSearchInput && (document.getElementById("searchBox-elem").placeholder = Zotero.AI4Paper.lastRenameTagsSearchInput);
  document.getElementById('searchBox-elem').focus();
  methodsBody.libraryTag();
  methodsBody.buildContextMenu(null, true);
};
methodsBody.libraryTag = async function () {
  this._searchKeyWords = "全库标签";
  methodsBody.updateTagTypeButtonStatus('libraryTag');
  methodsBody.updateViewButtonStatus("showAllItems");
  methodsBody.clearListbox();
  let var1 = await methodsBody.getData_allTags();
  if (!var1.length) {
    document.getElementById("message-label").textContent = "共有【0】个标签";
    return;
  }
  methodsBody.buildItemNodes(var1);
  methodsBody.updateEditedItemsNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.itemTag = function (param1) {
  this._searchKeyWords = !param1 ? "条目标签" : "条目标签，刷新完成";
  methodsBody.updateTagTypeButtonStatus("itemTag");
  methodsBody.updateViewButtonStatus("showAllItems");
  methodsBody.clearListbox();
  let var2 = Zotero.AI4Paper.returnItemTags();
  methodsBody.buildItemNodes(var2);
  methodsBody.updateEditedItemsNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.annotationTag = function (param2) {
  this._searchKeyWords = !param2 ? "注释标签" : "注释标签，刷新完成";
  methodsBody.updateTagTypeButtonStatus("annotationTag");
  methodsBody.updateViewButtonStatus("showAllItems");
  methodsBody.clearListbox();
  let var3 = Zotero.AI4Paper.returnAnnotationTags();
  methodsBody.buildItemNodes(var3);
  methodsBody.updateEditedItemsNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.gptNoteTag = function (param3) {
  this._searchKeyWords = !param3 ? "GPT 标签" : "GPT 标签，刷新完成";
  methodsBody.updateTagTypeButtonStatus("gptNoteTag");
  methodsBody.updateViewButtonStatus("showAllItems");
  methodsBody.clearListbox();
  let var4 = Zotero.AI4Paper.returnGPTNoteTags();
  methodsBody.buildItemNodes(var4);
  methodsBody.updateEditedItemsNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.updateTags = async function (param4) {
  let tagConfigs = {
    'itemTag': { description: "条目标签", checkFn: Zotero.AI4Paper.checkItemTag, prefKey: "ai4paper.itemTags", refreshFn: (v) => methodsBody.itemTag(v) },
    'annotationTag': { description: "注释标签", checkFn: Zotero.AI4Paper.checkAnnotationTag, prefKey: "ai4paper.annotationtagsrecent", refreshFn: (v) => methodsBody.annotationTag(v) },
    'gptNoteTag': { description: "GPT 笔记标签", checkFn: Zotero.AI4Paper.checkGPTNoteTag, prefKey: "ai4paper.gptnotetagsrecent", refreshFn: (v) => methodsBody.gptNoteTag(v) }
  };
  let config = tagConfigs[param4];
  if (!config) return;
  document.getElementById('message-label').textContent = "正在刷新" + config.description + "，右下角查看进度...";
  await Zotero.AI4Paper.DialogUtils.runTagUpdateChain({
    tagType: param4, dialogPrefix: "_renameTagsDialog_update_",
    description: config.description, checkFn: config.checkFn,
    prefKey: config.prefKey, refreshFn: config.refreshFn
  });
};
methodsBody.filter = async function (param20) {
  methodsBody.updateFilterButtons(null, param20);
  let var20;
  if (document.getElementById("libraryTag-button").getAttribute("default") === "true") var20 = await methodsBody.getData_filteredTags(param20);else {
    if (document.getElementById("itemTag-button").getAttribute("default") === 'true') var20 = Zotero.AI4Paper.returnItemTagsFilter(param20);else {
      if (document.getElementById('annotationTag-button').getAttribute("default") === "true") var20 = Zotero.AI4Paper.returnAnnotationTagsFilter(param20);else document.getElementById('gptNoteTag-button').getAttribute("default") === "true" && (var20 = Zotero.AI4Paper.returnGPTNoteTagsFilter(param20));
    }
  }
  param20 = param20 === 'OT' ? '#' : param20;
  if (document.getElementById("libraryTag-button").getAttribute('default') === "true") {
    document.getElementById('message-label').textContent = "全库过滤【" + param20 + "】｜共有 " + var20.length + " 个标签！";
    this._searchKeyWords = "全库过滤【" + param20 + '】';
  } else {
    if (document.getElementById("itemTag-button").getAttribute("default") === "true") {
      document.getElementById("message-label").textContent = "条目标签过滤【" + param20 + "】｜共有 " + var20.length + " 个标签！";
      this._searchKeyWords = '条目标签过滤【' + param20 + '】';
    } else {
      if (document.getElementById("annotationTag-button").getAttribute("default") === 'true') {
        document.getElementById("message-label").textContent = "注释标签过滤【" + param20 + "】｜共有 " + var20.length + " 个标签！";
        this._searchKeyWords = "注释标签过滤【" + param20 + '】';
      } else document.getElementById("gptNoteTag-button").getAttribute('default') === "true" && (document.getElementById("message-label").textContent = "GPT 标签过滤【" + param20 + "】｜共有 " + var20.length + " 个标签！", this._searchKeyWords = "GPT 标签过滤【" + param20 + '】');
    }
  }
  methodsBody.clearListbox();
  methodsBody.buildItemNodes(var20);
  methodsBody.updateViewButtonStatus("showAllItems");
};
methodsBody.buildItemNodes = function (param21) {
  var var21 = document.getElementById("richlistbox-elem");
  for (let var22 of param21) {
    let var23 = document.createElement('div');
    var23.className = "two-columns";
    let var24 = document.createXULElement('hbox');
    var24.style.alignItems = "center";
    var24.style.display = "flex";
    let var25 = document.createElement("description");
    var25.style.marginLeft = "8px";
    var25.textContent = var22;
    var25.onmouseover = () => {
      var25.style.color = '#ff6a00';
    };
    var25.onmouseout = () => {
      var25.style.color = '';
    };
    var25.addEventListener('click', _0x2385b4 => {
      if (_0x2385b4.shiftKey) {
        Zotero.AI4Paper.showItemsBasedOnTag(var22);
        return;
      }
    });
    var25.addEventListener("contextmenu", _0x5d3bae => {
      let var26 = methodsBody.buildContextMenu(_0x5d3bae);
      var26 && var26.openPopup(var25, 'after_start', 0x46, 0x0, false, false);
    });
    var25.addEventListener("dblclick", _0x381a17 => {
      _0x381a17.stopPropagation();
      Zotero.AI4Paper.copy2Clipboard(var25.textContent);
      Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝标签【AI4paper】", "已拷贝标签【" + var25.textContent + '。');
    });
    var24.append(var25);
    var23.append(var24);
    var24 = document.createXULElement("hbox");
    var24.style.alignItems = 'center';
    var24.style.display = 'flex';
    let var27 = document.createElement("input");
    var27.type = "text";
    var27.size = '30';
    var27.style.marginRight = "5px";
    var27.style.marginLeft = "30px";
    var27.addEventListener("focus", _0x518a9b => {
      _0x518a9b.target.closest(".two-columns").querySelector(".cross-button").style.opacity = 0x64;
      _0x518a9b.target.closest(".two-columns").querySelector("description").style.color = '#ff6a00';
    });
    var27.addEventListener("blur", _0x5b464c => {
      _0x5b464c.target.closest(".two-columns").querySelector(".cross-button").style.opacity = 0x0;
      _0x5b464c.target.closest(".two-columns").querySelector("description").style.color = '';
    });
    var27.addEventListener("contextmenu", _0x1dd6a0 => {
      _0x1dd6a0.preventDefault();
      _0x1dd6a0.stopPropagation();
      var27.value = _0x1dd6a0.target.closest(".two-columns").querySelector('description').textContent;
      methodsBody.updateEditedItemsNum();
    });
    var27.onchange = _0x4a5b7f => {
      methodsBody.updateEditedItemsNum();
    };
    var27.oninput = _0x34060f => {
      methodsBody.updateEditedItemsNum();
    };
    var24.append(var27);
    let var28 = document.createXULElement("div");
    var28.style.opacity = 0x0;
    var28.classList.add('cross-button');
    var28.setAttribute('tooltiptext', '清空');
    var28.style.width = "16px";
    var28.style.height = "16px";
    var28.style.marginRight = "20px";
    var28.style.marginLeft = "5px";
    var28.innerHTML = Zotero.AI4Paper.svg_icon_16px.cross;
    var28.addEventListener("click", _0x225349 => {
      _0x225349.target.closest(".two-columns").querySelector("input").value = '';
      methodsBody.updateEditedItemsNum();
    });
    var24.append(var28);
    var23.append(var24);
    var21.appendChild(var23);
  }
};
methodsBody.updateFilterButtons = function (param22, param23) {
  Zotero.AI4Paper.DialogUtils.updateAZFilterButtons(param22, param23);
};
methodsBody.showallItems = function () {
  methodsBody.updateViewButtonStatus('showAllItems');
  var var34 = document.getElementById("richlistbox-elem");
  for (var var35 = 0x0; var35 < var34.childNodes.length; var35++) {
    var34.childNodes[var35].style.display = '';
  }
  methodsBody.updateEditedItemsNum();
};
methodsBody.showEditedItems = function () {
  methodsBody.updateViewButtonStatus('showEditedItems');
  var var36 = document.getElementById("richlistbox-elem");
  for (var var37 = 0x0; var37 < var36.childNodes.length; var37++) {
    let var38 = var36.childNodes[var37].querySelector("input");
    !var38.value.trim() ? var36.childNodes[var37].style.display = 'none' : var36.childNodes[var37].style.display = '';
  }
  methodsBody.updateEditedItemsNum();
};
methodsBody.getData_allTags = async function () {
  let var39 = await Zotero.Tags.getAll(0x1),
    var40 = var39.map(_0x22200d => _0x22200d.tag);
  return var40;
};
methodsBody.getData_filteredTags = async function (param24) {
  let var41 = await Zotero.Tags.getAll(0x1),
    var42 = var41.map(_0x148e7d => _0x148e7d.tag),
    var43 = [];
  for (let var44 of var42) {
    let var45 = Zotero.AI4Paper.checkENZH(var44.substring(0x0, 0x1));
    if (var45 === 'en') var44.substring(0x0, 0x1).toUpperCase() === param24 && var43.push(var44);else {
      if (var45 === 'zh') {
        let var46 = Zotero.AI4Paper.Pinyin.getWordsCode(var44);
        var46 != '' && (var46 = var46.substring(0x0, 0x1).toUpperCase(), var46 == param24 && var43.push(var44));
      } else param24 === 'OT' && var43.push(var44);
    }
  }
  return var43;
};
methodsBody.returnLibraryTagsSearch = async function (param25) {
  let var47 = [],
    var48 = await methodsBody.getData_allTags();
  for (let var49 of var48) {
    var49.toLowerCase().indexOf(param25) != -0x1 && var47.push(var49);
  }
  return var47;
};
methodsBody.clearListbox = function () {
  Zotero.AI4Paper.DialogUtils.clearListbox('richlistbox-elem');
};
methodsBody.clearAllInputBoxes = function () {
  var var52 = document.getElementById("richlistbox-elem");
  for (var var53 = 0x0; var53 < var52.childNodes.length; var53++) {
    var52.childNodes[var53].querySelector('input').value = '';
  }
  methodsBody.updateEditedItemsNum();
};
methodsBody.buildContextMenu = function (param26, param27) {
  let menu = Zotero.AI4Paper.DialogUtils.initMenuPopup('richlistitem-contextmenu', param27);
  if (param27 && !menu) return;
  if (!menu) return;
  if (!param26 || !param26.target) return menu;
  let tagLabel = param26.target.textContent;
  if (!tagLabel) return menu;
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, '拷贝标签', () => {
    Zotero.AI4Paper.copy2Clipboard(tagLabel);
    Zotero.AI4Paper.showProgressWindow(0x7d0, '拷贝标签【Zotero\x20One】', '已拷贝标签【' + tagLabel + '】');
  });
  Zotero.AI4Paper.DialogUtils.addMenuSeparator(menu);
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, "检索所属文献", () => {
    Zotero.AI4Paper.showItemsBasedOnTag(tagLabel);
  });
  return menu;
};
methodsBody.renameTags = async function () {
  let var59 = methodsBody.getRenameData();
  if (!var59) return;
  let var60 = Services.prompt.confirm(window, '批量重命名标签', '发现【' + var59.editedNum + "】个已编辑标签，其中👉【" + var59.changedNum + "】👈个为有效编辑（即新旧名称不同），是否确认重命名？\n\n👉 重命名后，将无法撤回！"),
    var61 = var59.renameData;
  for (let var62 in var61) {
    await Zotero.Tags.rename(0x1, var62, var61[var62]);
  }
  Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 批量重命名标签", "批量重命名【" + var59.changedNum + "】个标签完成，并已刷新标签！");
  for (let var63 in var61) {
    try {
      methodsBody.updateTagsDatabase(var63, var61[var63]);
    } catch (_0x1387e4) {
      Zotero.debug(_0x1387e4);
    }
  }
  methodsBody.updateTagsDisplayAfterRename();
};
methodsBody.updateTagsDatabase = function (param28, param29) {
  let var64 = JSON.parse(Zotero.Prefs.get('ai4paper.annotationtagsrecent') || '[]'),
    var65 = param28,
    var66 = 0x0,
    var67 = {
      'tag': var65,
      'type': var66
    },
    var68 = var64.findIndex(_0x5da71b => JSON.stringify(_0x5da71b) === JSON.stringify(var67));
  var68 !== -0x1 && (var64.splice(var68, 0x1), Zotero.Prefs.set("ai4paper.annotationtagsrecent", JSON.stringify(var64)), var65 = param29.trim(), var67 = {
    'tag': var65,
    'type': var66
  }, !JSON.stringify(var64).includes(JSON.stringify(var67)) && (var64.push(var67), Zotero.Prefs.set("ai4paper.annotationtagsrecent", JSON.stringify(var64))));
  var68 = -0x1;
  var64 = [];
  var64 = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent") || '[]');
  var65 = param28;
  var67 = {
    'tag': var65,
    'type': var66
  };
  var68 = var64.findIndex(_0x1cfa41 => JSON.stringify(_0x1cfa41) === JSON.stringify(var67));
  var68 !== -0x1 && (var64.splice(var68, 0x1), Zotero.Prefs.set("ai4paper.imageannotationtagsrecent", JSON.stringify(var64)), var65 = param29.trim(), var67 = {
    'tag': var65,
    'type': var66
  }, !JSON.stringify(var64).includes(JSON.stringify(var67)) && (var64.push(var67), Zotero.Prefs.set('ai4paper.imageannotationtagsrecent', JSON.stringify(var64))));
  var68 = -0x1;
  var64 = [];
  var64 = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags") || '[]');
  var65 = param28;
  var67 = {
    'tag': var65,
    'type': var66
  };
  var68 = var64.findIndex(_0x519caa => JSON.stringify(_0x519caa) === JSON.stringify(var67));
  var68 !== -0x1 && (var64.splice(var68, 0x1), Zotero.Prefs.set("ai4paper.itemTags", JSON.stringify(var64)), var65 = param29.trim(), var67 = {
    'tag': var65,
    'type': var66
  }, !JSON.stringify(var64).includes(JSON.stringify(var67)) && (var64.push(var67), Zotero.Prefs.set("ai4paper.itemTags", JSON.stringify(var64))));
  var68 = -0x1;
  var64 = [];
  var64 = JSON.parse(Zotero.Prefs.get("ai4paper.gptnotetagsrecent") || '[]');
  var65 = param28;
  var67 = {
    'tag': var65,
    'type': var66
  };
  var68 = var64.findIndex(_0x241219 => JSON.stringify(_0x241219) === JSON.stringify(var67));
  var68 !== -0x1 && (var64.splice(var68, 0x1), Zotero.Prefs.set("ai4paper.gptnotetagsrecent", JSON.stringify(var64)), var65 = param29.trim(), var67 = {
    'tag': var65,
    'type': var66
  }, !JSON.stringify(var64).includes(JSON.stringify(var67)) && (var64.push(var67), Zotero.Prefs.set('ai4paper.gptnotetagsrecent', JSON.stringify(var64))));
  var68 = -0x1;
  var64 = [];
};
methodsBody.updateTagsDisplayAfterRename = function () {
  if (document.getElementById("libraryTag-button").getAttribute('default') === "true") methodsBody.libraryTag();else {
    if (document.getElementById('itemTag-button').getAttribute("default") === "true") methodsBody.itemTag();else {
      if (document.getElementById('annotationTag-button').getAttribute("default") === "true") methodsBody.annotationTag();else document.getElementById("gptNoteTag-button").getAttribute("default") === "true" && methodsBody.gptNoteTag();
    }
  }
};
methodsBody.getRenameData = function () {
  var var69 = document.getElementById("richlistbox-elem");
  let var70 = {},
    var71 = 0x0,
    var72 = 0x0;
  for (var var73 = 0x0; var73 < var69.childNodes.length; var73++) {
    let var74 = var69.childNodes[var73].querySelector('description').textContent,
      var75 = var69.childNodes[var73].querySelector("input").value.trim();
    var75.trim() && (var71++, var75.trim() != var74 && (var72++, var70[var74] = var75.trim()));
  }
  if (!var71) return window.alert("❌ 未发现任何已编辑标签！请编辑后再执行本操作。"), false;
  if (var71 && !var72) return window.alert("❌ 您已编辑【" + var71 + "】个标签，但新旧标签名均相同（即无效的重命名）！请重新编辑后再执行本操作。"), false;
  if (JSON.stringify(var70) !== '{}') return {
    'renameData': var70,
    'editedNum': var71,
    'changedNum': var72
  };
};
methodsBody.search = async function () {
  var var76 = document.getElementById('richlistbox-elem'),
    var77 = document.getElementById("searchBox-elem"),
    var78 = var77.value.trim();
  if (var78 === '' && var77.placeholder === '') return false;else var78 === '' && var77.placeholder != '' && (var78 = var77.placeholder, var77.value = var77.placeholder);
  var77.placeholder = var78;
  methodsBody.clearListbox();
  Zotero.AI4Paper.lastRenameTagsSearchInput = var78;
  var78 = var78.toLowerCase();
  let var79;
  if (document.getElementById("libraryTag-button").getAttribute("default") === 'true') {
    var79 = await methodsBody.returnLibraryTagsSearch(var78);
    document.getElementById("message-label").textContent = "全库搜索【" + var78 + "】｜共有 " + var79.length + " 个标签！";
    this._searchKeyWords = "全库搜索【" + var78 + '】';
  } else {
    if (document.getElementById("itemTag-button").getAttribute("default") === 'true') {
      var79 = Zotero.AI4Paper.returnItemTagsSearch(var78);
      document.getElementById("message-label").textContent = "条目标签搜索【" + var78 + "】｜共有 " + var79.length + '\x20个标签！';
      this._searchKeyWords = "条目标签搜索【" + var78 + '】';
    } else {
      if (document.getElementById("annotationTag-button").getAttribute('default') === 'true') {
        var79 = Zotero.AI4Paper.returnAnnotationTagsSearch(var78);
        document.getElementById("message-label").textContent = "注释标签搜索【" + var78 + "】｜共有 " + var79.length + " 个标签！";
        this._searchKeyWords = "注释标签搜索【" + var78 + '】';
      } else document.getElementById("gptNoteTag-button").getAttribute("default") === "true" && (var79 = Zotero.AI4Paper.returnGPTNoteTagsSearch(var78), document.getElementById("message-label").textContent = 'GPT\x20标签搜索【' + var78 + '】｜共有\x20' + var79.length + " 个标签！", this._searchKeyWords = 'GPT\x20标签搜索【' + var78 + '】');
    }
  }
  methodsBody.buildItemNodes(var79);
  methodsBody.updateViewButtonStatus("showAllItems");
  methodsBody.updateFilterButtons(true);
};
methodsBody.checkKeyEnter = function (param30) {
  !param30.shiftKey && !param30.ctrlKey && !param30.altKey && !param30.metaKey && param30.keyCode === 0xd && (param30.returnValue = false, param30.preventDefault && param30.preventDefault(), methodsBody.search());
};
methodsBody.updateViewButtonStatus = function (param31) {
  let var80 = ["showAllItems", "showEditedItems"];
  for (let var81 of var80) {
    var81 === param31 ? document.getElementById(var81 + "-button").setAttribute("default", true) : document.getElementById(var81 + "-button").setAttribute("default", false);
  }
};
methodsBody.updateTagTypeButtonStatus = function (param32) {
  let var82 = ["libraryTag", "itemTag", "annotationTag", "gptNoteTag"];
  for (let var83 of var82) {
    var83 === param32 ? document.getElementById(var83 + "-button").setAttribute("default", true) : document.getElementById(var83 + "-button").setAttribute("default", false);
  }
};
methodsBody.updateEditedItemsNum = function () {
  var var84 = document.getElementById('richlistbox-elem');
  let var85 = 0x0;
  for (var var86 = 0x0; var86 < var84.childNodes.length; var86++) {
    let var87 = var84.childNodes[var86].querySelector('input');
    var87.value.trim() && var85++;
  }
  document.getElementById("message-label").textContent = this._searchKeyWords + "｜已编辑标签：" + var85 + '/' + var84.childNodes.length;
};
