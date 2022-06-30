import { useDeepCompareEffect, useLocalStorageState, useMount } from 'ahooks';
import { isArray, isNil } from 'lodash-es';
import React, { FC, useCallback, useState } from 'react';

import clsx from 'clsx';

import CloseIcon from '@ricons/material/CloseOutlined';

import dayjs from 'dayjs';

import { useDeepCompareMemo } from '@site/src/utils';

import { TipItem, TipPage } from './types';
import $styles from './style.module.css';

interface CloseItem {
    id: string;
    stop: string;
}
export const Tips: FC<{ data: TipItem[]; page: TipPage }> = ({ data, page }) => {
    const [closes, setCloses] = useLocalStorageState<CloseItem[]>('closed-tips', {
        defaultValue: [],
    });
    const [tips, setTips] = useState<TipItem[]>([]);
    const closedIds = useDeepCompareMemo(() => (closes ?? []).map((v) => v.id), [closes]);
    const closeTip = useCallback(
        (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: string) => {
            e.currentTarget.parentElement?.setAttribute('style', `opacity: 0`);
            setTimeout(() => {
                const tip = data.find((v) => v.id === id);
                if (isNil(tip)) return;
                const olds = (closes ?? []).filter(
                    (v) => dayjs().isBefore(dayjs(v.stop)) && v.id !== id,
                );
                setCloses([
                    ...olds,
                    {
                        id,
                        stop: dayjs()
                            .add(tip.closeTime ?? 3600 * 24, 'second')
                            .format()
                            .toString(),
                    },
                ]);
            }, 300);
        },
        [data, closes],
    );
    useMount(() => {
        setCloses((closes ?? []).filter(({ stop }) => dayjs().isBefore(dayjs(stop))));
    });

    useDeepCompareEffect(() => {
        setTips(
            data.filter(({ id, pages }) => {
                if (closedIds.includes(id)) return false;
                if (isNil(pages) || pages === 'all') return true;
                if (isArray(pages)) return pages.includes(page);
                return false;
            }),
        );
    }, [data, closedIds]);
    if (tips.length <= 0) return null;
    return (
        <div className={$styles.container}>
            {tips.map(({ id, content, color, center, closeable = true }) => (
                <div
                    key={id}
                    className={clsx([
                        $styles.item,
                        $styles[`item-${isNil(color) ? 'info' : color}`],
                    ])}
                >
                    <span
                        className={clsx({ 'tw-flex-auto': center, 'tw-text-center': center })}
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                    {closeable && (
                        <span
                            className={`xicon ${$styles.closeBtn}`}
                            onClick={(e) => closeTip(e, id)}
                        >
                            <CloseIcon />
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};
