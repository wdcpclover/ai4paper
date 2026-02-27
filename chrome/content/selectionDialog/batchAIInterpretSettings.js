var methodsBody = function () {};
methodsBody.init = function () {
  // 禁用默认的元素聚焦状态
  Zotero.AI4Paper.blurActiveElement(window);

  // Zotero.AI4Paper.update_svg_icons(document);

  // 创建服务和模型菜单
  methodsBody.buildPopup_serviceAndModel();

  // 先创建提示词模板菜单
  Zotero.AI4Paper.buildPopup_promptList(window, document.getElementById("ai4paper-prompt4BatchAIInterpret-menupopup"));

  // 初始化设置
  methodsBody.updatePrefs(true);
};
methodsBody.buildPopup_serviceAndModel = function () {
  try {
    // 设置服务
    let service_menupopup = document.getElementById("ai4paper-service4BatchAIInterpret-menupopup");
    // 获取服务对象的属性，返回服务名称数组
    let serviceList = Object.keys(Zotero.AI4Paper.gptServiceList()).filter(s => s.includes("GPT 自定"));
    for (let e of serviceList) {
      let menuitem = document.createXULElement('menuitem');
      menuitem.label = e;
      menuitem.value = e;
      service_menupopup.appendChild(menuitem);
    }

    // 设置模型
    let model_menupopup = document.getElementById("ai4paper-model4BatchAIInterpret-menupopup");
    // 获取模型
    let modelList = Zotero.AI4Paper.gptModelList;
    for (let e of modelList) {
      let menuitem = document.createXULElement('menuitem');
      menuitem.label = e;
      menuitem.value = e;
      model_menupopup.appendChild(menuitem);
    }
  } catch (e) {
    Zotero.debug(e);
  }
};
methodsBody.updatePrefs = function (isInit) {
  let strPrefs = ["service4BatchAIInterpret", "model4BatchAIInterpret", "prompt4BatchAIInterpret", "concurrency4BatchAIInterpret"];
  let boolPrefs = ["autoInterpretNewItems", "includeReasoning4BatchAIInterpret", "syncChatHistory4BatchAIInterpret"];
  for (let item of strPrefs) {
    if (isInit) {
      document.getElementById(`ai4paper.${item}`).value = Zotero.Prefs.get(`ai4paper.${item}`);
    } else {
      Zotero.Prefs.set(`ai4paper.${item}`, document.getElementById(`ai4paper.${item}`).value);
    }
  }
  for (let item of boolPrefs) {
    if (isInit) {
      document.getElementById(`ai4paper.${item}`).checked = Zotero.Prefs.get(`ai4paper.${item}`);
    } else {
      Zotero.Prefs.set(`ai4paper.${item}`, document.getElementById(`ai4paper.${item}`).checked);
    }
  }

  // 即时刷新 AI 批量解读文献 窗口的 footer 信息
  if (!isInit) {
    Zotero.AI4Paper.updateFooterUI_batchInterpret();
  }
};