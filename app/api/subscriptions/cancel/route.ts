import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();
    if (!subscriptionId) {
      return NextResponse.json({ success: false, message: "Subscription ID is required" }, { status: 400 });
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
