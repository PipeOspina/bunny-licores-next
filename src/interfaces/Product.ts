import firebase from 'firebase'
import { ModificationTypes } from '@constants/product';
import { ICommonId, TPartial, ICommonReference } from '@interfaces/Global';
import { IUserRef, initialUserRef } from '@interfaces/User';

export interface IProduct extends ICommonId {
    name: string;
    image?: string;
    soldQuantity: number;
    barcode?: string;
    price: number;
    stockQuantity: number;
    lastModification?: IProductModRef;
    defaultDeposit?: number;
    ref?: ICommonReference<IProduct>;
}

export interface IProductMod extends ICommonId {
    date: Date;
    user: IUserRef;
    fields: TPartial<IProduct>;
    type: ModificationTypes;
}

export interface IProductModRef extends ICommonReference<IProductMod> {
    type: ModificationTypes,
}

export interface IProductRef extends ICommonReference<IProduct> {
    name: string;
}

export const initialProductMod: IProductMod = {
    date: new Date(),
    fields: {},
    user: initialUserRef,
    type: ModificationTypes.CREATE,
}

export const initialProduct: IProduct = {
    barcode: '',
    defaultDeposit: 0,
    image: '',
    name: '',
    price: 0,
    soldQuantity: 0,
    stockQuantity: 0,
}

export const initialProductRef: IProductRef = {
    name: '',
}
