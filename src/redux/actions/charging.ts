import { TActionUnion } from '@interfaces/Global';
import { IGlobalCharging } from '@interfaces/Charging';
import { ChargingActions } from '@constants/charging';

export const setGlobalCharging = (
	element: keyof IGlobalCharging,
	charging: boolean,
) =>
	({
		type: ChargingActions.SET_CHARGING,
		payload: { element, charging },
	} as const);

export const actions = {
	setGlobalCharging,
};

export type TChargingAction = TActionUnion<typeof actions>;
