export type TipPage = 'blog' | 'doc' | 'about' | 'link';
export interface TipItem {
    id: string;
    enabled?: boolean;
    content: string;
    color?: 'info' | 'secondary' | 'success' | 'warning' | 'danger';
    pages?: Array<TipPage> | 'all';
    closeable?: boolean;
    closeTime?: number;
    center?: boolean;
}
