import { Flex, Spinner } from "@chakra-ui/react";

export default function LoadingSpinnerPage() {
	return (
		<Flex
			direction="column"
			minH="calc(100svh - 80px)"
			bg="gray.100/70"
			justify="center"
			align="center"
		>
			<Spinner size="xl" color="blue.600" />
		</Flex>
	);
}
