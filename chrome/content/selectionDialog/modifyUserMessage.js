var methodsBody = function () {};
methodsBody.init = async function () {
  methodsBody.io = window.arguments && window.arguments[0] ? window.arguments[0] : {
    dataIn: '',
    dataOut: null
  };
  // 根据 Zotero 版本调整样式
  Zotero.AI4Paper.updateTextAreaBox4ZoteroScheme(window);
  document.addEventListener('dialogaccept', () => methodsBody.acceptModification());
  let textarea = document.getElementById('userMessage');
  textarea.value = methodsBody.io.dataIn;

  // 聚焦，且能中文输入
  await Zotero.AI4Paper.focusWithIMEFix(textarea);

  // 等待完成渲染
  requestAnimationFrame(() => {
    textarea.scrollTop = 0;
  });
};
methodsBody.resetUserMessage = function () {
  document.getElementById('userMessage').value = methodsBody.io.dataIn;
};
methodsBody.acceptModification = function () {
  let newContent = document.getElementById('userMessage').value;
  methodsBody.io.dataOut = newContent;
  window.close();
};
methodsBody.checkKeyEnter = function (keys) {
  if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
    keys.returnValue = false;
    if (keys.preventDefault) {
      keys.preventDefault();
    }
    methodsBody.acceptModification();
  }
};
