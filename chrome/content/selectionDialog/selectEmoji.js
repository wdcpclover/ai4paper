var methodsBody = function () {};
methodsBody.init = function () {
  methodsBody.io = window.arguments && window.arguments[0] ? window.arguments[0] : {
    dataIn: [],
    dataOut: null
  };
  Zotero.AI4Paper.update_svg_icons(document);
  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());

  // var sbc = document.getElementById('zotero-select-Emoji-container');
  // Zotero.setFontSize(sbc);

  var listbox = document.getElementById("zotero-selectEmoji-links");
  for (var i in methodsBody.io.dataIn) {
    var item = methodsBody.io.dataIn[i];
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
      if (methodsBody.io.dataIn.length === 10 && checkbox.checked) {
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
  document.getElementById('zotero-selectEmoji-intro').textContent = Zotero.Prefs.get('ai4paper.blockquotelinkstyledialogcaption');
};
methodsBody.acceptSelection = function () {
  var listbox = document.getElementById("zotero-selectEmoji-links");
  let items = Zotero.AI4Paper.DialogUtils.getCheckedItems(listbox);
  if (items.length) {
    methodsBody.io.dataOut = new Object();
    for (let item of items) {
      methodsBody.io.dataOut[item.value] = item.label;
    }
  } else {
    methodsBody.io.dataOut = null;
  }
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
