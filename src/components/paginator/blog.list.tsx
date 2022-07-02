import React, { FC } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import type { Props } from '@theme/BlogListPaginator';
import Link from '@docusaurus/Link';
import RightArrow from '@ricons/material/KeyboardDoubleArrowRightRound';
import LeftArrow from '@ricons/material/KeyboardDoubleArrowLeftRound';

export const BlogListPaginator: FC<Props> = (props) => {
    const { metadata } = props;
    const { previousPage, nextPage } = metadata;

    return (
        <nav
            className="tw-flex tw-py-2 tw-mt-4 tw-justify-between tw-flex-wrap"
            aria-label={translate({
                id: 'theme.blog.paginator.navAriaLabel',
                message: 'Blog list page navigation',
                description: 'The ARIA label for the blog pagination',
            })}
        >
            {previousPage && (
                <Link className="tw-ghostBtn tw-flex tw-w-28 tw-ml-auto" to={previousPage}>
                    <span className="tw-ellips tw-flex-auto !tw-inline-block tw-text-center">
                        <Translate
                            id="theme.blog.paginator.newerEntries"
                            description="The label used to navigate to the newer blog posts page (previous page)"
                        >
                            Newer Entries
                        </Translate>
                    </span>
                    <span className="tw-ghost-icon">
                        <span className="xicon">
                            <RightArrow />
                        </span>
                    </span>
                </Link>
            )}
            {nextPage && (
                <Link className="tw-ghostBtn tw-flex tw-w-28" to={nextPage}>
                    <span className="tw-ellips tw-flex-auto !tw-inline-block tw-text-center">
                        <Translate
                            id="theme.blog.paginator.olderEntries"
                            description="The label used to navigate to the older blog posts page (next page)"
                        >
                            Older Entries
                        </Translate>
                    </span>
                    <span className="tw-ghost-icon tw-ghost-icon-right">
                        <span className="xicon">
                            <LeftArrow />
                        </span>
                    </span>
                </Link>
            )}
        </nav>
    );
};
