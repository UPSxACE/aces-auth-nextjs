"use client";
import {
	AvatarRoot,
	Button,
	CloseButton,
	DataListItem,
	DataListItemLabel,
	DataListItemValue,
	DataListRoot,
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
	DrawerBackdrop,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerPositioner,
	DrawerRoot,
	DrawerTitle,
	DrawerTrigger,
	EmptyStateContent,
	EmptyStateDescription,
	EmptyStateIndicator,
	EmptyStateRoot,
	EmptyStateTitle,
	Grid,
	GridItem,
	HStack,
	Icon,
	IconButton,
	MenuContent,
	MenuItem,
	MenuPositioner,
	MenuRoot,
	MenuTrigger,
	Portal,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaReact, FaRegTrashAlt } from "react-icons/fa";
import { IoIosApps } from "react-icons/io";
import { MdOutlineModeEdit, MdOutlineScreenShare } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import api from "@/api/client";
import type { GetAppsResponse } from "@/api/types";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import Textarea from "@/components/form/TextaArea";
import DashboardContextSync from "@/components/layout/dashboard/DashboardContextSync";
import LoadingSpinnerContent from "@/components/layout/LoadingSpinnerContent";
import { toaster } from "@/components/ui/chakra/toaster";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import Link from "@/components/ui/Link";
import LinkButton from "@/components/ui/LinkButton";
import demoRedirect from "@/components/utils/authorize/demoRedirect";
import PrivatePage from "@/components/utils/PrivatePage";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Apps() {
	const { data, isPending } = useQuery({
		queryKey: ["apps"],
		queryFn: api.getApps,
	});

	const apps = data?.data || [];

	return (
		<PrivatePage>
			<DashboardContextSync
				title="Apps"
				actions={
					<LinkButton
						href="/apps/create"
						backgroundColor={{
							base: "blue.800",
							_hover: "blue.900",
						}}
						colorPalette="blue"
						size="sm"
					>
						Create app
					</LinkButton>
				}
			>
				{isPending ? (
					<LoadingSpinnerContent />
				) : apps.length === 0 ? (
					<Empty />
				) : (
					<AppsPanel apps={apps} />
				)}
			</DashboardContextSync>
		</PrivatePage>
	);
}

function AppsPanel({ apps }: { apps: GetAppsResponse }) {
	return (
		<Grid templateColumns="1fr 1fr 1fr 1fr" gap={3}>
			{apps.map((a) => (
				<GridItem
					key={a.id}
					borderWidth={1}
					borderColor="gray.300/80"
					p={3}
					rounded="md"
					display="flex"
					flexDir="column"
					gap={2}
				>
					<VStack pos="relative" p={2}>
						<AvatarRoot h="108px" w="108px" mb={1}>
							<Icon fontSize="7xl">
								<FaReact />
							</Icon>
						</AvatarRoot>
						<Text
							fontWeight="bold"
							fontSize="xl"
							textAlign="center"
							lineClamp={1}
							pb={0.5}
						>
							{a.name}
						</Text>
						<Text
							fontSize="sm"
							color="gray.500/90"
							textAlign="center"
							lineClamp={1}
							pb={0.5}
						>
							{`Created at ${formatDate(new Date(a.createdAt))}`}
						</Text>
						<AppMenu id={a.id} name={a.name} />
					</VStack>
					<AppViewInfo app={a} />
				</GridItem>
			))}
		</Grid>
	);
}

function formatDate(date: Date) {
	const day = date.getDate();
	const month = date.toLocaleString("en-US", { month: "short" });
	const year = date.getFullYear();
	return `${day} ${month} ${year}`;
}

