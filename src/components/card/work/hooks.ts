import { useLocation } from '@docusaurus/router';
import { WorkCardItemType } from '@site/src/types';
import { useEffect, useMemo, useState } from 'react';

import { Operator, WorkPageState } from './types';
import {
    filterWorks,
    readOperator,
    readSearchName,
    readSearchTags,
    restoreProjectState,
} from './utils';

export function useFilteredWorks(works: WorkCardItemType[]) {
    const location = useLocation<WorkPageState>();
    const [operator, setOperator] = useState<Operator>('OR');
    // On SSR / first mount (hydration) no tag is selected
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchName, setSearchName] = useState<string | null>(null);
    // Sync tags from QS to state (delayed on purpose to avoid SSR/Client hydration mismatch)
    useEffect(() => {
        setSelectedTags(readSearchTags(location.search));
        setOperator(readOperator(location.search));
        setSearchName(readSearchName(location.search));
        restoreProjectState(location.state);
    }, [location]);

    return useMemo(
        () => filterWorks(works, selectedTags, operator, searchName),
        [selectedTags, operator, searchName],
    );
}
