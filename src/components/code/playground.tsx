import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { usePrismTheme } from '@docusaurus/theme-common';
import React, { FC } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type { Props } from '@theme/Playground';

import styles from './playground.module.css';

function LivePreviewLoader() {
    // Is it worth improving/translating?
    return <div>Loading...</div>;
}

function ThemedLiveEditor() {
    const isBrowser = useIsBrowser();
    return (
        <LiveEditor
            // We force remount the editor on hydration,
            // otherwise dark prism theme is not applied
            key={String(isBrowser)}
            className={styles.playgroundEditor}
        />
    );
}
export const Playground: FC<Props & { maxHeight: number | string; height?: number | string }> = ({
    children,
    transformCode,
    height,
    maxHeight,
    ...props
}) => {
    const prismTheme = usePrismTheme();

    return (
        <div
            className={styles.playgroundContainer}
            style={{ '--max-height': maxHeight, '--height': height } as any}
        >
            <LiveProvider
                code={children.replace(/\n$/, '')}
                transformCode={transformCode || ((code) => `${code};`)}
                theme={prismTheme}
                {...(props as any)}
            >
                <ThemedLiveEditor />
                <div>
                    <div className={styles.playgroundPreview} style={{ overflow: 'hidden' }}>
                        <BrowserOnly fallback={<LivePreviewLoader />}>
                            {() => (
                                <>
                                    <LivePreview />
                                    <LiveError />
                                </>
                            )}
                        </BrowserOnly>
                    </div>
                </div>
            </LiveProvider>
        </div>
    );
};
