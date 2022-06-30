/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { FC, useContext } from 'react';

import { sortBy } from 'lodash-es';

import ReactTooltip from 'react-tooltip';

import ReactDOMServer from 'react-dom/server';

import styles from './styles.module.css';
import { tagsContext } from './provider';

export const WorkCardTag: FC<{ names: string[] }> = ({ names }) => {
    const tags = useContext(tagsContext);
    const tagObjects = names.map((name) => ({ name, ...tags[name] }));

    const tagObjectsSorted = sortBy(tagObjects, ({ name }) => Object.keys(tags).indexOf(name));

    return (
        <>
            {tagObjectsSorted.map(({ name, description, label, color }, index) => {
                // const id = `showcase_card_tag_${name}`;
                return (
                    <li
                        data-html
                        className={styles.tag}
                        title={description}
                        key={index.toFixed()}
                        data-tip={ReactDOMServer.renderToString(<span>{description}</span>)}
                        data-for="worktag"
                    >
                        <span className={styles.textLabel}>{label}</span>
                        <span className={styles.colorLabel} style={{ backgroundColor: color }} />
                    </li>
                );
            })}
            <ReactTooltip id="worktag" type="dark" effect="float" />
        </>
    );
};
