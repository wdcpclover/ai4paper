var methodsBody = function () {};
methodsBody.init = function () {
  // 是否开启自定义颜色名称
  document.getElementById("zoteroif.ColorLabel.enable").checked = Zotero.Prefs.get('zoteroif.enabelColorLabel');
  // 各个颜色名称
  document.getElementById("zoteroif.defineColorLabel.yellow").value = Zotero.Prefs.get('zoteroif.yellowColorLabel');
  document.getElementById("zoteroif.defineColorLabel.red").value = Zotero.Prefs.get('zoteroif.redColorLabel');
  document.getElementById("zoteroif.defineColorLabel.green").value = Zotero.Prefs.get('zoteroif.greenColorLabel');
  document.getElementById("zoteroif.defineColorLabel.blue").value = Zotero.Prefs.get('zoteroif.blueColorLabel');
  document.getElementById("zoteroif.defineColorLabel.purple").value = Zotero.Prefs.get('zoteroif.purpleColorLabel');
  document.getElementById("zoteroif.defineColorLabel.magenta").value = Zotero.Prefs.get('zoteroif.magentaColorLabel');
  document.getElementById("zoteroif.defineColorLabel.orange").value = Zotero.Prefs.get('zoteroif.orangeColorLabel');
  document.getElementById("zoteroif.defineColorLabel.gray").value = Zotero.Prefs.get('zoteroif.grayColorLabel');

  // 聚焦
  document.getElementById("richlistbox-elem").focus();
};
methodsBody.enableColorLabel = function () {
  // 是否开启自定义颜色名称
  Zotero.Prefs.set('zoteroif.enabelColorLabel', document.getElementById("zoteroif.ColorLabel.enable").checked);
  if (document.getElementById("zoteroif.ColorLabel.enable").checked) {
    Zotero.ZoteroIF.updateAddColorLabelState();
  }
};
methodsBody.setColorLabel = function () {
  // 各个颜色名称
  Zotero.Prefs.set('zoteroif.yellowColorLabel', document.getElementById("zoteroif.defineColorLabel.yellow").value.trim());
  Zotero.Prefs.set('zoteroif.redColorLabel', document.getElementById("zoteroif.defineColorLabel.red").value.trim());
  Zotero.Prefs.set('zoteroif.greenColorLabel', document.getElementById("zoteroif.defineColorLabel.green").value.trim());
  Zotero.Prefs.set('zoteroif.blueColorLabel', document.getElementById("zoteroif.defineColorLabel.blue").value.trim());
  Zotero.Prefs.set('zoteroif.purpleColorLabel', document.getElementById("zoteroif.defineColorLabel.purple").value.trim());
  Zotero.Prefs.set('zoteroif.magentaColorLabel', document.getElementById("zoteroif.defineColorLabel.magenta").value.trim());
  Zotero.Prefs.set('zoteroif.orangeColorLabel', document.getElementById("zoteroif.defineColorLabel.orange").value.trim());
  Zotero.Prefs.set('zoteroif.grayColorLabel', document.getElementById("zoteroif.defineColorLabel.gray").value.trim());
};