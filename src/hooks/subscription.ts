import { TSubscription } from '@interfaces/Subscription';
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';

export const useSubscription = <T extends TSubscription>() => {
	const [stateSubscription, setStateSubscription] = useState<any>();

	const setSubscribtion = (name: keyof T, subscription: Subscription) => {
		setStateSubscription((current) => {
			current && current[name]?.unsubscribe();
			return {
				...current,
				[name]: subscription,
			};
		});
	};

	const unsubscribe = (name: keyof T) => {
		stateSubscription && stateSubscription[name]?.unsubscribe();
	};

	useEffect(
		() => () => {
			for (const key in stateSubscription) {
				stateSubscription && stateSubscription[key]?.unsubscribe();
			}
		},
		[],
	);

	return { setSubscribtion, unsubscribe };
};

export default {
	useSubscription,
};
