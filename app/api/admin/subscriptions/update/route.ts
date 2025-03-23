import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, m3uUrl } = await request.json();
    if (!subscriptionId || !m3uUrl) {
      return NextResponse.json({ success: false, message: "Subscription ID and M3U URL are required" }, { status: 400 });
    }

    const result = await query(
      "UPDATE subscriptions SET m3u_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [m3uUrl, subscriptionId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, subscription: result.rows[0] });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json({ success: false, message: "Failed to update subscription" }, { status: 500 });
  }
}
