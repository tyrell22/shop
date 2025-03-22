import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Helper function to check if user is admin
async function isAdmin(userId: number): Promise<boolean> {
  // In a real app, you would check if the user has admin role
  // For this demo, we'll consider user with ID 1 as admin
  return userId === 1
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)

    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 })
    }

    // Get the token from cookies
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: number; email: string; name: string }

    // Check if user is admin
    const admin = await isAdmin(decoded.id)

    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Delete the user
    const result = await query("DELETE FROM users WHERE id = $1", [userId])

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete user", error: String(error) },
      { status: 500 },
    )
  }
}

