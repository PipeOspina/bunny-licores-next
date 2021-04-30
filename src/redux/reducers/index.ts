import { userReducer } from './user';
import { chargingReducer } from './charging';

export {
    userReducer,
    chargingReducer,
}

export default {
    user: userReducer,
    charging: chargingReducer,
}
