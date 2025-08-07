import { Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import Link from "@/components/ui/Link";

export default function Success() {
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
					Registration complete
				</Text>
				<Icon fontSize="8em" color="green.700">
					<IoIosCheckmarkCircleOutline />
				</Icon>
				<Text fontSize="xl" fontWeight="normal">
					Your account has been created successfully
				</Text>
				<Link fontSize="xl" colorPalette="blue" href="/" fontWeight="medium">
					Log in now
				</Link>
			</VStack>
		</Flex>
	);
}
