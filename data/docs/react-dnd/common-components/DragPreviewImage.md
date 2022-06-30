---
sidebar_position: 2
---

React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# DragPreviewImage

将 HTML Image 元素呈现为断开连接的拖动预览的组件。

### Usage

```jsx
import { DragSource, DragPreviewImage } from 'react-dnd'

function DraggableHouse({ connectDragSource, connectDragPreview }) {
  return (
    <>
      <DragPreviewImage src="house_dragged.png" connect={connectDragPreview} />
      <div ref={connectDragSource}>🏠</div>
    </>
  )
}
export default DragSource(
  /* ... */
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
  })
)
```

### Props

- **`connect`**: 必选. 拖动预览连接器函数
