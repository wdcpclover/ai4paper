/**
 * AI4Paper Dialog Utilities
 *
 * 提取自 selectionDialog/ 下多个对话框文件的公共工具函数，
 * 减少重复代码，统一维护。
 */
Object.assign(Zotero.AI4Paper, {
  DialogUtils: {
    getWindow: function () {
      try {
        if (typeof Services !== 'undefined') {
          let activeWindow = Services.focus && Services.focus.activeWindow;
          if (activeWindow && activeWindow.document) return activeWindow;
          let dialogWindow = Services.wm && (Services.wm.getMostRecentWindow('zoteroone-windowType-selectRefs')
            || Services.wm.getMostRecentWindow('zoteroone-windowType-selectCiting')
            || Services.wm.getMostRecentWindow(null));
          if (dialogWindow && dialogWindow.document) return dialogWindow;
        }
      } catch (e) {}
      return window;
    },
    getDocument: function () {
      return this.getWindow().document;
    },

    // ==================== Phase 1: Richlistbox 列表操作 ====================

    /**
     * 清空 richlistbox 列表
     * @param {Element|string} listboxOrId - richlistbox 元素或其 ID
     */
    clearListbox: function (listboxOrId) {
      const doc = this.getDocument();
      let listbox = typeof listboxOrId === 'string'
        ? doc.getElementById(listboxOrId)
        : listboxOrId;
      if (!listbox) return;
      let first = listbox.firstElementChild;
      while (first) {
        first.remove();
        first = listbox.firstElementChild;
      }
    },

    /**
     * 获取 richlistbox 中已勾选的 checkbox 项
     * @param {Element|string} listboxOrId - richlistbox 元素或其 ID
     * @returns {Array<{value: string, label: string}>} 已勾选项数组
     */
    getCheckedItems: function (listboxOrId) {
      const doc = this.getDocument();
      let listbox = typeof listboxOrId === 'string'
        ? doc.getElementById(listboxOrId)
        : listboxOrId;
      if (!listbox) return [];
      let result = [];
      for (let i = 0; i < listbox.childNodes.length; i++) {
        let node = listbox.childNodes[i];
        let checkbox = node.querySelector('checkbox');
        if (checkbox && checkbox.checked) {
          result.push({
            value: node.getAttribute('value'),
            label: checkbox.getAttribute('label')
          });
        }
      }
      return result;
    },

    /**
     * 全选/取消全选 richlistbox 中的 checkbox
     * @param {Element|string} listboxOrId - richlistbox 元素或其 ID
     * @param {boolean} deselect - true=取消全选, false=全选
     * @param {Object} [opts] - 选项
     * @param {boolean} [opts.skipHidden] - 全选时跳过隐藏项
     * @returns {number} 被跳过的隐藏项数量
     */
    selectAll: function (listboxOrId, deselect, opts) {
      const doc = this.getDocument();
      let listbox = typeof listboxOrId === 'string'
        ? doc.getElementById(listboxOrId)
        : listboxOrId;
      if (!listbox) return 0;
      let skipped = 0;
      for (let i = 0; i < listbox.childNodes.length; i++) {
        let node = listbox.childNodes[i];
        node.querySelector('checkbox').checked = !deselect;
        if (!deselect && opts && opts.skipHidden && node.style.display === 'none') {
          node.querySelector('checkbox').checked = false;
          skipped++;
        }
      }
      return skipped;
    },

    // ==================== Phase 2: 右键菜单构建 ====================

    /**
     * 创建/获取 menupopup 右键菜单并清空内容
     * @param {string} menuId - menupopup 的 ID
     * @param {boolean} initOnly - 仅创建不清空（首次初始化用）
     * @returns {Element|undefined} menupopup 元素，initOnly 时可能返回 undefined
     */
    initMenuPopup: function (menuId, initOnly) {
      const doc = this.getDocument();
      let menu = doc.querySelector('#' + menuId);
      if (!menu) {
        menu = doc.createXULElement('menupopup');
        menu.id = menuId;
        doc.documentElement.appendChild(menu);
        if (initOnly) return;
      }
      let child = menu.firstElementChild;
      while (child) {
        child.remove();
        child = menu.firstElementChild;
      }
      return menu;
    },

    /**
     * 向 menupopup 添加菜单项
     * @param {Element} menu - menupopup 元素
     * @param {string} label - 菜单项文本
     * @param {Function} handler - command 事件处理函数
     * @returns {Element} 创建的 menuitem 元素
     */
    addMenuItem: function (menu, label, handler) {
      let item = menu.ownerDocument.createXULElement('menuitem');
      item.setAttribute('label', label);
      item.addEventListener('command', handler);
      menu.appendChild(item);
      return item;
    },

    /**
     * 向 menupopup 添加分隔线
     * @param {Element} menu - menupopup 元素
     * @returns {Element} 创建的 menuseparator 元素
     */
    addMenuSeparator: function (menu) {
      let sep = menu.ownerDocument.createXULElement('menuseparator');
      menu.appendChild(sep);
      return sep;
    },

    /**
     * 创建/获取 panel 型右键菜单并清空内容
     * @param {string} panelId - panel 的 ID
     * @param {Object} [opts] - 选项
     * @param {string} [opts.width] - panel 宽度 (如 "500px")
     * @param {boolean} initOnly - 仅创建不清空
     * @returns {Element|undefined} panel 元素
     */
    initContextPanel: function (panelId, opts, initOnly) {
      const doc = this.getDocument();
      let panel = doc.querySelector('#' + panelId);
      if (!panel) {
        panel = doc.createXULElement('panel');
        panel.id = panelId;
        if (opts && opts.width) panel.style.width = opts.width;
        panel.setAttribute('type', 'arrow');
        doc.documentElement.appendChild(panel);
        if (initOnly) return;
      }
      let child = panel.firstElementChild;
      while (child) {
        child.remove();
        child = panel.firstElementChild;
      }
      return panel;
    },

    /**
     * 构建文献信息面板（用于 selectRefs / selectCiting 的右键菜单）
     * @param {Element} panel - panel 元素
     * @param {string} label - 当前条目的 checkbox label
     * @param {Object} callbacks - 回调函数
     * @param {Function} callbacks.onViewOnline - 点击查看在线时的回调
     * @returns {Element} 构建好的 panel
     */
    buildRefsInfoPanel: function (panel, label, callbacks) {
      const doc = panel.ownerDocument;
      let vbox = doc.createXULElement('vbox');
      vbox.style.flex = '1';
      let isDark = Zotero.getMainWindow()?.matchMedia('(prefers-color-scheme: dark)').matches;

      // 基本信息标题
      let infoHeader = doc.createXULElement('div');
      infoHeader.textContent = '🪪 基本信息';
      infoHeader.style = 'display: flex;justify-content: center;align-items: center;margin-bottom: 12px;border-radius: 5px;background-color: ' + (isDark ? '#3e3c3d' : '#fef1e5') + ';color: #fe6e08;padding: 6px;cursor: pointer;';
      infoHeader.addEventListener('click', () => callbacks.onViewOnline(label));
      vbox.appendChild(infoHeader);

      // 基本信息内容
      let infoDiv = doc.createXULElement('div');
      infoDiv.id = 'basicInfo_DIV';
      infoDiv.style = 'display: flex;border-radius: 6px;box-shadow: 0 0 1px #8a8a8a;padding: 6px;overflow-y: hidden;overflow-x: hidden;word-wrap: break-word;clear: both;white-space: pre-wrap;-ms-word-break:break-all;';
      infoDiv.addEventListener('dblclick', e => Zotero.AI4Paper.copy2Clipboard(e.target.textContent));
      vbox.appendChild(infoDiv);

      // 摘要标题
      let abstractHeader = doc.createXULElement('div');
      abstractHeader.textContent = '🕹️ 摘要';
      abstractHeader.style = 'display: flex;justify-content: center;align-items: center;margin: 12px 0;border-radius: 5px;background-color: ' + (isDark ? '#3e3c3d' : '#e6f8e9') + ';color: #2dac3e;padding: 6px;cursor: pointer;';
      abstractHeader.addEventListener('click', () => callbacks.onViewOnline(label));
      vbox.appendChild(abstractHeader);

      // 摘要内容
      let abstractDiv = doc.createXULElement('div');
      abstractDiv.id = 'abstract_DIV';
      abstractDiv.style = 'display: flex;border-radius: 6px;box-shadow: 0 0 1px #8a8a8a;padding: 6px;overflow-y: auto;overflow-x: hidden;word-wrap: break-word;clear: both;white-space: pre-wrap;-ms-word-break:break-all;';
      abstractDiv.textContent = '联网获取摘要中...';
      abstractDiv.addEventListener('dblclick', e => Zotero.AI4Paper.copy2Clipboard(e.target.textContent));
      vbox.appendChild(abstractDiv);

      // Connected Papers 按钮（仅当有 DOI 时）
      if (label.includes('🆔')) {
        let cpDiv = doc.createXULElement('div');
        cpDiv.id = 'connectedPapers_DIV';
        cpDiv.style = 'display: flex;justify-content: center;align-items: center;margin-top: 12px;border-radius: 5px;background-color: ' + (isDark ? '#3e3c3d' : '#e9f4ff') + ';color: #2c98f7;padding: 5px;cursor: pointer;';
        cpDiv.addEventListener('click', () => {
          let doi = Zotero.AI4Paper.extractDOIFromItemInfo(label);
          Zotero.getMainWindow().ZoteroPane.loadURI('https://connectedpapers.com/api/redirect/doi/' + doi);
        });
        let iconDiv = doc.createXULElement('div');
        iconDiv.style = 'cursor: pointer;';
        iconDiv.innerHTML = '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1"><g><title>Connected Papers</title><g id="svg_6"><g data-name="\u56fe\u5c42_1" id="_\u56fe\u5c42_1"><g id="svg_7"><circle fill="#57a8a9" r="3" cy="12.7" cx="4.9" class="cls-1" id="svg_1"/><circle fill="#57a8a9" r="2.2" cy="2.3" cx="10.8" class="cls-1" id="svg_2"/><circle fill="#57a8a9" r="1.5" cy="9.5" cx="12.7" class="cls-1" id="svg_3"/><rect fill="#57a8a9" transform="rotate(-14 -1.2 3)" height="6.2" width="0.4" y="6.2" x="10.4" class="cls-1" id="svg_4"/><rect fill="#57a8a9" transform="rotate(-60 -2.3 10.6)" height="0.4" width="8.7" y="17.7" x="1.4" class="cls-1" id="svg_5"/></g></g></g></g></svg>';
        cpDiv.appendChild(iconDiv);
        let cpLabel = doc.createXULElement('label');
        cpLabel.setAttribute('value', 'Connected Papers');
        cpLabel.style = 'cursor: pointer;';
        cpDiv.appendChild(cpLabel);
        vbox.appendChild(cpDiv);
      }

      panel.appendChild(vbox);
      return panel;
    },

    // ==================== Phase 3: Refs/Citing 共享工具 ====================

    /**
     * 最大化窗口宽度
     */
    maxWindowWidth: function () {
      try {
        const outerHeight = window.outerHeight,
          screenY = window.screenY,
          availWidth = window.screen.availWidth,
          availLeft = window.screen.availLeft || 0;
        window.moveTo(availLeft, screenY);
        window.resizeTo(availWidth, outerHeight);
      } catch (e) {
        Zotero.AI4Paper.showProgressWindow(3000, '❌ 窗口尺寸调整失败', '出错了！窗口尺寸调整遇到问题。');
      }
    },

    /**
     * 按比例调整窗口宽度（小屏80%，大屏60%）
     */
    adjustWindowWidthPercent: function () {
      try {
        let screenHeight = window.screen.height,
          ratio = parseInt(screenHeight) <= 1000 ? 0.8 : 0.6;
        const outerHeight = window.outerHeight,
          screenY = window.screenY,
          availWidth = window.screen.availWidth,
          availLeft = window.screen.availLeft || 0,
          targetWidth = Math.round(availWidth * ratio),
          targetLeft = availLeft + (availWidth - targetWidth) / 2;
        window.moveTo(targetLeft, screenY);
        window.resizeTo(targetWidth, outerHeight);
      } catch (e) {
        Zotero.AI4Paper.showProgressWindow(3000, '❌ 窗口尺寸调整失败', '出错了！窗口尺寸调整遇到问题。');
      }
    },

    /**
     * 在我的文库中定位并显示指定条目
     * @param {Element} elem - 包含 _itemID 属性的元素
     */
    showInMyLibrary: async function (elem) {
      let itemID = Number(elem.getAttribute('_itemID'));
      if (itemID === -1) return Zotero.AI4Paper.showProgressWindow(4000, '❌ 出错了', '条目 🆔 有误！'), false;
      let item = Zotero.Items.get(itemID);
      window.close();
      try {
        let collections = item.getCollections();
        if (collections.length) {
          Zotero.AI4Paper.getGlobal('Zotero_Tabs').select('zotero-pane');
          Zotero.AI4Paper.getGlobal('ZoteroPane_Local').collectionsView.selectCollection(collections[0]);
          let found = await Zotero.AI4Paper.getGlobal('ZoteroPane_Local').selectItem(itemID);
          found === false && Zotero.AI4Paper.showProgressWindow(4000, '未找到到该文献', '未在【我的文库】找到该文献，可能已经被您删除！');
        } else {
          Zotero.AI4Paper.getGlobal('Zotero_Tabs').select('zotero-pane');
          let found = await Zotero.AI4Paper.getGlobal('ZoteroPane_Local').selectItem(itemID);
          found === false && Zotero.AI4Paper.showProgressWindow(4000, '未找到到该文献', '未在【我的文库】找到该文献，可能已经被您删除！');
        }
      } catch (e) {
        return false;
      }
    },

    /**
     * 搜索 richlistbox（通过隐藏/显示条目实现过滤）
     * @param {string} listboxId - richlistbox 的 ID
     * @param {string} searchBoxId - 搜索框的 ID
     * @param {Object} opts - 选项
     * @param {string} opts.lastSearchKey - 存储上次搜索的 Zotero.AI4Paper 属性名
     * @param {string} opts.searchResultId - 显示搜索结果的元素 ID
     * @param {string} opts.backButtonId - "返回全部"按钮的 ID
     * @param {Function} opts.showAll - 显示全部的回调
     * @returns {number|false} 搜索到的条数，或 false 表示空搜索
     */
    searchRichlistbox: function (listboxId, searchBoxId, opts) {
      const doc = this.getDocument();
      let listbox = doc.getElementById(listboxId),
        searchBox = doc.getElementById(searchBoxId);
      if (!listbox || !searchBox) return false;
      let text = searchBox.value.trim();
      if (text === '' && searchBox.placeholder === '') {
        opts.showAll && opts.showAll();
        return false;
      }
      if (text === '' && searchBox.placeholder !== '') {
        text = searchBox.placeholder;
        searchBox.value = searchBox.placeholder;
      }
      Zotero.AI4Paper[opts.lastSearchKey] = text;
      text = text.toLowerCase();
      if (opts.backButtonId) {
        let backButton = doc.getElementById(opts.backButtonId);
        backButton && (backButton.style.display = '');
      }
      let count = 0;
      for (let i = 0; i < listbox.childNodes.length; i++) {
        let node = listbox.childNodes[i];
        let label = node.querySelector('checkbox').getAttribute('label');
        if (label.toLowerCase().indexOf(text) === -1) {
          node.style.display = 'none';
        } else {
          node.style.display = '';
          count++;
        }
      }
      if (opts.searchResultId) {
        let searchResult = doc.getElementById(opts.searchResultId);
        if (searchResult) {
          searchResult.style.display = '';
          searchResult.textContent = '【' + text + '】搜索：查询到【' + count + '】篇文献';
        }
      }
      return count;
    },

    /**
     * 显示 richlistbox 所有项（取消搜索过滤）
     * @param {string} listboxId - richlistbox 的 ID
     * @param {Object} opts - 选项
     * @param {string} opts.backButtonId - "返回全部"按钮的 ID
     * @param {string} opts.searchResultId - 搜索结果显示元素 ID
     */
    showAllRichlistboxItems: function (listboxId, opts) {
      const doc = this.getDocument();
      if (opts.backButtonId) {
        let backButton = doc.getElementById(opts.backButtonId);
        backButton && (backButton.style.display = 'none');
      }
      let listbox = doc.getElementById(listboxId);
      if (!listbox) return;
      if (opts.searchResultId) {
        let searchResult = doc.getElementById(opts.searchResultId);
        searchResult && (searchResult.style.display = 'none');
      }
      for (let i = 0; i < listbox.childNodes.length; i++) {
        listbox.childNodes[i].style.display = '';
      }
    },

    /**
     * 注册 richlistbox 滚动监听器（防抖保存滚动位置）
     * @param {string} listboxId - richlistbox 的 ID
     * @param {Function} saveCallback - 保存滚动位置的回调，参数为 scrollTop
     */
    registerScrollListener: function (listboxId, saveCallback) {
      const listbox = this.getDocument().getElementById(listboxId);
      if (!listbox) return;
      let timer;
      listbox.addEventListener('scroll', e => {
        clearTimeout(timer);
        timer = setTimeout(() => saveCallback(e.target.scrollTop), 100);
      });
    },

    /**
     * 滚动到 richlistbox 顶部或底部
     * @param {string} listboxId - richlistbox 的 ID
     * @param {boolean} toBottom - true=底部, false=顶部
     */
    scrollToTopOrBottom: function (listboxId, toBottom) {
      const listbox = this.getDocument().getElementById(listboxId);
      if (!listbox) return;
      setTimeout(() => {
        listbox.scrollTo({
          top: toBottom ? listbox.scrollHeight : 0,
          behavior: 'smooth'
        });
      }, 10);
    },

    /**
     * 同步偏好设置与 checkbox/input 控件
     * @param {Object} config - 配置
     * @param {Array<string>} config.checkboxKeys - checkbox 类型的 pref key 列表
     * @param {Array<string>} [config.inputKeys] - input 类型的 pref key 列表
     * @param {boolean} isLoad - true=从 prefs 加载到 UI, false=从 UI 保存到 prefs
     */
    syncPrefsCheckboxes: function (config, isLoad) {
      const doc = this.getDocument();
      if (config.checkboxKeys) {
        if (isLoad) {
          for (let key of config.checkboxKeys) {
            let elem = doc.getElementById('ai4paper.' + key);
            if (elem) elem.checked = Zotero.Prefs.get('ai4paper.' + key);
          }
        } else {
          for (let key of config.checkboxKeys) {
            let elem = doc.getElementById('ai4paper.' + key);
            elem && Zotero.Prefs.set('ai4paper.' + key, elem.checked);
          }
        }
      }
      if (config.inputKeys) {
        if (isLoad) {
          for (let key of config.inputKeys) {
            let elem = doc.getElementById('ai4paper.' + key);
            if (elem) elem.value = Zotero.Prefs.get('ai4paper.' + key);
          }
        } else {
          for (let key of config.inputKeys) {
            let elem = doc.getElementById('ai4paper.' + key);
            elem && Zotero.Prefs.set('ai4paper.' + key, elem.value);
          }
        }
      }
    },

    /**
     * 检查 Enter 键并触发回调
     * @param {Event} event - 键盘事件
     * @param {Function} callback - 按下 Enter 时的回调
     */
    checkKeyEnter: function (event, callback) {
      if (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey && event.keyCode === 13) {
        event.returnValue = false;
        event.preventDefault && event.preventDefault();
        callback();
      }
    },

    /**
     * 通过 DOI 在线查看文献
     * @param {string} label - 包含 🆔 的 checkbox label
     */
    viewOnlineDOI: function (label) {
      if (label.includes('🆔')) {
        let doi = Zotero.AI4Paper.extractDOIFromItemInfo(label);
        Zotero.getMainWindow().ZoteroPane.loadURI('https://doi.org/' + doi);
      }
    },

    /**
     * 格式化摘要文本（清除 JATS XML 标签）
     * @param {string} text - 摘要文本
     * @returns {string} 清理后的文本
     */
    formatAbstract: function (text) {
      if (text) {
        text = text.replace('<jats:p>', '').replace('<jats:title>', '')
          .replace('</jats:p>', '').replace('</jats:title>', '')
          .replace('<jats:title>Abstract</jats:title>', '')
          .replace('<jats:p>Abstract</jats:p>', '');
      }
      return text;
    },

    /**
     * 翻译摘要并追加到元素
     * @param {Element} elem - 显示摘要的 DOM 元素
     */
    translateAbstract: async function (elem) {
      let text = elem.textContent;
      if (text && !text.includes('🆔')) {
        let translated = await Zotero.AI4Paper.volcanoFree_transAbstractInPanel(text);
        if (translated) {
          if (Zotero.Prefs.get('ai4paper.retrieverefsAbstractTranslationBehind')) {
            elem.textContent = text + '\n\n🎈【摘要翻译】' + translated;
          } else {
            elem.textContent = '🎈【摘要翻译】' + translated + '\n\n🍋【摘要原文】' + text;
          }
          elem.style.height = 'auto';
          elem.style.height = Math.min(elem.scrollHeight, 300) + 'px';
        }
      }
    },

    // ==================== Phase 4: A-Z 字母过滤按钮 ====================

    /**
     * 更新 A-Z + OT 字母过滤按钮的状态
     * @param {boolean} resetAll - true=重置所有按钮为默认状态
     * @param {string} [selectedLetter] - 当前选中的字母
     * @param {string} [idPrefix] - 按钮 ID 前缀 (默认 "tagFilter-")
     */
    updateAZFilterButtons: function (resetAll, selectedLetter, idPrefix) {
      idPrefix = idPrefix || 'tagFilter-';
      const doc = this.getDocument();
      let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'OT'];
      for (let letter of letters) {
        let img = doc.getElementById(idPrefix + letter),
          defaultSrc = 'chrome://ai4paper/content/icons/' + letter + '.png',
          selectedSrc = 'chrome://ai4paper/content/icons/' + letter + '-select.png';
        if (!img) continue;
        if (resetAll) {
          img.setAttribute('src', defaultSrc);
          img.onmouseover = () => img.style.transform = 'scale(1.3)';
          img.onmouseout = () => img.style.transform = 'scale(1)';
        } else if (letter === selectedLetter) {
          img.setAttribute('src', selectedSrc);
          img.style.transform = 'scale(1)';
          img.onmouseover = () => {};
          img.onmouseout = () => {};
        } else {
          img.setAttribute('src', defaultSrc);
          img.onmouseover = () => img.style.transform = 'scale(1.3)';
          img.onmouseout = () => img.style.transform = 'scale(1)';
        }
      }
    },

    // ==================== Phase 5: 标签更新递归链 ====================

    /**
     * 通用标签更新检查链（递归检查所有标签）
     * @param {Object} config - 配置
     * @param {string} config.tagType - 标签类型 (如 "itemTag", "annotationTag", "gptNoteTag")
     * @param {string} config.dialogPrefix - 对话框任务名前缀 (如 "_deleteTagsDialog_update_")
     * @param {string} config.description - 进度描述 (如 "条目标签")
     * @param {Function} config.checkFn - 检查函数 (如 Zotero.AI4Paper.checkItemTag)
     * @param {string} config.prefKey - 保存结果的 pref key (如 "ai4paper.itemTags")
     * @param {Function} config.refreshFn - 刷新完成后的回调
     */
    runTagUpdateChain: async function (config) {
      let items = await Zotero.Tags.getAll(1);
      if (items.length === 0) {
        Zotero.AI4Paper.showProgressWindow(3000, '❌ 未发现标签【AI4paper】', '未在【我的文库】中发现任何标签！');
        return;
      }
      let taskName = config.dialogPrefix + config.tagType;
      Zotero.AI4Paper.progressPercent_initProgress(items, taskName, config.description);

      // 递归检查
      let checkNext = async function () {
        Zotero.AI4Paper['numberOfUpdatedItems' + taskName]++;
        if (Zotero.AI4Paper['current' + taskName] == Zotero.AI4Paper['toUpdate' + taskName] - 1) {
          Zotero.AI4Paper['progressWindow' + taskName].close();
          Zotero.AI4Paper.progressPercent_resetState(null, taskName, config.description);
          Zotero.Prefs.set(config.prefKey, JSON.stringify(Zotero.AI4Paper['_progressData_' + taskName]));
          config.refreshFn(true);
          return;
        }
        Zotero.AI4Paper.progressPercent_updatePercent(taskName, '检查所有标签： ');
        let tag = Zotero.AI4Paper['itemsToUpdate' + taskName][Zotero.AI4Paper['current' + taskName]];
        try {
          let found = await config.checkFn(tag.tag);
          if (found) {
            let tagInfo = { tag: tag.tag, type: 0 };
            if (!JSON.stringify(Zotero.AI4Paper['_progressData_' + taskName]).includes(JSON.stringify(tagInfo))) {
              Zotero.AI4Paper['_progressData_' + taskName].push(tagInfo);
              Zotero.AI4Paper['counter' + taskName]++;
            }
          }
        } catch (e) {
          Zotero.debug(e);
        }
        checkNext();
      };
      checkNext();
    },

    // ==================== Phase 6: 快捷键与视图切换 ====================

    /**
     * 注册键盘快捷键（防重复注册）
     * @param {Document} doc - 文档对象
     * @param {Array<Object>} bindings - 快捷键绑定列表
     * @param {string} bindings[].key - 按键 (如 'd', 'f', 't')
     * @param {Function} bindings[].handler - 处理函数
     */
    registerKeyboardShortcuts: function (doc, bindings) {
      if (doc._switchViewShortcutsAdded) return;
      doc._switchViewShortcutsAdded = true;
      doc.addEventListener('keydown', event => {
        for (let binding of bindings) {
          if (Zotero.isMac) {
            if (event.key === binding.key && !event.ctrlKey && !event.shiftKey && !event.altKey && event.metaKey) {
              binding.handler();
            }
          } else {
            if (event.key === binding.key && event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
              binding.handler();
            }
          }
        }
      });
    },

    /**
     * 循环切换按钮组（如标签类型视图）
     * @param {Array<string>} buttonIds - 按钮 ID 数组（不含后缀）
     * @param {string} [suffix] - 按钮 ID 后缀 (默认 "-button")
     */
    cycleButtonGroup: function (buttonIds, suffix) {
      suffix = suffix || '-button';
      const doc = this.getDocument();
      for (let i = 0; i < buttonIds.length; i++) {
        let current = doc.getElementById(buttonIds[i] + suffix);
        if (current && current.getAttribute('default') === 'true') {
          let next = i === buttonIds.length - 1 ? 0 : i + 1;
          let nextElem = doc.getElementById(buttonIds[next] + suffix);
          nextElem && nextElem.click();
          return;
        }
      }
    },

    /**
     * 更新按钮组选中状态
     * @param {Array<string>} buttonIds - 按钮 ID 数组（不含后缀）
     * @param {string} activeId - 当前激活的按钮 ID（不含后缀）
     * @param {string} [suffix] - 按钮 ID 后缀 (默认 "-button")
     */
    updateButtonGroupStatus: function (buttonIds, activeId, suffix) {
      suffix = suffix || '-button';
      const doc = this.getDocument();
      for (let id of buttonIds) {
        let elem = doc.getElementById(id + suffix);
        if (elem) {
          elem.setAttribute('default', id === activeId ? true : false);
        }
      }
    }
  }
});
