---
sidebar_position: 3
---
# 教程

## 介绍

[在此处查看应用程序的完整版本](https://stackblitz.com/edit/github-agqlf5?file=src/App.jsx)。

React Router 是一个功能齐全的客户端和服务器端 React路由库，一个用于构建用户界面的 JavaScript 库。React Router 在 React 运行的任何地方运行；在web上，在带有 node.js 的服务器上，以及在 React Native 上。

如果你刚刚开始使用 React，我们建议你遵循官方文档中[优秀的入门指南](https://reactjs.org/docs/getting-started.html)。那里有大量信息可以帮助你启动和运行。React Router 与 React >= 16.8 兼容。

我们将保持本教程的快速和专注点。到最后你会知道你如何日常使用 React Router 处理的 API。之后，你可以深入研究其他一些文档以获得更深入的理解。

在构建一个小记账应用时，我们将介绍：

-   配置路由
-   使用链接导航
-   创建具有激活样式的链接
-   使用嵌套路由进行布局
-   以编程方式导航
-   使用 URL 参数加载数据
-   使用 URL  Query参数
-   通过组合创建自己的行为
-   服务端渲染(译者: 官方文档还没有,更新后我会同步)

## 安装

### 推荐: StackBlitz

要完成本教程，你需要一个可用的 React 应用。我们建议跳过[打包](https://stackblitz.com/github/remix-run/react-router/tree/main/tutorial?file=src/App.jsx)程序并通过在[StackBlitz的演示](https://stackblitz.com/github/remix-run/react-router/tree/main/tutorial?file=src/App.jsx)上在浏览器中进行编码：

[![Open in StackBlitz](https://developer.stackblitz.com/images/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router/tree/main/tutorial?file=src/App.jsx)

当你编辑文件时，本教程将实时更新。

### 使用打包工具

随意使用你选择的打包器，例如[Create React App](https://create-react-app.dev/)或[Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)。

```shell
# create react app
npx create-react-app router-tutorial

# vite
npm init vite@latest router-tutorial --template react
```

然后安装 React Router 依赖包：

```shell
cd router-tutorial
npm add react-router-dom@6 history@5
```

然后在你的 App.js 中写入"Bookkeeper(无聊)!"的文字：

```tsx
export default function App() {
  return (
    <div>
      <h1>Bookkeeper!</h1>
    </div>
  );
}
```

其实那个"！" 看起来一点都不无聊。这非常令人兴奋。我们在 React Router v6 beta 上开发了一年多，因为我们在全球大流行之后调整了我们的业务。这是我们最近做过的最令人兴奋的事情！

最后，确保`index.js`或`main.jsx`（取决于你使用的打包器）实际可用：

```tsx
import { render } from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root");
render(<App />, rootElement);
```

最后启动你的应用：

```shell
# probably this
npm start

# or this
npm run dev
```
## 连接到URL

首先，我们希望将你的应用连接到浏览器的 URL：导入`BrowserRouter`并围绕你的整个应用渲染它。

```tsx
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);
```

你的应用中没有任何变化，但现在我们已准备好开始处理 URL。

## 添加一些链接

打开`src/App.js`、导入`Link`并添加一些全局导航。旁注：在本教程中不要太认真对待样式，我们只是为了方便而使用内联样式，你可以根据需要设置应用的样式。

```tsx
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>Bookkeeper</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <Link to="/invoices">Invoices</Link> |{" "}
        <Link to="/expenses">Expenses</Link>
      </nav>
    </div>
  );
}
```

继续并单击链接和后退/前进按钮（如果你使用的是 StackBlitz，则需要单击内嵌浏览器工具栏中的"在新窗口中打开"按钮）。现在React Router 正在控制 URL！

我们还没有在 URL 更改时渲染任何路由，但 Link 正在更改 URL，而不会导致整个页面重新加载。

## 添加一些路由

添加几个新文件：

-   `src/routes/invoices.jsx`
-   `src/routes/expenses.jsx`

（文件的位置无关紧要，但是当你决定为此应用使用自动后端 API、服务器渲染、代码拆分打包器等时，以这种方式命名你的文件可以轻松将此应用程序移植到我们的另一个项目，[Remix](https://remix.run/) 😉）

现在用一些代码填充它们：

```tsx
export default function Expenses() {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Expenses</h2>
    </main>
  );
}
```

```tsx
export default function Invoices() {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Invoices</h2>
    </main>
  );
}
```

最后，让我们通过在`main.jsx`内创建第一个"路由配置"来学会如何使用React Router渲染我们的应用.

```tsx
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import App from "./App";
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="expenses" element={<Expenses />} />
      <Route path="invoices" element={<Invoices />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
```

注意，`"/"`将渲染`<App>`组件. `"/invoices"`则渲染`<Invoices>`。干得好！

>   请记住，如果你使用 StackBlitz 单击内嵌浏览器工具栏中的"在新窗口中打开"按钮，以便能够单击浏览器中的后退/前进按钮。

## 嵌套路由

单击链接时，你可能已经注意到布局`App`消失了。重复共享布局令人头疼。我们了解到，大多数 UI 是一系列嵌套布局，几乎总是映射到 URL 的片段，因此这个想法直接融入到了 React Router 中。

让我们通过做两件事来获得一些自动的、持久的布局处理：

1.  在 App 路由中嵌套路由
2.  渲染一个 Outlet

首先让我们嵌套路由。眼下的费用和发票的路由在应用中是平级关系，我们希望把它们变成应用的*子页面*：

```jsx
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import App from "./App";
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="expenses" element={<Expenses />} />
        <Route path="invoices" element={<Invoices />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  rootElement
);
```

当路由有子节点时，它会做两件事：

1.  它嵌套了 URL (`"/" + "expenses"`和`"/" + "invoices"`)
2.  当子路由匹配时，它将嵌套共享布局的 UI 组件：

但是，在（2）生效之前，我们需要在"父级"的`App.jsx`路由中渲染一个`Outlet`。

```jsx
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>Bookkeeper</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <Link to="/invoices">Invoices</Link> |{" "}
        <Link to="/expenses">Expenses</Link>
      </nav>
      <Outlet />
    </div>
  );
}
```

现在再次单击。父路由 ( `App.js`) 仍然存在，而两个`<Outlet>`子路由将在 (`<Invoices>`和`<Expenses>`)之间交换！

正如我们稍后将看到的，这适用于路由层次结构的*任何级别*，并且非常强大。

## 列出清单

通常你会从某个地方的服务器获取数据，但在本教程中，让我们硬编码一些假数据，这样我们就可以专注于路由。

创建一个文件`src/data.js`并将其复制/粘贴到那里：

```js
let invoices = [
  {
    name: "Santa Monica",
    number: 1995,
    amount: "$10,800",
    due: "12/05/1995"
  },
  {
    name: "Stankonia",
    number: 2000,
    amount: "$8,000",
    due: "10/31/2000"
  },
  {
    name: "Ocean Avenue",
    number: 2003,
    amount: "$9,500",
    due: "07/22/2003"
  },
  {
    name: "Tubthumper",
    number: 1997,
    amount: "$14,000",
    due: "09/01/1997"
  },
  {
    name: "Wide Open Spaces",
    number: 1998,
    amount: "$4,600",
    due: "01/27/2998"
  }
];

export function getInvoices() {
  return invoices;
}
```

现在我们可以在清单(发票)路由中使用它。让我们同时添加一些样式来获得侧边栏导航布局。随意复制/粘贴所有这些，但要特别注意`<Link>`组件的`to`参数(prop)：

```js
import { Link } from "react-router-dom";
import { getInvoices } from "../data";

export default function Invoices() {
  let invoices = getInvoices();
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem"
        }}
      >
        {invoices.map(invoice => (
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/invoices/${invoice.number}`}
            key={invoice.number}
          >
            {invoice.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

爽的！现在单击发票链接，看看会发生什么。

😨😨😨

## 添加 "无匹配" 路由

这并不像你预期的那样进行。如果你单击这些链接，页面将变为空白！那是因为我们定义的所有路由都无法匹配我们链接到的 URL：`"/invoices/123"`。

在我们继续之前，最好始终处理这种"不匹配"的情况。返回你的路由配置并添加以下内容：

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route path="expenses" element={<Expenses />} />
    <Route path="invoices" element={<Invoices />} />
    <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
  </Route>
</Routes>
```

`"*"`在这里有着特殊的意义。只有在没有其他路由匹配时才会匹配。

## 读取URL参数

好的，回到单个发票 的URL。让我们为特定的发票添加一个路由。我们刚刚访问了一些像`"/invoices/1998"`这样的 URL ，比如`"/invoices/2005"`，现在让我们创建一个新组件 `src/routes/invoice.js`来呈现这些 URL：

```js
export default function Invoice() {
  return <h2>Invoice #???</h2>;
}
```

我们想呈现发票编号而不是`"???"`。通常在 React 中，你会将其作为 prop:传递，比如`<Invoice invoiceId="123" />`，但你无法控制该信息，因为它来自 URL。

让我们定义一个路由来匹配这些类型的 URL，并使我们能够从中获取发票编号。

在"发票"路由内部创建一个新的`<Route>` ，如下所示：

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route path="expenses" element={<Expenses />} />
    <Route path="invoices" element={<Invoices />}>
      <Route path=":invoiceId" element={<Invoice />} />
    </Route>
    <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
  </Route>
</Routes>
```

需要注意的几点：

-   我们刚刚创建了一个匹配"/invoices/2005"和"/invoices/1998"等URL的路由。`:invoiceId`路径的一部分是"URL param"，这意味着只要模式相同，它就可以匹配任何值。
-   当`<Route>`匹配时它增加了路由嵌套的第二层：`<App><Invoices><Invoice /></Invoices></App>`。因为`<Route>`是嵌套的，所以 UI 也会被嵌套。

好的，现在点击一个发票链接，注意 URL 发生了变化，但新的发票组件还没有显示出来。你知道为什么吗？

这是正确的！我们需要在父布局路由中添加一个出口( outlet)（我们真的为你感到骄傲）。

```tsx
import { Link, Outlet } from "react-router-dom";
import { getInvoices } from "../data";

export default function Invoices() {
  let invoices = getInvoices();
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem"
        }}
      >
        {invoices.map(invoice => (
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/invoices/${invoice.number}`}
            key={invoice.number}
          >
            {invoice.name}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
```

好的，让我们在这里关闭圆圈。再次打开发票组件，让我们从 `:invoiceId`URL 中获取参数：

```ts
import { useParams } from "react-router-dom";

export default function Invoice() {
  let params = useParams();
  return <h2>Invoice: {params.invoiceId}</h2>;
}
```

注意`params`对象上param的key与路由路径中的动态参数名相同：

```
:invoiceId -> params.invoiceId
```

让我们使用这些信息来构建一个更有趣的发票页面。打开`src/data.js`并添加一个新功能来按编号查找发票：

```js
// ...

export function getInvoices() {
  return invoices;
}

export function getInvoice(number) {
  return invoices.find(
    invoice => invoice.number === number
  );
}
```

现在回到`invoice.js`我们使用参数来查找发票并显示更多信息：

```js
import { useParams } from "react-router-dom";
import { getInvoice } from "../data";

export default function Invoice() {
  let params = useParams();
  let invoice = getInvoice(parseInt(params.invoiceId, 10));
  return (
    <main style={{ padding: "1rem" }}>
      <h2>Total Due: {invoice.amount}</h2>
      <p>
        {invoice.name}: {invoice.number}
      </p>
      <p>Due Date: {invoice.due}</p>
    </main>
  );
}
```

请注意，我们在参数周围使用了`parseInt`。使用`number`类型来查找数据是很常见的，但 URL 参数始终是`string`.

## 索引路由

索引路由可能是 React Router 中最难理解的概念。因此，如果你以前遇到过困难，我们希望这次可以为你澄清。

现在你可能正在查看其中一张发票。单击应用程序全局导航中的"发票"链接。请注意，主要内容区域变为空白！我们可以使用"索引"路由来解决这个问题。

```jsx
<Routes>
  <Route path="/" element={<App />}>
    <Route path="expenses" element={<Expenses />} />
    <Route path="invoices" element={<Invoices />}>
      <Route
        index
        element={
          <main style={{ padding: "1rem" }}>
            <p>Select an invoice</p>
          </main>
        }
      />
      <Route path=":invoiceId" element={<Invoice />} />
    </Route>
    <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
  </Route>
</Routes>
```

非常好！现在索引路由填补了空白！

注意它有一个`index`的prop 而不是 一个 `path`。那是因为索引路由共享父路由的路径。这就是重点——它没有路径。

也许你还在挠头。我们尝试通过几种方法来回答"什么是索引路由？"这个问题。希望其中一条适合你：

-   索引路由在父路由路径的父路由Outlet组件中渲染。
-   当父路由匹配但其他子路由都不匹配时，索引路由匹配。
-   索引路由是父路由的默认子路由。
-   当用户还没有单击导航列表中的项目之一时，索引路由会渲染。

## 激活的链接

将链接显示为用户正在查看的激活链接是很常见的，尤其是在导航列表中。让我们通过把`Link`替换为`NavLink`来添加这个功能到我们的发票列表中。

```jsx
import { NavLink, Outlet } from "react-router-dom";
import { getInvoices } from "../data";

export default function Invoices() {
  let invoices = getInvoices();
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem"
        }}
      >
        {invoices.map(invoice => (
          <NavLink
            style={({ isActive }) => {
              return {
                display: "block",
                margin: "1rem 0",
                color: isActive ? "red" : ""
              };
            }}
            to={`/invoices/${invoice.number}`}
            key={invoice.number}
          >
            {invoice.name}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
```

我们在那里做了三件事：

1.  我们把`Link`换成了`NavLink`。
2.  我们的`style`从一个简单的对象变成了一个返回一个对象的函数。
3.  我们通过查找传递给`NavLink`组件的样式函数的`isActive`值来更改链接的颜色。

你也可以用`NavLink`上`className`参数做同样的事情：

```jsx
// normal string
<NavLink className="red" />

// function
<NavLink className={({ isActive }) => isActive ? "red" : "blue"} />
```

## Query参数

搜索参数类似于 URL 参数，但它们位于 URL 中的不同位置。它们不是在由 普通 URL 段中的`/`来分隔的，而是使用`?`. 你已经在许多网站上看到过它们，例如`"/login?success=1"`或`"/shoes?brand=nike&sort=asc&sortby=price"`。

React Router 使用`useSearchParams`来轻松实现，它的用法很像`React.useState()`，但它在 URL  Query参数中而不是在内存中存储和设置状态。

让我们通过在发票导航列表上添加一个小过滤器来看看它的作用。

```jsx
import {
  NavLink,
  Outlet,
  useSearchParams
} from "react-router-dom";
import { getInvoices } from "../data";

export default function Invoices() {
  let invoices = getInvoices();
  let [searchParams, setSearchParams] = useSearchParams();

  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem"
        }}
      >
        <input
          value={searchParams.get("filter") || ""}
          onChange={event => {
            let filter = event.target.value;
            if (filter) {
              setSearchParams({ filter });
            } else {
              setSearchParams({});
            }
          }}
        />
        {invoices
          .filter(invoice => {
            let filter = searchParams.get("filter");
            if (!filter) return true;
            let name = invoice.name.toLowerCase();
            return name.startsWith(filter.toLowerCase());
          })
          .map(invoice => (
            <NavLink
              style={({ isActive }) => ({
                display: "block",
                margin: "1rem 0",
                color: isActive ? "red" : ""
              })}
              to={`/invoices/${invoice.number}`}
              key={invoice.number}
            >
              {invoice.name}
            </NavLink>
          ))}
      </nav>
      <Outlet />
    </div>
  );
}
```

可以看到，就像用户输入的一样：

-   `setSearchParams()`将`?filter=...`Query的参数放在 URL 中并重新渲染路由器。
-   `useSearchParams`现在返回一个带有`"filter"`的[`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)作为其值之一。
-   我们将输入的值设置为过滤器Query参数中的任何值（就像`useState`，只是使用 URLSearchParams 来替代而已！）
-   我们根据过滤器Query参数过滤我们的发票列表。

## 自定义行为

如果你过滤列表然后单击链接，你会注意到列表不再过滤并且搜索参数从`<input>`和 URL 中清除。你可能想要这个，你可能不想要！也许你想保持过滤列表并将参数保留在 URL 中。

我们可以在点击链接时添加查询字符串并把它添加到链接的href属性。我们将通过React Router 组合`NavLink`和`useLocation`到我们自己的`QueryNavLink`（也许有一个更好的名字，但这就是我们今天要做的）来做到这一点。

```js
import { useLocation, NavLink } from "react-router-dom";

function QueryNavLink({ to, ...props }) {
  let location = useLocation();
  return <NavLink to={to + location.search} {...props} />;
}
```

你可以将该代码放在你的应用中任何你想要的位置，然后将你的`src/routes/invoices.jsx`为把`NavLink`替换为`QueryNavLink`，你就完成了。

像`useSearchParams`，`useLocation`返回一个location对象来告诉我们有关 URL 的信息。一个location看起来像这样：

```js
{
  pathame: "/invoices",
  search: "?filter=sa",
  hash: "",
  state: null,
  key: "ae4cz2j"
}
```

有了这些信息，`QueryNavLink`中的任务就很简单了：把`location.search`加到`to` prop上。你可能会想，"天哪，这应该是 React Router 的内置组件还是什么？"。好吧，让我们看另一个例子。

如果你在电子商务网站上有这样的链接怎么办？

```jsx
<Link to="/shoes?brand=nike">Nike</Link>
<Link to="/shoes?brand=vans">Vans</Link>
```

然后你想在 url 搜索参数与品牌匹配时将它们设置为"active"样式？你完全可以用你在本教程中学到的东西来快速地制作一个这样组件：

```jsx
function BrandLink({ brand, ...props }) {
  let [params] = useSearchParams();
  let isActive = params.getAll("brand").includes(brand);
  return (
    <Link
      style={{ color: isActive ? "red" : "" }}
      to={`/shoes?brand=${brand}`}
      {...props}
    />
  );
}
```

这将为`"/shoes?brand=nike"`添加active,`"/shoes?brand=nike&brand=vans"`也是一样。也许你希望它在仅选择一个品牌时处于active状态：

```js
let brands = params.getAll("brand");
let isActive =
  brands.includes(brand) && brands.length === 1;
// ...
```

或者，你可能希望链接是可*处理的*（点击 Nike，然后 Vans 将两个品牌都添加到搜索参数中）而不是替换品牌：

```jsx
function BrandLink({ brand, ...props }) {
  let [params] = useSearchParams();
  let isActive = params.getAll("brand").includes(brand);
  if (!isActive) {
    params.append("brand", brand);
  }
  return (
    <Link
      style={{ color: isActive ? "red" : "" }}
      to={`/shoes?${params.toString()}`}
      {...props}
    />
  );
}
```

或者，也许你希望它添加品牌（如果它已经不存在）并在再次单击时将其删除！

```jsx
function BrandLink({ brand, ...props }) {
  let [params] = useSearchParams();
  let isActive = params.getAll("brand").includes(brand);
  if (!isActive) {
    params.append("brand", brand);
  } else {
    params = new URLSearchParams(
      Array.from(params).filter(
        ([key, value]) => key !== "brand" || value !== brand
      )
    );
  }
  return (
    <Link
      style={{ color: isActive ? "red" : "" }}
      to={`/shoes?${params.toString()}`}
      {...props}
    />
  );
}
```

如你所见，即使在这个相当简单的示例中，你也可能需要许多有效的行为。React Router 并没有尝试解决我们直接听说过的每个用例。相反，我们为你提供组件和钩子来组合你需要的任何行为。

## 以编程的方式导航

好的，回到我们的应用。坚持住，你快完成了！

大多数情况下，URL 更改是响应用户单击链接。但有时你，一个程序员，想要更改 URL。一个非常常见的用例是在数据更新之后，例如创建或删除记录。

让我们添加一个按钮，将发票标记为已付款，然后导航到索引路径。

首先，你可以复制粘贴此功能，从我们的虚拟数据中删除发票：

```js
export function deleteInvoice(number) {
  invoices = invoices.filter(
    invoice => invoice.number !== number
  );
}
```

现在让我们添加删除按钮，调用我们的新函数，并导航到索引路由：

```js
import { useParams, useNavigate } from "react-router-dom";
import { getInvoice, deleteInvoice } from "../data";

export default function Invoice() {
  let navigate = useNavigate();
  let params = useParams();
  let invoice = getInvoice(parseInt(params.invoiceId, 10));

  return (
    <main style={{ padding: "1rem" }}>
      <h2>Total Due: {invoice.amount}</h2>
      <p>
        {invoice.name}: {invoice.number}
      </p>
      <p>Due Date: {invoice.due}</p>
      <p>
        <button
          onClick={() => {
            deleteInvoice(invoice.number);
            navigate("/invoices");
          }}
        >
          Delete
        </button>
      </p>
    </main>
  );
}
```

## 获得帮助

恭喜！你已经完成了本教程。我们希望它可以帮助你了解 React Router。

如果你遇到问题，请查看[资源](https://reactrouter.com/resources)页面以获取帮助。祝你好运！