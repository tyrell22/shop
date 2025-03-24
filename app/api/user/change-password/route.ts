import { type NextRequest, NextResponse } from "next/server";
import { getUserById, verifyPassword, changePassword } from "@/lib/user-service";
import { requireAuth } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    // Get the request body
    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Get the user with password hash
    const user = await getUserById(authResult.user.id);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Verify the current password
    const isPasswordValid = await verifyPassword(user, currentPassword);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 401 });
    }

    // Change the password
    const success = await changePassword(user.id, newPassword);

    if (!success) {
      return NextResponse.json({ success: false, message: "Failed to change password" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { success: false, message: "Failed to change password", error: String(error) },
      { status: 500 }
    );
  }
}