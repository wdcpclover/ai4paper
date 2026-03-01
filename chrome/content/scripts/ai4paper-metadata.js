// ai4paper-metadata.js - Metadata, templates, YAML, IF, abbreviation module
// Extracted from ai4paper.js (Phase 14)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Metadata Templates, YAML, QN Key, Date Helpers, Collection Names, Item Links ===
  'readMetadataTemplate': function (templateStr, marker) {
    let markerPos = templateStr.indexOf(marker),
      afterMarker = templateStr.substring(markerPos),
      openPos = afterMarker.indexOf("[[["),
      closePos = afterMarker.indexOf("]]]");
    return afterMarker.substring(openPos + 0x3, closePos);
  },
  'itemMetadata': function (item, template) {
    let itemType = Zotero.ItemTypes.getName(item.itemTypeID),
      title = item.getField("title"),
      shortTitle = item.getField("shortTitle"),
      creators = item.getCreators(),
      publicationTitle = item.getField("publicationTitle").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '\u201C').replace(/\n/g, '\x20'),
      journalAbbrev = item.getField("journalAbbreviation").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '\u201C').replace(/\n/g, '\x20'),
      volume = item.getField("volume"),
      issue = item.getField('issue'),
      pages = item.getField('pages'),
      series = item.getField("series"),
      language = item.getField("language"),
      doi = item.getField("DOI"),
      issn = item.getField("ISSN"),
      url = item.getField('url'),
      archive = item.getField('archive'),
      archiveLocation = ('' + item.getField("archiveLocation")).split('\u{1F4CA}')[0x0].trim(),
      libraryCatalog = ('' + item.getField('libraryCatalog')).split('(')[0x0].trim(),
      jcrq = Zotero.AI4Paper.extractJCRQ(item.getField("libraryCatalog")),
      callNumber = item.getField('callNumber'),
      rights = item.getField("rights"),
      extra = item.getField('extra').replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '\u201C').replace(/\n/g, '\x20'),
      proceedingsTitle = item.getField("proceedingsTitle"),
      conferenceName = item.getField('conferenceName'),
      place = item.getField("place"),
      publisher = item.getField("publisher"),
      isbn = item.getField("ISBN"),
      university = item.getField("university"),
      edition = item.getField("edition"),
      country = item.getField('country'),
      issuingAuthority = item.getField("issuingAuthority"),
      patentNumber = item.getField('patentNumber'),
      applicationNumber = item.getField("applicationNumber"),
      priorityNumbers = item.getField('priorityNumbers'),
      issueDate = item.getField("issueDate"),
      bookTitle = item.getField("bookTitle"),
      seriesNumber = item.getField("seriesNumber"),
      numberOfVolumes = item.getField("numberOfVolumes"),
      date = item.getField("date"),
      dateYear = Zotero.AI4Paper.getZoteroDateY(date),
      dateAdded = Zotero.AI4Paper.getDateAdded(item),
      datetimeAdded = Zotero.AI4Paper.getDateTimeAdded(item),
      dateModified = Zotero.AI4Paper.getDateModified(item),
      datetimeModified = Zotero.AI4Paper.getDateTimeModified(item),
      collectionNames = Zotero.AI4Paper.getCollectionNames(item),
      relatedItems = Zotero.AI4Paper.getRelatedItems(item),
      itemLink = Zotero.AI4Paper.getItemZoteroLink(item);
    if (Zotero.Prefs.get('ai4paper.pdflinkhtml')) var pdfLinks = Zotero.AI4Paper.getItemZoteroPDFLinksHTML(item);else {
      var pdfLinks = Zotero.AI4Paper.getItemZoteroPDFLinks(item);
      pdfLinks != '' && (pdfLinks = '\x0a' + pdfLinks);
    }
    if (Zotero.Prefs.get('ai4paper.relatedlongindent')) {
      relatedItems.length > 0x64 && (relatedItems = "\n  - " + relatedItems);
    }
    let creatorNames = [],
      creatorsStr = '';
    if (creators.length > 0x0) {
      if (item.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1) {
        for (let creator of creators) {
          creatorNames.push('' + (Zotero.Prefs.get("ai4paper.creatorsnointernallinks") ? creator.firstName + '\x20' + creator.lastName : '[[' + creator.firstName + '\x20' + creator.lastName + ']]'));
        }
        creatorsStr = creatorNames.join('、\x20');
      } else {
        for (let creator of creators) {
          creatorNames.push('' + (Zotero.Prefs.get("ai4paper.creatorsnointernallinks") ? creator.lastName + creator.firstName : '[[' + creator.lastName + creator.firstName + ']]'));
        }
        creatorsStr = creatorNames.join('、');
      }
    }
    date = Zotero.AI4Paper.getZoteroDate(date);
    let tagsStr = Zotero.AI4Paper.formatSpecialTags(Zotero.AI4Paper.getItemTags(item));
    Zotero.Prefs.get("ai4paper.tagslongindent") && tagsStr.length > 0x64 && (tagsStr = "\n  - " + tagsStr);
    let abstractFormatted = item.getField("abstractNote").replace(/\n/g, '\x0a>'),
      abstractNote = item.getField("abstractNote");
    return Zotero.Prefs.get("ai4paper.exportnotesabstractyaml") && abstractNote != '' && (abstractNote = abstractNote.replace(/\n\n【摘要翻译】/g, "【摘要翻译】").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '\u201C').replace(/\n\n/g, '\x20').replace(/\n/g, '\x20')), template = template.replace(/{{itemType}}/g, itemType), template = template.replace(/{{title}}/g, title), template = template.replace(/{{shortTitle}}/g, shortTitle.replace(/\ /g, '')), template = template.replace(/{{creators}}/g, creatorsStr), template = template.replace(/{{publicationTitle}}/g, '' + (publicationTitle != '' ? '[[' + publicationTitle + ']]' : '')), template = template.replace(/{{journalAbbreviation}}/g, journalAbbrev), template = template.replace(/{{volume}}/g, volume), template = template.replace(/{{issue}}/g, issue), template = template.replace(/{{pages}}/g, pages), template = template.replace(/{{series}}/g, series), template = template.replace(/{{language}}/g, language), template = template.replace(/{{DOI}}/g, '' + (doi != '' ? '[' + doi + ']' + "(https://doi.org/" + doi + ')' : '')), template = template.replace(/{{ISSN}}/g, issn), template = template.replace(/{{url}}/g, '' + (url != '' ? '[' + url + ']' + '(' + url + ')' : '')), template = template.replace(/{{archive}}/g, archive), template = template.replace(/{{archiveLocation}}/g, archiveLocation), template = template.replace(/{{libraryCatalog}}/g, libraryCatalog), template = template.replace(/{{JCRQ}}/g, jcrq), template = template.replace(/{{callNumber}}/g, callNumber), template = template.replace(/{{rights}}/g, rights), template = template.replace(/{{extra}}/g, extra), template = template.replace(/{{proceedingsTitle}}/g, proceedingsTitle), template = template.replace(/{{conferenceName}}/g, conferenceName), template = template.replace(/{{place}}/g, place), template = template.replace(/{{publisher}}/g, publisher), template = template.replace(/{{ISBN}}/g, isbn), template = template.replace(/{{university}}/g, university), template = template.replace(/{{edition}}/g, edition), template = template.replace(/{{country}}/g, country), template = template.replace(/{{issuingAuthority}}/g, issuingAuthority), template = template.replace(/{{patentNumber}}/g, patentNumber), template = template.replace(/{{applicationNumber}}/g, applicationNumber), template = template.replace(/{{priorityNumbers}}/g, priorityNumbers), template = template.replace(/{{issueDate}}/g, issueDate), template = template.replace(/{{bookTitle}}/g, bookTitle), template = template.replace(/{{seriesNumber}}/g, seriesNumber), template = template.replace(/{{numberOfVolumes}}/g, numberOfVolumes), template = template.replace(/{{date}}/g, date), template = template.replace(/{{dateY}}/g, dateYear), template = template.replace(/{{dateAdded}}/g, dateAdded), template = template.replace(/{{datetimeAdded}}/g, datetimeAdded), template = template.replace(/{{dateModified}}/g, dateModified), template = template.replace(/{{datetimeModified}}/g, datetimeModified), template = template.replace(/{{collection}}/g, '' + (collectionNames != '' ? collectionNames : '')), template = template.replace(/{{related}}/g, relatedItems), template = template.replace(/{{qnkey}}/g, Zotero.AI4Paper.getQNKey(item)), template = template.replace(/{{citationKey}}/g, item.getField("citationKey")), template = template.replace(/{{itemLink}}/g, '[My\x20Library](' + itemLink + ')'), template = template.replace(/{{pdfLink}}/g, pdfLinks), template = template.replace(/{{tags}}/g, tagsStr), template = template.replace(/{{abstract}}/g, abstractNote), template = template.replace(/{{abstractFormat}}/g, abstractFormatted), template = template.replace(/{{year}}/g, Zotero.AI4Paper.getYear()), template = template.replace(/{{dateCurrent}}/g, Zotero.AI4Paper.getDate()), template = template.replace(/{{time}}/g, Zotero.AI4Paper.getTime()), template = template.replace(/{{week}}/g, Zotero.AI4Paper.getWeek()), template = template.replace(/{{yearMonth}}/g, Zotero.AI4Paper.getYearMonth()), template = template.replace(/{{dateWeek}}/g, Zotero.AI4Paper.getDateWeek()), template = template.replace(/{{dateTime}}/g, Zotero.AI4Paper.getDateTime()), template = template.replace(/{{dateWeekTime}}/g, Zotero.AI4Paper.getDateWeekTime()), template;
  },
  'extractJCRQ': function (catalogStr) {
    if (!catalogStr) {
      return '';
    }
    if (catalogStr.lastIndexOf(')') != catalogStr.length - 0x1) return '';
    const pattern = /\(([^)]*)\)/,
      match = catalogStr.match(pattern);
    return match ? match[0x1] : '';
  },
  'getZoteroDateY': function (dateStr) {
    return Zotero.Date.strToDate(dateStr).year;
  },
  'getDateAdded': function (item) {
    return Zotero.AI4Paper.formatLocalDateTime(item.getField("dateAdded"), true);
  },
  'getDateTimeAdded': function (item) {
    return Zotero.AI4Paper.formatLocalDateTime(item.getField("dateAdded"), false);
  },
  'getDateModified': function (item) {
    return Zotero.AI4Paper.formatLocalDateTime(item.getField('dateModified'), true);
  },
  'getDateTimeModified': function (item) {
    return Zotero.AI4Paper.formatLocalDateTime(item.getField("dateModified"), false);
  },
  'formatLocalDateTime': function (dateStr, dateOnly) {
    let dateObj = new Date(dateStr),
      tzOffset = dateObj.getTimezoneOffset() * 0xea60,
      localDate = new Date(dateObj.getTime() - tzOffset),
      year = localDate.getFullYear(),
      month = (localDate.getMonth() + 0x1).toString().padStart(0x2, '0'),
      day = localDate.getDate().toString().padStart(0x2, '0'),
      hours = localDate.getHours().toString().padStart(0x2, '0'),
      minutes = localDate.getMinutes().toString().padStart(0x2, '0'),
      seconds = localDate.getSeconds().toString().padStart(0x2, '0');
    return dateOnly ? year + '-' + month + '-' + day : year + '-' + month + '-' + day + '\x20' + hours + ':' + minutes + ':' + seconds;
  },
  'getCollectionNames': function (item) {
    const names = [];
    var collectionIDs = item.getCollections();
    for (let colID of collectionIDs) {
      names.push('[[' + Zotero.Collections.get(colID).name + ']]');
    }
    return names.join('、');
  },
  'getCollectionNames_YAML': function (item) {
    try {
      const names = [];
      var collectionIDs = item.getCollections();
      for (let colID of collectionIDs) {
        names.push(Zotero.Collections.get(colID).name);
      }
      return '[' + names.join(',\x20') + ']';
    } catch (e) {
      return '[]';
    }
  },
  'getRelatedItems': function (item) {
    var relations = item.getRelations()['dc:relation'],
      results = [];
    if (relations) {
      for (let uri of relations) {
        try {
          var relatedID = Zotero.URI.getURIItemID(uri);
          relatedItem = Zotero.Items.get(relatedID);
          relatedItem.isRegularItem() && results.push('[[' + Zotero.AI4Paper.getQNKey(relatedItem) + ']]');
        } catch (e) {}
      }
    }
    return results.length === 0x0 ? '' : results.join('、\x20');
  },
  'getQNKey': function (item) {
    let citationKey = item.getField("citationKey");
    if (Zotero.Prefs.get('ai4paper.useCitationKeyasQNKey') && citationKey) return citationKey;
    let resolvedKey = Zotero.AI4Paper.resolveQNKeyTemplate(item);
    if (resolvedKey && resolvedKey != "invalid QNKeyTemplate" && resolvedKey != "failed to resolve QNKeyTemplate") {
      if (Zotero.Prefs.get("ai4paper.useItemIDAsQNKeySuffix")) return resolvedKey + "_KEY-" + item.key;else {
        return resolvedKey;
      }
    }
    return Zotero.AI4Paper.getQNKeyDefault(item);
  },
  'getQNKeyDefault': function (item) {
    let maxLenZh = 0xa,
      maxLenEn = 0x14,
      title = item.getField('title');
    title = title.replace(/\\/g, '\x20');
    title = title.replace(/\//g, '\x20');
    title = title.replace(/\:/g, '：');
    title = title.replace(/： /g, '：');
    title = title.replace(/\*/g, '\x20');
    title = title.replace(/\?/g, '？');
    title = title.replace(/\"/g, '\u201C');
    title = title.replace(/\</g, '\x20');
    title = title.replace(/\>/g, '\x20');
    title = title.replace(/\|/g, '\x20');
    let authorStr = '',
      yearPrefix = '',
      year = Zotero.Date.strToDate(item.getField("date", false, true)).year;
    yearPrefix = year ? year + '_' : '';
    if (item.getCreators().length != 0x0) {
      let firstName = item.getCreators()[0x0].firstName,
        lastName = item.getCreators()[0x0].lastName;
      if (item.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1) authorStr = lastName ? lastName + '_' : '';else {
        let fullName = '' + lastName + firstName;
        authorStr = lastName ? fullName.substring(0x0, 0x6) + '_' : '';
      }
    }
    if (item.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1) var qnKey = '' + yearPrefix + authorStr + title.substring(0x0, maxLenEn) + "_KEY-" + item.key;else {
      var qnKey = '' + yearPrefix + authorStr + title.substring(0x0, maxLenZh) + "_KEY-" + item.key;
    }
    return qnKey = qnKey.replace(/\//g, '\x20'), qnKey;
  },
  'resolveQNKeyTemplate': function (item) {
    function findDelimiters(str, isClose) {
      const regex = isClose ? /\]\]\]/g : /\[\[\[/g,
        positions = [];
      let match;
      while ((match = regex.exec(str)) !== null) {
        positions.push(match.index);
      }
      return positions;
    }
    let templateStr = Zotero.Prefs.get("ai4paper.qnkeyTemplate").replace(/'/g, '\x22');
    const openPositions = findDelimiters(templateStr, 0x0),
      closePositions = findDelimiters(templateStr, 0x1);
    if (!(openPositions.length === closePositions.length && openPositions.length != 0x0 && closePositions.length != 0x0)) return 'invalid\x20QNKeyTemplate';
    let result = '';
    for (let i = 0x0; i < openPositions.length; i++) {
      try {
        let config = JSON.parse(templateStr.substring(openPositions[i] + 0x3, closePositions[i]).trim());
        if (config.variable) {
          let resolved = Zotero.AI4Paper.resolveVariable(item, config, config.variable);
          resolved && (result = result + resolved);
        }
      } catch (e) {
        return "failed to resolve QNKeyTemplate";
      }
    }
    return result.replace(/\//g, '\x20');
    ;
  },
  'resolveVariable': function (item, config, varName) {
    try {
      if (varName === "firstAuthor") {
        if (item.getCreators().length != 0x0) {
          let authorStr = '',
            firstName = item.getCreators()[0x0].firstName,
            lastName = item.getCreators()[0x0].lastName;
          item.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 ? authorStr = lastName : authorStr = '' + lastName + firstName;
          if (authorStr.trim()) return '' + (config?.["prefix"] || '') + authorStr.trim() + (config?.['suffix'] || '');
        }
      }
      if (varName === 'firstName') {
        if (item.getCreators().length != 0x0) {
          let firstName = item.getCreators()[0x0].firstName;
          if (firstName) return '' + (config?.['prefix'] || '') + firstName + (config?.["suffix"] || '');
        }
      } else {
        if (varName === 'lastName') {
          if (item.getCreators().length != 0x0) {
            let lastName = item.getCreators()[0x0].lastName;
            if (lastName) {
              return '' + (config?.['prefix'] || '') + lastName + (config?.['suffix'] || '');
            }
          }
        } else {
          if (varName === 'year') {
            let year = Zotero.Date.strToDate(item.getField('date', false, true)).year;
            if (year) {
              return '' + (config?.["prefix"] || '') + year + (config?.["suffix"] || '');
            }
          } else {
            if (varName === 'title') {
              let title = item.getField("title");
              if (title.search(/[_\u4e00-\u9fa5]/) === -0x1 && config.truncate_en) {
                title = title.substring(0x0, parseInt(config.truncate_en));
              }
              title.search(/[_\u4e00-\u9fa5]/) != -0x1 && config.truncate_zh && (title = title.substring(0x0, parseInt(config.truncate_zh)));
              title = title.trim().replace(/\\/g, '\x20').replace(/\//g, '\x20').replace(/\:/g, '：').replace(/： /g, '：').replace(/\*/g, '\x20').replace(/\?/g, '？').replace(/\"/g, '\u201C').replace(/\</g, '\x20').replace(/\>/g, '\x20').replace(/\|/g, '\x20');
              if (title) return '' + (config?.['prefix'] || '') + title + (config?.["suffix"] || '');
            } else {
              if (varName === "shortTitle") {
                if (!(config.blockChineseRefs && item.getField("title").search(/[_\u4e00-\u9fa5]/) != -0x1)) {
                  let shortTitle = item.getField("shortTitle");
                  config.truncate && (shortTitle = shortTitle.substring(0x0, parseInt(config.truncate)));
                  shortTitle = shortTitle.trim().replace(/\\/g, '\x20').replace(/\//g, '\x20').replace(/\:/g, '：').replace(/： /g, '：').replace(/\*/g, '\x20').replace(/\?/g, '？').replace(/\"/g, '\u201C').replace(/\</g, '\x20').replace(/\>/g, '\x20').replace(/\|/g, '\x20');
                  if (shortTitle) return '' + (config?.["prefix"] || '') + shortTitle + (config?.["suffix"] || '');
                }
              } else {
                if (varName === 'publicationTitle') {
                  let pubTitle = item.getField("publicationTitle");
                  if (pubTitle) return '' + (config?.["prefix"] || '') + pubTitle + (config?.["suffix"] || '');
                } else {
                  if (varName === 'journalAbbreviation') {
                    let journalAbbrev = item.getField('journalAbbreviation');
                    if (journalAbbrev) {
                      return '' + (config?.["prefix"] || '') + journalAbbrev + (config?.["suffix"] || '');
                    }
                  } else {
                    if (varName === "libraryCatalog") {
                      let catalog = item.getField("libraryCatalog");
                      if (catalog) {
                        return '' + (config?.['prefix'] || '') + catalog + (config?.["suffix"] || '');
                      }
                    } else {
                      if (varName === "callNumber") {
                        let callNum = item.getField("callNumber");
                        if (callNum) return '' + (config?.["prefix"] || '') + callNum + (config?.['suffix'] || '');
                      } else {
                        if (varName === "citationKey") {
                          let citeKey = item.getField("citationKey");
                          if (citeKey) return '' + (config?.["prefix"] || '') + citeKey + (config?.["suffix"] || '');
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
    } catch (e) {
      return false;
    }
    return false;
  },
  'sanitizeFilename': function (filename) {
    let sanitized = filename.replace(/[\\/:*?"<>|]/g, '_');
    sanitized = sanitized.replace(/[\x00-\x1f]/g, '');
    sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');
    const reservedPattern = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
    return reservedPattern.test(sanitized) && (sanitized = '_' + sanitized), sanitized = sanitized.slice(0x0, 0xc8), sanitized || "unnamed";
  },
  'getItemZoteroLink': function (item, wrapBrackets) {
    let library = Zotero.Libraries.get(item.libraryID),
      libraryType = library.libraryType,
      libraryPath;
    if (libraryType === "user") libraryPath = 'library';else {
      if (libraryType === "group") libraryPath = Zotero.URI.getLibraryPath(item.libraryID);else return;
    }
    let zoteroLink = 'zotero://select/' + libraryPath + "/items/" + item.key;
    return wrapBrackets ? '[' + zoteroLink + ']' : zoteroLink;
  },
  'getItemZoteroPDFLinksHTML': function (item) {
    let pdfCount = 0x0,
      attachmentIDs = item.getAttachments();
    var linkItems = [];
    for (let attID of attachmentIDs) {
      let attachment = Zotero.Items.get(attID);
      if (['application/pdf', "text/html", "application/epub+zip"].includes(attachment.attachmentContentType)) {
        if (attachment.attachmentLinkMode === 0x3) continue;
        pdfCount++;
        let pdfLink = Zotero.AI4Paper.getItemPDFLink(attachment);
        pdfLink = "<li><a href=\"" + pdfLink + '\x22>' + attachment.getField("title") + "</a></li>";
        linkItems.push(pdfLink);
      }
    }
    if (linkItems.length === 0x0) return '';
    if (pdfCount === 0x1) {
      for (let attID of attachmentIDs) {
        let attachment = Zotero.Items.get(attID);
        if (["application/pdf", "text/html", "application/epub+zip"].includes(attachment.attachmentContentType)) {
          if (attachment.attachmentLinkMode === 0x3) continue;
          let pdfLink = Zotero.AI4Paper.getItemPDFLink(attachment);
          return '[' + attachment.getField('title') + '](' + pdfLink + ')';
        }
      }
    } else return "<ul>" + linkItems.join('') + '</ul>';
  },
  'getItemZoteroPDFLinksYAML': function (item) {
    try {
      let attachmentIDs = item.getAttachments();
      var links = [];
      for (let attID of attachmentIDs) {
        let attachment = Zotero.Items.get(attID);
        if (["application/pdf", 'text/html', "application/epub+zip"].includes(attachment.attachmentContentType)) {
          if (attachment.attachmentLinkMode === 0x3) {
            continue;
          }
          links.push(Zotero.AI4Paper.getItemPDFLink(attachment));
        }
      }
      return '[' + links.join(',\x20') + ']';
    } catch (e) {
      return '[]';
    }
  },
  'getItemZoteroPDFLinks': function (item) {
    let attachmentIDs = item.getAttachments();
    var links = [];
    for (let attID of attachmentIDs) {
      let attachment = Zotero.Items.get(attID);
      if (['application/pdf', "text/html", 'application/epub+zip'].includes(attachment.attachmentContentType)) {
        if (attachment.attachmentLinkMode === 0x3) continue;
        let pdfLink = Zotero.AI4Paper.getItemPDFLink(attachment);
        pdfLink = " - [" + attachment.getField("title") + '](' + pdfLink + ')';
        links.push(pdfLink);
      }
    }
    return links.join('\x0a');
  },
  'getItemPDFLink': function (attachment) {
    let libraryType = Zotero.Libraries.get(attachment.libraryID).libraryType;
    if (libraryType === 'group') return 'zotero://open-pdf/' + Zotero.URI.getLibraryPath(attachment.libraryID) + "/items/" + attachment.key;else {
      if (libraryType === "user") return "zotero://open-pdf/library/items/" + attachment.key;
    }
    return undefined;
  },
  'getFirstCreator': function (item) {
    let authorStr = '';
    if (item.getCreators().length != 0x0) {
      let firstName = item.getCreators()[0x0].firstName,
        lastName = item.getCreators()[0x0].lastName;
      Zotero.AI4Paper.isChineseText(item.getField("title")) ? authorStr = '' + lastName + firstName || '' : authorStr = lastName || '';
    }
    return authorStr;
  },
  'getJournalAbbreviation': function (item) {
    let journalAbbrev = item.getField('journalAbbreviation');
    if (!journalAbbrev && Zotero.AI4Paper.isChineseText(item.getField("title"))) {
      journalAbbrev = item.getField('publicationTitle');
    }
    return journalAbbrev.replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '\u201C').replace(/\n/g, '\x20');
  },
  'templateVariables': function (item, template) {
    let date = item.getField("date"),
      dateYear = Zotero.AI4Paper.getZoteroDateY(date);
    return date = Zotero.AI4Paper.getZoteroDate(date), template = template.replace(/{{itemType}}/g, Zotero.ItemTypes.getName(item.itemTypeID)), template = template.replace(/{{title}}/g, item.getField('title')), template = template.replace(/{{shortTitle}}/g, item.getField("shortTitle").replace(/\ /g, '')), template = template.replace(/{{date}}/g, date), template = template.replace(/{{dateY}}/g, dateYear), template = template.replace(/{{tags}}/g, Zotero.AI4Paper.getItemTags(item).replace(/🏷️ /g, '')), template = template.replace(/{{collection}}/g, Zotero.AI4Paper.getCollectionNames(item)), template = template.replace(/{{qnkey}}/g, Zotero.AI4Paper.getQNKey(item)), template = template.replace(/{{citationKey}}/g, item.getField("citationKey")), template = template.replace(/{{year}}/g, Zotero.AI4Paper.getYear()), template = template.replace(/{{dateCurrent}}/g, Zotero.AI4Paper.getDate()), template = template.replace(/{{time}}/g, Zotero.AI4Paper.getTime()), template = template.replace(/{{week}}/g, Zotero.AI4Paper.getWeek()), template = template.replace(/{{yearMonth}}/g, Zotero.AI4Paper.getYearMonth()), template = template.replace(/{{dateWeek}}/g, Zotero.AI4Paper.getDateWeek()), template = template.replace(/{{dateTime}}/g, Zotero.AI4Paper.getDateTime()), template = template.replace(/{{dateWeekTime}}/g, Zotero.AI4Paper.getDateWeekTime()), template = template.replace(/{{dateAdded}}/g, Zotero.AI4Paper.getDateAdded(item)), template = template.replace(/{{dateModified}}/g, Zotero.AI4Paper.getDateModified(item)), template;
  },
  'readYAMLTemplate': function (templateStr, marker) {
    let markerPos = templateStr.indexOf(marker),
      afterMarker = templateStr.substring(markerPos),
      openPos = afterMarker.indexOf('[[['),
      closePos = afterMarker.indexOf(']]]'),
      content = afterMarker.substring(openPos + 0x3, closePos);
    return content;
  },
  'yamlTemplate': function (item, template) {
    let itemType = Zotero.ItemTypes.getName(item.itemTypeID),
      title = item.getField('title'),
      shortTitle = item.getField('shortTitle'),
      creatorsYAML = Zotero.AI4Paper.getYAMLProp_creators(item),
      firstCreator = Zotero.AI4Paper.getFirstCreator(item),
      publicationTitle = item.getField("publicationTitle").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '\u201C').replace(/\n/g, '\x20'),
      journalAbbrev = Zotero.AI4Paper.getJournalAbbreviation(item),
      volume = item.getField("volume"),
      issue = item.getField("issue"),
      pages = item.getField('pages'),
      language = item.getField("language"),
      doi = item.getField("DOI"),
      issn = item.getField("ISSN"),
      archive = item.getField("archive"),
      archiveLocation = item.getField("archiveLocation"),
      libraryCatalog = item.getField('libraryCatalog'),
      callNumber = item.getField("callNumber"),
      rights = item.getField("rights"),
      extra = item.getField("extra").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '\u201C').replace(/\n/g, '\x20'),
      proceedingsTitle = item.getField("proceedingsTitle"),
      conferenceName = item.getField("conferenceName"),
      place = item.getField("place"),
      publisher = item.getField("publisher"),
      isbn = item.getField("ISBN"),
      university = item.getField('university'),
      edition = item.getField("edition"),
      country = item.getField("country"),
      issuingAuthority = item.getField("issuingAuthority"),
      patentNumber = item.getField("patentNumber"),
      applicationNumber = item.getField('applicationNumber'),
      priorityNumbers = item.getField('priorityNumbers'),
      issueDate = item.getField('issueDate'),
      date = item.getField("date"),
      dateYear = Zotero.AI4Paper.getZoteroDateY(date),
      dateAdded = Zotero.AI4Paper.getDateAdded(item),
      dateModified = Zotero.AI4Paper.getDateModified(item),
      collectionNamesYAML = Zotero.AI4Paper.getCollectionNames_YAML(item),
      itemLink = Zotero.AI4Paper.getItemZoteroLink(item, true),
      pdfLinksYAML = Zotero.AI4Paper.getItemZoteroPDFLinksYAML(item),
      tagsYAML = Zotero.AI4Paper.getItemTagsYAML(item).replace(/🏷️ /g, '').replace(/\/unread/g, 'unread').replace(/\/Done/g, 'Done').replace(/\/reading/g, "reading"),
      abstractNote = item.getField('abstractNote').replace(/\n\n【摘要翻译】/g, '【摘要翻译】').replace(/\n\n【摘要翻译】/g, "【摘要翻译】").replace(/\:/g, '：').replace(/： /g, '：').replace(/\"/g, '\u201C').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    return date = Zotero.AI4Paper.getZoteroDate(date), template = template.replace(/{{itemType}}/g, itemType), template = template.replace(/{{title}}/g, title), template = template.replace(/{{shortTitle}}/g, shortTitle.replace(/\ /g, '')), template = template.replace(/{{creators}}/g, creatorsYAML), template = template.replace(/{{firstCreator}}/g, firstCreator), template = template.replace(/{{publicationTitle}}/g, publicationTitle), template = template.replace(/{{journalAbbreviation}}/g, journalAbbrev), template = template.replace(/{{volume}}/g, volume), template = template.replace(/{{issue}}/g, issue), template = template.replace(/{{pages}}/g, pages), template = template.replace(/{{language}}/g, language), template = template.replace(/{{DOI}}/g, doi), template = template.replace(/{{ISSN}}/g, issn), template = template.replace(/{{archive}}/g, archive), template = template.replace(/{{archiveLocation}}/g, archiveLocation), template = template.replace(/{{libraryCatalog}}/g, libraryCatalog), template = template.replace(/{{callNumber}}/g, callNumber), template = template.replace(/{{rights}}/g, rights), template = template.replace(/{{extra}}/g, extra), template = template.replace(/{{proceedingsTitle}}/g, proceedingsTitle), template = template.replace(/{{conferenceName}}/g, conferenceName), template = template.replace(/{{place}}/g, place), template = template.replace(/{{publisher}}/g, publisher), template = template.replace(/{{ISBN}}/g, isbn), template = template.replace(/{{university}}/g, university), template = template.replace(/{{edition}}/g, edition), template = template.replace(/{{country}}/g, country), template = template.replace(/{{issuingAuthority}}/g, issuingAuthority), template = template.replace(/{{patentNumber}}/g, patentNumber), template = template.replace(/{{applicationNumber}}/g, applicationNumber), template = template.replace(/{{priorityNumbers}}/g, priorityNumbers), template = template.replace(/{{issueDate}}/g, issueDate), template = template.replace(/{{date}}/g, date), template = template.replace(/{{dateY}}/g, dateYear), template = template.replace(/{{dateAdded}}/g, dateAdded), template = template.replace(/{{dateModified}}/g, dateModified), template = template.replace(/{{collection}}/g, collectionNamesYAML), template = template.replace(/{{qnkey}}/g, Zotero.AI4Paper.getQNKey(item)), template = template.replace(/{{citationKey}}/g, item.getField('citationKey')), template = template.replace(/{{itemLink}}/g, itemLink), template = template.replace(/{{pdfLink}}/g, pdfLinksYAML), template = template.replace(/{{tags}}/g, tagsYAML), template = template.replace(/{{abstract}}/g, abstractNote), template = template.replace(/{{year}}/g, Zotero.AI4Paper.getYear()), template = template.replace(/{{dateCurrent}}/g, Zotero.AI4Paper.getDate()), template = template.replace(/{{time}}/g, Zotero.AI4Paper.getTime()), template = template.replace(/{{week}}/g, Zotero.AI4Paper.getWeek()), template = template.replace(/{{yearMonth}}/g, Zotero.AI4Paper.getYearMonth()), template = template.replace(/{{dateWeek}}/g, Zotero.AI4Paper.getDateWeek()), template = template.replace(/{{dateTime}}/g, Zotero.AI4Paper.getDateTime()), template = template.replace(/{{dateWeekTime}}/g, Zotero.AI4Paper.getDateWeekTime()), template;
  },
  'getYAMLProp_creators': function (item) {
    let creators = item.getCreators(),
      creatorNames = [],
      creatorsStr = '';
    if (creators.length > 0x0) {
      if (item.getField('title').search(/[_\u4e00-\u9fa5]/) === -0x1) {
        for (let creator of creators) {
          creatorNames.push(creator.firstName + '\x20' + creator.lastName);
        }
      } else {
        for (let creator of creators) {
          creatorNames.push('' + creator.lastName + creator.firstName);
        }
      }
      creatorsStr = '[' + creatorNames.join(',\x20') + ']';
    }
    return creatorsStr;
  },

  // === Block B: Metadata Update from Network ===
  'updateSelectedItemsMetadata': async function () {
    var activationHash = Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != activationHash) return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    let selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
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
    if (reader) {
      let itemID = reader.itemID,
        item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
        this._Num_getMetadata = 0x0;
        let doi = item.getField("DOI");
        if (doi === '') {
          return window.alert("您选中的文献缺失 DOI 信息！"), false;
        }
        Zotero.AI4Paper.showProgressWindow(0xdac, "⚖️ 正在更新，请等待... 【AI4paper】", '更新元数据需要一定时间，结果将通过弹窗反馈给您！');
        await this.updateItemMetadata(item, false);
        Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 基础元数据更新结果 【AI4paper】", '有【' + this._Num_getMetadata + "】篇匹配到基础元数据！");
        this._Data_Abstract = null;
        this._Num_getAbstract = 0x0;
        Zotero.Prefs.get("ai4paper.metadataabstract") && (await Zotero.AI4Paper.fetchItemCitations(item), this._Data_Abstract != null && (this._Num_getAbstract++, Zotero.Prefs.get("ai4paper.abstracttransaftermetadata") ? (item.setField("abstractNote", this._Data_Abstract), await item.saveTx(), await Zotero.AI4Paper.translationEngineTask_title_abstract(item, "abstractNote")) : item.getField("abstractNote").indexOf("【摘要翻译】") === -0x1 && (item.setField("abstractNote", this._Data_Abstract), await item.saveTx())), Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 摘要更新结果 【AI4paper】", '有【' + this._Num_getAbstract + "】篇匹配到摘要！"));
      }
    } else {
      var selectedItems = ZoteroPane.getSelectedItems();
      if (selectedItems.length === 0x1 && selectedItems[0x0].getField("DOI") === '') return Zotero.Prefs.get("ai4paper.journalabbreviationlocaldatabasefirst") && (await Zotero.AI4Paper.fetchJournalAbbrLocal(selectedItems[0x0])), window.alert("您选中的文献缺失 DOI 信息！"), false;
      this._Num_getMetadata = 0x0;
      Zotero.AI4Paper.showProgressWindow(0xdac, "⚖️ 正在更新，请等待... 【AI4paper】", "更新元数据需要一定时间，结果将通过弹窗反馈给您！");
      await this.updateItemsMetadata(selectedItems.filter(it => it.isRegularItem()), false);
      Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 元数据更新结果 【AI4paper】", "您选中的 " + selectedItems.length + " 篇文献中，有【" + this._Num_getMetadata + "】篇匹配到元数据！");
      if (Zotero.Prefs.get("ai4paper.metadataabstract")) {
        this._Num_getAbstract = 0x0;
        for (let item of selectedItems) {
          this._Data_Abstract = null;
          await Zotero.AI4Paper.fetchItemCitations(item);
          this._Data_Abstract != null && (this._Num_getAbstract++, Zotero.Prefs.get("ai4paper.abstracttransaftermetadata") ? (item.setField("abstractNote", this._Data_Abstract), await item.saveTx(), await Zotero.AI4Paper.translationEngineTask_title_abstract(item, "abstractNote")) : item.getField("abstractNote").indexOf("【摘要翻译】") === -0x1 && (item.setField("abstractNote", this._Data_Abstract), await item.saveTx()));
        }
        Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 摘要更新结果 【AI4paper】", '有【' + this._Num_getAbstract + "】篇匹配到摘要！");
      }
    }
  },
  'updateItemsMetadata': async function (items, silentMode) {
    if (!Zotero.AI4Paper.runAuthor()) return -0x1;
    for (let item of items) {
      let doi = item.getField("DOI");
      if (doi === '' || item.getField("title").search(/[_\u4e00-\u9fa5]/) != -0x1) continue;
      await this.updateItemMetadata(item, silentMode);
    }
  },
  'updateItemMetadata': async function (item, silentMode) {
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
    let localAbbrDone = false;
    if (!silentMode && Zotero.Prefs.get("ai4paper.journalabbreviationlocaldatabasefirst")) {
      localAbbrDone = await Zotero.AI4Paper.fetchJournalAbbrLocal(item);
    }
    let doi = item.getField("DOI");
    await Zotero.AI4Paper.fetchItemMetadata(doi);
    try {
      if (this._Data_title != null || this._Data_volume != null || this._Data_issue != null || this._Data_page != null || this._Data_date != null || this._Data_publication != null || this._Data_journalAbbreviation != null || this._Data_issn != null || this._Data_language != null || this._Data_url != null || this._Data_firstNames.length > 0x0) {
        if (!silentMode) {
          this._Num_getMetadata++;
        }
        this._Data_title != null && Zotero.Prefs.get("ai4paper.metadatatitle") && (this._Data_title = this._Data_title.replace("&amp;amp;", '&'), this._Data_title = this._Data_title.replace("&amp;", '&'), item.setField("title", this._Data_title), await item.saveTx());
        this._Data_volume != null && Zotero.Prefs.get("ai4paper.metadatavolume") && (item.setField("volume", this._Data_volume), await item.saveTx());
        this._Data_issue != null && Zotero.Prefs.get("ai4paper.metadataissue") && (item.setField("issue", this._Data_issue), await item.saveTx());
        this._Data_page != null && Zotero.Prefs.get("ai4paper.metadatapages") && (item.setField("pages", this._Data_page), await item.saveTx());
        this._Data_date != null && Zotero.Prefs.get("ai4paper.metadatadate") && (this._Data_date = String(this._Data_date).replace(/\,/g, '/'), item.setField("date", this._Data_date), await item.saveTx());
        this._Data_publication != null && typeof this._Data_publication === 'string' && Zotero.Prefs.get("ai4paper.metadatapublication") && (this._Data_publication = this._Data_publication.replace("&amp;amp;", '&'), this._Data_publication = this._Data_publication.replace("&amp;", '&'), item.setField("publicationTitle", this._Data_publication), await item.saveTx());
        if (this._Data_journalAbbreviation != null && Zotero.Prefs.get('ai4paper.metadatajournalabbreviation') && !localAbbrDone) {
          this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace("&amp;amp;", '&');
          this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace("&amp;", '&');
          item.setField("journalAbbreviation", this._Data_journalAbbreviation);
          await item.saveTx();
        }
        this._Data_issn != null && Zotero.Prefs.get("ai4paper.metadataissn") && (item.setField("ISSN", this._Data_issn), await item.saveTx());
        this._Data_language != null && Zotero.Prefs.get('ai4paper.metadatalanguage') && (item.setField("language", this._Data_language), await item.saveTx());
        if (this._Data_url != null && Zotero.Prefs.get("ai4paper.metadataurl")) {
          item.setField("url", this._Data_url);
          await item.saveTx();
        }
        if (this._Data_firstNames.length > 0x0 && Zotero.Prefs.get("ai4paper.metadataauthors")) {
          let creatorsList = [];
          for (i = 0x0; i < this._Data_firstNames.length; i++) {
            if (this._Data_firstNames[i] || this._Data_lastNames[i]) {
              let creatorObj = {
                'firstName': this._Data_firstNames[i],
                'lastName': this._Data_lastNames[i],
                'creatorType': "author"
              };
              creatorsList.push(creatorObj);
            }
          }
          item.setCreators(creatorsList);
          await item.saveTx();
          this._Data_firstNames = [];
          this._Data_lastNames = [];
        }
      }
    } catch (e) {
      Zotero.debug(e);
    }
  },
  'fetchItemMetadata': async function (doi) {
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
    if (!doi) {
      return -0x1;
    }
    if (!Zotero.AI4Paper.showDate()) return -0x1;
    const encodedDOI = encodeURIComponent(doi);
    let cslData = null;
    if (cslData === null) {
      const cslFormat = 'vnd.citationstyles.csl+json',
        transformPath = "transform/application/" + cslFormat,
        crossrefUrl = "https://api.crossref.org/works/" + encodedDOI + '/' + transformPath;
      cslData = await fetch(crossrefUrl).then(r => r.json())["catch"](e => null);
    }
    if (cslData === null) {
      const doiUrl = 'https://doi.org/' + encodedDOI,
        cslFormat = "vnd.citationstyles.csl+json";
      cslData = await fetch(doiUrl, {
        'headers': {
          'Accept': 'application/' + cslFormat
        }
      }).then(r => r.json())['catch'](e => null);
    }
    if (cslData === null) return -0x1;
    try {
      this._Data_itemType = cslData.type;
    } catch (e) {}
    try {
      this._Data_title = cslData.title;
    } catch (e) {}
    try {
      for (i = 0x0; i < cslData.author.length; i++) {
        this._Data_firstNames.push(cslData.author[i].given);
        this._Data_lastNames.push(cslData.author[i].family);
      }
    } catch (e) {}
    try {
      this._Data_volume = cslData.volume;
    } catch (e) {}
    try {
      this._Data_issue = cslData.issue;
    } catch (e) {}
    try {
      this._Data_page = cslData.page;
    } catch (e) {}
    let publishedDate = cslData?.["published-print"]?.["date-parts"];
    publishedDate && (this._Data_date = publishedDate);
    try {
      this._Data_publication = cslData['container-title'];
    } catch (e) {}
    try {
      this._Data_journalAbbreviation = cslData['container-title-short'];
    } catch (e) {}
    try {
      this._Data_issn = cslData.ISSN[0x0];
    } catch (e) {}
    try {
      this._Data_language = cslData.language;
    } catch (e) {}
    try {
      this._Data_url = cslData.resource.primary.URL;
    } catch (e) {}
    try {
      this._Data_publisherLocation = cslData["publisher-location"];
    } catch (e) {}
    try {
      this._Data_publisher = cslData.publisher;
    } catch (e) {}
    try {
      this._Data_isbn = cslData.ISBN[0x1];
    } catch (e) {}
  },
  'fetchMetadataItem': async function (doi, target) {
    target._Data_itemType = null;
    target._Data_title = null;
    target._Data_firstNames = [];
    target._Data_lastNames = [];
    target._Data_volume = null;
    target._Data_issue = null;
    target._Data_page = null;
    target._Data_date = null;
    target._Data_publication = null;
    target._Data_journalAbbreviation = null;
    target._Data_issn = null;
    target._Data_language = null;
    target._Data_url = null;
    target._Data_publisherLocation = null;
    target._Data_publisher = null;
    target._Data_isbn = null;
    if (!doi) return -0x1;
    if (!Zotero.AI4Paper.showDate()) return -0x1;
    const encodedDOI = encodeURIComponent(doi);
    let cslData = null;
    if (cslData === null) {
      const cslFormat = "vnd.citationstyles.csl+json",
        transformPath = "transform/application/" + cslFormat,
        crossrefUrl = "https://api.crossref.org/works/" + encodedDOI + '/' + transformPath;
      cslData = await fetch(crossrefUrl).then(r => r.json())["catch"](e => null);
    }
    if (cslData === null) {
      const doiUrl = "https://doi.org/" + encodedDOI,
        cslFormat = "vnd.citationstyles.csl+json";
      cslData = await fetch(doiUrl, {
        'headers': {
          'Accept': 'application/' + cslFormat
        }
      }).then(r => r.json())["catch"](e => null);
    }
    if (cslData === null) return -0x1;
    try {
      target._Data_itemType = cslData.type;
    } catch (e) {}
    try {
      target._Data_title = cslData.title;
    } catch (e) {}
    try {
      for (i = 0x0; i < cslData.author.length; i++) {
        target._Data_firstNames.push(cslData.author[i].given);
        target._Data_lastNames.push(cslData.author[i].family);
      }
    } catch (e) {}
    try {
      target._Data_volume = cslData.volume;
    } catch (e) {}
    try {
      target._Data_issue = cslData.issue;
    } catch (e) {}
    try {
      target._Data_page = cslData.page;
    } catch (e) {}
    try {
      target._Data_date = cslData["published-print"]["date-parts"];
    } catch (e) {}
    try {
      target._Data_publication = cslData["container-title"];
    } catch (e) {}
    try {
      target._Data_journalAbbreviation = cslData["container-title-short"];
    } catch (e) {}
    try {
      target._Data_issn = cslData.ISSN[0x0];
    } catch (e) {}
    try {
      target._Data_language = cslData.language;
    } catch (e) {}
    try {
      target._Data_url = cslData.resource.primary.URL;
    } catch (e) {}
    try {
      target._Data_publisherLocation = cslData['publisher-location'];
    } catch (e) {}
    try {
      target._Data_publisher = cslData.publisher;
    } catch (e) {}
    try {
      target._Data_isbn = cslData.ISBN[0x1];
    } catch (e) {}
  },

  // === Block C: Journal Abbreviation Update ===
  'updateSelectedItemsAbbreviation': async function () {
    if (Zotero.Prefs.get('ai4paper.activationkeyverifyresult') != Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"))) return window.alert('❌\x20Zotero\x20One\x20尚未激活，请前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20激活】\x20联网激活插件！'), -0x1;
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return false;
    }
    Zotero.debug("AI4Paper: Update Journal Abbreviation for Selected items");
    let selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID,
        item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID), this._Num_Done = 0x0, await Zotero.AI4Paper.fetchItemAbbreviation(item), this.showProgressWindow(0x1388, "匹配期刊简称【AI4paper】", "共有【" + this._Num_Done + "】篇文献匹配到期刊简称！", "zoteorif"));
    } else {
      let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
      this._Num_AllSel = selectedItems.length;
      let regularItems = selectedItems.filter(it => it.isRegularItem());
      this._Num_Done = 0x0;
      for (let item of regularItems) {
        await Zotero.AI4Paper.fetchItemAbbreviation(item);
      }
      this.showProgressWindow(0x1388, '匹配期刊简称【Zotero\x20One】', '共有【' + this._Num_Done + '\x20of\x20' + this._Num_AllSel + "】篇文献匹配到期刊简称", 'zoteorif');
    }
  },
  'fetchItemAbbreviation': async function (item) {
    let pubTitleField = "publicationTitle",
      abbrField = 'journalAbbreviation';
    if (Zotero.AI4Paper.checkItemField(item, pubTitleField)) {
      let pubTitle = item.getField('publicationTitle').toLowerCase();
      if (Zotero.Prefs.get("ai4paper.enableCustomPublicationTitle")) {
        let customTitle = Zotero.AI4Paper.getCustomPublicationTitle(pubTitle);
        customTitle && (pubTitle = customTitle);
      }
      var abbrev = Zotero.AI4Paper._data_full_to_abbrev_dots[pubTitle];
      Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (abbrev = Zotero.AI4Paper._data_full_to_abbrev[pubTitle]);
      if (Zotero.Prefs.get("ai4paper.enableCustomJournalAbbr")) {
        let customAbbrev = Zotero.AI4Paper.getCustomJournalAbbr(pubTitle);
        customAbbrev && (abbrev = customAbbrev);
      }
      let modifiedTitle = Zotero.AI4Paper._data_modifiedPubTitles[pubTitle],
        fullFromAbbrev = Zotero.AI4Paper._data_abbrev_to_full[pubTitle];
      if (abbrev != undefined) {
        item.setField(abbrField, abbrev);
        await item.saveTx();
        this._Num_Done++;
      } else {
        if (modifiedTitle != undefined) {
          abbrev = Zotero.AI4Paper._data_full_to_abbrev_dots[modifiedTitle];
          if (Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式") {
            abbrev = Zotero.AI4Paper._data_full_to_abbrev[modifiedTitle];
          }
          if (abbrev != undefined) {
            item.setField(abbrField, abbrev);
            await item.saveTx();
            this._Num_Done++;
          }
        } else {
          if (fullFromAbbrev != undefined) {
            abbrev = Zotero.AI4Paper._data_full_to_abbrev_dots[fullFromAbbrev];
            Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (abbrev = Zotero.AI4Paper._data_full_to_abbrev[fullFromAbbrev]);
            abbrev != undefined && (item.setField(abbrField, abbrev), await item.saveTx(), this._Num_Done++);
          } else {
            if (pubTitle.indexOf("the") === 0x0) {
              let titleWithoutThe = pubTitle.substring(0x4);
              abbrev = Zotero.AI4Paper._data_full_to_abbrev_dots[titleWithoutThe];
              if (Zotero.Prefs.get('ai4paper.journalabbreviationstyle') === "不带点格式") {
                abbrev = Zotero.AI4Paper._data_full_to_abbrev[titleWithoutThe];
              }
              abbrev != undefined && (item.setField(abbrField, abbrev), await item.saveTx(), this._Num_Done++);
            }
          }
        }
      }
    }
  },
  'fetchJournalAbbrLocal': async function (item) {
    let pubTitleField = 'publicationTitle',
      abbrField = "journalAbbreviation";
    if (Zotero.AI4Paper.checkItemField(item, pubTitleField)) {
      let pubTitle = item.getField("publicationTitle").toLowerCase();
      if (Zotero.Prefs.get("ai4paper.enableCustomPublicationTitle")) {
        let customTitle = Zotero.AI4Paper.getCustomPublicationTitle(pubTitle);
        customTitle && (pubTitle = customTitle);
      }
      var abbrev = Zotero.AI4Paper._data_full_to_abbrev_dots[pubTitle];
      Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (abbrev = Zotero.AI4Paper._data_full_to_abbrev[pubTitle]);
      if (Zotero.Prefs.get("ai4paper.enableCustomJournalAbbr")) {
        let customAbbrev = Zotero.AI4Paper.getCustomJournalAbbr(pubTitle);
        if (customAbbrev) {
          abbrev = customAbbrev;
        }
      }
      let modifiedTitle = Zotero.AI4Paper._data_modifiedPubTitles[pubTitle],
        fullFromAbbrev = Zotero.AI4Paper._data_abbrev_to_full[pubTitle];
      if (abbrev != undefined) return item.setField(abbrField, abbrev), await item.saveTx(), true;else {
        if (modifiedTitle != undefined) {
          abbrev = Zotero.AI4Paper._data_full_to_abbrev_dots[modifiedTitle];
          Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (abbrev = Zotero.AI4Paper._data_full_to_abbrev[modifiedTitle]);
          if (abbrev != undefined) {
            return item.setField(abbrField, abbrev), await item.saveTx(), true;
          }
        } else {
          if (fullFromAbbrev != undefined) {
            abbrev = Zotero.AI4Paper._data_full_to_abbrev_dots[fullFromAbbrev];
            Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (abbrev = Zotero.AI4Paper._data_full_to_abbrev[fullFromAbbrev]);
            if (abbrev != undefined) return item.setField(abbrField, abbrev), await item.saveTx(), true;
          } else {
            if (pubTitle.indexOf("the") === 0x0) {
              let titleWithoutThe = pubTitle.substring(0x4);
              abbrev = Zotero.AI4Paper._data_full_to_abbrev_dots[titleWithoutThe];
              Zotero.Prefs.get("ai4paper.journalabbreviationstyle") === "不带点格式" && (abbrev = Zotero.AI4Paper._data_full_to_abbrev[titleWithoutThe]);
              if (abbrev != undefined) return item.setField(abbrField, abbrev), await item.saveTx(), true;
            }
          }
        }
      }
    }
    return false;
  },

  // === Block D: Clear Field ===
  'clearField': async function (fieldName) {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'))) {
      return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    }
    if (!Zotero.AI4Paper.getFunMetaTitle()) {
      return false;
    }
    Zotero.debug("AI4paper: clear field for selected items");
    let isChinese = false;
    Zotero.locale === 'zh-CN' && (isChinese = true);
    let fieldLabels = {
        'extra': !isChinese ? "extra" : '其他',
        'rights': !isChinese ? 'rights' : '版权',
        'callNumber': !isChinese ? "callNumber" : "索书号",
        'libraryCatalog': !isChinese ? 'libraryCatalog' : "文库编目",
        'archiveLocation': !isChinese ? "archiveLocation" : "存档位置",
        'archive': !isChinese ? 'archive' : '档案',
        'shortTitle': !isChinese ? "shortTitle" : '短标题'
      },
      selectedTabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(selectedTabID);
    if (reader) {
      let itemID = reader.itemID,
        item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID), Zotero.AI4Paper.checkItemField(item, fieldName) ? (item.setField(fieldName, ''), await item.saveTx(), this.showProgressWindow(0x1388, "🧹 清除字段【AI4paper】", "您成功清楚当前文献的【" + fieldLabels[fieldName] + "】字段内容！", 'zoteorif')) : this.showProgressWindow(0x1388, "🧹 清除字段【AI4paper】", "❌ 当前文献无【" + fieldLabels[fieldName] + "】字段！", "zoteorif"));
    } else {
      let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
      this._Num_AllSel = selectedItems.length;
      let regularItems = selectedItems.filter(it => it.isRegularItem());
      this._Num_Done = 0x0;
      for (let item of regularItems) {
        Zotero.AI4Paper.checkItemField(item, fieldName) && (item.setField(fieldName, ''), await item.saveTx(), this._Num_Done++);
      }
      this.showProgressWindow(0x1388, "🧹 清除字段【AI4paper】", "您成功清除了【" + this._Num_Done + '\x20of\x20' + this._Num_AllSel + "】篇文献的【" + fieldLabels[fieldName] + "】字段内容！", "zoteorif");
    }
  },

  // === Block E: IF Update + Custom Publication Title ===
  'checkItemField': function (item, fieldName) {
    return Zotero.ItemFields.getFieldIDFromTypeAndBase(item.itemTypeID, fieldName);
  },
  'updateSelectedItemsIF': function () {
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'))) return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    if (!Zotero.AI4Paper.getFunMetaTitle()) return false;
    Zotero.debug("AI4Paper: Updating IF for Selected items");
    let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
    this._Num_AllSel = selectedItems.length;
    this.updateItemsIF(selectedItems.filter(it => it.isRegularItem() && (it.itemType === 'journalArticle' || it.itemType === 'conferencePaper')));
  },
  'updateItemsIF': function (items) {
    this._Num_matchJCRIF = 0x0;
    this._Num_matchFenqubiao = 0x0;
    this._Num_matchPKUCORE = 0x0;
    this._Num_matchNJUCORE = 0x0;
    this._Num_matchCSCD = 0x0;
    this._Num_ToDo = items.length;
    this._Num_Done = 0x0;
    items.forEach(it => this.updateItemIF(it));
  },
  'updateItemIF': async function (item) {
    let pubTitle = item.getField("publicationTitle").toLowerCase();
    if (Zotero.Prefs.get("ai4paper.enableCustomPublicationTitle")) {
      let customTitle = Zotero.AI4Paper.getCustomPublicationTitle(pubTitle);
      customTitle && (pubTitle = customTitle);
    }
    let jcrIF = Zotero.AI4Paper._data_jcr_if[pubTitle],
      fenquData = Zotero.AI4Paper._data_zjk_fenqu[pubTitle],
      modifiedTitle = Zotero.AI4Paper._data_modifiedPubTitles[pubTitle],
      jcrIFAbbrev = Zotero.AI4Paper._data_jcr_if_abbrev[pubTitle],
      earlyWarning = Zotero.AI4Paper._data_earlywarning[pubTitle],
      pkuCore = Zotero.AI4Paper._data_pkucore[pubTitle],
      njuCore = Zotero.AI4Paper._data_njucore[pubTitle],
      cscdData = Zotero.AI4Paper._data_cscd[pubTitle],
      ccfRank = Zotero.AI4Paper._data_ccf[pubTitle];
    item.itemType === "conferencePaper" && (ccfRank = Zotero.AI4Paper._data_ccf[item.getField('proceedingsTitle').toLowerCase()]);
    if (jcrIF != undefined) {
      let ifValue = jcrIF.split('IF')[0x0],
        sciPartition = jcrIF.split('IF')[0x1];
      Zotero.Prefs.get("ai4paper.jcrscifenqu") && sciPartition && sciPartition != "N/A" && (ifValue = ifValue + '\x20(' + sciPartition + ')');
      item.setField("libraryCatalog", ifValue);
      await item.saveTx();
      this._Num_matchJCRIF++;
    } else {
      if (modifiedTitle != undefined) {
        let modifiedIF = Zotero.AI4Paper._data_jcr_if[modifiedTitle];
        if (modifiedIF != undefined) {
          let ifValue = modifiedIF.split('IF')[0x0],
            sciPartition = modifiedIF.split('IF')[0x1];
          Zotero.Prefs.get("ai4paper.jcrscifenqu") && sciPartition && sciPartition != "N/A" && (ifValue = ifValue + '\x20(' + sciPartition + ')');
          item.setField("libraryCatalog", ifValue);
          await item.saveTx();
          this._Num_matchJCRIF++;
          fenquData = Zotero.AI4Paper._data_zjk_fenqu[modifiedTitle];
        } else {
          if (Zotero.Prefs.get("ai4paper.useZeroForFailedMatch")) {
            item.setField("libraryCatalog", 0x0);
            await item.saveTx();
          }
        }
      } else {
        if (item.getField("ISSN") && Zotero.AI4Paper._data_jcr_if_issn[item.getField("ISSN")]) {
          let issnIF = Zotero.AI4Paper._data_jcr_if_issn[item.getField("ISSN")],
            ifValue = issnIF.split('IF')[0x0],
            sciPartition = issnIF.split('IF')[0x1];
          Zotero.Prefs.get("ai4paper.jcrscifenqu") && sciPartition && sciPartition != "N/A" && (ifValue = ifValue + '\x20(' + sciPartition + ')');
          item.setField('libraryCatalog', ifValue);
          await item.saveTx();
          this._Num_matchJCRIF++;
          fenquData = Zotero.AI4Paper._data_zjk_fenqu[Zotero.AI4Paper._data_issn_journal[item.getField("ISSN")]];
        } else {
          if (pubTitle.indexOf("the") === 0x0) {
            let titleWithoutThe = pubTitle.substring(0x4),
              theIF = Zotero.AI4Paper._data_jcr_if[titleWithoutThe];
            if (theIF != undefined) {
              let ifValue = theIF.split('IF')[0x0],
                sciPartition = theIF.split('IF')[0x1];
              if (Zotero.Prefs.get("ai4paper.jcrscifenqu") && sciPartition && sciPartition != 'N/A') {
                ifValue = ifValue + '\x20(' + sciPartition + ')';
              }
              item.setField("libraryCatalog", ifValue);
              await item.saveTx();
              this._Num_matchJCRIF++;
              fenquData = Zotero.AI4Paper._data_zjk_fenqu[titleWithoutThe];
            } else Zotero.Prefs.get("ai4paper.useZeroForFailedMatch") && (item.setField("libraryCatalog", 0x0), await item.saveTx());
          } else pkuCore != undefined || njuCore != undefined ? (item.setField("libraryCatalog", '' + (pkuCore ? "北核 " : '') + (njuCore ? '南核' : '')), await item.saveTx(), this._Num_matchPKUCORE++) : Zotero.Prefs.get('ai4paper.useZeroForFailedMatch') && (item.setField("libraryCatalog", 0x0), await item.saveTx());
        }
      }
    }
    if (fenquData != undefined) {
      if (ccfRank != undefined) {
        fenquData = fenquData + '\x20(' + ccfRank + ')';
      }
      earlyWarning != undefined && (fenquData = fenquData + '\x20(' + earlyWarning + ')', item.addTag('预警期刊', 0x1));
      item.setField("callNumber", fenquData);
      await item.saveTx();
      this._Num_matchFenqubiao++;
    } else {
      if (cscdData != undefined) {
        item.setField("callNumber", cscdData);
        await item.saveTx();
        this._Num_matchCSCD++;
      } else {
        if (ccfRank != undefined) {
          item.setField('callNumber', ccfRank);
          await item.saveTx();
        } else Zotero.Prefs.get("ai4paper.useZeroForFailedMatch") && (item.setField("callNumber", 0x0), await item.saveTx());
      }
    }
    this._Num_Done++;
    this._Num_ToDo === this._Num_Done && this.showProgressWindow(0x1388, "✅ 更新 IF(s)【AI4paper】", '共有【' + this._Num_matchJCRIF + " of " + this._Num_AllSel + "】个条目匹配到【JCR IF】，共有【" + this._Num_matchFenqubiao + " of " + this._Num_AllSel + "】个条目匹配到【中科院分区】，共有【" + this._Num_matchPKUCORE + " of " + this._Num_AllSel + "】个条目匹配到【北大核心或南大核心】！", "zoteorif");
  },
  'getCustomPublicationTitle': function (pubTitle) {
    if (!pubTitle || !Zotero.Prefs.get("ai4paper.customPublicationTitleData") || Zotero.Prefs.get('ai4paper.customPublicationTitleData') === '{}') return false;
    let customData = JSON.parse(Zotero.Prefs.get("ai4paper.customPublicationTitleData")),
      mappedTitle = customData[pubTitle];
    if (mappedTitle) return mappedTitle;
  },
  'getCustomJournalAbbr': function (pubTitle) {
    if (!pubTitle || !Zotero.Prefs.get("ai4paper.customJournalAbbrData") || Zotero.Prefs.get("ai4paper.customJournalAbbrData") === '{}') return false;
    let customData = JSON.parse(Zotero.Prefs.get("ai4paper.customJournalAbbrData")),
      mappedAbbrev = customData[pubTitle];
    if (mappedAbbrev) return mappedAbbrev;
  },

});
