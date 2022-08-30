/* eslint-disable global-require */
import { CarouselItemType } from '@site/src/types';

export const carousels: CarouselItemType[] = [
    {
        image: require('../blog/images/classroom.png'),
        link: '/classroom',
        darkBg: false,
    },

    {
        image: require('../blog/images/about.png'),
        link: '/about/#订阅小站',
        title: '订阅本站',
        description: '一次订阅终身受益，可永久获取本站所有视频教程的文档，源代码及获得问答服务',
    },
    {
        image: require('../blog/images/rowfish-banner.png'),
        link: '/rowfish',
        title: 'RowFish -- 一款美的无与伦比的Docusaurus主题',
        description:
            '用于构建知识分享及知识付费的博客系统<br />为计算机从业者提升个人求职竞争力或从事网络授课/自媒体等作为副业而打造！',
    },
];
