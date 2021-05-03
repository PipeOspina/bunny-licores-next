export interface IGlobalCharging {
    auth: boolean;
    index: boolean;
    product: boolean;
}

export const initialGlobalCharging: IGlobalCharging = {
    auth: false,
    index: false,
    product: false,
}

export interface IAuthCharging {
    login: boolean;
    logout: boolean;
    starting: boolean;
}

export const initialAuthCharging: IAuthCharging = {
    login: false,
    logout: false,
    starting: false,
}

export interface IIndexCharging {
    redirect: boolean;
}

export const initialIndexCharging: IIndexCharging = {
    redirect: false,
}

export interface IProductCharging {
    addProduct: boolean;
}

export const initialProductCharging: IProductCharging = {
    addProduct: false,
}

export type TCharging = IGlobalCharging
    | IAuthCharging
    | IIndexCharging
    | IProductCharging;
