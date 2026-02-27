var methodsBody = function () {};
methodsBody.init = function () {
  // 是否开启自定义颜色名称
  document.getElementById("ai4paper.ColorLabel.enable").checked = Zotero.Prefs.get('ai4paper.enabelColorLabel');
  // 各个颜色名称
  document.getElementById("ai4paper.defineColorLabel.yellow").value = Zotero.Prefs.get('ai4paper.yellowColorLabel');
  document.getElementById("ai4paper.defineColorLabel.red").value = Zotero.Prefs.get('ai4paper.redColorLabel');
  document.getElementById("ai4paper.defineColorLabel.green").value = Zotero.Prefs.get('ai4paper.greenColorLabel');
  document.getElementById("ai4paper.defineColorLabel.blue").value = Zotero.Prefs.get('ai4paper.blueColorLabel');
  document.getElementById("ai4paper.defineColorLabel.purple").value = Zotero.Prefs.get('ai4paper.purpleColorLabel');
  document.getElementById("ai4paper.defineColorLabel.magenta").value = Zotero.Prefs.get('ai4paper.magentaColorLabel');
  document.getElementById("ai4paper.defineColorLabel.orange").value = Zotero.Prefs.get('ai4paper.orangeColorLabel');
  document.getElementById("ai4paper.defineColorLabel.gray").value = Zotero.Prefs.get('ai4paper.grayColorLabel');

  // 聚焦
  document.getElementById("richlistbox-elem").focus();
};
methodsBody.enableColorLabel = function () {
  // 是否开启自定义颜色名称
  Zotero.Prefs.set('ai4paper.enabelColorLabel', document.getElementById("ai4paper.ColorLabel.enable").checked);
  if (document.getElementById("ai4paper.ColorLabel.enable").checked) {
    Zotero.AI4Paper.updateAddColorLabelState();
  }
};
methodsBody.setColorLabel = function () {
  // 各个颜色名称
  Zotero.Prefs.set('ai4paper.yellowColorLabel', document.getElementById("ai4paper.defineColorLabel.yellow").value.trim());
  Zotero.Prefs.set('ai4paper.redColorLabel', document.getElementById("ai4paper.defineColorLabel.red").value.trim());
  Zotero.Prefs.set('ai4paper.greenColorLabel', document.getElementById("ai4paper.defineColorLabel.green").value.trim());
  Zotero.Prefs.set('ai4paper.blueColorLabel', document.getElementById("ai4paper.defineColorLabel.blue").value.trim());
  Zotero.Prefs.set('ai4paper.purpleColorLabel', document.getElementById("ai4paper.defineColorLabel.purple").value.trim());
  Zotero.Prefs.set('ai4paper.magentaColorLabel', document.getElementById("ai4paper.defineColorLabel.magenta").value.trim());
  Zotero.Prefs.set('ai4paper.orangeColorLabel', document.getElementById("ai4paper.defineColorLabel.orange").value.trim());
  Zotero.Prefs.set('ai4paper.grayColorLabel', document.getElementById("ai4paper.defineColorLabel.gray").value.trim());
};