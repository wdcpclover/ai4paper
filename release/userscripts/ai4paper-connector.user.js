// ==UserScript==
// @name         AI4Paper Connector
// @description  AI4Paper 浏览器联动脚本，支持 DeepSeek / 豆包 / ChatGPT / Claude / 通义 / Kimi 等
// @namespace    https://ai4paper.pro
// @version      1.2.13
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
// @match        https://www.kimi.com/*
// @match        https://yuanbao.tencent.com/chat/*
// @match        https://qianwen.aliyun.com/*
// @match        https://chat.qwenlm.ai/*
// @match        https://chat.qwen.ai/*
// @match        https://www.qianwen.com/*
// @match        https://gemini.google.com/*
// @match        https://www.perplexity.ai/*
// @match        https://grok.com/*
// @include      /.+deepseek.+/
// @include      /.+doubao.+/
// @include      /.+claude.+/
// @include      /.+kimi.+/
// @include      /.+qwen.+/
// @include      /.+qianwen.+/
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

    const SCRIPT_VERSION = "1.2.13";
    const SERVER_BASE = "https://ai4paper.pro/api/browser-task";
    const LOGIN_URL = "https://ai4paper.pro/api/user/login";
    const TOKEN_STORE = "ai4paper.userToken";
    const RUNNING_KEY = "ai4paper.connector.running";
    const SESSION_STORE = "ai4paper.connector.sessionId";
    const POLL_INTERVAL = 1200;
    const FINAL_PUSH_RETRY_DELAY = 10000;
    const FINAL_PUSH_RETRY_ATTEMPTS = 3;
    const PREFERRED_CONTEXT_WAIT_MS = 15000;
    const MIN_TASK_TIMEOUT_MS = 15000;
    const MAX_TASK_TIMEOUT_MS = 5 * 60 * 1000;
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

    function makeId(prefix) {
        try {
            if (window.crypto?.randomUUID) return prefix + "_" + window.crypto.randomUUID();
        } catch (_e) { /**/ }
        return prefix + "_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    }

    function detectPlatform() {
        const host = location.host;
        if (host === "chat.deepseek.com") return "DeepSeek";
        if (host === "www.doubao.com") return "Doubao";
        if (host === "chatgpt.com") return "ChatGPT";
        if (host.includes("claude")) return "Claude";
        if (host === "kimi.moonshot.cn" || host === "www.kimi.com") return "Kimi";
        if (host === "yuanbao.tencent.com") return "Yuanbao";
        if (host.includes("qwen") || host === "qianwen.aliyun.com" || host === "www.qianwen.com") return "Qwen";
        if (host === "gemini.google.com") return "Gemini";
        if (host === "www.perplexity.ai") return "Perplexity";
        if (host.includes("grok")) return "Grok";
        return "Unknown";
    }

    function getWorkerSessionId() {
        try {
            const cached = sessionStorage.getItem(SESSION_STORE);
            if (cached) return cached;
            const nextId = makeId("ws");
            sessionStorage.setItem(SESSION_STORE, nextId);
            return nextId;
        } catch (_e) {
            if (!window.__ai4paperWorkerSessionId) {
                window.__ai4paperWorkerSessionId = makeId("ws");
            }
            return window.__ai4paperWorkerSessionId;
        }
    }

    function getCurrentThreadId() {
        try {
            const path = location.pathname || "/";
            const search = location.search || "";
            const hash = location.hash || "";
            const normalizedPath = path.replace(/\/+$/, "") || "/";
            const query = search.replace(/^\?/, "");

            if (AI === "ChatGPT") {
                const match = normalizedPath.match(/^\/c\/([^/]+)$/);
                return match ? "chatgpt:c:" + match[1] : "";
            }
            if (AI === "Claude") {
                const match = normalizedPath.match(/^\/chat\/([^/]+)$/);
                return match ? "claude:chat:" + match[1] : "";
            }
            if (AI === "Doubao" || AI === "Yuanbao") {
                if (normalizedPath !== "/") return AI.toLowerCase() + ":" + normalizedPath + search;
                return "";
            }
            if (AI === "DeepSeek" || AI === "Kimi" || AI === "Qwen" || AI === "Gemini" || AI === "Perplexity" || AI === "Grok") {
                if (normalizedPath !== "/") return AI.toLowerCase() + ":" + normalizedPath + search;
                if (query.includes("conversation") || query.includes("chat")) return AI.toLowerCase() + ":?" + query;
                if (hash.length > 1) return AI.toLowerCase() + ":" + hash;
                return "";
            }
            if (normalizedPath !== "/") return location.host + ":" + normalizedPath + search;
            return "";
        } catch (_e) {
            return "";
        }
    }

    function getWorkerContext() {
        return {
            sessionId: getWorkerSessionId(),
            threadId: getCurrentThreadId(),
            url: location.href,
            title: document.title || "",
        };
    }

    function describePreferredContext(task) {
        const parts = [];
        if (task?.preferredSessionId) parts.push("会话");
        if (task?.preferredThreadId) parts.push("线程");
        return parts.join(" / ") || "页面上下文";
    }

    function checkPreferredContext(task) {
        const ctx = getWorkerContext();
        if (task?.preferredSessionId && task.preferredSessionId !== ctx.sessionId) {
            return {
                ok: false,
                reason: "当前标签页不是任务绑定的会话",
                current: ctx,
            };
        }
        if (task?.preferredThreadId && task.preferredThreadId !== ctx.threadId) {
            return {
                ok: false,
                reason: "当前页面不是任务绑定的对话线程",
                current: ctx,
            };
        }
        return { ok: true, current: ctx };
    }

    async function waitForPreferredContext(task) {
        const deadline = Date.now() + PREFERRED_CONTEXT_WAIT_MS;
        while (Date.now() < deadline) {
            const result = checkPreferredContext(task);
            if (result.ok) return true;
            showStatus("等待切回已绑定的" + describePreferredContext(task) + "…", "#b45309");
            await sleep(400);
        }
        return false;
    }

    function getTaskTimeoutMs(task) {
        const expiresAt = Number(task?.expiresAt || 0);
        if (!expiresAt) return MAX_TASK_TIMEOUT_MS;
        const remainingMs = Math.floor(expiresAt * 1000 - Date.now() - 5000);
        return Math.max(MIN_TASK_TIMEOUT_MS, Math.min(MAX_TASK_TIMEOUT_MS, remainingMs));
    }

    // ── JWT 解析（不验签，仅读 exp） ───────────────────────────────────────
    function decodeJWTPayload(token) {
        const raw = String(token || "").split(".")[1] || "";
        if (!raw) throw new Error("missing jwt payload");
        const normalized = raw.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
        return JSON.parse(atob(padded));
    }

    function isTokenExpired(token) {
        try {
            const payload = decodeJWTPayload(token);
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
        const ctx = getWorkerContext();
        const query = new URLSearchParams({
            platform: AI,
            sessionId: ctx.sessionId,
            url: ctx.url,
            title: ctx.title,
        });
        if (ctx.threadId) query.set("threadId", ctx.threadId);
        return serverRequest("GET", "/poll?" + query.toString());
    }

    function clearActiveTask() {
        if (activeTask) {
            if (activeTask.timeout) clearTimeout(activeTask.timeout);
            if (activeTask.finishRetryTimer) clearTimeout(activeTask.finishRetryTimer);
            if (activeTask.reader) { try { activeTask.reader.cancel(); } catch (_e) { /**/ } }
        }
        activeTask = null;
    }

    async function pushFinalResult(taskId, text, error) {
        let result = null;
        for (let attempt = 0; attempt < FINAL_PUSH_RETRY_ATTEMPTS; attempt++) {
            result = await serverRequest("POST", "/push", {
                taskId,
                text,
                done: true,
                error,
                ...getWorkerContext(),
            });
            if (result) return true;
            if (attempt < FINAL_PUSH_RETRY_ATTEMPTS - 1) {
                await sleep(1200 * (attempt + 1));
            }
        }
        return false;
    }

    function scheduleFinishRetry(taskId, text, error) {
        if (!activeTask || activeTask.id !== taskId) return;
        if (activeTask.finishRetryTimer) clearTimeout(activeTask.finishRetryTimer);
        activeTask.pendingFinish = { text, error };
        activeTask.finishRetryTimer = setTimeout(() => {
            if (!activeTask || activeTask.id !== taskId) return;
            const pending = activeTask.pendingFinish || { text: activeTask.lastText || "", error: "" };
            finishTask(taskId, pending.text, pending.error).catch(() => {});
        }, FINAL_PUSH_RETRY_DELAY);
    }

    async function finishTask(taskId, text, error) {
        if (!taskId || !activeTask || activeTask.id !== taskId) return;
        if (activeTask.finishInFlight) {
            activeTask.pendingFinish = { text: String(text || activeTask.lastText || ""), error: error || "" };
            return;
        }
        dbg("finishTask", taskId, "len:", String(text || "").length, error || "");
        activeTask.finishInFlight = true;
        if (activeTask.finishRetryTimer) {
            clearTimeout(activeTask.finishRetryTimer);
            activeTask.finishRetryTimer = null;
        }
        const finalText = String(text || activeTask.lastText || "");
        activeTask.lastText = finalText;
        const ok = await pushFinalResult(taskId, finalText, error || "");
        if (!activeTask || activeTask.id !== taskId) return;
        activeTask.finishInFlight = false;
        if (ok) {
            activeTask.pendingFinish = null;
            clearActiveTask();
            return;
        }
        showStatus("⚠️ 结果回传失败，稍后重试…", "#dc2626");
        scheduleFinishRetry(taskId, finalText, error || "");
    }

    async function pushTaskText(taskId, text, done) {
        if (!activeTask || activeTask.id !== taskId) return;
        const nextText = String(text || "");
        if (done) {
            const finalText = mergeText(activeTask.lastText || "", nextText);
            activeTask.lastText = finalText;
            await finishTask(taskId, finalText, "");
            return;
        }
        if (!nextText) return;
        const mergedText = mergeText(activeTask.lastText || "", nextText);
        if (mergedText === activeTask.lastText) return;
        activeTask.lastText = mergedText;
        await serverRequest("POST", "/push", {
            taskId,
            text: mergedText,
            done: false,
            error: "",
            ...getWorkerContext(),
        });
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
                this.thinkingText = think;
                this.text = resp;
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
                this.thinkingText = think;
                this.text = resp;
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
                this.thinkingText = think;
                this.text = resp;
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
                this.thinkingText = think;
                this.text = resp;
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
                this.thinkingText = think;
                this.text = resp;
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
                this.thinkingText = think;
                this.text = resp;
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

    function hasMeaningfulText(text) {
        return String(text || "").trim().length > 0;
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
            const last = getChatGPTAssistantElement();
            if (!last) return "";
            const article = last.closest('article') || last.closest('[data-testid^="conversation-turn"]') || last.parentElement;
            if (!article) return (last?.innerText || last?.textContent || "").trim();
            const clone = article.cloneNode(true);
            if (clone && clone.querySelectorAll) {
                clone.querySelectorAll('button, nav, textarea, input, form, svg, img, picture').forEach((el) => el.remove());
            }
            return (clone?.innerText || clone?.textContent || "").trim();
        },
        DeepSeek() {
            const msgs = [...document.querySelectorAll('.ds-markdown, .markdown-body')];
            const last = msgs[msgs.length - 1];
            return (last?.innerText || last?.textContent || "").trim();
        },
        Doubao() {
            const msgs = [...document.querySelectorAll('[class*="flow-markdown-body"]')];
            const last = msgs[msgs.length - 1];
            return (last?.innerText || last?.textContent || "").trim();
        },
        Kimi() {
            const msgs = [...document.querySelectorAll('.segment.segment-assistant .markdown, .segment-assistant .markdown-container')];
            const last = msgs[msgs.length - 1];
            return (last?.innerText || last?.textContent || "").trim();
        },
        Qwen() {
            // www.qianwen.com
            const qkMsgs = [...document.querySelectorAll('[class*="qk-markdown"]')];
            if (qkMsgs.length) {
                const last = qkMsgs[qkMsgs.length - 1];
                return (last?.innerText || last?.textContent || "").trim();
            }
            // chat.qwen.ai
            const msgs = [...document.querySelectorAll('.response-message-content, .custom-qwen-markdown, .qwen-markdown')];
            const last = msgs[msgs.length - 1];
            return (last?.innerText || last?.textContent || "").trim();
        },
    };

    function getChatGPTAssistantElement() {
        const selectors = [
            '[data-message-author-role="assistant"] .markdown',
            '[data-message-author-role="assistant"] .prose',
            '[data-message-author-role="assistant"]',
            'article[data-testid^="conversation-turn"] [data-message-author-role="assistant"]',
        ];
        for (const sel of selectors) {
            const msgs = [...document.querySelectorAll(sel)];
            if (msgs.length) return msgs[msgs.length - 1];
        }
        return null;
    }

    function getDoubaoAssistantElement() {
        const msgs = [...document.querySelectorAll('[class*="flow-markdown-body"]')];
        return msgs[msgs.length - 1] || null;
    }

    function isVisibleElement(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function getActionButtonsNearContent(contentEl, minCount = 1, maxDistance = 120) {
        if (!contentEl || !isVisibleElement(contentEl)) return [];
        const contentRect = contentEl.getBoundingClientRect();
        let scope = contentEl;
        for (let depth = 0; depth < 6 && scope; depth++, scope = scope.parentElement) {
            const buttons = [...scope.querySelectorAll("button, [role='button']")].filter(el => {
                if (!(el instanceof HTMLElement) || !isVisibleElement(el)) return false;
                if (contentEl.contains(el)) return false;
                const rect = el.getBoundingClientRect();
                const isBelowContent = rect.top >= contentRect.bottom - 24 && rect.top <= contentRect.bottom + maxDistance;
                const overlapsHorizontally = rect.right >= contentRect.left - 32 && rect.left <= contentRect.right + 32;
                return isBelowContent && overlapsHorizontally;
            });
            if (buttons.length >= minCount) return buttons;
        }
        return [];
    }

    // 返回 true = 仍在生成中；false = 已完成
    const STREAMING_INDICATORS = {
        // ChatGPT：最后一条 assistant 消息下方出现操作按钮（复制/点赞/…）即为完成
        ChatGPT: () => {
            const last = getChatGPTAssistantElement();
            if (!last) return true;
            const article = last.closest('article') || last.parentElement;
            // 操作按钮栏出现 = 完成
            const actionBar = article?.querySelector(
                'button[data-testid="copy-turn-action-button"], button[aria-label="Copy"], button[aria-label*="thumb"], [class*="action"] button'
            );
            if (actionBar) return false;
            return getActionButtonsNearContent(last, 2).length === 0; // 没有操作按钮 = 还在生成
        },
        DeepSeek: () => !!document.querySelector('.stop-btn, [class*="stop"]'),
        Doubao: () => {
            const last = getDoubaoAssistantElement();
            if (last && getActionButtonsNearContent(last, 4).length >= 4) return false;
            return document.querySelector('.send-btn-wrapper button')?.getAttribute('data-disabled') === 'true';
        },
        Kimi: () => document.querySelector('.send-button-container svg')?.getAttribute('name') === 'Stop',
        Qwen: () => !!document.querySelector('button[aria-label*="停止"]'),
    };

    function startDOMExtractor(taskId) {
        const extract = DOM_EXTRACTORS[AI];
        if (!extract) return null;
        const isStreaming = STREAMING_INDICATORS[AI] || (() => false);

        // 快照：记录发送前最后一条 assistant 消息的文字，避免误读旧回复
        const snapshotText = extract();
        dbg("DOM extractor snapshot len:", snapshotText.length);

        let lastText = "";
        let stableMs = 0;
        let foundNew = false;          // 是否已检测到新回复开始生成
        const STABLE_DONE = 3000;
        const INTERVAL = 400;

        dbg("DOM extractor started for", AI, taskId);
        showStatus("等待 AI 回复…", "#0f172a");

        const timer = setInterval(async () => {
            if (!activeTask || activeTask.id !== taskId) {
                clearInterval(timer);
                return;
            }
            const text = extract();

            // 等待新回复出现：文字和快照不同
            if (!foundNew) {
                if (!text || text === snapshotText) return;
                const streaming = isStreaming();
                if (streaming) {
                    // 正在生成中，确认是新回复
                    foundNew = true;
                    lastText = "";
                    dbg("new response detected (streaming), text len:", text.length);
                } else {
                    // 操作按钮已出现，响应可能已快速完成
                    // 如果文字长度有实质性变化，认为是新的完整回复
                    if (Math.abs(text.length - snapshotText.length) > 20 || text.length > 100) {
                        clearInterval(timer);
                        dbg("new response detected (already done), len:", text.length);
                        showStatus("✅ 完成，推送给 Zotero…", "#16a34a");
                        if (activeTask && activeTask.id === taskId) {
                            await finishTask(taskId, text, "");
                        }
                        return;
                    }
                    // 变化太小，可能是上一条懒加载，继续等待
                    return;
                }
            }

            if (text !== lastText) {
                lastText = text;
                stableMs = 0;
                showStatus("提取中… " + text.length + " 字", "#0369a1");
                if (text !== activeTask.lastText) {
                    activeTask.lastText = text;
                    const r = await serverRequest("POST", "/push", {
                        taskId,
                        text,
                        done: false,
                        error: "",
                        ...getWorkerContext(),
                    });
                    if (!r) showStatus("⚠️ 推送失败（网络/认证）", "#dc2626");
                }
                return;
            }

            // 文本未变：检查是否已完成（操作按钮出现 = 完成）
            stableMs += INTERVAL;
            const done = !isStreaming();
            if (done || stableMs >= STABLE_DONE) {
                clearInterval(timer);
                dbg("DOM extractor done, len:", text.length, "byActionBar:", done);
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
            if (done) {
                const finalText = mergeText(activeTask.lastText || "", state.text || "");
                if (hasMeaningfulText(finalText)) {
                    await pushTaskText(taskId, finalText, true);
                } else {
                    dbg("fetch stream ended without text, waiting for DOM extractor:", taskId, response.url);
                }
                return;
            }
            const chunk = decoder.decode(value, { stream: true });
            state.allText += chunk;
            try { state.extract.call(state, chunk, state.allText); await pushTaskText(taskId, state.text, false); } catch (_e) { /**/ }
            read();
        }).catch(async (error) => {
            const msg = String(error?.name || error || "");
            if (msg.includes("AbortError") || msg.includes("abort") || msg.includes("cancel")) return;
            if (activeTask && activeTask.id === taskId) {
                const finalText = mergeText(activeTask.lastText || "", state.text || "");
                if (hasMeaningfulText(finalText)) {
                    await finishTask(taskId, finalText, "");
                } else {
                    dbg("fetch stream error without text, waiting for DOM extractor:", taskId, response.url, msg);
                }
            }
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
                    if (this.readyState === 4) {
                        const finalText = mergeText(activeTask.lastText || "", state.text || "");
                        if (hasMeaningfulText(finalText)) {
                            await pushTaskText(taskId, finalText, true);
                        } else {
                            dbg("xhr stream ended without text, waiting for DOM extractor:", taskId, url);
                        }
                    } else {
                        await pushTaskText(taskId, state.text, false);
                    }
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
            el.focus();
            // execCommand 方式：触发真实浏览器事件，React/Lexical 均可捕获
            let ok = false;
            try {
                document.execCommand("selectAll", false, null);
                ok = document.execCommand("insertText", false, text);
            } catch (_e) { /**/ }
            if (!ok) {
                // 回退：直接设置 textContent（不用 innerHTML 以避免论文中 <> 字符污染）
                el.textContent = text;
            }
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

    function submitByEnter(el) {
        if (!el) return false;
        try { el.focus(); } catch (_e) { /**/ }
        const eventInit = {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
        };
        try {
            el.dispatchEvent(new KeyboardEvent("keydown", eventInit));
            el.dispatchEvent(new KeyboardEvent("keypress", eventInit));
            el.dispatchEvent(new KeyboardEvent("keyup", eventInit));
            return true;
        } catch (_e) {
            return false;
        }
    }

    async function waitForResponseStart(ai, snapshotText, beforeThreadId, timeoutMs = 5000) {
        const extract = DOM_EXTRACTORS[ai];
        const deadline = Date.now() + timeoutMs;
        while (Date.now() < deadline) {
            await sleep(200);
            const currentThreadId = getCurrentThreadId();
            if (beforeThreadId && currentThreadId && currentThreadId !== beforeThreadId) {
                dbg("response start detected by thread change:", beforeThreadId, "→", currentThreadId);
                return true;
            }
            if (extract) {
                const text = String(extract() || "");
                if (text && text !== snapshotText && (Math.abs(text.length - snapshotText.length) > 8 || text.length > snapshotText.length)) {
                    dbg("response start detected by DOM delta, len:", text.length);
                    return true;
                }
            }
        }
        return false;
    }

    function buildTaskInput(task) {
        if (!task) return "";
        if ((task.kind || "prompt") !== "chat") {
            return String(task.prompt || task.message || "").trim();
        }

        const message = String(task.message || "").trim();
        const paperContext = String(task.paperContext || "").trim();
        if (!paperContext) return message;

        return [
            "以下是当前论文的上下文信息，请在相关时基于这些信息回答；如果上下文不足，请明确说明。",
            "",
            "[论文上下文]",
            paperContext,
            "",
            "[用户问题]",
            message,
        ].join("\n");
    }

    async function sendToAI(prompt) {
        try { unsafeWindow.focus(); } catch (_e) { /**/ }
        await sleep(300);
        const adapters = {
            DeepSeek: async () => { const el = document.querySelector("textarea"); if (!el) return false; reactSet(el, prompt); await sleep(200); return clickFirst(["button[type=submit]", "button[aria-label*='发送']", "._7436101"]); },
            Doubao: async () => {
                const el = document.querySelector('textarea.semi-input-textarea')
                    || document.querySelector('textarea');
                if (!el) return false;
                if (!reactSet(el, prompt)) return false;
                await sleep(prompt.length > 3000 ? 600 : 250);
                return clickFirst([
                    '.send-btn-wrapper button',
                    'button[aria-label*="发送"]',
                    'button[title*="发送"]',
                ]);
            },
            ChatGPT: async () => {
                const el = document.querySelector("#prompt-textarea");
                if (!el) return false;
                const beforeThreadId = getCurrentThreadId();
                const beforeText = (DOM_EXTRACTORS.ChatGPT?.() || "").trim();
                dispatchInput(el, prompt);
                // 长提示词（如含全文的 Ask PDF）需要更多时间让 React 更新状态
                await sleep(prompt.length > 3000 ? 600 : 250);
                const clicked = clickFirst(['[data-testid="send-button"]', 'button[aria-label*="Send"]', 'button[aria-label*="send"]']);
                if (clicked) return true;
                const entered = submitByEnter(el);
                if (entered) {
                    const started = await waitForResponseStart("ChatGPT", beforeText, beforeThreadId, 5000);
                    if (started) return true;
                }
                return waitForResponseStart("ChatGPT", beforeText, beforeThreadId, 2500);
            },
            Claude: async () => { const el = document.querySelector('[contenteditable="true"][data-testid*="input"]') || document.querySelector('[contenteditable="true"]'); if (!el) return false; dispatchInput(el, prompt); await sleep(200); return clickFirst(["button[aria-label='Send message']", "button[type=submit]"]); },
            Kimi: async () => {
                const ok = await setLexical(prompt);
                if (!ok) { const el = document.querySelector('[contenteditable="true"]'); if (!el) return false; dispatchInput(el, prompt); }
                await sleep(200);
                return clickFirst([".send-button-container", ".send-button", "button[type=submit]"]);
            },
            Yuanbao: async () => { const el = document.querySelector(".chat-input-editor .ql-editor") || document.querySelector('[contenteditable="true"]'); if (!el) return false; dispatchInput(el, prompt); await sleep(200); return clickFirst([".icon-send", "button[type=submit]"]); },
            Qwen: async () => {
                // www.qianwen.com — contenteditable with React fiber (no textarea)
                const ceEl = document.querySelector('div[contenteditable="true"]');
                if (ceEl) {
                    ceEl.focus();
                    document.execCommand('selectAll', false, null);
                    document.execCommand('insertText', false, prompt);
                    const propsKey = Object.keys(ceEl).find(k => k.startsWith('__reactProps'));
                    const props = propsKey ? ceEl[propsKey] : null;
                    if (props?.onInput) props.onInput({ target: ceEl, currentTarget: ceEl, nativeEvent: new InputEvent('input') });
                    ceEl.dispatchEvent(new InputEvent('input', { bubbles: true }));
                    await sleep(prompt.length > 3000 ? 600 : 300);
                    return clickFirst(['button[aria-label="发送消息"]', 'button.send-button', 'button[type=submit]']);
                }
                // chat.qwen.ai — textarea
                const el = document.querySelector('textarea.message-input-textarea') || document.querySelector('textarea');
                if (!el) return false;
                reactSet(el, prompt);
                await sleep(prompt.length > 3000 ? 600 : 200);
                return clickFirst(['button.send-button', '#send-message-button', 'button[type=submit]']);
            },
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
            try { const p = decodeJWTPayload(userToken); tokenInfo = "已登录 (sub:" + p.sub + ")"; } catch (_e) { tokenInfo = "已登录"; }
        }
        window.alert([
            "平台: " + AI,
            "脚本: " + SCRIPT_VERSION,
            "账号: " + tokenInfo,
            "运行: " + (isRunning ? "是" : "否"),
            "任务: " + (activeTask?.id || "空闲"),
            "会话: " + getWorkerSessionId(),
            "线程: " + (getCurrentThreadId() || "未识别"),
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
            const taskInput = buildTaskInput(task);
            const newTask = {
                id: task.id,
                prompt: taskInput,
                kind: task.kind || "prompt",
                preferredSessionId: task.preferredSessionId || "",
                preferredThreadId: task.preferredThreadId || "",
                expiresAt: Number(task.expiresAt || 0),
                lastText: "",
                startedAt: Date.now(),
                reader: null,
                timeout: null,
                finishRetryTimer: null,
                finishInFlight: false,
                pendingFinish: null
            };
            const taskTimeoutMs = getTaskTimeoutMs(newTask);
            newTask.timeout = setTimeout(() => {
                if (activeTask && activeTask.id === newTask.id) {
                    dbg("task timeout:", newTask.id);
                    const text = activeTask.lastText || "";
                    finishTask(newTask.id, text, "").catch(() => {});
                }
            }, taskTimeoutMs);
            activeTask = newTask;
            const contextReady = await waitForPreferredContext(newTask);
            if (!contextReady) {
                showStatus("❌ 未回到绑定对话，任务取消", "#dc2626");
                await finishTask(task.id, "", "当前页面不是绑定的会话/线程，请切回原对话后重试");
                continue;
            }
            dbg(
                "task:", task.id,
                "kind:", newTask.kind,
                "platform:", AI,
                "session:", getWorkerSessionId(),
                "thread:", getCurrentThreadId() || "-",
                "preferredSession:", newTask.preferredSessionId || "-",
                "preferredThread:", newTask.preferredThreadId || "-",
                "timeoutMs:", taskTimeoutMs,
                "prompt len:", taskInput.length
            );
            showStatus("收到任务，发送中…", "#7c3aed");
            const ok = await sendToAI(taskInput);
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
