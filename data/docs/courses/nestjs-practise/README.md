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

如果你需要体系深入的学习Node.js,React等TS全栈开发技能，并寻找更好的远程工作或承接远程外包，可以加入[小站](https://pincman.com)的[极速教室](/classroom)

:::

:::tip

[极速教室](/classroom)中会从基础开始教学并包含本教程中没有涉及到的Nextjs,Electron等技能

:::

## ✍️目标学者

本教程适合以下几类童鞋学习

- 👉 学了TS和ES6,想先从Node.js入手后端再学前端的小白
- 👉 跟我一样三级没过看不懂各种英文文档,需要谷歌翻译加持,却想加快学习进度的土鳖
- 👉 职业前端转全栈,想用Node做个后端学习的跳板,后面可以继续学习go等
- 👉 PHPer(大家都懂得原因),学习一下node顺带学习ts和前端可以获得更多的求职及跳槽的资本
- 👉 Javaer,跟PHP相反的是Java招的人多,但是学的人更多,多学一门技术抵消部分竞争力
- 👉 Gopher,想学习一下传统的企业级框架拓展知识面
- 👉 企业技术栈转型急需
- 😜吃饱撑得没事做的码农...

## 🔥教程目录

1. 👉 [第一集: 编码环境搭建](/docs/courses/nestjs-practise/chapter1)
2. 👉 [第二集: 基本数据操作](/docs/courses/nestjs-practise/chapter2)
3. 👉 [第三集: 模型关联与树形嵌套](/docs/courses/nestjs-practise/chapter3)
4. 👉 [第四集: 排序,分页与过滤的实现](/docs/courses/nestjs-practise/chapter4)
5. 👉 [第五集: 自动验证,序列化与异常处理](/docs/courses/nestjs-practise/chapter5)

## 🌒教程内容

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

如果在教程中遇到问题，可以扫码加视频里的QQ群提问，可以加我微信**yjosscom**，我会把你拉微信群，在群里提问反馈会比QQ群更快