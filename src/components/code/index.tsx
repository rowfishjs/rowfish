/* eslint-disable no-nested-ternary */
import React, { FC } from 'react';
import CodeBlockDefault from '@theme-original/CodeBlock';

import ReactLiveScope from '@theme/ReactLiveScope';
import { parseCodeBlockTitle } from '@docusaurus/theme-common';

import { Playground } from './playground';

import { CodeWindow } from './window';
import { CodeBlockProps } from './types';
import $styles from './playground.module.css';

export const CodeBlock: FC<CodeBlockProps> = ({
    title,
    padding,
    maxHeight,
    minHeight,
    height = 'auto',
    codesandbox,
    stackblitz,
    metastring,
    live,
    ...rest
}) => {
    const windowTitle = parseCodeBlockTitle(metastring) || title;
    return (
        <CodeWindow
            codeTitle={windowTitle}
            codeDemo={{
                codesandbox,
                stackblitz,
            }}
            padding={padding}
            maxHeight={maxHeight}
            minHeight={minHeight}
            live={live}
            overflow="auto"
        >
            {live ? (
                // @ts-expect-error: we have deliberately widened the type of language prop
                <Playground
                    scope={ReactLiveScope}
                    maxHeight={maxHeight ?? '25rem'}
                    height={height}
                    {...rest}
                />
            ) : (
                <CodeBlockDefault {...rest} />
            )}
        </CodeWindow>
    );
};

export const CodePreview: FC<Omit<CodeBlockProps & { code?: boolean }, 'live'>> = ({
    title,
    metastring,
    padding,
    maxHeight,
    minHeight,
    height = 'auto',
    codesandbox,
    stackblitz,
    code,
    preview,
    ...rest
}) => {
    const windowTitle = parseCodeBlockTitle(metastring) || title;
    return (
        <CodeWindow
            codeTitle={windowTitle}
            codeDemo={{
                codesandbox,
                stackblitz,
            }}
            padding={padding}
            maxHeight={maxHeight}
            minHeight={minHeight}
            overflow={code ? 'hidden' : 'auto'}
        >
            <div
                className={$styles.playgroundContainer}
                style={{ overflow: code ? 'hidden' : 'auto' }}
            >
                {code && <CodeBlockDefault {...rest} />}
                {preview && (
                    <div
                        style={
                            {
                                '--height': height,
                                '--max-height': code ? maxHeight : 'auto',
                                maxWidth: code ? '50%' : '100%',
                            } as any
                        }
                    >
                        {preview}
                    </div>
                )}
            </div>
        </CodeWindow>
    );
};
