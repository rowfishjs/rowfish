---
sidebar_position: 4
---

React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# 常见问题

## 用法

### 我在哪里可以得到预编译版？

```
npm install --save react-dnd
npm install --save react-dnd-html5-backend
```

### 如何测试 React DnD 组件及其交互？
相关示例，请参阅 [testing](./Testing) 教程。

### 如何使组件只能通过小手柄拖动？

将容器节点指定为 `dragPreview`，但仅将拖动句柄设为 `dragSource()`。
请参阅 [自定义拖动手柄示例](../examples#拖动手柄和预览)。

### 如何限制拖动预览移动？

默认情况下，你无法限制拖动预览移动，因为拖动预览是由浏览器绘制的。但是，你可以使用 [自定义拖动层](../examples#自定义拖动层)，你可以在其中自由渲染任何内容，包括任何捕捉或限制。

### 当类型依赖于 props 时，如何注册拖拽源或放置目标？

[`Drag Source`](../hooks-api/useDrag) 和 [`Drop Target`](../hooks-api/useDrop) 都允许你将函数作为第一个参数而不是字符串或Symbol传递.如果你传递一个函数，它将被赋予当前的props，它应该返回一个字符串、一个Symbol或（仅用于放置目标）一个数组。

### 如何在一个组件中组合多个拖放源和拖放目标？

因为 [`Drag Source`](../hooks-api/useDrag) 和 [`Drop Target`](../hooks-api/useDrop) 使用部分应用程序，你可以使用函数组合助手来组合它们，例如[`_.flow`](https://lodash.com/docs#flow)。使用装饰器，你可以堆叠装饰器以达到相同的效果。

### 为什么`beginDrag`/`endDrag`/`drop`/`hover`方法中的`component`参数总是`null`？

使用[函数组件](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions)时，无法正常附加refs。但是，如果你使用 [React.forwardRef](https://reactjs.org/docs/forwarding-refs.html)，那么你可以访问渲染的组件。如果你的组件通过 [useImperativeHandle钩子](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)暴露API，那么你可以通过这种方式暴露函数。

如果你使用类似 [babel-react-optimize](https://github.com/jamiebuilds/babel-react-optimize#transform-react-pure-class-to-function)预设或 [babel-plugin-transform -react-pure-class-to-function](https://github.com/jamiebuilds/babel-react-optimize/tree/master/packages/babel-plugin-transform-react-pure-class-to-function) ，请注意，你的类定义可能会隐式转换为函数组件，这可能会导致一个null参数。

```jsx
import { DragSource } from 'react-dnd'
import flow from 'lodash/flow'

class YourComponent {
  /* ... */
}

export default flow(DragSource(/* ... */), DropTarget(/* ... */))(YourComponent)
```

### 如何为本地文件注册放置目标？

如果你使用的是 [HTML5后端](../backends/HTML5)，你可以为它导出的一种`NativeTypes` 注册一个放置目标：

```jsx
import React from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'
import { DropTarget } from 'react-dnd'

const fileTarget = {
  drop(props, monitor) {
    console.log(monitor.getItem().files)
  }
}

function FileDropZone({ connectDropTarget, isOver, canDrop }) {
  return connectDropTarget(
    <div>
      {!isOver && !canDrop && 'Drag files from the hard drive'}
      {!isOver && canDrop && 'Drag the files here'}
      {isOver && 'Drop the files'}
    </div>
  )
}

export default DropTarget(NativeTypes.FILE, fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(FileDropZone)
```

### 如何编写自定义后端？

这目前没有文档，但你可以从 [HTML5](../backends/HTML5) 和 [Test](../backends/Test) 后端实现中获取思路。后端规则包括 `setup()` 和 `teardown()` 方法，以及 `connectDragSource()`、`connectDragPreview()` 和 `connectDropTarget()` 方法将 DOM 节点传递到后端.欢迎对文档的贡献。

### 我收到“Super expression must either be null or a function, not undefined”错误

React DnD 需要 React 16.8。确保你至少使用该版本。

### 为什么我的静态方法和属性不起作用？

Consider this example:

```javascript
class Page {
  static willTransitionTo(transition, params) {
    /* ... */
  }

  render() {
    /* ... */
  }
}

export default DragDropContext(HTML5Backend)(Page)
```

在这种情况下，你的路由处理程序的 `willTransitionTo`（或类似方法）不会被触发，这可能会让你感到惊讶！ React DnD 不会代理组件的静态方法和属性。这太脆弱并且充满了边缘情况，所以你必须自己做。为此，请将你的静态数据放到 React DnD 返回的组件上：

```javascript
class Page {
  render() {
    /* ... */
  }
}

Page = DragDropContext(HTML5Backend)(Page)
Page.willTransitionTo = function (transition, params) {
  /* ... */
}

export default Page
```
⚛
