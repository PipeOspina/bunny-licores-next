import { Subscription } from "rxjs";

export interface IProductSubscriptions {
    uploadPhoto: Subscription | null;
    getProducts: Subscription | null;
}

export const initialProductSubscriptions: IProductSubscriptions = {
    uploadPhoto: null,
    getProducts: null,
}

export type TSubscription = IProductSubscriptions;
