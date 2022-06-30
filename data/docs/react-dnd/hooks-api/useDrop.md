---
sidebar_position: 3
---
React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# useDrop

`useDrop` 钩子提供了一种将组件连接到 DnD 系统作为*放置目标*的方法。通过将规则传递到 `useDrop` 钩子中，你可以指定包括哪些放置目标将 `accept`的数据项的类型、哪些被`collect` 使用的 props 等等。此函数返回一个数组，其中包含要附加到放置目标节点和已手机的props的 ref。

```jsx
import { useDrop } from 'react-dnd'

function myDropTarget(props) {
  const [collectedProps, drop] = useDrop(() => ({
    accept
  }))

  return <div ref={drop}>Drop Target</div>
}
```

#### 参数

- **`spec`** 规则对象或创建规则对象的函数。有关规范对象的详细信息，请参见下文
- **`deps`** 用于记忆的依赖数组。这类似于React内置的 `useMemo` 钩子。默认值为函数规范的空数组，以及包含对象规则的数组。

#### 返回值数组

- **`[0] - Collected Props`**: 包含从 collect 函数收集的属性的对象。如果没有定义 `collect` 函数，则返回一个空对象。
- **`[1] - DropTarget Ref`**: 放置目标的连接器函数。这必须附加到 DOM 的放置目标部分。
### 对象成员的规则

- **`accept`**: 必选. 字符串、symbol或两者的数组。此放置目标只会对指定类型的[拖动源](../hooks-api/useDrag) 生成的项目作出反应。阅读 [概述](../quick-start/Overview) 以了解有关项目和类型的更多信息。

* **`options`**: 可选. 一个普通对象。如果组件的某些 props 不是标量（即不是原始值或函数），则在 `options` 对象内指定自定义 `arePropsEqual(props, other Props)` 函数可以提高性能。除非你有性能问题，否则无需担心这个。

* **`drop(item, monitor)`**: 可选. 当拖动的项目放置在目标上时调用。你可以返回undefined或普通对象。如果你返回一个对象，它将成为放置结果并且将在其 `endDrag` 方法中像`monitor.getDropResult()` 一样作为拖动源使用。如果你想根据接收到放置目标执行不同的操作，这很有用。如果你有嵌套的放置目标，你可以通过检查 `monitor.didDrop()` 和 `monitor.getDropResult()` 来测试嵌套目标是否已经处理了 `drop`。这个方法和源的 `endDrag` 方法都是触发 Flux 动作的好地方。如果定义了 `canDrop()` 并返回 `false`，则不会调用此方法。

* **`hover(item, monitor)`**: 可选. 当项目悬停在组件上时调用。你可以检查 `monitor.isOver({ shallow: true })` 以测试悬停只是发生在当前目标上还是在嵌套目标上。与 `drop()` 不同，即使定义了 `canDrop()` 并返回 `false`，也会调用此方法。你可以检查 `monitor.canDrop()` 来测试是否是这种情况。

* **`canDrop(item, monitor)`**: 可选. 使用它来指定放置目标是否能够接受该项目。如果你想始终允许它，只需省略此方法。如果你想基于 `props` 或 `monitor.getItem()` 上的某些属性来禁用放置，指定它会很方便。 注意：你不能在这个方法中调用`monitor.canDrop()`。 _

- **`collect`**: 可选. 收集函数。它应该返回 props 的普通对象来注入到你的组件中。它接收两个参数，`monitor` 和 `props`。阅读 [overview](../quick-start/Overview) 以了解监视器和收集功能的介绍。请参阅下一节中详细介绍的收集功能。