import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { WorkCardItemType } from '@site/src/types';

import { OperatorQueryKey, SearchNameQueryKey, TagQueryStringKey } from './constants';

import { Operator, WorkPageState } from './types';

export function preparePageState(): WorkPageState | undefined {
    if (ExecutionEnvironment.canUseDOM) {
        return {
            scrollTopPosition: window.scrollY,
            focusedElementId: document.activeElement?.id,
        };
    }

    return undefined;
}

export function readSearchTags(search: string): string[] {
    return new URLSearchParams(search).getAll(TagQueryStringKey) as string[];
}

export function readOperator(search: string): Operator {
    return (new URLSearchParams(search).get(OperatorQueryKey) ?? 'OR') as Operator;
}

export function readSearchName(search: string) {
    return new URLSearchParams(search).get(SearchNameQueryKey);
}

export function restoreProjectState(projectState: WorkPageState | null) {
    const { scrollTopPosition, focusedElementId } = projectState ?? {
        scrollTopPosition: 0,
        focusedElementId: undefined,
    };
    if (ExecutionEnvironment.canUseDOM) {
        document.getElementById(focusedElementId as any)?.focus();
        window.scrollTo({ top: scrollTopPosition });
    }
}

export function filterWorks(
    works: WorkCardItemType[],
    selectedTags: string[],
    operator: Operator,
    searchName: string | null,
) {
    if (searchName) {
        // eslint-disable-next-line no-param-reassign
        works = works.filter(({ name }) => name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (selectedTags.length === 0) return works;
    return works.filter(({ tags = [] }) => {
        if (tags.length === 0) return false;
        if (operator === 'AND') return selectedTags.every((tag) => tags.includes(tag));
        return selectedTags.some((tag) => tags.includes(tag));
    });
}
