---
sidebar_position: 1
---
React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# HTML5

这是 React-DnD 支持的主要后端。它使用 [HTML5 拖放 API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop)在引擎盖下并隐藏[其怪癖](http://quirksmode.org/blog/archives/2009/09/the_html5_drag.html)。

### 安装

```
npm install react-dnd-html5-backend
```

### Extras

除了默认导出之外，HTML5 后端模块还提供了一些额外功能：

- **`getEmptyImage()`**: 返回一个透明的空 [`图片`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image)的函数。使用[DragSourceConnector](../hooks-api/useDrag.md)的 `connect.dragPreview()` 完全遮罩浏览器内容来绘制拖动预览。方便绘制[使用“拖动层”的自定义拖动层](../hooks-api/useDragLayer.md)。请注意，自定义拖动预览在 IE 中不起作用。

- **`NativeTypes`**: 三个常量的枚举，`NativeTypes.FILE`, `NativeTypes.URL` 和`NativeTypes.TEXT`。你可以为这些类型注册[drop targets](../hooks-api/useDrop.md) 来处理原生文件、URL或常规页面文本的放置。

### 使用

```jsx
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export default function MyReactApp() {
  return (
    <DndProvider backend={HTML5Backend}>
      /* your drag-and-drop application */
    </DndProvider>
  )
}
```

当你在监视器上调用 `getItem()` 时，HTML5 后端会根据放置类型公开来自事件的各种数据：

- `NativeTypes.FILE`:
  - `getItem().files`, 文件数组
  - `getItem().items`, 使用 `event.dataTransfer.items`（你可以在放置目录时使用它来列出文件）
- `NativeTypes.URL`:
  - `getItem().urls`, 放置了URLs的数组
- `NativeTypes.TEXT`:
  - `getItem().text`, 已放置的文本
