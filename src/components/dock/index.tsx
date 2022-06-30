import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
// import Layout from '@site/src/theme/Layout';

import clsx from 'clsx';

import { isNil } from 'lodash-es';

import ReactDOMServer from 'react-dom/server';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import ControlIcon from '@ricons/fluent/HeadphonesSoundWave28Filled';

import { useResponsive } from 'ahooks';

import ReactTooltip from 'react-tooltip';

import { DockItem } from '@site/src/types';

import { useDeepCompareMemo } from '@site/src/utils';

import $styles from './style.module.css';
// eslint-disable-next-line react/no-unused-prop-types
const DockBtn: FC<DockItem & { id: string }> = (item) => {
    const [actived, setActived] = useState(false);
    const ref = useRef<HTMLElement | null>(null);
    const ItemIcon = (
        <span className="xicon">
            <item.icon />
        </span>
    );
    const Btn = !isNil(item.href) ? (
        <a
            ref={ref as any}
            href={item.href}
            className={clsx($styles.dockBtn, { [$styles.activeDockBtn]: actived })}
            target={item.target ?? '_self'}
        >
            {ItemIcon}
        </a>
    ) : (
        <button className={clsx($styles.dockBtn, { [$styles.activeDockBtn]: actived })}>
            {ItemIcon}
        </button>
    );

    return (
        <div
            data-html
            data-for="dock-btns"
            className={$styles.dockItem}
            data-event="mouseenter touchstart"
            data-iscapture="true"
            data-event-off="mouseleave touchcend mouseup"
            data-tip={ReactDOMServer.renderToString(
                <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>,
            )}
            onClick={(e) => {
                e.preventDefault();
                setActived(false);
                if (!isNil(item.href) && ExecutionEnvironment.canUseDOM) {
                    window.open(item.href, item.target ?? '_self');
                } else if (item.onClick) {
                    item.onClick(item);
                }
            }}
            onMouseEnter={() => setActived(true)}
            onMouseLeave={() => setActived(false)}
            onTouchStart={() => setActived(true)}
            onTouchEnd={() => setActived(false)}
        >
            {Btn}
        </div>
    );
};
export const Dock: FC<{ data: DockItem[] }> = ({ data }) => {
    const [show, setShow] = useState<boolean>(false);
    const toggle = useCallback(() => setShow((state) => !state), []);
    const responsive = useResponsive();
    const resp = ExecutionEnvironment.canUseDOM && responsive;
    const isLg = resp && responsive.lg;
    const ref = useRef<HTMLDivElement | null>(null);
    const [y, setY] = useState<number>(0);
    const style = useDeepCompareMemo<Record<string, any>>(() => {
        if (isLg) return {};
        return {
            '--lg-translate-y': show ? 0 : `${y}px`,
            '--control-display': isLg ? 'none' : 'block',
            '--control-rotate': show ? 'rotate(45deg)' : 'rotate(0)',
        };
    }, [isLg, show, y]);
    useEffect(() => {
        if (!isNil(ref.current)) {
            const rect = ref.current.getBoundingClientRect();
            setY(rect.height);
        }
    }, [ref.current, resp]);

    return (
        <div className={$styles.dock} style={style}>
            <div className={clsx($styles.controlBtn)} onClick={toggle}>
                <span className="xicon">
                    <ControlIcon />
                </span>
            </div>
            <div className={$styles.container} ref={ref}>
                {data.map((item, index) => (
                    <DockBtn key={index.toFixed()} id={index.toFixed()} {...item} />
                ))}
            </div>
            <ReactTooltip
                id="dock-btns"
                type="dark"
                effect="solid"
                className="tw-px-2 tw-py-1"
                clickable
            />
        </div>
    );
};
