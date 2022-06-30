import { SiteDataType, DockItem } from '@site/src/types';
import React from 'react';
import GithubAlt from '@ricons/fa/GithubAlt';
import Mail from '@ricons/ionicons5/Mail';
import Zhihu from '@ricons/antd/ZhihuOutlined';
import Wechat from '@ricons/antd/WechatFilled';
import QQ from '@ricons/antd/QqOutlined';
import BiliBili from '@site/static/images/icons/bilibili.svg';
import Juejin from '@site/static/images/icons/juejin.svg';
import Feishu from '@site/static/images/icons/feishu.svg';
import Gitea from '@site/static/images/icons/gitea.svg';
import Cloud from '@ricons/material/CloudCircleOutlined';
import { openDockModal } from '@site/src/utils';
import { TipItem } from '@site/src/components/tip';

export const siteData: SiteDataType = {
    owner: {
        name: 'pincman',
        avatar: '/custom/avatar.svg',
        signature: '中年老码农,专注于全栈开发与教学',
    },
    beian: {
        prefix: '浙ICP备',
        code: '18013418号 - 6',
    },
};

export const tips: TipItem[] = [
    {
        id: 'update',
        content:
            '《Nestjs最佳实践》以及《React18最佳实践》已经开发更新,欢迎<a href="https://v.pincman.com">加入学习</a>!',
        color: 'warning',
        pages: ['blog'],
        closeTime: 3600 * 24,
    },
    {
        id: 'buy',
        content: 'Rowfish主题(本站主题)开始售卖,欢迎尝鲜哦！<a href="/rowfish">立即购买</a>',
        pages: ['blog'],
        color: 'success',
        closeTime: 3600 * 24,
    },
    {
        id: 'concat',
        content:
            '欢迎找我,🐧:1849600177   👉 请点击左侧(移动为底部)工具栏选择更多方式联系或关注我!',
        pages: ['about'],
        color: 'success',
        center: true,
        closeable: false,
    },
];

export const dockItems: DockItem[] = [
    {
        name: 'github',
        href: 'https://github.com/pincman',
        icon: GithubAlt,
        target: '_blank',
    },
    {
        name: '私有仓库',
        href: 'https://git.pincman.com',
        icon: Gitea,
        target: '_blank',
    },
    {
        name: 'B站',
        href: 'https://space.bilibili.com/53679018',
        icon: () => <BiliBili className="arco-icon" />,
        target: '_blank',
    },
    {
        name: '知乎',
        href: 'https://www.zhihu.com/people/pincman',
        icon: Zhihu,
        target: '_blank',
    },
    {
        name: '掘金',
        href: 'https://juejin.cn/user/1046390798295816',
        icon: () => <Juejin className="arco-icon" />,
        target: '_blank',
    },
    {
        name: '微信',
        icon: Wechat,
        onClick: () =>
            openDockModal('wechat-modal', 'https://pic.pincman.com/media/202206281555555.jpg', {
                w: 192,
                h: 192,
            }),
    },
    {
        name: 'QQ',
        href: 'http://wpa.qq.com/msgrd?v=3&uin=1849600177&site=qq&menu=yes',
        icon: QQ,
        target: '_blank',
    },
    {
        name: '飞书',
        icon: Feishu,
        onClick: () =>
            openDockModal('feishu-modal', 'https://pic.pincman.com/media/202206281557491.jpg', {
                w: 160,
                h: 208,
            }),
    },
    {
        name: '邮箱',
        href: 'mailto:pincman@qq.com',
        icon: Mail,
    },
    {
        name: '网盘',
        href: 'https://cloud.pincman.com',
        icon: Cloud,
        target: '_blank',
    },
];