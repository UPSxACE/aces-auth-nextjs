import LoadingSpinnerPage from "@/components/layout/LoadingSpinnerPage";
import CallbackPageComponent, {
	type CallbackPageProps,
} from "@/lib/oauth/components/CallbackPage";

export default function CallbackPage(
	props: Omit<CallbackPageProps, "children">,
) {
	return (
		<CallbackPageComponent {...props}>
			<LoadingSpinnerPage />
		</CallbackPageComponent>
	);
}
