/* eslint-disable global-require */
import { WorkCardTagsType } from '@site/src/components/card/work';
import { WorkCardItemType, WorksPageInfoType } from '@site/src/types';

export const worksInfo: WorksPageInfoType = {
    title: '关于我',
    description: '一个崭新的Rowfish站点',
};
export const works: WorkCardItemType[] = [
    {
        img: require('@site/static/custom/rowfish-thumbnail.png').default,
        name: 'Rowfish',
        desc: '用于构建知识分享及知识付费的博客系统,基于Docusaurus+Wordpress实现',
        link: '/docs/rowfish/',
        demo: 'https://pincman.com',
        buy: 'http://wpa.qq.com/msgrd?v=3&uin=1849600177&site=qq&menu=yes',
        tags: ['typescript', 'react'],
    },
];
export const tags: WorkCardTagsType = {
    design: {
        label: 'Design',
        description: '纯设计或css类作品!',
        color: '#a44fb7',
    },
    typescript: {
        label: 'TypeScript',
        description: '使用Typescript编写的项目',
        color: '#007acc',
    },
    react: {
        label: 'React',
        description: '基于React实现的项目!',
        color: '#dfd545',
    },

    nodejs: {
        label: 'Node.JS',
        description: 'NodeJS或全栈应用',
        color: '#39ca30',
    },
};
