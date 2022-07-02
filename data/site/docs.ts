/* eslint-disable global-require */

import { CourseCardItemType } from '@site/src/types';

export const courses: CourseCardItemType[] = [
    {
        name: 'React最佳实践',
        image: 'https://pic.pincman.com/media/202206231332653.png',
        href: 'https://v.pincman.com/courses/66.html',
        color: 'success',
        status: 1,
        isFree: false,
        target: '_blank',
        description: '最好的react 18+实战教程',
    },
    {
        name: 'Nestjs最佳实践',
        image: 'https://pic.pincman.com/media/202206231209221.png',
        href: 'https://v.pincman.com/courses/64.html',
        color: 'success',
        status: 1,
        isFree: false,
        target: '_blank',
        description: '最好的Nestjs框架实战教程',
    },
    {
        name: 'Rowfish使用教程',
        image: require('@site/static/custom/rowfish-thumbnail.png').default,
        href: '/docs/rowfish/overview',
        color: 'danger',
        status: 1,
        description: 'Rowfish及Pro插件的使用教程',
    },
    {
        name: 'Go语言入门指南',
        image: 'https://pic.pincman.com/media/202206231616455.png',
        href: '/docs/golang-guides/overview',
        status: 1,
        description: '快速全方位的掌握Golang的基础知识,为进阶打好基础',
    },
    {
        name: 'TailwindCSS食用指南',
        image: 'https://pic.pincman.com/media/202206231608208.png',
        href: '/docs/tailwind-guides',
        status: 1,
        description: 'TailwindCSS的深度使用教程',
    },
];
