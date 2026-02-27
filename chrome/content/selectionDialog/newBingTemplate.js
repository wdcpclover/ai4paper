var methodsBody = function () {};
methodsBody.init = async function () {
  // 根据 Zotero 版本调整样式
  Zotero.ZoteroIF.updateTextAreaBox4ZoteroScheme(window);
  document.getElementById("enableNewBingTemplate").checked = Zotero.Prefs.get('zoteroif.enableNewBingTemplate');
  document.getElementById("newBingTemplate").value = Zotero.Prefs.get('zoteroif.newBingTemplate');

  // 聚焦
  await Zotero.Promise.delay(10);
  document.getElementById("newBingTemplate").focus();
  document.getElementById("enableNewBingTemplate").focus();
  document.getElementById("newBingTemplate").focus();
};
methodsBody.enableTemplate = function () {
  Zotero.Prefs.set('zoteroif.enableNewBingTemplate', document.getElementById("enableNewBingTemplate").checked);
};
methodsBody.updateTemplate = function () {
  Zotero.Prefs.set('zoteroif.newBingTemplate', document.getElementById("newBingTemplate").value);
};