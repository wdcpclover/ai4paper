function init() {
  Zotero.ZoteroIF.update_svg_icons(document);
  Zotero.ZoteroIF.updateTextAreaBox4ZoteroScheme(window);
  document.getElementById("message-edit").value = '';
  document.body.style.margin = 0x0;
  document.body.style.padding = 0x0;
  Zotero.ZoteroIF.gptNotesList_JS_injectStyle(window);
  Zotero.ZoteroIF.updateChatUI4HighlightStyle(window);
  document.body.style.overflowY = "hidden";
  const var1 = document.getElementById("chat-container");
  let var2 = window.screen.height;
  if (parseInt(var2) <= 0x3e8) {
    var1.style.height = var2 * 0.414 - 0x78 - 0x2 + 'px';
  } else {
    var1.style.height = "400px";
  }
  setOptions4marked();
  let var3 = Zotero.ZoteroIF._store_selecteGPTMessages;
  for (let var4 of var3) {
    let var5 = createMessageElement(var4.content, var4.role);
    var1.appendChild(var5);
  }
  Zotero.ZoteroIF.gptReaderSidePane_ChatMode_enhanceMessageElem(window);
}
function messageInput_checkKeyEnter(param1) {
  if (!param1.shiftKey && !param1.ctrlKey && !param1.altKey && !param1.metaKey && param1.keyCode === 0xd) {
    param1.returnValue = false;
    param1.preventDefault && param1.preventDefault();
    if (document.getElementById("finishEditing-button").style.display === "none") {
      Zotero.ZoteroIF.showProgressWindow(0x7d0, "❌ 请先选择一个要编辑的消息【AI4paper】", "请先选择一个要编辑的消息，再执行此操作。");
      return;
    }
    finishEditMessage();
  }
}
function finishEditMessage() {
  let var6 = document.getElementById("message-edit").value;
  document.getElementById("message-edit").editedMessage && (document.getElementById("message-edit").editedMessage.classList.contains("user") ? document.getElementById("message-edit").editedMessage.innerText = var6 : Zotero.ZoteroIF.gptReaderSidePane_ChatMode_renderMessageContent(document.getElementById("message-edit").editedMessage, var6), document.getElementById("message-edit").editedMessage.messageSourceText = var6, document.getElementById("message-edit").editedMessage.closest(".message").querySelector(".edit").innerHTML = Zotero.ZoteroIF.svg_icon_20px.edit, document.getElementById("message-edit").editedMessage.closest(".message").querySelector(".edit").title = "点击编辑", document.getElementById("message-edit").editedMessage.closest(".message").querySelector(".edit").isEditing = false, document.getElementById('message-edit').editedMessage = null, document.getElementById("message-edit").value = '');
  document.getElementById('finishEditing-button').style.display = "none";
  document.getElementById('cancelEditing-button').style.display = 'none';
}
function createMessageElement(param2, param3) {
  const var7 = document.createElement("div");
  var7.classList.add("message", param3);
  const var8 = document.createElement("div");
  var8.classList.add("message-row", param3);
  const var9 = document.createElement("div");
  var9.style.marginRight = "8px";
  var9.classList.add('edit', param3);
  var9.innerHTML = Zotero.ZoteroIF.svg_icon_20px.edit;
  var9.title = "点击编辑";
  var9.isEditing = false;
  var9.onclick = () => {
    if (!var9.isEditing) {
      var9.innerHTML = Zotero.ZoteroIF.svg_icon_20px.editing;
      var9.title = "正在编辑中...";
      var9.isEditing = true;
      setEditButtonsState(var9);
      let var10;
      param3 === 'user' ? var10 = var9.closest(".message").querySelector(".content").innerText : var10 = var9.closest(".message").querySelector(".content").messageSourceText;
      var10 && (document.getElementById("message-edit").value = var10, document.getElementById("message-edit").editedMessage = var9.closest(".message").querySelector(".content"), document.getElementById("finishEditing-button").style.display = '', document.getElementById("cancelEditing-button").style.display = '');
    } else {
      var9.innerHTML = Zotero.ZoteroIF.svg_icon_20px.edit;
      var9.title = "点击编辑";
      var9.isEditing = false;
      document.getElementById("message-edit").editedMessage = null;
      document.getElementById("message-edit").value = '';
      document.getElementById("finishEditing-button").style.display = "none";
      document.getElementById("cancelEditing-button").style.display = 'none';
    }
  };
  const var11 = document.createElement("div");
  var11.style.marginRight = "8px";
  var11.classList.add('avatar', param3);
  var11.innerHTML = param3 === 'user' ? Zotero.ZoteroIF.svg_icon_20px.avatar_user : Zotero.ZoteroIF.svg_icon_20px.gptviewReaderSidepane;
  const var12 = document.createElement("span");
  var12.classList.add('username');
  let var13 = Zotero.Prefs.get('zoteroif.gptUserName') ? Zotero.Prefs.get("zoteroif.gptUserName") : "User",
    var14 = Zotero.Prefs.get('zoteroif.gptservice') === "OpenAI" ? "ChatGPT" : Zotero.Prefs.get("zoteroif.gptservice");
  var12.textContent = param3 === "user" ? var13 : var14;
  var8.appendChild(var9);
  var8.appendChild(var11);
  var8.appendChild(var12);
  const var15 = document.createElement('div');
  var15.classList.add("content", param3);
  var15.classList.add("markdown-body");
  var15.style.textAlign = "justify";
  if (param3 === 'user') var15.innerText = param2;else {
    Zotero.ZoteroIF.gptReaderSidePane_ChatMode_renderMessageContent(var15, param2);
  }
  return var15.messageSourceText = param2, var7.appendChild(var8), var7.appendChild(var15), var7;
}
function setEditButtonsState(param4) {
  let var16 = document.querySelectorAll(".edit");
  for (let var17 of var16) {
    if (var17 != param4) {
      var17.innerHTML = Zotero.ZoteroIF.svg_icon_20px.edit;
      var17.title = "点击编辑";
      var17.isEditing = false;
    }
  }
}
function cancelEditMessage() {
  document.getElementById("message-edit").value = '';
  document.getElementById("finishEditing-button").style.display = "none";
  document.getElementById("cancelEditing-button").style.display = "none";
  let var18 = document.querySelectorAll(".edit");
  for (let var19 of var18) {
    var19.innerHTML = Zotero.ZoteroIF.svg_icon_20px.edit;
    var19.title = "点击编辑";
    var19.isEditing = false;
  }
}
function setOptions4marked() {
  marked && marked.setOptions({
    'renderer': new marked.Renderer(),
    'gfm': true,
    'tables': true,
    'escaped': true,
    'breaks': false,
    'pedantic': false,
    'sanitize': false,
    'smartLists': true,
    'smartypants': false,
    'highlight': function (param5, param6) {
      return hljs.highlightAuto(param5).value;
    }
  });
}
function updateButtonBgColor(param7) {
  let var20 = Zotero.getMainWindow()?.['matchMedia']('(prefers-color-scheme:\x20dark)')['matches'],
    var21 = !var20 ? '#f0f0f0' : "#545454";
  param7.style.backgroundColor = var21;
}