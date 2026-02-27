var methodsBody = function () {};
methodsBody._maxtokenDefault = 4096;
methodsBody._maxtokenLimit = 100000;
methodsBody._stepValue = 1024;

// 初始化
methodsBody.init = function () {
  Zotero.AI4Paper.update_svg_icons(document);

  // 设置 Dialog 字体大小
  Zotero.AI4Paper.setFontSize_Dialog(document.querySelector('dialog'), 0.92);

  // 使能 Maxtokens
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-enable").checked = Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable');
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-enable").checked = Zotero.Prefs.get('ai4paper.api2dmaxtokensenable');
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-enable").checked = Zotero.Prefs.get('ai4paper.chatanywheremaxtokensenable');
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-enable").checked = Zotero.Prefs.get('ai4paper.gptcustommaxtokensenable');

  // openai max_tokens
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scalevalue").value = Zotero.Prefs.get('ai4paper.gptmaxtokens');
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scale").value = Zotero.Prefs.get('ai4paper.gptmaxtokens');

  // api2d max_tokens
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scalevalue").value = Zotero.Prefs.get('ai4paper.api2dmaxtokens');
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scale").value = Zotero.Prefs.get('ai4paper.api2dmaxtokens');

  // ChatAnywhere max_tokens
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scalevalue").value = Zotero.Prefs.get('ai4paper.chatanywheremaxtokens');
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scale").value = Zotero.Prefs.get('ai4paper.chatanywheremaxtokens');

  // GPT 自定 max_tokens
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scalevalue").value = Zotero.Prefs.get('ai4paper.gptcustommaxtokens');
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scale").value = Zotero.Prefs.get('ai4paper.gptcustommaxtokens');

  // UI 参数
  document.getElementById("zotero-if-xul-gptEnableCustomChatModeGPTUIHeight").checked = Zotero.Prefs.get('ai4paper.gptEnableCustomChatModeGPTUIHeight');
  document.getElementById("zotero-if-xul-gptCustomChatModePromptAreaHeight").value = Zotero.Prefs.get('ai4paper.gptCustomChatModePromptAreaHeight');
  document.getElementById("zotero-if-xul-gptCustomChatModeResponseAreaHeight").value = Zotero.Prefs.get('ai4paper.gptCustomChatModeResponseAreaHeight');
  document.getElementById("zotero-if-xul-gptEnableCustomGPTUIHeight").checked = Zotero.Prefs.get('ai4paper.gptEnableCustomGPTUIHeight');
  document.getElementById("zotero-if-xul-gptCustomPromptAreaHeight").value = Zotero.Prefs.get('ai4paper.gptCustomPromptAreaHeight');
  document.getElementById("zotero-if-xul-gptCustomResponseAreaHeight").value = Zotero.Prefs.get('ai4paper.gptCustomResponseAreaHeight');

  // Gemini thinkingBudget
  document.getElementById("gemini-thinkingBudget").value = Zotero.Prefs.get('ai4paper.geminiThinkingBudget');
};

