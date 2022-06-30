---
sidebar_label: TailwindCSS指南(v3.1)
sidebar_position: 12
---

# Tailwind css v3食用指南

:::caution

未完待续...

:::

## 安装

以vite为例(默认vite项目已经创建)

```sh
~ pnpm add -D tailwindcss postcss autoprefixer # 安装依赖
~ pnpx tailwindcss init -p # 创建配置文件 "tailwind.config.js" 和 "postcss.config.js"
```

### 修改配置

```js
// `tailwind.config.js`
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 支持react jsx,需要vue则添加vue后缀
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

#### 黑暗模式

默认情况下是否启用暗黑模式是根据`prefers-color-scheme`来确定的,也就是客户端系统的设置来确定,一般情况下开发的应用需要动态灵活的根据系统设置,时间等确定还需要保存到本地浏览器存储,如`localstorage`,以便下次读取后自动设置.要实现这些功能,需要把tailwind的黑暗功能配置成手动启用

```js
// `tailwind.config.js`
module.exports = {
    darkMode: 'class',
    // ...
};
```

### 配置postcss

安装依赖

>   如果只使用scss模式作为嵌套规则,则无需安装`postcss-nesting`

```sh
pnpm add postcss-import postcss-nesting -D
```

修改文件

```js
// postcss.config.js
module.exports = {
    plugins: [
        // 支持css @import指令
        require('postcss-import'), 
        // 支持css嵌套模块,默认为scss模式
        // 通过传入(require('postcss-nesting'))参数支持最新的css原生嵌套规则
        require('tailwindcss/nesting')(require('postcss-nesting')), 
        // 肯定要
        require('tailwindcss'),
        // 自动添加浏览器兼容前缀
        require('autoprefixer'),
    ],
};
```

## 自定义样式

官方文档默认使用`@tailwind`指令来导入其核心文件,这样做就无法按顺序来导入自定义的css文件,因为`@import`必须总是在css文件最前面,像下面这样是错误的

```css
@tailwind base;
@import "./custom-base-styles.css";

@tailwind components;
@import "./custom-components.css";

@tailwind utilities;
@import "./custom-utilities.css";
```

但是如果像下这样定义,则会使用`custom-base-styles.css`中在`@layer`外定义的样式同时会覆盖掉框架内部的`components`和`utilities`中的样式

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
@import "./custom-base-styles.css";
```

### 推荐方式

所以我们应该像下面这样定义

```css
/* src/styles/index.css */
@import 'tailwindcss/base';
@import './tailwind/base';
@import 'tailwindcss/components';
@import './tailwind/components';
@import 'tailwindcss/utilities';
@import './tailwind/utilities';
```

添加各个层的css文件

```css
/* src/styles/tailwind/base.css */
@layer base {
}
/* src/styles/tailwind/components.css */
@layer components {
}
/* src/styles/tailwind/components.css */
@layer utilities {
}
```

#### 顺序与覆盖

在`@layer`中定义的样式如果在应用中没有用到则编译后被删除,如果要一直存在可以被组件动态使用的样式,请定义在`@layer`指令外部.

同时安装上面的导入顺序,现在的样式覆盖顺序如下

`utilities.css[外部]`->`utilities.css[@layer]`->`tailwindcss/utilities`->`components.css[外部]`->`components.css[@layer]`->`tailwindcss/components`->`base.css[外部]`->`base.css[@layer]`->`tailwindcss/base`

这就是我们想要的!

### 指令和功能

所谓指令就是tailwind自己添加的一堆css规则,重要且常用的指令如下

#### @tailwind

用于导入tailwind核心文件,前面已经说过了我们用不到,不过还有一个`@tailwind variants`指令,这是用来控制内部的css变量的,一般不用导入和修改,修改核心变量建议直接通过配置文件`tailwind.config.js`去实现

#### @layer

用于在一个层(如`@layer components`)中修改一些框架内部类或添加一些自定义的新类,使用方法如下

```css
/* src/styles/tailwind/base.css */
@layer base {
  h1 {
      @apply text-2xl;
  } 
}

/* src/styles/tailwind/components.css */
@layer components {
 .btn-primary {
      @apply py-2 px-4 bg-blue-500 text-white hover:bg-blue-700;
  }
}

```

#### @apply

用于在自定义样式中获取一个已经存在的类并关联,不仅可以像上面一样在`@layer`中使用,可以单独拿到外部类使用

```css
/* src/styles/tailwind/components.css */
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
```

>   需要注意的一点是,千万不要把`!important`直接加到自定义样式的属性值后面,这样会在`@apply`这个样式的时候自定删除,正确的方法应该是在`@apply`这个类的时候添加上`!important`

比如下面这样是错误的

```css
.foo {
  color: blue !important;
}

.bar {
  @apply foo;
}

/* 编译后结果是这样 */
.foo {
  color: blue !important;
}

.bar {
  color: blue;
}
```

这样才是正确的

```css
.btn {
  @apply font-bold py-2 px-4 rounded !important;
}
```

### 注意点

#### 样式重用

使用tailwind的一个重要原则是默认样式第一位,如果没有必要无需去添加太多自定义类,不好记忆.第二则使用通过框架(`react`,`vue`等)切分组件来实现组件级别的重用,只有最后没办法的情况下才去新增自定义类

#### 整合框架

