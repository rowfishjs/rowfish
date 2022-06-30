import React, { FC, useEffect, useState } from 'react';

import PointIcon from '@ricons/fa/HandPointRightRegular';
import Image from '@theme/IdealImage';

import BG1 from '@site/static/images/pages/card-bg-1.jpg';
import BG2 from '@site/static/images/pages/card-bg-2.jpg';
import BG3 from '@site/static/images/pages/card-bg-3.jpg';
import BG4 from '@site/static/images/pages/card-bg-4.jpg';
import BG5 from '@site/static/images/pages/card-bg-5.jpg';
import BG6 from '@site/static/images/pages/card-bg-6.jpg';
import BG7 from '@site/static/images/pages/card-bg-7.jpg';
import { isNil } from 'lodash-es';
import { randomIntFrom } from '@site/src/utils';

import clsx from 'clsx';

import ReactDOMServer from 'react-dom/server';

import ReactTooltip from 'react-tooltip';

import Link from '@docusaurus/Link';

import { CourseCardItemType } from '@site/src/types';

import $styles from './style.module.css';

const bgImages = [BG1, BG2, BG3, BG4, BG5, BG6, BG7];

const statuses: Array<{ text: string; color: string }> = [
    { text: '策划中', color: '#10c469' },
    { text: '更新中', color: '#ff5b5b' },
    { text: '已完结', color: '#536de6' },
];
const colors: {
    [key in NonNullable<CourseCardItemType['color']>]: string;
} = {
    danger: '#ff5b5b',
    success: '#10c469',
    info: '#6c757d',
};
export const CourseCardItem: FC<{ course: CourseCardItemType; i: number }> = ({ course, i }) => {
    const [image, setImage] = useState<string>(bgImages[randomIntFrom(0, 6)]);
    useEffect(() => {
        if (!isNil(course.image)) setImage(course.image);
    }, [course.image]);
    return (
        <Link
            href={course.href}
            target={course.target ?? '_self'}
            className={clsx('card', $styles.item)}
        >
            <div className={$styles.icons}>
                <span style={{ backgroundColor: statuses[course.status ?? 0].color }}>
                    {statuses[course.status ?? 0].text}
                </span>
                <span
                    style={{
                        whiteSpace: 'nowrap',
                        fontSize: '0.75rem',
                        backgroundColor:
                            course.isFree || isNil(course.isFree) ? colors.success : colors.danger,
                    }}
                >
                    {course.isFree || isNil(course.isFree) ? '免费' : '收费'}
                </span>
            </div>
            <div className={$styles.media}>
                <Image img={image} />
            </div>
            <div className={$styles.content}>
                <h2 className={clsx($styles.title, 'tw-ellips')}>
                    {/* <Link
                        href={course.href}
                        target={course.target ?? '_self'}
                        className="tw-ellips"
                    > */}
                    <span>{course.name}</span>
                    {/* </Link> */}
                </h2>

                <div
                    data-html
                    className={clsx($styles.description, 'tw-ellips')}
                    data-for={`type-${i.toFixed()}`}
                    data-tip={ReactDOMServer.renderToString(
                        <span style={{ fontSize: '0.75rem' }}>{course.description}</span>,
                    )}
                >
                    {course.description}
                </div>
            </div>
            <ReactTooltip
                id={`type-${i.toFixed()}`}
                type="dark"
                effect="solid"
                place="top"
                aria-haspopup="true"
                backgroundColor={colors[course.color ?? 'info']}
                className="!tw-p-[0.25rem_1rem]"
            />
        </Link>
    );
};
export const CourseCards: FC<{ data: CourseCardItemType[] }> = ({ data }) => (
    <>
        <div className={clsx($styles.container)}>
            {data.map((course, i) => (
                <CourseCardItem key={i.toFixed()} course={course} i={i} />
            ))}
        </div>
        <div className="tw-mt-5 tw-text-center tw-w-full">
            <a
                className="tw-ghostBtn"
                href="https://v.pincman.com"
                target="_blank"
                rel="noreferrer"
            >
                <span className="tw-ghost-icon">
                    <span className="xicon">
                        <PointIcon />
                    </span>
                </span>
                <span className="tw-font-kaiti">学习更多高级教程</span>
            </a>
        </div>
    </>
);
