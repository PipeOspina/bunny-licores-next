import { TErrorAction } from '@actions/error';
import { ErrorActions } from '@constants/error';
import { IError } from '@interfaces/Error';

export const errorReducer = (
	state: IError | null = null,
	action: TErrorAction,
): IError | null => {
	switch (action.type) {
		case ErrorActions.SET_ERROR: {
			return action.payload;
		}
		default: {
			return state;
		}
	}
};

export default {
	errorReducer,
};
