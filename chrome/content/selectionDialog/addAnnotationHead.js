var methodsBody = function () {};
methodsBody.init = async function () {
  Zotero.ZoteroIF.update_svg_icons(document);

  // 根据 Zotero 版本调整样式
  Zotero.ZoteroIF.updateTextAreaBox4ZoteroScheme(window);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  this.io = window.arguments[0];

  // const menuPopup = document.getElementById('zotero-if-xul-add-anotation-head-level-popup');

  // // 创建新的菜单项
  // const newMenuItem = document.createXULElement('menuitem');
  // newMenuItem.setAttribute('label', 'New Item');
  // document.getElementById('zotero-if-xul-add-anotation-head-level').label = Zotero.ZoteroIF.defaultHeadLevel;
  document.getElementById('zotero-if-xul-add-anotation-head-level').selectedIndex = Number(Zotero.ZoteroIF.defaultHeadLevel.substring(1)) - 1; // 索引从 0 开始
  document.getElementById("zotero-if-xul-add-anotation-head-autoLoad").checked = Zotero.Prefs.get('zoteroif.autoloadhead');
  let headContent = methodsBody.loadCurrentHead(this.io.dataIn);
  if (headContent) {
    document.getElementById("zotero-if-xul-add-anotation-head-content").value = headContent;
  } else if (Zotero.Prefs.get('zoteroif.autoloadhead')) {
    methodsBody.loadHead();
  }

  // 聚焦
  await Zotero.Promise.delay(10);
  document.getElementById("zotero-if-xul-add-anotation-head-content").focus();
  document.getElementById("zotero-if-xul-add-anotation-head-content-cancel").focus();
  document.getElementById("zotero-if-xul-add-anotation-head-content").focus();
};
methodsBody.acceptSelection = function () {
  if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(document.getElementById('zotero-if-xul-add-anotation-head-level').label)) {
    Zotero.ZoteroIF.defaultHeadLevel = document.getElementById('zotero-if-xul-add-anotation-head-level').label;
  }
  this.io.dataOut = '';
  let headLevel = 'ZH3';
  if (document.getElementById('zotero-if-xul-add-anotation-head-level').label === 'H1') {
    headLevel = 'ZH1';
  } else if (document.getElementById('zotero-if-xul-add-anotation-head-level').label === 'H2') {
    headLevel = 'ZH2';
  } else if (document.getElementById('zotero-if-xul-add-anotation-head-level').label === 'H4') {
    headLevel = 'ZH4';
  } else if (document.getElementById('zotero-if-xul-add-anotation-head-level').label === 'H5') {
    headLevel = 'ZH5';
  } else if (document.getElementById('zotero-if-xul-add-anotation-head-level').label === 'H6') {
    headLevel = 'ZH6';
  }
  this.io.dataOut = `<${headLevel}>${document.getElementById("zotero-if-xul-add-anotation-head-content").value}<${headLevel}/>`;
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
methodsBody.loadHead = function () {
  let annotationItem = this.io.dataIn;
  if (annotationItem.annotationType === 'highlight') {
    document.getElementById("zotero-if-xul-add-anotation-head-content").value = annotationItem.annotationText;
  } else if (annotationItem.annotationType === 'note') {
    document.getElementById("zotero-if-xul-add-anotation-head-content").value = annotationItem.annotationComment;
  } else if (annotationItem.annotationType === 'underline') {
    document.getElementById("zotero-if-xul-add-anotation-head-content").value = annotationItem.annotationText;
  }
};
methodsBody.loadCurrentHead = function (annotationItem) {
  let annotationComment = `${annotationItem.annotationComment}`;
  if (annotationComment.indexOf('<ZH') != -1) {
    let check = false;
    let headLevel = '';
    if (annotationComment.indexOf('<ZH1>') != -1 && annotationComment.indexOf('<ZH1/>') != -1) {
      headLevel = 'ZH1';
      check = true;
    } else if (annotationComment.indexOf('<ZH2>') != -1 && annotationComment.indexOf('<ZH2/>') != -1) {
      headLevel = 'ZH2';
      check = true;
    } else if (annotationComment.indexOf('<ZH3>') != -1 && annotationComment.indexOf('<ZH3/>') != -1) {
      headLevel = 'ZH3';
      check = true;
    } else if (annotationComment.indexOf('<ZH4>') != -1 && annotationComment.indexOf('<ZH4/>') != -1) {
      headLevel = 'ZH4';
      check = true;
    } else if (annotationComment.indexOf('<ZH5>') != -1 && annotationComment.indexOf('<ZH5/>') != -1) {
      headLevel = 'ZH5';
      check = true;
    } else if (annotationComment.indexOf('<ZH6>') != -1 && annotationComment.indexOf('<ZH6/>') != -1) {
      headLevel = 'ZH6';
      check = true;
    }
    if (check) {
      let headCMDIndex = annotationComment.indexOf(`<${headLevel}>`);
      let content0 = annotationComment.substring(headCMDIndex);
      let rightBracketIndex = content0.indexOf(`<${headLevel}/>`);
      let headContent = content0.substring(5, rightBracketIndex);
      return headContent;
    }
  }
  return false;
};
methodsBody.removeHead = async function () {
  let annotationItem = this.io.dataIn;
  let annotationComment = `${annotationItem.annotationComment}`;
  if (annotationComment.indexOf('<ZH') != -1) {
    let check = false;
    let headLevel = '';
    if (annotationComment.indexOf('<ZH1>') != -1 && annotationComment.indexOf('<ZH1/>') != -1) {
      headLevel = 'ZH1';
      check = true;
    } else if (annotationComment.indexOf('<ZH2>') != -1 && annotationComment.indexOf('<ZH2/>') != -1) {
      headLevel = 'ZH2';
      check = true;
    } else if (annotationComment.indexOf('<ZH3>') != -1 && annotationComment.indexOf('<ZH3/>') != -1) {
      headLevel = 'ZH3';
      check = true;
    } else if (annotationComment.indexOf('<ZH4>') != -1 && annotationComment.indexOf('<ZH4/>') != -1) {
      headLevel = 'ZH4';
      check = true;
    } else if (annotationComment.indexOf('<ZH5>') != -1 && annotationComment.indexOf('<ZH5/>') != -1) {
      headLevel = 'ZH5';
      check = true;
    } else if (annotationComment.indexOf('<ZH6>') != -1 && annotationComment.indexOf('<ZH6/>') != -1) {
      headLevel = 'ZH6';
      check = true;
    }
    if (check) {
      let headCMDIndex = annotationComment.indexOf(`<${headLevel}>`);
      let content0 = annotationComment.substring(headCMDIndex);
      let rightBracketIndex = content0.indexOf(`<${headLevel}/>`);
      let headContent = content0.substring(5, rightBracketIndex);
      let content1 = '';
      let content2 = '';
      if (content0.length > headContent.length + 11) {
        content2 = content0.substring(headContent.length + 11);
      }
      if (headCMDIndex != 0) {
        content1 = annotationComment.substring(0, headCMDIndex);
      }
      annotationItem.annotationComment = `${content1}${content2}`;
      await annotationItem.saveTx();
      window.close();
      Zotero.ZoteroIF.showProgressWindowZot(6000, '取消大纲级别', `✅ 成功取消当前注释的大纲级别！`);
    }
  } else {
    window.alert('当前注释无大纲级别！');
  }
};
methodsBody.autoLoadHead = function () {
  Zotero.Prefs.set('zoteroif.autoloadhead', document.getElementById("zotero-if-xul-add-anotation-head-autoLoad").checked);
};