---
title: 使用指南
sidebar_position: 1
---

简而言之,react-spring是目前最好的react动画库,写react动画用它就行.与zustand等一大堆牛x的库一样,同样是由pmndrs组织编写的,所以基本可以认为此库会长久维护不必担心.

react-spring与其它动画库的区别是它是弹簧模式而不是渐进的线性模式,这样动画效果会非常自然.
```mdx-code-block
import { FourthDemo,fourthDemoCode } from '@site/data/demo/react-spring';
import { CodePreview } from '@site/src/components/code';
```



<div class="row" style={{ width: '100%',marginBottom: 16 }}>
    <div class="col col--6">
      <a href="https://codesandbox.io/embed/n9vo1my91p" target="_blank" style={{display: 'block', width: '100%'}}>
         <img src={require('../images/react-spring-pc.gif').default} />
      </a>
    </div>
    <div class="col col--4">
      <a href="https://codesandbox.io/embed/n9vo1my91p" target="_blank">
         <img src={require('../images/react-spring-tablet.gif').default} />
     </a>
    </div>
     <div class="col col--2">
       <a href="https://codesandbox.io/embed/n9vo1my91p" target="_blank">
         <img src={require('../images/react-spring-mobile.gif').default} />
     </a>
    </div>
</div>

## 简述

react-spring是跨平台的,支持web, react-native, react-native-web等等,但是默认不支持ie,需要支持请导入`.cjs`

对于不同的平台可以安装导入专用的包,或者也可以直接安装和导入整个react-spring,没有什么区别,目前有以下包可用

```shell
@react-spring/konva
@react-spring/native
@react-spring/three
@react-spring/web
@react-spring/zdog
```

### 安装

```shell
pnpm add react-spring
```

## 基本使用

导入`animated`模块用于绘制dom,使用`useSpring`用于构建动画

> 注意: 不要直接
> 
> <div>去创建节点,这样是无效的,必须使用`animated.xxx`</div>

```tsx
import { useSpring, animated } from 'react-spring'

function App() {
  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } })
  return <animated.div style={props}>I will fade in</animated.div>
}
```

如果实在需要在包装一些已有的React组件,比如antd或mui等的组件库中的组件或react native的组件,可以这样

