import { TActionUnion } from "@interfaces/Global";
import { IUser } from "@interfaces/User";

export enum UserActions {
    SET_USER = 'REDUX/USER/ACTIONS/SET_USER',
}

const setUser = (user: IUser | null) => {
    return {
        type: UserActions.SET_USER,
        payload: user,
    } as const
}

export const actions = {
    setUser,
}

export type TUserAction = TActionUnion<typeof actions>
