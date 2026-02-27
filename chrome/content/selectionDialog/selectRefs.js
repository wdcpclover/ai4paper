var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  Zotero.ZoteroIF.lastRefsSearchInput && (document.getElementById('search-inputBox').placeholder = Zotero.ZoteroIF.lastRefsSearchInput);
  methodsBody.buildContextMenu(null, true);
  document.getElementById("search-inputBox").focus();
  methodsBody.updatePrefs(true);
  this.io = window.arguments[0x0];
  document.getElementById("zotero-selectRefs-intro").textContent = "选择要导入的参考文献：0/" + this.io.dataIn.data.length;
  methodsBody.resetProgressRing();
  methodsBody.buildItemNodes(this.io.dataIn.data);
};
methodsBody.resetProgressRing = function () {
  const var1 = document.querySelector(".progress-ring"),
    var2 = 0x2 * Math.PI * 0x2d;
  var1.setAttribute("stroke-dasharray", var2);
  var1.setAttribute('stroke-dashoffset', var2);
  setTimeout(function () {
    var1.classList.add('animate');
  }, 0x32);
};
methodsBody.buildItemNodes = function (param1) {
  let var3 = methodsBody.io.dataIn.item;
  Zotero.ZoteroIF._isDuplicatedArray = JSON.parse(var3._references_isDuplicated);
  var var4 = document.getElementById('richlistbox-elem');
  for (var var5 in param1) {
    var var6 = param1[var5],
      var7,
      var8 = false;
    var6 && typeof var6 == "object" && var6.title !== undefined ? (var7 = var6.title, var8 = !!var6.checked) : var7 = var6;
    let var9 = document.createXULElement("richlistitem"),
      var10 = document.createXULElement('checkbox');
    var9.setAttribute('tooltiptext', var7);
    var9.style.fontSize = "14px";
    var9.style.whiteSpace = "nowrap";
    var10.checked = var8;
    var10.label = var7;
    var10.setAttribute("native", 'true');
    var9.setAttribute("value", var5);
    var9.append(var10);
    let var11 = document.createXULElement("div");
    var11.classList.add("document-icon");
    var11.style.width = '16px';
    var11.style.height = "16px";
    var11.style.marginRight = "5px";
    var11.style.marginLeft = "5px";
    var11.style.transition = "transform 0.125s ease";
    var11.innerHTML = Zotero.ZoteroIF.svg_icon_16px.document;
    var3._hasRefsCache && Zotero.ZoteroIF._isDuplicatedArray[var5]._isDuplicated === true && (var11.setAttribute("tooltiptext", "点击显示"), var11.innerHTML = Zotero.ZoteroIF.svg_icon_16px.document_active, var11.setAttribute("_itemID", Zotero.ZoteroIF._isDuplicatedArray[var5]._itemID), var11.addEventListener("mouseover", () => {
      var11.style.transform = "scale(1.15)";
    }), var11.addEventListener('mouseout', () => {
      var11.style.transform = 'scale(1)';
    }), var11.addEventListener('click', function () {
      methodsBody.showInMyLibrary(this);
    }));
    var9.prepend(var11);
    if (var7.indexOf('🆔') === -0x1) var9.style.color = 'red';else {
      if (var7.indexOf('🆔') != -0x1 && var7.indexOf("🈯️") != -0x1) {
        let var12 = var7.indexOf('🈯️'),
          var13 = var7.substring(var12 + 0x3).trim();
        var13 && Number(var13) >= Number(Zotero.Prefs.get("zoteroif.retrieverefsIFlimit")) && (var9.style.color = "#ff922b");
      }
    }
    var9.addEventListener("click", _0x442314 => {
      if (_0x442314.button === 0x2) {
        let var14 = methodsBody.buildContextMenu(_0x442314);
        var14 && (var14.openPopup(var9, "after_start", 0x46, 0x0, false, false), methodsBody.updatePanel(var14, _0x442314));
        return;
      }
      _0x442314.target == var9 && (var10.checked = !var10.checked);
      methodsBody.handleCheckboxChange(var10);
      _0x442314.shiftKey && methodsBody.viewOnline(_0x442314.target.closest('richlistitem').querySelector("checkbox").label);
    });
    var4.append(var9);
  }
  var4.itemCount === 0x1 && (var4.getItemAtIndex(0x0).querySelector("checkbox").checked = true);
  methodsBody.registerScrollListener();
  methodsBody.restoreScrollPosition();
  !var3._hasRefsCache && methodsBody.updateDuplicate();
  Zotero.ZoteroIF.fetchAndDisplayRealtime(var3);
};
methodsBody.updateDuplicate = async function () {
  let var15 = methodsBody.io.dataIn.item;
  var var16 = document.getElementById("richlistbox-elem");
  let var17 = var15._references_DOI.split('🍋🎈🍋'),
    var18 = JSON.parse(var15._references_isDuplicated);
  for (let var19 = 0x0; var19 < var16.childNodes.length; var19++) {
    let var20 = var16.childNodes[var19].querySelector(".document-icon");
    if (var17[var19] != "DOI-null") {
      let var21 = await Zotero.ZoteroIF.checkDOIDuplicateJournalArt(var17[var19]);
      var21 && (var20.setAttribute('tooltiptext', "点击显示"), var20.innerHTML = Zotero.ZoteroIF.svg_icon_16px.document_active, var20.setAttribute("_itemID", var21.itemID), var20.addEventListener("mouseover", () => {
        var20.style.transform = "scale(1.15)";
      }), var20.addEventListener("mouseout", () => {
        var20.style.transform = "scale(1)";
      }), var20.addEventListener('click', function () {
        methodsBody.showInMyLibrary(this);
      }), var18[var19] = {
        '_isDuplicated': true,
        '_itemID': var21.itemID
      }, var15._references_isDuplicated = JSON.stringify(var18));
    }
  }
};
methodsBody.showInMyLibrary = async function (param2) {
  let var22 = Number(param2.getAttribute("_itemID"));
  if (var22 === -0x1) return Zotero.ZoteroIF.showProgressWindow(0xfa0, "❌ 出错了", '条目\x20🆔\x20有误！'), false;
  let var23 = Zotero.Items.get(var22);
  window.close();
  try {
    let var24 = var23.getCollections();
    if (var24.length) {
      Zotero.ZoteroIF.getGlobal("Zotero_Tabs").select("zotero-pane");
      let var25 = var24[0x0];
      Zotero.ZoteroIF.getGlobal("ZoteroPane_Local").collectionsView.selectCollection(var25);
      let var26 = await Zotero.ZoteroIF.getGlobal("ZoteroPane_Local").selectItem(var22);
      var26 === false && Zotero.ZoteroIF.showProgressWindow(0xfa0, "未找到到该文献", "未在【我的文库】找到该文献，可能已经被您删除！");
    } else {
      Zotero.ZoteroIF.getGlobal('Zotero_Tabs').select("zotero-pane");
      let var27 = await Zotero.ZoteroIF.getGlobal('ZoteroPane_Local').selectItem(var22);
      var27 === false && Zotero.ZoteroIF.showProgressWindow(0xfa0, "未找到到该文献", '未在【我的文库】找到该文献，可能已经被您删除！');
    }
  } catch (_0x56d86f) {
    return false;
  }
};
methodsBody.selectAll = function (param3) {
  var var28 = document.getElementById("richlistbox-elem");
  let var29 = 0x0;
  for (var var30 = 0x0; var30 < var28.childNodes.length; var30++) {
    var28.childNodes[var30].querySelector("checkbox").checked = !param3;
    !param3 && var28.childNodes[var30].style.display === "none" && (var28.childNodes[var30].querySelector('checkbox').checked = false, var29++);
  }
  param3 ? document.getElementById("zotero-selectRefs-intro").textContent = "选择要导入的参考文献：0/" + this.io.dataIn.data.length : document.getElementById("zotero-selectRefs-intro").textContent = '选择要导入的参考文献：' + (this.io.dataIn.data.length - var29) + '/' + this.io.dataIn.data.length;
};
methodsBody.acceptSelection = function () {
  var var31 = document.getElementById('richlistbox-elem'),
    var32 = false;
  this.io.dataOut = new Object();
  for (var var33 = 0x0; var33 < var31.childNodes.length; var33++) {
    var var34 = var31.childNodes[var33];
    var34.querySelector('checkbox').checked && (this.io.dataOut[var34.getAttribute('value')] = var34.querySelector("checkbox").getAttribute("label"), var32 = true);
  }
  if (!var32) this.io.dataOut = null;
};
methodsBody.checkKeyEnter = function (param4) {
  !param4.shiftKey && !param4.ctrlKey && !param4.altKey && !param4.metaKey && param4.keyCode === 0xd && (param4.returnValue = false, param4.preventDefault && param4.preventDefault(), methodsBody.search());
};
methodsBody.updatePrefs = function (param5) {
  let var35 = ["retrieverefsSelectCollection", 'retrieverefsLocateinCollection', "retrieverefsAbstractTranslationBehind"];
  if (!param5) for (let var36 of var35) {
    Zotero.Prefs.set("zoteroif." + var36, document.getElementById('zoteroif.' + var36).checked);
  } else for (let var37 of var35) {
    document.getElementById("zoteroif." + var37).checked = Zotero.Prefs.get('zoteroif.' + var37);
  }
  let var38 = ["retrieverefsIFlimit"];
  if (!param5) for (let var39 of var38) {
    Zotero.Prefs.set("zoteroif." + var39, document.getElementById("zoteroif." + var39).value);
  } else for (let var40 of var38) {
    document.getElementById("zoteroif." + var40).value = Zotero.Prefs.get("zoteroif." + var40);
  }
};
methodsBody.handleCheckboxChange = function (param6) {
  var var41 = param6.checked;
  let var42 = document.getElementById("zotero-selectRefs-intro").textContent;
  if (var42 === "选择要导入的参考文献：0/" + this.io.dataIn.data.length) var41 && (document.getElementById("zotero-selectRefs-intro").textContent = "选择要导入的参考文献：1/" + this.io.dataIn.data.length);else {
    if (var41) {
      let var43 = var42.indexOf("选择要导入的参考文献："),
        var44 = var42.substring(var43 + 0xb);
      var var45 = Number(var44.split('/')[0x0]);
      var45 = var45 + 0x1;
    } else {
      let var46 = var42.indexOf("选择要导入的参考文献："),
        var47 = var42.substring(var46 + 0xb);
      var var45 = Number(var47.split('/')[0x0]);
      var45 = var45 - 0x1;
    }
    document.getElementById('zotero-selectRefs-intro').textContent = '选择要导入的参考文献：' + var45 + '/' + this.io.dataIn.data.length;
  }
};
methodsBody.onIFLimitChange = function () {
  Zotero.Prefs.set("zoteroif.retrieverefsIFlimit", document.getElementById("zoteroif.retrieverefsIFlimit").value);
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
      var53 && Number(var53) >= Number(Zotero.Prefs.get('zoteroif.retrieverefsIFlimit')) ? var50.style.color = "#ff922b" : var50.style.color = '';
    }
  }
};
methodsBody.all = function () {
  document.getElementById("back2All-button").style.display = 'none';
  var var54 = document.getElementById("richlistbox-elem");
  document.getElementById("zotero-search-intro").style.display = "none";
  for (var var55 = 0x0; var55 < var54.childNodes.length; var55++) {
    var var56 = var54.childNodes[var55];
    var56.style.display = '';
  }
};
methodsBody.search = function () {
  var var57 = document.getElementById("richlistbox-elem"),
    var58 = document.getElementById("search-inputBox").value.trim();
  if (var58 === '' && document.getElementById("search-inputBox").placeholder === '') return methodsBody.all(), false;else var58 === '' && document.getElementById('search-inputBox').placeholder != '' && (var58 = document.getElementById('search-inputBox').placeholder, document.getElementById("search-inputBox").value = document.getElementById("search-inputBox").placeholder);
  Zotero.ZoteroIF.lastRefsSearchInput = var58;
  var58 = var58.toLowerCase();
  document.getElementById("back2All-button").style.display = '';
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
  } catch (_0x2b1b28) {
    Zotero.ZoteroIF.showProgressWindow(0xbb8, '❌\x20窗口尺寸调整失败', "出错了！窗口尺寸调整遇到问题。");
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
  } catch (_0x545e60) {
    Zotero.ZoteroIF.showProgressWindow(0xbb8, "❌ 窗口尺寸调整失败", "出错了！窗口尺寸调整遇到问题。");
  }
};
methodsBody.copyPreview = function () {
  let var77 = document.getElementById("preview-div").textContent;
  Zotero.ZoteroIF.copy2Clipboard(var77);
  !var77 ? Zotero.ZoteroIF.showProgressWindow(0xbb8, "温馨提示", "当前预览为空，双击条目后可生成预览！") : Zotero.ZoteroIF.showProgressWindow(0x7d0, "✅ 拷贝预览", "成功拷贝预览至剪切板！");
};
methodsBody.buildContextMenu = function (param7, param8) {
  let var78 = document.querySelector("#richlistitem-contextpanel");
  if (!var78) {
    var78 = window.document.createXULElement("panel");
    var78.id = 'richlistitem-contextpanel';
    var78.style.width = "500px";
    var78.setAttribute('type', "arrow");
    document.documentElement.appendChild(var78);
    var78 = document.documentElement.lastElementChild.firstElementChild;
    if (param8) return;
  }
  let var79 = var78.firstElementChild;
  while (var79) {
    var79.remove();
    var79 = var78.firstElementChild;
  }
  let var80 = param7.target.closest('richlistitem')?.["querySelector"]("checkbox")["label"],
    var81 = window.document.createXULElement('vbox');
  var81.style.flex = '1';
  let var82 = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")["matches"],
    var83 = window.document.createXULElement("div");
  var83.textContent = "🪪 基本信息";
  var83.style = "display: flex;justify-content: center;align-items: center;margin-bottom: 12px;border-radius: 5px;background-color: " + (var82 ? "#3e3c3d" : '#fef1e5') + ';color:\x20#fe6e08;padding:\x206px;cursor:\x20pointer;';
  var83.addEventListener('click', _0x4e474e => {
    methodsBody.viewOnline(var80);
  });
  var81.appendChild(var83);
  let var84 = window.document.createXULElement('div');
  var84.id = "basicInfo_DIV";
  var84.style = "display: flex;border-radius: 6px;box-shadow: 0 0 1px #8a8a8a;padding: 6px;overflow-y: hidden;overflow-x: hidden;word-wrap: break-word;clear: both;white-space: pre-wrap;-ms-word-break:break-all;";
  var84.addEventListener("dblclick", _0x2a081c => {
    let var85 = _0x2a081c.target.textContent;
    Zotero.ZoteroIF.copy2Clipboard(var85);
  });
  var81.appendChild(var84);
  let var86 = window.document.createXULElement("div");
  var86.textContent = "🕹️ 摘要";
  var86.style = "display: flex;justify-content: center;align-items: center;margin: 12px 0;border-radius: 5px;background-color: " + (var82 ? '#3e3c3d' : "#e6f8e9") + ";color: #2dac3e;padding: 6px;cursor: pointer;";
  var86.addEventListener("click", _0x21835b => {
    methodsBody.viewOnline(var80);
  });
  var81.appendChild(var86);
  let var87 = window.document.createXULElement("div");
  var87.id = "abstract_DIV";
  var87.style.maxHeight = "300px";
  var87.style = 'display:\x20flex;border-radius:\x206px;box-shadow:\x200\x200\x201px\x20#8a8a8a;padding:\x206px;overflow-y:\x20auto;overflow-x:\x20hidden;word-wrap:\x20break-word;clear:\x20both;white-space:\x20pre-wrap;-ms-word-break:break-all;';
  var87.textContent = '联网获取摘要中...';
  var87.addEventListener('dblclick', _0x356746 => {
    let var88 = _0x356746.target.textContent;
    Zotero.ZoteroIF.copy2Clipboard(var88);
  });
  var81.appendChild(var87);
  if (var80.includes('🆔')) {
    let var89 = window.document.createXULElement("div");
    var89.id = "connectedPapers_DIV";
    var89.style = 'display:\x20flex;justify-content:\x20center;align-items:\x20center;margin-top:\x2012px;border-radius:\x205px;background-color:\x20' + (var82 ? "#3e3c3d" : "#e9f4ff") + ";color: #2c98f7;padding: 5px;cursor: pointer;";
    var89.addEventListener('click', _0xd09c77 => {
      let var90 = Zotero.ZoteroIF.extractDOIFromItemInfo(var80);
      Zotero.getMainWindow().ZoteroPane.loadURI("https://connectedpapers.com/api/redirect/doi/" + var90);
    });
    let var91 = window.document.createXULElement("div");
    var91.style = "cursor: pointer;";
    let var92 = '<svg\x20width=\x2216\x22\x20height=\x2216\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20version=\x221.1\x22>\x0a\x0a\x09<!--\x20Generator:\x20Adobe\x20Illustrator\x2028.6.0,\x20SVG\x20Export\x20Plug-In\x20.\x20SVG\x20Version:\x201.2.0\x20Build\x20709)\x20\x20-->\x0a\x09<g>\x0a\x09<title>Connected\x20Papers</title>\x0a\x09<g\x20id=\x22svg_6\x22>\x0a\x09<g\x20data-name=\x22图层_1\x22\x20id=\x22_图层_1\x22>\x0a\x09\x09<g\x20id=\x22svg_7\x22>\x0a\x09\x09<circle\x20fill=\x22#57a8a9\x22\x20r=\x223\x22\x20cy=\x2212.7\x22\x20cx=\x224.9\x22\x20class=\x22cls-1\x22\x20id=\x22svg_1\x22/>\x0a\x09\x09<circle\x20fill=\x22#57a8a9\x22\x20r=\x222.2\x22\x20cy=\x222.3\x22\x20cx=\x2210.8\x22\x20class=\x22cls-1\x22\x20id=\x22svg_2\x22/>\x0a\x09\x09<circle\x20fill=\x22#57a8a9\x22\x20r=\x221.5\x22\x20cy=\x229.5\x22\x20cx=\x2212.7\x22\x20class=\x22cls-1\x22\x20id=\x22svg_3\x22/>\x0a\x09\x09<rect\x20fill=\x22#57a8a9\x22\x20transform=\x22rotate(-14\x20-1.2\x203)\x22\x20height=\x226.2\x22\x20width=\x220.4\x22\x20y=\x226.2\x22\x20x=\x2210.4\x22\x20class=\x22cls-1\x22\x20id=\x22svg_4\x22/>\x0a\x09\x09<rect\x20fill=\x22#57a8a9\x22\x20transform=\x22rotate(-60\x20-2.3\x2010.6)\x22\x20height=\x220.4\x22\x20width=\x228.7\x22\x20y=\x2217.7\x22\x20x=\x221.4\x22\x20class=\x22cls-1\x22\x20id=\x22svg_5\x22/>\x0a\x09\x09</g>\x0a\x09</g>\x0a\x09</g>\x0a\x09</g>\x0a\x09</svg>';
    var91.innerHTML = var92;
    var89.appendChild(var91);
    let var93 = window.document.createXULElement("label");
    var93.setAttribute("value", 'Connected\x20Papers');
    var93.style = 'cursor:\x20pointer;';
    var89.appendChild(var93);
    var81.appendChild(var89);
  }
  return var78.appendChild(var81), var78;
};
methodsBody.updatePanel = async function (param9, param10) {
  let var94 = param9.querySelector("#basicInfo_DIV"),
    var95 = param10.target.closest('richlistitem')?.['querySelector']("checkbox")["label"],
    var96 = var95.indexOf(']');
  if (var96 != -0x1) {
    let var97 = var95.split("🈯️")[0x1];
    var97 && (var97 = " 🈯️ " + var97.trim());
    var95 = var95.slice(var96 + 0x2);
    let var98 = var95.indexOf('🆔');
    var98 != -0x1 && (var95 = var95.slice(0x0, var98));
    var97 && (var95 = '' + var95 + var97);
  }
  var94.textContent = var95;
  var95 = param10.target.closest("richlistitem")?.['querySelector']("checkbox")["label"];
  if (var95.includes('🆔') && var95.includes("Title-null")) {
    let var99 = Zotero.ZoteroIF.extractDOIFromItemInfo(var95),
      var100 = await Zotero.ZoteroIF.fetchItemDetails(var99);
    var100.title != "fetchTitle-error" && (var94.textContent = Zotero.ZoteroIF.formatSingleItemInfo(var100));
  }
  let var101 = param9.querySelector("#abstract_DIV");
  var95 = param10.target.closest("richlistitem")?.["querySelector"]("checkbox")["label"];
  if (var95.indexOf('🆔') != -0x1) {
    let var102 = Zotero.ZoteroIF.extractDOIFromItemInfo(var95),
      var103 = [];
    Zotero.ZoteroIF._data_fetchAbstractErrors = [];
    await Zotero.ZoteroIF.fetchAbstractFromSemanticScholarAndCrossRef(var102, ["fetchAbstractFromSemanticScholar", "fetchAbstractFromCrossRef"], var103);
    let var104 = var103[0x0],
      var105 = var103[0x1],
      var106 = '';
    if (var104 && var104 != "fetchAbstract error") var106 = var104;else {
      if (var105 && var105 != "fetchAbstract error") var106 = var105;else var104 === "fetchAbstract error" || var105 === "fetchAbstract error" ? var106 = "🆔 " + var102 + "\n\n❌ 请求摘要时发生错误！【常见错误码含义】见：https://www.yuque.com/qnscholar/zotero-one/ho8yw7ookhod8evw?singleDoc \n\n" + String(Zotero.ZoteroIF._data_fetchAbstractErrors) : var106 = "🆔 " + var102 + "\n\n😫 在【Semantic Scholar】和【CrossRef】数据库中均无摘要信息！";
    }
    var101.textContent = methodsBody.formatAbstract(var106);
  } else var101.textContent = "无 🆔 信息，无法抓取摘要。";
  var101.style.height = "auto";
  var101.style.height = Math.min(var101.scrollHeight, 0x12c) + 'px';
  await methodsBody.translateAbstract(var101);
};
methodsBody.translateAbstract = async function (param11) {
  let var107 = param11.textContent;
  if (var107 && !var107.includes('🆔')) {
    let var108 = await Zotero.ZoteroIF.volcanoFree_transAbstractInPanel(var107);
    var108 && (Zotero.Prefs.get('zoteroif.retrieverefsAbstractTranslationBehind') ? param11.textContent = var107 + "\n\n🎈【摘要翻译】" + var108 : param11.textContent = '🎈【摘要翻译】' + var108 + "\n\n🍋【摘要原文】" + var107, param11.style.height = "auto", param11.style.height = Math.min(param11.scrollHeight, 0x12c) + 'px');
  }
};
methodsBody.formatAbstract = function (param12) {
  return param12 && (param12 = param12.replace("<jats:p>", '').replace("<jats:title>", '').replace("</jats:p>", '').replace("</jats:title>", '').replace('<jats:title>Abstract</jats:title>', '').replace('<jats:p>Abstract</jats:p>', '')), param12;
};
methodsBody.viewOnline = function (param13) {
  if (param13.includes('🆔')) {
    let var109 = Zotero.ZoteroIF.extractDOIFromItemInfo(param13);
    Zotero.getMainWindow().ZoteroPane.loadURI("https://doi.org/" + var109);
  }
};
methodsBody.registerScrollListener = function () {
  const var110 = document.getElementById("richlistbox-elem");
  let var111;
  var110.addEventListener("scroll", _0x2eb778 => {
    clearTimeout(var111);
    var111 = setTimeout(() => {
      methodsBody.saveScrollPosition(_0x2eb778.target);
    }, 0x64);
  });
};
methodsBody.saveScrollPosition = function (param14) {
  methodsBody.io.dataIn.item._citedRef_richlistbox_scrollTop = param14.scrollTop;
};
methodsBody.restoreScrollPosition = function () {
  let var112 = methodsBody.io.dataIn.item;
  if (var112._citedRef_richlistbox_scrollTop) {
    const var113 = document.getElementById("richlistbox-elem");
    setTimeout(() => {
      var113.scrollTo({
        'top': var112._citedRef_richlistbox_scrollTop,
        'behavior': "smooth"
      });
    }, 0x12c);
  }
};
methodsBody.scrollToPosition = function () {
  let var114 = document.querySelector(".progress-ring").scrollPercent;
  if (var114) {
    const var115 = document.getElementById("richlistbox-elem");
    setTimeout(() => {
      var115.scrollTo({
        'top': parseInt(var114 / 0x64 * var115.scrollHeight),
        'behavior': "smooth"
      });
    }, 0xa);
  }
};
methodsBody.scrollToTopOrBottom = function (param15) {
  const var116 = document.getElementById('richlistbox-elem');
  setTimeout(() => {
    var116.scrollTo({
      'top': param15 ? var116.scrollHeight : 0x0,
      'behavior': "smooth"
    });
  }, 0xa);
};
methodsBody.aiAnalysis = function () {
  if (!document.querySelector(".checkmark").classList.contains("show")) {
    Zotero.ZoteroIF.showProgressWindow(0xbb8, "【AI4paper】AI 分析参考文献", "❌ 请等待详情加载完成后，再执行 AI 分析！");
    return;
  }
  let var117 = Zotero.ZoteroIF.getRefsJSON4AIAnalysis(methodsBody.io.dataIn.item, 'cited');
  if (var117) {
    window.close();
    let var118 = "下面是一篇名为\"" + methodsBody.io.dataIn.item.getField("title") + "\"论文及其参考文献的结构化数据，现在我希望你深度分析参考文献情况及其与当前论文的联系。至少包括以下几个方面：\n\t\t\n1. 参考文献发表期刊的特征？\n2. 参考文献发表年份的特征？根据特征，分析研究的高峰期。\n3. 参考文献作者的特征？\n4. 参考文献的影响因子（impactFactor）情况？\n5. 从本论文及所有参考文献标题中提取一些典型关键词（Keywords），以尽可能体现这些文献的主要研究焦点。\n\n分析时，请尽量详实，适当用一些表格来呈现分析结果，并用 Markdown 形式给我。\n\n论文及其参考文献的结构化数据如下：\n\n" + var117,
      var119 = Zotero.ZoteroIF.gptReaderSidePane_setMessageInput(var118);
    var119 && Zotero.ZoteroIF.showProgressWindow(0x1388, "【AI4paper】AI 分析参考文献", "【参考文献的 JSON 结构化数据】及【默认提示词】，已经填充至 GPT 侧边栏。现在，请自行选择合适的 AI 模型，并执行分析！");
  }
};