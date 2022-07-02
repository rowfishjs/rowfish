import { isNil } from 'lodash-es';
import React, { FC, useRef, useState } from 'react';

import { usePluginData } from '@docusaurus/useGlobalData';

import { useDeepCompareEffect } from 'ahooks';

import TagsIcon from '@ricons/antd/TagsOutlined';

import { TabsList } from './container';

import { ScrollContainer } from './scroller';
import { TagItem } from './types';
import $styles from './style.module.css';

export const BlogMobileTags: FC = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const globalData = usePluginData('docusaurus-plugin-content-blog', 'default') as any;
    const [tags, setTags] = useState<TagItem[]>([]);
    useDeepCompareEffect(() => {
        const tagArr: TagItem[] = [];
        if (!isNil(globalData) && !isNil(globalData.tags)) {
            for (const key in globalData.tags) {
                tagArr.push(globalData.tags[key]);
            }
            setTags(tagArr);
        }
    }, [globalData]);
    return (
        <div className="tw-max-w-full tw-mb-4 tw-flex md:tw-hidden">
            <span className="tw-flex-none tw-inline-flex tw-items-center tw-mr-1 tw-w-4">
                <span className="xicon">
                    <TagsIcon />
                </span>
            </span>
            <div className="tw-max-w-[calc(100%_-_1rem)] tw-flex">
                <ScrollContainer parent={ref.current}>
                    <div className={$styles.container}>
                        <TabsList ref={ref} tags={tags} />
                    </div>
                </ScrollContainer>
            </div>
        </div>
    );
};
