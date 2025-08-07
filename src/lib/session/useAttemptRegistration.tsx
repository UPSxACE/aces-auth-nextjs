import type { ErrorCallback, SuccessCallback } from "../axios-query/types";
import useMutation from "../axios-query/useMutation";
import http from "./http";

type TResponse = { accessToken: string };
type TVariables = {
	username: string;
	email: string;
	name: string;
	password: string;
};

export default function useAttemptRegistration({
	onSuccess,
	onError,
}: {
	onSuccess?: SuccessCallback<TResponse, TVariables>;
	onError?: ErrorCallback<TVariables>;
}) {
	const { mutate, isPending } = useMutation<TResponse, TVariables>({
		mutationFn: async ({ username, email, name, password }) =>
			http.post("/auth/register", {
				username,
				email,
				name,
				password,
			}),
		onSuccess,
		onError,
	});

	return { attempt: mutate, isPending };
}
