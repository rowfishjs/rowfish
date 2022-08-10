---
sidebar_position: 3
---

React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# 测试

React DnD 是测试友好的。可以测试整个拖放交互，包括你的组件的渲染，以及你响应拖放事件执行的副作用。

有几种不同的方法来测试 React 组件。 React DnD 没有固执己见，让你可以使用其中的任何一个。 **并非所有方法都要求浏览器事件系统可用。**

React DnD 的`examples`文件夹中包含了一些测试示例。在 `react-dnd` 根文件夹中运行 `yarn install` 和 `yarn test` 来启动它们。

### 隔离测试组件

如果你只对单独测试组件的渲染感兴趣，而不是它们的交互，你可以使用 React DnD 包装的任何类上可用的 `Decorated Component` 静态属性来访问原始类。然后，你可以使用不同的 props 对其进行测试，而不依赖于 React DnD，提供一个标识函数来存根连接器方法。

```jsx
import React from 'react'
import TestUtils from 'react-dom/test-utils'
import expect from 'expect'
import Box from './components/Box'

it('can be tested independently', () => {
  // 在 React DnD 包装之前获取对组件的引用
  const OriginalBox = Box.DecoratedComponent

  // 使用标识函数存根 React DnD 连接器函数
  const identity = (el) => el

  // 使用一组props的设置渲染并测试
  let root = TestUtils.renderIntoDocument(
    <OriginalBox name="test" connectDragSource={identity} />
  )
  let div = TestUtils.findRenderedDOMComponentWithTag(root, 'div')
  expect(div.props.style.opacity).toEqual(1)

  // 使用另一组props的设置渲染并测试
  root = TestUtils.renderIntoDocument(
    <OriginalBox name="test" connectDragSource={identity} isDragging />
  )
  div = TestUtils.findRenderedDOMComponentWithTag(root, 'div')
  expect(div.props.style.opacity).toEqual(0.4)
})
```

### 测试拖放交互

#### 测试后端

如果你想测试整个交互，而不仅仅是单个组件的渲染，你可以使用 [test backend](../backends/Test)。 **测试后端不需要 DOM** 所以你也可以将它与 [`ReactShallowRenderer`](https://facebook.github.io/react/docs/test-utils.html#shallow-rendering)一起使用。

This is currently the least documented part of React DnD because it exposes the underlying concepts from the [DnD Core](https://github.com/react-dnd/dnd-core), the library powering React DnD inside. You can learn more about the test backend and its methods from the [DnD Core tests](https://github.com/react-dnd/dnd-core/tree/v1.1.0/src/__tests__).

首先，你需要安装测试后端：

```
npm install --save-dev react-dnd-test-backend
```

以下是一些帮助你入门的示例：

```jsx
import React from 'react'
import { wrapInTestContext } from 'react-dnd-test-utils'
import { DragDropContext } from 'react-dnd'
import TestUtils from 'react-dom/test-utils'
import expect from 'expect'
import Box from './components/Box'

it('can be tested with the testing backend', () => {
  // 使用使用测试后端的测试上下文进行渲染
  const [BoxContext, getBackend] = wrapInTestContext(Box)
  const root = TestUtils.renderIntoDocument(<BoxContext name="test" />)

  // 测试不透明度为1
  let div = TestUtils.findRenderedDOMComponentWithTag(root, 'div')
  expect(div.props.style.opacity).toEqual(1)

  // 找到拖拽源ID，用它来模拟拖拽操作
  const box = TestUtils.findRenderedComponentWithType(root, Box)
  getBackend().simulateBeginDrag([box.getHandlerId()])

  // 验证 div 是否更改了其不透明度
  div = TestUtils.findRenderedDOMComponentWithTag(root, 'div')
  expect(div.style.opacity).toEqual(0.4)

  // 有关更多信息，请参阅其他 TestBackend.simulate* 方法！
})
```

#### 模拟 DOM

你可以在你的测试库中使用 [HTML 5 后端](../backends/HTML5) 或 [touch 后端](../backends/Touch.md)加上 [jsdom](https://github.com/jsdom/jsdom) 。许多测试库，例如 [Jest](https://jestjs.io/docs/en/configuration#testenvironment-string)，默认使用 jsdom。

注意jsdom没有Drag Event或[Data Transfer](https://github.com/jsdom/jsdom/issues/1568)对象，拖拽和文件拖拽测试时会影响预览图。事件交互也不会操作与渲染有关的属性，如元素宽度或坐标。
但是，你可以自己将这些值添加到你的事件对象属性中。

### 库

#### Enzyme

[Enzyme](https://github.com/airbnb/enzyme) is a commonly-used tool for testing React components.
Because of a [bug in Enzyme](https://github.com/airbnb/enzyme/issues/1852), you'll want to wrap your component in a fragment when you mount it.
You can then store a ref to your wrapped component and use this ref to access the current `DragDropMananger` instance and call its methods.

```jsx
const [BoxContext] = wrapInTestContext(Box)

const ref = React.createRef()
const root = Enzyme.mount(
  <>
    <BoxContext ref={ref} name="test" />
  </>
)

// ...

const backend = ref.current.getManager().getBackend()
```

#### React测试库

下面是一个使用 HTML5 后端直接测试 DOM 交互的示例：

```jsx
render(<Board />)
let boardSquares = screen.getAllByRole('gridcell')
let dropSquare = boardSquares[0]
let knight = boardSquares[18].firstChild

fireEvent.dragStart(knight)
fireEvent.dragEnter(dropSquare)
fireEvent.dragOver(dropSquare)
fireEvent.drop(dropSquare)
```

如果你需要数据传输属性，这些也可以[被添加](https://testing-library.com/docs/dom-testing-library/api-events).
