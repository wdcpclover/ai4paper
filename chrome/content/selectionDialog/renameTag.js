var methodsBody = function () {};
methodsBody.init = function () {
  methodsBody.io = window.arguments && window.arguments[0] ? window.arguments[0] : {
    dataIn: '',
    dataOut: null
  };
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  document.addEventListener('dialogcancel', () => methodsBody.cancelSelection());
  document.getElementById('ai4paper.renameTag.oldTag').value = `将标签【${methodsBody.io.dataIn}】修改为：`;
  document.getElementById('ai4paper.renameTag.inputBox').value = methodsBody.io.dataIn;
};
methodsBody.acceptSelection = function () {
  let newTag = document.getElementById("ai4paper.renameTag.inputBox").value.trim();
  methodsBody.io.dataOut = newTag;
  window.close();
};
methodsBody.cancelSelection = function () {
  methodsBody.io.dataOut = null;
  window.close();
};
