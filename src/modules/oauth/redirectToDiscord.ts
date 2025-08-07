"use client";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/oauth/pkce";

const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export default async function redirectToDiscord(
	redirectUrlState: string = "/",
) {
	if (!DISCORD_CLIENT_ID) {
		throw new Error(
			"Missing environment variable: NEXT_PUBLIC_DISCORD_CLIENT_ID",
		);
	}
	if (!FRONTEND_URL) {
		throw new Error("Missing environment variable: NEXT_PUBLIC_FRONTEND_URL");
	}

	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	sessionStorage.setItem("discord_code_verifier", codeVerifier);
	sessionStorage.setItem("oauth_state", btoa(redirectUrlState));

	const url = new URL("https://discord.com/oauth2/authorize");
	url.search = new URLSearchParams({
		client_id: DISCORD_CLIENT_ID,
		response_type: "code",
		scope: "email openid identify",
		redirect_uri: `${FRONTEND_URL}/oauth2/discord/callback`,
		state: btoa(redirectUrlState),
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
	}).toString();

	window.location.href = url.toString();
}
