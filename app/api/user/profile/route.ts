import { type NextRequest, NextResponse } from "next/server"
import { getUserById, updateUserProfile } from "@/lib/user-service"
import { getAuthUserId } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the token
    const userId = await getAuthUserId(request)

    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Get the user from the database
    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Return the user without sensitive information
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch user profile", error: String(error) },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get the user ID from the token
    const userId = await getAuthUserId(request)

    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Get the request body
    const { name, email } = await request.json()

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ success: false, message: "Name and email are required" }, { status: 400 })
    }

    // Update the user profile
    const updatedUser = await updateUserProfile(userId, name, email)

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "Failed to update user profile" }, { status: 500 })
    }

    // Return the updated user
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update user profile", error: String(error) },
      { status: 500 },
    )
  }
}

