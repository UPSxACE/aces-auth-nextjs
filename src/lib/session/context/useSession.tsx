"use client";
import { useContext, useMemo } from "react";
import MissingProviderError from "@/lib/utils/errors/MissingProviderError";
import {
	SessionContext,
	SessionProviderInternal,
} from "./SessionProviderInternal";

export default function useSession() {
	const context = useContext(SessionContext);
	if (!context) {
		throw new MissingProviderError(useSession, SessionProviderInternal);
	}

	const loading = useMemo(
		() => (context.loggedIn && !context.userInfo) || context.offline,
		[context],
	);

	return { ...context, loading };
}
