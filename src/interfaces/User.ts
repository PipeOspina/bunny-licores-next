import { ICommonId, ICommonReference } from '@interfaces/Global';

export interface IUser extends ICommonId {
    phone?: string;
    name: string;
    email?: string;
    document?: string;
    aliases?: IUserRef[];
}

export interface IUserRef extends ICommonReference<IUser> {
    name: string;
}

export const initialUser: IUser = {
    name: '',
}

export const initialUserRef: IUserRef = {
    name: '',
}
