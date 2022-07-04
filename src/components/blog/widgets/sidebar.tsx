import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useDeepCompareEffect } from 'ahooks';
import clsx from 'clsx';
import { isNil } from 'lodash-es';

import Link from '@docusaurus/Link';

import PostIcon from '@ricons/material/ArticleFilled';

import TagsIcon from '@ricons/antd/TagsFilled';
import CourseIcon from '@ricons/material/SchoolRound';
import WorkIcon from '@ricons/material/WorkspacesRound';
import Image from '@theme/IdealImage';

import { siteData, courses, works } from '@site/data/site';

import { CourseCardItemType, WorkCardItemType } from '@site/src/types';

import { PostItem, TagItem } from './types';

import $styles from './sidebar.module.css';

const BLogSidebarOwner: FC = () => {
    if (isNil(siteData.owner)) return null;
    return (
        <div className={clsx('blogBlock', $styles.owner)}>
            <div />
            {!isNil(siteData.owner.avatar) && (
                <div className={$styles.ownerAvatar}>
                    <Image img={siteData.owner.avatar} />
                </div>
            )}
            {!isNil(siteData.owner.signature) && (
                <div>
                    <i>{siteData.owner.signature}</i>
                </div>
            )}
        </div>
    );
};
const BlogSidebarRecentItem: FC<PostItem> = ({ title, permalink }) => {
    return (
        <Link className="tw-ellips tw-animate-decoration" href={permalink}>
            <span>{title}</span>
        </Link>
    );
};
const BlogSidebarRecent: FC<{ posts: PostItem[] }> = ({ posts }) => {
    return (
        <div className={clsx('blogBlock', $styles.posts)}>
            <div className="blogBlockTitle">
                <span>
                    <span className="xicon">
                        <PostIcon />
                    </span>
                </span>
                <span>新文</span>
            </div>
            <div className={$styles.postsContent}>
                {posts.map(
                    (item, i) => i < 5 && <BlogSidebarRecentItem {...item} key={i.toFixed()} />,
                )}
            </div>
        </div>
    );
};

const BlogSidebarCourses: FC<{ data: CourseCardItemType[] }> = ({ data }) => {
    return (
        <div className={clsx('blogBlock', $styles.courses)}>
            <div className="blogBlockTitle">
                <span>
                    <span className="xicon">
                        <CourseIcon />
                    </span>
                </span>
                <span>新课</span>
            </div>
            <div className={$styles.coursesContent}>
                {data.map(
                    ({ name, href, target, image, description }, i) =>
                        !isNil(image) &&
                        i < 4 && (
                            <div className={$styles.courseItem} key={i.toFixed()}>
                                <Link href={href} target={target ?? '_self'}>
                                    <Image img={image} />
                                </Link>
                                <div className={$styles.courseBody}>
                                    <Link
                                        href={href}
                                        target={target ?? '_self'}
                                        className={`${$styles.courseTitle} tw-ellips tw-animate-decoration`}
                                    >
                                        <span>{name}</span>
                                    </Link>
                                    <p className={$styles.courseDesc}>{description}</p>
                                </div>
                            </div>
                        ),
                )}
            </div>
        </div>
    );
};

const BlogSidebarWorks: FC<{ data: WorkCardItemType[] }> = ({ data }) => {
    return (
        <div className={clsx('blogBlock', $styles.courses)}>
            <div className="blogBlockTitle">
                <span>
                    <span className="xicon">
                        <WorkIcon />
                    </span>
                </span>
                <span>新作</span>
            </div>
            <div className={$styles.coursesContent}>
                {data.map(
                    ({ name, link, target, img, desc }, i) =>
                        !isNil(img) &&
                        i < 4 && (
                            <div className={$styles.courseItem} key={i.toFixed()}>
                                <Link href={link} target={target ?? '_self'}>
                                    <Image img={img} />
                                </Link>
                                <div className={$styles.courseBody}>
                                    <Link
                                        href={link}
                                        target={target ?? '_self'}
                                        className={`${$styles.courseTitle} tw-ellips tw-animate-decoration`}
                                    >
                                        <span>{name}</span>
                                    </Link>
                                    <p className={$styles.courseDesc}>{desc}</p>
                                </div>
                            </div>
                        ),
                )}
            </div>
        </div>
    );
};

const BlogSidebarTags: FC = () => {
    const globalData = usePluginData('docusaurus-plugin-content-blog', 'default') as any;
    const [tags, setTags] = useState<TagItem[]>([]);
    useDeepCompareEffect(() => {
        const tagArr: TagItem[] = [];
        if (!isNil(globalData) && !isNil(globalData.tags)) {
            for (const key in globalData.tags) {
                tagArr.push(globalData.tags[key]);
            }
            setTags(tagArr);
        }
    }, [globalData]);
    if (tags.length <= 0) return null;
    return (
        <div className={clsx('blogBlock', $styles.tags)}>
            <div className="blogBlockTitle">
                <span>
                    <span className="xicon">
                        <TagsIcon />
                    </span>
                </span>
                <span>标签</span>
            </div>
            <div className={clsx('blogPostTags', $styles.tagsContent)}>
                {tags.map((item, i) => (
                    <Link href={item.permalink} key={i.toFixed()}>
                        <span>{(item as any).label}</span>
                        <span className="tagItemsCount">{item.items.length}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
export const BlogSidebar: FC<{ toc?: ReactNode; posts?: PostItem[] }> = ({ toc, posts = [] }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    // const blogData = usePluginData('docusaurus-plugin-content-blog', 'default') as any;
    // const baseUrl = useBaseUrl(blogData.route);
    useEffect(() => {}, [ref.current]);
    return (
        <div ref={ref} className="tw-sticky tw-top-10">
            <BLogSidebarOwner />
            {toc}
            <BlogSidebarTags />
            <BlogSidebarCourses data={courses} />
            <BlogSidebarWorks data={works} />
            <BlogSidebarRecent posts={posts} />
        </div>
    );
};
