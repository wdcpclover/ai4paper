var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  Zotero.AI4Paper.setFontSize_Dialog(document.querySelector('dialog'), 0.92);
  let var1 = document.getElementById('category-list'),
    var2 = ['全部', "全部，但不含各类按钮、UI 参数", '全部，但不含路径、快捷键', "全部，但不含各类按钮、UI 参数、路径、快捷键", "前往收藏分类、最近打开、工作区、标签库"];
  for (let var3 of var2) {
    let _0x2ff677 = document.createXULElement("radio");
    _0x2ff677.setAttribute("label", var3);
    _0x2ff677.setAttribute("value", var3);
    var1.appendChild(_0x2ff677);
  }
  var1.value = '全部';
  Zotero.AI4Paper.blurActiveElement(window);
};
methodsBody.exportZoteroOnePrefs = function () {
  Zotero.AI4Paper.htBRMgqqTept();
};
methodsBody.importZoteroOnePrefs = function () {
  let var5 = document.getElementById('category-list').value;
  Zotero.AI4Paper.xhCSSVyhDimt(var5);
};