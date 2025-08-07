"use client";

import { Icon, VStack } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { GrAppsRounded } from "react-icons/gr";
import Link from "@/components/ui/Link";
import { PiGraph } from "react-icons/pi";

export default function DashboardSidebar() {
	return (
		<VStack
			borderWidth={1}
			borderStyle="solid"
			borderColor="gray.300/40"
			boxShadow="xs"
			backgroundColor="white"
			rounded="md"
			width={320}
			align="start"
			gap={0}
			flexShrink={0}
			py={3}
			px={3}
		>
			<SidebarItem
				icon={<BsPersonCircle />}
				label="Profile"
				matcher="/"
				href="/"
			/>
			<SidebarItem
				icon={<GrAppsRounded />}
				label="Apps"
				matcher="/apps/**"
				href="/apps"
			/>
			<SidebarItem
				icon={<PiGraph />}
				label="Connections"
				matcher="/connections/**"
				href="/connections"
			/>
		</VStack>
	);
}

function SidebarItem({
	icon,
	label,
	matcher,
	href,
}: {
	icon: ReactNode;
	label: string;
	matcher: string;
	href: string;
}) {
	const path = usePathname();
	const active = matchRoute(matcher, path);

	const activeColor = "blue.500/20";

	return (
		<Link
			href={href}
			px={4}
			py={3}
			rounded="md"
			fontSize="lg"
			textDecor="none"
			w="full"
			bg={{
				base: active ? activeColor : undefined,
				_hover: active ? activeColor : "gray.200/50",
			}}
			color={{
				base: active ? "blue.800" : undefined,
			}}
			focusRing="inside"
			focusRingColor="gray.300"
		>
			<Icon mr={2} fontSize="3xl">
				{icon}
			</Icon>
			{label}
		</Link>
	);
}

/**
 * Checks whether a given route string matches a route matcher.
 *
 * Supports two types of matchers:
 * - Exact match: routes must match exactly (e.g. "/", "/app", "/app/page")
 * - Wildcard match: matcher ends with "/\*\*" and matches any subpath
 *   (e.g. "/app/\*\*" matches "/app", "/app/page", "/app/page/subpage", etc.)
 *
 * Trailing slashes are ignored for matching purposes (except for the root "/").
 *
 */
function matchRoute(matcher: string, route: string) {
	// Normalize: remove trailing slashes (except for root "/")
	const normalize = (str: string) =>
		str.length > 1 ? str.replace(/\/+$/, "") : str;

	route = normalize(route);
	matcher = normalize(matcher);

	if (matcher.endsWith("/**")) {
		const base = matcher.slice(0, -3); // remove "/**"
		return route === base || route.startsWith(`${base}/`);
	}

	return route === matcher;
}
