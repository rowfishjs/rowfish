---
sidebar_position: 1
---
React DnD 新手？在进入文档之前请[阅读概述](../quick-start/overview)

# DragSourceMonitor

`Drag Source Monitor` 是传递给 [hooks-based](../hooks-api/useDrag.md)拖动源的collecting函数的对象。它的方法让你可以获取有关特定拖动源的拖动状态的信息。绑定到该监视器的特定拖动源在下面称为监视器的_所有者_。

### 方法列表

- **`canDrag()`**：如果没有进行拖动操作，则返回`true`，并且所有者的`canDrag()`返回`true`或未定义。

- **`isDragging()`**：如果正在进行拖动操作，并且所有者启动了拖动，或者它的 `isDragging()` 已定义并返回 `true`，则返回 `true`。

- **`getItemType()`**：返回一个字符串或一个符号，标识当前拖动项的类型。如果没有项目被拖动，则返回 `null`。

- **`getItem()`**：返回一个表示当前拖动项目的普通对象。每个拖动源都必须通过从其 `beginDrag()` 方法返回一个对象来指定它。如果没有项目被拖动，则返回 `null`。

- **`getDropResult()`**：返回一个表示最后记录的丢弃结果的普通对象。放置目标可以选择通过从它们的 `drop()` 方法返回一个对象来指定它。当为嵌套目标调度`drop()`操作流时，自下而上，任何从 `drop()` 显式返回其自己的结果的父级都会覆盖子级先前设置的子级删除结果。如果在 `endDrag()` 之外调用，则返回 `null`。

- **`didDrop()`** 如果某个放置目标已经处理了放置事件，则返回 `true`，否则返回 `false`。即使目标没有返回丢弃结果，`didDrop()` 也会返回 `true`。在 `endDrag()` 中使用它来测试是否有任何放置目标处理了放置。如果在 `endDrag()` 之外调用，则返回 `false`。

- **`getInitialClientOffset()`**：返回当前拖动操作开始时指针的`{ x, y }`客户端偏移量。如果没有项目被拖动，则返回 `null`。

- **`getInitialSourceClientOffset()`**：返回当前拖拽操作开始时拖拽源组件的根DOM节点的`{ x, y }`客户端偏移量。如果没有项目被拖动，则返回 `null`。

- **`getClientOffset()`**：在拖动操作正在进行时返回指针的最后记录的`{ x, y }`客户端偏移量。如果没有项目被拖动，则返回 `null`。

- **`getDifferenceFromInitialOffset()`**：返回上次记录的指针客户端偏移量与当前拖动操作开始时客户端偏移量之间的差值。如果没有项目被拖动，则返回 `null`。

- **`getSourceClientOffset()`**：根据当前拖动操作开始时的位置，返回拖动源组件的根DOM节点的投影的`{ x, y }`客户端偏移量以及运动差异。如果没有项目被拖动，则返回 `null`。