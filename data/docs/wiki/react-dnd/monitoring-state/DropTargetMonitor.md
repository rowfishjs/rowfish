---
sidebar_position: 2
---
React DnD 新手？在进入文档之前请[阅读概述](../quick-start/overview)

# DropTargetMonitor

`Drop Target Monitor` 是传递给 [hooks-based](../hooks-api/useDrop) 的收集函数的对象。它的方法让你可以获取有关特定放置目标的拖动状态的信息。绑定到该监视器的特定放置目标在下面称为监视器的_所有者_。

### 方法列表

- **`canDrop()`**：如果正在进行拖动操作，则返回`true`，并且所有者的`canDrop()`返回`true`或未定义。

- **`isOver(options)`**：如果正在进行拖动操作，并且指针当前悬停在所有者上，则返回 `true`。你可以选择传递 `{ shallow: true }` 来严格检查是否 `_only_` 所有者被悬停，而不是嵌套目标。

- **`getItemType()`**：返回一个字符串或一个符号，标识当前拖动项的类型。如果没有项目被拖动，则返回 `null`。

- **`getItem()`**：返回一个表示当前拖动项目的普通对象。每个拖动源都必须通过从其 `beginDrag()` 方法返回一个对象来指定它。如果没有项目被拖动，则返回 `null`。

- **`getDropResult()`**：返回一个表示最后记录的丢弃结果的普通对象。放置目标可以选择通过从它们的 `drop()` 方法返回一个对象来指定它。当为嵌套目标调度`drop()`操作流时，自下而上，任何从 `drop()` 显式返回其自己的结果的父级都会覆盖子级先前设置的删除结果。如果在 `drop()` 之外调用，则返回 `null`。


- **`didDrop()`** 如果某个放置目标已经处理了放置事件，则返回 `true`，否则返回 `false`。即使目标没有返回丢弃结果，`didDrop()` 也会返回 `true`。在 `drop()` 中使用它来测试任何嵌套的放置目标是否已经处理了放置。如果在 `drop()` 外部调用，则返回 `false`。

- **`getInitialClientOffset()`**：返回当前拖动操作开始时指针的`{ x, y }`客户端偏移量。如果没有项目被拖动，则返回 `null`。

- **`getInitialSourceClientOffset()`**：返回当前拖拽操作开始时拖拽源组件的根DOM节点的`{ x, y }`客户端偏移量。如果没有项目被拖动，则返回 `null`。

- **`getClientOffset()`**：在拖动操作正在进行时返回指针的最后记录的`{ x, y }`客户端偏移量。如果没有项目被拖动，则返回 `null`。

- **`getDifferenceFromInitialOffset()`**：返回上次记录的指针客户端偏移量与当前拖动操作开始时的客户端偏移量之间的差值。如果没有项目被拖动，则返回 `null`。

- **`getSourceClientOffset()`**：根据当前拖动操作开始时的位置，返回拖动源组件的根DOM节点的投影的`{ x, y }`客户端偏移量，和运动差异。如果没有项目被拖动，则返回 `null`。
