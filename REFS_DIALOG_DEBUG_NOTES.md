# Refs Dialog Debug Notes

## 背景

这次修的是 `工具 -> 抓取文献` 打开 `selectRefs` 对话框后只有空框、没有数据的问题。问题并不只在参考文献抓取接口，也出在对话框初始化链路本身。

## 现象

实际排查过程中出现过这些报错：

- `ReferenceError: document is not defined`
- `TypeError: this.getDocument().getElementById(...) is null`
- `TypeError: listbox is null`
- `TypeError: selectionRanges[0] is undefined`
- `TypeError: param7 is null`
- `TypeError: this.io is undefined`

这些报错叠加后，会导致对话框虽然弹出，但列表无法渲染，最终表现为“只有框，没有参考文献列表”。

## 根因

### 1. 参考文献缓存字段不完整

旧数据里可能只有：

- `_references_info`

但缺少：

- `_references_DOI`
- `_references_isDuplicated`

这会导致后续对话框代码在解析 DOI 或重复状态时直接崩掉。

### 2. 对话框工具层错误依赖全局 `document`

`ai4paper-dialog-utils.js` 里原来直接使用裸 `document`，但某些对话框脚本运行上下文里没有这个全局，结果初始化阶段直接抛错。

### 3. `selectRefs.js` 依赖不稳定的 `this`

`selectRefs.js` 原来把 `window.arguments[0]` 存到 `this.io`，但后续事件回调和初始化调用并不保证 `this === methodsBody`。这会导致：

- `acceptSelection()` 里 `this.io` 是 `undefined`
- `selectAll()` / `handleCheckboxChange()` 里 `this.io` 也是不稳定的

### 4. 初始化右键面板时错误地假设有事件对象

`buildContextMenu(null, true)` 是初始化路径，本意只是预创建 panel，但函数内部仍然直接访问：

```js
param7.target.closest(...)
```

因此会报：

```js
TypeError: param7 is null
```

## 修复点

### 1. 先修对话框公共工具层

文件：
[ai4paper-dialog-utils.js](/Users/changpengcheng/zot/ai4paper/chrome/content/scripts/ai4paper-dialog-utils.js)

处理方式：

- 增加 `getWindow()` / `getDocument()`
- 优先取当前激活窗口或最近的对话框窗口
- 所有列表、checkbox、搜索框、panel 获取都加空值保护

这一步的目标是：即使页面结构不完整，也不要在初始化阶段直接把对话框打崩。

### 2. 修参考文献缓存容错

文件：
[ai4paper-refs.js](/Users/changpengcheng/zot/ai4paper/chrome/content/scripts/ai4paper-refs.js)

处理方式：

- `_references_info` 为空时强制重抓
- 旧缓存只有 `_references_info` 时，自动补齐 `_references_DOI` / `_references_isDuplicated`
- Crossref 请求优先读 `works/{doi}` 的原始 `message.reference`

这一步的目标是：先保证“有数据可给对话框”。

### 3. 修 `selectRefs.js` 的状态入口

文件：
[selectRefs.js](/Users/changpengcheng/zot/ai4paper/chrome/content/selectionDialog/selectRefs.js)

处理方式：

- `init()` 一开始就写入 `methodsBody.io`
- 不再使用 `this.io`
- 统一改成 `methodsBody.io`

重点修改的方法：

- `init`
- `selectAll`
- `acceptSelection`
- `handleCheckboxChange`

这一步的目标是：避免事件回调上下文变化导致状态丢失。

### 4. 修 `buildContextMenu()` 的初始化路径

处理方式：

- `param8 === true` 时允许只初始化 panel
- `param7` 不存在时直接返回 panel
- `param7.target`、`closest('richlistitem')`、`checkbox.label` 全部做空值保护

这一步的目标是：右键面板初始化和真正右键点击两条路径分开处理。

## 这次得到的经验

### 1. Zotero 对话框代码不要依赖裸 `document`

尤其是抽公共工具后，不能默认每个调用点的全局上下文都一致。更稳的做法是统一从当前对话框窗口取 `document`。

### 2. 对话框状态不要放在不稳定的 `this` 上

这类老式对象写法里，`this` 很容易被事件系统改写。像 `io` 这种核心状态，应固定挂在：

```js
methodsBody.io
```

或者显式模块对象上。

### 3. 初始化路径和交互路径要分开

像 `buildContextMenu(null, true)` 这种调用，本质是“预创建 UI 容器”，不是“处理一次真实事件”。函数内部不能混着写。

### 4. 先让 UI 不崩，再看数据

这次最开始容易误判成“Crossref 没返回数据”。但实际上真正阻断用户看到列表的是对话框脚本崩了。以后遇到“空框”问题，优先确认：

1. 数据有没有拿到
2. 对话框有没有初始化成功
3. 列表节点有没有真正插进去

## 后续建议

- 把 `selectionDialog/` 下几个对话框统一做一层基类或 helper，避免每个文件重复维护 `io`、搜索、滚动、右键面板逻辑。
- 后续 TS 化时，优先把“对话框输入输出结构”定义成显式类型，减少 `window.arguments[0]` 这种隐式结构错误。
- 对 `_references_info`、`_references_DOI`、`_references_isDuplicated` 建一个统一的 cache normalizer，不要在多个入口各自补字段。
