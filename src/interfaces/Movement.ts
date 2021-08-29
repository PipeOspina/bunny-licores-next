import { IProductRef } from './Product';

export interface IMovement {
	product: IProductRef;
	quantity: number;
	unitPrice: number;
	total: number;
	deposit?: IDeposit;
}

export interface IDeposit {
	quantity: number;
	unitPrice: number;
	total: number;
	payedDate?: Date;
}