function AppMenu({ id, name }: { id: string; name: string }) {
	const [open, setOpen] = useState(false);

	const client = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: api.deleteApp,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["apps"] });
			client.invalidateQueries({ queryKey: ["connections"] });
			toaster.create({ title: "Deleted app successfully.", type: "success" });
		},
		onSettled: () => {
			setOpen(false);
		},
	});

	return (
		<MenuRoot
			positioning={{ placement: "bottom-end", offset: { mainAxis: 0 } }}
			lazyMount
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
		>
			<MenuTrigger asChild>
				<IconButton
					pos="absolute"
					right={-3}
					top={-3}
					variant="ghost"
					fontSize={"sm"}
					p={0}
					h={11}
					w={11}
					css={{
						"& svg": {
							width: "auto",
							height: "auto",
						},
					}}
				>
					<SlOptionsVertical />
				</IconButton>
			</MenuTrigger>
			<Portal>
				<MenuPositioner>
					<MenuContent>
						<MenuItem value="edit" closeOnSelect={false} asChild>
							<Link textDecor="none" href={`/apps/${id}/edit`}>
								<MdOutlineModeEdit />
								Edit
							</Link>
						</MenuItem>
						<DialogRoot onInteractOutside={() => setOpen(false)}>
							<DialogTrigger asChild>
								<MenuItem
									value="delete"
									color="fg.error"
									_hover={{ bg: "bg.error", color: "fg.error" }}
									closeOnSelect={false}
								>
									<FaRegTrashAlt />
									Delete
								</MenuItem>
							</DialogTrigger>
							<Portal>
								<DialogBackdrop />
								<DialogPositioner>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Delete {name}</DialogTitle>
										</DialogHeader>
										<DialogBody>
											<Text>
												Are you sure you want to delete this item? This action
												is permanent and <strong>cannot be undone</strong>. Once
												deleted, the item will be permanently removed and cannot
												be recovered. Please confirm if you wish to proceed.
											</Text>
										</DialogBody>
										<DialogFooter>
											<DialogActionTrigger asChild>
												<Button
													variant="outline"
													onClick={() => setOpen(false)}
												>
													Cancel
												</Button>
											</DialogActionTrigger>
											<Button
												colorPalette="red"
												onClick={() => mutate(id)}
												loading={isPending}
											>
												Delete
											</Button>
										</DialogFooter>
										<DialogCloseTrigger asChild>
											<CloseButton size="sm" />
										</DialogCloseTrigger>
									</DialogContent>
								</DialogPositioner>
							</Portal>
						</DialogRoot>
					</MenuContent>
				</MenuPositioner>
			</Portal>
		</MenuRoot>
	);
}

export type PostMutationData = {
	clientId: string;
	clientSecret: string;
};

