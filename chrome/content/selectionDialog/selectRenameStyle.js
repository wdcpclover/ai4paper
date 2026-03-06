var methodsBody = function () {};
methodsBody.init = function () {
  methodsBody.io = window.arguments && window.arguments[0] ? window.arguments[0] : {
    dataIn: null,
    dataOut: null
  };
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  let renameTemplate = Zotero.Prefs.get('ai4paper.renameTemplate');
  if (renameTemplate) {
    renameTemplate = renameTemplate.split('\n').filter(item => item != '');
    let _radio;
    for (let template of renameTemplate) {
      _radio = document.createXULElement('radio');
      _radio.setAttribute('label', template.trim());
      _radio.setAttribute('value', template.trim());
      document.getElementById("rename-style").appendChild(_radio);
    }
  }
  document.getElementById("rename-style").value = Zotero.Prefs.get('ai4paper.lastRenameStyle');
};
methodsBody.acceptSelection = function () {
  var returnObject = false;
  methodsBody.io.dataOut = new Object();
  methodsBody.io.dataOut[0] = document.getElementById("rename-style").value;
  returnObject = true;
  if (!returnObject) methodsBody.io.dataOut = null;
};
