---
sidebar_position: 4
---
React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# useDragLayer

`use Drag Layer` 钩子允许你将组件连接到 DnD 系统中作为一个 _drag layer_(拖动层) 。

```jsx
import { useDragLayer } from 'react-dnd'

function DragLayerComponent(props) {
  const collectedProps = useDragLayer(
    monitor => /* Collected Props */
  )
  return <div>...</div>
}
```

#### 参数

- **`collect`**: 必需. The collecting function. It should return a plain object of the props to return for injection into your component. It receives two parameters, `monitor` and `props`. Read the [overview](../quick-start/Overview.md) for an introduction to the monitors and the collecting function. See the collecting function described in detail in the next section.
  收集函数。它应该返回 props 的plain对象以注入到你的组件中。它接收两个参数，`monitor` 和 `props`。阅读 [overview](../quick-start/Overview.md) 以了解监视器和收集功能的介绍。请参阅下一节中详细介绍的收集函数。

#### 返回值
从 collect 函数收集的属性的对象.