```tsx
// React components
const AnimatedDonut = animated(Card)

// React-native
const AnimatedView = animated(View)

// styled-components, emotion, etc.
const AnimatedHeader = styled(animated.h1)`
```

### 几个演示

向`useSpring`传入参数与css的构建动画的方法类似,所以可以随心所欲地像构建css动画一样使用它构建react动画,比如:

```tsx live height=300px
function Text() {
  const [flip, set] = useState(false)
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: true,
    reverse: flip,
    delay: 200,
    config: spring.config.molasses,
    onRest: () => set(!flip),
  })
  return <animated.h1 style={props}>hello</animated.h1>
}
```

甚至可以直接更改`svg`,只要是html支持的dom都可以使用

```tsx live
function SVG() {
  const [flip, set] = useState(false)
  const { x } = useSpring({
    reset: true,
    reverse: flip,
    from: { x: 0 },
    x: 1,
    delay: 200,
    config: spring.config.molasses,
    onRest: () => set(!flip),
  })

  return (
    <animated.svg
      style={{ margin: 20, width: 80, height: 80 }}
      viewBox="0 0 45 44"
      strokeWidth="2"
      fill="white"
      stroke="rgb(45, 55, 71)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={156}
      strokeDashoffset={x.to(x => (1 - x) * 156)}>
      <polygon points={spring.POINTS} />
    </animated.svg>
  )
}
```

改变内部的数字

```tsx live height=300px
function Number() {
  const [flip, set] = useState(false)
  const { number } = useSpring({
    reset: true,
    reverse: flip,
    from: { number: 0 },
    number: 1,
    delay: 200,
    config: spring.config.molasses,
    onRest: () => set(!flip),
  })

  return <animated.div>{number.to(n => n.toFixed(2))}</animated.div>
}
```

修改滚动值

```tsx live height=300px
function Scrolling() {
  const [flip, set] = useState(false)

  const words = ['We', 'came.', 'We', 'saw.', 'We', 'kicked', 'its', 'ass.']

  const { scroll } = useSpring({
    scroll: (words.length - 1) * 50,
    from: { scroll: 0 },
    reset: true,
    reverse: flip,
    delay: 200,
    config: spring.config.molasses,
    onRest: () => set(!flip),
  })

  return (
    <animated.div
      style={{
        position: 'relative',
        width: '100%',
        height: 60,
        overflow: 'auto',
        fontSize: '0.5em',
      }}
      scrollTop={scroll}>
      {words.map((word, i) => (
        <div
          key={`${word}_${i}`}
          style={{ width: '100%', height: 50, textAlign: 'center' }}>
          {word}
        </div>
      ))}
    </animated.div>
  )
}
```

可以简单的理解为像`useSpring`中传递参数构建动画,然后`useSpring`返回出实时的样式值,把样式作为`style`参数传入使用`animated`创建的dom节点(react组件)中

### 支持的动画值

react-spring几乎支持所有动画值,如下:

- Colors (names, rgb, rgba, hsl, hsla, gradients)
- CSS Variables (declared on :root) and their fallbacks
- Absolute lengths (cm, mm, in, px, pt, pc)
- Relative lengths (em, ex, ch, rem, vw, vh, vmin, vmax, %)
- Angles (deg, rad, grad, turn)
- Flex and grid units (fr, etc)
- All HTML attributes
- SVG paths (as long as the number of points matches, otherwise use [custom interpolation](https://codesandbox.io/embed/lwpkp46om))
- Arrays
- String patterns (transform, border, boxShadow, etc)
- Non-animatable string values (visibility, pointerEvents, etc)
- ScrollTop/scrollLeft

```tsx
const props = useSpring({
  vector: [0, 10, 30],
  display: 'block',
  padding: 20,
  background: 'linear-gradient(to right, #009fff, #ec2f4b)',
  transform: 'translate3d(0px,0,0) scale(1) rotateX(0deg)',
  boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.4)',
  borderBottom: '10px solid #2D3747',
  shape: 'M20,20 L20,380 L380,380 L380,20 L20,20 Z',
  textShadow: '0px 5px 15px rgba(255,255,255,0.5)',
  color: 'var(--darkModeColor)',
})
```

### 便捷写法

> 便捷写法暂时只支持web平台,react-native等平台将在后续版本支持

一般来说,通过`useSpring`返回的值必须转换为css值后才能放入组件使用,比如:

```tsx
import { to,animated as a } from 'react-spring'
const { x, y } = useSpring({ x: 0, y: 0 })
const transform = to([x, y], (x, y) => `translate(${x}px, ${y}px)`)
return <a.div style={{ transform }} />
```

但是在web平台下react-spring的`animated`内部会对一些值自动进行快捷处理,这样写起来就更顺畅了,如:

```tsx
const { x, y } = useSpring({ x: 0, y: 0 })
return <a.div style={{ x, y }} />
```

目前支持的快捷值如下

- `x`, `y`, `z`
- `translate`, `translateX`, `translateY`, `translate3d`
- `rotate`, `rotateX`, `rotateY`, `rotate3d`
- `scale`, `scaleX`, `scaleY`, `scale3d`
- `skew`, `skewX`, `skewY`
- `matrix`, `matrix3d`

### 在视图中插值

有时候为了方便和`useSpring`返回的`props`对象中的值可以重用,我们可以直接使用`to`函数在视图内的`style`直接通过插值的方式来运行动画

示例

```tsx 
import { useSpring, animated, to } from 'react-spring'

const { o, xyz, color } = useSpring({
  from: { o: 0, xyz: [0, 0, 0], color: 'red' },
  o: 1,
  xyz: [10, 20, 5],
  color: 'green',
})

return (
  <animated.div
    style={{
      color,
      background: o.to(o => `rgba(210, 57, 77, ${o})`),
      transform: xyz.to((x, y, z) => `translate3d(${x}px, ${y}px, ${z}px)`),
      border: to([o, color], (o, c) => `${o * 10}px solid ${c}`),
      padding: o
        .to({ range: [0, 0.5, 1], output: [0, 0, 10] })
        .to(o => `${o}%`),
      borderColor: o.to({ range: [0, 1], output: ['red', '#ffaabb'] }),.
      opacity: o.to([0.1, 0.2, 0.6, 1], [1, 0.1, 0.5, 1]),
    }}>
    {o.to(n => n.toFixed(2))}
  </animated.div>
)
```
### 附加说明

#### 模拟css-keyframes
有时你想通过一系列状态,例如css关键帧,你可以为此使用插值.
```mdx-code-block
<CodePreview code preview={<FourthDemo />}  language="tsx">
      {fourthDemoCode}
