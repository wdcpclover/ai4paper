var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  document.addEventListener('dialogcancel', () => methodsBody.cancelSelection());
  this.io = window.arguments[0];
  document.getElementById('ai4paper.renameTag.oldTag').value = `将标签【${this.io.dataIn}】修改为：`;
  document.getElementById('ai4paper.renameTag.inputBox').value = this.io.dataIn;
};
methodsBody.acceptSelection = function () {
  let newTag = document.getElementById("ai4paper.renameTag.inputBox").value.trim();
  this.io.dataOut = newTag;
  window.close();
};
methodsBody.cancelSelection = function () {
  this.io.dataOut = null;
  window.close();
};