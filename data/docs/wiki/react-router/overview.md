---
sidebar_position: 1
---
# 概述

如果你熟悉 JavaScript 生态系统、React 和 React Router，这可以作为 React Router v6 的快速概览，其中包含大量代码和最少的解释。

-   有关 React Router 的完整介绍，请参阅[教程](./tutorial)
-   有关每个 API 的大量文档，请参阅[API 参考](./api)
-   要更深入地了解概念，请参阅[主要概念](https://reactrouter.com/docs/en/v6/getting-started/concepts)

## 安装

```shell
npm install react-router-dom@6
```

## 配置路由

```jsx
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
// import your route components too

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
```

在以前版本的 React Router 中，当多个路由匹配一个不明确的 URL 时，你必须以某种方式对你的路由进行排序才能得到正确的渲染。V6 更聪明，会选择最具体的匹配，所以你不必再担心了。例如，URL`/teams/new`匹配这两个路由：

```jsx
<Route path="teams/:teamId" element={<Team />} />
<Route path="teams/new" element={<NewTeamForm />} />
```

但是`teams/new`相对`/teams/:teamId`是一个更具体的匹配，因此`<NewTeamForm />`将被渲染。

## 导航

使用`Link`让用户更改URL或者`useNavigate`自己做（如表格提交后）：

```tsx
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="about">About</Link>
      </nav>
    </div>
  );
}
```

```tsx
import { useNavigate } from "react-router-dom";

function Invoices() {
  let navigate = useNavigate();
  return (
    <div>
      <NewInvoiceForm
        onSubmit={async event => {
          let newInvoice = await createInvoice(
            event.target
          );
          navigate(`/invoices/${newInvoice.id}`);
        }}
      />
    </div>
  );
}
```

## 读取URL参数

在路由路径中使用`:style`语法并`useParams()`阅读它们：

```tsx
import { Routes, Route, useParams } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="invoices/:invoiceId"
        element={<Invoice />}
      />
    </Routes>
  );
}

function Invoice() {
  let params = useParams();
  return <h1>Invoice {params.invoiceId}</h1>;
}
```

注意，路径中的`:invoiceId`和参数的键`params.invoiceId`匹配。

一个非常常见的用例是在组件呈现时获取数据：

```tsx
function Invoice() {
  let { invoiceId } = useParams();
  let invoice = useFakeFetch(`/api/invoices/${invoiceId}`);
  return invoice ? (
    <div>
      <h1>{invoice.customerName}</h1>
    </div>
  ) : (
    <Loading />
  );
}
```

## 嵌套路由

这是 React Router 最强大的功能之一，基于它你不需要自己处理复杂的布局代码。绝大多数布局都与 URL 的片段耦合，而 React Router 完全实现了这一点。

路由可以相互嵌套，它们的路径也会嵌套（子路由继承父路由）。

```tsx
function App() {
  return (
    <Routes>
      <Route path="invoices" element={<Invoices />}>
        <Route path=":invoiceId" element={<Invoice />} />
        <Route path="sent" element={<SentInvoices />} />
      </Route>
    </Routes>
  );
}
```

此路由配置定义了三个路由路径：

- `"/invoices"`
- `"/invoices/sent"`
- `"/invoices/:invoiceId"`

当 URL 是`"/invoices/sent"`时组件树如下：

```tsx
<App>
  <Invoices>
    <SentInvoices />
  </Invoices>
</App>
```

当 URL 为 时`"/invoices/123"`，组件树将如下：

```tsx
<App>
  <Invoices>
    <Invoice />
  </Invoices>
</App>
```

注意，内部组件 (`<SentInvoices>`和`<Invoice>`)随 URL改变。确保子路由使用 [`<Outlet>`](./api.md#outlet)来渲染,这样父路由 ( `<Invoices>`) 才会响应. 这是完整的示例：

```tsx
import { Routes, Route, Outlet } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="invoices" element={<Invoices />}>
        <Route path=":invoiceId" element={<Invoice />} />
        <Route path="sent" element={<SentInvoices />} />
      </Route>
    </Routes>
  );
}

function Invoices() {
  return (
    <div>
      <h1>Invoices</h1>
      <Outlet />
    </div>
  );
}

function Invoice() {
  let { invoiceId } = useParams();
  return <h1>Invoice {invoiceId}</h1>;
}

function SentInvoices() {
  return <h1>Sent Invoices</h1>;
}
```

嵌套的 url 段映射到嵌套的组件树。这非常适合创建在布局中具有持久导航且内部部分随 URL 变化的 UI。如果你浏览一些网站，你会注意到许多网站（尤其是web apps）具有多层布局嵌套。

这是带有导航的根布局的另一个示例，当内页与 URL 交换时，它仍然存在：

```tsx
import {
  Routes,
  Route,
  Link,
  Outlet
} from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="invoices" element={<Invoices />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <h1>Welcome to the app!</h1>
      <nav>
        <Link to="invoices">Invoices</Link> |{" "}
        <Link to="dashboard">Dashboard</Link>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

function Invoices() {
  return <h1>Invoices</h1>;
}

function Dashboard() {
  return <h1>Dashboard</h1>;
}
```

## 索引路由

索引路由可以被认为是"默认子路由"。当父路由有多个子路由，但 URL 仅在父路由的路径上时，你可能希望将某些内容渲染到插槽中。

思考这个例子：

```tsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="invoices" element={<Invoices />} />
        <Route path="activity" element={<Activity />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <GlobalNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

这个页面在"/invoices"和"/activity"上看起来很棒，但在URL为"/"它只是一个空白页面，因为`<main>`中没有子路由渲染。为此，我们可以添加一个索引路由：

```tsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Activity />}>
        <Route path="invoices" element={<Invoices />} />
        <Route path="activity" element={<Activity />} />
      </Route>
    </Routes>
  );
}
```

现在在URL为"/"时，`<Activity>`组件将被渲染。

你可以在路由层次结构的任何级别拥有一个索引路由，当父级匹配但其他子级都不匹配时，该索引路由指定的组件将被渲染。

```tsx
function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route
          path="invoices"
          element={<DashboardInvoices />}
        />
      </Route>
    </Routes>
  );
}
```

## 相对链接

`<Link to>`值是相对于渲染它们的路径的路由（并不以 a 开头`/`的）。下面的两个链接将链接到`/dashboard/invoices`和`/dashboard/team`，因为它们在`<Dashboard>`中渲染. 当你更改父级的 URL 或重新排序你的组件时这非常棒，因为你的所有链接都会自动更新。

```tsx
import {
  Routes,
  Route,
  Link,
  Outlet
} from "react-router-dom";

