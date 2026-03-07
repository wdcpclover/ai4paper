type MetadataTarget = {
  _Data_itemType: any;
  _Data_title: any;
  _Data_firstNames: any[];
  _Data_lastNames: any[];
  _Data_volume: any;
  _Data_issue: any;
  _Data_page: any;
  _Data_date: any;
  _Data_publication: any;
  _Data_journalAbbreviation: any;
  _Data_issn: any;
  _Data_language: any;
  _Data_url: any;
  _Data_publisherLocation: any;
  _Data_publisher: any;
  _Data_isbn: any;
};

type DefaultQNKeyInput = {
  title: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  year?: string | number | null | undefined;
  itemKey: string;
};

type QNKeyTemplateConfig = {
  variable?: string | null;
  prefix?: string | null;
  suffix?: string | null;
  truncate?: string | number | null;
  truncate_en?: string | number | null;
  truncate_zh?: string | number | null;
  blockChineseRefs?: boolean | null;
};

type QNKeyItemData = {
  title?: string | null;
  shortTitle?: string | null;
  publicationTitle?: string | null;
  journalAbbreviation?: string | null;
  libraryCatalog?: string | null;
  callNumber?: string | null;
  citationKey?: string | null;
  year?: string | number | null;
  firstName?: string | null;
  lastName?: string | null;
};

type MetadataCreator = {
  firstName?: string | null;
  lastName?: string | null;
};

type MetadataTemplateInput = {
  itemType?: string | null;
  title?: string | null;
  shortTitle?: string | null;
  creators?: MetadataCreator[] | null;
  creatorsNoInternalLinks?: boolean | null;
  publicationTitle?: string | null;
  journalAbbreviation?: string | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  series?: string | null;
  language?: string | null;
  doi?: string | null;
  issn?: string | null;
  url?: string | null;
  archive?: string | null;
  archiveLocation?: string | null;
  libraryCatalog?: string | null;
  jcrq?: string | null;
  callNumber?: string | null;
  rights?: string | null;
  extra?: string | null;
  proceedingsTitle?: string | null;
  conferenceName?: string | null;
  place?: string | null;
  publisher?: string | null;
  isbn?: string | null;
  university?: string | null;
  edition?: string | null;
  country?: string | null;
  issuingAuthority?: string | null;
  patentNumber?: string | null;
  applicationNumber?: string | null;
  priorityNumbers?: string | null;
  issueDate?: string | null;
  bookTitle?: string | null;
  seriesNumber?: string | null;
  numberOfVolumes?: string | null;
  date?: string | null;
  dateYear?: string | number | null;
  dateAdded?: string | null;
  datetimeAdded?: string | null;
  dateModified?: string | null;
  datetimeModified?: string | null;
  collectionNames?: string | null;
  relatedItems?: string | null;
  qnkey?: string | null;
  citationKey?: string | null;
  itemLink?: string | null;
  pdfLinks?: string | null;
  tags?: string | null;
  abstractNote?: string | null;
  exportAbstractYaml?: boolean | null;
  currentYear?: string | null;
  currentDate?: string | null;
  currentTime?: string | null;
  currentWeek?: string | null;
  currentYearMonth?: string | null;
  currentDateWeek?: string | null;
  currentDateTime?: string | null;
  currentDateWeekTime?: string | null;
};

type SimpleTemplateInput = {
  itemType?: string | null;
  title?: string | null;
  shortTitle?: string | null;
  date?: string | null;
  dateYear?: string | number | null;
  tags?: string | null;
  collectionNames?: string | null;
  qnkey?: string | null;
  citationKey?: string | null;
  dateAdded?: string | null;
  dateModified?: string | null;
  currentYear?: string | null;
  currentDate?: string | null;
  currentTime?: string | null;
  currentWeek?: string | null;
  currentYearMonth?: string | null;
  currentDateWeek?: string | null;
  currentDateTime?: string | null;
  currentDateWeekTime?: string | null;
};

