import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value || localStorage.getItem("token");
    const { pathname } = req.nextUrl;

    // Allow access to the login page and API routes without authentication
    if (pathname.startsWith("/login") || pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // Redirect to login if not authenticated
    if (!token) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Define the paths the middleware should apply to
export const config = {
    matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
