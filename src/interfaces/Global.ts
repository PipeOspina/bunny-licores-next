export interface ICommonId {
    id?: string;
}

export interface ICommonReference<T = unknown> extends ICommonId {
    ref?: T;
}

export type TPartial<T> = {
    [P in keyof T]?: T[P];
};
