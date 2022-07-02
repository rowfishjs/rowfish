import { ComponentProps } from 'react';
import type CodeBlockType from '@theme/CodeBlock';

export type CodeBlockProps = ComponentProps<typeof CodeBlockType> & {
    padding?: number | string;
    maxHeight?: number | string;
    minHeight?: number | string;
    height?: number | string;
    codesandbox?: string;
    stackblitz?: string;
    preview?: string;
};
