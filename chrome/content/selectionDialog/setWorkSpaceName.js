var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  document.addEventListener('dialogcancel', () => methodsBody.cancelSelection());
  this.io = window.arguments[0];
  let descriptionElem = document.getElementById('setWorkSpaceName.description');
  let inputBoxElem = document.getElementById("setWorkSpaceName.inputBox");
  if (this.io.action === "add") {
    descriptionElem.value = `当前共【${this.io.dataIn}】个标签页，请输入新建工作区的名称（勿重名）：`;
  } else if (this.io.action === "rename") {
    descriptionElem.value = `将工作区【${this.io.dataIn}】重命名为：`;
    inputBoxElem.value = this.io.dataIn;
  }

  // 初始化右键菜单
  methodsBody.buildContextMenu(true);

  // 输入框右键菜单
  inputBoxElem.addEventListener('contextmenu', event => {
    event.preventDefault();
    event.stopPropagation();
    let popup = methodsBody.buildContextMenu();
    if (popup) {
      popup.openPopup(event.target, "after_start", 0, 0, false, false);
    }
  });
};

/**
 * 创建输入框右键菜单
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.buildContextMenu = function (isInit) {
  let menu = Zotero.AI4Paper.DialogUtils.initMenuPopup('inputBox-contextmenu', isInit);
  if (isInit && !menu) return;
  let inputBoxElem = document.getElementById("setWorkSpaceName.inputBox");
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, "填入【当前日期】", () => {
    inputBoxElem.value = `${inputBoxElem.value} ${Zotero.AI4Paper.getDate()}`;
  });
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, "填入【当前日期时间】", () => {
    inputBoxElem.value = `${inputBoxElem.value} ${Zotero.AI4Paper.getDateTime()}`;
  });

  // 填入【当前时间】
  menuitem = window.document.createXULElement('menuitem');
  menuitem.setAttribute('label', "填入【当前时间】");
  menuitem.addEventListener('command', () => {
    inputBoxElem.value = `${inputBoxElem.value} ${Zotero.AI4Paper.getTime()}`;
  });
  popup.appendChild(menuitem);
  return popup;
};
methodsBody.acceptSelection = function () {
  let workSpaceName = document.getElementById("setWorkSpaceName.inputBox").value.trim();
  this.io.dataOut = workSpaceName;
  window.close();
};
methodsBody.cancelSelection = function () {
  this.io.dataOut = null;
  window.close();
};