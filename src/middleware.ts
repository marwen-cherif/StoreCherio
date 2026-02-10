import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;
    const { pathname } = nextUrl;

    // Protect /admin routes
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/auth/signin", nextUrl));
        }
        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            // Redirect unauthorized users to home page
            return NextResponse.redirect(new URL("/", nextUrl));
        }
    }

    // Protect /account routes
    if (pathname.startsWith("/account")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/auth/signin", nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    // Matcher ignoring static files and images
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
