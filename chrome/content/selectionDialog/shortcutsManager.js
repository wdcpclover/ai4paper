var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  Zotero.AI4Paper.setFontSize_Dialog(document.querySelector("dialog"), 0.92);
  Zotero.AI4Paper.blurActiveElement(window);
  let var1 = Zotero.AI4Paper._shortCuts_items;
  methodsBody._inputBoxElems = [];
  for (let var2 of var1) {
    document.getElementById('ai4paper.enableShortcuts' + var2).checked = Zotero.Prefs.get('ai4paper.enableShortcuts' + var2);
    document.getElementById("ai4paper.shortcutsInputBox." + var2).value = Zotero.Prefs.get("ai4paper.shortcuts" + var2);
    methodsBody._inputBoxElems.push(document.getElementById("ai4paper.shortcutsInputBox." + var2));
  }
  methodsBody._shortcuts_param = {
    'AddAnnotationTag': {
      'mac_Shortcuts': "⌘ T",
      'win_linux_Shortcuts': "Control T",
      'func': "registerShortcuts_AddAnnotationTag"
    },
    'CopyBlockQuoteLink': {
      'mac_Shortcuts': "⌘ L",
      'win_linux_Shortcuts': "Control L",
      'func': "registerShortcuts_CopyBlockQuoteLink"
    },
    'SetAnnotationHead': {
      'mac_Shortcuts': '⌘\x20⇧\x20D',
      'win_linux_Shortcuts': 'Control\x20Shift\x20D',
      'func': 'registerShortcuts_SetAnnotationHead'
    },
    'CardNotesSearch': {
      'mac_Shortcuts': "⇧ F",
      'win_linux_Shortcuts': "Shift F",
      'func': "registerShortcuts_CardNotesSearch"
    },
    'AddRelatedRefs': {
      'mac_Shortcuts': "⌘ R",
      'win_linux_Shortcuts': "Control R",
      'func': 'registerShortcuts_AddRelatedRefs'
    },
    'ZoteroAdvancedSearch': {
      'mac_Shortcuts': "⌥ F",
      'win_linux_Shortcuts': "Alt F",
      'func': "registerShortcuts_ZoteroAdvancedSearch"
    },
    'CopyAnnotationLink': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_CopyAnnotationLink"
    },
    'CopyAnnotationLinkOnly': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_CopyAnnotationLinkOnly"
    },
    'CopyAnnotationLinkMD': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': 'registerShortcuts_CopyAnnotationLinkMD'
    },
    'CopyAnnotationText': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_CopyAnnotationText"
    },
    'CollapseLeftSidePane': {
      'mac_Shortcuts': '[',
      'win_linux_Shortcuts': '[',
      'func': 'registerShortcuts_CollapseLeftSidePane'
    },
    'CollapseRightSidePane': {
      'mac_Shortcuts': ']',
      'win_linux_Shortcuts': ']',
      'func': 'registerShortcuts_CollapseRightSidePane'
    },
    'CopyPDFAttachmentsLink': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_CopyPDFAttachmentsLink"
    },
    'CopyPDF': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_CopyPDF"
    },
    'OpenWith': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_OpenWith"
    },
    'ChatwithNewbing': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_ChatwithNewbing"
    },
    'ImmersiveTranslate': {
      'mac_Shortcuts': "⌘ I",
      'win_linux_Shortcuts': "Control I",
      'func': "registerShortcuts_ImmersiveTranslate"
    },
    'UniversalImmersiveTranslate': {
      'mac_Shortcuts': "⌘ ⌥ I",
      'win_linux_Shortcuts': "Control Alt I",
      'func': "registerShortcuts_UniversalImmersiveTranslate"
    },
    'FilesHistory': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_FilesHistory"
    },
    'WorkSpace': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_WorkSpace"
    },
    'AttachNewFile': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': 'registerShortcuts_AttachNewFile'
    },
    'RenameAttachments': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': 'registerShortcuts_RenameAttachments'
    },
    'Archive': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_Archive"
    },
    'SplitHorizontally': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_SplitHorizontally"
    },
    'SplitVertically': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_SplitVertically"
    },
    'OddSpreads': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_OddSpreads"
    },
    'StarOne': {
      'mac_Shortcuts': "⌥ 1",
      'win_linux_Shortcuts': 'Control\x20Alt\x201',
      'func': "registerShortcuts_StarOne"
    },
    'StarTwo': {
      'mac_Shortcuts': "⌥ 2",
      'win_linux_Shortcuts': "Control Alt 2",
      'func': 'registerShortcuts_StarTwo'
    },
    'StarThree': {
      'mac_Shortcuts': '⌥\x203',
      'win_linux_Shortcuts': "Control Alt 3",
      'func': "registerShortcuts_StarThree"
    },
    'StarFour': {
      'mac_Shortcuts': "⌥ 4",
      'win_linux_Shortcuts': "Control Alt 4",
      'func': "registerShortcuts_StarFour"
    },
    'StarFive': {
      'mac_Shortcuts': "⌥ 5",
      'win_linux_Shortcuts': 'Control\x20Alt\x205',
      'func': 'registerShortcuts_StarFive'
    },
    'StarClear': {
      'mac_Shortcuts': '⌥\x200',
      'win_linux_Shortcuts': "Control Alt 0",
      'func': 'registerShortcuts_StarClear'
    },
    'PaperAI': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_PaperAI"
    },
    'LocateAIReadingNotes': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_LocateAIReadingNotes"
    },
    'GetFullText': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_GetFullText"
    },
    'ChangeGPTChatMode': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_ChangeGPTChatMode"
    },
    'TagCardNotes': {
      'mac_Shortcuts': "⌘ N",
      'win_linux_Shortcuts': "Control N",
      'func': "registerShortcuts_TagCardNotes"
    },
    'ObsidianNote': {
      'mac_Shortcuts': "⌘ K",
      'win_linux_Shortcuts': 'Control\x20K',
      'func': 'registerShortcuts_ObsidianNote'
    },
    'ObsidianBlock': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': 'registerShortcuts_ObsidianBlock'
    },
    'SetCommentTemplate': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_SetCommentTemplate"
    },
    'LocateItemInPapersMatrix': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_LocateItemInPapersMatrix"
    },
    'SearchCollectionInPapersMatrix': {
      'mac_Shortcuts': '',
      'win_linux_Shortcuts': '',
      'func': "registerShortcuts_SearchCollectionInPapersMatrix"
    }
  };
};
methodsBody.setKeyListener = function (param1, param2) {
  let var3 = "addEventListener";
  param2 === "remove" && (var3 = "removeEventListener");
  param1.target[var3]("keydown", methodsBody.onKeyDown_shortCutsInput);
};
methodsBody.onKeyDown_shortCutsInput = function (param3) {
  let var4 = {
      '9': 'Tab',
      '16': "Shift",
      '17': 'Control',
      '18': "Alt",
      '20': 'CapsLock',
      '32': Zotero.isMac ? '␣' : "Space",
      '37': "ArrowLeft",
      '38': "ArrowUp",
      '39': "ArrowRight",
      '40': "ArrowDown",
      '48': '0',
      '49': '1',
      '50': '2',
      '51': '3',
      '52': '4',
      '53': '5',
      '54': '6',
      '55': '7',
      '56': '8',
      '57': '9',
      '59': ';',
      '65': 'A',
      '66': 'B',
      '67': 'C',
      '68': 'D',
      '69': 'E',
      '70': 'F',
      '71': 'G',
      '72': 'H',
      '73': 'I',
      '74': 'J',
      '75': 'K',
      '76': 'L',
      '77': 'M',
      '78': 'N',
      '79': 'O',
      '80': 'P',
      '81': 'Q',
      '82': 'R',
      '83': 'S',
      '84': 'T',
      '85': 'U',
      '86': 'V',
      '87': 'W',
      '88': 'X',
      '89': 'Y',
      '90': 'Z',
      '187': '=',
      '188': ',',
      '189': '-',
      '190': '.',
      '191': '/',
      '192': '`',
      '219': '[',
      '220': '\x5c',
      '221': ']',
      '222': '\x27'
    },
    var5 = param3.target,
    var6 = param3.key,
    var7 = param3.keyCode,
    var8 = [],
    var9 = [];
  if (Zotero.isMac) {
    if (param3.metaKey) var8.push('⌘');
    if (param3.ctrlKey) var8.push('⌃');
    if (param3.shiftKey) var8.push('⇧');
    if (param3.altKey) var8.push('⌥');
  } else {
    if (Zotero.isWin || Zotero.isLinux) {
      if (param3.metaKey) var8.push("Win");
      if (param3.ctrlKey) var8.push("Control");
      if (param3.shiftKey) var8.push('Shift');
      if (param3.altKey) var8.push("Alt");
    }
  }
  var4[var7] ? var6 = var4[var7] : var6 = '';
  ["Control", "Shift", "Alt", "Meta", "Backspace", "Delete"].includes(param3.key) && (var6 = '', ['Backspace', "Delete"].includes(param3.key) && (var5.value = '', methodsBody.handleShortcuts_init(var5, true)));
  var8.join('\x20').length && var9.push(var8.join('\x20'));
  var6 && var9.push(var6);
  var6 && (var5.value = var9.join('\x20'), methodsBody.handleShortcuts_init(var5, false));
};
methodsBody.handleShortcuts_init = function (param4, param5) {
  let var10 = methodsBody._inputBoxElems,
    var11 = param5 ? null : param4.value;
  for (let var12 of var10) {
    if (var12 === param4) {
      let var13 = var12.id.lastIndexOf('.'),
        var14 = var12.id.substring(var13 + 0x1);
      methodsBody.handleShortcuts(var14, param5, var11);
    }
  }
};
methodsBody.handleShortcuts = function (param6, param7, param8) {
  let var15 = methodsBody._shortcuts_param;
  var15[param6] && (param7 ? (document.getElementById('ai4paper.enableShortcuts' + param6).checked = false, Zotero.Prefs.set("ai4paper.enableShortcuts" + param6, false), Zotero.Prefs.set('ai4paper.shortcuts' + param6, '')) : Zotero.Prefs.set('ai4paper.shortcuts' + param6, param8), Zotero.AI4Paper[var15[param6].func]());
};
methodsBody.resetShortcuts = function (param9) {
  let var16 = methodsBody._shortcuts_param;
  if (var16[param9]) {
    let var17 = Zotero.isMac ? var16[param9].mac_Shortcuts : var16[param9].win_linux_Shortcuts;
    Zotero.Prefs.set("ai4paper.shortcuts" + param9, var17);
    document.getElementById("ai4paper.shortcutsInputBox." + param9).value = var17;
    Zotero.AI4Paper[var16[param9].func]();
  }
};
methodsBody.enableShortcuts = function (param10, param11) {
  let var18 = methodsBody._shortcuts_param;
  var18[param10] && (Zotero.Prefs.set("ai4paper.enableShortcuts" + param10, param11), Zotero.AI4Paper[var18[param10].func]());
};
methodsBody.navigate = function (param12) {
  let var19 = document.getElementById('navigator-item-' + param12);
  var19 && (var19.focus(), var19.scrollIntoView({
    'behavior': "smooth",
    'block': "start"
  }));
};