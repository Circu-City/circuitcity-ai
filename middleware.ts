import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/middleware-auth";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/auth/"];
const protectedRoutes = ["/dashboard", "/onboarding", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  const session = token ? verifyToken(token) : null;

  if (isProtected && !session) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (pathname.startsWith("/admin") && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (session && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/|api/public/).*)",
  ],
};