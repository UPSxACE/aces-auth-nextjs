import { Flex, Spinner } from "@chakra-ui/react";

export default function LoadingSpinnerContent() {
	return (
		<Flex direction="column" justify="center" align="center" h="100%" w="100%">
			<Spinner size="xl" color="blue.600" />
		</Flex>
	);
}
