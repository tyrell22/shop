import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { jwtConfig } from "./config";

// Admin credentials (in a real app, these should be stored in a database)
const ADMIN_USERNAME = "frano";
const ADMIN_PASSWORD = "franoIPTVadmin";

export async function adminAuthMiddleware(request: NextRequest) {
  // Check if it's a login request
  if (request.nextUrl.pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // For all other admin routes, verify the token
  const token = cookies().get(jwtConfig.cookieName)?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  try {
    // Verify the token
    const decoded = verify(token, jwtConfig.secret) as { 
      id: number; 
      email: string; 
      name: string;
      isAdmin?: boolean;
    };

    // Check if user is admin
    if (!decoded.isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // If everything is good, proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Error verifying admin token:", error);
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 401 });
  }
}

// Helper function to verify admin credentials
export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}