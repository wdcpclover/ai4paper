// ai4paper-refs.js - References, citations, DOI & abstract fetching module
// Extracted from ai4paper.js (Phase 13)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Refs Collection Settings ===
  'setRefsCollection': function () {
    let collection = ZoteroPane.getSelectedCollection();
    Zotero.Prefs.set("ai4paper.refscollectionID", collection.id);
    Zotero.Prefs.set("ai4paper.refscollectionKey", collection.key);
    Zotero.Prefs.set("ai4paper.refscollectionName", collection.name);
    Zotero.AI4Paper.showProgressWindow(0x1388, "设置【参考/施引文献】文件夹", "【参考/施引文献】文件夹已设置为【" + collection.name + '】！');
  },
  'getRefsCollectionID': function () {
    let collectionKey = Zotero.Prefs.get("ai4paper.refscollectionKey");
    if (collectionKey) for (let libraryID of Zotero.Libraries.getAll().map(lib => lib.libraryID)) {
      let collection = Zotero.Collections.getByLibraryAndKey(libraryID, collectionKey);
      if (collection) return parseInt(collection.id);
      continue;
    }
    return parseInt(Zotero.Prefs.get("ai4paper.refscollectionID"));
  },

  // === Block B: Database Migration for Refs Collection ===
  'updateDatabase_refsCollection': function () {
    let collectionID = parseInt(Zotero.Prefs.get("ai4paper.refscollectionID"));
    if (collectionID != -0x1 && !Zotero.Prefs.get("ai4paper.refscollectionKey")) {
      let collection = Zotero.Collections.get(collectionID);
      if (collection) {
        Zotero.Prefs.set("ai4paper.refscollectionKey", collection.key);
        Zotero.Prefs.set("ai4paper.refscollectionName", collection.name);
        Zotero.AI4Paper.showProgressWindow(0xbb8, "升级【设置】数据库", "✅【抓取参考/施引文献 存放文件夹】设置数据库升级完成！");
      }
    }
  },

  // === Block C: Import Refs, Fetch from Crossref/SemanticScholar, Citations, DOI, Abstract ===
  'importSelectedRefs2Zotero': async function (refType, sourceItem, selectedIndices, doiList) {
    let refLabel = refType === "refs" ? '参考文献' : "施引文献",
      refTag = refType === "refs" ? "/refs" : "/citing",
      dupField = refType === "refs" ? "_references_isDuplicated" : "_CitingReferences_isDuplicated",
      totalSelected = 0x0,
      doiCount = 0x0,
      dupCount = 0x0,
      allItems = [],
      newItems = [];
    allItems.push(sourceItem);
    let doiMap = [];
    Object.keys(selectedIndices).forEach(async function (idx) {
      doiMap[idx] = doiList[idx];
      totalSelected++;
    });
    if (!doiMap.filter(d => d != "DOI-null").length) {
      window.alert("❌ 您选择的条目均不含有 DOI，无法导入到 Zotero。请重新选择！（不要选红色文字的条目）");
      return;
    }
    let refsCollectionID = Zotero.AI4Paper.getRefsCollectionID(),
      selectedCollection,
      collectionName;
    if (Zotero.Prefs.get("ai4paper.retrieverefsSelectCollection")) {
      selectedCollection = await Zotero.AI4Paper.openRefsCollectionSelectDialog();
      if (!selectedCollection) {
        Zotero.AI4Paper.showProgressWindow(0xbb8, '取消导入', '您已取消导入，【' + refLabel + "】导入已终止！");
        return;
      }
      refsCollectionID = selectedCollection.id;
    }
    Zotero.AI4Paper.showProgressWindow(0xbb8, "准备导入选中条目至 Zotero", '开始为选择的【' + refLabel + "】抓取元数据，并导入 Zotero ...");
    for (let refIdx in doiMap) {
      let doi = doiMap[refIdx],
        matchedItem;
      if (doi != 'DOI-null') {
        doiCount++;
        let existingItem = await Zotero.AI4Paper.checkDOIDuplicateJournalArt(doi);
        if (existingItem) {
          allItems.push(existingItem);
          dupCount++;
          matchedItem = existingItem;
          existingItem.addRelatedItem(sourceItem);
          await existingItem.saveTx();
          sourceItem.addRelatedItem(existingItem);
          await sourceItem.saveTx();
        } else {
          await Zotero.AI4Paper.fetchItemMetadata(doi);
          if (this._Data_itemType === "journal-article") {
            var newItem = new Zotero.Item("journalArticle");
            allItems.push(newItem);
            newItems.push(newItem);
            this._Data_title != null && (this._Data_title = this._Data_title.replace('&amp;amp;', '&'), this._Data_title = this._Data_title.replace("&amp;", '&'), newItem.setField("title", this._Data_title));
            doi != null && newItem.setField("DOI", doi);
            this._Data_volume != null && newItem.setField('volume', this._Data_volume);
            this._Data_issue != null && newItem.setField("issue", this._Data_issue);
            this._Data_page != null && newItem.setField("pages", this._Data_page);
            this._Data_date != null && (this._Data_date = String(this._Data_date).replace(/\,/g, '/'), newItem.setField("date", this._Data_date));
            this._Data_publication != null && typeof this._Data_publication === 'string' && (this._Data_publication = this._Data_publication.replace("&amp;amp;", '&'), this._Data_publication = this._Data_publication.replace('&amp;', '&'), newItem.setField("publicationTitle", this._Data_publication));
            this._Data_journalAbbreviation != null && (this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace("&amp;amp;", '&'), this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace("&amp;", '&'), newItem.setField("journalAbbreviation", this._Data_journalAbbreviation));
            this._Data_issn != null && newItem.setField('ISSN', this._Data_issn);
            this._Data_language != null && newItem.setField('language', this._Data_language);
            if (this._Data_url != null) {
              newItem.setField("url", this._Data_url);
            }
          } else {
            if (this._Data_itemType === "proceedings-article") {
              var newItem = new Zotero.Item("conferencePaper");
              allItems.push(newItem);
              newItems.push(newItem);
              this._Data_title != null && (this._Data_title = this._Data_title.replace("&amp;amp;", '&'), this._Data_title = this._Data_title.replace("&amp;", '&'), newItem.setField('title', this._Data_title));
              doi != null && newItem.setField('DOI', doi);
              this._Data_volume != null && newItem.setField("volume", this._Data_volume);
              if (this._Data_page != null) {
                newItem.setField("pages", this._Data_page);
              }
              this._Data_date != null && (this._Data_date = String(this._Data_date).replace(/\,/g, '/'), newItem.setField("date", this._Data_date));
              this._Data_publication != null && typeof this._Data_publication === "string" && (this._Data_publication = this._Data_publication.replace("&amp;amp;", '&'), this._Data_publication = this._Data_publication.replace("&amp;", '&'), newItem.setField("publicationTitle", this._Data_publication));
              this._Data_language != null && newItem.setField("language", this._Data_language);
              this._Data_url != null && newItem.setField("url", this._Data_url);
            } else {
              if (this._Data_itemType === "book-chapter") {
                var newItem = new Zotero.Item("bookSection");
                allItems.push(newItem);
                newItems.push(newItem);
                this._Data_title != null && (this._Data_title = this._Data_title.replace("&amp;amp;", '&'), this._Data_title = this._Data_title.replace('&amp;', '&'), newItem.setField("title", this._Data_title));
                this._Data_publisherLocation != null && newItem.setField("place", this._Data_publisherLocation);
                if (this._Data_publisher != null) {
                  newItem.setField("publisher", this._Data_publisher);
                }
                this._Data_page != null && newItem.setField("pages", this._Data_page);
                this._Data_isbn != null && newItem.setField("ISBN", this._Data_isbn);
                this._Data_date != null && (this._Data_date = String(this._Data_date).replace(/\,/g, '/'), newItem.setField("date", this._Data_date));
                this._Data_language != null && newItem.setField("language", this._Data_language);
                if (this._Data_url != null) {
                  newItem.setField("url", this._Data_url);
                }
              } else {
                var newItem = new Zotero.Item("journalArticle");
                allItems.push(newItem);
                newItems.push(newItem);
                this._Data_title != null && (this._Data_title = this._Data_title.replace("&amp;amp;", '&'), this._Data_title = this._Data_title.replace("&amp;", '&'), newItem.setField('title', this._Data_title));
                doi != null && newItem.setField("DOI", doi);
                this._Data_volume != null && newItem.setField('volume', this._Data_volume);
                this._Data_issue != null && newItem.setField('issue', this._Data_issue);
                this._Data_page != null && newItem.setField("pages", this._Data_page);
                this._Data_date != null && (this._Data_date = String(this._Data_date).replace(/\,/g, '/'), newItem.setField("date", this._Data_date));
                this._Data_publication != null && typeof this._Data_publication === "string" && (this._Data_publication = this._Data_publication.replace('&amp;amp;', '&'), this._Data_publication = this._Data_publication.replace('&amp;', '&'), newItem.setField('publicationTitle', this._Data_publication));
                this._Data_journalAbbreviation != null && (this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace('&amp;amp;', '&'), this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace("&amp;", '&'), newItem.setField("journalAbbreviation", this._Data_journalAbbreviation));
                this._Data_issn != null && newItem.setField('ISSN', this._Data_issn);
                this._Data_language != null && newItem.setField('language', this._Data_language);
                if (this._Data_url != null) {
                  newItem.setField("url", this._Data_url);
                }
              }
            }
          }
          var creators = newItem.getCreators();
          try {
            for (let i = 0x0; i < this._Data_firstNames.length; i++) {
              if (this._Data_firstNames[i] || this._Data_lastNames[i]) {
                let creator = {
                  'firstName': this._Data_firstNames[i],
                  'lastName': this._Data_lastNames[i],
                  'creatorType': "author"
                };
                creators.push(creator);
              }
            }
          } catch (e) {
            Zotero.debug(e);
          }
          newItem.setCreators(creators);
          this._Data_firstNames = [];
          this._Data_lastNames = [];
          newItem.addRelatedItem(sourceItem);
          await newItem.saveTx();
          sourceItem.addRelatedItem(newItem);
          await sourceItem.saveTx();
          newItem.addTag(refTag);
          await newItem.saveTx();
          matchedItem = newItem;
        }
        try {
          let dupData = JSON.parse(sourceItem[dupField]);
          dupData[refIdx] = {
            '_isDuplicated': true,
            '_itemID': matchedItem?.["itemID"]
          };
          sourceItem[dupField] = JSON.stringify(dupData);
        } catch (e) {
          Zotero.debug(e);
        }
      }
    }
    for (let item of allItems) {
      await Zotero.AI4Paper.updateRelatedItemsNum(item);
      if (item != sourceItem) {
        if (Zotero.AI4Paper.goPublication()) {
          if (selectedCollection) {
            await Zotero.AI4Paper.add2SelectedCollection(item);
          } else {
            await Zotero.AI4Paper.add2refsCollection(item);
          }
        }
      }
    }
    if (selectedCollection) collectionName = selectedCollection.name;else {
      collectionName = Zotero.Prefs.get('ai4paper.refscollectionName');
      collectionName === '' && (collectionName = "未分类", Zotero.AI4Paper.showProgressWindow(0xbb8, "🔔 温馨提示", "【参考文献存放文件夹】尚未设置，建议前往【Zotero 首选项 --> AI4paper --> 数据抓取】设置！"));
    }
    Zotero.AI4Paper.showProgressWindow(0x1f40, '✅\x20选中的【' + refLabel + "】成功导入至 Zotero", "您选择的【" + totalSelected + "】篇【" + refLabel + "】中，有 DOI 的【" + doiCount + '】篇已经成功导入至【' + collectionName + "】文件夹，其中包含【" + dupCount + "】篇重复文献！");
    Zotero.Prefs.get("ai4paper.retrieverefsLocateinCollection") && allItems.length > 0x1 && (await Zotero.AI4Paper.showItemInCollection(allItems[0x1], refsCollectionID));
    Zotero.Prefs.get("ai4paper.retrieverefsfindpdfs") && newItems.length && Zotero.Attachments.addAvailablePDFs(newItems);
  },
  'updateReferences': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID));
    } else var item = ZoteroPane.getSelectedItems()[0x0];
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    if (item.progressWindow_RefsBack) return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 温馨提示", "当前文献已有【查看详情】在进行，或之前的【查看详情】未正确结束！请重启 Zotero 后再试。", "refs"), false;
    if (item === undefined || !item.isRegularItem()) return window.alert("您选择的不是常规条目！"), false;
    let doi = item.getField('DOI');
    if (doi === '') return window.alert("当前文献缺失 DOI 信息！"), -0x1;
    var refsInfoList = [],
      dupStatusList = [],
      shouldRefetch = false;
    if (item._references_info) {
      refsInfoList = item._references_info.split("🍋🎈🍋").filter(Boolean);
      item._hasRefsCache = true;
      if (!refsInfoList.length || !item._references_DOI) {
        shouldRefetch = true;
      }
      if (!shouldRefetch) {
        if (!item._references_DOI) {
          item._references_DOI = refsInfoList.map(info => info.includes('🆔') ? Zotero.AI4Paper.extractDOIFromItemInfo(info) : 'DOI-null').join('🍋🎈🍋');
        }
        if (!item._references_isDuplicated) {
          dupStatusList = refsInfoList.map(() => ({
            '_isDuplicated': false,
            '_itemID': -0x1
          }));
          item._references_isDuplicated = JSON.stringify(dupStatusList);
        }
      }
    } else {
      shouldRefetch = true;
    }
    if (shouldRefetch) {
      item._hasRefsCache = false;
      let progressWin = Zotero.AI4Paper.createProgressWindow("【AI4paper】抓取参考文献", "正在抓取参考文献...请稍等", 'refs');
      await Zotero.AI4Paper.fetchRefsFromCrossref(item);
      if (item._citedRef_DOI.length === 0x0) {
        return progressWin.close(), window.alert('❌\x20在【CrossRef】数据库中，本条目参考文献数量为\x200，请更换其他文献！'), false;
      }
      progressWin.close();
      for (let i = 0x0; i < item._citedRef_DOI.length; i++) {
        dupStatusList[i] = {
          '_isDuplicated': false,
          '_itemID': -0x1
        };
        Zotero.AI4Paper.formatCitedRefItemInfo(item, refsInfoList, i);
      }
      item._references_info = refsInfoList.join('🍋🎈🍋');
      item._references_DOI = item._citedRef_DOI.join('🍋🎈🍋');
      item._references_isDuplicated = JSON.stringify(dupStatusList);
    }
    let dialogData = {
      'data': refsInfoList,
      'item': item
    };
    var dialogResult = Zotero.AI4Paper.openDialogByType_modal('selectRefs', dialogData);
    if (Zotero.AI4Paper.progressWindow) {
      Zotero.AI4Paper.progressWindow.close();
    }
    if (!dialogResult) return null;
    Zotero.AI4Paper.importSelectedRefs2Zotero('refs', item, dialogResult, item._citedRef_DOI);
  },
  'fetchRefsFromCrossref': async function (item) {
    item._citedRef_year = [];
    item._citedRef_author = [];
    item._citedRef_title = [];
    item._citedRef_journal = [];
    item._citedRef_volume = [];
    item._citedRef_issue = [];
    item._citedRef_page = [];
    item._citedRef_DOI = [];
    const doi = item.getField('DOI');
    if (!doi) return -0x1;
    const encodedDOI = encodeURIComponent(doi);
    let references = null;
    try {
      let response = await Zotero.HTTP.request("GET", "https://api.crossref.org/works/" + encodedDOI, {
        'headers': {
          'Content-Type': "application/json",
          'mailto': "iseexuhs@gmail.com"
        },
        'responseType': "json"
      });
      references = response?.['response']?.["message"]?.["reference"];
    } catch (e) {}
    if (!Array.isArray(references) || references.length === 0x0) {
      let responseData = null;
      if (responseData === null) {
        const cslFormat = "vnd.citationstyles.csl+json",
          transformPath = "transform/application/" + cslFormat,
          apiUrl = "https://api.crossref.org/works/" + encodedDOI + '/' + transformPath;
        responseData = await fetch(apiUrl).then(r => r.json())["catch"](e => null);
      }
      if (responseData === null) {
        const doiUrl = "https://doi.org/" + encodedDOI,
          cslFormat = 'vnd.citationstyles.csl+json';
        responseData = await fetch(doiUrl, {
          'headers': {
            'Accept': "application/" + cslFormat
          }
        }).then(r => r.json())["catch"](e => null);
      }
      if (responseData && Array.isArray(responseData.reference)) {
        references = responseData.reference;
      }
    }
    if (!Array.isArray(references) || references.length === 0x0) return -0x1;
    try {
      for (let i = 0x0; i < references.length; i++) {
        let ref = references[i] || {},
          year = ref.year,
          author = ref.author || ref["first-author"],
          title = ref["article-title"] || ref["volume-title"] || ref["series-title"] || ref.unstructured,
          journal = ref["journal-title"] || ref["container-title"] || '',
          volume = ref.volume,
          issue = ref.issue,
          firstPage = ref["first-page"] || ref.page,
          refDOI = ref.DOI || ref.doi;
        item._citedRef_year.push(year ? year + ',\x20' : '');
        item._citedRef_author.push(author ? author + '.\x20' : '');
        item._citedRef_title.push(title ? title : "Title-null");
        item._citedRef_journal.push(journal ? journal : '');
        item._citedRef_volume.push(volume ? volume : '');
        item._citedRef_issue.push(issue ? '(' + issue + ')' : '');
        item._citedRef_page.push(firstPage ? ':\x20' + firstPage + '.' : '');
        item._citedRef_DOI.push(refDOI ? refDOI.replace(/\‐/g, '-').trim() : 'DOI-null');
      }
    } catch (e) {}
  },
  'formatCitedRefItemInfo': function (item, infoList, index) {
    let titleStr = "📍 " + item._citedRef_title[index] + '.\x20',
      journalStr = item._citedRef_journal[index];
    journalStr = journalStr ? '【' + journalStr + "】, " : '';
    let volumeStr = '' + item._citedRef_volume[index] + item._citedRef_issue[index] + item._citedRef_page[index];
    volumeStr && !volumeStr.endsWith('.') && (volumeStr = volumeStr + '.');
    let doiStr = item._citedRef_DOI[index];
    doiStr = doiStr != "DOI-null" ? '\x20🆔\x20' + doiStr : " DOI-null";
    let ifStr = Zotero.AI4Paper.matchImpactFactorByJournalName(item._citedRef_journal[index]);
    ifStr = ifStr ? '\x20🈯️\x20' + ifStr : '';
    infoList.push('[' + (index + 0x1) + ']\x20' + item._citedRef_year[index] + item._citedRef_author[index] + titleStr + journalStr + volumeStr + doiStr + ifStr);
  },
  'formatSingleItemInfo': function (refData) {
    let titleStr = "📍 " + refData.title + '.\x20',
      journalStr = refData.journal;
    if (journalStr) {
      journalStr = '【' + journalStr + "】, ";
    }
    let volumeStr = '' + refData.volume + refData.issue + refData.page;
    volumeStr && !volumeStr.endsWith('.') && (volumeStr = volumeStr + '.');
    let ifStr = Zotero.AI4Paper.matchImpactFactorByJournalName(refData.journal.toLowerCase());
    return ifStr = ifStr ? " 🈯️ " + ifStr : '', '' + refData.year + refData.author + titleStr + journalStr + volumeStr + ifStr;
  },
  'matchImpactFactorByJournalName': function (journalName) {
    try {
      if (!journalName) return '';
      journalName = journalName.toLowerCase();
      let impactFactor = '',
        fullName = Zotero.AI4Paper._data_abbrev_to_full_dots[journalName],
        ifByFull = Zotero.AI4Paper._data_jcr_if[journalName],
        ifByAbbrev = Zotero.AI4Paper._data_jcr_if_abbrev[journalName];
      if (fullName) {
        impactFactor = Zotero.AI4Paper._data_jcr_if[fullName];
        impactFactor && (impactFactor = impactFactor.split('IF')[0x0]);
      } else ifByFull && (impactFactor = ifByFull.split('IF')[0x0]);
      return impactFactor ? impactFactor : '';
    } catch (e) {
      return '';
    }
  },
  'fetchAndDisplayRealtime': async function (item) {
    let doiList = item._citedRef_DOI;
    const results = [],
      batchSize = 0x5;
    for (let batchStart = 0x0; batchStart < doiList.length; batchStart += batchSize) {
      const batch = doiList.slice(batchStart, batchStart + batchSize),
        batchPromises = batch.map(async (doi, batchIdx) => {
          let globalIdx = batchStart + batchIdx;
          if (doi != 'DOI-null' && ["Title-null", "fetchTitle-error"].includes(item._citedRef_title[globalIdx])) {
            let details = await Zotero.AI4Paper.fetchItemDetails(doi);
            item._citedRef_title[globalIdx] = details.title;
            details.title != "fetchTitle-error" && (item._citedRef_year[globalIdx] = details.year, item._citedRef_author[globalIdx] = details.author, item._citedRef_journal[globalIdx] = details.journal, item._citedRef_volume[globalIdx] = details.volume, item._citedRef_issue[globalIdx] = details.issue, item._citedRef_page[globalIdx] = details.page);
            let updatedInfo = Zotero.AI4Paper.updatetCitedRefsItemInfo(item),
              dialog = Zotero.AI4Paper.getOpenedDialog("zoteroone-windowType-selectRefs");
            if (dialog) {
              let listbox = dialog.document.getElementById("richlistbox-elem");
              listbox.childNodes[globalIdx].querySelector("checkbox").label = updatedInfo[globalIdx];
            }
            return details;
          }
          return "fetching error";
        }),
        batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      let dialog = Zotero.AI4Paper.getOpenedDialog("zoteroone-windowType-selectRefs");
      if (dialog) {
        let percent = (batchStart / doiList.length * 0x64).toFixed(0x1);
        batchStart + batchSize >= doiList.length && (percent = 0x64);
        percent === 0x64 ? (dialog.document.querySelector(".checkmark").classList.add("show"), dialog.document.querySelector("#progress-label").style.display = "none") : (dialog.document.querySelector(".checkmark").classList.remove("show"), dialog.document.querySelector('#progress-label').style.display = '');
        Zotero.AI4Paper.updateProgressRing(dialog.document.querySelector(".progress-ring"), percent);
        dialog.document.querySelector('#progress-label').textContent = "加载详情中... " + (batchStart + batchSize >= doiList.length ? doiList.length : batchStart + 0x1) + '/' + doiList.length;
      } else {
        break;
      }
    }
    return results;
  },
  'fetchItemDetails': async function (doi) {
    let details = {
      'year': '',
      'author': '',
      'title': '',
      'journal': '',
      'volume': '',
      'issue': '',
      'page': '',
      'DOI': doi
    };
    try {
      let url = "https://api.crossref.org/works/" + encodeURIComponent(doi),
        response = await Zotero.HTTP.request('GET', url, {
          'headers': {
            'Content-Type': "application/json",
            'mailto': "iseexuhs@gmail.com"
          },
          'body': JSON.stringify({}),
          'responseType': 'json'
        }),
        pubYear = response?.['response']?.["message"]?.['published-print']?.["date-parts"]?.[0x0]?.[0x0];
      pubYear && (details.year = pubYear + ',\x20');
      let givenName = response?.['response']?.["message"]?.['author']?.[0x0]?.["given"],
        familyName = response?.['response']?.['message']?.['author']?.[0x0]?.["family"],
        authorStr = '';
      if (response?.["response"]?.["message"]?.["author"]["length"] > 0x1) authorStr = givenName + '\x20' + familyName + ',\x20et.al.\x20';else (givenName || familyName) && (authorStr = givenName + '\x20' + familyName + '.\x20');
      details.author = authorStr;
      let title = response.response.message.title?.[0x0];
      title && (details.title = title);
      let journal = response.response.message?.["container-title"]?.[0x0];
      journal && (details.journal = journal);
      let volume = response?.["response"]?.['message']?.["volume"];
      volume && (details.volume = volume);
      let issue = response?.["response"]?.["message"]?.["issue"];
      if (issue) {
        details.issue = '(' + issue + ')';
      }
      let page = response?.["response"]?.["message"]?.['page'];
      return page && (details.page = ':\x20' + page + '.'), details;
    } catch (e) {
      return details.title = "fetchTitle-error", details;
    }
  },
  'updatetCitedRefsItemInfo': function (item) {
    var infoList = [];
    for (let i = 0x0; i < item._citedRef_DOI.length; i++) {
      Zotero.AI4Paper.formatCitedRefItemInfo(item, infoList, i);
    }
    return item._references_info = infoList.join("🍋🎈🍋"), infoList;
  },
  'updateProgressRing': function (ringElem, percent) {
    if (!ringElem) return;
    const circumference = 0x2 * Math.PI * 0x2d;
    percent = Math.max(0x0, Math.min(0x64, percent));
    const offset = circumference - circumference * percent / 0x64;
    ringElem.style.strokeDashoffset = offset;
    ringElem.scrollPercent = percent;
  },
  'getRefsJSON4AIAnalysis': function (item, refDirection) {
    try {
      let label = refDirection === 'cited' ? "参考文献" : '施引文献',
        listKey = refDirection === "cited" ? "referencesList" : 'citationsList',
        jsonObj = {
          'paperInfo': {
            'title': item.getField("title"),
            'year': item.getField('year'),
            'authors': Zotero.AI4Paper.getYAMLProp_creators(item),
            'journal': item.getField("publicationTitle"),
            'impactFactor': Zotero.AI4Paper.matchImpactFactorByJournalName(item.getField("publicationTitle"))
          }
        };
      jsonObj[listKey] = {};
      if (refDirection === "cited") {
        Object.keys(item['_' + refDirection + "Ref_DOI"]).forEach(idx => {
          let journal = item?.['_' + refDirection + 'Ref_journal']?.[idx],
            impactFactor = Zotero.AI4Paper.matchImpactFactorByJournalName(journal),
            abstract = item?.['_' + refDirection + "Ref_abstract"]?.[idx];
          abstract = abstract ? abstract : '';
          jsonObj[listKey][Number(idx) + 0x1] = {
            'title': item?.['_' + refDirection + "Ref_title"]?.[idx],
            'year': item?.['_' + refDirection + "Ref_year"]?.[idx],
            'authors': item?.['_' + refDirection + 'Ref_author']?.[idx],
            'journal': journal,
            'abstract': abstract,
            'impactFactor': impactFactor
          };
        });
      } else {
        let sortedEntries = [];
        Object.keys(item._citingRef_DOI).forEach(idx => {
          let journal = item?.["_citingRef_journal"]?.[idx],
            impactFactor = Zotero.AI4Paper.matchImpactFactorByJournalName(journal);
          sortedEntries.push(item?.['_citingRef_year']?.[idx] + "🎈🎈" + item?.["_citingRef_title"]?.[idx] + '🎈🎈' + item?.['_citingRef_author']?.[idx] + '🎈🎈' + item?.["_citingRef_journal"]?.[idx] + '🎈🎈' + item?.["_citingRef_abstract"]?.[idx] + "🎈🎈" + impactFactor);
        });
        sortedEntries.sort(function (a, b) {
          return parseInt(b) - parseInt(a);
        });
        sortedEntries.forEach((entry, idx) => {
          let parts = entry.split('🎈🎈');
          jsonObj[listKey][Number(idx) + 0x1] = {
            'title': parts[0x1],
            'year': parts[0x0],
            'authors': parts[0x2],
            'journal': parts[0x3],
            'abstract': parts[0x4],
            'impactFactor': parts[0x5]
          };
        });
      }
      return JSON.stringify(jsonObj, null, 0x2);
    } catch (e) {
      return window.alert(e), false;
    }
  },
  'gptReaderSidePane_setMessageInput': function (message, appendMode) {
    let iframeWin = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!iframeWin) {
      return window.alert("请先开启 GPT 侧边栏！"), false;
    }
    if (Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
      let currentValue = iframeWin.document.getElementById("message-input").value;
      iframeWin.document.getElementById("message-input").value = appendMode ? currentValue + '\x0a\x0a' + message : message;
    } else {
      let currentValue = iframeWin.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-prompt').value;
      iframeWin.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = appendMode ? currentValue + '\x0a\x0a' + message : message;
    }
    return true;
  },
  'openRefsCollectionSelectDialog': async function () {
    Zotero.AI4Paper._dataOut_SelectedCollection = null;
    let dialogArgs = {
      'dataIn': null,
      'dataOut': null,
      'deferred': Zotero.Promise.defer(),
      'itemTreeID': "refsCollection-box-select-item-dialog"
    };
    return window.openDialog("chrome://ai4paper/content/selectionDialog/selectRefsCollection.xhtml", '', "chrome,dialog=no,centerscreen,resizable=yes", dialogArgs), await dialogArgs.deferred.promise, Zotero.AI4Paper._dataOut_SelectedCollection;
  },
  'add2refsCollection': async function (item) {
    let collectionID = Zotero.AI4Paper.getRefsCollectionID();
    if (collectionID === -0x1) return -0x1;
    item.addToCollection(collectionID);
    await item.saveTx();
  },
  'add2SelectedCollection': async function (item) {
    if (Zotero.AI4Paper._dataOut_SelectedCollection) {
      let collectionID = Zotero.AI4Paper._dataOut_SelectedCollection.id;
      if (collectionID === -0x1) return -0x1;
      item.addToCollection(collectionID);
      await item.saveTx();
    }
  },
  'checkDOIDuplicateJournalArt': async function (doi) {
    var journalSearch = new Zotero.Search();
    journalSearch.libraryID = Zotero.Libraries.userLibraryID;
    journalSearch.addCondition('itemType', 'is', "journalArticle");
    var journalIDs = await journalSearch.search(),
      journalItems = await Zotero.Items.getAsync(journalIDs);
    for (let item of journalItems) {
      let itemDOI = item.getField("DOI");
      if (itemDOI.toLowerCase() === doi.toLowerCase()) {
        return item;
      }
    }
    var confSearch = new Zotero.Search();
    confSearch.libraryID = Zotero.Libraries.userLibraryID;
    confSearch.addCondition("itemType", 'is', 'conferencePaper');
    var confIDs = await confSearch.search(),
      confItems = await Zotero.Items.getAsync(confIDs);
    for (let item of confItems) {
      let itemDOI = item.getField("DOI");
      if (itemDOI.toLowerCase() === doi.toLowerCase()) {
        return item;
      }
    }
    return false;
  },
  'updateRelatedItemsNum': async function (item) {
    if (!item.isRegularItem()) return false;
    let relatedItems = item.relatedItems,
      relatedCount = relatedItems.length;
    if (item.getField("archiveLocation").indexOf('🔗') != -0x1) {
      let archiveVal = item.getField("archiveLocation"),
        linkPos = item.getField('archiveLocation').indexOf('🔗');
      archiveVal = archiveVal.substring(0x0, linkPos);
      if (relatedCount > 0x0) {
        item.setField('archiveLocation', archiveVal + '🔗' + String(relatedCount));
      } else {
        item.setField('archiveLocation', archiveVal);
      }
      await item.saveTx();
    } else item.getField("archiveLocation").indexOf('🔗') === -0x1 && relatedCount > 0x0 && (item.setField("archiveLocation", item.getField("archiveLocation") + '🔗' + String(relatedCount)), await item.saveTx());
  },
  'showItemInCollection': async function (item, collectionID) {
    !item && (item = ZoteroPane.getSelectedItems()[0x0]);
    try {
      let collections = item.getCollections();
      !collectionID && (collectionID = collections[0x0]);
      Zotero_Tabs.select('zotero-pane');
      if (collectionID) ZoteroPane_Local.collectionsView.selectCollection(collectionID);else Zotero.Libraries.get(item.libraryID).libraryType === "user" && (await Zotero.AI4Paper.selectUnfiledCollection());
      let selectResult = await ZoteroPane_Local.selectItem(item.itemID);
      selectResult === false && window.alert("未查询到该文献，可能已经被您删除！");
    } catch (e) {
      return Zotero.debug(e), false;
    }
  },
  'selectUnfiledCollection': async function () {
    var collectionsView = ZoteroPane.collectionsView;
    for (let i = 0x0; i < collectionsView.rowCount; i++) {
      let row = collectionsView.getRow(i);
      if (row.isUnfiled()) {
        await collectionsView.selectWait(i);
        break;
      }
    }
  },
  'getRandomItemCollection': function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID;
      var item = Zotero.Items.get(itemID);
      item && item.parentItemID && (itemID = item.parentItemID, item = Zotero.Items.get(itemID));
    } else var item = ZoteroPane.getSelectedItems()[0x0];
    let collections = item.getCollections();
    if (collections.length) {
      if (Zotero.AI4Paper._refsCollectionIndex === undefined) {
        Zotero.AI4Paper._refsCollectionIndex = -0x1;
      }
      let nextIdx = Zotero.AI4Paper._refsCollectionIndex + 0x1;
      return (nextIdx >= collections.length || nextIdx < 0x0) && (Zotero.AI4Paper._refsCollectionIndex = -0x1, nextIdx = 0x0), Zotero.AI4Paper._refsCollectionIndex = Zotero.AI4Paper._refsCollectionIndex + 0x1, collections[nextIdx];
    } else {
      return '未分类';
    }
  },
  'getCurrentItem': function (requireReader) {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (requireReader && !reader) return false;
    var item;
    if (reader) {
      let itemID = reader.itemID;
      item = Zotero.Items.get(itemID);
      if (item && item.parentItemID) {
        itemID = item.parentItemID;
        item = Zotero.Items.get(itemID);
      }
    } else item = ZoteroPane.getSelectedItems()[0x0];
    return item;
  },
  'updateCitingReferences': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    if (!Zotero.AI4Paper.showDate()) {
      return -0x1;
    }
    var item = Zotero.AI4Paper.getCurrentItem();
    if (!item || !item.isRegularItem()) return window.alert("您选择的不是常规条目！"), false;
    let doi = item.getField("DOI").trim();
    if (doi === '') return window.alert("当前文献缺失 DOI 信息！"), -0x1;
    var citingInfoList = [],
      citingDOIList = [],
      citingDupStatus = [];
    if (item._CitingReferences_info) {
      citingInfoList = item._CitingReferences_info.split("🍋🎈🍋");
      citingDOIList = item._CitingReferences_DOI.split('🍋🎈🍋');
      item._hasCitingRefsCache = true;
    } else {
      item._hasCitingRefsCache = false;
      let progressWin = Zotero.AI4Paper.createProgressWindow("【AI4paper】抓取施引文献", "正在抓取施引文献...请稍等", "citing"),
        fetchResult = await Zotero.AI4Paper.fetchCitingRefsFromSemanticScholar(item);
      if (!fetchResult) {
        progressWin.close();
        return;
      }
      if (item._citingRef_DOI.length === 0x0) return progressWin.close(), window.alert("❌ 哎呀，本条目在【Semantic Scholar】数据库中无施引文献数据，请更换文献。"), false;
      progressWin.close();
      for (let i = 0x0; i < item._citingRef_DOI.length; i++) {
        let journal = item._citingRef_journal[i];
        journal = journal != "Journal-null" ? '【' + journal + '】' : '';
        let doiStr = item._citingRef_DOI[i];
        doiStr = doiStr != "DOI-null" ? "🆔 " + doiStr : '\x20DOI-null';
        let abstractTag = "{{abstractByZoteroOne}}" + item._citingRef_abstract[i],
          ifStr = Zotero.AI4Paper.matchImpactFactorByJournalName(item._citingRef_journal[i]);
        ifStr = ifStr ? '\x20🈯️\x20' + ifStr : '';
        citingInfoList.push(item._citingRef_year[i] + ',\x20' + item._citingRef_author[i] + " 📍 " + item._citingRef_title[i] + '.' + journal + doiStr + ifStr + abstractTag);
      }
      citingInfoList.sort(function (a, b) {
        return parseInt(b) - parseInt(a);
      });
      Object.keys(citingInfoList).forEach(idx => {
        citingDupStatus[idx] = {
          '_isDuplicated': false,
          '_itemID': -0x1
        };
      });
      citingDOIList = citingInfoList.map(info => {
        if (info.includes('DOI-null')) return "DOI-null";else {
          if (info.includes('🆔')) return Zotero.AI4Paper.extractDOIFromItemInfo(info);
        }
        return info;
      });
      citingInfoList = citingInfoList.map((info, idx) => '[' + (idx + 0x1) + ']\x20' + info);
      item._CitingReferences_info = citingInfoList.join('🍋🎈🍋');
      item._CitingReferences_DOI = citingDOIList.join('🍋🎈🍋');
      item._CitingReferences_isDuplicated = JSON.stringify(citingDupStatus);
    }
    let dialogData = {
      'data': citingInfoList,
      'item': item
    };
    var dialogResult = Zotero.AI4Paper.openDialogByType_modal('selectCiting', dialogData);
    Zotero.AI4Paper.progressWindow && Zotero.AI4Paper.progressWindow.close();
    if (!dialogResult) return null;
    Zotero.AI4Paper.importSelectedRefs2Zotero("citing", item, dialogResult, citingDOIList);
  },
  'fetchCitingRefsFromSemanticScholar': async function (item) {
    item._citingRef_author = [];
    item._citingRef_title = [];
    item._citingRef_year = [];
    item._citingRef_journal = [];
    item._citingRef_DOI = [];
    item._citingRef_abstract = [];
    let doi = item.getField("DOI");
    if (!doi) return false;
    let {
        host: ssHost,
        headers: ssHeaders
      } = Zotero.AI4Paper.getRequestParameters_SemanticScholar(true),
      url = ssHost + "/graph/v1/paper/" + encodeURIComponent(doi) + "?fields=citations.year,citations.authors,citations.title,citations.journal,citations.externalIds,citations.abstract";
    try {
      let httpResponse = await Zotero.HTTP.request("GET", url, {
        'headers': ssHeaders,
        'body': JSON.stringify({}),
        'responseType': "json"
      });
      if (!httpResponse) {
        return false;
      }
      let responseData = httpResponse?.["response"];
      if (!responseData) return false;
      try {
        for (i = 0x0; i < responseData.citations.length; i++) {
          let authorNames = responseData.citations[i]?.["authors"]['map'](a => a.name),
            authorStr = authorNames[0x0] + '.';
          authorNames.length > 0x1 && (authorStr = authorNames[0x0] + ", et.al.");
          item._citingRef_author.push(authorStr);
          let title = responseData.citations[i]?.['title'];
          item._citingRef_title.push(title ? title : 'Title-null');
          let year = responseData.citations[i]?.['year'];
          item._citingRef_year.push(year ? year : 'Year-null');
          let journal = responseData.citations[i]?.["journal"]?.["name"];
          item._citingRef_journal.push(journal ? journal : "Journal-null");
          let citDOI = responseData.citations[i]?.["externalIds"]?.["DOI"];
          item._citingRef_DOI.push(citDOI ? citDOI.replace(/\‐/g, '-') : 'DOI-null');
          let abstract = responseData.citations[i]?.["abstract"];
          item._citingRef_abstract.push(abstract ? abstract : '');
        }
        return true;
      } catch (e) {
        return false;
      }
    } catch (e) {
      return window.alert("❌ [请求错误] 哎呀，【抓取施引文献】出错啦！\n\n🔧【常见错误码含义】见：https://www.yuque.com/qnscholar/zotero-one/ho8yw7ookhod8evw?singleDoc \n\n👉 Error: " + e.message), false;
    }
  },
  'extractDOIFromItemInfo': function (infoStr) {
    infoStr = infoStr.split('{{abstractByZoteroOne}}')[0x0];
    let idPos = infoStr.indexOf('🆔'),
      doiStr = infoStr.substring(idPos + 0x3),
      ifPos = doiStr.indexOf("🈯️");
    return ifPos != -0x1 && (doiStr = doiStr.substring(0x0, ifPos).trim()), doiStr.trim();
  },
  'updateSelectedItemsCitations': async function () {
    var activationHash = Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != activationHash) return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    var citationStyle = '\x20' + (Zotero.Prefs.get('ai4paper.citationsstyle') != '无样式' ? Zotero.Prefs.get("ai4paper.citationsstyle") : '');
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID,
        attachment = Zotero.Items.get(itemID);
      if (attachment && attachment.parentItemID) {
        itemID = attachment.parentItemID;
        attachment = Zotero.Items.get(itemID);
        this._Num_getCitations = 0x0;
        if (!Zotero.AI4Paper.checkItemField(attachment, "DOI") || attachment.getField("DOI") === '') return window.alert("您选中的文献缺失 DOI 信息！"), false;
        Zotero.AI4Paper.showProgressWindow(0xbb8, "正在抓取引用量 【AI4paper】", "您正在抓取该篇文献的引用量...结果将通过弹窗反馈给您！", "zoteorif");
        if (attachment.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1) {
          if (Zotero.AI4Paper.goPublication()) {
            let citCount = await Zotero.AI4Paper.fetchCitationCountsFromCrossRef(attachment);
          }
          if (citationsNum) {
            if (attachment.getField("archiveLocation").indexOf('🔗') != -0x1) {
              let linkPos = attachment.getField('archiveLocation').indexOf('🔗'),
                linkSuffix = attachment.getField("archiveLocation").substring(linkPos),
                citValue = citationsNum + citationStyle;
              attachment.setField("archiveLocation", citValue + linkSuffix);
              await attachment.saveTx();
            } else {
              let citValue = citationsNum + citationStyle;
              attachment.setField("archiveLocation", citValue);
              await attachment.saveTx();
            }
            this._Num_getCitations++;
          }
        }
        if (this._Num_getCitations > 0x0) Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 引用量抓取完毕 【AI4paper】", '您成功抓取【1】篇文献的引用量！', 'zoteorif');else this._Num_getCitations === 0x0 && Zotero.AI4Paper.showProgressWindow(0x1770, '✅\x20引用量抓取完毕\x20【Zotero\x20One】', "有【0】篇文献匹配到引用量！", 'zoteorif');
      }
    } else {
      if (Zotero.AI4Paper.runAuthor()) {
        var selectedItems = Zotero.getActiveZoteroPane().getSelectedItems().filter(it => it.isRegularItem());
        this._Num_AllSel = selectedItems.length;
        if (selectedItems.length === 0x1 && (!Zotero.AI4Paper.checkItemField(selectedItems[0x0], "DOI") || selectedItems[0x0].getField("DOI") === '')) return window.alert("您选中的文献缺失 DOI 信息！"), false;
        Zotero.AI4Paper.showProgressWindow(0xbb8, '正在抓取引用量\x20【Zotero\x20One】', '您正在抓取【' + selectedItems.length + "】篇文献的引用量...结果将通过弹窗反馈给您！", "zoteorif");
        await Zotero.AI4Paper.updateItemsCitations(selectedItems);
        Zotero.AI4Paper.showProgressWindow(0xbb8, '✅\x20引用抓取完毕量\x20【Zotero\x20One】', "您成功抓取【" + this._Num_getCitations + " of " + this._Num_AllSel + "】篇文献的引用量！", 'zoteorif');
      }
    }
  },
  'updateItemsCitations': async function (items) {
    this._Num_getCitations = 0x0;
    var citationStyle = '\x20' + (Zotero.Prefs.get("ai4paper.citationsstyle") != "无样式" ? Zotero.Prefs.get("ai4paper.citationsstyle") : '');
    for (let item of items) {
      if (item.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 && Zotero.AI4Paper.checkItemField(item, "DOI") && item.getField("DOI") != '') {
        let citCount = await Zotero.AI4Paper.fetchCitationCountsFromCrossRef(item);
        if (citCount) {
          if (item.getField("archiveLocation").indexOf('🔗') != -0x1) {
            let linkPos = item.getField('archiveLocation').indexOf('🔗'),
              linkSuffix = item.getField('archiveLocation').substring(linkPos),
              citValue = citCount + citationStyle;
            item.setField("archiveLocation", citValue + linkSuffix);
            await item.saveTx();
          } else {
            let citValue = citCount + citationStyle;
            item.setField('archiveLocation', citValue);
            await item.saveTx();
          }
          this._Num_getCitations++;
        }
      }
    }
  },
  'fetchCitationCountsFromCrossRef': async function (item) {
    let doi = item.getField("DOI");
    if (!doi) {
      return -0x1;
    }
    let url = "https://api.crossref.org/works/" + encodeURIComponent(doi);
    try {
      let response = await Zotero.HTTP.request("GET", url, {
        'headers': {
          'Content-Type': "application/json",
          'mailto': 'iseexuhs@gmail.com'
        },
        'body': JSON.stringify({}),
        'responseType': "json"
      });
      return response?.['response']?.["message"]?.['is-referenced-by-count'];
    } catch (e) {
      return false;
    }
  },
  'fetchItemCitations': async function (item) {
    this._Data_Citations = null;
    this._Data_Abstract = null;
    let doi = item.getField("DOI");
    if (!doi) {
      return -0x1;
    }
    let {
        host: ssHost,
        headers: ssHeaders
      } = Zotero.AI4Paper.getRequestParameters_SemanticScholar(),
      url = ssHost + '/graph/v1/paper/' + encodeURIComponent(doi) + "?fields=abstract,citations&limit=1000";
    try {
      let httpResponse = await Zotero.HTTP.request("GET", url, {
        'headers': ssHeaders,
        'body': JSON.stringify({}),
        'responseType': "json"
      });
      if (!httpResponse) {
        return -0x1;
      }
      let responseData = httpResponse.response;
      if (!responseData) {
        return -0x1;
      }
      try {
        this._Data_Citations = responseData.citations.length;
        await new Promise(resolve => setTimeout(resolve, 0x32));
      } catch (e) {
        return -0x1;
      }
      try {
        this._Data_Abstract = responseData.abstract;
        await new Promise(resolve => setTimeout(resolve, 0x32));
      } catch (e) {
        return -0x1;
      }
    } catch (e) {
      return -0x1;
    }
  },
  'fetchAbstractFromSemanticScholarAndCrossRef': async function (doi, fetchMethods, results) {
    const fetchPromises = fetchMethods.map(async (method, idx) => {
        try {
          let abstract;
          return method === "fetchAbstractFromSemanticScholar" ? abstract = await Zotero.AI4Paper.fetchAbstractFromSemanticScholar(doi) : abstract = await Zotero.AI4Paper.fetchAbstractFromCrossRef(doi), results.push(abstract), abstract;
        } catch (e) {
          return results.push(null), null;
        }
      }),
      allResults = await Promise.all(fetchPromises);
    return allResults;
  },
  'fetchAbstractFromSemanticScholar': async function (doi) {
    try {
      let {
          host: ssHost,
          headers: ssHeaders
        } = Zotero.AI4Paper.getRequestParameters_SemanticScholar(),
        url = ssHost + '/graph/v1/paper/' + encodeURIComponent(doi) + "?fields=abstract",
        response = await Zotero.HTTP.request("GET", url, {
          'headers': ssHeaders,
          'body': JSON.stringify({}),
          'responseType': "json"
        });
      return response?.['response']?.['abstract'];
    } catch (e) {
      return Zotero.AI4Paper._data_fetchAbstractErrors.push("👉【Semantic Scholar】: " + e.message), "fetchAbstract error";
    }
  },
  'fetchAbstractFromCrossRef': async function (doi) {
    try {
      let url = "https://api.crossref.org/works/" + encodeURIComponent(doi),
        response = await Zotero.HTTP.request('GET', url, {
          'headers': {
            'Content-Type': "application/json",
            'mailto': 'iseexuhs@gmail.com'
          },
          'body': JSON.stringify({}),
          'responseType': "json"
        });
      return response?.["response"]?.['message']?.["abstract"];
    } catch (e) {
      return Zotero.AI4Paper._data_fetchAbstractErrors.push("👉【CrossRef】: " + e.message), "fetchAbstract error";
    }
  },
  'updateSelectedItemsDOI': async function (mode) {
    var activationHash = Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'));
    if (Zotero.Prefs.get('ai4paper.activationkeyverifyresult') != activationHash) {
      return window.alert('❌\x20Zotero\x20One\x20尚未激活，请前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20激活】\x20联网激活插件！'), -0x1;
    }
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let itemID = reader.itemID,
        attachment = Zotero.Items.get(itemID);
      attachment && attachment.parentItemID && (itemID = attachment.parentItemID, attachment = Zotero.Items.get(itemID), this._Num_AllSel = 0x1, this._Num_ToDo = 0x1, this._Num_Done = 0x0, this._Num_getDOI = 0x0, await Zotero.AI4Paper.fetchItemDOI(attachment));
    } else {
      let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
      this._Num_AllSel = selectedItems.length;
      let regularItems = selectedItems.filter(it => it.isRegularItem());
      regularItems.length === 0x0 && window.alert("❌ 请选择常规条目！");
      this._Num_ToDo = regularItems.length;
      this._Num_getDOI = 0x0;
      this._Num_noDOIField = 0x0;
      this._Num_Done = 0x0;
      regularItems.length > 0x1 && Zotero.AI4Paper.showProgressWindow(0x7d0, '正在更新\x20DOI【Zotero\x20One】', "正在更新 DOI...更新结果将弹窗告知。", 'zoteorif');
      for (let item of regularItems) {
        if (!Zotero.AI4Paper.checkItemField(item, 'DOI')) {
          this._Num_noDOIField++;
          if (this._Num_noDOIField === this._Num_ToDo) return Zotero.AI4Paper.showProgressWindow(0x1388, "❌ 更新 DOI【AI4paper】", "当前选中文献无 DOI 字段，无法更新！", "zoteorif"), false;
        }
        await Zotero.AI4Paper.fetchItemDOI(item);
      }
    }
  },
  'fetchItemDOI': function (item) {
    let fieldName = "DOI";
    if (Zotero.AI4Paper.checkItemField(item, fieldName)) {
      var baseUrl = 'https://www.crossref.org/openurl?pid=zoteroDOI@wiernik.org&',
        contextObj = Zotero.OpenURL.createContextObject(item, "1.0");
      if (contextObj) {
        var requestUrl = baseUrl + contextObj + "&multihit=true",
          xhr = new XMLHttpRequest();
        xhr.open("GET", requestUrl, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 0x4) {
            if (xhr.status == 0xc8) {
              var queryElem = xhr.responseXML.getElementsByTagName('query')[0x0];
              Zotero.AI4Paper._Num_Done++;
              var queryStatus = queryElem.getAttribute("status");
              if (queryStatus === "resolved") {
                var resolvedDOI = queryElem.getElementsByTagName("doi")[0x0].childNodes[0x0].nodeValue;
                Zotero.AI4Paper.saveField_DOI(item, resolvedDOI);
                Zotero.AI4Paper._Num_getDOI++;
              }
            } else {
              Zotero.AI4Paper._Num_Done++;
              if (Zotero.AI4Paper._Num_Done === 0x1) Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 网络中断", "当前无网络连接，无法更新 DOI！", "zoteorif");
            }
            Zotero.AI4Paper._Num_ToDo === Zotero.AI4Paper._Num_Done && Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 更新 DOI【AI4paper】", "共有【" + Zotero.AI4Paper._Num_getDOI + '\x20of\x20' + Zotero.AI4Paper._Num_AllSel + "】篇文献匹配到 DOI!", "zoteorif");
          }
        };
        xhr.send(null);
      }
    } else Zotero.AI4Paper._Num_Done++;
  },
  'updateDOI_NewItems': async function (items) {
    for (let item of items) {
      await Zotero.AI4Paper.fetchDOI_NewItem(item);
    }
  },
  'fetchDOI_NewItem': async function (item) {
    let fieldName = 'DOI';
    if (Zotero.AI4Paper.checkItemField(item, fieldName)) {
      var baseUrl = "https://www.crossref.org/openurl?pid=zoteroDOI@wiernik.org&",
        contextObj = Zotero.OpenURL.createContextObject(item, "1.0");
      if (contextObj) {
        var requestUrl = baseUrl + contextObj + "&multihit=true",
          xhr = new XMLHttpRequest();
        xhr.open("GET", requestUrl, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 0x4) {
            if (xhr.status == 0xc8) {
              var queryElem = xhr.responseXML.getElementsByTagName("query")[0x0],
                queryStatus = queryElem.getAttribute("status");
              if (queryStatus === "resolved") {
                var resolvedDOI = queryElem.getElementsByTagName("doi")[0x0].childNodes[0x0].nodeValue;
                Zotero.AI4Paper.saveField_DOI(item, resolvedDOI);
              }
            }
          }
        };
        xhr.send(null);
      }
    }
  },
  'saveField_DOI': async function (item, doi) {
    try {
      doi && (item.setField("DOI", doi.replace(/\‐/g, '-')), await item.saveTx());
    } catch (e) {
      Zotero.debug(e);
    }
  },

  // === Block D: Add Related Refs in Zotero ===
  'addRelatedRefs_Zotero': function () {
    let tabID = Zotero_Tabs._selectedID;
    var reader = Zotero.Reader.getByTabID(tabID);
    if (reader) {
      let relatedPanes = window.document.querySelectorAll(".zotero-editpane-related");
      relatedPanes = Array.from(relatedPanes).filter(pane => pane.getAttribute("tabType") === "reader" && pane.closest("item-details").getAttribute("data-tab-id") === tabID);
      relatedPanes.length && relatedPanes[0x0]?.["querySelector"]("[data-pane=\"related\"]")?.["querySelector"](".add.section-custom-button")["click"]();
    } else {
      if (Zotero_Tabs._selectedID === "zotero-pane") {
        let selectedItem = ZoteroPane.getSelectedItems()[0x0];
        selectedItem && ZoteroPane.document.getElementById("zotero-editpane-related").add();
      }
    }
  },

});
