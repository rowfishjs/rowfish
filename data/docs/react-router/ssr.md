---
sidebar_position: 4
---
# SSR

React Router 中最基本的服务器渲染非常简单。然而，要考虑的不仅仅是获得正确的渲染路由。以下是你需要处理的不完整事项清单：

-   为服务端和浏览器捆绑代码
-   不仅限服务端的代码捆绑到浏览器捆绑包中
-   适用于服务端和浏览器的代码拆分
-   服务器端数据加载，所以你实际上有一些东西要渲染
-   适用于客户端和服务端的数据加载策略
-   处理服务器和客户端中的代码拆分
-   正确的 HTTP 状态代码和重定向
-   环境变量和密匙
-   部署

将所有这些设置好可能会非常复杂，但对象对你在服务端渲染时才能获得的性能和 UX 特性这一切是值得的。

如果你想在SSR应用中使用的 React Router ，我们强烈建议你使用[Remix](https://remix.run/)。这是我们的另一个项目，它建立在 React Router 之上并处理上面提到的所有事情以及更多。试一试！

如果你想自己解决它，你需要在服务端上使用`<StaticRouter>`。

首先，你需要在服务端和浏览器中渲染某种"应用"或"根"组件：

```js
export default function App() {
  return (
    <html>
      <head>
        <title>Server Rendered App</title>
      </head>
      <body>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/about" element={<div>About</div>} />
        </Routes>
        <script src="/build/client.entry.js" />
      </body>
    </html>
  );
}
```

这是一个简单的快速服务端，它在服务器上渲染应用。注意使用`StaticRouter`.

```js
import express from "express";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

let app = express();

app.get("*", (req, res) => {
  let html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>
  );
  res.send("<!DOCTYPE html>" + html);
});

app.listen(3000);
```

最后，你需要一个类似的文件来使用包含相同`App`组件的JavaScript 包来"混合"应用。注意使用`BrowserRouter`代替`StaticRouter`。

```js
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.documentElement
);
```

与客户端entry的唯一真正区别是：

-   `StaticRouter` 代替 `BrowserRouter`
-   将 URL 从服务器传递到 `<StaticRouter url>`
-   使用`ReactDOMServer.renderToString`代替`ReactDOM.render`.

你需要自己做一些部分才能使其工作：

-   如何打包代码以在浏览器和服务端中工作
-   如何知道客户端entry`<script>`在`<App>`组件中的位置。
-   弄清楚数据加载（特别是对于`<title>`）。

同样，我们建议你看看[Remix](https://remix.run/)。这是服务端渲染 React Router 应用的最佳方式——也许也是构建任何 React 应用程序的最佳方式😉。
