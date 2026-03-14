"use strict";
// ai4paper-journal-ranking.ts - Journal ranking column with colored badge rendering
// Displays: IF, SCIE/SSCI, JCR quartile, CAS zone, CSCD, CSSCI(南核), 北核, CCF
// Style: EasyScholar-like colored rounded badges
var AI4PaperJournalRanking = (() => {
    const PREF_BRANCH = "ai4paper.";
    const PLUGIN_ID = "ai4paper@cpc.dev";
    // --- Badge color scheme (EasyScholar style) ---
    const COLORS = {
        sciGreen: { bg: "#d4edda", fg: "#155724" },
        ssciBlue: { bg: "#cce5ff", fg: "#004085" },
        jcrQ1: { bg: "#28a745", fg: "#ffffff" },
        jcrQ2: { bg: "#71c174", fg: "#ffffff" },
        jcrQ3: { bg: "#ffc107", fg: "#664d03" },
        jcrQ4: { bg: "#e2e3e5", fg: "#41464b" },
        cas1: { bg: "#dc3545", fg: "#ffffff" },
        cas2: { bg: "#fd7e14", fg: "#ffffff" },
        cas3: { bg: "#ffc107", fg: "#664d03" },
        cas4: { bg: "#e2e3e5", fg: "#41464b" },
        casTop: { bg: "#dc3545", fg: "#ffffff" },
        ifHigh: { bg: "#17a2b8", fg: "#ffffff" }, // IF >= 10
        ifMed: { bg: "#20c997", fg: "#ffffff" }, // IF >= 3
        ifLow: { bg: "#e8f5e9", fg: "#2e7d32" }, // IF < 3
        cscd: { bg: "#e1bee7", fg: "#6a1b9a" },
        cssci: { bg: "#ffcdd2", fg: "#b71c1c" },
        pkucore: { bg: "#ffe0b2", fg: "#e65100" },
        ccfA: { bg: "#dc3545", fg: "#ffffff" },
        ccfB: { bg: "#fd7e14", fg: "#ffffff" },
        ccfC: { bg: "#ffc107", fg: "#664d03" },
        fallback: { bg: "#f0f0f0", fg: "#555555" },
    };
    // --- Journal lookup helpers ---
    function normalizeKey(name) {
        let s = String(name ?? "").trim().toLowerCase().replace(/\s+/g, " ");
        if (s.startsWith("the ")) {
            s = s.substring(4);
        }
        return s;
    }
    function lookupCompactRecord(journalName, issn, eissn) {
        const byKey = Zotero.AI4Paper._data_journal_ranking_compact || {};
        const byISSN = Zotero.AI4Paper._data_journal_ranking_compact_issn || {};
        const byEISSN = Zotero.AI4Paper._data_journal_ranking_compact_eissn || {};
        const normISSN = String(issn ?? "").trim();
        const normEISSN = String(eissn ?? "").trim();
        if (normISSN && byISSN[normISSN]) {
            return byKey[byISSN[normISSN]] || null;
        }
        if (normEISSN && byEISSN[normEISSN]) {
            return byKey[byEISSN[normEISSN]] || null;
        }
        const normTitle = normalizeKey(journalName);
        if (!normTitle)
            return null;
        if (byKey[normTitle])
            return byKey[normTitle];
        const fullName = Zotero.AI4Paper._data_abbrev_to_full_dots?.[normTitle];
        if (fullName) {
            const normFull = normalizeKey(fullName);
            if (byKey[normFull])
                return byKey[normFull];
        }
        const modified = Zotero.AI4Paper._data_modifiedPubTitles?.[normTitle];
        if (modified) {
            const normMod = normalizeKey(modified);
            if (byKey[normMod])
                return byKey[normMod];
        }
        return null;
    }
    function lookupChineseIndex(journalName) {
        const normTitle = normalizeKey(journalName);
        if (!normTitle)
            return [];
        const tags = [];
        const cscd = Zotero.AI4Paper._data_cscd;
        const pkucore = Zotero.AI4Paper._data_pkucore;
        const njucore = Zotero.AI4Paper._data_njucore;
        if (cscd && cscd[normTitle])
            tags.push(cscd[normTitle]);
        if (njucore && njucore[normTitle])
            tags.push("CSSCI");
        if (pkucore && pkucore[normTitle])
            tags.push("北核");
        return tags;
    }
    function lookupCCF(journalName) {
        const normTitle = normalizeKey(journalName);
        if (!normTitle)
            return null;
        const ccf = Zotero.AI4Paper._data_ccf;
        return ccf?.[normTitle] || null;
    }
    // --- Badge builders ---
    function getJCRColor(quartile) {
        if (quartile === "Q1")
            return COLORS.jcrQ1;
        if (quartile === "Q2")
            return COLORS.jcrQ2;
        if (quartile === "Q3")
            return COLORS.jcrQ3;
        return COLORS.jcrQ4;
    }
    function getCASColor(zone, top) {
        if (top)
            return COLORS.casTop;
        if (zone === 1)
            return COLORS.cas1;
        if (zone === 2)
            return COLORS.cas2;
        if (zone === 3)
            return COLORS.cas3;
        return COLORS.cas4;
    }
    function getIFColor(ifValue) {
        if (ifValue >= 10)
            return COLORS.ifHigh;
        if (ifValue >= 3)
            return COLORS.ifMed;
        return COLORS.ifLow;
    }
    function getCCFColor(ccf) {
        if (ccf.includes("A"))
            return COLORS.ccfA;
        if (ccf.includes("B"))
            return COLORS.ccfB;
        return COLORS.ccfC;
    }
    function getChineseIndexColor(tag) {
        if (tag.includes("CSCD"))
            return COLORS.cscd;
        if (tag === "CSSCI")
            return COLORS.cssci;
        if (tag === "北核")
            return COLORS.pkucore;
        return COLORS.fallback;
    }
    function buildBadges(item) {
        try {
            const journalName = item.getField("publicationTitle");
            const issn = item.getField("ISSN");
            let record = lookupCompactRecord(journalName, issn);
            if (!record && item.itemType === "conferencePaper") {
                record = lookupCompactRecord(item.getField("proceedingsTitle"), issn);
            }
            const badges = [];
            if (record) {
                if (record.indexed_science) {
                    badges.push({ text: "SCIE", ...COLORS.sciGreen });
                }
                if (record.indexed_ssci) {
                    badges.push({ text: "SSCI", ...COLORS.ssciBlue });
                }
                if (record.jcr_quartile) {
                    const c = getJCRColor(record.jcr_quartile);
                    badges.push({ text: "JCR " + record.jcr_quartile, ...c });
                }
                if (record.cas_zone != null && record.cas_zone !== '') {
                    const c = getCASColor(record.cas_zone, !!record.cas_top);
                    badges.push({ text: record.cas_zone + "区" + (record.cas_top ? " Top" : ""), ...c });
                }
                if (record.impact_factor != null && record.impact_factor !== '') {
                    const c = getIFColor(record.impact_factor);
                    badges.push({ text: "IF " + record.impact_factor, ...c });
                }
            }
            const chineseTags = lookupChineseIndex(journalName);
            for (const tag of chineseTags) {
                const c = getChineseIndexColor(tag);
                badges.push({ text: tag, ...c });
            }
            const ccf = lookupCCF(journalName);
            if (ccf) {
                const c = getCCFColor(ccf);
                badges.push({ text: ccf, ...c });
            }
            return badges;
        }
        catch (_e) {
            return [];
        }
    }
    // --- Text summary (for dataProvider / sorting / accessibility) ---
    function buildTextSummary(item) {
        const badges = buildBadges(item);
        if (badges.length > 0) {
            return badges.map(b => b.text).join(" · ");
        }
        // Fallback
        try {
            const libCat = String(item.getField("libraryCatalog") ?? "").trim();
            const callNum = String(item.getField("callNumber") ?? "").trim();
            const parts = [];
            if (libCat && libCat !== "0")
                parts.push(libCat);
            if (callNum && callNum !== "0")
                parts.push(callNum);
            return parts.join(" · ");
        }
        catch (_e) {
            return "";
        }
    }
    // --- renderCell: colored badge rendering ---
    // Badge inline style
    const BADGE_STYLE = [
        "display: inline-block",
        "padding: 1px 6px",
        "margin: 0 2px",
        "border-radius: 3px",
        "font-size: 11px",
        "line-height: 16px",
        "font-weight: 500",
        "white-space: nowrap",
    ].join(";");
    function renderBadgeCell(_index, data, column, _isFirstColumn, doc) {
        // Create the cell container
        const cell = doc.createElementNS("http://www.w3.org/1999/xhtml", "span");
        cell.className = "cell " + (column.className || "");
        cell.style.display = "flex";
        cell.style.alignItems = "center";
        cell.style.gap = "2px";
        cell.style.overflow = "hidden";
        if (!data)
            return cell;
        // Parse badge data (JSON array) or fall back to plain text
        let badges;
        try {
            badges = JSON.parse(data);
        }
        catch (_e) {
            cell.textContent = data;
            return cell;
        }
        if (!Array.isArray(badges) || badges.length === 0) {
            return cell;
        }
        for (const badge of badges) {
            const span = doc.createElementNS("http://www.w3.org/1999/xhtml", "span");
            span.textContent = badge.text;
            span.setAttribute("style", BADGE_STYLE +
                ";background-color:" + badge.bg +
                ";color:" + badge.fg);
            cell.appendChild(span);
        }
        return cell;
    }
    // --- Column registration ---
    function getPref(key) {
        return Zotero.Prefs.get(PREF_BRANCH + key);
    }
    async function registerColumns() {
        const columnKey = "journalRankingBadges";
        const columnDataKey = "ai4paper-jr-badges";
        // Unregister first
        try {
            await Zotero.ItemTreeManager.unregisterColumn(columnDataKey);
        }
        catch (_e) {
            // ignore
        }
        const prefEnabled = getPref("enableJRColumn_journalRanking");
        if (prefEnabled === false)
            return;
        const customLabel = getPref("labelJRColumn_journalRanking");
        const label = customLabel || "期刊分区";
        await Zotero.ItemTreeManager.registerColumn({
            dataKey: columnDataKey,
            label: label,
            pluginID: PLUGIN_ID,
            enabledTreeIDs: ["main"],
            flex: 3,
            showInColumnPicker: true,
            columnPickerSubMenu: true,
            dataProvider: (item, _dataKey) => {
                const badges = buildBadges(item);
                if (badges.length === 0) {
                    // Fallback text
                    try {
                        const libCat = String(item.getField("libraryCatalog") ?? "").trim();
                        if (libCat && libCat !== "0")
                            return libCat;
                    }
                    catch (_e) { /* */ }
                    return "";
                }
                return JSON.stringify(badges);
            },
            renderCell: renderBadgeCell
        });
        Zotero.ItemTreeManager.refreshColumns();
        // Auto-show
        try {
            const win = Zotero.getMainWindow();
            const itemsView = win?.ZoteroPane?.itemsView;
            if (itemsView?._getColumnPrefs && itemsView?._storeColumnPrefs) {
                const prefs = Object.assign({}, itemsView._getColumnPrefs());
                prefs[columnDataKey] = Object.assign({}, prefs[columnDataKey], { hidden: false });
                itemsView._storeColumnPrefs(prefs);
                if (itemsView.tree) {
                    itemsView.tree.invalidate();
                }
            }
        }
        catch (e) {
            Zotero.debug("AI4Paper JournalRanking: column visibility error: " + e);
        }
    }
    async function unregisterColumns() {
        try {
            await Zotero.ItemTreeManager.unregisterColumn("ai4paper-jr-badges");
        }
        catch (_e) {
            // ignore
        }
    }
    return {
        registerColumns,
        unregisterColumns,
        buildBadges,
        buildTextSummary,
        lookupCompactRecord,
        lookupChineseIndex,
        lookupCCF
    };
})();
