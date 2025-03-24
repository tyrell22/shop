import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { jwtConfig } from "@/lib/config"

// Helper function to check if user is admin
async function isAdmin(userId: number): Promise<boolean> {
  // In a real app, you would check if the user has admin role
  // For this demo, we'll consider user with ID 1 as admin
  return userId === 1
}

export async function GET() {
  try {
    // Get the token from cookies
    const token = cookies().get(jwtConfig.cookieName)?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, jwtConfig.secret) as { id: number; email: string; name: string }

    // Check if user is admin
    const admin = await isAdmin(decoded.id)

    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Get all users
    const result = await query("SELECT id, name, email, created_at FROM users ORDER BY id ASC")

    return NextResponse.json({ success: true, users: result.rows })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: String(error) },
      { status: 500 },
    )
  }
}