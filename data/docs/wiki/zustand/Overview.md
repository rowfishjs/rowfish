---
hide_title: true
hide_table_of_contents: true
sidebar_position: 1
sidebar_label: 基本使用
---

Zustand是一个使用简化的flux原理的小型、快速且可扩展的状态管理解决方案。有一个基于hooks的舒适 api，无需样板代码或自以为是的繁琐操作。

不要因为它简单就无视它。它有相当多的利器，花费了大量的时间来处理常见的陷阱，比如可怕的[僵尸子问题](https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md)，[react并发性](https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md)，以及混合渲染时的[context丢失](https://github.com/facebook/react/issues/13332)。它可能是 React 生态中可以正确地处理所有这些问题的一个状态管理库。

你可以在[此处](https://codesandbox.io/s/dazzling-moon-itop4)尝试现场演示。

```bash
npm install zustand # or yarn add zustand
```

## 首先创建一个store

你的store是一个hook！你可以在里面放任何东西：数据、对象、函数。 `set` 函数用于合并状态。

```jsx
import create from 'zustand'

const useStore = create(set => ({
  bears: 0,
  increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 })
}))
```

## 然后绑定你的组件,这就是所有一切了!

在任何地方使用hook，不需要Provider。选择你的状态，组件将在更改时重新渲染。

```jsx
function BearCounter() {
  const bears = useStore(state => state.bears)
  return <h1>{bears} around here ...</h1>
}

function Controls() {
  const increasePopulation = useStore(state => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```

### 为什么zustand比redux好？

-   简单而不需要太多样板代码
-   使hook成为消费状态的主要手段
-   不将你的应用包装在context.Provider中
-   [可以瞬时通知组件（不引起渲染）](#瞬态更新（对于经常发生的状态 - 变化）)

### 为什么zustand比context好？

* 更少的样板文件
* 只在更改时渲染组件
* 集中的，基于actions的状态管理

# 技术

## 获取所有

你可以，但请记住，它会导致在每次状态更改时更新组件！

```jsx
const state = useStore()
```

## 选择多个状态切片

默认情况下，它使用严格相等`(old === new)`检测更改，这对于原子state picks(状态选择)很有效。

```jsx
const nuts = useStore(state => state.nuts)
const honey = useStore(state => state.honey)
```

如果你想构造一个内部具有多个 state-picks 的单个对象，类似于 redux 的 mapStateToProps,，你可以告诉 zustand 你希望通过传递 `shallow`相等函数来对对象进行浅比较。

```jsx
import shallow from 'zustand/shallow'

// Object pick, re-renders the component when either state.nuts or state.honey change
const { nuts, honey } = useStore(state => ({ nuts: state.nuts, honey: state.honey }), shallow)

// Array pick, re-renders the component when either state.nuts or state.honey change
const [nuts, honey] = useStore(state => [state.nuts, state.honey], shallow)

// Mapped picks, re-renders the component when state.treats changes in order, count or keys
const treats = useStore(state => Object.keys(state.treats), shallow)
```

为了更好地控制重新渲染，你可以提供任何自定义的相等比较函数。

```jsx
const treats = useStore(
  state => state.treats,
  (oldTreats, newTreats) => compare(oldTreats, newTreats)
)
```

## 缓存选择器

通常建议使用useCallback来缓存选择器。这将防止每次渲染时进行不必要的计算。它还允许 React 在并发模式下优化性能。

```jsx
const fruit = useStore(useCallback(state => state.fruits[id], [id]))
```

如果一个选择器不依赖于作用域，你可以在渲染函数之外定义它来获得一个固定的引用而不要使用useCallback。

```jsx
const selector = state => state.berries

function Component() {
  const berries = useStore(selector)
```

## 状态覆盖

set 函数有第二个参数，默认为 false。它将替换状态模型，而不是去合并它。注意如无必要请不要去除你需要的部分，比如actions。

```jsx
import { omit } from "lodash-es/omit"

const useStore = create(set => ({
  salmon: 1,
  tuna: 2,
  deleteEverything: () => set({ }, true), // clears the entire store, actions included
  deleteTuna: () => set(state => omit(state, ['tuna']), true)
}))
```

## 异步操作

只需在你准备好时调用`set`，zustand并不关心你的操作是否是异步的。

```jsx
const useStore = create(set => ({
  fishies: {},
  fetch: async pond => {
    const response = await fetch(pond)
    set({ fishies: await response.json() })
  }
}))
```

## 在操作中读取状态

`set` 允许使用函数`set(state => result)`更新状态，但你仍然可以通过 `get `访问它之外的状态。

```jsx
const useStore = create((set, get) => ({
  sound: "grunt",
  action: () => {
    const sound = get().sound
    // ...
  }
})
```

## 读/写状态并对组件外部的变化做出响应

有时你需要以非响应式的方式访问状态或对store执行操作。对于这些情况，生成的hook拥有一套附加到其原型的实用函数。

```jsx
const useStore = create(() => ({ paw: true, snout: true, fur: true }))

// Getting non-reactive fresh state
const paw = useStore.getState().paw
// Listening to all changes, fires synchronously on every change
const unsub1 = useStore.subscribe(console.log)
// Updating state, will trigger listeners
useStore.setState({ paw: false })
// Unsubscribe listeners
unsub1()
// Destroying the store (removing all listeners)
useStore.destroy()

// You can of course use the hook as you always would
function Component() {
  const paw = useStore(state => state.paw)
```

### 使用带有选择器的订阅
如果你需要使用选择器订阅，`subscribe With Selector` 中间件会有所帮助。
有了这个中间件，`subscribe` 接受一个额外的签名：

```ts
subscribe(selector, callback, options?: { equalityFn, fireImmediately }): Unsubscribe
```

```js
import { subscribeWithSelector } from 'zustand/middleware'
const useStore = create(subscribeWithSelector(() => ({ paw: true, snout: true, fur: true })))

// Listening to selected changes, in this case when "paw" changes
const unsub2 = useStore.subscribe(state => state.paw, console.log)
// Subscribe also exposes the previous value
const unsub3 = useStore.subscribe(state => state.paw, (paw, previousPaw) => console.log(paw, previousPaw))
// Subscribe also supports an optional equality function
const unsub4 = useStore.subscribe(state => [state.paw, state.fur], console.log, { equalityFn: shallow })
// Subscribe and fire immediately
const unsub5 = useStore.subscribe(state => state.paw, console.log, { fireImmediately: true })
```
如何在 TypeScript 中使用 `subscribe With Selector` 
```ts
import create, { GetState, SetState } from 'zustand'
import { StoreApiWithSubscribeWithSelector } from 'zustand/middleware'

type BearState = {
  paw: boolean
  snout: boolean
  fur: boolean
}
const useStore = create<
  BearState,
  SetState<BearState>,
  GetState<BearState>,
  StoreApiWithSubscribeWithSelector<BearState>
>(subscribeWithSelector(() => ({ paw: true, snout: true, fur: true })))
```

对于具有多个中间件的更复杂的类型，请参考 [*middlewareTypes.test.tsx*](https://github.com/pmndrs/zustand/blob/main/tests/middlewareTypes.test.tsx)。

## 在React之外使用zustand

Zustand核心可以在没有 React 依赖的情况下导入和使用。唯一的区别是 create 函数不返回hook，而是返回vanilla api。
```jsx
import create from 'zustand/vanilla'

const store = create(() => ({ ... }))
const { getState, setState, subscribe, destroy } = store
```

你甚至可以使用 React 消费现有的vanilla store
```jsx
import create from 'zustand'
import vanillaStore from './vanillaStore'

const useStore = create(vanillaStore)
```

:warning: 请注意，修改 `set` 或 `get` 的中间件不适用于 `get State` 和 `set State`。

## 瞬态更新（对于经常发生的状态 - 变化）

订阅功能允许组件绑定到状态部分，而无需强制重新渲染更改。最好将它与 useEffect 结合使用，以便在卸载时自动取消订阅。当你被允许直接改变视图时，这可能会对性能产生 [剧烈](https://codesandbox.io/s/peaceful-johnson-txtws) 影响。
```jsx
const useStore = create(set => ({ scratches: 0, ... }))

function Component() {
  // Fetch initial state
  const scratchRef = useRef(useStore.getState().scratches)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() => useStore.subscribe(
    state => (scratchRef.current = state.scratches)
  ), [])
```

## 厌倦了reducers和改变嵌套状态？使用immber！

reduce中使用嵌套结构的样板代码比较烦。你试过 [immer](https://github.com/mweststrate/immer) 吗？

```jsx
import produce from 'immer'

const useStore = create(set => ({
  lush: { forest: { contains: { a: "bear" } } },
  clearForest: () => set(produce(state => {
    state.lush.forest.contains = null
  }))
}))

const clearForest = useStore(state => state.clearForest)
clearForest();
```

## 中间件

你可以按你喜欢的任何方式在功能上组合你的store。

```jsx
// Log every time state is changed
const log = config => (set, get, api) => config(args => {
  console.log("  applying", args)
  set(args)
  console.log("  new state", get())
}, get, api)

// Turn the set method into an immer proxy
const immer = config => (set, get, api) => config((partial, replace) => {
  const nextState = typeof partial === 'function'
      ? produce(partial)
      : partial
  return set(nextState, replace)
}, get, api)

const useStore = create(
  log(
    immer((set) => ({
      bees: false,
      setBees: (input) => set((state) => void (state.bees = input)),
    })),
  ),
)
```
如何对中间件进行管道化
```js
import create from "zustand"
import produce from "immer"
import pipe from "ramda/es/pipe"

/* log and immer functions from previous example */
/* you can pipe as many middlewares as you want */
const createStore = pipe(log, immer, create)

const useStore = createStore(set => ({
  bears: 1,
  increasePopulation: () => set(state => ({ bears: state.bears + 1 }))
}))

export default useStore
```

有关TS示例，请参阅以下内容 [讨论](https://github.com/pmndrs/zustand/discussions/224#discussioncomment-118208)

如何在 TypeScript 中类型化 immer 中间件[*middlewareTypes.test.tsx*](https://github.com/pmndrs/zustand/blob/main/tests/middlewareTypes.test.tsx) 中有一个参考实现，其中包含一些用例。
你可以根据需要使用任何简化的变体。

## 持久化中间件

你可以使用任何类型的存储来持久化store的数据。
```jsx
import create from "zustand"
import { persist } from "zustand/middleware"

export const useStore = create(persist(
  (set, get) => ({
    fishes: 0,
    addAFish: () => set({ fishes: get().fishes + 1 })
  }),
  {
    name: "food-storage", // unique name
    getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
  }
))
```

请参阅此中间件的[完整文档](https://github.com/pmndrs/zustand/wiki/Persisting-the-store's-data)

## 不能没有redux - 像 reducers 和 action 类型？

```jsx
const types = { increase: "INCREASE", decrease: "DECREASE" }

const reducer = (state, { type, by = 1 }) => {
  switch (type) {
    case types.increase: return { grumpiness: state.grumpiness + by }
    case types.decrease: return { grumpiness: state.grumpiness - by }
  }
}

const useStore = create(set => ({
  grumpiness: 0,
  dispatch: args => set(state => reducer(state, args)),
}))

const dispatch = useStore(state => state.dispatch)
dispatch({ type: types.increase, by: 2 })
```
或者，直接使用我们的Redux中间件。它连接主reducer，设置初始状态，并向状态本身和vanilla AP添加调度函数。尝试[这个](https://codesandbox.io/s/amazing-kepler-swxol)示例。

```jsx
import { redux } from 'zustand/middleware'

const useStore = create(redux(reducer, initialState))
```

## 在 React 事件处理器之外调用操作
因为如果在事件处理器之外调用`setState`,React会对它进行同步处理。在事件处理器之外更新状态将强制 react 同步更新组件，因此增加了遇到僵尸-子效应的风险。
为了解决这个问题，这个action需要包含在 `unstable _batched Updates` 中

```jsx
import { unstable_batchedUpdates } from 'react-dom' // or 'react-native'

const useStore = create((set) => ({
  fishes: 0,
  increaseFishes: () => set((prev) => ({ fishes: prev.fishes + 1 }))
}))

const nonReactCallback = () => {
  unstable_batchedUpdates(() => {
    useStore.getState().increaseFishes()
  })
}
```

更多详情: https://github.com/pmndrs/zustand/issues/302

## Redux devtools

```jsx
import { devtools } from 'zustand/middleware'

// Usage with a plain action store, it will log actions as "setState"
const useStore = create(devtools(store))
// Usage with a redux store, it will log full action types
const useStore = create(devtools(redux(reducer, initialState)))
```

Devtools 将 store 函数作为它的第一个参数，你可以选择为 store 命名或配置带有第二个参数的[序列化](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#serialize)选项。

命名store：`devtools(store, {name: "My Store"})`，这将作为你的操作的前缀。
Devtools 将只记录来自每个单独store的操作，这与典型的*combined reducers* 的redux store不同。请查看合并store的方法
[https://github.com/pmndrs/zustand/issues/163](https://github.com/pmndrs/zustand/issues/163)

## React context

用 `create` 创建的sotre不需要context providers来包裹。在某些情况下，你可能希望使用contexts进行依赖注入，或者如果你想使用组件中的 props 初始化你的store。因为 store 是一个hook，把它作为一个普通的context值传递可能会违反hook的规则。为了避免误用，提供了一个特殊的`createContext`。

```jsx
import create from 'zustand'
import createContext from 'zustand/context'

const { Provider, useStore } = createContext()

const createStore = () => create(...)

const App = () => (
  <Provider createStore={createStore}>
    ...
  </Provider>
)

const Component = () => {
  const state = useStore()
  const slice = useStore(selector)
  ...
}
```

在实际组件中createContext的用法

```jsx
  import create from "zustand";
  import createContext from "zustand/context";

  // Best practice: You can move the below createContext() and createStore to a separate file(store.js) and import the Provider, useStore here/wherever you need.

  const { Provider, useStore } = createContext();

  const createStore = () =>
    create((set) => ({
      bears: 0,
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 })
    }));

  const Button = () => {
    return (
        {/** store() - This will create a store for each time using the Button component instead of using one store for all components **/}
      <Provider createStore={createStore}> 
        <ButtonChild />
      </Provider>
    );
  };

  const ButtonChild = () => {
    const state = useStore();
    return (
      <div>
        {state.bears}
        <button
          onClick={() => {
            state.increasePopulation();
          }}
        >
          +
        </button>
      </div>
    );
  };

  export default function App() {
    return (
      <div className="App">
        <Button />
        <Button />
      </div>
    );
  }
```

使用 props 初始化createContext (在TypeScript中)

```tsx
  import create from "zustand";
  import createContext from "zustand/context";

  type BearState = {
    bears: number
    increase: () => void
  }

  // pass the type to `createContext` rather than to `create`
  const { Provider, useStore } = createContext<BearState>();

  export default function App({ initialBears }: { initialBears: number }) {
    return (
      <Provider
        createStore={() =>
          create((set) => ({
            bears: initialBears,
            increase: () => set((state) => ({ bears: state.bears + 1 })),
          }))
        }
      >
        <Button />
      </Provider>
  )
}
```

## 对store手动类型化以及使用`combine`(合并)中间件推断类型

```tsx
// You can use `type`
type BearState = {
  bears: number
  increase: (by: number) => void
}

// Or `interface`
interface BearState {
  bears: number
  increase: (by: number) => void
}

// And it is going to work for both
const useStore = create<BearState>(set => ({
  bears: 0,
  increase: (by) => set(state => ({ bears: state.bears + by })),
}))
```
或者，使用 `combine` 并让 tsc 推断类型。这会将两个状态浅合并。

```tsx
import { combine } from 'zustand/middleware'

const useStore = create(
  combine(
    { bears: 0 },
    (set) => ({ increase: (by: number) => set((state) => ({ bears: state.bears + by })) })
  ),
)
```


使用多个中间件类型可能需要一些 TypeScript 知识。请参阅 [*middlewareTypes.test.tsx*](https://github.com/pmndrs/zustand/blob/main/tests/middlewareTypes.test.tsx) 中的一些工作示例。

## 最佳实践

* 你可能想知道如何组织你的代码以便更好地维护：[将store拆分为单独的切片](./splitting-the-store-into-separate-slices)。
* 这个不受约束的库的推荐用法：[Flux的启发与实践](./flux-inspired-practice)。


## 测试

有关使用 Zustand 进行测试的信息，请访问这个[Wiki 页面](./testing)

## 第三方库

一些用户可能想要扩展 Zustand 的功能集，这可以使用社区制作的 第三方方库来完成。有关 Zustand 的第三方库的信息，请访问专用的 [Wiki 页面](./3rd-party-libraries)

## 与其他库的比较

- [zustand 和 valtio 的区别](./difference-between-zustand-and-valtio)