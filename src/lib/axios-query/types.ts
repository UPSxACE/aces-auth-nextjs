import type { AxiosError, AxiosResponse } from "axios";

export type SuccessCallback<
	TResponseData = unknown,
	TRequestVariables = void,
> = (data: AxiosResponse<TResponseData>, variables: TRequestVariables) => void;

export type ErrorCallback<
	TRequestVariables = void,
	TErrorResponseData = unknown,
> = (
	data: AxiosError<TErrorResponseData>,
	variables: TRequestVariables,
) => void;
