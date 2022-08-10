---
sidebar_position: 3
---

```mdx-code-block
import { 
  FirstDemo,
  SecondDemo,
  ThirdDemo,
  FourthDemo,
  FifthDemo,
  SixthDemo,
  SeventhDemo,
  EighthDemo,
  NinthDemo,
  TenthDemo,
  EleventhDemo,
  TwelfthDemo,
  ThirteenthDemo,
  FourteenthDemo,
  FifteenthDemo,
  SixteenthDemo,
  SeventeenthDemo,
  EighteenthDemo,
  NineteenthDemo,
  TwentiethDemo,
  TwentyFirstDemo
} from '@site/data/demo/react-spring';
import { CodePreview } from '@site/src/components/code';
const codesandboxs = [
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/chain?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/animating-auto?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/card?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/css-keyframes?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/flip-card?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/slide?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/slide?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/tree?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/cards-stack?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/draggable-list?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/viewpager?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/goo-blobs?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/trail?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/goo-blobs?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/list-reordering?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/masonry?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/multistage-transition?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/notification-hub?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/simple-transition?fontsize=14&hidenavigation=1&theme=dark',
  'https://codesandbox.io/embed/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/exit-before-enter?fontsize=14&hidenavigation=1&theme=dark'
]
```
# Hooks API

## useChain

```tsx
import { useChain, animated } from 'react-spring'
```

设置之前定义的animation-hooks的执行顺序.你需要收集chain链的动画的refs以阻止动画自行启动,并且可以在后续渲染过程中更改顺序.

```tsx
// 构建一个spring并捕获它的ref
const springRef = useSpringRef()
const props = useSpring({ ...values, ref: springRef })
// 构建一个过渡并捕获它的ref 
const transitionRef = useSpringRef()
const transitions = useTransition({ ...values, ref: transitionRef })
// 首先运行 spring, 当它结束时运行过渡
useChain([springRef, transitionRef])
// 像往常一样使用动画道具animated props
return (
  <animated.div style={props}>
    {transitions(styles => (
      <animated.div style={styles} />
    ))}
  </animated.div>
)
```

你可以选择定义timeSteps(时间步长)以及一个timeFrame(时间框架),默认为一秒.timeSteps 只是一个偏移量在 0 - 1 之间的数组,对应于时间帧的开始和结束.

```tsx
// spring立即开始执行: 0.0 * 1000ms = 0ms
// 过渡将在以下时间之后开始: 0.5 * 1000ms (默认timeFrame值) = 500ms
useChain([springRef, transitionRef], [0, 0.5] /*1000*/)
```

### 演示
```mdx-code-block
<CodePreview preview={<FirstDemo />} height='18rem' codesandbox={codesandboxs[0]} />
```


## useSpring

```tsx
import { useSpring, animated } from 'react-spring'
```

将值变成动画-值.

### 编码流程

#### 更新动画

**1.通过覆盖传入值以更改动画**

如果你用改变的 props 重新渲染组件,动画会更新

```tsx
const styles =  useSpring({ opacity: toggle ?  1  :  0  })
```

**2.通过传递一个返回值的函数并使用api更新动画**

