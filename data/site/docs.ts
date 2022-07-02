/* eslint-disable global-require */

import { CourseCardItemType } from '@site/src/types';

export const courses: CourseCardItemType[] = [
    {
        name: 'Rowfish使用教程',
        image: require('@site/static/custom/rowfish-thumbnail.png'),
        href: '/docs/rowfish/overview',
        color: 'danger',
        status: 1,
        description: 'Rowfish及Pro插件的使用教程',
    },
];
