import {
	Textarea as ChakraTextarea,
	type TextareaProps as ChakraTextareaProps,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	Text,
} from "@chakra-ui/react";
import type { RefAttributes } from "react";

export type TextareaProps = {
	description?: string;
	label: string;
	invalid: boolean;
	error?: string | null;
} & ChakraTextareaProps &
	RefAttributes<HTMLTextAreaElement>;

export default function Textarea({
	description,
	label,
	invalid,
	error,
	...props
}: TextareaProps) {
	return (
		<FieldRoot invalid={invalid}>
			<FieldLabel fontWeight="medium">{label}</FieldLabel>
			{description && <Text fontSize="sm">{description}</Text>}
			<ChakraTextarea
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
