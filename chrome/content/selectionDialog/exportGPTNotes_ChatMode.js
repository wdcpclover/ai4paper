var methodsBody = function () {};
methodsBody.init = async function () {
  Zotero.ZoteroIF.update_svg_icons(document);

  // 根据 Zotero 版本调整样式
  Zotero.ZoteroIF.updateTextAreaBox4ZoteroScheme(window);

  // 设置 iframe 高度，主要要放在最前面。
  let screen_height = window.screen.height;
  if (parseInt(screen_height) <= 1000) {
    document.getElementById("gptNotesList-iframe").style.height = screen_height * 0.414 + 'px';
  } else {
    document.getElementById("gptNotesList-iframe").style.height = '522px'; // 522/1260 = 0.414
  }
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  document.addEventListener('dialogcancel', () => methodsBody.cancelSelection());
  document.getElementById('editGPTNotes-description').value = `已选择【${Zotero.ZoteroIF._store_selecteGPTMessages.length}】条待导出消息。点击头像旁的编辑按钮，可修改消息内容。`;
  document.getElementById('keep-markdown-style').checked = Zotero.Prefs.get("zoteroif.gptNotesMarkdownStyle");
  this.io = window.arguments[0];
  if (this.io.dataIn) {
    let item_title = this.io.dataIn;
    document.getElementById('zotero-if-xul-add-chatgpt-note-tag-itemtitle').hidden = false;
    document.getElementById('zotero-if-xul-add-chatgpt-note-tag-itemtitle').value = `👉 ${item_title.substring(0, 50)}...`;
  }
  methodsBody.setPopup();

  // 延迟下，否则可能不能输入中文
  await new Promise(r => setTimeout(r, 50));
  document.getElementById("zotero-if-xul-add-chatgpt-note-tag").focus();
};
methodsBody.acceptSelection = function () {
  var returnObject = false;
  this.io.dataOut = new Object();
  let check = false;
  let item_title = '';
  let tags = '';
  // 获取编辑完成的消息
  let messages = methodsBody.getEditedMessage();
  if (document.getElementById("zotero-if-xul-add-chatgpt-note-tag-attach2otheritem").checked) {
    check = true;
    item_title = document.getElementById("zotero-if-xul-add-chatgpt-note-tag-fixeditems2attach").label;
    tags = document.getElementById("zotero-if-xul-add-chatgpt-note-tag").value;
    this.io.dataOut = {
      check,
      item_title,
      tags,
      messages
    };
    returnObject = true;
  } else {
    check = false;
    item_title = '';
    tags = document.getElementById("zotero-if-xul-add-chatgpt-note-tag").value;
    this.io.dataOut = {
      check,
      item_title,
      tags,
      messages
    };
    returnObject = true;
  }
  if (!returnObject) this.io.dataOut = null;
  window.close();
};
methodsBody.getEditedMessage = function () {
  let editedGPTMessages = [];
  let iframeWindow = null;
  if (document.getElementById('gptNotesList-iframe')) {
    iframeWindow = document.getElementById('gptNotesList-iframe').contentWindow;
  }
  if (!iframeWindow) {
    return [];
  }
  let messageElements = iframeWindow.document.querySelectorAll(".message");
  for (let messageEle of messageElements) {
    let messageContent;
    if (Zotero.Prefs.get("zoteroif.gptNotesMarkdownStyle")) {
      messageContent = messageEle.querySelector('.content').messageSourceText;
    } else {
      messageContent = messageEle.querySelector('.content').innerText;
    }
    let role;
    if (messageEle.querySelector('.avatar').classList.contains('user')) {
      role = 'user';
    } else {
      role = 'assistant';
    }
    let _message = {
      "role": role,
      "content": messageContent
    };
    editedGPTMessages.push(_message);
  }
  return editedGPTMessages;
};

// 拷贝当前界面全部消息

methodsBody.copyMessages = function () {
  let editedGPTMessages = [];
  let iframeWindow = null;
  if (document.getElementById('gptNotesList-iframe')) {
    iframeWindow = document.getElementById('gptNotesList-iframe').contentWindow;
  }
  if (!iframeWindow) {
    return [];
  }
  let messagesArray = [];
  let messageElements = iframeWindow.document.querySelectorAll(".message");
  for (let messageEl of messageElements) {
    let role = messageEl.className === 'message assistant' ? "🤖 AI 回复" : "🙋 用户问题";
    let textEl = messageEl.querySelector('.content');
    if (textEl) {
      if (textEl.innerText) {
        let messageText = `${role}：\n\n${textEl.innerText}`;
        messagesArray.push(messageText);
      }
    }
  }
  if (messagesArray.length) {
    Zotero.ZoteroIF.copy2Clipboard(messagesArray.join("\n\n"));
    Zotero.ZoteroIF.showProgressWindow(1500, "拷贝全部消息【AI4paper】", "✅ 拷贝成功！");
  } else {
    Zotero.ZoteroIF.showProgressWindow(2000, "拷贝全部消息【AI4paper】", "未发现消息！");
  }
};
methodsBody.cancelSelection = function () {
  var returnObject = false;
  this.io.dataOut = null;
  this.io.dataOut = 'cancel';
  returnObject = true;
  if (!returnObject) this.io.dataOut = null;
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
methodsBody.setPopup = function () {
  let menuitem;
  let popup = document.getElementById("zotero-if-xul-add-chatgpt-note-tag-fixeditems2attach-popup");
  let first = popup.firstElementChild;
  while (first) {
    first.remove();
    first = popup.firstElementChild;
  }
  let userPromptTemplate = Zotero.Prefs.get('zoteroif.gptNotesAttachItems');
  let prompTemplateObject = [];
  if (userPromptTemplate != '') {
    let userPromptTemplateArray = userPromptTemplate.split('\n');
    for (let template of userPromptTemplateArray) {
      if (template != '') {
        template = template.trim();
        if (template.lastIndexOf('🆔') != -1) {
          let index = template.lastIndexOf('🆔');
          let id = template.substring(index + 2).trim();
          let title = template.substring(0, index).trim();
          let templateObject = {
            id,
            title
          };
          prompTemplateObject.push(templateObject);
          menuitem = document.createXULElement('menuitem');
          menuitem.setAttribute('label', title);
          menuitem.setAttribute('id', `Item_ID:${id}`);
          menuitem.setAttribute('tooltiptext', `${title}`);
          popup.appendChild(menuitem);
        }
      }
    }
  }
  Zotero.Prefs.set('zoteroif.gptNotesAttachItemsObject', JSON.stringify(prompTemplateObject));
  if (Zotero.Prefs.get('zoteroif.gptNotesLastSelectedItem') != '') {
    // 刷新模板选择
    let menulist = document.getElementById("zotero-if-xul-add-chatgpt-note-tag-fixeditems2attach");
    let allTemplates = popup.childNodes;
    for (let i = 0; i < allTemplates.length; i++) {
      if (allTemplates[i].label === Zotero.Prefs.get('zoteroif.gptNotesLastSelectedItem')) {
        menulist.selectedIndex = i;
        return;
      }
    }
  }
};