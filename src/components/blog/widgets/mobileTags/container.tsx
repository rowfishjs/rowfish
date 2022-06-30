import Link from '@docusaurus/Link';
import React, { forwardRef } from 'react';

import clsx from 'clsx';

import { TagItem } from './types';
import $styles from './style.module.css';

export const TabsList = forwardRef<HTMLDivElement | null, { tags: TagItem[] }>(({ tags }, ref) => (
    <div ref={ref} className={clsx('blogPostTags', $styles.itemList)}>
        {tags.map(({ permalink, label, items }, i) => (
            <Link href={permalink} key={i.toFixed()}>
                <span>{label}</span>
                <span className="tagItemsCount">{items.length}</span>
            </Link>
        ))}
    </div>
));
