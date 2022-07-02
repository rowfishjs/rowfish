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

import { carousels } from '@site/data/site';

import { BlogThumb } from './widgets/thumb';
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
            <div className="tw-w-full tw-flex-auto">
                {data
                    .filter(({ content: BlogPostContent }) => {
                        const fm = BlogPostContent.frontMatter as any;
                        if (isNil(fm) || isNil(fm.rf_noloop)) return true;
                        return !fm.rf_noloop;
                    })
                    .map(({ content: BlogPostContent }) => (
                        <BlogThumb
                            key={BlogPostContent.metadata.permalink}
                            frontMatter={BlogPostContent.frontMatter}
                            assets={BlogPostContent.assets}
                            metadata={BlogPostContent.metadata}
                            truncated={BlogPostContent.metadata.truncated}
                        >
                            <BlogPostContent />
                        </BlogThumb>
                    ))}
                <BlogListPaginator metadata={metadata} />
            </div>
        </BlogLayout>
    );
}
export const BlogListPage: FC<Props> = (props) => {
    return (
        <HtmlClassNameProvider
            className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}
        >
            <BlogListPageMetadata {...props} />
            <BlogListPageContent {...props} />
        </HtmlClassNameProvider>
    );
};
