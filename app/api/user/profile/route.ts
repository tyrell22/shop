import { type NextRequest, NextResponse } from "next/server";
import { getUserById, updateUserProfile } from "@/lib/user-service";
import { requireAuth } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    // Get the user from the database
    const user = await getUserById(authResult.user.id);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Return the user without sensitive information
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user profile", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ success: false, message: "Name and email are required" }, { status: 400 });
    }

    // Update the user profile
    const updatedUser = await updateUserProfile(authResult.user.id, name, email);

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "Failed to update user profile" }, { status: 500 });
    }

    // Return the updated user
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user profile", error: String(error) },
      { status: 500 }
    );
  }
}