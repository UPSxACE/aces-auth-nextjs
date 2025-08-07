"use client";
import {
	AvatarRoot,
	Button,
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
	EmptyStateContent,
	EmptyStateDescription,
	EmptyStateIndicator,
	EmptyStateRoot,
	EmptyStateTitle,
	Icon,
	Portal,
	TableBody,
	TableCell,
	TableColumnHeader,
	TableHeader,
	TableRoot,
	TableRow,
	TableScrollArea,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { PiGraph } from "react-icons/pi";
import api from "@/api/client";
import type { Connection } from "@/api/types";
import DashboardContextSync from "@/components/layout/dashboard/DashboardContextSync";
import LoadingSpinnerContent from "@/components/layout/LoadingSpinnerContent";
import { toaster } from "@/components/ui/chakra/toaster";
import PrivatePage from "@/components/utils/PrivatePage";
import useMutation from "@/lib/axios-query/useMutation";

export default function Connections() {
	const { data, isPending } = useQuery({
		queryKey: ["connections"],
		queryFn: api.getConnections,
	});

	const connections = data?.data || [];

	return (
		<PrivatePage>
			<DashboardContextSync title="Connections">
				{isPending ? (
					<LoadingSpinnerContent />
				) : connections.length === 0 ? (
					<Empty />
				) : (
					<ConnectionsPanel connections={connections} />
				)}
			</DashboardContextSync>
		</PrivatePage>
	);
}

function ConnectionsPanel({ connections }: { connections: Connection[] }) {
	return (
		<TableScrollArea borderWidth="1px" rounded="md" height="full">
			<TableRoot size="sm" stickyHeader>
				<TableHeader>
					<TableRow bg="bg.subtle">
						<TableColumnHeader></TableColumnHeader>
						<TableColumnHeader>App</TableColumnHeader>
						<TableColumnHeader>Client Id</TableColumnHeader>
						<TableColumnHeader>Connected At</TableColumnHeader>
						<TableColumnHeader>Actions</TableColumnHeader>
					</TableRow>
				</TableHeader>

				<TableBody>
					{connections.map((connection) => (
						<TableRow key={connection.app.clientId}>
							<TableCell verticalAlign="middle">
								<AvatarRoot h="32px" w="32px">
									<Icon fontSize="xl">
										<FaReact />
									</Icon>
								</AvatarRoot>
							</TableCell>
							<TableCell verticalAlign="middle">
								{connection.app.name}
							</TableCell>
							<TableCell verticalAlign="middle">
								{connection.app.clientId}
							</TableCell>
							<TableCell verticalAlign="middle">
								{formatDate(new Date(connection.grantedAt))}
							</TableCell>
							<TableCell verticalAlign="middle">
								<DisconnectButton
									clientId={connection.app.clientId}
									appName={connection.app.name}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</TableRoot>
		</TableScrollArea>
	);
}

function Empty() {
	return (
		<EmptyStateRoot mt="auto" mb="auto">
			<EmptyStateContent>
				<EmptyStateIndicator>
					<Icon fontSize="6xl" color="gray.400/70">
						<PiGraph />
					</Icon>
				</EmptyStateIndicator>
				<VStack textAlign="center">
					<EmptyStateTitle fontSize="xl">No connections found</EmptyStateTitle>
					<EmptyStateDescription fontSize="lg">
						You did not connect any OAuth App to your account yet
					</EmptyStateDescription>
				</VStack>
			</EmptyStateContent>
		</EmptyStateRoot>
	);
}

function formatDate(date: Date) {
	const day = date.getDate();
	const month = date.toLocaleString("en-US", { month: "short" });
	const year = date.getFullYear();
	return `${day} ${month} ${year}`;
}

function DisconnectButton({
	appName,
	clientId,
}: {
	appName: string;
	clientId: string;
}) {
	const [open, setOpen] = useState(false);

	const client = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: api.removeConnection,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["connections"] });
			toaster.create({
				title: "Disconnected of app successfully.",
				type: "success",
			});
			setOpen(false);
		},
	});

	return (
		<DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
			<DialogTrigger asChild>
				<Button colorPalette="red" variant="outline" size="sm">
					Disconnect
				</Button>
			</DialogTrigger>
			<Portal>
				<DialogBackdrop />
				<DialogPositioner>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Remove connection</DialogTitle>
						</DialogHeader>
						<DialogBody>
							<Text>
								Removing the connection with <strong>{appName}</strong> will
								revoke its access to your account and{" "}
								<strong>you may lose any saved data or functionality</strong>{" "}
								associated with it.
							</Text>
						</DialogBody>
						<DialogFooter>
							<DialogActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</DialogActionTrigger>
							<Button
								colorPalette="red"
								onClick={() => mutate(clientId)}
								loading={isPending}
							>
								Disconnect
							</Button>
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
