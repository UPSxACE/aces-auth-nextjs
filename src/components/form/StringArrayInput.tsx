"use client";
import {
	Button,
	Input as ChakraInput,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	HStack,
	IconButton,
	VStack,
} from "@chakra-ui/react";
import { type FieldValues, type Path, useFormContext } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import type { InputProps } from "./Input";

export default function StringArrayInput<T extends FieldValues>({
	fieldName,
	invalid,
	label,
	error,
	fields,
	append,
	remove,
	...props
}: {
	fieldName: Path<T>;
	fields: { id: string }[];
	append: (newValue: { value: string }) => void;
	remove: (index: number) => void;
} & InputProps) {
	const { register, clearErrors } = useFormContext<T>();

	return (
		<VStack w="full">
			<FieldRoot invalid={invalid}>
				<FieldLabel fontWeight="medium">{label}</FieldLabel>
				<VStack w="full" align="start">
					{fields.map((field, index) => (
						<HStack w="full" key={field.id}>
							<ChakraInput
								backgroundColor={
									props.readOnly && !props.backgroundColor
										? "gray.100/70"
										: props.backgroundColor
								}
								{...register(`${fieldName}.${index}.value` as Path<T>)}
								{...props}
								onChange={(e) => {
									clearErrors(fieldName);
									register(`${fieldName}.${index}.value` as Path<T>).onChange(
										e,
									);
								}}
							/>
							{fields.length > 1 && (
								<IconButton
									variant="outline"
									color="red.500"
									onClick={() => remove(index)}
								>
									<FaRegTrashAlt />
								</IconButton>
							)}
						</HStack>
					))}
					<FieldErrorText>{error}</FieldErrorText>
					<Button
						variant="outline"
						colorPalette="blue"
						size="sm"
						pl={2}
						pr={3}
						onClick={() => append({ value: "" })}
					>
						<FiPlus />
						Add another
					</Button>
				</VStack>
			</FieldRoot>
		</VStack>
	);
}
