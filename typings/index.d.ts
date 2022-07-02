declare module '*.jpg' {
    const src: string;
    export default src;
}
declare module '*.jpeg' {
    const src: string;
    export default src;
}
declare module '*.png' {
    const src: string;
    export default src;
}
declare module '*.gif' {
    const src: string;
    export default src;
}
declare module 'dequal' {
    function dequal(foo: any, bar: any): boolean;
}

declare module '@theme/CodeBlock' {
    import type { ReactElement } from 'react';

    export interface Props {
        readonly children: string | ReactElement;
        readonly className?: string;
        readonly metastring?: string;
        readonly title?: string;
        readonly language?: string;
        readonly live?: boolean;
    }

    export default function CodeBlock(props: Props): JSX.Element;
}

declare module '@theme-init/CodeBlock' {
    import type CodeBlock, { Props as BaseProps } from '@theme/CodeBlock';

    export interface Props extends BaseProps {
        live?: boolean;
    }
    const CodeBlockComp: typeof CodeBlock;
    export default CodeBlockComp;
}

declare module '@docusaurus/theme-live-codeblock' {
    export type ThemeConfig = {
        liveCodeBlock: {
            playgroundPosition: 'top' | 'bottom';
        };
    };
}

declare module '@theme/Playground' {
    import type { LiveProviderProps } from 'react-live';

    export interface Props extends LiveProviderProps {
        children: string;
        height?: number | string;
    }
    export default function Playground(props: LiveProviderProps): JSX.Element;
}

declare module '@theme/ReactLiveScope' {
    interface Scope {
        [key: string]: unknown;
    }

    const ReactLiveScope: Scope;
    export default ReactLiveScope;
}

declare module '@theme/IdealImage' {
    export type SrcType = {
        width: number;
        path?: string;
        size?: number;
        format?: 'webp' | 'jpeg' | 'png' | 'gif';
    };

    export type SrcImage = {
        height?: number;
        width?: number;
        preSrc: string;
        src: string;
        images: SrcType[];
    };

    export interface Props extends ComponentProps<'img'> {
        readonly img: { default: string } | { src: SrcImage; preSrc: string } | string;
    }
    export default function IdealImage(props: Props): JSX.Element;
}
