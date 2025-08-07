"use client";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import useSession from "./useSession";

export default function GuestOnlyPage({
	redirectUrl = "/",
	fallback,
	children,
}: {
	redirectUrl?: string;
	fallback: ReactNode;
	children: ReactNode;
}) {
	const session = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session.loggedIn) {
			router.push(redirectUrl);
		}
	}, [session, router, redirectUrl]);

	if (session.loading || session.loggedIn) {
		return fallback;
	}

	return children;
}
