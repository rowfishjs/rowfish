import React, { FC, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Props } from '@theme/TOC';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import ReactDOM from 'react-dom';
import TOCIcon from '@ricons/material/ArticleRound';
import ControlIcon from '@ricons/fluent/ReadingList16Regular';
import { useDebounceEffect, useDeepCompareEffect, useResponsive } from 'ahooks';

import { isNil } from 'lodash-es';

import useRouteContext from '@docusaurus/useRouteContext';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import $styles from './style.module.css';

const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

const TocBlock = forwardRef<HTMLDivElement | null, Props>(({ className, ...props }, ref) => {
    return (
        <div ref={ref} className={clsx('blogBlock', $styles.container)}>
            <div className="blogBlockTitle tw-p-2 tw-hidden md:tw-flex">
                <span>
                    <span className="xicon">
                        <TOCIcon />
                    </span>
                </span>
                <span>目录</span>
            </div>
            <div className={clsx($styles.tableOfContents, 'thin-scrollbar', className)}>
                <TOCItems
                    {...props}
                    linkClassName={LINK_CLASS_NAME}
                    linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
                />
            </div>
        </div>
    );
});

const TocMobileBlock: FC<Props & { show: boolean; toggle: () => void }> = ({
    className,
    show,
    toggle,
    ...props
}) => {
    const responsive = useResponsive();
    const resp = ExecutionEnvironment.canUseDOM && responsive;
    const ref = useRef<HTMLDivElement | null>(null);
    const [x, setX] = useState<number>(0);
    const style = useMemo<Record<string, any>>(
        () => ({
            '--translate-x': show ? 0 : `${x}px`,
            '--control-rotate': show ? 'rotate(45deg)' : 'rotate(0)',
        }),
        [resp, show, x],
    );
    useDeepCompareEffect(() => {
        if (!isNil(ref.current)) {
            const rect = ref.current.getBoundingClientRect();
            setX(rect.width);
        }
    }, [ref.current, resp]);
    if (!ExecutionEnvironment.canUseDOM) return null;
    return ReactDOM.createPortal(
        <div className={$styles.mobileWrapper} style={style}>
            <div className={$styles.mobileBtn} onClick={toggle}>
                <span className="xicon">
                    <ControlIcon />
                </span>
            </div>
            <TocBlock ref={ref} {...props} />
        </div>,
        document.body,
    );
};

export const TOC: FC<Props> = ({ className, ...props }) => {
    // const windowSize = useWindowSize();
    // const renderTocDesktop = windowSize === 'desktop' || windowSize === 'ssr';
    const [modal, setModal] = useState(() =>
        ExecutionEnvironment.canUseDOM ? document.createElement('div') : null,
    );
    const [show, setShow] = useState<boolean>(false);
    const [isBlog, setIsBlog] = useState<boolean>(false);
    const responsive = useResponsive();
    const toggleDisplay = useCallback(() => setShow((state) => !state), []);
    const context = useRouteContext();
    const isLg = ExecutionEnvironment.canUseDOM && responsive.lg;
    useDebounceEffect(() => setShow(false), [isLg], { wait: 10 });
    useEffect(() => {
        setModal(() => {
            if (!ExecutionEnvironment.canUseDOM) return null;
            modal!.style.display = show ? 'block' : 'none';
            return modal;
        });
    }, [show]);
    useEffect(() => {
        if (ExecutionEnvironment.canUseDOM && modal) {
            if (!modal.classList.contains($styles.modal)) modal.classList.add($styles.modal);
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }

        return () => {
            if (ExecutionEnvironment.canUseDOM && modal) {
                document.body.removeChild(modal);
            }
        };
    }, []);
    useEffect(() => {
        setIsBlog(context.plugin.name === 'docusaurus-plugin-content-blog');
    }, [context]);
    return isBlog ? (
        <>
            <div className="tw-w-full lg:tw-block tw-hidden">
                <TocBlock {...props} />
            </div>
            <TocMobileBlock show={show} toggle={toggleDisplay} {...props} />
        </>
    ) : (
        <>
            <div className={clsx($styles.defaultTableOfContents, 'thin-scrollbar', className)}>
                <TOCItems
                    {...props}
                    linkClassName={LINK_CLASS_NAME}
                    linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
                />
            </div>
            <TocMobileBlock show={show} toggle={toggleDisplay} {...props} />
        </>
    );
};