function AppViewInfo({ app }: { app: GetAppsResponse[number] }) {
	const [postMutationData, setPostMutationData] =
		useState<PostMutationData | null>(null);

	const { mutate, isPending } = useMutation({
		mutationFn: api.resetSecret,
		onSuccess: ({ data }) => {
			setPostMutationData({
				clientId: app.clientId,
				clientSecret: data.clientSecret,
			});
		},
	});

	const startDemo = () => demoRedirect(app.clientId);

	return (
		<DrawerRoot size="lg">
			<PostMutationDialog
				postMutationData={postMutationData}
				onConfirm={() => {
					setPostMutationData(null);
					toaster.create({
						title: "Generated new client secret.",
						type: "success",
					});
				}}
			/>
			<DrawerTrigger asChild>
				<Button colorPalette="blue" variant="outline">
					View Info
				</Button>
			</DrawerTrigger>
			<Portal>
				<DrawerBackdrop />
				<DrawerPositioner>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>{app.name}</DrawerTitle>
							<IconButton
								colorPalette="blue"
								variant="outline"
								css={{
									"& svg": {
										width: "auto",
										height: "auto",
									},
								}}
								asChild
							>
								<Link href={`/apps/${app.id}/edit`} fontSize="xl">
									<MdOutlineModeEdit />
								</Link>
							</IconButton>
						</DrawerHeader>
						<DrawerBody>
							<DataListRoot orientation="horizontal">
								<DataListItem alignItems="start">
									<DataListItemLabel>Id</DataListItemLabel>
									<DataListItemValue>{app.id}</DataListItemValue>
								</DataListItem>
								<DataListItem alignItems="start">
									<DataListItemLabel>Name</DataListItemLabel>
									<DataListItemValue>{app.name}</DataListItemValue>
								</DataListItem>
								<DataListItem alignItems="start">
									<DataListItemLabel>Homepage URL</DataListItemLabel>
									<DataListItemValue>
										<Link
											colorPalette="blue"
											href={app.homepageUrl}
											target="_blank"
										>
											{app.homepageUrl}
										</Link>
									</DataListItemValue>
								</DataListItem>
								<DataListItem alignItems="start">
									<DataListItemLabel>Client ID</DataListItemLabel>
									<DataListItemValue>{app.clientId}</DataListItemValue>
								</DataListItem>
								<DataListItem alignItems="start">
									<DataListItemLabel>Client Secret</DataListItemLabel>
									<DataListItemValue>
										<Button
											variant="surface"
											size="xs"
											loading={isPending}
											onClick={() => {
												mutate(app.id);
											}}
										>
											Reset secret
										</Button>
									</DataListItemValue>
								</DataListItem>
								<DataListItem alignItems="start">
									<DataListItemLabel>Created At</DataListItemLabel>
									<DataListItemValue>
										{new Date(app.createdAt).toUTCString()}
									</DataListItemValue>
								</DataListItem>
								<DataListItem alignItems="start">
									<DataListItemLabel h={8}>Redirect URIs</DataListItemLabel>
									<DataListItemValue>
										<VStack>
											{app.redirectUris.map((uri, index) => (
												<HStack
													// biome-ignore lint/suspicious/noArrayIndexKey: No id available
													key={index}
													h={8}
												>
													<Link
														colorPalette="blue"
														href={app.homepageUrl}
														target="_blank"
													>
														{uri}
													</Link>
													<OAuthSetupInstructions
														clientId={app.clientId}
														redirectUri={uri}
													/>
												</HStack>
											))}
										</VStack>
									</DataListItemValue>
								</DataListItem>
								<DataListItem alignItems="start">
									<DataListItemLabel>Demonstration</DataListItemLabel>
									<DataListItemValue>
										<Button variant="surface" size="xs" onClick={startDemo}>
											Start demo
										</Button>
									</DataListItemValue>
								</DataListItem>
							</DataListRoot>
						</DrawerBody>
					</DrawerContent>
				</DrawerPositioner>
			</Portal>
		</DrawerRoot>
	);
}

