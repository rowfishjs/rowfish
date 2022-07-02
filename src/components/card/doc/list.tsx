import React from 'react';

import DocCard from '@theme/DocCard';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import { findFirstCategoryLink } from '@docusaurus/theme-common';

// Filter categories that don't have a link.
function filterItems(items: PropSidebarItem[]): PropSidebarItem[] {
    return items.filter((item) => {
        if (item.type === 'category') {
            return !!findFirstCategoryLink(item);
        }
        return true;
    });
}

export const DocCardList = ({ items }: { items: PropSidebarItem[] }) => (
    <div className="row">
        {filterItems(items).map((item, index) => (
            <article key={index.toFixed()} className="col col--3 margin-bottom--lg">
                <DocCard key={index.toFixed()} item={item} />
            </article>
        ))}
    </div>
);
