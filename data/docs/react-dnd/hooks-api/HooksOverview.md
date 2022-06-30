---
sidebar_position: 1
---

React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# 使用 Hook API

基于hooks的 React DnD API 利用了 React 的一项重要的新特性。 Hooks 极大地影响了大多数人编写 React 组件的方式，并且是在 React 中编写有状态和有效代码的推荐方法。在 hooks 出现之前，React 社区在高阶组件和基于装饰器的库上投入了大量精力。在将hooks引入 React 社区之后，在转向使用hooks而不是基于装饰器的技术的方法和库方面发生了巨大转变。

在概述页面中，指出拖放交互本质上是`_stateful_`(状态)。因此，React DnD 被设计为利用 Flux 数据模式和模型拖放状态，使用actions和reducers（独立于 React）。 Hooks 是在 React 中利用有状态数据源的完美方式。事实上，这是 React 中许多状态管理库所采用的方法！

提供了三个主要的钩子来将你的组件连接到 React DnD 中，并且提供了第四个钩子来让你接入React DnD 中（用于测试或开发目的）

- [`useDrag`](../hooks-api/useDrag)
- [`useDrop`](../hooks-api/useDrop)
- [`useDragLayer`](../hooks-api/useDragLayer)
- [`useDragDropManager`](../hooks-api/useDragDropManager) (_dev/test hook_)

## 基本示例

要开始使用hooks，首先让我们制作一个可拖动的框来作为示范。

```jsx
import { useDrag } from 'react-dnd'

function Box() {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
		// "type" 是必需的. 它用于"accept"(接收)拖放目标的规则
    type: 'BOX',
		// collect 函数使用一个"monitor"实例 (请参阅概述了解这是什么)
		// 从 DnD 系统中提取重要的状态。
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    {/* 这是可选的.默认情况下, 拖动预览将附加到拖动源 */}
    <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1}}>
        {/* 拖动 ref 将此节点标记为“拾取”节点 */}
        <div role="Handle" ref={drag} />
    </div>
  )
}
```

现在，让我们为此做一些事情。

```jsx
function Bucket() {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // 要接受的类型（或类型） - 字符串或symbols
    accept: 'BOX',
    // collect的props
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))

  return (
    <div
      ref={drop}
      role={'Dustbin'}
      style={{ backgroundColor: isOver ? 'red' : 'white' }}
    >
      {canDrop ? 'Release to drop' : 'Drag a box here'}
    </div>
  )
}
```
要进一步探索，请阅读单独的hooks API 文档，或查看 GitHub 上的 [基于hooks的示例](https://github.com/react-dnd/react-dnd/tree/main/packages/examples-hooks)。
