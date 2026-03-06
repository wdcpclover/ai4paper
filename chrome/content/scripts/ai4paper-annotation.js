// ai4paper-annotation.js - Annotation/PDF-annotation infrastructure module
// Extracted from ai4paper.js (Phase 10)

Object.assign(Zotero.AI4Paper, {

  // === Block A+B: Item Annotations + Blockquote + Head ===
  'getItemAnnotations': async function (item) {
    let lineHeight = AI4PaperCore.getNoteLineHeight();
    let vocabColor = AI4PaperCore.getSelectedVocabularyColor();
    let imageWidth = AI4PaperCore.getNoteImageWidth();
    let annotationNotes = [],
      vocabularyNotes = [],
      attachmentIDs = item.getAttachments();
    for (let attachmentID of attachmentIDs) {
      let attachment = Zotero.Items.get(attachmentID),
        annotationBlocks = [],
        vocabBlocks = [],
        tagsList = [],
        tagsStr = '';
      if (item != undefined) {
        var itemTitle = item.getField("title"),
          itemYear = Zotero.Date.strToDate(item.getField("date", false, true)).year,
          authorStr = '',
          yearStr = '';
        yearStr = itemYear ? itemYear + ',\x20' : '';
        if (item.getCreators().length != 0x0) {
          var firstName = item.getCreators()[0x0].firstName,
            lastName = item.getCreators()[0x0].lastName,
            firstNameDash = '-' + firstName,
            lastNameDash = '-' + lastName,
            fullNameDash = '-' + lastName + firstName;
          item.getCreators().length === 0x1 ? item.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 ? authorStr = lastName ? lastName + ',\x20' : '' : authorStr = lastName ? '' + lastName + firstName + ',\x20' : '' : item.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 ? authorStr = lastName ? lastName + " et al., " : '' : authorStr = lastName ? '' + lastName + firstName + " et al., " : '';
        } else var firstNameDash = '',
          lastNameDash = '',
          fullNameDash = '';
      } else return false;
      let annotationNoteTitle = "📝 注释笔记 " + attachment.key,
        vocabNoteTitle = "📙 生词 " + attachment.key;
      if (item.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1) {
        var annotationHeader = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + attachment.key + ">>>>>>></h2>" + (item != undefined ? "<blockquote>WBAWSPANswoMT style=\"font-size: 15px;color: gray\">📍 " + itemYear + lastNameDash + '-' + item.getField("title") + "WBAWSSPANswoMT</blockquote>" : '');
      } else var annotationHeader = '<h2\x20style=\x22color:\x20#ff4757;\x22>📝\x20注释笔记\x20' + attachment.key + ">>>>>>></h2>" + (item != undefined ? "<blockquote>WBAWSPANswoMT style=\"font-size: 15px;color: gray\">📍 " + itemYear + fullNameDash + '-' + item.getField('title') + "WBAWSSPANswoMT</blockquote>" : '');
      if (item.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1) {
        var vocabHeader = '<h2\x20style=\x22color:\x20#ff4757;\x22>📙\x20生词\x20' + attachment.key + ">>>>>>></h2>" + (item != undefined ? "<blockquote>WBAWSPANswoMT style=\"font-size: 15px;color: gray\">📍 " + itemYear + lastNameDash + '-' + item.getField('title') + 'WBAWSSPANswoMT</blockquote>' : '');
      } else var vocabHeader = "<h2 style=\"color: #ff4757;\">📙 生词 " + attachment.key + ">>>>>>></h2>" + (item != undefined ? "<blockquote>WBAWSPANswoMT style=\"font-size: 15px;color: gray\">📍 " + itemYear + fullNameDash + '-' + item.getField("title") + "WBAWSSPANswoMT</blockquote>" : '');
      if (["application/pdf", "text/html", 'application/epub+zip'].includes(attachment.attachmentContentType)) {
        if (attachment.attachmentLinkMode === 0x3) continue;
        var annotations = await attachment.getAnnotations().filter(ann => ann.annotationType != 'ink');
        if (annotations.length) {
          for (let annotation of annotations) {
            let dateSpan = 'WBAWSPANswoMT\x20style=\x22font-size:12px;\x20color:\x20#bdbdbd\x22>' + Zotero.AI4Paper.convertAnnotationDate(annotation.dateAdded) + 'WBAWSSPANswoMT';
            if (!Zotero.Prefs.get('ai4paper.vocabularybookdisable') && AI4PaperCore.isVocabularyAnnotation(annotation)) {
              let vocabTags = annotation.getTags();
              tagsList = [];
              tagsStr = '';
              if (vocabTags.length) {
                for (let vocabTag of vocabTags) {
                  Zotero.Prefs.get("ai4paper.nestedtags") ? (Zotero.Prefs.get("ai4paper.tagspunctuationoptimazation") && (vocabTag.tag = Zotero.AI4Paper.annotationTagOptimization(vocabTag.tag)), tagsList.push("#🔠/" + vocabTag.tag)) : (Zotero.Prefs.get("ai4paper.tagspunctuationoptimazation") && (vocabTag.tag = Zotero.AI4Paper.annotationTagsOptimization(vocabTag.tag)), tagsList.push('#' + vocabTag.tag));
                }
                tagsStr = tagsList.join('\x20');
              }
              let vocabComment = '' + annotation.annotationComment;
              if (vocabComment.substring(vocabComment.length - 0x3) === "```") {
                vocabComment += "<br>";
              }
              vocabComment = vocabComment.replace(/\n+/g, "<br>");
              let vocabPageNum = JSON.parse(annotation.annotationPosition).pageIndex + 0x1,
                vocabLink = Zotero.AI4Paper.getAnnotationItemLink(annotation),
                vocabLinkHtml = '\x20(<a\x20href=\x22' + vocabLink + '\x22>' + authorStr + yearStr + 'p' + vocabPageNum + '</a>)';
              Zotero.Prefs.get('ai4paper.cardlinkstyle') === '页码' && (vocabLinkHtml = " (<a href=\"" + vocabLink + '\x22>p' + vocabPageNum + "</a>)");
              let vocabBlockHtml = "<blockquote>WBAWSPANswoMT class=\"vocabulary\" style=\"background-color: " + annotation.annotationColor + '\x22>' + annotation.annotationText + "WBAWSSPANswoMT" + (annotation.annotationComment != null ? '<br>' + vocabComment + vocabLinkHtml : vocabLinkHtml) + (tagsStr != '' ? "<br>🏷️ " + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + dateSpan : '') + "</blockquote>";
              vocabBlocks.push(vocabBlockHtml);
            }
            if (AI4PaperCore.shouldSkipAutoAnnotation(annotation)) continue;else {
              let annTags = annotation.getTags();
              tagsList = [];
              tagsStr = '';
              if (annTags.length) {
                for (let annTag of annTags) {
                  if (Zotero.Prefs.get("ai4paper.nestedtags")) {
                    if (Zotero.Prefs.get("ai4paper.tagspunctuationoptimazation")) {
                      annTag.tag = Zotero.AI4Paper.annotationTagOptimization(annTag.tag);
                    }
                    if (Zotero.Prefs.get('ai4paper.imagesspecifictags')) annotation.annotationType === "image" ? tagsList.push("#📷/" + annTag.tag) : tagsList.push("#📝/" + annTag.tag);else {
                      tagsList.push("#📝/" + annTag.tag);
                    }
                  } else {
                    if (Zotero.Prefs.get("ai4paper.tagspunctuationoptimazation")) {
                      annTag.tag = Zotero.AI4Paper.annotationTagsOptimization(annTag.tag);
                    }
                    tagsList.push('#' + annTag.tag);
                  }
                }
                tagsStr = tagsList.join('\x20');
              }
              let pageNum = JSON.parse(annotation.annotationPosition).pageIndex + 0x1,
                annotationLink = Zotero.AI4Paper.getAnnotationItemLink(annotation),
                linkHtml = " (<a href=\"" + annotationLink + '\x22>' + authorStr + yearStr + 'p' + pageNum + "</a>)";
              Zotero.Prefs.get("ai4paper.cardlinkstyle") === '页码' && (linkHtml = " (<a href=\"" + annotationLink + '\x22>p' + pageNum + "</a>)");
              let commentText = '',
                imageHtml = '',
                imgIndex = -0x1;
              if (lineHeight === "宽松型") {
                commentText = '' + annotation.annotationComment;
                commentText.substring(commentText.length - 0x3) === "```" && (commentText += "<br>");
                commentText.indexOf("<sup>") != -0x1 && commentText.indexOf('</sup>') != -0x1 && (commentText = commentText.replace(/<sup>/g, "jbslqn"), commentText = commentText.replace(/<\/sup>/g, 'jbsrqn'));
                if (commentText.indexOf("<sub>") != -0x1 && commentText.indexOf('</sub>') != -0x1) {
                  commentText = commentText.replace(/<sub>/g, "jbxlqn");
                  commentText = commentText.replace(/<\/sub>/g, "jbxrqn");
                }
                commentText.indexOf("<i><b>") != -0x1 && commentText.indexOf('</b></i>') != -0x1 && (commentText = commentText.replace(/<i><b>/g, "***"), commentText = commentText.replace(/<\/b><\/i>/g, "***"));
                commentText.indexOf("<b><i>") != -0x1 && commentText.indexOf("</i></b>") != -0x1 && (commentText = commentText.replace(/<b><i>/g, '***'), commentText = commentText.replace(/<\/i><\/b>/g, '***'));
                commentText.indexOf("<b>") != -0x1 && commentText.indexOf("</b>") != -0x1 && (commentText = commentText.replace(/<b>/g, '**'), commentText = commentText.replace(/<\/b>/g, '**'));
                commentText.indexOf('<i>') != -0x1 && commentText.indexOf('</i>') != -0x1 && (commentText = commentText.replace(/<i>/g, "***"), commentText = commentText.replace(/<\/i>/g, "***"));
                commentText = commentText.replace(/\n{2,}/g, "<p>").replace(/\n/g, "<br>");
                if (annotation.annotationType === "image" && commentText.indexOf("![](") != -0x1) {
                  imgIndex = commentText.indexOf('![](');
                  let imgSubstr = commentText.substring(imgIndex),
                    closeParenIdx = imgSubstr.indexOf(')'),
                    imgUrl = imgSubstr.substring(0x4, closeParenIdx);
                  imageHtml = "WBAWIMAGEswoMT src=\"" + imgUrl + "\" width=\"" + imageWidth + '\x22>';
                  let beforeImg = '',
                    afterImg = '';
                  imgSubstr.length > imgUrl.length + 0x5 && (afterImg = imgSubstr.substring(imgUrl.length + 0x5));
                  imgIndex != 0x0 && (beforeImg = commentText.substring(0x0, imgIndex));
                  annotation.annotationType === "image" ? (commentText = "<br>" + beforeImg + afterImg, commentText.substring(commentText.length - 0x4) === "<br>" && (commentText = commentText.substring(0x0, commentText.length - 0x4))) : commentText = '' + beforeImg + afterImg + "<br>" + imageHtml;
                  commentText = commentText.replace(/<br><br>/g, "<br>");
                }
                if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                  if (annotation.annotationType === "image") {
                    var blockHtml = "<blockquote>WBAWSPANswoMT class=\"image" + annotation.annotationColor + '\x22>' + (imgIndex != -0x1 ? imageHtml : annotation.annotationText) + 'WBAWSSPANswoMT' + (annotation.annotationComment != null ? (commentText === '<br>' ? '' : commentText) + linkHtml : linkHtml) + (tagsStr != '' ? "<p>🏷️ " + tagsStr : '') + (Zotero.Prefs.get('ai4paper.generateCardNoteDate') ? "<p>" + dateSpan : '') + '</blockquote>';
                  } else {
                    if (annotation.annotationType === 'note') {
                      var blockHtml = "<blockquote>WBAWSPANswoMT class=\"note\" style=\"background-color: " + annotation.annotationColor + '\x22>noteWBAWSSPANswoMT' + (annotation.annotationComment != null ? "<p>" + commentText + linkHtml : linkHtml) + (tagsStr != '' ? "<p>🏷️ " + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<p>" + dateSpan : '') + '</blockquote>';
                    } else var blockHtml = "<blockquote>WBAWSPANswoMT class=\"highlight\" style=\"background-color: " + annotation.annotationColor + '\x22>' + annotation.annotationText + "WBAWSSPANswoMT" + (annotation.annotationComment != null ? "<p>" + commentText + linkHtml : linkHtml) + (tagsStr != '' ? '<p>🏷️\x20' + tagsStr : '') + (Zotero.Prefs.get('ai4paper.generateCardNoteDate') ? "<p>" + dateSpan : '') + '</blockquote>';
                  }
                } else {
                  if (annotation.annotationType === "image") {
                    var blockHtml = "<blockquote>WBAWSPANNswoMT" + (imgIndex != -0x1 ? imageHtml : annotation.annotationText) + 'WBAWSSPANswoMT' + (annotation.annotationComment != null ? (commentText === '<br>' ? '' : commentText) + linkHtml : linkHtml) + (tagsStr != '' ? "<br>🏷️ " + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + dateSpan : '') + "</blockquote>";
                  } else {
                    if (annotation.annotationType === "note") var blockHtml = '<blockquote>note' + (annotation.annotationComment != null ? "<br>" + commentText + linkHtml : linkHtml) + (tagsStr != '' ? '<br>🏷️\x20' + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + dateSpan : '') + "</blockquote>";else var blockHtml = "<blockquote>" + annotation.annotationText + (annotation.annotationComment != null ? "<br>" + commentText + linkHtml : linkHtml) + (tagsStr != '' ? "<br>🏷️ " + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + dateSpan : '') + "</blockquote>";
                  }
                }
              } else {
                if (lineHeight === "紧凑型") {
                  commentText = '' + annotation.annotationComment;
                  commentText.substring(commentText.length - 0x3) === '```' && (commentText += "<br>");
                  commentText.indexOf('<sup>') != -0x1 && commentText.indexOf("</sup>") != -0x1 && (commentText = commentText.replace(/<sup>/g, 'jbslqn'), commentText = commentText.replace(/<\/sup>/g, "jbsrqn"));
                  commentText.indexOf('<sub>') != -0x1 && commentText.indexOf('</sub>') != -0x1 && (commentText = commentText.replace(/<sub>/g, "jbxlqn"), commentText = commentText.replace(/<\/sub>/g, "jbxrqn"));
                  commentText.indexOf("<i><b>") != -0x1 && commentText.indexOf("</b></i>") != -0x1 && (commentText = commentText.replace(/<i><b>/g, "***"), commentText = commentText.replace(/<\/b><\/i>/g, "***"));
                  commentText.indexOf("<b><i>") != -0x1 && commentText.indexOf("</i></b>") != -0x1 && (commentText = commentText.replace(/<b><i>/g, "***"), commentText = commentText.replace(/<\/i><\/b>/g, "***"));
                  commentText.indexOf('<b>') != -0x1 && commentText.indexOf("</b>") != -0x1 && (commentText = commentText.replace(/<b>/g, '**'), commentText = commentText.replace(/<\/b>/g, '**'));
                  commentText.indexOf("<i>") != -0x1 && commentText.indexOf("</i>") != -0x1 && (commentText = commentText.replace(/<i>/g, '***'), commentText = commentText.replace(/<\/i>/g, '***'));
                  commentText = commentText.replace(/\n{2,}/g, "<p>").replace(/\n/g, '<br>');
                  if (annotation.annotationType === "image" && commentText.indexOf("![](") != -0x1) {
                    imgIndex = commentText.indexOf("![](");
                    let imgSubstr2 = commentText.substring(imgIndex),
                      closeParenIdx2 = imgSubstr2.indexOf(')'),
                      imgUrl2 = imgSubstr2.substring(0x4, closeParenIdx2);
                    imageHtml = 'WBAWIMAGEswoMT\x20src=\x22' + imgUrl2 + "\" width=\"" + imageWidth + '\x22>';
                    let beforeImg2 = '',
                      afterImg2 = '';
                    imgSubstr2.length > imgUrl2.length + 0x5 && (afterImg2 = imgSubstr2.substring(imgUrl2.length + 0x5));
                    if (imgIndex != 0x0) {
                      beforeImg2 = commentText.substring(0x0, imgIndex);
                    }
                    annotation.annotationType === "image" ? (commentText = '<br>' + beforeImg2 + afterImg2, commentText.substring(commentText.length - 0x4) === "<br>" && (commentText = commentText.substring(0x0, commentText.length - 0x4))) : commentText = '' + beforeImg2 + afterImg2 + '<br>' + imageHtml;
                    commentText = commentText.replace(/<br><br>/g, '<br>');
                  }
                  if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                    if (annotation.annotationType === "image") var blockHtml = '<blockquote>WBAWSPANswoMT\x20class=\x22image' + annotation.annotationColor + '\x22>' + (imgIndex != -0x1 ? imageHtml : annotation.annotationText) + "WBAWSSPANswoMT" + (annotation.annotationComment != null ? (commentText === "<br>" ? '' : commentText) + linkHtml : linkHtml) + (tagsStr != '' ? "<br>🏷️ " + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + dateSpan : '') + "</blockquote>";else {
                      if (annotation.annotationType === "note") var blockHtml = '<blockquote>WBAWSPANswoMT\x20class=\x22note\x22\x20style=\x22background-color:\x20' + annotation.annotationColor + "\">noteWBAWSSPANswoMT" + (annotation.annotationComment != null ? "<br>" + commentText + linkHtml : linkHtml) + (tagsStr != '' ? "<br>🏷️ " + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + dateSpan : '') + "</blockquote>";else var blockHtml = '<blockquote>WBAWSPANswoMT\x20class=\x22highlight\x22\x20style=\x22background-color:\x20' + annotation.annotationColor + '\x22>' + annotation.annotationText + "WBAWSSPANswoMT" + (annotation.annotationComment != null ? "<br>" + commentText + linkHtml : linkHtml) + (tagsStr != '' ? "<br>🏷️ " + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + dateSpan : '') + '</blockquote>';
                    }
                  } else {
                    if (annotation.annotationType === "image") {
                      var blockHtml = "<blockquote>WBAWSPANNswoMT" + (imgIndex != -0x1 ? imageHtml : annotation.annotationText) + 'WBAWSSPANswoMT' + (annotation.annotationComment != null ? (commentText === '<br>' ? '' : commentText) + linkHtml : linkHtml) + (tagsStr != '' ? '<br>🏷️\x20' + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + dateSpan : '') + "</blockquote>";
                    } else {
                      if (annotation.annotationType === "note") {
                        var blockHtml = "<blockquote>note" + (annotation.annotationComment != null ? "<br>" + commentText + linkHtml : linkHtml) + (tagsStr != '' ? '<br>🏷️\x20' + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? "<br>" + dateSpan : '') + "</blockquote>";
                      } else var blockHtml = '<blockquote>' + annotation.annotationText + (annotation.annotationComment != null ? "<br>" + commentText + linkHtml : linkHtml) + (tagsStr != '' ? "<br>🏷️ " + tagsStr : '') + (Zotero.Prefs.get("ai4paper.generateCardNoteDate") ? '<br>' + dateSpan : '') + "</blockquote>";
                    }
                  }
                }
              }
              annotationBlocks.push(blockHtml);
            }
          }
        }
        if (annotationBlocks.length > 0x0) {
          let annotationNoteHtml = '' + annotationHeader + annotationBlocks.join('');
          Zotero.Prefs.get('ai4paper.obsidianblockquotemarker') && (annotationNoteHtml = Zotero.AI4Paper.addBlockQuoteMarker(annotationNoteHtml, true));
          annotationNotes.push(annotationNoteHtml);
        }
        if (vocabBlocks.length > 0x0) {
          let vocabNoteHtml = '' + vocabHeader + vocabBlocks.join('');
          Zotero.Prefs.get("ai4paper.obsidianblockquotemarker") && (vocabNoteHtml = Zotero.AI4Paper.addBlockQuoteMarker(vocabNoteHtml, false));
          vocabularyNotes.push(vocabNoteHtml);
        }
      }
    }
    let allAnnotationsHtml = annotationNotes.join("<p>"),
      allVocabHtml = vocabularyNotes.join('<p>');
    return {
      'itemPDFsAnnotationsHTML': allAnnotationsHtml,
      'itemPDFsVocabulariesHTML': allVocabHtml
    };
  },
  'annotationTagOptimization': function (tagStr) {
    return tagStr = tagStr.replace(/\(/g, '（'), tagStr = tagStr.replace(/\)/g, '）'), tagStr = tagStr.replace(/—/g, '_'), tagStr = tagStr.replace(/[\u201c|\u201d|\u2018|\u2019]/g, '_'), tagStr = tagStr.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\?]/g, '_'), tagStr;
  },
  'addBlockQuoteMarker': function (html, isAnnotation) {
    var markers = [],
      startPositions = [],
      endPositions = [],
      processedBlocks = [],
      startRegex = new RegExp("<blockquote>", 'g'),
      endRegex = new RegExp("</blockquote>", 'g');
    while (startRegex.exec(html) != null && endRegex.exec(html) != null) {
      startPositions.push(startRegex.lastIndex);
      endPositions.push(endRegex.lastIndex);
    }
    for (i = 0x0; i < endPositions.length; i++) {
      let blockContent = html.substring(startPositions[i] - 0xc, endPositions[i]);
      blockContent = Zotero.AI4Paper.checkAnnotationHead(blockContent);
      processedBlocks.push(blockContent);
    }
    markers[0x0] = isAnnotation ? "^KEYannotati" : "^KEYvocabula";
    for (i = 0x1; i < endPositions.length; i++) {
      let blockStr = html.substring(startPositions[i] - 0xc, endPositions[i]),
        itemsIdx = blockStr.indexOf("items/"),
        pageIdx = blockStr.indexOf("?page="),
        itemKey = blockStr.substring(itemsIdx + 0x6, pageIdx),
        annotIdx = blockStr.indexOf("&annotation="),
        annotSubstr = blockStr.substring(annotIdx),
        quoteEnd = annotSubstr.indexOf('\x22>'),
        annotationKey = annotSubstr.substring(0xc, quoteEnd),
        markerKey = '' + annotationKey;
      markers.push('<p>^KEY' + markerKey);
    }
    var combinedBlocks = [];
    for (i = 0x0; i < endPositions.length; i++) {
      combinedBlocks.push(processedBlocks[i] + markers[i]);
    }
    let headerStr = html.substring(0x0, startPositions[0x0] - 0xc);
    return headerStr + combinedBlocks.join('');
  },
  'checkAnnotationHead': function (blockHtml) {
    if (blockHtml.indexOf("<ZH") === -0x1) return blockHtml;else {
      let hasHead = false,
        headTag = '';
      if (blockHtml.indexOf("<ZH1>") != -0x1 && blockHtml.indexOf('<ZH1/>') != -0x1) {
        headTag = 'ZH1';
        hasHead = true;
      } else {
        if (blockHtml.indexOf("<ZH2>") != -0x1 && blockHtml.indexOf('<ZH2/>') != -0x1) {
          headTag = "ZH2";
          hasHead = true;
        } else {
          if (blockHtml.indexOf("<ZH3>") != -0x1 && blockHtml.indexOf("<ZH3/>") != -0x1) {
            headTag = "ZH3";
            hasHead = true;
          } else {
            if (blockHtml.indexOf("<ZH4>") != -0x1 && blockHtml.indexOf("<ZH4/>") != -0x1) {
              headTag = 'ZH4';
              hasHead = true;
            } else {
              if (blockHtml.indexOf("<ZH5>") != -0x1 && blockHtml.indexOf("<ZH5/>") != -0x1) {
                headTag = "ZH5";
                hasHead = true;
              } else blockHtml.indexOf("<ZH6>") != -0x1 && blockHtml.indexOf("<ZH6/>") != -0x1 && (headTag = "ZH6", hasHead = true);
            }
          }
        }
      }
      if (hasHead) {
        let headStart = blockHtml.indexOf('<' + headTag + '>'),
          headSubstr = blockHtml.substring(headStart),
          headEnd = headSubstr.indexOf('<' + headTag + '/>'),
          headContent = headSubstr.substring(0x5, headEnd),
          beforeHead = '',
          afterHead = '';
        return headSubstr.length > headContent.length + 0xb && (afterHead = headSubstr.substring(headContent.length + 0xb)), headStart != 0x0 && (beforeHead = blockHtml.substring(0x0, headStart)), '<' + headTag.substring(0x1).toLowerCase() + '>' + headContent.trim() + '</' + headTag.substring(0x1).toLowerCase() + "><p>" + beforeHead + afterHead;
      }
    }
    return blockHtml;
  },

  // === Block C: Annotation Button UI ===
  'addAnnotationButtonInit': async function (newAnnotation) {
    let selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    let hasBetterURL = Zotero.AI4Paper.betterURL();
    if (!reader || !hasBetterURL) {
      return false;
    }
    await reader._initPromise;
    await reader._waitForReader();
    if (!reader._state.sidebarOpen) {
      return false;
    }
    let waitCount = 0x0;
    while (!reader._iframeWindow.document.querySelector('#viewAnnotations')) {
      if (waitCount >= 0x1f4) {
        Zotero.debug("AI4Paper: Waiting for Annotations LeftBar failed");
        return;
      }
      await Zotero.Promise.delay(0x5);
      waitCount++;
    }
    Zotero.AI4Paper.addAnnotationButton(reader);
    Zotero.AI4Paper.handleNewAnnotationFiltering(newAnnotation);
  },
  'addAnnotationButton': async function (readerInstance) {
    const readerDoc = readerInstance._iframeWindow.document;
    for (let moreBtn of readerDoc.getElementsByClassName("more")) {
      let annotationElem = moreBtn.closest('.annotation');
      if (!annotationElem) continue;
      let annotationId = annotationElem.getAttribute('data-sidebar-annotation-id'),
        libraryID = Zotero.Items.get(readerInstance.itemID).libraryID,
        annotationItem = await Zotero.Items.getByLibraryAndKeyAsync(libraryID, annotationId);
      Zotero.AI4Paper.createAnnotationButtons(readerDoc, annotationElem, moreBtn, annotationItem, annotationId);
      Zotero.AI4Paper.createAnnotationButton_VisitUniversalQuoteLink(readerInstance, readerDoc, annotationElem, moreBtn, annotationItem, annotationId);
      Zotero.AI4Paper.createAnnotationButton_ZoterAnnotationDate(readerDoc, annotationElem, moreBtn, annotationItem, annotationId);
    }
  },
  'createAnnotationButtons': function (doc, annotElem, moreButton, annItem, annKey) {
    let colorExcluded = Zotero.AI4Paper.getColorExcluded();
    for (let btnType of Zotero.AI4Paper.annotation_buttons) {
      let btnId = "zoteroone-annotation-button-" + btnType + '-' + annKey,
        btnClass = "toolbar-button zoteroone-annotation-button AI4Paper-Reader-Buttons";
      if (Zotero.Prefs.get("ai4paper." + btnType) && !annotElem.querySelector('#' + btnId)) {
        if (btnType === "enableannotationsvgOptimizeSpaces" && annItem.annotationType != 'ink') {
          let optimizeBtn = doc.createElement("div");
          optimizeBtn.setAttribute('id', btnId);
          optimizeBtn.setAttribute("class", btnClass);
          optimizeBtn.setAttribute("style", "width: 21px; height: 21px;");
          optimizeBtn.title = "优化空格";
          optimizeBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[btnType];
          optimizeBtn.addEventListener('click', evtOptimize => {
            evtOptimize.stopPropagation();
            Zotero.AI4Paper.onclickAnnotationButton_optimizeSpaces(annItem);
          });
          moreButton.before(optimizeBtn);
        }
        if (btnType === "enableannotationsvgSetCommentTemplate" && annItem.annotationType != "ink") {
          let templateBtn = doc.createElement("div");
          templateBtn.setAttribute('id', btnId);
          templateBtn.setAttribute("class", btnClass);
          templateBtn.setAttribute("style", "width: 21px; height: 21px;");
          templateBtn.title = "注释评论模板";
          templateBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[btnType];
          templateBtn.addEventListener("click", evtTemplate => {
            evtTemplate.stopPropagation();
            evtTemplate.shiftKey ? Zotero.AI4Paper.addAnnotationCommentTempate([annItem]) : Zotero.AI4Paper.onClickButton_AnnotationCommentTempate([annItem], templateBtn);
          });
          moreButton.before(templateBtn);
        }
        if (btnType === 'enableannotationsvghead' && (annItem.annotationType === 'highlight' || annItem.annotationType === "note" || annItem.annotationType === 'underline')) {
          let headBtn = doc.createElement("div");
          headBtn.setAttribute('id', btnId);
          headBtn.setAttribute("class", btnClass);
          headBtn.setAttribute("style", "width: 21px; height: 21px;");
          headBtn.title = '大纲标题';
          headBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[btnType];
          headBtn.addEventListener("click", evtHead => {
            evtHead.stopPropagation();
            Zotero.AI4Paper.setAnnotationHead(annItem);
          });
          moreButton.before(headBtn);
        }
        if (btnType === "enableannotationsvgtranslate" && (annItem.annotationType === 'highlight' || annItem.annotationType === "underline")) {
          let translateBtn = doc.createElement("div");
          translateBtn.setAttribute('id', btnId);
          translateBtn.setAttribute("class", btnClass);
          translateBtn.setAttribute("style", 'width:\x2021px;\x20height:\x2021px;');
          translateBtn.title = '注释翻译';
          translateBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[btnType];
          translateBtn.addEventListener("click", evtTranslate => {
            evtTranslate.stopPropagation();
            Zotero.AI4Paper.annotationTextTrans(annItem, "noAuto");
          });
          moreButton.before(translateBtn);
        }
        if (btnType === "enableannotationsvgtagsselect") {
          let tagBtn = doc.createElement("div");
          tagBtn.setAttribute('id', btnId);
          tagBtn.setAttribute("class", btnClass);
          tagBtn.setAttribute("style", 'width:\x2021px;\x20height:\x2021px;');
          tagBtn.title = "添加标签";
          tagBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[btnType];
          tagBtn.addEventListener("click", evtTag => {
            evtTag.stopPropagation();
            evtTag.shiftKey ? Zotero.AI4Paper.onClickButton_AnnotationCommentTempate([annItem], tagBtn) : Zotero.AI4Paper.openSelectTagWindow(annItem);
          });
          moreButton.before(tagBtn);
        }
        if (btnType === "enableannotationsvgblockquotelink") {
          let blockquoteBtn = doc.createElement("div");
          blockquoteBtn.setAttribute('id', btnId);
          blockquoteBtn.setAttribute("class", btnClass);
          blockquoteBtn.setAttribute('style', 'width:\x2021px;\x20height:\x2021px;');
          blockquoteBtn.title = '拷贝块引用链接';
          blockquoteBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[btnType];
          blockquoteBtn.addEventListener("click", evtBlockquote => {
            evtBlockquote.stopPropagation();
            Zotero.AI4Paper.getBlockQuoteLink(annItem);
          });
          moreButton.before(blockquoteBtn);
        }
        if (btnType === 'enableannotationsvgaudioplay' && annItem.annotationType === "highlight" && annItem.annotationText) {
          let trimmedText = ('' + annItem.annotationText).trim();
          if (!Zotero.AI4Paper.isChineseText(trimmedText) && trimmedText.indexOf('\x20') === -0x1 && trimmedText.indexOf('-') === -0x1) {
            let audioBtn = doc.createElement('div');
            audioBtn.setAttribute('id', btnId);
            audioBtn.setAttribute("class", btnClass);
            audioBtn.setAttribute("style", "width: 21px; height: 21px;");
            audioBtn.title = "播放单词发音";
            audioBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[btnType];
            audioBtn.addEventListener("click", evtAudio => {
              evtAudio.stopPropagation();
              Zotero.AI4Paper.annotationAudioPlay(trimmedText);
            });
            moreButton.before(audioBtn);
          }
        }
        if (btnType === 'enableannotationsvgAddWordsToEudic' && (annItem.annotationType === "highlight" || annItem.annotationType === "note" || annItem.annotationType === "underline")) {
          let eudicBtn = doc.createElement("div");
          eudicBtn.setAttribute('id', btnId);
          eudicBtn.setAttribute("class", btnClass);
          eudicBtn.setAttribute("style", "width: 21px; height: 21px;");
          eudicBtn.title = "收藏生词至欧路词典";
          eudicBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[btnType];
          eudicBtn.onclick = evtEudic => {
            evtEudic.stopPropagation();
            Zotero.AI4Paper.addWordsToEudic(annItem.annotationText.trim());
          };
          eudicBtn.addEventListener("pointerdown", evtEudicPtr => {
            evtEudicPtr.preventDefault && evtEudicPtr.preventDefault();
            evtEudicPtr.stopPropagation();
            evtEudicPtr.button == 0x2 && Zotero.AI4Paper.modifyEudicWords(annItem.annotationText.trim());
          }, false);
          moreButton.before(eudicBtn);
        }
        if (btnType === "enableannotationsvguploadimage" && annItem.annotationType === "image") {
          let uploadBtn = doc.createElement("div");
          uploadBtn.setAttribute('id', btnId);
          uploadBtn.setAttribute("class", btnClass);
          uploadBtn.setAttribute("style", "width: 21px; height: 21px;");
          uploadBtn.title = '上传图片';
          uploadBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[btnType];
          uploadBtn.addEventListener('click', evtUpload => {
            evtUpload.stopPropagation();
            Zotero.AI4Paper.getAnnotationImage(annItem, annItem.key);
          });
          moreButton.before(uploadBtn);
        }
        if (btnType === "enableannotationsvgobsidianblock" && !(annItem.annotationColor === colorExcluded && annItem.annotationType === "highlight")) {
          let obsidianBtn = doc.createElement('div');
          obsidianBtn.setAttribute('id', btnId);
          obsidianBtn.setAttribute("class", btnClass);
          obsidianBtn.setAttribute('style', "width: 21px; height: 21px;");
          obsidianBtn.title = "跳转 Obsidian 卡片";
          obsidianBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[btnType];
          obsidianBtn.addEventListener("click", evtObsidian => {
            evtObsidian.stopPropagation();
            Zotero.AI4Paper.go2ObsidianBlock(annItem);
          });
          moreButton.before(obsidianBtn);
        }
      } else {
        if (!Zotero.Prefs.get('ai4paper.' + btnType)) {
          annotElem.querySelectorAll('#' + btnId).forEach(oldBtn => oldBtn.remove());
        }
      }
    }
  },
  'getColorExcluded': function () {
    let excludedColorHex = '';
    if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '黄色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "黄色（高亮）") excludedColorHex = "#ffd400";else {
      if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '红色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "红色（高亮）") excludedColorHex = "#ff6666";else {
        if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '绿色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "绿色（高亮）") excludedColorHex = "#5fb236";else {
          if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '蓝色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "蓝色（高亮）") {
            excludedColorHex = "#2ea8e5";
          } else {
            if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '紫色' || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "紫色（高亮）") excludedColorHex = "#a28ae5";else {
              if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '洋红色' || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "洋红色（高亮）") excludedColorHex = "#e56eee";else {
                if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '橘色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "橘色（高亮）") {
                  excludedColorHex = '#f19837';
                } else {
                  if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '灰色' || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '灰色（高亮）') {
                    excludedColorHex = '#aaaaaa';
                  }
                }
              }
            }
          }
        }
      }
    }
    return excludedColorHex;
  },
  'createAnnotationButton_ZoterAnnotationDate': function (dateDoc, dateAnnotElem, dateMoreBtn, dateAnnItem, dateAnnKey) {
    let dateFeature = 'enableannotationsvgZoterAnnotationDate',
      dateBtnId = "zoteroone-annotation-button-" + dateFeature + '-' + dateAnnKey,
      dateBtnClass = "zoteroone-annotation-button AI4Paper-Reader-Buttons";
    if ((Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationDate") || Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationID")) && !dateDoc.getElementById(dateBtnId)) {
      let dateLabel = dateDoc.createElement("div");
      dateLabel.setAttribute('id', dateBtnId);
      dateLabel.setAttribute("class", dateBtnClass);
      dateLabel.textContent = '' + (Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationDate") ? Zotero.AI4Paper.convertAnnotationDate(dateAnnItem.dateAdded) + '\x20' : '') + (Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationID") ? Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationIDEmoji") + '\x20' + dateAnnKey : '');
      dateLabel.style.color = "gray";
      dateLabel.style.padding = "3px 5px";
      dateLabel.style.borderBottomLeftRadius = "4px";
      dateLabel.style.borderBottomRightRadius = "4px";
      dateAnnotElem.append(dateLabel);
    } else {
      if (!Zotero.Prefs.get("ai4paper.enableannotationsvgZoterAnnotationDate") && !Zotero.Prefs.get('ai4paper.enableannotationsvgZoterAnnotationID')) {
        dateDoc.querySelectorAll('#' + dateBtnId).forEach(oldDateLabel => oldDateLabel.remove());
      }
    }
  },
  'createAnnotationButton_VisitUniversalQuoteLink': function (quoteReader, quoteDoc, quoteAnnotElem, quoteMoreBtn, quoteAnnItem, quoteAnnKey) {
    let quoteLinkFeature = 'enableannotationsvgVisitUniversalQuoteLink',
      quoteLinkBtnId = "zoteroone-annotation-button-" + quoteLinkFeature + '-' + quoteAnnKey,
      quoteLinkBtnClass = "toolbar-button zoteroone-annotation-button AI4Paper-Reader-Buttons";
    if (Zotero.Prefs.get("ai4paper." + quoteLinkFeature) && quoteAnnItem.annotationType != "ink") {
      let commentStr = '' + quoteAnnItem.annotationComment;
      if (commentStr) {
        let quoteLinkInfo = Zotero.AI4Paper.hasUniversalQuoteLink(commentStr);
        if (quoteLinkInfo) {
          quoteAnnotElem.querySelector("header") && (quoteAnnotElem.querySelector("header").title = '');
          let quoteLinkBtn = quoteAnnotElem.querySelector('#' + quoteLinkBtnId);
          if (!quoteLinkBtn) {
            quoteLinkBtn = quoteDoc.createElement("div");
            quoteLinkBtn.setAttribute('id', quoteLinkBtnId);
            quoteLinkBtn.setAttribute("style", "width: 21px; height: 21px;");
            quoteLinkBtn.setAttribute("class", quoteLinkBtnClass);
            quoteLinkBtn.innerHTML = Zotero.AI4Paper.svg_icon_16px[quoteLinkFeature];
            fn4();
            quoteMoreBtn.before(quoteLinkBtn);
          } else {
            fn4();
          }
          function fn4() {
            quoteLinkBtn.onclick = async evtQuoteClick => {
              evtQuoteClick.stopPropagation();
              try {
                let targetAnnotation = await Zotero.Items.getByLibraryAndKeyAsync(Zotero.Items.get(quoteReader.itemID).libraryID, quoteLinkInfo.annotationID);
                if (!targetAnnotation) {
                  Zotero.AI4Paper.showProgressWindow(0xfa0, "❌ 跳转引用卡片【AI4paper】", "引用的注释卡片不存在，可能已被您删除！");
                  return;
                }
                Zotero.AI4Paper.focusAnnotationToGo(quoteReader, quoteLinkInfo.annotationID, quoteLinkInfo.annotationLink);
              } catch (e) {
                Zotero.AI4Paper.showProgressWindow(0xfa0, "❌ 访问通用引用链接失败【AI4paper】", '访问失败，链接可能无效！');
              }
            };
            Zotero.AI4Paper.addContextMenuEvent_UniversalQuoteLinkButton(quoteLinkBtn, quoteReader, quoteLinkInfo, quoteAnnKey, quoteAnnItem);
          }
        }
      }
    } else !Zotero.Prefs.get('ai4paper.' + quoteLinkFeature) && quoteAnnotElem.querySelectorAll('#' + quoteLinkBtnId).forEach(oldQuoteBtn => oldQuoteBtn.remove());
  },
  'addContextMenuEvent_UniversalQuoteLinkButton': function (button, ctxReader, ctxQuoteInfo, ctxAnnKey, ctxAnnItem) {
    let eventType = "onmouseover";
    Zotero.Prefs.get('ai4paper.quotedCardPreviewMethod') === '右键预览' && (eventType = "oncontextmenu");
    button._eventType && (button[button._eventType] = '');
    !button._mouseoutEventAdded && (button._mouseoutEventAdded = true, button.addEventListener("mouseout", async function (mouseoutEvt) {
      if (Zotero.Prefs.get("ai4paper.quotedCardPreviewMethod") != "悬停预览，移出消失") return;
      button._mouseout_state = true;
      let relatedElem = mouseoutEvt.relatedTarget || mouseoutEvt.toElement;
      if (!this.contains(relatedElem)) {
        await Zotero.Promise.delay(0x12c);
        if (window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").length) {
          let previewPanel = window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview")[0x0];
          if (!previewPanel.mouseover_state) {
            window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(oldPreview => oldPreview.remove());
          }
        }
      }
    }));
    button[eventType] = async triggerEvt => {
      triggerEvt.returnValue = false;
      triggerEvt.preventDefault && triggerEvt.preventDefault();
      triggerEvt.stopPropagation();
      button._eventType = eventType;
      button._mouseout_state = false;
      if (window.document.querySelector("#browser").querySelectorAll('.AI4Paper-QuotedAnnotation-Preview').length) {
        let existingPreview = window.document.querySelector("#browser").querySelectorAll('.AI4Paper-QuotedAnnotation-Preview')[0x0];
        if (existingPreview.classList.contains(ctxAnnKey)) return;else window.document.querySelector("#browser").querySelectorAll('.AI4Paper-QuotedAnnotation-Preview').forEach(oldPreview2 => oldPreview2.remove());
      }
      let quotedAnnotation = await Zotero.Items.getByLibraryAndKeyAsync(Zotero.Items.get(ctxReader.itemID).libraryID, ctxQuoteInfo.annotationID);
      if (!quotedAnnotation) {
        let errorPanel = window.document.createXULElement("panel");
        errorPanel.setAttribute("class", "AI4Paper-QuotedAnnotation-Preview " + ctxAnnKey);
        errorPanel.setAttribute("type", "arrow");
        errorPanel.addEventListener("popuphidden", () => {
          window.document.querySelector('#browser').querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(oldErrPanel => oldErrPanel.remove());
        });
        errorPanel.addEventListener('mouseout', async function (panelMouseoutEvt) {
          if (Zotero.Prefs.get("ai4paper.quotedCardPreviewMethod") != "悬停预览，移出消失") {
            return;
          }
          let panelRelated = panelMouseoutEvt.relatedTarget || panelMouseoutEvt.toElement;
          !this.contains(panelRelated) && (await Zotero.Promise.delay(0x12c), button._mouseout_state ? window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(oldPanel => oldPanel.remove()) : errorPanel.mouseover_state = false);
        });
        errorPanel.addEventListener("mouseover", function (panelMouseoverEvt) {
          if (Zotero.Prefs.get("ai4paper.quotedCardPreviewMethod") != "悬停预览，移出消失") {
            return;
          }
          errorPanel.mouseover_state = true;
        });
        let errorVbox = window.document.createXULElement("vbox"),
          errorLabel = window.document.createXULElement('label');
        errorLabel.setAttribute('value', "❌ 引用的注释卡片不存在，可能已被您删除！");
        errorLabel.style = "margin-top: 5px;margin-bottom: 5px;margin-left: -5px;margin-right: -5px;";
        errorVbox.appendChild(errorLabel);
        errorPanel.appendChild(errorVbox);
        window.document.querySelector("#browser").querySelectorAll('.AI4Paper-QuotedAnnotation-Preview').forEach(oldErrPreview => oldErrPreview.remove());
        window.document.querySelector("#browser")?.["appendChild"](errorPanel);
        errorPanel.openPopup(button, "after_start", 0x10, -0x2, false, false);
        return;
      }
      let typeNameMap = {
          'highlight': '高亮',
          'underline': "下划线",
          'note': '笔记',
          'text': '文本',
          'image': '图片',
          'ink': '画笔'
        },
        isDarkMode = Zotero.getMainWindow()?.["matchMedia"]('(prefers-color-scheme:\x20dark)')['matches'],
        previewPopup = window.document.createXULElement("panel");
      previewPopup.setAttribute("class", "AI4Paper-QuotedAnnotation-Preview " + ctxAnnKey);
      previewPopup.setAttribute("type", "arrow");
      previewPopup.style.width = '300px';
      previewPopup.addEventListener("popuphidden", () => {
        window.document.querySelector('#browser').querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(oldPopup2 => oldPopup2.remove());
      });
      previewPopup.addEventListener("mouseout", async function (popupMouseoutEvt) {
        if (Zotero.Prefs.get('ai4paper.quotedCardPreviewMethod') != "悬停预览，移出消失") {
          return;
        }
        let popupRelated = popupMouseoutEvt.relatedTarget || popupMouseoutEvt.toElement;
        if (!this.contains(popupRelated)) {
          await Zotero.Promise.delay(0x12c);
          button._mouseout_state ? window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(oldPopup => oldPopup.remove()) : previewPopup.mouseover_state = false;
        }
      });
      previewPopup.addEventListener("mouseover", function (popupMouseoverEvt) {
        if (Zotero.Prefs.get("ai4paper.quotedCardPreviewMethod") != "悬停预览，移出消失") return;
        previewPopup.mouseover_state = true;
      });
      let previewVbox = window.document.createXULElement('vbox'),
        titleDiv = window.document.createXULElement("div");
      titleDiv.style = "width: 270px;display: inline-block;margin-left: -5px;margin-right: -5px;margin-top: -5px;overflow: hidden;text-overflow: ellipsis;cursor: pointer;white-space: nowrap;";
      titleDiv.textContent = "🎈 " + quotedAnnotation.parentItem.getField('title');
      titleDiv.setAttribute("tooltiptext", quotedAnnotation.parentItem.getField('title'));
      titleDiv.onclick = button.onclick;
      previewVbox.appendChild(titleDiv);
      let infoRow = window.document.createXULElement('div');
      infoRow.style = "display:flex;align-items: center;margin-top: 5px;margin-bottom: 8px;";
      let infoLabel = window.document.createXULElement("label");
      infoLabel.setAttribute('value', "→ 【" + typeNameMap[quotedAnnotation.annotationType] + '型】卡片\x20🆔\x20' + ctxQuoteInfo.annotationID);
      infoLabel.style = "margin-left: -5px;cursor: pointer;";
      infoLabel.onclick = button.onclick;
      infoRow.appendChild(infoLabel);
      let jumpIconDiv = window.document.createXULElement('div');
      jumpIconDiv.innerHTML = Zotero.AI4Paper.svg_icon_20px[quotedAnnotation.annotationType];
      jumpIconDiv.style = 'transform:\x20scale(0.8);margin-left:\x204px;vertical-align:middle';
      jumpIconDiv.setAttribute('tooltiptext', "跳转卡片");
      jumpIconDiv.style.transition = "transform 0.3s ease";
      jumpIconDiv.onmouseover = () => jumpIconDiv.style.transform = "scale(1.2)";
      jumpIconDiv.onmouseout = () => jumpIconDiv.style.transform = 'scale(1)';
      jumpIconDiv.onclick = button.onclick;
      infoRow.appendChild(jumpIconDiv);
      let obsidianIconDiv = window.document.createElement('div');
      obsidianIconDiv.innerHTML = Zotero.AI4Paper.svg_icon_16px.enableannotationsvgobsidianblock;
      obsidianIconDiv.style = 'width:\x2016px;height:\x2016px;margin-left:\x2010px;vertical-align:middle';
      obsidianIconDiv.title = '跳转\x20Obsidian';
      obsidianIconDiv.style.transition = "transform 0.3s ease";
      obsidianIconDiv.onmouseover = () => obsidianIconDiv.style.transform = "scale(1.2)";
      obsidianIconDiv.onmouseout = () => obsidianIconDiv.style.transform = "scale(1)";
      obsidianIconDiv.onmousedown = mouseDownEvt => {
        if (mouseDownEvt.button === 0x0) {
          Zotero.AI4Paper.go2ObsidianBlock(quotedAnnotation);
        }
        if (mouseDownEvt.button === 0x2) {
          Zotero.AI4Paper.go2ObsidianBlock(ctxAnnItem);
        }
      };
      infoRow.appendChild(obsidianIconDiv);
      previewVbox.appendChild(infoRow);
      let textDiv = window.document.createXULElement("div");
      textDiv.setAttribute('id', "AI4Paper-AnnotationText-DIV");
      let textBgColor = !isDarkMode ? "#fffae8" : "#1e1e1e";
      textDiv.style.maxHeight = '100px';
      textDiv.style = 'display:\x20inline-block;background-color:\x20' + textBgColor + ";border-radius: 6px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);padding: 6px;margin-bottom: 6px;margin-left: -5px;margin-right: -5px;overflow-y: auto;overflow-x: hidden;word-wrap: break-word;clear: both;white-space: pre-wrap;-ms-word-break:break-all;";
      textDiv.onmousedown = textRightClick => {
        textRightClick.button === 0x2 && Zotero.AI4Paper.copy2Clipboard(textRightClick.target.textContent);
      };
      if (quotedAnnotation.annotationType === "image" || quotedAnnotation.annotationType === "ink") {
        let imageFound = false,
          imagePath,
          dataDir = Zotero.Prefs.get("extensions.zotero.dataDir", true),
          groupLibID = Zotero.AI4Paper.checkGroupLibItem(quotedAnnotation.parentItem);
        groupLibID ? (imagePath = dataDir + '\x5ccache\x5cgroups\x5c' + groupLibID + '\x5c' + quotedAnnotation.key + ".png", (Zotero.isMac || Zotero.isLinux) && (imagePath = dataDir + "/cache/groups/" + groupLibID + '/' + quotedAnnotation.key + ".png")) : (imagePath = dataDir + "\\cache\\library\\" + quotedAnnotation.key + ".png", (Zotero.isMac || Zotero.isLinux) && (imagePath = dataDir + '/cache/library/' + quotedAnnotation.key + ".png"));
        if (imagePath && (await OS.File.exists(imagePath))) {
          imageFound = true;
          let binaryData = await Zotero.File.getBinaryContentsAsync(imagePath),
            imageDataURL = "data:image/png;base64," + btoa(binaryData),
            imageElem = window.document.createXULElement("image");
          imageElem.src = imageDataURL;
          imageElem.style.width = "260px";
          textDiv.textContent = '';
          textDiv.style.display = "flex";
          textDiv.style.aligntems = "center";
          textDiv.style.justifyContent = 'center';
          !isDarkMode && (textDiv.style.backgroundColor = '');
          textDiv.style.maxHeight = window.screen.height >= 0x3e8 ? "1000px" : '900px';
          textDiv.onmousedown = textMouseDown => {
            if (textMouseDown.button === 0x2) {
              Zotero.AI4Paper.copyImage(imageDataURL);
            }
          };
          textDiv.appendChild(imageElem);
        } else {
          if (quotedAnnotation.annotationComment) {
            let commentContent = '' + quotedAnnotation.annotationComment,
              imgMarkdownIdx = commentContent.indexOf("![](");
            if (imgMarkdownIdx != -0x1) {
              let imgMarkdownRest = commentContent.substring(imgMarkdownIdx + 0x4),
                imgCloseIdx = imgMarkdownRest.indexOf(')');
              if (imgCloseIdx != -0x1) {
                imageFound = true;
                imagePath = imgMarkdownRest.substring(0x0, imgCloseIdx);
                let commentImageElem = window.document.createXULElement("image");
                commentImageElem.src = imagePath;
                commentImageElem.style.width = "260px";
                textDiv.textContent = '';
                textDiv.style.display = "flex";
                textDiv.style.aligntems = "center";
                textDiv.style.justifyContent = "center";
                !isDarkMode && (textDiv.style.backgroundColor = '');
                textDiv.style.maxHeight = window.screen.height >= 0x3e8 ? "1000px" : "900px";
                textDiv.onmousedown = async commentImgMouseDown => {
                  if (commentImgMouseDown.button === 0x2) {
                    let annotDataURL = await Zotero.AI4Paper.getImageDataURL(quotedAnnotation);
                    annotDataURL ? Zotero.AI4Paper.copyImage(annotDataURL) : Zotero.AI4Paper.copy2Clipboard(imagePath);
                  }
                };
                textDiv.appendChild(commentImageElem);
              }
            }
          }
        }
        !imageFound && (textDiv.textContent = '未发现图床链接，因此无法预览图片！');
      }
      previewVbox.appendChild(textDiv);
      ['note', "text"].includes(quotedAnnotation.annotationType) && (textDiv.style.display = "none");
      let commentDiv = window.document.createXULElement('div');
      commentDiv.setAttribute('id', 'AI4Paper-AnnotationComment-DIV');
      let commentBgColor = !isDarkMode ? "#f1fafb" : '#1e1e1e';
      commentDiv.style.maxHeight = "100px";
      commentDiv.style = 'display:\x20inline-block;background-color:\x20' + commentBgColor + ";border-radius: 6px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);padding: 6px;margin-top: 6px;margin-left: -5px;margin-right: -5px;overflow-y: auto;overflow-x: hidden;word-wrap: break-word;clear: both;white-space: pre-wrap;-ms-word-break:break-all;";
      commentDiv.onmousedown = commentRightClick => {
        commentRightClick.button === 0x2 && Zotero.AI4Paper.copy2Clipboard(commentRightClick.target.textContent);
      };
      previewVbox.appendChild(commentDiv);
      let tagsDiv = window.document.createXULElement("div");
      tagsDiv.setAttribute('id', 'AI4Paper-AnnotationTags-DIV');
      let tagsBgColor = !isDarkMode ? '' : '#1c1b22';
      tagsDiv.style.maxHeight = "85px";
      tagsDiv.style = "background-color: " + tagsBgColor + ";display:block;align-items: center;border-radius: 6px;box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);padding-left: 2px;padding-top: 5px;padding-bottom: 5px;margin-top: 12px;margin-bottom: -5px;margin-left: -5px;margin-right: -5px;overflow-y: auto;overflow-x: hidden;";
      previewVbox.appendChild(tagsDiv);
      previewPopup.appendChild(previewVbox);
      window.document.querySelector("#browser").querySelectorAll(".AI4Paper-QuotedAnnotation-Preview").forEach(oldPreview3 => oldPreview3.remove());
      window.document.querySelector("#browser")?.["appendChild"](previewPopup);
      previewPopup.openPopup(button, "after_start", 0x10, -0x2, false, false);
      quotedAnnotation.annotationType != "image" && quotedAnnotation.annotationType != 'ink' && (quotedAnnotation.annotationText ? textDiv.textContent = '' + quotedAnnotation.annotationText : textDiv.textContent = "[注释文本为空]", textDiv.style.height = "auto", textDiv.style.height = Math.min(textDiv.scrollHeight, 0x64) + 'px');
      quotedAnnotation.annotationComment ? commentDiv.textContent = quotedAnnotation.annotationComment : commentDiv.textContent = '[注释评论为空]';
      commentDiv.style.height = "auto";
      commentDiv.style.height = Math.min(commentDiv.scrollHeight, 0x64) + 'px';
      let tagNames = quotedAnnotation.getTags().map(tagItem => '' + tagItem.tag),
        tagColorStyles = [{
          'bgColor': !isDarkMode ? "#f8efe5" : "#23222b",
          'fontColor': '#c58517'
        }, {
          'bgColor': !isDarkMode ? '#ecf3e7' : '#23222b',
          'fontColor': "#739a4a"
        }, {
          'bgColor': !isDarkMode ? '#f5ecfe' : "#23222b",
          'fontColor': "#8e49ff"
        }, {
          'bgColor': !isDarkMode ? "#f9e9e9" : "#23222b",
          'fontColor': "#d6064c"
        }, {
          'bgColor': !isDarkMode ? "#e9f4ff" : "#23222b",
          'fontColor': "#2897f7"
        }, {
          'bgColor': !isDarkMode ? "#fef1e5" : "#23222b",
          'fontColor': "#fe6f08"
        }, {
          'bgColor': !isDarkMode ? '#e6f8e9' : "#23222b",
          'fontColor': "#26ab39"
        }, {
          'bgColor': !isDarkMode ? "#faedfe" : "#23222b",
          'fontColor': "#e434e1"
        }, {
          'bgColor': !isDarkMode ? '#ffedf1' : "#23222b",
          'fontColor': "#ff5474"
        }, {
          'bgColor': !isDarkMode ? '#f3f3f3' : "#23222b",
          'fontColor': "#909090"
        }];
      if (tagNames.length) {
        for (let tagName of tagNames) {
          let colorIdx = Math.floor(Math.random() * 0xa),
            tagLabel = window.document.createXULElement('label');
          tagLabel.setAttribute("value", tagName);
          tagLabel.style = "border-radius: 5px;margin-right: 2px;background-color: " + tagColorStyles[colorIdx].bgColor + ";color: " + tagColorStyles[colorIdx].fontColor + ";padding: 3px;cursor: pointer;";
          tagLabel.onmousedown = tagMouseDown => {
            tagMouseDown.button === 0x0 && Zotero.AI4Paper.jump2TagCardNotes(tagName);
            tagMouseDown.button === 0x2 && Zotero.AI4Paper.copy2Clipboard(tagName);
          };
          tagsDiv.appendChild(tagLabel);
        }
        tagsDiv.style.height = "auto";
        tagsDiv.style.height = Math.min(tagsDiv.scrollHeight, 0x55) + 'px';
      } else {
        tagsDiv.style.display = 'none';
      }
    };
  },
  'convertAnnotationDate': function (dateStr) {
    const date = new Date(dateStr);
    date.setHours(date.getHours() + 0x8);
    const year = date.getFullYear(),
      month = (date.getMonth() + 0x1).toString().padStart(0x2, '0'),
      day = date.getDate().toString().padStart(0x2, '0'),
      hours = date.getHours().toString().padStart(0x2, '0'),
      minutes = date.getMinutes().toString().padStart(0x2, '0'),
      seconds = date.getSeconds().toString().padStart(0x2, '0'),
      formatted = year + '-' + month + '-' + day + '\x20' + hours + ':' + minutes;
    return formatted;
  },
  'focusAnnotationToGo': async function (focusReader, focusAnnotKey, focusAnnotLink) {
    if (focusAnnotLink.indexOf(focusReader._item.key) != -0x1) {
      let sidebarWasOpen = true;
      if (!focusReader._state.sidebarOpen) {
        let sidebarWaitCount = 0x0;
        while (!focusReader._iframeWindow.document.querySelector('#sidebarToggle')) {
          if (sidebarWaitCount >= 0x190) {
            Zotero.debug('AI4Paper:\x20Waiting\x20for\x20sidebarToggle\x20failed');
            return;
          }
          await Zotero.Promise.delay(0x5);
          sidebarWaitCount++;
        }
        let sidebarToggle = focusReader._iframeWindow.document.querySelector("#sidebarToggle");
        !focusReader._state.sidebarOpen && (sidebarToggle.click(), sidebarWasOpen = false);
      }
      let elemWaitCount = 0x0;
      while (!focusReader._iframeWindow.document.querySelector("[data-sidebar-annotation-id=\"" + focusAnnotKey + '\x22]')) {
        if (elemWaitCount >= 0x1f4) {
          Zotero.debug('AI4Paper:\x20Waiting\x20for\x20annotationElem\x20failed');
          return;
        }
        await Zotero.Promise.delay(0x5);
        elemWaitCount++;
      }
      let annotElemFound = focusReader._iframeWindow.document.querySelector("[data-sidebar-annotation-id=\"" + focusAnnotKey + '\x22]');
      if (annotElemFound) {
        !focusReader._state.splitType && (window.document.getElementById("view-menuitem-split-horizontally").click(), await Zotero.Promise.delay(0x3e8));
        elemWaitCount = 0x0;
        while (focusReader._iframeWindow.document.querySelectorAll("iframe").length === 0x1) {
          if (elemWaitCount >= 0x1f4) {
            return;
          }
          await Zotero.Promise.delay(0xa);
          elemWaitCount++;
        }
        let splitViewWin = focusReader._iframeWindow.document.querySelectorAll("iframe")[0x1].contentWindow;
        switch (splitViewWin.document.readyState) {
          case 'uninitialized':
            {
              let readyWaitCount = 0x0;
              while (splitViewWin.document.readyState === 'uninitialized') {
                if (readyWaitCount >= 0x1f4) return;
                await Zotero.Promise.delay(0xa);
                readyWaitCount++;
              }
              splitViewWin.focus();
            }
          case "complete":
            {
              splitViewWin.focus();
            }
        }
        await Zotero.Promise.delay(0x1e);
        annotElemFound?.["querySelector"](".editor-view")?.["click"]();
        await Zotero.Promise.delay(0xc8);
        annotElemFound.scrollIntoView({
          'behavior': "smooth",
          'block': "center"
        });
        return;
      }
    }
    ZoteroPane.loadURI(focusAnnotLink);
    let originTabID = focusReader._tabContainer.id,
      retryCount = 0x0;
    while (Zotero_Tabs._selectedID === originTabID) {
      if (retryCount >= 0xc8) return;
      await Zotero.Promise.delay(0xa);
      retryCount++;
    }
    let newTabID = Zotero_Tabs._selectedID,
      newReader = Zotero.Reader.getByTabID(newTabID);
    await newReader._initPromise;
    await newReader._waitForReader();
    let newReaderWin = newReader._iframeWindow,
      newSidebarWasOpen = true;
    if (!newReader._state.sidebarOpen) {
      retryCount = 0x0;
      while (!newReaderWin.document.querySelector("#sidebarToggle")) {
        if (retryCount >= 0x190) {
          Zotero.debug("AI4Paper: Waiting for sidebarToggle failed");
          return;
        }
        await Zotero.Promise.delay(0x5);
        retryCount++;
      }
      let newSidebarToggle = newReaderWin.document.querySelector("#sidebarToggle");
      !newReader._state.sidebarOpen && (newSidebarToggle.click(), newSidebarWasOpen = false);
    }
    retryCount = 0x0;
    while (!newReaderWin.document.querySelector("[data-sidebar-annotation-id=\"" + focusAnnotKey + '\x22]')) {
      if (retryCount >= 0x1f4) {
        Zotero.debug("AI4Paper: Waiting for annotationElem failed");
        return;
      }
      await Zotero.Promise.delay(0x5);
      retryCount++;
    }
    let newAnnotElem = newReaderWin.document.querySelector("[data-sidebar-annotation-id=\"" + focusAnnotKey + '\x22]');
    if (newAnnotElem?.["querySelector"](".editor-view")) {
      newAnnotElem?.["querySelector"](".editor-view")?.["click"]();
      await Zotero.Promise.delay(0xc8);
      newAnnotElem.scrollIntoView({
        'behavior': "smooth",
        'block': "center"
      });
    } else {
      if (newAnnotElem?.['querySelector'](".image")) {
        newAnnotElem?.["querySelector"](".image")?.['click']();
        await Zotero.Promise.delay(0xc8);
        newAnnotElem.scrollIntoView({
          'behavior': 'smooth',
          'block': "center"
        });
      }
    }
    !newSidebarWasOpen && (await Zotero.AI4Paper.addAnnotationButton(newReader));
  },

  // === Block D: Tag Ops + Shortcut Handlers + Floating Window ===
  'addTagForSelectedAnnotationsInit': async function () {
    if (Zotero_Tabs._selectedID === "zotero-pane") {
      let selectedItems = ZoteroPane.getSelectedItems();
      if (selectedItems.length === 0x0) {
        return;
      }
      selectedItems.length > 0x1 && (selectedItems = selectedItems.filter(topItem => topItem.isTopLevelItem()));
      Zotero.AI4Paper._data_selectedItemsNum = selectedItems.length;
      let tagDialogResult = Zotero.AI4Paper.openDialogByType_modal('selectTags', false);
      if (!tagDialogResult) {
        return null;
      }
      let tagNames2;
      !tagDialogResult.includes("🏷️") ? tagNames2 = [tagDialogResult.trim()] : tagNames2 = tagDialogResult.substring(0x3).split("🏷️");
      for (let selectedItem of selectedItems) {
        for (let tagToAdd of tagNames2) {
          selectedItem.addTag(tagToAdd);
          await selectedItem.saveTx();
        }
      }
      return Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 条目标签添加完成", "成功向【" + selectedItems.length + "】个条目添加了【" + tagNames2.length + "】个标签。"), true;
    } else {
      let currentReader = this.getCurrentReader(),
        hasBetterURL2 = Zotero.AI4Paper.betterURL();
      if (!currentReader || !hasBetterURL2) return false;
      if (!currentReader._internalReader._lastView._selectedAnnotationIDs.length) {
        let readerItemID = currentReader.itemID,
          readerItem = Zotero.Items.get(readerItemID);
        if (readerItem && readerItem.parentItemID) {
          readerItemID = readerItem.parentItemID;
          readerItem = Zotero.Items.get(readerItemID);
        } else {
          window.alert("❌ 当前文献缺失父条目，请补充父条目后再执行本操作。");
          return;
        }
        Zotero.AI4Paper.showProgressWindow(0x5dc, '✅\x20正在添加条目标签', '温馨提示：您正在向父条目添加标签...');
        let itemTagResult = Zotero.AI4Paper.openDialogByType_modal('selectTags', false);
        if (!itemTagResult) return null;
        let itemTagNames;
        !itemTagResult.includes("🏷️") ? itemTagNames = [itemTagResult.trim()] : itemTagNames = itemTagResult.substring(0x3).split("🏷️");
        for (let itemTagName of itemTagNames) {
          readerItem.addTag(itemTagName);
          await readerItem.saveTx();
        }
        return Zotero.AI4Paper.showProgressWindow(0xbb8, '✅\x20条目标签添加完成', "成功向当前文献的父条目添加了【" + itemTagNames.length + "】个标签。"), true;
      } else {
        if (currentReader._internalReader._lastView._selectedAnnotationIDs.length === 0x1) {
          let selectedAnnID = currentReader._internalReader._lastView._selectedAnnotationIDs[0x0],
            annLibraryID = Zotero.Items.get(currentReader.itemID).libraryID,
            annItemObj = null,
            annWaitCount = 0x0;
          while (!annItemObj?.["annotationType"]) {
            if (annWaitCount >= 0x12c) {
              Zotero.debug("AI4Paper: Waiting for annotationItem ready failed");
              return;
            }
            annItemObj = await Zotero.Items.getByLibraryAndKeyAsync(annLibraryID, selectedAnnID);
            await Zotero.Promise.delay(0xa);
            annWaitCount++;
          }
          Zotero.AI4Paper.openSelectTagWindow(annItemObj);
        } else {
          if (currentReader._internalReader._lastView._selectedAnnotationIDs.length > 0x1) {
            let multiAnnotItems = [];
            for (let multiAnnID of currentReader._internalReader._lastView._selectedAnnotationIDs) {
              let multiLibID = Zotero.Items.get(currentReader.itemID).libraryID,
                multiAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(multiLibID, multiAnnID);
              multiAnnotItems.push(multiAnnItem);
            }
            Zotero.AI4Paper.addTagForSelectedAnnotations(multiAnnotItems);
          }
        }
      }
    }
  },
  'addTagForSelectedAnnotations': async function (annotationItems) {
    let metaTitle = Zotero.AI4Paper.getFunMetaTitle();
    if (!metaTitle) {
      return;
    }
    if (Zotero.Prefs.get('ai4paper.annotationtagsrecent').length === 0x0) {
      var recentTags = [];
    } else {
      var recentTags = JSON.parse(Zotero.Prefs.get("ai4paper.annotationtagsrecent"));
    }
    let recentTagNames = [];
    for (let recentTag of recentTags) {
      recentTagNames.push(recentTag.tag);
    }
    recentTagNames.sort((a, b) => {
      return a.localeCompare(b, 'zh');
    });
    let tagSelectResult = Zotero.AI4Paper.openDialogByType_modal("selectTags", true);
    if (!tagSelectResult) return null;
    if (!tagSelectResult.includes("🏷️")) var selectedTags = [tagSelectResult.trim()];else {
      var selectedTags = tagSelectResult.substring(0x3).split("🏷️");
    }
    for (let annToTag of annotationItems) {
      for (let tagToApply of selectedTags) {
        annToTag.addTag(tagToApply);
        await annToTag.saveTx();
      }
    }
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 标签添加完成", "您同时为【" + annotationItems.length + "】个注释添加了【" + selectedTags.length + "】个标签。");
  },
  'getBlockQuoteLink_byShortCuts': async function () {
    let bqReader = this.getCurrentReader(),
      bqBetterURL = Zotero.AI4Paper.betterURL();
    if (!bqReader || !bqBetterURL) return false;
    if (!bqReader._internalReader._lastView._selectedAnnotationIDs.length) return window.alert('请先选中一个注释！'), false;else {
      if (bqReader._internalReader._lastView._selectedAnnotationIDs.length === 0x1) {
        let bqAnnID = bqReader._internalReader._lastView._selectedAnnotationIDs[0x0],
          bqLibraryID = Zotero.Items.get(bqReader.itemID).libraryID,
          bqAnnItem = null,
          bqWaitCount = 0x0;
        while (!bqAnnItem?.["annotationType"]) {
          if (bqWaitCount >= 0x12c) {
            Zotero.debug("AI4Paper: Waiting for annotationItem ready failed");
            return;
          }
          bqAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(bqLibraryID, bqAnnID);
          await Zotero.Promise.delay(0xa);
          bqWaitCount++;
        }
        Zotero.AI4Paper.getBlockQuoteLink(bqAnnItem);
      } else {
        if (bqReader._internalReader._lastView._selectedAnnotationIDs.length > 0x1) {
          return window.alert("请仅选择一个注释！"), false;
        }
      }
    }
  },
  'setAnnotationHead_byShortCuts': async function () {
    let headReader = this.getCurrentReader(),
      headBetterURL = Zotero.AI4Paper.betterURL();
    if (!headReader || !headBetterURL) return false;
    if (!headReader._internalReader._lastView._selectedAnnotationIDs.length) return window.alert("请先选中一个注释！"), false;else {
      if (headReader._internalReader._lastView._selectedAnnotationIDs.length === 0x1) {
        let headAnnID = headReader._internalReader._lastView._selectedAnnotationIDs[0x0],
          headLibraryID = Zotero.Items.get(headReader.itemID).libraryID,
          headAnnItem = null,
          headWaitCount = 0x0;
        while (!headAnnItem?.["annotationType"]) {
          if (headWaitCount >= 0x12c) {
            Zotero.debug("AI4Paper: Waiting for annotationItem ready failed");
            return;
          }
          headAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(headLibraryID, headAnnID);
          await Zotero.Promise.delay(0xa);
          headWaitCount++;
        }
        Zotero.AI4Paper.setAnnotationHead(headAnnItem);
      } else {
        if (headReader._internalReader._lastView._selectedAnnotationIDs.length > 0x1) {
          return window.alert("请仅选择一个注释！"), false;
        }
      }
    }
  },
  'copyAnnotationLink_byShortCuts': function () {
    let copyLinkReader = this.getCurrentReader(),
      copyLinkURL = Zotero.AI4Paper.betterURL();
    if (!copyLinkReader || !copyLinkURL) return false;
    if (!copyLinkReader._internalReader._lastView._selectedAnnotationIDs.length) {
      return window.alert('请先选中一个注释！'), false;
    }
    let copyLinkArr = [],
      copyLinkParams = {
        'ids': copyLinkReader._internalReader._lastView._selectedAnnotationIDs
      };
    Zotero.AI4Paper.copyAnnotationLink_handler(copyLinkReader, copyLinkParams);
  },
  'copyAnnotationLinkOnly_byShortCuts': function () {
    let linkOnlyReader = this.getCurrentReader(),
      linkOnlyURL = Zotero.AI4Paper.betterURL();
    if (!linkOnlyReader || !linkOnlyURL) {
      return false;
    }
    if (!linkOnlyReader._internalReader._lastView._selectedAnnotationIDs.length) {
      return window.alert("请先选中一个注释！"), false;
    }
    let linkOnlyArr = [],
      linkOnlyParams = {
        'ids': linkOnlyReader._internalReader._lastView._selectedAnnotationIDs
      };
    Zotero.AI4Paper.copyAnnotationLinkOnly_handler(linkOnlyReader, linkOnlyParams);
  },
  'copyAnnotationLinkMD_byShortCuts': function () {
    let linkMDReader = this.getCurrentReader(),
      linkMDURL = Zotero.AI4Paper.betterURL();
    if (!linkMDReader || !linkMDURL) return false;
    if (!linkMDReader._internalReader._lastView._selectedAnnotationIDs.length) return window.alert("请先选中一个注释！"), false;
    let linkMDArr = [],
      linkMDParams = {
        'ids': linkMDReader._internalReader._lastView._selectedAnnotationIDs
      };
    Zotero.AI4Paper.copyAnnotationLinkMD_handler(linkMDReader, linkMDParams);
  },
  'copyAnnotationText_byShortCuts': function () {
    let copyTextReader = this.getCurrentReader(),
      copyTextURL = Zotero.AI4Paper.betterURL();
    if (!copyTextReader || !copyTextURL) {
      return false;
    }
    if (!copyTextReader._internalReader._lastView._selectedAnnotationIDs.length) {
      return window.alert('请先选中一个注释！'), false;
    }
    let copyTextArr = [],
      copyTextParams = {
        'ids': copyTextReader._internalReader._lastView._selectedAnnotationIDs
      };
    Zotero.AI4Paper.copyAnnotationText_handler(copyTextReader, copyTextParams);
  },
  'addAnnotationButtonsInFloatingWindow': function (readerWin) {
    let floatReader = this.getCurrentReader(),
      floatBetterURL = Zotero.AI4Paper.betterURL();
    if (!floatReader || !floatBetterURL) return false;
    const floatDoc = readerWin.document;
    let iframes = readerWin.document.querySelectorAll("iframe");
    for (let iframe of iframes) {
      let iframeWin = iframe?.["contentWindow"];
      if (Zotero.Prefs.get("ai4paper.enabelColorLabel")) {
        if (iframeWin && !iframeWin._addColorLabel_AnnotationContextMenu) {
          iframeWin._addColorLabel_AnnotationContextMenu = true;
          iframeWin.document.addEventListener("pointerdown", async function (colorLabelEvt) {
            if (!Zotero.Prefs.get("ai4paper.enabelColorLabel") || !Zotero.AI4Paper) return;
            if (colorLabelEvt.button === 0x2) {
              await Zotero.Promise.delay(0x5);
              if (!floatReader._internalReader._lastView._selectedAnnotationIDs.length) return false;
              let menuWaitCount = 0x0;
              while (!readerWin.document.querySelector(".context-menu")) {
                if (menuWaitCount >= 0x1f4) {
                  Zotero.debug('AI4Paper:\x20Waiting\x20for\x20context-menu\x20failed');
                  return;
                }
                await Zotero.Promise.delay(0x5);
                menuWaitCount++;
              }
              if (readerWin.document.querySelector(".context-menu")) {
                let contextMenu = readerWin.document.querySelector(".context-menu"),
                  colorIndex = 0x0,
                  colorLabels = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get('ai4paper.redColorLabel'), Zotero.Prefs.get('ai4paper.greenColorLabel'), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get("ai4paper.magentaColorLabel"), Zotero.Prefs.get("ai4paper.orangeColorLabel"), Zotero.Prefs.get("ai4paper.grayColorLabel")],
                  colorButtons = contextMenu.childNodes[0x1].childNodes;
                for (let colorButton of colorButtons) {
                  let divEndIdx = colorButton.innerHTML.indexOf("div>"),
                    divPrefix = colorButton.innerHTML.substring(0x0, divEndIdx + 0x4);
                  colorButton.innerHTML = '' + divPrefix + colorLabels[colorIndex];
                  colorIndex++;
                }
              }
            }
          }, false);
        }
      }
      if (Zotero.Prefs.get('ai4paper.enableannotationsvginFloatingWindow')) {
        if (iframeWin && !iframeWin._addAnnotationButtonsInFloatingWindow) {
          iframeWin._addAnnotationButtonsInFloatingWindow = true;
          iframeWin.document.addEventListener("pointerdown", async function (floatPointerEvt) {
            if (!Zotero.Prefs.get("ai4paper.enableannotationsvginFloatingWindow") || !Zotero.AI4Paper) return;
            if (floatPointerEvt.button === 0x0 && !floatReader._state.sidebarOpen) {
              await Zotero.Promise.delay(0x5);
              if (!floatReader._internalReader._lastView._selectedAnnotationIDs.length) return false;
              let popupWaitCount = 0x0;
              while (!floatDoc.querySelector(".annotation-popup")) {
                if (popupWaitCount >= 0xc8) {
                  Zotero.debug("AI4Paper: Waiting for annotation-popup failed");
                  return;
                }
                await Zotero.Promise.delay(0xa);
                popupWaitCount++;
              }
              let annotPopup = floatDoc.querySelector(".annotation-popup");
              annotPopup.querySelectorAll(".zoteroone-annotation-button").forEach(oldAnnBtn => oldAnnBtn.remove());
              let floatAnnID = floatReader._internalReader._lastView._selectedAnnotationIDs[0x0],
                floatLibID = Zotero.Items.get(floatReader.itemID).libraryID,
                floatAnnItem = null,
                floatMoreBtn = annotPopup.querySelector(".more");
              popupWaitCount = 0x0;
              while (!floatAnnItem?.["annotationType"]) {
                if (popupWaitCount >= 0x12c) {
                  Zotero.debug('Zotero\x20One:\x20Waiting\x20for\x20annotationItem\x20ready\x20failed');
                  return;
                }
                floatAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(floatLibID, floatAnnID);
                await Zotero.Promise.delay(0xa);
                popupWaitCount++;
              }
              Zotero.AI4Paper.createAnnotationButtons(floatDoc, annotPopup, floatMoreBtn, floatAnnItem, floatAnnID);
              Zotero.AI4Paper.createAnnotationButton_VisitUniversalQuoteLink(floatReader, floatDoc, annotPopup, floatMoreBtn, floatAnnItem, floatAnnID);
              Zotero.AI4Paper.createAnnotationButton_ZoterAnnotationDate(floatDoc, annotPopup, floatMoreBtn, floatAnnItem, floatAnnID);
            }
          }, false);
        }
      }
    }
  },

  // === Block E: Filtering & Counting ===
  'filterAnnotations': async function (filterWin, filterType) {
    let filterReader = this.getCurrentReader();
    if (!filterReader) return;
    let annotElems = filterWin.document.querySelectorAll(".annotation");
    for (let annotElemItem of annotElems) {
      let annotSidebarID = annotElemItem.getAttribute("data-sidebar-annotation-id");
      if (annotSidebarID) {
        let filterLibID = Zotero.Items.get(filterReader.itemID).libraryID,
          filterAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(filterLibID, annotSidebarID);
        Zotero.AI4Paper.hiddenORshowAnnotation(filterType, filterAnnItem, annotElemItem);
      }
    }
  },
  'handleNewAnnotationFiltering': async function (newAnn) {
    if (!Zotero.Prefs.get("ai4paper.enableReaderViewButtonFilterAnnotations")) {
      return;
    }
    let filterReader2 = this.getCurrentReader();
    if (!filterReader2) return;
    if (!filterReader2._state.sidebarOpen) return false;
    let filterIframeWin = filterReader2._iframeWindow;
    if (!filterIframeWin._annotationFilterType || filterIframeWin._annotationFilterType === "none") {
      return;
    }
    let filterWaitCount = 0x0;
    while (!filterIframeWin.document.querySelector("[data-sidebar-annotation-id=\"" + newAnn.key + '\x22]')) {
      if (filterWaitCount >= 0x190) {
        Zotero.debug("AI4Paper: Waiting for annotationElem failed");
        return;
      }
      await Zotero.Promise.delay(0x5);
      filterWaitCount++;
    }
    let newAnnotElem2 = filterIframeWin.document.querySelector("[data-sidebar-annotation-id=\"" + newAnn.key + '\x22]');
    if (!newAnnotElem2) return;
    let currentFilterType = filterIframeWin._annotationFilterType;
    Zotero.AI4Paper.hiddenORshowAnnotation(currentFilterType, newAnn, newAnnotElem2);
  },
  'autoFocusNewAnnotation': async function (focusNewAnn) {
    let focusReader2 = this.getCurrentReader();
    if (!focusReader2) return;
    if (!focusReader2._state.sidebarOpen) return false;
    let focusIframeWin = focusReader2._iframeWindow,
      focusWaitCount = 0x0;
    while (!focusIframeWin.document.querySelector("[data-sidebar-annotation-id=\"" + focusNewAnn.key + '\x22]')) {
      if (focusWaitCount >= 0xc8) {
        Zotero.debug("AI4Paper: Waiting for annotationElem failed");
        return;
      }
      await Zotero.Promise.delay(0x5);
      focusWaitCount++;
    }
    let focusAnnotElem = focusIframeWin.document.querySelector("[data-sidebar-annotation-id=\"" + focusNewAnn.key + '\x22]');
    focusAnnotElem?.["querySelector"]('.editor-view')?.['click']();
  },
  'hiddenORshowAnnotation': function (showFilterType, showAnnotation, showAnnotElem) {
    if (showFilterType === "none") {
      showAnnotElem.hidden = false;
    } else {
      if (showFilterType === "annotationHead") {
        let showComment = '' + showAnnotation.annotationComment;
        showComment.indexOf("<ZH") != -0x1 && showComment.indexOf('/>') != -0x1 ? showAnnotElem.hidden = false : showAnnotElem.hidden = true;
      } else {
        if (showFilterType === 'H1') {
          let h1Comment = '' + showAnnotation.annotationComment;
          if (h1Comment.indexOf("<ZH1>") != -0x1 && h1Comment.indexOf("<ZH1/>") != -0x1) {
            showAnnotElem.hidden = false;
          } else {
            showAnnotElem.hidden = true;
          }
        } else {
          if (showFilterType === 'H2') {
            let h2Comment = '' + showAnnotation.annotationComment;
            h2Comment.indexOf("<ZH2>") != -0x1 && h2Comment.indexOf("<ZH2/>") != -0x1 ? showAnnotElem.hidden = false : showAnnotElem.hidden = true;
          } else {
            if (showFilterType === 'H3') {
              let h3Comment = '' + showAnnotation.annotationComment;
              h3Comment.indexOf("<ZH3>") != -0x1 && h3Comment.indexOf("<ZH3/>") != -0x1 ? showAnnotElem.hidden = false : showAnnotElem.hidden = true;
            } else {
              if (showFilterType === 'H4') {
                let h4Comment = '' + showAnnotation.annotationComment;
                if (h4Comment.indexOf("<ZH4>") != -0x1 && h4Comment.indexOf("<ZH4/>") != -0x1) {
                  showAnnotElem.hidden = false;
                } else showAnnotElem.hidden = true;
              } else {
                if (showFilterType === 'H5') {
                  let h5Comment = '' + showAnnotation.annotationComment;
                  h5Comment.indexOf("<ZH5>") != -0x1 && h5Comment.indexOf("<ZH5/>") != -0x1 ? showAnnotElem.hidden = false : showAnnotElem.hidden = true;
                } else {
                  if (showFilterType === 'H6') {
                    let h6Comment = '' + showAnnotation.annotationComment;
                    h6Comment.indexOf("<ZH6>") != -0x1 && h6Comment.indexOf("<ZH6/>") != -0x1 ? showAnnotElem.hidden = false : showAnnotElem.hidden = true;
                  } else {
                    if (showFilterType === "yellow") {
                      if (showAnnotation.annotationColor === '#ffd400') showAnnotElem.hidden = false;else {
                        showAnnotElem.hidden = true;
                      }
                    } else {
                      if (showFilterType === "red") {
                        if (showAnnotation.annotationColor === "#ff6666") showAnnotElem.hidden = false;else {
                          showAnnotElem.hidden = true;
                        }
                      } else {
                        if (showFilterType === 'green') showAnnotation.annotationColor === "#5fb236" ? showAnnotElem.hidden = false : showAnnotElem.hidden = true;else {
                          if (showFilterType === "blue") {
                            if (showAnnotation.annotationColor === "#2ea8e5") {
                              showAnnotElem.hidden = false;
                            } else showAnnotElem.hidden = true;
                          } else {
                            if (showFilterType === "purple") showAnnotation.annotationColor === "#a28ae5" ? showAnnotElem.hidden = false : showAnnotElem.hidden = true;else {
                              if (showFilterType === 'magenta') showAnnotation.annotationColor === "#e56eee" ? showAnnotElem.hidden = false : showAnnotElem.hidden = true;else {
                                if (showFilterType === "orange") showAnnotation.annotationColor === "#f19837" ? showAnnotElem.hidden = false : showAnnotElem.hidden = true;else {
                                  if (showFilterType === "gray") {
                                    if (showAnnotation.annotationColor === "#aaaaaa") {
                                      showAnnotElem.hidden = false;
                                    } else showAnnotElem.hidden = true;
                                  } else {
                                    if (showFilterType === "UniversalQuoteLink") {
                                      let quoteComment = '' + showAnnotation.annotationComment;
                                      if (Zotero.AI4Paper.hasUniversalQuoteLink(quoteComment)) {
                                        showAnnotElem.hidden = false;
                                      } else showAnnotElem.hidden = true;
                                    } else showAnnotation.annotationType === showFilterType ? showAnnotElem.hidden = false : showAnnotElem.hidden = true;
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
  'countAnnotations': function (countType) {
    let countReader = this.getCurrentReader(),
      allAnnotations = countReader._state.annotations;
    if (countType === "none") return allAnnotations.length;
    let matchCount = 0x0;
    if (countType === "annotationHead") for (let annHead of allAnnotations) {
      annHead.comment.indexOf('<ZH') != -0x1 && annHead.comment.indexOf('/>') != -0x1 && matchCount++;
    } else {
      if (countType === 'H1') {
        for (let annH1 of allAnnotations) {
          annH1.comment.indexOf('<ZH1>') != -0x1 && annH1.comment.indexOf('<ZH1/>') != -0x1 && matchCount++;
        }
      } else {
        if (countType === 'H2') {
          for (let annH2 of allAnnotations) {
            annH2.comment.indexOf("<ZH2>") != -0x1 && annH2.comment.indexOf("<ZH2/>") != -0x1 && matchCount++;
          }
        } else {
          if (countType === 'H3') for (let annH3 of allAnnotations) {
            if (annH3.comment.indexOf('<ZH3>') != -0x1 && annH3.comment.indexOf("<ZH3/>") != -0x1) {
              matchCount++;
            }
          } else {
            if (countType === 'H4') for (let annH4 of allAnnotations) {
              annH4.comment.indexOf("<ZH4>") != -0x1 && annH4.comment.indexOf('<ZH4/>') != -0x1 && matchCount++;
            } else {
              if (countType === 'H5') for (let annH5 of allAnnotations) {
                annH5.comment.indexOf("<ZH5>") != -0x1 && annH5.comment.indexOf('<ZH5/>') != -0x1 && matchCount++;
              } else {
                if (countType === 'H6') for (let annH6 of allAnnotations) {
                  annH6.comment.indexOf("<ZH6>") != -0x1 && annH6.comment.indexOf("<ZH6/>") != -0x1 && matchCount++;
                } else {
                  if (countType === "yellow") for (let annYellow of allAnnotations) {
                    annYellow.color === "#ffd400" && matchCount++;
                  } else {
                    if (countType === "red") {
                      for (let annRed of allAnnotations) {
                        annRed.color === "#ff6666" && matchCount++;
                      }
                    } else {
                      if (countType === "green") {
                        for (let annGreen of allAnnotations) {
                          annGreen.color === "#5fb236" && matchCount++;
                        }
                      } else {
                        if (countType === "blue") for (let annBlue of allAnnotations) {
                          annBlue.color === '#2ea8e5' && matchCount++;
                        } else {
                          if (countType === "purple") for (let annPurple of allAnnotations) {
                            annPurple.color === "#a28ae5" && matchCount++;
                          } else {
                            if (countType === "magenta") for (let annMagenta of allAnnotations) {
                              annMagenta.color === "#e56eee" && matchCount++;
                            } else {
                              if (countType === "orange") {
                                for (let annOrange of allAnnotations) {
                                  annOrange.color === "#f19837" && matchCount++;
                                }
                              } else {
                                if (countType === "gray") {
                                  for (let annGray of allAnnotations) {
                                    annGray.color === "#aaaaaa" && matchCount++;
                                  }
                                } else {
                                  if (countType === "UniversalQuoteLink") for (let annQuoteLink of allAnnotations) {
                                    if (Zotero.AI4Paper.hasUniversalQuoteLink(annQuoteLink.comment)) {
                                      matchCount++;
                                    }
                                  } else {
                                    if (["highlight", "underline", "note", "text", "image", "ink"].includes(countType)) for (let annByType of allAnnotations) {
                                      if (annByType.type === countType) {
                                        matchCount++;
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
    return matchCount;
  },

  // === Block F: Link/Copy Handlers + Sidebar ===
  'copyAnnotationLink_handler': async function (linkReader, linkSelection) {
    let linkResults = [];
    for (let linkAnnID of linkSelection.ids) {
      let linkLibID = Zotero.Items.get(linkReader.itemID).libraryID,
        linkAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(linkLibID, linkAnnID),
        linkParentItem = linkAnnItem?.["parentItem"]?.['parentItem'];
      if (linkParentItem) {
        let linkYear = Zotero.Date.strToDate(linkParentItem.getField("date", false, true)).year,
          linkAuthor = '',
          linkYearStr = '';
        linkYearStr = linkYear ? linkYear + ',\x20' : '';
        if (linkParentItem.getCreators().length != 0x0) {
          let linkFirstName = linkParentItem.getCreators()[0x0].firstName,
            linkLastName = linkParentItem.getCreators()[0x0].lastName;
          linkParentItem.getCreators().length === 0x1 ? linkParentItem.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1 ? linkAuthor = linkLastName ? linkLastName + ',\x20' : '' : linkAuthor = linkLastName ? '' + linkLastName + linkFirstName + ',\x20' : '' : linkParentItem.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1 ? linkAuthor = linkLastName ? linkLastName + " et al., " : '' : linkAuthor = linkLastName ? '' + linkLastName + linkFirstName + '\x20et\x20al.,\x20' : '';
        }
        let linkPageNum = JSON.parse(linkAnnItem.annotationPosition).pageIndex + 0x1,
          linkAnnotLink = Zotero.AI4Paper.getAnnotationItemLink(linkAnnItem),
          linkMdLink = '[' + linkAuthor + linkYearStr + 'p' + linkPageNum + '](' + linkAnnotLink + ')',
          linkFullText = (linkAnnItem.annotationText ? linkAnnItem.annotationText + '\x20' : '') + '(' + linkMdLink + ')' + (linkAnnItem.annotationComment ? '\x20' + linkAnnItem.annotationComment : '');
        linkResults.push(linkFullText);
      } else {
        let linkPageNum2 = JSON.parse(linkAnnItem.annotationPosition).pageIndex + 0x1,
          linkAnnotLink2 = Zotero.AI4Paper.getAnnotationItemLink(linkAnnItem),
          linkMdLink2 = '[p' + linkPageNum2 + '](' + linkAnnotLink2 + ')',
          linkFullText2 = (linkAnnItem.annotationText ? linkAnnItem.annotationText + '\x20' : '') + '(' + linkMdLink2 + ')' + (linkAnnItem.annotationComment ? '\x20' + linkAnnItem.annotationComment : '');
        linkResults.push(linkFullText2);
      }
    }
    linkResults.length && (Zotero.AI4Paper.copy2Clipboard(linkResults.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0xbb8, linkResults.length > 0x1 ? "✅ 拷贝【" + linkResults.length + "】条注释【AI4paper】" : "✅ 拷贝注释【AI4paper】", linkResults.length > 0x1 ? linkResults[0x0] + '\x20...\x20共【' + linkResults.length + '】条' : linkResults[0x0]));
  },
  'copyAnnotationLinkOnly_handler': async function (linkOnlyReader2, linkOnlySelection) {
    let linkOnlyResults = [];
    for (let linkOnlyAnnID of linkOnlySelection.ids) {
      let linkOnlyLibID = Zotero.Items.get(linkOnlyReader2.itemID).libraryID,
        linkOnlyAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(linkOnlyLibID, linkOnlyAnnID),
        linkOnlyPageNum = JSON.parse(linkOnlyAnnItem.annotationPosition).pageIndex + 0x1,
        linkOnlyAnnotLink = Zotero.AI4Paper.getAnnotationItemLink(linkOnlyAnnItem);
      linkOnlyResults.push(linkOnlyAnnotLink);
    }
    linkOnlyResults.length && (Zotero.AI4Paper.copy2Clipboard(linkOnlyResults.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0xbb8, linkOnlyResults.length > 0x1 ? '✅\x20拷贝【' + linkOnlyResults.length + "】条注释回链【AI4paper】" : "✅ 拷贝注释回链【AI4paper】", linkOnlyResults.length > 0x1 ? linkOnlyResults[0x0] + " ... 共【" + linkOnlyResults.length + '】条' : linkOnlyResults[0x0]));
  },
  'copyAnnotationLinkMD_handler': async function (mdReader, mdSelection) {
    let mdResults = [];
    for (let mdAnnID of mdSelection.ids) {
      let mdLibID = Zotero.Items.get(mdReader.itemID).libraryID,
        mdAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(mdLibID, mdAnnID),
        mdParentItem = mdAnnItem?.["parentItem"]?.["parentItem"];
      if (mdParentItem) {
        let mdYear = Zotero.Date.strToDate(mdParentItem.getField("date", false, true)).year,
          mdAuthor = '',
          mdYearStr = '';
        mdYearStr = mdYear ? mdYear + ',\x20' : '';
        if (mdParentItem.getCreators().length != 0x0) {
          let mdFirstName = mdParentItem.getCreators()[0x0].firstName,
            mdLastName = mdParentItem.getCreators()[0x0].lastName;
          mdParentItem.getCreators().length === 0x1 ? mdParentItem.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 ? mdAuthor = mdLastName ? mdLastName + ',\x20' : '' : mdAuthor = mdLastName ? '' + mdLastName + mdFirstName + ',\x20' : '' : mdParentItem.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 ? mdAuthor = mdLastName ? mdLastName + " et al., " : '' : mdAuthor = mdLastName ? '' + mdLastName + mdFirstName + " et al., " : '';
        }
        let mdPageNum = JSON.parse(mdAnnItem.annotationPosition).pageIndex + 0x1,
          mdAnnotLink = Zotero.AI4Paper.getAnnotationItemLink(mdAnnItem),
          mdLinkText = '[' + mdAuthor + mdYearStr + 'p' + mdPageNum + '](' + mdAnnotLink + ')',
          mdResult = mdLinkText;
        mdResults.push(mdResult);
      } else {
        let mdPageNum2 = JSON.parse(mdAnnItem.annotationPosition).pageIndex + 0x1,
          mdAnnotLink2 = Zotero.AI4Paper.getAnnotationItemLink(mdAnnItem),
          mdLinkText2 = '[p' + mdPageNum2 + '](' + mdAnnotLink2 + ')',
          mdResult2 = mdLinkText2;
        mdResults.push(mdResult2);
      }
    }
    mdResults.length && (Zotero.AI4Paper.copy2Clipboard(mdResults.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0xbb8, mdResults.length > 0x1 ? '✅\x20拷贝【' + mdResults.length + '】条注释回链（MD）【Zotero\x20One】' : '✅\x20拷贝注释回链（MD）【Zotero\x20One】', mdResults.length > 0x1 ? mdResults[0x0] + " ... 共【" + mdResults.length + '】条' : mdResults[0x0]));
  },
  'copyAnnotationText_handler': async function (textReader, textSelection) {
    let textResults = [];
    for (let textAnnID of textSelection.ids) {
      let textLibID = Zotero.Items.get(textReader.itemID).libraryID,
        textAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(textLibID, textAnnID),
        textContent = '' + (textAnnItem.annotationText ? textAnnItem.annotationText : '') + (textAnnItem.annotationComment ? '\x0a' + textAnnItem.annotationComment : '');
      textContent = textContent.replace(/^\s+|\s+$/g, '');
      textResults.push(textContent);
    }
    textResults.length && (Zotero.AI4Paper.copy2Clipboard(textResults.join('\x0a\x0a')), Zotero.AI4Paper.showProgressWindow(0xbb8, textResults.length > 0x1 ? '✅\x20拷贝【' + textResults.length + '】条注释文本【Zotero\x20One】' : '✅\x20拷贝注释文本【Zotero\x20One】', textResults.length > 0x1 ? textResults[0x0] + " ... 共【" + textResults.length + '】条' : textResults[0x0]));
  },
  'optimizeSpaces_annotationContextMenu_handler': async function (optReader, optSelection, optCommentOnly) {
    let optimizedCount = 0x0;
    for (let optAnnID of optSelection.ids) {
      let optLibID = Zotero.Items.get(optReader.itemID).libraryID,
        optAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(optLibID, optAnnID),
        {
          sourceText: optSourceText,
          type: optType
        } = await Zotero.AI4Paper.optimizeSpaces_annotationItem(optAnnItem, optCommentOnly);
      if (optType) optimizedCount++;
    }
    Zotero.AI4Paper.showProgressWindow(0xbb8, "✅ 已优化空格【AI4paper】", "已为【" + optimizedCount + '/' + optSelection.ids.length + '】条注释优化空格！');
  },
  'onSidebarToggle': function (sidebarWin) {
    let sidebarReader = this.getCurrentReader(),
      sidebarToggleBtn = sidebarWin.document.querySelector('#sidebarToggle');
    if (!sidebarToggleBtn) {
      return false;
    }
    if (!sidebarToggleBtn._onSidebarToggle) {
      sidebarToggleBtn._onSidebarToggle = true;
      sidebarToggleBtn.addEventListener("click", async sidebarEvt => {
        await Zotero.Promise.delay(0x5);
        if (sidebarReader._state.sidebarOpen) {
          Zotero.AI4Paper.addViewButtons(sidebarWin);
          Zotero.AI4Paper.onClickButton_viewAnnotations(sidebarWin);
          Zotero.AI4Paper.onClickButton_viewOutline(sidebarWin);
          if (sidebarReader._state.annotations.length) {
            let sidebarLoadWait = 0x0;
            while (!sidebarWin.document.querySelector("#annotationsView")?.['querySelector'](".more")) {
              if (sidebarLoadWait >= 0xc8) {
                Zotero.debug("AI4Paper: Waiting for annotations loading failed");
                return;
              }
              await Zotero.Promise.delay(0xa);
              sidebarLoadWait++;
            }
            await Zotero.Promise.delay(0xa);
            await Zotero.AI4Paper.addAnnotationButton(sidebarReader);
            sidebarWin._annotationFilterType && (await Zotero.AI4Paper.filterAnnotations(sidebarWin, sidebarWin._annotationFilterType));
          }
        }
      }, false);
    }
  },
  'onClickButton_viewAnnotations': async function (viewWin) {
    let viewReader = this.getCurrentReader(),
      viewWaitCount = 0x0;
    while (!viewWin.document.querySelector("#viewAnnotations")) {
      if (viewWaitCount >= 0xc8) {
        Zotero.debug('AI4Paper:\x20Waiting\x20for\x20viewAnnotations\x20button\x20failed');
        return;
      }
      await Zotero.Promise.delay(0xa);
      viewWaitCount++;
    }
    let viewAnnotBtn = viewWin.document.querySelector("#viewAnnotations");
    !viewAnnotBtn._onClickButton && (viewAnnotBtn._onClickButton = true, viewAnnotBtn.addEventListener('click', async viewClickEvt => {
      if (viewReader._state.annotations.length) {
        let viewLoadWait = 0x0;
        while (!viewWin.document.querySelector("#annotationsView")?.['querySelector']('.more')) {
          if (viewLoadWait >= 0xc8) {
            Zotero.debug("AI4Paper: Waiting for annotations loading failed");
            return;
          }
          await Zotero.Promise.delay(0xa);
          viewLoadWait++;
        }
        await Zotero.Promise.delay(0xa);
        await Zotero.AI4Paper.addAnnotationButton(viewReader);
        viewWin._annotationFilterType && (await Zotero.AI4Paper.filterAnnotations(viewWin, viewWin._annotationFilterType));
      }
    }, false));
  },

  // === Block G: Comment Templates + Auto-Note Generation ===
  'addAnnotationCommentTempate': async function (templateAnnotations, templateText) {
    let template;
    if (templateText) {
      template = templateText;
    } else template = Zotero.AI4Paper.openDialogByType_modal("setCommentTemplate");
    if (template) for (let templateAnn of templateAnnotations) {
      template = template.replace(/🌝/g, '\x0a');
      let existingComment = '' + templateAnn.annotationComment;
      if (existingComment === 'null') templateAnn.annotationComment = template;else {
        if (existingComment != "null") {
          if (existingComment.indexOf(template) != -0x1) {
            var confirmDuplicate = window.confirm("检测到评论中已经存在该模板，是否继续添加？");
            confirmDuplicate && (templateAnn.annotationComment = existingComment + '\x0a\x0a' + template);
          } else templateAnn.annotationComment = existingComment + '\x0a\x0a' + template;
        }
      }
      await templateAnn.saveTx();
    }
  },
  'addAnnotationCommentTempate_byShortCuts': async function () {
    let shortcutAnnotItems = await Zotero.AI4Paper.getSelectedAnnotationItems();
    if (!shortcutAnnotItems) return;
    Zotero.AI4Paper.addAnnotationCommentTempate(shortcutAnnotItems);
  },
  'onClickButton_AnnotationCommentTempate': function (tplAnnotations, tplAnchorElem) {
    let templateLines = [],
      templatePref = Zotero.Prefs.get('ai4paper.annotationCommentTemplate');
    if (!templatePref.trim()) {
      Zotero.AI4Paper.addAnnotationCommentTempate(tplAnnotations);
      return;
    }
    if (templatePref) {
      templateLines = templatePref.split('\x0a').filter(line => line != '' && line.trim() != '');
      if (!templateLines.length) {
        Zotero.AI4Paper.addAnnotationCommentTempate(tplAnnotations);
        return;
      }
      Zotero.AI4Paper.buildPopup_AnnotationCommentTempate(tplAnnotations, tplAnchorElem, templateLines);
    }
  },
  'buildPopup_AnnotationCommentTempate': function (popupAnnotations, popupAnchor, popupTemplateLines) {
    let menuPopup = window.document.createXULElement("menupopup");
    menuPopup.id = 'zoteroone-annotationCommentTempate-menupopup';
    menuPopup.addEventListener("popuphidden", () => {
      window.document.querySelector("#browser").querySelectorAll("#zoteroone-annotationCommentTempate-menupopup").forEach(oldMenuPopup => oldMenuPopup.remove());
    });
    let menuChild = menuPopup.firstElementChild;
    while (menuChild) {
      menuChild.remove();
      menuChild = menuPopup.firstElementChild;
    }
    for (let templateLine of popupTemplateLines) {
      let menuItem = window.document.createXULElement("menuitem");
      menuItem.setAttribute('label', templateLine);
      menuItem.addEventListener("command", menuCmdEvt => {
        Zotero.AI4Paper.addAnnotationCommentTempate(popupAnnotations, templateLine);
      });
      menuPopup.appendChild(menuItem);
    }
    window.document.querySelector('#browser').querySelectorAll("#zoteroone-annotationCommentTempate-menupopup").forEach(oldMenu => oldMenu.remove());
    window.document.querySelector("#browser")?.['appendChild'](menuPopup);
    menuPopup.openPopup(popupAnchor, 'after_start', 0x0, 0x0, false, false);
  },
  'getSelectedAnnotationItems': async function (singleOnly) {
    let selReader = this.getCurrentReader(),
      selBetterURL = Zotero.AI4Paper.betterURL();
    if (!selReader || !selBetterURL) {
      return false;
    }
    if (!selReader._internalReader._lastView._selectedAnnotationIDs.length) {
      return window.alert('请先选中一个注释！'), false;
    }
    if (singleOnly && selReader._internalReader._lastView._selectedAnnotationIDs.length > 0x1) {
      return window.alert("请仅选择一个注释！"), false;
    }
    let selAnnotItems = [];
    for (let selAnnID of selReader._internalReader._lastView._selectedAnnotationIDs) {
      let selLibID = Zotero.Items.get(selReader.itemID).libraryID,
        selAnnItem = await Zotero.Items.getByLibraryAndKeyAsync(selLibID, selAnnID);
      selAnnotItems.push(selAnnItem);
    }
    if (selAnnotItems.length) {
      return selAnnotItems;
    }
    return false;
  },
  'autoAddNoteFromAnnotations': async function (triggerAnnotation) {
    let noteLineHeight = AI4PaperCore.getNoteLineHeight();
    let noteBlocks = [],
      noteTagsList = [],
      noteTagsStr = '',
      noteAttachment = triggerAnnotation.parentItem,
      noteParentItem = triggerAnnotation.parentItem.parentItem;
    if (noteParentItem != undefined) {
      var noteTitle = noteParentItem.getField('title'),
        noteYear = Zotero.Date.strToDate(noteParentItem.getField('date', false, true)).year;
      if (noteParentItem.getCreators().length != 0x0) {
        var noteFirstName = noteParentItem.getCreators()[0x0].firstName,
          noteLastName = noteParentItem.getCreators()[0x0].lastName,
          noteFirstDash = '-' + noteFirstName,
          noteLastDash = '-' + noteLastName,
          noteFullDash = '-' + noteLastName + noteFirstName;
      } else var noteFirstDash = '',
        noteLastDash = '',
        noteFullDash = '';
    } else return false;
    let noteIdentifier = "📝 注释笔记 " + noteAttachment.key;
    if (noteParentItem.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1) {
      var noteHeaderHtml = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + noteAttachment.key + '>>>>>>></h2>' + (noteParentItem != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + noteYear + noteLastDash + '-' + noteParentItem.getField("title") + '</span></blockquote>' : '');
    } else {
      var noteHeaderHtml = '<h2\x20style=\x22color:\x20#ff4757;\x22>📝\x20注释笔记\x20' + noteAttachment.key + ">>>>>>></h2>" + (noteParentItem != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + noteYear + noteFullDash + '-' + noteParentItem.getField('title') + '</span></blockquote>' : '');
    }
    noteBlocks.push(noteHeaderHtml);
    if (["application/pdf", "text/html", "application/epub+zip"].includes(noteAttachment.attachmentContentType)) {
      var noteAnnotations = await noteAttachment.getAnnotations().filter(noteFilterAnn => noteFilterAnn.annotationType != "ink");
      if (noteAnnotations.length) {
        for (let noteAnn of noteAnnotations) {
          if (AI4PaperCore.shouldSkipAutoAnnotation(noteAnn)) {
            continue;
          } else {
            let noteAnnTags = noteAnn.getTags();
            noteTagsList = [];
            noteTagsStr = '';
            if (noteAnnTags.length) {
              for (let noteAnnTag of noteAnnTags) {
                noteTagsList.push('#' + noteAnnTag.tag);
              }
              noteTagsStr = noteTagsList.join('\x20');
            }
            let notePageNum = JSON.parse(noteAnn.annotationPosition).pageIndex + 0x1,
              noteAnnLink = Zotero.AI4Paper.getAnnotationItemLink(noteAnn),
              noteLinkHtml = " (<a href=\"" + noteAnnLink + '\x22>p' + notePageNum + '</a>)',
              noteCommentText = '',
              noteImageHtml = '',
              noteImgIndex = -0x1;
            if (noteLineHeight === '宽松型') {
              noteCommentText = '' + noteAnn.annotationComment;
              noteCommentText = noteCommentText.replace(/\n+/g, '<br>');
              if (noteAnn.annotationType === 'image' && noteCommentText.indexOf("![](") != -0x1) {
                noteImgIndex = noteCommentText.indexOf("![](");
                let noteImgSubstr2 = noteCommentText.substring(noteImgIndex),
                  noteImgCloseIdx2 = noteImgSubstr2.indexOf(')'),
                  noteImgUrl2 = noteImgSubstr2.substring(0x4, noteImgCloseIdx2);
                noteImageHtml = '<img\x20src=\x22' + noteImgUrl2 + '\x22\x20width=\x22500px\x22\x20/>';
                let noteBeforeImg2 = '',
                  noteAfterImg2 = '';
                noteImgSubstr2.length > noteImgUrl2.length + 0x5 && (noteAfterImg2 = noteImgSubstr2.substring(noteImgUrl2.length + 0x5));
                if (noteImgIndex != 0x0) {
                  noteBeforeImg2 = noteCommentText.substring(0x0, noteImgIndex);
                }
                if (noteAnn.annotationType === "image") {
                  noteCommentText = "<br>" + noteBeforeImg2 + noteAfterImg2;
                  if (noteCommentText.substring(noteCommentText.length - 0x4) === "<br>") {
                    noteCommentText = noteCommentText.substring(0x0, noteCommentText.length - 0x4);
                  }
                } else noteCommentText = '' + noteBeforeImg2 + noteAfterImg2 + "<br>" + noteImageHtml;
                noteCommentText = noteCommentText.replace(/<br><br>/g, '<br>');
              }
              if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                if (noteAnn.annotationType === 'image') {
                  var noteBlockHtml = "<blockquote><span class=\"image" + noteAnn.annotationColor + '\x22>' + (noteImgIndex != -0x1 ? noteImageHtml : noteAnn.annotationText) + "</span>" + (noteAnn.annotationComment != null ? (noteCommentText === '<br>' ? '' : noteCommentText) + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<p>🏷️ " + noteTagsStr : '') + "</blockquote>";
                } else {
                  if (noteAnn.annotationType === 'note') {
                    var noteBlockHtml = '<blockquote><span\x20class=\x22note\x22\x20style=\x22background-color:\x20' + noteAnn.annotationColor + "\">note</span>" + (noteAnn.annotationComment != null ? '<p>' + noteCommentText + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<p>🏷️ " + noteTagsStr : '') + "</blockquote>";
                  } else {
                    var noteBlockHtml = "<blockquote><span class=\"highlight\" style=\"background-color: " + noteAnn.annotationColor + '\x22>' + noteAnn.annotationText + "</span>" + (noteAnn.annotationComment != null ? "<p>" + noteCommentText + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<p>🏷️ " + noteTagsStr : '') + "</blockquote>";
                  }
                }
              } else {
                if (noteAnn.annotationType === "image") {
                  var noteBlockHtml = "<blockquote><span>" + (noteImgIndex != -0x1 ? noteImageHtml : noteAnn.annotationText) + "</span>" + (noteAnn.annotationComment != null ? (noteCommentText === "<br>" ? '' : noteCommentText) + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<br>🏷️ " + noteTagsStr : '') + '</blockquote>';
                } else {
                  if (noteAnn.annotationType === 'note') var noteBlockHtml = "<blockquote>note" + (noteAnn.annotationComment != null ? "<br>" + noteCommentText + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<br>🏷️ " + noteTagsStr : '') + "</blockquote>";else var noteBlockHtml = "<blockquote>" + noteAnn.annotationText + (noteAnn.annotationComment != null ? '<br>' + noteCommentText + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<br>🏷️ " + noteTagsStr : '') + "</blockquote>";
                }
              }
            } else {
              if (noteLineHeight === "紧凑型") {
                noteCommentText = '' + noteAnn.annotationComment;
                noteCommentText = noteCommentText.replace(/\n+/g, "<br>");
                if (noteAnn.annotationType === "image" && noteCommentText.indexOf("![](") != -0x1) {
                  noteImgIndex = noteCommentText.indexOf("![](");
                  let noteImgSubstr = noteCommentText.substring(noteImgIndex),
                    noteImgCloseIdx = noteImgSubstr.indexOf(')'),
                    noteImgUrl = noteImgSubstr.substring(0x4, noteImgCloseIdx);
                  noteImageHtml = "<img src=\"" + noteImgUrl + "\" width=\"500px\" />";
                  let noteBeforeImg = '',
                    noteAfterImg = '';
                  noteImgSubstr.length > noteImgUrl.length + 0x5 && (noteAfterImg = noteImgSubstr.substring(noteImgUrl.length + 0x5));
                  noteImgIndex != 0x0 && (noteBeforeImg = noteCommentText.substring(0x0, noteImgIndex));
                  noteAnn.annotationType === "image" ? (noteCommentText = "<br>" + noteBeforeImg + noteAfterImg, noteCommentText.substring(noteCommentText.length - 0x4) === "<br>" && (noteCommentText = noteCommentText.substring(0x0, noteCommentText.length - 0x4))) : noteCommentText = '' + noteBeforeImg + noteAfterImg + '<br>' + noteImageHtml;
                  noteCommentText = noteCommentText.replace(/<br><br>/g, "<br>");
                }
                if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                  if (noteAnn.annotationType === "image") var noteBlockHtml = '<blockquote><span\x20class=\x22image' + noteAnn.annotationColor + '\x22>' + (noteImgIndex != -0x1 ? noteImageHtml : noteAnn.annotationText) + "</span>" + (noteAnn.annotationComment != null ? (noteCommentText === "<br>" ? '' : noteCommentText) + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<br>🏷️ " + noteTagsStr : '') + '</blockquote>';else {
                    if (noteAnn.annotationType === "note") {
                      var noteBlockHtml = '<blockquote><span\x20class=\x22note\x22\x20style=\x22background-color:\x20' + noteAnn.annotationColor + "\">note</span>" + (noteAnn.annotationComment != null ? '<br>' + noteCommentText + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<br>🏷️ " + noteTagsStr : '') + "</blockquote>";
                    } else var noteBlockHtml = '<blockquote><span\x20class=\x22highlight\x22\x20style=\x22background-color:\x20' + noteAnn.annotationColor + '\x22>' + noteAnn.annotationText + "</span>" + (noteAnn.annotationComment != null ? "<br>" + noteCommentText + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<br>🏷️ " + noteTagsStr : '') + '</blockquote>';
                  }
                } else {
                  if (noteAnn.annotationType === "image") {
                    var noteBlockHtml = "<blockquote><span>" + (noteImgIndex != -0x1 ? noteImageHtml : noteAnn.annotationText) + '</span>' + (noteAnn.annotationComment != null ? (noteCommentText === '<br>' ? '' : noteCommentText) + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<br>🏷️ " + noteTagsStr : '') + "</blockquote>";
                  } else {
                    if (noteAnn.annotationType === "note") {
                      var noteBlockHtml = "<blockquote>note" + (noteAnn.annotationComment != null ? '<br>' + noteCommentText + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<br>🏷️ " + noteTagsStr : '') + "</blockquote>";
                    } else var noteBlockHtml = "<blockquote>" + noteAnn.annotationText + (noteAnn.annotationComment != null ? "<br>" + noteCommentText + noteLinkHtml : noteLinkHtml) + (noteTagsStr != '' ? "<br>🏷️ " + noteTagsStr : '') + "</blockquote>";
                  }
                }
              }
            }
            noteBlocks.push(noteBlockHtml);
          }
        }
      }
      if (noteBlocks.length === 0x1) {
        return false;
      }
      var noteItem = await Zotero.AI4Paper.createNoteItem_annotationsNote(triggerAnnotation, noteIdentifier);
      noteItem && (noteItem.setNote(noteBlocks.join('')), await noteItem.saveTx());
    }
  },
  'autoAddNoteFromAnnotationsForModifyListener': async function (modAnnotation) {
    let modLineHeight = AI4PaperCore.getNoteLineHeight();
    let modBlocks = [],
      modTagsList = [],
      modTagsStr = '',
      modAttachment = modAnnotation.parentItem,
      modParentItem = modAnnotation.parentItem.parentItem;
    if (modParentItem != undefined) {
      var modTitle = modParentItem.getField("title"),
        modYear = Zotero.Date.strToDate(modParentItem.getField("date", false, true)).year;
      if (modParentItem.getCreators().length != 0x0) {
        var modFirstName = modParentItem.getCreators()[0x0].firstName,
          modLastName = modParentItem.getCreators()[0x0].lastName,
          modFirstDash = '-' + modFirstName,
          modLastDash = '-' + modLastName,
          modFullDash = '-' + modLastName + modFirstName;
      } else var modFirstDash = '',
        modLastDash = '',
        modFullDash = '';
    } else return false;
    let modIdentifier = '📝\x20注释笔记\x20' + modAttachment.key;
    if (modParentItem.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1) var modHeaderHtml = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + modAttachment.key + ">>>>>>></h2>" + (modParentItem != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + modYear + modLastDash + '-' + modParentItem.getField('title') + "</span></blockquote>" : '');else {
      var modHeaderHtml = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + modAttachment.key + ">>>>>>></h2>" + (modParentItem != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + modYear + modFullDash + '-' + modParentItem.getField('title') + "</span></blockquote>" : '');
    }
    modBlocks.push(modHeaderHtml);
    if (["application/pdf", "text/html", 'application/epub+zip'].includes(modAttachment.attachmentContentType)) {
      var modAnnotations = await modAttachment.getAnnotations().filter(modFilterAnn => modFilterAnn.annotationType != 'ink');
      if (modAnnotations.length) for (let modAnn of modAnnotations) {
        if (AI4PaperCore.shouldSkipAutoAnnotation(modAnn)) continue;else {
          let modAnnTags = modAnn.getTags();
          modTagsList = [];
          modTagsStr = '';
          if (modAnnTags.length) {
            for (let modAnnTag of modAnnTags) {
              modTagsList.push('#' + modAnnTag.tag);
            }
            modTagsStr = modTagsList.join('\x20');
          }
          let modPageNum = JSON.parse(modAnn.annotationPosition).pageIndex + 0x1,
            modAnnLink = Zotero.AI4Paper.getAnnotationItemLink(modAnn),
            modLinkHtml = " (<a href=\"" + modAnnLink + '\x22>p' + modPageNum + '</a>)',
            modCommentText = '',
            modImageHtml = '',
            modImgIndex = -0x1;
          if (modLineHeight === "宽松型") {
            modCommentText = '' + modAnn.annotationComment;
            modCommentText = modCommentText.replace(/\n+/g, "<br>");
            if (modAnn.annotationType === "image" && modCommentText.indexOf("![](") != -0x1) {
              modImgIndex = modCommentText.indexOf("![](");
              let modImgSubstr = modCommentText.substring(modImgIndex),
                modImgCloseIdx = modImgSubstr.indexOf(')'),
                modImgUrl = modImgSubstr.substring(0x4, modImgCloseIdx);
              modImageHtml = "<img src=\"" + modImgUrl + "\" width=\"500px\" />";
              let modBeforeImg = '',
                modAfterImg = '';
              if (modImgSubstr.length > modImgUrl.length + 0x5) {
                modAfterImg = modImgSubstr.substring(modImgUrl.length + 0x5);
              }
              modImgIndex != 0x0 && (modBeforeImg = modCommentText.substring(0x0, modImgIndex));
              if (modAnn.annotationType === 'image') {
                modCommentText = "<br>" + modBeforeImg + modAfterImg;
                modCommentText.substring(modCommentText.length - 0x4) === '<br>' && (modCommentText = modCommentText.substring(0x0, modCommentText.length - 0x4));
              } else modCommentText = '' + modBeforeImg + modAfterImg + "<br>" + modImageHtml;
              modCommentText = modCommentText.replace(/<br><br>/g, "<br>");
            }
            if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
              if (modAnn.annotationType === 'image') {
                var modBlockHtml = '<blockquote><span\x20class=\x22image' + modAnn.annotationColor + '\x22>' + (modImgIndex != -0x1 ? modImageHtml : modAnn.annotationText) + "</span>" + (modAnn.annotationComment != null ? (modCommentText === "<br>" ? '' : modCommentText) + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? '<p>🏷️\x20' + modTagsStr : '') + '</blockquote>';
              } else {
                if (modAnn.annotationType === "note") var modBlockHtml = "<blockquote><span class=\"note\" style=\"background-color: " + modAnn.annotationColor + "\">note</span>" + (modAnn.annotationComment != null ? "<p>" + modCommentText + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? "<p>🏷️ " + modTagsStr : '') + "</blockquote>";else var modBlockHtml = "<blockquote><span class=\"highlight\" style=\"background-color: " + modAnn.annotationColor + '\x22>' + modAnn.annotationText + '</span>' + (modAnn.annotationComment != null ? '<p>' + modCommentText + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? '<p>🏷️\x20' + modTagsStr : '') + "</blockquote>";
              }
            } else {
              if (modAnn.annotationType === 'image') var modBlockHtml = "<blockquote><span>" + (modImgIndex != -0x1 ? modImageHtml : modAnn.annotationText) + "</span>" + (modAnn.annotationComment != null ? (modCommentText === "<br>" ? '' : modCommentText) + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? "<br>🏷️ " + modTagsStr : '') + "</blockquote>";else {
                if (modAnn.annotationType === "note") var modBlockHtml = "<blockquote>note" + (modAnn.annotationComment != null ? "<br>" + modCommentText + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? "<br>🏷️ " + modTagsStr : '') + "</blockquote>";else {
                  var modBlockHtml = "<blockquote>" + modAnn.annotationText + (modAnn.annotationComment != null ? '<br>' + modCommentText + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? "<br>🏷️ " + modTagsStr : '') + "</blockquote>";
                }
              }
            }
          } else {
            if (modLineHeight === "紧凑型") {
              modCommentText = '' + modAnn.annotationComment;
              modCommentText = modCommentText.replace(/\n+/g, "<br>");
              if (modAnn.annotationType === 'image' && modCommentText.indexOf("![](") != -0x1) {
                modImgIndex = modCommentText.indexOf("![](");
                let modImgSubstr2 = modCommentText.substring(modImgIndex),
                  modImgCloseIdx2 = modImgSubstr2.indexOf(')'),
                  modImgUrl2 = modImgSubstr2.substring(0x4, modImgCloseIdx2);
                modImageHtml = '<img\x20src=\x22' + modImgUrl2 + "\" width=\"500px\" />";
                let modBeforeImg2 = '',
                  modAfterImg2 = '';
                modImgSubstr2.length > modImgUrl2.length + 0x5 && (modAfterImg2 = modImgSubstr2.substring(modImgUrl2.length + 0x5));
                modImgIndex != 0x0 && (modBeforeImg2 = modCommentText.substring(0x0, modImgIndex));
                modAnn.annotationType === "image" ? (modCommentText = "<br>" + modBeforeImg2 + modAfterImg2, modCommentText.substring(modCommentText.length - 0x4) === "<br>" && (modCommentText = modCommentText.substring(0x0, modCommentText.length - 0x4))) : modCommentText = '' + modBeforeImg2 + modAfterImg2 + '<br>' + modImageHtml;
                modCommentText = modCommentText.replace(/<br><br>/g, "<br>");
              }
              if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                if (modAnn.annotationType === "image") var modBlockHtml = '<blockquote><span\x20class=\x22image' + modAnn.annotationColor + '\x22>' + (modImgIndex != -0x1 ? modImageHtml : modAnn.annotationText) + "</span>" + (modAnn.annotationComment != null ? (modCommentText === "<br>" ? '' : modCommentText) + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? "<br>🏷️ " + modTagsStr : '') + "</blockquote>";else {
                  if (modAnn.annotationType === "note") var modBlockHtml = "<blockquote><span class=\"note\" style=\"background-color: " + modAnn.annotationColor + "\">note</span>" + (modAnn.annotationComment != null ? "<br>" + modCommentText + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? "<br>🏷️ " + modTagsStr : '') + "</blockquote>";else var modBlockHtml = "<blockquote><span class=\"highlight\" style=\"background-color: " + modAnn.annotationColor + '\x22>' + modAnn.annotationText + '</span>' + (modAnn.annotationComment != null ? '<br>' + modCommentText + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? "<br>🏷️ " + modTagsStr : '') + "</blockquote>";
                }
              } else {
                if (modAnn.annotationType === "image") var modBlockHtml = "<blockquote><span>" + (modImgIndex != -0x1 ? modImageHtml : modAnn.annotationText) + '</span>' + (modAnn.annotationComment != null ? (modCommentText === '<br>' ? '' : modCommentText) + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? "<br>🏷️ " + modTagsStr : '') + '</blockquote>';else {
                  if (modAnn.annotationType === "note") var modBlockHtml = '<blockquote>note' + (modAnn.annotationComment != null ? "<br>" + modCommentText + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? "<br>🏷️ " + modTagsStr : '') + "</blockquote>";else var modBlockHtml = "<blockquote>" + modAnn.annotationText + (modAnn.annotationComment != null ? "<br>" + modCommentText + modLinkHtml : modLinkHtml) + (modTagsStr != '' ? '<br>🏷️\x20' + modTagsStr : '') + "</blockquote>";
                }
              }
            }
          }
          modBlocks.push(modBlockHtml);
        }
      }
      if (modBlocks.length === 0x1) return false;
      var modNoteItem = await Zotero.AI4Paper.findNoteItem_annotationsNote(modAnnotation, modIdentifier);
      modNoteItem && (modNoteItem.setNote(modBlocks.join('')), await modNoteItem.saveTx());
    }
  },
  'autoAddNoteFromAnnotationsForDeleteListener': async function () {
    let delLineHeight = AI4PaperCore.getNoteLineHeight();
    let delBlocks = [],
      delTagsList = [],
      delTagsStr = '',
      delTabID = Zotero_Tabs._selectedID;
    var delReaderObj = Zotero.Reader.getByTabID(delTabID);
    if (delReaderObj) {
      let delItemID = delReaderObj.itemID;
      var delAttachment = Zotero.Items.get(delItemID);
    } else return false;
    let delParentItem = delAttachment.parentItem;
    if (delParentItem != undefined) {
      var delTitle = delParentItem.getField("title"),
        delYear = Zotero.Date.strToDate(delParentItem.getField('date', false, true)).year;
      if (delParentItem.getCreators().length != 0x0) {
        var delFirstName = delParentItem.getCreators()[0x0].firstName,
          delLastName = delParentItem.getCreators()[0x0].lastName,
          delFirstDash = '-' + delFirstName,
          delLastDash = '-' + delLastName,
          delFullDash = '-' + delLastName + delFirstName;
      } else {
        var delFirstDash = '',
          delLastDash = '',
          delFullDash = '';
      }
    } else return false;
    let delIdentifier = "📝 注释笔记 " + delAttachment.key;
    if (delParentItem.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1) {
      var delHeaderHtml = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + delAttachment.key + ">>>>>>></h2>" + (delParentItem != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + delYear + delLastDash + '-' + delParentItem.getField("title") + "</span></blockquote>" : '');
    } else {
      var delHeaderHtml = "<h2 style=\"color: #ff4757;\">📝 注释笔记 " + delAttachment.key + ">>>>>>></h2>" + (delParentItem != undefined ? "<blockquote><span style=\"font-size: 15px;color: gray\">📍 " + delYear + delFullDash + '-' + delParentItem.getField("title") + "</span></blockquote>" : '');
    }
    delBlocks.push(delHeaderHtml);
    if (["application/pdf", 'text/html', "application/epub+zip"].includes(delAttachment.attachmentContentType)) {
      var delAnnotations = await delAttachment.getAnnotations().filter(delFilterAnn => delFilterAnn.annotationType != "ink");
      if (delAnnotations.length === 0x0) {
        return await Zotero.AI4Paper.deleteNoteWhenZeroAnnotation(delIdentifier), true;
      }
      if (delAnnotations.length) for (let delAnn of delAnnotations) {
        if (AI4PaperCore.shouldSkipAutoAnnotation(delAnn)) continue;else {
          let delAnnTags = delAnn.getTags();
          delTagsList = [];
          delTagsStr = '';
          if (delAnnTags.length) {
            for (let delAnnTag of delAnnTags) {
              delTagsList.push('#' + delAnnTag.tag);
            }
            delTagsStr = delTagsList.join('\x20');
          }
          let delPageNum = JSON.parse(delAnn.annotationPosition).pageIndex + 0x1,
            delAnnLink = Zotero.AI4Paper.getAnnotationItemLink(delAnn),
            delLinkHtml = " (<a href=\"" + delAnnLink + "\">p" + delPageNum + '</a>)',
            delCommentText = '',
            delImageHtml = '',
            delImgIndex = -0x1;
          if (delLineHeight === '宽松型') {
            delCommentText = '' + delAnn.annotationComment;
            delCommentText = delCommentText.replace(/\n+/g, '<br>');
            if (delAnn.annotationType === "image" && delCommentText.indexOf("![](") != -0x1) {
              delImgIndex = delCommentText.indexOf("![](");
              let delImgSubstr = delCommentText.substring(delImgIndex),
                delImgCloseIdx = delImgSubstr.indexOf(')'),
                delImgUrl = delImgSubstr.substring(0x4, delImgCloseIdx);
              delImageHtml = '<img\x20src=\x22' + delImgUrl + "\" width=\"500px\" />";
              let delBeforeImg = '',
                delAfterImg = '';
              if (delImgSubstr.length > delImgUrl.length + 0x5) {
                delAfterImg = delImgSubstr.substring(delImgUrl.length + 0x5);
              }
              delImgIndex != 0x0 && (delBeforeImg = delCommentText.substring(0x0, delImgIndex));
              delAnn.annotationType === "image" ? (delCommentText = "<br>" + delBeforeImg + delAfterImg, delCommentText.substring(delCommentText.length - 0x4) === "<br>" && (delCommentText = delCommentText.substring(0x0, delCommentText.length - 0x4))) : delCommentText = '' + delBeforeImg + delAfterImg + "<br>" + delImageHtml;
              delCommentText = delCommentText.replace(/<br><br>/g, '<br>');
            }
            if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
              if (delAnn.annotationType === "image") var delBlockHtml = "<blockquote><span class=\"image" + delAnn.annotationColor + '\x22>' + (delImgIndex != -0x1 ? delImageHtml : delAnn.annotationText) + '</span>' + (delAnn.annotationComment != null ? (delCommentText === "<br>" ? '' : delCommentText) + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? "<p>🏷️ " + delTagsStr : '') + "</blockquote>";else {
                if (delAnn.annotationType === "note") var delBlockHtml = '<blockquote><span\x20class=\x22note\x22\x20style=\x22background-color:\x20' + delAnn.annotationColor + '\x22>note</span>' + (delAnn.annotationComment != null ? "<p>" + delCommentText + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? '<p>🏷️\x20' + delTagsStr : '') + "</blockquote>";else {
                  var delBlockHtml = "<blockquote><span class=\"highlight\" style=\"background-color: " + delAnn.annotationColor + '\x22>' + delAnn.annotationText + "</span>" + (delAnn.annotationComment != null ? "<p>" + delCommentText + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? '<p>🏷️\x20' + delTagsStr : '') + "</blockquote>";
                }
              }
            } else {
              if (delAnn.annotationType === 'image') {
                var delBlockHtml = "<blockquote><span>" + (delImgIndex != -0x1 ? delImageHtml : delAnn.annotationText) + "</span>" + (delAnn.annotationComment != null ? (delCommentText === "<br>" ? '' : delCommentText) + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? "<br>🏷️ " + delTagsStr : '') + "</blockquote>";
              } else {
                if (delAnn.annotationType === "note") {
                  var delBlockHtml = '<blockquote>note' + (delAnn.annotationComment != null ? "<br>" + delCommentText + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? '<br>🏷️\x20' + delTagsStr : '') + "</blockquote>";
                } else {
                  var delBlockHtml = "<blockquote>" + delAnn.annotationText + (delAnn.annotationComment != null ? "<br>" + delCommentText + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? "<br>🏷️ " + delTagsStr : '') + "</blockquote>";
                }
              }
            }
          } else {
            if (delLineHeight === "紧凑型") {
              delCommentText = '' + delAnn.annotationComment;
              delCommentText = delCommentText.replace(/\n+/g, "<br>");
              if (delAnn.annotationType === "image" && delCommentText.indexOf('![](') != -0x1) {
                delImgIndex = delCommentText.indexOf("![](");
                let delImgSubstr2 = delCommentText.substring(delImgIndex),
                  delImgCloseIdx2 = delImgSubstr2.indexOf(')'),
                  delImgUrl2 = delImgSubstr2.substring(0x4, delImgCloseIdx2);
                delImageHtml = "<img src=\"" + delImgUrl2 + "\" width=\"500px\" />";
                let delBeforeImg2 = '',
                  delAfterImg2 = '';
                delImgSubstr2.length > delImgUrl2.length + 0x5 && (delAfterImg2 = delImgSubstr2.substring(delImgUrl2.length + 0x5));
                delImgIndex != 0x0 && (delBeforeImg2 = delCommentText.substring(0x0, delImgIndex));
                if (delAnn.annotationType === "image") {
                  delCommentText = "<br>" + delBeforeImg2 + delAfterImg2;
                  delCommentText.substring(delCommentText.length - 0x4) === '<br>' && (delCommentText = delCommentText.substring(0x0, delCommentText.length - 0x4));
                } else {
                  delCommentText = '' + delBeforeImg2 + delAfterImg2 + "<br>" + delImageHtml;
                }
                delCommentText = delCommentText.replace(/<br><br>/g, "<br>");
              }
              if (!Zotero.Prefs.get("ai4paper.autoannotationsnotecolor")) {
                if (delAnn.annotationType === 'image') var delBlockHtml = "<blockquote><span class=\"image" + delAnn.annotationColor + '\x22>' + (delImgIndex != -0x1 ? delImageHtml : delAnn.annotationText) + '</span>' + (delAnn.annotationComment != null ? (delCommentText === '<br>' ? '' : delCommentText) + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? "<br>🏷️ " + delTagsStr : '') + "</blockquote>";else {
                  if (delAnn.annotationType === 'note') var delBlockHtml = "<blockquote><span class=\"note\" style=\"background-color: " + delAnn.annotationColor + '\x22>note</span>' + (delAnn.annotationComment != null ? "<br>" + delCommentText + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? "<br>🏷️ " + delTagsStr : '') + "</blockquote>";else {
                    var delBlockHtml = "<blockquote><span class=\"highlight\" style=\"background-color: " + delAnn.annotationColor + '\x22>' + delAnn.annotationText + "</span>" + (delAnn.annotationComment != null ? "<br>" + delCommentText + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? "<br>🏷️ " + delTagsStr : '') + "</blockquote>";
                  }
                }
              } else {
                if (delAnn.annotationType === 'image') var delBlockHtml = '<blockquote><span>' + (delImgIndex != -0x1 ? delImageHtml : delAnn.annotationText) + '</span>' + (delAnn.annotationComment != null ? (delCommentText === "<br>" ? '' : delCommentText) + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? "<br>🏷️ " + delTagsStr : '') + "</blockquote>";else {
                  if (delAnn.annotationType === 'note') var delBlockHtml = "<blockquote>note" + (delAnn.annotationComment != null ? "<br>" + delCommentText + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? "<br>🏷️ " + delTagsStr : '') + '</blockquote>';else {
                    var delBlockHtml = "<blockquote>" + delAnn.annotationText + (delAnn.annotationComment != null ? "<br>" + delCommentText + delLinkHtml : delLinkHtml) + (delTagsStr != '' ? "<br>🏷️ " + delTagsStr : '') + '</blockquote>';
                  }
                }
              }
            }
          }
          delBlocks.push(delBlockHtml);
        }
      }
      if (delBlocks.length === 0x1) return false;
      let delCurrentItem = Zotero.AI4Paper.getCurrentItem(true);
      if (!delCurrentItem) return false;
      var delNoteItem = await Zotero.AI4Paper.findNoteItem_annotationsNote(delCurrentItem, delIdentifier);
      delNoteItem && (delNoteItem.setNote(delBlocks.join('')), await delNoteItem.saveTx());
    }
  },
  'createNoteItem_annotationsNote': async function (sourceAnnotation, noteTitle2) {
    let parentItem = sourceAnnotation?.["parentItem"]?.["parentItem"];
    if (!parentItem || !parentItem.isRegularItem()) return;
    let existingNote = await Zotero.AI4Paper.findNoteItem_annotationsNote(parentItem, noteTitle2);
    if (existingNote) return existingNote;else {
      let newNote = new Zotero.Item("note");
      return newNote.libraryID = parentItem.libraryID, newNote.parentKey = parentItem.key, await newNote.saveTx(), newNote.addTag('/注释笔记'), await newNote.saveTx(), newNote;
    }
  },
  'findNoteItem_annotationsNote': async function (findItem, findTitle) {
    findItem.isAnnotation() && (findItem = findItem?.["parentItem"]?.['parentItem']);
    if (!findItem || !findItem.isRegularItem()) return;
    let noteIDs = findItem.getNotes(),
      noteItems = noteIDs.map(noteId => Zotero.Items.get(noteId)),
      matchingNotes = noteItems.filter(noteObj => noteObj.getNote().includes(findTitle));
    if (matchingNotes.length > 0x1) {
      for (let dupIdx = 0x1; dupIdx < matchingNotes.length; dupIdx++) {
        matchingNotes[dupIdx].deleted = true;
        await matchingNotes[dupIdx].saveTx();
      }
    }
    return matchingNotes[0x0] || false;
  },
  'deleteNoteWhenZeroAnnotation': async function (identifier) {
    let delNoteTabID = Zotero_Tabs._selectedID;
    var delNoteReader = Zotero.Reader.getByTabID(delNoteTabID);
    if (delNoteReader) {
      let delNoteItemID = delNoteReader.itemID;
      var delNoteAttachment = Zotero.Items.get(delNoteItemID);
      if (delNoteAttachment && delNoteAttachment.parentItemID) {
        delNoteItemID = delNoteAttachment.parentItemID;
        delNoteAttachment = Zotero.Items.get(delNoteItemID);
      }
    } else return false;
    var delNoteIDs = delNoteAttachment.getNotes();
    for (let delNoteID of delNoteIDs) {
      let noteToDelete = Zotero.Items.get(delNoteID),
        noteHtml = noteToDelete.getNote();
      if (noteHtml.indexOf(identifier) != -0x1) {
        return noteToDelete.deleted = true, await noteToDelete.saveTx(), true;
      }
    }
    return false;
  },

  // === Block H: Space Optimization + Annotation Head ===
  'onclickAnnotationButton_optimizeSpaces': async function (optAnnotation) {
    let {
      sourceText: sourceText,
      type: optimizedType
    } = await Zotero.AI4Paper.optimizeSpaces_annotationItem(optAnnotation);
    optimizedType && (Zotero.AI4Paper.copy2Clipboard(sourceText), Zotero.AI4Paper.showProgressWindow(0xbb8, '✅\x20已优化空格【Zotero\x20One】', "已为【" + optimizedType + "】优化空格！"));
  },
  'optimizeSpaces_annotationItem': async function (spaceAnnotation, commentOnly) {
    let originalText, optimizedText;
    if (!commentOnly) {
      if (['highlight', 'underline'].includes(spaceAnnotation.annotationType)) {
        originalText = spaceAnnotation.annotationText;
        optimizedText = Zotero.AI4Paper.optimizeSpaces(originalText);
        if (optimizedText) {
          return spaceAnnotation.annotationText = optimizedText, await spaceAnnotation.saveTx(), {
            'sourceText': originalText,
            'type': '注释文本'
          };
        }
      } else {
        if (["note", 'text', "image"].includes(spaceAnnotation.annotationType)) {
          originalText = '' + spaceAnnotation.annotationComment;
          optimizedText = Zotero.AI4Paper.optimizeSpaces(originalText);
          if (optimizedText) return spaceAnnotation.annotationComment = optimizedText, await spaceAnnotation.saveTx(), {
            'sourceText': originalText,
            'type': '注释评论'
          };
        }
      }
      return {
        'sourceText': originalText,
        'type': ''
      };
    } else {
      if (["highlight", "underline", "note", "text", 'image'].includes(spaceAnnotation.annotationType)) {
        originalText = '' + spaceAnnotation.annotationComment;
        optimizedText = Zotero.AI4Paper.optimizeSpaces(originalText);
        if (optimizedText) {
          return spaceAnnotation.annotationComment = optimizedText, await spaceAnnotation.saveTx(), {
            'sourceText': originalText,
            'type': "注释评论"
          };
        }
      }
      return {
        'sourceText': originalText,
        'type': ''
      };
    }
  },
  'optimizeSpaces4CurrentTab': async function (tabAnnotation) {
    let optTabID = Zotero_Tabs._selectedID,
      optTabReader = Zotero.Reader.getByTabID(optTabID);
    if (optTabReader) {
      let optTabAttachment = tabAnnotation.parentItem;
      if (optTabReader._item === optTabAttachment) {
        if (Zotero.Prefs.get("ai4paper.optimizeSpacesOnly4CNRefs")) {
          let optTabParent = tabAnnotation?.['parentItem']?.["parentItem"];
          if (optTabParent) {
            const cnLanguages = ['', 'zh', 'zh-CN', "zh_CN"];
            let itemLanguage = optTabParent.getField("language");
            if (!cnLanguages.includes(itemLanguage)) return;
          }
        }
        optimizedText = Zotero.AI4Paper.optimizeSpaces(tabAnnotation.annotationText);
        optimizedText && (tabAnnotation.annotationText = optimizedText, await tabAnnotation.saveTx());
      }
    }
  },
  'optimizeSpaces': function (text) {
    try {
      const punctMap = {
          '.': '。',
          ',': '，',
          '!': '！',
          '?': '？',
          ':': '：',
          ';': '；'
        },
        toHalfWidth = fullChar => String.fromCharCode(fullChar.charCodeAt(0x0) - 0xfee0),
        cjkPattern = "[一-龥㐀-䶿豈-﫿]",
        placeholders = [];
      let placeholderIdx = 0x0;
      const addPlaceholder = (content, type = 'default') => {
          const placeholder = '__PLACEHOLDER_' + type + '_' + placeholderIdx + '__';
          return placeholders.push({
            'placeholder': placeholder,
            'content': content,
            'type': type
          }), placeholderIdx++, placeholder;
        },
        restorePlaceholders = inputStr => {
          let result = inputStr;
          for (const {
            placeholder: ph,
            content: phContent,
            type: phType
          } of placeholders) {
            let restored = phContent;
            switch (phType) {
              case "markdown_image":
              case "markdown_link":
                const phIdx = result.indexOf(ph),
                  charBefore = result[phIdx - 0x1],
                  charAfter = result[phIdx + ph.length];
                charBefore && charBefore !== '\x0a' && (restored = '\x0a' + restored);
                charAfter && charAfter !== '\x0a' && (restored = restored + '\x0a');
                break;
              case "url":
              case "email":
                const phIdx2 = result.indexOf(ph),
                  charBefore2 = result[phIdx2 - 0x1],
                  charAfter2 = result[phIdx2 + ph.length];
                charBefore2 && charBefore2 !== '\x20' && charBefore2 !== '\x0a' && (restored = '\x20' + restored);
                if (charAfter2 && charAfter2 !== '\x20' && charAfter2 !== '\x0a') {
                  restored = restored + '\x20';
                }
                break;
              case 'translation_marker':
                break;
            }
            result = result.replace(ph, restored);
          }
          return result;
        };
      let withPlaceholders = text.replace(/【👈\s*译】/g, transMarker => addPlaceholder(transMarker, "translation_marker")).replace(/!\[[^\]]*\]\([^)]+\)/g, mdImage => addPlaceholder(mdImage, "markdown_image")).replace(/\[[^\]]+\]\([^)]+\)/g, mdLink => addPlaceholder(mdLink, 'markdown_link')).replace(/(?:https?|ftp):\/\/[^\s\u4e00-\u9fa5]+/gi, urlMatch => addPlaceholder(urlMatch, "url")).replace(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/g, emailMatch => addPlaceholder(emailMatch, "email")),
        cleaned = withPlaceholders.replace(/[\r\n]/g, '').replace(/[\uE5D2\uE5CF\uE5CE\uE5E5]/g, '').replace(/[Ａ-Ｚａ-ｚ０-９！＂＇（）［］｛｝＜＞，．：；－]/g, toHalfWidth).replace(/\s+/g, '\x20').replace(/(?<=\d)\s+|\s+(?=\d)/g, '').replace(/\s*(?=[.,:;!?"()\[\]。？！，、；：""''（）《》【】])|(?<=[.,:;!?"()\[\]。？！，、；：""''（）《》【】])\s*/g, '').replace(new RegExp("(\\S)\\s+(?=" + cjkPattern + ")|(?<=" + cjkPattern + ")\\s+(\\S)", 'g'), "$1$2").replace(new RegExp('(' + cjkPattern + "+)([,.!?:;]+)", 'g'), (matchFull, cjkPart, punctPart) => cjkPart + punctPart.split('').map(ch => punctMap[ch]).join('')).replace(new RegExp("([,.!?:;]+)(" + cjkPattern + '+)', 'g'), (matchFull2, punctPart2, cjkPart2) => punctPart2.split('').map(ch2 => punctMap[ch2]).join('') + cjkPart2).replace(new RegExp("\\(([^()]*" + cjkPattern + "[^()]*)\\)|\\[([^\\[\\]]*" + cjkPattern + "[^\\[\\]]*)\\]", 'g'), (bracketMatch, parenContent, bracketContent) => parenContent ? '（' + parenContent + '）' : '【' + bracketContent + '】').replace(/([0-9a-zA-Z])（/g, '$1' + String.fromCharCode(0xff08)).replace(/）([0-9a-zA-Z])/g, String.fromCharCode(0xff09) + '$1').replace(/([a-zA-Z]+)([,.!?:;]+)([a-zA-Z]+)/g, (punctMatch, wordBefore, punctBetween, wordAfter) => wordBefore + punctBetween + '\x20' + wordAfter).replace(/(\S)\(/g, '$1\x20(').replace(new RegExp("\\)(" + cjkPattern + ')', 'g'), ')\x20$1').replace(/([,.!?:;)])(?!\s|(?<=\.)\d)/g, "$1 ").replace(/🔤(.*)/g, (emojiLine, emojiRest) => emojiRest.trim() ? "\n🔤" + emojiRest : '🔤');
      return restorePlaceholders(cleaned);
    } catch (optError) {
      Zotero.debug(optError);
    }
  },
  'setAnnotationHead': async function (headAnnotation) {
    let headDialogResult = Zotero.AI4Paper.openDialogByType_modal("addAnnotationHead", headAnnotation);
    if (!headDialogResult) {
      return false;
    }
    let headComment = '' + headAnnotation.annotationComment;
    if (headComment === "null") {
      headAnnotation.annotationComment = headDialogResult;
    } else {
      if (headComment != 'null' && headComment.indexOf('<ZH') === -0x1) headAnnotation.annotationComment = headDialogResult + '\x20' + headComment;else {
        if (headComment != 'null' && headComment.indexOf('<ZH') != -0x1) {
          let headFound = false,
            headTagName = '';
          if (headComment.indexOf("<ZH1>") != -0x1 && headComment.indexOf("<ZH1/>") != -0x1) {
            headTagName = 'ZH1';
            headFound = true;
          } else {
            if (headComment.indexOf("<ZH2>") != -0x1 && headComment.indexOf("<ZH2/>") != -0x1) {
              headTagName = 'ZH2';
              headFound = true;
            } else {
              if (headComment.indexOf("<ZH3>") != -0x1 && headComment.indexOf("<ZH3/>") != -0x1) {
                headTagName = "ZH3";
                headFound = true;
              } else {
                if (headComment.indexOf('<ZH4>') != -0x1 && headComment.indexOf("<ZH4/>") != -0x1) {
                  headTagName = "ZH4";
                  headFound = true;
                } else {
                  if (headComment.indexOf('<ZH5>') != -0x1 && headComment.indexOf("<ZH5/>") != -0x1) {
                    headTagName = "ZH5";
                    headFound = true;
                  } else headComment.indexOf('<ZH6>') != -0x1 && headComment.indexOf('<ZH6/>') != -0x1 && (headTagName = 'ZH6', headFound = true);
                }
              }
            }
          }
          if (headFound) {
            let headTagStart = headComment.indexOf('<' + headTagName + '>'),
              headTagSubstr = headComment.substring(headTagStart),
              headTagEnd = headTagSubstr.indexOf('<' + headTagName + '/>'),
              headTagContent = headTagSubstr.substring(0x5, headTagEnd),
              headBefore = '',
              headAfter = '';
            headTagSubstr.length > headTagContent.length + 0xb && (headAfter = headTagSubstr.substring(headTagContent.length + 0xb));
            if (headTagStart != 0x0) {
              headBefore = headComment.substring(0x0, headTagStart);
            }
            headAnnotation.annotationComment = '' + headBefore + headDialogResult + headAfter;
          }
        }
      }
    }
    await headAnnotation.saveTx();
    Zotero.AI4Paper.handleNewAnnotationFiltering(headAnnotation);
  },

  // === Block I: Annotation Item Link ===
  'getAnnotationItemLink': function (linkAnnotation) {
    let libraryType = Zotero.Libraries.get(linkAnnotation.libraryID).libraryType;
    if (libraryType === "group") return "zotero://open-pdf/" + Zotero.URI.getLibraryPath(linkAnnotation.libraryID) + "/items/" + linkAnnotation.parentKey + '?page=' + (JSON.parse(linkAnnotation.annotationPosition).pageIndex + 0x1) + '&annotation=' + linkAnnotation.key;else {
      if (libraryType === "user") return "zotero://open-pdf/library/items/" + linkAnnotation.parentKey + "?page=" + (JSON.parse(linkAnnotation.annotationPosition).pageIndex + 0x1) + "&annotation=" + linkAnnotation.key;
    }
    return undefined;
  },

  // === Block J: Color Label Tagging ===
  'addAnnotationTagBasedOnColorLabel': async function (colorAnnotation) {
    let typeSettings = {
        'highlight': Zotero.Prefs.get("ai4paper.addTagAnnotationTypeHighlight"),
        'underline': Zotero.Prefs.get("ai4paper.addTagAnnotationTypeUnderline"),
        'note': Zotero.Prefs.get("ai4paper.addTagAnnotationTypeNote"),
        'text': Zotero.Prefs.get("ai4paper.addTagAnnotationTypeText"),
        'image': Zotero.Prefs.get('ai4paper.addTagAnnotationTypeImage'),
        'ink': Zotero.Prefs.get("ai4paper.addTagAnnotationTypeInk")
      },
      colorLabelNames = [Zotero.Prefs.get("ai4paper.yellowColorLabel"), Zotero.Prefs.get("ai4paper.redColorLabel"), Zotero.Prefs.get("ai4paper.greenColorLabel"), Zotero.Prefs.get("ai4paper.blueColorLabel"), Zotero.Prefs.get("ai4paper.purpleColorLabel"), Zotero.Prefs.get('ai4paper.magentaColorLabel'), Zotero.Prefs.get("ai4paper.orangeColorLabel"), Zotero.Prefs.get("ai4paper.grayColorLabel")],
      colorHexValues = ["#ffd400", "#ff6666", "#5fb236", "#2ea8e5", "#a28ae5", '#e56eee', '#f19837', "#aaaaaa"],
      colorMatchIdx = colorHexValues.indexOf(colorAnnotation.annotationColor);
    if (colorMatchIdx != -0x1 && typeSettings[colorAnnotation.annotationType]) {
      let tagForColor = colorLabelNames[colorMatchIdx];
      if (tagForColor.trim()) {
        tagForColor = tagForColor.trim();
        if (Zotero.Prefs.get("ai4paper.defineColorLabelAutoAddTagArray")) {
          let tagParts = tagForColor.split('\x20');
          for (let tagPart of tagParts) {
            colorAnnotation.addTag(tagPart);
            await colorAnnotation.saveTx();
          }
        } else {
          colorAnnotation.addTag(tagForColor);
          await colorAnnotation.saveTx();
        }
      }
    }
  },

});
