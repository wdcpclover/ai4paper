var importAnnotationsAdvanced = function () {};
importAnnotationsAdvanced.init = async function () {
  // 添加事件
  if (!document._eventAdded) {
    document._eventAdded = true;
    importAnnotationsAdvanced.addListener2SearchButton();
    await Zotero.Promise.delay(15);
    importAnnotationsAdvanced.setContextMenu();
  }

  // 按下 esc 关闭窗口
  if (!document._escShortcutsAdded) {
    document._escShortcutsAdded = true;
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        // 清空已选择条目
        Zotero.ZoteroIF._dataOut_selectedItemsAdvancedSearch = [];
        window.close();
      }
    });
  }

  // 初始化右键菜单
  importAnnotationsAdvanced.initContextMenu();

  // 如果有载入标签（指的跳转【导入注释】，批量删除/重命名标签，聚合标签卡片），则自动执行搜索
  if (document.getElementById('zotero-search-box').querySelector('input').value.trim()) {
    document.getElementById('search-button').click();
  }
};

// 初始化右键菜单。如果不先做这一步，第一次打开窗口，需要右键两次。
importAnnotationsAdvanced.initContextMenu = function () {
  let popup = document.querySelector("#inputBox-contextmenu");
  if (!popup) {
    popup = window.document.createXULElement('menupopup');
    popup.id = 'inputBox-contextmenu';
    document.documentElement.appendChild(popup);
  }
};

// 设置搜索框右键显示字条等。注意，如果点击➕ 新增了更多条件，则无法适用。
importAnnotationsAdvanced.setContextMenu = function () {
  let _searchBox = document.getElementById('zotero-search-box');
  let inputBox = _searchBox.querySelector('input');
  if (!inputBox) {
    return;
  }

  // 右键显示历史词条
  inputBox.addEventListener('contextmenu', event => {
    event.preventDefault();
    event.stopPropagation();
    let popup = importAnnotationsAdvanced.buildContextMenu();
    if (popup) {
      popup.openPopup(event.target, "after_start", 0, 0, false, false);
    }
  });

  // 搜索框按 enter 也会触发搜索，因此需要监听该动作
  inputBox.addEventListener('keydown', keys => {
    if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
      // keys.returnValue = false;
      // if (keys.preventDefault) {
      //     keys.preventDefault();
      // }
      let textSearch = document.getElementById('zotero-search-box').querySelector('input').value;
      if (textSearch) {
        // 存储搜索记录
        Zotero.ZoteroIF.updateImportAnnotationsAdvancedSearchHistory(textSearch);
      }
    }
  });
};

// 创建右键菜单
importAnnotationsAdvanced.buildContextMenu = function () {
  let searchTextHistory = Zotero.Prefs.get('zoteroif.importAnnotationsAdvancedHistory').split('😊🎈🍓');
  // 如果无搜索记录，则返回。
  if (searchTextHistory.length === 1 && searchTextHistory[0] === '') {
    return false;
  }
  let popup = document.querySelector("#inputBox-contextmenu");
  if (!popup) {
    popup = window.document.createXULElement('menupopup');
    popup.id = 'inputBox-contextmenu';
    document.documentElement.appendChild(popup);
    popup = document.documentElement.lastElementChild.firstElementChild;
  }
  let first = popup.firstElementChild;
  while (first) {
    first.remove();
    first = popup.firstElementChild;
  }
  for (let historyText of searchTextHistory) {
    let fullText = historyText;
    let menuitem = window.document.createXULElement('menuitem');
    if (historyText.length > 30) {
      historyText = `${historyText.substring(0, 29)}...`;
    }
    menuitem.setAttribute('label', historyText);
    menuitem.setAttribute('tooltiptext', fullText); // 显示完整文本
    menuitem.addEventListener('command', () => {
      document.getElementById('zotero-search-box').querySelector('input').value = fullText;
    });
    popup.appendChild(menuitem);
  }
  return popup;
};

// 监听按下搜索按钮这个动作
importAnnotationsAdvanced.addListener2SearchButton = function () {
  let searchButton = document.getElementById('search-button');
  searchButton.addEventListener("click", event => {
    let textSearch = document.getElementById('zotero-search-box').querySelector('input').value;
    if (textSearch) {
      // 存储搜索记录
      Zotero.ZoteroIF.updateImportAnnotationsAdvancedSearchHistory(textSearch);
    }
  });
};