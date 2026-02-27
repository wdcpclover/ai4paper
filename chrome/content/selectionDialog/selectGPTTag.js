var methodsBody = function () {};
methodsBody.init = async function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());

  // 设置 Dialog 字体大小
  Zotero.ZoteroIF.setFontSize_Dialog(document.querySelector('dialog'), 0.92);

  // 视图切换快捷键监听事件
  if (!document._switchViewShortcutsAdded) {
    document._switchViewShortcutsAdded = true;
    document.addEventListener('keydown', event => {
      // Mac
      if (Zotero.isMac) {
        if (event.key === 'd' && !event.ctrlKey && !event.shiftKey && !event.altKey && event.metaKey) {
          methodsBody.switchTagsTypeView();
        }
        if (event.key === 'f' && !event.ctrlKey && !event.shiftKey && !event.altKey && event.metaKey) {
          document.getElementById('searchBox-elem').focus();
        }
      }
      // Win/Linux
      else {
        // CMD/Ctrl D 切换标签类型
        if (event.key === 'd' && event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          methodsBody.switchTagsTypeView();
        }
        // CMD/Ctrl F 聚焦搜索框
        if (event.key === 'f' && event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          document.getElementById('searchBox-elem').focus();
        }
      }
    });
  }
  if (Zotero.ZoteroIF.lasttaginput) {
    document.getElementById('searchBox-elem').placeholder = Zotero.ZoteroIF.lasttaginput;
  }
  // 双击跳转
  document.getElementById("cardNotes-doubleClick-enable").checked = Zotero.Prefs.get('zoteroif.selectTagsDoubleClick');
  this.io = window.arguments[0];
  let listData;

  // 面板记忆
  let lastPane = Zotero.ZoteroIF.lastGPTNoteTagsPane;
  if (lastPane === 'gptNoteTagsPane') {
    listData = Zotero.ZoteroIF.returnGPTNoteTags();
    methodsBody.updateTagsNumMessage(listData, "gptNoteTag");
    methodsBody.updateButtonStatus("gptNoteTag");
  } else if (lastPane === 'recentTagsPane') {
    listData = Zotero.Prefs.get('zoteroif.recentlyaddedGPTNoteTags').split('😊🎈🍓');
    if (listData.length === 1 && listData[0] === '') {
      listData = [];
    }
    methodsBody.updateTagsNumMessage(listData, "recentTag");
    methodsBody.updateButtonStatus("recentTag");
  } else {
    listData = Zotero.ZoteroIF.returnGPTNoteTags();
    methodsBody.updateTagsNumMessage(listData, "gptNoteTag");
    methodsBody.updateButtonStatus("gptNoteTag");
  }

  // 清空列表
  methodsBody.clearListbox();

  // 创建列表
  methodsBody.buildItemNodes(listData);

  // 刷新首字母过滤按钮
  methodsBody.updateFilterButtons(true);

  // 聚焦
  await Zotero.Promise.delay(10);
  document.getElementById("selectedTags-inputBox-elem").focus();
  document.getElementById("searchBox-elem").focus();
  document.getElementById("selectedTags-inputBox-elem").focus();
};
methodsBody.showGPTNoteTags = function (isUpdate) {
  // 刷新按钮选中状态
  methodsBody.updateButtonStatus("gptNoteTag");

  // 获取数据
  let listData = Zotero.ZoteroIF.returnGPTNoteTags();

  // 先清空列表
  methodsBody.clearListbox();

  // 创建列表
  methodsBody.buildItemNodes(listData);

  // 刷新信息显示
  if (!isUpdate) {
    methodsBody.updateTagsNumMessage(listData, "gptNoteTag");
  } else {
    document.getElementById('message-label').textContent = `刷新完成，共有【${listData.length}】个 GPT 笔记标签`;
  }

  // 刷新首字母过滤按钮
  methodsBody.updateFilterButtons(true);
};

// 首字母 A-Z 过滤

methodsBody.filter = function (filter) {
  // 刷新首字母过滤按钮
  methodsBody.updateFilterButtons(null, filter);
  let listData = Zotero.ZoteroIF.returnGPTNoteTagsFilter(filter);
  methodsBody.updateButtonStatus("gptNoteTag");

  // 先清空列表
  methodsBody.clearListbox();

  // 创建列表
  methodsBody.buildItemNodes(listData);
  filter = filter === 'OT' ? '#' : filter;
  document.getElementById('message-label').textContent = `${filter}：包含【${listData.length}】个 GPT 笔记标签`;
};

// 刷新 GPT 笔记标签

