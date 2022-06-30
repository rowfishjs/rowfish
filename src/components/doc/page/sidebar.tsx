import React, { type ReactNode, useState, useCallback, FC } from 'react';
import { useLocation } from '@docusaurus/router';
import type { Props } from '@theme/DocPage/Layout/Sidebar';

import clsx from 'clsx';

import { ThemeClassNames, useDocsSidebar } from '@docusaurus/theme-common';

import { DocSidebar } from '../sidebar';

import styles from './style.module.css';
import { DocPageLayoutSidebarExpandButton } from './expandButton';

// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({ children }: { children: ReactNode }) {
    const sidebar = useDocsSidebar();
    return <React.Fragment key={sidebar?.name ?? 'noSidebar'}>{children}</React.Fragment>;
}

export const DocPageLayoutSidebar: FC<Props> = ({
    sidebar,
    hiddenSidebarContainer,
    setHiddenSidebarContainer,
}) => {
    const { pathname } = useLocation();

    const [hiddenSidebar, setHiddenSidebar] = useState(false);
    const toggleSidebar = useCallback(() => {
        if (hiddenSidebar) {
            setHiddenSidebar(false);
        }
        setHiddenSidebarContainer((value) => !value);
    }, [setHiddenSidebarContainer, hiddenSidebar]);

    return (
        <aside
            className={clsx(
                ThemeClassNames.docs.docSidebarContainer,
                styles.docSidebarContainer,
                hiddenSidebarContainer && styles.docSidebarContainerHidden,
            )}
            onTransitionEnd={(e) => {
                if (!e.currentTarget.classList.contains(styles.docSidebarContainer!)) {
                    return;
                }

                if (hiddenSidebarContainer) {
                    setHiddenSidebar(true);
                }
            }}
        >
            <ResetOnSidebarChange>
                <DocSidebar
                    sidebar={sidebar}
                    path={pathname}
                    onCollapse={toggleSidebar}
                    isHidden={hiddenSidebar}
                />
            </ResetOnSidebarChange>

            {hiddenSidebar && <DocPageLayoutSidebarExpandButton toggleSidebar={toggleSidebar} />}
        </aside>
    );
};
