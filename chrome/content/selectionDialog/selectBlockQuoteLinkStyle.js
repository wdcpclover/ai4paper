var methodsBody = function () {};
methodsBody.init = function () {
  methodsBody.io = window.arguments && window.arguments[0] ? window.arguments[0] : {
    dataIn: null,
    dataOut: null
  };
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  document.getElementById("blockquotelink-style").value = Zotero.Prefs.get('ai4paper.blockquotelinklaststyle');
};
methodsBody.acceptSelection = function () {
  var returnObject = false;
  methodsBody.io.dataOut = new Object();
  methodsBody.io.dataOut[0] = document.getElementById("blockquotelink-style").value;
  returnObject = true;
  if (!returnObject) methodsBody.io.dataOut = null;
};
