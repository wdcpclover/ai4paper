var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());

  // 设置 Dialog 字体大小
  Zotero.ZoteroIF.setFontSize_Dialog(document.querySelector('dialog'), 0.92);

  // 显示相应的标题
  if (Zotero.ZoteroIF._action_removeRelatedItems) {
    document.getElementById("zotero-selectRelatedItems-intro").textContent = "选择要移除的关联文献";
    document.title = "移除关联文献";
  } else {
    document.getElementById("zotero-selectRelatedItems-intro").textContent = "选择要显示的关联文献";
    document.title = "选择关联文献";
  }
  this.io = window.arguments[0];
  var listbox = document.getElementById("zotero-selectRelatedItems-links");
  for (var i in this.io.dataIn) {
    var item = this.io.dataIn[i];
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
    checkbox.setAttribute("native", "true");
    itemNode.setAttribute("value", i);
    itemNode.append(checkbox);
    itemNode.addEventListener('click', event => {
      if (event.target == itemNode) {
        checkbox.checked = !checkbox.checked;
      }
    });
    listbox.append(itemNode);
  }

  // Check item if there is only one
  // if (listbox.itemCount === 1) {
  //     listbox.getItemAtIndex(0).firstElementChild.checked = true;
  // }

  // 聚焦
  document.getElementById("zotero-selectRelatedItems-links").focus();
};
methodsBody.selectAll = function (deselect) {
  var listbox = document.getElementById("zotero-selectRelatedItems-links");
  for (var i = 0; i < listbox.childNodes.length; i++) {
    listbox.childNodes[i].querySelector('checkbox').checked = !deselect;
  }
};
methodsBody.acceptSelection = function () {
  var listbox = document.getElementById("zotero-selectRelatedItems-links");
  var returnObject = false;
  this.io.dataOut = new Object();
  for (var i = 0; i < listbox.childNodes.length; i++) {
    var itemNode = listbox.childNodes[i];
    if (itemNode.querySelector('checkbox').checked) {
      this.io.dataOut[itemNode.getAttribute("value")] = itemNode.querySelector('checkbox').getAttribute("label");
      returnObject = true;
    }
  }
  if (!returnObject) this.io.dataOut = null;
};

/**
 * 最大宽度
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.maxWindowWidth = function () {
  try {
    // 获取屏幕尺寸
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // 获取当前窗口高度和垂直位置
    const currentHeight = window.outerHeight;
    const currentY = window.screenY;

    // 考虑多显示器情况，使用availWidth（可用宽度）
    const availWidth = window.screen.availWidth;
    const availLeft = window.screen.availLeft || 0;

    // 移动并调整窗口大小
    window.moveTo(availLeft, currentY);
    window.resizeTo(availWidth, currentHeight);
  } catch (e) {
    Zotero.ZoteroIF.showProgressWindow(3000, "❌ 窗口尺寸调整失败", "出错了！窗口尺寸调整遇到问题。");
  }
};

/**
 * 适合宽度
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.adjustWindowWidthPercent = function () {
  try {
    let screen_height = window.screen.height;
    // 不同屏幕尺寸，调整比例不同
    let ratio = parseInt(screen_height) <= 1000 ? 0.8 : 0.6;

    // 获取当前窗口高度和垂直位置
    const currentHeight = window.outerHeight;
    const currentY = window.screenY;

    // 考虑多显示器情况，使用availWidth（可用宽度）
    const availWidth = window.screen.availWidth;
    const availLeft = window.screen.availLeft || 0;

    // 计算新窗口宽度（屏幕宽度的60%）
    const newWidth = Math.round(availWidth * ratio);

    // 计算水平居中的X坐标
    // 居中公式：左边距 = 屏幕左边界 + (屏幕宽度 - 窗口宽度) / 2
    const centerX = availLeft + (availWidth - newWidth) / 2;

    // 移动并调整窗口大小
    window.moveTo(centerX, currentY);
    window.resizeTo(newWidth, currentHeight);
  } catch (e) {
    Zotero.ZoteroIF.showProgressWindow(3000, "❌ 窗口尺寸调整失败", "出错了！窗口尺寸调整遇到问题。");
  }
};