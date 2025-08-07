"use client";
import {
	Button,
	DialogBackdrop,
	DialogBody,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPositioner,
	DialogRoot,
	DialogTitle,
	Portal,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import FormAlert from "@/components/form/FormAlert";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import DashboardContextSync from "@/components/layout/dashboard/DashboardContextSync";
import { Form } from "@/components/pages/create-app/Form";
import useFormState, {
	type PostMutationData,
} from "@/components/pages/create-app/useFormState";
import { toaster } from "@/components/ui/chakra/toaster";
import PrivatePage from "@/components/utils/PrivatePage";

export default function CreateApp() {
	const formState = useFormState();
	const { postMutationData, isPending, errorMessage, formHasErrors } =
		formState;

	return (
		<PrivatePage>
			<DashboardContextSync
				title="Apps"
				actions={
					<Button
						type="submit"
						form="create-app-form"
						colorPalette="green"
						size="sm"
						loading={isPending}
						disabled={formHasErrors}
					>
						Save
					</Button>
				}
				backButton
			>
				<PostMutationDialog postMutationData={postMutationData} />
				<Form state={formState}>
					<VStack w="full" align="stretch" gap={1}>
						<Text fontSize="2xl" fontWeight="semibold" mb={1}>
							Create a new app
						</Text>
						<Text fontSize="md" fontWeight="normal" color="gray.900/80">
							Register a new OAuth application to securely integrate with our
							platform. Provide details like the app name, redirect URI, and
							permissions to get started.
						</Text>
						<FormAlert errorMessage={errorMessage} mt={2} />
					</VStack>
				</Form>
			</DashboardContextSync>
		</PrivatePage>
	);
}

function PostMutationDialog({
	postMutationData,
}: {
	postMutationData: PostMutationData | null;
}) {
	const router = useRouter();

	return (
		<DialogRoot lazyMount open={postMutationData !== null} size="lg">
			<Portal>
				<DialogBackdrop />
				<DialogPositioner>
					<DialogContent>
						<DialogHeader>
							<DialogTitle fontSize="xl">App created</DialogTitle>
						</DialogHeader>
						<DialogBody>
							<Text>
								This is the only time you’ll be able to view the client secret.
							</Text>
							<Text mb={6}>
								Please <strong>copy and store it securely</strong> — you won’t
								be able to see it again.
							</Text>
							<Input
								readOnly
								invalid={false}
								label="Client ID"
								value={postMutationData?.clientId || ""}
								mb={3}
							/>
							<PasswordInput
								readOnly
								invalid={false}
								label="Client Secret"
								value={postMutationData?.clientSecret || ""}
							/>
						</DialogBody>
						<DialogFooter>
							<Button
								backgroundColor={{
									base: "blue.800",
									_hover: "blue.900",
								}}
								colorPalette="blue"
								onClick={() => {
									toaster.create({
										title: "Created app successfully.",
										type: "success",
									});
									router.push("/apps");
								}}
							>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</DialogPositioner>
			</Portal>
		</DialogRoot>
	);
}
