import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-middleware";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
    }

    // Check admin authentication
    const authResult = await requireAdmin();
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    // Delete the user
    const result = await query("DELETE FROM users WHERE id = $1", [userId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user", error: String(error) },
      { status: 500 }
    );
  }
}