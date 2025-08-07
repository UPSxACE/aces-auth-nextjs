"use client";
import { useEffect, useRef } from "react";

export default function useOnce<T>(callback: () => T) {
	const done = useRef(false);

	useEffect(() => {
		if (!done.current) {
			done.current = true;
			callback();
		}
	}, [callback]);

	return null;
}
