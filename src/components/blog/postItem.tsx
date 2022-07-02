/* eslint-disable global-require */
/* eslint-disable unused-imports/no-unused-vars */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { useLocalPathname, usePluralForm } from '@docusaurus/theme-common';
import { blogPostContainerID } from '@docusaurus/utils-common';
import MDXContent from '@theme/MDXContent';
import EditThisPage from '@theme/EditThisPage';
import type { Props } from '@theme/BlogPostItem';

import { isNil } from 'lodash-es';

import '@waline/client/dist/waline.css';
import { randomIntFrom } from '@site/src/utils';

import Image from '@theme/IdealImage';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import { init } from '@waline/client';

import styles from './post-item.module.css';
import { MainExcerpt, TagsExcept } from './widgets/excerpt';

const bgImages = [
    '/images/bg/blog/1.jpg',
    '/images/bg/blog/2.jpg',
    '/images/bg/blog/3.jpg',
    '/images/bg/blog/4.jpg',
    '/images/bg/blog/6.jpg',
    '/images/bg/blog/6.jpg',
    '/images/bg/blog/7.jpg',
];
// Very simple pluralization: probably good enough for now
function useReadingTimePlural() {
    const { selectMessage } = usePluralForm();
    return (readingTimeFloat: number) => {
        const readingTime = Math.ceil(readingTimeFloat);
        return selectMessage(
            readingTime,
            translate(
                {
                    id: 'theme.blog.post.readingTime.plurals',
                    description:
                        'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
                    message: 'One min read|{readingTime} min read',
                },
                { readingTime },
            ),
        );
    };
}

export const BlogPostItem: FC<Props> = (props) => {
    const readingTimePlural = useReadingTimePlural();
    const { withBaseUrl } = useBaseUrlUtils();
    const { children, frontMatter, assets, metadata, truncated, isBlogPostPage = false } = props;
    const { date, formattedDate, permalink, tags, readingTime, title, editUrl, authors } = metadata;
    const {
        rf_banner: headerImg,
        image: metaImage,
        rf_comment: enableComment = true,
        rf_excerpt: enableExcerpt = true,
    } = frontMatter as any;
    const [image, setImage] = useState(assets.image ?? metaImage);
    const truncatedPost = !isBlogPostPage && truncated;
    const tagsExists = tags.length > 0;
    const TitleHeading = isBlogPostPage ? 'h1' : 'h2';
    const pathname = useLocalPathname();
    useEffect(() => {
        if (headerImg !== true) setImage(null);
        else setImage(isNil(image) ? bgImages[randomIntFrom(0, 6)] : image);
    }, [image, headerImg]);
    useEffect(() => {
        let waline: any = null;
        if (ExecutionEnvironment.canUseDOM && enableComment) {
            waline = init({
                el: '#comment',
                serverURL: 'https://comment.pincman.com',
                dark: 'html[data-theme="dark"]',
                copyright: false,
                comment: true,
                pageview: true,
                pageSize: 8,
                path: pathname,
            });
        }
        return () => {
            if (waline && enableComment) waline.destroy();
        };
    }, [enableComment]);
    return (
        <>
            <article
                className={clsx('tw-panel', styles.main, { '!tw-pt-0': headerImg })}
                itemProp="blogPost"
                itemScope
                itemType="http://schema.org/BlogPosting"
            >
                {headerImg && (
                    <div className={styles.headerImg}>
                        <Image img={image} />
                    </div>
                )}
                <header>
                    <TitleHeading className={styles.title} itemProp="headline">
                        {title}
                    </TitleHeading>
                    {tagsExists && (
                        <div className="tw-mb-2">
                            <TagsExcept data={tags} />
                        </div>
                    )}
                    <div className="tw-w-full tw-mb-6">
                        {enableExcerpt && (
                            <MainExcerpt
                                authors={authors}
                                date={date}
                                formattedDate={formattedDate}
                                pathname={pathname}
                                enableComment={enableComment}
                            />
                        )}
                    </div>
                </header>

                <div
                    // This ID is used for the feed generation to locate the main content
                    id={isBlogPostPage ? blogPostContainerID : undefined}
                    className={clsx('markdown', styles.content)}
                    itemProp="articleBody"
                >
                    <MDXContent>{children}</MDXContent>
                </div>
                <footer
                    className={clsx(
                        'row docusaurus-mt-lg',
                        isBlogPostPage && styles.blogPostDetailsFull,
                    )}
                >
                    {(tagsExists || truncated) && isBlogPostPage && editUrl && (
                        <div className="col margin-top--sm">
                            <EditThisPage editUrl={editUrl} />
                        </div>
                    )}
                </footer>
            </article>
            <div id="comment" />
        </>
    );
};
