var methodsBody = function () {};
methodsBody.init = function () {
  methodsBody.io = window.arguments && window.arguments[0] ? window.arguments[0] : {
    dataIn: '',
    dataOut: null
  };
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  document.addEventListener('dialogcancel', () => methodsBody.cancelSelection());
  document.getElementById('oldName').value = `将历史对话 “${methodsBody.io.dataIn}” 修改为：`;
  document.getElementById('newName').value = methodsBody.io.dataIn;
};
methodsBody.acceptSelection = function () {
  let newName = document.getElementById("newName").value.trim();
  methodsBody.io.dataOut = newName;
  window.close();
};
methodsBody.cancelSelection = function () {
  methodsBody.io.dataOut = null;
  window.close();
};
