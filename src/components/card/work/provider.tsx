import { useDeepCompareEffect } from 'ahooks';
import React, { createContext, FC, useState } from 'react';

import { WorkCardTagsType } from './types';

export const tagsContext = createContext<WorkCardTagsType>({});
export const TagsProvider: FC<{ data: WorkCardTagsType }> = ({ children, data }) => {
    const [tags, setTags] = useState<WorkCardTagsType>(data);
    useDeepCompareEffect(() => {
        setTags(data);
    }, [data]);
    return (
        <>
            <tagsContext.Provider value={tags}>{children}</tagsContext.Provider>
        </>
    );
};
