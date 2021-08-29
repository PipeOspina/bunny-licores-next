import { IUser } from '@interfaces/User';
import { TUserAction } from '@actions/user';
import { UserActions } from '@constants/user';

export const userReducer = (
	state: IUser | null = null,
	action: TUserAction,
): IUser | null => {
	switch (action.type) {
		case UserActions.SET_USER: {
			return action.payload;
		}
		default: {
			return state;
		}
	}
};

export default {
	userReducer,
};
