import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { jwtConfig } from "@/lib/config"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)

    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 })
    }

    // Get the token from cookies
    const token = cookies().get(jwtConfig.cookieName)?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, jwtConfig.secret) as { 
      id: number; 
      email: string; 
      name: string;
      isAdmin?: boolean;
    }

    // Check if user is admin
    if (!decoded.isAdmin) {
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