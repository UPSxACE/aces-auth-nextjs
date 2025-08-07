import z from "zod";

const ErrorsResponse = z.object({
	errors: z.record(z.string(), z.string()),
});

export default ErrorsResponse;
