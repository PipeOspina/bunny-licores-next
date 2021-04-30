import { TActionUnion } from '@interfaces/Global';
import { ErrorActions } from '@constants/error';
import { IError } from '@interfaces/Error';

export const setError = (error: IError | null) => {
    return {
        type: ErrorActions.SET_ERROR,
        payload: error,
    } as const
}

export const actions = {
    setError,
}

export type TErrorAction = TActionUnion<typeof actions>
