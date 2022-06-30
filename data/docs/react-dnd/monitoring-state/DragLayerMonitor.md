---
sidebar_position: 3
---
React DnD 新手？在进入文档之前请[阅读概述](../quick-start/overview)

# DragLayerMonitor

`Drag Layer Monitor` 是传递给 [hooks-based](../hooks-api/useDragLayer.md)拖动层的collecting函数的对象.它的方法让你获得有关全局拖动状态的信息。

### 方法列表

- **`isDragging()`**：如果正在进行拖动操作，则返回 `true`。否则返回 `false`。

- **`getItemType()`**：返回一个字符串或一个符号，标识当前拖动项的类型。如果没有项目被拖动，则返回 `null`。

- **`getItem()`**：返回一个表示当前拖动项目的普通对象。每个拖动源都必须通过从其 `begin Drag()` 方法返回一个对象来指定它。如果没有项目被拖动，则返回 `null`。

- **`getInitialClientOffset()`**：返回当前拖动操作开始时指针的`{ x, y }`客户端偏移量。如果没有项目被拖动，则返回 `null`。

- **`getInitialSourceClientOffset()`**：返回当前拖拽操作开始时拖拽源组件的根DOM节点的`{ x, y }`客户端偏移量。如果没有项目被拖动，则返回 `null`。

- **`getClientOffset()`**：在拖动操作正在进行时返回指针的最后记录的`{ x, y }`客户端偏移量。如果没有项目被拖动，则返回 `null`。

- **`getDifferenceFromInitialOffset()`**：返回上次记录的指针客户端偏移量与当前拖动操作开始时的客户端偏移量之间的差值。如果没有项目被拖动，则返回 `null`。

- **`getSourceClientOffset()`**：根据当前拖动操作开始时的位置，返回拖动源组件的根DOM节点的投影的`{ x, y }`客户端偏移量，和运动差异。如果没有项目被拖动，则返回 `null`。
