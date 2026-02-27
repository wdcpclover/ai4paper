var methodsBody = function () {};
methodsBody.init = function () {
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  this.io = window.arguments[0];
  let categories = Zotero.AI4Paper._data_EudicCategories;
  let _radio;
  for (let category of categories) {
    _radio = document.createXULElement('radio');
    // \u00A0\u00A0\u00A0 不间断空格
    _radio.setAttribute('label', `【生词本名称】：${category.name}\u00A0\u00A0\u00A0🆔：${category.id}`);
    _radio.setAttribute('value', `【生词本名称】：${category.name}\u00A0\u00A0\u00A0🆔：${category.id}`);
    document.getElementById("category-list").appendChild(_radio);
  }
};
methodsBody.acceptSelection = function () {
  var returnObject = false;
  // 提取 ID 值后，直接传递
  let selected = document.getElementById("category-list").value;
  let index = selected.indexOf('🆔：');
  selected = selected.substring(index + 3);
  this.io.dataOut = selected;
  returnObject = true;
  if (!returnObject) this.io.dataOut = null;
};