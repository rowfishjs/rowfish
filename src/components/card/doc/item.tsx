/* eslint-disable no-nested-ternary */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { FC, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import type {
    PropSidebarItem,
    PropSidebarItemCategory,
    PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs';
import type { Props } from '@theme/DocCard';
import { findFirstCategoryLink, useDocById } from '@docusaurus/theme-common';
import clsx from 'clsx';

import isInternalUrl from '@docusaurus/isInternalUrl';
import { translate } from '@docusaurus/Translate';

import { isNil } from 'lodash-es';

import styles from './item.module.css';

const CardContainer: FC<{
    className?: string;
}> = ({ children, className }) => {
    return (
        <div className={clsx('tw-panel', styles.cardContainer, className)}>{children as any}</div>
    );
};

function CardLayout({
    href,
    icon,
    title,
    description,
    className,
    item,
}: {
    href: string;
    icon: ReactNode;
    title: string;
    description?: string;
    className?: string;
    item: PropSidebarItem;
}): JSX.Element {
    return (
        <CardContainer className={className}>
            <Link href={href} className={clsx('text--truncate', styles.cardTitle)} title={title}>
                <span className="tw-ellips tw-animate-decoration">
                    {isNil(className) && icon} {title}
                </span>
            </Link>

            {item.type !== 'category' && (
                <p className={clsx('text--truncate', styles.cardDescription)} title={description}>
                    {description}
                </p>
            )}
            {item.type === 'category' && (
                <>
                    <ul className={styles.itemList}>
                        {item.items.map(
                            (doc, i) =>
                                i < 4 &&
                                'label' in doc && (
                                    <li key={i.toFixed()}>
                                        <Link
                                            href={
                                                doc.type === 'link'
                                                    ? doc.href
                                                    : findFirstCategoryLink(doc)
                                            }
                                        >
                                            {doc.label}
                                        </Link>
                                    </li>
                                ),
                        )}
                        {item.items.length > 4 && (
                            <li>
                                <Link href={href} className={styles.cateMore}>
                                    查看全部
                                </Link>
                            </li>
                        )}
                    </ul>
                </>
            )}
        </CardContainer>
    );
}

function CardCategory({ item }: { item: PropSidebarItemCategory }): JSX.Element | null {
    const href = findFirstCategoryLink(item);
    // Unexpected: categories that don't have a link have been filtered upfront
    if (!href) {
        return null;
    }
    return (
        <CardLayout
            href={href}
            icon="🗃️"
            className={item.className}
            title={item.label}
            item={item}
            description={translate(
                {
                    message: '{count} items',
                    id: 'theme.docs.DocCard.categoryDescription',
                    description:
                        'The default description for a category card in the generated index about how many items this category includes',
                },
                { count: item.items.length },
            )}
        />
    );
}

function CardLink({ item }: { item: PropSidebarItemLink }): JSX.Element {
    const icon = isInternalUrl(item.href) ? '📄️' : '🔗';
    const doc = useDocById(item.docId ?? undefined);
    return (
        <CardLayout
            item={item}
            href={item.href}
            icon={icon}
            title={item.label}
            description={doc?.description}
        />
    );
}

export const DocCardItem: FC<Props> = ({ item }) => {
    switch (item.type) {
        case 'link':
            return <CardLink item={item} />;
        case 'category':
            return <CardCategory item={item} />;
        default:
            throw new Error(`unknown item type ${JSON.stringify(item)}`);
    }
};
