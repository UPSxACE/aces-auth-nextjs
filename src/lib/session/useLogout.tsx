import type { ErrorCallback, SuccessCallback } from "../axios-query/types";
import useMutation from "../axios-query/useMutation";
import useSessionState from "./context/useSessionState";
import http from "./http";

export default function useLogout({
	onSuccess,
	onError,
}: {
	onSuccess?: SuccessCallback;
	onError?: ErrorCallback;
} = {}) {
	const { setSession } = useSessionState();

	const { mutate, isPending } = useMutation({
		mutationFn: async () => http.post("/auth/logout"),
		onSuccess: (result, variables) => {
			setSession(() => ({
				accessToken: null,
				loggedIn: false,
				userInfo: null,
				offline: false,
			}));

			if (onSuccess) onSuccess(result, variables);
		},
		onError,
	});

	return { logout: mutate, isPending };
}
