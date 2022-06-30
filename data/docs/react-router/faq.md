---
sidebar_position: 5
hide_table_of_contents: true
---
# 常见问题

以下是 React Router v6中一些常见的问题:

## 路由器怎么了？ 我需要它！

这个问题通常源于你使用的是不支持hooks的 React 类组件。 在 React Router v6 中，我们完全接受了hooks并使用它们来共享路由器的所有内部状态。 但这并不意味着你不能使用router。 假设你实际上可以使用hooks（你使用的是 React 16.8+），你只需要一个包装器。 

```js
import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}
```

## 为什么`<Route>` 有一个`element` 属性而不是`render` 或`component`？ 

我们在 [从 v5 到 v6 的迁移指南中提到了这一点](https://reactrouter.com/docs/en/v6/upgrading/v5)，但这里值得重复。

在 React Router v6 中，我们从使用 v5 的 `<Route component>` 和 `<Route render>` API 切换到 `<Route element>`。这是为什么？

首先，我们看到 React 本身把 `<Suspense fallback={<Spinner />}>` 这个API作为优先使用 。 `fallback` prop采用 React **element**，而不是 **component**。这让你可以轻松地将你想要的任何props从渲染它的组件传递给你的 `<Spinner>`。

使用元素而不是组件意味着我们不必提供 `passProps` 风格的 API，这样你就可以获得元素所需的props。例如，在基于组件的 API 中，没有好的方法将 props 传递给当 `<Route path=":userId" component={Profile} />` 匹配时渲染的 `<Profile>` 组件。大多数采用这种方法的 React 库最终要么使用像 `<Route component={Profile} passProps={{ animate: true }} />` 这样的 API，或者使用渲染prop或高阶组件。

此外，`Route` 在 v5 中的渲染 API 相当大。当我们在 v4/5 上工作时，对话是这样的：

```js
// Ah, this is nice and simple!
<Route path=":userId" component={Profile} />

// But wait, how do I pass custom props to the <Profile> element??
// Hmm, maybe we can use a render prop in those situations?
<Route
  path=":userId"
  render={routeProps => (
    <Profile routeProps={routeProps} animate={true} />
  )}
/>

// Ok, now we have two ways to render something with a route. :/

// But wait, what if we want to render something when a route
// *doesn't* match the URL, like a Not Found page? Maybe we
// can use another render prop with slightly different semantics?
<Route
  path=":userId"
  children={({ match }) => (
    match ? (
      <Profile match={match} animate={true} />
    ) : (
      <NotFound />
    )
  )}
/>

// What if I want to get access to the route match, or I need
// to redirect deeper in the tree?
function DeepComponent(routeStuff) {
  // got routeStuff, phew!
}
export default withRouter(DeepComponent);

// Well hey, now at least we've covered all our use cases!
// ... *facepalm*
```

这个 API 泛滥使用的至少部分原因是 React 没有提供任何方式让我们从 `<Route>` 获取信息到你的路由节点，所以我们必须发明聪明的方法来获取路由数据 **和**你自己的自定义props到你的节点：`component`、render props、`passProps`高阶组件......直到**hooks**出现！

现在，上面的对话是这样的：

```js
// Ah, nice and simple API. And it's just like the <Suspense> API!
// Nothing more to learn here.
<Route path=":userId" element={<Profile />} />

// But wait, how do I pass custom props to the <Profile>
// element? Oh ya, it's just an element. Easy.
<Route path=":userId" element={<Profile animate={true} />} />

// Ok, but how do I access the router's data, like the URL params
// or the current location?
function Profile({ animate }) {
  let params = useParams();
  let location = useLocation();
}

// But what about components deep in the tree?
function DeepComponent() {
  // oh right, same as anywhere else
  let navigate = useNavigate();
}

// Aaaaaaaaand we're done here.
```

在 v6 中使用 `element` 属性的另一个重要原因是 `<Route children>` 在嵌套路由中是保留的。 你可以在 v6 的 [入门指南](./overview#嵌套路由) 中阅读更多相关信息。

## 如何在 react-router v6 中添加 No Match (404) 路由？

在 v4 中，我们只会将path prop留在路由之外。 在 v5 中，我们会将 404 元素包装在 Route 中并使用 `path="*"`。 在 v6 中使用新的element prop来替代，改为传递 `path="*"`：

```js
<Route path="*" element={<NoMatch />} />
```

## `<Route>` 不渲染？ 我该怎么办？

在 v5 中，`<Route>` 组件只是一个普通组件，就像一个 `if` 语句，当 URL 匹配它的路径时渲染。 在 v6 中，`<Route>` 组件实际上并不渲染，它只是用于配置。

在 v5 中，由于路由只是组件，当路径为 "/my-route" 时，`MyRoute` 将被渲染。

```tsx
let App = () => (
  <div>
    <MyRoute />
  </div>
);

let MyRoute = ({ element, ...rest }) => {
  return (
    <Route path="/my-route" children={<p>Hello!</p>} />
  );
};
```

然而，在 v6 中，`<Route>` 只用于它的 props，所以下面的代码永远不会渲染 `<p>Hello!</p>`，因为 `<MyRoute>` 没有path可以被 `<Routes>  ` 找到：

```tsx
let App = () => (
  <Routes>
    <MyRoute />
  </Routes>
);

let MyRoute = () => {
  // won't ever render because the path is down here
  return (
    <Route path="/my-route" children={<p>Hello!</p>} />
  );
};
```

你可以通过以下方式获得相同的行为：

- 只在 `<Routes>` 内渲染 `<Route>` 元素
- 将composition移动到 `element` prop中

```tsx
let App = () => (
  <div>
    <Routes>
      <Route path="/my-route" element={<MyRoute />} />
    </Routes>
  </div>
);

let MyRoute = () => {
  return <p>Hello!</p>;
};
```

在 `<Routes>` 中静态提供完整的嵌套路由配置将启用 `v6.x` 中的许多功能，因此我们鼓励你将路由放在一个顶级配置中。 如果你真的喜欢独立于任何其他组件的匹配 URL 的组件的想法，你可以使用以下内容制作一个行为类似于 v5 `Route` 的组件：

```tsx
function MatchPath({ path, Comp }) {
  let match = useMatch(path);
  return match ? <Comp {...match} /> : null;
}

// Will match anywhere w/o needing to be in a `<Routes>`
<MatchPath path="/accounts/:id" Comp={Account} />;
```

## 如何在路由树种深度嵌套路由？

在 v5 中，你可以在任何你想要的地方渲染 `<Route>` 或 `<Switch>`。 你可以继续做同样的事情，但你需要使用 `<Routes>`（没有 's' 的 `<Route>` 将不起作用）。 我们称这些为"后代`<Routes>`"。

它在 v5 中可能看起来像这样

```tsx
// somewhere up the tree
<Switch>
  <Route path="/users" component={Users} />
</Switch>;

// and now deeper in the tree
function Users() {
  return (
    <div>
      <h1>Users</h1>
      <Switch>
        <Route path="/users/account" component={Account} />
      </Switch>
    </div>
  );
}
```

在 v6 中几乎是一样的：

- 注意祖先路由中的 `*` 以使其匹配更深的 URL，即使它没有直接子路由
- 你不再需要知道整个子路由路径，现在可以使用相对路由

```tsx
// somewhere up the tree
<Routes>
  <Route path="/users/*" element={<Users />} />
</Routes>;

// and now deeper in the tree
function Users() {
  return (
    <div>
      <h1>Users</h1>
      <Routes>
        <Route path="account" element={<Account />} />
      </Routes>
    </div>
  );
}
```

如果你在 v5 中有一个"浮动路由"（没有包裹在 `<Switch>` 中），只需将它包裹在一个 `<Routes>` 中。

```tsx
// v5
<Route path="/contact" component={Contact} />

// v6
<Routes>
  <Route path="contact" element={<Contact />} />
</Routes>
```

## 正则表达式路由路径发生了什么变化？

正则表达式路由路径被移除的原因有两个：

1.  路由中的正则表达式路径给v6的排位路由匹配提出了很多问题。 你如何对正则表达式进行排名？
2.  我们能够摆脱整个依赖（路径到正则表达式）并显著减少发送到用户浏览器的包重量。 如果加回来，它将消耗 React Router 页面权重的 1/3！

在查看了大量用例后，我们发现我们仍然可以在没有直接正则表达式路径支持的情况下满足它们，因此我们进行了权衡以显着减小包大小并避免围绕正则表达式路由排序的开放性问题。

大多数 regexp 路由一次只关心一个 URL 段，并做以下两件事之一：

1.  匹配多个静态值
2.  以某种方式验证参数（是数字，不是数字等）

**匹配一般静态值**

我们看到的一个非常常见的路径是匹配多种语言代码的正则表达式：

```tsx
function App() {
  return (
    <Switch>
      <Route path={/(en|es|fr)/} component={Lang} />
    </Switch>
  );
}

function Lang({ params }) {
  let lang = params[0];
  let translations = I81n[lang];
  // ...
}
```

这些实际上都只是静态路径，因此在 v6 中你可以创建三个路由并将代码直接传递给组件。 如果你有很多，请制作一个数组并将其映射到路由中以避免重复。

```tsx
function App() {
  return (
    <Routes>
      <Route path="en" element={<Lang code="en" />} />
      <Route path="es" element={<Lang code="en" />} />
      <Route path="fr" element={<Lang code="en" />} />
    </Routes>
  );
}

function Lang({ lang }) {
  let translations = I81n[lang];
  // ...
}
```

**进行某种参数验证**

另一个常见的情况是确保参数是整数。

```tsx
function App() {
  return (
    <Switch>
      <Route path={/users\/(\d+)/} component={User} />
    </Switch>
  );
}

function User({ params }) {
  let id = params[0];
  // ...
}
```

在这种情况下，你必须自己使用匹配组件中的正则表达式做一些工作：

```tsx
function App() {
  return (
    <Routes>
      <Route path="users/:id" element={<ValidateUser />} />
      <Route path="/users/*" component={NotFound} />
    </Routes>
  );
}

function ValidateUser() {
  let params = useParams();
  let userId = params.id.match(/\d+/);
  if (!userId) {
    return <NotFound />;
  }
  return <User id={params.userId} />;
}

function User(props) {
  let id = props.id;
  // ...
}
```

在 v5 中，如果正则表达式不匹配，则 `<Switch>` 将继续尝试匹配下一个路由：

```tsx
function App() {
  return (
    <Switch>
      <Route path={/users\/(\d+)/} component={User} />
      <Route path="/users/new" exact component={NewUser} />
      <Route
        path="/users/inactive"
        exact
        component={InactiveUsers}
      />
      <Route path="/users/*" component={NotFound} />
    </Switch>
  );
}
```

看看这个例子，你可能会担心在 v6 版本中你的其他路由不会在它们的 URL 上渲染，因为 `:userId` 路由可能首先匹配。 但是，由于路由排名，情况并非如此。 "new"和"inactive"路由将排名更高，因此在各自的 URL 上渲染：

```tsx
function App() {
  return (
    <Routes>
      <Route path="/users/:id" element={<ValidateUser />} />
      <Route path="/users/new" element={<NewUser />} />
      <Route
        path="/users/inactive"
        element={<InactiveUsers />}
      />
    </Routes>
  );
}
```

事实上，如果你的路由不是按顺序排列的，v5 版本就会有各种各样的问题。 V6 完全消除了这个问题。

**Remix Users**

如果你正在使用 [Remix](https://remix.run)，你可以通过将这项工作移动到你的加载程序中来向浏览器发送适当的 40x 响应。 这也减少了发送给用户的浏览器包的大小，因为加载程序只在服务端上运行。

```tsx
import { useLoaderData } from "remix";

export async function loader({ params }) {
  if (!params.id.match(/\d+/)) {
    throw new Response("", { status: 400 });
  }

  let user = await fakeDb.user.find({ where: { id: params.id=}})
  if (!user) {
    throw new Response("", { status: 404})
  }

  return user;
}

function User() {
  let user = useLoaderData();
  // ...
}
```

remix 不会渲染你的组件，而是渲染最近的 [catch 边界](https://docs.remix.run/v0.20/api/app/#catchboundary)。
