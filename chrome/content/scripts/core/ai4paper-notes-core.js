"use strict";
var AI4PaperNotesCore = (() => {
    const CARD_NOTES_HISTORY_SEPARATOR = "😊🎈🍓";
    const USER_NOTES_SEPARATOR_DEFAULT = "👣➿👣";
    const USER_NOTES_SEPARATOR_LEGACY = "%--------------ω--------------%";
    const CHATGPT_USER_PLACEHOLDER = "XnFofCLyZaTe";
    const CHATGPT_ASSISTANT_PLACEHOLDER = "ipNoOlrWjHQh";
    const AI_READING_PLACEHOLDER = "QUOsNavFRihJ";
    const BASE_COLORS = {
        yellow: "#ffd400",
        red: "#ff6666",
        green: "#5fb236",
        blue: "#2ea8e5",
        purple: "#a28ae5",
        magenta: "#e56eee",
        orange: "#f19837",
        gray: "#aaaaaa"
    };
    const COLOR_KEYS = Object.keys(BASE_COLORS);
    const WEB_SEARCH_URL_BUILDERS = {
        metaso: (query) => `https://metaso.cn/?q=${encodeURIComponent(query)}`,
        google: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        googlescholar: (query) => `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
        scihub: (query) => `https://sci-hub.ren/${encodeURIComponent(query)}`
    };
    function formatItemNotes(html) {
        return html
            .replace(/&gt;&gt;&gt;&gt;&gt;&gt;&gt;/g, "")
            .replace(/>>>>>>>/g, "")
            .replace(/\\\*/g, "*")
            .replace(/\\#/g, "#")
            .replace(/\\-/g, "-")
            .replace(/jbslqn/g, "<sup>")
            .replace(/jbsrqn/g, "</sup>")
            .replace(/jbxlqn/g, "<sub>")
            .replace(/jbxrqn/g, "</sub>");
    }
    function normalizeTransparencyValue(baseColor, value) {
        const parsed = Number.parseInt(String(value ?? ""), 10);
        if (Number.isNaN(parsed) || parsed < 1 || parsed > 99) {
            return baseColor;
        }
        return `${baseColor}${String(parsed).padStart(2, "0")}`;
    }
    function replaceAll(source, from, to) {
        return source.split(from).join(to);
    }
    function normalizeCardNotesSearchQuery(value, placeholder) {
        const query = String(value ?? "").trim();
        if (query !== "") {
            return query;
        }
        return String(placeholder ?? "").trim();
    }
    function normalizeSection(section) {
        return typeof section === "string" ? section : "";
    }
    function extractReversedBlockquotes(noteHTML) {
        const startPositions = [];
        const endPositions = [];
        const startRegex = new RegExp("<blockquote>", "g");
        const endRegex = new RegExp("</blockquote>", "g");
        while (startRegex.exec(noteHTML) != null && endRegex.exec(noteHTML) != null) {
            startPositions.push(startRegex.lastIndex);
            endPositions.push(endRegex.lastIndex);
        }
        const reversed = [];
        for (let i = 0; i < endPositions.length; i++) {
            reversed.push(noteHTML.substring(startPositions[startPositions.length - i - 1] - 12, endPositions[endPositions.length - i - 1]));
        }
        return reversed;
    }
    function getMarkerPositions(noteHTML, marker) {
        const positions = [];
        const regex = new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
        while (regex.exec(noteHTML) != null) {
            positions.push(regex.lastIndex);
        }
        return positions;
    }
    function extractNotesByMarker(noteHTML, marker) {
        const positions = getMarkerPositions(noteHTML, marker);
        if (positions.length !== 2) {
            return false;
        }
        return noteHTML.substring(positions[0] - marker.length, positions[1]);
    }
    function setNotesTransparency(html, config) {
        let nextHtml = html;
        for (const colorKey of COLOR_KEYS) {
            const baseColor = BASE_COLORS[colorKey];
            nextHtml = replaceAll(nextHtml, `background-color: ${baseColor}80`, `background-color: ${baseColor}`);
        }
        for (const colorKey of COLOR_KEYS) {
            const baseColor = BASE_COLORS[colorKey];
            const targetColor = normalizeTransparencyValue(baseColor, config[colorKey]);
            if (targetColor !== baseColor) {
                nextHtml = replaceAll(nextHtml, `background-color: ${baseColor}`, `background-color: ${targetColor}`);
            }
        }
        return nextHtml;
    }
    function getUserNotes(noteHTML, preferDefaultSeparator) {
        const primaryMarker = preferDefaultSeparator ? USER_NOTES_SEPARATOR_DEFAULT : USER_NOTES_SEPARATOR_LEGACY;
        const fallbackMarker = preferDefaultSeparator ? USER_NOTES_SEPARATOR_LEGACY : USER_NOTES_SEPARATOR_DEFAULT;
        const normalizedMarker = preferDefaultSeparator ? USER_NOTES_SEPARATOR_DEFAULT : USER_NOTES_SEPARATOR_LEGACY;
        const primaryResult = extractNotesByMarker(noteHTML, primaryMarker);
        if (primaryResult !== false) {
            return primaryResult;
        }
        const fallbackResult = extractNotesByMarker(noteHTML, fallbackMarker);
        if (fallbackResult === false) {
            return false;
        }
        return replaceAll(fallbackResult, fallbackMarker, normalizedMarker);
    }
    function updateCardNotesSearchHistory(historyStr, searchText, maxItems = 20) {
        let history = String(historyStr ?? "").split(CARD_NOTES_HISTORY_SEPARATOR);
        if (!history.includes(searchText)) {
            if (history.length === 1 && history[0] === "") {
                history = [searchText];
            }
            else {
                history.unshift(searchText);
            }
        }
        else {
            const idx = history.indexOf(searchText);
            history.splice(idx, 1);
            history.unshift(searchText);
        }
        const trimmed = [];
        for (let i = 0; i < maxItems; i++) {
            if (history[i] !== undefined) {
                trimmed.push(history[i]);
            }
        }
        return trimmed.join(CARD_NOTES_HISTORY_SEPARATOR);
    }
    function removeVocabularyCodeTags(html) {
        return html.replace(/<code>/g, "").replace(/<\/code>/g, "");
    }
    function prepareChatGPTHTML(html) {
        return html
            .replace(/<span class="chatgpt">🙋<\/span>/g, CHATGPT_USER_PLACEHOLDER)
            .replace(/<span class="chatgpt">🤖<\/span>/g, CHATGPT_ASSISTANT_PLACEHOLDER);
    }
    function restoreChatGPTMarkdown(markdown) {
        return markdown
            .replace(new RegExp(CHATGPT_USER_PLACEHOLDER, "g"), "<span class=\"chatgpt\">🙋</span>")
            .replace(new RegExp(CHATGPT_ASSISTANT_PLACEHOLDER, "g"), "<span class=\"chatgpt\">🤖</span>")
            .replace(/> 🙋\n/g, "> <span class=\"chatgpt\">🙋</span>\n")
            .replace(/> 🤖\n/g, "> <span class=\"chatgpt\">🤖</span>\n");
    }
    function prepareAIReadingHTML(html) {
        return html.replace(/<span class="AIReading">🤖 AI 解读，快人一步<\/span>/g, AI_READING_PLACEHOLDER);
    }
    function restoreAIReadingMarkdown(markdown) {
        return markdown
            .replace(new RegExp(AI_READING_PLACEHOLDER, "g"), "<span class=\"AIReading\">🤖 AI 解读，快人一步</span>")
            .replace(/> 🤖 AI 解读，快人一步\n/g, "> <span class=\"AIReading\">🤖 AI 解读，快人一步</span>\n");
    }
    function finalizeCombinedMarkdown(markdown) {
        return markdown
            .replace(/WBAWSSPANswoMT/g, "</span>")
            .replace(/WBAWSPANNswoMT/g, "<span>")
            .replace(/WBAWSPANswoMT/g, "<span")
            .replace(/WBAWIMAGEswoMT/g, "<img");
    }
    function combineItemNotesMarkdown(sections) {
        const values = [
            normalizeSection(sections.annotations),
            normalizeSection(sections.vocabulary),
            normalizeSection(sections.translation),
            normalizeSection(sections.chatGPT),
            normalizeSection(sections.aiReading)
        ].filter(Boolean);
        if (!values.length) {
            return "";
        }
        return finalizeCombinedMarkdown(values.join("\n\n"));
    }
    function getTransForwardHTML(noteHTML) {
        if (!noteHTML.includes("📑 翻译倒序")) {
            return noteHTML;
        }
        return "<h2 style=\"color: blue;\">📑 翻译正序>>>>>>></h2>" + extractReversedBlockquotes(noteHTML).join("");
    }
    function getChatGPTForwardHTML(noteHTML, buildBlockKey) {
        if (!noteHTML.includes("🤖️ ChatGPT 倒序")) {
            return noteHTML;
        }
        const header = "<blockquote><span style=\"font-size: 15px;color: gray\">📍 ChatGPT 对话记录</span></blockquote>^KEYgptNotes";
        const reversed = extractReversedBlockquotes(noteHTML).map(block => `${block}<p>${buildBlockKey(block)}`);
        return "<h2 style=\"color: blue;\">🤖️ ChatGPT 正序>>>>>>></h2>" + header + reversed.join("");
    }
    function buildCardNotesSearchUrl(engine, query) {
        if (!(engine in WEB_SEARCH_URL_BUILDERS)) {
            return null;
        }
        return WEB_SEARCH_URL_BUILDERS[engine](query);
    }
    return {
        buildCardNotesSearchUrl,
        combineItemNotesMarkdown,
        formatItemNotes,
        getChatGPTForwardHTML,
        getTransForwardHTML,
        getUserNotes,
        normalizeCardNotesSearchQuery,
        prepareAIReadingHTML,
        prepareChatGPTHTML,
        removeVocabularyCodeTags,
        restoreAIReadingMarkdown,
        restoreChatGPTMarkdown,
        setNotesTransparency,
        updateCardNotesSearchHistory
    };
})();
