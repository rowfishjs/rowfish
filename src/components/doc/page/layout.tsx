import React, { FC, useState } from 'react';

import BackToTopButton from '@theme/BackToTopButton';
import type { Props } from '@theme/DocPage/Layout';

import { useDocsSidebar } from '@docusaurus/theme-common';

import { Layout } from '../../layout';

import { DocPageLayoutSidebar } from './sidebar';

import styles from './style.module.css';
import { DocPageLayoutMain } from './main';

export const DocPageLayout: FC<Props> = ({ children }) => {
    const sidebar = useDocsSidebar();
    const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);

    return (
        <Layout className="dark:tw-bg-[url(/images/pages/site-dark-bg.webp)] tw-bg-[url(/images/pages/site-bg.webp)]">
            <BackToTopButton />
            <div className={styles.docPage}>
                {sidebar && (
                    <DocPageLayoutSidebar
                        sidebar={sidebar.items}
                        hiddenSidebarContainer={hiddenSidebarContainer}
                        setHiddenSidebarContainer={setHiddenSidebarContainer}
                    />
                )}
                <DocPageLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
                    {children}
                </DocPageLayoutMain>
            </div>
        </Layout>
    );
};
