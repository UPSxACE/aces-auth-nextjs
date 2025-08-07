import { cookies } from "next/headers";
import { SessionProviderInternal } from "./SessionProviderInternal";

export default async function SessionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookiesStore = await cookies();

	return (
		<SessionProviderInternal loggedInDefault={cookiesStore.has("refreshToken")}>
			{children}
		</SessionProviderInternal>
	);
}
