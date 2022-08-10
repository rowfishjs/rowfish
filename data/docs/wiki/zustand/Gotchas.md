---
sidebar_position: 6
sidebar_label: 陷阱
---
# 我的订阅没有被调用

如果你使用的是 ImmerJS，请确保你确实遵循了 ImmerJS 的规则。
例如，你必须添加` [immerable] = true` 才能使类对象工作。如果你不这样做，ImmerJS 仍然会改变对象，并不会变成代理，所以它也会更新基本状态。 Zustand 检查状态是否确实发生了变化，因此由于基本状态和下一个状态都相等（如果你没有正确执行），它将跳过调用订阅。