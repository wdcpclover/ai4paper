var methodsBody = function () {};
methodsBody.init = function () {
  // 根据 Zotero 版本调整样式
  Zotero.ZoteroIF.updateTextAreaBox4ZoteroScheme(window);
  document.getElementById("zotero-if-xul-rename-template-enable").checked = Zotero.Prefs.get('zoteroif.enableRenameTemplate');
  document.getElementById("zotero-if-xul-rename-template-content").value = Zotero.Prefs.get('zoteroif.renameTemplate');

  // 聚焦
  document.getElementById("zotero-if-xul-rename-template-content").focus();
};
methodsBody.enableTemplate = function () {
  Zotero.Prefs.set('zoteroif.enableRenameTemplate', document.getElementById("zotero-if-xul-rename-template-enable").checked);
};
methodsBody.updateTemplate = function () {
  Zotero.Prefs.set('zoteroif.renameTemplate', document.getElementById("zotero-if-xul-rename-template-content").value);
};