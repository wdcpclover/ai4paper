Object.assign(Zotero.AI4Paper, {
  'formatItemNotes': function (html) {
    return AI4PaperNotesCore.formatItemNotes(html);
  },
  'checkGroupLibItem': function (item) {
    return Zotero.Libraries.get(item.libraryID).libraryType === "group" ? Zotero.Libraries.get(item.libraryID).groupID : false;
  },
  'addEmojiBlockQuoteLink': async function () {
    let categories = ["🥰 表情", "👍 人体部位", '👨\x20人物', '🧣\x20服饰', '🐯\x20动物与自然', "🍔 食物与饮料", "🏓 活动与运动", "🚗 旅行与地点", "💰 物件", "💜 符号"],
      smileys = [];
    smileys = smileys.concat(Zotero.AI4Paper._data_emoji_Smileys.split(';'));
    let gestures = [];
    gestures = gestures.concat(Zotero.AI4Paper._data_emoji_Gestures_Body_Parts.split(';'));
    let people = [];
    people = people.concat(Zotero.AI4Paper._data_emoji_People_Fantasy.split(';'));
    let clothing = [];
    clothing = clothing.concat(Zotero.AI4Paper._data_emoji_Clothing_Accessories.split(';'));
    let animals = [];
    animals = animals.concat(Zotero.AI4Paper._data_emoji_Animals_Nature.split(';'));
    let food = [];
    food = food.concat(Zotero.AI4Paper._data_emoji_Food_Drink.split(';'));
    let activity = [];
    activity = activity.concat(Zotero.AI4Paper._data_emoji_Activity_Sports.split(';'));
    let travel = [];
    travel = travel.concat(Zotero.AI4Paper._data_emoji_Travel_Places.split(';'));
    let objects = [];
    objects = objects.concat(Zotero.AI4Paper._data_emoji_Objects.split(';'));
    let symbols = [];
    symbols = symbols.concat(Zotero.AI4Paper._data_emoji_Symbols.split(';'));
    Zotero.Prefs.set("ai4paper.blockquotelinkstyledialogcaption", '选择表情');
    var selectedCategory = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", categories);
    if (!selectedCategory) return Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper"), null;
    let count = 0x0,
      selectedNames = [];
    Object.keys(selectedCategory).forEach(async function (key) {
      count++;
      selectedNames.push(selectedCategory[key]);
    });
    if (count > 0x1) return window.alert("请仅选择其中一个 Emoji 分类，点击 OK 以重新选择！"), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
    Zotero.Prefs.set("ai4paper.blockquotelinkstyledialogcaption", '' + selectedNames[0x0]);
    if (selectedNames[0x0] === "🥰 表情") {
      let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", smileys);
      if (!dialogResult) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
      let count2 = 0x0,
        selected = [];
      Object.keys(dialogResult).forEach(async function (key) {
        count2++;
        selected.push(dialogResult[key]);
      });
      if (count2 > 0x5) return window.alert("最多支持选择 5 个 Emoji，点击 OK 以重新选择！"), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;else {
        let emojiStr = '';
        for (let emoji of selected) {
          emojiStr = '' + emojiStr + emoji;
        }
        Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + emojiStr);
        Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
      }
    } else {
      if (selectedNames[0x0] === "👍 人体部位") {
        let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", gestures);
        if (!dialogResult) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
        let count2 = 0x0,
          selected = [];
        Object.keys(dialogResult).forEach(async function (key) {
          count2++;
          selected.push(dialogResult[key]);
        });
        if (count2 > 0x5) return window.alert("最多支持选择 5 个 Emoji，点击 OK 以重新选择！"), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;else {
          let emojiStr = '';
          for (let emoji of selected) {
            emojiStr = '' + emojiStr + emoji;
          }
          Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + emojiStr);
          Zotero.Utilities.Internal.openPreferences('zotero-prefpane-ai4paper');
        }
      } else {
        if (selectedNames[0x0] === '👨\x20人物') {
          let dialogResult = Zotero.AI4Paper.openDialogByType_modal('selectEmoji', people);
          if (!dialogResult) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
          let count2 = 0x0,
            selected = [];
          Object.keys(dialogResult).forEach(async function (key) {
            count2++;
            selected.push(dialogResult[key]);
          });
          if (count2 > 0x5) return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;else {
            let emojiStr = '';
            for (let emoji of selected) {
              emojiStr = '' + emojiStr + emoji;
            }
            Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + emojiStr);
            Zotero.Utilities.Internal.openPreferences('zotero-prefpane-ai4paper');
          }
        } else {
          if (selectedNames[0x0] === "🧣 服饰") {
            let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", clothing);
            if (!dialogResult) {
              return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
            }
            let count2 = 0x0,
              selected = [];
            Object.keys(dialogResult).forEach(async function (key) {
              count2++;
              selected.push(dialogResult[key]);
            });
            if (count2 > 0x5) {
              return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
            } else {
              let emojiStr = '';
              for (let emoji of selected) {
                emojiStr = '' + emojiStr + emoji;
              }
              Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + emojiStr);
              Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
            }
          } else {
            if (selectedNames[0x0] === "🐯 动物与自然") {
              let dialogResult = Zotero.AI4Paper.openDialogByType_modal('selectEmoji', animals);
              if (!dialogResult) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
              let count2 = 0x0,
                selected = [];
              Object.keys(dialogResult).forEach(async function (key) {
                count2++;
                selected.push(dialogResult[key]);
              });
              if (count2 > 0x5) {
                return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
              } else {
                let emojiStr = '';
                for (let emoji of selected) {
                  emojiStr = '' + emojiStr + emoji;
                }
                Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + emojiStr);
                Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
              }
            } else {
              if (selectedNames[0x0] === "🍔 食物与饮料") {
                let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", food);
                if (!dialogResult) {
                  return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                }
                let count2 = 0x0,
                  selected = [];
                Object.keys(dialogResult).forEach(async function (key) {
                  count2++;
                  selected.push(dialogResult[key]);
                });
                if (count2 > 0x5) return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;else {
                  let emojiStr = '';
                  for (let emoji of selected) {
                    emojiStr = '' + emojiStr + emoji;
                  }
                  Zotero.Prefs.set('ai4paper.blockquotelinkstyleemoji', '' + emojiStr);
                  Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
                }
              } else {
                if (selectedNames[0x0] === "🏓 活动与运动") {
                  let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", activity);
                  if (!dialogResult) {
                    return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                  }
                  let count2 = 0x0,
                    selected = [];
                  Object.keys(dialogResult).forEach(async function (key) {
                    count2++;
                    selected.push(dialogResult[key]);
                  });
                  if (count2 > 0x5) return window.alert("最多支持选择 5 个 Emoji，点击 OK 以重新选择！"), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;else {
                    let emojiStr = '';
                    for (let emoji of selected) {
                      emojiStr = '' + emojiStr + emoji;
                    }
                    Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + emojiStr);
                    Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
                  }
                } else {
                  if (selectedNames[0x0] === "🚗 旅行与地点") {
                    let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", travel);
                    if (!dialogResult) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                    let count2 = 0x0,
                      selected = [];
                    Object.keys(dialogResult).forEach(async function (key) {
                      count2++;
                      selected.push(dialogResult[key]);
                    });
                    if (count2 > 0x5) {
                      return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                    } else {
                      let emojiStr = '';
                      for (let emoji of selected) {
                        emojiStr = '' + emojiStr + emoji;
                      }
                      Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + emojiStr);
                      Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
                    }
                  } else {
                    if (selectedNames[0x0] === "💰 物件") {
                      let dialogResult = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", objects);
                      if (!dialogResult) {
                        return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                      }
                      let count2 = 0x0,
                        selected = [];
                      Object.keys(dialogResult).forEach(async function (key) {
                        count2++;
                        selected.push(dialogResult[key]);
                      });
                      if (count2 > 0x5) {
                        return window.alert("最多支持选择 5 个 Emoji，点击 OK 以重新选择！"), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                      } else {
                        let emojiStr = '';
                        for (let emoji of selected) {
                          emojiStr = '' + emojiStr + emoji;
                        }
                        Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + emojiStr);
                        Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
                      }
                    } else {
                      if (selectedNames[0x0] === '💜\x20符号') {
                        let dialogResult = Zotero.AI4Paper.openDialogByType_modal('selectEmoji', symbols);
                        if (!dialogResult) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                        let count2 = 0x0,
                          selected = [];
                        Object.keys(dialogResult).forEach(async function (key) {
                          count2++;
                          selected.push(dialogResult[key]);
                        });
                        if (count2 > 0x5) {
                          return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                        } else {
                          let emojiStr = '';
                          for (let emoji of selected) {
                            emojiStr = '' + emojiStr + emoji;
                          }
                          Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + emojiStr);
                          Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
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
  'getBlockQuoteLink': async function (annotation) {
    if (!Zotero.Prefs.get('ai4paper.blockquotelinkstyledialog')) {
      let parentItem = annotation?.['parentItem']?.["parentItem"],
        qnKey;
      if (parentItem) {
        qnKey = Zotero.AI4Paper.getQNKey(parentItem);
      }
      if (Zotero.Prefs.get("ai4paper.blockquotelinkstyle") === "嵌入式链接") {
        if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var link = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + " ![[" + qnKey + "#^KEY" + annotation.key + "]] " + Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji');else {
          var link = '![[' + qnKey + "#^KEY" + annotation.key + ']]';
        }
      } else {
        if (Zotero.Prefs.get("ai4paper.blockquotelinkstyle") === '链接') {
          if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var link = Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji') + " [[" + qnKey + '#^KEY' + annotation.key + "]] " + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");else {
            var link = '[[' + qnKey + "#^KEY" + annotation.key + ']]';
          }
        } else {
          if (Zotero.Prefs.get('ai4paper.blockquotelinkstyle') === '别名链接') {
            if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var link = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + " [[" + qnKey + "#^KEY" + annotation.key + '\x20|\x20别名\x20]]\x20' + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");else var link = '[[' + qnKey + "#^KEY" + annotation.key + '\x20|\x20别名\x20]]';
          } else {
            if (Zotero.Prefs.get('ai4paper.blockquotelinkstyle') === "通用引用链接") {
              let pageIndex = JSON.parse(annotation.annotationPosition).pageIndex + 0x1;
              if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var link = Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji') + " ![[" + qnKey + "#^KEY" + annotation.key + " | itemKey=\"" + annotation.parentKey + "\" page=\"" + pageIndex + "\" annotation=\"" + annotation.key + "\"]] " + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");else {
                var link = "![[" + qnKey + "#^KEY" + annotation.key + '\x20|\x20itemKey=\x22' + annotation.parentKey + "\" page=\"" + pageIndex + '\x22\x20annotation=\x22' + annotation.key + '\x22]]';
              }
            } else {
              if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) {
                var link = Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji') + " ![[" + qnKey + "#^KEY" + annotation.key + "]] " + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");
              } else var link = "![[" + qnKey + "#^KEY" + annotation.key + ']]';
            }
          }
        }
      }
      Zotero.AI4Paper.copy2Clipboard(link);
      if (Zotero.Prefs.get("ai4paper.blockquotelinkstyle") === "嵌入式链接") Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝嵌入式块引用链接 【AI4paper】", "已拷贝嵌入式块引用链接 " + link);else {
        if (Zotero.Prefs.get('ai4paper.blockquotelinkstyle') === '链接') Zotero.AI4Paper.showProgressWindow(0x1388, '✅\x20拷贝块引用链接\x20【Zotero\x20One】', '已拷贝块引用链接\x20' + link);else {
          if (Zotero.Prefs.get('ai4paper.blockquotelinkstyle') === "别名链接") Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝块引用别名链接 【AI4paper】", "已拷贝块引用别名链接 " + link);else {
            if (Zotero.Prefs.get("ai4paper.blockquotelinkstyle") === "通用引用链接") {
              Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝通用引用链接 【AI4paper】", "已拷贝通用引用链接 " + link);
            } else Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝嵌入式块引用链接 【AI4paper】", "已拷贝嵌入式块引用链接 " + link);
          }
        }
      }
    } else {
      let styles = [],
        selectedStyle = Zotero.AI4Paper.openDialogByType_modal("selectBlockQuoteLinkStyle", styles);
      if (!selectedStyle) return null;
      Zotero.Prefs.set("ai4paper.blockquotelinklaststyle", selectedStyle[0x0]);
      let parentItem = annotation?.["parentItem"]?.["parentItem"],
        qnKey;
      parentItem && (qnKey = Zotero.AI4Paper.getQNKey(parentItem));
      if (selectedStyle[0x0] === '嵌入式链接') {
        if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) {
          var link = Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji') + " ![[" + qnKey + "#^KEY" + annotation.key + "]] " + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");
        } else var link = '![[' + qnKey + "#^KEY" + annotation.key + ']]';
      } else {
        if (selectedStyle[0x0] === '链接') {
          if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var link = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + " [[" + qnKey + "#^KEY" + annotation.key + ']]\x20' + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");else var link = '[[' + qnKey + "#^KEY" + annotation.key + ']]';
        } else {
          if (selectedStyle[0x0] === "别名链接") {
            if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var link = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + " [[" + qnKey + "#^KEY" + annotation.key + " | 别名 ]] " + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");else {
              var link = '[[' + qnKey + "#^KEY" + annotation.key + '\x20|\x20别名\x20]]';
            }
          } else {
            if (selectedStyle[0x0] === "通用引用链接") {
              let pageIndex = JSON.parse(annotation.annotationPosition).pageIndex + 0x1;
              if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) {
                var link = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + '\x20![[' + qnKey + "#^KEY" + annotation.key + " | itemKey=\"" + annotation.parentKey + "\" page=\"" + pageIndex + "\" annotation=\"" + annotation.key + "\"]] " + Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji');
              } else var link = '![[' + qnKey + "#^KEY" + annotation.key + " | itemKey=\"" + annotation.parentKey + "\" page=\"" + pageIndex + "\" annotation=\"" + annotation.key + '\x22]]';
            } else {
              if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var link = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + " ![[" + qnKey + "#^KEY" + annotation.key + "]] " + Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji');else {
                var link = "![[" + qnKey + "#^KEY" + annotation.key + ']]';
              }
            }
          }
        }
      }
      Zotero.AI4Paper.copy2Clipboard(link);
      if (selectedStyle[0x0] === "嵌入式链接") {
        Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝嵌入式块引用链接 【AI4paper】", "已拷贝嵌入式块引用链接 " + link);
      } else {
        if (selectedStyle[0x0] === '链接') Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝块引用链接 【AI4paper】", "已拷贝块引用链接 " + link);else {
          if (selectedStyle[0x0] === "别名链接") Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝块引用别名链接 【AI4paper】", "已拷贝块引用别名链接 " + link);else selectedStyle[0x0] === "通用引用链接" ? Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝通用引用链接 【AI4paper】", "已拷贝通用引用链接 " + link) : Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝嵌入式块引用链接 【AI4paper】", '已拷贝嵌入式块引用链接\x20' + link);
        }
      }
    }
  },
  'getItemNotes': async function (item) {
    let annotationsMD = '',
      vocabularyMD = '',
      translationMD = '',
      chatGPTMD = '',
      aiReadingMD = '',
      annotationsData = await Zotero.AI4Paper.getItemAnnotations(item);
    if (Zotero.Prefs.get("ai4paper.exportannotationsnotes")) {
      let annotationsHTML = annotationsData.itemPDFsAnnotationsHTML;
      if (annotationsHTML) {
        annotationsHTML = Zotero.AI4Paper.setNotesTransparency(annotationsHTML);
        annotationsMD = Zotero.AI4Paper.translateHTML2MD(annotationsHTML);
      }
    }
    if (Zotero.Prefs.get("ai4paper.exportvocabularynotes")) {
      let vocabularyHTML = annotationsData.itemPDFsVocabulariesHTML;
      if (vocabularyHTML) {
        Zotero.Prefs.get('ai4paper.exportnotesremovecode') && (vocabularyHTML = AI4PaperNotesCore.removeVocabularyCodeTags(vocabularyHTML));
        vocabularyHTML = Zotero.AI4Paper.setNotesTransparency(vocabularyHTML);
        vocabularyMD = Zotero.AI4Paper.translateHTML2MD(vocabularyHTML);
      }
    }
    if (Zotero.Prefs.get("ai4paper.exporttranslationnotes")) {
      let transNoteItem = Zotero.AI4Paper.findNoteItem_basedOnTag(item, "/划词翻译");
      if (transNoteItem) {
        let transHTML = await Zotero.AI4Paper.getTransForward(transNoteItem);
        transHTML = Zotero.AI4Paper.setNotesTransparency(transHTML);
        translationMD = Zotero.AI4Paper.translateHTML2MD(transHTML);
      }
    }
    if (Zotero.Prefs.get("ai4paper.chatgptnotes")) {
      let gptNoteItem = Zotero.AI4Paper.findNoteItem_basedOnTag(item, '/ChatGPT');
      if (gptNoteItem) {
        let gptHTML = await Zotero.AI4Paper.getChatGPTForward(gptNoteItem);
        gptHTML = AI4PaperNotesCore.prepareChatGPTHTML(gptHTML);
        gptHTML = Zotero.AI4Paper.setNotesTransparency(gptHTML);
        chatGPTMD = Zotero.AI4Paper.translateHTML2MD(gptHTML);
        chatGPTMD = AI4PaperNotesCore.restoreChatGPTMarkdown(chatGPTMD);
      }
    }
    if (Zotero.Prefs.get("ai4paper.exportAIReadingNotes")) {
      let aiReadingNoteItem = Zotero.AI4Paper.findNoteItem_basedOnTag(item, Zotero.AI4Paper._aiReadingNoteTag);
      if (aiReadingNoteItem) {
        let aiReadingHTML = await Zotero.AI4Paper.getAIReadingNoteItemContent(aiReadingNoteItem);
        aiReadingHTML = AI4PaperNotesCore.prepareAIReadingHTML(aiReadingHTML);
        aiReadingHTML = Zotero.AI4Paper.setNotesTransparency(aiReadingHTML);
        aiReadingMD = Zotero.AI4Paper.translateHTML2MD(aiReadingHTML);
        aiReadingMD = AI4PaperNotesCore.restoreAIReadingMarkdown(aiReadingMD);
      }
    }
    return AI4PaperNotesCore.combineItemNotesMarkdown({
      annotations: annotationsMD,
      vocabulary: vocabularyMD,
      translation: translationMD,
      chatGPT: chatGPTMD,
      aiReading: aiReadingMD
    });
  },
  'setNotesTransparency': function (html) {
    return AI4PaperNotesCore.setNotesTransparency(html, {
      yellow: Zotero.Prefs.get("ai4paper.yellowtransparency"),
      red: Zotero.Prefs.get("ai4paper.redtransparency"),
      green: Zotero.Prefs.get("ai4paper.greentransparency"),
      blue: Zotero.Prefs.get("ai4paper.bluetransparency"),
      purple: Zotero.Prefs.get("ai4paper.purpletransparency"),
      magenta: Zotero.Prefs.get("ai4paper.magentatransparency"),
      orange: Zotero.Prefs.get("ai4paper.orangetransparency"),
      gray: Zotero.Prefs.get("ai4paper.graytransparency")
    });
  },
  'translateHTML2MD': function (html) {
    let noteItem = new Zotero.Item("note");
    noteItem.libraryID = Zotero.Libraries.userLibraryID;
    noteItem.setNote(html);
    let mdResult = '';
    var exporter = new Zotero.Translate.Export();
    return exporter.noWait = true, exporter.setItems([noteItem]), exporter.setTranslator(Zotero.Translators.TRANSLATOR_ID_NOTE_MARKDOWN), exporter.setHandler("done", (obj, success) => {
      if (success) {
        mdResult = obj.string.replace(/\r\n/g, '\x0a');
      }
    }), exporter.translate(), mdResult;
  },
  'getTransForward': async function (noteItem) {
    return AI4PaperNotesCore.getTransForwardHTML(noteItem.getNote());
  },
  'getChatGPTForward': async function (noteItem) {
    return AI4PaperNotesCore.getChatGPTForwardHTML(noteItem.getNote(), block => "^KEY" + Zotero.Utilities.Internal.md5(block).slice(0x0, 0x8).toUpperCase());
  },
  'getUserNotes': async function (noteHTML) {
    return AI4PaperNotesCore.getUserNotes(noteHTML, !!Zotero.Prefs.get("ai4paper.obsidianusernotesseparatordefault"));
  },
  'checkColorExcluded': async function (annotation) {
    let excludedSetting = AI4PaperCore.getPref("autoannotationscolorexcluded");
    if (AI4PaperCore.getExcludedAnnotationRule(excludedSetting).disabled) {
      return true;
    }
    var parentItem = annotation.parentItem.parentItem;
    let attachmentIDs = parentItem.getAttachments();
    for (let attachmentID of attachmentIDs) {
      let attachment = Zotero.Items.get(attachmentID);
      if (["application/pdf", "text/html", "application/epub+zip"].includes(attachment.attachmentContentType)) {
        if (attachment.attachmentLinkMode === 0x3) continue;
        var annotations = await attachment.getAnnotations().filter(a => a.annotationType != "ink");
        if (annotations.length) for (let ann of annotations) {
          if (!AI4PaperCore.isExcludedAnnotation(ann, excludedSetting)) return true;
        }
      }
    }
    return false;
  },
  'adjustCardNotesSearchBoxHeight': function (textbox) {
    textbox.style.height = "auto";
    let maxHeight = 0xc8;
    textbox.style.height = Math.min(textbox.scrollHeight, maxHeight) + 'px';
  },
  'updateCardNotesSearchHistory': function (searchText) {
    let isActive = Zotero.AI4Paper.letDOI();
    isActive && Zotero.Prefs.set("ai4paper.cardNotesSearchHistory", AI4PaperNotesCore.updateCardNotesSearchHistory(Zotero.Prefs.get("ai4paper.cardNotesSearchHistory"), searchText));
  },
  'cardNotesSearchButton_webSearch': async function (engine) {
    let searchBox = window.document.getElementById("CardNotes-SearchBox"),
      query = AI4PaperNotesCore.normalizeCardNotesSearchQuery(searchBox.value, searchBox.placeholder);
    if (!query) return;
    if (engine === "matrix") {
      Zotero.AI4Paper.queryPapersMatrix("search", query);
      return;
    }
    let url = AI4PaperNotesCore.buildCardNotesSearchUrl(engine, query);
    if (!url) return;
    if (Zotero.Prefs.get("ai4paper.scheme4WebSearchBrowser") === '自定义' && Zotero.Prefs.get("ai4paper.browser4WebSearch")) {
      if (!(await OS.File.exists(Zotero.Prefs.get("ai4paper.browser4WebSearch")))) return ZoteroPane.loadURI(url), false;
      Zotero.launchFileWithApplication(url, Zotero.Prefs.get("ai4paper.browser4WebSearch"));
    } else ZoteroPane.loadURI(url);
    Zotero.AI4Paper.lastCardNotesSearchInput = query;
    Zotero.AI4Paper.updateCardNotesSearchHistory(query);
  },
  'meataso_WebSearch': async function (query) {
    if (!query) return;
    let url = AI4PaperNotesCore.buildCardNotesSearchUrl("metaso", query);
    if (Zotero.Prefs.get("ai4paper.scheme4WebSearchBrowser") === "自定义" && Zotero.Prefs.get("ai4paper.browser4WebSearch")) {
      if (!(await OS.File.exists(Zotero.Prefs.get("ai4paper.browser4WebSearch")))) return ZoteroPane.loadURI(url), false;
      Zotero.launchFileWithApplication(url, Zotero.Prefs.get('ai4paper.browser4WebSearch'));
    } else ZoteroPane.loadURI(url);
  },
  'searchCardNotes_byShortCuts': function () {
    let reader = this.getCurrentReader();
    if (!reader) return;
    let iframeWin = reader._iframeWindow,
      searchButton = iframeWin.document.getElementById("AI4Paper: CardNotesSearch");
    searchButton && searchButton.click();
  },
});
