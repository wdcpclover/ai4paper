function init() {
  Zotero.ZoteroIF.update_svg_icons(document);
  document.getElementById("zoteroif.customPublicationTitle.path").value = Zotero.Prefs.get("zoteroif.customPublicationTitlePath");
  document.getElementById("zoteroif.enableCustomPublicationTitle").checked = Zotero.Prefs.get("zoteroif.enableCustomPublicationTitle");
  document.getElementById("zoteroif.customJournalAbbr.path").value = Zotero.Prefs.get("zoteroif.customJournalAbbrPath");
  document.getElementById("zoteroif.enableCustomJournalAbbr").checked = Zotero.Prefs.get("zoteroif.enableCustomJournalAbbr");
  updateTable_customPublicationTitle();
  updateTable_customJournalAbbr();
}
async function choosePath_customPublicationTitle() {
  var {
      FilePicker: _0x565c39
    } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs"),
    var1 = new _0x565c39();
  try {
    let var2 = Zotero.Prefs.get("zoteroif.customPublicationTitlePath");
    var2 && var2 != "system" && (var1.displayDirectory = PathUtils.parent(var2));
  } catch (_0x3e3448) {
    Zotero.debug(_0x3e3448);
  }
  var1.init(window, "选择 CSV", var1.modeOpen);
  var1.appendFilter("CSV File (*.csv)", "*.csv");
  if ((await var1.show()) != var1.returnOK) {
    return false;
  }
  Zotero.Prefs.set("zoteroif.customPublicationTitlePath", var1.file);
  document.getElementById('zoteroif.customPublicationTitle.path').value = var1.file;
}
async function choosePath_customJournalAbbr() {
  var {
      FilePicker: _0x4f7738
    } = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs"),
    var3 = new _0x4f7738();
  try {
    let var4 = Zotero.Prefs.get("zoteroif.customJournalAbbrPath");
    if (var4 && var4 != 'system') {
      var3.displayDirectory = PathUtils.parent(var4);
    }
  } catch (_0x47d921) {
    Zotero.debug(_0x47d921);
  }
  var3.init(window, "选择 CSV", var3.modeOpen);
  var3.appendFilter('CSV\x20File\x20(*.csv)', "*.csv");
  if ((await var3.show()) != var3.returnOK) return false;
  Zotero.Prefs.set("zoteroif.customJournalAbbrPath", var3.file);
  document.getElementById('zoteroif.customJournalAbbr.path').value = var3.file;
}
async function importData_customPublicationTitle() {
  const var5 = document.querySelector("#zoteroif-customPublicationTitle-table-tbody");
  var5?.["querySelectorAll"]('tr')["forEach"](_0x57ce99 => _0x57ce99.remove());
  let var6 = Zotero.Prefs.get("zoteroif.customPublicationTitlePath");
  if (!var6) {
    window.alert("请先选择 CSV 文件路径！");
    return;
  }
  let var7 = await importData(var6, true);
  if (!var7) return;
  Zotero.Prefs.set("zoteroif.customPublicationTitleData", JSON.stringify(var7));
  for (let var8 in var7) {
    const _0x1bca43 = document.createElement('tr'),
      _0x2071b3 = document.createElement('td');
    _0x2071b3.textContent = var8;
    _0x1bca43.appendChild(_0x2071b3);
    const _0x2c68db = document.createElement('td');
    _0x2c68db.textContent = var7[var8];
    _0x1bca43.appendChild(_0x2c68db);
    var5.appendChild(_0x1bca43);
  }
  document.getElementById("customPublicationTitle_resultMessage").style.display = '';
  document.getElementById("customPublicationTitle_resultMessage").textContent = "📍 表格已刷新，共载入【" + Object.keys(var7).length + "】行数据！";
}
async function importData_customJournalAbbr() {
  const var12 = document.querySelector("#zoteroif-customJournalAbbr-table-tbody");
  var12?.['querySelectorAll']('tr')["forEach"](_0x52385c => _0x52385c.remove());
  let var13 = Zotero.Prefs.get("zoteroif.customJournalAbbrPath");
  if (!var13) {
    window.alert("请先选择 CSV 文件路径！");
    return;
  }
  let var14 = await importData(var13, false);
  if (!var14) return;
  Zotero.Prefs.set("zoteroif.customJournalAbbrData", JSON.stringify(var14));
  for (let var15 in var14) {
    const var16 = document.createElement('tr'),
      var17 = document.createElement('td');
    var17.textContent = var15;
    var16.appendChild(var17);
    const var18 = document.createElement('td');
    var18.textContent = var14[var15];
    var16.appendChild(var18);
    var12.appendChild(var16);
  }
  document.getElementById('customJournalAbbr_resultMessage').style.display = '';
  document.getElementById("customJournalAbbr_resultMessage").textContent = "📍 表格已刷新，共载入【" + Object.keys(var14).length + "】行数据！";
}
async function importData(param1, param2) {
  let var19 = await Zotero.File.getContentsAsync(param1);
  if (!var19.trim()) {
    window.alert("CSV 文件中无数据！");
    return;
  }
  let var20 = var19.split('\x0a');
  if (var20.length === 0x1) {
    window.alert("CSV 文件中仅包含表头，请完善数据！");
    return;
  }
  var20 = var20.slice(0x1);
  let var21 = {};
  for (let var22 of var20) {
    if (!var22.includes(',')) continue;
    let _0x3bbafb = var22.split(',').map(_0x72b311 => _0x72b311.replace(/🌝/g, ',')),
      _0xdafe8d = _0x3bbafb[0x0].trim().toLowerCase(),
      _0x402aeb = param2 ? _0x3bbafb[0x1].trim().toLowerCase() : _0x3bbafb[0x1].trim();
    if (!_0xdafe8d || !_0x402aeb) continue;
    var21[_0xdafe8d] = _0x402aeb;
  }
  if (JSON.stringify(var21) !== '{}') {
    return var21;
  } else return window.alert('CSV\x20文件解析出错！可能数据填写格式不符合要求！'), false;
}
function updateTable_customPublicationTitle() {
  if (!Zotero.Prefs.get("zoteroif.customPublicationTitleData") || Zotero.Prefs.get('zoteroif.customPublicationTitleData') === '{}') return;
  const var26 = document.querySelector('#zoteroif-customPublicationTitle-table-tbody');
  var26?.['querySelectorAll']('tr')["forEach"](_0x366932 => _0x366932.remove());
  let var27 = JSON.parse(Zotero.Prefs.get("zoteroif.customPublicationTitleData"));
  for (let var28 in var27) {
    const var29 = document.createElement('tr'),
      var30 = document.createElement('td');
    var30.textContent = var28;
    var29.appendChild(var30);
    const var31 = document.createElement('td');
    var31.textContent = var27[var28];
    var29.appendChild(var31);
    var26.appendChild(var29);
  }
  document.getElementById("customPublicationTitle_resultMessage").style.display = '';
  document.getElementById("customPublicationTitle_resultMessage").textContent = '📍\x20共【' + Object.keys(var27).length + '】行数据！';
}
function updateTable_customJournalAbbr() {
  if (!Zotero.Prefs.get('zoteroif.customJournalAbbrData') || Zotero.Prefs.get("zoteroif.customJournalAbbrData") === '{}') return;
  const var32 = document.querySelector("#zoteroif-customJournalAbbr-table-tbody");
  var32?.["querySelectorAll"]('tr')["forEach"](_0x293a26 => _0x293a26.remove());
  let var33 = JSON.parse(Zotero.Prefs.get("zoteroif.customJournalAbbrData"));
  for (let var34 in var33) {
    const _0x9f7638 = document.createElement('tr'),
      _0x398bd8 = document.createElement('td');
    _0x398bd8.textContent = var34;
    _0x9f7638.appendChild(_0x398bd8);
    const _0x329901 = document.createElement('td');
    _0x329901.textContent = var33[var34];
    _0x9f7638.appendChild(_0x329901);
    var32.appendChild(_0x9f7638);
  }
  document.getElementById("customJournalAbbr_resultMessage").style.display = '';
  document.getElementById("customJournalAbbr_resultMessage").textContent = "📍 共【" + Object.keys(var33).length + "】行数据！";
}