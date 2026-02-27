var methodsBody = function () {};
methodsBody.init = async function () {
  // 根据 Zotero 版本调整样式
  Zotero.ZoteroIF.updateTextAreaBox4ZoteroScheme(window);
  document.addEventListener('dialogaccept', () => methodsBody.acceptModification());
  this.io = window.arguments[0];
  let textarea = document.getElementById('userMessage');
  textarea.value = this.io.dataIn;

  // 聚焦，且能中文输入
  await Zotero.ZoteroIF.focusWithIMEFix(textarea);

  // 等待完成渲染
  requestAnimationFrame(() => {
    textarea.scrollTop = 0;
  });
};
methodsBody.resetUserMessage = function () {
  document.getElementById('userMessage').value = this.io.dataIn;
};
methodsBody.acceptModification = function () {
  let newContent = document.getElementById('userMessage').value;
  this.io.dataOut = newContent;
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