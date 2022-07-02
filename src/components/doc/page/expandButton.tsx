import React, { FC } from 'react';
import { translate } from '@docusaurus/Translate';
import type { Props } from '@theme/DocPage/Layout/Sidebar/ExpandButton';
import RightIcon from '@ricons/fa/AngleRight';

import styles from './style.module.css';

export const DocPageLayoutSidebarExpandButton: FC<Props> = ({ toggleSidebar }) => {
    return (
        <div className={styles.collapsedDocSidebar}>
            <div
                className={styles.expandButton}
                title={translate({
                    id: 'theme.docs.sidebar.expandButtonTitle',
                    message: 'Expand sidebar',
                    description:
                        'The ARIA label and title attribute for expand button of doc sidebar',
                })}
                aria-label={translate({
                    id: 'theme.docs.sidebar.expandButtonAriaLabel',
                    message: 'Expand sidebar',
                    description:
                        'The ARIA label and title attribute for expand button of doc sidebar',
                })}
                tabIndex={0}
                role="button"
                onKeyDown={toggleSidebar}
                onClick={toggleSidebar}
            >
                <span className="xicon tw-w-3 tw-h-3">
                    <RightIcon style={{ marginTop: '0.25rem' }} />
                </span>
            </div>
        </div>
    );
};
