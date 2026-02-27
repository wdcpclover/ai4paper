var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);

  // 根据 Zotero 版本调整样式
  Zotero.AI4Paper.updateTextAreaBox4ZoteroScheme(window);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  this.io = window.arguments[0];
  document.title = this.io.dataIn ? "导入外部 AI 对话" : "向对话添加新消息";

  // 初始化右键菜单
  methodsBody.buildContextMenu_service(true);
  methodsBody.buildContextMenu_model(true);
  // 输入框右键菜单
  methodsBody.setContextMenu_service();
  methodsBody.setContextMenu_model();
};
methodsBody.acceptSelection = function () {
  let question = document.getElementById("textarea-userQuestion").value.trim();
  let response_content = document.getElementById("textarea-aiResponse").value.trim();
  let serviceName = document.getElementById("inputBox-serviceName").value.trim();
  let model = document.getElementById("inputBox-modelName").value.trim();
  if (!question || !response_content) {
    Zotero.AI4Paper.showProgressWindow(2000, "❌ 填写不规范【AI4paper】", "【用户问题】和【AI 回复】均不可为空，请重新填写！");
    return;
  }
  let msgArr = [];
  // 用户
  let userMessage = {
    "role": "user",
    "content": question,
    "prompt": "",
    "fulltext": "",
    "fileID": "",
    "service": serviceName || "AI",
    "model": model || ""
  };
  msgArr.push(userMessage);
  // AI
  let assistantMessage = {
    "role": "assistant",
    "content": response_content
  };
  msgArr.push(assistantMessage);

  // 返回数据
  this.io.dataOut = {
    msgArr,
    question
  };
  window.close();
};
methodsBody.checkKeyEnter = function (keys) {
  if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
    keys.returnValue = false;
    if (keys.preventDefault) {
      keys.preventDefault();
    }
    methodsBody.acceptSelection();
  }
};
methodsBody.setContextMenu_service = function () {
  let inputBox = document.getElementById('inputBox-serviceName');

  // 右键显示历史词条
  inputBox.addEventListener('contextmenu', event => {
    event.preventDefault();
    event.stopPropagation();
    let popup = methodsBody.buildContextMenu_service();
    if (popup) {
      popup.openPopup(event.target, "after_start", 0, 0, false, false);
    }
  });
};
methodsBody.setContextMenu_model = function () {
  let inputBox = document.getElementById('inputBox-modelName');

  // 右键显示历史词条
  inputBox.addEventListener('contextmenu', event => {
    event.preventDefault();
    event.stopPropagation();
    let popup = methodsBody.buildContextMenu_model();
    if (popup) {
      popup.openPopup(event.target, "after_start", 0, 0, false, false);
    }
  });
};

/**
 * 服务 输入框右键菜单
 *
 * @param {} 
 * @param {} 
 * @returns {} 
 */
methodsBody.buildContextMenu_service = function (isInit) {
  let popup = document.querySelector("#serviceInputBox-contextmenu");
  if (!popup) {
    popup = window.document.createXULElement('menupopup');
    popup.id = 'serviceInputBox-contextmenu';
    document.documentElement.appendChild(popup);
    popup = document.documentElement.lastElementChild.firstElementChild;

    // 初始化创建右键菜单。否则第一次右键不会出现菜单。
    if (isInit) return;
  }
  let first = popup.firstElementChild;
  while (first) {
    first.remove();
    first = popup.firstElementChild;
  }
  let serviceList = Object.keys(Zotero.AI4Paper.gptServiceList()).filter(e => !e.includes("自定"));
  serviceList = [...serviceList, "Grok"];
  for (let e of serviceList) {
    let menuitem = document.createXULElement('menuitem');
    menuitem.label = e;
    menuitem.value = e;
    menuitem.addEventListener('command', () => {
      document.getElementById('inputBox-serviceName').value = e;
    });
    popup.appendChild(menuitem);
  }
  return popup;
};

/**
 * 模型 输入框右键菜单
 *
 * @param {} 
 * @param {} 
 * @returns {} 
 */
methodsBody.buildContextMenu_model = function (isInit) {
  let popup = document.querySelector("#modelInputBox-contextmenu");
  if (!popup) {
    popup = window.document.createXULElement('menupopup');
    popup.id = 'modelInputBox-contextmenu';
    document.documentElement.appendChild(popup);
    popup = document.documentElement.lastElementChild.firstElementChild;

    // 初始化创建右键菜单。否则第一次右键不会出现菜单。
    if (isInit) return;
  }
  let first = popup.firstElementChild;
  while (first) {
    first.remove();
    first = popup.firstElementChild;
  }
  let modelList = Zotero.AI4Paper.gptModelList;
  for (let e of modelList) {
    let menuitem = document.createXULElement('menuitem');
    menuitem.label = e;
    menuitem.value = e;
    menuitem.addEventListener('command', () => {
      document.getElementById('inputBox-modelName').value = e;
    });
    popup.appendChild(menuitem);
  }
  return popup;
};