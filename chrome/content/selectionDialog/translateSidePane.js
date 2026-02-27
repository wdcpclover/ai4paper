function translateSidePane_init() {
  Zotero.AI4Paper.update_svg_icons(document);

  // 根据 Zotero 版本调整样式
  Zotero.AI4Paper.updateHTMLTextAreaBorder4ZoteroScheme(window);
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  let screen_height = window.screen.height;
  // 使用默认 UI 高度
  if (!Zotero.Prefs.get('ai4paper.translateEnableCustomUIHeight')) {
    if (parseInt(screen_height) <= 1000) {
      document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.height = screen_height * 0.30 + 'px';
      document.getElementById("ai4paper-translate-readerSidePane-response").style.height = screen_height * 0.352 + 'px';
      // 预置参数
      Zotero.Prefs.set('ai4paper.translateCustomSourceTextAreaHeight', (screen_height * 0.30).toFixed(2)); // 保留 2 位小数
      Zotero.Prefs.set('ai4paper.translateCustomResponseAreaHeight', (screen_height * 0.352).toFixed(2));
    } else {
      document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.height = screen_height * 0.33 + 'px';
      document.getElementById("ai4paper-translate-readerSidePane-response").style.height = screen_height * 0.4 + 'px';
      // 预置参数
      Zotero.Prefs.set('ai4paper.translateCustomSourceTextAreaHeight', (screen_height * 0.33).toFixed(2));
      Zotero.Prefs.set('ai4paper.translateCustomResponseAreaHeight', (screen_height * 0.4).toFixed(2));
    }
  }
  // 使用自定义 UI 高度
  else {
    document.getElementById("ai4paper-translate-readerSidePane-sourcetext").style.height = `${Zotero.Prefs.get('ai4paper.translateCustomSourceTextAreaHeight')}px`;
    document.getElementById("ai4paper-translate-readerSidePane-response").style.height = `${Zotero.Prefs.get('ai4paper.translateCustomResponseAreaHeight')}px`;
  }

  // 右键以清空
  // document.getElementById("ai4paper-translate-readerSidePane-sourcetext").addEventListener("mousedown", (event) => {
  //     if (event.button == 2) {
  //         clearTranslation();
  //     }
  // });

  Zotero.AI4Paper.updateTranslateReaderSidePane();
}
async function translateText() {
  let sourceText = document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value;
  if (!sourceText) {
    return false;
  }
  if (Zotero.AI4Paper.isChineseText(sourceText)) {
    return false;
  }
  if (Zotero.Prefs.get('ai4paper.translationvocabularyfirst')) {
    if (sourceText.indexOf(' ') === -1) {
      sourceText = sourceText.trim();
      sourceText = sourceText.toLowerCase();
      sourceText = sourceText.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, '');
      sourceText = sourceText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '');
      sourceText = sourceText.replace(/[0-9]/g, '');
      let vocabularySearchResult = await Zotero.AI4Paper.translateSidePaneVocabulary(sourceText);
      if (vocabularySearchResult && vocabularySearchResult != -1) {
        return -1;
      }
    }
  }
  // 翻译
  Zotero.AI4Paper.translationEngineTask(sourceText, 'onSelect');
}
function clearTranslation() {
  document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value = '';
  document.getElementById("ai4paper-translate-readerSidePane-response").value = '';
  document.getElementById("ai4paper-translate-readerSidePane-response").placeholder = '这里显示翻译结果';
  document.getElementById("ai4paper-translate-readerSidePane-response").style.boxShadow = '0 0 1px rgba(0, 0, 0, 0.5)';
  Zotero.Prefs.set('ai4paper.selectedtexttrans', '');
  Zotero.AI4Paper.translateSourceText = '';
  Zotero.AI4Paper.translateResponse = '';
}
function copySourceText() {
  Zotero.AI4Paper.copy2Clipboard(document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value);
}
function copySourceTextANDResponse() {
  Zotero.AI4Paper.copy2Clipboard(`${document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value}\n\n${document.getElementById("ai4paper-translate-readerSidePane-response").value}`);
}
function copyResponse() {
  Zotero.AI4Paper.copy2Clipboard(document.getElementById("ai4paper-translate-readerSidePane-response").value);
}
function pushSourceText() {
  Zotero.AI4Paper.translateSourceText = document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value;
}

