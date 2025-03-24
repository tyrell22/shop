import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendEmail, generateM3uUpdateEmail } from "@/lib/email-service";
import { getUserById } from "@/lib/user-service";
import { getProductById } from "@/lib/product-service";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { jwtConfig } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = cookies().get(jwtConfig.cookieName)?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    // Verify the token
    const decoded = verify(token, jwtConfig.secret) as { 
      id: number; 
      email: string; 
      name: string;
      isAdmin?: boolean;
    };

    // Check if user is admin
    if (!decoded.isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }
    
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

    const updatedSubscription = result.rows[0];
    const user = await getUserById(updatedSubscription.user_id);
    const product = await getProductById(updatedSubscription.product_id);

    if (user && product) {
      const emailTemplate = generateM3uUpdateEmail(user.name, {
        subscriptionId: updatedSubscription.id,
        productName: product.name,
        startDate: new Date(updatedSubscription.start_date),
        endDate: new Date(updatedSubscription.end_date),
        m3uUrl,
      });
      const emailResult = await sendEmail(user.email, emailTemplate);
      if (!emailResult.success) {
        console.error("Failed to send M3U update email:", emailResult.message);
        // Continue despite email failure to avoid blocking the update
      }
    }

    return NextResponse.json({ success: true, subscription: updatedSubscription });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json({ success: false, message: "Failed to update subscription" }, { status: 500 });
  }
}