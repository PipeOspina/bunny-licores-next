export interface IGlobalCharging {
    auth: boolean;
}

export const initialGlobalCharging: IGlobalCharging = {
    auth: false,
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

export type TCharging = IGlobalCharging
    | IAuthCharging;
