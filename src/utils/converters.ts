import firebase from 'firebase';

import { IUser } from '@interfaces/User';
import { UserTypes } from '@constants/user';

export const userFromFire = (
    user?: firebase.User | null
): IUser | null => {
    return !user
        ? null
        : {
            name: user.displayName,
            email: user.email,
            phone: user.phoneNumber,
            id: `FIRE-${user.uid}`,
            type: UserTypes.ADMIN,
            avatarURL: user.photoURL,
        }
}

export const numberToCOP = (value: number) => {
    return new Intl
        .NumberFormat(
            'en-US',
            {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            },
        )
        .format(value);
}
