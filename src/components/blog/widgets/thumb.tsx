/* eslint-disable unused-imports/no-unused-vars */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import EditThisPage from '@theme/EditThisPage';
import type { Props } from '@theme/BlogPostItem';
import Image from '@theme/IdealImage';
import { isNil } from 'lodash-es';

import { randomIntFrom } from '@site/src/utils';

import MDXContent from '@theme/MDXContent';

import styles from './thumb.module.css';
import { MainExcerpt, TagsExcept } from './excerpt';

const bgImages = [
    '/images/bg/blog/1.jpg',
    '/images/bg/blog/2.jpg',
    '/images/bg/blog/3.jpg',
    '/images/bg/blog/4.jpg',
    '/images/bg/blog/6.jpg',
    '/images/bg/blog/6.jpg',
    '/images/bg/blog/7.jpg',
];
const blockIcons = [
    'note',
    'game',
    'edit',
    'book',
    'window',
    'image',
    'driver',
    'link',
    'palette',
    'lock',
];
export const BlogThumb: FC<Props> = (props) => {
    const { children, frontMatter, assets, metadata, truncated, isBlogPostPage = false } = props;
    const { date, formattedDate, permalink, tags, title, editUrl, authors } = metadata;
    const {
        rf_summary: summary,
        rf_icon: metaIcon,
        rf_type: rfType = 'icon',
        image: metaImage,
        rf_comment: enableComment = true,
        rf_excerpt: enableExcerpt = true,
    } = frontMatter as any;
    const [image, setImage] = useState(assets.image ?? metaImage);
    const [bgPosition, setBgPostion] = useState<number | undefined>();
    const [icon, setIcon] = useState<string | undefined>();
    const [postType, setPostType] = useState<'image' | undefined>(undefined);
    const tagsExists = tags.length > 0;
    const TitleHeading = isBlogPostPage ? 'h1' : 'h2';
    useEffect(() => {
        setPostType(() => (rfType === 'image' ? 'image' : undefined));
    }, [rfType]);
    useEffect(() => {
        if (postType !== 'image') return;
        if (isNil(image)) setImage(bgImages[randomIntFrom(0, 6)]);
    }, [image, postType]);
    useEffect(() => {
        if (postType === 'image') return;
        if (isNil(metaIcon)) {
            setBgPostion(randomIntFrom(0, 6) * -40);
            return;
        }
        if (blockIcons.includes(metaIcon)) {
            setBgPostion(blockIcons.indexOf(metaIcon) * -40);
            return;
        }
        setIcon(metaIcon);
    }, [metaIcon, postType]);
    return (
        <article
            className={clsx('tw-panel', styles.blogBlock, {
                [styles.image]: postType === 'image',
            })}
            itemProp="blogPost"
            itemScope
            itemType="http://schema.org/BlogPosting"
        >
            {postType === 'image' && image && <Image img={image} />}
            <div className={styles.wrapper}>
                {postType !== 'image' && (
                    <div
                        className={clsx(styles.blogIcon)}
                        style={{
                            backgroundImage: `url('/images/icons/blog-icons.png')`,
                            backgroundPositionY: !isNil(bgPosition) ? `${bgPosition}px` : undefined,
                        }}
                    >
                        {!isNil(icon) && icon}
                    </div>
                )}
                <header>
                    <Link itemProp="url" to={permalink}>
                        <TitleHeading itemProp="headline" className="tw-animate-decoration">
                            {title}
                        </TitleHeading>
                    </Link>
                    {tagsExists && postType !== 'image' && <TagsExcept data={tags} />}
                    {postType === 'image' && !isNil(summary) && (
                        <div
                            className={styles.content}
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                                __html: summary,
                            }}
                        />
                    )}
                </header>

                {postType !== 'image' && (
                    <>
                        <div className={styles.content}>
                            {!isNil(summary) ? (
                                <div
                                    className={styles.content}
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                        __html: summary,
                                    }}
                                />
                            ) : (
                                <div className="markdown" itemProp="articleBody">
                                    <MDXContent>{children}</MDXContent>
                                </div>
                            )}
                        </div>
                        <div className={styles.divide} />
                    </>
                )}

                <footer>
                    {enableExcerpt && (
                        <MainExcerpt
                            authors={authors}
                            date={date}
                            formattedDate={formattedDate}
                            pathname={permalink}
                            enableComment={enableComment}
                            isList
                        />
                    )}
                    {isBlogPostPage && editUrl && (
                        <div className="col margin-top--sm">
                            <EditThisPage editUrl={editUrl} />
                        </div>
                    )}
                </footer>
            </div>
        </article>
    );
};
