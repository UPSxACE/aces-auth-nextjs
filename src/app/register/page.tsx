import { Flex, VStack } from "@chakra-ui/react";
import RegisterPanel from "@/components/pages/home/RegisterPanel";
import GuestOnlyPage from "@/components/utils/GuestOnlyPage";

export default function Register() {
	return (
		<GuestOnlyPage>
			<Flex
				direction="column"
				minH="calc(100svh - 80px)"
				bg="gray.100/70"
				justify="center"
				align="center"
			>
				<VStack flexGrow={1} justify="center" gap={4} paddingY={4}>
					<RegisterPanel />
				</VStack>
			</Flex>
		</GuestOnlyPage>
	);
}