type YamlTemplateInput = {
  itemType?: string | null;
  title?: string | null;
  shortTitle?: string | null;
  creatorsYaml?: string | null;
  firstCreator?: string | null;
  publicationTitle?: string | null;
  journalAbbreviation?: string | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  language?: string | null;
  doi?: string | null;
  issn?: string | null;
  archive?: string | null;
  archiveLocation?: string | null;
  libraryCatalog?: string | null;
  callNumber?: string | null;
  rights?: string | null;
  extra?: string | null;
  proceedingsTitle?: string | null;
  conferenceName?: string | null;
  place?: string | null;
  publisher?: string | null;
  isbn?: string | null;
  university?: string | null;
  edition?: string | null;
  country?: string | null;
  issuingAuthority?: string | null;
  patentNumber?: string | null;
  applicationNumber?: string | null;
  priorityNumbers?: string | null;
  issueDate?: string | null;
  date?: string | null;
  dateYear?: string | number | null;
  dateAdded?: string | null;
  dateModified?: string | null;
  collectionNamesYaml?: string | null;
  qnkey?: string | null;
  citationKey?: string | null;
  itemLink?: string | null;
  pdfLinksYaml?: string | null;
  tagsYaml?: string | null;
  abstractNote?: string | null;
  currentYear?: string | null;
  currentDate?: string | null;
  currentTime?: string | null;
  currentWeek?: string | null;
  currentYearMonth?: string | null;
  currentDateWeek?: string | null;
  currentDateTime?: string | null;
  currentDateWeekTime?: string | null;
};

type MetadataUpdatePrefs = {
  title?: boolean | null;
  volume?: boolean | null;
  issue?: boolean | null;
  pages?: boolean | null;
  date?: boolean | null;
  publication?: boolean | null;
  journalAbbreviation?: boolean | null;
  issn?: boolean | null;
  language?: boolean | null;
  url?: boolean | null;
  authors?: boolean | null;
};

type MetadataFieldUpdate = {
  field: string;
  value: string;
};

type MetadataCreatorUpdate = {
  firstName: string;
  lastName: string;
  creatorType: string;
};

type MetadataUpdatePlan = {
  hasAnyData: boolean;
  fieldUpdates: MetadataFieldUpdate[];
  creatorUpdates: MetadataCreatorUpdate[];
};

