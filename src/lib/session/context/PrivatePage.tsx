"use client";
import { type ReactNode, useEffect } from "react";
import useSession from "./useSession";
import { useRouter } from "next/navigation";

export default function PrivatePage({
	fallback,
	redirectUrl = "/",
	children,
}: {
	redirectUrl?: string;
	fallback: ReactNode;
	children: ReactNode;
}) {
	const session = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!session.loggedIn) {
			router.push(redirectUrl);
		}
	}, [session, router, redirectUrl]);

	if (!session.loggedIn) {
		return fallback;
	}

	return children;
}
