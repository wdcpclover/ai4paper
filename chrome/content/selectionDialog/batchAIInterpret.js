function init() {
  updateFooterUI();
  window.updateFooterUI = updateFooterUI;
  initEventListeners();
  TaskManager.checkEmpty();
}
;
const STATUS = {
  'QUEUED': "queued",
  'RUNNING': "running",
  'COMPLETED': "completed",
  'ERROR': "error",
  'ABORTED': "aborted"
};
class Task {
  constructor(_0x16bf6d, _0x14b121, _0x54f005) {
    this.id = generateId();
    this.itemId = _0x16bf6d;
    this.title = _0x14b121;
    this.pdfAttachmentId = _0x54f005;
    this.status = STATUS.QUEUED;
    this.progress = 0x0;
    this.output = '';
    this.errorMsg = '';
    this.noteId = null;
    this.abortController = null;
    this.createdAt = Date.now();
    this.startedAt = null;
    this.finishedAt = null;
    this.expanded = false;
    this._lastUIUpdate = 0x0;
    this.chatHistory = [];
  }
}
const TaskManager = {
    'tasks': [],
    'activeCount': 0x0,
    'currentFilter': "all",
    'addTask'(_0x5b9d1d) {
      const var1 = this.tasks.find(_0x32366a => _0x32366a.itemId === _0x5b9d1d.itemId && _0x32366a.status !== STATUS.ERROR && _0x32366a.status !== STATUS.ABORTED);
      if (var1) return showToast('「' + _0x5b9d1d.title + '」已在解读队列中', "warning"), false;
      return this.tasks.push(_0x5b9d1d), this.renderTask(_0x5b9d1d), this.updateCounts(), this.tryProcessNext(), true;
    },
    'tryProcessNext'() {
      const var2 = parseInt(Zotero.Prefs.get("zoteroif.concurrency4BatchAIInterpret") || 0x4);
      while (this.activeCount < var2) {
        const var3 = this.tasks.find(_0x3e3b55 => _0x3e3b55.status === STATUS.QUEUED);
        if (!var3) break;
        this.runTask(var3);
      }
    },
    async 'runTask'(_0x3d8f5c) {
      _0x3d8f5c.status = STATUS.RUNNING;
      _0x3d8f5c.startedAt = Date.now();
      _0x3d8f5c.abortController = new AbortController();
      this.activeCount++;
      this.updateTaskUI(_0x3d8f5c);
      this.updateCounts();
      try {
        _0x3d8f5c.progress = 0x5;
        this.updateTaskUI(_0x3d8f5c);
        const var4 = await this.extractPdfText(_0x3d8f5c.pdfAttachmentId);
        if (!var4 || var4.trim().length === 0x0) throw new Error("无法提取 PDF 文本内容，可能文件损坏或为扫描件");
        const var5 = var4;
        _0x3d8f5c.progress = 0xa;
        this.updateTaskUI(_0x3d8f5c);
        await this.callAIStream(_0x3d8f5c, var5);
        if (_0x3d8f5c.status === STATUS.RUNNING) {
          _0x3d8f5c.progress = 0x5f;
          this.updateTaskUI(_0x3d8f5c);
          await this.saveNote(_0x3d8f5c);
          _0x3d8f5c.status = STATUS.COMPLETED;
          _0x3d8f5c.progress = 0x64;
          _0x3d8f5c.finishedAt = Date.now();
          const var6 = document.getElementById(_0x3d8f5c.id);
          if (var6 && _0x3d8f5c.expanded) {
            const var7 = var6.querySelector('iframe');
            if (var7 && var7.contentWindow) try {
              var7.contentWindow.setStreaming(false);
            } catch (_0x5489c0) {}
          }
        }
      } catch (_0xea8f45) {
        if (_0x3d8f5c.status === STATUS.ABORTED) {} else {
          _0x3d8f5c.status = STATUS.ERROR;
          _0x3d8f5c.errorMsg = _0xea8f45.message || String(_0xea8f45);
          _0x3d8f5c.finishedAt = Date.now();
        }
      } finally {
        this.activeCount--;
        _0x3d8f5c.abortController = null;
        this.updateTaskUI(_0x3d8f5c);
        this.updateCounts();
        this.saveChatHistory2Local(_0x3d8f5c);
        this.tryProcessNext();
      }
    },
    async 'saveChatHistory2Local'(_0x23abf3) {
      try {
        _0x23abf3.chatHistory.push({
          'role': "assistant",
          'content': _0x23abf3.output
        });
        let var8 = " ⌚️ " + Zotero.ZoteroIF.getDateTime().replace(/:/g, '-'),
          var9 = "PDF 全文",
          var10 = Zotero.ZoteroIF.findItemByIDORKey(Zotero.Items.get(_0x23abf3.pdfAttachmentId)?.["key"]);
        if (var10) {
          let var11 = var10.attachmentFilename;
          var9 = "🤖 " + Zotero.ZoteroIF.sanitizeFilename(var11.substring(0x0, 0x5a));
        }
        let var12 = '' + var9 + var8 + ".json";
        try {
          if (Zotero.Prefs.get("zoteroif.gptChatHistoryEnable") && Zotero.Prefs.get("zoteroif.syncChatHistory4BatchAIInterpret")) {
            let var13 = Zotero.Prefs.get("zoteroif.gptChatHistoryLocalPath");
            if (var13 && (await Zotero.ZoteroIF.isPathExists(var13))) {
              let var14 = JSON.stringify(_0x23abf3.chatHistory, null, 0x2),
                var15 = PathUtils.join(var13, var12);
              await Zotero.File.putContentsAsync(var15, var14);
            }
          }
        } catch (_0x4a3717) {
          Zotero.debug(_0x4a3717);
        }
      } catch (_0x3e785a) {
        Zotero.debug(_0x3e785a);
      }
    },
    async 'extractPdfText'(_0x6f390f) {
      try {
        const var16 = await Zotero.Items.getAsync(_0x6f390f);
        if (!var16) throw new Error("找不到附件");
        let var17 = '';
        if (typeof var16.attachmentText === "string") var17 = var16.attachmentText;else typeof var16.attachmentText === "object" && var16.attachmentText.then ? var17 = await var16.attachmentText : var17 = await Zotero.Fulltext.getTextForItem(_0x6f390f);
        if (!var17) {
          const var18 = await Zotero.Fulltext.getIndexedTextContent(_0x6f390f);
          if (var18) var17 = var18;
        }
        return var17 || '';
      } catch (_0x4a89b7) {
        Zotero.debug('AI\x20解读\x20-\x20PDF提取错误:\x20' + _0x4a89b7.message);
        throw new Error("PDF 文本提取失败: " + _0x4a89b7.message);
      }
    },
    async 'callAIStream'(_0x3cf01a, _0x2cce3f) {
      const {
          serviceName: _0x439538,
          model: _0x22e6d2
        } = getServiceNameAndModel(),
        var19 = Zotero.ZoteroIF.getURL4GPTCustom(_0x439538),
        var20 = Zotero.ZoteroIF.gptServiceList()[_0x439538].api_key,
        var21 = Zotero.ZoteroIF.resolvePrompt(Zotero.Prefs.get("zoteroif.prompt4BatchAIInterpret")),
        var22 = var21 + "：\n\n" + _0x2cce3f;
      try {
        Zotero.ZoteroIF.gptService_isTokenEmpty_APIVerified(var20, _0x439538, false, false, true);
      } catch (_0x4e0174) {
        throw new Error(_0x4e0174.message);
      }
      const var23 = {
        'model': _0x22e6d2,
        'messages': [{
          'role': "user",
          'content': var22
        }],
        'stream': true
      };
      let var24 = this.getIdxFromServiceName(_0x439538);
      Zotero.ZoteroIF.gptReaderSidePane_addRequestArguments(var23, var24);
      _0x3cf01a.chatHistory.push({
        'role': "user",
        'content': var22,
        'prompt': var21,
        'fulltext': _0x2cce3f,
        'fileID': Zotero.Items.get(_0x3cf01a.pdfAttachmentId)?.['key'],
        'service': _0x439538,
        'model': _0x22e6d2
      });
      const var25 = {
        'Content-Type': "application/json"
      };
      var20 && (var25.Authorization = "Bearer " + var20);
      Zotero.debug("AI 解读 - 请求 URL: " + var19);
      Zotero.debug("AI 解读 - 模型: " + _0x22e6d2);
      Zotero.debug("AI 解读 - PDF 文本长度: " + _0x2cce3f.length);
      const var26 = await fetch(var19, {
        'method': "POST",
        'headers': var25,
        'body': JSON.stringify(var23),
        'signal': _0x3cf01a.abortController.signal
      });
      if (!var26.ok) {
        const var27 = await var26.text()["catch"](() => '');
        Zotero.debug('AI\x20解读\x20-\x20API\x20错误响应:\x20' + var27.substring(0x0, 0x1f4));
        throw new Error("API 请求失败 (" + var26.status + "): " + var27.substring(0x0, 0xc8));
      }
      Zotero.debug('AI\x20解读\x20-\x20开始读取流式响应...');
      const var28 = var26.body.getReader(),
        var29 = new TextDecoder("utf-8");
      let var30 = '',
        var31 = 0x7d0,
        var32 = 0x0,
        var33 = {
          'target': '',
          'hasReasoning_content': false,
          'reasoning_contentStart': false,
          'reasoning_contentEnd': false
        };
      while (true) {
        if (_0x3cf01a.status === STATUS.ABORTED) {
          var28.cancel();
          return;
        }
        const {
          done: _0x235a9c,
          value: _0xc0073e
        } = await var28.read();
        if (_0x235a9c) {
          Zotero.debug("AI 解读 - 流读取完毕, 总输出字数: " + _0x3cf01a.output.length);
          break;
        }
        var30 += var29.decode(_0xc0073e, {
          'stream': true
        });
        const var34 = var30.split('\x0a');
        var30 = var34.pop() || '';
        for (const var35 of var34) {
          const var36 = var35.trim();
          if (!var36) continue;
          if (!var36.startsWith("data:")) continue;
          const var37 = var36.slice(0x5).trim();
          if (var37 === "[DONE]") {
            Zotero.debug("AI 解读 - 收到 [DONE] 信号");
            break;
          }
          try {
            const var38 = JSON.parse(var37),
              var39 = var38.choices[0x0]?.["delta"];
            if (var39) {
              this.getContentAndReasoning(var39, var33);
              _0x3cf01a.output = var33.target;
              var32++;
              var32 > var31 * 0.5 && (var31 = var32 * 0x2);
              _0x3cf01a.progress = Math.min(0x5a, 0xa + Math.round(var32 / var31 * 0x50));
              this.updateTaskPreview(_0x3cf01a);
              const var40 = Date.now();
              var40 - _0x3cf01a._lastUIUpdate >= 0x12c && (_0x3cf01a._lastUIUpdate = var40, this.updateTaskUIPartial(_0x3cf01a));
            }
            if (var38.choices?.[0x0]?.["finish_reason"] === 'stop') {
              Zotero.debug("AI 解读 - finish_reason=stop, 输出字数: " + _0x3cf01a.output.length);
              break;
            }
          } catch (_0x5e024f) {
            Zotero.debug("AI 解读 - SSE解析异常, dataStr: " + var37.substring(0x0, 0x64) + " err: " + _0x5e024f.message);
          }
        }
      }
      if (!_0x3cf01a.output || _0x3cf01a.output.trim().length === 0x0) {
        Zotero.debug("AI 解读 - ⚠️ 流式读取结束但 output 为空!");
        throw new Error("AI 返回了空内容，请检查 API 配置或模型是否正确");
      }
      Zotero.debug('AI\x20解读\x20-\x20流式读取成功,\x20最终字数:\x20' + _0x3cf01a.output.length);
    },
    'getContentAndReasoning'(_0x2f5ab8, _0xa81c05) {
      try {
        let var41 = _0x2f5ab8?.["content"],
          var42 = _0x2f5ab8?.["reasoning_content"];
        if (Zotero.Prefs.get("zoteroif.includeReasoning4BatchAIInterpret")) {
          if (var41 || var42) {
            if (!var41 && var42) {
              !_0xa81c05.hasReasoning_content && (_0xa81c05.hasReasoning_content = true, _0xa81c05.reasoning_contentStart = true);
              _0xa81c05.reasoning_contentStart ? (_0xa81c05.target += "<think>" + var42, _0xa81c05.reasoning_contentStart = false) : _0xa81c05.target += var42;
            } else var41 && !var42 && (_0xa81c05.hasReasoning_content && (_0xa81c05.hasReasoning_content = false, _0xa81c05.reasoning_contentEnd = true), _0xa81c05.reasoning_contentEnd ? (_0xa81c05.target += "</think>\n" + var41, _0xa81c05.reasoning_contentEnd = false) : _0xa81c05.target += var41);
          }
        } else var41 && (_0xa81c05.target += var41);
      } catch (_0x1b6e86) {
        Zotero.debug("AI4paper - SSE 解析异常, dataStr:  err: " + _0x1b6e86.message);
      }
    },
    'getIdxFromServiceName'(_0x783fdd) {
      if (_0x783fdd.includes("GPT 自定")) for (let var43 of Object.keys(Zotero.ZoteroIF.gptCustom_numEmoji)) {
        if (_0x783fdd === 'GPT\x20自定\x20' + Zotero.ZoteroIF.gptCustom_numEmoji[var43]) return var43;
      }
      return '1';
    },
    async 'saveNote'(_0x18b8bb) {
      try {
        const var44 = await Zotero.Items.getAsync(_0x18b8bb.itemId);
        if (!var44) throw new Error('找不到父条目');
        if (!_0x18b8bb.output || _0x18b8bb.output.trim().length === 0x0) throw new Error("AI 输出内容为空，无法保存笔记");
        let var45;
        try {
          var45 = Zotero.ZoteroIF.gptReaderSidePane_ChatMode_renderMessageContent(null, _0x18b8bb.output);
        } catch (_0x5722cb) {
          throw new Error("AI 解读 - Markdown 渲染失败: " + _0x5722cb.message);
        }
        const var46 = '<h2\x20style=\x22color:\x20#00ae89;\x22>🤖️\x20AI\x20文献解读</h2>',
          var47 = document.getElementById("footer-service")?.["textContent"] || '',
          var48 = document.getElementById('footer-model')?.["textContent"] || '',
          var49 = "<hr/><p style=\"color: gray;\">\n                <code>" + var47 + "</code>&#160;\n                <code>" + var48 + "</code>&#160;\n                <em>\n                    由批量 AI 解读自动生成于 " + new Date().toLocaleString() + "\n                </em>\n            </p>",
          var50 = await Zotero.ZoteroIF.createNoteItem_basedOnTag(var44, Zotero.ZoteroIF._aiReadingNoteTag, true);
        if (!var50) throw new Error('无法创建笔记条目');
        _0x18b8bb.noteId = var50.id;
        const var51 = "<a href=\"" + Zotero.ZoteroIF.getItemLink(var50) + "\">笔记回链</a>",
          var52 = var46 + "<blockquote><span class=\"AIReading\">🤖 AI 解读，快人一步</span>" + var45 + "<p>🚀 " + var51 + var49 + "<p>🏷️ #🤖️/AI文献阅读</blockquote>";
        var50.setNote(var52);
        await var50.saveTx();
        await Zotero.ZoteroIF.retryContent2NoteItem(var50, var52);
        showToast('「' + _0x18b8bb.title + "」解读完成，笔记已保存", "success");
        try {
          await Zotero.ZoteroIF.addEmojiTag2ParentItemOnPaperAI(var44);
        } catch (_0x8388fd) {
          Zotero.debug("AI 解读 - 为父条目添加标签失败: " + _0x8388fd.message);
        }
        try {
          Zotero.Prefs.get("zoteroif.updateModifiedDate4PapersMatrix") && (await Zotero.ZoteroIF.updateModifiedDate4PapersMatrix(var44));
        } catch (_0x521336) {
          Zotero.debug("AI 解读 - 强制刷新条目修改时间失败: " + _0x521336.message);
        }
        try {
          await Zotero.ZoteroIF.refreshObsidianNoteChatGPT(var44);
        } catch (_0x867cb) {
          Zotero.debug('AI\x20解读\x20-\x20自动同步至\x20Obsidian\x20Note\x20失败:\x20' + _0x867cb.message);
        }
      } catch (_0x5140a5) {
        throw new Error('笔记保存失败:\x20' + _0x5140a5.message);
      }
    },
    'abortTask'(_0x3dc638) {
      const var53 = this.tasks.find(_0x583936 => _0x583936.id === _0x3dc638);
      if (!var53) return;
      if (var53.status === STATUS.RUNNING) {
        var53.status = STATUS.ABORTED;
        var53.finishedAt = Date.now();
        var53.abortController && var53.abortController.abort();
        this.updateTaskUI(var53);
        this.updateCounts();
        showToast('已终止「' + var53.title + '」', "warning");
      } else var53.status === STATUS.QUEUED && (var53.status = STATUS.ABORTED, var53.finishedAt = Date.now(), this.updateTaskUI(var53), this.updateCounts());
    },
    'abortAll'() {
      for (const var54 of this.tasks) {
        (var54.status === STATUS.RUNNING || var54.status === STATUS.QUEUED) && this.abortTask(var54.id);
      }
    },
    'removeTask'(_0x86f7) {
      const var55 = this.tasks.findIndex(_0x175f50 => _0x175f50.id === _0x86f7);
      if (var55 === -0x1) return;
      const var56 = this.tasks[var55];
      var56.status === STATUS.RUNNING && this.abortTask(_0x86f7);
      this.tasks.splice(var55, 0x1);
      const var57 = document.getElementById(_0x86f7);
      if (var57) var57.remove();
      this.updateCounts();
      this.checkEmpty();
    },
    'clearDone'() {
      const var58 = this.tasks.filter(_0x38c9ad => _0x38c9ad.status === STATUS.COMPLETED || _0x38c9ad.status === STATUS.ABORTED || _0x38c9ad.status === STATUS.ERROR);
      for (const var59 of var58) {
        const var60 = document.getElementById(var59.id);
        if (var60) var60.remove();
      }
      this.tasks = this.tasks.filter(_0xf45af9 => _0xf45af9.status !== STATUS.COMPLETED && _0xf45af9.status !== STATUS.ABORTED && _0xf45af9.status !== STATUS.ERROR);
      this.updateCounts();
      this.checkEmpty();
      showToast("已清理完成的任务", "info");
    },
    'retryTask'(_0x582d48) {
      const var61 = this.tasks.find(_0x29dcba => _0x29dcba.id === _0x582d48);
      if (!var61) return;
      if (var61.status === STATUS.RUNNING) return;
      const var62 = new Task(var61.itemId, var61.title, var61.pdfAttachmentId);
      this.removeTask(_0x582d48);
      this.addTask(var62);
      showToast("已重新排队「" + var61.title + '」', "info");
    },
    'renderTask'(_0x26f2e5) {
      const var63 = $("#task-list"),
        var64 = $('#empty-state');
      var64.style.display = "none";
      const var65 = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
      var65.id = _0x26f2e5.id;
      var65.className = 'task-card\x20status-' + _0x26f2e5.status;
      var65.setAttribute('data-item-id', _0x26f2e5.itemId);
      var65.innerHTML = this.buildCardHTML(_0x26f2e5);
      var63.appendChild(var65);
      var65.addEventListener("contextmenu", _0x84c23 => {
        if (window._suppressContextMenu) {
          window._suppressContextMenu = false;
          return;
        }
        _0x84c23.preventDefault();
        this.showContextMenu(_0x84c23, _0x26f2e5.id);
      });
      this.applyFilter();
    },
    'buildCardHTML'(_0x2a3210) {
      let var66 = '';
      if (_0x2a3210.status === STATUS.COMPLETED) var66 = 'completed';else {
        if (_0x2a3210.status === STATUS.ERROR) var66 = "error";else {
          if (_0x2a3210.status === STATUS.ABORTED) var66 = "aborted";
        }
      }
      const var67 = {
          [STATUS.QUEUED]: ["排队中", 'badge-queued'],
          [STATUS.RUNNING]: ["解读中", "badge-running"],
          [STATUS.COMPLETED]: ["已完成", 'badge-completed'],
          [STATUS.ERROR]: ['失败', "badge-error"],
          [STATUS.ABORTED]: ["已终止", "badge-aborted"]
        },
        [_0x427b69, _0x2bfe7e] = var67[_0x2a3210.status] || ['未知', "badge-queued"],
        var68 = _0x2a3210.startedAt ? ((_0x2a3210.finishedAt || Date.now()) - _0x2a3210.startedAt) / 0x3e8 : 0x0,
        var69 = var68 > 0x0 ? Math.round(var68) + 's' : '-',
        var70 = _0x2a3210.output ? _0x2a3210.output.length >= 0x3e8 ? (_0x2a3210.output.length / 0x3e8).toFixed(0x1) + 'k' : String(_0x2a3210.output.length) : '-';
      let var71 = '';
      if (_0x2a3210.status === STATUS.RUNNING || _0x2a3210.status === STATUS.QUEUED) {
        var71 += '<span\x20class=\x22act-btn\x20act-abort\x22\x20data-id=\x22' + _0x2a3210.id + "\" title=\"终止此任务\">⏹</span>";
        var71 += "<span class=\"act-btn act-locate\" data-id=\"" + _0x2a3210.id + "\" title=\"在文库中定位\">🔍</span>";
      } else {
        if (_0x2a3210.status === STATUS.COMPLETED) {
          var71 += '<span\x20class=\x22act-btn\x20act-note\x22\x20data-id=\x22' + _0x2a3210.id + "\" title=\"打开解读笔记\">📝</span>";
          var71 += "<span class=\"act-btn act-locate\" data-id=\"" + _0x2a3210.id + "\" title=\"在文库中定位\">🔍</span>";
        } else (_0x2a3210.status === STATUS.ERROR || _0x2a3210.status === STATUS.ABORTED) && (var71 += '<span\x20class=\x22act-btn\x20act-retry\x22\x20data-id=\x22' + _0x2a3210.id + '\x22\x20title=\x22重新解读\x22>🔄</span>', var71 += "<span class=\"act-btn act-locate\" data-id=\"" + _0x2a3210.id + "\" title=\"在文库中定位\">🔍</span>");
      }
      return '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22task-row\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22task-expand-toggle\x22\x20title=\x22展开/收起预览\x22></div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22task-progress-cell\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22task-mini-bar\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22task-mini-bar-fill\x20' + var66 + '\x22\x20style=\x22width:' + _0x2a3210.progress + "%\"></div>\n                </div>\n                <span class=\"task-pct\">" + _0x2a3210.progress + "%</span>\n            </div>\n            <div class=\"task-title\" title=\"" + escapeHtml(_0x2a3210.title) + '\x22>' + escapeHtml(_0x2a3210.title) + "</div>\n            <span class=\"task-status-badge " + _0x2bfe7e + '\x22>' + _0x427b69 + "</span>\n            <span class=\"task-time\">" + var69 + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22task-chars\x22>' + var70 + "</span>\n            <div class=\"task-actions\">" + var71 + "</div>\n        </div>\n        <div class=\"task-preview\"></div>\n    ";
    },
    'updateTaskUI'(_0x5b5a57) {
      const var72 = document.getElementById(_0x5b5a57.id);
      if (!var72) return;
      var72.className = "task-card status-" + _0x5b5a57.status;
      if (_0x5b5a57.expanded) var72.classList.add('expanded');
      const var73 = var72.querySelector(".task-mini-bar-fill");
      if (var73) {
        var73.style.width = _0x5b5a57.progress + '%';
        var73.classList.remove('completed', "error", "aborted");
        if (_0x5b5a57.status === STATUS.COMPLETED) var73.classList.add('completed');else {
          if (_0x5b5a57.status === STATUS.ERROR) var73.classList.add("error");else {
            if (_0x5b5a57.status === STATUS.ABORTED) var73.classList.add("aborted");
          }
        }
      }
      const var74 = var72.querySelector(".task-pct");
      if (var74) var74.textContent = _0x5b5a57.progress + '%';
      const var75 = var72.querySelector(".task-status-badge");
      if (var75) {
        const var76 = {
            [STATUS.QUEUED]: ['排队中', "badge-queued"],
            [STATUS.RUNNING]: ["解读中", "badge-running"],
            [STATUS.COMPLETED]: ["已完成", "badge-completed"],
            [STATUS.ERROR]: ['失败', 'badge-error'],
            [STATUS.ABORTED]: ["已终止", "badge-aborted"]
          },
          [_0x276855, _0x9f2770] = var76[_0x5b5a57.status] || ['未知', "badge-queued"];
        var75.textContent = _0x276855;
        var75.className = "task-status-badge " + _0x9f2770;
      }
      const var77 = var72.querySelector(".task-time");
      if (var77) {
        const var78 = _0x5b5a57.startedAt ? ((_0x5b5a57.finishedAt || Date.now()) - _0x5b5a57.startedAt) / 0x3e8 : 0x0;
        var77.textContent = var78 > 0x0 ? Math.round(var78) + 's' : '-';
      }
      const var79 = var72.querySelector(".task-chars");
      if (var79) {
        const var80 = _0x5b5a57.output.length;
        var79.textContent = var80 >= 0x3e8 ? (var80 / 0x3e8).toFixed(0x1) + 'k' : var80 || '-';
      }
      const var81 = var72.querySelector(".task-actions");
      if (var81) {
        let var82 = '';
        if (_0x5b5a57.status === STATUS.RUNNING || _0x5b5a57.status === STATUS.QUEUED) {
          var82 += "<span class=\"act-btn act-abort\" data-id=\"" + _0x5b5a57.id + "\" title=\"终止此任务\">⏹</span>";
          var82 += "<span class=\"act-btn act-locate\" data-id=\"" + _0x5b5a57.id + '\x22\x20title=\x22在文库中定位\x22>🔍</span>';
        } else {
          if (_0x5b5a57.status === STATUS.COMPLETED) {
            var82 += '<span\x20class=\x22act-btn\x20act-note\x22\x20data-id=\x22' + _0x5b5a57.id + "\" title=\"打开解读笔记\">📝</span>";
            var82 += "<span class=\"act-btn act-locate\" data-id=\"" + _0x5b5a57.id + "\" title=\"在文库中定位\">🔍</span>";
          } else (_0x5b5a57.status === STATUS.ERROR || _0x5b5a57.status === STATUS.ABORTED) && (var82 += "<span class=\"act-btn act-retry\" data-id=\"" + _0x5b5a57.id + "\" title=\"重新解读\">🔄</span>", var82 += "<span class=\"act-btn act-locate\" data-id=\"" + _0x5b5a57.id + "\" title=\"在文库中定位\">🔍</span>");
        }
        var81.innerHTML = var82;
      }
      _0x5b5a57.expanded && this.refreshPreviewContent(_0x5b5a57, var72);
      this.updateOverallProgress();
      this.applyFilter();
    },
    'updateTaskUIPartial'(_0x5bf994) {
      const var83 = document.getElementById(_0x5bf994.id);
      if (!var83) return;
      const var84 = var83.querySelector('.task-mini-bar-fill');
      if (var84) var84.style.width = _0x5bf994.progress + '%';
      const var85 = var83.querySelector(".task-pct");
      if (var85) var85.textContent = _0x5bf994.progress + '%';
      const var86 = var83.querySelector('.task-time');
      if (var86) {
        const var87 = _0x5bf994.startedAt ? (Date.now() - _0x5bf994.startedAt) / 0x3e8 : 0x0;
        var86.textContent = var87 > 0x0 ? Math.round(var87) + 's' : '-';
      }
      const var88 = var83.querySelector(".task-chars");
      if (var88) {
        const var89 = _0x5bf994.output.length;
        var88.textContent = var89 >= 0x3e8 ? (var89 / 0x3e8).toFixed(0x1) + 'k' : var89 || '-';
      }
      this.updateOverallProgress();
    },
    'updateTaskPreview'(_0xe2d42) {
      if (!_0xe2d42.expanded || !_0xe2d42.output) return;
      const var90 = document.getElementById(_0xe2d42.id);
      if (var90) this.refreshPreviewContent(_0xe2d42, var90);
    },
    'refreshPreviewContent'(_0xe9e4ff, _0x20615f) {
      const var91 = _0x20615f.querySelector(".task-preview");
      if (!var91) return;
      if (!_0xe9e4ff.output && !_0xe9e4ff.errorMsg) {
        let var92 = var91.querySelector("iframe");
        if (var92 && var92._loaded && var92.contentWindow && var92.contentWindow._previewReady) var92.contentWindow.showEmpty();else {
          var91.innerHTML = '';
          const var93 = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
          var93.style.cssText = "color:#8b8da3; text-align:center; padding:20px; font-size:12px;";
          var93.textContent = "暂无内容";
          var91.appendChild(var93);
        }
        return;
      }
      let var94 = var91.querySelector("iframe");
      if (!var94) {
        var94 = document.createElementNS("http://www.w3.org/1999/xhtml", "iframe");
        var94.addEventListener("load", () => {
          var94._loaded = true;
          const var95 = var91.querySelector(".task-preview-loading");
          if (var95) var95.remove();
          TaskManager._writeToPreviewIframe(var94, _0xe9e4ff);
        });
        var94.src = "chrome://zoteroif/content/selectionDialog/preview.html";
        var91.textContent = '';
        const var96 = document.createElementNS('http://www.w3.org/1999/xhtml', "span");
        var96.className = "task-preview-loading";
        var96.textContent = "预览加载中…";
        var91.appendChild(var96);
        var91.appendChild(var94);
        const var97 = setInterval(() => {
          try {
            if (var94.contentWindow && var94.contentWindow._previewReady) {
              clearInterval(var97);
              if (!var94._loaded) {
                var94._loaded = true;
                const var98 = var91.querySelector(".task-preview-loading");
                if (var98) var98.remove();
                TaskManager._writeToPreviewIframe(var94, _0xe9e4ff);
              }
            }
          } catch (_0x3c8303) {}
        }, 0x64);
        setTimeout(() => clearInterval(var97), 0x1388);
      } else var94._loaded && TaskManager._writeToPreviewIframe(var94, _0xe9e4ff);
    },
    '_writeToPreviewIframe'(_0x51c7a1, _0x4f209e) {
      try {
        const var99 = _0x51c7a1.contentWindow;
        if (!var99 || !var99._previewReady) return;
        if (_0x4f209e.errorMsg && !_0x4f209e.output) var99.showError(_0x4f209e.errorMsg);else {
          if (!_0x4f209e.output) var99.showEmpty();else {
            let var100;
            try {
              var100 = Zotero.ZoteroIF.renderMarkdownLaTeX(this.formatTaskOut(_0x4f209e.output));
            } catch (_0x3a40f9) {
              var100 = "<pre>" + escapeHtml(_0x4f209e.output.slice(-0x1f4)) + "</pre>";
            }
            var99.updateContent(var100);
          }
        }
        const var101 = _0x4f209e.status === STATUS.RUNNING;
        var99.setStreaming(var101);
        requestAnimationFrame(() => {
          try {
            const var102 = Math.max(0x3c, Math.min(0x190, var99.getBodyHeight() + 0x10));
            _0x51c7a1.style.height = var102 + 'px';
          } catch (_0x174a71) {}
        });
      } catch (_0x6a7eeb) {
        Zotero.debug("AI 解读 - preview iframe write error: " + _0x6a7eeb.message);
      }
    },
    'formatTaskOut'(_0x2feb79) {
      let var103 = _0x2feb79;
      if (var103.indexOf("<think>") === 0x0) {
        if (var103.indexOf("</think>") === -0x1) {
          var103 = var103 + '</think>';
          var103 = var103.replace("<think>", "<blockquote>").replace("</think>", "</blockquote>\n");
        } else var103.indexOf("</think>") != -0x1 && (var103 = var103.replace("<think>", "<blockquote>").replace('</think>', "</blockquote>\n"));
      } else {
        if (var103.indexOf("\n<think>") === 0x0) {
          if (var103.indexOf("</think>") === -0x1) {
            var103 = var103 + "</think>";
            var103 = var103.replace("\n<think>", "<blockquote>").replace("</think>", "</blockquote>\n");
          } else var103.indexOf("</think>") != -0x1 && (var103 = var103.replace("\n<think>", "<blockquote>").replace('</think>', "</blockquote>\n"));
        }
      }
      return var103;
    },
    'updateCounts'() {
      const var104 = {
        'all': 0x0,
        'queued': 0x0,
        'running': 0x0,
        'completed': 0x0,
        'error': 0x0,
        'aborted': 0x0
      };
      for (const var105 of this.tasks) {
        var104.all++;
        var104[var105.status]++;
      }
      for (const var106 in var104) {
        const var107 = document.getElementById("count-" + var106);
        if (var107) var107.textContent = var104[var106];
      }
      this.updateOverallProgress();
      this.checkEmpty();
    },
    'updateOverallProgress'() {
      const var108 = this.tasks.length;
      if (var108 === 0x0) {
        $("#overall-bar-fill").style.width = '0%';
        $("#overall-text").textContent = "暂无任务";
        return;
      }
      const var109 = this.tasks.filter(_0x1f26d1 => _0x1f26d1.status === STATUS.COMPLETED).length,
        var110 = this.tasks.filter(_0x3a00ed => _0x3a00ed.status === STATUS.RUNNING).length,
        var111 = this.tasks.filter(_0x4cea4f => _0x4cea4f.status === STATUS.ERROR).length,
        var112 = this.tasks.filter(_0x148348 => _0x148348.status === STATUS.ABORTED).length;
      let var113 = 0x0;
      for (const var114 of this.tasks) {
        var113 += var114.progress;
      }
      const var115 = Math.round(var113 / var108);
      $("#overall-bar-fill").style.width = var115 + '%';
      $("#overall-text").textContent = var109 + '/' + var108 + " 完成 | " + var110 + " 进行中" + (var111 > 0x0 ? " | " + var111 + " 失败" : '');
    },
    'checkEmpty'() {
      const var116 = $("#empty-state"),
        var117 = $('#task-list');
      this.tasks.length === 0x0 ? var116.style.display = "flex" : var116.style.display = "none";
    },
    'applyFilter'() {
      const var118 = this.currentFilter,
        var119 = $$(".task-card");
      var119.forEach(_0x4b17bc => {
        var118 === "all" ? _0x4b17bc.style.display = '' : _0x4b17bc.style.display = _0x4b17bc.classList.contains("status-" + var118) ? '' : "none";
      });
    },
    'copyPreview'(_0x4f6366) {
      const var120 = this.tasks.find(_0x4217fb => _0x4217fb.id === _0x4f6366);
      if (!var120 || !var120.output) {
        showToast("暂无可拷贝的内容", "warning");
        return;
      }
      let var121 = var120.output;
      Zotero.ZoteroIF.copy2Clipboard(var121);
      showToast("已拷贝「" + var120.title + "」的预览内容：" + var121.substring(0x0, 0x19) + (var121.length > 0x1a ? "..." : ''), 'success');
    },
    'collapseAll'() {
      let var122 = 0x0;
      for (const var123 of this.tasks) {
        if (!var123.expanded) continue;
        var123.expanded = false;
        const var124 = document.getElementById(var123.id);
        var124 && var124.classList.remove("expanded");
        var122++;
      }
      var122 > 0x0 ? showToast("已折叠 " + var122 + " 个预览", 'info') : showToast("当前没有展开的预览", "info");
    },
    'showContextMenu'(_0x3accde, _0x5f37ff) {
      _0x3accde.preventDefault();
      _0x3accde.stopPropagation();
      this._contextTaskId = _0x5f37ff;
      this._contextMenuOpenTime = Date.now();
      const var125 = $("#context-menu");
      var125.classList.add("visible");
      let var126 = _0x3accde.clientX,
        var127 = _0x3accde.clientY;
      var125.style.left = var126 + 'px';
      var125.style.top = var127 + 'px';
      requestAnimationFrame(() => {
        const var128 = var125.getBoundingClientRect();
        var128.right > window.innerWidth && (var125.style.left = var126 - var128.width + 'px');
        var128.bottom > window.innerHeight && (var125.style.top = var127 - var128.height + 'px');
      });
      const var129 = this.tasks.find(_0x3f0403 => _0x3f0403.id === _0x5f37ff),
        var130 = var125.querySelectorAll(".ctx-item");
      var130.forEach(_0x2f72f4 => {
        const var131 = _0x2f72f4.getAttribute('data-action');
        _0x2f72f4.style.display = '';
        var131 === 'abort' && var129 && var129.status !== STATUS.RUNNING && var129.status !== STATUS.QUEUED && (_0x2f72f4.style.display = 'none');
        ["open-note", "locate-AIReadingNotes"].includes(var131) && var129 && !var129.noteId && (_0x2f72f4.style.display = "none");
        var131 === "retry" && var129 && var129.status === STATUS.RUNNING && (_0x2f72f4.style.display = "none");
        var131 === "copy-preview" && var129 && !var129.output && (_0x2f72f4.style.display = 'none');
      });
    },
    'hideContextMenu'() {
      $('#context-menu').classList.remove("visible");
    },
    'handleContextAction'(_0x1528b5) {
      const var132 = this._contextTaskId;
      if (!var132) return;
      const var133 = this.tasks.find(_0x497822 => _0x497822.id === var132);
      if (!var133) return;
      switch (_0x1528b5) {
        case "locate":
          this.locateInLibrary(var133.itemId);
          break;
        case 'open-pdf':
          this.openPdf(var133.pdfAttachmentId);
          break;
        case "open-note":
          if (var133.noteId) this.openNote(var133.noteId);else showToast("尚无解读笔记", "warning");
          break;
        case "locate-AIReadingNotes":
          if (var133.itemId) this.locateAIReadingNotes(var133.itemId);
          break;
        case "retry":
          this.retryTask(var132);
          break;
        case 'abort':
          this.abortTask(var132);
          break;
        case "remove":
          this.removeTask(var132);
          break;
        case "copy-preview":
          this.copyPreview(var132);
          break;
        case "collapse-all":
          this.collapseAll();
          break;
      }
      this.hideContextMenu();
    },
    async 'locateInLibrary'(_0x2334fe) {
      try {
        const var134 = await Zotero.Items.getAsync(_0x2334fe);
        if (!var134) {
          showToast("找不到该文献条目", "error");
          return;
        }
        await Zotero.ZoteroIF.showItemInCollection(var134);
        showToast('已在文库中定位', "success");
      } catch (_0x16b4cb) {
        Zotero.debug("AI 解读 - 定位错误: " + _0x16b4cb.message);
        showToast("定位失败: " + _0x16b4cb.message, "error");
      }
    },
    async 'openPdf'(_0x5b8708) {
      try {
        const var135 = await Zotero.Items.getAsync(_0x5b8708);
        if (!var135) {
          showToast('找不到\x20PDF\x20附件', "error");
          return;
        }
        const var136 = Zotero.getActiveZoteroPane();
        var136 && (await var136.viewAttachment(_0x5b8708), showToast('已打开\x20PDF', "success"));
      } catch (_0x1dd9d0) {
        showToast("打开 PDF 失败: " + _0x1dd9d0.message, "error");
      }
    },
    async 'openNote'(_0x553a19) {
      try {
        const var137 = await Zotero.Items.getAsync(_0x553a19);
        if (!var137) {
          showToast("找不到笔记", "error");
          return;
        }
        await Zotero.ZoteroIF.showItemInCollection(var137);
        Zotero.ZoteroIF.togglePaneDisplay('zotero-item', "show");
        showToast('已定位解读笔记', 'success');
      } catch (_0x4ee2d8) {
        showToast("打开笔记失败: " + _0x4ee2d8.message, 'error');
      }
    },
    async 'locateAIReadingNotes'(_0x6c2994) {
      const var138 = await Zotero.Items.getAsync(_0x6c2994);
      if (!var138) {
        showToast("找不到该文献条目", "error");
        return;
      }
      Zotero.ZoteroIF.gptReaderSidePane_ChatMode_locateAIReadingNotes(var138);
    },
    async 'addItems'(_0x344845) {
      let var139 = 0x0,
        var140 = 0x0,
        var141 = 0x0,
        var142 = 0x0;
      for (const var143 of _0x344845) {
        if (var143.isNote() || var143.isAttachment()) continue;
        const var144 = var143.getField("title") || "未知标题";
        if (Zotero.ZoteroIF.findNoteItem_basedOnTag(var143, Zotero.ZoteroIF._aiReadingNoteTag)) {
          var142++;
          Zotero.debug("AI 解读 - \"" + var144 + "\" 已有解读笔记，跳过");
          continue;
        }
        const var145 = var143.getAttachments();
        let var146 = null;
        if (var145 && var145.length > 0x0) for (const var147 of var145) {
          const var148 = await Zotero.Items.getAsync(var147);
          if (var148 && var148.isAttachment() && var148.attachmentContentType === 'application/pdf') {
            var146 = var147;
            break;
          }
        }
        if (!var146) {
          var141++;
          Zotero.debug("AI 解读 - \"" + var144 + "\" 没有找到 PDF 附件");
          continue;
        }
        const var149 = new Task(var143.id, var144, var146);
        this.addTask(var149) ? var139++ : var140++;
      }
      let var150 = '';
      if (var139 > 0x0) var150 += "已添加 " + var139 + " 篇文献";
      if (var140 > 0x0) var150 += '' + (var150 ? '，' : '') + var140 + " 篇已在队列中";
      if (var142 > 0x0) var150 += '' + (var150 ? '，' : '') + var142 + '\x20篇已有解读笔记';
      if (var141 > 0x0) var150 += '' + (var150 ? '，' : '') + var141 + " 篇无 PDF 附件";
      if (var139 > 0x0) showToast(var150 || "操作完成", "success");else var150 ? showToast(var150, "warning") : showToast("未找到可解读的文献（需要有 PDF 附件的常规条目）", 'warning');
      if (var150) window._msg = var150;
      return {
        'addedCount': var139,
        'skippedCount': var140,
        'alreadyInterpretedCount': var142,
        'noPdfCount': var141
      };
    },
    async 'addFromSelection'() {
      try {
        const var151 = Zotero.getActiveZoteroPane();
        if (!var151) {
          showToast("无法获取 Zotero 主面板", "error");
          return;
        }
        const var152 = var151.getSelectedItems();
        if (!var152 || var152.length === 0x0) {
          showToast('请先在\x20Zotero\x20中选择文献', "warning");
          return;
        }
        await this.addItems(var152);
      } catch (_0x5717b0) {
        Zotero.debug("AI 解读 - 添加选中文献错误: " + _0x5717b0.message);
        showToast("添加失败: " + _0x5717b0.message, "error");
      }
    }
  },
  STATS_CATEGORIES = [{
    'key': 'journalArticle',
    'name': "期刊文献",
    'icon': '📄'
  }, {
    'key': "conferencePaper",
    'name': "会议文献",
    'icon': '🎤'
  }, {
    'key': "thesis",
    'name': "学位论文",
    'icon': '🎓'
  }, {
    'key': "patent",
    'name': '专利',
    'icon': '💡'
  }, {
    'key': 'book',
    'name': '图书',
    'icon': '📚'
  }];
