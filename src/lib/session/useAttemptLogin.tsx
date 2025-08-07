import type { ErrorCallback, SuccessCallback } from "../axios-query/types";
import useMutation from "../axios-query/useMutation";
import useSessionState from "./context/useSessionState";
import http from "./http";

type TResponse = { accessToken: string };
type TVariables = {
	identifier: string;
	password: string;
};

export default function useAttemptLogin({
	onSuccessOverride,
	onSuccess,
	onError,
}: {
	onSuccessOverride?: SuccessCallback<TResponse, TVariables>;
	onSuccess?: SuccessCallback<TResponse, TVariables>;
	onError?: ErrorCallback<TVariables>;
}) {
	const { setSession } = useSessionState();

	const { mutate, isPending } = useMutation<TResponse, TVariables>({
		mutationFn: async ({ identifier, password }) =>
			http.post("/auth/login", {
				identifier,
				password,
			}),
		onSuccess: (result, variables) => {
			if (onSuccessOverride) return onSuccessOverride(result, variables);

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
