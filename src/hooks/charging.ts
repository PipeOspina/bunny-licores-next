import { useState } from "react";

import { setGlobalCharging as globalCharging } from '@actions/charging';
import { IGlobalCharging, TCharging } from "@interfaces/Charging";
import { useDispatch, useSelector } from "./redux";

export const useCharging = <T extends TCharging>(element?: keyof IGlobalCharging) => {
    const [stateCharging, setStateCharging] = useState<T>();

    const stateGlobalCharging = useSelector((state) => state.charging);

    const dispatch = useDispatch();

    const isGlobalCharging = Object
        .values(stateGlobalCharging || {})
        .includes(true);

    if (!element) {
        return {
            stateGlobalCharging,
            globalCharging: isGlobalCharging,
        }
    }

    const setGlobalCharging = (item: keyof IGlobalCharging, charging: boolean = true) => {
        dispatch(globalCharging(item, charging));
    }

    const isCharging = Object
        .values(stateCharging || {})
        .includes(true);

    const setCharging = (item: keyof T, charging: boolean = true) => {
        setStateCharging((current) => ({
            ...current,
            [item]: charging,
        }));
        setGlobalCharging(element, isCharging || charging);
    }

    return {
        stateGlobalCharging,
        globalCharging: isGlobalCharging,
        setGlobalCharging,
        stateCharging,
        charging: isCharging,
        setCharging,
    }
}
