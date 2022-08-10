/* eslint-disable global-require */
import { CarouselItemType } from '@site/src/types';

export const carousels: CarouselItemType[] = [
    {
        image: require('../blog/images/rowfish-banner.png'),
        link: '/rowfish',
        title: 'RowFish -- 一款美的无与伦比的Docusaurus主题',
        description:
            '用于构建知识分享及知识付费的博客系统<br />为计算机从业者提升个人求职竞争力或从事网络授课/自媒体等作为副业而打造！',
    },
    {
        image: require('../blog/images/classroom.png'),
        link: '/classroom',
        darkBg: false,
    },
    {
        image: require('../blog/images/about.png'),
        link: '/about',
        title: '关于站长和小站',
        description: '聊一聊生活,谈一谈技术,以及一个好的技术分享网站的诞生',
    },
];