function OAuthSetupInstructions({
	clientId,
	redirectUri,
}: {
	clientId: string;
	redirectUri: string;
}) {
	if (!FRONTEND_URL) {
		throw new Error("Missing environment variable: NEXT_PUBLIC_FRONTEND_URL");
	}
	if (!BACKEND_URL) {
		throw new Error("Missing environment variable: NEXT_PUBLIC_BACKEND_URL");
	}

	const authorizationUrl = new URL(`${FRONTEND_URL}/authorize`);
	authorizationUrl.search = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		scope: "openid profile",
		response_type: "code",
		code_challenge: "CODE_CHALLENGE",
		code_challenge_method: "S256",
		state: "STATE",
	}).toString();

	const stepOne = `// Generate a random string
const codeVerifier = generateRandomString(64);

// Create base64url-encoded SHA256 hash
const codeChallenge = base64urlencode(sha256(codeVerifier));`;

	const stepTwo = authorizationUrl
		.toString()
		.replaceAll("CODE_CHALLENGE", "<<CODE_CHALLENGE>>")
		.replaceAll("STATE", "<<STATE>>");

	const stepThree = `POST ${FRONTEND_URL}/oauth/token
Authorization: Basic BASE64(client_id:client_secret)
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=<<AUTHORIZATION_CODE>>
&redirect_uri=${encodeURIComponent(redirectUri)}
&client_id=${clientId}
&code_verifier=<<CODE_VERIFIER>>`;

	const stepFour = `${BACKEND_URL}/oauth2/jwks`;

	return (
		<DialogRoot lazyMount size="lg">
			<Tooltip openDelay={0} content="View OAuth setup instructions">
				<DialogTrigger asChild>
					<IconButton variant="surface" size="xs">
						<MdOutlineScreenShare />
					</IconButton>
				</DialogTrigger>
			</Tooltip>
			<Portal>
				<DialogBackdrop zIndex={1400} />
				<DialogPositioner>
					<DialogContent>
						<DialogHeader>
							<DialogTitle fontSize="xl">OAuth setup instructions</DialogTitle>
						</DialogHeader>
						<DialogBody gap={5} display="flex" flexDir="column">
							<Textarea
								readOnly
								invalid={false}
								label="1. Generate a code verifier and code challenge"
								description="On the client side (browser or mobile), create a random code_verifier and a corresponding code_challenge using SHA-256."
								value={stepOne}
								rows={5}
								resize="none"
							/>
							<Textarea
								readOnly
								invalid={false}
								label="2. Redirect the user to authorization endpoint"
								description="Send your user to:"
								value={stepTwo}
								rows={5}
								resize="none"
							/>
							<Textarea
								readOnly
								invalid={false}
								label="3. Handle redirect and exchange Code for tokens"
								description="Your user will be redirected back to your redirect_uri with a code parameter.\nSend this code and your original code_verifier from your backend to our token endpoint:"
								value={stepThree}
								rows={9}
								resize="none"
							/>
							<Textarea
								readOnly
								invalid={false}
								label="Verifying Tokens"
								description="To validate the ID token or access token signature, use our JSON Web Key Set (JWKS) endpoint:"
								value={stepFour}
								rows={2}
								resize="none"
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
									Ok
								</Button>
							</DialogActionTrigger>
						</DialogFooter>
					</DialogContent>
				</DialogPositioner>
			</Portal>
		</DialogRoot>
	);
}

function PostMutationDialog({
	postMutationData,
	onConfirm,
}: {
	postMutationData: PostMutationData | null;
	onConfirm: () => void;
}) {
	return (
		<DialogRoot lazyMount open={postMutationData !== null} size="lg">
			<Portal>
				<DialogBackdrop zIndex={1400} />
				<DialogPositioner>
					<DialogContent>
						<DialogHeader>
							<DialogTitle fontSize="xl">
								New client secret generated
							</DialogTitle>
						</DialogHeader>
						<DialogBody>
							<Text>
								This is the only time you’ll be able to view the client secret.
							</Text>
							<Text mb={6}>
								Please <strong>copy and store it securely</strong> — you won’t
								be able to see it again.
							</Text>
							<Input
								readOnly
								invalid={false}
								label="Client ID"
								value={postMutationData?.clientId || ""}
								mb={3}
							/>
							<PasswordInput
								readOnly
								invalid={false}
								label="Client Secret"
								value={postMutationData?.clientSecret || ""}
							/>
						</DialogBody>
						<DialogFooter>
							<Button
								backgroundColor={{
									base: "blue.800",
									_hover: "blue.900",
								}}
								colorPalette="blue"
								onClick={onConfirm}
							>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</DialogPositioner>
			</Portal>
		</DialogRoot>
	);
}

function Empty() {
	return (
		<EmptyStateRoot mt="auto" mb="auto">
			<EmptyStateContent>
				<EmptyStateIndicator>
					<Icon fontSize="6xl" color="gray.400/70">
						<IoIosApps />
					</Icon>
				</EmptyStateIndicator>
				<VStack textAlign="center">
					<EmptyStateTitle fontSize="xl">No OAuth Apps found</EmptyStateTitle>
					<EmptyStateDescription fontSize="lg">
						You did not create any OAuth App yet
					</EmptyStateDescription>
				</VStack>
			</EmptyStateContent>
		</EmptyStateRoot>
	);
}
