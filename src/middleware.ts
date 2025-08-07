import { type NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session/_experimental/getSession";

const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
	if (ADMIN_ROUTES.some((r) => request.nextUrl.pathname.startsWith(r))) {
		const data = await getSession();

		if (data?.role !== "admin") {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
