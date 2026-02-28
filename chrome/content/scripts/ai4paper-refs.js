// ai4paper-refs.js - References, citations, DOI & abstract fetching module
// Extracted from ai4paper.js (Phase 13)

Object.assign(Zotero.AI4Paper, {

  // === Block A: Refs Collection Settings ===
  'setRefsCollection': function () {
    let var5214 = ZoteroPane.getSelectedCollection();
    Zotero.Prefs.set("ai4paper.refscollectionID", var5214.id);
    Zotero.Prefs.set("ai4paper.refscollectionKey", var5214.key);
    Zotero.Prefs.set("ai4paper.refscollectionName", var5214.name);
    Zotero.AI4Paper.showProgressWindow(0x1388, "设置【参考/施引文献】文件夹", "【参考/施引文献】文件夹已设置为【" + var5214.name + '】！');
  },
  'getRefsCollectionID': function () {
    let var5215 = Zotero.Prefs.get("ai4paper.refscollectionKey");
    if (var5215) for (let var5216 of Zotero.Libraries.getAll().map(_0x4582f7 => _0x4582f7.libraryID)) {
      let var5217 = Zotero.Collections.getByLibraryAndKey(var5216, var5215);
      if (var5217) return parseInt(var5217.id);
      continue;
    }
    return parseInt(Zotero.Prefs.get("ai4paper.refscollectionID"));
  },

  // === Block B: Database Migration for Refs Collection ===
  'updateDatabase_refsCollection': function () {
    let var5316 = parseInt(Zotero.Prefs.get("ai4paper.refscollectionID"));
    if (var5316 != -0x1 && !Zotero.Prefs.get("ai4paper.refscollectionKey")) {
      let var5317 = Zotero.Collections.get(var5316);
      if (var5317) {
        Zotero.Prefs.set("ai4paper.refscollectionKey", var5317.key);
        Zotero.Prefs.set("ai4paper.refscollectionName", var5317.name);
        Zotero.AI4Paper.showProgressWindow(0xbb8, "升级【设置】数据库", "✅【抓取参考/施引文献 存放文件夹】设置数据库升级完成！");
      }
    }
  },

  // === Block C: Import Refs, Fetch from Crossref/SemanticScholar, Citations, DOI, Abstract ===
  'importSelectedRefs2Zotero': async function (param1042, param1043, param1044, param1045) {
    let var5318 = param1042 === "refs" ? '参考文献' : "施引文献",
      var5319 = param1042 === "refs" ? "/refs" : "/citing",
      var5320 = param1042 === "refs" ? "_references_isDuplicated" : "_CitingReferences_isDuplicated",
      var5321 = 0x0,
      var5322 = 0x0,
      var5323 = 0x0,
      var5324 = [],
      var5325 = [];
    var5324.push(param1043);
    let var5326 = [];
    Object.keys(param1044).forEach(async function (param1046) {
      var5326[param1046] = param1045[param1046];
      var5321++;
    });
    if (!var5326.filter(_0x5f1d65 => _0x5f1d65 != "DOI-null").length) {
      window.alert("❌ 您选择的条目均不含有 DOI，无法导入到 Zotero。请重新选择！（不要选红色文字的条目）");
      return;
    }
    let var5327 = Zotero.AI4Paper.getRefsCollectionID(),
      var5328,
      var5329;
    if (Zotero.Prefs.get("ai4paper.retrieverefsSelectCollection")) {
      var5328 = await Zotero.AI4Paper.openRefsCollectionSelectDialog();
      if (!var5328) {
        Zotero.AI4Paper.showProgressWindow(0xbb8, '取消导入', '您已取消导入，【' + var5318 + "】导入已终止！");
        return;
      }
      var5327 = var5328.id;
    }
    Zotero.AI4Paper.showProgressWindow(0xbb8, "准备导入选中条目至 Zotero", '开始为选择的【' + var5318 + "】抓取元数据，并导入 Zotero ...");
    for (let var5330 in var5326) {
      let var5331 = var5326[var5330],
        var5332;
      if (var5331 != 'DOI-null') {
        var5322++;
        let var5333 = await Zotero.AI4Paper.checkDOIDuplicateJournalArt(var5331);
        if (var5333) {
          var5324.push(var5333);
          var5323++;
          var5332 = var5333;
          var5333.addRelatedItem(param1043);
          await var5333.saveTx();
          param1043.addRelatedItem(var5333);
          await param1043.saveTx();
        } else {
          await Zotero.AI4Paper.fetchItemMetadata(var5331);
          if (this._Data_itemType === "journal-article") {
            var var5334 = new Zotero.Item("journalArticle");
            var5324.push(var5334);
            var5325.push(var5334);
            this._Data_title != null && (this._Data_title = this._Data_title.replace('&amp;amp;', '&'), this._Data_title = this._Data_title.replace("&amp;", '&'), var5334.setField("title", this._Data_title));
            var5331 != null && var5334.setField("DOI", var5331);
            this._Data_volume != null && var5334.setField('volume', this._Data_volume);
            this._Data_issue != null && var5334.setField("issue", this._Data_issue);
            this._Data_page != null && var5334.setField("pages", this._Data_page);
            this._Data_date != null && (this._Data_date = String(this._Data_date).replace(/\,/g, '/'), var5334.setField("date", this._Data_date));
            this._Data_publication != null && typeof this._Data_publication === 'string' && (this._Data_publication = this._Data_publication.replace("&amp;amp;", '&'), this._Data_publication = this._Data_publication.replace('&amp;', '&'), var5334.setField("publicationTitle", this._Data_publication));
            this._Data_journalAbbreviation != null && (this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace("&amp;amp;", '&'), this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace("&amp;", '&'), var5334.setField("journalAbbreviation", this._Data_journalAbbreviation));
            this._Data_issn != null && var5334.setField('ISSN', this._Data_issn);
            this._Data_language != null && var5334.setField('language', this._Data_language);
            if (this._Data_url != null) {
              var5334.setField("url", this._Data_url);
            }
          } else {
            if (this._Data_itemType === "proceedings-article") {
              var var5334 = new Zotero.Item("conferencePaper");
              var5324.push(var5334);
              var5325.push(var5334);
              this._Data_title != null && (this._Data_title = this._Data_title.replace("&amp;amp;", '&'), this._Data_title = this._Data_title.replace("&amp;", '&'), var5334.setField('title', this._Data_title));
              var5331 != null && var5334.setField('DOI', var5331);
              this._Data_volume != null && var5334.setField("volume", this._Data_volume);
              if (this._Data_page != null) {
                var5334.setField("pages", this._Data_page);
              }
              this._Data_date != null && (this._Data_date = String(this._Data_date).replace(/\,/g, '/'), var5334.setField("date", this._Data_date));
              this._Data_publication != null && typeof this._Data_publication === "string" && (this._Data_publication = this._Data_publication.replace("&amp;amp;", '&'), this._Data_publication = this._Data_publication.replace("&amp;", '&'), var5334.setField("publicationTitle", this._Data_publication));
              this._Data_language != null && var5334.setField("language", this._Data_language);
              this._Data_url != null && var5334.setField("url", this._Data_url);
            } else {
              if (this._Data_itemType === "book-chapter") {
                var var5334 = new Zotero.Item("bookSection");
                var5324.push(var5334);
                var5325.push(var5334);
                this._Data_title != null && (this._Data_title = this._Data_title.replace("&amp;amp;", '&'), this._Data_title = this._Data_title.replace('&amp;', '&'), var5334.setField("title", this._Data_title));
                this._Data_publisherLocation != null && var5334.setField("place", this._Data_publisherLocation);
                if (this._Data_publisher != null) {
                  var5334.setField("publisher", this._Data_publisher);
                }
                this._Data_page != null && var5334.setField("pages", this._Data_page);
                this._Data_isbn != null && var5334.setField("ISBN", this._Data_isbn);
                this._Data_date != null && (this._Data_date = String(this._Data_date).replace(/\,/g, '/'), var5334.setField("date", this._Data_date));
                this._Data_language != null && var5334.setField("language", this._Data_language);
                if (this._Data_url != null) {
                  var5334.setField("url", this._Data_url);
                }
              } else {
                var var5334 = new Zotero.Item("journalArticle");
                var5324.push(var5334);
                var5325.push(var5334);
                this._Data_title != null && (this._Data_title = this._Data_title.replace("&amp;amp;", '&'), this._Data_title = this._Data_title.replace("&amp;", '&'), var5334.setField('title', this._Data_title));
                var5331 != null && var5334.setField("DOI", var5331);
                this._Data_volume != null && var5334.setField('volume', this._Data_volume);
                this._Data_issue != null && var5334.setField('issue', this._Data_issue);
                this._Data_page != null && var5334.setField("pages", this._Data_page);
                this._Data_date != null && (this._Data_date = String(this._Data_date).replace(/\,/g, '/'), var5334.setField("date", this._Data_date));
                this._Data_publication != null && typeof this._Data_publication === "string" && (this._Data_publication = this._Data_publication.replace('&amp;amp;', '&'), this._Data_publication = this._Data_publication.replace('&amp;', '&'), var5334.setField('publicationTitle', this._Data_publication));
                this._Data_journalAbbreviation != null && (this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace('&amp;amp;', '&'), this._Data_journalAbbreviation = this._Data_journalAbbreviation.replace("&amp;", '&'), var5334.setField("journalAbbreviation", this._Data_journalAbbreviation));
                this._Data_issn != null && var5334.setField('ISSN', this._Data_issn);
                this._Data_language != null && var5334.setField('language', this._Data_language);
                if (this._Data_url != null) {
                  var5334.setField("url", this._Data_url);
                }
              }
            }
          }
          var var5335 = var5334.getCreators();
          try {
            for (let var5336 = 0x0; var5336 < this._Data_firstNames.length; var5336++) {
              if (this._Data_firstNames[var5336] || this._Data_lastNames[var5336]) {
                let _0x16df76 = {
                  'firstName': this._Data_firstNames[var5336],
                  'lastName': this._Data_lastNames[var5336],
                  'creatorType': "author"
                };
                var5335.push(_0x16df76);
              }
            }
          } catch (_0x4917af) {
            Zotero.debug(_0x4917af);
          }
          var5334.setCreators(var5335);
          this._Data_firstNames = [];
          this._Data_lastNames = [];
          var5334.addRelatedItem(param1043);
          await var5334.saveTx();
          param1043.addRelatedItem(var5334);
          await param1043.saveTx();
          var5334.addTag(var5319);
          await var5334.saveTx();
          var5332 = var5334;
        }
        try {
          let var5338 = JSON.parse(param1043[var5320]);
          var5338[var5330] = {
            '_isDuplicated': true,
            '_itemID': var5332?.["itemID"]
          };
          param1043[var5320] = JSON.stringify(var5338);
        } catch (_0x8e42cb) {
          Zotero.debug(_0x8e42cb);
        }
      }
    }
    for (let var5339 of var5324) {
      await Zotero.AI4Paper.updateRelatedItemsNum(var5339);
      if (var5339 != param1043) {
        if (Zotero.AI4Paper.goPublication()) {
          if (var5328) {
            await Zotero.AI4Paper.add2SelectedCollection(var5339);
          } else {
            await Zotero.AI4Paper.add2refsCollection(var5339);
          }
        }
      }
    }
    if (var5328) var5329 = var5328.name;else {
      var5329 = Zotero.Prefs.get('ai4paper.refscollectionName');
      var5329 === '' && (var5329 = "未分类", Zotero.AI4Paper.showProgressWindow(0xbb8, "🔔 温馨提示", "【参考文献存放文件夹】尚未设置，建议前往【Zotero 首选项 --> AI4paper --> 数据抓取】设置！"));
    }
    Zotero.AI4Paper.showProgressWindow(0x1f40, '✅\x20选中的【' + var5318 + "】成功导入至 Zotero", "您选择的【" + var5321 + "】篇【" + var5318 + "】中，有 DOI 的【" + var5322 + '】篇已经成功导入至【' + var5329 + "】文件夹，其中包含【" + var5323 + "】篇重复文献！");
    Zotero.Prefs.get("ai4paper.retrieverefsLocateinCollection") && var5324.length > 0x1 && (await Zotero.AI4Paper.showItemInCollection(var5324[0x1], var5327));
    Zotero.Prefs.get("ai4paper.retrieverefsfindpdfs") && var5325.length && Zotero.Attachments.addAvailablePDFs(var5325);
  },
  'updateReferences': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    let var5340 = Zotero_Tabs._selectedID;
    var var5341 = Zotero.Reader.getByTabID(var5340);
    if (var5341) {
      let var5342 = var5341.itemID;
      var var5343 = Zotero.Items.get(var5342);
      var5343 && var5343.parentItemID && (var5342 = var5343.parentItemID, var5343 = Zotero.Items.get(var5342));
    } else var var5343 = ZoteroPane.getSelectedItems()[0x0];
    if (!Zotero.AI4Paper.getFunMetaTitle()) return -0x1;
    if (var5343.progressWindow_RefsBack) return Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 温馨提示", "当前文献已有【查看详情】在进行，或之前的【查看详情】未正确结束！请重启 Zotero 后再试。", "refs"), false;
    if (var5343 === undefined || !var5343.isRegularItem()) return window.alert("您选择的不是常规条目！"), false;
    let var5344 = var5343.getField('DOI');
    if (var5344 === '') return window.alert("当前文献缺失 DOI 信息！"), -0x1;
    var var5345 = [],
      var5346 = [];
    if (var5343._references_info) {
      var5345 = var5343._references_info.split("🍋🎈🍋");
      var5343._hasRefsCache = true;
    } else {
      var5343._hasRefsCache = false;
      let var5347 = Zotero.AI4Paper.createProgressWindow("【AI4paper】抓取参考文献", "正在抓取参考文献...请稍等", 'refs');
      await Zotero.AI4Paper.fetchRefsFromCrossref(var5343);
      if (var5343._citedRef_DOI.length === 0x0) {
        return var5347.close(), window.alert('❌\x20在【CrossRef】数据库中，本条目参考文献数量为\x200，请更换其他文献！'), false;
      }
      var5347.close();
      for (let var5348 = 0x0; var5348 < var5343._citedRef_DOI.length; var5348++) {
        var5346[var5348] = {
          '_isDuplicated': false,
          '_itemID': -0x1
        };
        Zotero.AI4Paper.formatCitedRefItemInfo(var5343, var5345, var5348);
      }
      var5343._references_info = var5345.join('🍋🎈🍋');
      var5343._references_DOI = var5343._citedRef_DOI.join('🍋🎈🍋');
      var5343._references_isDuplicated = JSON.stringify(var5346);
    }
    let var5349 = {
      'data': var5345,
      'item': var5343
    };
    var var5350 = Zotero.AI4Paper.openDialogByType_modal('selectRefs', var5349);
    if (Zotero.AI4Paper.progressWindow) {
      Zotero.AI4Paper.progressWindow.close();
    }
    if (!var5350) return null;
    Zotero.AI4Paper.importSelectedRefs2Zotero('refs', var5343, var5350, var5343._citedRef_DOI);
  },
  'fetchRefsFromCrossref': async function (param1047) {
    param1047._citedRef_year = [];
    param1047._citedRef_author = [];
    param1047._citedRef_title = [];
    param1047._citedRef_journal = [];
    param1047._citedRef_volume = [];
    param1047._citedRef_issue = [];
    param1047._citedRef_page = [];
    param1047._citedRef_DOI = [];
    const var5351 = param1047.getField('DOI');
    if (!var5351) return -0x1;
    const var5352 = encodeURIComponent(var5351);
    let var5353 = null;
    if (var5353 === null) {
      const var5354 = "vnd.citationstyles.csl+json",
        var5355 = "transform/application/" + var5354,
        var5356 = "https://api.crossref.org/works/" + var5352 + '/' + var5355;
      var5353 = await fetch(var5356).then(_0x4edced => _0x4edced.json())["catch"](_0x4709cb => null);
    }
    if (var5353 === null) {
      const var5357 = "https://doi.org/" + var5352,
        var5358 = 'vnd.citationstyles.csl+json';
      var5353 = await fetch(var5357, {
        'headers': {
          'Accept': "application/" + var5358
        }
      }).then(_0x59061e => _0x59061e.json())["catch"](_0x37ba27 => null);
    }
    if (var5353 === null) return -0x1;
    try {
      for (i = 0x0; i < var5353.reference.length; i++) {
        let _0x1e5fb1 = var5353.reference[i].year;
        param1047._citedRef_year.push(_0x1e5fb1 ? _0x1e5fb1 + ',\x20' : '');
        let _0x299052 = var5353.reference[i].author;
        param1047._citedRef_author.push(_0x299052 ? _0x299052 + '.\x20' : '');
        let _0x16d050 = var5353.reference[i]["article-title"];
        param1047._citedRef_title.push(_0x16d050 ? _0x16d050 : "Title-null");
        let _0xdf8dba = var5353.reference[i]["journal-title"];
        param1047._citedRef_journal.push(_0xdf8dba ? _0xdf8dba : '');
        let _0x5ca60d = var5353.reference[i].volume;
        param1047._citedRef_volume.push(_0x5ca60d ? _0x5ca60d : '');
        let _0x56bc19 = var5353.reference[i].issue;
        param1047._citedRef_issue.push(_0x56bc19 ? '(' + _0x56bc19 + ')' : '');
        let _0x509535 = var5353.reference[i]["first-page"];
        param1047._citedRef_page.push(_0x509535 ? ':\x20' + _0x509535 + '.' : '');
        let _0x414184 = var5353.reference[i].DOI;
        param1047._citedRef_DOI.push(_0x414184 ? _0x414184.replace(/\‐/g, '-') : 'DOI-null');
      }
    } catch (_0x287d84) {}
  },
  'formatCitedRefItemInfo': function (param1048, param1049, param1050) {
    let var5367 = "📍 " + param1048._citedRef_title[param1050] + '.\x20',
      var5368 = param1048._citedRef_journal[param1050];
    var5368 = var5368 ? '【' + var5368 + "】, " : '';
    let var5369 = '' + param1048._citedRef_volume[param1050] + param1048._citedRef_issue[param1050] + param1048._citedRef_page[param1050];
    var5369 && !var5369.endsWith('.') && (var5369 = var5369 + '.');
    let var5370 = param1048._citedRef_DOI[param1050];
    var5370 = var5370 != "DOI-null" ? '\x20🆔\x20' + var5370 : " DOI-null";
    let var5371 = Zotero.AI4Paper.matchImpactFactorByJournalName(param1048._citedRef_journal[param1050]);
    var5371 = var5371 ? '\x20🈯️\x20' + var5371 : '';
    param1049.push('[' + (param1050 + 0x1) + ']\x20' + param1048._citedRef_year[param1050] + param1048._citedRef_author[param1050] + var5367 + var5368 + var5369 + var5370 + var5371);
  },
  'formatSingleItemInfo': function (param1051) {
    let var5372 = "📍 " + param1051.title + '.\x20',
      var5373 = param1051.journal;
    if (var5373) {
      var5373 = '【' + var5373 + "】, ";
    }
    let var5374 = '' + param1051.volume + param1051.issue + param1051.page;
    var5374 && !var5374.endsWith('.') && (var5374 = var5374 + '.');
    let var5375 = Zotero.AI4Paper.matchImpactFactorByJournalName(param1051.journal.toLowerCase());
    return var5375 = var5375 ? " 🈯️ " + var5375 : '', '' + param1051.year + param1051.author + var5372 + var5373 + var5374 + var5375;
  },
  'matchImpactFactorByJournalName': function (param1052) {
    try {
      if (!param1052) return '';
      param1052 = param1052.toLowerCase();
      let var5376 = '',
        var5377 = Zotero.AI4Paper._data_abbrev_to_full_dots[param1052],
        var5378 = Zotero.AI4Paper._data_jcr_if[param1052],
        var5379 = Zotero.AI4Paper._data_jcr_if_abbrev[param1052];
      if (var5377) {
        var5376 = Zotero.AI4Paper._data_jcr_if[var5377];
        var5376 && (var5376 = var5376.split('IF')[0x0]);
      } else var5378 && (var5376 = var5378.split('IF')[0x0]);
      return var5376 ? var5376 : '';
    } catch (_0x31915f) {
      return '';
    }
  },
  'fetchAndDisplayRealtime': async function (param1053) {
    let var5380 = param1053._citedRef_DOI;
    const var5381 = [],
      var5382 = 0x5;
    for (let var5383 = 0x0; var5383 < var5380.length; var5383 += var5382) {
      const var5384 = var5380.slice(var5383, var5383 + var5382),
        var5385 = var5384.map(async (_0x154fce, _0xb10f84) => {
          let var5386 = var5383 + _0xb10f84;
          if (_0x154fce != 'DOI-null' && ["Title-null", "fetchTitle-error"].includes(param1053._citedRef_title[var5386])) {
            let _0x19e8db = await Zotero.AI4Paper.fetchItemDetails(_0x154fce);
            param1053._citedRef_title[var5386] = _0x19e8db.title;
            _0x19e8db.title != "fetchTitle-error" && (param1053._citedRef_year[var5386] = _0x19e8db.year, param1053._citedRef_author[var5386] = _0x19e8db.author, param1053._citedRef_journal[var5386] = _0x19e8db.journal, param1053._citedRef_volume[var5386] = _0x19e8db.volume, param1053._citedRef_issue[var5386] = _0x19e8db.issue, param1053._citedRef_page[var5386] = _0x19e8db.page);
            let _0xbaf3b = Zotero.AI4Paper.updatetCitedRefsItemInfo(param1053),
              _0x52df4b = Zotero.AI4Paper.getOpenedDialog("zoteroone-windowType-selectRefs");
            if (_0x52df4b) {
              let var5390 = _0x52df4b.document.getElementById("richlistbox-elem");
              var5390.childNodes[var5386].querySelector("checkbox").label = _0xbaf3b[var5386];
            }
            return _0x19e8db;
          }
          return "fetching error";
        }),
        var5391 = await Promise.all(var5385);
      var5381.push(...var5391);
      let var5392 = Zotero.AI4Paper.getOpenedDialog("zoteroone-windowType-selectRefs");
      if (var5392) {
        let var5393 = (var5383 / var5380.length * 0x64).toFixed(0x1);
        var5383 + var5382 >= var5380.length && (var5393 = 0x64);
        var5393 === 0x64 ? (var5392.document.querySelector(".checkmark").classList.add("show"), var5392.document.querySelector("#progress-label").style.display = "none") : (var5392.document.querySelector(".checkmark").classList.remove("show"), var5392.document.querySelector('#progress-label').style.display = '');
        Zotero.AI4Paper.updateProgressRing(var5392.document.querySelector(".progress-ring"), var5393);
        var5392.document.querySelector('#progress-label').textContent = "加载详情中... " + (var5383 + var5382 >= var5380.length ? var5380.length : var5383 + 0x1) + '/' + var5380.length;
      } else {
        break;
      }
    }
    return var5381;
  },
  'fetchItemDetails': async function (param1054) {
    let var5394 = {
      'year': '',
      'author': '',
      'title': '',
      'journal': '',
      'volume': '',
      'issue': '',
      'page': '',
      'DOI': param1054
    };
    try {
      let var5395 = "https://api.crossref.org/works/" + encodeURIComponent(param1054),
        var5396 = await Zotero.HTTP.request('GET', var5395, {
          'headers': {
            'Content-Type': "application/json",
            'mailto': "iseexuhs@gmail.com"
          },
          'body': JSON.stringify({}),
          'responseType': 'json'
        }),
        var5397 = var5396?.['response']?.["message"]?.['published-print']?.["date-parts"]?.[0x0]?.[0x0];
      var5397 && (var5394.year = var5397 + ',\x20');
      let var5398 = var5396?.['response']?.["message"]?.['author']?.[0x0]?.["given"],
        var5399 = var5396?.['response']?.['message']?.['author']?.[0x0]?.["family"],
        var5400 = '';
      if (var5396?.["response"]?.["message"]?.["author"]["length"] > 0x1) var5400 = var5398 + '\x20' + var5399 + ',\x20et.al.\x20';else (var5398 || var5399) && (var5400 = var5398 + '\x20' + var5399 + '.\x20');
      var5394.author = var5400;
      let var5401 = var5396.response.message.title?.[0x0];
      var5401 && (var5394.title = var5401);
      let var5402 = var5396.response.message?.["container-title"]?.[0x0];
      var5402 && (var5394.journal = var5402);
      let var5403 = var5396?.["response"]?.['message']?.["volume"];
      var5403 && (var5394.volume = var5403);
      let var5404 = var5396?.["response"]?.["message"]?.["issue"];
      if (var5404) {
        var5394.issue = '(' + var5404 + ')';
      }
      let var5405 = var5396?.["response"]?.["message"]?.['page'];
      return var5405 && (var5394.page = ':\x20' + var5405 + '.'), var5394;
    } catch (_0x2e359d) {
      return var5394.title = "fetchTitle-error", var5394;
    }
  },
  'updatetCitedRefsItemInfo': function (param1055) {
    var var5406 = [];
    for (let var5407 = 0x0; var5407 < param1055._citedRef_DOI.length; var5407++) {
      Zotero.AI4Paper.formatCitedRefItemInfo(param1055, var5406, var5407);
    }
    return param1055._references_info = var5406.join("🍋🎈🍋"), var5406;
  },
  'updateProgressRing': function (param1056, param1057) {
    if (!param1056) return;
    const var5408 = 0x2 * Math.PI * 0x2d;
    param1057 = Math.max(0x0, Math.min(0x64, param1057));
    const var5409 = var5408 - var5408 * param1057 / 0x64;
    param1056.style.strokeDashoffset = var5409;
    param1056.scrollPercent = param1057;
  },
  'getRefsJSON4AIAnalysis': function (param1058, param1059) {
    try {
      let _0x22a9a1 = param1059 === 'cited' ? "参考文献" : '施引文献',
        _0x188a7b = param1059 === "cited" ? "referencesList" : 'citationsList',
        _0x150b56 = {
          'paperInfo': {
            'title': param1058.getField("title"),
            'year': param1058.getField('year'),
            'authors': Zotero.AI4Paper.getYAMLProp_creators(param1058),
            'journal': param1058.getField("publicationTitle"),
            'impactFactor': Zotero.AI4Paper.matchImpactFactorByJournalName(param1058.getField("publicationTitle"))
          }
        };
      _0x150b56[_0x188a7b] = {};
      if (param1059 === "cited") {
        Object.keys(param1058['_' + param1059 + "Ref_DOI"]).forEach(_0xab2dde => {
          let var5413 = param1058?.['_' + param1059 + 'Ref_journal']?.[_0xab2dde],
            var5414 = Zotero.AI4Paper.matchImpactFactorByJournalName(var5413),
            var5415 = param1058?.['_' + param1059 + "Ref_abstract"]?.[_0xab2dde];
          var5415 = var5415 ? var5415 : '';
          _0x150b56[_0x188a7b][Number(_0xab2dde) + 0x1] = {
            'title': param1058?.['_' + param1059 + "Ref_title"]?.[_0xab2dde],
            'year': param1058?.['_' + param1059 + "Ref_year"]?.[_0xab2dde],
            'authors': param1058?.['_' + param1059 + 'Ref_author']?.[_0xab2dde],
            'journal': var5413,
            'abstract': var5415,
            'impactFactor': var5414
          };
        });
      } else {
        let _0x145704 = [];
        Object.keys(param1058._citingRef_DOI).forEach(_0x363f7e => {
          let _0x585bd9 = param1058?.["_citingRef_journal"]?.[_0x363f7e],
            _0x4b33b1 = Zotero.AI4Paper.matchImpactFactorByJournalName(_0x585bd9);
          _0x145704.push(param1058?.['_citingRef_year']?.[_0x363f7e] + "🎈🎈" + param1058?.["_citingRef_title"]?.[_0x363f7e] + '🎈🎈' + param1058?.['_citingRef_author']?.[_0x363f7e] + '🎈🎈' + param1058?.["_citingRef_journal"]?.[_0x363f7e] + '🎈🎈' + param1058?.["_citingRef_abstract"]?.[_0x363f7e] + "🎈🎈" + _0x4b33b1);
        });
        _0x145704.sort(function (param1060, param1061) {
          return parseInt(param1061) - parseInt(param1060);
        });
        _0x145704.forEach((_0x34c02a, _0x57ac64) => {
          let var5419 = _0x34c02a.split('🎈🎈');
          _0x150b56[_0x188a7b][Number(_0x57ac64) + 0x1] = {
            'title': var5419[0x1],
            'year': var5419[0x0],
            'authors': var5419[0x2],
            'journal': var5419[0x3],
            'abstract': var5419[0x4],
            'impactFactor': var5419[0x5]
          };
        });
      }
      return JSON.stringify(_0x150b56, null, 0x2);
    } catch (_0x36dca8) {
      return window.alert(_0x36dca8), false;
    }
  },
  'gptReaderSidePane_setMessageInput': function (param1062, param1063) {
    let var5420 = Zotero.AI4Paper.getIframeWindowBySidePaneType("chatgpt");
    if (!var5420) {
      return window.alert("请先开启 GPT 侧边栏！"), false;
    }
    if (Zotero.Prefs.get("ai4paper.gptContinuesChatMode")) {
      let var5421 = var5420.document.getElementById("message-input").value;
      var5420.document.getElementById("message-input").value = param1063 ? var5421 + '\x0a\x0a' + param1062 : param1062;
    } else {
      let var5422 = var5420.document.getElementById('ai4paper-chatgpt-readerSidePane-chatgpt-prompt').value;
      var5420.document.getElementById("ai4paper-chatgpt-readerSidePane-chatgpt-prompt").value = param1063 ? var5422 + '\x0a\x0a' + param1062 : param1062;
    }
    return true;
  },
  'openRefsCollectionSelectDialog': async function () {
    Zotero.AI4Paper._dataOut_SelectedCollection = null;
    let var5423 = {
      'dataIn': null,
      'dataOut': null,
      'deferred': Zotero.Promise.defer(),
      'itemTreeID': "refsCollection-box-select-item-dialog"
    };
    return window.openDialog("chrome://ai4paper/content/selectionDialog/selectRefsCollection.xhtml", '', "chrome,dialog=no,centerscreen,resizable=yes", var5423), await var5423.deferred.promise, Zotero.AI4Paper._dataOut_SelectedCollection;
  },
  'add2refsCollection': async function (param1064) {
    let var5424 = Zotero.AI4Paper.getRefsCollectionID();
    if (var5424 === -0x1) return -0x1;
    param1064.addToCollection(var5424);
    await param1064.saveTx();
  },
  'add2SelectedCollection': async function (param1065) {
    if (Zotero.AI4Paper._dataOut_SelectedCollection) {
      let var5425 = Zotero.AI4Paper._dataOut_SelectedCollection.id;
      if (var5425 === -0x1) return -0x1;
      param1065.addToCollection(var5425);
      await param1065.saveTx();
    }
  },
  'checkDOIDuplicateJournalArt': async function (param1066) {
    var var5426 = new Zotero.Search();
    var5426.libraryID = Zotero.Libraries.userLibraryID;
    var5426.addCondition('itemType', 'is', "journalArticle");
    var var5427 = await var5426.search(),
      var5428 = await Zotero.Items.getAsync(var5427);
    for (let var5429 of var5428) {
      let _0x4301b1 = var5429.getField("DOI");
      if (_0x4301b1.toLowerCase() === param1066.toLowerCase()) {
        return var5429;
      }
    }
    var var5431 = new Zotero.Search();
    var5431.libraryID = Zotero.Libraries.userLibraryID;
    var5431.addCondition("itemType", 'is', 'conferencePaper');
    var var5432 = await var5431.search(),
      var5433 = await Zotero.Items.getAsync(var5432);
    for (let var5434 of var5433) {
      let var5435 = var5434.getField("DOI");
      if (var5435.toLowerCase() === param1066.toLowerCase()) {
        return var5434;
      }
    }
    return false;
  },
  'updateRelatedItemsNum': async function (param1067) {
    if (!param1067.isRegularItem()) return false;
    let var5436 = param1067.relatedItems,
      var5437 = var5436.length;
    if (param1067.getField("archiveLocation").indexOf('🔗') != -0x1) {
      let _0x327844 = param1067.getField("archiveLocation"),
        _0x4841ef = param1067.getField('archiveLocation').indexOf('🔗');
      _0x327844 = _0x327844.substring(0x0, _0x4841ef);
      if (var5437 > 0x0) {
        param1067.setField('archiveLocation', _0x327844 + '🔗' + String(var5437));
      } else {
        param1067.setField('archiveLocation', _0x327844);
      }
      await param1067.saveTx();
    } else param1067.getField("archiveLocation").indexOf('🔗') === -0x1 && var5437 > 0x0 && (param1067.setField("archiveLocation", param1067.getField("archiveLocation") + '🔗' + String(var5437)), await param1067.saveTx());
  },
  'showItemInCollection': async function (param1068, param1069) {
    !param1068 && (param1068 = ZoteroPane.getSelectedItems()[0x0]);
    try {
      let var5440 = param1068.getCollections();
      !param1069 && (param1069 = var5440[0x0]);
      Zotero_Tabs.select('zotero-pane');
      if (param1069) ZoteroPane_Local.collectionsView.selectCollection(param1069);else Zotero.Libraries.get(param1068.libraryID).libraryType === "user" && (await Zotero.AI4Paper.selectUnfiledCollection());
      let var5441 = await ZoteroPane_Local.selectItem(param1068.itemID);
      var5441 === false && window.alert("未查询到该文献，可能已经被您删除！");
    } catch (_0x170083) {
      return Zotero.debug(_0x170083), false;
    }
  },
  'selectUnfiledCollection': async function () {
    var var5442 = ZoteroPane.collectionsView;
    for (let var5443 = 0x0; var5443 < var5442.rowCount; var5443++) {
      let var5444 = var5442.getRow(var5443);
      if (var5444.isUnfiled()) {
        await var5442.selectWait(var5443);
        break;
      }
    }
  },
  'getRandomItemCollection': function () {
    let var5445 = Zotero_Tabs._selectedID;
    var var5446 = Zotero.Reader.getByTabID(var5445);
    if (var5446) {
      let _0x3b3be4 = var5446.itemID;
      var var5448 = Zotero.Items.get(_0x3b3be4);
      var5448 && var5448.parentItemID && (_0x3b3be4 = var5448.parentItemID, var5448 = Zotero.Items.get(_0x3b3be4));
    } else var var5448 = ZoteroPane.getSelectedItems()[0x0];
    let var5449 = var5448.getCollections();
    if (var5449.length) {
      if (Zotero.AI4Paper._refsCollectionIndex === undefined) {
        Zotero.AI4Paper._refsCollectionIndex = -0x1;
      }
      let _0x43473d = Zotero.AI4Paper._refsCollectionIndex + 0x1;
      return (_0x43473d >= var5449.length || _0x43473d < 0x0) && (Zotero.AI4Paper._refsCollectionIndex = -0x1, _0x43473d = 0x0), Zotero.AI4Paper._refsCollectionIndex = Zotero.AI4Paper._refsCollectionIndex + 0x1, var5449[_0x43473d];
    } else {
      return '未分类';
    }
  },
  'getCurrentItem': function (param1070) {
    let var5451 = Zotero_Tabs._selectedID;
    var var5452 = Zotero.Reader.getByTabID(var5451);
    if (param1070 && !var5452) return false;
    var var5453;
    if (var5452) {
      let var5454 = var5452.itemID;
      var5453 = Zotero.Items.get(var5454);
      if (var5453 && var5453.parentItemID) {
        var5454 = var5453.parentItemID;
        var5453 = Zotero.Items.get(var5454);
      }
    } else var5453 = ZoteroPane.getSelectedItems()[0x0];
    return var5453;
  },
  'updateCitingReferences': async function () {
    if (!Zotero.AI4Paper.hasPer_mission(true)) return false;
    if (!Zotero.AI4Paper.showDate()) {
      return -0x1;
    }
    var var5455 = Zotero.AI4Paper.getCurrentItem();
    if (!var5455 || !var5455.isRegularItem()) return window.alert("您选择的不是常规条目！"), false;
    let var5456 = var5455.getField("DOI").trim();
    if (var5456 === '') return window.alert("当前文献缺失 DOI 信息！"), -0x1;
    var var5457 = [],
      var5458 = [],
      var5459 = [];
    if (var5455._CitingReferences_info) {
      var5457 = var5455._CitingReferences_info.split("🍋🎈🍋");
      var5458 = var5455._CitingReferences_DOI.split('🍋🎈🍋');
      var5455._hasCitingRefsCache = true;
    } else {
      var5455._hasCitingRefsCache = false;
      let _0x361fa6 = Zotero.AI4Paper.createProgressWindow("【AI4paper】抓取施引文献", "正在抓取施引文献...请稍等", "citing"),
        _0x3a5d7e = await Zotero.AI4Paper.fetchCitingRefsFromSemanticScholar(var5455);
      if (!_0x3a5d7e) {
        _0x361fa6.close();
        return;
      }
      if (var5455._citingRef_DOI.length === 0x0) return _0x361fa6.close(), window.alert("❌ 哎呀，本条目在【Semantic Scholar】数据库中无施引文献数据，请更换文献。"), false;
      _0x361fa6.close();
      for (let var5462 = 0x0; var5462 < var5455._citingRef_DOI.length; var5462++) {
        let _0x5e9a3d = var5455._citingRef_journal[var5462];
        _0x5e9a3d = _0x5e9a3d != "Journal-null" ? '【' + _0x5e9a3d + '】' : '';
        let _0x4a17bd = var5455._citingRef_DOI[var5462];
        _0x4a17bd = _0x4a17bd != "DOI-null" ? "🆔 " + _0x4a17bd : '\x20DOI-null';
        let _0x119914 = "{{abstractByZoteroOne}}" + var5455._citingRef_abstract[var5462],
          _0x23cf14 = Zotero.AI4Paper.matchImpactFactorByJournalName(var5455._citingRef_journal[var5462]);
        _0x23cf14 = _0x23cf14 ? '\x20🈯️\x20' + _0x23cf14 : '';
        var5457.push(var5455._citingRef_year[var5462] + ',\x20' + var5455._citingRef_author[var5462] + " 📍 " + var5455._citingRef_title[var5462] + '.' + _0x5e9a3d + _0x4a17bd + _0x23cf14 + _0x119914);
      }
      var5457.sort(function (param1071, param1072) {
        return parseInt(param1072) - parseInt(param1071);
      });
      Object.keys(var5457).forEach(_0x15d232 => {
        var5459[_0x15d232] = {
          '_isDuplicated': false,
          '_itemID': -0x1
        };
      });
      var5458 = var5457.map(_0x418821 => {
        if (_0x418821.includes('DOI-null')) return "DOI-null";else {
          if (_0x418821.includes('🆔')) return Zotero.AI4Paper.extractDOIFromItemInfo(_0x418821);
        }
        return _0x418821;
      });
      var5457 = var5457.map((_0x4e07a2, _0x4d9839) => '[' + (_0x4d9839 + 0x1) + ']\x20' + _0x4e07a2);
      var5455._CitingReferences_info = var5457.join('🍋🎈🍋');
      var5455._CitingReferences_DOI = var5458.join('🍋🎈🍋');
      var5455._CitingReferences_isDuplicated = JSON.stringify(var5459);
    }
    let var5467 = {
      'data': var5457,
      'item': var5455
    };
    var var5468 = Zotero.AI4Paper.openDialogByType_modal('selectCiting', var5467);
    Zotero.AI4Paper.progressWindow && Zotero.AI4Paper.progressWindow.close();
    if (!var5468) return null;
    Zotero.AI4Paper.importSelectedRefs2Zotero("citing", var5455, var5468, var5458);
  },
  'fetchCitingRefsFromSemanticScholar': async function (param1073) {
    param1073._citingRef_author = [];
    param1073._citingRef_title = [];
    param1073._citingRef_year = [];
    param1073._citingRef_journal = [];
    param1073._citingRef_DOI = [];
    param1073._citingRef_abstract = [];
    let var5469 = param1073.getField("DOI");
    if (!var5469) return false;
    let {
        host: _0x20bae5,
        headers: _0x5377bc
      } = Zotero.AI4Paper.getRequestParameters_SemanticScholar(true),
      var5470 = _0x20bae5 + "/graph/v1/paper/" + encodeURIComponent(var5469) + "?fields=citations.year,citations.authors,citations.title,citations.journal,citations.externalIds,citations.abstract";
    try {
      let var5471 = await Zotero.HTTP.request("GET", var5470, {
        'headers': _0x5377bc,
        'body': JSON.stringify({}),
        'responseType': "json"
      });
      if (!var5471) {
        return false;
      }
      let var5472 = var5471?.["response"];
      if (!var5472) return false;
      try {
        for (i = 0x0; i < var5472.citations.length; i++) {
          let _0xe0bfe4 = var5472.citations[i]?.["authors"]['map'](_0x1da657 => _0x1da657.name),
            _0x332b2d = _0xe0bfe4[0x0] + '.';
          _0xe0bfe4.length > 0x1 && (_0x332b2d = _0xe0bfe4[0x0] + ", et.al.");
          param1073._citingRef_author.push(_0x332b2d);
          let _0x2290eb = var5472.citations[i]?.['title'];
          param1073._citingRef_title.push(_0x2290eb ? _0x2290eb : 'Title-null');
          let _0x5206f0 = var5472.citations[i]?.['year'];
          param1073._citingRef_year.push(_0x5206f0 ? _0x5206f0 : 'Year-null');
          let _0x54f499 = var5472.citations[i]?.["journal"]?.["name"];
          param1073._citingRef_journal.push(_0x54f499 ? _0x54f499 : "Journal-null");
          let _0x53c174 = var5472.citations[i]?.["externalIds"]?.["DOI"];
          param1073._citingRef_DOI.push(_0x53c174 ? _0x53c174.replace(/\‐/g, '-') : 'DOI-null');
          let _0x12e11a = var5472.citations[i]?.["abstract"];
          param1073._citingRef_abstract.push(_0x12e11a ? _0x12e11a : '');
        }
        return true;
      } catch (_0x365f02) {
        return false;
      }
    } catch (_0x1b94df) {
      return window.alert("❌ [请求错误] 哎呀，【抓取施引文献】出错啦！\n\n🔧【常见错误码含义】见：https://www.yuque.com/qnscholar/zotero-one/ho8yw7ookhod8evw?singleDoc \n\n👉 Error: " + _0x1b94df.message), false;
    }
  },
  'extractDOIFromItemInfo': function (param1074) {
    param1074 = param1074.split('{{abstractByZoteroOne}}')[0x0];
    let var5480 = param1074.indexOf('🆔'),
      var5481 = param1074.substring(var5480 + 0x3),
      var5482 = var5481.indexOf("🈯️");
    return var5482 != -0x1 && (var5481 = var5481.substring(0x0, var5482).trim()), var5481.trim();
  },
  'updateSelectedItemsCitations': async function () {
    var var5483 = Zotero.Utilities.Internal.md5(Zotero.Prefs.get("ai4paper.timestringencoded"));
    if (Zotero.Prefs.get("ai4paper.activationkeyverifyresult") != var5483) return window.alert("❌ AI4paper 尚未激活，请前往【Zotero 设置 --> AI4paper --> 激活】 联网激活插件！"), -0x1;
    var var5484 = '\x20' + (Zotero.Prefs.get('ai4paper.citationsstyle') != '无样式' ? Zotero.Prefs.get("ai4paper.citationsstyle") : '');
    let var5485 = Zotero_Tabs._selectedID;
    var var5486 = Zotero.Reader.getByTabID(var5485);
    if (var5486) {
      let var5487 = var5486.itemID,
        var5488 = Zotero.Items.get(var5487);
      if (var5488 && var5488.parentItemID) {
        var5487 = var5488.parentItemID;
        var5488 = Zotero.Items.get(var5487);
        this._Num_getCitations = 0x0;
        if (!Zotero.AI4Paper.checkItemField(var5488, "DOI") || var5488.getField("DOI") === '') return window.alert("您选中的文献缺失 DOI 信息！"), false;
        Zotero.AI4Paper.showProgressWindow(0xbb8, "正在抓取引用量 【AI4paper】", "您正在抓取该篇文献的引用量...结果将通过弹窗反馈给您！", "zoteorif");
        if (var5488.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1) {
          if (Zotero.AI4Paper.goPublication()) {
            let _0x559330 = await Zotero.AI4Paper.fetchCitationCountsFromCrossRef(var5488);
          }
          if (citationsNum) {
            if (var5488.getField("archiveLocation").indexOf('🔗') != -0x1) {
              let var5490 = var5488.getField('archiveLocation').indexOf('🔗'),
                var5491 = var5488.getField("archiveLocation").substring(var5490),
                var5492 = citationsNum + var5484;
              var5488.setField("archiveLocation", var5492 + var5491);
              await var5488.saveTx();
            } else {
              let _0x4aa675 = citationsNum + var5484;
              var5488.setField("archiveLocation", _0x4aa675);
              await var5488.saveTx();
            }
            this._Num_getCitations++;
          }
        }
        if (this._Num_getCitations > 0x0) Zotero.AI4Paper.showProgressWindow(0x1770, "✅ 引用量抓取完毕 【AI4paper】", '您成功抓取【1】篇文献的引用量！', 'zoteorif');else this._Num_getCitations === 0x0 && Zotero.AI4Paper.showProgressWindow(0x1770, '✅\x20引用量抓取完毕\x20【Zotero\x20One】', "有【0】篇文献匹配到引用量！", 'zoteorif');
      }
    } else {
      if (Zotero.AI4Paper.runAuthor()) {
        var var5494 = Zotero.getActiveZoteroPane().getSelectedItems().filter(_0x59ffe0 => _0x59ffe0.isRegularItem());
        this._Num_AllSel = var5494.length;
        if (var5494.length === 0x1 && (!Zotero.AI4Paper.checkItemField(var5494[0x0], "DOI") || var5494[0x0].getField("DOI") === '')) return window.alert("您选中的文献缺失 DOI 信息！"), false;
        Zotero.AI4Paper.showProgressWindow(0xbb8, '正在抓取引用量\x20【Zotero\x20One】', '您正在抓取【' + var5494.length + "】篇文献的引用量...结果将通过弹窗反馈给您！", "zoteorif");
        await Zotero.AI4Paper.updateItemsCitations(var5494);
        Zotero.AI4Paper.showProgressWindow(0xbb8, '✅\x20引用抓取完毕量\x20【Zotero\x20One】', "您成功抓取【" + this._Num_getCitations + " of " + this._Num_AllSel + "】篇文献的引用量！", 'zoteorif');
      }
    }
  },
  'updateItemsCitations': async function (param1075) {
    this._Num_getCitations = 0x0;
    var var5495 = '\x20' + (Zotero.Prefs.get("ai4paper.citationsstyle") != "无样式" ? Zotero.Prefs.get("ai4paper.citationsstyle") : '');
    for (let var5496 of param1075) {
      if (var5496.getField("title").search(/[_\u4e00-\u9fa5]/) === -0x1 && Zotero.AI4Paper.checkItemField(var5496, "DOI") && var5496.getField("DOI") != '') {
        let var5497 = await Zotero.AI4Paper.fetchCitationCountsFromCrossRef(var5496);
        if (var5497) {
          if (var5496.getField("archiveLocation").indexOf('🔗') != -0x1) {
            let _0x591656 = var5496.getField('archiveLocation').indexOf('🔗'),
              _0x455dbd = var5496.getField('archiveLocation').substring(_0x591656),
              _0x460eb8 = var5497 + var5495;
            var5496.setField("archiveLocation", _0x460eb8 + _0x455dbd);
            await var5496.saveTx();
          } else {
            let var5501 = var5497 + var5495;
            var5496.setField('archiveLocation', var5501);
            await var5496.saveTx();
          }
          this._Num_getCitations++;
        }
      }
    }
  },
  'fetchCitationCountsFromCrossRef': async function (param1076) {
    let var5502 = param1076.getField("DOI");
    if (!var5502) {
      return -0x1;
    }
    let var5503 = "https://api.crossref.org/works/" + encodeURIComponent(var5502);
    try {
      let _0x215c28 = await Zotero.HTTP.request("GET", var5503, {
        'headers': {
          'Content-Type': "application/json",
          'mailto': 'iseexuhs@gmail.com'
        },
        'body': JSON.stringify({}),
        'responseType': "json"
      });
      return _0x215c28?.['response']?.["message"]?.['is-referenced-by-count'];
    } catch (_0x26ec50) {
      return false;
    }
  },
  'fetchItemCitations': async function (param1077) {
    this._Data_Citations = null;
    this._Data_Abstract = null;
    let var5505 = param1077.getField("DOI");
    if (!var5505) {
      return -0x1;
    }
    let {
        host: _0x50da5c,
        headers: _0x5ad90c
      } = Zotero.AI4Paper.getRequestParameters_SemanticScholar(),
      var5506 = _0x50da5c + '/graph/v1/paper/' + encodeURIComponent(var5505) + "?fields=abstract,citations&limit=1000";
    try {
      let var5507 = await Zotero.HTTP.request("GET", var5506, {
        'headers': _0x5ad90c,
        'body': JSON.stringify({}),
        'responseType': "json"
      });
      if (!var5507) {
        return -0x1;
      }
      let var5508 = var5507.response;
      if (!var5508) {
        return -0x1;
      }
      try {
        this._Data_Citations = var5508.citations.length;
        await new Promise(_0x17db00 => setTimeout(_0x17db00, 0x32));
      } catch (_0x4b7f7f) {
        return -0x1;
      }
      try {
        this._Data_Abstract = var5508.abstract;
        await new Promise(_0x1150ed => setTimeout(_0x1150ed, 0x32));
      } catch (_0xcac5c6) {
        return -0x1;
      }
    } catch (_0x38a45c) {
      return -0x1;
    }
  },
  'fetchAbstractFromSemanticScholarAndCrossRef': async function (param1078, param1079, param1080) {
    const var5509 = param1079.map(async (_0x4b368b, _0x3251a1) => {
        try {
          let var5510;
          return _0x4b368b === "fetchAbstractFromSemanticScholar" ? var5510 = await Zotero.AI4Paper.fetchAbstractFromSemanticScholar(param1078) : var5510 = await Zotero.AI4Paper.fetchAbstractFromCrossRef(param1078), param1080.push(var5510), var5510;
        } catch (_0x469a74) {
          return param1080.push(null), null;
        }
      }),
      var5511 = await Promise.all(var5509);
    return var5511;
  },
  'fetchAbstractFromSemanticScholar': async function (param1081) {
    try {
      let {
          host: _0x1a36fd,
          headers: _0x4b1f56
        } = Zotero.AI4Paper.getRequestParameters_SemanticScholar(),
        var5512 = _0x1a36fd + '/graph/v1/paper/' + encodeURIComponent(param1081) + "?fields=abstract",
        var5513 = await Zotero.HTTP.request("GET", var5512, {
          'headers': _0x4b1f56,
          'body': JSON.stringify({}),
          'responseType': "json"
        });
      return var5513?.['response']?.['abstract'];
    } catch (_0x3e5309) {
      return Zotero.AI4Paper._data_fetchAbstractErrors.push("👉【Semantic Scholar】: " + _0x3e5309.message), "fetchAbstract error";
    }
  },
  'fetchAbstractFromCrossRef': async function (param1082) {
    try {
      let _0x13df33 = "https://api.crossref.org/works/" + encodeURIComponent(param1082),
        _0x2b0858 = await Zotero.HTTP.request('GET', _0x13df33, {
          'headers': {
            'Content-Type': "application/json",
            'mailto': 'iseexuhs@gmail.com'
          },
          'body': JSON.stringify({}),
          'responseType': "json"
        });
      return _0x2b0858?.["response"]?.['message']?.["abstract"];
    } catch (_0x53ad5c) {
      return Zotero.AI4Paper._data_fetchAbstractErrors.push("👉【CrossRef】: " + _0x53ad5c.message), "fetchAbstract error";
    }
  },
  'updateSelectedItemsDOI': async function (param1083) {
    var var5516 = Zotero.Utilities.Internal.md5(Zotero.Prefs.get('ai4paper.timestringencoded'));
    if (Zotero.Prefs.get('ai4paper.activationkeyverifyresult') != var5516) {
      return window.alert('❌\x20Zotero\x20One\x20尚未激活，请前往【Zotero\x20设置\x20-->\x20Zotero\x20One\x20-->\x20激活】\x20联网激活插件！'), -0x1;
    }
    let var5517 = Zotero_Tabs._selectedID;
    var var5518 = Zotero.Reader.getByTabID(var5517);
    if (var5518) {
      let var5519 = var5518.itemID,
        var5520 = Zotero.Items.get(var5519);
      var5520 && var5520.parentItemID && (var5519 = var5520.parentItemID, var5520 = Zotero.Items.get(var5519), this._Num_AllSel = 0x1, this._Num_ToDo = 0x1, this._Num_Done = 0x0, this._Num_getDOI = 0x0, await Zotero.AI4Paper.fetchItemDOI(var5520));
    } else {
      let var5521 = Zotero.getActiveZoteroPane().getSelectedItems();
      this._Num_AllSel = var5521.length;
      let var5522 = var5521.filter(_0x86e19e => _0x86e19e.isRegularItem());
      var5522.length === 0x0 && window.alert("❌ 请选择常规条目！");
      this._Num_ToDo = var5522.length;
      this._Num_getDOI = 0x0;
      this._Num_noDOIField = 0x0;
      this._Num_Done = 0x0;
      var5522.length > 0x1 && Zotero.AI4Paper.showProgressWindow(0x7d0, '正在更新\x20DOI【Zotero\x20One】', "正在更新 DOI...更新结果将弹窗告知。", 'zoteorif');
      for (let var5523 of var5522) {
        if (!Zotero.AI4Paper.checkItemField(var5523, 'DOI')) {
          this._Num_noDOIField++;
          if (this._Num_noDOIField === this._Num_ToDo) return Zotero.AI4Paper.showProgressWindow(0x1388, "❌ 更新 DOI【AI4paper】", "当前选中文献无 DOI 字段，无法更新！", "zoteorif"), false;
        }
        await Zotero.AI4Paper.fetchItemDOI(var5523);
      }
    }
  },
  'fetchItemDOI': function (param1084) {
    let var5524 = "DOI";
    if (Zotero.AI4Paper.checkItemField(param1084, var5524)) {
      var var5525 = 'https://www.crossref.org/openurl?pid=zoteroDOI@wiernik.org&',
        var5526 = Zotero.OpenURL.createContextObject(param1084, "1.0");
      if (var5526) {
        var var5527 = var5525 + var5526 + "&multihit=true",
          var5528 = new XMLHttpRequest();
        var5528.open("GET", var5527, true);
        var5528.onreadystatechange = function () {
          if (var5528.readyState == 0x4) {
            if (var5528.status == 0xc8) {
              var var5529 = var5528.responseXML.getElementsByTagName('query')[0x0];
              Zotero.AI4Paper._Num_Done++;
              var var5530 = var5529.getAttribute("status");
              if (var5530 === "resolved") {
                var var5531 = var5529.getElementsByTagName("doi")[0x0].childNodes[0x0].nodeValue;
                Zotero.AI4Paper.saveField_DOI(param1084, var5531);
                Zotero.AI4Paper._Num_getDOI++;
              }
            } else {
              Zotero.AI4Paper._Num_Done++;
              if (Zotero.AI4Paper._Num_Done === 0x1) Zotero.AI4Paper.showProgressWindow(0xbb8, "❌ 网络中断", "当前无网络连接，无法更新 DOI！", "zoteorif");
            }
            Zotero.AI4Paper._Num_ToDo === Zotero.AI4Paper._Num_Done && Zotero.AI4Paper.showProgressWindow(0x1388, "✅ 更新 DOI【AI4paper】", "共有【" + Zotero.AI4Paper._Num_getDOI + '\x20of\x20' + Zotero.AI4Paper._Num_AllSel + "】篇文献匹配到 DOI!", "zoteorif");
          }
        };
        var5528.send(null);
      }
    } else Zotero.AI4Paper._Num_Done++;
  },
  'updateDOI_NewItems': async function (param1085) {
    for (let var5532 of param1085) {
      await Zotero.AI4Paper.fetchDOI_NewItem(var5532);
    }
  },
  'fetchDOI_NewItem': async function (param1086) {
    let var5533 = 'DOI';
    if (Zotero.AI4Paper.checkItemField(param1086, var5533)) {
      var var5534 = "https://www.crossref.org/openurl?pid=zoteroDOI@wiernik.org&",
        var5535 = Zotero.OpenURL.createContextObject(param1086, "1.0");
      if (var5535) {
        var var5536 = var5534 + var5535 + "&multihit=true",
          var5537 = new XMLHttpRequest();
        var5537.open("GET", var5536, true);
        var5537.onreadystatechange = function () {
          if (var5537.readyState == 0x4) {
            if (var5537.status == 0xc8) {
              var var5538 = var5537.responseXML.getElementsByTagName("query")[0x0],
                var5539 = var5538.getAttribute("status");
              if (var5539 === "resolved") {
                var var5540 = var5538.getElementsByTagName("doi")[0x0].childNodes[0x0].nodeValue;
                Zotero.AI4Paper.saveField_DOI(param1086, var5540);
              }
            }
          }
        };
        var5537.send(null);
      }
    }
  },
  'saveField_DOI': async function (param1087, param1088) {
    try {
      param1088 && (param1087.setField("DOI", param1088.replace(/\‐/g, '-')), await param1087.saveTx());
    } catch (_0x3b633c) {
      Zotero.debug(_0x3b633c);
    }
  },

  // === Block D: Add Related Refs in Zotero ===
  'addRelatedRefs_Zotero': function () {
    let var5867 = Zotero_Tabs._selectedID;
    var var5868 = Zotero.Reader.getByTabID(var5867);
    if (var5868) {
      let _0x2277a6 = window.document.querySelectorAll(".zotero-editpane-related");
      _0x2277a6 = Array.from(_0x2277a6).filter(_0x305529 => _0x305529.getAttribute("tabType") === "reader" && _0x305529.closest("item-details").getAttribute("data-tab-id") === var5867);
      _0x2277a6.length && _0x2277a6[0x0]?.["querySelector"]("[data-pane=\"related\"]")?.["querySelector"](".add.section-custom-button")["click"]();
    } else {
      if (Zotero_Tabs._selectedID === "zotero-pane") {
        let _0x425fbc = ZoteroPane.getSelectedItems()[0x0];
        _0x425fbc && ZoteroPane.document.getElementById("zotero-editpane-related").add();
      }
    }
  },

});
