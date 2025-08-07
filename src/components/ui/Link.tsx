import { Link as ChakraLink, type LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import IllegalClientStateError from "@/lib/utils/errors/IllegalClientStateError";

export default function Link(props: LinkProps) {
	const { href, ...otherProps } = props;

	if (!href) {
		throw new IllegalClientStateError();
	}

	return (
		<ChakraLink asChild {...otherProps}>
			<NextLink href={href}>{props.children}</NextLink>
		</ChakraLink>
	);
}
