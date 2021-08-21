import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';

import { useCharging } from '@hooks/charging';
import { useSelector } from '@hooks/redux';
import { IIndexCharging } from '@interfaces/Charging';

const useStyles = makeStyles(() =>
	createStyles({
		content: {
			display: 'flex',
			height: 'calc(100vh - 64px)',
			width: '100%',
			justifyContent: 'center',
			alignItems: 'center',
		},
	}),
);

const Home = () => {
	const { setCharging } = useCharging<IIndexCharging>('index');
	const user = useSelector(({ user: userSelector }) => userSelector);
	const router = useRouter();
	const classes = useStyles();

	useEffect(() => {
		if (user) {
			setCharging('redirect');
			router.push('/ventas');
		}
	}, [user]);

	useEffect(() => {
		router.prefetch('/ventas');
	}, []);

	return (
		<div className={classes.content}>
			<Typography variant="h6">Redirigiendo...</Typography>
		</div>
	);
};

export default Home;
