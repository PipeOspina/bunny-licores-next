import { AlertActions } from "@constants/alert"
import { IAlert } from "@interfaces/Alert"
import { TActionUnion, TPartial } from "@interfaces/Global"

export const addAlert = (alert: IAlert) => {
    return {
        type: AlertActions.ADD_ALERT,
        payload: alert,
    } as const
}

export const removeAlert = (id: string) => {
    return {
        type: AlertActions.REMOVE_ALERT,
        payload: id,
    } as const
}

export const updateAlert = (id: string, alert: TPartial<IAlert>) => {
    return {
        type: AlertActions.UPDATE_ALERT,
        payload: { id, alert },
    } as const
}

export const actions = {
    addAlert,
    removeAlert,
    updateAlert,
}

export type TAlertAction = TActionUnion<typeof actions>