methodsBody.updateTags = async function () {
  let items = await Zotero.Tags.getAll(1);
  if (items.length === 0) {
    Zotero.ZoteroIF.showProgressWindow(3000, "❌ 未发现标签【AI4paper】", "未在【我的文库】中发现任何标签！");
    return;
  }
  document.getElementById('gptNoteTagType-image').setAttribute("src", `chrome://zoteroif/content/icons/robot.png`);
  document.getElementById('message-label').textContent = `正在刷新 GPT 笔记标签，右下角查看进度...`;
  let taskName = `_selectGPTNoteTags_update_gptNoteTag`;
  let description = " GPT 笔记标签";

  // 赋值等一些设置，使用通用接口。
  Zotero.ZoteroIF.progressPercent_initProgress(items, taskName, description);
  // 注意函数的命名
  methodsBody.update_gptNoteTag_checkNext(taskName, description);
};
methodsBody.update_gptNoteTag_checkNext = async function (taskName, description) {
  Zotero.ZoteroIF[`numberOfUpdatedItems${taskName}`]++;
  if (Zotero.ZoteroIF[`current${taskName}`] == Zotero.ZoteroIF[`toUpdate${taskName}`] - 1) {
    Zotero.ZoteroIF[`progressWindow${taskName}`].close();
    Zotero.ZoteroIF.progressPercent_resetState(null, taskName, description);
    Zotero.Prefs.set('zoteroif.gptnotetagsrecent', JSON.stringify(Zotero.ZoteroIF[`_progressData_${taskName}`]));
    methodsBody.showGPTNoteTags(true);
    return;
  }

  // 刷新进度百分比。使用通用接口
  Zotero.ZoteroIF.progressPercent_updatePercent(taskName, "检查所有标签： ");
  methodsBody.update_gptNoteTag_checkTag(Zotero.ZoteroIF[`itemsToUpdate${taskName}`][Zotero.ZoteroIF[`current${taskName}`]], taskName, description);
};
methodsBody.update_gptNoteTag_checkTag = async function (librayTag, taskName, description) {
  try {
    let check = await Zotero.ZoteroIF.checkGPTNoteTag(librayTag.tag);
    if (check) {
      let tag = librayTag.tag;
      let type = 0;
      let tagInfo = {
        tag,
        type
      };
      if (!JSON.stringify(Zotero.ZoteroIF[`_progressData_${taskName}`]).includes(JSON.stringify(tagInfo))) {
        Zotero.ZoteroIF[`_progressData_${taskName}`].push(tagInfo);
        Zotero.ZoteroIF[`counter${taskName}`]++;
      }
    }
  } catch (e) {
    Zotero.debug(e);
  }
  methodsBody.update_gptNoteTag_checkNext(taskName, description);
};
methodsBody.recentTags = function () {
  // 刷新按钮选中状态
  methodsBody.updateButtonStatus("recentTag");
  let listData = Zotero.Prefs.get('zoteroif.recentlyaddedGPTNoteTags').split('😊🎈🍓');
  if (listData.length === 1 && listData[0] === '') {
    listData = [];
  }

  // 刷新信息显示
  methodsBody.updateTagsNumMessage(listData, "recentTag");

  // 先清空列表
  methodsBody.clearListbox();

  // 创建列表
  methodsBody.buildItemNodes(listData);

  // 刷新首字母过滤按钮
  methodsBody.updateFilterButtons(true);
};

// 搜索

methodsBody.search = function () {
  var textSearch = document.getElementById('searchBox-elem').value.trim();
  if (textSearch === '' && document.getElementById('searchBox-elem').placeholder === '') {
    return false;
  } else if (textSearch === '' && document.getElementById('searchBox-elem').placeholder != '') {
    textSearch = document.getElementById('searchBox-elem').placeholder;
    document.getElementById('searchBox-elem').value = document.getElementById('searchBox-elem').placeholder;
  }
  document.getElementById('searchBox-elem').placeholder = textSearch;
  Zotero.ZoteroIF.lasttaginput = textSearch;
  let listData = Zotero.ZoteroIF.returnGPTNoteTagsSearch(textSearch);
  methodsBody.updateButtonStatus("gptNoteTag");

  // 先清空列表
  methodsBody.clearListbox();

  // 创建列表
  methodsBody.buildItemNodes(listData);
  document.getElementById('message-label').textContent = `搜索【${textSearch}】：共有【${listData.length}】个 GPT 笔记标签`;

  // 刷新首字母过滤按钮
  methodsBody.updateFilterButtons(true);
};

// Enter 搜索

