---
sidebar_position: 10
sidebar_label: 测试
hide_title: true
hide_table_of_contents: true
---
## 在测试之间重置状态

运行测试时，在每次测试运行之前不会自动重置stores。
因此，在某些情况下，一个测试的状态可能会影响另一个测试。要确保所有测试都以原始store状态运行，你可以在测试期间模拟`zustand`，并将其替换为以下代码：

```jsx
import actualCreate from 'zustand';
import { act } from 'react-dom/test-utils';

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set();

// when creating a store, we get its initial state, create a reset function and add it in the set
const create = createState => {
  const store = actualCreate(createState);
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
};

// Reset all stores after each test run
afterEach(() => {
  act(() => storeResetFns.forEach((resetFn) => resetFn()));
});

export default create;
```

你可以mock一个依赖的方式取决于你的测试运行器。
在 [jest](https://jestjs.io/)中，你可以创建一个 `_ mocks _ /zustand.js `并将代码放在那里。如果你的应用使用 `zustand/vanilla` 而不是 `zustand`，那么你必须将上述代码放在 `_ mocks _ /zustand/vanilla.js`