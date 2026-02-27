var methodsBody = function () {};
methodsBody.init = async function () {
  Zotero.ZoteroIF.update_svg_icons(document);

  // 根据 Zotero 版本调整样式
  Zotero.ZoteroIF.updateTextAreaBox4ZoteroScheme(window);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  document.addEventListener('dialogcancel', () => methodsBody.cancelSelection());
  this.io = window.arguments[0];
  if (this.io.dataIn) {
    let item_title = this.io.dataIn;
    document.getElementById('zotero-if-xul-add-chatgpt-note-tag-itemtitle').hidden = false;
    document.getElementById('zotero-if-xul-add-chatgpt-note-tag-itemtitle').value = `👉 ${item_title.substring(0, 50)}...`;
  }
  methodsBody.setPopup();

  // 聚焦/延迟下，否则可能不能输入中文
  await Zotero.Promise.delay(10);
  document.getElementById("zotero-if-xul-add-chatgpt-note-tag").focus();
  document.getElementById("zotero-if-xul-add-chatgpt-note-tag-fixeditems2attach").focus();
  document.getElementById("zotero-if-xul-add-chatgpt-note-tag").focus();
};
methodsBody.acceptSelection = function () {
  var returnObject = false;
  this.io.dataOut = new Object();
  let check = false;
  let item_title = '';
  let tags = '';
  if (document.getElementById("zotero-if-xul-add-chatgpt-note-tag-attach2otheritem").checked) {
    check = true;
    item_title = document.getElementById("zotero-if-xul-add-chatgpt-note-tag-fixeditems2attach").label;
    tags = document.getElementById("zotero-if-xul-add-chatgpt-note-tag").value;
    this.io.dataOut = {
      check,
      item_title,
      tags
    };
    returnObject = true;
  } else {
    check = false;
    item_title = '';
    tags = document.getElementById("zotero-if-xul-add-chatgpt-note-tag").value;
    this.io.dataOut = {
      check,
      item_title,
      tags
    };
    returnObject = true;
  }
  if (!returnObject) this.io.dataOut = null;
  window.close();
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