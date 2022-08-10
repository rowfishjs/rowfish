---
hide_title: true
---
React DnD 是一组 React 实用工具，可帮助你构建复杂的拖放界面，同时保持组件解耦。它非常适合 Trello 和 Storify 等应用程序，在应用程序的不同部分之间通过拖动传输数据，并且组件会更改其外观和应用程序状态以响应拖放事件。

## 安装

```bash
pnpm install react-dnd react-dnd-html5-backend
```

第二个包将允许React DnD使用[HTML5的拖放API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop)。你可以选择使用第三方后端，例如 [触控后端](https://npmjs.com/package/react-dnd-touch-backend)。

## 它的代码大概如何?

```jsx
// 让我们使用<Card text='Write the docs' />可以被拖动!

import React from 'react'
import { useDrag } from 'react-dnd'
import { ItemTypes } from './Constants'

/**
 * 你的组件
 */
export default function Card({ isDragging, text }) {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { text },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1
      })
    }),
    []
  )
  return (
    <div ref={dragRef} style={{ opacity }}>
      {text}
    </div>
  )
}
```

## 特点

### 它适用于你的组件

React DnD 不是提供现成的小部件，而是包装你的组件并将props注入其中。如果你使用 React Router 或 Flummox，你已经知道这种模式。

### 它支持单向数据流

React DnD 完全包含 React 的声明式渲染范式，并且不会改变 DOM。它是对 Redux 和其他具有单向数据流的架构的一个很好的补充。事实上，它是建立在 Redux 之上的。

### 它隐藏了平台差异

HTML5 拖放有一个尴尬的 API，充满了陷阱和浏览器的不一致。 React DnD 在内部为你处理它们，因此你可以专注于开发应用程序，而不是解决浏览器错误。

### 它是可扩展和可测试的

React DnD 在底层使用 HTML5 拖放，但它也允许你提供自定义“后端”。你可以完全基于触控事件、鼠标事件或其他东西创建自定义的DnD后端。例如，内置的模拟后端让你可以在 Node 环境中测试组件的拖放交互。

## 触控支持

要支持触控，请使用带有[触控后端](https://npmjs.com/package/react-dnd-touch-backend)而不是HTML5后端的React DND。

## 无目标

React DnD 为你提供了一组强大的原始API，但它不包含任何现成的组件。它比 [jQuery UI](https://jqueryui.com/) 或 [interact.js](http://interactjs.io/) 更加接近底层，专注于正确的拖放交互，保留其视觉效果诸如轴约束或捕捉到你的操作。例如，React DnD不打算提供 `Sortable` 组件。取而代之的是它为你提供了构建你自己的工具所需的任何自定义渲染API。

## 支持和贡献

在[GitHub](https://github.com/react-dnd/react-dnd/issues)上讨论了问题和潜在的改进。

## 鸣谢

非常感谢 [Browser Stack](https://www.browserstack.com) 让维护人员使用他们的服务来调试浏览器问题。

## 协议

React DnD被授权为 MIT。随心所欲地使用它.
