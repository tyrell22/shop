import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authMiddleware } from "@/lib/auth-middleware";

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/admin/login" ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/init-db") ||
    path.startsWith("/api/admin/login") ||
    path.startsWith("/api/webhooks/stripe") ||
    path.startsWith("/api/products") ||
    path.startsWith("/packages") ||
    path.startsWith("/features") ||
    path.startsWith("/support") ||
    path.startsWith("/public/images") ||
    path.startsWith("/_next");

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Use the centralized auth middleware
  return authMiddleware(request);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api/init-db|_next/static|_next/image|favicon.ico|images).*)"],
};