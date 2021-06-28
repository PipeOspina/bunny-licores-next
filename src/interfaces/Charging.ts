export interface IGlobalCharging {
    auth: boolean;
    index: boolean;
    productTable: boolean;
    createProduct: boolean;
}

export const initialGlobalCharging: IGlobalCharging = {
    auth: false,
    index: false,
    productTable: false,
    createProduct: false,
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

export interface IProductTableCharging {
    deleteProducts: boolean;
    getProducts: boolean;
}

export const initialProductTableCharging: IProductTableCharging = {
    getProducts: false,
    deleteProducts: false,
}

export interface ICreateProductCharging {
    addProduct: boolean;
}

export const initialCreateProductCharging: ICreateProductCharging = {
    addProduct: false,
}

export type TCharging = IGlobalCharging
    | IAuthCharging
    | IIndexCharging
    | IProductTableCharging
    | ICreateProductCharging;
