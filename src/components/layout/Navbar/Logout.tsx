"use client";
import { IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import useSession from "@/lib/session/context/useSession";
import useLogout from "@/lib/session/useLogout";

export default function Logout() {
	const router = useRouter();
	const session = useSession();
	const { logout } = useLogout();

	if (!session.loggedIn) return null;

	return (
		<IconButton
			variant="plain"
			fontSize="3xl"
			onClick={() => {
				logout();
				router.push("/");
			}}
			css={{
				"& svg": {
					width: "auto",
					height: "auto",
				},
			}}
			color="blue.800"
			height="36px"
		>
			<IoLogOutOutline />
		</IconButton>
	);
}
