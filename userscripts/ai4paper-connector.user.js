// ==UserScript==
// @name         AI4Paper Connector
// @description  AI4Paper 浏览器联动脚本，支持 DeepSeek / 豆包 / ChatGPT / Claude / 通义 / Kimi 等
// @namespace    https://ai4paper.pro
// @version      1.2.3
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
// @connect      ai4paper.pro
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(async function () {
    'use strict';

    const SCRIPT_VERSION = "1.2.3";
    const SERVER_BASE = "https://ai4paper.pro/api/browser-task";
    const LOGIN_URL = "https://ai4paper.pro/api/user/login";
    const TOKEN_STORE = "ai4paper.userToken";
    const RUNNING_KEY = "ai4paper.connector.running";
    const POLL_INTERVAL = 1200;
    const DEBUG = true;

    const AI = detectPlatform();
    let isRunning = GM_getValue(RUNNING_KEY, true) !== false;
    let userToken = GM_getValue(TOKEN_STORE, "");
    let activeTask = null;

    // ── 页面状态条 ─────────────────────────────────────────────────────────
    let _statusEl = null;
    function showStatus(msg, color) {
        if (!_statusEl) {
            _statusEl = document.createElement("div");
            _statusEl.style.cssText = "position:fixed;bottom:12px;right:12px;z-index:2147483647;padding:6px 12px;border-radius:6px;font-size:12px;font-family:monospace;max-width:320px;word-break:break-all;box-shadow:0 2px 8px rgba(0,0,0,.2);";
            document.documentElement.appendChild(_statusEl);
        }
        _statusEl.style.background = color || "#1e293b";
        _statusEl.style.color = "#fff";
        _statusEl.textContent = "🔗 AI4Paper: " + msg;
        clearTimeout(_statusEl._hide);
        _statusEl._hide = setTimeout(() => { if (_statusEl) _statusEl.style.opacity = "0.3"; }, 5000);
        _statusEl.style.opacity = "1";
    }

    // ── 后台保活 ──────────────────────────────────────────────────────────
    function initBackgroundKeepAlive() {
        try {
            const blob = new Blob([`setInterval(()=>postMessage(1),400);`], { type: "text/javascript" });
            const w = new Worker(URL.createObjectURL(blob));
            w.onmessage = () => {};
        } catch (_e) { /**/ }
        try {
            Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
            Object.defineProperty(document, "visibilityState", { get: () => "visible", configurable: true });
            document.addEventListener("visibilitychange", e => e.stopImmediatePropagation(), true);
        } catch (_e) { /**/ }
    }
    initBackgroundKeepAlive();

    function dbg(...args) {
        if (DEBUG) console.log("[AI4Paper]", ...args);
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

    // ── JWT 解析（不验签，仅读 exp） ───────────────────────────────────────
    function isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return Date.now() / 1000 > payload.exp - 60; // 提前 60s 视为过期
        } catch (_e) { return true; }
    }

    // ── 登录弹窗 ──────────────────────────────────────────────────────────
    GM_addStyle(`
        #a4p-login-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,.45);
            z-index: 2147483647; display: flex; align-items: center; justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        #a4p-login-box {
            background: #fff; border-radius: 12px; padding: 32px 28px;
            width: 340px; box-shadow: 0 8px 40px rgba(0,0,0,.18);
            display: flex; flex-direction: column; gap: 14px;
        }
        #a4p-login-box h2 {
            margin: 0; font-size: 18px; font-weight: 700; color: #111;
            display: flex; align-items: center; gap: 8px;
        }
        #a4p-login-box p { margin: 0; font-size: 13px; color: #666; line-height: 1.5; }
        #a4p-login-box input {
            width: 100%; box-sizing: border-box; padding: 9px 12px;
            border: 1px solid #d1d5db; border-radius: 7px; font-size: 14px; outline: none;
        }
        #a4p-login-box input:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,.15); }
        #a4p-login-btn {
            background: #6366f1; color: #fff; border: none; border-radius: 7px;
            padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
            transition: background .15s;
        }
        #a4p-login-btn:hover { background: #4f46e5; }
        #a4p-login-btn:disabled { background: #a5b4fc; cursor: not-allowed; }
        #a4p-login-err { color: #ef4444; font-size: 13px; display: none; }
        #a4p-login-close {
            position: absolute; top: 12px; right: 16px; cursor: pointer;
            font-size: 20px; color: #9ca3af; background: none; border: none;
        }
    `);

    function showLoginDialog() {
        return new Promise((resolve) => {
            if (document.getElementById("a4p-login-overlay")) return;

            const overlay = document.createElement("div");
            overlay.id = "a4p-login-overlay";
            overlay.innerHTML = `
                <div id="a4p-login-box" style="position:relative">
                    <button id="a4p-login-close" title="关闭">✕</button>
                    <h2>🔗 AI4Paper 登录</h2>
                    <p>请登录您的 AI4Paper 账号，Connector 将自动帮您把 Zotero 任务发送到 AI 并取回结果。</p>
                    <input id="a4p-email" type="email" placeholder="邮箱" autocomplete="email" />
                    <input id="a4p-pass" type="password" placeholder="密码" autocomplete="current-password" />
                    <div id="a4p-login-err"></div>
                    <button id="a4p-login-btn">登录</button>
                </div>
            `;
            document.documentElement.appendChild(overlay);

            const emailEl = overlay.querySelector("#a4p-email");
            const passEl = overlay.querySelector("#a4p-pass");
            const btnEl = overlay.querySelector("#a4p-login-btn");
            const errEl = overlay.querySelector("#a4p-login-err");
            const closeEl = overlay.querySelector("#a4p-login-close");

            function close(token) {
                overlay.remove();
                resolve(token || null);
            }

            closeEl.addEventListener("click", () => close(null));
            overlay.addEventListener("click", e => { if (e.target === overlay) close(null); });

            async function doLogin() {
                const email = emailEl.value.trim();
                const pass = passEl.value;
                if (!email || !pass) { showErr("请填写邮箱和密码"); return; }
                btnEl.disabled = true;
                btnEl.textContent = "登录中…";
                errEl.style.display = "none";

                GM_xmlhttpRequest({
                    method: "POST",
                    url: LOGIN_URL,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({ email, password: pass }),
                    timeout: 15000,
                    onload(resp) {
                        let data;
                        try { data = JSON.parse(resp.responseText); } catch (_e) { data = {}; }
                        if (resp.status === 200 && data.access_token) {
                            userToken = data.access_token;
                            GM_setValue(TOKEN_STORE, userToken);
                            dbg("login ok, token stored");
                            close(userToken);
                        } else {
                            showErr(data.detail || "登录失败，请检查邮箱和密码");
                            btnEl.disabled = false;
                            btnEl.textContent = "登录";
                        }
                    },
                    onerror() { showErr("网络错误，请重试"); btnEl.disabled = false; btnEl.textContent = "登录"; },
                    ontimeout() { showErr("请求超时，请重试"); btnEl.disabled = false; btnEl.textContent = "登录"; },
                });
            }

            function showErr(msg) { errEl.textContent = msg; errEl.style.display = "block"; }

            btnEl.addEventListener("click", doLogin);
            passEl.addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });
            emailEl.addEventListener("keydown", e => { if (e.key === "Enter") passEl.focus(); });

            setTimeout(() => emailEl.focus(), 100);
        });
    }

    // ── 确保有有效 token，否则弹登录框 ────────────────────────────────────
    async function ensureAuth() {
        if (userToken && !isTokenExpired(userToken)) return true;
        userToken = "";
        GM_setValue(TOKEN_STORE, "");
        dbg("no valid token, showing login dialog");
        const token = await showLoginDialog();
        return !!token;
    }

    // ── 服务器通信 ─────────────────────────────────────────────────────────
    function serverRequest(method, path, body) {
        return new Promise(resolve => {
            if (!userToken) { resolve(null); return; }
            GM_xmlhttpRequest({
                method,
                url: SERVER_BASE + path,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + userToken,
                },
                data: body ? JSON.stringify(body) : undefined,
                onload(resp) {
                    if (resp.status === 401 || resp.status === 403) {
                        // token 失效，清掉，下次轮询触发登录
                        userToken = "";
                        GM_setValue(TOKEN_STORE, "");
                        resolve(null);
                        return;
                    }
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
            if (activeTask.reader) { try { activeTask.reader.cancel(); } catch (_e) { /**/ } }
        }
        activeTask = null;
    }

    async function finishTask(taskId, text, error) {
        if (!taskId) return;
        dbg("finishTask", taskId, "len:", String(text || "").length, error || "");
        await serverRequest("POST", "/push", { taskId, text: text || "", done: true, error: error || "" });
        clearActiveTask();
    }

    async function pushTaskText(taskId, text, done) {
        if (!activeTask || activeTask.id !== taskId) return;
        const nextText = String(text || "");
        if (!done && nextText === activeTask.lastText) return;
        activeTask.lastText = nextText;
        if (done) { await finishTask(taskId, nextText, ""); return; }
        await serverRequest("POST", "/push", { taskId, text: nextText, done: false, error: "" });
    }

    // ── 流式拦截 ──────────────────────────────────────────────────────────
    const PATCH_DEFS = [
        {
            AI: "DeepSeek",
            regex: /completion$/,
            extract(chunk, all) {
                let resp = "", think = "";
                for (const line of all.split("\n")) {
                    if (!line.startsWith("data: {")) continue;
                    let data; try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
                    if (data.choices) {
                        const delta = data.choices[0]?.delta;
                        if (delta?.type === "thinking") think += delta.content || "";
                        else if (delta?.type === "text") resp += delta.content || "";
                    } else {
                        if (Array.isArray(data.v) && data.v[0]?.type) { this._type = data.v[0].type; data.v = data.v[0].content; }
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
                    let outer; try { outer = JSON.parse(raw); } catch (_e) { continue; }
                    if (outer.event_data) {
                        try {
                            const inner = typeof outer.event_data === "string" ? JSON.parse(outer.event_data) : outer.event_data;
                            const msgContent = inner?.message?.content;
                            if (msgContent) {
                                try {
                                    const content = typeof msgContent === "string" ? JSON.parse(msgContent) : msgContent;
                                    if (![1, 5, 6].includes(content.type)) {
                                        if (content.text) resp += content.text;
                                        if (content.think) think += content.think;
                                    }
                                } catch (_e) { if (typeof msgContent === "string") resp += msgContent; }
                            }
                        } catch (_e) { /**/ }
                        continue;
                    }
                    const delta = outer.choices?.[0]?.delta;
                    if (delta) { resp += delta.content || delta.text || ""; continue; }
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
                        let data; try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
                        if (data.message?.content?.content_type === "text") {
                            this.text = data.message.content.parts?.[0] || "";
                        }
                        continue;
                    }
                    if (!line.startsWith("data: {")) continue;
                    let data; try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
                    const direct = extractAnyText(data);
                    if (direct) this.text = mergeText(this.text, direct);
                    const streamPath = "/message/content/parts/0";
                    if (Object.keys(data).length === 1 && typeof data.v === "string" && this._path === streamPath) {
                        this.text += data.v;
                    } else if (this._path === streamPath || data.p === streamPath) {
                        this._path = streamPath;
                        if (data.o === "add") this.text = "";
                        if (typeof data.v === "string") this.text += data.v;
                    } else { this._path = ""; }
                }
                if (!this.text) { const fb = extractChatGPTFromAll(all); if (fb) this.text = fb; }
            }
        },
        {
            AI: "Claude",
            regex: /chat_conversations\/.+\/completion/,
            extract(chunk) {
                for (const line of chunk.split("\n")) {
                    if (!line.startsWith("data: {")) continue;
                    let data; try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
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
                    let data; try { data = JSON.parse(item); } catch (_e) { continue; }
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
                    let data; try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
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
                    let data; try { data = JSON.parse(line.slice(6)); } catch (_e) { continue; }
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
                    let data; try { data = JSON.parse(line).result; } catch (_e) { continue; }
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
        return { AI: def.AI, regex: def.regex, text: "", allText: "", _type: "", _path: "", extract: def.extract };
    }

    function extractAnyText(payload) {
        if (payload == null) return "";
        if (typeof payload === "string" || typeof payload === "number" || typeof payload === "boolean") return String(payload);
        if (Array.isArray(payload)) return payload.map(extractAnyText).filter(Boolean).join("");
        if (typeof payload === "object") {
            const pieces = [];
            const push = (v) => { if (v == null || v === payload) return; const t = extractAnyText(v); if (t) pieces.push(t); };
            push(payload.text); push(payload.output_text); push(payload.content);
            push(payload.parts); push(payload.value); push(payload.delta);
            push(payload.message); push(payload.response);
            if (pieces.length) return pieces.join("");
        }
        return "";
    }

    function mergeText(prev, next) {
        const a = String(prev || ""), b = String(next || "");
        if (!a) return b; if (!b) return a;
        if (b.startsWith(a)) return b; if (a.startsWith(b)) return a;
        if (a.includes(b)) return a;
        return a + b;
    }

    function extractChatGPTFromAll(all) {
        let text = "";
        for (const line of String(all || "").split("\n")) {
            if (!line.startsWith("data:")) continue;
            const raw = line.slice(5).trim();
            if (!raw || raw === "[DONE]") continue;
            let data; try { data = JSON.parse(raw); } catch (_e) { continue; }
            const part = extractAnyText(data);
            if (part) text = mergeText(text, part);
        }
        return text;
    }

    function getPatchDef(url) {
        return PATCH_DEFS.find(def => def.AI === AI && def.regex.test(url || ""));
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ── DOM 轮询提取（ChatGPT Service Worker 绕过 fetch 拦截时的降级方案）──────
    const DOM_EXTRACTORS = {
        ChatGPT() {
            // 多个选择器兼容不同版本 ChatGPT
            const selectors = [
                '[data-message-author-role="assistant"] .markdown',
                '[data-message-author-role="assistant"] .prose',
                '[data-message-author-role="assistant"]',
                'article[data-testid^="conversation-turn"] [data-message-author-role="assistant"]',
            ];
            for (const sel of selectors) {
                const msgs = [...document.querySelectorAll(sel)];
                if (!msgs.length) continue;
                const last = msgs[msgs.length - 1];
                const text = (last?.innerText || last?.textContent || "").trim();
                if (text) return text;
            }
            return "";
        },
        DeepSeek() {
            const msgs = [...document.querySelectorAll('.ds-markdown, .markdown-body')];
            const last = msgs[msgs.length - 1];
            return (last?.innerText || last?.textContent || "").trim();
        },
        Doubao() {
            const msgs = [...document.querySelectorAll('[class*="chat-doc-content"], [class*="message-content"]')];
            const last = msgs[msgs.length - 1];
            return (last?.innerText || last?.textContent || "").trim();
        },
    };

    const STREAMING_INDICATORS = {
        ChatGPT: () => !!document.querySelector('[data-testid="stop-button"], button[aria-label*="Stop"]'),
        DeepSeek: () => !!document.querySelector('.stop-btn, [class*="stop"]'),
        Doubao: () => !!document.querySelector('[class*="stop"], [class*="loading"]'),
    };

    function startDOMExtractor(taskId) {
        const extract = DOM_EXTRACTORS[AI];
        if (!extract) return null;
        const isStreaming = STREAMING_INDICATORS[AI] || (() => false);

        let lastText = "";
        let stableMs = 0;
        const STABLE_DONE = 2500; // 文本稳定 2.5s 且无生成指示符 → 认为完成
        const INTERVAL = 400;

        dbg("DOM extractor started for", AI, taskId);
        showStatus("等待 AI 回复…", "#0f172a");

        const timer = setInterval(async () => {
            if (!activeTask || activeTask.id !== taskId) {
                clearInterval(timer);
                return;
            }
            const text = extract();
            if (!text) return;

            if (text !== lastText) {
                lastText = text;
                stableMs = 0;
                showStatus("提取中… " + text.length + " 字", "#0369a1");
                // 增量推送（用全文，服务器端做 diff）
                if (text !== activeTask.lastText) {
                    activeTask.lastText = text;
                    const r = await serverRequest("POST", "/push", { taskId, text, done: false, error: "" });
                    if (!r) showStatus("⚠️ 推送失败（网络/认证）", "#dc2626");
                }
                return;
            }

            // 文本未变
            stableMs += INTERVAL;
            if (stableMs >= STABLE_DONE && !isStreaming()) {
                clearInterval(timer);
                dbg("DOM extractor done, text len:", text.length);
                showStatus("✅ 完成，推送给 Zotero…", "#16a34a");
                if (activeTask && activeTask.id === taskId) {
                    await finishTask(taskId, text, "");
                }
            }
        }, INTERVAL);

        return timer;
    }

    function monitorFetchResponse(response, taskId) {
        const def = getPatchDef(response.url);
        if (!def || !response.body || !activeTask || activeTask.id !== taskId) return;
        const state = createPatchState(def);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        if (activeTask && activeTask.id === taskId) activeTask.reader = reader;
        const read = () => reader.read().then(async ({ done, value }) => {
            if (!activeTask || activeTask.id !== taskId) { reader.cancel().catch(() => {}); return; }
            if (done) { await pushTaskText(taskId, state.text, true); return; }
            const chunk = decoder.decode(value, { stream: true });
            state.allText += chunk;
            try { state.extract.call(state, chunk, state.allText); await pushTaskText(taskId, state.text, false); } catch (_e) { /**/ }
            read();
        }).catch(async (error) => {
            const msg = String(error?.name || error || "");
            if (msg.includes("AbortError") || msg.includes("abort") || msg.includes("cancel")) return;
            if (activeTask && activeTask.id === taskId) await finishTask(taskId, state.text, "");
        });
        read();
    }

    const nativeFetch = (unsafeWindow.fetch || window.fetch).bind(unsafeWindow || window);
    unsafeWindow.fetch = async function (...args) {
        const response = await nativeFetch(...args);
        if (!activeTask) return response;
        const clone = response.clone();
        window.setTimeout(() => { if (activeTask) monitorFetchResponse(clone, activeTask.id); }, 0);
        return response;
    };

    // SPA 导航检测
    function onNavigate() {
        if (!activeTask) return;
        const runningMs = Date.now() - activeTask.startedAt;
        // 任务刚开始且还没收到任何文本时，忽略导航（ChatGPT 发送后会跳到新对话 URL）
        if (runningMs < 8000 && !activeTask.lastText) {
            dbg("navigation ignored (task fresh, no text yet):", activeTask.id);
            return;
        }
        const savedId = activeTask.id;
        const savedText = activeTask.lastText || "";
        dbg("SPA navigation, finishing task:", savedId);
        clearActiveTask();
        finishTask(savedId, savedText, "").catch(() => {});
    }
    try {
        const _pushState = history.pushState.bind(history);
        history.pushState = function (...args) { _pushState(...args); setTimeout(onNavigate, 50); };
        window.addEventListener("popstate", () => setTimeout(onNavigate, 50));
    } catch (_e) { /**/ }

    const nativeXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        const def = getPatchDef(url);
        if (def) {
            const taskId = activeTask?.id || null;
            const state = createPatchState(def);
            this.addEventListener("readystatechange", async function () {
                if (!taskId || !activeTask || activeTask.id !== taskId) return;
                if (this.readyState !== 3 && this.readyState !== 4) return;
                try {
                    state.allText = this.responseText || "";
                    state.extract.call(state, state.allText, state.allText);
                    await pushTaskText(taskId, state.text, this.readyState === 4);
                } catch (_e) { /**/ }
            });
        }
        return nativeXHROpen.apply(this, arguments);
    };

    // ── 发送到 AI ─────────────────────────────────────────────────────────
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
            el.focus(); el.textContent = text;
            try { el.innerHTML = text.split("\n").map(line => `<p>${line}</p>`).join(""); } catch (_e) { /**/ }
            el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, data: text }));
            return true;
        }
        return false;
    }

    function reactSet(el, text) {
        if (!el) return false;
        setNativeValue(el, text);
        const keys = Object.keys(el).filter(k => k.startsWith("__reactProps") || k.startsWith("__reactEventHandlers"));
        for (const key of keys) {
            const props = el[key];
            if (props?.onChange) { props.onChange({ target: el, currentTarget: el, type: "change" }); return true; }
            if (props?.onInput) { props.onInput({ target: el, currentTarget: el, type: "input" }); return true; }
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
                root: { children: [{ children: [{ detail: 0, format: 0, mode: "normal", style: "", text, type: "text", version: 1 }], direction: null, format: "", indent: 0, type: "paragraph", version: 1, textFormat: 0 }], direction: null, format: "", indent: 0, type: "root", version: 1 }
            }));
            return true;
        } catch (_e) { return false; }
    }

    function clickFirst(selectors) {
        for (const sel of selectors) { const el = document.querySelector(sel); if (el) { el.click(); return true; } }
        return false;
    }

    async function sendToAI(prompt) {
        try { unsafeWindow.focus(); } catch (_e) { /**/ }
        await sleep(300);
        const adapters = {
            DeepSeek: async () => { const el = document.querySelector("textarea"); if (!el) return false; reactSet(el, prompt); await sleep(200); return clickFirst(["button[type=submit]", "button[aria-label*='发送']", "._7436101"]); },
            Doubao: async () => { const el = document.querySelector('[data-testid="chat_input_input"]'); if (!el) return false; reactSet(el, prompt); await sleep(200); return clickFirst(["button#flow-end-msg-send", "button[type=submit]"]); },
            ChatGPT: async () => { const el = document.querySelector("#prompt-textarea"); if (!el) return false; dispatchInput(el, prompt); await sleep(200); return clickFirst(['[data-testid="send-button"]', 'button[aria-label*="Send"]']); },
            Claude: async () => { const el = document.querySelector('[contenteditable="true"][data-testid*="input"]') || document.querySelector('[contenteditable="true"]'); if (!el) return false; dispatchInput(el, prompt); await sleep(200); return clickFirst(["button[aria-label='Send message']", "button[type=submit]"]); },
            Kimi: async () => { const ok = await setLexical(prompt); if (!ok) { const el = document.querySelector('[contenteditable="true"]'); if (!el) return false; dispatchInput(el, prompt); } await sleep(200); return clickFirst([".send-button", "button[type=submit]"]); },
            Yuanbao: async () => { const el = document.querySelector(".chat-input-editor .ql-editor") || document.querySelector('[contenteditable="true"]'); if (!el) return false; dispatchInput(el, prompt); await sleep(200); return clickFirst([".icon-send", "button[type=submit]"]); },
            Qwen: async () => { const el = document.querySelector("#chat-input") || document.querySelector("textarea") || document.querySelector('[contenteditable="true"]'); if (!el) return false; dispatchInput(el, prompt); await sleep(200); return clickFirst(["#send-message-button", "button[type=submit]"]); },
            Gemini: async () => { const el = document.querySelector("rich-textarea textarea") || document.querySelector("textarea") || document.querySelector('[contenteditable="true"]'); if (!el) return false; dispatchInput(el, prompt); await sleep(200); return clickFirst(["button[aria-label*='Send']", "button[type=submit]"]); },
            Perplexity: async () => { const el = document.querySelector("textarea") || document.querySelector('[contenteditable="true"]'); if (!el) return false; dispatchInput(el, prompt); await sleep(200); return clickFirst(["button[aria-label*='Submit']", "button[aria-label*='Send']", "button[type=submit]"]); },
            Grok: async () => { const el = document.querySelector("form [contenteditable]") || document.querySelector("textarea"); if (!el) return false; dispatchInput(el, prompt); await sleep(200); return clickFirst(["button[type=submit]", "button[aria-label*='Send']"]); },
        };
        const adapter = adapters[AI];
        if (adapter) return !!(await adapter().catch(() => false));
        const genericEditor = document.querySelector("textarea, [contenteditable='true']");
        if (!genericEditor) return false;
        dispatchInput(genericEditor, prompt);
        await sleep(200);
        return clickFirst(["button[type=submit]", "button[aria-label*='Send']", "button[aria-label*='发送']"]);
    }

    // ── GM 菜单 ───────────────────────────────────────────────────────────
    GM_registerMenuCommand("👤 登录 / 切换账号", async () => {
        userToken = ""; GM_setValue(TOKEN_STORE, "");
        await showLoginDialog();
    });

    GM_registerMenuCommand("📊 AI4Paper 状态", () => {
        let tokenInfo = "未登录";
        if (userToken) {
            try { const p = JSON.parse(atob(userToken.split(".")[1])); tokenInfo = "已登录 (sub:" + p.sub + ")"; } catch (_e) { tokenInfo = "已登录"; }
        }
        window.alert([
            "平台: " + AI,
            "脚本: " + SCRIPT_VERSION,
            "账号: " + tokenInfo,
            "运行: " + (isRunning ? "是" : "否"),
            "任务: " + (activeTask?.id || "空闲"),
        ].join("\n"));
    });

    GM_registerMenuCommand(isRunning ? "⏸ 暂停 Connector" : "▶️ 启用 Connector", () => {
        isRunning = !isRunning; GM_setValue(RUNNING_KEY, isRunning);
        window.alert(isRunning ? "AI4Paper Connector 已启用" : "AI4Paper Connector 已暂停");
    });

    // ── 主循环 ────────────────────────────────────────────────────────────
    while (true) {
        await sleep(POLL_INTERVAL);
        if (!isRunning) continue;
        try {
            if (activeTask) continue;

            // 确保已登录
            const authed = await ensureAuth();
            if (!authed) { await sleep(5000); continue; }

            const resp = await pullTask();
            if (!resp?.task) continue;

            const task = resp.task;
            const newTask = { id: task.id, prompt: task.prompt, lastText: "", startedAt: Date.now(), reader: null, timeout: null };
            newTask.timeout = setTimeout(() => {
                if (activeTask && activeTask.id === newTask.id) {
                    dbg("task timeout:", newTask.id);
                    const text = activeTask.lastText || "";
                    clearActiveTask();
                    finishTask(newTask.id, text, "").catch(() => {});
                }
            }, 5 * 60 * 1000);
            activeTask = newTask;
            dbg("task:", task.id, "platform:", AI, "prompt len:", (task.prompt || "").length);
            showStatus("收到任务，发送中…", "#7c3aed");
            const ok = await sendToAI(task.prompt);
            if (!ok) {
                showStatus("❌ 发送失败", "#dc2626");
                await finishTask(task.id, "", "发送失败，请检查页面状态");
            } else {
                showStatus("✉️ 已发送，等待回复…", "#0369a1");
                // 启动 DOM 轮询提取器（与 fetch 拦截并行，哪个先完成都可以）
                startDOMExtractor(task.id);
            }
        } catch (error) {
            const text = String(error || "");
            if (!text.includes("Network")) console.warn("[AI4Paper] loop error", error);
            await sleep(1000);
        }
    }
})();
