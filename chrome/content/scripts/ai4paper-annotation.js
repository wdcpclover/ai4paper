// ai4paper-annotation.js - Annotation/PDF-annotation infrastructure module
// Extracted from ai4paper.js (Phase 10)

Object.assign(Zotero.AI4Paper, {

  // === Block A+B: Item Annotations + Blockquote + Head ===
  'getItemAnnotations': async function (param203) {
    let var1759 = '紧凑型';
    if (Zotero.Prefs.get("ai4paper.autoannotationsnotelineheight") === "宽松型") {
      var1759 = "宽松型";
    } else {
      var1759 = "紧凑型";
    }
    let var1760 = '';
    if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '紫色') {
      var1760 = "#a28ae5";
    } else {
      if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '黄色') var1760 = "#ffd400";else {
        if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '红色') var1760 = '#ff6666';else {
          if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '绿色') {
            var1760 = "#5fb236";
          } else {
            if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '蓝色') {
              var1760 = '#2ea8e5';
            } else {
              if (Zotero.Prefs.get('ai4paper.annotationcolorselect') === "洋红色") var1760 = "#e56eee";else {
                if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '橘色') var1760 = "#f19837";else Zotero.Prefs.get("ai4paper.annotationcolorselect") === '灰色' && (var1760 = "#aaaaaa");
              }
            }
          }
        }
      }
    }
    let var1761 = '',
      var1762 = '';
    if (['黄色', "黄色（高亮）", "黄色（下划线与文本）"].includes(Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded"))) {
      var1761 = "#ffd400";
      if (!['黄色（下划线与文本）'].includes(Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded"))) var1762 = 'highlight';
    } else {
      if (['红色', "红色（高亮）", "红色（下划线与文本）"].includes(Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded"))) {
        var1761 = "#ff6666";
        if (!["红色（下划线与文本）"].includes(Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded'))) var1762 = "highlight";
      } else {
        if (['绿色', "绿色（高亮）", "绿色（下划线与文本）"].includes(Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded"))) {
          var1761 = "#5fb236";
          if (!["绿色（下划线与文本）"].includes(Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded"))) var1762 = 'highlight';
        } else {
          if (['蓝色', "蓝色（高亮）", "蓝色（下划线与文本）"].includes(Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded"))) {
            var1761 = "#2ea8e5";
            if (!["蓝色（下划线与文本）"].includes(Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded'))) var1762 = "highlight";
          } else {
            if (['紫色', '紫色（高亮）', '紫色（下划线与文本）'].includes(Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded'))) {
              var1761 = '#a28ae5';
              if (!["紫色（下划线与文本）"].includes(Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded"))) var1762 = "highlight";
            } else {
              if (["洋红色", "洋红色（高亮）", "洋红色（下划线与文本）"].includes(Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded'))) {
                var1761 = "#e56eee";
                if (!["洋红色（下划线与文本）"].includes(Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded"))) var1762 = "highlight";
              } else {
                if (['橘色', "橘色（高亮）", '橘色（下划线与文本）'].includes(Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded'))) {
                  var1761 = '#f19837';
                  if (!['橘色（下划线与文本）'].includes(Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded"))) var1762 = "highlight";
                } else {
                  if (['灰色', "灰色（高亮）", "灰色（下划线与文本）"].includes(Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded'))) {
                    var1761 = "#aaaaaa";
                    if (!["灰色（下划线与文本）"].includes(Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded"))) var1762 = 'highlight';
                  }
                }
              }
            }
          }
        }
      }
    }
    if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "黄色（下划线）") {
      var1761 = "#ffd400";
      var1762 = 'underline';
    } else {
      if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "红色（下划线）") {
        var1761 = '#ff6666';
        var1762 = 'underline';
      } else {
        if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "绿色（下划线）") {
          var1761 = '#5fb236';
          var1762 = "underline";
        } else {
          if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "蓝色（下划线）") {
            var1761 = "#2ea8e5";
            var1762 = "underline";
          } else {
            if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "紫色（下划线）") {
              var1761 = '#a28ae5';
              var1762 = "underline";
            } else {
              if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "洋红色（下划线）") {
                var1761 = "#e56eee";
                var1762 = 'underline';
              } else {
                if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "橘色（下划线）") {
                  var1761 = "#f19837";
                  var1762 = "underline";
                } else Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '灰色（下划线）' && (var1761 = "#aaaaaa", var1762 = "underline");
              }
            }
          }
        }
      }
    }
    let var1763 = "500px";
    if (Zotero.Prefs.get("ai4paper.autoannotationsnoteimagewidth") === "600px") var1763 = '600px';else {
      if (Zotero.Prefs.get('ai4paper.autoannotationsnoteimagewidth') === "700px") var1763 = "700px";else Zotero.Prefs.get("ai4paper.autoannotationsnoteimagewidth") === "800px" && (var1763 = '800px');
    }
    let var1764 = [],
      var1765 = [],
      var1766 = param203.getAttachments();
    for (let var1767 of var1766) {
      let _0x3ccf4b = Zotero.Items.get(var1767),
        _0x447fba = [],
        _0x2cb4db = [],
        _0x4c2603 = [],
        _0x553bef = '';
      if (param203 != undefined) {
        var var1773 = param203.getField("title"),
          var1774 = Zotero.Date.strToDate(param203.getField("date", false, true)).year,
          var1775 = '',
          var1776 = '';
        var1776 = var1774 ? var1774 + ',\x20' : '';
        if (param203.getCreators().length != 0x0) {
          var var1777 = param203.getCreators()[0x0].firstName,
            var1778 = param203.getCreators()[0x0].lastName,
            var1779 = '-' + var1777,
            var1780 = '-' + var1778,
            var1781 = '-' + var1778 + var1777;
          param203.getCreators().length === 0x1 ? param203.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 ? var1775 = var1778 ? var1778 + ',\x20' : '' : var1775 = var1778 ? '' + var1778 + var1777 + ',\x20' : '' : param203.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 ? var1775 = var1778 ? var1778 + " et al., " : '' : var1775 = var1778 ? '' + var1778 + var1777 + " et al., " : '';
        } else var var1779 = '',
          var1780 = '',
          var1781 = '';
      } else return false;
      let _0x1c8fc8 = "📝 注释笔记 " + _0x3ccf4b.key,
        _0x3c0075 = "📙 生词 " + _0x3ccf4b.key;
      if (param203.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1) {
        var var1784 = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + _0x3ccf4b.key + ">>>>>>></h2>" + (param203 != undefined ? "<blockquote>WBAWSPANswoMT style=\"font-size: 15px;color: gray\">📍 " + var1774 + var1780 + '-' + param203.getField("title") + "WBAWSSPANswoMT</blockquote>" : '');
      } else var var1784 = '<h2\x20style=\x22color:\x20#ff4757;\x22>📝\x20注释笔记\x20' + _0x3ccf4b.key + ">>>>>>></h2>" + (param203 != undefined ? "<blockquote>WBAWSPANswoMT style=\"font-size: 15px;color: gray\">📍 " + var1774 + var1781 + '-' + param203.getField('title') + "WBAWSSPANswoMT</blockquote>" : '');
      if (param203.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1) {
        var var1785 = '<h2\x20style=\x22color:\x20#ff4757;\x22>📙\x20生词\x20' + _0x3ccf4b.key + ">>>>>>></h2>" + (param203 != undefined ? "<blockquote>WBAWSPANswoMT style=\"font-size: 15px;color: gray\">📍 " + var1774 + var1780 + '-' + param203.getField('title') + 'WBAWSSPANswoMT</blockquote>' : '');
      } else var var1785 = "<h2 style=\"color: #ff4757;\">📙 生词 " + _0x3ccf4b.key + ">>>>>>></h2>" + (param203 != undefined ? "<blockquote>WBAWSPANswoMT style=\"font-size: 15px;color: gray\">📍 " + var1774 + var1781 + '-' + param203.getField("title") + "WBAWSSPANswoMT</blockquote>" : '');
      if (["application/pdf", "text/html", 'application/epub+zip'].includes(_0x3ccf4b.attachmentContentType)) {
        if (_0x3ccf4b.attachmentLinkMode === 0x3) continue;
        var var1786 = await _0x3ccf4b.getAnnotations().filter(_0x50ac29 => _0x50ac29.annotationType != 'ink');
        if (var1786.length) {
          for (let var1787 of var1786) {
            let var1788 = 'WBAWSPANswoMT\x20style=\x22font-size:12px;\x20color:\x20#bdbdbd\x22>' + Zotero.AI4Paper.convertAnnotationDate(var1787.dateAdded) + 'WBAWSSPANswoMT';
            if (!Zotero.Prefs.get('ai4paper.vocabularybookdisable') && var1787.annotationColor === var1760 && var1787.annotationType === "highlight") {
              let _0x28d3e3 = var1787.getTags();
              _0x4c2603 = [];
              _0x553bef = '';
              if (_0x28d3e3.length) {
                for (let var1790 of _0x28d3e3) {
                  Zotero.Prefs.get("ai4paper.nestedtags") ? (Zotero.Prefs.get("ai4paper.tagspunctuationoptimazation") && (var1790.tag = Zotero.AI4Paper.annotationTagOptimization(var1790.tag)), _0x4c2603.push("#🔠/" + var1790.tag)) : (Zotero.Prefs.get("ai4paper.tagspunctuationoptimazation") && (var1790.tag = Zotero.AI4Paper.annotationTagsOptimization(var1790.tag)), _0x4c2603.push('#' + var1790.tag));
                }
                _0x553bef = _0x4c2603.join('\x20');
              }
              let _0x255dfb = '' + var1787.annotationComment;
              if (_0x255dfb.substring(_0x255dfb.length - 0x3) === "```") {
                _0x255dfb += "<br>";
              }
              _0x255dfb = _0x255dfb.replace(/\n+/g, "<br>");
              let _0x540bce = JSON.parse(var1787.annotationPosition).pageIndex + 0x1,
                _0xa258e4 = Zotero.AI4Paper.getAnnotationItemLink(var1787),
                _0x26df02 = '\x20(<a\x20href=\x22' + _0xa258e4 + '\x22>' + var1775 + var1776 + 'p' + _0x540bce + '</a>)';
              Zotero.Prefs.get('ai4paper.cardlinkstyle') === '页码' && (_0x26df02 = " (<a href=\"" + _0xa258e4 + '\x22>p' + _0x540bce + "</a>)");
              let _0x3206cf = "<blockquote>WBAWSPANswoMT class=\"vocabulary\" style=\"background-color: " + var1787.annotationColor + '\x22>' + var1787.annotationText + "WBAWSSPANswoMT" + (var1787.annotationComment != null ? '<br>' + _0x255dfb + _0x26df02 : _0x26df02) + (_0x553bef != '' ? "<br>🏷️ " + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + var1788 : '') + "</blockquote>";
              _0x2cb4db.push(_0x3206cf);
            }
            if (!Zotero.Prefs.get('ai4paper.vocabularybookdisable') && var1787.annotationColor === var1760 && var1787.annotationType === "highlight" || var1787.annotationColor === var1761 && var1787.annotationType === var1762 || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "全部颜色（下划线）" && var1787.annotationType === "underline" || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '全部颜色（文本）' && var1787.annotationType === "text" || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "全部颜色（下划线与文本）" && (var1787.annotationType === 'underline' || var1787.annotationType === "text") || var1787.annotationColor === var1761 && (var1787.annotationType === 'underline' || var1787.annotationType === "text")) continue;else {
              let var1796 = var1787.getTags();
              _0x4c2603 = [];
              _0x553bef = '';
              if (var1796.length) {
                for (let var1797 of var1796) {
                  if (Zotero.Prefs.get("ai4paper.nestedtags")) {
                    if (Zotero.Prefs.get("ai4paper.tagspunctuationoptimazation")) {
                      var1797.tag = Zotero.AI4Paper.annotationTagOptimization(var1797.tag);
                    }
                    if (Zotero.Prefs.get('ai4paper.imagesspecifictags')) var1787.annotationType === "image" ? _0x4c2603.push("#📷/" + var1797.tag) : _0x4c2603.push("#📝/" + var1797.tag);else {
                      _0x4c2603.push("#📝/" + var1797.tag);
                    }
                  } else {
                    if (Zotero.Prefs.get("ai4paper.tagspunctuationoptimazation")) {
                      var1797.tag = Zotero.AI4Paper.annotationTagsOptimization(var1797.tag);
                    }
                    _0x4c2603.push('#' + var1797.tag);
                  }
                }
                _0x553bef = _0x4c2603.join('\x20');
              }
              let var1798 = JSON.parse(var1787.annotationPosition).pageIndex + 0x1,
                var1799 = Zotero.AI4Paper.getAnnotationItemLink(var1787),
                var1800 = " (<a href=\"" + var1799 + '\x22>' + var1775 + var1776 + 'p' + var1798 + "</a>)";
              Zotero.Prefs.get("ai4paper.cardlinkstyle") === '页码' && (var1800 = " (<a href=\"" + var1799 + '\x22>p' + var1798 + "</a>)");
              let var1801 = '',
                var1802 = '',
                var1803 = -0x1;
              if (var1759 === "宽松型") {
                var1801 = '' + var1787.annotationComment;
                var1801.substring(var1801.length - 0x3) === "```" && (var1801 += "<br>");
                var1801.indexOf("<sup>") != -0x1 && var1801.indexOf('</sup>') != -0x1 && (var1801 = var1801.replace(/<sup>/g, "jbslqn"), var1801 = var1801.replace(/<\/sup>/g, 'jbsrqn'));
                if (var1801.indexOf("<sub>") != -0x1 && var1801.indexOf('</sub>') != -0x1) {
                  var1801 = var1801.replace(/<sub>/g, "jbxlqn");
                  var1801 = var1801.replace(/<\/sub>/g, "jbxrqn");
                }
                var1801.indexOf("<i><b>") != -0x1 && var1801.indexOf('</b></i>') != -0x1 && (var1801 = var1801.replace(/<i><b>/g, "***"), var1801 = var1801.replace(/<\/b><\/i>/g, "***"));
                var1801.indexOf("<b><i>") != -0x1 && var1801.indexOf("</i></b>") != -0x1 && (var1801 = var1801.replace(/<b><i>/g, '***'), var1801 = var1801.replace(/<\/i><\/b>/g, '***'));
                var1801.indexOf("<b>") != -0x1 && var1801.indexOf("</b>") != -0x1 && (var1801 = var1801.replace(/<b>/g, '**'), var1801 = var1801.replace(/<\/b>/g, '**'));
                var1801.indexOf('<i>') != -0x1 && var1801.indexOf('</i>') != -0x1 && (var1801 = var1801.replace(/<i>/g, "***"), var1801 = var1801.replace(/<\/i>/g, "***"));
                var1801 = var1801.replace(/\n{2,}/g, "<p>").replace(/\n/g, "<br>");
                if (var1787.annotationType === "image" && var1801.indexOf("![](") != -0x1) {
                  var1803 = var1801.indexOf('![](');
                  let _0x57bb79 = var1801.substring(var1803),
                    _0x152d3b = _0x57bb79.indexOf(')'),
                    _0x3106b9 = _0x57bb79.substring(0x4, _0x152d3b);
                  var1802 = "WBAWIMAGEswoMT src=\"" + _0x3106b9 + "\" width=\"" + var1763 + '\x22>';
                  let _0x3f9cee = '',
                    _0x49552a = '';
                  _0x57bb79.length > _0x3106b9.length + 0x5 && (_0x49552a = _0x57bb79.substring(_0x3106b9.length + 0x5));
                  var1803 != 0x0 && (_0x3f9cee = var1801.substring(0x0, var1803));
                  var1787.annotationType === "image" ? (var1801 = "<br>" + _0x3f9cee + _0x49552a, var1801.substring(var1801.length - 0x4) === "<br>" && (var1801 = var1801.substring(0x0, var1801.length - 0x4))) : var1801 = '' + _0x3f9cee + _0x49552a + "<br>" + var1802;
                  var1801 = var1801.replace(/<br><br>/g, "<br>");
                }
                if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                  if (var1787.annotationType === "image") {
                    var var1809 = "<blockquote>WBAWSPANswoMT class=\"image" + var1787.annotationColor + '\x22>' + (var1803 != -0x1 ? var1802 : var1787.annotationText) + 'WBAWSSPANswoMT' + (var1787.annotationComment != null ? (var1801 === '<br>' ? '' : var1801) + var1800 : var1800) + (_0x553bef != '' ? "<p>🏷️ " + _0x553bef : '') + (Zotero.Prefs.get('ai4paper.generateCardNoteDate') ? "<p>" + var1788 : '') + '</blockquote>';
                  } else {
                    if (var1787.annotationType === 'note') {
                      var var1809 = "<blockquote>WBAWSPANswoMT class=\"note\" style=\"background-color: " + var1787.annotationColor + '\x22>noteWBAWSSPANswoMT' + (var1787.annotationComment != null ? "<p>" + var1801 + var1800 : var1800) + (_0x553bef != '' ? "<p>🏷️ " + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<p>" + var1788 : '') + '</blockquote>';
                    } else var var1809 = "<blockquote>WBAWSPANswoMT class=\"highlight\" style=\"background-color: " + var1787.annotationColor + '\x22>' + var1787.annotationText + "WBAWSSPANswoMT" + (var1787.annotationComment != null ? "<p>" + var1801 + var1800 : var1800) + (_0x553bef != '' ? '<p>🏷️\x20' + _0x553bef : '') + (Zotero.Prefs.get('ai4paper.generateCardNoteDate') ? "<p>" + var1788 : '') + '</blockquote>';
                  }
                } else {
                  if (var1787.annotationType === "image") {
                    var var1809 = "<blockquote>WBAWSPANNswoMT" + (var1803 != -0x1 ? var1802 : var1787.annotationText) + 'WBAWSSPANswoMT' + (var1787.annotationComment != null ? (var1801 === '<br>' ? '' : var1801) + var1800 : var1800) + (_0x553bef != '' ? "<br>🏷️ " + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + var1788 : '') + "</blockquote>";
                  } else {
                    if (var1787.annotationType === "note") var var1809 = '<blockquote>note' + (var1787.annotationComment != null ? "<br>" + var1801 + var1800 : var1800) + (_0x553bef != '' ? '<br>🏷️\x20' + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + var1788 : '') + "</blockquote>";else var var1809 = "<blockquote>" + var1787.annotationText + (var1787.annotationComment != null ? "<br>" + var1801 + var1800 : var1800) + (_0x553bef != '' ? "<br>🏷️ " + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + var1788 : '') + "</blockquote>";
                  }
                }
              } else {
                if (var1759 === "紧凑型") {
                  var1801 = '' + var1787.annotationComment;
                  var1801.substring(var1801.length - 0x3) === '```' && (var1801 += "<br>");
                  var1801.indexOf('<sup>') != -0x1 && var1801.indexOf("</sup>") != -0x1 && (var1801 = var1801.replace(/<sup>/g, 'jbslqn'), var1801 = var1801.replace(/<\/sup>/g, "jbsrqn"));
                  var1801.indexOf('<sub>') != -0x1 && var1801.indexOf('</sub>') != -0x1 && (var1801 = var1801.replace(/<sub>/g, "jbxlqn"), var1801 = var1801.replace(/<\/sub>/g, "jbxrqn"));
                  var1801.indexOf("<i><b>") != -0x1 && var1801.indexOf("</b></i>") != -0x1 && (var1801 = var1801.replace(/<i><b>/g, "***"), var1801 = var1801.replace(/<\/b><\/i>/g, "***"));
                  var1801.indexOf("<b><i>") != -0x1 && var1801.indexOf("</i></b>") != -0x1 && (var1801 = var1801.replace(/<b><i>/g, "***"), var1801 = var1801.replace(/<\/i><\/b>/g, "***"));
                  var1801.indexOf('<b>') != -0x1 && var1801.indexOf("</b>") != -0x1 && (var1801 = var1801.replace(/<b>/g, '**'), var1801 = var1801.replace(/<\/b>/g, '**'));
                  var1801.indexOf("<i>") != -0x1 && var1801.indexOf("</i>") != -0x1 && (var1801 = var1801.replace(/<i>/g, '***'), var1801 = var1801.replace(/<\/i>/g, '***'));
                  var1801 = var1801.replace(/\n{2,}/g, "<p>").replace(/\n/g, '<br>');
                  if (var1787.annotationType === "image" && var1801.indexOf("![](") != -0x1) {
                    var1803 = var1801.indexOf("![](");
                    let var1810 = var1801.substring(var1803),
                      var1811 = var1810.indexOf(')'),
                      var1812 = var1810.substring(0x4, var1811);
                    var1802 = 'WBAWIMAGEswoMT\x20src=\x22' + var1812 + "\" width=\"" + var1763 + '\x22>';
                    let var1813 = '',
                      var1814 = '';
                    var1810.length > var1812.length + 0x5 && (var1814 = var1810.substring(var1812.length + 0x5));
                    if (var1803 != 0x0) {
                      var1813 = var1801.substring(0x0, var1803);
                    }
                    var1787.annotationType === "image" ? (var1801 = '<br>' + var1813 + var1814, var1801.substring(var1801.length - 0x4) === "<br>" && (var1801 = var1801.substring(0x0, var1801.length - 0x4))) : var1801 = '' + var1813 + var1814 + '<br>' + var1802;
                    var1801 = var1801.replace(/<br><br>/g, '<br>');
                  }
                  if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                    if (var1787.annotationType === "image") var var1809 = '<blockquote>WBAWSPANswoMT\x20class=\x22image' + var1787.annotationColor + '\x22>' + (var1803 != -0x1 ? var1802 : var1787.annotationText) + "WBAWSSPANswoMT" + (var1787.annotationComment != null ? (var1801 === "<br>" ? '' : var1801) + var1800 : var1800) + (_0x553bef != '' ? "<br>🏷️ " + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + var1788 : '') + "</blockquote>";else {
                      if (var1787.annotationType === "note") var var1809 = '<blockquote>WBAWSPANswoMT\x20class=\x22note\x22\x20style=\x22background-color:\x20' + var1787.annotationColor + "\">noteWBAWSSPANswoMT" + (var1787.annotationComment != null ? "<br>" + var1801 + var1800 : var1800) + (_0x553bef != '' ? "<br>🏷️ " + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + var1788 : '') + "</blockquote>";else var var1809 = '<blockquote>WBAWSPANswoMT\x20class=\x22highlight\x22\x20style=\x22background-color:\x20' + var1787.annotationColor + '\x22>' + var1787.annotationText + "WBAWSSPANswoMT" + (var1787.annotationComment != null ? "<br>" + var1801 + var1800 : var1800) + (_0x553bef != '' ? "<br>🏷️ " + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + var1788 : '') + '</blockquote>';
                    }
                  } else {
                    if (var1787.annotationType === "image") {
                      var var1809 = "<blockquote>WBAWSPANNswoMT" + (var1803 != -0x1 ? var1802 : var1787.annotationText) + 'WBAWSSPANswoMT' + (var1787.annotationComment != null ? (var1801 === '<br>' ? '' : var1801) + var1800 : var1800) + (_0x553bef != '' ? '<br>🏷️\x20' + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + var1788 : '') + "</blockquote>";
                    } else {
                      if (var1787.annotationType === "note") {
                        var var1809 = "<blockquote>note" + (var1787.annotationComment != null ? "<br>" + var1801 + var1800 : var1800) + (_0x553bef != '' ? '<br>🏷️\x20' + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + var1788 : '') + "</blockquote>";
                      } else var var1809 = '<blockquote>' + var1787.annotationText + (var1787.annotationComment != null ? "<br>" + var1801 + var1800 : var1800) + (_0x553bef != '' ? "<br>🏷️ " + _0x553bef : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? '<br>' + var1788 : '') + "</blockquote>";
                    }
                  }
                }
              }
              _0x447fba.push(var1809);
            }
          }
        }
        if (_0x447fba.length > 0x0) {
          let var1815 = '' + var1784 + _0x447fba.join('');
          Zotero.Prefs.get('ai4paper.obsidianblockquotemarker') && (var1815 = Zotero.AI4Paper.addBlockQuoteMarker(var1815, true));
          var1764.push(var1815);
        }
        if (_0x2cb4db.length > 0x0) {
          let var1816 = '' + var1785 + _0x2cb4db.join('');
          Zotero.Prefs.get("ai4paper.obsidianblockquotemarker") && (var1816 = Zotero.AI4Paper.addBlockQuoteMarker(var1816, false));
          var1765.push(var1816);
        }
      }
    }
    let var1817 = var1764.join("<p>"),
      var1818 = var1765.join('<p>');
    return {
      'itemPDFsAnnotationsHTML': var1817,
      'itemPDFsVocabulariesHTML': var1818
    };
  },
  'annotationTagOptimization': function (param204) {
    return param204 = param204.replace(/\(/g, '（'), param204 = param204.replace(/\)/g, '）'), param204 = param204.replace(/—/g, '_'), param204 = param204.replace(/[\u201c|\u201d|\u2018|\u2019]/g, '_'), param204 = param204.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\?]/g, '_'), param204;
  },
  'addBlockQuoteMarker': function (param205, param206) {
    var var1819 = [],
      var1820 = [],
      var1821 = [],
      var1822 = [],
      var1823 = new RegExp("<blockquote>", 'g'),
      var1824 = new RegExp("</blockquote>", 'g');
    while (var1823.exec(param205) != null && var1824.exec(param205) != null) {
      var1820.push(var1823.lastIndex);
      var1821.push(var1824.lastIndex);
    }
    for (i = 0x0; i < var1821.length; i++) {
      let _0x9c47d8 = param205.substring(var1820[i] - 0xc, var1821[i]);
      _0x9c47d8 = Zotero.AI4Paper.checkAnnotationHead(_0x9c47d8);
      var1822.push(_0x9c47d8);
    }
    var1819[0x0] = param206 ? "^KEYannotati" : "^KEYvocabula";
    for (i = 0x1; i < var1821.length; i++) {
      let _0x15eae2 = param205.substring(var1820[i] - 0xc, var1821[i]),
        _0x1c8deb = _0x15eae2.indexOf("items/"),
        _0x3fa430 = _0x15eae2.indexOf("?page="),
        _0x2c1e8b = _0x15eae2.substring(_0x1c8deb + 0x6, _0x3fa430),
        _0x4fbb37 = _0x15eae2.indexOf("&annotation="),
        _0x395e78 = _0x15eae2.substring(_0x4fbb37),
        _0x2deada = _0x395e78.indexOf('\x22>'),
        _0x1c6bec = _0x395e78.substring(0xc, _0x2deada),
        _0x3334ee = '' + _0x1c6bec;
      var1819.push('<p>^KEY' + _0x3334ee);
    }
    var var1835 = [];
    for (i = 0x0; i < var1821.length; i++) {
      var1835.push(var1822[i] + var1819[i]);
    }
    let var1836 = param205.substring(0x0, var1820[0x0] - 0xc);
    return var1836 + var1835.join('');
  },
  'checkAnnotationHead': function (param207) {
    if (param207.indexOf("<ZH") === -0x1) return param207;else {
      let var1837 = false,
        var1838 = '';
      if (param207.indexOf("<ZH1>") != -0x1 && param207.indexOf('<ZH1/>') != -0x1) {
        var1838 = 'ZH1';
        var1837 = true;
      } else {
        if (param207.indexOf("<ZH2>") != -0x1 && param207.indexOf('<ZH2/>') != -0x1) {
          var1838 = "ZH2";
          var1837 = true;
        } else {
          if (param207.indexOf("<ZH3>") != -0x1 && param207.indexOf("<ZH3/>") != -0x1) {
            var1838 = "ZH3";
            var1837 = true;
          } else {
            if (param207.indexOf("<ZH4>") != -0x1 && param207.indexOf("<ZH4/>") != -0x1) {
              var1838 = 'ZH4';
              var1837 = true;
            } else {
              if (param207.indexOf("<ZH5>") != -0x1 && param207.indexOf("<ZH5/>") != -0x1) {
                var1838 = "ZH5";
                var1837 = true;
              } else param207.indexOf("<ZH6>") != -0x1 && param207.indexOf("<ZH6/>") != -0x1 && (var1838 = "ZH6", var1837 = true);
            }
          }
        }
      }
      if (var1837) {
        let var1839 = param207.indexOf('<' + var1838 + '>'),
          var1840 = param207.substring(var1839),
          var1841 = var1840.indexOf('<' + var1838 + '/>'),
          var1842 = var1840.substring(0x5, var1841),
          var1843 = '',
          var1844 = '';
        return var1840.length > var1842.length + 0xb && (var1844 = var1840.substring(var1842.length + 0xb)), var1839 != 0x0 && (var1843 = param207.substring(0x0, var1839)), '<' + var1838.substring(0x1).toLowerCase() + '>' + var1842.trim() + '</' + var1838.substring(0x1).toLowerCase() + "><p>" + var1843 + var1844;
      }
    }
    return param207;
  },

  // === Block C: Annotation Button UI ===
  'addAnnotationButtonInit': async function (param221) {
    let var1985 = Zotero_Tabs._selectedID;
    var var1986 = Zotero.Reader.getByTabID(var1985);
    let var1987 = Zotero.AI4Paper.betterURL();
    if (!var1986 || !var1987) {
      return false;
    }
    await var1986._initPromise;
    await var1986._waitForReader();
    if (!var1986._state.sidebarOpen) {
      return false;
    }
    let var1988 = 0x0;
    while (!var1986._iframeWindow.document.querySelector('#viewAnnotations')) {
      if (var1988 >= 0x1f4) {
        Zotero.debug("AI4Paper: Waiting for Annotations LeftBar failed");
        return;
      }
      await Zotero.Promise.delay(0x5);
      var1988++;
    }
    Zotero.AI4Paper.addAnnotationButton(var1986);
    Zotero.AI4Paper.handleNewAnnotationFiltering(param221);
  },
  'addAnnotationButton': async function (param222) {
    const var1989 = param222._iframeWindow.document;
    for (let var1990 of var1989.getElementsByClassName("more")) {
      let var1991 = var1990.closest('.annotation');
      if (!var1991) continue;
      let var1992 = var1991.getAttribute('data-sidebar-annotation-id'),
        var1993 = Zotero.Items.get(param222.itemID).libraryID,
        var1994 = await Zotero.Items.getByLibraryAndKeyAsync(var1993, var1992);
      Zotero.AI4Paper.createAnnotationButtons(var1989, var1991, var1990, var1994, var1992);
      Zotero.AI4Paper.createAnnotationButton_VisitUniversalQuoteLink(param222, var1989, var1991, var1990, var1994, var1992);
      Zotero.AI4Paper.createAnnotationButton_ZoterAnnotationDate(var1989, var1991, var1990, var1994, var1992);
    }
  },
  'createAnnotationButtons': function (param223, param224, param225, param226, param227) {
    let var1995 = Zotero.AI4Paper.getColorExcluded();
    for (let var1996 of Zotero.AI4Paper.annotation_buttons) {
      let var1997 = "zoteroone-annotation-button-" + var1996 + '-' + param227,
        var1998 = "toolbar-button zoteroone-annotation-button AI4Paper-Reader-Buttons";
      if (Zotero.Prefs.get("ai4paper." + var1996) && !param224.querySelector('#' + var1997)) {
        if (var1996 === "enableannotationsvgOptimizeSpaces" && param226.annotationType != 'ink') {
          let _0x2a836c = param223.createElement("div");
          _0x2a836c.setAttribute('id', var1997);
          _0x2a836c.setAttribute("class", var1998);
          _0x2a836c.setAttribute("style", "width: 21px; height: 21px;");
          _0x2a836c.title = "优化空格";
          _0x2a836c.innerHTML = Zotero.AI4Paper.svg_icon_16px[var1996];
          _0x2a836c.addEventListener('click', _0x38a6e8 => {
            _0x38a6e8.stopPropagation();
            Zotero.AI4Paper.onclickAnnotationButton_optimizeSpaces(param226);
          });
          param225.before(_0x2a836c);
        }
        if (var1996 === "enableannotationsvgSetCommentTemplate" && param226.annotationType != "ink") {
          let var2000 = param223.createElement("div");
          var2000.setAttribute('id', var1997);
          var2000.setAttribute("class", var1998);
          var2000.setAttribute("style", "width: 21px; height: 21px;");
          var2000.title = "注释评论模板";
          var2000.innerHTML = Zotero.AI4Paper.svg_icon_16px[var1996];
          var2000.addEventListener("click", _0x283936 => {
            _0x283936.stopPropagation();
            _0x283936.shiftKey ? Zotero.AI4Paper.addAnnotationCommentTempate([param226]) : Zotero.AI4Paper.onClickButton_AnnotationCommentTempate([param226], var2000);
          });
          param225.before(var2000);
        }
        if (var1996 === 'enableannotationsvghead' && (param226.annotationType === 'highlight' || param226.annotationType === "note" || param226.annotationType === 'underline')) {
          let var2001 = param223.createElement("div");
          var2001.setAttribute('id', var1997);
          var2001.setAttribute("class", var1998);
          var2001.setAttribute("style", "width: 21px; height: 21px;");
          var2001.title = '大纲标题';
          var2001.innerHTML = Zotero.AI4Paper.svg_icon_16px[var1996];
          var2001.addEventListener("click", _0x4bbac8 => {
            _0x4bbac8.stopPropagation();
            Zotero.AI4Paper.setAnnotationHead(param226);
          });
          param225.before(var2001);
        }
        if (var1996 === "enableannotationsvgtranslate" && (param226.annotationType === 'highlight' || param226.annotationType === "underline")) {
          let _0x19c943 = param223.createElement("div");
          _0x19c943.setAttribute('id', var1997);
          _0x19c943.setAttribute("class", var1998);
          _0x19c943.setAttribute("style", 'width:\x2021px;\x20height:\x2021px;');
          _0x19c943.title = '注释翻译';
          _0x19c943.innerHTML = Zotero.AI4Paper.svg_icon_16px[var1996];
          _0x19c943.addEventListener("click", _0x21a762 => {
            _0x21a762.stopPropagation();
            Zotero.AI4Paper.annotationTextTrans(param226, "noAuto");
          });
          param225.before(_0x19c943);
        }
        if (var1996 === "enableannotationsvgtagsselect") {
          let var2003 = param223.createElement("div");
          var2003.setAttribute('id', var1997);
          var2003.setAttribute("class", var1998);
          var2003.setAttribute("style", 'width:\x2021px;\x20height:\x2021px;');
          var2003.title = "添加标签";
          var2003.innerHTML = Zotero.AI4Paper.svg_icon_16px[var1996];
          var2003.addEventListener("click", _0x324ef6 => {
            _0x324ef6.stopPropagation();
            _0x324ef6.shiftKey ? Zotero.AI4Paper.onClickButton_AnnotationCommentTempate([param226], var2003) : Zotero.AI4Paper.openSelectTagWindow(param226);
          });
          param225.before(var2003);
        }
        if (var1996 === "enableannotationsvgblockquotelink") {
          let _0x573d06 = param223.createElement("div");
          _0x573d06.setAttribute('id', var1997);
          _0x573d06.setAttribute("class", var1998);
          _0x573d06.setAttribute('style', 'width:\x2021px;\x20height:\x2021px;');
          _0x573d06.title = '拷贝块引用链接';
          _0x573d06.innerHTML = Zotero.AI4Paper.svg_icon_16px[var1996];
          _0x573d06.addEventListener("click", _0x2cb6ff => {
            _0x2cb6ff.stopPropagation();
            Zotero.AI4Paper.getBlockQuoteLink(param226);
          });
          param225.before(_0x573d06);
        }
        if (var1996 === 'enableannotationsvgaudioplay' && param226.annotationType === "highlight" && param226.annotationText) {
          let var2005 = ('' + param226.annotationText).trim();
          if (!Zotero.AI4Paper.isChineseText(var2005) && var2005.indexOf('\x20') === -0x1 && var2005.indexOf('-') === -0x1) {
            let var2006 = param223.createElement('div');
            var2006.setAttribute('id', var1997);
            var2006.setAttribute("class", var1998);
            var2006.setAttribute("style", "width: 21px; height: 21px;");
            var2006.title = "播放单词发音";
            var2006.innerHTML = Zotero.AI4Paper.svg_icon_16px[var1996];
            var2006.addEventListener("click", _0x27557c => {
              _0x27557c.stopPropagation();
              Zotero.AI4Paper.annotationAudioPlay(var2005);
            });
            param225.before(var2006);
          }
        }
        if (var1996 === 'enableannotationsvgAddWordsToEudic' && (param226.annotationType === "highlight" || param226.annotationType === "note" || param226.annotationType === "underline")) {
          let var2007 = param223.createElement("div");
          var2007.setAttribute('id', var1997);
          var2007.setAttribute("class", var1998);
          var2007.setAttribute("style", "width: 21px; height: 21px;");
          var2007.title = "收藏生词至欧路词典";
          var2007.innerHTML = Zotero.AI4Paper.svg_icon_16px[var1996];
          var2007.onclick = _0x2dc0a5 => {
            _0x2dc0a5.stopPropagation();
            Zotero.AI4Paper.addWordsToEudic(param226.annotationText.trim());
          };
          var2007.addEventListener("pointerdown", _0x1b13d4 => {
            _0x1b13d4.preventDefault && _0x1b13d4.preventDefault();
            _0x1b13d4.stopPropagation();
            _0x1b13d4.button == 0x2 && Zotero.AI4Paper.modifyEudicWords(param226.annotationText.trim());
          }, false);
          param225.before(var2007);
        }
        if (var1996 === "enableannotationsvguploadimage" && param226.annotationType === "image") {
          let var2008 = param223.createElement("div");
          var2008.setAttribute('id', var1997);
          var2008.setAttribute("class", var1998);
          var2008.setAttribute("style", "width: 21px; height: 21px;");
          var2008.title = '上传图片';
          var2008.innerHTML = Zotero.AI4Paper.svg_icon_16px[var1996];
          var2008.addEventListener('click', _0x179371 => {
            _0x179371.stopPropagation();
            Zotero.AI4Paper.getAnnotationImage(param226, param226.key);
          });
          param225.before(var2008);
        }
        if (var1996 === "enableannotationsvgobsidianblock" && !(param226.annotationColor === var1995 && param226.annotationType === "highlight")) {
          let var2009 = param223.createElement('div');
          var2009.setAttribute('id', var1997);
          var2009.setAttribute("class", var1998);
          var2009.setAttribute('style', "width: 21px; height: 21px;");
          var2009.title = "跳转 Obsidian 卡片";
          var2009.innerHTML = Zotero.AI4Paper.svg_icon_16px[var1996];
          var2009.addEventListener("click", _0x3bb24a => {
            _0x3bb24a.stopPropagation();
            Zotero.AI4Paper.go2ObsidianBlock(param226);
          });
          param225.before(var2009);
        }
      } else {
        if (!Zotero.Prefs.get('ai4paper.' + var1996)) {
          param224.querySelectorAll('#' + var1997).forEach(_0x29fc3e => _0x29fc3e.remove());
        }
      }
    }
  },
  'getColorExcluded': function () {
    let var2010 = '';
    if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '黄色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "黄色（高亮）") var2010 = "#ffd400";else {
      if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '红色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "红色（高亮）") var2010 = "#ff6666";else {
        if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '绿色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "绿色（高亮）") var2010 = "#5fb236";else {
          if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '蓝色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "蓝色（高亮）") {
            var2010 = "#2ea8e5";
          } else {
            if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '紫色' || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "紫色（高亮）") var2010 = "#a28ae5";else {
              if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '洋红色' || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "洋红色（高亮）") var2010 = "#e56eee";else {
                if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '橘色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "橘色（高亮）") {
                  var2010 = '#f19837';
                } else {
                  if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '灰色' || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '灰色（高亮）') {
                    var2010 = '#aaaaaa';
                  }
                }
              }
            }
          }
        }
      }
    }
    return var2010;
  },
  'createAnnotationButton_ZoterAnnotationDate': function (param228, param229, param230, param231, param232) {
    let var2011 = 'enableannotationsvgZoterAnnotationDate',
      var2012 = "zoteroone-annotation-button-" + var2011 + '-' + param232,
      var2013 = "zoteroone-annotation-button AI4Paper-Reader-Buttons";
    if ((Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationDate") || Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationID")) && !param228.getElementById(var2012)) {
      let _0xa7109c = param228.createElement("div");
      _0xa7109c.setAttribute('id', var2012);
      _0xa7109c.setAttribute("class", var2013);
      _0xa7109c.textContent = '' + (Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationDate") ? Zotero.AI4Paper.convertAnnotationDate(param231.dateAdded) + '\x20' : '') + (Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationID") ? Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationIDEmoji") + '\x20' + param232 : '');
      _0xa7109c.style.color = "gray";
      _0xa7109c.style.padding = "3px 5px";
      _0xa7109c.style.borderBottomLeftRadius = "4px";
      _0xa7109c.style.borderBottomRightRadius = "4px";
      param229.append(_0xa7109c);
    } else {
      if (!Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationDate") && !Zotero.Prefs.get('ai4paper.enableannotationsvgZoterAnnotationID')) {
        param228.querySelectorAll('#' + var2012).forEach(_0x8ede48 => _0x8ede48.remove());
      }
    }
  },
  'createAnnotationButton_VisitUniversalQuoteLink': function (param233, param234, param235, param236, param237, param238) {
    let var2015 = 'enableannotationsvgVisitUniversalQuoteLink',
      var2016 = "zoteroone-annotation-button-" + var2015 + '-' + param238,
      var2017 = "toolbar-button zoteroone-annotation-button AI4Paper-Reader-Buttons";
    if (Zotero.Prefs.get("ai4paper." + var2015) && param237.annotationType != "ink") {
      let var2018 = '' + param237.annotationComment;
      if (var2018) {
        let var2019 = Zotero.AI4Paper.hasUniversalQuoteLink(var2018);
        if (var2019) {
          param235.querySelector("header") && (param235.querySelector("header").title = '');
          let var2020 = param235.querySelector('#' + var2016);
          if (!var2020) {
            var2020 = param234.createElement("div");
            var2020.setAttribute('id', var2016);
            var2020.setAttribute("style", "width: 21px; height: 21px;");
            var2020.setAttribute("class", var2017);
            var2020.innerHTML = Zotero.AI4Paper.svg_icon_16px[var2015];
            fn4();
            param236.before(var2020);
          } else {
            fn4();
          }
          function fn4() {
            var2020.onclick = async _0x74c980 => {
              _0x74c980.stopPropagation();
              try {
                let var2021 = await Zotero.Items.getByLibraryAndKeyAsync(Zotero.Items.get(param233.itemID).libraryID, var2019.annotationID);
                if (!var2021) {
                  Zotero.AI4Paper.showProgressWindow(0xfa0, "❌ 跳转引用卡片【AI4paper】", "引用的注释卡片不存在，可能已被您删除！");
                  return;
                }
                Zotero.AI4Paper.focusAnnotationToGo(param233, var2019.annotationID, var2019.annotationLink);
              } catch (_0x2b3bb6) {
                Zotero.AI4Paper.showProgressWindow(0xfa0, "❌ 访问通用引用链接失败【AI4paper】", '访问失败，链接可能无效！');
              }
            };
            Zotero.AI4Paper.addContextMenuEvent_UniversalQuoteLinkButton(var2020, param233, var2019, param238, param237);
          }
        }
      }
    } else !Zotero.Prefs.get('ai4paper.' + var2015) && param235.querySelectorAll('#' + var2016).forEach(_0x499bf2 => _0x499bf2.remove());
  },
  'addContextMenuEvent_UniversalQuoteLinkButton': function (param239, param240, param241, param242, param243) {
    let var2022 = "onmouseover";
    Zotero.Prefs.get('ai4paper.quotedCardPreviewMethod') === '右键预览' && (var2022 = "oncontextmenu");
    param239._eventType && (param239[param239._eventType] = '');
    !param239._mouseoutEventAdded && (param239._mouseoutEventAdded = true, param239.addEventListener("mouseout", async function (param244) {
      if (Zotero.Prefs.get("ai4paper.quotedCardPreviewMethod") != "悬停预览，移出消失") return;
      param239._mouseout_state = true;
      let _0xc231d3 = param244.relatedTarget || param244.toElement;
      if (!this.contains(_0xc231d3)) {
        await Zotero.Promise.delay(0x12c);
        if (window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").length) {
          let _0x1ec602 = window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview")[0x0];
          if (!_0x1ec602.mouseover_state) {
            window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(_0x2d60f7 => _0x2d60f7.remove());
          }
        }
      }
    }));
    param239[var2022] = async _0x357887 => {
      _0x357887.returnValue = false;
      _0x357887.preventDefault && _0x357887.preventDefault();
      _0x357887.stopPropagation();
      param239._eventType = var2022;
      param239._mouseout_state = false;
      if (window.document.querySelector("#browser").querySelectorAll('.AI4Paper-QuotedAnnotation-Preview').length) {
        let _0x3efde9 = window.document.querySelector("#browser").querySelectorAll('.AI4Paper-QuotedAnnotation-Preview')[0x0];
        if (_0x3efde9.classList.contains(param242)) return;else window.document.querySelector("#browser").querySelectorAll('.AI4Paper-QuotedAnnotation-Preview').forEach(_0x35044f => _0x35044f.remove());
      }
      let var2026 = await Zotero.Items.getByLibraryAndKeyAsync(Zotero.Items.get(param240.itemID).libraryID, param241.annotationID);
      if (!var2026) {
        let _0x3c343b = window.document.createXULElement("panel");
        _0x3c343b.setAttribute("class", "AI4Paper-QuotedAnnotation-Preview " + param242);
        _0x3c343b.setAttribute("type", "arrow");
        _0x3c343b.addEventListener("popuphidden", () => {
          window.document.querySelector('#browser').querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(_0x3b1442 => _0x3b1442.remove());
        });
        _0x3c343b.addEventListener('mouseout', async function (param245) {
          if (Zotero.Prefs.get("ai4paper.quotedCardPreviewMethod") != "悬停预览，移出消失") {
            return;
          }
          let var2028 = param245.relatedTarget || param245.toElement;
          !this.contains(var2028) && (await Zotero.Promise.delay(0x12c), param239._mouseout_state ? window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(_0x3a0299 => _0x3a0299.remove()) : _0x3c343b.mouseover_state = false);
        });
        _0x3c343b.addEventListener("mouseover", function (param246) {
          if (Zotero.Prefs.get("ai4paper.quotedCardPreviewMethod") != "悬停预览，移出消失") {
            return;
          }
          _0x3c343b.mouseover_state = true;
        });
        let _0xcbad9a = window.document.createXULElement("vbox"),
          _0x4d42ab = window.document.createXULElement('label');
        _0x4d42ab.setAttribute('value', "❌ 引用的注释卡片不存在，可能已被您删除！");
        _0x4d42ab.style = "margin-top: 5px;margin-bottom: 5px;margin-left: -5px;margin-right: -5px;";
        _0xcbad9a.appendChild(_0x4d42ab);
        _0x3c343b.appendChild(_0xcbad9a);
        window.document.querySelector("#browser").querySelectorAll('.AI4Paper-QuotedAnnotation-Preview').forEach(_0x3d6b05 => _0x3d6b05.remove());
        window.document.querySelector("#browser")?.["appendChild"](_0x3c343b);
        _0x3c343b.openPopup(param239, "after_start", 0x10, -0x2, false, false);
        return;
      }
      let var2031 = {
          'highlight': '高亮',
          'underline': "下划线",
          'note': '笔记',
          'text': '文本',
          'image': '图片',
          'ink': '画笔'
        },
        var2032 = Zotero.getMainWindow()?.["matchMedia"]('(prefers-color-scheme:\x20dark)')['matches'],
        var2033 = window.document.createXULElement("panel");
      var2033.setAttribute("class", "AI4Paper-QuotedAnnotation-Preview " + param242);
      var2033.setAttribute("type", "arrow");
      var2033.style.width = '300px';
      var2033.addEventListener("popuphidden", () => {
        window.document.querySelector('#browser').querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(_0x26b6d8 => _0x26b6d8.remove());
      });
      var2033.addEventListener("mouseout", async function (param247) {
        if (Zotero.Prefs.get('ai4paper.quotedCardPreviewMethod') != "悬停预览，移出消失") {
          return;
        }
        let var2034 = param247.relatedTarget || param247.toElement;
        if (!this.contains(var2034)) {
          await Zotero.Promise.delay(0x12c);
          param239._mouseout_state ? window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(_0x4fe30d => _0x4fe30d.remove()) : var2033.mouseover_state = false;
        }
      });
      var2033.addEventListener("mouseover", function (param248) {
        if (Zotero.Prefs.get("ai4paper.quotedCardPreviewMethod") != "悬停预览，移出消失") return;
        var2033.mouseover_state = true;
      });
      let var2035 = window.document.createXULElement('vbox'),
        var2036 = window.document.createXULElement("div");
      var2036.style = "width: 270px;display: inline-block;margin-left: -5px;margin-right: -5px;margin-top: -5px;overflow: hidden;text-overflow: ellipsis;cursor: pointer;white-space: nowrap;";
      var2036.textContent = "🎈 " + var2026.parentItem.getField('title');
      var2036.setAttribute("tooltiptext", var2026.parentItem.getField('title'));
      var2036.onclick = param239.onclick;
      var2035.appendChild(var2036);
      let var2037 = window.document.createXULElement('div');
      var2037.style = "display:flex;align-items: center;margin-top: 5px;margin-bottom: 8px;";
      let var2038 = window.document.createXULElement("label");
      var2038.setAttribute('value', "→ 【" + var2031[var2026.annotationType] + '型】卡片\x20🆔\x20' + param241.annotationID);
      var2038.style = "margin-left: -5px;cursor: pointer;";
      var2038.onclick = param239.onclick;
      var2037.appendChild(var2038);
      let var2039 = window.document.createXULElement('div');
      var2039.innerHTML = Zotero.AI4Paper.svg_icon_20px[var2026.annotationType];
      var2039.style = 'transform:\x20scale(0.8);margin-left:\x204px;vertical-align:middle';
      var2039.setAttribute('tooltiptext', "跳转卡片");
      var2039.style.transition = "transform 0.3s ease";
      var2039.onmouseover = () => var2039.style.transform = "scale(1.2)";
      var2039.onmouseout = () => var2039.style.transform = 'scale(1)';
      var2039.onclick = param239.onclick;
      var2037.appendChild(var2039);
      let var2040 = window.document.createElement('div');
      var2040.innerHTML = Zotero.AI4Paper.svg_icon_16px.enableannotationsvgobsidianblock;
      var2040.style = 'width:\x2016px;height:\x2016px;margin-left:\x2010px;vertical-align:middle';
      var2040.title = '跳转\x20Obsidian';
      var2040.style.transition = "transform 0.3s ease";
      var2040.onmouseover = () => var2040.style.transform = "scale(1.2)";
      var2040.onmouseout = () => var2040.style.transform = "scale(1)";
      var2040.onmousedown = _0x23916e => {
        if (_0x23916e.button === 0x0) {
          Zotero.AI4Paper.go2ObsidianBlock(var2026);
        }
        if (_0x23916e.button === 0x2) {
          Zotero.AI4Paper.go2ObsidianBlock(param243);
        }
      };
      var2037.appendChild(var2040);
      var2035.appendChild(var2037);
      let var2041 = window.document.createXULElement("div");
      var2041.setAttribute('id', "AI4Paper-AnnotationText-DIV");
      let var2042 = !var2032 ? "#fffae8" : "#1e1e1e";
      var2041.style.maxHeight = '100px';
      var2041.style = 'display:\x20inline-block;background-color:\x20' + var2042 + ";border-radius: 6px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);padding: 6px;margin-bottom: 6px;margin-left: -5px;margin-right: -5px;overflow-y: auto;overflow-x: hidden;word-wrap: break-word;clear: both;white-space: pre-wrap;-ms-word-break:break-all;";
      var2041.onmousedown = _0x467bc6 => {
        _0x467bc6.button === 0x2 && Zotero.AI4Paper.copy2Clipboard(_0x467bc6.target.textContent);
      };
      if (var2026.annotationType === "image" || var2026.annotationType === "ink") {
        let var2043 = false,
          var2044,
          var2045 = Zotero.Prefs.get("extensions.zotero.dataDir", true),
          var2046 = Zotero.AI4Paper.checkGroupLibItem(var2026.parentItem);
        var2046 ? (var2044 = var2045 + '\x5ccache\x5cgroups\x5c' + var2046 + '\x5c' + var2026.key + ".png", (Zotero.isMac || Zotero.isLinux) && (var2044 = var2045 + "/cache/groups/" + var2046 + '/' + var2026.key + ".png")) : (var2044 = var2045 + "\\cache\\library\\" + var2026.key + ".png", (Zotero.isMac || Zotero.isLinux) && (var2044 = var2045 + '/cache/library/' + var2026.key + ".png"));
        if (var2044 && (await OS.File.exists(var2044))) {
          var2043 = true;
          let _0x3b20d9 = await Zotero.File.getBinaryContentsAsync(var2044),
            _0xec11e1 = "data:image/png;base64," + btoa(_0x3b20d9),
            _0x27ac72 = window.document.createXULElement("image");
          _0x27ac72.src = _0xec11e1;
          _0x27ac72.style.width = "260px";
          var2041.textContent = '';
          var2041.style.display = "flex";
          var2041.style.aligntems = "center";
          var2041.style.justifyContent = 'center';
          !var2032 && (var2041.style.backgroundColor = '');
          var2041.style.maxHeight = window.screen.height >= 0x3e8 ? "1000px" : '900px';
          var2041.onmousedown = _0x33ac95 => {
            if (_0x33ac95.button === 0x2) {
              Zotero.AI4Paper.copyImage(_0xec11e1);
            }
          };
          var2041.appendChild(_0x27ac72);
        } else {
          if (var2026.annotationComment) {
            let var2050 = '' + var2026.annotationComment,
              var2051 = var2050.indexOf("![](");
            if (var2051 != -0x1) {
              let var2052 = var2050.substring(var2051 + 0x4),
                var2053 = var2052.indexOf(')');
              if (var2053 != -0x1) {
                var2043 = true;
                var2044 = var2052.substring(0x0, var2053);
                let var2054 = window.document.createXULElement("image");
                var2054.src = var2044;
                var2054.style.width = "260px";
                var2041.textContent = '';
                var2041.style.display = "flex";
                var2041.style.aligntems = "center";
                var2041.style.justifyContent = "center";
                !var2032 && (var2041.style.backgroundColor = '');
                var2041.style.maxHeight = window.screen.height >= 0x3e8 ? "1000px" : "900px";
                var2041.onmousedown = async _0x31b400 => {
                  if (_0x31b400.button === 0x2) {
                    let var2055 = await Zotero.AI4Paper.getImageDataURL(var2026);
                    var2055 ? Zotero.AI4Paper.copyImage(var2055) : Zotero.AI4Paper.copy2Clipboard(var2044);
                  }
                };
                var2041.appendChild(var2054);
              }
            }
          }
        }
        !var2043 && (var2041.textContent = '未发现图床链接，因此无法预览图片！');
      }
      var2035.appendChild(var2041);
      ['note', "text"].includes(var2026.annotationType) && (var2041.style.display = "none");
      let var2056 = window.document.createXULElement('div');
      var2056.setAttribute('id', 'AI4Paper-AnnotationComment-DIV');
      let var2057 = !var2032 ? "#f1fafb" : '#1e1e1e';
      var2056.style.maxHeight = "100px";
      var2056.style = 'display:\x20inline-block;background-color:\x20' + var2057 + ";border-radius: 6px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);padding: 6px;margin-top: 6px;margin-left: -5px;margin-right: -5px;overflow-y: auto;overflow-x: hidden;word-wrap: break-word;clear: both;white-space: pre-wrap;-ms-word-break:break-all;";
      var2056.onmousedown = _0x538132 => {
        _0x538132.button === 0x2 && Zotero.AI4Paper.copy2Clipboard(_0x538132.target.textContent);
      };
      var2035.appendChild(var2056);
      let var2058 = window.document.createXULElement("div");
      var2058.setAttribute('id', 'AI4Paper-AnnotationTags-DIV');
      let var2059 = !var2032 ? '' : '#1c1b22';
      var2058.style.maxHeight = "85px";
      var2058.style = "background-color: " + var2059 + ";display:block;align-items: center;border-radius: 6px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);padding-left: 2px;padding-top: 5px;padding-bottom: 5px;margin-top: 12px;margin-bottom: -5px;margin-left: -5px;margin-right: -5px;overflow-y: auto;overflow-x: hidden;";
      var2035.appendChild(var2058);
      var2033.appendChild(var2035);
      window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(_0x201d90 => _0x201d90.remove());
      window.document.querySelector("#browser")?.["appendChild"](var2033);
      var2033.openPopup(param239, "after_start", 0x10, -0x2, false, false);
      var2026.annotationType != "image" && var2026.annotationType != 'ink' && (var2026.annotationText ? var2041.textContent = '' + var2026.annotationText : var2041.textContent = "[注释文本为空]", var2041.style.height = "auto", var2041.style.height = Math.min(var2041.scrollHeight, 0x64) + 'px');
      var2026.annotationComment ? var2056.textContent = var2026.annotationComment : var2056.textContent = '[注释评论为空]';
      var2056.style.height = "auto";
      var2056.style.height = Math.min(var2056.scrollHeight, 0x64) + 'px';
      let var2060 = var2026.getTags().map(_0x39f070 => '' + _0x39f070.tag),
        var2061 = [{
          'bgColor': !var2032 ? "#f8efe5" : "#23222b",
          'fontColor': '#c58517'
        }, {
          'bgColor': !var2032 ? '#ecf3e7' : '#23222b',
          'fontColor': "#739a4a"
        }, {
          'bgColor': !var2032 ? '#f5ecfe' : "#23222b",
          'fontColor': "#8e49ff"
        }, {
          'bgColor': !var2032 ? "#f9e9e9" : "#23222b",
          'fontColor': "#d6064c"
        }, {
          'bgColor': !var2032 ? "#e9f4ff" : "#23222b",
          'fontColor': "#2897f7"
        }, {
          'bgColor': !var2032 ? "#fef1e5" : "#23222b",
          'fontColor': "#fe6f08"
        }, {
          'bgColor': !var2032 ? '#e6f8e9' : "#23222b",
          'fontColor': "#26ab39"
        }, {
          'bgColor': !var2032 ? "#faedfe" : "#23222b",
          'fontColor': "#e434e1"
        }, {
          'bgColor': !var2032 ? '#ffedf1' : "#23222b",
          'fontColor': "#ff5474"
        }, {
          'bgColor': !var2032 ? '#f3f3f3' : "#23222b",
          'fontColor': "#909090"
        }];
      if (var2060.length) {
        for (let var2062 of var2060) {
          let var2063 = Math.floor(Math.random() * 0xa),
            var2064 = window.document.createXULElement('label');
          var2064.setAttribute("value", var2062);
          var2064.style = "border-radius: 5px;margin-right: 2px;background-color: " + var2061[var2063].bgColor + ";color: " + var2061[var2063].fontColor + ";padding: 3px;cursor: pointer;";
          var2064.onmousedown = _0x425f66 => {
            _0x425f66.button === 0x0 && Zotero.AI4Paper.jump2TagCardNotes(var2062);
            _0x425f66.button === 0x2 && Zotero.AI4Paper.copy2Clipboard(var2062);
          };
          var2058.appendChild(var2064);
        }
        var2058.style.height = "auto";
        var2058.style.height = Math.min(var2058.scrollHeight, 0x55) + 'px';
      } else {
        var2058.style.display = 'none';
      }
    };
  },
  'convertAnnotationDate': function (param249) {
    const var2065 = new Date(param249);
    var2065.setHours(var2065.getHours() + 0x8);
    const var2066 = var2065.getFullYear(),
      var2067 = (var2065.getMonth() + 0x1).toString().padStart(0x2, '0'),
      var2068 = var2065.getDate().toString().padStart(0x2, '0'),
      var2069 = var2065.getHours().toString().padStart(0x2, '0'),
      var2070 = var2065.getMinutes().toString().padStart(0x2, '0'),
      var2071 = var2065.getSeconds().toString().padStart(0x2, '0'),
      var2072 = var2066 + '-' + var2067 + '-' + var2068 + '\x20' + var2069 + ':' + var2070;
    return var2072;
  },
  'focusAnnotationToGo': async function (param250, param251, param252) {
    if (param252.indexOf(param250._item.key) != -0x1) {
      let _0x466b32 = true;
      if (!param250._state.sidebarOpen) {
        let _0x212827 = 0x0;
        while (!param250._iframeWindow.document.querySelector('#sidebarToggle')) {
          if (_0x212827 >= 0x190) {
            Zotero.debug('AI4Paper:\x20Waiting\x20for\x20sidebarToggle\x20failed');
            return;
          }
          await Zotero.Promise.delay(0x5);
          _0x212827++;
        }
        let _0x107d06 = param250._iframeWindow.document.querySelector("#sidebarToggle");
        !param250._state.sidebarOpen && (_0x107d06.click(), _0x466b32 = false);
      }
      let _0x4f70ff = 0x0;
      while (!param250._iframeWindow.document.querySelector("[data-sidebar-annotation-id=\"" + param251 + '\x22]')) {
        if (_0x4f70ff >= 0x1f4) {
          Zotero.debug('AI4Paper:\x20Waiting\x20for\x20annotationElem\x20failed');
          return;
        }
        await Zotero.Promise.delay(0x5);
        _0x4f70ff++;
      }
      let _0x1aa2ae = param250._iframeWindow.document.querySelector("[data-sidebar-annotation-id=\"" + param251 + '\x22]');
      if (_0x1aa2ae) {
        !param250._state.splitType && (window.document.getElementById("view-menuitem-split-horizontally").click(), await Zotero.Promise.delay(0x3e8));
        _0x4f70ff = 0x0;
        while (param250._iframeWindow.document.querySelectorAll("iframe").length === 0x1) {
          if (_0x4f70ff >= 0x1f4) {
            return;
          }
          await Zotero.Promise.delay(0xa);
          _0x4f70ff++;
        }
        let var2078 = param250._iframeWindow.document.querySelectorAll("iframe")[0x1].contentWindow;
        switch (var2078.document.readyState) {
          case 'uninitialized':
            {
              let var2079 = 0x0;
              while (var2078.document.readyState === 'uninitialized') {
                if (var2079 >= 0x1f4) return;
                await Zotero.Promise.delay(0xa);
                var2079++;
              }
              var2078.focus();
            }
          case "complete":
            {
              var2078.focus();
            }
        }
        await Zotero.Promise.delay(0x1e);
        _0x1aa2ae?.["querySelector"](".editor-view")?.["click"]();
        await Zotero.Promise.delay(0xc8);
        _0x1aa2ae.scrollIntoView({
          'behavior': "smooth",
          'block': "center"
        });
        return;
      }
    }
    ZoteroPane.loadURI(param252);
    let var2080 = param250._tabContainer.id,
      var2081 = 0x0;
    while (Zotero_Tabs._selectedID === var2080) {
      if (var2081 >= 0xc8) return;
      await Zotero.Promise.delay(0xa);
      var2081++;
    }
    let var2082 = Zotero_Tabs._selectedID,
      var2083 = Zotero.Reader.getByTabID(var2082);
    await var2083._initPromise;
    await var2083._waitForReader();
    let var2084 = var2083._iframeWindow,
      var2085 = true;
    if (!var2083._state.sidebarOpen) {
      var2081 = 0x0;
      while (!var2084.document.querySelector("#sidebarToggle")) {
        if (var2081 >= 0x190) {
          Zotero.debug("AI4Paper: Waiting for sidebarToggle failed");
          return;
        }
        await Zotero.Promise.delay(0x5);
        var2081++;
      }
      let _0x239239 = var2084.document.querySelector("#sidebarToggle");
      !var2083._state.sidebarOpen && (_0x239239.click(), var2085 = false);
    }
    var2081 = 0x0;
    while (!var2084.document.querySelector("[data-sidebar-annotation-id=\"" + param251 + '\x22]')) {
      if (var2081 >= 0x1f4) {
        Zotero.debug("AI4Paper: Waiting for annotationElem failed");
        return;
      }
      await Zotero.Promise.delay(0x5);
      var2081++;
    }
    let var2087 = var2084.document.querySelector("[data-sidebar-annotation-id=\"" + param251 + '\x22]');
    if (var2087?.["querySelector"](".editor-view")) {
      var2087?.["querySelector"](".editor-view")?.["click"]();
      await Zotero.Promise.delay(0xc8);
      var2087.scrollIntoView({
        'behavior': "smooth",
        'block': "center"
      });
    } else {
      if (var2087?.['querySelector'](".image")) {
        var2087?.["querySelector"](".image")?.['click']();
        await Zotero.Promise.delay(0xc8);
        var2087.scrollIntoView({
          'behavior': 'smooth',
          'block': "center"
        });
      }
    }
    !var2085 && (await Zotero.AI4Paper.addAnnotationButton(var2083));
  },

  // === Block D: Tag Ops + Shortcut Handlers + Floating Window ===
  'addTagForSelectedAnnotationsInit': async function () {
    if (Zotero_Tabs._selectedID === "zotero-pane") {
      let _0x391c7e = ZoteroPane.getSelectedItems();
      if (_0x391c7e.length === 0x0) {
        return;
      }
      _0x391c7e.length > 0x1 && (_0x391c7e = _0x391c7e.filter(_0x56d1d4 => _0x56d1d4.isTopLevelItem()));
      Zotero.AI4Paper._data_selectedItemsNum = _0x391c7e.length;
      let _0x251cae = Zotero.AI4Paper.openDialogByType_modal('selectTags', false);
      if (!_0x251cae) {
        return null;
      }
      let _0x3f64f2;
      !_0x251cae.includes("🏷️") ? _0x3f64f2 = [_0x251cae.trim()] : _0x3f64f2 = _0x251cae.substring(0x3).split("🏷️");
      for (let var2211 of _0x391c7e) {
        for (let var2212 of _0x3f64f2) {
          var2211.addTag(var2212);
          await var2211.saveTx();
        }
      }
      return Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 条目标签添加完成", "成功向【" + _0x391c7e.length + "】个条目添加了【" + _0x3f64f2.length + "】个标签。"), true;
    } else {
      let _0x50e35e = this.getCurrentReader(),
        _0x5ecd5e = Zotero.AI4Paper.betterURL();
      if (!_0x50e35e || !_0x5ecd5e) return false;
      if (!_0x50e35e._internalReader._lastView._selectedAnnotationIDs.length) {
        let _0x3e67ae = _0x50e35e.itemID,
          _0x4ee383 = Zotero.Items.get(_0x3e67ae);
        if (_0x4ee383 && _0x4ee383.parentItemID) {
          _0x3e67ae = _0x4ee383.parentItemID;
          _0x4ee383 = Zotero.Items.get(_0x3e67ae);
        } else {
          window.alert("❌ 当前文献缺失父条目，请补充父条目后再执行本操作。");
          return;
        }
        Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20正在添加条目标签', '温馨提示：您正在向父条目添加标签...');
        let _0x47e31a = Zotero.AI4Paper.openDialogByType_modal('selectTags', false);
        if (!_0x47e31a) return null;
        let _0x21395b;
        !_0x47e31a.includes("🏷️") ? _0x21395b = [_0x47e31a.trim()] : _0x21395b = _0x47e31a.substring(0x3).split("🏷️");
        for (let var2219 of _0x21395b) {
          _0x4ee383.addTag(var2219);
          await _0x4ee383.saveTx();
        }
        return Zotero.AI4Paper.showProgressWindow(0xbb8, '✅\x20条目标签添加完成', "成功向当前文献的父条目添加了【" + _0x21395b.length + "】个标签。"), true;
      } else {
        if (_0x50e35e._internalReader._lastView._selectedAnnotationIDs.length === 0x1) {
          let _0x1b8bc2 = _0x50e35e._internalReader._lastView._selectedAnnotationIDs[0x0],
            _0x408d0d = Zotero.Items.get(_0x50e35e.itemID).libraryID,
            _0x21408b = null,
            _0x239180 = 0x0;
          while (!_0x21408b?.["annotationType"]) {
            if (_0x239180 >= 0x12c) {
              Zotero.debug("AI4Paper: Waiting for annotationItem ready failed");
              return;
            }
            _0x21408b = await Zotero.Items.getByLibraryAndKeyAsync(_0x408d0d, _0x1b8bc2);
            await Zotero.Promise.delay(0xa);
            _0x239180++;
          }
          Zotero.AI4Paper.openSelectTagWindow(_0x21408b);
        } else {
          if (_0x50e35e._internalReader._lastView._selectedAnnotationIDs.length > 0x1) {
            let var2224 = [];
            for (let var2225 of _0x50e35e._internalReader._lastView._selectedAnnotationIDs) {
              let var2226 = Zotero.Items.get(_0x50e35e.itemID).libraryID,
                var2227 = await Zotero.Items.getByLibraryAndKeyAsync(var2226, var2225);
              var2224.push(var2227);
            }
            Zotero.AI4Paper.addTagForSelectedAnnotations(var2224);
          }
        }
      }
    }
  },
  'addTagForSelectedAnnotations': async function (param279) {
    let var2228 = Zotero.AI4Paper.getFunMetaTitle();
    if (!var2228) {
      return;
    }
    if (Zotero.Prefs.get('ai4paper.annotationtagsrecent').length === 0x0) {
      var var2229 = [];
    } else {
      var var2229 = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent"));
    }
    let var2230 = [];
    for (let var2231 of var2229) {
      var2230.push(var2231.tag);
    }
    var2230.sort((_0x36cd1a, _0x46a9a1) => {
      return _0x36cd1a.localeCompare(_0x46a9a1, 'zh');
    });
    let var2232 = Zotero.AI4Paper.openDialogByType_modal("selectTags", true);
    if (!var2232) return null;
    if (!var2232.includes("🏷️")) var var2233 = [var2232.trim()];else {
      var var2233 = var2232.substring(0x3).split("🏷️");
    }
    for (let var2234 of param279) {
      for (let var2235 of var2233) {
        var2234.addTag(var2235);
        await var2234.saveTx();
      }
    }
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 标签添加完成", "您同时为【" + param279.length + "】个注释添加了【" + var2233.length + "】个标签。");
  },
  'getBlockQuoteLink_byShortCuts': async function () {
    let var2236 = this.getCurrentReader(),
      var2237 = Zotero.AI4Paper.betterURL();
    if (!var2236 || !var2237) return false;
    if (!var2236._internalReader._lastView._selectedAnnotationIDs.length) return window.alert('请先选中一个注释！'), false;else {
      if (var2236._internalReader._lastView._selectedAnnotationIDs.length === 0x1) {
        let var2238 = var2236._internalReader._lastView._selectedAnnotationIDs[0x0],
          var2239 = Zotero.Items.get(var2236.itemID).libraryID,
          var2240 = null,
          var2241 = 0x0;
        while (!var2240?.["annotationType"]) {
          if (var2241 >= 0x12c) {
            Zotero.debug("AI4Paper: Waiting for annotationItem ready failed");
            return;
          }
          var2240 = await Zotero.Items.getByLibraryAndKeyAsync(var2239, var2238);
          await Zotero.Promise.delay(0xa);
          var2241++;
        }
        Zotero.AI4Paper.getBlockQuoteLink(var2240);
      } else {
        if (var2236._internalReader._lastView._selectedAnnotationIDs.length > 0x1) {
          return window.alert("请仅选择一个注释！"), false;
        }
      }
    }
  },
  'setAnnotationHead_byShortCuts': async function () {
    let var2242 = this.getCurrentReader(),
      var2243 = Zotero.AI4Paper.betterURL();
    if (!var2242 || !var2243) return false;
    if (!var2242._internalReader._lastView._selectedAnnotationIDs.length) return window.alert("请先选中一个注释！"), false;else {
      if (var2242._internalReader._lastView._selectedAnnotationIDs.length === 0x1) {
        let var2244 = var2242._internalReader._lastView._selectedAnnotationIDs[0x0],
          var2245 = Zotero.Items.get(var2242.itemID).libraryID,
          var2246 = null,
          var2247 = 0x0;
        while (!var2246?.["annotationType"]) {
          if (var2247 >= 0x12c) {
            Zotero.debug("AI4Paper: Waiting for annotationItem ready failed");
            return;
          }
          var2246 = await Zotero.Items.getByLibraryAndKeyAsync(var2245, var2244);
          await Zotero.Promise.delay(0xa);
          var2247++;
        }
        Zotero.AI4Paper.setAnnotationHead(var2246);
      } else {
        if (var2242._internalReader._lastView._selectedAnnotationIDs.length > 0x1) {
          return window.alert("请仅选择一个注释！"), false;
        }
      }
    }
  },
  'copyAnnotationLink_byShortCuts': function () {
    let var2248 = this.getCurrentReader(),
      var2249 = Zotero.AI4Paper.betterURL();
    if (!var2248 || !var2249) return false;
    if (!var2248._internalReader._lastView._selectedAnnotationIDs.length) {
      return window.alert('请先选中一个注释！'), false;
    }
    let var2250 = [],
      var2251 = {
        'ids': var2248._internalReader._lastView._selectedAnnotationIDs
      };
    Zotero.AI4Paper.copyAnnotationLink_handler(var2248, var2251);
  },
  'copyAnnotationLinkOnly_byShortCuts': function () {
    let var2252 = this.getCurrentReader(),
      var2253 = Zotero.AI4Paper.betterURL();
    if (!var2252 || !var2253) {
      return false;
    }
    if (!var2252._internalReader._lastView._selectedAnnotationIDs.length) {
      return window.alert("请先选中一个注释！"), false;
    }
    let var2254 = [],
      var2255 = {
        'ids': var2252._internalReader._lastView._selectedAnnotationIDs
      };
    Zotero.AI4Paper.copyAnnotationLinkOnly_handler(var2252, var2255);
  },
  'copyAnnotationLinkMD_byShortCuts': function () {
    let var2256 = this.getCurrentReader(),
      var2257 = Zotero.AI4Paper.betterURL();
    if (!var2256 || !var2257) return false;
    if (!var2256._internalReader._lastView._selectedAnnotationIDs.length) return window.alert("请先选中一个注释！"), false;
    let var2258 = [],
      var2259 = {
        'ids': var2256._internalReader._lastView._selectedAnnotationIDs
      };
    Zotero.AI4Paper.copyAnnotationLinkMD_handler(var2256, var2259);
  },
  'copyAnnotationText_byShortCuts': function () {
    let var2260 = this.getCurrentReader(),
      var2261 = Zotero.AI4Paper.betterURL();
    if (!var2260 || !var2261) {
      return false;
    }
    if (!var2260._internalReader._lastView._selectedAnnotationIDs.length) {
      return window.alert('请先选中一个注释！'), false;
    }
    let var2262 = [],
      var2263 = {
        'ids': var2260._internalReader._lastView._selectedAnnotationIDs
      };
    Zotero.AI4Paper.copyAnnotationText_handler(var2260, var2263);
  },
  'addAnnotationButtonsInFloatingWindow': function (param280) {
    let var2264 = this.getCurrentReader(),
      var2265 = Zotero.AI4Paper.betterURL();
    if (!var2264 || !var2265) return false;
    const var2266 = param280.document;
    let var2267 = param280.document.querySelectorAll("iframe");
    for (let var2268 of var2267) {
      let _0x52a35b = var2268?.["contentWindow"];
      if (Zotero.Prefs.get("ai4paper.enabelColorLabel")) {
        if (_0x52a35b && !_0x52a35b._addColorLabel_AnnotationContextMenu) {
          _0x52a35b._addColorLabel_AnnotationContextMenu = true;
          _0x52a35b.document.addEventListener("pointerdown", async function (param281) {
            if (!Zotero.Prefs.get("ai4paper.enabelColorLabel") || !Zotero.AI4Paper) return;
            if (param281.button === 0x2) {
              await Zotero.Promise.delay(0x5);
              if (!var2264._internalReader._lastView._selectedAnnotationIDs.length) return false;
              let _0x32c803 = 0x0;
              while (!param280.document.querySelector(".context-menu")) {
                if (_0x32c803 >= 0x1f4) {
                  Zotero.debug('AI4Paper:\x20Waiting\x20for\x20context-menu\x20failed');
                  return;
                }
                await Zotero.Promise.delay(0x5);
                _0x32c803++;
              }
              if (param280.document.querySelector(".context-menu")) {
                let var2271 = param280.document.querySelector(".context-menu"),
                  var2272 = 0x0,
                  var2273 = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get('ai4paper.redColorLabel'), Zotero.Prefs.get('ai4paper.greenColorLabel'), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get("ai4paper.orangeColorLabel"), Zotero.Prefs.get("ai4paper.grayColorLabel")],
                  var2274 = var2271.childNodes[0x1].childNodes;
                for (let var2275 of var2274) {
                  let _0x4d1f4c = var2275.innerHTML.indexOf("div>"),
                    _0x2a492a = var2275.innerHTML.substring(0x0, _0x4d1f4c + 0x4);
                  var2275.innerHTML = '' + _0x2a492a + var2273[var2272];
                  var2272++;
                }
              }
            }
          }, false);
        }
      }
      if (Zotero.Prefs.get('ai4paper.enableannotationsvginFloatingWindow')) {
        if (_0x52a35b && !_0x52a35b._addAnnotationButtonsInFloatingWindow) {
          _0x52a35b._addAnnotationButtonsInFloatingWindow = true;
          _0x52a35b.document.addEventListener("pointerdown", async function (param282) {
            if (!Zotero.Prefs.get("ai4paper.enableannotationsvginFloatingWindow") || !Zotero.AI4Paper) return;
            if (param282.button === 0x0 && !var2264._state.sidebarOpen) {
              await Zotero.Promise.delay(0x5);
              if (!var2264._internalReader._lastView._selectedAnnotationIDs.length) return false;
              let _0x4daf58 = 0x0;
              while (!var2266.querySelector(".annotation-popup")) {
                if (_0x4daf58 >= 0xc8) {
                  Zotero.debug("AI4Paper: Waiting for annotation-popup failed");
                  return;
                }
                await Zotero.Promise.delay(0xa);
                _0x4daf58++;
              }
              let _0x1b5bc5 = var2266.querySelector(".annotation-popup");
              _0x1b5bc5.querySelectorAll(".zoteroone-annotation-button").forEach(_0x3c5e4d => _0x3c5e4d.remove());
              let _0x4dd454 = var2264._internalReader._lastView._selectedAnnotationIDs[0x0],
                _0x5815e8 = Zotero.Items.get(var2264.itemID).libraryID,
                _0x581c09 = null,
                _0x3ab5c9 = _0x1b5bc5.querySelector(".more");
              _0x4daf58 = 0x0;
              while (!_0x581c09?.["annotationType"]) {
                if (_0x4daf58 >= 0x12c) {
                  Zotero.debug('Zotero\x20One:\x20Waiting\x20for\x20annotationItem\x20ready\x20failed');
                  return;
                }
                _0x581c09 = await Zotero.Items.getByLibraryAndKeyAsync(_0x5815e8, _0x4dd454);
                await Zotero.Promise.delay(0xa);
                _0x4daf58++;
              }
              Zotero.AI4Paper.createAnnotationButtons(var2266, _0x1b5bc5, _0x3ab5c9, _0x581c09, _0x4dd454);
              Zotero.AI4Paper.createAnnotationButton_VisitUniversalQuoteLink(var2264, var2266, _0x1b5bc5, _0x3ab5c9, _0x581c09, _0x4dd454);
              Zotero.AI4Paper.createAnnotationButton_ZoterAnnotationDate(var2266, _0x1b5bc5, _0x3ab5c9, _0x581c09, _0x4dd454);
            }
          }, false);
        }
      }
    }
  },

  // === Block E: Filtering & Counting ===
  'filterAnnotations': async function (param292, param293) {
    let var2397 = this.getCurrentReader();
    if (!var2397) return;
    let var2398 = param292.document.querySelectorAll(".annotation");
    for (let var2399 of var2398) {
      let var2400 = var2399.getAttribute("data-sidebar-annotation-id");
      if (var2400) {
        let _0xa8c26a = Zotero.Items.get(var2397.itemID).libraryID,
          _0x4c5cad = await Zotero.Items.getByLibraryAndKeyAsync(_0xa8c26a, var2400);
        Zotero.AI4Paper.hiddenORshowAnnotation(param293, _0x4c5cad, var2399);
      }
    }
  },
  'handleNewAnnotationFiltering': async function (param294) {
    if (!Zotero.Prefs.get("ai4paper.enableReaderViewButtonFilterAnnotations")) {
      return;
    }
    let var2403 = this.getCurrentReader();
    if (!var2403) return;
    if (!var2403._state.sidebarOpen) return false;
    let var2404 = var2403._iframeWindow;
    if (!var2404._annotationFilterType || var2404._annotationFilterType === "none") {
      return;
    }
    let var2405 = 0x0;
    while (!var2404.document.querySelector("[data-sidebar-annotation-id=\"" + param294.key + '\x22]')) {
      if (var2405 >= 0x190) {
        Zotero.debug("AI4Paper: Waiting for annotationElem failed");
        return;
      }
      await Zotero.Promise.delay(0x5);
      var2405++;
    }
    let var2406 = var2404.document.querySelector("[data-sidebar-annotation-id=\"" + param294.key + '\x22]');
    if (!var2406) return;
    let var2407 = var2404._annotationFilterType;
    Zotero.AI4Paper.hiddenORshowAnnotation(var2407, param294, var2406);
  },
  'autoFocusNewAnnotation': async function (param295) {
    let var2408 = this.getCurrentReader();
    if (!var2408) return;
    if (!var2408._state.sidebarOpen) return false;
    let var2409 = var2408._iframeWindow,
      var2410 = 0x0;
    while (!var2409.document.querySelector("[data-sidebar-annotation-id=\"" + param295.key + '\x22]')) {
      if (var2410 >= 0xc8) {
        Zotero.debug("AI4Paper: Waiting for annotationElem failed");
        return;
      }
      await Zotero.Promise.delay(0x5);
      var2410++;
    }
    let var2411 = var2409.document.querySelector("[data-sidebar-annotation-id=\"" + param295.key + '\x22]');
    var2411?.["querySelector"]('.editor-view')?.['click']();
  },
  'hiddenORshowAnnotation': function (param296, param297, param298) {
    if (param296 === "none") {
      param298.hidden = false;
    } else {
      if (param296 === "annotationHead") {
        let var2412 = '' + param297.annotationComment;
        var2412.indexOf("<ZH") != -0x1 && var2412.indexOf('/>') != -0x1 ? param298.hidden = false : param298.hidden = true;
      } else {
        if (param296 === 'H1') {
          let _0x3c841b = '' + param297.annotationComment;
          if (_0x3c841b.indexOf("<ZH1>") != -0x1 && _0x3c841b.indexOf("<ZH1/>") != -0x1) {
            param298.hidden = false;
          } else {
            param298.hidden = true;
          }
        } else {
          if (param296 === 'H2') {
            let var2414 = '' + param297.annotationComment;
            var2414.indexOf("<ZH2>") != -0x1 && var2414.indexOf("<ZH2/>") != -0x1 ? param298.hidden = false : param298.hidden = true;
          } else {
            if (param296 === 'H3') {
              let var2415 = '' + param297.annotationComment;
              var2415.indexOf("<ZH3>") != -0x1 && var2415.indexOf("<ZH3/>") != -0x1 ? param298.hidden = false : param298.hidden = true;
            } else {
              if (param296 === 'H4') {
                let _0x428ffd = '' + param297.annotationComment;
                if (_0x428ffd.indexOf("<ZH4>") != -0x1 && _0x428ffd.indexOf("<ZH4/>") != -0x1) {
                  param298.hidden = false;
                } else param298.hidden = true;
              } else {
                if (param296 === 'H5') {
                  let var2417 = '' + param297.annotationComment;
                  var2417.indexOf("<ZH5>") != -0x1 && var2417.indexOf("<ZH5/>") != -0x1 ? param298.hidden = false : param298.hidden = true;
                } else {
                  if (param296 === 'H6') {
                    let _0x20d3fd = '' + param297.annotationComment;
                    _0x20d3fd.indexOf("<ZH6>") != -0x1 && _0x20d3fd.indexOf("<ZH6/>") != -0x1 ? param298.hidden = false : param298.hidden = true;
                  } else {
                    if (param296 === "yellow") {
                      if (param297.annotationColor === '#ffd400') param298.hidden = false;else {
                        param298.hidden = true;
                      }
                    } else {
                      if (param296 === "red") {
                        if (param297.annotationColor === "#ff6666") param298.hidden = false;else {
                          param298.hidden = true;
                        }
                      } else {
                        if (param296 === 'green') param297.annotationColor === "#5fb236" ? param298.hidden = false : param298.hidden = true;else {
                          if (param296 === "blue") {
                            if (param297.annotationColor === "#2ea8e5") {
                              param298.hidden = false;
                            } else param298.hidden = true;
                          } else {
                            if (param296 === "purple") param297.annotationColor === "#a28ae5" ? param298.hidden = false : param298.hidden = true;else {
                              if (param296 === 'magenta') param297.annotationColor === "#e56eee" ? param298.hidden = false : param298.hidden = true;else {
                                if (param296 === "orange") param297.annotationColor === "#f19837" ? param298.hidden = false : param298.hidden = true;else {
                                  if (param296 === "gray") {
                                    if (param297.annotationColor === "#aaaaaa") {
                                      param298.hidden = false;
                                    } else param298.hidden = true;
                                  } else {
                                    if (param296 === "UniversalQuoteLink") {
                                      let var2419 = '' + param297.annotationComment;
                                      if (Zotero.AI4Paper.hasUniversalQuoteLink(var2419)) {
                                        param298.hidden = false;
                                      } else param298.hidden = true;
                                    } else param297.annotationType === param296 ? param298.hidden = false : param298.hidden = true;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'countAnnotations': function (param299) {
    let var2420 = this.getCurrentReader(),
      var2421 = var2420._state.annotations;
    if (param299 === "none") return var2421.length;
    let var2422 = 0x0;
    if (param299 === "annotationHead") for (let var2423 of var2421) {
      var2423.comment.indexOf('<ZH') != -0x1 && var2423.comment.indexOf('/>') != -0x1 && var2422++;
    } else {
      if (param299 === 'H1') {
        for (let var2424 of var2421) {
          var2424.comment.indexOf('<ZH1>') != -0x1 && var2424.comment.indexOf('<ZH1/>') != -0x1 && var2422++;
        }
      } else {
        if (param299 === 'H2') {
          for (let var2425 of var2421) {
            var2425.comment.indexOf("<ZH2>") != -0x1 && var2425.comment.indexOf("<ZH2/>") != -0x1 && var2422++;
          }
        } else {
          if (param299 === 'H3') for (let var2426 of var2421) {
            if (var2426.comment.indexOf('<ZH3>') != -0x1 && var2426.comment.indexOf("<ZH3/>") != -0x1) {
              var2422++;
            }
          } else {
            if (param299 === 'H4') for (let var2427 of var2421) {
              var2427.comment.indexOf("<ZH4>") != -0x1 && var2427.comment.indexOf('<ZH4/>') != -0x1 && var2422++;
            } else {
              if (param299 === 'H5') for (let var2428 of var2421) {
                var2428.comment.indexOf("<ZH5>") != -0x1 && var2428.comment.indexOf('<ZH5/>') != -0x1 && var2422++;
              } else {
                if (param299 === 'H6') for (let var2429 of var2421) {
                  var2429.comment.indexOf("<ZH6>") != -0x1 && var2429.comment.indexOf("<ZH6/>") != -0x1 && var2422++;
                } else {
                  if (param299 === "yellow") for (let var2430 of var2421) {
                    var2430.color === "#ffd400" && var2422++;
                  } else {
                    if (param299 === "red") {
                      for (let var2431 of var2421) {
                        var2431.color === "#ff6666" && var2422++;
                      }
                    } else {
                      if (param299 === "green") {
                        for (let var2432 of var2421) {
                          var2432.color === "#5fb236" && var2422++;
                        }
                      } else {
                        if (param299 === "blue") for (let var2433 of var2421) {
                          var2433.color === '#2ea8e5' && var2422++;
                        } else {
                          if (param299 === "purple") for (let var2434 of var2421) {
                            var2434.color === "#a28ae5" && var2422++;
                          } else {
                            if (param299 === "magenta") for (let var2435 of var2421) {
                              var2435.color === "#e56eee" && var2422++;
                            } else {
                              if (param299 === "orange") {
                                for (let var2436 of var2421) {
                                  var2436.color === "#f19837" && var2422++;
                                }
                              } else {
                                if (param299 === "gray") {
                                  for (let var2437 of var2421) {
                                    var2437.color === "#aaaaaa" && var2422++;
                                  }
                                } else {
                                  if (param299 === "UniversalQuoteLink") for (let var2438 of var2421) {
                                    if (Zotero.AI4Paper.hasUniversalQuoteLink(var2438.comment)) {
                                      var2422++;
                                    }
                                  } else {
                                    if (["highlight", "underline", "note", "text", "image", "ink"].includes(param299)) for (let var2439 of var2421) {
                                      if (var2439.type === param299) {
                                        var2422++;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return var2422;
  },

  // === Block F: Link/Copy Handlers + Sidebar ===
  'copyAnnotationLink_handler': async function (param304, param305) {
    let var2468 = [];
    for (let var2469 of param305.ids) {
      let _0x5b5821 = Zotero.Items.get(param304.itemID).libraryID,
        _0xcf3fd5 = await Zotero.Items.getByLibraryAndKeyAsync(_0x5b5821, var2469),
        _0x5d3dcd = _0xcf3fd5?.["parentItem"]?.['parentItem'];
      if (_0x5d3dcd) {
        let var2473 = Zotero.Date.strToDate(_0x5d3dcd.getField("date", false, true)).year,
          var2474 = '',
          var2475 = '';
        var2475 = var2473 ? var2473 + ',\x20' : '';
        if (_0x5d3dcd.getCreators().length != 0x0) {
          let var2476 = _0x5d3dcd.getCreators()[0x0].firstName,
            var2477 = _0x5d3dcd.getCreators()[0x0].lastName;
          _0x5d3dcd.getCreators().length === 0x1 ? _0x5d3dcd.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1 ? var2474 = var2477 ? var2477 + ',\x20' : '' : var2474 = var2477 ? '' + var2477 + var2476 + ',\x20' : '' : _0x5d3dcd.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1 ? var2474 = var2477 ? var2477 + " et al., " : '' : var2474 = var2477 ? '' + var2477 + var2476 + '\x20et\x20al.,\x20' : '';
        }
        let var2478 = JSON.parse(_0xcf3fd5.annotationPosition).pageIndex + 0x1,
          var2479 = Zotero.AI4Paper.getAnnotationItemLink(_0xcf3fd5),
          var2480 = '[' + var2474 + var2475 + 'p' + var2478 + '](' + var2479 + ')',
          var2481 = (_0xcf3fd5.annotationText ? _0xcf3fd5.annotationText + '\x20' : '') + '(' + var2480 + ')' + (_0xcf3fd5.annotationComment ? '\x20' + _0xcf3fd5.annotationComment : '');
        var2468.push(var2481);
      } else {
        let var2482 = JSON.parse(_0xcf3fd5.annotationPosition).pageIndex + 0x1,
          var2483 = Zotero.AI4Paper.getAnnotationItemLink(_0xcf3fd5),
          var2484 = '[p' + var2482 + '](' + var2483 + ')',
          var2485 = (_0xcf3fd5.annotationText ? _0xcf3fd5.annotationText + '\x20' : '') + '(' + var2484 + ')' + (_0xcf3fd5.annotationComment ? '\x20' + _0xcf3fd5.annotationComment : '');
        var2468.push(var2485);
      }
    }
    var2468.length && (Zotero.AI4Paper.copy2Clipboard(var2468.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0xbb8, var2468.length > 0x1 ? "✅ 拷贝【" + var2468.length + "】条注释【AI4paper】" : "✅ 拷贝注释【AI4paper】", var2468.length > 0x1 ? var2468[0x0] + '\x20...\x20共【' + var2468.length + '】条' : var2468[0x0]));
  },
  'copyAnnotationLinkOnly_handler': async function (param306, param307) {
    let var2486 = [];
    for (let var2487 of param307.ids) {
      let var2488 = Zotero.Items.get(param306.itemID).libraryID,
        var2489 = await Zotero.Items.getByLibraryAndKeyAsync(var2488, var2487),
        var2490 = JSON.parse(var2489.annotationPosition).pageIndex + 0x1,
        var2491 = Zotero.AI4Paper.getAnnotationItemLink(var2489);
      var2486.push(var2491);
    }
    var2486.length && (Zotero.AI4Paper.copy2Clipboard(var2486.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0xbb8, var2486.length > 0x1 ? '✅\x20拷贝【' + var2486.length + "】条注释回链【AI4paper】" : "✅ 拷贝注释回链【AI4paper】", var2486.length > 0x1 ? var2486[0x0] + " ... 共【" + var2486.length + '】条' : var2486[0x0]));
  },
  'copyAnnotationLinkMD_handler': async function (param308, param309) {
    let var2492 = [];
    for (let var2493 of param309.ids) {
      let var2494 = Zotero.Items.get(param308.itemID).libraryID,
        var2495 = await Zotero.Items.getByLibraryAndKeyAsync(var2494, var2493),
        var2496 = var2495?.["parentItem"]?.["parentItem"];
      if (var2496) {
        let _0x2d2a57 = Zotero.Date.strToDate(var2496.getField("date", false, true)).year,
          _0x373d0f = '',
          _0xa66270 = '';
        _0xa66270 = _0x2d2a57 ? _0x2d2a57 + ',\x20' : '';
        if (var2496.getCreators().length != 0x0) {
          let _0x43e4df = var2496.getCreators()[0x0].firstName,
            _0x2c3672 = var2496.getCreators()[0x0].lastName;
          var2496.getCreators().length === 0x1 ? var2496.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 ? _0x373d0f = _0x2c3672 ? _0x2c3672 + ',\x20' : '' : _0x373d0f = _0x2c3672 ? '' + _0x2c3672 + _0x43e4df + ',\x20' : '' : var2496.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 ? _0x373d0f = _0x2c3672 ? _0x2c3672 + " et al., " : '' : _0x373d0f = _0x2c3672 ? '' + _0x2c3672 + _0x43e4df + " et al., " : '';
        }
        let _0x4239bf = JSON.parse(var2495.annotationPosition).pageIndex + 0x1,
          _0x2de271 = Zotero.AI4Paper.getAnnotationItemLink(var2495),
          _0x347020 = '[' + _0x373d0f + _0xa66270 + 'p' + _0x4239bf + '](' + _0x2de271 + ')',
          _0x234735 = _0x347020;
        var2492.push(_0x234735);
      } else {
        let _0x1c51c4 = JSON.parse(var2495.annotationPosition).pageIndex + 0x1,
          _0x3423bb = Zotero.AI4Paper.getAnnotationItemLink(var2495),
          _0x2f090a = '[p' + _0x1c51c4 + '](' + _0x3423bb + ')',
          _0x217947 = _0x2f090a;
        var2492.push(_0x217947);
      }
    }
    var2492.length && (Zotero.AI4Paper.copy2Clipboard(var2492.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0xbb8, var2492.length > 0x1 ? '✅\x20拷贝【' + var2492.length + '】条注释回链（MD）【Zotero\x20One】' : '✅\x20拷贝注释回链（MD）【Zotero\x20One】', var2492.length > 0x1 ? var2492[0x0] + " ... 共【" + var2492.length + '】条' : var2492[0x0]));
  },
  'copyAnnotationText_handler': async function (param310, param311) {
    let var2510 = [];
    for (let var2511 of param311.ids) {
      let _0x56a7b4 = Zotero.Items.get(param310.itemID).libraryID,
        _0x32781c = await Zotero.Items.getByLibraryAndKeyAsync(_0x56a7b4, var2511),
        _0x126c45 = '' + (_0x32781c.annotationText ? _0x32781c.annotationText : '') + (_0x32781c.annotationComment ? '\x0a' + _0x32781c.annotationComment : '');
      _0x126c45 = _0x126c45.replace(/^\s+|\s+$/g, '');
      var2510.push(_0x126c45);
    }
    var2510.length && (Zotero.AI4Paper.copy2Clipboard(var2510.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0xbb8, var2510.length > 0x1 ? '✅\x20拷贝【' + var2510.length + '】条注释文本【Zotero\x20One】' : '✅\x20拷贝注释文本【Zotero\x20One】', var2510.length > 0x1 ? var2510[0x0] + " ... 共【" + var2510.length + '】条' : var2510[0x0]));
  },
  'optimizeSpaces_annotationContextMenu_handler': async function (param312, param313, param314) {
    let var2515 = 0x0;
    for (let var2516 of param313.ids) {
      let _0x50f35c = Zotero.Items.get(param312.itemID).libraryID,
        _0x20e2a1 = await Zotero.Items.getByLibraryAndKeyAsync(_0x50f35c, var2516),
        {
          sourceText: _0x3e2811,
          type: _0x136784
        } = await Zotero.AI4Paper.optimizeSpaces_annotationItem(_0x20e2a1, param314);
      if (_0x136784) var2515++;
    }
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 已优化空格【AI4paper】", "已为【" + var2515 + '/' + param313.ids.length + '】条注释优化空格！');
  },
  'onSidebarToggle': function (param315) {
    let var2519 = this.getCurrentReader(),
      var2520 = param315.document.querySelector('#sidebarToggle');
    if (!var2520) {
      return false;
    }
    if (!var2520._onSidebarToggle) {
      var2520._onSidebarToggle = true;
      var2520.addEventListener("click", async _0x238939 => {
        await Zotero.Promise.delay(0x5);
        if (var2519._state.sidebarOpen) {
          Zotero.AI4Paper.addViewButtons(param315);
          Zotero.AI4Paper.onClickButton_viewAnnotations(param315);
          Zotero.AI4Paper.onClickButton_viewOutline(param315);
          if (var2519._state.annotations.length) {
            let _0xafc177 = 0x0;
            while (!param315.document.querySelector("#annotationsView")?.['querySelector'](".more")) {
              if (_0xafc177 >= 0xc8) {
                Zotero.debug("AI4Paper: Waiting for annotations loading failed");
                return;
              }
              await Zotero.Promise.delay(0xa);
              _0xafc177++;
            }
            await Zotero.Promise.delay(0xa);
            await Zotero.AI4Paper.addAnnotationButton(var2519);
            param315._annotationFilterType && (await Zotero.AI4Paper.filterAnnotations(param315, param315._annotationFilterType));
          }
        }
      }, false);
    }
  },
  'onClickButton_viewAnnotations': async function (param316) {
    let var2522 = this.getCurrentReader(),
      var2523 = 0x0;
    while (!param316.document.querySelector("#viewAnnotations")) {
      if (var2523 >= 0xc8) {
        Zotero.debug('AI4Paper:\x20Waiting\x20for\x20viewAnnotations\x20button\x20failed');
        return;
      }
      await Zotero.Promise.delay(0xa);
      var2523++;
    }
    let var2524 = param316.document.querySelector("#viewAnnotations");
    !var2524._onClickButton && (var2524._onClickButton = true, var2524.addEventListener('click', async _0x3f42b3 => {
      if (var2522._state.annotations.length) {
        let var2525 = 0x0;
        while (!param316.document.querySelector("#annotationsView")?.['querySelector']('.more')) {
          if (var2525 >= 0xc8) {
            Zotero.debug("AI4Paper: Waiting for annotations loading failed");
            return;
          }
          await Zotero.Promise.delay(0xa);
          var2525++;
        }
        await Zotero.Promise.delay(0xa);
        await Zotero.AI4Paper.addAnnotationButton(var2522);
        param316._annotationFilterType && (await Zotero.AI4Paper.filterAnnotations(param316, param316._annotationFilterType));
      }
    }, false));
  },

  // === Block G: Comment Templates + Auto-Note Generation ===
  'addAnnotationCommentTempate': async function (param348, param349) {
    let var2640;
    if (param349) {
      var2640 = param349;
    } else var2640 = Zotero.AI4Paper.openDialogByType_modal("setCommentTemplate");
    if (var2640) for (let var2641 of param348) {
      var2640 = var2640.replace(/🌝/g, '\x0a');
      let var2642 = '' + var2641.annotationComment;
      if (var2642 === 'null') var2641.annotationComment = var2640;else {
        if (var2642 != "null") {
          if (var2642.indexOf(var2640) != -0x1) {
            var var2643 = window.confirm("检测到评论中已经存在该模板，是否继续添加？");
            var2643 && (var2641.annotationComment = var2642 + '\x0a\x0a' + var2640);
          } else var2641.annotationComment = var2642 + '\x0a\x0a' + var2640;
        }
      }
      await var2641.saveTx();
    }
  },
  'addAnnotationCommentTempate_byShortCuts': async function () {
    let var2644 = await Zotero.AI4Paper.getSelectedAnnotationItems();
    if (!var2644) return;
    Zotero.AI4Paper.addAnnotationCommentTempate(var2644);
  },
  'onClickButton_AnnotationCommentTempate': function (param350, param351) {
    let var2645 = [],
      var2646 = Zotero.Prefs.get('ai4paper.annotationCommentTemplate');
    if (!var2646.trim()) {
      Zotero.AI4Paper.addAnnotationCommentTempate(param350);
      return;
    }
    if (var2646) {
      var2645 = var2646.split('\x0a').filter(_0x3e7571 => _0x3e7571 != '' && _0x3e7571.trim() != '');
      if (!var2645.length) {
        Zotero.AI4Paper.addAnnotationCommentTempate(param350);
        return;
      }
      Zotero.AI4Paper.buildPopup_AnnotationCommentTempate(param350, param351, var2645);
    }
  },
  'buildPopup_AnnotationCommentTempate': function (param352, param353, param354) {
    let var2647 = window.document.createXULElement("menupopup");
    var2647.id = 'zoteroone-annotationCommentTempate-menupopup';
    var2647.addEventListener("popuphidden", () => {
      window.document.querySelector("#browser").querySelectorAll("#zoteroone-annotationCommentTempate-menupopup").forEach(_0x2b9489 => _0x2b9489.remove());
    });
    let var2648 = var2647.firstElementChild;
    while (var2648) {
      var2648.remove();
      var2648 = var2647.firstElementChild;
    }
    for (let var2649 of param354) {
      let var2650 = window.document.createXULElement("menuitem");
      var2650.setAttribute('label', var2649);
      var2650.addEventListener("command", _0x552470 => {
        Zotero.AI4Paper.addAnnotationCommentTempate(param352, var2649);
      });
      var2647.appendChild(var2650);
    }
    window.document.querySelector('#browser').querySelectorAll("#zoteroone-annotationCommentTempate-menupopup").forEach(_0x3713dc => _0x3713dc.remove());
    window.document.querySelector("#browser")?.['appendChild'](var2647);
    var2647.openPopup(param353, 'after_start', 0x0, 0x0, false, false);
  },
  'getSelectedAnnotationItems': async function (param355) {
    let var2651 = this.getCurrentReader(),
      var2652 = Zotero.AI4Paper.betterURL();
    if (!var2651 || !var2652) {
      return false;
    }
    if (!var2651._internalReader._lastView._selectedAnnotationIDs.length) {
      return window.alert('请先选中一个注释！'), false;
    }
    if (param355 && var2651._internalReader._lastView._selectedAnnotationIDs.length > 0x1) {
      return window.alert("请仅选择一个注释！"), false;
    }
    let var2653 = [];
    for (let var2654 of var2651._internalReader._lastView._selectedAnnotationIDs) {
      let _0x33e447 = Zotero.Items.get(var2651.itemID).libraryID,
        _0x230adf = await Zotero.Items.getByLibraryAndKeyAsync(_0x33e447, var2654);
      var2653.push(_0x230adf);
    }
    if (var2653.length) {
      return var2653;
    }
    return false;
  },
  'autoAddNoteFromAnnotations': async function (param648) {
    let var3438 = "紧凑型";
    Zotero.Prefs.get("ai4paper.autoannotationsnotelineheight") === "宽松型" ? var3438 = "宽松型" : var3438 = "紧凑型";
    let var3439 = '';
    if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '紫色') {
      var3439 = "#a28ae5";
    } else {
      if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '黄色') var3439 = "#ffd400";else {
        if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '红色') var3439 = "#ff6666";else {
          if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '绿色') var3439 = "#5fb236";else {
            if (Zotero.Prefs.get('ai4paper.annotationcolorselect') === '蓝色') var3439 = "#2ea8e5";else {
              if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === "洋红色") var3439 = "#e56eee";else {
                if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '橘色') var3439 = "#f19837";else Zotero.Prefs.get("ai4paper.annotationcolorselect") === '灰色' && (var3439 = "#aaaaaa");
              }
            }
          }
        }
      }
    }
    let var3440 = '';
    if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '黄色') var3440 = "#ffd400";else {
      if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '红色') {
        var3440 = '#ff6666';
      } else {
        if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '绿色') {
          var3440 = "#5fb236";
        } else {
          if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '蓝色') var3440 = '#2ea8e5';else {
            if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '紫色') var3440 = '#a28ae5';else {
              if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '洋红色') var3440 = "#e56eee";else {
                if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '橘色') var3440 = "#f19837";else Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '灰色' && (var3440 = "#aaaaaa");
              }
            }
          }
        }
      }
    }
    let var3441 = [],
      var3442 = [],
      var3443 = '',
      var3444 = param648.parentItem,
      var3445 = param648.parentItem.parentItem;
    if (var3445 != undefined) {
      var var3446 = var3445.getField('title'),
        var3447 = Zotero.Date.strToDate(var3445.getField('date', false, true)).year;
      if (var3445.getCreators().length != 0x0) {
        var var3448 = var3445.getCreators()[0x0].firstName,
          var3449 = var3445.getCreators()[0x0].lastName,
          var3450 = '-' + var3448,
          var3451 = '-' + var3449,
          var3452 = '-' + var3449 + var3448;
      } else var var3450 = '',
        var3451 = '',
        var3452 = '';
    } else return false;
    let var3453 = "📝 注释笔记 " + var3444.key;
    if (var3445.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1) {
      var var3454 = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + var3444.key + '>>>>>>></h2>' + (var3445 != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + var3447 + var3451 + '-' + var3445.getField("title") + '</span></blockquote>' : '');
    } else {
      var var3454 = '<h2\x20style=\x22color:\x20#ff4757;\x22>📝\x20注释笔记\x20' + var3444.key + ">>>>>>></h2>" + (var3445 != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + var3447 + var3452 + '-' + var3445.getField('title') + '</span></blockquote>' : '');
    }
    var3441.push(var3454);
    if (["application/pdf", "text/html", "application/epub+zip"].includes(var3444.attachmentContentType)) {
      var var3455 = await var3444.getAnnotations().filter(_0x5cc583 => _0x5cc583.annotationType != "ink");
      if (var3455.length) {
        for (let var3456 of var3455) {
          if (!Zotero.Prefs.get("ai4paper.vocabularybookdisable") && var3456.annotationColor === var3439 && var3456.annotationType === "highlight" || var3456.annotationColor === var3440 && var3456.annotationType === "highlight") {
            continue;
          } else {
            let var3457 = var3456.getTags();
            var3442 = [];
            var3443 = '';
            if (var3457.length) {
              for (let var3458 of var3457) {
                var3442.push('#' + var3458.tag);
              }
              var3443 = var3442.join('\x20');
            }
            let var3459 = JSON.parse(var3456.annotationPosition).pageIndex + 0x1,
              var3460 = Zotero.AI4Paper.getAnnotationItemLink(var3456),
              var3461 = " (<a href=\"" + var3460 + '\x22>p' + var3459 + '</a>)',
              var3462 = '',
              var3463 = '',
              var3464 = -0x1;
            if (var3438 === '宽松型') {
              var3462 = '' + var3456.annotationComment;
              var3462 = var3462.replace(/\n+/g, '<br>');
              if (var3456.annotationType === 'image' && var3462.indexOf("![](") != -0x1) {
                var3464 = var3462.indexOf("![](");
                let _0x4ce867 = var3462.substring(var3464),
                  _0x171d3d = _0x4ce867.indexOf(')'),
                  _0x1d3498 = _0x4ce867.substring(0x4, _0x171d3d);
                var3463 = '<img\x20src=\x22' + _0x1d3498 + '\x22\x20width=\x22500px\x22\x20/>';
                let _0x42c16d = '',
                  _0x584007 = '';
                _0x4ce867.length > _0x1d3498.length + 0x5 && (_0x584007 = _0x4ce867.substring(_0x1d3498.length + 0x5));
                if (var3464 != 0x0) {
                  _0x42c16d = var3462.substring(0x0, var3464);
                }
                if (var3456.annotationType === "image") {
                  var3462 = "<br>" + _0x42c16d + _0x584007;
                  if (var3462.substring(var3462.length - 0x4) === "<br>") {
                    var3462 = var3462.substring(0x0, var3462.length - 0x4);
                  }
                } else var3462 = '' + _0x42c16d + _0x584007 + "<br>" + var3463;
                var3462 = var3462.replace(/<br><br>/g, '<br>');
              }
              if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                if (var3456.annotationType === 'image') {
                  var var3470 = "<blockquote><span class=\"image" + var3456.annotationColor + '\x22>' + (var3464 != -0x1 ? var3463 : var3456.annotationText) + "</span>" + (var3456.annotationComment != null ? (var3462 === '<br>' ? '' : var3462) + var3461 : var3461) + (var3443 != '' ? "<p>🏷️ " + var3443 : '') + "</blockquote>";
                } else {
                  if (var3456.annotationType === 'note') {
                    var var3470 = '<blockquote><span\x20class=\x22note\x22\x20style=\x22background-color:\x20' + var3456.annotationColor + "\">note</span>" + (var3456.annotationComment != null ? '<p>' + var3462 + var3461 : var3461) + (var3443 != '' ? "<p>🏷️ " + var3443 : '') + "</blockquote>";
                  } else {
                    var var3470 = "<blockquote><span class=\"highlight\" style=\"background-color: " + var3456.annotationColor + '\x22>' + var3456.annotationText + "</span>" + (var3456.annotationComment != null ? "<p>" + var3462 + var3461 : var3461) + (var3443 != '' ? "<p>🏷️ " + var3443 : '') + "</blockquote>";
                  }
                }
              } else {
                if (var3456.annotationType === "image") {
                  var var3470 = "<blockquote><span>" + (var3464 != -0x1 ? var3463 : var3456.annotationText) + "</span>" + (var3456.annotationComment != null ? (var3462 === "<br>" ? '' : var3462) + var3461 : var3461) + (var3443 != '' ? "<br>🏷️ " + var3443 : '') + '</blockquote>';
                } else {
                  if (var3456.annotationType === 'note') var var3470 = "<blockquote>note" + (var3456.annotationComment != null ? "<br>" + var3462 + var3461 : var3461) + (var3443 != '' ? "<br>🏷️ " + var3443 : '') + "</blockquote>";else var var3470 = "<blockquote>" + var3456.annotationText + (var3456.annotationComment != null ? '<br>' + var3462 + var3461 : var3461) + (var3443 != '' ? "<br>🏷️ " + var3443 : '') + "</blockquote>";
                }
              }
            } else {
              if (var3438 === "紧凑型") {
                var3462 = '' + var3456.annotationComment;
                var3462 = var3462.replace(/\n+/g, "<br>");
                if (var3456.annotationType === "image" && var3462.indexOf("![](") != -0x1) {
                  var3464 = var3462.indexOf("![](");
                  let var3471 = var3462.substring(var3464),
                    var3472 = var3471.indexOf(')'),
                    var3473 = var3471.substring(0x4, var3472);
                  var3463 = "<img src=\"" + var3473 + "\" width=\"500px\" />";
                  let var3474 = '',
                    var3475 = '';
                  var3471.length > var3473.length + 0x5 && (var3475 = var3471.substring(var3473.length + 0x5));
                  var3464 != 0x0 && (var3474 = var3462.substring(0x0, var3464));
                  var3456.annotationType === "image" ? (var3462 = "<br>" + var3474 + var3475, var3462.substring(var3462.length - 0x4) === "<br>" && (var3462 = var3462.substring(0x0, var3462.length - 0x4))) : var3462 = '' + var3474 + var3475 + '<br>' + var3463;
                  var3462 = var3462.replace(/<br><br>/g, "<br>");
                }
                if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                  if (var3456.annotationType === "image") var var3470 = '<blockquote><span\x20class=\x22image' + var3456.annotationColor + '\x22>' + (var3464 != -0x1 ? var3463 : var3456.annotationText) + "</span>" + (var3456.annotationComment != null ? (var3462 === "<br>" ? '' : var3462) + var3461 : var3461) + (var3443 != '' ? "<br>🏷️ " + var3443 : '') + '</blockquote>';else {
                    if (var3456.annotationType === "note") {
                      var var3470 = '<blockquote><span\x20class=\x22note\x22\x20style=\x22background-color:\x20' + var3456.annotationColor + "\">note</span>" + (var3456.annotationComment != null ? '<br>' + var3462 + var3461 : var3461) + (var3443 != '' ? "<br>🏷️ " + var3443 : '') + "</blockquote>";
                    } else var var3470 = '<blockquote><span\x20class=\x22highlight\x22\x20style=\x22background-color:\x20' + var3456.annotationColor + '\x22>' + var3456.annotationText + "</span>" + (var3456.annotationComment != null ? "<br>" + var3462 + var3461 : var3461) + (var3443 != '' ? "<br>🏷️ " + var3443 : '') + '</blockquote>';
                  }
                } else {
                  if (var3456.annotationType === "image") {
                    var var3470 = "<blockquote><span>" + (var3464 != -0x1 ? var3463 : var3456.annotationText) + '</span>' + (var3456.annotationComment != null ? (var3462 === '<br>' ? '' : var3462) + var3461 : var3461) + (var3443 != '' ? "<br>🏷️ " + var3443 : '') + "</blockquote>";
                  } else {
                    if (var3456.annotationType === "note") {
                      var var3470 = "<blockquote>note" + (var3456.annotationComment != null ? '<br>' + var3462 + var3461 : var3461) + (var3443 != '' ? "<br>🏷️ " + var3443 : '') + "</blockquote>";
                    } else var var3470 = "<blockquote>" + var3456.annotationText + (var3456.annotationComment != null ? "<br>" + var3462 + var3461 : var3461) + (var3443 != '' ? "<br>🏷️ " + var3443 : '') + "</blockquote>";
                  }
                }
              }
            }
            var3441.push(var3470);
          }
        }
      }
      if (var3441.length === 0x1) {
        return false;
      }
      var var3476 = await Zotero.AI4Paper.createNoteItem_annotationsNote(param648, var3453);
      var3476 && (var3476.setNote(var3441.join('')), await var3476.saveTx());
    }
  },
  'autoAddNoteFromAnnotationsForModifyListener': async function (param649) {
    let var3477 = "紧凑型";
    if (Zotero.Prefs.get("ai4paper.autoannotationsnotelineheight") === "宽松型") {
      var3477 = "宽松型";
    } else var3477 = "紧凑型";
    let var3478 = '';
    if (Zotero.Prefs.get('ai4paper.annotationcolorselect') === '紫色') var3478 = '#a28ae5';else {
      if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '黄色') var3478 = '#ffd400';else {
        if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '红色') {
          var3478 = "#ff6666";
        } else {
          if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '绿色') var3478 = "#5fb236";else {
            if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '蓝色') var3478 = "#2ea8e5";else {
              if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === "洋红色") var3478 = "#e56eee";else {
                if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '橘色') var3478 = "#f19837";else Zotero.Prefs.get("ai4paper.annotationcolorselect") === '灰色' && (var3478 = "#aaaaaa");
              }
            }
          }
        }
      }
    }
    let var3479 = '';
    if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '黄色') var3479 = '#ffd400';else {
      if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '红色') var3479 = "#ff6666";else {
        if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '绿色') var3479 = "#5fb236";else {
          if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '蓝色') var3479 = "#2ea8e5";else {
            if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '紫色') var3479 = "#a28ae5";else {
              if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "洋红色") var3479 = "#e56eee";else {
                if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '橘色') var3479 = "#f19837";else Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '灰色' && (var3479 = "#aaaaaa");
              }
            }
          }
        }
      }
    }
    let var3480 = [],
      var3481 = [],
      var3482 = '',
      var3483 = param649.parentItem,
      var3484 = param649.parentItem.parentItem;
    if (var3484 != undefined) {
      var var3485 = var3484.getField("title"),
        var3486 = Zotero.Date.strToDate(var3484.getField("date", false, true)).year;
      if (var3484.getCreators().length != 0x0) {
        var var3487 = var3484.getCreators()[0x0].firstName,
          var3488 = var3484.getCreators()[0x0].lastName,
          var3489 = '-' + var3487,
          var3490 = '-' + var3488,
          var3491 = '-' + var3488 + var3487;
      } else var var3489 = '',
        var3490 = '',
        var3491 = '';
    } else return false;
    let var3492 = '📝\x20注释笔记\x20' + var3483.key;
    if (var3484.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1) var var3493 = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + var3483.key + ">>>>>>></h2>" + (var3484 != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + var3486 + var3490 + '-' + var3484.getField('title') + "</span></blockquote>" : '');else {
      var var3493 = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + var3483.key + ">>>>>>></h2>" + (var3484 != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + var3486 + var3491 + '-' + var3484.getField('title') + "</span></blockquote>" : '');
    }
    var3480.push(var3493);
    if (["application/pdf", "text/html", 'application/epub+zip'].includes(var3483.attachmentContentType)) {
      var var3494 = await var3483.getAnnotations().filter(_0x3604cd => _0x3604cd.annotationType != 'ink');
      if (var3494.length) for (let var3495 of var3494) {
        if (!Zotero.Prefs.get("ai4paper.vocabularybookdisable") && var3495.annotationColor === var3478 && var3495.annotationType === "highlight" || var3495.annotationColor === var3479 && var3495.annotationType === "highlight") continue;else {
          let var3496 = var3495.getTags();
          var3481 = [];
          var3482 = '';
          if (var3496.length) {
            for (let var3497 of var3496) {
              var3481.push('#' + var3497.tag);
            }
            var3482 = var3481.join('\x20');
          }
          let var3498 = JSON.parse(var3495.annotationPosition).pageIndex + 0x1,
            var3499 = Zotero.AI4Paper.getAnnotationItemLink(var3495),
            var3500 = " (<a href=\"" + var3499 + '\x22>p' + var3498 + '</a>)',
            var3501 = '',
            var3502 = '',
            var3503 = -0x1;
          if (var3477 === "宽松型") {
            var3501 = '' + var3495.annotationComment;
            var3501 = var3501.replace(/\n+/g, "<br>");
            if (var3495.annotationType === "image" && var3501.indexOf("![](") != -0x1) {
              var3503 = var3501.indexOf("![](");
              let var3504 = var3501.substring(var3503),
                var3505 = var3504.indexOf(')'),
                var3506 = var3504.substring(0x4, var3505);
              var3502 = "<img src=\"" + var3506 + "\" width=\"500px\" />";
              let var3507 = '',
                var3508 = '';
              if (var3504.length > var3506.length + 0x5) {
                var3508 = var3504.substring(var3506.length + 0x5);
              }
              var3503 != 0x0 && (var3507 = var3501.substring(0x0, var3503));
              if (var3495.annotationType === 'image') {
                var3501 = "<br>" + var3507 + var3508;
                var3501.substring(var3501.length - 0x4) === '<br>' && (var3501 = var3501.substring(0x0, var3501.length - 0x4));
              } else var3501 = '' + var3507 + var3508 + "<br>" + var3502;
              var3501 = var3501.replace(/<br><br>/g, "<br>");
            }
            if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
              if (var3495.annotationType === 'image') {
                var var3509 = '<blockquote><span\x20class=\x22image' + var3495.annotationColor + '\x22>' + (var3503 != -0x1 ? var3502 : var3495.annotationText) + "</span>" + (var3495.annotationComment != null ? (var3501 === "<br>" ? '' : var3501) + var3500 : var3500) + (var3482 != '' ? '<p>🏷️\x20' + var3482 : '') + '</blockquote>';
              } else {
                if (var3495.annotationType === "note") var var3509 = "<blockquote><span class=\"note\" style=\"background-color: " + var3495.annotationColor + "\">note</span>" + (var3495.annotationComment != null ? "<p>" + var3501 + var3500 : var3500) + (var3482 != '' ? "<p>🏷️ " + var3482 : '') + "</blockquote>";else var var3509 = "<blockquote><span class=\"highlight\" style=\"background-color: " + var3495.annotationColor + '\x22>' + var3495.annotationText + '</span>' + (var3495.annotationComment != null ? '<p>' + var3501 + var3500 : var3500) + (var3482 != '' ? '<p>🏷️\x20' + var3482 : '') + "</blockquote>";
              }
            } else {
              if (var3495.annotationType === 'image') var var3509 = "<blockquote><span>" + (var3503 != -0x1 ? var3502 : var3495.annotationText) + "</span>" + (var3495.annotationComment != null ? (var3501 === "<br>" ? '' : var3501) + var3500 : var3500) + (var3482 != '' ? "<br>🏷️ " + var3482 : '') + "</blockquote>";else {
                if (var3495.annotationType === "note") var var3509 = "<blockquote>note" + (var3495.annotationComment != null ? "<br>" + var3501 + var3500 : var3500) + (var3482 != '' ? "<br>🏷️ " + var3482 : '') + "</blockquote>";else {
                  var var3509 = "<blockquote>" + var3495.annotationText + (var3495.annotationComment != null ? '<br>' + var3501 + var3500 : var3500) + (var3482 != '' ? "<br>🏷️ " + var3482 : '') + "</blockquote>";
                }
              }
            }
          } else {
            if (var3477 === "紧凑型") {
              var3501 = '' + var3495.annotationComment;
              var3501 = var3501.replace(/\n+/g, "<br>");
              if (var3495.annotationType === 'image' && var3501.indexOf("![](") != -0x1) {
                var3503 = var3501.indexOf("![](");
                let var3510 = var3501.substring(var3503),
                  var3511 = var3510.indexOf(')'),
                  var3512 = var3510.substring(0x4, var3511);
                var3502 = '<img\x20src=\x22' + var3512 + "\" width=\"500px\" />";
                let var3513 = '',
                  var3514 = '';
                var3510.length > var3512.length + 0x5 && (var3514 = var3510.substring(var3512.length + 0x5));
                var3503 != 0x0 && (var3513 = var3501.substring(0x0, var3503));
                var3495.annotationType === "image" ? (var3501 = "<br>" + var3513 + var3514, var3501.substring(var3501.length - 0x4) === "<br>" && (var3501 = var3501.substring(0x0, var3501.length - 0x4))) : var3501 = '' + var3513 + var3514 + '<br>' + var3502;
                var3501 = var3501.replace(/<br><br>/g, "<br>");
              }
              if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                if (var3495.annotationType === "image") var var3509 = '<blockquote><span\x20class=\x22image' + var3495.annotationColor + '\x22>' + (var3503 != -0x1 ? var3502 : var3495.annotationText) + "</span>" + (var3495.annotationComment != null ? (var3501 === "<br>" ? '' : var3501) + var3500 : var3500) + (var3482 != '' ? "<br>🏷️ " + var3482 : '') + "</blockquote>";else {
                  if (var3495.annotationType === "note") var var3509 = "<blockquote><span class=\"note\" style=\"background-color: " + var3495.annotationColor + "\">note</span>" + (var3495.annotationComment != null ? "<br>" + var3501 + var3500 : var3500) + (var3482 != '' ? "<br>🏷️ " + var3482 : '') + "</blockquote>";else var var3509 = "<blockquote><span class=\"highlight\" style=\"background-color: " + var3495.annotationColor + '\x22>' + var3495.annotationText + '</span>' + (var3495.annotationComment != null ? '<br>' + var3501 + var3500 : var3500) + (var3482 != '' ? "<br>🏷️ " + var3482 : '') + "</blockquote>";
                }
              } else {
                if (var3495.annotationType === "image") var var3509 = "<blockquote><span>" + (var3503 != -0x1 ? var3502 : var3495.annotationText) + '</span>' + (var3495.annotationComment != null ? (var3501 === '<br>' ? '' : var3501) + var3500 : var3500) + (var3482 != '' ? "<br>🏷️ " + var3482 : '') + '</blockquote>';else {
                  if (var3495.annotationType === "note") var var3509 = '<blockquote>note' + (var3495.annotationComment != null ? "<br>" + var3501 + var3500 : var3500) + (var3482 != '' ? "<br>🏷️ " + var3482 : '') + "</blockquote>";else var var3509 = "<blockquote>" + var3495.annotationText + (var3495.annotationComment != null ? "<br>" + var3501 + var3500 : var3500) + (var3482 != '' ? '<br>🏷️\x20' + var3482 : '') + "</blockquote>";
                }
              }
            }
          }
          var3480.push(var3509);
        }
      }
      if (var3480.length === 0x1) return false;
      var var3515 = await Zotero.AI4Paper.findNoteItem_annotationsNote(param649, var3492);
      var3515 && (var3515.setNote(var3480.join('')), await var3515.saveTx());
    }
  },
  'autoAddNoteFromAnnotationsForDeleteListener': async function () {
    let var3516 = "紧凑型";
    Zotero.Prefs.get("ai4paper.autoannotationsnotelineheight") === '宽松型' ? var3516 = "宽松型" : var3516 = "紧凑型";
    let var3517 = '';
    if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '紫色') var3517 = "#a28ae5";else {
      if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '黄色') {
        var3517 = "#ffd400";
      } else {
        if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '红色') var3517 = "#ff6666";else {
          if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '绿色') var3517 = "#5fb236";else {
            if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '蓝色') var3517 = '#2ea8e5';else {
              if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === "洋红色") var3517 = "#e56eee";else {
                if (Zotero.Prefs.get("ai4paper.annotationcolorselect") === '橘色') var3517 = "#f19837";else Zotero.Prefs.get('ai4paper.annotationcolorselect') === '灰色' && (var3517 = "#aaaaaa");
              }
            }
          }
        }
      }
    }
    let var3518 = '';
    if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '黄色') var3518 = '#ffd400';else {
      if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '红色') var3518 = "#ff6666";else {
        if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '绿色') var3518 = "#5fb236";else {
          if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '蓝色') var3518 = "#2ea8e5";else {
            if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '紫色') var3518 = "#a28ae5";else {
              if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "洋红色") var3518 = "#e56eee";else {
                if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '橘色') var3518 = "#f19837";else Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '灰色' && (var3518 = "#aaaaaa");
              }
            }
          }
        }
      }
    }
    let var3519 = [],
      var3520 = [],
      var3521 = '',
      var3522 = Zotero_Tabs._selectedID;
    var var3523 = Zotero.Reader.getByTabID(var3522);
    if (var3523) {
      let var3524 = var3523.itemID;
      var var3525 = Zotero.Items.get(var3524);
    } else return false;
    let var3526 = var3525.parentItem;
    if (var3526 != undefined) {
      var var3527 = var3526.getField("title"),
        var3528 = Zotero.Date.strToDate(var3526.getField('date', false, true)).year;
      if (var3526.getCreators().length != 0x0) {
        var var3529 = var3526.getCreators()[0x0].firstName,
          var3530 = var3526.getCreators()[0x0].lastName,
          var3531 = '-' + var3529,
          var3532 = '-' + var3530,
          var3533 = '-' + var3530 + var3529;
      } else {
        var var3531 = '',
          var3532 = '',
          var3533 = '';
      }
    } else return false;
    let var3534 = "📝 注释笔记 " + var3525.key;
    if (var3526.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1) {
      var var3535 = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + var3525.key + ">>>>>>></h2>" + (var3526 != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + var3528 + var3532 + '-' + var3526.getField("title") + "</span></blockquote>" : '');
    } else {
      var var3535 = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + var3525.key + ">>>>>>></h2>" + (var3526 != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + var3528 + var3533 + '-' + var3526.getField("title") + "</span></blockquote>" : '');
    }
    var3519.push(var3535);
    if (["application/pdf", 'text/html', "application/epub+zip"].includes(var3525.attachmentContentType)) {
      var var3536 = await var3525.getAnnotations().filter(_0x5beab6 => _0x5beab6.annotationType != "ink");
      if (var3536.length === 0x0) {
        return await Zotero.AI4Paper.deleteNoteWhenZeroAnnotation(var3534), true;
      }
      if (var3536.length) for (let var3537 of var3536) {
        if (!Zotero.Prefs.get('ai4paper.vocabularybookdisable') && var3537.annotationColor === var3517 && var3537.annotationType === "highlight" || var3537.annotationColor === var3518 && var3537.annotationType === "highlight") continue;else {
          let var3538 = var3537.getTags();
          var3520 = [];
          var3521 = '';
          if (var3538.length) {
            for (let var3539 of var3538) {
              var3520.push('#' + var3539.tag);
            }
            var3521 = var3520.join('\x20');
          }
          let var3540 = JSON.parse(var3537.annotationPosition).pageIndex + 0x1,
            var3541 = Zotero.AI4Paper.getAnnotationItemLink(var3537),
            var3542 = " (<a href=\"" + var3541 + "\">p" + var3540 + '</a>)',
            var3543 = '',
            var3544 = '',
            var3545 = -0x1;
          if (var3516 === '宽松型') {
            var3543 = '' + var3537.annotationComment;
            var3543 = var3543.replace(/\n+/g, '<br>');
            if (var3537.annotationType === "image" && var3543.indexOf("![](") != -0x1) {
              var3545 = var3543.indexOf("![](");
              let _0x55f20c = var3543.substring(var3545),
                _0x143a9a = _0x55f20c.indexOf(')'),
                _0x1b9e56 = _0x55f20c.substring(0x4, _0x143a9a);
              var3544 = '<img\x20src=\x22' + _0x1b9e56 + "\" width=\"500px\" />";
              let _0x409183 = '',
                _0x2fd2b3 = '';
              if (_0x55f20c.length > _0x1b9e56.length + 0x5) {
                _0x2fd2b3 = _0x55f20c.substring(_0x1b9e56.length + 0x5);
              }
              var3545 != 0x0 && (_0x409183 = var3543.substring(0x0, var3545));
              var3537.annotationType === "image" ? (var3543 = "<br>" + _0x409183 + _0x2fd2b3, var3543.substring(var3543.length - 0x4) === "<br>" && (var3543 = var3543.substring(0x0, var3543.length - 0x4))) : var3543 = '' + _0x409183 + _0x2fd2b3 + "<br>" + var3544;
              var3543 = var3543.replace(/<br><br>/g, '<br>');
            }
            if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
              if (var3537.annotationType === "image") var var3551 = "<blockquote><span class=\"image" + var3537.annotationColor + '\x22>' + (var3545 != -0x1 ? var3544 : var3537.annotationText) + '</span>' + (var3537.annotationComment != null ? (var3543 === "<br>" ? '' : var3543) + var3542 : var3542) + (var3521 != '' ? "<p>🏷️ " + var3521 : '') + "</blockquote>";else {
                if (var3537.annotationType === "note") var var3551 = '<blockquote><span\x20class=\x22note\x22\x20style=\x22background-color:\x20' + var3537.annotationColor + '\x22>note</span>' + (var3537.annotationComment != null ? "<p>" + var3543 + var3542 : var3542) + (var3521 != '' ? '<p>🏷️\x20' + var3521 : '') + "</blockquote>";else {
                  var var3551 = "<blockquote><span class=\"highlight\" style=\"background-color: " + var3537.annotationColor + '\x22>' + var3537.annotationText + "</span>" + (var3537.annotationComment != null ? "<p>" + var3543 + var3542 : var3542) + (var3521 != '' ? '<p>🏷️\x20' + var3521 : '') + "</blockquote>";
                }
              }
            } else {
              if (var3537.annotationType === 'image') {
                var var3551 = "<blockquote><span>" + (var3545 != -0x1 ? var3544 : var3537.annotationText) + "</span>" + (var3537.annotationComment != null ? (var3543 === "<br>" ? '' : var3543) + var3542 : var3542) + (var3521 != '' ? "<br>🏷️ " + var3521 : '') + "</blockquote>";
              } else {
                if (var3537.annotationType === "note") {
                  var var3551 = '<blockquote>note' + (var3537.annotationComment != null ? "<br>" + var3543 + var3542 : var3542) + (var3521 != '' ? '<br>🏷️\x20' + var3521 : '') + "</blockquote>";
                } else {
                  var var3551 = "<blockquote>" + var3537.annotationText + (var3537.annotationComment != null ? "<br>" + var3543 + var3542 : var3542) + (var3521 != '' ? "<br>🏷️ " + var3521 : '') + "</blockquote>";
                }
              }
            }
          } else {
            if (var3516 === "紧凑型") {
              var3543 = '' + var3537.annotationComment;
              var3543 = var3543.replace(/\n+/g, "<br>");
              if (var3537.annotationType === "image" && var3543.indexOf('![](') != -0x1) {
                var3545 = var3543.indexOf("![](");
                let var3552 = var3543.substring(var3545),
                  var3553 = var3552.indexOf(')'),
                  var3554 = var3552.substring(0x4, var3553);
                var3544 = "<img src=\"" + var3554 + "\" width=\"500px\" />";
                let var3555 = '',
                  var3556 = '';
                var3552.length > var3554.length + 0x5 && (var3556 = var3552.substring(var3554.length + 0x5));
                var3545 != 0x0 && (var3555 = var3543.substring(0x0, var3545));
                if (var3537.annotationType === "image") {
                  var3543 = "<br>" + var3555 + var3556;
                  var3543.substring(var3543.length - 0x4) === '<br>' && (var3543 = var3543.substring(0x0, var3543.length - 0x4));
                } else {
                  var3543 = '' + var3555 + var3556 + "<br>" + var3544;
                }
                var3543 = var3543.replace(/<br><br>/g, "<br>");
              }
              if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                if (var3537.annotationType === 'image') var var3551 = "<blockquote><span class=\"image" + var3537.annotationColor + '\x22>' + (var3545 != -0x1 ? var3544 : var3537.annotationText) + '</span>' + (var3537.annotationComment != null ? (var3543 === '<br>' ? '' : var3543) + var3542 : var3542) + (var3521 != '' ? "<br>🏷️ " + var3521 : '') + "</blockquote>";else {
                  if (var3537.annotationType === 'note') var var3551 = "<blockquote><span class=\"note\" style=\"background-color: " + var3537.annotationColor + '\x22>note</span>' + (var3537.annotationComment != null ? "<br>" + var3543 + var3542 : var3542) + (var3521 != '' ? "<br>🏷️ " + var3521 : '') + "</blockquote>";else {
                    var var3551 = "<blockquote><span class=\"highlight\" style=\"background-color: " + var3537.annotationColor + '\x22>' + var3537.annotationText + "</span>" + (var3537.annotationComment != null ? "<br>" + var3543 + var3542 : var3542) + (var3521 != '' ? "<br>🏷️ " + var3521 : '') + "</blockquote>";
                  }
                }
              } else {
                if (var3537.annotationType === 'image') var var3551 = '<blockquote><span>' + (var3545 != -0x1 ? var3544 : var3537.annotationText) + '</span>' + (var3537.annotationComment != null ? (var3543 === "<br>" ? '' : var3543) + var3542 : var3542) + (var3521 != '' ? "<br>🏷️ " + var3521 : '') + "</blockquote>";else {
                  if (var3537.annotationType === 'note') var var3551 = "<blockquote>note" + (var3537.annotationComment != null ? "<br>" + var3543 + var3542 : var3542) + (var3521 != '' ? "<br>🏷️ " + var3521 : '') + '</blockquote>';else {
                    var var3551 = "<blockquote>" + var3537.annotationText + (var3537.annotationComment != null ? "<br>" + var3543 + var3542 : var3542) + (var3521 != '' ? "<br>🏷️ " + var3521 : '') + '</blockquote>';
                  }
                }
              }
            }
          }
          var3519.push(var3551);
        }
      }
      if (var3519.length === 0x1) return false;
      let _0x376652 = Zotero.AI4Paper.getCurrentItem(true);
      if (!_0x376652) return false;
      var var3558 = await Zotero.AI4Paper.findNoteItem_annotationsNote(_0x376652, var3534);
      var3558 && (var3558.setNote(var3519.join('')), await var3558.saveTx());
    }
  },
  'createNoteItem_annotationsNote': async function (param650, param651) {
    let var3559 = param650?.["parentItem"]?.["parentItem"];
    if (!var3559 || !var3559.isRegularItem()) return;
    let var3560 = await Zotero.AI4Paper.findNoteItem_annotationsNote(var3559, param651);
    if (var3560) return var3560;else {
      let var3561 = new Zotero.Item("note");
      return var3561.libraryID = var3559.libraryID, var3561.parentKey = var3559.key, await var3561.saveTx(), var3561.addTag('/注释笔记'), await var3561.saveTx(), var3561;
    }
  },
  'findNoteItem_annotationsNote': async function (param652, param653) {
    param652.isAnnotation() && (param652 = param652?.["parentItem"]?.['parentItem']);
    if (!param652 || !param652.isRegularItem()) return;
    let var3562 = param652.getNotes(),
      var3563 = var3562.map(_0x4820d4 => Zotero.Items.get(_0x4820d4)),
      var3564 = var3563.filter(_0xa4866d => _0xa4866d.getNote().includes(param653));
    if (var3564.length > 0x1) {
      for (let var3565 = 0x1; var3565 < var3564.length; var3565++) {
        var3564[var3565].deleted = true;
        await var3564[var3565].saveTx();
      }
    }
    return var3564[0x0] || false;
  },
  'deleteNoteWhenZeroAnnotation': async function (param654) {
    let var3566 = Zotero_Tabs._selectedID;
    var var3567 = Zotero.Reader.getByTabID(var3566);
    if (var3567) {
      let var3568 = var3567.itemID;
      var var3569 = Zotero.Items.get(var3568);
      if (var3569 && var3569.parentItemID) {
        var3568 = var3569.parentItemID;
        var3569 = Zotero.Items.get(var3568);
      }
    } else return false;
    var var3570 = var3569.getNotes();
    for (let var3571 of var3570) {
      let _0x30e9d1 = Zotero.Items.get(var3571),
        _0x42d3c1 = _0x30e9d1.getNote();
      if (_0x42d3c1.indexOf(param654) != -0x1) {
        return _0x30e9d1.deleted = true, await _0x30e9d1.saveTx(), true;
      }
    }
    return false;
  },

  // === Block H: Space Optimization + Annotation Head ===
  'onclickAnnotationButton_optimizeSpaces': async function (param673) {
    let {
      sourceText: _0x81b90b,
      type: _0x4f3b3c
    } = await Zotero.AI4Paper.optimizeSpaces_annotationItem(param673);
    _0x4f3b3c && (Zotero.AI4Paper.copy2Clipboard(_0x81b90b), Zotero.AI4Paper.showProgressWindow(0xbb8, '✅\x20已优化空格【Zotero\x20One】', "已为【" + _0x4f3b3c + "】优化空格！"));
  },
  'optimizeSpaces_annotationItem': async function (param674, param675) {
    let var3639, var3640;
    if (!param675) {
      if (['highlight', 'underline'].includes(param674.annotationType)) {
        var3639 = param674.annotationText;
        var3640 = Zotero.AI4Paper.optimizeSpaces(var3639);
        if (var3640) {
          return param674.annotationText = var3640, await param674.saveTx(), {
            'sourceText': var3639,
            'type': '注释文本'
          };
        }
      } else {
        if (["note", 'text', "image"].includes(param674.annotationType)) {
          var3639 = '' + param674.annotationComment;
          var3640 = Zotero.AI4Paper.optimizeSpaces(var3639);
          if (var3640) return param674.annotationComment = var3640, await param674.saveTx(), {
            'sourceText': var3639,
            'type': '注释评论'
          };
        }
      }
      return {
        'sourceText': var3639,
        'type': ''
      };
    } else {
      if (["highlight", "underline", "note", "text", 'image'].includes(param674.annotationType)) {
        var3639 = '' + param674.annotationComment;
        var3640 = Zotero.AI4Paper.optimizeSpaces(var3639);
        if (var3640) {
          return param674.annotationComment = var3640, await param674.saveTx(), {
            'sourceText': var3639,
            'type': "注释评论"
          };
        }
      }
      return {
        'sourceText': var3639,
        'type': ''
      };
    }
  },
  'optimizeSpaces4CurrentTab': async function (param676) {
    let var3641 = Zotero_Tabs._selectedID,
      var3642 = Zotero.Reader.getByTabID(var3641);
    if (var3642) {
      let var3643 = param676.parentItem;
      if (var3642._item === var3643) {
        if (Zotero.Prefs.get("ai4paper.optimizeSpacesOnly4CNRefs")) {
          let var3644 = param676?.['parentItem']?.["parentItem"];
          if (var3644) {
            const _0x5165ca = ['', 'zh', 'zh-CN', "zh_CN"];
            let _0x776f14 = var3644.getField("language");
            if (!_0x5165ca.includes(_0x776f14)) return;
          }
        }
        optimizedText = Zotero.AI4Paper.optimizeSpaces(param676.annotationText);
        optimizedText && (param676.annotationText = optimizedText, await param676.saveTx());
      }
    }
  },
  'optimizeSpaces': function (param677) {
    try {
      const _0x24b72a = {
          '.': '。',
          ',': '，',
          '!': '！',
          '?': '？',
          ':': '：',
          ';': '；'
        },
        _0x5f3b69 = _0x348d13 => String.fromCharCode(_0x348d13.charCodeAt(0x0) - 0xfee0),
        _0x3232c3 = "[一-龥㐀-䶿豈-﫿]",
        _0x290703 = [];
      let _0xc8d3e0 = 0x0;
      const _0x554519 = (_0x230b98, _0x14e58b = 'default') => {
          const var3653 = '__PLACEHOLDER_' + _0x14e58b + '_' + _0xc8d3e0 + '__';
          return _0x290703.push({
            'placeholder': var3653,
            'content': _0x230b98,
            'type': _0x14e58b
          }), _0xc8d3e0++, var3653;
        },
        _0x4a2187 = _0x1ab83e => {
          let _0x4282d1 = _0x1ab83e;
          for (const {
            placeholder: _0x57de91,
            content: _0x293cd9,
            type: _0x184d59
          } of _0x290703) {
            let _0x1daab4 = _0x293cd9;
            switch (_0x184d59) {
              case "markdown_image":
              case "markdown_link":
                const var3657 = _0x4282d1.indexOf(_0x57de91),
                  var3658 = _0x4282d1[var3657 - 0x1],
                  var3659 = _0x4282d1[var3657 + _0x57de91.length];
                var3658 && var3658 !== '\x0a' && (_0x1daab4 = '\x0a' + _0x1daab4);
                var3659 && var3659 !== '\x0a' && (_0x1daab4 = _0x1daab4 + '\x0a');
                break;
              case "url":
              case "email":
                const var3660 = _0x4282d1.indexOf(_0x57de91),
                  var3661 = _0x4282d1[var3660 - 0x1],
                  var3662 = _0x4282d1[var3660 + _0x57de91.length];
                var3661 && var3661 !== '\x20' && var3661 !== '\x0a' && (_0x1daab4 = '\x20' + _0x1daab4);
                if (var3662 && var3662 !== '\x20' && var3662 !== '\x0a') {
                  _0x1daab4 = _0x1daab4 + '\x20';
                }
                break;
              case 'translation_marker':
                break;
            }
            _0x4282d1 = _0x4282d1.replace(_0x57de91, _0x1daab4);
          }
          return _0x4282d1;
        };
      let _0x3f846a = param677.replace(/【👈\s*译】/g, _0x5694de => _0x554519(_0x5694de, "translation_marker")).replace(/!\[[^\]]*\]\([^)]+\)/g, _0x3c7a85 => _0x554519(_0x3c7a85, "markdown_image")).replace(/\[[^\]]+\]\([^)]+\)/g, _0x221b19 => _0x554519(_0x221b19, 'markdown_link')).replace(/(?:https?|ftp):\/\/[^\s\u4e00-\u9fa5]+/gi, _0x5abaae => _0x554519(_0x5abaae, "url")).replace(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/g, _0xa3bda0 => _0x554519(_0xa3bda0, "email")),
        _0x259892 = _0x3f846a.replace(/[\r\n]/g, '').replace(/[\uE5D2\uE5CF\uE5CE\uE5E5]/g, '').replace(/[Ａ-Ｚａ-ｚ０-９！＂＇（）［］｛｝＜＞，．：；－]/g, _0x5f3b69).replace(/\s+/g, '\x20').replace(/(?<=\d)\s+|\s+(?=\d)/g, '').replace(/\s*(?=[.,:;!?"()\[\]。？！，、；：""''（）《》【】])|(?<=[.,:;!?"()\[\]。？！，、；：""''（）《》【】])\s*/g, '').replace(new RegExp("(\\S)\\s+(?=" + _0x3232c3 + ")|(?<=" + _0x3232c3 + ")\\s+(\\S)", 'g'), "$1$2").replace(new RegExp('(' + _0x3232c3 + "+)([,.!?:;]+)", 'g'), (_0xd4bf11, _0x5edbcc, _0x4a7354) => _0x5edbcc + _0x4a7354.split('').map(_0x226b37 => _0x24b72a[_0x226b37]).join('')).replace(new RegExp("([,.!?:;]+)(" + _0x3232c3 + '+)', 'g'), (_0x58453d, _0x327aaf, _0x10ea2d) => _0x327aaf.split('').map(_0x4d423e => _0x24b72a[_0x4d423e]).join('') + _0x10ea2d).replace(new RegExp("\\(([^()]*" + _0x3232c3 + "[^()]*)\\)|\\[([^\\[\\]]*" + _0x3232c3 + "[^\\[\\]]*)\\]", 'g'), (_0x35f913, _0x55496e, _0xb9fcbf) => _0x55496e ? '（' + _0x55496e + '）' : '【' + _0xb9fcbf + '】').replace(/([0-9a-zA-Z])（/g, '$1' + String.fromCharCode(0xff08)).replace(/）([0-9a-zA-Z])/g, String.fromCharCode(0xff09) + '$1').replace(/([a-zA-Z]+)([,.!?:;]+)([a-zA-Z]+)/g, (_0x47f413, _0xc4a2fa, _0x4a80a2, _0x421bd7) => _0xc4a2fa + _0x4a80a2 + '\x20' + _0x421bd7).replace(/(\S)\(/g, '$1\x20(').replace(new RegExp("\\)(" + _0x3232c3 + ')', 'g'), ')\x20$1').replace(/([,.!?:;)])(?!\s|(?<=\.)\d)/g, "$1 ").replace(/🔤(.*)/g, (_0x3e153c, _0x2b9564) => _0x2b9564.trim() ? "\n🔤" + _0x2b9564 : '🔤');
      return _0x4a2187(_0x259892);
    } catch (_0x19af13) {
      Zotero.debug(_0x19af13);
    }
  },
  'setAnnotationHead': async function (param678) {
    let var3665 = Zotero.AI4Paper.openDialogByType_modal("addAnnotationHead", param678);
    if (!var3665) {
      return false;
    }
    let var3666 = '' + param678.annotationComment;
    if (var3666 === "null") {
      param678.annotationComment = var3665;
    } else {
      if (var3666 != 'null' && var3666.indexOf('<ZH') === -0x1) param678.annotationComment = var3665 + '\x20' + var3666;else {
        if (var3666 != 'null' && var3666.indexOf('<ZH') != -0x1) {
          let var3667 = false,
            var3668 = '';
          if (var3666.indexOf("<ZH1>") != -0x1 && var3666.indexOf("<ZH1/>") != -0x1) {
            var3668 = 'ZH1';
            var3667 = true;
          } else {
            if (var3666.indexOf("<ZH2>") != -0x1 && var3666.indexOf("<ZH2/>") != -0x1) {
              var3668 = 'ZH2';
              var3667 = true;
            } else {
              if (var3666.indexOf("<ZH3>") != -0x1 && var3666.indexOf("<ZH3/>") != -0x1) {
                var3668 = "ZH3";
                var3667 = true;
              } else {
                if (var3666.indexOf('<ZH4>') != -0x1 && var3666.indexOf("<ZH4/>") != -0x1) {
                  var3668 = "ZH4";
                  var3667 = true;
                } else {
                  if (var3666.indexOf('<ZH5>') != -0x1 && var3666.indexOf("<ZH5/>") != -0x1) {
                    var3668 = "ZH5";
                    var3667 = true;
                  } else var3666.indexOf('<ZH6>') != -0x1 && var3666.indexOf('<ZH6/>') != -0x1 && (var3668 = 'ZH6', var3667 = true);
                }
              }
            }
          }
          if (var3667) {
            let _0x42dac5 = var3666.indexOf('<' + var3668 + '>'),
              _0x437100 = var3666.substring(_0x42dac5),
              _0x157997 = _0x437100.indexOf('<' + var3668 + '/>'),
              _0x247764 = _0x437100.substring(0x5, _0x157997),
              _0x176f90 = '',
              _0x27eae7 = '';
            _0x437100.length > _0x247764.length + 0xb && (_0x27eae7 = _0x437100.substring(_0x247764.length + 0xb));
            if (_0x42dac5 != 0x0) {
              _0x176f90 = var3666.substring(0x0, _0x42dac5);
            }
            param678.annotationComment = '' + _0x176f90 + var3665 + _0x27eae7;
          }
        }
      }
    }
    await param678.saveTx();
    Zotero.AI4Paper.handleNewAnnotationFiltering(param678);
  },

  // === Block I: Annotation Item Link ===
  'getAnnotationItemLink': function (param720) {
    let var3825 = Zotero.Libraries.get(param720.libraryID).libraryType;
    if (var3825 === "group") return "zotero://open-pdf/" + Zotero.URI.getLibraryPath(param720.libraryID) + "/items/" + param720.parentKey + '?page=' + (JSON.parse(param720.annotationPosition).pageIndex + 0x1) + '&annotation=' + param720.key;else {
      if (var3825 === "user") return "zotero://open-pdf/library/items/" + param720.parentKey + "?page=" + (JSON.parse(param720.annotationPosition).pageIndex + 0x1) + "&annotation=" + param720.key;
    }
    return undefined;
  },

  // === Block J: Color Label Tagging ===
  'addAnnotationTagBasedOnColorLabel': async function (param1138) {
    let var5993 = {
        'highlight': Zotero.Prefs.get("ai4paper.addTagAnnotationTypeHighlight"),
        'underline': Zotero.Prefs.get("ai4paper.addTagAnnotationTypeUnderline"),
        'note': Zotero.Prefs.get("ai4paper.addTagAnnotationTypeNote"),
        'text': Zotero.Prefs.get("ai4paper.addTagAnnotationTypeText"),
        'image': Zotero.Prefs.get('ai4paper.addTagAnnotationTypeImage'),
        'ink': Zotero.Prefs.get("ai4paper.addTagAnnotationTypeInk")
      },
      var5994 = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get("ai4paper.greenColorLabel"), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get('ai4paper.magentaColorLabel'), Zotero.Prefs.get("ai4paper.orangeColorLabel"), Zotero.Prefs.get("ai4paper.grayColorLabel")],
      var5995 = ["#ffd400", "#ff6666", "#5fb236", "#2ea8e5", "#a28ae5", '#e56eee', '#f19837', "#aaaaaa"],
      var5996 = var5995.indexOf(param1138.annotationColor);
    if (var5996 != -0x1 && var5993[param1138.annotationType]) {
      let var5997 = var5994[var5996];
      if (var5997.trim()) {
        var5997 = var5997.trim();
        if (Zotero.Prefs.get("ai4paper.defineColorLabelAutoAddTagArray")) {
          let var5998 = var5997.split('\x20');
          for (let var5999 of var5998) {
            param1138.addTag(var5999);
            await param1138.saveTx();
          }
        } else {
          param1138.addTag(var5997);
          await param1138.saveTx();
        }
      }
    }
  },

});
