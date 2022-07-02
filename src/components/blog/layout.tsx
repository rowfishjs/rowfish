import React, { FC, useState } from 'react';
import clsx from 'clsx';

import type { Props } from '@theme/BlogLayout';

import BrowserOnly from '@docusaurus/BrowserOnly';

import BackToTopButton from '@theme/BackToTopButton';

import { tips, dockItems } from '@site/data/site';

import { usePluginData } from '@docusaurus/useGlobalData';

import { useDeepCompareEffect } from 'ahooks';

import { isNil } from 'lodash-es';

import { Layout, LayoutProps } from '../layout';

import { Tips } from '../tip';

import { Dock } from '../dock';

import $styles from './layout.module.css';

import { BlogSidebar } from './widgets/sidebar';
import { BlogMobileTags } from './widgets/mobileTags';

export const BlogLayout: FC<Props & LayoutProps> = (props) => {
    const { sidebar, toc, children, ...layoutProps } = props;
    const globalData = usePluginData('docusaurus-plugin-content-blog', 'default') as any;
    const [title, setTitle] = useState<string | undefined>(undefined);
    useDeepCompareEffect(() => {
        if (!isNil(globalData) && !isNil(globalData.title)) setTitle(globalData.title);
    }, [globalData]);

    return (
        <Layout
            title={title}
            className="tw-bg-[url(/images/pages/site-bg.webp)] dark:tw-bg-[url(/images/pages/site-dark-bg.webp)]"
            footer
            footerClass="tw-bg-[color:var(--rf-blog-background-color)]"
            {...layoutProps}
        >
            <BackToTopButton />
            <div className="tw-w-full tw-h-full tw-bg-[color:var(--rf-blog-background-color)]">
                <div className={clsx('container')}>
                    <Tips data={tips} page="blog" />
                    <div className={$styles.container}>
                        <Dock data={dockItems} />

                        <main
                            className={clsx(
                                $styles.block,
                                'md:tw-max-w-[75%] tw-flex-col tw-max-w-full',
                            )}
                            itemScope
                            itemType="http://schema.org/Blog"
                        >
                            <BrowserOnly>{() => <BlogMobileTags />}</BrowserOnly>

                            <div className="tw-flex-auto tw-w-full"> {children}</div>
                        </main>
                        <div className={clsx($styles.block, 'md:tw-max-w-[23%] tw-w-full')}>
                            <BlogSidebar toc={toc} posts={sidebar?.items} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
