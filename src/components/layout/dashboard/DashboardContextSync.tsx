"use client";

import { Spinner, VStack } from "@chakra-ui/react";
import { type ReactNode, useEffect } from "react";
import { useDashboardLayout } from "@/app/(dashboard)/layout";
import IllegalClientStateError from "@/lib/utils/errors/IllegalClientStateError";
// import useSession from "@/lib/session/context/useSession";

export default function DashboardContextSync({
	title,
	actions,
	backButton,
	children,
}: {
	title: string;
	actions?: ReactNode;
	backButton?: boolean;
	children: React.ReactNode;
}) {
	const { state, setState } = useDashboardLayout();

	useEffect(() => {
		setState({ title, actions, backButton });

		return () => {
			setState((s) => ({
				...s,
				// title: null,
				actions: null,
			}));
		};
	}, [setState, title, actions, backButton]);

	if (!state) {
		return (
			<VStack flexGrow={1} justify="center" gap={0} paddingY={4}>
				<Spinner size="xl" color="blue.600" />
			</VStack>
		);
	}

	return children;
}
