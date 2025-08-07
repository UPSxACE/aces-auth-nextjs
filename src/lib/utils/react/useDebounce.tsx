import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay = 500, debounceTargets?: T[]) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		if (!debounceTargets || debounceTargets.includes(value)) {
			const timeout = setTimeout(() => {
				setDebouncedValue(value);
			}, delay);

			return () => clearTimeout(timeout);
		}

		setDebouncedValue(value);
	}, [value, delay, debounceTargets]);

	return debouncedValue;
}

export default useDebounce;
