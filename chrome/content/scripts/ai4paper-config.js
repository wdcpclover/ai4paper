// AI4Paper Config Module - Service lists, model lists, and static configuration
Object.assign(Zotero.AI4Paper, {
  'gptServiceList': function () {
    return {
      'OpenAI': {
        'api_key': Zotero.Prefs.get('ai4paper.openaiapiinput').trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.openaiverifyresult"),
        'base_url': 'https://api.openai.com',
        'errorCode_link': "https://www.yuque.com/qnscholar/zotero-one/gd5pfvvrgla9lu0u#W1t6j",
        'method': {
          'completion': "gptReaderSidePane_sendByOpenAI",
          'chat': "gptReaderSidePane_ChatMode_sendByOpenAI"
        },
        'modelLabel': "gpt"
      },
      'API2D': {
        'api_key': Zotero.Prefs.get("ai4paper.api2dapiinput").trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.api2dverifyresult"),
        'base_url': "https://openai.api2d.net",
        'errorCode_link': "https://www.yuque.com/qnscholar/zotero-one/nyzqz9py631u4ixl#UwEAj",
        'method': {
          'completion': "gptReaderSidePane_sendByAPI2D",
          'chat': "gptReaderSidePane_ChatMode_sendByAPI2D"
        },
        'modelLabel': "gpt"
      },
      'ChatAnywhere': {
        'api_key': Zotero.Prefs.get("ai4paper.chatanywhereapiinput").trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.chatanywhereverifyresult"),
        'base_url': Zotero.Prefs.get("ai4paper.chatanywherehost").trim(),
        'errorCode_link': "https://chatanywhere.apifox.cn/doc-2664690",
        'method': {
          'completion': "gptReaderSidePane_sendByChatAnywhere",
          'chat': 'gptReaderSidePane_ChatMode_sendByChatAnywhere'
        },
        'modelLabel': 'gpt'
      },
      'GPT\x20自定\x20①': {
        'api_key': Zotero.Prefs.get("ai4paper.gptcustomapiinput").trim(),
        'custom_model': Zotero.Prefs.get("ai4paper.gptcustomModelCustom").trim(),
        'custom_model_enable': Zotero.Prefs.get('ai4paper.gptcustomModelCustomEnable'),
        'api_verifyResult': Zotero.Prefs.get('ai4paper.gptcustomverifyresult'),
        'base_url': Zotero.Prefs.get("ai4paper.gptcustomhost").trim(),
        'errorCode_link': "[暂无，可咨询 API 服务提供商，或去提供商网站查看文档]",
        'method': {
          'completion': "gptReaderSidePane_sendByGPTCustom",
          'chat': "gptReaderSidePane_ChatMode_sendByGPTCustom"
        },
        'modelLabel': 'selected'
      },
      'GPT\x20自定\x20②': {
        'api_key': Zotero.Prefs.get('ai4paper.gptcustomapiinput2nd').trim(),
        'custom_model': Zotero.Prefs.get('ai4paper.gptcustomModelCustom2nd').trim(),
        'custom_model_enable': Zotero.Prefs.get("ai4paper.gptcustomModelCustomEnable2nd"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.gptcustomverifyresult2nd"),
        'base_url': Zotero.Prefs.get("ai4paper.gptcustomhost2nd").trim(),
        'errorCode_link': "[暂无，可咨询 API 服务提供商，或去提供商网站查看文档]",
        'method': {
          'completion': 'gptReaderSidePane_sendByGPTCustom',
          'chat': "gptReaderSidePane_ChatMode_sendByGPTCustom"
        },
        'modelLabel': "selected"
      },
      'GPT\x20自定\x20③': {
        'api_key': Zotero.Prefs.get("ai4paper.gptcustomapiinput3rd").trim(),
        'custom_model': Zotero.Prefs.get("ai4paper.gptcustomModelCustom3rd").trim(),
        'custom_model_enable': Zotero.Prefs.get("ai4paper.gptcustomModelCustomEnable3rd"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.gptcustomverifyresult3rd"),
        'base_url': Zotero.Prefs.get('ai4paper.gptcustomhost3rd').trim(),
        'errorCode_link': "[暂无，可咨询 API 服务提供商，或去提供商网站查看文档]",
        'method': {
          'completion': "gptReaderSidePane_sendByGPTCustom",
          'chat': "gptReaderSidePane_ChatMode_sendByGPTCustom"
        },
        'modelLabel': 'selected'
      },
      'GPT\x20自定\x20④': {
        'api_key': Zotero.Prefs.get("ai4paper.gptcustomapiinput4th").trim(),
        'custom_model': Zotero.Prefs.get("ai4paper.gptcustomModelCustom4th").trim(),
        'custom_model_enable': Zotero.Prefs.get("ai4paper.gptcustomModelCustomEnable4th"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.gptcustomverifyresult4th"),
        'base_url': Zotero.Prefs.get("ai4paper.gptcustomhost4th").trim(),
        'errorCode_link': '[暂无，可咨询\x20API\x20服务提供商，或去提供商网站查看文档]',
        'method': {
          'completion': "gptReaderSidePane_sendByGPTCustom",
          'chat': "gptReaderSidePane_ChatMode_sendByGPTCustom"
        },
        'modelLabel': "selected"
      },
      'GPT\x20自定\x20⑤': {
        'api_key': Zotero.Prefs.get("ai4paper.gptcustomapiinput5th").trim(),
        'custom_model': Zotero.Prefs.get('ai4paper.gptcustomModelCustom5th').trim(),
        'custom_model_enable': Zotero.Prefs.get("ai4paper.gptcustomModelCustomEnable5th"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.gptcustomverifyresult5th"),
        'base_url': Zotero.Prefs.get('ai4paper.gptcustomhost5th').trim(),
        'errorCode_link': '[暂无，可咨询\x20API\x20服务提供商，或去提供商网站查看文档]',
        'method': {
          'completion': 'gptReaderSidePane_sendByGPTCustom',
          'chat': "gptReaderSidePane_ChatMode_sendByGPTCustom"
        },
        'modelLabel': "selected"
      },
      'GPT\x20自定\x20⑥': {
        'api_key': Zotero.Prefs.get("ai4paper.gptcustomapiinput6th").trim(),
        'custom_model': Zotero.Prefs.get('ai4paper.gptcustomModelCustom6th').trim(),
        'custom_model_enable': Zotero.Prefs.get("ai4paper.gptcustomModelCustomEnable6th"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.gptcustomverifyresult6th"),
        'base_url': Zotero.Prefs.get("ai4paper.gptcustomhost6th").trim(),
        'errorCode_link': "[暂无，可咨询 API 服务提供商，或去提供商网站查看文档]",
        'method': {
          'completion': 'gptReaderSidePane_sendByGPTCustom',
          'chat': "gptReaderSidePane_ChatMode_sendByGPTCustom"
        },
        'modelLabel': 'selected'
      },
      '通义千问': {
        'api_key': Zotero.Prefs.get("ai4paper.qwenAPI").trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.qwenVerifyResult"),
        'thinking_enable': Zotero.Prefs.get("ai4paper.qwenEnableThinking"),
        'websearch_enable': Zotero.Prefs.get('ai4paper.qwenEnableSearch'),
        'base_url': "https://dashscope.aliyuncs.com/compatible-mode",
        'errorCode_link': "https://www.yuque.com/qnscholar/zotero-one/osqdh1qyu9amx31i#4401bc26",
        'method': {
          'completion': 'gptReaderSidePane_sendByQwen',
          'chat': 'gptReaderSidePane_ChatMode_sendByQwen'
        },
        'modelLabel': "qwen"
      },
      '文心一言': {
        'api_key': Zotero.Prefs.get("ai4paper.wenxinAPI").trim(),
        'api_verifyResult': Zotero.Prefs.get('ai4paper.wenxinAPIVerifyResult'),
        'request_url': "https://qianfan.baidubce.com/v2/chat/completions",
        'errorCode_link': 'https://cloud.baidu.com/doc/WENXINWORKSHOP/s/tlmyncueh',
        'method': {
          'completion': 'gptReaderSidePane_sendByWenxin',
          'chat': "gptReaderSidePane_ChatMode_sendByWenxin"
        },
        'modelLabel': "ernie"
      },
      '智普清言': {
        'api_key': Zotero.Prefs.get('ai4paper.glmAPI').trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.glmVerifyResult"),
        'request_url': 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        'errorCode_link': "https://open.bigmodel.cn/dev/api/error-code/error-code-v4",
        'method': {
          'completion': "gptReaderSidePane_sendByGLM",
          'chat': "gptReaderSidePane_ChatMode_sendByGLM"
        },
        'modelLabel': "glm"
      },
      '零一万物': {
        'api_key': Zotero.Prefs.get('ai4paper.yiAPI').trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.yiVerifyResult"),
        'base_url': "https://api.lingyiwanwu.com",
        'errorCode_link': "https://platform.lingyiwanwu.com/docs/api-reference#状态码",
        'method': {
          'completion': 'gptReaderSidePane_sendByYi',
          'chat': "gptReaderSidePane_ChatMode_sendByYi"
        },
        'modelLabel': 'yi-'
      },
      '浙大先生': {
        'api_key': Zotero.Prefs.get("ai4paper.zjuchatAPI").trim(),
        'api_verifyResult': Zotero.Prefs.get('ai4paper.zjuchatVerifyResult'),
        'base_url': "https://chat.zju.edu.cn/api/ai",
        'errorCode_link': "https://www.yuque.com/qnscholar/zotero-one/gd5pfvvrgla9lu0u#W1t6j",
        'method': {
          'completion': "gptReaderSidePane_sendByZJUChat",
          'chat': "gptReaderSidePane_ChatMode_sendByZJUChat"
        },
        'modelLabel': "zjuchat"
      },
      '火山联网搜索': {
        'api_key': Zotero.Prefs.get('ai4paper.volcanoSearchAPI').trim(),
        'model': Zotero.Prefs.get('ai4paper.volcanoSearchModel').trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.volcanoSearchVerifyresult"),
        'request_url': "https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions",
        'errorCode_link': 'https://www.volcengine.com/docs/82379/1299023',
        'method': {
          'completion': "gptReaderSidePane_sendByVolcanoSearch",
          'chat': "gptReaderSidePane_ChatMode_sendByVolcanoSearch"
        },
        'modelLabel': ''
      },
      '火山引擎': {
        'api_key': Zotero.Prefs.get("ai4paper.volcanoEngineAPI").trim(),
        'custom_model': Zotero.Prefs.get("ai4paper.volcanoEngineModel").trim(),
        'custom_model_enable': Zotero.Prefs.get("ai4paper.volcanoEngineModelCustomEnable"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.volcanoEngineVerifyresult"),
        'request_url': "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
        'errorCode_link': "https://www.volcengine.com/docs/82379/1299023",
        'method': {
          'completion': "gptReaderSidePane_sendByVolcanoEngine",
          'chat': "gptReaderSidePane_ChatMode_sendByVolcanoEngine"
        },
        'modelLabel': "volcanoEngine"
      },
      '豆包': {
        'api_key': Zotero.Prefs.get('ai4paper.doubaoAPI').trim(),
        'custom_model': Zotero.Prefs.get("ai4paper.doubaoModel").trim(),
        'custom_model_enable': Zotero.Prefs.get('ai4paper.doubaoModelCustomEnable'),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.doubaoverifyresult"),
        'request_url': "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
        'errorCode_link': 'https://www.volcengine.com/docs/82379/1299023',
        'method': {
          'completion': "gptReaderSidePane_sendByDoubao",
          'chat': "gptReaderSidePane_ChatMode_sendByDoubao"
        },
        'modelLabel': "doubao"
      },
      'Kimi': {
        'api_key': Zotero.Prefs.get('ai4paper.kimiAPI').trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.kimiVerifyResult"),
        'base_url': 'https://api.moonshot.cn',
        'errorCode_link': "https://www.yuque.com/qnscholar/zotero-one/liqsxnq4cgsgqvgf#d4131e3e",
        'method': {
          'completion': "gptReaderSidePane_sendByKimi",
          'chat': "gptReaderSidePane_ChatMode_sendByKimi"
        },
        'modelLabel': "moonshot"
      },
      'DeepSeek': {
        'api_key': Zotero.Prefs.get("ai4paper.deepSeekAPI").trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.deepSeekVerifyResult"),
        'base_url': 'https://api.deepseek.com',
        'errorCode_link': "https://api-docs.deepseek.com/zh-cn/quick_start/error_codes",
        'method': {
          'completion': "gptReaderSidePane_sendByDeepSeek",
          'chat': "gptReaderSidePane_ChatMode_sendByDeepSeek"
        },
        'modelLabel': 'deepseek'
      },
      'Gemini': {
        'api_key': Zotero.Prefs.get("ai4paper.geminiapiinput").trim(),
        'custom_model': Zotero.Prefs.get("ai4paper.geminiModelCustom").trim(),
        'custom_model_enable': Zotero.Prefs.get("ai4paper.geminiModelCustomEnable"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.geminiverifyresult"),
        'base_url': Zotero.Prefs.get("ai4paper.geminihost").trim(),
        'errorCode_link': "https://www.yuque.com/qnscholar/zotero-one/twvfs07f77nifxhg#4401bc26",
        'method': {
          'completion': 'gptReaderSidePane_sendByGemini',
          'chat': "gptReaderSidePane_ChatMode_sendByGemini"
        },
        'thinkingBudget': Zotero.Prefs.get("ai4paper.geminiThinkingBudget"),
        'modelLabel': 'gemini'
      },
      'Claude': {
        'api_key': Zotero.Prefs.get('ai4paper.claudeAPI').trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.claudeverifyresult"),
        'request_url': "https://api.anthropic.com/v1/messages",
        'errorCode_link': "https://docs.anthropic.com/en/api/errors",
        'method': {
          'completion': "gptReaderSidePane_sendByClaude",
          'chat': "gptReaderSidePane_ChatMode_sendByClaude"
        },
        'modelLabel': "claude"
      }
    };
  },
  'gptModelList': ["gpt-5.2", 'gpt-5.1', "gpt-5.1-chat-latest", "gpt-5", "gpt-5-mini", 'gpt-5-nano', "gpt-5-chat-latest", "gpt-4.1", "gpt-4.1-mini", 'gpt-4.1-nano', "gpt-4o", "gpt-4o-2024-11-20", "gpt-4o-2024-05-13", 'gpt-4o-2024-08-06', "gpt-4o-search-preview", "gpt-4o-mini", "gpt-4o-mini-2024-07-18", "gpt-4o-mini-search-preview", 'o1', "o1-preview", "o1-preview-2024-09-12", "o1-mini", "o1-mini-2024-09-12", 'o3', "o3-mini", 'o3-mini-2025-01-31', "o4-mini", 'gpt-4-turbo', 'gpt-4-turbo-2024-04-09', "gpt-4-turbo-preview", "gpt-4-0125-preview", 'gpt-4-1106-preview', "gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-0125", "gpt-3.5-turbo-1106", "gpt-3.5-turbo-instruct", "qwq-plus", "qwq-plus-latest", "qwen-max", "qwen-max-latest", "qwen-plus", 'qwen-plus-latest', 'qwen-turbo', "qwen-turbo-latest", 'qwen-long', 'qwen-long-latest', "qwen-math-plus", "qwen-math-turbo", "qwen3-coder-plus", 'qwen-coder-plus', "qwen-coder-turbo", 'qwen3-235b-a22b-thinking-2507', 'qwen3-235b-a22b-instruct-2507', "qwen3-coder-480b-a35b-instruct", "qwen2.5-math-72b-instruct", 'qwen/Moonshot-Kimi-K2-Instruct', "qwen/deepseek-v3.2-exp", "qwen/deepseek-v3.1", "qwen/deepseek-v3", 'qwen/deepseek-r1', "ernie-x1-turbo-32k", "ernie-x1-32k-preview", 'ernie-x1-32k', "ernie-5.0-thinking-preview", "ernie-4.5-turbo-128k", 'ernie-4.5-turbo-32k', "ernie-4.5-8k-preview", "ernie-4.0-8k", "ernie-4.0-turbo-8k", "ernie-4.0-turbo-128k", "ernie-3.5-8k", 'ernie-3.5-128k', "ernie-speed-pro-128k", 'ernie-lite-pro-128k', "ernie/deepseek-v3.2-think", "ernie/deepseek-v3.2", 'ernie/deepseek-r1', "glm-5", "glm-4.7", 'glm-4.7-thinking', 'glm-4.7-flash', 'glm-4.7-flashx', "glm-4.6", 'glm-4.6-thinking', "glm-4.5", 'glm-4.5-air', 'glm-4.5-x', "glm-4.5-airx", "glm-4.5-flash", "glm-4-plus", "glm-4-air-250414", "glm-4-airx", "glm-4-flashx", 'glm-4-flashx-250414', "glm-z1-air", "glm-z1-airx", 'glm-z1-flash', 'glm-z1-flashx', 'yi-lightning', "yi-large", "yi-medium", "yi-medium-200k", 'yi-spark', "yi-large-rag", 'yi-large-fc', "yi-large-turbo", "zjuchat/deepseek-r1-671b", "zjuchat/deepseek-v3", "doubao/glm-4-7-251222", "doubao/kimi-k2-thinking-251104", "doubao/deepseek-v3-2-251201", "doubao/deepseek-v3-1-terminus", "doubao/deepseek-v3-250324", "doubao/deepseek-r1-250528", "doubao-seed-1-8-251228", "doubao-seed-1-6-251015", "doubao-seed-1-6-thinking-250715", 'doubao-seed-1-6-flash-250828', "doubao-seed-1-6-lite-251015", 'doubao-seed-code-preview-251028', "doubao-1-5-pro-32k-250115", "doubao-1-5-pro-256k-250115", "doubao-1-5-lite-32k-250115", 'doubao-1-5-thinking-pro-250415', "doubao-1-5-vision-pro-32k-250115", "kimi-latest", "kimi-k2.5", "kimi-k2-0905-preview", "kimi-k2-0711-preview", "kimi-k2-turbo-preview", "kimi-k2-thinking", "kimi-k2-thinking-turbo", "moonshot-v1-128k", "moonshot-v1-32k", "moonshot-v1-8k", "moonshot-v1-auto", "deepseek-chat", 'deepseek-reasoner', 'minimax-m2.1', "grok-4", "grok-3", 'grok-3-mini', "gemini-3.1-pro-preview", "gemini-3-pro-preview", "gemini-3-flash-preview", "gemini-2.5-pro", "gemini-2.5-flash", 'gemini-2.5-flash-lite', "gemini-2.0-flash", "gemini-2.0-flash-lite", 'claude-opus-4-6', "claude-opus-4-6-thinking", "claude-opus-4-5-20251101", "claude-opus-4-5-20251101-thinking", "claude-sonnet-4-5-20250929", 'claude-sonnet-4-5-20250929-thinking', "claude-haiku-4-5-20251001", "claude-haiku-4-5-20251001-thinking", 'claude-opus-4-1-20250805', "claude-opus-4-1-20250805-thinking", "claude-opus-4-20250514", "claude-opus-4-20250514-thinking", "claude-sonnet-4-20250514", "claude-sonnet-4-20250514-thinking"],
  'translationServiceList': function () {
    return {
      '腾讯🔑': {
        'secret_id': Zotero.Prefs.get('ai4paper.tencentSecretId').trim(),
        'secret_key': Zotero.Prefs.get("ai4paper.tencentSecretKey").trim(),
        'api_verifyResult': Zotero.Prefs.get('ai4paper.tencentVerifyResult'),
        'name': 'tencent',
        'method': {
          'transbyShortCuts': "tencent_transbyShortCuts",
          'transSelectedText': 'tencent_transSelectedText',
          'transAnnotation': "tencent_transAnnotation",
          'transVocabulary': 'tencent_transVocabulary',
          'transField': "tencent_transField"
        },
        'errorCode_link': "https://cloud.tencent.com/document/product/551/30637"
      },
      '阿里🔑': {
        'secret_id': Zotero.Prefs.get("ai4paper.alibabaAccessKeyId").trim(),
        'secret_key': Zotero.Prefs.get('ai4paper.alibabaAccessKeySecret').trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.alibabaVerifyResult"),
        'name': "alibaba",
        'method': {
          'transbyShortCuts': "alibaba_transbyShortCuts",
          'transSelectedText': "alibaba_transSelectedText",
          'transAnnotation': "alibaba_transAnnotation",
          'transVocabulary': "alibaba_transVocabulary",
          'transField': "alibaba_transField"
        },
        'errorCode_link': "https://help.aliyun.com/zh/machine-translation/support/faq-1"
      },
      '百度🔑': {
        'app_id': Zotero.Prefs.get("ai4paper.baidufanyiappidinput").trim(),
        'app_key': Zotero.Prefs.get("ai4paper.baidufanyiappkeyinput").trim(),
        'api_key': Zotero.Prefs.get("ai4paper.baiduLLMApiKey").trim(),
        'enabelTerminologyDatabase': Zotero.Prefs.get("ai4paper.enableBaidufanyiTerminologyDatabase"),
        'field': Zotero.Prefs.get("ai4paper.baidufanyiField"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.baidufanyiverifyresult"),
        'name': "baidu",
        'method': {
          'transbyShortCuts': 'baidu_transbyShortCuts',
          'transSelectedText': "baidu_transSelectedText",
          'transAnnotation': "baidu_transAnnotation",
          'transVocabulary': "baidu_transVocabulary",
          'transField': "baidu_transField"
        },
        'errorCode_link': "https://fanyi-api.baidu.com/doc/28"
      },
      '百度垂直🔑': {
        'app_id': Zotero.Prefs.get("ai4paper.baidufanyiappidinput").trim(),
        'app_key': Zotero.Prefs.get('ai4paper.baidufanyiappkeyinput').trim(),
        'api_key': Zotero.Prefs.get("ai4paper.baiduLLMApiKey").trim(),
        'enabelTerminologyDatabase': Zotero.Prefs.get("ai4paper.enableBaidufanyiTerminologyDatabase"),
        'field': Zotero.Prefs.get("ai4paper.baidufanyiField"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.baidufanyiverifyresult"),
        'name': "baiduField",
        'method': {
          'transbyShortCuts': "baiduField_transbyShortCuts",
          'transSelectedText': "baidu_transSelectedText",
          'transAnnotation': 'baidu_transAnnotation',
          'transVocabulary': "baidu_transVocabulary",
          'transField': "baidu_transField"
        },
        'errorCode_link': "https://fanyi-api.baidu.com/doc/28"
      },
      '百度大模型🔑': {
        'app_id': Zotero.Prefs.get('ai4paper.baidufanyiappidinput').trim(),
        'app_key': Zotero.Prefs.get("ai4paper.baidufanyiappkeyinput").trim(),
        'api_key': Zotero.Prefs.get("ai4paper.baiduLLMApiKey").trim(),
        'enabelTerminologyDatabase': Zotero.Prefs.get("ai4paper.enableBaidufanyiTerminologyDatabase"),
        'field': Zotero.Prefs.get("ai4paper.baidufanyiField"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.baidufanyiverifyresult"),
        'name': "baiduLLM",
        'method': {
          'transbyShortCuts': 'baiduLLM_transbyShortCuts',
          'transSelectedText': "baidu_transSelectedText",
          'transAnnotation': "baidu_transAnnotation",
          'transVocabulary': "baidu_transVocabulary",
          'transField': "baidu_transField"
        },
        'errorCode_link': "https://fanyi-api.baidu.com/doc/28"
      },
      '有道智云🔑': {
        'app_id': Zotero.Prefs.get('ai4paper.youdaoAppID').trim(),
        'app_key': Zotero.Prefs.get("ai4paper.youdaoAppKey").trim(),
        'domain': Zotero.Prefs.get("ai4paper.youdaoField"),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.youdaoVerifyResult"),
        'name': 'youdao',
        'method': {
          'transbyShortCuts': "youdao_transbyShortCuts",
          'transSelectedText': 'youdao_transSelectedText',
          'transAnnotation': "youdao_transAnnotation",
          'transVocabulary': "youdao_transVocabulary",
          'transField': "youdao_transField"
        },
        'errorCode_link': "https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html"
      },
      '火山🔑': {
        'secret_id': Zotero.Prefs.get("ai4paper.volcanoAccessKeyId").trim(),
        'secret_key': Zotero.Prefs.get("ai4paper.volcanoAccessKeySecret").trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.volcanoVerifyResult"),
        'name': "volcano",
        'method': {
          'transbyShortCuts': 'volcano_transbyShortCuts',
          'transSelectedText': "volcano_transSelectedText",
          'transAnnotation': 'volcano_transAnnotation',
          'transVocabulary': "volcano_transVocabulary",
          'transField': "volcano_transField"
        },
        'errorCode_link': "https://www.volcengine.com/docs/4640/65080?lang=zh"
      },
      '小牛🔑': {
        'api_key': Zotero.Prefs.get("ai4paper.niutransapikeyinput").trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.niutransverifyresult"),
        'name': "niutrans",
        'method': {
          'transbyShortCuts': 'niutrans_transbyShortCuts',
          'transSelectedText': "niutrans_transSelectedText",
          'transAnnotation': 'niutrans_transAnnotation',
          'transVocabulary': 'niutrans_transVocabulary',
          'transField': "niutrans_transField"
        },
        'errorCode_link': "https://niutrans.com/documents/contents/trans_text#accessMode"
      },
      '彩云小译🔑': {
        'api_key': Zotero.Prefs.get("ai4paper.caiyunxiaoyitokeninput").trim(),
        'api_verifyResult': Zotero.Prefs.get('ai4paper.caiyunxiaoyiverifyresult'),
        'name': "caiyunxiaoyi",
        'method': {
          'transbyShortCuts': "caiyunxiaoyi_transbyShortCuts",
          'transSelectedText': "caiyunxiaoyi_transSelectedText",
          'transAnnotation': "caiyunxiaoyi_transAnnotation",
          'transVocabulary': 'caiyunxiaoyi_transVocabulary',
          'transField': "caiyunxiaoyi_transField"
        },
        'errorCode_link': "https://docs.caiyunapp.com/lingocloud-api/"
      },
      'GPT🔑': {
        'OpenAI': {
          'method': {
            'transbyShortCuts': "openAI_transbyShortCuts",
            'transSelectedText': "openAI_transSelectedText",
            'transAnnotation': "openAI_transAnnotation",
            'transVocabulary': "openAI_transVocabulary",
            'transField': "openAI_transField"
          }
        },
        'API2D': {
          'method': {
            'transbyShortCuts': "api2d_transbyShortCuts",
            'transSelectedText': 'api2d_transSelectedText',
            'transAnnotation': 'api2d_transAnnotation',
            'transVocabulary': 'api2d_transVocabulary',
            'transField': "api2d_transField"
          }
        },
        'ChatAnywhere': {
          'method': {
            'transbyShortCuts': "chatAnywhere_transbyShortCuts",
            'transSelectedText': "chatAnywhere_transSelectedText",
            'transAnnotation': 'chatAnywhere_transAnnotation',
            'transVocabulary': 'chatAnywhere_transVocabulary',
            'transField': "chatAnywhere_transField"
          }
        },
        'GPT\x20自定\x20①': {
          'method': {
            'transbyShortCuts': "gptCustom_transbyShortCuts",
            'transSelectedText': "gptCustom_transSelectedText",
            'transAnnotation': "gptCustom_transAnnotation",
            'transVocabulary': "gptCustom_transVocabulary",
            'transField': "gptCustom_transField"
          }
        },
        'GPT\x20自定\x20②': {
          'method': {
            'transbyShortCuts': 'gptCustom_transbyShortCuts',
            'transSelectedText': "gptCustom_transSelectedText",
            'transAnnotation': "gptCustom_transAnnotation",
            'transVocabulary': "gptCustom_transVocabulary",
            'transField': "gptCustom_transField"
          }
        },
        'GPT\x20自定\x20③': {
          'method': {
            'transbyShortCuts': 'gptCustom_transbyShortCuts',
            'transSelectedText': "gptCustom_transSelectedText",
            'transAnnotation': "gptCustom_transAnnotation",
            'transVocabulary': "gptCustom_transVocabulary",
            'transField': "gptCustom_transField"
          }
        },
        'GPT\x20自定\x20④': {
          'method': {
            'transbyShortCuts': "gptCustom_transbyShortCuts",
            'transSelectedText': "gptCustom_transSelectedText",
            'transAnnotation': "gptCustom_transAnnotation",
            'transVocabulary': "gptCustom_transVocabulary",
            'transField': "gptCustom_transField"
          }
        },
        'GPT\x20自定\x20⑤': {
          'method': {
            'transbyShortCuts': "gptCustom_transbyShortCuts",
            'transSelectedText': 'gptCustom_transSelectedText',
            'transAnnotation': "gptCustom_transAnnotation",
            'transVocabulary': "gptCustom_transVocabulary",
            'transField': 'gptCustom_transField'
          }
        },
        'GPT\x20自定\x20⑥': {
          'method': {
            'transbyShortCuts': 'gptCustom_transbyShortCuts',
            'transSelectedText': "gptCustom_transSelectedText",
            'transAnnotation': 'gptCustom_transAnnotation',
            'transVocabulary': "gptCustom_transVocabulary",
            'transField': "gptCustom_transField"
          }
        },
        '通义千问': {
          'method': {
            'transbyShortCuts': "qwen_transbyShortCuts",
            'transSelectedText': 'qwen_transSelectedText',
            'transAnnotation': 'qwen_transAnnotation',
            'transVocabulary': "qwen_transVocabulary",
            'transField': "qwen_transField"
          }
        },
        '文心一言': {
          'method': {
            'transbyShortCuts': "wenxin_transbyShortCuts",
            'transSelectedText': 'wenxin_transSelectedText',
            'transAnnotation': "wenxin_transAnnotation",
            'transVocabulary': 'wenxin_transVocabulary',
            'transField': "wenxin_transField"
          }
        },
        '智普清言': {
          'method': {
            'transbyShortCuts': "glm_transbyShortCuts",
            'transSelectedText': 'glm_transSelectedText',
            'transAnnotation': "glm_transAnnotation",
            'transVocabulary': 'glm_transVocabulary',
            'transField': "glm_transField"
          }
        },
        '零一万物': {
          'method': {
            'transbyShortCuts': "yi_transbyShortCuts",
            'transSelectedText': "yi_transSelectedText",
            'transAnnotation': "yi_transAnnotation",
            'transVocabulary': "yi_transVocabulary",
            'transField': "yi_transField"
          }
        },
        '浙大先生': {
          'method': {
            'transbyShortCuts': 'zjuchat_transbyShortCuts',
            'transSelectedText': 'zjuchat_transSelectedText',
            'transAnnotation': "zjuchat_transAnnotation",
            'transVocabulary': "zjuchat_transVocabulary",
            'transField': 'zjuchat_transField'
          }
        },
        '火山联网搜索': {
          'method': {
            'transbyShortCuts': "volcanoSearch_transbyShortCuts",
            'transSelectedText': "volcanoSearch_transSelectedText",
            'transAnnotation': "volcanoSearch_transAnnotation",
            'transVocabulary': "volcanoSearch_transVocabulary",
            'transField': "volcanoSearch_transField"
          }
        },
        '火山引擎': {
          'method': {
            'transbyShortCuts': "volcanoEngine_transbyShortCuts",
            'transSelectedText': "volcanoEngine_transSelectedText",
            'transAnnotation': "volcanoEngine_transAnnotation",
            'transVocabulary': "volcanoEngine_transVocabulary",
            'transField': "volcanoEngine_transField"
          }
        },
        '豆包': {
          'method': {
            'transbyShortCuts': "doubao_transbyShortCuts",
            'transSelectedText': "doubao_transSelectedText",
            'transAnnotation': "doubao_transAnnotation",
            'transVocabulary': 'doubao_transVocabulary',
            'transField': "doubao_transField"
          }
        },
        'Kimi': {
          'method': {
            'transbyShortCuts': 'kimi_transbyShortCuts',
            'transSelectedText': 'kimi_transSelectedText',
            'transAnnotation': "kimi_transAnnotation",
            'transVocabulary': "kimi_transVocabulary",
            'transField': "kimi_transField"
          }
        },
        'DeepSeek': {
          'method': {
            'transbyShortCuts': "deepSeek_transbyShortCuts",
            'transSelectedText': 'deepSeek_transSelectedText',
            'transAnnotation': "deepSeek_transAnnotation",
            'transVocabulary': "deepSeek_transVocabulary",
            'transField': "deepSeek_transField"
          }
        },
        'Gemini': {
          'method': {
            'transbyShortCuts': "gemini_transbyShortCuts",
            'transSelectedText': 'gemini_transSelectedText',
            'transAnnotation': "gemini_transAnnotation",
            'transVocabulary': 'gemini_transVocabulary',
            'transField': "gemini_transField"
          }
        },
        'Claude': {
          'method': {
            'transbyShortCuts': "claude_transbyShortCuts",
            'transSelectedText': "claude_transSelectedText",
            'transAnnotation': "claude_transAnnotation",
            'transVocabulary': "claude_transVocabulary",
            'transField': "claude_transField"
          }
        }
      },
      'DeepL🔑': {
        'api_key': Zotero.Prefs.get("ai4paper.deeplapiinput").trim(),
        'plan': Zotero.Prefs.get("ai4paper.deeplplan"),
        'api_verifyResult': Zotero.Prefs.get('ai4paper.deeplverifyresult'),
        'name': "deepl",
        'method': {
          'transbyShortCuts': "deepl_transbyShortCuts",
          'transSelectedText': 'deepl_transSelectedText',
          'transAnnotation': "deepl_transAnnotation",
          'transVocabulary': "deepl_transVocabulary",
          'transField': 'deepl_transField'
        },
        'errorCode_link': "https://support.deepl.com/hc/zh-cn/articles/9773964275868-DeepL-API-错误信息"
      },
      'DeepLX🔑': {
        'request_url': Zotero.Prefs.get('ai4paper.deeplxurl').trim(),
        'api_verifyResult': Zotero.Prefs.get("ai4paper.deeplxverifyresult"),
        'name': "deeplx",
        'method': {
          'transbyShortCuts': "deeplx_transbyShortCuts",
          'transSelectedText': "deeplx_transSelectedText",
          'transAnnotation': "deeplx_transAnnotation",
          'transVocabulary': "deeplx_transVocabulary",
          'transField': "deeplx_transField"
        },
        'errorCode_link': "https://support.deepl.com/hc/zh-cn/articles/9773964275868-DeepL-API-错误信息"
      },
      '腾讯交互🆓': {
        'name': "tencentSmart",
        'method': {
          'transbyShortCuts': "tencentSmart_transbyShortCuts",
          'transSelectedText': 'tencentSmart_transSelectedText',
          'transAnnotation': "tencentSmart_transAnnotation",
          'transVocabulary': 'tencentSmart_transVocabulary',
          'transField': 'tencentSmart_transField'
        },
        'errorCode_link': "[暂无]"
      },
      '火山🆓': {
        'name': 'volcanoFree',
        'method': {
          'transbyShortCuts': "volcanoFree_transbyShortCuts",
          'transSelectedText': "volcanoFree_transSelectedText",
          'transAnnotation': "volcanoFree_transAnnotation",
          'transVocabulary': "volcanoFree_transVocabulary",
          'transField': "volcanoFree_transField"
        },
        'errorCode_link': "[暂无]"
      },
      '彩云小译🆓': {
        'name': 'caiyunxiaoyiFree',
        'method': {
          'transbyShortCuts': "caiyunxiaoyiFree_transbyShortCuts",
          'transSelectedText': 'caiyunxiaoyiFree_transSelectedText',
          'transAnnotation': "caiyunxiaoyiFree_transAnnotation",
          'transVocabulary': 'caiyunxiaoyiFree_transVocabulary',
          'transField': "caiyunxiaoyiFree_transField"
        },
        'errorCode_link': "[暂无]"
      },
      '谷歌🆓': {
        'name': "googleFree",
        'method': {
          'transbyShortCuts': 'googleFree_transbyShortCuts',
          'transSelectedText': "googleFree_transSelectedText",
          'transAnnotation': "googleFree_transAnnotation",
          'transVocabulary': "googleFree_transVocabulary",
          'transField': 'googleFree_transField'
        },
        'errorCode_link': '[暂无]'
      }
    };
  },
  'qwenModelsNotForOnlineSearch': ["qwen-math-plus", "qwen-math-turbo", "qwen3-coder-plus", "qwen-coder-plus", "qwen-coder-turbo", "qwen3-235b-a22b-thinking-2507", "qwen3-235b-a22b-instruct-2507", 'qwen3-coder-480b-a35b-instruct', "qwen2.5-math-72b-instruct", "Moonshot-Kimi-K2-Instruct", "deepseek-v3", "deepseek-r1"],
  'geminiThinkingModels': {
    'non_adjustable': ["gemini-3-pro-preview", "gemini-2.5-pro"],
    'adjustable': ["gemini-2.5-flash", "gemini-2.5-flash-lite"]
  },
  'gptCustom_suffix': {
    0x1: '',
    0x2: "2nd",
    0x3: "3rd",
    0x4: '4th',
    0x5: "5th",
    0x6: '6th'
  },
  'gptCustom_numEmoji': {
    0x1: '①',
    0x2: '②',
    0x3: '③',
    0x4: '④',
    0x5: '⑤',
    0x6: '⑥'
  },
  'getRequestParameters_SemanticScholar': function (param1) {
    let var1 = {
      'Content-Type': "application/json"
    };
    if (!Zotero.Prefs.get("ai4paper.semanticscholarAPIOnly4RetrieveCitingRefs") || Zotero.Prefs.get("ai4paper.semanticscholarAPIOnly4RetrieveCitingRefs") && param1) {
      if (Zotero.Prefs.get("ai4paper.semanticscholarAPIKeyEnable") && Zotero.Prefs.get("ai4paper.semanticscholarAPIKey").trim()) {
        var1["x-api-key"] = Zotero.Prefs.get("ai4paper.semanticscholarAPIKey").trim();
      }
      return {
        'host': Zotero.Prefs.get("ai4paper.semanticscholarHost").trim() || "https://api.semanticscholar.org",
        'headers': var1
      };
    }
    return {
      'host': "https://api.semanticscholar.org",
      'headers': var1
    };
  },
});
