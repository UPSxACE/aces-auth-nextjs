"use client";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/oauth/pkce";

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export default async function redirectToGithub(redirectUrlState: string = "/") {
	if (!GITHUB_CLIENT_ID) {
		throw new Error(
			"Missing environment variable: NEXT_PUBLIC_GITHUB_CLIENT_ID",
		);
	}
	if (!FRONTEND_URL) {
		throw new Error("Missing environment variable: NEXT_PUBLIC_FRONTEND_URL");
	}

	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	sessionStorage.setItem("github_code_verifier", codeVerifier);
	sessionStorage.setItem("oauth_state", btoa(redirectUrlState));

	const url = new URL("https://github.com/login/oauth/authorize");
	url.search = new URLSearchParams({
		client_id: GITHUB_CLIENT_ID,
		redirect_uri: `${FRONTEND_URL}/oauth2/github/callback`,
		scope: "read:user,user:email",
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
		state: btoa(redirectUrlState),
	}).toString();

	window.location.href = url.toString();
}
