var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  let columnList = ['shortTitle', 'archive', 'archiveLocation', 'libraryCatalog', 'callNumber', 'rights'];
  for (let _dataKey of columnList) {
    document.getElementById(`zoteroif.enableCustomItemTreeColumns${_dataKey}`).checked = Zotero.Prefs.get(`zoteroif.enableCustomItemTreeColumns${_dataKey}`);
    document.getElementById(`zoteroif.renameCustomItemTreeColumns${_dataKey}`).value = Zotero.Prefs.get(`zoteroif.renameCustomItemTreeColumns${_dataKey}`);
  }
};