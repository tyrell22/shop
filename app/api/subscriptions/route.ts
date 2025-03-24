import { type NextRequest, NextResponse } from "next/server";
import {
  getUserSubscriptions,
  getActiveUserSubscriptions,
  getExpiredUserSubscriptions,
} from "@/lib/subscription-service";
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

    // Get the filter parameter
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    let subscriptions;

    if (filter === "active") {
      subscriptions = await getActiveUserSubscriptions(authResult.user.id);
    } else if (filter === "expired") {
      subscriptions = await getExpiredUserSubscriptions(authResult.user.id);
    } else {
      subscriptions = await getUserSubscriptions(authResult.user.id);
    }

    return NextResponse.json({ success: true, subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subscriptions", error: String(error) },
      { status: 500 }
    );
  }
}