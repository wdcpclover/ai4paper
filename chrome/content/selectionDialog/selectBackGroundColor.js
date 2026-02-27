var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());
  if (Zotero.Prefs.get('ai4paper.eyesprotectioncolorcodeisok')) {
    let customColorRadio = document.createXULElement('radio');
    customColorRadio.setAttribute('class', 'color-option');
    customColorRadio.setAttribute('label', '自定义');
    customColorRadio.setAttribute('value', 'custom');
    document.getElementById("backgroundcolor-style").appendChild(customColorRadio);

    // 假设你有一个自定义颜色，比如红色
    // const customColor = 'rgb(255, 0, 0)';
    const customColor = Zotero.Prefs.get('ai4paper.eyesprotectioncolorcode');

    // 获取所有拥有 ".color-option" 类和带有 value="ivory_white" 属性的元素
    const elements = document.querySelectorAll('.color-option[value="custom"]');

    // 循环遍历每个匹配的元素，并修改它们的 ::before 伪元素的背景色
    elements.forEach(element => {
      // 设置 CSS 变量的值为自定义颜色
      element.style.setProperty('--before-bg-color', customColor);
    });
  }
  if (!Zotero.Prefs.get('ai4paper.eyesprotectioncolorenable')) {
    document.getElementById("backgroundcolor-style").value = 'default';
  } else {
    if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '豆沙绿') {
      document.getElementById("backgroundcolor-style").value = 'mungbean_green';
    } else if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '抹茶绿') {
      document.getElementById("backgroundcolor-style").value = 'matcha_green';
    } else if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '青草绿') {
      document.getElementById("backgroundcolor-style").value = 'grass_green';
    } else if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '杏仁黄') {
      document.getElementById("backgroundcolor-style").value = 'almond_yellow';
    } else if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '秋叶褐') {
      document.getElementById("backgroundcolor-style").value = 'autumnleaf_brown';
    } else if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '胭脂红') {
      document.getElementById("backgroundcolor-style").value = 'crimson_red';
    } else if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '海天蓝') {
      document.getElementById("backgroundcolor-style").value = 'ocean_blue';
    } else if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '葛巾紫') {
      document.getElementById("backgroundcolor-style").value = 'gauze_purple';
    } else if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '极光灰') {
      document.getElementById("backgroundcolor-style").value = 'aurora_grey';
    } else if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '象牙白') {
      document.getElementById("backgroundcolor-style").value = 'ivory_white';
    } else if (Zotero.Prefs.get('ai4paper.eyesprotectioncolor') === '自定义' && Zotero.Prefs.get('ai4paper.eyesprotectioncolorcodeisok')) {
      document.getElementById("backgroundcolor-style").value = 'custom';
    }
  }
  // Zotero 主题色
  document.getElementById("zotero-color-scheme").value = Zotero.Prefs.get('browser.theme.toolbar-theme', true);
  this.io = window.arguments[0];
};
methodsBody.acceptSelection = function () {
  var returnObject = false;
  this.io.dataOut = null;
  this.io.dataOut = document.getElementById("backgroundcolor-style").value;
  returnObject = true;
  if (!returnObject) this.io.dataOut = null;
};
methodsBody.setZoteroColorScheme = function () {
  Zotero.Prefs.set('browser.theme.toolbar-theme', Number(document.getElementById('zotero-color-scheme').value), true);
  Zotero.AI4Paper.updateZoteroColorSchemeButtonState();
};

// 实时预览所选的护眼色

methodsBody.previewSelectedBackGroundColor = function () {
  let selectedBackGroundColor = document.getElementById("backgroundcolor-style").value;
  if (selectedBackGroundColor === 'default') {
    Zotero.Prefs.set('ai4paper.eyesprotectioncolorenable', false);
  } else {
    Zotero.Prefs.set('ai4paper.eyesprotectioncolorenable', true);
    if (selectedBackGroundColor === 'mungbean_green') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '豆沙绿');
    } else if (selectedBackGroundColor === 'matcha_green') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '抹茶绿');
    } else if (selectedBackGroundColor === 'grass_green') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '青草绿');
    } else if (selectedBackGroundColor === 'almond_yellow') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '杏仁黄');
    } else if (selectedBackGroundColor === 'autumnleaf_brown') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '秋叶褐');
    } else if (selectedBackGroundColor === 'crimson_red') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '胭脂红');
    } else if (selectedBackGroundColor === 'ocean_blue') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '海天蓝');
    } else if (selectedBackGroundColor === 'gauze_purple') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '葛巾紫');
    } else if (selectedBackGroundColor === 'aurora_grey') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '极光灰');
    } else if (selectedBackGroundColor === 'ivory_white') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '象牙白');
    } else if (selectedBackGroundColor === 'custom') {
      Zotero.Prefs.set('ai4paper.eyesprotectioncolor', '自定义');
    }
  }
  let currentReader = Zotero.AI4Paper.getCurrentReader();
  if (currentReader) {
    Zotero.AI4Paper.setPDFBackGroundColor(currentReader._iframeWindow);
  }
};