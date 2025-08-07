"use client";

import axios, { type AxiosError, type AxiosResponse } from "axios";
import { useEffect } from "react";
import http, { http2 } from "../http";
import logout from "../logout";
import type { SessionState } from "./SessionProviderInternal";

declare module "axios" {
	interface InternalAxiosRequestConfig {
		_retry: boolean;
	}
}

export default function useHttpInterceptor({
	session,
	setSession,
}: SessionState) {
	useEffect(() => {
		const reqId = http.interceptors.request.use((config) => {
			if (session.accessToken && !config._retry)
				config.headers.Authorization = `Bearer ${session.accessToken}`;
			return config;
		});

		const resId = http.interceptors.response.use(null, async (res) => {
			if (res.status === 401 && !res.config._retry) {
				const originalRequest = res.config;
				originalRequest._retry = true;

				const newAccessToken = await http2
					.post("/auth/refresh")
					.then((res: AxiosResponse<{ accessToken: string }>) => {
						return res.data.accessToken;
					})
					.catch(() => null);

				if (newAccessToken) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return http(originalRequest).then((res) => {
						setSession((s) => ({ ...s, accessToken: newAccessToken }));
						return res;
					});
				}
			}

			if (res.status === 401) {
				logout();
				setSession((s) => ({
					...s,
					accessToken: null,
					loggedIn: false,
					userInfo: null,
				}));
			}

			return Promise.reject(res);
		});

		return () => {
			http.interceptors.request.eject(reqId);
			http.interceptors.response.eject(resId);
		};
	}, [session.accessToken, setSession]);
}
