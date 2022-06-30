---
hide_title: true
sidebar_position: 9
sidebar_label: 将store拆分为单独的切片
---
当你的项目随着各种形式的数据而增长，你可能希望保证文件比较小且易于管理。
就像在 Redux 中的 `combineReducers` 一样，你可以将你的 store 拆分为能够相互访问的各种函数，从而跟踪全局状态。

```jsx

import create from 'zustand'

const createBearSlice = (set, get) => ({
   eatFish: () => set((prev) => ({ fishes: prev.fishes > 1 ? prev.fishes - 1 : 0}))
})

const createFishSlice = (set, get) => ({
   fishes: 10
})

const useStore = create( (set, get) => ({
    ...createBearSlice(set, get),
    ...createFishSlice(set, get)
}))

function App() {

  const fishes = useStore(state => state.fishes);
  const eatFish = useStore(state => state.eatFish);

  return (
    <div className="App">
      
      <p>Fishes : {fishes}</p>
      <p><button onClick={eatFish}>Eat</button></p>
    
    </div>
  );
}

export default App;
```

查看此代码在具有不同文件的结构中工作:

https://codesandbox.io/s/new-dawn-vl03k?file=/src/App.js

______

这是 TypeScript 用户的实践：

https://github.com/pmndrs/zustand/issues/508#issue-951331506

https://codesandbox.io/s/nostalgic-voice-3knvd?file=/src/App.js