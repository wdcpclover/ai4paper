// AI4Paper Translation Engines Module - All translation engine implementations and handlers
Object.assign(Zotero.AI4Paper, {
  'tencent_Helper': {
    'serviceName': "腾讯🔑",
    'config': {
      'host': "tmt.tencentcloudapi.com",
      'region': "ap-beijing",
      'projectId': '0',
      'version': "2018-03-21",
      'action': "TextTranslate",
      'source': "auto",
      'target': 'zh'
    },
    'getCredentials': function () {
      const serviceList = Zotero.AI4Paper.translationServiceList();
      if (!serviceList[this.serviceName]) return null;
      return {
        'secretId': serviceList[this.serviceName].secret_id,
        'secretKey': serviceList[this.serviceName].secret_key,
        'verifyResult': serviceList[this.serviceName].api_verifyResult,
        'errorCodeLink': serviceList[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': async function (secretId, secretKey, sourceText) {
      const {
          host: host,
          region: region,
          projectId: projectId,
          version: version,
          action: action,
          source: source,
          target: target
        } = this.config,
        timestamp = new Date().getTime().toString().substring(0x0, 0xa),
        nonce = "9744",
        queryString = "Action=" + action + "&Language=zh-CN&Nonce=" + nonce + '&ProjectId=' + projectId + "&Region=" + region + "&SecretId=" + secretId + "&Source=" + source + "&SourceText=#$#&Target=" + target + "&Timestamp=" + timestamp + "&Version=" + version,
        signSource = 'POST' + host + '/?' + queryString.replace("#$#", sourceText),
        hmacDigest = await Zotero.AI4Paper.hmacSha1Digest(signSource, secretKey),
        signBase64 = Zotero.AI4Paper.base64(hmacDigest),
        encodedSign = Zotero.AI4Paper.encodeRFC5987ValueChars(signBase64),
        encodedText = Zotero.AI4Paper.encodeRFC5987ValueChars(sourceText),
        requestBody = queryString.replace("#$#", encodedText) + "&Signature=" + encodedSign;
      return {
        'url': 'https://' + host,
        'headers': {
          'Content-Type': "application/json"
        },
        'body': requestBody
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = 'noAlert', isVerifyMode = false) {
      const credentials = this.getCredentials();
      if ((!credentials.secretId || !credentials.secretKey) && isVerifyMode) {
        return window.alert('❌【' + this.serviceName + "】：请先输入 SecretId 和 SecretKey！"), -0x1;
      }
      if (!isVerifyMode && credentials.verifyResult !== "验证成功") {
        if (errorMode === this.serviceName) {
          Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！");
        }
        return -0x1;
      }
      const requestData = await this.prepareRequest(credentials.secretId, credentials.secretKey, sourceText);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", requestData.url, {
          'headers': requestData.headers,
          'body': requestData.body,
          'responseType': "json"
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.Response && responseBody.Response.Error) {
            const errorCode = responseBody.Response.Error.Code,
              errorMessage = responseBody.Response.Error.Message,
              errorLink = "\n\n👉 常见错误码含义见：" + credentials.errorCodeLink;
            if (isVerifyMode) {
              throw new Error(errorCode + ':\x20' + errorMessage + errorLink);
            } else errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦：" + errorCode + ':\x20' + errorMessage + errorLink);
            return;
          }
          responseBody.Response && responseBody.Response.TargetText && onSuccess(responseBody.Response.TargetText);
        }
      }, errorMode);
    }
  },
  'tencent_verifyAPI': async function (doc) {
    const testText = "hello";
    return await Zotero.AI4Paper.tencent_Helper.requestTranslation(testText, translatedText => {
      Zotero.AI4Paper.apiModule_updateButtons("tencentVerifyResult", "tencent", doc, true);
    }, "alert", true);
  },
  'tencent_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.tencent_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.tencent_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.tencent_Helper.serviceName);
  },
  'tencent_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.tencent_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.tencent_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.tencent_Helper.serviceName);
  },
  'tencent_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.tencent_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, "noAlert");
  },
  'tencent_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.tencent_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, "【收藏生词】- " + Zotero.AI4Paper.tencent_Helper.serviceName);
    }, "noAlert");
  },
  'tencent_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.tencent_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, "noAlert");
  },
  'alibaba_Helper': {
    'serviceName': "阿里🔑",
    'config': {
      'url': 'https://mt.aliyuncs.com/',
      'action': "TranslateGeneral",
      'format': "JSON",
      'formatType': "text",
      'sigMethod': "HMAC-SHA1",
      'sigVersion': '1.0',
      'sourceLang': "auto",
      'targetLang': 'zh',
      'version': "2018-10-12"
    },
    'getCredentials': function () {
      const serviceList = Zotero.AI4Paper.translationServiceList();
      if (!serviceList[this.serviceName]) return null;
      return {
        'ak': serviceList[this.serviceName].secret_id,
        'sk': serviceList[this.serviceName].secret_key,
        'verifyResult': serviceList[this.serviceName].api_verifyResult,
        'errorCodeLink': serviceList[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': async function (accessKeyId, accessKeySecret, sourceText) {
      const config = this.config,
        isoTimestamp = new Date().toISOString(),
        signatureNonce = Zotero.AI4Paper.randomString(0xc),
        encodedText = Zotero.AI4Paper.encodeRFC3986URIComponent(sourceText),
        queryString = 'AccessKeyId=' + accessKeyId + '&Action=' + config.action + '&Format=' + config.format + "&FormatType=" + config.formatType + '&SignatureMethod=' + config.sigMethod + '&SignatureNonce=' + encodeURIComponent(signatureNonce) + "&SignatureVersion=" + config.sigVersion + "&SourceLanguage=" + config.sourceLang + '&SourceText=' + encodedText + "&TargetLanguage=" + config.targetLang + "&Timestamp=" + encodeURIComponent(isoTimestamp) + '&Version=' + config.version,
        stringToSign = "POST&%2F&" + encodeURIComponent(queryString),
        hmacDigest = await Zotero.AI4Paper.hmacSha1Digest(stringToSign, accessKeySecret + '&'),
        signBase64 = Zotero.AI4Paper.base64(hmacDigest);
      return {
        'url': config.url,
        'headers': {
          'Content-Type': "application/x-www-form-urlencoded"
        },
        'body': queryString + "&Signature=" + encodeURIComponent(signBase64)
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = "noAlert", isVerifyMode = false) {
      const credentials = this.getCredentials();
      if ((!credentials.ak || !credentials.sk) && isVerifyMode) return window.alert('❌【' + this.serviceName + "】：请先输入 AccessKeyId 和 AccessKeySecret！"), -0x1;
      if (!isVerifyMode && credentials.verifyResult !== "验证成功") return errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      const requestData = await this.prepareRequest(credentials.ak, credentials.sk, sourceText);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request('POST', requestData.url, {
          'headers': requestData.headers,
          'body': requestData.body,
          'responseType': "json"
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.Code && responseBody.Code !== "200") {
            const errorCode = responseBody.Code,
              errorMessage = responseBody.Message,
              errorLink = "\n\n👉 常见错误码含义见：" + credentials.errorCodeLink;
            if (isVerifyMode) throw new Error(errorCode + ':\x20' + errorMessage + errorLink);else errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦：" + errorCode + ':\x20' + errorMessage + errorLink);
            return;
          }
          responseBody.Data && responseBody.Data.Translated && onSuccess(responseBody.Data.Translated);
        }
      }, errorMode);
    }
  },
  'alibaba_verifyAPI': async function (doc) {
    const testText = "Hello";
    return await Zotero.AI4Paper.alibaba_Helper.requestTranslation(testText, translatedText => {
      Zotero.AI4Paper.apiModule_updateButtons("alibabaVerifyResult", "alibaba", doc, true);
    }, "alert", true);
  },
  'alibaba_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.alibaba_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.alibaba_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.alibaba_Helper.serviceName);
  },
  'alibaba_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.alibaba_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.alibaba_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.alibaba_Helper.serviceName);
  },
  'alibaba_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.alibaba_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, "noAlert");
  },
  'alibaba_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.alibaba_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, "【收藏生词】- " + Zotero.AI4Paper.alibaba_Helper.serviceName);
    }, 'noAlert');
  },
  'alibaba_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.alibaba_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, "noAlert");
  },
  'baidu_Helper': {
    'endpoints': {
      'standard': 'https://fanyi-api.baidu.com/api/trans/vip/translate',
      'field': "http://api.fanyi.baidu.com/api/trans/vip/fieldtranslate",
      'llm': "https://fanyi-api.baidu.com/ait/api/aiTextTranslate"
    },
    'getCredentials': function (serviceName) {
      const serviceConfig = Zotero.AI4Paper.translationServiceList()[serviceName];
      return {
        'appid': serviceConfig.app_id,
        'appkey': serviceConfig.app_key,
        'apikey': serviceConfig.api_key,
        'domain': serviceConfig.field,
        'terminology': serviceConfig.enabelTerminologyDatabase,
        'verifyResult': serviceConfig.api_verifyResult,
        'errorCodeLink': serviceConfig.errorCode_link
      };
    },
    'buildRequestUrl': function (sourceText, credentials, serviceName) {
      const salt = new Date().getTime(),
        sourceLang = "auto",
        targetLang = 'zh';
      let sign, endpoint;
      if (serviceName === "百度垂直🔑") {
        sign = Zotero.Utilities.Internal.md5('' + credentials.appid + sourceText + salt + credentials.domain + credentials.appkey);
        endpoint = this.endpoints.field;
      } else {
        sign = Zotero.Utilities.Internal.md5('' + credentials.appid + sourceText + salt + credentials.appkey);
        endpoint = serviceName === "百度🔑" ? this.endpoints.standard : this.endpoints.llm;
      }
      let queryString = 'q=' + encodeURIComponent(sourceText) + "&from=" + sourceLang + "&to=" + targetLang + "&appid=" + credentials.appid + "&salt=" + salt + "&sign=" + sign;
      if (serviceName === "百度垂直🔑") {
        queryString += "&domain=" + credentials.domain;
      }
      return credentials.terminology ? queryString += "&needIntervene=1" : queryString += "&needIntervene=0", endpoint + '?' + queryString;
    },
    'requestTranslation': async function (sourceText, onSuccess, options = {}) {
      const {
          serviceName = "百度🔑",
          alertType = "noAlert",
          isVerify = false
        } = options,
        credentials = this.getCredentials(serviceName);
      if ((!credentials.appid || !credentials.appkey) && isVerify) return window.alert('❌【' + serviceName + "】：请先输入 AppID 和 AppKey！"), -0x1;
      if (!isVerify && serviceName === "百度大模型🔑" && (!credentials.appid || !credentials.appkey || !credentials.apikey)) return Zotero.AI4Paper.translateReaderSidePane_showErrorMessage('❌【' + serviceName + "】：请先前往【Zotero 设置 --> AI4paper --> 翻译 API】输入 AppID、AppKey、以及 API-Key！"), -0x1;
      if (!isVerify && credentials.verifyResult !== "验证成功") return alertType === serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      const requestUrl = this.buildRequestUrl(sourceText, credentials, serviceName);
      let headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      if (serviceName === "百度大模型🔑") {
        headers.Authorization = "Bearer " + credentials.apikey;
      }
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", requestUrl, {
          'headers': headers,
          'responseType': "json"
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.error_code && responseBody.error_code !== "52000") {
            const errorInfo = responseBody.error_code + ':\x20' + responseBody.error_msg,
              errorLink = "\n\n👉 常见错误码含义见：" + credentials.errorCodeLink;
            if (isVerify) throw new Error('' + errorInfo + errorLink);else Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + serviceName + "】出错啦：" + errorInfo + errorLink);
            return;
          }
          if (responseBody.trans_result) {
            let translatedText = '';
            for (let i = 0x0; i < responseBody.trans_result.length; i++) {
              translatedText += responseBody.trans_result[i].dst;
            }
            onSuccess(translatedText);
          }
        }
      }, alertType);
    }
  },
  'baidu_verifyAPI': async function (doc) {
    let serviceName = "百度🔑";
    const testText = 'hello';
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(testText, translatedText => {
      Zotero.AI4Paper.apiModule_updateButtons('baidufanyiverifyresult', 'baidufanyi', doc, true);
    }, {
      'serviceName': serviceName,
      'alertType': "alert",
      'isVerify': true
    });
  },
  'baidu_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "百度🔑";
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(serviceName, sourceText, translatedText);
    }, {
      'serviceName': serviceName,
      'alertType': serviceName
    });
  },
  'baiduField_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = '百度垂直🔑';
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(serviceName, sourceText, translatedText);
    }, {
      'serviceName': serviceName,
      'alertType': serviceName
    });
  },
  'baiduLLM_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let serviceName = "百度大模型🔑";
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(serviceName, sourceText, translatedText);
    }, {
      'serviceName': serviceName,
      'alertType': serviceName
    });
  },
  'baidu_transSelectedText': async function (sourceText, serviceName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(serviceName, sourceText, translatedText);
    }, {
      'serviceName': serviceName,
      'alertType': serviceName
    });
  },
  'baidu_transAnnotation': async function (annotation, item, serviceName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, {
      'serviceName': serviceName,
      'alertType': "noAlert"
    });
  },
  'baidu_transVocabulary': async function (annotation, word, serviceName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.baidu_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, '【收藏生词】-\x20' + serviceName);
    }, {
      'serviceName': serviceName,
      'alertType': 'noAlert'
    });
  },
  'baidu_transField': async function (item, fieldName, serviceName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, {
      'serviceName': serviceName,
      'alertType': "noAlert"
    });
  },
  'youdao_Helper': {
    'serviceName': "有道智云🔑",
    'config': {
      'domain': "general",
      'version': 'v3',
      'from': "auto",
      'to': "zh-CHS",
      'url': "https://openapi.youdao.com/api"
    },
    'getCredentials': function () {
      const serviceList = Zotero.AI4Paper.translationServiceList();
      if (!serviceList[this.serviceName]) return null;
      return {
        'appId': serviceList[this.serviceName].app_id,
        'appKey': serviceList[this.serviceName].app_key,
        'verifyResult': serviceList[this.serviceName].api_verifyResult,
        'errorCodeLink': serviceList[this.serviceName].errorCode_link
      };
    },
    'truncate': function (text) {
      const len = text.length;
      if (len <= 0x14) return text;
      return text.substring(0x0, 0xa) + len + text.substring(len - 0xa, len);
    },
    'prepareRequest': function (appId, appKey, sourceText) {
      const config = this.config,
        salt = new Date().getTime(),
        curtime = Math.round(new Date().getTime() / 0x3e8),
        signInput = '' + appId + this.truncate(sourceText) + salt + curtime + appKey,
        sign = Zotero.AI4Paper._CryptoJS.SHA256(signInput).toString(Zotero.AI4Paper._CryptoJS.enc.Hex),
        requestUrl = config.url + "?q=" + encodeURIComponent(sourceText) + "&appKey=" + appId + "&salt=" + salt + "&from=" + config.from + '&to=' + config.to + "&sign=" + sign + "&signType=" + config.version + "&curtime=" + curtime + "&domain=" + config.domain;
      return {
        'url': requestUrl,
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = 'noAlert', isVerifyMode = false) {
      const credentials = this.getCredentials();
      if ((!credentials.appId || !credentials.appKey) && isVerifyMode) {
        return window.alert('❌【' + this.serviceName + "】：请先输入 AppID 和 AppKey！"), -0x1;
      }
      if (!isVerifyMode && credentials.verifyResult !== "验证成功") {
        return errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      }
      const requestData = this.prepareRequest(credentials.appId, credentials.appKey, sourceText);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request('GET', requestData.url, {
          'headers': requestData.headers,
          'responseType': 'json'
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.errorCode !== '0') {
            const errorCode = responseBody.errorCode,
              errorLink = "\n\n👉 常见错误码含义见：" + credentials.errorCodeLink;
            if (isVerifyMode) throw new Error('❌【' + this.serviceName + "】验证失败！（errorCode：" + errorCode + '）' + errorLink);else errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦！（errorCode：" + errorCode + '）' + errorLink);
            return;
          }
          responseBody.translation && responseBody.translation.length > 0x0 && onSuccess(responseBody.translation.join(''));
        }
      }, errorMode);
    }
  },
  'youdao_verifyAPI': async function (doc) {
    const testText = "hello";
    return await Zotero.AI4Paper.youdao_Helper.requestTranslation(testText, translatedText => {
      Zotero.AI4Paper.apiModule_updateButtons("youdaoVerifyResult", "youdao", doc, true);
    }, 'alert', true);
  },
  'youdao_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.youdao_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.youdao_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.youdao_Helper.serviceName);
  },
  'youdao_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.youdao_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.youdao_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.youdao_Helper.serviceName);
  },
  'youdao_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.youdao_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, "noAlert");
  },
  'youdao_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.youdao_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, "【收藏生词】- " + Zotero.AI4Paper.youdao_Helper.serviceName);
    }, 'noAlert');
  },
  'youdao_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.youdao_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, "noAlert");
  },
  'volcano_Helper': {
    'serviceName': "火山🔑",
    'config': {
      'service': "translate",
      'region': 'cn-north-1',
      'host': 'open.volcengineapi.com',
      'path': '/',
      'action': "TranslateText",
      'version': "2020-06-01",
      'targetLang': 'zh'
    },
    'getCredentials': function () {
      const serviceList = Zotero.AI4Paper.translationServiceList();
      if (!serviceList[this.serviceName]) return null;
      return {
        'ak': serviceList[this.serviceName].secret_id,
        'sk': serviceList[this.serviceName].secret_key,
        'verifyResult': serviceList[this.serviceName].api_verifyResult,
        'errorCodeLink': serviceList[this.serviceName].errorCode_link
      };
    },
    'signRequest': function (accessKeyId, secretKey, bodyStr) {
      const CryptoJS = Zotero.AI4Paper._CryptoJS,
        now = new Date(),
        isoDateTime = now.toISOString().replace(/[:-]|\.\d{3}/g, ''),
        dateStamp = isoDateTime.substring(0x0, 0x8),
        {
          service: service,
          region: region,
          host: host,
          action: action,
          version: version
        } = this.config,
        httpMethod = "POST",
        contentType = "application/json; charset=utf-8",
        queryString = "Action=" + action + "&Version=" + version,
        signedHeaders = 'content-type;host;x-date;x-content-sha256',
        contentHash = CryptoJS.SHA256(bodyStr).toString(CryptoJS.enc.Hex),
        canonicalRequest = [httpMethod, this.config.path, queryString, 'content-type:' + contentType + "\nhost:" + host + "\nx-date:" + isoDateTime + "\nx-content-sha256:" + contentHash + '\x0a', signedHeaders, contentHash].join('\x0a'),
        credentialScope = dateStamp + '/' + region + '/' + service + "/request",
        stringToSign = ['HMAC-SHA256', isoDateTime, credentialScope, CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex)].join('\x0a'),
        kDate = CryptoJS.HmacSHA256(dateStamp, secretKey),
        kRegion = CryptoJS.HmacSHA256(region, kDate),
        kService = CryptoJS.HmacSHA256(service, kRegion),
        kSigning = CryptoJS.HmacSHA256("request", kService),
        signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString(CryptoJS.enc.Hex),
        authorization = "HMAC-SHA256 Credential=" + accessKeyId + '/' + credentialScope + ',\x20SignedHeaders=' + signedHeaders + ", Signature=" + signature;
      return {
        'url': "https://" + host + this.config.path + '?' + queryString,
        'headers': {
          'Content-Type': contentType,
          'Host': host,
          'X-Date': isoDateTime,
          'X-Content-Sha256': contentHash,
          'Authorization': authorization
        }
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = "noAlert", isVerifyMode = false) {
      const credentials = this.getCredentials();
      if ((!credentials.ak || !credentials.sk) && isVerifyMode) return window.alert('❌【' + this.serviceName + '】：请先输入\x20AccessKeyld\x20和\x20AccessKeySecret！'), -0x1;
      if (!isVerifyMode && credentials.verifyResult !== "验证成功") {
        if (errorMode === this.serviceName) {
          Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + '】API-Key！\x0a\x0a请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20翻译\x20API】完成验证！');
        }
        return -0x1;
      }
      const requestPayload = {
          'SourceLanguage': '',
          'TargetLanguage': this.config.targetLang,
          'TextList': [sourceText],
          'Options': {
            'Category': "system"
          }
        },
        bodyStr = JSON.stringify(requestPayload),
        signedRequest = this.signRequest(credentials.ak, credentials.sk, bodyStr);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", signedRequest.url, {
          'headers': signedRequest.headers,
          'body': bodyStr,
          'responseType': 'json'
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.ResponseMetadata && responseBody.ResponseMetadata.Error) {
            const errorInfo = JSON.stringify(responseBody.ResponseMetadata.Error),
              errorLink = '\x0a\x0a👉\x20常见错误码含义见：' + credentials.errorCodeLink;
            if (isVerifyMode) {
              throw new Error('' + errorInfo + errorLink);
            } else {
              if (errorMode === this.serviceName) {
                Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦！\n\n" + errorInfo + errorLink);
                return;
              }
            }
          }
          responseBody.TranslationList && responseBody.TranslationList[0x0].Translation && onSuccess(responseBody.TranslationList[0x0].Translation);
        }
      }, errorMode);
    }
  },
  'volcano_verifyAPI': async function (doc) {
    const testText = "hello";
    return await Zotero.AI4Paper.volcano_Helper.requestTranslation(testText, translatedText => {
      Zotero.AI4Paper.apiModule_updateButtons("volcanoVerifyResult", "volcano", doc, true);
    }, "alert", true);
  },
  'volcano_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.volcano_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.volcano_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.volcano_Helper.serviceName);
  },
  'volcano_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.volcano_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.volcano_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.volcano_Helper.serviceName);
  },
  'volcano_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.volcano_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, "noAlert");
  },
  'volcano_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.volcano_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, "【收藏生词】- " + Zotero.AI4Paper.volcano_Helper.serviceName);
    }, "noAlert");
  },
  'volcano_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.volcano_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, 'noAlert');
  },
  'niutrans_Helper': {
    'serviceName': "小牛🔑",
    'config': {
      'url': "http://api.niutrans.com/NiuTransServer/translation",
      'from': 'auto',
      'to': 'zh'
    },
    'getCredentials': function () {
      const serviceList = Zotero.AI4Paper.translationServiceList();
      if (!serviceList[this.serviceName]) return null;
      return {
        'apiKey': serviceList[this.serviceName].api_key,
        'verifyResult': serviceList[this.serviceName].api_verifyResult,
        'errorCodeLink': serviceList[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': function (apiKey, sourceText) {
      const config = this.config,
        requestUrl = config.url + '?from=' + config.from + '&to=' + config.to + "&apikey=" + apiKey,
        requestBody = {
          'src_text': sourceText,
          'apikey': apiKey,
          'from': config.from,
          'to': config.to
        };
      return {
        'url': requestUrl,
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify(requestBody)
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = "noAlert", isVerifyMode = false) {
      const credentials = this.getCredentials();
      if (!credentials.apiKey && isVerifyMode) return window.alert('❌【' + this.serviceName + "】：请先输入 API-Key！"), -0x1;
      if (!isVerifyMode && credentials.verifyResult !== "验证成功") {
        return errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      }
      const requestData = this.prepareRequest(credentials.apiKey, sourceText);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", requestData.url, {
          'headers': requestData.headers,
          'body': requestData.body,
          'responseType': 'json'
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.error_msg) {
            const errorCode = responseBody.error_code,
              errorMessage = responseBody.error_msg,
              errorLink = '\x0a\x0a👉\x20常见错误码含义见：' + credentials.errorCodeLink;
            if (isVerifyMode) throw new Error(errorCode + ':\x20' + errorMessage + errorLink);else {
              if (errorMode === this.serviceName) {
                Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦：" + errorCode + ':\x20' + errorMessage + errorLink);
              }
            }
            return;
          }
          responseBody.tgt_text && onSuccess(responseBody.tgt_text);
        }
      }, errorMode);
    }
  },
  'niutrans_verifyAPI': async function (doc) {
    const testText = "Hello";
    return await Zotero.AI4Paper.niutrans_Helper.requestTranslation(testText, translatedText => {
      Zotero.AI4Paper.apiModule_updateButtons("niutransverifyresult", "niutrans", doc, true);
    }, "alert", true);
  },
  'niutrans_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.niutrans_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.niutrans_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.niutrans_Helper.serviceName);
  },
  'niutrans_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.niutrans_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set('ai4paper.selectedtexttrans', sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.niutrans_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.niutrans_Helper.serviceName);
  },
  'niutrans_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.niutrans_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, "noAlert");
  },
  'niutrans_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.niutrans_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, '【收藏生词】-\x20' + Zotero.AI4Paper.niutrans_Helper.serviceName);
    }, "noAlert");
  },
  'niutrans_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.niutrans_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, "noAlert");
  },
  'caiyunxiaoyi_Helper': {
    'serviceName': '彩云小译🔑',
    'config': {
      'url': "http://api.interpreter.caiyunai.com/v1/translator",
      'source': 'auto',
      'target': 'zh',
      'protocol': "json"
    },
    'getCredentials': function () {
      const serviceList = Zotero.AI4Paper.translationServiceList();
      if (!serviceList[this.serviceName]) return null;
      return {
        'apiKey': serviceList[this.serviceName].api_key,
        'verifyResult': serviceList[this.serviceName].api_verifyResult,
        'errorCodeLink': serviceList[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': function (apiKey, sourceText) {
      const config = this.config,
        requestBody = {
          'source': [sourceText],
          'trans_type': config.source + '2' + config.target,
          'request_id': 'demo',
          'detect': true,
          'protocol': config.protocol
        };
      return {
        'url': config.url,
        'headers': {
          'Content-Type': "application/json",
          'X-Authorization': 'token\x20' + apiKey
        },
        'body': JSON.stringify(requestBody)
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = "noAlert", isVerifyMode = false) {
      const credentials = this.getCredentials();
      if (!credentials.apiKey && isVerifyMode) return window.alert('❌【' + this.serviceName + "】：请先输入 API-Key！"), -0x1;
      if (!isVerifyMode && credentials.verifyResult !== "验证成功") return errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      const requestData = this.prepareRequest(credentials.apiKey, sourceText);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", requestData.url, {
          'headers': requestData.headers,
          'body': requestData.body,
          'responseType': "json"
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.message) {
            const errorMessage = responseBody.message,
              errorLink = "\n\n👉 常见错误码含义见：" + credentials.errorCodeLink;
            if (isVerifyMode) throw new Error('' + errorMessage + errorLink);else errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + '】出错啦：' + errorMessage + errorLink);
            return;
          }
          responseBody.target && onSuccess(responseBody.target);
        }
      }, errorMode);
    }
  },
  'caiyunxiaoyi_verifyAPI': async function (doc) {
    const testText = 'Hello';
    return await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(testText, translatedText => {
      Zotero.AI4Paper.apiModule_updateButtons('caiyunxiaoyiverifyresult', "caiyunxiaoyi", doc, true);
    }, "alert", true);
  },
  'caiyunxiaoyi_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.caiyunxiaoyi_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.caiyunxiaoyi_Helper.serviceName);
  },
  'caiyunxiaoyi_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.caiyunxiaoyi_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.caiyunxiaoyi_Helper.serviceName);
  },
  'caiyunxiaoyi_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, "noAlert");
  },
  'caiyunxiaoyi_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, "【收藏生词】- " + Zotero.AI4Paper.caiyunxiaoyi_Helper.serviceName);
    }, 'noAlert');
  },
  'caiyunxiaoyi_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, "noAlert");
  },
  'updateTranslateReaderSidePanePlaceHolder': function (state) {
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) return false;
    var paneWindow;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) paneWindow = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;else return false;
    if (!paneWindow) return;
    paneWindow.document.getElementById("ai4paper-translate-readerSidePane-response").placeholder = "这里显示翻译结果";
    if (state === "start") {
      paneWindow.document.getElementById("ai4paper-translate-readerSidePane-response").placeholder = "正在请求...";
      paneWindow.document.getElementById("ai4paper-translate-readerSidePane-response").style.boxShadow = "0 0 4px blue";
    } else state === 'done' && (paneWindow.document.getElementById('ai4paper-translate-readerSidePane-response').placeholder = "这里显示翻译结果", paneWindow.document.getElementById('ai4paper-translate-readerSidePane-response').style.boxShadow = "0 0 1px rgba(0, 0, 0, 0.5)");
  },
  'gptTranslation_onStreamDone': function (translatedText, sourceText) {
    Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
    Zotero.Prefs.get('ai4paper.translationreadersidepane') && (Zotero.AI4Paper.translateResponse = translatedText, Zotero.AI4Paper.updateTranslateReaderSidePane(), Zotero.AI4Paper.updateTranslateReaderSidePanePlaceHolder('done'));
    Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea') && (Zotero.AI4Paper.updateTranslationPopupTextArea(translatedText), Zotero.AI4Paper.updateTranslationPopupTextAreaBoxShadow('done'));
    Zotero.AI4Paper.trans2ViewerANDRecord(sourceText, translatedText);
    Zotero.Prefs.get("ai4paper.translationautocopy") && Zotero.AI4Paper.copy2Clipboard(translatedText);
  },
  'getQuestion_gptTranslation': function (sourceText, transType) {
    let defaultPrompt = "作为一名精通简体中文的专业翻译家，请将所提供的文本准确地翻译为简体中文。请仅回复翻译好的句子，不要其他内容。【待翻译文本】如下";
    if (transType === "transSelectedText") return (Zotero.Prefs.get("ai4paper.translationOpenAIPromptTemplate") ? Zotero.Prefs.get("ai4paper.translationOpenAIPromptTemplate") : defaultPrompt) + ":\n\n" + sourceText;else {
      if (transType === "transAnnotation") return (Zotero.Prefs.get('ai4paper.annotationTranslationPrompt').trim() ? Zotero.Prefs.get("ai4paper.annotationTranslationPrompt") : defaultPrompt) + ":\n\n" + sourceText;
    }
  },
  'catchStreamError_gptTranslation': function (serviceName, errorCodeLink, chunkText) {
    try {
      if (typeof JSON.parse(chunkText) === "object") {
        let errorMsg;
        if (JSON.parse(chunkText).error || JSON.parse(chunkText).object === "error") errorMsg = "⚠️ [请求错误]\n\n❌ " + serviceName + '\x20出错啦：' + chunkText + "\n\n🔗【" + serviceName + " 错误码含义】请见：\n" + errorCodeLink;else JSON.parse(chunkText)[0x0]?.["error"] && (errorMsg = "⚠️ [请求错误]\n\n❌ " + serviceName + '\x20出错啦：\x22error\x22:\x20{\x0a\x22code\x22:\x20' + JSON.parse(chunkText)[0x0]?.["error"]["code"] + ",\n\"message\": \"" + JSON.parse(chunkText)[0x0]?.["error"]["message"] + '\x22,\x0a}\x0a\x0a🔗【' + serviceName + " 错误码含义】请见：\n" + errorCodeLink);
        if (errorMsg) {
          return Zotero.AI4Paper.translateReaderSidePane_showErrorMessage(errorMsg), Zotero.AI4Paper.updateTranslationPopupTextAreaBoxShadow('done'), false;
        }
      }
    } catch (e) {
      return Zotero.debug("gptTranslation Stream Error: " + e), true;
    }
    return true;
  },
  'catchFetchError_gptTranslation': function (serviceName, errorCodeLink, error) {
    let errorMsg = "⚠️ [请求错误]\n\n❌ " + serviceName + '\x20出错啦：' + error + "\n\n🔗【" + serviceName + " 错误码含义】请见：\n" + errorCodeLink;
    Zotero.AI4Paper.translateReaderSidePane_showErrorMessage(errorMsg);
    Zotero.AI4Paper.updateTranslationPopupTextAreaBoxShadow("done");
  },
  'startFetch_gptTranslation': async function (apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink) {
    Zotero.AI4Paper.updateTranslateReaderSidePanePlaceHolder("start");
    Zotero.AI4Paper.updateTranslationPopupTextAreaBoxShadow('start');
    let streamState = {
      'temp': '',
      'target': '',
      'html4Refs': '',
      'hasReasoning_content': false,
      'reasoning_contentStart': false,
      'reasoning_contentEnd': false
    };
    var requestOptions = Zotero.AI4Paper.gptReaderSidePane_getRequestOptions(serviceName, apiKey, requestBody);
    fetch(apiUrl, requestOptions).then(fetchResponse => {
      return !fetchResponse.ok && (Zotero.debug("gptTranslation Response Error: " + fetchResponse), Zotero.AI4Paper.showProgressWindow(0x9c4, "GPT 翻译请求失败【Zoteor One】", 'Fetch\x20request\x20to\x20' + apiUrl + " failed: HTTP status " + fetchResponse.status + " - " + fetchResponse.statusText)), fetchResponse.body;
    }).then(readableStream => {
      let reader = readableStream.getReader();
      fn14();
      function fn14() {
        return reader.read().then(({
          done: done,
          value: value
        }) => {
          if (done) {
            Zotero.AI4Paper.gptTranslation_onStreamDone(streamState.target, sourceText);
            return;
          }
          let chunkText = new TextDecoder("utf-8").decode(value, {
            'stream': true
          });
          if (!Zotero.AI4Paper.catchStreamError_gptTranslation(serviceName, errorCodeLink, chunkText)) return;
          Zotero.AI4Paper.resolveStreamChunk(chunkText, streamState, serviceName);
          Zotero.Prefs.set('ai4paper.selectedtexttrans', sourceText);
          Zotero.Prefs.get("ai4paper.translationreadersidepane") && (Zotero.AI4Paper.translateResponse = streamState.target, Zotero.AI4Paper.updateTranslateReaderSidePane());
          Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea') && Zotero.AI4Paper.updateTranslationPopupTextArea(streamState.target);
          fn14();
        });
      }
    })["catch"](e => {
      Zotero.AI4Paper.catchFetchError_gptTranslation(serviceName, errorCodeLink, e);
    });
  },
  'openAI_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "OpenAI";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'translation')) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, 'transSelectedText'),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, 'isTranslation'),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'openAI_Helper': {
    'serviceName': "OpenAI",
    'getCredentials': function () {
      const serviceList = Zotero.AI4Paper.translationServiceList();
      if (!serviceList[this.serviceName]) return null;
      return {
        'secretId': serviceList[this.serviceName].secret_id,
        'secretKey': serviceList[this.serviceName].secret_key,
        'verifyResult': serviceList[this.serviceName].api_verifyResult,
        'errorCodeLink': serviceList[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': async function (secretId, secretKey, sourceText) {
      const {
          host: host,
          region: region,
          projectId: projectId,
          version: version,
          action: action,
          source: source,
          target: target
        } = this.config,
        timestamp = new Date().getTime().toString().substring(0x0, 0xa),
        nonce = "9744",
        queryString = "Action=" + action + "&Language=zh-CN&Nonce=" + nonce + "&ProjectId=" + projectId + "&Region=" + region + "&SecretId=" + secretId + "&Source=" + source + "&SourceText=#$#&Target=" + target + "&Timestamp=" + timestamp + "&Version=" + version,
        signSource = 'POST' + host + '/?' + queryString.replace("#$#", sourceText),
        hmacDigest = await Zotero.AI4Paper.hmacSha1Digest(signSource, secretKey),
        signBase64 = Zotero.AI4Paper.base64(hmacDigest),
        encodedSign = Zotero.AI4Paper.encodeRFC5987ValueChars(signBase64),
        encodedText = Zotero.AI4Paper.encodeRFC5987ValueChars(sourceText),
        requestBody = queryString.replace("#$#", encodedText) + "&Signature=" + encodedSign;
      return {
        'url': "https://" + host,
        'headers': {
          'Content-Type': 'application/json'
        },
        'body': requestBody
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = "noAlert", isVerifyMode = false) {
      const credentials = this.getCredentials();
      if ((!credentials.secretId || !credentials.secretKey) && isVerifyMode) return window.alert('❌【' + this.serviceName + "】：请先输入 SecretId 和 SecretKey！"), -0x1;
      if (!isVerifyMode && credentials.verifyResult !== '验证成功') {
        return errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage('❌\x20尚未验证【' + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      }
      const requestData = await this.prepareRequest(credentials.secretId, credentials.secretKey, sourceText);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", requestData.url, {
          'headers': requestData.headers,
          'body': requestData.body,
          'responseType': "json"
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.Response && responseBody.Response.Error) {
            const errorCode = responseBody.Response.Error.Code,
              errorMessage = responseBody.Response.Error.Message,
              errorLink = "\n\n👉 常见错误码含义见：" + credentials.errorCodeLink;
            if (isVerifyMode) {
              throw new Error(errorCode + ':\x20' + errorMessage + errorLink);
            } else errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦：" + errorCode + ':\x20' + errorMessage + errorLink);
            return;
          }
          responseBody.Response && responseBody.Response.TargetText && onSuccess(responseBody.Response.TargetText);
        }
      }, errorMode);
    }
  },
  'openAI_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = 'OpenAI';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, 'isTranslation'),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': 'Bearer\x20' + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'api2d_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "API2D";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'api2d_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = 'API2D';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey,
          'x-api2d-no-cache': 0x1
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, 'noAlert');
  },
  'chatAnywhere_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = 'ChatAnywhere';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, 'transSelectedText'),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, 'isTranslation'),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'chatAnywhere_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "ChatAnywhere";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': 'user',
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': 'json'
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'qwen_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = '通义千问';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'translation')) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'qwen_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = '通义千问';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, 'noAlert');
  },
  'getAccessToken_Wenxin': async function (mode, chatId) {
    let apiKey = Zotero.Prefs.get('ai4paper.wenxinAPIKey').trim(),
      secretKey = Zotero.Prefs.get("ai4paper.wenxinSecretKey").trim(),
      tokenUrl = "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" + apiKey + "&client_secret=" + secretKey,
      tokenResponse;
    try {
      return tokenResponse = await Zotero.HTTP.request("POST", tokenUrl, {
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify({}),
        'responseType': "json"
      }), tokenResponse.response.access_token;
    } catch (e) {
      let errorMsg = "⚠️ [请求错误]\n\n❌【文心一言】获取 AccessToken 失败！请检查 API Key/Secret Key/网络连接。\n\n" + e;
      if (mode === "ChatMode") {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_displayErrorMessage(errorMsg);
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveError2MessageHistory(errorMsg, chatId);
      } else {
        if (mode === "notChatMode") Zotero.AI4Paper.gptReaderSidePane_resetChat(Zotero.getString(errorMsg));else mode === "translate" ? Zotero.AI4Paper.translateReaderSidePane_showErrorMessage(errorMsg) : window.alert(errorMsg);
      }
      return false;
    }
  },
  'wenxin_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "文心一言";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'wenxin_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "文心一言";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request('POST', apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'glm_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "智普清言";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'thinking': {
          'type': "disabled"
        },
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'glm_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "智普清言";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': 'user',
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'zjuchat_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "浙大先生";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, 'isTranslation'),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'zjuchat_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "浙大先生";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': 'json'
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'yi_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "零一万物";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'yi_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "零一万物";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'volcanoSearch_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "火山联网搜索";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'translation')) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.gptServiceList()[serviceName].model,
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'volcanoSearch_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "火山联网搜索";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.gptServiceList()[serviceName].model,
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, 'noAlert');
  },
  'volcanoEngine_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "火山引擎";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'translation')) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, 'transSelectedText'),
      model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'volcanoEngine_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "火山引擎";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, 'transAnnotation'),
      model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': 'user',
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'doubao_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = '豆包';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, 'isTranslation'),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'doubao_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = '豆包';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request('POST', apiUrl, {
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer\x20' + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': 'json'
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'kimi_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = 'Kimi';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, 'translation')) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'kimi_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "Kimi";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, 'transAnnotation'),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer\x20' + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': 'json'
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'deepSeek_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "DeepSeek";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1/chat/completions";
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'deepSeek_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "DeepSeek";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + '/v1/chat/completions';
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      apiKey = Zotero.Prefs.get("ai4paper.deepSeekAPI").trim(),
      apiUrl = 'https://api.deepseek.com/v1/chat/completions',
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': 'user',
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'gptCustom_transSelectedText': async function (sourceText, customIndex) {
    let numEmoji = Zotero.AI4Paper.gptCustom_numEmoji;
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = 'GPT\x20自定\x20' + numEmoji[customIndex];
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.getURL4GPTCustom(serviceName);
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.gptReaderSidePane_addRequestArguments(requestBody, customIndex);
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'gptCustom_transAnnotation': async function (annotation, item, customIndex) {
    let numEmoji = Zotero.AI4Paper.gptCustom_numEmoji;
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = 'GPT\x20自定\x20' + numEmoji[customIndex];
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = Zotero.AI4Paper.getURL4GPTCustom(serviceName);
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'messages': [{
          'role': 'user',
          'content': question
        }]
      };
    return Zotero.AI4Paper.gptReaderSidePane_addRequestArguments(requestBody, customIndex), await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request('POST', apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'gemini_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = 'Gemini';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + '/v1beta/models/' + model + ":streamGenerateContent",
      requestBody = {
        'contents': [{
          'role': "USER",
          'parts': [{
            'text': question
          }]
        }],
        'safetySettings': [{
          'category': "HARM_CATEGORY_HARASSMENT",
          'threshold': "BLOCK_NONE"
        }, {
          'category': 'HARM_CATEGORY_HATE_SPEECH',
          'threshold': 'BLOCK_NONE'
        }, {
          'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          'threshold': "BLOCK_NONE"
        }, {
          'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
          'threshold': "BLOCK_NONE"
        }]
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'gemini_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = 'Gemini';
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, 'transAnnotation'),
      model = Zotero.AI4Paper.gptServiceList()[serviceName].custom_model_enable && Zotero.AI4Paper.gptServiceList()[serviceName].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[serviceName].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      apiUrl = Zotero.AI4Paper.gptServiceList()[serviceName].base_url + "/v1beta/models/" + model + ":generateContent",
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
          'threshold': 'BLOCK_NONE'
        }, {
          'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          'threshold': "BLOCK_NONE"
        }, {
          'category': "HARM_CATEGORY_DANGEROUS_CONTENT",
          'threshold': 'BLOCK_NONE'
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request('POST', apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'x-goog-api-key': apiKey
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.candidates[0x0].content.parts[0x0].text;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'claude_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "Claude";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    let errorCodeLink = Zotero.AI4Paper.gptServiceList()[serviceName].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, true, "translation")) return false;
    var question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transSelectedText"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'max_tokens': Zotero.AI4Paper.getClaudeMaxTokens(model),
        'messages': [{
          'role': "user",
          'content': question
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(apiUrl, apiKey, requestBody, sourceText, serviceName, errorCodeLink);
  },
  'claude_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let serviceName = "Claude";
    var apiKey = Zotero.AI4Paper.gptServiceList()[serviceName].api_key,
      apiUrl = '' + Zotero.AI4Paper.gptServiceList()[serviceName].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(apiKey, serviceName, false)) return false;
    var sourceText = annotation.annotationText,
      question = Zotero.AI4Paper.getQuestion_gptTranslation(sourceText, "transAnnotation"),
      model = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[serviceName].modelLabel, "isTranslation"),
      requestBody = {
        'model': model,
        'max_tokens': Zotero.AI4Paper.getClaudeMaxTokens(model),
        'messages': [{
          'role': "user",
          'content': question
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", apiUrl, {
        'headers': {
          'Content-Type': "application/json",
          'x-api-key': apiKey,
          'anthropic-version': "2023-06-01"
        },
        'body': JSON.stringify(requestBody),
        'responseType': "json"
      });
    }, httpResponse => {
      if (Zotero.AI4Paper.runAuthor()) {
        var translatedText = httpResponse.response.content[0x0].text;
        Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
      }
    }, "noAlert");
  },
  'deepl_Helper': {
    'serviceName': 'DeepL🔑',
    'config': {
      'freeUrl': "https://api-free.deepl.com/v2/translate",
      'proUrl': "https://api.deepl.com/v2/translate",
      'targetLang': "ZH-HANS"
    },
    'getCredentials': function () {
      const serviceList = Zotero.AI4Paper.translationServiceList();
      if (!serviceList[this.serviceName]) return null;
      return {
        'apiKey': serviceList[this.serviceName].api_key,
        'plan': serviceList[this.serviceName].plan,
        'verifyResult': serviceList[this.serviceName].api_verifyResult,
        'errorCodeLink': serviceList[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': function (apiKey, plan, sourceText) {
      const config = this.config,
        apiUrl = plan === 'DeepL\x20Pro' ? config.proUrl : config.freeUrl,
        requestBody = {
          'text': [sourceText],
          'target_lang': config.targetLang
        };
      return {
        'url': apiUrl,
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "DeepL-Auth-Key " + apiKey
        },
        'body': JSON.stringify(requestBody)
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = "noAlert", isVerifyMode = false) {
      const credentials = this.getCredentials();
      if (!credentials.apiKey && isVerifyMode) return window.alert('❌【' + this.serviceName + "】：请先输入 API-Key！"), -0x1;
      if (!isVerifyMode && credentials.verifyResult !== "验证成功") {
        if (errorMode === this.serviceName) {
          Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！");
        }
        return -0x1;
      }
      const requestData = this.prepareRequest(credentials.apiKey, credentials.plan, sourceText);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", requestData.url, {
          'headers': requestData.headers,
          'body': requestData.body,
          'responseType': "json"
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          responseBody.translations && responseBody.translations.length > 0x0 && onSuccess(responseBody.translations[0x0].text);
        }
      }, errorMode);
    }
  },
  'deep_verifyAPI': async function (doc) {
    const testText = 'Hello';
    return await Zotero.AI4Paper.deepl_Helper.requestTranslation(testText, translatedText => {
      Zotero.AI4Paper.apiModule_updateButtons("deeplverifyresult", "deepl", doc, true);
    }, "alert", true);
  },
  'deepl_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.deepl_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.deepl_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.deepl_Helper.serviceName);
  },
  'deepl_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.deepl_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set('ai4paper.selectedtexttrans', sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.deepl_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.deepl_Helper.serviceName);
  },
  'deepl_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.deepl_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, "noAlert");
  },
  'deepl_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.deepl_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, '【收藏生词】-\x20' + Zotero.AI4Paper.deepl_Helper.serviceName);
    }, "noAlert");
  },
  'deepl_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.deepl_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, 'noAlert');
  },
  'deeplx_Helper': {
    'serviceName': 'DeepLX🔑',
    'config': {
      'sourceLang': "auto",
      'targetLang': 'ZH'
    },
    'getCredentials': function () {
      const serviceList = Zotero.AI4Paper.translationServiceList();
      if (!serviceList[this.serviceName]) return null;
      return {
        'url': serviceList[this.serviceName].request_url,
        'verifyResult': serviceList[this.serviceName].api_verifyResult,
        'errorCodeLink': serviceList[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': function (sourceText) {
      const config = this.config,
        requestBody = {
          'text': sourceText,
          'source_lang': config.sourceLang,
          'target_lang': config.targetLang
        };
      return {
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify(requestBody)
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = "noAlert", isVerifyMode = false) {
      const credentials = this.getCredentials();
      if (!credentials.url && isVerifyMode) return window.alert('❌【' + this.serviceName + '】：请先配置\x20DeepLX\x20API\x20URL！'), -0x1;
      if (!isVerifyMode && credentials.verifyResult !== "验证成功") {
        return errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage('❌\x20尚未验证【' + this.serviceName + "】API-URL！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      }
      const requestData = this.prepareRequest(sourceText),
        apiUrl = credentials.url;
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", apiUrl, {
          'headers': requestData.headers,
          'body': requestData.body,
          'responseType': 'json'
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.code !== 0xc8 || !responseBody.data) {
            const errorMessage = responseBody.msg || 'DeepLX\x20错误码：' + responseBody.code,
              errorLink = "\n\n👉 常见错误码含义见：" + credentials.errorCodeLink;
            if (isVerifyMode) window.alert('' + errorMessage + errorLink);else errorMode === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage('[请求错误]\x0a\x0a【' + this.serviceName + '】出错啦：' + errorMessage + errorLink);
            return;
          }
          responseBody.data && onSuccess(responseBody.data);
        }
      }, errorMode);
    }
  },
  'deeplx_verifyAPI': async function (doc) {
    const testText = "Hello";
    return await Zotero.AI4Paper.deeplx_Helper.requestTranslation(testText, translatedText => {
      Zotero.AI4Paper.apiModule_updateButtons("deeplxverifyresult", "deeplx", doc, true);
    }, "alert", true);
  },
  'deeplx_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.deeplx_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.deeplx_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.deeplx_Helper.serviceName);
  },
  'deeplx_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.deeplx_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.deeplx_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.deeplx_Helper.serviceName);
  },
  'deeplx_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.deeplx_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, 'noAlert');
  },
  'deeplx_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.deeplx_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, "【收藏生词】- " + Zotero.AI4Paper.deeplx_Helper.serviceName);
    }, "noAlert");
  },
  'deeplx_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.deeplx_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, "noAlert");
  },
  'tencentSmart_Helper': {
    'serviceName': "腾讯交互🆓",
    'config': {
      'url': "https://yi.qq.com/api/imt",
      'targetLang': 'zh',
      'client_key': "browser-chrome-110.0.0-Mac OS-df4bd4c5-a65d-44b2-a40f-42f34f3535f2-1677486696487"
    },
    'prepareRequest': function (sourceText) {
      const config = this.config,
        requestBody = {
          'header': {
            'fn': "auto_translation",
            'client_key': config.client_key
          },
          'type': "plain",
          'model_category': "normal",
          'source': {
            'lang': "auto",
            'text_list': [sourceText]
          },
          'target': {
            'lang': config.targetLang
          }
        };
      return {
        'url': config.url,
        'headers': {
          'Content-Type': 'application/json',
          'user-agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
          'referer': "https://yi.qq.com/zh-CN/index"
        },
        'body': JSON.stringify(requestBody)
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = 'noAlert') {
      const requestData = this.prepareRequest(sourceText);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", requestData.url, {
          'headers': requestData.headers,
          'body': requestData.body,
          'responseType': "json"
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.auto_translation && responseBody.auto_translation.length > 0x0) {
            let translatedText = responseBody.auto_translation.join('');
            onSuccess(translatedText);
          }
        }
      }, errorMode);
    }
  },
  'tencentSmart_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.tencentSmart_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.tencentSmart_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.tencentSmart_Helper.serviceName);
  },
  'tencentSmart_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.tencentSmart_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.tencentSmart_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.tencentSmart_Helper.serviceName);
  },
  'tencentSmart_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.tencentSmart_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, 'noAlert');
  },
  'tencentSmart_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.tencentSmart_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, "【收藏生词】- " + Zotero.AI4Paper.tencentSmart_Helper.serviceName);
    }, "noAlert");
  },
  'tencentSmart_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.tencentSmart_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, "noAlert");
  },
  'volcanoFree_Helper': {
    'serviceName': "火山🆓",
    'config': {
      'url': 'https://translate.volcengine.com/crx/translate/v1',
      'targetLang': 'zh'
    },
    'prepareRequest': function (sourceText) {
      const config = this.config;
      let requestBody = {
        'text': sourceText,
        'source_language': "auto",
        'target_language': config.targetLang
      };
      return {
        'url': config.url,
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify(requestBody)
      };
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = "noAlert") {
      const requestData = this.prepareRequest(sourceText);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request('POST', requestData.url, {
          'headers': requestData.headers,
          'body': requestData.body,
          'responseType': "json"
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          if (responseBody.translation) return onSuccess(responseBody.translation), responseBody.translation;
        }
      }, errorMode);
    }
  },
  'volcanoFree_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.volcanoFree_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.volcanoFree_Helper.serviceName);
  },
  'volcanoFree_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.volcanoFree_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.volcanoFree_Helper.serviceName);
  },
  'volcanoFree_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, "noAlert");
  },
  'volcanoFree_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, "【收藏生词】- " + Zotero.AI4Paper.volcanoFree_Helper.serviceName);
    }, "noAlert");
  },
  'volcanoFree_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, "noAlert");
  },
  'volcanoFree_transAbstractInPanel': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(sourceText, translatedText => {
      return translatedText;
    }, Zotero.AI4Paper.volcanoFree_Helper.serviceName);
  },
  'caiyunxiaoyiFree_Helper': {
    'serviceName': "彩云小译🆓",
    'url': 'https://interpreter.cyapi.cn/v1/translator',
    'headers': {
      'Content-Type': "application/json",
      'x-authorization': 'token\x20ssdj273ksdiwi923bsd9',
      'user-agent': "caiyunInterpreter/5 CFNetwork/1404.0.5 Darwin/22.3.0"
    },
    'getRandomNumber': function () {
      const randomBase = Math.floor(Math.random() * 0x1869f) + 0x186a0;
      return randomBase * 0x3e8;
    },
    'requestTranslation': async function (sourceText, onSuccess, errorMode = "noAlert") {
      let requestBody = {
        'source': sourceText,
        'detect': true,
        'os_type': "ios",
        'device_id': "F1F902F7-1780-4C88-848D-71F35D88A602",
        'trans_type': "auto2zh",
        'media': "text",
        'request_id': this.getRandomNumber(),
        'user_id': '',
        'dict': true
      };
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", this.url, {
          'headers': this.headers,
          'body': JSON.stringify(requestBody),
          'responseType': "json"
        });
      }, async httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          let translatedText = httpResponse.response.target;
          translatedText && onSuccess(translatedText);
        }
      }, errorMode);
    }
  },
  'caiyunxiaoyiFree_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.caiyunxiaoyiFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.caiyunxiaoyiFree_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.caiyunxiaoyiFree_Helper.serviceName);
  },
  'caiyunxiaoyiFree_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.caiyunxiaoyiFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set('ai4paper.selectedtexttrans', sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.caiyunxiaoyiFree_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.caiyunxiaoyiFree_Helper.serviceName);
  },
  'caiyunxiaoyiFree_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.caiyunxiaoyiFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, 'noAlert');
  },
  'caiyunxiaoyiFree_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word);
    const sourceText = word;
    return await Zotero.AI4Paper.caiyunxiaoyiFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, sourceText, translatedText, duplicateFlag, "【收藏生词】- " + Zotero.AI4Paper.caiyunxiaoyiFree_Helper.serviceName);
    }, 'noAlert');
  },
  'caiyunxiaoyiFree_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    if (item.getField("title").search(/[_\u4e00-\u9fa5]/) != -0x1) return fieldName === "title" && (item.setField('shortTitle', item.getField('title')), item.saveTx()), false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.caiyunxiaoyiFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, "noAlert");
  },
  'googleFree_Helper': {
    'serviceName': "谷歌🆓",
    'requestTranslation': async function (sourceText, onSuccess, errorMode = "noAlert") {
      let sourceLang = "auto",
        targetLang = 'zh',
        tk = Zotero.AI4Paper.getTK(sourceText),
        requestUrl = "https://translate.googleapis.com/translate_a/single?client=webapp&sl=" + sourceLang + "&tl=" + targetLang + '&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=bh&ssel=0&tsel=0&kc=1&tk=' + tk + "&q=" + encodeURIComponent(sourceText);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", requestUrl, {
          'headers': {
            'Content-Type': "application/json"
          },
          'body': JSON.stringify({}),
          'responseType': "json"
        });
      }, httpResponse => {
        if (Zotero.AI4Paper.runAuthor()) {
          const responseBody = httpResponse.response;
          try {
            let translatedText = '';
            if (responseBody[0x0] && responseBody[0x0].length) {
              for (let i = 0x0; i < responseBody[0x0].length; i++) {
                if (!responseBody[0x0][i]) continue;
                responseBody[0x0][i] && responseBody[0x0][i][0x0] && (translatedText += responseBody[0x0][i][0x0]);
              }
            }
            translatedText && onSuccess(translatedText);
          } catch (e) {
            throw new Error(e);
          }
        }
      }, errorMode);
    }
  },
  'googleFree_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const sourceText = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!sourceText) return;
    return await Zotero.AI4Paper.googleFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.googleFree_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.googleFree_Helper.serviceName);
  },
  'googleFree_transSelectedText': async function (sourceText) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.googleFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", sourceText);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.googleFree_Helper.serviceName, sourceText, translatedText);
    }, Zotero.AI4Paper.googleFree_Helper.serviceName);
  },
  'googleFree_transAnnotation': async function (annotation, item) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const sourceText = annotation.annotationText;
    return await Zotero.AI4Paper.googleFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.addTrans2AnnotationComment(annotation, translatedText, item);
    }, "noAlert");
  },
  'googleFree_transVocabulary': async function (annotation, word) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let duplicateFlag = 0x0;
    return duplicateFlag = await Zotero.AI4Paper.transVocabulary_checkDuplicate(annotation, word), await Zotero.AI4Paper.googleFree_Helper.requestTranslation(word, translatedText => {
      Zotero.AI4Paper.updateVocabularyAnnotation(annotation, word, translatedText, duplicateFlag, "【收藏生词】- " + Zotero.AI4Paper.googleFree_Helper.serviceName);
    }, "noAlert");
  },
  'googleFree_transField': async function (item, fieldName) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let sourceText = Zotero.AI4Paper.transField_getRaw(item, fieldName);
    if (!sourceText) return false;
    return await Zotero.AI4Paper.googleFree_Helper.requestTranslation(sourceText, translatedText => {
      Zotero.AI4Paper.transField_Handler(item, fieldName, sourceText, translatedText);
    }, "noAlert");
  },
  'apiModule_updateButtons': function (prefKey, engineId, doc, isSuccess, isRemove) {
    function fn15() {
      doc.getElementById("ai4paper." + engineId + ".apiverify.button").hidden = !isRemove ? true : false;
      doc.getElementById("ai4paper." + engineId + ".removeapi.button").hidden = !isRemove ? false : true;
    }
    if (isRemove) {
      var confirmed = window.confirm("是否确认解除 API 绑定？");
      if (confirmed) {
        Zotero.Prefs.set("ai4paper." + prefKey, "未验证");
        fn15();
      }
      return;
    }
    isSuccess ? (window.alert("验证成功！"), Zotero.Prefs.set("ai4paper." + prefKey, '验证成功'), fn15()) : Zotero.Prefs.get("ai4paper." + prefKey) === "验证成功" && fn15();
  },
  'transbyShortCuts_getRaw': function () {
    const selectedText = Zotero.AI4Paper.getSelectedText().trim();
    if (!selectedText) {
      Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 未检测到选中文本！\n\n请先在 PDF/网页阅读器中选中要翻译的文本。");
      return;
    }
    if (Zotero.Prefs.get('ai4paper.translationreadersidepane')) {
      Zotero.AI4Paper.translateSourceText = selectedText;
      Zotero.AI4Paper.translateResponse = '';
      Zotero.AI4Paper.updateTranslateReaderSidePane();
    }
    return selectedText;
  },
  'transVocabulary_checkDuplicate': async function (annotation, word) {
    let duplicateFlag = 0x0;
    const search = new Zotero.Search();
    search.libraryID = Zotero.Libraries.userLibraryID;
    search.addCondition("itemType", 'is', "note");
    search.addCondition("tag", 'is', '/生词本');
    const searchResults = await search.search(),
      noteItems = await Zotero.Items.getAsync(searchResults);
    if (noteItems.length != 0x0) {
      let noteContent = noteItems[0x0].getNote();
      if (noteContent.indexOf(annotation.key) != -0x1) return false;
      noteContent.indexOf('>' + word + "</a>") != -0x1 && (Zotero.AI4Paper.showProgressWindow(0x4e20, "❌【重复收藏】", '生词本已存在该生词！无须重复收藏。', "vocabulary"), duplicateFlag = 0x1);
    }
    return duplicateFlag;
  },
  'transField_getRaw': function (item, fieldName) {
    if (item.getField('title').search(/[_\u4e00-\u9fa5]/) != -0x1) {
      return fieldName === "title" && (item.setField("shortTitle", item.getField('title')), item.saveTx()), false;
    }
    return Zotero.AI4Paper.getRawInAbstractNote(fieldName, item.getField(fieldName));
  },
  'getRawInAbstractNote': function (fieldName, fieldValue) {
    if (fieldName === "abstractNote") {
      if (fieldValue.indexOf("【摘要翻译】") != -0x1) {
        let transIdx = fieldValue.indexOf("【摘要翻译】");
        fieldValue = fieldValue.substring(0x0, transIdx);
        if (fieldValue.lastIndexOf('\x0a\x0a') === fieldValue.length - 0x2) {
          fieldValue = fieldValue.substring(0x0, fieldValue.length - 0x2);
        } else fieldValue.lastIndexOf('\x0a') === fieldValue.length - 0x1 && (fieldValue = fieldValue.substring(0x0, fieldValue.length - 0x1));
      }
    }
    return fieldValue;
  },
  'transbyShortCuts_Handler': function (serviceName, sourceText, translatedText) {
    Zotero.Prefs.get('ai4paper.translationreadersidepane') && (Zotero.AI4Paper.translateResponse = translatedText, Zotero.AI4Paper.updateTranslateReaderSidePane());
    Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea') && Zotero.AI4Paper.updateTranslationPopupTextArea(translatedText);
    Zotero.AI4Paper.CheckPDFReader() && !Zotero.Prefs.get("ai4paper.disablepdfreadertransprogresswindow") && Zotero.AI4Paper.showProgressWindow(0x1388, '【' + serviceName + '】', '' + translatedText);
    Zotero.AI4Paper.trans2ViewerANDRecord(sourceText, translatedText);
    Zotero.Prefs.get("ai4paper.translationautocopy") && Zotero.AI4Paper.copy2Clipboard(translatedText);
  },
  'transField_Handler': function (item, fieldName, sourceText, translatedText) {
    if (fieldName === "title") {
      item.setField("shortTitle", translatedText);
      item.saveTx();
      Zotero.AI4Paper._Num_translateTitle++;
    } else fieldName === "abstractNote" && (item.setField('abstractNote', sourceText + "\n\n【摘要翻译】" + translatedText), item.saveTx(), Zotero.AI4Paper._Num_translateAbstract++);
  },
  'translateTitle': async function () {
    this._Num_translateTitle = 0x0;
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let selectedTabID = Zotero_Tabs._selectedID;
    var readerInstance = Zotero.Reader.getByTabID(selectedTabID);
    let hasPermission = Zotero.AI4Paper.betterURL();
    if (readerInstance) {
      let itemID = readerInstance.itemID;
      var item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID), Zotero.AI4Paper.showProgressWindow(0x5dc, "翻译标题【" + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', "您正在翻译当前文献的标题，请稍等...结果将通过弹窗反馈给您！"), hasPermission && (await Zotero.AI4Paper.translationEngineTask_title_abstract(item, "title"), Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 翻译标题【" + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', "您成功翻译【" + this._Num_translateTitle + "】篇文献的标题！")));
    } else {
      var selectedItems = ZoteroPane.getSelectedItems().filter(item => item.isRegularItem());
      Zotero.AI4Paper.showProgressWindow(0xbb8, '翻译标题【' + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', "您正在翻译 " + selectedItems.length + " 篇文献的标题，请稍等...结果将通过弹窗反馈给您！");
      if (hasPermission) {
        for (let item of selectedItems) {
          item.isRegularItem() && (await Zotero.AI4Paper.translationEngineTask_title_abstract(item, "title"));
        }
        await new Promise(resolve => setTimeout(resolve, 0xc8));
        Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 翻译标题【" + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', "您成功翻译【" + this._Num_translateTitle + '】篇文献的标题！');
      }
    }
  },
  'translateAbstract': async function () {
    this._Num_translateAbstract = 0x0;
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let selectedTabID = Zotero_Tabs._selectedID;
    var readerInstance = Zotero.Reader.getByTabID(selectedTabID);
    let hasPermission = Zotero.AI4Paper.showDate();
    if (readerInstance) {
      let itemID = readerInstance.itemID;
      var item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID), Zotero.AI4Paper.showProgressWindow(0x5dc, "翻译摘要【" + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', '您正在翻译当前文献的摘要，请稍等...结果将通过弹窗反馈给您！'), hasPermission && (await Zotero.AI4Paper.translationEngineTask_title_abstract(item, 'abstractNote'), Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 翻译摘要【" + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', "您成功翻译【" + this._Num_translateAbstract + '】篇文献的摘要！')));
    } else {
      var selectedItems = ZoteroPane.getSelectedItems().filter(item => item.isRegularItem());
      Zotero.AI4Paper.showProgressWindow(0xbb8, "翻译摘要【" + Zotero.Prefs.get('ai4paper.titleabstransengine') + '】', "您正在翻译 " + selectedItems.length + '\x20篇文献的摘要，请稍等...结果将通过弹窗反馈给您！');
      if (hasPermission) {
        for (let item of selectedItems) {
          item.isRegularItem() && (await Zotero.AI4Paper.translationEngineTask_title_abstract(item, "abstractNote"));
        }
        await new Promise(resolve => setTimeout(resolve, 0xc8));
        Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 翻译摘要【" + Zotero.Prefs.get('ai4paper.titleabstransengine') + '】', "您成功翻译【" + this._Num_translateAbstract + '】篇文献的摘要！');
      }
    }
  },
});
