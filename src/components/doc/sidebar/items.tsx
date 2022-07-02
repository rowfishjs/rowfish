import React, { FC, memo } from 'react';

import { DocSidebarItemsExpandedStateProvider } from '@docusaurus/theme-common';

import type { Props } from '@theme/DocSidebarItems';

import { DocSidebarItem } from './item';

// TODO this triggers whole sidebar re-renders on navigation
export const DocSidebarItems: FC<Props & { left?: number }> = ({ items, ...props }) => {
    return (
        <DocSidebarItemsExpandedStateProvider>
            {items.map((item, index) => (
                <DocSidebarItem
                    key={index.toFixed()} // sidebar is static, the index does not change
                    item={item}
                    index={index}
                    {...props}
                />
            ))}
        </DocSidebarItemsExpandedStateProvider>
    );
};

// Optimize sidebar at each "level"
export default memo(DocSidebarItems);
