import React, { FC } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import type { Props } from '@theme/BlogPostPaginator';

import { Paginator } from './base';

export const BlogPostPaginator: FC<Props> = (props) => (
    <Paginator
        prevItem={props.nextItem}
        nextItem={props.prevItem}
        aria={translate({
            id: 'theme.blog.post.paginator.navAriaLabel',
            message: 'Blog post page navigation',
            description: 'The ARIA label for the blog posts pagination',
        })}
        info={{
            prev: (
                <Translate
                    id="theme.blog.post.paginator.olderPost"
                    description="The blog post button label to navigate to the newer/previous post"
                >
                    Older Post
                </Translate>
            ),
            next: (
                <Translate
                    id="theme.blog.post.paginator.newerPost"
                    description="The blog post button label to navigate to the newer/previous post"
                >
                    Newer Post
                </Translate>
            ),
        }}
    />
);
