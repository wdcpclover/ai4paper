if (typeof Zotero == "undefined") var Zotero;
var chromeHandle;
const {
  OS
} = ChromeUtils.importESModule("chrome://zotero/content/osfile.mjs");
function log(param1) {
  Zotero.debug('AI4paper:\x20' + param1);
}
function onMainWindowLoad({
  id: _0x4c95e2,
  version: _0x5ad239,
  resourceURI: _0x5bbd62,
  rootURI = _0x5bbd62.spec
}) {
  startup({
    'id': _0x4c95e2,
    'version': _0x5ad239,
    'resourceURI': _0x5bbd62,
    'rootURI': rootURI
  });
}
function onMainWindowUnload({
  id: _0x56c4b8,
  version: _0x31811b,
  resourceURI: _0xf2609a,
  rootURI = _0xf2609a.spec
}) {}
async function install({
  id: _0x2ed22d,
  version: _0x17fe35,
  resourceURI: _0x269e56,
  rootURI = _0x269e56.spec
}) {
  log("AI4paper: Installed");
}
function uninstall() {
  log("AI4paper: Uninstalled");
}
async function waitForZotero() {
  typeof Zotero != 'undefined' && (await Zotero.initializationPromise);
  var var1 = Services.wm.getEnumerator("navigator:browser"),
    var2 = false;
  while (var1.hasMoreElements()) {
    let _0x327fa7 = var1.getNext();
    if (_0x327fa7.Zotero) {
      Zotero = _0x327fa7.Zotero;
      var2 = true;
      break;
    }
  }
  if (!var2) {
    await new Promise(_0x46827c => {
      var var4 = {
        'onOpenWindow': function (param2) {
          let var5 = param2.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
          var5.addEventListener("load", function () {
            var5.removeEventListener("load", arguments.callee, false);
            var5.Zotero && (Services.wm.removeListener(var4), Zotero = var5.Zotero, _0x46827c());
          }, false);
        }
      };
      Services.wm.addListener(var4);
    });
  }
  await Zotero.initializationPromise;
}
async function startup({
  id: _0x8ac95e,
  version: _0x46fdd6,
  resourceURI: _0x254d3c,
  rootURI = _0x254d3c.spec
}) {
  await waitForZotero();
  const var6 = {
    'rootURI': rootURI
  };
  var6._globalThis = var6;
  load_unload_JS(rootURI, var6, "load");
  Zotero.PreferencePanes.register({
    'id': "zotero-prefpane-ai4paper",
    'pluginID': "ai4paper@cpc.dev",
    'label': "AI4paper",
    'image': 'chrome://ai4paper/content/icons/favicon.png',
    'src': rootURI + '/chrome/content/prefs.xhtml',
    'scripts': [rootURI + "/chrome/content/scripts/preferences.js"]
  });
  if (Zotero.platformMajorVersion >= 0x66) {
    var var7 = Components.classes["@mozilla.org/addons/addon-manager-startup;1"].getService(Components.interfaces.amIAddonManagerStartup),
      var8 = Services.io.newURI(rootURI + 'manifest.json');
    chromeHandle = var7.registerChrome(var8, [["content", 'ai4paper', rootURI + "chrome/content/"]]);
  }
  Zotero.AI4Paper.init({
    'id': _0x8ac95e,
    'version': _0x46fdd6,
    'rootURI': rootURI
  });
}
function shutdown({
  id: _0x381f46,
  version: _0x4c5e54,
  resourceURI: _0x4727cb,
  rootURI: _0x30fb7a
}, param3) {
  log("AI4paper: Shutting down");
  if (param3 === APP_SHUTDOWN) {
    return;
  }
  typeof Zotero === "undefined" && (Zotero = Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject);
  Zotero.AI4Paper.destroy();
  Zotero.AI4Paper = null;
  Zotero.AI4Paper_Prefs = null;
  load_unload_JS(_0x30fb7a, null, "unload");
  if (chromeHandle) {
    chromeHandle.destruct();
    chromeHandle = null;
  }
  Cc["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService).flushBundles();
}
function load_unload_JS(param4, param5, param6) {
  log("AI4paper: load scripts");
  var var9 = ["ai4paper", "ai4paper-config", "ai4paper-utils", "ai4paper-shortcuts", "ai4paper-theme", "ai4paper-trans-engines", "ai4paper-vocabulary", "ai4paper-gpt-completion", "ai4paper-gpt-chat", "ai4paper-reader", "ai4paper-annotation", "ai4paper-obsidian", "ai4paper-tags", "ai4paper-refs", "ai4paper-metadata", "ai4paper-collections", "ai4paper-item-ops", "ai4paper-license", "ai4paper-notes", "ai4paper-popup", "ai4paper-gpt-reader", "ai4paper-immersive", 'menuPopup', 'ui', "ChinesePY"],
    var10 = ["emoji", "jcr_if", "zjk_fenqu", "modifiedPubTitles", 'earlywarning', 'jcr_if_abbrev', 'abbrev_to_full', "abbrev_to_full_dots", 'full_to_abbrev_dots', "full_to_abbrev", 'jcr_if_issn', 'issn_journal', "pkucore", 'njucore', "cscd", "ccf"],
    var11 = ["svg_icons", "marked.min", "highlight.min"];
  if (param6 === "load") {
    var9.forEach(_0x3c68f8 => Services.scriptloader.loadSubScript(param4 + "/chrome/content/scripts/" + _0x3c68f8 + ".js", param5));
    var10.forEach(_0x4bc96f => Services.scriptloader.loadSubScript(param4 + "/chrome/content/assets/data/" + _0x4bc96f + '.js', param5));
    var11.forEach(_0x214a9c => Services.scriptloader.loadSubScript(param4 + "/chrome/content/assets/js/" + _0x214a9c + '.js', param5));
  } else param6 === 'unload' && (var9.forEach(_0x11fe90 => Cu.unload(param4 + "/chrome/content/scripts/" + _0x11fe90 + '.js')), var10.forEach(_0x3aa11e => Cu.unload(param4 + "/chrome/content/assets/data/" + _0x3aa11e + ".js")), var11.forEach(_0xdc3577 => Cu.unload(param4 + "/chrome/content/assets/js/" + _0xdc3577 + '.js')));
}