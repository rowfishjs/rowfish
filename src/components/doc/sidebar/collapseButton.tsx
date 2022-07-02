import React, { FC } from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import type { Props } from '@theme/DocSidebar/Desktop/CollapseButton';
import MenuFoldOutlined from '@ricons/antd/MenuFoldOutlined';

import styles from './collapse-button.module.css';

export const CollapseButton: FC<Props> = ({ onClick }) => {
    return (
        <button
            type="button"
            title={translate({
                id: 'theme.docs.sidebar.collapseButtonTitle',
                message: 'Collapse sidebar',
                description: 'The title attribute for collapse button of doc sidebar',
            })}
            aria-label={translate({
                id: 'theme.docs.sidebar.collapseButtonAriaLabel',
                message: 'Collapse sidebar',
                description: 'The title attribute for collapse button of doc sidebar',
            })}
            className={clsx(
                'button button--secondary button--outline tw-inline-flex tw-items-center',
                styles.collapseSidebarButton,
            )}
            onClick={onClick}
        >
            <span style={{ color: 'var(--color-text-1)' }} className="tw-mt-[0.25rem]">
                <span className="xicon">
                    <MenuFoldOutlined />
                </span>
            </span>
        </button>
    );
};
