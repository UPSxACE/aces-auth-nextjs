import { Button, type ButtonProps, type LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import IllegalClientStateError from "@/lib/utils/errors/IllegalClientStateError";

export default function LinkButton({
	href,
	...props
}: ButtonProps & LinkProps) {
	if (!href) {
		throw new IllegalClientStateError();
	}

	return (
		<Button asChild fontSize="sm" {...props}>
			<NextLink href={href}>{props.children}</NextLink>
		</Button>
	);
}
