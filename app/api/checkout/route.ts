import { type NextRequest, NextResponse } from "next/server";
import { createOrder, addOrderItem } from "@/lib/order-service";
import { createSubscription } from "@/lib/subscription-service";
import { getProductById } from "@/lib/product-service";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { addDays } from "date-fns";
import { generateOrderConfirmationEmail, sendEmail } from "@/lib/email-service";
import { sql } from "@vercel/postgres"; // Import sql directly
import { jwtConfig } from "@/lib/config";

export async function POST(request: NextRequest) {
  console.log("Checkout request received");

  try {
    const token = cookies().get(jwtConfig.cookieName)?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = verify(token, jwtConfig.secret) as { id: number; email: string; name: string };
    console.log("User:", decoded);

    // Rest of the function remains the same

    const { productId, paymentMethod } = await request.json();
    console.log("Request body:", { productId, paymentMethod });
    if (!productId || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Product ID and payment method are required" },
        { status: 400 }
      );
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    console.log("Product:", product);

    // Run all database operations in a transaction
    const result = await sql.transaction(async (tx) => {
      const orderResult = await tx.query(
        "INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES ($1, $2, $3, $4) RETURNING *",
        [decoded.id, product.price, "completed", paymentMethod]
      );
      const order = orderResult.rows[0];
      console.log("Order created:", order);

      const orderItemResult = await tx.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
        [order.id, product.id, 1, product.price]
      );
      const orderItem = orderItemResult.rows[0];
      console.log("Order item added:", orderItem);

      const startDate = new Date();
      const endDate = addDays(startDate, product.duration_days);
      console.log("Subscription dates:", { startDate, endDate });
      const subscriptionResult = await tx.query(
        "INSERT INTO subscriptions (user_id, product_id, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [decoded.id, product.id, startDate, endDate, "active"]
      );
      const subscription = subscriptionResult.rows[0];
      console.log("Subscription created:", subscription);

      return { order, subscription };
    });

    console.log("Transaction committed");

    // Send confirmation email after transaction
    const emailTemplate = generateOrderConfirmationEmail(decoded.name, {
      orderId: result.order.id,
      productName: product.name,
      price: product.price,
      duration: product.duration_days,
      startDate: new Date(result.subscription.start_date),
      endDate: new Date(result.subscription.end_date),
    });
    console.log("Sending email to:", decoded.email);
    const emailResult = await sendEmail(decoded.email, emailTemplate);
    if (!emailResult.success) {
      console.error("Email failed:", emailResult.message, emailResult.error);
    } else {
      console.log("Email sent successfully");
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      subscription: result.subscription,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process checkout", error: String(error) },
      { status: 500 }
    );
  }
}
