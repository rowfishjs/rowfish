---
sidebar_label: Nestjs最佳实践
hide_title: true
---
import Image from '@theme/IdealImage';
import $styles from '../style.module.css';

<div className={$styles.banner}>
    <Image img={require('../images/nestjs-benner.png')} />
</div>

:::caution

本教程是有[平克小站](https://pincman.com)开发及制作且**完全免费**的，未经许可不得随意篡改并商业销售，免费的分享请自便(各位同学请帮我B站三连，谢谢)

:::

:::note

教程目录不固定,以便随时调整。目前做完一集链接就会添加到本页，具体内容可以参考下面的[教程内容](#教材内容)

:::

:::info

不会基础ES6和TS基础知识的朋友请先查询《Typescript入门教程》](https://ts.xcatliu.com/)

:::

:::tip

如果你需要体系深入的学习Node.js,React等TS全栈开发技能，并寻找更好的远程工作或承接远程外包，可以加入[小站](https://pincman.com)的[3R教室](/classroom)

:::

:::tip

[3R教室](/classroom)中会从基础开始教学并包含本教程中没有涉及到的Nextjs,Electron等技能

:::

本教程的目标不止步与使童鞋们学会使用Nestjs框架本身构建web后端,更在于让大家掌握如何熟练地运用TS以及Node.js的知识和周边的生态灵活的构建所需的应用

比如利用Yargs构建命令行,利用ws/socket.io构建IM,以及消息列队在node.js中的实现等

所以,教程的名字也许改成《TS-NODE最佳实践》更好？

> 本教程为免费教程,代码仓库和文档均免费公开,有BUG可以在[这里](https://github.com/nestplus/nestplus/issues)提交,**注意本教程不适合小白入门**

- [教程](https://space.bilibili.com/53679018/channel/collectiondetail?sid=615904)
- [代码](https://github.com/nestplus/nestplus)
- [文档](https://pincman.com/docs/courses/nestjs-practise)

## 关于Nestjs

Nestjs是当前比较流行的一款使用Typescript开发Node应用的企业级框架,非常适合与React,Vue,Next.js/Nuxt.js等前端技术进行全栈同构开发,对Serverless+Node进行快速应用开发也比较适用.同时框架本身对微服务的支持也很不错,并且AOP支持很好,可以承担部分业务层比较复杂的企业级开发,性能在换上fastify驱动后也是杠杠的,整体来说非常全面,是目前typescript写后端的最佳选择.

因为学习本教程的童鞋大多是直接前端转过来想成为全栈的,在后端方便的知识会比较欠缺,所以在开始学习的同时最好也恶补一下Node.js和Typescript的一些基础知识,这样学习本教程就会事半功倍.当然如果你有过其它后端编程语言以及框架的开发经验（比如[Flask](https://www.palletsprojects.com/p/flask/),[Laravel](https://laravel.com/),[Spring boot](https://spring.io/projects/spring-boot)等）或者基于Node的Egg.js则更佳.

## ⚡️适用场景

学习了Ts,Node,Nestjs来构建后端对于全栈开发是十分有帮助的,但不是所有场景都适合使用Node和TS的,下面我们来分析一下

Node.js的优势并不在于生态或性能

在技术选型上,Node.js目前的最大优势还是在于前后端同构以及serverless方面,但是以下场景都比较适用

- 聊天室,爬虫类,游戏服务端类,区块链(可代替go)项目等应用
- 缺少后端人员但需要快速快速上线的初创型项目
- 处于上升期,并发量,吞吐量和IO密集型有一定需求,同时对CPU密集不敏感的应用
- 需要项目一体化及与前端同构的应用
- serverless应用
- 前端与API的中间层
- 需要前后端一体化架构,代码统一的应用
- 性能要求不高的CLI类命令行工具以及桌面应用(Electron)
- 各种CLI工具

## ✍️目标学员

本教程适合以下几类童鞋学习

- 👉 已经对TS的其它前端技术栈掌握的比较深入想多学一门后端技术
- 👉 已经对TS和Node的其它框架及技术掌握的比较深入,纯粹想学Nestjs
- 👉 其它技术栈比较熟练(比如Java,PHP,Rails等),想转Node
- 👉 学了TS和ES6,想先从Node.js入手后端再学前端的小白

## 🔥 广告

**[平克小站](https://pincman.com)正在开设[《TS全栈开发培训班》](https://pincman.com/classroom)，不仅仅是在教学中帮助你提升自我，全面掌握TS+Node.js/Nesjts+React的全栈开发技术栈，并且同时指导你寻找稳定高薪的远程工作之方法！**

## 🎾教程内容

1. 👉 [第一集: 编码环境搭建](/docs/courses/nestjs-practise/chapter1)
2. 👉 [第二集: 基本数据操作](/docs/courses/nestjs-practise/chapter2)
3. 👉 [第三集: 模型关联与树形嵌套](/docs/courses/nestjs-practise/chapter3)
4. 👉 [第四集: 排序,分页与过滤的实现](/docs/courses/nestjs-practise/chapter4)
5. 👉 [第五集: 自动验证,序列化与异常处理](/docs/courses/nestjs-practise/chapter5)

## 🌒 知识点

本教程由浅入深的讲解TS Node与Nestjs应用的开发.教程中通过循序渐进的方式实现一个无懈可击的商业应用，帮助大家快速,高效的掌握Node.js,TS以及Nestjs

本教程篇幅定在三十五集左右，通过一个完备的后端应用由浅入深地讲解Nestjs应用的开发.教程中通过循序渐进的方式全方位的讲解Nestjs框架的应用开发和魔改Hack,使大家能快速,高效的掌握Nestjs并且加深对TS和node.js的熟练度.

本套教程基本的知识点如下：

- 基本掌握Nestjs框架的依赖注入,模块,提供者,生命周期等概念
- 掌握DTO数据验证,响应序列化,异常过滤器等常用功能
- 学会编写一些常用的class-validator验证约束
- 熟练掌握Typeorm以及Nestjs与Typeorm结合开发
- 学会整合Swagger输出Open API文档
- 掌握TS装饰器以及反射元数据的定义和使用
- 编写一些数据库相关的数据验证约束(比如树形表的同级别某字段唯一验证等)
- 学会通过继承并魔改Nestjs源码编写自定义的全局验证器
- 可以编写自定义的配置系统以及核心功能包
- 学会自定义的代码组织方式
- 利用Yargs结合编写一些自定义CLI命令(比如数据迁移,数据填充等)
- 掌握如何利用阿里云/腾讯云推送邮件和短信
- 掌握使用消息列队(MQ)的方式异步推送邮件和短信
- 掌握守卫原理以及编写一些用户验证的守卫
- 编写一个完善的用户系统(JWT认证,短信/邮件登录,短信/邮件注册,找回密码,绑定手机和邮箱等)
- 熟练地通过编写装饰器去实现一些常用的功能(比如一个可直接通过配置一键关闭某个控制器的装饰器又或者通过配置来实现Entity的动态关联,多态多对多,以及资源所属判断等)
- 通过WebSockets实现用户的上线,下线以及消息实时推送,消息广播等
- 学会使用云存储来上传文件
- 实现RBAC的权限系统
- 理解请求范围概念以及性能方便的考量
- 通过适用Vscode进行Debug以及编写Jest测试来提升开发效率与程序的可用性
- 学会Graphql替代Restful写API
- 学会一些常用的部署方式,比如通过nginx+pm2反向代理部署,devops自动化CI,CD等
- 基本的Monorepo结构应用的搭建
- 掌握使用Vite+React+Nestjs开发中后台
- 掌握Next.js+Nestjs开发SSR同构应用
- 整合腾讯云Cloudbase+Nestjs开发Faas应用
- 第三方社会化登录以及统一支付接口开发等
- 其它的一些常用功能

## 👀问题解决

如果在教程中遇到问题，可以扫码加视频里的QQ群提问

也可以加我微信**yjosscom**，我会把你拉微信群，在微信群里提问反馈会比QQ群更快