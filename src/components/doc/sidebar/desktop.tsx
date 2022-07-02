import React from 'react';
import clsx from 'clsx';
import { useThemeConfig } from '@docusaurus/theme-common';
import Logo from '@theme/Logo';

import type { Props } from '@theme/DocSidebar/Desktop';

import styles from './desktop.module.css';
import { CollapseButton } from './collapseButton';
import { DocSidebarDesktopContent } from './content';

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }: Props) {
    const {
        navbar: { hideOnScroll },
        docs: {
            sidebar: { hideable },
        },
    } = useThemeConfig();
    return (
        <div
            className={clsx(
                styles.sidebar,
                hideOnScroll && styles.sidebarWithHideableNavbar,
                isHidden && styles.sidebarHidden,
                [
                    'tw-shadow-sm',
                    'tw-shadow-neutral-800/20',
                    'dark:tw-shadow-neutral-50/20',
                    'doc_sidebar',
                ],
            )}
        >
            {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
            <DocSidebarDesktopContent path={path} sidebar={sidebar} />
            {hideable && <CollapseButton onClick={onCollapse} />}
        </div>
    );
}

export default React.memo(DocSidebarDesktop);
