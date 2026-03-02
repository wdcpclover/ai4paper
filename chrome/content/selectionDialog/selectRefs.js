var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  Zotero.AI4Paper.lastRefsSearchInput && (document.getElementById('search-inputBox').placeholder = Zotero.AI4Paper.lastRefsSearchInput);
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
  Zotero.AI4Paper._isDuplicatedArray = JSON.parse(var3._references_isDuplicated);
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
    var11.innerHTML = Zotero.AI4Paper.svg_icon_16px.document;
    var3._hasRefsCache && Zotero.AI4Paper._isDuplicatedArray[var5]._isDuplicated === true && (var11.setAttribute("tooltiptext", "点击显示"), var11.innerHTML = Zotero.AI4Paper.svg_icon_16px.document_active, var11.setAttribute("_itemID", Zotero.AI4Paper._isDuplicatedArray[var5]._itemID), var11.addEventListener("mouseover", () => {
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
        var13 && Number(var13) >= Number(Zotero.Prefs.get("ai4paper.retrieverefsIFlimit")) && (var9.style.color = "#ff922b");
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
  Zotero.AI4Paper.fetchAndDisplayRealtime(var3);
};
methodsBody.updateDuplicate = async function () {
  let var15 = methodsBody.io.dataIn.item;
  var var16 = document.getElementById("richlistbox-elem");
  let var17 = var15._references_DOI.split('🍋🎈🍋'),
    var18 = JSON.parse(var15._references_isDuplicated);
  for (let var19 = 0x0; var19 < var16.childNodes.length; var19++) {
    let var20 = var16.childNodes[var19].querySelector(".document-icon");
    if (var17[var19] != "DOI-null") {
      let var21 = await Zotero.AI4Paper.checkDOIDuplicateJournalArt(var17[var19]);
      var21 && (var20.setAttribute('tooltiptext', "点击显示"), var20.innerHTML = Zotero.AI4Paper.svg_icon_16px.document_active, var20.setAttribute("_itemID", var21.itemID), var20.addEventListener("mouseover", () => {
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
methodsBody.showInMyLibrary = function (param2) {
  return Zotero.AI4Paper.DialogUtils.showInMyLibrary(param2);
};
methodsBody.selectAll = function (param3) {
  let skipped = Zotero.AI4Paper.DialogUtils.selectAll('richlistbox-elem', param3, { skipHidden: true });
  param3 ? document.getElementById("zotero-selectRefs-intro").textContent = "选择要导入的参考文献：0/" + this.io.dataIn.data.length : document.getElementById("zotero-selectRefs-intro").textContent = '选择要导入的参考文献：' + (this.io.dataIn.data.length - skipped) + '/' + this.io.dataIn.data.length;
};
methodsBody.acceptSelection = function () {
  let items = Zotero.AI4Paper.DialogUtils.getCheckedItems('richlistbox-elem');
  if (items.length) {
    this.io.dataOut = new Object();
    for (let item of items) {
      this.io.dataOut[item.value] = item.label;
    }
  } else {
    this.io.dataOut = null;
  }
};
methodsBody.checkKeyEnter = function (param4) {
  Zotero.AI4Paper.DialogUtils.checkKeyEnter(param4, () => methodsBody.search());
};
methodsBody.updatePrefs = function (param5) {
  Zotero.AI4Paper.DialogUtils.syncPrefsCheckboxes({
    checkboxKeys: ['retrieverefsSelectCollection', 'retrieverefsLocateinCollection', 'retrieverefsAbstractTranslationBehind'],
    inputKeys: ['retrieverefsIFlimit']
  }, param5);
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
  Zotero.AI4Paper.DialogUtils.showAllRichlistboxItems('richlistbox-elem', {
    backButtonId: 'back2All-button',
    searchResultId: 'zotero-search-intro'
  });
};
methodsBody.search = function () {
  Zotero.AI4Paper.DialogUtils.searchRichlistbox('richlistbox-elem', 'search-inputBox', {
    lastSearchKey: 'lastRefsSearchInput',
    searchResultId: 'zotero-search-intro',
    backButtonId: 'back2All-button',
    showAll: methodsBody.all
  });
};
methodsBody.maxWindowWidth = function () {
  Zotero.AI4Paper.DialogUtils.maxWindowWidth();
};
methodsBody.adjustWindowWidthPercent = function () {
  Zotero.AI4Paper.DialogUtils.adjustWindowWidthPercent();
};
methodsBody.copyPreview = function () {
  let var77 = document.getElementById("preview-div").textContent;
  Zotero.AI4Paper.copy2Clipboard(var77);
  !var77 ? Zotero.AI4Paper.showProgressWindow(0xbb8, "温馨提示", "当前预览为空，双击条目后可生成预览！") : Zotero.AI4Paper.showProgressWindow(0x7d0, "✅ 拷贝预览", "成功拷贝预览至剪切板！");
};
methodsBody.buildContextMenu = function (param7, param8) {
  let panel = Zotero.AI4Paper.DialogUtils.initContextPanel('richlistitem-contextpanel', { width: '500px' }, param8);
  if (param8 && !panel) return;
  if (!panel) return;
  let label = param7.target.closest('richlistitem')?.querySelector('checkbox').label;
  return Zotero.AI4Paper.DialogUtils.buildRefsInfoPanel(panel, label, {
    onViewOnline: methodsBody.viewOnline
  });
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
    let var99 = Zotero.AI4Paper.extractDOIFromItemInfo(var95),
      var100 = await Zotero.AI4Paper.fetchItemDetails(var99);
    var100.title != "fetchTitle-error" && (var94.textContent = Zotero.AI4Paper.formatSingleItemInfo(var100));
  }
  let var101 = param9.querySelector("#abstract_DIV");
  var95 = param10.target.closest("richlistitem")?.["querySelector"]("checkbox")["label"];
  if (var95.indexOf('🆔') != -0x1) {
    let var102 = Zotero.AI4Paper.extractDOIFromItemInfo(var95),
      var103 = [];
    Zotero.AI4Paper._data_fetchAbstractErrors = [];
    await Zotero.AI4Paper.fetchAbstractFromSemanticScholarAndCrossRef(var102, ["fetchAbstractFromSemanticScholar", "fetchAbstractFromCrossRef"], var103);
    let var104 = var103[0x0],
      var105 = var103[0x1],
      var106 = '';
    if (var104 && var104 != "fetchAbstract error") var106 = var104;else {
      if (var105 && var105 != "fetchAbstract error") var106 = var105;else var104 === "fetchAbstract error" || var105 === "fetchAbstract error" ? var106 = "🆔 " + var102 + "\n\n❌ 请求摘要时发生错误！【常见错误码含义】见：https://www.yuque.com/qnscholar/zotero-one/ho8yw7ookhod8evw?singleDoc \n\n" + String(Zotero.AI4Paper._data_fetchAbstractErrors) : var106 = "🆔 " + var102 + "\n\n😫 在【Semantic Scholar】和【CrossRef】数据库中均无摘要信息！";
    }
    var101.textContent = methodsBody.formatAbstract(var106);
  } else var101.textContent = "无 🆔 信息，无法抓取摘要。";
  var101.style.height = "auto";
  var101.style.height = Math.min(var101.scrollHeight, 0x12c) + 'px';
  await methodsBody.translateAbstract(var101);
};
methodsBody.translateAbstract = function (elem) {
  return Zotero.AI4Paper.DialogUtils.translateAbstract(elem);
};
methodsBody.formatAbstract = function (text) {
  return Zotero.AI4Paper.DialogUtils.formatAbstract(text);
};
methodsBody.viewOnline = function (label) {
  Zotero.AI4Paper.DialogUtils.viewOnlineDOI(label);
};
methodsBody.registerScrollListener = function () {
  Zotero.AI4Paper.DialogUtils.registerScrollListener('richlistbox-elem', scrollTop => {
    methodsBody.io.dataIn.item._citedRef_richlistbox_scrollTop = scrollTop;
  });
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
  Zotero.AI4Paper.DialogUtils.scrollToTopOrBottom('richlistbox-elem', param15);
};
methodsBody.aiAnalysis = function () {
  if (!document.querySelector(".checkmark").classList.contains("show")) {
    Zotero.AI4Paper.showProgressWindow(0xbb8, "【AI4paper】AI 分析参考文献", "❌ 请等待详情加载完成后，再执行 AI 分析！");
    return;
  }
  let var117 = Zotero.AI4Paper.getRefsJSON4AIAnalysis(methodsBody.io.dataIn.item, 'cited');
  if (var117) {
    window.close();
    let var118 = "下面是一篇名为\"" + methodsBody.io.dataIn.item.getField("title") + "\"论文及其参考文献的结构化数据，现在我希望你深度分析参考文献情况及其与当前论文的联系。至少包括以下几个方面：\n\t\t\n1. 参考文献发表期刊的特征？\n2. 参考文献发表年份的特征？根据特征，分析研究的高峰期。\n3. 参考文献作者的特征？\n4. 参考文献的影响因子（impactFactor）情况？\n5. 从本论文及所有参考文献标题中提取一些典型关键词（Keywords），以尽可能体现这些文献的主要研究焦点。\n\n分析时，请尽量详实，适当用一些表格来呈现分析结果，并用 Markdown 形式给我。\n\n论文及其参考文献的结构化数据如下：\n\n" + var117,
      var119 = Zotero.AI4Paper.gptReaderSidePane_setMessageInput(var118);
    var119 && Zotero.AI4Paper.showProgressWindow(0x1388, "【AI4paper】AI 分析参考文献", "【参考文献的 JSON 结构化数据】及【默认提示词】，已经填充至 GPT 侧边栏。现在，请自行选择合适的 AI 模型，并执行分析！");
  }
};