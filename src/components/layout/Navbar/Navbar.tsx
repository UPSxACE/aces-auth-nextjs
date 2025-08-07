import { HStack, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FaGithub, FaShieldAlt } from "react-icons/fa";
import Logout from "./Logout";

export default function Navbar() {
	return (
		<HStack
			flexWrap="wrap"
			as="header"
			paddingX={20}
			paddingY={5}
			minH={"80px"}
			borderBottomWidth={2}
			borderStyle="solid"
			borderBottomColor="gray.300/50"
		>
			<Text
				asChild
				textStyle="2xl"
				fontWeight="bold"
				display="flex"
				alignItems="start"
			>
				<Link href="/">
					<Text textStyle="3xl" mb={1} mr={1} color="blue.800">
						<FaShieldAlt />
					</Text>
					Ace&apos;s Auth
				</Link>
			</Text>
			<Link
				href="https://github.com/UPSxACE/aces-auth"
				style={{ marginLeft: "auto" }}
				target="_blank"
			>
				<Icon fontSize="3xl">
					<FaGithub />
				</Icon>
			</Link>
			<Logout />
		</HStack>
	);
}
