"use client";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/oauth/pkce";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export default async function redirectToGoogle(redirectUrlState: string = "/") {
	if (!GOOGLE_CLIENT_ID) {
		throw new Error(
			"Missing environment variable: NEXT_PUBLIC_GOOGLE_CLIENT_ID",
		);
	}
	if (!FRONTEND_URL) {
		throw new Error("Missing environment variable: NEXT_PUBLIC_FRONTEND_URL");
	}

	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	sessionStorage.setItem("google_code_verifier", codeVerifier);
	sessionStorage.setItem("oauth_state", btoa(redirectUrlState));

	const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
	url.search = new URLSearchParams({
		// response_type: "code",
		// client_id: GOOGLE_CLIENT_ID,
		// scope: "openid email",
		// redirect_uri: `${FRONTEND_URL}/oauth2/google/callback`,
		// state: btoa(redirectUrlState),
		// nonce: codeVerifier,

		response_type: "code",
		client_id: GOOGLE_CLIENT_ID,
		scope: "openid email",
		redirect_uri: `${FRONTEND_URL}/oauth2/google/callback`,
		state: btoa(redirectUrlState),
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
	}).toString();

	window.location.href = url.toString();
}
