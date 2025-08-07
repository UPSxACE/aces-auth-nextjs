"use client";
import { Box, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { FormProvider } from "react-hook-form";
import Input from "@/components/form/Input";
import StringArrayInput from "@/components/form/StringArrayInput";
import type useFormState from "./useFormState";

export function Form({
	state,
	children,
}: {
	state: ReturnType<typeof useFormState>;
	children: ReactNode;
}) {
	const { methods, fields, register, errors, append, remove, onSubmit } = state;

	return (
		<FormProvider {...methods}>
			<Box id="create-app-form" as="form" width="full" onSubmit={onSubmit}>
				<VStack gap={6}>
					{children}
					<Input
						label="App name"
						invalid={!!errors.name}
						error={errors.name?.message}
						{...register("name")}
					/>
					<Input
						label="Homepage URL"
						invalid={!!errors.homepageUrl}
						error={errors.homepageUrl?.message}
						{...register("homepageUrl")}
					/>
					<StringArrayInput
						fieldName="redirectUris"
						label="Redirect URIs"
						invalid={!!errors.redirectUris}
						error={errors.redirectUris?.message}
						fields={fields}
						append={append}
						remove={remove}
					/>
				</VStack>
			</Box>
		</FormProvider>
	);
}
