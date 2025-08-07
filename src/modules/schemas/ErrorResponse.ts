import z from "zod";

const ErrorResponse = z.object({
	error: z.string(),
});

export default ErrorResponse;
