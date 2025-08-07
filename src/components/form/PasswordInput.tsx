import {
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	type InputProps,
} from "@chakra-ui/react";
import type { RefAttributes } from "react";
import { PasswordInput as ChakraPasswordInput } from "../ui/chakra/password-input";

export default function PasswordInput({
	label,
	invalid,
	error,
	...props
}: {
	label: string;
	invalid: boolean;
	error?: string | null;
} & InputProps &
	RefAttributes<HTMLInputElement>) {
	return (
		<FieldRoot invalid={invalid}>
			<FieldLabel fontWeight="medium">{label}</FieldLabel>
			<ChakraPasswordInput {...props} />
			<FieldErrorText>{error}</FieldErrorText>
		</FieldRoot>
	);
}
