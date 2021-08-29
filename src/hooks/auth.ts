import { useEffect, useState } from 'react';
import firebase from 'firebase/app';

import { app, googleProvider } from '@services';
import { setUser } from '@actions/user';
import { userFromFire } from 'utils/converters';
import { IAuthCharging } from '@interfaces/Charging';
import { addAlert } from '@actions/alert';
import { getAlerFromFireAuthError } from 'utils/functions';
import { useCharging } from './charging';
import { useDispatch } from './redux';

export const useAuth = () => {
	const [unsubscriber, setUnsuscriber] =
		useState<firebase.Unsubscribe | null>(null);
	const { setCharging } = useCharging<IAuthCharging>('auth');

	const dispatch = useDispatch();

	const login = () => {
		setCharging('login');
		app.auth()
			.signInWithPopup(googleProvider)
			.catch((err) => {
				const alert = getAlerFromFireAuthError(err.code, 'login');
				dispatch(addAlert(alert));
			})
			.finally(() => setCharging('login', false));
	};

	const logout = () => {
		setCharging('logout');
		app.auth()
			.signOut()
			.catch(console.error)
			.finally(() => setCharging('logout', false));
	};

	useEffect(() => {
		setCharging('starting');
		setUnsuscriber((current) => {
			current && current();
			return app.auth().onAuthStateChanged((fireUser) => {
				const user = userFromFire(fireUser);
				dispatch(setUser(user));
				setCharging('starting', false);
			}, console.error);
		});

		return () => {
			unsubscriber && unsubscriber();
		};
	}, []);

	return { login, logout };
};

export default {
	useAuth,
};
