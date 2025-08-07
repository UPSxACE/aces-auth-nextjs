"use client";
import { useContext } from "react";
import MissingProviderError from "@/lib/utils/errors/MissingProviderError";
import {
	SessionProviderInternal,
	SessionStateContext,
} from "./SessionProviderInternal";

export default function useSessionState() {
	const context = useContext(SessionStateContext);
	if (!context) {
		throw new MissingProviderError(useSessionState, SessionProviderInternal);
	}

	return context;
}
