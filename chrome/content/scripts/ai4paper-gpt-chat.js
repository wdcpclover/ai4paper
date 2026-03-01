// AI4Paper GPT Chat Module - Chat mode UI, message handling, streaming, and send methods
// Also includes shared GPT reader infrastructure: note creation, history, stream parsing
Object.assign(Zotero.AI4Paper, {
  'addChatGPTNote_ChatMode': async function () {
    let selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID;
      var parentItem = Zotero.Items.get(itemID);
      if (parentItem && parentItem.parentItemID) {
        itemID = parentItem.parentItemID;
        parentItem = Zotero.Items.get(itemID);
      } else return Services.prompt.alert(window, "❌ 请重新选择", "当前文献无父条目，请创建父条目或选择其他文献！否则 ChatGPT 笔记无法保存。"), false;
    } else var parentItem = ZoteroPane.getSelectedItems()[0x0];
    if (parentItem === undefined) return Services.prompt.alert(window, "❌ 温馨提示：", '请先选择一个条目！'), false;
    if (!parentItem.isRegularItem()) {
      return Services.prompt.alert(window, '❌\x20温馨提示：', '您选择的不是常规条目！'), false;
    }
    let tagsList = [],
      itemTitle = parentItem.getField('title'),
      dialogResult = Zotero.AI4Paper.openDialogByType_modal('exportGPTNotes_ChatMode', itemTitle),
      tagsStr = dialogResult.tags;
    if (dialogResult === "cancel") return false;
    if (!dialogResult.messages.length) return window.alert('未发现任何\x20GPT\x20消息！'), false;
    let messages = dialogResult.messages;
    if (dialogResult.check) {
      if (dialogResult.item_title === '') return Services.prompt.alert(window, "❌ 出错了", "未选择改绑条目，或改绑条目尚未设定！"), false;
      let selectedTitle = dialogResult.item_title,
        attachItemsArr = JSON.parse(Zotero.Prefs.get("ai4paper.gptNotesAttachItemsObject")),
        found = false;
      for (let attachItem of attachItemsArr) {
        if (attachItem.title === selectedTitle.trim() && !found) {
          parentItem = Zotero.AI4Paper.findItemByIDORKey(attachItem.id);
          if (parentItem) {
            Zotero.Prefs.set("ai4paper.gptNotesLastSelectedItem", selectedTitle);
          } else return Services.prompt.alert(window, '❌\x20出错了', "您选择的改绑文献不存在！"), false;
          found = true;
        }
      }
      if (!found) return Services.prompt.alert(window, "❌ 出错了", "您选择的改绑文献不在所设定的笔记改绑条目中！"), false;
    }
    if (tagsStr) {
      tagsStr = tagsStr.split('\x0a');
      for (let tagLine of tagsStr) {
        tagLine != '' && (tagsList.push(tagLine), Zotero.AI4Paper.add2GPTNoteTags(tagLine), Zotero.AI4Paper.add2RecentGPTNoteTags(tagLine));
      }
    }
    var noteItem = await Zotero.AI4Paper.createNoteItem_basedOnTag(parentItem, "/ChatGPT");
    noteItem && (Zotero.AI4Paper.updateChatGPTRecordNote_ChatMode(parentItem, noteItem, messages, tagsList), Zotero.AI4Paper.focusReaderSidePane("gpt"));
  },
  'updateChatGPTRecordNote': async function (parentItem, noteItem, question, answer, tags) {
    let tagsHtml = '';
    for (let tag of tags) {
      tagsHtml = tagsHtml + " 🏷️ #🤖️/" + Zotero.AI4Paper.tagFormat(tag);
    }
    tagsHtml = tagsHtml + " 🏷️ #🤖️/ChatGPT";
    tagsHtml = tagsHtml.trim();
    for (let tagName of tags) {
      noteItem.addTag('🤖️/' + tagName);
      await noteItem.saveTx();
    }
    await Zotero.AI4Paper.Set2ReverseChatGPT(noteItem);
    let noteContent = noteItem.getNote();
    if (noteContent.indexOf("</h2>") != -0x1) {
      let h2EndIdx = noteContent.indexOf("</h2>");
      noteContent = noteContent.substring(h2EndIdx + 0x5);
    }
    answer = answer.replace(/\n\n+/g, "<p>");
    answer = answer.replace(/\n/g, "<br>");
    let blockquoteHtml = "<blockquote>" + ("<span class=\"chatgpt\">🙋</span><p>" + question) + "<p>" + "🤖<p>" + answer;
    if (noteContent.indexOf(blockquoteHtml) != -0x1) {
      return Zotero.AI4Paper.showProgressWindow(0x2ee0, '❌\x20重复的\x20ChatGPT\x20笔记【Zotero\x20One】', "检测到重复的 ChatGPT 对话笔记，无须再次保存！", "openai"), false;
    }
    var fullNoteHtml = "<h2 style=\"color: #00ae89;\">🤖️ ChatGPT 倒序>>>>>>></h2><blockquote>" + ("<span class=\"chatgpt\">🙋</span><p>" + question) + "<p>" + "🤖<p>" + answer + ("<p>" + tagsHtml) + "</blockquote>" + noteContent;
    noteItem.setNote(fullNoteHtml);
    await noteItem.saveTx();
    Zotero.AI4Paper.showProgressWindow(0x2328, "✅ 成功保存 ChatGPT 笔记【AI4paper】", "已保存本次 ChatGPT 对话至选定文献【" + parentItem.getField("title") + "】的笔记附件！", "openai");
    await new Promise(r1 => setTimeout(r1, 0x96));
    Zotero.AI4Paper.refreshObsidianNoteChatGPT(parentItem);
    await new Promise(r2 => setTimeout(r2, 0x32));
    Zotero.AI4Paper.refreshObsidianNoteChatGPT(parentItem);
  },
  'updateChatGPTRecordNote_ChatMode': async function (parentItem, noteItem, messages, tags) {
    let tagsHtml = '';
    for (let tag of tags) {
      tagsHtml = tagsHtml + " 🏷️ #🤖️/" + Zotero.AI4Paper.tagFormat(tag);
    }
    tagsHtml = tagsHtml + " 🏷️ #🤖️/ChatGPT";
    tagsHtml = tagsHtml.trim();
    for (let tagName of tags) {
      noteItem.addTag("🤖️/" + tagName);
      await noteItem.saveTx();
    }
    await Zotero.AI4Paper.Set2ReverseChatGPT(noteItem);
    let noteContent = noteItem.getNote();
    if (noteContent.indexOf("</h2>") != -0x1) {
      let h2EndIdx = noteContent.indexOf("</h2>");
      noteContent = noteContent.substring(h2EndIdx + 0x5);
    }
    let conversationHtml = '',
      msgIndex = 0x0;
    for (let msg of messages) {
      let roleEmoji = msg.role === "user" ? '🙋' : '🤖',
        msgContent = msg.content;
      msgContent = msgContent.replace(/\n\n+/g, "<p>").replace(/\n/g, '<p>');
      msgIndex === 0x0 ? conversationHtml = "<span class=\"chatgpt\">" + roleEmoji + '</span><p>' + msgContent : conversationHtml = conversationHtml + "<p>" + roleEmoji + '<p>' + msgContent;
      msgIndex++;
    }
    if (noteContent.indexOf(conversationHtml) != -0x1) return Zotero.AI4Paper.showProgressWindow(0x2ee0, '❌\x20重复的\x20ChatGPT\x20笔记【Zotero\x20One】', "检测到重复的 ChatGPT 对话笔记，无须再次保存！", 'openai'), false;
    var fullNoteHtml = "<h2 style=\"color: #00ae89;\">🤖️ ChatGPT 倒序>>>>>>></h2><blockquote>" + conversationHtml + "<p>" + tagsHtml + "</blockquote>" + noteContent;
    noteItem.setNote(fullNoteHtml);
    await noteItem.saveTx();
    Zotero.AI4Paper.showProgressWindow(0x2328, '✅\x20成功保存\x20ChatGPT\x20笔记【Zotero\x20One】', "已保存本次 ChatGPT 对话至选定文献【" + parentItem.getField("title") + "】的笔记附件！", "openai");
    await new Promise(r3 => setTimeout(r3, 0x96));
    Zotero.AI4Paper.refreshObsidianNoteChatGPT(parentItem);
    await new Promise(r4 => setTimeout(r4, 0x32));
    Zotero.AI4Paper.refreshObsidianNoteChatGPT(parentItem);
  },
  'Set2ReverseChatGPT': async function (noteItem) {
    var noteContent = noteItem.getNote();
    if (noteContent.indexOf("🤖️ ChatGPT 正序") != -0x1) {
      var startPositions = [],
        endPositions = [],
        blocks = [],
        openRegex = new RegExp("<blockquote>", 'g'),
        closeRegex = new RegExp('</blockquote>', 'g');
      while (openRegex.exec(noteContent) != null && closeRegex.exec(noteContent) != null) {
        startPositions.push(openRegex.lastIndex);
        endPositions.push(closeRegex.lastIndex);
      }
      for (i = 0x0; i < endPositions.length; i++) {
        let blockText = noteContent.substring(startPositions[startPositions.length - i - 0x1] - 0xc, endPositions[endPositions.length - i - 0x1]);
        blocks.push(blockText);
      }
      let reversedNote = "<h2 style=\"color: #00ae89;\">🤖️ ChatGPT 倒序>>>>>>></h2>" + blocks.join('');
      noteItem.setNote(reversedNote);
      await noteItem.saveTx();
    }
  },
  'gptReaderSidePane_changeChatMode': function () {
    if (window.document.getElementById("ai4paper-chatgpt-readersidepane")) {
      Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? (window.document.getElementById('ai4paper-chatgpt-readersidepane').src = "chrome://ai4paper/content/selectionDialog/gptChatUI.html", window.document.querySelector("#chatgpt-readerSidePane-user-icon").setAttribute('tooltiptext', '复位提问模板'), window.document.querySelector("#chatgpt-readerSidePane-send-icon").hidden = true) : (window.document.getElementById('ai4paper-chatgpt-readersidepane').src = "chrome://ai4paper/content/selectionDialog/gptReaderSidePane.html", window.document.querySelector('#chatgpt-readerSidePane-user-icon').setAttribute('tooltiptext', "清空问答区"), window.document.querySelector("#chatgpt-readerSidePane-send-icon").hidden = false);
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_changeUILayout();
    }
  },
  'gptReaderSidePane_changeChatMode_byShortCuts': function () {
    Zotero.Prefs.set('ai4paper.gptContinuesChatMode', !Zotero.Prefs.get("ai4paper.gptContinuesChatMode"));
    Zotero.AI4Paper.gptReaderSidePane_changeChatMode();
  },
  'gptReaderSidePane_ChatMode_changeUILayout': function () {
    let vbox = window.document.querySelector(".AI4Paper-gptSidePane-vbox");
    if (!vbox) return;
    if (Zotero.Prefs.get('ai4paper.gptContinuesChatMode')) {
      let section1 = vbox.querySelectorAll(".container-section")[0x1],
        section2 = vbox.querySelectorAll(".container-section")[0x2],
        section3 = vbox.querySelectorAll(".container-section")[0x3];
      section3.before(section1);
      section3.before(section2);
      section1 = vbox.querySelectorAll(".container-section")[0x1];
      section2 = vbox.querySelectorAll(".container-section")[0x2];
      section3 = vbox.querySelectorAll(".container-section")[0x3];
      section1.style.marginBottom = "12px";
      section2.style.marginBottom = "10px";
    } else {
      let section0 = vbox.querySelectorAll('.container-section')[0x0],
        sectionA = vbox.querySelectorAll(".container-section")[0x1],
        sectionB = vbox.querySelectorAll('.container-section')[0x2],
        sectionC = vbox.querySelectorAll(".container-section")[0x3];
      section0.after(sectionB);
      section0.after(sectionA);
      sectionA.style.marginBottom = "5px";
      sectionB.style.marginBottom = '';
    }
  },
  'gptReaderSidePane_ChatMode_scrollTop': function (iframeWin) {
    if (!iframeWin) {
      iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (!iframeWin) return false;
    }
    const chatContainer = iframeWin.document.getElementById("chat-container");
    chatContainer && (chatContainer.scrollTop = 0x0);
  },
  'gptReaderSidePane_ChatMode_scrollBottom': function (iframeWin) {
    if (!iframeWin) {
      iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
      if (!iframeWin) return false;
    }
    const chatContainer = iframeWin.document.getElementById("chat-container");
    chatContainer && (chatContainer.scrollTop = chatContainer.scrollHeight);
  },
  'gptReaderSidePane_ChatMode_locateAIReadingNotes': function (parentItem) {
    if (!parentItem) {
      let selectedTabID = Zotero_Tabs._selectedID;
      var reader = Zotero.Reader.getByTabID(selectedTabID);
      if (reader) {
        let itemID = reader.itemID;
        parentItem = Zotero.Items.get(itemID);
        if (parentItem && parentItem.parentItemID) {
          itemID = parentItem.parentItemID;
          parentItem = Zotero.Items.get(itemID);
        } else return Services.prompt.alert(window, '❌\x20请重新选择', "当前文献无父条目，请创建父条目或选择其他文献！否则文献解读笔记无法保存。"), false;
      } else parentItem = ZoteroPane.getSelectedItems()[0x0];
    }
    if (parentItem === undefined) {
      return Services.prompt.alert(window, "❌ 温馨提示：", "请先选择一个条目！"), false;
    }
    if (!parentItem.isRegularItem()) return Services.prompt.alert(window, "❌ 温馨提示：", "您选择的不是常规条目！"), false;
    var aiReadingNote = Zotero.AI4Paper.findNoteItem_basedOnTag(parentItem, Zotero.AI4Paper._aiReadingNoteTag);
    if (!aiReadingNote) {
      window.alert("当前文献尚未生成过【AI 文献解读】笔记附件！请通过 GPT 侧边栏【消息右键菜单】生成后再执行本操作。");
      return;
    } else Zotero.AI4Paper.gptReaderSidePane_ChatMode_locateAIReadingNotes_isGenerated(parentItem);
  },
  'gptReaderSidePane_ChatMode_locateAIReadingNotes_isGenerated': async function (parentItem) {
    let obsidianAppPath = Zotero.Prefs.get("ai4paper.obsidianapppath");
    if (!(await OS.File.exists(obsidianAppPath))) return window.alert('您设定的\x20Obsidian\x20应用路径不存在！请前往\x20Zotero\x20One\x20设置界面重新设定。'), false;
    let obsidianNotePath = Zotero.Prefs.get("ai4paper.obsidianmarkdownfolderpath");
    if (!(await OS.File.exists(obsidianNotePath))) return window.alert("您设定的 Obsidian 笔记导出路径不存在！请前往 AI4paper 设置界面重新设定。"), false;
    let qnKey = Zotero.AI4Paper.getQNKey(parentItem),
      mdExt = ".md",
      fullMdPath = obsidianNotePath + '\x5c' + qnKey + mdExt;
    (Zotero.isMac || Zotero.isLinux) && (fullMdPath = obsidianNotePath + '/' + qnKey + mdExt);
    let vaultName = Zotero.Prefs.get('ai4paper.obsidianvaultname'),
      baseUri = "obsidian://advanced-uri?vault=" + encodeURIComponent(vaultName) + "&filepath=";
    if (Zotero.isWin) {
      let vaultSuffix = '\x5c' + vaultName,
        vaultIdx = obsidianNotePath.indexOf(vaultSuffix);
      if (vaultIdx + vaultSuffix.length === obsidianNotePath.length) var encodedPath = encodeURIComponent(qnKey),
        obsidianUri = baseUri + encodedPath;else {
        let vaultDirPrefix = vaultSuffix + '\x5c',
          dirIdx = obsidianNotePath.indexOf(vaultDirPrefix),
          subDirStart = dirIdx + vaultDirPrefix.length,
          subDir = obsidianNotePath.substring(subDirStart);
        subDir = subDir.split('\x5c').join('/');
        var encodedPath = encodeURIComponent(subDir + '/' + qnKey),
          obsidianUri = baseUri + encodedPath;
      }
    }
    if (Zotero.isMac || Zotero.isLinux) {
      let vaultSuffix = '/' + vaultName,
        vaultIdx = obsidianNotePath.indexOf(vaultSuffix);
      if (vaultIdx + vaultSuffix.length === obsidianNotePath.length) {
        var encodedPath = encodeURIComponent(qnKey),
          obsidianUri = baseUri + encodedPath;
      } else {
        let vaultDirPrefix = vaultSuffix + '/',
          dirIdx = obsidianNotePath.indexOf(vaultDirPrefix),
          subDirStart = dirIdx + vaultDirPrefix.length,
          subDir = obsidianNotePath.substring(subDirStart);
        var encodedPath = encodeURIComponent(subDir + '/' + qnKey),
          obsidianUri = baseUri + encodedPath;
      }
    }
    obsidianUri = obsidianUri + "&block=KEYaiPapers";
    if (await OS.File.exists(fullMdPath)) {
      await Zotero.AI4Paper.refreshObsidianNoteChatGPT(parentItem);
      if (Zotero.Prefs.get('ai4paper.obsidianautoupdatenotes')) await new Promise(r5 => setTimeout(r5, 0x1e));else {
        await new Promise(r6 => setTimeout(r6, 0x32));
      }
      await Zotero.launchFileWithApplication(obsidianUri, obsidianAppPath);
      Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 定位 Obsidian【AI 文献解读】笔记【AI4paper】", "已为您定位 Obsidian【AI 文献解读】笔记！如若未成功定位，请在 Obsidian 中安装插件 Advanced URI。");
    } else {
      let confirmed = Services.prompt.confirm(window, "定位 Obsidian【AI 文献解读】笔记【AI4paper】", "当前文献还未生成 Obsidian Note，是否需要现在生成，并定位【AI 文献解读】笔记？");
      if (confirmed) {
        await Zotero.AI4Paper.refreshObsidianNoteChatGPT(parentItem);
        await new Promise(r7 => setTimeout(r7, 0x1e));
        if (await OS.File.exists(fullMdPath)) {
          await Zotero.launchFileWithApplication(obsidianUri, obsidianAppPath);
          Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 定位 Obsidian【AI 文献解读】笔记【AI4paper】", "已为您定位 Obsidian【AI 文献解读】笔记！如若未成功定位，请在 Obsidian 中安装插件 Advanced URI。");
        } else {
          await new Promise(r8 => setTimeout(r8, 0x32));
          if (await OS.File.exists(fullMdPath)) {
            await Zotero.launchFileWithApplication(obsidianUri, obsidianAppPath);
            Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20定位\x20Obsidian【AI\x20文献解读】笔记【Zotero\x20One】', "已为您定位 Obsidian【AI 文献解读】笔记！如若未成功定位，请在 Obsidian 中安装插件 Advanced URI。");
          }
        }
      }
    }
  },
  'gptReaderSidePane_ChatMode_copyAssistantMessages': function () {
    let iframeWin = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (iframeWin = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!iframeWin) {
      return;
    }
    let copiedMessages = [],
      assistantElems = iframeWin.document.querySelectorAll(".message.assistant"),
      count = 0x0;
    for (let msgEl of assistantElems) {
      count++;
      let contentEl = msgEl.querySelector('.content');
      if (contentEl) {
        if (contentEl.messageSourceText) {
          let formattedMsg = "🤖 第【" + count + '】条\x20AI\x20回复：\x0a\x0a' + contentEl.messageSourceText;
          copiedMessages.push(formattedMsg);
        }
      }
    }
    if (copiedMessages.length) {
      Zotero.AI4Paper.copy2Clipboard(copiedMessages.join('\x0a\x0a'));
      Zotero.AI4Paper.showProgressWindow(0x5dc, '拷贝全部\x20AI\x20回复【Zotero\x20One】', "✅ 拷贝成功！");
    } else Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝全部 AI 回复【AI4paper】", '未发现\x20AI\x20回复！');
  },
  'gptReaderSidePane_ChatMode_copyAllMessages': function (asMarkdown, iframeWin) {
    if (!iframeWin) {
      iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (!iframeWin) return false;
    }
    let copiedMessages = [],
      messageElems = iframeWin.document.querySelectorAll(".message");
    for (let msgEl of messageElems) {
      let avatarEl = msgEl.querySelector(".avatar");
      if (avatarEl.classList.contains("user")) {
        avatarEl = "🙋 用户问题";
      } else avatarEl = "🤖 AI 回复";
      let contentEl = msgEl.querySelector(".content");
      if (contentEl) {
        let textContent = contentEl.innerText;
        asMarkdown && (textContent = msgEl.classList.contains('user') ? contentEl.innerText : contentEl.messageSourceText);
        let formattedMsg = avatarEl + '：\x0a\x0a' + textContent;
        copiedMessages.push(formattedMsg);
      }
    }
    copiedMessages.length ? (Zotero.AI4Paper.copy2Clipboard(copiedMessages.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0x5dc, "拷贝全部" + (asMarkdown ? " Markdown " : '\x20') + "消息【AI4paper】", "✅ 拷贝成功！")) : Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝全部" + (asMarkdown ? " Markdown " : '\x20') + "消息【AI4paper】", '未发现任何消息！');
  },
  'gptReaderSidePane_ChatMode_go2MessageTop': function (event, fromContainer) {
    let messageEl = event.target.closest('.message');
    if (fromContainer) {
      messageEl = event.target.closest('.message-container').querySelector(".message");
    }
    messageEl && (messageEl.focus(), messageEl.scrollIntoView({
      'behavior': fromContainer ? "auto" : 'smooth',
      'block': "start"
    }));
  },
  'gptReaderSidePane_ChatMode_copyMessage': function (event, fromContainer) {
    let messageEl = event.target.closest(".message");
    if (fromContainer) {
      messageEl = event.target.closest(".message-container").querySelector(".message");
    }
    if (messageEl) {
      let contentEl = messageEl.querySelector(".content");
      contentEl && contentEl.innerText && (Zotero.AI4Paper.copy2Clipboard(contentEl.innerText), Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝消息【AI4paper】", '' + contentEl.innerText.substring(0x0, 0x19) + (contentEl.innerText.length > 0x1a ? '...' : ''), "openai"));
    }
  },
  'gptReaderSidePane_ChatMode_copyMessageSourceText': function (event, fromContainer) {
    let messageEl = event.target.closest(".message");
    fromContainer && (messageEl = event.target.closest(".message-container").querySelector(".message"));
    if (messageEl) {
      let contentEl = messageEl.querySelector(".content");
      if (contentEl) {
        let sourceText = messageEl.classList.contains("user") ? contentEl.innerText : contentEl.messageSourceText;
        sourceText && (Zotero.AI4Paper.copy2Clipboard(sourceText), Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝 Markdown 消息【AI4paper】", '' + sourceText.substring(0x0, 0x19) + (sourceText.length > 0x1a ? "..." : ''), "openai"));
      }
    }
  },
  'gptReaderSidePane_ChatMode_copyFileName': function (event) {
    let fileInfoEl = event.target.closest('.message').querySelector(".file-info");
    fileInfoEl && (Zotero.AI4Paper.copy2Clipboard(fileInfoEl.fileName), Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝附件标题【AI4paper】", fileInfoEl.fileName, 'openai'));
  },
  'gptReaderSidePane_ChatMode_copyFileFullText': function (event) {
    let fileInfoEl = event.target.closest('.message').querySelector(".file-info");
    if (fileInfoEl) {
      Zotero.AI4Paper.copy2Clipboard(fileInfoEl.fulltext);
      Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝附件全文【AI4paper】", '' + fileInfoEl.fulltext.substring(0x0, 0x19) + (fileInfoEl.fulltext.length > 0x1a ? "..." : ''));
    }
  },
  'gptReaderSidePane_ChatMode_openFileInZotero': function (event) {
    let fileInfoEl = event.target.closest(".message").querySelector('.file-info');
    if (fileInfoEl) {
      let currentReader = Zotero.Reader.getByTabID(Zotero_Tabs._selectedID);
      if (currentReader && currentReader._item === fileInfoEl.item) {
        Zotero.AI4Paper.showProgressWindow(0x5dc, "❌ 打开附件【AI4paper】", "当前打开的就是该附件，无需再打开。");
        return;
      }
      Zotero.Reader.open(fileInfoEl.item.itemID, null, {
        'openInWindow': false
      });
    }
  },
  'gptReaderSidePane_ChatMode_showFile': function (event) {
    let fileInfoEl = event.target.closest('.message').querySelector(".file-info");
    fileInfoEl && ZoteroPane_Local.showAttachmentInFilesystem(fileInfoEl.item.itemID);
  },
  'gptReaderSidePane_ChatMode_addMessage2SelectedAnnotation': async function (event, useSourceText) {
    let messageEl = event.target.closest(".message-container").querySelector(".message"),
      messageText;
    if (messageEl) {
      let contentEl = messageEl.querySelector(".content");
      contentEl && (useSourceText ? messageText = contentEl.messageSourceText : messageText = contentEl.innerText);
    }
    let currentReader = this.getCurrentReader(),
      betterUrl = Zotero.AI4Paper.betterURL();
    if (!currentReader || !betterUrl) return false;
    if (!currentReader._internalReader._lastView._selectedAnnotationIDs.length) return window.alert('请先选中一个注释！'), false;else {
      if (currentReader._internalReader._lastView._selectedAnnotationIDs.length === 0x1) {
        let annotationID = currentReader._internalReader._lastView._selectedAnnotationIDs[0x0],
          libraryID = Zotero.Items.get(currentReader.itemID).libraryID,
          annotationItem = null,
          retryCount = 0x0;
        while (!annotationItem?.["annotationType"]) {
          if (retryCount >= 0x12c) {
            Zotero.debug("AI4Paper: Waiting for annotationItem ready failed");
            return;
          }
          annotationItem = await Zotero.Items.getByLibraryAndKeyAsync(libraryID, annotationID);
          await Zotero.Promise.delay(0xa);
          retryCount++;
        }
        let existingComment = '' + annotationItem.annotationComment;
        existingComment === "null" ? annotationItem.annotationComment = '' + messageText : annotationItem.annotationComment = existingComment + '\x0a\x0a' + messageText;
        await annotationItem.saveTx();
      }
    }
  },
  'gptReaderSidePane_ChatMode_modifyUserMessage': function (event, iframeWin) {
    if (iframeWin._gptStreamRunning) {
      window.alert("当前 GPT 对话正在进行中...请等待消息接收完成，或者手动中止对话后，再执行本操作！");
      return;
    }
    let messageEl = event.target.closest(".message-container").querySelector(".message"),
      contentEl = messageEl.querySelector(".content"),
      sourceText = contentEl.messageSourceText,
      fileInfoEl = messageEl.querySelector('.file-info');
    fileInfoEl && (sourceText = fileInfoEl.prompt);
    let modifiedText = Zotero.AI4Paper.openDialogByType_modal("modifyUserMessage", sourceText);
    if (!modifiedText.trim()) {
      window.alert("用户消息不可为空！请重新修改。");
      return;
    }
    let allMessages = iframeWin.document.querySelectorAll(".message"),
      msgIndex = 0x0;
    for (let msgEl of allMessages) {
      if (msgEl === messageEl) break;
      msgIndex++;
    }
    let history = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory);
    history = history.slice(0x0, msgIndex);
    try {
      Zotero.AI4Paper._data_gptMessagesHistory = JSON.stringify(history);
    } catch (e) {
      Zotero.debug(e);
      return;
    }
    Zotero.AI4Paper.updateChatGPTReaderSidePane();
    iframeWin.document.getElementById("message-input").value = modifiedText;
    if (fileInfoEl) {
      iframeWin._hasFullText = true;
      iframeWin.document.getElementById("message-input").value = fileInfoEl.fulltext;
      iframeWin._modifiedPrompt = modifiedText;
    } else Zotero.AI4Paper.gptReaderSidePane_clearPrompt();
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_send();
    iframeWin._hasFullText = false;
    iframeWin._modifiedPrompt = '';
  },
  'gptReaderSidePane_ChatMode_updateAssistantMessage': function (event, iframeWin) {
    if (iframeWin._gptStreamRunning) {
      window.alert("当前 GPT 对话正在进行中...请等待消息接收完成，或者手动中止对话后，再执行本操作！");
      return;
    }
    let targetMessage = event.target.closest('.message-container').querySelector(".message"),
      allMessages = iframeWin.document.querySelectorAll('.message'),
      msgIndex = 0x0;
    for (let msgEl of allMessages) {
      if (msgEl === targetMessage) break;
      msgIndex++;
    }
    let history = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory);
    history = history.slice(0x0, msgIndex - 0x1);
    try {
      Zotero.AI4Paper._data_gptMessagesHistory = JSON.stringify(history);
    } catch (e) {
      Zotero.debug(e);
      return;
    }
    let prevUserText = allMessages[msgIndex - 0x1].querySelector(".content").messageSourceText;
    Zotero.AI4Paper.updateChatGPTReaderSidePane();
    iframeWin.document.getElementById("message-input").value = prevUserText;
    let fileInfoEl = allMessages[msgIndex - 0x1].querySelector(".file-info");
    fileInfoEl ? (iframeWin._hasFullText = true, iframeWin.document.getElementById("message-input").value = fileInfoEl.fulltext, iframeWin._modifiedPrompt = fileInfoEl.prompt) : Zotero.AI4Paper.gptReaderSidePane_clearPrompt();
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_send();
    iframeWin._hasFullText = false;
    iframeWin._modifiedPrompt = '';
  },
  'gptReaderSidePane_ChatMode_saveAIMessages2NoteItem': async function (iframeWin, messageType, createNew) {
    let typeLabels = {
        'assistantMessages': '\x20AI\x20回复',
        'allMessages': '消息'
      },
      typeTags = {
        'assistantMessages': "/全部AI回复",
        'allMessages': "/全部对话消息"
      },
      selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID;
      var parentItem = Zotero.Items.get(itemID);
      if (parentItem && parentItem.parentItemID) {
        itemID = parentItem.parentItemID;
        parentItem = Zotero.Items.get(itemID);
      } else {
        return false;
      }
    } else {
      var parentItem = ZoteroPane.getSelectedItems()[0x0];
    }
    if (parentItem === undefined) return false;
    if (!parentItem.isRegularItem()) {
      return false;
    }
    let htmlBlocks = [],
      messageElems;
    if (messageType === "assistantMessages") {
      messageElems = iframeWin.document.querySelectorAll(".message.assistant");
      for (let assistantEl of messageElems) {
        let contentEl = assistantEl.querySelector(".content");
        contentEl.innerText && htmlBlocks.push("<blockquote><span class=\"allAssistantMessages\" style=\"color: #f91e27\">🤖 AI 回复</span>" + contentEl.innerHTML + '</blockquote>');
      }
    } else {
      if (messageType === 'allMessages') {
        messageElems = iframeWin.document.querySelectorAll('.message');
        for (let msgEl of messageElems) {
          let contentEl = msgEl.querySelector(".content"),
            roleLabel,
            innerHTML = contentEl.innerHTML;
          contentEl.innerText && (contentEl.classList.contains("user") ? (roleLabel = "<span class=\"allMessages\" style=\"color: #0481ff\">🙋 用户问题</span>", innerHTML = '<p>' + innerHTML) : (roleLabel = "<span class=\"allMessages\" style=\"color: #f91e27\">🤖 AI 回复</span>", innerHTML = contentEl.innerHTML), htmlBlocks.push("<blockquote>" + roleLabel + innerHTML + "</blockquote>"));
        }
      }
    }
    if (!htmlBlocks.length) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 保存全部" + typeLabels[messageType], "未发现有内容的" + typeLabels[messageType] + '。');
      return;
    }
    let fullHtml = '<h2\x20style=\x22\x22>🤖️\x20全部【' + htmlBlocks.length + '】条' + typeLabels[messageType] + " ⌚️ " + Zotero.AI4Paper.getDateTime() + "</h2>" + htmlBlocks.join(''),
      noteItem;
    createNew ? (noteItem = new Zotero.Item('note'), noteItem.libraryID = parentItem.libraryID, noteItem.parentKey = parentItem.key, await noteItem.saveTx(), noteItem.addTag(typeTags[messageType]), await noteItem.saveTx()) : noteItem = await Zotero.AI4Paper.createNoteItem_basedOnTag(parentItem, typeTags[messageType]);
    noteItem.setNote(fullHtml);
    await noteItem.saveTx();
    Zotero.AI4Paper.showProgressWindow(0x7d0, '✅\x20保存全部' + typeLabels[messageType] + "至笔记附件", "成功保存【" + htmlBlocks.length + '】条' + typeLabels[messageType] + "至笔记附件");
    Zotero.AI4Paper.focusReaderSidePane("gpt");
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD': async function (iframeWin, messageScope, event, chatHistory) {
    let {
      content: mdContent,
      fileName: mdFileName
    } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(iframeWin, messageScope, event, chatHistory);
    var {
      FilePicker: FilePicker
    } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
    const filePicker = new FilePicker();
    filePicker.displayDirectory = OS.Constants.Path.homeDir;
    filePicker.init(window, "Export AI Messages as .md file...", filePicker.modeSave);
    filePicker.appendFilter('Markdown', "*.md");
    filePicker.defaultString = mdFileName;
    const pickerResult = await filePicker.show();
    if (pickerResult == filePicker.returnOK || pickerResult == filePicker.returnReplace) {
      let filePath = filePicker.file;
      filePath.split('.').pop().toLowerCase() != 'md' && (filePath += ".md");
      await Zotero.File.putContentsAsync(filePath, mdContent);
      Zotero.AI4Paper.showProgressWindow(0xbb8, '导出消息【Zotero\x20One】', '✅\x20成功导出消息至【' + filePath + '】！');
      if (await OS.File.exists(filePath)) {
        let fileObj = Zotero.File.pathToFile(filePath);
        try {
          fileObj.reveal();
        } catch (e) {
          Zotero.debug(e);
        }
      }
    }
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD': async function (iframeWin, messageScope, event, chatHistory) {
    let selectedCollection = ZoteroPane.getSelectedCollection();
    if (!selectedCollection) {
      window.alert("❌ 请先在 Zotero 主界面【我的文库】下，选中一个分类！");
      return;
    }
    let {
        content: mdContent,
        fileName: mdFileName
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(iframeWin, messageScope, event, chatHistory),
      createdItem = await Zotero.AI4Paper.createMarkdownInCollection(mdContent, mdFileName, selectedCollection);
    createdItem && Zotero.AI4Paper.showItemInCollection(createdItem);
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD': async function (iframeWin, messageScope, event, chatHistory) {
    let selectedItem = Zotero.getActiveZoteroPane().itemsView.getSelectedItems().filter(it => it.isRegularItem())[0x0];
    if (!selectedItem) {
      window.alert("❌ 请先在 Zotero 主界面【我的文库】下，选择一个常规条目");
      return;
    }
    let {
        content: mdContent,
        fileName: mdFileName
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(iframeWin, messageScope, event, chatHistory),
      attachment = await Zotero.AI4Paper.addMarkdownAttachment(mdContent, mdFileName, selectedItem);
    if (attachment) {
      Zotero.AI4Paper.showItemInCollection(selectedItem);
    }
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD': async function (iframeWin, messageScope, event, chatHistory) {
    let currentItem = Zotero.AI4Paper.getCurrentItem(true);
    if (!currentItem) {
      window.alert('❌\x20当前未打开任何文献！无法绑定。');
      return;
    }
    if (!currentItem.isRegularItem()) {
      window.alert("❌ 当前打开的文献无父条目，无法绑定。");
      return;
    }
    let {
        content: mdContent,
        fileName: mdFileName
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(iframeWin, messageScope, event, chatHistory),
      attachment = await Zotero.AI4Paper.addMarkdownAttachment(mdContent, mdFileName, currentItem);
    attachment && Zotero.AI4Paper.showItemInCollection(currentItem);
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD': async function (iframeWin, messageScope, event, chatHistory) {
    let {
        content: mdContent,
        fileName: mdFileName
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(iframeWin, messageScope, event, chatHistory),
      createdItem = await Zotero.AI4Paper.createStandaloneMarkdown(mdContent, mdFileName);
    if (createdItem) {
      Zotero.AI4Paper.showItemInCollection(createdItem);
    }
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD': async function (iframeWin, messageScope, event, chatHistory) {
    let exportPath = Zotero.Prefs.get('ai4paper.gptMarkdownMsgExportPath');
    if (exportPath && (await OS.File.exists(exportPath))) {
      let {
          content: mdContent,
          fileName: mdFileName
        } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(iframeWin, messageScope, event, chatHistory),
        fullPath = OS.Path.join(exportPath, mdFileName);
      await Zotero.File.putContentsAsync(fullPath, mdContent);
      await Zotero.AI4Paper.revealPath(fullPath);
    } else Services.prompt.alert(window, "导出至预设路径（.md）", "❌ 您尚未设置【预设路径】，或设置的路径不存在。\n\n请先前往【GPT 侧边栏 --> 基本设置 --> Markdown AI 消息导出路径预设】设置。");
  },
  'createMarkdownInCollection': async function (content, fileName, collection) {
    const tempPath = PathUtils.join(Zotero.getTempDirectory().path, fileName);
    await Zotero.File.putContentsAsync(tempPath, content);
    const libraryID = Zotero.Libraries.userLibraryID,
      importedItem = await Zotero.Attachments.importFromFile({
        'file': tempPath,
        'libraryID': libraryID
      });
    return importedItem.setField("title", fileName.replace(".md", '')), await importedItem.saveTx(), !collection && (collection = ZoteroPane.getSelectedCollection()), importedItem.addToCollection(collection.id), await importedItem.saveTx(), importedItem.addTag(Zotero.AI4Paper._aiMsgExportTag), await importedItem.saveTx(), await IOUtils.remove(tempPath), importedItem;
  },
  'addMarkdownAttachment': async function (content, fileName = "note.md", parentItem) {
    const tempPath = PathUtils.join(Zotero.getTempDirectory().path, fileName);
    await Zotero.File.putContentsAsync(tempPath, content);
    const importedItem = await Zotero.Attachments.importFromFile({
      'file': tempPath,
      'parentItemID': parentItem.id
    });
    return importedItem.setField("title", fileName.replace(".md", '')), await importedItem.saveTx(), importedItem.addTag(Zotero.AI4Paper._aiMsgExportTag), await importedItem.saveTx(), await IOUtils.remove(tempPath), importedItem;
  },
  'createStandaloneMarkdown': async function (content, fileName = "note.md") {
    const tempPath = PathUtils.join(Zotero.getTempDirectory().path, fileName);
    await Zotero.File.putContentsAsync(tempPath, content);
    const importedItem = await Zotero.Attachments.importFromFile({
      'file': tempPath,
      'libraryID': Zotero.Libraries.userLibraryID
    });
    return importedItem.setField('title', fileName.replace('.md', '')), await importedItem.saveTx(), importedItem.addTag(Zotero.AI4Paper._aiMsgExportTag), await importedItem.saveTx(), await IOUtils.remove(tempPath), importedItem;
  },
  'gptReaderSidePane_ChatMode_getMessagesMarkdown': function (iframeWin, messageScope, event, chatHistory) {
    let mdBlocks = [],
      messageElems,
      userHeader = '#\x20—————\x20🙋\x20用户问题\x20—————',
      assistantHeader = "# ————— 🤖 AI 回复 —————";
    if (messageScope === "currentMessage") {
      let messageEl = event.target.closest(".message-container").querySelector(".message"),
        contentEl = messageEl.querySelector('.content');
      mdBlocks.push((messageEl.classList.contains('user') ? userHeader : assistantHeader) + '\x0a\x0a' + contentEl.messageSourceText);
    } else {
      if (messageScope === "assistantMessages") {
        messageElems = iframeWin.document.querySelectorAll(".message.assistant");
        for (let assistantEl of messageElems) {
          let contentEl = assistantEl.querySelector(".content");
          contentEl.innerText && mdBlocks.push(assistantHeader + '\x0a\x0a' + contentEl.messageSourceText);
        }
      } else {
        if (messageScope === "allMessages") {
          messageElems = iframeWin.document.querySelectorAll(".message");
          for (let msgEl of messageElems) {
            let contentEl = msgEl.querySelector(".content"),
              headerStr = contentEl.classList.contains('user') ? userHeader : assistantHeader;
            if (contentEl.innerText) {
              mdBlocks.push(headerStr + '\x0a\x0a' + contentEl.messageSourceText);
            }
          }
        }
      }
    }
    let dateTimeStr = Zotero.AI4Paper.getDateTime(),
      scopeConfig = {
        'currentMessage': {
          'label': "当前消息",
          'contentTitle': '#\x20🤖️\x20当前消息\x20⌚️\x20' + dateTimeStr,
          'fileName': "当前消息 " + dateTimeStr.replace(/:/g, '-') + ".md"
        },
        'assistantMessages': {
          'label': " AI 回复",
          'contentTitle': "# 🤖️ 全部【" + mdBlocks.length + "】条 AI 回复 ⌚️ " + dateTimeStr,
          'fileName': "全部 AI 回复 " + dateTimeStr.replace(/:/g, '-') + '.md'
        },
        'allMessages': {
          'label': '消息',
          'contentTitle': "# 🤖️ 全部【" + mdBlocks.length + '】条消息\x20⌚️\x20' + dateTimeStr,
          'fileName': "全部消息 " + dateTimeStr.replace(/:/g, '-') + ".md"
        }
      };
    if (!mdBlocks.length) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 未发现内容【AI4paper】", "未发现有内容的" + scopeConfig?.[messageScope]?.["label"] + '。');
      return;
    }
    let frontMatter = "---\ntags: [" + Zotero.AI4Paper._aiMsgExportTag.replace('/', '') + "]\n导出时间: \"" + dateTimeStr + "\"\n---\n",
      fullMdContent = frontMatter + '\x0a' + scopeConfig?.[messageScope]?.["contentTitle"] + '\x0a\x0a\x0a' + mdBlocks.join("\n\n\n\n\n"),
      outputFileName = scopeConfig?.[messageScope]?.["fileName"];
    if (chatHistory) {
      let selectedChat = chatHistory.messages.find(m => m.id === chatHistory.currentSelectedId);
      outputFileName = selectedChat.title + '\x20' + dateTimeStr.replace(/:/g, '-') + ".md";
    }
    return {
      'content': fullMdContent,
      'fileName': outputFileName
    };
  },
  'createNoteItem_basedOnTag': async function (parentItem, tag, unused) {
    parentItem.isAnnotation() && (parentItem = parentItem?.["parentItem"]?.["parentItem"]);
    if (!parentItem || !parentItem.isRegularItem()) return;
    let existingNote = Zotero.AI4Paper.findNoteItem_basedOnTag(parentItem, tag);
    if (existingNote) return existingNote;else {
      let newNote = new Zotero.Item("note");
      return newNote.libraryID = parentItem.libraryID, newNote.parentKey = parentItem.key, await newNote.saveTx(), newNote.addTag(tag), await newNote.saveTx(), newNote;
    }
  },
  'findNoteItem_basedOnTag': function (parentItem, tag) {
    parentItem.isAnnotation() && (parentItem = parentItem?.['parentItem']?.["parentItem"]);
    if (!parentItem || !parentItem.isRegularItem()) return;
    let noteIDs = parentItem.getNotes(),
      noteItems = noteIDs.map(id => Zotero.Items.get(id)),
      matchingNotes = noteItems.filter(note => note.getTags().map(t => t.tag).includes(tag));
    return matchingNotes[0x0] || false;
  },
  'retryContent2NoteItem': async function (noteItem, htmlContent) {
    const savedNote = noteItem.getNote();
    if (!savedNote || savedNote.trim().length < 0x32) {
      Zotero.debug("AI 解读 - ⚠️ 笔记保存验证失败，尝试重新保存…");
      noteItem.setNote(htmlContent);
      await noteItem.saveTx();
      const retryNote = noteItem.getNote();
      if (!retryNote || retryNote.trim().length < 0x32) throw new Error("笔记内容保存后验证失败（可能是数据库写入问题）");
    }
  },
  'gptReaderSidePane_ChatMode_createAIReadingNoteItem': async function (eventOrMode, isAppend, useSourceText) {
    let selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID;
      var parentItem = Zotero.Items.get(itemID);
      if (parentItem && parentItem.parentItemID) {
        itemID = parentItem.parentItemID;
        parentItem = Zotero.Items.get(itemID);
      } else {
        return Services.prompt.alert(window, "❌ 请重新选择", '当前文献无父条目，请创建父条目或选择其他文献！否则文献解读笔记无法保存。'), false;
      }
    } else {
      var parentItem = ZoteroPane.getSelectedItems()[0x0];
    }
    if (parentItem === undefined) {
      return Services.prompt.alert(window, "❌ 温馨提示：", "请先选择一个条目！"), false;
    }
    if (!parentItem.isRegularItem()) return Services.prompt.alert(window, "❌ 温馨提示：", "您选择的不是常规条目！"), false;
    var noteItem = await Zotero.AI4Paper.createNoteItem_basedOnTag(parentItem, Zotero.AI4Paper._aiReadingNoteTag);
    if (noteItem) {
      let htmlContent = '';
      if (eventOrMode === "import") {
        htmlContent = Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(null, useSourceText);
      } else htmlContent = Zotero.AI4Paper.createAIReadingNoteItem_getHTMLContent(eventOrMode, useSourceText);
      let noteLinkHtml = '<a\x20href=\x22' + Zotero.AI4Paper.getItemLink(noteItem) + '\x22>笔记回链</a>',
        blockquoteHtml = "<blockquote><span class=\"AIReading\">🤖 AI 解读，快人一步</span>" + htmlContent + "<p>🚀 " + noteLinkHtml + "<p>🏷️ #🤖️/AI文献阅读</blockquote>",
        existingNote = noteItem.getNote();
      if (isAppend && existingNote.indexOf("<h2") != -0x1 && existingNote.indexOf("blockquote") != -0x1) {
        if (existingNote.indexOf(blockquoteHtml) != -0x1) return Zotero.AI4Paper.showProgressWindow(0x2ee0, "❌ 检测到重复【AI4paper】", "检测到您已添加过当前消息，无须再次添加！", "openai"), false;
        noteItem.setNote(existingNote + "<p>" + blockquoteHtml);
      } else noteItem.setNote("<h2 style=\"color: #00ae89;\">🤖️ AI 文献解读</h2>" + blockquoteHtml);
      await noteItem.saveTx();
      Zotero.AI4Paper.showProgressWindow(0xbb8, '✅\x20' + (isAppend ? "追加至" : "创建为") + "至文献解读笔记附件【AI4paper】", '已' + (isAppend ? '追加' : '创建') + "当前消息至【AI 文献解读】笔记附件！", 'openai');
      await Zotero.AI4Paper.addEmojiTag2ParentItemOnPaperAI(parentItem);
      Zotero.AI4Paper.focusReaderSidePane("gpt");
      await Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItem_updateObsidianNote(parentItem);
    }
  },
  'createAIReadingNoteItem_getHTMLContent': function (event, fromContainer) {
    let htmlContent = '',
      messageEl = event.target.closest(".message");
    if (fromContainer) {
      messageEl = event.target.closest(".message-container").querySelector(".message");
    }
    if (messageEl) {
      let contentEl = messageEl.querySelector(".content");
      htmlContent = contentEl.innerHTML;
      if (messageEl.querySelector('.avatar').classList.contains("user")) htmlContent = "<p>" + htmlContent;else {
        htmlContent = Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(null, contentEl.messageSourceText);
      }
    }
    return htmlContent;
  },
  'gptReaderSidePane_ChatMode_createAIReadingNoteItem_updateObsidianNote': async function (parentItem) {
    let obsidianAppPath = Zotero.Prefs.get("ai4paper.obsidianapppath");
    if (!(await OS.File.exists(obsidianAppPath))) return false;
    let obsidianNotePath = Zotero.Prefs.get("ai4paper.obsidianmarkdownfolderpath");
    if (!(await OS.File.exists(obsidianNotePath))) {
      return false;
    }
    let qnKey = Zotero.AI4Paper.getQNKey(parentItem),
      mdExt = ".md",
      fullMdPath = obsidianNotePath + '\x5c' + qnKey + mdExt;
    (Zotero.isMac || Zotero.isLinux) && (fullMdPath = obsidianNotePath + '/' + qnKey + mdExt);
    Zotero.Prefs.get('ai4paper.updateModifiedDate4PapersMatrix') && (await Zotero.AI4Paper.updateModifiedDate4PapersMatrix(parentItem));
    ((await OS.File.exists(fullMdPath)) || !(await OS.File.exists(fullMdPath)) && Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") || Zotero.Prefs.get('ai4paper.createAIReadingNoteOnPaperAI')) && (await Zotero.AI4Paper.refreshObsidianNoteChatGPT(parentItem), await new Promise(r9 => setTimeout(r9, 0x1e)), await Zotero.AI4Paper.refreshObsidianNoteChatGPT(parentItem));
  },
  'gptReaderSidePane_ChatMode_createAIReadingNoteItemAuto': async function (iframeWin, questionData) {
    let lastMessage,
      allMessages = iframeWin.document.querySelectorAll(".message");
    if (allMessages.length) {
      lastMessage = allMessages[allMessages.length - 0x1];
      if (!(lastMessage.className === "message assistant" && lastMessage.innerText)) return;
    }
    if (!lastMessage) return;
    var parentItem = Zotero.AI4Paper.findItemByIDORKey(questionData?.["fileID"]);
    if (parentItem && parentItem.parentItemID) parentItem = Zotero.Items.get(parentItem.parentItemID);else return false;
    var noteItem = Zotero.AI4Paper.findNoteItem_basedOnTag(parentItem, Zotero.AI4Paper._aiReadingNoteTag);
    if (noteItem) return;
    noteItem = await Zotero.AI4Paper.createNoteItem_basedOnTag(parentItem, Zotero.AI4Paper._aiReadingNoteTag);
    if (!noteItem) return;
    let contentEl = lastMessage.querySelector(".content"),
      renderedHtml = Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(null, contentEl.messageSourceText),
      noteLinkHtml = "<a href=\"" + Zotero.AI4Paper.getItemLink(noteItem) + "\">笔记回链</a>",
      fullNoteHtml = "<h2 style=\"color: #00ae89;\">🤖️ AI 文献解读</h2><blockquote><span class=\"AIReading\">🤖 AI 解读，快人一步</span>" + renderedHtml + "<p>🚀 " + noteLinkHtml + "<p>🏷️ #🤖️/AI文献阅读</blockquote>";
    noteItem.setNote(fullNoteHtml);
    await noteItem.saveTx();
    try {
      await Zotero.AI4Paper.retryContent2NoteItem(noteItem, fullNoteHtml);
    } catch (e) {
      Zotero.debug(e);
    }
    await Zotero.AI4Paper.addEmojiTag2ParentItemOnPaperAI(parentItem);
    if (Zotero.Prefs.get('ai4paper.updateModifiedDate4PapersMatrix')) {
      await Zotero.AI4Paper.updateModifiedDate4PapersMatrix(parentItem);
    }
    await Zotero.AI4Paper.refreshObsidianNoteChatGPT(parentItem);
  },
  'updateModifiedDate4PapersMatrix': async function (item) {
    item.addTag("only4test");
    await item.saveTx();
    item.removeTag("only4test");
    await item.saveTx();
  },
  'addEmojiTag2ParentItemOnPaperAI': async function (parentItem) {
    Zotero.Prefs.get("ai4paper.addEmojiTag2ParentItemOnPaperAI") && Zotero.Prefs.get("ai4paper.emojiTagAdded2ParentItemOnPaperAI").trim() && (parentItem.addTag(Zotero.Prefs.get('ai4paper.emojiTagAdded2ParentItemOnPaperAI').trim()), await parentItem.saveTx());
  },
  'getAIReadingNoteItemContent': async function (noteItem) {
    let noteLinkHtml = "<a href=\"" + Zotero.AI4Paper.getItemLink(noteItem) + "\">笔记回链</a>",
      footerHtml = "<blockquote>🚀 " + noteLinkHtml + "</blockquote>^KEYaiPapers";
    var noteContent = noteItem.getNote();
    if (noteContent.indexOf("<blockquote>") != -0x1) {
      var startPositions = [],
        endPositions = [],
        blocks = [],
        openRegex = new RegExp("<blockquote>", 'g'),
        closeRegex = new RegExp('</blockquote>', 'g');
      if (noteContent.indexOf("<span class=") != -0x1 || noteContent.indexOf('<blockquote>\x0a<p>🤖\x20AI\x20解读，快人一步') != -0x1) {
        if (noteContent.indexOf('<blockquote>\x0a<p>🤖\x20AI\x20解读，快人一步') != -0x1) {
          openRegex = new RegExp("<blockquote>\n<p>🤖 AI 解读，快人一步", 'g');
          closeRegex = new RegExp("#🤖️/AI文献阅读</p>\n</blockquote>", 'g');
          while (openRegex.exec(noteContent) != null && closeRegex.exec(noteContent) != null) {
            startPositions.push(openRegex.lastIndex);
            endPositions.push(closeRegex.lastIndex);
          }
          for (i = 0x0; i < endPositions.length; i++) {
            let blockText = noteContent.substring(startPositions[i] - 0x1d, endPositions[i]),
              blockKey = "^KEY" + Zotero.Utilities.Internal.md5(blockText).slice(0x0, 0x8).toUpperCase();
            blocks.push(blockText + '<p>' + blockKey);
          }
        }
        if (noteContent.indexOf('<span\x20class=') != -0x1) {
          startPositions = [];
          endPositions = [];
          openRegex = new RegExp("<blockquote><span class", 'g');
          closeRegex = new RegExp("#🤖️/AI文献阅读</blockquote>", 'g');
          while (openRegex.exec(noteContent) != null && closeRegex.exec(noteContent) != null) {
            startPositions.push(openRegex.lastIndex);
            endPositions.push(closeRegex.lastIndex);
          }
          for (i = 0x0; i < endPositions.length; i++) {
            let blockText2 = noteContent.substring(startPositions[i] - 0x17, endPositions[i]),
              blockKey2 = '^KEY' + Zotero.Utilities.Internal.md5(blockText2).slice(0x0, 0x8).toUpperCase();
            blocks.push(blockText2 + "<p>" + blockKey2);
          }
        }
      }
      let resultHtml = "<h2 style=\"color: blue;\">🤖️ AI 文献解读</h2>" + footerHtml + blocks.join('');
      return resultHtml;
    }
    return noteContent;
  },
  'gptReaderSidePane_ChatMode_setMessageAsTranslationSourceText': function (event) {
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      return Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 未开启【翻译侧边栏】", "您未开启【翻译侧边栏】！"), false;
    }
    var translateWin;
    if (window.document.getElementById('ai4paper-translate-readersidepane')) {
      translateWin = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;
    } else return false;
    if (!translateWin) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 未开启【翻译侧边栏】", '您未开启【翻译侧边栏】！');
      return;
    }
    let messageEl = event.target.closest('.message');
    if (messageEl) {
      let contentEl = messageEl.querySelector('.content');
      if (contentEl) {
        if (contentEl.innerText) {
          Zotero.AI4Paper.focusReaderSidePane("translate");
          translateWin.document.getElementById('ai4paper-translate-readerSidePane-sourcetext').value = contentEl.innerText;
          Zotero.AI4Paper.translateSourceText = contentEl.innerText;
          translateWin.document.getElementById("translateText_button").click();
        }
      }
    }
  },
  'gptReaderSidePane_ChatMode_onClickMenuItemSelectMessage': function () {
    let selectedTabID = Zotero_Tabs._selectedID;
    if (selectedTabID === 'zotero-pane') return false;
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    const contextMenu = window.document.getElementById(selectedTabID + "-context");
    if (!contextMenu) {
      return;
    }
    if (!Zotero.Prefs.get("ai4paper.gptUnderSelectionMessage")) {
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_showMessageCheckbox();
      Zotero.Prefs.set('ai4paper.gptUnderSelectionMessage', true);
    } else {
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_getSelectedMessages();
      if (Zotero.AI4Paper._store_selecteGPTMessages.length) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_hiddenMessageCheckbox();
        Zotero.Prefs.set("ai4paper.gptUnderSelectionMessage", false);
        Zotero.AI4Paper.addChatGPTNote_ChatMode();
        Zotero.AI4Paper._store_selecteGPTMessages = [];
      } else {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_hiddenMessageCheckbox();
        Zotero.Prefs.set("ai4paper.gptUnderSelectionMessage", false);
        Zotero.AI4Paper._store_selecteGPTMessages = [];
      }
    }
  },
  'gptReaderSidePane_ChatMode_getMessageContent': function (checkboxEl) {
    let messageEl = checkboxEl.closest(".message");
    if (messageEl) {
      let contentEl = messageEl.querySelector(".content");
      if (contentEl) {
        let textContent = messageEl.classList.contains("user") ? contentEl.innerText : contentEl.messageSourceText;
        if (textContent) return textContent;
      }
    }
    return '';
  },
  'gptReaderSidePane_ChatMode_showMessageCheckbox': function () {
    let iframeWin = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (iframeWin = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!iframeWin) return;
    let checkboxes = iframeWin.document.querySelectorAll('.checkbox');
    if (checkboxes.length) {
      for (let checkbox of checkboxes) {
        checkbox.style.display = '';
        checkbox.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked;
        checkbox.setAttribute('title', "点击勾选");
        checkbox.isChecked = false;
      }
    }
  },
  'gptReaderSidePane_ChatMode_checkAllMessages': function () {
    let iframeWin = null;
    window.document.getElementById('ai4paper-chatgpt-readersidepane') && (iframeWin = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!iframeWin) return;
    let checkboxes = iframeWin.document.querySelectorAll('.checkbox');
    if (checkboxes.length) for (let checkbox of checkboxes) {
      checkbox.style.display = '';
      checkbox.innerHTML = Zotero.AI4Paper.svg_icon_20px.checked;
      checkbox.setAttribute("title", "点击取消勾选");
      checkbox.isChecked = true;
    }
  },
  'gptReaderSidePane_ChatMode_hiddenMessageCheckbox': function () {
    let iframeWin = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (iframeWin = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!iframeWin) return;
    let checkboxes = iframeWin.document.querySelectorAll(".checkbox");
    if (checkboxes.length) for (let checkbox of checkboxes) {
      checkbox.style.display = "none";
      checkbox.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked;
      checkbox.setAttribute("title", "点击勾选");
      checkbox.isChecked = false;
    }
  },
  'gptReaderSidePane_ChatMode_resetMessageCheckbox': function () {
    let iframeWin = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (iframeWin = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!iframeWin) return;
    let checkboxes = iframeWin.document.querySelectorAll(".checkbox");
    if (checkboxes.length) for (let checkbox of checkboxes) {
      checkbox.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked;
      checkbox.setAttribute('title', "点击勾选");
      checkbox.isChecked = false;
    }
  },
  'gptReaderSidePane_ChatMode_getSelectedMessages': function () {
    Zotero.AI4Paper._store_selecteGPTMessages = [];
    let iframeWin = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (iframeWin = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!iframeWin) return;
    let checkboxes = iframeWin.document.querySelectorAll(".checkbox");
    for (let checkbox of checkboxes) {
      if (checkbox.isChecked) {
        let msgContent = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessageContent(checkbox),
          role;
        checkbox.nextSibling.classList.contains('user') ? role = "user" : role = "assistant";
        let msgObj = {
          'role': role,
          'content': msgContent
        };
        Zotero.AI4Paper._store_selecteGPTMessages.push(msgObj);
      }
    }
  },
  'gptReaderSidePane_ChatMode_copySelectedMessages': function () {
    Zotero.AI4Paper._store_selecteGPTMessages = [];
    let iframeWin = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (iframeWin = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!iframeWin) {
      return;
    }
    let copiedMessages = [],
      checkboxes = iframeWin.document.querySelectorAll(".checkbox");
    for (let checkbox of checkboxes) {
      if (checkbox.isChecked) {
        let msgContent = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessageContent(checkbox),
          roleLabel;
        checkbox.nextSibling.classList.contains("user") ? roleLabel = '🙋\x20用户问题' : roleLabel = "🤖 AI 回复";
        if (msgContent) {
          let formattedMsg = roleLabel + "：\n\n" + msgContent;
          copiedMessages.push(formattedMsg);
        }
      }
    }
    copiedMessages.length ? (Zotero.AI4Paper.copy2Clipboard(copiedMessages.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0x5dc, "拷贝已选消息【AI4paper】", "✅ 拷贝成功！")) : Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝已选消息【AI4paper】", "未发现已选消息！");
  },
  'gptReaderSidePane_ChatMode_updateUserName': function () {
    Zotero.AI4Paper._store_selecteGPTMessages = [];
    let iframeWin = null;
    window.document.getElementById('ai4paper-chatgpt-readersidepane') && (iframeWin = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!iframeWin) {
      return;
    }
    let avatars = iframeWin.document.querySelectorAll(".avatar");
    for (let avatarEl of avatars) {
      if (avatarEl.classList.contains('user')) {
        let userName = Zotero.Prefs.get("ai4paper.gptUserName") ? Zotero.Prefs.get("ai4paper.gptUserName") : "User";
        avatarEl.nextSibling.textContent = userName;
      }
    }
  },
  'gptReaderSidePane_setStickyScroll': function (doc, saveScrollPos) {
    const chatContainer = doc.getElementById("chat-container"),
      scrollBtn = doc.getElementById("scroll-to-bottom-btn"),
      threshold = 0x1e;
    chatContainer.addEventListener("scroll", () => {
      const distFromBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight;
      distFromBottom <= threshold ? (Zotero.Prefs.set("ai4paper.gptPinMessage", false), scrollBtn.style.display = "none") : (Zotero.Prefs.set('ai4paper.gptPinMessage', true), scrollBtn.style.display = "flex");
      Zotero_Tabs._selectedID != 'zotero-pane' && saveScrollPos && (Zotero.AI4Paper._savedContScrollTop = chatContainer.scrollTop);
    });
    scrollBtn.addEventListener("click", evt => {
      if (evt.shiftKey) {
        chatContainer.scrollTo({
          'top': 0x0,
          'behavior': "smooth"
        });
        return;
      }
      chatContainer.scrollTo({
        'top': chatContainer.scrollHeight,
        'behavior': 'smooth'
      });
    });
    scrollBtn.oncontextmenu = evt => {
      chatContainer.scrollTo({
        'top': 0x0,
        'behavior': "smooth"
      });
    };
  },
  'gptReaderSidePane_addExpandArrow': function (messageEl, role, iframeWin) {
    if (!iframeWin) {
      iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (!iframeWin) return false;
    }
    let arrowEl = null;
    if (role === "user") {
      arrowEl = iframeWin.document.createElement("div");
      arrowEl.className = "expand-arrow";
      arrowEl.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path fill=\"currentColor\" d=\"M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z\"/></svg>";
      arrowEl.style.display = "none";
      messageEl.appendChild(arrowEl);
    }
    return arrowEl;
  },
  'gptReaderSidePane_addClickEvent4ExpandArrow': function (messageEl, arrowEl, contentEl, role) {
    Zotero.Prefs.get('ai4paper.gptShowMessageExpandArrow') && (role === "user" && contentEl.classList.add('clamped'), role === "user" && arrowEl && (arrowEl.addEventListener("click", evt => {
      evt.stopPropagation();
      const isClamped = contentEl.classList.toggle("clamped");
      arrowEl.classList.toggle("rotated", !isClamped);
    }), contentEl.addEventListener("click", evt => {
      if (evt.shiftKey) {
        if (arrowEl.style.display === "flex") {
          const isClamped = contentEl.classList.toggle('clamped');
          arrowEl.classList.toggle('rotated', !isClamped);
          messageEl.focus();
          messageEl.scrollIntoView({
            'behavior': "auto",
            'block': "start"
          });
        }
        messageEl.ownerDocument.defaultView.getSelection && messageEl.ownerDocument.defaultView.getSelection().removeAllRanges();
      }
    }), setTimeout(() => {
      contentEl.scrollHeight > contentEl.clientHeight + 0x4 && (arrowEl.style.display = "flex");
    }, 0xc8)));
  },
  'gptReaderSidePane_addCSS4ExpandArrow': function () {
    let isDark = Zotero.getMainWindow()?.['matchMedia']("(prefers-color-scheme: dark)")["matches"];
    return "\n        /* --- 消息折叠功能 CSS --- */\n\n        /* relative 容器 */\n        .message.user {\n            position: relative !important;\n        }\n\n        /* 箭头按钮样式 */\n        .expand-arrow {\n            position: absolute;\n            top: 8px;\n            left: 8px;\n            width: 20px;\n            height: 20px;\n            border-radius: 50%; /* 圆形点击区域 */\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            cursor: pointer;\n            color: #999;\n            z-index: 10;\n            transition: transform 0.2s ease;\n        }\n\n        .expand-arrow:hover {\n            background-color: " + (isDark ? "rgba(255,255,255,0.1)" : "#fafffa") + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color:\x20' + (isDark ? "#fff" : "#999") + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20箭头旋转状态\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20.expand-arrow.rotated\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20transform:\x20rotate(180deg);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20折叠核心逻辑：默认限制\x208\x20行\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20.content.user.clamped\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20display:\x20-webkit-box\x20!important;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20-webkit-box-orient:\x20vertical\x20!important;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20-webkit-line-clamp:\x208\x20!important;\x20/*\x20限制\x208\x20行\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20line-clamp:\x208;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20overflow:\x20hidden\x20!important;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20text-overflow:\x20ellipsis\x20!important;\x20/*\x20显示\x20...\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20/*\x20解决“露头”关键：不要写死\x20max-height，而是通过\x20line-height\x20确保文本行严格对齐\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20line-height:\x201.4\x20!important;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20max-height:\x2011em\x20!important;\x20/*\x20略微小雨\x20line-height\x20的倍数\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20/*\x20关键：防止挤压感。使用\x20content-box\x20并固定高度\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20box-sizing:\x20content-box\x20!important;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
  },
  'gptReaderSidePane_ChatMode_createMessageElement': function (messageText, role, isStreaming, metadata) {
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return;
    const containerEl = iframeWin.document.createElement("div");
    containerEl.classList.add("message-container", role);
    const messageEl = iframeWin.document.createElement('div'),
      contextMenuEl = iframeWin.document.getElementById("context-menu");
    messageEl.classList.add("message", role);
    messageEl.style.fontSize = Zotero.Prefs.get('ai4paper.gptSidePaneFontSize');
    let expandArrow = Zotero.AI4Paper.gptReaderSidePane_addExpandArrow(messageEl, role);
    const messageRow = iframeWin.document.createElement("div");
    messageRow.classList.add("message-row", role);
    const checkboxEl = iframeWin.document.createElement("div");
    checkboxEl.style.marginRight = "8px";
    checkboxEl.classList.add("checkbox", role);
    checkboxEl.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked;
    checkboxEl.setAttribute('title', "点击勾选");
    checkboxEl.isChecked = false;
    if (Zotero.Prefs.get("ai4paper.gptUnderSelectionMessage")) {
      checkboxEl.style.display = '';
    } else checkboxEl.style.display = "none";
    checkboxEl.onclick = evt => {
      evt.stopPropagation();
      !checkboxEl.isChecked ? (checkboxEl.innerHTML = Zotero.AI4Paper.svg_icon_20px.checked, checkboxEl.setAttribute('title', "点击取消勾选"), checkboxEl.isChecked = true) : (checkboxEl.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked, checkboxEl.setAttribute("title", "点击勾选"), checkboxEl.isChecked = false);
    };
    const avatarEl = iframeWin.document.createElement('div');
    avatarEl.style.marginRight = "8px";
    avatarEl.classList.add("avatar", role);
    avatarEl.innerHTML = role === 'user' ? Zotero.AI4Paper.svg_icon_20px.avatar_user : Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
    avatarEl.title = "点击以拷贝消息";
    avatarEl.addEventListener("click", evt => {
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessageSourceText(evt);
    });
    const usernameSpan = iframeWin.document.createElement("span");
    usernameSpan.classList.add("username");
    let userName = Zotero.Prefs.get("ai4paper.gptUserName") ? Zotero.Prefs.get("ai4paper.gptUserName") : "User",
      serviceName = Zotero.Prefs.get("ai4paper.gptservice") === 'OpenAI' ? 'ChatGPT' : Zotero.Prefs.get("ai4paper.gptservice");
    role === 'user' && (iframeWin.document._service = metadata?.["service"] || null);
    if (role === "assistant" && iframeWin.document._service) {
      serviceName = iframeWin.document._service;
      iframeWin.document._service = null;
    }
    usernameSpan.textContent = role === "user" ? userName : serviceName;
    messageRow.appendChild(checkboxEl);
    messageRow.appendChild(avatarEl);
    messageRow.appendChild(usernameSpan);
    const contentDiv = iframeWin.document.createElement('div');
    contentDiv.classList.add('content', role);
    contentDiv.classList.add("markdown-body");
    contentDiv.style.fontSize = Zotero.Prefs.get("ai4paper.gptSidePaneFontSize");
    contentDiv.style.textAlign = "left";
    if (role === "user" || role === "assistant" && isStreaming) {
      contentDiv.innerText = messageText;
      (metadata?.["prompt"] || metadata?.['fulltext']) && (contentDiv.innerText = metadata?.["prompt"] + ':');
    } else {
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(contentDiv, messageText);
    }
    contentDiv.messageSourceText = messageText;
    Zotero.AI4Paper.gptReaderSidePane_addClickEvent4ExpandArrow(messageEl, expandArrow, contentDiv, role);
    messageEl.appendChild(messageRow);
    messageEl.appendChild(contentDiv);
    if (role === "user" && (metadata?.['prompt'] || metadata?.["fulltext"])) {
      const pdfCard = iframeWin.document.createElement("div");
      pdfCard.classList.add("pdf-card", role);
      pdfCard.onclick = evt => {
        if (evt.preventDefault) {
          evt.preventDefault();
        }
        evt.stopPropagation();
        if (evt.shiftKey) {
          let filesPopup = window.document.createXULElement("menupopup");
          filesPopup.id = 'AI4Paper-gptReaderSidePane-filesList-menupopup';
          filesPopup.addEventListener('popuphidden', () => {
            window.document.querySelector("#browser").querySelectorAll("#AI4Paper-gptReaderSidePane-filesList-menupopup").forEach(el => el.remove());
          });
          let firstChild = filesPopup.firstElementChild;
          while (firstChild) {
            firstChild.remove();
            firstChild = filesPopup.firstElementChild;
          }
          let fileInfoElems = iframeWin.document.querySelectorAll('.file-info');
          for (let fileInfo of fileInfoElems) {
            let menuItem = window.document.createXULElement("menuitem");
            menuItem.setAttribute("label", fileInfo.fileName);
            menuItem.addEventListener("command", evt => {
              fileInfo.focus();
              fileInfo.scrollIntoView({
                'behavior': "auto",
                'block': "center"
              });
            });
            filesPopup.appendChild(menuItem);
          }
          window.document.querySelector('#browser').querySelectorAll("#AI4Paper-gptReaderSidePane-filesList-menupopup").forEach(el => el.remove());
          window.document.querySelector('#browser')?.["appendChild"](filesPopup);
          filesPopup.openPopup(pdfIconEl, "after_start", 0x0, 0x0, false, false);
          pdfCard.ownerDocument.defaultView.getSelection && pdfCard.ownerDocument.defaultView.getSelection().removeAllRanges();
        }
      };
      const pdfIconEl = iframeWin.document.createElement("div");
      pdfIconEl.classList.add('pdf-icon', role);
      pdfIconEl.onclick = evt => {
        evt.preventDefault && evt.preventDefault();
        evt.stopPropagation();
        if (evt.shiftKey) {
          return;
        }
        let fileInfoData = pdfCard.querySelector(".file-info"),
          currentReader = Zotero.Reader.getByTabID(Zotero_Tabs._selectedID);
        if (currentReader && currentReader._item === fileInfoData.item) {
          Zotero.AI4Paper.showProgressWindow(0x5dc, "❌ 打开附件【AI4paper】", '当前打开的就是该附件，无需再打开。');
          return;
        }
        Zotero.Reader.open(fileInfoData.item.itemID, null, {
          'openInWindow': false
        });
      };
      pdfIconEl.addEventListener('mouseover', function () {
        this.style.cursor = "pointer";
      });
      pdfIconEl.addEventListener("mouseout", function () {
        this.style.cursor = "default";
      });
      pdfCard.appendChild(pdfIconEl);
      const fileInfoDiv = iframeWin.document.createElement("div");
      let fileItem = Zotero.AI4Paper.findItemByIDORKey(metadata?.['fileID']),
        displayName = '未在本文库找到本附件...(即来自其他\x20Zotero\x20账户）';
      fileItem && (displayName = fileItem.attachmentFilename);
      fileInfoDiv.classList.add("file-info", role);
      fileInfoDiv.prompt = metadata?.["prompt"];
      fileInfoDiv.fulltext = metadata?.["fulltext"];
      fileInfoDiv.fileName = displayName;
      fileInfoDiv.item = fileItem;
      fileInfoDiv.itemID = metadata?.['fileID'];
      const fileNameDiv = iframeWin.document.createElement('div');
      fileNameDiv.classList.add("file-name", role);
      fileNameDiv.innerText = displayName;
      fileNameDiv.title = displayName;
      fileInfoDiv.appendChild(fileNameDiv);
      const fileSizeDiv = iframeWin.document.createElement("div");
      fileSizeDiv.classList.add("file-size", role);
      fileSizeDiv.innerText = "PDF 解析成功";
      fileInfoDiv.appendChild(fileSizeDiv);
      pdfCard.appendChild(fileInfoDiv);
      messageEl.appendChild(pdfCard);
    }
    messageEl.addEventListener("contextmenu", function (contextEvt) {
      contextEvt.preventDefault();
      let isPdfCard = false;
      contextEvt.target.closest(".pdf-card") && (isPdfCard = true);
      Zotero.AI4Paper._contextmenuEvent_messageEl = contextEvt;
      contextMenuEl.style.display = 'block';
      contextMenuEl.style.left = contextEvt.pageX + 'px';
      contextMenuEl.style.top = contextEvt.pageY + 'px';
      let menuItems = iframeWin.document.querySelectorAll("#context-menu li");
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_getSelectedMessages();
      for (var menuIdx = 0x0; menuIdx < menuItems.length; menuIdx++) {
        ["拷贝附件标题", "拷贝附件全文", "打开附件", '在本地显示附件'].includes(menuItems[menuIdx].innerText) ? menuItems[menuIdx].style.display = !isPdfCard ? "none" : '' : menuItems[menuIdx].style.display = !isPdfCard ? '' : "none";
        if (menuIdx === 0x0) {
          if (Zotero.Prefs.get('ai4paper.gptUnderSelectionMessage') && Zotero.AI4Paper._store_selecteGPTMessages.length) menuItems[menuIdx].innerText = "完成导出消息选择";else {
            if (Zotero.Prefs.get('ai4paper.gptUnderSelectionMessage') && !Zotero.AI4Paper._store_selecteGPTMessages.length) menuItems[menuIdx].innerText = '退出消息选择';else !Zotero.Prefs.get("ai4paper.gptUnderSelectionMessage") && (menuItems[menuIdx].innerText = "选择消息以导出为卡片笔记");
          }
        } else menuIdx === 0x2 && (menuItems[menuIdx].style.display = !Zotero.Prefs.get("ai4paper.gptUnderSelectionMessage") || isPdfCard ? "none" : '');
      }
    });
    messageEl.addEventListener("click", async function (clickEvt) {
      if (role != "user" && clickEvt.shiftKey && !clickEvt.ctrlKey && !clickEvt.altKey && !clickEvt.metaKey) {
        clickEvt.preventDefault && clickEvt.preventDefault();
        clickEvt.stopPropagation();
        messageEl.focus();
        messageEl.scrollIntoView({
          'behavior': "auto",
          'block': "start"
        });
        messageEl.ownerDocument.defaultView.getSelection && messageEl.ownerDocument.defaultView.getSelection().removeAllRanges();
      }
      if (clickEvt.target != checkboxEl && Zotero.Prefs.get("ai4paper.gptUnderSelectionMessage")) {
        if (!checkboxEl.isChecked) {
          checkboxEl.innerHTML = Zotero.AI4Paper.svg_icon_20px.checked;
          checkboxEl.setAttribute('title', '点击取消勾选');
          checkboxEl.isChecked = true;
        } else {
          checkboxEl.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked;
          checkboxEl.setAttribute("title", "点击勾选");
          checkboxEl.isChecked = false;
        }
      }
    }, false);
    containerEl.appendChild(messageEl);
    const buttonsRow = iframeWin.document.createElement("div");
    buttonsRow.classList.add("message-buttons", role);
    let btn = iframeWin.document.createElement("div");
    return btn.classList.add("button", role), btn.classList.add("quickButton-Go2MessageTop"), btn.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonGo2MessageTop") ? '' : 'none', btn.innerHTML = Zotero.AI4Paper.svg_icon_16px.scrollTop, btn.setAttribute('title', "前往消息顶部"), btn.addEventListener("mousedown", async evt => {
      evt.preventDefault && evt.preventDefault();
      evt.stopPropagation();
      if (evt.shiftKey) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_scrollTop();
        iframeWin.getSelection && iframeWin.getSelection().removeAllRanges();
        return;
      }
      evt.button === 0x0 && (Zotero.AI4Paper.gptReaderSidePane_ChatMode_go2MessageTop(evt, true), iframeWin.getSelection && (await Zotero.Promise.delay(0x32), iframeWin.getSelection().removeAllRanges()));
    }), buttonsRow.appendChild(btn), btn = iframeWin.document.createElement('div'), btn.classList.add("button", role), btn.classList.add("quickButton-CopyMessage"), btn.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonCopyMessage") ? '' : "none", btn.innerHTML = Zotero.AI4Paper.svg_icon_16px.clipboard, btn.title = '拷贝消息', btn.addEventListener("mousedown", evt => {
      if (evt.preventDefault) {
        evt.preventDefault();
      }
      evt.stopPropagation();
      if (evt.shiftKey) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyAllMessages(false);
        return;
      }
      evt.button === 0x0 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessage(evt, true);
    }), buttonsRow.appendChild(btn), btn = iframeWin.document.createElement("div"), btn.classList.add("button", role), btn.classList.add("quickButton-CopyMessageSourceText"), btn.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonCopyMessageSourceText") ? '' : "none", btn.innerHTML = Zotero.AI4Paper.svg_icon_16px.markdown, btn.title = "拷贝 Markdown 消息", btn.addEventListener("mousedown", evt => {
      if (evt.preventDefault) {
        evt.preventDefault();
      }
      evt.stopPropagation();
      if (evt.shiftKey) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyAllMessages(true);
        return;
      }
      evt.button === 0x0 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessageSourceText(evt, true);
    }), buttonsRow.appendChild(btn), btn = iframeWin.document.createElement('div'), btn.classList.add("button", role), btn.classList.add('quickButton-SaveMessages'), btn.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonSaveMessages") ? '' : "none", btn.innerHTML = Zotero.AI4Paper.svg_icon_16px.save, btn.title = "保存消息", btn.onclick = evt => {
      evt.preventDefault && evt.preventDefault();
      evt.stopPropagation();
      let popupId = "AI4Paper-gptReaderSidePane-SaveMessages-menupopup",
        popup = Zotero.AI4Paper.createPopup_universal(popupId, true);
      const menuConfig = [{
        'label': "导出至选定分类（.md）",
        'children': [{
          'label': "当前消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD(iframeWin, 'currentMessage', evt);
          }
        }, {
          'label': "全部 AI 回复",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD(iframeWin, "assistantMessages");
          }
        }, {
          'label': "全部消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD(iframeWin, "allMessages");
          }
        }],
        'separator': true
      }, {
        'label': '导出至我的文库（.md）',
        'children': [{
          'label': "当前消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD(iframeWin, "currentMessage", evt);
          }
        }, {
          'label': '全部\x20AI\x20回复',
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD(iframeWin, "assistantMessages");
          }
        }, {
          'label': "全部消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD(iframeWin, "allMessages");
          }
        }],
        'separator': true
      }, {
        'label': "导出至预设路径（.md）",
        'children': [{
          'label': "当前消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD(iframeWin, "currentMessage", evt);
          }
        }, {
          'label': '全部\x20AI\x20回复',
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD(iframeWin, "assistantMessages");
          }
        }, {
          'label': "全部消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD(iframeWin, "allMessages");
          }
        }],
        'separator': true
      }, {
        'label': "导出至本地（.md）",
        'children': [{
          'label': "当前消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD(iframeWin, "currentMessage", evt);
          }
        }, {
          'label': "全部 AI 回复",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD(iframeWin, "assistantMessages");
          }
        }, {
          'label': "全部消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD(iframeWin, 'allMessages');
          }
        }],
        'separator': true
      }, {
        'label': "绑定至选定文献（.md）",
        'children': [{
          'label': "当前消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD(iframeWin, "currentMessage", evt);
          }
        }, {
          'label': "全部 AI 回复",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD(iframeWin, 'assistantMessages');
          }
        }, {
          'label': "全部消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD(iframeWin, "allMessages");
          }
        }]
      }, {
        'label': '绑定至打开文献（.md）',
        'children': [{
          'label': '当前消息',
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD(iframeWin, "currentMessage", evt);
          }
        }, {
          'label': "全部 AI 回复",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD(iframeWin, "assistantMessages");
          }
        }, {
          'label': '全部消息',
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD(iframeWin, "allMessages");
          }
        }],
        'separator': true
      }, {
        'label': "绑定为笔记附件",
        'children': [{
          'label': "全部 AI 回复（新建）",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveAIMessages2NoteItem(iframeWin, 'assistantMessages', true);
          }
        }, {
          'label': "全部消息（新建）",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveAIMessages2NoteItem(iframeWin, "allMessages", true);
          },
          'separator': true
        }, {
          'label': '全部\x20AI\x20回复（覆盖）',
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveAIMessages2NoteItem(iframeWin, "assistantMessages", false);
          }
        }, {
          'label': "全部消息（覆盖）",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveAIMessages2NoteItem(iframeWin, 'allMessages', false);
          }
        }]
      }];
      Zotero.AI4Paper.createMenuitem_universal(window, popup, menuConfig);
      popup.openPopup(evt.target, 'after_start', 0x0, 0x0, false, false);
    }, buttonsRow.appendChild(btn), role === 'user' && (btn = iframeWin.document.createElement('div'), btn.classList.add("button", role), btn.classList.add("quickButton-ModifyUserMessage"), btn.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonModifyUserMessage") ? '' : "none", btn.innerHTML = Zotero.AI4Paper.svg_icon_16px.rename_16px, btn.title = "修改后重新提问", btn.addEventListener("click", evt => {
      evt.preventDefault && evt.preventDefault();
      evt.stopPropagation();
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_modifyUserMessage(evt, iframeWin);
    }), buttonsRow.appendChild(btn)), role === "assistant" && (btn = iframeWin.document.createElement('div'), btn.classList.add('button', role), btn.classList.add("quickButton-UpdateAssistantMessage"), btn.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonUpdateAssistantMessage") ? '' : "none", btn.innerHTML = Zotero.AI4Paper.svg_icon_16px.update_16px, btn.title = "重新生成回复", btn.addEventListener("click", evt => {
      evt.preventDefault && evt.preventDefault();
      evt.stopPropagation();
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_updateAssistantMessage(evt, iframeWin);
    }), buttonsRow.appendChild(btn)), btn = iframeWin.document.createElement("div"), btn.classList.add("button", role), btn.classList.add("quickButton-AddMessage2SelectedAnnotation"), btn.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonAddMessage2SelectedAnnotation") ? '' : "none", btn.innerHTML = Zotero.AI4Paper.svg_icon_16px.importAnnotations, btn.title = "添加至注释评论", btn.addEventListener("mousedown", evt => {
      evt.preventDefault && evt.preventDefault();
      evt.stopPropagation();
      if (evt.shiftKey) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_addMessage2SelectedAnnotation(evt, false);
        return;
      }
      evt.button === 0x0 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_addMessage2SelectedAnnotation(evt, true);
    }), buttonsRow.appendChild(btn), btn = iframeWin.document.createElement("div"), btn.classList.add('button', role), btn.classList.add("quickButton-CreateAIReadingNoteItem"), btn.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonCreateAIReadingNoteItem") ? '' : "none", btn.innerHTML = Zotero.AI4Paper.svg_icon_16px.add_16px, btn.title = "追加至【文献解读】笔记附件", btn.addEventListener('mousedown', evt => {
      evt.preventDefault && evt.preventDefault();
      evt.stopPropagation();
      if (evt.shiftKey) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItem(evt, false, true);
        return;
      }
      evt.button === 0x0 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItem(evt, true, true);
    }), buttonsRow.appendChild(btn), containerEl.appendChild(buttonsRow), containerEl;
  },
  'gptReaderSidePane_ChatMode_renderMessageContent': function (targetEl, sourceText, iframeWin) {
    let processedText = sourceText;
    if (processedText.indexOf("<think>") === 0x0) {
      if (iframeWin?.['_gptStreamRunning'] && processedText.indexOf("</think>") === -0x1) {
        processedText = processedText + "</think>";
        processedText = processedText.replace("<think>", '<blockquote>').replace("</think>", '</blockquote>\x0a');
      } else processedText.indexOf("</think>") != -0x1 && (processedText = processedText.replace("<think>", '<blockquote>').replace("</think>", "</blockquote>\n"));
    } else {
      if (processedText.indexOf('\x0a<think>') === 0x0) {
        if (iframeWin?.["_gptStreamRunning"] && processedText.indexOf("</think>") === -0x1) {
          processedText = processedText + '</think>';
          processedText = processedText.replace("\n<think>", "<blockquote>").replace("</think>", "</blockquote>\n");
        } else {
          if (processedText.indexOf("</think>") != -0x1) {
            processedText = processedText.replace('\x0a<think>', "<blockquote>").replace('</think>', "</blockquote>\n");
          }
        }
      }
    }
    let refsHtml = '',
      refsIdx = processedText.indexOf("<div class=\"ZoteroOne-VolcanoSearch-Refs\"");
    refsIdx != -0x1 && (refsHtml = processedText.substring(refsIdx), processedText = processedText.substring(0x0, refsIdx));
    let markdownSrc = processedText,
      renderedHtml = Zotero.AI4Paper.renderMarkdown(markdownSrc);
    processedText = Zotero.AI4Paper.renderMarkdownLaTeX(processedText);
    refsHtml && (processedText += refsHtml, renderedHtml += refsHtml);
    if (targetEl) {
      targetEl.innerHTML = processedText;
    } else return renderedHtml;
  },
  'gptReaderSidePane_ChatMode_displayErrorMessage': function (errorMsg) {
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    let chatContainer = iframeWin.document.getElementById("chat-container"),
      allMessages = iframeWin.document.querySelectorAll(".message"),
      lastMessage = allMessages[allMessages.length - 0x1];
    if (lastMessage.className != "message assistant") {
      messageEl = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(errorMsg, 'assistant');
      chatContainer.appendChild(messageEl);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
      lastMessage.querySelector('.content').innerText = errorMsg;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  },
  'gptReaderSidePane_ChatMode_saveError2MessageHistory': function (errorMsg, history) {
    let errorEntry = {
      'role': "assistant",
      'content': errorMsg
    };
    history.push(errorEntry);
    Zotero.AI4Paper._data_gptCurrentUserMessage = JSON.stringify([]);
    Zotero.Prefs.set("ai4paper.gptStreamRunning", false);
    try {
      Zotero.AI4Paper._data_gptMessagesHistory = JSON.stringify(history);
    } catch (e) {
      Zotero.debug(e);
      return;
    }
    Zotero.AI4Paper.updateChatGPTReaderSidePane();
    Zotero.AI4Paper.saveChatHistory2Local();
  },
  'gptReaderSidePane_ChatMode_updateSelectedTabStreamingOut': function (streamText) {
    let iframeWin = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (iframeWin = window.document.getElementById('ai4paper-chatgpt-readersidepane').contentWindow);
    if (!iframeWin) {
      return;
    }
    let allMessages = iframeWin.document.querySelectorAll(".message");
    if (allMessages.length) {
      let chatContainer = iframeWin.document.getElementById("chat-container"),
        lastMessage = allMessages[allMessages.length - 0x1];
      if (lastMessage.className != "message assistant") {
        let newMsgEl = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(streamText, "assistant");
        chatContainer.appendChild(newMsgEl);
        !Zotero.Prefs.get('ai4paper.gptPinMessage') && (chatContainer.scrollTop = chatContainer.scrollHeight);
      } else {
        lastMessage.querySelector(".content").innerText = streamText;
        !Zotero.Prefs.get("ai4paper.gptPinMessage") && (chatContainer.scrollTop = chatContainer.scrollHeight);
      }
    }
  },
  'convertMessages': function () {
    let messagesArr = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory),
      geminiMessages = [];
    for (let msg of messagesArr) {
      let geminiRole, textContent;
      for (let key in msg) {
        if (key === 'role') {
          geminiRole = msg[key];
          geminiRole = geminiRole === "user" ? 'USER' : "MODEL";
        } else key === "content" && (textContent = msg[key]);
      }
      let geminiMsg = {
        'role': geminiRole,
        'parts': [{
          'text': textContent
        }]
      };
      geminiMessages.push(geminiMsg);
    }
    return geminiMessages;
  },
  'getSelectedPromptFromList': function () {
    try {
      let selectedPrompt = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").value;
      return Zotero.Prefs.set("ai4paper.chatgptprompttemplate", selectedPrompt), Zotero.AI4Paper.resolvePrompt(selectedPrompt);
    } catch (e) {
      return Zotero.debug(e), '';
    }
  },
  'resolvePrompt': function (promptAlias) {
    try {
      let userTemplates = JSON.parse(Zotero.Prefs.get("ai4paper.prompttemplateuserobject"));
      for (let tmpl of userTemplates) {
        if (tmpl.alias === promptAlias.trim()) {
          promptAlias = tmpl.realTemplate;
          break;
        }
      }
      let builtInPrompts = {
        'AI\x20解读论文\x20🔒': Zotero.Prefs.get("ai4paper.prompt4PaperAI"),
        '论文深度解读\x20🔒': Zotero.Prefs.get('ai4paper.prompt4PaperDeepInterpretation'),
        '论文简要剖析\x20🔒': Zotero.Prefs.get('ai4paper.prompt4PaperBriefAnalysis')
      };
      if (Object.keys(builtInPrompts).includes(promptAlias)) {
        promptAlias = builtInPrompts[promptAlias];
      }
      return promptAlias.replace(/🌝/g, '\x0a');
    } catch (e) {
      return Zotero.debug(e), promptAlias;
    }
  },
  'gptReaderSidePane_ChatMode_getQuestion': function (iframeWin) {
    let finalQuestion = '',
      inputText = iframeWin.document.getElementById("message-input").value.trim(),
      promptTemplate = Zotero.AI4Paper.getSelectedPromptFromList();
    iframeWin._hasFullText && iframeWin._modifiedPrompt && (promptTemplate = iframeWin._modifiedPrompt);
    if (promptTemplate === '无' || !promptTemplate) finalQuestion = inputText;else inputText ? finalQuestion = promptTemplate + ":\n\n" + inputText : finalQuestion = promptTemplate;
    let promptField = '',
      fulltextField = '',
      fileIDField = '',
      isFromPaperAI = iframeWin._fromPaperAI ? true : false;
    iframeWin._fromPaperAI = false;
    if (iframeWin._hasFullText) {
      promptField = promptTemplate;
      fulltextField = inputText;
      let currentReader = Zotero.Reader.getByTabID(Zotero_Tabs._selectedID);
      currentReader && (fileIDField = currentReader._item.key);
    }
    return {
      'question': finalQuestion,
      'prompt': promptField,
      'fulltext': fulltextField,
      'fileID': fileIDField,
      'fromPaperAI': isFromPaperAI
    };
  },
  'gptReaderSidePane_updateSendButtonState': function () {
    try {
      let targetWin = Zotero.Prefs.get('ai4paper.gptContinuesChatMode') ? Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt") : window,
        sendBtn = Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? targetWin.document.getElementById("send-button") : targetWin.document.querySelector("#chatgpt-readerSidePane-send-icon"),
        sendAction = () => Zotero.AI4Paper['' + (Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? "gptReaderSidePane_ChatMode_send" : "gptReaderSidePane_send")]();
      if (Zotero.Prefs.get("ai4paper.gptStreamRunning")) {
        sendBtn.innerHTML = Zotero.AI4Paper.svg_icon_20px.abort;
        sendBtn.setAttribute("title", "中止请求");
        sendBtn.onclick = () => {
          Zotero.AI4Paper.isAbortRequested = true;
          Zotero.Prefs.set("ai4paper.gptStreamRunning", false);
          targetWin._gptStreamRunning = false;
          Zotero.AI4Paper.gptReaderSidePane_updateStreamingUI();
          sendBtn.innerHTML = Zotero.AI4Paper.svg_icon_20px.send;
          sendBtn.setAttribute("title", '发送');
          sendBtn.onclick = sendAction;
        };
      } else {
        sendBtn.innerHTML = Zotero.AI4Paper.svg_icon_20px.send;
        sendBtn.setAttribute("title", '发送');
        sendBtn.onclick = sendAction;
      }
    } catch (e) {
      Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 刷新发送按钮出错了【AI4paper】", e.message);
    }
    Zotero.AI4Paper.gptReaderSidePane_updateStreamingUI();
  },
  'gptReaderSidePane_updateStreamingUI': function () {
    try {
      let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
      if (!iframeWin) return;
      const scrollBtn = iframeWin.document.getElementById('scroll-to-bottom-btn');
      if (!scrollBtn) return;
      iframeWin._gptStreamRunning ? scrollBtn.classList.add("is-streaming") : scrollBtn.classList.remove("is-streaming");
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'gptReaderSidePane_hiddeScrollBtn': function (iframeWin) {
    try {
      const scrollBtn = iframeWin.document.getElementById('scroll-to-bottom-btn');
      if (!scrollBtn) return;
      scrollBtn.style.display = 'none';
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'gptReaderSidePane_ChatMode_displayMessageChunk': function (iframeWin, chunkText, chatContainer) {
    if (!chunkText) return;
    Zotero.Prefs.set("ai4paper.chatgptresponse", chunkText);
    let allMessages = iframeWin.document.querySelectorAll(".message");
    if (allMessages.length) {
      let lastMessage = allMessages[allMessages.length - 0x1];
      if (lastMessage.className != 'message\x20assistant') {
        let newMsgEl = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(chunkText, 'assistant', true);
        Zotero.Prefs.get("ai4paper.renderMarkdownLaTeXRealTime") && (newMsgEl = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(chunkText, "assistant", false));
        chatContainer.appendChild(newMsgEl);
        if (!Zotero.Prefs.get("ai4paper.gptPinMessage")) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      } else {
        if (Zotero.Prefs.get('ai4paper.renderMarkdownLaTeXRealTime')) Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(lastMessage.querySelector('.content'), chunkText, iframeWin);else {
          lastMessage.querySelector(".content").innerText = chunkText;
        }
        lastMessage.querySelector('.content').messageSourceText = chunkText;
        !Zotero.Prefs.get("ai4paper.gptPinMessage") && (chatContainer.scrollTop = chatContainer.scrollHeight);
      }
    }
  },
  'gptReaderSidePane_ChatMode_enhanceMessageElem': function (iframeWin) {
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_dblclickToCopyCodeBlock(iframeWin);
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_addClickEvent2Links(iframeWin);
  },
  'gptReaderSidePane_ChatMode_dblclickToCopyCodeBlock': function (iframeWin) {
    if (!iframeWin) {
      iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (!iframeWin) return false;
    }
    iframeWin.document.querySelectorAll("pre").forEach(preEl => {
      if (!preEl._dblclickEvent_added) {
        preEl._dblclickEvent_added = true;
        preEl.addEventListener("dblclick", evt => {
          evt.stopPropagation();
          preEl.textContent && (Zotero.AI4Paper.copy2Clipboard(preEl.textContent), Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 成功拷贝代码块【AI4paper】", '' + preEl.textContent.substring(0x0, 0x19) + (preEl.textContent.length > 0x1a ? "..." : ''), "openai"));
        });
      }
    });
  },
  'gptReaderSidePane_ChatMode_addClickEvent2Links': function (iframeWin) {
    if (!iframeWin) {
      iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (!iframeWin) return false;
    }
    iframeWin.document.querySelectorAll('a').forEach(linkEl => {
      const linkText = linkEl.textContent;
      linkText.startsWith("zotero://") && (linkEl.style = "color: blue; text-decoration: underline; cursor: pointer;", !linkEl.href && (linkEl.href = linkText));
      !linkEl._clickEvent_added && (linkEl._clickEvent_added = true, linkEl.addEventListener("click", function (clickEvt) {
        clickEvt.preventDefault();
        clickEvt.stopPropagation();
        let href = this.getAttribute("href");
        if (linkText.startsWith('zotero://')) {
          if (clickEvt.shiftKey) {
            Zotero.AI4Paper.gptReaderSidePane_onClickZoteroItemLink(linkText, 'openNotes');
            return;
          }
          Zotero.AI4Paper.gptReaderSidePane_onClickZoteroItemLink(linkText);
        } else href && ZoteroPane.loadURI(href);
      }), linkText.startsWith("zotero://") && linkEl.addEventListener("contextmenu", contextEvt => {
        contextEvt.preventDefault();
        contextEvt.stopPropagation();
        Zotero.AI4Paper.gptReaderSidePane_onClickZoteroItemLink(linkText, "showItem");
      }, false));
    });
  },
  'gptReaderSidePane_onClickZoteroItemLink': async function (zoteroLink, action) {
    if (zoteroLink.includes("items/")) {
      let itemKey = zoteroLink.split("items/")[0x1];
      if (!itemKey) {
        window.alert('❌\x20未提取到\x20itemKey！');
        return;
      }
      let item = Zotero.AI4Paper.findItemByIDORKey(itemKey);
      if (!item) return;
      if (action === "showItem") Zotero.AI4Paper.showItemInCollection(item);else {
        if (action === 'openNotes' && Zotero?.['Notes']?.["open"]) {
          let aiReadingNote = Zotero.AI4Paper.findNoteItem_basedOnTag(item, Zotero.AI4Paper._aiReadingNoteTag);
          aiReadingNote ? Zotero.Notes.open(aiReadingNote.itemID, null, {
            'openInWindow': false
          }) : Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 未发现【AI 文献解读】笔记附件", "该条目暂无【AI 文献解读】笔记附件。");
        } else {
          if (item.isAttachment()) Zotero.Reader.open(item.itemID, null, {
            'openInWindow': false
          });else {
            let bestAttachment = await item.getBestAttachment();
            if (bestAttachment) Zotero.Reader.open(bestAttachment.itemID, null, {
              'openInWindow': false
            });else {
              Zotero.AI4Paper.showItemInCollection(item);
            }
          }
        }
      }
    } else {
      if (zoteroLink === "zotero://select/library/user") {
        Zotero_Tabs.select("zotero-pane");
        await ZoteroPane.collectionsView.selectLibrary(Zotero.Libraries.userLibraryID);
      } else {
        if (zoteroLink.includes("zotero://select/library/group/")) {
          let groupLibID = zoteroLink.replace("zotero://select/library/group/", '');
          Zotero_Tabs.select('zotero-pane');
          await ZoteroPane.collectionsView.selectLibrary(groupLibID);
        } else {
          if (zoteroLink.includes('zotero://select/library/feed/')) {
            let feedLibID = zoteroLink.replace("zotero://select/library/feed/", '');
            Zotero_Tabs.select("zotero-pane");
            await ZoteroPane.collectionsView.selectLibrary(feedLibID);
          } else {
            ZoteroPane.loadURI(zoteroLink);
          }
        }
      }
    }
  },
  'gptReaderSidePane_ChatMode_checkPreTags': function (htmlStr) {
    var preTags = htmlStr.match(/<pre>/g),
      doctypeTags = htmlStr.match(/<!DOCTYPE html>/g);
    return !preTags && !doctypeTags ? true : false;
  },
  'gptReaderSidePane_ChatMode_onStreamDone': function (iframeWin, history, responseText, questionData) {
    Zotero.Prefs.set('ai4paper.gptStreamRunning', false);
    iframeWin._gptStreamRunning = false;
    let assistantMsg = {
      'role': 'assistant',
      'content': responseText
    };
    history.push(assistantMsg);
    Zotero.AI4Paper.isAbortRequested = false;
    iframeWin.document.getElementById("send-button").innerHTML = Zotero.AI4Paper.svg_icon_20px.send;
    iframeWin.document.getElementById("send-button").setAttribute('title', '发送');
    iframeWin.document.getElementById('send-button').onclick = () => Zotero.AI4Paper.gptReaderSidePane_ChatMode_send();
    Zotero.AI4Paper._data_gptCurrentUserMessage = JSON.stringify([]);
    try {
      Zotero.AI4Paper._data_gptMessagesHistory = JSON.stringify(history);
    } catch (e) {
      Zotero.debug(e);
      return;
    }
    Zotero.AI4Paper.updateChatGPTReaderSidePane();
    Zotero.Prefs.get('ai4paper.gptChatHistoryViewerEnable') && !(questionData?.["fromPaperAI"] && Zotero.Prefs.get("ai4paper.excludeHistoryFromPaperAI")) && Zotero.AI4Paper.updateTransViewer('🙋<p>' + questionData?.['question'], '🤖️<p>' + Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(null, responseText));
    questionData?.["fromPaperAI"] && Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItemAuto(iframeWin, questionData);
    Zotero.AI4Paper.saveChatHistory2Local();
  },
  'gptReaderSidePane_ChatMode_onRequestDone': function (iframeWin, history, responseText, questionData) {
    let chatContainer = iframeWin.document.getElementById("chat-container"),
      assistantMsg = {
        'role': "assistant",
        'content': responseText
      };
    history.push(assistantMsg);
    let newMsgEl = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(responseText, "assistant");
    chatContainer.appendChild(newMsgEl);
    !Zotero.Prefs.get("ai4paper.gptPinMessage") && (chatContainer.scrollTop = chatContainer.scrollHeight);
    Zotero.AI4Paper._data_gptCurrentUserMessage = JSON.stringify([]);
    try {
      Zotero.AI4Paper._data_gptMessagesHistory = JSON.stringify(history);
    } catch (e) {
      Zotero.debug(e);
      return;
    }
    Zotero.AI4Paper.updateChatGPTReaderSidePane();
    if (Zotero.Prefs.get("ai4paper.translationviewerenable")) {
      Zotero.AI4Paper.updateTransViewer("🙋<p>" + questionData?.["question"], '🤖️<p>' + responseText);
    }
    questionData?.["fromPaperAI"] && Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItemAuto(iframeWin, questionData);
    Zotero.AI4Paper.saveChatHistory2Local();
  },
  'updateChatHistoryFileName': function (questionData) {
    try {
      if (!JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory).length) {
        let timeSuffix = '\x20⌚️\x20' + Zotero.AI4Paper.getDateTime().replace(/:/g, '-'),
          sanitizedTitle = Zotero.AI4Paper.sanitizeFilename(questionData.question.substring(0x0, 0x32));
        if (questionData?.['fileID']) {
          let fileItem = Zotero.AI4Paper.findItemByIDORKey(questionData?.['fileID']);
          if (fileItem) {
            let attachmentName = fileItem.attachmentFilename;
            if (attachmentName === 'PDF' && fileItem.parentItem) {
              sanitizedTitle = '🤖\x20' + Zotero.AI4Paper.sanitizeFilename(fileItem.parentItem.getField("title").substring(0x0, 0x5a));
            } else sanitizedTitle = "🤖 " + Zotero.AI4Paper.sanitizeFilename(attachmentName.substring(0x0, 0x5a));
          }
        }
        let historyFileName = '' + sanitizedTitle + timeSuffix + ".json";
        Zotero.AI4Paper._data_gptChatHistoryFileName = historyFileName;
      }
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'saveChatHistory2Local': async function () {
    try {
      if (Zotero.Prefs.get("ai4paper.gptChatHistoryEnable")) {
        let historyPath = Zotero.Prefs.get('ai4paper.gptChatHistoryLocalPath');
        if (historyPath && (await OS.File.exists(historyPath))) {
          let jsonContent = JSON.stringify(JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory), null, 0x2),
            fullPath = OS.Path.join(historyPath, Zotero.AI4Paper._data_gptChatHistoryFileName);
          await Zotero.File.putContentsAsync(fullPath, jsonContent);
        }
      }
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'readChatHistoryFromLocal': async function (dirPath) {
    let childPaths = await IOUtils.getChildren(dirPath),
      historyEntries = [];
    function fn21(fileName) {
      if (fileName.includes('⌚️')) {
        return fileName.substr(0x0, fileName.lastIndexOf('⌚️')).trim();
      }
      return fileName.substr(0x0, fileName.lastIndexOf(".json")).trim();
    }
    try {
      for (let filePath of childPaths) {
        if (filePath.toLowerCase().endsWith(".json")) {
          let fileInfo = await IOUtils.stat(filePath),
            fileContent = await Zotero.File.getContentsAsync(filePath);
          historyEntries.push({
            'title': fn21(PathUtils.filename(filePath)),
            'fileName': PathUtils.filename(filePath),
            'path': filePath,
            'lastModified': fileInfo.lastModified,
            'time': new Date(fileInfo.lastModified).toLocaleString().replace(/\//g, '-'),
            'size': fileInfo.size,
            'content': fileContent
          });
        }
      }
      historyEntries.sort((a, b) => b.lastModified - a.lastModified);
      historyEntries.forEach((entry, idx) => {
        historyEntries[idx].id = idx + 0x1;
      });
    } catch (e) {
      Zotero.debug(e);
    }
    return historyEntries;
  },
  'importChat': async function (isNewChat) {
    let historyPath = Zotero.Prefs.get("ai4paper.gptChatHistoryLocalPath");
    if (!historyPath || !(await Zotero.AI4Paper.isPathExists(historyPath))) {
      window.alert("❌ AI 对话历史【本地存储文件夹】尚未设置或不存在！请先前往【AI4paper 设置 --> GPT 设置 --> AI 对话历史】进行设置。");
      return;
    }
    let importResult = Zotero.AI4Paper.openDialogByType_modal("importChat", isNewChat);
    if (!importResult) return;
    let {
      msgArr: msgArr,
      question: firstQuestion
    } = importResult;
    if (isNewChat) {
      let timeSuffix = " ⌚️ " + Zotero.AI4Paper.getDateTime().replace(/:/g, '-'),
        sanitizedTitle = Zotero.AI4Paper.sanitizeFilename(firstQuestion.substring(0x0, 0x32)),
        historyFileName = '' + sanitizedTitle + timeSuffix + ".json",
        jsonContent = JSON.stringify(msgArr, null, 0x2),
        fullPath = OS.Path.join(historyPath, historyFileName);
      await Zotero.File.putContentsAsync(fullPath, jsonContent);
      Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 导入外部 AI 对话【AI4paper】", "成功导入外部 AI 对话至路径 👉 " + fullPath + " 👈");
    }
    return msgArr;
  },
  'hasPer_mission': function (showAlert) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) return showAlert && window.alert(Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF("4q2NJGqweHWzczCQcnVh5cDb5qzr5s+B5sT777zN6L+35ZnO5c6B44DRXn90AYKwJPjvwvf9sjBuMU4hXn90AYKwJF9vATBuMU4h5s+B5sT744DSJPjCmPf9lfb/hPb0v+bQlvT7uv+8hR=="))), false;
    if (showAlert && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded")) && !Zotero?.['Sync']?.["Data"]?.['Local']?.["_getAPIKeyLoginInfo"]()?.["password"]) {
      return Services.prompt.alert(window, Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF("4q2NJGqweHWzczCQcnVh5s+B5sT75p6J5q2E5Z+Y6Aj7")), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF("5pLp5cDb5qzr55n75c2WJGqweHWzczEomLknjMgmlJ3wwJaps7gmjZ3mwpEkhKCbc3Smdn8h6L6+572vJD0uQjEmlJansbYkhKImspanjKEoncwmwAYwwJamlLcmjKlhXn90AYKwJF9vATEnk5Mlv7cnm6Ent5YqjcUnoZQkhJJ="))), false;
    }
    return true;
  },
  'gptService_isTokenEmpty_APIVerified': function (apiKey, serviceName, showUI, mode, throwError) {
    let errorMsg = '';
    if (apiKey === '') {
      errorMsg = "❌ 尚未配置【" + serviceName + "】！\n\n请先前往【Zotero 设置 --> AI4paper --> GPT API】绑定【" + serviceName + "】API-Key！";
      if (mode === 'translation' && showUI) Zotero.AI4Paper.translateReaderSidePane_showErrorMessage(errorMsg);else mode === "chat" && showUI && window.alert(errorMsg);
      if (throwError) {
        throw new Error(errorMsg.replace('❌', ''));
      }
      return false;
    }
    if (Zotero.AI4Paper.gptServiceList()[serviceName].api_verifyResult != "验证成功") {
      errorMsg = "❌ 尚未验证【" + serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> GPT API】验证【" + serviceName + '】API-Key！';
      if (mode === "translation" && showUI) Zotero.AI4Paper.translateReaderSidePane_showErrorMessage(errorMsg);else mode === 'chat' && showUI && window.alert(errorMsg);
      if (throwError) {
        throw new Error(errorMsg.replace('❌', ''));
      }
      return false;
    }
    return true;
  },
  'getIframeWindowBySidePaneType': function (paneType) {
    let iframeWin = null;
    window.document.getElementById('ai4paper-' + paneType + "-readersidepane") && (iframeWin = window.document.getElementById('ai4paper-' + paneType + '-readersidepane').contentWindow);
    if (!iframeWin) {
      return false;
    }
    return iframeWin;
  },
  'checkJSON': function (jsonStr) {
    try {
      if (!jsonStr) return {
        'msg': "❌ 内容为空，请先输入！",
        'isJSON': false
      };
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) return {
        'msg': '❌\x20请输入对象类型\x20JSON，而非数组类型\x20JSON！',
        'isJSON': false
      };else return typeof parsed === "object" && parsed !== null ? {
        'msg': "✅ 通过，JSON 语法正确！",
        'isJSON': true,
        'parsedData': parsed
      } : {
        'msg': '❌\x20JSON\x20解析失败！',
        'isJSON': false
      };
    } catch (e) {
      return {
        'msg': "❌ JSON 解析失败：" + e,
        'isJSON': false
      };
    }
  },
  'gptReaderSidePane_addRequestArguments': function (requestBody, customIdx) {
    let isEnabled = Zotero.Prefs.get("ai4paper.gptcustomRequestArgumentsAddedEnable" + Zotero.AI4Paper.gptCustom_suffix[customIdx]);
    if (isEnabled) {
      try {
        let argStr = Zotero.Prefs.get("ai4paper.gptcustomRequestArgumentsAdded" + Zotero.AI4Paper.gptCustom_suffix[customIdx]),
          {
            msg: msg,
            isJSON = false,
            parsedData = {}
          } = Zotero.AI4Paper.checkJSON(argStr);
        isJSON && Object.keys(parsedData).length && Object.assign(requestBody, parsedData);
      } catch (e) {
        Zotero.debug(e);
      }
    }
  },
  'gptReaderSidePane_ChatMode_isStreamRunning': function (iframeWin) {
    if (iframeWin._gptStreamRunning && Zotero.Prefs.get("ai4paper.gptStreamRunning")) return Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 已有 GPT 正在进行【AI4paper】", "当前已有 GPT 正在进行中...如有需要，可手动中止后再发起请求。", "openai"), true;
    return false;
  },
  'gptReaderSidePane_isStreamRunning': function (unused) {
    if (Zotero.Prefs.get('ai4paper.gptStreamRunning')) return Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 已有 GPT 正在进行【AI4paper】", '当前已有\x20GPT\x20正在进行中...如有需要，可手动中止后再发起请求。', "openai"), true;
    return false;
  },
  'gptReaderSidePane_ChatMode_onSendUserMessage': function (iframeWin, chatContainer, questionData) {
    let userMsgEl = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(questionData.question, "user", null, questionData);
    chatContainer.appendChild(userMsgEl);
    iframeWin.document.getElementById("message-input").value = '';
    Zotero.Prefs.set("ai4paper.chatgptprompt", '');
    chatContainer.scrollTop = chatContainer.scrollHeight;
    iframeWin.document.querySelector(".openaiLogoContainer").style.display = "none";
  },
  'gptReaderSidePane_ChatMode_processMessagesOnRequest': function (questionData, serviceName, modelName) {
    let messagesToSend = Zotero.AI4Paper.resolveMessagesHistory(),
      userMsg = {
        'role': "user",
        'content': questionData.question
      };
    messagesToSend.push(userMsg);
    let historyArr = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory),
      userMsgFull = {
        'role': "user",
        'content': questionData.question,
        'prompt': questionData.prompt,
        'fulltext': questionData.fulltext,
        'fileID': questionData.fileID,
        'service': serviceName || 'OpenAI',
        'model': modelName || ''
      };
    return Zotero.AI4Paper.saveGPTCurrentUserMessage(userMsgFull), historyArr.push(userMsgFull), Zotero.AI4Paper.updateChatHistoryFileName(questionData), {
      'messagesToSend': messagesToSend,
      'messagesHistory': historyArr
    };
  },
  'gptReaderSidePane_ChatMode_processMessagesOnRequest_gemini': function (questionData, serviceName, modelName) {
    let geminiMessages = Zotero.AI4Paper.convertMessages(),
      userMsg = {
        'role': "USER",
        'parts': [{
          'text': questionData.question
        }]
      };
    geminiMessages.push(userMsg);
    let historyArr = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory),
      userMsgFull = {
        'role': "user",
        'content': questionData.question,
        'prompt': questionData.prompt,
        'fulltext': questionData.fulltext,
        'fileID': questionData.fileID,
        'service': serviceName || 'OpenAI',
        'model': modelName || ''
      };
    return Zotero.AI4Paper.saveGPTCurrentUserMessage(userMsgFull), historyArr.push(userMsgFull), Zotero.AI4Paper.updateChatHistoryFileName(questionData), {
      'messagesToSend': geminiMessages,
      'messagesHistory': historyArr
    };
  },
  'gptReaderSidePane_SetGeminiThinkingBudget': function (requestBody, modelName) {
    let thinkingConfig = {
        'thinkingConfig': {
          'includeThoughts': true,
          'thinkingBudget': 0x200
        }
      },
      budgetPref = Zotero.Prefs.get('ai4paper.geminiThinkingBudget'),
      budgetMap = {
        'disable': 0x0,
        'dynamic': -0x1,
        'low': 0x200,
        'moderate': 0x1388,
        'high': 0x4e20
      };
    if (Zotero.AI4Paper.geminiThinkingModels.non_adjustable.includes(modelName)) {
      thinkingConfig.thinkingConfig.thinkingBudget = budgetPref != "disable" ? budgetMap[budgetPref] : budgetMap.low;
      requestBody.generationConfig = thinkingConfig;
    } else Zotero.AI4Paper.geminiThinkingModels.adjustable.includes(modelName) && (thinkingConfig.thinkingConfig.thinkingBudget = budgetMap[budgetPref], requestBody.generationConfig = thinkingConfig);
  },
  'gptReaderSidePane_getRequestOptions': function (serviceName, apiKey, requestBody) {
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');
    if (serviceName === "Claude") {
      headers.append("x-api-key", apiKey);
      headers.append("anthropic-version", "2023-06-01");
    } else serviceName === "Gemini" ? headers.append('x-goog-api-key', apiKey) : (headers.append("Authorization", "Bearer " + apiKey), serviceName === "API2D" && headers.append('x-api2d-no-cache', 0x1));
    let requestOptions = {
      'method': "POST",
      'headers': headers,
      'body': JSON.stringify(requestBody),
      'redirect': "follow",
      'timeout': 0x30d40,
      'dataType': "text/event-stream"
    };
    return requestOptions;
  },
  'gptReaderSidePane_getHeadersObj': function (serviceName, apiKey) {
    if (serviceName === 'Claude') {
      return {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': "2023-06-01"
      };
    } else {
      if (serviceName === "Gemini") {
        return {
          'Content-Type': "application/json",
          'x-goog-api-key': apiKey
        };
      } else {
        if (serviceName === "API2D") {
          return {
            'Content-Type': "application/json",
            'Authorization': "Bearer " + apiKey,
            'x-api2d-no-cache': 0x1
          };
        } else return {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey
        };
      }
    }
  },
  'gptReaderSidePane_onStreamStart': function (iframeWin) {
    Zotero.AI4Paper.isAbortRequested = false;
    Zotero.Prefs.set("ai4paper.gptStreamRunning", true);
    iframeWin._gptStreamRunning = true;
    Zotero.AI4Paper.gptReaderSidePane_updateSendButtonState();
  },
  'catchStreamError_ChatMode': function (serviceName, errorCodeLink, iframeWin, history, responseStr) {
    try {
      if (typeof JSON.parse(responseStr) === 'object') {
        let errorDetail, errorSummary;
        if (JSON.parse(responseStr).error || JSON.parse(responseStr).object === "error") {
          errorDetail = "⚠️ [请求错误]\n\n❌ " + serviceName + " 出错啦：" + responseStr + "\n\n🔗【" + serviceName + " 错误码含义】请见：\n" + errorCodeLink;
          errorSummary = "👉 ❌ " + serviceName + " 出错啦：" + responseStr + "\n\n🔗【" + serviceName + " 错误码含义】请见：" + errorCodeLink;
        } else JSON.parse(responseStr)[0x0]?.["error"] && (errorDetail = '⚠️\x20[请求错误]\x0a\x0a❌\x20' + serviceName + " 出错啦：\"error\": {\n\"code\": " + JSON.parse(responseStr)[0x0]?.["error"]["code"] + ",\n\"message\": \"" + JSON.parse(responseStr)[0x0]?.["error"]["message"] + "\",\n}\n\n🔗【" + serviceName + '\x20错误码含义】请见：\x0a' + errorCodeLink, errorSummary = "👉 ❌ " + serviceName + '\x20出错啦：\x22error\x22:\x20{\x0a\x22code\x22:\x20' + JSON.parse(responseStr)[0x0]?.['error']["code"] + ',\x0a\x22message\x22:\x20\x22' + JSON.parse(responseStr)[0x0]?.["error"]["message"] + "\",\n}\n\n🔗【" + serviceName + " 错误码含义】请见：" + errorCodeLink);
        if (errorDetail || errorSummary) {
          return Zotero.AI4Paper.gptReaderSidePane_ChatMode_displayErrorMessage(errorDetail), Zotero.AI4Paper.showProgressWindow(0x1388, '❌【' + serviceName + "】请求错误", errorSummary, "openai"), Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveError2MessageHistory(errorDetail, history), iframeWin._gptStreamRunning = false, false;
        }
      }
    } catch (e) {
      return Zotero.debug('GPT\x20Stream\x20Error:\x20' + e), true;
    }
    return true;
  },
  'catchFetchError_ChatMode': function (serviceName, errorCodeLink, iframeWin, history, fetchError) {
    let errorDetail = "⚠️ [请求错误]\n\n❌ " + serviceName + " 出错啦：" + fetchError + "\n\n🔗【" + serviceName + " 错误码含义】请见：\n" + errorCodeLink,
      errorSummary = "👉 ❌ " + serviceName + " 出错啦：" + fetchError + '\x0a\x0a🔗【' + serviceName + " 错误码含义】请见：" + errorCodeLink;
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_displayErrorMessage(errorDetail);
    Zotero.AI4Paper.showProgressWindow(0x1388, '❌【' + serviceName + "】请求错误", errorSummary, "openai");
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveError2MessageHistory(errorDetail, history);
    iframeWin._gptStreamRunning = false;
  },
  'resolveStreamChunk_Gemini': function (chunk, streamState) {
    try {
      const accumulated = streamState.temp + chunk,
        matches = accumulated.match(/{\s*"text":\s*"(.*?)"(?:,\s*"thought":\s*true)?\s*}\s*]\s*,\s*"role":\s*"[^"]*"/g);
      if (matches.length) {
        for (let matchStr of matches) {
          let parsed = JSON.parse(matchStr.slice(0x0, -0x21));
          if (parsed.text) {
            !streamState.hasReasoning_content && parsed.thought && (streamState.hasReasoning_content = true, streamState.reasoning_contentStart = true);
            if (streamState.hasReasoning_content) {
              if (streamState.reasoning_contentStart) {
                streamState.target = streamState.target + "<think>" + parsed.text;
                streamState.reasoning_contentStart = false;
              } else {
                if (parsed.text && parsed.thought) streamState.target = '' + streamState.target + parsed.text;else {
                  if (!streamState.reasoning_contentEnd && !parsed.thought) {
                    streamState.target = streamState.target + '</think>\x0a' + parsed.text;
                    streamState.reasoning_contentEnd = true;
                  } else streamState.reasoning_contentEnd && parsed.text && !parsed.thought ? streamState.target = '' + streamState.target + parsed.text : streamState.target += parsed.text;
                }
              }
            } else streamState.target += parsed.text;
          }
        }
        streamState.temp = '';
      } else streamState.temp = accumulated;
    } catch (e) {
      Zotero.debug("resolve Gemini stream chunk error: " + e);
    }
  },
  'resolveStreamChunk_Claude': function (chunk, streamState) {
    try {
      const accumulated = streamState.temp + chunk,
        matches = accumulated.match(/\{"type":"text_delta","text":"(.*?)"\}/g);
      if (matches) {
        for (let matchStr of matches) {
          let parsed = JSON.parse(matchStr);
          parsed.text && (streamState.target += parsed.text);
        }
        streamState.temp = '';
      } else streamState.temp = accumulated;
    } catch (e) {
      Zotero.debug('resolve\x20Claude\x20stream\x20chunk\x20error:\x20' + e);
    }
  },
  'webpageSVG': '<svg\x20t=\x221743652474490\x22\x20class=\x22icon\x22\x20viewBox=\x220\x200\x201024\x201024\x22\x20version=\x221.1\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20p-id=\x224944\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M512\x200.085333C229.269333\x200.085333\x200.042667\x20229.226667\x200.042667\x20512.042667\x200.042667\x20794.837333\x20229.269333\x201023.978667\x20512\x201023.978667c282.794667\x200\x20511.936-229.141333\x20511.936-511.936C1023.936\x20229.226667\x20794.794667\x200.085333\x20512\x200.085333z\x20m-204.522667\x20118.421334a442.389333\x20442.389333\x200\x200\x201\x2069.781334-29.205334c-25.194667\x2036.928-46.912\x2083.904-63.893334\x20138.218667-25.408-16.234667-40.277333-35.690667-40.277333-56.789333\x200-19.178667\x2013.034667-36.864\x2034.389333-52.224zM208.170667\x20189.226667c7.914667\x2040.085333\x2039.317333\x2076.053333\x2088.256\x20102.933333-12.629333\x2056.938667-20.48\x20119.530667-22.528\x20185.749333H70.016A442.112\x20442.112\x200\x200\x201\x20208.170667\x20189.226667z\x20m0\x20645.610666a442.112\x20442.112\x200\x200\x201-138.154667-288.682666h203.818667c2.048\x2066.218667\x209.962667\x20128.810667\x2022.592\x20185.749333-48.938667\x2026.752-80.341333\x2062.869333-88.256\x20102.933333z\x20m99.306666\x2070.72c-21.354667-15.36-34.389333-33.109333-34.389333-52.224\x200-21.098667\x2014.869333-40.618667\x2040.277333-56.853333\x2016.981333\x2054.4\x2038.698667\x20101.290667\x2063.893334\x20138.282667a439.274667\x20439.274667\x200\x200\x201-69.781334-29.205334zM477.866667\x20946.773333c-42.88-22.592-79.808-87.296-104.448-176.576a453.12\x20453.12\x200\x200\x201\x20104.448-17.813333v194.389333z\x20m0-262.186666a485.632\x20485.632\x200\x200\x200-119.125334\x2021.653333\x201033.813333\x201033.813333\x200\x200\x201-16.725333-160.085333H477.866667v138.432z\x20m0-206.677334h-135.850667c1.408-53.717333\x206.997333-107.242667\x2016.725333-160.064\x2038.656\x2012.117333\x2078.677333\x2019.392\x20119.125334\x2021.696v138.368z\x20m0-206.229333a460.266667\x20460.266667\x200\x200\x201-104.448-17.813333c24.64-89.28\x2061.568-153.92\x20104.448-176.576v194.389333zM815.808\x20189.226667a441.6\x20441.6\x200\x200\x201\x20138.090667\x20288.682666H750.08c-2.048-66.218667-9.962667-128.810667-22.592-185.749333\x2049.002667-26.816\x2080.405333-62.848\x2088.32-102.933333z\x20m-99.306667-70.72c21.354667\x2015.36\x2034.410667\x2033.045333\x2034.410667\x2052.224\x200\x2021.098667-14.890667\x2040.554667-40.277333\x2056.789333-17.002667-54.314667-38.72-101.290667-63.957334-138.218667\x2024.064\x207.701333\x2047.424\x2017.472\x2069.824\x2029.205334zM546.133333\x2077.290667c42.922667\x2022.656\x2079.850667\x2087.296\x20104.426667\x20176.576a460.074667\x20460.074667\x200\x200\x201-104.426667\x2017.813333V77.290667z\x20m0\x20262.250666a490.666667\x20490.666667\x200\x200\x200\x20119.104-21.632c9.216\x2048.938667\x2015.082667\x20102.869333\x2016.725334\x20160H546.133333v-138.368z\x20m0\x20206.613334h135.829334a1032.96\x201032.96\x200\x200\x201-16.725334\x20160.149333\x20484.288\x20484.288\x200\x200\x200-119.104-21.653333v-138.496z\x20m0\x20400.618666v-194.389333a453.12\x20453.12\x200\x200\x201\x20104.426667\x2017.813333c-24.576\x2089.28-61.504\x20153.984-104.426667\x20176.576z\x20m170.368-41.216a443.584\x20443.584\x200\x200\x201-69.76\x2029.269334c25.173333-36.992\x2046.954667-83.882667\x2063.957334-138.282667\x2025.386667\x2016.234667\x2040.277333\x2035.754667\x2040.277333\x2056.853333-0.064\x2019.050667-13.12\x2036.8-34.474667\x2052.16z\x20m99.306667-70.72c-7.914667-40.064-39.381333-76.117333-88.32-102.933333a998.741333\x20998.741333\x200\x200\x200\x2022.592-185.749333h203.818667a441.6\x20441.6\x200\x200\x201-138.090667\x20288.682666z\x22\x20fill=\x22#0481ff\x22\x20p-id=\x224945\x22></path></svg>',
  'resolveStreamChunk_OpenAISeries': function (chunk, streamState) {
    streamState.temp += chunk;
    const lines = streamState.temp.split('\x0a\x0a');
    streamState.temp = lines.pop() || '';
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      if (!trimmedLine.startsWith("data:")) continue;
      const dataStr = trimmedLine.slice(0x5).trim();
      if (dataStr === "[DONE]") {
        break;
      }
      try {
        let jsonObj = JSON.parse(dataStr),
          delta = jsonObj.choices[0x0]?.['delta'];
        if (!delta) continue;
        let contentText = delta?.["content"],
          reasoningText = delta?.["reasoning_content"];
        if (contentText || reasoningText) {
          if (!contentText && reasoningText) {
            !streamState.hasReasoning_content && (streamState.hasReasoning_content = true, streamState.reasoning_contentStart = true);
            streamState.reasoning_contentStart ? (streamState.target = streamState.target + "<think>" + reasoningText, streamState.reasoning_contentStart = false) : streamState.target = '' + streamState.target + reasoningText;
          } else {
            if (contentText && !reasoningText) {
              streamState.hasReasoning_content && (streamState.hasReasoning_content = false, streamState.reasoning_contentEnd = true);
              streamState.reasoning_contentEnd ? (streamState.target = streamState.target + '</think>\x0a' + contentText, streamState.reasoning_contentEnd = false) : streamState.target = '' + streamState.target + contentText;
            }
          }
          jsonObj.references && Zotero.AI4Paper.gptReaderSidePane_getHTML4Refs(jsonObj.references, streamState);
          jsonObj.search_results && Zotero.AI4Paper.gptReaderSidePane_getHTML4Refs(jsonObj.search_results, streamState);
        }
      } catch (e) {
        Zotero.debug('Zotero\x20One\x20-\x20SSE\x20解析异常,\x20dataStr:\x20' + dataStr + " err: " + e.message);
      }
    }
  },
  'resolveStreamChunk': function (chunk, streamState, serviceName) {
    if (serviceName === "Claude") Zotero.AI4Paper.resolveStreamChunk_Claude(chunk, streamState);else serviceName === "Gemini" ? Zotero.AI4Paper.resolveStreamChunk_Gemini(chunk, streamState) : Zotero.AI4Paper.resolveStreamChunk_OpenAISeries(chunk, streamState);
  },
  'startFetch_ChatMode': async function (iframeWin, apiUrl, apiKey, requestBody, history, questionData, serviceName, errorCodeLink) {
    const chatContainer = iframeWin.document.getElementById("chat-container");
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_onSendUserMessage(iframeWin, chatContainer, questionData);
    if (Zotero.Prefs.get('ai4paper.gptStreamResponse')) {
      Zotero.AI4Paper.gptReaderSidePane_onStreamStart(iframeWin);
      let streamState = {
        'temp': '',
        'target': '',
        'html4Refs': '',
        'hasReasoning_content': false,
        'reasoning_contentStart': false,
        'reasoning_contentEnd': false
      };
      var requestOptions = Zotero.AI4Paper.gptReaderSidePane_getRequestOptions(serviceName, apiKey, requestBody);
      fetch(apiUrl, requestOptions).then(response => {
        return !response.ok && (Zotero.debug("GPT Stream Response Error: " + response), Zotero.AI4Paper.showProgressWindow(0x9c4, "GPT 请求失败【Zoteor One】", "Fetch request to " + apiUrl + " failed: HTTP status " + response.status + " - " + response.statusText)), response.body;
      }).then(body => {
        let reader = body.getReader();
        fn22();
        function fn22() {
          return reader.read().then(({
            done: done,
            value: value
          }) => {
            if (done || Zotero.AI4Paper.isAbortRequested) {
              Zotero.AI4Paper.gptReaderSidePane_ChatMode_onStreamDone(iframeWin, history, '' + streamState.target + streamState.html4Refs, questionData);
              reader.releaseLock();
              return;
            }
            let decodedChunk = new TextDecoder("utf-8").decode(value, {
              'stream': true
            });
            if (!Zotero.AI4Paper.catchStreamError_ChatMode(serviceName, errorCodeLink, iframeWin, history, decodedChunk)) return;
            Zotero.AI4Paper.resolveStreamChunk(decodedChunk, streamState, serviceName);
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_displayMessageChunk(iframeWin, streamState.target, chatContainer);
            fn22();
          });
        }
      })["catch"](fetchErr => {
        Zotero.AI4Paper.catchFetchError_ChatMode(serviceName, errorCodeLink, iframeWin, history, fetchErr);
      });
    } else {
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request('POST', apiUrl, {
          'headers': Zotero.AI4Paper.gptReaderSidePane_getHeadersObj(serviceName, apiKey),
          'body': JSON.stringify(requestBody),
          'responseType': "json"
        });
      }, httpResp => {
        if (Zotero.AI4Paper.runAuthor()) {
          let responseText;
          if (serviceName === "Claude") responseText = httpResp.response.content[0x0].text;else serviceName === 'Gemini' ? responseText = httpResp.response.candidates[0x0].content.parts[0x0].text : responseText = httpResp.response.choices[0x0].message.content;
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_onRequestDone(iframeWin, history, responseText, questionData);
        }
      }, serviceName, history);
    }
  },
  'gptReaderSidePane_ChatMode_send': function () {
    let serviceName = Zotero.Prefs.get("ai4paper.gptservice");
    if (serviceName.includes("GPT 自定")) for (let customKey of Object.keys(Zotero.AI4Paper.gptCustom_numEmoji)) {
      serviceName === 'GPT\x20自定\x20' + Zotero.AI4Paper.gptCustom_numEmoji[customKey] && Zotero.AI4Paper[Zotero.AI4Paper.gptServiceList()[serviceName].method.chat](customKey);
    } else Zotero.AI4Paper[Zotero.AI4Paper.gptServiceList()[serviceName].method.chat]();
  },
  'gptReaderSidePane_ChatMode_sendByOpenAI': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = 'OpenAI';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + '/v1/chat/completions';
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get('ai4paper.gptmaxtokens'));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByAPI2D': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "API2D";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + '/v1/chat/completions';
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'chat')) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get('ai4paper.api2dmaxtokens'));
    var requestBody = {};
    if (Zotero.Prefs.get("ai4paper.api2dmaxtokensenable")) {
      requestBody = {
        'model': model,
        'max_tokens': maxTokens,
        'messages': messagesToSend,
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    } else requestBody = {
      'model': model,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByChatAnywhere': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "ChatAnywhere";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) {
      return;
    }
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get("ai4paper.chatanywheremaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatanywheremaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByQwen': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "通义千问";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) {
      return;
    }
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
      messagesToSend: messagesToSend,
      messagesHistory: messagesHistory
    } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model);
    var requestBody = {
      'model': model,
      'messages': messagesToSend,
      'enable_thinking': Zotero.AI4Paper.gptServiceList()[serviceName].thinking_enable,
      'enable_search': Zotero.AI4Paper.gptServiceList()[serviceName].websearch_enable && !Zotero.AI4Paper.qwenModelsNotForOnlineSearch.includes(model) && true,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByWenxin': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "文心一言";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'chat')) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens")),
      enableSearch = Zotero.Prefs.get("ai4paper.wenxinEnableSearch"),
      webSearchConfig = {
        'enable': enableSearch,
        'enable_citation': enableSearch,
        'enable_trace': enableSearch
      };
    var requestBody = {
      'model': model,
      'messages': messagesToSend,
      'web_search': webSearchConfig,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable') && (requestBody.max_completion_tokens = maxTokens);
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByGLM': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = '智普清言';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByYi': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "零一万物";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    if (Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable')) requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };else {
      requestBody = {
        'model': model,
        'messages': messagesToSend,
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    }
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByZJUChat': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "浙大先生";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) {
      return;
    }
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get('ai4paper.gptmaxtokens'));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_getHTML4Refs': function (references, streamState) {
    let webSvg = Zotero.AI4Paper.webpageSVG,
      circledNums = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳', '㉑', '㉒', '㉓', '㉔', '㉕'];
    references.forEach((ref, idx) => {
      idx = circledNums[idx] || '🎈';
      let siteName = ref?.["site_name"] || "联网搜索",
        siteLabel = siteName + "&nbsp;" + idx,
        coverImgHtml = '';
      ref?.["cover_image"]?.["url"] && (coverImgHtml = "<img src=\"" + ref?.['cover_image']?.["url"] + "\" style=\"float: right; width: 100px; height: 70px; margin-left: 15px;\">");
      let refCardHtml = "\n\n        <div class=\"ZoteroOne-VolcanoSearch-Refs\" style=\"margin-top:15px; background-color: #f9fafe; border: 1px solid #ccc; border-radius: 8px; padding: 15px; width: 330px;\">\n                    <a href=\"" + ref?.["url"] + "\" style=\"text-decoration: none; color: #000; display: block;\">\n                        <div style=\"min-height: 60px;\">\n                            " + coverImgHtml + "\n                            <p style=\"margin:0;\">" + ref?.["title"] + "</p>\n                        </div>\n                    </a>\n                    <div style=\"display: grid; grid-template-columns: auto auto; align-items: center; justify-content: start; color: #666; margin-top: 10px;\">" + webSvg + "<span style=\"margin-left: 3px;\"> " + siteLabel + "</span></div>\n                </div>";
      streamState.html4Refs += refCardHtml;
    });
  },
  'gptReaderSidePane_ChatMode_sendByVolcanoSearch': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "火山联网搜索";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'chat')) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) {
      return;
    }
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].model;
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable') ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByVolcanoEngine': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "火山引擎";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model === '') return window.alert("您启用了自定义模型，但是尚未配置 " + serviceName + '\x20模型！请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20GPT\x20API】配置。'), -0x1;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) return;
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    if (Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable")) {
      requestBody = {
        'model': model,
        'max_tokens': maxTokens,
        'messages': messagesToSend,
        'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
      };
    } else {
      requestBody = {
        'model': model,
        'messages': messagesToSend,
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    }
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByDoubao': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = '豆包';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model === '') return window.alert("您启用了自定义模型，但是尚未配置 " + serviceName + " 模型！请先前往【Zotero 设置 --> AI4paper --> GPT API】配置。"), -0x1;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) return;
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get('ai4paper.gptmaxtokens'));
    var requestBody = {};
    if (Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable")) {
      requestBody = {
        'model': model,
        'max_tokens': maxTokens,
        'messages': messagesToSend,
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    } else requestBody = {
      'model': model,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByKimi': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "Kimi";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) {
      return;
    }
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    if (Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable")) {
      requestBody = {
        'model': model,
        'max_tokens': maxTokens,
        'messages': messagesToSend,
        'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
      };
    } else requestBody = {
      'model': model,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByDeepSeek': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "DeepSeek";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + '/v1/chat/completions';
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'chat')) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    if (Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable")) requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };else {
      requestBody = {
        'model': model,
        'messages': messagesToSend,
        'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
      };
    }
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByGPTCustom': async function (customIdx) {
    let numEmojiMap = Zotero.AI4Paper.gptCustom_numEmoji;
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "GPT 自定 " + numEmojiMap[customIdx];
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.getURL4GPTCustom(serviceName);
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'chat')) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) return;
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
        messagesToSend: messagesToSend,
        messagesHistory: messagesHistory
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model),
      maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptcustommaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get('ai4paper.gptcustommaxtokensenable') ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.gptReaderSidePane_addRequestArguments(requestBody, customIdx);
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByGemini': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "Gemini";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model === '') {
      return window.alert("您启用了自定义模型，但是尚未配置 " + serviceName + " 模型！请先前往【Zotero 设置 --> AI4paper --> GPT API】配置。"), -0x1;
    }
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) return;
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
      messagesToSend: messagesToSend,
      messagesHistory: messagesHistory
    } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest_gemini(questionData, serviceName, model);
    var apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1beta/models/" + model + ':' + (Zotero.Prefs.get("ai4paper.gptStreamResponse") ? "streamGenerateContent" : "generateContent"),
      requestBody = {
        'contents': messagesToSend,
        'safetySettings': [{
          'category': "HARM_CATEGORY_HARASSMENT",
          'threshold': "BLOCK_NONE"
        }, {
          'category': "HARM_CATEGORY_HATE_SPEECH",
          'threshold': "BLOCK_NONE"
        }, {
          'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          'threshold': "BLOCK_NONE"
        }, {
          'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
          'threshold': "BLOCK_NONE"
        }]
      };
    Zotero.AI4Paper.gptReaderSidePane_SetGeminiThinkingBudget(requestBody, model);
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
  'gptReaderSidePane_ChatMode_sendByClaude': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "Claude";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(iframeWin)) return false;
    let questionData = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(iframeWin),
      questionText = questionData.question;
    if (!questionText) {
      return;
    }
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let {
      messagesToSend: messagesToSend,
      messagesHistory: messagesHistory
    } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(questionData, serviceName, model);
    var requestBody = {
      'model': model,
      'max_tokens': Zotero.AI4Paper.getClaudeMaxTokens(model),
      'messages': messagesToSend,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(iframeWin, apiUrl, apiKey, requestBody, messagesHistory, questionData, serviceName, errorCodeLink);
  },
});
