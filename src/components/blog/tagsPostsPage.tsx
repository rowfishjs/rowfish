import React, { FC } from 'react';

import Link from '@docusaurus/Link';
import BlogLayout from '@theme/BlogLayout';
import type { Props } from '@theme/BlogTagsPostsPage';
import Translate, { translate } from '@docusaurus/Translate';
import {
    PageMetadata,
    HtmlClassNameProvider,
    ThemeClassNames,
    usePluralForm,
} from '@docusaurus/theme-common';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import clsx from 'clsx';

import { BlogThumb } from './widgets/thumb';

// Very simple pluralization: probably good enough for now
function useBlogPostsPlural() {
    const { selectMessage } = usePluralForm();
    return (count: number) =>
        selectMessage(
            count,
            translate(
                {
                    id: 'theme.blog.post.plurals',
                    description:
                        'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
                    message: 'One post|{count} posts',
                },
                { count },
            ),
        );
}
export const BlogTagsPostsPage: FC<Props> = (props) => {
    const { tag, items, sidebar, listMetadata } = props;
    const blogPostsPlural = useBlogPostsPlural();
    const title = translate(
        {
            id: 'theme.blog.tagTitle',
            description: 'The title of the page for a blog tag',
            message: '{nPosts} tagged with "{tagName}"',
        },
        { nPosts: blogPostsPlural(tag.count), tagName: tag.label },
    );

    return (
        <HtmlClassNameProvider
            className={clsx(
                ThemeClassNames.wrapper.blogPages,
                ThemeClassNames.page.blogTagPostListPage,
            )}
        >
            <PageMetadata title={title} />
            <SearchMetadata tag="blog_tags_posts" />
            <BlogLayout sidebar={sidebar}>
                <header className="tw-mb-8">
                    <h1>{title}</h1>

                    <Link href={tag.allTagsPath}>
                        <Translate
                            id="theme.tags.tagsPageLink"
                            description="The label of the link targeting the tag list page"
                        >
                            View All Tags
                        </Translate>
                    </Link>
                </header>

                <div className="tw-w-full tw-flex-auto">
                    {items.map(({ content: BlogPostContent }) => (
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
                    <BlogListPaginator metadata={listMetadata} />
                </div>
            </BlogLayout>
        </HtmlClassNameProvider>
    );
};
