import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { useDocsSidebar } from '@docusaurus/theme-common';
import DocCardList from '@theme/DocCardList';
import { isNil } from 'lodash-es';
import React, { useEffect, useMemo } from 'react';

const bgClasses = [
    'dark:tw-bg-[url(/images/pages/site-dark-bg.webp)]',
    'tw-bg-[url(/images/pages/site-bg.webp)]',
];
export default () => {
    const sidebar = useDocsSidebar();
    const items = useMemo(() => {
        if (isNil(sidebar)) return [];
        const [, ...others] = sidebar.items;
        return others;
    }, [sidebar?.items]);
    // console.log(findSidebarCategory(sidebar!.items, () => true)!);
    if (isNil(sidebar)) return null;
    useEffect(() => {
        const wrapper = document.getElementById('main-layouts');
        if (ExecutionEnvironment.canUseDOM) {
            // document.body.classList.add(...bgClasses);
            if (!isNil(wrapper))
                wrapper.classList.add(...bgClasses, 'tw-bg-transparent', 'tw-backdrop-blur-0');
        }
        return () => {
            if (ExecutionEnvironment.canUseDOM) {
                // document.body.classList.remove(...bgClasses);
                if (!isNil(wrapper))
                    wrapper.classList.remove(
                        ...bgClasses,
                        'tw-bg-transparent',
                        'tw-backdrop-blur-0',
                    );
            }
        };
    }, []);
    return <DocCardList items={items} />;
};
