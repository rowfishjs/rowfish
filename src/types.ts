import { ComponentType, HTMLAttributeAnchorTarget } from 'react';

export interface SiteDataType {
    owner?: {
        name: string;
        avatar?: string;
        signature?: string;
    };
    beian?: {
        prefix: string;
        code: string;
    };
}

export interface DockItem {
    name: string;
    icon: ComponentType<any>;
    href?: string;
    target?: string;
    onClick?: (props: DockItem) => void;
}

export interface LinkType {
    name: string;
    logo: string;
    desc?: string;
    href: string;
    target?: string;
}
export interface LinkCategory {
    name: string;
    links: LinkType[];
}

export interface CourseCardItemType {
    name: string;
    href: string;
    isFree?: boolean;
    description?: string;
    color?: 'success' | 'danger' | 'info';
    status?: 0 | 1 | 2;
    image?: string;
    target?: string;
}

export interface WorkCardItemType {
    img: string;
    name: string;
    link: string;
    target?: HTMLAttributeAnchorTarget;
    demo?: string;
    buy?: string;
    source?: string;
    course?: string;
    desc?: string;
    tags?: string[];
}

export interface Techbadge {
    label: string;
    logo: string;
}

export interface CarouselItemType {
    image: string;
    link: string;
    darkBg?: boolean;
    title?: string;
    description?: string;
    target?: HTMLAttributeAnchorTarget;
}

export interface WorksPageInfoType {
    title?: string;
    description?: string;
}
