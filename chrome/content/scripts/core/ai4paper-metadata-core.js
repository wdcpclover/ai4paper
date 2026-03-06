"use strict";
var AI4PaperMetadataCore = (() => {
    function extractJCRQ(catalogStr) {
        if (!catalogStr) {
            return "";
        }
        if (catalogStr.lastIndexOf(")") !== catalogStr.length - 1) {
            return "";
        }
        const match = catalogStr.match(/\(([^)]*)\)/);
        return match ? match[1] : "";
    }
    function formatLocalDateTime(dateStr, dateOnly) {
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
    function sanitizeFilename(filename) {
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
    function resetMetadataTarget(target) {
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
    function applyCslData(target, cslData) {
        target._Data_itemType = cslData?.type ?? null;
        target._Data_title = cslData?.title ?? null;
        const authors = Array.isArray(cslData?.author) ? cslData.author : [];
        target._Data_firstNames = authors.map((author) => author?.given).filter(Boolean);
        target._Data_lastNames = authors.map((author) => author?.family).filter(Boolean);
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
        extractJCRQ,
        formatLocalDateTime,
        resetMetadataTarget,
        sanitizeFilename
    };
})();
