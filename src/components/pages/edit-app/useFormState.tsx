"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "@/api/client";
import type { App } from "@/api/types";
import { toaster } from "@/components/ui/chakra/toaster";
import useMutation from "@/lib/axios-query/useMutation";
import extractErrorsData from "@/modules/utils/extractErrorsData";

type FormValues = {
	name: string;
	homepageUrl: string;
	redirectUris: { value: string }[];
};

export default function useFormState(defaults: App) {
	// form
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const methods = useForm<FormValues>({
		defaultValues: {
			name: defaults.name,
			homepageUrl: defaults.homepageUrl,
			redirectUris: defaults.redirectUris.map((u) => ({ value: u })),
		},
	});

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "redirectUris",
	});

	// router
	const router = useRouter();

	// mutation
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: api.updateApp,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["apps", defaults.id] });
			toaster.create({ title: "Updated app successfully.", type: "success" });
			router.push("/apps");
		},
		onError: (error) => {
			let formError = false;

			if (error.status === 400) {
				const errors = extractErrorsData(error);
				if (errors) {
					formError = true;
					Object.entries(errors).forEach(([key, message]) => {
						setError(key as keyof FormValues, { type: "value", message });
					});
				}
			}

			if (!formError)
				setErrorMessage((message) => {
					if (isValid && errorMessage === null)
						return "An unexpected error occurred. Please try again later.";

					return message;
				});
		},
	});

	// submission
	const formHasErrors = Object.keys(errors).length > 0;

	const onSubmit = handleSubmit(async (data) => {
		setErrorMessage(null);
		const cleanData = {
			id: defaults.id,
			...data,
			redirectUris: data.redirectUris.map((uri) => uri.value),
		};
		mutate(cleanData);
	});

	return {
		methods,
		isPending,
		errorMessage,
		fields,
		register,
		errors,
		append,
		remove,
		formHasErrors,
		onSubmit,
	};
}
