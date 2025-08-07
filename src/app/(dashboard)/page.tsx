"use client";
import { Flex, Text, VStack } from "@chakra-ui/react";
import Input from "@/components/form/Input";
import DashboardContextSync from "@/components/layout/dashboard/DashboardContextSync";
import LoginPanel from "@/components/pages/home/LoginPanel";
import useSession from "@/lib/session/context/useSession";
import IllegalClientStateError from "@/lib/utils/errors/IllegalClientStateError";

export default function Home() {
	const session = useSession();

	if (!session.loggedIn) {
		return <Anonymous />;
	}

	return <LoggedIn />;
}

function LoggedIn() {
	const { userInfo } = useSession();

	if (!userInfo) {
		throw new IllegalClientStateError();
	}

	return (
		<DashboardContextSync title="Profile">
			<VStack gap={6}>
				<VStack w="full" align="stretch" gap={1}>
					<Text fontSize="2xl" fontWeight="semibold" mb={1}>
						User Information
					</Text>
					<Text fontSize="md" fontWeight="normal" color="gray.900/80">
						View public information about yourself.
					</Text>
					<Text fontSize="md" fontWeight="normal" color="gray.900/80">
						This section provides a clear overview of your account details and
						identity within the system.
					</Text>
				</VStack>
				<Input
					readOnly
					invalid={false}
					label="Username"
					value={userInfo.username}
				/>
				<Input
					readOnly
					invalid={false}
					label="Name"
					value={userInfo.name || ""}
				/>
				<Input
					readOnly
					invalid={false}
					label="Email"
					value={userInfo.email || ""}
				/>
			</VStack>
		</DashboardContextSync>
	);
}

function Anonymous() {
	return (
		<Flex
			direction="column"
			minH="calc(100svh - 80px)"
			bg="gray.100/70"
			justify="center"
			align="center"
		>
			<VStack flexGrow={1} justify="center" gap={4}>
				<LoginPanel />
			</VStack>
		</Flex>
	);
}
