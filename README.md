---
slug: rowfish
title: RowFish -- 开源一款比较好看的docusaurus主题
type: image
image: https://pic.pincman.com/media/202206301202195.png?imageMogr2/format/webp
authors: [pincman]
rf_summary: 用于构建知识分享及知识付费的博客系统<br />为计算机从业者提升个人求职竞争力或从事网络授课/自媒体等作为副业而打造！
rf_banner: true
rf_noloop: true
rf_comment: false
rf_excerpt: false
order: 0
---

[rowfish]:https://pincman.com/rowfish
[source]: https://github.com/rowfishjs/rowfish
[pincman ]: https://pincman.com
[discussions]: https://github.com/rowfishjs/rowfish/discussions
[issue]: https://github.com/rowfishjs/rowfish/issues
[usage]: https://pincman.com/docs/rowfish/overviewpro:https://pincman.com/rowfish/pro
[pro]:https://pincman.com/rowfish#关于pro
[pincman]: https://pincman.com/
[docusaurus]: https://docusaurus.io
[php]: https://php.net
[wordpress]: https://wordpress.org

[laravel]: https://laravel.com

[nextjs]: https://nextjs.org
[nestjs]: https://nestjs.com
[typescript]: https://typescript.org
[vscode]: https://code.visualstudio.com/
[waline]: https://waline.js.org/
[obsidian]: https://obsidian.md/
[react]: https://reactjs.org
[vscode]: https://code.visualstudio.com
[obsidian]: https://obsidian.md
[rizhuti]: https://ritheme.com/theme/792.html
[tailwind]: https://tailwindcss.com/
[antd]: https://ant.design/index-cn
[docspress]: https://wordpress.org/plugins/docspress
[anspress]: https://anspress.net
[vercel]: https://vercel.com
[oneinstack]: https://oneinstack.com
[gitea]: https://gitea.io
[drone]: https://www.drone.io
[markdown]: https://www.markdownguide.org/
[qq]: http://wpa.qq.com/msgrd?v=3&uin=1849600177&site=qq&menu=yes
[rowfish-qq-group]: https://qm.qq.com/cgi-bin/qm/qr?k=gs1EYHC5nzneWJ6kZJQ1TtMY9sLP-H5R&jump_from=webapi
[pro-qq-group]: https://qm.qq.com/cgi-bin/qm/qr?k=8eLi_sZAEXR4WOd3xNqI058aOviOXLHU&jump_from=webapi/

![](https://pic.pincman.com/media/202206301202195.png?imageMogr2/format/webp)
>   [Rowfish][rowfish]是一套用于构建个人文档库，作品展示和博客系统的[Docusaurus][docusaurus]主题，**主题基于MIT协议完全开源**，专为计算机从业者提升个人求职竞争力或于宁自媒体等而打造！ 🐳

## 🚀缘起

>    演示站点请看我的[博客][pincman]

过去我一直打算做一个博客，也可以自己写写文章啥的。因为很多年前用过typecho，一直感觉还不错，但是最近因为一直在用[vscode][vscode]以及[obsidian][obsidian]写文章，而[vscode][vscode]和[obsidian][obsidian]是可以直接打开一个工作空间来管理文档的，所以使用静态博客直接编辑.md文件发布显然更适合。找了一下静态博客程序，发觉hexo，hugo，vuepress，[docusaurus][docusaurus]都还挺不错的，但是hexo，hugo没有自带文档系统，显然不符合我需要长期写文档的要求，这两首先排除。由于我个人对vue3不大熟悉，工作中长期使用[react][react]，所以自然而然的选择了基于[react][react]的[docusaurus][docusaurus]。

默认的[docusaurus][docusaurus]不大符合中文站点的审美，也不像vuepress那样拥有大量好看的开源主题，于是干脆自己动手设计开发了一款。

源码地址:[https://github.com/rowfishjs/rowfish][source]，喜欢的朋友给个星，谢谢！

## 🍃介绍

其实没啥好介绍的，[docusaurus][docusaurus]该有的都有，唯一不同的是主题目前只支持中文站点(后续如果有需求再加上多语言支持)。

[rowfish][rowfish]主要**增加了一些页面和数据以及以`rf-`开头字段**。然后添加了**博客首页轮播**，**本地站内搜索**，**作品展示页**，**课程展示页**以及使用[waline][waline]的**评论功能**，具体看使用[文档][usage]。后续打算在性能上再做一些优化，就酱紫。

>   目前完美匹配移动端，且暗黑模式下效果更佳

效果可以查看**[演示站点][pincman]**

给张图，如下
![](https://pic.pincman.com/media/202207012135423.png)
## 🌴后续

在[Docusaurus][docusaurus]发布正式版前,本主题锁定在[beta21]版本,等正式版发布直接一次性升级.

## 🔭 支持

-   🍓 [求助][discussions]
-   🛠️ [bug修复][issue]

 🍉 秋秋群

![](https://pic.pincman.com/media/202207011929335.png)

## 🐬关于Pro

[Rowfish][rowfish]本身是用于日常的知识分享及个人展示，不具备商业营运能力。而[Rowfish Pro][pro]作为一个子系统存在，用于搭建知识付费和在线网课站点。

:::caution

[Pro][pro]是基于[wordpress][wordpress]构建的，需要懂一点[PHP][php]的部署知识。同时[Pro][pro]是一套[rizhuti][rizhuti]的子主题，如果对授权警告比较敏感，需要另行购买[rizhuti][rizhuti]授权来去除警告，不过不影响使用

:::

可以参考**[Pro演示站点](https://v.pincman.com)**

正确以及推荐的使用方式应该以[Rowfish][rowfish]作为主站以[Rowfish pro][pro]作为子站来搭建

:::note

当然你也可以直接把[Pro][pro]作为主站而不用[Rowfish][rowfish]，因为[Pro][pro]自带[Rowfish][rowfish]的几乎所有功能，但是在样式设计，用户体验等方面站长原则上会把[Rowfish][rowfish]做为优先级

:::

预览图

<a href="https://pic.pincman.com/media/202207011647835.png" target="_blank" style={{ display: 'block',marginBottom: '1rem' }}>点此查看大图</a>
![](https://pic.pincman.com/media/202207011647835.png)

两者的功能对比如下

| 功能                                                 | Rowfish | Rowfish Pro |
| ---------------------------------------------------- | :-----: | :---------: |
| 博客及评论系统                                       |    ✅    |      ✅      |
| 文档系统(支持在线运行React等演示代码)                |    ✅    |      ✅      |
| 个人介绍及作品展示                                   |    ✅    |      ✅      |
| 生态导航                                             |    ✅    |      ✅      |
| 全站搜索                                             |    ✅    |      ✅      |
| 护眼效果及暗黑模式切换                               |    ✅    |      ✅      |
| 完美的移动端适配                                     |    ✅    |      ✅      |
| 联系和社交平台关注工具条                             |    ✅    |      ✅      |
| 免费课程展示页                                       |    ✅    |      ✅      |
| 付费会员系统                                         |    ❎    |      ✅      |
| 付费视频课程系统                                     |    ❎    |      ✅      |
| 微信，支付宝等多个支付接口(支持个人使用)             |    ❎    |      ✅      |
| 问答系统                                             |    ❎    |      ✅      |
| 个人中心(包括收藏，消息，购买记录，充值，我的问答等) |    ❎    |      ✅      |

定价：¥ 699元(不包括[Rizhuti][rizhuti]的授权费用，如有需要请自行购买)，有需要可联系站长([QQ:1849600177 ][qq])购买