---
hide_title: true
sidebar_position: 12
sidebar_label: 更新嵌套状态对象值
---
## 深度嵌套对象

如果你有一个像这样的深度状态对象:

```ts
type State = {
  deep: {
    nested: {
      obj: { count: number }
    }
  }
 }
```

要保证数据不可变就需要一些努力.

## 普通方式

正常的方法是使用 `...`复制状态对象:

```ts
  normalInc: () =>
    set((state) => ({
      ...state,
      deep: {
        ...state.deep,
        nested: {
          ...state.deep.nested,
          obj: {
            ...state.deep.nested.obj,
            count: state.deep.nested.obj.count + 1
          }
        }
      }
    })),
```

这代码非常长!

## 使用immer

很多人使用 immer 来更新嵌套值:

```ts
  immerInc: () =>
    set(produce((state: State) => { ++state.deep.nested.obj.count })),
```

这会减少许多代码!

## 使用optics-ts

[optics-ts](https://github.com/akheron/optics-ts/)是另外一种选择:

```ts
  opticsInc: () =>
    set(O.modify(O.optic<State>().path("deep.nested.obj.count"))((c) => c + 1)),
```

与 immer 不同，optics-ts不使用代理也不使用mutation语法

## 使用ramda

你也可以使用 [ramda](https://ramdajs.com/):

```ts
  ramdaInc: () =>
    set(R.over(R.lensPath(["deep", "nested", "obj", "count"]), (c) => c + 1)),
```

这适用于类型以及optics-ts

## CodeSandbox 演示

https://codesandbox.io/s/zustand-normal-immer-optics-ramda-updating-ynn3o?file=/src/App.tsx