var AI4PaperMetadataCore = (() => {
  function readMetadataTemplate(templateStr: string, marker: string): string {
    const markerPos = templateStr.indexOf(marker);
    const afterMarker = templateStr.substring(markerPos);
    const openPos = afterMarker.indexOf("[[[");
    const closePos = afterMarker.indexOf("]]]");
    return afterMarker.substring(openPos + 3, closePos);
  }

  function extractJCRQ(catalogStr: string | null | undefined): string {
    if (!catalogStr) {
      return "";
    }
    if (catalogStr.lastIndexOf(")") !== catalogStr.length - 1) {
      return "";
    }
    const match = catalogStr.match(/\(([^)]*)\)/);
    return match ? match[1] : "";
  }

  function formatLocalDateTime(dateStr: string, dateOnly: boolean): string {
    const dateObj = new Date(dateStr);
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    const localDate = new Date(dateObj.getTime() - tzOffset);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
    const seconds = String(localDate.getSeconds()).padStart(2, "0");
    if (dateOnly) {
      return `${year}-${month}-${day}`;
    }
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function sanitizeFilename(filename: string): string {
    let sanitized = filename.replace(/[\\/:*?"<>|]/g, "_");
    sanitized = sanitized.replace(/[\x00-\x1f]/g, "");
    sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, "");
    const reservedPattern = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
    if (reservedPattern.test(sanitized)) {
      sanitized = "_" + sanitized;
    }
    sanitized = sanitized.slice(0, 200);
    return sanitized || "unnamed";
  }

  function normalizeInlineMetadataText(text: string | null | undefined): string {
    return String(text ?? "")
      .replace(/\:/g, "：")
      .replace(/： /g, "：")
      .replace(/\"/g, "\u201C")
      .replace(/\n/g, " ");
  }

  function normalizeAbstractYamlText(text: string | null | undefined): string {
    return String(text ?? "")
      .replace(/\n\n【摘要翻译】/g, "【摘要翻译】")
      .replace(/\:/g, "：")
      .replace(/： /g, "：")
      .replace(/\"/g, "\u201C")
      .replace(/\n\n/g, " ")
      .replace(/\n/g, " ");
  }

  function containsChinese(text: string | null | undefined): boolean {
    return /[_\u4e00-\u9fa5]/.test(String(text ?? ""));
  }

  function sanitizeQNKeyText(text: string | null | undefined): string {
    return String(text ?? "")
      .trim()
      .replace(/\\/g, " ")
      .replace(/\//g, " ")
      .replace(/\:/g, "：")
      .replace(/： /g, "：")
      .replace(/\*/g, " ")
      .replace(/\?/g, "？")
      .replace(/\"/g, "\u201C")
      .replace(/\</g, " ")
      .replace(/\>/g, " ")
      .replace(/\|/g, " ");
  }

  function buildDefaultQNKey(input: DefaultQNKeyInput): string {
    const maxLenZh = 10;
    const maxLenEn = 20;
    const rawTitle = String(input.title ?? "");
    const title = sanitizeQNKeyText(rawTitle);
    const yearPrefix = input.year ? `${input.year}_` : "";
    let authorStr = "";

    if (input.lastName) {
      if (!containsChinese(rawTitle)) {
        authorStr = `${input.lastName}_`;
      } else {
        authorStr = `${String(input.lastName)}${String(input.firstName ?? "")}`.substring(0, 6) + "_";
      }
    }

    const titlePart = containsChinese(rawTitle) ? title.substring(0, maxLenZh) : title.substring(0, maxLenEn);
    return `${yearPrefix}${authorStr}${titlePart}_KEY-${input.itemKey}`.replace(/\//g, " ");
  }

  function parseTruncateValue(value: string | number | null | undefined): number | null {
    const parsed = Number.parseInt(String(value ?? ""), 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  function applyAffixes(value: string, config: QNKeyTemplateConfig): string {
    return `${config?.prefix || ""}${value}${config?.suffix || ""}`;
  }

  function sanitizeQNKeyVariableValue(value: string | null | undefined): string {
    return sanitizeQNKeyText(value);
  }

  function resolveQNKeyVariable(item: QNKeyItemData, config: QNKeyTemplateConfig, varName: string): string | false {
    try {
      if (varName === "firstAuthor") {
        const rawTitle = String(item.title ?? "");
        let authorStr = "";
        if (item.lastName) {
          if (!containsChinese(rawTitle)) {
            authorStr = String(item.lastName);
          } else {
            authorStr = `${String(item.lastName)}${String(item.firstName ?? "")}`;
          }
        }
        return authorStr.trim() ? applyAffixes(authorStr.trim(), config) : false;
      }

      if (varName === "firstName") {
        return item.firstName ? applyAffixes(String(item.firstName), config) : false;
      }

      if (varName === "lastName") {
        return item.lastName ? applyAffixes(String(item.lastName), config) : false;
      }

      if (varName === "year") {
        return item.year ? applyAffixes(String(item.year), config) : false;
      }

      if (varName === "title") {
        let title = String(item.title ?? "");
        if (!containsChinese(title)) {
          const truncateEn = parseTruncateValue(config.truncate_en);
          if (truncateEn) {
            title = title.substring(0, truncateEn);
          }
        } else {
          const truncateZh = parseTruncateValue(config.truncate_zh);
          if (truncateZh) {
            title = title.substring(0, truncateZh);
          }
        }
        title = sanitizeQNKeyVariableValue(title);
        return title ? applyAffixes(title, config) : false;
      }

      if (varName === "shortTitle") {
        if (config.blockChineseRefs && containsChinese(item.title)) {
          return false;
        }
        let shortTitle = String(item.shortTitle ?? "");
        const truncate = parseTruncateValue(config.truncate);
        if (truncate) {
          shortTitle = shortTitle.substring(0, truncate);
        }
        shortTitle = sanitizeQNKeyVariableValue(shortTitle);
        return shortTitle ? applyAffixes(shortTitle, config) : false;
      }

      if (varName === "publicationTitle") {
        const publicationTitle = String(item.publicationTitle ?? "");
        return publicationTitle ? applyAffixes(publicationTitle, config) : false;
      }

      if (varName === "journalAbbreviation") {
        const journalAbbreviation = String(item.journalAbbreviation ?? "");
        return journalAbbreviation ? applyAffixes(journalAbbreviation, config) : false;
      }

      if (varName === "libraryCatalog") {
        const libraryCatalog = String(item.libraryCatalog ?? "");
        return libraryCatalog ? applyAffixes(libraryCatalog, config) : false;
      }

      if (varName === "callNumber") {
        const callNumber = String(item.callNumber ?? "");
        return callNumber ? applyAffixes(callNumber, config) : false;
      }

      if (varName === "citationKey") {
        const citationKey = String(item.citationKey ?? "");
        return citationKey ? applyAffixes(citationKey, config) : false;
      }
    } catch (_error) {
      return false;
    }

    return false;
  }

  function findTemplateDelimiterPositions(templateStr: string, isClose: boolean): number[] {
    const regex = isClose ? /\]\]\]/g : /\[\[\[/g;
    const positions: number[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(templateStr)) !== null) {
      positions.push(match.index);
    }
    return positions;
  }

  function resolveQNKeyTemplate(templateStr: string, item: QNKeyItemData): string {
    const normalizedTemplate = String(templateStr ?? "").replace(/'/g, '"');
    const openPositions = findTemplateDelimiterPositions(normalizedTemplate, false);
    const closePositions = findTemplateDelimiterPositions(normalizedTemplate, true);

    if (!(openPositions.length === closePositions.length && openPositions.length !== 0 && closePositions.length !== 0)) {
      return "invalid QNKeyTemplate";
    }

    let result = "";
    for (let i = 0; i < openPositions.length; i++) {
      try {
        const config = JSON.parse(normalizedTemplate.substring(openPositions[i] + 3, closePositions[i]).trim()) as QNKeyTemplateConfig;
        if (config.variable) {
          const resolved = resolveQNKeyVariable(item, config, config.variable);
          if (resolved) {
            result += resolved;
          }
        }
      } catch (_error) {
        return "failed to resolve QNKeyTemplate";
      }
    }

    return result.replace(/\//g, " ");
  }

  function formatMetadataCreators(input: MetadataTemplateInput): string {
    const creators = Array.isArray(input.creators) ? input.creators : [];
    if (!creators.length) {
      return "";
    }

    const title = String(input.title ?? "");
    const isChineseTitle = containsChinese(title);
    const creatorNames = creators.map((creator) => {
      const firstName = String(creator?.firstName ?? "");
      const lastName = String(creator?.lastName ?? "");
      const displayName = isChineseTitle ? `${lastName}${firstName}` : `${firstName} ${lastName}`.trim();
      return input.creatorsNoInternalLinks ? displayName : `[[${displayName}]]`;
    });

    return creatorNames.join(isChineseTitle ? "、" : "、 ");
  }

  function normalizeTemplateReplacementValue(value: string | number | null | undefined): string {
    return String(value ?? "");
  }

  function buildMetadataTemplateValues(input: MetadataTemplateInput): Record<string, string> {
    const abstractNoteRaw = String(input.abstractNote ?? "");
    const abstractNote = input.exportAbstractYaml ? normalizeAbstractYamlText(abstractNoteRaw) : abstractNoteRaw;
    const publicationTitle = String(input.publicationTitle ?? "");
    const doi = String(input.doi ?? "");
    const url = String(input.url ?? "");
    const itemLink = String(input.itemLink ?? "");

    return {
      itemType: normalizeTemplateReplacementValue(input.itemType),
      title: normalizeTemplateReplacementValue(input.title),
      shortTitle: normalizeTemplateReplacementValue(input.shortTitle).replace(/ /g, ""),
      creators: formatMetadataCreators(input),
      publicationTitle: publicationTitle ? `[[${publicationTitle}]]` : "",
      journalAbbreviation: normalizeTemplateReplacementValue(input.journalAbbreviation),
      volume: normalizeTemplateReplacementValue(input.volume),
      issue: normalizeTemplateReplacementValue(input.issue),
      pages: normalizeTemplateReplacementValue(input.pages),
      series: normalizeTemplateReplacementValue(input.series),
      language: normalizeTemplateReplacementValue(input.language),
      DOI: doi ? `[${doi}](https://doi.org/${doi})` : "",
      ISSN: normalizeTemplateReplacementValue(input.issn),
      url: url ? `[${url}](${url})` : "",
      archive: normalizeTemplateReplacementValue(input.archive),
      archiveLocation: normalizeTemplateReplacementValue(input.archiveLocation),
      libraryCatalog: normalizeTemplateReplacementValue(input.libraryCatalog),
      JCRQ: normalizeTemplateReplacementValue(input.jcrq),
      callNumber: normalizeTemplateReplacementValue(input.callNumber),
      rights: normalizeTemplateReplacementValue(input.rights),
      extra: normalizeTemplateReplacementValue(input.extra),
      proceedingsTitle: normalizeTemplateReplacementValue(input.proceedingsTitle),
      conferenceName: normalizeTemplateReplacementValue(input.conferenceName),
      place: normalizeTemplateReplacementValue(input.place),
      publisher: normalizeTemplateReplacementValue(input.publisher),
      ISBN: normalizeTemplateReplacementValue(input.isbn),
      university: normalizeTemplateReplacementValue(input.university),
      edition: normalizeTemplateReplacementValue(input.edition),
      country: normalizeTemplateReplacementValue(input.country),
      issuingAuthority: normalizeTemplateReplacementValue(input.issuingAuthority),
      patentNumber: normalizeTemplateReplacementValue(input.patentNumber),
      applicationNumber: normalizeTemplateReplacementValue(input.applicationNumber),
      priorityNumbers: normalizeTemplateReplacementValue(input.priorityNumbers),
      issueDate: normalizeTemplateReplacementValue(input.issueDate),
      bookTitle: normalizeTemplateReplacementValue(input.bookTitle),
      seriesNumber: normalizeTemplateReplacementValue(input.seriesNumber),
      numberOfVolumes: normalizeTemplateReplacementValue(input.numberOfVolumes),
      date: normalizeTemplateReplacementValue(input.date),
      dateY: normalizeTemplateReplacementValue(input.dateYear),
      dateAdded: normalizeTemplateReplacementValue(input.dateAdded),
      datetimeAdded: normalizeTemplateReplacementValue(input.datetimeAdded),
      dateModified: normalizeTemplateReplacementValue(input.dateModified),
      datetimeModified: normalizeTemplateReplacementValue(input.datetimeModified),
      collection: normalizeTemplateReplacementValue(input.collectionNames),
      related: normalizeTemplateReplacementValue(input.relatedItems),
      qnkey: normalizeTemplateReplacementValue(input.qnkey),
      citationKey: normalizeTemplateReplacementValue(input.citationKey),
      itemLink: itemLink ? `[My Library](${itemLink})` : "",
      pdfLink: normalizeTemplateReplacementValue(input.pdfLinks),
      tags: normalizeTemplateReplacementValue(input.tags),
      abstract: abstractNote,
      abstractFormat: abstractNoteRaw.replace(/\n/g, "\n>"),
      year: normalizeTemplateReplacementValue(input.currentYear),
      dateCurrent: normalizeTemplateReplacementValue(input.currentDate),
      time: normalizeTemplateReplacementValue(input.currentTime),
      week: normalizeTemplateReplacementValue(input.currentWeek),
      yearMonth: normalizeTemplateReplacementValue(input.currentYearMonth),
      dateWeek: normalizeTemplateReplacementValue(input.currentDateWeek),
      dateTime: normalizeTemplateReplacementValue(input.currentDateTime),
      dateWeekTime: normalizeTemplateReplacementValue(input.currentDateWeekTime)
    };
  }

  function applyMetadataTemplate(template: string, input: MetadataTemplateInput): string {
    let result = String(template ?? "");
    const values = buildMetadataTemplateValues(input);
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return result;
  }

  function buildSimpleTemplateValues(input: SimpleTemplateInput): Record<string, string> {
    return {
      itemType: normalizeTemplateReplacementValue(input.itemType),
      title: normalizeTemplateReplacementValue(input.title),
      shortTitle: normalizeTemplateReplacementValue(input.shortTitle).replace(/ /g, ""),
      date: normalizeTemplateReplacementValue(input.date),
      dateY: normalizeTemplateReplacementValue(input.dateYear),
      tags: normalizeTemplateReplacementValue(input.tags),
      collection: normalizeTemplateReplacementValue(input.collectionNames),
      qnkey: normalizeTemplateReplacementValue(input.qnkey),
      citationKey: normalizeTemplateReplacementValue(input.citationKey),
      year: normalizeTemplateReplacementValue(input.currentYear),
      dateCurrent: normalizeTemplateReplacementValue(input.currentDate),
      time: normalizeTemplateReplacementValue(input.currentTime),
      week: normalizeTemplateReplacementValue(input.currentWeek),
      yearMonth: normalizeTemplateReplacementValue(input.currentYearMonth),
      dateWeek: normalizeTemplateReplacementValue(input.currentDateWeek),
      dateTime: normalizeTemplateReplacementValue(input.currentDateTime),
      dateWeekTime: normalizeTemplateReplacementValue(input.currentDateWeekTime),
      dateAdded: normalizeTemplateReplacementValue(input.dateAdded),
      dateModified: normalizeTemplateReplacementValue(input.dateModified)
    };
  }

  function applySimpleTemplate(template: string, input: SimpleTemplateInput): string {
    let result = String(template ?? "");
    const values = buildSimpleTemplateValues(input);
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return result;
  }

  function formatYamlCreators(title: string | null | undefined, creators: MetadataCreator[] | null | undefined): string {
    const creatorList = Array.isArray(creators) ? creators : [];
    if (!creatorList.length) {
      return "";
    }
    const isChineseTitle = containsChinese(title);
    const names = creatorList.map((creator) => {
      const firstName = String(creator?.firstName ?? "");
      const lastName = String(creator?.lastName ?? "");
      return isChineseTitle ? `${lastName}${firstName}` : `${firstName} ${lastName}`.trim();
    });
    return `[${names.join(", ")}]`;
  }

  function formatFirstCreator(title: string | null | undefined, creator: MetadataCreator | null | undefined): string {
    const firstName = String(creator?.firstName ?? "");
    const lastName = String(creator?.lastName ?? "");
    if (!firstName && !lastName) {
      return "";
    }
    return containsChinese(title) ? `${lastName}${firstName}` : lastName;
  }

  function getNormalizedJournalAbbreviation(title: string | null | undefined, journalAbbreviation: string | null | undefined, publicationTitle: string | null | undefined): string {
    let value = String(journalAbbreviation ?? "");
    if (!value && containsChinese(title)) {
      value = String(publicationTitle ?? "");
    }
    return normalizeInlineMetadataText(value);
  }

  function normalizeYamlAbstractText(text: string | null | undefined): string {
    return String(text ?? "")
      .replace(/\n\n【摘要翻译】/g, "【摘要翻译】")
      .replace(/\:/g, "：")
      .replace(/： /g, "：")
      .replace(/\"/g, "\u201C")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>");
  }

  function buildYamlTemplateValues(input: YamlTemplateInput): Record<string, string> {
    return {
      itemType: normalizeTemplateReplacementValue(input.itemType),
      title: normalizeTemplateReplacementValue(input.title),
      shortTitle: normalizeTemplateReplacementValue(input.shortTitle).replace(/ /g, ""),
      creators: normalizeTemplateReplacementValue(input.creatorsYaml),
      firstCreator: normalizeTemplateReplacementValue(input.firstCreator),
      publicationTitle: normalizeTemplateReplacementValue(input.publicationTitle),
      journalAbbreviation: normalizeTemplateReplacementValue(input.journalAbbreviation),
      volume: normalizeTemplateReplacementValue(input.volume),
      issue: normalizeTemplateReplacementValue(input.issue),
      pages: normalizeTemplateReplacementValue(input.pages),
      language: normalizeTemplateReplacementValue(input.language),
      DOI: normalizeTemplateReplacementValue(input.doi),
      ISSN: normalizeTemplateReplacementValue(input.issn),
      archive: normalizeTemplateReplacementValue(input.archive),
      archiveLocation: normalizeTemplateReplacementValue(input.archiveLocation),
      libraryCatalog: normalizeTemplateReplacementValue(input.libraryCatalog),
      callNumber: normalizeTemplateReplacementValue(input.callNumber),
      rights: normalizeTemplateReplacementValue(input.rights),
      extra: normalizeTemplateReplacementValue(input.extra),
      proceedingsTitle: normalizeTemplateReplacementValue(input.proceedingsTitle),
      conferenceName: normalizeTemplateReplacementValue(input.conferenceName),
      place: normalizeTemplateReplacementValue(input.place),
      publisher: normalizeTemplateReplacementValue(input.publisher),
      ISBN: normalizeTemplateReplacementValue(input.isbn),
      university: normalizeTemplateReplacementValue(input.university),
      edition: normalizeTemplateReplacementValue(input.edition),
      country: normalizeTemplateReplacementValue(input.country),
      issuingAuthority: normalizeTemplateReplacementValue(input.issuingAuthority),
      patentNumber: normalizeTemplateReplacementValue(input.patentNumber),
      applicationNumber: normalizeTemplateReplacementValue(input.applicationNumber),
      priorityNumbers: normalizeTemplateReplacementValue(input.priorityNumbers),
      issueDate: normalizeTemplateReplacementValue(input.issueDate),
      date: normalizeTemplateReplacementValue(input.date),
      dateY: normalizeTemplateReplacementValue(input.dateYear),
      dateAdded: normalizeTemplateReplacementValue(input.dateAdded),
      dateModified: normalizeTemplateReplacementValue(input.dateModified),
      collection: normalizeTemplateReplacementValue(input.collectionNamesYaml),
      qnkey: normalizeTemplateReplacementValue(input.qnkey),
      citationKey: normalizeTemplateReplacementValue(input.citationKey),
      itemLink: normalizeTemplateReplacementValue(input.itemLink),
      pdfLink: normalizeTemplateReplacementValue(input.pdfLinksYaml),
      tags: normalizeTemplateReplacementValue(input.tagsYaml),
      abstract: normalizeTemplateReplacementValue(input.abstractNote),
      year: normalizeTemplateReplacementValue(input.currentYear),
      dateCurrent: normalizeTemplateReplacementValue(input.currentDate),
      time: normalizeTemplateReplacementValue(input.currentTime),
      week: normalizeTemplateReplacementValue(input.currentWeek),
      yearMonth: normalizeTemplateReplacementValue(input.currentYearMonth),
      dateWeek: normalizeTemplateReplacementValue(input.currentDateWeek),
      dateTime: normalizeTemplateReplacementValue(input.currentDateTime),
      dateWeekTime: normalizeTemplateReplacementValue(input.currentDateWeekTime)
    };
  }

  function applyYamlTemplate(template: string, input: YamlTemplateInput): string {
    let result = String(template ?? "");
    const values = buildYamlTemplateValues(input);
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return result;
  }

  function decodeHtmlAmpersands(value: string | null | undefined): string {
    return String(value ?? "")
      .replace(/&amp;amp;/g, "&")
      .replace(/&amp;/g, "&");
  }

  function normalizeMetadataDateValue(value: string | null | undefined): string {
    return String(value ?? "").replace(/\,/g, "/");
  }

  function buildMetadataCreatorUpdates(firstNames: any[] | null | undefined, lastNames: any[] | null | undefined): MetadataCreatorUpdate[] {
    const firstNameList = Array.isArray(firstNames) ? firstNames : [];
    const lastNameList = Array.isArray(lastNames) ? lastNames : [];
    const creators: MetadataCreatorUpdate[] = [];
    const maxLength = Math.max(firstNameList.length, lastNameList.length);
    for (let i = 0; i < maxLength; i++) {
      const firstName = String(firstNameList[i] ?? "");
      const lastName = String(lastNameList[i] ?? "");
      if (firstName || lastName) {
        creators.push({
          firstName,
          lastName,
          creatorType: "author"
        });
      }
    }
    return creators;
  }

  function buildMetadataUpdatePlan(target: MetadataTarget, prefs: MetadataUpdatePrefs, options?: { localAbbrDone?: boolean | null }): MetadataUpdatePlan {
    const fieldUpdates: MetadataFieldUpdate[] = [];

    if (target._Data_title != null && prefs.title) {
      fieldUpdates.push({
        field: "title",
        value: decodeHtmlAmpersands(target._Data_title)
      });
    }
    if (target._Data_volume != null && prefs.volume) {
      fieldUpdates.push({
        field: "volume",
        value: String(target._Data_volume)
      });
    }
    if (target._Data_issue != null && prefs.issue) {
      fieldUpdates.push({
        field: "issue",
        value: String(target._Data_issue)
      });
    }
    if (target._Data_page != null && prefs.pages) {
      fieldUpdates.push({
        field: "pages",
        value: String(target._Data_page)
      });
    }
    if (target._Data_date != null && prefs.date) {
      fieldUpdates.push({
        field: "date",
        value: normalizeMetadataDateValue(target._Data_date)
      });
    }
    if (target._Data_publication != null && typeof target._Data_publication === "string" && prefs.publication) {
      fieldUpdates.push({
        field: "publicationTitle",
        value: decodeHtmlAmpersands(target._Data_publication)
      });
    }
    if (target._Data_journalAbbreviation != null && prefs.journalAbbreviation && !options?.localAbbrDone) {
      fieldUpdates.push({
        field: "journalAbbreviation",
        value: decodeHtmlAmpersands(target._Data_journalAbbreviation)
      });
    }
    if (target._Data_issn != null && prefs.issn) {
      fieldUpdates.push({
        field: "ISSN",
        value: String(target._Data_issn)
      });
    }
    if (target._Data_language != null && prefs.language) {
      fieldUpdates.push({
        field: "language",
        value: String(target._Data_language)
      });
    }
    if (target._Data_url != null && prefs.url) {
      fieldUpdates.push({
        field: "url",
        value: String(target._Data_url)
      });
    }

    const creatorUpdates = prefs.authors
      ? buildMetadataCreatorUpdates(target._Data_firstNames, target._Data_lastNames)
      : [];

    return {
      hasAnyData:
        target._Data_title != null ||
        target._Data_volume != null ||
        target._Data_issue != null ||
        target._Data_page != null ||
        target._Data_date != null ||
        target._Data_publication != null ||
        target._Data_journalAbbreviation != null ||
        target._Data_issn != null ||
        target._Data_language != null ||
        target._Data_url != null ||
        creatorUpdates.length > 0,
      fieldUpdates,
      creatorUpdates
    };
  }

  function resetMetadataTarget(target: MetadataTarget): void {
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
  }

  function applyCslData(target: MetadataTarget, cslData: any): void {
    target._Data_itemType = cslData?.type ?? null;
    target._Data_title = cslData?.title ?? null;

    const authors = Array.isArray(cslData?.author) ? cslData.author : [];
    target._Data_firstNames = authors.map((author: any) => author?.given).filter(Boolean);
    target._Data_lastNames = authors.map((author: any) => author?.family).filter(Boolean);

    target._Data_volume = cslData?.volume ?? null;
    target._Data_issue = cslData?.issue ?? null;
    target._Data_page = cslData?.page ?? null;
    target._Data_date = cslData?.["published-print"]?.["date-parts"] ?? null;
    target._Data_publication = cslData?.["container-title"] ?? null;
    target._Data_journalAbbreviation = cslData?.["container-title-short"] ?? null;
    target._Data_issn = Array.isArray(cslData?.ISSN) ? cslData.ISSN[0] ?? null : null;
    target._Data_language = cslData?.language ?? null;
    target._Data_url = cslData?.resource?.primary?.URL ?? null;
    target._Data_publisherLocation = cslData?.["publisher-location"] ?? null;
    target._Data_publisher = cslData?.publisher ?? null;
    target._Data_isbn = Array.isArray(cslData?.ISBN) ? cslData.ISBN[1] ?? null : null;
  }

  return {
    applyCslData,
    applyMetadataTemplate,
    applySimpleTemplate,
    applyYamlTemplate,
    buildDefaultQNKey,
    buildMetadataCreatorUpdates,
    buildMetadataTemplateValues,
    buildMetadataUpdatePlan,
    buildSimpleTemplateValues,
    buildYamlTemplateValues,
    decodeHtmlAmpersands,
    extractJCRQ,
    formatLocalDateTime,
    formatMetadataCreators,
    formatFirstCreator,
    formatYamlCreators,
    getNormalizedJournalAbbreviation,
    normalizeAbstractYamlText,
    normalizeMetadataDateValue,
    normalizeInlineMetadataText,
    normalizeYamlAbstractText,
    readMetadataTemplate,
    resolveQNKeyTemplate,
    resolveQNKeyVariable,
    resetMetadataTarget,
    sanitizeQNKeyText,
    sanitizeFilename
  };
})();
