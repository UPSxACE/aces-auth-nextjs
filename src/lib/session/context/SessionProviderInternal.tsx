"use client";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import {
	createContext,
	type Dispatch,
	type SetStateAction,
	useEffect,
	useState,
} from "react";
import { toaster } from "@/components/ui/chakra/toaster";
import http from "../http";
import useHttpInterceptor from "./useHttpInterceptor";

export type UserInfo = {
	username: string;
	email: string;
	name: string | null;
};

export type Session = {
	loggedIn: boolean;
	accessToken: string | null;
	userInfo: UserInfo | null;
	offline: boolean;
};

export type SessionState = {
	session: Session;
	setSession: Dispatch<SetStateAction<Session>>;
};

export const SessionContext = createContext<Session | null>(null);
export const SessionStateContext = createContext<SessionState | null>(null);

export function SessionProviderInternal({
	loggedInDefault = false,
	children,
}: {
	loggedInDefault?: boolean;
	children: React.ReactNode;
}) {
	const router = useRouter();

	const [session, setSession] = useState<Session>({
		loggedIn: loggedInDefault,
		accessToken: null,
		userInfo: null,
		offline: false,
	});

	useHttpInterceptor({ session, setSession });

	const { data: userInfo } = useQuery({
		queryKey: ["user-info", session.accessToken],
		queryFn: () =>
			http.get("/auth/me").then(async (res) => {
				if (!res.data?.username) {
					const newAccessToken = await http
						.post("/auth/refresh")
						.then((res: AxiosResponse<{ accessToken: string }>) => {
							return res.data.accessToken;
						});
					if (newAccessToken)
						setSession((s) => ({ ...s, accessToken: newAccessToken }));

					return null;
				}

				return {
					username: res.data?.username,
					email: res.data?.email,
					name: res.data?.name,
				};
			}),
		enabled: session.loggedIn && session.accessToken !== null,
		retry: false,
	});

	useEffect(() => {
		if (session.loggedIn && userInfo && !session.userInfo) {
			setSession((s) => ({ ...s, userInfo: userInfo }));
		}
	}, [session, userInfo]);

	useEffect(() => {
		if (!session.loggedIn) {
			setSession((s) => ({ ...s, userInfo: null }));
		}
	}, [session.loggedIn]);

	useEffect(() => {
		const controller = new AbortController();

		if (session.loggedIn && !session.accessToken) {
			http
				.post("/auth/refresh", {
					signal: controller.signal,
				})
				.then((res: AxiosResponse<{ accessToken: string }>) => {
					setSession((s) => ({
						...s,
						accessToken: res.data.accessToken,
						loggedIn: true,
					}));
				})
				.catch((err: AxiosError) => {
					if (err?.response?.status !== 401) {
						toaster.create({
							title:
								"We're having trouble connecting right now. Please try again in a few minutes.",
							type: "error",
							closable: false,
							duration: Infinity,
						});
						return setSession((s) => ({ ...s, offline: true }));
					}

					setSession({
						accessToken: null,
						loggedIn: false,
						userInfo: null,
						offline: false,
					});

					toaster.create({
						title: "Session expired.",
						type: "error",
					});

					router.push(
						process.env.NEXT_PUBLIC_SESSION_POSTLOGIN_REDIRECT_ROUTE || "/",
					);
				});
		}

		return () => controller.abort();
	}, [session.loggedIn, session.accessToken, router]);

	return (
		<SessionContext.Provider value={session}>
			<SessionStateContext.Provider value={{ session, setSession }}>
				{children}
			</SessionStateContext.Provider>
		</SessionContext.Provider>
	);
}
