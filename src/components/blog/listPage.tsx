/* eslint-disable global-require */
import React, { FC, useState } from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import type { Props } from '@theme/BlogListPage';
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';
import clsx from 'clsx';
import { Content } from '@theme/BlogPostPage';
import { useDeepCompareEffect } from 'ahooks';
import { isNil, orderBy } from 'lodash-es';
import { bannerButtons, carousels } from '@site/data/site';

import Link from '@docusaurus/Link';

import { BannerButtonType } from '@site/src/types';

import $styles from './listPage.module.css';

import { BlogPostItems } from './items';

import { Carousel } from './widgets/carousel';

function BlogListPageMetadata(props: Props): JSX.Element {
    const { metadata } = props;
    const {
        siteConfig: { title: siteTitle },
    } = useDocusaurusContext();
    const { blogDescription, blogTitle, permalink } = metadata;
    const isBlogOnlyMode = permalink === '/';
    const title = isBlogOnlyMode ? siteTitle : blogTitle;
    return (
        <>
            <PageMetadata title={title} description={blogDescription} />
            <SearchMetadata tag="blog_posts_list" />
        </>
    );
}

function BlogListPageContent(props: Props): JSX.Element {
    const { metadata, items, sidebar } = props;
    const [data, setData] = useState<{ content: Content }[]>([]);
    useDeepCompareEffect(() => {
        const noOrders = items.filter((item) => isNil((item.content.frontMatter as any).order));
        const orders = orderBy(
            items.filter((item) => !isNil((item.content.frontMatter as any).order)),
            (item) => (item.content.frontMatter as any).order,
            ['asc'],
        );
        setData([...orders, ...noOrders]);
    }, [items]);
    return (
        <BlogLayout sidebar={sidebar}>
            {carousels.length > 0 && <Carousel data={carousels} />}
            {bannerButtons.length > 0 && <BlogHomeBlocks data={bannerButtons} />}
            <div className="tw-w-full tw-flex-auto">
                <BlogPostItems
                    items={data.filter(({ content: BlogPostContent }) => {
                        const fm = BlogPostContent.frontMatter as any;
                        if (isNil(fm) || isNil(fm.rf_noloop)) return true;
                        return !fm.rf_noloop;
                    })}
                />
                <BlogListPaginator metadata={metadata} />
            </div>
        </BlogLayout>
    );
}

export const BlogHomeBlocks: FC<{ data: BannerButtonType[] }> = ({ data }) => (
    <div className={$styles.homeBanner}>
        {data.map(({ title, desc, icon: Icon, link, target }, i) => (
            <div className={$styles.bannerBtn} key={i.toFixed()}>
                <div className={$styles.bannerLeft}>
                    <span className="xicon">
                        <Icon />
                    </span>
                </div>
                <div className={$styles.bannerRight}>
                    <Link href={link} target={target ?? '_self'}>
                        <span className="tw-animate-decoration">{title}</span>
                    </Link>
                    {desc && <small>{desc}</small>}
                </div>
            </div>
        ))}
    </div>
);

const BlogListPage: FC<Props> = (props) => (
    <HtmlClassNameProvider
        className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}
    >
        <BlogListPageMetadata {...props} />
        <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
);
export default BlogListPage;
