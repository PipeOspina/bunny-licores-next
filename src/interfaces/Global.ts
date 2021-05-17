import firebase from 'firebase/app';

export interface ICommonId {
    id?: string;
}

export type TCommonReference<T = firebase.firestore.DocumentData> = firebase
    .firestore
    .DocumentReference<T | firebase.firestore.DocumentData>;

export type TCommonQuerySnapshot<T = firebase.firestore.DocumentData> = firebase
    .firestore
    .QuerySnapshot<T>

export interface ICommonReference<T = unknown> extends ICommonId {
    ref?: TCommonReference<T>;
}

export type TPartial<T> = {
    [P in keyof T]?: T[P];
};

export type TTypeMap<K, T> = {
    [P in keyof K]?: T;
};

export interface IStringMap<T> {
    [key: string]: T
}

export type TAnyFunction = (...args: any[]) => any;

export type TActionUnion<A extends IStringMap<TAnyFunction>> = ReturnType<A[keyof A]>;
