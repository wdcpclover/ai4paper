var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  Zotero.ZoteroIF.setFontSize_Dialog(document.querySelector("dialog"), 0.92);
  Zotero.ZoteroIF.lastRenameTagsSearchInput && (document.getElementById("searchBox-elem").placeholder = Zotero.ZoteroIF.lastRenameTagsSearchInput);
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
  let var2 = Zotero.ZoteroIF.returnItemTags();
  methodsBody.buildItemNodes(var2);
  methodsBody.updateEditedItemsNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.annotationTag = function (param2) {
  this._searchKeyWords = !param2 ? "注释标签" : "注释标签，刷新完成";
  methodsBody.updateTagTypeButtonStatus("annotationTag");
  methodsBody.updateViewButtonStatus("showAllItems");
  methodsBody.clearListbox();
  let var3 = Zotero.ZoteroIF.returnAnnotationTags();
  methodsBody.buildItemNodes(var3);
  methodsBody.updateEditedItemsNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.gptNoteTag = function (param3) {
  this._searchKeyWords = !param3 ? "GPT 标签" : "GPT 标签，刷新完成";
  methodsBody.updateTagTypeButtonStatus("gptNoteTag");
  methodsBody.updateViewButtonStatus("showAllItems");
  methodsBody.clearListbox();
  let var4 = Zotero.ZoteroIF.returnGPTNoteTags();
  methodsBody.buildItemNodes(var4);
  methodsBody.updateEditedItemsNum();
  methodsBody.updateFilterButtons(true);
};
methodsBody.updateTags = async function (param4) {
  let var5 = {
      'itemTag': "条目标签",
      'annotationTag': "注释标签",
      'gptNoteTag': "GPT 笔记标签"
    },
    var6 = await Zotero.Tags.getAll(0x1);
  if (var6.length === 0x0) {
    Zotero.ZoteroIF.showProgressWindow(0xbb8, "❌ 未发现标签【AI4paper】", "未在【我的文库】中发现任何标签！");
    return;
  }
  document.getElementById('message-label').textContent = "正在刷新" + var5[param4] + "，右下角查看进度...";
  let var7 = "_renameTagsDialog_update_" + param4;
  Zotero.ZoteroIF.progressPercent_initProgress(var6, var7, var5[param4]);
  methodsBody["update_" + param4 + "_checkNext"](var7, var5[param4]);
};
methodsBody.update_itemTag_checkNext = async function (param5, param6) {
  Zotero.ZoteroIF["numberOfUpdatedItems" + param5]++;
  if (Zotero.ZoteroIF["current" + param5] == Zotero.ZoteroIF['toUpdate' + param5] - 0x1) {
    Zotero.ZoteroIF["progressWindow" + param5].close();
    Zotero.ZoteroIF.progressPercent_resetState(null, param5, param6);
    Zotero.Prefs.set("zoteroif.itemTags", JSON.stringify(Zotero.ZoteroIF["_progressData_" + param5]));
    methodsBody.itemTag(true);
    return;
  }
  Zotero.ZoteroIF.progressPercent_updatePercent(param5, "检查所有标签： ");
  methodsBody.update_itemTag_checkTag(Zotero.ZoteroIF['itemsToUpdate' + param5][Zotero.ZoteroIF['current' + param5]], param5, param6);
};
methodsBody.update_itemTag_checkTag = async function (param7, param8, param9) {
  try {
    let var8 = await Zotero.ZoteroIF.checkItemTag(param7.tag);
    if (var8) {
      let var9 = param7.tag,
        var10 = 0x0,
        var11 = {
          'tag': var9,
          'type': var10
        };
      !JSON.stringify(Zotero.ZoteroIF["_progressData_" + param8]).includes(JSON.stringify(var11)) && (Zotero.ZoteroIF["_progressData_" + param8].push(var11), Zotero.ZoteroIF["counter" + param8]++);
    }
  } catch (_0x1cf921) {
    Zotero.debug(_0x1cf921);
  }
  methodsBody.update_itemTag_checkNext(param8, param9);
};
methodsBody.update_annotationTag_checkNext = async function (param10, param11) {
  Zotero.ZoteroIF["numberOfUpdatedItems" + param10]++;
  if (Zotero.ZoteroIF["current" + param10] == Zotero.ZoteroIF["toUpdate" + param10] - 0x1) {
    Zotero.ZoteroIF['progressWindow' + param10].close();
    Zotero.ZoteroIF.progressPercent_resetState(null, param10, param11);
    Zotero.Prefs.set("zoteroif.annotationtagsrecent", JSON.stringify(Zotero.ZoteroIF["_progressData_" + param10]));
    methodsBody.annotationTag(true);
    return;
  }
  Zotero.ZoteroIF.progressPercent_updatePercent(param10, "检查所有标签： ");
  methodsBody.update_annotationTag_checkTag(Zotero.ZoteroIF["itemsToUpdate" + param10][Zotero.ZoteroIF["current" + param10]], param10, param11);
};
methodsBody.update_annotationTag_checkTag = async function (param12, param13, param14) {
  try {
    let var12 = await Zotero.ZoteroIF.checkAnnotationTag(param12.tag);
    if (var12) {
      let var13 = param12.tag,
        var14 = 0x0,
        var15 = {
          'tag': var13,
          'type': var14
        };
      !JSON.stringify(Zotero.ZoteroIF["_progressData_" + param13]).includes(JSON.stringify(var15)) && (Zotero.ZoteroIF['_progressData_' + param13].push(var15), Zotero.ZoteroIF["counter" + param13]++);
    }
  } catch (_0x36a4bd) {
    Zotero.debug(_0x36a4bd);
  }
  methodsBody.update_annotationTag_checkNext(param13, param14);
};
methodsBody.update_gptNoteTag_checkNext = async function (param15, param16) {
  Zotero.ZoteroIF['numberOfUpdatedItems' + param15]++;
  if (Zotero.ZoteroIF["current" + param15] == Zotero.ZoteroIF["toUpdate" + param15] - 0x1) {
    Zotero.ZoteroIF['progressWindow' + param15].close();
    Zotero.ZoteroIF.progressPercent_resetState(null, param15, param16);
    Zotero.Prefs.set("zoteroif.gptnotetagsrecent", JSON.stringify(Zotero.ZoteroIF["_progressData_" + param15]));
    methodsBody.gptNoteTag(true);
    return;
  }
  Zotero.ZoteroIF.progressPercent_updatePercent(param15, "检查所有标签： ");
  methodsBody.update_gptNoteTag_checkTag(Zotero.ZoteroIF["itemsToUpdate" + param15][Zotero.ZoteroIF["current" + param15]], param15, param16);
};
methodsBody.update_gptNoteTag_checkTag = async function (param17, param18, param19) {
  try {
    let var16 = await Zotero.ZoteroIF.checkGPTNoteTag(param17.tag);
    if (var16) {
      let var17 = param17.tag,
        var18 = 0x0,
        var19 = {
          'tag': var17,
          'type': var18
        };
      !JSON.stringify(Zotero.ZoteroIF["_progressData_" + param18]).includes(JSON.stringify(var19)) && (Zotero.ZoteroIF["_progressData_" + param18].push(var19), Zotero.ZoteroIF["counter" + param18]++);
    }
  } catch (_0x115864) {
    Zotero.debug(_0x115864);
  }
  methodsBody.update_gptNoteTag_checkNext(param18, param19);
};
methodsBody.filter = async function (param20) {
  methodsBody.updateFilterButtons(null, param20);
  let var20;
  if (document.getElementById("libraryTag-button").getAttribute("default") === "true") var20 = await methodsBody.getData_filteredTags(param20);else {
    if (document.getElementById("itemTag-button").getAttribute("default") === 'true') var20 = Zotero.ZoteroIF.returnItemTagsFilter(param20);else {
      if (document.getElementById('annotationTag-button').getAttribute("default") === "true") var20 = Zotero.ZoteroIF.returnAnnotationTagsFilter(param20);else document.getElementById('gptNoteTag-button').getAttribute("default") === "true" && (var20 = Zotero.ZoteroIF.returnGPTNoteTagsFilter(param20));
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
        Zotero.ZoteroIF.showItemsBasedOnTag(var22);
        return;
      }
    });
    var25.addEventListener("contextmenu", _0x5d3bae => {
      let var26 = methodsBody.buildContextMenu(_0x5d3bae);
      var26 && var26.openPopup(var25, 'after_start', 0x46, 0x0, false, false);
    });
    var25.addEventListener("dblclick", _0x381a17 => {
      _0x381a17.stopPropagation();
      Zotero.ZoteroIF.copy2Clipboard(var25.textContent);
      Zotero.ZoteroIF.showProgressWindow(0x5dc, "✅ 拷贝标签【AI4paper】", "已拷贝标签【" + var25.textContent + '。');
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
    var28.innerHTML = Zotero.ZoteroIF.svg_icon_16px.cross;
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
  let var29 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'OT'];
  for (let var30 of var29) {
    let var31 = document.getElementById("tagFilter-" + var30),
      var32 = "chrome://zoteroif/content/icons/" + var30 + '.png',
      var33 = "chrome://zoteroif/content/icons/" + var30 + "-select.png";
    param22 ? (var31.setAttribute("src", var32), var31.onmouseover = () => var31.style.transform = 'scale(1.3)', var31.onmouseout = () => var31.style.transform = "scale(1)") : var30 === param23 ? (var31.setAttribute("src", var33), var31.style.transform = "scale(1)", var31.onmouseover = () => {}, var31.onmouseout = () => {}) : (var31.setAttribute('src', var32), var31.onmouseover = () => var31.style.transform = 'scale(1.3)', var31.onmouseout = () => var31.style.transform = "scale(1)");
  }
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
    let var45 = Zotero.ZoteroIF.checkENZH(var44.substring(0x0, 0x1));
    if (var45 === 'en') var44.substring(0x0, 0x1).toUpperCase() === param24 && var43.push(var44);else {
      if (var45 === 'zh') {
        let var46 = Zotero.ZoteroIF.Pinyin.getWordsCode(var44);
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
  var var50 = document.getElementById("richlistbox-elem");
  let var51 = var50.firstElementChild;
  while (var51) {
    var51.remove();
    var51 = var50.firstElementChild;
  }
};
methodsBody.clearAllInputBoxes = function () {
  var var52 = document.getElementById("richlistbox-elem");
  for (var var53 = 0x0; var53 < var52.childNodes.length; var53++) {
    var52.childNodes[var53].querySelector('input').value = '';
  }
  methodsBody.updateEditedItemsNum();
};
methodsBody.buildContextMenu = function (param26, param27) {
  let var54 = document.querySelector("#richlistitem-contextmenu");
  if (!var54) {
    var54 = document.createXULElement("menupopup");
    var54.id = "richlistitem-contextmenu";
    document.documentElement.appendChild(var54);
    var54 = document.documentElement.lastElementChild.firstElementChild;
    if (param27) return;
  }
  let var55 = param26.target.textContent,
    var56 = var54.firstElementChild;
  while (var56) {
    var56.remove();
    var56 = var54.firstElementChild;
  }
  let var57 = document.createXULElement('menuitem');
  var57.setAttribute('label', '拷贝标签');
  var57.addEventListener("command", () => {
    Zotero.ZoteroIF.copy2Clipboard(var55);
    Zotero.ZoteroIF.showProgressWindow(0x7d0, '拷贝标签【Zotero\x20One】', '已拷贝标签【' + var55 + '】');
  });
  var54.appendChild(var57);
  let var58 = document.createXULElement('menuseparator');
  return var54.appendChild(var58), var57 = window.document.createXULElement("menuitem"), var57.setAttribute("label", "检索所属文献"), var57.addEventListener("command", () => {
    Zotero.ZoteroIF.showItemsBasedOnTag(var55);
  }), var54.appendChild(var57), var54;
};
methodsBody.renameTags = async function () {
  let var59 = methodsBody.getRenameData();
  if (!var59) return;
  let var60 = Services.prompt.confirm(window, '批量重命名标签', '发现【' + var59.editedNum + "】个已编辑标签，其中👉【" + var59.changedNum + "】👈个为有效编辑（即新旧名称不同），是否确认重命名？\n\n👉 重命名后，将无法撤回！"),
    var61 = var59.renameData;
  for (let var62 in var61) {
    await Zotero.Tags.rename(0x1, var62, var61[var62]);
  }
  Zotero.ZoteroIF.showProgressWindow(0x1388, "✅ 批量重命名标签", "批量重命名【" + var59.changedNum + "】个标签完成，并已刷新标签！");
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
  let var64 = JSON.parse(Zotero.Prefs.get('zoteroif.annotationtagsrecent') || '[]'),
    var65 = param28,
    var66 = 0x0,
    var67 = {
      'tag': var65,
      'type': var66
    },
    var68 = var64.findIndex(_0x5da71b => JSON.stringify(_0x5da71b) === JSON.stringify(var67));
  var68 !== -0x1 && (var64.splice(var68, 0x1), Zotero.Prefs.set("zoteroif.annotationtagsrecent", JSON.stringify(var64)), var65 = param29.trim(), var67 = {
    'tag': var65,
    'type': var66
  }, !JSON.stringify(var64).includes(JSON.stringify(var67)) && (var64.push(var67), Zotero.Prefs.set("zoteroif.annotationtagsrecent", JSON.stringify(var64))));
  var68 = -0x1;
  var64 = [];
  var64 = JSON.parse(Zotero.Prefs.get("zoteroif.imageannotationtagsrecent") || '[]');
  var65 = param28;
  var67 = {
    'tag': var65,
    'type': var66
  };
  var68 = var64.findIndex(_0x1cfa41 => JSON.stringify(_0x1cfa41) === JSON.stringify(var67));
  var68 !== -0x1 && (var64.splice(var68, 0x1), Zotero.Prefs.set("zoteroif.imageannotationtagsrecent", JSON.stringify(var64)), var65 = param29.trim(), var67 = {
    'tag': var65,
    'type': var66
  }, !JSON.stringify(var64).includes(JSON.stringify(var67)) && (var64.push(var67), Zotero.Prefs.set('zoteroif.imageannotationtagsrecent', JSON.stringify(var64))));
  var68 = -0x1;
  var64 = [];
  var64 = JSON.parse(Zotero.Prefs.get("zoteroif.itemTags") || '[]');
  var65 = param28;
  var67 = {
    'tag': var65,
    'type': var66
  };
  var68 = var64.findIndex(_0x519caa => JSON.stringify(_0x519caa) === JSON.stringify(var67));
  var68 !== -0x1 && (var64.splice(var68, 0x1), Zotero.Prefs.set("zoteroif.itemTags", JSON.stringify(var64)), var65 = param29.trim(), var67 = {
    'tag': var65,
    'type': var66
  }, !JSON.stringify(var64).includes(JSON.stringify(var67)) && (var64.push(var67), Zotero.Prefs.set("zoteroif.itemTags", JSON.stringify(var64))));
  var68 = -0x1;
  var64 = [];
  var64 = JSON.parse(Zotero.Prefs.get("zoteroif.gptnotetagsrecent") || '[]');
  var65 = param28;
  var67 = {
    'tag': var65,
    'type': var66
  };
  var68 = var64.findIndex(_0x241219 => JSON.stringify(_0x241219) === JSON.stringify(var67));
  var68 !== -0x1 && (var64.splice(var68, 0x1), Zotero.Prefs.set("zoteroif.gptnotetagsrecent", JSON.stringify(var64)), var65 = param29.trim(), var67 = {
    'tag': var65,
    'type': var66
  }, !JSON.stringify(var64).includes(JSON.stringify(var67)) && (var64.push(var67), Zotero.Prefs.set('zoteroif.gptnotetagsrecent', JSON.stringify(var64))));
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
  Zotero.ZoteroIF.lastRenameTagsSearchInput = var78;
  var78 = var78.toLowerCase();
  let var79;
  if (document.getElementById("libraryTag-button").getAttribute("default") === 'true') {
    var79 = await methodsBody.returnLibraryTagsSearch(var78);
    document.getElementById("message-label").textContent = "全库搜索【" + var78 + "】｜共有 " + var79.length + " 个标签！";
    this._searchKeyWords = "全库搜索【" + var78 + '】';
  } else {
    if (document.getElementById("itemTag-button").getAttribute("default") === 'true') {
      var79 = Zotero.ZoteroIF.returnItemTagsSearch(var78);
      document.getElementById("message-label").textContent = "条目标签搜索【" + var78 + "】｜共有 " + var79.length + '\x20个标签！';
      this._searchKeyWords = "条目标签搜索【" + var78 + '】';
    } else {
      if (document.getElementById("annotationTag-button").getAttribute('default') === 'true') {
        var79 = Zotero.ZoteroIF.returnAnnotationTagsSearch(var78);
        document.getElementById("message-label").textContent = "注释标签搜索【" + var78 + "】｜共有 " + var79.length + " 个标签！";
        this._searchKeyWords = "注释标签搜索【" + var78 + '】';
      } else document.getElementById("gptNoteTag-button").getAttribute("default") === "true" && (var79 = Zotero.ZoteroIF.returnGPTNoteTagsSearch(var78), document.getElementById("message-label").textContent = 'GPT\x20标签搜索【' + var78 + '】｜共有\x20' + var79.length + " 个标签！", this._searchKeyWords = 'GPT\x20标签搜索【' + var78 + '】');
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