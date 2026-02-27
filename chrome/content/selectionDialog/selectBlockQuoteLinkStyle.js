var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  document.getElementById("blockquotelink-style").value = Zotero.Prefs.get('zoteroif.blockquotelinklaststyle');
  this.io = window.arguments[0];
};
methodsBody.acceptSelection = function () {
  var returnObject = false;
  this.io.dataOut = new Object();
  this.io.dataOut[0] = document.getElementById("blockquotelink-style").value;
  returnObject = true;
  if (!returnObject) this.io.dataOut = null;
};