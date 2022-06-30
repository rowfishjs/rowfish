import React, { FC, ReactNode, useMemo } from 'react';
import type { Props } from '@theme/BlogPostPaginator';
import Link from '@docusaurus/Link';
import ReactTooltip from 'react-tooltip';
import RightArrow from '@ricons/material/KeyboardDoubleArrowRightRound';
import LeftArrow from '@ricons/material/KeyboardDoubleArrowLeftRound';
import ReactDOMServer from 'react-dom/server';

interface LinkType {
    item: { readonly title: string; readonly permalink: string };
    info: ReactNode;
    type: 'prev' | 'next';
    titleContent: boolean;
}
type PagniProps = Props & {
    aria?: string;
    titleContent?: boolean;
    info: {
        prev: ReactNode;
        next: ReactNode;
    };
};
const PageLink: FC<LinkType> = ({ item, info, type, titleContent }) => {
    const icon = useMemo(() => (type === 'next' ? <RightArrow /> : <LeftArrow />), [type]);
    return (
        <>
            <Link
                data-html
                className="tw-ghostBtn tw-flex tw-w-28"
                data-tip={ReactDOMServer.renderToString(<span>{item.title}</span>)}
                data-for="pagi-name"
                to={item.permalink}
            >
                {type !== 'next' && (
                    <span className="tw-ghost-icon">
                        <span className="xicon">{icon}</span>
                    </span>
                )}
                <span className="tw-ellips tw-flex-auto !tw-inline-block tw-text-center">
                    {titleContent ? item.title : info}
                </span>
                {type === 'next' && (
                    <span className="tw-ghost-icon tw-ghost-icon-right">
                        <span className="xicon">{icon}</span>
                    </span>
                )}
            </Link>
        </>
    );
};
export const Paginator: FC<PagniProps> = (props) => {
    const { nextItem, prevItem, info, aria, titleContent = false } = props;
    return (
        <nav className="tw-flex tw-py-2 tw-mt-4 tw-justify-between tw-flex-wrap" aria-label={aria}>
            {prevItem && (
                <PageLink
                    item={prevItem}
                    titleContent={titleContent}
                    type="prev"
                    info={info.prev}
                />
            )}
            {nextItem && (
                <PageLink
                    item={nextItem}
                    titleContent={titleContent}
                    type="next"
                    info={info.next}
                />
            )}
            <ReactTooltip id="pagi-name" type="dark" effect="float" />
        </nav>
    );
};