</CodePreview>
```

#### 依赖数组

当设置依赖时,与`useEffect`一样,依赖更新时才会更新动画,如果依赖的是一个空数组则相当于传入一个函数作为`useSpring`等Hooks的参数(除了`useChain`外所有的Hooks都支持依赖)

具有依赖更新的动画钩子会返回一个`api`变量用于处理动画

```tsx
const [style, api] = useSpring({ x: 0, y: 0 }, [])
useEffect(() => {
  api.start({ x: 100, y: 100 })
}, [])
```

或者

```tsx
const [style, api] = useSpring(() => ({ x: 0, y: 0 }))
useEffect(() => {
  api.start({ x: 100, y: 100 })
}, [])
```

### forwardRef包装的组件

使用`forwardRef`包装的组件传入`animated`后生成的dom无法即时更新动画,如下

```tsx
const MyAnimatedComponent = animated(({ value }) => <div>{value}</div>)

const MyAnimatedComponentWithRefForwarding = animated(
  forwardRef(({ value }, ref) => <div ref={ref}>{value}</div>)
)

const MyComponentWithSpring = () => {
  const { value } = useSpring({
    from: { value: 0 },
    to: { value: 1 },
  })

  return (
    <>
      /* 当value改变时自动更新动画 */
      <MyAnimatedComponent value={value} />
      /* 当value改变时不会更新动画 */
      <MyAnimatedComponentWithRefForwarding value={value} />
    </>
  )
}
```

解决办法是把forwardRef作为一个props传入

```tsx
const AnimatedComponent = animated(({ value, forwardedRef }) => (
  <div ref={forwardedRef}>{value}</div>
))

const AnimatedComponentWithRefForwarding = useRef((props, ref) => (
  <AnimatedComponent {...props} forwardedRef={ref} />
))
```

## 问题指南

### 无障碍

react-spring 使构建动画变得简单,但重要的是确保那些不喜欢动画的人仍然可以访问你的站点/应用程序.
前庭功能障碍是一种内耳平衡障碍,在美国成年人中非常普遍. 2000 年初的一项研究发现,大约 6900 万美国人患有前庭功能障碍,导致眩晕、恶心、偏头痛和听力丧失.许多受前庭功能障碍影响的人会选择在他们的操作系统中设置"减少运动"设置.在 macOS 中,它位于辅助功能设置中.

将`skipAnimation`动画与[prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)相结合,以优雅的方式禁用或减少动画的运动. r[react-reduce-motion](https://github.com/infiniteluke/react-reduce-motion) 是一个跨平台的Hook,它暴露了这个操作系统级别的设置,使你能够为想要退出的用户禁用或减少动画.

要使用这个Hook禁用动画,你可以使用react-spring的全局`skipAnimation`:

```tsx
import { useReducedMotion } from 'react-reduce-motion'
import { Globals } from 'react-spring'

const MyApp = () => {
  const prefersReducedMotion = useReducedMotion()
  React.useEffect(() => {
    Globals.assign({
      skipAnimation: prefersReducedMotion,
    })
  }, [prefersReducedMotion])
  // ...
}
```

动画也可以使用`immediate`属性逐个禁用.

```tsx
import { useReducedMotion } from 'react-reduce-motion'

const MyComponent = () => {
  const prefersReducedMotion = useReducedMotion()
  const props = useSpring({ opacity: 1, immediate: prefersReducedMotion })
  // ...
}
```

最后,可以通过应用你自己的式方法来减少动画.

```tsx
import { useReducedMotion } from 'react-reduce-motion'

const MyComponent = () => {
  const prefersReducedMotion = useReducedMotion()
  const props = useSpring({
    scale: prefersReducedMotion ? '1.05' : '2',
  })
  // ...
}
```

查看[react-reduce-motion](https://github.com/infiniteluke/react-reduce-motion)以了解更多信息.

### React Three Fiber

虽然`react-three-fiber`中的卡顿不能完全归咎于`react-spring`,但你可能会在动画结束时发现有一个微妙的跳跃,在这个[演示](https://y18m1.csb.app/)中是可以看到.这不漂亮,是吗？

默认情况下,解决此问题不会太复杂,这将是我们在下一次重大更改时考虑的内容,当前你可以使用[`精确`配置prop](./common-api#配置)来避免这种情况.

通过将prop设置为`0.0001`之类的值就可以看到不会没有向 0 跳跃了.这是因为在我们认为动画值相等之前,精度prop用于计算动画值与最终目标的接近程度来得到最终目标.

### 测试

关于测试部分请自行查看官网文档,建议使用[jest](https://jestjs.io/zh-Hans/).