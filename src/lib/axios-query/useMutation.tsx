import {
	type MutationFunction,
	useMutation as useTanstackMutation,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { ErrorCallback, SuccessCallback } from "./types";

export default function useMutation<
	TResponseData = unknown,
	TRequestVariables = void,
	TErrorResponseData = unknown,
>({
	mutationFn,
	onSuccess,
	onError,
}: {
	mutationFn?: MutationFunction<
		AxiosResponse<TResponseData, TRequestVariables>,
		TRequestVariables
	>;
	onSuccess?: SuccessCallback<TResponseData, TRequestVariables>;
	onError?: ErrorCallback<TRequestVariables, TErrorResponseData>;
}) {
	const { mutate, isPending } = useTanstackMutation({
		mutationFn,
		onSuccess,
		onError,
	});

	return { mutate, isPending };
}
