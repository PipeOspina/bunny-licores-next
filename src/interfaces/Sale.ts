import { IUserRef, initialUserRef } from '@interfaces/User';
import { ICommonId, ICommonReference } from '@interfaces/Global';
import { IMovement } from './Movement';

export interface ISale extends ICommonId {
	products: IMovement[];
	date: Date;
	client: IUserRef;
	subtotal: number;
	tip: number;
	total: number;
	pay: number;
	back: number;
	paymentMethod: IPaymentMethodRef[];
}

export interface ISaleDeposit {
	amount: number;
	payedDate?: Date;
}

export const initialSale: ISale = {
	client: initialUserRef,
	date: new Date(),
	subtotal: 0,
	tip: 0,
	total: 0,
	products: [],
	back: 0,
	pay: 0,
	paymentMethod: [
		{
			amount: 0,
			name: '',
		},
	],
};

export const initialSaleDeposit: ISaleDeposit = {
	amount: 0,
};

export interface IPaymentMethod {
	commission: number;
	name: string;
}

export interface IPaymentMethodRef extends ICommonReference<IPaymentMethod> {
	name: string;
	amount: number;
}
