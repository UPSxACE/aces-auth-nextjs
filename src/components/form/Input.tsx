import {
	Input as ChakraInput,
	type InputProps as ChakraInputProps,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
} from "@chakra-ui/react";
import type { RefAttributes } from "react";

export type InputProps = {
	label: string;
	invalid: boolean;
	error?: string | null;
} & ChakraInputProps &
	RefAttributes<HTMLInputElement>;

export default function Input({ label, invalid, error, ...props }: InputProps) {
	return (
		<FieldRoot invalid={invalid}>
			<FieldLabel fontWeight="medium">{label}</FieldLabel>
			<ChakraInput
				backgroundColor={
					props.readOnly && !props.backgroundColor
						? "gray.100/70"
						: props.backgroundColor
				}
				{...props}
			/>
			<FieldErrorText>{error}</FieldErrorText>
		</FieldRoot>
	);
}
