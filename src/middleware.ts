import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/login", "/signup", "/api/auth/login", "/api/auth/signup",
  "/features", "/pricing", "/documentation", "/api-docs",
  "/about-us", "/blog", "/careers", "/contact",
  "/privacy", "/terms", "/gdpr", "/security",
  "/book-demo", "/contact-sales",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Allow all public marketing pages
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow API auth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow static files and landing page
  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Require auth for dashboard, admin, and onboarding
  if (
    !token &&
    (pathname.startsWith("/dashboard") ||
     pathname.startsWith("/admin") ||
     pathname.startsWith("/onboarding"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};