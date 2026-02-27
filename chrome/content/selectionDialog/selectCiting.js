var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  Zotero.AI4Paper.lastCitingSearchInput && (document.getElementById('search-inputBox').placeholder = Zotero.AI4Paper.lastCitingSearchInput);
  methodsBody.buildContextMenu(null, true);
  document.getElementById('search-inputBox').focus();
  methodsBody.updatePrefs(true);
  this.io = window.arguments[0x0];
  document.getElementById("zotero-selectCiting-intro").textContent = '选择要导入的施引文献：0/' + this.io.dataIn.data.length;
  methodsBody.buildItemNodes(this.io.dataIn.data);
};
methodsBody.buildItemNodes = function (param1) {
  let var1 = methodsBody.io.dataIn.item;
  Zotero.AI4Paper._isDuplicatedArray = JSON.parse(var1._CitingReferences_isDuplicated);
  var var2 = document.getElementById("richlistbox-elem");
  for (var var3 in param1) {
    var var4 = param1[var3];
    let var5 = methodsBody.extractInfoAndAbstract(var4);
    var4 = var5?.['info'];
    var var6,
      var7 = false;
    var4 && typeof var4 == "object" && var4.title !== undefined ? (var6 = var4.title, var7 = !!var4.checked) : var6 = var4;
    let var8 = document.createXULElement("richlistitem"),
      var9 = document.createXULElement("checkbox");
    var8.setAttribute("tooltiptext", var6);
    var8.setAttribute("abstractInfo", var5?.["abstract"]);
    var8.style.fontSize = "14px";
    var8.style.whiteSpace = "nowrap";
    var9.checked = var7;
    var9.label = var6;
    var9.setAttribute("native", "true");
    var8.setAttribute("value", var3);
    var8.append(var9);
    let var10 = document.createXULElement("div");
    var10.classList.add('document-icon');
    var10.style.width = '16px';
    var10.style.height = "16px";
    var10.style.marginRight = "5px";
    var10.style.marginLeft = "5px";
    var10.style.transition = "transform 0.125s ease";
    var10.innerHTML = Zotero.AI4Paper.svg_icon_16px.document;
    var1._hasCitingRefsCache && Zotero.AI4Paper._isDuplicatedArray[var3]._isDuplicated === true && (var10.setAttribute("tooltiptext", "点击显示"), var10.innerHTML = Zotero.AI4Paper.svg_icon_16px.document_active, var10.setAttribute('_itemID', Zotero.AI4Paper._isDuplicatedArray[var3]._itemID), var10.addEventListener("mouseover", () => {
      var10.style.transform = "scale(1.15)";
    }), var10.addEventListener('mouseout', () => {
      var10.style.transform = "scale(1)";
    }), var10.addEventListener("click", function () {
      methodsBody.showInMyLibrary(this);
    }));
    var8.prepend(var10);
    if (var6.indexOf('🆔') === -0x1) var8.style.color = "red";else {
      if (var6.indexOf('🆔') != -0x1 && var6.indexOf("🈯️") != -0x1) {
        let var11 = var6.indexOf('🈯️'),
          var12 = var6.substring(var11 + 0x3).trim();
        var12 && Number(var12) >= Number(Zotero.Prefs.get("ai4paper.retrieverefsIFlimit")) && (var8.style.color = "#ff922b");
      }
    }
    var8.addEventListener('click', _0x27cb0d => {
      if (_0x27cb0d.button === 0x2) {
        let var13 = methodsBody.buildContextMenu(_0x27cb0d);
        var13 && (var13.openPopup(var8, 'after_start', 0x46, 0x0, false, false), methodsBody.updatePanel(var13, _0x27cb0d));
        return;
      }
      _0x27cb0d.target == var8 && (var9.checked = !var9.checked);
      methodsBody.handleCheckboxChange(var9);
      if (_0x27cb0d.shiftKey) {
        let var14 = _0x27cb0d.target.closest('richlistitem').querySelector("checkbox").label;
        methodsBody.viewOnline(var14);
      }
    });
    var2.append(var8);
  }
  var2.itemCount === 0x1 && (var2.getItemAtIndex(0x0).querySelector("checkbox").checked = true);
  methodsBody.registerScrollListener();
  methodsBody.restoreScrollPosition();
  !var1._hasCitingRefsCache && methodsBody.updateDuplicate();
};
methodsBody.updateDuplicate = async function () {
  let var15 = methodsBody.io.dataIn.item;
  var var16 = document.getElementById("richlistbox-elem");
  let var17 = var15._CitingReferences_DOI.split("🍋🎈🍋"),
    var18 = JSON.parse(var15._CitingReferences_isDuplicated);
  for (let var19 = 0x0; var19 < var16.childNodes.length; var19++) {
    let var20 = var16.childNodes[var19].querySelector(".document-icon");
    if (var17[var19] != "DOI-null") {
      let var21 = await Zotero.AI4Paper.checkDOIDuplicateJournalArt(var17[var19]);
      var21 && (var20.setAttribute("tooltiptext", '点击显示'), var20.innerHTML = Zotero.AI4Paper.svg_icon_16px.document_active, var20.setAttribute("_itemID", var21.itemID), var20.addEventListener('mouseover', () => {
        var20.style.transform = "scale(1.15)";
      }), var20.addEventListener('mouseout', () => {
        var20.style.transform = "scale(1)";
      }), var20.addEventListener('click', function () {
        methodsBody.showInMyLibrary(this);
      }), var18[var19] = {
        '_isDuplicated': true,
        '_itemID': var21.itemID
      }, var15._CitingReferences_isDuplicated = JSON.stringify(var18));
    }
  }
};
methodsBody.showInMyLibrary = async function (param2) {
  let var22 = Number(param2.getAttribute("_itemID"));
  if (var22 === -0x1) return Zotero.AI4Paper.showProgressWindow(0xfa0, "❌ 出错了", "条目 🆔 有误！"), false;
  let var23 = Zotero.Items.get(var22);
  window.close();
  try {
    let var24 = var23.getCollections();
    if (var24.length) {
      Zotero.AI4Paper.getGlobal("Zotero_Tabs").select("zotero-pane");
      let var25 = var24[0x0];
      Zotero.AI4Paper.getGlobal("ZoteroPane_Local").collectionsView.selectCollection(var25);
      let var26 = await Zotero.AI4Paper.getGlobal('ZoteroPane_Local').selectItem(var22);
      var26 === false && Zotero.AI4Paper.showProgressWindow(0xfa0, "未找到到该文献", "未在【我的文库】找到该文献，可能已经被您删除！");
    } else {
      Zotero.AI4Paper.getGlobal("Zotero_Tabs").select("zotero-pane");
      let var27 = await Zotero.AI4Paper.getGlobal('ZoteroPane_Local').selectItem(var22);
      var27 === false && Zotero.AI4Paper.showProgressWindow(0xfa0, "未找到到该文献", "未在【我的文库】找到该文献，可能已经被您删除！");
    }
  } catch (_0x423a8c) {
    return false;
  }
};
methodsBody.selectAll = function (param3) {
  var var28 = document.getElementById("richlistbox-elem");
  let var29 = 0x0;
  for (var var30 = 0x0; var30 < var28.childNodes.length; var30++) {
    var28.childNodes[var30].querySelector('checkbox').checked = !param3;
    !param3 && var28.childNodes[var30].style.display === "none" && (var28.childNodes[var30].querySelector("checkbox").checked = false, var29++);
  }
  param3 ? document.getElementById("zotero-selectCiting-intro").textContent = "选择要导入的施引文献：0/" + this.io.dataIn.data.length : document.getElementById("zotero-selectCiting-intro").textContent = "选择要导入的施引文献：" + (this.io.dataIn.data.length - var29) + '/' + this.io.dataIn.data.length;
};
methodsBody.acceptSelection = function () {
  var var31 = document.getElementById("richlistbox-elem"),
    var32 = false;
  this.io.dataOut = new Object();
  for (var var33 = 0x0; var33 < var31.childNodes.length; var33++) {
    var var34 = var31.childNodes[var33];
    var34.querySelector("checkbox").checked && (this.io.dataOut[var34.getAttribute("value")] = var34.querySelector("checkbox").getAttribute("label"), var32 = true);
  }
  if (!var32) this.io.dataOut = null;
};
methodsBody.checkKeyEnter = function (param4) {
  !param4.shiftKey && !param4.ctrlKey && !param4.altKey && !param4.metaKey && param4.keyCode === 0xd && (param4.returnValue = false, param4.preventDefault && param4.preventDefault(), methodsBody.search());
};
methodsBody.updatePrefs = function (param5) {
  let var35 = ["retrieverefsSelectCollection", "retrieverefsLocateinCollection", "retrieverefsAbstractTranslationBehind"];
  if (!param5) for (let var36 of var35) {
    Zotero.Prefs.set("ai4paper." + var36, document.getElementById("ai4paper." + var36).checked);
  } else for (let var37 of var35) {
    document.getElementById("ai4paper." + var37).checked = Zotero.Prefs.get('ai4paper.' + var37);
  }
  let var38 = ['retrieverefsIFlimit'];
  if (!param5) for (let var39 of var38) {
    Zotero.Prefs.set("ai4paper." + var39, document.getElementById("ai4paper." + var39).value);
  } else for (let var40 of var38) {
    document.getElementById('ai4paper.' + var40).value = Zotero.Prefs.get("ai4paper." + var40);
  }
};
methodsBody.handleCheckboxChange = function (param6) {
  var var41 = param6.checked;
  let var42 = document.getElementById('zotero-selectCiting-intro').textContent;
  if (var42 === "选择要导入的施引文献：0/" + this.io.dataIn.data.length) var41 && (document.getElementById('zotero-selectCiting-intro').textContent = "选择要导入的施引文献：1/" + this.io.dataIn.data.length);else {
    if (var41) {
      let var43 = var42.indexOf("选择要导入的施引文献："),
        var44 = var42.substring(var43 + 0xb);
      var var45 = Number(var44.split('/')[0x0]);
      var45 = var45 + 0x1;
    } else {
      let var46 = var42.indexOf("选择要导入的施引文献："),
        var47 = var42.substring(var46 + 0xb);
      var var45 = Number(var47.split('/')[0x0]);
      var45 = var45 - 0x1;
    }
    document.getElementById("zotero-selectCiting-intro").textContent = "选择要导入的施引文献：" + var45 + '/' + this.io.dataIn.data.length;
  }
};
methodsBody.onIFLimitChange = function () {
  Zotero.Prefs.set("ai4paper.retrieverefsIFlimit", document.getElementById("ai4paper.retrieverefsIFlimit").value);
  methodsBody.updateIFAnalysis();
};
methodsBody.updateIFAnalysis = function () {
  var var48 = document.getElementById('richlistbox-elem');
  for (var var49 = 0x0; var49 < var48.childNodes.length; var49++) {
    var var50 = var48.childNodes[var49];
    let var51 = var50.querySelector('checkbox').getAttribute("label");
    if (var51.indexOf('🆔') != -0x1 && var51.indexOf('🈯') != -0x1) {
      let var52 = var51.indexOf('🈯'),
        var53 = var51.substring(var52 + 0x3).trim();
      var53 && Number(var53) >= Number(Zotero.Prefs.get('ai4paper.retrieverefsIFlimit')) ? var50.style.color = "#ff922b" : var50.style.color = '';
    }
  }
};
methodsBody.all = function () {
  document.getElementById("back2All-button").style.display = "none";
  var var54 = document.getElementById('richlistbox-elem');
  document.getElementById('zotero-search-intro').style.display = "none";
  for (var var55 = 0x0; var55 < var54.childNodes.length; var55++) {
    var var56 = var54.childNodes[var55];
    var56.style.display = '';
  }
};
methodsBody.search = function () {
  var var57 = document.getElementById('richlistbox-elem'),
    var58 = document.getElementById("search-inputBox").value.trim();
  if (var58 === '' && document.getElementById("search-inputBox").placeholder === '') return methodsBody.all(), false;else var58 === '' && document.getElementById("search-inputBox").placeholder != '' && (var58 = document.getElementById("search-inputBox").placeholder, document.getElementById("search-inputBox").value = document.getElementById("search-inputBox").placeholder);
  Zotero.AI4Paper.lastCitingSearchInput = var58;
  var58 = var58.toLowerCase();
  document.getElementById('back2All-button').style.display = '';
  let var59 = 0x0;
  for (var var60 = 0x0; var60 < var57.childNodes.length; var60++) {
    var var61 = var57.childNodes[var60];
    let var62 = var61.querySelector("checkbox").getAttribute('label');
    var62.toLowerCase().indexOf(var58) === -0x1 ? var61.style.display = 'none' : (var61.style.display = '', var59++);
  }
  document.getElementById("zotero-search-intro").style.display = '';
  document.getElementById("zotero-search-intro").textContent = '【' + var58 + "】搜索：查询到【" + var59 + "】篇文献";
};
methodsBody.maxWindowWidth = function () {
  try {
    const var63 = window.screen.width,
      var64 = window.screen.height,
      var65 = window.outerHeight,
      var66 = window.screenY,
      var67 = window.screen.availWidth,
      var68 = window.screen.availLeft || 0x0;
    window.moveTo(var68, var66);
    window.resizeTo(var67, var65);
  } catch (_0x40069e) {
    Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 窗口尺寸调整失败", '出错了！窗口尺寸调整遇到问题。');
  }
};
methodsBody.adjustWindowWidthPercent = function () {
  try {
    let var69 = window.screen.height,
      var70 = parseInt(var69) <= 0x3e8 ? 0.8 : 0.6;
    const var71 = window.outerHeight,
      var72 = window.screenY,
      var73 = window.screen.availWidth,
      var74 = window.screen.availLeft || 0x0,
      var75 = Math.round(var73 * var70),
      var76 = var74 + (var73 - var75) / 0x2;
    window.moveTo(var76, var72);
    window.resizeTo(var75, var71);
  } catch (_0x4137d) {
    Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 窗口尺寸调整失败", '出错了！窗口尺寸调整遇到问题。');
  }
};
methodsBody.buildContextMenu = function (param7, param8) {
  let var77 = document.querySelector("#richlistitem-contextpanel");
  if (!var77) {
    var77 = window.document.createXULElement('panel');
    var77.id = "richlistitem-contextpanel";
    var77.style.width = "500px";
    var77.setAttribute("type", 'arrow');
    document.documentElement.appendChild(var77);
    var77 = document.documentElement.lastElementChild.firstElementChild;
    if (param8) return;
  }
  let var78 = var77.firstElementChild;
  while (var78) {
    var78.remove();
    var78 = var77.firstElementChild;
  }
  let var79 = param7.target.closest("richlistitem")?.["querySelector"]("checkbox")["label"],
    var80 = window.document.createXULElement("vbox");
  var80.style.flex = '1';
  let var81 = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")['matches'],
    var82 = window.document.createXULElement("div");
  var82.textContent = "🪪 基本信息";
  var82.style = "display: flex;justify-content: center;align-items: center;margin-bottom: 12px;border-radius: 5px;background-color: " + (var81 ? "#3e3c3d" : "#fef1e5") + ';color:\x20#fe6e08;padding:\x206px;cursor:\x20pointer;';
  var82.addEventListener("click", _0x8ab26f => {
    methodsBody.viewOnline(var79);
  });
  var80.appendChild(var82);
  let var83 = window.document.createXULElement("div");
  var83.id = "basicInfo_DIV";
  var83.style = "display: flex;border-radius: 6px;box-shadow: 0 0 1px #8a8a8a;padding: 6px;overflow-y: hidden;overflow-x: hidden;word-wrap: break-word;clear: both;white-space: pre-wrap;-ms-word-break:break-all;";
  var83.addEventListener('dblclick', _0x27f391 => {
    let var84 = _0x27f391.target.textContent;
    Zotero.AI4Paper.copy2Clipboard(var84);
  });
  var80.appendChild(var83);
  let var85 = window.document.createXULElement("div");
  var85.textContent = "🕹️ 摘要";
  var85.style = "display: flex;justify-content: center;align-items: center;margin: 12px 0;border-radius: 5px;background-color: " + (var81 ? "#3e3c3d" : "#e6f8e9") + ";color: #2dac3e;padding: 6px;cursor: pointer;";
  var85.addEventListener("click", _0x4b94f8 => {
    methodsBody.viewOnline(var79);
  });
  var80.appendChild(var85);
  let var86 = window.document.createXULElement("div");
  var86.id = "abstract_DIV";
  var86.style.maxHeight = "300px";
  var86.style = "display: flex;border-radius: 6px;box-shadow: 0 0 1px #8a8a8a;padding: 6px;overflow-y: auto;overflow-x: hidden;word-wrap: break-word;clear: both;white-space: pre-wrap;-ms-word-break:break-all;";
  var86.textContent = "联网获取摘要中...";
  var86.addEventListener("dblclick", _0x497916 => {
    let var87 = _0x497916.target.textContent;
    Zotero.AI4Paper.copy2Clipboard(var87);
  });
  var80.appendChild(var86);
  if (var79.includes('🆔')) {
    let var88 = window.document.createXULElement("div");
    var88.id = "connectedPapers_DIV";
    var88.style = "display: flex;justify-content: center;align-items: center;margin-top: 12px;border-radius: 5px;background-color: " + (var81 ? "#3e3c3d" : "#e9f4ff") + ";color: #2c98f7;padding: 5px;cursor: pointer;";
    var88.addEventListener('click', _0x5ce844 => {
      let var89 = Zotero.AI4Paper.extractDOIFromItemInfo(var79);
      Zotero.getMainWindow().ZoteroPane.loadURI("https://connectedpapers.com/api/redirect/doi/" + var89);
    });
    let var90 = window.document.createXULElement("div");
    var90.style = 'cursor:\x20pointer;';
    let var91 = "<svg width=\"16\" height=\"16\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">\n\n\t<!-- Generator: Adobe Illustrator 28.6.0, SVG Export Plug-In . SVG Version: 1.2.0 Build 709)  -->\n\t<g>\n\t<title>Connected Papers</title>\n\t<g id=\"svg_6\">\n\t<g data-name=\"图层_1\" id=\"_图层_1\">\n\t\t<g id=\"svg_7\">\n\t\t<circle fill=\"#57a8a9\" r=\"3\" cy=\"12.7\" cx=\"4.9\" class=\"cls-1\" id=\"svg_1\"/>\n\t\t<circle fill=\"#57a8a9\" r=\"2.2\" cy=\"2.3\" cx=\"10.8\" class=\"cls-1\" id=\"svg_2\"/>\n\t\t<circle fill=\"#57a8a9\" r=\"1.5\" cy=\"9.5\" cx=\"12.7\" class=\"cls-1\" id=\"svg_3\"/>\n\t\t<rect fill=\"#57a8a9\" transform=\"rotate(-14 -1.2 3)\" height=\"6.2\" width=\"0.4\" y=\"6.2\" x=\"10.4\" class=\"cls-1\" id=\"svg_4\"/>\n\t\t<rect fill=\"#57a8a9\" transform=\"rotate(-60 -2.3 10.6)\" height=\"0.4\" width=\"8.7\" y=\"17.7\" x=\"1.4\" class=\"cls-1\" id=\"svg_5\"/>\n\t\t</g>\n\t</g>\n\t</g>\n\t</g>\n\t</svg>";
    var90.innerHTML = var91;
    var88.appendChild(var90);
    let var92 = window.document.createXULElement('label');
    var92.setAttribute("value", "Connected Papers");
    var92.style = "cursor: pointer;";
    var88.appendChild(var92);
    var80.appendChild(var88);
  }
  return var77.appendChild(var80), var77;
};
methodsBody.updatePanel = async function (param9, param10) {
  let var93 = param9.querySelector('#basicInfo_DIV'),
    var94 = param10.target.closest('richlistitem')?.["querySelector"]("checkbox")["label"],
    var95 = var94.indexOf(']');
  if (var95 != -0x1) {
    let var96 = var94.split("🈯️")[0x1];
    var96 && (var96 = "🈯️ " + var96.trim());
    var94 = var94.slice(var95 + 0x2);
    let var97 = var94.indexOf('🆔');
    var97 != -0x1 && (var94 = var94.slice(0x0, var97));
    var96 && (var94 = '' + var94 + var96);
  }
  var93.textContent = var94;
  let var98 = param9.querySelector("#abstract_DIV"),
    var99 = param10.target.closest("richlistitem").getAttribute("abstractInfo");
  if (var99) var98.textContent = var99;else {
    var94 = param10.target.closest("richlistitem")?.["querySelector"]("checkbox")["label"];
    if (var94.indexOf('🆔') != -0x1) {
      let var100 = Zotero.AI4Paper.extractDOIFromItemInfo(var94),
        var101 = [];
      Zotero.AI4Paper._data_fetchAbstractErrors = [];
      await Zotero.AI4Paper.fetchAbstractFromSemanticScholarAndCrossRef(var100, ['fetchAbstractFromCrossRef'], var101);
      let var102 = var101[0x0],
        var103 = '';
      if (var102 && var102 != 'fetchAbstract\x20error') var103 = var102;else var102 === 'fetchAbstract\x20error' ? var103 = "🆔 " + var100 + "\n\n❌ 请求摘要时发生错误！\n\n" + String(Zotero.AI4Paper._data_fetchAbstractErrors) : var103 = "🆔 " + var100 + '\x0a\x0a😫\x20在【CrossRef】数据库中无摘要信息！';
      var98.textContent = methodsBody.formatAbstract(var103);
    } else var98.textContent = '无\x20🆔\x20信息，无法抓取摘要。';
  }
  var98.style.height = "auto";
  var98.style.height = Math.min(var98.scrollHeight, 0x12c) + 'px';
  await methodsBody.translateAbstract(var98);
};
methodsBody.translateAbstract = async function (param11) {
  let var104 = param11.textContent;
  if (var104 && !var104.includes('🆔')) {
    let var105 = await Zotero.AI4Paper.volcanoFree_transAbstractInPanel(var104);
    var105 && (Zotero.Prefs.get('ai4paper.retrieverefsAbstractTranslationBehind') ? param11.textContent = var104 + '\x0a\x0a🎈【摘要翻译】' + var105 : param11.textContent = '🎈【摘要翻译】' + var105 + "\n\n🍋【摘要原文】" + var104, param11.style.height = "auto", param11.style.height = Math.min(param11.scrollHeight, 0x12c) + 'px');
  }
};
methodsBody.extractInfoAndAbstract = function (param12) {
  let var106 = param12,
    var107 = '';
  return param12 && (var106 = param12.split("{{abstractByZoteroOne}}")[0x0], var107 = param12.split("{{abstractByZoteroOne}}")[0x1], var107 = var107 ? methodsBody.formatAbstract(var107) : ''), {
    'info': var106,
    'abstract': var107
  };
};
methodsBody.formatAbstract = function (param13) {
  return param13 && (param13 = param13.replace("<jats:p>", '').replace('<jats:title>', '').replace("</jats:p>", '').replace("</jats:title>", '').replace("<jats:title>Abstract</jats:title>", '').replace("<jats:p>Abstract</jats:p>", '')), param13;
};
methodsBody.viewOnline = function (param14) {
  if (param14.includes('🆔')) {
    let var108 = Zotero.AI4Paper.extractDOIFromItemInfo(param14);
    Zotero.getMainWindow().ZoteroPane.loadURI("https://doi.org/" + var108);
  }
};
methodsBody.registerScrollListener = function () {
  const var109 = document.getElementById("richlistbox-elem");
  let var110;
  var109.addEventListener('scroll', _0x1eaf9e => {
    clearTimeout(var110);
    var110 = setTimeout(() => {
      methodsBody.saveScrollPosition(_0x1eaf9e.target);
    }, 0x64);
  });
};
methodsBody.saveScrollPosition = function (param15) {
  methodsBody.io.dataIn.item._citingRef_richlistbox_scrollTop = param15.scrollTop;
};
methodsBody.restoreScrollPosition = function () {
  let var111 = methodsBody.io.dataIn.item;
  if (var111._citingRef_richlistbox_scrollTop) {
    const var112 = document.getElementById("richlistbox-elem");
    setTimeout(() => {
      var112.scrollTo({
        'top': var111._citingRef_richlistbox_scrollTop,
        'behavior': "smooth"
      });
    }, 0x12c);
  }
};
methodsBody.scrollToTopOrBottom = function (param16) {
  const var113 = document.getElementById("richlistbox-elem");
  setTimeout(() => {
    var113.scrollTo({
      'top': param16 ? var113.scrollHeight : 0x0,
      'behavior': "smooth"
    });
  }, 0xa);
};
methodsBody.aiAnalysis = function () {
  let var114 = Zotero.AI4Paper.getRefsJSON4AIAnalysis(methodsBody.io.dataIn.item, "citing");
  if (var114) {
    window.close();
    let var115 = "下面是一篇名为\"" + methodsBody.io.dataIn.item.getField("title") + "\"论文及其引文（即引用过本论文的文献）的结构化数据，现在我希望你深度分析引文情况及其与当前论文的联系。至少包括以下几个方面：\n\t\t\n1. 引文发表期刊的特征？\n2. 引文发表年份的特征？根据特征，分析研究的高峰期。\n3. 引文作者的特征？\n4. 引文的影响因子（impactFactor）情况？\n5. 根据【本论文及所有引文】的标题和摘要，分析研究趋势，特别是近些年的研究热点变化。\n6. 从【本论文及所有引文】的标题和摘要中提取一些关键词（Keywords），以尽可能体现这些文献的主要研究焦点。\n\n分析时，请尽量详实，适当用一些表格来呈现分析结果，并用 Markdown 形式给我。\n\n论文及其引文的结构化数据如下：\n\n" + var114,
      var116 = Zotero.AI4Paper.gptReaderSidePane_setMessageInput(var115);
    var116 && Zotero.AI4Paper.showProgressWindow(0x1388, '【Zotero\x20One】AI\x20分析参考文献', "【施引文献的 JSON 结构化数据】及【默认提示词】，已经填充至 GPT 侧边栏。现在，请自行选择合适的 AI 模型，并执行分析！");
  }
};