/**
 * 共用部分
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

// 使能 Maxtokens 和 输入时
methodsBody.enableMaxtokens = function () {
  Zotero.Prefs.set('ai4paper.chatgptmaxtokensenable', document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-enable").checked);
  Zotero.Prefs.set('ai4paper.api2dmaxtokensenable', document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-enable").checked);
  Zotero.Prefs.set('ai4paper.chatanywheremaxtokensenable', document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-enable").checked);
  Zotero.Prefs.set('ai4paper.gptcustommaxtokensenable', document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-enable").checked);
};
// 输入时
methodsBody.onInputValue = function () {
  Zotero.Prefs.set('ai4paper.gptmaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scalevalue").value));
  Zotero.Prefs.set('ai4paper.api2dmaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scalevalue").value));
  Zotero.Prefs.set('ai4paper.chatanywheremaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scalevalue").value));
  Zotero.Prefs.set('ai4paper.gptcustommaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scalevalue").value));
};

// 连续对话模式：更新 UI 参数
methodsBody.updateChatModeUIElementHeight = function () {
  let screen_height = parseInt(window.screen.height);
  let defaultPromptHight = '';
  let defaultResponseHight = '';
  if (parseInt(screen_height) <= 1000) {
    defaultPromptHight = (screen_height * 0.185).toFixed(2);
    defaultResponseHight = (screen_height * 0.446).toFixed(2);
  } else {
    defaultPromptHight = (screen_height * 0.173).toFixed(2);
    defaultResponseHight = (screen_height * 0.555).toFixed(2);
  }
  let gptCustomChatModePromptAreaHeight = parseInt(document.getElementById("zotero-if-xul-gptCustomChatModePromptAreaHeight").value);
  let gptCustomChatModeResponseAreaHeight = parseInt(document.getElementById("zotero-if-xul-gptCustomChatModeResponseAreaHeight").value);
  if (gptCustomChatModePromptAreaHeight > screen_height) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值超过上限', `您所输入的参数超过上限 ${screen_height}`);
    document.getElementById("zotero-if-xul-gptCustomChatModePromptAreaHeight").value = defaultPromptHight;
    Zotero.Prefs.set('ai4paper.gptCustomChatModePromptAreaHeight', String(defaultPromptHight));
    return;
  }
  if (gptCustomChatModeResponseAreaHeight > screen_height) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值超过上限', `您所输入的参数超过上限 ${screen_height}`);
    document.getElementById("zotero-if-xul-gptCustomChatModeResponseAreaHeight").value = defaultResponseHight;
    Zotero.Prefs.set('ai4paper.gptCustomChatModeResponseAreaHeight', String(defaultResponseHight));
    return;
  }
  if (gptCustomChatModePromptAreaHeight < 0) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值不能小于 0', `您所输入的参数不能小于 0`);
    document.getElementById("zotero-if-xul-gptCustomChatModePromptAreaHeight").value = defaultPromptHight;
    Zotero.Prefs.set('ai4paper.gptCustomChatModePromptAreaHeight', String(defaultPromptHight));
    return;
  }
  if (gptCustomChatModeResponseAreaHeight < 0) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值不能小于 0', `您所输入的参数不能小于 0`);
    document.getElementById("zotero-if-xul-gptCustomChatModeResponseAreaHeight").value = defaultResponseHight;
    Zotero.Prefs.set('ai4paper.gptCustomChatModeResponseAreaHeight', String(defaultResponseHight));
    return;
  }
  Zotero.Prefs.set('ai4paper.gptEnableCustomChatModeGPTUIHeight', document.getElementById("zotero-if-xul-gptEnableCustomChatModeGPTUIHeight").checked);
  Zotero.Prefs.set('ai4paper.gptCustomChatModePromptAreaHeight', document.getElementById("zotero-if-xul-gptCustomChatModePromptAreaHeight").value);
  Zotero.Prefs.set('ai4paper.gptCustomChatModeResponseAreaHeight', document.getElementById("zotero-if-xul-gptCustomChatModeResponseAreaHeight").value);
  Zotero.AI4Paper.gptReaderSidePane_setUIHeight(defaultPromptHight, defaultResponseHight);
};
// 连续对话模式：重置 UI 参数
methodsBody.resetChatModeUIElementHeight = function () {
  let screen_height = parseInt(window.screen.height);
  let defaultPromptHight = '';
  let defaultResponseHight = '';
  if (parseInt(screen_height) <= 1000) {
    defaultPromptHight = (screen_height * 0.185).toFixed(2);
    defaultResponseHight = (screen_height * 0.446).toFixed(2);
  } else {
    defaultPromptHight = (screen_height * 0.173).toFixed(2);
    defaultResponseHight = (screen_height * 0.555).toFixed(2);
  }
  document.getElementById("zotero-if-xul-gptCustomChatModePromptAreaHeight").value = defaultPromptHight;
  document.getElementById("zotero-if-xul-gptCustomChatModeResponseAreaHeight").value = defaultResponseHight;
  Zotero.Prefs.set('ai4paper.gptEnableCustomChatModeGPTUIHeight', document.getElementById("zotero-if-xul-gptEnableCustomChatModeGPTUIHeight").checked);
  Zotero.Prefs.set('ai4paper.gptCustomChatModePromptAreaHeight', document.getElementById("zotero-if-xul-gptCustomChatModePromptAreaHeight").value);
  Zotero.Prefs.set('ai4paper.gptCustomChatModeResponseAreaHeight', document.getElementById("zotero-if-xul-gptCustomChatModeResponseAreaHeight").value);
  Zotero.AI4Paper.gptReaderSidePane_setUIHeight(defaultPromptHight, defaultResponseHight);
};
// 非连续对话模式：更新 UI 参数
methodsBody.updateUIElementHeight = function () {
  let screen_height = parseInt(window.screen.height);
  let defaultPromptHight = '';
  let defaultResponseHight = '';
  if (parseInt(screen_height) <= 1000) {
    defaultPromptHight = (screen_height * 0.27).toFixed(2);
    defaultResponseHight = (screen_height * 0.30).toFixed(2);
  } else {
    defaultPromptHight = (screen_height * 0.29).toFixed(2);
    defaultResponseHight = (screen_height * 0.395).toFixed(2);
  }
  let gptCustomPromptAreaHeight = parseInt(document.getElementById("zotero-if-xul-gptCustomPromptAreaHeight").value);
  let gptCustomResponseAreaHeight = parseInt(document.getElementById("zotero-if-xul-gptCustomResponseAreaHeight").value);
  if (gptCustomPromptAreaHeight > screen_height) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值超过上限', `您所输入的参数超过上限 ${screen_height}`);
    document.getElementById("zotero-if-xul-gptCustomPromptAreaHeight").value = defaultPromptHight;
    Zotero.Prefs.set('ai4paper.gptCustomPromptAreaHeight', String(defaultPromptHight));
    return;
  }
  if (gptCustomResponseAreaHeight > screen_height) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值超过上限', `您所输入的参数超过上限 ${screen_height}`);
    document.getElementById("zotero-if-xul-gptCustomResponseAreaHeight").value = defaultResponseHight;
    Zotero.Prefs.set('ai4paper.gptCustomResponseAreaHeight', String(defaultResponseHight));
    return;
  }
  if (gptCustomPromptAreaHeight < 0) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值不能小于 0', `您所输入的参数不能小于 0`);
    document.getElementById("zotero-if-xul-gptCustomPromptAreaHeight").value = defaultPromptHight;
    Zotero.Prefs.set('ai4paper.gptCustomPromptAreaHeight', String(defaultPromptHight));
    return;
  }
  if (gptCustomResponseAreaHeight < 0) {
    Zotero.AI4Paper.showProgressWindow(6000, '❌ 数值不能小于 0', `您所输入的参数不能小于 0`);
    document.getElementById("zotero-if-xul-gptCustomResponseAreaHeight").value = defaultResponseHight;
    Zotero.Prefs.set('ai4paper.gptCustomResponseAreaHeight', String(defaultResponseHight));
    return;
  }
  Zotero.Prefs.set('ai4paper.gptEnableCustomGPTUIHeight', document.getElementById("zotero-if-xul-gptEnableCustomGPTUIHeight").checked);
  Zotero.Prefs.set('ai4paper.gptCustomPromptAreaHeight', document.getElementById("zotero-if-xul-gptCustomPromptAreaHeight").value);
  Zotero.Prefs.set('ai4paper.gptCustomResponseAreaHeight', document.getElementById("zotero-if-xul-gptCustomResponseAreaHeight").value);
  Zotero.AI4Paper.gptReaderSidePane_setUIHeight(defaultPromptHight, defaultResponseHight);
};
// 非连续对话模式：重置 UI 参数
methodsBody.resetUIElementHeight = function () {
  let screen_height = parseInt(window.screen.height);
  let defaultPromptHight = '';
  let defaultResponseHight = '';
  if (parseInt(screen_height) <= 1000) {
    defaultPromptHight = (screen_height * 0.27).toFixed(2);
    defaultResponseHight = (screen_height * 0.30).toFixed(2);
  } else {
    defaultPromptHight = (screen_height * 0.29).toFixed(2);
    defaultResponseHight = (screen_height * 0.395).toFixed(2);
  }
  document.getElementById("zotero-if-xul-gptCustomPromptAreaHeight").value = defaultPromptHight;
  document.getElementById("zotero-if-xul-gptCustomResponseAreaHeight").value = defaultResponseHight;
  Zotero.Prefs.set('ai4paper.gptEnableCustomGPTUIHeight', document.getElementById("zotero-if-xul-gptEnableCustomGPTUIHeight").checked);
  Zotero.Prefs.set('ai4paper.gptCustomPromptAreaHeight', document.getElementById("zotero-if-xul-gptCustomPromptAreaHeight").value);
  Zotero.Prefs.set('ai4paper.gptCustomResponseAreaHeight', document.getElementById("zotero-if-xul-gptCustomResponseAreaHeight").value);
  Zotero.AI4Paper.gptReaderSidePane_setUIHeight(defaultPromptHight, defaultResponseHight);
};

/**
 * OpenAI max_tokens 设置
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.updateMaxtokens = function () {
  Zotero.Prefs.set('ai4paper.gptmaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scale").value));
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scalevalue").value = document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scale").value;
};
methodsBody.resetMaxtokens = function () {
  Zotero.Prefs.set('ai4paper.gptmaxtokens', methodsBody._maxtokenDefault);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scale").value = `${methodsBody._maxtokenDefault}`;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scalevalue").value = `${methodsBody._maxtokenDefault}`;
};
methodsBody.minusMaxtokens = function () {
  let currentValue = Zotero.Prefs.get('ai4paper.gptmaxtokens');
  let newValue = parseInt(currentValue) - methodsBody._stepValue;
  if (newValue < 0) {
    newValue = 0;
  }
  Zotero.Prefs.set('ai4paper.gptmaxtokens', newValue);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scale").value = newValue;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scalevalue").value = newValue;
};
methodsBody.plusMaxtokens = function () {
  let currentValue = Zotero.Prefs.get('ai4paper.gptmaxtokens');
  let newValue = parseInt(currentValue) + methodsBody._stepValue;
  if (newValue > methodsBody._maxtokenLimit) {
    newValue = methodsBody._maxtokenLimit;
  }
  Zotero.Prefs.set('ai4paper.gptmaxtokens', newValue);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scale").value = newValue;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scalevalue").value = newValue;
};

// 手动输入 openai max_tokens 值后，enter 更新，且禁用默认的 Enter 关闭窗口事件
methodsBody.checkKeyEnter = function (keys) {
  if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
    keys.returnValue = false;
    if (keys.preventDefault) {
      keys.preventDefault();
    }
    Zotero.Prefs.set('ai4paper.gptmaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scalevalue").value));
    document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scale").value = document.getElementById("zotero-if-xul-gptMaxtokensSetting-maxtokens-scalevalue").value;
  }
};

/**
 * API2D max_tokens 设置
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.updateAPI2DMaxtokens = function () {
  Zotero.Prefs.set('ai4paper.api2dmaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scale").value));
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scalevalue").value = document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scale").value;
};
methodsBody.resetAPI2DMaxtokens = function () {
  Zotero.Prefs.set('ai4paper.api2dmaxtokens', methodsBody._maxtokenDefault);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scale").value = `${methodsBody._maxtokenDefault}`;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scalevalue").value = `${methodsBody._maxtokenDefault}`;
};
methodsBody.minusAPI2DMaxtokens = function () {
  let currentValue = Zotero.Prefs.get('ai4paper.api2dmaxtokens');
  let newValue = parseInt(currentValue) - methodsBody._stepValue;
  if (newValue < 0) {
    newValue = 0;
  }
  Zotero.Prefs.set('ai4paper.api2dmaxtokens', newValue);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scale").value = newValue;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scalevalue").value = newValue;
};
methodsBody.plusAPI2DMaxtokens = function () {
  let currentValue = Zotero.Prefs.get('ai4paper.api2dmaxtokens');
  let newValue = parseInt(currentValue) + methodsBody._stepValue;
  if (newValue > methodsBody._maxtokenLimit) {
    newValue = methodsBody._maxtokenLimit;
  }
  Zotero.Prefs.set('ai4paper.api2dmaxtokens', newValue);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scale").value = newValue;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scalevalue").value = newValue;
};

// 手动输入 api2d max_tokens 值后，enter 更新，且禁用默认的 Enter 关闭窗口事件
methodsBody.checkKeyEnterAPI2D = function (keys) {
  if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
    keys.returnValue = false;
    if (keys.preventDefault) {
      keys.preventDefault();
    }
    Zotero.Prefs.set('ai4paper.api2dmaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scalevalue").value));
    document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scale").value = document.getElementById("zotero-if-xul-gptMaxtokensSetting-api2dmaxtokens-scalevalue").value;
  }
};

/**
 * ChatAnywhere max_tokens 设置
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.updateChatAnywhereMaxtokens = function () {
  Zotero.Prefs.set('ai4paper.chatanywheremaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scale").value));
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scalevalue").value = document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scale").value;
};
methodsBody.resetChatAnywhereMaxtokens = function () {
  Zotero.Prefs.set('ai4paper.chatanywheremaxtokens', methodsBody._maxtokenDefault);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scale").value = `${methodsBody._maxtokenDefault}`;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scalevalue").value = `${methodsBody._maxtokenDefault}`;
};
methodsBody.minusChatAnywhereMaxtokens = function () {
  let currentValue = Zotero.Prefs.get('ai4paper.chatanywheremaxtokens');
  let newValue = parseInt(currentValue) - methodsBody._stepValue;
  if (newValue < 0) {
    newValue = 0;
  }
  Zotero.Prefs.set('ai4paper.chatanywheremaxtokens', newValue);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scale").value = newValue;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scalevalue").value = newValue;
};
methodsBody.plusChatAnywhereMaxtokens = function () {
  let currentValue = Zotero.Prefs.get('ai4paper.chatanywheremaxtokens');
  let newValue = parseInt(currentValue) + methodsBody._stepValue;
  if (newValue > methodsBody._maxtokenLimit) {
    newValue = methodsBody._maxtokenLimit;
  }
  Zotero.Prefs.set('ai4paper.chatanywheremaxtokens', newValue);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scale").value = newValue;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scalevalue").value = newValue;
};

// 手动输入 ChatAnywhere max_tokens 值后，enter 更新，且禁用默认的 Enter 关闭窗口事件
methodsBody.checkKeyEnterChatAnywhere = function (keys) {
  if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
    keys.returnValue = false;
    if (keys.preventDefault) {
      keys.preventDefault();
    }
    Zotero.Prefs.set('ai4paper.chatanywheremaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scalevalue").value));
    document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scale").value = document.getElementById("zotero-if-xul-gptMaxtokensSetting-chatanywheremaxtokens-scalevalue").value;
  }
};

/**
 * GPT 自定 max_tokens 设置
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

methodsBody.updateGPTCustomMaxtokens = function () {
  Zotero.Prefs.set('ai4paper.gptcustommaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scale").value));
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scalevalue").value = document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scale").value;
};
methodsBody.resetGPTCustomMaxtokens = function () {
  Zotero.Prefs.set('ai4paper.gptcustommaxtokens', methodsBody._maxtokenDefault);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scale").value = `${methodsBody._maxtokenDefault}`;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scalevalue").value = `${methodsBody._maxtokenDefault}`;
};
methodsBody.minusGPTCustomMaxtokens = function () {
  let currentValue = Zotero.Prefs.get('ai4paper.gptcustommaxtokens');
  let newValue = parseInt(currentValue) - methodsBody._stepValue;
  if (newValue < 0) {
    newValue = 0;
  }
  Zotero.Prefs.set('ai4paper.gptcustommaxtokens', newValue);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scale").value = newValue;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scalevalue").value = newValue;
};
methodsBody.plusGPTCustomMaxtokens = function () {
  let currentValue = Zotero.Prefs.get('ai4paper.gptcustommaxtokens');
  let newValue = parseInt(currentValue) + methodsBody._stepValue;
  if (newValue > methodsBody._maxtokenLimit) {
    newValue = methodsBody._maxtokenLimit;
  }
  Zotero.Prefs.set('ai4paper.gptcustommaxtokens', newValue);
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scale").value = newValue;
  document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scalevalue").value = newValue;
};

// 手动输入 GPT 自定 max_tokens 值后，enter 更新，且禁用默认的 Enter 关闭窗口事件
methodsBody.checkKeyEnterGPTCustom = function (keys) {
  if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
    keys.returnValue = false;
    if (keys.preventDefault) {
      keys.preventDefault();
    }
    Zotero.Prefs.set('ai4paper.gptcustommaxtokens', parseInt(document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scalevalue").value));
    document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scale").value = document.getElementById("zotero-if-xul-gptMaxtokensSetting-gptcustommaxtokens-scalevalue").value;
  }
};