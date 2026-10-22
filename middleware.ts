import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to protected dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Read session cookie
  const sessionCookie = request.cookies.get("publicore_session")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("error", "session_required");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie));
    const userRole = session.role;

    // 1. Admin Dashboard Route Guard
    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("required", "admin");
      unauthorizedUrl.searchParams.set("current", userRole);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // 2. Editor Dashboard Route Guard
    if (pathname.startsWith("/dashboard/editor") && userRole !== "editor" && userRole !== "admin") {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("required", "editor");
      unauthorizedUrl.searchParams.set("current", userRole);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // 3. Reviewer Dashboard Route Guard
    if (pathname.startsWith("/dashboard/reviewer") && userRole !== "reviewer" && userRole !== "admin" && userRole !== "editor") {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("required", "reviewer");
      unauthorizedUrl.searchParams.set("current", userRole);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // 4. Production Dashboard Route Guard
    if (pathname.startsWith("/dashboard/production") && userRole !== "production" && userRole !== "admin") {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("required", "production");
      unauthorizedUrl.searchParams.set("current", userRole);
      return NextResponse.redirect(unauthorizedUrl);
    }

    return NextResponse.next();
  } catch (err) {
    // Corrupted session cookie
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("error", "invalid_session");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
