import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
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
    
    const { subscriptionId } = await request.json();
    if (!subscriptionId) {
      return NextResponse.json({ success: false, message: "Subscription ID is required" }, { status: 400 });
    }

    // Verify the subscription belongs to the user (unless admin)
    if (!authResult.user.isAdmin) {
      const ownershipCheck = await query(
        "SELECT COUNT(*) as count FROM subscriptions WHERE id = $1 AND user_id = $2",
        [subscriptionId, authResult.user.id]
      );
      
      if (ownershipCheck.rows[0].count === '0') {
        return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
      }
    }

    const result = await query(
      "UPDATE subscriptions SET status = 'canceled', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [subscriptionId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, subscription: result.rows[0] });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ success: false, message: "Failed to cancel subscription" }, { status: 500 });
  }
}