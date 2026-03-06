var methodsBody = function () {};
methodsBody.init = function () {
  methodsBody.io = window.arguments && window.arguments[0x0] ? window.arguments[0x0] : {
    dataIn: {
      data: [],
      item: {}
    },
    dataOut: null
  };
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  Zotero.AI4Paper.lastCitingSearchInput && (document.getElementById('search-inputBox').placeholder = Zotero.AI4Paper.lastCitingSearchInput);
  methodsBody.buildContextMenu(null, true);
  document.getElementById('search-inputBox').focus();
  methodsBody.updatePrefs(true);
  document.getElementById("zotero-selectCiting-intro").textContent = '选择要导入的施引文献：0/' + methodsBody.io.dataIn.data.length;
  methodsBody.buildItemNodes(methodsBody.io.dataIn.data);
};
methodsBody.buildItemNodes = function (param1) {
  let var1 = methodsBody.io.dataIn.item;
  try {
    Zotero.AI4Paper._isDuplicatedArray = JSON.parse(var1._CitingReferences_isDuplicated || '[]');
  } catch (e) {
    Zotero.AI4Paper._isDuplicatedArray = [];
  }
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
    var1._hasCitingRefsCache && Zotero.AI4Paper._isDuplicatedArray[var3] && Zotero.AI4Paper._isDuplicatedArray[var3]._isDuplicated === true && (var10.setAttribute("tooltiptext", "点击显示"), var10.innerHTML = Zotero.AI4Paper.svg_icon_16px.document_active, var10.setAttribute('_itemID', Zotero.AI4Paper._isDuplicatedArray[var3]._itemID), var10.addEventListener("mouseover", () => {
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
  let var17 = (var15._CitingReferences_DOI || '').split("🍋🎈🍋").filter(Boolean),
    var18;
  try {
    var18 = JSON.parse(var15._CitingReferences_isDuplicated || '[]');
  } catch (e) {
    var18 = [];
  }
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
methodsBody.showInMyLibrary = function (param2) {
  return Zotero.AI4Paper.DialogUtils.showInMyLibrary(param2);
};
methodsBody.selectAll = function (param3) {
  let skipped = Zotero.AI4Paper.DialogUtils.selectAll('richlistbox-elem', param3, { skipHidden: true });
  param3 ? document.getElementById("zotero-selectCiting-intro").textContent = "选择要导入的施引文献：0/" + methodsBody.io.dataIn.data.length : document.getElementById("zotero-selectCiting-intro").textContent = "选择要导入的施引文献：" + (methodsBody.io.dataIn.data.length - skipped) + '/' + methodsBody.io.dataIn.data.length;
};
methodsBody.acceptSelection = function () {
  let items = Zotero.AI4Paper.DialogUtils.getCheckedItems('richlistbox-elem');
  if (items.length) {
    methodsBody.io.dataOut = new Object();
    for (let item of items) {
      methodsBody.io.dataOut[item.value] = item.label;
    }
  } else {
    methodsBody.io.dataOut = null;
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
  let var42 = document.getElementById('zotero-selectCiting-intro').textContent;
  if (var42 === "选择要导入的施引文献：0/" + methodsBody.io.dataIn.data.length) var41 && (document.getElementById('zotero-selectCiting-intro').textContent = "选择要导入的施引文献：1/" + methodsBody.io.dataIn.data.length);else {
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
    document.getElementById("zotero-selectCiting-intro").textContent = "选择要导入的施引文献：" + var45 + '/' + methodsBody.io.dataIn.data.length;
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
    lastSearchKey: 'lastCitingSearchInput',
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
methodsBody.buildContextMenu = function (param7, param8) {
  let panel = Zotero.AI4Paper.DialogUtils.initContextPanel('richlistitem-contextpanel', { width: '500px' }, param8);
  if (param8 && !panel) return;
  if (!panel) return;
  if (!param7 || !param7.target) return panel;
  let item = param7.target.closest('richlistitem');
  if (!item) return panel;
  let checkbox = item.querySelector('checkbox');
  let label = checkbox && checkbox.label;
  if (!label) return panel;
  return Zotero.AI4Paper.DialogUtils.buildRefsInfoPanel(panel, label, {
    onViewOnline: methodsBody.viewOnline
  });
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
methodsBody.translateAbstract = function (elem) {
  return Zotero.AI4Paper.DialogUtils.translateAbstract(elem);
};
methodsBody.extractInfoAndAbstract = function (param12) {
  let var106 = param12,
    var107 = '';
  return param12 && (var106 = param12.split("{{abstractByZoteroOne}}")[0x0], var107 = param12.split("{{abstractByZoteroOne}}")[0x1], var107 = var107 ? methodsBody.formatAbstract(var107) : ''), {
    'info': var106,
    'abstract': var107
  };
};
methodsBody.formatAbstract = function (text) {
  return Zotero.AI4Paper.DialogUtils.formatAbstract(text);
};
methodsBody.viewOnline = function (label) {
  Zotero.AI4Paper.DialogUtils.viewOnlineDOI(label);
};
methodsBody.registerScrollListener = function () {
  Zotero.AI4Paper.DialogUtils.registerScrollListener('richlistbox-elem', scrollTop => {
    methodsBody.io.dataIn.item._citingRef_richlistbox_scrollTop = scrollTop;
  });
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
  Zotero.AI4Paper.DialogUtils.scrollToTopOrBottom('richlistbox-elem', param16);
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
