"use strict";
var AI4PaperCore = (() => {
    const PREF_BRANCH = "ai4paper.";
    const COLOR_HEX_BY_LABEL = {
        "黄色": "#ffd400",
        "红色": "#ff6666",
        "绿色": "#5fb236",
        "蓝色": "#2ea8e5",
        "紫色": "#a28ae5",
        "洋红色": "#e56eee",
        "橘色": "#f19837",
        "灰色": "#aaaaaa"
    };
    const COLOR_LABELS = Object.keys(COLOR_HEX_BY_LABEL);
    function getPref(key) {
        return Zotero.Prefs.get(PREF_BRANCH + key);
    }
    function setPref(key, value) {
        Zotero.Prefs.set(PREF_BRANCH + key, value);
    }
    function getColorHexByLabel(label) {
        if (!label) {
            return "";
        }
        return COLOR_HEX_BY_LABEL[label] || "";
    }
    function getSelectedVocabularyColor() {
        return getColorHexByLabel(getPref(AI4PaperPrefs.KEYS.annotationColorSelect));
    }
    function isVocabularyAnnotation(annotation) {
        if (!annotation) {
            return false;
        }
        return annotation.annotationType === "highlight" && annotation.annotationColor === getSelectedVocabularyColor();
    }
    function getExcludedAnnotationRule(setting) {
        if (!setting || setting === "无") {
            return {
                color: null,
                types: null,
                disabled: true
            };
        }
        if (setting === "全部颜色（下划线）") {
            return { color: null, types: ["underline"], disabled: false };
        }
        if (setting === "全部颜色（文本）") {
            return { color: null, types: ["text"], disabled: false };
        }
        if (setting === "全部颜色（下划线与文本）") {
            return { color: null, types: ["underline", "text"], disabled: false };
        }
        for (const label of COLOR_LABELS) {
            const color = COLOR_HEX_BY_LABEL[label];
            if (setting === label || setting === `${label}（高亮）`) {
                return { color, types: ["highlight"], disabled: false };
            }
            if (setting === `${label}（下划线）`) {
                return { color, types: ["underline"], disabled: false };
            }
            if (setting === `${label}（下划线与文本）`) {
                return { color, types: ["underline", "text"], disabled: false };
            }
        }
        return {
            color: null,
            types: null,
            disabled: true
        };
    }
    function isExcludedAnnotation(annotation, setting = getPref(AI4PaperPrefs.KEYS.autoAnnotationsColorExcluded)) {
        if (!annotation) {
            return false;
        }
        const rule = getExcludedAnnotationRule(setting);
        if (rule.disabled) {
            return false;
        }
        if (rule.types && !rule.types.includes(annotation.annotationType || "")) {
            return false;
        }
        if (!rule.color) {
            return true;
        }
        return annotation.annotationColor === rule.color;
    }
    function shouldSkipAutoAnnotation(annotation) {
        if (!annotation) {
            return false;
        }
        if (!getPref(AI4PaperPrefs.KEYS.vocabularyBookDisable) && isVocabularyAnnotation(annotation)) {
            return true;
        }
        return isExcludedAnnotation(annotation);
    }
    function getNoteLineHeight() {
        return getPref(AI4PaperPrefs.KEYS.autoAnnotationsNoteLineHeight) === "宽松型" ? "宽松型" : "紧凑型";
    }
    function getNoteImageWidth() {
        const width = getPref(AI4PaperPrefs.KEYS.autoAnnotationsNoteImageWidth);
        if (width === "600px" || width === "700px" || width === "800px") {
            return width;
        }
        return "500px";
    }
    return {
        getPref,
        setPref,
        getColorHexByLabel,
        getSelectedVocabularyColor,
        getNoteLineHeight,
        getNoteImageWidth,
        isVocabularyAnnotation,
        getExcludedAnnotationRule,
        isExcludedAnnotation,
        shouldSkipAutoAnnotation
    };
})();
