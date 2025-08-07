import type { AxiosError } from "axios";
import safeParse from "@/lib/utils/zod/safeParse";
import ErrorsResponse from "../schemas/ErrorsResponse";

export default function extractErrorsData(
	axiosErrorResponse: AxiosError<unknown>,
) {
	const data = safeParse(ErrorsResponse, axiosErrorResponse?.response?.data);
	if (data) {
		const normalizedErrors: typeof data.errors = {};

		for (const [key, value] of Object.entries(data.errors)) {
			const arrayElementErrorMatch = key.match(/^(.*)\[\d+\]$/);
			if (arrayElementErrorMatch) {
				normalizedErrors[arrayElementErrorMatch[1]] = value;
			} else {
				normalizedErrors[key] = value;
			}
		}

		return normalizedErrors;
	}
	return null;
}
