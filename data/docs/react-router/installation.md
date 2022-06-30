---
sidebar_position: 1
---
# 安装

本文档描述了将 React Router 与 React 生态系统中的各种工具一起使用的最常见方式。

## 基本安装

大多数现代 React 项目使用像[npm](https://www.npmjs.com/)或[Yarn](https://yarnpkg.com/)这样的包管理器来管理它们的依赖项。要将 React Router 添加到现有项目中，你应该做的第一件事是使用你选择的工具安装必要的依赖项：

npm


```shell
$ npm install react-router-dom@6
```

Yarn

```shell
$ yarn add react-router-dom@6
```

pnpm

```shell
$ pnpm add react-router-dom@6
```

## Create React App

首先根据[React 文档中](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app)的说明[使用 Create React App 设置一个新项目](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app)，然后按照[上面的安装说明](#basic-installation)在你的项目中安装 React Router。

设置好项目并将 React Router 作为依赖项安装后，在文本编辑器中打开`src/index.js`。在文件顶部附近吧`BrowserRouter`模块从`react-router-dom`导入，并将App组件包装在`<Router>`中：

```js
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
```

现在你可以在应用的任何地方使用 React Router！举一个简单的例子，打开`src/App.js`并用一些路由替换默认代码：

```js
import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Welcome to React Router!</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
}
```

现在，仍在 `src/App.js`文件中创建你的路由组件：

```js
// App.js
function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </>
  );
}

function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>
          That feels like an existential question, don't you
          think?
        </p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}
```
通过运行`npm start`启动你的应用，你应该会在应用开始运行时看到`Home`路由。单击"About"链接以查看你的`<About>`路由，瞧！你已经使用 Create React App 成功设置了 React Router！🥳

当需要将你的应用部署到生产环境时，请务必按照[Create React App 文档](https://create-react-app.dev/docs/deployment#serving-apps-with-client-side-routing)中对 React Router 应用进行部署的说明来操作，以确保你的服务器配置正确。

## Parcel

按照[Parcel 文档中的说明](https://parceljs.org/getting_started.html)设置一个新项目，然后按照[上面的安装说明](#basic-installation)在你的项目中安装 React Router。

在项目中的`package.json`文件中添加一个`start`脚本，以便你可以在开发过程中在浏览器中打开你的项目。

```json
"scripts": {
  "start": "parcel index.html"
}
```

设置项目并安装依赖项后，`.babelrc`在项目的根目录下创建一个新文件：

```json
{
  "presets": ["@babel/preset-react"]
}
```

转到项目中的`index.js`文件，从`react`、`react-dom`和 `react-router-dom`中导入必要的函数，然后在 一个ID为`root`的`div`中挂载React 应用：

```js
// index.js
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App.js";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
```

在你的 `index.html`中，在script标签上方的body中创建根 div。`noscript`为可能禁用 JavaScript 的用户提供回退消息也很有帮助，除非你计划稍后在服务端渲染你的应用。

```html
<body>
  <noscript
    >You need to enable JavaScript to run this
    app.</noscript
  >
  <div id="root"></div>
  <script src="./index.js"></script>
</body>
```

现在 React 和 React Router 已设置，创建一个新文件`App.js`并添加一些路由和组件：

```js
// App.js
import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div>
      <header>
        <h1>Welcome to React Router!</h1>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </>
  );
}

function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>
          That feels like an existential question, don't you
          think?
        </p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}

export default App;
```

现在通过`npm start`命令运行启动你的应用，你应该会在应用开始运行时看到`Home`路由。单击"About"链接以查看你的`About`路由，瞧！你使用 Parcel 成功设置了 React Router！🥳

## Webpack

按照[webpack 文档中的说明](https://webpack.js.org/guides/getting-started/)设置一个新项目，然后按照[上面的安装说明](#basic-installation)在你的项目中安装 React Router。

在 webpack 中设置一个新的 React 项目比 Parcel 或 Create React App 更复杂一些。由于 webpack 是一个低级工具，允许你根据自己的喜好微调构建，因此你可能需要阅读[webpack 文档](https://webpack.js.org/)或查看[其他存储库中的 webpack 配置](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js)以了解如何构建自己的配置。

一旦你配置了 webpack 并安装了必要的依赖项，在你的代码中的某个地方（可能是你的 React 组件树的根），你可以从`react-router-dom`中`import`模块了。

```js
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Hello, React Router!</h1>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

## HTML Script标签

将 React 和 React Router 添加到网站的最快方法之一是使用`<script>`标签和全局变量。React Router 与 React 16.8+ 兼容。只需将以下`<script>`标签添加到你的 HTML 中，就在结束`</body>`标签之前：

```html
  <!-- Other HTML for your app goes here -->

  <!-- The node we will use to put our app in the document -->
  <div id="root"></div>

  <!-- Note: When deploying to production, replace "development.js"
       with "production.min.js" in each of the following tags -->

  <!-- Load React and React DOM -->
  <!-- See https://reactjs.org/docs/add-react-to-a-website.html to learn more -->
  <script src="https://unpkg.com/react@>=16.8/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@>=16.8/umd/react-dom.development.js" crossorigin></script>

  <!-- Load history -->
  <script src="https://unpkg.com/history@5/umd/history.development.js" crossorigin></script>

  <!-- Load React Router and React Router DOM -->
  <script src="https://unpkg.com/react-router@6/umd/react-router.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-router-dom@6/umd/react-router-dom.development.js" crossorigin></script>

  <!-- A simple example app -->
  <script>
  var e = React.createElement;
  var Router = ReactRouterDOM.BrowserRouter;
  var Routes = ReactRouterDOM.Routes;
  var Route = ReactRouterDOM.Route;

  ReactDOM.render(
    (
      e(Router, null, (
        e(Routes, null, (
          e(Route, {
            element: e('div', null, 'Hello, React Router!')
          })
        ))
      ))
    ),
    document.getElementById('root')
  );
  </script>

</body>
```

尽管此方法是一种快速启动和运行的好方法，但它确实会加载一些你可能不会在你的应用中使用的代码。React Router 被设计为许多小组件和函数的集合，允许你根据实际需要使用尽可能少的库。

为此，你需要使用 JavaScript打包程序（如[Webpack](#webpack)或[Parcel ](#parcel)）来构建你的网站。

