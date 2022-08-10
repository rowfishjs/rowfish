import React, { FC, type ReactNode } from 'react';
import clsx from 'clsx';
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import { BlogPostProvider, useBlogPost } from '@docusaurus/theme-common/internal';
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata';
import TOC from '@theme/TOC';
import type { Props } from '@theme/BlogPostPage';
import type { BlogSidebar } from '@docusaurus/plugin-content-blog';

import { BlogPostPaginator } from '../paginator';

import { BlogLayout } from './layout';
import { BlogPostItem } from './item';

function BlogPostPageContent({
    sidebar,
    children,
}: {
    sidebar: BlogSidebar;
    children: ReactNode;
}): JSX.Element {
    const { metadata, toc } = useBlogPost();
    const { nextItem, prevItem, frontMatter } = metadata;
    const { rf_paginator: enablePaginator = true } = frontMatter as any;
    const {
        hide_table_of_contents: hideTableOfContents,
        toc_min_heading_level: tocMinHeadingLevel,
        toc_max_heading_level: tocMaxHeadingLevel,
    } = frontMatter;
    return (
        <BlogLayout
            sidebar={sidebar}
            toc={
                !hideTableOfContents && toc.length > 0 ? (
                    <TOC
                        toc={toc}
                        minHeadingLevel={tocMinHeadingLevel}
                        maxHeadingLevel={tocMaxHeadingLevel}
                    />
                ) : undefined
            }
        >
            <BlogPostItem>{children}</BlogPostItem>

            {enablePaginator && (nextItem || prevItem) && (
                <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
            )}
        </BlogLayout>
    );
}

const BlogPostPage: FC<Props> = (props: Props) => {
    const BlogPostContent = props.content;
    return (
        <BlogPostProvider content={props.content} isBlogPostPage>
            <HtmlClassNameProvider
                className={clsx(
                    ThemeClassNames.wrapper.blogPages,
                    ThemeClassNames.page.blogPostPage,
                )}
            >
                <BlogPostPageMetadata />
                <BlogPostPageContent sidebar={props.sidebar}>
                    <BlogPostContent />
                </BlogPostPageContent>
            </HtmlClassNameProvider>
        </BlogPostProvider>
    );
};
export default BlogPostPage;
