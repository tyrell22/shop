import { type NextRequest, NextResponse } from "next/server"
import { getUserById, verifyPassword, changePassword } from "@/lib/user-service"
import { getAuthUserId } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    // Get the user ID from the token
    const userId = await getAuthUserId(request)

    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Get the request body
    const { currentPassword, newPassword } = await request.json()

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required" },
        { status: 400 },
      )
    }

    // Get the user with password hash
    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Verify the current password
    const isPasswordValid = await verifyPassword(user, currentPassword)

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 401 })
    }

    // Change the password
    const success = await changePassword(user.id, newPassword)

    if (!success) {
      return NextResponse.json({ success: false, message: "Failed to change password" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json(
      { success: false, message: "Failed to change password", error: String(error) },
      { status: 500 },
    )
  }
}

