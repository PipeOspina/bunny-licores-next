import { TChargingAction } from '@actions/charging';
import { ChargingActions } from '@constants/charging';
import { IGlobalCharging, initialGlobalCharging } from '@interfaces/Charging';

export const chargingReducer = (
	state: IGlobalCharging = initialGlobalCharging,
	action: TChargingAction,
): IGlobalCharging => {
	switch (action.type) {
		case ChargingActions.SET_CHARGING: {
			return {
				...state,
				[action.payload.element]: action.payload.charging,
			};
		}
		default: {
			return state;
		}
	}
};

export default {
	chargingReducer,
};
