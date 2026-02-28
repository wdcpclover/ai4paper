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
      const var2676 = Zotero.AI4Paper.translationServiceList();
      if (!var2676[this.serviceName]) return null;
      return {
        'secretId': var2676[this.serviceName].secret_id,
        'secretKey': var2676[this.serviceName].secret_key,
        'verifyResult': var2676[this.serviceName].api_verifyResult,
        'errorCodeLink': var2676[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': async function (param365, param366, param367) {
      const {
          host: _0x7df23,
          region: _0x279d51,
          projectId: _0xccaa91,
          version: _0x4dc179,
          action: _0x11aa4f,
          source: _0x4d96c4,
          target: _0x3f734b
        } = this.config,
        var2677 = new Date().getTime().toString().substring(0x0, 0xa),
        var2678 = "9744",
        var2679 = "Action=" + _0x11aa4f + "&Language=zh-CN&Nonce=" + var2678 + '&ProjectId=' + _0xccaa91 + "&Region=" + _0x279d51 + "&SecretId=" + param365 + "&Source=" + _0x4d96c4 + "&SourceText=#$#&Target=" + _0x3f734b + "&Timestamp=" + var2677 + "&Version=" + _0x4dc179,
        var2680 = 'POST' + _0x7df23 + '/?' + var2679.replace("#$#", param367),
        var2681 = await Zotero.AI4Paper.hmacSha1Digest(var2680, param366),
        var2682 = Zotero.AI4Paper.base64(var2681),
        var2683 = Zotero.AI4Paper.encodeRFC5987ValueChars(var2682),
        var2684 = Zotero.AI4Paper.encodeRFC5987ValueChars(param367),
        var2685 = var2679.replace("#$#", var2684) + "&Signature=" + var2683;
      return {
        'url': 'https://' + _0x7df23,
        'headers': {
          'Content-Type': "application/json"
        },
        'body': var2685
      };
    },
    'requestTranslation': async function (param368, param369, _0x5e3ba3 = 'noAlert', _0x1a6026 = false) {
      const var2686 = this.getCredentials();
      if ((!var2686.secretId || !var2686.secretKey) && _0x1a6026) {
        return window.alert('❌【' + this.serviceName + "】：请先输入 SecretId 和 SecretKey！"), -0x1;
      }
      if (!_0x1a6026 && var2686.verifyResult !== "验证成功") {
        if (_0x5e3ba3 === this.serviceName) {
          Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！");
        }
        return -0x1;
      }
      const var2687 = await this.prepareRequest(var2686.secretId, var2686.secretKey, param368);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", var2687.url, {
          'headers': var2687.headers,
          'body': var2687.body,
          'responseType': "json"
        });
      }, _0x3c3545 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const var2688 = _0x3c3545.response;
          if (var2688.Response && var2688.Response.Error) {
            const var2689 = var2688.Response.Error.Code,
              var2690 = var2688.Response.Error.Message,
              var2691 = "\n\n👉 常见错误码含义见：" + var2686.errorCodeLink;
            if (_0x1a6026) {
              throw new Error(var2689 + ':\x20' + var2690 + var2691);
            } else _0x5e3ba3 === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦：" + var2689 + ':\x20' + var2690 + var2691);
            return;
          }
          var2688.Response && var2688.Response.TargetText && param369(var2688.Response.TargetText);
        }
      }, _0x5e3ba3);
    }
  },
  'tencent_verifyAPI': async function (param370) {
    const var2692 = "hello";
    return await Zotero.AI4Paper.tencent_Helper.requestTranslation(var2692, _0x208cca => {
      Zotero.AI4Paper.apiModule_updateButtons("tencentVerifyResult", "tencent", param370, true);
    }, "alert", true);
  },
  'tencent_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var2693 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var2693) return;
    return await Zotero.AI4Paper.tencent_Helper.requestTranslation(var2693, _0xb57bdd => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.tencent_Helper.serviceName, var2693, _0xb57bdd);
    }, Zotero.AI4Paper.tencent_Helper.serviceName);
  },
  'tencent_transSelectedText': async function (param371) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.tencent_Helper.requestTranslation(param371, _0x10c44c => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", param371);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.tencent_Helper.serviceName, param371, _0x10c44c);
    }, Zotero.AI4Paper.tencent_Helper.serviceName);
  },
  'tencent_transAnnotation': async function (param372, param373) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var2694 = param372.annotationText;
    return await Zotero.AI4Paper.tencent_Helper.requestTranslation(var2694, _0x136946 => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param372, _0x136946, param373);
    }, "noAlert");
  },
  'tencent_transVocabulary': async function (param374, param375) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2695 = 0x0;
    return var2695 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param374, param375), await Zotero.AI4Paper.tencent_Helper.requestTranslation(param375, _0x246c2a => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param374, param375, _0x246c2a, var2695, "【收藏生词】- " + Zotero.AI4Paper.tencent_Helper.serviceName);
    }, "noAlert");
  },
  'tencent_transField': async function (param376, param377) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2696 = Zotero.AI4Paper.transField_getRaw(param376, param377);
    if (!var2696) return false;
    return await Zotero.AI4Paper.tencent_Helper.requestTranslation(var2696, _0x401973 => {
      Zotero.AI4Paper.transField_Handler(param376, param377, var2696, _0x401973);
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
      const var2697 = Zotero.AI4Paper.translationServiceList();
      if (!var2697[this.serviceName]) return null;
      return {
        'ak': var2697[this.serviceName].secret_id,
        'sk': var2697[this.serviceName].secret_key,
        'verifyResult': var2697[this.serviceName].api_verifyResult,
        'errorCodeLink': var2697[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': async function (param378, param379, param380) {
      const var2698 = this.config,
        var2699 = new Date().toISOString(),
        var2700 = Zotero.AI4Paper.randomString(0xc),
        var2701 = Zotero.AI4Paper.encodeRFC3986URIComponent(param380),
        var2702 = 'AccessKeyId=' + param378 + '&Action=' + var2698.action + '&Format=' + var2698.format + "&FormatType=" + var2698.formatType + '&SignatureMethod=' + var2698.sigMethod + '&SignatureNonce=' + encodeURIComponent(var2700) + "&SignatureVersion=" + var2698.sigVersion + "&SourceLanguage=" + var2698.sourceLang + '&SourceText=' + var2701 + "&TargetLanguage=" + var2698.targetLang + "&Timestamp=" + encodeURIComponent(var2699) + '&Version=' + var2698.version,
        var2703 = "POST&%2F&" + encodeURIComponent(var2702),
        var2704 = await Zotero.AI4Paper.hmacSha1Digest(var2703, param379 + '&'),
        var2705 = Zotero.AI4Paper.base64(var2704);
      return {
        'url': var2698.url,
        'headers': {
          'Content-Type': "application/x-www-form-urlencoded"
        },
        'body': var2702 + "&Signature=" + encodeURIComponent(var2705)
      };
    },
    'requestTranslation': async function (param381, param382, _0x3c8b08 = "noAlert", _0x1c2a66 = false) {
      const var2706 = this.getCredentials();
      if ((!var2706.ak || !var2706.sk) && _0x1c2a66) return window.alert('❌【' + this.serviceName + "】：请先输入 AccessKeyId 和 AccessKeySecret！"), -0x1;
      if (!_0x1c2a66 && var2706.verifyResult !== "验证成功") return _0x3c8b08 === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      const var2707 = await this.prepareRequest(var2706.ak, var2706.sk, param381);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request('POST', var2707.url, {
          'headers': var2707.headers,
          'body': var2707.body,
          'responseType': "json"
        });
      }, _0x287c48 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const _0x5505ac = _0x287c48.response;
          if (_0x5505ac.Code && _0x5505ac.Code !== "200") {
            const var2709 = _0x5505ac.Code,
              var2710 = _0x5505ac.Message,
              var2711 = "\n\n👉 常见错误码含义见：" + var2706.errorCodeLink;
            if (_0x1c2a66) throw new Error(var2709 + ':\x20' + var2710 + var2711);else _0x3c8b08 === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦：" + var2709 + ':\x20' + var2710 + var2711);
            return;
          }
          _0x5505ac.Data && _0x5505ac.Data.Translated && param382(_0x5505ac.Data.Translated);
        }
      }, _0x3c8b08);
    }
  },
  'alibaba_verifyAPI': async function (param383) {
    const var2712 = "Hello";
    return await Zotero.AI4Paper.alibaba_Helper.requestTranslation(var2712, _0x98593a => {
      Zotero.AI4Paper.apiModule_updateButtons("alibabaVerifyResult", "alibaba", param383, true);
    }, "alert", true);
  },
  'alibaba_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var2713 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var2713) return;
    return await Zotero.AI4Paper.alibaba_Helper.requestTranslation(var2713, _0x4c7ec7 => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.alibaba_Helper.serviceName, var2713, _0x4c7ec7);
    }, Zotero.AI4Paper.alibaba_Helper.serviceName);
  },
  'alibaba_transSelectedText': async function (param384) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.alibaba_Helper.requestTranslation(param384, _0xfa8dad => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", param384);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.alibaba_Helper.serviceName, param384, _0xfa8dad);
    }, Zotero.AI4Paper.alibaba_Helper.serviceName);
  },
  'alibaba_transAnnotation': async function (param385, param386) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var2714 = param385.annotationText;
    return await Zotero.AI4Paper.alibaba_Helper.requestTranslation(var2714, _0x3c45a5 => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param385, _0x3c45a5, param386);
    }, "noAlert");
  },
  'alibaba_transVocabulary': async function (param387, param388) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2715 = 0x0;
    return var2715 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param387, param388), await Zotero.AI4Paper.alibaba_Helper.requestTranslation(param388, _0x2a3539 => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param387, param388, _0x2a3539, var2715, "【收藏生词】- " + Zotero.AI4Paper.alibaba_Helper.serviceName);
    }, 'noAlert');
  },
  'alibaba_transField': async function (param389, param390) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2716 = Zotero.AI4Paper.transField_getRaw(param389, param390);
    if (!var2716) return false;
    return await Zotero.AI4Paper.alibaba_Helper.requestTranslation(var2716, _0x5dc52b => {
      Zotero.AI4Paper.transField_Handler(param389, param390, var2716, _0x5dc52b);
    }, "noAlert");
  },
  'baidu_Helper': {
    'endpoints': {
      'standard': 'https://fanyi-api.baidu.com/api/trans/vip/translate',
      'field': "http://api.fanyi.baidu.com/api/trans/vip/fieldtranslate",
      'llm': "https://fanyi-api.baidu.com/ait/api/aiTextTranslate"
    },
    'getCredentials': function (param391) {
      const var2717 = Zotero.AI4Paper.translationServiceList()[param391];
      return {
        'appid': var2717.app_id,
        'appkey': var2717.app_key,
        'apikey': var2717.api_key,
        'domain': var2717.field,
        'terminology': var2717.enabelTerminologyDatabase,
        'verifyResult': var2717.api_verifyResult,
        'errorCodeLink': var2717.errorCode_link
      };
    },
    'buildRequestUrl': function (param392, param393, param394) {
      const var2718 = new Date().getTime(),
        var2719 = "auto",
        var2720 = 'zh';
      let var2721, var2722;
      if (param394 === "百度垂直🔑") {
        var2721 = Zotero.Utilities.Internal.md5('' + param393.appid + param392 + var2718 + param393.domain + param393.appkey);
        var2722 = this.endpoints.field;
      } else {
        var2721 = Zotero.Utilities.Internal.md5('' + param393.appid + param392 + var2718 + param393.appkey);
        var2722 = param394 === "百度🔑" ? this.endpoints.standard : this.endpoints.llm;
      }
      let var2723 = 'q=' + encodeURIComponent(param392) + "&from=" + var2719 + "&to=" + var2720 + "&appid=" + param393.appid + "&salt=" + var2718 + "&sign=" + var2721;
      if (param394 === "百度垂直🔑") {
        var2723 += "&domain=" + param393.domain;
      }
      return param393.terminology ? var2723 += "&needIntervene=1" : var2723 += "&needIntervene=0", var2722 + '?' + var2723;
    },
    'requestTranslation': async function (param395, param396, _0x3fb4ce = {}) {
      const {
          serviceName = "百度🔑",
          alertType = "noAlert",
          isVerify = false
        } = _0x3fb4ce,
        var2724 = this.getCredentials(serviceName);
      if ((!var2724.appid || !var2724.appkey) && isVerify) return window.alert('❌【' + serviceName + "】：请先输入 AppID 和 AppKey！"), -0x1;
      if (!isVerify && serviceName === "百度大模型🔑" && (!var2724.appid || !var2724.appkey || !var2724.apikey)) return Zotero.AI4Paper.translateReaderSidePane_showErrorMessage('❌【' + serviceName + "】：请先前往【Zotero 设置 --> AI4paper --> 翻译 API】输入 AppID、AppKey、以及 API-Key！"), -0x1;
      if (!isVerify && var2724.verifyResult !== "验证成功") return alertType === serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      const var2725 = this.buildRequestUrl(param395, var2724, serviceName);
      let var2726 = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      if (serviceName === "百度大模型🔑") {
        var2726.Authorization = "Bearer " + var2724.apikey;
      }
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", var2725, {
          'headers': var2726,
          'responseType': "json"
        });
      }, _0x2ef3b1 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const _0x514f7c = _0x2ef3b1.response;
          if (_0x514f7c.error_code && _0x514f7c.error_code !== "52000") {
            const var2728 = _0x514f7c.error_code + ':\x20' + _0x514f7c.error_msg,
              var2729 = "\n\n👉 常见错误码含义见：" + var2724.errorCodeLink;
            if (isVerify) throw new Error('' + var2728 + var2729);else Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + serviceName + "】出错啦：" + var2728 + var2729);
            return;
          }
          if (_0x514f7c.trans_result) {
            let _0x1d3486 = '';
            for (let var2731 = 0x0; var2731 < _0x514f7c.trans_result.length; var2731++) {
              _0x1d3486 += _0x514f7c.trans_result[var2731].dst;
            }
            param396(_0x1d3486);
          }
        }
      }, alertType);
    }
  },
  'baidu_verifyAPI': async function (param397) {
    let var2732 = "百度🔑";
    const var2733 = 'hello';
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(var2733, _0x5ca2d2 => {
      Zotero.AI4Paper.apiModule_updateButtons('baidufanyiverifyresult', 'baidufanyi', param397, true);
    }, {
      'serviceName': var2732,
      'alertType': "alert",
      'isVerify': true
    });
  },
  'baidu_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var2734 = "百度🔑";
    const var2735 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var2735) return;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(var2735, _0x4c0540 => {
      Zotero.AI4Paper.transbyShortCuts_Handler(var2734, var2735, _0x4c0540);
    }, {
      'serviceName': var2734,
      'alertType': var2734
    });
  },
  'baiduField_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var2736 = '百度垂直🔑';
    const var2737 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var2737) return;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(var2737, _0xfe429a => {
      Zotero.AI4Paper.transbyShortCuts_Handler(var2736, var2737, _0xfe429a);
    }, {
      'serviceName': var2736,
      'alertType': var2736
    });
  },
  'baiduLLM_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var2738 = "百度大模型🔑";
    const var2739 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var2739) return;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(var2739, _0x5031d8 => {
      Zotero.AI4Paper.transbyShortCuts_Handler(var2738, var2739, _0x5031d8);
    }, {
      'serviceName': var2738,
      'alertType': var2738
    });
  },
  'baidu_transSelectedText': async function (param398, param399) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(param398, _0x3c085a => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", param398);
      Zotero.AI4Paper.transbyShortCuts_Handler(param399, param398, _0x3c085a);
    }, {
      'serviceName': param399,
      'alertType': param399
    });
  },
  'baidu_transAnnotation': async function (param400, param401, param402) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var2740 = param400.annotationText;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(var2740, _0x4d991a => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param400, _0x4d991a, param401);
    }, {
      'serviceName': param402,
      'alertType': "noAlert"
    });
  },
  'baidu_transVocabulary': async function (param403, param404, param405) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2741 = 0x0;
    return var2741 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param403, param404), await Zotero.AI4Paper.baidu_Helper.requestTranslation(param404, _0x1b8ee0 => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param403, param404, _0x1b8ee0, var2741, '【收藏生词】-\x20' + param405);
    }, {
      'serviceName': param405,
      'alertType': 'noAlert'
    });
  },
  'baidu_transField': async function (param406, param407, param408) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2742 = Zotero.AI4Paper.transField_getRaw(param406, param407);
    if (!var2742) return false;
    return await Zotero.AI4Paper.baidu_Helper.requestTranslation(var2742, _0x22ae52 => {
      Zotero.AI4Paper.transField_Handler(param406, param407, var2742, _0x22ae52);
    }, {
      'serviceName': param408,
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
      const var2743 = Zotero.AI4Paper.translationServiceList();
      if (!var2743[this.serviceName]) return null;
      return {
        'appId': var2743[this.serviceName].app_id,
        'appKey': var2743[this.serviceName].app_key,
        'verifyResult': var2743[this.serviceName].api_verifyResult,
        'errorCodeLink': var2743[this.serviceName].errorCode_link
      };
    },
    'truncate': function (param409) {
      const var2744 = param409.length;
      if (var2744 <= 0x14) return param409;
      return param409.substring(0x0, 0xa) + var2744 + param409.substring(var2744 - 0xa, var2744);
    },
    'prepareRequest': function (param410, param411, param412) {
      const var2745 = this.config,
        var2746 = new Date().getTime(),
        var2747 = Math.round(new Date().getTime() / 0x3e8),
        var2748 = '' + param410 + this.truncate(param412) + var2746 + var2747 + param411,
        var2749 = Zotero.AI4Paper._CryptoJS.SHA256(var2748).toString(Zotero.AI4Paper._CryptoJS.enc.Hex),
        var2750 = var2745.url + "?q=" + encodeURIComponent(param412) + "&appKey=" + param410 + "&salt=" + var2746 + "&from=" + var2745.from + '&to=' + var2745.to + "&sign=" + var2749 + "&signType=" + var2745.version + "&curtime=" + var2747 + "&domain=" + var2745.domain;
      return {
        'url': var2750,
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
    },
    'requestTranslation': async function (param413, param414, _0x516a3b = 'noAlert', _0x4ee832 = false) {
      const var2751 = this.getCredentials();
      if ((!var2751.appId || !var2751.appKey) && _0x4ee832) {
        return window.alert('❌【' + this.serviceName + "】：请先输入 AppID 和 AppKey！"), -0x1;
      }
      if (!_0x4ee832 && var2751.verifyResult !== "验证成功") {
        return _0x516a3b === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      }
      const var2752 = this.prepareRequest(var2751.appId, var2751.appKey, param413);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request('GET', var2752.url, {
          'headers': var2752.headers,
          'responseType': 'json'
        });
      }, _0x23ec6c => {
        if (Zotero.AI4Paper.runAuthor()) {
          const _0x1be5a6 = _0x23ec6c.response;
          if (_0x1be5a6.errorCode !== '0') {
            const _0x5ae40c = _0x1be5a6.errorCode,
              _0x1c62b3 = "\n\n👉 常见错误码含义见：" + var2751.errorCodeLink;
            if (_0x4ee832) throw new Error('❌【' + this.serviceName + "】验证失败！（errorCode：" + _0x5ae40c + '）' + _0x1c62b3);else _0x516a3b === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦！（errorCode：" + _0x5ae40c + '）' + _0x1c62b3);
            return;
          }
          _0x1be5a6.translation && _0x1be5a6.translation.length > 0x0 && param414(_0x1be5a6.translation.join(''));
        }
      }, _0x516a3b);
    }
  },
  'youdao_verifyAPI': async function (param415) {
    const var2756 = "hello";
    return await Zotero.AI4Paper.youdao_Helper.requestTranslation(var2756, _0x28456b => {
      Zotero.AI4Paper.apiModule_updateButtons("youdaoVerifyResult", "youdao", param415, true);
    }, 'alert', true);
  },
  'youdao_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var2757 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var2757) return;
    return await Zotero.AI4Paper.youdao_Helper.requestTranslation(var2757, _0x11f6dd => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.youdao_Helper.serviceName, var2757, _0x11f6dd);
    }, Zotero.AI4Paper.youdao_Helper.serviceName);
  },
  'youdao_transSelectedText': async function (param416) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.youdao_Helper.requestTranslation(param416, _0x1d6169 => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", param416);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.youdao_Helper.serviceName, param416, _0x1d6169);
    }, Zotero.AI4Paper.youdao_Helper.serviceName);
  },
  'youdao_transAnnotation': async function (param417, param418) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var2758 = param417.annotationText;
    return await Zotero.AI4Paper.youdao_Helper.requestTranslation(var2758, _0x9ab51 => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param417, _0x9ab51, param418);
    }, "noAlert");
  },
  'youdao_transVocabulary': async function (param419, param420) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2759 = 0x0;
    return var2759 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param419, param420), await Zotero.AI4Paper.youdao_Helper.requestTranslation(param420, _0x5ad5c1 => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param419, param420, _0x5ad5c1, var2759, "【收藏生词】- " + Zotero.AI4Paper.youdao_Helper.serviceName);
    }, 'noAlert');
  },
  'youdao_transField': async function (param421, param422) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2760 = Zotero.AI4Paper.transField_getRaw(param421, param422);
    if (!var2760) return false;
    return await Zotero.AI4Paper.youdao_Helper.requestTranslation(var2760, _0x34c132 => {
      Zotero.AI4Paper.transField_Handler(param421, param422, var2760, _0x34c132);
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
      const var2761 = Zotero.AI4Paper.translationServiceList();
      if (!var2761[this.serviceName]) return null;
      return {
        'ak': var2761[this.serviceName].secret_id,
        'sk': var2761[this.serviceName].secret_key,
        'verifyResult': var2761[this.serviceName].api_verifyResult,
        'errorCodeLink': var2761[this.serviceName].errorCode_link
      };
    },
    'signRequest': function (param423, param424, param425) {
      const var2762 = Zotero.AI4Paper._CryptoJS,
        var2763 = new Date(),
        var2764 = var2763.toISOString().replace(/[:-]|\.\d{3}/g, ''),
        var2765 = var2764.substring(0x0, 0x8),
        {
          service: _0x5acb53,
          region: _0x468b28,
          host: _0xdebe7f,
          action: _0x3c39ec,
          version: _0xa70bef
        } = this.config,
        var2766 = "POST",
        var2767 = "application/json; charset=utf-8",
        var2768 = "Action=" + _0x3c39ec + "&Version=" + _0xa70bef,
        var2769 = 'content-type;host;x-date;x-content-sha256',
        var2770 = var2762.SHA256(param425).toString(var2762.enc.Hex),
        var2771 = [var2766, this.config.path, var2768, 'content-type:' + var2767 + "\nhost:" + _0xdebe7f + "\nx-date:" + var2764 + "\nx-content-sha256:" + var2770 + '\x0a', var2769, var2770].join('\x0a'),
        var2772 = var2765 + '/' + _0x468b28 + '/' + _0x5acb53 + "/request",
        var2773 = ['HMAC-SHA256', var2764, var2772, var2762.SHA256(var2771).toString(var2762.enc.Hex)].join('\x0a'),
        var2774 = var2762.HmacSHA256(var2765, param424),
        var2775 = var2762.HmacSHA256(_0x468b28, var2774),
        var2776 = var2762.HmacSHA256(_0x5acb53, var2775),
        var2777 = var2762.HmacSHA256("request", var2776),
        var2778 = var2762.HmacSHA256(var2773, var2777).toString(var2762.enc.Hex),
        var2779 = "HMAC-SHA256 Credential=" + param423 + '/' + var2772 + ',\x20SignedHeaders=' + var2769 + ", Signature=" + var2778;
      return {
        'url': "https://" + _0xdebe7f + this.config.path + '?' + var2768,
        'headers': {
          'Content-Type': var2767,
          'Host': _0xdebe7f,
          'X-Date': var2764,
          'X-Content-Sha256': var2770,
          'Authorization': var2779
        }
      };
    },
    'requestTranslation': async function (param426, param427, _0x10cd24 = "noAlert", _0x5eedad = false) {
      const var2780 = this.getCredentials();
      if ((!var2780.ak || !var2780.sk) && _0x5eedad) return window.alert('❌【' + this.serviceName + '】：请先输入\x20AccessKeyld\x20和\x20AccessKeySecret！'), -0x1;
      if (!_0x5eedad && var2780.verifyResult !== "验证成功") {
        if (_0x10cd24 === this.serviceName) {
          Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + '】API-Key！\x0a\x0a请先前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20翻译\x20API】完成验证！');
        }
        return -0x1;
      }
      const var2781 = {
          'SourceLanguage': '',
          'TargetLanguage': this.config.targetLang,
          'TextList': [param426],
          'Options': {
            'Category': "system"
          }
        },
        var2782 = JSON.stringify(var2781),
        var2783 = this.signRequest(var2780.ak, var2780.sk, var2782);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", var2783.url, {
          'headers': var2783.headers,
          'body': var2782,
          'responseType': 'json'
        });
      }, _0x12b7f8 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const _0x24c2a2 = _0x12b7f8.response;
          if (_0x24c2a2.ResponseMetadata && _0x24c2a2.ResponseMetadata.Error) {
            const var2785 = JSON.stringify(_0x24c2a2.ResponseMetadata.Error),
              var2786 = '\x0a\x0a👉\x20常见错误码含义见：' + var2780.errorCodeLink;
            if (_0x5eedad) {
              throw new Error('' + var2785 + var2786);
            } else {
              if (_0x10cd24 === this.serviceName) {
                Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦！\n\n" + var2785 + var2786);
                return;
              }
            }
          }
          _0x24c2a2.TranslationList && _0x24c2a2.TranslationList[0x0].Translation && param427(_0x24c2a2.TranslationList[0x0].Translation);
        }
      }, _0x10cd24);
    }
  },
  'volcano_verifyAPI': async function (param428) {
    const var2787 = "hello";
    return await Zotero.AI4Paper.volcano_Helper.requestTranslation(var2787, _0x1216b4 => {
      Zotero.AI4Paper.apiModule_updateButtons("volcanoVerifyResult", "volcano", param428, true);
    }, "alert", true);
  },
  'volcano_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var2788 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var2788) return;
    return await Zotero.AI4Paper.volcano_Helper.requestTranslation(var2788, _0x3b8f5d => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.volcano_Helper.serviceName, var2788, _0x3b8f5d);
    }, Zotero.AI4Paper.volcano_Helper.serviceName);
  },
  'volcano_transSelectedText': async function (param429) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.volcano_Helper.requestTranslation(param429, _0x176411 => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", param429);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.volcano_Helper.serviceName, param429, _0x176411);
    }, Zotero.AI4Paper.volcano_Helper.serviceName);
  },
  'volcano_transAnnotation': async function (param430, param431) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var2789 = param430.annotationText;
    return await Zotero.AI4Paper.volcano_Helper.requestTranslation(var2789, _0x30f1e7 => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param430, _0x30f1e7, param431);
    }, "noAlert");
  },
  'volcano_transVocabulary': async function (param432, param433) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2790 = 0x0;
    return var2790 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param432, param433), await Zotero.AI4Paper.volcano_Helper.requestTranslation(param433, _0x22297e => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param432, param433, _0x22297e, var2790, "【收藏生词】- " + Zotero.AI4Paper.volcano_Helper.serviceName);
    }, "noAlert");
  },
  'volcano_transField': async function (param434, param435) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2791 = Zotero.AI4Paper.transField_getRaw(param434, param435);
    if (!var2791) return false;
    return await Zotero.AI4Paper.volcano_Helper.requestTranslation(var2791, _0x5a0864 => {
      Zotero.AI4Paper.transField_Handler(param434, param435, var2791, _0x5a0864);
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
      const var2792 = Zotero.AI4Paper.translationServiceList();
      if (!var2792[this.serviceName]) return null;
      return {
        'apiKey': var2792[this.serviceName].api_key,
        'verifyResult': var2792[this.serviceName].api_verifyResult,
        'errorCodeLink': var2792[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': function (param436, param437) {
      const var2793 = this.config,
        var2794 = var2793.url + '?from=' + var2793.from + '&to=' + var2793.to + "&apikey=" + param436,
        var2795 = {
          'src_text': param437,
          'apikey': param436,
          'from': var2793.from,
          'to': var2793.to
        };
      return {
        'url': var2794,
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify(var2795)
      };
    },
    'requestTranslation': async function (param438, param439, _0x444f2c = "noAlert", _0x1c6389 = false) {
      const var2796 = this.getCredentials();
      if (!var2796.apiKey && _0x1c6389) return window.alert('❌【' + this.serviceName + "】：请先输入 API-Key！"), -0x1;
      if (!_0x1c6389 && var2796.verifyResult !== "验证成功") {
        return _0x444f2c === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      }
      const var2797 = this.prepareRequest(var2796.apiKey, param438);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", var2797.url, {
          'headers': var2797.headers,
          'body': var2797.body,
          'responseType': 'json'
        });
      }, _0x3baa5f => {
        if (Zotero.AI4Paper.runAuthor()) {
          const _0x393e0e = _0x3baa5f.response;
          if (_0x393e0e.error_msg) {
            const var2799 = _0x393e0e.error_code,
              var2800 = _0x393e0e.error_msg,
              var2801 = '\x0a\x0a👉\x20常见错误码含义见：' + var2796.errorCodeLink;
            if (_0x1c6389) throw new Error(var2799 + ':\x20' + var2800 + var2801);else {
              if (_0x444f2c === this.serviceName) {
                Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦：" + var2799 + ':\x20' + var2800 + var2801);
              }
            }
            return;
          }
          _0x393e0e.tgt_text && param439(_0x393e0e.tgt_text);
        }
      }, _0x444f2c);
    }
  },
  'niutrans_verifyAPI': async function (param440) {
    const var2802 = "Hello";
    return await Zotero.AI4Paper.niutrans_Helper.requestTranslation(var2802, _0x9bd7d => {
      Zotero.AI4Paper.apiModule_updateButtons("niutransverifyresult", "niutrans", param440, true);
    }, "alert", true);
  },
  'niutrans_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var2803 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var2803) return;
    return await Zotero.AI4Paper.niutrans_Helper.requestTranslation(var2803, _0x1a1f3e => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.niutrans_Helper.serviceName, var2803, _0x1a1f3e);
    }, Zotero.AI4Paper.niutrans_Helper.serviceName);
  },
  'niutrans_transSelectedText': async function (param441) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.niutrans_Helper.requestTranslation(param441, _0x6cc8ac => {
      Zotero.Prefs.set('ai4paper.selectedtexttrans', param441);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.niutrans_Helper.serviceName, param441, _0x6cc8ac);
    }, Zotero.AI4Paper.niutrans_Helper.serviceName);
  },
  'niutrans_transAnnotation': async function (param442, param443) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var2804 = param442.annotationText;
    return await Zotero.AI4Paper.niutrans_Helper.requestTranslation(var2804, _0x18516f => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param442, _0x18516f, param443);
    }, "noAlert");
  },
  'niutrans_transVocabulary': async function (param444, param445) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2805 = 0x0;
    return var2805 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param444, param445), await Zotero.AI4Paper.niutrans_Helper.requestTranslation(param445, _0x13942c => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param444, param445, _0x13942c, var2805, '【收藏生词】-\x20' + Zotero.AI4Paper.niutrans_Helper.serviceName);
    }, "noAlert");
  },
  'niutrans_transField': async function (param446, param447) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2806 = Zotero.AI4Paper.transField_getRaw(param446, param447);
    if (!var2806) return false;
    return await Zotero.AI4Paper.niutrans_Helper.requestTranslation(var2806, _0x341c01 => {
      Zotero.AI4Paper.transField_Handler(param446, param447, var2806, _0x341c01);
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
      const var2807 = Zotero.AI4Paper.translationServiceList();
      if (!var2807[this.serviceName]) return null;
      return {
        'apiKey': var2807[this.serviceName].api_key,
        'verifyResult': var2807[this.serviceName].api_verifyResult,
        'errorCodeLink': var2807[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': function (param448, param449) {
      const var2808 = this.config,
        var2809 = {
          'source': [param449],
          'trans_type': var2808.source + '2' + var2808.target,
          'request_id': 'demo',
          'detect': true,
          'protocol': var2808.protocol
        };
      return {
        'url': var2808.url,
        'headers': {
          'Content-Type': "application/json",
          'X-Authorization': 'token\x20' + param448
        },
        'body': JSON.stringify(var2809)
      };
    },
    'requestTranslation': async function (param450, param451, _0x5f4587 = "noAlert", _0x5e0a75 = false) {
      const var2810 = this.getCredentials();
      if (!var2810.apiKey && _0x5e0a75) return window.alert('❌【' + this.serviceName + "】：请先输入 API-Key！"), -0x1;
      if (!_0x5e0a75 && var2810.verifyResult !== "验证成功") return _0x5f4587 === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      const var2811 = this.prepareRequest(var2810.apiKey, param450);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", var2811.url, {
          'headers': var2811.headers,
          'body': var2811.body,
          'responseType': "json"
        });
      }, _0x8130e1 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const var2812 = _0x8130e1.response;
          if (var2812.message) {
            const _0xb415fe = var2812.message,
              _0x2ce64d = "\n\n👉 常见错误码含义见：" + var2810.errorCodeLink;
            if (_0x5e0a75) throw new Error('' + _0xb415fe + _0x2ce64d);else _0x5f4587 === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + '】出错啦：' + _0xb415fe + _0x2ce64d);
            return;
          }
          var2812.target && param451(var2812.target);
        }
      }, _0x5f4587);
    }
  },
  'caiyunxiaoyi_verifyAPI': async function (param452) {
    const var2815 = 'Hello';
    return await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(var2815, _0x4722c2 => {
      Zotero.AI4Paper.apiModule_updateButtons('caiyunxiaoyiverifyresult', "caiyunxiaoyi", param452, true);
    }, "alert", true);
  },
  'caiyunxiaoyi_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var2816 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var2816) return;
    return await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(var2816, _0x2eba09 => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.caiyunxiaoyi_Helper.serviceName, var2816, _0x2eba09);
    }, Zotero.AI4Paper.caiyunxiaoyi_Helper.serviceName);
  },
  'caiyunxiaoyi_transSelectedText': async function (param453) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(param453, _0x171545 => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", param453);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.caiyunxiaoyi_Helper.serviceName, param453, _0x171545);
    }, Zotero.AI4Paper.caiyunxiaoyi_Helper.serviceName);
  },
  'caiyunxiaoyi_transAnnotation': async function (param454, param455) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var2817 = param454.annotationText;
    return await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(var2817, _0x49fe4e => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param454, _0x49fe4e, param455);
    }, "noAlert");
  },
  'caiyunxiaoyi_transVocabulary': async function (param456, param457) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2818 = 0x0;
    return var2818 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param456, param457), await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(param457, _0x4e1225 => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param456, param457, _0x4e1225, var2818, "【收藏生词】- " + Zotero.AI4Paper.caiyunxiaoyi_Helper.serviceName);
    }, 'noAlert');
  },
  'caiyunxiaoyi_transField': async function (param458, param459) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2819 = Zotero.AI4Paper.transField_getRaw(param458, param459);
    if (!var2819) return false;
    return await Zotero.AI4Paper.caiyunxiaoyi_Helper.requestTranslation(var2819, _0x5cf8e3 => {
      Zotero.AI4Paper.transField_Handler(param458, param459, var2819, _0x5cf8e3);
    }, "noAlert");
  },
  'updateTranslateReaderSidePanePlaceHolder': function (param460) {
    if (!Zotero.Prefs.get("ai4paper.translationreadersidepane")) return false;
    var var2820;
    if (window.document.getElementById("ai4paper-translate-readersidepane")) var2820 = window.document.getElementById("ai4paper-translate-readersidepane").contentWindow;else return false;
    if (!var2820) return;
    var2820.document.getElementById("ai4paper-translate-readerSidePane-response").placeholder = "这里显示翻译结果";
    if (param460 === "start") {
      var2820.document.getElementById("ai4paper-translate-readerSidePane-response").placeholder = "正在请求...";
      var2820.document.getElementById("ai4paper-translate-readerSidePane-response").style.boxShadow = "0 0 4px blue";
    } else param460 === 'done' && (var2820.document.getElementById('ai4paper-translate-readerSidePane-response').placeholder = "这里显示翻译结果", var2820.document.getElementById('ai4paper-translate-readerSidePane-response').style.boxShadow = "0 0 1px rgba(0, 0, 0, 0.5)");
  },
  'gptTranslation_onStreamDone': function (param461, param462) {
    Zotero.Prefs.set("ai4paper.selectedtexttrans", param462);
    Zotero.Prefs.get('ai4paper.translationreadersidepane') && (Zotero.AI4Paper.translateResponse = param461, Zotero.AI4Paper.updateTranslateReaderSidePane(), Zotero.AI4Paper.updateTranslateReaderSidePanePlaceHolder('done'));
    Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea') && (Zotero.AI4Paper.updateTranslationPopupTextArea(param461), Zotero.AI4Paper.updateTranslationPopupTextAreaBoxShadow('done'));
    Zotero.AI4Paper.trans2ViewerANDRecord(param462, param461);
    Zotero.Prefs.get("ai4paper.translationautocopy") && Zotero.AI4Paper.copy2Clipboard(param461);
  },
  'getQuestion_gptTranslation': function (param463, param464) {
    let var2821 = "作为一名精通简体中文的专业翻译家，请将所提供的文本准确地翻译为简体中文。请仅回复翻译好的句子，不要其他内容。【待翻译文本】如下";
    if (param464 === "transSelectedText") return (Zotero.Prefs.get("ai4paper.translationOpenAIPromptTemplate") ? Zotero.Prefs.get("ai4paper.translationOpenAIPromptTemplate") : var2821) + ":\n\n" + param463;else {
      if (param464 === "transAnnotation") return (Zotero.Prefs.get('ai4paper.annotationTranslationPrompt').trim() ? Zotero.Prefs.get("ai4paper.annotationTranslationPrompt") : var2821) + ":\n\n" + param463;
    }
  },
  'catchStreamError_gptTranslation': function (param465, param466, param467) {
    try {
      if (typeof JSON.parse(param467) === "object") {
        let var2822;
        if (JSON.parse(param467).error || JSON.parse(param467).object === "error") var2822 = "⚠️ [请求错误]\n\n❌ " + param465 + '\x20出错啦：' + param467 + "\n\n🔗【" + param465 + " 错误码含义】请见：\n" + param466;else JSON.parse(param467)[0x0]?.["error"] && (var2822 = "⚠️ [请求错误]\n\n❌ " + param465 + '\x20出错啦：\x22error\x22:\x20{\x0a\x22code\x22:\x20' + JSON.parse(param467)[0x0]?.["error"]["code"] + ",\n\"message\": \"" + JSON.parse(param467)[0x0]?.["error"]["message"] + '\x22,\x0a}\x0a\x0a🔗【' + param465 + " 错误码含义】请见：\n" + param466);
        if (var2822) {
          return Zotero.AI4Paper.translateReaderSidePane_showErrorMessage(var2822), Zotero.AI4Paper.updateTranslationPopupTextAreaBoxShadow('done'), false;
        }
      }
    } catch (_0x586bf3) {
      return Zotero.debug("gptTranslation Stream Error: " + _0x586bf3), true;
    }
    return true;
  },
  'catchFetchError_gptTranslation': function (param468, param469, param470) {
    let var2823 = "⚠️ [请求错误]\n\n❌ " + param468 + '\x20出错啦：' + param470 + "\n\n🔗【" + param468 + " 错误码含义】请见：\n" + param469;
    Zotero.AI4Paper.translateReaderSidePane_showErrorMessage(var2823);
    Zotero.AI4Paper.updateTranslationPopupTextAreaBoxShadow("done");
  },
  'startFetch_gptTranslation': async function (param471, param472, param473, param474, param475, param476) {
    Zotero.AI4Paper.updateTranslateReaderSidePanePlaceHolder("start");
    Zotero.AI4Paper.updateTranslationPopupTextAreaBoxShadow('start');
    let var2824 = {
      'temp': '',
      'target': '',
      'html4Refs': '',
      'hasReasoning_content': false,
      'reasoning_contentStart': false,
      'reasoning_contentEnd': false
    };
    var var2825 = Zotero.AI4Paper.gptReaderSidePane_getRequestOptions(param475, param472, param473);
    fetch(param471, var2825).then(_0x437c60 => {
      return !_0x437c60.ok && (Zotero.debug("gptTranslation Response Error: " + _0x437c60), Zotero.AI4Paper.showProgressWindow(0x9c4, "GPT 翻译请求失败【Zoteor One】", 'Fetch\x20request\x20to\x20' + param471 + " failed: HTTP status " + _0x437c60.status + " - " + _0x437c60.statusText)), _0x437c60.body;
    }).then(_0x40491d => {
      let var2826 = _0x40491d.getReader();
      fn14();
      function fn14() {
        return var2826.read().then(({
          done: _0x46c09b,
          value: _0x3147d3
        }) => {
          if (_0x46c09b) {
            Zotero.AI4Paper.gptTranslation_onStreamDone(var2824.target, param474);
            return;
          }
          let _0x3b8943 = new TextDecoder("utf-8").decode(_0x3147d3, {
            'stream': true
          });
          if (!Zotero.AI4Paper.catchStreamError_gptTranslation(param475, param476, _0x3b8943)) return;
          Zotero.AI4Paper.resolveStreamChunk(_0x3b8943, var2824, param475);
          Zotero.Prefs.set('ai4paper.selectedtexttrans', param474);
          Zotero.Prefs.get("ai4paper.translationreadersidepane") && (Zotero.AI4Paper.translateResponse = var2824.target, Zotero.AI4Paper.updateTranslateReaderSidePane());
          Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea') && Zotero.AI4Paper.updateTranslationPopupTextArea(var2824.target);
          fn14();
        });
      }
    })["catch"](_0x2c79d3 => {
      Zotero.AI4Paper.catchFetchError_gptTranslation(param475, param476, _0x2c79d3);
    });
  },
  'openAI_transSelectedText': async function (param477) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2828 = "OpenAI";
    var var2829 = Zotero.AI4Paper.gptServiceList()[var2828].api_key,
      var2830 = Zotero.AI4Paper.gptServiceList()[var2828].base_url + "/v1/chat/completions";
    let var2831 = Zotero.AI4Paper.gptServiceList()[var2828].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2829, var2828, true, 'translation')) return false;
    var var2832 = Zotero.AI4Paper.getQuestion_gptTranslation(param477, 'transSelectedText'),
      var2833 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2828].modelLabel, 'isTranslation'),
      var2834 = {
        'model': var2833,
        'messages': [{
          'role': "user",
          'content': var2832
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var2830, var2829, var2834, param477, var2828, var2831);
  },
  'openAI_Helper': {
    'serviceName': "OpenAI",
    'getCredentials': function () {
      const var2835 = Zotero.AI4Paper.translationServiceList();
      if (!var2835[this.serviceName]) return null;
      return {
        'secretId': var2835[this.serviceName].secret_id,
        'secretKey': var2835[this.serviceName].secret_key,
        'verifyResult': var2835[this.serviceName].api_verifyResult,
        'errorCodeLink': var2835[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': async function (param478, param479, param480) {
      const {
          host: _0x14c3b2,
          region: _0xf7c2b4,
          projectId: _0x5cde74,
          version: _0x4b1333,
          action: _0x1c17bf,
          source: _0x5162ee,
          target: _0x5d67f0
        } = this.config,
        var2836 = new Date().getTime().toString().substring(0x0, 0xa),
        var2837 = "9744",
        var2838 = "Action=" + _0x1c17bf + "&Language=zh-CN&Nonce=" + var2837 + "&ProjectId=" + _0x5cde74 + "&Region=" + _0xf7c2b4 + "&SecretId=" + param478 + "&Source=" + _0x5162ee + "&SourceText=#$#&Target=" + _0x5d67f0 + "&Timestamp=" + var2836 + "&Version=" + _0x4b1333,
        var2839 = 'POST' + _0x14c3b2 + '/?' + var2838.replace("#$#", param480),
        var2840 = await Zotero.AI4Paper.hmacSha1Digest(var2839, param479),
        var2841 = Zotero.AI4Paper.base64(var2840),
        var2842 = Zotero.AI4Paper.encodeRFC5987ValueChars(var2841),
        var2843 = Zotero.AI4Paper.encodeRFC5987ValueChars(param480),
        var2844 = var2838.replace("#$#", var2843) + "&Signature=" + var2842;
      return {
        'url': "https://" + _0x14c3b2,
        'headers': {
          'Content-Type': 'application/json'
        },
        'body': var2844
      };
    },
    'requestTranslation': async function (param481, param482, _0x2fc8c4 = "noAlert", _0x53e7c6 = false) {
      const var2845 = this.getCredentials();
      if ((!var2845.secretId || !var2845.secretKey) && _0x53e7c6) return window.alert('❌【' + this.serviceName + "】：请先输入 SecretId 和 SecretKey！"), -0x1;
      if (!_0x53e7c6 && var2845.verifyResult !== '验证成功') {
        return _0x2fc8c4 === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage('❌\x20尚未验证【' + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      }
      const var2846 = await this.prepareRequest(var2845.secretId, var2845.secretKey, param481);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", var2846.url, {
          'headers': var2846.headers,
          'body': var2846.body,
          'responseType': "json"
        });
      }, _0x2f5aa5 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const var2847 = _0x2f5aa5.response;
          if (var2847.Response && var2847.Response.Error) {
            const _0x5b5c6e = var2847.Response.Error.Code,
              _0x343e0b = var2847.Response.Error.Message,
              _0x4e0fda = "\n\n👉 常见错误码含义见：" + var2845.errorCodeLink;
            if (_0x53e7c6) {
              throw new Error(_0x5b5c6e + ':\x20' + _0x343e0b + _0x4e0fda);
            } else _0x2fc8c4 === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("[请求错误]\n\n【" + this.serviceName + "】出错啦：" + _0x5b5c6e + ':\x20' + _0x343e0b + _0x4e0fda);
            return;
          }
          var2847.Response && var2847.Response.TargetText && param482(var2847.Response.TargetText);
        }
      }, _0x2fc8c4);
    }
  },
  'openAI_transAnnotation': async function (param483, param484) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2851 = 'OpenAI';
    var var2852 = Zotero.AI4Paper.gptServiceList()[var2851].api_key,
      var2853 = Zotero.AI4Paper.gptServiceList()[var2851].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2852, var2851, false)) return false;
    var var2854 = param483.annotationText,
      var2855 = Zotero.AI4Paper.getQuestion_gptTranslation(var2854, "transAnnotation"),
      var2856 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2851].modelLabel, 'isTranslation'),
      var2857 = {
        'model': var2856,
        'messages': [{
          'role': "user",
          'content': var2855
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var2853, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': 'Bearer\x20' + var2852
        },
        'body': JSON.stringify(var2857),
        'responseType': "json"
      });
    }, _0x3a7a9d => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var2858 = _0x3a7a9d.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param483, var2858, param484);
      }
    }, "noAlert");
  },
  'api2d_transSelectedText': async function (param485) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2859 = "API2D";
    var var2860 = Zotero.AI4Paper.gptServiceList()[var2859].api_key,
      var2861 = Zotero.AI4Paper.gptServiceList()[var2859].base_url + "/v1/chat/completions";
    let var2862 = Zotero.AI4Paper.gptServiceList()[var2859].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2860, var2859, true, "translation")) return false;
    var var2863 = Zotero.AI4Paper.getQuestion_gptTranslation(param485, "transSelectedText"),
      var2864 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2859].modelLabel, "isTranslation"),
      var2865 = {
        'model': var2864,
        'messages': [{
          'role': "user",
          'content': var2863
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var2861, var2860, var2865, param485, var2859, var2862);
  },
  'api2d_transAnnotation': async function (param486, param487) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2866 = 'API2D';
    var var2867 = Zotero.AI4Paper.gptServiceList()[var2866].api_key,
      var2868 = Zotero.AI4Paper.gptServiceList()[var2866].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2867, var2866, false)) return false;
    var var2869 = param486.annotationText,
      var2870 = Zotero.AI4Paper.getQuestion_gptTranslation(var2869, "transAnnotation"),
      var2871 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2866].modelLabel, "isTranslation"),
      var2872 = {
        'model': var2871,
        'messages': [{
          'role': "user",
          'content': var2870
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var2868, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + var2867,
          'x-api2d-no-cache': 0x1
        },
        'body': JSON.stringify(var2872),
        'responseType': "json"
      });
    }, _0x57c9fe => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var2873 = _0x57c9fe.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param486, var2873, param487);
      }
    }, 'noAlert');
  },
  'chatAnywhere_transSelectedText': async function (param488) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2874 = 'ChatAnywhere';
    var var2875 = Zotero.AI4Paper.gptServiceList()[var2874].api_key,
      var2876 = Zotero.AI4Paper.gptServiceList()[var2874].base_url + "/v1/chat/completions";
    let var2877 = Zotero.AI4Paper.gptServiceList()[var2874].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2875, var2874, true, "translation")) return false;
    var var2878 = Zotero.AI4Paper.getQuestion_gptTranslation(param488, 'transSelectedText'),
      var2879 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2874].modelLabel, 'isTranslation'),
      var2880 = {
        'model': var2879,
        'messages': [{
          'role': "user",
          'content': var2878
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var2876, var2875, var2880, param488, var2874, var2877);
  },
  'chatAnywhere_transAnnotation': async function (param489, param490) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2881 = "ChatAnywhere";
    var var2882 = Zotero.AI4Paper.gptServiceList()[var2881].api_key,
      var2883 = Zotero.AI4Paper.gptServiceList()[var2881].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2882, var2881, false)) return false;
    var var2884 = param489.annotationText,
      var2885 = Zotero.AI4Paper.getQuestion_gptTranslation(var2884, "transAnnotation"),
      var2886 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2881].modelLabel, "isTranslation"),
      var2887 = {
        'model': var2886,
        'messages': [{
          'role': 'user',
          'content': var2885
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var2883, {
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + var2882
        },
        'body': JSON.stringify(var2887),
        'responseType': 'json'
      });
    }, _0x620759 => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var2888 = _0x620759.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param489, var2888, param490);
      }
    }, "noAlert");
  },
  'qwen_transSelectedText': async function (param491) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2889 = '通义千问';
    var var2890 = Zotero.AI4Paper.gptServiceList()[var2889].api_key,
      var2891 = Zotero.AI4Paper.gptServiceList()[var2889].base_url + "/v1/chat/completions";
    let var2892 = Zotero.AI4Paper.gptServiceList()[var2889].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2890, var2889, true, 'translation')) return false;
    var var2893 = Zotero.AI4Paper.getQuestion_gptTranslation(param491, "transSelectedText"),
      var2894 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2889].modelLabel, "isTranslation"),
      var2895 = {
        'model': var2894,
        'messages': [{
          'role': "user",
          'content': var2893
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var2891, var2890, var2895, param491, var2889, var2892);
  },
  'qwen_transAnnotation': async function (param492, param493) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2896 = '通义千问';
    var var2897 = Zotero.AI4Paper.gptServiceList()[var2896].api_key,
      var2898 = Zotero.AI4Paper.gptServiceList()[var2896].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2897, var2896, false)) return false;
    var var2899 = param492.annotationText,
      var2900 = Zotero.AI4Paper.getQuestion_gptTranslation(var2899, "transAnnotation"),
      var2901 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2896].modelLabel, "isTranslation"),
      var2902 = {
        'model': var2901,
        'messages': [{
          'role': "user",
          'content': var2900
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var2898, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + var2897
        },
        'body': JSON.stringify(var2902),
        'responseType': "json"
      });
    }, _0x7d83ae => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var2903 = _0x7d83ae.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param492, var2903, param493);
      }
    }, 'noAlert');
  },
  'getAccessToken_Wenxin': async function (param494, param495) {
    let var2904 = Zotero.Prefs.get('ai4paper.wenxinAPIKey').trim(),
      var2905 = Zotero.Prefs.get("ai4paper.wenxinSecretKey").trim(),
      var2906 = "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" + var2904 + "&client_secret=" + var2905,
      var2907;
    try {
      return var2907 = await Zotero.HTTP.request("POST", var2906, {
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify({}),
        'responseType': "json"
      }), var2907.response.access_token;
    } catch (_0x3c5e03) {
      let _0x331155 = "⚠️ [请求错误]\n\n❌【文心一言】获取 AccessToken 失败！请检查 API Key/Secret Key/网络连接。\n\n" + _0x3c5e03;
      if (param494 === "ChatMode") {
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_displayErrorMessage(_0x331155);
        Zotero.AI4Paper.gptReaderSidePane_ChatMode_saveError2MessageHistory(_0x331155, param495);
      } else {
        if (param494 === "notChatMode") Zotero.AI4Paper.gptReaderSidePane_resetChat(Zotero.getString(_0x331155));else param494 === "translate" ? Zotero.AI4Paper.translateReaderSidePane_showErrorMessage(_0x331155) : window.alert(_0x331155);
      }
      return false;
    }
  },
  'wenxin_transSelectedText': async function (param496) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2909 = "文心一言";
    var var2910 = Zotero.AI4Paper.gptServiceList()[var2909].api_key,
      var2911 = '' + Zotero.AI4Paper.gptServiceList()[var2909].request_url;
    let var2912 = Zotero.AI4Paper.gptServiceList()[var2909].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2910, var2909, true, "translation")) return false;
    var var2913 = Zotero.AI4Paper.getQuestion_gptTranslation(param496, "transSelectedText"),
      var2914 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2909].modelLabel, "isTranslation"),
      var2915 = {
        'model': var2914,
        'messages': [{
          'role': "user",
          'content': var2913
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var2911, var2910, var2915, param496, var2909, var2912);
  },
  'wenxin_transAnnotation': async function (param497, param498) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2916 = "文心一言";
    var var2917 = Zotero.AI4Paper.gptServiceList()[var2916].api_key,
      var2918 = '' + Zotero.AI4Paper.gptServiceList()[var2916].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2917, var2916, false)) return false;
    var var2919 = param497.annotationText,
      var2920 = Zotero.AI4Paper.getQuestion_gptTranslation(var2919, "transAnnotation"),
      var2921 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2916].modelLabel, "isTranslation"),
      var2922 = {
        'model': var2921,
        'messages': [{
          'role': "user",
          'content': var2920
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request('POST', var2918, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + var2917
        },
        'body': JSON.stringify(var2922),
        'responseType': "json"
      });
    }, _0x3ff03f => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var2923 = _0x3ff03f.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param497, var2923, param498);
      }
    }, "noAlert");
  },
  'glm_transSelectedText': async function (param499) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2924 = "智普清言";
    var var2925 = Zotero.AI4Paper.gptServiceList()[var2924].api_key,
      var2926 = '' + Zotero.AI4Paper.gptServiceList()[var2924].request_url;
    let var2927 = Zotero.AI4Paper.gptServiceList()[var2924].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2925, var2924, true, "translation")) return false;
    var var2928 = Zotero.AI4Paper.getQuestion_gptTranslation(param499, "transSelectedText"),
      var2929 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2924].modelLabel, "isTranslation"),
      var2930 = {
        'model': var2929,
        'messages': [{
          'role': "user",
          'content': var2928
        }],
        'thinking': {
          'type': "disabled"
        },
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var2926, var2925, var2930, param499, var2924, var2927);
  },
  'glm_transAnnotation': async function (param500, param501) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2931 = "智普清言";
    var var2932 = Zotero.AI4Paper.gptServiceList()[var2931].api_key,
      var2933 = '' + Zotero.AI4Paper.gptServiceList()[var2931].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2932, var2931, false)) return false;
    var var2934 = param500.annotationText,
      var2935 = Zotero.AI4Paper.getQuestion_gptTranslation(var2934, "transAnnotation"),
      var2936 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2931].modelLabel, "isTranslation"),
      var2937 = {
        'model': var2936,
        'messages': [{
          'role': 'user',
          'content': var2935
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var2933, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + var2932
        },
        'body': JSON.stringify(var2937),
        'responseType': "json"
      });
    }, _0xd09de6 => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var2938 = _0xd09de6.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param500, var2938, param501);
      }
    }, "noAlert");
  },
  'zjuchat_transSelectedText': async function (param502) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2939 = "浙大先生";
    var var2940 = Zotero.AI4Paper.gptServiceList()[var2939].api_key,
      var2941 = Zotero.AI4Paper.gptServiceList()[var2939].base_url + "/v1/chat/completions";
    let var2942 = Zotero.AI4Paper.gptServiceList()[var2939].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2940, var2939, true, "translation")) return false;
    var var2943 = Zotero.AI4Paper.getQuestion_gptTranslation(param502, "transSelectedText"),
      var2944 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2939].modelLabel, 'isTranslation'),
      var2945 = {
        'model': var2944,
        'messages': [{
          'role': "user",
          'content': var2943
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var2941, var2940, var2945, param502, var2939, var2942);
  },
  'zjuchat_transAnnotation': async function (param503, param504) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2946 = "浙大先生";
    var var2947 = Zotero.AI4Paper.gptServiceList()[var2946].api_key,
      var2948 = Zotero.AI4Paper.gptServiceList()[var2946].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2947, var2946, false)) return false;
    var var2949 = param503.annotationText,
      var2950 = Zotero.AI4Paper.getQuestion_gptTranslation(var2949, "transAnnotation"),
      var2951 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2946].modelLabel, "isTranslation"),
      var2952 = {
        'model': var2951,
        'messages': [{
          'role': "user",
          'content': var2950
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var2948, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + var2947
        },
        'body': JSON.stringify(var2952),
        'responseType': 'json'
      });
    }, _0x866662 => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var2953 = _0x866662.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param503, var2953, param504);
      }
    }, "noAlert");
  },
  'yi_transSelectedText': async function (param505) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2954 = "零一万物";
    var var2955 = Zotero.AI4Paper.gptServiceList()[var2954].api_key,
      var2956 = Zotero.AI4Paper.gptServiceList()[var2954].base_url + "/v1/chat/completions";
    let var2957 = Zotero.AI4Paper.gptServiceList()[var2954].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2955, var2954, true, "translation")) return false;
    var var2958 = Zotero.AI4Paper.getQuestion_gptTranslation(param505, "transSelectedText"),
      var2959 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2954].modelLabel, "isTranslation"),
      var2960 = {
        'model': var2959,
        'messages': [{
          'role': "user",
          'content': var2958
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var2956, var2955, var2960, param505, var2954, var2957);
  },
  'yi_transAnnotation': async function (param506, param507) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2961 = "零一万物";
    var var2962 = Zotero.AI4Paper.gptServiceList()[var2961].api_key,
      var2963 = Zotero.AI4Paper.gptServiceList()[var2961].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2962, var2961, false)) return false;
    var var2964 = param506.annotationText,
      var2965 = Zotero.AI4Paper.getQuestion_gptTranslation(var2964, "transAnnotation"),
      var2966 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2961].modelLabel, "isTranslation"),
      var2967 = {
        'model': var2966,
        'messages': [{
          'role': "user",
          'content': var2965
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var2963, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + var2962
        },
        'body': JSON.stringify(var2967),
        'responseType': "json"
      });
    }, _0x8286c7 => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var2968 = _0x8286c7.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param506, var2968, param507);
      }
    }, "noAlert");
  },
  'volcanoSearch_transSelectedText': async function (param508) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2969 = "火山联网搜索";
    var var2970 = Zotero.AI4Paper.gptServiceList()[var2969].api_key,
      var2971 = '' + Zotero.AI4Paper.gptServiceList()[var2969].request_url;
    let var2972 = Zotero.AI4Paper.gptServiceList()[var2969].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2970, var2969, true, 'translation')) return false;
    var var2973 = Zotero.AI4Paper.getQuestion_gptTranslation(param508, "transSelectedText"),
      var2974 = Zotero.AI4Paper.gptServiceList()[var2969].model,
      var2975 = {
        'model': var2974,
        'messages': [{
          'role': "user",
          'content': var2973
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var2971, var2970, var2975, param508, var2969, var2972);
  },
  'volcanoSearch_transAnnotation': async function (param509, param510) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2976 = "火山联网搜索";
    var var2977 = Zotero.AI4Paper.gptServiceList()[var2976].api_key,
      var2978 = '' + Zotero.AI4Paper.gptServiceList()[var2976].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2977, var2976, false)) return false;
    var var2979 = param509.annotationText,
      var2980 = Zotero.AI4Paper.getQuestion_gptTranslation(var2979, "transAnnotation"),
      var2981 = Zotero.AI4Paper.gptServiceList()[var2976].model,
      var2982 = {
        'model': var2981,
        'messages': [{
          'role': "user",
          'content': var2980
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var2978, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + var2977
        },
        'body': JSON.stringify(var2982),
        'responseType': "json"
      });
    }, _0x59386b => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var2983 = _0x59386b.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param509, var2983, param510);
      }
    }, 'noAlert');
  },
  'volcanoEngine_transSelectedText': async function (param511) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2984 = "火山引擎";
    var var2985 = Zotero.AI4Paper.gptServiceList()[var2984].api_key,
      var2986 = '' + Zotero.AI4Paper.gptServiceList()[var2984].request_url;
    let var2987 = Zotero.AI4Paper.gptServiceList()[var2984].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2985, var2984, true, 'translation')) return false;
    var var2988 = Zotero.AI4Paper.getQuestion_gptTranslation(param511, 'transSelectedText'),
      var2989 = Zotero.AI4Paper.gptServiceList()[var2984].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var2984].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var2984].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2984].modelLabel, "isTranslation"),
      var2990 = {
        'model': var2989,
        'messages': [{
          'role': "user",
          'content': var2988
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var2986, var2985, var2990, param511, var2984, var2987);
  },
  'volcanoEngine_transAnnotation': async function (param512, param513) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2991 = "火山引擎";
    var var2992 = Zotero.AI4Paper.gptServiceList()[var2991].api_key,
      var2993 = '' + Zotero.AI4Paper.gptServiceList()[var2991].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var2992, var2991, false)) return false;
    var var2994 = param512.annotationText,
      var2995 = Zotero.AI4Paper.getQuestion_gptTranslation(var2994, 'transAnnotation'),
      var2996 = Zotero.AI4Paper.gptServiceList()[var2991].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var2991].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var2991].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2991].modelLabel, "isTranslation"),
      var2997 = {
        'model': var2996,
        'messages': [{
          'role': 'user',
          'content': var2995
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var2993, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + var2992
        },
        'body': JSON.stringify(var2997),
        'responseType': "json"
      });
    }, _0xbd0f61 => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var2998 = _0xbd0f61.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param512, var2998, param513);
      }
    }, "noAlert");
  },
  'doubao_transSelectedText': async function (param514) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var2999 = '豆包';
    var var3000 = Zotero.AI4Paper.gptServiceList()[var2999].api_key,
      var3001 = '' + Zotero.AI4Paper.gptServiceList()[var2999].request_url;
    let var3002 = Zotero.AI4Paper.gptServiceList()[var2999].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3000, var2999, true, "translation")) return false;
    var var3003 = Zotero.AI4Paper.getQuestion_gptTranslation(param514, "transSelectedText"),
      var3004 = Zotero.AI4Paper.gptServiceList()[var2999].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var2999].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var2999].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var2999].modelLabel, 'isTranslation'),
      var3005 = {
        'model': var3004,
        'messages': [{
          'role': "user",
          'content': var3003
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var3001, var3000, var3005, param514, var2999, var3002);
  },
  'doubao_transAnnotation': async function (param515, param516) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3006 = '豆包';
    var var3007 = Zotero.AI4Paper.gptServiceList()[var3006].api_key,
      var3008 = '' + Zotero.AI4Paper.gptServiceList()[var3006].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3007, var3006, false)) return false;
    var var3009 = param515.annotationText,
      var3010 = Zotero.AI4Paper.getQuestion_gptTranslation(var3009, "transAnnotation"),
      var3011 = Zotero.AI4Paper.gptServiceList()[var3006].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var3006].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var3006].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3006].modelLabel, "isTranslation"),
      var3012 = {
        'model': var3011,
        'messages': [{
          'role': "user",
          'content': var3010
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request('POST', var3008, {
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer\x20' + var3007
        },
        'body': JSON.stringify(var3012),
        'responseType': 'json'
      });
    }, _0x759316 => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var3013 = _0x759316.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param515, var3013, param516);
      }
    }, "noAlert");
  },
  'kimi_transSelectedText': async function (param517) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3014 = 'Kimi';
    var var3015 = Zotero.AI4Paper.gptServiceList()[var3014].api_key,
      var3016 = Zotero.AI4Paper.gptServiceList()[var3014].base_url + "/v1/chat/completions";
    let var3017 = Zotero.AI4Paper.gptServiceList()[var3014].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3015, var3014, true, 'translation')) return false;
    var var3018 = Zotero.AI4Paper.getQuestion_gptTranslation(param517, "transSelectedText"),
      var3019 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3014].modelLabel, "isTranslation"),
      var3020 = {
        'model': var3019,
        'messages': [{
          'role': "user",
          'content': var3018
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var3016, var3015, var3020, param517, var3014, var3017);
  },
  'kimi_transAnnotation': async function (param518, param519) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3021 = "Kimi";
    var var3022 = Zotero.AI4Paper.gptServiceList()[var3021].api_key,
      var3023 = Zotero.AI4Paper.gptServiceList()[var3021].base_url + "/v1/chat/completions";
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3022, var3021, false)) return false;
    var var3024 = param518.annotationText,
      var3025 = Zotero.AI4Paper.getQuestion_gptTranslation(var3024, 'transAnnotation'),
      var3026 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3021].modelLabel, "isTranslation"),
      var3027 = {
        'model': var3026,
        'messages': [{
          'role': "user",
          'content': var3025
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var3023, {
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer\x20' + var3022
        },
        'body': JSON.stringify(var3027),
        'responseType': 'json'
      });
    }, _0x31d05f => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var3028 = _0x31d05f.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param518, var3028, param519);
      }
    }, "noAlert");
  },
  'deepSeek_transSelectedText': async function (param520) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3029 = "DeepSeek";
    var var3030 = Zotero.AI4Paper.gptServiceList()[var3029].api_key,
      var3031 = Zotero.AI4Paper.gptServiceList()[var3029].base_url + "/v1/chat/completions";
    let var3032 = Zotero.AI4Paper.gptServiceList()[var3029].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3030, var3029, true, "translation")) return false;
    var var3033 = Zotero.AI4Paper.getQuestion_gptTranslation(param520, "transSelectedText"),
      var3034 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3029].modelLabel, "isTranslation"),
      var3035 = {
        'model': var3034,
        'messages': [{
          'role': "user",
          'content': var3033
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var3031, var3030, var3035, param520, var3029, var3032);
  },
  'deepSeek_transAnnotation': async function (param521, param522) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3036 = "DeepSeek";
    var var3037 = Zotero.AI4Paper.gptServiceList()[var3036].api_key,
      var3038 = Zotero.AI4Paper.gptServiceList()[var3036].base_url + '/v1/chat/completions';
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3037, var3036, false)) return false;
    var var3039 = param521.annotationText,
      var3040 = Zotero.AI4Paper.getQuestion_gptTranslation(var3039, "transAnnotation"),
      var3037 = Zotero.Prefs.get("ai4paper.deepSeekAPI").trim(),
      var3038 = 'https://api.deepseek.com/v1/chat/completions',
      var3041 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3036].modelLabel, "isTranslation"),
      var3042 = {
        'model': var3041,
        'messages': [{
          'role': 'user',
          'content': var3040
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var3038, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + var3037
        },
        'body': JSON.stringify(var3042),
        'responseType': "json"
      });
    }, _0x12731c => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var3043 = _0x12731c.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param521, var3043, param522);
      }
    }, "noAlert");
  },
  'gptCustom_transSelectedText': async function (param523, param524) {
    let var3044 = Zotero.AI4Paper.gptCustom_numEmoji;
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3045 = 'GPT\x20自定\x20' + var3044[param524];
    var var3046 = Zotero.AI4Paper.gptServiceList()[var3045].api_key,
      var3047 = Zotero.AI4Paper.getURL4GPTCustom(var3045);
    let var3048 = Zotero.AI4Paper.gptServiceList()[var3045].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3046, var3045, true, "translation")) return false;
    var var3049 = Zotero.AI4Paper.getQuestion_gptTranslation(param523, "transSelectedText"),
      var3050 = Zotero.AI4Paper.gptServiceList()[var3045].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var3045].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var3045].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3045].modelLabel, "isTranslation"),
      var3051 = {
        'model': var3050,
        'messages': [{
          'role': "user",
          'content': var3049
        }],
        'stream': true
      };
    Zotero.AI4Paper.gptReaderSidePane_addRequestArguments(var3051, param524);
    Zotero.AI4Paper.startFetch_gptTranslation(var3047, var3046, var3051, param523, var3045, var3048);
  },
  'gptCustom_transAnnotation': async function (param525, param526, param527) {
    let var3052 = Zotero.AI4Paper.gptCustom_numEmoji;
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3053 = 'GPT\x20自定\x20' + var3052[param527];
    var var3054 = Zotero.AI4Paper.gptServiceList()[var3053].api_key,
      var3055 = Zotero.AI4Paper.getURL4GPTCustom(var3053);
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3054, var3053, false)) return false;
    var var3056 = param525.annotationText,
      var3057 = Zotero.AI4Paper.getQuestion_gptTranslation(var3056, "transAnnotation"),
      var3058 = Zotero.AI4Paper.gptServiceList()[var3053].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var3053].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var3053].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3053].modelLabel, "isTranslation"),
      var3059 = {
        'model': var3058,
        'messages': [{
          'role': 'user',
          'content': var3057
        }]
      };
    return Zotero.AI4Paper.gptReaderSidePane_addRequestArguments(var3059, param527), await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request('POST', var3055, {
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "Bearer " + var3054
        },
        'body': JSON.stringify(var3059),
        'responseType': "json"
      });
    }, _0x2a9831 => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var3060 = _0x2a9831.response.choices[0x0].message.content;
        Zotero.AI4Paper.addTrans2AnnotationComment(param525, var3060, param526);
      }
    }, "noAlert");
  },
  'gemini_transSelectedText': async function (param528) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3061 = 'Gemini';
    var var3062 = Zotero.AI4Paper.gptServiceList()[var3061].api_key;
    let var3063 = Zotero.AI4Paper.gptServiceList()[var3061].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3062, var3061, true, "translation")) return false;
    var var3064 = Zotero.AI4Paper.getQuestion_gptTranslation(param528, "transSelectedText"),
      var3065 = Zotero.AI4Paper.gptServiceList()[var3061].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var3061].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var3061].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3061].modelLabel, "isTranslation"),
      var3066 = Zotero.AI4Paper.gptServiceList()[var3061].base_url + '/v1beta/models/' + var3065 + ":streamGenerateContent",
      var3067 = {
        'contents': [{
          'role': "USER",
          'parts': [{
            'text': var3064
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
    Zotero.AI4Paper.startFetch_gptTranslation(var3066, var3062, var3067, param528, var3061, var3063);
  },
  'gemini_transAnnotation': async function (param529, param530) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3068 = 'Gemini';
    var var3069 = Zotero.AI4Paper.gptServiceList()[var3068].api_key;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3069, var3068, false)) return false;
    var var3070 = param529.annotationText,
      var3071 = Zotero.AI4Paper.getQuestion_gptTranslation(var3070, 'transAnnotation'),
      var3072 = Zotero.AI4Paper.gptServiceList()[var3068].custom_model_enable && Zotero.AI4Paper.gptServiceList()[var3068].custom_model != '' ? Zotero.AI4Paper.gptServiceList()[var3068].custom_model : Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3068].modelLabel, "isTranslation"),
      var3073 = Zotero.AI4Paper.gptServiceList()[var3068].base_url + "/v1beta/models/" + var3072 + ":generateContent",
      var3074 = {
        'contents': [{
          'role': "USER",
          'parts': [{
            'text': var3071
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
      return await Zotero.HTTP.request('POST', var3073, {
        'headers': {
          'Content-Type': "application/json",
          'x-goog-api-key': var3069
        },
        'body': JSON.stringify(var3074),
        'responseType': "json"
      });
    }, _0x54d39b => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var3075 = _0x54d39b.response.candidates[0x0].content.parts[0x0].text;
        Zotero.AI4Paper.addTrans2AnnotationComment(param529, var3075, param530);
      }
    }, "noAlert");
  },
  'claude_transSelectedText': async function (param531) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3076 = "Claude";
    var var3077 = Zotero.AI4Paper.gptServiceList()[var3076].api_key,
      var3078 = '' + Zotero.AI4Paper.gptServiceList()[var3076].request_url;
    let var3079 = Zotero.AI4Paper.gptServiceList()[var3076].errorCode_link;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3077, var3076, true, "translation")) return false;
    var var3080 = Zotero.AI4Paper.getQuestion_gptTranslation(param531, "transSelectedText"),
      var3081 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3076].modelLabel, "isTranslation"),
      var3082 = {
        'model': var3081,
        'max_tokens': Zotero.AI4Paper.getClaudeMaxTokens(var3081),
        'messages': [{
          'role': "user",
          'content': var3080
        }],
        'stream': true
      };
    Zotero.AI4Paper.startFetch_gptTranslation(var3078, var3077, var3082, param531, var3076, var3079);
  },
  'claude_transAnnotation': async function (param532, param533) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3083 = "Claude";
    var var3084 = Zotero.AI4Paper.gptServiceList()[var3083].api_key,
      var3085 = '' + Zotero.AI4Paper.gptServiceList()[var3083].request_url;
    if (!Zotero.AI4Paper.gptService_isTokenEmpty_APIVerified(var3084, var3083, false)) return false;
    var var3086 = param532.annotationText,
      var3087 = Zotero.AI4Paper.getQuestion_gptTranslation(var3086, "transAnnotation"),
      var3088 = Zotero.AI4Paper.getGPTModel(Zotero.AI4Paper.gptServiceList()[var3083].modelLabel, "isTranslation"),
      var3089 = {
        'model': var3088,
        'max_tokens': Zotero.AI4Paper.getClaudeMaxTokens(var3088),
        'messages': [{
          'role': "user",
          'content': var3087
        }]
      };
    return await Zotero.AI4Paper.httpRequestInit(async () => {
      return await Zotero.HTTP.request("POST", var3085, {
        'headers': {
          'Content-Type': "application/json",
          'x-api-key': var3084,
          'anthropic-version': "2023-06-01"
        },
        'body': JSON.stringify(var3089),
        'responseType': "json"
      });
    }, _0xa89917 => {
      if (Zotero.AI4Paper.runAuthor()) {
        var var3090 = _0xa89917.response.content[0x0].text;
        Zotero.AI4Paper.addTrans2AnnotationComment(param532, var3090, param533);
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
      const var3091 = Zotero.AI4Paper.translationServiceList();
      if (!var3091[this.serviceName]) return null;
      return {
        'apiKey': var3091[this.serviceName].api_key,
        'plan': var3091[this.serviceName].plan,
        'verifyResult': var3091[this.serviceName].api_verifyResult,
        'errorCodeLink': var3091[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': function (param534, param535, param536) {
      const var3092 = this.config,
        var3093 = param535 === 'DeepL\x20Pro' ? var3092.proUrl : var3092.freeUrl,
        var3094 = {
          'text': [param536],
          'target_lang': var3092.targetLang
        };
      return {
        'url': var3093,
        'headers': {
          'Content-Type': "application/json",
          'Authorization': "DeepL-Auth-Key " + param534
        },
        'body': JSON.stringify(var3094)
      };
    },
    'requestTranslation': async function (param537, param538, _0x5c71de = "noAlert", _0x1e7657 = false) {
      const var3095 = this.getCredentials();
      if (!var3095.apiKey && _0x1e7657) return window.alert('❌【' + this.serviceName + "】：请先输入 API-Key！"), -0x1;
      if (!_0x1e7657 && var3095.verifyResult !== "验证成功") {
        if (_0x5c71de === this.serviceName) {
          Zotero.AI4Paper.translateReaderSidePane_showErrorMessage("❌ 尚未验证【" + this.serviceName + "】API-Key！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！");
        }
        return -0x1;
      }
      const var3096 = this.prepareRequest(var3095.apiKey, var3095.plan, param537);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", var3096.url, {
          'headers': var3096.headers,
          'body': var3096.body,
          'responseType': "json"
        });
      }, _0x4113e5 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const var3097 = _0x4113e5.response;
          var3097.translations && var3097.translations.length > 0x0 && param538(var3097.translations[0x0].text);
        }
      }, _0x5c71de);
    }
  },
  'deep_verifyAPI': async function (param539) {
    const var3098 = 'Hello';
    return await Zotero.AI4Paper.deepl_Helper.requestTranslation(var3098, _0x2912b3 => {
      Zotero.AI4Paper.apiModule_updateButtons("deeplverifyresult", "deepl", param539, true);
    }, "alert", true);
  },
  'deepl_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var3099 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var3099) return;
    return await Zotero.AI4Paper.deepl_Helper.requestTranslation(var3099, _0x4d417d => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.deepl_Helper.serviceName, var3099, _0x4d417d);
    }, Zotero.AI4Paper.deepl_Helper.serviceName);
  },
  'deepl_transSelectedText': async function (param540) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.deepl_Helper.requestTranslation(param540, _0x5a8851 => {
      Zotero.Prefs.set('ai4paper.selectedtexttrans', param540);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.deepl_Helper.serviceName, param540, _0x5a8851);
    }, Zotero.AI4Paper.deepl_Helper.serviceName);
  },
  'deepl_transAnnotation': async function (param541, param542) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var3100 = param541.annotationText;
    return await Zotero.AI4Paper.deepl_Helper.requestTranslation(var3100, _0x7c1334 => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param541, _0x7c1334, param542);
    }, "noAlert");
  },
  'deepl_transVocabulary': async function (param543, param544) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3101 = 0x0;
    return var3101 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param543, param544), await Zotero.AI4Paper.deepl_Helper.requestTranslation(param544, _0x464020 => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param543, param544, _0x464020, var3101, '【收藏生词】-\x20' + Zotero.AI4Paper.deepl_Helper.serviceName);
    }, "noAlert");
  },
  'deepl_transField': async function (param545, param546) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3102 = Zotero.AI4Paper.transField_getRaw(param545, param546);
    if (!var3102) return false;
    return await Zotero.AI4Paper.deepl_Helper.requestTranslation(var3102, _0x2b5f6b => {
      Zotero.AI4Paper.transField_Handler(param545, param546, var3102, _0x2b5f6b);
    }, 'noAlert');
  },
  'deeplx_Helper': {
    'serviceName': 'DeepLX🔑',
    'config': {
      'sourceLang': "auto",
      'targetLang': 'ZH'
    },
    'getCredentials': function () {
      const var3103 = Zotero.AI4Paper.translationServiceList();
      if (!var3103[this.serviceName]) return null;
      return {
        'url': var3103[this.serviceName].request_url,
        'verifyResult': var3103[this.serviceName].api_verifyResult,
        'errorCodeLink': var3103[this.serviceName].errorCode_link
      };
    },
    'prepareRequest': function (param547) {
      const var3104 = this.config,
        var3105 = {
          'text': param547,
          'source_lang': var3104.sourceLang,
          'target_lang': var3104.targetLang
        };
      return {
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify(var3105)
      };
    },
    'requestTranslation': async function (param548, param549, _0x3aa5b0 = "noAlert", _0x2ff62b = false) {
      const var3106 = this.getCredentials();
      if (!var3106.url && _0x2ff62b) return window.alert('❌【' + this.serviceName + '】：请先配置\x20DeepLX\x20API\x20URL！'), -0x1;
      if (!_0x2ff62b && var3106.verifyResult !== "验证成功") {
        return _0x3aa5b0 === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage('❌\x20尚未验证【' + this.serviceName + "】API-URL！\n\n请先前往【Zotero 设置 --> AI4paper --> 翻译 API】完成验证！"), -0x1;
      }
      const var3107 = this.prepareRequest(param548),
        var3108 = var3106.url;
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", var3108, {
          'headers': var3107.headers,
          'body': var3107.body,
          'responseType': 'json'
        });
      }, _0x163d39 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const var3109 = _0x163d39.response;
          if (var3109.code !== 0xc8 || !var3109.data) {
            const var3110 = var3109.msg || 'DeepLX\x20错误码：' + var3109.code,
              var3111 = "\n\n👉 常见错误码含义见：" + var3106.errorCodeLink;
            if (_0x2ff62b) window.alert('' + var3110 + var3111);else _0x3aa5b0 === this.serviceName && Zotero.AI4Paper.translateReaderSidePane_showErrorMessage('[请求错误]\x0a\x0a【' + this.serviceName + '】出错啦：' + var3110 + var3111);
            return;
          }
          var3109.data && param549(var3109.data);
        }
      }, _0x3aa5b0);
    }
  },
  'deeplx_verifyAPI': async function (param550) {
    const var3112 = "Hello";
    return await Zotero.AI4Paper.deeplx_Helper.requestTranslation(var3112, _0x2052c9 => {
      Zotero.AI4Paper.apiModule_updateButtons("deeplxverifyresult", "deeplx", param550, true);
    }, "alert", true);
  },
  'deeplx_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var3113 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var3113) return;
    return await Zotero.AI4Paper.deeplx_Helper.requestTranslation(var3113, _0x225260 => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.deeplx_Helper.serviceName, var3113, _0x225260);
    }, Zotero.AI4Paper.deeplx_Helper.serviceName);
  },
  'deeplx_transSelectedText': async function (param551) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.deeplx_Helper.requestTranslation(param551, _0x38e8a3 => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", param551);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.deeplx_Helper.serviceName, param551, _0x38e8a3);
    }, Zotero.AI4Paper.deeplx_Helper.serviceName);
  },
  'deeplx_transAnnotation': async function (param552, param553) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var3114 = param552.annotationText;
    return await Zotero.AI4Paper.deeplx_Helper.requestTranslation(var3114, _0x108912 => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param552, _0x108912, param553);
    }, 'noAlert');
  },
  'deeplx_transVocabulary': async function (param554, param555) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3115 = 0x0;
    return var3115 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param554, param555), await Zotero.AI4Paper.deeplx_Helper.requestTranslation(param555, _0x1e6ba8 => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param554, param555, _0x1e6ba8, var3115, "【收藏生词】- " + Zotero.AI4Paper.deeplx_Helper.serviceName);
    }, "noAlert");
  },
  'deeplx_transField': async function (param556, param557) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3116 = Zotero.AI4Paper.transField_getRaw(param556, param557);
    if (!var3116) return false;
    return await Zotero.AI4Paper.deeplx_Helper.requestTranslation(var3116, _0x457d56 => {
      Zotero.AI4Paper.transField_Handler(param556, param557, var3116, _0x457d56);
    }, "noAlert");
  },
  'tencentSmart_Helper': {
    'serviceName': "腾讯交互🆓",
    'config': {
      'url': "https://yi.qq.com/api/imt",
      'targetLang': 'zh',
      'client_key': "browser-chrome-110.0.0-Mac OS-df4bd4c5-a65d-44b2-a40f-42f34f3535f2-1677486696487"
    },
    'prepareRequest': function (param558) {
      const var3117 = this.config,
        var3118 = {
          'header': {
            'fn': "auto_translation",
            'client_key': var3117.client_key
          },
          'type': "plain",
          'model_category': "normal",
          'source': {
            'lang': "auto",
            'text_list': [param558]
          },
          'target': {
            'lang': var3117.targetLang
          }
        };
      return {
        'url': var3117.url,
        'headers': {
          'Content-Type': 'application/json',
          'user-agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
          'referer': "https://yi.qq.com/zh-CN/index"
        },
        'body': JSON.stringify(var3118)
      };
    },
    'requestTranslation': async function (param559, param560, _0x117d9e = 'noAlert') {
      const var3119 = this.prepareRequest(param559);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", var3119.url, {
          'headers': var3119.headers,
          'body': var3119.body,
          'responseType': "json"
        });
      }, _0x4004f0 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const _0x55992a = _0x4004f0.response;
          if (_0x55992a.auto_translation && _0x55992a.auto_translation.length > 0x0) {
            let var3121 = _0x55992a.auto_translation.join('');
            param560(var3121);
          }
        }
      }, _0x117d9e);
    }
  },
  'tencentSmart_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var3122 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var3122) return;
    return await Zotero.AI4Paper.tencentSmart_Helper.requestTranslation(var3122, _0x3cbecc => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.tencentSmart_Helper.serviceName, var3122, _0x3cbecc);
    }, Zotero.AI4Paper.tencentSmart_Helper.serviceName);
  },
  'tencentSmart_transSelectedText': async function (param561) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.tencentSmart_Helper.requestTranslation(param561, _0x1be94d => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", param561);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.tencentSmart_Helper.serviceName, param561, _0x1be94d);
    }, Zotero.AI4Paper.tencentSmart_Helper.serviceName);
  },
  'tencentSmart_transAnnotation': async function (param562, param563) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var3123 = param562.annotationText;
    return await Zotero.AI4Paper.tencentSmart_Helper.requestTranslation(var3123, _0x2cb665 => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param562, _0x2cb665, param563);
    }, 'noAlert');
  },
  'tencentSmart_transVocabulary': async function (param564, param565) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3124 = 0x0;
    return var3124 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param564, param565), await Zotero.AI4Paper.tencentSmart_Helper.requestTranslation(param565, _0x3f258a => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param564, param565, _0x3f258a, var3124, "【收藏生词】- " + Zotero.AI4Paper.tencentSmart_Helper.serviceName);
    }, "noAlert");
  },
  'tencentSmart_transField': async function (param566, param567) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3125 = Zotero.AI4Paper.transField_getRaw(param566, param567);
    if (!var3125) return false;
    return await Zotero.AI4Paper.tencentSmart_Helper.requestTranslation(var3125, _0x5a36bc => {
      Zotero.AI4Paper.transField_Handler(param566, param567, var3125, _0x5a36bc);
    }, "noAlert");
  },
  'volcanoFree_Helper': {
    'serviceName': "火山🆓",
    'config': {
      'url': 'https://translate.volcengine.com/crx/translate/v1',
      'targetLang': 'zh'
    },
    'prepareRequest': function (param568) {
      const var3126 = this.config;
      let var3127 = {
        'text': param568,
        'source_language': "auto",
        'target_language': var3126.targetLang
      };
      return {
        'url': var3126.url,
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify(var3127)
      };
    },
    'requestTranslation': async function (param569, param570, _0x58d0c0 = "noAlert") {
      const var3128 = this.prepareRequest(param569);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request('POST', var3128.url, {
          'headers': var3128.headers,
          'body': var3128.body,
          'responseType': "json"
        });
      }, _0x29a223 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const var3129 = _0x29a223.response;
          if (var3129.translation) return param570(var3129.translation), var3129.translation;
        }
      }, _0x58d0c0);
    }
  },
  'volcanoFree_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var3130 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var3130) return;
    return await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(var3130, _0x2a7ec1 => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.volcanoFree_Helper.serviceName, var3130, _0x2a7ec1);
    }, Zotero.AI4Paper.volcanoFree_Helper.serviceName);
  },
  'volcanoFree_transSelectedText': async function (param571) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(param571, _0x372b84 => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", param571);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.volcanoFree_Helper.serviceName, param571, _0x372b84);
    }, Zotero.AI4Paper.volcanoFree_Helper.serviceName);
  },
  'volcanoFree_transAnnotation': async function (param572, param573) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var3131 = param572.annotationText;
    return await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(var3131, _0x2fd3cb => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param572, _0x2fd3cb, param573);
    }, "noAlert");
  },
  'volcanoFree_transVocabulary': async function (param574, param575) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3132 = 0x0;
    return var3132 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param574, param575), await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(param575, _0x505fc6 => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param574, param575, _0x505fc6, var3132, "【收藏生词】- " + Zotero.AI4Paper.volcanoFree_Helper.serviceName);
    }, "noAlert");
  },
  'volcanoFree_transField': async function (param576, param577) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3133 = Zotero.AI4Paper.transField_getRaw(param576, param577);
    if (!var3133) return false;
    return await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(var3133, _0x14cf41 => {
      Zotero.AI4Paper.transField_Handler(param576, param577, var3133, _0x14cf41);
    }, "noAlert");
  },
  'volcanoFree_transAbstractInPanel': async function (param578) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.volcanoFree_Helper.requestTranslation(param578, _0x23af2b => {
      return _0x23af2b;
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
      const var3134 = Math.floor(Math.random() * 0x1869f) + 0x186a0;
      return var3134 * 0x3e8;
    },
    'requestTranslation': async function (param579, param580, _0x364b4f = "noAlert") {
      let var3135 = {
        'source': param579,
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
          'body': JSON.stringify(var3135),
          'responseType': "json"
        });
      }, async _0x50a02f => {
        if (Zotero.AI4Paper.runAuthor()) {
          let var3136 = _0x50a02f.response.target;
          var3136 && param580(var3136);
        }
      }, _0x364b4f);
    }
  },
  'caiyunxiaoyiFree_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var3137 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var3137) return;
    return await Zotero.AI4Paper.caiyunxiaoyiFree_Helper.requestTranslation(var3137, _0x521412 => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.caiyunxiaoyiFree_Helper.serviceName, var3137, _0x521412);
    }, Zotero.AI4Paper.caiyunxiaoyiFree_Helper.serviceName);
  },
  'caiyunxiaoyiFree_transSelectedText': async function (param581) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.caiyunxiaoyiFree_Helper.requestTranslation(param581, _0x208bf2 => {
      Zotero.Prefs.set('ai4paper.selectedtexttrans', param581);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.caiyunxiaoyiFree_Helper.serviceName, param581, _0x208bf2);
    }, Zotero.AI4Paper.caiyunxiaoyiFree_Helper.serviceName);
  },
  'caiyunxiaoyiFree_transAnnotation': async function (param582, param583) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var3138 = param582.annotationText;
    return await Zotero.AI4Paper.caiyunxiaoyiFree_Helper.requestTranslation(var3138, _0x366e3f => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param582, _0x366e3f, param583);
    }, 'noAlert');
  },
  'caiyunxiaoyiFree_transVocabulary': async function (param584, param585) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3139 = 0x0;
    var3139 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param584, param585);
    const var3140 = param585;
    return await Zotero.AI4Paper.caiyunxiaoyiFree_Helper.requestTranslation(var3140, _0x2d598f => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param584, var3140, _0x2d598f, var3139, "【收藏生词】- " + Zotero.AI4Paper.caiyunxiaoyiFree_Helper.serviceName);
    }, 'noAlert');
  },
  'caiyunxiaoyiFree_transField': async function (param586, param587) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    if (param586.getField("title").search(/[_\u4e00-\u9fa5]/) != -0x1) return param587 === "title" && (param586.setField('shortTitle', param586.getField('title')), param586.saveTx()), false;
    let var3141 = Zotero.AI4Paper.transField_getRaw(param586, param587);
    if (!var3141) return false;
    return await Zotero.AI4Paper.caiyunxiaoyiFree_Helper.requestTranslation(var3141, _0x34cd90 => {
      Zotero.AI4Paper.transField_Handler(param586, param587, var3141, _0x34cd90);
    }, "noAlert");
  },
  'googleFree_Helper': {
    'serviceName': "谷歌🆓",
    'requestTranslation': async function (param588, param589, _0x5725fa = "noAlert") {
      let var3142 = "auto",
        var3143 = 'zh',
        var3144 = Zotero.AI4Paper.getTK(param588),
        var3145 = "https://translate.googleapis.com/translate_a/single?client=webapp&sl=" + var3142 + "&tl=" + var3143 + '&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=bh&ssel=0&tsel=0&kc=1&tk=' + var3144 + "&q=" + encodeURIComponent(param588);
      return await Zotero.AI4Paper.httpRequestInit(async () => {
        return await Zotero.HTTP.request("POST", var3145, {
          'headers': {
            'Content-Type': "application/json"
          },
          'body': JSON.stringify({}),
          'responseType': "json"
        });
      }, _0x5b2640 => {
        if (Zotero.AI4Paper.runAuthor()) {
          const var3146 = _0x5b2640.response;
          try {
            let var3147 = '';
            if (var3146[0x0] && var3146[0x0].length) {
              for (let var3148 = 0x0; var3148 < var3146[0x0].length; var3148++) {
                if (!var3146[0x0][var3148]) continue;
                var3146[0x0][var3148] && var3146[0x0][var3148][0x0] && (var3147 += var3146[0x0][var3148][0x0]);
              }
            }
            var3147 && param589(var3147);
          } catch (_0x49767d) {
            throw new Error(_0x49767d);
          }
        }
      }, _0x5725fa);
    }
  },
  'googleFree_transbyShortCuts': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    const var3149 = Zotero.AI4Paper.transbyShortCuts_getRaw();
    if (!var3149) return;
    return await Zotero.AI4Paper.googleFree_Helper.requestTranslation(var3149, _0x58ce5f => {
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.googleFree_Helper.serviceName, var3149, _0x58ce5f);
    }, Zotero.AI4Paper.googleFree_Helper.serviceName);
  },
  'googleFree_transSelectedText': async function (param590) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    return await Zotero.AI4Paper.googleFree_Helper.requestTranslation(param590, _0x40b514 => {
      Zotero.Prefs.set("ai4paper.selectedtexttrans", param590);
      Zotero.AI4Paper.transbyShortCuts_Handler(Zotero.AI4Paper.googleFree_Helper.serviceName, param590, _0x40b514);
    }, Zotero.AI4Paper.googleFree_Helper.serviceName);
  },
  'googleFree_transAnnotation': async function (param591, param592) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    const var3150 = param591.annotationText;
    return await Zotero.AI4Paper.googleFree_Helper.requestTranslation(var3150, _0x76f515 => {
      Zotero.AI4Paper.addTrans2AnnotationComment(param591, _0x76f515, param592);
    }, "noAlert");
  },
  'googleFree_transVocabulary': async function (param593, param594) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3151 = 0x0;
    return var3151 = await Zotero.AI4Paper.transVocabulary_checkDuplicate(param593, param594), await Zotero.AI4Paper.googleFree_Helper.requestTranslation(param594, _0x2269f3 => {
      Zotero.AI4Paper.updateVocabularyAnnotation(param593, param594, _0x2269f3, var3151, "【收藏生词】- " + Zotero.AI4Paper.googleFree_Helper.serviceName);
    }, "noAlert");
  },
  'googleFree_transField': async function (param595, param596) {
    if (!Zotero.AI4Paper.hasPer_mission()) return false;
    let var3152 = Zotero.AI4Paper.transField_getRaw(param595, param596);
    if (!var3152) return false;
    return await Zotero.AI4Paper.googleFree_Helper.requestTranslation(var3152, _0x4dd49c => {
      Zotero.AI4Paper.transField_Handler(param595, param596, var3152, _0x4dd49c);
    }, "noAlert");
  },
  'apiModule_updateButtons': function (param597, param598, param599, param600, param601) {
    function fn15() {
      param599.getElementById("ai4paper." + param598 + ".apiverify.button").hidden = !param601 ? true : false;
      param599.getElementById("ai4paper." + param598 + ".removeapi.button").hidden = !param601 ? false : true;
    }
    if (param601) {
      var var3153 = window.confirm("是否确认解除 API 绑定？");
      if (var3153) {
        Zotero.Prefs.set("ai4paper." + param597, "未验证");
        fn15();
      }
      return;
    }
    param600 ? (window.alert("验证成功！"), Zotero.Prefs.set("ai4paper." + param597, '验证成功'), fn15()) : Zotero.Prefs.get("ai4paper." + param597) === "验证成功" && fn15();
  },
  'transbyShortCuts_getRaw': function () {
    const var3154 = Zotero.AI4Paper.getSelectedText().trim();
    if (!var3154) return;
    if (Zotero.Prefs.get('ai4paper.translationreadersidepane')) {
      Zotero.AI4Paper.translateSourceText = var3154;
      Zotero.AI4Paper.translateResponse = '';
      Zotero.AI4Paper.updateTranslateReaderSidePane();
    }
    return var3154;
  },
  'transVocabulary_checkDuplicate': async function (param602, param603) {
    let var3155 = 0x0;
    const var3156 = new Zotero.Search();
    var3156.libraryID = Zotero.Libraries.userLibraryID;
    var3156.addCondition("itemType", 'is', "note");
    var3156.addCondition("tag", 'is', '/生词本');
    const var3157 = await var3156.search(),
      var3158 = await Zotero.Items.getAsync(var3157);
    if (var3158.length != 0x0) {
      let _0x5e47fc = var3158[0x0].getNote();
      if (_0x5e47fc.indexOf(param602.key) != -0x1) return false;
      _0x5e47fc.indexOf('>' + param603 + "</a>") != -0x1 && (Zotero.AI4Paper.showProgressWindow(0x4e20, "❌【重复收藏】", '生词本已存在该生词！无须重复收藏。', "vocabulary"), var3155 = 0x1);
    }
    return var3155;
  },
  'transField_getRaw': function (param604, param605) {
    if (param604.getField('title').search(/[_\u4e00-\u9fa5]/) != -0x1) {
      return param605 === "title" && (param604.setField("shortTitle", param604.getField('title')), param604.saveTx()), false;
    }
    return Zotero.AI4Paper.getRawInAbstractNote(param605, param604.getField(param605));
  },
  'getRawInAbstractNote': function (param606, param607) {
    if (param606 === "abstractNote") {
      if (param607.indexOf("【摘要翻译】") != -0x1) {
        let var3160 = param607.indexOf("【摘要翻译】");
        param607 = param607.substring(0x0, var3160);
        if (param607.lastIndexOf('\x0a\x0a') === param607.length - 0x2) {
          param607 = param607.substring(0x0, param607.length - 0x2);
        } else param607.lastIndexOf('\x0a') === param607.length - 0x1 && (param607 = param607.substring(0x0, param607.length - 0x1));
      }
    }
    return param607;
  },
  'transbyShortCuts_Handler': function (param608, param609, param610) {
    Zotero.Prefs.get('ai4paper.translationreadersidepane') && (Zotero.AI4Paper.translateResponse = param610, Zotero.AI4Paper.updateTranslateReaderSidePane());
    Zotero.Prefs.get('ai4paper.translationSelectionPopupTextArea') && Zotero.AI4Paper.updateTranslationPopupTextArea(param610);
    Zotero.AI4Paper.CheckPDFReader() && !Zotero.Prefs.get("ai4paper.disablepdfreadertransprogresswindow") && Zotero.AI4Paper.showProgressWindow(0x1388, '【' + param608 + '】', '' + param610);
    Zotero.AI4Paper.trans2ViewerANDRecord(param609, param610);
    Zotero.Prefs.get("ai4paper.translationautocopy") && Zotero.AI4Paper.copy2Clipboard(param610);
  },
  'transField_Handler': function (param611, param612, param613, param614) {
    if (param612 === "title") {
      param611.setField("shortTitle", param614);
      param611.saveTx();
      Zotero.AI4Paper._Num_translateTitle++;
    } else param612 === "abstractNote" && (param611.setField('abstractNote', param613 + "\n\n【摘要翻译】" + param614), param611.saveTx(), Zotero.AI4Paper._Num_translateAbstract++);
  },
  'translateTitle': async function () {
    this._Num_translateTitle = 0x0;
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var3161 = Zotero_Tabs._selectedID;
    var var3162 = Zotero.Reader.getByTabID(var3161);
    let var3163 = Zotero.AI4Paper.betterURL();
    if (var3162) {
      let var3164 = var3162.itemID;
      var var3165 = Zotero.Items.get(var3164);
      var3165 && var3165.parentItemID && (var3164 = var3165.parentItemID, var3165 = Zotero.Items.get(var3164), Zotero.AI4Paper.showProgressWindow(0x5dc, "翻译标题【" + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', "您正在翻译当前文献的标题，请稍等...结果将通过弹窗反馈给您！"), var3163 && (await Zotero.AI4Paper.translationEngineTask_title_abstract(var3165, "title"), Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 翻译标题【" + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', "您成功翻译【" + this._Num_translateTitle + "】篇文献的标题！")));
    } else {
      var var3166 = ZoteroPane.getSelectedItems().filter(_0x529cde => _0x529cde.isRegularItem());
      Zotero.AI4Paper.showProgressWindow(0xbb8, '翻译标题【' + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', "您正在翻译 " + var3166.length + " 篇文献的标题，请稍等...结果将通过弹窗反馈给您！");
      if (var3163) {
        for (let var3167 of var3166) {
          var3167.isRegularItem() && (await Zotero.AI4Paper.translationEngineTask_title_abstract(var3167, "title"));
        }
        await new Promise(_0x1f5eb2 => setTimeout(_0x1f5eb2, 0xc8));
        Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 翻译标题【" + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', "您成功翻译【" + this._Num_translateTitle + '】篇文献的标题！');
      }
    }
  },
  'translateAbstract': async function () {
    this._Num_translateAbstract = 0x0;
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var3168 = Zotero_Tabs._selectedID;
    var var3169 = Zotero.Reader.getByTabID(var3168);
    let var3170 = Zotero.AI4Paper.showDate();
    if (var3169) {
      let _0x1c00e2 = var3169.itemID;
      var var3172 = Zotero.Items.get(_0x1c00e2);
      var3172 && var3172.parentItemID && (_0x1c00e2 = var3172.parentItemID, var3172 = Zotero.Items.get(_0x1c00e2), Zotero.AI4Paper.showProgressWindow(0x5dc, "翻译摘要【" + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', '您正在翻译当前文献的摘要，请稍等...结果将通过弹窗反馈给您！'), var3170 && (await Zotero.AI4Paper.translationEngineTask_title_abstract(var3172, 'abstractNote'), Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 翻译摘要【" + Zotero.Prefs.get("ai4paper.titleabstransengine") + '】', "您成功翻译【" + this._Num_translateAbstract + '】篇文献的摘要！')));
    } else {
      var var3173 = ZoteroPane.getSelectedItems().filter(_0x365f3f => _0x365f3f.isRegularItem());
      Zotero.AI4Paper.showProgressWindow(0xbb8, "翻译摘要【" + Zotero.Prefs.get('ai4paper.titleabstransengine') + '】', "您正在翻译 " + var3173.length + '\x20篇文献的摘要，请稍等...结果将通过弹窗反馈给您！');
      if (var3170) {
        for (let var3174 of var3173) {
          var3174.isRegularItem() && (await Zotero.AI4Paper.translationEngineTask_title_abstract(var3174, "abstractNote"));
        }
        await new Promise(_0x2ea9b2 => setTimeout(_0x2ea9b2, 0xc8));
        Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 翻译摘要【" + Zotero.Prefs.get('ai4paper.titleabstransengine') + '】', "您成功翻译【" + this._Num_translateAbstract + '】篇文献的摘要！');
      }
    }
  },
});
