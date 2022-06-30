import React, { FC, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import {
    isActiveSidebarItem,
    usePrevious,
    Collapsible,
    useCollapsible,
    findFirstCategoryLink,
    ThemeClassNames,
    useThemeConfig,
    useDocSidebarItemsExpandedState,
    isSamePath,
} from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { translate } from '@docusaurus/Translate';

import type { Props } from '@theme/DocSidebarItem';
import type { PropSidebarItemCategory, PropSidebarItemLink } from '@docusaurus/plugin-content-docs';

import useIsBrowser from '@docusaurus/useIsBrowser';
import type { SidebarItemHtml } from '@docusaurus/plugin-content-docs/src/sidebars/types';

import LinkIcon from '@ricons/carbon/Link';

import styles from './item.module.css';
import { DocSidebarItems } from './items';

export const DocSidebarItem: FC<Props & { left?: number }> = ({ item, left = 16, ...props }) => {
    switch (item.type) {
        case 'category':
            return <DocSidebarItemCategory item={item} left={left} {...props} />;
        case 'html':
            return <DocSidebarItemHtml left={left} item={item} {...props} />;
        case 'link':
        default:
            return <DocSidebarItemLink item={item} left={left} {...props} />;
    }
};

// If we navigate to a category and it becomes active, it should automatically
// expand itself
function useAutoExpandActiveCategory({
    isActive,
    collapsed,
    setCollapsed,
}: {
    isActive: boolean;
    collapsed: boolean;
    setCollapsed: (b: boolean) => void;
}) {
    const wasActive = usePrevious(isActive);
    useEffect(() => {
        const justBecameActive = isActive && !wasActive;
        if (justBecameActive && collapsed) {
            setCollapsed(false);
        }
    }, [isActive, wasActive, collapsed, setCollapsed]);
}

/**
 * When a collapsible category has no link, we still link it to its first child
 * during SSR as a temporary fallback. This allows to be able to navigate inside
 * the category even when JS fails to load, is delayed or simply disabled
 * React hydration becomes an optional progressive enhancement
 * see https://github.com/facebookincubator/infima/issues/36#issuecomment-772543188
 * see https://github.com/facebook/docusaurus/issues/3030
 */
function useCategoryHrefWithSSRFallback(item: PropSidebarItemCategory): string | undefined {
    const isBrowser = useIsBrowser();
    return useMemo(() => {
        if (item.href) {
            return item.href;
        }
        // In these cases, it's not necessary to render a fallback
        // We skip the "findFirstCategoryLink" computation
        if (isBrowser || !item.collapsible) {
            return undefined;
        }
        return findFirstCategoryLink(item);
    }, [item, isBrowser]);
}

function DocSidebarItemCategory({
    item,
    onItemClick,
    activePath,
    level,
    index,
    left = 16,
    ...props
}: Props & { left: number; item: PropSidebarItemCategory }) {
    const { items, label, collapsible, className, href } = item;
    const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item);

    const isActive = isActiveSidebarItem(item, activePath);
    const isCurrentPage = isSamePath(href, activePath);

    const { collapsed, setCollapsed } = useCollapsible({
        // active categories are always initialized as expanded
        // the default (item.collapsed) is only used for non-active categories
        initialState: () => {
            if (!collapsible) {
                return false;
            }
            return isActive ? false : item.collapsed;
        },
    });

    useAutoExpandActiveCategory({ isActive, collapsed, setCollapsed });
    const { expandedItem, setExpandedItem } = useDocSidebarItemsExpandedState();
    function updateCollapsed(toCollapsed = !collapsed) {
        setExpandedItem(toCollapsed ? null : index);
        setCollapsed(toCollapsed);
    }
    const {
        docs: {
            sidebar: { autoCollapseCategories },
        },
    } = useThemeConfig();
    useEffect(() => {
        if (collapsible && expandedItem && expandedItem !== index && autoCollapseCategories) {
            setCollapsed(true);
        }
    }, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories]);

    return (
        <li
            className={clsx(
                ThemeClassNames.docs.docSidebarItemCategory,
                ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
                'menu__list-item',
                {
                    'menu__list-item--collapsed': collapsed,
                },
                className,
            )}
        >
            <div
                className={clsx('menu__list-item-collapsible', {
                    'menu__list-item-collapsible--active': isCurrentPage,
                })}
            >
                <Link
                    style={{ paddingLeft: `${left}px` }}
                    className={clsx('menu__link', {
                        'menu__link--sublist': collapsible,
                        'menu__link--sublist-caret': !href,
                        'menu__link--active': isActive,
                    })}
                    onClick={
                        collapsible
                            ? (e) => {
                                  onItemClick?.(item);
                                  if (href) {
                                      updateCollapsed(false);
                                  } else {
                                      e.preventDefault();
                                      updateCollapsed();
                                  }
                              }
                            : () => {
                                  onItemClick?.(item);
                              }
                    }
                    aria-current={isCurrentPage ? 'page' : undefined}
                    href={collapsible ? hrefWithSSRFallback ?? '#' : hrefWithSSRFallback}
                    {...props}
                >
                    {label}
                </Link>
                {href && collapsible && (
                    <button
                        aria-label={translate(
                            {
                                id: 'theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel',
                                message: "Toggle the collapsible sidebar category '{label}'",
                                description:
                                    'The ARIA label to toggle the collapsible sidebar category',
                            },
                            { label },
                        )}
                        type="button"
                        className="clean-btn menu__caret"
                        onClick={(e) => {
                            e.preventDefault();
                            updateCollapsed();
                        }}
                    />
                )}
            </div>

            <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
                <DocSidebarItems
                    items={items}
                    tabIndex={collapsed ? -1 : 0}
                    onItemClick={onItemClick}
                    activePath={activePath}
                    level={level + 1}
                    left={left + 16}
                />
            </Collapsible>
        </li>
    );
}

