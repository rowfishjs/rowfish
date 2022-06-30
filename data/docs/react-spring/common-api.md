---
sidebar_position: 2
---

# 公共API

## Props

### 概述

```tsx
useSpring({ from: { ... }, to: { ... }, delay: 100, onRest: () => ... })
```

以下是所有钩子的公共参数类型

| 属性            | 类型              | 描述                                                         |
| :-------------- | :---------------- | :----------------------------------------------------------- |
| from            | obj               | 基础值,可选                                                  |
| to              | obj/fn/array(obj) | 动画目标值                                                   |
| loop            | obj/fn/bool       | 循环设置,请参[阅循 prop](#loop-prop)具了解更多详情           |
| delay           | number/fn         | 动画开始前的延迟毫秒.也可以是一个函数:key => delay          |
| immediate       | bool/fn           | 如果为true,则阻止动画.也可以是一个函数:key => immediate     |
| [config](#配置) | obj/fn            | spring配置(包含质量、张力、摩擦力等).也可以是一个函数:key => config |
| reset           | bool              | 如果设置为 true, 则spring将开始从头开始执行动画(from -> to)  |
| reverse         | bool              | 如果设置为true,"from"和"to"会切换,这仅与"reset"标志结合使用才有意义 |
| cancel          | bool/string/fn    | 当为`true`时,`cancel` prop停止接收它的控制器拥有的每个执行中的动画值的动画.有关更多详细信息,请参阅[cancel prop](#cancel-Prop) |
| pause           | bool              | `pause` prop可以及时冻结动画                                 |
| `events`        | fn                | 多种回调事件(更多信息见[事件](#事件)                         |

### 高级props

#### Loop Prop

使用`loop:true`来重复一个动画

```tsx live
function LoopTrue() {
  const styles = useSpring({
    loop: true,
    from: { rotateZ: 0 },
    to: { rotateZ: 180 },
  })

  return (
    <animated.div
      style={{
        width: 80,
        height: 80,
        backgroundColor: '#46e891',
        borderRadius: 16,
        ...styles,
      }}
    />
  )
}
```

#### `loop`函数

传入一个每次循环时都会执行的函数.此函数返回`true`则继续循环,返回`false`则停止循环.

```tsx live
function LoopFunction() {
  const n = useRef(0)
  const styles = useSpring({
    loop: () => 3 > n.current++,
    from: { x: 0 },
    to: { x: 100 },
  })

  return (
    <animated.div
      style={{
        width: 80,
        height: 80,
        backgroundColor: '#46e891',
        borderRadius: 16,
        ...styles,
      }}
    />
  )
}
```

`loop`函数也可以返回一个`loop`对象,这将在后面再详细介绍.当你想在上一个循环完成后立即决定下一个循环动画时,这很有用.

#### `loop`对象

定义一个`loop`对象,将循环动画与初始动画分开自定义.它可能包含任何`useSpring`的props。例如，如果使用`reverse: true`,则循环动画将在每个循环中反转.

```tsx live
function LoopObject() {
  const styles = useSpring({
    loop: { reverse: true },
    from: { x: 0 },
    to: { x: 100 },
  })

  return (
    <animated.div
      style={{
        width: 80,
        height: 80,
        backgroundColor: '#46e891',
        borderRadius: 16,
        ...styles,
      }}
    />
  )
}
```

##### 继承props

`loop`对象总是合并到定义它的 props 对象的副本中.下面的示例显示了一个循环动画,它继承了它的`config` prop

```tsx live
function InheritedProps() {
  const n = useRef(0)
  const styles = useSpring({
    from: { x: 0 },
    config: { duration: 1000 },
    loop: {
      x: 100,
    },
  })

  return (
    <animated.div
      style={{
        width: 80,
        height: 80,
        backgroundColor: '#46e891',
        borderRadius: 16,
        ...styles,
      }}
    />
  )
}
```

>   请注意循环不会多次运行.那是因为有些props永远不会被继承.这些props包括`default`,`reset`以及`reverse`.

**若要循环动画**,请尝试将`reset:true`添加到上例中的`loop`属性.或者,你可以添加`from: {x: 0}`开始添加以获得相同的效果.

最后,尝试将`config: { friction: 5 }`添加到`loop` prop.这会使用弹性动画覆盖继承的`config.duration`.

#### Cancel Prop

为`true`时,`cancel` prop停止所有接受它的`Controller`所有的动画值的动画

下面这个示例不会生成动画,因为`cancel`始终为`true`

```tsx
useSpring({
  cancel: true,
  from: { x: 0 },
  to: { x: 100 },
})
```

一旦`cancel`属性从`true`变为`false`,声明的动画将恢复或重置,具体取决于给定的props.

`cancel` prop从`true`变为`false`一次,则定义的动画将继续或重置,这依赖于给定的props.

##### 延迟更新

`cancel` prop甚至可以防止延迟更新.😎

```tsx
const [style, animate] = useSpring(() => ({ x: 0 }))

// Pass this to an element.
const onClick = () => {
  animate({ x: 100, delay: 500 })

  // Prevent the previous update. 🤣
  animate({ cancel: true })
}
```

##### 特定keys

取消特定键的动画,你可以传入单个key,一个keys数组,或者一个`(key: string) => boolean`函数

```tsx
// Using a single key
cancel: 'x',

// Using an array of keys
cancel: ['x', 'y'],

// Using a function
cancel: key => key !== 'x',
```

`reset`和`immediate`props支持这些相同的类型.

#### 事件

| 事件名称   | 描述                                        |
| ---------- | ------------------------------------------- |
| onStart    | 当一个spring或者一个key即将设置动画时的回调 |
| onChange   | 逐帧回调                                    |
| onRest     | spring或key停止时的回调                     |
| onPause    | spring或key暂停时的回调                     |
| onResume   | 恢复spring或key时的回调                     |
| onDelayEnd | spring或key结束延迟时的回调                 |
| onProps    | spring或key的props更新时的回调              |

##### 事件作为函数

不包含`onDelayEnd`和`onProps`的事件都具有相同的参数传给它们:

```tsx
(result: AnimationResult, spring: Controller | SpringValue, item?: Item) => void
```

让我们分析一下: 

-   `result`(第一个参数): 一个[动画结果](#动画结果),这是一个包含调用时的spring值的对象
-   `spring`(第二个参数): 这是动画结果的`Controller`或`SpringValue`,这就是事件
-   `item`(第三个参数): 这只在使用`useTransition`钩子和`Transition`组件时可用

>   警告: 目前在第一个动画tick之后调用`onStart`,这个值被认为是脏的

`onDelayEnd`和`onProps`有下面这些参数传入:

```tsx
(props: SpringProps, spring: SpringValue) => void
```

-   `props`(第一个参数): spring对象的props(与所有传入的新值合并后的值)
-   `spring`(第二个参数): 受影响的`springObject`对象

##### 事件作为对象

事件也像`onRest`一样可以在每个key的基础上定义

```tsx
useSpring({
  from: { x: 0, y: 0 },
  onRest: {
    x: () => console.log('x.onRest'),
    y: () => console.log('y.onRest'),
  },
})
```

##### 动画结果

一些事件在回调时把`AnimationResult`作为它们的第一个参数.它包含以下属性:

-   `value: any`: 动画结束时的当前值.
-   `finished?: boolean`:  当动画在停止或取消之前完成时为true
-   `cancelled?: boolean`: 当动画在取消时为true

ref API的`start`方法resolved时返回的promise,包含一个`AnimationResult`对象.以及`SpringValue`和`Controller`类的`start`方法.

### 默认Props

`default` prop让你可以在同一更新中设置某些props的默认值

#### 声明式更新

对于声明式 API,此prop默认为 `true`.在下面的示例中,除非定义了自己的`onRest`prop,否则传递给``animate`的每个更新都会继承`onRest`处理器.

```tsx
useSpring({
  to: async animate => { ... },
  onRest: () => { ... }
})
```

#### 命令式更新

命令式更新可以使用`default: true`来设置默认的props.当一个异步的`to`prop被命令更新所定义,它将会像下面那样从命令更新继承props:

```tsx
useSpring({
  from: { x: 0 },
  to: async animate => {
    // The `config` prop below is inherited by
    // both objects in the `to` array.
    await animate({
      to: [{ x: 100 }, { x: 0 }],
      config: { tension: 100 },
    })
  },
})
```

默认 props 在`SpringValue# _ merge`[方法](https://github.com/react-spring/react-spring/blob/09f9a8aa34e73321d701c815b643576affd82a1c/packages/core/src/SpringValue.ts#L562-L824)中的内部差异算法处理更新时被继承.

比如,`ref` prop和`animate`方法都将继承下面定义的默认props(在`useSpring`props函数中).

```tsx
const ref = useSpringRef()
const [{ x }, api] = useSpring(() => ({
  x: 0,
  onRest: () => { ... },
  ref,
}))

useEffect(async () => {
  // Animate to 100 with the ref API.
  await ref.current.start({ x: 100 })
  // Animate to 0 with the returned API.
  await api.start({ x: 0 })
}, [])
```

#### 兼容props

在最后一个示例中,只有`onReset` prop被继承,因为一些props具有一个默认值.

下面这些props具有默认值:

-   `cancel`
-   `config`
-   `immediate`
-   `onChange`
-   `onDelayEnd`
-   `onProps`
-   `onRest`
-   `onStart`
-   `pause`

#### 默认对象

除了传递``default: true `之外,你还可以传递一个对象来代替.只有在你的`default`对象中定义的props将被保存以供将来更新.

在此示例中,我们`true`设置为`immediate`的默认值.这会影响`useSpring`调用所拥有的所有未来的动画,无论它们是声明式的还是命令式的.

```tsx
const { x } = useSpring({
  x: 0,
  default: { immediate: true },
})
useEffect(() => {
  // This will be immediate.
  x.start(100)
})
```

## 配置

Spring 是可配置的并且可以调整.如果你想调整这些设置,你应该提供一个`config`属性来`useSpring`:

```tsx
useSpring({ config: { duration: 250 }, ... })
```

从`v9`开始`config` prop现在可以只更新一部分:

```tsx
const { x } = useSpring({
  from: { x: 0 },
  config: { frequency: 1 },
})
useEffect(() => {
  x.start({ config: { velocity: 0 } })
  x.start({ config: { friction: 20 } })
}, [])
```

并且我们还添加了以下属性: `frequency`, `damping`, `round`, `bounce`, `progress` & `restVelocity`.

所有属性

| 属性         | 默认值    | 描述                                                         |
| ------------ | --------- | ------------------------------------------------------------ |
| mass         | 1         | 弹簧质量(重力)                                               |
| tension      | 170       | 弹簧动能载荷                                                 |
| friction     | 26        | 弹簧阻力                                                     |
| clamp        | false     | 如果为True,则在弹簧超出其边界时停止                          |
| precision    | 0.01      | 在我们认为动画值"存在"之前,动画值与最终结果有多接近,这对于弹簧动画很重要 |
| velocity     | 0         | 初始速度                                                     |
| easing       | t => t    | 默认情况下是线性的,你可以使用任何你想要的缓动,例如 d3-ease,我们已经包含了各种缓动,参考[这里](#缓动) |
| damping      | 1         | 阻尼比,它决定了弹簧如何减速.仅在`frequency`定义时有效.默认为`1`. |
| progress     | 0         | 当与`duration`一起使用时,它决定了从缓动函数开始的距离.持续时间本身不受影响. |
| duration     | undefined | 如果 大于 0 将切换到基于持续时间的动画而不是弹簧模式,值应该以毫秒为单位指示(例如`duration: 250`,持续时间为 250 毫秒) |
| decay        | undefined | `number`的衰减率.如果为`true`默认为 0.998                    |
| frequency    | undefined | 固有频率(以秒为单位),它指示不存在阻尼时每秒的反弹次数.定义时,`tension`从 this派生,`friction`从`tension`和`damping`派生 |
| round        | undefined | 制作动画时,四舍五入到该数字的最接近的倍数.`from`以及`to`以及任何传递给动画值的`set`方法的值的值永远不会四舍五入. |
| bounce       | undefined | 当大于零时,弹簧将在超过其目标值时反弹而不是超调.             |
| restVelocity | undefined | 动画之前的最小速度被认为是"不移动".未定义时,改为使用`precision`. |

```mdx-code-block
<iframe src="https://codesandbox.io/embed/react-spring-config-x1vjb?fontsize=14&hidenavigation=1&theme=dark"
     style={{width:'100%',  height:'500px',  border:0,  borderRadius: '4px', overflow:'hidden', }}
     title="react-spring-config"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
```

### 预设

还有一些通用预设将涵盖一些共同点

```tsx
import { ..., config } from 'react-spring'

useSpring({ ..., config: config.default })
```

| 属性            | 值                                       |
| --------------- | ---------------------------------------- |
| config.default  | { mass: 1, tension: 170, friction: 26 }  |
| config.gentle   | { mass: 1, tension: 120, friction: 14 }  |
| config.wobbly   | { mass: 1, tension: 180, friction: 12 }  |
| config.stiff    | { mass: 1, tension: 210, friction: 20 }  |
| config.slow     | { mass: 1, tension: 280, friction: 60 }  |
| config.molasses | { mass: 1, tension: 280, friction: 120 } |

```mdx-code-block
<iframe src="https://codesandbox.io/embed/react-spring-preset-configs-kdv7r?fontsize=14&hidenavigation=1&theme=dark"
     style={{width:'100%',  height:'500px',  border:0,  borderRadius: '4px', overflow:'hidden', }}
     title="react-spring-config"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
```

## 缓动

虽然 react-spring 应该是一个基于 spring 的动画库,但随着时间的推移,它随着一个多合一动画库的野心而发展着.

考虑到这一点,我们现在支持在设置`duration`时与配置一起使用的多种缓动函数

| In            | Out            | In Out           |
| ------------- | -------------- | ---------------- |
| easeInBack    | easeOutBack    | easeInOutBack    |
| easeInBounce  | easeOutBounce  | easeInOutBounce  |
| easeInCirc    | easeOutCirc    | easeInOutCirc    |
| easeInCubic   | easeOutCubic   | easeInOutCubic   |
| easeInElastic | easeOutElastic | easeInOutElastic |
| easeInExpo    | easeOutExpo    | easeInOutExpo    |
| easeInQuad    | easeOutQuad    | easeInOutQuad    |
| easeInQuart   | easeOutQuart   | easeInOutQuart   |
| easeInQuint   | easeOutQuint   | easeInOutQuint   |
| easeInSine    | easeOutSine    | easeInOutSine    |

它们的用法如下:

```tsx live
function EasingComponent() {
  const { background, rotateZ } = useSpring({
    from: {
      background: '#46e891',
      rotateZ: 0,
    },
    to: {
      background: '#277ef4',
      rotateZ: 225,
    },
    config: {
      duration: 2000,
      easing: spring.easings.easeInOutQuart,
    },
    loop: { reverse: true },
  })

  return (
    <animated.div
      style={{ background, width: 120, height: 120, borderRadius: 16, rotateZ }}
    />
  )
}
```

## 命令与Refs

虽然本节使用使用`hooks`的示例,但在类组件中使用`createRef `会给你相同的结果.

### 命令式 API

示例:

```tsx live
function BackwardsCompatability() {
  const [styles, api] = useSpring(() => ({
    from: { x: -50, opacity: 1 },
  }))

  useEffect(() => {
    api({
      x: 50,
      opacity: 1,
      loop: { reverse: true },
    })
  }, [])

  return (
    <animated.div
      style={{
        width: 80,
        height: 80,
        backgroundColor: '#46e891',
        borderRadius: 16,
        ...styles,
      }}
    />
  )
}
```

#### `from` Prop

`from` Prop现在在命令式更新中表现不同.定义后,它意味着`reset` 属性为true.以前的版本,除非明确定义了 `reset: true`,否则`from`  prop不会影响动画.

要阻止这种行为,可以定义`reset: false`.

```tsx
const { x } = useSpring({ x: 0 })
useEffect(() => {
  // This animates as expected, from 100 to 0.
  x.start({ from: 100, to: 0 })
})
```

###  API方法

设置为SpringRef或作为Spring返回的数组的第二个参数返回的API对象具有以下方法:

```tsx
const api = {
    // start your animation optionally giving new props to merge e.g. a `to` object
    start: (props) => AnimationResult,
    // sets the spring to specific passed values
    set: (props) => void,
    // Add props to each controller's update queue.
    update: (props) => this,
    // Add a controller to the springRef
    add: (ctrl) => this,
    // Delete a controller from the springRef
    delete: (ctrl) => this,
    // Cancel some or all animations depending on the keys passed, no keys will cancel all.
    stop: (cancel, keys) => this,
    // pause specific spring keys of the spring function
    pause: (keys) => this
    // resume specific spring keys of the spring function
    resume: (keys) => this
}
```

### 使用Refs

在以下情况下要使用`useSpringRef`来代替`useRef`:

```tsx
const springRef = useSpringRef()

const { size, ...rest } = useSpring({
  ref: springRef,
  config: config.stiff,
  from: { size: '20%', background: 'hotpink' },
  to: {
    size: '100%',
    background: 'white',
  },
})

useEffect(() => {
  // this will give you access to the same API documented above
  console.log(springRef.current)
}, [])
```

在内部,ref 使用 add 方法添加了`Controller`.因此,使用`useRef`会抛出错误.这在使用`useChain`时特别有用.

## 插值

`value.to`采用以下形状的对象:

| 值               | 默认      | 描述                   |
| ---------------- | --------- | ---------------------- |
| extrapolateLeft  | extend    | 左外推                 |
| extrapolateRight | extend    | 右外推                 |
| extrapolate      | extend    | 设置左右外推的快捷方式 |
| range            | [0,1]     | 输入范围数组           |
| output           | undefined | 映射的输出范围数组     |
| map              | undefined | 应用于输入值的值过滤器 |

范围快捷方式: `value.to([...inputRange], [...outputRange])`

或者一个函数: `value.to(v => ...)`