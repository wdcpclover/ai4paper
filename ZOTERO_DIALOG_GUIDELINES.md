# Zotero Dialog Guidelines

## 目的

这份文档用于约束 `selectionDialog/` 及类似 Zotero 对话框的实现方式，减少以下常见问题：

- 对话框能打开，但内容不渲染
- 事件回调里 `this` 丢失
- `document` / `window` 上下文不一致
- `window.arguments[0]` 结构变化后整页崩溃
- 同类对话框重复维护搜索、滚动、右键面板、勾选状态逻辑

适用文件包括：

- `chrome/content/selectionDialog/*.js`
- `chrome/content/selectionDialog/*.xhtml`
- `chrome/content/scripts/ai4paper-dialog-utils.js`

## 设计原则

### 1. 状态挂在模块对象上，不挂在 `this`

不要这样写：

```js
this.io = window.arguments[0];
```

应统一写成：

```js
methodsBody.io = window.arguments && window.arguments[0] ? window.arguments[0] : fallbackIO;
```

原因：

- `dialogaccept`
- `click`
- `command`
- `setTimeout`
- 箭头函数和普通函数混用

都会让 `this` 变得不稳定。

### 2. 公共工具不要假设全局 `document` 一定可用

统一通过工具层取当前窗口和文档：

```js
Zotero.AI4Paper.DialogUtils.getWindow()
Zotero.AI4Paper.DialogUtils.getDocument()
```

原因：

- Zotero 对话框和主窗口并不总是同一个上下文
- 复用工具层后，更不能依赖调用点的全局对象

### 3. 初始化路径和交互路径必须分开

像这类函数：

```js
buildContextMenu(event, initOnly)
```

要明确区分两种调用：

- `initOnly === true`
  只是预创建 UI 容器
- `event` 存在
  才是一次真实交互

不要在初始化路径里直接访问：

```js
event.target.closest(...)
```

### 4. 先容错，再渲染

对话框渲染前先校验输入结构，不要默认数据字段一定完整。

特别是这些历史缓存字段：

- `_references_info`
- `_references_DOI`
- `_references_isDuplicated`

旧数据可能只存在其中一部分。

## 推荐结构

## 对话框 JS 基本骨架

```js
var methodsBody = function () {};

methodsBody.io = null;

methodsBody.getFallbackIO = function () {
  return {
    dataIn: {
      data: [],
      item: {}
    },
    dataOut: null
  };
};

methodsBody.init = function () {
  methodsBody.io = window.arguments && window.arguments[0]
    ? window.arguments[0]
    : methodsBody.getFallbackIO();

  document.addEventListener('dialogaccept', () => methodsBody.acceptSelection());

  methodsBody.initUI();
  methodsBody.loadPrefs();
  methodsBody.render();
};
```

核心要求：

- `io` 只从一个入口写入
- `render()` 只消费已经规范化的数据
- `acceptSelection()` 只写 `methodsBody.io.dataOut`

## 输入输出规范

### 输入

统一约定：

```js
methodsBody.io = {
  dataIn: {
    item: {},
    data: []
  },
  dataOut: null
};
```

最低要求：

- `dataIn` 不存在时兜底为空对象
- `dataIn.data` 不存在时兜底空数组
- `dataIn.item` 不存在时兜底空对象

### 输出

勾选型对话框统一约定：

```js
methodsBody.io.dataOut = {
  [value]: label
};
```

没有选择时：

```js
methodsBody.io.dataOut = null;
```

## UI 编码规范

### 1. 每次取元素都允许失败

不要这样写：

```js
document.getElementById("x").textContent = "..."
```

应优先这样写：

```js
let elem = document.getElementById("x");
if (elem) elem.textContent = "...";
```

特别是这些容易在不同对话框里缺失的元素：

- 搜索框
- richlistbox
- 统计说明文字
- 右键 panel
- A-Z 过滤按钮

### 2. 右键菜单和 panel 必须惰性初始化

推荐模式：

```js
let panel = DialogUtils.initContextPanel(panelId, opts, initOnly);
if (!panel) return;
if (initOnly) return panel;
if (!event || !event.target) return panel;
```

### 3. 列表渲染逻辑不要夹杂状态写入

`buildItemNodes()` 只负责：

- 生成节点
- 绑定事件
- 挂载到 listbox

不要同时做：

- 远程请求
- 批量写 prefs
- 重置核心缓存字段

这些动作应在渲染前或渲染后明确分层。

## DialogUtils 规范

`ai4paper-dialog-utils.js` 只做“可复用 UI 能力”，不要混入具体业务语义。

适合放进去的内容：

- 获取当前对话框窗口/文档
- richlistbox 全选/搜索/显示全部
- panel / menupopup 初始化
- checkbox / input 与 prefs 同步
- 滚动位置读写
- DOI 在线打开
- 摘要文本格式化

不适合放进去的内容：

- 特定业务的缓存字段名
- 特定对话框的数据拼接规则
- 具体文献解析逻辑

## 数据规范化建议

对进入对话框的数据，先做 normalize，再渲染。

例如参考文献场景，建议保留一个统一入口：

```js
normalizeRefsCache(item)
```

职责只包括：

- 补齐 `_references_info`
- 补齐 `_references_DOI`
- 补齐 `_references_isDuplicated`
- 保证分隔后的数组长度可用

不要把 UI 渲染、网络请求、重复检测也混进去。

## 回归检查清单

每次改对话框，至少手动检查以下几点：

1. 对话框能否正常打开
2. 列表是否真正渲染出来
3. 单项勾选是否生效
4. 全选/取消全选是否生效
5. 搜索后列表过滤是否正常
6. 搜索后再全选是否只选可见项
7. 右键菜单或右键 panel 是否能打开
8. `dialogaccept` 后 `dataOut` 是否正确返回
9. 空数据时是否只显示空列表，而不是直接报错
10. 旧缓存字段不完整时是否仍然可打开

## TS 化建议

后续如果继续工程化，优先把对话框输入输出结构类型化。

例如：

```ts
interface DialogIO<TIn, TOut> {
  dataIn: TIn;
  dataOut: TOut | null;
}
```

参考文献场景可以进一步拆：

```ts
interface SelectRefsInput {
  item: Record<string, unknown>;
  data: Array<string | { title: string; checked?: boolean }>;
}

interface SelectRefsOutput {
  [key: string]: string;
}
```

这样至少能先解决两类问题：

- `window.arguments[0]` 结构不明确
- `_references_*` 字段在不同入口下类型漂移

## 当前结论

这类 Zotero 对话框最容易出问题的不是“功能逻辑复杂”，而是“上下文和状态边界不清晰”。

后面继续重构时，优先级应是：

1. 固定状态入口
2. 固定窗口/文档入口
3. 把初始化路径和交互路径拆开
4. 先 normalize 数据，再渲染 UI
5. 最后才是 TS 化和模块拆分
