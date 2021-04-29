import { initialUser, IUser } from "@interfaces/User";
import { TUserAction, UserActions } from "@actions/user";

export const userReducer = (
    state: IUser | null = null,
    action: TUserAction
) => {
    switch (action.type) {
        case UserActions.SET_USER: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
