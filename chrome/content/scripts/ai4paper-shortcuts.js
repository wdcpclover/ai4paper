// AI4Paper Shortcuts Module - Keyboard shortcut registration and handling
Object.assign(Zotero.AI4Paper, {
  'registerShortcuts': function () {
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    this.registerShortCuts_Window('add');
    this.registerShortcuts_Translation();
    this.registerShortcuts_PreviewWin();
    let shortcutItems = Zotero.AI4Paper._shortCuts_items;
    for (let item of shortcutItems) {
      Zotero.AI4Paper["registerShortcuts_" + item]();
    }
  },
  'unregisterShortcuts': function () {
    this.registerShortCuts_Window("remove");
    window.document.querySelectorAll("#AI4Paper-Translation-keyset").forEach(el => el.remove());
    window.document.querySelectorAll("#AI4Paper-PreviewWin-keyset").forEach(el => el.remove());
    let shortcutItems = Zotero.AI4Paper._shortCuts_items;
    for (let item of shortcutItems) {
      window.document.querySelectorAll("#AI4Paper-" + item + '-keyset').forEach(el => el.remove());
    }
  },
  'registerShortcuts_Translation': function () {
    let keysetId = "AI4Paper-Translation-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      defaultTransMethod = Zotero.AI4Paper.translationServiceList()["火山🆓"]?.['method']?.["transbyShortCuts"];
    if (Zotero.isMac) {
      if (Zotero.Prefs.get("ai4paper.translatemacshortcutsstyles") === '单键') {
        if (Zotero.Prefs.get("ai4paper.translatesmacshortcuts") != '无') {
          let transMethod = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get("ai4paper.translatesmacshortcuts")]?.["method"]?.["transbyShortCuts"] || defaultTransMethod;
          keyDef = {
            'id': "mac_key_S_" + transMethod,
            'key': String('S'),
            'modifiers': null,
            'func': transMethod,
            'type': "translate"
          };
          keys.push(keyDef);
        }
        if (Zotero.Prefs.get("ai4paper.translatedmacshortcuts") != '无') {
          let transMethod = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get("ai4paper.translatedmacshortcuts")]?.["method"]?.['transbyShortCuts'] || defaultTransMethod;
          keyDef = {
            'id': 'mac_key_D_' + transMethod,
            'key': String('D'),
            'modifiers': null,
            'func': transMethod,
            'type': 'translate'
          };
          keys.push(keyDef);
        }
      }
      keyDef = {
        'id': "mac_key_F_Pronunciation",
        'key': String('F'),
        'modifiers': null,
        'func': "pronunciation",
        'type': "translate"
      };
      keys.push(keyDef);
    } else {
      if (Zotero.isWin || Zotero.isLinux) {
        if (Zotero.Prefs.get("ai4paper.translatewinshortcutsstyles") === '单键') {
          if (Zotero.Prefs.get("ai4paper.translateswinshortcuts") != '无') {
            let transMethod = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get('ai4paper.translateswinshortcuts')]?.["method"]?.["transbyShortCuts"] || defaultTransMethod;
            keyDef = {
              'id': "win_key_S_" + transMethod,
              'key': String('S'),
              'modifiers': null,
              'func': transMethod,
              'type': "translate"
            };
            keys.push(keyDef);
          }
          if (Zotero.Prefs.get("ai4paper.translatedwinshortcuts") != '无') {
            let transMethod = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get("ai4paper.translatedwinshortcuts")]?.["method"]?.["transbyShortCuts"] || defaultTransMethod;
            keyDef = {
              'id': "win_key_D_" + transMethod,
              'key': String('D'),
              'modifiers': null,
              'func': transMethod,
              'type': "translate"
            };
            keys.push(keyDef);
          }
          keyDef = {
            'id': "win_key_F_Pronunciation",
            'key': String('F'),
            'modifiers': null,
            'func': "pronunciation",
            'type': "translate"
          };
          keys.push(keyDef);
        } else {
          if (Zotero.Prefs.get("ai4paper.translatewinshortcutsstyles") === '双键') {
            if (Zotero.Prefs.get("ai4paper.translatealtdshortcuts") != '无') {
              let transMethod = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get('ai4paper.translatealtdshortcuts')]?.["method"]?.['transbyShortCuts'] || defaultTransMethod;
              keyDef = {
                'id': "win_key_Alt_D_" + transMethod,
                'key': String('D'),
                'modifiers': "alt",
                'func': transMethod,
                'type': "translate"
              };
              keys.push(keyDef);
            }
            if (Zotero.Prefs.get('ai4paper.translatealtwshortcuts') != '无') {
              let transMethod = Zotero.AI4Paper.translationServiceList()[Zotero.Prefs.get("ai4paper.translatealtwshortcuts")]?.["method"]?.['transbyShortCuts'] || defaultTransMethod;
              keyDef = {
                'id': "win_key_Alt_W_" + transMethod,
                'key': String('W'),
                'modifiers': "alt",
                'func': transMethod,
                'type': "translate"
              };
              keys.push(keyDef);
            }
            keyDef = {
              'id': 'win_key_Alt_C_Pronunciation',
              'key': String('C'),
              'modifiers': "alt",
              'func': "pronunciation",
              'type': "translate"
            };
            keys.push(keyDef);
          }
        }
      }
    }
    if (keys.length) {
      let keyset = window.document.createXULElement('keyset');
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_PreviewWin': function () {
    window.document.querySelectorAll('#AI4Paper-PreviewWin-keyset').forEach(el => el.remove());
    let keys = [],
      keyDef;
    if (Zotero.Prefs.get("ai4paper.enableWinPreview")) {
      if (Zotero.isWin || Zotero.isLinux) {
        keyDef = {
          'id': "key_PreviewWin",
          'key': String('`'),
          'modifiers': null,
          'func': 'previewItemWin',
          'type': "preview"
        };
        keys.push(keyDef);
      }
    }
    let keyset = window.document.createXULElement("keyset");
    keyset.setAttribute('id', "AI4Paper-PreviewWin-keyset");
    for (let i in keys) {
      keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
    }
    keys.length && window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
  },
  'registerShortcuts_AddAnnotationTag': function () {
    let command = "AddAnnotationTag",
      keysetId = "AI4Paper-" + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get('ai4paper.shortcuts' + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌘ T") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': "meta",
        'KEY': 'T'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, "Control T"), parsed = {
        'MODIFIERS': "control",
        'KEY': 'T'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "addTagForSelectedAnnotationsInit",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_CopyBlockQuoteLink': function () {
    let command = "CopyBlockQuoteLink",
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === '⌘\x20L') {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': "meta",
        'KEY': 'L'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, "Control L"), parsed = {
        'MODIFIERS': "control",
        'KEY': 'L'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + command)) {
      keyDef = {
        'id': "shortcuts_" + command,
        'key': parsed.KEY,
        'modifiers': parsed.MODIFIERS,
        'func': 'getBlockQuoteLink_byShortCuts',
        'type': '' + command
      };
      keys.push(keyDef);
    }
    if (keys.length) {
      let keyset = window.document.createXULElement('keyset');
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_SetAnnotationHead': function () {
    let command = "SetAnnotationHead",
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get('ai4paper.shortcuts' + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌘ ⇧ D") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': 'meta\x20shift',
        'KEY': 'D'
      };else {
        if (Zotero.isWin || Zotero.isLinux) {
          Zotero.Prefs.set("ai4paper.shortcuts" + command, 'Control\x20Shift\x20D');
          parsed = {
            'MODIFIERS': 'control\x20shift',
            'KEY': 'D'
          };
        }
      }
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "setAnnotationHead_byShortCuts",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_CardNotesSearch': function () {
    let command = "CardNotesSearch",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⇧ F") {
      if (Zotero.isMac) {
        parsed = {
          'MODIFIERS': 'shift',
          'KEY': 'F'
        };
      } else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, "Shift F"), parsed = {
        'MODIFIERS': "shift",
        'KEY': 'F'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get('ai4paper.enableShortcuts' + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "searchCardNotes_byShortCuts",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement('keyset');
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_AddRelatedRefs': function () {
    let command = "AddRelatedRefs",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get('ai4paper.shortcuts' + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌘ R") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': "meta",
        'KEY': 'R'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, "Control R"), parsed = {
        'MODIFIERS': "control",
        'KEY': 'R'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "addRelatedRefs_Zotero",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement('keyset');
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_ZoteroAdvancedSearch': function () {
    let command = "ZoteroAdvancedSearch",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌥ F") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': 'alt',
        'KEY': 'F'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, "Alt F"), parsed = {
        'MODIFIERS': "alt",
        'KEY': 'F'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "openAdvancedSearchWindow",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_CopyAnnotationLink': function () {
    let command = "CopyAnnotationLink",
      keysetId = "AI4Paper-" + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': 'copyAnnotationLink_byShortCuts',
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_CopyAnnotationLinkOnly': function () {
    let command = "CopyAnnotationLinkOnly",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get('ai4paper.shortcuts' + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + command)) {
      keyDef = {
        'id': "shortcuts_" + command,
        'key': parsed.KEY,
        'modifiers': parsed.MODIFIERS,
        'func': "copyAnnotationLinkOnly_byShortCuts",
        'type': '' + command
      };
      keys.push(keyDef);
    }
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_CopyAnnotationLinkMD': function () {
    let command = 'CopyAnnotationLinkMD',
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get('ai4paper.enableShortcuts' + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "copyAnnotationLinkMD_byShortCuts",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement('keyset');
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_CopyAnnotationText': function () {
    let command = "CopyAnnotationText",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "copyAnnotationText_byShortCuts",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement('keyset');
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_CollapseLeftSidePane': function () {
    let command = 'CollapseLeftSidePane',
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + command)) {
      keyDef = {
        'id': 'shortcuts_' + command,
        'key': parsed.KEY,
        'modifiers': parsed.MODIFIERS,
        'func': "collapseLeftSidePane",
        'type': '' + command
      };
      keys.push(keyDef);
    }
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_CollapseRightSidePane': function () {
    let command = "CollapseRightSidePane",
      keysetId = "AI4Paper-" + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get('ai4paper.shortcuts' + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + command)) {
      keyDef = {
        'id': 'shortcuts_' + command,
        'key': parsed.KEY,
        'modifiers': parsed.MODIFIERS,
        'func': "collapseRightSidePane",
        'type': '' + command
      };
      keys.push(keyDef);
    }
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_CopyPDF': function () {
    let command = "CopyPDF",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "copyPDF",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_OpenWith': function () {
    let command = "OpenWith",
      keysetId = 'AI4Paper-' + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "openwith",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_CopyPDFAttachmentsLink': function () {
    let command = "CopyPDFAttachmentsLink",
      keysetId = 'AI4Paper-' + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': 'copyPDFAttachmentsLink',
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_ChatwithNewbing': function () {
    let command = 'ChatwithNewbing',
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get('ai4paper.shortcuts' + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "chatWithNewBing",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_ImmersiveTranslate': function () {
    let command = "ImmersiveTranslate",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌘ I") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': 'meta',
        'KEY': 'I'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, "Control I"), parsed = {
        'MODIFIERS': 'control',
        'KEY': 'I'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "openImmersiveTranslate",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_UniversalImmersiveTranslate': function () {
    let command = "UniversalImmersiveTranslate",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌘ ⌥ I") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': 'meta\x20alt',
        'KEY': 'I'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, "Control Alt I"), parsed = {
        'MODIFIERS': 'control\x20alt',
        'KEY': 'I'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + command)) {
      keyDef = {
        'id': 'shortcuts_' + command,
        'key': parsed.KEY,
        'modifiers': parsed.MODIFIERS,
        'func': "openUniversalImmersiveTranslate",
        'type': '' + command
      };
      keys.push(keyDef);
    }
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_FilesHistory': function () {
    let command = 'FilesHistory',
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "openDialog_filesHistory",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_WorkSpace': function () {
    let command = "WorkSpace",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "openWorkSpaceWindow",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_AttachNewFile': function () {
    let command = "AttachNewFile",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get('ai4paper.enableShortcuts' + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "attachNewFile",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_RenameAttachments': function () {
    let command = "RenameAttachments",
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': 'shortcuts_' + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': 'renameAttachments',
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_Archive': function () {
    let command = 'Archive',
      keysetId = "AI4Paper-" + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get('ai4paper.shortcuts' + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': 'archiveSelectedItems',
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_SplitHorizontally': function () {
    let command = "SplitHorizontally",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "splitHorizontally_byShortCuts",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_SplitVertically': function () {
    let command = "SplitVertically",
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + command)) {
      keyDef = {
        'id': "shortcuts_" + command,
        'key': parsed.KEY,
        'modifiers': parsed.MODIFIERS,
        'func': "splitVertically_byShortCuts",
        'type': '' + command
      };
      keys.push(keyDef);
    }
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_OddSpreads': function () {
    let command = 'OddSpreads',
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "oddSpreads_byShortCuts",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_StarOne': function () {
    let command = "StarOne",
      keysetId = "AI4Paper-" + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌥ 1") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': "alt",
        'KEY': '1'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, "Control Alt 1"), parsed = {
        'MODIFIERS': "control alt",
        'KEY': '1'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + command)) {
      keyDef = {
        'id': "shortcuts_" + command,
        'key': parsed.KEY,
        'modifiers': parsed.MODIFIERS,
        'func': 'starSelectedItems',
        'type': '' + command
      };
      keys.push(keyDef);
    }
    if (keys.length) {
      let keyset = window.document.createXULElement('keyset');
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_StarTwo': function () {
    let command = "StarTwo",
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌥ 2") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': "alt",
        'KEY': '2'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set('ai4paper.shortcuts' + command, "Control Alt 2"), parsed = {
        'MODIFIERS': "control alt",
        'KEY': '2'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "starSelectedItems",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById('mainKeyset').parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_StarThree': function () {
    let command = "StarThree",
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === '⌥\x203') {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': 'alt',
        'KEY': '3'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set('ai4paper.shortcuts' + command, 'Control\x20Alt\x203'), parsed = {
        'MODIFIERS': "control alt",
        'KEY': '3'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get('ai4paper.enableShortcuts' + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "starSelectedItems",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_StarFour': function () {
    let command = "StarFour",
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌥ 4") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': "alt",
        'KEY': '4'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, 'Control\x20Alt\x204'), parsed = {
        'MODIFIERS': "control alt",
        'KEY': '4'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': 'starSelectedItems',
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_StarFive': function () {
    let command = "StarFive",
      keysetId = "AI4Paper-" + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get('ai4paper.shortcuts' + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌥ 5") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': "alt",
        'KEY': '5'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, "Control Alt 5"), parsed = {
        'MODIFIERS': 'control\x20alt',
        'KEY': '5'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get('ai4paper.enableShortcuts' + command) && (keyDef = {
      'id': 'shortcuts_' + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "starSelectedItems",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_StarClear': function () {
    let command = 'StarClear',
      keysetId = 'AI4Paper-' + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get('ai4paper.shortcuts' + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌥ 0") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': 'alt',
        'KEY': '0'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, "Control Alt 0"), parsed = {
        'MODIFIERS': "control alt",
        'KEY': '0'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': 'starSelectedItems',
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_PaperAI': function () {
    let command = "PaperAI",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get('ai4paper.shortcuts' + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get('ai4paper.enableShortcuts' + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "paperAI",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_LocateAIReadingNotes': function () {
    let command = "LocateAIReadingNotes",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "gptReaderSidePane_ChatMode_locateAIReadingNotes",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_GetFullText': function () {
    let command = "GetFullText",
      keysetId = "AI4Paper-" + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': 'shortcuts_' + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "gptReaderSidePane_getFullText",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement('keyset');
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_ChangeGPTChatMode': function () {
    let command = 'ChangeGPTChatMode',
      keysetId = "AI4Paper-" + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "gptReaderSidePane_changeChatMode_byShortCuts",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_TagCardNotes': function () {
    let command = "TagCardNotes",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === "⌘ N") {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': "meta",
        'KEY': 'N'
      };else (Zotero.isWin || Zotero.isLinux) && (Zotero.Prefs.set("ai4paper.shortcuts" + command, 'Control\x20N'), parsed = {
        'MODIFIERS': "control",
        'KEY': 'N'
      });
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get('ai4paper.enableShortcuts' + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': 'openDialog_tagsManager',
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_ObsidianNote': function () {
    let command = "ObsidianNote",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    if (shortcutStr === '⌘\x20K') {
      if (Zotero.isMac) parsed = {
        'MODIFIERS': 'meta',
        'KEY': 'K'
      };else {
        if (Zotero.isWin || Zotero.isLinux) {
          Zotero.Prefs.set("ai4paper.shortcuts" + command, 'Control\x20K');
          parsed = {
            'MODIFIERS': 'control',
            'KEY': 'K'
          };
        }
      }
    } else {
      parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
      if (!parsed) return;
    }
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': 'obsidianNote',
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_ObsidianBlock': function () {
    let command = 'ObsidianBlock',
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "go2ObsidianBlock_byShortCuts",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_SetCommentTemplate': function () {
    let command = "SetCommentTemplate",
      keysetId = "AI4Paper-" + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    if (Zotero.Prefs.get("ai4paper.enableShortcuts" + command)) {
      keyDef = {
        'id': 'shortcuts_' + command,
        'key': parsed.KEY,
        'modifiers': parsed.MODIFIERS,
        'func': "addAnnotationCommentTempate_byShortCuts",
        'type': '' + command
      };
      keys.push(keyDef);
    }
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_LocateItemInPapersMatrix': function () {
    let command = "LocateItemInPapersMatrix",
      keysetId = "AI4Paper-" + command + '-keyset';
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get('ai4paper.enableShortcuts' + command) && (keyDef = {
      'id': "shortcuts_" + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': "locateItemInPapersMatrix",
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement('keyset');
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'registerShortcuts_SearchCollectionInPapersMatrix': function () {
    let command = "SearchCollectionInPapersMatrix",
      keysetId = 'AI4Paper-' + command + "-keyset";
    window.document.querySelectorAll('#' + keysetId).forEach(el => el.remove());
    let keys = [],
      keyDef,
      parsed,
      shortcutStr = Zotero.Prefs.get("ai4paper.shortcuts" + command);
    if (!shortcutStr) return;
    parsed = Zotero.AI4Paper.handleShortcuts(shortcutStr);
    if (!parsed) return;
    Zotero.Prefs.get("ai4paper.enableShortcuts" + command) && (keyDef = {
      'id': 'shortcuts_' + command,
      'key': parsed.KEY,
      'modifiers': parsed.MODIFIERS,
      'func': 'searchCollectionInPapersMatrix',
      'type': '' + command
    }, keys.push(keyDef));
    if (keys.length) {
      let keyset = window.document.createXULElement("keyset");
      keyset.setAttribute('id', keysetId);
      for (let i in keys) {
        keyset.appendChild(Zotero.AI4Paper.createKey(keys[i]));
      }
      window.document.getElementById("mainKeyset").parentNode.appendChild(keyset);
    }
  },
  'handleShortcuts': function (shortcutStr) {
    shortcutStr = shortcutStr.replace(/⌘/g, "meta").replace(/⌃/g, "control").replace(/⇧/g, "shift").replace(/⌥/g, "alt").replace(/Win/g, 'meta').replace(/Control/g, "control").replace(/Shift/g, "shift").replace(/Alt/g, "alt");
    if (shortcutStr.indexOf('\x20') === -0x1) {
      return {
        'MODIFIERS': null,
        'KEY': shortcutStr.replace(/␣/g, '\x20').replace(/Space/g, '\x20')
      };
    } else {
      let lastSpaceIdx = shortcutStr.lastIndexOf('\x20'),
        modifiers = shortcutStr.substring(0x0, lastSpaceIdx).toLowerCase(),
        keyName = shortcutStr.substring(lastSpaceIdx + 0x1).replace(/␣/g, '\x20').replace(/Space/g, '\x20');
      return {
        'MODIFIERS': modifiers,
        'KEY': keyName
      };
    }
  },
  'createKey': function (keyConfig) {
    let keyElement = window.document.createXULElement('key');
    keyElement.setAttribute('id', 'AI4Paper-key-' + keyConfig.id);
    keyElement.setAttribute("oncommand", '//');
    keyElement.addEventListener("command", function () {
      try {
        if (keyConfig.type === "StarOne") Zotero.AI4Paper[keyConfig.func](0x1);else {
          if (keyConfig.type === 'StarTwo') Zotero.AI4Paper[keyConfig.func](0x2);else {
            if (keyConfig.type === 'StarThree') Zotero.AI4Paper[keyConfig.func](0x3);else {
              if (keyConfig.type === 'StarFour') Zotero.AI4Paper[keyConfig.func](0x4);else {
                if (keyConfig.type === 'StarFive') Zotero.AI4Paper[keyConfig.func](0x5);else {
                  if (keyConfig.type === 'StarClear') Zotero.AI4Paper[keyConfig.func](0x0);else {
                    if (keyConfig.type === "ZoteroAdvancedSearch") Zotero.getMainWindow().ZoteroPane_Local.openAdvancedSearchWindow();else keyConfig.type === "GetFullText" ? Zotero.AI4Paper[keyConfig.func](true) : Zotero.AI4Paper[keyConfig.func]();
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        Zotero.AI4Paper.showProgressWindow(0xfa0, '❌【快捷键操作】出错啦', '' + e, "fail");
      }
    });
    keyConfig.modifiers && keyElement.setAttribute("modifiers", keyConfig.modifiers);
    if (keyConfig.key) keyElement.setAttribute('key', keyConfig.key);else {
      if (keyConfig.keycode) keyElement.setAttribute("keycode", keyConfig.keycode);else {
        keyElement.setAttribute("key", '');
      }
    }
    return keyElement;
  },
  'registerShortCuts_Window': function (action) {
    if (action === "add" && !Zotero.AI4Paper._keydownHandler_SidePane) {
      Zotero.AI4Paper._keydownHandler_SidePane = function (keyEvent) {
        let reader = Zotero.AI4Paper.getCurrentReader();
        if (keyEvent.key === "Alt" && !keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.metaKey && keyEvent.code === "AltLeft" && Zotero.Prefs.get("ai4paper.translationcrossparagraphsShortcutsEnable")) {
          if (Zotero_Tabs._selectedID != "zotero-pane" && reader) {
            if (Zotero.Prefs.get("ai4paper.selectedtexttransenable") && Zotero.AI4Paper.selectedText(reader).trim() && !reader._iframeWindow.document.querySelector('.selection-popup')) {
              keyEvent.preventDefault && keyEvent.preventDefault();
              keyEvent.stopPropagation();
              Zotero.Prefs.set('ai4paper.translationcrossparagraphs', true);
              Zotero.AI4Paper.updateTranslateReaderSidePane();
              let tabId = Zotero_Tabs._selectedID,
                sidePaneWin = null;
              window.document.getElementById("ai4paper-translate-readersidepane") && (sidePaneWin = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow, sidePaneWin && (sidePaneWin.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.boxShadow = "0 0 4px blue"));
            } else {
              if (!Zotero.Prefs.get("ai4paper.selectedtexttransenable") && Zotero.AI4Paper.selectedText(reader).trim() && !reader._iframeWindow.document.querySelector(".selection-popup")) {
                keyEvent.preventDefault && keyEvent.preventDefault();
                keyEvent.stopPropagation();
                Zotero.Prefs.set("ai4paper.translationcrossparagraphs", true);
                Zotero.AI4Paper.updateTranslateReaderSidePane();
                let tabId = Zotero_Tabs._selectedID,
                  sidePaneWin = null;
                window.document.getElementById("ai4paper-translate-readersidepane") && (sidePaneWin = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow, sidePaneWin && (sidePaneWin.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.boxShadow = "0 0 4px blue"));
              }
            }
          }
        }
        keyEvent.key === "Alt" && !keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.metaKey && keyEvent.code === "AltLeft" && Zotero.Prefs.get("ai4paper.gptMergeSelectedTextEnable") && Zotero.AI4Paper.selectedText(reader).trim() && !reader._iframeWindow.document.querySelector(".selection-popup") && Zotero_Tabs._selectedID != "zotero-pane" && (keyEvent.preventDefault && keyEvent.preventDefault(), keyEvent.stopPropagation(), Zotero.Prefs.set("ai4paper.gptMergeSelectedText", true), Zotero.AI4Paper.changeGPTPopupButtonName(false));
        if (keyEvent.key === 'w' && !keyEvent.ctrlKey && !keyEvent.shiftKey && keyEvent.metaKey && Zotero.isMac && Zotero.Prefs.get("ai4paper.enableMacPreview")) {
          Zotero_Tabs._selectedID === 'zotero-pane' && (keyEvent.preventDefault && keyEvent.preventDefault(), keyEvent.stopPropagation(), Zotero.AI4Paper.previewItemMac());
        }
      };
      window.document.addEventListener("keydown", Zotero.AI4Paper._keydownHandler_SidePane);
    } else {
      if (action === "remove") {
        window.document.removeEventListener("keydown", Zotero.AI4Paper._keydownHandler_SidePane);
      }
    }
    if (action === "add" && !Zotero.AI4Paper._keyupHandler_SidePane) {
      Zotero.AI4Paper._keyupHandler_SidePane = function (keyEvent) {
        if (keyEvent.key === 'Alt' && Zotero.Prefs.get("ai4paper.translationcrossparagraphsShortcutsEnable")) {
          if (Zotero_Tabs._selectedID != "zotero-pane") {
            if (keyEvent.preventDefault) {
              keyEvent.preventDefault();
            }
            keyEvent.stopPropagation();
            Zotero.Prefs.set("ai4paper.translationcrossparagraphs", false);
            Zotero.AI4Paper.updateTranslateReaderSidePane();
            let tabId = Zotero_Tabs._selectedID,
              sidePaneWin = null;
            if (window.document.getElementById("ai4paper-translate-readersidepane")) {
              sidePaneWin = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;
              if (sidePaneWin) {
                sidePaneWin.document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.boxShadow = "0 0 1px rgba(0, 0, 0, 0.5)";
              }
            }
            !Zotero.Prefs.get("ai4paper.selectedtexttransenable") && Zotero.AI4Paper.changeTranslationPopupButtonName(true);
          }
        }
        if (keyEvent.key === 'Alt' && Zotero.Prefs.get('ai4paper.gptMergeSelectedTextEnable')) {
          if (Zotero_Tabs._selectedID != 'zotero-pane') {
            keyEvent.preventDefault && keyEvent.preventDefault();
            keyEvent.stopPropagation();
            Zotero.Prefs.set("ai4paper.gptMergeSelectedText", false);
            Zotero.AI4Paper.changeGPTPopupButtonName(true);
          }
        }
      };
      window.document.addEventListener("keyup", Zotero.AI4Paper._keyupHandler_SidePane);
    } else {
      if (action === "remove") {
        window.document.removeEventListener("keyup", Zotero.AI4Paper._keyupHandler_SidePane);
      }
    }
  },
});
