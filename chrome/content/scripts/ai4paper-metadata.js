// ai4paper-metadata.js - Metadata, templates, YAML, IF, abbreviation module
// Extracted from ai4paper.js (Phase 14)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Metadata Templates, YAML, QN Key, Date Helpers, Collection Names, Item Links ===
  'readMetadataTemplate': function (param159, param160) {
    let var1483 = param159.indexOf(param160),
      var1484 = param159.substring(var1483),
      var1485 = var1484.indexOf("[[["),
      var1486 = var1484.indexOf("]]]");
    return var1484.substring(var1485 + 0x3, var1486);
  },
  'itemMetadata': function (param161, param162) {
    let var1487 = Zotero.ItemTypes.getName(param161.itemTypeID),
      var1488 = param161.getField("title"),
      var1489 = param161.getField("shortTitle"),
      var1490 = param161.getCreators(),
      var1491 = param161.getField("publicationTitle").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '“').replace(/\n/g, '\x20'),
      var1492 = param161.getField("journalAbbreviation").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '“').replace(/\n/g, '\x20'),
      var1493 = param161.getField("volume"),
      var1494 = param161.getField('issue'),
      var1495 = param161.getField('pages'),
      var1496 = param161.getField("series"),
      var1497 = param161.getField("language"),
      var1498 = param161.getField("DOI"),
      var1499 = param161.getField("ISSN"),
      var1500 = param161.getField('url'),
      var1501 = param161.getField('archive'),
      var1502 = ('' + param161.getField("archiveLocation")).split('📊')[0x0].trim(),
      var1503 = ('' + param161.getField('libraryCatalog')).split('(')[0x0].trim(),
      var1504 = Zotero.AI4Paper.extractJCRQ(param161.getField("libraryCatalog")),
      var1505 = param161.getField('callNumber'),
      var1506 = param161.getField("rights"),
      var1507 = param161.getField('extra').replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '“').replace(/\n/g, '\x20'),
      var1508 = param161.getField("proceedingsTitle"),
      var1509 = param161.getField('conferenceName'),
      var1510 = param161.getField("place"),
      var1511 = param161.getField("publisher"),
      var1512 = param161.getField("ISBN"),
      var1513 = param161.getField("university"),
      var1514 = param161.getField("edition"),
      var1515 = param161.getField('country'),
      var1516 = param161.getField("issuingAuthority"),
      var1517 = param161.getField('patentNumber'),
      var1518 = param161.getField("applicationNumber"),
      var1519 = param161.getField('priorityNumbers'),
      var1520 = param161.getField("issueDate"),
      var1521 = param161.getField("bookTitle"),
      var1522 = param161.getField("seriesNumber"),
      var1523 = param161.getField("numberOfVolumes"),
      var1524 = param161.getField("date"),
      var1525 = Zotero.AI4Paper.getZoteroDateY(var1524),
      var1526 = Zotero.AI4Paper.getDateAdded(param161),
      var1527 = Zotero.AI4Paper.getDateTimeAdded(param161),
      var1528 = Zotero.AI4Paper.getDateModified(param161),
      var1529 = Zotero.AI4Paper.getDateTimeModified(param161),
      var1530 = Zotero.AI4Paper.getCollectionNames(param161),
      var1531 = Zotero.AI4Paper.getRelatedItems(param161),
      var1532 = Zotero.AI4Paper.getItemZoteroLink(param161);
    if (Zotero.Prefs.get('ai4paper.pdflinkhtml')) var var1533 = Zotero.AI4Paper.getItemZoteroPDFLinksHTML(param161);else {
      var var1533 = Zotero.AI4Paper.getItemZoteroPDFLinks(param161);
      var1533 != '' && (var1533 = '\x0a' + var1533);
    }
    if (Zotero.Prefs.get('ai4paper.relatedlongindent')) {
      var1531.length > 0x64 && (var1531 = "\n  - " + var1531);
    }
    let var1534 = [],
      var1535 = '';
    if (var1490.length > 0x0) {
      if (param161.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1) {
        for (let var1536 of var1490) {
          var1534.push('' + (Zotero.Prefs.get("ai4paper.creatorsnointernallinks") ? var1536.firstName + '\x20' + var1536.lastName : '[[' + var1536.firstName + '\x20' + var1536.lastName + ']]'));
        }
        var1535 = var1534.join('、\x20');
      } else {
        for (let var1537 of var1490) {
          var1534.push('' + (Zotero.Prefs.get("ai4paper.creatorsnointernallinks") ? var1537.lastName + var1537.firstName : '[[' + var1537.lastName + var1537.firstName + ']]'));
        }
        var1535 = var1534.join('、');
      }
    }
    var1524 = Zotero.AI4Paper.getZoteroDate(var1524);
    let var1538 = Zotero.AI4Paper.formatSpecialTags(Zotero.AI4Paper.getItemTags(param161));
    Zotero.Prefs.get("ai4paper.tagslongindent") && var1538.length > 0x64 && (var1538 = "\n  - " + var1538);
    let var1539 = param161.getField("abstractNote").replace(/\n/g, '\x0a>'),
      var1540 = param161.getField("abstractNote");
    return Zotero.Prefs.get("ai4paper.exportnotesabstractyaml") && var1540 != '' && (var1540 = var1540.replace(/\n\n【摘要翻译】/g, "【摘要翻译】").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '“').replace(/\n\n/g, '\x20').replace(/\n/g, '\x20')), param162 = param162.replace(/{{itemType}}/g, var1487), param162 = param162.replace(/{{title}}/g, var1488), param162 = param162.replace(/{{shortTitle}}/g, var1489.replace(/\ /g, '')), param162 = param162.replace(/{{creators}}/g, var1535), param162 = param162.replace(/{{publicationTitle}}/g, '' + (var1491 != '' ? '[[' + var1491 + ']]' : '')), param162 = param162.replace(/{{journalAbbreviation}}/g, var1492), param162 = param162.replace(/{{volume}}/g, var1493), param162 = param162.replace(/{{issue}}/g, var1494), param162 = param162.replace(/{{pages}}/g, var1495), param162 = param162.replace(/{{series}}/g, var1496), param162 = param162.replace(/{{language}}/g, var1497), param162 = param162.replace(/{{DOI}}/g, '' + (var1498 != '' ? '[' + var1498 + ']' + "(https://doi.org/" + var1498 + ')' : '')), param162 = param162.replace(/{{ISSN}}/g, var1499), param162 = param162.replace(/{{url}}/g, '' + (var1500 != '' ? '[' + var1500 + ']' + '(' + var1500 + ')' : '')), param162 = param162.replace(/{{archive}}/g, var1501), param162 = param162.replace(/{{archiveLocation}}/g, var1502), param162 = param162.replace(/{{libraryCatalog}}/g, var1503), param162 = param162.replace(/{{JCRQ}}/g, var1504), param162 = param162.replace(/{{callNumber}}/g, var1505), param162 = param162.replace(/{{rights}}/g, var1506), param162 = param162.replace(/{{extra}}/g, var1507), param162 = param162.replace(/{{proceedingsTitle}}/g, var1508), param162 = param162.replace(/{{conferenceName}}/g, var1509), param162 = param162.replace(/{{place}}/g, var1510), param162 = param162.replace(/{{publisher}}/g, var1511), param162 = param162.replace(/{{ISBN}}/g, var1512), param162 = param162.replace(/{{university}}/g, var1513), param162 = param162.replace(/{{edition}}/g, var1514), param162 = param162.replace(/{{country}}/g, var1515), param162 = param162.replace(/{{issuingAuthority}}/g, var1516), param162 = param162.replace(/{{patentNumber}}/g, var1517), param162 = param162.replace(/{{applicationNumber}}/g, var1518), param162 = param162.replace(/{{priorityNumbers}}/g, var1519), param162 = param162.replace(/{{issueDate}}/g, var1520), param162 = param162.replace(/{{bookTitle}}/g, var1521), param162 = param162.replace(/{{seriesNumber}}/g, var1522), param162 = param162.replace(/{{numberOfVolumes}}/g, var1523), param162 = param162.replace(/{{date}}/g, var1524), param162 = param162.replace(/{{dateY}}/g, var1525), param162 = param162.replace(/{{dateAdded}}/g, var1526), param162 = param162.replace(/{{datetimeAdded}}/g, var1527), param162 = param162.replace(/{{dateModified}}/g, var1528), param162 = param162.replace(/{{datetimeModified}}/g, var1529), param162 = param162.replace(/{{collection}}/g, '' + (var1530 != '' ? var1530 : '')), param162 = param162.replace(/{{related}}/g, var1531), param162 = param162.replace(/{{qnkey}}/g, Zotero.AI4Paper.getQNKey(param161)), param162 = param162.replace(/{{citationKey}}/g, param161.getField("citationKey")), param162 = param162.replace(/{{itemLink}}/g, '[My\x20Library](' + var1532 + ')'), param162 = param162.replace(/{{pdfLink}}/g, var1533), param162 = param162.replace(/{{tags}}/g, var1538), param162 = param162.replace(/{{abstract}}/g, var1540), param162 = param162.replace(/{{abstractFormat}}/g, var1539), param162 = param162.replace(/{{year}}/g, Zotero.AI4Paper.getYear()), param162 = param162.replace(/{{dateCurrent}}/g, Zotero.AI4Paper.getDate()), param162 = param162.replace(/{{time}}/g, Zotero.AI4Paper.getTime()), param162 = param162.replace(/{{week}}/g, Zotero.AI4Paper.getWeek()), param162 = param162.replace(/{{yearMonth}}/g, Zotero.AI4Paper.getYearMonth()), param162 = param162.replace(/{{dateWeek}}/g, Zotero.AI4Paper.getDateWeek()), param162 = param162.replace(/{{dateTime}}/g, Zotero.AI4Paper.getDateTime()), param162 = param162.replace(/{{dateWeekTime}}/g, Zotero.AI4Paper.getDateWeekTime()), param162;
  },
  'extractJCRQ': function (param163) {
    if (!param163) {
      return '';
    }
    if (param163.lastIndexOf(')') != param163.length - 0x1) return '';
    const var1541 = /\(([^)]*)\)/,
      var1542 = param163.match(var1541);
    return var1542 ? var1542[0x1] : '';
  },
  'getZoteroDateY': function (param164) {
    return Zotero.Date.strToDate(param164).year;
  },
  'getDateAdded': function (param165) {
    return Zotero.AI4Paper.formatLocalDateTime(param165.getField("dateAdded"), true);
  },
  'getDateTimeAdded': function (param166) {
    return Zotero.AI4Paper.formatLocalDateTime(param166.getField("dateAdded"), false);
  },
  'getDateModified': function (param167) {
    return Zotero.AI4Paper.formatLocalDateTime(param167.getField('dateModified'), true);
  },
  'getDateTimeModified': function (param168) {
    return Zotero.AI4Paper.formatLocalDateTime(param168.getField("dateModified"), false);
  },
  'formatLocalDateTime': function (param169, param170) {
    let var1543 = new Date(param169),
      var1544 = var1543.getTimezoneOffset() * 0xea60,
      var1545 = new Date(var1543.getTime() - var1544),
      var1546 = var1545.getFullYear(),
      var1547 = (var1545.getMonth() + 0x1).toString().padStart(0x2, '0'),
      var1548 = var1545.getDate().toString().padStart(0x2, '0'),
      var1549 = var1545.getHours().toString().padStart(0x2, '0'),
      var1550 = var1545.getMinutes().toString().padStart(0x2, '0'),
      var1551 = var1545.getSeconds().toString().padStart(0x2, '0');
    return param170 ? var1546 + '-' + var1547 + '-' + var1548 : var1546 + '-' + var1547 + '-' + var1548 + '\x20' + var1549 + ':' + var1550 + ':' + var1551;
  },
  'getCollectionNames': function (param171) {
    const var1552 = [];
    var var1553 = param171.getCollections();
    for (let var1554 of var1553) {
      var1552.push('[[' + Zotero.Collections.get(var1554).name + ']]');
    }
    return var1552.join('、');
  },
  'getCollectionNames_YAML': function (param172) {
    try {
      const _0xc12385 = [];
      var var1556 = param172.getCollections();
      for (let var1557 of var1556) {
        _0xc12385.push(Zotero.Collections.get(var1557).name);
      }
      return '[' + _0xc12385.join(',\x20') + ']';
    } catch (_0x1eaaf3) {
      return '[]';
    }
  },
  'getRelatedItems': function (param173) {
    var var1558 = param173.getRelations()['dc:relation'],
      var1559 = [];
    if (var1558) {
      for (let var1560 of var1558) {
        try {
          var var1561 = Zotero.URI.getURIItemID(var1560);
          relatedItem = Zotero.Items.get(var1561);
          relatedItem.isRegularItem() && var1559.push('[[' + Zotero.AI4Paper.getQNKey(relatedItem) + ']]');
        } catch (_0x58f56a) {}
      }
    }
    return var1559.length === 0x0 ? '' : var1559.join('、\x20');
  },
  'getQNKey': function (param174) {
    let var1562 = param174.getField("citationKey");
    if (Zotero.Prefs.get('ai4paper.useCitationKeyasQNKey') && var1562) return var1562;
    let var1563 = Zotero.AI4Paper.resolveQNKeyTemplate(param174);
    if (var1563 && var1563 != "invalid QNKeyTemplate" && var1563 != "failed to resolve QNKeyTemplate") {
      if (Zotero.Prefs.get("ai4paper.useItemIDAsQNKeySuffix")) return var1563 + "_KEY-" + param174.key;else {
        return var1563;
      }
    }
    return Zotero.AI4Paper.getQNKeyDefault(param174);
  },
  'getQNKeyDefault': function (param175) {
    let var1564 = 0xa,
      var1565 = 0x14,
      var1566 = param175.getField('title');
    var1566 = var1566.replace(/\\/g, '\x20');
    var1566 = var1566.replace(/\//g, '\x20');
    var1566 = var1566.replace(/\:/g, '：');
    var1566 = var1566.replace(/： /g, '：');
    var1566 = var1566.replace(/\*/g, '\x20');
    var1566 = var1566.replace(/\?/g, '？');
    var1566 = var1566.replace(/\"/g, '“');
    var1566 = var1566.replace(/\</g, '\x20');
    var1566 = var1566.replace(/\>/g, '\x20');
    var1566 = var1566.replace(/\|/g, '\x20');
    let var1567 = '',
      var1568 = '',
      var1569 = Zotero.Date.strToDate(param175.getField("date", false, true)).year;
    var1568 = var1569 ? var1569 + '_' : '';
    if (param175.getCreators().length != 0x0) {
      let var1570 = param175.getCreators()[0x0].firstName,
        var1571 = param175.getCreators()[0x0].lastName;
      if (param175.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1) var1567 = var1571 ? var1571 + '_' : '';else {
        let _0x3c7d39 = '' + var1571 + var1570;
        var1567 = var1571 ? _0x3c7d39.substring(0x0, 0x6) + '_' : '';
      }
    }
    if (param175.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1) var var1573 = '' + var1568 + var1567 + var1566.substring(0x0, var1565) + "_KEY-" + param175.key;else {
      var var1573 = '' + var1568 + var1567 + var1566.substring(0x0, var1564) + "_KEY-" + param175.key;
    }
    return var1573 = var1573.replace(/\//g, '\x20'), var1573;
  },
  'resolveQNKeyTemplate': function (param176) {
    function fn2(param177, param178) {
      const _0x52c46b = param178 ? /\]\]\]/g : /\[\[\[/g,
        _0x2509d2 = [];
      let _0x7b1bf4;
      while ((_0x7b1bf4 = _0x52c46b.exec(param177)) !== null) {
        _0x2509d2.push(_0x7b1bf4.index);
      }
      return _0x2509d2;
    }
    let var1577 = Zotero.Prefs.get("ai4paper.qnkeyTemplate").replace(/'/g, '\x22');
    const var1578 = fn2(var1577, 0x0),
      var1579 = fn2(var1577, 0x1);
    if (!(var1578.length === var1579.length && var1578.length != 0x0 && var1579.length != 0x0)) return 'invalid\x20QNKeyTemplate';
    let var1580 = '';
    for (let var1581 = 0x0; var1581 < var1578.length; var1581++) {
      try {
        let _0x4a1974 = JSON.parse(var1577.substring(var1578[var1581] + 0x3, var1579[var1581]).trim());
        if (_0x4a1974.variable) {
          let var1583 = Zotero.AI4Paper.resolveVariable(param176, _0x4a1974, _0x4a1974.variable);
          var1583 && (var1580 = var1580 + var1583);
        }
      } catch (_0x6f48af) {
        return "failed to resolve QNKeyTemplate";
      }
    }
    return var1580.replace(/\//g, '\x20');
    ;
  },
  'resolveVariable': function (param179, param180, param181) {
    try {
      if (param181 === "firstAuthor") {
        if (param179.getCreators().length != 0x0) {
          let _0x15eac7 = '',
            _0x4fcbc0 = param179.getCreators()[0x0].firstName,
            _0x329f5d = param179.getCreators()[0x0].lastName;
          param179.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 ? _0x15eac7 = _0x329f5d : _0x15eac7 = '' + _0x329f5d + _0x4fcbc0;
          if (_0x15eac7.trim()) return '' + (param180?.["prefix"] || '') + _0x15eac7.trim() + (param180?.['suffix'] || '');
        }
      }
      if (param181 === 'firstName') {
        if (param179.getCreators().length != 0x0) {
          let var1587 = param179.getCreators()[0x0].firstName;
          if (var1587) return '' + (param180?.['prefix'] || '') + var1587 + (param180?.["suffix"] || '');
        }
      } else {
        if (param181 === 'lastName') {
          if (param179.getCreators().length != 0x0) {
            let var1588 = param179.getCreators()[0x0].lastName;
            if (var1588) {
              return '' + (param180?.['prefix'] || '') + var1588 + (param180?.['suffix'] || '');
            }
          }
        } else {
          if (param181 === 'year') {
            let var1589 = Zotero.Date.strToDate(param179.getField('date', false, true)).year;
            if (var1589) {
              return '' + (param180?.["prefix"] || '') + var1589 + (param180?.["suffix"] || '');
            }
          } else {
            if (param181 === 'title') {
              let var1590 = param179.getField("title");
              if (var1590.search(/[_\u4e00-\u9fa5]/) === -0x1 && param180.truncate_en) {
                var1590 = var1590.substring(0x0, parseInt(param180.truncate_en));
              }
              var1590.search(/[_\u4e00-\u9fa5]/) != -0x1 && param180.truncate_zh && (var1590 = var1590.substring(0x0, parseInt(param180.truncate_zh)));
              var1590 = var1590.trim().replace(/\\/g, '\x20').replace(/\//g, '\x20').replace(/\:/g, '：').replace(/： /g, '：').replace(/\*/g, '\x20').replace(/\?/g, '？').replace(/\"/g, '“').replace(/\</g, '\x20').replace(/\>/g, '\x20').replace(/\|/g, '\x20');
              if (var1590) return '' + (param180?.['prefix'] || '') + var1590 + (param180?.["suffix"] || '');
            } else {
              if (param181 === "shortTitle") {
                if (!(param180.blockChineseRefs && param179.getField("title").search(/[_\u4e00-\u9fa5]/) != -0x1)) {
                  let var1591 = param179.getField("shortTitle");
                  param180.truncate && (var1591 = var1591.substring(0x0, parseInt(param180.truncate)));
                  var1591 = var1591.trim().replace(/\\/g, '\x20').replace(/\//g, '\x20').replace(/\:/g, '：').replace(/： /g, '：').replace(/\*/g, '\x20').replace(/\?/g, '？').replace(/\"/g, '“').replace(/\</g, '\x20').replace(/\>/g, '\x20').replace(/\|/g, '\x20');
                  if (var1591) return '' + (param180?.["prefix"] || '') + var1591 + (param180?.["suffix"] || '');
                }
              } else {
                if (param181 === 'publicationTitle') {
                  let var1592 = param179.getField("publicationTitle");
                  if (var1592) return '' + (param180?.["prefix"] || '') + var1592 + (param180?.["suffix"] || '');
                } else {
                  if (param181 === 'journalAbbreviation') {
                    let var1593 = param179.getField('journalAbbreviation');
                    if (var1593) {
                      return '' + (param180?.["prefix"] || '') + var1593 + (param180?.["suffix"] || '');
                    }
                  } else {
                    if (param181 === "libraryCatalog") {
                      let _0x5609ee = param179.getField("libraryCatalog");
                      if (_0x5609ee) {
                        return '' + (param180?.['prefix'] || '') + _0x5609ee + (param180?.["suffix"] || '');
                      }
                    } else {
                      if (param181 === "callNumber") {
                        let var1595 = param179.getField("callNumber");
                        if (var1595) return '' + (param180?.["prefix"] || '') + var1595 + (param180?.['suffix'] || '');
                      } else {
                        if (param181 === "citationKey") {
                          let var1596 = param179.getField("citationKey");
                          if (var1596) return '' + (param180?.["prefix"] || '') + var1596 + (param180?.["suffix"] || '');
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
    } catch (_0x734214) {
      return false;
    }
    return false;
  },
  'sanitizeFilename': function (param182) {
    let var1597 = param182.replace(/[\\/:*?"<>|]/g, '_');
    var1597 = var1597.replace(/[\x00-\x1f]/g, '');
    var1597 = var1597.replace(/^[\s.]+|[\s.]+$/g, '');
    const var1598 = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
    return var1598.test(var1597) && (var1597 = '_' + var1597), var1597 = var1597.slice(0x0, 0xc8), var1597 || "unnamed";
  },
  'getItemZoteroLink': function (param183, param184) {
    let var1599 = Zotero.Libraries.get(param183.libraryID),
      var1600 = var1599.libraryType,
      var1601;
    if (var1600 === "user") var1601 = 'library';else {
      if (var1600 === "group") var1601 = Zotero.URI.getLibraryPath(param183.libraryID);else return;
    }
    let var1602 = 'zotero://select/' + var1601 + "/items/" + param183.key;
    return param184 ? '[' + var1602 + ']' : var1602;
  },
  'getItemZoteroPDFLinksHTML': function (param185) {
    let var1603 = 0x0,
      var1604 = param185.getAttachments();
    var var1605 = [];
    for (let var1606 of var1604) {
      let var1607 = Zotero.Items.get(var1606);
      if (['application/pdf', "text/html", "application/epub+zip"].includes(var1607.attachmentContentType)) {
        if (var1607.attachmentLinkMode === 0x3) continue;
        var1603++;
        let var1608 = Zotero.AI4Paper.getItemPDFLink(var1607);
        var1608 = "<li><a href=\"" + var1608 + '\x22>' + var1607.getField("title") + "</a></li>";
        var1605.push(var1608);
      }
    }
    if (var1605.length === 0x0) return '';
    if (var1603 === 0x1) {
      for (let var1609 of var1604) {
        let _0x2cf849 = Zotero.Items.get(var1609);
        if (["application/pdf", "text/html", "application/epub+zip"].includes(_0x2cf849.attachmentContentType)) {
          if (_0x2cf849.attachmentLinkMode === 0x3) continue;
          let _0x148ca1 = Zotero.AI4Paper.getItemPDFLink(_0x2cf849);
          return '[' + _0x2cf849.getField('title') + '](' + _0x148ca1 + ')';
        }
      }
    } else return "<ul>" + var1605.join('') + '</ul>';
  },
  'getItemZoteroPDFLinksYAML': function (param186) {
    try {
      let _0x3b8197 = param186.getAttachments();
      var var1613 = [];
      for (let var1614 of _0x3b8197) {
        let var1615 = Zotero.Items.get(var1614);
        if (["application/pdf", 'text/html', "application/epub+zip"].includes(var1615.attachmentContentType)) {
          if (var1615.attachmentLinkMode === 0x3) {
            continue;
          }
          var1613.push(Zotero.AI4Paper.getItemPDFLink(var1615));
        }
      }
      return '[' + var1613.join(',\x20') + ']';
    } catch (_0x25dc3c) {
      return '[]';
    }
  },
  'getItemZoteroPDFLinks': function (param187) {
    let var1616 = param187.getAttachments();
    var var1617 = [];
    for (let var1618 of var1616) {
      let _0x1dbe29 = Zotero.Items.get(var1618);
      if (['application/pdf', "text/html", 'application/epub+zip'].includes(_0x1dbe29.attachmentContentType)) {
        if (_0x1dbe29.attachmentLinkMode === 0x3) continue;
        let var1620 = Zotero.AI4Paper.getItemPDFLink(_0x1dbe29);
        var1620 = " - [" + _0x1dbe29.getField("title") + '](' + var1620 + ')';
        var1617.push(var1620);
      }
    }
    return var1617.join('\x0a');
  },
  'getItemPDFLink': function (param188) {
    let var1621 = Zotero.Libraries.get(param188.libraryID).libraryType;
    if (var1621 === 'group') return 'zotero://open-pdf/' + Zotero.URI.getLibraryPath(param188.libraryID) + "/items/" + param188.key;else {
      if (var1621 === "user") return "zotero://open-pdf/library/items/" + param188.key;
    }
    return undefined;
  },
  'getFirstCreator': function (param190) {
    let var1665 = '';
    if (param190.getCreators().length != 0x0) {
      let var1666 = param190.getCreators()[0x0].firstName,
        var1667 = param190.getCreators()[0x0].lastName;
      Zotero.AI4Paper.isChineseText(param190.getField("title")) ? var1665 = '' + var1667 + var1666 || '' : var1665 = var1667 || '';
    }
    return var1665;
  },
  'getJournalAbbreviation': function (param191) {
    let var1668 = param191.getField('journalAbbreviation');
    if (!var1668 && Zotero.AI4Paper.isChineseText(param191.getField("title"))) {
      var1668 = param191.getField('publicationTitle');
    }
    return var1668.replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '“').replace(/\n/g, '\x20');
  },
  'templateVariables': function (param192, param193) {
    let var1669 = param192.getField("date"),
      var1670 = Zotero.AI4Paper.getZoteroDateY(var1669);
    return var1669 = Zotero.AI4Paper.getZoteroDate(var1669), param193 = param193.replace(/{{itemType}}/g, Zotero.ItemTypes.getName(param192.itemTypeID)), param193 = param193.replace(/{{title}}/g, param192.getField('title')), param193 = param193.replace(/{{shortTitle}}/g, param192.getField("shortTitle").replace(/\ /g, '')), param193 = param193.replace(/{{date}}/g, var1669), param193 = param193.replace(/{{dateY}}/g, var1670), param193 = param193.replace(/{{tags}}/g, Zotero.AI4Paper.getItemTags(param192).replace(/🏷️ /g, '')), param193 = param193.replace(/{{collection}}/g, Zotero.AI4Paper.getCollectionNames(param192)), param193 = param193.replace(/{{qnkey}}/g, Zotero.AI4Paper.getQNKey(param192)), param193 = param193.replace(/{{citationKey}}/g, param192.getField("citationKey")), param193 = param193.replace(/{{year}}/g, Zotero.AI4Paper.getYear()), param193 = param193.replace(/{{dateCurrent}}/g, Zotero.AI4Paper.getDate()), param193 = param193.replace(/{{time}}/g, Zotero.AI4Paper.getTime()), param193 = param193.replace(/{{week}}/g, Zotero.AI4Paper.getWeek()), param193 = param193.replace(/{{yearMonth}}/g, Zotero.AI4Paper.getYearMonth()), param193 = param193.replace(/{{dateWeek}}/g, Zotero.AI4Paper.getDateWeek()), param193 = param193.replace(/{{dateTime}}/g, Zotero.AI4Paper.getDateTime()), param193 = param193.replace(/{{dateWeekTime}}/g, Zotero.AI4Paper.getDateWeekTime()), param193 = param193.replace(/{{dateAdded}}/g, Zotero.AI4Paper.getDateAdded(param192)), param193 = param193.replace(/{{dateModified}}/g, Zotero.AI4Paper.getDateModified(param192)), param193;
  },
  'readYAMLTemplate': function (param194, param195) {
    let var1671 = param194.indexOf(param195),
      var1672 = param194.substring(var1671),
      var1673 = var1672.indexOf('[[['),
      var1674 = var1672.indexOf(']]]'),
      var1675 = var1672.substring(var1673 + 0x3, var1674);
    return var1675;
  },
  'yamlTemplate': function (param196, param197) {
    let var1676 = Zotero.ItemTypes.getName(param196.itemTypeID),
      var1677 = param196.getField('title'),
      var1678 = param196.getField('shortTitle'),
      var1679 = Zotero.AI4Paper.getYAMLProp_creators(param196),
      var1680 = Zotero.AI4Paper.getFirstCreator(param196),
      var1681 = param196.getField("publicationTitle").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '“').replace(/\n/g, '\x20'),
      var1682 = Zotero.AI4Paper.getJournalAbbreviation(param196),
      var1683 = param196.getField("volume"),
      var1684 = param196.getField("issue"),
      var1685 = param196.getField('pages'),
      var1686 = param196.getField("language"),
      var1687 = param196.getField("DOI"),
      var1688 = param196.getField("ISSN"),
      var1689 = param196.getField("archive"),
      var1690 = param196.getField("archiveLocation"),
      var1691 = param196.getField('libraryCatalog'),
      var1692 = param196.getField("callNumber"),
      var1693 = param196.getField("rights"),
      var1694 = param196.getField("extra").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '“').replace(/\n/g, '\x20'),
      var1695 = param196.getField("proceedingsTitle"),
      var1696 = param196.getField("conferenceName"),
      var1697 = param196.getField("place"),
      var1698 = param196.getField("publisher"),
      var1699 = param196.getField("ISBN"),
      var1700 = param196.getField('university'),
      var1701 = param196.getField("edition"),
      var1702 = param196.getField("country"),
      var1703 = param196.getField("issuingAuthority"),
      var1704 = param196.getField("patentNumber"),
      var1705 = param196.getField('applicationNumber'),
      var1706 = param196.getField('priorityNumbers'),
      var1707 = param196.getField('issueDate'),
      var1708 = param196.getField("date"),
      var1709 = Zotero.AI4Paper.getZoteroDateY(var1708),
      var1710 = Zotero.AI4Paper.getDateAdded(param196),
      var1711 = Zotero.AI4Paper.getDateModified(param196),
      var1712 = Zotero.AI4Paper.getCollectionNames_YAML(param196),
      var1713 = Zotero.AI4Paper.getItemZoteroLink(param196, true),
      var1714 = Zotero.AI4Paper.getItemZoteroPDFLinksYAML(param196),
      var1715 = Zotero.AI4Paper.getItemTagsYAML(param196).replace(/🏷️ /g, '').replace(/\/unread/g, 'unread').replace(/\/Done/g, 'Done').replace(/\/reading/g, "reading"),
      var1716 = param196.getField('abstractNote').replace(/\n\n【摘要翻译】/g, '【摘要翻译】').replace(/\n\n【摘要翻译】/g, "【摘要翻译】").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '“').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    return var1708 = Zotero.AI4Paper.getZoteroDate(var1708), param197 = param197.replace(/{{itemType}}/g, var1676), param197 = param197.replace(/{{title}}/g, var1677), param197 = param197.replace(/{{shortTitle}}/g, var1678.replace(/\ /g, '')), param197 = param197.replace(/{{creators}}/g, var1679), param197 = param197.replace(/{{firstCreator}}/g, var1680), param197 = param197.replace(/{{publicationTitle}}/g, var1681), param197 = param197.replace(/{{journalAbbreviation}}/g, var1682), param197 = param197.replace(/{{volume}}/g, var1683), param197 = param197.replace(/{{issue}}/g, var1684), param197 = param197.replace(/{{pages}}/g, var1685), param197 = param197.replace(/{{language}}/g, var1686), param197 = param197.replace(/{{DOI}}/g, var1687), param197 = param197.replace(/{{ISSN}}/g, var1688), param197 = param197.replace(/{{archive}}/g, var1689), param197 = param197.replace(/{{archiveLocation}}/g, var1690), param197 = param197.replace(/{{libraryCatalog}}/g, var1691), param197 = param197.replace(/{{callNumber}}/g, var1692), param197 = param197.replace(/{{rights}}/g, var1693), param197 = param197.replace(/{{extra}}/g, var1694), param197 = param197.replace(/{{proceedingsTitle}}/g, var1695), param197 = param197.replace(/{{conferenceName}}/g, var1696), param197 = param197.replace(/{{place}}/g, var1697), param197 = param197.replace(/{{publisher}}/g, var1698), param197 = param197.replace(/{{ISBN}}/g, var1699), param197 = param197.replace(/{{university}}/g, var1700), param197 = param197.replace(/{{edition}}/g, var1701), param197 = param197.replace(/{{country}}/g, var1702), param197 = param197.replace(/{{issuingAuthority}}/g, var1703), param197 = param197.replace(/{{patentNumber}}/g, var1704), param197 = param197.replace(/{{applicationNumber}}/g, var1705), param197 = param197.replace(/{{priorityNumbers}}/g, var1706), param197 = param197.replace(/{{issueDate}}/g, var1707), param197 = param197.replace(/{{date}}/g, var1708), param197 = param197.replace(/{{dateY}}/g, var1709), param197 = param197.replace(/{{dateAdded}}/g, var1710), param197 = param197.replace(/{{dateModified}}/g, var1711), param197 = param197.replace(/{{collection}}/g, var1712), param197 = param197.replace(/{{qnkey}}/g, Zotero.AI4Paper.getQNKey(param196)), param197 = param197.replace(/{{citationKey}}/g, param196.getField('citationKey')), param197 = param197.replace(/{{itemLink}}/g, var1713), param197 = param197.replace(/{{pdfLink}}/g, var1714), param197 = param197.replace(/{{tags}}/g, var1715), param197 = param197.replace(/{{abstract}}/g, var1716), param197 = param197.replace(/{{year}}/g, Zotero.AI4Paper.getYear()), param197 = param197.replace(/{{dateCurrent}}/g, Zotero.AI4Paper.getDate()), param197 = param197.replace(/{{time}}/g, Zotero.AI4Paper.getTime()), param197 = param197.replace(/{{week}}/g, Zotero.AI4Paper.getWeek()), param197 = param197.replace(/{{yearMonth}}/g, Zotero.AI4Paper.getYearMonth()), param197 = param197.replace(/{{dateWeek}}/g, Zotero.AI4Paper.getDateWeek()), param197 = param197.replace(/{{dateTime}}/g, Zotero.AI4Paper.getDateTime()), param197 = param197.replace(/{{dateWeekTime}}/g, Zotero.AI4Paper.getDateWeekTime()), param197;
  },
  'getYAMLProp_creators': function (param199) {
    let var1720 = param199.getCreators(),
      var1721 = [],
      var1722 = '';
    if (var1720.length > 0x0) {
      if (param199.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1) {
        for (let var1723 of var1720) {
          var1721.push(var1723.firstName + '\x20' + var1723.lastName);
        }
      } else {
        for (let var1724 of var1720) {
          var1721.push('' + var1724.lastName + var1724.firstName);
        }
      }
      var1722 = '[' + var1721.join(',\x20') + ']';
    }
    return var1722;
  },

  // === Block B: Metadata Update from Network ===
  'updateSelectedItemsMetadata': async function () {
    var var5541 = Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != var5541) return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    let var5542 = Zotero_Tabs._selectedID;
    var var5543 = Zotero.Reader.getByTabID(var5542);
    this._Data_title = null;
    this._Data_firstNames = [];
    this._Data_lastNames = [];
    this._Data_volume = null;
    this._Data_issue = null;
    this._Data_page = null;
    this._Data_date = null;
    this._Data_publication = null;
    this._Data_journalAbbreviation = null;
    this._Data_issn = null;
    this._Data_language = null;
    this._Data_url = null;
    if (var5543) {
      let var5544 = var5543.itemID,
        var5545 = Zotero.Items.get(var5544);
      if (var5545 && var5545.parentItemID) {
        var5544 = var5545.parentItemID;
        var5545 = Zotero.Items.get(var5544);
        this._Num_getMetadata = 0x0;
        let var5546 = var5545.getField("DOI");
        if (var5546 === '') {
          return window.alert("您选中的文献缺失 DOI 信息！"), false;
        }
        Zotero.AI4Paper.showProgressWindow(0xdac, "⚖️ 正在更新，请等待... 【AI4paper】", '更新元数据需要一定时间，结果将通过弹窗反馈给您！');
        await this.updateItemMetadata(var5545, false);
        Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 基础元数据更新结果 【AI4paper】", '有【' + this._Num_getMetadata + "】篇匹配到基础元数据！");
        this._Data_Abstract = null;
        this._Num_getAbstract = 0x0;
        Zotero.Prefs.get("ai4paper.metadataabstract") && (await Zotero.AI4Paper.fetchItemCitations(var5545), this._Data_Abstract != null && (this._Num_getAbstract++, Zotero.Prefs.get("ai4paper.abstracttransaftermetadata") ? (var5545.setField("abstractNote", this._Data_Abstract), await var5545.saveTx(), await Zotero.AI4Paper.translationEngineTask_title_abstract(var5545, "abstractNote")) : var5545.getField("abstractNote").indexOf("【摘要翻译】") === -0x1 && (var5545.setField("abstractNote", this._Data_Abstract), await var5545.saveTx())), Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 摘要更新结果 【AI4paper】", '有【' + this._Num_getAbstract + "】篇匹配到摘要！"));
      }
    } else {
      var var5547 = ZoteroPane.getSelectedItems();
      if (var5547.length === 0x1 && var5547[0x0].getField("DOI") === '') return Zotero.Prefs.get("ai4paper.journalabbreviationlocaldatabasefirst") && (await Zotero.AI4Paper.fetchJournalAbbrLocal(var5547[0x0])), window.alert("您选中的文献缺失 DOI 信息！"), false;
      this._Num_getMetadata = 0x0;
      Zotero.AI4Paper.showProgressWindow(0xdac, "⚖️ 正在更新，请等待... 【AI4paper】", "更新元数据需要一定时间，结果将通过弹窗反馈给您！");
      await this.updateItemsMetadata(var5547.filter(_0x339fb8 => _0x339fb8.isRegularItem()), false);
      Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 元数据更新结果 【AI4paper】", "您选中的 " + var5547.length + " 篇文献中，有【" + this._Num_getMetadata + "】篇匹配到元数据！");
      if (Zotero.Prefs.get("ai4paper.metadataabstract")) {
        this._Num_getAbstract = 0x0;
        for (let var5548 of var5547) {
          this._Data_Abstract = null;
          await Zotero.AI4Paper.fetchItemCitations(var5548);
          this._Data_Abstract != null && (this._Num_getAbstract++, Zotero.Prefs.get("ai4paper.abstracttransaftermetadata") ? (var5548.setField("abstractNote", this._Data_Abstract), await var5548.saveTx(), await Zotero.AI4Paper.translationEngineTask_title_abstract(var5548, "abstractNote")) : var5548.getField("abstractNote").indexOf("【摘要翻译】") === -0x1 && (var5548.setField("abstractNote", this._Data_Abstract), await var5548.saveTx()));
        }
        Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 摘要更新结果 【AI4paper】", '有【' + this._Num_getAbstract + "】篇匹配到摘要！");
      }
    }
  },
  'updateItemsMetadata': async function (param1089, param1090) {
    if (!Zotero.AI4Paper.runAuthor()) return -0x1;
    for (let var5549 of param1089) {
      let _0x872ea3 = var5549.getField("DOI");
      if (_0x872ea3 === '' || var5549.getField("title").search(/[_\u4e00-\u9fa5]/) != -0x1) continue;
      await this.updateItemMetadata(var5549, param1090);
    }
  },
  'updateItemMetadata': async function (param1091, param1092) {
    this._Data_title = null;
    this._Data_firstNames = [];
    this._Data_lastNames = [];
    this._Data_volume = null;
    this._Data_issue = null;
    this._Data_page = null;
    this._Data_date = null;
    this._Data_publication = null;
    this._Data_journalAbbreviation = null;
    this._Data_issn = null;
    this._Data_language = null;
    this._Data_url = null;
    let var5551 = false;
    if (!param1092 && Zotero.Prefs.get("ai4paper.journalabbreviationlocaldatabasefirst")) {
      var5551 = await Zotero.AI4Paper.fetchJournalAbbrLocal(param1091);
    }
    let var5552 = param1091.getField("DOI");
    await Zotero.AI4Paper.fetchItemMetadata(var5552);
    try {
      if (this._Data_title != null || this._Data_volume != null || this._Data_issue != null || this._Data_page != null || this._Data_date != null || this._Data_publication != null || this._Data_journalAbbreviation != null || this._Data_issn != null || this._Data_language != null || this._Data_url != null || this._Data_firstNames.length > 0x0) {
        if (!param1092) {
          this._Num_getMetadata++;
        }
        this._Data_title != null && Zotero.Prefs.get("ai4paper.metadatatitle") && (this._Data_title = this._Data_title.replace("&amp;amp;", '&'), this._Data_title = this._Data_title.replace("&amp;", '&'), param1091.setField("title", this._Data_title), await param1091.saveTx());
        this._Data_volume != null && Zotero.Prefs.get("ai4paper.metadatavolume") && (param1091.setField("volume", this._Data_volume), await param1091.saveTx());
        this._Data_issue != null && Zotero.Prefs.get("ai4paper.metadataissue") && (param1091.setField("issue", this._Data_issue), await param1091.saveTx());
        this._Data_page != null && Zotero.Prefs.get("ai4paper.metadatapages") && (param1091.setField("pages", this._Data_page), await param1091.saveTx());
        this._Data_date != null && Zotero.Prefs.get("ai4paper.metadatadate") && (this._Data_date = String(this._Data_date).replace(/\,/g, '/'), param1091.setField("date", this._Data_date), await param1091.saveTx());
        this._Data_publication != null && typeof this._Data_publication === 'string' && Zotero.Prefs.get("ai4paper.metadatapublication") && (this._Data_publication = this._Data_publication.replace("&amp;amp;", '&'), this._Data_publication = this._Data_publication.replace("&amp;", '&'), param1091.setField("publicationTitle", this._Data_publication), await param1091.saveTx());
        if (this._Data_journalAbbreviation != null && Zotero.Prefs.get('ai4paper.metadatajournalabbreviation') && !var5551) {
          this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace("&amp;amp;", '&');
          this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace("&amp;", '&');
          param1091.setField("journalAbbreviation", this._Data_journalAbbreviation);
          await param1091.saveTx();
        }
        this._Data_issn != null && Zotero.Prefs.get("ai4paper.metadataissn") && (param1091.setField("ISSN", this._Data_issn), await param1091.saveTx());
        this._Data_language != null && Zotero.Prefs.get('ai4paper.metadatalanguage') && (param1091.setField("language", this._Data_language), await param1091.saveTx());
        if (this._Data_url != null && Zotero.Prefs.get("ai4paper.metadataurl")) {
          param1091.setField("url", this._Data_url);
          await param1091.saveTx();
        }
        if (this._Data_firstNames.length > 0x0 && Zotero.Prefs.get("ai4paper.metadataauthors")) {
          let _0x40ac58 = [];
          for (i = 0x0; i < this._Data_firstNames.length; i++) {
            if (this._Data_firstNames[i] || this._Data_lastNames[i]) {
              let _0x4bd79b = {
                'firstName': this._Data_firstNames[i],
                'lastName': this._Data_lastNames[i],
                'creatorType': "author"
              };
              _0x40ac58.push(_0x4bd79b);
            }
          }
          param1091.setCreators(_0x40ac58);
          await param1091.saveTx();
          this._Data_firstNames = [];
          this._Data_lastNames = [];
        }
      }
    } catch (_0x1a0311) {
      Zotero.debug(_0x1a0311);
    }
  },
  'fetchItemMetadata': async function (param1093) {
    this._Data_itemType = null;
    this._Data_title = null;
    this._Data_firstNames = [];
    this._Data_lastNames = [];
    this._Data_volume = null;
    this._Data_issue = null;
    this._Data_page = null;
    this._Data_date = null;
    this._Data_publication = null;
    this._Data_journalAbbreviation = null;
    this._Data_issn = null;
    this._Data_language = null;
    this._Data_url = null;
    this._Data_publisherLocation = null;
    this._Data_publisher = null;
    this._Data_isbn = null;
    if (!param1093) {
      return -0x1;
    }
    if (!Zotero.AI4Paper.showDate()) return -0x1;
    const var5555 = encodeURIComponent(param1093);
    let var5556 = null;
    if (var5556 === null) {
      const var5557 = 'vnd.citationstyles.csl+json',
        var5558 = "transform/application/" + var5557,
        var5559 = "https://api.crossref.org/works/" + var5555 + '/' + var5558;
      var5556 = await fetch(var5559).then(_0xb7a1ee => _0xb7a1ee.json())["catch"](_0x4aa964 => null);
    }
    if (var5556 === null) {
      const var5560 = 'https://doi.org/' + var5555,
        var5561 = "vnd.citationstyles.csl+json";
      var5556 = await fetch(var5560, {
        'headers': {
          'Accept': 'application/' + var5561
        }
      }).then(_0x46d604 => _0x46d604.json())['catch'](_0x3402b3 => null);
    }
    if (var5556 === null) return -0x1;
    try {
      this._Data_itemType = var5556.type;
    } catch (_0x2c85c7) {}
    try {
      this._Data_title = var5556.title;
    } catch (_0x5b53d3) {}
    try {
      for (i = 0x0; i < var5556.author.length; i++) {
        this._Data_firstNames.push(var5556.author[i].given);
        this._Data_lastNames.push(var5556.author[i].family);
      }
    } catch (_0x1beee6) {}
    try {
      this._Data_volume = var5556.volume;
    } catch (_0x254ffb) {}
    try {
      this._Data_issue = var5556.issue;
    } catch (_0x4112fc) {}
    try {
      this._Data_page = var5556.page;
    } catch (_0x503f1d) {}
    let var5562 = var5556?.["published-print"]?.["date-parts"];
    var5562 && (this._Data_date = var5562);
    try {
      this._Data_publication = var5556['container-title'];
    } catch (_0x33b641) {}
    try {
      this._Data_journalAbbreviation = var5556['container-title-short'];
    } catch (_0x1cbc18) {}
    try {
      this._Data_issn = var5556.ISSN[0x0];
    } catch (_0x1caef3) {}
    try {
      this._Data_language = var5556.language;
    } catch (_0x2ea868) {}
    try {
      this._Data_url = var5556.resource.primary.URL;
    } catch (_0x2c4cbe) {}
    try {
      this._Data_publisherLocation = var5556["publisher-location"];
    } catch (_0x54e0fc) {}
    try {
      this._Data_publisher = var5556.publisher;
    } catch (_0x508de2) {}
    try {
      this._Data_isbn = var5556.ISBN[0x1];
    } catch (_0x4e367f) {}
  },
  'fetchMetadataItem': async function (param1094, param1095) {
    param1095._Data_itemType = null;
    param1095._Data_title = null;
    param1095._Data_firstNames = [];
    param1095._Data_lastNames = [];
    param1095._Data_volume = null;
    param1095._Data_issue = null;
    param1095._Data_page = null;
    param1095._Data_date = null;
    param1095._Data_publication = null;
    param1095._Data_journalAbbreviation = null;
    param1095._Data_issn = null;
    param1095._Data_language = null;
    param1095._Data_url = null;
    param1095._Data_publisherLocation = null;
    param1095._Data_publisher = null;
    param1095._Data_isbn = null;
    if (!param1094) return -0x1;
    if (!Zotero.AI4Paper.showDate()) return -0x1;
    const var5563 = encodeURIComponent(param1094);
    let var5564 = null;
    if (var5564 === null) {
      const var5565 = "vnd.citationstyles.csl+json",
        var5566 = "transform/application/" + var5565,
        var5567 = "https://api.crossref.org/works/" + var5563 + '/' + var5566;
      var5564 = await fetch(var5567).then(_0x7cde69 => _0x7cde69.json())["catch"](_0x5c8a39 => null);
    }
    if (var5564 === null) {
      const var5568 = "https://doi.org/" + var5563,
        var5569 = "vnd.citationstyles.csl+json";
      var5564 = await fetch(var5568, {
        'headers': {
          'Accept': 'application/' + var5569
        }
      }).then(_0x355b89 => _0x355b89.json())["catch"](_0x2d36f4 => null);
    }
    if (var5564 === null) return -0x1;
    try {
      param1095._Data_itemType = var5564.type;
    } catch (_0x57ac7a) {}
    try {
      param1095._Data_title = var5564.title;
    } catch (_0x1a219d) {}
    try {
      for (i = 0x0; i < var5564.author.length; i++) {
        param1095._Data_firstNames.push(var5564.author[i].given);
        param1095._Data_lastNames.push(var5564.author[i].family);
      }
    } catch (_0x12662c) {}
    try {
      param1095._Data_volume = var5564.volume;
    } catch (_0x70b1ef) {}
    try {
      param1095._Data_issue = var5564.issue;
    } catch (_0x5720aa) {}
    try {
      param1095._Data_page = var5564.page;
    } catch (_0x3170d8) {}
    try {
      param1095._Data_date = var5564["published-print"]["date-parts"];
    } catch (_0x4a79b0) {}
    try {
      param1095._Data_publication = var5564["container-title"];
    } catch (_0x4c162c) {}
    try {
      param1095._Data_journalAbbreviation = var5564["container-title-short"];
    } catch (_0x2092f8) {}
    try {
      param1095._Data_issn = var5564.ISSN[0x0];
    } catch (_0x3898be) {}
    try {
      param1095._Data_language = var5564.language;
    } catch (_0x556481) {}
    try {
      param1095._Data_url = var5564.resource.primary.URL;
    } catch (_0x489ac1) {}
    try {
      param1095._Data_publisherLocation = var5564['publisher-location'];
    } catch (_0x122357) {}
    try {
      param1095._Data_publisher = var5564.publisher;
    } catch (_0x294a99) {}
    try {
      param1095._Data_isbn = var5564.ISBN[0x1];
    } catch (_0x5618ef) {}
  },

  // === Block C: Journal Abbreviation Update ===
  'updateSelectedItemsAbbreviation': async function () {
    if (Zotero.Prefs.get('ai4paper.activationkeyverifyresult') != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) return window.alert('❌\x20Zotero\x20One\x20尚未激活，请前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20激活】\x20联网激活插件！'), -0x1;
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return false;
    }
    Zotero.debug("AI4Paper: Update Journal Abbreviation for Selected items");
    let var5573 = Zotero_Tabs._selectedID;
    var var5574 = Zotero.Reader.getByTabID(var5573);
    if (var5574) {
      let var5575 = var5574.itemID,
        var5576 = Zotero.Items.get(var5575);
      var5576 && var5576.parentItemID && (var5575 = var5576.parentItemID, var5576 = Zotero.Items.get(var5575), this._Num_Done = 0x0, await Zotero.AI4Paper.fetchItemAbbreviation(var5576), this.showProgressWindow(0x1388, "匹配期刊简称【AI4paper】", "共有【" + this._Num_Done + "】篇文献匹配到期刊简称！", "zoteorif"));
    } else {
      let var5577 = Zotero.getActiveZoteroPane().getSelectedItems();
      this._Num_AllSel = var5577.length;
      let var5578 = var5577.filter(_0x243a6f => _0x243a6f.isRegularItem());
      this._Num_Done = 0x0;
      for (let var5579 of var5578) {
        await Zotero.AI4Paper.fetchItemAbbreviation(var5579);
      }
      this.showProgressWindow(0x1388, '匹配期刊简称【Zotero\x20One】', '共有【' + this._Num_Done + '\x20of\x20' + this._Num_AllSel + "】篇文献匹配到期刊简称", 'zoteorif');
    }
  },
  'fetchItemAbbreviation': async function (param1096) {
    let var5580 = "publicationTitle",
      var5581 = 'journalAbbreviation';
    if (Zotero.AI4Paper.checkItemField(param1096, var5580)) {
      let var5582 = param1096.getField('publicationTitle').toLowerCase();
      if (Zotero.Prefs.get("ai4paper.enableCustomPublicationTitle")) {
        let _0x3a9be2 = Zotero.AI4Paper.getCustomPublicationTitle(var5582);
        _0x3a9be2 && (var5582 = _0x3a9be2);
      }
      var var5584 = Zotero.AI4Paper._data_full_to_abbrev_dots[var5582];
      Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (var5584 = Zotero.AI4Paper._data_full_to_abbrev[var5582]);
      if (Zotero.Prefs.get("ai4paper.enableCustomJournalAbbr")) {
        let _0x578e24 = Zotero.AI4Paper.getCustomJournalAbbr(var5582);
        _0x578e24 && (var5584 = _0x578e24);
      }
      let var5586 = Zotero.AI4Paper._data_modifiedPubTitles[var5582],
        var5587 = Zotero.AI4Paper._data_abbrev_to_full[var5582];
      if (var5584 != undefined) {
        param1096.setField(var5581, var5584);
        await param1096.saveTx();
        this._Num_Done++;
      } else {
        if (var5586 != undefined) {
          var5584 = Zotero.AI4Paper._data_full_to_abbrev_dots[var5586];
          if (Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式") {
            var5584 = Zotero.AI4Paper._data_full_to_abbrev[var5586];
          }
          if (var5584 != undefined) {
            param1096.setField(var5581, var5584);
            await param1096.saveTx();
            this._Num_Done++;
          }
        } else {
          if (var5587 != undefined) {
            var5584 = Zotero.AI4Paper._data_full_to_abbrev_dots[var5587];
            Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (var5584 = Zotero.AI4Paper._data_full_to_abbrev[var5587]);
            var5584 != undefined && (param1096.setField(var5581, var5584), await param1096.saveTx(), this._Num_Done++);
          } else {
            if (var5582.indexOf("the") === 0x0) {
              let _0x1e5190 = var5582.substring(0x4);
              var5584 = Zotero.AI4Paper._data_full_to_abbrev_dots[_0x1e5190];
              if (Zotero.Prefs.get('ai4paper.journalabbreviationstyle') === "不带点格式") {
                var5584 = Zotero.AI4Paper._data_full_to_abbrev[_0x1e5190];
              }
              var5584 != undefined && (param1096.setField(var5581, var5584), await param1096.saveTx(), this._Num_Done++);
            }
          }
        }
      }
    }
  },
  'fetchJournalAbbrLocal': async function (param1097) {
    let var5589 = 'publicationTitle',
      var5590 = "journalAbbreviation";
    if (Zotero.AI4Paper.checkItemField(param1097, var5589)) {
      let var5591 = param1097.getField("publicationTitle").toLowerCase();
      if (Zotero.Prefs.get("ai4paper.enableCustomPublicationTitle")) {
        let _0x3f9524 = Zotero.AI4Paper.getCustomPublicationTitle(var5591);
        _0x3f9524 && (var5591 = _0x3f9524);
      }
      var var5593 = Zotero.AI4Paper._data_full_to_abbrev_dots[var5591];
      Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (var5593 = Zotero.AI4Paper._data_full_to_abbrev[var5591]);
      if (Zotero.Prefs.get("ai4paper.enableCustomJournalAbbr")) {
        let var5594 = Zotero.AI4Paper.getCustomJournalAbbr(var5591);
        if (var5594) {
          var5593 = var5594;
        }
      }
      let var5595 = Zotero.AI4Paper._data_modifiedPubTitles[var5591],
        var5596 = Zotero.AI4Paper._data_abbrev_to_full[var5591];
      if (var5593 != undefined) return param1097.setField(var5590, var5593), await param1097.saveTx(), true;else {
        if (var5595 != undefined) {
          var5593 = Zotero.AI4Paper._data_full_to_abbrev_dots[var5595];
          Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (var5593 = Zotero.AI4Paper._data_full_to_abbrev[var5595]);
          if (var5593 != undefined) {
            return param1097.setField(var5590, var5593), await param1097.saveTx(), true;
          }
        } else {
          if (var5596 != undefined) {
            var5593 = Zotero.AI4Paper._data_full_to_abbrev_dots[var5596];
            Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (var5593 = Zotero.AI4Paper._data_full_to_abbrev[var5596]);
            if (var5593 != undefined) return param1097.setField(var5590, var5593), await param1097.saveTx(), true;
          } else {
            if (var5591.indexOf("the") === 0x0) {
              let _0x406cdb = var5591.substring(0x4);
              var5593 = Zotero.AI4Paper._data_full_to_abbrev_dots[_0x406cdb];
              Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (var5593 = Zotero.AI4Paper._data_full_to_abbrev[_0x406cdb]);
              if (var5593 != undefined) return param1097.setField(var5590, var5593), await param1097.saveTx(), true;
            }
          }
        }
      }
    }
    return false;
  },

  // === Block D: Clear Field ===
  'clearField': async function (param1098) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'))) {
      return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    }
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return false;
    }
    Zotero.debug("AI4paper: clear field for selected items");
    let var5598 = false;
    Zotero.locale === 'zh-CN' && (var5598 = true);
    let var5599 = {
        'extra': !var5598 ? "extra" : '其他',
        'rights': !var5598 ? 'rights' : '版权',
        'callNumber': !var5598 ? "callNumber" : "索书号",
        'libraryCatalog': !var5598 ? 'libraryCatalog' : "文库编目",
        'archiveLocation': !var5598 ? "archiveLocation" : "存档位置",
        'archive': !var5598 ? 'archive' : '档案',
        'shortTitle': !var5598 ? "shortTitle" : '短标题'
      },
      var5600 = Zotero_Tabs._selectedID;
    var var5601 = Zotero.Reader.getByTabID(var5600);
    if (var5601) {
      let _0xa64261 = var5601.itemID,
        _0x90f7fb = Zotero.Items.get(_0xa64261);
      _0x90f7fb && _0x90f7fb.parentItemID && (_0xa64261 = _0x90f7fb.parentItemID, _0x90f7fb = Zotero.Items.get(_0xa64261), Zotero.AI4Paper.checkItemField(_0x90f7fb, param1098) ? (_0x90f7fb.setField(param1098, ''), await _0x90f7fb.saveTx(), this.showProgressWindow(0x1388, "🧹 清除字段【AI4paper】", "您成功清楚当前文献的【" + var5599[param1098] + "】字段内容！", 'zoteorif')) : this.showProgressWindow(0x1388, "🧹 清除字段【AI4paper】", "❌ 当前文献无【" + var5599[param1098] + "】字段！", "zoteorif"));
    } else {
      let _0x101992 = Zotero.getActiveZoteroPane().getSelectedItems();
      this._Num_AllSel = _0x101992.length;
      let _0x5a8312 = _0x101992.filter(_0x21eea8 => _0x21eea8.isRegularItem());
      this._Num_Done = 0x0;
      for (let var5606 of _0x5a8312) {
        Zotero.AI4Paper.checkItemField(var5606, param1098) && (var5606.setField(param1098, ''), await var5606.saveTx(), this._Num_Done++);
      }
      this.showProgressWindow(0x1388, "🧹 清除字段【AI4paper】", "您成功清除了【" + this._Num_Done + '\x20of\x20' + this._Num_AllSel + "】篇文献的【" + var5599[param1098] + "】字段内容！", "zoteorif");
    }
  },

  // === Block E: IF Update + Custom Publication Title ===
  'checkItemField': function (param1125, param1126) {
    return Zotero.ItemFields.getFieldIDFromTypeAndBase(param1125.itemTypeID, param1126);
  },
  'updateSelectedItemsIF': function () {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'))) return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    Zotero.debug("AI4Paper: Updating IF for Selected items");
    let var5935 = Zotero.getActiveZoteroPane().getSelectedItems();
    this._Num_AllSel = var5935.length;
    this.updateItemsIF(var5935.filter(_0x1dc876 => _0x1dc876.isRegularItem() && (_0x1dc876.itemType === 'journalArticle' || _0x1dc876.itemType === 'conferencePaper')));
  },
  'updateItemsIF': function (param1127) {
    this._Num_matchJCRIF = 0x0;
    this._Num_matchFenqubiao = 0x0;
    this._Num_matchPKUCORE = 0x0;
    this._Num_matchNJUCORE = 0x0;
    this._Num_matchCSCD = 0x0;
    this._Num_ToDo = param1127.length;
    this._Num_Done = 0x0;
    param1127.forEach(_0x2ec7b4 => this.updateItemIF(_0x2ec7b4));
  },
  'updateItemIF': async function (param1128) {
    let var5936 = param1128.getField("publicationTitle").toLowerCase();
    if (Zotero.Prefs.get("ai4paper.enableCustomPublicationTitle")) {
      let _0x3a5081 = Zotero.AI4Paper.getCustomPublicationTitle(var5936);
      _0x3a5081 && (var5936 = _0x3a5081);
    }
    let var5938 = Zotero.AI4Paper._data_jcr_if[var5936],
      var5939 = Zotero.AI4Paper._data_zjk_fenqu[var5936],
      var5940 = Zotero.AI4Paper._data_modifiedPubTitles[var5936],
      var5941 = Zotero.AI4Paper._data_jcr_if_abbrev[var5936],
      var5942 = Zotero.AI4Paper._data_earlywarning[var5936],
      var5943 = Zotero.AI4Paper._data_pkucore[var5936],
      var5944 = Zotero.AI4Paper._data_njucore[var5936],
      var5945 = Zotero.AI4Paper._data_cscd[var5936],
      var5946 = Zotero.AI4Paper._data_ccf[var5936];
    param1128.itemType === "conferencePaper" && (var5946 = Zotero.AI4Paper._data_ccf[param1128.getField('proceedingsTitle').toLowerCase()]);
    if (var5938 != undefined) {
      let _0x31aed6 = var5938.split('IF')[0x0],
        _0x5e2b1a = var5938.split('IF')[0x1];
      Zotero.Prefs.get("ai4paper.jcrscifenqu") && _0x5e2b1a && _0x5e2b1a != "N/A" && (_0x31aed6 = _0x31aed6 + '\x20(' + _0x5e2b1a + ')');
      param1128.setField("libraryCatalog", _0x31aed6);
      await param1128.saveTx();
      this._Num_matchJCRIF++;
    } else {
      if (var5940 != undefined) {
        let var5949 = Zotero.AI4Paper._data_jcr_if[var5940];
        if (var5949 != undefined) {
          let var5950 = var5949.split('IF')[0x0],
            var5951 = var5949.split('IF')[0x1];
          Zotero.Prefs.get("ai4paper.jcrscifenqu") && var5951 && var5951 != "N/A" && (var5950 = var5950 + '\x20(' + var5951 + ')');
          param1128.setField("libraryCatalog", var5950);
          await param1128.saveTx();
          this._Num_matchJCRIF++;
          var5939 = Zotero.AI4Paper._data_zjk_fenqu[var5940];
        } else {
          if (Zotero.Prefs.get("ai4paper.useZeroForFailedMatch")) {
            param1128.setField("libraryCatalog", 0x0);
            await param1128.saveTx();
          }
        }
      } else {
        if (param1128.getField("ISSN") && Zotero.AI4Paper._data_jcr_if_issn[param1128.getField("ISSN")]) {
          let var5952 = Zotero.AI4Paper._data_jcr_if_issn[param1128.getField("ISSN")],
            var5953 = var5952.split('IF')[0x0],
            var5954 = var5952.split('IF')[0x1];
          Zotero.Prefs.get("ai4paper.jcrscifenqu") && var5954 && var5954 != "N/A" && (var5953 = var5953 + '\x20(' + var5954 + ')');
          param1128.setField('libraryCatalog', var5953);
          await param1128.saveTx();
          this._Num_matchJCRIF++;
          var5939 = Zotero.AI4Paper._data_zjk_fenqu[Zotero.AI4Paper._data_issn_journal[param1128.getField("ISSN")]];
        } else {
          if (var5936.indexOf("the") === 0x0) {
            let var5955 = var5936.substring(0x4),
              var5956 = Zotero.AI4Paper._data_jcr_if[var5955];
            if (var5956 != undefined) {
              let _0x2b310f = var5956.split('IF')[0x0],
                _0x3bb166 = var5956.split('IF')[0x1];
              if (Zotero.Prefs.get("ai4paper.jcrscifenqu") && _0x3bb166 && _0x3bb166 != 'N/A') {
                _0x2b310f = _0x2b310f + '\x20(' + _0x3bb166 + ')';
              }
              param1128.setField("libraryCatalog", _0x2b310f);
              await param1128.saveTx();
              this._Num_matchJCRIF++;
              var5939 = Zotero.AI4Paper._data_zjk_fenqu[var5955];
            } else Zotero.Prefs.get("ai4paper.useZeroForFailedMatch") && (param1128.setField("libraryCatalog", 0x0), await param1128.saveTx());
          } else var5943 != undefined || var5944 != undefined ? (param1128.setField("libraryCatalog", '' + (var5943 ? "北核 " : '') + (var5944 ? '南核' : '')), await param1128.saveTx(), this._Num_matchPKUCORE++) : Zotero.Prefs.get('ai4paper.useZeroForFailedMatch') && (param1128.setField("libraryCatalog", 0x0), await param1128.saveTx());
        }
      }
    }
    if (var5939 != undefined) {
      if (var5946 != undefined) {
        var5939 = var5939 + '\x20(' + var5946 + ')';
      }
      var5942 != undefined && (var5939 = var5939 + '\x20(' + var5942 + ')', param1128.addTag('预警期刊', 0x1));
      param1128.setField("callNumber", var5939);
      await param1128.saveTx();
      this._Num_matchFenqubiao++;
    } else {
      if (var5945 != undefined) {
        param1128.setField("callNumber", var5945);
        await param1128.saveTx();
        this._Num_matchCSCD++;
      } else {
        if (var5946 != undefined) {
          param1128.setField('callNumber', var5946);
          await param1128.saveTx();
        } else Zotero.Prefs.get("ai4paper.useZeroForFailedMatch") && (param1128.setField("callNumber", 0x0), await param1128.saveTx());
      }
    }
    this._Num_Done++;
    this._Num_ToDo === this._Num_Done && this.showProgressWindow(0x1388, "✅ 更新 IF(s)【AI4paper】", '共有【' + this._Num_matchJCRIF + " of " + this._Num_AllSel + "】个条目匹配到【JCR IF】，共有【" + this._Num_matchFenqubiao + " of " + this._Num_AllSel + "】个条目匹配到【中科院分区】，共有【" + this._Num_matchPKUCORE + " of " + this._Num_AllSel + "】个条目匹配到【北大核心或南大核心】！", "zoteorif");
  },
  'getCustomPublicationTitle': function (param1129) {
    if (!param1129 || !Zotero.Prefs.get("ai4paper.customPublicationTitleData") || Zotero.Prefs.get('ai4paper.customPublicationTitleData') === '{}') return false;
    let var5959 = JSON.parse(Zotero.Prefs.get("ai4paper.customPublicationTitleData")),
      var5960 = var5959[param1129];
    if (var5960) return var5960;
  },
  'getCustomJournalAbbr': function (param1130) {
    if (!param1130 || !Zotero.Prefs.get("ai4paper.customJournalAbbrData") || Zotero.Prefs.get("ai4paper.customJournalAbbrData") === '{}') return false;
    let var5961 = JSON.parse(Zotero.Prefs.get("ai4paper.customJournalAbbrData")),
      var5962 = var5961[param1130];
    if (var5962) return var5962;
  },

});
