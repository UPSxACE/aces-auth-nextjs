"use client";

import {
	Box,
	Button,
	CheckboxControl,
	CheckboxHiddenInput,
	CheckboxIndicator,
	CheckboxLabel,
	CheckboxRoot,
	CloseButton,
	DialogActionTrigger,
	DialogBackdrop,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPositioner,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
	Portal,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import FormAlert from "@/components/form/FormAlert";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import { Prose } from "@/components/ui/chakra/prose";
import Link from "@/components/ui/Link";
import privacyPolicy from "@/legal/privacyPolicy";
import termsAndConditions from "@/legal/termsAndConditions";
import useAttemptRegistration from "@/lib/session/useAttemptRegistration";
import extractErrorData from "@/modules/utils/extractErrorData";
import extractErrorsData from "@/modules/utils/extractErrorsData";

type FormValues = {
	username: string;
	email: string;
	name: string;
	password: string;
	confirmPassword: string;
};

export default function RegisterPanel() {
	const [legalCheck, setLegalCheck] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = useForm<FormValues>();

	const router = useRouter();

	const { attempt, isPending } = useAttemptRegistration({
		onSuccess: () => {
			router.push("/register/success");
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
					const registerError = extractErrorData(error);
					if (registerError) return registerError;

					if (isValid && errorMessage === null)
						return "An unexpected error occurred. Please try again later.";

					return message;
				});
		},
	});

	const formHasErrors = Object.keys(errors).length > 0;

	const onSubmit = handleSubmit(async (data) => {
		setErrorMessage(null);
		attempt(data);
	});

	const params = useSearchParams();
	const appName = params.get("app_name");
	const state = params.get("state");

	const stateful = Boolean(appName && state);
	const loginUrl = stateful ? `/?app_name=${appName}&state=${state}` : "/";

	return (
		<VStack
			borderWidth={1}
			borderStyle="solid"
			borderColor="gray.300/40"
			boxShadow="xs"
			backgroundColor="white"
			padding={9}
			rounded="md"
			minWidth={600}
			align="start"
			gap={9}
		>
			<Text fontSize="3xl" fontWeight="semibold">
				Register
			</Text>
			<Text fontSize="lg">
				Already have an account?{" "}
				<Link colorPalette="blue" href={loginUrl} fontWeight="medium">
					Login here
				</Link>
			</Text>
			<FormAlert errorMessage={errorMessage} />
			<Box as="form" width="full" onSubmit={onSubmit}>
				<VStack gap={6} align="flex-start">
					<Input
						label="Username"
						invalid={!!errors.username}
						error={errors.username?.message}
						{...register("username")}
					/>
					<Input
						label="Name"
						invalid={!!errors.name}
						error={errors.name?.message}
						{...register("name")}
					/>
					<Input
						label="Email"
						invalid={!!errors.email}
						error={errors.email?.message}
						type="email"
						{...register("email")}
					/>
					<PasswordInput
						label="Password"
						invalid={!!errors.password}
						error={errors.password?.message}
						{...register("password")}
					/>
					<PasswordInput
						label="Confirm Password"
						invalid={!!errors.confirmPassword}
						error={errors.confirmPassword?.message}
						{...register("confirmPassword", {
							validate: (value, formValues) => {
								return (
									value === formValues.password ||
									"Passwords do not match. Please make sure both fields are the same."
								);
							},
						})}
					/>
					<CheckboxRoot
						checked={legalCheck}
						onChange={() => setLegalCheck((c) => !c)}
					>
						<CheckboxHiddenInput />
						<CheckboxControl>
							<CheckboxIndicator />
						</CheckboxControl>
						<CheckboxLabel>
							I accept the{" "}
							<TermsAndConditionsDialog>
								<Text asChild color="blue.700" cursor="pointer">
									<button type="button">terms and conditions</button>
								</Text>
							</TermsAndConditionsDialog>{" "}
							and{" "}
							<PrivacyPolicyDialog>
								<Text asChild color="blue.700" cursor="pointer">
									<button type="button">privacy policy</button>
								</Text>
							</PrivacyPolicyDialog>
						</CheckboxLabel>
					</CheckboxRoot>
					<Button
						marginTop={3}
						type="submit"
						backgroundColor={{
							base: "blue.800",
							_hover: "blue.900",
						}}
						colorPalette="blue"
						width="full"
						size="lg"
						loading={isPending}
						disabled={formHasErrors || !legalCheck}
					>
						Submit
					</Button>
				</VStack>
			</Box>
		</VStack>
	);
}

function TermsAndConditionsDialog({ children }: { children: ReactNode }) {
	return (
		<LegalityModal title="Terms and Conditions" content={termsAndConditions}>
			{children}
		</LegalityModal>
	);
}

function PrivacyPolicyDialog({ children }: { children: ReactNode }) {
	return (
		<LegalityModal title="Privacy Policy" content={privacyPolicy}>
			{children}
		</LegalityModal>
	);
}

function LegalityModal({
	title,
	content,
	children,
}: {
	title: string;
	content: string;
	children: ReactNode;
}) {
	return (
		<DialogRoot size="xl">
			<DialogTrigger asChild>{children}</DialogTrigger>
			<Portal>
				<DialogBackdrop />
				<DialogPositioner>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{title}</DialogTitle>
						</DialogHeader>
						<DialogBody>
							<Prose
								width="full"
								maxW="unset"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: safe html
								dangerouslySetInnerHTML={{ __html: content }}
							/>
						</DialogBody>
						<DialogFooter>
							<DialogActionTrigger asChild>
								<Button
									backgroundColor={{
										base: "blue.800",
										_hover: "blue.900",
									}}
									colorPalette="blue"
								>
									Understood
								</Button>
							</DialogActionTrigger>
							{/* <Button>Save</Button> */}
						</DialogFooter>
						<DialogCloseTrigger asChild>
							<CloseButton size="sm" />
						</DialogCloseTrigger>
					</DialogContent>
				</DialogPositioner>
			</Portal>
		</DialogRoot>
	);
}
