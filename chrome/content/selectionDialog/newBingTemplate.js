var methodsBody = function () {};
methodsBody.init = async function () {
  // 根据 Zotero 版本调整样式
  Zotero.AI4Paper.updateTextAreaBox4ZoteroScheme(window);
  document.getElementById("enableNewBingTemplate").checked = Zotero.Prefs.get('ai4paper.enableNewBingTemplate');
  document.getElementById("newBingTemplate").value = Zotero.Prefs.get('ai4paper.newBingTemplate');

  // 聚焦
  await Zotero.Promise.delay(10);
  document.getElementById("newBingTemplate").focus();
  document.getElementById("enableNewBingTemplate").focus();
  document.getElementById("newBingTemplate").focus();
};
methodsBody.enableTemplate = function () {
  Zotero.Prefs.set('ai4paper.enableNewBingTemplate', document.getElementById("enableNewBingTemplate").checked);
};
methodsBody.updateTemplate = function () {
  Zotero.Prefs.set('ai4paper.newBingTemplate', document.getElementById("newBingTemplate").value);
};