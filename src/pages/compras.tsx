import React, { FC } from 'react';
import { useDispatch } from '@hooks/redux';
import { setGlobalCharging } from '@actions/charging';

const Ventas: FC = () => {
	const dispatch = useDispatch();

	return (
		<div
			onKeyPress={() => dispatch(setGlobalCharging('auth', true))}
			onClick={() => dispatch(setGlobalCharging('auth', true))}
			role="button"
			tabIndex={0}
		>
			Hellowis
		</div>
	);
};

export default Ventas;
