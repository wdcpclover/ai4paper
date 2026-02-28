// ai4paper-tags.js - Tag management module
// Extracted from ai4paper.js (Phase 12)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Tag Menu Registration & UI Setup ===
  'registerTagSelectorViewMenu': function () {
    let var408 = window.document.querySelector("#tag-selector-view-settings-menu");
    if (!var408 || var408.getAttribute("zotero-if-TagSelectorViewMenu-set") === 'true') {
      return false;
    }
    var408.setAttribute('zotero-if-TagSelectorViewMenu-set', 'true');
    let var409 = window.document.createXULElement('menuseparator');
    var408.appendChild(var409);
    this._store_added_tagMenu_elements.push(var409);
    let var410 = window.document.createXULElement("menuitem");
    var410.setAttribute('id', 'zotero-if-TagSelectorView-Menu-displayItemTags');
    var410.setAttribute('label', "条目标签");
    var410.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_displayItemTags();");
    var408.appendChild(var410);
    this._store_added_tagMenu_elements.push(var410);
    var410 = window.document.createXULElement('menuitem');
    var410.setAttribute('id', "zotero-if-TagSelectorView-Menu-updateItemTags");
    var410.setAttribute("label", "刷新条目标签");
    var410.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_updateItemTags();");
    var408.appendChild(var410);
    this._store_added_tagMenu_elements.push(var410);
    var409 = window.document.createXULElement("menuseparator");
    var408.appendChild(var409);
    this._store_added_tagMenu_elements.push(var409);
    var410 = window.document.createXULElement('menuitem');
    var410.setAttribute('id', 'zotero-if-TagSelectorView-Menu-displayAnnotationTags');
    var410.setAttribute("label", "注释标签");
    var410.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_displayAnnotationTags();");
    var408.appendChild(var410);
    this._store_added_tagMenu_elements.push(var410);
    var410 = window.document.createXULElement("menuitem");
    var410.setAttribute('id', "zotero-if-TagSelectorView-Menu-updateAnnotationTags");
    var410.setAttribute("label", "刷新注释标签");
    var410.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_updateAnnotationTags();");
    var408.appendChild(var410);
    this._store_added_tagMenu_elements.push(var410);
    var409 = window.document.createXULElement("menuseparator");
    var408.appendChild(var409);
    this._store_added_tagMenu_elements.push(var409);
    var410 = window.document.createXULElement('menuitem');
    var410.setAttribute('id', "zotero-if-TagSelectorView-Menu-displayImageAnnotationTags");
    var410.setAttribute("label", "图片注释标签");
    var410.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_displayImageAnnotationTags();");
    var408.appendChild(var410);
    this._store_added_tagMenu_elements.push(var410);
    var410 = window.document.createXULElement("menuitem");
    var410.setAttribute('id', "zotero-if-TagSelectorView-Menu-updateImageAnnotationTags");
    var410.setAttribute("label", "刷新图片注释标签");
    var410.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_updateImageAnnotationTags();");
    var408.appendChild(var410);
    this._store_added_tagMenu_elements.push(var410);
    var409 = window.document.createXULElement("menuseparator");
    var408.appendChild(var409);
    this._store_added_tagMenu_elements.push(var409);
    var410 = window.document.createXULElement("menuitem");
    var410.setAttribute('id', "zotero-if-TagSelectorView-Menu-updateAutomaticTags");
    var410.setAttribute("label", "刷新自动标签");
    var410.setAttribute("oncommand", "Zotero.AI4Paper.updateAutomaticTags();");
    var408.appendChild(var410);
    this._store_added_tagMenu_elements.push(var410);
    var410 = window.document.createXULElement("menuitem");
    var410.setAttribute('id', "zotero-if-TagSelectorView-Menu-deleteAutomaticTags");
    var410.setAttribute("label", "删除自动标签");
    var410.setAttribute("oncommand", 'Zotero.AI4Paper.deleteAutomaticTags();');
    var408.appendChild(var410);
    this._store_added_tagMenu_elements.push(var410);
    var409 = window.document.createXULElement("menuseparator");
    var408.appendChild(var409);
    this._store_added_tagMenu_elements.push(var409);
    var410 = window.document.createXULElement("menuitem");
    var410.setAttribute('id', 'zotero-if-TagSelectorView-Menu-deleteTagsBatch');
    var410.setAttribute("label", "批量删除标签");
    var410.setAttribute("oncommand", "Zotero.AI4Paper.deleteTagsBatch();");
    var408.appendChild(var410);
    this._store_added_tagMenu_elements.push(var410);
    var409 = window.document.createXULElement("menuseparator");
    var408.appendChild(var409);
    this._store_added_tagMenu_elements.push(var409);
    var410 = window.document.createXULElement('menuitem');
    var410.setAttribute('id', "zotero-if-TagSelectorView-Menu-renameTagsBatch");
    var410.setAttribute("label", "批量重命名标签");
    var410.setAttribute("oncommand", 'Zotero.AI4Paper.renameTagsBatch();');
    var408.appendChild(var410);
    this._store_added_tagMenu_elements.push(var410);
  },
  'registerTagMenu': function () {
    let var411 = window.document.querySelector("#tag-menu");
    if (!var411 || var411.getAttribute("zotero-if-TagMenu-set") === "true") return false;
    var411.setAttribute("zotero-if-TagMenu-set", "true");
    let var412 = window.document.createXULElement("menuseparator");
    var411.appendChild(var412);
    this._store_added_tagMenu_elements.push(var412);
    let var413 = window.document.createXULElement("menuitem");
    var413.setAttribute('id', "zotero-if-tag-menu-tagCardNotes");
    var413.setAttribute('label', "跳转卡片笔记");
    var413.setAttribute("oncommand", "Zotero.AI4Paper.tagCardNotes(ZoteroPane_Local.tagSelector.contextTag.name);");
    var411.appendChild(var413);
    this._store_added_tagMenu_elements.push(var413);
    var413 = window.document.createXULElement("menuitem");
    var413.setAttribute('id', "zotero-if-tag-menu-tagImageCardNotes");
    var413.setAttribute("label", "跳转图卡笔记");
    var413.setAttribute("oncommand", "Zotero.AI4Paper.tagImageCardNotes(ZoteroPane_Local.tagSelector.contextTag.name);");
    var411.appendChild(var413);
    this._store_added_tagMenu_elements.push(var413);
    var413 = window.document.createXULElement("menuitem");
    var413.setAttribute('id', "zotero-if-tag-menu-queryTagInPapersMatrix");
    var413.setAttribute("label", '跳转智能文献矩阵');
    var413.setAttribute("oncommand", 'Zotero.AI4Paper.queryPapersMatrix(\x27filterByTag\x27,\x20ZoteroPane_Local.tagSelector.contextTag.name);');
    var411.appendChild(var413);
    this._store_added_tagMenu_elements.push(var413);
  },
  'unregisterAllTagMenus': function () {
    for (let var414 of this._store_added_tagMenu_elements) {
      if (var414) var414.remove();
    }
    this._store_added_tagMenu_elements = [];
    let var415 = window.document.querySelector('#tag-menu');
    var415 && var415.setAttribute("zotero-if-TagMenu-set", "false");
    var415 = window.document.querySelector("#tag-selector-view-settings-menu");
    if (var415) {
      var415.setAttribute("zotero-if-TagSelectorViewMenu-set", 'false');
    }
  },

  // === Block B: Tag Add/Delete/Recent + checkAnnotatationItem ===
  'addAnnotationTag': function (param131, param132) {
    let var1313 = Zotero.AI4Paper.getFunMetaTitle();
    if (!var1313) return;
    let var1314 = Zotero.Items.get(param131);
    if (!var1314) return false;else {
      if (var1314.itemType === "annotation") {
        let _0x490a3a = Zotero.Tags.getName(param132);
        _0x490a3a && (Zotero.AI4Paper.add2AnnotatationTags(_0x490a3a), Zotero.AI4Paper.add2RecentTags(_0x490a3a), var1314.annotationType === "image" && Zotero.AI4Paper.add2ImageAnnotatationTags(_0x490a3a));
      } else {
        let _0x6cbd4b = Zotero.Tags.getName(param132);
        _0x6cbd4b && (Zotero.AI4Paper.add2ItemTags(_0x6cbd4b), Zotero.AI4Paper.add2RecentItemTags(_0x6cbd4b));
      }
    }
  },
  'add2ItemTags': function (param133) {
    let var1317 = Zotero.Prefs.get("ai4paper.itemTags"),
      var1318 = param133,
      var1319 = 0x0,
      var1320 = {
        'tag': var1318,
        'type': var1319
      };
    if (!var1317.includes(JSON.stringify(var1320))) {
      if (Zotero.Prefs.get("ai4paper.itemTags").length === 0x0) var var1321 = [];else {
        var var1321 = JSON.parse(Zotero.Prefs.get('ai4paper.itemTags'));
      }
      return var1321.push(var1320), Zotero.Prefs.set('ai4paper.itemTags', JSON.stringify(var1321)), true;
    }
  },
  'add2AnnotatationTags': function (param134) {
    let var1322 = Zotero.Prefs.get("ai4paper.annotationtagsrecent"),
      var1323 = param134,
      var1324 = 0x0,
      var1325 = {
        'tag': var1323,
        'type': var1324
      };
    if (!var1322.includes(JSON.stringify(var1325))) {
      if (Zotero.Prefs.get('ai4paper.annotationtagsrecent').length === 0x0) var var1326 = [];else var var1326 = JSON.parse(Zotero.Prefs.get('ai4paper.annotationtagsrecent'));
      return var1326.push(var1325), Zotero.Prefs.set("ai4paper.annotationtagsrecent", JSON.stringify(var1326)), true;
    }
  },
  'add2ImageAnnotatationTags': function (param135) {
    let var1327 = Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"),
      var1328 = param135,
      var1329 = 0x0,
      var1330 = {
        'tag': var1328,
        'type': var1329
      };
    if (!var1327.includes(JSON.stringify(var1330))) {
      if (Zotero.Prefs.get("ai4paper.imageannotationtagsrecent").length === 0x0) var var1331 = [];else var var1331 = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
      return var1331.push(var1330), Zotero.Prefs.set('ai4paper.imageannotationtagsrecent', JSON.stringify(var1331)), true;
    }
  },
  'add2GPTNoteTags': function (param136) {
    let var1332 = Zotero.Prefs.get("ai4paper.gptnotetagsrecent"),
      var1333 = '🤖️/' + param136,
      var1334 = 0x0,
      var1335 = {
        'tag': var1333,
        'type': var1334
      };
    if (!var1332.includes(JSON.stringify(var1335))) {
      if (Zotero.Prefs.get("ai4paper.gptnotetagsrecent").length === 0x0) var var1336 = [];else var var1336 = JSON.parse(Zotero.Prefs.get("ai4paper.gptnotetagsrecent"));
      return var1336.push(var1335), Zotero.Prefs.set("ai4paper.gptnotetagsrecent", JSON.stringify(var1336)), true;
    }
  },
  'checkAnnotatationItem': function (param137, param138) {
    let var1337 = Zotero.AI4Paper.getFunMetaTitle();
    if (!var1337) {
      return;
    }
    let var1338 = Zotero.Items.get(param137);
    if (!var1338) return false;else var1338.itemType === "annotation" ? (Zotero.AI4Paper.deleteFromAnnotatationTags(param138), var1338.annotationType === "image" && Zotero.AI4Paper.deleteFromImageAnnotatationTags(param138)) : Zotero.AI4Paper.deleteFromItemTags(param138);
  },
  'deleteFromItemTags': async function (param139) {
    let var1339 = Zotero.Prefs.get("ai4paper.itemTags"),
      var1340 = encodeURIComponent(param139).substring(0x3),
      var1341 = decodeURIComponent(var1340.substring(0x0, var1340.length - 0x3)),
      var1342 = 0x0,
      var1343 = {
        'tag': var1341,
        'type': var1342
      },
      var1344 = await Zotero.AI4Paper.checkItemTag(var1341);
    if (!var1344) {
      if (var1339.includes(JSON.stringify(var1343))) {
        let var1345 = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags"));
        for (let var1346 = 0x0; var1346 < var1345.length; var1346++) {
          if (var1345[var1346].tag === var1341) return var1345.splice(var1346, 0x1), Zotero.Prefs.set("ai4paper.itemTags", JSON.stringify(var1345)), true;
        }
      }
    }
  },
  'deleteFromAnnotatationTags': async function (param140) {
    let var1347 = Zotero.Prefs.get('ai4paper.annotationtagsrecent'),
      var1348 = encodeURIComponent(param140).substring(0x3),
      var1349 = decodeURIComponent(var1348.substring(0x0, var1348.length - 0x3)),
      var1350 = 0x0,
      var1351 = {
        'tag': var1349,
        'type': var1350
      },
      var1352 = await Zotero.AI4Paper.checkAnnotationTag(var1349);
    if (!var1352) {
      if (var1347.includes(JSON.stringify(var1351))) {
        let _0x7b71f8 = JSON.parse(Zotero.Prefs.get('ai4paper.annotationtagsrecent'));
        for (let var1354 = 0x0; var1354 < _0x7b71f8.length; var1354++) {
          if (_0x7b71f8[var1354].tag === var1349) {
            return _0x7b71f8.splice(var1354, 0x1), Zotero.Prefs.set('ai4paper.annotationtagsrecent', JSON.stringify(_0x7b71f8)), true;
          }
        }
      }
    }
  },
  'deleteFromImageAnnotatationTags': async function (param141) {
    let var1355 = Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"),
      var1356 = encodeURIComponent(param141).substring(0x3),
      var1357 = decodeURIComponent(var1356.substring(0x0, var1356.length - 0x3)),
      var1358 = 0x0,
      var1359 = {
        'tag': var1357,
        'type': var1358
      },
      var1360 = await Zotero.AI4Paper.checkAnnotationTag(var1357);
    if (!var1360) {
      if (var1355.includes(JSON.stringify(var1359))) {
        let var1361 = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
        for (let var1362 = 0x0; var1362 < var1361.length; var1362++) {
          if (var1361[var1362].tag === var1357) {
            return var1361.splice(var1362, 0x1), Zotero.Prefs.set("ai4paper.imageannotationtagsrecent", JSON.stringify(var1361)), true;
          }
        }
      }
    }
  },
  'add2RecentItemTags': function (param142) {
    let var1363 = Zotero.Prefs.get("ai4paper.recentlyAddedItemTags"),
      var1364 = var1363.split("😊🎈🍓");
    if (!var1364.includes(param142)) {
      if (var1364.length === 0x1 && var1364[0x0] === '') var1364 = [param142];else {
        var1364.unshift(param142);
      }
    } else {
      let var1365 = var1364.indexOf(param142);
      var1364.splice(var1365, 0x1);
      var1364.unshift(param142);
    }
    let var1366 = Zotero.AI4Paper.letDOI(),
      var1367 = [];
    for (let var1368 = 0x0; var1368 < 0x64; var1368++) {
      var1364[var1368] != undefined && var1367.push(var1364[var1368]);
    }
    var1366 && Zotero.Prefs.set('ai4paper.recentlyAddedItemTags', var1367.join("😊🎈🍓"));
  },
  'add2RecentTags': function (param143) {
    let var1369 = Zotero.Prefs.get("ai4paper.recentlyaddedTags"),
      var1370 = var1369.split("😊🎈🍓");
    if (!var1370.includes(param143)) var1370.length === 0x1 && var1370[0x0] === '' ? var1370 = [param143] : var1370.unshift(param143);else {
      let _0x484621 = var1370.indexOf(param143);
      var1370.splice(_0x484621, 0x1);
      var1370.unshift(param143);
    }
    let var1372 = Zotero.AI4Paper.letDOI(),
      var1373 = [];
    for (let var1374 = 0x0; var1374 < 0x64; var1374++) {
      var1370[var1374] != undefined && var1373.push(var1370[var1374]);
    }
    var1372 && Zotero.Prefs.set("ai4paper.recentlyaddedTags", var1373.join("😊🎈🍓"));
  },
  'add2RecentGPTNoteTags': function (param144) {
    param144 = "🤖️/" + param144;
    let var1375 = Zotero.Prefs.get('ai4paper.recentlyaddedGPTNoteTags'),
      var1376 = var1375.split("😊🎈🍓");
    if (!var1376.includes(param144)) var1376.length === 0x1 && var1376[0x0] === '' ? var1376 = [param144] : var1376.unshift(param144);else {
      let _0x10f17d = var1376.indexOf(param144);
      var1376.splice(_0x10f17d, 0x1);
      var1376.unshift(param144);
    }
    let var1378 = Zotero.AI4Paper.letDOI(),
      var1379 = [];
    for (let var1380 = 0x0; var1380 < 0x64; var1380++) {
      var1376[var1380] != undefined && var1379.push(var1376[var1380]);
    }
    var1378 && Zotero.Prefs.set("ai4paper.recentlyaddedGPTNoteTags", var1379.join('😊🎈🍓'));
  },

  // === Block C: getItemTags ===
  'getItemTags': function (param158) {
    let var1479 = '',
      var1480 = param158.getTags();
    if (var1480.length != 0x0) {
      var1479 = '';
      for (var var1481 = 0x0; var1481 < var1480.length; var1481++) {
        let var1482 = var1480[var1481].tag;
        if (var1482.substring(var1482.length - 0x3, var1482.length) != '\x20📝') {
          Zotero.Prefs.get('ai4paper.tagspunctuationoptimazation') && (var1482 = var1482.replace(/\(/g, '（'), var1482 = var1482.replace(/\)/g, '）'), var1482 = var1482.replace(/—/g, '_'), var1482 = var1482.replace(/[\u201c|\u201d|\u2018|\u2019]/g, '_'), var1482 = var1482.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\?]/g, '_'));
          if (['📒', "/PDF_auto_download", '/citing', '/refs', "Researcher_App"].includes(var1482)) continue;
          var1479 += '#' + var1482;
          if (var1481 + 0x1 != var1480.length) {
            var1479 += '\x20';
          }
        }
      }
      return var1479;
    } else return var1479;
  },

  // === Block D: getItemTagsYAML ===
  'getItemTagsYAML': function (param198) {
    try {
      let var1717 = param198.getTags().map(_0x4d3307 => _0x4d3307.tag).filter(_0x390027 => _0x390027 != '📒'),
        var1718 = [];
      for (let var1719 of var1717) {
        var1719.substring(var1719.length - 0x3, var1719.length) === " 📝" && (var1719 = var1719.substring(0x0, var1719.length - 0x3), Zotero.Prefs.get('ai4paper.nestedtags') ? var1719 = "📝/" + var1719 : var1719 = var1719 + " 📝");
        var1719 = var1719.replace(/\(/g, '（').replace(/\)/g, '）').replace(/—/g, '_').replace(/[\u201c|\u201d|\u2018|\u2019]/g, '_').replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\?]/g, '_');
        var1718.push(var1719);
      }
      return '[' + var1718.join(',\x20') + ']';
    } catch (_0x58f5df) {
      return '[]';
    }
  },

  // === Block E: addReadingTag ===
  'addReadingTag': async function (param213) {
    let var1886 = param213.parentItem.parentItem;
    if (var1886.hasTag(this.readingTag) || var1886.hasTag(this.doneTag)) {
      return false;
    }
    if (var1886 === undefined || !var1886.isRegularItem()) return false;
    var1886.addTag(this.readingTag);
    await var1886.saveTx();
    var1886.removeTag(this.unreadTag);
    await var1886.saveTx();
  },

  // === Block F: jump2TagCardNotes ===
  'jump2TagCardNotes': function (param254) {
    let var2093 = Zotero.Prefs.get("ai4paper.annotationtagsrecent"),
      var2094 = Zotero.Prefs.get('ai4paper.imageannotationtagsrecent'),
      var2095 = param254,
      var2096 = 0x0,
      var2097 = {
        'tag': var2095,
        'type': var2096
      };
    if (var2094.includes(JSON.stringify(var2097))) Zotero.AI4Paper.tagImageCardNotes(param254);else var2093.includes(JSON.stringify(var2097)) ? Zotero.AI4Paper.tagCardNotes(param254) : Zotero.AI4Paper.tagCardNotes(param254);
  },

  // === Block G: Tag Select/Return/Filter/Search ===
  'openSelectTagWindow': async function (param679) {
    let var3675 = Zotero.AI4Paper.getFunMetaTitle();
    if (!var3675) {
      return;
    }
    if (Zotero.Prefs.get("ai4paper.annotationtagsrecent").length === 0x0) {
      var var3676 = [];
    } else var var3676 = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent"));
    let var3677 = [];
    for (let var3678 of var3676) {
      var3677.push(var3678.tag);
    }
    var3677.sort((_0x3e427a, _0x4f9712) => {
      return _0x3e427a.localeCompare(_0x4f9712, 'zh');
    });
    let var3679 = Zotero.AI4Paper.openDialogByType_modal('selectTags', true);
    if (!var3679) {
      return null;
    }
    if (!var3679.includes('🏷️')) var var3680 = [var3679.trim()];else {
      var3679.trim().indexOf("🏷️") != 0x0 && (var3679 = "🏷️" + var3679.trim());
      var var3680 = var3679.trim().substring(0x3).split("🏷️");
    }
    for (let var3681 of var3680) {
      param679.addTag(var3681);
      await param679.saveTx();
    }
  },
  'openSelectGPTNoteTagWindow': async function (param680) {
    let var3682 = Zotero.AI4Paper.getFunMetaTitle();
    if (!var3682) return;
    let var3683 = Zotero.AI4Paper.openDialogByType_modal("selectGPTTag");
    if (!var3683) {
      return null;
    }
    var var3684 = [];
    !var3683.includes("🏷️") ? var3684 = [var3683.trim()] : (var3683.trim().indexOf("🏷️") != 0x0 && (var3683 = "🏷️" + var3683.trim()), var3684 = var3683.trim().substring(0x3).split("🏷️"));
    if (param680) {
      let _0x5e5b92 = param680.value;
      if (_0x5e5b92) {
        let _0x4a144b = _0x5e5b92.split('\x0a');
        var3684 = var3684.filter(_0x2480b8 => !_0x4a144b.includes(_0x2480b8));
      }
      var3684.length && (param680.value = _0x5e5b92 ? _0x5e5b92 + '\x0a' + var3684.join('\x0a') : var3684.join('\x0a'));
    }
  },
  'openDialog_tagsManager': function () {
    let var3687 = Zotero.AI4Paper.getFunMetaTitle();
    if (!var3687) return;
    Zotero.Prefs.get("ai4paper.annotationtagsrecent").length === 0x0 && Zotero.AI4Paper.showProgressWindow(0x1388, "温馨提示", "尚未刷新注释标签，或注释标签数量为 0！");
    Zotero.AI4Paper.openDialogByType("tagsManager");
  },
  'returnItemTags': function () {
    if (Zotero.Prefs.get("ai4paper.itemTags").length === 0x0) {
      var var3688 = [];
    } else {
      var var3688 = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags"));
    }
    let var3689 = [];
    for (let var3690 of var3688) {
      var3689.push(var3690.tag);
    }
    return var3689.sort((_0x4a87b3, _0xb1b882) => {
      return _0x4a87b3.localeCompare(_0xb1b882, 'zh');
    });
  },
  'returnAnnotationTags': function () {
    if (Zotero.Prefs.get('ai4paper.annotationtagsrecent').length === 0x0) {
      var var3691 = [];
    } else var var3691 = JSON.parse(Zotero.Prefs.get('ai4paper.annotationtagsrecent'));
    let var3692 = [];
    for (let var3693 of var3691) {
      var3692.push(var3693.tag);
    }
    return var3692.sort((_0x534a01, _0x581695) => {
      return _0x534a01.localeCompare(_0x581695, 'zh');
    });
  },
  'returnImageAnnotationTags': function () {
    if (Zotero.Prefs.get("ai4paper.imageannotationtagsrecent").length === 0x0) {
      var var3694 = [];
    } else var var3694 = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
    let var3695 = [];
    for (let var3696 of var3694) {
      var3695.push(var3696.tag);
    }
    return var3695.sort((_0x5caa4e, _0x3299fe) => {
      return _0x5caa4e.localeCompare(_0x3299fe, 'zh');
    });
  },
  'returnGPTNoteTags': function () {
    if (Zotero.Prefs.get("ai4paper.gptnotetagsrecent").length === 0x0) var var3697 = [];else var var3697 = JSON.parse(Zotero.Prefs.get("ai4paper.gptnotetagsrecent"));
    let var3698 = [];
    for (let var3699 of var3697) {
      var3698.push(var3699.tag);
    }
    return var3698.sort((_0xa6cea, _0x830087) => {
      return _0xa6cea.localeCompare(_0x830087, 'zh');
    });
  },
  'returnItemTagsFilter': function (param681) {
    if (Zotero.Prefs.get("ai4paper.itemTags").length === 0x0) var var3700 = [];else {
      var var3700 = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags"));
    }
    let var3701 = [];
    for (let var3702 of var3700) {
      let _0x347684 = var3702.tag,
        _0x3eb416 = Zotero.AI4Paper.checkENZH(_0x347684.substring(0x0, 0x1));
      if (_0x3eb416 === 'en') _0x347684.substring(0x0, 0x1).toUpperCase() === param681 && var3701.push(var3702.tag);else {
        if (_0x3eb416 === 'zh') {
          let _0x46d6bb = Zotero.AI4Paper.Pinyin.getWordsCode(_0x347684);
          _0x46d6bb != '' && (_0x46d6bb = _0x46d6bb.substring(0x0, 0x1).toUpperCase(), _0x46d6bb == param681 && var3701.push(var3702.tag));
        } else param681 === 'OT' && var3701.push(var3702.tag);
      }
    }
    return var3701.sort((_0x1f0d9c, _0x42bc14) => {
      return _0x1f0d9c.localeCompare(_0x42bc14, 'zh');
    });
  },
  'returnAnnotationTagsFilter': function (param682) {
    if (Zotero.Prefs.get('ai4paper.annotationtagsrecent').length === 0x0) var var3706 = [];else var var3706 = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent"));
    let var3707 = [];
    for (let var3708 of var3706) {
      let _0x327a76 = var3708.tag,
        _0x36f26f = Zotero.AI4Paper.checkENZH(_0x327a76.substring(0x0, 0x1));
      if (_0x36f26f === 'en') {
        _0x327a76.substring(0x0, 0x1).toUpperCase() === param682 && var3707.push(var3708.tag);
      } else {
        if (_0x36f26f === 'zh') {
          let var3711 = Zotero.AI4Paper.Pinyin.getWordsCode(_0x327a76);
          var3711 != '' && (var3711 = var3711.substring(0x0, 0x1).toUpperCase(), var3711 == param682 && var3707.push(var3708.tag));
        } else param682 === 'OT' && var3707.push(var3708.tag);
      }
    }
    return var3707.sort((_0xe448e8, _0x3e6783) => {
      return _0xe448e8.localeCompare(_0x3e6783, 'zh');
    });
  },
  'returnImageAnnotationTagsFilter': function (param683) {
    if (Zotero.Prefs.get('ai4paper.imageannotationtagsrecent').length === 0x0) {
      var var3712 = [];
    } else var var3712 = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
    let var3713 = [];
    for (let var3714 of var3712) {
      let var3715 = var3714.tag,
        var3716 = Zotero.AI4Paper.checkENZH(var3715.substring(0x0, 0x1));
      if (var3716 === 'en') {
        var3715.substring(0x0, 0x1).toUpperCase() === param683 && var3713.push(var3714.tag);
      } else {
        if (var3716 === 'zh') {
          let _0x2e2dc0 = Zotero.AI4Paper.Pinyin.getWordsCode(var3715);
          _0x2e2dc0 != '' && (_0x2e2dc0 = _0x2e2dc0.substring(0x0, 0x1).toUpperCase(), _0x2e2dc0 == param683 && var3713.push(var3714.tag));
        } else {
          if (param683 === 'OT') {
            var3713.push(var3714.tag);
          }
        }
      }
    }
    return var3713.sort((_0x3273ff, _0x594c26) => {
      return _0x3273ff.localeCompare(_0x594c26, 'zh');
    });
  },
  'returnGPTNoteTagsFilter': function (param684) {
    if (Zotero.Prefs.get('ai4paper.gptnotetagsrecent').length === 0x0) {
      var var3718 = [];
    } else {
      var var3718 = JSON.parse(Zotero.Prefs.get("ai4paper.gptnotetagsrecent"));
    }
    let var3719 = [];
    for (let var3720 of var3718) {
      let var3721 = var3720.tag;
      var3721 = var3721.indexOf("🤖️/") === 0x0 ? var3721.substring(0x4) : var3721;
      let var3722 = Zotero.AI4Paper.checkENZH(var3721.substring(0x0, 0x1));
      if (var3722 === 'en') var3721.substring(0x0, 0x1).toUpperCase() === param684 && var3719.push(var3720.tag);else {
        if (var3722 === 'zh') {
          let var3723 = Zotero.AI4Paper.Pinyin.getWordsCode(var3721);
          var3723 != '' && (var3723 = var3723.substring(0x0, 0x1).toUpperCase(), var3723 == param684 && var3719.push(var3720.tag));
        } else {
          if (param684 === 'OT') {
            var3719.push(var3720.tag);
          }
        }
      }
    }
    return var3719.sort((_0x35ff0c, _0xbfeb3d) => {
      return _0x35ff0c.localeCompare(_0xbfeb3d, 'zh');
    });
  },
  'returnItemTagsSearch': function (param685) {
    if (Zotero.Prefs.get('ai4paper.itemTags').length === 0x0) var var3724 = [];else var var3724 = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags"));
    let var3725 = [];
    for (let var3726 of var3724) {
      let _0x123f67 = '' + var3726.tag.toLowerCase();
      if (_0x123f67.indexOf(param685.toLowerCase()) != -0x1) {
        var3725.push(var3726.tag);
      }
    }
    return var3725.sort((_0x36456f, _0x9c081c) => {
      return _0x36456f.localeCompare(_0x9c081c, 'zh');
    });
  },
  'returnAnnotationTagsSearch': function (param686) {
    if (Zotero.Prefs.get("ai4paper.annotationtagsrecent").length === 0x0) var var3728 = [];else var var3728 = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent"));
    let var3729 = [];
    for (let var3730 of var3728) {
      let var3731 = '' + var3730.tag.toLowerCase();
      var3731.indexOf(param686.toLowerCase()) != -0x1 && var3729.push(var3730.tag);
    }
    return var3729.sort((_0x29ecf1, _0x31ba66) => {
      return _0x29ecf1.localeCompare(_0x31ba66, 'zh');
    });
  },
  'returnImageAnnotationTagsSearch': function (param687) {
    if (Zotero.Prefs.get("ai4paper.imageannotationtagsrecent").length === 0x0) var var3732 = [];else var var3732 = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
    let var3733 = [];
    for (let var3734 of var3732) {
      let var3735 = '' + var3734.tag.toLowerCase();
      if (var3735.indexOf(param687.toLowerCase()) != -0x1) {
        var3733.push(var3734.tag);
      }
    }
    return var3733.sort((_0x57bc61, _0x17db22) => {
      return _0x57bc61.localeCompare(_0x17db22, 'zh');
    });
  },
  'returnGPTNoteTagsSearch': function (param688) {
    if (Zotero.Prefs.get("ai4paper.gptnotetagsrecent").length === 0x0) {
      var var3736 = [];
    } else var var3736 = JSON.parse(Zotero.Prefs.get("ai4paper.gptnotetagsrecent"));
    let var3737 = [];
    for (let var3738 of var3736) {
      let _0x2000cf = '' + var3738.tag.toLowerCase();
      _0x2000cf.indexOf(param688.toLowerCase()) != -0x1 && var3737.push(var3738.tag);
    }
    return var3737.sort((_0x50c59f, _0x148b32) => {
      return _0x50c59f.localeCompare(_0x148b32, 'zh');
    });
  },

  // === Block H: Progress Percent Utilities ===
  'progressPercent_resetState': function (param689, param690, param691) {
    if (param689 == "initial") {
      Zotero.AI4Paper["progressWindow" + param690] && Zotero.AI4Paper["progressWindow" + param690].close();
      Zotero.AI4Paper["current" + param690] = -0x1;
      Zotero.AI4Paper['toUpdate' + param690] = 0x0;
      Zotero.AI4Paper["itemsToUpdate" + param690] = null;
      Zotero.AI4Paper["numberOfUpdatedItems" + param690] = 0x0;
      Zotero.AI4Paper["counter" + param690] = 0x0;
      Zotero.AI4Paper['_progressData_' + param690] = [];
      return;
    }
    const var3740 = "chrome://zotero/skin/tick.png";
    Zotero.AI4Paper["progressWindow" + param690] = new Zotero.ProgressWindow({
      'closeOnClick': true
    });
    Zotero.AI4Paper["progressWindow" + param690].changeHeadline("完成刷新");
    Zotero.AI4Paper["progressWindow" + param690].progress = new Zotero.AI4Paper['progressWindow' + param690].ItemProgress(var3740);
    Zotero.AI4Paper['progressWindow' + param690].progress.setProgress(0x64);
    Zotero.AI4Paper["progressWindow" + param690].progress.setText("共有 " + Zotero.AI4Paper['counter' + param690] + ('\x20个' + param691 + '！'));
    Zotero.AI4Paper["progressWindow" + param690].show();
    Zotero.AI4Paper['progressWindow' + param690].startCloseTimer(0xfa0);
  },
  'progressPercent_initProgress': function (param692, param693, param694) {
    Zotero.AI4Paper.progressPercent_resetState("initial", param693, param694);
    Zotero.AI4Paper['toUpdate' + param693] = param692.length;
    Zotero.AI4Paper["itemsToUpdate" + param693] = param692;
    Zotero.AI4Paper["progressWindow" + param693] = new Zotero.ProgressWindow({
      'closeOnClick': false
    });
    const var3741 = "chrome://zotero/skin/toolbar-advanced-search.png";
    Zotero.AI4Paper["progressWindow" + param693].changeHeadline("正在刷新" + param694 + "...", var3741);
    const var3742 = 'chrome://zotero/skin/toolbar-advanced-search' + (Zotero.hiDPI ? "@2x" : '') + ".png";
    Zotero.AI4Paper["progressWindow" + param693].progress = new Zotero.AI4Paper["progressWindow" + param693].ItemProgress(var3742, "正在刷新" + param694 + "...");
  },
  'progressPercent_updatePercent': function (param695, param696) {
    Zotero.AI4Paper["current" + param695]++;
    const var3743 = Math.round(Zotero.AI4Paper["numberOfUpdatedItems" + param695] / Zotero.AI4Paper["toUpdate" + param695] * 0x64);
    Zotero.AI4Paper["progressWindow" + param695].progress.setProgress(var3743);
    Zotero.AI4Paper["progressWindow" + param695].progress.setText(param696 + Zotero.AI4Paper["current" + param695] + " of " + Zotero.AI4Paper["toUpdate" + param695]);
    Zotero.AI4Paper['progressWindow' + param695].show();
  },

  // === Block I: Tag Display/Selector/Check ===
  'showItemsBasedOnTag': async function (param697) {
    let var3744 = 0x1;
    if (Zotero.Collections.getByLibrary(0x1).length != 0x0) var3744 = Zotero.Collections.getByLibrary(0x1)[0x0].id;else return;
    await ZoteroPane.collectionsView.selectCollection(var3744);
    await new Promise(_0x4368bd => setTimeout(_0x4368bd, 0x64));
    ZoteroPane.collectionsView.selectLibrary();
    let var3745 = [{
      'tag': param697,
      'type': 0x0
    }];
    await Zotero.AI4Paper.showLibraryAnnotationTags(var3745);
    let var3746 = 0x0,
      var3747 = [];
    while (var3747.length === 0x0) {
      if (var3746 >= 0x320) {
        Zotero.debug("AI4Paper: Waiting for tag loading failed...");
        return;
      }
      let var3748 = window.document.querySelector('.tag-selector-list').querySelectorAll('.tag-selector-item');
      var3747 = Array.from(var3748).filter(_0x1760e3 => _0x1760e3.querySelector('span').textContent === param697);
      await Zotero.Promise.delay(0xa);
      var3746++;
    }
    var3747[0x0].click();
  },
  'showLibraryAnnotationTags': async function (param698) {
    await Zotero_Tabs.select('zotero-pane');
    await ZoteroPane.collectionsView.selectLibrary();
    await new Promise(_0x569afb => setTimeout(_0x569afb, 0x320));
    var var3749 = new Set(param698.map(_0x47ec9e => _0x47ec9e.tag));
    if (ZoteroPane.tagSelector.state.tags.length == param698.length) {
      let var3750 = new Set(ZoteroPane.tagSelector.state.tags.map(_0x7883ea => _0x7883ea.tag)),
        var3751 = true;
      for (let var3752 of param698) {
        if (!var3750.has(var3752.tag)) {
          var3751 = false;
          break;
        }
      }
      if (var3751) {
        return Zotero.debug('Tags\x20haven\x27t\x20changed'), {
          'tags': ZoteroPane.tagSelector.state.tags,
          'scope': var3749
        };
      }
    }
    ZoteroPane.tagSelector.sortTags(param698);
    ZoteroPane.tagSelector.setState({
      'tags': param698,
      'scope': var3749
    });
  },
  'tagSelector_displayItemTags': async function () {
    if (Zotero.Prefs.get('ai4paper.itemTags').length === 0x0) {
      Services.prompt.alert(window, Zotero.getString("条目标签（最近刷新）"), Zotero.getString("尚未刷新条目标签，或条目标签数量为 0！"));
      return;
    }
    let var3753 = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags"));
    await Zotero.AI4Paper.showLibraryAnnotationTags(var3753);
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 条目标签（最近刷新）", "共有 " + var3753.length + " 个条目标签！");
  },
  'tagSelector_updateItemTags': async function () {
    let var3754 = await Zotero.Tags.getAll(0x1);
    if (var3754.length === 0x0) {
      window.alert('未发现任何标签！');
      return;
    }
    let var3755 = "_tagSelector_updateItemTags",
      var3756 = "条目标签";
    Zotero.AI4Paper.progressPercent_initProgress(var3754, var3755, var3756);
    Zotero.AI4Paper.tagSelector_updateItemTags_checkNext(var3755, var3756);
  },
  'tagSelector_updateItemTags_checkNext': async function (param699, param700) {
    Zotero.AI4Paper['numberOfUpdatedItems' + param699]++;
    if (Zotero.AI4Paper["current" + param699] == Zotero.AI4Paper["toUpdate" + param699] - 0x1) {
      Zotero.AI4Paper["progressWindow" + param699].close();
      Zotero.AI4Paper.progressPercent_resetState(null, param699, param700);
      Zotero.Prefs.set("ai4paper.itemTags", JSON.stringify(Zotero.AI4Paper["_progressData_" + param699]));
      await Zotero.AI4Paper.showLibraryAnnotationTags(Zotero.AI4Paper['_progressData_' + param699]);
      return;
    }
    Zotero.AI4Paper.progressPercent_updatePercent(param699, "检查所有标签： ");
    Zotero.AI4Paper.tagSelector_updateItemTags_checkTag(Zotero.AI4Paper["itemsToUpdate" + param699][Zotero.AI4Paper["current" + param699]], param699, param700);
  },
  'tagSelector_updateItemTags_checkTag': async function (param701, param702, param703) {
    try {
      let _0x21b86d = await Zotero.AI4Paper.checkItemTag(param701.tag);
      if (_0x21b86d) {
        let _0x5c9c37 = param701.tag,
          _0x51d80a = 0x0,
          _0x41a0e1 = {
            'tag': _0x5c9c37,
            'type': _0x51d80a
          };
        !JSON.stringify(Zotero.AI4Paper["_progressData_" + param702]).includes(JSON.stringify(_0x41a0e1)) && (Zotero.AI4Paper["_progressData_" + param702].push(_0x41a0e1), Zotero.AI4Paper["counter" + param702]++);
      }
    } catch (_0x3e92fc) {
      Zotero.debug(_0x3e92fc);
    }
    Zotero.AI4Paper.tagSelector_updateItemTags_checkNext(param702, param703);
  },
  'tagSelector_displayAnnotationTags': async function () {
    if (Zotero.Prefs.get("ai4paper.annotationtagsrecent").length === 0x0) {
      Services.prompt.alert(window, Zotero.getString("注释标签（最近刷新）"), Zotero.getString('尚未刷新注释标签，或注释标签数量为\x200！'));
      return;
    }
    let var3761 = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent"));
    await Zotero.AI4Paper.showLibraryAnnotationTags(var3761);
    Zotero.AI4Paper.showProgressWindow(0xbb8, '✅\x20注释标签（最近刷新）', '共有\x20' + var3761.length + " 个注释标签！");
  },
  'tagSelector_updateAnnotationTags': async function () {
    let var3762 = await Zotero.Tags.getAll(0x1);
    if (var3762.length === 0x0) {
      window.alert('未发现任何标签！');
      return;
    }
    let var3763 = "_tagSelector_updateAnnotationTags",
      var3764 = "注释标签";
    Zotero.AI4Paper.progressPercent_initProgress(var3762, var3763, var3764);
    Zotero.AI4Paper.tagSelector_updateAnnotationTags_checkNext(var3763, var3764);
  },
  'tagSelector_updateAnnotationTags_checkNext': async function (param704, param705) {
    Zotero.AI4Paper["numberOfUpdatedItems" + param704]++;
    if (Zotero.AI4Paper['current' + param704] == Zotero.AI4Paper["toUpdate" + param704] - 0x1) {
      Zotero.AI4Paper["progressWindow" + param704].close();
      Zotero.AI4Paper.progressPercent_resetState(null, param704, param705);
      Zotero.Prefs.set("ai4paper.annotationtagsrecent", JSON.stringify(Zotero.AI4Paper['_progressData_' + param704]));
      await Zotero.AI4Paper.showLibraryAnnotationTags(Zotero.AI4Paper["_progressData_" + param704]);
      return;
    }
    Zotero.AI4Paper.progressPercent_updatePercent(param704, '检查所有标签：\x20');
    Zotero.AI4Paper.tagSelector_updateAnnotationTags_checkTag(Zotero.AI4Paper["itemsToUpdate" + param704][Zotero.AI4Paper["current" + param704]], param704, param705);
  },
  'tagSelector_updateAnnotationTags_checkTag': async function (param706, param707, param708) {
    try {
      let var3765 = await Zotero.AI4Paper.checkAnnotationTag(param706.tag);
      if (var3765) {
        let _0x3ad6e6 = param706.tag,
          _0x2283f3 = 0x0,
          _0xdf276d = {
            'tag': _0x3ad6e6,
            'type': _0x2283f3
          };
        !JSON.stringify(Zotero.AI4Paper["_progressData_" + param707]).includes(JSON.stringify(_0xdf276d)) && (Zotero.AI4Paper["_progressData_" + param707].push(_0xdf276d), Zotero.AI4Paper["counter" + param707]++);
      }
    } catch (_0x407e27) {
      Zotero.debug(_0x407e27);
    }
    Zotero.AI4Paper.tagSelector_updateAnnotationTags_checkNext(param707, param708);
  },
  'tagSelector_displayImageAnnotationTags': async function () {
    if (Zotero.Prefs.get("ai4paper.imageannotationtagsrecent").length === 0x0) {
      Services.prompt.alert(window, Zotero.getString('图片注释标签（最近刷新）'), Zotero.getString("尚未刷新图片注释标签，或图片注释标签数量为 0！"));
      return;
    }
    let var3769 = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
    await Zotero.AI4Paper.showLibraryAnnotationTags(var3769);
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 图片注释标签（最近刷新）", "共有 " + var3769.length + " 个图片注释标签！");
  },
  'tagSelector_updateImageAnnotationTags': async function () {
    let var3770 = await Zotero.Tags.getAll(0x1);
    if (var3770.length === 0x0) {
      window.alert("未发现任何标签！");
      return;
    }
    let var3771 = '_tagSelector_updateImageAnnotationTags',
      var3772 = "图片注释标签";
    Zotero.AI4Paper.progressPercent_initProgress(var3770, var3771, var3772);
    Zotero.AI4Paper.tagSelector_updateImageAnnotationTags_checkNext(var3771, var3772);
  },
  'tagSelector_updateImageAnnotationTags_checkNext': async function (param709, param710) {
    Zotero.AI4Paper["numberOfUpdatedItems" + param709]++;
    if (Zotero.AI4Paper["current" + param709] == Zotero.AI4Paper["toUpdate" + param709] - 0x1) {
      Zotero.AI4Paper['progressWindow' + param709].close();
      Zotero.AI4Paper.progressPercent_resetState(null, param709, param710);
      Zotero.Prefs.set("ai4paper.imageannotationtagsrecent", JSON.stringify(Zotero.AI4Paper["_progressData_" + param709]));
      await Zotero.AI4Paper.showLibraryAnnotationTags(Zotero.AI4Paper["_progressData_" + param709]);
      return;
    }
    Zotero.AI4Paper.progressPercent_updatePercent(param709, '检查所有标签：\x20');
    Zotero.AI4Paper.tagSelector_updateImageAnnotationTags_checkTag(Zotero.AI4Paper['itemsToUpdate' + param709][Zotero.AI4Paper["current" + param709]], param709, param710);
  },
  'tagSelector_updateImageAnnotationTags_checkTag': async function (param711, param712, param713) {
    try {
      let var3773 = await Zotero.AI4Paper.checkImageAnnotationTag(param711.tag);
      if (var3773) {
        let _0x201e32 = param711.tag,
          _0xb1689 = 0x0,
          _0x290acd = {
            'tag': _0x201e32,
            'type': _0xb1689
          };
        !JSON.stringify(Zotero.AI4Paper["_progressData_" + param712]).includes(JSON.stringify(_0x290acd)) && (Zotero.AI4Paper["_progressData_" + param712].push(_0x290acd), Zotero.AI4Paper["counter" + param712]++);
      }
    } catch (_0x158838) {
      Zotero.debug(_0x158838);
    }
    Zotero.AI4Paper.tagSelector_updateImageAnnotationTags_checkNext(param712, param713);
  },
  'checkItemTag': async function (param714) {
    var var3777 = new Zotero.Search();
    var3777.libraryID = Zotero.Libraries.userLibraryID;
    var3777.addCondition("tag", 'is', param714);
    if (Zotero.AI4Paper.isZoteroVersion()) {
      var3777.addCondition('itemType', 'isNot', 'annotation');
      var var3778 = await var3777.search();
      if (var3778.length) return true;
      return false;
    } else {
      var3777.addCondition("itemType", 'isNot', 'attachment');
      var var3778 = await var3777.search();
      if (var3778.length) return true;else {
        var3777 = new Zotero.Search();
        var3777.libraryID = Zotero.Libraries.userLibraryID;
        var3777.addCondition('tag', 'is', param714);
        var3777.addCondition("itemType", 'is', 'attachment');
        var3778 = await var3777.search();
        if (var3778.length === 0x0) {
          return false;
        }
        var var3779 = [];
        for (let var3780 of var3778) {
          var3779.push(Zotero.Items.get(var3780));
        }
        for (let var3781 of var3779) {
          try {
            let _0x495357 = var3781.getTags();
            for (let var3783 of _0x495357) {
              if (var3783.tag === param714) {
                return true;
              }
            }
          } catch (_0x1fe199) {
            Zotero.debug(_0x1fe199);
          }
        }
      }
      return false;
    }
  },
  'checkAnnotationTag': async function (param715) {
    var var3784 = new Zotero.Search();
    var3784.libraryID = Zotero.Libraries.userLibraryID;
    var3784.addCondition("tag", 'is', param715);
    if (Zotero.AI4Paper.isZoteroVersion()) {
      var3784.addCondition("itemType", 'is', "annotation");
      var var3785 = await var3784.search();
      if (var3785.length) {
        return true;
      }
      return false;
    } else {
      var3784.addCondition("itemType", 'is', "attachment");
      var var3785 = await var3784.search();
      if (var3785.length === 0x0) return false;
      var var3786 = [];
      for (let var3787 of var3785) {
        var3786.push(Zotero.Items.get(var3787));
      }
      for (let var3788 of var3786) {
        try {
          var var3789 = await var3788.getAnnotations();
          for (let var3790 of var3789) {
            let var3791 = var3790.getTags();
            for (let var3792 of var3791) {
              if (var3792.tag === param715) {
                return true;
              }
            }
          }
        } catch (_0x1ff19b) {
          Zotero.debug(_0x1ff19b);
        }
      }
      return false;
    }
  },
  'checkImageAnnotationTag': async function (param716) {
    var var3793 = new Zotero.Search();
    var3793.libraryID = Zotero.Libraries.userLibraryID;
    var3793.addCondition("tag", 'is', param716);
    if (Zotero.AI4Paper.isZoteroVersion()) {
      var3793.addCondition("itemType", 'is', 'annotation');
      var var3794 = await var3793.search();
      if (var3794.length === 0x0) return false;
      for (let var3795 of var3794) {
        let var3796 = Zotero.Items.get(var3795);
        if (var3796.annotationType === "image") {
          return true;
        }
      }
      return false;
    } else {
      var3793.addCondition("itemType", 'is', "attachment");
      var var3794 = await var3793.search();
      if (var3794.length === 0x0) return false;
      var var3797 = [];
      for (let var3798 of var3794) {
        var3797.push(Zotero.Items.get(var3798));
      }
      for (let var3799 of var3797) {
        try {
          var var3800 = await var3799.getAnnotations();
          for (let var3801 of var3800) {
            let _0x1a29dc = var3801.getTags();
            for (let var3803 of _0x1a29dc) {
              if (var3803.tag === param716 && var3801.annotationType === "image") return true;
            }
          }
        } catch (_0x273acd) {
          Zotero.debug(_0x273acd);
        }
      }
      return false;
    }
  },
  'checkGPTNoteTag': async function (param717) {
    if (!param717.includes("🤖️/")) {
      return false;
    }
    var var3804 = new Zotero.Search();
    var3804.libraryID = Zotero.Libraries.userLibraryID;
    var3804.addCondition("tag", 'is', param717);
    var3804.addCondition("itemType", 'is', "note");
    var var3805 = await var3804.search();
    return var3805.length ? true : false;
  },

  // === Block J: Tag Batch Operations ===
  'updateAutomaticTags': async function () {
    await Zotero_Tabs.select("zotero-pane");
    await ZoteroPane.collectionsView.selectLibrary();
    let var3808 = await Zotero.Tags.getAutomaticInLibrary(ZoteroPane.getSelectedLibraryID()),
      var3809 = [];
    for (let var3810 of var3808) {
      let _0x3589a9 = 0x1,
        _0x2e679f = Zotero.Tags.getName(var3810);
      if (!["/unread", "/PDF_auto_download", '预警期刊'].includes(_0x2e679f)) {
        let _0x552eed = {
          'tag': _0x2e679f,
          'type': _0x3589a9
        };
        var3809.push(_0x552eed);
      }
    }
    await new Promise(_0xa97ea9 => setTimeout(_0xa97ea9, 0x3e8));
    await Zotero.AI4Paper.showLibraryAnnotationTags(var3809);
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 刷新自动标签", "共有 " + var3809.length + " 个自动标签！");
  },
  'deleteAutomaticTags': async function () {
    let var3814 = Services.prompt.confirm(window, "删除自动标签", "是否要彻底删除所有自动标签（不包括 AI4paper 内置的）？\n\n👉 删除后，这些标签将无法恢复！\n\nPs：要删除的自动标签可以通过【刷新自动标签】查看！");
    if (var3814) {
      let var3815 = await Zotero.Tags.getAutomaticInLibrary(0x1),
        var3816 = 0x0;
      for (let var3817 of var3815) {
        let var3818 = Zotero.Tags.getName(var3817);
        if (!['/unread', "/PDF_auto_download", '预警期刊'].includes(var3818)) {
          Zotero.Tags.removeFromLibrary(0x1, var3817);
          var3816++;
        }
      }
      Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 删除自动标签", "共删除 " + var3816 + '\x20个自动标签！');
    }
  },
  'deleteTagsBatch': async function () {
    let var3819 = await Zotero.Tags.getAll(0x1),
      var3820 = var3819.map(_0x33b63a => _0x33b63a.tag);
    if (!var3820.length) {
      window.alert("未在【我的文库】内发现标签，无须删除！");
      return;
    }
    Zotero.AI4Paper.openDialogByType('deleteTags');
  },
  'renameTagsBatch': async function () {
    let var3821 = await Zotero.Tags.getAll(0x1),
      var3822 = var3821.map(_0x667765 => _0x667765.tag);
    if (!var3822.length) {
      window.alert("未在【我的文库】内发现标签，无须删除！");
      return;
    }
    Zotero.AI4Paper.openDialogByType("renameTags");
  },

  // === Block K: exportTagTree ===
  'exportTagTree': async function (param1101, param1102) {
    var {
      FilePicker: _0x34bbe5
    } = ChromeUtils.importESModule('chrome://zotero/content/modules/filePicker.mjs');
    const var5666 = new _0x34bbe5();
    var5666.displayDirectory = OS.Constants.Path.homeDir;
    var5666.init(window, "Export TagTree to markdown...", var5666.modeSave);
    var5666.appendFilter('Text', "*.md");
    let var5667 = new Date(),
      var5668 = var5667.toLocaleDateString().replace(/\//g, '-'),
      var5669 = "Markdown " + param1102 + "标签树 " + var5668;
    var5666.defaultString = var5669 + ".md";
    const var5670 = await var5666.show();
    if (var5670 == var5666.returnOK || var5670 == var5666.returnReplace) {
      let _0x99c547 = var5666.file;
      if (_0x99c547.split('.').pop().toLowerCase() != 'md') {
        _0x99c547 += ".md";
      }
      await Zotero.File.putContentsAsync(_0x99c547, param1101);
      Zotero.AI4Paper.showProgressWindow(0xbb8, "导出 Markdown 标签树【AI4paper】", "✅ 成功导出 Markdown " + param1102 + '标签树！');
      if (await OS.File.exists(_0x99c547)) {
        let var5672 = Zotero.File.pathToFile(_0x99c547);
        try {
          var5672.reveal();
        } catch (_0xe9817e) {}
      }
    }
  },

  // === Block L: Tag Collection Generation ===
  'generateTagsCollection_SelectedItems': async function () {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) {
      return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    }
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    Zotero.debug('AI4Paper:\x20Generate\x20Tags\x20Collections\x20for\x20Selected\x20items');
    let var5881 = Zotero_Tabs._selectedID;
    var var5882 = Zotero.Reader.getByTabID(var5881);
    if (var5882) {
      let _0x3ecdef = var5882.itemID,
        _0x42b88d = Zotero.Items.get(_0x3ecdef);
      _0x42b88d && _0x42b88d.parentItemID && (_0x3ecdef = _0x42b88d.parentItemID, _0x42b88d = Zotero.Items.get(_0x3ecdef), await Zotero.AI4Paper.generateTagsCollection_Item(_0x42b88d), this.showProgressWindow(0x1388, '✅\x20生成标签集\x20【Zotero\x20One】', "您已为当前文献生成标签集！", "zoteorif"));
    } else {
      let var5885 = Zotero.getActiveZoteroPane().getSelectedItems(),
        var5886 = var5885.filter(_0x2b0f07 => _0x2b0f07.isRegularItem());
      for (let var5887 of var5886) {
        await Zotero.AI4Paper.generateTagsCollection_Item(var5887);
      }
      this.showProgressWindow(0x1388, '✅\x20生成标签集\x20【Zotero\x20One】', '您已为【' + var5886.length + "】篇文献生成标签集！", "zoteorif");
    }
  },
  'generateTagsCollection_Item': async function (param1120) {
    let var5888 = "extra";
    if (Zotero.Prefs.get("ai4paper.tagscollectionField") === '其他') var5888 = "extra";else {
      if (Zotero.Prefs.get("ai4paper.tagscollectionField") === "存档位置") var5888 = 'archiveLocation';else {
        if (Zotero.Prefs.get("ai4paper.tagscollectionField") === '索书号') {
          var5888 = 'callNumber';
        } else Zotero.Prefs.get('ai4paper.tagscollectionField') === "文库编目" && (var5888 = 'libraryCatalog');
      }
    }
    if (!Zotero.Prefs.get("ai4paper.tagscollectiondisable") && Zotero.AI4Paper.checkItemField(param1120, var5888)) {
      let var5889 = param1120.getTags().filter(_0x57f26e => !["/PDF_auto_download", "/citing", '/refs', "Researcher App"].includes(_0x57f26e.tag)).map(_0x34baf0 => _0x34baf0.tag),
        var5890 = await Zotero.AI4Paper.getAnnotatioinTagsArray(param1120),
        var5891 = [...new Set(var5889.concat(var5890))];
      var5891.length ? param1120.setField(var5888, "🏷️ " + var5891.join('、')) : param1120.setField(var5888, '');
      await param1120.saveTx();
    }
  },
  'handleItemTagChange': async function (param1121) {
    let var5892 = Zotero.Items.get(param1121);
    if (var5892) {
      if (var5892.itemType === "annotation") {
        var5892 = var5892.parentItem.parentItem;
        var5892 && var5892.isRegularItem() && (await Zotero.AI4Paper.generateTagsCollection_Item(var5892));
      } else var5892.isRegularItem() && (await Zotero.AI4Paper.generateTagsCollection_Item(var5892));
    }
  },

  // === Block M: Tag Removal Operations ===
  'getAnnotatioinTagsArray': async function (param1123) {
    let var5913 = [],
      var5914 = param1123.getAttachments();
    for (let var5915 of var5914) {
      let _0x33436e = Zotero.Items.get(var5915);
      if (["application/pdf", "text/html", "application/epub+zip"].includes(_0x33436e.attachmentContentType)) {
        if (_0x33436e.attachmentLinkMode === 0x3) continue;
        var var5917 = await _0x33436e.getAnnotations().filter(_0x36aceb => _0x36aceb.annotationType != "ink");
        for (let var5918 of var5917) {
          var5913.push(...var5918.getTags().map(_0x5d059c => '📝\x20' + _0x5d059c.tag));
        }
      }
    }
    return var5913;
  },
  'removeTags_SelectedItems': async function () {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return false;
    }
    let var5919 = Services.prompt.confirm(window, '清除条目标签', "是否确认删除选定文献的所有条目标签？如果误删，将无法恢复。");
    if (!var5919) return false;
    Zotero.debug('AI4Paper:\x20Remove\x20Tags\x20for\x20Selected\x20items');
    let var5920 = Zotero_Tabs._selectedID;
    var var5921 = Zotero.Reader.getByTabID(var5920);
    if (var5921) {
      let var5922 = var5921.itemID,
        var5923 = Zotero.Items.get(var5922);
      if (var5923 && var5923.parentItemID) {
        var5922 = var5923.parentItemID;
        var5923 = Zotero.Items.get(var5922);
        await Zotero.AI4Paper.removeTags_Item(var5923);
        this.showProgressWindow(0x1388, "✅ 清除条目标签 【AI4paper】", '成功清除当前文献的条目标签', 'zoteorif');
      }
    } else {
      let _0x4a95b1 = Zotero.getActiveZoteroPane().getSelectedItems(),
        _0x58ce42 = _0x4a95b1.filter(_0x2ec340 => _0x2ec340.isRegularItem());
      for (let var5926 of _0x58ce42) {
        await Zotero.AI4Paper.removeTags_Item(var5926);
      }
      this.showProgressWindow(0x1388, "✅ 清除条目标签 【AI4paper】", "成功清除【" + _0x58ce42.length + "】篇文献的条目标签！", "zoteorif");
    }
  },
  'removeTags_Item': async function (param1124) {
    param1124.removeAllTags();
    await param1124.saveTx();
    this.generateTagsCollection_Item(param1124);
  },
  'removeTagsCollection_SelectedItems': async function () {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    Zotero.debug('AI4Paper:\x20Remove\x20Tags\x20Collection\x20for\x20Selected\x20items');
    let var5927 = "extra";
    if (Zotero.Prefs.get("ai4paper.tagscollectionField") === '其他') {
      var5927 = "extra";
    } else {
      if (Zotero.Prefs.get('ai4paper.tagscollectionField') === "存档位置") {
        var5927 = "archiveLocation";
      } else {
        if (Zotero.Prefs.get("ai4paper.tagscollectionField") === "索书号") var5927 = "callNumber";else Zotero.Prefs.get("ai4paper.tagscollectionField") === "文库编目" && (var5927 = 'libraryCatalog');
      }
    }
    let var5928 = Zotero_Tabs._selectedID;
    var var5929 = Zotero.Reader.getByTabID(var5928);
    if (var5929) {
      let var5930 = var5929.itemID,
        var5931 = Zotero.Items.get(var5930);
      if (var5931 && var5931.parentItemID) {
        var5930 = var5931.parentItemID;
        var5931 = Zotero.Items.get(var5930);
        if (Zotero.AI4Paper.checkItemField(var5931, var5927)) {
          var5931.setField(var5927, '');
          await var5931.saveTx();
          this.showProgressWindow(0x1388, "✅ 清除标签集 【AI4paper】", "成功清除当前文献的条目标签集", "zoteorif");
        }
      }
    } else {
      let var5932 = Zotero.getActiveZoteroPane().getSelectedItems(),
        var5933 = var5932.filter(_0x3dc753 => _0x3dc753.isRegularItem());
      for (let var5934 of var5933) {
        Zotero.AI4Paper.checkItemField(var5934, var5927) && (var5934.setField(var5927, ''), await var5934.saveTx());
      }
      this.showProgressWindow(0x1388, "✅ 清除标签集 【AI4paper】", "成功清除【" + var5933.length + "】篇文献的条目标签集！", 'zoteorif');
    }
  },

  // === Block N: addUnreadTag ===
  'addUnreadTag': async function (param1137) {
    Zotero.Prefs.get("ai4paper.autounreadtag") && (await Zotero.Promise.delay(0x5), !param1137.hasTag(this.doneTag) && !param1137.hasTag(this.readingTag) && (param1137.addTag(this.unreadTag, 0x1), await param1137.saveTx()));
  },

});
