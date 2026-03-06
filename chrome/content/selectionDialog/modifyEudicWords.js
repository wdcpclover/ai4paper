var methodsBody = function () {};
methodsBody.init = async function () {
  methodsBody.io = window.arguments && window.arguments[0] ? window.arguments[0] : {
    dataIn: '',
    dataOut: null
  };
  Zotero.AI4Paper.update_svg_icons(document);

  // 根据 Zotero 版本调整样式
  Zotero.AI4Paper.updateTextAreaBox4ZoteroScheme(window);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());

  // 填充待修改的单词
  document.getElementById("words-modify-textarea").value = methodsBody.io.dataIn;
  document.getElementById("words-modify-textarea").placeholder = methodsBody.io.dataIn;

  // 显示生词本列表
  methodsBody.showCategoriesList();

  // 保留大小写，载入上一次的设置
  document.getElementById("keepCase").checked = Zotero.AI4Paper._data_lastKeepCaseSetting ? true : false;
  // 聚焦
  await Zotero.Promise.delay(10);
  document.getElementById("words-modify-textarea").focus();
  document.getElementById("category-list").focus(); // 必须切换聚焦才可以
  document.getElementById("words-modify-textarea").focus();
};
methodsBody.acceptSelection = function () {
  let words = document.getElementById("words-modify-textarea").value.trim();
  let categoryID = "0";
  let keepCase = document.getElementById("keepCase").checked;
  // 暂存上一次的大小写设置
  Zotero.AI4Paper._data_lastKeepCaseSetting = keepCase;

  // 提取 ID 值后，直接传递
  let selected = document.getElementById("category-list").value;
  // 如果没有选择，则使用设置中配置的生词本
  if (!selected) {
    categoryID = Zotero.Prefs.get('ai4paper.eudicCategoryID').trim();
  } else {
    let index = selected.indexOf('🆔：');
    categoryID = selected.substring(index + 3);
    // 记录上一次选择的生词本信息
    Zotero.AI4Paper._data_lastSelectedEudicCategoryInfo = selected;
  }
  methodsBody.io.dataOut = {
    words,
    categoryID,
    keepCase
  };
};
methodsBody.showCategoriesList = function () {
  // 为方便刷新，先清空列表
  let radioGroup = document.getElementById("category-list");
  let first = radioGroup.firstElementChild;
  while (first) {
    first.remove();
    first = radioGroup.firstElementChild;
  }
  let categories = JSON.parse(Zotero.Prefs.get('ai4paper.eudicCategoriesInfo'));
  let _radio;
  for (let category of categories) {
    _radio = document.createXULElement('radio');
    // \u00A0\u00A0\u00A0 不间断空格
    _radio.setAttribute('label', `【生词本名称】：${category.name}\u00A0\u00A0\u00A0🆔：${category.id}`);
    _radio.setAttribute('value', `【生词本名称】：${category.name}\u00A0\u00A0\u00A0🆔：${category.id}`);
    document.getElementById("category-list").appendChild(_radio);
  }

  // 如果上一次选择的生词本不为空，则载入
  if (Zotero.AI4Paper._data_lastSelectedEudicCategoryInfo) {
    document.getElementById("category-list").value = Zotero.AI4Paper._data_lastSelectedEudicCategoryInfo;
  }
  // 否则载入默认生词本
  else {
    methodsBody.setAsDefaultCategory(false);
  }
};
methodsBody.updateCategoriesList = async function () {
  if (Zotero.Prefs.get('ai4paper.eudicAPIKey') === "") {
    Zotero.AI4Paper.showProgressWindow(3000, "❌ 尚未配置欧路词典 API", `请前往【AI4paper --> 生词】输入 欧路词典 API！`);
    return -1;
  }
  var token = Zotero.Prefs.get('ai4paper.eudicAPIKey').trim();
  var url = "https://api.frdic.com/api/open/v1/studylist/category?language=en";
  var bodyObject = {};
  let res;
  try {
    let res = await Zotero.HTTP.request("GET", url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(bodyObject),
      responseType: "json"
    });
    if (res.response.data) {
      let categoryIDsInfo = [];
      let i = 0;
      for (let ele of res.response.data) {
        i++;
        categoryIDsInfo.push({
          "name": ele.name,
          "id": ele.id
        });
      }
      if (categoryIDsInfo.length === 0) {
        Zotero.AI4Paper.showProgressWindow(3000, "❌ 未读取到生词本", `未读取到生词本！你可能需要前往欧路词典客户端创建生词本。`);
        return;
      }
      // 存储所有生词本信息，方便跟随按钮右键修改单词时调用生词本列表
      Zotero.Prefs.set('ai4paper.eudicCategoriesInfo', JSON.stringify(categoryIDsInfo));
      methodsBody.showCategoriesList();
      Zotero.AI4Paper.showProgressWindow(3000, "✅ 成功刷新生词本", `成功刷新，共有【${categoryIDsInfo.length}】个生词本！`);
    }
  } catch (e) {
    Zotero.AI4Paper.showProgressWindow(3000, "❌ 刷新生词本失败", `${e}`);
    // window.alert(e);
  }
};
methodsBody.setAsDefaultCategory = function (isManually) {
  // 为方便刷新，先清空列表
  let radioGroup = document.getElementById("category-list");
  let radios = radioGroup.childNodes;
  let categoryID = Zotero.Prefs.get('ai4paper.eudicCategoryID').trim();
  if (!categoryID && isManually) {
    Zotero.AI4Paper.showProgressWindow(3000, "❌ 尚未配置默认【欧路词典生词本 ID】", `请前往【AI4paper --> 生词】配置默认【欧路词典生词本 ID】！`);
    return;
  }
  for (let radio of radios) {
    if (radio.value.indexOf(`🆔：${categoryID}`) != -1) {
      radioGroup.value = radio.value;
      return;
    }
  }
};
