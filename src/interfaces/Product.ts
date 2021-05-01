import { ICommonId, TPartial, ICommonReference } from '@interfaces/Global';
import { IUserRef, initialUserRef } from '@interfaces/User';

export interface IProduct extends ICommonId {
    name: string;
    image?: string;
    soldQuantity: number;
    barcode?: string;
    price: number;
    stockQuantity: number;
    lastModification: IProductModification;
    defaultDeposit?: number;
}

export interface IProductModification {
    date: Date;
    user: IUserRef;
    fields: TPartial<IProduct>;
}

export interface IProductRef extends ICommonReference<IProduct> {
    name: string;
}

export const initialProductMod: IProductModification = {
    date: new Date(),
    fields: {},
    user: initialUserRef,
}

export const initialProduct: IProduct = {
    lastModification: initialProductMod,
    name: '',
    price: 0,
    soldQuantity: 0,
    stockQuantity: 0,
}

export const initialProductRef: IProductRef = {
    name: '',
}