一个非常重要的信息是在`vue`中的`style`标签中不能使用`@apply`,如果使用`vue`请直接使用[windicss](https://cn.windicss.org/),它与`vue`无缝整合(缺点是目前[windicss](https://cn.windicss.org/)只兼容tailwind v2).

而对于`react`中使用`css module`的情况下,则可以使用这些指令,但仍然不建议混合使用,因为`tailwind`一般会以一个全局的辅助样式库的角色作为框架的补充,大多数开发中我们会使用一个专门的组件库来作为主题样式,比如`ant.design`,这样的情况下我们写的`css module`一般只针对主样式库的组件来微调,甚至我们的主样式库可能会使用`css in js`,所以不必要和`tailwind`混搭在一起.

此外,对于使用的组件库中需要全局定义的样式,比如`Antd`的`Button`,倒是可以使用`@apply`来修改其组件样式,但是要注意的是,必须在`@layer`外去定义.如

```css
/* src/styles/components.css */
.select2-results__group {
  @apply text-lg font-bold text-gray-900;
}
```

总的来说规则如下

1.  尽量不要在组件中去独立定义一些`css`样式,而是采用`tailwind`自带或者全局自定义的类去实现单个组件的样式.
2.  即使组件为了修改第三方UI库中的一个样式,并且只需要本地的修改,这种情况必须使用`css in module`,那么也建议最好不要让你的`module.css`跟`tailwind`扯上关系
3.  如果组件中需要修改的一个UI库中的样式,而这个样式可以全局通用,则可以使用`tailwind`指令去修改这个样式

**tailwind只为全局服务**

## 配置与主题

### 配置文件

使用`pnpx tailwindcss init`默认会创建一个名为`tailwind.config.js`的配置文件,同时会生成一个`postcss.config.js`.

如果需要自定义配置文件名称,比如使用`tailwind.js`作为配置文件,需要到`postcss.config.js`中修改一下

```js
module.exports = {
  plugins: {
    tailwindcss: { config: './tailwindcss.js' },
  },
}
```

如果想生成包含默认配置的一个配置文件,使用命令`pnpx tailwindcss init --full`初始化

### 内容扫描

在配置文件的`content`中指定需要扫描的文件,不在`content`中的文件将无法使用`tailwind`.编译时框架会自动跟`content`中的文件使用了哪些`tailwind`中的类(包括`@layer`中自定义的)来排除其它没有使用的.其中的路径使用[glob规则](https://en.wikipedia.org/wiki/Glob_(programming))进行匹配.

**注意: 千万不要去扫描任何css文件甚至是包含tailwind类的css文件,否则系统直接爆**

一般情况下针对`react`使用如下配置即可(如果是`vue`,请加上`.vue`)

```js
// tailwind.config.js
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
```

为了能扫描到,在使用动态类名时请使用完整类名,如下

```jsx
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>

// 下面这样是错误的
<div class="text-{{ error ? 'red' : 'green' }}-600"></div>
```

如果在某些情况下实在需要使用不完整类名来拼装(比如用户动态发表的内容),请把它加入安全列表

```js
// tailwind.config.js
module.exports = {
  safelist: [
    'text-red',
    'text-green',
    {
      // 使用正则匹配多个类
      pattern: /bg-(red|green|blue)-(100|200|300)/,
      // 同时把匹配到的类的修饰符类也加上
      variants: ['hover', 'focus'],
    },
  ]
  // ...
}
```

另外关于**转换源文件**(比如markdown需要转成html才能读取其中的类)以及**自定义抽取逻辑**这部分的内容一般用不到,如有需要自行看[官网文档](https://tailwindcss.com/docs/content-configuration#transforming-source-files)即可

### 主题配置

在主题配置中可以自定义色系、类型比例、字体、断点、边框半径值等

主题配置有两个概念组成

-   全局配置包含`screens`,`colors`,`spacing`三个对象
-   核心插件指所有的工具类

全局配置的属性如下

-   `screens`用于定义全局屏幕断点
-   `colors`用于定于全局色系,默认情况下它由`backgroundColor`,`textColor`这些核心插件决定
-   `spaces`用于定义全局间距,默认情况下它由 `padding`, `margin`这些核心插件决定

有两种方式类配置主题

-   直接通过在`theme`对象中定义一个属性的对象,这样会完全替代掉这个属性的默认配置
-   通过 `extends`来新增或修改一个值,而不是完全替代整个属性

对于通过读取一个属性的值来配置另一个属性有两种方法

-   使用`theme`函数来读取当前配置的值
-   读取默认配置的值

注意点

-   所有核心插件均支持`DEFAULT`属性,用于没有后缀的默认值,比如`className="border-radius"`
-   不要在`theme`中配置空对象,如果要禁用某个核心插件,在`corePlugins`把它配置成`false`即可
-   所有默认配置[在此查看](https://github.com/tailwindlabs/tailwindcss/blob/v1/stubs/defaultConfig.stub.js#L5)

例

```js
// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  // ...
  // 禁用的核心插件
  corePlugins: {
    opacity: false,
  },
  theme: {
    // 基础配置
    // 替代默认的spacing
    spacing: { ... }
    // 核心插件
    // 替代默认的borderRadius
    borderRadius: { ... },
    // 通过theme函数读取最新的当前配置中的spacing
    backgroundSize: ({ theme }) => ({
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
      ...theme('spacing')
    }),
    extends: {
       // 新增一个screen
      screens: {
        '3xl': '1600px',
      },
      // 通过默认配置的值来修改默认的sans
      fontFamily: {
        sans: [
          'Lato',
          ...defaultTheme.fontFamily.sans,
        ]
      }
    }
  }
}
```



#### 扩展配置

如果只是想对某个配置新增一个值则使用`extends`