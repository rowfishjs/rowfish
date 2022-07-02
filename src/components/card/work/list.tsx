/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { WorkCardItemType } from '@site/src/types';
import React, { FC } from 'react';

import { useFilteredWorks } from './hooks';

import { WorkCardItem } from './item';
import { TagsProvider } from './provider';

import styles from './styles.module.css';
import { WorkCardTagsType } from './types';

export const WorkCards: FC<{ works: WorkCardItemType[]; tags: WorkCardTagsType }> = ({
    works,
    tags,
}) => {
    const filtered = useFilteredWorks(works);

    return (
        <TagsProvider data={tags}>
            <section className="margin-top--sm margin-bottom--xl">
                {filtered.length === 0 && <h2 className="tw-text-center">No result</h2>}
                {filtered.length === works.length ? (
                    <ul className={styles.workList}>
                        {works.map((work, i) => (
                            <WorkCardItem key={i.toFixed()} {...work} />
                        ))}
                    </ul>
                ) : (
                    <ul className={styles.workList}>
                        {filtered.map((work, i) => (
                            <WorkCardItem key={i.toFixed()} {...work} />
                        ))}
                    </ul>
                )}
            </section>
        </TagsProvider>
    );
};
// import { preparePageState, readSearchName } from './utils';

// const SearchBar: FC = () => {
//     const history = useHistory();
//     const location = useLocation();
//     const [value, setValue] = useState<string | null>(null);
//     useEffect(() => {
//         setValue(readSearchName(location.search));
//     }, [location]);
//     return (
//         <div className={styles.searchContainer}>
//             <input
//                 id="searchbar"
//                 placeholder="搜索项目"
//                 value={value ?? undefined}
//                 onInput={(e) => {
//                     setValue(e.currentTarget.value);
//                     const newSearch = new URLSearchParams(location.search);
//                     newSearch.delete(SearchNameQueryKey);
//                     if (e.currentTarget.value) {
//                         newSearch.set(SearchNameQueryKey, e.currentTarget.value);
//                     }
//                     history.push({
//                         ...location,
//                         search: newSearch.toString(),
//                         state: preparePageState(),
//                     });
//                     setTimeout(() => {
//                         document.getElementById('searchbar')?.focus();
//                     }, 0);
//                 }}
//             />
//         </div>
//     );
// };
