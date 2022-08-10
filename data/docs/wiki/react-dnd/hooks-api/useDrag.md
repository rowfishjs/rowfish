---
sidebar_position: 2
---
React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# useDrag

`useDrag` 钩子提供了一种将组件连接到 DnD 系统作为*拖动源*的方法。通过将规范传递给`useDrag`，你可以声明性地描述正在生成的可拖动对象的`type` 、表示拖动源的`item` 对象、`collect`的props等等。 `useDrag` 钩子返回几个关键项目：一组已收集的props的set，以及可能附加到*拖动源*和*拖动元素*元素的`ref`

```jsx
import { useDrag } from 'react-dnd'

function DraggableComponent(props) {
  const [collected, drag, dragPreview] = useDrag(() => ({
    type,
    item: { id }
  }))
  return collected.isDragging ? (
    <div ref={dragPreview} />
  ) : (
    <div ref={drag} {...collected}>
      ...
    </div>
  )
}
```

#### 参数

- **`spec`** 对象规范或创建对象规范的函数。有关对象规范的详细信息，请参见下文
- **`deps`** 用于记忆的依赖数组。这类似于内置的 `useMemo` React 钩子。默认值为函数规范的空数组，以及包含对象规范的规范数组。

#### 返回值数组

- **`[0] - Collected Props`**：一个包含从 collect 函数收集的属性的对象。如果没有定义 `collect` 函数，则返回一个空对象。
- **`[1] - Drag Source Ref`**：用于拖动源的连接器函数。这必须附加到 DOM 的可拖动部分。
- **`[2] - Drag Preview Ref`**：用于拖动预览的连接器函数。这可以附加到 DOM 的预览部分。

### 对象成员的规则

- **`type`**: 必需。这必须是字符串或symbol。只有为相同类型注册的拖动目标才会对此项目做出反应。阅读 [概述](../quick-start/overview) 以了解有关项目和类型的更多信息。

- **`item`**: 必需 _(object or function)_.
  - 当这是一个对象时，它是一个描述被拖动数据的普通 JavaScript 对象。这是拖放目标可用的关于拖动源的 _only_ 信息，因此选择他们需要知道的 _minimal_ 数据很重要。你可能很想在此处放置一个复杂的引用，但你应该尽量避免这样做，因为它会耦合拖动源和放置目标。使用类似 `{ id }` 的东西是个好主意。
  - 当这是一个函数时，它在拖动操作开始时被触发并返回一个表示拖动操作的对象（参见第一个项目符号）。如果返回null，则取消拖动操作。

- **`previewOptions`**: 可选. 一个描述拖动预览选项的plain JavaScript 对象。

* **`options`**: 可选. 一个pain对象，包含以下任何属性：

  - **`dropEffect`**: 可选: 要在此拖动上使用的放置效果的类型。(“Move”或“Copy”是有效值。)

* **`end(item, monitor)`**: 可选.当拖动停止时，调用 `end`。对于每个 `begin` 调用，都会保证有一个相应的 `end` 调用。你可以调用 `monitor.didDrop()` 来检查该放置是否由兼容的放置目标处理。如果它已被处理，并且放置目标通过从其 `drop()` 方法返回一个plain对象指定了一个*放置结果*，则它将作为 `monitor.getDropResult()` 可用。这种方法是触发 Flux action的好地方。主题：如果组件在拖拽时卸载，`component`参数设置为`null`。

* **`canDrag(monitor)`**: 可选. 使用它来指定当前是否允许拖动。如果你想始终允许它，只需省略此方法。如果你想基于 `props` 上的某些值禁用拖动，则指定它很方便。注意：你不能在这个方法中调用`monitor.canDrag()`。

* **`isDragging(monitor)`**: 可选. 默认情况下，只有发起拖动操作的拖动源才被认为是拖动的。你可以通过定义自定义的 `isDragging` 方法来覆盖此行为。它可能会返回类似于 `props.id === monitor.get Item().id` 的内容。如果原始组件可能在拖动过程中被卸载并且稍后用不同的父级“复活”，请执行此操作。例如，当在看板中的列表中移动卡片时，你希望它保留拖动的外观 - 即使从技术上讲，每次将组件移动到另一个列表时都会卸载组件并安装不同的组件。注意：你不能在这个方法中调用`monitor.isDragging()`。
- **`collect`**: 可选. 收集函数。它应该返回 props 的plain对象以返回并注入到你的组件中。它接收两个参数，`monitor` 和 `props`。阅读 [overview](../quick-start/overview) 以了解监视器和收集功能的介绍。请参阅下一节中详细介绍的收集功能。
