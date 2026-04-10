// ==UserScript==
// @name         AI4Paper Connector
// @description  AI4Paper 浏览器联动脚本，支持 DeepSeek / 豆包 / ChatGPT / Claude / 通义 / Kimi 等
// @namespace    https://ai4paper.pro
// @version      1.1.5
// @author       AI4Paper
// @license      MIT
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
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(async function () {
    'use strict';

    const SCRIPT_VERSION = "1.1.5";
    const SERVER_BASE = "https://ai4paper.pro/api/browser-task";
    const LICENSE_KEY_STORE = "ai4paper.licenseKey";
    const RUNNING_KEY = "ai4paper.connector.running";
    const POLL_INTERVAL = 1200;
    const DEBUG = true;

    const AI = detectPlatform();
    let isRunning = GM_getValue(RUNNING_KEY, true) !== false;
    let licenseKey = GM_getValue(LICENSE_KEY_STORE, "");
    let activeTask = null;

    // ── 后台保活：最小化 / 隐藏标签页时保持正常运行 ──────────────────────
    function initBackgroundKeepAlive() {
        // 1. Web Worker 心跳：Worker 不受定时器节流限制，可维持主线程活跃
        try {
            const blob = new Blob(
                [`setInterval(()=>postMessage(1),400);`],
                { type: "text/javascript" }
            );
            const w = new Worker(URL.createObjectURL(blob));
            w.onmessage = () => {}; // 消费消息，防止队列积压
        } catch (_e) { /**/ }

        // 2. 让站点认为页面始终可见，防止其暂停流式输出
        try {
            Object.defineProperty(document, "hidden",
                { get: () => false, configurable: true });
            Object.defineProperty(document, "visibilityState",
                { get: () => "visible", configurable: true });
            // 拦截站点自己的 visibilitychange 监听
            document.addEventListener("visibilitychange",
                e => e.stopImmediatePropagation(), true);
        } catch (_e) { /**/ }

        dbg("background keep-alive initialized");
    }
    initBackgroundKeepAlive();
    // ─────────────────────────────────────────────────────────────────────

    function dbg() {
        if (!DEBUG) return;
        console.log("[AI4Paper]", ...arguments);
    }

    function detectPlatform() {
        const host = location.host;
        if (host === "chat.deepseek.com") return "DeepSeek";
        if (host === "www.doubao.com") return "Doubao";
        if (host === "chatgpt.com") return "ChatGPT";
        if (host.includes("claude")) return "Claude";
        if (host === "kimi.moonshot.cn" || host === "www.kimi.com") return "Kimi";
        if (host === "yuanbao.tencent.com") return "Yuanbao";
        if (host.includes("qwen") || host === "qianwen.aliyun.com") return "Qwen";
        if (host === "gemini.google.com") return "Gemini";
        if (host === "www.perplexity.ai") return "Perplexity";
        if (host.includes("grok")) return "Grok";
        return "Unknown";
    }

    const PATCH_DEFS = [
        {
            AI: "DeepSeek",
            regex: /completion$/,
            extract(chunk, all) {
                let resp = "", think = "";
                for (const line of all.split("\n")) {
                    if (!line.startsWith("data: {")) continue;
                    let data;
                    try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
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
            }
        },
        {
            AI: "Doubao",
            regex: /samantha\/chat\/(v\d+\/)?completion|chat\/completions|\/api\/chat/,
            extract(chunk, all) {
                let resp = "", think = "";
                for (const line of all.split("\n")) {
                    if (!line.startsWith("data:")) continue;
                    const raw = line.slice(5).trim();
                    if (!raw || raw === "[DONE]") continue;
                    let outer;
                    try { outer = JSON.parse(raw); } catch (_e) { continue; }

                    // 豆包嵌套格式: event_data -> message.content (JSON string)
                    if (outer.event_data) {
                        try {
                            const inner = typeof outer.event_data === "string"
                                ? JSON.parse(outer.event_data) : outer.event_data;
                            const msgContent = inner?.message?.content;
                            if (msgContent) {
                                try {
                                    const content = typeof msgContent === "string"
                                        ? JSON.parse(msgContent) : msgContent;
                                    if (![1, 5, 6].includes(content.type)) {
                                        if (content.text) resp += content.text;
                                        if (content.think) think += content.think;
                                    }
                                } catch (_e) {
                                    if (typeof msgContent === "string") resp += msgContent;
                                }
                            }
                        } catch (_e) { /**/ }
                        continue;
                    }

                    // 标准 OpenAI 格式 fallback
                    const delta = outer.choices?.[0]?.delta;
                    if (delta) {
                        resp += delta.content || delta.text || "";
                        continue;
                    }
                    if (outer.text) resp += outer.text;
                    if (outer.content) resp += outer.content;
                }
                this.text = resp || think;
            }
        },
        {
            AI: "ChatGPT",
            regex: /(conversation|backend-api\/conversation|backend-anon\/conversation|backend-api\/responses|backend-anon\/responses)/,
            extract(chunk, all) {
                for (const line of chunk.split("\n")) {
                    if (line.startsWith('data: {"message')) {
                        let data;
                        try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
                        if (data.message?.content?.content_type === "text") {
                            this.text = data.message.content.parts?.[0] || "";
                        }
                        continue;
                    }
                    if (!line.startsWith("data: {")) continue;
                    let data;
                    try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
                    const direct = extractAnyText(data);
                    if (direct) {
                        this.text = mergeText(this.text, direct);
                    }
                    const streamPath = "/message/content/parts/0";
                    if (Object.keys(data).length === 1 && typeof data.v === "string" && this._path === streamPath) {
                        this.text += data.v;
                    } else if (this._path === streamPath || data.p === streamPath) {
                        this._path = streamPath;
                        if (data.o === "add") this.text = "";
                        if (typeof data.v === "string") this.text += data.v;
                    } else {
                        this._path = "";
                    }
                }
                if (!this.text) {
                    const fallback = extractChatGPTFromAll(all);
                    if (fallback) this.text = fallback;
                }
            }
        },
        {
            AI: "Claude",
            regex: /chat_conversations\/.+\/completion/,
            extract(chunk) {
                for (const line of chunk.split("\n")) {
                    if (!line.startsWith("data: {")) continue;
                    let data;
                    try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
                    if (data.type === "completion") this.text += data.completion || "";
                    else if (data.type === "content_block_delta") this.text += data.delta?.text || "";
                }
            }
        },
        {
            AI: "Kimi",
            regex: /ChatService\/Chat/,
            extract(_chunk, all) {
                let think = "", resp = "";
                for (const item of all.split(/\x00\x00\x00\x00[^\{]+/).filter(Boolean)) {
                    let data;
                    try { data = JSON.parse(item); } catch (_e) { continue; }
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
            extract(_chunk, all) {
                let think = "", resp = "";
                for (const line of all.split("\n")) {
                    if (!line.startsWith("data: {")) continue;
                    let data;
                    try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
                    if (data.type === "text") resp += data.msg || "";
                    else if (data.type === "think") think += data.content || "";
                }
                this.text = resp || think;
            }
        },
        {
            AI: "Qwen",
            regex: /chat\/completions/,
            extract(_chunk, all) {
                let think = "", resp = "";
                for (const line of all.split("\n")) {
                    if (!line.startsWith("data: {")) continue;
                    let data;
                    try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
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
            extract(_chunk, all) {
                let think = "", resp = "";
                for (const line of all.split("\n")) {
                    let data;
                    try { data = JSON.parse(line).result; } catch (_e) { continue; }
                    if (!data) continue;
                    if (data.response) data = data.response;
                    if (data.isThinking) think += data.token || "";
                    else resp += data.token || "";
                }
                this.text = resp || think;
            }
        },
    ];

    function createPatchState(def) {
        return {
            AI: def.AI,
            regex: def.regex,
            text: "",
            allText: "",
            _type: "",
            _path: "",
            extract: def.extract,
        };
    }

    function extractAnyText(payload) {
        if (payload == null) return "";
        if (typeof payload === "string" || typeof payload === "number" || typeof payload === "boolean") {
            return String(payload);
        }
        if (Array.isArray(payload)) {
            return payload.map(extractAnyText).filter(Boolean).join("");
        }
        if (typeof payload === "object") {
            const pieces = [];
            const push = (value) => {
                if (value == null || value === payload) return;
                const text = extractAnyText(value);
                if (text) pieces.push(text);
            };
            push(payload.text);
            push(payload.output_text);
            push(payload.content);
            push(payload.parts);
            push(payload.value);
            push(payload.delta);
            push(payload.message);
            push(payload.response);
            if (pieces.length) return pieces.join("");
        }
        return "";
    }

    function mergeText(prev, next) {
        const a = String(prev || "");
        const b = String(next || "");
        if (!a) return b;
        if (!b) return a;
        if (b.startsWith(a)) return b;
        if (a.startsWith(b)) return a;
        if (a.includes(b)) return a;
        return a + b;
    }

    function extractChatGPTFromAll(all) {
        let text = "";
        for (const line of String(all || "").split("\n")) {
            if (!line.startsWith("data:")) continue;
            const raw = line.slice(5).trim();
            if (!raw || raw === "[DONE]") continue;
            let data;
            try { data = JSON.parse(raw); } catch (_e) { continue; }
            const part = extractAnyText(data);
            if (part) text = mergeText(text, part);
        }
        return text;
    }

    function getPatchDef(url) {
        return PATCH_DEFS.find(def => def.AI === AI && def.regex.test(url || ""));
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ── 服务器通信（替代本地 23119 端口）────────────────────────────────────
    function serverRequest(method, path, body) {
        return new Promise(resolve => {
            if (!licenseKey) { resolve(null); return; }
            GM_xmlhttpRequest({
                method,
                url: SERVER_BASE + path,
                headers: {
                    "Content-Type": "application/json",
                    "X-License-Key": licenseKey,
                },
                data: body ? JSON.stringify(body) : undefined,
                onload: (resp) => {
                    try {
                        resolve(typeof resp.response === "object" && resp.response
                            ? resp.response
                            : JSON.parse(resp.responseText || "null"));
                    } catch (_e) { resolve(null); }
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null),
                timeout: 15000,
            });
        });
    }

    async function pullTask() {
        return serverRequest("GET", "/poll?platform=" + encodeURIComponent(AI));
    }

    function clearActiveTask() {
        if (activeTask) {
            if (activeTask.timeout) clearTimeout(activeTask.timeout);
            if (activeTask.reader) {
                try { activeTask.reader.cancel(); } catch (_e) { /**/ }
            }
        }
        activeTask = null;
    }

    async function finishTask(taskId, text, error) {
        if (!taskId) return;
        dbg("finishTask", taskId, "len:", String(text || "").length, error || "");
        await serverRequest("POST", "/push", {
            taskId,
            text: text || "",
            done: true,
            error: error || "",
        });
        clearActiveTask();
    }

    async function pushTaskText(taskId, text, done) {
        if (!activeTask || activeTask.id !== taskId) return;
        const nextText = String(text || "");
        if (!done && nextText === activeTask.lastText) return;
        activeTask.lastText = nextText;
        if (done) {
            await finishTask(taskId, nextText, "");
            return;
        }
        await serverRequest("POST", "/push", {
            taskId,
            text: nextText,
            done: false,
            error: "",
        });
    }

    function monitorFetchResponse(response, taskId) {
        const def = getPatchDef(response.url);
        if (!def || !response.body || !activeTask || activeTask.id !== taskId) return;
        if (AI === "ChatGPT") dbg("fetch matched", response.url, "task:", taskId);
        const state = createPatchState(def);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // 存入 activeTask，供导航时取消
        if (activeTask && activeTask.id === taskId) activeTask.reader = reader;

        const read = () => reader.read().then(async ({ done, value }) => {
            if (!activeTask || activeTask.id !== taskId) {
                reader.cancel().catch(() => {});
                return;
            }
            if (done) {
                await pushTaskText(taskId, state.text, true);
                return;
            }
            const chunk = decoder.decode(value, { stream: true });
            state.allText += chunk;
            try {
                state.extract.call(state, chunk, state.allText);
                if (AI === "ChatGPT") dbg("extract fetch", taskId, "chunk:", chunk.length, "text:", state.text.length);
                await pushTaskText(taskId, state.text, false);
            } catch (error) {
                console.warn("[AI4Paper] extract error", error);
            }
            read();
        }).catch(async (error) => {
            const msg = String(error?.name || error || "");
            // AbortError / cancel 是正常导航中断，不算错误
            if (msg.includes("AbortError") || msg.includes("abort") || msg.includes("cancel")) {
                dbg("stream cancelled (navigation?):", taskId);
                return;
            }
            console.warn("[AI4Paper] stream error", error);
            if (activeTask && activeTask.id === taskId) {
                await finishTask(taskId, state.text, "");
            }
        });

        read();
    }

    const nativeFetch = (unsafeWindow.fetch || window.fetch).bind(unsafeWindow || window);
    unsafeWindow.fetch = async function (...args) {
        const response = await nativeFetch(...args);
        if (!activeTask) return response;
        const clone = response.clone();
        window.setTimeout(() => {
            if (activeTask) monitorFetchResponse(clone, activeTask.id);
        }, 0);
        return response;
    };

    // SPA 导航检测：切换页面时优雅结束当前任务
    function onNavigate() {
        if (!activeTask) return;
        const savedId = activeTask.id;
        const savedText = activeTask.lastText || "";
        dbg("SPA navigation, finishing task:", savedId);
        clearActiveTask();
        finishTask(savedId, savedText, "").catch(() => {});
    }
    try {
        const _pushState = history.pushState.bind(history);
        history.pushState = function (...args) {
            _pushState(...args);
            setTimeout(onNavigate, 50);
        };
        const _replaceState = history.replaceState.bind(history);
        history.replaceState = function (...args) {
            _replaceState(...args);
            // replaceState 一般不换对话，不触发
        };
        window.addEventListener("popstate", () => setTimeout(onNavigate, 50));
    } catch (_e) { /**/ }

    const nativeXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        const def = getPatchDef(url);
        if (def) {
            const taskId = activeTask?.id || null;
            if (AI === "ChatGPT") dbg("xhr matched", method, url, "task:", taskId);
            const state = createPatchState(def);
            this.addEventListener("readystatechange", async function () {
                if (!taskId || !activeTask || activeTask.id !== taskId) return;
                if (this.readyState !== 3 && this.readyState !== 4) return;
                try {
                    state.allText = this.responseText || "";
                    state.extract.call(state, state.allText, state.allText);
                    if (AI === "ChatGPT") dbg("extract xhr", taskId, "readyState:", this.readyState, "text:", state.text.length);
                    await pushTaskText(taskId, state.text, this.readyState === 4);
                } catch (_e) { /**/ }
            });
        }
        return nativeXHROpen.apply(this, arguments);
    };

    function setNativeValue(el, value) {
        const proto = Object.getPrototypeOf(el);
        const desc = Object.getOwnPropertyDescriptor(proto, "value")
            || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement?.prototype || {}, "value")
            || Object.getOwnPropertyDescriptor(window.HTMLInputElement?.prototype || {}, "value");
        if (desc && typeof desc.set === "function") desc.set.call(el, value);
        else el.value = value;
    }

    function dispatchInput(el, text) {
        if (!el) return false;
        if ("value" in el) {
            setNativeValue(el, text);
            el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, data: text }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
        }
        if (el.isContentEditable) {
            el.focus();
            el.textContent = text;
            try {
                el.innerHTML = text.split("\n").map(line => `<p>${line}</p>`).join("");
            } catch (_e) { /**/ }
            el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, data: text }));
            return true;
        }
        return false;
    }

    function reactSet(el, text) {
        if (!el) return false;
        setNativeValue(el, text);
        const keys = Object.keys(el).filter(key => key.startsWith("__reactProps") || key.startsWith("__reactEventHandlers"));
        for (const key of keys) {
            const props = el[key];
            if (props?.onChange) {
                props.onChange({ target: el, currentTarget: el, type: "change" });
                return true;
            }
            if (props?.onInput) {
                props.onInput({ target: el, currentTarget: el, type: "input" });
                return true;
            }
        }
        el.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
    }

    async function setLexical(text) {
        try {
            const editorEl = document.querySelector('[data-lexical-editor][role="textbox"]');
            const editor = editorEl && editorEl.__lexicalEditor;
            if (!editor) return false;
            editor.setEditorState(editor.parseEditorState({
                root: {
                    children: [{
                        children: [{
                            detail: 0,
                            format: 0,
                            mode: "normal",
                            style: "",
                            text,
                            type: "text",
                            version: 1
                        }],
                        direction: null,
                        format: "",
                        indent: 0,
                        type: "paragraph",
                        version: 1,
                        textFormat: 0
                    }],
                    direction: null,
                    format: "",
                    indent: 0,
                    type: "root",
                    version: 1
                }
            }));
            return true;
        } catch (_e) {
            return false;
        }
    }

    function clickFirst(selectors) {
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (!el) continue;
            el.click();
            return true;
        }
        return false;
    }

    async function sendToAI(prompt) {
        // 最小化时尝试让窗口/标签页获得焦点，避免部分站点拒绝无焦点输入
        try { unsafeWindow.focus(); } catch (_e) { /**/ }
        await sleep(300);
        const adapters = {
            DeepSeek: async () => {
                const el = document.querySelector("textarea");
                if (!el) return false;
                reactSet(el, prompt);
                await sleep(200);
                return clickFirst(["button[type=submit]", "button[aria-label*='发送']", "._7436101"]);
            },
            Doubao: async () => {
                const el = document.querySelector('[data-testid="chat_input_input"]');
                if (!el) return false;
                reactSet(el, prompt);
                await sleep(200);
                return clickFirst(["button#flow-end-msg-send", "button[type=submit]"]);
            },
            ChatGPT: async () => {
                const el = document.querySelector("#prompt-textarea");
                if (!el) return false;
                dispatchInput(el, prompt);
                await sleep(200);
                return clickFirst(['[data-testid="send-button"]', 'button[aria-label*="Send"]']);
            },
            Claude: async () => {
                const el = document.querySelector('[contenteditable="true"][data-testid*="input"]')
                    || document.querySelector('[contenteditable="true"]');
                if (!el) return false;
                dispatchInput(el, prompt);
                await sleep(200);
                return clickFirst(["button[aria-label='Send message']", "button[type=submit]"]);
            },
            Kimi: async () => {
                const ok = await setLexical(prompt);
                if (!ok) {
                    const el = document.querySelector('[contenteditable="true"]');
                    if (!el) return false;
                    dispatchInput(el, prompt);
                }
                await sleep(200);
                return clickFirst([".send-button", "button[type=submit]"]);
            },
            Yuanbao: async () => {
                const el = document.querySelector(".chat-input-editor .ql-editor") || document.querySelector('[contenteditable="true"]');
                if (!el) return false;
                dispatchInput(el, prompt);
                await sleep(200);
                return clickFirst([".icon-send", "button[type=submit]"]);
            },
            Qwen: async () => {
                const el = document.querySelector("#chat-input")
                    || document.querySelector("textarea")
                    || document.querySelector('[contenteditable="true"]');
                if (!el) return false;
                dispatchInput(el, prompt);
                await sleep(200);
                return clickFirst(["#send-message-button", "button[type=submit]"]);
            },
            Gemini: async () => {
                const el = document.querySelector("rich-textarea textarea")
                    || document.querySelector("textarea")
                    || document.querySelector('[contenteditable="true"]');
                if (!el) return false;
                dispatchInput(el, prompt);
                await sleep(200);
                return clickFirst(["button[aria-label*='Send']", "button[type=submit]"]);
            },
            Perplexity: async () => {
                const el = document.querySelector("textarea")
                    || document.querySelector('[contenteditable="true"]');
                if (!el) return false;
                dispatchInput(el, prompt);
                await sleep(200);
                return clickFirst(["button[aria-label*='Submit']", "button[aria-label*='Send']", "button[type=submit]"]);
            },
            Grok: async () => {
                const el = document.querySelector("form [contenteditable]")
                    || document.querySelector("textarea");
                if (!el) return false;
                dispatchInput(el, prompt);
                await sleep(200);
                return clickFirst(["button[type=submit]", "button[aria-label*='Send']"]);
            },
        };

        const adapter = adapters[AI];
        if (adapter) return !!(await adapter().catch(() => false));

        const genericEditor = document.querySelector("textarea, [contenteditable='true']");
        if (!genericEditor) return false;
        dispatchInput(genericEditor, prompt);
        await sleep(200);
        return clickFirst(["button[type=submit]", "button[aria-label*='Send']", "button[aria-label*='发送']"]);
    }

    async function pullTask() {
        return postAuthed({ action: "pullTask" });
    }

    GM_registerMenuCommand("⚙️ 设置 License Key", () => {
        const key = window.prompt("请输入你的 AI4Paper License Key：", licenseKey || "");
        if (key === null) return;
        licenseKey = key.trim();
        GM_setValue(LICENSE_KEY_STORE, licenseKey);
        window.alert(licenseKey ? "✅ License Key 已保存" : "⚠️ 已清除 License Key");
    });

    GM_registerMenuCommand("📊 AI4Paper Connector 状态", () => {
        const lines = [
            "平台: " + AI,
            "脚本: " + SCRIPT_VERSION,
            "License Key: " + (licenseKey ? licenseKey.slice(0, 8) + "****" : "未设置"),
            "运行: " + (isRunning ? "是" : "否"),
            "任务: " + (activeTask?.id || "空闲"),
        ];
        window.alert(lines.join("\n"));
    });

    GM_registerMenuCommand(isRunning ? "⏸ 暂停 Connector" : "▶️ 启用 Connector", () => {
        isRunning = !isRunning;
        GM_setValue(RUNNING_KEY, isRunning);
        window.alert(isRunning ? "AI4Paper Connector 已启用" : "AI4Paper Connector 已暂停");
    });

    while (true) {
        await sleep(POLL_INTERVAL);
        if (!isRunning) continue;
        if (!licenseKey) {
            dbg("未设置 License Key，跳过轮询（请在菜单中设置）");
            await sleep(5000);
            continue;
        }
        try {
            if (activeTask) continue;
            const resp = await pullTask();
            if (!resp?.task) continue;
            const task = resp.task;
            const newTask = {
                id: task.id,
                prompt: task.prompt,
                lastText: "",
                startedAt: Date.now(),
                reader: null,
                timeout: null,
            };
            // 5 分钟超时保险，防止任务卡死
            newTask.timeout = setTimeout(() => {
                if (activeTask && activeTask.id === newTask.id) {
                    dbg("task timeout:", newTask.id);
                    const text = activeTask.lastText || "";
                    clearActiveTask();
                    finishTask(newTask.id, text, "").catch(() => {});
                }
            }, 5 * 60 * 1000);
            activeTask = newTask;
            console.log("[AI4Paper] task:", task.id, "platform:", AI, "prompt:", (task.prompt || "").length);
            const ok = await sendToAI(task.prompt);
            if (!ok) {
                await finishTask(task.id, "", "发送失败，请检查页面状态");
            }
        } catch (error) {
            const text = String(error || "");
            if (!text.includes("Network")) console.warn("[AI4Paper] loop error", error);
            await sleep(1000);
        }
    }
})();