function Home() {
  return <h1>Home</h1>;
}

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="invoices">Invoices</Link>{" "}
        <Link to="team">Team</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

function Invoices() {
  return <h1>Invoices</h1>;
}

function Team() {
  return <h1>Team</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Dashboard />}>
        <Route path="invoices" element={<Invoices />} />
        <Route path="team" element={<Team />} />
      </Route>
    </Routes>
  );
}
```

## "Not Found" 路由

当没有其他路由与 URL 匹配时，你可以使用`path="*"`. 此路由将匹配任何 URL，但具有最弱的优先级，因此路由器仅在没有其他路由匹配时才会选择它。

```tsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

## 更多的路由设置

尽管你应该在应用中只拥有一个`<Router>`，但你可以在任何需要的地方拥有任意数量的[`Routes`](./api#routes)。每个`<Routes>`元素独立于其他元素运行，并选择一个子路由进行渲染。

```tsx
function App() {
  return (
    <div>
      <Sidebar>
        <Routes>
          <Route path="/" element={<MainNav />} />
          <Route
            path="dashboard"
            element={<DashboardNav />}
          />
        </Routes>
      </Sidebar>

      <MainContent>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="about" element={<About />} />
            <Route path="support" element={<Support />} />
          </Route>
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="invoices" element={<Invoices />} />
            <Route path="team" element={<Team />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContent>
    </div>
  );
}
```

## 后代`<Routes>`

你可以在任何需要的地方渲染`<Routes>`组件，包括在另一个`<Routes>` 的组件树深处。它们将与任何其他`<Routes>` 一样工作，但是它们将会在渲染它们的路由的路径上自动构建。如果你这样做，请确保在父路由路径的末尾放置一个 *。否则，当 URL 长于父路由的路径时，父路由将与 URL 不匹配，并且你的后代`<Routes>`将永远不会出现。

```tsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}

function Dashboard() {
  return (
    <div>
      <p>Look, more routes!</p>
      <Routes>
        <Route path="/" element={<DashboardGraphs />} />
        <Route path="invoices" element={<InvoiceList />} />
      </Routes>
    </div>
  );
}
```

仅此而已！我们没有在这里涵盖所有 API，但这些绝对是你将使用的最常见的 API。如果你想了解更多信息，请继续阅读[我们的教程](./tutorial)或浏览[完整的 API 参考](./api)。
