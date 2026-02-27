var methodsBody = function () {};
methodsBody.init = async function () {
  Zotero.ZoteroIF.update_svg_icons(document);

  // 根据 Zotero 版本调整样式
  Zotero.ZoteroIF.updateTextAreaBox4ZoteroScheme(window);

  // 聚焦
  await Zotero.Promise.delay(10);
  document.getElementById("enableRequestArguments").focus();
  document.getElementById("textarea-requestArguments").focus();
  document.getElementById("enableRequestArguments").focus();
  this.io = window.arguments[0];
  document.title = `为【GPT 自定 ${Zotero.ZoteroIF.gptCustom_numEmoji[this.io.dataIn]}】增加请求参数`;
  methodsBody.enableRequestArguments(true);
  methodsBody.updateRequestArguments(true);
};
methodsBody.enableRequestArguments = function (isInit) {
  if (isInit) {
    document.getElementById("enableRequestArguments").checked = Zotero.Prefs.get(`zoteroif.gptcustomRequestArgumentsAddedEnable${Zotero.ZoteroIF.gptCustom_suffix[this.io.dataIn]}`);
  } else {
    Zotero.Prefs.set(`zoteroif.gptcustomRequestArgumentsAddedEnable${Zotero.ZoteroIF.gptCustom_suffix[this.io.dataIn]}`, document.getElementById("enableRequestArguments").checked);
  }
};
methodsBody.updateRequestArguments = function (isInit) {
  if (isInit) {
    document.getElementById("textarea-requestArguments").value = Zotero.Prefs.get(`zoteroif.gptcustomRequestArgumentsAdded${Zotero.ZoteroIF.gptCustom_suffix[this.io.dataIn]}`);
  } else {
    Zotero.Prefs.set(`zoteroif.gptcustomRequestArgumentsAdded${Zotero.ZoteroIF.gptCustom_suffix[this.io.dataIn]}`, document.getElementById("textarea-requestArguments").value.trim());
  }
};
methodsBody.checkJSON = function () {
  let jsonString = document.getElementById("textarea-requestArguments").value.trim();
  let {
    msg,
    isJSON = false,
    parsedData = {}
  } = Zotero.ZoteroIF.checkJSON(jsonString);
  if (isJSON && Object.keys(parsedData).length) {
    // 通过
    window.alert(msg);
  } else if (isJSON && !Object.keys(parsedData).length) {
    window.alert("检测通过，但参数为空！");
  } else {
    // 不通过
    window.alert(msg);
  }
};