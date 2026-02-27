var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);

  // 根据 Zotero 版本调整样式
  Zotero.AI4Paper.updateTextAreaBox4ZoteroScheme(window);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  this.io = window.arguments[0];

  // 注册快捷键
  methodsBody.registerShortcuts();

  // 载入模板条目
  methodsBody.updateTemplate(true);

  // 默认显示“选择模板”
  methodsBody.updateButtonStatus("templateItems");

  // 初始化右键菜单
  methodsBody.buildContextMenu(null, true);

  // 聚焦 listbox
  document.getElementById("richlistbox-elem").focus();
};

// 快捷键切换视图

methodsBody.switchView = function () {
  if (document.getElementById("view-button-templateItems").getAttribute("default") === 'true') {
    methodsBody.updateButtonStatus('setTemplate');
  } else {
    methodsBody.updateButtonStatus('templateItems');
  }
};

/**
 * 清空列表
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.clearListbox = function () {
  var listbox = document.getElementById("richlistbox-elem");

  // 先清空列表
  let first = listbox.firstElementChild;
  while (first) {
    first.remove();
    first = listbox.firstElementChild;
  }
};

/**
 * 创建 ItemNodes
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.buildItemNodes = function (listData) {
  var listbox = document.getElementById("richlistbox-elem");
  for (var i in listData) {
    var item = listData[i];
    var title,
      checked = false;
    if (item && typeof item == "object" && item.title !== undefined) {
      title = item.title;
      checked = !!item.checked;
    } else {
      title = item;
    }
    let itemNode = document.createXULElement("richlistitem");
    let checkbox = document.createXULElement("checkbox");
    itemNode.style.fontSize = "14px";
    itemNode.style.whiteSpace = "nowrap";
    checkbox.checked = checked;
    checkbox.label = title;
    checkbox.setAttribute("native", "true"); // 必要
    itemNode.setAttribute("value", i);
    itemNode.append(checkbox);
    itemNode.addEventListener('click', event => {
      // 右键菜单；不让右击触发 checkbox
      if (event.button === 2) {
        let popup = methodsBody.buildContextMenu(event, false);
        if (popup) {
          popup.openPopup(itemNode, "after_start", 70, 0, false, false);
        }
        return;
      }
      if (event.target == itemNode) {
        checkbox.checked = !checkbox.checked;
      }
      if (checkbox.checked) {
        methodsBody.singleSelect(checkbox);
      }
    });
    listbox.append(itemNode);
  }
  if (listbox.itemCount === 1) {
    listbox.getItemAtIndex(0).firstElementChild.checked = true;
  }
};

/**
 * 创建右键菜单
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.buildContextMenu = function (event, isInit) {
  let popup = document.querySelector("#setCommentTemplate-richlistitem-contextmenu");
  if (!popup) {
    popup = window.document.createXULElement('menupopup');
    popup.id = 'setCommentTemplate-richlistitem-contextmenu';
    document.documentElement.appendChild(popup);
    popup = document.documentElement.lastElementChild.firstElementChild;

    // 初始化创建右键菜单。否则第一次右键不会出现菜单。
    if (isInit) return;
  }
  let itemInfo = event.target.closest('richlistitem')?.querySelector('checkbox').label;
  let first = popup.firstElementChild;
  while (first) {
    first.remove();
    first = popup.firstElementChild;
  }

  // 置顶
  let menuitem = window.document.createXULElement('menuitem');
  menuitem.setAttribute('label', "拷贝模板");
  menuitem.addEventListener('command', () => {
    Zotero.AI4Paper.copy2Clipboard(itemInfo);
  });
  popup.appendChild(menuitem);
  return popup;
};

/**
 * 刷新按钮选中状态
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.updateButtonStatus = function (buttonType) {
  let buttonTypes = ["templateItems", "setTemplate"];
  for (let type of buttonTypes) {
    document.getElementById(`view-button-${type}`).setAttribute("default", type === buttonType ? true : false);
    document.getElementById(`vbox-${type}`).hidden = type === buttonType ? false : true;
  }

  // 强制聚焦，否则在 Zotero 8 中会因为切换视图失焦
  if (buttonType === "templateItems") {
    document.getElementById("richlistbox-elem").focus();
  } else {
    document.getElementById("textarea-annotationCommentTemplate").focus();
  }
};

/**
 * 注册快捷键
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.registerShortcuts = function () {
  // 视图切换快捷键监听事件
  if (!document._switchViewShortcutsAdded) {
    document._switchViewShortcutsAdded = true;
    document.addEventListener('keydown', event => {
      // Mac
      if (Zotero.isMac) {
        if (event.key === 't' && !event.ctrlKey && !event.shiftKey && !event.altKey && event.metaKey) {
          methodsBody.switchView();
        }
      }
      // Win/Linux
      else {
        // CMD/Ctrl T 切换视图
        if (event.key === 't' && event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          methodsBody.switchView();
        }
      }
    });
  }
};

// 单选

methodsBody.singleSelect = function (_checkbox) {
  var listbox = document.getElementById("richlistbox-elem");
  let num = 0;
  for (var i = 0; i < listbox.childNodes.length; i++) {
    let checkbox = listbox.childNodes[i].querySelector('checkbox');
    if (checkbox != _checkbox) {
      checkbox.checked = false;
    }
  }
};
methodsBody.acceptSelection = function () {
  var listbox = document.getElementById("richlistbox-elem");
  var returnObject = false;
  this.io.dataOut = null;
  for (var i = 0; i < listbox.childNodes.length; i++) {
    var itemNode = listbox.childNodes[i];
    if (itemNode.firstElementChild.checked) {
      this.io.dataOut = itemNode.firstElementChild.getAttribute("label");
      returnObject = true;
    }
  }
  if (!returnObject) this.io.dataOut = null;
};
methodsBody.updateTemplate = function (isInit) {
  if (isInit) {
    document.getElementById("textarea-annotationCommentTemplate").value = Zotero.Prefs.get("ai4paper.annotationCommentTemplate");
  } else {
    Zotero.Prefs.set("ai4paper.annotationCommentTemplate", document.getElementById("textarea-annotationCommentTemplate").value);
  }
  methodsBody.parseTemplate();
};
methodsBody.parseTemplate = function () {
  let listData = [];
  let template_str = Zotero.Prefs.get("ai4paper.annotationCommentTemplate");
  if (template_str) {
    // 考虑 dataview 变量后 的 :: 可能跟着空格，因此这里不剔除。listData = template_str.split('\n').map(e => e.trim()).filter(e => e != "");
    listData = template_str.split('\n').filter(e => e != "" && e.trim() != "");
    // 清空列表
    methodsBody.clearListbox();
    // 显示模板条目
    methodsBody.buildItemNodes(listData);
  }
};