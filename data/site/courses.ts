/* eslint-disable global-require */

import { CourseCardItemType } from '@site/src/types';

export const courses: CourseCardItemType[] = [
    {
        name: 'Nestjs最佳实践',
        image: require('./images/courses/nestjs-best-practise.png'),
        href: '/docs/courses/nestjs-practise',
        isFree: false,
        price: 899,
        color: 'success',
        status: 1,
        description: '最好的Nestjs框架实战教程',
    },
    {
        name: 'React18最佳实践',
        image: require('./images/courses/react-bese-practise.png'),
        href: '/docs/courses/react18-practise',
        isFree: false,
        price: 699,
        color: 'success',
        status: 0,
        description: '最好的react 18+实战教程',
    },
    {
        name: 'Go语言入门指南',
        image: require('./images/courses/golang-base-guide.png'),
        href: '/docs/courses/golang-guides/get-start',
        status: 1,
        description: '快速全方位的掌握Golang的基础知识,为进阶打好基础',
    },
    {
        name: 'TailwindCSS食用指南',
        image: require('./images/courses/tailwindcss-guide.png'),
        href: '/docs/courses/tailwind-guides',
        status: 1,
        description: 'TailwindCSS的深度使用教程',
    },
];
