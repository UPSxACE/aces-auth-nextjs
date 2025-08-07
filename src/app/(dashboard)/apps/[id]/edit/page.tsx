"use client";

import { Button, Spinner, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import api from "@/api/client";
import type { App } from "@/api/types";
import FormAlert from "@/components/form/FormAlert";
import DashboardContextSync from "@/components/layout/dashboard/DashboardContextSync";
import { Form } from "@/components/pages/edit-app/Form";
import useFormState from "@/components/pages/edit-app/useFormState";
import PrivatePage from "@/components/utils/PrivatePage";

export default function EditApp({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);

	const { data, isPending } = useQuery({
		queryKey: ["apps", id],
		queryFn: () => api.getApp(id),
	});

	return (
		<PrivatePage>
			{isPending || !data ? <ContentSuspense /> : <Content app={data.data} />}
		</PrivatePage>
	);
}

function Content({ app }: { app: App }) {
	const formState = useFormState(app);
	const { isPending, formHasErrors, errorMessage } = formState;
	return (
		<DashboardContextSync
			title="Apps"
			backButton
			actions={
				<Button
					type="submit"
					form="edit-app-form"
					colorPalette="green"
					size="sm"
					loading={isPending}
					disabled={isPending || formHasErrors}
				>
					Save
				</Button>
			}
		>
			<Form state={formState}>
				<VStack w="full" align="stretch" gap={1}>
					<Text fontSize="2xl" fontWeight="semibold" mb={1}>
						Edit app
					</Text>
					<FormAlert errorMessage={errorMessage} mt={2} />
				</VStack>
			</Form>
		</DashboardContextSync>
	);
}

function ContentSuspense() {
	return (
		<VStack flexGrow={1} justify="center" gap={0} paddingY={4}>
			<Spinner size="xl" color="blue.600" />
		</VStack>
	);
}
