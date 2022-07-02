import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { ThemeClassNames, useAnnouncementBar, useScrollPosition } from '@docusaurus/theme-common';

import type { Props } from '@theme/DocSidebar/Desktop/Content';

import styles from './content.module.css';
import { DocSidebarItems } from './items';

function useShowAnnouncementBar() {
    const { isActive } = useAnnouncementBar();
    const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);

    useScrollPosition(
        ({ scrollY }) => {
            if (isActive) {
                setShowAnnouncementBar(scrollY === 0);
            }
        },
        [isActive],
    );
    return isActive && showAnnouncementBar;
}
export const DocSidebarDesktopContent: FC<Props> = ({ path, sidebar, className }) => {
    const showAnnouncementBar = useShowAnnouncementBar();

    return (
        <nav
            className={clsx(
                'menu thin-scrollbar',
                styles.menu,
                showAnnouncementBar && styles.menuWithAnnouncementBar,
                className,
            )}
        >
            <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
                <DocSidebarItems items={sidebar} activePath={path} level={1} />
            </ul>
        </nav>
    );
};
