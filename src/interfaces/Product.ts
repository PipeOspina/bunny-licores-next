import firebase from 'firebase';
import { ModificationTypes } from '@constants/product';
import { ICommonId, TPartial, ICommonReference, TCommonReference } from '@interfaces/Global';
import { IUserRef, initialUserRef } from '@interfaces/User';

import { IProductImage, IImage } from './Image';

export interface IProduct extends ICommonId {
    name: string;
    images?: IProductImage;
    soldQuantity: number;
    barcode: string;
    sellPrice: number;
    buyPrice: number;
    stockQuantity: number;
    lastModification?: IProductModRef;
    buyDeposit?: number;
    sellDeposit?: number;
    description?: string;
    ref?: TCommonReference<IFireProduct>;
    relatedProducts?: IRelatedProduct[];
    creation?: IProductModRef;
}

export interface IFireProduct extends ICommonId {
    name: string;
    images?: IProductImage;
    soldQuantity: number;
    barcode: string;
    sellPrice: number;
    buyPrice: number;
    stockQuantity: number;
    lastModification?: IFireProductModRef;
    buyDeposit?: number;
    sellDeposit?: number;
    description?: string;
    ref?: TCommonReference<IFireProduct>;
    relatedProducts?: IRelatedProduct[];
    creation?: IFireProductModRef;
}

export interface IRelatedProduct {
    name: string;
    defaultImage?: IImage;
    barcode: string;
    sellPrice: number;
    stockQuantity: number;
    sellDeposit?: number;
    description?: string;
    ref?: TCommonReference<IFireProduct>;
}

export interface IProductMod extends ICommonId {
    date: Date;
    user: IUserRef;
    fields: TPartial<IProduct>;
    type: ModificationTypes;
}

export interface IFireProductMod extends ICommonId {
    date: firebase.firestore.Timestamp;
    user: IUserRef;
    fields: TPartial<IProduct>;
    type: ModificationTypes;
}

export interface IProductModRef extends ICommonReference<IProductMod> {
    type: ModificationTypes,
    date: Date;
}

export interface IFireProductModRef extends ICommonReference<IFireProductMod> {
    type: ModificationTypes,
    date: firebase.firestore.Timestamp;
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
    name: '',
    sellPrice: 0,
    buyPrice: 0,
    soldQuantity: 0,
    stockQuantity: 0,
}

export const initialProductRef: IProductRef = {
    name: '',
}
