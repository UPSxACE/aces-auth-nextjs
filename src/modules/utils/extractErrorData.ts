import type { AxiosError } from "axios";
import safeParse from "@/lib/utils/zod/safeParse";
import ErrorResponse from "../schemas/ErrorResponse";

export default function extractErrorData(
	axiosErrorResponse: AxiosError<unknown>,
) {
	const data = safeParse(ErrorResponse, axiosErrorResponse?.response?.data);
	if (data) {
		return data.error;
	}
	return null;
}
