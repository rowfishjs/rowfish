---
sidebar_position: 1
---

# 概述

React DnD与大多数拖放库不同，如果你以前从未使用过它，它可能会令人生畏。但是，一旦你了解了其设计核心的一些概念，它就会开始变得有意义。我建议你在阅读其余文档之前先阅读这些概念。
其中一些概念类似于 [Flux](http://facebook.github.io/flux/) 和 [Redux](https://github.com/reactjs/react-redux)架构。
这不是巧合，因为 React DnD 内部使用了 Redux。

### 项目和类型

与 Flux（或 Redux）一样，React DnD 使用数据而不是视图作为事实的来源。当你在屏幕上拖动某些东西时，我们不会说正在拖动组件或 DOM 节点。相反，我们说某个*类型*的*项目*正在被拖动。
什么是项目？ 项目是一个普通的 Javascript对象,用于描述正在拖动的内容。例如，在看板应用程序中，当你拖动卡片时，项目可能看起来像`{ card Id: 42 }`。在国际象棋游戏中，当你拿起一块棋子时，该项目可能看起来像 `{ from Cell: 'C5', piece: 'queen' }`。 **将拖动的数据描述为一个普通对象可以帮助你保持组件解耦。**
那么什么是类型呢？ *类型*是一个字符串（或 [symbol](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol)），是在你的应用程序中一种类别的所有项目的唯一标识 。在看板应用程序中，你可能有一个代表可拖动卡片的`'card'`类型和一个代表这些卡片的可拖动列表的 `'list'`类型。在国际象棋中，你可能只有一个`'piece'` 类型。
类型很有用，因为随着你的应用程序的增长，你可能希望使更多的东西可拖动，但你不一定希望所有现有的放置目标突然开始对新项目做出反应。 **这些类型让你可以指定兼容的拖动源和放置目标。** 你可能会在应用程序中使用枚举类型常量来赋值类型，类似于枚举 Redux 操作类型的方式。

### 监视器

拖放本质上是有状态的。拖动操作要么正在进行，要么没有。要么存在当前类型和当前项，要么没有。此状态必须位于某个地方。
React DND通过内部状态存储(称为_monitors_)上的几个小包装器将此状态公开给组件。**监视器允许你更新组件的props，以响应拖和放的状态更改。**
对于需要跟踪拖放状态的每个组件，你可以定义一个_collecting 函数_，它从监视器中检索其相关位置。然后，React DND负责及时调用collection函数，并将其返回值合并到组件的props中。
假设你希望在拖动棋子时高亮显示国际象棋单元格。`Cell`组件的收集函数可能如下所示：

```jsx
function collect(monitor) {
  return {
    highlighted: monitor.canDrop(),
    hovered: monitor.isOver()
  }
}
```

它指示 React DnD 将`highlighted` 和`hovered` 的最新值作为props传递给所有 Cell 实例。

### 连接器
如果后端处理 DOM 事件，但是组件使用 React 来描述 DOM，那么后端如何知道要监听哪些 DOM 节点呢？输入_connectors_ 。 **连接器允许你在`render`函数中将预定义角色之一（拖动源、拖动预览或放置目标）分配给 DOM 节点**。

事实上，连接器作为第一个参数传递给我们上面描述的_collecting函数_。让我们看看如何使用它来指定放置目标：

```jsx
function collect(connect, monitor) {
  return {
    highlighted: monitor.canDrop(),
    hovered: monitor.isOver(),
    connectDropTarget: connect.dropTarget()
  }
}
```

在组件的`render`方法中，我们可以访问从监视器获取的数据，以及从连接器获取的函数：

```jsx
render() {
  const { highlighted, hovered, connectDropTarget } = this.props;

  return connectDropTarget(
    <div className={classSet({
      'Cell': true,
      'Cell--highlighted': highlighted,
      'Cell--hovered': hovered
    })}>
      {this.props.children}
    </div>
  );
}
```

调用`connect Drop Target` 告诉 React DnD组件的根 DOM 节点是一个有效的放置目标，并且它的悬停和放置事件应该由后端处理。在内部，它通过将 [callback ref](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) 附加到你给它的 React 元素来工作。连接器返回的函数是记忆化的，所以它不会破坏 `should Component Update` 优化。

### 拖放源和拖放目标
到目前为止，我们已经介绍了使用 DOM 的后端、由项目和类型表示的数据，以及收集功能，借助监视器和连接器，你可以描述 React DnD 应该注入到组件的props。

但是我们如何配置我们的组件以实际注入这些props呢？我们如何执行副作用以响应拖放事件？满足_拖动源_和_放置目标_，这是React DnD的主要抽象单元。**它们真正将类型、项目、副作用和收集功能与你的组件联系在一起。**

每当你想让一个组件或它的某些部分可拖动时，你需要将该组件包装到一个_drag source_声明中。每个拖动源都注册了一个特定的 _type(类型)_ ，并且必须实现一个从组件的 props 生成 _item(项目)_ 的方法。它还可以选择指定一些其他方法来处理拖放事件。拖动源声明还允许你为给定组件指定_collecting function(收集函数)_。

*放置目标*与拖动源非常相似。唯一的区别是单个放置目标可以同时注册多个项目类型，而不是生成项目，它可以处理其悬停或放置。

### 后端
React DnD 使用 [HTML5 拖放 API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop)。这是一个合理的默认设置，因为它会截取拖动的 DOM 节点并将其用作开箱即用的“拖动预览”。当光标移动时，你不必进行任何绘图，这很方便。此 API 也是处理文件删除事件的唯一方法。

不幸的是，HTML5 拖放 API 也有一些缺点。它不适用于触控屏，并且它在 IE 上提供的定制机会比在其他浏览器中少。

这就是为什么 **HTML5 拖放支持在 React DnD 中以可插入的方式实现**。你不必使用它。你可以完全基于触控事件、鼠标事件或其他东西编写不同的实现。这种可插入的实现在 React DnD 中称为_后端_。

该库目前附带 [HTML Backend](../backends/html5)，对于大多数 Web 应用程序来说应该足够了。还有一个 [Touch Backend](../backends/touch) 可用于移动 Web 应用程序。

后端的作用与 React 的合成事件系统相似：**它们抽象出浏览器的差异并处理本地 DOM 事件。** 尽管有相似之处，但 React DnD 后端并不依赖于 React 或其合成事件系统。在后台，所有后端所做的就是将 DOM 事件转换为 React DnD 可以处理的内部 Redux 操作。

### Hooks vs 高阶组件
现在你应该对 React DnD 的各部分有所了解：
- 项目对象和类型
- 通过flux实现的DnD状态
- 用于观察DnD状态的监视器
- 将监视器输出转换为props消费的收集器功能
- 用于将DnD状态机连接到视图节点（例如 DOM 元素）的连接器

现在让我们谈谈这些部分是如何在你的组件中组合在一起的。你有两个选择：基于hooks的API 和基于经典装饰器的 API。
> 译者注: 本文档只翻译Hooks API

### Hooks(钩子)

现代 React 应用程序已经用hooks取代了高阶组件模式。 Hooks 是 React 的一个特性，在 16.8 中引入，它允许开发人员编写有状态的函数组件。它们也非常适合管理有状态组件，以及与外部的有状态系统交互（\***cough**\* 就像拖放引擎 \***cough**\*）。

如果你对 React hooks 不熟悉，请参阅 React 博客文章，[Hooks介绍](https://reactjs.org/docs/hooks-intro.html)。
React-DnD 提供了将组件连接到 DnD 引擎的钩子，并允许你使用收集监视器状态进行渲染。
有关基于 hooks 的 API 的概述，请参阅 [Hooks概述](../hooks-api/HooksOverview) 页面。

### 总结
现在你对React DnD有了足够的了解，可以浏览正式的使用文档了！
[Hooks概述](../hooks-api/HooksOverview)文档页面是很好的起点。或者直接跳入 [教程应用程序](https://juejin.cn/post/7002414597768478751) 并构建一个国际象棋游戏！