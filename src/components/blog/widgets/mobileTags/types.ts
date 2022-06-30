export interface ScrollDistance {
    left: number;
    right: number;
}
export interface ScrollBtnProps {
    parent: HTMLElement | null;
    scroll: ScrollDistance;
    start: (arrow: 'left' | 'right', current: ScrollDistance) => void;
    stop: () => void;
}
export interface TagItem {
    items: string[];
    label: string;
    pages: any[];
    permalink: string;
}
