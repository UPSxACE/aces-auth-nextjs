"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "@/api/client";
import useMutation from "@/lib/axios-query/useMutation";
import extractErrorsData from "@/modules/utils/extractErrorsData";

type FormValues = {
	name: string;
	homepageUrl: string;
	redirectUris: { value: string }[];
};

export type PostMutationData = {
	clientId: string;
	clientSecret: string;
};

export default function useFormState() {
	// form
	const [postMutationData, setPostMutationData] =
		useState<PostMutationData | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const methods = useForm<FormValues>({
		defaultValues: {
			redirectUris: [{ value: "" }],
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

	// mutation
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: api.createApp,
		onSuccess: ({ data }) => {
			queryClient.invalidateQueries({ queryKey: ["apps"] });
			setPostMutationData({
				clientId: data.clientId,
				clientSecret: data.clientSecret,
			});
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
			...data,
			redirectUris: data.redirectUris.map((uri) => uri.value),
		};
		mutate(cleanData);
	});

	return {
		postMutationData,
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
