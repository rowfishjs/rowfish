import { useAsyncEffect, useUnmount, useUpdateEffect } from 'ahooks';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { loadFull } from 'tsparticles';
import { Container, tsParticles } from 'tsparticles-engine';

import * as effects from './effects';
import $styles from './style.module.css';

export const Particle = forwardRef<
    Container | null,
    {
        id?: string;
        type: keyof typeof effects;
        className?: string;
    }
>((props, ref) => {
    const { id = 'tsparticles', type, className } = props;
    const [container, setContainer] = useState<Container | undefined>();
    const [inited, setInited] = useState<boolean>(false);
    const destroy = useCallback(() => {
        if (isNil(container)) return;
        container.destroy();
        setContainer(undefined);
    }, [container]);
    const loadContainer = useCallback(async () => {
        const obj = await tsParticles.load(id, effects[type]);
        setContainer(obj);
    }, [inited]);
    const refresh = useCallback(async () => {
        destroy();
        await loadContainer();
    }, []);
    useAsyncEffect(async () => {
        await loadFull(tsParticles);
        setInited(true);
    }, []);
    useAsyncEffect(async () => {
        if (!inited) return;
        await loadContainer();
    }, [inited]);
    useUpdateEffect(() => {
        refresh();
    }, [props]);
    useUnmount(() => destroy());
    useImperativeHandle(ref, () => container as any, [container]);
    return (
        <div id={id} className={clsx($styles.wrapper, className)}>
            {/* <canvas /> */}
        </div>
    );
});
