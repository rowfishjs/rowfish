---
hide_title: true
sidebar_position: 3
sidebar_label: 自动生成选择器
---
建议在使用 store 中的属性或操作时使用选择器。

```javascript
const bears = useBearStore(state => state.bears)
```

但是，编写这些可能很乏味，但你可以自动生成它们

## 创建以下函数: `createSelectors`

```typescript
import create, { StateCreator, State, StoreApi, UseStore } from 'zustand'

interface Selectors<StoreType> {
  use: {
    [key in keyof StoreType]: () => StoreType[key]
  }
}

function createSelectors<StoreType extends State>(
  store: UseStore<StoreType>,
) {
  ;(store as any).use = {}

  Object.keys(store.getState()).forEach(key => {
    const selector = (state: StoreType) => state[key as keyof StoreType]
    ;(store as any).use[key] = () => store(selector)
  })

  return store as UseStore<StoreType> & Selectors<StoreType>
}
```

## 如果你有这样的store:

```typescript
interface BearState {
  bears: number;
  increase: (by: number) => void;
}

const useStoreBase = create<BearState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}));
```

## 在你的store中应用这个函数: 

```typescript
const useStore = createSelectors(useStoreBase);
```

## 现在选择器将自动生成:

```typescript
// get the property
const bears = useStore.use.bears();

// get the action
const increase = useStore.use.increase();
```

## 库

- 或者你可以 `npm i auto-zustand-selectors-hook`
- [auto-zustand-selectors-hook](https://github.com/Albert-Gao/auto-zustand-selectors-hook)