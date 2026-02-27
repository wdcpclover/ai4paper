var methodsBody = function () {};
methodsBody.init = function () {
  Zotero.ZoteroIF.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());

  // var sbc = document.getElementById('zotero-select-Emoji-container');
  // Zotero.setFontSize(sbc);

  this.io = window.arguments[0];
  var listbox = document.getElementById("zotero-selectEmoji-links");
  for (var i in this.io.dataIn) {
    var item = this.io.dataIn[i];
    var title,
      checked = false;
    if (item && typeof item == "object" && item.title !== undefined) {
      title = item.title;
      checked = !!item.checked;
    } else {
      title = item;
    }
    let itemNode = document.createXULElement("richlistitem");
    let checkbox = document.createXULElement("checkbox");
    checkbox.checked = checked;
    checkbox.label = title;
    checkbox.setAttribute("native", "true");
    itemNode.setAttribute("value", i);
    itemNode.append(checkbox);
    itemNode.addEventListener('click', event => {
      if (event.target == itemNode) {
        checkbox.checked = !checkbox.checked;
      }
      if (this.io.dataIn.length === 10 && checkbox.checked) {
        methodsBody.singleSelect(checkbox);
      }
    });
    listbox.append(itemNode);
  }

  // Check item if there is only one
  if (listbox.itemCount === 1) {
    listbox.getItemAtIndex(0).firstElementChild.checked = true;
  }
  // captioin 刷新
  document.getElementById('zotero-selectEmoji-intro').textContent = Zotero.Prefs.get('zoteroif.blockquotelinkstyledialogcaption');
};
methodsBody.acceptSelection = function () {
  var listbox = document.getElementById("zotero-selectEmoji-links");
  var returnObject = false;
  this.io.dataOut = new Object();
  for (var i = 0; i < listbox.childNodes.length; i++) {
    var itemNode = listbox.childNodes[i];
    if (itemNode.firstElementChild.checked) {
      this.io.dataOut[itemNode.getAttribute("value")] = itemNode.firstElementChild.getAttribute("label");
      returnObject = true;
    }
  }
  if (!returnObject) this.io.dataOut = null;
};
methodsBody.singleSelect = function (_checkbox) {
  var listbox = document.getElementById("zotero-selectEmoji-links");
  for (var i = 0; i < listbox.childNodes.length; i++) {
    let checkbox = listbox.childNodes[i].querySelector('checkbox');
    if (checkbox != _checkbox) {
      checkbox.checked = false;
    }
  }
};