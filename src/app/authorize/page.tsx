"use client";
import {
	AvatarRoot,
	Button,
	Flex,
	HStack,
	Icon,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import api from "@/api/client";
import { PublicAppInfo } from "@/api/types";
import LoadingSpinnerPage from "@/components/layout/LoadingSpinnerPage";
import { toaster } from "@/components/ui/chakra/toaster";
import LinkButton from "@/components/ui/LinkButton";
import useAuthorizeSearchParams from "@/components/utils/authorize/useAuthorizeSearchParams";
import useSession from "@/lib/session/context/useSession";
import { http2 } from "@/lib/session/http";
import useOnce from "@/lib/utils/react/useOnce";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Authorize() {
	const session = useSession();

	if (session.loading) return <LoadingSpinnerPage />;

	return <Content />;
}

function Content() {
	const [appInfo, setAppInfo] = useState<PublicAppInfo | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const session = useSession();
	const router = useRouter();

	const authorizeParams = useAuthorizeSearchParams();
	const {
		response_type,
		client_id,
		redirect_uri,
		scope,
		state,
		code_challenge,
		code_challenge_method,
	} = authorizeParams;

	// validate params
	const scopes = processScopes(scope);

	const missingParam = [
		response_type,
		client_id,
		redirect_uri,
		scope,
		state,
		code_challenge,
		code_challenge_method,
	].some((x) => !x);

	let invalidParam = false;
	if (response_type !== "code") invalidParam = true;
	if (code_challenge_method !== "S256") invalidParam = true;
	if (scopes.length === 0) invalidParam = true;

	const validParams = !(missingParam || invalidParam);

	const authorize = () => {
		window.location.href = `${BACKEND_URL}/oauth2/authorize?${new URLSearchParams(authorizeParams).toString()}`;
	};

	const consent = () =>
		http2.post("/apps/consent", null, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
			params: {
				client_id,
				scopes: scopes.join(" "),
			},
		});

	useOnce(() => {
		if (!validParams) {
			setTimeout(
				() =>
					toaster.create({
						title: "Invalid url params.",
						type: "error",
					}),
				0,
			);
			return router.push("/");
		}

		// all params seem valid
		if (!client_id) return router.push("/");
		if (!FRONTEND_URL) {
			throw new Error("Missing environment variable: NEXT_PUBLIC_FRONTEND_URL");
		}
		if (!BACKEND_URL) {
			throw new Error("Missing environment variable: NEXT_PUBLIC_BACKEND_URL");
		}

		api
			.getAppInfo(client_id, scopes)
			.then(({ data }) => {
				if (!session.loggedIn) {
					// logged out scenario
					const params = new URLSearchParams(authorizeParams).toString();
					const state = btoa(params);

					router.push(`/?app_name=${data.name}&state=${state}`);
				}

				// logged in scenario

				if (data?.authorized) {
					// consent already given scenario
					authorize();
					return;
				}

				// requires consent scenario
				setAppInfo(data);
			})
			.catch(() => {
				router.push("/");
			});
	});

	const consentAndAuthorize = async () => {
		setSubmitting(true);
		consent()
			.then(() => {
				authorize();
			})
			.catch(() => {
				toaster.create({
					title: "Authorization failed.",
					type: "error",
				});

				router.push("/");
			});
	};

	if (!validParams || !session.loggedIn || !appInfo) {
		return <LoadingSpinnerPage />;
	}

	return (
		<Flex
			direction="column"
			minH="calc(100svh - 80px)"
			bg="gray.100/70"
			justify="center"
			align="center"
		>
			<VStack
				borderWidth={1}
				borderStyle="solid"
				borderColor="gray.300/40"
				boxShadow="xs"
				backgroundColor="white"
				padding={9}
				rounded="md"
				width={660}
				align="start"
				gap={6}
			>
				<VStack w="full" gap={4}>
					<AvatarRoot h="132px" w="132px" mb={1}>
						<Icon fontSize="7xl">
							<FaReact />
						</Icon>
					</AvatarRoot>
					<Text fontSize="2xl">
						<Text as="strong" fontWeight="semibold">
							{appInfo.name}
						</Text>{" "}
						would like to:
					</Text>
				</VStack>
				<VStack w="full" gap={0}>
					{scopes.includes("openid") && (
						<Consent message="Verify your identity to sign you in" />
					)}
					{scopes.includes("profile") && <Consent message="View your email" />}
					{scopes.includes("profile") && (
						<Consent message="view your username" />
					)}
				</VStack>
				<HStack w="full" justify="end">
					<LinkButton href="/" size="sm" variant="outline">
						Cancel
					</LinkButton>
					<Button
						onClick={consentAndAuthorize}
						backgroundColor={{
							base: "blue.800",
							_hover: "blue.900",
						}}
						colorPalette="blue"
						size="sm"
						loading={submitting}
					>
						Allow
					</Button>
				</HStack>
			</VStack>
		</Flex>
	);
}

function Consent({ message }: { message: string }) {
	return (
		<HStack
			w="full"
			borderColor="gray.300"
			borderTopWidth={{
				_first: 1,
			}}
			borderBottomWidth={1}
			py={2}
			fontSize="lg"
		>
			<Icon fontSize="5xl" color="gray.500/70" mr={1}>
				<IoPersonCircleSharp />
			</Icon>
			{message}
		</HStack>
	);
}

function processScopes(scope?: string | null) {
	if (!scope) {
		return [];
	}

	const validScopes = ["openid", "profile"];
	const requestedScopes = scope.split(" ");
	if (requestedScopes.some((s) => !validScopes.includes(s))) {
		return [];
	}

	return requestedScopes;
}
