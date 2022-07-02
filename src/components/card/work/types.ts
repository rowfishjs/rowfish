export type WorkPageState = {
    scrollTopPosition: number;
    focusedElementId: string | undefined;
};
export type Operator = 'OR' | 'AND';
export interface WorkCardTagType {
    label: string;
    description: string;
    color: string;
}
export type WorkCardTagsType = Record<string, WorkCardTagType>;
