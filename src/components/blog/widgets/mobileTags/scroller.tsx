import { isNil } from 'lodash-es';
import React, { FC, useCallback, useEffect, useRef } from 'react';

import { useImmer } from 'use-immer';

import { useUpdateEffect } from 'ahooks';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import { ScrollDistance } from './types';

import { LeftButton, RightButton } from './scrollbtns';

export const ScrollContainer: FC<{ parent: HTMLDivElement | null }> = ({ children, parent }) => {
    const [scroll, setScroll] = useImmer<ScrollDistance>({ left: 0, right: 0 });
    const leftRef = useRef<HTMLDivElement | null>(null);
    const rightRef = useRef<HTMLDivElement | null>(null);
    const arrowRequest = useRef<number | null>(null);

    const stopArrowScroll = useCallback(() => {
        if (!isNil(arrowRequest.current)) {
            cancelAnimationFrame(arrowRequest.current);
            arrowRequest.current = null;
        }
    }, []);
    const startArrowScroll = useCallback(
        (arrow: 'left' | 'right', current: ScrollDistance) => {
            if (isNil(parent)) return;
            if (arrow === 'left') {
                if (current.left > 0) {
                    const left = current.left - current.left / (current.left / 10);
                    const right = current.right + current.left / (current.left / 10);
                    parent.scrollTo({ left });
                    changeScroll();
                    arrowRequest.current = requestAnimationFrame(() =>
                        startArrowScroll('left', {
                            left,
                            right,
                        }),
                    );
                    return;
                }
                stopArrowScroll();
                return;
            }
            if (arrow === 'right') {
                if (current.right > 0) {
                    const left = current.left + current.right / (current.right / 10);
                    const right = current.right - current.right / (current.right / 10);
                    parent.scrollTo({ left });
                    changeScroll();
                    arrowRequest.current = requestAnimationFrame(() =>
                        startArrowScroll('right', {
                            left,
                            right,
                        }),
                    );
                    return;
                }
                stopArrowScroll();
            }
        },
        [parent],
    );

    const changeScroll = useCallback(() => {
        if (isNil(parent)) return;
        setScroll((state) => {
            state.left = parent.scrollLeft;
            state.right = parent.scrollWidth - (parent.clientWidth + parent.scrollLeft);
        });
    }, [parent]);
    const scrollListener = useCallback(() => {
        if (!isNil(parent)) {
            parent.removeEventListener('scroll', changeScroll);
            const hasScroll = parent.scrollWidth - parent.clientWidth > 0;
            if (!hasScroll) {
                setScroll({ left: 0, right: 0 });
                return;
            }
            parent.addEventListener('scroll', changeScroll);
            changeScroll();
            return;
        }
        setScroll({ left: 0, right: 0 });
    }, [parent]);
    useUpdateEffect(() => {
        scrollListener();
        ExecutionEnvironment.canUseDOM && window.addEventListener('resize', scrollListener);
        return () => {
            if (!isNil(parent)) parent.removeEventListener('scroll', changeScroll);
            ExecutionEnvironment.canUseDOM && window.removeEventListener('resize', scrollListener);
        };
    }, [parent]);
    useEffect(() => {
        const wrapper = parent?.parentElement;
        if (!isNil(wrapper)) {
            if (leftRef.current && !wrapper.contains(leftRef.current)) {
                wrapper.prepend(leftRef.current);
            }

            if (rightRef.current && !wrapper.contains(rightRef.current)) {
                wrapper.append(rightRef.current);
            }
        }
    }, [parent, leftRef.current, rightRef.current]);

    return (
        <>
            <LeftButton
                ref={leftRef}
                parent={parent}
                scroll={scroll}
                start={startArrowScroll}
                stop={stopArrowScroll}
            />
            {children}
            <RightButton
                ref={rightRef}
                parent={parent}
                scroll={scroll}
                start={startArrowScroll}
                stop={stopArrowScroll}
            />
        </>
    );
};