methodsBody.checkKeyEnter = function (keys) {
  if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
    keys.returnValue = false;
    if (keys.preventDefault) {
      keys.preventDefault();
    }
    methodsBody.search();
  }
};

// accept

methodsBody.acceptSelection = function () {
  var returnObject = false;
  if (document.getElementById('selectedTags-inputBox-elem').value === '') {
    this.io.dataOut = null;
    return false;
  } else {
    this.io.dataOut = document.getElementById('selectedTags-inputBox-elem').value;
    let image = document.getElementById('gptNoteTagType-image');
    if (image.getAttribute("src") === `chrome://zoteroif/content/icons/robot.png`) {
      Zotero.ZoteroIF.lastGPTNoteTagsPane = 'gptNoteTagsPane';
    } else if (image.getAttribute("src") === `chrome://zoteroif/content/icons/recentTag.png`) {
      Zotero.ZoteroIF.lastGPTNoteTagsPane = 'recentTagsPane';
    } else {
      Zotero.ZoteroIF.lastGPTNoteTagsPane = 'gptNoteTagsPane';
    }
  }
};
methodsBody.handleCheckboxChange = function (checkbox) {
  // var checkbox = event.target;
  var isChecked = checkbox.checked;
  //   var checkboxId = checkbox.id;

  let tagName = checkbox.label;
  tagName = tagName.indexOf("🤖️/") === 0 ? tagName.substring(4) : tagName;
  var oldValue = document.getElementById('selectedTags-inputBox-elem').value;
  if (isChecked) {
    if (oldValue === '') {
      document.getElementById('selectedTags-inputBox-elem').value = `🏷️${tagName}`;
    } else {
      if (oldValue.trim().indexOf('🏷️') != 0) {
        oldValue = `🏷️${oldValue.trim()}`;
      }
      let oldValueArray = oldValue.substring(3).split('🏷️');
      for (let i = 0; i < oldValueArray.length; i++) {
        if (oldValueArray[i] === tagName) {
          return false;
        }
      }
      document.getElementById('selectedTags-inputBox-elem').value = `${oldValue}🏷️${tagName}`;
    }
  } else {
    if (oldValue != '') {
      if (oldValue.trim().indexOf('🏷️') != 0) {
        oldValue = `🏷️${oldValue.trim()}`;
      }
      let oldValueArray = oldValue.substring(3).split('🏷️');
      for (let i = 0; i < oldValueArray.length; i++) {
        if (oldValueArray[i] === tagName) {
          oldValueArray.splice(i, 1);
          document.getElementById('selectedTags-inputBox-elem').value = `${oldValueArray.join('🏷️') ? '🏷️' + oldValueArray.join('🏷️') : oldValueArray.join('🏷️')}`;
        }
      }
    }
  }
};
methodsBody.clearSelectedTags = function () {
  document.getElementById('selectedTags-inputBox-elem').value = '';
  var listbox = document.getElementById("richlistbox-elem");
  for (var i = 0; i < listbox.childNodes.length; i++) {
    var itemNode = listbox.childNodes[i].firstElementChild;
    itemNode.checked = false;
  }
};
methodsBody.checkTagSelected = function (tagName) {
  tagName = tagName.indexOf("🤖️/") === 0 ? tagName.substring(4) : tagName;
  var oldValue = document.getElementById('selectedTags-inputBox-elem').value;
  if (oldValue != '') {
    let oldValueArray = oldValue.substring(3).split('🏷️');
    for (let i = 0; i < oldValueArray.length; i++) {
      if (oldValueArray[i] === tagName) {
        return true;
      }
    }
  }
  return false;
};

// 双击跳转

methodsBody.quickJump = function (tag_Name) {
  if (!Zotero.Prefs.get('zoteroif.selectTagsDoubleClick')) return; // 未启用双击跳转

  Zotero.ZoteroIF.tagGPTCardNotes(tag_Name);
};
methodsBody.run = function () {
  Zotero.Prefs.set('zoteroif.selectTagsDoubleClick', document.getElementById("cardNotes-doubleClick-enable").checked);
};