推荐使用这种方式,这可以用于防止直接覆盖带来的重复渲染问题并且使用起来更加灵活.详细使用请阅读[Imperatives & Refs](./common-api#命令与Refs)

```tsx
const [styles, api] = useSpring(() => ({ opacity: 1 }))
// 使用新的参数更新spring
api.start({ opacity: toggle ? 1 : 0 })
// 停止动画
api.stop()
```
#### 创建视图

返回值是一个包含动画props的对象.

```tsx
return <animated.div style={styles}>i will fade</animated.div>
```

### 属性
[通用API的Props](./common-api/#props) 中暴露的所有属性都适用.

### 附加说明

#### To-prop 快捷方式

任何`useSpring` 无法识别的属性都将组合成"to",例如 `opacity: 1` 将变为 `to: { opacity: 1 }`.

```tsx
// 简写 ...
const props = useSpring({ opacity: 1, color: 'red' })
// 等同于 ...
const props = useSpring({ to: { opacity: 1, color: 'red' } })
```

#### 异步chain(链)与脚本

`to`参数还允许你  
 1.  编写动画脚本
 2.  将多个动画串联在一起.由于这些动画将异步执行,请确保为基值提供 `from` 属性（否则,props 将为空）.

#### 创建脚本的方式

```tsx
function AsyncExample() {
  const styles = useSpring({
    to: async (next, cancel) => {
      await next({ opacity: 1, color: '#ffaaee' })
      await next({ opacity: 0, color: 'rgb(14,26,19)' })
    },
    from: { opacity: 0, color: 'red' }
  })
  // ...
  return <animated.div style={styles}>I will fade in and out</animated.div>
}
```

#### 创建chain的方式

```tsx live height=280px
function ChainExample() {
  const styles = useSpring({
    loop: true,
    to: [
      { opacity: 1, color: '#ffaaee' },
      { opacity: 0, color: 'rgb(14,26,19)' },
    ],
    from: { opacity: 0, color: 'red' },
  })
  // ...
  return <animated.div style={styles}>I will fade in and out</animated.div>
}
```

在渲染频繁的组件中使用异步功能时,你需要记忆你的`to`函数以防止重新渲染.

其中一个解决方式是使用 `useCallback` 钩子.

```tsx
useSpring({
  to: useCallback(async next => { ... }, []),
})
```

另一个解决方案是传递一个props函数.

```tsx
useSpring(() => ({
  to: async next => { ... },
}))
```

### Demos

```mdx-code-block
<div class="row" style={{ width: '100%',marginBottom: 16 }}>
    <div class="col col--6">
      <CodePreview preview={<SecondDemo />} height='18rem' codeTitle="Animating Auto"  codesandbox={codesandboxs[1]} />
    </div>
     <div class="col col--6">
     <CodePreview preview={<ThirdDemo />} height='18rem' codeTitle="Card"  codesandbox={codesandboxs[2]} />
     </div>
      <div class="col col--6">
      <CodePreview preview={<FourthDemo />} height='18rem' codeTitle="CSS Keyframes"  codesandbox={codesandboxs[3]} />
     </div>
      <div class="col col--6">
      <CodePreview preview={<FifthDemo />} height='18rem' codeTitle="CSS Variables"  codesandbox={codesandboxs[4]} />
     </div>
      <div class="col col--6">
      <CodePreview preview={<SixthDemo />} height='18rem' codeTitle="Flip Card"  codesandbox={codesandboxs[5]} />
     </div>
      <div class="col col--6">
      <CodePreview preview={<SeventhDemo />} height='18rem' codeTitle="Slide"  codesandbox={codesandboxs[6]} />
     </div>
      <div class="col col--6">
      <CodePreview preview={<EighthDemo />} height='18rem' codeTitle="SVG Filter"  codesandbox={codesandboxs[7]} />
     </div>
      <div class="col col--6">
      <CodePreview preview={<NinthDemo />} height='18rem' codeTitle="Tree"  codesandbox={codesandboxs[8]} />
      </div>
</div>
```

## useSprings

```tsx
import { useSprings, animated } from 'react-spring'
```

创建多个springs,每个spring都有自己的配置.可用于静态列表等.

### 编码流程

#### 更新动画

**1.通过覆盖传入值以更改动画**

如果你用改变的 props 重新渲染组件,动画会更新

```tsx
const springs = useSprings(
  number,
  items.map(item => ({ opacity: item.opacity }))
)
```

**2.通过传递一个返回值的函数并使用api更新动画**

推荐使用这种方式,这可以用于防止直接覆盖带来的重复渲染问题并且使用起来更加灵活.也可以选择使用stop函数作为第三个参数.

```tsx
const [springs, api] = useSprings(number, index => ({ opacity: 1 }))
// 使用新的参数更新spring
api.start(index => ({ opacity: 0 }))
// 停止所有springs
api.stop()
```

#### 创建视图

返回值是一个包含动画props的数组.

```tsx
return springs.map(styles => <animated.div style={styles} />)
```

### 属性

[通用API的Props](./common-api/#props) 中暴露的所有属性都适用.

### Demos

```mdx-code-block
<div class="row" style={{ width: '100%',marginBottom: 16 }}>
    <div class="col col--6">
      <CodePreview preview={<TenthDemo />} height='18rem' codeTitle="Cards Stack"  codesandbox={codesandboxs[9]} />
    </div>
     <div class="col col--6">
     <CodePreview preview={<EleventhDemo />} height='18rem' codeTitle="Draggable List"  codesandbox={codesandboxs[10]} />
     </div>
     <div class="col col--6">
      <CodePreview preview={<TwelfthDemo />} height='18rem' codeTitle="Viewpager"  codesandbox={codesandboxs[11]} />
     </div>
</div>
```

## useTrail

```tsx
import { useTrail, animated } from 'react-spring'
```

使用单个配置创建多个springs,每个spring将遵循前一个.将其用于交错动画.

### 编码流程

#### 更新动画

**1.通过覆盖传入值以更改动画**

如果你用改变的 props 重新渲染组件,动画会更新.

```tsx
const trail = useTrail(amount, { opacity: 1 })
```

**2.传递一个有返回值的函数并使用"set"更新**

推荐使用这种方式,这可以用于防止直接覆盖带来的重复渲染问题并且使用起来更加灵活.详细使用请阅读[Imperatives & Refs](./common-api#命令与Refs)

```tsx
const [trail, api] = useTrail(amount, () => ({ opacity: 1 }))
// 更新trail
api.start({ opacity: 0 })
// 停止trail
api.stop()
```

#### 创建视图

返回值是包含动画props的数组.

```tsx
return trail.map(styles => <animated.div style={styles} />)
```

### 属性

[通用API的Props](./common-api/#props) 中暴露的所有属性都适用.

### Demos

```mdx-code-block
<div class="row" style={{ width: '100%',marginBottom: 16 }}>
    <div class="col col--6">
       <CodePreview preview={<ThirteenthDemo />} height='20rem' codeTitle="Goo Globs"  codesandbox={codesandboxs[12]} />
    </div>
    <div class="col col--6">
       <CodePreview preview={<FourteenthDemo />} height='20rem' codeTitle="Trail"  codesandbox={codesandboxs[13]} />
    </div>
</div>
```

## useTransition

```tsx
import { useTransition, animated } from 'react-spring'
```
动画转场组.给它放入你的项目和生命周期.每当添加或删除项目时,它都会以动画形式显示这些更改.

#### 你可以转换数组

```tsx live
function TransitionArray() {
  const [items, setItems] = useState(spring.NUM_TRANS)

  const transitions = useTransition(items, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: 200,
    config: spring.config.molasses,
    onRest: () => setItems([]),
  })

  useEffect(() => {
    if (items.length === 0) {
      setTimeout(() => {
        setItems(spring.NUM_TRANS)
      }, 2000)
    }
  }, [items])

  return (
    <div style={{ display: 'flex' }}>
      {transitions(({ opacity }, item) => (
        <animated.div
          style={{
            opacity: opacity.to(item.op),
            transform: opacity
              .to(item.trans)
              .to(y => `translate3d(0,${y}px,0)`),
          }}>
          {item.fig}
        </animated.div>
      ))}
    </div>
  )
}
```
#### 在组件之间切换

```tsx live
function Toggle() {
  const [toggle, set] = useState(false)
  const transitions = useTransition(toggle, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: toggle,
    delay: 200,
    config: spring.config.molasses,
    onRest: () => set(!toggle),
  })
  return transitions(({ opacity }, item) =>
    item ? (
      <animated.div
        style={{
          position: 'absolute',
          opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
        }}>
        😄
      </animated.div>
    ) : (
      <animated.div
        style={{
          position: 'absolute',
          opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }),
        }}>
        🤪
      </animated.div>
    )
  )
}
```
#### 挂载/卸载 单组件的显示

```tsx live
function Mount() {
  const [show, set] = useState(false)
  const transitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: show,
    delay: 200,
    config: spring.config.molasses,
    onRest: () => set(!show),
  })
  return transitions(
    (styles, item) => item && <animated.div style={styles}>✌️</animated.div>
  )
}
```

`transition` 函数接受一个回调,该回调接收四个参数:动画值、项目、`Transition` 对象和同级位置.

它返回一个 React  fragment,正如你可能假设的那样,位于 `leave`动画中间的元素需要保持挂载状态.

无论你是否明确定义, fragment中的所有元素都保证有一个`key` prop. Unkeyed 元素将使用其 `Transition` 对象中的 `ctrl.id`.

对于每个唯一的项目key,都存在一个`Transition`对象.只有当它作为转换回调的第三个参数传递时,才能访问转换对象.
```tsx
// The `t` argument is a Transition object.
// The `i` argument is the sibling position.
const elems = transition((style, item, t, i) => (
  <a.div style={style}>{t.phase}</a.div>
))
```
### 属性

[共享 API](./common-api) 的所有属性都适用.

| 属性            | 类型              | 描述                                                         |
| --------------- | ----------------- | ------------------------------------------------------------ |
| initial         | obj/fn            | 初始(第一次)基值,可选(可以为null)                            |
| from            | obj/fn            | 基值,可选                                                    |
| enter           | obj/fn/array(obj) | 适用于输入元素的样式                                         |
| update          | obj/fn/array(obj) | 适用于更新元素的样式（你可以使用新值更新钩子本身）           |
| leave           | obj/fn/array(obj) | 适用于离开元素的样式                                         |
| trail           | number            | 动画开始前的延迟(以毫秒为单位),累计每次进入/更新和离开       |
| reset           | bool/fn           | 首选 `initial` prop 而不是 `from` prop.                      |
| keys            | array/function    | 有关更多信息,请参见[keys](#keys) |
| key             | single item       | 仅在你传递单个项目以使用`Transition` 时使用,请参阅[keys](#keys)以获取更多信息 |
| expires         | bool/number       | 让你控制何时卸载移除的项目（在`leave`动画完成后）查看[expires](#expires)了解更多信息 |
| sort            | fn                | 在将项数组传递给`useTransition`钩子之前对其进行切片和排序的有用快捷方式 |
| exitBeforeEnter | bool              | 确保任何项目在新项目进入动画之前离开动画                     |

#### keys

每个 `Transition` 对象都有一个唯一的键来标识它.你可以选择定义显式键或让"项目"（由 `Transition` 对象表示的值）成为它自己的键.

要定义显式键,你必须在 `useTransition` 的props中定义 `keys` prop.例如,当使用 items 数组时,新的 `keys` 属性可以是:

-   一个keys的数组
-   或者一个映射函数,它为给它的任何项目返回一个key.

```tsx
useTransition(items, {
  // Using a function
  keys: item => item.key,
  // Using an array created by lodash.map
  keys: _.map(items, 'key'),
})
```

#### Expires

`expires`prop让你可以控制何时卸载已移除的项目（在它们的`leave`动画完成后）.默认情况下,卸载会推迟到下一次渲染或所有过渡都停止.
当`true`或`<=0`时,使用默认行为.
当 `> 0` 时,此属性用于 `setTimeout` 调用,如果调用 `useTransition` 的组件在项目的 `leave` 动画完成后没有自行重新渲染,则强制重新渲染.
最后,`expires` 属性可以是一个接收项目并返回上述任何值的函数.

#### Sort

`sort` prop是一个函数,它接受两个项目,当第一个项目应该首先出现时返回`-1`,当第二个项目应该出现时返回`1`.
这是一个有用的快捷方式,用于在将 items 数组传递给 `useTransition` 钩子之前对其进行切片和排序.
```tsx
useTransition(items, {
  sort: (a, b) => { ... },
  ...props
})
```

### 附加说明

#### 多阶段过渡

initial/from/enter/update/leave 生命周期可以是对象、数组或函数.当你提供一个函数时,你可以访问各个项目.该函数允许返回普通对象,或者一个数组或一个用于多阶段转换的函数.当你提供一个普通数组时,你还可以形成一个基本的多阶段转换（无需访问该项目）.

```tsx
useTransition(items, {
  enter: item => [
    { opacity: item.opacity, height: item.height },
    { life: '100%' },
  ],
  leave: item => async (next, cancel) => {
    await next({ life: '0%' })
    await next({ opacity: 0 })
    await next({ height: 0 })
  },
  from: { life: '0%', opacity: 0, height: 0 },
})
```

#### 在路由之间过渡

```tsx
const location = useLocation()
const transitions = useTransition(location, { ... })
return transitions((props, item) => (
  <animated.div style={props}>
    <Routes location={item}>
      <Route path="/a" element={<A />} />
      <Route path="/b" element={<B />} />
      <Route path="/c" element={<C />} />
    </Routes>
  </animated.div>
))
```
### Demos

```mdx-code-block
<div class="row" style={{ width: '100%',marginBottom: 16 }}>
    <div class="col col--6">
       <CodePreview preview={<FifteenthDemo />} height='20rem' codeTitle="Image Fade"  codesandbox={codesandboxs[14]} />
    </div>
    <div class="col col--6">
       <CodePreview preview={<SixteenthDemo />} height='20rem' codeTitle="List Reordering"  codesandbox={codesandboxs[15]} />
    </div>
    <div class="col col--6">
       <CodePreview preview={<SeventeenthDemo />} height='20rem' codeTitle="Masonry"  codesandbox={codesandboxs[16]} />
    </div>
    <div class="col col--6">
      <CodePreview preview={<EighteenthDemo />} height='20rem' codeTitle="Multistage Transition"  codesandbox={codesandboxs[17]} />
    </div>
    <div class="col col--6">
      <CodePreview preview={<NineteenthDemo />} height='20rem' codeTitle="Notification Hub"  codesandbox={codesandboxs[18]} />
    </div>
    <div class="col col--6">
      <CodePreview preview={<TwentiethDemo />} height='20rem' codeTitle="Simple Transition"  codesandbox={codesandboxs[19]} />
    </div>
    <div class="col col--6">
      <CodePreview preview={<TwentyFirstDemo />} height='20rem' codeTitle="Exit Before Enter"  codesandbox={codesandboxs[20]} />
    </div>
</div>
```
