import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useRouteContext from '@docusaurus/useRouteContext';
import { DependencyList, useEffect, useMemo, useRef, useState } from 'react';
import { dequal } from 'dequal';
/**
 * 生成一个区间之间的随机数(含最大值，含最小值)
 * @param min 最小值
 * @param max 最大值
 */
export const randomIntFrom = (min: number, max: number) => {
    const minc = Math.ceil(min);
    const maxc = Math.floor(max);
    return Math.floor(Math.random() * (maxc - minc + 1)) + minc;
};
/**
 * 检测当前路径是否为一个URL
 * @param path 路径(字符串)
 */
export const isUrl = (path: string): boolean => {
    if (!path.startsWith('http')) {
        return false;
    }
    try {
        const url = new URL(path);
        return !!url;
    } catch (error) {
        return false;
    }
};

/**
 * 用于深度检测依赖的useMemo钩子
 * @param factory 返回值
 * @param dependencies 依赖项
 */
export function useDeepCompareMemo<T>(factory: () => T, dependencies: DependencyList) {
    return useMemo(factory, useDeepCompareMemoize(dependencies));
}

/**
 * 深度检测依赖值是否改变
 * @param deps 依赖项
 */
export const useDeepCompareMemoize = (deps: DependencyList) => {
    const ref = useRef<DependencyList>([]);

    if (!dequal(deps, ref.current)) {
        ref.current = deps;
    }

    return ref.current;
};
/**
 * 移动一个数组中的某个元素
 * @param arr
 * @param fromIndex
 * @param toIndex
 */
export const arrayMove = (arr: number[], fromIndex: number, toIndex: number) => {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
};

/**
 *  检测当页面属于哪个插件
 * @param type
 */
export const usePluginCheck = (type: 'blog' | 'docs') => {
    const [isBlog, setIsBlog] = useState<boolean>(false);
    const context = useRouteContext();
    useEffect(() => {
        setIsBlog(context.plugin.name === `docusaurus-plugin-content-${type}`);
    }, [context]);
    return isBlog;
};

export const openDockModal = (id: string, img: string, size: { w: number; h: number }) => {
    if (ExecutionEnvironment.canUseDOM) {
        // const current = document.getElementById(id);
        // if (!isNil(current)) document.body.removeChild(current);
        const target = document.createElement('div');
        target.setAttribute('id', id);
        target.setAttribute(
            'class',
            [
                'tw-fixed',
                'tw-flex',
                'tw-items-center',
                'tw-justify-center',
                'tw-top-0',
                'tw-left-0',
                'tw-z-[var(--rf-dock-modal-z-index)]',
                'tw-w-full',
                'tw-h-full',
                'tw-backdrop-blur-sm',
                'tw-bg-black/80',
            ].join(' '),
        );
        const block = document.createElement('div');
        block.setAttribute('style', `width: ${size.w / 16}rem;`);
        block.setAttribute(
            'class',
            ['tw-flex', 'tw-flex-col', 'tw-items-center', 'tw-justify-center'].join(' '),
        );
        const close = document.createElement('div');
        close.setAttribute(
            'class',
            [
                'tw-rounded-full',
                'tw-text-white',
                'tw-shadow-nymd',
                'tw-shadow-white/20',
                'tw-flex',
                'tw-items-center',
                'tw-justify-center',
                'tw-h-7',
                'tw-w-7',
                'tw-flex-none',
                'tw-font-medium',
                'tw-text-xl',
                'tw-cursor-pointer',
                'tw-mb-3',
                'tw-transition',
                'tw-ease-in-out',
                'tw-duration-500',
                'hover:tw-rotate-180',
            ].join(' '),
        );
        close.innerHTML = 'x';
        close.addEventListener('click', () => {
            document.body.removeChild(target);
        });
        const image = document.createElement('img');
        image.setAttribute('src', img);
        image.setAttribute('style', `height: ${size.h / 16}rem`);
        image.setAttribute(
            'class',
            ['tw-w-full', 'tw-rounded-md', 'tw-shadow-spread', 'tw-shadow-amber-300/30'].join(' '),
        );
        block.appendChild(close);
        block.appendChild(image);
        target.appendChild(block);
        document.body.appendChild(target);
    }
};
