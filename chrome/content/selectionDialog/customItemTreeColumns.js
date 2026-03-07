var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  let columnList = ['shortTitle', 'archive', 'archiveLocation', 'libraryCatalog', 'callNumber', 'journalRanking', 'rights'];
  for (let _dataKey of columnList) {
    document.getElementById(`ai4paper.enableCustomItemTreeColumns${_dataKey}`).checked = Zotero.Prefs.get(`ai4paper.enableCustomItemTreeColumns${_dataKey}`);
    document.getElementById(`ai4paper.renameCustomItemTreeColumns${_dataKey}`).value = Zotero.Prefs.get(`ai4paper.renameCustomItemTreeColumns${_dataKey}`);
  }
};
