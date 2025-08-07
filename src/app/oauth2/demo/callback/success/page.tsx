"use client";

import { Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import api from "@/api/client";
import type { PublicAppInfo } from "@/api/types";
import LoadingSpinnerPage from "@/components/layout/LoadingSpinnerPage";
import Link from "@/components/ui/Link";
import useOnce from "@/lib/utils/react/useOnce";

export default function DemoCallbackSuccess() {
	const [appInfo, setAppInfo] = useState<PublicAppInfo | null>(null);

	const params = useSearchParams();
	const clientId = params.get("client_id");

	const router = useRouter();

	useOnce(() => {
		if (!clientId) return router.push("/");

		api
			.getAppInfo(clientId, ["openid", "profile"])
			.then(({ data }) => {
				if (!data.authorized) throw new Error();
				setAppInfo(data);
			})
			.catch(() => {
				router.push("/");
			});
	});

	if (!appInfo) return <LoadingSpinnerPage />;

	return (
		<Flex
			direction="column"
			minH="calc(100svh - 80px)"
			bg="gray.100/70"
			justify="center"
			align="center"
		>
			<VStack flexGrow={1} justify="center" gap={4} paddingY={4}>
				<Text fontSize="2xl" fontWeight="bold">
					Demonstration complete
				</Text>
				<Icon fontSize="8em" color="green.700">
					<IoIosCheckmarkCircleOutline />
				</Icon>
				<Text fontSize="xl" fontWeight="normal">
					Your account has been connected to{" "}
					<Text as="strong" fontWeight="semibold">
						{appInfo.name}
					</Text>
				</Text>
				<Link
					fontSize="xl"
					colorPalette="blue"
					href="/connections"
					fontWeight="medium"
				>
					Check connections
				</Link>
			</VStack>
		</Flex>
	);
}
