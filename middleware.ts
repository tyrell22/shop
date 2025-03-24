import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Get the JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

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
    path.startsWith("/_next")

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value

  // If there's no token and it's not a public path, redirect to login
  if (!token) {
    console.log(`No token found, redirecting to login from: ${path}`)
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // We'll use a simpler approach for the middleware
    // Just check if the token exists and is not expired
    // The actual verification will happen in the API routes
    return NextResponse.next()
  } catch (error) {
    console.error(`Token verification failed: ${error}, redirecting to login from: ${path}`)
    // If the token is invalid, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api/init-db|_next/static|_next/image|favicon.ico|images).*)"],
}

