import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword } from "@/lib/user-service"
import { cookies } from "next/headers"

// Get the JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    console.log(`Attempting login for email: ${email}`)

    // Get the user
    const user = await getUserByEmail(email)
    if (!user) {
      console.log(`User not found for email: ${email}`)
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(user, password)
    if (!isPasswordValid) {
      console.log(`Invalid password for email: ${email}`)
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    console.log(`Login successful for user: ${user.id}`)

    // Create a simple JWT token
    // In a production app, you would use a proper JWT library
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    }

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64")
    const base64Header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64")

    // In a real app, you would sign this properly
    // This is a simplified version for demonstration
    const token = `${base64Header}.${base64Payload}.signature`

    // Set the token in a cookie
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    })

    // Return the user without password
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Failed to login", error: String(error) }, { status: 500 })
  }
}

