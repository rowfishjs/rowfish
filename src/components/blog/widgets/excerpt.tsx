import React, { FC, useEffect } from 'react';
import UserIcon from '@ricons/carbon/User';

import { Author } from '@docusaurus/plugin-content-blog';
import DateIcon from '@ricons/material/DateRangeRound';
import Link from '@docusaurus/Link';
import TagsIcon from '@ricons/antd/TagsOutlined';
import CommentIcon from '@ricons/fluent/Comment20Regular';
import ViewIcon from '@ricons/fluent/Eye24Regular';

import { commentCount, pageviewCount } from '@waline/client';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import $styles from './excerpt.module.css';

interface Props {
    authors: Author[];
    date: string;
    formattedDate: string;
    pathname: string;
    isList?: boolean;
    enableComment?: boolean;
}
export const MainExcerpt: FC<Props> = ({
    authors = [],
    date,
    enableComment = true,
    formattedDate,
    isList = false,
    pathname,
}) => {
    useEffect(() => {
        if (isList && ExecutionEnvironment.canUseDOM && enableComment) {
            pageviewCount({
                serverURL: 'https://comment.pincman.com',
                path: pathname,
                update: false,
            });
            commentCount({
                serverURL: 'https://comment.pincman.com',
                path: pathname,
            });
        }
    }, [isList, enableComment]);
    return (
        <div className={$styles.excerpt}>
            {authors.length > 0 && (
                <div className={$styles.meta}>
                    <span className={$styles.icon}>
                        <span className="xicon">
                            <UserIcon />
                        </span>
                    </span>
                    <span className="tw-ellips">{authors[0].name}</span>
                </div>
            )}
            <div className={$styles.meta}>
                <span className={$styles.icon}>
                    <span className="xicon">
                        <DateIcon />
                    </span>
                </span>

                <time className="tw-ellips" dateTime={date} itemProp="datePublished">
                    {formattedDate}
                </time>
            </div>
            {enableComment && (
                <div className={$styles.meta}>
                    <span className={$styles.icon}>
                        <span className="xicon">
                            <ViewIcon />
                        </span>
                    </span>
                    <span className="tw-ellips">
                        <span id={pathname} className="waline-pageview-count" /> 次阅读
                    </span>
                </div>
            )}
            {enableComment && (
                <a className={$styles.meta} href="#comment">
                    <span className={$styles.icon}>
                        <span className="xicon">
                            <CommentIcon />
                        </span>
                    </span>
                    <span className="tw-ellips">
                        <span id={pathname} className="waline-comment-count" />
                        条评论
                    </span>
                </a>
            )}
        </div>
    );
};

export const TagsExcept: FC<{
    data: readonly {
        readonly label: string;
        readonly permalink: string;
    }[];
}> = ({ data }) => {
    return (
        <div className={`${$styles.meta} tw-mr-0 tw-mt-2 tw-ellips`}>
            <span className={$styles.icon}>
                <span className="xicon">
                    <TagsIcon />
                </span>
            </span>
            <div className="blogPostTags tw-ml-1">
                {data.map(({ label, permalink: tagLink }, index) => (
                    <Link href={tagLink} key={index.toFixed()}>
                        <span>{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
