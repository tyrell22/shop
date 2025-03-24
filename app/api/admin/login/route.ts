import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { jwtConfig } from "@/lib/config";
import { verifyAdminCredentials } from "@/lib/admin-middleware";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Verify admin credentials
    const isValidAdmin = verifyAdminCredentials(username, password);
    
    if (!isValidAdmin) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create a JWT token with admin flag
    const payload = {
      id: 0, // Admin doesn't need a user ID
      name: "Admin",
      email: "admin@example.com",
      isAdmin: true,
      exp: Math.floor(Date.now() / 1000) + jwtConfig.expiresIn,
    };

    const token = jwt.sign(payload, jwtConfig.secret, { algorithm: "HS256" });

    // Set the token in a cookie
    cookies().set({
      name: jwtConfig.cookieName,
      value: token,
      ...jwtConfig.cookieOptions
    });

    return NextResponse.json({
      success: true,
      message: "Admin login successful"
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to login" },
      { status: 500 }
    );
  }
}