import type { ReactNode } from "react";
import PrivatePageComponent from "@/lib/session/context/PrivatePage";
import LoadingSpinnerPage from "../layout/LoadingSpinnerPage";

export default function PrivatePage({ children }: { children: ReactNode }) {
	return (
		<PrivatePageComponent fallback={<LoadingSpinnerPage />}>
			{children}
		</PrivatePageComponent>
	);
}
