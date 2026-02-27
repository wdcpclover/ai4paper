var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  document.addEventListener('dialogcancel', () => methodsBody.cancelSelection());
  this.io = window.arguments[0];
  document.getElementById('oldName').value = `将历史对话 “${this.io.dataIn}” 修改为：`;
  document.getElementById('newName').value = this.io.dataIn;
};
methodsBody.acceptSelection = function () {
  let newName = document.getElementById("newName").value.trim();
  this.io.dataOut = newName;
  window.close();
};
methodsBody.cancelSelection = function () {
  this.io.dataOut = null;
  window.close();
};