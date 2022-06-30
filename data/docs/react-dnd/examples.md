---
title: 案例演示
sidebar_position: 6
sidebar_label: 案例演示
---

```mdx-code-block
import {
  DustbinSingleTarget,
  DustbinMultipleTargets,
  DustbinCopyOrMove,
  DustbinSingleTargetInIframe,
  DustbinStressTest,
  DragAroundCustomDragLayer,
  DragAroundNaive,
  NestingDragSources,
  NestingDropTargets,
  SortableCancelOnDropOutside,
  SortableSimple,
  SortableStressTest,
  CustomizeDropEffects,
  CustomizeHandlesAndPreviews,
  DragSourceRerender,
  RemountWithCorrectProps,
  OtherNativeFiles,
  OtherNativeHtml
} from '@site/data/demo/react-dnd';
import { CodePreview } from '@site/src/components/code';
import { DndProvider} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const codesandboxs = [
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/01-dustbin/single-target?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/01-dustbin/single-target-in-iframe?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/01-dustbin/copy-or-move?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/01-dustbin/multiple-targets?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/01-dustbin/stress-test?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/02-drag-around/naive?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/02-drag-around/custom-drag-layer?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/03-nesting/drag-sources?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/03-nesting/drop-targets?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/04-sortable/simple?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/04-sortable/cancel-on-drop-outside?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/04-sortable/stress-test?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/05-customize/handles-and-previews?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/05-customize/drop-effects?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/06-other/native-files?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/06-other/native-html?fontsize=14&hidenavigation=1&theme=dark'
]
```

```mdx-code-block
<DndProvider backend={HTML5Backend}>
```

## 垃圾桶

### 单一目标

这是最简单的拖放示例。
拖动下面的框并将它们放入垃圾箱。请注意，它具有中性、活动和悬停状态。拖动的项目本身会在拖动时更改不透明度。

```mdx-code-block
<CodePreview preview={<DustbinSingleTarget />} padding='1rem' codesandbox={codesandboxs[0]} />
```
### 在 iframe 内

这是同一个垃圾桶示例，但嵌套在 iframe 中。
当你使用[react-dnd-html5-backend](./backends/HTML5) 后端时，你只能在单个 HTML 文档中拖放。
在 iframe 中使用 react-dnd 需要在 iframe 中使用[DndProvider](./common-components/DndProvider)。

```mdx-code-block
<CodePreview preview={<DustbinSingleTargetInIframe />} padding='1rem' codesandbox={codesandboxs[1]} />
```

### 复制或移动

此示例演示了放置目标可以接受复制和移动的放置效果，用户在拖动时可以选择按住或释放 alt 键。
例如在一个待办事项列表应用中，默认的拖放操作可用于对列表进行排序，同时按住 alt 键拖放可以将待办事项复制到放置目标而不是移动它。

```mdx-code-block
<CodePreview preview={<DustbinCopyOrMove />} padding='1rem' codesandbox={codesandboxs[2]} />
```

### 多个目标

这是一个比较有趣的例子。它演示了单个放置目标如何接受多种类型，
以及如何从 props 派生这些类型。这也展示了本机文件和 URL 的处理（尝试将它们放到最后两个垃圾桶）。

```mdx-code-block
<CodePreview preview={<DustbinMultipleTargets />} padding='1rem' codesandbox={codesandboxs[3]} />
```

### 压力测试

此示例与上一个示例类似，但拖动源和放置目标的 props 每秒都在变化。它演示了 React DnD 会跟踪不断变化的 props，如果组件接收到新的 props，React DnD 会重新计算拖放状态。它还展示了自定义`isDragging`实现可以使拖动源显示为已拖动，即使已初始化的拖动组件已收到新的 props。

```mdx-code-block
<CodePreview preview={<DustbinStressTest />} padding='1rem' codesandbox={codesandboxs[4]} />
```

## 拖曳

### 干净的

这个例子干净地依赖于浏览器拖放实现，没有太多自定义逻辑。

当盒子被拖动时，我们通过返回移除它原来的 DOM 节点`render()` 中的 `null` 并让浏览器绘制
拖动预览。当盒子被释放时，我们在新的坐标处绘制它。
如果你尝试将框拖到容器外，浏览器将对它的返回值添加动画。

虽然这种方法适用于琐碎的情况，但它会在放置时闪烁。产生这
种现象是因为浏览器在删除和拖动预览之前我们有一个机会去使已经处于拖动中的项目被显示。如果你把原来的项目变暗而不是直接隐藏它,那么这也许就不是一个问题了,否则它就变得清晰可见了。

