import { useEffect, useState } from 'react';
import firebase from 'firebase'

import { app, googleProvider } from '@services';
import { setUser } from '@actions/user';
import { useDispatch } from './redux';
import { userFromFire } from 'utils/converters';

export const useAuth = () => {
    const [unsubscriber, setUnsuscriber] = useState<firebase.Unsubscribe | null>(null);

    const dispatch = useDispatch();

    const login = () => {
        app
            .auth()
            .signInWithPopup(googleProvider)
            .catch(console.log);
    }

    const logout = () => {
        console.log('logout...');
        app
            .auth()
            .signOut()
            .catch(console.log);
    }

    useEffect(() => {
        setUnsuscriber((current) => {
            current && current();
            return app
                .auth()
                .onAuthStateChanged((fireUser) => {
                    console.log('sub', fireUser);
                    const user = userFromFire(fireUser)
                    dispatch(setUser(user));
                });
        });

        return () => {
            unsubscriber && unsubscriber();
        }
    }, []);

    return { login, logout };
}
