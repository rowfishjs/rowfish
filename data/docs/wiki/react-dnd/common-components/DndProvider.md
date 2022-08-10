---
sidebar_position: 1
---

React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# DndProvider

DndProvider 组件为你的应用程序提供 React-DnD 功能。这必须是通过 `backend` 属性注入后端，但也可以注入 `window` 对象。

### 使用

```jsx
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export default class YourApp {
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        /* 你的拖动和放置组件/应用 */
      </DndProvider>
    )
  }
}
```

### Props

- **`backend`**: 必选.一个 React DnD 后端。除非你正在编写自定义的后端，否则你可能希望使用 React DnD 附带的 [HTML5 后端](../backends/HTML5.md)。
- **`context`**: 可选. 用于配置后端的后端上下文。这取决于后端实现。
- **`options`**: 可选. 用于配置后端的选项对象。这取决于后端实现。
