import { useState } from 'react';

const useLocalStorage = <T>(key: string, initialValue: T) => {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			return initialValue;
		}
	});

	// Return a wrapped version of useState's setter function that...
	// ...persists the new value to localStorage.
	const setValue = (value: T | ((val: T) => T)) => {
		try {
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	};

	return [storedValue, setValue];
};

export default useLocalStorage;
