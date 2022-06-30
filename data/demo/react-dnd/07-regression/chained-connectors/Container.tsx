import React, { CSSProperties, FC } from 'react';

import { BoxWithHandle } from './BoxWithHandle';

const style: CSSProperties = {
    width: '100%',
};

export interface Item {
    id: number;
    text: string;
}
export interface ContainerState {
    cards: Item[];
}

export const Container: FC = () => (
    <div style={style}>
        <BoxWithHandle />
    </div>
);
