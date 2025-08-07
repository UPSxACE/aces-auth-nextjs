"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { toaster } from "@/components/ui/chakra/toaster";
import useAttemptOAuthLogin from "@/lib/session/useAttemptOAuthLogin";
import useOnce from "@/lib/utils/react/useOnce";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export type CallbackPageProps = {
	provider: string;
	children: ReactNode;
};

export default function CallbackPage({
	children,
	provider,
}: CallbackPageProps) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const error = searchParams.get("error");
	const errorDescription = searchParams.get("error_description");
	const code = searchParams.get("code");
	const state = searchParams.get("state");

	const { attempt } = useAttemptOAuthLogin({
		provider,
		onSuccess: () => {
			const oAuthStateCache = sessionStorage.getItem("oauth_state");

			if (state && state === oAuthStateCache) {
				const postLoginRedirectUri = atob(state);
				if (isSafeRelativeUrl(postLoginRedirectUri))
					return router.push(postLoginRedirectUri);
			}

			router.push("/");
		},
		onError: () => {
			router.push("/");
		},
	});

	useOnce(() => {
		if (error && errorDescription) {
			setTimeout(
				() =>
					toaster.create({
						type: "error",
						title: errorDescription,
					}),
				0,
			);

			return router.push("/");
		}

		if (!FRONTEND_URL) {
			throw new Error("Missing environment variable: NEXT_PUBLIC_FRONTEND_URL");
		}

		const codeVerifier = sessionStorage.getItem(`${provider}_code_verifier`);
		const oAuthStateCache = sessionStorage.getItem("oauth_state");
		const redirectUri = `${FRONTEND_URL}/oauth2/${provider}/callback`;

		if (code && codeVerifier && state === oAuthStateCache) {
			if (provider === "demo") {
				const oAuthStateCache = sessionStorage.getItem("oauth_state");

				if (state && state === oAuthStateCache) {
					const postLoginRedirectUri = atob(state);
					if (isSafeRelativeUrl(postLoginRedirectUri)) {
						// console.log(code + ";", codeVerifier + ";");

						return router.push(postLoginRedirectUri);
					}
				}

				setTimeout(
					() =>
						toaster.create({
							title: "Invalid or out of sync state.",
							type: "error",
						}),
					0,
				);
				return router.push("/");
			}

			attempt({ code, codeVerifier, redirectUri });
			return;
		}

		setTimeout(
			() =>
				toaster.create({
					title: "Invalid or out of sync state.",
					type: "error",
				}),
			0,
		);
		router.push("/");
	});

	return children;
}

function isSafeRelativeUrl(url: string) {
	if (!FRONTEND_URL) {
		throw new Error("Missing environment variable: NEXT_PUBLIC_FRONTEND_URL");
	}

	try {
		// Attempt to parse the URL as a full URL
		const parsed = new URL(url, FRONTEND_URL); // Base added to support relative parsing

		// Check if the input was relative by seeing if the origin is only from the base
		return parsed.origin === FRONTEND_URL && url.startsWith("/");
	} catch (_) {
		// Invalid URLs should be considered unsafe
		return false;
	}
}
