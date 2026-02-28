// AI4Paper Shortcuts Module - Keyboard shortcut registration and handling
Object.assign(Zotero.AI4Paper, {
  'registerShortcuts': function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    this.registerShortCuts_Window('add');
    this.registerShortcuts_Translation();
    this.registerShortcuts_PreviewWin();
    let var22 = Zotero.AI4Paper._shortCuts_items;
    for (let var23 of var22) {
      Zotero.AI4Paper["registerShortcuts_" + var23]();
    }
  },
  'unregisterShortcuts': function () {
    this.registerShortCuts_Window("remove");
    window.document.querySelectorAll("#AI4Paper-Translation-keyset").forEach(_0x387471 => _0x387471.remove());
    window.document.querySelectorAll("#AI4Paper-PreviewWin-keyset").forEach(_0x99deb5 => _0x99deb5.remove());
    let var24 = Zotero.AI4Paper._shortCuts_items;
    for (let var25 of var24) {
      window.document.querySelectorAll("#AI4Paper-" + var25 + '-keyset').forEach(_0x539523 => _0x539523.remove());
    }
  },
  'registerShortcuts_Translation': function () {
    let var26 = "AI4Paper-Translation-keyset";
    window.document.querySelectorAll('#' + var26).forEach(_0x4d9f4b => _0x4d9f4b.remove());
    let var27 = [],
      var28,
      var29 = Zotero.AI4Paper.translationServiceList()["火山🆓"]?.['method']?.["transbyShortCuts"];
    if (Zotero.isMac) {
      if (Zotero.Prefs.get("ai4paper.translatemacshortcutsstyles") === '单键') {
        if (Zotero.Prefs.get("ai4paper.translatesmacshortcuts") != '无') {
          let _0x1e1ff2 = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get("ai4paper.translatesmacshortcuts")]?.["method"]?.["transbyShortCuts"] || var29;
          var28 = {
            'id': "mac_key_S_" + _0x1e1ff2,
            'key': String('S'),
            'modifiers': null,
            'func': _0x1e1ff2,
            'type': "translate"
          };
          var27.push(var28);
        }
        if (Zotero.Prefs.get("ai4paper.translatedmacshortcuts") != '无') {
          let _0x38b572 = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get("ai4paper.translatedmacshortcuts")]?.["method"]?.['transbyShortCuts'] || var29;
          var28 = {
            'id': 'mac_key_D_' + _0x38b572,
            'key': String('D'),
            'modifiers': null,
            'func': _0x38b572,
            'type': 'translate'
          };
          var27.push(var28);
        }
      }
      var28 = {
        'id': "mac_key_F_Pronunciation",
        'key': String('F'),
        'modifiers': null,
        'func': "pronunciation",
        'type': "translate"
      };
      var27.push(var28);
    } else {
      if (Zotero.isWin || Zotero.isLinux) {
        if (Zotero.Prefs.get("ai4paper.translatewinshortcutsstyles") === '单键') {
          if (Zotero.Prefs.get("ai4paper.translateswinshortcuts") != '无') {
            let var32 = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get('ai4paper.translateswinshortcuts')]?.["method"]?.["transbyShortCuts"] || var29;
            var28 = {
              'id': "win_key_S_" + var32,
              'key': String('S'),
              'modifiers': null,
              'func': var32,
              'type': "translate"
            };
            var27.push(var28);
          }
          if (Zotero.Prefs.get("ai4paper.translatedwinshortcuts") != '无') {
            let var33 = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get("ai4paper.translatedwinshortcuts")]?.["method"]?.["transbyShortCuts"] || var29;
            var28 = {
              'id': "win_key_D_" + var33,
              'key': String('D'),
              'modifiers': null,
              'func': var33,
              'type': "translate"
            };
            var27.push(var28);
          }
          var28 = {
            'id': "win_key_F_Pronunciation",
            'key': String('F'),
            'modifiers': null,
            'func': "pronunciation",
            'type': "translate"
          };
          var27.push(var28);
        } else {
          if (Zotero.Prefs.get("ai4paper.translatewinshortcutsstyles") === '双键') {
            if (Zotero.Prefs.get("ai4paper.translatealtdshortcuts") != '无') {
              let _0x571c78 = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get('ai4paper.translatealtdshortcuts')]?.["method"]?.['transbyShortCuts'] || var29;
              var28 = {
                'id': "win_key_Alt_D_" + _0x571c78,
                'key': String('D'),
                'modifiers': "alt",
                'func': _0x571c78,
                'type': "translate"
              };
              var27.push(var28);
            }
            if (Zotero.Prefs.get('ai4paper.translatealtwshortcuts') != '无') {
              let _0x59057b = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get("ai4paper.translatealtwshortcuts")]?.["method"]?.['transbyShortCuts'] || var29;
              var28 = {
                'id': "win_key_Alt_W_" + _0x59057b,
                'key': String('W'),
                'modifiers': "alt",
                'func': _0x59057b,
                'type': "translate"
              };
              var27.push(var28);
            }
            var28 = {
              'id': 'win_key_Alt_C_Pronunciation',
              'key': String('C'),
              'modifiers': "alt",
              'func': "pronunciation",
              'type': "translate"
            };
            var27.push(var28);
          }
        }
      }
    }
    if (var27.length) {
      let _0x2dd900 = window.document.createXULElement('keyset');
      _0x2dd900.setAttribute('id', var26);
      for (let var37 in var27) {
        _0x2dd900.appendChild(Zotero.AI4Paper.createKey(var27[var37]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x2dd900);
    }
  },
  'registerShortcuts_PreviewWin': function () {
    window.document.querySelectorAll('#AI4Paper-PreviewWin-keyset').forEach(_0x4d63c8 => _0x4d63c8.remove());
    let var38 = [],
      var39;
    if (Zotero.Prefs.get("ai4paper.enableWinPreview")) {
      if (Zotero.isWin || Zotero.isLinux) {
        var39 = {
          'id': "key_PreviewWin",
          'key': String('`'),
          'modifiers': null,
          'func': 'previewItemWin',
          'type': "preview"
        };
        var38.push(var39);
      }
    }
    let var40 = window.document.createXULElement("keyset");
    var40.setAttribute('id', "AI4Paper-PreviewWin-keyset");
    for (let var41 in var38) {
      var40.appendChild(Zotero.AI4Paper.createKey(var38[var41]));
    }
    var38.length && window.document.getElementById("mainKeyset").parentNode.appendChild(var40);
  },
  'registerShortcuts_AddAnnotationTag': function () {
    let var42 = "AddAnnotationTag",
      var43 = "AI4Paper-" + var42 + '-keyset';
    window.document.querySelectorAll('#' + var43).forEach(_0x1e5836 => _0x1e5836.remove());
    let var44 = [],
      var45,
      var46,
      var47 = Zotero.Prefs.get('ai4paper.shortcuts' + var42);
    if (!var47) return;
    if (var47 === "⌘ T") {
      if (Zotero.isMac) var46 = {
        'MODIFIERS': "meta",
        'KEY': 'T'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var42, "Control T"), var46 = {
        'MODIFIERS': "control",
        'KEY': 'T'
      });
    } else {
      var46 = Zotero.AI4Paper.handleShortcuts(var47);
      if (!var46) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var42) && (var45 = {
      'id': "shortcuts_" + var42,
      'key': var46.KEY,
      'modifiers': var46.MODIFIERS,
      'func': "addTagForSelectedAnnotationsInit",
      'type': '' + var42
    }, var44.push(var45));
    if (var44.length) {
      let _0x5ae26e = window.document.createXULElement("keyset");
      _0x5ae26e.setAttribute('id', var43);
      for (let var49 in var44) {
        _0x5ae26e.appendChild(Zotero.AI4Paper.createKey(var44[var49]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(_0x5ae26e);
    }
  },
  'registerShortcuts_CopyBlockQuoteLink': function () {
    let var50 = "CopyBlockQuoteLink",
      var51 = 'AI4Paper-' + var50 + "-keyset";
    window.document.querySelectorAll('#' + var51).forEach(_0x1c6599 => _0x1c6599.remove());
    let var52 = [],
      var53,
      var54,
      var55 = Zotero.Prefs.get("ai4paper.shortcuts" + var50);
    if (!var55) return;
    if (var55 === '⌘\x20L') {
      if (Zotero.isMac) var54 = {
        'MODIFIERS': "meta",
        'KEY': 'L'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var50, "Control L"), var54 = {
        'MODIFIERS': "control",
        'KEY': 'L'
      });
    } else {
      var54 = Zotero.AI4Paper.handleShortcuts(var55);
      if (!var54) return;
    }
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + var50)) {
      var53 = {
        'id': "shortcuts_" + var50,
        'key': var54.KEY,
        'modifiers': var54.MODIFIERS,
        'func': 'getBlockQuoteLink_byShortCuts',
        'type': '' + var50
      };
      var52.push(var53);
    }
    if (var52.length) {
      let _0x452e09 = window.document.createXULElement('keyset');
      _0x452e09.setAttribute('id', var51);
      for (let var57 in var52) {
        _0x452e09.appendChild(Zotero.AI4Paper.createKey(var52[var57]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(_0x452e09);
    }
  },
  'registerShortcuts_SetAnnotationHead': function () {
    let var58 = "SetAnnotationHead",
      var59 = 'AI4Paper-' + var58 + "-keyset";
    window.document.querySelectorAll('#' + var59).forEach(_0x4e14c5 => _0x4e14c5.remove());
    let var60 = [],
      var61,
      var62,
      var63 = Zotero.Prefs.get('ai4paper.shortcuts' + var58);
    if (!var63) return;
    if (var63 === "⌘ ⇧ D") {
      if (Zotero.isMac) var62 = {
        'MODIFIERS': 'meta\x20shift',
        'KEY': 'D'
      };else {
        if (Zotero.isWin || Zotero.isLinux) {
          Zotero.Prefs.set("ai4paper.shortcuts" + var58, 'Control\x20Shift\x20D');
          var62 = {
            'MODIFIERS': 'control\x20shift',
            'KEY': 'D'
          };
        }
      }
    } else {
      var62 = Zotero.AI4Paper.handleShortcuts(var63);
      if (!var62) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var58) && (var61 = {
      'id': "shortcuts_" + var58,
      'key': var62.KEY,
      'modifiers': var62.MODIFIERS,
      'func': "setAnnotationHead_byShortCuts",
      'type': '' + var58
    }, var60.push(var61));
    if (var60.length) {
      let _0x2a3629 = window.document.createXULElement("keyset");
      _0x2a3629.setAttribute('id', var59);
      for (let var65 in var60) {
        _0x2a3629.appendChild(Zotero.AI4Paper.createKey(var60[var65]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(_0x2a3629);
    }
  },
  'registerShortcuts_CardNotesSearch': function () {
    let var66 = "CardNotesSearch",
      var67 = "AI4Paper-" + var66 + "-keyset";
    window.document.querySelectorAll('#' + var67).forEach(_0x1a150a => _0x1a150a.remove());
    let var68 = [],
      var69,
      var70,
      var71 = Zotero.Prefs.get("ai4paper.shortcuts" + var66);
    if (!var71) return;
    if (var71 === "⇧ F") {
      if (Zotero.isMac) {
        var70 = {
          'MODIFIERS': 'shift',
          'KEY': 'F'
        };
      } else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var66, "Shift F"), var70 = {
        'MODIFIERS': "shift",
        'KEY': 'F'
      });
    } else {
      var70 = Zotero.AI4Paper.handleShortcuts(var71);
      if (!var70) return;
    }
    Zotero.Prefs.get('ai4paper.enableShortcuts' + var66) && (var69 = {
      'id': "shortcuts_" + var66,
      'key': var70.KEY,
      'modifiers': var70.MODIFIERS,
      'func': "searchCardNotes_byShortCuts",
      'type': '' + var66
    }, var68.push(var69));
    if (var68.length) {
      let var72 = window.document.createXULElement('keyset');
      var72.setAttribute('id', var67);
      for (let var73 in var68) {
        var72.appendChild(Zotero.AI4Paper.createKey(var68[var73]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var72);
    }
  },
  'registerShortcuts_AddRelatedRefs': function () {
    let var74 = "AddRelatedRefs",
      var75 = "AI4Paper-" + var74 + "-keyset";
    window.document.querySelectorAll('#' + var75).forEach(_0x5579b2 => _0x5579b2.remove());
    let var76 = [],
      var77,
      var78,
      var79 = Zotero.Prefs.get('ai4paper.shortcuts' + var74);
    if (!var79) return;
    if (var79 === "⌘ R") {
      if (Zotero.isMac) var78 = {
        'MODIFIERS': "meta",
        'KEY': 'R'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var74, "Control R"), var78 = {
        'MODIFIERS': "control",
        'KEY': 'R'
      });
    } else {
      var78 = Zotero.AI4Paper.handleShortcuts(var79);
      if (!var78) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var74) && (var77 = {
      'id': "shortcuts_" + var74,
      'key': var78.KEY,
      'modifiers': var78.MODIFIERS,
      'func': "addRelatedRefs_Zotero",
      'type': '' + var74
    }, var76.push(var77));
    if (var76.length) {
      let var80 = window.document.createXULElement('keyset');
      var80.setAttribute('id', var75);
      for (let var81 in var76) {
        var80.appendChild(Zotero.AI4Paper.createKey(var76[var81]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var80);
    }
  },
  'registerShortcuts_ZoteroAdvancedSearch': function () {
    let var82 = "ZoteroAdvancedSearch",
      var83 = "AI4Paper-" + var82 + "-keyset";
    window.document.querySelectorAll('#' + var83).forEach(_0x412597 => _0x412597.remove());
    let var84 = [],
      var85,
      var86,
      var87 = Zotero.Prefs.get("ai4paper.shortcuts" + var82);
    if (!var87) return;
    if (var87 === "⌥ F") {
      if (Zotero.isMac) var86 = {
        'MODIFIERS': 'alt',
        'KEY': 'F'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var82, "Alt F"), var86 = {
        'MODIFIERS': "alt",
        'KEY': 'F'
      });
    } else {
      var86 = Zotero.AI4Paper.handleShortcuts(var87);
      if (!var86) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var82) && (var85 = {
      'id': "shortcuts_" + var82,
      'key': var86.KEY,
      'modifiers': var86.MODIFIERS,
      'func': "openAdvancedSearchWindow",
      'type': '' + var82
    }, var84.push(var85));
    if (var84.length) {
      let _0x18f622 = window.document.createXULElement("keyset");
      _0x18f622.setAttribute('id', var83);
      for (let var89 in var84) {
        _0x18f622.appendChild(Zotero.AI4Paper.createKey(var84[var89]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x18f622);
    }
  },
  'registerShortcuts_CopyAnnotationLink': function () {
    let var90 = "CopyAnnotationLink",
      var91 = "AI4Paper-" + var90 + '-keyset';
    window.document.querySelectorAll('#' + var91).forEach(_0x492f2d => _0x492f2d.remove());
    let var92 = [],
      var93,
      var94,
      var95 = Zotero.Prefs.get("ai4paper.shortcuts" + var90);
    if (!var95) return;
    var94 = Zotero.AI4Paper.handleShortcuts(var95);
    if (!var94) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var90) && (var93 = {
      'id': "shortcuts_" + var90,
      'key': var94.KEY,
      'modifiers': var94.MODIFIERS,
      'func': 'copyAnnotationLink_byShortCuts',
      'type': '' + var90
    }, var92.push(var93));
    if (var92.length) {
      let var96 = window.document.createXULElement("keyset");
      var96.setAttribute('id', var91);
      for (let var97 in var92) {
        var96.appendChild(Zotero.AI4Paper.createKey(var92[var97]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(var96);
    }
  },
  'registerShortcuts_CopyAnnotationLinkOnly': function () {
    let var98 = "CopyAnnotationLinkOnly",
      var99 = "AI4Paper-" + var98 + "-keyset";
    window.document.querySelectorAll('#' + var99).forEach(_0x2de39a => _0x2de39a.remove());
    let var100 = [],
      var101,
      var102,
      var103 = Zotero.Prefs.get('ai4paper.shortcuts' + var98);
    if (!var103) return;
    var102 = Zotero.AI4Paper.handleShortcuts(var103);
    if (!var102) return;
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + var98)) {
      var101 = {
        'id': "shortcuts_" + var98,
        'key': var102.KEY,
        'modifiers': var102.MODIFIERS,
        'func': "copyAnnotationLinkOnly_byShortCuts",
        'type': '' + var98
      };
      var100.push(var101);
    }
    if (var100.length) {
      let var104 = window.document.createXULElement("keyset");
      var104.setAttribute('id', var99);
      for (let var105 in var100) {
        var104.appendChild(Zotero.AI4Paper.createKey(var100[var105]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(var104);
    }
  },
  'registerShortcuts_CopyAnnotationLinkMD': function () {
    let var106 = 'CopyAnnotationLinkMD',
      var107 = 'AI4Paper-' + var106 + "-keyset";
    window.document.querySelectorAll('#' + var107).forEach(_0x356139 => _0x356139.remove());
    let var108 = [],
      var109,
      var110,
      var111 = Zotero.Prefs.get("ai4paper.shortcuts" + var106);
    if (!var111) return;
    var110 = Zotero.AI4Paper.handleShortcuts(var111);
    if (!var110) return;
    Zotero.Prefs.get('ai4paper.enableShortcuts' + var106) && (var109 = {
      'id': "shortcuts_" + var106,
      'key': var110.KEY,
      'modifiers': var110.MODIFIERS,
      'func': "copyAnnotationLinkMD_byShortCuts",
      'type': '' + var106
    }, var108.push(var109));
    if (var108.length) {
      let var112 = window.document.createXULElement('keyset');
      var112.setAttribute('id', var107);
      for (let var113 in var108) {
        var112.appendChild(Zotero.AI4Paper.createKey(var108[var113]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(var112);
    }
  },
  'registerShortcuts_CopyAnnotationText': function () {
    let var114 = "CopyAnnotationText",
      var115 = "AI4Paper-" + var114 + "-keyset";
    window.document.querySelectorAll('#' + var115).forEach(_0x830369 => _0x830369.remove());
    let var116 = [],
      var117,
      var118,
      var119 = Zotero.Prefs.get("ai4paper.shortcuts" + var114);
    if (!var119) return;
    var118 = Zotero.AI4Paper.handleShortcuts(var119);
    if (!var118) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var114) && (var117 = {
      'id': "shortcuts_" + var114,
      'key': var118.KEY,
      'modifiers': var118.MODIFIERS,
      'func': "copyAnnotationText_byShortCuts",
      'type': '' + var114
    }, var116.push(var117));
    if (var116.length) {
      let var120 = window.document.createXULElement('keyset');
      var120.setAttribute('id', var115);
      for (let var121 in var116) {
        var120.appendChild(Zotero.AI4Paper.createKey(var116[var121]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var120);
    }
  },
  'registerShortcuts_CollapseLeftSidePane': function () {
    let var122 = 'CollapseLeftSidePane',
      var123 = "AI4Paper-" + var122 + "-keyset";
    window.document.querySelectorAll('#' + var123).forEach(_0x2a045e => _0x2a045e.remove());
    let var124 = [],
      var125,
      var126,
      var127 = Zotero.Prefs.get("ai4paper.shortcuts" + var122);
    if (!var127) return;
    var126 = Zotero.AI4Paper.handleShortcuts(var127);
    if (!var126) return;
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + var122)) {
      var125 = {
        'id': 'shortcuts_' + var122,
        'key': var126.KEY,
        'modifiers': var126.MODIFIERS,
        'func': "collapseLeftSidePane",
        'type': '' + var122
      };
      var124.push(var125);
    }
    if (var124.length) {
      let var128 = window.document.createXULElement("keyset");
      var128.setAttribute('id', var123);
      for (let var129 in var124) {
        var128.appendChild(Zotero.AI4Paper.createKey(var124[var129]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var128);
    }
  },
  'registerShortcuts_CollapseRightSidePane': function () {
    let var130 = "CollapseRightSidePane",
      var131 = "AI4Paper-" + var130 + '-keyset';
    window.document.querySelectorAll('#' + var131).forEach(_0x22074e => _0x22074e.remove());
    let var132 = [],
      var133,
      var134,
      var135 = Zotero.Prefs.get('ai4paper.shortcuts' + var130);
    if (!var135) return;
    var134 = Zotero.AI4Paper.handleShortcuts(var135);
    if (!var134) return;
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + var130)) {
      var133 = {
        'id': 'shortcuts_' + var130,
        'key': var134.KEY,
        'modifiers': var134.MODIFIERS,
        'func': "collapseRightSidePane",
        'type': '' + var130
      };
      var132.push(var133);
    }
    if (var132.length) {
      let var136 = window.document.createXULElement("keyset");
      var136.setAttribute('id', var131);
      for (let var137 in var132) {
        var136.appendChild(Zotero.AI4Paper.createKey(var132[var137]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var136);
    }
  },
  'registerShortcuts_CopyPDF': function () {
    let var138 = "CopyPDF",
      var139 = "AI4Paper-" + var138 + "-keyset";
    window.document.querySelectorAll('#' + var139).forEach(_0x49794a => _0x49794a.remove());
    let var140 = [],
      var141,
      var142,
      var143 = Zotero.Prefs.get("ai4paper.shortcuts" + var138);
    if (!var143) return;
    var142 = Zotero.AI4Paper.handleShortcuts(var143);
    if (!var142) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var138) && (var141 = {
      'id': "shortcuts_" + var138,
      'key': var142.KEY,
      'modifiers': var142.MODIFIERS,
      'func': "copyPDF",
      'type': '' + var138
    }, var140.push(var141));
    if (var140.length) {
      let var144 = window.document.createXULElement("keyset");
      var144.setAttribute('id', var139);
      for (let var145 in var140) {
        var144.appendChild(Zotero.AI4Paper.createKey(var140[var145]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(var144);
    }
  },
  'registerShortcuts_OpenWith': function () {
    let var146 = "OpenWith",
      var147 = 'AI4Paper-' + var146 + '-keyset';
    window.document.querySelectorAll('#' + var147).forEach(_0x1d8ddc => _0x1d8ddc.remove());
    let var148 = [],
      var149,
      var150,
      var151 = Zotero.Prefs.get("ai4paper.shortcuts" + var146);
    if (!var151) return;
    var150 = Zotero.AI4Paper.handleShortcuts(var151);
    if (!var150) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var146) && (var149 = {
      'id': "shortcuts_" + var146,
      'key': var150.KEY,
      'modifiers': var150.MODIFIERS,
      'func': "openwith",
      'type': '' + var146
    }, var148.push(var149));
    if (var148.length) {
      let _0x2a447c = window.document.createXULElement("keyset");
      _0x2a447c.setAttribute('id', var147);
      for (let var153 in var148) {
        _0x2a447c.appendChild(Zotero.AI4Paper.createKey(var148[var153]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x2a447c);
    }
  },
  'registerShortcuts_CopyPDFAttachmentsLink': function () {
    let var154 = "CopyPDFAttachmentsLink",
      var155 = 'AI4Paper-' + var154 + '-keyset';
    window.document.querySelectorAll('#' + var155).forEach(_0x11a1b0 => _0x11a1b0.remove());
    let var156 = [],
      var157,
      var158,
      var159 = Zotero.Prefs.get("ai4paper.shortcuts" + var154);
    if (!var159) return;
    var158 = Zotero.AI4Paper.handleShortcuts(var159);
    if (!var158) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var154) && (var157 = {
      'id': "shortcuts_" + var154,
      'key': var158.KEY,
      'modifiers': var158.MODIFIERS,
      'func': 'copyPDFAttachmentsLink',
      'type': '' + var154
    }, var156.push(var157));
    if (var156.length) {
      let _0x185681 = window.document.createXULElement("keyset");
      _0x185681.setAttribute('id', var155);
      for (let var161 in var156) {
        _0x185681.appendChild(Zotero.AI4Paper.createKey(var156[var161]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x185681);
    }
  },
  'registerShortcuts_ChatwithNewbing': function () {
    let var162 = 'ChatwithNewbing',
      var163 = 'AI4Paper-' + var162 + "-keyset";
    window.document.querySelectorAll('#' + var163).forEach(_0x3be562 => _0x3be562.remove());
    let var164 = [],
      var165,
      var166,
      var167 = Zotero.Prefs.get('ai4paper.shortcuts' + var162);
    if (!var167) return;
    var166 = Zotero.AI4Paper.handleShortcuts(var167);
    if (!var166) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var162) && (var165 = {
      'id': "shortcuts_" + var162,
      'key': var166.KEY,
      'modifiers': var166.MODIFIERS,
      'func': "chatWithNewBing",
      'type': '' + var162
    }, var164.push(var165));
    if (var164.length) {
      let _0x4fbe12 = window.document.createXULElement("keyset");
      _0x4fbe12.setAttribute('id', var163);
      for (let var169 in var164) {
        _0x4fbe12.appendChild(Zotero.AI4Paper.createKey(var164[var169]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x4fbe12);
    }
  },
  'registerShortcuts_ImmersiveTranslate': function () {
    let var170 = "ImmersiveTranslate",
      var171 = "AI4Paper-" + var170 + "-keyset";
    window.document.querySelectorAll('#' + var171).forEach(_0x5a4a20 => _0x5a4a20.remove());
    let var172 = [],
      var173,
      var174,
      var175 = Zotero.Prefs.get("ai4paper.shortcuts" + var170);
    if (!var175) return;
    if (var175 === "⌘ I") {
      if (Zotero.isMac) var174 = {
        'MODIFIERS': 'meta',
        'KEY': 'I'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var170, "Control I"), var174 = {
        'MODIFIERS': 'control',
        'KEY': 'I'
      });
    } else {
      var174 = Zotero.AI4Paper.handleShortcuts(var175);
      if (!var174) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var170) && (var173 = {
      'id': "shortcuts_" + var170,
      'key': var174.KEY,
      'modifiers': var174.MODIFIERS,
      'func': "openImmersiveTranslate",
      'type': '' + var170
    }, var172.push(var173));
    if (var172.length) {
      let var176 = window.document.createXULElement("keyset");
      var176.setAttribute('id', var171);
      for (let var177 in var172) {
        var176.appendChild(Zotero.AI4Paper.createKey(var172[var177]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(var176);
    }
  },
  'registerShortcuts_UniversalImmersiveTranslate': function () {
    let var178 = "UniversalImmersiveTranslate",
      var179 = "AI4Paper-" + var178 + "-keyset";
    window.document.querySelectorAll('#' + var179).forEach(_0x49aea8 => _0x49aea8.remove());
    let var180 = [],
      var181,
      var182,
      var183 = Zotero.Prefs.get("ai4paper.shortcuts" + var178);
    if (!var183) return;
    if (var183 === "⌘ ⌥ I") {
      if (Zotero.isMac) var182 = {
        'MODIFIERS': 'meta\x20alt',
        'KEY': 'I'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var178, "Control Alt I"), var182 = {
        'MODIFIERS': 'control\x20alt',
        'KEY': 'I'
      });
    } else {
      var182 = Zotero.AI4Paper.handleShortcuts(var183);
      if (!var182) return;
    }
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + var178)) {
      var181 = {
        'id': 'shortcuts_' + var178,
        'key': var182.KEY,
        'modifiers': var182.MODIFIERS,
        'func': "openUniversalImmersiveTranslate",
        'type': '' + var178
      };
      var180.push(var181);
    }
    if (var180.length) {
      let _0x16db9 = window.document.createXULElement("keyset");
      _0x16db9.setAttribute('id', var179);
      for (let var185 in var180) {
        _0x16db9.appendChild(Zotero.AI4Paper.createKey(var180[var185]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x16db9);
    }
  },
  'registerShortcuts_FilesHistory': function () {
    let var186 = 'FilesHistory',
      var187 = "AI4Paper-" + var186 + "-keyset";
    window.document.querySelectorAll('#' + var187).forEach(_0x57593d => _0x57593d.remove());
    let var188 = [],
      var189,
      var190,
      var191 = Zotero.Prefs.get("ai4paper.shortcuts" + var186);
    if (!var191) return;
    var190 = Zotero.AI4Paper.handleShortcuts(var191);
    if (!var190) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var186) && (var189 = {
      'id': "shortcuts_" + var186,
      'key': var190.KEY,
      'modifiers': var190.MODIFIERS,
      'func': "openDialog_filesHistory",
      'type': '' + var186
    }, var188.push(var189));
    if (var188.length) {
      let var192 = window.document.createXULElement("keyset");
      var192.setAttribute('id', var187);
      for (let var193 in var188) {
        var192.appendChild(Zotero.AI4Paper.createKey(var188[var193]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var192);
    }
  },
  'registerShortcuts_WorkSpace': function () {
    let var194 = "WorkSpace",
      var195 = "AI4Paper-" + var194 + "-keyset";
    window.document.querySelectorAll('#' + var195).forEach(_0x5d4261 => _0x5d4261.remove());
    let var196 = [],
      var197,
      var198,
      var199 = Zotero.Prefs.get("ai4paper.shortcuts" + var194);
    if (!var199) return;
    var198 = Zotero.AI4Paper.handleShortcuts(var199);
    if (!var198) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var194) && (var197 = {
      'id': "shortcuts_" + var194,
      'key': var198.KEY,
      'modifiers': var198.MODIFIERS,
      'func': "openWorkSpaceWindow",
      'type': '' + var194
    }, var196.push(var197));
    if (var196.length) {
      let var200 = window.document.createXULElement("keyset");
      var200.setAttribute('id', var195);
      for (let var201 in var196) {
        var200.appendChild(Zotero.AI4Paper.createKey(var196[var201]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var200);
    }
  },
  'registerShortcuts_AttachNewFile': function () {
    let var202 = "AttachNewFile",
      var203 = "AI4Paper-" + var202 + "-keyset";
    window.document.querySelectorAll('#' + var203).forEach(_0x27eff6 => _0x27eff6.remove());
    let var204 = [],
      var205,
      var206,
      var207 = Zotero.Prefs.get("ai4paper.shortcuts" + var202);
    if (!var207) return;
    var206 = Zotero.AI4Paper.handleShortcuts(var207);
    if (!var206) return;
    Zotero.Prefs.get('ai4paper.enableShortcuts' + var202) && (var205 = {
      'id': "shortcuts_" + var202,
      'key': var206.KEY,
      'modifiers': var206.MODIFIERS,
      'func': "attachNewFile",
      'type': '' + var202
    }, var204.push(var205));
    if (var204.length) {
      let _0x1c2465 = window.document.createXULElement("keyset");
      _0x1c2465.setAttribute('id', var203);
      for (let var209 in var204) {
        _0x1c2465.appendChild(Zotero.AI4Paper.createKey(var204[var209]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x1c2465);
    }
  },
  'registerShortcuts_RenameAttachments': function () {
    let var210 = "RenameAttachments",
      var211 = 'AI4Paper-' + var210 + "-keyset";
    window.document.querySelectorAll('#' + var211).forEach(_0x125d65 => _0x125d65.remove());
    let var212 = [],
      var213,
      var214,
      var215 = Zotero.Prefs.get("ai4paper.shortcuts" + var210);
    if (!var215) return;
    var214 = Zotero.AI4Paper.handleShortcuts(var215);
    if (!var214) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var210) && (var213 = {
      'id': 'shortcuts_' + var210,
      'key': var214.KEY,
      'modifiers': var214.MODIFIERS,
      'func': 'renameAttachments',
      'type': '' + var210
    }, var212.push(var213));
    if (var212.length) {
      let _0x500833 = window.document.createXULElement("keyset");
      _0x500833.setAttribute('id', var211);
      for (let var217 in var212) {
        _0x500833.appendChild(Zotero.AI4Paper.createKey(var212[var217]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x500833);
    }
  },
  'registerShortcuts_Archive': function () {
    let var218 = 'Archive',
      var219 = "AI4Paper-" + var218 + '-keyset';
    window.document.querySelectorAll('#' + var219).forEach(_0x46a9da => _0x46a9da.remove());
    let var220 = [],
      var221,
      var222,
      var223 = Zotero.Prefs.get('ai4paper.shortcuts' + var218);
    if (!var223) return;
    var222 = Zotero.AI4Paper.handleShortcuts(var223);
    if (!var222) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var218) && (var221 = {
      'id': "shortcuts_" + var218,
      'key': var222.KEY,
      'modifiers': var222.MODIFIERS,
      'func': 'archiveSelectedItems',
      'type': '' + var218
    }, var220.push(var221));
    if (var220.length) {
      let _0xa557e = window.document.createXULElement("keyset");
      _0xa557e.setAttribute('id', var219);
      for (let var225 in var220) {
        _0xa557e.appendChild(Zotero.AI4Paper.createKey(var220[var225]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0xa557e);
    }
  },
  'registerShortcuts_SplitHorizontally': function () {
    let var226 = "SplitHorizontally",
      var227 = "AI4Paper-" + var226 + "-keyset";
    window.document.querySelectorAll('#' + var227).forEach(_0x2118bf => _0x2118bf.remove());
    let var228 = [],
      var229,
      var230,
      var231 = Zotero.Prefs.get("ai4paper.shortcuts" + var226);
    if (!var231) return;
    var230 = Zotero.AI4Paper.handleShortcuts(var231);
    if (!var230) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var226) && (var229 = {
      'id': "shortcuts_" + var226,
      'key': var230.KEY,
      'modifiers': var230.MODIFIERS,
      'func': "splitHorizontally_byShortCuts",
      'type': '' + var226
    }, var228.push(var229));
    if (var228.length) {
      let _0x4b37af = window.document.createXULElement("keyset");
      _0x4b37af.setAttribute('id', var227);
      for (let var233 in var228) {
        _0x4b37af.appendChild(Zotero.AI4Paper.createKey(var228[var233]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x4b37af);
    }
  },
  'registerShortcuts_SplitVertically': function () {
    let var234 = "SplitVertically",
      var235 = 'AI4Paper-' + var234 + "-keyset";
    window.document.querySelectorAll('#' + var235).forEach(_0x1366d4 => _0x1366d4.remove());
    let var236 = [],
      var237,
      var238,
      var239 = Zotero.Prefs.get("ai4paper.shortcuts" + var234);
    if (!var239) return;
    var238 = Zotero.AI4Paper.handleShortcuts(var239);
    if (!var238) return;
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + var234)) {
      var237 = {
        'id': "shortcuts_" + var234,
        'key': var238.KEY,
        'modifiers': var238.MODIFIERS,
        'func': "splitVertically_byShortCuts",
        'type': '' + var234
      };
      var236.push(var237);
    }
    if (var236.length) {
      let var240 = window.document.createXULElement("keyset");
      var240.setAttribute('id', var235);
      for (let var241 in var236) {
        var240.appendChild(Zotero.AI4Paper.createKey(var236[var241]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var240);
    }
  },
  'registerShortcuts_OddSpreads': function () {
    let var242 = 'OddSpreads',
      var243 = "AI4Paper-" + var242 + "-keyset";
    window.document.querySelectorAll('#' + var243).forEach(_0x2abffb => _0x2abffb.remove());
    let var244 = [],
      var245,
      var246,
      var247 = Zotero.Prefs.get("ai4paper.shortcuts" + var242);
    if (!var247) return;
    var246 = Zotero.AI4Paper.handleShortcuts(var247);
    if (!var246) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var242) && (var245 = {
      'id': "shortcuts_" + var242,
      'key': var246.KEY,
      'modifiers': var246.MODIFIERS,
      'func': "oddSpreads_byShortCuts",
      'type': '' + var242
    }, var244.push(var245));
    if (var244.length) {
      let _0x3ebfb7 = window.document.createXULElement("keyset");
      _0x3ebfb7.setAttribute('id', var243);
      for (let var249 in var244) {
        _0x3ebfb7.appendChild(Zotero.AI4Paper.createKey(var244[var249]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(_0x3ebfb7);
    }
  },
  'registerShortcuts_StarOne': function () {
    let var250 = "StarOne",
      var251 = "AI4Paper-" + var250 + '-keyset';
    window.document.querySelectorAll('#' + var251).forEach(_0x3d4ee0 => _0x3d4ee0.remove());
    let var252 = [],
      var253,
      var254,
      var255 = Zotero.Prefs.get("ai4paper.shortcuts" + var250);
    if (!var255) return;
    if (var255 === "⌥ 1") {
      if (Zotero.isMac) var254 = {
        'MODIFIERS': "alt",
        'KEY': '1'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var250, "Control Alt 1"), var254 = {
        'MODIFIERS': "control alt",
        'KEY': '1'
      });
    } else {
      var254 = Zotero.AI4Paper.handleShortcuts(var255);
      if (!var254) return;
    }
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + var250)) {
      var253 = {
        'id': "shortcuts_" + var250,
        'key': var254.KEY,
        'modifiers': var254.MODIFIERS,
        'func': 'starSelectedItems',
        'type': '' + var250
      };
      var252.push(var253);
    }
    if (var252.length) {
      let var256 = window.document.createXULElement('keyset');
      var256.setAttribute('id', var251);
      for (let var257 in var252) {
        var256.appendChild(Zotero.AI4Paper.createKey(var252[var257]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var256);
    }
  },
  'registerShortcuts_StarTwo': function () {
    let var258 = "StarTwo",
      var259 = 'AI4Paper-' + var258 + "-keyset";
    window.document.querySelectorAll('#' + var259).forEach(_0x1968c9 => _0x1968c9.remove());
    let var260 = [],
      var261,
      var262,
      var263 = Zotero.Prefs.get("ai4paper.shortcuts" + var258);
    if (!var263) return;
    if (var263 === "⌥ 2") {
      if (Zotero.isMac) var262 = {
        'MODIFIERS': "alt",
        'KEY': '2'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set('ai4paper.shortcuts' + var258, "Control Alt 2"), var262 = {
        'MODIFIERS': "control alt",
        'KEY': '2'
      });
    } else {
      var262 = Zotero.AI4Paper.handleShortcuts(var263);
      if (!var262) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var258) && (var261 = {
      'id': "shortcuts_" + var258,
      'key': var262.KEY,
      'modifiers': var262.MODIFIERS,
      'func': "starSelectedItems",
      'type': '' + var258
    }, var260.push(var261));
    if (var260.length) {
      let _0x55512a = window.document.createXULElement("keyset");
      _0x55512a.setAttribute('id', var259);
      for (let var265 in var260) {
        _0x55512a.appendChild(Zotero.AI4Paper.createKey(var260[var265]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(_0x55512a);
    }
  },
  'registerShortcuts_StarThree': function () {
    let var266 = "StarThree",
      var267 = 'AI4Paper-' + var266 + "-keyset";
    window.document.querySelectorAll('#' + var267).forEach(_0x5540d9 => _0x5540d9.remove());
    let var268 = [],
      var269,
      var270,
      var271 = Zotero.Prefs.get("ai4paper.shortcuts" + var266);
    if (!var271) return;
    if (var271 === '⌥\x203') {
      if (Zotero.isMac) var270 = {
        'MODIFIERS': 'alt',
        'KEY': '3'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set('ai4paper.shortcuts' + var266, 'Control\x20Alt\x203'), var270 = {
        'MODIFIERS': "control alt",
        'KEY': '3'
      });
    } else {
      var270 = Zotero.AI4Paper.handleShortcuts(var271);
      if (!var270) return;
    }
    Zotero.Prefs.get('ai4paper.enableShortcuts' + var266) && (var269 = {
      'id': "shortcuts_" + var266,
      'key': var270.KEY,
      'modifiers': var270.MODIFIERS,
      'func': "starSelectedItems",
      'type': '' + var266
    }, var268.push(var269));
    if (var268.length) {
      let var272 = window.document.createXULElement("keyset");
      var272.setAttribute('id', var267);
      for (let var273 in var268) {
        var272.appendChild(Zotero.AI4Paper.createKey(var268[var273]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var272);
    }
  },
  'registerShortcuts_StarFour': function () {
    let var274 = "StarFour",
      var275 = 'AI4Paper-' + var274 + "-keyset";
    window.document.querySelectorAll('#' + var275).forEach(_0x52fc69 => _0x52fc69.remove());
    let var276 = [],
      var277,
      var278,
      var279 = Zotero.Prefs.get("ai4paper.shortcuts" + var274);
    if (!var279) return;
    if (var279 === "⌥ 4") {
      if (Zotero.isMac) var278 = {
        'MODIFIERS': "alt",
        'KEY': '4'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var274, 'Control\x20Alt\x204'), var278 = {
        'MODIFIERS': "control alt",
        'KEY': '4'
      });
    } else {
      var278 = Zotero.AI4Paper.handleShortcuts(var279);
      if (!var278) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var274) && (var277 = {
      'id': "shortcuts_" + var274,
      'key': var278.KEY,
      'modifiers': var278.MODIFIERS,
      'func': 'starSelectedItems',
      'type': '' + var274
    }, var276.push(var277));
    if (var276.length) {
      let var280 = window.document.createXULElement("keyset");
      var280.setAttribute('id', var275);
      for (let var281 in var276) {
        var280.appendChild(Zotero.AI4Paper.createKey(var276[var281]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var280);
    }
  },
  'registerShortcuts_StarFive': function () {
    let var282 = "StarFive",
      var283 = "AI4Paper-" + var282 + '-keyset';
    window.document.querySelectorAll('#' + var283).forEach(_0x5c51af => _0x5c51af.remove());
    let var284 = [],
      var285,
      var286,
      var287 = Zotero.Prefs.get('ai4paper.shortcuts' + var282);
    if (!var287) return;
    if (var287 === "⌥ 5") {
      if (Zotero.isMac) var286 = {
        'MODIFIERS': "alt",
        'KEY': '5'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var282, "Control Alt 5"), var286 = {
        'MODIFIERS': 'control\x20alt',
        'KEY': '5'
      });
    } else {
      var286 = Zotero.AI4Paper.handleShortcuts(var287);
      if (!var286) return;
    }
    Zotero.Prefs.get('ai4paper.enableShortcuts' + var282) && (var285 = {
      'id': 'shortcuts_' + var282,
      'key': var286.KEY,
      'modifiers': var286.MODIFIERS,
      'func': "starSelectedItems",
      'type': '' + var282
    }, var284.push(var285));
    if (var284.length) {
      let var288 = window.document.createXULElement("keyset");
      var288.setAttribute('id', var283);
      for (let var289 in var284) {
        var288.appendChild(Zotero.AI4Paper.createKey(var284[var289]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var288);
    }
  },
  'registerShortcuts_StarClear': function () {
    let var290 = 'StarClear',
      var291 = 'AI4Paper-' + var290 + '-keyset';
    window.document.querySelectorAll('#' + var291).forEach(_0x393089 => _0x393089.remove());
    let var292 = [],
      var293,
      var294,
      var295 = Zotero.Prefs.get('ai4paper.shortcuts' + var290);
    if (!var295) return;
    if (var295 === "⌥ 0") {
      if (Zotero.isMac) var294 = {
        'MODIFIERS': 'alt',
        'KEY': '0'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var290, "Control Alt 0"), var294 = {
        'MODIFIERS': "control alt",
        'KEY': '0'
      });
    } else {
      var294 = Zotero.AI4Paper.handleShortcuts(var295);
      if (!var294) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var290) && (var293 = {
      'id': "shortcuts_" + var290,
      'key': var294.KEY,
      'modifiers': var294.MODIFIERS,
      'func': 'starSelectedItems',
      'type': '' + var290
    }, var292.push(var293));
    if (var292.length) {
      let _0x2ac26a = window.document.createXULElement("keyset");
      _0x2ac26a.setAttribute('id', var291);
      for (let var297 in var292) {
        _0x2ac26a.appendChild(Zotero.AI4Paper.createKey(var292[var297]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x2ac26a);
    }
  },
  'registerShortcuts_PaperAI': function () {
    let var298 = "PaperAI",
      var299 = "AI4Paper-" + var298 + "-keyset";
    window.document.querySelectorAll('#' + var299).forEach(_0x1cd402 => _0x1cd402.remove());
    let var300 = [],
      var301,
      var302,
      var303 = Zotero.Prefs.get('ai4paper.shortcuts' + var298);
    if (!var303) return;
    var302 = Zotero.AI4Paper.handleShortcuts(var303);
    if (!var302) return;
    Zotero.Prefs.get('ai4paper.enableShortcuts' + var298) && (var301 = {
      'id': "shortcuts_" + var298,
      'key': var302.KEY,
      'modifiers': var302.MODIFIERS,
      'func': "paperAI",
      'type': '' + var298
    }, var300.push(var301));
    if (var300.length) {
      let var304 = window.document.createXULElement("keyset");
      var304.setAttribute('id', var299);
      for (let var305 in var300) {
        var304.appendChild(Zotero.AI4Paper.createKey(var300[var305]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var304);
    }
  },
  'registerShortcuts_LocateAIReadingNotes': function () {
    let var306 = "LocateAIReadingNotes",
      var307 = "AI4Paper-" + var306 + "-keyset";
    window.document.querySelectorAll('#' + var307).forEach(_0x44301f => _0x44301f.remove());
    let var308 = [],
      var309,
      var310,
      var311 = Zotero.Prefs.get("ai4paper.shortcuts" + var306);
    if (!var311) return;
    var310 = Zotero.AI4Paper.handleShortcuts(var311);
    if (!var310) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var306) && (var309 = {
      'id': "shortcuts_" + var306,
      'key': var310.KEY,
      'modifiers': var310.MODIFIERS,
      'func': "gptReaderSidePane_ChatMode_locateAIReadingNotes",
      'type': '' + var306
    }, var308.push(var309));
    if (var308.length) {
      let var312 = window.document.createXULElement("keyset");
      var312.setAttribute('id', var307);
      for (let var313 in var308) {
        var312.appendChild(Zotero.AI4Paper.createKey(var308[var313]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var312);
    }
  },
  'registerShortcuts_GetFullText': function () {
    let var314 = "GetFullText",
      var315 = "AI4Paper-" + var314 + '-keyset';
    window.document.querySelectorAll('#' + var315).forEach(_0x1c4040 => _0x1c4040.remove());
    let var316 = [],
      var317,
      var318,
      var319 = Zotero.Prefs.get("ai4paper.shortcuts" + var314);
    if (!var319) return;
    var318 = Zotero.AI4Paper.handleShortcuts(var319);
    if (!var318) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var314) && (var317 = {
      'id': 'shortcuts_' + var314,
      'key': var318.KEY,
      'modifiers': var318.MODIFIERS,
      'func': "gptReaderSidePane_getFullText",
      'type': '' + var314
    }, var316.push(var317));
    if (var316.length) {
      let var320 = window.document.createXULElement('keyset');
      var320.setAttribute('id', var315);
      for (let var321 in var316) {
        var320.appendChild(Zotero.AI4Paper.createKey(var316[var321]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var320);
    }
  },
  'registerShortcuts_ChangeGPTChatMode': function () {
    let var322 = 'ChangeGPTChatMode',
      var323 = "AI4Paper-" + var322 + '-keyset';
    window.document.querySelectorAll('#' + var323).forEach(_0x205ea8 => _0x205ea8.remove());
    let var324 = [],
      var325,
      var326,
      var327 = Zotero.Prefs.get("ai4paper.shortcuts" + var322);
    if (!var327) return;
    var326 = Zotero.AI4Paper.handleShortcuts(var327);
    if (!var326) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var322) && (var325 = {
      'id': "shortcuts_" + var322,
      'key': var326.KEY,
      'modifiers': var326.MODIFIERS,
      'func': "gptReaderSidePane_changeChatMode_byShortCuts",
      'type': '' + var322
    }, var324.push(var325));
    if (var324.length) {
      let _0x4c9321 = window.document.createXULElement("keyset");
      _0x4c9321.setAttribute('id', var323);
      for (let var329 in var324) {
        _0x4c9321.appendChild(Zotero.AI4Paper.createKey(var324[var329]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x4c9321);
    }
  },
  'registerShortcuts_TagCardNotes': function () {
    let var330 = "TagCardNotes",
      var331 = "AI4Paper-" + var330 + "-keyset";
    window.document.querySelectorAll('#' + var331).forEach(_0x375f65 => _0x375f65.remove());
    let var332 = [],
      var333,
      var334,
      var335 = Zotero.Prefs.get("ai4paper.shortcuts" + var330);
    if (!var335) return;
    if (var335 === "⌘ N") {
      if (Zotero.isMac) var334 = {
        'MODIFIERS': "meta",
        'KEY': 'N'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + var330, 'Control\x20N'), var334 = {
        'MODIFIERS': "control",
        'KEY': 'N'
      });
    } else {
      var334 = Zotero.AI4Paper.handleShortcuts(var335);
      if (!var334) return;
    }
    Zotero.Prefs.get('ai4paper.enableShortcuts' + var330) && (var333 = {
      'id': "shortcuts_" + var330,
      'key': var334.KEY,
      'modifiers': var334.MODIFIERS,
      'func': 'openDialog_tagsManager',
      'type': '' + var330
    }, var332.push(var333));
    if (var332.length) {
      let _0x536ee1 = window.document.createXULElement("keyset");
      _0x536ee1.setAttribute('id', var331);
      for (let var337 in var332) {
        _0x536ee1.appendChild(Zotero.AI4Paper.createKey(var332[var337]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x536ee1);
    }
  },
  'registerShortcuts_ObsidianNote': function () {
    let var338 = "ObsidianNote",
      var339 = "AI4Paper-" + var338 + "-keyset";
    window.document.querySelectorAll('#' + var339).forEach(_0x2e1d78 => _0x2e1d78.remove());
    let var340 = [],
      var341,
      var342,
      var343 = Zotero.Prefs.get("ai4paper.shortcuts" + var338);
    if (!var343) return;
    if (var343 === '⌘\x20K') {
      if (Zotero.isMac) var342 = {
        'MODIFIERS': 'meta',
        'KEY': 'K'
      };else {
        if (Zotero.isWin || Zotero.isLinux) {
          Zotero.Prefs.set("ai4paper.shortcuts" + var338, 'Control\x20K');
          var342 = {
            'MODIFIERS': 'control',
            'KEY': 'K'
          };
        }
      }
    } else {
      var342 = Zotero.AI4Paper.handleShortcuts(var343);
      if (!var342) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var338) && (var341 = {
      'id': "shortcuts_" + var338,
      'key': var342.KEY,
      'modifiers': var342.MODIFIERS,
      'func': 'obsidianNote',
      'type': '' + var338
    }, var340.push(var341));
    if (var340.length) {
      let _0x185980 = window.document.createXULElement("keyset");
      _0x185980.setAttribute('id', var339);
      for (let var345 in var340) {
        _0x185980.appendChild(Zotero.AI4Paper.createKey(var340[var345]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x185980);
    }
  },
  'registerShortcuts_ObsidianBlock': function () {
    let var346 = 'ObsidianBlock',
      var347 = 'AI4Paper-' + var346 + "-keyset";
    window.document.querySelectorAll('#' + var347).forEach(_0x1bb9b3 => _0x1bb9b3.remove());
    let var348 = [],
      var349,
      var350,
      var351 = Zotero.Prefs.get("ai4paper.shortcuts" + var346);
    if (!var351) return;
    var350 = Zotero.AI4Paper.handleShortcuts(var351);
    if (!var350) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var346) && (var349 = {
      'id': "shortcuts_" + var346,
      'key': var350.KEY,
      'modifiers': var350.MODIFIERS,
      'func': "go2ObsidianBlock_byShortCuts",
      'type': '' + var346
    }, var348.push(var349));
    if (var348.length) {
      let _0x416a46 = window.document.createXULElement("keyset");
      _0x416a46.setAttribute('id', var347);
      for (let var353 in var348) {
        _0x416a46.appendChild(Zotero.AI4Paper.createKey(var348[var353]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x416a46);
    }
  },
  'registerShortcuts_SetCommentTemplate': function () {
    let var354 = "SetCommentTemplate",
      var355 = "AI4Paper-" + var354 + "-keyset";
    window.document.querySelectorAll('#' + var355).forEach(_0x33608f => _0x33608f.remove());
    let var356 = [],
      var357,
      var358,
      var359 = Zotero.Prefs.get("ai4paper.shortcuts" + var354);
    if (!var359) return;
    var358 = Zotero.AI4Paper.handleShortcuts(var359);
    if (!var358) return;
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + var354)) {
      var357 = {
        'id': 'shortcuts_' + var354,
        'key': var358.KEY,
        'modifiers': var358.MODIFIERS,
        'func': "addAnnotationCommentTempate_byShortCuts",
        'type': '' + var354
      };
      var356.push(var357);
    }
    if (var356.length) {
      let var360 = window.document.createXULElement("keyset");
      var360.setAttribute('id', var355);
      for (let var361 in var356) {
        var360.appendChild(Zotero.AI4Paper.createKey(var356[var361]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var360);
    }
  },
  'registerShortcuts_LocateItemInPapersMatrix': function () {
    let var362 = "LocateItemInPapersMatrix",
      var363 = "AI4Paper-" + var362 + '-keyset';
    window.document.querySelectorAll('#' + var363).forEach(_0x4a2bee => _0x4a2bee.remove());
    let var364 = [],
      var365,
      var366,
      var367 = Zotero.Prefs.get("ai4paper.shortcuts" + var362);
    if (!var367) return;
    var366 = Zotero.AI4Paper.handleShortcuts(var367);
    if (!var366) return;
    Zotero.Prefs.get('ai4paper.enableShortcuts' + var362) && (var365 = {
      'id': "shortcuts_" + var362,
      'key': var366.KEY,
      'modifiers': var366.MODIFIERS,
      'func': "locateItemInPapersMatrix",
      'type': '' + var362
    }, var364.push(var365));
    if (var364.length) {
      let _0x47b75f = window.document.createXULElement('keyset');
      _0x47b75f.setAttribute('id', var363);
      for (let var369 in var364) {
        _0x47b75f.appendChild(Zotero.AI4Paper.createKey(var364[var369]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(_0x47b75f);
    }
  },
  'registerShortcuts_SearchCollectionInPapersMatrix': function () {
    let var370 = "SearchCollectionInPapersMatrix",
      var371 = 'AI4Paper-' + var370 + "-keyset";
    window.document.querySelectorAll('#' + var371).forEach(_0x30b620 => _0x30b620.remove());
    let var372 = [],
      var373,
      var374,
      var375 = Zotero.Prefs.get("ai4paper.shortcuts" + var370);
    if (!var375) return;
    var374 = Zotero.AI4Paper.handleShortcuts(var375);
    if (!var374) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + var370) && (var373 = {
      'id': 'shortcuts_' + var370,
      'key': var374.KEY,
      'modifiers': var374.MODIFIERS,
      'func': 'searchCollectionInPapersMatrix',
      'type': '' + var370
    }, var372.push(var373));
    if (var372.length) {
      let var376 = window.document.createXULElement("keyset");
      var376.setAttribute('id', var371);
      for (let var377 in var372) {
        var376.appendChild(Zotero.AI4Paper.createKey(var372[var377]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(var376);
    }
  },
  'handleShortcuts': function (param9) {
    param9 = param9.replace(/⌘/g, "meta").replace(/⌃/g, "control").replace(/⇧/g, "shift").replace(/⌥/g, "alt").replace(/Win/g, 'meta').replace(/Control/g, "control").replace(/Shift/g, "shift").replace(/Alt/g, "alt");
    if (param9.indexOf('\x20') === -0x1) {
      return {
        'MODIFIERS': null,
        'KEY': param9.replace(/␣/g, '\x20').replace(/Space/g, '\x20')
      };
    } else {
      let _0x4115b0 = param9.lastIndexOf('\x20'),
        _0x3dae5b = param9.substring(0x0, _0x4115b0).toLowerCase(),
        _0x893f37 = param9.substring(_0x4115b0 + 0x1).replace(/␣/g, '\x20').replace(/Space/g, '\x20');
      return {
        'MODIFIERS': _0x3dae5b,
        'KEY': _0x893f37
      };
    }
  },
  'createKey': function (param10) {
    let var381 = window.document.createXULElement('key');
    var381.setAttribute('id', 'AI4Paper-key-' + param10.id);
    var381.setAttribute("oncommand", '//');
    var381.addEventListener("command", function () {
      try {
        if (param10.type === "StarOne") Zotero.AI4Paper[param10.func](0x1);else {
          if (param10.type === 'StarTwo') Zotero.AI4Paper[param10.func](0x2);else {
            if (param10.type === 'StarThree') Zotero.AI4Paper[param10.func](0x3);else {
              if (param10.type === 'StarFour') Zotero.AI4Paper[param10.func](0x4);else {
                if (param10.type === 'StarFive') Zotero.AI4Paper[param10.func](0x5);else {
                  if (param10.type === 'StarClear') Zotero.AI4Paper[param10.func](0x0);else {
                    if (param10.type === "ZoteroAdvancedSearch") Zotero.getMainWindow().ZoteroPane_Local.openAdvancedSearchWindow();else param10.type === "GetFullText" ? Zotero.AI4Paper[param10.func](true) : Zotero.AI4Paper[param10.func]();
                  }
                }
              }
            }
          }
        }
      } catch (_0x19f830) {
        Zotero.AI4Paper.showProgressWindow(0xfa0, '❌【快捷键操作】出错啦', '' + _0x19f830, "fail");
      }
    });
    param10.modifiers && var381.setAttribute("modifiers", param10.modifiers);
    if (param10.key) var381.setAttribute('key', param10.key);else {
      if (param10.keycode) var381.setAttribute("keycode", param10.keycode);else {
        var381.setAttribute("key", '');
      }
    }
    return var381;
  },
  'registerShortCuts_Window': function (param11) {
    if (param11 === "add" && !Zotero.AI4Paper._keydownHandler_SidePane) {
      Zotero.AI4Paper._keydownHandler_SidePane = function (param12) {
        let _0x566034 = Zotero.AI4Paper.getCurrentReader();
        if (param12.key === "Alt" && !param12.ctrlKey && !param12.shiftKey && !param12.metaKey && param12.code === "AltLeft" && Zotero.Prefs.get("ai4paper.translationcrossparagraphsShortcutsEnable")) {
          if (Zotero_Tabs._selectedID != "zotero-pane" && _0x566034) {
            if (Zotero.Prefs.get("ai4paper.selectedtexttransenable") && Zotero.AI4Paper.selectedText(_0x566034).trim() && !_0x566034._iframeWindow.document.querySelector('.selection-popup')) {
              param12.preventDefault && param12.preventDefault();
              param12.stopPropagation();
              Zotero.Prefs.set('ai4paper.translationcrossparagraphs', true);
              Zotero.AI4Paper.updateTranslateReaderSidePane();
              let var383 = Zotero_Tabs._selectedID,
                var384 = null;
              window.document.getElementById("ai4paper-translate-readersidepane") && (var384 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow, var384 && (var384.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.boxShadow = "0 0 4px blue"));
            } else {
              if (!Zotero.Prefs.get("ai4paper.selectedtexttransenable") && Zotero.AI4Paper.selectedText(_0x566034).trim() && !_0x566034._iframeWindow.document.querySelector(".selection-popup")) {
                param12.preventDefault && param12.preventDefault();
                param12.stopPropagation();
                Zotero.Prefs.set("ai4paper.translationcrossparagraphs", true);
                Zotero.AI4Paper.updateTranslateReaderSidePane();
                let var385 = Zotero_Tabs._selectedID,
                  var386 = null;
                window.document.getElementById("ai4paper-translate-readersidepane") && (var386 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow, var386 && (var386.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.boxShadow = "0 0 4px blue"));
              }
            }
          }
        }
        param12.key === "Alt" && !param12.ctrlKey && !param12.shiftKey && !param12.metaKey && param12.code === "AltLeft" && Zotero.Prefs.get("ai4paper.gptMergeSelectedTextEnable") && Zotero.AI4Paper.selectedText(_0x566034).trim() && !_0x566034._iframeWindow.document.querySelector(".selection-popup") && Zotero_Tabs._selectedID != "zotero-pane" && (param12.preventDefault && param12.preventDefault(), param12.stopPropagation(), Zotero.Prefs.set("ai4paper.gptMergeSelectedText", true), Zotero.AI4Paper.changeGPTPopupButtonName(false));
        if (param12.key === 'w' && !param12.ctrlKey && !param12.shiftKey && param12.metaKey && Zotero.isMac && Zotero.Prefs.get("ai4paper.enableMacPreview")) {
          Zotero_Tabs._selectedID === 'zotero-pane' && (param12.preventDefault && param12.preventDefault(), param12.stopPropagation(), Zotero.AI4Paper.previewItemMac());
        }
      };
      window.document.addEventListener("keydown", Zotero.AI4Paper._keydownHandler_SidePane);
    } else {
      if (param11 === "remove") {
        window.document.removeEventListener("keydown", Zotero.AI4Paper._keydownHandler_SidePane);
      }
    }
    if (param11 === "add" && !Zotero.AI4Paper._keyupHandler_SidePane) {
      Zotero.AI4Paper._keyupHandler_SidePane = function (param13) {
        if (param13.key === 'Alt' && Zotero.Prefs.get("ai4paper.translationcrossparagraphsShortcutsEnable")) {
          if (Zotero_Tabs._selectedID != "zotero-pane") {
            if (param13.preventDefault) {
              param13.preventDefault();
            }
            param13.stopPropagation();
            Zotero.Prefs.set("ai4paper.translationcrossparagraphs", false);
            Zotero.AI4Paper.updateTranslateReaderSidePane();
            let _0x368d4a = Zotero_Tabs._selectedID,
              _0x5be658 = null;
            if (window.document.getElementById("ai4paper-translate-readersidepane")) {
              _0x5be658 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;
              if (_0x5be658) {
                _0x5be658.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.boxShadow = "0 0 1px rgba(0, 0, 0, 0.5)";
              }
            }
            !Zotero.Prefs.get("ai4paper.selectedtexttransenable") && Zotero.AI4Paper.changeTranslationPopupButtonName(true);
          }
        }
        if (param13.key === 'Alt' && Zotero.Prefs.get('ai4paper.gptMergeSelectedTextEnable')) {
          if (Zotero_Tabs._selectedID != 'zotero-pane') {
            param13.preventDefault && param13.preventDefault();
            param13.stopPropagation();
            Zotero.Prefs.set("ai4paper.gptMergeSelectedText", false);
            Zotero.AI4Paper.changeGPTPopupButtonName(true);
          }
        }
      };
      window.document.addEventListener("keyup", Zotero.AI4Paper._keyupHandler_SidePane);
    } else {
      if (param11 === "remove") {
        window.document.removeEventListener("keyup", Zotero.AI4Paper._keyupHandler_SidePane);
      }
    }
  },
});
