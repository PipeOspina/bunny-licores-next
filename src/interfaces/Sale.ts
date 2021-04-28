import { IProductRef } from '@interfaces/Product';
import { IUserRef, initialUserRef } from '@interfaces/User';
import { ICommonId } from '@interfaces/Global';

export interface ISale extends ICommonId {
    products: IProductRef[];
    date: Date;
    client: IUserRef;
    price: number;
    deposit?: ISaleDeposit;
}

export interface ISaleDeposit {
    amount: number;
    payedDate?: Date;
}

export const initialSale: ISale = {
    client: initialUserRef,
    date: new Date(),
    price: 0,
    products: [],
}

export const initialSaleDeposit: ISaleDeposit = {
    amount: 0,
}
