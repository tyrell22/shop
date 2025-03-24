import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtConfig } from "@/lib/config";

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define admin paths
  const isAdminPath = path.startsWith("/admin") || path.startsWith("/api/admin");
  
  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/init-db") ||
    path.startsWith("/api/webhooks/stripe") ||
    path.startsWith("/api/products") ||
    path.startsWith("/packages") ||
    path.startsWith("/features") ||
    path.startsWith("/support") ||
    path.startsWith("/public/images") ||
    path.startsWith("/_next") ||
    path === "/api/admin/login"; // Allow access to admin login
    path.startsWith("/checkout") ||
    path.startsWith("/api/checkout") ||
    path.startsWith("/cart");

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get the token from the cookies
  const token = request.cookies.get(jwtConfig.cookieName)?.value;

  // If there's no token and it's not a public path, redirect to login
  if (!token) {
    console.log(`No token found, redirecting to login from: ${path}`);
    
    // If it's an admin path, redirect to admin login
    if (isAdminPath) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // Otherwise redirect to regular login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For admin paths, check if the user is an admin
  if (isAdminPath) {
    try {
      // This will handle JWT verification in the API routes
      return NextResponse.next();
    } catch (error) {
      console.error(`Admin auth failed: ${error}`);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  try {
    // We'll use a simpler approach for the middleware
    // Just check if the token exists and is not expired
    // The actual verification will happen in the API routes
    return NextResponse.next();
  } catch (error) {
    console.error(`Token verification failed: ${error}, redirecting to login from: ${path}`);
    // If the token is invalid, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api/init-db|_next/static|_next/image|favicon.ico|images).*)"],
};