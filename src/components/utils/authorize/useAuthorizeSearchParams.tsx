"use client";

import { useSearchParams } from "next/navigation";

export type AuthorizeParams = {
	response_type?: string;
	client_id?: string;
	redirect_uri?: string;
	scope?: string;
	state?: string;
	code_challenge?: string;
	code_challenge_method?: string;
};

export default function useAuthorizeSearchParams() {
	const searchParams = useSearchParams();

	const response_type = searchParams.get("response_type");
	const client_id = searchParams.get("client_id");
	const redirect_uri = searchParams.get("redirect_uri");
	const scope = searchParams.get("scope");
	const state = searchParams.get("state");
	const code_challenge = searchParams.get("code_challenge");
	const code_challenge_method = searchParams.get("code_challenge_method");

	const resolvedParams: AuthorizeParams = {};

	Object.entries({
		response_type,
		client_id,
		redirect_uri,
		scope,
		state,
		code_challenge,
		code_challenge_method,
	}).forEach(([key, value]) => {
		if (value) resolvedParams[key as keyof AuthorizeParams] = value;
	});

	return resolvedParams;
}
