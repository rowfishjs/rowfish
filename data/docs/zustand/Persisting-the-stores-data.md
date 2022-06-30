---
sidebar_position: 7
sidebar_label: 持久化store的数据
---
# 持久化中间件

:::tip

译者注: 因为在状态管理中直接持久化太过耦合,不够灵活,所以个人建议最好外部使用单独的自定义或第三方组件来处理本地的数据持久化

:::

持久中间件使你能够将 Zustand 状态存储在storage中（例如`localStorage`, `AsyncStorage`, `IndexedDB`等），从而持久化它的数据。
请注意，此中间件确实支持同步存储（例如 `localStorage`）和异步存储（例如 `AsyncStorage`），但使用异步存储确实会带来成本。
有关更多详细信息，请参阅 [水合作用和异步存储](#水合和异步存储) 。

快速示例:

```ts
import create from "zustand"
import { persist } from "zustand/middleware"

export const useStore = create(persist(
  (set, get) => ({
    fishes: 0,
    addAFish: () => set({ fishes: get().fishes + 1 })
  }),
  {
    name: "food-storage", // name of item in the storage (must be unique)
    getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
  }
))
```

请参阅[选项](#选项)了解更多详情

## 选项

### `name`

这是唯一的必填选项选项。
给定的名称将是用于在store中存储你的 Zustand 状态的键，因此它必须是唯一的。

### `getStorage`

:::info
值: `() => localStorage`
:::

使你能够使用自己的storage。
只需传递一个函数，该函数返回你要使用的store。

示例:

```ts
export const useStore = create(persist(
  (set, get) => ({
    // ...
  }),
  {
    // ...
    getStorage: () => AsyncStorage,
  }
))
```

给定的storage必须匹配以下接口:

```ts
interface Storage {
  getItem: (name: string) => string | null | Promise<string | null>
  setItem: (name: string, value: string) => void | Promise<void>
  removeItem: (name: string) => void | Promise<void>
}
```

### `serialize`

:::
info类型: `(state: Object) => string | Promise<string>`
:::

:::info
默认值: `(state) => JSON.stringify(state)` 
:::

由于将对象存储在storage中的唯一方法是通过字符串，你可以使用此选项提供自定义函数以将你的状态序列化为字符串。

例如，如果你想将状态存储在 base64 中：

```ts
export const useStore = create(persist(
  (set, get) => ({
    // ...
  }),
  {
    // ...
    serialize: (state) => btoa(JSON.stringify(state)),
  }
))
```

请注意，你还需要一个自定义`deserialize` (反序列化)函数才能使其正常工作。见下文。

### `deserialize`

:::info
类型: `(str: string) => Object | Promise<Object>`
:::

:::info
默认值: `(str) => JSON.parse(str)`
:::

如果你传递自定义序列化函数，则很可能还需要传递自定义反序列化函数。
要继续上面的示例，你可以使用以下命令反序列化 base64 值：

```ts
export const useStore = create(persist(
  (set, get) => ({
    // ...
  }),
  {
    // ...
    deserialize: (str) => JSON.parse(atob(str)),
  }
))
```

### `partialize`

:::info
类型: `(state: Object) => Object`
:::

:::info
默认值: `(state) => state`
:::

使你能够排除一些要存储在storage中的状态字段。
你可以使用以下方法排除多个字段：

```ts
export const useStore = create(persist(
  (set, get) => ({
    foo: 0,
    bar: 1,
  }),
  {
    // ...
    partialize: (state) =>
      Object.fromEntries(
        Object.entries(state).filter(([key]) => !["foo"].includes(key))
      ),
  }
))
```

或者你可以只允许使用如下的特定字段：

```ts
export const useStore = create(persist(
  (set, get) => ({
    foo: 0,
    bar: 1,
  }),
  {
    // ...
    partialize: (state) => ({ foo: state.foo })
  }
))
```

### `onRehydrateStorage`

:::info
类型: `(state: Object) => ((state?: Object, error?: Error) => void) | void`
:::

此选项使你能够传递将在存储storage水合时调用的侦听器函数。

示例：

```ts
export const useStore = create(persist(
  (set, get) => ({
    // ...
  }),
  {
    // ...
    onRehydrateStorage: (state) => {
      console.log("hydration starts");
			
      // optional
      return (state, error) => {
        if (error) {
          console.log("an error happened during hydration", error)
        } else {
          console.log("hydration finished")
        }
      }
    }
  }
))
```

### `version`

:::info
类型: `number`
:::

:::info
默认值: `0`
:::

如果要在storage中引入重大更改（例如重命名字段），可以指定新版本号。
默认情况下，如果storage中的版本与代码中的版本不匹配，则存储的值不会被使用。
有关处理重大更改的更多详细信息，请参阅下面的`migrate`选项。

### `migrate`

:::info
类型: `(persistedState: Object, version: number) => Object | Promise<Object>`
:::

:::info
默认值: `(persistedState) => persistedState`
:::

你可以使用此选项来处理版本迁移。
migrate 函数将持久化状态和版本号作为参数。它必须返回符合最新版本（代码中的版本）的状态。
例如，如果要重命名字段，可以使用以下命令：

```ts
export const useStore = create(persist(
  (set, get) => ({
    newField: 0, // let's say this field was named otherwise in version 0
  }),
  {
    // ...
    version: 1, // a migration will be triggered if the version in the storage mismatches this one
    migrate: (persistedState, version) => {
      if (version === 0) {
        // if the stored value is in version 0, we rename the field to the new name
        persistedState.newField = persistedState.oldField;
        delete persistedState.oldField;
      }
      
      return persistedState;
    },
  }
))
```

### `merge`

:::info
类型: `(persistedState: Object, currentState: Object) => Object`
:::

:::info
默认值: `(persistedState, currentState) => ({ ...currentState, ...persistedState })`
:::

在某些情况下，你可能希望使用自定义合并函数将持久值与当前状态合并。
默认情况下，中间件进行浅合并。
如果你部分持久化了嵌套对象，那么浅层合并可能还不够。
例如，如果storage包含以下内容：

```ts
{
  foo: {
    bar: 0,
  }
}
```

但是你的 Zustand store包含：

```ts
{
  foo: {
    bar: 0,
    baz: 1,
  }
}
```

浅合并将从` foo `对象中删除 `baz `字段。
解决此问题的一种方法是提供自定义深度合并功能：

```ts
export const useStore = create(persist(
  (set, get) => ({
    foo: {
      bar: 0,
      baz: 1,
    },
  }),
  {
    // ...
    merge: (persistedState, currentState) => deepMerge(currentState, persistedState),
  }
))
```

## API

:::note
Version: >=3.6.3
:::

持久化api使你能够从 React 组件的内部或外部与持久中间件进行大量交互。

### `setOptions`

:::info
类型: `(newOptions: PersistOptions) => void`
:::

此方法使你能够更改中间件选项。请注意，新选项将与当前选项合并。

例如，这可用于更改storage名称：

```ts
useStore.persist.setOptions({
  name: "new-name"
});
```

甚至更改storage引擎：

```ts
useStore.persist.setOptions({
  getStorage: () => sessionStorage,
});
```

### `clearStorage`

:::info
类型: `() => void`
:::

这个方法用于完全清除storage中的持久值。

```ts
useStore.persist.clearStorage();
```

### `rehydrate`

:::info
类型: `() => Promise<void>`
:::

在某些情况下，你可能希望手动触发水合作用。
这可以通过调用 `rehydrate `方法来完成。

```ts
await useStore.persist.rehydrate();
```

### `hasHydrated`

:::info
类型: `() => boolean`
:::

这是一个非响应式的 getter，用于了解storage是否已被水合（请注意，这在调用 `useStore.persist.rehydrate()` 时会更新）。

```ts
useStore.persist.hasHydrated();
```

### `onHydrate`

:::info
类型: `(listener: (state) => void) => () => void`
:::

水合过程开始时将调用给定的监听器。

```ts
const unsub = useStore.persist.onHydrate((state) => {
  console.log("hydration starts");
});

// later on...
unsub();
```

### `onFinishHydration`

:::info
类型: `(listener: (state) => void) => () => void`
:::

当水合过程结束时，将调用给定的监听器。

```ts
const unsub = useStore.persist.onFinishHydration((state) => {
  console.log("hydration finished");
});

// later on...
unsub();
```

## 水合和异步存储

要解释异步存储的“成本”是什么，你需要了解什么是水合作用。
简而言之，水合是从storage中检索持久状态并将其与当前状态合并的过程。
persist 中间件执行两种 hydration：同步和异步。
如果给定的storage是同步的（例如`localStorage`），则 hydration 将同步完成，如果给定的存储是异步的（例如 `AsyncStorage`），则 hydration 将异步完成......🥁。
但问题是什么？
好吧，在同步水合中，Zustand storage将在其创建时进行水合。
在异步水合中，Zustand storage将在稍后的微任务中水合。
为什么这有关系？
异步水合可能会导致一些意外行为。
例如，如果你在 React 应用程序中使用 Zustand，store将不会在初始渲染时加水。如果你的应用程序依赖于页面加载时的持久值，你可能希望等到store已被水合后再显示任何内容（例如，你的应用可能认为用户未登录，因为这是默认值，而实际上store还没有被水合）。
如果你的应用确实依赖于页面加载时的持久状态，请参阅如何检查我的store是否已加水？在 Q/A 中。

## Q/A

### 如何检查我的storage是否已加水?

有几种不同的方法可以做到这一点。
你可以使用 `onRehydrateStorage` 选项来更新store中的字段：

```ts
const useStore = create(
  persist(
    (set, get) => ({
      // ...
      _hasHydrated: false
    }),
    {
      // ...
      onRehydrateStorage: () => () => {
        useStore.setState({ _hasHydrated: true })
      }
    }
  )
);

export default function App() {
  const hasHydrated = useStore(state => state._hasHydrated);

  if (!hasHydrated) {
    return <p>Loading...</p>
  }

  return (
    // ...
  );
}
```

你还可以创建自定义使用 `Hydration` hook：

```ts
const useStore = create(persist(...))

const useHydration = () => {
  const [hydrated, setHydrated] = useState(useStore.persist.hasHydrated)
  
  useEffect(() => {
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false)) // Note: this is just in case you want to take into account manual rehydrations. You can remove this if you don't need it/don't want it.
    const unsubFinishHydration = useStore.persist.onFinishHydration(() => setHydrated(true))
    
    setHydrated(useStore.persist.hasHydrated())
    
    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])
  
  return hydrated
}
```

### 如何使用自定义storage引擎

如果你要使用的storage与预期的 API 不匹配，你可以创建自己的存储:

```ts
import create from "zustand"
import { persist, StateStorage } from "zustand/middleware"
import { get, set, del } from 'idb-keyval' // can use anything: IndexedDB, Ionic Storage, etc.

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "has been retrieved");
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, "with value", value, "has been saved");
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted");
    await del(name)
  }
}

export const useStore = create(persist(
  (set, get) => ({
    fishes: 0,
    addAFish: () => set({ fishes: get().fishes + 1 })
  }),
  {
    name: "food-storage", // unique name
    getStorage: () => storage,
  }
))
```