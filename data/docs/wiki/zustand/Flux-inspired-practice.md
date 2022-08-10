---
hide_title: true
sidebar_position: 5
sidebar_label: Flux的启发与实践
---

尽管 zustand 是一个非集中式的库，但这里是推荐的用法之一。

```js
const useStore = create((set) => ({
  storeSliceA: ...,
  storeSliceB: ...,
  storeSliceC: ...,
  dispatchX: () => set(...),
  dispatchY: () => set(...),
}))
```

- 创建一个单独的store
- 仅使用`set`定义store
- 在 store 的root级别定义 dispatch 函数来更新一个或多个 store切片

请参阅[将store拆分为单独的切片](./splitting-the-store-into-separate-slices)以定义具有单独切片的store。