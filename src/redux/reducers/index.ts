import { alertReducer } from './alert';
import { userReducer } from './user';
import { chargingReducer } from './charging';
import { errorReducer } from './error';

export {
    userReducer,
    chargingReducer,
    errorReducer,
    alertReducer,
}

export default {
    user: userReducer,
    charging: chargingReducer,
    error: errorReducer,
    alert: alertReducer,
}
