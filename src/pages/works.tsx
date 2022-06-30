/* eslint-disable react/no-danger */
import { WorkCards } from '@site/src/components/card/work';
import { Layout } from '@site/src/components/layout';
import clsx from 'clsx';
import React, { FC, useMemo } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

import { Particle } from '@site/src/components/particles';

import Image from '@theme/IdealImage';

import { badges, dockItems, tags, works, worksInfo, tips } from '@site/data/site';

import { isNil } from 'lodash-es';

import { Dock } from '../components/dock';

import { Tips } from '../components/tip';

import { WorksPageInfoType } from '../types';

import $styles from './works.module.css';

const Header: FC<{ data: WorksPageInfoType }> = ({ data: { title, description } }) => {
    const { colorMode } = useColorMode();
    return (
        <section className={clsx('text--center', $styles.header)}>
            <div
                className={clsx($styles.headerContent, {
                    'tw-backdrop-blur-md': colorMode === 'dark',
                })}
            >
                {title && <h1 className="tw-items-end">{title}</h1>}
                {description && (
                    <p
                        className="tw-items-center"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                )}
            </div>
        </section>
    );
};
const Badges: FC = () => {
    const { colorMode } = useColorMode();
    const badgeColor = useMemo(() => (colorMode === 'dark' ? '065F46' : '00ED00'), [colorMode]);
    return (
        <div className={$styles.badges}>
            {badges.map(({ label, logo }, i) => (
                <Image
                    key={i.toFixed()}
                    img={`https://img.shields.io/badge/-${label}-${badgeColor}?style=flat&logo=${logo}`}
                />
            ))}
        </div>
    );
};
export default () => {
    return (
        <Layout
            title={worksInfo.title}
            description={worksInfo.description}
            className="dark:tw-bg-[url(/images/pages/site-dark-bg.webp)] tw-bg-[url(/images/pages/site-bg.webp)]"
        >
            <Dock data={dockItems} />
            <div className="tw-w-full tw-h-full tw-bg-[color:rgb(240_240_240_/_20%)] dark:tw-bg-[color:var(--sidebar-dark-bg-color)]">
                {(!isNil(worksInfo.title) || !isNil(worksInfo.description)) && (
                    <Header data={worksInfo} />
                )}

                <main className={clsx('margin-vert--md', $styles.container, 'container')}>
                    <div className="tw-w-full tw-mb-5">
                        <Tips data={tips} page="about" />
                    </div>

                    <div className="tw-w-full tw-flex-wrap">
                        <h3 className={$styles.title}>🔭 技术栈</h3>
                        <div className={$styles.badges}>
                            <Badges />
                        </div>
                    </div>
                    <div className="tw-w-full">
                        <h3 className={$styles.title}>🌱 作品</h3>
                        <WorkCards works={works} tags={tags} />
                    </div>
                </main>
            </div>
            <Particle type="snow" />
        </Layout>
    );
};
