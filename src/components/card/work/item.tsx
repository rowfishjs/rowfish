/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { memo } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

import Image from '@theme/IdealImage';

import { WorkCardItemType } from '@site/src/types';

import styles from './styles.module.css';
import { WorkCardTag } from './tag';

export const WorkCardItem = memo(
    ({ name, img, source, demo, buy, desc, link, target, course, tags = [] }: WorkCardItemType) => (
        <li key={name} className={`card ${styles.workCard}`}>
            <div className={clsx('card__image', styles.cardImage)}>
                <Image img={img} />
            </div>
            <div className="card__body">
                <div className={clsx(styles.cardHeader)}>
                    <h4 className={styles.cardName}>
                        <Link
                            href={link}
                            target={target ?? '_self'}
                            className={clsx('tw-animate-decoration', styles.cardLink)}
                        >
                            {name}
                        </Link>
                    </h4>
                    {demo && (
                        <Link
                            href={demo}
                            className={clsx(
                                'button button--primary button--sm',
                                styles.btn,
                                styles.demoBtn,
                            )}
                        >
                            演示
                        </Link>
                    )}
                    {source && (
                        <Link
                            href={source}
                            className={clsx(
                                'button button--secondary button--sm',
                                styles.btn,
                                styles.sourceBtn,
                            )}
                        >
                            源码
                        </Link>
                    )}
                    {course && (
                        <Link
                            href={course}
                            className={clsx(
                                'button button--danger button--sm',
                                styles.btn,
                                styles.courseBtn,
                            )}
                        >
                            教程
                        </Link>
                    )}
                    {buy && (
                        <Link
                            href={buy}
                            className={clsx(
                                'button button--danger button--sm',
                                styles.btn,
                                styles.buyBtn,
                            )}
                        >
                            购买
                        </Link>
                    )}
                </div>
                <div className={clsx(styles.cardBody)}>{desc}</div>
            </div>
            <ul className={clsx('card__footer tw-mt-0', styles.cardFooter)}>
                <WorkCardTag names={tags} />
            </ul>
        </li>
    ),
);
