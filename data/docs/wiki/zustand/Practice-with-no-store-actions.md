---
hide_title: true
sidebar_position: 8
sidebar_label: 在没有store actions的情况下的实践
---
readme 中的用法是将actions放入store中

```js
export const useStore = create((set) => ({
  count: 0,
  text: 'hello',
  inc: () => set((state) => ({ count: state.count + 1 })),
  setText: (text) => set({ text }),
})
```

这将创建一个带有actions的自包含store

---

另一种方法是在模块级别定义操作

```js
export const useStore = create(() => ({
  count: 0,
  text: 'hello',
})

export const inc = () => useStore.setState((state) => ({ count: state.count + 1 }))

export const setText = (text) => useStore.setState({ text })
```

这更有效，因为：

-   它不需要一个hook来获取一个action，并且
-   代码拆分是可能的。