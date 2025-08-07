"use client";

import { AvatarFallback, AvatarRoot, SkeletonCircle } from "@chakra-ui/react";
import useSession from "@/lib/session/context/useSession";

export default function UserAvatar() {
	const session = useSession();

	if (!session.loggedIn) return null;

	if (!session.userInfo) return <SkeletonCircle h="30px" w="30px" />;

	return (
		<AvatarRoot h="32px" w="32px">
			<AvatarFallback name={session.userInfo.username} />
		</AvatarRoot>
	);
}
