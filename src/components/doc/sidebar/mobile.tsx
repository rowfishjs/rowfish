import React from 'react';
import clsx from 'clsx';
import {
    NavbarSecondaryMenuFiller,
    type NavbarSecondaryMenuComponent,
    ThemeClassNames,
    useNavbarMobileSidebar,
} from '@docusaurus/theme-common';
import type { Props } from '@theme/DocSidebar/Mobile';

import { DocSidebarItems } from './items';

// eslint-disable-next-line react/function-component-definition
const DocSidebarMobileSecondaryMenu: NavbarSecondaryMenuComponent<Props> = ({ sidebar, path }) => {
    const mobileSidebar = useNavbarMobileSidebar();
    return (
        <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list doc_sidebar')}>
            <DocSidebarItems
                items={sidebar}
                activePath={path}
                onItemClick={(item) => {
                    // Mobile sidebar should only be closed if the category has a link
                    if (item.type === 'category' && item.href) {
                        mobileSidebar.toggle();
                    }
                    if (item.type === 'link') {
                        mobileSidebar.toggle();
                    }
                }}
                level={1}
            />
        </ul>
    );
};

export const DocSidebarMobile = React.memo((props: Props) => (
    <NavbarSecondaryMenuFiller component={DocSidebarMobileSecondaryMenu} props={props} />
));
