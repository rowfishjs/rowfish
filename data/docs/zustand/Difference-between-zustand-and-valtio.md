---
sidebar_position: 4
sidebar_label: zustand和valtio的区别
---
# zustand 和 valtio 和有什么区别？

参考: [https://github.com/pmndrs/zustand/issues/483](https://github.com/pmndrs/zustand/issues/483)

## 主要区别在于：zustand 是不可变状态模型，而 valtio 是可变状态模型。

```js
import create from 'zustand'

// intentionally show non-hook deep usage
const store = create(() => ({ obj: { count: 0 } }))
store.setState((prev) => ({ obj: { count: prev.obj.count + 1 } })
```

```js
import { proxy } from 'valtio'

import state = proxy({ obj: { count: 0 } })
state.obj.count += 1
```

## 另一个区别是渲染优化。

```js
import create from 'zustand'

const useStore = create(() => ({
  count1: 0,
  count2: 1,
}))

const Component = () => {
  const count1 = useStore((state) => state.count1) // manual render optimization with selector
  // ...
}
```

```js
import { proxy, useSnapshot } from 'valtio'

const state = proxy({
  count1: 0,
  count2: 0,
})

const Component = () => {
  const { count1 } = useSnapshot(state) // automatic render optimization with property access
  // ...
}
```