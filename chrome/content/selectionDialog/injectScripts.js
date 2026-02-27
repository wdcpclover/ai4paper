var injectScriptsMethods = {
  'init': function () {
    this.injectCryptoJS();
    this.injectRenderingFunc();
    this.injectCalculateTokens();
  },
  'injectCryptoJS': function () {
    try {
      Zotero.ZoteroIF._CryptoJS = CryptoJS;
    } catch (_0x2f4483) {
      Zotero.debug(_0x2f4483);
    }
  },
  'injectRenderingFunc': function () {
    try {
      !Zotero.ZoteroIF.renderMarkdownLaTeX && (Zotero.ZoteroIF.renderMarkdownLaTeX = function (param1) {
        try {
          const _0x185e1c = markdownit({
            'html': true,
            'highlight': function (param2, param3) {
              if (param3 && hljs.getLanguage(param3)) {
                try {
                  return "<pre class=\"hljs\"><code>" + hljs.highlight(param2, {
                    'language': param3,
                    'ignoreIllegals': true
                  }).value + '</code></pre>';
                } catch (_0x34d645) {}
              }
              return "<pre class=\"hljs\"><code>" + _0x185e1c.utils.escapeHtml(param2) + "</code></pre>";
            }
          }).use(texmath, {
            'engine': katex,
            'delimiters': ["dollars", 'brackets', "doxygen", 'gitlab', 'julia', "kramdown", "beg_end"],
            'katexOptions': {
              'macros': {
                '\x5cRR': "\\mathbb{R}"
              }
            }
          });
          return _0x185e1c.render(param1);
        } catch (_0x395fc7) {
          return param1;
        }
      });
      !Zotero.ZoteroIF.renderMarkdown && (Zotero.ZoteroIF.renderMarkdown = function (param4) {
        try {
          const _0x253b3f = markdownit({
            'html': true,
            'highlight': function (param5, param6) {
              if (param6 && hljs.getLanguage(param6)) {
                try {
                  return "<pre class=\"hljs\"><code>" + hljs.highlight(param5, {
                    'language': param6,
                    'ignoreIllegals': true
                  }).value + "</code></pre>";
                } catch (_0x3c47a5) {}
              }
              return "<pre class=\"hljs\"><code>" + _0x253b3f.utils.escapeHtml(param5) + "</code></pre>";
            }
          });
          return _0x253b3f.render(param4);
        } catch (_0x39fee4) {
          return param4;
        }
      });
      !Zotero.ZoteroIF.highlightAll && (Zotero.ZoteroIF.highlightAll = function () {
        hljs.highlightAll();
      });
    } catch (_0x50eeab) {
      Zotero.debug(_0x50eeab);
    }
  },
  'injectCalculateTokens': function () {
    try {
      const {
        encode: _0x26a341,
        decode: _0x4eed09
      } = GPTTokenizer_cl100k_base;
      Zotero.ZoteroIF._calculateTokens = _0x26a341;
    } catch (_0x1a9a63) {
      Zotero.debug(_0x1a9a63);
    }
  }
};