// function pushSelectedAPI(){
//     Zotero.Prefs.set('ai4paper.selectedtexttransengine', document.getElementById("ai4paper-translate-readerSidePane-api").value);
// }

// function enableAutoTranslate(){
//     let checkBox = document.getElementById("ai4paper-translate-readerSidePane-auto-translate");
//     if (checkBox.checked == true){
//         Zotero.Prefs.set('ai4paper.selectedtexttransenable', true);
//     } else {
//         Zotero.Prefs.set('ai4paper.selectedtexttransenable', false);
//     }
//     Zotero.AI4Paper.updateButtonStateInit();
// }

// function enableVocabularyFirst(){
//     let checkBox = document.getElementById("ai4paper-translate-readerSidePane-vocabulary-first");
//     if (checkBox.checked == true){
//         Zotero.Prefs.set('ai4paper.translationvocabularyfirst', true);
//     } else {
//         Zotero.Prefs.set('ai4paper.translationvocabularyfirst', false);
//     }
// }

// function enableCrossParagraphsMode(){
//     let checkBox = document.getElementById("ai4paper-translate-readerSidePane-cross-paragraphs");
//     if (checkBox.checked == true){
//         Zotero.Prefs.set('ai4paper.translationcrossparagraphs', true);
//     } else {
//         Zotero.Prefs.set('ai4paper.translationcrossparagraphs', false);
//     }
// }

function enableVocabularyReview() {
  let checkBox = document.getElementById("ai4paper-translate-readerSidePane-vocaulary-review");
  if (checkBox.checked == true) {
    Zotero.AI4Paper.vocabularyreviewmode = 'true';
    document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = 'inline';
    // document.getElementById("translate-readerSidePane-vocabulary-words-locate-space").style.display = 'inline';
    document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = 'inline';
    if (Zotero.Prefs.get('ai4paper.vocabularyreviewgiveinterpretation')) {
      document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = 'none';
    } else {
      document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = 'inline';
    }
    Zotero.AI4Paper.getVocabularyAllWords();
  } else {
    Zotero.AI4Paper.vocabularyreviewmode = 'false';
    document.getElementById("ai4paper-translate-readerSidePane-vocabulary-next").style.display = 'none';
    document.getElementById("ai4paper-translate-readerSidePane-vocabulary-interpretation").style.display = 'none';
    // document.getElementById("translate-readerSidePane-vocabulary-words-locate-space").style.display = 'none';
    document.getElementById("translate-readerSidePane-vocabulary-words-locate").style.display = 'none';
  }
}
function locateVocabulary() {
  let link = Zotero.AI4Paper.vocabularyzoterolink;
  if (link != '') {
    Zotero.AI4Paper.openVocabularyZoteroLink(link);
  } else {
    window.alert('链接为空！');
    return false;
  }
}
function checkKeyEnter(keys) {
  if (!keys.shiftKey && !keys.ctrlKey && !keys.altKey && !keys.metaKey && keys.keyCode === 13) {
    keys.returnValue = false;
    if (keys.preventDefault) {
      keys.preventDefault();
    }
    translateText();
  }
}
function pronunciation() {
  let sourceText = document.getElementById("ai4paper-translate-readerSidePane-sourcetext").value;
  if (!sourceText) {
    window.alert('❌ 内容为空！请添加翻译源文后再试！');
    return false;
  }
  if (sourceText.indexOf(' ') != -1) {
    window.alert('❌ 当前源文不是单词，无法播放发音！');
    return false;
  }
  Zotero.AI4Paper.translateSidePaneAudioPlay(sourceText);
}