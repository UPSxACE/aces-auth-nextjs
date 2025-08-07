import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "@/components/ui/chakra/provider";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/chakra/toaster";
import SessionProvider from "@/lib/session/context/SessionProvider";
import IncompatibleScreenWrapper from "@/lib/utils/react/IncompatibleScreenWrapper";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Ace's Auth",
	description: "Plug-and-play sign-in, roles, and permissions for your app",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.className}`} suppressHydrationWarning>
			<body>
				<QueryProvider>
					<Provider>
						<SessionProvider>
							<IncompatibleScreenWrapper>
								<Navbar />
								{children}
							</IncompatibleScreenWrapper>
							<Toaster />
						</SessionProvider>
					</Provider>
				</QueryProvider>
			</body>
		</html>
	);
}
