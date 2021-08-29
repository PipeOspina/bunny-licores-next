import { AlertActions } from '@constants/alert';
import { IAlert } from '@interfaces/Alert';
import { TActionUnion, TPartial } from '@interfaces/Global';

export const addAlert = (alert: IAlert) =>
	({
		type: AlertActions.ADD_ALERT,
		payload: alert,
	} as const);

export const removeAlert = (id: string) =>
	({
		type: AlertActions.REMOVE_ALERT,
		payload: id,
	} as const);

export const updateAlert = (id: string, alert: TPartial<IAlert>) =>
	({
		type: AlertActions.UPDATE_ALERT,
		payload: { id, alert },
	} as const);

export const actions = {
	addAlert,
	removeAlert,
	updateAlert,
};

export type TAlertAction = TActionUnion<typeof actions>;
