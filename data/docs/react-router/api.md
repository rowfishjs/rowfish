---
sidebar_position: 6
---
# API 参考

React Router 是[React 组件](https://reactjs.org/docs/components-and-props.html)、[hooks](https://reactjs.org/docs/hooks-intro.html)和一套工具的集合，使使用[React](https://reactjs.org/)构建多页面应用程序变得容易。此参考包含 React Router 中各种接口的函数签名和返回类型。


## 概述

### 包

React Router 以三个不同的包发布到 npm：

- [`react-router`](https://npm.im/react-router) 包含 React Router 的大部分核心功能，包括路由匹配算法和大部分核心组件和hooks
- [`react-router-dom`](https://npm.im/react-router-dom)包含`react-router`中的一切并增加了一些DOM专用的API，其中包括[`<BrowserRouter>`](#browserrouter), [`<HashRouter>`](#hashrouter),和 [`<Link>`](#link)
- [`react-router-native`](https://npm.im/react-router-native)包含`react-router`中的一切并增加了一些React Native专用的API，包括[`<NativeRouter>`](#nativerouter)和一个native版本的[ `<Link>`](#link-react-native)

当安装`react-router-dom`或`react-router-native`时,会自动包含`react-router`作为依赖，并且它们都从`react-router`暴露所有接口。当你`import`它们的模块的时候，你应该总是从`react-router-dom`或`react-router-native`导入，绝对不要直接从`react-router`导入. 否则，你可能会意外地在你的应用中导入不匹配的库版本。

如果你将React Router[安装](./installation)为全局（使用`<script>`标签），你可以在`window.ReactRouterDOM`对象上找到它。如果你从 npm 安装它，你可以通过[`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)来导入需要的模块。本参考中的示例均使用`import`语法。

### 设置

为了让 React Router 在你的应用中工作，你需要在节点树的根节点或其边上渲染一个路由器节点。我们提供了几种不同的路由器，具体取决于你的应用程序运行的环境。

- [`<BrowserRouter>`](#browserrouter) 或 [`<HashRouter>`](#hashrouter) 应该在在 Web 浏览器中运行时使用（选择哪个取决于你喜欢或需要的 URL 样式）
- [`<StaticRouter>`](#staticrouter) 应该在服务端渲染网站时使用
- [`<NativeRouter>`](#nativerouter) 应该在[React Native](https://reactnative.dev/)应用程序中使用
- [`<MemoryRouter>`](#memoryrouter) 在测试场景中很有用，并作为其他路由器的参考实现

这些路由器提供了 React Router 在特定环境中运行所需的上下文。如果出于某种原因需要更细粒度的控制，你也可以在每个渲染器都内置一个[`<Router>`](#router)组件。但是很可能你只需要其中一个内部的路由器。

### 路由

路由是决定哪些 React 元素将在你的应用程序的给定页面上渲染以及它们将如何嵌套的过程。React Router 提供了两个接口来定义你的路由。

- JSX中可以使用[`<Routes>` 和 `<Route>`](#routes-and-route)来定义
- 如果你更喜欢配置式路由则可以使用[`useRoutes`](#useroutes) 

包内部使用的一些底层代码也公开为公共 API，以防你出于某种原因需要构建自己的高级接口

- [`matchPath`](#matchpath) - 根据 URL 路径名匹配路径模式
- [`matchRoutes`](#matchroutes) - 将一组路线与某个 [location](#location)对象匹配
- [`createRoutesFromChildren`](#createroutesfromchildren) - 从一组 React 组件（例如   [`<Route>`](#routes-and-route)）创建路由配置

### 导航

React Router 的导航接口让你可以通过修改当前[location](#location)对象来更改当前渲染的页面。有两个主要接口/组件 可用于在你的应用程序中的页面之间导航，根据你的需要来选择。

- [`<Link>`](#link) 和 [`<NavLink>`](#navlink) 渲染一个可访问的`<a>`标签，而`TouchableHighlight`则在 React Native 上渲染。这让用户可以通过单击或点击页面上的点击来启动导航。
- [`useNavigate`](#usenavigate) 和 [`<Navigate>`](#navigate)让你以编程方式进行导航，通常在事件处理程序中或用于响应某些状态变化

同样我们暴露内部的一些低级 API，它们在构建你自己的导航界面时也可能很有用。

- [`useResolvedPath`](#useresolvedpath) - 解析当前[location](#location)的相对路径
- [`useHref`](#usehref) - 解析合适的相对路径来作为 `<a href>`标签使用
- [`useLocation`](#uselocation) 和 [`useNavigationType`](#usenavigationtype) - 这些描述了当前[location](#location)以及我们如何到达那里
- [`useLinkClickHandler`](#uselinkclickhandler) - 当在`react-router-dom`中构建一个自定义的`<Link>`时返回一个用于导航的事件处理器
- [`useLinkPressHandler`](#uselinkpresshandler) - 当在`react-router-native`中构建一个自定义的`<Link>`时返回一个用于导航的事件处理器
- [`resolvePath`](#resolvepath) - 根据给定的 URL 路径名解析相对路径

### 搜索参数

Access to the URL [search parameters](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams) is provided via [the `useSearchParams` hook](#usesearchparams).

通过提供的[`useSearchParams hook` ](#usesearchparams)hook来访问URL[搜索参数](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams)。

---

## 参考

### `<BrowserRouter>`

**类型声明**

```tsx
declare function BrowserRouter(
  props: BrowserRouterProps
): React.ReactElement;

interface BrowserRouterProps {
  basename?: string;
  children?: React.ReactNode;
  window?: Window;
}
```

`<BrowserRouter>`是在 Web 浏览器中运行 React Router 的推荐接口。`<BrowserRouter>`组件使用干净的 URL 将当前位置存储在浏览器的地址栏中，并使用浏览器的内置历史堆栈进行导航。

`<BrowserRouter window>`默认使用当前[文档的`defaultView`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView)，但它也可用于跟踪对另一个窗口的 URL 的更改，例如在`<iframe>`中。

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    {/* The rest of your app goes here */}
  </BrowserRouter>,
  root
);
```

### `<HashRouter>`

**类型声明**

```tsx
declare function HashRouter(
  props: HashRouterProps
): React.ReactElement;

interface HashRouterProps {
  basename?: string;
  children?: React.ReactNode;
  window?: Window;
}
```

当 URL 由于某种原因不应（或不能）发送到服务器时，浏览器可以使用`<HashRouter>`方案。在某些你无法完全控制服务器的共享托管方案中，可能会发生这种情况。在这些情况下，`<HashRouter>`可以将当前位置存储在当前 URL的`hash`部分中，因此永远不会将其发送到服务器。

`<HashRouter window>`默认使用当前[文档的`defaultView`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView)，但它也可用于跟踪对另一个窗口 URL 的更改，例如在`<iframe>`中。

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

ReactDOM.render(
  <HashRouter>
    {/* The rest of your app goes here */}
  </HashRouter>,
  root
);
```

>   我们强烈不建议你使用`HashRouter`,除非不得不用

### `<NativeRouter>`

**类型声明**

```tsx
declare function NativeRouter(
  props: NativeRouterProps
): React.ReactElement;

interface NativeRouterProps extends MemoryRouterProps {}
```

`<NativeRouter>`是在[React Native](https://reactnative.dev/)应用中运行 React Router 的推荐接口。

-   `<NativeRouter initialEntries>`默认为`["/"]`（根URL`/` 中的单个条目）
-   `<NativeRouter initialIndex>` 默认为 `initialEntries`的最后一个索引

```tsx
import * as React from "react";
import { NativeRouter } from "react-router-native";

function App() {
  return (
    <NativeRouter>
      {/* The rest of your app goes here */}
    </NativeRouter>
  );
}
```

### `<MemoryRouter>`

**类型声明**

```tsx
declare function MemoryRouter(
  props: MemoryRouterProps
): React.ReactElement;

interface MemoryRouterProps {
  basename?: string;
  children?: React.ReactNode;
  initialEntries?: InitialEntry[];
  initialIndex?: number;
}
```

`<MemoryRouter>`将其位置存储在内存的一个数组中。与`<BrowserHistory>`和`<HashHistory>`不同，它不依赖于外部源，如浏览器中的历史堆栈。这使其非常适合需要完全控制历史堆栈的场景，例如测试。

-   `<MemoryRouter initialEntries>`默认为`["/"]`（根URL `/`中的单个条目）
-   `<MemoryRouter initialIndex>` 默认为 `initialEntries`的最后一个索引

>   **提示：**
>
>   大多数 React Router 的测试都是使用 `<MemoryRouter>`作为事实来源编写的，因此你只需[浏览我们的测试](https://github.com/remix-run/react-router/tree/main/packages/react-router/__tests__)，就可以看到一些使用它的很好的例子 。

```tsx
import * as React from "react";
import { create } from "react-test-renderer";
import {
  MemoryRouter,
  Routes,
  Route
} from "react-router-dom";

describe("My app", () => {
  it("renders correctly", () => {
    let renderer = create(
      <MemoryRouter initialEntries={["/users/mjackson"]}>
        <Routes>
          <Route path="users" element={<Users />}>
            <Route path=":id" element={<UserProfile />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
```

### `<Link>`

>   **笔记：**
>
>   这是网页版的`<Link>`。对于 React Native 版本， [请转到此处](#link-react-native)。

**类型声明**

```tsx
declare function Link(props: LinkProps): React.ReactElement;

interface LinkProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  > {
  replace?: boolean;
  state?: any;
  to: To;
  reloadDocument?: boolean;
}

type To = Partial<Location> | string;
```

`<Link>`是允许用户通过点击它来导航到另一个页面组件。在 `react-router-dom`中，一个`<Link>`将渲染一个拥有指向资源的真实`href`属性的可访问的`<a>`标签。这意味着`<Link>`会像你期望的那样单击工作。你可以使用`<Link reloadDocument>`跳过客户端路由并让浏览器正常处理转换（就好像它是一个`<a href>`）。

```tsx
import * as React from "react";
import { Link } from "react-router-dom";

function UsersIndexPage({ users }) {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={user.id}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`<Link to>`的相对路径值（不以 开头`/`）会相对于父路由解析，这意味着它建立在渲染该`<Link>`的父路径的URL的基础上. 它可能包含`..`链接到层次结构更上一层的路由。在这些情况下，`..`与命令行`cd`功能完全一样；每个`..`删除父路径的一段。

>   **笔记：**
>
>   带有 `..` 的 `<Link to>` 的行为与正常的 `<a href>` 不同，当
当前 URL 以 `/` 结尾时 `<Link to>` 会忽略尾部斜杠，并删除
每个 `..` 对应的一个 URL 段。 但是 `<a href>` 值处理 `..`，
当前 URL 以`/` 结尾与不以`/` 结尾的情况是不同的。

### `<Link>` (React Native)

>   **笔记：**
>
>   这是 React Native 版本的`<Link>`. 对于web版本， [请转到此处](#link)。

**类型声明**

```tsx
declare function Link(props: LinkProps): React.ReactElement;

interface LinkProps extends TouchableHighlightProps {
  children?: React.ReactNode;
  onPress?(event: GestureResponderEvent): void;
  replace?: boolean;
  state?: State;
  to: To;
}
```

`<Link>`是一个许用户通过点击它来导航到另一个视图的组件，类似于`<a>`标签在 Web 应用中的工作方式。在 中`react-router-native`， `<Link>`渲染一个`TouchableHighlight`。要覆盖默认样式和行为，请参阅[参考`TouchableHighlight`的Props属性](https://reactnative.dev/docs/touchablehighlight#props)。

```tsx
import * as React from "react";
import { View, Text } from "react-native";
import { Link } from "react-router-native";

function Home() {
  return (
    <View>
      <Text>Welcome!</Text>
      <Link to="/profile">Visit your profile</Link>
    </View>
  );
}
```

### `<NavLink>`

**类型声明**

```tsx
declare function NavLink(
  props: NavLinkProps
): React.ReactElement;

interface NavLinkProps
  extends Omit<LinkProps, "className" | "style"> {
  caseSensitive?: boolean;
  className?:
    | string
    | ((props: { isActive: boolean }) => string);
  end?: boolean;
  style?:
    | React.CSSProperties
    | ((props: {
        isActive: boolean;
      }) => React.CSSProperties);
}
```

`<NavLink>` 是一种特殊的 [`<Link>`](#link)，它知道自己是否是"active"状态。 这在构建导航菜单（例如面包屑或一组选项卡）时非常有用，你可以在其中显示当前选择了哪些选项卡。 它还为屏幕阅读器等辅助技术提供了有用的上下文。

默认情况下，当它处于激活状态时，一个 `active` 类被添加到一个 `<NavLink>` 组件中。 这为大多数从 v5 升级的用户提供了相同的简单样式机制。 与 `v6.0.0-beta.3` 的一个区别是 `activeClassName` 和 `activeStyle` 已从 `NavLinkProps` 中删除。 相反，你可以将函数传递给`style` 或`className`，这将允许你根据组件的激活状态自定义内联样式或类字符串。

```tsx
import * as React from "react";
import { NavLink } from "react-router-dom";

function NavList() {
  // This styling will be applied to a <NavLink> when the
  // route that it links to is currently selected.
  let activeStyle = {
    textDecoration: "underline"
  };

  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="messages"
            style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
          >
            Messages
          </NavLink>
        </li>
        <li>
          <NavLink
            to="tasks"
            style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
          >
            Tasks
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
```

如果你更喜欢 v5 API，你可以创建自己`<NavLink />`的包装组件：

```tsx
import * as React from "react";
import { NavLink as BaseNavLink } from "react-router-dom";

const NavLink = React.forwardRef(
  ({ activeClassName, activeStyle, ...props }, ref) => {
    return (
      <BaseNavLink
        ref={ref}
        {...props}
        className={({ isActive }) =>
          [
            props.className,
            isActive ? activeClassName : null
          ]
            .filter(Boolean)
            .join(" ")
        }
        style={({ isActive }) => ({
          ...props.style,
          ...(isActive ? activeStyle : null)
        })}
      />
    );
  }
);
```

如果使用了`end`prop，它会确保当它的后代路径匹配时，这个组件不会被匹配为"激活"。例如，要显示仅在网站根目录而非任何其他 URL 中都处于激活状态的链接，你可以使用：

```tsx
<NavLink to="/" end>
  Home
</NavLink>
```

### `<Navigate>`

**类型声明**

```tsx
declare function Navigate(props: NavigateProps): null;

interface NavigateProps {
  to: To;
  replace?: boolean;
  state?: State;
}
```

当前位置改变时将渲染`<Navigate>`组件。它是[`useNavigate`](#usenavigate)这个Hooks的组件包装器，并接受的 props 与这个Hooks的参数相同。

>   **笔记：**
>
>   拥有基于组件的`useNavigate` hooks版本可以更轻松地在无法使用hooks的[`React.Component`](https://reactjs.org/docs/react-component.html) 子类中使用此功能。

```tsx
import * as React from "react";
import { Navigate } from "react-router-dom";

class LoginForm extends React.Component {
  state = { user: null, error: null };

  async handleSubmit(event) {
    event.preventDefault();
    try {
      let user = await login(event.target);
      this.setState({ user });
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    let { user, error } = this.state;
    return (
      <div>
        {error && <p>{error.message}</p>}
        {user && (
          <Navigate to="/dashboard" replace={true} />
        )}
        <form onSubmit={event => this.handleSubmit(event)}>
          <input type="text" name="username" />
          <input type="password" name="password" />
        </form>
      </div>
    );
  }
}
```

### `<Outlet>`

**类型声明**

```tsx
declare function Outlet(): React.ReactElement | null;
```

`<Outlet>`组件用于在父路由节点中渲染子路节点。这允许在渲染子路由时显示嵌套的 UI。如果父路由完全匹配，它将渲染子索引路由，如果没有索引路由，则不渲染任何内容。

```tsx
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* This element will render either <DashboardMessages> when the URL is
          "/messages", <DashboardTasks> at "/tasks", or null if it is "/"
      */}
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route
          path="messages"
          element={<DashboardMessages />}
        />
        <Route path="tasks" element={<DashboardTasks />} />
      </Route>
    </Routes>
  );
}
```

### `<Router>`

**类型声明**

```tsx
declare function Router(
  props: RouterProps
): React.ReactElement | null;

interface RouterProps {
  basename?: string;
  children?: React.ReactNode;
  location: Partial<Location> | string;
  navigationType?: NavigationType;
  navigator: Navigator;
  static?: boolean;
}
```

`<Router>` 是所有路由器组件共享的底层接口 ([`<BrowserRouter>`](#browserrouter), [`<HashRouter>`](#hashrouter), [`<StaticRouter>`](#staticrouter)、[`<NativeRouter>`](#nativerouter) 和 [`<MemoryRouter>`](#memoryrouter))。 在 React 中，`<Router>` 是一个 [context provider](https://reactjs.org/docs/context.html#contextprovider)，它为应用程序的其余部分提供路由信息。

你可能永远不需要手动渲染 `<Router>`。 相反，你应该根据你的环境使用更高级别的路由器之一。 在给定的应用中，你只需要一个路由器。

`<Router basename>` 属性可用于在你的应用中创建所有路由共享的 基础URL。 这在使用 React Router 仅渲染较大应用的一部分或当你的应用程序具有多个入口点时非常有用。 基本名称不区分大小写。

**类型声明**

```tsx
declare function Routes(
  props: RoutesProps
): React.ReactElement | null;

interface RoutesProps {
  children?: React.ReactNode;
  location?: Partial<Location> | string;
}

declare function Route(
  props: RouteProps
): React.ReactElement | null;

interface RouteProps {
  caseSensitive?: boolean;
  children?: React.ReactNode;
  element?: React.ReactElement | null;
  index?: boolean;
  path?: string;
}
```

`<Routes>` 和 `<Route>` 是基于当前 [`location`](#location) 在 React Router 中渲染某些东西的主要方式。 你可以把 `<Route>` 想象成一个 `if` 语句； 如果它的 `path` 匹配当前 URL，它会渲染它的 `element`！ `<Route caseSensitive>` 属性确定是否应该以区分大小写的方式进行匹配（默认为 `false`）。

每当位置发生变化时，`<Routes>` 都会查看其所有的 `children` `<Route>` 组件以找到最佳匹配并渲染 UI 的该分支。 `<Route>` 组件可以嵌套以指向嵌套的 UI，也对应于嵌套的 URL 路径。 父路由通过渲染 [`<Outlet>`](#outlet) 来渲染它们的子路由。

```tsx
<Routes>
  <Route path="/" element={<Dashboard />}>
    <Route
      path="messages"
      element={<DashboardMessages />}
    />
    <Route path="tasks" element={<DashboardTasks />} />
  </Route>
  <Route path="about" element={<AboutPage />} />
</Routes>
```

>   **笔记：**
>
>   如果你想把路由作为常规的JavaScript对象来定义，而不是使用JSX，请尝试[`useRoute`](#useroutes)来代替。

默认的 `<Route element>` 是一个 [`<Outlet>`](#outlet)。 这意味着即使没有明确的 `element` 属性，路由仍然会渲染其子元素，因此你可以嵌套路由路径，而无需在子路由元素周围嵌套 UI。

例如，在以下配置中，父路由默认渲染一个 `<Outlet>`，因此子路由将在周围没有任何 UI 的情况下渲染。 但是子路由的路径是`/users/:id`，因为它仍然建立在它的父路由上。

```tsx
<Route path="users">
  <Route path=":id" element={<UserProfile />} />
</Route>
```

### `<StaticRouter>`

**类型声明**

```tsx
declare function StaticRouter(
  props: StaticRouterProps
): React.ReactElement;

interface StaticRouterProps {
  basename?: string;
  children?: React.ReactNode;
  location?: Path | LocationPieces;
}
```

`<StaticRouter>`用于在[node ](https://nodejs.org/)中渲染 React Router Web 应用。通过`location`的prop提供当前位置。

-   `<StaticRouter location>` 默认为 `"/"`

```tsx
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import http from "http";

function requestHandler(req, res) {
  let html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url}>
      {/* The rest of your app goes here */}
    </StaticRouter>
  );

  res.write(html);
  res.end();
}

http.createServer(requestHandler).listen(3000);
```

### `createRoutesFromArray`

**类型声明**

```tsx
declare function createRoutesFromArray(
  array: PartialRouteObject[]
): RouteObject[];

interface PartialRouteObject {
  path?: string;
  caseSensitive?: boolean;
  element?: React.ReactNode;
  children?: PartialRouteObject[];
}

interface RouteObject {
  caseSensitive: boolean;
  children?: RouteObject[];
  element: React.ReactNode;
  path: string;
}
```

`createRoutesFromArray`是一个帮助器，用于填充路由对象数组中（可能）缺失的部分。它在[`useRoutes`](#useroutes)内部用于创建路由对象。

### `createRoutesFromChildren`

**类型声明**

```tsx
declare function createRoutesFromChildren(
  children: React.ReactNode
): RouteObject[];

interface RouteObject {
  caseSensitive?: boolean;
  children?: RouteObject[];
  element?: React.ReactNode;
  index?: boolean;
  path?: string;
}
```

`createRoutesFromChildren` 是一个从 `<Route>` 组件创建路由对象的助手。 它在 [`<Routes>` ](#routes-and-route) 组件内部使用用于从其 [`<Route>`](#routes-and-route) 子路由生成路由配置。

### `generatePath`

**类型声明**

```tsx
declare function generatePath(
  path: string,
  params?: Params
): string;
```

`generatePath` 将一组参数插入到带有 `:id` 和 `*` 占位符的路由路径字符串中。 当你想要从路由路径中消除占位符以使其静态匹配而不是使用动态参数时，这会很有用。

```tsx
generatePath("/users/:id", { id: 42 }); // "/users/42"
generatePath("/files/:type/*", {
  type: "img",
  "*": "cat.jpg"
}); // "/files/images/cat.jpg"
```

### `Location`

> **注意：**
>
> `history` 包是 React Router 的唯一依赖项，并且许多
> React Router 中的核心类型直接来自该库，包括
> `Location`、`To`、`Path`、`State` 等。 你可以阅读更多关于
> [其文档](https://github.com/remix-run/history/tree/main/docs) 中的历史库。

### `matchRoutes`

**类型声明**

```tsx
declare function matchRoutes(
  routes: RouteObject[],
  location: Partial<Location> | string,
  basename?: string
): RouteMatch[] | null;

interface RouteMatch<ParamKey extends string = string> {
  params: Params<ParamKey>;
  pathname: string;
  route: RouteObject;
}
```

`matchRoutes` 针对给定的 [`location`](#location) 运行一组路由的路由匹配算法，以查看哪些路由（如果有）匹配。 如果找到匹配项，则返回一组 `RouteMatch` 对象，每个匹配的路由都有一个对象。

这是 React Router 匹配算法的核心。 [`useRoutes`](#useroutes) 和 [`<Routes>` 组件](#routes-and-route) 在内部使用它来确定哪些路由与当前位置匹配。 在你想要手动匹配一组路由的某些情况下，它也很有用。

### `renderMatches`

**类型声明**

```tsx
declare function renderMatches(
  matches: RouteMatch[] | null
): React.ReactElement | null;
```

`renderMatches` 将 `matchRoutes()` 的结果渲染到一个 React 节点中。

### `matchPath`

**类型声明**

```tsx
declare function matchPath<
  ParamKey extends string = string
>(
  pattern: PathPattern | string,
  pathname: string
): PathMatch<ParamKey> | null;

interface PathMatch<ParamKey extends string = string> {
  params: Params<ParamKey>;
  pathname: string;
  pattern: PathPattern;
}

interface PathPattern {
  path: string;
  caseSensitive?: boolean;
  end?: boolean;
}
```

`matchPath` 将路由路径模式与 URL 路径名进行匹配，并返回有关的匹配信息。 当你需要手动运行路由器的匹配算法以确定路由路径是否匹配时，这非常有用。 如果pattern与给定的路径名不匹配，则返回 `null`。

[`useMatch` ](#usematch) hook在内部使用这个函数来匹配相对于当前位置的路由路径。

### `resolvePath`

**类型声明**

```tsx
declare function resolvePath(
  to: To,
  fromPathname?: string
): Path;

type To = Partial<Location> | string;

interface Path {
  pathname: string;
  search: string;
  hash: string;

```

`resolvePath` 将给定的 `To` 值解析为具有绝对 `pathname` 的实际 `Path` 对象。 当你需要知道相对"To"值的确切路径时，这很有用。 例如，`<Link>` 组件使用这个函数来获取它指向的实际 URL。

[`useResolvedPath` hook](#useresolvedpath) 在内部使用 `resolvePath` 来解析路径名。 如果 `to` 包含路径名，则根据当前路由路径名进行解析。 否则，它会根据当前 URL (`location.pathname`) 进行解析。

### `useHref`

**类型声明**

```tsx
declare function useHref(to: To): string;
```

`useHref` hook返回一个 URL，可用于链接到给定的 `to` 位置，甚至可以是 React Router 之外的链接。

> **提示：**
>
> 你可能有兴趣查看`react-router-dom` 中 `<Link>` 组件的来源
> 看看它如何在内部使用 `useHref`确定它自己的 `href` 值。

`useLinkClickHandler`

**类型声明**

```tsx
declare function useLinkClickHandler<
  E extends Element = HTMLAnchorElement,
  S extends State = State
>(
  to: To,
  options?: {
    target?: React.HTMLAttributeAnchorTarget;
    replace?: boolean;
    state?: S;
  }
): (event: React.MouseEvent<E, MouseEvent>) => void;
```

`useLinkClickHandler` hook返回一个点击事件处理程序，用于在 `react-router-dom` 中构建自定义 `<Link>` 时进行导航。

```tsx
import {
  useHref,
  useLinkClickHandler
} from "react-router-dom";

const StyledLink = styled("a", { color: "fuchsia" });

const Link = React.forwardRef(
  (
    {
      onClick,
      replace = false,
      state,
      target,
      to,
      ...rest
    },
    ref
  ) => {
    let href = useHref(to);
    let handleClick = useLinkClickHandler(to, {
      replace,
      state,
      target
    });

    return (
      <StyledLink
        {...rest}
        href={href}
        onClick={event => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            handleClick(event);
          }
        }}
        ref={ref}
        target={target}
      />
    );
  }
);
```

### `useLinkPressHandler`

**类型声明**

```tsx
declare function useLinkPressHandler<
  S extends State = State
>(
  to: To,
  options?: {
    replace?: boolean;
    state?: S;
  }
): (event: GestureResponderEvent) => void;
```

`react-router-native` 对应于 `useLinkClickHandler`，`useLinkPressHandler` 返回用于自定义 `<Link>` 导航的输入事件处理器。

```tsx
import { TouchableHighlight } from "react-native";
import { useLinkPressHandler } from "react-router-native";

function Link({
  onPress,
  replace = false,
  state,
  to,
  ...rest
}) {
  let handlePress = useLinkPressHandler(to, {
    replace,
    state
  });

  return (
    <TouchableHighlight
      {...rest}
      onPress={event => {
        onPress?.(event);
        if (!event.defaultPrevented) {
          handlePress(event);
        }
      }}
    />
  );
}
```

### `useInRouterContext`

**类型声明**

```tsx
declare function useInRouterContext(): boolean;
```

如果组件在 `<Router>` 的上下文中渲染，`useInRouterContext` hook将返回 `true`，否则返回 `false`。 这对于一些需要知道它们是否在 React Router 应用的上下文中渲染的 3rd 方扩展很有用。

### `useLocation`

**类型声明**

```tsx
declare function useLocation(): Location;

interface Location<S extends State = object | null>
  extends Path {
  state: S;
  key: Key;
}
```

这个hook返回当前的 [`location`](#location) 对象。 如果你想在当前位置更改时执行一些副作用，这会很有用。

```tsx
import * as React from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  let location = useLocation();

  React.useEffect(() => {
    ga('send', 'pageview');
  }, [location]);

  return (
    // ...
  );
}
```

### `useNavigationType`

**类型声明**

```tsx
declare function useNavigationType(): NavigationType;

type NavigationType = "POP" | "PUSH" | "REPLACE";
```

这个hook返回当前的导航类型或者用户是如何来到当前页面的； 对历史堆栈进行弹出、推送或替换操作。

### `useMatch`

**类型声明**

```tsx
declare function useMatch<ParamKey extends string = string>(
  pattern: PathPattern | string
): PathMatch<ParamKey> | null;
```

返回关于在给定路径上相对于当前位置的路由的匹配数据。

有关更多信息，请参阅 [`matchPath`](#matchpath)。

### `useNavigate`

**类型声明**

```tsx
declare function useNavigate(): NavigateFunction;

interface NavigateFunction {
  (
    to: To,
    options?: { replace?: boolean; state?: State }
  ): void;
  (delta: number): void;
}
```

`useNavigate` hook返回一个函数，让你以编程方式导航，例如在提交表单之后。

```tsx
import { useNavigate } from "react-router-dom";

function SignupForm() {
  let navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    await submitForm(event.target);
    navigate("../success", { replace: true });
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

`navigate` 函数有两个签名：

- 传递一个`To` 值（与`<Link to>` 类型相同）和可选的第二个`{ replace, state }` 参数
- 传递你想要进入历史堆栈的增量。 例如，`navigate(-1)` 相当于点击后退按钮。

### `useOutlet`

**类型声明**

```tsx
declare function useOutlet(): React.ReactElement | null;
```

返回当前级别路由层次结构的子路由元素。 [`<Outlet>`](#outlet) 在内部使用这个钩子来渲染子路由。

### `useParams`

**类型声明**

```tsx
declare function useParams<
  K extends string = string
>(): Readonly<Params<K>>;
```

`useParams` hook从与 `<Route path>` 匹配的当前 URL 返回动态参数的键/值对对象。 子路由继承其父路由的所有参数。

```tsx
import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

function ProfilePage() {
  // Get the userId param from the URL.
  let { userId } = useParams();
  // ...
}

function App() {
  return (
    <Routes>
      <Route path="users">
        <Route path=":userId" element={<ProfilePage />} />
        <Route path="me" element={...} />
      </Route>
    </Routes>
  );
}
```

### `useResolvedPath`

**类型声明**

```tsx
declare function useResolvedPath(to: To): Path;
```

这个hook根据当前位置的路径名解析给定`to`值中位置的`pathname`。

这在从相对值构建链接时很有用。 例如，查看 [`<NavLink>`](#navlink) 的源代码，它在内部调用 `useResolvedPath` 来解析所链接页面的完整路径名。

有关更多信息，请参阅 [`resolvePath`](#resolvepath)。

### `useRoutes`

**类型声明**

```tsx
declare function useRoutes(
  routes: RouteObject[],
  location?: Partial<Location> | string;
): React.ReactElement | null;
```

`useRoutes` 钩子在功能上等同于 [`<Routes>`](#routes)，但它使用 JavaScript 对象而不是 `<Route>` 元素来定义你的路由。 这些对象与普通 [`<Route>` 组件](#routes-and-route) 具有相同的属性，但它们不需要 JSX。

`useRoutes` 的返回值要么是一个有效的 React 组件，你可以用来渲染路由树，要么是 `null` (假如没有匹配的话）。

```tsx
import * as React from "react";
import { useRoutes } from "react-router-dom";

function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
      children: [
        {
          path: "messages",
          element: <DashboardMessages />
        },
        { path: "tasks", element: <DashboardTasks /> }
      ]
    },
    { path: "team", element: <AboutPage /> }
  ]);

  return element;
}
```

另见[`createRoutesFromArray`](#createroutesfromarray)。

### `useSearchParams`

>   **笔记：**
>
>   这是`useSearchParams` 的web版本。 对于 React Native 版本，
>   [查看这里](#usesearchparams-react-native)。

**类型声明**

```tsx
declare function useSearchParams(
  defaultInit?: URLSearchParamsInit
): [URLSearchParams, URLSearchParamsSetter];

type ParamKeyValuePair = [string, string];

type URLSearchParamsInit =
  | string
  | ParamKeyValuePair[]
  | Record<string, string | string[]>
  | URLSearchParams;

interface URLSearchParamsSetter {
  (
    nextInit: URLSearchParamsInit,
    navigateOptions?: { replace?: boolean; state?: State }
  ): void;
}
```

`useSearchParams` hook用于读取和修改当前位置的 URL 中的query字符串。 就像 React 自己的 [`useState` hook](https://reactjs.org/docs/hooks-reference.html#usestate)，`useSearchParams` 返回一个包含两个值的数组：当前位置的 [search params](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams) 和可用于更新它们的函数。

```tsx
import * as React from "react";
import { useSearchParams } from "react-router-dom";

function App() {
  let [searchParams, setSearchParams] = useSearchParams();

  function handleSubmit(event) {
    event.preventDefault();
    // The serialize function here would be responsible for
    // creating an object of { key: value } pairs from the
    // fields in the form that make up the query.
    let params = serializeFormQuery(event.target);
    setSearchParams(params);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>{/* ... */}</form>
    </div>
  );
}
```

>   **笔记：**
>
>   `setSearchParams` 函数的工作方式类似于 [`navigate`](#usenavigate)，但是
>   仅用于 [搜索部分](https://developer.mozilla.org/en-US/docs/Web/API/Location/search)
>   的网址。 另请注意，`setSearchParams` 的第二个参数是
>   与`navigate`的第二个参数相同的类型。

### `useSearchParams` (React Native)

>   **笔记：**
>
>   这是 `useSearchParams` 的 React Native 版本。 对于web版本，
>   [查看这里](#usesearchparams)。

**类型声明**

```tsx
declare function useSearchParams(
  defaultInit?: URLSearchParamsInit
): [URLSearchParams, URLSearchParamsSetter];

type ParamKeyValuePair = [string, string];

type URLSearchParamsInit =
  | string
  | ParamKeyValuePair[]
  | Record<string, string | string[]>
  | URLSearchParams;

interface URLSearchParamsSetter {
  (
    nextInit: URLSearchParamsInit,
    navigateOptions?: { replace?: boolean; state?: State }
  ): void;
}
```

`useSearchParams` hook用于读取和修改当前位置的 URL 中的查询字符串。 就像 React 自己的 [`useState` hook](https://reactjs.org/docs/hooks-reference.html#usestate)，`useSearchParams` 返回一个包含两个值的数组：当前位置的 [search params](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams)  和可用于更新它们的函数。

```tsx
import * as React from "react";
import { View, SearchForm, TextInput } from "react-native";
import { useSearchParams } from "react-router-native";

function App() {
  let [searchParams, setSearchParams] = useSearchParams();
  let [query, setQuery] = React.useState(
    searchParams.get("query")
  );

  function handleSubmit() {
    setSearchParams({ query });
  }

  return (
    <View>
      <SearchForm onSubmit={handleSubmit}>
        <TextInput value={query} onChangeText={setQuery} />
      </SearchForm>
    </View>
  );
}
```

### `createSearchParams`

**类型声明**

```tsx
declare function createSearchParams(
  init?: URLSearchParamsInit
): URLSearchParams;
```

`createSearchParams` 是围绕 [`new URLSearchParams(init)`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams) 的一个简洁包装器，它增加了对使用带有数组值的对象的支持。 这与 `useSearchParams` 在内部用于从 `URLSearchParamsInit` 值创建 `URLSearchParams` 对象的函数相同。
