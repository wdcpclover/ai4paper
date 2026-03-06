var methodsBody = function () {};
methodsBody.init = async function () {
  methodsBody.io = window.arguments && window.arguments[0x0] ? window.arguments[0x0] : {
    dataIn: false,
    dataOut: null
  };
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener("dialogaccept", () => methodsBody.acceptSelection());
  Zotero.AI4Paper.setFontSize_Dialog(document.querySelector("dialog"), 0.92);
  Zotero.AI4Paper.DialogUtils.registerKeyboardShortcuts(document, [
    { key: 'd', handler: () => methodsBody.switchTagsTypeView() },
    { key: 'f', handler: () => document.getElementById('searchBox-elem').focus() }
  ]);
  Zotero.AI4Paper.lasttaginput && (document.getElementById('searchBox-elem').placeholder = Zotero.AI4Paper.lasttaginput);
  document.getElementById('cardNotes-doubleClick-enable').checked = Zotero.Prefs.get("ai4paper.selectTagsDoubleClick");
  document.getElementById('imageCardNote-Search-First').checked = Zotero.Prefs.get("ai4paper.imageCardNoteSearchFirst");
  methodsBody.initContextMenu();
  methodsBody._is4AnnotationTags = methodsBody.io.dataIn;
  methodsBody.hiddenElements();
  let var1,
    var2 = Zotero.AI4Paper.lastTagsSelectPane;
  if (!methodsBody._is4AnnotationTags) {
    document.title = "添加条目标签";
    Zotero.getMainWindow().Zotero_Tabs._selectedID === "zotero-pane" && (document.title = '向【' + Zotero.AI4Paper._data_selectedItemsNum + '】个条目添加条目标签');
    if (var2 === 'itemTagsPane') {
      var1 = Zotero.AI4Paper.returnItemTags();
      methodsBody.updateTagsNumMessage(var1, 'itemTag');
      methodsBody.updateButtonStatus("itemTag");
    } else var2 === "recentItemTagsPane" ? (var1 = Zotero.Prefs.get("ai4paper.recentlyAddedItemTags").split("😊🎈🍓"), var1.length === 0x1 && var1[0x0] === '' && (var1 = []), methodsBody.updateTagsNumMessage(var1, "recentItemTag"), methodsBody.updateButtonStatus("recentItemTag")) : (var1 = Zotero.AI4Paper.returnItemTags(), methodsBody.updateTagsNumMessage(var1, "itemTag"), methodsBody.updateButtonStatus("itemTag"));
  } else {
    if (var2 === "annotationTagsPane") {
      var1 = Zotero.AI4Paper.returnAnnotationTags();
      methodsBody.updateTagsNumMessage(var1, "annotationTag");
      methodsBody.updateButtonStatus("annotationTag");
    } else {
      if (var2 === "imageAnnotationTagsPane") {
        var1 = Zotero.AI4Paper.returnImageAnnotationTags();
        methodsBody.updateTagsNumMessage(var1, "imageAnnotationTag");
        methodsBody.updateButtonStatus("imageAnnotationTag");
      } else var2 === 'recentTagsPane' ? (var1 = Zotero.Prefs.get('ai4paper.recentlyaddedTags').split("😊🎈🍓"), var1.length === 0x1 && var1[0x0] === '' && (var1 = []), methodsBody.updateTagsNumMessage(var1, "recentTag"), methodsBody.updateButtonStatus('recentTag')) : (var1 = Zotero.AI4Paper.returnAnnotationTags(), methodsBody.updateTagsNumMessage(var1, "annotationTag"), methodsBody.updateButtonStatus("annotationTag"));
    }
  }
  methodsBody.buildItemNodes(var1);
  methodsBody.updateFilterButtons(true);
  await Zotero.Promise.delay(0xa);
  document.getElementById("searchBox-elem").focus();
  document.getElementById("selectedTags-inputBox-elem").focus();
  document.getElementById('searchBox-elem').focus();
};
methodsBody.itemTag = function (param1) {
  methodsBody.updateButtonStatus("itemTag");
  let var3 = Zotero.AI4Paper.returnItemTags();
  methodsBody.clearListbox();
  methodsBody.buildItemNodes(var3);
  !param1 ? methodsBody.updateTagsNumMessage(var3, "itemTag") : document.getElementById("message-label").textContent = '刷新完成，共有【' + var3.length + "】个条目标签";
  methodsBody.updateFilterButtons(true);
};
methodsBody.annotationTag = function (param2) {
  methodsBody.updateButtonStatus("annotationTag");
  let var4 = Zotero.AI4Paper.returnAnnotationTags();
  methodsBody.clearListbox();
  methodsBody.buildItemNodes(var4);
  !param2 ? methodsBody.updateTagsNumMessage(var4, "annotationTag") : document.getElementById("message-label").textContent = '刷新完成，共有【' + var4.length + "】个注释标签";
  methodsBody.updateFilterButtons(true);
};
methodsBody.imageAnnotationTag = function (param3) {
  methodsBody.updateButtonStatus('imageAnnotationTag');
  let var5 = Zotero.AI4Paper.returnImageAnnotationTags();
  methodsBody.clearListbox();
  methodsBody.buildItemNodes(var5);
  !param3 ? methodsBody.updateTagsNumMessage(var5, "imageAnnotationTag") : document.getElementById("message-label").textContent = '刷新完成，共有【' + var5.length + "】个图片注释标签";
  methodsBody.updateFilterButtons(true);
};
methodsBody.filter = function (param4) {
  methodsBody.updateFilterButtons(null, param4);
  let var6;
  var var7 = document.getElementById('annotationTagType-image');
  if (var7.getAttribute("src") === "chrome://ai4paper/content/icons/annotationTag.png") {
    var6 = Zotero.AI4Paper.returnAnnotationTagsFilter(param4);
    methodsBody.updateButtonStatus("annotationTag");
  } else {
    if (var7.getAttribute("src") === "chrome://ai4paper/content/icons/imageAnnotationTag.png") {
      var6 = Zotero.AI4Paper.returnImageAnnotationTagsFilter(param4);
      methodsBody.updateButtonStatus("imageAnnotationTag");
    } else var7.getAttribute('src') === "chrome://ai4paper/content/icons/itemTag.png" || !methodsBody._is4AnnotationTags && var7.getAttribute('src') === "chrome://ai4paper/content/icons/recentTag.png" ? (var6 = Zotero.AI4Paper.returnItemTagsFilter(param4), methodsBody.updateButtonStatus("itemTag")) : (var6 = Zotero.AI4Paper.returnAnnotationTagsFilter(param4), methodsBody.updateButtonStatus("annotationTag"));
  }
  methodsBody.clearListbox();
  methodsBody.buildItemNodes(var6);
  param4 = param4 === 'OT' ? '#' : param4;
  var var8 = document.getElementById("message-label");
  if (var7.getAttribute('src') === "chrome://ai4paper/content/icons/annotationTag.png") var8.textContent = param4 + "：包含【" + var6.length + "】个注释标签";else {
    if (var7.getAttribute('src') === "chrome://ai4paper/content/icons/imageAnnotationTag.png") var8.textContent = param4 + '：包含【' + var6.length + "】个图片注释标签";else var7.getAttribute("src") === "chrome://ai4paper/content/icons/itemTag.png" || !methodsBody._is4AnnotationTags && var7.getAttribute("src") === 'chrome://ai4paper/content/icons/recentTag.png' ? var8.textContent = param4 + "：包含【" + var6.length + "】个条目标签" : (var7.setAttribute("src", "chrome://ai4paper/content/icons/annotationTag.png"), var8.textContent = param4 + "：包含【" + var6.length + "】个注释标签");
  }
};
methodsBody.updateTags = async function (param5) {
  let tagConfigs = {
    'itemTag': { description: "条目标签", checkFn: Zotero.AI4Paper.checkItemTag, prefKey: "ai4paper.itemTags", refreshFn: (v) => methodsBody.itemTag(v) },
    'annotationTag': { description: "注释标签", checkFn: Zotero.AI4Paper.checkAnnotationTag, prefKey: "ai4paper.annotationtagsrecent", refreshFn: (v) => methodsBody.annotationTag(v) },
    'imageAnnotationTag': { description: "图片注释标签", checkFn: Zotero.AI4Paper.checkImageAnnotationTag, prefKey: "ai4paper.imageannotationtagsrecent", refreshFn: (v) => methodsBody.imageAnnotationTag(v) }
  };
  let config = tagConfigs[param5];
  if (!config) return;
  document.getElementById('annotationTagType-image').setAttribute("src", "chrome://ai4paper/content/icons/" + param5 + ".png");
  document.getElementById("message-label").textContent = "正在刷新" + config.description + "，右下角查看进度...";
  await Zotero.AI4Paper.DialogUtils.runTagUpdateChain({
    tagType: param5, dialogPrefix: "_selectTagsDialog_update_",
    description: config.description, checkFn: config.checkFn,
    prefKey: config.prefKey, refreshFn: config.refreshFn
  });
};
methodsBody.recentItemTags = function () {
  methodsBody.updateButtonStatus("recentItemTag");
  let var24 = Zotero.Prefs.get("ai4paper.recentlyAddedItemTags").split("😊🎈🍓");
  var24.length === 0x1 && var24[0x0] === '' && (var24 = []);
  methodsBody.clearListbox();
  methodsBody.buildItemNodes(var24);
  methodsBody.updateTagsNumMessage(var24, "recentItemTag");
  methodsBody.updateFilterButtons(true);
};
methodsBody.recentTags = function () {
  methodsBody.updateButtonStatus("recentTag");
  let var25 = Zotero.Prefs.get('ai4paper.recentlyaddedTags').split("😊🎈🍓");
  var25.length === 0x1 && var25[0x0] === '' && (var25 = []);
  methodsBody.updateTagsNumMessage(var25, "recentTag");
  methodsBody.clearListbox();
  methodsBody.buildItemNodes(var25);
  methodsBody.updateFilterButtons(true);
};
methodsBody.search = function () {
  var var26 = document.getElementById("searchBox-elem").value.trim();
  if (var26 === '' && document.getElementById("searchBox-elem").placeholder === '') return false;else var26 === '' && document.getElementById("searchBox-elem").placeholder != '' && (var26 = document.getElementById("searchBox-elem").placeholder, document.getElementById('searchBox-elem').value = document.getElementById('searchBox-elem').placeholder);
  document.getElementById("searchBox-elem").placeholder = var26;
  Zotero.AI4Paper.lasttaginput = var26;
  let var27;
  var var28 = document.getElementById("annotationTagType-image");
  if (var28.getAttribute("src") === "chrome://ai4paper/content/icons/annotationTag.png") {
    var27 = Zotero.AI4Paper.returnAnnotationTagsSearch(var26);
    methodsBody.updateButtonStatus('annotationTag');
  } else {
    if (var28.getAttribute("src") === "chrome://ai4paper/content/icons/imageAnnotationTag.png") {
      var27 = Zotero.AI4Paper.returnImageAnnotationTagsSearch(var26);
      methodsBody.updateButtonStatus("imageAnnotationTag");
    } else var28.getAttribute("src") === "chrome://ai4paper/content/icons/itemTag.png" || !methodsBody._is4AnnotationTags && var28.getAttribute('src') === "chrome://ai4paper/content/icons/recentTag.png" ? (var27 = Zotero.AI4Paper.returnItemTagsSearch(var26), methodsBody.updateButtonStatus('itemTag')) : (var27 = Zotero.AI4Paper.returnAnnotationTagsSearch(var26), methodsBody.updateButtonStatus("annotationTag"));
  }
  methodsBody.clearListbox();
  methodsBody.buildItemNodes(var27);
  var var29 = document.getElementById("message-label");
  if (var28.getAttribute("src") === 'chrome://ai4paper/content/icons/annotationTag.png') var29.textContent = '搜索【' + var26 + '】：共有【' + var27.length + "】个注释标签";else {
    if (var28.getAttribute("src") === 'chrome://ai4paper/content/icons/imageAnnotationTag.png') var29.textContent = "搜索【" + var26 + "】：共有【" + var27.length + "】个图片注释标签";else var28.getAttribute("src") === "chrome://ai4paper/content/icons/itemTag.png" || !methodsBody._is4AnnotationTags && var28.getAttribute('src') === "chrome://ai4paper/content/icons/recentTag.png" ? var29.textContent = '搜索【' + var26 + "】：共有【" + var27.length + "】个条目标签" : (var28.setAttribute("src", "chrome://ai4paper/content/icons/annotationTag.png"), var29.textContent = "搜索【" + var26 + "】：共有【" + var27.length + "】个注释标签");
  }
  methodsBody.updateFilterButtons(true);
};
methodsBody.checkKeyEnter = function (param21) {
  !param21.shiftKey && !param21.ctrlKey && !param21.altKey && !param21.metaKey && param21.keyCode === 0xd && (param21.returnValue = false, param21.preventDefault && param21.preventDefault(), methodsBody.search());
};
methodsBody.acceptSelection = function () {
  var var30 = false;
  if (document.getElementById("selectedTags-inputBox-elem").value === '') return methodsBody.io.dataOut = null, false;else {
    methodsBody.io.dataOut = document.getElementById("selectedTags-inputBox-elem").value;
    let var31 = document.getElementById('annotationTagType-image');
    if (var31.getAttribute("src") === 'chrome://ai4paper/content/icons/annotationTag.png') Zotero.AI4Paper.lastTagsSelectPane = "annotationTagsPane";else {
      if (var31.getAttribute("src") === "chrome://ai4paper/content/icons/imageAnnotationTag.png") Zotero.AI4Paper.lastTagsSelectPane = "imageAnnotationTagsPane";else {
        if (var31.getAttribute("src") === 'chrome://ai4paper/content/icons/itemTag.png') Zotero.AI4Paper.lastTagsSelectPane = "itemTagsPane";else {
          if (!methodsBody._is4AnnotationTags && var31.getAttribute("src") === 'chrome://ai4paper/content/icons/recentTag.png') Zotero.AI4Paper.lastTagsSelectPane = "recentItemTagsPane";else var31.getAttribute("src") === "chrome://ai4paper/content/icons/recentTag.png" ? Zotero.AI4Paper.lastTagsSelectPane = "recentTagsPane" : Zotero.AI4Paper.lastTagsSelectPane = "annotationTagsPane";
        }
      }
    }
  }
};
methodsBody.handleCheckboxChange = function (param22) {
  var var32 = param22.checked,
    var33 = document.getElementById("selectedTags-inputBox-elem").value;
  if (var32) {
    if (var33 === '') document.getElementById("selectedTags-inputBox-elem").value = "🏷️" + param22.label;else {
      var33.trim().indexOf("🏷️") != 0x0 && (var33 = "🏷️" + var33.trim());
      let var34 = var33.substring(0x3).split('🏷️');
      for (let var35 = 0x0; var35 < var34.length; var35++) {
        if (var34[var35] === param22.label) return false;
      }
      document.getElementById("selectedTags-inputBox-elem").value = var33 + "🏷️" + param22.label;
    }
  } else {
    if (var33 != '') {
      var33.trim().indexOf('🏷️') != 0x0 && (var33 = "🏷️" + var33.trim());
      let var36 = var33.substring(0x3).split("🏷️");
      for (let var37 = 0x0; var37 < var36.length; var37++) {
        var36[var37] === param22.label && (var36.splice(var37, 0x1), document.getElementById('selectedTags-inputBox-elem').value = '' + (var36.join("🏷️") ? '🏷️' + var36.join('🏷️') : var36.join("🏷️")));
      }
    }
  }
};
methodsBody.clearSelectedTags = function () {
  document.getElementById("selectedTags-inputBox-elem").value = '';
  var var38 = document.getElementById('richlistbox-elem');
  for (var var39 = 0x0; var39 < var38.childNodes.length; var39++) {
    var var40 = var38.childNodes[var39].firstElementChild;
    var40.checked = false;
  }
};
methodsBody.checkTagSelected = function (param23) {
  var var41 = document.getElementById("selectedTags-inputBox-elem").value;
  if (var41 != '') {
    let var42 = var41.substring(0x3).split("🏷️");
    for (let var43 = 0x0; var43 < var42.length; var43++) {
      if (var42[var43] === param23) return true;
    }
  }
  return false;
};
methodsBody.quickJump = function (param24) {
  if (!Zotero.Prefs.get("ai4paper.selectTagsDoubleClick")) return;
  let var44 = Zotero.Prefs.get("ai4paper.annotationtagsrecent"),
    var45 = Zotero.Prefs.get("ai4paper.imageannotationtagsrecent");
  var var46 = document.getElementById('annotationTagType-image');
  let var47 = param24,
    var48 = 0x0,
    var49 = {
      'tag': var47,
      'type': var48
    };
  if (document.getElementById('itemTag-button').getAttribute("default") === "true" || document.getElementById("recentItemTag-button").getAttribute("default") === "true") Zotero.AI4Paper.queryPapersMatrix("filterByTag", param24);else {
    if (document.getElementById("imageAnnotationTag-button").getAttribute("default") === 'true') {
      Zotero.Prefs.set("ai4paper.annotationtagtype", "type_imageAnnotationTag");
      Zotero.AI4Paper.tagImageCardNotes(param24);
    } else document.getElementById("annotationTag-button").getAttribute("default") === 'true' || document.getElementById("recentTag-button").getAttribute("default") === "true" ? Zotero.Prefs.get('ai4paper.imageCardNoteSearchFirst') && var45.includes(JSON.stringify(var49)) ? (Zotero.Prefs.set("ai4paper.annotationtagtype", "type_imageAnnotationTag"), Zotero.AI4Paper.tagImageCardNotes(param24)) : (Zotero.Prefs.set("ai4paper.annotationtagtype", "type_annotationTag"), Zotero.AI4Paper.tagCardNotes(param24)) : (Zotero.Prefs.set("ai4paper.annotationtagtype", "type_annotationTag"), Zotero.AI4Paper.tagCardNotes(param24));
  }
};
methodsBody.run = function () {
  Zotero.Prefs.set("ai4paper.selectTagsDoubleClick", document.getElementById("cardNotes-doubleClick-enable").checked);
};
methodsBody.initContextMenu = function (param25) {
  Zotero.AI4Paper.DialogUtils.initMenuPopup('richlistitem-contextmenu', true);
};
methodsBody.buildContextMenu = function (param26) {
  let tagLabel = param26.target.closest("richlistitem")?.["querySelector"]('checkbox')["label"];
  let menu = Zotero.AI4Paper.DialogUtils.initMenuPopup('richlistitem-contextmenu');
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, "拷贝标签", () => {
    Zotero.AI4Paper.copy2Clipboard(tagLabel);
    Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝标签【AI4paper】", '已拷贝标签【' + tagLabel + '】');
  });
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, "检索所属文献", () => {
    window.close();
    Zotero.AI4Paper.showItemsBasedOnTag(tagLabel);
  });
  return menu;
};
methodsBody.buildItemNodes = function (param27) {
  var var55 = document.getElementById("richlistbox-elem");
  for (var var56 in param27) {
    var var57 = param27[var56],
      var58,
      var59 = false;
    var57 && typeof var57 == "object" && var57.title !== undefined ? (var58 = var57.title, var59 = !!var57.checked) : var58 = var57;
    let var60 = document.createXULElement("richlistitem"),
      var61 = document.createXULElement("checkbox");
    var61.label = var58;
    var61.setAttribute("native", 'true');
    var60.setAttribute("value", var56);
    var60.append(var61);
    var60.addEventListener('click', _0x104659 => {
      _0x104659.target == var60 && (var61.checked = !var61.checked);
      methodsBody.handleCheckboxChange(var61);
      if (_0x104659.shiftKey) {
        window.close();
        Zotero.AI4Paper.showItemsBasedOnTag(_0x104659.target.closest("richlistitem")?.["querySelector"]("checkbox")["label"]);
        return;
      }
      if (_0x104659.button === 0x2) {
        let var62 = methodsBody.buildContextMenu(_0x104659);
        var62 && var62.openPopup(var60, "after_start", 0x46, 0x0, false, false);
      }
    });
    methodsBody.checkTagSelected(var58) && (var59 = true);
    var61.checked = var59;
    var var63 = 0x0,
      var64;
    var60.addEventListener("click", function (param28) {
      var63++;
      if (var63 === 0x1) var64 = setTimeout(function () {
        var63 = 0x0;
      }, 0x12c);else {
        if (var63 === 0x2) {
          clearTimeout(var64);
          var63 = 0x0;
          let var65 = param28.target.closest('richlistitem')?.["querySelector"]("checkbox")["label"];
          methodsBody.quickJump(var65);
        }
      }
    });
    var55.append(var60);
  }
};
methodsBody.clearListbox = function () {
  Zotero.AI4Paper.DialogUtils.clearListbox('richlistbox-elem');
};
methodsBody.updateTagsNumMessage = function (param29, param30) {
  let var68 = {
    'annotationTag': "注释标签",
    'imageAnnotationTag': "图片注释标签",
    'recentTag': "最近注释标签",
    'itemTag': "条目标签",
    'recentItemTag': "最近条目标签"
  };
  document.getElementById('message-label').textContent = "共有【" + param29.length + '】个' + var68[param30];
  document.getElementById('annotationTagType-image').setAttribute("src", "chrome://ai4paper/content/icons/" + (param30 === 'recentItemTag' ? 'recentTag' : param30) + ".png");
};
methodsBody.updateButtonStatus = function (param31) {
  let var69 = ["annotationTag", "imageAnnotationTag", "recentTag", "itemTag", "recentItemTag"];
  for (let var70 of var69) {
    var70 === param31 ? document.getElementById(var70 + '-button')?.["setAttribute"]("default", true) : document.getElementById(var70 + "-button")?.["setAttribute"]("default", false);
  }
  document.getElementById("annotationTagType-image").setAttribute("src", "chrome://ai4paper/content/icons/" + (param31 === 'recentItemTag' ? "recentTag" : param31) + ".png");
};
methodsBody.updateFilterButtons = function (param32, param33) {
  Zotero.AI4Paper.DialogUtils.updateAZFilterButtons(param32, param33);
};
methodsBody.hiddenElements = function () {
  let var76 = methodsBody._is4AnnotationTags;
  if (var76) {
    let var77 = ["recentItemTag-button"];
    var77.forEach(_0x491dc1 => document.getElementById(_0x491dc1).hidden = true);
  } else {
    let var78 = ["imageAnnotationTag-button", "updateImageAnnotationTag-icon", "recentTag-button"];
    var78.forEach(_0x1eccbb => document.getElementById(_0x1eccbb).hidden = true);
  }
};
methodsBody.switchTagsTypeView = function () {
  if (methodsBody._is4AnnotationTags) {
    let var79 = ["itemTag", "annotationTag", 'imageAnnotationTag', 'recentTag'];
    for (let var80 = 0x0; var80 < var79.length; var80++) {
      if (document.getElementById(var79[var80] + "-button").getAttribute("default") === "true") {
        let var81 = var80 === 0x3 ? 0x0 : var80 + 0x1;
        document.getElementById(var79[var81] + '-button').click();
        return;
      }
    }
  } else {
    let var82 = ["itemTag", "recentItemTag", "annotationTag"];
    for (let var83 = 0x0; var83 < var82.length; var83++) {
      if (document.getElementById(var82[var83] + "-button").getAttribute("default") === "true") {
        let var84 = var83 === 0x2 ? 0x0 : var83 + 0x1;
        document.getElementById(var82[var84] + "-button").click();
        return;
      }
    }
  }
};