function DocSidebarItemHtml({
    item,
    level,
    index,
    left = 16,
}: Props & { left: number; item: SidebarItemHtml }) {
    const { value, defaultStyle, className } = item;
    return (
        <li
            style={{ paddingLeft: `${left}px` }}
            className={clsx(
                ThemeClassNames.docs.docSidebarItemLink,
                ThemeClassNames.docs.docSidebarItemLinkLevel(level),
                defaultStyle && `${styles.menuHtmlItem} menu__list-item`,
                className,
            )}
            key={index}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
                __html: value,
            }}
        />
    );
}

function DocSidebarItemLink({
    item,
    onItemClick,
    activePath,
    level,
    index,
    left = 16,
    ...props
}: Props & { left: number; item: PropSidebarItemLink }) {
    const { href, label, className } = item;
    const isActive = isActiveSidebarItem(item, activePath);
    return (
        <li
            className={clsx(
                ThemeClassNames.docs.docSidebarItemLink,
                ThemeClassNames.docs.docSidebarItemLinkLevel(level),
                'menu__list-item',
                {
                    'menu__list-item--active': isActive,
                },
                className,
            )}
            key={label}
        >
            <Link
                style={{ paddingLeft: `${left}px` }}
                className={clsx(
                    'menu__link',
                    {
                        'menu__link--active': isActive,
                    },
                    'tw-w-full',
                )}
                aria-current={isActive ? 'page' : undefined}
                to={href}
                {...(isInternalUrl(href) && {
                    onClick: onItemClick ? () => onItemClick(item) : undefined,
                })}
                {...props}
            >
                {isInternalUrl(href) ? (
                    label
                ) : (
                    <span className="tw-inline-flex tw-w-full tw-justify-between tw-items-center tw-h-full">
                        <span className="tw-flex-auto">{label}</span>
                        <span className="xicon tw-w-[0.875rem] tw-h-[0.875rem]">
                            <LinkIcon className=" tw-w-[0.875rem] tw-h-[0.875rem]" />
                        </span>
                    </span>
                )}
            </Link>
        </li>
    );
}
