// AI4Paper GPT Completion Module - Completion mode send methods, stream handling, and request building
Object.assign(Zotero.AI4Paper, {
  'gptReaderSidePane_getQuestion': function (param783) {
    let var4338 = '',
      var4339 = param783.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-prompt').value;
    Zotero.Prefs.set('ai4paper.chatgptprompt', var4339);
    let var4340 = window.document.querySelector('#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist').value;
    Zotero.Prefs.set('ai4paper.chatgptprompttemplate', var4340);
    let var4341 = JSON.parse(Zotero.Prefs.get("ai4paper.prompttemplateuserobject")),
      var4342 = false;
    for (let var4343 of var4341) {
      var4343.alias === var4340.trim() && !var4342 && (var4340 = var4343.realTemplate, Zotero.Prefs.set("ai4paper.chatgptprompttemplate", var4343.alias), var4342 = true);
    }
    var4340 = var4340.replace(/🌝/g, '\x0a');
    if (var4340 === '无' || var4340 === '') {
      var4338 = var4339.trim();
    } else {
      if (var4340 === "AI 解读论文 🔒" || var4340 === "论文深度解读 🔒" || var4340 === "论文简要剖析 🔒") {
        if (var4340 === "AI 解读论文 🔒") var4340 = Zotero.Prefs.get("ai4paper.prompt4PaperAI");else {
          if (var4340 === '论文深度解读\x20🔒') var4340 = Zotero.Prefs.get("ai4paper.prompt4PaperDeepInterpretation");else var4340 === "论文简要剖析 🔒" && (var4340 = Zotero.Prefs.get('ai4paper.prompt4PaperBriefAnalysis'));
        }
        var4340 = var4340.replace(/🌝/g, '\x0a');
        var4338 = var4340 + ":\n\n" + var4339;
      } else var4339 != '' ? var4338 = var4340 + ":\n\n" + var4339 : var4338 = var4340;
    }
    return var4338;
  },
  'gptReaderSidePane_updateElemsState': function (param784, param785, param786, param787) {
    if (!param785) {
      param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = '';
      Zotero.Prefs.set("ai4paper.chatgptresponse", '');
      param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = '正在响应...';
      Zotero.Prefs.set("ai4paper.chatgptresponsetime", "正在响应...");
      param784.document.getElementById("chatgpt-readerSidePane-chatgpt-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.openai_purple;
      param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").placeholder = '请稍等...';
      param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-space").style.display = "none";
      param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").style.display = "none";
      param784.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-token-used').textContent = '';
    } else {
      if (param785 && param785.response) {
        param784.document.getElementById("chatgpt-readerSidePane-chatgpt-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
        param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").placeholder = "这里显示结果";
        let var4344 = new Date(),
          var4345 = var4344.toLocaleDateString() + '\x20' + var4344.toLocaleTimeString('chinese', {
            'hour12': false
          });
        param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = var4345;
        Zotero.Prefs.set("ai4paper.chatgptresponsetime", var4345);
        let var4346, var4347;
        if (param787 === 'Gemini') {
          var4346 = param785.response.candidates[0x0].content.parts[0x0].text;
        } else {
          if (param787 === "Claude") {
            var4346 = param785.response.content[0x0].text;
            var4347 = param785.response.usage.input_tokens + param785.response.usage.output_tokens;
          } else {
            var4346 = param785.response.choices[0x0].message.content;
            var4347 = param785.response.usage.total_tokens;
            if (param785.response.choices[0x0].message.reasoning_content) {
              let _0x457911 = param785.response.choices[0x0].message.content,
                _0x357bf5 = param785.response.choices[0x0].message.reasoning_content;
              _0x357bf5.indexOf('\x0a') != 0x0 ? _0x357bf5 = '<think>\x0a' + _0x357bf5 : _0x357bf5 = "<think>" + _0x357bf5;
              _0x457911.indexOf('\x0a') != 0x0 ? _0x457911 = '\x0a</think>\x0a\x0a' + _0x457911 : _0x457911 = "\n</think>\n" + _0x457911;
              var4346 = '' + _0x357bf5 + _0x457911;
            }
          }
        }
        param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = var4346;
        Zotero.Prefs.set("ai4paper.chatgptresponse", var4346);
        var4347 ? (param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-space").style.display = "inline", param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").style.display = 'inline', param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").textContent = 'Tokens:\x20' + var4347) : (param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-space").style.display = "none", param784.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").style.display = 'none');
        Zotero.AI4Paper.gptReaderSidePane_updateChat();
        Zotero.Prefs.get("ai4paper.translationviewerenable") && Zotero.AI4Paper.updateTransViewer('🙋<p>' + param786, "🤖️<p>" + var4346);
      }
    }
  },
  'gptReaderSidePane_onStreamDone': function (param788, param789, param790) {
    Zotero.Prefs.set("ai4paper.gptStreamRunning", false);
    Zotero.AI4Paper.isAbortRequested = false;
    window.document.querySelector('#chatgpt-readerSidePane-send-icon') && (window.document.querySelector("#chatgpt-readerSidePane-send-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.send, window.document.querySelector("#chatgpt-readerSidePane-send-icon").title = '发送', window.document.querySelector("#chatgpt-readerSidePane-send-icon").onclick = () => Zotero.AI4Paper.gptReaderSidePane_send());
    let var4350 = new Date(),
      var4351 = var4350.toLocaleDateString(),
      var4352 = var4350.toLocaleTimeString("chinese", {
        'hour12': false
      }),
      var4353 = var4351 + '\x20' + var4352;
    param788.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-response-time').textContent = var4353;
    Zotero.Prefs.set("ai4paper.chatgptresponsetime", var4353);
    param788.document.getElementById("chatgpt-readerSidePane-chatgpt-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
    param788.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").placeholder = "这里显示结果";
    Zotero.Prefs.set("ai4paper.chatgptresponse", param789);
    Zotero.AI4Paper.gptReaderSidePane_updateChat();
    Zotero.Prefs.get("ai4paper.gptChatHistoryViewerEnable") && Zotero.AI4Paper.updateTransViewer("🙋<p>" + param790, "🤖️<p>" + param789);
  },
  'getURL4GPTCustom': function (param791) {
    let var4354 = Zotero.AI4Paper.gptServiceList()[param791].base_url;
    if (var4354.endsWith('#')) return var4354.substring(0x0, var4354.length - 0x1);else {
      return Zotero.AI4Paper.gptServiceList()[param791].base_url + "/v1/chat/completions";
    }
  },
  'getGPTModel': function (param792, param793) {
    let var4355 = param793 ? Zotero.Prefs.get("ai4paper.translationOpenAIModel") : Zotero.Prefs.get("ai4paper.gptmodel");
    if (param792 === "gpt" && var4355.indexOf(param792) === -0x1 && var4355.indexOf("o1-") === -0x1 && var4355.indexOf('o3-') === -0x1) return "gpt-4o-mini";
    if (param792 === "qwen" && var4355.indexOf(param792) === -0x1 && var4355.indexOf("qwq-") === -0x1) return 'qwen-plus';
    if (param792 === "ernie" && var4355.indexOf(param792) === -0x1) {
      return "ernie-4.0-turbo-128k";
    }
    if (param792 === "glm" && var4355.indexOf(param792) === -0x1) {
      return 'glm-4.7-flash';
    }
    if (param792 === 'yi-' && var4355.indexOf(param792) === -0x1) return "yi-lightning";
    if (param792 === "zjuchat" && var4355.indexOf(param792) === -0x1) {
      return 'deepseek-v3';
    }
    if (param792 === "volcanoEngine" && var4355.indexOf('doubao') === -0x1) return "deepseek-r1-250528";
    if (param792 === "doubao" && var4355.indexOf("doubao") === -0x1) return "doubao-seed-1-6-251015";
    if (param792 === "moonshot" && var4355.indexOf(param792) === -0x1 && var4355.indexOf("kimi") === -0x1) return 'moonshot-v1-auto';
    if (param792 === "deepseek" && !["deepseek-chat", "deepseek-reasoner"].includes(var4355)) return "deepseek-chat";
    if (param792 === "gemini" && var4355.indexOf(param792) === -0x1) {
      return "gemini-2.5-flash";
    }
    if (param792 === 'claude' && var4355.indexOf(param792) === -0x1) {
      return "claude-opus-4-5-20251101";
    }
    return var4355.replace(/qwen\//g, '').replace(/ernie\//g, '').replace(/zjuchat\//g, '').replace(/doubao\//g, '');
  },
  'getClaudeMaxTokens': function (param794) {
    if (param794.includes('-sonnet-4-') || param794.includes("-3-7-")) {
      return 0xfa00;
    } else {
      if (param794.includes("-opus-4-")) return 0x7d00;else return param794.includes("-3-5-") ? 0x2000 : 0x1000;
    }
  },
  'catchStreamError_CompletionMode': function (param795, param796, param797) {
    try {
      if (typeof JSON.parse(param797) === "object") {
        let var4356, var4357;
        if (JSON.parse(param797).error || JSON.parse(param797).object === "error") {
          var4356 = "⚠️ [请求错误]\n\n❌ " + param795 + " 出错啦：" + param797 + "\n\n🔗【" + param795 + " 错误码含义】请见：\n" + param796;
          var4357 = "👉 ❌ " + param795 + " 出错啦：" + param797 + "\n\n🔗【" + param795 + " 错误码含义】请见：" + param796;
        } else {
          if (JSON.parse(param797)[0x0]?.["error"]) {
            var4356 = "⚠️ [请求错误]\n\n❌ " + param795 + " 出错啦：\"error\": {\n\"code\": " + JSON.parse(param797)[0x0]?.["error"]["code"] + ",\n\"message\": \"" + JSON.parse(param797)[0x0]?.["error"]['message'] + "\",\n}\n\n🔗【" + param795 + " 错误码含义】请见：\n" + param796;
            var4357 = "👉 ❌ " + param795 + " 出错啦：\"error\": {\n\"code\": " + JSON.parse(param797)[0x0]?.['error']["code"] + ",\n\"message\": \"" + JSON.parse(param797)[0x0]?.["error"]['message'] + '\x22,\x0a}\x0a\x0a🔗【' + param795 + " 错误码含义】请见：" + param796;
          }
        }
        if (var4356 || var4357) {
          return Zotero.AI4Paper.gptReaderSidePane_resetChat(var4356), Zotero.AI4Paper.showProgressWindow(0x1388, '❌【' + param795 + "】请求错误", var4357, "openai"), false;
        }
      }
    } catch (_0x234cdb) {
      return Zotero.debug('GPT\x20Completion\x20Error:\x20' + _0x234cdb), true;
    }
    return true;
  },
  'catchFetchError_CompletionMode': function (param798, param799, param800) {
    let var4358 = "⚠️ [请求错误]\n\n❌ " + param798 + " 出错啦：" + param800 + "\n\n🔗【" + param798 + " 错误码含义】请见：\n" + param799,
      var4359 = "👉 ❌ " + param798 + " 出错啦：" + param800 + "\n\n🔗【" + param798 + " 错误码含义】请见：" + param799;
    Zotero.AI4Paper.gptReaderSidePane_resetChat(var4358);
    Zotero.AI4Paper.showProgressWindow(0x1388, '❌【' + param798 + "】请求错误", var4359, "openai");
  },
  'startFetch_CompletionMode': async function (param801, param802, param803, param804, param805, param806, param807) {
    Zotero.AI4Paper.gptReaderSidePane_updateElemsState(param801);
    if (Zotero.Prefs.get("ai4paper.gptStreamResponse")) {
      Zotero.AI4Paper.gptReaderSidePane_onStreamStart(param801);
      let var4360 = {
        'temp': '',
        'target': '',
        'html4Refs': '',
        'hasReasoning_content': false,
        'reasoning_contentStart': false,
        'reasoning_contentEnd': false
      };
      var var4361 = Zotero.AI4Paper.gptReaderSidePane_getRequestOptions(param806, param803, param804);
      fetch(param802, var4361).then(_0x1e3e36 => {
        return !_0x1e3e36.ok && (Zotero.debug("GPT Completion Response Error: " + _0x1e3e36), Zotero.AI4Paper.showProgressWindow(0x9c4, "GPT Completion 请求失败【Zoteor One】", "Fetch request to " + param802 + '\x20failed:\x20HTTP\x20status\x20' + _0x1e3e36.status + " - " + _0x1e3e36.statusText)), _0x1e3e36.body;
      }).then(_0x52ea5a => {
        let var4362 = _0x52ea5a.getReader();
        fn20();
        function fn20() {
          return var4362.read().then(({
            done: _0x4a4bbc,
            value: _0x42dc29
          }) => {
            if (_0x4a4bbc || Zotero.AI4Paper.isAbortRequested) {
              Zotero.AI4Paper.gptReaderSidePane_onStreamDone(param801, '' + var4360.target + var4360.html4Refs, param805);
              var4362.releaseLock();
              return;
            }
            let _0x3335d2 = new TextDecoder('utf-8').decode(_0x42dc29, {
              'stream': true
            });
            if (!Zotero.AI4Paper.catchStreamError_CompletionMode(param806, param807, _0x3335d2)) return;
            Zotero.AI4Paper.resolveStreamChunk(_0x3335d2, var4360, param806);
            Zotero.Prefs.set('ai4paper.chatgptresponse', var4360.target);
            param801.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response") && (param801.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = var4360.target);
            fn20();
          });
        }
      })['catch'](_0x3808fb => {
        Zotero.AI4Paper.catchFetchError_CompletionMode(param806, param807, _0x3808fb);
      });
    } else return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", param802, {
        'headers': Zotero.AI4Paper.gptReaderSidePane_getHeadersObj(param806, param803),
        'body': JSON.stringify(param804),
        'responseType': "json"
      });
    }, _0x4411a1 => {
      Zotero.AI4Paper.runAuthor() && Zotero.AI4Paper.gptReaderSidePane_updateElemsState(param801, _0x4411a1, param805, param806);
    }, param806);
  },
  'gptReaderSidePane_send': function () {
    let var4364 = Zotero.Prefs.get("ai4paper.gptservice");
    if (var4364.includes("GPT 自定")) for (let var4365 of Object.keys(Zotero.AI4Paper.gptCustom_numEmoji)) {
      var4364 === "GPT 自定 " + Zotero.AI4Paper.gptCustom_numEmoji[var4365] && Zotero.AI4Paper[Zotero.AI4Paper.gptServiceList()[var4364].method.completion](var4365);
    } else Zotero.AI4Paper[Zotero.AI4Paper.gptServiceList()[var4364].method.completion]();
  },
  'gptReaderSidePane_sendByOpenAI': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4366 = 'OpenAI';
    var var4367 = Zotero.AI4Paper.gptServiceList()[var4366].api_key,
      var4368 = Zotero.AI4Paper.gptServiceList()[var4366].base_url + "/v1/chat/completions";
    let var4369 = Zotero.AI4Paper.gptServiceList()[var4366].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4367, var4366, true, 'chat')) return false;
    let var4370 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var4370) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4370)) return false;
    let var4371 = '';
    var4371 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4370);
    if (!var4371) {
      return;
    }
    var var4372 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4366].modelLabel);
    let var4373 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var4374 = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? var4374 = {
      'model': var4372,
      'max_tokens': var4373,
      'messages': [{
        'role': "user",
        'content': var4371
      }],
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    } : var4374 = {
      'model': var4372,
      'messages': [{
        'role': "user",
        'content': var4371
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(var4370, var4368, var4367, var4374, var4371, var4366, var4369);
  },
  'gptReaderSidePane_sendByAPI2D': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4375 = "API2D";
    var var4376 = Zotero.AI4Paper.gptServiceList()[var4375].api_key,
      var4377 = Zotero.AI4Paper.gptServiceList()[var4375].base_url + "/v1/chat/completions";
    let var4378 = Zotero.AI4Paper.gptServiceList()[var4375].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4376, var4375, true, "chat")) return false;
    let var4379 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4379) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4379)) return false;
    let var4380 = '';
    var4380 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4379);
    if (!var4380) return;
    var var4381 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4375].modelLabel);
    let var4382 = parseInt(Zotero.Prefs.get("ai4paper.api2dmaxtokens"));
    var var4383 = {};
    Zotero.Prefs.get("ai4paper.api2dmaxtokensenable") ? var4383 = {
      'model': var4381,
      'max_tokens': var4382,
      'messages': [{
        'role': 'user',
        'content': var4380
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var4383 = {
      'model': var4381,
      'messages': [{
        'role': "user",
        'content': var4380
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(var4379, var4377, var4376, var4383, var4380, var4375, var4378);
  },
  'gptReaderSidePane_sendByChatAnywhere': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4384 = "ChatAnywhere";
    var var4385 = Zotero.AI4Paper.gptServiceList()[var4384].api_key,
      var4386 = Zotero.AI4Paper.gptServiceList()[var4384].base_url + '/v1/chat/completions';
    let var4387 = Zotero.AI4Paper.gptServiceList()[var4384].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4385, var4384, true, "chat")) return false;
    let var4388 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var4388) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4388)) return false;
    let var4389 = '';
    var4389 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4388);
    if (!var4389) return;
    var var4390 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4384].modelLabel);
    let var4391 = parseInt(Zotero.Prefs.get("ai4paper.chatanywheremaxtokens"));
    var var4392 = {};
    Zotero.Prefs.get("ai4paper.chatanywheremaxtokensenable") ? var4392 = {
      'model': var4390,
      'max_tokens': var4391,
      'messages': [{
        'role': "user",
        'content': var4389
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var4392 = {
      'model': var4390,
      'messages': [{
        'role': "user",
        'content': var4389
      }],
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.startFetch_CompletionMode(var4388, var4386, var4385, var4392, var4389, var4384, var4387);
  },
  'gptReaderSidePane_sendByQwen': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4393 = '通义千问';
    var var4394 = Zotero.AI4Paper.gptServiceList()[var4393].api_key,
      var4395 = Zotero.AI4Paper.gptServiceList()[var4393].base_url + "/v1/chat/completions";
    let var4396 = Zotero.AI4Paper.gptServiceList()[var4393].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4394, var4393, true, "chat")) return false;
    let var4397 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var4397) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4397)) return false;
    let var4398 = '';
    var4398 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4397);
    if (!var4398) return;
    var var4399 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4393].modelLabel),
      var4400 = {
        'model': var4399,
        'messages': [{
          'role': "user",
          'content': var4398
        }],
        'enable_thinking': Zotero.AI4Paper.gptServiceList()[var4393].thinking_enable,
        'enable_search': Zotero.AI4Paper.gptServiceList()[var4393].websearch_enable && !Zotero.AI4Paper.qwenModelsNotForOnlineSearch.includes(var4399) && true,
        'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
      };
    Zotero.AI4Paper.startFetch_CompletionMode(var4397, var4395, var4394, var4400, var4398, var4393, var4396);
  },
  'gptReaderSidePane_sendByWenxin': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4401 = "文心一言";
    var var4402 = Zotero.AI4Paper.gptServiceList()[var4401].api_key,
      var4403 = '' + Zotero.AI4Paper.gptServiceList()[var4401].request_url;
    let var4404 = Zotero.AI4Paper.gptServiceList()[var4401].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4402, var4401, true, 'chat')) return false;
    let var4405 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4405) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4405)) return false;
    let var4406 = '';
    var4406 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4405);
    if (!var4406) {
      return;
    }
    var var4407 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4401].modelLabel);
    let var4408 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens")),
      var4409 = Zotero.Prefs.get('ai4paper.wenxinEnableSearch'),
      var4410 = {
        'enable': var4409,
        'enable_citation': var4409,
        'enable_trace': var4409
      };
    var var4411 = {
      'model': var4407,
      'messages': [{
        'role': 'user',
        'content': var4406
      }],
      'web_search': var4410,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") && (var4411.max_completion_tokens = var4408);
    Zotero.AI4Paper.startFetch_CompletionMode(var4405, var4403, var4402, var4411, var4406, var4401, var4404);
  },
  'gptReaderSidePane_sendByGLM': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4412 = '智普清言';
    var var4413 = Zotero.AI4Paper.gptServiceList()[var4412].api_key,
      var4414 = '' + Zotero.AI4Paper.gptServiceList()[var4412].request_url;
    let var4415 = Zotero.AI4Paper.gptServiceList()[var4412].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4413, var4412, true, "chat")) return false;
    let var4416 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var4416) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4416)) return false;
    let var4417 = '';
    var4417 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4416);
    if (!var4417) return;
    var var4418 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4412].modelLabel);
    let var4419 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var4420 = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? var4420 = {
      'model': var4418,
      'max_tokens': var4419,
      'messages': [{
        'role': "user",
        'content': var4417
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var4420 = {
      'model': var4418,
      'messages': [{
        'role': "user",
        'content': var4417
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(var4416, var4414, var4413, var4420, var4417, var4412, var4415);
  },
  'gptReaderSidePane_sendByYi': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4421 = "零一万物";
    var var4422 = Zotero.AI4Paper.gptServiceList()[var4421].api_key,
      var4423 = Zotero.AI4Paper.gptServiceList()[var4421].base_url + "/v1/chat/completions";
    let var4424 = Zotero.AI4Paper.gptServiceList()[var4421].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4422, var4421, true, "chat")) return false;
    let var4425 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4425) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4425)) return false;
    let var4426 = '';
    var4426 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4425);
    if (!var4426) {
      return;
    }
    var var4427 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4421].modelLabel);
    let var4428 = parseInt(Zotero.Prefs.get('ai4paper.gptmaxtokens'));
    var var4429 = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? var4429 = {
      'model': var4427,
      'max_tokens': var4428,
      'messages': [{
        'role': "user",
        'content': var4426
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var4429 = {
      'model': var4427,
      'messages': [{
        'role': 'user',
        'content': var4426
      }],
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.startFetch_CompletionMode(var4425, var4423, var4422, var4429, var4426, var4421, var4424);
  },
  'gptReaderSidePane_sendByZJUChat': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4430 = "浙大先生";
    var var4431 = Zotero.AI4Paper.gptServiceList()[var4430].api_key,
      var4432 = Zotero.AI4Paper.gptServiceList()[var4430].base_url + "/v1/chat/completions";
    let var4433 = Zotero.AI4Paper.gptServiceList()[var4430].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4431, var4430, true, "chat")) return false;
    let var4434 = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!var4434) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4434)) return false;
    let var4435 = '';
    var4435 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4434);
    if (!var4435) return;
    var var4436 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4430].modelLabel);
    let var4437 = parseInt(Zotero.Prefs.get('ai4paper.gptmaxtokens'));
    var var4438 = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? var4438 = {
      'model': var4436,
      'max_tokens': var4437,
      'messages': [{
        'role': "user",
        'content': var4435
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var4438 = {
      'model': var4436,
      'messages': [{
        'role': "user",
        'content': var4435
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(var4434, var4432, var4431, var4438, var4435, var4430, var4433);
  },
  'gptReaderSidePane_sendByVolcanoSearch': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4439 = "火山联网搜索";
    var var4440 = Zotero.AI4Paper.gptServiceList()[var4439].api_key,
      var4441 = '' + Zotero.AI4Paper.gptServiceList()[var4439].request_url;
    let var4442 = Zotero.AI4Paper.gptServiceList()[var4439].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4440, var4439, true, 'chat')) return false;
    let var4443 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4443) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4443)) return false;
    let var4444 = '';
    var4444 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4443);
    if (!var4444) return;
    var var4445 = Zotero.AI4Paper.gptServiceList()[var4439].model;
    let var4446 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var4447 = {};
    if (Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable')) {
      var4447 = {
        'model': var4445,
        'max_tokens': var4446,
        'messages': [{
          'role': 'user',
          'content': var4444
        }],
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    } else var4447 = {
      'model': var4445,
      'messages': [{
        'role': 'user',
        'content': var4444
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(var4443, var4441, var4440, var4447, var4444, var4439, var4442);
  },
  'gptReaderSidePane_sendByVolcanoEngine': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4448 = "火山引擎";
    var var4449 = Zotero.AI4Paper.gptServiceList()[var4448].api_key,
      var4450 = '' + Zotero.AI4Paper.gptServiceList()[var4448].request_url;
    let var4451 = Zotero.AI4Paper.gptServiceList()[var4448].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4449, var4448, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[var4448].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var4448].custom_model === '') {
      return window.alert('您启用了自定义模型，但是尚未配置\x20' + var4448 + " 模型！请先前往【Zotero 设置 --> AI4paper --> GPT API】配置。"), -0x1;
    }
    let var4452 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4452) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4452)) return false;
    let var4453 = '';
    var4453 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4452);
    if (!var4453) {
      return;
    }
    var var4454 = Zotero.AI4Paper.gptServiceList()[var4448].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var4448].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var4448].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4448].modelLabel);
    let var4455 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var4456 = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? var4456 = {
      'model': var4454,
      'max_tokens': var4455,
      'messages': [{
        'role': "user",
        'content': var4453
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var4456 = {
      'model': var4454,
      'messages': [{
        'role': "user",
        'content': var4453
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(var4452, var4450, var4449, var4456, var4453, var4448, var4451);
  },
  'gptReaderSidePane_sendByDoubao': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4457 = '豆包';
    var var4458 = Zotero.AI4Paper.gptServiceList()[var4457].api_key,
      var4459 = '' + Zotero.AI4Paper.gptServiceList()[var4457].request_url;
    let var4460 = Zotero.AI4Paper.gptServiceList()[var4457].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4458, var4457, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[var4457].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var4457].custom_model === '') return window.alert("您启用了自定义模型，但是尚未配置 " + var4457 + '\x20模型！请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20GPT\x20API】配置。'), -0x1;
    let var4461 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4461) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4461)) return false;
    let var4462 = '';
    var4462 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4461);
    if (!var4462) return;
    var var4463 = Zotero.AI4Paper.gptServiceList()[var4457].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var4457].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var4457].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4457].modelLabel);
    let var4464 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var4465 = {};
    if (Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable")) {
      var4465 = {
        'model': var4463,
        'max_tokens': var4464,
        'messages': [{
          'role': "user",
          'content': var4462
        }],
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    } else {
      var4465 = {
        'model': var4463,
        'messages': [{
          'role': 'user',
          'content': var4462
        }],
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    }
    Zotero.AI4Paper.startFetch_CompletionMode(var4461, var4459, var4458, var4465, var4462, var4457, var4460);
  },
  'gptReaderSidePane_sendByKimi': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4466 = "Kimi";
    var var4467 = Zotero.AI4Paper.gptServiceList()[var4466].api_key,
      var4468 = Zotero.AI4Paper.gptServiceList()[var4466].base_url + "/v1/chat/completions";
    let var4469 = Zotero.AI4Paper.gptServiceList()[var4466].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4467, var4466, true, "chat")) return false;
    let var4470 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4470) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4470)) return false;
    let var4471 = '';
    var4471 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4470);
    if (!var4471) return;
    var var4472 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4466].modelLabel);
    let var4473 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var4474 = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? var4474 = {
      'model': var4472,
      'max_tokens': var4473,
      'messages': [{
        'role': "user",
        'content': var4471
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var4474 = {
      'model': var4472,
      'messages': [{
        'role': "user",
        'content': var4471
      }],
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.startFetch_CompletionMode(var4470, var4468, var4467, var4474, var4471, var4466, var4469);
  },
  'gptReaderSidePane_sendByDeepSeek': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4475 = "DeepSeek";
    var var4476 = Zotero.AI4Paper.gptServiceList()[var4475].api_key,
      var4477 = Zotero.AI4Paper.gptServiceList()[var4475].base_url + '/v1/chat/completions';
    let var4478 = Zotero.AI4Paper.gptServiceList()[var4475].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4476, var4475, true, "chat")) return false;
    let var4479 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4479) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4479)) return false;
    let var4480 = '';
    var4480 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4479);
    if (!var4480) {
      return;
    }
    var var4481 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4475].modelLabel);
    let var4482 = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var var4483 = {};
    Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable') ? var4483 = {
      'model': var4481,
      'max_tokens': var4482,
      'messages': [{
        'role': "user",
        'content': var4480
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var4483 = {
      'model': var4481,
      'messages': [{
        'role': "user",
        'content': var4480
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(var4479, var4477, var4476, var4483, var4480, var4475, var4478);
  },
  'gptReaderSidePane_sendByGPTCustom': async function (param808) {
    let var4484 = Zotero.AI4Paper.gptCustom_numEmoji;
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4485 = 'GPT\x20自定\x20' + var4484[param808];
    var var4486 = Zotero.AI4Paper.gptServiceList()[var4485].api_key,
      var4487 = Zotero.AI4Paper.getURL4GPTCustom(var4485);
    let var4488 = Zotero.AI4Paper.gptServiceList()[var4485].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4486, var4485, true, "chat")) return false;
    let var4489 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4489) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4489)) return false;
    let var4490 = '';
    var4490 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4489);
    if (!var4490) {
      return;
    }
    var var4491 = Zotero.AI4Paper.gptServiceList()[var4485].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var4485].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var4485].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4485].modelLabel);
    let var4492 = parseInt(Zotero.Prefs.get("ai4paper.gptcustommaxtokens"));
    var var4493 = {};
    Zotero.Prefs.get("ai4paper.gptcustommaxtokensenable") ? var4493 = {
      'model': var4491,
      'max_tokens': var4492,
      'messages': [{
        'role': "user",
        'content': var4490
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : var4493 = {
      'model': var4491,
      'messages': [{
        'role': 'user',
        'content': var4490
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.gptReaderSidePane_addRequestArguments(var4493, param808);
    Zotero.AI4Paper.startFetch_CompletionMode(var4489, var4487, var4486, var4493, var4490, var4485, var4488);
  },
  'gptReaderSidePane_sendByGemini': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4494 = "Gemini";
    var var4495 = Zotero.AI4Paper.gptServiceList()[var4494].api_key;
    let var4496 = Zotero.AI4Paper.gptServiceList()[var4494].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4495, var4494, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[var4494].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var4494].custom_model === '') return window.alert("您启用了自定义模型，但是尚未配置 " + var4494 + " 模型！请先前往【Zotero 设置 --> AI4paper --> GPT API】配置。"), -0x1;
    let var4497 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4497) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4497)) return false;
    let var4498 = '';
    var4498 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4497);
    if (!var4498) return;
    var var4499 = Zotero.AI4Paper.gptServiceList()[var4494].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var4494].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var4494].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4494].modelLabel),
      var4500 = Zotero.AI4Paper.gptServiceList()[var4494].base_url + '/v1beta/models/' + var4499 + ':' + (Zotero.Prefs.get('ai4paper.gptStreamResponse') ? "streamGenerateContent" : "generateContent"),
      var4501 = {
        'contents': [{
          'role': "USER",
          'parts': [{
            'text': var4498
          }]
        }],
        'safetySettings': [{
          'category': 'HARM_CATEGORY_HARASSMENT',
          'threshold': "BLOCK_NONE"
        }, {
          'category': 'HARM_CATEGORY_HATE_SPEECH',
          'threshold': "BLOCK_NONE"
        }, {
          'category': "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          'threshold': "BLOCK_NONE"
        }, {
          'category': "HARM_CATEGORY_DANGEROUS_CONTENT",
          'threshold': "BLOCK_NONE"
        }]
      };
    Zotero.AI4Paper.gptReaderSidePane_SetGeminiThinkingBudget(var4501, var4499);
    Zotero.AI4Paper.startFetch_CompletionMode(var4497, var4500, var4495, var4501, var4498, var4494, var4496);
  },
  'gptReaderSidePane_sendByClaude': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var4502 = "Claude";
    var var4503 = Zotero.AI4Paper.gptServiceList()[var4502].api_key,
      var4504 = '' + Zotero.AI4Paper.gptServiceList()[var4502].request_url;
    let var4505 = Zotero.AI4Paper.gptServiceList()[var4502].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var4503, var4502, true, "chat")) return false;
    let var4506 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var4506) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(var4506)) return false;
    let var4507 = '';
    var4507 = Zotero.AI4Paper.gptReaderSidePane_getQuestion(var4506);
    if (!var4507) {
      return;
    }
    var var4508 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var4502].modelLabel),
      var4509 = {
        'model': var4508,
        'max_tokens': Zotero.AI4Paper.getClaudeMaxTokens(var4508),
        'messages': [{
          'role': "user",
          'content': var4507
        }],
        'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
      };
    Zotero.AI4Paper.startFetch_CompletionMode(var4506, var4504, var4503, var4509, var4507, var4502, var4505);
  },
  'gptReaderSidePane_updateChat': function () {
    if (!Zotero.Prefs.get('ai4paper.gptviewReaderSidepane')) return false;
    let var4520 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4520 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4520) return;
    var4520.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = Zotero.Prefs.get('ai4paper.chatgptprompt');
    var4520.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = Zotero.Prefs.get("ai4paper.chatgptresponse");
    var4520.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = Zotero.Prefs.get("ai4paper.chatgptresponsetime");
  },
  'gptReaderSidePane_resetChat': function (param809) {
    Zotero.Prefs.set('ai4paper.gptStreamRunning', false);
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) {
      return false;
    }
    let var4521 = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (var4521 = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!var4521) {
      return;
    }
    if (var4521.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-response-time').textContent === "正在响应...") {
      var4521.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = param809;
      Zotero.Prefs.set("ai4paper.chatgptresponse", param809);
      var4521.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = "Hi，有什么能帮助您吗？";
      var4521.document.getElementById("chatgpt-readerSidePane-chatgpt-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
      var4521.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").placeholder = "这里显示结果";
      var4521.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-space').style.display = "none";
      var4521.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").style.display = 'none';
      var4521.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").textContent = '';
      Zotero.Prefs.set("ai4paper.chatgptresponsetime", "Hi，有什么能帮助您吗？");
    }
    window.document.querySelector("#chatgpt-readerSidePane-send-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.send;
    window.document.querySelector("#chatgpt-readerSidePane-send-icon").title = '发送';
    window.document.querySelector("#chatgpt-readerSidePane-send-icon").onclick = () => Zotero.AI4Paper.gptReaderSidePane_send();
  },
});
