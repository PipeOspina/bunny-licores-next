import { ICommonId, ICommonReference } from '@interfaces/Global';
import { UserTypes } from '@constants/user';

export interface IUser extends ICommonId {
    phone?: string;
    name: string;
    email?: string;
    document?: string;
    aliases?: IUserRef[];
    avatarURL?: string;
    type: UserTypes;
}

export interface IUserRef extends ICommonReference<IUser> {
    name: string;
    email?: string;
}

export const initialUser: IUser = {
    name: '',
    type: UserTypes.UNLOGGED,
}

export const initialUserRef: IUserRef = {
    name: '',
}
