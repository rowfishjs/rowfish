import React, { FC } from 'react';
import { useWindowSize } from '@docusaurus/theme-common';
import type { Props } from '@theme/DocSidebar';

import DocSidebarDesktop from './desktop';
import { DocSidebarMobile } from './mobile';

export const DocSidebar: FC<Props> = (props) => {
    const windowSize = useWindowSize();

    // Desktop sidebar visible on hydration: need SSR rendering
    const shouldRenderSidebarDesktop = windowSize === 'desktop' || windowSize === 'ssr';

    // Mobile sidebar not visible on hydration: can avoid SSR rendering
    const shouldRenderSidebarMobile = windowSize === 'mobile';

    return (
        <>
            {shouldRenderSidebarDesktop && <DocSidebarDesktop {...props} />}
            {shouldRenderSidebarMobile && <DocSidebarMobile {...props} />}
        </>
    );
};
