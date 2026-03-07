// ai4paper-metadata.js - Metadata, templates, YAML, IF, abbreviation module
// Extracted from ai4paper.js (Phase 14)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Metadata Templates, YAML, QN Key, Date Helpers, Collection Names, Item Links ===
  'readMetadataTemplate': function (templateStr, marker) {
    return AI4PaperMetadataCore.readMetadataTemplate(templateStr, marker);
  },
  'itemMetadata': function (item, template) {
    let itemType = Zotero.ItemTypes.getName(item.itemTypeID),
      title = item.getField("title"),
      shortTitle = item.getField("shortTitle"),
      creators = item.getCreators(),
      publicationTitle = AI4PaperMetadataCore.normalizeInlineMetadataText(item.getField("publicationTitle")),
      journalAbbrev = AI4PaperMetadataCore.normalizeInlineMetadataText(item.getField("journalAbbreviation")),
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
      extra = AI4PaperMetadataCore.normalizeInlineMetadataText(item.getField('extra')),
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
    return AI4PaperMetadataCore.applyMetadataTemplate(template, {
      itemType: itemType,
      title: title,
      shortTitle: shortTitle,
      creators: creators,
      creatorsNoInternalLinks: Zotero.Prefs.get("ai4paper.creatorsnointernallinks"),
      publicationTitle: publicationTitle,
      journalAbbreviation: journalAbbrev,
      volume: volume,
      issue: issue,
      pages: pages,
      series: series,
      language: language,
      doi: doi,
      issn: issn,
      url: url,
      archive: archive,
      archiveLocation: archiveLocation,
      libraryCatalog: libraryCatalog,
      jcrq: jcrq,
      callNumber: callNumber,
      rights: rights,
      extra: extra,
      proceedingsTitle: proceedingsTitle,
      conferenceName: conferenceName,
      place: place,
      publisher: publisher,
      isbn: isbn,
      university: university,
      edition: edition,
      country: country,
      issuingAuthority: issuingAuthority,
      patentNumber: patentNumber,
      applicationNumber: applicationNumber,
      priorityNumbers: priorityNumbers,
      issueDate: issueDate,
      bookTitle: bookTitle,
      seriesNumber: seriesNumber,
      numberOfVolumes: numberOfVolumes,
      date: date,
      dateYear: dateYear,
      dateAdded: dateAdded,
      datetimeAdded: datetimeAdded,
      dateModified: dateModified,
      datetimeModified: datetimeModified,
      collectionNames: collectionNames != '' ? collectionNames : '',
      relatedItems: relatedItems,
      qnkey: Zotero.AI4Paper.getQNKey(item),
      citationKey: item.getField("citationKey"),
      itemLink: itemLink,
      pdfLinks: pdfLinks,
      tags: tagsStr,
      abstractNote: item.getField("abstractNote"),
      exportAbstractYaml: Zotero.Prefs.get("ai4paper.exportnotesabstractyaml"),
      currentYear: Zotero.AI4Paper.getYear(),
      currentDate: Zotero.AI4Paper.getDate(),
      currentTime: Zotero.AI4Paper.getTime(),
      currentWeek: Zotero.AI4Paper.getWeek(),
      currentYearMonth: Zotero.AI4Paper.getYearMonth(),
      currentDateWeek: Zotero.AI4Paper.getDateWeek(),
      currentDateTime: Zotero.AI4Paper.getDateTime(),
      currentDateWeekTime: Zotero.AI4Paper.getDateWeekTime()
    });
  },
  'extractJCRQ': function (catalogStr) {
    return AI4PaperMetadataCore.extractJCRQ(catalogStr);
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
    return AI4PaperMetadataCore.formatLocalDateTime(dateStr, dateOnly);
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
    let creators = item.getCreators(),
      firstCreator = creators.length ? creators[0x0] : {};
    return AI4PaperMetadataCore.buildDefaultQNKey({
      title: item.getField('title'),
      firstName: firstCreator.firstName,
      lastName: firstCreator.lastName,
      year: Zotero.Date.strToDate(item.getField("date", false, true)).year,
      itemKey: item.key
    });
  },
  'resolveQNKeyTemplate': function (item) {
    let creators = item.getCreators(),
      firstCreator = creators.length ? creators[0x0] : {};
    return AI4PaperMetadataCore.resolveQNKeyTemplate(Zotero.Prefs.get("ai4paper.qnkeyTemplate"), {
      title: item.getField("title"),
      shortTitle: item.getField("shortTitle"),
      publicationTitle: item.getField("publicationTitle"),
      journalAbbreviation: item.getField("journalAbbreviation"),
      libraryCatalog: item.getField("libraryCatalog"),
      callNumber: item.getField("callNumber"),
      citationKey: item.getField("citationKey"),
      year: Zotero.Date.strToDate(item.getField("date", false, true)).year,
      firstName: firstCreator.firstName,
      lastName: firstCreator.lastName
    });
  },
  'resolveVariable': function (item, config, varName) {
    let creators = item.getCreators(),
      firstCreator = creators.length ? creators[0x0] : {};
    return AI4PaperMetadataCore.resolveQNKeyVariable({
      title: item.getField("title"),
      shortTitle: item.getField("shortTitle"),
      publicationTitle: item.getField("publicationTitle"),
      journalAbbreviation: item.getField("journalAbbreviation"),
      libraryCatalog: item.getField("libraryCatalog"),
      callNumber: item.getField("callNumber"),
      citationKey: item.getField("citationKey"),
      year: Zotero.Date.strToDate(item.getField("date", false, true)).year,
      firstName: firstCreator.firstName,
      lastName: firstCreator.lastName
    }, config, varName);
  },
  'sanitizeFilename': function (filename) {
    return AI4PaperMetadataCore.sanitizeFilename(filename);
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
    let creators = item.getCreators(),
      firstCreator = creators.length ? creators[0x0] : null;
    return AI4PaperMetadataCore.formatFirstCreator(item.getField("title"), firstCreator);
  },
  'getJournalAbbreviation': function (item) {
    return AI4PaperMetadataCore.getNormalizedJournalAbbreviation(item.getField("title"), item.getField('journalAbbreviation'), item.getField('publicationTitle'));
  },
  'templateVariables': function (item, template) {
    let date = item.getField("date"),
      dateYear = Zotero.AI4Paper.getZoteroDateY(date);
    date = Zotero.AI4Paper.getZoteroDate(date);
    return AI4PaperMetadataCore.applySimpleTemplate(template, {
      itemType: Zotero.ItemTypes.getName(item.itemTypeID),
      title: item.getField('title'),
      shortTitle: item.getField("shortTitle"),
      date: date,
      dateYear: dateYear,
      tags: Zotero.AI4Paper.getItemTags(item).replace(/🏷️ /g, ''),
      collectionNames: Zotero.AI4Paper.getCollectionNames(item),
      qnkey: Zotero.AI4Paper.getQNKey(item),
      citationKey: item.getField("citationKey"),
      dateAdded: Zotero.AI4Paper.getDateAdded(item),
      dateModified: Zotero.AI4Paper.getDateModified(item),
      currentYear: Zotero.AI4Paper.getYear(),
      currentDate: Zotero.AI4Paper.getDate(),
      currentTime: Zotero.AI4Paper.getTime(),
      currentWeek: Zotero.AI4Paper.getWeek(),
      currentYearMonth: Zotero.AI4Paper.getYearMonth(),
      currentDateWeek: Zotero.AI4Paper.getDateWeek(),
      currentDateTime: Zotero.AI4Paper.getDateTime(),
      currentDateWeekTime: Zotero.AI4Paper.getDateWeekTime()
    });
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
      abstractNote = AI4PaperMetadataCore.normalizeYamlAbstractText(item.getField('abstractNote'));
    date = Zotero.AI4Paper.getZoteroDate(date);
    return AI4PaperMetadataCore.applyYamlTemplate(template, {
      itemType: itemType,
      title: title,
      shortTitle: shortTitle,
      creatorsYaml: creatorsYAML,
      firstCreator: firstCreator,
      publicationTitle: publicationTitle,
      journalAbbreviation: journalAbbrev,
      volume: volume,
      issue: issue,
      pages: pages,
      language: language,
      doi: doi,
      issn: issn,
      archive: archive,
      archiveLocation: archiveLocation,
      libraryCatalog: libraryCatalog,
      callNumber: callNumber,
      rights: rights,
      extra: extra,
      proceedingsTitle: proceedingsTitle,
      conferenceName: conferenceName,
      place: place,
      publisher: publisher,
      isbn: isbn,
      university: university,
      edition: edition,
      country: country,
      issuingAuthority: issuingAuthority,
      patentNumber: patentNumber,
      applicationNumber: applicationNumber,
      priorityNumbers: priorityNumbers,
      issueDate: issueDate,
      date: date,
      dateYear: dateYear,
      dateAdded: dateAdded,
      dateModified: dateModified,
      collectionNamesYaml: collectionNamesYAML,
      qnkey: Zotero.AI4Paper.getQNKey(item),
      citationKey: item.getField('citationKey'),
      itemLink: itemLink,
      pdfLinksYaml: pdfLinksYAML,
      tagsYaml: tagsYAML,
      abstractNote: abstractNote,
      currentYear: Zotero.AI4Paper.getYear(),
      currentDate: Zotero.AI4Paper.getDate(),
      currentTime: Zotero.AI4Paper.getTime(),
      currentWeek: Zotero.AI4Paper.getWeek(),
      currentYearMonth: Zotero.AI4Paper.getYearMonth(),
      currentDateWeek: Zotero.AI4Paper.getDateWeek(),
      currentDateTime: Zotero.AI4Paper.getDateTime(),
      currentDateWeekTime: Zotero.AI4Paper.getDateWeekTime()
    });
  },
  'getYAMLProp_creators': function (item) {
    return AI4PaperMetadataCore.formatYamlCreators(item.getField('title'), item.getCreators());
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
      const updatePlan = AI4PaperMetadataCore.buildMetadataUpdatePlan(this, {
        title: Zotero.Prefs.get("ai4paper.metadatatitle"),
        volume: Zotero.Prefs.get("ai4paper.metadatavolume"),
        issue: Zotero.Prefs.get("ai4paper.metadataissue"),
        pages: Zotero.Prefs.get("ai4paper.metadatapages"),
        date: Zotero.Prefs.get("ai4paper.metadatadate"),
        publication: Zotero.Prefs.get("ai4paper.metadatapublication"),
        journalAbbreviation: Zotero.Prefs.get("ai4paper.metadatajournalabbreviation"),
        issn: Zotero.Prefs.get("ai4paper.metadataissn"),
        language: Zotero.Prefs.get('ai4paper.metadatalanguage'),
        url: Zotero.Prefs.get("ai4paper.metadataurl"),
        authors: Zotero.Prefs.get("ai4paper.metadataauthors")
      }, {
        localAbbrDone: localAbbrDone
      });
      if (updatePlan.hasAnyData) {
        if (!silentMode) {
          this._Num_getMetadata++;
        }
        for (let update of updatePlan.fieldUpdates) {
          item.setField(update.field, update.value);
          await item.saveTx();
        }
        if (updatePlan.creatorUpdates.length > 0x0) {
          item.setCreators(updatePlan.creatorUpdates);
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
    AI4PaperMetadataCore.resetMetadataTarget(this);
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
    AI4PaperMetadataCore.applyCslData(this, cslData);
  },
  'fetchMetadataItem': async function (doi, target) {
    AI4PaperMetadataCore.resetMetadataTarget(target);
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
    AI4PaperMetadataCore.applyCslData(target, cslData);
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
  'normalizeJournalLookupKey': function (journalName) {
    let normalized = String(journalName || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (normalized.indexOf('the ') === 0x0) {
      normalized = normalized.substring(0x4);
    }
    return normalized;
  },
  'getCompactJournalRankingRecord': function (journalName, issn, eissn) {
    let compactByKey = Zotero.AI4Paper._data_journal_ranking_compact || {},
      compactByISSN = Zotero.AI4Paper._data_journal_ranking_compact_issn || {},
      compactByEISSN = Zotero.AI4Paper._data_journal_ranking_compact_eissn || {};
    let normalizedISSN = String(issn || '').trim(),
      normalizedEISSN = String(eissn || '').trim();
    if (normalizedISSN && compactByISSN[normalizedISSN]) {
      return compactByKey[compactByISSN[normalizedISSN]] || null;
    }
    if (normalizedEISSN && compactByEISSN[normalizedEISSN]) {
      return compactByKey[compactByEISSN[normalizedEISSN]] || null;
    }
    let normalizedTitle = Zotero.AI4Paper.normalizeJournalLookupKey(journalName);
    if (!normalizedTitle) return null;
    if (compactByKey[normalizedTitle]) {
      return compactByKey[normalizedTitle];
    }
    let fullName = Zotero.AI4Paper._data_abbrev_to_full_dots[normalizedTitle];
    if (fullName) {
      let normalizedFullName = Zotero.AI4Paper.normalizeJournalLookupKey(fullName);
      if (compactByKey[normalizedFullName]) {
        return compactByKey[normalizedFullName];
      }
    }
    let modifiedTitle = Zotero.AI4Paper._data_modifiedPubTitles[normalizedTitle];
    if (modifiedTitle) {
      let normalizedModifiedTitle = Zotero.AI4Paper.normalizeJournalLookupKey(modifiedTitle);
      if (compactByKey[normalizedModifiedTitle]) {
        return compactByKey[normalizedModifiedTitle];
      }
    }
    return null;
  },
  'getCompactJournalRankingSummary': function (item) {
    try {
      let journalName = item.getField("publicationTitle"),
        issn = item.getField("ISSN"),
        rankingRecord = Zotero.AI4Paper.getCompactJournalRankingRecord(journalName, issn, '');
      if (!rankingRecord && item.itemType === "conferencePaper") {
        rankingRecord = Zotero.AI4Paper.getCompactJournalRankingRecord(item.getField("proceedingsTitle"), issn, '');
      }
      if (!rankingRecord) {
        let fallbackParts = [];
        let libraryCatalog = String(item.getField("libraryCatalog") || '').trim(),
          callNumber = String(item.getField("callNumber") || '').trim();
        libraryCatalog && libraryCatalog !== '0' && fallbackParts.push(libraryCatalog);
        callNumber && callNumber !== '0' && fallbackParts.push(callNumber);
        return fallbackParts.join(' · ');
      }
      let parts = [];
      if (rankingRecord.indexed_science) {
        parts.push("SCIE");
      }
      if (rankingRecord.indexed_ssci) {
        parts.push("SSCI");
      }
      rankingRecord.jcr_quartile && parts.push("JCR " + rankingRecord.jcr_quartile);
      if (rankingRecord.cas_zone != null && rankingRecord.cas_zone !== '') {
        parts.push("中科院" + rankingRecord.cas_zone + '区' + (rankingRecord.cas_top ? ' Top' : ''));
      }
      rankingRecord.impact_factor != null && rankingRecord.impact_factor !== '' && parts.push("IF " + rankingRecord.impact_factor);
      return parts.join(' · ');
    } catch (e) {
      return '';
    }
  },
  'getCompactJournalRankingBadgeTexts': function (item) {
    try {
      let journalName = item.getField("publicationTitle"),
        issn = item.getField("ISSN"),
        rankingRecord = Zotero.AI4Paper.getCompactJournalRankingRecord(journalName, issn, '');
      if (!rankingRecord && item.itemType === "conferencePaper") {
        rankingRecord = Zotero.AI4Paper.getCompactJournalRankingRecord(item.getField("proceedingsTitle"), issn, '');
      }
      if (!rankingRecord) return [];
      let badges = [];
      rankingRecord.indexed_science && badges.push("SCIE");
      rankingRecord.indexed_ssci && badges.push("SSCI");
      rankingRecord.jcr_quartile && badges.push("JCR " + rankingRecord.jcr_quartile);
      if (rankingRecord.cas_zone != null && rankingRecord.cas_zone !== '') {
        badges.push("中科院" + rankingRecord.cas_zone + '区' + (rankingRecord.cas_top ? ' Top' : ''));
      }
      rankingRecord.impact_factor != null && rankingRecord.impact_factor !== '' && badges.push("IF " + rankingRecord.impact_factor);
      return badges;
    } catch (e) {
      return [];
    }
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
    this._Num_matchSCI = 0x0;
    this._Num_matchSSCI = 0x0;
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
    let rankingRecord = Zotero.AI4Paper.getCompactJournalRankingRecord(pubTitle, item.getField("ISSN"), '');
    if (!rankingRecord && item.itemType === "conferencePaper") {
      rankingRecord = Zotero.AI4Paper.getCompactJournalRankingRecord(item.getField('proceedingsTitle'), item.getField("ISSN"), '');
    }
    if (rankingRecord) {
      let libraryCatalogParts = [];
      rankingRecord.impact_factor != null && rankingRecord.impact_factor !== '' && libraryCatalogParts.push(String(rankingRecord.impact_factor));
      Zotero.Prefs.get("ai4paper.jcrscifenqu") && rankingRecord.jcr_quartile && libraryCatalogParts.push('(' + rankingRecord.jcr_quartile + ')');
      if (libraryCatalogParts.length > 0x0) {
        item.setField("libraryCatalog", libraryCatalogParts.join(' '));
        await item.saveTx();
      } else Zotero.Prefs.get("ai4paper.useZeroForFailedMatch") && (item.setField("libraryCatalog", 0x0), await item.saveTx());
      this._Num_matchJCRIF++;
      rankingRecord.indexed_science && this._Num_matchSCI++;
      rankingRecord.indexed_ssci && this._Num_matchSSCI++;
      if (rankingRecord.cas_zone != null && rankingRecord.cas_zone !== '') {
        let callNumberValue = '' + rankingRecord.cas_zone + '区';
        rankingRecord.cas_top && (callNumberValue = callNumberValue + ' (Top)');
        item.setField("callNumber", callNumberValue);
        await item.saveTx();
        this._Num_matchFenqubiao++;
      } else Zotero.Prefs.get("ai4paper.useZeroForFailedMatch") && (item.setField("callNumber", 0x0), await item.saveTx());
    } else {
      if (Zotero.Prefs.get("ai4paper.useZeroForFailedMatch")) {
        item.setField("libraryCatalog", 0x0);
        await item.saveTx();
        item.setField("callNumber", 0x0);
        await item.saveTx();
      }
    }
    this._Num_Done++;
    this._Num_ToDo === this._Num_Done && this.showProgressWindow(0x1388, "✅ 更新 IF(s)【AI4paper】", '共有【' + this._Num_matchJCRIF + " of " + this._Num_AllSel + "】个条目匹配到【影响因子/JCR 分区】，共有【" + this._Num_matchFenqubiao + " of " + this._Num_AllSel + "】个条目匹配到【中科院分区】，共有【" + this._Num_matchSCI + "】个条目命中【SCI/SCIE】，共有【" + this._Num_matchSSCI + "】个条目命中【SSCI】！", "zoteorif");
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
