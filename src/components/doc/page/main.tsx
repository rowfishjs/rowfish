import React, { FC } from 'react';

import { useDocsSidebar } from '@docusaurus/theme-common';

import clsx from 'clsx';

import type { Props } from '@theme/DocPage/Layout/Main';

import styles from './style.module.css';

export const DocPageLayoutMain: FC<Props> = ({ hiddenSidebarContainer, children }) => {
    const sidebar = useDocsSidebar();
    return (
        <main
            className={clsx(
                styles.docMainContainer,
                (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced,
            )}
        >
            <div
                className={clsx(
                    'container',
                    styles.docItemWrapper,
                    hiddenSidebarContainer && styles.docItemWrapperEnhanced,
                )}
            >
                {children}
            </div>
        </main>
    );
};
