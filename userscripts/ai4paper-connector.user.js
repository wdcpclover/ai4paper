// ==UserScript==
// @name         AI4Paper Connector
// @description  AI4Paper 浏览器联动脚本，支持 DeepSeek / 豆包 / ChatGPT / Claude / 通义 / Kimi 等
// @namespace    https://ai4paper.pro
// @version      1.0.1
// @author       AI4Paper
// @homepageURL  https://ai4paper.pro
// @supportURL   https://github.com/wdcpclover/ai4paper/issues
// @updateURL    https://raw.githubusercontent.com/wdcpclover/ai4paper/main/userscripts/ai4paper-connector.user.js
// @downloadURL  https://raw.githubusercontent.com/wdcpclover/ai4paper/main/userscripts/ai4paper-connector.user.js
// @match        https://chat.deepseek.com/*
// @match        https://www.doubao.com/chat/*
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @match        https://kimi.moonshot.cn/*
// @match        https://yuanbao.tencent.com/chat/*
// @match        https://qianwen.aliyun.com/*
// @match        https://chat.qwenlm.ai/*
// @match        https://gemini.google.com/*
// @match        https://www.perplexity.ai/*
// @match        https://grok.com/*
// @include      /.+deepseek.+/
// @include      /.+doubao.+/
// @include      /.+claude.+/
// @include      /.+kimi.+/
// @include      /.+qwen.+/
// @connect      http://127.0.0.1:23119
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(async function () {
    'use strict';

    // ─── 平台识别 ──────────────────────────────────────────────────
    const host = location.host;
    let AI = "Unknown";
    if (host === 'chat.deepseek.com') AI = "DeepSeek";
    else if (host === 'www.doubao.com') AI = "Doubao";
    else if (host === 'chatgpt.com') AI = "ChatGPT";
    else if (host.includes('claude')) AI = "Claude";
    else if (host === 'kimi.moonshot.cn' || host === 'www.kimi.com') AI = "Kimi";
    else if (host === 'yuanbao.tencent.com') AI = "Yuanbao";
    else if (host.includes('qwen') || host === 'qianwen.aliyun.com') AI = "Qwen";
    else if (host === 'gemini.google.com') AI = "Gemini";
    else if (host === 'www.perplexity.ai') AI = "Perplexity";
    else if (host.includes('grok')) AI = "Grok";

    const AI4P_ENDPOINT = "http://127.0.0.1:23119/ai4paper";
    let isRunning = true;
    let lastTaskId = null;

    // ─── 流式响应拦截 ─────────────────────────────────────────────
    // 每个平台定义: { regex, extract(text, allText) → string }
    const PATCHES = [
        {
            AI: "DeepSeek",
            regex: /completion$/,
            text: "", allText: "",
            extract(chunk, all) {
                let resp = "", think = "";
                for (let line of all.split("\n")) {
                    if (!line.startsWith("data: {")) continue;
                    let data; try { data = JSON.parse(line.slice(6)) } catch { continue }
                    if (data.choices) {
                        const delta = data.choices[0]?.delta;
                        if (delta?.type === "thinking") think += delta.content || "";
                        else if (delta?.type === "text") resp += delta.content || "";
                    } else {
                        if (Array.isArray(data.v) && data.v[0]?.type) {
                            this._type = data.v[0].type;
                            data.v = data.v[0].content;
                        }
                        if (typeof data.v === "string") {
                            if (this._type === "THINK") think += data.v;
                            else if (this._type === "RESPONSE") resp += data.v;
                        }
                    }
                }
                this.text = resp || think;
            },
            _type: ""
        },
        {
            AI: "Doubao",
            regex: /samantha\/chat\/completion/,
            text: "", allText: "",
            extract(chunk, all) {
                let resp = "", think = "";
                for (let line of all.split("\n")) {
                    if (!line.startsWith("data:")) continue;
                    try {
                        const data = JSON.parse(JSON.parse(line.slice(5)).event_data);
                        const d = JSON.parse(data.message.content);
                        if (![1, 5, 6].includes(d.type)) {
                            if (d.text) resp += d.text;
                            else if (d.think) think += d.think;
                        }
                    } catch {}
                }
                this.text = resp || think;
            }
        },
        {
            AI: "ChatGPT",
            regex: /conversation$/,
            text: "", allText: "", _p: "",
            extract(chunk, all) {
                for (let line of chunk.split("\n")) {
                    if (line.startsWith('data: {"message')) {
                        let data; try { data = JSON.parse(line.slice(6)) } catch { continue }
                        if (data.message?.content?.content_type === "text") {
                            this.text = data.message.content.parts[0];
                        }
                    } else if (line.startsWith("data: {")) {
                        let data; try { data = JSON.parse(line.slice(6)) } catch { continue }
                        const streamPath = "/message/content/parts/0";
                        if (Object.keys(data).length === 1 && typeof data.v === "string" && this._p === streamPath) {
                            this.text += data.v;
                        } else if (this._p === streamPath || data.p === streamPath) {
                            this._p = streamPath;
                            if (data.o === "add") this.text = "";
                            if (typeof data.v === "string") this.text += data.v;
                        } else {
                            this._p = "";
                        }
                    }
                }
            }
        },
        {
            AI: "Claude",
            regex: /chat_conversations\/.+\/completion/,
            text: "", allText: "",
            extract(chunk, all) {
                for (let line of chunk.split("\n")) {
                    if (!line.startsWith("data: {")) continue;
                    let data; try { data = JSON.parse(line.slice(6)) } catch { continue }
                    if (data.type === "completion") this.text += data.completion || "";
                    else if (data.type === "content_block_delta") this.text += data.delta?.text || "";
                }
            }
        },
        {
            AI: "Kimi",
            regex: /ChatService\/Chat/,
            text: "", allText: "",
            extract(chunk, all) {
                let think = "", resp = "";
                for (let item of all.split(/\x00\x00\x00\x00[^\{]+/).filter(Boolean)) {
                    let data; try { data = JSON.parse(item) } catch { continue }
                    if (data.op !== "append") continue;
                    if (data.mask === "block.think.content") think += data.block?.think?.content || "";
                    else if (data.mask === "block.text.content") resp += data.block?.text?.content || "";
                }
                this.text = resp || think;
            }
        },
        {
            AI: "Yuanbao",
            regex: /api\/chat\/.+/,
            text: "", allText: "",
            extract(chunk, all) {
                let think = "", resp = "";
                for (let line of all.split("\n")) {
                    if (!line.startsWith("data: {")) continue;
                    let data; try { data = JSON.parse(line.slice(6)) } catch { continue }
                    if (data.type === "text") resp += data.msg || "";
                    else if (data.type === "think") think += data.content || "";
                }
                this.text = resp || think;
            }
        },
        {
            AI: "Qwen",
            regex: /chat\/completions/,
            text: "", allText: "",
            extract(chunk, all) {
                let think = "", resp = "";
                for (let line of all.split("\n")) {
                    if (!line.startsWith("data: {")) continue;
                    let data; try { data = JSON.parse(line.slice(6)) } catch { continue }
                    const delta = data.choices?.[0]?.delta;
                    if (!delta) continue;
                    if (delta.phase === "think") think += delta.content || "";
                    else if (delta.phase === "answer") resp += delta.content || "";
                }
                this.text = resp || think;
            }
        },
        {
            AI: "Grok",
            regex: /(conversations\/new|responses)$/,
            text: "", allText: "",
            extract(chunk, all) {
                let resp = "", think = "";
                for (let line of all.split("\n")) {
                    let data; try { data = JSON.parse(line).result } catch { continue }
                    if (!data) continue;
                    if (data.response) data = data.response;
                    if (data.isThinking) think += data.token || "";
                    else resp += data.token || "";
                }
                this.text = resp || think;
            }
        },
    ];

    // ─── fetch 拦截 ───────────────────────────────────────────────
    const originalFetch = window.fetch;
    unsafeWindow.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        const url = response.url;
        const patch = PATCHES.find(p => p.AI === AI && p.regex.test(url));
        if (!patch) return response;

        const clone = response.clone();
        window.setTimeout(async () => {
            patch.text = "";
            patch.allText = "";
            const reader = clone.body.getReader();
            const decoder = new TextDecoder();
            const read = () => reader.read().then(({ done, value }) => {
                if (done) {
                    _sendRespond(patch.text, true);
                    patch.text = "";
                    return;
                }
                const chunk = decoder.decode(value, { stream: true });
                patch.allText += chunk;
                try { patch.extract(chunk, patch.allText); } catch (e) { console.log("[AI4P] extract error", e); }
                _sendRespond(patch.text, false);
                read();
            }).catch(() => {
                _sendRespond(patch.text, true);
                patch.text = "";
            });
            read();
        });
        return response;
    };

    // ─── XHR 拦截（补充少数平台）─────────────────────────────────
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        const patch = PATCHES.find(p => p.AI === AI && p.regex.test(url));
        if (patch) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 3 || this.readyState === 4) {
                    try { patch.extract(this.responseText || "", this.responseText || ""); } catch {}
                    _sendRespond(patch.text, this.readyState === 4);
                    if (this.readyState === 4) patch.text = "";
                }
            });
        }
        originalXhrOpen.apply(this, arguments);
    };

    // ─── 向插件发送回复 ───────────────────────────────────────────
    function _sendRespond(text, done) {
        if (!lastTaskId) return;
        _post({ action: "respond", id: lastTaskId, text, done });
    }

    // ─── 向 AI 输入框填文字并发送 ─────────────────────────────────
    async function sendToAI(prompt) {
        await _sleep(500);
        const setters = {
            DeepSeek: async () => {
                const ta = document.querySelector("textarea");
                if (!ta) return false;
                _reactSet(ta, prompt);
                await _sleep(200);
                document.querySelector("button[type=submit], ._7436101")?.click();
                return true;
            },
            Doubao: async () => {
                const ta = document.querySelector('[data-testid="chat_input_input"]');
                if (!ta) return false;
                _reactSet(ta, prompt);
                await _sleep(200);
                document.querySelector("button#flow-end-msg-send")?.click();
                return true;
            },
            ChatGPT: async () => {
                _dispatchInput('#prompt-textarea', prompt);
                await _sleep(200);
                document.querySelector('[data-testid="send-button"]')?.click();
                return true;
            },
            Claude: async () => {
                _dispatchInput('[contenteditable="true"]', prompt);
                await _sleep(200);
                document.querySelector("button[aria-label='Send message']")?.click();
                return true;
            },
            Kimi: async () => {
                await _setLexical(prompt);
                await _sleep(200);
                document.querySelector('.send-button')?.click();
                return true;
            },
            Yuanbao: async () => {
                _dispatchInput('.chat-input-editor .ql-editor', prompt);
                await _sleep(200);
                document.querySelector('.icon-send')?.click();
                return true;
            },
            Qwen: async () => {
                _dispatchInput("#chat-input", prompt);
                await _sleep(200);
                document.querySelector('#send-message-button')?.click();
                return true;
            },
            Grok: async () => {
                const ta = document.querySelector('textarea');
                const div = document.querySelector("form [contenteditable]");
                if (div) div.innerHTML = `<p>${prompt}</p>`;
                else if (ta) _reactSet(ta, prompt);
                await _sleep(200);
                document.querySelector("button[type=submit]")?.click();
                return true;
            },
        };
        const fn = setters[AI];
        if (!fn) return false;
        return fn().catch(() => false);
    }

    // ─── DOM 辅助 ─────────────────────────────────────────────────
    function _dispatchInput(selector, text) {
        const el = document.querySelector(selector);
        if (!el) return;
        el.value = text;
        try { el.innerHTML = text.split("\n").map(l => `<p>${l}</p>`).join(""); } catch {}
        el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
    }

    function _reactSet(el, text) {
        const props = Object.values(el)[1];
        el.value = text;
        props?.onChange?.({ target: el, currentTarget: el, type: 'change' });
    }

    async function _setLexical(text) {
        try {
            const editor = document.querySelector('[data-lexical-editor][role=textbox]').__lexicalEditor;
            await editor.setEditorState(editor.parseEditorState({
                root: { children: [{ children: [{ detail: 0, format: 0, mode: "normal", style: "", text, type: "text", version: 1 }], direction: null, format: "", indent: 0, type: "paragraph", version: 1, textFormat: 0 }], direction: null, format: "", indent: 0, type: "root", version: 1 }
            }));
        } catch {}
    }

    function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ─── HTTP 通信 ────────────────────────────────────────────────
    function _post(data) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: AI4P_ENDPOINT,
                headers: { "Content-Type": "application/json" },
                responseType: "json",
                data: JSON.stringify(data),
                onload: r => resolve(r.response),
                onerror: () => resolve(null),
            });
        });
    }

    // ─── 主循环 ──────────────────────────────────────────────────
    GM_registerMenuCommand('🔗 AI4Paper 运行中', () => window.alert("AI4Paper Connector 已连接\n平台: " + AI));
    GM_registerMenuCommand('⏹ 断开', () => { isRunning = false; window.alert("已断开"); });

    while (true) {
        await _sleep(500);
        if (!isRunning) continue;

        try {
            const res = await _post({ action: "poll" });
            if (!res?.task) continue;
            const task = res.task;
            if (task.id === lastTaskId) continue; // 已处理过

            lastTaskId = task.id;
            console.log("[AI4Paper] 收到任务:", task.id, "prompt长度:", task.prompt?.length);

            const ok = await sendToAI(task.prompt);
            if (!ok) {
                console.warn("[AI4Paper] 发送失败，平台:", AI);
                await _post({ action: "respond", id: task.id, text: "[发送失败，请检查页面状态]", done: true });
                lastTaskId = null;
            }
        } catch (e) {
            if (!String(e).includes("Network")) console.log("[AI4Paper] 轮询错误:", e);
        }
    }
})();
