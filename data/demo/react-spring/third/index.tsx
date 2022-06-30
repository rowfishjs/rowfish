import React, { useRef, useEffect } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import useIsBrowser from '@docusaurus/useIsBrowser';

import imgs from './data';

import styles from './styles.module.css';

const calcX = (y: number, ly: number) =>
    ExecutionEnvironment.canUseDOM ? -(y - ly - window.innerHeight / 2) / 20 : 0;
const calcY = (x: number, lx: number) =>
    ExecutionEnvironment.canUseDOM ? (x - lx - window.innerWidth / 2) / 20 : 0;

const wheel = (y: number) => {
    const imgHeight = ExecutionEnvironment.canUseDOM ? window.innerWidth * 0.3 - 20 : 0;
    return `translateY(${-imgHeight * (y < 0 ? 6 : 1) - (y % (imgHeight * 5))}px`;
};

export const ThirdDemo = () => {
    const isBrowser = useIsBrowser();
    useEffect(() => {
        const preventDefault = (e: Event) => e.preventDefault();
        if (isBrowser) {
            document.addEventListener('gesturestart', preventDefault);
            document.addEventListener('gesturechange', preventDefault);
        }

        return () => {
            if (isBrowser) {
                document.removeEventListener('gesturestart', preventDefault);
                document.removeEventListener('gesturechange', preventDefault);
            }
        };
    }, []);

    const domTarget = useRef(null);
    const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(() => ({
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        zoom: 0,
        x: 0,
        y: 0,
        config: { mass: 5, tension: 350, friction: 40 },
    }));

    const [{ wheelY }, wheelApi] = useSpring(() => ({ wheelY: 0 }));

    useGesture(
        {
            onDrag: ({ active, offset: [xv, yv] }) =>
                api({ x: xv, y: yv, rotateX: 0, rotateY: 0, scale: active ? 1 : 1.1 }),
            onPinch: ({ offset: [d, a] }) => api({ zoom: d / 200, rotateZ: a }),
            onMove: ({ xy: [px, py], dragging }) =>
                !dragging &&
                api({
                    rotateX: calcX(py, y.get()),
                    rotateY: calcY(px, x.get()),
                    scale: 1.1,
                }),
            onHover: ({ hovering }) => !hovering && api({ rotateX: 0, rotateY: 0, scale: 1 }),
            onWheel: ({ event, offset: [, yv] }) => {
                event.preventDefault();
                wheelApi.set({ wheelY: yv });
            },
        },
        { domTarget, eventOptions: { passive: false } },
    );
    return (
        <div className={styles.container}>
            <animated.div
                ref={domTarget}
                className={styles.card}
                style={{
                    transform: 'perspective(600px)',
                    x,
                    y,
                    scale: to([scale, zoom], (s, z) => s + z),
                    rotateX,
                    rotateY,
                    rotateZ,
                }}
            >
                <animated.div style={{ transform: wheelY.to(wheel) }}>
                    {imgs.map((img, i) => (
                        <div key={i.toFixed()} style={{ backgroundImage: `url(${img})` }} />
                    ))}
                </animated.div>
            </animated.div>
        </div>
    );
};
