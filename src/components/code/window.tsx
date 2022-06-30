import React, { CSSProperties, FC, type ReactNode } from 'react';
import EditIcon from '@ricons/antd/EditOutlined';
import CodeSandBoxIcon from '@ricons/antd/CodeSandboxOutlined';
import StackblitzIcon from '@ricons/antd/ThunderboltOutlined';

import ReactTooltip from 'react-tooltip';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import ReactDOMServer from 'react-dom/server';

import styles from './window.module.css';

interface Props {
    children: ReactNode;
    minHeight?: number | string;
    maxHeight?: number | string;
    height?: number | string;
    padding?: number | string;
    live?: boolean;
    codeTitle?: string;
    overflow?: string;
    codeDemo?: {
        codesandbox?: string;
        stackblitz?: string;
    };
}
export const CodeWindow: FC<Props> = ({
    children,
    live = false,
    padding = 0,
    height = 'auto',
    minHeight = '3rem',
    maxHeight = '25rem',
    codeTitle,
    overflow = 'hidden',
    codeDemo = {},
}) => {
    return (
        <div className={styles.browserWindow}>
            <div className={styles.browserWindowHeader}>
                <div className={styles.buttons}>
                    <span className={styles.dot} style={{ background: '#f25f58' }} />
                    <span className={styles.dot} style={{ background: '#fbbe3c' }} />
                    <span className={styles.dot} style={{ background: '#58cb42' }} />
                </div>
                {codeTitle && <div className={styles.codeTitle}>{codeTitle}</div>}
                {codeDemo.codesandbox || codeDemo.stackblitz ? (
                    <div className={styles.headerRight}>
                        {live && (
                            <>
                                <span
                                    data-html
                                    style={{ cursor: 'default' }}
                                    data-for="code-demo-icon"
                                    data-tip={ReactDOMServer.renderToString(
                                        <span style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                                            实时更改可编辑
                                        </span>,
                                    )}
                                >
                                    <span className="xicon tw-w-4 tw-h-4">
                                        <EditIcon className="tw-w-4 tw-h-4" />
                                    </span>
                                </span>
                            </>
                        )}
                        {codeDemo.codesandbox && (
                            <>
                                <span
                                    data-html
                                    data-for="code-demo-icon"
                                    onClick={(e) =>
                                        ExecutionEnvironment.canUseDOM &&
                                        window.open(codeDemo.codesandbox)
                                    }
                                    data-tip={ReactDOMServer.renderToString(
                                        <span style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                                            在 CodeSandbox 中演示
                                        </span>,
                                    )}
                                >
                                    <span className="xicon tw-w-4 tw-h-4">
                                        <CodeSandBoxIcon className="tw-w-4 tw-h-4" />
                                    </span>
                                </span>
                            </>
                        )}
                        {codeDemo.stackblitz && (
                            <>
                                <span
                                    data-html
                                    data-tip={ReactDOMServer.renderToString(
                                        <span style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                                            在 Stackblitz 中演示
                                        </span>,
                                    )}
                                    data-for="code-demo-icon"
                                    onClick={(e) =>
                                        ExecutionEnvironment.canUseDOM &&
                                        window.open(codeDemo.stackblitz)
                                    }
                                >
                                    <span className="xicon tw-w-4 tw-h-4">
                                        <StackblitzIcon className="tw-w-4 tw-h-4" />
                                    </span>
                                </span>
                            </>
                        )}
                    </div>
                ) : null}
            </div>
            <ReactTooltip
                id="code-demo-icon"
                type="dark"
                effect="solid"
                aria-haspopup="true"
                className="!tw-p-[0.25rem_1rem]"
            />
            <div
                className={styles.browserWindowBody}
                style={
                    {
                        overflow,
                        padding,
                        minHeight,
                        maxHeight,
                        height,
                    } as CSSProperties
                }
            >
                {children}
            </div>
        </div>
    );
};

export default CodeWindow;
