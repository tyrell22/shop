import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { jwtConfig } from "./config";

// Types for decoded token
export type DecodedToken = {
  id: number;
  email: string;
  name: string;
  isAdmin?: boolean;
  exp: number;
};

// Function to get the decoded token from request
export async function getDecodedToken(request: NextRequest | null = null): Promise<DecodedToken | null> {
  // If we have a request, get the token from it
  // Otherwise, get it from the cookies API (for API routes)
  const token = request 
    ? request.cookies.get(jwtConfig.cookieName)?.value
    : cookies().get(jwtConfig.cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    // Verify the token
    const decoded = verify(token, jwtConfig.secret) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

// Middleware for requiring authenticated user
export async function requireAuth(request: NextRequest | null = null) {
  const decoded = await getDecodedToken(request);

  if (!decoded) {
    return {
      success: false,
      status: 401,
      message: "Not authenticated"
    };
  }

  return {
    success: true,
    user: decoded
  };
}

// Middleware for requiring admin user
export async function requireAdmin(request: NextRequest | null = null) {
  const authResult = await requireAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  if (!authResult.user.isAdmin) {
    return {
      success: false,
      status: 403, 
      message: "Unauthorized: Admin access required"
    };
  }

  return {
    success: true,
    user: authResult.user
  };
}

// Middleware function for Next.js middleware.ts
export async function authMiddleware(request: NextRequest) {
  const decoded = await getDecodedToken(request);
  
  if (!decoded) {
    // Redirect to login
    const path = request.nextUrl.pathname;
    
    // If it's an admin path, redirect to admin login
    if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // Otherwise redirect to regular login
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // Check if admin route requires admin privileges
  if ((request.nextUrl.pathname.startsWith("/admin") || 
       request.nextUrl.pathname.startsWith("/api/admin")) && 
      !decoded.isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  
  return NextResponse.next();
}