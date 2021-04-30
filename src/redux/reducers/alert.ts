import { TAlertAction } from "@actions/alert";
import { AlertActions } from "@constants/alert";
import { IAlert } from "@interfaces/Alert";

export const alertReducer = (
    state: IAlert[] = [],
    action: TAlertAction
): IAlert[] => {
    switch (action.type) {
        case AlertActions.ADD_ALERT: {
            return [
                ...state,
                action.payload,
            ];
        }
        case AlertActions.REMOVE_ALERT: {
            return state
                .filter((alert) => alert.id !== action.payload);
        }
        case AlertActions.UPDATE_ALERT: {
            return state
                .map((alert) => {
                    return alert.id === action.payload.id
                        ? {
                            ...alert,
                            ...action.payload.alert,
                        } : alert;
                });
        }
        default: {
            return state;
        }
    }
}
