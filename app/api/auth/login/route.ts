import { type NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/user-service";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; 
import { jwtConfig } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    console.log(`Attempting login for email: ${email}`);

    // Get the user
    const user = await getUserByEmail(email);
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(user, password);
    if (!isPasswordValid) {
      console.log(`Invalid password for email: ${email}`);
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    console.log(`Login successful for user: ${user.id}`);

    // Create a JWT token using jsonwebtoken
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + jwtConfig.expiresIn,
    };

    const token = jwt.sign(payload, jwtConfig.secret, { algorithm: "HS256" });

    // Set the token in a cookie
    cookies().set({
      name: jwtConfig.cookieName,
      value: token,
      ...jwtConfig.cookieOptions
    });

    // Return the user without password
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Failed to login", error: String(error) }, { status: 500 });
  }
}