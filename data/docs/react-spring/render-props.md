---
sidebar_position: 4
---

# 渲染Props

## Parallax

### 概览

```tsx
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
```
`Parallax`创建一个可滚动的容器,`ParallaxLayer`包含您的内容,并将根据它们的偏移量和速度来移动,

**注意**: 目前,仅支持`@react-spring/web`

```tsx live height=300px
<Parallax pages={2} style={{ top: '0', left: '0' }}>
  <ParallaxLayer
    offset={0}
    speed={2.5}
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <p>Scroll down</p>
  </ParallaxLayer>

  <ParallaxLayer offset={1} speed={2} style={{ backgroundColor: '#ff6d6d' }} />

  <ParallaxLayer
    offset={1}
    speed={0.5}
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
    }}>
    <p>Scroll up</p>
  </ParallaxLayer>
</Parallax>
```
### Parallax

属性 | 类型 | 描述
---------|----------|---------
 pages | number | 容器的总空间,每个页面占用 100% 的视口
 config? | SpringConfig | spring(弹簧)行为.默认为`config.slow`(查看[配置](./common-api#配置))
 enabled? | boolean | 内容是否可以滚动.默认为`true`
 horizontal? | boolean | 容器是否水平滚动.默认为`false`
 innerStyle? | CSSProperties | 用于设置内部`Parallax`包装(而不是可滚动容器)样式的CSS对象

#### `ref`属性
`Parallax`还有一些有用的属性,您可以使用`ref`访问它们:

```tsx
const ref = useRef()
...
<Parallax ref={ref}>
```

##### `ref.current.scrollTo`

点击滚动的功能,它需要一个参数:要滚动到的页面的编号,页面是零索引的,所以`scrollTo(0)`将滚动到第一页,`scrollTo(1)`到第二页,等等,

##### `ref.current.container`

`Parallax` 的外部容器 `div` 的 `ref`,用于当您需要访问实际 DOM 元素时,

**注意**:因为它也是一个 `ref`,所以必须使用 `ref.current.container.current` 访问它,

##### `ref.current.content`

`Parallax`的内部容器`div` 的 `ref`,

#### 使用说明

-   `Parallax` 的所有直接`children`必须是`ParallaxLayers`（或其唯一直接`children`是`ParallaxLayer`的`fragment`）,
-   `Parallax` is a scrollable container so all scroll events are fired from the container itself -- listening for scroll on `window` won't work (but you *can* use `ref.current.container`).
-   `Parallax` 是一个可滚动的容器,因此所有滚动事件都是从容器本身触发的 - `window`上侦听的滚动将不起作用（但您可以使用 `ref.current.container`）,

### ParallaxLayer

| 属性        | 类型         | 描述                                                         |
| ----------- | ------------ | ------------------------------------------------------------ |
| factor?     | number       | 相对于页面大小的层大小（例如:`1` => 100%、`1.5` => 150% 等）,默认为 `1`, |
| offset?     | number       | cent在其对应页面完全可见时的偏移量（例如:`0` => 第 1 页顶部,`1` => 第 2 页顶部等）,默认为 `0`, |
| speed?      | number       | 层相对于滚动的移动速率,可以是正值或负值,默认为`0`,        |
| horizontal? | boolean      | 层是否水平移动,默认为 `Parallax `的`horizontal`值（默认为` false`）, |
| sticky?     | StickyConfig | 如果设置,层在两个偏移量之间将是"粘性的",所有其他props都被忽略,默认值:`{start?: number = 0, end?: number = start + 1}` |

#### 使用说明

-   `offset` prop是层结束的地方,而不是开始的地方,例如,如果图层的偏移量为`1.5`,则当第二页完全填满视口时,它将位于第二页的中间（零索引）
-   `speed`prop将影响图层的初始起始位置,但不会影响其最终偏移位置,
-   任何具有`sticky`设置的层都将具有高于常规层的 `z-index`,这可以手动更改,

### 演示

## Spring

### 概览

```tsx
import { Spring, animated } from 'react-spring'
```

将值转换为动画值.

#### 要么:覆盖值以更改动画

如果你用改变的 props 重新渲染组件,动画会更新.

```tsx
<Spring opacity={toggle ? 1 : 0}>
  {styles => ...}
</Spring>
```

#### 或者:传递 SpringRef 并使用 api 更新

你将获得一个 API 对象.它不会导致组件像覆盖那样渲染（当然动画仍然执行）.像这样处理更新对于快速发生的更新很有用,你通常应该更喜欢它,因为它更强大.进一步的文档可以在 [Imperatives & Refs](./common-api#命令与Refs) 中找到

```tsx
const springRef = new SpringRef()

springRef.start({
  to: {
    opacity: 1
  }
})

<Spring ref={springRef} from={{ opacity: 0 }}>
  {styles => ...}
</Spring>
```

#### 最后:在视图之间分配动画props

`Spring`的child是一个render prop函数.

```tsx
styles => <animated.div style={styles}>i will fade</animated.div>
```

### 属性

[公共props](./common-api/#props) 中记录的所有属性都适用.

### 附加说明

#### To-prop 快捷方式

Spring无法识别的任何属性都将合并为"to",例如 `opacity: 1` 将变为 `to: { opacity: 1 }`.

```tsx
// This ...
<Spring opacity={1} color={'red'} />
// is a shortcut for this ...
<Spring to={{ opacity: 1, color: 'red' }} />
```

#### 异步 链/脚本

`to` prop还允许你  1. 编写动画脚本,或  2. 将多个动画链接在一起.由于这些动画将异步执行,请确保为基值提供 `from` 属性（否则,props 将为空）.

##### 这是创建脚本的方式

```tsx
class AsyncExample extends PureComponent {
  handleAsyncTo = async (next, cancel) => {
    await next({ opacity: 1, color: '#ffaaee' })
    await next({ opacity: 0, color: 'rgb(14,26,19)' })
  }

  render() {
    // ...
    return (
      <Spring to={handleAsyncTo} from={{ opacity: 0, color: 'red' }}>
        {styles => (
          <animated.div style={styles}>I will fade in and out</animated.div>
        )}
      </Spring>
    )
  }
}
```

##### 以下是创建链条的方式

```tsx live
class ChainExample extends PureComponent {
  render() {
    return (
      <Spring
        loop
        from={{ opacity: 0, color: 'red' }}
        to={[
          { opacity: 1, color: '#ffaaee' },
          { opacity: 0, color: 'rgb(14,26,19)' },
        ]}>
        {styles => (
          <animated.div style={styles}>I will fade in and out</animated.div>
        )}
      </Spring>
    )
  }
}
```

### SpringContext

修改给定 `children` 内的动画,但只有 hook API（例如:`useSpring`）或 renderprops API（例如:`<Spring>`）创建的动画会受到影响,使用 `new SpringValue()` 或 `new Controller()` 创建的动画不受影响,

```tsx
<SpringContext cancel={true}>
  <App />
</SpringContext>
```

支持以下props:

-   `cancel?: boolean`
-   `config?: SpringConfig` (查看[配置](./common-api#配置)获取更多信息)
-   `immediate?: boolean`
-   `pause?: boolean`

`SpringContext`组件可用在任何地方使用.

最常见的用例是暂停或完成页面上的动画,而用户暂时看不到它,例如,用户可以远离具有动画内容的模式,该动画内容在隐藏时保持挂载,

#### 嵌套context

`SpringContext`组件的后代可以使用`SpringContext`有选择地覆盖另一个`SpringContext`强制的任何props,

在下面的示例中,只有 `Page2` 可以播放其动画,假装这个元素树被更动态地渲染,而这段代码是一个静态的表示,

```tsx
<SpringContext pause={true}>
  <Page1 />
  <SpringContext pause={false}>
    <Page2 />
  </SpringContext>
  <Page3 />
</SpringContext>
```

每个嵌套的`SprinContext`都继承了最近的`SpringContext`祖先的值,

### Trail

#### 概览

使用单个配置创建多个springs,每个spring将跟随前一个spring,将其用于交错动画.

#### 要么:覆盖值以更改动画

如果使用更改的props以重新渲染组件,动画将会更新.

#### 或者:传递一个有返回值的函数并使用"set"更新

你将获得一个 API 对象.它不会导致组件像覆盖那样渲染（当然动画仍然执行）.像这样处理更新对于快速发生的更新很有用,你通常应该更喜欢它,因为它更强大.进一步的文档可以在 [Imperatives & Refs](./common-api#命令与Refs) 中找到

#### 最后:在视图之间分配动画的props

返回值是包含动画props的数组.

### 属性

[共享 API](./common-api) 的所有属性都适用.

### Transition

此组件请建议使用[useTransition](./hooks#useTransition)代替