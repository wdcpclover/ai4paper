Object.assign(Zotero.AI4Paper, {
  'formatItemNotes': function (html) {
    return html = html.replace(/&gt;&gt;&gt;&gt;&gt;&gt;&gt;/g, ''), html = html.replace(/>>>>>>>/g, ''), html = html.replace(/\\\*/g, '*'), html = html.replace(/\\#/g, '#'), html = html.replace(/\\-/g, '-'), html = html.replace(/jbslqn/g, "<sup>"), html = html.replace(/jbsrqn/g, '</sup>'), html = html.replace(/jbxlqn/g, "<sub>"), html = html.replace(/jbxrqn/g, "</sub>"), html;
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
        Zotero.Prefs.get('ai4paper.exportnotesremovecode') && (vocabularyHTML = vocabularyHTML.replace(/<code>/g, ''), vocabularyHTML = vocabularyHTML.replace(/<\/code>/g, ''));
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
        gptHTML = gptHTML.replace(/<span class="chatgpt">🙋<\/span>/g, 'XnFofCLyZaTe').replace(/<span class="chatgpt">🤖<\/span>/g, "ipNoOlrWjHQh");
        gptHTML = Zotero.AI4Paper.setNotesTransparency(gptHTML);
        chatGPTMD = Zotero.AI4Paper.translateHTML2MD(gptHTML);
        chatGPTMD = chatGPTMD.replace(/XnFofCLyZaTe/g, "<span class=\"chatgpt\">🙋</span>").replace(/ipNoOlrWjHQh/g, '<span\x20class=\x22chatgpt\x22>🤖</span>');
        chatGPTMD = chatGPTMD.replace(/> 🙋\n/g, '>\x20<span\x20class=\x22chatgpt\x22>🙋</span>\x0a').replace(/> 🤖\n/g, "> <span class=\"chatgpt\">🤖</span>\n");
      }
    }
    if (Zotero.Prefs.get("ai4paper.exportAIReadingNotes")) {
      let aiReadingNoteItem = Zotero.AI4Paper.findNoteItem_basedOnTag(item, Zotero.AI4Paper._aiReadingNoteTag);
      if (aiReadingNoteItem) {
        let aiReadingHTML = await Zotero.AI4Paper.getAIReadingNoteItemContent(aiReadingNoteItem);
        aiReadingHTML = aiReadingHTML.replace(/<span class="AIReading">🤖 AI 解读，快人一步<\/span>/g, "QUOsNavFRihJ");
        aiReadingHTML = Zotero.AI4Paper.setNotesTransparency(aiReadingHTML);
        aiReadingMD = Zotero.AI4Paper.translateHTML2MD(aiReadingHTML);
        aiReadingMD = aiReadingMD.replace(/QUOsNavFRihJ/g, "<span class=\"AIReading\">🤖 AI 解读，快人一步</span>");
        aiReadingMD = aiReadingMD.replace(/> 🤖 AI 解读，快人一步\n/g, "> <span class=\"AIReading\">🤖 AI 解读，快人一步</span>\n");
      }
    }
    if (annotationsMD === '' && vocabularyMD === '' && translationMD === '' && chatGPTMD === '' && aiReadingMD === '') {
      return '';
    } else {
      let combinedMD = '' + (annotationsMD != '' ? annotationsMD + '\x0a\x0a' + (vocabularyMD != '' ? vocabularyMD + '\x0a\x0a' : '') + (translationMD != '' ? translationMD + '\x0a\x0a' : '') + (chatGPTMD != '' ? chatGPTMD + '\x0a\x0a' : '') + aiReadingMD : vocabularyMD + '\x0a\x0a' + (translationMD != '' ? translationMD + '\x0a\x0a' : '') + (chatGPTMD != '' ? chatGPTMD + '\x0a\x0a' : '') + aiReadingMD);
      return combinedMD.replace(/WBAWSSPANswoMT/g, '</span>').replace(/WBAWSPANNswoMT/g, '<span>').replace(/WBAWSPANswoMT/g, "<span").replace(/WBAWIMAGEswoMT/g, "<img");
    }
  },
  'setNotesTransparency': function (html) {
    let yellow = "#ffd400",
      red = "#ff6666",
      green = "#5fb236",
      blue = '#2ea8e5',
      purple = "#a28ae5",
      magenta = "#e56eee",
      orange = "#f19837",
      gray = "#aaaaaa";
    if (0x1 <= parseInt(Zotero.Prefs.get("ai4paper.yellowtransparency")) && parseInt(Zotero.Prefs.get('ai4paper.yellowtransparency')) <= 0x63) {
      let alpha = parseInt(Zotero.Prefs.get("ai4paper.yellowtransparency"));
      0x1 <= alpha && alpha <= 0x9 ? yellow = yellow + '0' + String(alpha) : yellow = yellow + String(alpha);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get('ai4paper.redtransparency')) && parseInt(Zotero.Prefs.get("ai4paper.redtransparency")) <= 0x63) {
      let alpha = parseInt(Zotero.Prefs.get("ai4paper.redtransparency"));
      0x1 <= alpha && alpha <= 0x9 ? red = red + '0' + String(alpha) : red = red + String(alpha);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get("ai4paper.greentransparency")) && parseInt(Zotero.Prefs.get('ai4paper.greentransparency')) <= 0x63) {
      let alpha = parseInt(Zotero.Prefs.get("ai4paper.greentransparency"));
      0x1 <= alpha && alpha <= 0x9 ? green = green + '0' + String(alpha) : green = green + String(alpha);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get('ai4paper.bluetransparency')) && parseInt(Zotero.Prefs.get('ai4paper.bluetransparency')) <= 0x63) {
      let alpha = parseInt(Zotero.Prefs.get("ai4paper.bluetransparency"));
      0x1 <= alpha && alpha <= 0x9 ? blue = blue + '0' + String(alpha) : blue = blue + String(alpha);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get("ai4paper.purpletransparency")) && parseInt(Zotero.Prefs.get('ai4paper.purpletransparency')) <= 0x63) {
      let alpha = parseInt(Zotero.Prefs.get('ai4paper.purpletransparency'));
      0x1 <= alpha && alpha <= 0x9 ? purple = purple + '0' + String(alpha) : purple = purple + String(alpha);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get("ai4paper.magentatransparency")) && parseInt(Zotero.Prefs.get('ai4paper.magentatransparency')) <= 0x63) {
      let alpha = parseInt(Zotero.Prefs.get("ai4paper.magentatransparency"));
      if (0x1 <= alpha && alpha <= 0x9) {
        magenta = magenta + '0' + String(alpha);
      } else magenta = magenta + String(alpha);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get("ai4paper.orangetransparency")) && parseInt(Zotero.Prefs.get("ai4paper.orangetransparency")) <= 0x63) {
      let alpha = parseInt(Zotero.Prefs.get('ai4paper.orangetransparency'));
      0x1 <= alpha && alpha <= 0x9 ? orange = orange + '0' + String(alpha) : orange = orange + String(alpha);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get('ai4paper.graytransparency')) && parseInt(Zotero.Prefs.get("ai4paper.graytransparency")) <= 0x63) {
      let alpha = parseInt(Zotero.Prefs.get("ai4paper.graytransparency"));
      0x1 <= alpha && alpha <= 0x9 ? gray = gray + '0' + String(alpha) : gray = gray + String(alpha);
    }
    html.indexOf('background-color:\x20#ffd40080') != -0x1 && (html = html.replace(/background-color: #ffd40080/g, "background-color: #ffd400"));
    html.indexOf("background-color: #ff666680") != -0x1 && (html = html.replace(/background-color: #ff666680/g, "background-color: #ff6666"));
    html.indexOf('background-color:\x20#5fb23680') != -0x1 && (html = html.replace(/background-color: #5fb23680/g, "background-color: #5fb236"));
    if (html.indexOf('background-color:\x20#2ea8e580') != -0x1) {
      html = html.replace(/background-color: #2ea8e580/g, "background-color: #2ea8e5");
    }
    if (html.indexOf("background-color: #a28ae580") != -0x1) {
      html = html.replace(/background-color: #a28ae580/g, "background-color: #a28ae5");
    }
    html.indexOf("background-color: #e56eee80") != -0x1 && (html = html.replace(/background-color: #e56eee80/g, "background-color: #e56eee"));
    html.indexOf("background-color: #f1983780") != -0x1 && (html = html.replace(/background-color: #f1983780/g, "background-color: #f19837"));
    html.indexOf("background-color: #aaaaaa80") != -0x1 && (html = html.replace(/background-color: #aaaaaa80/g, "background-color: #aaaaaa"));
    if (yellow != "#ffd400") {
      html = html.replace(/background-color: #ffd400/g, "background-color: " + yellow);
    }
    return red != "#ff6666" && (html = html.replace(/background-color: #ff6666/g, "background-color: " + red)), green != "#5fb236" && (html = html.replace(/background-color: #5fb236/g, "background-color: " + green)), blue != "#2ea8e5" && (html = html.replace(/background-color: #2ea8e5/g, "background-color: " + blue)), purple != "#a28ae5" && (html = html.replace(/background-color: #a28ae5/g, "background-color: " + purple)), magenta != "#e56eee" && (html = html.replace(/background-color: #e56eee/g, "background-color: " + magenta)), orange != "#f19837" && (html = html.replace(/background-color: #f19837/g, "background-color: " + orange)), gray != '#aaaaaa' && (html = html.replace(/background-color: #aaaaaa/g, "background-color: " + gray)), html;
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
    var noteHTML = noteItem.getNote();
    if (noteHTML.indexOf('📑\x20翻译倒序') != -0x1) {
      var startPositions = [],
        endPositions = [],
        reversed = [],
        startRegex = new RegExp("<blockquote>", 'g'),
        endRegex = new RegExp("</blockquote>", 'g');
      while (startRegex.exec(noteHTML) != null && endRegex.exec(noteHTML) != null) {
        startPositions.push(startRegex.lastIndex);
        endPositions.push(endRegex.lastIndex);
      }
      for (i = 0x0; i < endPositions.length; i++) {
        let block = noteHTML.substring(startPositions[startPositions.length - i - 0x1] - 0xc, endPositions[endPositions.length - i - 0x1]);
        reversed.push(block);
      }
      let result = "<h2 style=\"color: blue;\">📑 翻译正序>>>>>>></h2>" + reversed.join('');
      return result;
    }
    return noteHTML;
  },
  'getChatGPTForward': async function (noteItem) {
    let header = "<blockquote><span style=\"font-size: 15px;color: gray\">📍 ChatGPT 对话记录</span></blockquote>^KEYgptNotes";
    var noteHTML = noteItem.getNote();
    if (noteHTML.indexOf("🤖️ ChatGPT 倒序") != -0x1) {
      var startPositions = [],
        endPositions = [],
        reversed = [],
        startRegex = new RegExp("<blockquote>", 'g'),
        endRegex = new RegExp("</blockquote>", 'g');
      while (startRegex.exec(noteHTML) != null && endRegex.exec(noteHTML) != null) {
        startPositions.push(startRegex.lastIndex);
        endPositions.push(endRegex.lastIndex);
      }
      for (i = 0x0; i < endPositions.length; i++) {
        let block = noteHTML.substring(startPositions[startPositions.length - i - 0x1] - 0xc, endPositions[endPositions.length - i - 0x1]),
          blockKey = "^KEY" + Zotero.Utilities.Internal.md5(block).slice(0x0, 0x8).toUpperCase();
        reversed.push(block + '<p>' + blockKey);
      }
      let result = "<h2 style=\"color: blue;\">🤖️ ChatGPT 正序>>>>>>></h2>" + header + reversed.join('');
      return result;
    }
    return noteHTML;
  },
  'getUserNotes': async function (noteHTML) {
    if (Zotero.Prefs.get("ai4paper.obsidianusernotesseparatordefault")) {
      let positions = [],
        result = '',
        regex = new RegExp('👣➿👣', 'g');
      while (regex.exec(noteHTML) != null) {
        positions.push(regex.lastIndex);
      }
      if (positions.length === 0x2) return result = noteHTML.substring(positions[0x0] - 0x5, positions[0x1]), result;else {
        let positions2 = [],
          result2 = '',
          regex2 = new RegExp("%--------------ω--------------%", 'g');
        while (regex2.exec(noteHTML) != null) {
          positions2.push(regex2.lastIndex);
        }
        if (positions2.length === 0x2) return result2 = noteHTML.substring(positions2[0x0] - 0x1f, positions2[0x1]).replace(/%--------------ω--------------%/g, "👣➿👣"), result2;
      }
      return false;
    } else {
      let positions = [],
        result = '',
        regex = new RegExp("%--------------ω--------------%", 'g');
      while (regex.exec(noteHTML) != null) {
        positions.push(regex.lastIndex);
      }
      if (positions.length === 0x2) {
        return result = noteHTML.substring(positions[0x0] - 0x1f, positions[0x1]), result;
      } else {
        let positions2 = [],
          result2 = '',
          regex2 = new RegExp("👣➿👣", 'g');
        while (regex2.exec(noteHTML) != null) {
          positions2.push(regex2.lastIndex);
        }
        if (positions2.length === 0x2) {
          return result2 = noteHTML.substring(positions2[0x0] - 0x5, positions2[0x1]).replace(/👣➿👣/g, "%--------------ω--------------%"), result2;
        }
      }
      return false;
    }
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
    let historyStr = Zotero.Prefs.get("ai4paper.cardNotesSearchHistory"),
      history = historyStr.split("😊🎈🍓");
    if (!history.includes(searchText)) {
      if (history.length === 0x1 && history[0x0] === '') history = [searchText];else {
        history.unshift(searchText);
      }
    } else {
      let idx = history.indexOf(searchText);
      history.splice(idx, 0x1);
      history.unshift(searchText);
    }
    let isActive = Zotero.AI4Paper.letDOI(),
      trimmed = [];
    for (let i = 0x0; i < 0x14; i++) {
      history[i] != undefined && trimmed.push(history[i]);
    }
    isActive && Zotero.Prefs.set("ai4paper.cardNotesSearchHistory", trimmed.join("😊🎈🍓"));
  },
  'cardNotesSearchButton_webSearch': async function (engine) {
    let searchBox = window.document.getElementById("CardNotes-SearchBox"),
      query = searchBox.value.trim();
    if (query === '' && searchBox.placeholder === '') return false;else query === '' && searchBox.placeholder != '' && (query = searchBox.placeholder);
    if (!query) return;
    let url = '';
    if (engine === "metaso") {
      url = 'https://metaso.cn/?q=' + encodeURIComponent(query);
    } else {
      if (engine === "google") url = 'https://www.google.com/search?q=' + encodeURIComponent(query);else {
        if (engine === 'googlescholar') url = "https://scholar.google.com/scholar?q=" + encodeURIComponent(query);else {
          if (engine === "scihub") url = 'https://sci-hub.ren/' + encodeURIComponent(query);else {
            if (engine === "matrix") {
              Zotero.AI4Paper.queryPapersMatrix("search", query);
              return;
            }
          }
        }
      }
    }
    if (Zotero.Prefs.get("ai4paper.scheme4WebSearchBrowser") === '自定义' && Zotero.Prefs.get("ai4paper.browser4WebSearch")) {
      if (!(await OS.File.exists(Zotero.Prefs.get("ai4paper.browser4WebSearch")))) return ZoteroPane.loadURI(url), false;
      Zotero.launchFileWithApplication(url, Zotero.Prefs.get("ai4paper.browser4WebSearch"));
    } else ZoteroPane.loadURI(url);
    Zotero.AI4Paper.lastCardNotesSearchInput = query;
    Zotero.AI4Paper.updateCardNotesSearchHistory(query);
  },
  'meataso_WebSearch': async function (query) {
    if (!query) return;
    let url = "https://metaso.cn/?q=" + encodeURIComponent(query);
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
