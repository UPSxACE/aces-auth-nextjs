import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
} from "react";
import MissingProviderError from "@/lib/utils/errors/MissingProviderError";

export type DashboardLayoutState = {
	title: string | null;
	actions: ReactNode | null;
	backButton?: boolean;
};

type DashboardLayoutContextValue = {
	state: DashboardLayoutState;
	setState: Dispatch<SetStateAction<DashboardLayoutState>>;
} | null;

const DashboardLayoutContext = createContext<DashboardLayoutContextValue>(null);

export function useDashboardLayout() {
	const context = useContext(DashboardLayoutContext);
	if (!context) {
		throw new MissingProviderError(useDashboardLayout, DashboardLayoutContext);
	}
	return context;
}

export const DashboardLayoutContextProvider = DashboardLayoutContext.Provider;
