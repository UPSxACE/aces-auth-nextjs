"use client";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/oauth/pkce";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export default async function demoRedirect(clientId: string) {
	if (!FRONTEND_URL) {
		throw new Error("Missing environment variable: NEXT_PUBLIC_FRONTEND_URL");
	}

	const redirectUrlState = `/oauth2/demo/callback/success?client_id=${clientId}`;

	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	sessionStorage.setItem("demo_code_verifier", codeVerifier);
	sessionStorage.setItem("oauth_state", btoa(redirectUrlState));

	const url = new URL(`${FRONTEND_URL}/authorize`);
	url.search = new URLSearchParams({
		client_id: clientId,
		response_type: "code",
		scope: "openid profile",
		redirect_uri: `${FRONTEND_URL}/oauth2/demo/callback`,
		state: btoa(redirectUrlState),
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
	}).toString();

	window.location.href = url.toString();
}
