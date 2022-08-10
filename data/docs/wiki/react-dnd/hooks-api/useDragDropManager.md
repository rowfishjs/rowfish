---
sidebar_position: 5
---
React DnD 新手？  在进入文档之前请[阅读概述](../quick-start/overview)

# useDragDropManager

这个钩子为用户提供了访问 DnD 系统的权限。拖放管理器实例是由 React DnD 创建的单例，包含对状态、监视器、后端等的访问。

```jsx
import { useDragDropManager } from 'react-dnd'

function Example() {
  // 该管理器提供对所有React DND内部的访问权限
  const dragDropManager = useDragDropManager()

  return <div>Example</div>
}
```
