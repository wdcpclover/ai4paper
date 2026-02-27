var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  Zotero.ZoteroIF.setFontSize_Dialog(document.querySelector("dialog"), 0.92);
  document.addEventListener("focus", () => {
    let var1 = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")['matches'];
    document.getElementById("tagTree").querySelectorAll(".tagSelected").forEach(_0x592129 => {
      _0x592129.style.backgroundColor = var1 ? "#145a7a" : '#2d3436';
    });
    document.getElementById("tagTree").querySelectorAll(".tagSearched").forEach(_0x1a18e8 => {
      _0x1a18e8.style.backgroundColor = var1 ? '#38a646' : "#cfdd94";
    });
    document.getElementById("tagTree").querySelectorAll(".tagSearchFocus").forEach(_0x348a0f => {
      _0x348a0f.style.backgroundColor = var1 ? "#7f77d9" : '#bab4fe';
    });
  });
  !document._switchViewShortcutsAdded && (document._switchViewShortcutsAdded = true, document.addEventListener("keydown", _0x5c12ac => {
    Zotero.isMac ? (_0x5c12ac.key === 't' && !_0x5c12ac.ctrlKey && !_0x5c12ac.shiftKey && !_0x5c12ac.altKey && _0x5c12ac.metaKey && methodsBody.switchTagsView(), _0x5c12ac.key === 'd' && !_0x5c12ac.ctrlKey && !_0x5c12ac.shiftKey && !_0x5c12ac.altKey && _0x5c12ac.metaKey && methodsBody.switchTagsTypeView(), _0x5c12ac.key === 'f' && !_0x5c12ac.ctrlKey && !_0x5c12ac.shiftKey && !_0x5c12ac.altKey && _0x5c12ac.metaKey && methodsBody.focusSearchBox()) : (_0x5c12ac.key === 't' && _0x5c12ac.ctrlKey && !_0x5c12ac.shiftKey && !_0x5c12ac.altKey && !_0x5c12ac.metaKey && methodsBody.switchTagsView(), _0x5c12ac.key === 'd' && _0x5c12ac.ctrlKey && !_0x5c12ac.shiftKey && !_0x5c12ac.altKey && !_0x5c12ac.metaKey && methodsBody.switchTagsTypeView(), _0x5c12ac.key === 'f' && _0x5c12ac.ctrlKey && !_0x5c12ac.shiftKey && !_0x5c12ac.altKey && !_0x5c12ac.metaKey && methodsBody.focusSearchBox());
  }));
  document.getElementById("cardNotes-doubleClick-enable").checked = Zotero.Prefs.get('zoteroif.cardNotesDoubleClick');
  document.getElementById("imageCardNote-Search-First").checked = Zotero.Prefs.get("zoteroif.imageCardNoteSearchFirst");
  Zotero.ZoteroIF.lastcardnotestaginput && (document.getElementById("zoteroif.AnnotationTags.search").placeholder = Zotero.ZoteroIF.lastcardnotestaginput, document.getElementById("zoteroif.nestedAnnotationTags.search").placeholder = Zotero.ZoteroIF.lastcardnotestaginput);
  Zotero.ZoteroIF.lastTagsCardNoteView === "GeneralView" ? (methodsBody.buildNestedView(null, true), methodsBody.buildGeneralView(), methodsBody.setTagsView("GeneralView")) : (methodsBody.buildGeneralView(), methodsBody.buildNestedView(null, true), methodsBody.setTagsView("NestedView"));
  methodsBody.updateAnnotationNestedTagsData();
  methodsBody.initContextMenu_GeneralView();
};
methodsBody.setTagsView = function (param1) {
  if (param1 === "GeneralView") {
    document.getElementById("tagsNestedView-button").setAttribute('default', false);
    document.getElementById("tagsGeneralView-button").setAttribute("default", true);
    document.getElementById("tagsNestedView").hidden = true;
    document.getElementById("tagsGeneralView").hidden = false;
    document.getElementById("message-label").hidden = false;
    document.getElementById('message-label-nestedView').hidden = true;
    document.getElementById("message-label").before(document.getElementById("message-label-nestedView"));
    methodsBody.updateMessageIconOnSetView("GeneralView");
    document.getElementById("zoteroif.AnnotationTags.search").focus();
  } else param1 === "NestedView" && (document.getElementById("tagsNestedView-button").setAttribute("default", true), document.getElementById("tagsGeneralView-button").setAttribute("default", false), document.getElementById("tagsNestedView").hidden = false, document.getElementById('tagsGeneralView').hidden = true, document.getElementById('message-label').hidden = true, document.getElementById("message-label-nestedView").hidden = false, document.getElementById("message-label-nestedView").before(document.getElementById('message-label')), methodsBody.updateMessageIconOnSetView("NestedView"), document.getElementById('zoteroif.nestedAnnotationTags.search').focus());
};
methodsBody.switchTagsView = function () {
  if (document.getElementById("tagsNestedView-button").getAttribute("default") === 'true') methodsBody.setTagsView("GeneralView");else document.getElementById("tagsGeneralView-button").getAttribute('default') === 'true' && methodsBody.setTagsView("NestedView");
};
methodsBody.updateMessageIconOnSetView = function (param2) {
  if (param2 === "GeneralView") {
    if (document.getElementById("annotationTagButton").getAttribute("default") === 'true') methodsBody.generalView_updateButtonStatus("annotationTag");else {
      if (document.getElementById("imageAnnotationTagButton").getAttribute('default') === 'true') methodsBody.generalView_updateButtonStatus("imageAnnotationTag");else {
        if (document.getElementById("itemTagButton").getAttribute('default') === "true") methodsBody.generalView_updateButtonStatus("itemTag");else document.getElementById('gptNoteTagButton').getAttribute("default") === "true" ? methodsBody.generalView_updateButtonStatus("gptNoteTag") : methodsBody.generalView_updateButtonStatus('annotationTag');
      }
    }
  } else {
    if (document.getElementById("annotationTagButton-NestedView").getAttribute("default") === "true") methodsBody.nestedView_updateButtonStatus("annotationTag");else {
      if (document.getElementById("imageAnnotationTagButton-NestedView").getAttribute('default') === "true") methodsBody.nestedView_updateButtonStatus("imageAnnotationTag");else {
        if (document.getElementById("itemTagButton-NestedView").getAttribute("default") === 'true') methodsBody.nestedView_updateButtonStatus("itemTag");else document.getElementById("gptNoteTagButton-NestedView").getAttribute('default') === "true" ? methodsBody.nestedView_updateButtonStatus('gptNoteTag') : methodsBody.nestedView_updateButtonStatus("annotationTag");
      }
    }
  }
};
methodsBody.switchTagsTypeView = function () {
  let var2 = ["annotationTag", "imageAnnotationTag", 'itemTag', "gptNoteTag"];
  if (document.getElementById("tagsNestedView-button").getAttribute('default') === "true") for (let var3 = 0x0; var3 < var2.length; var3++) {
    if (document.getElementById(var2[var3] + "Button-NestedView").getAttribute("default") === "true") {
      let var4 = var3 === 0x3 ? 0x0 : var3 + 0x1;
      document.getElementById(var2[var4] + 'Button-NestedView').click();
      return;
    }
  } else {
    if (document.getElementById("tagsGeneralView-button").getAttribute("default") === 'true') for (let var5 = 0x0; var5 < var2.length; var5++) {
      if (document.getElementById(var2[var5] + "Button").getAttribute("default") === "true") {
        let var6 = var5 === 0x3 ? 0x0 : var5 + 0x1;
        document.getElementById(var2[var6] + "Button").click();
        return;
      }
    }
  }
};
methodsBody.focusSearchBox = function () {
  if (document.getElementById("tagsNestedView-button").getAttribute('default') === "true") document.getElementById("zoteroif.nestedAnnotationTags.search").focus();else document.getElementById('tagsGeneralView-button').getAttribute("default") === "true" && document.getElementById("zoteroif.AnnotationTags.search").focus();
};
methodsBody.buildNestedView = function (param3, param4) {
  let var7 = 0x0;
  function fn1(param5, param6, param7) {
    const var8 = document.createElement('ul');
    var8.style.cursor = "default";
    for (const var9 in param6) {
      const var10 = document.createElement('li');
      var10.style.marginTop = "3px";
      var10.style.marginBottom = "3px";
      var10.style.cursor = "default";
      var10.style.paddingTop = "0.05em";
      var10.style.paddingBottom = "0.05em";
      let var11 = document.createElement("span");
      var11.style.transition = "transform 0.3s ease";
      var11.classList.add("title");
      var11.classList.toggle("expanded", true);
      var11.style = "user-select: none;padding-top: 2px;padding-bottom: 2px;padding-left: 3px;padding-right: 3px;cursor: default;";
      let var12;
      var12 = '' + (param7 ? param7 + '/' : '') + var9;
      param7 === '' && !var12.includes('/') && (var12 = '/' + var12);
      var11.fullName = var12;
      var11.name = var9;
      var11.nameWithCount = var9;
      var11.parentTag = param7;
      var11.onmouseover = () => {
        !var11.classList.contains("tagSelected") && !var11.classList.contains("tagSearched") && !var11.classList.contains("tagSearchFocus") && (var11.style.backgroundColor = methodsBody.isDark() ? "#2f3031" : "#f0f0f0", var11.style.borderRadius = "6px", var11.style.color = "#ff7e02");
      };
      var11.onmouseout = () => {
        var11.textContent != var11.nameWithCount ? setTimeout(function () {
          var11.textContent = var11.nameWithCount;
          !var11.classList.contains("tagSelected") && !var11.classList.contains("tagSearched") && !var11.classList.contains("tagSearchFocus") && (var11.style.backgroundColor = '', var11.style.borderRadius = '', var11.style.color = '');
        }, 0x1f4) : !var11.classList.contains("tagSelected") && !var11.classList.contains("tagSearched") && !var11.classList.contains("tagSearchFocus") && (var11.style.backgroundColor = '', var11.style.borderRadius = '', var11.style.color = '');
      };
      var11.addEventListener("dragstart", _0x3398bb => {
        _0x3398bb.stopPropagation();
        var11.textContent = var11.fullName;
      });
      var11.onclick = _0x38be83 => {
        let var13 = document.getElementById("tagTree").querySelectorAll("span");
        for (let var14 of var13) {
          var14 != var11 && !var14.classList.contains('tagSearched') && !var14.classList.contains("tagSearchFocus") && (var14.style.backgroundColor = '', var14.style.borderRadius = '', var14.style.color = '', var14.classList.toggle("tagSelected", false));
        }
        !var11.classList.contains("tagSearched") && !var11.classList.contains("tagSearchFocus") && (var11.style.backgroundColor = methodsBody.isDark() ? '#145a7a' : "#2d3436", var11.style.borderRadius = "6px", var11.style.color = "#ff7e02", var11.classList.toggle('tagSelected', true));
        _0x38be83.shiftKey && Zotero.ZoteroIF.showItemsBasedOnTag(var11.fullName);
      };
      var11.textContent = var9;
      Object.keys(param6[var9]).length ? (var11.textContent = var9 + '\x20(' + fn2(param6[var9]) + ')', var11.nameWithCount = var9 + '\x20(' + fn2(param6[var9]) + ')', var11.classList.add("hasChild")) : var11.classList.add("noChild");
      var10.prepend(var11);
      var7 === 0x0 && !var8._clickEventAdded && (var8._clickEventAdded = true, var8.style.marginLeft = "-20px", var8.classList.add("top_ul"), var8.addEventListener("click", function () {
        if (event.target.tagName != "span") return;
        event.target.classList.toggle('expanded');
        let var15 = event.target.parentNode.querySelector('ul');
        var15 && (var15.hidden = !var15.hidden);
      }), var8.addEventListener('contextmenu', _0xa0d095 => {
        _0xa0d095.preventDefault();
        if (_0xa0d095.target.tagName != "span") return;
        methodsBody._ContextMenu_selectedTag = _0xa0d095.target;
        let var16 = methodsBody.buildContextMenu();
        var16.openPopup(_0xa0d095.target, "end_before", 0x0, 0x0, false, false);
        methodsBody.getSubTags(_0xa0d095.target);
        methodsBody.go2SubTags(_0xa0d095.target);
      }), var8.addEventListener('dblclick', _0x585a3a => {
        _0x585a3a.stopPropagation();
        if (_0x585a3a.target.tagName != "span") return;
        methodsBody.checkTagType_nestedView(_0x585a3a.target.fullName);
      }), var8.addEventListener("dragstart", _0x186db5 => {
        _0x186db5.stopPropagation();
        if (_0x186db5.target.tagName != "span") return;
        _0x186db5.target.textContent = _0x186db5.target.fullName;
      }));
      Object.keys(param6[var9]).length > 0x0 && (var7++, fn1(var10, param6[var9], var12));
      var8.appendChild(var10);
    }
    param5.appendChild(var8);
  }
  function fn2(param8) {
    let var17 = 0x0;
    for (let var18 in param8) {
      var17++;
      var17 += fn2(param8[var18]);
    }
    return var17;
  }
  function fn3(param9) {
    const var19 = {};
    return param9.forEach(_0x573c2b => {
      const var20 = _0x573c2b.split('/');
      let var21 = var19;
      var20.forEach(_0x3def9b => {
        !var21[_0x3def9b] && (var21[_0x3def9b] = {});
        var21 = var21[_0x3def9b];
      });
    }), var19;
  }
  const var22 = document.getElementById('tagTree');
  let var23 = var22.firstElementChild;
  while (var23) {
    var23.remove();
    var23 = var22.firstElementChild;
  }
  methodsBody._searchResults = [];
  methodsBody._searchResults_index = 0x0;
  let var24,
    var25 = Zotero.ZoteroIF.lastTagsCardNotePane;
  if (param4 && var25 === "annotationTagPane" || param3 === "annotationTag") {
    var24 = Zotero.ZoteroIF.returnAnnotationTags();
    methodsBody.nestedView_updateTagsNumMessage(var24, "annotationTag");
    methodsBody.nestedView_updateButtonStatus("annotationTag");
  } else {
    if (param4 && var25 === "imageAnnotationTagPane" || param3 === "imageAnnotationTag") {
      var24 = Zotero.ZoteroIF.returnImageAnnotationTags();
      methodsBody.nestedView_updateTagsNumMessage(var24, 'imageAnnotationTag');
      methodsBody.nestedView_updateButtonStatus("imageAnnotationTag");
    } else {
      if (param4 && var25 === "itemTagPane" || param3 === 'itemTag') {
        var24 = Zotero.ZoteroIF.returnItemTags();
        methodsBody.nestedView_updateTagsNumMessage(var24, "itemTag");
        methodsBody.nestedView_updateButtonStatus('itemTag');
      } else param4 && var25 === "gptNoteTagPane" || param3 === "gptNoteTag" ? (var24 = Zotero.ZoteroIF.returnGPTNoteTags(), methodsBody.nestedView_updateTagsNumMessage(var24, "gptNoteTag"), methodsBody.nestedView_updateButtonStatus("gptNoteTag")) : (var24 = Zotero.ZoteroIF.returnAnnotationTags(), methodsBody.nestedView_updateTagsNumMessage(var24, 'annotationTag'), methodsBody.nestedView_updateButtonStatus('annotationTag'));
    }
  }
  const var26 = fn3(var24);
  fn1(var22, var26);
  methodsBody.updateAnnotationNestedTagsData();
};
methodsBody.isDark = function () {
  let var27 = Zotero.getMainWindow()?.["matchMedia"]("(prefers-color-scheme: dark)")["matches"];
  return var27;
};
methodsBody.collapseNestedTags = function () {
  const var28 = document.getElementById('tagTree');
  let var29 = var28.querySelectorAll(".hasChild");
  for (let var30 of var29) {
    var30.classList.toggle("expanded", false);
    let var31 = var30.parentNode.querySelector('ul');
    var31 && (var31.hidden = true);
  }
};
methodsBody.collapseTopNestedTags = function () {
  const var32 = document.getElementById("tagTree");
  let var33 = var32.querySelector('.top_ul');
  for (let var34 of var33.childNodes) {
    let var35 = var34.querySelector("span");
    var35.classList.toggle("expanded", false);
    let var36 = var34.querySelector('ul');
    var36 && (var36.hidden = true);
  }
};
methodsBody.expandNestedTags = function () {
  const var37 = document.getElementById("tagTree");
  let var38 = var37.querySelectorAll(".hasChild");
  for (let var39 of var38) {
    var39.classList.toggle("expanded", true);
    let var40 = var39.parentNode.querySelector('ul');
    var40 && (var40.hidden = false);
  }
};
methodsBody.searchNestedTags = function () {
  methodsBody.expandNestedTags();
  let var41 = document.getElementById("zoteroif.nestedAnnotationTags.search").value.trim();
  if (var41 === '' && document.getElementById("zoteroif.nestedAnnotationTags.search").placeholder === '') return false;else var41 === '' && document.getElementById("zoteroif.nestedAnnotationTags.search").placeholder != '' && (var41 = document.getElementById('zoteroif.nestedAnnotationTags.search').placeholder, document.getElementById("zoteroif.nestedAnnotationTags.search").value = document.getElementById("zoteroif.nestedAnnotationTags.search").placeholder);
  document._lastSearchTextNestedView = var41;
  document.getElementById("zoteroif.nestedAnnotationTags.search").placeholder = var41;
  document.getElementById("zoteroif.AnnotationTags.search").placeholder = var41;
  Zotero.ZoteroIF.lastcardnotestaginput = var41;
  methodsBody._searchResults = [];
  const var42 = document.getElementById('tagTree');
  var42.querySelectorAll('.tagSearched').forEach(_0x86cea7 => {
    _0x86cea7.style.borderRadius = '';
    _0x86cea7.style.backgroundColor = '';
    _0x86cea7.style.color = '';
    _0x86cea7.classList.toggle("tagSearched", false);
  });
  var42.querySelectorAll('.tagSelected').forEach(_0x36d7c6 => {
    _0x36d7c6.style.borderRadius = '';
    _0x36d7c6.style.backgroundColor = '';
    _0x36d7c6.style.color = '';
    _0x36d7c6.classList.toggle('tagSelected', false);
  });
  let var43 = var42.querySelectorAll('span');
  for (let var44 of var43) {
    var44.name.toLowerCase().indexOf(var41.toLowerCase()) != -0x1 && (var44.style.borderRadius = "6px", var44.style.backgroundColor = methodsBody.isDark() ? "#38a646" : "#cfdd94", var44.style.color = '', var44.classList.toggle('tagSearched', true), methodsBody._searchResults.push(var44));
  }
  methodsBody._searchResults.length && (methodsBody._searchResults[0x0].scrollIntoView({
    'behavior': "smooth",
    'block': "start"
  }), methodsBody._searchResults_index = 0x0, methodsBody._searchResults[0x0].style.borderRadius = "6px", methodsBody._searchResults[0x0].style.backgroundColor = methodsBody.isDark() ? "#7f77d9" : '#bab4fe', methodsBody._searchResults[0x0].classList.toggle('tagSearchFocus', true));
  let var45 = document.getElementById("message-label-nestedView");
  if (document.getElementById("annotationTagButton-NestedView").getAttribute("default") === "true") {
    methodsBody.nestedView_updateButtonStatus('annotationTag');
    var45.textContent = '搜索【' + var41 + '】：共有【' + methodsBody._searchResults.length + '】个注释标签';
  } else {
    if (document.getElementById("imageAnnotationTagButton-NestedView").getAttribute('default') === 'true') {
      methodsBody.nestedView_updateButtonStatus("imageAnnotationTag");
      var45.textContent = "搜索【" + var41 + '】：共有【' + methodsBody._searchResults.length + '】个图片注释标签';
    } else {
      if (document.getElementById("itemTagButton-NestedView").getAttribute("default") === 'true') {
        methodsBody.nestedView_updateButtonStatus("itemTag");
        var45.textContent = "搜索【" + var41 + "】：共有【" + methodsBody._searchResults.length + '】个条目标签';
      } else document.getElementById("gptNoteTagButton-NestedView").getAttribute('default') === 'true' ? (methodsBody.nestedView_updateButtonStatus("gptNoteTag"), var45.textContent = "搜索【" + var41 + "】：共有【" + methodsBody._searchResults.length + "】个 GPT 笔记标签") : (methodsBody.nestedView_updateButtonStatus('annotationTag'), var45.textContent = "搜索【" + var41 + '】：共有【' + methodsBody._searchResults.length + "】个注释标签");
    }
  }
};
methodsBody.searchNestedTags_previous = function () {
  if (methodsBody._searchResults.length) {
    document.getElementById("tagTree").querySelectorAll(".tagSearchFocus").forEach(_0x1cd9bd => {
      _0x1cd9bd.style.borderRadius = '6px';
      _0x1cd9bd.style.backgroundColor = methodsBody.isDark() ? "#38a646" : "#cfdd94";
      _0x1cd9bd.style.color = '';
      _0x1cd9bd.classList.toggle("tagSearchFocus", false);
    });
    let var46 = methodsBody._searchResults_index - 0x1;
    var46 < 0x0 && (var46 = methodsBody._searchResults.length - 0x1);
    methodsBody._searchResults[var46].scrollIntoView({
      'behavior': 'smooth',
      'block': "start"
    });
    methodsBody._searchResults_index = var46;
    methodsBody._searchResults[var46].style.borderRadius = '6px';
    methodsBody._searchResults[var46].style.backgroundColor = methodsBody.isDark() ? "#7f77d9" : '#bab4fe';
    methodsBody._searchResults[var46].classList.toggle("tagSearchFocus", true);
  }
};
methodsBody.searchNestedTags_next = function () {
  if (methodsBody._searchResults.length) {
    document.getElementById("tagTree").querySelectorAll('.tagSearchFocus').forEach(_0x3863fe => {
      _0x3863fe.style.borderRadius = '6px';
      _0x3863fe.style.backgroundColor = methodsBody.isDark() ? '#38a646' : "#cfdd94";
      _0x3863fe.style.color = '';
      _0x3863fe.classList.toggle("tagSearchFocus", false);
    });
    let var47 = methodsBody._searchResults_index + 0x1;
    var47 === methodsBody._searchResults.length && (var47 = 0x0);
    methodsBody._searchResults[var47].scrollIntoView({
      'behavior': 'smooth',
      'block': "start"
    });
    methodsBody._searchResults_index = var47;
    methodsBody._searchResults[var47].style.borderRadius = "6px";
    methodsBody._searchResults[var47].style.backgroundColor = methodsBody.isDark() ? '#7f77d9' : '#bab4fe';
    methodsBody._searchResults[var47].classList.toggle('tagSearchFocus', true);
  }
};
methodsBody.updateAnnotationNestedTagsData = function () {
  let var48 = [];
  function fn4(param10, param11) {
    for (const var49 in param10) {
      let var50;
      var50 = '' + (param11 ? param11 + '/' : '') + var49;
      var48.push(var50);
      Object.keys(param10[var49]).length > 0x0 && fn4(param10[var49], var50);
    }
  }
  function fn5(param12) {
    const var51 = {};
    return param12.forEach(_0x5d2619 => {
      const var52 = _0x5d2619.split('/');
      let var53 = var51;
      var52.forEach(_0x53f1c5 => {
        !var53[_0x53f1c5] && (var53[_0x53f1c5] = {});
        var53 = var53[_0x53f1c5];
      });
    }), var51;
  }
  let var54 = Zotero.ZoteroIF.returnAnnotationTags(),
    var55 = fn5(var54);
  fn4(var55);
  Zotero.Prefs.set("zoteroif.nestedAnnotationtagsrecent", JSON.stringify(var48));
  var48 = [];
  var54 = Zotero.ZoteroIF.returnImageAnnotationTags();
  var55 = fn5(var54);
  fn4(var55);
  Zotero.Prefs.set('zoteroif.nestedImageannotationtagsrecent', JSON.stringify(var48));
  var48 = [];
  var54 = Zotero.ZoteroIF.returnItemTags();
  var55 = fn5(var54);
  fn4(var55);
  Zotero.Prefs.set("zoteroif.nestedItemTags", JSON.stringify(var48));
  var48 = [];
  var54 = Zotero.ZoteroIF.returnGPTNoteTags();
  var55 = fn5(var54);
  fn4(var55);
  Zotero.Prefs.set("zoteroif.nestedGPTNoteTags", JSON.stringify(var48));
};
methodsBody.buildContextMenu = function () {
  let var56 = document.querySelector("#tags-contextmenu");
  return !var56 && (document.documentElement.appendChild(MozXULElement.parseXULToFragment("\n              <popupset>\n                <menupopup id=\"tags-contextmenu\" class=\"tags-contextmenu\">\n                  <menuitem label='前往父级标签' oncommand=\"methodsBody.focusParentTag();\"></menuitem>\n                  <menuitem label='前往顶层标签' oncommand=\"methodsBody.focusTopTag();\"></menuitem>\n                  <menu id='showSubTags-menu' label='前往下级父标签' oncommand=\"\"></menu>\n                  <menuseparator></menuseparator>\n                  <menuitem label='拷贝标签' oncommand=\"methodsBody.copyTagName();\"></menuitem>\n                  <menuseparator></menuseparator>\n                  <menuitem label='重命名标签' oncommand=\"methodsBody.renameTag();\"></menuitem>\n                  <menuitem label='删除标签' oncommand=\"methodsBody.deleteTag();\"></menuitem>\n\t\t\t\t  <menuseparator></menuseparator>\n\t\t\t\t  <menuitem label='检索所属文献' oncommand=\"methodsBody.showItemsBasedOnTag();\"></menuitem>\n                  <menuseparator></menuseparator>\n                  <menuitem label='跳转至【导入注释】' oncommand=\"methodsBody.go2ImportAnnotations();\"></menuitem>\n\t\t\t\t  <menuitem label='在【智能文献矩阵】中查询' oncommand=\"methodsBody.queryPapersMatrix();\"></menuitem>\n                  <menuseparator></menuseparator>\n                  <menu label='导出标签树'>\n\t                  <menupopup>\n\t\t                  <menuitem label='导出 Markdown 注释标签树（列表样式）' oncommand=\"methodsBody.exportTagTree('annotationTags', 'list');\"></menuitem>\n\t\t                  <menuitem label='导出 Markdown 图片注释标签树（列表样式）' oncommand=\"methodsBody.exportTagTree('imageAnnotationTags', 'list');\"></menuitem>\n\t\t                  <menuitem label='导出 Markdown 注释标签树（标题样式）' oncommand=\"methodsBody.exportTagTree('annotationTags', 'title');\"></menuitem>\n\t\t                  <menuitem label='导出 Markdown 图片注释标签树（标题样式）' oncommand=\"methodsBody.exportTagTree('imageAnnotationTags', 'title');\"></menuitem>\n\t                  </menupopup>\n                  </menu>\n                </menupopup>\n              </popupset>\n            ")), var56 = document.documentElement.lastElementChild.firstElementChild), var56;
};
methodsBody.renameTag = async function () {
  let var57 = methodsBody._ContextMenu_selectedTag.fullName,
    var58 = Zotero.ZoteroIF.openDialogByType_modal("renameTag", var57);
  if (!var58 || var58.trim() === var57) return;
  try {
    await Zotero.Tags.rename(0x1, var57, var58.trim());
  } catch (_0x124a06) {
    Zotero.ZoteroIF.showProgressWindow(0x1388, "❌ 重命名标签", Zotero.getString(_0x124a06));
  }
  let var59 = JSON.parse(Zotero.Prefs.get("zoteroif.annotationtagsrecent") || '[]'),
    var60 = var57,
    var61 = 0x0,
    var62 = {
      'tag': var60,
      'type': var61
    },
    var63 = var59.findIndex(_0x42d8ea => JSON.stringify(_0x42d8ea) === JSON.stringify(var62));
  var63 !== -0x1 && (var59.splice(var63, 0x1), Zotero.Prefs.set('zoteroif.annotationtagsrecent', JSON.stringify(var59)), var60 = var58.trim(), var62 = {
    'tag': var60,
    'type': var61
  }, !JSON.stringify(var59).includes(JSON.stringify(var62)) && (var59.push(var62), Zotero.Prefs.set("zoteroif.annotationtagsrecent", JSON.stringify(var59))));
  var63 = -0x1;
  var59 = [];
  var59 = JSON.parse(Zotero.Prefs.get("zoteroif.imageannotationtagsrecent") || '[]');
  var60 = var57;
  var62 = {
    'tag': var60,
    'type': var61
  };
  var63 = var59.findIndex(_0x3feadd => JSON.stringify(_0x3feadd) === JSON.stringify(var62));
  var63 !== -0x1 && (var59.splice(var63, 0x1), Zotero.Prefs.set("zoteroif.imageannotationtagsrecent", JSON.stringify(var59)), var60 = var58.trim(), var62 = {
    'tag': var60,
    'type': var61
  }, !JSON.stringify(var59).includes(JSON.stringify(var62)) && (var59.push(var62), Zotero.Prefs.set("zoteroif.imageannotationtagsrecent", JSON.stringify(var59))));
  var63 = -0x1;
  var59 = [];
  var59 = JSON.parse(Zotero.Prefs.get('zoteroif.itemTags') || '[]');
  var60 = var57;
  var62 = {
    'tag': var60,
    'type': var61
  };
  var63 = var59.findIndex(_0x144d93 => JSON.stringify(_0x144d93) === JSON.stringify(var62));
  var63 !== -0x1 && (var59.splice(var63, 0x1), Zotero.Prefs.set("zoteroif.itemTags", JSON.stringify(var59)), var60 = var58.trim(), var62 = {
    'tag': var60,
    'type': var61
  }, !JSON.stringify(var59).includes(JSON.stringify(var62)) && (var59.push(var62), Zotero.Prefs.set("zoteroif.itemTags", JSON.stringify(var59))));
  var63 = -0x1;
  var59 = [];
  var59 = JSON.parse(Zotero.Prefs.get("zoteroif.gptnotetagsrecent") || '[]');
  var60 = var57;
  var62 = {
    'tag': var60,
    'type': var61
  };
  var63 = var59.findIndex(_0x2ca018 => JSON.stringify(_0x2ca018) === JSON.stringify(var62));
  var63 !== -0x1 && (var59.splice(var63, 0x1), Zotero.Prefs.set("zoteroif.gptnotetagsrecent", JSON.stringify(var59)), var60 = var58.trim(), var62 = {
    'tag': var60,
    'type': var61
  }, !JSON.stringify(var59).includes(JSON.stringify(var62)) && (var59.push(var62), Zotero.Prefs.set("zoteroif.gptnotetagsrecent", JSON.stringify(var59))));
  var63 = -0x1;
  var59 = [];
  methodsBody.nestedView_updateTagTree();
};
methodsBody.deleteTag = async function () {
  let var64 = methodsBody._ContextMenu_selectedTag.fullName,
    var65 = Services.prompt.confirm(window, Zotero.getString('pane.tagSelector.delete.title'), "是否确认删除标签【" + var64 + '】？');
  if (!var65) return;
  try {
    let var66 = Zotero.Tags.getID(var64);
    var66 && (await Zotero.Tags.removeFromLibrary(0x1, var66));
  } catch (_0x5961aa) {
    Zotero.ZoteroIF.showProgressWindow(0x1388, '❌\x20删除标签', Zotero.getString(_0x5961aa));
  }
  let var67 = JSON.parse(Zotero.Prefs.get("zoteroif.annotationtagsrecent") || '[]'),
    var68 = var64,
    var69 = 0x0,
    var70 = {
      'tag': var68,
      'type': var69
    },
    var71 = var67.findIndex(_0x22070e => JSON.stringify(_0x22070e) === JSON.stringify(var70));
  var71 !== -0x1 && (var67.splice(var71, 0x1), Zotero.Prefs.set("zoteroif.annotationtagsrecent", JSON.stringify(var67)));
  var71 = -0x1;
  var67 = [];
  var67 = JSON.parse(Zotero.Prefs.get("zoteroif.imageannotationtagsrecent") || '[]');
  var71 = var67.findIndex(_0x12cef6 => JSON.stringify(_0x12cef6) === JSON.stringify(var70));
  var71 !== -0x1 && (var67.splice(var71, 0x1), Zotero.Prefs.set("zoteroif.imageannotationtagsrecent", JSON.stringify(var67)));
  var71 = -0x1;
  var67 = [];
  var67 = JSON.parse(Zotero.Prefs.get("zoteroif.itemTags") || '[]');
  var71 = var67.findIndex(_0x2cbce5 => JSON.stringify(_0x2cbce5) === JSON.stringify(var70));
  var71 !== -0x1 && (var67.splice(var71, 0x1), Zotero.Prefs.set("zoteroif.itemTags", JSON.stringify(var67)));
  var71 = -0x1;
  var67 = [];
  var67 = JSON.parse(Zotero.Prefs.get("zoteroif.gptnotetagsrecent") || '[]');
  var71 = var67.findIndex(_0x223a52 => JSON.stringify(_0x223a52) === JSON.stringify(var70));
  var71 !== -0x1 && (var67.splice(var71, 0x1), Zotero.Prefs.set("zoteroif.gptnotetagsrecent", JSON.stringify(var67)));
  var71 = -0x1;
  var67 = [];
  methodsBody.nestedView_updateTagTree();
};
methodsBody.nestedView_updateTagTree = function () {
  if (document.getElementById("annotationTagButton-NestedView").getAttribute("default") === "true") methodsBody.buildNestedView("annotationTag");else {
    if (document.getElementById("imageAnnotationTagButton-NestedView").getAttribute('default') === 'true') methodsBody.buildNestedView('imageAnnotationTag');else {
      if (document.getElementById('itemTagButton-NestedView').getAttribute('default') === "true") methodsBody.buildNestedView("itemTag");else document.getElementById("gptNoteTagButton-NestedView").getAttribute('default') === "true" ? methodsBody.buildNestedView("gptNoteTag") : methodsBody.buildNestedView("annotationTag");
    }
  }
};
methodsBody.showItemsBasedOnTag = function () {
  let var72 = methodsBody._ContextMenu_selectedTag.fullName;
  Zotero.ZoteroIF.showItemsBasedOnTag(var72);
};
methodsBody.go2ImportAnnotations = function () {
  let var73 = methodsBody._ContextMenu_selectedTag.fullName;
  Zotero.ZoteroIF.openDialogAdvancedSearch_importAnnotations(var73);
  Zotero.ZoteroIF.processAdvancedSearch_importAnnotations();
};
methodsBody.queryPapersMatrix = function () {
  let var74 = methodsBody._ContextMenu_selectedTag.fullName;
  Zotero.ZoteroIF.queryPapersMatrix("filterByTag", var74);
};
methodsBody.focusParentTag = function () {
  let var75 = methodsBody._ContextMenu_selectedTag.parentTag,
    var76 = document.getElementById('tagTree').querySelectorAll("span");
  for (let var77 of var76) {
    if (var77.fullName === var75) {
      var77.scrollIntoView({
        'behavior': "smooth",
        'block': "center"
      });
      var77.click();
      var77.click();
      return;
    }
  }
};
methodsBody.focusTopTag = function () {
  let var78 = methodsBody._ContextMenu_selectedTag;
  const var79 = document.getElementById("tagTree");
  let var80 = var79.querySelector('.top_ul');
  for (let var81 of var80.childNodes) {
    var81.classList.toggle('top_li', true);
  }
  let var82 = var78.closest('.top_li');
  if (var82) {
    let var83 = var82.querySelector('span');
    if (var83) {
      var83.scrollIntoView({
        'behavior': "smooth",
        'block': "center"
      });
      var83.click();
      var83.click();
      return;
    }
  }
};
methodsBody.copyTagName = function () {
  let var84 = methodsBody._ContextMenu_selectedTag.fullName;
  Zotero.ZoteroIF.copy2Clipboard(var84);
  Zotero.ZoteroIF.showProgressWindow(0x5dc, "✅ 拷贝标签名", "已拷贝标签【" + var84 + '】');
};
methodsBody.go2SubTags = function (param13) {
  let var85 = document.getElementById("showSubTags-menu");
  if (!param13.classList.contains('hasChild') || methodsBody._ContextMenu_subTags.length === 0x0) {
    var85.hidden = true;
    return;
  } else var85.hidden = false;
  let var86 = document.getElementById("showSubTags-menupopup");
  if (!var86) {
    var86 = document.createXULElement("menupopup");
    var86.id = "showSubTags-menupopup";
    var85.appendChild(var86);
  } else {
    let var87 = var86.firstElementChild;
    while (var87) {
      var87.remove();
      var87 = var86.firstElementChild;
    }
  }
  for (let var88 of methodsBody._ContextMenu_subTags) {
    let var89 = document.createXULElement("menuitem");
    var89.setAttribute("label", var88.name);
    var89.addEventListener("command", () => {
      param13.classList.toggle('expanded', true);
      let var90 = param13.parentNode.querySelector('ul');
      var90 && (var90.hidden = false);
      var88.scrollIntoView({
        'behavior': "smooth",
        'block': "center"
      });
      var88.click();
      var88.click();
    });
    var86.appendChild(var89);
  }
};
methodsBody.getSubTags = function (param14) {
  methodsBody._ContextMenu_subTags = [];
  if (param14.classList.contains("hasChild")) {
    let var91 = param14.parentNode.querySelector('ul');
    if (var91) for (let var92 of var91.childNodes) {
      let var93 = var92.querySelector("span");
      var93.classList.contains('hasChild') && methodsBody._ContextMenu_subTags.push(var93);
    }
  }
};
methodsBody.exportTagTree = function (param15, param16) {
  function fn6(param17) {
    const var94 = {};
    return param17.forEach(_0x527b2e => {
      const var95 = _0x527b2e.split('/');
      let var96 = var94;
      var95.forEach(_0x18ef75 => {
        !var96[_0x18ef75] && (var96[_0x18ef75] = {});
        var96 = var96[_0x18ef75];
      });
    }), var94;
  }
  function fn7(param18) {
    let var97 = '';
    function fn8(param19, param20) {
      for (let var98 in param19) {
        var97 += '\x20\x20'.repeat(param20 - 0x1) + '-\x20' + var98 + '\x0a';
        Object.keys(param19[var98]).length > 0x0 && fn8(param19[var98], param20 + 0x1);
      }
    }
    return fn8(param18, 0x1), var97;
  }
  function fn9(param21) {
    let var99 = '';
    function fn10(param22, param23) {
      for (let var100 in param22) {
        var99 += '#'.repeat(param23) + '\x20' + var100 + '\x0a\x0a';
        Object.keys(param22[var100]).length > 0x0 && fn10(param22[var100], param23 + 0x1);
      }
    }
    return fn10(param21, 0x1), var99;
  }
  let var101 = [];
  param15 === 'annotationTags' ? (var101 = Zotero.ZoteroIF.returnAnnotationTags(), var101.length ? param16 === "list" ? Zotero.ZoteroIF.exportTagTree(fn7(fn6(var101)), '注释') : Zotero.ZoteroIF.exportTagTree(fn9(fn6(var101)), '注释') : Zotero.ZoteroIF.showProgressWindow(0xbb8, "❌ 注释标签库为空", "注释标签库为空！无注释标签，或未刷新注释标签库。")) : (var101 = Zotero.ZoteroIF.returnImageAnnotationTags(), var101.length ? param16 === "list" ? Zotero.ZoteroIF.exportTagTree(fn7(fn6(var101)), "图片注释") : Zotero.ZoteroIF.exportTagTree(fn9(fn6(var101)), "图片注释") : Zotero.ZoteroIF.showProgressWindow(0xbb8, "❌ 图片注释标签库为空", "图片注释标签库为空！无图片注释标签，或未刷新图片注释标签库。"));
};
methodsBody.buildGeneralView = function () {
  (Zotero.isWin || Zotero.isLinux) && document.getElementById('zoteroif.AnnotationTags.search').focus();
  let var102,
    var103 = Zotero.ZoteroIF.lastTagsCardNotePane;
  if (var103 === "annotationTagPane") {
    var102 = Zotero.ZoteroIF.returnAnnotationTags();
    methodsBody.generalView_updateTagsNumMessage(var102, 'annotationTag');
    methodsBody.generalView_updateButtonStatus("annotationTag");
  } else {
    if (var103 === "imageAnnotationTagPane") {
      var102 = Zotero.ZoteroIF.returnImageAnnotationTags();
      methodsBody.generalView_updateTagsNumMessage(var102, 'imageAnnotationTag');
      methodsBody.generalView_updateButtonStatus('imageAnnotationTag');
    } else {
      if (var103 === "itemTagPane") {
        var102 = Zotero.ZoteroIF.returnItemTags();
        methodsBody.generalView_updateTagsNumMessage(var102, 'itemTag');
        methodsBody.generalView_updateButtonStatus("itemTag");
      } else var103 === "gptNoteTagPane" ? (var102 = Zotero.ZoteroIF.returnGPTNoteTags(), methodsBody.generalView_updateTagsNumMessage(var102, "gptNoteTag"), methodsBody.generalView_updateButtonStatus("gptNoteTag")) : (var102 = Zotero.ZoteroIF.returnAnnotationTags(), methodsBody.generalView_updateTagsNumMessage(var102, "annotationTag"), methodsBody.generalView_updateButtonStatus("annotationTag"));
    }
  }
  methodsBody.generalView_clearListbox();
  methodsBody.generalView_buildItemNodes(var102);
  methodsBody.generalView_updateFilterButtons(true);
};
methodsBody.filter = function (param24) {
  methodsBody.generalView_updateFilterButtons(null, param24);
  let var104;
  var var105 = document.getElementById("annotationTagType-image");
  if (var105.getAttribute("src") === "chrome://zoteroif/content/icons/annotationTag.png") {
    var104 = Zotero.ZoteroIF.returnAnnotationTagsFilter(param24);
    methodsBody.generalView_updateButtonStatus('annotationTag');
  } else {
    if (var105.getAttribute('src') === 'chrome://zoteroif/content/icons/imageAnnotationTag.png') {
      var104 = Zotero.ZoteroIF.returnImageAnnotationTagsFilter(param24);
      methodsBody.generalView_updateButtonStatus('imageAnnotationTag');
    } else {
      if (var105.getAttribute("src") === "chrome://zoteroif/content/icons/itemTag.png") {
        var104 = Zotero.ZoteroIF.returnItemTagsFilter(param24);
        methodsBody.generalView_updateButtonStatus('itemTag');
      } else var105.getAttribute("src") === "chrome://zoteroif/content/icons/robot.png" ? (var104 = Zotero.ZoteroIF.returnGPTNoteTagsFilter(param24), methodsBody.generalView_updateButtonStatus('gptNoteTag')) : (var104 = Zotero.ZoteroIF.returnAnnotationTagsFilter(param24), methodsBody.generalView_updateButtonStatus("annotationTag"));
    }
  }
  methodsBody.generalView_clearListbox();
  methodsBody.generalView_buildItemNodes(var104);
  param24 = param24 === 'OT' ? '#' : param24;
  var var106 = document.getElementById("message-label");
  if (var105.getAttribute("src") === 'chrome://zoteroif/content/icons/annotationTag.png') var106.textContent = param24 + '：包含【' + var104.length + "】个注释标签";else {
    if (var105.getAttribute("src") === "chrome://zoteroif/content/icons/imageAnnotationTag.png") var106.textContent = param24 + "：包含【" + var104.length + "】个图片注释标签";else {
      if (var105.getAttribute("src") === 'chrome://zoteroif/content/icons/itemTag.png') var106.textContent = param24 + '：包含【' + var104.length + "】个条目标签";else var105.getAttribute("src") === "chrome://zoteroif/content/icons/robot.png" && (var106.textContent = param24 + '：包含【' + var104.length + '】个\x20GPT\x20笔记标签');
    }
  }
};
methodsBody.annotationTag = function (param25) {
  methodsBody.generalView_updateButtonStatus("annotationTag");
  let var107 = Zotero.ZoteroIF.returnAnnotationTags();
  methodsBody.generalView_clearListbox();
  methodsBody.generalView_buildItemNodes(var107);
  !param25 ? methodsBody.generalView_updateTagsNumMessage(var107, "annotationTag") : document.getElementById('message-label').textContent = '刷新完成，共有【' + var107.length + "】个注释标签";
  methodsBody.generalView_updateFilterButtons(true);
};
methodsBody.imageAnnotationTag = function (param26) {
  methodsBody.generalView_updateButtonStatus("imageAnnotationTag");
  let var108 = Zotero.ZoteroIF.returnImageAnnotationTags();
  methodsBody.generalView_clearListbox();
  methodsBody.generalView_buildItemNodes(var108);
  !param26 ? methodsBody.generalView_updateTagsNumMessage(var108, "imageAnnotationTag") : document.getElementById("message-label").textContent = "刷新完成，共有【" + var108.length + "】个图片注释标签";
  methodsBody.generalView_updateFilterButtons(true);
};
methodsBody.itemTag = function (param27) {
  methodsBody.generalView_updateButtonStatus('itemTag');
  let var109 = Zotero.ZoteroIF.returnItemTags();
  methodsBody.generalView_clearListbox();
  methodsBody.generalView_buildItemNodes(var109);
  !param27 ? methodsBody.generalView_updateTagsNumMessage(var109, "itemTag") : document.getElementById("message-label").textContent = "刷新完成，共有【" + var109.length + "】个条目标签";
  methodsBody.generalView_updateFilterButtons(true);
};
methodsBody.gptNoteTag = function (param28) {
  methodsBody.generalView_updateButtonStatus("gptNoteTag");
  let var110 = Zotero.ZoteroIF.returnGPTNoteTags();
  methodsBody.generalView_clearListbox();
  methodsBody.generalView_buildItemNodes(var110);
  !param28 ? methodsBody.generalView_updateTagsNumMessage(var110, 'gptNoteTag') : document.getElementById("message-label").textContent = "刷新完成，共有【" + var110.length + '】个\x20GPT\x20笔记标签';
  methodsBody.generalView_updateFilterButtons(true);
};
methodsBody.updateTags = async function (param29, param30) {
  let var111 = {
      'annotationTag': "注释标签",
      'imageAnnotationTag': "图片注释标签",
      'itemTag': '条目标签',
      'gptNoteTag': " GPT 笔记标签"
    },
    var112 = await Zotero.Tags.getAll(0x1);
  if (var112.length === 0x0) {
    Zotero.ZoteroIF.showProgressWindow(0xbb8, '❌\x20未发现标签【Zotero\x20One】', "未在【我的文库】中发现任何标签！");
    return;
  }
  document.getElementById("annotationTagType-image").setAttribute('src', "chrome://zoteroif/content/icons/" + (param29 === 'gptNoteTag' ? "robot" : param29) + ".png");
  param30 === "nested" ? document.getElementById("message-label-nestedView").textContent = "正在刷新" + var111[param29] + "，右下角查看进度..." : document.getElementById("message-label").textContent = "正在刷新" + var111[param29] + "，右下角查看进度...";
  let var113 = "_selectAnnotationTagDialog_update_" + param29;
  Zotero.ZoteroIF.progressPercent_initProgress(var112, var113, var111[param29]);
  methodsBody["update_" + param29 + "_checkNext"](var113, var111[param29], param30);
};
methodsBody.update_annotationTag_checkNext = async function (param31, param32, param33) {
  Zotero.ZoteroIF["numberOfUpdatedItems" + param31]++;
  if (Zotero.ZoteroIF["current" + param31] == Zotero.ZoteroIF['toUpdate' + param31] - 0x1) {
    Zotero.ZoteroIF['progressWindow' + param31].close();
    Zotero.ZoteroIF.progressPercent_resetState(null, param31, param32);
    Zotero.Prefs.set("zoteroif.annotationtagsrecent", JSON.stringify(Zotero.ZoteroIF['_progressData_' + param31]));
    param33 === "nested" ? methodsBody.buildNestedView("annotationTag") : methodsBody.annotationTag(true);
    return;
  }
  Zotero.ZoteroIF.progressPercent_updatePercent(param31, '检查所有标签：\x20');
  methodsBody.update_annotationTag_checkTag(Zotero.ZoteroIF["itemsToUpdate" + param31][Zotero.ZoteroIF["current" + param31]], param31, param32, param33);
};
methodsBody.update_annotationTag_checkTag = async function (param34, param35, param36, param37) {
  try {
    let var114 = await Zotero.ZoteroIF.checkAnnotationTag(param34.tag);
    if (var114) {
      let var115 = param34.tag,
        var116 = 0x0,
        var117 = {
          'tag': var115,
          'type': var116
        };
      !JSON.stringify(Zotero.ZoteroIF["_progressData_" + param35]).includes(JSON.stringify(var117)) && (Zotero.ZoteroIF["_progressData_" + param35].push(var117), Zotero.ZoteroIF["counter" + param35]++);
    }
  } catch (_0x2211f1) {
    Zotero.debug(_0x2211f1);
  }
  methodsBody.update_annotationTag_checkNext(param35, param36, param37);
};
methodsBody.update_imageAnnotationTag_checkNext = async function (param38, param39, param40) {
  Zotero.ZoteroIF["numberOfUpdatedItems" + param38]++;
  if (Zotero.ZoteroIF['current' + param38] == Zotero.ZoteroIF["toUpdate" + param38] - 0x1) {
    Zotero.ZoteroIF["progressWindow" + param38].close();
    Zotero.ZoteroIF.progressPercent_resetState(null, param38, param39);
    Zotero.Prefs.set("zoteroif.imageannotationtagsrecent", JSON.stringify(Zotero.ZoteroIF["_progressData_" + param38]));
    param40 === "nested" ? methodsBody.buildNestedView("imageAnnotationTag") : methodsBody.imageAnnotationTag(true);
    return;
  }
  Zotero.ZoteroIF.progressPercent_updatePercent(param38, '检查所有标签：\x20');
  methodsBody.update_imageAnnotationTag_checkTag(Zotero.ZoteroIF["itemsToUpdate" + param38][Zotero.ZoteroIF["current" + param38]], param38, param39, param40);
};
methodsBody.update_imageAnnotationTag_checkTag = async function (param41, param42, param43, param44) {
  try {
    let var118 = await Zotero.ZoteroIF.checkImageAnnotationTag(param41.tag);
    if (var118) {
      let var119 = param41.tag,
        var120 = 0x0,
        var121 = {
          'tag': var119,
          'type': var120
        };
      !JSON.stringify(Zotero.ZoteroIF["_progressData_" + param42]).includes(JSON.stringify(var121)) && (Zotero.ZoteroIF["_progressData_" + param42].push(var121), Zotero.ZoteroIF["counter" + param42]++);
    }
  } catch (_0x27895e) {
    Zotero.debug(_0x27895e);
  }
  methodsBody.update_imageAnnotationTag_checkNext(param42, param43, param44);
};
methodsBody.update_itemTag_checkNext = async function (param45, param46, param47) {
  Zotero.ZoteroIF['numberOfUpdatedItems' + param45]++;
  if (Zotero.ZoteroIF['current' + param45] == Zotero.ZoteroIF['toUpdate' + param45] - 0x1) {
    Zotero.ZoteroIF["progressWindow" + param45].close();
    Zotero.ZoteroIF.progressPercent_resetState(null, param45, param46);
    Zotero.Prefs.set("zoteroif.itemTags", JSON.stringify(Zotero.ZoteroIF["_progressData_" + param45]));
    param47 === "nested" ? methodsBody.buildNestedView('itemTag') : methodsBody.itemTag(true);
    return;
  }
  Zotero.ZoteroIF.progressPercent_updatePercent(param45, "检查所有标签： ");
  methodsBody.update_itemTag_checkTag(Zotero.ZoteroIF['itemsToUpdate' + param45][Zotero.ZoteroIF['current' + param45]], param45, param46, param47);
};
methodsBody.update_itemTag_checkTag = async function (param48, param49, param50, param51) {
  try {
    let var122 = await Zotero.ZoteroIF.checkItemTag(param48.tag);
    if (var122) {
      let var123 = param48.tag,
        var124 = 0x0,
        var125 = {
          'tag': var123,
          'type': var124
        };
      !JSON.stringify(Zotero.ZoteroIF['_progressData_' + param49]).includes(JSON.stringify(var125)) && (Zotero.ZoteroIF["_progressData_" + param49].push(var125), Zotero.ZoteroIF['counter' + param49]++);
    }
  } catch (_0x33540e) {
    Zotero.debug(_0x33540e);
  }
  methodsBody.update_itemTag_checkNext(param49, param50, param51);
};
methodsBody.update_gptNoteTag_checkNext = async function (param52, param53, param54) {
  Zotero.ZoteroIF["numberOfUpdatedItems" + param52]++;
  if (Zotero.ZoteroIF["current" + param52] == Zotero.ZoteroIF["toUpdate" + param52] - 0x1) {
    Zotero.ZoteroIF["progressWindow" + param52].close();
    Zotero.ZoteroIF.progressPercent_resetState(null, param52, param53);
    Zotero.Prefs.set("zoteroif.gptnotetagsrecent", JSON.stringify(Zotero.ZoteroIF["_progressData_" + param52]));
    param54 === 'nested' ? methodsBody.buildNestedView("gptNoteTag") : methodsBody.gptNoteTag(true);
    return;
  }
  Zotero.ZoteroIF.progressPercent_updatePercent(param52, "检查所有标签： ");
  methodsBody.update_gptNoteTag_checkTag(Zotero.ZoteroIF["itemsToUpdate" + param52][Zotero.ZoteroIF["current" + param52]], param52, param53, param54);
};
methodsBody.update_gptNoteTag_checkTag = async function (param55, param56, param57, param58) {
  try {
    let var126 = await Zotero.ZoteroIF.checkGPTNoteTag(param55.tag);
    if (var126) {
      let var127 = param55.tag,
        var128 = 0x0,
        var129 = {
          'tag': var127,
          'type': var128
        };
      !JSON.stringify(Zotero.ZoteroIF["_progressData_" + param56]).includes(JSON.stringify(var129)) && (Zotero.ZoteroIF["_progressData_" + param56].push(var129), Zotero.ZoteroIF["counter" + param56]++);
    }
  } catch (_0xf8fbc3) {
    Zotero.debug(_0xf8fbc3);
  }
  methodsBody.update_gptNoteTag_checkNext(param56, param57, param58);
};
methodsBody.search = function () {
  var var130 = document.getElementById('zoteroif.AnnotationTags.search').value.trim();
  if (var130 === '' && document.getElementById("zoteroif.AnnotationTags.search").placeholder === '') return false;else var130 === '' && document.getElementById("zoteroif.AnnotationTags.search").placeholder != '' && (var130 = document.getElementById("zoteroif.AnnotationTags.search").placeholder, document.getElementById('zoteroif.AnnotationTags.search').value = document.getElementById("zoteroif.AnnotationTags.search").placeholder);
  document.getElementById("zoteroif.nestedAnnotationTags.search").placeholder = var130;
  document.getElementById("zoteroif.AnnotationTags.search").placeholder = var130;
  Zotero.ZoteroIF.lastcardnotestaginput = var130;
  let var131;
  if (document.getElementById("annotationTagButton").getAttribute("default") === 'true') {
    var131 = Zotero.ZoteroIF.returnAnnotationTagsSearch(var130);
    methodsBody.generalView_updateButtonStatus("annotationTag");
  } else {
    if (document.getElementById("imageAnnotationTagButton").getAttribute("default") === "true") {
      var131 = Zotero.ZoteroIF.returnImageAnnotationTagsSearch(var130);
      methodsBody.generalView_updateButtonStatus("imageAnnotationTag");
    } else {
      if (document.getElementById("itemTagButton").getAttribute('default') === 'true') {
        var131 = Zotero.ZoteroIF.returnItemTagsSearch(var130);
        methodsBody.generalView_updateButtonStatus("itemTag");
      } else document.getElementById("gptNoteTagButton").getAttribute("default") === "true" ? (var131 = Zotero.ZoteroIF.returnGPTNoteTagsSearch(var130), methodsBody.generalView_updateButtonStatus("gptNoteTag")) : (var131 = Zotero.ZoteroIF.returnAnnotationTagsSearch(var130), methodsBody.generalView_updateButtonStatus("annotationTag"));
    }
  }
  methodsBody.generalView_clearListbox();
  methodsBody.generalView_buildItemNodes(var131);
  var var132 = document.getElementById("message-label");
  if (document.getElementById("annotationTagButton").getAttribute("default") === "true") var132.textContent = "搜索【" + var130 + "】：共有【" + var131.length + '】个注释标签';else {
    if (document.getElementById("imageAnnotationTagButton").getAttribute("default") === "true") var132.textContent = '搜索【' + var130 + "】：共有【" + var131.length + '】个图片注释标签';else {
      if (document.getElementById("itemTagButton").getAttribute("default") === "true") var132.textContent = "搜索【" + var130 + '】：共有【' + var131.length + "】个条目注释标签";else document.getElementById("gptNoteTagButton").getAttribute("default") === "true" && (var132.textContent = '搜索【' + var130 + "】：共有【" + var131.length + "】个 GPT 笔记标签");
    }
  }
  methodsBody.generalView_updateFilterButtons(true);
};
methodsBody.checkKeyEnter = function (param59) {
  !param59.shiftKey && !param59.ctrlKey && !param59.altKey && !param59.metaKey && param59.keyCode === 0xd && (param59.returnValue = false, param59.preventDefault && param59.preventDefault(), methodsBody.search());
};
methodsBody.checkKeyEnter_nestedView = function (param60) {
  !param60.shiftKey && !param60.ctrlKey && !param60.altKey && !param60.metaKey && param60.keyCode === 0xd && (param60.returnValue = false, param60.preventDefault && param60.preventDefault(), document.getElementById("tagTree").querySelectorAll(".tagSearched").length > 0x1 && document.getElementById("zoteroif.nestedAnnotationTags.search").value.trim() === document._lastSearchTextNestedView ? methodsBody.searchNestedTags_next() : methodsBody.searchNestedTags());
};
methodsBody.acceptSelection = function () {
  Zotero.ZoteroIF.selectAnnotationTagWindow = null;
  var var133 = document.getElementById('generalView-richlistbox-elem');
  let var134 = [];
  for (var var135 = 0x0; var135 < var133.childNodes.length; var135++) {
    var var136 = var133.childNodes[var135];
    var136.firstElementChild.checked && var134.push(var136.firstElementChild.getAttribute("label"));
  }
  if (!var134.length) return Zotero.ZoteroIF.showProgressWindow(0x1388, "温馨提示", '请先选择一个标签！'), false;
  if (var134.length > 0x1) return Zotero.ZoteroIF.showProgressWindow(0x1388, "温馨提示", "请仅选择一个标签！"), false;
  methodsBody.checkTagType(var134[0x0]);
};
methodsBody.selectAll = function (param61) {
  var var137 = document.getElementById("generalView-richlistbox-elem");
  let var138 = 0x0;
  for (var var139 = 0x0; var139 < var137.childNodes.length; var139++) {
    var137.childNodes[var139].querySelector("checkbox").checked = !param61;
    !param61 && var137.childNodes[var139].style.display === "none" && (var137.childNodes[var139].querySelector("checkbox").checked = false, var138++);
  }
};
methodsBody.singleSelect = function (param62) {
  var var140 = document.getElementById('generalView-richlistbox-elem');
  let var141 = 0x0;
  for (var var142 = 0x0; var142 < var140.childNodes.length; var142++) {
    let var143 = var140.childNodes[var142].querySelector("checkbox");
    var143 != param62 && (var143.checked = false);
  }
};
methodsBody.jumpWithDialogOpen = function () {
  var var144 = document.getElementById("generalView-richlistbox-elem");
  let var145 = [];
  for (var var146 = 0x0; var146 < var144.childNodes.length; var146++) {
    var var147 = var144.childNodes[var146];
    var147.firstElementChild.checked && var145.push(var147.firstElementChild.getAttribute('label'));
  }
  if (!var145.length) return Zotero.ZoteroIF.showProgressWindow(0x1388, "温馨提示", "请先选择一个标签！"), false;
  if (var145.length > 0x1) return Zotero.ZoteroIF.showProgressWindow(0x1388, '温馨提示', "请仅选择一个标签！"), false;
  methodsBody.checkTagType(var145[0x0]);
};
methodsBody.quickJump = function (param63) {
  if (!Zotero.Prefs.get('zoteroif.cardNotesDoubleClick')) return;
  methodsBody.checkTagType(param63);
};
methodsBody.checkTagType = function (param64) {
  let var148 = Zotero.Prefs.get("zoteroif.annotationtagsrecent"),
    var149 = Zotero.Prefs.get("zoteroif.imageannotationtagsrecent");
  var var150 = document.getElementById("annotationTagType-image");
  let var151 = param64,
    var152 = 0x0,
    var153 = {
      'tag': var151,
      'type': var152
    };
  if (document.getElementById("itemTagButton").getAttribute('default') === 'true') Zotero.ZoteroIF.queryPapersMatrix('filterByTag', param64);else {
    if (document.getElementById("gptNoteTagButton").getAttribute("default") === "true") Zotero.ZoteroIF.tagGPTCardNotes(param64);else {
      if (document.getElementById("imageAnnotationTagButton").getAttribute('default') === "true") {
        Zotero.Prefs.set("zoteroif.annotationtagtype", "type_imageAnnotationTag");
        Zotero.ZoteroIF.tagImageCardNotes(param64);
      } else document.getElementById("annotationTagButton").getAttribute("default") === "true" ? Zotero.Prefs.get('zoteroif.imageCardNoteSearchFirst') && var149.includes(JSON.stringify(var153)) ? (Zotero.Prefs.set("zoteroif.annotationtagtype", "type_imageAnnotationTag"), Zotero.ZoteroIF.tagImageCardNotes(param64)) : (Zotero.Prefs.set("zoteroif.annotationtagtype", "type_annotationTag"), Zotero.ZoteroIF.tagCardNotes(param64)) : (Zotero.Prefs.set("zoteroif.annotationtagtype", 'type_annotationTag'), Zotero.ZoteroIF.tagCardNotes(param64));
    }
  }
  document.getElementById("tagsGeneralView-button").getAttribute("default") === 'true' ? Zotero.ZoteroIF.lastTagsCardNoteView = 'GeneralView' : Zotero.ZoteroIF.lastTagsCardNoteView = 'NestedView';
  if (document.getElementById("annotationTagButton").getAttribute("default") === "true") Zotero.ZoteroIF.lastTagsCardNotePane = "annotationTagPane";else {
    if (document.getElementById("imageAnnotationTagButton").getAttribute("default") === 'true') Zotero.ZoteroIF.lastTagsCardNotePane = "imageAnnotationTagPane";else {
      if (document.getElementById("itemTagButton").getAttribute("default") === 'true') Zotero.ZoteroIF.lastTagsCardNotePane = 'itemTagPane';else document.getElementById("gptNoteTagButton").getAttribute('default') === "true" ? Zotero.ZoteroIF.lastTagsCardNotePane = "gptNoteTagPane" : Zotero.ZoteroIF.lastTagsCardNotePane = "annotationTagPane";
    }
  }
};
methodsBody.checkTagType_nestedView = function (param65) {
  let var154 = JSON.parse(Zotero.Prefs.get("zoteroif.nestedAnnotationtagsrecent")),
    var155 = JSON.parse(Zotero.Prefs.get("zoteroif.nestedImageannotationtagsrecent"));
  var var156 = document.getElementById('annotationTagType-image');
  if (document.getElementById("itemTagButton-NestedView").getAttribute('default') === 'true') Zotero.ZoteroIF.queryPapersMatrix("filterByTag", param65);else {
    if (document.getElementById("gptNoteTagButton-NestedView").getAttribute('default') === 'true') Zotero.ZoteroIF.tagGPTCardNotes(param65);else {
      if (document.getElementById("imageAnnotationTagButton-NestedView").getAttribute("default") === "true") {
        Zotero.Prefs.set('zoteroif.annotationtagtype', "type_imageAnnotationTag");
        Zotero.ZoteroIF.tagImageCardNotes(param65);
      } else document.getElementById("annotationTagButton-NestedView").getAttribute("default") === "true" ? Zotero.Prefs.get("zoteroif.imageCardNoteSearchFirst") && var155.includes(param65) ? (Zotero.Prefs.set("zoteroif.annotationtagtype", 'type_imageAnnotationTag'), Zotero.ZoteroIF.tagImageCardNotes(param65)) : (Zotero.Prefs.set('zoteroif.annotationtagtype', "type_annotationTag"), Zotero.ZoteroIF.tagCardNotes(param65)) : (Zotero.Prefs.set('zoteroif.annotationtagtype', "type_annotationTag"), Zotero.ZoteroIF.tagCardNotes(param65));
    }
  }
  document.getElementById("tagsGeneralView-button").getAttribute("default") === "true" ? Zotero.ZoteroIF.lastTagsCardNoteView = "GeneralView" : Zotero.ZoteroIF.lastTagsCardNoteView = "NestedView";
  if (document.getElementById("annotationTagButton-NestedView").getAttribute("default") === "true") Zotero.ZoteroIF.lastTagsCardNotePane = "annotationTagPane";else {
    if (document.getElementById('imageAnnotationTagButton-NestedView').getAttribute('default') === 'true') Zotero.ZoteroIF.lastTagsCardNotePane = "imageAnnotationTagPane";else {
      if (document.getElementById('itemTagButton-NestedView').getAttribute("default") === 'true') Zotero.ZoteroIF.lastTagsCardNotePane = "itemTagPane";else document.getElementById('gptNoteTagButton-NestedView').getAttribute('default') === "true" ? Zotero.ZoteroIF.lastTagsCardNotePane = 'gptNoteTagPane' : Zotero.ZoteroIF.lastTagsCardNotePane = "annotationTagPane";
    }
  }
};
methodsBody.initContextMenu_GeneralView = function (param66) {
  let var157 = document.querySelector("#richlistitem-contextmenu");
  !var157 && (var157 = window.document.createXULElement("menupopup"), var157.id = "richlistitem-contextmenu", document.documentElement.appendChild(var157), var157 = document.documentElement.lastElementChild.firstElementChild);
};
methodsBody.buildContextMenu_GeneralView = function (param67) {
  let var158 = param67.target.closest("richlistitem")?.["querySelector"]("checkbox")['label'],
    var159 = document.querySelector('#richlistitem-contextmenu');
  !var159 && (var159 = window.document.createXULElement("menupopup"), var159.id = "richlistitem-contextmenu", document.documentElement.appendChild(var159), var159 = document.documentElement.lastElementChild.firstElementChild);
  let var160 = var159.firstElementChild;
  while (var160) {
    var160.remove();
    var160 = var159.firstElementChild;
  }
  let var161 = window.document.createXULElement("menuitem");
  return var161.setAttribute("label", "拷贝标签"), var161.addEventListener("command", () => {
    Zotero.ZoteroIF.copy2Clipboard(var158);
    Zotero.ZoteroIF.showProgressWindow(0x7d0, "拷贝标签【AI4paper】", '已拷贝标签【' + var158 + '】');
  }), var159.appendChild(var161), var159.appendChild(window.document.createXULElement("menuseparator")), var161 = window.document.createXULElement("menuitem"), var161.setAttribute('label', "检索所属文献"), var161.addEventListener('command', () => {
    Zotero.ZoteroIF.showItemsBasedOnTag(var158);
  }), var159.appendChild(var161), var159.appendChild(window.document.createXULElement('menuseparator')), var161 = window.document.createXULElement("menuitem"), var161.setAttribute('label', '跳转至【导入注释】'), var161.addEventListener("command", () => {
    Zotero.ZoteroIF.openDialogAdvancedSearch_importAnnotations(var158);
    Zotero.ZoteroIF.processAdvancedSearch_importAnnotations();
  }), var159.appendChild(var161), var161 = window.document.createXULElement("menuitem"), var161.setAttribute("label", "在【智能文献矩阵】中查询"), var161.addEventListener("command", () => {
    Zotero.ZoteroIF.queryPapersMatrix("filterByTag", var158);
  }), var159.appendChild(var161), var159;
};
methodsBody.run = function () {
  Zotero.Prefs.set('zoteroif.cardNotesDoubleClick', document.getElementById("cardNotes-doubleClick-enable").checked);
};
methodsBody.generalView_buildItemNodes = function (param68) {
  var var162 = document.getElementById('generalView-richlistbox-elem');
  for (var var163 in param68) {
    var var164 = param68[var163],
      var165,
      var166 = false;
    var164 && typeof var164 == "object" && var164.title !== undefined ? (var165 = var164.title, var166 = !!var164.checked) : var165 = var164;
    let var167 = document.createXULElement("richlistitem"),
      var168 = document.createXULElement("checkbox");
    var168.checked = var166;
    var168.label = var165;
    var168.setAttribute("native", "true");
    var167.setAttribute('value', var163);
    var167.append(var168);
    var167.addEventListener("click", _0x38d557 => {
      _0x38d557.target == var167 && (var168.checked = !var168.checked);
      var168.checked && methodsBody.singleSelect(var168);
      if (_0x38d557.shiftKey) {
        Zotero.ZoteroIF.showItemsBasedOnTag(_0x38d557.target.closest("richlistitem")?.["querySelector"]("checkbox")["label"]);
        return;
      }
      if (_0x38d557.button === 0x2) {
        let var169 = methodsBody.buildContextMenu_GeneralView(_0x38d557);
        var169 && var169.openPopup(var167, 'after_start', 0x46, 0x0, false, false);
      }
    });
    var var170 = 0x0,
      var171;
    var167.addEventListener("click", function (param69) {
      var170++;
      if (var170 === 0x1) var171 = setTimeout(function () {
        var170 = 0x0;
      }, 0x12c);else {
        if (var170 === 0x2) {
          clearTimeout(var171);
          var170 = 0x0;
          let var172 = param69.target.closest("richlistitem")?.["querySelector"]("checkbox")["label"];
          methodsBody.quickJump(var172);
        }
      }
    });
    var162.append(var167);
  }
  var162.itemCount === 0x1 && (var162.getItemAtIndex(0x0).firstElementChild.checked = true);
};
methodsBody.generalView_clearListbox = function () {
  var var173 = document.getElementById("generalView-richlistbox-elem");
  let var174 = var173.firstElementChild;
  while (var174) {
    var174.remove();
    var174 = var173.firstElementChild;
  }
};
methodsBody.generalView_updateTagsNumMessage = function (param70, param71) {
  let var175 = {
    'annotationTag': "注释标签",
    'imageAnnotationTag': '图片注释标签',
    'itemTag': "条目标签",
    'gptNoteTag': " GPT 笔记标签"
  };
  document.getElementById("message-label").textContent = '共有【' + param70.length + '】个' + var175[param71];
  document.getElementById("annotationTagType-image").setAttribute('src', "chrome://zoteroif/content/icons/" + (param71 === "gptNoteTag" ? "robot" : param71) + ".png");
};
methodsBody.nestedView_updateTagsNumMessage = function (param72, param73) {
  let var176 = {
    'annotationTag': "注释标签",
    'imageAnnotationTag': '图片注释标签',
    'itemTag': "条目标签",
    'gptNoteTag': " GPT 笔记标签"
  };
  document.getElementById("message-label-nestedView").textContent = "共有【" + param72.length + '】个' + var176[param73];
  document.getElementById('annotationTagType-image').setAttribute("src", "chrome://zoteroif/content/icons/" + (param73 === 'gptNoteTag' ? "robot" : param73) + ".png");
};
methodsBody.generalView_updateButtonStatus = function (param74) {
  let var177 = ['annotationTag', "imageAnnotationTag", "itemTag", "gptNoteTag"];
  for (let var178 of var177) {
    var178 === param74 ? document.getElementById(var178 + "Button")?.['setAttribute']("default", true) : document.getElementById(var178 + "Button")?.["setAttribute"]("default", false);
  }
  document.getElementById('annotationTagType-image').setAttribute("src", 'chrome://zoteroif/content/icons/' + (param74 === "gptNoteTag" ? "robot" : param74) + ".png");
};
methodsBody.nestedView_updateButtonStatus = function (param75) {
  let var179 = ['annotationTag', 'imageAnnotationTag', "itemTag", "gptNoteTag"];
  for (let var180 of var179) {
    var180 === param75 ? document.getElementById(var180 + 'Button-NestedView')?.["setAttribute"]("default", true) : document.getElementById(var180 + "Button-NestedView")?.["setAttribute"]('default', false);
  }
  document.getElementById("annotationTagType-image").setAttribute("src", "chrome://zoteroif/content/icons/" + (param75 === 'gptNoteTag' ? "robot" : param75) + ".png");
};
methodsBody.generalView_updateFilterButtons = function (param76, param77) {
  let var181 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'OT'];
  for (let var182 of var181) {
    let var183 = document.getElementById('tagFilter-' + var182),
      var184 = "chrome://zoteroif/content/icons/" + var182 + '.png',
      var185 = "chrome://zoteroif/content/icons/" + var182 + "-select.png";
    param76 ? (var183.setAttribute("src", var184), var183.onmouseover = () => var183.style.transform = 'scale(1.3)', var183.onmouseout = () => var183.style.transform = "scale(1)") : var182 === param77 ? (var183.setAttribute("src", var185), var183.style.transform = "scale(1)", var183.onmouseover = () => {}, var183.onmouseout = () => {}) : (var183.setAttribute("src", var184), var183.onmouseover = () => var183.style.transform = "scale(1.3)", var183.onmouseout = () => var183.style.transform = 'scale(1)');
  }
};