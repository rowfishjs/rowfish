---
sidebar_position: 2
---
React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# 触控后端

HTML5 后端不支持触控事件。所以它不适用于平板电脑和移动设备。你可以将 `react-dnd-touch-backend` 用于触控设备。

### 安装

运行以下命令安装触控后端。

```
npm install react-dnd-touch-backend
```

### 使用

```jsx
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd'

class YourApp {
  <DndProvider backend={TouchBackend} options={opts}>
    {/* Your application */}
  </DndProvider>
}
```

### 选项

- **enableTouchEvents**(default: true)

  是否启用基于触控的事件处理。

- **enableMouseEvents**(default: false)

  是否启用基于点击的事件处理。

  **注意**：这是错误的，因为与 mousedown/mouseup/click 相比，touchstart/touchend 事件传播有差异。

- **enableKeyboardEvents** (default: false)

  是否启用键盘事件处理。

- **delay** (default: 0)

  延迟处理所有事件的毫秒数

- **delayTouchStart** (default: 0)

  延迟处理触控事件的毫秒数

- **delayMouseStart** (default: 0)

  延迟处理鼠标事件的毫秒数

- **touchSlop** (default: 0)

  指定在发出拖动信号之前移动的像素距离。

- **ignoreContextMenu** (default: false)

  如果为 true，则在取消拖动时阻止 contextmenu 事件。

- **scrollAngleRanges**: (default: undefined)

  指定应忽略拖动事件的角度范围（以度为单位）。当你希望允许用户沿特定方向滚动而不是拖动时，这很有用。度数顺时针移动，0/360 指向左侧。

  ```jsx
  // allow vertical scrolling
  const options = {
    scrollAngleRanges: [
      { start: 30, end: 150 },
      { start: 210, end: 330 }
    ]
  }
  // allow horizontal scrolling
  const options = {
    scrollAngleRanges: [{ start: 300 }, { end: 60 }, { start: 120, end: 240 }]
  }
  ```

- **enableHoverOutsideTarget**: (default: undefined)

  当指针离开放置目标区域时继续拖动当前拖动的元素

- **getDropTargetElementsAtPoint** (default: undefined) - 使用 document.elementsFromPoint 或 polyfill

  指定自定义函数以在给定点查找放置目标的元素。对于在 document.elementsFromPoint不可用的环境（iOS Safari）中提高性能很有用。

  ```jsx
  const hasNative =
    document && (document.elementsFromPoint || document.msElementsFromPoint)

  function getDropTargetElementsAtPoint(x, y, dropTargets) {
    return dropTargets.filter((t) => {
      const rect = t.getBoundingClientRect()
      return (
        x >= rect.left && x <= rect.right && y <= rect.bottom && y >= rect.top
      )
    })
  }

  // 仅当元素elementsFromPoint不受支持时才使用自定义函数
  const backendOptions = {
    getDropTargetElementsAtPoint: !hasNative && getDropTargetElementsAtPoint
  }

  ;<DndProvider backend={TouchBackend} options={backendOptions}>
    /* 你的React组件/应用 */
  </DndProvider>
  ```
