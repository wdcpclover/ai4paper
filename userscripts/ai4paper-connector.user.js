// ==UserScript==
// @name         AI4Paper Connector
// @description  AI4Paper 浏览器联动脚本，支持 DeepSeek / 豆包 / ChatGPT / Claude / 通义 / Kimi 等
// @namespace    https://ai4paper.pro
// @version      1.2.9
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

(function () {
    'use strict';

    var BUNDLE_URL = 'https://ai4paper.pro/api/connector/bundle';
    var LOGIN_URL  = 'https://ai4paper.pro/api/user/login';
    var TOKEN_KEY  = 'ai4paper.userToken';

    function getToken() { return GM_getValue(TOKEN_KEY, ''); }
    function setToken(t) { GM_setValue(TOKEN_KEY, t); }

    function decodeJwtPayload(t) {
        var raw = String(t || '').split('.')[1] || '';
        if (!raw) throw new Error('missing jwt payload');
        var normalized = raw.replace(/-/g, '+').replace(/_/g, '/');
        var padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
        return JSON.parse(atob(padded));
    }

    function isExpired(t) {
        try {
            var p = decodeJwtPayload(t);
            return Date.now() / 1000 > p.exp - 60;
        } catch (e) { return true; }
    }

    function fetchBundle(token) {
        return new Promise(function (resolve) {
            var headers = {};
            if (token) headers['Authorization'] = 'Bearer ' + token;
            GM_xmlhttpRequest({
                method: 'GET',
                url: BUNDLE_URL,
                headers: headers,
                nocache: true,
                anonymous: true,
                timeout: 15000,
                onload: function (r) { resolve(r); },
                onerror: function () { resolve({ status: 0 }); },
                ontimeout: function () { resolve({ status: 0 }); },
            });
        });
    }

    function showLoginDialog() {
        return new Promise(function (resolve) {
            if (document.getElementById('a4p-lo')) return;
            GM_addStyle(
                '#a4p-lo{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
                '#a4p-lb{background:#fff;border-radius:12px;padding:32px 28px;width:320px;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;gap:12px;position:relative}' +
                '#a4p-lb h2{margin:0;font-size:17px;font-weight:700;color:#111}' +
                '#a4p-lb p{margin:0;font-size:13px;color:#666;line-height:1.5}' +
                '#a4p-lb input{width:100%;box-sizing:border-box;padding:9px 12px;border:1px solid #d1d5db;border-radius:7px;font-size:14px;outline:none}' +
                '#a4p-lb input:focus{border-color:#6366f1;box-shadow:0 0 0 2px rgba(99,102,241,.15)}' +
                '#a4p-ok{background:#6366f1;color:#fff;border:none;border-radius:7px;padding:10px;font-size:14px;font-weight:600;cursor:pointer}' +
                '#a4p-ok:hover{background:#4f46e5}' +
                '#a4p-ok:disabled{background:#a5b4fc;cursor:not-allowed}' +
                '#a4p-err{color:#ef4444;font-size:13px;display:none}' +
                '#a4p-x{position:absolute;top:10px;right:14px;cursor:pointer;font-size:20px;color:#9ca3af;background:none;border:none}'
            );
            var el = document.createElement('div');
            el.id = 'a4p-lo';
            el.innerHTML = '<div id="a4p-lb"><button id="a4p-x" title="关闭">✕</button><h2>🔗 AI4Paper 登录</h2><p>登录后即可使用 Connector 将 Zotero 任务发送到 AI。</p><input id="a4p-em" type="email" placeholder="邮箱" /><input id="a4p-pw" type="password" placeholder="密码" /><div id="a4p-err"></div><button id="a4p-ok">登录</button></div>';
            document.documentElement.appendChild(el);

            var emEl = el.querySelector('#a4p-em');
            var pwEl = el.querySelector('#a4p-pw');
            var btnEl = el.querySelector('#a4p-ok');
            var errEl = el.querySelector('#a4p-err');

            function close(token) { el.remove(); resolve(token || null); }

            el.querySelector('#a4p-x').onclick = function () { close(null); };
            el.onclick = function (e) { if (e.target === el) close(null); };

            function doLogin() {
                var email = emEl.value.trim();
                var pass  = pwEl.value;
                if (!email || !pass) { showErr('请填写邮箱和密码'); return; }
                btnEl.disabled = true;
                btnEl.textContent = '登录中…';
                errEl.style.display = 'none';
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: LOGIN_URL,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({ email: email, password: pass }),
                    timeout: 15000,
                    onload: function (resp) {
                        var data = {};
                        try { data = JSON.parse(resp.responseText); } catch (e) {}
                        if (resp.status === 200 && data.access_token) {
                            setToken(data.access_token);
                            close(data.access_token);
                        } else {
                            showErr(data.detail || '登录失败，请检查邮箱和密码');
                            btnEl.disabled = false;
                            btnEl.textContent = '登录';
                        }
                    },
                    onerror: function () { showErr('网络错误，请重试'); btnEl.disabled = false; btnEl.textContent = '登录'; },
                    ontimeout: function () { showErr('请求超时，请重试'); btnEl.disabled = false; btnEl.textContent = '登录'; },
                });
            }

            function showErr(msg) { errEl.textContent = msg; errEl.style.display = 'block'; }
            btnEl.onclick = doLogin;
            pwEl.onkeydown = function (e) { if (e.key === 'Enter') doLogin(); };
            emEl.onkeydown = function (e) { if (e.key === 'Enter') pwEl.focus(); };
            setTimeout(function () { emEl.focus(); }, 100);
        });
    }

    async function run() {
        var token = getToken();
        if (token && isExpired(token)) { token = ''; setToken(''); }

        var resp = await fetchBundle(token);

        if (resp.status === 401) {
            token = await showLoginDialog();
            if (!token) return;
            resp = await fetchBundle(token);
        }

        if (resp.status === 200) {
            try { eval(resp.responseText); } catch (e) { console.error('[AI4Paper]', e); }
        } else {
            console.warn('[AI4Paper Connector] load failed:', resp.status);
        }
    }

    run();
})();