async function runLibraryStats() {
  const var153 = $("#stats-overlay"),
    var154 = $("#stats-loading"),
    var155 = $('#stats-content');
  var153.classList.add('visible');
  var154.classList.remove("hidden");
  var155.classList.remove("visible");
  const var156 = Date.now();
  try {
    const var157 = Zotero.Libraries.userLibraryID,
      var158 = Zotero.ZoteroIF._aiReadingNoteTag,
      var159 = new Zotero.Search();
    var159.libraryID = var157;
    var159.addCondition('tag', 'is', var158);
    const var160 = await var159.search(),
      var161 = new Set();
    if (var160.length > 0x0) {
      const var162 = Zotero.Items.get(var160);
      for (const var163 of var162) {
        var163 && var163.isNote() && var163.parentItemID && var161.add(var163.parentItemID);
      }
    }
    const var164 = new Zotero.Search();
    var164.libraryID = var157;
    var164.addCondition("itemType", "isNot", "note");
    var164.addCondition("itemType", "isNot", "attachment");
    const var165 = await var164.search(),
      var166 = new Set(STATS_CATEGORIES.map(_0x270032 => _0x270032.key)),
      var167 = {};
    for (const var168 of STATS_CATEGORIES) {
      var167[var168.key] = {
        'total': 0x0,
        'interpreted': 0x0,
        'uninterpretedIds': [],
        'interpretedIds': []
      };
    }
    var167.other = {
      'total': 0x0,
      'interpreted': 0x0,
      'uninterpretedIds': [],
      'interpretedIds': []
    };
    let var169 = 0x0,
      var170 = 0x0;
    const var171 = Zotero.Items.get(var165);
    for (const var172 of var171) {
      if (!var172) continue;
      try {
        if (var172.isAnnotation && var172.isAnnotation()) continue;
      } catch (_0x3c9048) {}
      const var173 = var172.itemType,
        var174 = var161.has(var172.id),
        var175 = var166.has(var173) ? var173 : "other";
      var167[var175].total++;
      var174 ? (var167[var175].interpreted++, var167[var175].interpretedIds.push(var172.id)) : var167[var175].uninterpretedIds.push(var172.id);
      var169++;
      if (var174) var170++;
    }
    const var176 = ((Date.now() - var156) / 0x3e8).toFixed(0x1);
    window._statsData = var167;
    renderLibraryStats(var167, var169, var170, var165.length, var176);
  } catch (_0x37bf47) {
    Zotero.debug('Library\x20stats\x20error:\x20' + _0x37bf47.message);
    safeSetInnerHTML(var155, "<div style=\"display:block;color:var(--danger);text-align:center;padding:20px;\">统计失败：" + escapeHtml(_0x37bf47.message) + "</div>");
    var155.classList.add('visible');
  } finally {
    var154.classList.add("hidden");
  }
}
function renderLibraryStats(param1, param2, param3, param4, param5) {
  const var177 = $("#stats-content"),
    var178 = param2 > 0x0 ? (param3 / param2 * 0x64).toFixed(0x1) : "0.0";
  let var179 = '';
  var179 += "\n        <div class=\"stats-summary\">\n            <div class=\"stats-summary-number\">\n                " + param3 + "\n                <span class=\"stats-total-dim\">/ " + param2 + "</span>\n            </div>\n            <div class=\"stats-summary-label\">已解读文献 / 文献总数（" + var178 + "%）</div>\n            <div class=\"stats-summary-bar\">\n                <div class=\"stats-summary-bar-fill\" data-target=\"" + var178 + '\x22></div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20';
  var179 += '<div\x20class=\x22stats-table\x22>';
  const var180 = [...STATS_CATEGORIES, {
    'key': "other",
    'name': "其他类型",
    'icon': '📎'
  }];
  for (const var181 of var180) {
    const var182 = param1[var181.key];
    if (!var182 || var182.total === 0x0) continue;
    const var183 = (var182.interpreted / var182.total * 0x64).toFixed(0x1),
      var184 = var182.total - var182.interpreted;
    var179 += "\n            <div class=\"stats-row\">\n                <div class=\"stats-row-icon stats-row-icon-clickable\"\n                     data-cat-key=\"" + var181.key + "\"\n                     data-tip=\"点击：选中 " + var184 + " 篇未解读 &#10;Shift+点击：选中 " + var182.interpreted + '\x20篇已解读\x22>' + var181.icon + "</div>\n                <div class=\"stats-row-info\">\n                    <div class=\"stats-row-top\">\n                        <span class=\"stats-row-name\">" + var181.name + "</span>\n                        <span class=\"stats-row-numbers\">" + var182.interpreted + '\x20已解读\x20·\x20' + var184 + '\x20未解读</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22stats-row-bar\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22stats-row-bar-fill\x22\x20data-target=\x22' + var183 + "\"></div>\n                    </div>\n                </div>\n                <span class=\"stats-row-pct\">" + var183 + '%</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
  }
  var179 += '</div>';
  var179 += "<div class=\"stats-footer-info\">共扫描 " + param4 + " 个条目，耗时 " + param5 + "s ·  点击左侧图标可选中未解读文献</div>";
  safeSetInnerHTML(var177, var179);
  var177.classList.add('visible');
  requestAnimationFrame(() => {
    var177.querySelectorAll('[data-target]').forEach(_0x534c17 => {
      _0x534c17.style.width = '0%';
      requestAnimationFrame(() => {
        _0x534c17.style.width = _0x534c17.getAttribute("data-target") + '%';
      });
    });
  });
}
function updateFooterUI() {
  const {
    serviceName: _0x55a976,
    model: _0x59c993
  } = getServiceNameAndModel();
  $("#footer-service").textContent = _0x55a976;
  $('#footer-model').textContent = _0x59c993;
  $("#footer-concurrency").textContent = "并发：" + (Zotero.Prefs.get("zoteroif.concurrency4BatchAIInterpret") || '4');
}
function initEventListeners() {
  document.addEventListener("dialogaccept", _0x5344ab => {
    _0x5344ab.preventDefault();
  });
  document.addEventListener("dialogcancel", _0x5f421e => {
    !shouldAllowClose() && _0x5f421e.preventDefault();
  });
  $("#btn-add-selected").addEventListener("click", () => {
    TaskManager.addFromSelection();
  });
  $("#btn-abort-all").addEventListener('click', () => {
    TaskManager.tasks.some(_0x45eeca => _0x45eeca.status === STATUS.RUNNING || _0x45eeca.status === STATUS.QUEUED) ? (TaskManager.abortAll(), showToast("已终止所有任务", 'warning')) : showToast("没有正在进行的任务", "info");
  });
  $("#btn-clear-done").addEventListener("click", () => {
    TaskManager.clearDone();
  });
  $("#btn-settings").addEventListener("click", () => Zotero.ZoteroIF.openDialogByType("batchAIInterpretSettings"));
  $$(".filter-btn").forEach(_0x594655 => {
    _0x594655.addEventListener("click", () => {
      $$(".filter-btn").forEach(_0x2b0369 => _0x2b0369.classList.remove("active"));
      _0x594655.classList.add("active");
      TaskManager.currentFilter = _0x594655.getAttribute("data-filter");
      TaskManager.applyFilter();
    });
  });
  $("#btn-library-stats").addEventListener("click", () => {
    runLibraryStats();
  });
  $("#btn-stats-close").addEventListener("click", () => {
    $("#stats-overlay").classList.remove('visible');
  });
  $("#stats-overlay").addEventListener("click", _0x40a94a => {
    _0x40a94a.target === _0x40a94a.currentTarget && $('#stats-overlay').classList.remove("visible");
  });
  $('#stats-content').addEventListener('click', async _0x22a30b => {
    const var185 = _0x22a30b.target.closest('.stats-row-icon-clickable');
    if (!var185) return;
    const var186 = var185.getAttribute("data-cat-key");
    if (!var186 || !window._statsData || !window._statsData[var186]) return;
    const var187 = _0x22a30b.shiftKey,
      var188 = var187 ? window._statsData[var186].interpretedIds : window._statsData[var186].uninterpretedIds,
      var189 = var187 ? "已解读" : "未解读";
    if (!var188 || var188.length === 0x0) {
      showToast(var187 ? '该分类下暂无已解读文献' : "该分类下所有文献均已解读 🎉", var187 ? "info" : "success");
      return;
    }
    try {
      const var190 = Zotero.getActiveZoteroPane();
      if (!var190) {
        showToast("无法获取 Zotero 主面板", "error");
        return;
      }
      typeof var190.selectItems === "function" ? await var190.selectItems(var188) : await var190.selectItem(var188[0x0]);
      try {
        const var191 = var190.document?.["defaultView"] || Zotero.getMainWindow();
        if (var191) var191.focus();
      } catch (_0x4c93c1) {}
      const var192 = [...STATS_CATEGORIES, {
        'key': "other",
        'name': "其他类型"
      }].find(_0x484b71 => _0x484b71.key === var186)?.["name"] || var186;
      showToast("已在文库中选中 " + var188.length + '\x20篇' + var189 + '的「' + var192 + '」', "success");
    } catch (_0x3ae6ce) {
      Zotero.debug("Stats locate error: " + _0x3ae6ce.message);
      showToast("选中文献失败: " + _0x3ae6ce.message, "error");
    }
  });
  $$("#context-menu .ctx-item").forEach(_0x10ab58 => {
    _0x10ab58.addEventListener("click", () => {
      const var193 = _0x10ab58.getAttribute("data-action");
      TaskManager.handleContextAction(var193);
    });
  });
  document.addEventListener("mousedown", _0x1cd025 => {
    if (_0x1cd025.button !== 0x0) return;
    if (Date.now() - (TaskManager._contextMenuOpenTime || 0x0) < 0x12c) return;
    !_0x1cd025.target.closest("#context-menu") && TaskManager.hideContextMenu();
  });
  document.addEventListener("contextmenu", _0x455b25 => {
    !_0x455b25.target.closest('#context-menu') && !_0x455b25.target.closest(".task-card") && TaskManager.hideContextMenu();
  });
  $('#task-list').addEventListener('click', _0x250060 => {
    if (_0x250060.shiftKey) {
      if (_0x250060.target.closest('.task-actions')) return;
      if (_0x250060.target.closest('.task-expand-toggle')) return;
      const var194 = _0x250060.target.closest('.task-card');
      if (!var194) return;
      const var195 = TaskManager.tasks.find(_0x5de487 => _0x5de487.id === var194.id);
      if (!var195) return;
      if (!var195.itemId) return;
      TaskManager.locateAIReadingNotes(var195.itemId);
      return;
    }
    const var196 = _0x250060.target.closest(".task-expand-toggle");
    if (var196) {
      _0x250060.stopPropagation();
      const var197 = var196.closest(".task-card");
      if (!var197) return;
      const var198 = TaskManager.tasks.find(_0x53f1ff => _0x53f1ff.id === var197.id);
      if (!var198) return;
      var198.expanded = !var198.expanded;
      var197.classList.toggle("expanded", var198.expanded);
      var198.expanded && TaskManager.refreshPreviewContent(var198, var197);
      return;
    }
    const var199 = _0x250060.target.closest(".act-btn");
    if (!var199) return;
    _0x250060.stopPropagation();
    const var200 = var199.getAttribute("data-id"),
      var201 = TaskManager.tasks.find(_0xb77b32 => _0xb77b32.id === var200);
    if (!var201) return;
    if (var199.classList.contains('act-abort')) TaskManager.abortTask(var200);else {
      if (var199.classList.contains("act-locate")) TaskManager.locateInLibrary(var201.itemId);else {
        if (var199.classList.contains("act-note")) {
          if (var201.noteId) TaskManager.openNote(var201.noteId);else showToast("尚无解读笔记", 'warning');
        } else var199.classList.contains("act-retry") && TaskManager.retryTask(var200);
      }
    }
  });
  $('#task-list').addEventListener("dblclick", _0xc90b0a => {
    if (_0xc90b0a.target.closest(".task-actions")) return;
    if (_0xc90b0a.target.closest('.task-expand-toggle')) return;
    const var202 = _0xc90b0a.target.closest(".task-card");
    if (!var202) return;
    const var203 = TaskManager.tasks.find(_0x327f49 => _0x327f49.id === var202.id);
    if (!var203) return;
    var203.expanded = !var203.expanded;
    var202.classList.toggle("expanded", var203.expanded);
    var203.expanded && TaskManager.refreshPreviewContent(var203, var202);
  });
  setInterval(() => {
    for (const var204 of TaskManager.tasks) {
      var204.status === STATUS.RUNNING && TaskManager.updateTaskUIPartial(var204);
    }
  }, 0x7d0);
}
function $(param6) {
  return document.querySelector(param6);
}
function $$(param7) {
  return document.querySelectorAll(param7);
}
function showToast(param8, _0x452192 = "info", _0x479654 = 0xbb8) {
  const var205 = $('#toast-container'),
    var206 = document.createElement("div");
  var206.className = "toast toast-" + _0x452192;
  var206.textContent = param8;
  var205.appendChild(var206);
  setTimeout(() => {
    var206.remove();
  }, _0x479654);
}
function escapeHtml(param9) {
  const var207 = document.createElement("div");
  return var207.textContent = param9, var207.innerHTML;
}
function generateId() {
  return 't_' + Date.now().toString(0x24) + Math.random().toString(0x24).slice(0x2, 0x7);
}
function safeSetInnerHTML(param10, param11) {
  const var208 = new DOMParser(),
    var209 = var208.parseFromString("<html xmlns=\"http://www.w3.org/1999/xhtml\"><body>" + param11 + "</body></html>", "application/xhtml+xml");
  while (param10.firstChild) {
    param10.removeChild(param10.firstChild);
  }
  const var210 = var209.documentElement.querySelector("body") || var209.documentElement;
  for (const var211 of [...var210.childNodes]) {
    param10.appendChild(document.importNode(var211, true));
  }
}
function getServiceNameAndModel() {
  const var212 = Zotero.Prefs.get("zoteroif.service4BatchAIInterpret") || "GPT 自定 ①",
    var213 = Zotero.Prefs.get("zoteroif.model4BatchAIInterpret") || "gemini-2.5-pro",
    var214 = Zotero.ZoteroIF.gptServiceList()[var212].custom_model_enable && Zotero.ZoteroIF.gptServiceList()[var212].custom_model != '' ? Zotero.ZoteroIF.gptServiceList()[var212].custom_model : var213;
  return {
    'serviceName': var212,
    'model': var214
  };
}
function shouldAllowClose() {
  const var215 = TaskManager.tasks.some(_0x4704fe => _0x4704fe.status === STATUS.RUNNING || _0x4704fe.status === STATUS.QUEUED),
    var216 = TaskManager.tasks.length > 0x0;
  if (!var216) return true;
  let var217;
  if (var215) {
    const var218 = TaskManager.tasks.filter(_0x467b26 => _0x467b26.status === STATUS.RUNNING).length,
      var219 = TaskManager.tasks.filter(_0x34f200 => _0x34f200.status === STATUS.QUEUED).length;
    var217 = '当前仍有\x20' + var218 + " 个任务正在解读、" + var219 + '\x20个任务排队中。\x0a' + "关闭窗口后所有任务都将丢失且无法恢复。\n\n确定要关闭吗？";
  } else var217 = '任务列表中还有\x20' + TaskManager.tasks.length + " 条记录。\n" + "关闭窗口后将全部清除。\n\n确定要关闭吗？";
  const var220 = Services.prompt.confirm(window, '确认关闭', var217);
  return var220 && var215 && TaskManager.abortAll(), var220;
}
window.BatchAIInterpreter = {
  async 'addItems'(_0x577ad7) {
    window._msg = '';
    if (!_0x577ad7 || _0x577ad7.length === 0x0) return;
    const var221 = [];
    for (const var222 of _0x577ad7) {
      try {
        const var223 = typeof var222 === "number" ? await Zotero.Items.getAsync(var222) : var222;
        if (var223) var221.push(var223);
      } catch (_0x230b84) {
        Zotero.debug("BatchAIInterpreter.addItems error: " + _0x230b84.message);
      }
    }
    await TaskManager.addItems(var221);
  },
  'getStatus'() {
    return {
      'total': TaskManager.tasks.length,
      'queued': TaskManager.tasks.filter(_0x123b5a => _0x123b5a.status === STATUS.QUEUED).length,
      'running': TaskManager.tasks.filter(_0x44b59e => _0x44b59e.status === STATUS.RUNNING).length,
      'completed': TaskManager.tasks.filter(_0x98f900 => _0x98f900.status === STATUS.COMPLETED).length,
      'error': TaskManager.tasks.filter(_0x1943e1 => _0x1943e1.status === STATUS.ERROR).length,
      'aborted': TaskManager.tasks.filter(_0x311dc8 => _0x311dc8.status === STATUS.ABORTED).length
    };
  }
};