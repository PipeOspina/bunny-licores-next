import { IProductRef } from '@interfaces/Product';
import { IUserRef, initialUserRef } from '@interfaces/User';

export interface IBuy {
	products: IProductRef[];
	price: number;
	buyer: IUserRef;
}

export const initialBuy: IBuy = {
	buyer: initialUserRef,
	price: 0,
	products: [],
};
