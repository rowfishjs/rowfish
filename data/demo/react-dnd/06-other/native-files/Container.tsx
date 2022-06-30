import React, { FC, useState, useCallback } from 'react';

import { TargetBox } from './TargetBox';
import { FileList } from './FileList';

export const Container: FC = () => {
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

    const handleFileDrop = useCallback(
        (item) => {
            if (item) {
                const { files } = item;
                setDroppedFiles(files);
            }
        },
        [setDroppedFiles],
    );

    return (
        <>
            <TargetBox onDrop={handleFileDrop} />
            <FileList files={droppedFiles} />
        </>
    );
};
