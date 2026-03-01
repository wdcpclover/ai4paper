// ai4paper-tags.js - Tag management module
// Extracted from ai4paper.js (Phase 12)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Tag Menu Registration & UI Setup ===
  'registerTagSelectorViewMenu': function () {
    let settingsMenu = window.document.querySelector("#tag-selector-view-settings-menu");
    if (!settingsMenu || settingsMenu.getAttribute("zotero-if-TagSelectorViewMenu-set") === 'true') {
      return false;
    }
    settingsMenu.setAttribute('zotero-if-TagSelectorViewMenu-set', 'true');
    let separator = window.document.createXULElement('menuseparator');
    settingsMenu.appendChild(separator);
    this._store_added_tagMenu_elements.push(separator);
    let menuItem = window.document.createXULElement("menuitem");
    menuItem.setAttribute('id', 'zotero-if-TagSelectorView-Menu-displayItemTags');
    menuItem.setAttribute('label', "条目标签");
    menuItem.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_displayItemTags();");
    settingsMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    menuItem = window.document.createXULElement('menuitem');
    menuItem.setAttribute('id', "zotero-if-TagSelectorView-Menu-updateItemTags");
    menuItem.setAttribute("label", "刷新条目标签");
    menuItem.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_updateItemTags();");
    settingsMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    separator = window.document.createXULElement("menuseparator");
    settingsMenu.appendChild(separator);
    this._store_added_tagMenu_elements.push(separator);
    menuItem = window.document.createXULElement('menuitem');
    menuItem.setAttribute('id', 'zotero-if-TagSelectorView-Menu-displayAnnotationTags');
    menuItem.setAttribute("label", "注释标签");
    menuItem.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_displayAnnotationTags();");
    settingsMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    menuItem = window.document.createXULElement("menuitem");
    menuItem.setAttribute('id', "zotero-if-TagSelectorView-Menu-updateAnnotationTags");
    menuItem.setAttribute("label", "刷新注释标签");
    menuItem.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_updateAnnotationTags();");
    settingsMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    separator = window.document.createXULElement("menuseparator");
    settingsMenu.appendChild(separator);
    this._store_added_tagMenu_elements.push(separator);
    menuItem = window.document.createXULElement('menuitem');
    menuItem.setAttribute('id', "zotero-if-TagSelectorView-Menu-displayImageAnnotationTags");
    menuItem.setAttribute("label", "图片注释标签");
    menuItem.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_displayImageAnnotationTags();");
    settingsMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    menuItem = window.document.createXULElement("menuitem");
    menuItem.setAttribute('id', "zotero-if-TagSelectorView-Menu-updateImageAnnotationTags");
    menuItem.setAttribute("label", "刷新图片注释标签");
    menuItem.setAttribute("oncommand", "Zotero.AI4Paper.tagSelector_updateImageAnnotationTags();");
    settingsMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    separator = window.document.createXULElement("menuseparator");
    settingsMenu.appendChild(separator);
    this._store_added_tagMenu_elements.push(separator);
    menuItem = window.document.createXULElement("menuitem");
    menuItem.setAttribute('id', "zotero-if-TagSelectorView-Menu-updateAutomaticTags");
    menuItem.setAttribute("label", "刷新自动标签");
    menuItem.setAttribute("oncommand", "Zotero.AI4Paper.updateAutomaticTags();");
    settingsMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    menuItem = window.document.createXULElement("menuitem");
    menuItem.setAttribute('id', "zotero-if-TagSelectorView-Menu-deleteAutomaticTags");
    menuItem.setAttribute("label", "删除自动标签");
    menuItem.setAttribute("oncommand", 'Zotero.AI4Paper.deleteAutomaticTags();');
    settingsMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    separator = window.document.createXULElement("menuseparator");
    settingsMenu.appendChild(separator);
    this._store_added_tagMenu_elements.push(separator);
    menuItem = window.document.createXULElement("menuitem");
    menuItem.setAttribute('id', 'zotero-if-TagSelectorView-Menu-deleteTagsBatch');
    menuItem.setAttribute("label", "批量删除标签");
    menuItem.setAttribute("oncommand", "Zotero.AI4Paper.deleteTagsBatch();");
    settingsMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    separator = window.document.createXULElement("menuseparator");
    settingsMenu.appendChild(separator);
    this._store_added_tagMenu_elements.push(separator);
    menuItem = window.document.createXULElement('menuitem');
    menuItem.setAttribute('id', "zotero-if-TagSelectorView-Menu-renameTagsBatch");
    menuItem.setAttribute("label", "批量重命名标签");
    menuItem.setAttribute("oncommand", 'Zotero.AI4Paper.renameTagsBatch();');
    settingsMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
  },
  'registerTagMenu': function () {
    let tagMenu = window.document.querySelector("#tag-menu");
    if (!tagMenu || tagMenu.getAttribute("zotero-if-TagMenu-set") === "true") return false;
    tagMenu.setAttribute("zotero-if-TagMenu-set", "true");
    let separator = window.document.createXULElement("menuseparator");
    tagMenu.appendChild(separator);
    this._store_added_tagMenu_elements.push(separator);
    let menuItem = window.document.createXULElement("menuitem");
    menuItem.setAttribute('id', "zotero-if-tag-menu-tagCardNotes");
    menuItem.setAttribute('label', "跳转卡片笔记");
    menuItem.setAttribute("oncommand", "Zotero.AI4Paper.tagCardNotes(ZoteroPane_Local.tagSelector.contextTag.name);");
    tagMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    menuItem = window.document.createXULElement("menuitem");
    menuItem.setAttribute('id', "zotero-if-tag-menu-tagImageCardNotes");
    menuItem.setAttribute("label", "跳转图卡笔记");
    menuItem.setAttribute("oncommand", "Zotero.AI4Paper.tagImageCardNotes(ZoteroPane_Local.tagSelector.contextTag.name);");
    tagMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
    menuItem = window.document.createXULElement("menuitem");
    menuItem.setAttribute('id', "zotero-if-tag-menu-queryTagInPapersMatrix");
    menuItem.setAttribute("label", '跳转智能文献矩阵');
    menuItem.setAttribute("oncommand", 'Zotero.AI4Paper.queryPapersMatrix(\x27filterByTag\x27,\x20ZoteroPane_Local.tagSelector.contextTag.name);');
    tagMenu.appendChild(menuItem);
    this._store_added_tagMenu_elements.push(menuItem);
  },
  'unregisterAllTagMenus': function () {
    for (let element of this._store_added_tagMenu_elements) {
      if (element) element.remove();
    }
    this._store_added_tagMenu_elements = [];
    let menu = window.document.querySelector('#tag-menu');
    menu && menu.setAttribute("zotero-if-TagMenu-set", "false");
    menu = window.document.querySelector("#tag-selector-view-settings-menu");
    if (menu) {
      menu.setAttribute("zotero-if-TagSelectorViewMenu-set", 'false');
    }
  },

  // === Block B: Tag Add/Delete/Recent + checkAnnotatationItem ===
  'addAnnotationTag': function (itemID, tagID) {
    let metaTitle = Zotero.AI4Paper.getFunMetaTitle();
    if (!metaTitle) return;
    let item = Zotero.Items.get(itemID);
    if (!item) return false;else {
      if (item.itemType === "annotation") {
        let tagName = Zotero.Tags.getName(tagID);
        tagName && (Zotero.AI4Paper.add2AnnotatationTags(tagName), Zotero.AI4Paper.add2RecentTags(tagName), item.annotationType === "image" && Zotero.AI4Paper.add2ImageAnnotatationTags(tagName));
      } else {
        let tagName = Zotero.Tags.getName(tagID);
        tagName && (Zotero.AI4Paper.add2ItemTags(tagName), Zotero.AI4Paper.add2RecentItemTags(tagName));
      }
    }
  },
  'add2ItemTags': function (tagName) {
    let storedTags = Zotero.Prefs.get("ai4paper.itemTags"),
      tag = tagName,
      tagType = 0x0,
      tagEntry = {
        'tag': tag,
        'type': tagType
      };
    if (!storedTags.includes(JSON.stringify(tagEntry))) {
      if (Zotero.Prefs.get("ai4paper.itemTags").length === 0x0) var tagsList = [];else {
        var tagsList = JSON.parse(Zotero.Prefs.get('ai4paper.itemTags'));
      }
      return tagsList.push(tagEntry), Zotero.Prefs.set('ai4paper.itemTags', JSON.stringify(tagsList)), true;
    }
  },
  'add2AnnotatationTags': function (tagName) {
    let storedTags = Zotero.Prefs.get("ai4paper.annotationtagsrecent"),
      tag = tagName,
      tagType = 0x0,
      tagEntry = {
        'tag': tag,
        'type': tagType
      };
    if (!storedTags.includes(JSON.stringify(tagEntry))) {
      if (Zotero.Prefs.get('ai4paper.annotationtagsrecent').length === 0x0) var tagsList = [];else var tagsList = JSON.parse(Zotero.Prefs.get('ai4paper.annotationtagsrecent'));
      return tagsList.push(tagEntry), Zotero.Prefs.set("ai4paper.annotationtagsrecent", JSON.stringify(tagsList)), true;
    }
  },
  'add2ImageAnnotatationTags': function (tagName) {
    let storedTags = Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"),
      tag = tagName,
      tagType = 0x0,
      tagEntry = {
        'tag': tag,
        'type': tagType
      };
    if (!storedTags.includes(JSON.stringify(tagEntry))) {
      if (Zotero.Prefs.get("ai4paper.imageannotationtagsrecent").length === 0x0) var tagsList = [];else var tagsList = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
      return tagsList.push(tagEntry), Zotero.Prefs.set('ai4paper.imageannotationtagsrecent', JSON.stringify(tagsList)), true;
    }
  },
  'add2GPTNoteTags': function (tagName) {
    let storedTags = Zotero.Prefs.get("ai4paper.gptnotetagsrecent"),
      gptTag = '🤖️/' + tagName,
      tagType = 0x0,
      tagEntry = {
        'tag': gptTag,
        'type': tagType
      };
    if (!storedTags.includes(JSON.stringify(tagEntry))) {
      if (Zotero.Prefs.get("ai4paper.gptnotetagsrecent").length === 0x0) var tagsList = [];else var tagsList = JSON.parse(Zotero.Prefs.get("ai4paper.gptnotetagsrecent"));
      return tagsList.push(tagEntry), Zotero.Prefs.set("ai4paper.gptnotetagsrecent", JSON.stringify(tagsList)), true;
    }
  },
  'checkAnnotatationItem': function (itemID, tagName) {
    let metaTitle = Zotero.AI4Paper.getFunMetaTitle();
    if (!metaTitle) {
      return;
    }
    let item = Zotero.Items.get(itemID);
    if (!item) return false;else item.itemType === "annotation" ? (Zotero.AI4Paper.deleteFromAnnotatationTags(tagName), item.annotationType === "image" && Zotero.AI4Paper.deleteFromImageAnnotatationTags(tagName)) : Zotero.AI4Paper.deleteFromItemTags(tagName);
  },
  'deleteFromItemTags': async function (tagName) {
    let storedTags = Zotero.Prefs.get("ai4paper.itemTags"),
      encoded = encodeURIComponent(tagName).substring(0x3),
      decodedTag = decodeURIComponent(encoded.substring(0x0, encoded.length - 0x3)),
      tagType = 0x0,
      tagEntry = {
        'tag': decodedTag,
        'type': tagType
      },
      tagExists = await Zotero.AI4Paper.checkItemTag(decodedTag);
    if (!tagExists) {
      if (storedTags.includes(JSON.stringify(tagEntry))) {
        let tagsList = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags"));
        for (let i = 0x0; i < tagsList.length; i++) {
          if (tagsList[i].tag === decodedTag) return tagsList.splice(i, 0x1), Zotero.Prefs.set("ai4paper.itemTags", JSON.stringify(tagsList)), true;
        }
      }
    }
  },
  'deleteFromAnnotatationTags': async function (tagName) {
    let storedTags = Zotero.Prefs.get('ai4paper.annotationtagsrecent'),
      encoded = encodeURIComponent(tagName).substring(0x3),
      decodedTag = decodeURIComponent(encoded.substring(0x0, encoded.length - 0x3)),
      tagType = 0x0,
      tagEntry = {
        'tag': decodedTag,
        'type': tagType
      },
      tagExists = await Zotero.AI4Paper.checkAnnotationTag(decodedTag);
    if (!tagExists) {
      if (storedTags.includes(JSON.stringify(tagEntry))) {
        let tagsList = JSON.parse(Zotero.Prefs.get('ai4paper.annotationtagsrecent'));
        for (let i = 0x0; i < tagsList.length; i++) {
          if (tagsList[i].tag === decodedTag) {
            return tagsList.splice(i, 0x1), Zotero.Prefs.set('ai4paper.annotationtagsrecent', JSON.stringify(tagsList)), true;
          }
        }
      }
    }
  },
  'deleteFromImageAnnotatationTags': async function (tagName) {
    let storedTags = Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"),
      encoded = encodeURIComponent(tagName).substring(0x3),
      decodedTag = decodeURIComponent(encoded.substring(0x0, encoded.length - 0x3)),
      tagType = 0x0,
      tagEntry = {
        'tag': decodedTag,
        'type': tagType
      },
      tagExists = await Zotero.AI4Paper.checkAnnotationTag(decodedTag);
    if (!tagExists) {
      if (storedTags.includes(JSON.stringify(tagEntry))) {
        let tagsList = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
        for (let i = 0x0; i < tagsList.length; i++) {
          if (tagsList[i].tag === decodedTag) {
            return tagsList.splice(i, 0x1), Zotero.Prefs.set("ai4paper.imageannotationtagsrecent", JSON.stringify(tagsList)), true;
          }
        }
      }
    }
  },
  'add2RecentItemTags': function (tagName) {
    let storedTags = Zotero.Prefs.get("ai4paper.recentlyAddedItemTags"),
      tagsList = storedTags.split("😊🎈🍓");
    if (!tagsList.includes(tagName)) {
      if (tagsList.length === 0x1 && tagsList[0x0] === '') tagsList = [tagName];else {
        tagsList.unshift(tagName);
      }
    } else {
      let index = tagsList.indexOf(tagName);
      tagsList.splice(index, 0x1);
      tagsList.unshift(tagName);
    }
    let isLicensed = Zotero.AI4Paper.letDOI(),
      trimmedList = [];
    for (let i = 0x0; i < 0x64; i++) {
      tagsList[i] != undefined && trimmedList.push(tagsList[i]);
    }
    isLicensed && Zotero.Prefs.set('ai4paper.recentlyAddedItemTags', trimmedList.join("😊🎈🍓"));
  },
  'add2RecentTags': function (tagName) {
    let storedTags = Zotero.Prefs.get("ai4paper.recentlyaddedTags"),
      tagsList = storedTags.split("😊🎈🍓");
    if (!tagsList.includes(tagName)) tagsList.length === 0x1 && tagsList[0x0] === '' ? tagsList = [tagName] : tagsList.unshift(tagName);else {
      let index = tagsList.indexOf(tagName);
      tagsList.splice(index, 0x1);
      tagsList.unshift(tagName);
    }
    let isLicensed = Zotero.AI4Paper.letDOI(),
      trimmedList = [];
    for (let i = 0x0; i < 0x64; i++) {
      tagsList[i] != undefined && trimmedList.push(tagsList[i]);
    }
    isLicensed && Zotero.Prefs.set("ai4paper.recentlyaddedTags", trimmedList.join("😊🎈🍓"));
  },
  'add2RecentGPTNoteTags': function (tagName) {
    tagName = "🤖️/" + tagName;
    let storedTags = Zotero.Prefs.get('ai4paper.recentlyaddedGPTNoteTags'),
      tagsList = storedTags.split("😊🎈🍓");
    if (!tagsList.includes(tagName)) tagsList.length === 0x1 && tagsList[0x0] === '' ? tagsList = [tagName] : tagsList.unshift(tagName);else {
      let index = tagsList.indexOf(tagName);
      tagsList.splice(index, 0x1);
      tagsList.unshift(tagName);
    }
    let isLicensed = Zotero.AI4Paper.letDOI(),
      trimmedList = [];
    for (let i = 0x0; i < 0x64; i++) {
      tagsList[i] != undefined && trimmedList.push(tagsList[i]);
    }
    isLicensed && Zotero.Prefs.set("ai4paper.recentlyaddedGPTNoteTags", trimmedList.join('😊🎈🍓'));
  },

  // === Block C: getItemTags ===
  'getItemTags': function (item) {
    let result = '',
      tags = item.getTags();
    if (tags.length != 0x0) {
      result = '';
      for (var i = 0x0; i < tags.length; i++) {
        let tagName = tags[i].tag;
        if (tagName.substring(tagName.length - 0x3, tagName.length) != '\x20📝') {
          Zotero.Prefs.get('ai4paper.tagspunctuationoptimazation') && (tagName = tagName.replace(/\(/g, '（'), tagName = tagName.replace(/\)/g, '）'), tagName = tagName.replace(/—/g, '_'), tagName = tagName.replace(/[\u201c|\u201d|\u2018|\u2019]/g, '_'), tagName = tagName.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\?]/g, '_'));
          if (['📒', "/PDF_auto_download", '/citing', '/refs', "Researcher_App"].includes(tagName)) continue;
          result += '#' + tagName;
          if (i + 0x1 != tags.length) {
            result += '\x20';
          }
        }
      }
      return result;
    } else return result;
  },

  // === Block D: getItemTagsYAML ===
  'getItemTagsYAML': function (item) {
    try {
      let tagNames = item.getTags().map(entry => entry.tag).filter(tag => tag != '📒'),
        processedTags = [];
      for (let tag of tagNames) {
        tag.substring(tag.length - 0x3, tag.length) === " 📝" && (tag = tag.substring(0x0, tag.length - 0x3), Zotero.Prefs.get('ai4paper.nestedtags') ? tag = "📝/" + tag : tag = tag + " 📝");
        tag = tag.replace(/\(/g, '（').replace(/\)/g, '）').replace(/—/g, '_').replace(/[\u201c|\u201d|\u2018|\u2019]/g, '_').replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\?]/g, '_');
        processedTags.push(tag);
      }
      return '[' + processedTags.join(',\x20') + ']';
    } catch (e) {
      return '[]';
    }
  },

  // === Block E: addReadingTag ===
  'addReadingTag': async function (annotation) {
    let parentItem = annotation.parentItem.parentItem;
    if (parentItem.hasTag(this.readingTag) || parentItem.hasTag(this.doneTag)) {
      return false;
    }
    if (parentItem === undefined || !parentItem.isRegularItem()) return false;
    parentItem.addTag(this.readingTag);
    await parentItem.saveTx();
    parentItem.removeTag(this.unreadTag);
    await parentItem.saveTx();
  },

  // === Block F: jump2TagCardNotes ===
  'jump2TagCardNotes': function (tagName) {
    let annotationTags = Zotero.Prefs.get("ai4paper.annotationtagsrecent"),
      imageAnnotationTags = Zotero.Prefs.get('ai4paper.imageannotationtagsrecent'),
      tag = tagName,
      tagType = 0x0,
      tagEntry = {
        'tag': tag,
        'type': tagType
      };
    if (imageAnnotationTags.includes(JSON.stringify(tagEntry))) Zotero.AI4Paper.tagImageCardNotes(tagName);else annotationTags.includes(JSON.stringify(tagEntry)) ? Zotero.AI4Paper.tagCardNotes(tagName) : Zotero.AI4Paper.tagCardNotes(tagName);
  },

  // === Block G: Tag Select/Return/Filter/Search ===
  'openSelectTagWindow': async function (annotation) {
    let metaTitle = Zotero.AI4Paper.getFunMetaTitle();
    if (!metaTitle) {
      return;
    }
    if (Zotero.Prefs.get("ai4paper.annotationtagsrecent").length === 0x0) {
      var tagEntries = [];
    } else var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent"));
    let tagNames = [];
    for (let entry of tagEntries) {
      tagNames.push(entry.tag);
    }
    tagNames.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
    let dialogResult = Zotero.AI4Paper.openDialogByType_modal('selectTags', true);
    if (!dialogResult) {
      return null;
    }
    if (!dialogResult.includes('🏷️')) var selectedTags = [dialogResult.trim()];else {
      dialogResult.trim().indexOf("🏷️") != 0x0 && (dialogResult = "🏷️" + dialogResult.trim());
      var selectedTags = dialogResult.trim().substring(0x3).split("🏷️");
    }
    for (let tag of selectedTags) {
      annotation.addTag(tag);
      await annotation.saveTx();
    }
  },
  'openSelectGPTNoteTagWindow': async function (textArea) {
    let metaTitle = Zotero.AI4Paper.getFunMetaTitle();
    if (!metaTitle) return;
    let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectGPTTag");
    if (!dialogResult) {
      return null;
    }
    var selectedTags = [];
    !dialogResult.includes("🏷️") ? selectedTags = [dialogResult.trim()] : (dialogResult.trim().indexOf("🏷️") != 0x0 && (dialogResult = "🏷️" + dialogResult.trim()), selectedTags = dialogResult.trim().substring(0x3).split("🏷️"));
    if (textArea) {
      let currentValue = textArea.value;
      if (currentValue) {
        let existingLines = currentValue.split('\x0a');
        selectedTags = selectedTags.filter(tag => !existingLines.includes(tag));
      }
      selectedTags.length && (textArea.value = currentValue ? currentValue + '\x0a' + selectedTags.join('\x0a') : selectedTags.join('\x0a'));
    }
  },
  'openDialog_tagsManager': function () {
    let metaTitle = Zotero.AI4Paper.getFunMetaTitle();
    if (!metaTitle) return;
    Zotero.Prefs.get("ai4paper.annotationtagsrecent").length === 0x0 && Zotero.AI4Paper.showProgressWindow(0x1388, "温馨提示", "尚未刷新注释标签，或注释标签数量为 0！");
    Zotero.AI4Paper.openDialogByType("tagsManager");
  },
  'returnItemTags': function () {
    if (Zotero.Prefs.get("ai4paper.itemTags").length === 0x0) {
      var tagEntries = [];
    } else {
      var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags"));
    }
    let tagNames = [];
    for (let entry of tagEntries) {
      tagNames.push(entry.tag);
    }
    return tagNames.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnAnnotationTags': function () {
    if (Zotero.Prefs.get('ai4paper.annotationtagsrecent').length === 0x0) {
      var tagEntries = [];
    } else var tagEntries = JSON.parse(Zotero.Prefs.get('ai4paper.annotationtagsrecent'));
    let tagNames = [];
    for (let entry of tagEntries) {
      tagNames.push(entry.tag);
    }
    return tagNames.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnImageAnnotationTags': function () {
    if (Zotero.Prefs.get("ai4paper.imageannotationtagsrecent").length === 0x0) {
      var tagEntries = [];
    } else var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
    let tagNames = [];
    for (let entry of tagEntries) {
      tagNames.push(entry.tag);
    }
    return tagNames.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnGPTNoteTags': function () {
    if (Zotero.Prefs.get("ai4paper.gptnotetagsrecent").length === 0x0) var tagEntries = [];else var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.gptnotetagsrecent"));
    let tagNames = [];
    for (let entry of tagEntries) {
      tagNames.push(entry.tag);
    }
    return tagNames.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnItemTagsFilter': function (letter) {
    if (Zotero.Prefs.get("ai4paper.itemTags").length === 0x0) var tagEntries = [];else {
      var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags"));
    }
    let filteredTags = [];
    for (let entry of tagEntries) {
      let tagName = entry.tag,
        langType = Zotero.AI4Paper.checkENZH(tagName.substring(0x0, 0x1));
      if (langType === 'en') tagName.substring(0x0, 0x1).toUpperCase() === letter && filteredTags.push(entry.tag);else {
        if (langType === 'zh') {
          let pinyinCode = Zotero.AI4Paper.Pinyin.getWordsCode(tagName);
          pinyinCode != '' && (pinyinCode = pinyinCode.substring(0x0, 0x1).toUpperCase(), pinyinCode == letter && filteredTags.push(entry.tag));
        } else letter === 'OT' && filteredTags.push(entry.tag);
      }
    }
    return filteredTags.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnAnnotationTagsFilter': function (letter) {
    if (Zotero.Prefs.get('ai4paper.annotationtagsrecent').length === 0x0) var tagEntries = [];else var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent"));
    let filteredTags = [];
    for (let entry of tagEntries) {
      let tagName = entry.tag,
        langType = Zotero.AI4Paper.checkENZH(tagName.substring(0x0, 0x1));
      if (langType === 'en') {
        tagName.substring(0x0, 0x1).toUpperCase() === letter && filteredTags.push(entry.tag);
      } else {
        if (langType === 'zh') {
          let pinyinCode = Zotero.AI4Paper.Pinyin.getWordsCode(tagName);
          pinyinCode != '' && (pinyinCode = pinyinCode.substring(0x0, 0x1).toUpperCase(), pinyinCode == letter && filteredTags.push(entry.tag));
        } else letter === 'OT' && filteredTags.push(entry.tag);
      }
    }
    return filteredTags.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnImageAnnotationTagsFilter': function (letter) {
    if (Zotero.Prefs.get('ai4paper.imageannotationtagsrecent').length === 0x0) {
      var tagEntries = [];
    } else var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
    let filteredTags = [];
    for (let entry of tagEntries) {
      let tagName = entry.tag,
        langType = Zotero.AI4Paper.checkENZH(tagName.substring(0x0, 0x1));
      if (langType === 'en') {
        tagName.substring(0x0, 0x1).toUpperCase() === letter && filteredTags.push(entry.tag);
      } else {
        if (langType === 'zh') {
          let pinyinCode = Zotero.AI4Paper.Pinyin.getWordsCode(tagName);
          pinyinCode != '' && (pinyinCode = pinyinCode.substring(0x0, 0x1).toUpperCase(), pinyinCode == letter && filteredTags.push(entry.tag));
        } else {
          if (letter === 'OT') {
            filteredTags.push(entry.tag);
          }
        }
      }
    }
    return filteredTags.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnGPTNoteTagsFilter': function (letter) {
    if (Zotero.Prefs.get('ai4paper.gptnotetagsrecent').length === 0x0) {
      var tagEntries = [];
    } else {
      var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.gptnotetagsrecent"));
    }
    let filteredTags = [];
    for (let entry of tagEntries) {
      let tagName = entry.tag;
      tagName = tagName.indexOf("🤖️/") === 0x0 ? tagName.substring(0x4) : tagName;
      let langType = Zotero.AI4Paper.checkENZH(tagName.substring(0x0, 0x1));
      if (langType === 'en') tagName.substring(0x0, 0x1).toUpperCase() === letter && filteredTags.push(entry.tag);else {
        if (langType === 'zh') {
          let pinyinCode = Zotero.AI4Paper.Pinyin.getWordsCode(tagName);
          pinyinCode != '' && (pinyinCode = pinyinCode.substring(0x0, 0x1).toUpperCase(), pinyinCode == letter && filteredTags.push(entry.tag));
        } else {
          if (letter === 'OT') {
            filteredTags.push(entry.tag);
          }
        }
      }
    }
    return filteredTags.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnItemTagsSearch': function (query) {
    if (Zotero.Prefs.get('ai4paper.itemTags').length === 0x0) var tagEntries = [];else var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags"));
    let matchedTags = [];
    for (let entry of tagEntries) {
      let lowerTag = '' + entry.tag.toLowerCase();
      if (lowerTag.indexOf(query.toLowerCase()) != -0x1) {
        matchedTags.push(entry.tag);
      }
    }
    return matchedTags.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnAnnotationTagsSearch': function (query) {
    if (Zotero.Prefs.get("ai4paper.annotationtagsrecent").length === 0x0) var tagEntries = [];else var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent"));
    let matchedTags = [];
    for (let entry of tagEntries) {
      let lowerTag = '' + entry.tag.toLowerCase();
      lowerTag.indexOf(query.toLowerCase()) != -0x1 && matchedTags.push(entry.tag);
    }
    return matchedTags.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnImageAnnotationTagsSearch': function (query) {
    if (Zotero.Prefs.get("ai4paper.imageannotationtagsrecent").length === 0x0) var tagEntries = [];else var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
    let matchedTags = [];
    for (let entry of tagEntries) {
      let lowerTag = '' + entry.tag.toLowerCase();
      if (lowerTag.indexOf(query.toLowerCase()) != -0x1) {
        matchedTags.push(entry.tag);
      }
    }
    return matchedTags.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },
  'returnGPTNoteTagsSearch': function (query) {
    if (Zotero.Prefs.get("ai4paper.gptnotetagsrecent").length === 0x0) {
      var tagEntries = [];
    } else var tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.gptnotetagsrecent"));
    let matchedTags = [];
    for (let entry of tagEntries) {
      let lowerTag = '' + entry.tag.toLowerCase();
      lowerTag.indexOf(query.toLowerCase()) != -0x1 && matchedTags.push(entry.tag);
    }
    return matchedTags.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
  },

  // === Block H: Progress Percent Utilities ===
  'progressPercent_resetState': function (state, suffix, label) {
    if (state == "initial") {
      Zotero.AI4Paper["progressWindow" + suffix] && Zotero.AI4Paper["progressWindow" + suffix].close();
      Zotero.AI4Paper["current" + suffix] = -0x1;
      Zotero.AI4Paper['toUpdate' + suffix] = 0x0;
      Zotero.AI4Paper["itemsToUpdate" + suffix] = null;
      Zotero.AI4Paper["numberOfUpdatedItems" + suffix] = 0x0;
      Zotero.AI4Paper["counter" + suffix] = 0x0;
      Zotero.AI4Paper['_progressData_' + suffix] = [];
      return;
    }
    const tickIcon = "chrome://zotero/skin/tick.png";
    Zotero.AI4Paper["progressWindow" + suffix] = new Zotero.ProgressWindow({
      'closeOnClick': true
    });
    Zotero.AI4Paper["progressWindow" + suffix].changeHeadline("完成刷新");
    Zotero.AI4Paper["progressWindow" + suffix].progress = new Zotero.AI4Paper['progressWindow' + suffix].ItemProgress(tickIcon);
    Zotero.AI4Paper['progressWindow' + suffix].progress.setProgress(0x64);
    Zotero.AI4Paper["progressWindow" + suffix].progress.setText("共有 " + Zotero.AI4Paper['counter' + suffix] + ('\x20个' + label + '！'));
    Zotero.AI4Paper["progressWindow" + suffix].show();
    Zotero.AI4Paper['progressWindow' + suffix].startCloseTimer(0xfa0);
  },
  'progressPercent_initProgress': function (items, suffix, label) {
    Zotero.AI4Paper.progressPercent_resetState("initial", suffix, label);
    Zotero.AI4Paper['toUpdate' + suffix] = items.length;
    Zotero.AI4Paper["itemsToUpdate" + suffix] = items;
    Zotero.AI4Paper["progressWindow" + suffix] = new Zotero.ProgressWindow({
      'closeOnClick': false
    });
    const searchIcon = "chrome://zotero/skin/toolbar-advanced-search.png";
    Zotero.AI4Paper["progressWindow" + suffix].changeHeadline("正在刷新" + label + "...", searchIcon);
    const searchIconHiDPI = 'chrome://zotero/skin/toolbar-advanced-search' + (Zotero.hiDPI ? "@2x" : '') + ".png";
    Zotero.AI4Paper["progressWindow" + suffix].progress = new Zotero.AI4Paper["progressWindow" + suffix].ItemProgress(searchIconHiDPI, "正在刷新" + label + "...");
  },
  'progressPercent_updatePercent': function (suffix, statusText) {
    Zotero.AI4Paper["current" + suffix]++;
    const percent = Math.round(Zotero.AI4Paper["numberOfUpdatedItems" + suffix] / Zotero.AI4Paper["toUpdate" + suffix] * 0x64);
    Zotero.AI4Paper["progressWindow" + suffix].progress.setProgress(percent);
    Zotero.AI4Paper["progressWindow" + suffix].progress.setText(statusText + Zotero.AI4Paper["current" + suffix] + " of " + Zotero.AI4Paper["toUpdate" + suffix]);
    Zotero.AI4Paper['progressWindow' + suffix].show();
  },

  // === Block I: Tag Display/Selector/Check ===
  'showItemsBasedOnTag': async function (tagName) {
    let collectionID = 0x1;
    if (Zotero.Collections.getByLibrary(0x1).length != 0x0) collectionID = Zotero.Collections.getByLibrary(0x1)[0x0].id;else return;
    await ZoteroPane.collectionsView.selectCollection(collectionID);
    await new Promise(resolve => setTimeout(resolve, 0x64));
    ZoteroPane.collectionsView.selectLibrary();
    let tagFilter = [{
      'tag': tagName,
      'type': 0x0
    }];
    await Zotero.AI4Paper.showLibraryAnnotationTags(tagFilter);
    let retryCount = 0x0,
      matchedElements = [];
    while (matchedElements.length === 0x0) {
      if (retryCount >= 0x320) {
        Zotero.debug("AI4Paper: Waiting for tag loading failed...");
        return;
      }
      let allTagItems = window.document.querySelector('.tag-selector-list').querySelectorAll('.tag-selector-item');
      matchedElements = Array.from(allTagItems).filter(el => el.querySelector('span').textContent === tagName);
      await Zotero.Promise.delay(0xa);
      retryCount++;
    }
    matchedElements[0x0].click();
  },
  'showLibraryAnnotationTags': async function (tags) {
    await Zotero_Tabs.select('zotero-pane');
    await ZoteroPane.collectionsView.selectLibrary();
    await new Promise(resolve => setTimeout(resolve, 0x320));
    var tagScope = new Set(tags.map(entry => entry.tag));
    if (ZoteroPane.tagSelector.state.tags.length == tags.length) {
      let existingTagSet = new Set(ZoteroPane.tagSelector.state.tags.map(entry => entry.tag)),
        allMatch = true;
      for (let tagEntry of tags) {
        if (!existingTagSet.has(tagEntry.tag)) {
          allMatch = false;
          break;
        }
      }
      if (allMatch) {
        return Zotero.debug('Tags\x20haven\x27t\x20changed'), {
          'tags': ZoteroPane.tagSelector.state.tags,
          'scope': tagScope
        };
      }
    }
    ZoteroPane.tagSelector.sortTags(tags);
    ZoteroPane.tagSelector.setState({
      'tags': tags,
      'scope': tagScope
    });
  },
  'tagSelector_displayItemTags': async function () {
    if (Zotero.Prefs.get('ai4paper.itemTags').length === 0x0) {
      Services.prompt.alert(window, Zotero.getString("条目标签（最近刷新）"), Zotero.getString("尚未刷新条目标签，或条目标签数量为 0！"));
      return;
    }
    let tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.itemTags"));
    await Zotero.AI4Paper.showLibraryAnnotationTags(tagEntries);
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 条目标签（最近刷新）", "共有 " + tagEntries.length + " 个条目标签！");
  },
  'tagSelector_updateItemTags': async function () {
    let allTags = await Zotero.Tags.getAll(0x1);
    if (allTags.length === 0x0) {
      window.alert('未发现任何标签！');
      return;
    }
    let progressSuffix = "_tagSelector_updateItemTags",
      progressLabel = "条目标签";
    Zotero.AI4Paper.progressPercent_initProgress(allTags, progressSuffix, progressLabel);
    Zotero.AI4Paper.tagSelector_updateItemTags_checkNext(progressSuffix, progressLabel);
  },
  'tagSelector_updateItemTags_checkNext': async function (suffix, label) {
    Zotero.AI4Paper['numberOfUpdatedItems' + suffix]++;
    if (Zotero.AI4Paper["current" + suffix] == Zotero.AI4Paper["toUpdate" + suffix] - 0x1) {
      Zotero.AI4Paper["progressWindow" + suffix].close();
      Zotero.AI4Paper.progressPercent_resetState(null, suffix, label);
      Zotero.Prefs.set("ai4paper.itemTags", JSON.stringify(Zotero.AI4Paper["_progressData_" + suffix]));
      await Zotero.AI4Paper.showLibraryAnnotationTags(Zotero.AI4Paper['_progressData_' + suffix]);
      return;
    }
    Zotero.AI4Paper.progressPercent_updatePercent(suffix, "检查所有标签： ");
    Zotero.AI4Paper.tagSelector_updateItemTags_checkTag(Zotero.AI4Paper["itemsToUpdate" + suffix][Zotero.AI4Paper["current" + suffix]], suffix, label);
  },
  'tagSelector_updateItemTags_checkTag': async function (tagObj, suffix, label) {
    try {
      let isItemTag = await Zotero.AI4Paper.checkItemTag(tagObj.tag);
      if (isItemTag) {
        let tag = tagObj.tag,
          tagType = 0x0,
          tagEntry = {
            'tag': tag,
            'type': tagType
          };
        !JSON.stringify(Zotero.AI4Paper["_progressData_" + suffix]).includes(JSON.stringify(tagEntry)) && (Zotero.AI4Paper["_progressData_" + suffix].push(tagEntry), Zotero.AI4Paper["counter" + suffix]++);
      }
    } catch (e) {
      Zotero.debug(e);
    }
    Zotero.AI4Paper.tagSelector_updateItemTags_checkNext(suffix, label);
  },
  'tagSelector_displayAnnotationTags': async function () {
    if (Zotero.Prefs.get("ai4paper.annotationtagsrecent").length === 0x0) {
      Services.prompt.alert(window, Zotero.getString("注释标签（最近刷新）"), Zotero.getString('尚未刷新注释标签，或注释标签数量为\x200！'));
      return;
    }
    let tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent"));
    await Zotero.AI4Paper.showLibraryAnnotationTags(tagEntries);
    Zotero.AI4Paper.showProgressWindow(0xbb8, '✅\x20注释标签（最近刷新）', '共有\x20' + tagEntries.length + " 个注释标签！");
  },
  'tagSelector_updateAnnotationTags': async function () {
    let allTags = await Zotero.Tags.getAll(0x1);
    if (allTags.length === 0x0) {
      window.alert('未发现任何标签！');
      return;
    }
    let progressSuffix = "_tagSelector_updateAnnotationTags",
      progressLabel = "注释标签";
    Zotero.AI4Paper.progressPercent_initProgress(allTags, progressSuffix, progressLabel);
    Zotero.AI4Paper.tagSelector_updateAnnotationTags_checkNext(progressSuffix, progressLabel);
  },
  'tagSelector_updateAnnotationTags_checkNext': async function (suffix, label) {
    Zotero.AI4Paper["numberOfUpdatedItems" + suffix]++;
    if (Zotero.AI4Paper['current' + suffix] == Zotero.AI4Paper["toUpdate" + suffix] - 0x1) {
      Zotero.AI4Paper["progressWindow" + suffix].close();
      Zotero.AI4Paper.progressPercent_resetState(null, suffix, label);
      Zotero.Prefs.set("ai4paper.annotationtagsrecent", JSON.stringify(Zotero.AI4Paper['_progressData_' + suffix]));
      await Zotero.AI4Paper.showLibraryAnnotationTags(Zotero.AI4Paper["_progressData_" + suffix]);
      return;
    }
    Zotero.AI4Paper.progressPercent_updatePercent(suffix, '检查所有标签：\x20');
    Zotero.AI4Paper.tagSelector_updateAnnotationTags_checkTag(Zotero.AI4Paper["itemsToUpdate" + suffix][Zotero.AI4Paper["current" + suffix]], suffix, label);
  },
  'tagSelector_updateAnnotationTags_checkTag': async function (tagObj, suffix, label) {
    try {
      let isAnnotationTag = await Zotero.AI4Paper.checkAnnotationTag(tagObj.tag);
      if (isAnnotationTag) {
        let tag = tagObj.tag,
          tagType = 0x0,
          tagEntry = {
            'tag': tag,
            'type': tagType
          };
        !JSON.stringify(Zotero.AI4Paper["_progressData_" + suffix]).includes(JSON.stringify(tagEntry)) && (Zotero.AI4Paper["_progressData_" + suffix].push(tagEntry), Zotero.AI4Paper["counter" + suffix]++);
      }
    } catch (e) {
      Zotero.debug(e);
    }
    Zotero.AI4Paper.tagSelector_updateAnnotationTags_checkNext(suffix, label);
  },
  'tagSelector_displayImageAnnotationTags': async function () {
    if (Zotero.Prefs.get("ai4paper.imageannotationtagsrecent").length === 0x0) {
      Services.prompt.alert(window, Zotero.getString('图片注释标签（最近刷新）'), Zotero.getString("尚未刷新图片注释标签，或图片注释标签数量为 0！"));
      return;
    }
    let tagEntries = JSON.parse(Zotero.Prefs.get("ai4paper.imageannotationtagsrecent"));
    await Zotero.AI4Paper.showLibraryAnnotationTags(tagEntries);
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 图片注释标签（最近刷新）", "共有 " + tagEntries.length + " 个图片注释标签！");
  },
  'tagSelector_updateImageAnnotationTags': async function () {
    let allTags = await Zotero.Tags.getAll(0x1);
    if (allTags.length === 0x0) {
      window.alert("未发现任何标签！");
      return;
    }
    let progressSuffix = '_tagSelector_updateImageAnnotationTags',
      progressLabel = "图片注释标签";
    Zotero.AI4Paper.progressPercent_initProgress(allTags, progressSuffix, progressLabel);
    Zotero.AI4Paper.tagSelector_updateImageAnnotationTags_checkNext(progressSuffix, progressLabel);
  },
  'tagSelector_updateImageAnnotationTags_checkNext': async function (suffix, label) {
    Zotero.AI4Paper["numberOfUpdatedItems" + suffix]++;
    if (Zotero.AI4Paper["current" + suffix] == Zotero.AI4Paper["toUpdate" + suffix] - 0x1) {
      Zotero.AI4Paper['progressWindow' + suffix].close();
      Zotero.AI4Paper.progressPercent_resetState(null, suffix, label);
      Zotero.Prefs.set("ai4paper.imageannotationtagsrecent", JSON.stringify(Zotero.AI4Paper["_progressData_" + suffix]));
      await Zotero.AI4Paper.showLibraryAnnotationTags(Zotero.AI4Paper["_progressData_" + suffix]);
      return;
    }
    Zotero.AI4Paper.progressPercent_updatePercent(suffix, '检查所有标签：\x20');
    Zotero.AI4Paper.tagSelector_updateImageAnnotationTags_checkTag(Zotero.AI4Paper['itemsToUpdate' + suffix][Zotero.AI4Paper["current" + suffix]], suffix, label);
  },
  'tagSelector_updateImageAnnotationTags_checkTag': async function (tagObj, suffix, label) {
    try {
      let isImageTag = await Zotero.AI4Paper.checkImageAnnotationTag(tagObj.tag);
      if (isImageTag) {
        let tag = tagObj.tag,
          tagType = 0x0,
          tagEntry = {
            'tag': tag,
            'type': tagType
          };
        !JSON.stringify(Zotero.AI4Paper["_progressData_" + suffix]).includes(JSON.stringify(tagEntry)) && (Zotero.AI4Paper["_progressData_" + suffix].push(tagEntry), Zotero.AI4Paper["counter" + suffix]++);
      }
    } catch (e) {
      Zotero.debug(e);
    }
    Zotero.AI4Paper.tagSelector_updateImageAnnotationTags_checkNext(suffix, label);
  },
  'checkItemTag': async function (tagName) {
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("tag", 'is', tagName);
    if (Zotero.AI4Paper.isZoteroVersion()) {
      search.addCondition('itemType', 'isNot', 'annotation');
      var resultIDs = await search.search();
      if (resultIDs.length) return true;
      return false;
    } else {
      search.addCondition("itemType", 'isNot', 'attachment');
      var resultIDs = await search.search();
      if (resultIDs.length) return true;else {
        search = new Zotero.Search();
        search.libraryID = Zotero.Libraries.userLibraryID;
        search.addCondition('tag', 'is', tagName);
        search.addCondition("itemType", 'is', 'attachment');
        resultIDs = await search.search();
        if (resultIDs.length === 0x0) {
          return false;
        }
        var attachments = [];
        for (let id of resultIDs) {
          attachments.push(Zotero.Items.get(id));
        }
        for (let attachment of attachments) {
          try {
            let itemTags = attachment.getTags();
            for (let tagObj of itemTags) {
              if (tagObj.tag === tagName) {
                return true;
              }
            }
          } catch (e) {
            Zotero.debug(e);
          }
        }
      }
      return false;
    }
  },
  'checkAnnotationTag': async function (tagName) {
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("tag", 'is', tagName);
    if (Zotero.AI4Paper.isZoteroVersion()) {
      search.addCondition("itemType", 'is', "annotation");
      var resultIDs = await search.search();
      if (resultIDs.length) {
        return true;
      }
      return false;
    } else {
      search.addCondition("itemType", 'is', "attachment");
      var resultIDs = await search.search();
      if (resultIDs.length === 0x0) return false;
      var attachments = [];
      for (let id of resultIDs) {
        attachments.push(Zotero.Items.get(id));
      }
      for (let attachment of attachments) {
        try {
          var annotations = await attachment.getAnnotations();
          for (let annotation of annotations) {
            let annTags = annotation.getTags();
            for (let tagObj of annTags) {
              if (tagObj.tag === tagName) {
                return true;
              }
            }
          }
        } catch (e) {
          Zotero.debug(e);
        }
      }
      return false;
    }
  },
  'checkImageAnnotationTag': async function (tagName) {
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("tag", 'is', tagName);
    if (Zotero.AI4Paper.isZoteroVersion()) {
      search.addCondition("itemType", 'is', 'annotation');
      var resultIDs = await search.search();
      if (resultIDs.length === 0x0) return false;
      for (let id of resultIDs) {
        let annotation = Zotero.Items.get(id);
        if (annotation.annotationType === "image") {
          return true;
        }
      }
      return false;
    } else {
      search.addCondition("itemType", 'is', "attachment");
      var resultIDs = await search.search();
      if (resultIDs.length === 0x0) return false;
      var attachments = [];
      for (let id of resultIDs) {
        attachments.push(Zotero.Items.get(id));
      }
      for (let attachment of attachments) {
        try {
          var annotations = await attachment.getAnnotations();
          for (let annotation of annotations) {
            let annTags = annotation.getTags();
            for (let tagObj of annTags) {
              if (tagObj.tag === tagName && annotation.annotationType === "image") return true;
            }
          }
        } catch (e) {
          Zotero.debug(e);
        }
      }
      return false;
    }
  },
  'checkGPTNoteTag': async function (tagName) {
    if (!tagName.includes("🤖️/")) {
      return false;
    }
    var search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("tag", 'is', tagName);
    search.addCondition("itemType", 'is', "note");
    var resultIDs = await search.search();
    return resultIDs.length ? true : false;
  },

  // === Block J: Tag Batch Operations ===
  'updateAutomaticTags': async function () {
    await Zotero_Tabs.select("zotero-pane");
    await ZoteroPane.collectionsView.selectLibrary();
    let autoTagIDs = await Zotero.Tags.getAutomaticInLibrary(ZoteroPane.getSelectedLibraryID()),
      autoTagEntries = [];
    for (let tagID of autoTagIDs) {
      let tagType = 0x1,
        tagName = Zotero.Tags.getName(tagID);
      if (!["/unread", "/PDF_auto_download", '预警期刊'].includes(tagName)) {
        let tagEntry = {
          'tag': tagName,
          'type': tagType
        };
        autoTagEntries.push(tagEntry);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 0x3e8));
    await Zotero.AI4Paper.showLibraryAnnotationTags(autoTagEntries);
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 刷新自动标签", "共有 " + autoTagEntries.length + " 个自动标签！");
  },
  'deleteAutomaticTags': async function () {
    let confirmed = Services.prompt.confirm(window, "删除自动标签", "是否要彻底删除所有自动标签（不包括 AI4paper 内置的）？\n\n👉 删除后，这些标签将无法恢复！\n\nPs：要删除的自动标签可以通过【刷新自动标签】查看！");
    if (confirmed) {
      let autoTagIDs = await Zotero.Tags.getAutomaticInLibrary(0x1),
        deleteCount = 0x0;
      for (let tagID of autoTagIDs) {
        let tagName = Zotero.Tags.getName(tagID);
        if (!['/unread', "/PDF_auto_download", '预警期刊'].includes(tagName)) {
          Zotero.Tags.removeFromLibrary(0x1, tagID);
          deleteCount++;
        }
      }
      Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 删除自动标签", "共删除 " + deleteCount + '\x20个自动标签！');
    }
  },
  'deleteTagsBatch': async function () {
    let allTags = await Zotero.Tags.getAll(0x1),
      tagNames = allTags.map(entry => entry.tag);
    if (!tagNames.length) {
      window.alert("未在【我的文库】内发现标签，无须删除！");
      return;
    }
    Zotero.AI4Paper.openDialogByType('deleteTags');
  },
  'renameTagsBatch': async function () {
    let allTags = await Zotero.Tags.getAll(0x1),
      tagNames = allTags.map(entry => entry.tag);
    if (!tagNames.length) {
      window.alert("未在【我的文库】内发现标签，无须删除！");
      return;
    }
    Zotero.AI4Paper.openDialogByType("renameTags");
  },

  // === Block K: exportTagTree ===
  'exportTagTree': async function (markdownContent, tagCategory) {
    var {
      FilePicker: FilePicker
    } = ChromeUtils.importESModule('chrome://zotero/content/modules/filePicker.mjs');
    const filePicker = new FilePicker();
    filePicker.displayDirectory = OS.Constants.Path.homeDir;
    filePicker.init(window, "Export TagTree to markdown...", filePicker.modeSave);
    filePicker.appendFilter('Text', "*.md");
    let now = new Date(),
      dateStr = now.toLocaleDateString().replace(/\//g, '-'),
      fileName = "Markdown " + tagCategory + "标签树 " + dateStr;
    filePicker.defaultString = fileName + ".md";
    const pickerResult = await filePicker.show();
    if (pickerResult == filePicker.returnOK || pickerResult == filePicker.returnReplace) {
      let filePath = filePicker.file;
      if (filePath.split('.').pop().toLowerCase() != 'md') {
        filePath += ".md";
      }
      await Zotero.File.putContentsAsync(filePath, markdownContent);
      Zotero.AI4Paper.showProgressWindow(0xbb8, "导出 Markdown 标签树【AI4paper】", "✅ 成功导出 Markdown " + tagCategory + '标签树！');
      if (await OS.File.exists(filePath)) {
        let file = Zotero.File.pathToFile(filePath);
        try {
          file.reveal();
        } catch (e) {}
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
    let selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID,
        item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID), await Zotero.AI4Paper.generateTagsCollection_Item(item), this.showProgressWindow(0x1388, '✅\x20生成标签集\x20【Zotero\x20One】', "您已为当前文献生成标签集！", "zoteorif"));
    } else {
      let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems(),
        regularItems = selectedItems.filter(item => item.isRegularItem());
      for (let item of regularItems) {
        await Zotero.AI4Paper.generateTagsCollection_Item(item);
      }
      this.showProgressWindow(0x1388, '✅\x20生成标签集\x20【Zotero\x20One】', '您已为【' + regularItems.length + "】篇文献生成标签集！", "zoteorif");
    }
  },
  'generateTagsCollection_Item': async function (item) {
    let fieldName = "extra";
    if (Zotero.Prefs.get("ai4paper.tagscollectionField") === '其他') fieldName = "extra";else {
      if (Zotero.Prefs.get("ai4paper.tagscollectionField") === "存档位置") fieldName = 'archiveLocation';else {
        if (Zotero.Prefs.get("ai4paper.tagscollectionField") === '索书号') {
          fieldName = 'callNumber';
        } else Zotero.Prefs.get('ai4paper.tagscollectionField') === "文库编目" && (fieldName = 'libraryCatalog');
      }
    }
    if (!Zotero.Prefs.get("ai4paper.tagscollectiondisable") && Zotero.AI4Paper.checkItemField(item, fieldName)) {
      let itemTags = item.getTags().filter(entry => !["/PDF_auto_download", "/citing", '/refs', "Researcher App"].includes(entry.tag)).map(entry => entry.tag),
        annotationTags = await Zotero.AI4Paper.getAnnotatioinTagsArray(item),
        allTags = [...new Set(itemTags.concat(annotationTags))];
      allTags.length ? item.setField(fieldName, "🏷️ " + allTags.join('、')) : item.setField(fieldName, '');
      await item.saveTx();
    }
  },
  'handleItemTagChange': async function (itemID) {
    let item = Zotero.Items.get(itemID);
    if (item) {
      if (item.itemType === "annotation") {
        item = item.parentItem.parentItem;
        item && item.isRegularItem() && (await Zotero.AI4Paper.generateTagsCollection_Item(item));
      } else item.isRegularItem() && (await Zotero.AI4Paper.generateTagsCollection_Item(item));
    }
  },

  // === Block M: Tag Removal Operations ===
  'getAnnotatioinTagsArray': async function (item) {
    let allAnnotationTags = [],
      attachmentIDs = item.getAttachments();
    for (let attachmentID of attachmentIDs) {
      let attachment = Zotero.Items.get(attachmentID);
      if (["application/pdf", "text/html", "application/epub+zip"].includes(attachment.attachmentContentType)) {
        if (attachment.attachmentLinkMode === 0x3) continue;
        var annotations = await attachment.getAnnotations().filter(ann => ann.annotationType != "ink");
        for (let annotation of annotations) {
          allAnnotationTags.push(...annotation.getTags().map(entry => '📝\x20' + entry.tag));
        }
      }
    }
    return allAnnotationTags;
  },
  'removeTags_SelectedItems': async function () {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return false;
    }
    let confirmed = Services.prompt.confirm(window, '清除条目标签', "是否确认删除选定文献的所有条目标签？如果误删，将无法恢复。");
    if (!confirmed) return false;
    Zotero.debug('AI4Paper:\x20Remove\x20Tags\x20for\x20Selected\x20items');
    let selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID,
        item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        await Zotero.AI4Paper.removeTags_Item(item);
        this.showProgressWindow(0x1388, "✅ 清除条目标签 【AI4paper】", '成功清除当前文献的条目标签', 'zoteorif');
      }
    } else {
      let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems(),
        regularItems = selectedItems.filter(item => item.isRegularItem());
      for (let item of regularItems) {
        await Zotero.AI4Paper.removeTags_Item(item);
      }
      this.showProgressWindow(0x1388, "✅ 清除条目标签 【AI4paper】", "成功清除【" + regularItems.length + "】篇文献的条目标签！", "zoteorif");
    }
  },
  'removeTags_Item': async function (item) {
    item.removeAllTags();
    await item.saveTx();
    this.generateTagsCollection_Item(item);
  },
  'removeTagsCollection_SelectedItems': async function () {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    Zotero.debug('AI4Paper:\x20Remove\x20Tags\x20Collection\x20for\x20Selected\x20items');
    let fieldName = "extra";
    if (Zotero.Prefs.get("ai4paper.tagscollectionField") === '其他') {
      fieldName = "extra";
    } else {
      if (Zotero.Prefs.get('ai4paper.tagscollectionField') === "存档位置") {
        fieldName = "archiveLocation";
      } else {
        if (Zotero.Prefs.get("ai4paper.tagscollectionField") === "索书号") fieldName = "callNumber";else Zotero.Prefs.get("ai4paper.tagscollectionField") === "文库编目" && (fieldName = 'libraryCatalog');
      }
    }
    let selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID,
        item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        if (Zotero.AI4Paper.checkItemField(item, fieldName)) {
          item.setField(fieldName, '');
          await item.saveTx();
          this.showProgressWindow(0x1388, "✅ 清除标签集 【AI4paper】", "成功清除当前文献的条目标签集", "zoteorif");
        }
      }
    } else {
      let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems(),
        regularItems = selectedItems.filter(item => item.isRegularItem());
      for (let item of regularItems) {
        Zotero.AI4Paper.checkItemField(item, fieldName) && (item.setField(fieldName, ''), await item.saveTx());
      }
      this.showProgressWindow(0x1388, "✅ 清除标签集 【AI4paper】", "成功清除【" + regularItems.length + "】篇文献的条目标签集！", 'zoteorif');
    }
  },

  // === Block N: addUnreadTag ===
  'addUnreadTag': async function (item) {
    Zotero.Prefs.get("ai4paper.autounreadtag") && (await Zotero.Promise.delay(0x5), !item.hasTag(this.doneTag) && !item.hasTag(this.readingTag) && (item.addTag(this.unreadTag, 0x1), await item.saveTx()));
  },

});