/**
 * 创建 ItemNodes
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.buildItemNodes = function (listData) {
  var listbox = document.getElementById("richlistbox-elem");

  // 如果 tagsNames 为数组，这里 i 为 0 1 2 3... 索引数字
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
    checkbox.label = title;
    checkbox.setAttribute("native", "true"); // 必要
    itemNode.setAttribute("value", i);
    itemNode.append(checkbox);
    itemNode.addEventListener('click', event => {
      if (event.target == itemNode) {
        // 点击的是按钮 checkbox 右侧的地方，则 checkbox 状态不会自动变，需要此命令改变状态。
        checkbox.checked = !checkbox.checked;
      }
      // 如果点击的是 checkbox，会自动切换状态。
      methodsBody.handleCheckboxChange(checkbox);

      // // Shift 单击：检索所属文献。因为有两个模态窗口，因此不适合加。
      // if (event.shiftKey) {
      // 	window.close();
      //     let tagName = event.target.closest('richlistitem')?.querySelector('checkbox').label;
      //     // 可能是最近标签，需要做处理
      //     tagName = tagName.indexOf("🤖️/") != 0 ? `🤖️/${tagName}` : tagName;
      // 	Zotero.ZoteroIF.showItemsBasedOnTag();
      // 	return;
      // }
    });
    if (methodsBody.checkTagSelected(title)) {
      checked = true;
    }
    checkbox.checked = checked;
    var clickCount = 0;
    var clickTimer;
    itemNode.addEventListener('click', function (event) {
      clickCount++;
      if (clickCount === 1) {
        // 如果第一次点击，则设置一个定时器来等待第二次点击
        clickTimer = setTimeout(function () {
          clickCount = 0; // 重置点击计数
        }, 300); // 等待第二次点击的时间间隔，单位毫秒
      } else if (clickCount === 2) {
        // 如果第二次点击发生，执行双击操作
        clearTimeout(clickTimer); // 清除定时器
        clickCount = 0; // 重置点击计数

        // 在这里执行双击的操作
        let _label = event.target.closest('richlistitem')?.querySelector('checkbox').label;
        methodsBody.quickJump(_label);
      }
    });
    listbox.append(itemNode);
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
 * 刷新标签数量信息显示，以及图标
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.updateTagsNumMessage = function (listData, tagType) {
  let tagType_description = {
    "gptNoteTag": " GPT 笔记标签",
    "recentTag": "最近标签"
  };

  // 文字信息
  document.getElementById("message-label").textContent = `共有【${listData.length}】个${tagType_description[tagType]}`;
  // 刷新图标
  document.getElementById('gptNoteTagType-image').setAttribute("src", `chrome://zoteroif/content/icons/${tagType === "gptNoteTag" ? "robot" : tagType}.png`);
};

/**
 * 刷新按钮选中状态
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.updateButtonStatus = function (buttonType) {
  // item 条目标签
  let buttonTypes = ["gptNoteTag", "recentTag"];
  // 刷新按钮
  for (let elem of buttonTypes) {
    if (elem === buttonType) {
      // 加上 ? 防止报错
      document.getElementById(`${elem}Button`)?.setAttribute("default", true);
    } else {
      document.getElementById(`${elem}Button`)?.setAttribute("default", false);
    }
  }
  // 刷新图标
  document.getElementById('gptNoteTagType-image').setAttribute("src", `chrome://zoteroif/content/icons/${buttonType === "gptNoteTag" ? "robot" : buttonType}.png`);
};

/**
 * 刷新过滤按钮的状态，比如图片路径、悬停放大效果。
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.updateFilterButtons = function (isInit, filter) {
  let characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'OT'];
  for (let character of characters) {
    let image = document.getElementById(`tagFilter-${character}`);
    // 未点击状态
    let defaultImamgePath = `chrome://zoteroif/content/icons/${character}.png`;
    // 点击状态
    let selectedImamgePath = `chrome://zoteroif/content/icons/${character}-select.png`;

    // 初始化
    if (isInit) {
      image.setAttribute("src", defaultImamgePath);
      image.onmouseover = () => image.style.transform = "scale(1.3)";
      image.onmouseout = () => image.style.transform = "scale(1)";
    }
    // 非初始化
    else {
      if (character === filter) {
        image.setAttribute("src", selectedImamgePath);
        image.style.transform = "scale(1)";
        image.onmouseover = () => {};
        image.onmouseout = () => {};
      } else {
        image.setAttribute("src", defaultImamgePath);
        image.onmouseover = () => image.style.transform = "scale(1.3)";
        image.onmouseout = () => image.style.transform = "scale(1)";
      }
    }
  }
};

// 快捷键切换标签类型

methodsBody.switchTagsTypeView = function () {
  let buttonTypes = ["gptNoteTag", "recentTag"];
  for (let i = 0; i < buttonTypes.length; i++) {
    if (document.getElementById(`${buttonTypes[i]}Button`).getAttribute("default") === 'true') {
      let index = i === 1 ? 0 : i + 1;
      document.getElementById(`${buttonTypes[index]}Button`).click();
      return;
    }
  }
};