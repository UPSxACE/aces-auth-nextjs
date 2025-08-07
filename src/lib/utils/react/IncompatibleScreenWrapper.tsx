import { Center, Flex, Icon, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { PiSmileySadLight } from "react-icons/pi";

export default function IncompatibleScreenWrapper({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<>
			<Center
				display={{ xl: "none" }}
				bg="gray.200/50"
				minH="100svh"
				flexDirection="column"
				gap={3}
				color="gray.700"
			>
				<Icon fontSize="12rem" color="gray.600">
					<PiSmileySadLight />
				</Icon>
				<Text fontSize="lg">
					Sorry, this project is optimized for desktop screens only.
				</Text>
				<Text fontSize="lg">
					Please access it on a device with a larger screen.
				</Text>
				<Text fontSize="lg">
					I'm focusing on backend development right now!
				</Text>
				<Text fontSize="lg">Thanks for understanding.</Text>
			</Center>
			<Flex display={{ xlDown: "none" }}>{children}</Flex>
		</>
	);
}
