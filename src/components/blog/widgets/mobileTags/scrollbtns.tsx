import React, { useMemo, forwardRef } from 'react';

import LeftIcon from '@ricons/material/ChevronLeftOutlined';

import RightIcon from '@ricons/material/ChevronRightOutlined';

import { ScrollBtnProps } from './types';

import $styles from './style.module.css';

export const LeftButton = forwardRef<HTMLDivElement | null, ScrollBtnProps>(
    ({ scroll, start, stop }, ref) => {
        const icon = useMemo(() => {
            if (scroll.left <= 0) {
                return (
                    <span className="tw-cursor-not-allowed">
                        <span className="xicon">
                            <LeftIcon />
                        </span>
                    </span>
                );
            }
            return (
                <span
                    className="tw-cursor-pointer tw-inline-flex tw-items-center"
                    onMouseDown={() => start('left', scroll)}
                    onMouseUp={stop}
                    onTouchStart={() => start('left', scroll)}
                    onTouchEnd={stop}
                >
                    <span className="xicon">
                        <LeftIcon />
                    </span>
                </span>
            );
        }, [scroll]);
        return (
            <div
                ref={ref}
                className={$styles.scrollBtn}
                style={{
                    color: scroll.left <= 0 ? 'rgba(30, 30, 30, 0.25)' : 'inherit',
                    display: scroll.left <= 0 && scroll.right <= 0 ? 'none' : 'flex',
                }}
            >
                {icon}
            </div>
        );
    },
);

export const RightButton = forwardRef<HTMLDivElement | null, ScrollBtnProps>(
    ({ scroll, start, stop }, ref) => {
        const icon = useMemo(() => {
            if (scroll.right <= 0) {
                return (
                    <span className="tw-cursor-not-allowed">
                        <span className="xicon">
                            <RightIcon />
                        </span>
                    </span>
                );
            }
            return (
                <span
                    className="tw-cursor-pointer tw-inline-flex tw-items-center"
                    onMouseDown={() => start('right', scroll)}
                    onMouseUp={stop}
                    onTouchStart={() => start('right', scroll)}
                    onTouchEnd={stop}
                >
                    <span className="xicon">
                        <RightIcon />
                    </span>
                </span>
            );
        }, [scroll]);
        return (
            <div
                ref={ref}
                className={$styles.scrollBtn}
                style={{
                    color: scroll.right <= 0 ? 'rgba(30, 30, 30, 0.25)' : 'inherit',
                    display: scroll.left <= 0 && scroll.right <= 0 ? 'none' : 'flex',
                }}
            >
                {icon}
            </div>
        );
    },
);
