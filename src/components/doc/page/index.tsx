import React, { FC } from 'react';
import NotFound from '@theme/NotFound';
import type { Props } from '@theme/DocPage';

import clsx from 'clsx';

import {
    HtmlClassNameProvider,
    ThemeClassNames,
    docVersionSearchTag,
    DocsSidebarProvider,
    DocsVersionProvider,
    useDocRouteMetadata,
} from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';

import { DocPageLayout } from './layout';

export const DocPage: FC<Props> = (props) => {
    const { versionMetadata } = props;
    const currentDocRouteMetadata = useDocRouteMetadata(props);

    if (!currentDocRouteMetadata) return <NotFound />;
    const { docElement, sidebarName, sidebarItems } = currentDocRouteMetadata;
    return (
        <>
            <SearchMetadata
                version={versionMetadata.version}
                tag={docVersionSearchTag(versionMetadata.pluginId, versionMetadata.version)}
            />
            <HtmlClassNameProvider
                className={clsx(
                    // TODO: it should be removed from here
                    ThemeClassNames.wrapper.docsPages,
                    ThemeClassNames.page.docsDocPage,
                    props.versionMetadata.className,
                )}
            >
                <DocsVersionProvider version={versionMetadata}>
                    <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
                        <DocPageLayout>{docElement}</DocPageLayout>
                    </DocsSidebarProvider>
                </DocsVersionProvider>
            </HtmlClassNameProvider>
        </>
    );
};
