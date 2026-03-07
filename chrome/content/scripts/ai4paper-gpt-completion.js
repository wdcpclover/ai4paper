// AI4Paper GPT Completion Module - Completion mode send methods, stream handling, and request building
Object.assign(Zotero.AI4Paper, {
  'gptReaderSidePane_getQuestion': function (iframeWin) {
    let question = '',
      promptText = iframeWin.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-prompt').value;
    Zotero.Prefs.set('ai4paper.chatgptprompt', promptText);
    let template = window.document.querySelector('#ai4paper-chatgpt-readerSidePane-chatgpt-prompt-template-menulist').value;
    Zotero.Prefs.set('ai4paper.chatgptprompttemplate', template);
    let templateList = JSON.parse(Zotero.Prefs.get("ai4paper.prompttemplateuserobject")),
      matched = false;
    for (let entry of templateList) {
      entry.alias === template.trim() && !matched && (template = entry.realTemplate, Zotero.Prefs.set("ai4paper.chatgptprompttemplate", entry.alias), matched = true);
    }
    template = template.replace(/🌝/g, '\x0a');
    if (template === '无' || template === '') {
      question = promptText.trim();
    } else {
      if (template === "AI 解读论文 🔒" || template === "论文深度解读 🔒" || template === "论文简要剖析 🔒") {
        if (template === "AI 解读论文 🔒") template = Zotero.Prefs.get("ai4paper.prompt4PaperAI");else {
          if (template === '论文深度解读\x20🔒') template = Zotero.Prefs.get("ai4paper.prompt4PaperDeepInterpretation");else template === "论文简要剖析 🔒" && (template = Zotero.Prefs.get('ai4paper.prompt4PaperBriefAnalysis'));
        }
        template = template.replace(/🌝/g, '\x0a');
        question = template + ":\n\n" + promptText;
      } else promptText != '' ? question = template + ":\n\n" + promptText : question = template;
    }
    return question;
  },
  'gptReaderSidePane_updateElemsState': function (iframeWin, result, userPrompt, serviceName) {
    if (!result) {
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = '';
      Zotero.Prefs.set("ai4paper.chatgptresponse", '');
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = '正在响应...';
      Zotero.Prefs.set("ai4paper.chatgptresponsetime", "正在响应...");
      iframeWin.document.getElementById("chatgpt-readerSidePane-chatgpt-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.openai_purple;
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").placeholder = '请稍等...';
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-space").style.display = "none";
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").style.display = "none";
      iframeWin.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-token-used').textContent = '';
    } else {
      if (result && result.response) {
        iframeWin.document.getElementById("chatgpt-readerSidePane-chatgpt-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
        iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").placeholder = "这里显示结果";
        let now = new Date(),
          timeStr = now.toLocaleDateString() + '\x20' + now.toLocaleTimeString('chinese', {
            'hour12': false
          });
        iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = timeStr;
        Zotero.Prefs.set("ai4paper.chatgptresponsetime", timeStr);
        let responseText, totalTokens;
        if (serviceName === 'Gemini') {
          responseText = result.response.candidates[0x0].content.parts[0x0].text;
        } else {
          if (serviceName === "Claude") {
            responseText = result.response.content[0x0].text;
            totalTokens = result.response.usage.input_tokens + result.response.usage.output_tokens;
          } else {
            responseText = result.response.choices[0x0].message.content;
            totalTokens = result.response.usage.total_tokens;
            if (result.response.choices[0x0].message.reasoning_content) {
              let content = result.response.choices[0x0].message.content,
                reasoning = result.response.choices[0x0].message.reasoning_content;
              reasoning.indexOf('\x0a') != 0x0 ? reasoning = '<think>\x0a' + reasoning : reasoning = "<think>" + reasoning;
              content.indexOf('\x0a') != 0x0 ? content = '\x0a</think>\x0a\x0a' + content : content = "\n</think>\n" + content;
              responseText = '' + reasoning + content;
            }
          }
        }
        iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = responseText;
        Zotero.Prefs.set("ai4paper.chatgptresponse", responseText);
        totalTokens ? (iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-space").style.display = "inline", iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").style.display = 'inline', iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").textContent = 'Tokens:\x20' + totalTokens) : (iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-space").style.display = "none", iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").style.display = 'none');
        Zotero.AI4Paper.gptReaderSidePane_updateChat();
        Zotero.Prefs.get("ai4paper.translationviewerenable") && Zotero.AI4Paper.updateTransViewer('🙋<p>' + userPrompt, "🤖️<p>" + responseText);
      }
    }
  },
  'gptReaderSidePane_onStreamDone': function (iframeWin, responseText, userPrompt) {
    Zotero.Prefs.set("ai4paper.gptStreamRunning", false);
    Zotero.AI4Paper.isAbortRequested = false;
    window.document.querySelector('#chatgpt-readerSidePane-send-icon') && (window.document.querySelector("#chatgpt-readerSidePane-send-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.send, window.document.querySelector("#chatgpt-readerSidePane-send-icon").title = '发送', window.document.querySelector("#chatgpt-readerSidePane-send-icon").onclick = () => Zotero.AI4Paper.gptReaderSidePane_send());
    let now = new Date(),
      dateStr = now.toLocaleDateString(),
      timeStr = now.toLocaleTimeString("chinese", {
        'hour12': false
      }),
      dateTimeStr = dateStr + '\x20' + timeStr;
    iframeWin.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-response-time').textContent = dateTimeStr;
    Zotero.Prefs.set("ai4paper.chatgptresponsetime", dateTimeStr);
    iframeWin.document.getElementById("chatgpt-readerSidePane-chatgpt-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
    iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").placeholder = "这里显示结果";
    Zotero.Prefs.set("ai4paper.chatgptresponse", responseText);
    Zotero.AI4Paper.gptReaderSidePane_updateChat();
    Zotero.Prefs.get("ai4paper.gptChatHistoryViewerEnable") && Zotero.AI4Paper.updateTransViewer("🙋<p>" + userPrompt, "🤖️<p>" + responseText);
  },
  'getURL4GPTCustom': function (serviceName) {
    let baseUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url;
    if (baseUrl.endsWith('#')) return baseUrl.substring(0x0, baseUrl.length - 0x1);else {
      return Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    }
  },
  'getGPTModel': function (modelLabel, isTranslation) {
    let currentModel = isTranslation ? Zotero.Prefs.get("ai4paper.translationOpenAIModel") : Zotero.Prefs.get("ai4paper.gptmodel");
    if (modelLabel === "gpt" && currentModel.indexOf(modelLabel) === -0x1 && currentModel.indexOf("o1-") === -0x1 && currentModel.indexOf('o3-') === -0x1) return "gpt-4o-mini";
    if (modelLabel === "qwen" && currentModel.indexOf(modelLabel) === -0x1 && currentModel.indexOf("qwq-") === -0x1) return 'qwen-plus';
    if (modelLabel === "ernie" && currentModel.indexOf(modelLabel) === -0x1) {
      return "ernie-4.0-turbo-128k";
    }
    if (modelLabel === "glm" && currentModel.indexOf(modelLabel) === -0x1) {
      return 'glm-4.7-flash';
    }
    if (modelLabel === 'yi-' && currentModel.indexOf(modelLabel) === -0x1) return "yi-lightning";
    if (modelLabel === "zjuchat" && currentModel.indexOf(modelLabel) === -0x1) {
      return 'deepseek-v3';
    }
    if (modelLabel === "volcanoEngine" && currentModel.indexOf('doubao') === -0x1) return "deepseek-r1-250528";
    if (modelLabel === "doubao" && currentModel.indexOf("doubao") === -0x1) return "doubao-seed-1-6-251015";
    if (modelLabel === "moonshot" && currentModel.indexOf(modelLabel) === -0x1 && currentModel.indexOf("kimi") === -0x1) return 'moonshot-v1-auto';
    if (modelLabel === "deepseek" && !["deepseek-chat", "deepseek-reasoner"].includes(currentModel)) return "deepseek-chat";
    if (modelLabel === "gemini" && currentModel.indexOf(modelLabel) === -0x1) {
      return "gemini-2.5-flash";
    }
    if (modelLabel === 'claude' && currentModel.indexOf(modelLabel) === -0x1) {
      return "claude-opus-4-5-20251101";
    }
    return currentModel.replace(/qwen\//g, '').replace(/ernie\//g, '').replace(/zjuchat\//g, '').replace(/doubao\//g, '');
  },
  'getClaudeMaxTokens': function (model) {
    if (model.includes('-sonnet-4-') || model.includes("-3-7-")) {
      return 0xfa00;
    } else {
      if (model.includes("-opus-4-")) return 0x7d00;else return model.includes("-3-5-") ? 0x2000 : 0x1000;
    }
  },
  'catchStreamError_CompletionMode': function (serviceName, errorLink, chunkText) {
    try {
      if (typeof JSON.parse(chunkText) === "object") {
        let errorDisplay, errorNotify;
        if (JSON.parse(chunkText).error || JSON.parse(chunkText).object === "error") {
          errorDisplay = "⚠️ [请求错误]\n\n❌ " + serviceName + " 出错啦：" + chunkText + "\n\n🔗【" + serviceName + " 错误码含义】请见：\n" + errorLink;
          errorNotify = "👉 ❌ " + serviceName + " 出错啦：" + chunkText + "\n\n🔗【" + serviceName + " 错误码含义】请见：" + errorLink;
        } else {
          if (JSON.parse(chunkText)[0x0]?.["error"]) {
            errorDisplay = "⚠️ [请求错误]\n\n❌ " + serviceName + " 出错啦：\"error\": {\n\"code\": " + JSON.parse(chunkText)[0x0]?.["error"]["code"] + ",\n\"message\": \"" + JSON.parse(chunkText)[0x0]?.["error"]['message'] + "\",\n}\n\n🔗【" + serviceName + " 错误码含义】请见：\n" + errorLink;
            errorNotify = "👉 ❌ " + serviceName + " 出错啦：\"error\": {\n\"code\": " + JSON.parse(chunkText)[0x0]?.['error']["code"] + ",\n\"message\": \"" + JSON.parse(chunkText)[0x0]?.["error"]['message'] + '\x22,\x0a}\x0a\x0a🔗【' + serviceName + " 错误码含义】请见：" + errorLink;
          }
        }
        if (errorDisplay || errorNotify) {
          return Zotero.AI4Paper.gptReaderSidePane_resetChat(errorDisplay), Zotero.AI4Paper.showProgressWindow(0x1388, '❌【' + serviceName + "】请求错误", errorNotify, "openai"), false;
        }
      }
    } catch (e) {
      return Zotero.debug('GPT\x20Completion\x20Error:\x20' + e), true;
    }
    return true;
  },
  'catchFetchError_CompletionMode': function (serviceName, errorLink, error) {
    let errorDisplay = "⚠️ [请求错误]\n\n❌ " + serviceName + " 出错啦：" + error + "\n\n🔗【" + serviceName + " 错误码含义】请见：\n" + errorLink,
      errorNotify = "👉 ❌ " + serviceName + " 出错啦：" + error + "\n\n🔗【" + serviceName + " 错误码含义】请见：" + errorLink;
    Zotero.AI4Paper.gptReaderSidePane_resetChat(errorDisplay);
    Zotero.AI4Paper.showProgressWindow(0x1388, '❌【' + serviceName + "】请求错误", errorNotify, "openai");
  },
  'startFetch_CompletionMode': async function (iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink) {
    Zotero.AI4Paper.gptReaderSidePane_updateElemsState(iframeWin);
    if (Zotero.Prefs.get("ai4paper.gptStreamResponse")) {
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
      fetch(apiUrl, requestOptions).then(res => {
        return !res.ok && (Zotero.debug("GPT Completion Response Error: " + res), Zotero.AI4Paper.showProgressWindow(0x9c4, "GPT Completion 请求失败【Zoteor One】", "Fetch request to " + apiUrl + '\x20failed:\x20HTTP\x20status\x20' + res.status + " - " + res.statusText)), res.body;
      }).then(body => {
        let reader = body.getReader();
        readChunk();
        function readChunk() {
          return reader.read().then(({
            done: isDone,
            value: chunk
          }) => {
            if (isDone || Zotero.AI4Paper.isAbortRequested) {
              Zotero.AI4Paper.gptReaderSidePane_onStreamDone(iframeWin, '' + streamState.target + streamState.html4Refs, question);
              reader.releaseLock();
              return;
            }
            let decoded = new TextDecoder('utf-8').decode(chunk, {
              'stream': true
            });
            if (!Zotero.AI4Paper.catchStreamError_CompletionMode(serviceName, errorLink, decoded)) return;
            Zotero.AI4Paper.resolveStreamChunk(decoded, streamState, serviceName);
            iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response") && (iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = streamState.target);
            readChunk();
          });
        }
      })['catch'](err => {
        Zotero.AI4Paper.catchFetchError_CompletionMode(serviceName, errorLink, err);
      });
    } else return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': Zotero.AI4Paper.gptReaderSidePane_getHeadersObj(serviceName, apiKey),
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResult => {
      Zotero.AI4Paper.runAuthor() && Zotero.AI4Paper.gptReaderSidePane_updateElemsState(iframeWin, httpResult, question, serviceName);
    }, serviceName);
  },
  'gptReaderSidePane_send': function () {
    let service = Zotero.Prefs.get("ai4paper.gptservice");
    if (service.includes("GPT 自定")) for (let key of Object.keys(Zotero.AI4Paper.gptCustom_numEmoji)) {
      service === "GPT 自定 " + Zotero.AI4Paper.gptCustom_numEmoji[key] && Zotero.AI4Paper[Zotero.AI4Paper.gptServiceList()[service].method.completion](key);
    } else Zotero.AI4Paper[Zotero.AI4Paper.gptServiceList()[service].method.completion]();
  },
  'gptReaderSidePane_sendByOpenAI': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = 'OpenAI';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'chat')) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) {
      return;
    }
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    } : requestBody = {
      'model': model,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByAPI2D': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "API2D";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.api2dmaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.api2dmaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': [{
        'role': 'user',
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByChatAnywhere': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "ChatAnywhere";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + '/v1/chat/completions';
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.chatanywheremaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatanywheremaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByQwen': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = '通义千问';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'enable_thinking': Zotero.AI4Paper.gptServiceList()[serviceName].thinking_enable,
        'enable_search': Zotero.AI4Paper.gptServiceList()[serviceName].websearch_enable && !Zotero.AI4Paper.qwenModelsNotForOnlineSearch.includes(model) && true,
        'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
      };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByWenxin': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "文心一言";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'chat')) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) {
      return;
    }
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens")),
      searchEnabled = Zotero.Prefs.get('ai4paper.wenxinEnableSearch'),
      webSearch = {
        'enable': searchEnabled,
        'enable_citation': searchEnabled,
        'enable_trace': searchEnabled
      };
    var requestBody = {
      'model': model,
      'messages': [{
        'role': 'user',
        'content': question
      }],
      'web_search': webSearch,
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") && (requestBody.max_completion_tokens = maxTokens);
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByGLM': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = '智普清言';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByYi': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "零一万物";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) {
      return;
    }
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get('ai4paper.gptmaxtokens'));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': [{
        'role': 'user',
        'content': question
      }],
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByZJUChat': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "浙大先生";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType('chatgpt');
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get('ai4paper.gptmaxtokens'));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByVolcanoSearch': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "火山联网搜索";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'chat')) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) return;
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].model;
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    if (Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable')) {
      requestBody = {
        'model': model,
        'max_tokens': maxTokens,
        'messages': [{
          'role': 'user',
          'content': question
        }],
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    } else requestBody = {
      'model': model,
      'messages': [{
        'role': 'user',
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByVolcanoEngine': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "火山引擎";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model === '') {
      return window.alert('您启用了自定义模型，但是尚未配置\x20' + serviceName + " 模型！请先前往【Zotero 设置 --> AI4paper --> GPT API】配置。"), -0x1;
    }
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) {
      return;
    }
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByDoubao': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = '豆包';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model === '') return window.alert("您启用了自定义模型，但是尚未配置 " + serviceName + '\x20模型！请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20GPT\x20API】配置。'), -0x1;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) return;
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    if (Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable")) {
      requestBody = {
        'model': model,
        'max_tokens': maxTokens,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    } else {
      requestBody = {
        'model': model,
        'messages': [{
          'role': 'user',
          'content': question
        }],
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    }
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByKimi': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "Kimi";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) return;
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.chatgptmaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByDeepSeek': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "DeepSeek";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + '/v1/chat/completions';
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) {
      return;
    }
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptmaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get('ai4paper.chatgptmaxtokensenable') ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByGPTCustom': async function (customIndex) {
    let numEmoji = Zotero.AI4Paper.gptCustom_numEmoji;
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = 'GPT\x20自定\x20' + numEmoji[customIndex];
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.getURL4GPTCustom(serviceName);
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) {
      return;
    }
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel);
    let maxTokens = parseInt(Zotero.Prefs.get("ai4paper.gptcustommaxtokens"));
    var requestBody = {};
    Zotero.Prefs.get("ai4paper.gptcustommaxtokensenable") ? requestBody = {
      'model': model,
      'max_tokens': maxTokens,
      'messages': [{
        'role': "user",
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    } : requestBody = {
      'model': model,
      'messages': [{
        'role': 'user',
        'content': question
      }],
      'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
    };
    Zotero.AI4Paper.gptReaderSidePane_addRequestArguments(requestBody, customIndex);
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByGemini': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "Gemini";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key;
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    if (Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model === '') return window.alert("您启用了自定义模型，但是尚未配置 " + serviceName + " 模型！请先前往【Zotero 设置 --> AI4paper --> GPT API】配置。"), -0x1;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) return;
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel),
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + '/v1beta/models/' + model + ':' + (Zotero.Prefs.get('ai4paper.gptStreamResponse') ? "streamGenerateContent" : "generateContent"),
      requestBody = {
        'contents': [{
          'role': "USER",
          'parts': [{
            'text': question
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
    Zotero.AI4Paper.gptReaderSidePane_SetGeminiThinkingBudget(requestBody, model);
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByClaude': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "Claude";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) {
      return;
    }
    var model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel),
      requestBody = {
        'model': model,
        'max_tokens': Zotero.AI4Paper.getClaudeMaxTokens(model),
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': Zotero.Prefs.get('ai4paper.gptStreamResponse')
    };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_sendByOllama': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "Ollama";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url.replace(/\/$/, '') + "/v1/chat/completions";
    let errorLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "chat")) return false;
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) return false;
    if (Zotero.AI4Paper.gptReaderSidePane_isStreamRunning(iframeWin)) return false;
    let question = '';
    question = Zotero.AI4Paper.gptReaderSidePane_getQuestion(iframeWin);
    if (!question) {
      return;
    }
    var model = Zotero.AI4Paper.gptServiceList()[serviceName].model,
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': Zotero.Prefs.get("ai4paper.gptStreamResponse")
      };
    Zotero.AI4Paper.startFetch_CompletionMode(iframeWin, apiUrl, apiKey, requestBody, question, serviceName, errorLink);
  },
  'gptReaderSidePane_updateChat': function () {
    if (!Zotero.Prefs.get('ai4paper.gptviewReaderSidepane')) return false;
    let iframeWin = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (iframeWin = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!iframeWin) return;
    iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = Zotero.Prefs.get('ai4paper.chatgptprompt');
    iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = Zotero.Prefs.get("ai4paper.chatgptresponse");
    iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = Zotero.Prefs.get("ai4paper.chatgptresponsetime");
  },
  'gptReaderSidePane_resetChat': function (errorMessage) {
    Zotero.Prefs.set('ai4paper.gptStreamRunning', false);
    if (!Zotero.Prefs.get("ai4paper.gptviewReaderSidepane")) {
      return false;
    }
    let iframeWin = null;
    window.document.getElementById("ai4paper-chatgpt-readersidepane") && (iframeWin = window.document.getElementById("ai4paper-chatgpt-readersidepane").contentWindow);
    if (!iframeWin) {
      return;
    }
    if (iframeWin.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-response-time').textContent === "正在响应...") {
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").value = errorMessage;
      Zotero.Prefs.set("ai4paper.chatgptresponse", errorMessage);
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response-time").textContent = "Hi，有什么能帮助您吗？";
      iframeWin.document.getElementById("chatgpt-readerSidePane-chatgpt-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.gptviewReaderSidepane;
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-response").placeholder = "这里显示结果";
      iframeWin.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-space').style.display = "none";
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").style.display = 'none';
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-token-used").textContent = '';
      Zotero.Prefs.set("ai4paper.chatgptresponsetime", "Hi，有什么能帮助您吗？");
    }
    window.document.querySelector("#chatgpt-readerSidePane-send-icon").innerHTML = Zotero.AI4Paper.svg_icon_20px.send;
    window.document.querySelector("#chatgpt-readerSidePane-send-icon").title = '发送';
    window.document.querySelector("#chatgpt-readerSidePane-send-icon").onclick = () => Zotero.AI4Paper.gptReaderSidePane_send();
  },
});
