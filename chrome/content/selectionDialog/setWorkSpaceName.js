var methodsBody = function () {};
methodsBody.init = function () {
  methodsBody.io = window.arguments && window.arguments[0] ? window.arguments[0] : {
    action: '',
    dataIn: '',
    dataOut: null
  };
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  document.addEventListener('dialogcancel', () => methodsBody.cancelSelection());
  let descriptionElem = document.getElementById('setWorkSpaceName.description');
  let inputBoxElem = document.getElementById("setWorkSpaceName.inputBox");
  if (methodsBody.io.action === "add") {
    descriptionElem.value = `当前共【${methodsBody.io.dataIn}】个标签页，请输入新建工作区的名称（勿重名）：`;
  } else if (methodsBody.io.action === "rename") {
    descriptionElem.value = `将工作区【${methodsBody.io.dataIn}】重命名为：`;
    inputBoxElem.value = methodsBody.io.dataIn;
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
  if (!menu) return;
  let inputBoxElem = document.getElementById("setWorkSpaceName.inputBox");
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, "填入【当前日期】", () => {
    inputBoxElem.value = `${inputBoxElem.value} ${Zotero.AI4Paper.getDate()}`;
  });
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, "填入【当前日期时间】", () => {
    inputBoxElem.value = `${inputBoxElem.value} ${Zotero.AI4Paper.getDateTime()}`;
  });

  // 填入【当前时间】
  Zotero.AI4Paper.DialogUtils.addMenuItem(menu, "填入【当前时间】", () => {
    inputBoxElem.value = `${inputBoxElem.value} ${Zotero.AI4Paper.getTime()}`;
  });
  return menu;
};
methodsBody.acceptSelection = function () {
  let workSpaceName = document.getElementById("setWorkSpaceName.inputBox").value.trim();
  methodsBody.io.dataOut = workSpaceName;
  window.close();
};
methodsBody.cancelSelection = function () {
  methodsBody.io.dataOut = null;
  window.close();
};
