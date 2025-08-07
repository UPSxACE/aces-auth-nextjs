import type { ErrorCallback, SuccessCallback } from "../axios-query/types";
import useMutation from "../axios-query/useMutation";
import useSessionState from "./context/useSessionState";
import http from "./http";

type TResponse = { accessToken: string };
type TVariables = {
	code: string;
	codeVerifier: string;
	redirectUri: string;
};

export default function useAttemptOAuthLogin({
	provider,
	onSuccess,
	onError,
}: {
	provider: string;
	onSuccess?: SuccessCallback<TResponse, TVariables>;
	onError?: ErrorCallback<TVariables>;
}) {
	const { setSession } = useSessionState();

	const { mutate, isPending } = useMutation<TResponse, TVariables>({
		mutationFn: async ({ code, codeVerifier, redirectUri }) =>
			http.post(`/auth/oauth/${provider}`, {
				code,
				codeVerifier,
				redirectUri,
			}),
		onSuccess: (result, variables) => {
			setSession((s) => ({
				...s,
				accessToken: result.data.accessToken,
				loggedIn: true,
			}));

			if (onSuccess) onSuccess(result, variables);
		},
		onError,
	});

	return { attempt: mutate, isPending };
}
