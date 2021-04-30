import { TActionUnion } from '@interfaces/Global';
import { IUser } from '@interfaces/User';
import { UserActions } from '@constants/user';

export const setUser = (user: (IUser | null)) => {
    return {
        type: UserActions.SET_USER,
        payload: user,
    } as const
}

export const actions = {
    setUser,
}

export type TUserAction = TActionUnion<typeof actions>
