// AI4Paper GPT Chat Module - Chat mode UI, message handling, streaming, and send methods
// Also includes shared GPT reader infrastructure: note creation, history, stream parsing
Object.assign(Zotero.AI4Paper, {
  'addChatGPTNote_ChatMode': async function () {
    let var4568 = Zotero_Tabs._selectedID;
    var var4569 = Zotero.Reader.getByTabID(var4568);
    if (var4569) {
      let var4570 = var4569.itemID;
      var var4571 = Zotero.Items.get(var4570);
      if (var4571 && var4571.parentItemID) {
        var4570 = var4571.parentItemID;
        var4571 = Zotero.Items.get(var4570);
      } else return Services.prompt.alert(window, "❌ 请重新选择", "当前文献无父条目，请创建父条目或选择其他文献！否则 ChatGPT 笔记无法保存。"), false;
    } else var var4571 = ZoteroPane.getSelectedItems()[0x0];
    if (var4571 === undefined) return Services.prompt.alert(window, "❌ 温馨提示：", '请先选择一个条目！'), false;
    if (!var4571.isRegularItem()) {
      return Services.prompt.alert(window, '❌\x20温馨提示：', '您选择的不是常规条目！'), false;
    }
    let var4572 = [],
      var4573 = var4571.getField('title'),
      var4574 = Zotero.AI4Paper.openDialogByType_modal('exportGPTNotes_ChatMode', var4573),
      var4575 = var4574.tags;
    if (var4574 === "cancel") return false;
    if (!var4574.messages.length) return window.alert('未发现任何\x20GPT\x20消息！'), false;
    let var4576 = var4574.messages;
    if (var4574.check) {
      if (var4574.item_title === '') return Services.prompt.alert(window, "❌ 出错了", "未选择改绑条目，或改绑条目尚未设定！"), false;
      let _0x8e08db = var4574.item_title,
        _0x28289a = JSON.parse(Zotero.Prefs.get("ai4paper.gptNotesAttachItemsObject")),
        _0x29dab7 = false;
      for (let var4580 of _0x28289a) {
        if (var4580.title === _0x8e08db.trim() && !_0x29dab7) {
          var4571 = Zotero.AI4Paper.findItemByIDORKey(var4580.id);
          if (var4571) {
            Zotero.Prefs.set("ai4paper.gptNotesLastSelectedItem", _0x8e08db);
          } else return Services.prompt.alert(window, '❌\x20出错了', "您选择的改绑文献不存在！"), false;
          _0x29dab7 = true;
        }
      }
      if (!_0x29dab7) return Services.prompt.alert(window, "❌ 出错了", "您选择的改绑文献不在所设定的笔记改绑条目中！"), false;
    }
    if (var4575) {
      var4575 = var4575.split('\x0a');
      for (let var4581 of var4575) {
        var4581 != '' && (var4572.push(var4581), Zotero.AI4Paper.add2GPTNoteTags(var4581), Zotero.AI4Paper.add2RecentGPTNoteTags(var4581));
      }
    }
    var var4582 = await Zotero.AI4Paper.createNoteItem_basedOnTag(var4571, "/ChatGPT");
    var4582 && (Zotero.AI4Paper.updateChatGPTRecordNote_ChatMode(var4571, var4582, var4576, var4572), Zotero.AI4Paper.focusReaderSidePane("gpt"));
  },
  'updateChatGPTRecordNote': async function (param814, param815, param816, param817, param818) {
    let var4583 = '';
    for (let var4584 of param818) {
      var4583 = var4583 + " 🏷️ #🤖️/" + Zotero.AI4Paper.tagFormat(var4584);
    }
    var4583 = var4583 + " 🏷️ #🤖️/ChatGPT";
    var4583 = var4583.trim();
    for (let var4585 of param818) {
      param815.addTag('🤖️/' + var4585);
      await param815.saveTx();
    }
    await Zotero.AI4Paper.Set2ReverseChatGPT(param815);
    let var4586 = param815.getNote();
    if (var4586.indexOf("</h2>") != -0x1) {
      let _0x141d5f = var4586.indexOf("</h2>");
      var4586 = var4586.substring(_0x141d5f + 0x5);
    }
    param817 = param817.replace(/\n\n+/g, "<p>");
    param817 = param817.replace(/\n/g, "<br>");
    let var4588 = "<blockquote>" + ("<span class=\"chatgpt\">🙋</span><p>" + param816) + "<p>" + "🤖<p>" + param817;
    if (var4586.indexOf(var4588) != -0x1) {
      return Zotero.AI4Paper.showProgressWindow(0x2ee0, '❌\x20重复的\x20ChatGPT\x20笔记【Zotero\x20One】', "检测到重复的 ChatGPT 对话笔记，无须再次保存！", "openai"), false;
    }
    var var4589 = "<h2 style=\"color: #00ae89;\">🤖️ ChatGPT 倒序>>>>>>></h2><blockquote>" + ("<span class=\"chatgpt\">🙋</span><p>" + param816) + "<p>" + "🤖<p>" + param817 + ("<p>" + var4583) + "</blockquote>" + var4586;
    param815.setNote(var4589);
    await param815.saveTx();
    Zotero.AI4Paper.showProgressWindow(0x2328, "✅ 成功保存 ChatGPT 笔记【AI4paper】", "已保存本次 ChatGPT 对话至选定文献【" + param814.getField("title") + "】的笔记附件！", "openai");
    await new Promise(_0x347b2e => setTimeout(_0x347b2e, 0x96));
    Zotero.AI4Paper.refreshObsidianNoteChatGPT(param814);
    await new Promise(_0x335e05 => setTimeout(_0x335e05, 0x32));
    Zotero.AI4Paper.refreshObsidianNoteChatGPT(param814);
  },
  'updateChatGPTRecordNote_ChatMode': async function (param819, param820, param821, param822) {
    let var4590 = '';
    for (let var4591 of param822) {
      var4590 = var4590 + " 🏷️ #🤖️/" + Zotero.AI4Paper.tagFormat(var4591);
    }
    var4590 = var4590 + " 🏷️ #🤖️/ChatGPT";
    var4590 = var4590.trim();
    for (let var4592 of param822) {
      param820.addTag("🤖️/" + var4592);
      await param820.saveTx();
    }
    await Zotero.AI4Paper.Set2ReverseChatGPT(param820);
    let var4593 = param820.getNote();
    if (var4593.indexOf("</h2>") != -0x1) {
      let var4594 = var4593.indexOf("</h2>");
      var4593 = var4593.substring(var4594 + 0x5);
    }
    let var4595 = '',
      var4596 = 0x0;
    for (let var4597 of param821) {
      let _0x5abdce = var4597.role === "user" ? '🙋' : '🤖',
        _0x17baf8 = var4597.content;
      _0x17baf8 = _0x17baf8.replace(/\n\n+/g, "<p>").replace(/\n/g, '<p>');
      var4596 === 0x0 ? var4595 = "<span class=\"chatgpt\">" + _0x5abdce + '</span><p>' + _0x17baf8 : var4595 = var4595 + "<p>" + _0x5abdce + '<p>' + _0x17baf8;
      var4596++;
    }
    if (var4593.indexOf(var4595) != -0x1) return Zotero.AI4Paper.showProgressWindow(0x2ee0, '❌\x20重复的\x20ChatGPT\x20笔记【Zotero\x20One】', "检测到重复的 ChatGPT 对话笔记，无须再次保存！", 'openai'), false;
    var var4600 = "<h2 style=\"color: #00ae89;\">🤖️ ChatGPT 倒序>>>>>>></h2><blockquote>" + var4595 + "<p>" + var4590 + "</blockquote>" + var4593;
    param820.setNote(var4600);
    await param820.saveTx();
    Zotero.AI4Paper.showProgressWindow(0x2328, '✅\x20成功保存\x20ChatGPT\x20笔记【Zotero\x20One】', "已保存本次 ChatGPT 对话至选定文献【" + param819.getField("title") + "】的笔记附件！", "openai");
    await new Promise(_0x2ccb44 => setTimeout(_0x2ccb44, 0x96));
    Zotero.AI4Paper.refreshObsidianNoteChatGPT(param819);
    await new Promise(_0x3c0e81 => setTimeout(_0x3c0e81, 0x32));
    Zotero.AI4Paper.refreshObsidianNoteChatGPT(param819);
  },
  'Set2ReverseChatGPT': async function (param823) {
    var var4601 = param823.getNote();
    if (var4601.indexOf("🤖️ ChatGPT 正序") != -0x1) {
      var var4602 = [],
        var4603 = [],
        var4604 = [],
        var4605 = new RegExp("<blockquote>", 'g'),
        var4606 = new RegExp('</blockquote>', 'g');
      while (var4605.exec(var4601) != null && var4606.exec(var4601) != null) {
        var4602.push(var4605.lastIndex);
        var4603.push(var4606.lastIndex);
      }
      for (i = 0x0; i < var4603.length; i++) {
        let var4607 = var4601.substring(var4602[var4602.length - i - 0x1] - 0xc, var4603[var4603.length - i - 0x1]);
        var4604.push(var4607);
      }
      let _0x561d40 = "<h2 style=\"color: #00ae89;\">🤖️ ChatGPT 倒序>>>>>>></h2>" + var4604.join('');
      param823.setNote(_0x561d40);
      await param823.saveTx();
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
    let var4609 = window.document.querySelector(".AI4Paper-gptSidePane-vbox");
    if (!var4609) return;
    if (Zotero.Prefs.get('ai4paper.gptContinuesChatMode')) {
      let var4610 = var4609.querySelectorAll(".container-section")[0x1],
        var4611 = var4609.querySelectorAll(".container-section")[0x2],
        var4612 = var4609.querySelectorAll(".container-section")[0x3];
      var4612.before(var4610);
      var4612.before(var4611);
      var4610 = var4609.querySelectorAll(".container-section")[0x1];
      var4611 = var4609.querySelectorAll(".container-section")[0x2];
      var4612 = var4609.querySelectorAll(".container-section")[0x3];
      var4610.style.marginBottom = "12px";
      var4611.style.marginBottom = "10px";
    } else {
      let var4613 = var4609.querySelectorAll('.container-section')[0x0],
        var4614 = var4609.querySelectorAll(".container-section")[0x1],
        var4615 = var4609.querySelectorAll('.container-section')[0x2],
        var4616 = var4609.querySelectorAll(".container-section")[0x3];
      var4613.after(var4615);
      var4613.after(var4614);
      var4614.style.marginBottom = "5px";
      var4615.style.marginBottom = '';
    }
  },
  'gptReaderSidePane_ChatMode_scrollTop': function (param824) {
    if (!param824) {
      param824 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (!param824) return false;
    }
    const var4617 = param824.document.getElementById("chat-container");
    var4617 && (var4617.scrollTop = 0x0);
  },
  'gptReaderSidePane_ChatMode_scrollBottom': function (param825) {
    if (!param825) {
      param825 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
      if (!param825) return false;
    }
    const var4618 = param825.document.getElementById("chat-container");
    var4618 && (var4618.scrollTop = var4618.scrollHeight);
  },
  'gptReaderSidePane_ChatMode_locateAIReadingNotes': function (param826) {
    if (!param826) {
      let var4619 = Zotero_Tabs._selectedID;
      var var4620 = Zotero.Reader.getByTabID(var4619);
      if (var4620) {
        let var4621 = var4620.itemID;
        param826 = Zotero.Items.get(var4621);
        if (param826 && param826.parentItemID) {
          var4621 = param826.parentItemID;
          param826 = Zotero.Items.get(var4621);
        } else return Services.prompt.alert(window, '❌\x20请重新选择', "当前文献无父条目，请创建父条目或选择其他文献！否则文献解读笔记无法保存。"), false;
      } else param826 = ZoteroPane.getSelectedItems()[0x0];
    }
    if (param826 === undefined) {
      return Services.prompt.alert(window, "❌ 温馨提示：", "请先选择一个条目！"), false;
    }
    if (!param826.isRegularItem()) return Services.prompt.alert(window, "❌ 温馨提示：", "您选择的不是常规条目！"), false;
    var var4622 = Zotero.AI4Paper.findNoteItem_basedOnTag(param826, Zotero.AI4Paper._aiReadingNoteTag);
    if (!var4622) {
      window.alert("当前文献尚未生成过【AI 文献解读】笔记附件！请通过 GPT 侧边栏【消息右键菜单】生成后再执行本操作。");
      return;
    } else Zotero.AI4Paper.gptReaderSidePane_ChatMode_locateAIReadingNotes_isGenerated(param826);
  },
  'gptReaderSidePane_ChatMode_locateAIReadingNotes_isGenerated': async function (param827) {
    let var4623 = Zotero.Prefs.get("ai4paper.obsidianapppath");
    if (!(await OS.File.exists(var4623))) return window.alert('您设定的\x20Obsidian\x20应用路径不存在！请前往\x20Zotero\x20One\x20设置界面重新设定。'), false;
    let var4624 = Zotero.Prefs.get("ai4paper.obsidianmarkdownfolderpath");
    if (!(await OS.File.exists(var4624))) return window.alert("您设定的 Obsidian 笔记导出路径不存在！请前往 AI4paper 设置界面重新设定。"), false;
    let var4625 = Zotero.AI4Paper.getQNKey(param827),
      var4626 = ".md",
      var4627 = var4624 + '\x5c' + var4625 + var4626;
    (Zotero.isMac || Zotero.isLinux) && (var4627 = var4624 + '/' + var4625 + var4626);
    let var4628 = Zotero.Prefs.get('ai4paper.obsidianvaultname'),
      var4629 = "obsidian://advanced-uri?vault=" + encodeURIComponent(var4628) + "&filepath=";
    if (Zotero.isWin) {
      let var4630 = '\x5c' + var4628,
        var4631 = var4624.indexOf(var4630);
      if (var4631 + var4630.length === var4624.length) var var4632 = encodeURIComponent(var4625),
        var4633 = var4629 + var4632;else {
        let var4634 = var4630 + '\x5c',
          var4635 = var4624.indexOf(var4634),
          var4636 = var4635 + var4634.length,
          var4637 = var4624.substring(var4636);
        var4637 = var4637.split('\x5c').join('/');
        var var4632 = encodeURIComponent(var4637 + '/' + var4625),
          var4633 = var4629 + var4632;
      }
    }
    if (Zotero.isMac || Zotero.isLinux) {
      let _0x1149cd = '/' + var4628,
        _0x35fb53 = var4624.indexOf(_0x1149cd);
      if (_0x35fb53 + _0x1149cd.length === var4624.length) {
        var var4632 = encodeURIComponent(var4625),
          var4633 = var4629 + var4632;
      } else {
        let _0x3c5cf0 = _0x1149cd + '/',
          _0x41f3c4 = var4624.indexOf(_0x3c5cf0),
          _0x44fd59 = _0x41f3c4 + _0x3c5cf0.length,
          _0x1c77fd = var4624.substring(_0x44fd59);
        var var4632 = encodeURIComponent(_0x1c77fd + '/' + var4625),
          var4633 = var4629 + var4632;
      }
    }
    var4633 = var4633 + "&block=KEYaiPapers";
    if (await OS.File.exists(var4627)) {
      await Zotero.AI4Paper.refreshObsidianNoteChatGPT(param827);
      if (Zotero.Prefs.get('ai4paper.obsidianautoupdatenotes')) await new Promise(_0x4daed4 => setTimeout(_0x4daed4, 0x1e));else {
        await new Promise(_0x402c7d => setTimeout(_0x402c7d, 0x32));
      }
      await Zotero.launchFileWithApplication(var4633, var4623);
      Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 定位 Obsidian【AI 文献解读】笔记【AI4paper】", "已为您定位 Obsidian【AI 文献解读】笔记！如若未成功定位，请在 Obsidian 中安装插件 Advanced URI。");
    } else {
      let var4644 = Services.prompt.confirm(window, "定位 Obsidian【AI 文献解读】笔记【AI4paper】", "当前文献还未生成 Obsidian Note，是否需要现在生成，并定位【AI 文献解读】笔记？");
      if (var4644) {
        await Zotero.AI4Paper.refreshObsidianNoteChatGPT(param827);
        await new Promise(_0x46434d => setTimeout(_0x46434d, 0x1e));
        if (await OS.File.exists(var4627)) {
          await Zotero.launchFileWithApplication(var4633, var4623);
          Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 定位 Obsidian【AI 文献解读】笔记【AI4paper】", "已为您定位 Obsidian【AI 文献解读】笔记！如若未成功定位，请在 Obsidian 中安装插件 Advanced URI。");
        } else {
          await new Promise(_0x1d91b4 => setTimeout(_0x1d91b4, 0x32));
          if (await OS.File.exists(var4627)) {
            await Zotero.launchFileWithApplication(var4633, var4623);
            Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20定位\x20Obsidian【AI\x20文献解读】笔记【Zotero\x20One】', "已为您定位 Obsidian【AI 文献解读】笔记！如若未成功定位，请在 Obsidian 中安装插件 Advanced URI。");
          }
        }
      }
    }
  },
  'gptReaderSidePane_ChatMode_copyAssistantMessages': function () {
    let var4645 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4645 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4645) {
      return;
    }
    let var4646 = [],
      var4647 = var4645.document.querySelectorAll(".message.assistant"),
      var4648 = 0x0;
    for (let var4649 of var4647) {
      var4648++;
      let _0x2271a6 = var4649.querySelector('.content');
      if (_0x2271a6) {
        if (_0x2271a6.messageSourceText) {
          let var4651 = "🤖 第【" + var4648 + '】条\x20AI\x20回复：\x0a\x0a' + _0x2271a6.messageSourceText;
          var4646.push(var4651);
        }
      }
    }
    if (var4646.length) {
      Zotero.AI4Paper.copy2Clipboard(var4646.join('\x0a\x0a'));
      Zotero.AI4Paper.showProgressWindow(0x5dc, '拷贝全部\x20AI\x20回复【Zotero\x20One】', "✅ 拷贝成功！");
    } else Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝全部 AI 回复【AI4paper】", '未发现\x20AI\x20回复！');
  },
  'gptReaderSidePane_ChatMode_copyAllMessages': function (param828, param829) {
    if (!param829) {
      param829 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (!param829) return false;
    }
    let var4652 = [],
      var4653 = param829.document.querySelectorAll(".message");
    for (let var4654 of var4653) {
      let _0x15f230 = var4654.querySelector(".avatar");
      if (_0x15f230.classList.contains("user")) {
        _0x15f230 = "🙋 用户问题";
      } else _0x15f230 = "🤖 AI 回复";
      let _0x3133d5 = var4654.querySelector(".content");
      if (_0x3133d5) {
        let _0x3e3ce6 = _0x3133d5.innerText;
        param828 && (_0x3e3ce6 = var4654.classList.contains('user') ? _0x3133d5.innerText : _0x3133d5.messageSourceText);
        let _0x23bc4f = _0x15f230 + '：\x0a\x0a' + _0x3e3ce6;
        var4652.push(_0x23bc4f);
      }
    }
    var4652.length ? (Zotero.AI4Paper.copy2Clipboard(var4652.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0x5dc, "拷贝全部" + (param828 ? " Markdown " : '\x20') + "消息【AI4paper】", "✅ 拷贝成功！")) : Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝全部" + (param828 ? " Markdown " : '\x20') + "消息【AI4paper】", '未发现任何消息！');
  },
  'gptReaderSidePane_ChatMode_go2MessageTop': function (param830, param831) {
    let var4659 = param830.target.closest('.message');
    if (param831) {
      var4659 = param830.target.closest('.message-container').querySelector(".message");
    }
    var4659 && (var4659.focus(), var4659.scrollIntoView({
      'behavior': param831 ? "auto" : 'smooth',
      'block': "start"
    }));
  },
  'gptReaderSidePane_ChatMode_copyMessage': function (param832, param833) {
    let var4660 = param832.target.closest(".message");
    if (param833) {
      var4660 = param832.target.closest(".message-container").querySelector(".message");
    }
    if (var4660) {
      let _0x5eff63 = var4660.querySelector(".content");
      _0x5eff63 && _0x5eff63.innerText && (Zotero.AI4Paper.copy2Clipboard(_0x5eff63.innerText), Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝消息【AI4paper】", '' + _0x5eff63.innerText.substring(0x0, 0x19) + (_0x5eff63.innerText.length > 0x1a ? '...' : ''), "openai"));
    }
  },
  'gptReaderSidePane_ChatMode_copyMessageSourceText': function (param834, param835) {
    let var4662 = param834.target.closest(".message");
    param835 && (var4662 = param834.target.closest(".message-container").querySelector(".message"));
    if (var4662) {
      let var4663 = var4662.querySelector(".content");
      if (var4663) {
        let var4664 = var4662.classList.contains("user") ? var4663.innerText : var4663.messageSourceText;
        var4664 && (Zotero.AI4Paper.copy2Clipboard(var4664), Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝 Markdown 消息【AI4paper】", '' + var4664.substring(0x0, 0x19) + (var4664.length > 0x1a ? "..." : ''), "openai"));
      }
    }
  },
  'gptReaderSidePane_ChatMode_copyFileName': function (param836) {
    let var4665 = param836.target.closest('.message').querySelector(".file-info");
    var4665 && (Zotero.AI4Paper.copy2Clipboard(var4665.fileName), Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝附件标题【AI4paper】", var4665.fileName, 'openai'));
  },
  'gptReaderSidePane_ChatMode_copyFileFullText': function (param837) {
    let var4666 = param837.target.closest('.message').querySelector(".file-info");
    if (var4666) {
      Zotero.AI4Paper.copy2Clipboard(var4666.fulltext);
      Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 拷贝附件全文【AI4paper】", '' + var4666.fulltext.substring(0x0, 0x19) + (var4666.fulltext.length > 0x1a ? "..." : ''));
    }
  },
  'gptReaderSidePane_ChatMode_openFileInZotero': function (param838) {
    let var4667 = param838.target.closest(".message").querySelector('.file-info');
    if (var4667) {
      let _0x200ae5 = Zotero.Reader.getByTabID(Zotero_Tabs._selectedID);
      if (_0x200ae5 && _0x200ae5._item === var4667.item) {
        Zotero.AI4Paper.showProgressWindow(0x5dc, "❌ 打开附件【AI4paper】", "当前打开的就是该附件，无需再打开。");
        return;
      }
      Zotero.Reader.open(var4667.item.itemID, null, {
        'openInWindow': false
      });
    }
  },
  'gptReaderSidePane_ChatMode_showFile': function (param839) {
    let var4669 = param839.target.closest('.message').querySelector(".file-info");
    var4669 && ZoteroPane_Local.showAttachmentInFilesystem(var4669.item.itemID);
  },
  'gptReaderSidePane_ChatMode_addMessage2SelectedAnnotation': async function (param840, param841) {
    let var4670 = param840.target.closest(".message-container").querySelector(".message"),
      var4671;
    if (var4670) {
      let _0x1cfdc5 = var4670.querySelector(".content");
      _0x1cfdc5 && (param841 ? var4671 = _0x1cfdc5.messageSourceText : var4671 = _0x1cfdc5.innerText);
    }
    let var4673 = this.getCurrentReader(),
      var4674 = Zotero.AI4Paper.betterURL();
    if (!var4673 || !var4674) return false;
    if (!var4673._internalReader._lastView._selectedAnnotationIDs.length) return window.alert('请先选中一个注释！'), false;else {
      if (var4673._internalReader._lastView._selectedAnnotationIDs.length === 0x1) {
        let var4675 = var4673._internalReader._lastView._selectedAnnotationIDs[0x0],
          var4676 = Zotero.Items.get(var4673.itemID).libraryID,
          var4677 = null,
          var4678 = 0x0;
        while (!var4677?.["annotationType"]) {
          if (var4678 >= 0x12c) {
            Zotero.debug("AI4Paper: Waiting for annotationItem ready failed");
            return;
          }
          var4677 = await Zotero.Items.getByLibraryAndKeyAsync(var4676, var4675);
          await Zotero.Promise.delay(0xa);
          var4678++;
        }
        let var4679 = '' + var4677.annotationComment;
        var4679 === "null" ? var4677.annotationComment = '' + var4671 : var4677.annotationComment = var4679 + '\x0a\x0a' + var4671;
        await var4677.saveTx();
      }
    }
  },
  'gptReaderSidePane_ChatMode_modifyUserMessage': function (param842, param843) {
    if (param843._gptStreamRunning) {
      window.alert("当前 GPT 对话正在进行中...请等待消息接收完成，或者手动中止对话后，再执行本操作！");
      return;
    }
    let var4680 = param842.target.closest(".message-container").querySelector(".message"),
      var4681 = var4680.querySelector(".content"),
      var4682 = var4681.messageSourceText,
      var4683 = var4680.querySelector('.file-info');
    var4683 && (var4682 = var4683.prompt);
    let var4684 = Zotero.AI4Paper.openDialogByType_modal("modifyUserMessage", var4682);
    if (!var4684.trim()) {
      window.alert("用户消息不可为空！请重新修改。");
      return;
    }
    let var4685 = param843.document.querySelectorAll(".message"),
      var4686 = 0x0;
    for (let var4687 of var4685) {
      if (var4687 === var4680) break;
      var4686++;
    }
    let var4688 = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory);
    var4688 = var4688.slice(0x0, var4686);
    try {
      Zotero.AI4Paper._data_gptMessagesHistory = JSON.stringify(var4688);
    } catch (_0x1b3f9d) {
      Zotero.debug(_0x1b3f9d);
      return;
    }
    Zotero.AI4Paper.updateChatGPTReaderSidePane();
    param843.document.getElementById("message-input").value = var4684;
    if (var4683) {
      param843._hasFullText = true;
      param843.document.getElementById("message-input").value = var4683.fulltext;
      param843._modifiedPrompt = var4684;
    } else Zotero.AI4Paper.gptReaderSidePane_clearPrompt();
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_send();
    param843._hasFullText = false;
    param843._modifiedPrompt = '';
  },
  'gptReaderSidePane_ChatMode_updateAssistantMessage': function (param844, param845) {
    if (param845._gptStreamRunning) {
      window.alert("当前 GPT 对话正在进行中...请等待消息接收完成，或者手动中止对话后，再执行本操作！");
      return;
    }
    let var4689 = param844.target.closest('.message-container').querySelector(".message"),
      var4690 = param845.document.querySelectorAll('.message'),
      var4691 = 0x0;
    for (let var4692 of var4690) {
      if (var4692 === var4689) break;
      var4691++;
    }
    let var4693 = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory);
    var4693 = var4693.slice(0x0, var4691 - 0x1);
    try {
      Zotero.AI4Paper._data_gptMessagesHistory = JSON.stringify(var4693);
    } catch (_0x11945b) {
      Zotero.debug(_0x11945b);
      return;
    }
    let var4694 = var4690[var4691 - 0x1].querySelector(".content").messageSourceText;
    Zotero.AI4Paper.updateChatGPTReaderSidePane();
    param845.document.getElementById("message-input").value = var4694;
    let var4695 = var4690[var4691 - 0x1].querySelector(".file-info");
    var4695 ? (param845._hasFullText = true, param845.document.getElementById("message-input").value = var4695.fulltext, param845._modifiedPrompt = var4695.prompt) : Zotero.AI4Paper.gptReaderSidePane_clearPrompt();
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_send();
    param845._hasFullText = false;
    param845._modifiedPrompt = '';
  },
  'gptReaderSidePane_ChatMode_saveAIMessages2NoteItem': async function (param846, param847, param848) {
    let var4696 = {
        'assistantMessages': '\x20AI\x20回复',
        'allMessages': '消息'
      },
      var4697 = {
        'assistantMessages': "/全部AI回复",
        'allMessages': "/全部对话消息"
      },
      var4698 = Zotero_Tabs._selectedID;
    var var4699 = Zotero.Reader.getByTabID(var4698);
    if (var4699) {
      let var4700 = var4699.itemID;
      var var4701 = Zotero.Items.get(var4700);
      if (var4701 && var4701.parentItemID) {
        var4700 = var4701.parentItemID;
        var4701 = Zotero.Items.get(var4700);
      } else {
        return false;
      }
    } else {
      var var4701 = ZoteroPane.getSelectedItems()[0x0];
    }
    if (var4701 === undefined) return false;
    if (!var4701.isRegularItem()) {
      return false;
    }
    let var4702 = [],
      var4703;
    if (param847 === "assistantMessages") {
      var4703 = param846.document.querySelectorAll(".message.assistant");
      for (let var4704 of var4703) {
        let _0x5bf198 = var4704.querySelector(".content");
        _0x5bf198.innerText && var4702.push("<blockquote><span class=\"allAssistantMessages\" style=\"color: #f91e27\">🤖 AI 回复</span>" + _0x5bf198.innerHTML + '</blockquote>');
      }
    } else {
      if (param847 === 'allMessages') {
        var4703 = param846.document.querySelectorAll('.message');
        for (let var4706 of var4703) {
          let var4707 = var4706.querySelector(".content"),
            var4708,
            var4709 = var4707.innerHTML;
          var4707.innerText && (var4707.classList.contains("user") ? (var4708 = "<span class=\"allMessages\" style=\"color: #0481ff\">🙋 用户问题</span>", var4709 = '<p>' + var4709) : (var4708 = "<span class=\"allMessages\" style=\"color: #f91e27\">🤖 AI 回复</span>", var4709 = var4707.innerHTML), var4702.push("<blockquote>" + var4708 + var4709 + "</blockquote>"));
        }
      }
    }
    if (!var4702.length) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 保存全部" + var4696[param847], "未发现有内容的" + var4696[param847] + '。');
      return;
    }
    let var4710 = '<h2\x20style=\x22\x22>🤖️\x20全部【' + var4702.length + '】条' + var4696[param847] + " ⌚️ " + Zotero.AI4Paper.getDateTime() + "</h2>" + var4702.join(''),
      var4711;
    param848 ? (var4711 = new Zotero.Item('note'), var4711.libraryID = var4701.libraryID, var4711.parentKey = var4701.key, await var4711.saveTx(), var4711.addTag(var4697[param847]), await var4711.saveTx()) : var4711 = await Zotero.AI4Paper.createNoteItem_basedOnTag(var4701, var4697[param847]);
    var4711.setNote(var4710);
    await var4711.saveTx();
    Zotero.AI4Paper.showProgressWindow(0x7d0, '✅\x20保存全部' + var4696[param847] + "至笔记附件", "成功保存【" + var4702.length + '】条' + var4696[param847] + "至笔记附件");
    Zotero.AI4Paper.focusReaderSidePane("gpt");
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD': async function (param849, param850, param851, param852) {
    let {
      content: _0x201f50,
      fileName: _0x30a3e5
    } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(param849, param850, param851, param852);
    var {
      FilePicker: _0xa6d94e
    } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs");
    const var4712 = new _0xa6d94e();
    var4712.displayDirectory = OS.Constants.Path.homeDir;
    var4712.init(window, "Export AI Messages as .md file...", var4712.modeSave);
    var4712.appendFilter('Markdown', "*.md");
    var4712.defaultString = _0x30a3e5;
    const var4713 = await var4712.show();
    if (var4713 == var4712.returnOK || var4713 == var4712.returnReplace) {
      let var4714 = var4712.file;
      var4714.split('.').pop().toLowerCase() != 'md' && (var4714 += ".md");
      await Zotero.File.putContentsAsync(var4714, _0x201f50);
      Zotero.AI4Paper.showProgressWindow(0xbb8, '导出消息【Zotero\x20One】', '✅\x20成功导出消息至【' + var4714 + '】！');
      if (await OS.File.exists(var4714)) {
        let var4715 = Zotero.File.pathToFile(var4714);
        try {
          var4715.reveal();
        } catch (_0x4601d7) {
          Zotero.debug(_0x4601d7);
        }
      }
    }
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD': async function (param853, param854, param855, param856) {
    let var4716 = ZoteroPane.getSelectedCollection();
    if (!var4716) {
      window.alert("❌ 请先在 Zotero 主界面【我的文库】下，选中一个分类！");
      return;
    }
    let {
        content: _0x129fd1,
        fileName: _0xc64260
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(param853, param854, param855, param856),
      var4717 = await Zotero.AI4Paper.createMarkdownInCollection(_0x129fd1, _0xc64260, var4716);
    var4717 && Zotero.AI4Paper.showItemInCollection(var4717);
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD': async function (param857, param858, param859, param860) {
    let var4718 = Zotero.getActiveZoteroPane().itemsView.getSelectedItems().filter(_0x1e7067 => _0x1e7067.isRegularItem())[0x0];
    if (!var4718) {
      window.alert("❌ 请先在 Zotero 主界面【我的文库】下，选择一个常规条目");
      return;
    }
    let {
        content: _0x5667c4,
        fileName: _0x3916c4
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(param857, param858, param859, param860),
      var4719 = await Zotero.AI4Paper.addMarkdownAttachment(_0x5667c4, _0x3916c4, var4718);
    if (var4719) {
      Zotero.AI4Paper.showItemInCollection(var4718);
    }
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD': async function (param861, param862, param863, param864) {
    let var4720 = Zotero.AI4Paper.getCurrentItem(true);
    if (!var4720) {
      window.alert('❌\x20当前未打开任何文献！无法绑定。');
      return;
    }
    if (!var4720.isRegularItem()) {
      window.alert("❌ 当前打开的文献无父条目，无法绑定。");
      return;
    }
    let {
        content: _0x4df4c6,
        fileName: _0x47b997
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(param861, param862, param863, param864),
      var4721 = await Zotero.AI4Paper.addMarkdownAttachment(_0x4df4c6, _0x47b997, var4720);
    var4721 && Zotero.AI4Paper.showItemInCollection(var4720);
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD': async function (param865, param866, param867, param868) {
    let {
        content: _0x3eb3a3,
        fileName: _0x29eaa4
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(param865, param866, param867, param868),
      var4722 = await Zotero.AI4Paper.createStandaloneMarkdown(_0x3eb3a3, _0x29eaa4);
    if (var4722) {
      Zotero.AI4Paper.showItemInCollection(var4722);
    }
  },
  'gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD': async function (param869, param870, param871, param872) {
    let var4723 = Zotero.Prefs.get('ai4paper.gptMarkdownMsgExportPath');
    if (var4723 && (await OS.File.exists(var4723))) {
      let {
          content: _0x81a5be,
          fileName: _0x5cb077
        } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessagesMarkdown(param869, param870, param871, param872),
        _0x4be1cd = OS.Path.join(var4723, _0x5cb077);
      await Zotero.File.putContentsAsync(_0x4be1cd, _0x81a5be);
      await Zotero.AI4Paper.revealPath(_0x4be1cd);
    } else Services.prompt.alert(window, "导出至预设路径（.md）", "❌ 您尚未设置【预设路径】，或设置的路径不存在。\n\n请先前往【GPT 侧边栏 --> 基本设置 --> Markdown AI 消息导出路径预设】设置。");
  },
  'createMarkdownInCollection': async function (param873, param874, param875) {
    const var4725 = PathUtils.join(Zotero.getTempDirectory().path, param874);
    await Zotero.File.putContentsAsync(var4725, param873);
    const var4726 = Zotero.Libraries.userLibraryID,
      var4727 = await Zotero.Attachments.importFromFile({
        'file': var4725,
        'libraryID': var4726
      });
    return var4727.setField("title", param874.replace(".md", '')), await var4727.saveTx(), !param875 && (param875 = ZoteroPane.getSelectedCollection()), var4727.addToCollection(param875.id), await var4727.saveTx(), var4727.addTag(Zotero.AI4Paper._aiMsgExportTag), await var4727.saveTx(), await IOUtils.remove(var4725), var4727;
  },
  'addMarkdownAttachment': async function (param876, _0x1dc464 = "note.md", param877) {
    const var4728 = PathUtils.join(Zotero.getTempDirectory().path, _0x1dc464);
    await Zotero.File.putContentsAsync(var4728, param876);
    const var4729 = await Zotero.Attachments.importFromFile({
      'file': var4728,
      'parentItemID': param877.id
    });
    return var4729.setField("title", _0x1dc464.replace(".md", '')), await var4729.saveTx(), var4729.addTag(Zotero.AI4Paper._aiMsgExportTag), await var4729.saveTx(), await IOUtils.remove(var4728), var4729;
  },
  'createStandaloneMarkdown': async function (param878, _0x54b93a = "note.md") {
    const var4730 = PathUtils.join(Zotero.getTempDirectory().path, _0x54b93a);
    await Zotero.File.putContentsAsync(var4730, param878);
    const var4731 = await Zotero.Attachments.importFromFile({
      'file': var4730,
      'libraryID': Zotero.Libraries.userLibraryID
    });
    return var4731.setField('title', _0x54b93a.replace('.md', '')), await var4731.saveTx(), var4731.addTag(Zotero.AI4Paper._aiMsgExportTag), await var4731.saveTx(), await IOUtils.remove(var4730), var4731;
  },
  'gptReaderSidePane_ChatMode_getMessagesMarkdown': function (param879, param880, param881, param882) {
    let var4732 = [],
      var4733,
      var4734 = '#\x20—————\x20🙋\x20用户问题\x20—————',
      var4735 = "# ————— 🤖 AI 回复 —————";
    if (param880 === "currentMessage") {
      let var4736 = param881.target.closest(".message-container").querySelector(".message"),
        var4737 = var4736.querySelector('.content');
      var4732.push((var4736.classList.contains('user') ? var4734 : var4735) + '\x0a\x0a' + var4737.messageSourceText);
    } else {
      if (param880 === "assistantMessages") {
        var4733 = param879.document.querySelectorAll(".message.assistant");
        for (let var4738 of var4733) {
          let _0x3e1aec = var4738.querySelector(".content");
          _0x3e1aec.innerText && var4732.push(var4735 + '\x0a\x0a' + _0x3e1aec.messageSourceText);
        }
      } else {
        if (param880 === "allMessages") {
          var4733 = param879.document.querySelectorAll(".message");
          for (let var4740 of var4733) {
            let _0x49b105 = var4740.querySelector(".content"),
              _0x54869e = _0x49b105.classList.contains('user') ? var4734 : var4735;
            if (_0x49b105.innerText) {
              var4732.push(_0x54869e + '\x0a\x0a' + _0x49b105.messageSourceText);
            }
          }
        }
      }
    }
    let var4743 = Zotero.AI4Paper.getDateTime(),
      var4744 = {
        'currentMessage': {
          'label': "当前消息",
          'contentTitle': '#\x20🤖️\x20当前消息\x20⌚️\x20' + var4743,
          'fileName': "当前消息 " + var4743.replace(/:/g, '-') + ".md"
        },
        'assistantMessages': {
          'label': " AI 回复",
          'contentTitle': "# 🤖️ 全部【" + var4732.length + "】条 AI 回复 ⌚️ " + var4743,
          'fileName': "全部 AI 回复 " + var4743.replace(/:/g, '-') + '.md'
        },
        'allMessages': {
          'label': '消息',
          'contentTitle': "# 🤖️ 全部【" + var4732.length + '】条消息\x20⌚️\x20' + var4743,
          'fileName': "全部消息 " + var4743.replace(/:/g, '-') + ".md"
        }
      };
    if (!var4732.length) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 未发现内容【AI4paper】", "未发现有内容的" + var4744?.[param880]?.["label"] + '。');
      return;
    }
    let var4745 = "---\ntags: [" + Zotero.AI4Paper._aiMsgExportTag.replace('/', '') + "]\n导出时间: \"" + var4743 + "\"\n---\n",
      var4746 = var4745 + '\x0a' + var4744?.[param880]?.["contentTitle"] + '\x0a\x0a\x0a' + var4732.join("\n\n\n\n\n"),
      var4747 = var4744?.[param880]?.["fileName"];
    if (param882) {
      let var4748 = param882.messages.find(_0x32feb1 => _0x32feb1.id === param882.currentSelectedId);
      var4747 = var4748.title + '\x20' + var4743.replace(/:/g, '-') + ".md";
    }
    return {
      'content': var4746,
      'fileName': var4747
    };
  },
  'createNoteItem_basedOnTag': async function (param883, param884, param885) {
    param883.isAnnotation() && (param883 = param883?.["parentItem"]?.["parentItem"]);
    if (!param883 || !param883.isRegularItem()) return;
    let var4749 = Zotero.AI4Paper.findNoteItem_basedOnTag(param883, param884);
    if (var4749) return var4749;else {
      let var4750 = new Zotero.Item("note");
      return var4750.libraryID = param883.libraryID, var4750.parentKey = param883.key, await var4750.saveTx(), var4750.addTag(param884), await var4750.saveTx(), var4750;
    }
  },
  'findNoteItem_basedOnTag': function (param886, param887) {
    param886.isAnnotation() && (param886 = param886?.['parentItem']?.["parentItem"]);
    if (!param886 || !param886.isRegularItem()) return;
    let var4751 = param886.getNotes(),
      var4752 = var4751.map(_0x638b80 => Zotero.Items.get(_0x638b80)),
      var4753 = var4752.filter(_0x59ed40 => _0x59ed40.getTags().map(_0x5ecb14 => _0x5ecb14.tag).includes(param887));
    return var4753[0x0] || false;
  },
  'retryContent2NoteItem': async function (param888, param889) {
    const var4754 = param888.getNote();
    if (!var4754 || var4754.trim().length < 0x32) {
      Zotero.debug("AI 解读 - ⚠️ 笔记保存验证失败，尝试重新保存…");
      param888.setNote(param889);
      await param888.saveTx();
      const var4755 = param888.getNote();
      if (!var4755 || var4755.trim().length < 0x32) throw new Error("笔记内容保存后验证失败（可能是数据库写入问题）");
    }
  },
  'gptReaderSidePane_ChatMode_createAIReadingNoteItem': async function (param890, param891, param892) {
    let var4756 = Zotero_Tabs._selectedID;
    var var4757 = Zotero.Reader.getByTabID(var4756);
    if (var4757) {
      let var4758 = var4757.itemID;
      var var4759 = Zotero.Items.get(var4758);
      if (var4759 && var4759.parentItemID) {
        var4758 = var4759.parentItemID;
        var4759 = Zotero.Items.get(var4758);
      } else {
        return Services.prompt.alert(window, "❌ 请重新选择", '当前文献无父条目，请创建父条目或选择其他文献！否则文献解读笔记无法保存。'), false;
      }
    } else {
      var var4759 = ZoteroPane.getSelectedItems()[0x0];
    }
    if (var4759 === undefined) {
      return Services.prompt.alert(window, "❌ 温馨提示：", "请先选择一个条目！"), false;
    }
    if (!var4759.isRegularItem()) return Services.prompt.alert(window, "❌ 温馨提示：", "您选择的不是常规条目！"), false;
    var var4760 = await Zotero.AI4Paper.createNoteItem_basedOnTag(var4759, Zotero.AI4Paper._aiReadingNoteTag);
    if (var4760) {
      let _0x383546 = '';
      if (param890 === "import") {
        _0x383546 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(null, param892);
      } else _0x383546 = Zotero.AI4Paper.createAIReadingNoteItem_getHTMLContent(param890, param892);
      let _0x2a81be = '<a\x20href=\x22' + Zotero.AI4Paper.getItemLink(var4760) + '\x22>笔记回链</a>',
        _0x578414 = "<blockquote><span class=\"AIReading\">🤖 AI 解读，快人一步</span>" + _0x383546 + "<p>🚀 " + _0x2a81be + "<p>🏷️ #🤖️/AI文献阅读</blockquote>",
        _0x130091 = var4760.getNote();
      if (param891 && _0x130091.indexOf("<h2") != -0x1 && _0x130091.indexOf("blockquote") != -0x1) {
        if (_0x130091.indexOf(_0x578414) != -0x1) return Zotero.AI4Paper.showProgressWindow(0x2ee0, "❌ 检测到重复【AI4paper】", "检测到您已添加过当前消息，无须再次添加！", "openai"), false;
        var4760.setNote(_0x130091 + "<p>" + _0x578414);
      } else var4760.setNote("<h2 style=\"color: #00ae89;\">🤖️ AI 文献解读</h2>" + _0x578414);
      await var4760.saveTx();
      Zotero.AI4Paper.showProgressWindow(0xbb8, '✅\x20' + (param891 ? "追加至" : "创建为") + "至文献解读笔记附件【AI4paper】", '已' + (param891 ? '追加' : '创建') + "当前消息至【AI 文献解读】笔记附件！", 'openai');
      await Zotero.AI4Paper.addEmojiTag2ParentItemOnPaperAI(var4759);
      Zotero.AI4Paper.focusReaderSidePane("gpt");
      await Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItem_updateObsidianNote(var4759);
    }
  },
  'createAIReadingNoteItem_getHTMLContent': function (param893, param894) {
    let var4765 = '',
      var4766 = param893.target.closest(".message");
    if (param894) {
      var4766 = param893.target.closest(".message-container").querySelector(".message");
    }
    if (var4766) {
      let _0x5ec88e = var4766.querySelector(".content");
      var4765 = _0x5ec88e.innerHTML;
      if (var4766.querySelector('.avatar').classList.contains("user")) var4765 = "<p>" + var4765;else {
        var4765 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(null, _0x5ec88e.messageSourceText);
      }
    }
    return var4765;
  },
  'gptReaderSidePane_ChatMode_createAIReadingNoteItem_updateObsidianNote': async function (param895) {
    let var4768 = Zotero.Prefs.get("ai4paper.obsidianapppath");
    if (!(await OS.File.exists(var4768))) return false;
    let var4769 = Zotero.Prefs.get("ai4paper.obsidianmarkdownfolderpath");
    if (!(await OS.File.exists(var4769))) {
      return false;
    }
    let var4770 = Zotero.AI4Paper.getQNKey(param895),
      var4771 = ".md",
      var4772 = var4769 + '\x5c' + var4770 + var4771;
    (Zotero.isMac || Zotero.isLinux) && (var4772 = var4769 + '/' + var4770 + var4771);
    Zotero.Prefs.get('ai4paper.updateModifiedDate4PapersMatrix') && (await Zotero.AI4Paper.updateModifiedDate4PapersMatrix(param895));
    ((await OS.File.exists(var4772)) || !(await OS.File.exists(var4772)) && Zotero.Prefs.get("ai4paper.obsidianautoupdatenotes") || Zotero.Prefs.get('ai4paper.createAIReadingNoteOnPaperAI')) && (await Zotero.AI4Paper.refreshObsidianNoteChatGPT(param895), await new Promise(_0x489d19 => setTimeout(_0x489d19, 0x1e)), await Zotero.AI4Paper.refreshObsidianNoteChatGPT(param895));
  },
  'gptReaderSidePane_ChatMode_createAIReadingNoteItemAuto': async function (param896, param897) {
    let var4773,
      var4774 = param896.document.querySelectorAll(".message");
    if (var4774.length) {
      var4773 = var4774[var4774.length - 0x1];
      if (!(var4773.className === "message assistant" && var4773.innerText)) return;
    }
    if (!var4773) return;
    var var4775 = Zotero.AI4Paper.findItemByIDORKey(param897?.["fileID"]);
    if (var4775 && var4775.parentItemID) var4775 = Zotero.Items.get(var4775.parentItemID);else return false;
    var var4776 = Zotero.AI4Paper.findNoteItem_basedOnTag(var4775, Zotero.AI4Paper._aiReadingNoteTag);
    if (var4776) return;
    var4776 = await Zotero.AI4Paper.createNoteItem_basedOnTag(var4775, Zotero.AI4Paper._aiReadingNoteTag);
    if (!var4776) return;
    let var4777 = var4773.querySelector(".content"),
      var4778 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(null, var4777.messageSourceText),
      var4779 = "<a href=\"" + Zotero.AI4Paper.getItemLink(var4776) + "\">笔记回链</a>",
      var4780 = "<h2 style=\"color: #00ae89;\">🤖️ AI 文献解读</h2><blockquote><span class=\"AIReading\">🤖 AI 解读，快人一步</span>" + var4778 + "<p>🚀 " + var4779 + "<p>🏷️ #🤖️/AI文献阅读</blockquote>";
    var4776.setNote(var4780);
    await var4776.saveTx();
    try {
      await Zotero.AI4Paper.retryContent2NoteItem(var4776, var4780);
    } catch (_0x185978) {
      Zotero.debug(_0x185978);
    }
    await Zotero.AI4Paper.addEmojiTag2ParentItemOnPaperAI(var4775);
    if (Zotero.Prefs.get('ai4paper.updateModifiedDate4PapersMatrix')) {
      await Zotero.AI4Paper.updateModifiedDate4PapersMatrix(var4775);
    }
    await Zotero.AI4Paper.refreshObsidianNoteChatGPT(var4775);
  },
  'updateModifiedDate4PapersMatrix': async function (param898) {
    param898.addTag("only4test");
    await param898.saveTx();
    param898.removeTag("only4test");
    await param898.saveTx();
  },
  'addEmojiTag2ParentItemOnPaperAI': async function (param899) {
    Zotero.Prefs.get("ai4paper.addEmojiTag2ParentItemOnPaperAI") && Zotero.Prefs.get("ai4paper.emojiTagAdded2ParentItemOnPaperAI").trim() && (param899.addTag(Zotero.Prefs.get('ai4paper.emojiTagAdded2ParentItemOnPaperAI').trim()), await param899.saveTx());
  },
  'getAIReadingNoteItemContent': async function (param900) {
    let var4781 = "<a href=\"" + Zotero.AI4Paper.getItemLink(param900) + "\">笔记回链</a>",
      var4782 = "<blockquote>🚀 " + var4781 + "</blockquote>^KEYaiPapers";
    var var4783 = param900.getNote();
    if (var4783.indexOf("<blockquote>") != -0x1) {
      var var4784 = [],
        var4785 = [],
        var4786 = [],
        var4787 = new RegExp("<blockquote>", 'g'),
        var4788 = new RegExp('</blockquote>', 'g');
      if (var4783.indexOf("<span class=") != -0x1 || var4783.indexOf('<blockquote>\x0a<p>🤖\x20AI\x20解读，快人一步') != -0x1) {
        if (var4783.indexOf('<blockquote>\x0a<p>🤖\x20AI\x20解读，快人一步') != -0x1) {
          var4787 = new RegExp("<blockquote>\n<p>🤖 AI 解读，快人一步", 'g');
          var4788 = new RegExp("#🤖️/AI文献阅读</p>\n</blockquote>", 'g');
          while (var4787.exec(var4783) != null && var4788.exec(var4783) != null) {
            var4784.push(var4787.lastIndex);
            var4785.push(var4788.lastIndex);
          }
          for (i = 0x0; i < var4785.length; i++) {
            let var4789 = var4783.substring(var4784[i] - 0x1d, var4785[i]),
              var4790 = "^KEY" + Zotero.Utilities.Internal.md5(var4789).slice(0x0, 0x8).toUpperCase();
            var4786.push(var4789 + '<p>' + var4790);
          }
        }
        if (var4783.indexOf('<span\x20class=') != -0x1) {
          var4784 = [];
          var4785 = [];
          var4787 = new RegExp("<blockquote><span class", 'g');
          var4788 = new RegExp("#🤖️/AI文献阅读</blockquote>", 'g');
          while (var4787.exec(var4783) != null && var4788.exec(var4783) != null) {
            var4784.push(var4787.lastIndex);
            var4785.push(var4788.lastIndex);
          }
          for (i = 0x0; i < var4785.length; i++) {
            let var4791 = var4783.substring(var4784[i] - 0x17, var4785[i]),
              var4792 = '^KEY' + Zotero.Utilities.Internal.md5(var4791).slice(0x0, 0x8).toUpperCase();
            var4786.push(var4791 + "<p>" + var4792);
          }
        }
      }
      let var4793 = "<h2 style=\"color: blue;\">🤖️ AI 文献解读</h2>" + var4782 + var4786.join('');
      return var4793;
    }
    return var4783;
  },
  'gptReaderSidePane_ChatMode_setMessageAsTranslationSourceText': function (param901) {
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) {
      return Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 未开启【翻译侧边栏】", "您未开启【翻译侧边栏】！"), false;
    }
    var var4794;
    if (window.document.getElementById('ai4paper-translate-readersidepane')) {
      var4794 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;
    } else return false;
    if (!var4794) {
      Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 未开启【翻译侧边栏】", '您未开启【翻译侧边栏】！');
      return;
    }
    let var4795 = param901.target.closest('.message');
    if (var4795) {
      let var4796 = var4795.querySelector('.content');
      if (var4796) {
        if (var4796.innerText) {
          Zotero.AI4Paper.focusReaderSidePane("translate");
          var4794.document.getElementById('ai4paper-translate-readerSidePane-sourcetext').value = var4796.innerText;
          Zotero.AI4Paper.translateSourceText = var4796.innerText;
          var4794.document.getElementById("translateText_button").click();
        }
      }
    }
  },
  'gptReaderSidePane_ChatMode_onClickMenuItemSelectMessage': function () {
    let var4797 = Zotero_Tabs._selectedID;
    if (var4797 === 'zotero-pane') return false;
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) return false;
    const var4798 = window.document.getElementById(var4797 + "-context");
    if (!var4798) {
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
  'gptReaderSidePane_ChatMode_getMessageContent': function (param902) {
    let var4799 = param902.closest(".message");
    if (var4799) {
      let _0x26ead7 = var4799.querySelector(".content");
      if (_0x26ead7) {
        let var4801 = var4799.classList.contains("user") ? _0x26ead7.innerText : _0x26ead7.messageSourceText;
        if (var4801) return var4801;
      }
    }
    return '';
  },
  'gptReaderSidePane_ChatMode_showMessageCheckbox': function () {
    let var4802 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4802 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4802) return;
    let var4803 = var4802.document.querySelectorAll('.checkbox');
    if (var4803.length) {
      for (let var4804 of var4803) {
        var4804.style.display = '';
        var4804.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked;
        var4804.setAttribute('title', "点击勾选");
        var4804.isChecked = false;
      }
    }
  },
  'gptReaderSidePane_ChatMode_checkAllMessages': function () {
    let var4805 = null;
    window.document.getElementById('ai4paper-chatgpt-readersidepane') && (var4805 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4805) return;
    let var4806 = var4805.document.querySelectorAll('.checkbox');
    if (var4806.length) for (let var4807 of var4806) {
      var4807.style.display = '';
      var4807.innerHTML = Zotero.AI4Paper.svg_icon_20px.checked;
      var4807.setAttribute("title", "点击取消勾选");
      var4807.isChecked = true;
    }
  },
  'gptReaderSidePane_ChatMode_hiddenMessageCheckbox': function () {
    let var4808 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4808 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4808) return;
    let var4809 = var4808.document.querySelectorAll(".checkbox");
    if (var4809.length) for (let var4810 of var4809) {
      var4810.style.display = "none";
      var4810.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked;
      var4810.setAttribute("title", "点击勾选");
      var4810.isChecked = false;
    }
  },
  'gptReaderSidePane_ChatMode_resetMessageCheckbox': function () {
    let var4811 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4811 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4811) return;
    let var4812 = var4811.document.querySelectorAll(".checkbox");
    if (var4812.length) for (let var4813 of var4812) {
      var4813.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked;
      var4813.setAttribute('title', "点击勾选");
      var4813.isChecked = false;
    }
  },
  'gptReaderSidePane_ChatMode_getSelectedMessages': function () {
    Zotero.AI4Paper._store_selecteGPTMessages = [];
    let var4814 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4814 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4814) return;
    let var4815 = var4814.document.querySelectorAll(".checkbox");
    for (let var4816 of var4815) {
      if (var4816.isChecked) {
        let var4817 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessageContent(var4816),
          var4818;
        var4816.nextSibling.classList.contains('user') ? var4818 = "user" : var4818 = "assistant";
        let var4819 = {
          'role': var4818,
          'content': var4817
        };
        Zotero.AI4Paper._store_selecteGPTMessages.push(var4819);
      }
    }
  },
  'gptReaderSidePane_ChatMode_copySelectedMessages': function () {
    Zotero.AI4Paper._store_selecteGPTMessages = [];
    let var4820 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4820 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4820) {
      return;
    }
    let var4821 = [],
      var4822 = var4820.document.querySelectorAll(".checkbox");
    for (let var4823 of var4822) {
      if (var4823.isChecked) {
        let _0x4f739d = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getMessageContent(var4823),
          _0x5927ff;
        var4823.nextSibling.classList.contains("user") ? _0x5927ff = '🙋\x20用户问题' : _0x5927ff = "🤖 AI 回复";
        if (_0x4f739d) {
          let var4826 = _0x5927ff + "：\n\n" + _0x4f739d;
          var4821.push(var4826);
        }
      }
    }
    var4821.length ? (Zotero.AI4Paper.copy2Clipboard(var4821.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0x5dc, "拷贝已选消息【AI4paper】", "✅ 拷贝成功！")) : Zotero.AI4Paper.showProgressWindow(0x7d0, "拷贝已选消息【AI4paper】", "未发现已选消息！");
  },
  'gptReaderSidePane_ChatMode_updateUserName': function () {
    Zotero.AI4Paper._store_selecteGPTMessages = [];
    let var4827 = null;
    window.document.getElementById('ai4paper-chatgpt-readersidepane') && (var4827 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4827) {
      return;
    }
    let var4828 = var4827.document.querySelectorAll(".avatar");
    for (let var4829 of var4828) {
      if (var4829.classList.contains('user')) {
        let var4830 = Zotero.Prefs.get("ai4paper.gptUserName") ? Zotero.Prefs.get("ai4paper.gptUserName") : "User";
        var4829.nextSibling.textContent = var4830;
      }
    }
  },
  'gptReaderSidePane_setStickyScroll': function (param903, param904) {
    const var4831 = param903.getElementById("chat-container"),
      var4832 = param903.getElementById("scroll-to-bottom-btn"),
      var4833 = 0x1e;
    var4831.addEventListener("scroll", () => {
      const _0x1b76cf = var4831.scrollHeight - var4831.scrollTop - var4831.clientHeight;
      _0x1b76cf <= var4833 ? (Zotero.Prefs.set("ai4paper.gptPinMessage", false), var4832.style.display = "none") : (Zotero.Prefs.set('ai4paper.gptPinMessage', true), var4832.style.display = "flex");
      Zotero_Tabs._selectedID != 'zotero-pane' && param904 && (Zotero.AI4Paper._savedContScrollTop = var4831.scrollTop);
    });
    var4832.addEventListener("click", _0x596256 => {
      if (_0x596256.shiftKey) {
        var4831.scrollTo({
          'top': 0x0,
          'behavior': "smooth"
        });
        return;
      }
      var4831.scrollTo({
        'top': var4831.scrollHeight,
        'behavior': 'smooth'
      });
    });
    var4832.oncontextmenu = _0x1e4c25 => {
      var4831.scrollTo({
        'top': 0x0,
        'behavior': "smooth"
      });
    };
  },
  'gptReaderSidePane_addExpandArrow': function (param905, param906, param907) {
    if (!param907) {
      param907 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (!param907) return false;
    }
    let var4835 = null;
    if (param906 === "user") {
      var4835 = param907.document.createElement("div");
      var4835.className = "expand-arrow";
      var4835.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path fill=\"currentColor\" d=\"M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z\"/></svg>";
      var4835.style.display = "none";
      param905.appendChild(var4835);
    }
    return var4835;
  },
  'gptReaderSidePane_addClickEvent4ExpandArrow': function (param908, param909, param910, param911) {
    Zotero.Prefs.get('ai4paper.gptShowMessageExpandArrow') && (param911 === "user" && param910.classList.add('clamped'), param911 === "user" && param909 && (param909.addEventListener("click", _0x271b6d => {
      _0x271b6d.stopPropagation();
      const var4836 = param910.classList.toggle("clamped");
      param909.classList.toggle("rotated", !var4836);
    }), param910.addEventListener("click", _0x3bcbc3 => {
      if (_0x3bcbc3.shiftKey) {
        if (param909.style.display === "flex") {
          const var4837 = param910.classList.toggle('clamped');
          param909.classList.toggle('rotated', !var4837);
          param908.focus();
          param908.scrollIntoView({
            'behavior': "auto",
            'block': "start"
          });
        }
        param908.ownerDocument.defaultView.getSelection && param908.ownerDocument.defaultView.getSelection().removeAllRanges();
      }
    }), setTimeout(() => {
      param910.scrollHeight > param910.clientHeight + 0x4 && (param909.style.display = "flex");
    }, 0xc8)));
  },
  'gptReaderSidePane_addCSS4ExpandArrow': function () {
    let var4838 = Zotero.getMainWindow()?.['matchMedia']("(prefers-color-scheme: dark)")["matches"];
    return "\n        /* --- 消息折叠功能 CSS --- */\n\n        /* relative 容器 */\n        .message.user {\n            position: relative !important;\n        }\n\n        /* 箭头按钮样式 */\n        .expand-arrow {\n            position: absolute;\n            top: 8px;\n            left: 8px;\n            width: 20px;\n            height: 20px;\n            border-radius: 50%; /* 圆形点击区域 */\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            cursor: pointer;\n            color: #999;\n            z-index: 10;\n            transition: transform 0.2s ease;\n        }\n\n        .expand-arrow:hover {\n            background-color: " + (var4838 ? "rgba(255,255,255,0.1)" : "#fafffa") + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color:\x20' + (var4838 ? "#fff" : "#999") + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20箭头旋转状态\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20.expand-arrow.rotated\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20transform:\x20rotate(180deg);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20折叠核心逻辑：默认限制\x208\x20行\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20.content.user.clamped\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20display:\x20-webkit-box\x20!important;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20-webkit-box-orient:\x20vertical\x20!important;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20-webkit-line-clamp:\x208\x20!important;\x20/*\x20限制\x208\x20行\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20line-clamp:\x208;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20overflow:\x20hidden\x20!important;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20text-overflow:\x20ellipsis\x20!important;\x20/*\x20显示\x20...\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20/*\x20解决“露头”关键：不要写死\x20max-height，而是通过\x20line-height\x20确保文本行严格对齐\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20line-height:\x201.4\x20!important;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20max-height:\x2011em\x20!important;\x20/*\x20略微小雨\x20line-height\x20的倍数\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20/*\x20关键：防止挤压感。使用\x20content-box\x20并固定高度\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20box-sizing:\x20content-box\x20!important;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
  },
  'gptReaderSidePane_ChatMode_createMessageElement': function (param912, param913, param914, param915) {
    let var4839 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4839) return;
    const var4840 = var4839.document.createElement("div");
    var4840.classList.add("message-container", param913);
    const var4841 = var4839.document.createElement('div'),
      var4842 = var4839.document.getElementById("context-menu");
    var4841.classList.add("message", param913);
    var4841.style.fontSize = Zotero.Prefs.get('ai4paper.gptSidePaneFontSize');
    let var4843 = Zotero.AI4Paper.gptReaderSidePane_addExpandArrow(var4841, param913);
    const var4844 = var4839.document.createElement("div");
    var4844.classList.add("message-row", param913);
    const var4845 = var4839.document.createElement("div");
    var4845.style.marginRight = "8px";
    var4845.classList.add("checkbox", param913);
    var4845.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked;
    var4845.setAttribute('title', "点击勾选");
    var4845.isChecked = false;
    if (Zotero.Prefs.get("ai4paper.gptUnderSelectionMessage")) {
      var4845.style.display = '';
    } else var4845.style.display = "none";
    var4845.onclick = _0x3ab4e9 => {
      _0x3ab4e9.stopPropagation();
      !var4845.isChecked ? (var4845.innerHTML = Zotero.AI4Paper.svg_icon_20px.checked, var4845.setAttribute('title', "点击取消勾选"), var4845.isChecked = true) : (var4845.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked, var4845.setAttribute("title", "点击勾选"), var4845.isChecked = false);
    };
    const var4846 = var4839.document.createElement('div');
    var4846.style.marginRight = "8px";
    var4846.classList.add("avatar", param913);
    var4846.innerHTML = param913 === 'user' ? Zotero.AI4Paper.svg_icon_20px.avatar_user : Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
    var4846.title = "点击以拷贝消息";
    var4846.addEventListener("click", _0x2d7f8d => {
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessageSourceText(_0x2d7f8d);
    });
    const var4847 = var4839.document.createElement("span");
    var4847.classList.add("username");
    let var4848 = Zotero.Prefs.get("ai4paper.gptUserName") ? Zotero.Prefs.get("ai4paper.gptUserName") : "User",
      var4849 = Zotero.Prefs.get("ai4paper.gptservice") === 'OpenAI' ? 'ChatGPT' : Zotero.Prefs.get("ai4paper.gptservice");
    param913 === 'user' && (var4839.document._service = param915?.["service"] || null);
    if (param913 === "assistant" && var4839.document._service) {
      var4849 = var4839.document._service;
      var4839.document._service = null;
    }
    var4847.textContent = param913 === "user" ? var4848 : var4849;
    var4844.appendChild(var4845);
    var4844.appendChild(var4846);
    var4844.appendChild(var4847);
    const var4850 = var4839.document.createElement('div');
    var4850.classList.add('content', param913);
    var4850.classList.add("markdown-body");
    var4850.style.fontSize = Zotero.Prefs.get("ai4paper.gptSidePaneFontSize");
    var4850.style.textAlign = "left";
    if (param913 === "user" || param913 === "assistant" && param914) {
      var4850.innerText = param912;
      (param915?.["prompt"] || param915?.['fulltext']) && (var4850.innerText = param915?.["prompt"] + ':');
    } else {
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(var4850, param912);
    }
    var4850.messageSourceText = param912;
    Zotero.AI4Paper.gptReaderSidePane_addClickEvent4ExpandArrow(var4841, var4843, var4850, param913);
    var4841.appendChild(var4844);
    var4841.appendChild(var4850);
    if (param913 === "user" && (param915?.['prompt'] || param915?.["fulltext"])) {
      const _0x43fe04 = var4839.document.createElement("div");
      _0x43fe04.classList.add("pdf-card", param913);
      _0x43fe04.onclick = _0x16f5bf => {
        if (_0x16f5bf.preventDefault) {
          _0x16f5bf.preventDefault();
        }
        _0x16f5bf.stopPropagation();
        if (_0x16f5bf.shiftKey) {
          let _0x1fff9a = window.document.createXULElement("menupopup");
          _0x1fff9a.id = 'AI4Paper-gptReaderSidePane-filesList-menupopup';
          _0x1fff9a.addEventListener('popuphidden', () => {
            window.document.querySelector("#browser").querySelectorAll("#AI4Paper-gptReaderSidePane-filesList-menupopup").forEach(_0x5157b7 => _0x5157b7.remove());
          });
          let _0x23d97f = _0x1fff9a.firstElementChild;
          while (_0x23d97f) {
            _0x23d97f.remove();
            _0x23d97f = _0x1fff9a.firstElementChild;
          }
          let _0x16d345 = var4839.document.querySelectorAll('.file-info');
          for (let var4855 of _0x16d345) {
            let _0x423616 = window.document.createXULElement("menuitem");
            _0x423616.setAttribute("label", var4855.fileName);
            _0x423616.addEventListener("command", _0x18a196 => {
              var4855.focus();
              var4855.scrollIntoView({
                'behavior': "auto",
                'block': "center"
              });
            });
            _0x1fff9a.appendChild(_0x423616);
          }
          window.document.querySelector('#browser').querySelectorAll("#AI4Paper-gptReaderSidePane-filesList-menupopup").forEach(_0x101046 => _0x101046.remove());
          window.document.querySelector('#browser')?.["appendChild"](_0x1fff9a);
          _0x1fff9a.openPopup(_0x439b67, "after_start", 0x0, 0x0, false, false);
          _0x43fe04.ownerDocument.defaultView.getSelection && _0x43fe04.ownerDocument.defaultView.getSelection().removeAllRanges();
        }
      };
      const _0x439b67 = var4839.document.createElement("div");
      _0x439b67.classList.add('pdf-icon', param913);
      _0x439b67.onclick = _0x4f38a6 => {
        _0x4f38a6.preventDefault && _0x4f38a6.preventDefault();
        _0x4f38a6.stopPropagation();
        if (_0x4f38a6.shiftKey) {
          return;
        }
        let var4858 = _0x43fe04.querySelector(".file-info"),
          var4859 = Zotero.Reader.getByTabID(Zotero_Tabs._selectedID);
        if (var4859 && var4859._item === var4858.item) {
          Zotero.AI4Paper.showProgressWindow(0x5dc, "❌ 打开附件【AI4paper】", '当前打开的就是该附件，无需再打开。');
          return;
        }
        Zotero.Reader.open(var4858.item.itemID, null, {
          'openInWindow': false
        });
      };
      _0x439b67.addEventListener('mouseover', function () {
        this.style.cursor = "pointer";
      });
      _0x439b67.addEventListener("mouseout", function () {
        this.style.cursor = "default";
      });
      _0x43fe04.appendChild(_0x439b67);
      const _0x595c29 = var4839.document.createElement("div");
      let _0x524e66 = Zotero.AI4Paper.findItemByIDORKey(param915?.['fileID']),
        _0x361c75 = '未在本文库找到本附件...(即来自其他\x20Zotero\x20账户）';
      _0x524e66 && (_0x361c75 = _0x524e66.attachmentFilename);
      _0x595c29.classList.add("file-info", param913);
      _0x595c29.prompt = param915?.["prompt"];
      _0x595c29.fulltext = param915?.["fulltext"];
      _0x595c29.fileName = _0x361c75;
      _0x595c29.item = _0x524e66;
      _0x595c29.itemID = param915?.['fileID'];
      const _0x8f00a4 = var4839.document.createElement('div');
      _0x8f00a4.classList.add("file-name", param913);
      _0x8f00a4.innerText = _0x361c75;
      _0x8f00a4.title = _0x361c75;
      _0x595c29.appendChild(_0x8f00a4);
      const _0x51fb82 = var4839.document.createElement("div");
      _0x51fb82.classList.add("file-size", param913);
      _0x51fb82.innerText = "PDF 解析成功";
      _0x595c29.appendChild(_0x51fb82);
      _0x43fe04.appendChild(_0x595c29);
      var4841.appendChild(_0x43fe04);
    }
    var4841.addEventListener("contextmenu", function (param916) {
      param916.preventDefault();
      let _0x3bd96c = false;
      param916.target.closest(".pdf-card") && (_0x3bd96c = true);
      Zotero.AI4Paper._contextmenuEvent_messageEl = param916;
      var4842.style.display = 'block';
      var4842.style.left = param916.pageX + 'px';
      var4842.style.top = param916.pageY + 'px';
      let _0x26296d = var4839.document.querySelectorAll("#context-menu li");
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_getSelectedMessages();
      for (var var4867 = 0x0; var4867 < _0x26296d.length; var4867++) {
        ["拷贝附件标题", "拷贝附件全文", "打开附件", '在本地显示附件'].includes(_0x26296d[var4867].innerText) ? _0x26296d[var4867].style.display = !_0x3bd96c ? "none" : '' : _0x26296d[var4867].style.display = !_0x3bd96c ? '' : "none";
        if (var4867 === 0x0) {
          if (Zotero.Prefs.get('ai4paper.gptUnderSelectionMessage') && Zotero.AI4Paper._store_selecteGPTMessages.length) _0x26296d[var4867].innerText = "完成导出消息选择";else {
            if (Zotero.Prefs.get('ai4paper.gptUnderSelectionMessage') && !Zotero.AI4Paper._store_selecteGPTMessages.length) _0x26296d[var4867].innerText = '退出消息选择';else !Zotero.Prefs.get("ai4paper.gptUnderSelectionMessage") && (_0x26296d[var4867].innerText = "选择消息以导出为卡片笔记");
          }
        } else var4867 === 0x2 && (_0x26296d[var4867].style.display = !Zotero.Prefs.get("ai4paper.gptUnderSelectionMessage") || _0x3bd96c ? "none" : '');
      }
    });
    var4841.addEventListener("click", async function (param917) {
      if (param913 != "user" && param917.shiftKey && !param917.ctrlKey && !param917.altKey && !param917.metaKey) {
        param917.preventDefault && param917.preventDefault();
        param917.stopPropagation();
        var4841.focus();
        var4841.scrollIntoView({
          'behavior': "auto",
          'block': "start"
        });
        var4841.ownerDocument.defaultView.getSelection && var4841.ownerDocument.defaultView.getSelection().removeAllRanges();
      }
      if (param917.target != var4845 && Zotero.Prefs.get("ai4paper.gptUnderSelectionMessage")) {
        if (!var4845.isChecked) {
          var4845.innerHTML = Zotero.AI4Paper.svg_icon_20px.checked;
          var4845.setAttribute('title', '点击取消勾选');
          var4845.isChecked = true;
        } else {
          var4845.innerHTML = Zotero.AI4Paper.svg_icon_20px.unchecked;
          var4845.setAttribute("title", "点击勾选");
          var4845.isChecked = false;
        }
      }
    }, false);
    var4840.appendChild(var4841);
    const var4868 = var4839.document.createElement("div");
    var4868.classList.add("message-buttons", param913);
    let var4869 = var4839.document.createElement("div");
    return var4869.classList.add("button", param913), var4869.classList.add("quickButton-Go2MessageTop"), var4869.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonGo2MessageTop") ? '' : 'none', var4869.innerHTML = Zotero.AI4Paper.svg_icon_16px.scrollTop, var4869.setAttribute('title', "前往消息顶部"), var4869.addEventListener("mousedown", async _0xf50eed => {
      _0xf50eed.preventDefault && _0xf50eed.preventDefault();
      _0xf50eed.stopPropagation();
      if (_0xf50eed.shiftKey) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_scrollTop();
        var4839.getSelection && var4839.getSelection().removeAllRanges();
        return;
      }
      _0xf50eed.button === 0x0 && (Zotero.AI4Paper.gptReaderSidePane_ChatMode_go2MessageTop(_0xf50eed, true), var4839.getSelection && (await Zotero.Promise.delay(0x32), var4839.getSelection().removeAllRanges()));
    }), var4868.appendChild(var4869), var4869 = var4839.document.createElement('div'), var4869.classList.add("button", param913), var4869.classList.add("quickButton-CopyMessage"), var4869.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonCopyMessage") ? '' : "none", var4869.innerHTML = Zotero.AI4Paper.svg_icon_16px.clipboard, var4869.title = '拷贝消息', var4869.addEventListener("mousedown", _0x10848c => {
      if (_0x10848c.preventDefault) {
        _0x10848c.preventDefault();
      }
      _0x10848c.stopPropagation();
      if (_0x10848c.shiftKey) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyAllMessages(false);
        return;
      }
      _0x10848c.button === 0x0 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessage(_0x10848c, true);
    }), var4868.appendChild(var4869), var4869 = var4839.document.createElement("div"), var4869.classList.add("button", param913), var4869.classList.add("quickButton-CopyMessageSourceText"), var4869.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonCopyMessageSourceText") ? '' : "none", var4869.innerHTML = Zotero.AI4Paper.svg_icon_16px.markdown, var4869.title = "拷贝 Markdown 消息", var4869.addEventListener("mousedown", _0x4c85d8 => {
      if (_0x4c85d8.preventDefault) {
        _0x4c85d8.preventDefault();
      }
      _0x4c85d8.stopPropagation();
      if (_0x4c85d8.shiftKey) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyAllMessages(true);
        return;
      }
      _0x4c85d8.button === 0x0 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_copyMessageSourceText(_0x4c85d8, true);
    }), var4868.appendChild(var4869), var4869 = var4839.document.createElement('div'), var4869.classList.add("button", param913), var4869.classList.add('quickButton-SaveMessages'), var4869.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonSaveMessages") ? '' : "none", var4869.innerHTML = Zotero.AI4Paper.svg_icon_16px.save, var4869.title = "保存消息", var4869.onclick = _0xf62f93 => {
      _0xf62f93.preventDefault && _0xf62f93.preventDefault();
      _0xf62f93.stopPropagation();
      let _0xe0cbaf = "AI4Paper-gptReaderSidePane-SaveMessages-menupopup",
        _0x1a7b90 = Zotero.AI4Paper.createPopup_universal(_0xe0cbaf, true);
      const _0x1e92de = [{
        'label': "导出至选定分类（.md）",
        'children': [{
          'label': "当前消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD(var4839, 'currentMessage', _0xf62f93);
          }
        }, {
          'label': "全部 AI 回复",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD(var4839, "assistantMessages");
          }
        }, {
          'label': "全部消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2CollectionAsMD(var4839, "allMessages");
          }
        }],
        'separator': true
      }, {
        'label': '导出至我的文库（.md）',
        'children': [{
          'label': "当前消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD(var4839, "currentMessage", _0xf62f93);
          }
        }, {
          'label': '全部\x20AI\x20回复',
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD(var4839, "assistantMessages");
          }
        }, {
          'label': "全部消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2UserLibraryAsMD(var4839, "allMessages");
          }
        }],
        'separator': true
      }, {
        'label': "导出至预设路径（.md）",
        'children': [{
          'label': "当前消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD(var4839, "currentMessage", _0xf62f93);
          }
        }, {
          'label': '全部\x20AI\x20回复',
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD(var4839, "assistantMessages");
          }
        }, {
          'label': "全部消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalDirectoryAsMD(var4839, "allMessages");
          }
        }],
        'separator': true
      }, {
        'label': "导出至本地（.md）",
        'children': [{
          'label': "当前消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD(var4839, "currentMessage", _0xf62f93);
          }
        }, {
          'label': "全部 AI 回复",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD(var4839, "assistantMessages");
          }
        }, {
          'label': "全部消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2LocalAsMD(var4839, 'allMessages');
          }
        }],
        'separator': true
      }, {
        'label': "绑定至选定文献（.md）",
        'children': [{
          'label': "当前消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD(var4839, "currentMessage", _0xf62f93);
          }
        }, {
          'label': "全部 AI 回复",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD(var4839, 'assistantMessages');
          }
        }, {
          'label': "全部消息",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2AttachmentAsMD(var4839, "allMessages");
          }
        }]
      }, {
        'label': '绑定至打开文献（.md）',
        'children': [{
          'label': '当前消息',
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD(var4839, "currentMessage", _0xf62f93);
          }
        }, {
          'label': "全部 AI 回复",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD(var4839, "assistantMessages");
          }
        }, {
          'label': '全部消息',
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_exportAIMessages2TabItemAttachmentAsMD(var4839, "allMessages");
          }
        }],
        'separator': true
      }, {
        'label': "绑定为笔记附件",
        'children': [{
          'label': "全部 AI 回复（新建）",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveAIMessages2NoteItem(var4839, 'assistantMessages', true);
          }
        }, {
          'label': "全部消息（新建）",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveAIMessages2NoteItem(var4839, "allMessages", true);
          },
          'separator': true
        }, {
          'label': '全部\x20AI\x20回复（覆盖）',
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveAIMessages2NoteItem(var4839, "assistantMessages", false);
          }
        }, {
          'label': "全部消息（覆盖）",
          'action': () => {
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveAIMessages2NoteItem(var4839, 'allMessages', false);
          }
        }]
      }];
      Zotero.AI4Paper.createMenuitem_universal(window, _0x1a7b90, _0x1e92de);
      _0x1a7b90.openPopup(_0xf62f93.target, 'after_start', 0x0, 0x0, false, false);
    }, var4868.appendChild(var4869), param913 === 'user' && (var4869 = var4839.document.createElement('div'), var4869.classList.add("button", param913), var4869.classList.add("quickButton-ModifyUserMessage"), var4869.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonModifyUserMessage") ? '' : "none", var4869.innerHTML = Zotero.AI4Paper.svg_icon_16px.rename_16px, var4869.title = "修改后重新提问", var4869.addEventListener("click", _0x11c02c => {
      _0x11c02c.preventDefault && _0x11c02c.preventDefault();
      _0x11c02c.stopPropagation();
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_modifyUserMessage(_0x11c02c, var4839);
    }), var4868.appendChild(var4869)), param913 === "assistant" && (var4869 = var4839.document.createElement('div'), var4869.classList.add('button', param913), var4869.classList.add("quickButton-UpdateAssistantMessage"), var4869.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonUpdateAssistantMessage") ? '' : "none", var4869.innerHTML = Zotero.AI4Paper.svg_icon_16px.update_16px, var4869.title = "重新生成回复", var4869.addEventListener("click", _0x48b60a => {
      _0x48b60a.preventDefault && _0x48b60a.preventDefault();
      _0x48b60a.stopPropagation();
      Zotero.AI4Paper.gptReaderSidePane_ChatMode_updateAssistantMessage(_0x48b60a, var4839);
    }), var4868.appendChild(var4869)), var4869 = var4839.document.createElement("div"), var4869.classList.add("button", param913), var4869.classList.add("quickButton-AddMessage2SelectedAnnotation"), var4869.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonAddMessage2SelectedAnnotation") ? '' : "none", var4869.innerHTML = Zotero.AI4Paper.svg_icon_16px.importAnnotations, var4869.title = "添加至注释评论", var4869.addEventListener("mousedown", _0x774e51 => {
      _0x774e51.preventDefault && _0x774e51.preventDefault();
      _0x774e51.stopPropagation();
      if (_0x774e51.shiftKey) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_addMessage2SelectedAnnotation(_0x774e51, false);
        return;
      }
      _0x774e51.button === 0x0 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_addMessage2SelectedAnnotation(_0x774e51, true);
    }), var4868.appendChild(var4869), var4869 = var4839.document.createElement("div"), var4869.classList.add('button', param913), var4869.classList.add("quickButton-CreateAIReadingNoteItem"), var4869.style.display = Zotero.Prefs.get("ai4paper.gptQuickButtonCreateAIReadingNoteItem") ? '' : "none", var4869.innerHTML = Zotero.AI4Paper.svg_icon_16px.add_16px, var4869.title = "追加至【文献解读】笔记附件", var4869.addEventListener('mousedown', _0x2a2347 => {
      _0x2a2347.preventDefault && _0x2a2347.preventDefault();
      _0x2a2347.stopPropagation();
      if (_0x2a2347.shiftKey) {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItem(_0x2a2347, false, true);
        return;
      }
      _0x2a2347.button === 0x0 && Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItem(_0x2a2347, true, true);
    }), var4868.appendChild(var4869), var4840.appendChild(var4868), var4840;
  },
  'gptReaderSidePane_ChatMode_renderMessageContent': function (param918, param919, param920) {
    let var4873 = param919;
    if (var4873.indexOf("<think>") === 0x0) {
      if (param920?.['_gptStreamRunning'] && var4873.indexOf("</think>") === -0x1) {
        var4873 = var4873 + "</think>";
        var4873 = var4873.replace("<think>", '<blockquote>').replace("</think>", '</blockquote>\x0a');
      } else var4873.indexOf("</think>") != -0x1 && (var4873 = var4873.replace("<think>", '<blockquote>').replace("</think>", "</blockquote>\n"));
    } else {
      if (var4873.indexOf('\x0a<think>') === 0x0) {
        if (param920?.["_gptStreamRunning"] && var4873.indexOf("</think>") === -0x1) {
          var4873 = var4873 + '</think>';
          var4873 = var4873.replace("\n<think>", "<blockquote>").replace("</think>", "</blockquote>\n");
        } else {
          if (var4873.indexOf("</think>") != -0x1) {
            var4873 = var4873.replace('\x0a<think>', "<blockquote>").replace('</think>', "</blockquote>\n");
          }
        }
      }
    }
    let var4874 = '',
      var4875 = var4873.indexOf("<div class=\"ZoteroOne-VolcanoSearch-Refs\"");
    var4875 != -0x1 && (var4874 = var4873.substring(var4875), var4873 = var4873.substring(0x0, var4875));
    let var4876 = var4873,
      var4877 = Zotero.AI4Paper.renderMarkdown(var4876);
    var4873 = Zotero.AI4Paper.renderMarkdownLaTeX(var4873);
    var4874 && (var4873 += var4874, var4877 += var4874);
    if (param918) {
      param918.innerHTML = var4873;
    } else return var4877;
  },
  'gptReaderSidePane_ChatMode_displayErrorMessage': function (param921) {
    let var4878 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4878) return false;
    let var4879 = var4878.document.getElementById("chat-container"),
      var4880 = var4878.document.querySelectorAll(".message"),
      var4881 = var4880[var4880.length - 0x1];
    if (var4881.className != "message assistant") {
      messageEl = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(param921, 'assistant');
      var4879.appendChild(messageEl);
      var4879.scrollTop = var4879.scrollHeight;
    } else {
      var4881.querySelector('.content').innerText = param921;
      var4879.scrollTop = var4879.scrollHeight;
    }
  },
  'gptReaderSidePane_ChatMode_saveError2MessageHistory': function (param922, param923) {
    let var4882 = {
      'role': "assistant",
      'content': param922
    };
    param923.push(var4882);
    Zotero.AI4Paper._data_gptCurrentUserMessage = JSON.stringify([]);
    Zotero.Prefs.set("ai4paper.gptStreamRunning", false);
    try {
      Zotero.AI4Paper._data_gptMessagesHistory = JSON.stringify(param923);
    } catch (_0x28e555) {
      Zotero.debug(_0x28e555);
      return;
    }
    Zotero.AI4Paper.updateChatGPTReaderSidePane();
    Zotero.AI4Paper.saveChatHistory2Local();
  },
  'gptReaderSidePane_ChatMode_updateSelectedTabStreamingOut': function (param924) {
    let var4883 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4883 = window.document.getElementById('ai4paper-chatgpt-readersidepane').contentWindow);
    if (!var4883) {
      return;
    }
    let var4884 = var4883.document.querySelectorAll(".message");
    if (var4884.length) {
      let var4885 = var4883.document.getElementById("chat-container"),
        var4886 = var4884[var4884.length - 0x1];
      if (var4886.className != "message assistant") {
        let _0x565ccd = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(param924, "assistant");
        var4885.appendChild(_0x565ccd);
        !Zotero.Prefs.get('ai4paper.gptPinMessage') && (var4885.scrollTop = var4885.scrollHeight);
      } else {
        var4886.querySelector(".content").innerText = param924;
        !Zotero.Prefs.get("ai4paper.gptPinMessage") && (var4885.scrollTop = var4885.scrollHeight);
      }
    }
  },
  'convertMessages': function () {
    let var4888 = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory),
      var4889 = [];
    for (let var4890 of var4888) {
      let _0x57e37a, _0x55a9bd;
      for (let var4893 in var4890) {
        if (var4893 === 'role') {
          _0x57e37a = var4890[var4893];
          _0x57e37a = _0x57e37a === "user" ? 'USER' : "MODEL";
        } else var4893 === "content" && (_0x55a9bd = var4890[var4893]);
      }
      let _0x3f3c78 = {
        'role': _0x57e37a,
        'parts': [{
          'text': _0x55a9bd
        }]
      };
      var4889.push(_0x3f3c78);
    }
    return var4889;
  },
  'getSelectedPromptFromList': function () {
    try {
      let var4895 = window.document.querySelector("#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist").value;
      return Zotero.Prefs.set("ai4paper.chatgptprompttemplate", var4895), Zotero.AI4Paper.resolvePrompt(var4895);
    } catch (_0x5db976) {
      return Zotero.debug(_0x5db976), '';
    }
  },
  'resolvePrompt': function (param925) {
    try {
      let _0x5bc7f0 = JSON.parse(Zotero.Prefs.get("ai4paper.prompttemplateuserobject"));
      for (let var4897 of _0x5bc7f0) {
        if (var4897.alias === param925.trim()) {
          param925 = var4897.realTemplate;
          break;
        }
      }
      let _0x7e65ec = {
        'AI\x20解读论文\x20🔒': Zotero.Prefs.get("ai4paper.prompt4PaperAI"),
        '论文深度解读\x20🔒': Zotero.Prefs.get('ai4paper.prompt4PaperDeepInterpretation'),
        '论文简要剖析\x20🔒': Zotero.Prefs.get('ai4paper.prompt4PaperBriefAnalysis')
      };
      if (Object.keys(_0x7e65ec).includes(param925)) {
        param925 = _0x7e65ec[param925];
      }
      return param925.replace(/🌝/g, '\x0a');
    } catch (_0xe3b5a7) {
      return Zotero.debug(_0xe3b5a7), param925;
    }
  },
  'gptReaderSidePane_ChatMode_getQuestion': function (param926) {
    let var4899 = '',
      var4900 = param926.document.getElementById("message-input").value.trim(),
      var4901 = Zotero.AI4Paper.getSelectedPromptFromList();
    param926._hasFullText && param926._modifiedPrompt && (var4901 = param926._modifiedPrompt);
    if (var4901 === '无' || !var4901) var4899 = var4900;else var4900 ? var4899 = var4901 + ":\n\n" + var4900 : var4899 = var4901;
    let var4902 = '',
      var4903 = '',
      var4904 = '',
      var4905 = param926._fromPaperAI ? true : false;
    param926._fromPaperAI = false;
    if (param926._hasFullText) {
      var4902 = var4901;
      var4903 = var4900;
      let var4906 = Zotero.Reader.getByTabID(Zotero_Tabs._selectedID);
      var4906 && (var4904 = var4906._item.key);
    }
    return {
      'question': var4899,
      'prompt': var4902,
      'fulltext': var4903,
      'fileID': var4904,
      'fromPaperAI': var4905
    };
  },
  'gptReaderSidePane_updateSendButtonState': function () {
    try {
      let _0xaea651 = Zotero.Prefs.get('ai4paper.gptContinuesChatMode') ? Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt") : window,
        _0x4e10a5 = Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? _0xaea651.document.getElementById("send-button") : _0xaea651.document.querySelector("#chatgpt-readerSidePane-send-icon"),
        _0x4b3ad5 = () => Zotero.AI4Paper['' + (Zotero.Prefs.get("ai4paper.gptContinuesChatMode") ? "gptReaderSidePane_ChatMode_send" : "gptReaderSidePane_send")]();
      if (Zotero.Prefs.get("ai4paper.gptStreamRunning")) {
        _0x4e10a5.innerHTML = Zotero.AI4Paper.svg_icon_20px.abort;
        _0x4e10a5.setAttribute("title", "中止请求");
        _0x4e10a5.onclick = () => {
          Zotero.AI4Paper.isAbortRequested = true;
          Zotero.Prefs.set("ai4paper.gptStreamRunning", false);
          _0xaea651._gptStreamRunning = false;
          Zotero.AI4Paper.gptReaderSidePane_updateStreamingUI();
          _0x4e10a5.innerHTML = Zotero.AI4Paper.svg_icon_20px.send;
          _0x4e10a5.setAttribute("title", '发送');
          _0x4e10a5.onclick = _0x4b3ad5;
        };
      } else {
        _0x4e10a5.innerHTML = Zotero.AI4Paper.svg_icon_20px.send;
        _0x4e10a5.setAttribute("title", '发送');
        _0x4e10a5.onclick = _0x4b3ad5;
      }
    } catch (_0x5f3489) {
      Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 刷新发送按钮出错了【AI4paper】", _0x5f3489.message);
    }
    Zotero.AI4Paper.gptReaderSidePane_updateStreamingUI();
  },
  'gptReaderSidePane_updateStreamingUI': function () {
    try {
      let var4910 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
      if (!var4910) return;
      const var4911 = var4910.document.getElementById('scroll-to-bottom-btn');
      if (!var4911) return;
      var4910._gptStreamRunning ? var4911.classList.add("is-streaming") : var4911.classList.remove("is-streaming");
    } catch (_0x250bd5) {
      Zotero.debug(_0x250bd5);
    }
  },
  'gptReaderSidePane_hiddeScrollBtn': function (param927) {
    try {
      const var4912 = param927.document.getElementById('scroll-to-bottom-btn');
      if (!var4912) return;
      var4912.style.display = 'none';
    } catch (_0xcc851c) {
      Zotero.debug(_0xcc851c);
    }
  },
  'gptReaderSidePane_ChatMode_displayMessageChunk': function (param928, param929, param930) {
    if (!param929) return;
    Zotero.Prefs.set("ai4paper.chatgptresponse", param929);
    let var4913 = param928.document.querySelectorAll(".message");
    if (var4913.length) {
      let var4914 = var4913[var4913.length - 0x1];
      if (var4914.className != 'message\x20assistant') {
        let _0x3a6b62 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(param929, 'assistant', true);
        Zotero.Prefs.get("ai4paper.renderMarkdownLaTeXRealTime") && (_0x3a6b62 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(param929, "assistant", false));
        param930.appendChild(_0x3a6b62);
        if (!Zotero.Prefs.get("ai4paper.gptPinMessage")) {
          param930.scrollTop = param930.scrollHeight;
        }
      } else {
        if (Zotero.Prefs.get('ai4paper.renderMarkdownLaTeXRealTime')) Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(var4914.querySelector('.content'), param929, param928);else {
          var4914.querySelector(".content").innerText = param929;
        }
        var4914.querySelector('.content').messageSourceText = param929;
        !Zotero.Prefs.get("ai4paper.gptPinMessage") && (param930.scrollTop = param930.scrollHeight);
      }
    }
  },
  'gptReaderSidePane_ChatMode_enhanceMessageElem': function (param931) {
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_dblclickToCopyCodeBlock(param931);
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_addClickEvent2Links(param931);
  },
  'gptReaderSidePane_ChatMode_dblclickToCopyCodeBlock': function (param932) {
    if (!param932) {
      param932 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (!param932) return false;
    }
    param932.document.querySelectorAll("pre").forEach(_0x5f3e2a => {
      if (!_0x5f3e2a._dblclickEvent_added) {
        _0x5f3e2a._dblclickEvent_added = true;
        _0x5f3e2a.addEventListener("dblclick", _0x13da83 => {
          _0x13da83.stopPropagation();
          _0x5f3e2a.textContent && (Zotero.AI4Paper.copy2Clipboard(_0x5f3e2a.textContent), Zotero.AI4Paper.showProgressWindow(0x5dc, "✅ 成功拷贝代码块【AI4paper】", '' + _0x5f3e2a.textContent.substring(0x0, 0x19) + (_0x5f3e2a.textContent.length > 0x1a ? "..." : ''), "openai"));
        });
      }
    });
  },
  'gptReaderSidePane_ChatMode_addClickEvent2Links': function (param933) {
    if (!param933) {
      param933 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
      if (!param933) return false;
    }
    param933.document.querySelectorAll('a').forEach(_0x287821 => {
      const _0x5e440b = _0x287821.textContent;
      _0x5e440b.startsWith("zotero://") && (_0x287821.style = "color: blue; text-decoration: underline; cursor: pointer;", !_0x287821.href && (_0x287821.href = _0x5e440b));
      !_0x287821._clickEvent_added && (_0x287821._clickEvent_added = true, _0x287821.addEventListener("click", function (param934) {
        param934.preventDefault();
        param934.stopPropagation();
        let var4917 = this.getAttribute("href");
        if (_0x5e440b.startsWith('zotero://')) {
          if (param934.shiftKey) {
            Zotero.AI4Paper.gptReaderSidePane_onClickZoteroItemLink(_0x5e440b, 'openNotes');
            return;
          }
          Zotero.AI4Paper.gptReaderSidePane_onClickZoteroItemLink(_0x5e440b);
        } else var4917 && ZoteroPane.loadURI(var4917);
      }), _0x5e440b.startsWith("zotero://") && _0x287821.addEventListener("contextmenu", _0x47c751 => {
        _0x47c751.preventDefault();
        _0x47c751.stopPropagation();
        Zotero.AI4Paper.gptReaderSidePane_onClickZoteroItemLink(_0x5e440b, "showItem");
      }, false));
    });
  },
  'gptReaderSidePane_onClickZoteroItemLink': async function (param935, param936) {
    if (param935.includes("items/")) {
      let _0x438176 = param935.split("items/")[0x1];
      if (!_0x438176) {
        window.alert('❌\x20未提取到\x20itemKey！');
        return;
      }
      let _0x163182 = Zotero.AI4Paper.findItemByIDORKey(_0x438176);
      if (!_0x163182) return;
      if (param936 === "showItem") Zotero.AI4Paper.showItemInCollection(_0x163182);else {
        if (param936 === 'openNotes' && Zotero?.['Notes']?.["open"]) {
          let _0xebb0fc = Zotero.AI4Paper.findNoteItem_basedOnTag(_0x163182, Zotero.AI4Paper._aiReadingNoteTag);
          _0xebb0fc ? Zotero.Notes.open(_0xebb0fc.itemID, null, {
            'openInWindow': false
          }) : Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 未发现【AI 文献解读】笔记附件", "该条目暂无【AI 文献解读】笔记附件。");
        } else {
          if (_0x163182.isAttachment()) Zotero.Reader.open(_0x163182.itemID, null, {
            'openInWindow': false
          });else {
            let var4921 = await _0x163182.getBestAttachment();
            if (var4921) Zotero.Reader.open(var4921.itemID, null, {
              'openInWindow': false
            });else {
              Zotero.AI4Paper.showItemInCollection(_0x163182);
            }
          }
        }
      }
    } else {
      if (param935 === "zotero://select/library/user") {
        Zotero_Tabs.select("zotero-pane");
        await ZoteroPane.collectionsView.selectLibrary(Zotero.Libraries.userLibraryID);
      } else {
        if (param935.includes("zotero://select/library/group/")) {
          let var4922 = param935.replace("zotero://select/library/group/", '');
          Zotero_Tabs.select('zotero-pane');
          await ZoteroPane.collectionsView.selectLibrary(var4922);
        } else {
          if (param935.includes('zotero://select/library/feed/')) {
            let var4923 = param935.replace("zotero://select/library/feed/", '');
            Zotero_Tabs.select("zotero-pane");
            await ZoteroPane.collectionsView.selectLibrary(var4923);
          } else {
            ZoteroPane.loadURI(param935);
          }
        }
      }
    }
  },
  'gptReaderSidePane_ChatMode_checkPreTags': function (param937) {
    var var4924 = param937.match(/<pre>/g),
      var4925 = param937.match(/<!DOCTYPE html>/g);
    return !var4924 && !var4925 ? true : false;
  },
  'gptReaderSidePane_ChatMode_onStreamDone': function (param938, param939, param940, param941) {
    Zotero.Prefs.set('ai4paper.gptStreamRunning', false);
    param938._gptStreamRunning = false;
    let var4926 = {
      'role': 'assistant',
      'content': param940
    };
    param939.push(var4926);
    Zotero.AI4Paper.isAbortRequested = false;
    param938.document.getElementById("send-button").innerHTML = Zotero.AI4Paper.svg_icon_20px.send;
    param938.document.getElementById("send-button").setAttribute('title', '发送');
    param938.document.getElementById('send-button').onclick = () => Zotero.AI4Paper.gptReaderSidePane_ChatMode_send();
    Zotero.AI4Paper._data_gptCurrentUserMessage = JSON.stringify([]);
    try {
      Zotero.AI4Paper._data_gptMessagesHistory = JSON.stringify(param939);
    } catch (_0x3db765) {
      Zotero.debug(_0x3db765);
      return;
    }
    Zotero.AI4Paper.updateChatGPTReaderSidePane();
    Zotero.Prefs.get('ai4paper.gptChatHistoryViewerEnable') && !(param941?.["fromPaperAI"] && Zotero.Prefs.get("ai4paper.excludeHistoryFromPaperAI")) && Zotero.AI4Paper.updateTransViewer('🙋<p>' + param941?.['question'], '🤖️<p>' + Zotero.AI4Paper.gptReaderSidePane_ChatMode_renderMessageContent(null, param940));
    param941?.["fromPaperAI"] && Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItemAuto(param938, param941);
    Zotero.AI4Paper.saveChatHistory2Local();
  },
  'gptReaderSidePane_ChatMode_onRequestDone': function (param942, param943, param944, param945) {
    let var4927 = param942.document.getElementById("chat-container"),
      var4928 = {
        'role': "assistant",
        'content': param944
      };
    param943.push(var4928);
    let var4929 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(param944, "assistant");
    var4927.appendChild(var4929);
    !Zotero.Prefs.get("ai4paper.gptPinMessage") && (var4927.scrollTop = var4927.scrollHeight);
    Zotero.AI4Paper._data_gptCurrentUserMessage = JSON.stringify([]);
    try {
      Zotero.AI4Paper._data_gptMessagesHistory = JSON.stringify(param943);
    } catch (_0x31ec10) {
      Zotero.debug(_0x31ec10);
      return;
    }
    Zotero.AI4Paper.updateChatGPTReaderSidePane();
    if (Zotero.Prefs.get("ai4paper.translationviewerenable")) {
      Zotero.AI4Paper.updateTransViewer("🙋<p>" + param945?.["question"], '🤖️<p>' + param944);
    }
    param945?.["fromPaperAI"] && Zotero.AI4Paper.gptReaderSidePane_ChatMode_createAIReadingNoteItemAuto(param942, param945);
    Zotero.AI4Paper.saveChatHistory2Local();
  },
  'updateChatHistoryFileName': function (param946) {
    try {
      if (!JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory).length) {
        let _0x199680 = '\x20⌚️\x20' + Zotero.AI4Paper.getDateTime().replace(/:/g, '-'),
          _0xb0c299 = Zotero.AI4Paper.sanitizeFilename(param946.question.substring(0x0, 0x32));
        if (param946?.['fileID']) {
          let var4932 = Zotero.AI4Paper.findItemByIDORKey(param946?.['fileID']);
          if (var4932) {
            let var4933 = var4932.attachmentFilename;
            if (var4933 === 'PDF' && var4932.parentItem) {
              _0xb0c299 = '🤖\x20' + Zotero.AI4Paper.sanitizeFilename(var4932.parentItem.getField("title").substring(0x0, 0x5a));
            } else _0xb0c299 = "🤖 " + Zotero.AI4Paper.sanitizeFilename(var4933.substring(0x0, 0x5a));
          }
        }
        let _0x4a142c = '' + _0xb0c299 + _0x199680 + ".json";
        Zotero.AI4Paper._data_gptChatHistoryFileName = _0x4a142c;
      }
    } catch (_0x2293d1) {
      Zotero.debug(_0x2293d1);
    }
  },
  'saveChatHistory2Local': async function () {
    try {
      if (Zotero.Prefs.get("ai4paper.gptChatHistoryEnable")) {
        let var4935 = Zotero.Prefs.get('ai4paper.gptChatHistoryLocalPath');
        if (var4935 && (await OS.File.exists(var4935))) {
          let _0x204f4a = JSON.stringify(JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory), null, 0x2),
            _0x104dd4 = OS.Path.join(var4935, Zotero.AI4Paper._data_gptChatHistoryFileName);
          await Zotero.File.putContentsAsync(_0x104dd4, _0x204f4a);
        }
      }
    } catch (_0x195e81) {
      Zotero.debug(_0x195e81);
    }
  },
  'readChatHistoryFromLocal': async function (param947) {
    let var4938 = await IOUtils.getChildren(param947),
      var4939 = [];
    function fn21(param948) {
      if (param948.includes('⌚️')) {
        return param948.substr(0x0, param948.lastIndexOf('⌚️')).trim();
      }
      return param948.substr(0x0, param948.lastIndexOf(".json")).trim();
    }
    try {
      for (let var4940 of var4938) {
        if (var4940.toLowerCase().endsWith(".json")) {
          let var4941 = await IOUtils.stat(var4940),
            var4942 = await Zotero.File.getContentsAsync(var4940);
          var4939.push({
            'title': fn21(PathUtils.filename(var4940)),
            'fileName': PathUtils.filename(var4940),
            'path': var4940,
            'lastModified': var4941.lastModified,
            'time': new Date(var4941.lastModified).toLocaleString().replace(/\//g, '-'),
            'size': var4941.size,
            'content': var4942
          });
        }
      }
      var4939.sort((_0x2c098c, _0x58eaec) => _0x58eaec.lastModified - _0x2c098c.lastModified);
      var4939.forEach((_0x4ac511, _0xec4940) => {
        var4939[_0xec4940].id = _0xec4940 + 0x1;
      });
    } catch (_0x389b8e) {
      Zotero.debug(_0x389b8e);
    }
    return var4939;
  },
  'importChat': async function (param949) {
    let var4943 = Zotero.Prefs.get("ai4paper.gptChatHistoryLocalPath");
    if (!var4943 || !(await Zotero.AI4Paper.isPathExists(var4943))) {
      window.alert("❌ AI 对话历史【本地存储文件夹】尚未设置或不存在！请先前往【AI4paper 设置 --> GPT 设置 --> AI 对话历史】进行设置。");
      return;
    }
    let var4944 = Zotero.AI4Paper.openDialogByType_modal("importChat", param949);
    if (!var4944) return;
    let {
      msgArr: _0xdb4c5,
      question: _0x3e168b
    } = var4944;
    if (param949) {
      let var4945 = " ⌚️ " + Zotero.AI4Paper.getDateTime().replace(/:/g, '-'),
        var4946 = Zotero.AI4Paper.sanitizeFilename(_0x3e168b.substring(0x0, 0x32)),
        var4947 = '' + var4946 + var4945 + ".json",
        var4948 = JSON.stringify(_0xdb4c5, null, 0x2),
        var4949 = OS.Path.join(var4943, var4947);
      await Zotero.File.putContentsAsync(var4949, var4948);
      Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 导入外部 AI 对话【AI4paper】", "成功导入外部 AI 对话至路径 👉 " + var4949 + " 👈");
    }
    return _0xdb4c5;
  },
  'hasPer_mission': function (param950) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) return param950 && window.alert(Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF("4q2NJGqweHWzczCQcnVh5cDb5qzr5s+B5sT777zN6L+35ZnO5c6B44DRXn90AYKwJPjvwvf9sjBuMU4hXn90AYKwJF9vATBuMU4h5s+B5sT744DSJPjCmPf9lfb/hPb0v+bQlvT7uv+8hR=="))), false;
    if (param950 && Zotero.Prefs.get("ai4paper.activationkeyverifyresult") === Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded")) && !Zotero?.['Sync']?.["Data"]?.['Local']?.["_getAPIKeyLoginInfo"]()?.["password"]) {
      return Services.prompt.alert(window, Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF("4q2NJGqweHWzczCQcnVh5s+B5sT75p6J5q2E5Z+Y6Aj7")), Zotero.AI4Paper.decpCN(Zotero.AI4Paper.removeIF("5pLp5cDb5qzr55n75c2WJGqweHWzczEomLknjMgmlJ3wwJaps7gmjZ3mwpEkhKCbc3Smdn8h6L6+572vJD0uQjEmlJansbYkhKImspanjKEoncwmwAYwwJamlLcmjKlhXn90AYKwJF9vATEnk5Mlv7cnm6Ent5YqjcUnoZQkhJJ="))), false;
    }
    return true;
  },
  'gptService_isTokenEmpty_APIVerified': function (param951, param952, param953, param954, param955) {
    let var4950 = '';
    if (param951 === '') {
      var4950 = "❌ 尚未配置【" + param952 + "】！\n\n请先前往【Zotero 设置 --> AI4paper --> GPT API】绑定【" + param952 + "】API-Key！";
      if (param954 === 'translation' && param953) Zotero.AI4Paper.translateReaderSidePane_showErrorMessage(var4950);else param954 === "chat" && param953 && window.alert(var4950);
      if (param955) {
        throw new Error(var4950.replace('❌', ''));
      }
      return false;
    }
    if (Zotero.AI4Paper.gptServiceList()[param952].api_verifyResult != "验证成功") {
      var4950 = "❌ 尚未验证【" + param952 + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> GPT API】验证【" + param952 + '】API-Key！';
      if (param954 === "translation" && param953) Zotero.AI4Paper.translateReaderSidePane_showErrorMessage(var4950);else param954 === 'chat' && param953 && window.alert(var4950);
      if (param955) {
        throw new Error(var4950.replace('❌', ''));
      }
      return false;
    }
    return true;
  },
  'getIframeWindowBySidePaneType': function (param956) {
    let var4951 = null;
    window.document.getElementById('ai4paper-' + param956 + "-readersidepane") && (var4951 = window.document.getElementById('ai4paper-' + param956 + '-readersidepane').contentWindow);
    if (!var4951) {
      return false;
    }
    return var4951;
  },
  'checkJSON': function (param957) {
    try {
      if (!param957) return {
        'msg': "❌ 内容为空，请先输入！",
        'isJSON': false
      };
      const _0x676ca0 = JSON.parse(param957);
      if (Array.isArray(_0x676ca0)) return {
        'msg': '❌\x20请输入对象类型\x20JSON，而非数组类型\x20JSON！',
        'isJSON': false
      };else return typeof _0x676ca0 === "object" && _0x676ca0 !== null ? {
        'msg': "✅ 通过，JSON 语法正确！",
        'isJSON': true,
        'parsedData': _0x676ca0
      } : {
        'msg': '❌\x20JSON\x20解析失败！',
        'isJSON': false
      };
    } catch (_0x1301b7) {
      return {
        'msg': "❌ JSON 解析失败：" + _0x1301b7,
        'isJSON': false
      };
    }
  },
  'gptReaderSidePane_addRequestArguments': function (param958, param959) {
    let var4953 = Zotero.Prefs.get("ai4paper.gptcustomRequestArgumentsAddedEnable" + Zotero.AI4Paper.gptCustom_suffix[param959]);
    if (var4953) {
      try {
        let _0x107018 = Zotero.Prefs.get("ai4paper.gptcustomRequestArgumentsAdded" + Zotero.AI4Paper.gptCustom_suffix[param959]),
          {
            msg: _0x497b83,
            isJSON = false,
            parsedData = {}
          } = Zotero.AI4Paper.checkJSON(_0x107018);
        isJSON && Object.keys(parsedData).length && Object.assign(param958, parsedData);
      } catch (_0x1cc0ee) {
        Zotero.debug(_0x1cc0ee);
      }
    }
  },
  'gptReaderSidePane_ChatMode_isStreamRunning': function (param960) {
    if (param960._gptStreamRunning && Zotero.Prefs.get("ai4paper.gptStreamRunning")) return Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 已有 GPT 正在进行【AI4paper】", "当前已有 GPT 正在进行中...如有需要，可手动中止后再发起请求。", "openai"), true;
    return false;
  },
  'gptReaderSidePane_isStreamRunning': function (param961) {
    if (Zotero.Prefs.get('ai4paper.gptStreamRunning')) return Zotero.AI4Paper.showProgressWindow(0x7d0, "❌ 已有 GPT 正在进行【AI4paper】", '当前已有\x20GPT\x20正在进行中...如有需要，可手动中止后再发起请求。', "openai"), true;
    return false;
  },
  'gptReaderSidePane_ChatMode_onSendUserMessage': function (param962, param963, param964) {
    let var4955 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_createMessageElement(param964.question, "user", null, param964);
    param963.appendChild(var4955);
    param962.document.getElementById("message-input").value = '';
    Zotero.Prefs.set("ai4paper.chatgptprompt", '');
    param963.scrollTop = param963.scrollHeight;
    param962.document.querySelector(".openaiLogoContainer").style.display = "none";
  },
  'gptReaderSidePane_ChatMode_processMessagesOnRequest': function (param965, param966, param967) {
    let var4956 = Zotero.AI4Paper.resolveMessagesHistory(),
      var4957 = {
        'role': "user",
        'content': param965.question
      };
    var4956.push(var4957);
    let var4958 = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory),
      var4959 = {
        'role': "user",
        'content': param965.question,
        'prompt': param965.prompt,
        'fulltext': param965.fulltext,
        'fileID': param965.fileID,
        'service': param966 || 'OpenAI',
        'model': param967 || ''
      };
    return Zotero.AI4Paper.saveGPTCurrentUserMessage(var4959), var4958.push(var4959), Zotero.AI4Paper.updateChatHistoryFileName(param965), {
      'messagesToSend': var4956,
      'messagesHistory': var4958
    };
  },
  'gptReaderSidePane_ChatMode_processMessagesOnRequest_gemini': function (param968, param969, param970) {
    let var4960 = Zotero.AI4Paper.convertMessages(),
      var4961 = {
        'role': "USER",
        'parts': [{
          'text': param968.question
        }]
      };
    var4960.push(var4961);
    let var4962 = JSON.parse(Zotero.AI4Paper._data_gptMessagesHistory),
      var4963 = {
        'role': "user",
        'content': param968.question,
        'prompt': param968.prompt,
        'fulltext': param968.fulltext,
        'fileID': param968.fileID,
        'service': param969 || 'OpenAI',
        'model': param970 || ''
      };
    return Zotero.AI4Paper.saveGPTCurrentUserMessage(var4963), var4962.push(var4963), Zotero.AI4Paper.updateChatHistoryFileName(param968), {
      'messagesToSend': var4960,
      'messagesHistory': var4962
    };
  },
  'gptReaderSidePane_SetGeminiThinkingBudget': function (param971, param972) {
    let var4964 = {
        'thinkingConfig': {
          'includeThoughts': true,
          'thinkingBudget': 0x200
        }
      },
      var4965 = Zotero.Prefs.get('ai4paper.geminiThinkingBudget'),
      var4966 = {
        'disable': 0x0,
        'dynamic': -0x1,
        'low': 0x200,
        'moderate': 0x1388,
        'high': 0x4e20
      };
    if (Zotero.AI4Paper.geminiThinkingModels.non_adjustable.includes(param972)) {
      var4964.thinkingConfig.thinkingBudget = var4965 != "disable" ? var4966[var4965] : var4966.low;
      param971.generationConfig = var4964;
    } else Zotero.AI4Paper.geminiThinkingModels.adjustable.includes(param972) && (var4964.thinkingConfig.thinkingBudget = var4966[var4965], param971.generationConfig = var4964);
  },
  'gptReaderSidePane_getRequestOptions': function (param973, param974, param975) {
    let var4967 = new Headers();
    var4967.append("Content-Type", 'application/json');
    if (param973 === "Claude") {
      var4967.append("x-api-key", param974);
      var4967.append("anthropic-version", "2023-06-01");
    } else param973 === "Gemini" ? var4967.append('x-goog-api-key', param974) : (var4967.append("Authorization", "Bearer " + param974), param973 === "API2D" && var4967.append('x-api2d-no-cache', 0x1));
    let var4968 = {
      'method': "POST",
      'headers': var4967,
      'body': JSON.stringify(param975),
      'redirect': "follow",
      'timeout': 0x30d40,
      'dataType': "text/event-stream"
    };
    return var4968;
  },
  'gptReaderSidePane_getHeadersObj': function (param976, param977) {
    if (param976 === 'Claude') {
      return {
        'Content-Type': 'application/json',
        'x-api-key': param977,
        'anthropic-version': "2023-06-01"
      };
    } else {
      if (param976 === "Gemini") {
        return {
          'Content-Type': "application/json",
          'x-goog-api-key': param977
        };
      } else {
        if (param976 === "API2D") {
          return {
            'Content-Type': "application/json",
            'Authorization': "Bearer " + param977,
            'x-api2d-no-cache': 0x1
          };
        } else return {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + param977
        };
      }
    }
  },
  'gptReaderSidePane_onStreamStart': function (param978) {
    Zotero.AI4Paper.isAbortRequested = false;
    Zotero.Prefs.set("ai4paper.gptStreamRunning", true);
    param978._gptStreamRunning = true;
    Zotero.AI4Paper.gptReaderSidePane_updateSendButtonState();
  },
  'catchStreamError_ChatMode': function (param979, param980, param981, param982, param983) {
    try {
      if (typeof JSON.parse(param983) === 'object') {
        let _0x17c8a0, _0x56becf;
        if (JSON.parse(param983).error || JSON.parse(param983).object === "error") {
          _0x17c8a0 = "⚠️ [请求错误]\n\n❌ " + param979 + " 出错啦：" + param983 + "\n\n🔗【" + param979 + " 错误码含义】请见：\n" + param980;
          _0x56becf = "👉 ❌ " + param979 + " 出错啦：" + param983 + "\n\n🔗【" + param979 + " 错误码含义】请见：" + param980;
        } else JSON.parse(param983)[0x0]?.["error"] && (_0x17c8a0 = '⚠️\x20[请求错误]\x0a\x0a❌\x20' + param979 + " 出错啦：\"error\": {\n\"code\": " + JSON.parse(param983)[0x0]?.["error"]["code"] + ",\n\"message\": \"" + JSON.parse(param983)[0x0]?.["error"]["message"] + "\",\n}\n\n🔗【" + param979 + '\x20错误码含义】请见：\x0a' + param980, _0x56becf = "👉 ❌ " + param979 + '\x20出错啦：\x22error\x22:\x20{\x0a\x22code\x22:\x20' + JSON.parse(param983)[0x0]?.['error']["code"] + ',\x0a\x22message\x22:\x20\x22' + JSON.parse(param983)[0x0]?.["error"]["message"] + "\",\n}\n\n🔗【" + param979 + " 错误码含义】请见：" + param980);
        if (_0x17c8a0 || _0x56becf) {
          return Zotero.AI4Paper.gptReaderSidePane_ChatMode_displayErrorMessage(_0x17c8a0), Zotero.AI4Paper.showProgressWindow(0x1388, '❌【' + param979 + "】请求错误", _0x56becf, "openai"), Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveError2MessageHistory(_0x17c8a0, param982), param981._gptStreamRunning = false, false;
        }
      }
    } catch (_0x5c937e) {
      return Zotero.debug('GPT\x20Stream\x20Error:\x20' + _0x5c937e), true;
    }
    return true;
  },
  'catchFetchError_ChatMode': function (param984, param985, param986, param987, param988) {
    let var4971 = "⚠️ [请求错误]\n\n❌ " + param984 + " 出错啦：" + param988 + "\n\n🔗【" + param984 + " 错误码含义】请见：\n" + param985,
      var4972 = "👉 ❌ " + param984 + " 出错啦：" + param988 + '\x0a\x0a🔗【' + param984 + " 错误码含义】请见：" + param985;
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_displayErrorMessage(var4971);
    Zotero.AI4Paper.showProgressWindow(0x1388, '❌【' + param984 + "】请求错误", var4972, "openai");
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveError2MessageHistory(var4971, param987);
    param986._gptStreamRunning = false;
  },
  'resolveStreamChunk_Gemini': function (param989, param990) {
    try {
      const _0x55aaea = param990.temp + param989,
        _0x29d33d = _0x55aaea.match(/{\s*"text":\s*"(.*?)"(?:,\s*"thought":\s*true)?\s*}\s*]\s*,\s*"role":\s*"[^"]*"/g);
      if (_0x29d33d.length) {
        for (let var4975 of _0x29d33d) {
          let _0x3c75b0 = JSON.parse(var4975.slice(0x0, -0x21));
          if (_0x3c75b0.text) {
            !param990.hasReasoning_content && _0x3c75b0.thought && (param990.hasReasoning_content = true, param990.reasoning_contentStart = true);
            if (param990.hasReasoning_content) {
              if (param990.reasoning_contentStart) {
                param990.target = param990.target + "<think>" + _0x3c75b0.text;
                param990.reasoning_contentStart = false;
              } else {
                if (_0x3c75b0.text && _0x3c75b0.thought) param990.target = '' + param990.target + _0x3c75b0.text;else {
                  if (!param990.reasoning_contentEnd && !_0x3c75b0.thought) {
                    param990.target = param990.target + '</think>\x0a' + _0x3c75b0.text;
                    param990.reasoning_contentEnd = true;
                  } else param990.reasoning_contentEnd && _0x3c75b0.text && !_0x3c75b0.thought ? param990.target = '' + param990.target + _0x3c75b0.text : param990.target += _0x3c75b0.text;
                }
              }
            } else param990.target += _0x3c75b0.text;
          }
        }
        param990.temp = '';
      } else param990.temp = _0x55aaea;
    } catch (_0x4e33e5) {
      Zotero.debug("resolve Gemini stream chunk error: " + _0x4e33e5);
    }
  },
  'resolveStreamChunk_Claude': function (param991, param992) {
    try {
      const _0x84d01d = param992.temp + param991,
        _0x5391a6 = _0x84d01d.match(/\{"type":"text_delta","text":"(.*?)"\}/g);
      if (_0x5391a6) {
        for (let var4979 of _0x5391a6) {
          let _0x257e40 = JSON.parse(var4979);
          _0x257e40.text && (param992.target += _0x257e40.text);
        }
        param992.temp = '';
      } else param992.temp = _0x84d01d;
    } catch (_0x6a4a8f) {
      Zotero.debug('resolve\x20Claude\x20stream\x20chunk\x20error:\x20' + _0x6a4a8f);
    }
  },
  'webpageSVG': '<svg\x20t=\x221743652474490\x22\x20class=\x22icon\x22\x20viewBox=\x220\x200\x201024\x201024\x22\x20version=\x221.1\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20p-id=\x224944\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M512\x200.085333C229.269333\x200.085333\x200.042667\x20229.226667\x200.042667\x20512.042667\x200.042667\x20794.837333\x20229.269333\x201023.978667\x20512\x201023.978667c282.794667\x200\x20511.936-229.141333\x20511.936-511.936C1023.936\x20229.226667\x20794.794667\x200.085333\x20512\x200.085333z\x20m-204.522667\x20118.421334a442.389333\x20442.389333\x200\x200\x201\x2069.781334-29.205334c-25.194667\x2036.928-46.912\x2083.904-63.893334\x20138.218667-25.408-16.234667-40.277333-35.690667-40.277333-56.789333\x200-19.178667\x2013.034667-36.864\x2034.389333-52.224zM208.170667\x20189.226667c7.914667\x2040.085333\x2039.317333\x2076.053333\x2088.256\x20102.933333-12.629333\x2056.938667-20.48\x20119.530667-22.528\x20185.749333H70.016A442.112\x20442.112\x200\x200\x201\x20208.170667\x20189.226667z\x20m0\x20645.610666a442.112\x20442.112\x200\x200\x201-138.154667-288.682666h203.818667c2.048\x2066.218667\x209.962667\x20128.810667\x2022.592\x20185.749333-48.938667\x2026.752-80.341333\x2062.869333-88.256\x20102.933333z\x20m99.306666\x2070.72c-21.354667-15.36-34.389333-33.109333-34.389333-52.224\x200-21.098667\x2014.869333-40.618667\x2040.277333-56.853333\x2016.981333\x2054.4\x2038.698667\x20101.290667\x2063.893334\x20138.282667a439.274667\x20439.274667\x200\x200\x201-69.781334-29.205334zM477.866667\x20946.773333c-42.88-22.592-79.808-87.296-104.448-176.576a453.12\x20453.12\x200\x200\x201\x20104.448-17.813333v194.389333z\x20m0-262.186666a485.632\x20485.632\x200\x200\x200-119.125334\x2021.653333\x201033.813333\x201033.813333\x200\x200\x201-16.725333-160.085333H477.866667v138.432z\x20m0-206.677334h-135.850667c1.408-53.717333\x206.997333-107.242667\x2016.725333-160.064\x2038.656\x2012.117333\x2078.677333\x2019.392\x20119.125334\x2021.696v138.368z\x20m0-206.229333a460.266667\x20460.266667\x200\x200\x201-104.448-17.813333c24.64-89.28\x2061.568-153.92\x20104.448-176.576v194.389333zM815.808\x20189.226667a441.6\x20441.6\x200\x200\x201\x20138.090667\x20288.682666H750.08c-2.048-66.218667-9.962667-128.810667-22.592-185.749333\x2049.002667-26.816\x2080.405333-62.848\x2088.32-102.933333z\x20m-99.306667-70.72c21.354667\x2015.36\x2034.410667\x2033.045333\x2034.410667\x2052.224\x200\x2021.098667-14.890667\x2040.554667-40.277333\x2056.789333-17.002667-54.314667-38.72-101.290667-63.957334-138.218667\x2024.064\x207.701333\x2047.424\x2017.472\x2069.824\x2029.205334zM546.133333\x2077.290667c42.922667\x2022.656\x2079.850667\x2087.296\x20104.426667\x20176.576a460.074667\x20460.074667\x200\x200\x201-104.426667\x2017.813333V77.290667z\x20m0\x20262.250666a490.666667\x20490.666667\x200\x200\x200\x20119.104-21.632c9.216\x2048.938667\x2015.082667\x20102.869333\x2016.725334\x20160H546.133333v-138.368z\x20m0\x20206.613334h135.829334a1032.96\x201032.96\x200\x200\x201-16.725334\x20160.149333\x20484.288\x20484.288\x200\x200\x200-119.104-21.653333v-138.496z\x20m0\x20400.618666v-194.389333a453.12\x20453.12\x200\x200\x201\x20104.426667\x2017.813333c-24.576\x2089.28-61.504\x20153.984-104.426667\x20176.576z\x20m170.368-41.216a443.584\x20443.584\x200\x200\x201-69.76\x2029.269334c25.173333-36.992\x2046.954667-83.882667\x2063.957334-138.282667\x2025.386667\x2016.234667\x2040.277333\x2035.754667\x2040.277333\x2056.853333-0.064\x2019.050667-13.12\x2036.8-34.474667\x2052.16z\x20m99.306667-70.72c-7.914667-40.064-39.381333-76.117333-88.32-102.933333a998.741333\x20998.741333\x200\x200\x200\x2022.592-185.749333h203.818667a441.6\x20441.6\x200\x200\x201-138.090667\x20288.682666z\x22\x20fill=\x22#0481ff\x22\x20p-id=\x224945\x22></path></svg>',
  'resolveStreamChunk_OpenAISeries': function (param993, param994) {
    param994.temp += param993;
    const var4981 = param994.temp.split('\x0a\x0a');
    param994.temp = var4981.pop() || '';
    for (const var4982 of var4981) {
      const _0x1aab44 = var4982.trim();
      if (!_0x1aab44) continue;
      if (!_0x1aab44.startsWith("data:")) continue;
      const _0x23c154 = _0x1aab44.slice(0x5).trim();
      if (_0x23c154 === "[DONE]") {
        break;
      }
      try {
        let var4985 = JSON.parse(_0x23c154),
          var4986 = var4985.choices[0x0]?.['delta'];
        if (!var4986) continue;
        let var4987 = var4986?.["content"],
          var4988 = var4986?.["reasoning_content"];
        if (var4987 || var4988) {
          if (!var4987 && var4988) {
            !param994.hasReasoning_content && (param994.hasReasoning_content = true, param994.reasoning_contentStart = true);
            param994.reasoning_contentStart ? (param994.target = param994.target + "<think>" + var4988, param994.reasoning_contentStart = false) : param994.target = '' + param994.target + var4988;
          } else {
            if (var4987 && !var4988) {
              param994.hasReasoning_content && (param994.hasReasoning_content = false, param994.reasoning_contentEnd = true);
              param994.reasoning_contentEnd ? (param994.target = param994.target + '</think>\x0a' + var4987, param994.reasoning_contentEnd = false) : param994.target = '' + param994.target + var4987;
            }
          }
          var4985.references && Zotero.AI4Paper.gptReaderSidePane_getHTML4Refs(var4985.references, param994);
          var4985.search_results && Zotero.AI4Paper.gptReaderSidePane_getHTML4Refs(var4985.search_results, param994);
        }
      } catch (_0x397d94) {
        Zotero.debug('Zotero\x20One\x20-\x20SSE\x20解析异常,\x20dataStr:\x20' + _0x23c154 + " err: " + _0x397d94.message);
      }
    }
  },
  'resolveStreamChunk': function (param995, param996, param997) {
    if (param997 === "Claude") Zotero.AI4Paper.resolveStreamChunk_Claude(param995, param996);else param997 === "Gemini" ? Zotero.AI4Paper.resolveStreamChunk_Gemini(param995, param996) : Zotero.AI4Paper.resolveStreamChunk_OpenAISeries(param995, param996);
  },
  'startFetch_ChatMode': async function (param998, param999, param1000, param1001, param1002, param1003, param1004, param1005) {
    const var4989 = param998.document.getElementById("chat-container");
    Zotero.AI4Paper.gptReaderSidePane_ChatMode_onSendUserMessage(param998, var4989, param1003);
    if (Zotero.Prefs.get('ai4paper.gptStreamResponse')) {
      Zotero.AI4Paper.gptReaderSidePane_onStreamStart(param998);
      let var4990 = {
        'temp': '',
        'target': '',
        'html4Refs': '',
        'hasReasoning_content': false,
        'reasoning_contentStart': false,
        'reasoning_contentEnd': false
      };
      var var4991 = Zotero.AI4Paper.gptReaderSidePane_getRequestOptions(param1004, param1000, param1001);
      fetch(param999, var4991).then(_0x19d794 => {
        return !_0x19d794.ok && (Zotero.debug("GPT Stream Response Error: " + _0x19d794), Zotero.AI4Paper.showProgressWindow(0x9c4, "GPT 请求失败【Zoteor One】", "Fetch request to " + param999 + " failed: HTTP status " + _0x19d794.status + " - " + _0x19d794.statusText)), _0x19d794.body;
      }).then(_0x2643fa => {
        let var4992 = _0x2643fa.getReader();
        fn22();
        function fn22() {
          return var4992.read().then(({
            done: _0x1e18bb,
            value: _0x1025f0
          }) => {
            if (_0x1e18bb || Zotero.AI4Paper.isAbortRequested) {
              Zotero.AI4Paper.gptReaderSidePane_ChatMode_onStreamDone(param998, param1002, '' + var4990.target + var4990.html4Refs, param1003);
              var4992.releaseLock();
              return;
            }
            let var4993 = new TextDecoder("utf-8").decode(_0x1025f0, {
              'stream': true
            });
            if (!Zotero.AI4Paper.catchStreamError_ChatMode(param1004, param1005, param998, param1002, var4993)) return;
            Zotero.AI4Paper.resolveStreamChunk(var4993, var4990, param1004);
            Zotero.AI4Paper.gptReaderSidePane_ChatMode_displayMessageChunk(param998, var4990.target, var4989);
            fn22();
          });
        }
      })["catch"](_0x3a563c => {
        Zotero.AI4Paper.catchFetchError_ChatMode(param1004, param1005, param998, param1002, _0x3a563c);
      });
    } else {
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request('POST', param999, {
          'headers': Zotero.AI4Paper.gptReaderSidePane_getHeadersObj(param1004, param1000),
          'body': JSON.stringify(param1001),
          'responseType': "json"
        });
      }, _0x59d768 => {
        if (Zotero.AI4Paper.runAuthor()) {
          let _0x4e2eb8;
          if (param1004 === "Claude") _0x4e2eb8 = _0x59d768.response.content[0x0].text;else param1004 === 'Gemini' ? _0x4e2eb8 = _0x59d768.response.candidates[0x0].content.parts[0x0].text : _0x4e2eb8 = _0x59d768.response.choices[0x0].message.content;
          Zotero.AI4Paper.gptReaderSidePane_ChatMode_onRequestDone(param998, param1002, _0x4e2eb8, param1003);
        }
      }, param1004, param1002);
    }
  },
  'gptReaderSidePane_ChatMode_send': function () {
    let var4995 = Zotero.Prefs.get("ai4paper.gptservice");
    if (var4995.includes("GPT 自定")) for (let var4996 of Object.keys(Zotero.AI4Paper.gptCustom_numEmoji)) {
      var4995 === 'GPT\x20自定\x20' + Zotero.AI4Paper.gptCustom_numEmoji[var4996] && Zotero.AI4Paper[Zotero.AI4Paper.gptServiceList()[var4995].method.chat](var4996);
    } else Zotero.AI4Paper[Zotero.AI4Paper.gptServiceList()[var4995].method.chat]();
  },
  'gptReaderSidePane_ChatMode_sendByOpenAI': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4997 = 'OpenAI';
    var var4998 = Zotero.AI4Paper.gptServiceList()[var4997].api_key,
      var4999 = Zotero.AI4Paper.gptServiceList()[var4997].base_url + '/v1/chat/completions';
    let var5000 = Zotero.AI4Paper.gptServiceList()[var4997].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4998, var4997, true, "chat")) return false;
    let var5001 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5001) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5001)) return false;
    let var5002 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5001),
      var5003 = var5002.question;
    if (!var5003) return;
    var var5004 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4997].modelLabel);
    let {
        messagesToSend: _0x46a3c3,
        messagesHistory: _0x5d42b5
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5002, var4997, var5004),
      var5005 = parseInt(Zotero.Prefs.get('ai4paper.gptmaxtokens'));
    var var5006 = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? var5006 = {
      'model': var5004,
      'max_tokens': var5005,
      'messages': _0x46a3c3,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var5006 = {
      'model': var5004,
      'messages': _0x46a3c3,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(var5001, var4999, var4998, var5006, _0x5d42b5, var5002, var4997, var5000);
  },
  'gptReaderSidePane_ChatMode_sendByAPI2D': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5007 = "API2D";
    var var5008 = Zotero.AI4Paper.gptServiceList()[var5007].api_key,
      var5009 = Zotero.AI4Paper.gptServiceList()[var5007].base_url + '/v1/chat/completions';
    let var5010 = Zotero.AI4Paper.gptServiceList()[var5007].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5008, var5007, true, 'chat')) return false;
    let var5011 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var5011) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5011)) return false;
    let var5012 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5011),
      var5013 = var5012.question;
    if (!var5013) return;
    var var5014 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5007].modelLabel);
    let {
        messagesToSend: _0x288c9b,
        messagesHistory: _0x463e01
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5012, var5007, var5014),
      var5015 = parseInt(Zotero.Prefs.get('ai4paper.api2dmaxtokens'));
    var var5016 = {};
    if (Zotero.Prefs.get("ai4paper.api2dmaxtokensenable")) {
      var5016 = {
        'model': var5014,
        'max_tokens': var5015,
        'messages': _0x288c9b,
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    } else var5016 = {
      'model': var5014,
      'messages': _0x288c9b,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(var5011, var5009, var5008, var5016, _0x463e01, var5012, var5007, var5010);
  },
  'gptReaderSidePane_ChatMode_sendByChatAnywhere': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5017 = "ChatAnywhere";
    var var5018 = Zotero.AI4Paper.gptServiceList()[var5017].api_key,
      var5019 = Zotero.AI4Paper.gptServiceList()[var5017].base_url + "/v1/chat/completions";
    let var5020 = Zotero.AI4Paper.gptServiceList()[var5017].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5018, var5017, true, "chat")) return false;
    let var5021 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var5021) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5021)) return false;
    let var5022 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5021),
      var5023 = var5022.question;
    if (!var5023) {
      return;
    }
    var var5024 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5017].modelLabel);
    let {
        messagesToSend: _0x17fb6b,
        messagesHistory: _0x4d3157
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5022, var5017, var5024),
      var5025 = parseInt(Zotero.Prefs.get("ai4paper.chatanywheremaxtokens"));
    var var5026 = {};
    Zotero.Prefs.get("ai4paper.chatanywheremaxtokensenable") ? var5026 = {
      'model': var5024,
      'max_tokens': var5025,
      'messages': _0x17fb6b,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var5026 = {
      'model': var5024,
      'messages': _0x17fb6b,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(var5021, var5019, var5018, var5026, _0x4d3157, var5022, var5017, var5020);
  },
  'gptReaderSidePane_ChatMode_sendByQwen': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5027 = "通义千问";
    var var5028 = Zotero.AI4Paper.gptServiceList()[var5027].api_key,
      var5029 = Zotero.AI4Paper.gptServiceList()[var5027].base_url + "/v1/chat/completions";
    let var5030 = Zotero.AI4Paper.gptServiceList()[var5027].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5028, var5027, true, "chat")) return false;
    let var5031 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5031) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5031)) return false;
    let var5032 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5031),
      var5033 = var5032.question;
    if (!var5033) {
      return;
    }
    var var5034 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5027].modelLabel);
    let {
      messagesToSend: _0x327b6d,
      messagesHistory: _0x2133e4
    } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5032, var5027, var5034);
    var var5035 = {
      'model': var5034,
      'messages': _0x327b6d,
      'enable_thinking': Zotero.AI4Paper.gptServiceList()[var5027].thinking_enable,
      'enable_search': Zotero.AI4Paper.gptServiceList()[var5027].websearch_enable && !Zotero.AI4Paper.qwenModelsNotForOnlineSearch.includes(var5034) && true,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(var5031, var5029, var5028, var5035, _0x2133e4, var5032, var5027, var5030);
  },
  'gptReaderSidePane_ChatMode_sendByWenxin': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5036 = "文心一言";
    var var5037 = Zotero.AI4Paper.gptServiceList()[var5036].api_key,
      var5038 = '' + Zotero.AI4Paper.gptServiceList()[var5036].request_url;
    let var5039 = Zotero.AI4Paper.gptServiceList()[var5036].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5037, var5036, true, 'chat')) return false;
    let var5040 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var5040) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5040)) return false;
    let var5041 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5040),
      var5042 = var5041.question;
    if (!var5042) return;
    var var5043 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5036].modelLabel);
    let {
        messagesToSend: _0x25f299,
        messagesHistory: _0x49b004
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5041, var5036, var5043),
      var5044 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens")),
      var5045 = Zotero.Prefs.get("ai4paper.wenxinEnableSearch"),
      var5046 = {
        'enable': var5045,
        'enable_citation': var5045,
        'enable_trace': var5045
      };
    var var5047 = {
      'model': var5043,
      'messages': _0x25f299,
      'web_search': var5046,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable') && (var5047.max_completion_tokens = var5044);
    Zotero.AI4Paper.startFetch_ChatMode(var5040, var5038, var5037, var5047, _0x49b004, var5041, var5036, var5039);
  },
  'gptReaderSidePane_ChatMode_sendByGLM': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5048 = '智普清言';
    var var5049 = Zotero.AI4Paper.gptServiceList()[var5048].api_key,
      var5050 = '' + Zotero.AI4Paper.gptServiceList()[var5048].request_url;
    let var5051 = Zotero.AI4Paper.gptServiceList()[var5048].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5049, var5048, true, "chat")) return false;
    let var5052 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5052) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5052)) return false;
    let var5053 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5052),
      var5054 = var5053.question;
    if (!var5054) return;
    var var5055 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5048].modelLabel);
    let {
        messagesToSend: _0x389afd,
        messagesHistory: _0x4848b4
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5053, var5048, var5055),
      var5056 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var5057 = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? var5057 = {
      'model': var5055,
      'max_tokens': var5056,
      'messages': _0x389afd,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var5057 = {
      'model': var5055,
      'messages': _0x389afd,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(var5052, var5050, var5049, var5057, _0x4848b4, var5053, var5048, var5051);
  },
  'gptReaderSidePane_ChatMode_sendByYi': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5058 = "零一万物";
    var var5059 = Zotero.AI4Paper.gptServiceList()[var5058].api_key,
      var5060 = Zotero.AI4Paper.gptServiceList()[var5058].base_url + "/v1/chat/completions";
    let var5061 = Zotero.AI4Paper.gptServiceList()[var5058].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5059, var5058, true, "chat")) return false;
    let var5062 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5062) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5062)) return false;
    let var5063 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5062),
      var5064 = var5063.question;
    if (!var5064) return;
    var var5065 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5058].modelLabel);
    let {
        messagesToSend: _0x1c42d2,
        messagesHistory: _0x329ab1
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5063, var5058, var5065),
      var5066 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var5067 = {};
    if (Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable')) var5067 = {
      'model': var5065,
      'max_tokens': var5066,
      'messages': _0x1c42d2,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };else {
      var5067 = {
        'model': var5065,
        'messages': _0x1c42d2,
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    }
    Zotero.AI4Paper.startFetch_ChatMode(var5062, var5060, var5059, var5067, _0x329ab1, var5063, var5058, var5061);
  },
  'gptReaderSidePane_ChatMode_sendByZJUChat': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5068 = "浙大先生";
    var var5069 = Zotero.AI4Paper.gptServiceList()[var5068].api_key,
      var5070 = Zotero.AI4Paper.gptServiceList()[var5068].base_url + "/v1/chat/completions";
    let var5071 = Zotero.AI4Paper.gptServiceList()[var5068].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5069, var5068, true, "chat")) return false;
    let var5072 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5072) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5072)) return false;
    let var5073 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5072),
      var5074 = var5073.question;
    if (!var5074) {
      return;
    }
    var var5075 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5068].modelLabel);
    let {
        messagesToSend: _0x405325,
        messagesHistory: _0x1e0568
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5073, var5068, var5075),
      var5076 = parseInt(Zotero.Prefs.get('ai4paper.gptmaxtokens'));
    var var5077 = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? var5077 = {
      'model': var5075,
      'max_tokens': var5076,
      'messages': _0x405325,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var5077 = {
      'model': var5075,
      'messages': _0x405325,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(var5072, var5070, var5069, var5077, _0x1e0568, var5073, var5068, var5071);
  },
  'gptReaderSidePane_getHTML4Refs': function (param1006, param1007) {
    let var5078 = Zotero.AI4Paper.webpageSVG,
      var5079 = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳', '㉑', '㉒', '㉓', '㉔', '㉕'];
    param1006.forEach((_0x55032f, _0x3740ed) => {
      _0x3740ed = var5079[_0x3740ed] || '🎈';
      let _0x4227b7 = _0x55032f?.["site_name"] || "联网搜索",
        _0xeb77b2 = _0x4227b7 + "&nbsp;" + _0x3740ed,
        _0x5ed851 = '';
      _0x55032f?.["cover_image"]?.["url"] && (_0x5ed851 = "<img src=\"" + _0x55032f?.['cover_image']?.["url"] + "\" style=\"float: right; width: 100px; height: 70px; margin-left: 15px;\">");
      let _0x86b18b = "\n\n        <div class=\"ZoteroOne-VolcanoSearch-Refs\" style=\"margin-top:15px; background-color: #f9fafe; border: 1px solid #ccc; border-radius: 8px; padding: 15px; width: 330px;\">\n                    <a href=\"" + _0x55032f?.["url"] + "\" style=\"text-decoration: none; color: #000; display: block;\">\n                        <div style=\"min-height: 60px;\">\n                            " + _0x5ed851 + "\n                            <p style=\"margin:0;\">" + _0x55032f?.["title"] + "</p>\n                        </div>\n                    </a>\n                    <div style=\"display: grid; grid-template-columns: auto auto; align-items: center; justify-content: start; color: #666; margin-top: 10px;\">" + var5078 + "<span style=\"margin-left: 3px;\"> " + _0xeb77b2 + "</span></div>\n                </div>";
      param1007.html4Refs += _0x86b18b;
    });
  },
  'gptReaderSidePane_ChatMode_sendByVolcanoSearch': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5084 = "火山联网搜索";
    var var5085 = Zotero.AI4Paper.gptServiceList()[var5084].api_key,
      var5086 = '' + Zotero.AI4Paper.gptServiceList()[var5084].request_url;
    let var5087 = Zotero.AI4Paper.gptServiceList()[var5084].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5085, var5084, true, 'chat')) return false;
    let var5088 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var5088) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5088)) return false;
    let var5089 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5088),
      var5090 = var5089.question;
    if (!var5090) {
      return;
    }
    var var5091 = Zotero.AI4Paper.gptServiceList()[var5084].model;
    let {
        messagesToSend: _0x6f4d,
        messagesHistory: _0x2f958d
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5089, var5084, var5091),
      var5092 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var5093 = {};
    Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable') ? var5093 = {
      'model': var5091,
      'max_tokens': var5092,
      'messages': _0x6f4d,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var5093 = {
      'model': var5091,
      'messages': _0x6f4d,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(var5088, var5086, var5085, var5093, _0x2f958d, var5089, var5084, var5087);
  },
  'gptReaderSidePane_ChatMode_sendByVolcanoEngine': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5094 = "火山引擎";
    var var5095 = Zotero.AI4Paper.gptServiceList()[var5094].api_key,
      var5096 = '' + Zotero.AI4Paper.gptServiceList()[var5094].request_url;
    let var5097 = Zotero.AI4Paper.gptServiceList()[var5094].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5095, var5094, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[var5094].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var5094].custom_model === '') return window.alert("您启用了自定义模型，但是尚未配置 " + var5094 + '\x20模型！请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20GPT\x20API】配置。'), -0x1;
    let var5098 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5098) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5098)) return false;
    let var5099 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5098),
      var5100 = var5099.question;
    if (!var5100) return;
    var var5101 = Zotero.AI4Paper.gptServiceList()[var5094].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var5094].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var5094].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5094].modelLabel);
    let {
        messagesToSend: _0x1f2a14,
        messagesHistory: _0x207b90
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5099, var5094, var5101),
      var5102 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var5103 = {};
    if (Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable")) {
      var5103 = {
        'model': var5101,
        'max_tokens': var5102,
        'messages': _0x1f2a14,
        'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
      };
    } else {
      var5103 = {
        'model': var5101,
        'messages': _0x1f2a14,
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    }
    Zotero.AI4Paper.startFetch_ChatMode(var5098, var5096, var5095, var5103, _0x207b90, var5099, var5094, var5097);
  },
  'gptReaderSidePane_ChatMode_sendByDoubao': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5104 = '豆包';
    var var5105 = Zotero.AI4Paper.gptServiceList()[var5104].api_key,
      var5106 = '' + Zotero.AI4Paper.gptServiceList()[var5104].request_url;
    let var5107 = Zotero.AI4Paper.gptServiceList()[var5104].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5105, var5104, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[var5104].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var5104].custom_model === '') return window.alert("您启用了自定义模型，但是尚未配置 " + var5104 + " 模型！请先前往【Zotero 设置 --> AI4paper --> GPT API】配置。"), -0x1;
    let var5108 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5108) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5108)) return false;
    let var5109 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5108),
      var5110 = var5109.question;
    if (!var5110) return;
    var var5111 = Zotero.AI4Paper.gptServiceList()[var5104].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var5104].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var5104].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5104].modelLabel);
    let {
        messagesToSend: _0x535d37,
        messagesHistory: _0x3fc3b4
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5109, var5104, var5111),
      var5112 = parseInt(Zotero.Prefs.get('ai4paper.gptmaxtokens'));
    var var5113 = {};
    if (Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable")) {
      var5113 = {
        'model': var5111,
        'max_tokens': var5112,
        'messages': _0x535d37,
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    } else var5113 = {
      'model': var5111,
      'messages': _0x535d37,
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.startFetch_ChatMode(var5108, var5106, var5105, var5113, _0x3fc3b4, var5109, var5104, var5107);
  },
  'gptReaderSidePane_ChatMode_sendByKimi': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5114 = "Kimi";
    var var5115 = Zotero.AI4Paper.gptServiceList()[var5114].api_key,
      var5116 = Zotero.AI4Paper.gptServiceList()[var5114].base_url + "/v1/chat/completions";
    let var5117 = Zotero.AI4Paper.gptServiceList()[var5114].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5115, var5114, true, "chat")) return false;
    let var5118 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5118) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5118)) return false;
    let var5119 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5118),
      var5120 = var5119.question;
    if (!var5120) {
      return;
    }
    var var5121 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5114].modelLabel);
    let {
        messagesToSend: _0x15c661,
        messagesHistory: _0x6bfaba
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5119, var5114, var5121),
      var5122 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var5123 = {};
    if (Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable")) {
      var5123 = {
        'model': var5121,
        'max_tokens': var5122,
        'messages': _0x15c661,
        'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
      };
    } else var5123 = {
      'model': var5121,
      'messages': _0x15c661,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(var5118, var5116, var5115, var5123, _0x6bfaba, var5119, var5114, var5117);
  },
  'gptReaderSidePane_ChatMode_sendByDeepSeek': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5124 = "DeepSeek";
    var var5125 = Zotero.AI4Paper.gptServiceList()[var5124].api_key,
      var5126 = Zotero.AI4Paper.gptServiceList()[var5124].base_url + '/v1/chat/completions';
    let var5127 = Zotero.AI4Paper.gptServiceList()[var5124].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5125, var5124, true, 'chat')) return false;
    let var5128 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var5128) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5128)) return false;
    let var5129 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5128),
      var5130 = var5129.question;
    if (!var5130) return;
    var var5131 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5124].modelLabel);
    let {
        messagesToSend: _0x2329fa,
        messagesHistory: _0xed0f0c
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5129, var5124, var5131),
      var5132 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var5133 = {};
    if (Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable")) var5133 = {
      'model': var5131,
      'max_tokens': var5132,
      'messages': _0x2329fa,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };else {
      var5133 = {
        'model': var5131,
        'messages': _0x2329fa,
        'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
      };
    }
    Zotero.AI4Paper.startFetch_ChatMode(var5128, var5126, var5125, var5133, _0xed0f0c, var5129, var5124, var5127);
  },
  'gptReaderSidePane_ChatMode_sendByGPTCustom': async function (param1008) {
    let var5134 = Zotero.AI4Paper.gptCustom_numEmoji;
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5135 = "GPT 自定 " + var5134[param1008];
    var var5136 = Zotero.AI4Paper.gptServiceList()[var5135].api_key,
      var5137 = Zotero.AI4Paper.getURL4GPTCustom(var5135);
    let var5138 = Zotero.AI4Paper.gptServiceList()[var5135].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5136, var5135, true, 'chat')) return false;
    let var5139 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5139) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5139)) return false;
    let var5140 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5139),
      var5141 = var5140.question;
    if (!var5141) return;
    var var5142 = Zotero.AI4Paper.gptServiceList()[var5135].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var5135].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var5135].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5135].modelLabel);
    let {
        messagesToSend: _0x5233bb,
        messagesHistory: _0x3138b3
      } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5140, var5135, var5142),
      var5143 = parseInt(Zotero.Prefs.get("ai4paper.gptcustommaxtokens"));
    var var5144 = {};
    Zotero.Prefs.get('ai4paper.gptcustommaxtokensenable') ? var5144 = {
      'model': var5142,
      'max_tokens': var5143,
      'messages': _0x5233bb,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var5144 = {
      'model': var5142,
      'messages': _0x5233bb,
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.gptReaderSidePane_addRequestArguments(var5144, param1008);
    Zotero.AI4Paper.startFetch_ChatMode(var5139, var5137, var5136, var5144, _0x3138b3, var5140, var5135, var5138);
  },
  'gptReaderSidePane_ChatMode_sendByGemini': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5145 = "Gemini";
    var var5146 = Zotero.AI4Paper.gptServiceList()[var5145].api_key;
    let var5147 = Zotero.AI4Paper.gptServiceList()[var5145].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5146, var5145, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[var5145].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var5145].custom_model === '') {
      return window.alert("您启用了自定义模型，但是尚未配置 " + var5145 + " 模型！请先前往【Zotero 设置 --> AI4paper --> GPT API】配置。"), -0x1;
    }
    let var5148 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5148) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5148)) return false;
    let var5149 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5148),
      var5150 = var5149.question;
    if (!var5150) return;
    var var5151 = Zotero.AI4Paper.gptServiceList()[var5145].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var5145].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var5145].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5145].modelLabel);
    let {
      messagesToSend: _0xca81cd,
      messagesHistory: _0x4cd1aa
    } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest_gemini(var5149, var5145, var5151);
    var var5152 = Zotero.AI4Paper.gptServiceList()[var5145].base_url + "/v1beta/models/" + var5151 + ':' + (Zotero.Prefs.get("ai4paper.gptStreamResponse") ? "streamGenerateContent" : "generateContent"),
      var5153 = {
        'contents': _0xca81cd,
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
    Zotero.AI4Paper.gptReaderSidePane_SetGeminiThinkingBudget(var5153, var5151);
    Zotero.AI4Paper.startFetch_ChatMode(var5148, var5152, var5146, var5153, _0x4cd1aa, var5149, var5145, var5147);
  },
  'gptReaderSidePane_ChatMode_sendByClaude': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5154 = "Claude";
    var var5155 = Zotero.AI4Paper.gptServiceList()[var5154].api_key,
      var5156 = '' + Zotero.AI4Paper.gptServiceList()[var5154].request_url;
    let var5157 = Zotero.AI4Paper.gptServiceList()[var5154].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var5155, var5154, true, "chat")) return false;
    let var5158 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5158) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_ChatMode_isStreamRunning(var5158)) return false;
    let var5159 = Zotero.AI4Paper.gptReaderSidePane_ChatMode_getQuestion(var5158),
      var5160 = var5159.question;
    if (!var5160) {
      return;
    }
    var var5161 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var5154].modelLabel);
    let {
      messagesToSend: _0x49f650,
      messagesHistory: _0x4d8a3a
    } = Zotero.AI4Paper.gptReaderSidePane_ChatMode_processMessagesOnRequest(var5159, var5154, var5161);
    var var5162 = {
      'model': var5161,
      'max_tokens': Zotero.AI4Paper.getClaudeMaxTokens(var5161),
      'messages': _0x49f650,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_ChatMode(var5158, var5156, var5155, var5162, _0x4d8a3a, var5159, var5154, var5157);
  },
});
