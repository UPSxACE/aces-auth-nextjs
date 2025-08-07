import type { ReactNode } from "react";
import GuestOnlyPageComponent from "@/lib/session/context/GuestOnlyPage";
import LoadingSpinnerPage from "../layout/LoadingSpinnerPage";

export default function GuestOnlyPage({ children }: { children: ReactNode }) {
	return (
		<GuestOnlyPageComponent fallback={<LoadingSpinnerPage />}>
			{children}
		</GuestOnlyPageComponent>
	);
}
