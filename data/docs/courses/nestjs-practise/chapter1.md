---
sidebar_label: 编码环境搭建
sidebar_position: 2
---
# 编码环境搭建

:::info
注意: 为了兼顾大多数用户,本教程使用远程SSH连接Debian服务器进行讲解,同时会给出MacOS的命令,windows本地开发者请自行安装wsl2作为替代
:::

视频地址: [https://www.bilibili.com/video/BV1q34y1n7iu?share_source=copy_web&vd_source=00f2b7e5f03bd39b4d8c477ef0bd8b1b](https://www.bilibili.com/video/BV1q34y1n7iu?share_source=copy_web&vd_source=00f2b7e5f03bd39b4d8c477ef0bd8b1b)

## 学习目标

-   安装与配置[node.js](https://nodejs.org/zh-cn/)+[pnpm](https://pnpm.io/)环境
-   配置`tsconfig.json`+[eslint](https://eslint.org/)+[prettier](https://prettier.io/)实现代码规范化
-   配置[vscode](https://code.visualstudio.com/)实现调试与在保存代码时自动运行`eslint`+`prettier`
-   配置`lanunch.json`进行应用调试
-   安装`Thunder Client`插件进行接口调试

## 环境搭建

安装与配置[node.js](https://nodejs.org/zh-cn/)环境

>   MacOS请使用brew安装,如果没有安装[brew](https://brew.sh/)请先安装

**建议:安装到GLOBAL里面的东西统一使用一个包管理器,我这里使用[pnpm](https://pnpm.io/)**

安装[node.js](https://nodejs.org/zh-cn/)

```shell
# 下载并解压node
~ sudo wget https://nodejs.org/dist/v18.4.0/node-v18.4.0-linux-x64.tar.xz -O /usr/local/src/node18.tar.xz
~ sudo tar -xf /usr/local/src/node18.tar.xz -C /usr/local/
~ sudo mv /usr/local/node-v18.4.0-linux-x64 /usr/local/node
# 添加到环境变量
echo "export PATH=/usr/local/node/bin:\$PATH" >> ~/.zshrc && source ~/.zshrc
```

配置[npm](https://www.npmjs.com/)淘宝镜像

```shell
~ npm config set registry https://registry.npmmirror.com/
```

安装[pnpm](https://pnpm.io/)以及初始化pnpm

```shell
~ npm install -g pnpm
~ pnpm setup && source .zshrc
```

配置[pnpm](https://pnpm.io/)淘宝镜像

```shell
~ pnpm config set registry https://registry.npmmirror.com/
```

安装镜像管理工具

```shell
~ pnpm add nrm -g 
```

建议安装一个[node](https://nodejs.org/zh-cn/)版本管理工具比如[n](https://github.com/tj/n)或者[nvm](https://github.com/nvm-sh/nvm)

>   因为我们使用普通用户编程,所以把n的目录通过环境变量改成我们可以操作的目录

```shell
~ pnpm add n -g 
~ echo "\nexport N_PREFIX=\$HOME/.n" >> ~/.zshrc
~ echo "export PATH=\$N_PREFIX/bin:\$PATH" >> ~/.zshrc
~ source ~/.zshrc
# 安装最新的长期支持版
~ n lts_latest && node --version
# 切换回最新版
~ n latest && node --version
```

安装[nestjs cli](https://docs.nestjs.com/cli/overview)

```shell
~ pnpm add @nestjs/cli -g
```

创建项目,我们命名为nestplus

>   这一步如果出现错误就进入`nestplus`目录,手动`pnpm i`一下

```shell
~ nest new nestplus # 创建的时候选择pnpm
```

升级所有包到最新版本

```shell
~ pnpm up -latest
```

这是会报缺少`peer建议依赖`中`webpack`的警告,把下面这段添加到`package.json`中就可以了

```json
 "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": [
        "webpack"
      ]
    }
  }
```

## 代码规范化

具体代码与配置请自行查看源代码

### 代码风格

配置[airbnb](https://github.com/airbnb/javascript)的eslint规则并整合[prettier](https://prettier.io/),并且经过一定的客制化同时配合vscode可达到完美的编码体验

```shell
pnpm add typescript \
eslint \
prettier \
@typescript-eslint/parser \
@typescript-eslint/eslint-plugin \
eslint-config-airbnb-base \
eslint-config-airbnb-typescript \
eslint-config-prettier \
eslint-plugin-import \
eslint-plugin-prettier \
eslint-plugin-unused-imports \
eslint-plugin-unused-imports \
prettier-plugin-organize-imports \
eslint-plugin-jest -D
```

配置内容

```javascript
...
plugins: ['@typescript-eslint', 'jest', 'prettier', 'import', 'unused-imports'],
extends: [
    // airbnb规范
    'airbnb-base',
    // 兼容typescript的airbnb规范
    'airbnb-typescript/base',
    // typescript的eslint插件
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    // 支持jest
    'plugin:jest/recommended',
    // 使用prettier格式化代码
    'prettier',
    // 整合typescript-eslint与prettier
    'plugin:prettier/recommended',
],
```

#### 一些重要的规则

>   其余配置自行查看代码

设置解析文件为`tsconfig.eslint.json`(我们在[Tsconfig配置](#Tsconfig配置)部分新增这个文件)

```javascript
parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
},
```

`eslint-plugin-unused-imports`用于自动删除未使用的导入

```javascript
...
 'no-unused-vars': 0,
 '@typescript-eslint/no-unused-vars': 0,
 'unused-imports/no-unused-imports': 1,
 'unused-imports/no-unused-vars': [
    'error',
    {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true,
    },
]
```

`import`插件,`import/order`可以按照自己的需求配置

```javascript
// 导入模块的顺序
'import/order': [
     'error',
     {
         pathGroups: [
             {
                 pattern: '@/**',
                 group: 'external',
                 position: 'after',
             },
         ],
         alphabetize: { order: 'asc', caseInsensitive: false },
         'newlines-between': 'always-and-inside-groups',
         warnOnUnassignedImports: true,
     },
],
// 导入的依赖不必一定要在dependencies的文件
'import/no-extraneous-dependencies': [
    'error',
     {
         devDependencies: [
             '**/*.test.{ts,js}',
             '**/*.spec.{ts,js}',
             './test/**.{ts,js}',
             './scripts/**/*.{ts,js}',
         ],
     },
],
```

接下来需要配置一下`.prettierrc`,和`.editorconfig`,并且把一些它们各自需要忽略的目录和文件分别添加到`.eslintignore`和`.prettierignore`

最后把`git`仓库需要忽略的目录和文件写入`.gitignore`

### Tsconfig配置

`tsconfig.json`文件中添加`ESNEXT`就可以使用最新的ES语法,并且添加一个`@`作为根目录映射符

```json
{
    "compilerOptions": {
        // ...
        "paths": {
            "@/*": ["src/*"]
        }
    },
     "include": ["src", "test", "typings/**/*.d.ts"]
}
```

在跟目录添加一个`tsconfig.eslint.json`文件,供`eslint`使用

```json
{
    "extends": "./tsconfig.json",
    "includes": ["src", "test", "typings/**/*.d.ts", "**.js"]
}
```

tsconfig.build.json中排除`**.js`

```json
{
    "extends": "./tsconfig.json",
    "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
```

## 开发工具

对于[node.js](https://nodejs.org/zh-cn/),[typescript](https://www.typescriptlang.org/),前端等技术最好的开发工具毋庸置疑的就是[vscode](https://code.visualstudio.com/),任何其它选项(包括vim,emacs,sublime text,atom,webstorm等等)都有这样那样的问题需要去耗费精力,所以建议直接使用VScode进行开发

>   VSCode已经自带同步配置和插件的功能,建议启用

安装[vscode](https://code.visualstudio.com/)

>   Windows直接点击安装包就可以,需要注意的是如果是WSL2或远程SSH开发,需要在远程再一次安装插件

```shell
~ brew install vscode
```

安装[eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)插件和[prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)插件

```shell
~ code --install-extension dbaeumer.vscode-eslint \
  && code esbenp.prettier-vscode
```

按`cmd+,`选择偏好设置->工作空间,配置[eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)插件

```json
{
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

按`shift+cmd+d`创建`lanunch.json`,并且使用`ts-node`+`tsconfig-paths`配置断点调试,打好断点,按`F5`就可以进行调试

>   这种调试方式适合简单使用,后续我们将会讲到jest测试调试,这样效果会更好

```json
{
    // 使用 IntelliSense 了解相关属性。
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "debug nestplus",
            "request": "launch",
            "runtimeArgs": ["run-script", "start:debug"],
            "autoAttachChildProcesses": true,
            "console": "integratedTerminal",
            "runtimeExecutable": "pnpm",
            "skipFiles": ["<node_internals>/**"],
            "type": "pwa-node"
        }
    ]
}
```

最后安装[Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)用于接口测试,当然你也可以安装postman

至此,所有配置完成,现在重启[vscode](https://code.visualstudio.com/)就可以进入下一节学习如何愉快的使用[nestjs](https://nestjs.com/)构建应用了