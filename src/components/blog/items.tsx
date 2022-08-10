import React, { FC } from 'react';
import { BlogPostProvider } from '@docusaurus/theme-common/internal';
// import BlogPostItem from '@theme/BlogPostItem';
import type { Props } from '@theme/BlogPostItems';

import { BlogThumb } from './widgets/thumb';

export const BlogPostItems: FC<Props> = ({
    items,
    component: BlogPostItemComponent = BlogThumb,
}) => (
    <>
        {items.map(({ content: BlogPostContent }) => (
            <BlogPostProvider key={BlogPostContent.metadata.permalink} content={BlogPostContent}>
                <BlogPostItemComponent>
                    <BlogPostContent />
                </BlogPostItemComponent>
            </BlogPostProvider>
        ))}
    </>
);
