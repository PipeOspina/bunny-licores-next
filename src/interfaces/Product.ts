import { ModificationTypes } from '@constants/product';
import { ICommonId, TPartial, ICommonReference } from '@interfaces/Global';
import { IUserRef, initialUserRef } from '@interfaces/User';

import { IProductImage } from './Image';

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
    ref?: ICommonReference<IProduct>;
    relatedProducts?: IProduct[];
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
    name: '',
    sellPrice: 0,
    buyPrice: 0,
    soldQuantity: 0,
    stockQuantity: 0,
}

export const initialProductRef: IProductRef = {
    name: '',
}
