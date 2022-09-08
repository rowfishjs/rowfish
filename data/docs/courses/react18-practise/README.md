---
title: React18最佳实践
sidebar_label: React18最佳实践
hide_title: true
pagination_prev: null
pagination_next: null
---
import Image from '@theme/IdealImage';
import $styles from '../style.module.css';

<div className={$styles.banner}>
    <Image img={require('../images/react-banner.png')} />
</div>


:::caution

本教程是有[平克小站](https://pincman.com)开发及制作且**视频和文档是完全免费**的(仅源码和问答服务收费)，未经许可不得随意篡改并商业销售，免费的分享请自便(各位同学请帮我B站三连，谢谢)

:::

:::tip

如果你想永久免费获取所有最新课程的源码及获得教程问答服务,请[订阅小站](/about/#订阅小站)

:::

:::info

如果你需要体系化地学习Node.js,React等TS全栈开发技能,并想寻找一份好的远程工作,可以报名[3R教室](/classroom)

:::

:::note

不会基础ES6和TS基础知识的朋友请先查询[《Typescript入门教程》](https://ts.xcatliu.com/)

:::

## ✍️目标学者

本教程适合以下几类童鞋学习

- 👉 前端入门者: 已经学习过TS和ES6的基础知识,需要快速学习一个前端框架
- 👉 React初学者: 已经学会了各种React知识希望有一套能进行项目实战练习的教程
- 👉 Vue开发者: 觉得Vue3太啰嗦不够Geek或者对TS和编辑器支持度有强迫症想尝试一下新东西
- 👉 Angular开发者: 想开发一下小程序或者移动APP
- 👉 Jquery为主的传统MVC开发者: Jquery+PHP/ROR写腻了? 那么就来追一下潮流哈
- 👉 Gopher,Javaer等职业后端: 想成为全栈开发者或者至少不再与前端争论对错和扯皮,自己能看懂前端代码,那么本教程正适合你

## 🔥 购买方法

**本教程售价 ¥699**

- **[3R教室](/classroom)**的同学可永久学习所有教程
- **[订阅本站](/about#订阅小站)**可永久学习所有教程
- 单独购买本课请直接联系我，**[查看联系方式](/about#联系方式)**

## 🍉 教程目录

教程以站长原本开发的一个react17后台管理面板[toome](https://github.com/toomejs/toome)为原型，并升级为React18来讲解

教程内容涉及React的绝大多数新生态，通过一个Spa后台的实战案例的开发非常全面地讲解React+TS项目开发中的方方面面,使大家能全面深入的掌握React及其周边的生态.

教程目录如下:

1.  Typescript+Vite+Eslint+Prettier+Stylelint工程构建
2.  使用Zustand进行状态管理(以暗黑模式和皮肤颜色调整及数据持久化为例)
3.  React Router V6配置式路由封装与多个Loading样式实现
4.  图标组件封装与实现
5.  Arco Design响应式多端布局与动态菜单实现
6.  使用SWR+Axios构建API请求库
7.  Mock数据构建与权限路由和服务端菜单实现
8.  番外篇-TailwindCSS使用详解
9.  Localforage实现状态无关的数据持久化
10.  Echarts与Antd Echarts实现图表与数据可视化
11.  多标签与原生KeepAlive实现
12.  使用React-DND构建可拖拽的低代码页面
13.  强大的React-Spring使用详解
14.  番外篇-使用Redux-Toolkit进行状态管理
15.  番外篇-使用Jotai进行状态管理
16.  番外篇-常用React库的介绍与使用
17.  Jest测试与E2E测试编写

### 3R教室文档
:::tip

以下文档为[3R教室](/classroom)讲课时一些比教程多出来的文档，非3R教室的同学忽略就可以

:::

- 一些常用的React库使用
- React-three-fiber 3D构建
- Electron+React使用详解
- React构建SSR网站应用初步
- Nextjs应用开发详解
- 深入浅出CRA与Webpack
- 结合Nestjs,PNPM构建Monorepo仓库
- Docusaurus打造个人网站与远程工作求职指导

## 🌒 知识点

本教程可能会涉及到的知识点以及学习目标如下

:::info

如果觉得不清晰，请看[3R教室](/classroom#教学内容)中的React体系部分(不包括Nextjs等额外框架)

:::

本套教程基本的知识点如下：

- React+TS+Vitejs的开发环境构建
- 掌握React开发的绝大部分技术
- 灵活的使用Hooks以及编写自定义的Hooks
- React Router的深度配置化封装以及懒加载实现
- 学会使用Reducer+Context封装轻量级的状态管理
- 掌握Zustand来进行全局的状态管理
- 全面掌握React Router的使用和配置化封装
- 学会使用TailwindCSS来构建样式
- 学会css modules等多种css模式的使用
- 使用Antd/Arco/Mui等组件库
- 使用localforage构建本地化数据缓存
- 使用swr.js进行与后端的数据互交
- 动态暗黑模式和实时皮肤切换实现
- 登录手机认证,社会化认证和验证码实现
- 动态权限路由与菜单的生成
- 图片上传以及区块拖动等常用组件的使用
- ECharts实现数据可视化
- 掌握React-DND,React-Spring等多个常见库的使用
- Monorepo和同构架构的实现


## 👀问题解决

如果在教程学习过程中遇到问题:

- 免费学者可以扫码加视频里的QQ群或者加我微信**yjosscom**进群讨论
- 订阅者或购买本教程后(包括3R教室的同学)，请直接进入飞书群提问，我会在群里详细解答