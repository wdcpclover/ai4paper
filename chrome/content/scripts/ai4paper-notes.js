Object.assign(Zotero.AI4Paper, {
  'formatItemNotes': function (param91) {
    return param91 = param91.replace(/&gt;&gt;&gt;&gt;&gt;&gt;&gt;/g, ''), param91 = param91.replace(/>>>>>>>/g, ''), param91 = param91.replace(/\\\*/g, '*'), param91 = param91.replace(/\\#/g, '#'), param91 = param91.replace(/\\-/g, '-'), param91 = param91.replace(/jbslqn/g, "<sup>"), param91 = param91.replace(/jbsrqn/g, '</sup>'), param91 = param91.replace(/jbxlqn/g, "<sub>"), param91 = param91.replace(/jbxrqn/g, "</sub>"), param91;
  },
  'checkGroupLibItem': function (param130) {
    return Zotero.Libraries.get(param130.libraryID).libraryType === "group" ? Zotero.Libraries.get(param130.libraryID).groupID : false;
  },
  'addEmojiBlockQuoteLink': async function () {
    let var1381 = ["🥰 表情", "👍 人体部位", '👨\x20人物', '🧣\x20服饰', '🐯\x20动物与自然', "🍔 食物与饮料", "🏓 活动与运动", "🚗 旅行与地点", "💰 物件", "💜 符号"],
      var1382 = [];
    var1382 = var1382.concat(Zotero.AI4Paper._data_emoji_Smileys.split(';'));
    let var1383 = [];
    var1383 = var1383.concat(Zotero.AI4Paper._data_emoji_Gestures_Body_Parts.split(';'));
    let var1384 = [];
    var1384 = var1384.concat(Zotero.AI4Paper._data_emoji_People_Fantasy.split(';'));
    let var1385 = [];
    var1385 = var1385.concat(Zotero.AI4Paper._data_emoji_Clothing_Accessories.split(';'));
    let var1386 = [];
    var1386 = var1386.concat(Zotero.AI4Paper._data_emoji_Animals_Nature.split(';'));
    let var1387 = [];
    var1387 = var1387.concat(Zotero.AI4Paper._data_emoji_Food_Drink.split(';'));
    let var1388 = [];
    var1388 = var1388.concat(Zotero.AI4Paper._data_emoji_Activity_Sports.split(';'));
    let var1389 = [];
    var1389 = var1389.concat(Zotero.AI4Paper._data_emoji_Travel_Places.split(';'));
    let var1390 = [];
    var1390 = var1390.concat(Zotero.AI4Paper._data_emoji_Objects.split(';'));
    let var1391 = [];
    var1391 = var1391.concat(Zotero.AI4Paper._data_emoji_Symbols.split(';'));
    Zotero.Prefs.set("ai4paper.blockquotelinkstyledialogcaption", '选择表情');
    var var1392 = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", var1381);
    if (!var1392) return Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper"), null;
    let var1393 = 0x0,
      var1394 = [];
    Object.keys(var1392).forEach(async function (param145) {
      var1393++;
      var1394.push(var1392[param145]);
    });
    if (var1393 > 0x1) return window.alert("请仅选择其中一个 Emoji 分类，点击 OK 以重新选择！"), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
    Zotero.Prefs.set("ai4paper.blockquotelinkstyledialogcaption", '' + var1394[0x0]);
    if (var1394[0x0] === "🥰 表情") {
      let _0x1f075a = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", var1382);
      if (!_0x1f075a) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
      let _0x10fe8e = 0x0,
        _0x5d47ba = [];
      Object.keys(_0x1f075a).forEach(async function (param146) {
        _0x10fe8e++;
        _0x5d47ba.push(_0x1f075a[param146]);
      });
      if (_0x10fe8e > 0x5) return window.alert("最多支持选择 5 个 Emoji，点击 OK 以重新选择！"), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;else {
        let _0x4c8b65 = '';
        for (let var1399 of _0x5d47ba) {
          _0x4c8b65 = '' + _0x4c8b65 + var1399;
        }
        Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + _0x4c8b65);
        Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
      }
    } else {
      if (var1394[0x0] === "👍 人体部位") {
        let _0xa08a59 = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", var1383);
        if (!_0xa08a59) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
        let _0xb110d5 = 0x0,
          _0x1a547e = [];
        Object.keys(_0xa08a59).forEach(async function (param147) {
          _0xb110d5++;
          _0x1a547e.push(_0xa08a59[param147]);
        });
        if (_0xb110d5 > 0x5) return window.alert("最多支持选择 5 个 Emoji，点击 OK 以重新选择！"), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;else {
          let var1403 = '';
          for (let var1404 of _0x1a547e) {
            var1403 = '' + var1403 + var1404;
          }
          Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + var1403);
          Zotero.Utilities.Internal.openPreferences('zotero-prefpane-ai4paper');
        }
      } else {
        if (var1394[0x0] === '👨\x20人物') {
          let _0x3284b6 = Zotero.AI4Paper.openDialogByType_modal('selectEmoji', var1384);
          if (!_0x3284b6) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
          let _0x2c40d4 = 0x0,
            _0xbeda7 = [];
          Object.keys(_0x3284b6).forEach(async function (param148) {
            _0x2c40d4++;
            _0xbeda7.push(_0x3284b6[param148]);
          });
          if (_0x2c40d4 > 0x5) return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;else {
            let var1408 = '';
            for (let var1409 of _0xbeda7) {
              var1408 = '' + var1408 + var1409;
            }
            Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + var1408);
            Zotero.Utilities.Internal.openPreferences('zotero-prefpane-ai4paper');
          }
        } else {
          if (var1394[0x0] === "🧣 服饰") {
            let var1410 = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", var1385);
            if (!var1410) {
              return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
            }
            let var1411 = 0x0,
              var1412 = [];
            Object.keys(var1410).forEach(async function (param149) {
              var1411++;
              var1412.push(var1410[param149]);
            });
            if (var1411 > 0x5) {
              return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
            } else {
              let _0x17375f = '';
              for (let var1414 of var1412) {
                _0x17375f = '' + _0x17375f + var1414;
              }
              Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + _0x17375f);
              Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
            }
          } else {
            if (var1394[0x0] === "🐯 动物与自然") {
              let var1415 = Zotero.AI4Paper.openDialogByType_modal('selectEmoji', var1386);
              if (!var1415) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
              let var1416 = 0x0,
                var1417 = [];
              Object.keys(var1415).forEach(async function (param150) {
                var1416++;
                var1417.push(var1415[param150]);
              });
              if (var1416 > 0x5) {
                return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
              } else {
                let var1418 = '';
                for (let var1419 of var1417) {
                  var1418 = '' + var1418 + var1419;
                }
                Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + var1418);
                Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
              }
            } else {
              if (var1394[0x0] === "🍔 食物与饮料") {
                let var1420 = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", var1387);
                if (!var1420) {
                  return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                }
                let var1421 = 0x0,
                  var1422 = [];
                Object.keys(var1420).forEach(async function (param151) {
                  var1421++;
                  var1422.push(var1420[param151]);
                });
                if (var1421 > 0x5) return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;else {
                  let var1423 = '';
                  for (let var1424 of var1422) {
                    var1423 = '' + var1423 + var1424;
                  }
                  Zotero.Prefs.set('ai4paper.blockquotelinkstyleemoji', '' + var1423);
                  Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
                }
              } else {
                if (var1394[0x0] === "🏓 活动与运动") {
                  let var1425 = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", var1388);
                  if (!var1425) {
                    return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                  }
                  let var1426 = 0x0,
                    var1427 = [];
                  Object.keys(var1425).forEach(async function (param152) {
                    var1426++;
                    var1427.push(var1425[param152]);
                  });
                  if (var1426 > 0x5) return window.alert("最多支持选择 5 个 Emoji，点击 OK 以重新选择！"), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;else {
                    let var1428 = '';
                    for (let var1429 of var1427) {
                      var1428 = '' + var1428 + var1429;
                    }
                    Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + var1428);
                    Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
                  }
                } else {
                  if (var1394[0x0] === "🚗 旅行与地点") {
                    let var1430 = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", var1389);
                    if (!var1430) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                    let var1431 = 0x0,
                      var1432 = [];
                    Object.keys(var1430).forEach(async function (param153) {
                      var1431++;
                      var1432.push(var1430[param153]);
                    });
                    if (var1431 > 0x5) {
                      return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                    } else {
                      let var1433 = '';
                      for (let var1434 of var1432) {
                        var1433 = '' + var1433 + var1434;
                      }
                      Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + var1433);
                      Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
                    }
                  } else {
                    if (var1394[0x0] === "💰 物件") {
                      let var1435 = Zotero.AI4Paper.openDialogByType_modal("selectEmoji", var1390);
                      if (!var1435) {
                        return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                      }
                      let var1436 = 0x0,
                        var1437 = [];
                      Object.keys(var1435).forEach(async function (param154) {
                        var1436++;
                        var1437.push(var1435[param154]);
                      });
                      if (var1436 > 0x5) {
                        return window.alert("最多支持选择 5 个 Emoji，点击 OK 以重新选择！"), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                      } else {
                        let var1438 = '';
                        for (let var1439 of var1437) {
                          var1438 = '' + var1438 + var1439;
                        }
                        Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + var1438);
                        Zotero.Utilities.Internal.openPreferences("zotero-prefpane-ai4paper");
                      }
                    } else {
                      if (var1394[0x0] === '💜\x20符号') {
                        let _0x3447cc = Zotero.AI4Paper.openDialogByType_modal('selectEmoji', var1391);
                        if (!_0x3447cc) return Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                        let _0x29c061 = 0x0,
                          _0x166eae = [];
                        Object.keys(_0x3447cc).forEach(async function (param155) {
                          _0x29c061++;
                          _0x166eae.push(_0x3447cc[param155]);
                        });
                        if (_0x29c061 > 0x5) {
                          return window.alert('最多支持选择\x205\x20个\x20Emoji，点击\x20OK\x20以重新选择！'), Zotero.AI4Paper.addEmojiBlockQuoteLink(), false;
                        } else {
                          let var1443 = '';
                          for (let var1444 of _0x166eae) {
                            var1443 = '' + var1443 + var1444;
                          }
                          Zotero.Prefs.set("ai4paper.blockquotelinkstyleemoji", '' + var1443);
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
  'getBlockQuoteLink': async function (param156) {
    if (!Zotero.Prefs.get('ai4paper.blockquotelinkstyledialog')) {
      let _0x20db58 = param156?.['parentItem']?.["parentItem"],
        _0x46522f;
      if (_0x20db58) {
        _0x46522f = Zotero.AI4Paper.getQNKey(_0x20db58);
      }
      if (Zotero.Prefs.get("ai4paper.blockquotelinkstyle") === "嵌入式链接") {
        if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var var1447 = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + " ![[" + _0x46522f + "#^KEY" + param156.key + "]] " + Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji');else {
          var var1447 = '![[' + _0x46522f + "#^KEY" + param156.key + ']]';
        }
      } else {
        if (Zotero.Prefs.get("ai4paper.blockquotelinkstyle") === '链接') {
          if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var var1447 = Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji') + " [[" + _0x46522f + '#^KEY' + param156.key + "]] " + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");else {
            var var1447 = '[[' + _0x46522f + "#^KEY" + param156.key + ']]';
          }
        } else {
          if (Zotero.Prefs.get('ai4paper.blockquotelinkstyle') === '别名链接') {
            if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var var1447 = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + " [[" + _0x46522f + "#^KEY" + param156.key + '\x20|\x20别名\x20]]\x20' + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");else var var1447 = '[[' + _0x46522f + "#^KEY" + param156.key + '\x20|\x20别名\x20]]';
          } else {
            if (Zotero.Prefs.get('ai4paper.blockquotelinkstyle') === "通用引用链接") {
              let var1448 = JSON.parse(param156.annotationPosition).pageIndex + 0x1;
              if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var var1447 = Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji') + " ![[" + _0x46522f + "#^KEY" + param156.key + " | itemKey=\"" + param156.parentKey + "\" page=\"" + var1448 + "\" annotation=\"" + param156.key + "\"]] " + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");else {
                var var1447 = "![[" + _0x46522f + "#^KEY" + param156.key + '\x20|\x20itemKey=\x22' + param156.parentKey + "\" page=\"" + var1448 + '\x22\x20annotation=\x22' + param156.key + '\x22]]';
              }
            } else {
              if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) {
                var var1447 = Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji') + " ![[" + _0x46522f + "#^KEY" + param156.key + "]] " + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");
              } else var var1447 = "![[" + _0x46522f + "#^KEY" + param156.key + ']]';
            }
          }
        }
      }
      Zotero.AI4Paper.copy2Clipboard(var1447);
      if (Zotero.Prefs.get("ai4paper.blockquotelinkstyle") === "嵌入式链接") Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝嵌入式块引用链接 【AI4paper】", "已拷贝嵌入式块引用链接 " + var1447);else {
        if (Zotero.Prefs.get('ai4paper.blockquotelinkstyle') === '链接') Zotero.AI4Paper.showProgressWindow(0x1388, '✅\x20拷贝块引用链接\x20【Zotero\x20One】', '已拷贝块引用链接\x20' + var1447);else {
          if (Zotero.Prefs.get('ai4paper.blockquotelinkstyle') === "别名链接") Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝块引用别名链接 【AI4paper】", "已拷贝块引用别名链接 " + var1447);else {
            if (Zotero.Prefs.get("ai4paper.blockquotelinkstyle") === "通用引用链接") {
              Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝通用引用链接 【AI4paper】", "已拷贝通用引用链接 " + var1447);
            } else Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝嵌入式块引用链接 【AI4paper】", "已拷贝嵌入式块引用链接 " + var1447);
          }
        }
      }
    } else {
      let var1449 = [],
        var1450 = Zotero.AI4Paper.openDialogByType_modal("selectBlockQuoteLinkStyle", var1449);
      if (!var1450) return null;
      Zotero.Prefs.set("ai4paper.blockquotelinklaststyle", var1450[0x0]);
      let var1451 = param156?.["parentItem"]?.["parentItem"],
        var1452;
      var1451 && (var1452 = Zotero.AI4Paper.getQNKey(var1451));
      if (var1450[0x0] === '嵌入式链接') {
        if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) {
          var var1453 = Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji') + " ![[" + var1452 + "#^KEY" + param156.key + "]] " + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");
        } else var var1453 = '![[' + var1452 + "#^KEY" + param156.key + ']]';
      } else {
        if (var1450[0x0] === '链接') {
          if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var var1453 = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + " [[" + var1452 + "#^KEY" + param156.key + ']]\x20' + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");else var var1453 = '[[' + var1452 + "#^KEY" + param156.key + ']]';
        } else {
          if (var1450[0x0] === "别名链接") {
            if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var var1453 = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + " [[" + var1452 + "#^KEY" + param156.key + " | 别名 ]] " + Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji");else {
              var var1453 = '[[' + var1452 + "#^KEY" + param156.key + '\x20|\x20别名\x20]]';
            }
          } else {
            if (var1450[0x0] === "通用引用链接") {
              let _0x52846c = JSON.parse(param156.annotationPosition).pageIndex + 0x1;
              if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) {
                var var1453 = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + '\x20![[' + var1452 + "#^KEY" + param156.key + " | itemKey=\"" + param156.parentKey + "\" page=\"" + _0x52846c + "\" annotation=\"" + param156.key + "\"]] " + Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji');
              } else var var1453 = '![[' + var1452 + "#^KEY" + param156.key + " | itemKey=\"" + param156.parentKey + "\" page=\"" + _0x52846c + "\" annotation=\"" + param156.key + '\x22]]';
            } else {
              if (Zotero.Prefs.get("ai4paper.blockquotelinkstyleemojienable")) var var1453 = Zotero.Prefs.get("ai4paper.blockquotelinkstyleemoji") + " ![[" + var1452 + "#^KEY" + param156.key + "]] " + Zotero.Prefs.get('ai4paper.blockquotelinkstyleemoji');else {
                var var1453 = "![[" + var1452 + "#^KEY" + param156.key + ']]';
              }
            }
          }
        }
      }
      Zotero.AI4Paper.copy2Clipboard(var1453);
      if (var1450[0x0] === "嵌入式链接") {
        Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝嵌入式块引用链接 【AI4paper】", "已拷贝嵌入式块引用链接 " + var1453);
      } else {
        if (var1450[0x0] === '链接') Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝块引用链接 【AI4paper】", "已拷贝块引用链接 " + var1453);else {
          if (var1450[0x0] === "别名链接") Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝块引用别名链接 【AI4paper】", "已拷贝块引用别名链接 " + var1453);else var1450[0x0] === "通用引用链接" ? Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝通用引用链接 【AI4paper】", "已拷贝通用引用链接 " + var1453) : Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 拷贝嵌入式块引用链接 【AI4paper】", '已拷贝嵌入式块引用链接\x20' + var1453);
        }
      }
    }
  },
  'getItemNotes': async function (param200) {
    let var1725 = '',
      var1726 = '',
      var1727 = '',
      var1728 = '',
      var1729 = '',
      var1730 = await Zotero.AI4Paper.getItemAnnotations(param200);
    if (Zotero.Prefs.get("ai4paper.exportannotationsnotes")) {
      let _0x36021b = var1730.itemPDFsAnnotationsHTML;
      if (_0x36021b) {
        _0x36021b = Zotero.AI4Paper.setNotesTransparency(_0x36021b);
        var1725 = Zotero.AI4Paper.translateHTML2MD(_0x36021b);
      }
    }
    if (Zotero.Prefs.get("ai4paper.exportvocabularynotes")) {
      let _0x20a8f6 = var1730.itemPDFsVocabulariesHTML;
      if (_0x20a8f6) {
        Zotero.Prefs.get('ai4paper.exportnotesremovecode') && (_0x20a8f6 = _0x20a8f6.replace(/<code>/g, ''), _0x20a8f6 = _0x20a8f6.replace(/<\/code>/g, ''));
        _0x20a8f6 = Zotero.AI4Paper.setNotesTransparency(_0x20a8f6);
        var1726 = Zotero.AI4Paper.translateHTML2MD(_0x20a8f6);
      }
    }
    if (Zotero.Prefs.get("ai4paper.exporttranslationnotes")) {
      let _0x5ae572 = Zotero.AI4Paper.findNoteItem_basedOnTag(param200, "/划词翻译");
      if (_0x5ae572) {
        let _0x544d66 = await Zotero.AI4Paper.getTransForward(_0x5ae572);
        _0x544d66 = Zotero.AI4Paper.setNotesTransparency(_0x544d66);
        var1727 = Zotero.AI4Paper.translateHTML2MD(_0x544d66);
      }
    }
    if (Zotero.Prefs.get("ai4paper.chatgptnotes")) {
      let _0x246b2d = Zotero.AI4Paper.findNoteItem_basedOnTag(param200, '/ChatGPT');
      if (_0x246b2d) {
        let _0x146f25 = await Zotero.AI4Paper.getChatGPTForward(_0x246b2d);
        _0x146f25 = _0x146f25.replace(/<span class="chatgpt">🙋<\/span>/g, 'XnFofCLyZaTe').replace(/<span class="chatgpt">🤖<\/span>/g, "ipNoOlrWjHQh");
        _0x146f25 = Zotero.AI4Paper.setNotesTransparency(_0x146f25);
        var1728 = Zotero.AI4Paper.translateHTML2MD(_0x146f25);
        var1728 = var1728.replace(/XnFofCLyZaTe/g, "<span class=\"chatgpt\">🙋</span>").replace(/ipNoOlrWjHQh/g, '<span\x20class=\x22chatgpt\x22>🤖</span>');
        var1728 = var1728.replace(/> 🙋\n/g, '>\x20<span\x20class=\x22chatgpt\x22>🙋</span>\x0a').replace(/> 🤖\n/g, "> <span class=\"chatgpt\">🤖</span>\n");
      }
    }
    if (Zotero.Prefs.get("ai4paper.exportAIReadingNotes")) {
      let var1737 = Zotero.AI4Paper.findNoteItem_basedOnTag(param200, Zotero.AI4Paper._aiReadingNoteTag);
      if (var1737) {
        let _0x49ae74 = await Zotero.AI4Paper.getAIReadingNoteItemContent(var1737);
        _0x49ae74 = _0x49ae74.replace(/<span class="AIReading">🤖 AI 解读，快人一步<\/span>/g, "QUOsNavFRihJ");
        _0x49ae74 = Zotero.AI4Paper.setNotesTransparency(_0x49ae74);
        var1729 = Zotero.AI4Paper.translateHTML2MD(_0x49ae74);
        var1729 = var1729.replace(/QUOsNavFRihJ/g, "<span class=\"AIReading\">🤖 AI 解读，快人一步</span>");
        var1729 = var1729.replace(/> 🤖 AI 解读，快人一步\n/g, "> <span class=\"AIReading\">🤖 AI 解读，快人一步</span>\n");
      }
    }
    if (var1725 === '' && var1726 === '' && var1727 === '' && var1728 === '' && var1729 === '') {
      return '';
    } else {
      let var1739 = '' + (var1725 != '' ? var1725 + '\x0a\x0a' + (var1726 != '' ? var1726 + '\x0a\x0a' : '') + (var1727 != '' ? var1727 + '\x0a\x0a' : '') + (var1728 != '' ? var1728 + '\x0a\x0a' : '') + var1729 : var1726 + '\x0a\x0a' + (var1727 != '' ? var1727 + '\x0a\x0a' : '') + (var1728 != '' ? var1728 + '\x0a\x0a' : '') + var1729);
      return var1739.replace(/WBAWSSPANswoMT/g, '</span>').replace(/WBAWSPANNswoMT/g, '<span>').replace(/WBAWSPANswoMT/g, "<span").replace(/WBAWIMAGEswoMT/g, "<img");
    }
  },
  'setNotesTransparency': function (param201) {
    let var1740 = "#ffd400",
      var1741 = "#ff6666",
      var1742 = "#5fb236",
      var1743 = '#2ea8e5',
      var1744 = "#a28ae5",
      var1745 = "#e56eee",
      var1746 = "#f19837",
      var1747 = "#aaaaaa";
    if (0x1 <= parseInt(Zotero.Prefs.get("ai4paper.yellowtransparency")) && parseInt(Zotero.Prefs.get('ai4paper.yellowtransparency')) <= 0x63) {
      let var1748 = parseInt(Zotero.Prefs.get("ai4paper.yellowtransparency"));
      0x1 <= var1748 && var1748 <= 0x9 ? var1740 = var1740 + '0' + String(var1748) : var1740 = var1740 + String(var1748);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get('ai4paper.redtransparency')) && parseInt(Zotero.Prefs.get("ai4paper.redtransparency")) <= 0x63) {
      let var1749 = parseInt(Zotero.Prefs.get("ai4paper.redtransparency"));
      0x1 <= var1749 && var1749 <= 0x9 ? var1741 = var1741 + '0' + String(var1749) : var1741 = var1741 + String(var1749);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get("ai4paper.greentransparency")) && parseInt(Zotero.Prefs.get('ai4paper.greentransparency')) <= 0x63) {
      let _0x164836 = parseInt(Zotero.Prefs.get("ai4paper.greentransparency"));
      0x1 <= _0x164836 && _0x164836 <= 0x9 ? var1742 = var1742 + '0' + String(_0x164836) : var1742 = var1742 + String(_0x164836);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get('ai4paper.bluetransparency')) && parseInt(Zotero.Prefs.get('ai4paper.bluetransparency')) <= 0x63) {
      let _0x5d5420 = parseInt(Zotero.Prefs.get("ai4paper.bluetransparency"));
      0x1 <= _0x5d5420 && _0x5d5420 <= 0x9 ? var1743 = var1743 + '0' + String(_0x5d5420) : var1743 = var1743 + String(_0x5d5420);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get("ai4paper.purpletransparency")) && parseInt(Zotero.Prefs.get('ai4paper.purpletransparency')) <= 0x63) {
      let var1752 = parseInt(Zotero.Prefs.get('ai4paper.purpletransparency'));
      0x1 <= var1752 && var1752 <= 0x9 ? var1744 = var1744 + '0' + String(var1752) : var1744 = var1744 + String(var1752);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get("ai4paper.magentatransparency")) && parseInt(Zotero.Prefs.get('ai4paper.magentatransparency')) <= 0x63) {
      let _0x395099 = parseInt(Zotero.Prefs.get("ai4paper.magentatransparency"));
      if (0x1 <= _0x395099 && _0x395099 <= 0x9) {
        var1745 = var1745 + '0' + String(_0x395099);
      } else var1745 = var1745 + String(_0x395099);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get("ai4paper.orangetransparency")) && parseInt(Zotero.Prefs.get("ai4paper.orangetransparency")) <= 0x63) {
      let var1754 = parseInt(Zotero.Prefs.get('ai4paper.orangetransparency'));
      0x1 <= var1754 && var1754 <= 0x9 ? var1746 = var1746 + '0' + String(var1754) : var1746 = var1746 + String(var1754);
    }
    if (0x1 <= parseInt(Zotero.Prefs.get('ai4paper.graytransparency')) && parseInt(Zotero.Prefs.get("ai4paper.graytransparency")) <= 0x63) {
      let _0x5399a6 = parseInt(Zotero.Prefs.get("ai4paper.graytransparency"));
      0x1 <= _0x5399a6 && _0x5399a6 <= 0x9 ? var1747 = var1747 + '0' + String(_0x5399a6) : var1747 = var1747 + String(_0x5399a6);
    }
    param201.indexOf('background-color:\x20#ffd40080') != -0x1 && (param201 = param201.replace(/background-color: #ffd40080/g, "background-color: #ffd400"));
    param201.indexOf("background-color: #ff666680") != -0x1 && (param201 = param201.replace(/background-color: #ff666680/g, "background-color: #ff6666"));
    param201.indexOf('background-color:\x20#5fb23680') != -0x1 && (param201 = param201.replace(/background-color: #5fb23680/g, "background-color: #5fb236"));
    if (param201.indexOf('background-color:\x20#2ea8e580') != -0x1) {
      param201 = param201.replace(/background-color: #2ea8e580/g, "background-color: #2ea8e5");
    }
    if (param201.indexOf("background-color: #a28ae580") != -0x1) {
      param201 = param201.replace(/background-color: #a28ae580/g, "background-color: #a28ae5");
    }
    param201.indexOf("background-color: #e56eee80") != -0x1 && (param201 = param201.replace(/background-color: #e56eee80/g, "background-color: #e56eee"));
    param201.indexOf("background-color: #f1983780") != -0x1 && (param201 = param201.replace(/background-color: #f1983780/g, "background-color: #f19837"));
    param201.indexOf("background-color: #aaaaaa80") != -0x1 && (param201 = param201.replace(/background-color: #aaaaaa80/g, "background-color: #aaaaaa"));
    if (var1740 != "#ffd400") {
      param201 = param201.replace(/background-color: #ffd400/g, "background-color: " + var1740);
    }
    return var1741 != "#ff6666" && (param201 = param201.replace(/background-color: #ff6666/g, "background-color: " + var1741)), var1742 != "#5fb236" && (param201 = param201.replace(/background-color: #5fb236/g, "background-color: " + var1742)), var1743 != "#2ea8e5" && (param201 = param201.replace(/background-color: #2ea8e5/g, "background-color: " + var1743)), var1744 != "#a28ae5" && (param201 = param201.replace(/background-color: #a28ae5/g, "background-color: " + var1744)), var1745 != "#e56eee" && (param201 = param201.replace(/background-color: #e56eee/g, "background-color: " + var1745)), var1746 != "#f19837" && (param201 = param201.replace(/background-color: #f19837/g, "background-color: " + var1746)), var1747 != '#aaaaaa' && (param201 = param201.replace(/background-color: #aaaaaa/g, "background-color: " + var1747)), param201;
  },
  'translateHTML2MD': function (param202) {
    let var1756 = new Zotero.Item("note");
    var1756.libraryID = Zotero.Libraries.userLibraryID;
    var1756.setNote(param202);
    let var1757 = '';
    var var1758 = new Zotero.Translate.Export();
    return var1758.noWait = true, var1758.setItems([var1756]), var1758.setTranslator(Zotero.Translators.TRANSLATOR_ID_NOTE_MARKDOWN), var1758.setHandler("done", (_0x25235c, _0x456f9a) => {
      if (_0x456f9a) {
        var1757 = _0x25235c.string.replace(/\r\n/g, '\x0a');
      }
    }), var1758.translate(), var1757;
  },
  'getTransForward': async function (param208) {
    var var1845 = param208.getNote();
    if (var1845.indexOf('📑\x20翻译倒序') != -0x1) {
      var var1846 = [],
        var1847 = [],
        var1848 = [],
        var1849 = new RegExp("<blockquote>", 'g'),
        var1850 = new RegExp("</blockquote>", 'g');
      while (var1849.exec(var1845) != null && var1850.exec(var1845) != null) {
        var1846.push(var1849.lastIndex);
        var1847.push(var1850.lastIndex);
      }
      for (i = 0x0; i < var1847.length; i++) {
        let _0x1a55bf = var1845.substring(var1846[var1846.length - i - 0x1] - 0xc, var1847[var1847.length - i - 0x1]);
        var1848.push(_0x1a55bf);
      }
      let _0x47198b = "<h2 style=\"color: blue;\">📑 翻译正序>>>>>>></h2>" + var1848.join('');
      return _0x47198b;
    }
    return var1845;
  },
  'getChatGPTForward': async function (param209) {
    let var1853 = "<blockquote><span style=\"font-size: 15px;color: gray\">📍 ChatGPT 对话记录</span></blockquote>^KEYgptNotes";
    var var1854 = param209.getNote();
    if (var1854.indexOf("🤖️ ChatGPT 倒序") != -0x1) {
      var var1855 = [],
        var1856 = [],
        var1857 = [],
        var1858 = new RegExp("<blockquote>", 'g'),
        var1859 = new RegExp("</blockquote>", 'g');
      while (var1858.exec(var1854) != null && var1859.exec(var1854) != null) {
        var1855.push(var1858.lastIndex);
        var1856.push(var1859.lastIndex);
      }
      for (i = 0x0; i < var1856.length; i++) {
        let var1860 = var1854.substring(var1855[var1855.length - i - 0x1] - 0xc, var1856[var1856.length - i - 0x1]),
          var1861 = "^KEY" + Zotero.Utilities.Internal.md5(var1860).slice(0x0, 0x8).toUpperCase();
        var1857.push(var1860 + '<p>' + var1861);
      }
      let _0x40c763 = "<h2 style=\"color: blue;\">🤖️ ChatGPT 正序>>>>>>></h2>" + var1853 + var1857.join('');
      return _0x40c763;
    }
    return var1854;
  },
  'getUserNotes': async function (param211) {
    if (Zotero.Prefs.get("ai4paper.obsidianusernotesseparatordefault")) {
      let var1867 = [],
        var1868 = '',
        var1869 = new RegExp('👣➿👣', 'g');
      while (var1869.exec(param211) != null) {
        var1867.push(var1869.lastIndex);
      }
      if (var1867.length === 0x2) return var1868 = param211.substring(var1867[0x0] - 0x5, var1867[0x1]), var1868;else {
        let var1870 = [],
          var1871 = '',
          var1872 = new RegExp("%--------------ω--------------%", 'g');
        while (var1872.exec(param211) != null) {
          var1870.push(var1872.lastIndex);
        }
        if (var1870.length === 0x2) return var1871 = param211.substring(var1870[0x0] - 0x1f, var1870[0x1]).replace(/%--------------ω--------------%/g, "👣➿👣"), var1871;
      }
      return false;
    } else {
      let var1873 = [],
        var1874 = '',
        var1875 = new RegExp("%--------------ω--------------%", 'g');
      while (var1875.exec(param211) != null) {
        var1873.push(var1875.lastIndex);
      }
      if (var1873.length === 0x2) {
        return var1874 = param211.substring(var1873[0x0] - 0x1f, var1873[0x1]), var1874;
      } else {
        let _0x3f0f3a = [],
          _0x31bbac = '',
          _0x1eed85 = new RegExp("👣➿👣", 'g');
        while (_0x1eed85.exec(param211) != null) {
          _0x3f0f3a.push(_0x1eed85.lastIndex);
        }
        if (_0x3f0f3a.length === 0x2) {
          return _0x31bbac = param211.substring(_0x3f0f3a[0x0] - 0x5, _0x3f0f3a[0x1]).replace(/👣➿👣/g, "%--------------ω--------------%"), _0x31bbac;
        }
      }
      return false;
    }
  },
  'checkColorExcluded': async function (param212) {
    let var1879 = '';
    if (Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === '黄色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "黄色（高亮）") {
      var1879 = '#ffd400';
    } else {
      if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '红色' || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "红色（高亮）") var1879 = "#ff6666";else {
        if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '绿色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '绿色（高亮）') var1879 = "#5fb236";else {
          if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '蓝色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "蓝色（高亮）") var1879 = "#2ea8e5";else {
            if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '紫色' || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "紫色（高亮）") var1879 = '#a28ae5';else {
              if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "洋红色" || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "洋红色（高亮）") var1879 = '#e56eee';else {
                if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '橘色' || Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === "橘色（高亮）") var1879 = "#f19837";else {
                  if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '灰色' || Zotero.Prefs.get('ai4paper.autoannotationscolorexcluded') === "灰色（高亮）") var1879 = "#aaaaaa";else {
                    if (Zotero.Prefs.get("ai4paper.autoannotationscolorexcluded") === '无') {
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    var var1880 = param212.parentItem.parentItem;
    let var1881 = var1880.getAttachments();
    for (let var1882 of var1881) {
      let _0x5d9eac = Zotero.Items.get(var1882);
      if (["application/pdf", "text/html", "application/epub+zip"].includes(_0x5d9eac.attachmentContentType)) {
        if (_0x5d9eac.attachmentLinkMode === 0x3) continue;
        var var1884 = await _0x5d9eac.getAnnotations().filter(_0x2548c7 => _0x2548c7.annotationType != "ink");
        if (var1884.length) for (let var1885 of var1884) {
          if (var1885.annotationColor != var1879) return true;
        }
      }
    }
    return false;
  },
  'adjustCardNotesSearchBoxHeight': function (param217) {
    param217.style.height = "auto";
    let var1971 = 0xc8;
    param217.style.height = Math.min(param217.scrollHeight, var1971) + 'px';
  },
  'updateCardNotesSearchHistory': function (param218) {
    let var1972 = Zotero.Prefs.get("ai4paper.cardNotesSearchHistory"),
      var1973 = var1972.split("😊🎈🍓");
    if (!var1973.includes(param218)) {
      if (var1973.length === 0x1 && var1973[0x0] === '') var1973 = [param218];else {
        var1973.unshift(param218);
      }
    } else {
      let var1974 = var1973.indexOf(param218);
      var1973.splice(var1974, 0x1);
      var1973.unshift(param218);
    }
    let var1975 = Zotero.AI4Paper.letDOI(),
      var1976 = [];
    for (let var1977 = 0x0; var1977 < 0x14; var1977++) {
      var1973[var1977] != undefined && var1976.push(var1973[var1977]);
    }
    var1975 && Zotero.Prefs.set("ai4paper.cardNotesSearchHistory", var1976.join("😊🎈🍓"));
  },
  'cardNotesSearchButton_webSearch': async function (param219) {
    let var1978 = window.document.getElementById("CardNotes-SearchBox"),
      var1979 = var1978.value.trim();
    if (var1979 === '' && var1978.placeholder === '') return false;else var1979 === '' && var1978.placeholder != '' && (var1979 = var1978.placeholder);
    if (!var1979) return;
    let var1980 = '';
    if (param219 === "metaso") {
      var1980 = 'https://metaso.cn/?q=' + encodeURIComponent(var1979);
    } else {
      if (param219 === "google") var1980 = 'https://www.google.com/search?q=' + encodeURIComponent(var1979);else {
        if (param219 === 'googlescholar') var1980 = "https://scholar.google.com/scholar?q=" + encodeURIComponent(var1979);else {
          if (param219 === "scihub") var1980 = 'https://sci-hub.ren/' + encodeURIComponent(var1979);else {
            if (param219 === "matrix") {
              Zotero.AI4Paper.queryPapersMatrix("search", var1979);
              return;
            }
          }
        }
      }
    }
    if (Zotero.Prefs.get("ai4paper.scheme4WebSearchBrowser") === '自定义' && Zotero.Prefs.get("ai4paper.browser4WebSearch")) {
      if (!(await OS.File.exists(Zotero.Prefs.get("ai4paper.browser4WebSearch")))) return ZoteroPane.loadURI(var1980), false;
      Zotero.launchFileWithApplication(var1980, Zotero.Prefs.get("ai4paper.browser4WebSearch"));
    } else ZoteroPane.loadURI(var1980);
    Zotero.AI4Paper.lastCardNotesSearchInput = var1979;
    Zotero.AI4Paper.updateCardNotesSearchHistory(var1979);
  },
  'meataso_WebSearch': async function (param220) {
    if (!param220) return;
    let var1981 = "https://metaso.cn/?q=" + encodeURIComponent(param220);
    if (Zotero.Prefs.get("ai4paper.scheme4WebSearchBrowser") === "自定义" && Zotero.Prefs.get("ai4paper.browser4WebSearch")) {
      if (!(await OS.File.exists(Zotero.Prefs.get("ai4paper.browser4WebSearch")))) return ZoteroPane.loadURI(var1981), false;
      Zotero.launchFileWithApplication(var1981, Zotero.Prefs.get('ai4paper.browser4WebSearch'));
    } else ZoteroPane.loadURI(var1981);
  },
  'searchCardNotes_byShortCuts': function () {
    let var1982 = this.getCurrentReader();
    if (!var1982) return;
    let var1983 = var1982._iframeWindow,
      var1984 = var1983.document.getElementById("AI4Paper: CardNotesSearch");
    var1984 && var1984.click();
  },
});
