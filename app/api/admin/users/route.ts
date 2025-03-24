import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-middleware";

export async function GET() {
  try {
    // Check admin authentication
    const authResult = await requireAdmin();
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    // Get all users
    const result = await query("SELECT id, name, email, created_at FROM users ORDER BY id ASC");

    return NextResponse.json({ success: true, users: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: String(error) },
      { status: 500 }
    );
  }
}