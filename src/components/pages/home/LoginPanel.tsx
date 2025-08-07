"use client";
import {
	AvatarRoot,
	Box,
	Button,
	HStack,
	Icon,
	Separator,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	type MouseEventHandler,
	type ReactNode,
	useMemo,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import FormAlert from "@/components/form/FormAlert";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import Link from "@/components/ui/Link";
import useAttemptLogin from "@/lib/session/useAttemptLogin";
import redirectToDiscord from "@/modules/oauth/redirectToDiscord";
import redirectToGithub from "@/modules/oauth/redirectToGithub";
import redirectToGoogle from "@/modules/oauth/redirectToGoogle";
import extractErrorsData from "@/modules/utils/extractErrorsData";

type FormValues = {
	identifier: string;
	password: string;
};

export default function LoginPanel() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = useForm<FormValues>();

	const router = useRouter();

	const params = useSearchParams();
	const appName = params.get("app_name");
	const state = params.get("state");

	const stateful = Boolean(appName && state);
	const registerUrl = stateful
		? `/register?app_name=${appName}&state=${state}`
		: "/register";

	const redirectUrlState = useMemo(() => {
		try {
			return appName && state ? `/authorize?${atob(state)}` : "/";
		} catch {
			return "/";
		}
	}, [appName, state]);

	const onSuccessOverride =
		isSafeRelativeUrl(redirectUrlState) && redirectUrlState !== "/"
			? () => {
					window.location.href = redirectUrlState;
				}
			: undefined;

	const { attempt, isPending } = useAttemptLogin({
		onSuccessOverride,
		onSuccess: () => {
			router.push("/");
		},
		onError: (error) => {
			if (error.status === 401) {
				setErrorMessage("Invalid credentials. Please try again.");
				return;
			}

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
					if (error.status === 404)
						return "User not found. Please check your credentials.";

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

	return (
		<VStack
			borderWidth={1}
			borderStyle="solid"
			borderColor="gray.300/40"
			boxShadow="xs"
			backgroundColor="white"
			padding={9}
			rounded="md"
			width={600}
			align="start"
			gap={9}
		>
			<Text fontSize="3xl" fontWeight="semibold">
				Sign in{stateful && ` to ${appName}`}
			</Text>
			<VStack w="full" align="start">
				<Text fontSize="lg">
					Don't have an account?{" "}
					<Link colorPalette="blue" href={registerUrl} fontWeight="medium">
						Register here
					</Link>
				</Text>
			</VStack>
			<FormAlert errorMessage={errorMessage} />
			<Box as="form" width="full" onSubmit={onSubmit}>
				<VStack gap={6} align="flex-start">
					<Input
						label="Username or email"
						invalid={!!errors.identifier}
						error={errors.identifier?.message}
						{...register("identifier")}
					/>
					<PasswordInput
						label="Password"
						invalid={!!errors.password}
						error={errors.password?.message}
						{...register("password")}
					/>
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
						disabled={formHasErrors}
					>
						Submit
					</Button>

					<HStack width="full">
						<Separator flex="1" />
						<Text flexShrink="0" fontSize="xl">
							or
						</Text>
						<Separator flex="1" />
					</HStack>

					<HStack width="full" justify="center" gap={8}>
						<Google redirectUrlState={redirectUrlState} />
						<Github redirectUrlState={redirectUrlState} />
						<Facebook redirectUrlState={redirectUrlState} />
					</HStack>
				</VStack>
			</Box>
		</VStack>
	);
}

function Google({ redirectUrlState }: { redirectUrlState?: string }) {
	return (
		<SocialMediaIcon onClick={() => redirectToGoogle(redirectUrlState)}>
			<FcGoogle />
		</SocialMediaIcon>
	);
}

function Github({ redirectUrlState }: { redirectUrlState?: string }) {
	return (
		<SocialMediaIcon onClick={() => redirectToGithub(redirectUrlState)}>
			<FaGithub />
		</SocialMediaIcon>
	);
}

function Facebook({ redirectUrlState }: { redirectUrlState?: string }) {
	return (
		<AvatarRoot size="xl" backgroundColor="#5865F2">
			<Button
				unstyled
				cursor="pointer"
				type="button"
				onClick={() => redirectToDiscord(redirectUrlState)}
			>
				<Icon fontSize="4xl">
					<FaDiscord color="white" />
				</Icon>
			</Button>
		</AvatarRoot>
	);
}

function SocialMediaIcon({
	onClick = () => {},
	children,
}: {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
}) {
	return (
		<Button unstyled cursor="pointer" type="button" onClick={onClick}>
			<Icon fontSize="5xl">{children}</Icon>
		</Button>
	);
}

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

function isSafeRelativeUrl(url: string) {
	if (!FRONTEND_URL) {
		throw new Error("Missing environment variable: NEXT_PUBLIC_FRONTEND_URL");
	}

	try {
		// Attempt to parse the URL as a full URL
		const parsed = new URL(url, FRONTEND_URL); // Base added to support relative parsing

		// Check if the input was relative by seeing if the origin is only from the base
		return parsed.origin === FRONTEND_URL && url.startsWith("/");
	} catch (_) {
		// Invalid URLs should be considered unsafe
		return false;
	}
}
