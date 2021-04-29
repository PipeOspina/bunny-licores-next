export interface ICommonId {
    id?: string;
}

export interface ICommonReference<T = unknown> extends ICommonId {
    ref?: T;
}

export type TPartial<T> = {
    [P in keyof T]?: T[P];
};

export interface IStringMap<T> {
    [key: string]: T
}

export type TAnyFunction = (...args: any[]) => any;

export type TActionUnion<A extends IStringMap<TAnyFunction>> = ReturnType<A[keyof A]>;
