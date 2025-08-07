"use client";

import {
	Button,
	Flex,
	Grid,
	GridItem,
	HStack,
	Show,
	Skeleton,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useState,
} from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import DashboardSidebar from "@/components/layout/dashboard/DashboardSidebar";
import useSession from "@/lib/session/context/useSession";
import MissingProviderError from "@/lib/utils/errors/MissingProviderError";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();

	const [state, setState] = useState<DashboardLayoutState>({
		title: null,
		actions: null,
	});

	const session = useSession();

	if (!session.loggedIn) return children;

	return (
		<DashboardLayoutContext.Provider value={{ state, setState }}>
			<Flex
				direction="row"
				minH="calc(100svh - 80px)"
				bg="gray.100/70"
				justify="center"
				align={session.loggedIn ? "stretch" : "center"}
			>
				<VStack w="full" maxW={1400} py={6} gap={4}>
					<Grid
						templateColumns="320px auto 1fr"
						w="full"
						alignContent="center"
						alignItems="center"
						gap={6}
						h={9}
					>
						<GridItem>
							{state.title ? (
								<Text fontSize="2xl" fontWeight="semibold">
									{state.title}
								</Text>
							) : (
								<Skeleton height={9} w={320} />
							)}
						</GridItem>
						<GridItem>
							{state.title ? (
								<Show when={state.backButton}>
									<Button
										unstyled
										display="flex"
										alignItems="center"
										cursor="pointer"
										textDecoration={{
											_hover: "underline",
										}}
										textUnderlineOffset="5px"
										onClick={() => router.back()}
										gap={1}
										fontSize="xl"
										fontWeight="medium"
										mb={1}
									>
										<Text fontSize={"4xl"}>
											<IoIosArrowRoundBack />
										</Text>
										Go Back
									</Button>
								</Show>
							) : (
								<Skeleton h={9} w={320} />
							)}
						</GridItem>
						<GridItem ml="auto">
							{state.title === null && (
								<HStack gap={4}>
									<Skeleton h={9} w={320} />
								</HStack>
							)}
							{state.actions && <HStack gap={4}>{state.actions}</HStack>}
						</GridItem>
					</Grid>
					<HStack w="full" flexGrow={1} align="start" gap={6}>
						<DashboardSidebar />
						<VStack
							borderWidth={1}
							borderStyle="solid"
							borderColor="gray.300/40"
							boxShadow="xs"
							backgroundColor="white"
							rounded="md"
							h="full"
							flexGrow={1}
							align="stretch"
							pos="relative"
						>
							<VStack
								pos="absolute"
								h="full"
								w="full"
								padding={5}
								overflowY="auto"
								align="stretch"
							>
								<ContentSuspense loading={session.loading}>
									{children}
								</ContentSuspense>
							</VStack>
						</VStack>
					</HStack>
				</VStack>
			</Flex>
		</DashboardLayoutContext.Provider>
	);
}

function ContentSuspense({
	loading,
	children,
}: {
	loading: boolean;
	children: ReactNode;
}) {
	if (loading)
		return (
			<VStack flexGrow={1} justify="center" gap={0} paddingY={4}>
				<Spinner size="xl" color="blue.600" />
			</VStack>
		);

	return children;
}

type DashboardLayoutState = {
	title: string | null;
	actions: ReactNode | null;
	backButton?: boolean;
};

type DashboardLayoutContextValue = {
	state: DashboardLayoutState;
	setState: Dispatch<SetStateAction<DashboardLayoutState>>;
} | null;

const DashboardLayoutContext = createContext<DashboardLayoutContextValue>(null);

export function useDashboardLayout() {
	const context = useContext(DashboardLayoutContext);
	if (!context) {
		throw new MissingProviderError(useDashboardLayout, DashboardLayoutContext);
	}
	return context;
}