如果我们想添加自定义逻辑，例如捕捉到网格或边界
检查，我们只能在 drop 时执行此操作。我们没有办法
控制浏览器绘制后拖动预览会发生什么。
查看[自定义渲染示例](#自定义)

如果你愿意用更多的控制权来换取更多的工作。

```mdx-code-block
<CodePreview preview={<DragAroundNaive />} padding='1rem' codesandbox={codesandboxs[5]} />
```

### 自定义拖动层

浏览器 API 无法更改拖动预览或其拖动开始后的行为。 jQuery UI 等库实现
从头开始拖放以解决此问题，但做出 react-dnd 目前只支持浏览器拖放“后端”，所以我们必须接受
它的局限性。

然而，如果我们给浏览器填充一个空图像作为拖动预览，那么自定义行为一个非常好的处理方法。这个库提供了一个`DragLayer`可用于在你的应用程序顶部，用于绘制自定义预览组件的地方实现固定层。
请注意，如果我们愿意的话，我们可以在拖动上绘制完全不同的组件。这不仅仅是一个屏幕截图。

使用这种方法，在放置到容器外面时我们会错过默认的“返回”动画。但是，我们在自定义拖动反馈和零闪烁方面获得了极大的灵活性。

```mdx-code-block
<CodePreview preview={<DragAroundCustomDragLayer />} padding='1rem' codesandbox={codesandboxs[6]} />
```

## 嵌套

### 拖动源

你可以将拖动源相互嵌套。如果嵌套拖动源从 `canDrag` 返回 `false`，其父级将被询问，直到找到并激活可拖动的源。只有激活的拖动源才有的 `beginDrag()`和`endDrag()`被调用。

```mdx-code-block
<CodePreview preview={<NestingDragSources />} padding='1rem' codesandbox={codesandboxs[7]} />
```

### 放置目标

拖放目标也可以相互嵌套。不像拖拽源，多个放置目标在拖动中可能会对相同的项目做出反应，

React DnD 的设计没有提供停止冒泡的方法。取而代之的是放置目标可以比较 `monitor.isOver()` 和 `monitor.isOver({ shallow: false })` 以了解是否只有它们或其嵌套目标被悬停。他们还可以检查 `monitor.didDrop()` 和 `monitor.getDropResult()` 以了解嵌套目标是否已经处理了放置，甚至可以返回不同的放置结果。

```mdx-code-block
<CodePreview preview={<NestingDropTargets />} padding='1rem' codesandbox={codesandboxs[8]} />
```

## 排序

### 简单的

React DnD 为你提供了能够创建可排序列表的工具。为此，请将同一个组件设置为拖动源和放置目标，然后在`hover` 处理器中重新排序数据。

```mdx-code-block
<CodePreview preview={<SortableSimple />} padding='1rem' codesandbox={codesandboxs[9]} />
```

### 取消外部放置

因为你编写逻辑而不是使用现成的组件，所以你可以将行为调整为你的应用程序需要的行为。

在这个例子中，我们不是在放置目标的 `drop()` 处理程序中移动卡片，而是在拖动源的 `endDrag()` 处理器中移动卡片。这让我们可以检查 `monitor.didDrop()` 并在卡片被放到其容器之外时恢复拖动操作。

```mdx-code-block
<CodePreview preview={<SortableCancelOnDropOutside />} padding='1rem' codesandbox={codesandboxs[10]} />
```

### 压力测试

React DnD 可以同时处理多少个项目？一个列表中的有数千个项目。通过一些优化，例如在`requestAnimationFrame`回调函数中更新状态，它可以处理几千条数据而不会卡顿。在那之后，你是最好使用虚拟列表，例如[fixed-data-table](https://github.com/facebook/fixed-data-table)。

幸运的是，React DnD 被设计成与任何虚拟 React 数据列表组件可以配合使用，因为它在 DOM 不保留任何状态。

此示例不会自动滚动，但你可以在父放置目标中添加滚动，通过在它的`hover`处理器中比较`component.getBoundingClientRect()`与`monitor.getClientOffset()`。
事实上，欢迎你将此功能贡献给这个例子！

```mdx-code-block
<CodePreview preview={<SortableStressTest />} padding='1rem' codesandbox={codesandboxs[11]} />
```

## 自定义

### 拖动手柄和预览

React DnD 允许你选择可拖动节点，以及拖动组件的`render`函数中的预览节点。

加载[Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image)实例后，你还可以使用以编程方式创建的 Image 实例。

```mdx-code-block
<CodePreview preview={<CustomizeHandlesAndPreviews />} padding='1rem' codesandbox={codesandboxs[12]} />
```

### 放置效果

某些浏览器允许你为可拖动项目指定“放置效果”。在兼容的浏览器中，当你第一个框拖到放置区域上时将看到一个“复制”图标。

```mdx-code-block
<CodePreview preview={<CustomizeDropEffects />} padding='1rem' codesandbox={codesandboxs[13]} />
```

## 其他案例

### 本地文件

演示本机文件拖放的示例。

```mdx-code-block
<CodePreview preview={<OtherNativeFiles />} padding='1rem' codesandbox={codesandboxs[14]} />
```

### 本地 Html

演示本地 html 拖放的示例。非常适合从另一个选项卡或 iframe 拖动图像。

```mdx-code-block
<CodePreview preview={<OtherNativeHtml />} padding='1rem' codesandbox={codesandboxs[15]} />
```

```mdx-code-block
</DndProvider>
```
