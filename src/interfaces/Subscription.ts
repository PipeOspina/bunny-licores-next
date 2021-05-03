import { Subscription } from "rxjs";

export interface IProductSubscriptions {
    uploadPhoto: Subscription | null;
}

export const initialProductSubscriptions: IProductSubscriptions = {
    uploadPhoto: null,
}

export type TSubscription = IProductSubscriptions;
