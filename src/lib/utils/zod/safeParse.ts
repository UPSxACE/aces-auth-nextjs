import type z from "zod";

export default function safeParse<T>(schema: z.ZodType<T>, input: unknown) {
	const result = schema.safeParse(input);
	return result.success ? result.data : null;
}
